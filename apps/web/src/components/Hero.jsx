import { content } from '../data/content';

export default function Hero() {
  const { hero } = content;

  return (
    <section
      style={{
        padding: '5rem 1.5rem 4rem',
        maxWidth: '1100px',
        margin: '0 auto',
        textAlign: 'left',
      }}
    >
      {/* Headline */}
      <h1
        style={{
          fontSize: 'clamp(2rem, 4vw, 2.75rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          marginBottom: '1.25rem',
          color: 'var(--text)',
        }}
      >
        {hero.headline.map((line, i) => (
          <span key={i} style={{ display: 'block' }}>
            {line}
          </span>
        ))}
      </h1>

      {/* Subtext */}
      <p
        style={{
          fontSize: '1rem',
          color: 'var(--muted)',
          maxWidth: '540px',
          lineHeight: 1.7,
          marginBottom: '2rem',
        }}
      >
        {hero.subtext}
      </p>

      {/* CTA */}
      <a
        href="https://github.com/rian010194/cortxt"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.85rem',
          color: 'var(--accent)',
          textDecoration: 'none',
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => (e.target.style.color = 'var(--accent-h)')}
        onMouseLeave={(e) => (e.target.style.color = 'var(--accent)')}
      >
        View on GitHub →
      </a>
    </section>
  );
}
