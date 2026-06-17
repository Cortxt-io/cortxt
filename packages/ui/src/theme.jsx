import { useState, useEffect, useCallback } from 'react';

/* Theme: dark (brand default) | light.
 * Resolution order: saved choice (localStorage) → system preference → dark.
 * The choice is written to <html data-theme>, which the token CSS reads.
 * Mount <ThemeToggle/> once (e.g. in the nav); it is the single source of truth. */

const STORAGE_KEY = 'cortxt-theme';

function resolveInitial() {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function useTheme() {
  const [theme, setTheme] = useState(resolveInitial);

  // Reflect the active theme onto <html> for the CSS variables to pick up.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Follow the OS only while the user hasn't made an explicit choice.
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: light)');
    if (!mq) return undefined;
    const onChange = (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) setTheme(e.matches ? 'light' : 'dark');
    };
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, next); // explicit choice → stop following OS
      return next;
    });
  }, []);

  return { theme, toggle, setTheme };
}

export function ThemeToggle({ className = '' }) {
  const { theme, toggle } = useTheme();
  const toLight = theme === 'dark';
  return (
    <button
      type="button"
      className={`cx-icon-btn ${className}`.trim()}
      onClick={toggle}
      aria-label={toLight ? 'Byt till ljust läge' : 'Byt till mörkt läge'}
      title={toLight ? 'Ljust läge' : 'Mörkt läge'}
    >
      {toLight ? '☀' : '☾'}
    </button>
  );
}
