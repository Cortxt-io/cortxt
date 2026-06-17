import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  // @cortxt/ui ships source JSX (no build step); exclude from pre-bundling so Vite
  // transforms it as first-party source.
  optimizeDeps: { exclude: ['@cortxt/ui'] },
});
