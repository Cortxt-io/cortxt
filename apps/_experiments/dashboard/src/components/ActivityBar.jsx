import { useState } from 'react';
import Tooltip from './Tooltip';

export default function ActivityBar({ activeMode, onModeChange, questCount = 0 }) {
  const [hovered, setHovered] = useState(null);

  const modes = [
    { id: 'graph', label: 'Graf', icon: '⬡' },
    { id: 'quests', label: 'Quests', icon: '☑' },
    { id: 'overview', label: 'Översikt', icon: '☰' },
  ];

  return (
    <div className="activity-bar" style={{ background: '#333333' }}>
      {modes.map(m => {
        const isActive = activeMode === m.id;
        const isHover = hovered === m.id;
        return (
          <Tooltip key={m.id} text={m.label}>
            <button
              onClick={() => onModeChange(m.id)}
              onMouseEnter={() => setHovered(m.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                background: 'transparent',
                color: isActive ? '#ffffff' : (isHover ? '#ffffff' : '#858585'),
                cursor: 'pointer',
                fontSize: 18,
                borderLeft: isActive ? '2px solid #ffffff' : '2px solid transparent',
                position: 'relative',
                padding: 0,
              }}
            >
              {m.icon}
              {m.id === 'quests' && questCount > 0 && (
                <span style={{
                  position: 'absolute', top: 6, right: 6,
                  minWidth: 16, height: 16, borderRadius: 8,
                  background: '#007acc', color: '#fff',
                  fontSize: 9, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 4px',
                }}>{questCount}</span>
              )}
            </button>
          </Tooltip>
        );
      })}
      <div style={{ flex: 1 }} />
      <Tooltip text="Inställningar">
        <button
          onMouseEnter={() => setHovered('settings')}
          onMouseLeave={() => setHovered(null)}
          style={{
            width: 48, height: 48,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', background: 'transparent',
            color: hovered === 'settings' ? '#ffffff' : '#858585',
            cursor: 'pointer', fontSize: 18, padding: 0,
          }}
        >⚙</button>
      </Tooltip>
    </div>
  );
}
