export default function Nav({ onToggleGraph, graphOpen }) {
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
            color: 'var(--muted)',
            letterSpacing: '0.04em',
          }}
        >
          Dashboard
        </span>
      </div>

      <button
        onClick={onToggleGraph}
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.75rem',
          padding: '0.4rem 0.9rem',
          borderRadius: '6px',
          cursor: 'pointer',
          border: `1px solid ${graphOpen ? 'var(--accent)' : 'var(--border)'}`,
          background: graphOpen ? 'var(--accent)' : 'transparent',
          color: graphOpen ? '#fff' : 'var(--muted)',
          transition: 'all 0.15s ease',
        }}
      >
        {graphOpen ? '✕ Close' : '⬡ Graph'}
      </button>
    </nav>
  );
}
