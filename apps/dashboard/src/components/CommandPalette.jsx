import { useState, useRef, useEffect, useMemo } from 'react';

export default function CommandPalette({ isOpen, onClose, projects = [], onSelectProject, onChangeMode }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const commands = useMemo(() => {
    const cmds = [
      { label: 'Läge: Graf', action: () => { onChangeMode('graph'); onClose(); } },
      { label: 'Läge: Quests', action: () => { onChangeMode('quests'); onClose(); } },
      { label: 'Läge: Översikt', action: () => { onChangeMode('overview'); onClose(); } },
      ...projects.map(p => ({
        label: `Gå till: ${p.title || p.slug}`,
        action: () => { onSelectProject(p); onClose(); },
      })),
    ];
    if (!query) return cmds;
    const q = query.toLowerCase();
    return cmds.filter(c => c.label.toLowerCase().includes(q));
  }, [query, projects, onSelectProject, onChangeMode, onClose]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, commands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (commands[activeIndex]) commands[activeIndex].action();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(2px)',
        display: 'flex', justifyContent: 'center', paddingTop: '15vh',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 500, maxHeight: 400,
          background: '#252526', border: '1px solid #3c3c3c',
          borderRadius: 6, overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          display: 'flex', flexDirection: 'column',
          alignSelf: 'flex-start',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid #3c3c3c' }}>
          <span style={{ color: '#858585', marginRight: 8, fontSize: 13 }}>&gt;</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Skriv ett kommando..."
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: '#cccccc', fontSize: 13,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
          />
        </div>
        <div style={{ overflowY: 'auto', maxHeight: 340 }}>
          {commands.map((cmd, i) => (
            <div
              key={i}
              onClick={() => cmd.action()}
              onMouseEnter={() => setActiveIndex(i)}
              style={{
                padding: '6px 12px',
                fontSize: 13,
                color: i === activeIndex ? '#ffffff' : '#cccccc',
                background: i === activeIndex ? '#007acc' : 'transparent',
                cursor: 'pointer',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              }}
            >
              {cmd.label}
            </div>
          ))}
          {commands.length === 0 && (
            <div style={{ padding: '12px', color: '#858585', fontSize: 13, textAlign: 'center' }}>
              Inga matchande kommandon
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
