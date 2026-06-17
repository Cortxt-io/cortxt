import { content } from '../../data/courseContent';
import { Container, Button } from './ui';

export default function Nav() {
  const { brand, nav } = content;
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[#1e1e1e]/80 backdrop-blur">
      <Container className="flex h-14 items-center justify-between">
        <a href="#" className="font-mono text-sm font-bold text-text-bright no-underline">
          {brand}
        </a>
        <nav className="hidden items-center gap-7 sm:flex">
          {nav.links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted no-underline hover:text-text">
              {l.label}
            </a>
          ))}
        </nav>
        <Button href={nav.cta.href}>{nav.cta.label}</Button>
      </Container>
    </header>
  );
}
