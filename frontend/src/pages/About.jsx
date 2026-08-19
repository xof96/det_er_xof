import { PageShell } from '../components/layout/PageShell';
import { Reveal } from '../components/ui/Reveal';
import { Editable } from '../components/ui/Editable';
import { getSectionBySlug, getSectionData } from '../lib/content';
import ui from './section-ui.module.css';
import styles from './About.module.css';

const section = getSectionBySlug('about');

export function About() {
  const data = getSectionData('about');

  return (
    <PageShell section={section}>
      <Editable as="p" className={styles.lead} value={data.lead} />

      <div className={styles.chapters}>
        {data.chapters.map((ch, i) => (
          <Reveal key={ch.id} delay={i * 0.06}>
            <article className={styles.chapter} style={{ '--ch-accent': ch.accent }}>
              <span className={styles.chIndex} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h2 className={styles.chTitle}>{ch.title}</h2>
                <Editable as="p" className={styles.chBody} value={ch.body} />
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className={styles.threads}>
          <span className={ui.sectionLabel}>Threads that connect it all</span>
          <div className={ui.tagRow}>
            {data.threads.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </PageShell>
  );
}

export default About;
