import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'
import { execSync } from 'child_process'

const commitDate = execSync('git log -1 --format=%cI').toString().trim()

export default defineConfig({
  define: {
    __COMMIT_DATE__: JSON.stringify(commitDate),
  },
  base: '/ethoscope/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false,
    }),
  ],
})
