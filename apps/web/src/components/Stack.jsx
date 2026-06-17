import { content } from '../data/content';

export default function Stack() {
  const { categories } = content.stack;

  return (
    <section id="stack" className="section">
      <div className="container">
        <div className="center">
          <div className="section-label">Stack</div>
          <h2 className="section-title">Built with</h2>
          <p className="section-sub">Full-stack, polyglot, production-ready</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {categories
            .filter((cat) => cat.status !== 'coming_soon')
            .map((cat) => (
              <div
                key={cat.title}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  padding: '1rem 1.25rem',
                }}
              >
                <div
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.75rem',
                    color: 'var(--accent)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                    fontWeight: 500,
                  }}
                >
                  {cat.title}
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.8 }}>
                  {cat.items.join(' · ')}
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
