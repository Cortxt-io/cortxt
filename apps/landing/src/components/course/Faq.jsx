import { content } from '../../data/courseContent';
import { Section, Eyebrow, SectionTitle } from './ui';

export default function Faq() {
  const { faq } = content;
  return (
    <Section id="faq">
      <Eyebrow>{faq.eyebrow}</Eyebrow>
      <SectionTitle>{faq.title}</SectionTitle>
      <div className="mt-8 divide-y divide-border border-y border-border">
        {faq.items.map((it) => (
          <details key={it.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-base font-medium text-text-bright">
              {it.q}
              <span className="ml-4 font-mono text-muted transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{it.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
