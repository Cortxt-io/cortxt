import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'https://project-cns-production.up.railway.app',
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            // Strip WWW-Authenticate to prevent browser native login popup
            delete proxyRes.headers['www-authenticate'];
          });
        },
      },
    },
  },
});
