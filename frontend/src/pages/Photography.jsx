import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { GradientMedia } from '../components/media/GradientMedia';
import { Lightbox } from '../components/media/Lightbox';
import { Reveal } from '../components/ui/Reveal';
import { getSectionBySlug, getSectionData, cleanText } from '../lib/content';
import ui from './section-ui.module.css';
import styles from './Photography.module.css';

const section = getSectionBySlug('photography');
const RATIO = { '3x2': '3 / 2', '2x3': '2 / 3', '1x1': '1 / 1' };

function Collection({ collection, onOpen }) {
  return (
    <section className={styles.collection} id={collection.slug}>
      <div className={styles.collHead}>
        <div>
          <h2 className={styles.collTitle}>{collection.title}</h2>
          <p className={styles.collSub}>{collection.subtitle}</p>
        </div>
        {collection.description && (
          <p className={styles.collDesc}>{cleanText(collection.description)}</p>
        )}
      </div>
      <div className={styles.gallery}>
        {collection.frames.map((frame, i) => (
          <button
            key={frame.id}
            type="button"
            className={styles.tile}
            style={{ '--tile-ratio': RATIO[frame.ratio] || '3 / 2' }}
            onClick={() => onOpen(i)}
            aria-label={`Open ${cleanText(frame.title) || 'photograph'} in viewer`}
          >
            <span className={styles.tileInner}>
              <GradientMedia media={frame} alt={cleanText(frame.title) || 'Photograph'} />
              <span className={styles.tileCap}>{cleanText(frame.title) || 'Untitled'}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function Photography() {
  const { collection: collectionSlug } = useParams();
  const data = getSectionData('photography');
  const [viewer, setViewer] = useState({ frames: [], index: null });

  const collections = collectionSlug
    ? data.collections.filter((c) => c.slug === collectionSlug)
    : data.collections;

  const openViewer = (frames) => (index) => setViewer({ frames, index });
  const closeViewer = () => setViewer((v) => ({ ...v, index: null }));

  return (
    <PageShell section={section}>
      <p className={ui.lead}>{data.intro}</p>

      <nav className={styles.filters} aria-label="Photography collections">
        <Link to="/photography" className={styles.filter} data-active={!collectionSlug}>
          All series
        </Link>
        {data.collections.map((c) => (
          <Link
            key={c.slug}
            to={`/photography/${c.slug}`}
            className={styles.filter}
            data-active={collectionSlug === c.slug}
          >
            {c.title}
          </Link>
        ))}
      </nav>

      {collections.map((c, i) => (
        <Reveal key={c.slug} delay={i * 0.05}>
          <Collection collection={c} onOpen={openViewer(c.frames)} />
        </Reveal>
      ))}

      <Lightbox
        frames={viewer.frames}
        index={viewer.index}
        onIndex={(index) => setViewer((v) => ({ ...v, index }))}
        onClose={closeViewer}
      />
    </PageShell>
  );
}

export default Photography;
