import { Link, NavLink } from 'react-router-dom';
import { ThemeToggle } from '@cortxt/ui';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const APP_URL = import.meta.env.VITE_APP_URL ?? 'https://app.cortxt.io';

const navLinkClass = ({ isActive }) =>
  cn('text-sm transition-colors hover:text-foreground', isActive ? 'text-foreground' : 'text-muted-foreground');

export default function BrandNav() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex h-14 max-w-[1100px] items-center gap-6 px-6">
        <Link to="/" className="font-display text-base font-bold tracking-tight text-text-bright">
          cortxt<span className="text-primary">.</span>
        </Link>
        <nav className="flex gap-5">
          <NavLink to="/academy" className={navLinkClass}>Kurser</NavLink>
          <NavLink to="/metod" className={navLinkClass}>Metod</NavLink>
        </nav>
        <div className="flex-1" />
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Button asChild variant="secondary" size="sm">
            <a href={APP_URL}>Logga in →</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
