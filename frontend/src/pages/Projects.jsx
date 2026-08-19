import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { GradientMedia } from '../components/media/GradientMedia';
import { GitHubRepos } from '../components/github/GitHubRepos';
import { Reveal } from '../components/ui/Reveal';
import { getSectionBySlug, getProjects } from '../lib/content';
import ui from './section-ui.module.css';
import styles from './Projects.module.css';

const section = getSectionBySlug('projects');
const projects = getProjects();

const STATUS_LABEL = {
  live: 'Live',
  'in-development': 'In development',
  archived: 'Archived',
};

function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.slug}`} className={styles.card}>
      <div className={styles.cardMedia}>
        <GradientMedia media={project.cover} alt="" />
        <span className={styles.cardGlyph} aria-hidden="true">
          {project.cover?.glyph || '◆'}
        </span>
        {project.featured && <span className={styles.featuredBadge}>Featured</span>}
        {project.status && (
          <span className={styles.statusTag}>{STATUS_LABEL[project.status] || project.status}</span>
        )}
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{project.title}</h3>
        <p className={styles.cardTagline}>{project.tagline}</p>
        <div className={styles.cardFoot}>
          <div className={styles.techRow}>
            {(project.tech || []).slice(0, 3).map((t) => (
              <span key={t} className={styles.tech}>
                {t}
              </span>
            ))}
          </div>
          <span className={styles.open}>Open →</span>
        </div>
      </div>
    </Link>
  );
}

export function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <PageShell section={section}>
      {featured.length > 0 && (
        <section className={ui.block}>
          <h2 className={ui.sectionLabel}>Case studies</h2>
          <div className={`${ui.grid} ${ui.grid2}`}>
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className={ui.block}>
          <h2 className={ui.sectionLabel}>More work</h2>
          <div className={`${ui.grid} ${ui.grid3}`}>
            {rest.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.05}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <GitHubRepos />
    </PageShell>
  );
}

export default Projects;
