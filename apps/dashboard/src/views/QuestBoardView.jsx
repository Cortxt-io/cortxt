import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useQuests from '../hooks/useQuests';
import QuestCard from '../components/QuestCard';

const COLUMNS = [
  { key: 'suggested', label: 'Föreslagen', emptyLabel: 'Inga föreslagna quests' },
  { key: 'active', label: 'Aktiv', emptyLabel: 'Inga aktiva quests' },
  { key: 'in_progress', label: 'Pågår', emptyLabel: 'Inga pågående quests' },
  { key: 'completed', label: 'Klar', emptyLabel: 'Inga avklarade quests' },
];

export default function QuestBoardView({ projects }) {
  const navigate = useNavigate();
  const { quests, loading, error, refresh } = useQuests();
  const [filterSlug, setFilterSlug] = useState('');

  const uniqueSlugs = useMemo(
    () => [...new Set(quests.map((q) => q.slug))].sort(),
    [quests]
  );

  const filtered = useMemo(() => {
    if (!filterSlug) return quests;
    return quests.filter((q) => q.slug === filterSlug);
  }, [quests, filterSlug]);

  const byColumn = useMemo(() => {
    const map = {};
    for (const col of COLUMNS) {
      map[col.key] = filtered.filter((q) => q.status === col.key);
    }
    return map;
  }, [filtered]);

  const hasInProgress = quests.some((q) => q.status === 'in_progress');

  useEffect(() => {
    if (!hasInProgress) return;
    const interval = setInterval(refresh, 15000);
    return () => clearInterval(interval);
  }, [hasInProgress, refresh]);

  if (loading) {
    return (
      <div className="view-padding">
        <h1 style={{ margin: '0 0 32px', fontSize: 22, color: 'var(--text)' }}>Quests</h1>
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>Laddar quests…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-padding">
        <h1 style={{ margin: '0 0 16px', fontSize: 22, color: 'var(--text)' }}>Quests</h1>
        <div style={{ color: '#fb7185', fontSize: 13 }}>{error}</div>
      </div>
    );
  }

  return (
    <div className="view-padding">
      {/* Header */}
      <div className="view-header" style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, color: 'var(--text)' }}>Quests</h1>
        <button
          onClick={refresh}
          style={{ padding: '4px 12px', borderRadius: 4, fontSize: 12, fontFamily: 'var(--font-mono, monospace)', cursor: 'pointer', background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}
        >
          Uppdatera ↻
        </button>
      </div>

      {/* Filter */}
      {uniqueSlugs.length > 1 && (
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)' }}>Nod</span>
          <select
            value={filterSlug}
            onChange={(e) => setFilterSlug(e.target.value)}
            style={{
              padding: '4px 8px',
              borderRadius: 4,
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--text)',
              fontSize: 12,
              fontFamily: 'var(--font-mono, monospace)',
            }}
          >
            <option value="">Alla</option>
            {uniqueSlugs.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      {/* Kanban board */}
      <div className="kanban-board">
        {COLUMNS.map((col) => (
          <div key={col.key}>
            <div style={{
              fontSize: 12,
              color: 'var(--muted)',
              fontWeight: 600,
              fontFamily: 'var(--font-mono, monospace)',
              marginBottom: 12,
              paddingBottom: 8,
              borderBottom: '1px solid var(--border)',
            }}>
              {col.label} ({byColumn[col.key]?.length ?? 0})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(byColumn[col.key] ?? []).length > 0 ? (
                byColumn[col.key].map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    projects={projects}
                    onClick={(id) => navigate(`/quest/${id}`)}
                  />
                ))
              ) : (
                <div style={{
                  fontSize: 12,
                  color: 'var(--muted)',
                  fontStyle: 'italic',
                  padding: '16px 8px',
                  textAlign: 'center',
                  border: '1px dashed var(--border)',
                  borderRadius: 8,
                }}>
                  {col.emptyLabel}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
