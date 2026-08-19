import { useRef, useState } from 'react';
import { api } from '../../lib/api';
import styles from './ContactForm.module.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ name, email, message }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Please add your name.';
  else if (name.trim().length > 100) errors.name = 'That name is a bit long.';
  if (!email.trim()) errors.email = 'Please add an email.';
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'That email doesn’t look right.';
  if (!message.trim()) errors.message = 'Please write a message.';
  else if (message.trim().length < 10) errors.message = 'A little more detail helps (10+ characters).';
  else if (message.trim().length > 2000) errors.message = 'Please keep it under 2000 characters.';
  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState({ name: '', email: '', message: '', website: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const startedAt = useRef(Date.now());

  const update = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus({ state: 'submitting', message: '' });
    try {
      await api.contact({
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
        website: values.website, // honeypot — backend rejects if filled
        elapsed_ms: Date.now() - startedAt.current,
      });
      setStatus({ state: 'success', message: '' });
    } catch (err) {
      const message =
        err.status === 429
          ? 'You’ve sent a few messages already — please try again in a little while.'
          : err.message || 'Something went wrong. Please try again.';
      setStatus({ state: 'error', message });
    }
  };

  if (status.state === 'success') {
    return (
      <div className={styles.sent} role="status">
        <h3 className={styles.sentTitle}>Message sent — thank you.</h3>
        <p className={styles.sentBody}>
          It’s been received. I’ll get back to you at the address you gave.
        </p>
        <button
          type="button"
          className={styles.again}
          onClick={() => {
            setValues({ name: '', email: '', message: '', website: '' });
            setStatus({ state: 'idle', message: '' });
            startedAt.current = Date.now();
          }}
        >
          Send another →
        </button>
      </div>
    );
  }

  const submitting = status.state === 'submitting';

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="cf-name">
          Name
        </label>
        <input
          id="cf-name"
          className={styles.input}
          type="text"
          value={values.name}
          onChange={update('name')}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'cf-name-err' : undefined}
          autoComplete="name"
        />
        {errors.name && (
          <span id="cf-name-err" className={styles.error}>
            {errors.name}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="cf-email">
          Email
        </label>
        <input
          id="cf-email"
          className={styles.input}
          type="email"
          value={values.email}
          onChange={update('email')}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'cf-email-err' : undefined}
          autoComplete="email"
        />
        {errors.email && (
          <span id="cf-email-err" className={styles.error}>
            {errors.email}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="cf-message">
          Message
        </label>
        <textarea
          id="cf-message"
          className={styles.textarea}
          value={values.message}
          onChange={update('message')}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'cf-message-err' : undefined}
          rows={6}
        />
        {errors.message && (
          <span id="cf-message-err" className={styles.error}>
            {errors.message}
          </span>
        )}
      </div>

      {/* Honeypot: hidden from humans, catches naive bots. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input
          id="cf-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={update('website')}
        />
      </div>

      <div className={styles.submitRow}>
        <button className={styles.submit} type="submit" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send message'}
        </button>
        {status.state === 'error' && (
          <span className={styles.status} data-kind="error" role="alert">
            {status.message}
          </span>
        )}
      </div>
    </form>
  );
}

export default ContactForm;
