import { useNavigate } from 'react-router-dom';

export default function Nav({ onToggleGraph, graphOpen }) {
  const navigate = useNavigate();

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(9,9,11,0.92)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border)',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontWeight: 600,
            fontSize: '1rem',
            color: '#fff',
            letterSpacing: '-0.02em',
          }}
        >
          cortxt
        </span>
      </button>

      <button
        onClick={onToggleGraph}
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.7rem',
          padding: '0.3rem 0.7rem',
          borderRadius: '4px',
          cursor: 'pointer',
          border: `1px solid ${graphOpen ? 'var(--accent)' : 'var(--border)'}`,
          background: graphOpen ? 'var(--accent)' : 'transparent',
          color: graphOpen ? '#fff' : 'var(--muted)',
          transition: 'color 0.15s ease, border-color 0.15s ease, background 0.15s ease',
        }}
      >
        {graphOpen ? 'close' : 'graph'}
      </button>
    </nav>
  );
}
