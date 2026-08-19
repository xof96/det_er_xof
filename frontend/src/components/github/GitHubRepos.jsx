import { api } from '../../lib/api';
import { useAsync } from '../../lib/hooks';
import ui from '../../pages/section-ui.module.css';
import styles from './GitHubRepos.module.css';

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
  } catch {
    return '';
  }
}

/**
 * Renders a curated set of GitHub repositories enriched by the backend.
 * Fails silently (renders nothing) when the API is unavailable so the page
 * still works as a static build.
 */
export function GitHubRepos() {
  const { loading, error, data } = useAsync(() => api.githubRepos(), []);

  if (loading) {
    return (
      <section className={styles.wrap}>
        <h2 className={ui.sectionLabel}>From GitHub</h2>
        <p className={styles.empty}>Loading repositories…</p>
      </section>
    );
  }

  if (error) return null;

  const repos = data?.repos || [];
  if (repos.length === 0) return null;

  return (
    <section className={styles.wrap}>
      <h2 className={ui.sectionLabel}>From GitHub</h2>
      <div className={styles.repoGrid}>
        {repos.map((repo) => (
          <a
            key={repo.full_name}
            className={styles.repo}
            href={repo.url}
            target="_blank"
            rel="noreferrer noopener"
          >
            <div className={styles.repoHead}>
              <span className={styles.dot} aria-hidden="true" />
              <span className={styles.repoName}>{repo.name}</span>
            </div>
            {repo.description && <p className={styles.repoDesc}>{repo.description}</p>}
            <div className={styles.repoMeta}>
              {repo.language && <span>{repo.language}</span>}
              <span>★ {repo.stars ?? 0}</span>
              <span>⑂ {repo.forks ?? 0}</span>
              {repo.updated_at && <span>updated {formatDate(repo.updated_at)}</span>}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default GitHubRepos;
