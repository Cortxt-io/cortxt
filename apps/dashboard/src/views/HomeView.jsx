import { useNavigate } from 'react-router-dom';
import useQuests from '../hooks/useQuests';
import ActivitySummary from '../components/ActivitySummary';
import Timeline from '../components/Timeline';
import FrameworkTree from '../components/FrameworkTree';
import QuestStatusBadge from '../components/QuestStatusBadge';

export default function HomeView({
  brief,
  loading,
  error,
  refresh,
  generatedAt,
  projects,
}) {
  const navigate = useNavigate();
  const { quests: inProgressQuests } = useQuests({ status: 'in_progress' });
  const { quests: activeQuests } = useQuests({ status: 'active' });

  // ── Section heading style ──
  const sectionHeading = {
    fontSize: 12,
    color: 'var(--muted)',
    fontWeight: 600,
    fontFamily: 'var(--font-mono, monospace)',
    letterSpacing: '0.05em',
    marginBottom: 16,
  };

  // ── Brief loading ──
  if (loading) {
    return (
      <div className="view-padding">
        <div style={sectionHeading}>MINNE</div>
        <ActivitySummary />
        <div style={{ marginTop: 16 }}>
          <Timeline projects={projects} />
        </div>
        <div style={{ height: 120, marginTop: 40, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, opacity: 0.5 }}>
          <div style={{ padding: 16, fontSize: 13, color: 'var(--muted)' }}>Laddar brief…</div>
        </div>
      </div>
    );
  }

  const { situation, quest_suggestion } = brief || {};

  // ── Quest rows ──
  const allActiveQuests = [...inProgressQuests, ...activeQuests];

  return (
    <div className="view-padding">
      {/* ═══ MINNE ═══ */}
      <section style={{ marginBottom: 40 }}>
        <div style={sectionHeading}>MINNE</div>
        <ActivitySummary />
        <div style={{ marginTop: 16 }}>
          <Timeline projects={projects} />
        </div>
      </section>

      {/* ═══ BESLUT ═══ */}
      <section style={{ marginBottom: 40 }}>
        <div style={sectionHeading}>BESLUT</div>

        {/* Compact brief card */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 4,
          padding: 16,
          marginBottom: 16,
        }}>
          {/* Situation */}
          {situation && (
            <div>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, fontFamily: 'var(--font-mono, monospace)', marginBottom: 8 }}>SITUATION</div>
              <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>{situation}</div>
            </div>
          )}

          {/* Quest suggestion */}
          {quest_suggestion && (
            <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, fontFamily: 'var(--font-mono, monospace)', marginBottom: 8 }}>QUEST-FÖRSLAG</div>
              <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)', marginBottom: 4 }}>{quest_suggestion.title}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{quest_suggestion.description}</div>
            </div>
          )}

          {/* Link to full brief */}
          <div style={{ marginTop: 16 }}>
            <button
              onClick={() => navigate('/brief')}
              style={{
                fontSize: 12,
                fontFamily: 'var(--font-mono, monospace)',
                color: 'var(--accent)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Se hela briefen →
            </button>
          </div>
        </div>

        {/* Active / in-progress quests */}
        {allActiveQuests.length > 0 && (
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, fontFamily: 'var(--font-mono, monospace)', marginBottom: 8 }}>
              AKTIVA QUESTS ({allActiveQuests.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {allActiveQuests.map((q) => (
                <div
                  key={q.id}
                  onClick={() => navigate(`/quest/${q.id}`)}
                  style={{
                    background: q.status === 'in_progress' ? 'rgba(251,191,36,0.06)' : 'rgba(99,102,241,0.06)',
                    border: q.status === 'in_progress' ? '1px solid rgba(251,191,36,0.2)' : '1px solid rgba(99,102,241,0.2)',
                    borderRadius: 4,
                    padding: '6px 10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <QuestStatusBadge status={q.status} />
                  <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>{q.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ═══ KARTA ═══ */}
      <section>
        <div style={sectionHeading}>KARTA</div>
        <FrameworkTree projects={projects} />
      </section>
    </div>
  );
}