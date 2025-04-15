import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    hmr: {
      overlay: true
    }
  },
  optimizeDeps: {
    include: [
      '@mui/material',
      '@mui/icons-material',
      '@mui/x-date-pickers',
      'date-fns',
      'framer-motion',
      'react-router-dom',
      'react-toastify'
    ]
  },
  base: '/EDU_AI/',
})
