import { content } from '../../data/courseContent';
import { Container, Section, SectionTitle, Button } from './ui';

export default function Footer() {
  const { brand, finalCta, footer } = content;
  return (
    <>
      <Section className="text-center">
        <SectionTitle className="mx-auto max-w-2xl">{finalCta.title}</SectionTitle>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted">{finalCta.sub}</p>
        <div className="mt-8 flex justify-center">
          <Button href={finalCta.cta.href}>{finalCta.cta.label}</Button>
        </div>
      </Section>

      <footer className="border-t border-border py-10">
        <Container className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-text-bright">{brand}</span>
            <span className="text-sm text-muted">{footer.tagline}</span>
          </div>
          <div className="flex items-center gap-5">
            {footer.links.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-muted no-underline hover:text-text">
                {l.label}
              </a>
            ))}
          </div>
        </Container>
      </footer>
    </>
  );
}
