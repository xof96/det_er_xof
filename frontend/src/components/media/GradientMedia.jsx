import { useState } from 'react';
import styles from './GradientMedia.module.css';

/**
 * Renders a media descriptor: a real image when `src` is present (lazy-loaded,
 * fading in over its gradient placeholder), otherwise a gradient tile that
 * doubles as a clearly-editable placeholder.
 */
export function GradientMedia({ media = {}, alt = '', showTag = false }) {
  const [loaded, setLoaded] = useState(false);
  const vars = {
    '--m-accent': media.accent || 'var(--accent)',
    '--m-from': media.from || 'var(--atmos-mid)',
    '--m-to': media.to || 'var(--atmos-to)',
  };

  return (
    <div className={styles.media} style={vars}>
      <div className={styles.gradient} />
      {media.src && (
        <img
          className={styles.img}
          src={media.src}
          alt={alt}
          loading="lazy"
          decoding="async"
          data-loaded={loaded}
          onLoad={() => setLoaded(true)}
        />
      )}
      {showTag && !media.src && (
        <span className={`editable-badge ${styles.placeholderTag}`}>replace image</span>
      )}
    </div>
  );
}

export default GradientMedia;
