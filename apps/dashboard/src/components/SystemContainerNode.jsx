import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { getKindHexColor, getNodeStageColor } from '../data/labels';

function SystemContainerNode({ data, selected }) {
  const { title, kind, stage, childCount, dimmed, collapsed } = data;
  const kindColor = getKindHexColor(kind);
  const stageColor = getNodeStageColor(stage);

  // Parse kindColor to build rgba at 4% opacity
  const kindRgba = (() => {
    const hex = kindColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r},${g},${b},0.04)`;
  })();

  // ── COLLAPSED VARIANT — compact summary ──
  if (collapsed) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: kindRgba,
          border: `1px solid ${selected ? '#007acc' : kindColor}`,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 12px',
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: 12,
          color: '#cccccc',
          cursor: 'pointer',
          opacity: dimmed ? 0.2 : 1,
          pointerEvents: dimmed ? 'none' : 'auto',
          transition: 'all 0.2s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: '#4e4e4e', width: 6, height: 6, border: 'none', zIndex: 10 }}
        />
        {/* Left accent */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: kindColor,
          borderRadius: '6px 0 0 6px',
        }} />
        {/* Stage dot */}
        <div style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: stageColor,
          flexShrink: 0,
          marginLeft: 4,
        }} />
        {/* Title */}
        <span style={{
          fontWeight: 600,
          fontSize: 12,
          color: '#ffffff',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
        }}>
          {title}
        </span>
        {/* Child count badge */}
        {childCount > 0 && (
          <span style={{
            fontSize: 10,
            padding: '1px 6px',
            borderRadius: 8,
            background: `${kindColor}22`,
            color: kindColor,
            flexShrink: 0,
          }}>
            {childCount}
          </span>
        )}
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: '#4e4e4e', width: 6, height: 6, border: 'none', zIndex: 10 }}
        />
      </div>
    );
  }

  // ── EXPANDED VARIANT — existing rendering ──
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: kindRgba,
        border: `1px solid ${selected ? '#007acc' : kindColor}`,
        borderRadius: 6,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: 12,
        color: '#cccccc',
        cursor: 'pointer',
        opacity: dimmed ? 0.2 : 1,
        pointerEvents: dimmed ? 'none' : 'auto',
        transition: 'border-color 0.15s ease',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#4e4e4e', width: 6, height: 6, border: 'none', zIndex: 10 }}
      />

      {/* Header area */}
      <div style={{
        height: 40,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        paddingLeft: 0,
        paddingRight: 12,
        borderBottom: `1px solid ${kindColor}20`,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Left accent bar */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: kindColor,
        }} />

        {/* Title */}
        <span style={{
          fontWeight: 700,
          fontSize: 14,
          color: '#ffffff',
          paddingLeft: 12,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
        }}>
          {title}
        </span>

        {/* Stage dot */}
        <div style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: stageColor,
          flexShrink: 0,
        }} />

        {/* Child count badge */}
        {childCount > 0 && (
          <span style={{
            fontSize: 10,
            lineHeight: '16px',
            padding: '0 5px',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.06)',
            color: '#858585',
            flexShrink: 0,
          }}>
            {childCount}
          </span>
        )}
      </div>

      {/* Children are rendered by ReactFlow via parentNode/extent */}

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#4e4e4e', width: 6, height: 6, border: 'none', zIndex: 10 }}
      />
    </div>
  );
}

export default memo(SystemContainerNode);
