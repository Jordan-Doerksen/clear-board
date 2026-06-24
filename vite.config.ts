import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' → relative asset URLs, so the same build runs on a GitHub Pages subpath
// (jordan-doerksen.github.io/clear-board/) AND inside the Tauri exe shell. PWA is layered in later.
// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
})
