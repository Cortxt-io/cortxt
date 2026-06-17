import { content } from '../../data/courseContent';
import { Section, Eyebrow, SectionTitle } from './ui';

export default function Method() {
  const { method } = content;
  return (
    <Section id="upplagg">
      <Eyebrow>{method.eyebrow}</Eyebrow>
      <SectionTitle>{method.title}</SectionTitle>
      <p className="mt-3 max-w-2xl text-base text-muted">{method.sub}</p>
      <ol className="mt-10 flex flex-col gap-px overflow-hidden rounded-lg border border-border bg-border md:flex-row">
        {method.steps.map((s, i) => (
          <li key={s.label} className="flex-1 bg-surface p-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
              <span className="font-mono text-accent">→</span>
            </div>
            <h3 className="mt-2 text-base font-semibold text-text-bright">{s.label}</h3>
            <p className="mt-1 text-sm text-muted">{s.desc}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
