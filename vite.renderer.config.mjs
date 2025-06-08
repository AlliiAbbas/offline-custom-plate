import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import Components from 'unplugin-vue-components/vite';
import { BootstrapVueNextResolver } from 'bootstrap-vue-next';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('b-')
        }
      }
    }),
    Components({
      resolvers: [BootstrapVueNextResolver()],
      dts: true
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/store': resolve(__dirname, './src/store'),
      '@/api': resolve(__dirname, './src/api'),
      '@/components': resolve(__dirname, './src/components'),
      '@/views': resolve(__dirname, './src/views'),
      '@/Layout': resolve(__dirname, './src/Layout')
    },
    extensions: ['.js', '.vue', '.json']
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'vuex',
      'axios',
      '@vitejs/plugin-vue',
      'bootstrap-vue-next',
      'bootstrap',
      '@popperjs/core'
    ]
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  },
  base: './',
  publicDir: 'public'
});
