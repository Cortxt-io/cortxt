import { content } from '../data/content';

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.607.069-.607 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

export default function Waitlist() {
  const { builder } = content;

  return (
    <section id="waitlist" className="section">
      <div className="container fade-in">
        <div className="center">
          <div className="section-label">Access</div>
          <h2 className="section-title">Coming Soon</h2>
        </div>

        <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', marginBottom: '2rem', lineHeight: 1.75 }}>
            Cortxt is in private development.<br />
            Early access is limited to a small group of developers.
          </p>

          <div
            style={{
              display: 'inline-block',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.9rem',
              background: 'var(--accent)',
              color: '#fff',
              padding: '0.6rem 1.5rem',
              borderRadius: '9999px',
              marginBottom: '2rem',
              fontWeight: 500,
            }}
          >
            🚧 Early Access – Coming Soon
          </div>

          <br />

          <a
            href={builder.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--accent)',
              fontWeight: 600,
              fontSize: '1rem',
              textDecoration: 'none',
            }}
          >
            <GitHubIcon /> Follow the build →
          </a>
        </div>
      </div>
    </section>
  );
}
