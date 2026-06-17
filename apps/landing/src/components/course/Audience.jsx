import { content } from '../../data/courseContent';
import { Section, Eyebrow, SectionTitle } from './ui';

export default function Audience() {
  const { audience } = content;
  return (
    <Section>
      <Eyebrow>{audience.eyebrow}</Eyebrow>
      <SectionTitle>{audience.title}</SectionTitle>
      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {audience.points.map((p) => (
          <div key={p.title} className="rounded-lg border border-border bg-surface p-6">
            <h3 className="text-base font-semibold text-text-bright">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
