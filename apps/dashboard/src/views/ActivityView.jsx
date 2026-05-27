import { useNavigate } from 'react-router-dom';
import useActivity from '../hooks/useActivity';

export default function ActivityView() {
  const navigate = useNavigate();
  const { devwatchEvents, devwatchDate, devlogHtml, devlogDate, hasActivity, loading, error } = useActivity();

  if (loading) {
    return (
      <div style={{ padding: 32, maxWidth: 1100 }}>
        <h1 style={{ margin: '0 0 32px', fontSize: 22, color: 'var(--text)' }}>Activity</h1>
        <p style={{ color: 'var(--muted)' }}>Laddar aktivitet…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 32, maxWidth: 1100 }}>
        <h1 style={{ margin: '0 0 16px', fontSize: 22, color: 'var(--text)' }}>Activity</h1>
        <div style={{ color: '#fb7185', fontSize: 13 }}>{error}</div>
      </div>
    );
  }

  if (!hasActivity) {
    return (
      <div style={{ padding: 32, maxWidth: 1100 }}>
        <h1 style={{ margin: '0 0 32px', fontSize: 22, color: 'var(--text)' }}>Activity</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, maxWidth: 500 }}>
          Ingen aktivitet registrerad ännu. Devwatch och devlog körs automatiskt dagligen via GitHub Actions.
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
    <div style={{ padding: 32, maxWidth: 1100 }}>
      <h1 style={{ margin: '0 0 32px', fontSize: 22, color: 'var(--text)' }}>Activity</h1>

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