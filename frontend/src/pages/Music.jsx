import { PageShell } from '../components/layout/PageShell';
import { GradientMedia } from '../components/media/GradientMedia';
import { Reveal } from '../components/ui/Reveal';
import { Editable } from '../components/ui/Editable';
import { getSectionBySlug, getSectionData } from '../lib/content';
import ui from './section-ui.module.css';
import styles from './Music.module.css';

const section = getSectionBySlug('music');

export function Music() {
  const data = getSectionData('music');
  const np = data.nowPlaying;

  return (
    <PageShell section={section}>
      <p className={ui.lead}>{data.intro}</p>

      <Reveal>
        <div className={styles.now} style={{ '--n-accent': np.accent }}>
          <div className={styles.pulse} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div>
            <span className={styles.nowLabel}>Now playing</span>
            <Editable as="h2" className={styles.nowTitle} value={np.title} />
            <Editable as="p" className={styles.nowArtist} value={np.artist} />
            <Editable as="p" className={styles.nowNote} value={np.note} />
          </div>
        </div>
      </Reveal>

      <section className={ui.block}>
        <h2 className={ui.sectionLabel}>Artists on rotation</h2>
        <div className={styles.artists}>
          {data.artists.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.05}>
              <article className={styles.artist} style={{ '--n-accent': a.accent }}>
                <span className={styles.artistDot} aria-hidden="true" />
                <Editable as="h3" className={styles.artistName} value={a.name} />
                <Editable as="p" className={styles.artistNote} value={a.note} />
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={ui.block}>
        <h2 className={ui.sectionLabel}>Records</h2>
        <div className={styles.records}>
          {data.records.map((r, i) => (
            <Reveal key={r.id} delay={i * 0.05}>
              <article className={styles.record}>
                <div className={styles.cover}>
                  <GradientMedia media={r.cover} alt="" showTag />
                </div>
                <Editable as="h3" className={styles.recTitle} value={r.title} />
                <Editable as="p" className={styles.recArtist} value={r.artist} />
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

export default Music;
