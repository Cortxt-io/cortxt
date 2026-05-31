import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchActivity, analyzeAll, approveProject, rejectProject, runUpdate, promoteBriefQuest } from '../lib/api';
import useActionState from '../hooks/useActionState';
import useQuests from '../hooks/useQuests';
import ActionButton from '../components/ActionButton';

// ─── Main view ─────────────────────────────────────────────────────────────

export default function BriefView({
  brief,
  loading,
  error,
  refresh,
  generatedAt,
  pending,
  pendingLoading,
  projects,
  refreshPending,
  refreshAnalyze,
}) {
  const navigate = useNavigate();
  const [showUnderlag, setShowUnderlag] = useState(false);
  const [underlag, setUnderlag] = useState(null);
  const [underlagLoading, setUnderlagLoading] = useState(false);
  const [underlagError, setUnderlagError] = useState(null);
  const { set, get } = useActionState();
  const { quests: activeQuests } = useQuests({ status: 'in_progress' });
  const inProgressQuest = activeQuests.length > 0 ? activeQuests[0] : null;

  if (loading) {
    return (
      <div className="view-padding">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: 22, color: 'var(--text)' }}>Portfolio Brief</h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 20, opacity: 0.5, animation: 'pulse 1.5s ease-in-out infinite' }}>
              <div style={{ height: 16, background: 'var(--border)', borderRadius: 4, marginBottom: 8, width: '60%' }} />
              <div style={{ height: 12, background: 'var(--border)', borderRadius: 4, width: '80%' }} />
            </div>
          ))}
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-padding">
        <h1 style={{ margin: '0 0 16px', fontSize: 22, color: 'var(--text)' }}>Portfolio Brief</h1>
        <div style={{ background: 'rgba(251,113,185,0.08)', border: '1px solid rgba(251,113,185,0.2)', borderRadius: 8, padding: 16, color: 'var(--text)' }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Kunde inte generera brief</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>{error}</div>
          <button onClick={refresh} style={{ padding: '6px 16px', borderRadius: 4, fontSize: 13, fontFamily: 'var(--font-mono, monospace)', cursor: 'pointer', background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>
            Försök igen
          </button>
        </div>
      </div>
    );
  }

  if (!brief) {
    return (
      <div className="view-padding">
        <h1 style={{ margin: '0 0 16px', fontSize: 22, color: 'var(--text)' }}>Portfolio Brief</h1>
        <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--muted)', fontSize: 14 }}>
          <p>Inga projekt i portföljen.</p>
        </div>
      </div>
    );
  }

  const { situation, priorities, blockers, quest_suggestion, pending_recommendation } = brief;

  async function handleAnalyzeAll() {
    set('analyzeAll', 'loading', null);
    try {
      await analyzeAll();
      set('analyzeAll', 'done', null);
      refreshAnalyze();
      setTimeout(() => set('analyzeAll', 'idle', null), 2000);
    } catch (err) {
      set('analyzeAll', 'error', err.message);
    }
  }

  async function handleApprove(slug) {
    set(`approve_${slug}`, 'loading', null);
    try {
      await approveProject(slug);
      set(`approve_${slug}`, 'done', null);
      refreshPending();
      refreshAnalyze();
    } catch (err) {
      set(`approve_${slug}`, 'error', err.message);
    }
  }

  async function handleReject(slug) {
    set(`reject_${slug}`, 'loading', null);
    try {
      await rejectProject(slug);
      set(`reject_${slug}`, 'done', null);
      refreshPending();
      refreshAnalyze();
    } catch (err) {
      set(`reject_${slug}`, 'error', err.message);
    }
  }

  function formatGeneratedAt() {
    if (!generatedAt) return '';
    try {
      return new Date(generatedAt).toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' });
    } catch {
      return generatedAt;
    }
  }

  async function handleCreateQuest() {
    if (!quest_suggestion) return;
    set('createQuest', 'loading', null);
    try {
      await promoteBriefQuest(quest_suggestion);
      set('createQuest', 'done', null);
      navigate('/quests');
    } catch (err) {
      set('createQuest', 'error', err.message);
    }
  }

  async function handleToggleUnderlag() {
    const next = !showUnderlag;
    setShowUnderlag(next);
    if (next && underlag === null && !underlagLoading) {
      setUnderlagLoading(true);
      setUnderlagError(null);
      try {
        const data = await fetchActivity();
        setUnderlag({
          devwatchEvents: data.devwatch_events ?? [],
          devwatchDate: data.devwatch_date ?? '',
          devlogHtml: data.devlog_html ?? '',
          devlogDate: data.devlog_date ?? '',
        });
      } catch (err) {
        setUnderlagError(err.message);
      } finally {
        setUnderlagLoading(false);
      }
    }
  }

  async function handleRunUpdate() {
    set('runUpdate', 'loading', null);
    try {
      const result = await runUpdate();
      if (result.status === 'error') {
        set('runUpdate', 'error', result.message);
      } else {
        set('runUpdate', 'done', null);
        // Refresh underlag if visible
        if (showUnderlag) {
          setUnderlagLoading(true);
          try {
            const data = await fetchActivity();
            setUnderlag({
              devwatchEvents: data.devwatch_events ?? [],
              devwatchDate: data.devwatch_date ?? '',
              devlogHtml: data.devlog_html ?? '',
              devlogDate: data.devlog_date ?? '',
            });
          } catch { /* keep existing underlag */ }
          finally { setUnderlagLoading(false); }
        }
        setTimeout(() => set('runUpdate', 'idle', null), 2000);
      }
    } catch (err) {
      set('runUpdate', 'error', err.message);
    }
  }

  return (
    <div className="view-padding">
      {/* Header */}
      <div className="view-header">
        <h1 style={{ margin: 0, fontSize: 22, color: 'var(--text)' }}>Dagens brief</h1>
        {generatedAt && (
          <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)' }}>
            {formatGeneratedAt()}
          </span>
        )}
      </div>

      {/* Qoder arbetar på-banner */}
      {inProgressQuest && (
        <div style={{
          background: 'rgba(251,191,36,0.08)',
          border: '1px solid rgba(251,191,36,0.2)',
          borderRadius: 6,
          padding: '8px 14px',
          marginBottom: 16,
          fontSize: 12,
          color: '#fbbf24',
          fontFamily: 'var(--font-mono, monospace)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span>⚡</span>
          <span>Pågående: {inProgressQuest.title}</span>
          <button onClick={() => navigate('/quests')} style={{
            marginLeft: 'auto', background: 'none', border: 'none',
            color: '#fbbf24', cursor: 'pointer', fontSize: 12,
          }}>Se quests →</button>
        </div>
      )}

      {/* Situation + Quest */}
      <div className="grid-2-cols" style={{ marginBottom: 24 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginBottom: 8, fontFamily: 'var(--font-mono, monospace)' }}>SITUATION</div>
          <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>{situation}</div>
        </div>

        {quest_suggestion && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 20 }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginBottom: 8, fontFamily: 'var(--font-mono, monospace)' }}>QUEST-FÖRSLAG</div>
            <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)', marginBottom: 4 }}>{quest_suggestion.title}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 8 }}>{quest_suggestion.description}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4, marginBottom: 12 }}>
              <span style={{ fontWeight: 600 }}>Mål:</span> {quest_suggestion.target_slug}
              <span style={{ marginLeft: 12, fontWeight: 600 }}>Impact:</span> {quest_suggestion.estimated_impact}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <ActionButton
                label="Skapa quest →"
                loadingLabel="Skapar…"
                onClick={handleCreateQuest}
                btnState={get('createQuest')}
                variant="accent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Underlag toggle */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={handleToggleUnderlag} style={{ padding: '4px 12px', borderRadius: 4, fontSize: 12, fontFamily: 'var(--font-mono, monospace)', cursor: 'pointer', background: 'transparent', border: '1px solid var(--muted)', color: 'var(--muted)' }}>
          {showUnderlag ? 'Dölj underlag ↓' : 'Visa underlag →'}
        </button>
        <ActionButton
          label="Uppdatera underlag ↻"
          loadingLabel="Kör…"
          onClick={handleRunUpdate}
          btnState={get('runUpdate')}
          variant="muted"
        />
      </div>

      {/* Underlag */}
      {showUnderlag && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginBottom: 16, fontFamily: 'var(--font-mono, monospace)' }}>UNDERLAG</div>
          {underlagLoading && <div style={{ fontSize: 13, color: 'var(--muted)' }}>Laddar underlag…</div>}
          {underlagError && <div style={{ fontSize: 13, color: '#fb7185' }}>{underlagError}</div>}
          {!underlagLoading && !underlagError && underlag && (
            <>
              {underlag.devlogHtml && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, fontFamily: 'var(--font-mono, monospace)' }}>Devlog</span>
                    {underlag.devlogDate && <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)' }}>{underlag.devlogDate}</span>}
                  </div>
                  <div className="prose" style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: underlag.devlogHtml }} />
                </div>
              )}
              {underlag.devwatchEvents.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, fontFamily: 'var(--font-mono, monospace)' }}>Devwatch-events</span>
                    {underlag.devwatchDate && <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)' }}>{underlag.devwatchDate}</span>}
                  </div>
                  <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                    {underlag.devwatchEvents.map((event, idx) => {
                      const meta = event.meta || {};
                      const slug = meta.slug || event.source?.id || '';
                      const projectTitle = meta.project_title || event.source?.name || slug;
                      const changedFields = meta.changed_fields || [];
                      const changedFiles = (meta.changed_files || []).map(f => f.file || f);
                      return (
                        <div key={event.id || idx} style={{ padding: '12px 16px', borderBottom: idx < underlag.devwatchEvents.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                            <button onClick={() => navigate(`/project/${slug}`)} style={{ fontWeight: 600, fontSize: 14, color: 'var(--accent)', cursor: 'pointer', background: 'none', border: 'none', padding: 0, fontFamily: 'inherit' }}>{projectTitle}</button>
                            <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)' }}>[{slug}]</span>
                          </div>
                          {changedFields.length > 0 && <div style={{ fontSize: 12, color: 'var(--muted)' }}>Ändrade fält: {changedFields.join(', ')}</div>}
                          {changedFiles.length > 0 && <div style={{ fontSize: 12, color: 'var(--muted)' }}>Ändrade filer: {changedFiles.join(', ')}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {!underlag.devlogHtml && underlag.devwatchEvents.length === 0 && (
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>Inget underlag tillgängligt.</div>
              )}
            </>
          )}
        </div>
      )}

      {/* Priorities */}
      {priorities && priorities.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginBottom: 12, fontFamily: 'var(--font-mono, monospace)' }}>PRIORITERINGAR</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
            {priorities.map((p) => (
              <div key={p.slug} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, cursor: 'pointer' }} onClick={() => navigate(`/project/${p.slug}`)}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-mono, monospace)' }}>[{p.slug}]</span>
                  <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{p.title}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5, marginBottom: 4 }}>{p.reason}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>Nästa: {p.action}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blockers */}
      {blockers && blockers.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginBottom: 12, fontFamily: 'var(--font-mono, monospace)' }}>BLOCKERS</div>
          {blockers.map((b) => (
            <div key={b.slug} style={{ background: 'rgba(251,113,185,0.06)', border: '1px solid rgba(251,113,185,0.15)', borderRadius: 6, padding: '10px 14px', marginBottom: 8, display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: 12, color: '#fb7185', fontFamily: 'var(--font-mono, monospace)', fontWeight: 600 }}>[{b.slug}]</span>
              <span style={{ fontSize: 13, color: 'var(--text)' }}>{b.blocker}</span>
            </div>
          ))}
        </div>
      )}

      {/* Pending recommendation */}
      {pending_recommendation && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginBottom: 12, fontFamily: 'var(--font-mono, monospace)' }}>PENDING-REKOMMENDATION</div>
          <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 6, padding: '12px 16px', fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
            {pending_recommendation}
          </div>
        </div>
      )}

      {/* Compact pending list */}
      {pending && pending.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginBottom: 12, fontFamily: 'var(--font-mono, monospace)' }}>
            VÄNTANDE FÖRSLAG ({pending.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pending.map((item) => {
              const title = (projects || []).find(p => p.slug === item.slug)?.title || item.slug;
              const count = Object.keys(item.suggestions || {}).length;
              return (
                <div key={item.slug} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{title}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)' }}>
                      {item.analyzed_at ? new Date(item.analyzed_at).toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' }) : '—'} · {count} förslag
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <ActionButton label="✓ Godkänn" loadingLabel="Godkänner…" onClick={() => handleApprove(item.slug)} btnState={get(`approve_${item.slug}`)} variant="success" />
                    <ActionButton label="✕ Avvisa" loadingLabel="Avvisar…" onClick={() => handleReject(item.slug)} btnState={get(`reject_${item.slug}`)} variant="danger" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtle footer actions */}
      <div style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center' }}>
        <button onClick={refresh} style={{ fontSize: 11, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono, monospace)', padding: 0 }}>
          Generera ny brief ↻
        </button>
        <ActionButton
          label="Analysera alla projekt →"
          loadingLabel="Analyserar…"
          onClick={handleAnalyzeAll}
          btnState={get('analyzeAll')}
          variant="secondary"
        />
      </div>
    </div>
  );
}
