import styles from './SectionCounter.module.css';

export function SectionCounter({ index, total, onSelect }) {
  const pct = total > 1 ? ((index + 1) / total) * 100 : 100;
  return (
    <div className={styles.counter}>
      <span>
        <span className={styles.current}>{String(index + 1).padStart(2, '0')}</span>
        <span> / {String(total).padStart(2, '0')}</span>
      </span>
      <div className={styles.track} aria-hidden="true">
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
      <div className={styles.dots} role="tablist" aria-label="Sections">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            type="button"
            className={styles.dot}
            data-on={i === index}
            aria-label={`Go to section ${i + 1}`}
            aria-selected={i === index}
            role="tab"
            onClick={() => onSelect?.(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default SectionCounter;
