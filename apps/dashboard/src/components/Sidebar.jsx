import { useNavigate } from 'react-router-dom';

export default function Sidebar({ navItems, currentPath }) {
  const navigate = useNavigate();

  function isActive(item) {
    if (item.path === '/' || item.path === '/portfolio') return currentPath === item.path;
    return currentPath.startsWith(item.path);
  }

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="sidebar-nav">
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

      {/* Mobile bottom nav */}
      <nav className="bottom-nav">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`bottom-nav-item${active ? ' bottom-nav-item--active' : ''}`}
            >
              <span className="bottom-nav-icon">{item.icon}</span>
              <span className="bottom-nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
