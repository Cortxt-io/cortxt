export default function Breadcrumb({ activeMode, selectedProject, onDeselectProject }) {
  const modeLabels = { graph: 'graf', quests: 'quests', overview: 'översikt' };

  return (
    <div style={{
      height: 24,
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      gap: 4,
      fontSize: 12,
      color: '#858585',
      background: '#252526',
      borderBottom: '1px solid #3c3c3c',
      flexShrink: 0,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>
      <span
        onClick={onDeselectProject}
        style={{ cursor: 'pointer', color: '#858585' }}
        onMouseEnter={e => e.currentTarget.style.color = '#cccccc'}
        onMouseLeave={e => e.currentTarget.style.color = '#858585'}
      >cortxt</span>
      <span style={{ color: '#4e4e4e' }}>&gt;</span>
      <span
        onClick={onDeselectProject}
        style={{ cursor: 'pointer', color: selectedProject ? '#858585' : '#cccccc' }}
        onMouseEnter={e => e.currentTarget.style.color = '#cccccc'}
        onMouseLeave={e => e.currentTarget.style.color = selectedProject ? '#858585' : '#cccccc'}
      >{modeLabels[activeMode] || activeMode}</span>
      {selectedProject && (
        <>
          <span style={{ color: '#4e4e4e' }}>&gt;</span>
          <span style={{ color: '#cccccc' }}>{selectedProject.title || selectedProject.slug}</span>
        </>
      )}
    </div>
  );
}
