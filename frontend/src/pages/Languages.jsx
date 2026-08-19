import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { PageShell } from '../components/layout/PageShell';
import { Reveal } from '../components/ui/Reveal';
import { Editable } from '../components/ui/Editable';
import { getSectionBySlug, getSectionData, isEditable, cleanText } from '../lib/content';
import ui from './section-ui.module.css';
import styles from './Languages.module.css';

const section = getSectionBySlug('languages');

function GreetingRotator({ words }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce || words.length < 2) return undefined;
    const id = setInterval(() => setI((n) => (n + 1) % words.length), 2200);
    return () => clearInterval(id);
  }, [reduce, words.length]);

  if (reduce) {
    return <span className={styles.greetWord}>{words[0]}</span>;
  }

  return (
    <span className={styles.greet} aria-hidden="true">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[i]}
          className={styles.greetWord}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Languages() {
  const data = getSectionData('languages');

  return (
    <PageShell section={section}>
      <div className={styles.greetRow}>
        <GreetingRotator words={data.greetings} />
        <span className="sr-only">A greeting that cycles through several languages.</span>
      </div>
      <p className={ui.lead}>{data.intro}</p>

      <div className={styles.cards}>
        {data.languages.map((lang, i) => (
          <Reveal key={lang.id} delay={i * 0.06}>
            <article className={styles.card} style={{ '--l-accent': lang.accent }}>
              <div className={styles.cardTop}>
                <div>
                  <h3 className={styles.name}>{lang.name}</h3>
                  <span className={styles.native}>{lang.native}</span>
                </div>
                <span className={styles.phrase} aria-hidden="true">
                  {lang.phrase}
                </span>
              </div>
              <div className={styles.level}>
                {isEditable(lang.level) ? (
                  <span className="editable-badge">{cleanText(lang.level)}</span>
                ) : (
                  <span className={styles.levelTag}>{lang.level}</span>
                )}
              </div>
              <Editable as="p" className={styles.rel} value={lang.relationship} />
              <Editable as="p" className={styles.note} value={lang.note} />
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className={`${ui.panel} ${styles.learning}`}>
          <h2 className={ui.panelTitle}>{data.learningNow.title}</h2>
          <Editable as="p" className={styles.learningBody} value={data.learningNow.body} />
        </div>
      </Reveal>
    </PageShell>
  );
}

export default Languages;
