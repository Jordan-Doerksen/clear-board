# Clear Board

A free CROR conductor-qualification trainer, from your first day. Practice, not the official test.
Built for the people a rulebook failed.

Version 2.0.0 (`package.json`). Clear Board is a single-page app: Vite, React 19, TypeScript and a
hash router (`react-router-dom`). One build ships two ways: an offline PWA and a Tauri v2 desktop
shell. It has no server, no account and no analytics. The progress stays on the device.

## The stations
- **Home** — the path: the stage, the overall mastery, one main control ("Start here", or
  "Continue" with the count of items due now), a tile for each of the seven domains, the stations
  and the tip jar link.
- **Reference** — look up each definition, signal, rule and radio call. Plain words first, then
  the source and a trust mark in words.
- **Drill** — questions on a spaced schedule (SM-2-lite). A learn card shows a new item before its
  first question. "Look it up" opens the entry in a dialog on top of the session.
- **Signals** — the Drill on one domain, signals: the signal aspects and the rule items of that
  domain.
- **The Yard** — 19 switching jobs on a drawn yard (look C2), with a native button for each switch,
  a text list of the yard for a screen reader, a move log and a stepper for the optimal line.
- **Radio walkthrough** — "Guided" (nothing is scored) and "Call it yourself" (scored).
- **Settings** (a dialog) — dyslexia-friendly text, higher contrast, reduce motion, read aloud,
  bigger text; save the progress to a file and load it again; reset the progress.

## Install and run (for a developer)
Node 22: `.nvmrc` holds `22.23.5`.
```sh
npm ci               # install the locked packages (never a fresh resolve)
npm run dev          # the development server (Vite)
npm run build        # tsc -b, then vite build → dist/ (relative addresses: base './')
npm run preview      # serve dist/
```

## The gates
```sh
npm run check         # 12 offline steps: no network, no dist/, no browser
npm run build         # the type check of the build, then the build
npm run test:browser  # the browser smoke test of dist/: run the build first; it needs Chromium
```
- `npm run check` runs `tools/check.mjs`: the frozen-file hash gate, the Dusk lock check, the
  raw-colour lint, the name check, lint, the type check, the unit tests (`tests/unit/`), the
  vectors of the schedule, the solver of the Yard jobs, the content and trust check, the
  securement check, and a report of the signal drawings that two items share. Each step prints
  PASS or FAIL.
- `npm run test:browser` runs `tests/browser/smoke.mjs`: 24 gate cases in
  Chromium. `npx playwright install chromium` gets Chromium.
- `npm run look:baseline` and `npm run look:compare` run the look harness (`tools/look/look.mjs`):
  pictures and page facts at 1440 and 390 px, and the Yard at 1280 px, against the build of a
  baseline commit.
- `.github/workflows/check.yml` runs the check, the build and the browser test on each pull
  request and on each push to a branch other than `main`.

## Hosting
GitHub Pages is off for this repository (plan fact T13). `.github/workflows/deploy.yml` runs on a
push to `main`: `npm ci`, the check and the build, then its GitHub Pages steps.

## Desktop (Tauri v2)
`src-tauri/` holds the desktop shell: one window, an NSIS installer and the icons.
`npm run tauri build` makes the Windows build. It needs the GNU Rust toolchain and a complete
MinGW-w64 on the PATH, because the MinGW of rustup has no `as.exe` (D-0016). No session of
Wave 2 made or ran the Windows build: not verified. `src-tauri/` waits for a session that can
make that build (ruling `TAURI`): `tauri.conf.json` holds the version `0.1.0` and the development
port 4548 (`vite.config.ts` sets no port), and the icons are the default icons of the framework.

## The documents
- `SPEC.md` — the product spec.
- `ARCHITECTURE.md` — the map of the code: the files, the data flow, the frozen set, the style
  layers, the Yard and the gates.
- `DECISIONS.md` — each decision, from D-0001.
- `CHANGELOG.md` — the changes, by version.
- `GAP-REVIEW.md`, `REVAMP-DESIGN.md`, `REVAMP-APPENDIX.md` — the records of the first design gate
  and of a design pass, June 2026.
- `specs/` — the plan of Clear Board 2 (`specs/clear-board-2-plan.md`), the research reports, the
  briefs and rulings of each wave, and the pictures and the words of each job.

## Safety rules
- Only `trust: "verified"` content is drilled or graded; `needs-review` is reference-only (F1).
- The frozen files do not change: `public/data/*.json`, `src/core/signal.ts`, the four Yard engine
  modules (`model.js`, `solver.js`, `puzzles.js`, `geometry.js`) and the `STEPS` wording of
  `src/stations/radioSim.js`. Step 1 of `npm run check` compares them with commit `94a41c5`.
- `public/data/` holds five JSON files: four files of content items, each item with a trust mark,
  and one file of questions.
- The rule text ships where the data holds it (a public document). The CROR PDF is never committed.
- No agent writes, corrects or cites a rule. A finding about rule content is a note for the SME.
- Accessibility is core: the dyslexia face, read aloud, high contrast, bigger text and reduced
  motion. The settings set `data-` attributes and a text size on `<html>`, and the choices are
  stored on the device.
