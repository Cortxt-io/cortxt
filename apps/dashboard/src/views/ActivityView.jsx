import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useActivity from '../hooks/useActivity';
import useActionState from '../hooks/useActionState';
import ActionButton from '../components/ActionButton';
import { runDevwatch, runDevlog, runUpdate } from '../lib/api';

export default function ActivityView() {
  const navigate = useNavigate();
  const { devwatchEvents, devwatchDate, devlogHtml, devlogDate, hasActivity, loading, error, refresh } = useActivity();
  const { set, get } = useActionState();

  async function handleRunUpdate() {
    set('updateAll', 'loading', null);
    try {
      const result = await runUpdate();
      if (result.status === 'error') {
        set('updateAll', 'error', result.message);
      } else {
        set('updateAll', 'done', null);
        refresh();
        setTimeout(() => set('updateAll', 'idle', null), 2000);
      }
    } catch (err) {
      set('updateAll', 'error', err.message);
    }
  }

  async function handleRunDevwatch() {
    set('devwatch', 'loading', null);
    try {
      const result = await runDevwatch();
      if (result.status === 'error') {
        set('devwatch', 'error', result.message);
      } else {
        set('devwatch', 'done', null);
        refresh();
        setTimeout(() => set('devwatch', 'idle', null), 2000);
      }
    } catch (err) {
      set('devwatch', 'error', err.message);
    }
  }

  async function handleRunDevlog() {
    set('devlog', 'loading', null);
    try {
      const result = await runDevlog();
      if (result.status === 'error') {
        set('devlog', 'error', result.message);
      } else {
        set('devlog', 'done', null);
        refresh();
        setTimeout(() => set('devlog', 'idle', null), 2000);
      }
    } catch (err) {
      set('devlog', 'error', err.message);
    }
  }

  if (loading) {
    return (
      <div className="view-padding">
        <h1 style={{ margin: '0 0 32px', fontSize: 22, color: 'var(--text)' }}>Activity</h1>
        <p style={{ color: 'var(--muted)' }}>Laddar aktivitet…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-padding">
        <h1 style={{ margin: '0 0 16px', fontSize: 22, color: 'var(--text)' }}>Activity</h1>
        <div style={{ color: '#fb7185', fontSize: 13 }}>{error}</div>
      </div>
    );
  }

  if (!hasActivity) {
    return (
      <div className="view-padding">
        <div className="view-header">
          <h1 style={{ margin: 0, fontSize: 22, color: 'var(--text)' }}>Activity</h1>
          <div className="view-header-actions">
            <ActionButton
              label="Uppdatera allt"
              loadingLabel="Kör…"
              onClick={handleRunUpdate}
              btnState={get('updateAll')}
              variant="accent"
            />
          </div>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, maxWidth: 500 }}>
          Ingen aktivitet registrerad ännu. Kör "Uppdatera allt" för att generera devwatch- och devlog-data, eller vänta på daglig GitHub Actions-körning.
        </p>
      </div>
    );
  }

  function formatDevwatchDate() {
    if (!devwatchDate) return '';
    try {
      return new Date(devwatchDate).toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' });
    } catch {
      return devwatchDate;
    }
  }

  return (
    <div className="view-padding">
      <div className="view-header">
        <h1 style={{ margin: 0, fontSize: 22, color: 'var(--text)' }}>Activity</h1>
        <div className="view-header-actions">
          <ActionButton
            label="Uppdatera allt"
            loadingLabel="Kör…"
            onClick={handleRunUpdate}
            btnState={get('updateAll')}
            variant="accent"
          />
          <ActionButton
            label="Devwatch"
            loadingLabel="Kör…"
            onClick={handleRunDevwatch}
            btnState={get('devwatch')}
            variant="secondary"
          />
          <ActionButton
            label="Devlog"
            loadingLabel="Kör…"
            onClick={handleRunDevlog}
            btnState={get('devlog')}
            variant="secondary"
          />
        </div>
      </div>

      {/* Section 1: Daily summary */}
      {devlogHtml && (
        <section style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 18, color: 'var(--text)' }}>Daglig sammanfattning</h2>
            <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)' }}>
              {devlogDate}
            </span>
          </div>
          <div
            className="prose"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: 20,
              fontSize: 14,
              color: 'var(--text)',
              lineHeight: 1.6,
            }}
            dangerouslySetInnerHTML={{ __html: devlogHtml }}
          />
        </section>
      )}

      {/* Section 2: Recent changes */}
      {devwatchEvents.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 18, color: 'var(--text)' }}>Senaste ändringar</h2>
            <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)' }}>
              {formatDevwatchDate()}
            </span>
          </div>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            overflow: 'hidden',
          }}>
            {devwatchEvents.map((event, idx) => {
              const meta = event.meta || {};
              const slug = meta.slug || event.source?.id || '';
              const projectTitle = meta.project_title || event.source?.name || slug;
              const changedFields = meta.changed_fields || [];
              const changedFiles = (meta.changed_files || []).map(f => f.file || f);

              return (
                <div
                  key={event.id || idx}
                  style={{
                    padding: '12px 16px',
                    borderBottom: idx < devwatchEvents.length - 1 ? '1px solid var(--border)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <button
                      onClick={() => navigate(`/project/${slug}`)}
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                        color: 'var(--accent)',
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        fontFamily: 'inherit',
                      }}
                    >
                      {projectTitle}
                    </button>
                    <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)' }}>
                      [{slug}]
                    </span>
                  </div>
                  {changedFields.length > 0 && (
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      Ändrade fält: {changedFields.join(', ')}
                    </div>
                  )}
                  {changedFiles.length > 0 && (
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      Ändrade filer: {changedFiles.join(', ')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
