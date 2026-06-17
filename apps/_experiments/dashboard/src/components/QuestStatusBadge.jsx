const QUEST_STATUS_STYLES = {
  suggested:   { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8', label: 'Föreslagen' },
  active:      { bg: 'rgba(99,102,241,0.15)',  color: '#6366f1', label: 'Aktiv' },
  in_progress: { bg: 'rgba(251,191,36,0.15)',  color: '#fbbf24', label: 'Pågår' },
  completed:   { bg: 'rgba(16,185,129,0.15)',  color: '#10b981', label: 'Klar' },
  archived:    { bg: 'rgba(100,116,139,0.08)', color: '#475569', label: 'Arkiverad' },
};

export default function QuestStatusBadge({ status }) {
  const style = QUEST_STATUS_STYLES[status] ?? { bg: 'rgba(100,116,139,0.1)', color: '#64748b', label: status };

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono"
      style={{
        background: style.bg,
        color: style.color,
        borderLeft: `3px solid ${style.color}`,
      }}
    >
      {style.label}
    </span>
  );
}

export { QUEST_STATUS_STYLES };
