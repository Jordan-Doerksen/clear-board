# Clear Board 2 — the plan (sections 3 to 9 of the handoff)

Saved on 2026-11-20 from the handoff prompt "Clear Board 2: Dusk 0.2.0, the Yard redrawn, the upgrade
sweep". The text below is the handoff text, unchanged. The section numbers are the numbers of the
handoff. Sections 1 and 2 (the product, and step zero) are not in this file.

Step zero result, 2026-11-20, commit `86cfef2`: `npm ci`, `npm run check` and `npm run build` are green
on a clean clone. The six files in `src/styles/dusk/` match `src/styles/dusk.lock.json`, and they match
`styles/` in the Dusk repository at commit `1f7f971`.

Corrections that Wave 1 found. The handoff text below stays unchanged; read it with these notes.

- **T4 is wrong in direction.** With "Reduce motion" on, a Yard move is about 6 times slower, not
  faster: `anim.js` line 17 multiplies each duration by the factor that `yardSim.js` line 228 sets
  to 6. Measured: about 9.0 s against 1.6 s for one move (R2, R5, R6 agree). Motion does not stop.
- **T1 counts, measured (R3):** shell 22 raw colours, Yard inline CSS 44, Yard canvas 22, Radio 45.
- **T5 is not complete (R6):** `public/icons.svg` is also a Vite template file. It is dead, shipped
  and cached. `public/favicon.svg` is the Vite template logo, byte for byte (create-vite 9.3.4).
- **T13 is older than stated (R6):** the same failing step is also on `2b7adb3`.
- **Job file lists that are too narrow (R3, R6):** `radioSim.js` holds 29 raw colours outside its
  style rules, so "style rules only" for B3 cannot meet fence rule 4. The lead settles this in the
  Wave 2 briefs.

---

## 3. Dusk 0.2.0 — where it is, and the rule that matters most

"Dusk" means **Dusk 0.2.0, the lit panel**: a near-black opaque floor, every container edged with a
gold lit line, tiles with a coloured cap lit in their own colour, a title bar with a thread under it,
a strip of readings, panel head bars with count chips, a status bar, mono figures. Tile colour is a
category. Chip and state colours are states. Gold is chrome only.

- **It is already in this repository** (commit `86cfef2`, pushed 2026-11-20): `src/styles/dusk/`, six
  files: `dusk.tokens.css`, `dusk.base.css`, `dusk.components.css`, `dusk.compose.css`,
  `dusk.motion.css`, `dusk.process.css`. The lock `src/styles/dusk.lock.json` records the source
  commit and a SHA-256 for each file. Line 1 of `dusk.tokens.css` reads `dusk 0.2.0`.
  Nothing imports the copy yet, so the app has not changed.
- **Never edit the copy, and never rebuild Dusk from this description.** App token names map to
  Dusk tokens in one bridge file, `src/styles/clear-board.tokens.css`.
- The source is the **private** repository `Jordan-Doerksen/dusk`, branch `main`. If you can read
  it, also read `ROLLOUT.md`, `DECISIONS.md`, `preview/index.html` and `preview/desk.html` for how
  the parts are used. If you cannot, the six files and their own comments are enough to start; say
  in your report that you did not see the previews.
- Use Dusk's own parts first (title bar, strip, capped tile, framed panel, table, feed, count,
  station, state, led, button). Write a page-local part only where the gap register (R3) names a gap.
- Optional helpers, in the private repository `Jordan-Doerksen/cloud-research-2026-11-16`, folder
  `ws7-design-system-trainer/reskin-tools/`: a lock check, a raw-colour lint, a look compare. If you
  cannot read it, G1 writes small equivalents.

## 4. The fence — it goes in full into every brief you write

1. **Frozen files. No edit, no reformat, no move.** `public/data/*.json`, `src/core/signal.ts`,
   `src/stations/yard/model.js`, `solver.js`, `puzzles.js`, `geometry.js`, and the `STEPS` wording in
   `src/stations/radioSim.js`. `geometry.js` looks like layout, but `model.js` reads its lengths and
   clearances, so a changed number changes what the game allows. The new drawing uses a view
   transform on top of it and its own palette.
2. **No rule is written, corrected or cited by you or by a sub-agent.** The rulebook is not in the
   repository and never will be. A finding about rule content is a note for the SME, never an edit.
3. A reskin changes no behaviour, no number, no word and no control.
4. No raw colour outside the bridge file and the frozen files.
5. Red is attention only. A colour or a glow is never the only carrier of a state. Words carry it.
6. Reduced motion stops every effect and nothing goes blank. Design the static state first.
7. The four reading modes survive: dyslexia type, high contrast, text scale, reduced motion.
8. Contrast is WCAG AA or better. Targets are 44 px or more. No sideways scroll at 390 or 1440 px
   wide. A table reflows. No pill buttons: 6 px radius or plain text.
9. One session, one branch, its own files only. `package.json` and the lock file belong to G1 alone.
10. `npm run check` and `npm run build` are green before any session reports done. Install with
    `npm ci`, never a fresh resolve.
11. No secret in the repository. No timer, cron or scheduled job. No accounts, server or analytics.
12. **No push to `main` and no merge into `main`.** Push branches and open draft pull requests.
    `main` moves only on the owner's typed word. Do not turn GitHub Pages on for this repository and
    do not "fix" the deploy workflow's last step (see T13).
13. The owner runs no commands. Never hand the owner a command, a path to open or a step to carry out.
14. Never present the owner by a job title, and keep personal history out of every file.
15. Show nothing rather than something false. Mark a claim you did not check as not verified.

## 5. What is true today (read from the disk on 2026-11-20; check each before you rely on it)

| # | Fact | Where |
|---|---|---|
| T1 | Four separate palettes, none Dusk: shell tokens, the Yard's inline CSS (43 raw colours), the Yard canvas palette, the Radio island (45 raw colours) | `src/index.css`, `src/stations/yardSim.js:44`, `yard/render.js:10`, `radioSim.js` |
| T2 | The Yard canvas is a fixed 1340 × 460 drawing scaled by CSS. At 390 px wide a 9 px car number draws at about 2.6 px | `yard/geometry.js:5`, `yardSim.js:64`, `render.js:171` |
| T3 | A switch is lined by a canvas click only, hit radius 18 units (about 5 px on a phone). No keyboard path, no text mirror of the yard state | `yardSim.js:285` |
| T4 | Reduced motion in the Yard is "6 times faster", read from the app setting. It does not stop | `yardSim.js:227` |
| T5 | Dead files: the Vite template `src/App.css`, `hero.png`, `react.svg`, `vite.svg` | `src/` |
| T6 | Package name `clear-board-react`, version `0.0.0`. Favicon origin is open (D-0028). The desktop build wears the default Tauri icon | `package.json` |
| T7 | `SPEC.md` still says "No build step" and "no CI". D-0016 and D-0019 reversed both | `SPEC.md` |
| T8 | No `ARCHITECTURE.md`. No page-law tier line in `DECISIONS.md`; no line means STRICT | repo root |
| T9 | The gate is four Node scripts. No unit test runner, no browser test, no look gate; lint and `tsc` are not in `npm run check` | `package.json` |
| T10 | Station icons are emoji | `src/stations/Home.tsx:6` |
| T11 | Open for the SME, not for you: signal indications 410, 418, 433A, 440; six uncited radio steps; the point-protection step (D-0029) | `DECISIONS.md` |
| T13 | GitHub Pages is off for this repository. On every push to `main` the workflow passes `npm ci`, `npm run check` and `npm run build`, then fails at `configure-pages` (seen on `94a41c5` and `86cfef2`). The live copy is served by the owner's site repository at `/rail/clear-board/`. The red run is the known state, not your defect | `.github/workflows/deploy.yml`, run history |
| T12 | `render.js` has a comment that calls yellow the diverging-switch colour a rule convention. That claim is not verified | `yard/render.js:2` |

## 6. The waves

Run sub-agents in parallel inside a wave where you have them. Parallelise independent subjects,
never two writers on one file. A wave starts only after the wave before it is on its branch and green.
Research, design and anything judged by eye run on your strongest model. Only simple, fully
specified mechanical work goes to a small model.

### Wave 1 — research. Seven jobs, read-only on code. Each writes one file in `specs/research/`.

| ID | Subject | Delivers |
|---|---|---|
| R1 | **Yard visual language.** How yard and switching diagrams read: track schematics, dispatcher panels, switching puzzles, rail games. What makes a car, a switch, a route and a foul point readable at a glance | Findings with sources, and **three clearly different look sketches** in Dusk 0.2.0 tokens: each one self-contained HTML (inline CSS and JS, no external file), each showing a real puzzle from `puzzles.js`, each at 1440 and 390. Colour conventions marked "SME to confirm" |
| R2 | **Yard drawing technology.** Canvas, SVG, or both. Text mirror, keyboard, tokens, phone, reduced motion, 44 px targets, speed | A measured prototype of each option and one recommendation |
| R3 | **Dusk mapping.** Every screen part to a Dusk part. The bridge table from old token names to Dusk tokens. The parts Dusk lacks (answer option, progress bar, dialog, toggle, search). The four reading modes on Dusk | Mapping table, gap register, measured contrast table |
| R4 | **Learning and UX audit** of Home, Reference, Drill, Signals, Yard, Radio, Settings: first click, flow, errors, copy, the open items in `REVAMP-DESIGN.md` | Numbered findings, severity, a fix for each |
| R5 | **Accessibility audit.** Automated scan of every route, keyboard walk, screen-reader names, motion, target sizes, both contrast modes. Whether the reduced-motion setting follows the operating system flag | Numbered findings, each with a pass check |
| R6 | **Engineering audit.** Dead code, naming, tests, CI, pinned toolchain, PWA update and cache budget (under 5 MB), Tauri state, bundle size, tunables in JSON, document drift | Numbered findings with effort and risk |
| R7 | **Yard motion and sound.** Couple, kick, switch throw, arrival, departure | A motion sheet: each effect, its purpose, its static form first |

### Gate A — stop. The owner picks. Ask one question at a time, recommended option first, a reason on every option.

1. **The Yard look** (HIGH): show the three sketches as pictures at 1440 and 390. One pick.
2. **Phone** (HIGH): full play on a phone, or desktop first with a readable phone view.
3. **The app icon** and the favicon's origin (MEDIUM, D-0028).
4. **The upgrade list** (MEDIUM): one ranked table from R4, R5, R6. Yes or no per row.

Then lock the answers as new entries in `DECISIONS.md`, write `ARCHITECTURE.md`, add the line
`Page law tier: STRICT` (or OPEN if the owner picks it), and write the Wave 2 briefs from the research.
**Build nothing in Wave 2 before the owner has answered. Silence is not approval.**

### Wave 2a — foundation. Three jobs in parallel.

| ID | Job | Files |
|---|---|---|
| G1 | **Gates.** Frozen-file hash gate. Raw-colour lint. Dusk lock check. Lint and `tsc` into `npm run check`. Unit tests for `sr`, `store`, `severity`. Browser smoke test and a look harness that takes pictures at 1440 and 390. Pinned Node | `tools/**`, `tests/**`, `package.json`, lock file, `.github/workflows/` |
| S1 | **Skin floor.** Link the Dusk layers already in `src/styles/dusk/`. Write the bridge file. Remove the dead template files. The app turns Dusk-coloured and keeps its shapes | `src/index.css`, `src/main.tsx`, `index.html`, `vite.config.ts`, `src/styles/**`, `src/App.css`, `src/assets/` |
| Y1 | **Yard split.** `yardSim.js` becomes a view file, a style file on bridge tokens, and a controller. No behaviour change | `src/stations/yardSim.js`, new files in `src/stations/yard/` |

### Wave 2b — surfaces. Five jobs in parallel, after 2a.

| ID | Job | Files |
|---|---|---|
| B1 | Shell, Home, Settings in Dusk parts | `App.tsx`, `Home.tsx`, `Settings.tsx`, shell styles |
| B2 | Reference, Drill and the signal frame in Dusk parts. The signal drawing is frozen | `Reference.tsx`, `Drill.tsx`, `Signal.tsx`, their styles |
| B3 | Radio in Dusk parts. Wording frozen by the hash gate | `Radio.tsx`, `RadioTest.tsx`, style rules only in `radioSim.js` |
| Y2 | **The new Yard drawing**, from the picked look and R2's recommendation | `yard/render.js`, `yard/anim.js`, new drawing files |
| Y3 | Yard chrome in Dusk parts: work order, move builder, banner, picker, rule chips | Y1's view and style files |

### Wave 2c — integration. Three jobs in parallel, after 2b.

| ID | Job | Files |
|---|---|---|
| Y4 | Yard access layer: keyboard switch lining, a text mirror of the yard state, 44 px targets, motion that stops | Yard controller, one new file |
| U1 | The upgrade rows the owner approved that touch no frozen file | per the approved list |
| D1 | Documents: `SPEC.md` drift, `README.md`, `CHANGELOG.md`, package name and version | documents; `package.json` name fields through G1 |

### Every brief you write carries these lines, each at the start of a line

`Goal:` · `Files:` · `Done when:` · `Ruled out:` (section 4 in full) · `Reports to:` (you, and in what shape) · `Voice:` terse, no hype.

`Done when:` for every build job: `npm run check` green · `npm run build` green · the hash gate shows no
frozen file changed · pictures at 1440 and 390 attached · the branch pushed. Check each claim yourself
before you repeat it: a sub-agent's report is not proof.

## 7. What you cannot do from the cloud — leave it, and list it in the final report

- The owner's look at each surface in his own browser, before and after, at 1440 and 390.
- A played Yard win by the owner (the open check from D-0027).
- The Windows desktop build.
- The push to `main`, and the update of the copy the owner's site serves.

## 8. Ruled out

- A new repository, a fork or a rebuild. This is one Change Request on `clear-board`.
- Any change to rule content, signal aspects, puzzle layouts, pars or the solver.
- New puzzles, an Exam station, any "test-ready" claim (D-0013).
- The point-protection step (D-0029).
- Tidying, resetting or rewriting history on any branch you did not create.

## 9. Done

1. Every wave's branch is pushed, with one draft pull request per wave and a short plain summary.
2. `npm run check` and `npm run build` are green on the last branch, with the output pasted.
3. The hash gate proves no frozen file changed since `94a41c5`.
4. `DECISIONS.md`, `ARCHITECTURE.md`, `SPEC.md`, `README.md` and `CHANGELOG.md` say what is now true.
5. One final report to the owner: what landed, what did not, what was not verified, the section 7
   list, and a note for the SME with every content finding. No finding is hidden and none is fixed
   in the content.
