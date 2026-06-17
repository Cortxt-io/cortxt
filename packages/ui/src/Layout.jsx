export function Container({ className = '', children, ...rest }) {
  return <div className={`cx-container ${className}`.trim()} {...rest}>{children}</div>;
}

export function Section({ bordered = false, className = '', children, ...rest }) {
  const cls = `cx-section ${bordered ? 'cx-section--bordered' : ''} ${className}`.trim();
  return <section className={cls} {...rest}>{children}</section>;
}
