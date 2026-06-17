import { useState } from 'react';
import { runUpdate, runDevwatch, runDevlog, analyzeAll } from '../lib/api';
import { useToast } from '../hooks/useToast';

export default function ToolsPanel() {
  const { toast } = useToast();
  const [running, setRunning] = useState({});

  const run = async (key, fn, label) => {
    setRunning(r => ({ ...r, [key]: true }));
    try {
      await fn();
      toast(`${label} klar`, 'success');
    } catch (err) {
      toast(`${label} misslyckades: ${err.message}`, 'error');
    } finally {
      setRunning(r => ({ ...r, [key]: false }));
    }
  };

  const btnStyle = (isRunning) => ({
    padding: '6px 12px',
    fontSize: 11,
    border: '1px solid #3c3c3c',
    borderRadius: 3,
    background: isRunning ? '#2d2d2d' : 'transparent',
    color: isRunning ? '#858585' : '#cccccc',
    cursor: isRunning ? 'not-allowed' : 'pointer',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    transition: 'background 0.15s ease, border-color 0.15s ease',
  });

  const tools = [
    { key: 'update', fn: runUpdate, label: 'Full uppdatering', icon: '\u{1F504}' },
    { key: 'devwatch', fn: runDevwatch, label: 'Devwatch', icon: '\u{1F441}' },
    { key: 'devlog', fn: runDevlog, label: 'Devlog', icon: '\u{1F4DD}' },
    { key: 'analyze', fn: analyzeAll, label: 'Analysera alla', icon: '\u{1F9E0}' },
  ];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {tools.map(t => (
        <button
          key={t.key}
          style={btnStyle(running[t.key])}
          disabled={running[t.key]}
          onClick={() => run(t.key, t.fn, t.label)}
          onMouseEnter={e => { if (!running[t.key]) { e.currentTarget.style.borderColor = '#007acc'; e.currentTarget.style.color = '#ffffff'; } }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#3c3c3c'; e.currentTarget.style.color = running[t.key] ? '#858585' : '#cccccc'; }}
        >
          <span>{t.icon}</span>
          <span>{running[t.key] ? 'Kör...' : t.label}</span>
        </button>
      ))}
    </div>
  );
}
