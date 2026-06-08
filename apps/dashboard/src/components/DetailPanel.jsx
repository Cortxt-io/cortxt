import { useState, useRef, useCallback, useEffect } from 'react';
import { updateProject, analyzeProject } from '../lib/api';
import { useToast } from '../hooks/useToast';

const DETAIL_WIDTH_KEY = 'cortxt-detail-width';
const DEFAULT_WIDTH = 320;
const MIN_WIDTH = 200;

function getInitialWidth() {
  try {
    const stored = parseInt(localStorage.getItem(DETAIL_WIDTH_KEY), 10);
    if (stored && stored >= MIN_WIDTH) return stored;
  } catch {}
  return DEFAULT_WIDTH;
}

export default function DetailPanel({ project, onClose }) {
  const [width, setWidth] = useState(getInitialWidth);
  const [analyzing, setAnalyzing] = useState(false);
  const { toast } = useToast();
  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(0);
  const panelRef = useRef(null);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragging.current) return;
      const maxW = window.innerWidth * 0.5;
      const delta = startX.current - e.clientX;
      const newW = Math.min(maxW, Math.max(MIN_WIDTH, startW.current + delta));
      setWidth(newW);
    };
    const onMouseUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      if (panelRef.current) panelRef.current.style.transition = 'width 0.2s ease';
      try { localStorage.setItem(DETAIL_WIDTH_KEY, String(Math.round(width))); } catch {}
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [width]);

  const onResizeStart = useCallback((e) => {
    dragging.current = true;
    startX.current = e.clientX;
    startW.current = width;
    if (panelRef.current) panelRef.current.style.transition = 'none';
    e.preventDefault();
  }, [width]);

  if (!project) return null;

  const stageColors = {
    working: '#4ec9b0',
    building: '#dcdcaa',
    idea: '#007acc',
  };

  const sectionTitle = { fontSize: 11, fontWeight: 600, color: '#858585', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 };

  return (
    <div ref={panelRef} className="detail-panel" style={{ background: '#252526', borderLeft: '1px solid #3c3c3c', padding: 16, width, transition: 'width 0.2s ease' }}>
      {/* Resize handle */}
      <div
        onMouseDown={onResizeStart}
        style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: 4, cursor: 'col-resize', zIndex: 10,
        }}
      />
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 8, right: 8,
          width: 22, height: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'none', border: 'none',
          color: '#858585', cursor: 'pointer', fontSize: 16,
          borderRadius: 3,
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#3c3c3c'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
      >×</button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: stageColors[project.stage] || '#858585' }} />
        <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: '#ffffff' }}>{project.title || project.slug}</h2>
      </div>
      <button
        onClick={async () => {
          const stages = ['idea', 'building', 'working'];
          const currentIdx = stages.indexOf(project.stage);
          const nextStage = stages[(currentIdx + 1) % stages.length];
          try {
            await updateProject(project.slug, { status: nextStage });
            toast(`Stage ändrad till ${nextStage}`, 'success');
          } catch (err) {
            toast(`Kunde inte ändra stage: ${err.message}`, 'error');
          }
        }}
        style={{
          fontSize: 10, padding: '2px 6px', borderRadius: 3, fontWeight: 500,
          textTransform: 'uppercase', display: 'inline-block', marginTop: 4,
          background: `${stageColors[project.stage] || '#858585'}22`,
          color: stageColors[project.stage] || '#858585',
          border: `1px solid ${stageColors[project.stage] || '#858585'}44`,
          cursor: 'pointer',
        }}
        title="Klicka för att ändra stage"
      >
        {project.stage} ↻
      </button>
      <button
        onClick={async () => {
          setAnalyzing(true);
          try {
            await analyzeProject(project.slug);
            toast('Analys klar', 'success');
          } catch (err) {
            toast(`Analys misslyckades: ${err.message}`, 'error');
          } finally {
            setAnalyzing(false);
          }
        }}
        disabled={analyzing}
        style={{
          marginTop: 8, padding: '4px 10px', fontSize: 11,
          background: 'transparent', border: '1px solid #3c3c3c', borderRadius: 3,
          color: analyzing ? '#858585' : '#cccccc', cursor: analyzing ? 'not-allowed' : 'pointer',
          display: 'block',
        }}
      >
        {analyzing ? '🧠 Analyserar...' : '🧠 Analysera'}
      </button>

      {project.syfte && (
        <div style={{ marginTop: 20 }}>
          <div style={sectionTitle}>SYFTE</div>
          <div style={{ fontSize: 13, lineHeight: 1.5, color: '#cccccc' }}>{project.syfte}</div>
        </div>
      )}

      {project.purpose && !project.syfte && (
        <div style={{ marginTop: 20 }}>
          <div style={sectionTitle}>SYFTE</div>
          <div style={{ fontSize: 13, lineHeight: 1.5, color: '#cccccc' }}>{project.purpose}</div>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <div style={sectionTitle}>KOPPLINGAR</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {project.part_of && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <span style={{ color: '#858585', minWidth: 80 }}>part_of</span>
              <span style={{ padding: '2px 8px', background: '#2d2d2d', border: '1px solid #3c3c3c', borderRadius: 3, fontSize: 11, color: '#cccccc' }}>{project.part_of}</span>
            </div>
          )}
          {project.feeds && project.feeds.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <span style={{ color: '#858585', minWidth: 80 }}>feeds →</span>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {project.feeds.map(f => (
                  <span key={f} style={{ padding: '2px 8px', background: '#2d2d2d', border: '1px solid #3c3c3c', borderRadius: 3, fontSize: 11, color: '#cccccc' }}>{f}</span>
                ))}
              </div>
            </div>
          )}
          {project.depends_on && project.depends_on.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <span style={{ color: '#858585', minWidth: 80 }}>depends_on</span>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {project.depends_on.map(d => (
                  <span key={d} style={{ padding: '2px 8px', background: '#2d2d2d', border: '1px solid #3c3c3c', borderRadius: 3, fontSize: 11, color: '#cccccc' }}>{d}</span>
                ))}
              </div>
            </div>
          )}
          {!project.part_of && (!project.feeds || project.feeds.length === 0) && (!project.depends_on || project.depends_on.length === 0) && (
            <div style={{ fontSize: 12, color: '#858585', fontStyle: 'italic' }}>Inga kopplingar definierade</div>
          )}
        </div>
      </div>
    </div>
  );
}
