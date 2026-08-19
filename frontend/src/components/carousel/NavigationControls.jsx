import styles from './NavigationControls.module.css';

function Arrow({ dir }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NavigationControls({ onPrev, onNext, canPrev = true, canNext = true }) {
  return (
    <div className={styles.controls}>
      <button
        type="button"
        className={styles.btn}
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Previous section"
      >
        <Arrow dir="left" />
      </button>
      <button
        type="button"
        className={styles.btn}
        onClick={onNext}
        disabled={!canNext}
        aria-label="Next section"
      >
        <Arrow dir="right" />
      </button>
    </div>
  );
}

export default NavigationControls;
