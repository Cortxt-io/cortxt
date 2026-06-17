export default function GraphView({ onClose }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'var(--bg)',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1.5rem',
          zIndex: 210,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '0.4rem 0.8rem',
          color: 'var(--text)',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.8rem',
          cursor: 'pointer',
        }}
      >
        ✕ Close
      </button>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: '1rem',
        }}
      >
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.75rem',
            color: 'var(--accent)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Graph View
        </div>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
          }}
        >
          Coming Soon
        </h2>
        <p
          style={{
            color: 'var(--muted)',
            fontSize: '0.9rem',
            maxWidth: '400px',
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          The dependency graph requires{' '}
          <code style={{ color: 'var(--accent)', fontFamily: '"JetBrains Mono", monospace' }}>
            depends_on
          </code>{' '}
          data in project.md and a completed family enum migration.
        </p>
      </div>
    </div>
  );
}
