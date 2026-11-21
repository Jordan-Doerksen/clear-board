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
    // local-first). The update is a prompt (U-10; R6 ENG-01): a new version waits until the learner
    // presses "Reload" in the notice of the shell. The page never reloads by itself, because a
    // reload in the middle of a question loses the work. Until then the old version keeps its whole
    // cache, so each station still draws. The app registers the worker itself, through the virtual
    // module of the plugin (src/App.tsx), so the plugin injects no script.
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
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
          'A free CROR conductor-qualification trainer — practice from your first day, not the official test. Built for the people a rulebook failed.',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: glass,
        theme_color: glass,
        icons: [
          // The picked icon, the monogram (DECISIONS.md, D-0034): the master drawing as one SVG file,
          // and the PNG set that is rendered from it at 192 and 512 px. The tab icon is the 16 px
          // drawing, public/favicon.svg. The icon of the home screen of Safari, apple-touch-icon.png
          // at 180 px, is a link in index.html.
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        ],
      },
    }),
  ],
})
