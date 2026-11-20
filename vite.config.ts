import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// base: './' → relative asset URLs, so the same build runs on a GitHub Pages subpath
// (jordan-doerksen.github.io/clear-board/) AND inside the Tauri exe shell.
// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    // Offline is the point, not a nicety: this gets studied on a train with no signal (SPEC —
    // local-first). autoUpdate so a learner is never stranded on a stale rulebook.
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      // The cache list comes from globPatterns alone. Without this option the plugin adds the
      // manifest icon a second time.
      includeManifestIcons: false,
      workbox: {
        // The four content files ARE the app. Workbox's default glob does NOT include .json,
        // which would have shipped a "works offline" app whose rulebook 404s offline.
        globPatterns: ['**/*.{js,css,html,svg,json,woff2}'],
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'Clear Board — become a conductor, free',
        short_name: 'Clear Board',
        description:
          'A free CROR conductor-qualification trainer — first day to job-ready, built for the people a rulebook failed.',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#0d1117',
        theme_color: '#0d1117',
        icons: [
          // The app's existing mark. Deliberately NOT a generated PNG set — the icon itself is
          // an open taste call for the owner (D-0028); inventing one would be a silent design
          // decision on a surface that carries the project's identity.
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
      },
    }),
  ],
})
