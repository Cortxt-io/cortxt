export default function Nav() {
  const linkStyle = {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '0.8rem',
    color: 'var(--muted)',
    textDecoration: 'none',
    transition: 'color 0.15s',
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(30,30,30,0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border)',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontWeight: 700,
          fontSize: '1rem',
          color: 'var(--text-bright)',
          letterSpacing: '-0.02em',
        }}
      >
        cortxt
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <a
          href="#"
          style={linkStyle}
          onMouseEnter={(e) => (e.target.style.color = 'var(--text-bright)')}
          onMouseLeave={(e) => (e.target.style.color = 'var(--muted)')}
        >
          Docs
        </a>
        <a
          href="https://github.com/rian010194/cortxt"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
          onMouseEnter={(e) => (e.target.style.color = 'var(--text-bright)')}
          onMouseLeave={(e) => (e.target.style.color = 'var(--muted)')}
        >
          GitHub
        </a>
        <a
          href="#"
          style={linkStyle}
          onMouseEnter={(e) => (e.target.style.color = 'var(--text-bright)')}
          onMouseLeave={(e) => (e.target.style.color = 'var(--muted)')}
        >
          Dashboard
        </a>
      </div>
    </nav>
  );
}
