import { content } from '../../data/courseContent';
import { Section, Eyebrow, SectionTitle } from './ui';

export default function Problem() {
  const { problem, promise } = content;
  return (
    <Section>
      <Eyebrow>{problem.eyebrow}</Eyebrow>
      <SectionTitle>{problem.title}</SectionTitle>
      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {problem.points.map((p) => (
          <div key={p.title} className="rounded-lg border border-border bg-surface p-6">
            <h3 className="text-base font-semibold text-text-bright">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
          </div>
        ))}
      </div>

      {/* Promise / transformation */}
      <div className="mt-16 rounded-xl border border-border bg-surface-2 p-8 sm:p-10">
        <Eyebrow>{promise.eyebrow}</Eyebrow>
        <SectionTitle>{promise.title}</SectionTitle>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {promise.points.map((p) => (
            <li key={p} className="flex gap-3 text-sm leading-relaxed text-text">
              <span className="mt-0.5 select-none font-mono text-success">→</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
