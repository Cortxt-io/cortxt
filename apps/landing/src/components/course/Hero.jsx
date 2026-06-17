import { content } from '../../data/courseContent';
import { Container, Eyebrow, Button } from './ui';

export default function Hero() {
  const { hero } = content;
  return (
    <section className="relative overflow-hidden">
      {/* subtle radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(closest-side, var(--accent), transparent)' }}
      />
      <Container className="relative py-24 sm:py-32">
        <Eyebrow>{hero.eyebrow}</Eyebrow>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-[-0.03em] text-text-bright sm:text-6xl">
          {hero.headline.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{hero.subtext}</p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Button href={hero.ctaPrimary.href}>{hero.ctaPrimary.label}</Button>
          <Button href={hero.ctaSecondary.href} variant="ghost">
            {hero.ctaSecondary.label}
          </Button>
        </div>
        <p className="mt-4 font-mono text-xs text-muted">{hero.note}</p>
      </Container>
    </section>
  );
}
