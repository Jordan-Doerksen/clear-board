# Changelog

## [Unreleased] — V1 in progress

### One-brain mastery, verification gates + learning-loop wins (2026-06-25)
- **The Yard now feeds the single mastery model.** A genuine puzzle win grades the CROR rule items
  the puzzle exercises (its `rules:[...]` chips → real `rule.*` items) into the SAME SM-2 model the
  Drill uses — closing the "switching/securement read 0% no matter how you play" hole. Only
  **verified** items, and only when **due** (no familiarity-farming by replaying an easy puzzle);
  watched-optimal demos don't grade. The byte-for-byte engine is untouched — wiring lives in
  `src/stations/yardSim.js` + `AppContext.recordYardWin`. Verified live: a `p2-kick` win moves
  Switching 0 → 0.017, Securement 0 → 0.011. (D-0018)
- **Committed verification gates** (`npm run check`): `tools/solve.mjs` proves every puzzle's par is
  achievable **and** optimal (19/19 pass) by driving the existing in-app solver; `tools/content-check.mjs`
  enforces the F1 trust firewall + data integrity (legal trust enum, no duplicate ids, answer ∈ choices,
  every `ruleId` resolves, **no graded question on a needs-review item** — 226 questions, all clean). (D-0017)
- **Errors now teach.** Every Drill miss and every Yard refusal carries a one-tap **Look it up →**
  to the cited rule's plain-language Reference entry (`/reference?focus=<id>`; cause → rule → correct
  action, REVAMP §6). (D-0020)
- **Tier-aware Drill seeding.** A fresh profile starts gentle — tier-1 questions only — so the first
  session is winnable, never tier-3 cold; the band widens (tier 2, then 3) as domain mastery grows,
  using the `tier` already on every question in `rule-questions.json`. (D-0020)
- **Deploy gated.** The GitHub Actions Pages build runs `npm run check` before `vite build`, so a
  broken par or a leaked `needs-review` item can't ship. (D-0019)
- **Signals can't read "mastered" on paper.** The signals domain mastery is capped until the learner
  correctly reads ≥1 actual SVG aspect — a safety backstop for a sight-read skill (REVAMP rec #9). (D-0021)
- **Thin domains drill again.** A domain with too few items (securement's 3) no longer dead-ends under
  the 4-question floor — the Drill pads with distinct authored facets of its rules (≤3 per rule so none
  dominates; a same-session repeat only records a miss, never a correct re-advance). (D-0021)
- **`rule.12` flagged, not moved.** The swarm's "re-file hand signals out of radio" doesn't match the
  data — the item titled Rule 12 actually carries the 123.2 doubt principle — so it's left for SME to
  resolve, not guessed. (D-0021)
- **Design pass:** `REVAMP-DESIGN.md` (+ `REVAMP-APPENDIX.md`) — a multi-agent review of the whole
  trainer (consolidated rule → mechanic map, prioritized backlog, redundancy verdict, gated validation
  checklist, sample taxonomies, open SME questions).

### Rebuilt on React + TypeScript + Tauri (2026-06-24, D-0016)
- **Stack moved off vanilla ES modules to Vite + React 19 + TypeScript** (reverses D-0005's
  "no build"). The offline-PWA + local-first + never-commit-the-PDF constraints still hold.
- Core ported 1:1 and typed (`src/core/sr.ts`, `store.ts`); the four verified data JSON files
  migrated **untouched** to `public/data/`; the signal SVG renderer kept **byte-for-byte**
  (`src/core/signal.ts`, wrapped in `<Signal>`).
- Stations rebuilt as components: Home/path, Reference, Drill (rules/signals/defs). **The Yard**
  and **Radio** kept byte-for-byte as imperative islands (engine/station unchanged) behind a shared
  `useImperativeStation` hook. React's auto-escaping removed the hand-rolled `esc()` from every
  station — a safety win for verbatim CROR text.
- **Feature parity** with the vanilla build, verified live (all five stations, settings, profile).
- **Desktop:** Tauri v2 shell (`src-tauri/`) → self-contained `Clear Board.exe` (~18 MB, OS WebView2)
  + NSIS installer; verified launching. `npm run tauri build`.
- **Deploy:** Pages switched from legacy root-serve to a GitHub Actions build (`.github/workflows/deploy.yml`).
- The vanilla build is retired (recoverable in git history before this commit).

### Added
- Design gate (2026-06-23): `SPEC.md`, `DECISIONS.md`, adversarial `GAP-REVIEW.md` — **gate-clean for V1**.
- Project scaffold: README, MIT LICENSE, .gitignore, this changelog.
- Runnable shell (`index.html`): qualification-path home, accessible dark theme, settings
  (reduced-motion, dyslexia font, text size, read-aloud, high contrast), local profile skeleton.
- **Shared core** as ES modules: `core/sr.js` (SM-2-lite spaced repetition) + `core/store.js`
  (profile, content loader, mastery, gradable-only filter).
- **Content library**: `data/definitions.json` — 63 CROR definitions migrated verbatim from the
  old CROR Quiz, character-for-character verified, cited + `trust:"verified"`.
- **Reference station** (`stations/reference.js`): search, plain-language first, rule text one tap
  deeper, trust badge + citation.
- **Drill station** (`stations/drill.js`): adaptive MC (term↔definition), SM-2 scheduling, citation
  on every answer, mastery feeds the path. F1 enforced — only verified items are graded.
- `app.js`: modular shell with hash routing (home / reference / drill) + settings.
- Verified end-to-end on preview (home, search→detail→verbatim, answer→grade→mastery persist).
- **Signals domain live**: `stations/signal-render.js` (the verified `drawSignal` SVG renderer,
  copied verbatim) + `data/signals.json` (42 indications — 38 verified, 4 needs-review/reference-only).
  Reference renders the aspect variants; Drill is now type-aware (definitions → term↔def, signals →
  read-the-aspect) over one profile; plus a signals-only "🚦 Signals" station.
- **Tip jar**: Ko-fi link (ko-fi.com/jordandoerksen) wired into the footer.
- **Rules / operating content live**: `data/rules.json` (100 cited rule concepts) +
  `data/rule-questions.json` (226 authored MC, verbatim from the old CROR Quiz BANK; answer∈choices
  verified on all). A third drill type (authored operating-rule MC). The remaining domains go live —
  switching, securement, radio, authority, and a new **Operating** bucket — so all 7 light up.
  Live domain cards are now one-tap drills (`#/drill/<domain>`).

- **The Yard live**: the switch-list switching sim ported in as a station — 7 verified engine
  modules copied byte-for-byte (SHA-256 identical), `main.js` adapted into a scoped `mount()`
  (CSS namespaced under `.yard-wrap`, no leak), 19 solver-verified puzzles, Watch-optimal,
  reduced-motion aware, started muted unless audio is on. Puzzle wins record to `profile.yard.completed`.

- **Radio station live**: the "Back to a Joint" call walkthrough ported **verbatim** from the CN
  trainer (14 SME-tuned steps, wording untouched; scoped CSS; completion → `profile.radio.done`).
  One walkthrough for now — flagged to grow.
- **Deployed**: GitHub Pages is live at https://jordan-doerksen.github.io/clear-board/ (built).

### Next
- More radio walkthroughs (only "Back to a Joint" exists — the weakest section).
- The Exam station (needs the SME "test-ready" bar first).
- PWA/offline (service worker + manifest); profile export/import.
- Surface yard/radio progress on the path/home.
