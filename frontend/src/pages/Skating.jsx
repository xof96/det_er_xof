import { PageShell } from '../components/layout/PageShell';
import { GradientMedia } from '../components/media/GradientMedia';
import { Reveal } from '../components/ui/Reveal';
import { Editable } from '../components/ui/Editable';
import { getSectionBySlug, getSectionData, cleanText } from '../lib/content';
import ui from './section-ui.module.css';
import styles from './Skating.module.css';

const section = getSectionBySlug('skating');

export function Skating() {
  const { intro, sessions } = getSectionData('skating');

  return (
    <PageShell section={section}>
      <p className={ui.lead}>{intro}</p>

      <div className={styles.sessions}>
        {sessions.map((s, i) => (
          <Reveal key={s.id} delay={i * 0.06}>
            <article className={styles.session} style={{ '--s-accent': s.accent }}>
              <div className={styles.media}>
                <GradientMedia media={s.cover} alt="" showTag />
              </div>
              <div className={styles.text}>
                <Editable as="h3" className={styles.title} value={s.title} />
                <div className={ui.metaLine}>
                  {s.spot ? <span>◍ {cleanText(s.spot)}</span> : <span className="editable-text">◍ add a spot</span>}
                  {s.date ? <span>{cleanText(s.date)}</span> : <span className="editable-text">add a date</span>}
                </div>
                <Editable as="p" className={styles.note} value={s.note} />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </PageShell>
  );
}

export default Skating;
