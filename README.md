# Clear Board

A free CROR conductor-qualification trainer — first day to job-ready, built for the people a rulebook failed.
Built on **React + TypeScript + Tauri** (the rebuild that replaced the original vanilla build — see `DECISIONS.md` → **D-0016**).
Design-gate docs live alongside: `SPEC.md`, `DECISIONS.md`, `GAP-REVIEW.md`.

## Stack
- **Vite + React 19 + TypeScript** — the UI.
- **react-router-dom** (HashRouter) — routing that works on a GitHub Pages subpath and offline.
- **Tauri v2** — the self-contained desktop exe (uses the OS WebView2). See *Desktop* below.

## What's ported (the spine — verified live)
- `src/core/` — `sr.ts` (SM-2-lite spacing) and `store.ts` (profile, mastery, the `drillable` safety filter), ported 1:1 from the vanilla core and now typed.
- `src/core/signal.ts` — the verified SVG signal renderer, **byte-for-byte** (only TS annotations added). Wrapped by `src/stations/Signal.tsx`.
- `src/state/AppContext.tsx` — one provider: content library + the single profile + accessibility settings (the old `ctx` object).
- Stations: **Home** (the qualification path), **Reference** (cited lookup), **Drill** (rules + signals + definitions).
- **The Yard** (switch-list canvas sim) and **Radio** ("Back to a Joint" walkthrough) — both are **imperative islands**. Their engines/stations (`src/stations/yard/*.js`, `yardSim.js`, `radioSim.js`) are kept **byte-for-byte**; the shared `useImperativeStation` hook ([imperativeStation.ts](src/stations/imperativeStation.ts)) lazy-loads each (own code-split chunk), hands it a host `<div>` + a `ctx` bridged to React (navigate / settings / read-aloud / live profile / persist-on-win), and tears it down on unmount.
- `public/data/*.json` — the four SME-verified content files, **copied untouched**. Never re-derived.

**This is now at feature parity with the vanilla build** — all five stations run on React, verified live.

## Next
- PWA service worker (offline on the train) — `vite-plugin-pwa` is already a devDep, just needs wiring.
- Custom app icon (currently the default Tauri logo).
- Consolidate — this folder replaces the vanilla `../clear-board`, which retires; update the map + Observatory.

## Run / build
```sh
npm install
npm run dev          # dev server (Vite), http://localhost:4548 via .claude/launch.json
npm run build        # tsc -b && vite build  →  dist/  (static, deploy to GitHub Pages)
npm run tauri build  # → standalone Clear Board.exe + NSIS installer (see Desktop below)
```

## Desktop (Tauri) — done
`npm run tauri build` produces a self-contained **`Clear Board.exe`** (~18 MB, frontend baked in,
uses the OS WebView2) and a **`Clear Board_0.1.0_x64-setup.exe`** NSIS installer (~4 MB), in
`src-tauri/target/release/` and `.../release/bundle/nsis/`. Config: `src-tauri/tauri.conf.json`
(dark window, `productName`/`mainBinaryName` "Clear Board", NSIS-only bundling).

**Build env (Windows):** needs the GNU Rust toolchain **plus a complete MinGW-w64** on PATH —
rustup's bundled MinGW lacks `as.exe`. Build with:
```sh
# PowerShell — WinLibs MinGW first, then cargo
$env:PATH = "C:\projects\.toolchains\mingw64\bin;$env:USERPROFILE\.cargo\bin;$env:PATH"
npm run tauri build
```

## Safety rules carried over (unchanged)
- Only `trust: "verified"` content is ever drilled/graded; `needs-review` is reference-only (F1).
- Verbatim CROR text ships (public document); the PDF is never committed.
- Accessibility is core: dyslexia font, read-aloud, high contrast, bigger text, reduced-motion — all driven by `<html>` data-attributes + persisted.
