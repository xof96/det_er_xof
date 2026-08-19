import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { SectionCard } from './SectionCard';
import { NavigationControls } from './NavigationControls';
import { SectionCounter } from './SectionCounter';
import styles from './SectionCarousel.module.css';

const WHEEL_THRESHOLD = 40;
const DRAG_SNAP_RATIO = 0.22; // fraction of a step needed to advance

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

/** Compute the transform/opacity/filter for a card at a continuous offset. */
function slotStyle(offset, { step, isMobile, reduce }) {
  const abs = Math.abs(offset);
  const capped = clamp(offset, -3, 3);
  const scale = clamp(1 - abs * 0.13, 0.6, 1);
  const rotateY = isMobile ? 0 : clamp(capped, -3, 3) * -7;
  const translateZ = isMobile ? 0 : -abs * 60;
  const opacity = abs >= 2.6 ? 0 : clamp(1 - abs * 0.34, 0, 1);
  const blur = abs < 0.6 ? 0 : Math.min((abs - 0.4) * 1.4, 3);
  const z = Math.round(200 - abs * 20);
  const visible = abs < 2.7;

  return {
    transform: `translate3d(${capped * step}px, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
    opacity,
    filter: reduce || blur === 0 ? 'none' : `blur(${blur}px)`,
    zIndex: z,
    pointerEvents: visible ? 'auto' : 'none',
    visibility: visible ? 'visible' : 'hidden',
    transition: 'none',
  };
}

export function SectionCarousel({ sections, activeIndex, onActiveChange, onEnter }) {
  const total = sections.length;
  const viewportRef = useRef(null);
  const reduce = useReducedMotion();

  const [metrics, setMetrics] = useState({ cardW: 340, step: 220, isMobile: false });
  const [dragOffset, setDragOffset] = useState(0); // in index units while dragging
  const [dragging, setDragging] = useState(false);

  // Measure viewport and derive card width + step.
  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return undefined;
    const measure = () => {
      const w = el.clientWidth || window.innerWidth;
      const isMobile = w <= 640;
      const cardW = isMobile
        ? Math.min(w * 0.76, 320)
        : clamp(w * 0.3, 300, 360);
      const step = isMobile ? cardW * 0.58 : cardW * 0.66;
      setMetrics({ cardW, step, isMobile });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const go = useCallback(
    (next) => {
      const target = clamp(next, 0, total - 1);
      if (target !== activeIndex) onActiveChange(target);
    },
    [activeIndex, total, onActiveChange]
  );

  const next = useCallback(() => go(activeIndex + 1), [go, activeIndex]);
  const prev = useCallback(() => go(activeIndex - 1), [go, activeIndex]);

  // --- Wheel / trackpad ---
  const wheelAcc = useRef(0);
  const wheelLock = useRef(false);
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return undefined;
    const onWheel = (e) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 2) return;
      e.preventDefault();
      if (wheelLock.current) return;
      wheelAcc.current += delta;
      if (Math.abs(wheelAcc.current) >= WHEEL_THRESHOLD) {
        wheelAcc.current > 0 ? next() : prev();
        wheelAcc.current = 0;
        wheelLock.current = true;
        setTimeout(() => (wheelLock.current = false), 260);
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [next, prev]);

  const getActiveSlotEl = useCallback(() => {
    const el = viewportRef.current;
    return el ? el.querySelector('[data-slot-active="true"]') : null;
  }, []);

  // --- Keyboard ---
  const onKeyDown = useCallback(
    (e) => {
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          next();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prev();
          break;
        case 'Home':
          e.preventDefault();
          go(0);
          break;
        case 'End':
          e.preventDefault();
          go(total - 1);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          onEnter?.(sections[activeIndex], getActiveSlotEl());
          break;
        default:
          break;
      }
    },
    [next, prev, go, total, onEnter, sections, activeIndex, getActiveSlotEl]
  );

  // --- Pointer drag / touch swipe ---
  const drag = useRef({ active: false, startX: 0, pointerId: null });
  const onPointerDown = useCallback((e) => {
    if (e.button != null && e.button !== 0) return;
    drag.current = { active: true, startX: e.clientX, pointerId: e.pointerId };
    setDragging(true);
    viewportRef.current?.setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (e) => {
      if (!drag.current.active) return;
      const dx = e.clientX - drag.current.startX;
      setDragOffset(-dx / metrics.step);
    },
    [metrics.step]
  );

  const endDrag = useCallback(
    (e) => {
      if (!drag.current.active) return;
      const dx = e.clientX - drag.current.startX;
      const moved = -dx / metrics.step;
      drag.current.active = false;
      setDragging(false);
      setDragOffset(0);
      if (Math.abs(moved) > DRAG_SNAP_RATIO) {
        go(activeIndex + Math.round(moved));
      }
    },
    [metrics.step, go, activeIndex]
  );

  const pos = activeIndex + (dragging ? dragOffset : 0);
  const transition = reduce
    ? 'none'
    : 'transform 520ms cubic-bezier(0.22,1,0.36,1), opacity 520ms cubic-bezier(0.22,1,0.36,1), filter 520ms ease';

  return (
    <div className={styles.carousel}>
      <div
        ref={viewportRef}
        className={styles.viewport}
        data-dragging={dragging}
        style={{ '--card-w': `${metrics.cardW}px` }}
        role="listbox"
        aria-label="Portfolio sections. Use arrow keys to browse, Enter to open."
        aria-activedescendant={`slot-${sections[activeIndex]?.id}`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className={styles.stage}>
          {sections.map((section, i) => {
            const offset = i - pos;
            const isActive = i === activeIndex;
            const style = slotStyle(offset, { ...metrics, reduce });
            if (!dragging) style.transition = transition;
            return (
              <div
                key={section.id}
                id={`slot-${section.id}`}
                className={styles.slot}
                data-slot-active={isActive}
                role="option"
                aria-selected={isActive}
                style={style}
              >
                <SectionCard
                  section={section}
                  active={isActive}
                  tabIndex={isActive ? 0 : -1}
                  ariaHidden={!isActive && Math.abs(offset) > 2.6}
                  onActivate={() => {
                    if (isActive) onEnter?.(section, getActiveSlotEl());
                    else go(i);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.controlsRow}>
        <NavigationControls
          onPrev={prev}
          onNext={next}
          canPrev={activeIndex > 0}
          canNext={activeIndex < total - 1}
        />
        <SectionCounter index={activeIndex} total={total} onSelect={go} />
      </div>

      <p className={styles.hintRow}>
        <kbd>←</kbd> <kbd>→</kbd> browse · <kbd>Enter</kbd> open · scroll or drag to explore
      </p>
    </div>
  );
}

export default SectionCarousel;
