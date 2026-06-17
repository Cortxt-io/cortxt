/** Surface card. Pass `as="a"` + href for a linkable card with hover affordance. */
export function Card({ as: Tag = 'div', link = false, className = '', children, ...rest }) {
  const cls = `cx-card ${link ? 'cx-card--link' : ''} ${className}`.trim();
  return <Tag className={cls} {...rest}>{children}</Tag>;
}
