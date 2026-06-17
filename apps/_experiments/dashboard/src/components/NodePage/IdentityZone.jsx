import KindBadge from '../KindBadge';
import { getNodeStageColor, getNodeStageLabel } from '../../data/labels';

function roiColor(value) {
  if (value >= 250) return 'var(--success)';
  if (value > 0) return '#f59e0b';
  return 'var(--muted)';
}

function formatSEK(n) {
  if (n == null) return '—';
  return n.toLocaleString('sv-SE') + ' kr';
}

function MetaItem({ label, value, valueStyle, link }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '10px 14px',
    }}>
      <div style={{
        fontSize: 11,
        color: 'var(--muted)',
        fontFamily: '"JetBrains Mono", monospace',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        marginBottom: 4,
      }}>
        {label}
      </div>
      {link ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {value}
        </a>
      ) : (
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', ...valueStyle }}>{value}</div>
      )}
    </div>
  );
}

export default function IdentityZone({ meta, projects }) {
  if (!meta) return null;

  const hasKind = !!meta.kind;

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Title row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <h1 style={{
          fontSize: 24,
          fontWeight: 800,
          color: 'var(--text)',
          letterSpacing: '-0.03em',
          margin: 0,
        }}>
          {meta.title}
        </h1>
        {hasKind && <KindBadge kind={meta.kind} />}
      </div>

      {/* Stage indicator */}
      {hasKind && meta.stage && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            background: getNodeStageColor(meta.stage),
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: 12,
            fontFamily: '"JetBrains Mono", monospace',
            color: getNodeStageColor(meta.stage),
            fontWeight: 600,
            letterSpacing: '0.05em',
          }}>
            {getNodeStageLabel(meta.stage)}
          </span>
        </div>
      )}

      {/* Summary line */}
      {meta.summary && (
        <div style={{
          fontSize: 14,
          color: 'var(--muted)',
          marginTop: 8,
          lineHeight: 1.5,
        }}>
          {meta.summary}
        </div>
      )}

      {/* Legacy fallback: ROI/Cost/Value grid for nodes without kind */}
      {!hasKind && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 12,
          marginTop: 16,
        }}>
          <MetaItem label="ROI" value={`${meta.roi_percent ?? 0}%`} valueStyle={{ color: roiColor(meta.roi_percent) }} />
          <MetaItem label="Cost" value={formatSEK(meta.cost_sek)} />
          <MetaItem label="Value" value={formatSEK(meta.value_sek)} />
        </div>
      )}
    </div>
  );
}
