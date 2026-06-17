import { createContext, useState, useCallback, useRef, useEffect } from 'react';

export const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const removeToast = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, removing: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 200);
  }, []);

  const toast = useCallback((message, type = 'info') => {
    const id = ++toastId;
    setToasts((prev) => {
      const next = [...prev, { id, message, type, timestamp: Date.now(), removing: false }];
      return next.slice(-3);
    });
    timersRef.current[id] = setTimeout(() => {
      removeToast(id);
      delete timersRef.current[id];
    }, 3000);
  }, [removeToast]);

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);

  const containerStyle = {
    position: 'fixed',
    bottom: 16,
    right: 16,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    pointerEvents: 'none',
  };

  const accentColors = {
    success: '#4ec9b0',
    info: '#007acc',
    error: '#f44747',
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={containerStyle}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              display: 'flex',
              alignItems: 'stretch',
              background: '#252526',
              border: '1px solid #3c3c3c',
              borderRadius: 4,
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              overflow: 'hidden',
              pointerEvents: 'auto',
              animation: t.removing
                ? 'toast-fade-out 200ms forwards'
                : 'toast-slide-in 200ms ease-out',
            }}
          >
            <div
              style={{
                width: 3,
                flexShrink: 0,
                background: accentColors[t.type] || accentColors.info,
              }}
            />
            <div
              style={{
                padding: '8px 12px',
                color: '#cccccc',
                fontSize: 12,
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              }}
            >
              {t.message}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes toast-slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes toast-fade-out {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
