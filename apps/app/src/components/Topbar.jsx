import { NavLink } from 'react-router-dom';
import { Button } from '@cortxt/ui';
import { useAuth } from '../lib/auth.js';

const WEB_URL = import.meta.env.VITE_WEB_URL ?? 'https://cortxt.io';

export function Topbar() {
  const { user, signIn, signOut } = useAuth();
  return (
    <header className="topbar">
      <div className="topbar__logo">cortxt<span>.</span></div>
      <nav className="topbar__nav">
        <NavLink to="/" end>Min arbetsyta</NavLink>
        <NavLink to="/verktyg">Verktyg</NavLink>
        <a href={WEB_URL}>← cortxt.io</a>
      </nav>
      <div className="topbar__spacer" />
      {/* Auth placeholder — see src/lib/auth.js */}
      {user
        ? <Button variant="secondary" onClick={signOut}>Logga ut</Button>
        : <Button variant="primary" onClick={signIn}>Logga in</Button>}
    </header>
  );
}
