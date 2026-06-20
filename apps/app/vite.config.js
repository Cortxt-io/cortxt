import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  // @cortxt/ui ships source JSX (no build step); exclude it from pre-bundling so
  // Vite transforms it as first-party source.
  optimizeDeps: { exclude: ['@cortxt/ui'] },
  // Dev-only: mirror the prod /api/* → Railway rewrite (vercel.json) so cns.js can
  // run same-origin locally without hitting CORS. Prod uses the Vercel rewrite.
  server: {
    proxy: {
      '/api': {
        target: 'https://project-cns-production.up.railway.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
