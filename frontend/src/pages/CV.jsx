import { PageShell } from '../components/layout/PageShell';
import { Reveal } from '../components/ui/Reveal';
import { Editable } from '../components/ui/Editable';
import { getSectionBySlug, getSectionData, cleanText, isEditable } from '../lib/content';
import ui from './section-ui.module.css';
import styles from './CV.module.css';

const section = getSectionBySlug('cv');

function Entry({ title, org, start, end, location, note, bullets }) {
  return (
    <article className={styles.entry}>
      <div className={styles.entryTime}>
        <Editable value={start} /> — <Editable value={end} />
      </div>
      <div className={styles.entryMain}>
        <h3 className={styles.entryTitle}>
          <Editable value={title} />
        </h3>
        <div className={styles.entryOrg}>
          <Editable value={org} />
          {location && (
            <>
              {' · '}
              <Editable value={location} />
            </>
          )}
        </div>
        {note && <Editable as="p" className={styles.entryNote} value={note} />}
        {bullets && bullets.length > 0 && (
          <ul className={styles.bullets}>
            {bullets.map((b, i) => (
              <li key={i} className={isEditable(b) ? 'editable-text' : undefined}>
                {cleanText(b)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

export function CV() {
  const cv = getSectionData('cv');

  return (
    <PageShell section={section}>
      <Reveal>
        <div className={styles.card}>
          <div className={styles.identity}>
            <h2 className={styles.name}>
              <Editable value={cv.name} />
            </h2>
            <p className={styles.role}>
              <Editable value={cv.title} />
              {' · '}
              <Editable value={cv.location} />
            </p>
            <Editable as="p" className={styles.bio} value={cv.summary} />
          </div>
          <a className={styles.download} href={cv.pdf} download>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download PDF
          </a>
        </div>
      </Reveal>

      <section className={ui.block}>
        <h2 className={ui.sectionLabel}>Experience</h2>
        {cv.experience.map((e) => (
          <Reveal key={e.id}>
            <Entry
              title={e.role}
              org={e.org}
              start={e.start}
              end={e.end}
              location={e.location}
              bullets={e.bullets}
            />
          </Reveal>
        ))}
      </section>

      <section className={ui.block}>
        <h2 className={ui.sectionLabel}>Education</h2>
        {cv.education.map((e) => (
          <Reveal key={e.id}>
            <Entry title={e.program} org={e.org} start={e.start} end={e.end} note={e.note} />
          </Reveal>
        ))}
      </section>

      <section className={ui.block}>
        <h2 className={ui.sectionLabel}>Skills</h2>
        <div className={styles.skills}>
          {cv.skills.map((group) => (
            <Reveal key={group.group}>
              <div className={styles.skillGroup}>
                <h3 className={styles.skillGroupTitle}>{group.group}</h3>
                <div className={ui.tagRow}>
                  {group.items.map((item, i) => (
                    <span key={i} className="chip">
                      {cleanText(item)}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

export default CV;
