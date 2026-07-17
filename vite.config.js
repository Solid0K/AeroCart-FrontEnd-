import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Backend runs on :8080 per application.properties — proxy avoids
      // needing CORS changes on the Spring Boot side during local dev.
      '/auth': 'http://localhost:8080',
      '/user': 'http://localhost:8080',
      '/cart': 'http://localhost:8080',
      '/orders': 'http://localhost:8080',
      '/admin': 'http://localhost:8080',
      '/mock-payment': 'http://localhost:8080',
    },
  },
})
