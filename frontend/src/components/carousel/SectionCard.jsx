import { motion } from 'framer-motion';
import styles from './SectionCard.module.css';

const GLYPHS = {
  projects: '◆',
  'ai-lab': '✳',
  photography: '◉',
  skating: '𐄷',
  languages: '⟐',
  music: '♪',
  places: '◈',
  about: '❋',
  cv: '▤',
  contact: '✉',
};

/**
 * A single section represented as a spatial card. Depth (scale / opacity / blur)
 * is applied by the carousel wrapper; this component owns the visual content.
 */
export function SectionCard({ section, active = false, onActivate, tabIndex = -1, ariaHidden }) {
  const a = section.atmosphere || {};
  const coverVars = {
    '--c-accent': a.accent,
    '--c-from': a.from,
    '--c-mid': a.mid,
    '--c-to': a.to,
  };

  return (
    <motion.button
      type="button"
      className={styles.card}
      style={coverVars}
      data-active={active}
      onClick={onActivate}
      tabIndex={tabIndex}
      aria-hidden={ariaHidden}
      aria-label={`${section.title} — ${section.summary}`}
      whileTap={active ? { scale: 0.985 } : undefined}
    >
      <div className={styles.cover} />
      <span className={styles.watermark} aria-hidden="true">
        {section.index}
      </span>
      <span className={styles.glyph} aria-hidden="true">
        {GLYPHS[section.id] || '◇'}
      </span>
      <span className={styles.avatar} aria-hidden="true" />
      <span className={styles.enterHint} aria-hidden="true">
        Enter ↵
      </span>
      <div className={styles.scrim} />
      <div className={styles.content}>
        <span className={styles.index}>
          {section.index} · {section.kicker}
        </span>
        <h3 className={styles.title}>{section.title}</h3>
        <span className={styles.subtitle}>{section.subtitle}</span>
      </div>
    </motion.button>
  );
}

export default SectionCard;
