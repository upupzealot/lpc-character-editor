import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import { json5Plugin } from 'vite-plugin-json5'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), json5Plugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
