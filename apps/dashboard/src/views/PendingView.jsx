const API = 'https://project-cns-production.up.railway.app';

export default function PendingView({ projects, pending, pendingLoading, pendingError }) {
  if (pendingLoading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '50vh' }}>
        <p className="text-muted animate-pulse font-mono text-sm">Loading pending…</p>
      </div>
    );
  }

  if (pendingError) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '50vh' }}>
        <p className="text-rose-400 text-sm">Error loading pending: {pendingError}</p>
      </div>
    );
  }

  if (pending.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center"
        style={{ minHeight: '50vh', gap: '0.75rem' }}
      >
        <p className="text-lg font-semibold text-text">Inga väntande förslag</p>
        <p className="text-sm text-muted" style={{ maxWidth: 400, textAlign: 'center', lineHeight: 1.6 }}>
          Kör <code style={{ color: 'var(--accent)', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8rem' }}>cns analyze</code> i ett projekt för att generera AI-förslag som dycker upp här.
        </p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      <h2 className="text-xl font-bold text-text mb-4">Väntande AI-förslag</h2>
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}
      >
        {pending.map((item) => {
          const proj = projects.find((p) => p.slug === item.slug);
          const title = proj?.title ?? item.slug;
          const suggestionKeys = item.suggestions ? Object.keys(item.suggestions) : [];
          const suggestionCount = suggestionKeys.length;

          return (
            <div
              key={item.slug}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '1.25rem',
              }}
            >
              <h3 className="text-lg font-bold text-text mb-1">{title}</h3>

              {item.analyzed_at && (
                <p
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.75rem',
                    color: 'var(--muted)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {new Date(item.analyzed_at).toLocaleDateString('sv-SE')}
                </p>
              )}

              <p
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.8rem',
                  color: 'var(--text)',
                  marginBottom: '0.5rem',
                }}
              >
                {suggestionCount} förslag
              </p>

              {suggestionKeys.length > 0 && (
                <p
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.7rem',
                    color: 'var(--muted)',
                    marginBottom: '1rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {suggestionKeys.join(', ')}
                </p>
              )}

              <a
                href={`${API}/review?slug=${item.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.75rem',
                  padding: '0.5rem 1rem',
                  borderRadius: 6,
                  background: 'var(--accent)',
                  color: '#fff',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                Granska i Vault →
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
