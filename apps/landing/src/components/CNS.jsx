import { content } from '../data/content';

const { cns } = content;

export default function CNS() {
  return (
    <section id="cns" className="section">
      <div className="container">

        {/* ── Part 1: Intro ─────────────────────────────── */}
        <div style={{ marginBottom: '4rem' }}>
          <div className="section-label">{cns.label}</div>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              marginBottom: '1.5rem',
            }}
          >
            <span style={{ color: 'var(--text)' }}>{cns.title}</span>
            <br />
            <span style={{ color: 'var(--accent)' }}>{cns.titleAccent}</span>
          </h2>
          <p style={{ color: 'var(--muted)', maxWidth: '640px', marginBottom: '1rem', lineHeight: 1.75 }}>
            {cns.intro}
          </p>
          <p style={{ color: 'var(--muted)', maxWidth: '640px', lineHeight: 1.75 }}>
            {cns.intro2}
          </p>
        </div>

        {/* ── Part 2: Comparison cards ──────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
            marginBottom: '4rem',
          }}
        >
          {cns.comparison.map((item) => (
            <div
              key={item.tool}
              style={{
                background: 'var(--surface)',
                border: `1px solid ${item.highlight ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '4px',
                padding: '1.5rem',
              }}
            >
              {/* Tool header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                <span
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: item.highlight ? 'var(--accent)' : 'var(--text)',
                  }}
                >
                  {item.tool}
                </span>
              </div>
              {/* Knows label */}
              <div
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '0.5rem',
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                Knows:
              </div>
              {/* Content */}
              <p
                style={{
                  fontSize: '0.875rem',
                  color: item.highlight ? 'var(--text)' : 'var(--muted)',
                  fontStyle: item.highlight ? 'normal' : 'italic',
                  lineHeight: 1.65,
                }}
              >
                {item.knows}
              </p>
            </div>
          ))}
        </div>

        {/* ── Part 3: Knowledge layers + code example ───── */}
        <div style={{ marginBottom: '4rem' }}>
          <div className="section-label" style={{ marginBottom: '1.5rem' }}>Knowledge structure</div>

          {/* Layer list */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '1.5rem',
            }}
          >
            {cns.layers.map((layer, i) => (
              <div
                key={layer.file}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.5rem',
                  padding: '1rem 1.25rem',
                  borderBottom: i < cns.layers.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.8rem',
                    color: 'var(--accent)',
                    width: '120px',
                    flexShrink: 0,
                    paddingTop: '2px',
                  }}
                >
                  {layer.file}
                </span>
                <span style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.65 }}>
                  {layer.description}
                </span>
              </div>
            ))}
          </div>

          {/* Code example */}
          <pre
            style={{
              background: '#1b1b1b',
              border: '1px solid var(--border)',
              borderLeft: '3px solid var(--accent)',
              borderRadius: '4px',
              padding: '1.5rem',
              overflowX: 'auto',
              margin: 0,
            }}
          >
            <code
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.8rem',
                color: 'var(--text)',
                whiteSpace: 'pre',
              }}
            >
              {cns.codeExample}
            </code>
          </pre>
        </div>

        {/* ── Part 4: Git as backbone ───────────────────── */}
        <div>
          <div className="section-label" style={{ marginBottom: '0.75rem' }}>Audit trail</div>
          <h3
            style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
            }}
          >
            Every decision has a timestamp.
          </h3>
          <p style={{ color: 'var(--muted)', maxWidth: '600px', marginBottom: '2.5rem', lineHeight: 1.75 }}>
            {cns.gitNote}
          </p>

          {/* Audit flow */}
          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            {cns.auditFlow.map((step, i) => (
              <div key={step}>
                <div
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderLeft: '3px solid var(--accent)',
                    borderRadius: '6px',
                    padding: '0.6rem 1rem',
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.8rem',
                    color: 'var(--text)',
                  }}
                >
                  {step}
                </div>
                {i < cns.auditFlow.length - 1 && (
                  <div
                    style={{
                      textAlign: 'center',
                      color: 'var(--accent)',
                      fontSize: '1.2rem',
                      margin: '0.25rem 0',
                    }}
                  >
                    ↓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
