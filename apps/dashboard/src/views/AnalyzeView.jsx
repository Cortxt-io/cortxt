import { useState, useCallback } from 'react';
import { analyzeProject, analyzeAll, approveProject, rejectProject } from '../lib/api';
import StatusBadge from '../components/StatusBadge';

// Button state: 'idle' | 'loading' | 'done' | 'error'
function useActionState() {
  const [states, setStates] = useState({});

  const set = useCallback((key, state, errMsg) => {
    setStates((prev) => ({ ...prev, [key]: { state, errMsg } }));
  }, []);

  const get = useCallback(
    (key) => states[key] ?? { state: 'idle', errMsg: null },
    [states],
  );

  return { set, get };
}

function ActionButton({ label, loadingLabel, onClick, btnState, variant = 'accent' }) {
  const { state, errMsg } = btnState;

  const baseStyle = {
    padding: '4px 12px',
    borderRadius: 4,
    fontSize: 13,
    fontFamily: 'var(--font-mono, monospace)',
    cursor: state === 'loading' ? 'not-allowed' : 'pointer',
    transition: 'opacity 0.15s',
    opacity: state === 'loading' ? 0.6 : 1,
    border: '1px solid',
  };

  const variantStyles = {
    accent: {
      background: 'transparent',
      borderColor: 'var(--accent)',
      color: 'var(--accent)',
    },
    success: {
      background: 'transparent',
      borderColor: '#34d399',
      color: '#34d399',
    },
    danger: {
      background: 'transparent',
      borderColor: '#fb7185',
      color: '#fb7185',
    },
    done: {
      background: 'transparent',
      borderColor: '#34d399',
      color: '#34d399',
    },
    error: {
      background: 'transparent',
      borderColor: '#fb7185',
      color: '#fb7185',
    },
  };

  const displayVariant = state === 'done' ? 'done' : state === 'error' ? 'error' : variant;
  const displayLabel =
    state === 'loading'
      ? loadingLabel
      : state === 'done'
      ? '✓ Klar'
      : state === 'error'
      ? 'Fel'
      : label;

  return (
    <div>
      <button
        onClick={onClick}
        disabled={state === 'loading'}
        style={{ ...baseStyle, ...variantStyles[displayVariant] }}
      >
        {displayLabel}
      </button>
      {state === 'error' && errMsg && (
        <div style={{ color: '#fb7185', fontSize: 11, marginTop: 3 }}>{errMsg}</div>
      )}
    </div>
  );
}

// ─── Section 1: Analysera projekt ────────────────────────────────────────────

function AnalyzeSection({ analyzeProjects, analyzeLoading, refreshAnalyze }) {
  const { set, get } = useActionState();
  const allState = get('__all__');

  async function handleAnalyzeAll() {
    set('__all__', 'loading', null);
    try {
      await analyzeAll();
      set('__all__', 'done', null);
      refreshAnalyze();
      setTimeout(() => set('__all__', 'idle', null), 2000);
    } catch (err) {
      set('__all__', 'error', err.message);
    }
  }

  async function handleAnalyze(slug) {
    set(slug, 'loading', null);
    try {
      await analyzeProject(slug);
      set(slug, 'done', null);
      refreshAnalyze();
      setTimeout(() => set(slug, 'idle', null), 2000);
    } catch (err) {
      set(slug, 'error', err.message);
    }
  }

  return (
    <section style={{ marginBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 18, color: 'var(--text)' }}>Analysera projekt</h2>
        <ActionButton
          label="Analysera alla →"
          loadingLabel="Analyserar…"
          onClick={handleAnalyzeAll}
          btnState={allState}
          variant="accent"
        />
      </div>

      {analyzeLoading ? (
        <p style={{ color: 'var(--muted)' }}>Laddar projektlista…</p>
      ) : analyzeProjects.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>Inga projekt hittades.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '6px 12px 6px 0', color: 'var(--muted)', fontWeight: 500 }}>Projekt</th>
              <th style={{ padding: '6px 12px', color: 'var(--muted)', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '6px 12px', color: 'var(--muted)', fontWeight: 500 }}>Uppdaterad</th>
              <th style={{ padding: '6px 12px', color: 'var(--muted)', fontWeight: 500 }}>Förslag</th>
              <th style={{ padding: '6px 0 6px 12px', color: 'var(--muted)', fontWeight: 500 }}></th>
            </tr>
          </thead>
          <tbody>
            {analyzeProjects.map((p) => (
              <tr
                key={p.slug}
                style={{ borderBottom: '1px solid var(--border)', verticalAlign: 'middle' }}
              >
                <td style={{ padding: '8px 12px 8px 0', color: 'var(--text)', fontWeight: 500 }}>
                  {p.title || p.slug}
                </td>
                <td style={{ padding: '8px 12px' }}>
                  {p.status ? <StatusBadge status={p.status} /> : <span style={{ color: 'var(--muted)' }}>—</span>}
                </td>
                <td style={{ padding: '8px 12px', color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)' }}>
                  {p.updated || '—'}
                </td>
                <td style={{ padding: '8px 12px' }}>
                  {p.has_pending ? (
                    <span
                      style={{
                        background: 'var(--accent)',
                        color: '#fff',
                        borderRadius: 10,
                        padding: '1px 7px',
                        fontSize: 11,
                        fontFamily: 'var(--font-mono, monospace)',
                      }}
                    >
                      {p.pending_count}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--muted)' }}>—</span>
                  )}
                </td>
                <td style={{ padding: '8px 0 8px 12px', textAlign: 'right' }}>
                  <ActionButton
                    label="Analysera →"
                    loadingLabel="Analyserar…"
                    onClick={() => handleAnalyze(p.slug)}
                    btnState={get(p.slug)}
                    variant="accent"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

// ─── Section 2: Väntande förslag ─────────────────────────────────────────────

function PendingSection({ pending, pendingLoading, projects, refreshAnalyze, refreshPending }) {
  const { set, get } = useActionState();

  // Build title lookup from projects list
  const titleBySlug = {};
  (projects || []).forEach((p) => {
    titleBySlug[p.slug] = p.title || p.slug;
  });

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

  return (
    <section>
      <h2 style={{ margin: '0 0 20px', fontSize: 18, color: 'var(--text)' }}>Väntande förslag</h2>

      {pendingLoading ? (
        <p style={{ color: 'var(--muted)' }}>Laddar förslag…</p>
      ) : pending.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>
          Inga väntande förslag. Kör <code style={{ fontFamily: 'var(--font-mono, monospace)' }}>cns analyze</code> eller använd knapparna ovan.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {pending.map((item) => {
            const title = titleBySlug[item.slug] || item.slug;
            const suggestions = item.suggestions || {};
            const fields = Object.keys(suggestions);
            const analyzedAt = item.analyzed_at
              ? new Date(item.analyzed_at).toLocaleString('sv-SE', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })
              : '—';

            return (
              <div
                key={item.slug}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {/* Header */}
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)', marginBottom: 4 }}>
                    {title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)' }}>
                    Analyserad {analyzedAt} · {fields.length} förslag
                  </div>
                </div>

                {/* Diff: field → proposed value */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {fields.map((field) => {
                    const value = suggestions[field];
                    const displayValue =
                      value === null || value === undefined
                        ? '(null)'
                        : typeof value === 'object'
                        ? JSON.stringify(value)
                        : String(value);

                    return (
                      <div
                        key={field}
                        style={{
                          background: 'var(--bg)',
                          borderRadius: 4,
                          padding: '6px 10px',
                          fontSize: 12,
                        }}
                      >
                        <span
                          style={{
                            color: 'var(--muted)',
                            fontFamily: 'var(--font-mono, monospace)',
                            marginRight: 6,
                          }}
                        >
                          {field}:
                        </span>
                        <span
                          style={{
                            color: 'var(--text)',
                            fontFamily: 'var(--font-mono, monospace)',
                            wordBreak: 'break-word',
                          }}
                        >
                          {displayValue.length > 120 ? displayValue.slice(0, 120) + '…' : displayValue}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <ActionButton
                    label="✓ Godkänn"
                    loadingLabel="Godkänner…"
                    onClick={() => handleApprove(item.slug)}
                    btnState={get(`approve_${item.slug}`)}
                    variant="success"
                  />
                  <ActionButton
                    label="✕ Avvisa"
                    loadingLabel="Avvisar…"
                    onClick={() => handleReject(item.slug)}
                    btnState={get(`reject_${item.slug}`)}
                    variant="danger"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

export default function AnalyzeView({
  analyzeProjects,
  analyzeLoading,
  refreshAnalyze,
  pending,
  pendingLoading,
  refreshPending,
  projects,
}) {
  return (
    <div style={{ padding: 32, maxWidth: 1100 }}>
      <h1 style={{ margin: '0 0 32px', fontSize: 22, color: 'var(--text)' }}>AI / Analysera</h1>
      <AnalyzeSection
        analyzeProjects={analyzeProjects}
        analyzeLoading={analyzeLoading}
        refreshAnalyze={refreshAnalyze}
      />
      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '32px 0' }} />
      <PendingSection
        pending={pending}
        pendingLoading={pendingLoading}
        projects={projects}
        refreshAnalyze={refreshAnalyze}
        refreshPending={refreshPending}
      />
    </div>
  );
}
