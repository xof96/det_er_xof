import { PageShell } from '../components/layout/PageShell';
import { GradientMedia } from '../components/media/GradientMedia';
import { Reveal } from '../components/ui/Reveal';
import { Editable } from '../components/ui/Editable';
import { getSectionBySlug, getSectionData } from '../lib/content';
import ui from './section-ui.module.css';
import styles from './Places.module.css';

const section = getSectionBySlug('places');

export function Places() {
  const data = getSectionData('places');

  return (
    <PageShell section={section}>
      <p className={ui.lead}>{data.intro}</p>

      <div className={styles.places}>
        {data.places.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.06}>
            <article className={styles.place} style={{ '--p-accent': p.accent }}>
              <div className={styles.media}>
                <GradientMedia media={p.cover} alt="" showTag />
                <span className={styles.kind}>{p.kind}</span>
              </div>
              <div className={styles.text}>
                <Editable as="h3" className={styles.name} value={p.name} />
                <Editable as="p" className={styles.story} value={p.story} />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </PageShell>
  );
}

export default Places;
