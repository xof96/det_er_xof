import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { GradientMedia } from './GradientMedia';
import { cleanText } from '../../lib/content';
import styles from './Lightbox.module.css';

const RATIO = { '3x2': '3 / 2', '2x3': '2 / 3', '16x9': '16 / 9', '1x1': '1 / 1' };

/** Fullscreen photo viewer with keyboard + button navigation. */
export function Lightbox({ frames, index, onIndex, onClose }) {
  const reduce = useReducedMotion();
  const closeRef = useRef(null);
  const open = index != null && index >= 0;
  const frame = open ? frames[index] : null;

  const go = useCallback(
    (delta) => {
      const nextIdx = index + delta;
      if (nextIdx >= 0 && nextIdx < frames.length) onIndex(nextIdx);
    },
    [index, frames.length, onIndex]
  );

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, go, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.backdrop}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <div className={styles.stage}>
            <button
              type="button"
              ref={closeRef}
              className={styles.close}
              onClick={onClose}
              aria-label="Close viewer"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              className={`${styles.nav} ${styles.prev}`}
              onClick={() => go(-1)}
              disabled={index <= 0}
              aria-label="Previous photo"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <motion.div
              key={frame.id}
              className={styles.frame}
              style={{ '--frame-ratio': RATIO[frame.ratio] || '3 / 2' }}
              initial={reduce ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <GradientMedia media={frame} alt={cleanText(frame.title) || 'Photograph'} showTag />
            </motion.div>

            <button
              type="button"
              className={`${styles.nav} ${styles.next}`}
              onClick={() => go(1)}
              disabled={index >= frames.length - 1}
              aria-label="Next photo"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className={styles.caption}>
            <div className={styles.capText}>
              <span className={styles.capTitle}>{cleanText(frame.title) || 'Untitled'}</span>
              <span className={styles.capMeta}>
                {frame.location && <span>{cleanText(frame.location)}</span>}
                {frame.year && <span>{frame.year}</span>}
                {!frame.src && <span>placeholder — add your image</span>}
              </span>
            </div>
            <span className={styles.counter}>
              <b>{String(index + 1).padStart(2, '0')}</b> / {String(frames.length).padStart(2, '0')}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default Lightbox;
