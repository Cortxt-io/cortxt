import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useQuest from '../hooks/useQuest';
import QuestStatusBadge from '../components/QuestStatusBadge';
import ActionButton from '../components/ActionButton';
import useActionState from '../hooks/useActionState';
import { activateQuest, completeQuest, archiveQuest } from '../lib/api';

export default function QuestDetailView({ projects }) {
  const { questId } = useParams();
  const navigate = useNavigate();
  const { quest, loading, error, refresh } = useQuest(questId);
  const { set, get } = useActionState();
  const [resultSummary, setResultSummary] = useState('');

  async function handleActivate() {
    set('activate', 'loading', null);
    try {
      await activateQuest(questId);
      set('activate', 'done', null);
      refresh();
      setTimeout(() => set('activate', 'idle', null), 2000);
    } catch (err) {
      set('activate', 'error', err.message);
    }
  }

  async function handleComplete() {
    set('complete', 'loading', null);
    try {
      await completeQuest(questId, resultSummary || undefined);
      set('complete', 'done', null);
      refresh();
      setTimeout(() => set('complete', 'idle', null), 2000);
    } catch (err) {
      set('complete', 'error', err.message);
    }
  }

  async function handleArchive() {
    set('archive', 'loading', null);
    try {
      await archiveQuest(questId);
      set('archive', 'done', null);
      refresh();
      setTimeout(() => set('archive', 'idle', null), 2000);
    } catch (err) {
      set('archive', 'error', err.message);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 32, maxWidth: 800 }}>
        <p style={{ color: 'var(--muted)' }}>Laddar quest…</p>
      </div>
    );
  }

  if (error || !quest) {
    return (
      <div style={{ padding: 32, maxWidth: 800 }}>
        <p style={{ color: '#fb7185' }}>{error || 'Quest hittades inte'}</p>
        <button
          onClick={() => navigate('/quests')}
          style={{ marginTop: 12, padding: '4px 12px', borderRadius: 4, fontSize: 12, fontFamily: 'var(--font-mono, monospace)', cursor: 'pointer', background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}
        >
          ← Tillbaka till Quests
        </button>
      </div>
    );
  }

  const project = projects?.find((p) => p.slug === quest.slug);

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      {/* Back */}
      <button
        onClick={() => navigate('/quests')}
        style={{ marginBottom: 20, padding: '4px 12px', borderRadius: 4, fontSize: 12, fontFamily: 'var(--font-mono, monospace)', cursor: 'pointer', background: 'transparent', border: 'none', color: 'var(--muted)' }}
      >
        ← Quests
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, color: 'var(--text)' }}>{quest.title}</h1>
        <QuestStatusBadge status={quest.status} />
      </div>

      {/* Project link */}
      <div style={{ marginBottom: 20 }}>
        <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)' }}>Projekt: </span>
        <button
          onClick={() => navigate(`/project/${quest.slug}`)}
          style={{ fontSize: 13, color: 'var(--accent)', cursor: 'pointer', background: 'none', border: 'none', padding: 0, fontWeight: 600, fontFamily: 'inherit' }}
        >
          {project?.title ?? quest.slug}
        </button>
      </div>

      {/* Description */}
      {quest.description && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, fontFamily: 'var(--font-mono, monospace)', marginBottom: 8 }}>BESKRIVNING</div>
          <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>{quest.description}</div>
        </div>
      )}

      {/* Impact */}
      {quest.estimated_impact && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, fontFamily: 'var(--font-mono, monospace)', marginBottom: 8 }}>IMPACT</div>
          <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>{quest.estimated_impact}</div>
        </div>
      )}

      {/* Meta */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
        <MetaItem label="Skapad" value={quest.created_at ?? '—'} />
        <MetaItem label="Källa" value={quest.source ?? '—'} />
        <MetaItem label="Startad" value={quest.started_at ? quest.started_at.split('T')[0] : '—'} />
        <MetaItem label="Avklarad" value={quest.completed_at ? quest.completed_at.split('T')[0] : '—'} />
      </div>

      {/* Result summary */}
      {quest.result_summary && (
        <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: '#10b981', fontWeight: 600, fontFamily: 'var(--font-mono, monospace)', marginBottom: 8 }}>RESULTAT</div>
          <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>{quest.result_summary}</div>
        </div>
      )}

      {/* Actions */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
        {quest.status === 'suggested' && (
          <ActionButton
            label="Aktivera →"
            loadingLabel="Aktiverar…"
            onClick={handleActivate}
            btnState={get('activate')}
            variant="accent"
          />
        )}

        {(quest.status === 'active' || quest.status === 'in_progress') && (
          <div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)', display: 'block', marginBottom: 4 }}>Resultatsammanfattning</label>
              <textarea
                value={resultSummary}
                onChange={(e) => setResultSummary(e.target.value)}
                placeholder="Vad har uppnåtts?"
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
              label="Markera klar →"
              loadingLabel="Sparar…"
              onClick={handleComplete}
              btnState={get('complete')}
              variant="success"
            />
          </div>
        )}

        {(quest.status === 'completed' || quest.status === 'archived') && (
          <ActionButton
            label="Arkivera →"
            loadingLabel="Arkiverar…"
            onClick={handleArchive}
            btnState={get('archive')}
            variant="secondary"
          />
        )}
      </div>
    </div>
  );
}

function MetaItem({ label, value }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px' }}>
      <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, color: 'var(--text)', fontFamily: 'var(--font-mono, monospace)' }}>{value}</div>
    </div>
  );
}
