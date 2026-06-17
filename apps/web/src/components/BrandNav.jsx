import { Link, NavLink } from 'react-router-dom';
import { ThemeToggle } from '@cortxt/ui';

const APP_URL = import.meta.env.VITE_APP_URL ?? 'https://app.cortxt.io';

export default function BrandNav() {
  return (
    <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
      <div className="cx-container" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', height: 56 }}>
        <Link to="/" style={{ fontWeight: 800, color: 'var(--text-bright)', letterSpacing: '-0.02em' }}>
          cortxt<span style={{ color: 'var(--accent)' }}>.</span>
        </Link>
        <nav style={{ display: 'flex', gap: '1.25rem', fontSize: '0.9rem' }}>
          <NavLink to="/academy">Kurser</NavLink>
          <NavLink to="/metod">Metod</NavLink>
        </nav>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ThemeToggle />
          <a href={APP_URL} className="cx-btn cx-btn--secondary" style={{ padding: '0.45rem 0.9rem' }}>Logga in →</a>
        </div>
      </div>
    </header>
  );
}
