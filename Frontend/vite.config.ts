import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.', // Keep the root as the Frontend directory
  publicDir: '../public', // Specify the public directory for static assets
  build: {
    outDir: '../dist', // Output directory for the build
    emptyOutDir: true, // Clear the output directory before building
    rollupOptions: {
      input: '../public/index.html', // Specify the location of the index.html file
    },
  },
  server: {
    proxy: {
      '/students': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});