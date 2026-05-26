import { content } from '../data/content';

const stats = [
  { top: 'Token cost',     bot: 'per decision' },
  { top: 'Context quality', bot: 'per session' },
  { top: 'Signal-to-noise', bot: 'across portfolio' },
];

export default function Vision() {
  return (
    <section id="vision" className="section">
      <div className="container center fade-in">
        <div className="section-label">Vision</div>
        <h2 className="section-title">Built for what's coming</h2>

        <p
          style={{
            fontSize: '1.25rem',
            color: 'var(--text)',
            maxWidth: '700px',
            margin: '0 auto 3.5rem',
            lineHeight: 1.75,
          }}
        >
          {content.vision}
        </p>

        {/* Stat cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.25rem',
            maxWidth: '700px',
            margin: '0 auto',
          }}
        >
          {stats.map((s) => (
            <div
              key={s.top}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '1.5rem 1.25rem',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.8rem',
                  color: 'var(--accent)',
                  fontWeight: 500,
                  marginBottom: '0.25rem',
                }}
              >
                {s.top}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{s.bot}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
