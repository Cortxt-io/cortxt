const CI_CONFIG = {
  passing: { bg: 'rgba(34,197,94,0.15)',  color: '#22c55e', label: 'CI: grön', icon: '✓' },
  failing: { bg: 'rgba(239,68,68,0.15)',  color: '#ef4444', label: 'CI: röd',  icon: '✕' },
};

// Renders a build-status pill from a quest's ci_status field.
// Returns null when no CI status has been reported yet.
export default function CIBadge({ status }) {
  const cfg = CI_CONFIG[status];
  if (!cfg) return null;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 10px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 600,
        background: cfg.bg,
        color: cfg.color,
      }}
    >
      <span>{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}
