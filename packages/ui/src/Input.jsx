export function Input({ className = '', ...rest }) {
  return <input className={`cx-input ${className}`.trim()} {...rest} />;
}
