import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { deepseekApiPlugin } from './vite-plugin-deepseek.ts'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || ''

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ...(DEEPSEEK_API_KEY ? [deepseekApiPlugin(DEEPSEEK_API_KEY)] : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
