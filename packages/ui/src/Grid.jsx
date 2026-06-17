/** Simple responsive grid. cols: 2 | 3 (collapses to 1 column on mobile). */
export function Grid({ cols = 3, className = '', children, ...rest }) {
  return <div className={`cx-grid cx-grid--${cols} ${className}`.trim()} {...rest}>{children}</div>;
}
