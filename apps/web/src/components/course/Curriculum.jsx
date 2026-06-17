import { content } from '../../data/courseContent';
import { Section, Eyebrow, SectionTitle } from './ui';

export default function Curriculum() {
  const { curriculum } = content;
  return (
    <Section id="kursen">
      <Eyebrow>{curriculum.eyebrow}</Eyebrow>
      <SectionTitle>{curriculum.title}</SectionTitle>
      <p className="mt-3 max-w-2xl text-base text-muted">{curriculum.sub}</p>
      <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {curriculum.modules.map((m) => (
          <div key={m.n} className="bg-surface p-6 transition-colors hover:bg-surface-2">
            <span className="font-mono text-xs text-accent">{m.n}</span>
            <h3 className="mt-2 text-base font-semibold text-text-bright">{m.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{m.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
