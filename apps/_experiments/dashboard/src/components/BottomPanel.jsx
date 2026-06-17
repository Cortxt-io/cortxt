import { useState, useRef, useCallback, useEffect } from 'react';
import EventFeed from './EventFeed';
import useQuests from '../hooks/useQuests';
import ToolsPanel from './ToolsPanel';

const TABS = ['Events', 'Quests', 'Brief', 'Verktyg'];
const STORAGE_KEY = 'cortxt-bottom-tab';
const HEIGHT_KEY = 'cortxt-bottom-height';
const MIN_HEIGHT = 32;
const DEFAULT_HEIGHT = 180;
const MAX_HEIGHT_VH = 50;

function getInitialHeight() {
  try {
    const stored = parseInt(localStorage.getItem(HEIGHT_KEY), 10);
    if (stored && stored >= MIN_HEIGHT) return stored;
  } catch {}
  return DEFAULT_HEIGHT;
}

function getInitialTab() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && TABS.includes(stored)) return stored;
  } catch {}
  return TABS[0];
}

function QuestsContent() {
  const { quests } = useQuests();
  const active = quests.filter(q => q.status === 'active' || q.status === 'in_progress');

  if (active.length === 0) {
    return <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>Inga aktiva quests</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {active.map(q => (
        <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
          <span style={{
            color: q.status === 'in_progress' ? '#fbbf24' : '#6366f1',
            fontWeight: 600,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            minWidth: 70,
          }}>
            {q.status === 'in_progress' ? 'PÅGÅR' : 'AKTIV'}
          </span>
          <span style={{ color: 'var(--text)', flex: 1 }}>{q.title}</span>
          <span style={{ color: 'var(--muted)', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
            {q.slug}
          </span>
        </div>
      ))}
    </div>
  );
}

function BriefContent({ brief, briefLoading }) {
  if (briefLoading) {
    return <div style={{ fontSize: 12, color: 'var(--muted)' }}>Laddar brief…</div>;
  }
  if (!brief) {
    return <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>Ingen brief tillgänglig</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {brief.situation && (
        <div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>SITUATION</div>
          <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.5 }}>{brief.situation}</div>
        </div>
      )}
      {brief.quest_suggestion && (
        <div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>QUEST-FÖRSLAG</div>
          <div style={{ fontSize: 12, color: 'var(--text)', fontWeight: 600 }}>{brief.quest_suggestion.title}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{brief.quest_suggestion.description}</div>
        </div>
      )}
    </div>
  );
}

export default function BottomPanel({ projects, brief, briefLoading, onNewEvents }) {
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [height, setHeight] = useState(getInitialHeight);
  const [isDragging, setIsDragging] = useState(false);
  const dragging = useRef(false);
  const startY = useRef(0);
  const startH = useRef(0);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    try { localStorage.setItem(STORAGE_KEY, tab); } catch {}
  }, []);

  // Resize drag
  const onMouseDown = useCallback((e) => {
    dragging.current = true;
    setIsDragging(true);
    startY.current = e.clientY;
    startH.current = height;
    e.preventDefault();
  }, [height]);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragging.current) return;
      const maxH = window.innerHeight * (MAX_HEIGHT_VH / 100);
      const delta = startY.current - e.clientY;
      const newH = Math.min(maxH, Math.max(MIN_HEIGHT, startH.current + delta));
      setHeight(newH);
    };
    const onMouseUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      setIsDragging(false);
      try { localStorage.setItem(HEIGHT_KEY, String(Math.round(height))); } catch {}
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [height]);

  // Double-click toggle
  const onDoubleClick = useCallback(() => {
    setHeight(h => {
      const newH = h <= MIN_HEIGHT ? DEFAULT_HEIGHT : MIN_HEIGHT;
      try { localStorage.setItem(HEIGHT_KEY, String(newH)); } catch {}
      return newH;
    });
  }, []);

  const tabStyle = (active) => ({
    padding: '0 12px',
    fontSize: 11,
    fontWeight: active ? 400 : 400,
    color: active ? '#ffffff' : '#858585',
    background: 'transparent',
    border: 'none',
    borderBottom: active ? '1px solid #007acc' : '1px solid transparent',
    cursor: 'pointer',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  });

  const isCollapsed = height <= MIN_HEIGHT;

  return (
    <div
      className="bottom-panel"
      style={{ height, minHeight: MIN_HEIGHT, background: 'var(--surface)', borderTop: '1px solid var(--border)', transition: isDragging ? 'none' : 'height 0.2s ease' }}
    >
      {/* Drag handle */}
      <div
        onMouseDown={onMouseDown}
        onDoubleClick={onDoubleClick}
        style={{
          height: 4,
          cursor: 'row-resize',
          flexShrink: 0,
        }}
      />

      {/* Tab bar */}
      <div style={{ display: 'flex', height: 35, borderBottom: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0, paddingLeft: 8 }}>
        {TABS.map(tab => (
          <button key={tab} style={tabStyle(activeTab === tab)} onClick={() => handleTabChange(tab)}>
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div style={{ flex: 1, padding: '8px 12px', overflowY: 'auto', fontSize: 12, lineHeight: 1.5, color: 'var(--text)' }}>
          {activeTab === 'Events' && <EventFeed onNewEvents={onNewEvents} />}
          {activeTab === 'Quests' && <QuestsContent />}
          {activeTab === 'Brief' && <BriefContent brief={brief} briefLoading={briefLoading} />}
          {activeTab === 'Verktyg' && <ToolsPanel />}
        </div>
      )}
    </div>
  );
}
