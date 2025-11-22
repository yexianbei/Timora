import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // 确保构建输出适合 Cloudflare Pages
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'utils-vendor': ['date-fns', 'zustand'],
        },
      },
    },
  },
  // 明确指定这是静态站点，不是 Workers
  base: '/',
})

