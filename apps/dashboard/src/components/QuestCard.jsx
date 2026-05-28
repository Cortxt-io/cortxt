import QuestStatusBadge from './QuestStatusBadge';

export default function QuestCard({ quest, projects, onClick }) {
  const project = projects?.find((p) => p.slug === quest.slug);
  const projectTitle = project?.title ?? quest.slug;

  return (
    <div
      onClick={() => onClick?.(quest.id)}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: 16,
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <QuestStatusBadge status={quest.status} />
        <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)' }}>
          {quest.slug}
        </span>
      </div>
      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 4 }}>
        {quest.title}
      </div>
      <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4, marginBottom: 4 }}>
        {projectTitle}
      </div>
      {quest.result_summary && (
        <div style={{ fontSize: 12, color: '#10b981', lineHeight: 1.4, marginTop: 6 }}>
          {quest.result_summary.length > 100
            ? quest.result_summary.slice(0, 100) + '...'
            : quest.result_summary}
        </div>
      )}
      <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)', marginTop: 6 }}>
        {quest.created_at}
      </div>
    </div>
  );
}
