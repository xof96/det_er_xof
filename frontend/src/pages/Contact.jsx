import { PageShell } from '../components/layout/PageShell';
import { ContactForm } from '../components/contact/ContactForm';
import { Reveal } from '../components/ui/Reveal';
import { getSectionBySlug, getSectionData, isEditable, cleanText } from '../lib/content';
import ui from './section-ui.module.css';
import styles from './Contact.module.css';

const section = getSectionBySlug('contact');

export function Contact() {
  const data = getSectionData('contact');
  const emailEditable = isEditable(data.email);

  return (
    <PageShell section={section}>
      <p className={ui.lead}>{data.intro}</p>

      <div className={styles.layout}>
        <div className={styles.channels}>
          <h2 className={ui.sectionLabel}>Direct</h2>
          <a
            className={styles.channel}
            href={emailEditable ? undefined : `mailto:${data.email}`}
            data-disabled={emailEditable}
          >
            <span className={styles.channelLabel}>Email</span>
            <span className={emailEditable ? 'editable-text' : styles.channelValue}>
              {cleanText(data.email)}
            </span>
          </a>
          {data.channels.map((ch) => {
            const editable = isEditable(ch.url);
            return (
              <a
                key={ch.id}
                className={styles.channel}
                href={editable ? undefined : ch.url}
                target={editable ? undefined : '_blank'}
                rel="noreferrer noopener"
                data-disabled={editable}
              >
                <span className={styles.channelLabel}>{ch.label}</span>
                <span className={editable ? 'editable-text' : styles.channelValue}>
                  {cleanText(ch.handle)}
                </span>
              </a>
            );
          })}
        </div>

        {data.form?.enabled && (
          <div className={styles.formWrap}>
            <h2 className={ui.sectionLabel}>Send a message</h2>
            <Reveal>
              <ContactForm />
            </Reveal>
            <p className={styles.formNote}>{data.form.note}</p>
          </div>
        )}
      </div>
    </PageShell>
  );
}

export default Contact;
