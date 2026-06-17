import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Point the dev proxy at a local backend by setting API_PROXY_TARGET
  // (e.g. http://127.0.0.1:5000); defaults to the Railway production backend.
  const apiTarget = env.API_PROXY_TARGET || 'https://project-cns-production.up.railway.app';
  return {
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        secure: apiTarget.startsWith('https'),
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            // Strip WWW-Authenticate to prevent browser native login popup
            delete proxyRes.headers['www-authenticate'];
          });
        },
      },
    },
  },
  };
});
