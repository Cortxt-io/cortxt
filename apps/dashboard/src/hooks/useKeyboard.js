import { useEffect } from 'react';

export default function useKeyboard({ onModeChange, onClosePanel, onOpenPalette, onClosePalette, paletteOpen }) {
  useEffect(() => {
    function handler(e) {
      // Ignore when in input/textarea
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') {
        if (e.key === 'Escape') {
          onClosePalette?.();
        }
        return;
      }

      // Ctrl+Shift+P or Cmd+Shift+P
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        onOpenPalette?.();
        return;
      }

      if (e.key === 'Escape') {
        if (paletteOpen) {
          onClosePalette?.();
        } else {
          onClosePanel?.();
        }
        return;
      }

      if (e.key === '/') {
        e.preventDefault();
        onOpenPalette?.();
        return;
      }

      if (e.key === '1') { onModeChange?.('graph'); return; }
      if (e.key === '2') { onModeChange?.('quests'); return; }
      if (e.key === '3') { onModeChange?.('overview'); return; }
    }

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onModeChange, onClosePanel, onOpenPalette, onClosePalette, paletteOpen]);
}
