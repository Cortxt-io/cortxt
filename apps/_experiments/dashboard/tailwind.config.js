/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:       'var(--bg)',
        surface:  'var(--surface)',
        border:   'var(--border)',
        text:     'var(--text)',
        muted:    'var(--muted)',
        accent:   'var(--accent)',
        'accent-h': 'var(--accent-h)',
        success:  'var(--success)',
      },
      fontFamily: {
        sans:  ['Inter', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
