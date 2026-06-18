/* Maps a CNS health scorecard level → a small coloured badge.
 * Levels come from scripts/health.py: healthy | attention | degraded | unknown. */

const LEVELS = {
  healthy: { label: 'Frisk', color: 'var(--health-healthy)' },
  attention: { label: 'Bevaka', color: 'var(--health-attention)' },
  degraded: { label: 'Försämrad', color: 'var(--health-degraded)' },
  unknown: { label: 'Okänd', color: 'var(--health-unknown)' },
};

export function HealthBadge({ level }) {
  const l = LEVELS[level] || LEVELS.unknown;
  return (
    <span className="health-badge" title={`Hälsa: ${l.label}`}>
      <span className="health-badge__dot" style={{ background: l.color }} />
      {l.label}
    </span>
  );
}
