import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendUrl = env.BACKEND_URL || 'https://localhost:8080'; 

  return {
  plugins: [react()],
  root: '.', 
  publicDir: '../public', 
  build: {
    outDir: '../dist', 
    emptyOutDir: true,
    rollupOptions: {
      input: './index.html', 
    },
  },
  resolve: {
    alias: {
      crypto: resolve(__dirname, 'node_modules/crypto-browserify'), 
    },
  },
  server: {
    proxy: {
      '/students': {
        target: backendUrl,
        changeOrigin: true,
      },
      '/logs': {
        target: backendUrl,
        changeOrigin: true,
      },
      '/weeks': {
        target: backendUrl,
        changeOrigin: true,
      },
      '/rooms': {
        target: backendUrl,
        changeOrigin: true,
      },
      '/dogs': {
        target: backendUrl,
        changeOrigin: true,
      },
  },
  }
};
});
