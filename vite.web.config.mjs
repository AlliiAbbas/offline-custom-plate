import { defineConfig } from 'vite'; 
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [vue()],
  base: '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // 👈 Fixes "@/" alias for Docker
    }
  },
  build: {
    outDir: 'dist/web',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  }
});
