import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SectionCarousel } from '../components/carousel/SectionCarousel';
import { getSections } from '../lib/content';
import { useAtmosphere, atmosphereFromSection } from '../context/AtmosphereContext';
import styles from './Home.module.css';

const sections = getSections();

export function Home() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { setAtmosphere } = useAtmosphere();

  // Remember where the visitor was in the carousel when returning home.
  const [activeIndex, setActiveIndex] = useState(() => {
    const saved = Number(sessionStorage.getItem('atlas:activeIndex'));
    return Number.isInteger(saved) && saved >= 0 && saved < sections.length ? saved : 0;
  });
  const [overlay, setOverlay] = useState(null);
  const overlayTimer = useRef(null);

  const active = sections[activeIndex];

  // Drive the reactive background from the active card.
  useEffect(() => {
    setAtmosphere(atmosphereFromSection(active));
    sessionStorage.setItem('atlas:activeIndex', String(activeIndex));
  }, [active, activeIndex, setAtmosphere]);

  useEffect(() => () => clearTimeout(overlayTimer.current), []);

  const handleEnter = useCallback(
    (section, slotEl) => {
      if (!section) return;
      if (reduce || !slotEl) {
        navigate(section.route);
        return;
      }
      const rect = slotEl.getBoundingClientRect();
      setOverlay({ section, rect });
    },
    [navigate, reduce]
  );

  return (
    <>
      <SiteHeader />
      <main className={styles.home}>
        <div className={styles.intro} aria-live="polite">
          <span className={styles.introKicker}>{active.kicker}</span>
          <AnimatePresence mode="wait">
            <motion.p
              key={active.id}
              className={styles.introText}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {active.summary}
            </motion.p>
          </AnimatePresence>
        </div>

        <SectionCarousel
          sections={sections}
          activeIndex={activeIndex}
          onActiveChange={setActiveIndex}
          onEnter={handleEnter}
        />
      </main>

      <AnimatePresence>
        {overlay && (
          <motion.div
            className={styles.overlay}
            style={{
              '--c-accent': overlay.section.atmosphere.accent,
              '--c-from': overlay.section.atmosphere.from,
              '--c-mid': overlay.section.atmosphere.mid,
              '--c-to': overlay.section.atmosphere.to,
            }}
            initial={{
              top: overlay.rect.top,
              left: overlay.rect.left,
              width: overlay.rect.width,
              height: overlay.rect.height,
              borderRadius: 22,
            }}
            animate={{ top: 0, left: 0, width: '100vw', height: '100dvh', borderRadius: 0 }}
            transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }}
            onAnimationComplete={() => {
              navigate(overlay.section.route);
              overlayTimer.current = setTimeout(() => setOverlay(null), 60);
            }}
          >
            <div className={styles.overlayCover} />
            <motion.h2
              className={styles.overlayTitle}
              initial={{ opacity: 0.2, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              {overlay.section.title}
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Home;
