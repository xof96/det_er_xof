import { PageShell } from '../components/layout/PageShell';
import { Reveal } from '../components/ui/Reveal';
import { Editable } from '../components/ui/Editable';
import { getSectionBySlug, getSectionData } from '../lib/content';
import ui from './section-ui.module.css';
import styles from './AiLab.module.css';

const section = getSectionBySlug('ai-lab');

const STATUS = {
  exploring: 'Exploring',
  draft: 'Draft',
  template: 'Template',
  archived: 'Archived',
};

export function AiLab() {
  const { intro, experiments } = getSectionData('ai-lab');

  return (
    <PageShell section={section}>
      <p className={ui.lead}>{intro}</p>

      <div className={styles.list}>
        {experiments.map((exp, i) => (
          <Reveal key={exp.slug} delay={i * 0.06}>
            <article className={styles.exp} style={{ '--exp-accent': exp.accent }}>
              <div className={styles.expIndex} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className={styles.expMain}>
                <div className={styles.expHead}>
                  <h3 className={styles.expTitle}>{exp.title}</h3>
                  <span className={styles.kind}>{exp.kind}</span>
                  <span className={styles.status} data-status={exp.status}>
                    {STATUS[exp.status] || exp.status}
                  </span>
                </div>
                <Editable as="p" className={styles.expSummary} value={exp.summary} />
                <div className={ui.tagRow}>
                  {exp.tags.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
                {(exp.links?.repo || exp.links?.notebook) && (
                  <div className={styles.expLinks}>
                    {exp.links.repo && (
                      <a className={ui.link} href={exp.links.repo} target="_blank" rel="noreferrer noopener">
                        Repository ↗
                      </a>
                    )}
                    {exp.links.notebook && (
                      <a className={ui.link} href={exp.links.notebook} target="_blank" rel="noreferrer noopener">
                        Notebook ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </PageShell>
  );
}

export default AiLab;
