export default function ActivityView() {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ minHeight: '50vh', gap: '1rem' }}
    >
      <span
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.75rem',
          color: 'var(--accent)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        Activity Feed
      </span>
      <h2 className="text-2xl font-extrabold text-text">Coming Soon</h2>
      <p
        className="text-sm text-muted"
        style={{ maxWidth: 400, textAlign: 'center', lineHeight: 1.6 }}
      >
        Activity-vyn visar devwatch-events när /api/devwatch-endpointen är implementerad i Railway API.
      </p>
    </div>
  );
}
