import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { SiteHeader } from './SiteHeader';
import { getSections } from '../../lib/content';
import { useAtmosphere, atmosphereFromSection } from '../../context/AtmosphereContext';
import styles from './PageShell.module.css';

const sections = getSections();

/**
 * Shared shell for every section page: sets the reactive atmosphere, renders a
 * cinematic hero, the page body, and prev/next section navigation.
 */
export function PageShell({ section, children }) {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { setAtmosphere } = useAtmosphere();

  useEffect(() => {
    setAtmosphere(atmosphereFromSection(section));
    window.scrollTo(0, 0);
  }, [section, setAtmosphere]);

  const idx = sections.findIndex((s) => s.id === section.id);
  const prev = idx > 0 ? sections[idx - 1] : sections[sections.length - 1];
  const next = idx < sections.length - 1 ? sections[idx + 1] : sections[0];

  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <div className={styles.page}>
      <SiteHeader onClose={() => navigate('/')} closeLabel="Atlas" />
      <motion.header className={styles.hero} {...fade}>
        <div className={styles.heroInner}>
          <span className={styles.heroKicker}>
            <span className={styles.heroIndex}>{section.index}</span>
            {section.kicker}
          </span>
          <h1 className={styles.title}>{section.title}</h1>
          <p className={styles.summary}>{section.summary}</p>
        </div>
      </motion.header>

      <main id="main" className={styles.body}>
        {children}
      </main>

      <nav className={styles.footerNav} aria-label="Section navigation">
        <div className={styles.toAtlas}>
          <Link to="/" className={styles.toAtlasBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
            Back to the atlas
          </Link>
        </div>
        <Link to={prev.route} className={styles.navLink}>
          <span className={styles.navLabel}>← {prev.index} Previous</span>
          <span className={styles.navTitle}>{prev.title}</span>
        </Link>
        <Link to={next.route} className={styles.navLink} data-align="right">
          <span className={styles.navLabel}>Next {next.index} →</span>
          <span className={styles.navTitle}>{next.title}</span>
        </Link>
      </nav>
    </div>
  );
}

export default PageShell;
