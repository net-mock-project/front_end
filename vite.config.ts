import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        // Đổi từ https thành http và khớp với cổng 5103 của backend
        target: 'http://localhost:5103', 
        changeOrigin: true,
        secure: false, 
      },
    },
  },
})