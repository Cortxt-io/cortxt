/* The signature: derived-health telemetry rolled up across the portfolio.
 * A thesis line (the agency's state today) + a pulse bar + a count readout.
 * Health is the page's one colour language; every colour is paired with a label. */
import { H1 } from '@cortxt/ui';

const ORDER = ['healthy', 'attention', 'degraded', 'unknown'];
const PLURAL = { healthy: 'friska', attention: 'bevaka', degraded: 'försämrade', unknown: 'okänd' };

export function rollupHealth(models) {
  const c = { healthy: 0, attention: 0, degraded: 0, unknown: 0 };
  for (const m of models) {
    const lvl = m.health?.level;
    c[lvl in c ? lvl : 'unknown'] += 1;
  }
  return c;
}

function thesis(c) {
  if (c.degraded) return `${c.degraded} system behöver din åtgärd.`;
  if (c.attention) return `${c.attention} att bevaka — inget kritiskt idag.`;
  if (c.healthy) return 'Allt grönt. Inget kräver din åtgärd idag.';
  return 'Ingen data ännu.';
}

export function PortfolioPulse({ models, ventureCount }) {
  const c = rollupHealth(models);
  const total = models.length || 1;
  const summary = ORDER.filter((k) => c[k]).map((k) => `${c[k]} ${PLURAL[k]}`).join(', ');

  return (
    <div className="pulse">
      <H1 className="pulse__thesis">{thesis(c)}</H1>
      <div className="pulse__bar" role="img" aria-label={`Hälsa: ${summary}`}>
        {ORDER.map((k) => (c[k] ? (
          <span key={k} className="pulse__seg" style={{ width: `${(c[k] / total) * 100}%`, background: `var(--health-${k})` }} />
        ) : null))}
      </div>
      <div className="pulse__counts">
        {ORDER.map((k) => (c[k] ? (
          <span key={k} className="pulse__count">
            <span className="pulse__dot" style={{ background: `var(--health-${k})` }} aria-hidden="true" />
            {c[k]} {PLURAL[k]}
          </span>
        ) : null))}
        <span className="pulse__total">{models.length} system · {ventureCount} ventures</span>
      </div>
    </div>
  );
}
