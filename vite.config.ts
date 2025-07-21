import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Chunk principal com deps críticas
          vendor: ['vue', 'vue-router', 'pinia'],

          // UI components em chunk separado
          ui: ['radix-vue', 'lucide-vue-next'],

          // Validação em chunk separado
          validation: ['zod', 'vee-validate', '@vee-validate/zod'],

          // Toast e notifications
          notifications: ['vue-sonner']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
