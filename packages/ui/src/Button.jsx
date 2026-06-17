/** Primary/secondary button. Renders as <a> when `href` is given, else <button>. */
export function Button({ variant = 'primary', href, className = '', children, ...rest }) {
  const cls = `cx-btn cx-btn--${variant} ${className}`.trim();
  if (href) {
    return <a href={href} className={cls} {...rest}>{children}</a>;
  }
  return <button className={cls} {...rest}>{children}</button>;
}
