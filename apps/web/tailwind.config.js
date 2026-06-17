/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:       'var(--bg)',
        surface:  'var(--surface)',
        'surface-2': 'var(--surface-2)',
        border:   'var(--border)',
        text:     'var(--text)',
        'text-bright': 'var(--text-bright)',
        muted:    'var(--muted)',
        accent:   'var(--accent)',
        'accent-h': 'var(--accent-h)',
        success:  'var(--success)',
      },
      fontFamily: {
        sans:  ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
