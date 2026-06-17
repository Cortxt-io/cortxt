export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '1.5rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      <span
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.78rem',
          color: 'var(--muted)',
        }}
      >
        © 2026 cortxt
      </span>
      <a
        href="https://github.com/rian010194/cortxt"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.78rem',
          color: 'var(--accent)',
          textDecoration: 'none',
        }}
      >
        GitHub
      </a>
    </footer>
  );
}
