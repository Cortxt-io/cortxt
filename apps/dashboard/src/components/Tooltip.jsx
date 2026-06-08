import { useState, useRef } from 'react';

export default function Tooltip({ text, children }) {
  const [visible, setVisible] = useState(false);
  const timer = useRef(null);
  const ref = useRef(null);

  const show = () => {
    timer.current = setTimeout(() => setVisible(true), 500);
  };

  const hide = () => {
    clearTimeout(timer.current);
    setVisible(false);
  };

  return (
    <div
      ref={ref}
      onMouseEnter={show}
      onMouseLeave={hide}
      style={{ position: 'relative', display: 'inline-flex' }}
    >
      {children}
      {visible && (
        <div style={{
          position: 'absolute',
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: 8,
          padding: '4px 8px',
          background: '#1e1e1e',
          border: '1px solid #3c3c3c',
          borderRadius: 3,
          fontSize: 11,
          color: '#cccccc',
          whiteSpace: 'nowrap',
          zIndex: 1000,
          pointerEvents: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}>
          {text}
        </div>
      )}
    </div>
  );
}
