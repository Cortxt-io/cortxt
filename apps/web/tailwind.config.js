import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  // Theme flips via [data-theme] on <html> at the CSS-variable level (useTheme),
  // so shadcn colours below are theme-agnostic. `dark:` utilities, if ever used,
  // resolve against the explicit dark attribute.
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: { center: true, padding: '1.5rem', screens: { '2xl': '1100px' } },
    extend: {
      colors: {
        // shadcn semantic tokens → existing cortxt CSS variables (single source).
        border: 'var(--border)',
        input: 'var(--border)',
        ring: 'var(--accent)',
        background: 'var(--bg)',
        foreground: 'var(--text)',
        primary: { DEFAULT: 'var(--accent)', foreground: '#ffffff' },
        secondary: { DEFAULT: 'var(--surface-2)', foreground: 'var(--text-bright)' },
        destructive: { DEFAULT: 'var(--health-degraded)', foreground: '#ffffff' },
        muted: { DEFAULT: 'var(--surface-2)', foreground: 'var(--muted)' },
        accent: { DEFAULT: 'var(--surface-2)', foreground: 'var(--text-bright)' },
        card: { DEFAULT: 'var(--surface)', foreground: 'var(--text-bright)' },
        popover: { DEFAULT: 'var(--surface)', foreground: 'var(--text-bright)' },
        // Raw brand tokens kept for occasional direct use (non-colliding names).
        brand: 'var(--accent)',
        'brand-hover': 'var(--accent-h)',
        'text-bright': 'var(--text-bright)',
        success: 'var(--success)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Space Grotesk"', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
