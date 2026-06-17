import { useState } from 'react';
import { KIND_HEX_COLORS } from '../data/labels';

const FEEDS_COLOR = '#007acc';
const DEPENDS_COLOR = '#f59e0b';

export default function GraphLegend() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div style={{
      position: 'absolute',
      top: 8,
      right: 8,
      zIndex: 50,
      background: '#252526',
      border: '1px solid #3c3c3c',
      borderRadius: 4,
      fontSize: 11,
      color: '#cccccc',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      minWidth: 140,
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    }}>
      {/* Header */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '5px 8px',
          background: 'none',
          border: 'none',
          color: '#cccccc',
          cursor: 'pointer',
          fontSize: 11,
          fontFamily: 'inherit',
          textAlign: 'left',
        }}
      >
        <span style={{ fontWeight: 600 }}>Legend</span>
        <span style={{ fontSize: 9, color: '#858585' }}>{expanded ? '▾' : '▸'}</span>
      </button>

      {expanded && (
        <div style={{ padding: '0 8px 8px' }}>
          {/* Kind section */}
          <div style={{ marginBottom: 6, color: '#858585', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Kinds</div>
          {[
            { label: 'System', color: KIND_HEX_COLORS.system },
            { label: 'Component', color: KIND_HEX_COLORS.component },
            { label: 'Framework', color: KIND_HEX_COLORS.framework, note: '(canvas)' },
          ].map(({ label, color, note }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <span>{label}</span>
              {note && <span style={{ color: '#64748b', fontSize: 9 }}>{note}</span>}
            </div>
          ))}

          {/* Edge section */}
          <div style={{ marginTop: 8, marginBottom: 6, color: '#858585', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Edges</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <svg width="24" height="8" style={{ flexShrink: 0 }}>
              <line x1="0" y1="4" x2="18" y2="4" stroke={FEEDS_COLOR} strokeWidth="1.5" />
              <polygon points="18,1 24,4 18,7" fill={FEEDS_COLOR} />
            </svg>
            <span>feeds</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <svg width="24" height="8" style={{ flexShrink: 0 }}>
              <line x1="0" y1="4" x2="18" y2="4" stroke={DEPENDS_COLOR} strokeWidth="1.5" />
              <polygon points="18,1 24,4 18,7" fill={DEPENDS_COLOR} />
            </svg>
            <span>depends_on</span>
          </div>
        </div>
      )}
    </div>
  );
}
