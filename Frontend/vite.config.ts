import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: '.', // Root remains the Frontend directory
  publicDir: '../public', // Specify the public directory for static assets
  build: {
    outDir: '../dist', // Output directory for the build
    emptyOutDir: true, // Clear the output directory before building
    rollupOptions: {
      input: './index.html', // Use a relative path to the index.html file
    },
  },
  resolve: {
    alias: {
      crypto: resolve(__dirname, 'node_modules/crypto-browserify'), // Polyfill for crypto
    },
  },
  server: {
    proxy: {
      '/students': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/logs': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/weeks': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/rooms': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
