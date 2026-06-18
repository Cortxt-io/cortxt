/* A model as a dense instrument row (replaces the fat ModelCard on list surfaces).
 * Health is a coloured dot ALWAYS paired with an sr-only label — never colour alone.
 * Links internally to the decision-model view, or outward via `href` (launcher use). */
import { Link } from 'react-router-dom';
import { StatusTag } from './StatusTag.jsx';

const HEALTH_LABEL = { healthy: 'Frisk', attention: 'Bevaka', degraded: 'Försämrad', unknown: 'Okänd' };

export function ReadoutRow({ model, href }) {
  const level = HEALTH_LABEL[model.health?.level] ? model.health.level : 'unknown';
  const inner = (
    <>
      <span className="readout-row__dot" style={{ background: `var(--health-${level})` }} aria-hidden="true" />
      <span className="sr-only">{HEALTH_LABEL[level]} —</span>
      <span className="readout-row__main">
        <span className="readout-row__title">
          <span className="readout-row__name">{model.title}</span>
          {model.domain && <span className="readout-row__domain">{model.domain}</span>}
        </span>
        {model.summary && <span className="readout-row__summary">{model.summary}</span>}
      </span>
      <span className="readout-row__meta">
        <StatusTag live={Boolean(model.urlLive)} />
      </span>
    </>
  );

  return href
    ? <a className="readout-row" href={href} target="_blank" rel="noreferrer">{inner}</a>
    : <Link className="readout-row" to={`/modell/${model.slug}`}>{inner}</Link>;
}
