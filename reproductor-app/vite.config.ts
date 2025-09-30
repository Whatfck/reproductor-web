import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  resolve: {
    alias: {
      // Apunta directamente al archivo de distribución del paquete.
      jsmediatags: 'jsmediatags/dist/jsmediatags.min.js',
    }
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})