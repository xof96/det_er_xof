import { memo } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useAtmosphere } from '../../context/AtmosphereContext';
import styles from './BackgroundScene.module.css';

// Inline SVG grain — no network request, sits over every layer.
const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function BackgroundSceneBase() {
  const { atmosphere } = useAtmosphere();
  const reduce = useReducedMotion();

  const layerVars = {
    '--l-accent': atmosphere.accent,
    '--l-from': atmosphere.from,
    '--l-mid': atmosphere.mid,
    '--l-to': atmosphere.to,
  };

  const fade = reduce
    ? { duration: 0 }
    : { duration: 1.1, ease: [0.22, 1, 0.36, 1] };

  return (
    <div className={styles.scene} style={{ '--grain-url': GRAIN_URL }} aria-hidden="true">
      <AnimatePresence mode="sync">
        <motion.div
          key={atmosphere.id}
          className={styles.layer}
          style={layerVars}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fade}
        >
          <div className={styles.gradient} />
          {atmosphere.image && (
            <div
              className={styles.image}
              style={{ backgroundImage: `url(${atmosphere.image})` }}
            />
          )}
          <motion.div
            className={styles.bloom}
            animate={
              reduce
                ? undefined
                : { x: [0, 30, -10, 0], y: [0, 20, -14, 0], opacity: [0.6, 0.8, 0.55, 0.6] }
            }
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </AnimatePresence>
      <div className={styles.grain} />
      <div className={styles.vignette} />
    </div>
  );
}

export const BackgroundScene = memo(BackgroundSceneBase);
export default BackgroundScene;
