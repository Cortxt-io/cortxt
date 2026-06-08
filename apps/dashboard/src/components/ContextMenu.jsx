import { useEffect, useRef } from 'react';
import { useToast } from '../hooks/useToast';

export default function ContextMenu({ x, y, project, onClose, onSelectNode }) {
  const { toast } = useToast();
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  if (!project) return null;

  const items = [
    { label: 'Visa detaljer', action: () => { onSelectNode(project); onClose(); } },
    { label: 'Kopiera slug', action: () => { navigator.clipboard.writeText(project.slug); toast('Slug kopierad', 'success'); onClose(); } },
  ];

  if (project.url_repo) {
    items.push({ label: 'Öppna repo', action: () => { window.open(project.url_repo, '_blank'); onClose(); } });
  }

  const menuStyle = {
    position: 'fixed',
    top: y,
    left: x,
    zIndex: 10000,
    background: '#252526',
    border: '1px solid #3c3c3c',
    borderRadius: 4,
    padding: '4px 0',
    minWidth: 160,
    boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 13,
  };

  const itemStyle = {
    padding: '4px 24px',
    color: '#cccccc',
    cursor: 'pointer',
    display: 'block',
    width: '100%',
    border: 'none',
    background: 'transparent',
    textAlign: 'left',
    fontFamily: 'inherit',
    fontSize: 'inherit',
  };

  return (
    <div ref={ref} style={menuStyle}>
      {items.map((item, i) => (
        <button
          key={i}
          onClick={item.action}
          style={itemStyle}
          onMouseEnter={e => { e.currentTarget.style.background = '#007acc'; e.currentTarget.style.color = '#ffffff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#cccccc'; }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
