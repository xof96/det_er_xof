import { Link } from 'react-router-dom';
import styles from './SiteHeader.module.css';

export function SiteHeader({ onClose, closeLabel = 'Atlas' }) {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand} aria-label="Personal Atlas — home">
        <span className={styles.mark} aria-hidden="true" />
        <span className={styles.brandText}>
          <span className={styles.brandName}>Personal Atlas</span>
          <span className={styles.brandSub}>an atlas of things I do</span>
        </span>
      </Link>
      {onClose ? (
        <nav className={styles.nav}>
          <button type="button" className={styles.close} onClick={onClose}>
            <span className={styles.closeLabel}>{closeLabel}</span>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M18 6 6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </nav>
      ) : null}
    </header>
  );
}

export default SiteHeader;
