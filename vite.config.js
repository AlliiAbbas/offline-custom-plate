import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import Components from 'unplugin-vue-components/vite'
import {BootstrapVueNextResolver} from 'bootstrap-vue-next'

// https://vitejs.dev/config/
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
      resolvers: [BootstrapVueNextResolver({
        aliases: {
          BInput: 'BFormInput',
          BFormSelect: 'BFormSelect',
          BCard: 'BCard',
          BFormCheckbox: 'BFormCheckbox',
          BFormRadio: 'BFormRadio',
          BFormRadioGroup: 'BFormRadioGroup',
          BFormCheckboxGroup: 'BFormCheckboxGroup',
          BFormInputGroup: 'BFormInputGroup',
          BFormTextarea: 'BFormTextarea',
          BFormDatepicker: 'BFormDatepicker',
          BFormDatepickerRange: 'BFormDatepickerRange',
        },
      })],
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ['ecip-dev.easycash.eg','ecip-demo.easycash.eg'],
    open: true
  },
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
    include: ['vue', 'vue-router', 'vuex', 'axios', '@vitejs/plugin-vue']
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/main.js'),
        preload: resolve(__dirname, 'src/preload.js')
      }
    }
  }
}); 
