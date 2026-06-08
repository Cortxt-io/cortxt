import { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';

function getStageColor(stage) {
  switch (stage) {
    case 'working': return '#4ec9b0';
    case 'building': return '#dcdcaa';
    case 'idea': return '#007acc';
    default: return '#858585';
  }
}

function GraphNode({ data, selected }) {
  const { title, stage, family, dimmed } = data;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '8px 14px',
        background: selected ? 'rgba(0,122,204,0.1)' : '#2d2d2d',
        border: `1px solid ${selected ? '#007acc' : '#3c3c3c'}`,
        borderRadius: 3,
        minWidth: 200,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: 12,
        color: '#cccccc',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        transform: hovered ? 'scale(1.02)' : 'scale(1)',
        boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
        opacity: dimmed ? 0.2 : 1,
        pointerEvents: dimmed ? 'none' : 'auto',
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#4e4e4e', width: 6, height: 6, border: 'none' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: getStageColor(stage), flexShrink: 0 }} />
        <span style={{ fontWeight: 500, color: selected ? '#ffffff' : '#cccccc' }}>{title}</span>
        <span style={{ fontSize: 10, color: '#858585', textTransform: 'uppercase', marginLeft: 'auto' }}>{stage}</span>
      </div>
      {family && (
        <div style={{ fontSize: 10, color: '#858585', marginTop: 4, paddingLeft: 16 }}>{family}</div>
      )}
      <Handle type="source" position={Position.Right} style={{ background: '#4e4e4e', width: 6, height: 6, border: 'none' }} />
    </div>
  );
}

export default memo(GraphNode);
