import { NavLink } from 'react-router-dom';
import { ThemeToggle } from '@cortxt/ui';
import { Button } from '@/components/ui/button';
import { useAuth } from '../lib/auth.js';

const WEB_URL = import.meta.env.VITE_WEB_URL ?? 'https://cortxt.io';

export function Topbar() {
  const { user, signIn, signOut } = useAuth();
  return (
    <header className="topbar">
      <div className="topbar__logo">cortxt<span>.</span></div>
      <nav className="topbar__nav">
        <NavLink to="/" end>Översikt</NavLink>
        <NavLink to="/portfolj">Portfölj</NavLink>
        <NavLink to="/verktyg">Verktyg</NavLink>
        <a href={WEB_URL}>← cortxt.io</a>
      </nav>
      <div className="topbar__spacer" />
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <ThemeToggle />
        {/* Auth placeholder — see src/lib/auth.js */}
        {user
          ? <Button variant="secondary" size="sm" onClick={signOut}>Logga ut</Button>
          : <Button size="sm" onClick={signIn}>Logga in</Button>}
      </div>
    </header>
  );
}
