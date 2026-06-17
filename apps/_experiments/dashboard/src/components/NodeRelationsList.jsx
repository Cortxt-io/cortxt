import { useNavigate } from 'react-router-dom';

export default function NodeRelationsList({ feeds, dependsOn, partOf }) {
  const navigate = useNavigate();
  const hasFeeds = feeds && feeds.length > 0;
  const hasDepends = dependsOn && dependsOn.length > 0;
  const hasPartOf = !!partOf;

  if (!hasFeeds && !hasDepends && !hasPartOf) return null;

  function SlugLink({ slug }) {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); navigate('/project/' + slug); }}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          color: 'var(--accent)',
          cursor: 'pointer',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.8rem',
        }}
      >
        {slug}
      </button>
    );
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: 16,
      marginBottom: '1rem',
    }}>
      <div style={{
        fontSize: 12,
        color: 'var(--muted)',
        fontWeight: 600,
        marginBottom: 8,
        fontFamily: 'var(--font-mono, monospace)',
      }}>
        RELATIONER
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {hasPartOf && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
            <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: '"JetBrains Mono", monospace', minWidth: 90 }}>Part of</span>
            <SlugLink slug={partOf} />
          </div>
        )}
        {hasFeeds && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
            <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: '"JetBrains Mono", monospace', minWidth: 90 }}>Feeds</span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {feeds.map((s) => <SlugLink key={s} slug={s} />)}
            </div>
          </div>
        )}
        {hasDepends && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
            <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: '"JetBrains Mono", monospace', minWidth: 90 }}>Depends on</span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {dependsOn.map((s) => <SlugLink key={s} slug={s} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
