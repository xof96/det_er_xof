import { isEditable, cleanText } from '../../lib/content';

/**
 * Renders text from content. When the value is a placeholder (prefixed with the
 * editable marker) it renders in a muted, italic style with an optional badge so
 * the owner can see exactly what still needs replacing — never Lorem Ipsum.
 */
export function Editable({ value, as: Tag = 'span', badge = false, className = '', ...rest }) {
  const editable = isEditable(value);
  const text = cleanText(value);
  const classes = [className, editable ? 'editable-text' : ''].filter(Boolean).join(' ');

  return (
    <Tag className={classes} data-editable={editable || undefined} {...rest}>
      {text}
      {editable && badge ? <span className="editable-badge" style={{ marginLeft: '0.5rem' }}>editable</span> : null}
    </Tag>
  );
}

export default Editable;
