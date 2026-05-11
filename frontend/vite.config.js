import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    assetsInclude: ['**/*.worker.js'],
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
            'query-vendor': ['@tanstack/react-query'],
            'pdf-vendor': ['@react-pdf-viewer/core', '@react-pdf-viewer/default-layout'],
          },
        },
      },
    },
    server: {
      port: 5173,
      proxy: {
        // Dev-only proxy — not used in production
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              if (req.headers.cookie) {
                proxyReq.setHeader('cookie', req.headers.cookie);
              }
            });
          },
        },
        '/uploads': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
  };
});
