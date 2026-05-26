export default function Nav() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border)',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span
        style={{
          fontWeight: 800,
          fontSize: '1.25rem',
          color: 'var(--text)',
          letterSpacing: '-0.02em',
        }}
      >
        Cortxt
      </span>
      <span
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.7rem',
          background: 'var(--accent)',
          color: '#fff',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          letterSpacing: '0.02em',
        }}
      >
        Coming Soon
      </span>
    </nav>
  );
}
