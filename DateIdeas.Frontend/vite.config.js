import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy : {
      '/api': {
        target: 'http://localhost:5500',
        changeOrigin: true,
        secure: false,
      },
      '/hubs': {
        target: 'http://localhost:5500',
        changeOrigin: true,
        ws: true,
        secure: false,
      },
      '/Auth': {
        target: 'http://localhost:5500',
        changeOrigin: true,
        secure: false,
      },
      '/AuthApi': {
        target: 'http://localhost:5500',
        changeOrigin: true,
        secure: false,
      },
    }
  }
})
