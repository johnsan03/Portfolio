import process from 'node:process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base:"/Portfolio/",
  // Honour a PORT assigned by the environment; fall back to Vite's default.
  server: {
    port: Number(process.env.PORT) || 5173,
  },
  build: {
    rollupOptions: {
      output: {
        // Split long-lived vendor code out of the app chunk so a content
        // change doesn't invalidate React/framer-motion in the browser cache.
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['framer-motion'],
          icons: ['react-icons'],
        },
      },
    },
  },
})
