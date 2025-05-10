import { defineConfig, loadEnv } from 'vite'; 
import react from '@vitejs/plugin-react';
import { resolve } from 'path';



export default defineConfig(({ mode }) => { 
  //this is used to load backend url from .env file during development
  //this is not used in production as firebase.json knows to route the requests to the backend
  const env = loadEnv(mode, process.cwd(), '');
  const backendUrl = env.VITE_BACKEND_URL; 

  return {
  plugins: [react()],
  root: '.', 
  publicDir: '../public', 
  build: {
    outDir: './dist',
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
  },
  }
};
});
