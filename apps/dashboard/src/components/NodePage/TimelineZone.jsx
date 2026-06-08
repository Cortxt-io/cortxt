import { useState, useEffect } from 'react';
import { marked } from 'marked';
import Timeline from '../Timeline';
import ActionButton from '../ActionButton';
import useActionState from '../../hooks/useActionState';
import useSuggestQuest from '../../hooks/useSuggestQuest';
import { getNodeStageColor, getNodeStageLabel, NODE_STAGE_LABELS } from '../../data/labels';
import {
  updateProject,
  analyzeProject,
  approveProject,
  rejectProject,
  createQuest,
  activateQuest,
  completeQuest,
  fetchQuests,
} from '../../lib/api';

marked.use({ breaks: true, gfm: true });

const STAGES = ['idea', 'building', 'working', 'maturing'];

// ─── Pending suggestions sub-component ──────────────────────────────

function formatFieldValue(value) {
  if (value === null || value === undefined) return '(null)';
  if (Array.isArray(value)) return `${value.length} risker`;
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function formatDiffValue(value) {
  if (value === null || value === undefined) return '(null)';
  if (Array.isArray(value)) return `${value.length} risker`;
  if (typeof value === 'object') return JSON.stringify(value);
  const str = String(value);
  return str.length > 100 ? str.slice(0, 100) + '…' : str;
}

function PendingSection({ pending, meta, slug, refresh }) {
  const { set, get } = useActionState();

  async function handleAnalyze() {
    set('analyze', 'loading', null);
    try {
      await analyzeProject(slug);
      set('analyze', 'done', null);
      refresh();
      setTimeout(() => set('analyze', 'idle', null), 2000);
    } catch (err) {
      set('analyze', 'error', err.message);
    }
  }

  async function handleApprove() {
    set('approve', 'loading', null);
    try {
      await approveProject(slug);
      set('approve', 'done', null);
      refresh();
      setTimeout(() => set('approve', 'idle', null), 2000);
    } catch (err) {
      set('approve', 'error', err.message);
    }
  }

  async function handleReject() {
    set('reject', 'loading', null);
    try {
      await rejectProject(slug);
      set('reject', 'done', null);
      refresh();
      setTimeout(() => set('reject', 'idle', null), 2000);
    } catch (err) {
      set('reject', 'error', err.message);
    }
  }

  const hasPending = pending && pending.suggestions && Object.keys(pending.suggestions).length > 0;
  const suggestionCount = hasPending ? Object.keys(pending.suggestions).length : 0;
  const analyzedAt = pending?.analyzed_at
    ? new Date(pending.analyzed_at).toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' })
    : '—';

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.05em' }}>
          AI-FÖRSLAG {hasPending ? `(${suggestionCount})` : ''}
        </div>
        <ActionButton
          label="Analysera →"
          loadingLabel="Analyserar…"
          onClick={handleAnalyze}
          btnState={get('analyze')}
          variant="accent"
        />
      </div>

      {hasPending && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: '"JetBrains Mono", monospace' }}>
            Analyserad {analyzedAt} · {suggestionCount} förslag
          </div>

          {pending.overall && (
            <div style={{
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 6,
              padding: '8px 12px',
              fontSize: 12,
              color: 'var(--text)',
              lineHeight: 1.6,
            }}>
              {pending.overall}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Object.entries(pending.suggestions).map(([field, proposedValue]) => {
              if (field === 'updated_at') return null;
              const currentValue = meta?.[field];
              const hasCurrent = currentValue !== undefined && currentValue !== null;
              return (
                <div key={field} style={{ background: 'var(--bg)', borderRadius: 4, padding: '6px 10px', fontSize: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--muted)', fontFamily: '"JetBrains Mono", monospace' }}>{field}</span>
                    {hasCurrent && (
                      <span style={{ color: 'var(--muted)', fontFamily: '"JetBrains Mono", monospace)', textDecoration: 'line-through' }}>
                        {formatFieldValue(currentValue)}
                      </span>
                    )}
                    <span style={{ color: 'var(--muted)', fontSize: 10 }}>→</span>
                    <span style={{ color: 'var(--text)', fontFamily: '"JetBrains Mono", monospace)', wordBreak: 'break-word' }}>
                      {formatDiffValue(proposedValue)}
                    </span>
                  </div>
                  {pending.reasoning?.[field] && (
                    <div style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic', marginTop: 2 }}>
                      {pending.reasoning[field]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <ActionButton
              label="✓ Godkänn"
              loadingLabel="Godkänner…"
              onClick={handleApprove}
              btnState={get('approve')}
              variant="success"
            />
            <ActionButton
              label="✕ Avvisa"
              loadingLabel="Avvisar…"
              onClick={handleReject}
              btnState={get('reject')}
              variant="danger"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main TimelineZone ──────────────────────────────────────────────

export default function TimelineZone({ slug, meta, sections, zoneSections, projects, pending, refresh }) {
  const [activeTab, setActiveTab] = useState('gjort');
  const [quests, setQuests] = useState([]);
  const [questsLoading, setQuestsLoading] = useState(false);
  const { set: actSet, get: actGet } = useActionState();
  const { suggestion, loading: suggestLoading, error: suggestError, generate, clear: clearSuggestion } = useSuggestQuest(slug);
  const { set: questSet, get: questGet } = useActionState();

  // Fetch quests
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setQuestsLoading(true);
    fetchQuests({ slug })
      .then((data) => { if (!cancelled) setQuests(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setQuestsLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  const tabs = [
    { key: 'gjort', label: 'Gjort' },
    { key: 'nu', label: 'Nu' },
    { key: 'nasta', label: 'Nästa' },
  ];

  function renderMarkdown(content) {
    if (!content) return null;
    return (
      <div
        className="prose"
        style={{ marginTop: 12 }}
        dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
      />
    );
  }

  function renderZoneSections(sectionNames) {
    if (!sectionNames || !sections) return null;
    return sectionNames.map((name) =>
      sections[name] ? (
        <div key={name} style={{ marginTop: 12 }}>
          <div style={{
            fontSize: 12,
            color: 'var(--muted)',
            fontWeight: 600,
            fontFamily: '"JetBrains Mono", monospace',
            letterSpacing: '0.05em',
            marginBottom: 6,
          }}>
            {name.toUpperCase()}
          </div>
          {renderMarkdown(sections[name])}
        </div>
      ) : null
    );
  }

  // Stage stepper logic
  const currentStageIndex = STAGES.indexOf(meta?.stage);
  const nextStage = currentStageIndex >= 0 && currentStageIndex < STAGES.length - 1
    ? STAGES[currentStageIndex + 1]
    : null;

  async function handleAdvanceStage() {
    if (!nextStage) return;
    actSet('stage', 'loading', null);
    try {
      await updateProject(slug, { stage: nextStage });
      actSet('stage', 'done', null);
      refresh();
      setTimeout(() => actSet('stage', 'idle', null), 2000);
    } catch (err) {
      actSet('stage', 'error', err.message);
    }
  }

  // Quest action handlers
  async function handleActivateQuest(id) {
    actSet(`activate-${id}`, 'loading', null);
    try {
      await activateQuest(id);
      actSet(`activate-${id}`, 'done', null);
      // Refresh quests
      const data = await fetchQuests({ slug });
      setQuests(data);
      setTimeout(() => actSet(`activate-${id}`, 'idle', null), 2000);
    } catch (err) {
      actSet(`activate-${id}`, 'error', err.message);
    }
  }

  async function handleCompleteQuest(id) {
    actSet(`complete-${id}`, 'loading', null);
    try {
      await completeQuest(id);
      actSet(`complete-${id}`, 'done', null);
      const data = await fetchQuests({ slug });
      setQuests(data);
      setTimeout(() => actSet(`complete-${id}`, 'idle', null), 2000);
    } catch (err) {
      actSet(`complete-${id}`, 'error', err.message);
    }
  }

  // Create quest from suggestion
  async function handleCreateQuest() {
    if (!suggestion) return;
    questSet('create', 'loading', null);
    try {
      await createQuest({
        slug,
        title: suggestion.title,
        description: suggestion.description,
        estimated_impact: suggestion.estimated_impact,
      });
      questSet('create', 'done', null);
      clearSuggestion();
      const data = await fetchQuests({ slug });
      setQuests(data);
      setTimeout(() => questSet('create', 'idle', null), 2000);
    } catch (err) {
      questSet('create', 'error', err.message);
    }
  }

  const inProgressQuests = quests.filter((q) => q.status === 'in_progress');
  const activeQuests = quests.filter((q) => q.status === 'active');

  return (
    <div>
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid var(--accent)' : '2px solid transparent',
              color: activeTab === tab.key ? 'var(--accent)' : 'var(--muted)',
              fontSize: 12,
              fontFamily: '"JetBrains Mono", monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600,
              padding: '8px 16px',
              cursor: 'pointer',
              transition: 'color 0.15s, border-color 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Gjort tab ── */}
      {activeTab === 'gjort' && (
        <div>
          <Timeline slug={slug} projects={projects} />
          {renderZoneSections(zoneSections?.gjort)}
        </div>
      )}

      {/* ── Nu tab ── */}
      {activeTab === 'nu' && (
        <div>
          {/* Current slice */}
          {meta?.current_slice && (
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
            }}>
              <div style={{
                fontSize: 11,
                color: 'var(--muted)',
                fontWeight: 600,
                fontFamily: '"JetBrains Mono", monospace',
                letterSpacing: '0.05em',
                marginBottom: 8,
              }}>
                CURRENT SLICE
              </div>
              <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>
                {meta.current_slice}
              </div>
            </div>
          )}

          {/* Stage stepper */}
          {meta?.stage && (
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
            }}>
              <div style={{
                fontSize: 11,
                color: 'var(--muted)',
                fontWeight: 600,
                fontFamily: '"JetBrains Mono", monospace',
                letterSpacing: '0.05em',
                marginBottom: 12,
              }}>
                STAGE
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                {STAGES.map((s, i) => (
                  <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      background: i <= currentStageIndex ? getNodeStageColor(s) : 'var(--border)',
                      transition: 'background 0.2s',
                    }} />
                    <span style={{
                      fontSize: 11,
                      fontFamily: '"JetBrains Mono", monospace',
                      color: i <= currentStageIndex ? getNodeStageColor(s) : 'var(--muted)',
                      fontWeight: i === currentStageIndex ? 700 : 400,
                    }}>
                      {getNodeStageLabel(s)}
                    </span>
                    {i < STAGES.length - 1 && (
                      <span style={{ color: 'var(--border)', fontSize: 10, margin: '0 2px' }}>→</span>
                    )}
                  </span>
                ))}
              </div>
              {nextStage && (
                <div style={{ marginTop: 12 }}>
                  <ActionButton
                    label={`→ Nästa stage`}
                    loadingLabel="Uppdaterar…"
                    onClick={handleAdvanceStage}
                    btnState={actGet('stage')}
                    variant="accent"
                  />
                </div>
              )}
              {currentStageIndex === STAGES.length - 1 && (
                <div style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)', fontFamily: '"JetBrains Mono", monospace)' }}>
                  Högsta stage uppnådd
                </div>
              )}
            </div>
          )}

          {/* Quest display */}
          {!questsLoading && (inProgressQuests.length > 0 || activeQuests.length > 0) && (
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
            }}>
              <div style={{
                fontSize: 11,
                color: 'var(--muted)',
                fontWeight: 600,
                fontFamily: '"JetBrains Mono", monospace',
                letterSpacing: '0.05em',
                marginBottom: 10,
              }}>
                QUESTS
              </div>
              {/* In progress quests */}
              {inProgressQuests.map((q) => (
                <div key={q.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(251,191,36,0.06)',
                  border: '1px solid rgba(251,191,36,0.2)',
                  borderRadius: 6,
                  padding: '8px 12px',
                  marginBottom: 6,
                }}>
                  <div>
                    <span style={{
                      fontSize: 11,
                      color: '#fbbf24',
                      fontFamily: '"JetBrains Mono", monospace',
                      marginRight: 8,
                    }}>
                      IN_PROGRESS
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>{q.title}</span>
                  </div>
                  <ActionButton
                    label="Avsluta"
                    loadingLabel="Avslutar…"
                    onClick={() => handleCompleteQuest(q.id)}
                    btnState={actGet(`complete-${q.id}`)}
                    variant="success"
                  />
                </div>
              ))}
              {/* Active quests */}
              {activeQuests.map((q) => (
                <div key={q.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(99,102,241,0.06)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: 6,
                  padding: '8px 12px',
                  marginBottom: 6,
                }}>
                  <div>
                    <span style={{
                      fontSize: 11,
                      color: 'var(--accent)',
                      fontFamily: '"JetBrains Mono", monospace',
                      marginRight: 8,
                    }}>
                      ACTIVE
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>{q.title}</span>
                  </div>
                  <ActionButton
                    label="Starta"
                    loadingLabel="Startar…"
                    onClick={() => handleActivateQuest(q.id)}
                    btnState={actGet(`activate-${q.id}`)}
                    variant="accent"
                  />
                </div>
              ))}
            </div>
          )}
          {questsLoading && (
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Laddar quests…</div>
          )}

          {/* Zone sections for Nu */}
          {renderZoneSections(zoneSections?.nu)}
        </div>
      )}

      {/* ── Nästa tab ── */}
      {activeTab === 'nasta' && (
        <div>
          {renderZoneSections(zoneSections?.nasta)}

          {/* Suggest quest */}
          <div style={{ marginTop: 16 }}>
            <div style={{
              fontSize: 11,
              color: 'var(--muted)',
              fontWeight: 600,
              fontFamily: '"JetBrains Mono", monospace',
              letterSpacing: '0.05em',
              marginBottom: 8,
            }}>
              FÖRESLÅ QUEST
            </div>
            {!suggestion && !suggestLoading && (
              <button
                onClick={generate}
                style={{
                  padding: '6px 14px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontFamily: '"JetBrains Mono", monospace',
                  cursor: 'pointer',
                  background: 'transparent',
                  border: '1px solid var(--accent)',
                  color: 'var(--accent)',
                  transition: 'opacity 0.15s',
                }}
              >
                Föreslå quest →
              </button>
            )}
            {suggestLoading && (
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>Genererar förslag…</div>
            )}
            {suggestError && (
              <div style={{ fontSize: 13, color: '#fb7185' }}>Kunde inte generera: {suggestError}</div>
            )}
            {suggestion && (
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: 16,
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                  {suggestion.title}
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6, lineHeight: 1.5 }}>
                  {suggestion.description}
                </div>
                {suggestion.estimated_impact && (
                  <div style={{ fontSize: 12, color: 'var(--accent)', fontFamily: '"JetBrains Mono", monospace)', marginBottom: 10 }}>
                    Impact: {suggestion.estimated_impact}
                  </div>
                )}
                <ActionButton
                  label="Skapa quest →"
                  loadingLabel="Skapar…"
                  onClick={handleCreateQuest}
                  btnState={questGet('create')}
                  variant="accent"
                />
              </div>
            )}
          </div>

          {/* Pending field suggestions */}
          <PendingSection pending={pending} meta={meta} slug={slug} refresh={refresh} />
        </div>
      )}
    </div>
  );
}
