import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Cho phép truy cập từ bên ngoài
    port: 5173, // Port mặc định
    strictPort: false, // Tự động tìm port khác nếu port bị chiếm
  },
  preview: {
    host: '0.0.0.0', // Cho phép truy cập từ bên ngoài khi preview
    port: 4173, // Port preview
    strictPort: false,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})

