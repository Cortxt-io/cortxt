import { content } from '../data/content';

export default function Hero() {
  const { hero, builder } = content;

  return (
    <section
      style={{
        position: 'relative',
        padding: '7rem 1.5rem 6rem',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Radial indigo gradient background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Badge */}
      <div
        style={{
          display: 'inline-block',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.75rem',
          color: 'var(--accent)',
          border: '1px solid var(--accent)',
          padding: '0.3rem 0.9rem',
          borderRadius: '9999px',
          marginBottom: '1.75rem',
          letterSpacing: '0.03em',
        }}
      >
        {hero.badge}
      </div>

      {/* Headline */}
      <h1
        style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          fontWeight: 800,
          letterSpacing: '-0.04em',
          lineHeight: 1.1,
          maxWidth: '720px',
          margin: '0 auto 1.5rem',
          color: 'var(--text)',
        }}
      >
        {hero.headline.map((line, i) => (
          <span key={i} style={{ color: i === 1 ? 'var(--accent)' : 'var(--text)', display: 'block' }}>
            {line}
          </span>
        ))}
      </h1>

      {/* Subtext */}
      <p
        style={{
          fontSize: '1.125rem',
          color: 'var(--muted)',
          maxWidth: '600px',
          margin: '0 auto 2.5rem',
          lineHeight: 1.75,
        }}
      >
        {hero.subtext}
      </p>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a
          href="#waitlist"
          style={{
            background: 'var(--accent)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.95rem',
            padding: '0.75rem 1.75rem',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.target.style.background = 'var(--accent-h)')}
          onMouseLeave={(e) => (e.target.style.background = 'var(--accent)')}
        >
          Request Early Access
        </a>
        <a
          href="#pipeline"
          style={{
            color: 'var(--muted)',
            fontSize: '0.95rem',
            padding: '0.75rem 1.25rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.target.style.color = 'var(--text)')}
          onMouseLeave={(e) => (e.target.style.color = 'var(--muted)')}
        >
          See how it works ↓
        </a>
      </div>
    </section>
  );
}
