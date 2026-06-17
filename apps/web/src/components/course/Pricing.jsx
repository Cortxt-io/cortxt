import { content } from '../../data/courseContent';
import { Section, Eyebrow, SectionTitle, Button } from './ui';

export default function Pricing() {
  const { pricing } = content;
  return (
    <Section id="pris">
      <Eyebrow>{pricing.eyebrow}</Eyebrow>
      <SectionTitle>{pricing.title}</SectionTitle>
      <p className="mt-3 max-w-2xl text-base text-muted">{pricing.sub}</p>
      <div className="mx-auto mt-10 grid max-w-3xl gap-5 sm:grid-cols-2">
        {pricing.tiers.map((t) => (
          <div
            key={t.name}
            className={`flex flex-col rounded-xl border p-7 ${
              t.highlighted ? 'border-accent bg-surface-2' : 'border-border bg-surface'
            }`}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">{t.name}</h3>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-text-bright">{t.price}</span>
              {t.priceNote && <span className="text-sm text-muted">{t.priceNote}</span>}
            </div>
            <ul className="mt-5 flex flex-1 flex-col gap-2.5">
              {t.features.map((f) => (
                <li key={f} className="flex gap-2.5 text-sm leading-relaxed text-text">
                  <span className="mt-0.5 select-none text-success">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7">
              <Button href={t.cta.href} variant={t.highlighted ? 'primary' : 'ghost'}>
                {t.cta.label}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
