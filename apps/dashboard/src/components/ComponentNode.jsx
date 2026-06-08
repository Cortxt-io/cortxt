import { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { getNodeStageColor, getKindHexColor } from '../data/labels';

function ComponentNode({ data, selected }) {
  const { title, stage, kind, dimmed, parked } = data;
  const [hovered, setHovered] = useState(false);

  const stageColor = getNodeStageColor(stage);
  const kindColor = getKindHexColor(kind);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 180,
        height: 50,
        display: 'flex',
        alignItems: 'center',
        background: selected ? 'rgba(0,122,204,0.1)' : '#2d2d2d',
        border: `1px solid ${selected ? '#007acc' : '#3c3c3c'}`,
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: 12,
        color: '#cccccc',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        transform: hovered ? 'scale(1.02)' : 'scale(1)',
        boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
        opacity: dimmed ? 0.2 : (parked ? 0.4 : 1),
        pointerEvents: dimmed ? 'none' : 'auto',
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: stageColor,
          borderRadius: '4px 0 0 4px',
        }}
      />

      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#4e4e4e', width: 6, height: 6, border: 'none' }}
      />

      {/* Content area */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        paddingLeft: 10,
        paddingRight: 8,
        overflow: 'hidden',
      }}>
        {/* Stage dot */}
        <div style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: stageColor,
          flexShrink: 0,
        }} />

        {/* Title */}
        <span style={{
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: selected ? '#ffffff' : '#cccccc',
        }}>
          {title}
        </span>

        {/* Kind badge */}
        <span style={{
          fontSize: 9,
          lineHeight: '14px',
          padding: '0 4px',
          borderRadius: 2,
          background: `${kindColor}20`,
          color: kindColor,
          flexShrink: 0,
          textTransform: 'uppercase',
          letterSpacing: 0.3,
        }}>
          {kind}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#4e4e4e', width: 6, height: 6, border: 'none' }}
      />
    </div>
  );
}

export default memo(ComponentNode);
