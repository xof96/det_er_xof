import { Link } from 'react-router-dom';
import { SiteHeader } from '../components/layout/SiteHeader';

export function NotFound() {
  return (
    <div style={{ minHeight: '100dvh', paddingTop: 'var(--header-h)' }}>
      <SiteHeader />
      <main
        id="main"
        style={{
          minHeight: '70dvh',
          display: 'grid',
          placeContent: 'center',
          textAlign: 'center',
          gap: '1rem',
          padding: '0 var(--gutter)',
        }}
      >
        <p className="kicker">Off the map</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-h1)' }}>
          404 — nothing here
        </h1>
        <p style={{ color: 'var(--ink-1)', maxWidth: '40ch', margin: '0 auto' }}>
          This corner of the atlas doesn’t exist yet.
        </p>
        <Link to="/" className="chip" style={{ justifySelf: 'center', marginTop: '0.5rem' }}>
          ← Back to the atlas
        </Link>
      </main>
    </div>
  );
}

export default NotFound;
