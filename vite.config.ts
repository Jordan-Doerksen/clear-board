import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// The theme colour of the browser bar and the two colours of the manifest are the Dusk token
// --glass, the window floor. A manifest and a meta tag cannot read a style sheet, so the build
// reads the value from the Dusk token file. No colour is typed in this file or in index.html.
// If the token is not found, the build stops. It does not fall back to a typed colour.
function readGlass(): string {
  const file = new URL('./src/styles/dusk/dusk.tokens.css', import.meta.url)
  const found = /(?<![\w-])--glass:\s*(#[0-9a-f]{6})/.exec(readFileSync(file, 'utf8'))
  if (!found) {
    throw new Error(
      'vite.config.ts: the Dusk token --glass was not found in src/styles/dusk/dusk.tokens.css. ' +
        'The build stops, because the theme colour has no typed fallback.',
    )
  }
  return found[1]
}

// Writes <meta name="theme-color"> into index.html, in the build and in the development server.
function themeColour(colour: string): Plugin {
  return {
    name: 'clear-board:theme-colour',
    transformIndexHtml() {
      return [{ tag: 'meta', attrs: { name: 'theme-color', content: colour }, injectTo: 'head' }]
    },
  }
}

const glass = readGlass()

// base: './' gives relative addresses, so the same build runs under a sub-path of a site
// and inside the desktop shell.
// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    themeColour(glass),
    // Offline is the point, not a nicety: this gets studied on a train with no signal (SPEC —
    // local-first). autoUpdate so a learner is never stranded on a stale rulebook.
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      // The cache list comes from globPatterns alone. Without this option the plugin adds the
      // manifest icon a second time.
      includeManifestIcons: false,
      workbox: {
        // The five content files ARE the app. Workbox's default glob does NOT include .json,
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
        background_color: glass,
        theme_color: glass,
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
