import { useNavigate } from 'react-router-dom';

export default function Breadcrumb({ activeMode, selectedProject, onDeselectProject, nodeAncestry }) {
  const navigate = useNavigate();
  const modeLabels = { graph: 'graf', quests: 'quests', overview: 'översikt' };

  let segments;
  if (nodeAncestry && nodeAncestry.length > 0) {
    segments = nodeAncestry.map((node, i) => ({
      label: node.title,
      active: i === nodeAncestry.length - 1,
      onClick: i < nodeAncestry.length - 1 ? () => navigate(`/project/${node.slug}`) : undefined,
    }));
  } else {
    segments = [
      { label: modeLabels[activeMode] || activeMode, active: !selectedProject, onClick: onDeselectProject },
      ...(selectedProject ? [{ label: selectedProject.title || selectedProject.slug, active: true }] : []),
    ];
  }

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
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer', color: '#858585' }}
        onMouseEnter={e => e.currentTarget.style.color = '#cccccc'}
        onMouseLeave={e => e.currentTarget.style.color = '#858585'}
      >cortxt</span>
      {segments.map((seg, i) => (
        <span key={i} style={{ display: 'contents' }}>
          <span style={{ color: '#4e4e4e' }}>&gt;</span>
          <span
            onClick={seg.onClick}
            style={{ cursor: seg.onClick ? 'pointer' : 'default', color: seg.active ? '#cccccc' : '#858585' }}
            onMouseEnter={e => { if (seg.onClick) e.currentTarget.style.color = '#cccccc'; }}
            onMouseLeave={e => { if (seg.onClick) e.currentTarget.style.color = seg.active ? '#cccccc' : '#858585'; }}
          >{seg.label}</span>
        </span>
      ))}
    </div>
  );
}
