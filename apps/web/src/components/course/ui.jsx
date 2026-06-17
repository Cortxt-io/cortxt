// Shared presentation primitives for the course landing.
// Colors come from the Tailwind tokens (bg/surface/border/text/muted/accent)
// defined in tailwind.config.js + styles/index.css.

export function Container({ className = '', children }) {
  return <div className={`mx-auto w-full max-w-[1100px] px-6 ${className}`}>{children}</div>;
}

export function Section({ id, className = '', children }) {
  return (
    <section id={id} className={`border-t border-border py-20 sm:py-24 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

export function Eyebrow({ children }) {
  return (
    <p className="mb-3 font-mono text-xs uppercase tracking-[0.1em] text-accent">{children}</p>
  );
}

export function SectionTitle({ children, className = '' }) {
  return (
    <h2 className={`text-3xl font-extrabold tracking-[-0.03em] text-text-bright sm:text-4xl ${className}`}>
      {children}
    </h2>
  );
}

export function Button({ href, variant = 'primary', children }) {
  const base =
    'inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold transition-colors no-underline';
  const styles =
    variant === 'primary'
      ? 'bg-accent text-white hover:bg-accent-h'
      : 'border border-border text-text hover:border-accent hover:text-text-bright';
  return (
    <a href={href} className={`${base} ${styles}`}>
      {children}
    </a>
  );
}
