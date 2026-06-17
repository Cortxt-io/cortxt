import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useQuests from '../hooks/useQuests';
import QuestStatusBadge from './QuestStatusBadge';
import CIBadge from './CIBadge';
import ActionButton from './ActionButton';
import useActionState from '../hooks/useActionState';
import { createQuest } from '../lib/api';

export default function QuestSection({ slug, projects }) {
  const navigate = useNavigate();
  const { quests, loading, refresh } = useQuests({ slug });
  const { set, get } = useActionState();
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');

  const active = quests.filter((q) => q.status === 'active' || q.status === 'in_progress');
  const completed = quests.filter((q) => q.status === 'completed').slice(0, 3);
  // archived quests are never shown in QuestSection

  async function handleCreate() {
    if (!formTitle.trim()) return;
    set('create', 'loading', null);
    try {
      await createQuest({
        slug,
        title: formTitle.trim(),
        description: formDesc.trim(),
        estimated_impact: '',
        source: 'manual',
      });
      set('create', 'done', null);
      setFormTitle('');
      setFormDesc('');
      setShowForm(false);
      refresh();
      setTimeout(() => set('create', 'idle', null), 2000);
    } catch (err) {
      set('create', 'error', err.message);
    }
  }

  if (loading) {
    return (
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, fontFamily: 'var(--font-mono, monospace)', marginBottom: 8 }}>
          QUESTS
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>Laddar quests…</div>
      </div>
    );
  }

  if (active.length === 0 && completed.length === 0 && !showForm) {
    return (
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, fontFamily: 'var(--font-mono, monospace)' }}>
            QUESTS
          </div>
          <button
            onClick={() => setShowForm(true)}
            style={{ padding: '4px 12px', borderRadius: 4, fontSize: 12, fontFamily: 'var(--font-mono, monospace)', cursor: 'pointer', background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}
          >
            Skapa quest →
          </button>
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>Inga quests för detta projekt.</div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, fontFamily: 'var(--font-mono, monospace)' }}>
          QUESTS
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '4px 12px', borderRadius: 4, fontSize: 12, fontFamily: 'var(--font-mono, monospace)', cursor: 'pointer', background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}
        >
          {showForm ? 'Avbryt' : 'Skapa quest →'}
        </button>
      </div>

      {/* Active quests */}
      {active.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          {active.map((q) => (
            <div
              key={q.id}
              onClick={() => navigate(`/quest/${q.id}`)}
              style={{
                background: q.status === 'in_progress' ? 'rgba(251,191,36,0.06)' : 'rgba(99,102,241,0.06)',
                border: q.status === 'in_progress' ? '1px solid rgba(251,191,36,0.2)' : '1px solid rgba(99,102,241,0.2)',
                borderRadius: 6,
                padding: '8px 12px',
                marginBottom: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <QuestStatusBadge status={q.status} />
              <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>{q.title}</span>
              <CIBadge status={q.ci_status} />
            </div>
          ))}
        </div>
      )}

      {/* Completed quests */}
      {completed.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)', marginBottom: 4 }}>
            Avklarade
          </div>
          {completed.map((q) => (
            <div
              key={q.id}
              onClick={() => navigate(`/quest/${q.id}`)}
              style={{
                fontSize: 12,
                color: 'var(--muted)',
                padding: '4px 0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <QuestStatusBadge status={q.status} />
              <span>{q.title}</span>
              <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)' }}>
                {q.completed_at ? q.completed_at.split('T')[0] : ''}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: 16,
        }}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)', display: 'block', marginBottom: 4 }}>Titel</label>
            <input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Quest-titel"
              style={{
                width: '100%',
                padding: '6px 8px',
                borderRadius: 4,
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: 13,
                fontFamily: 'var(--font-mono, monospace)',
              }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)', display: 'block', marginBottom: 4 }}>Beskrivning</label>
            <textarea
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              placeholder="Vad ska göras?"
              rows={3}
              style={{
                width: '100%',
                padding: '6px 8px',
                borderRadius: 4,
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: 13,
                fontFamily: 'var(--font-mono, monospace)',
                resize: 'vertical',
              }}
            />
          </div>
          <ActionButton
            label="Skapa"
            loadingLabel="Sparar…"
            onClick={handleCreate}
            btnState={get('create')}
            variant="accent"
            disabled={!formTitle.trim()}
          />
        </div>
      )}
    </div>
  );
}
