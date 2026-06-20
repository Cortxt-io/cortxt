import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    // shadcn convention: '@' → src (used by @/components/ui, @/lib/utils).
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // @cortxt/ui ships source JSX (no build step); exclude from pre-bundling so Vite
  // transforms it as first-party source.
  optimizeDeps: { exclude: ['@cortxt/ui'] },
});
