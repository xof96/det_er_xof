import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { SiteHeader } from '../components/layout/SiteHeader';
import { GradientMedia } from '../components/media/GradientMedia';
import { Editable } from '../components/ui/Editable';
import { getProjectBySlug, getSectionBySlug, isEditable, cleanText } from '../lib/content';
import { useAtmosphere, atmosphereFromSection } from '../context/AtmosphereContext';
import NotFound from './NotFound';
import styles from './ProjectDetail.module.css';

const section = getSectionBySlug('projects');

function TextSection({ label, value }) {
  if (!value) return null;
  return (
    <section className={styles.section}>
      <h2>{label}</h2>
      <Editable as="p" value={value} />
    </section>
  );
}

function ListSection({ label, items }) {
  if (!items || items.length === 0) return null;
  return (
    <section className={styles.section}>
      <h2>{label}</h2>
      <ul className={styles.list}>
        {items.map((item, i) => (
          <li key={i} className={isEditable(item) ? 'editable-text' : undefined}>
            {cleanText(item)}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { setAtmosphere } = useAtmosphere();
  const project = getProjectBySlug(slug);

  useEffect(() => {
    setAtmosphere(atmosphereFromSection(section));
    window.scrollTo(0, 0);
  }, [setAtmosphere]);

  if (!project) return <NotFound />;

  const cs = project.caseStudy || {};
  const fade = reduce
    ? {}
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

  return (
    <div className={styles.page}>
      <SiteHeader onClose={() => navigate('/projects')} closeLabel="Projects" />

      <motion.div className={styles.hero} {...fade}>
        <div className={styles.cover}>
          <GradientMedia media={project.cover} alt={`${project.title} cover`} />
          <span className={styles.coverGlyph} aria-hidden="true">
            {project.cover?.glyph || '◆'}
          </span>
        </div>
      </motion.div>

      <div className={styles.head}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/">Atlas</Link>
          <span aria-hidden="true">/</span>
          <Link to="/projects">Projects</Link>
          <span aria-hidden="true">/</span>
          <span>{project.title}</span>
        </nav>
        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.tagline}>{project.tagline}</p>

        <div className={styles.metaBar}>
          {project.role && (
            <span>
              Role · <strong>{project.role}</strong>
            </span>
          )}
          {project.year && (
            <span>
              Year · <strong>{project.year}</strong>
            </span>
          )}
          {project.status && (
            <span>
              Status · <strong>{project.status}</strong>
            </span>
          )}
        </div>

        <div className={styles.links}>
          <a
            className={styles.linkBtn}
            data-disabled={!project.links?.github}
            href={project.links?.github || '#'}
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub {project.links?.github ? '↗' : '— soon'}
          </a>
          <a
            className={styles.linkBtn}
            data-disabled={!project.links?.demo}
            href={project.links?.demo || '#'}
            target="_blank"
            rel="noreferrer noopener"
          >
            Live demo {project.links?.demo ? '↗' : '— soon'}
          </a>
        </div>
      </div>

      <article className={styles.body}>
        <TextSection label="Summary" value={project.summary} />
        <TextSection label="Context" value={cs.context} />
        <TextSection label="The problem" value={cs.problem} />
        <TextSection label="The idea" value={cs.idea} />
        <TextSection label="The solution" value={cs.solution} />
        <ListSection label="Goals" items={cs.goals} />
        <ListSection label="Technical decisions" items={cs.decisions} />
        <TextSection label="Architecture" value={cs.architecture} />
        <ListSection label="Challenges" items={cs.challenges} />
        <ListSection label="What I learned" items={cs.learnings} />

        {project.tech?.length > 0 && (
          <section className={styles.section}>
            <h2>Technologies</h2>
            <div className={styles.techWrap}>
              {project.tech.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
          </section>
        )}
      </article>

      <div className={styles.back}>
        <Link to="/projects" className="chip">
          ← All projects
        </Link>
      </div>
    </div>
  );
}

export default ProjectDetail;
