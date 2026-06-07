import { useNavigate } from 'react-router-dom';
import useIsMobile from '../hooks/useIsMobile';

export default function Sidebar({ navItems, currentPath }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  function isActive(item) {
    if (item.path === '/' || item.path === '/brief' || item.path === '/portfolio' || item.path === '/timeline') return currentPath === item.path;
    return currentPath.startsWith(item.path);
  }

  if (isMobile) {
    return (
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          background: 'rgba(10,10,10,0.96)',
          backdropFilter: 'blur(8px)',
          borderTop: '1px solid var(--border)',
          height: 60,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                padding: '6px 4px',
                border: 'none',
                borderTop: active ? '2px solid var(--accent)' : '2px solid transparent',
                background: 'transparent',
                color: active ? 'var(--text)' : 'var(--muted)',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{item.icon}</span>
              <span style={{ fontSize: '0.6rem', fontFamily: '"JetBrains Mono", monospace' }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <nav
      style={{
        width: 220,
        flexShrink: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        position: 'sticky',
        top: 60,
        height: 'calc(100vh - 60px)',
        overflowY: 'auto',
        paddingTop: '1.5rem',
      }}
    >
      {navItems.map((item) => {
        const active = isActive(item);
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.75rem 1.25rem',
              borderLeft: active
                ? '3px solid var(--accent)'
                : '3px solid transparent',
              background: active
                ? 'rgba(99,102,241,0.08)'
                : 'transparent',
              color: active ? 'var(--text)' : 'var(--muted)',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.8rem',
              cursor: 'pointer',
              borderRight: 'none',
              borderTop: 'none',
              borderBottom: 'none',
              textAlign: 'left',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.color = 'var(--text)';
                e.currentTarget.style.background = 'rgba(99,102,241,0.04)';
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.color = 'var(--muted)';
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {item.icon && <span style={{ fontSize: '1rem' }}>{item.icon}</span>}
            <span>{item.label}</span>
            {item.badge > 0 && (
              <span
                style={{
                  marginLeft: 'auto',
                  minWidth: 18,
                  height: 18,
                  borderRadius: 9,
                  background: 'var(--accent)',
                  color: '#fff',
                  fontSize: 10,
                  fontFamily: 'monospace',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                }}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
