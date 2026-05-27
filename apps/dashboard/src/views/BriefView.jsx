import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pushQuestToPlanning, fetchActivity } from '../lib/api';

export default function BriefView({ brief, loading, error, refresh, generatedAt }) {
  const navigate = useNavigate();
  const [showQuestPrompt, setShowQuestPrompt] = useState(false);
  const [pushState, setPushState] = useState('idle');
  const [pushError, setPushError] = useState(null);
  const [showUnderlag, setShowUnderlag] = useState(false);
  const [underlag, setUnderlag] = useState(null);
  const [underlagLoading, setUnderlagLoading] = useState(false);
  const [underlagError, setUnderlagError] = useState(null);

  if (loading) {
    return (
      <div style={{ padding: 32, maxWidth: 1100 }}>
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
      <div style={{ padding: 32, maxWidth: 1100 }}>
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
      <div style={{ padding: 32, maxWidth: 1100 }}>
        <h1 style={{ margin: '0 0 16px', fontSize: 22, color: 'var(--text)' }}>Portfolio Brief</h1>
        <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--muted)', fontSize: 14 }}>
          <p>Inga projekt i portföljen.</p>
        </div>
      </div>
    );
  }

  const { situation, priorities, blockers, quest_suggestion, pending_recommendation } = brief;

  function buildQuestPrompt() {
    if (!quest_suggestion) return '';
    return (
      `Projekt: ${quest_suggestion.target_slug}\n` +
      `Quest: ${quest_suggestion.title}\n\n` +
      `${quest_suggestion.description}\n\n` +
      `Motivering: ${quest_suggestion.estimated_impact}\n\n` +
      `[Läs projects/${quest_suggestion.target_slug}/project.md och relevanta planning/-filer innan du börjar.]`
    );
  }

  function copyQuestPrompt() {
    navigator.clipboard.writeText(buildQuestPrompt()).catch(() => {});
  }

  function formatGeneratedAt() {
    if (!generatedAt) return '';
    try {
      return new Date(generatedAt).toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' });
    } catch {
      return generatedAt;
    }
  }

  async function handlePushToPlanning() {
    if (!quest_suggestion || !quest_suggestion.target_slug) return;
    setPushState('loading');
    setPushError(null);
    const today = new Date().toISOString().split('T')[0];
    try {
      await pushQuestToPlanning(quest_suggestion.target_slug, {
        title: quest_suggestion.title,
        description: quest_suggestion.description,
        estimated_impact: quest_suggestion.estimated_impact,
        source: 'portfolio-brief',
        created_at: today,
      });
      setPushState('done');
      setTimeout(() => setPushState('idle'), 2000);
    } catch (err) {
      setPushState('error');
      setPushError(err.message);
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

  return (
    <div style={{ padding: 32, maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 22, color: 'var(--text)' }}>Dagens brief</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {generatedAt && (
            <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)' }}>
              {formatGeneratedAt()}
            </span>
          )}
          <button onClick={refresh} style={{ padding: '6px 14px', borderRadius: 4, fontSize: 13, fontFamily: 'var(--font-mono, monospace)', cursor: 'pointer', background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>
            Generera ny ↻
          </button>
        </div>
      </div>

      {/* Situation + Quest */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
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
              <button onClick={() => setShowQuestPrompt(!showQuestPrompt)} style={{ padding: '4px 12px', borderRadius: 4, fontSize: 12, fontFamily: 'var(--font-mono, monospace)', cursor: 'pointer', background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>
                {showQuestPrompt ? 'Dölj prompt' : 'Förbered quest-prompt →'}
              </button>
              <button
                onClick={handlePushToPlanning}
                disabled={pushState === 'loading'}
                style={{ padding: '4px 12px', borderRadius: 4, fontSize: 12, fontFamily: 'var(--font-mono, monospace)', cursor: pushState === 'loading' ? 'not-allowed' : 'pointer', background: 'transparent', border: `1px solid ${pushState === 'done' ? '#34d399' : pushState === 'error' ? '#fb7185' : 'var(--accent)'}`, color: pushState === 'done' ? '#34d399' : pushState === 'error' ? '#fb7185' : 'var(--accent)', opacity: pushState === 'loading' ? 0.6 : 1 }}
              >
                {pushState === 'loading' ? 'Sparar…' : pushState === 'done' ? '✓ Sparad' : pushState === 'error' ? 'Fel' : 'Spara till planning →'}
              </button>
              {pushError && <div style={{ fontSize: 11, color: '#fb7185', width: '100%' }}>{pushError}</div>}
            </div>
          </div>
        )}
      </div>

      {/* Quest prompt */}
      {showQuestPrompt && quest_suggestion && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, fontFamily: 'var(--font-mono, monospace)' }}>QODER-PROMPT</span>
            <button onClick={copyQuestPrompt} style={{ padding: '4px 12px', borderRadius: 4, fontSize: 12, fontFamily: 'var(--font-mono, monospace)', cursor: 'pointer', background: 'transparent', border: '1px solid var(--muted)', color: 'var(--muted)' }}>Kopiera</button>
          </div>
          <pre style={{ fontSize: 13, color: 'var(--text)', background: 'var(--bg)', borderRadius: 4, padding: 12, overflowX: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono, monospace)', lineHeight: 1.5 }}>
            {buildQuestPrompt()}
          </pre>
        </div>
      )}

      {/* Underlag toggle */}
      <div style={{ marginBottom: 24 }}>
        <button onClick={handleToggleUnderlag} style={{ padding: '4px 12px', borderRadius: 4, fontSize: 12, fontFamily: 'var(--font-mono, monospace)', cursor: 'pointer', background: 'transparent', border: '1px solid var(--muted)', color: 'var(--muted)' }}>
          {showUnderlag ? 'Dölj underlag ↓' : 'Visa underlag →'}
        </button>
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
    </div>
  );
}
