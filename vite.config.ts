import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // All API requests → Laravel backend
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        cookieDomainRewrite: 'localhost',
      },
      // Sanctum CSRF cookie endpoint
      '/sanctum': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        cookieDomainRewrite: 'localhost',
      },
      // Storage (images, video thumbnails)
      '/storage': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});