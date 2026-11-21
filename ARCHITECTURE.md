# ARCHITECTURE.md — Clear Board

The map. What each file owns, what a file must not hold, and the state after each wave of Clear Board 2.

Written 2026-11-20, after Gate A closed. The lead updated this file at each wave merge. Job D1 made the last pass on 2026-11-21 (`ARCH-UPDATE`): sections 1 to 11 describe the tree after Wave 2c.
Sources: [`specs/briefs/00-contracts.md`](specs/briefs/00-contracts.md) (names, paths, owners; "the contract" below), [`specs/briefs/lead-rulings.md`](specs/briefs/lead-rulings.md) (the rulings), [`specs/briefs/2c-plan.md`](specs/briefs/2c-plan.md) (the plan and the contracts C1 to C11 of Wave 2c), [`specs/clear-board-2-plan.md`](specs/clear-board-2-plan.md) (the fence, section 4), [`specs/gate-a-answers.md`](specs/gate-a-answers.md), [`DECISIONS.md`](DECISIONS.md) (D-0030 to D-0046), and the reports `R1` to `R7` in `specs/research/`.

- **Today** means: read from the code on 2026-11-21, on the branch of job D1. That branch starts at `c1c4bae`: the head of Wave 2c after step 2c-2, plus one paper commit. The G1 close of Wave 2c is a parallel job of step 2c-3. Its changes to `tools/**`, `tests/**`, `.github/workflows/check.yml` and `.oxlintrc.json` are not in this tree, and a count of section 7 can change with it.
- **PENDING RULING `NAME`** means: the owner or the SME has not answered. Until an answer, the behaviour of today stays. Section 10 lists each one. **Not verified** means: no check was made (section 11).
- State: Wave 1 is complete. Gate A is closed (D-0031 to D-0035, D-0037), and the owner answered 19 more picks (D-0038). **Wave 2a, Wave 2b and steps 2c-1 and 2c-2 of Wave 2c are built and merged** (sections 0, 0b and 0c). Step 2c-3 (the G1 close and job D1) is open.

## 0. State after Wave 2a (the lead, 2026-11-21)

Wave 2a is merged on the wave branch at `beb3d14`. At that merge, sections 2 to 4 still described the
tree of `86cfef2`; job D1 wrote the map of today in Wave 2c. What Wave 2a added or changed:

- **The gates (G1).** `npm run check` runs 11 steps through `tools/check.mjs`: the frozen-file hash
  gate (`tools/frozen-check.mjs`, `tools/frozen.lock.json`), the Dusk lock check
  (`tools/dusk-lock-check.mjs`), the raw-colour lint, a ratchet (`tools/colour-lint.mjs`,
  `tools/token-lint.baseline.json`), the name check (`tools/name-check.mjs`,
  `tools/name-check.allow.json`), lint, the type check, 44 unit tests (`tests/unit/`), and the four
  earlier scripts. On request: the browser smoke test (`tests/browser/smoke.mjs`, with the word tape
  of the guided Radio) and the look harness (`tools/look/look.mjs`). `.github/workflows/check.yml`
  runs the check on each branch and pull request. Node is pinned (`.nvmrc`). The tools follow the
  owner's reskin tools with the owner's leave (D-0039).
- **The skin floor (S1).** `src/main.tsx` imports five Dusk layers, the bridge
  (`src/styles/clear-board.tokens.css`), the parts file (`src/styles/clear-board.parts.css`), six
  surface sheets (`src/styles/surfaces/`) and the app sheet. `body` has the class `cb-app`; `html`
  has `data-tier="strict"`. The browser bar colour and the manifest colour are read from `--glass`
  at build time. The icons are the monogram (`public/favicon.svg`, `public/icon.svg`). The template
  files are gone.
- **The Yard split (Y1).** `src/stations/yardSim.js` is the controller. `yard/view.ts` holds the
  markup and each write to the page; `yard/draw.ts` is the drawing adapter, with the canvas inside
  until Y2; `yard/yard.css` and `yard/drawing/drawing.css` hold the style on bridge tokens.
  `imperativeStation.ts` exports the type `StationCtx`. The reading modes reach the Yard text.
- **Left, as planned:** the Yard drawing (`render.js`, 22 raw colours) and the guided Radio
  (`radioSim.js`, 45) keep their old colours until Y2 and B3 in Wave 2b.

## 0b. State after Wave 2b (the lead, 2026-11-21)

Wave 2b is merged on the wave branch `claude/cb2-wave-2b`. What it added or changed:

- **The surfaces (B1, B2, B3).** The shell is one Dusk window that fills the browser, with a title
  bar and the lit thread (`App.tsx`, `src/styles/surfaces/shell.css`). Home, Settings, Reference,
  the Drill, Signals and both Radio modes use Dusk parts and the `cb-` parts. The guided Radio
  island holds no raw colour; its `STEPS` wording is unchanged. The PNG icons of the monogram are in
  the manifest.
- **The reading column (B-COL).** Reference, the Drill, Signals and the Radio sit in a column of at
  most `--maxw` (920 px), centred in the window. Home, Settings and the Yard use the full window.
- **The Yard chrome (Y3).** `yard/view.ts` and `yard/yard.css` put the picker, the readout, the
  work order, the move builder, the message, the legend and the rule tiles on Dusk parts.
- **The Yard drawing (Y2).** `render.js` and the canvas are gone. `yard/draw.ts` is the adapter of
  an inline SVG drawing in `yard/drawing/` (`layout.ts` the view transform over the frozen
  `geometry.js`, `bodies.ts` the facts and the motion, `svg.ts` the elements, `legend.ts`,
  `drawing.css`). It draws look C2: a wide form and a tall form, chosen when a job starts. Its
  colours are the `--yard-*` names of the bridge.
- **The gates (G1-close of 2b).** No counted file holds a raw colour. The smoke test has 15 gate
  cases. The look harness accepts a smaller control that stays 44 px or more, and the approved
  words of look C2, as warnings.
- **Left for Wave 2c:** the Yard access layer and the Yard controls of the owner's picks (Y4), the
  upgrade rows (U1), the tests and the cache budget (G1-2), and the documents (D1).

## 0c. State after Wave 2c (job D1, 2026-11-21)

Steps 2c-1 and 2c-2 of Wave 2c are merged on `claude/cb2-wave-2c`. Step 2c-1: U1-A, U1-C, Y4a and
U1-B (head `6d74633`). Step 2c-2: G1-2, U1-D, Y4b and two commits of the lead (head `c3bc4db`).
Step 2c-3 (the G1 close and job D1) is not merged in this tree. The notes of
the lead are `specs/briefs/2c-1-merge-notes.md` and `specs/briefs/2c-2-merge-notes.md`. The
decisions are D-0040 to D-0044. What Wave 2c added or changed:

- **The Yard (Y4a, Y4b).** The access layer `yard/access.ts`: six native switch buttons, a text
  mirror of the yard (`#yard-mirror`) and a status region (`#yard-live`). The controller exports
  `unmount()`, and the bridge hook calls it (C2). "Reduce motion" ends each effect at once and is
  read at each move (C4). The controls of the owner's picks (D-0038): a stepper for the watched
  line, no lock during motion, the arrival on request, a move log with "Play again", the cost of a
  move in words, a head bar with the route and the goal, the landing outlines, and the sound off by
  default with its own switch. Section 6.
- **The upgrade rows (U1-A to U1-D).** The Drill selection (`src/core/drill.ts`) and the options of
  the Radio test (`src/core/radio.ts`) are pure functions. The look-up dialog
  (`src/components/LookUp.tsx`) and one entry component (`src/components/Entry.tsx`). The app
  context holds the names of the content files that did not load, a retry, the look-up, a load of
  a progress file, the two device flags, the merge of two open copies, the repair of a stored
  profile and the recompute of the mastery at a change of route. The learn card. The update
  prompt. A page title and a focus target for each route. The dyslexia face as two font files.
  Sections 2 and 3.
- **The gates (G1-2).** Step 12 of the check (`tools/shared-drawings.mjs`), 79 unit tests, smoke
  cases 16 to 19 and one report case for contract C7, the learn-card helper
  (`tools/lib/learn-card.mjs`), the register of allowed changes in `tools/look/cb.config.json`, and
  the package `clear-board` 2.0.0. Section 7.
- **The G1 close.** Case 20 plays a Yard job to a win by touch only at 390 px and by keyboard only
  at 1440 px. Case 21 (the focus of a route, contract C7) is a gate case. Case 22 checks the learn
  card and the gap after it. Case 16 runs the update trial with a renamed station chunk. Case 8
  drives the stepper of the watched line. The look register is exact and tied to its baseline
  (`LOOK-EXACT`). The lint limit is 1 (`LINT-ONE`). Section 7.
- **The documents (D1).** `SPEC.md`, `README.md`, `CHANGELOG.md` (the entry 2.0.0), this file and
  `DECISIONS.md` (D-0040 to D-0046) say what is true after Wave 2c, and they name roles, not
  persons (D-0046). D-0045 lists the corrections of the drift rows of R6 section 11.
- **The page law.** The tier line stays `Page law tier: STRICT` (section 1), with the one written
  exception of D-0038: the Yard drawing shows travel of equipment after a learner action, and
  reduced motion stops it.
- **Measured by the lead after the last merge of Wave 2c, 2026-11-21.** `npm run check`: 12 of 12
  steps pass (lint: 1 warning, limit 1). `npm run build` is green. The offline cache: 17 files,
  805,685 bytes, 15.4 % of the budget of 5 MB. `npm run test:browser`: 22 of 22 gate cases pass.
  The ten frozen files and the `STEPS` region are equal to `94a41c5`.
- **Left after Wave 2c:** the open items for the SME (section 10); the items of the final report of the lead (`NOTICE-TWICE`,
  `RETRY-RESTART`, `TAG-HOME`, `SESSION-LENGTH`, `P16-NIT`, `PICKER-CUT`, `WEAK-REVIEW`); and
  `src-tauri/**` (`TAURI`).

## 1. What the app is
1. Clear Board is a free trainer for the conductor qualification under the Canadian Rail Operating Rules (CROR). Its version is 2.0.0 (`package.json`).
2. It is a single-page app: Vite, React and TypeScript, with a hash router (`package.json`; `src/App.tsx`). Stations: Home, Reference, Drill, Signals, The Yard, Radio. Settings and the look-up are dialogs.
3. One build ships two ways: an offline PWA and a Tauri desktop shell (`vite.config.ts`; `src-tauri/tauri.conf.json`).
4. It has no server, no account and no analytics. Content is five JSON files. Progress is one profile in `localStorage` on the device. Settings can save the profile to a file on the device and load it again.
5. The content is safety-critical. A wrong rule taught as correct is the worst failure. The rulebook is not in the repository. No agent writes, corrects or cites a rule.

Page law tier: STRICT

The line above is also line 5 of `DECISIONS.md` (D-0030). The owner kept STRICT and approved one written exception (D-0038): the Yard drawing can show travel of equipment after a learner action. Reduced motion stops it.

## 2. The file map
```
index.html                       the one page: data-tier="strict", body.cb-app, the root element, the icon links, the description
vite.config.ts                   the build: relative base, the React plugin, the theme colour from --glass, the PWA plugin (a prompt update) and its manifest
package.json                     clear-board 2.0.0: 15 scripts, 3 run-time packages, 10 development packages
.nvmrc                           22.23.5
public/data/*.json               FROZEN. The five content files.
public/favicon.svg, icon.svg     the monogram: the 16 px drawing (the tab icon) and the master (the manifest). A raw colour is allowed here (row U-45).
public/icon-192.png, icon-512.png, apple-touch-icon.png   the PNG icons of the monogram
public/fonts/                    Atkinson Hyperlegible: two woff2 files and the licence text (row U-30)
src/main.tsx                     the entry: the style imports in order (section 5.1). Renders App.
src/App.tsx                      the shell: skip link, title bar, notices, routes, the guard of a render error, the page title and the focus of a route, Settings, the look-up dialog
src/pwa-env.d.ts                 the types of the virtual module of the PWA plugin
src/index.css                    the app sheet: the base rules, the reduced-motion rule of the device flag, the s1-floor block (39 lines)
src/components/                  LookUp.tsx (the look-up dialog, LibraryNotice), Entry.tsx (the one entry component, TrustMark)
src/core/                        logic and types. No React import. No import from state/ or stations/.
src/state/AppContext.tsx         the one provider: content, profile, settings, grading, look-up
src/stations/*.tsx               the React stations
src/stations/imperativeStation.ts  the bridge hook for the two islands, and the type StationCtx
src/stations/yardSim.js          island: the Yard controller
src/stations/yard/               the Yard: view, drawing, access layer, motion, sound, and the four FROZEN engine modules (section 6)
src/stations/radioSim.js         island: the guided Radio. The STEPS region (lines 88 to 127) is FROZEN.
src/styles/dusk/*.css            Dusk 0.2.0, the locked copy, six files. main.tsx imports five; dusk.process.css is not imported.
src/styles/dusk.lock.json        the source commit and a SHA-256 for each of the six files
src/styles/clear-board.tokens.css  the bridge (section 5.2)
src/styles/clear-board.parts.css   the cb- parts (section 5.2)
src/styles/surfaces/*.css        six surface sheets: shell, home, settings, reference, drill, radio
tests/unit/*.test.ts             88 unit tests (node:test). tests/ts-resolve.mjs resolves the imports with no extension.
tests/browser/                   the browser smoke test (smoke.mjs) and the word tape of the guided Radio
tools/                           the steps of npm run check, the look harness and their helpers (section 7)
src-tauri/                       the desktop shell. No job of Wave 2 changed it (TAURI).
.github/workflows/check.yml      the gates on each pull request and on each push to a branch other than main
.github/workflows/deploy.yml     the check, the build and the GitHub Pages steps on a push to main
specs/                           the plan, the research, the briefs and rulings, the pictures, the words of each job, the harness page of the parts
dist/, .gate/, .look/, node_modules/   build output and scratch. Not committed (.gitignore).
*.md at the root                 SPEC, README, CHANGELOG, DECISIONS, this file, and the records GAP-REVIEW, REVAMP-DESIGN, REVAMP-APPENDIX
LICENSE                          the MIT licence
```

### 2.1 `src/core` and `src/state`
| File | Owns | Read by |
|---|---|---|
| `core/sr.ts` | The retention schedule: `newState`, `grade`, `isDue`, `decayedFam`. A correct answer gives the interval 1, then 6, then interval times ease. Ease stays in 1.3 to 2.8. Familiarity is interval / 30, at most 1. The half-life is 60 days. | `store.ts`, `drill.ts`, `AppContext.tsx`. `tools/sr-vectors.mjs` pins `grade` and `newState`. |
| `core/store.ts` | `DOMAINS`: seven domains, each one live. `STATIONS`: the five stations of Home; the shell reads their names for the page titles. The keys `cb.profile.v1`, `cb.profile.v1.copy`, `cb.settings.v1`, `sl_muted`. The profile: `freshProfile`, `repairProfile`, `readStoredProfile`, `keepProfileCopy`, `clearProfileKeepCopy`, `saveProfile`, `mergeProfileInto`, `mergeStoredProfile`. Files on the device: `saveTextFile`, `storedDataFile`, `progressFile`, `readProgressFile`. The content: `loadContent` gives the library and the names of the files that did not load. The trust filters `gradable` and `drillable`. `recomputeMastery` with the signals cap. `dueNow`, `overallPercent`, `stageFor`. | `AppContext.tsx`, `App.tsx`, `Home.tsx`, `Settings.tsx`, `Reference.tsx`, `Drill.tsx`, `drill.ts`. No file in `src/` imports `gradable` (checked by `grep`). |
| `core/drill.ts` | The Drill selection as pure functions; a function that draws takes the random source as its last parameter (row U-44). `buildSession`, `buildQuestion`, `distractors`, `shuffle`, `itemTier`. The shared drawings: `drawingOf`, `sharedDrawings`, `distinctAspects`, `askableAspects` (rows U-01, U-37). The learn cards: `withLearnCards` (row U-28). The grading guard `answerCounts` (F1 and F2; `U44-GUARDS`). `dueGroups`, `withRecomputedMastery`. | `Drill.tsx`, `RadioTest.tsx`, `Entry.tsx`, `AppContext.tsx`, `tools/shared-drawings.mjs`. |
| `core/radio.ts` | The pure logic of "Call it yourself": `optionsFor`, `distinct`, `shuffle`, `sourceLine`, `spokenText`, `verdictRegion`, and the two labels of a call that is not scored. | `RadioTest.tsx`. |
| `core/severity.ts` | S1, S2 or S3 for an item: a default for each domain and 11 overrides by item id. The SME can adjust the two lists. | `Drill.tsx`, `RadioTest.tsx`, `drill.ts`. |
| `core/signal.ts` | FROZEN. `drawSignal(spec)` returns one SVG string. `lampFill` gives the lamp colours. The lamp flash is an `<animate>` element. | `Signal.tsx`, `drill.ts`. |
| `core/types.ts` | The types of content, profile and settings. No run-time code. | Each file above, and the stations. |
| `state/AppContext.tsx` | The one provider (`App.tsx`). It holds `content` (null until the first load), `contentFailed`, `profile`, `choices` (the stored choices of the learner) and `settings` (the choices, with `reduce` also on while the device asks for less motion), and the two device flags. It gives `retryContent`, `setSetting`, `resetProgress`, `replaceProgress`, `recordAnswer`, `recordYardWin`, `recordRadioStep`, `persistProfile`, `speak`, `lookUp`, `lookUpRequest`, `closeLookUp` and `followRoute`. It writes the reading modes on `html`. It follows the storage event of another open copy of the app. | Each station and the shell, through `useApp()`. |

### 2.2 `src/stations` and `src/components`
| File | Route | Owns | Writes to the profile |
|---|---|---|---|
| `Home.tsx` | `/` | The stage, the overall mastery, the main control ("Start here", or "Continue" with the count due now), a tile for each domain, the station rows, the tip link and the footer. | No. |
| `Reference.tsx` | `/reference`, with `?focus=<item id>` | The search over each content item (219), in groups by kind. Each row shows its domain and its trust mark in words. The entry opens under its row (`Entry.tsx`). | No. |
| `Drill.tsx` | `/drill`, `/drill/:domain`, `/signals` | The station heading; the screens of a session (learn cards and questions) from `buildSession`; the feedback; the end of a session; the review round. "Look it up" calls `lookUp`. | `recordAnswer`. |
| `Signal.tsx` | — | A wrapper: it puts the string of `drawSignal` into `span.cb-signal`. | No. |
| `Radio.tsx` | `/radio` | "← Home", the station heading and the two mode tabs (a tab list): Guided (the island) and "Call it yourself". After the first open both modes stay mounted, and the mode that is not shown is hidden. | No. |
| `RadioTest.tsx` | inside `/radio` | The graded call quiz. It reads `STEPS` by a lazy import of `radioSim.js`. | `recordRadioStep`; only a verified item counts. |
| `Yard.tsx` | `/yard` | "← Home", the station heading and the host element of the Yard island. It imports `yard/yard.css`. | Through the bridge object. |
| `Settings.tsx` | a dialog | The native `<dialog id="settings">`: five toggles with the ids `t-dys`, `t-contrast`, `t-reduce`, `t-audio`, `t-big`; "Save my progress"; "Load my progress"; "Reset my progress". | `setSetting`, `replaceProgress`, `resetProgress`. |
| `imperativeStation.ts` | — | The hook `useImperativeStation` and the type `StationCtx`: section 2.3. | No. |
| `components/LookUp.tsx` | a dialog | The look-up dialog of contract C1, and `LibraryNotice`, the notice of a failed load in a station (row U-07). | No. |
| `components/Entry.tsx` | — | The one entry component of Reference and of the look-up dialog (`ENTRY-ONE`), and `TrustMark`. | No. |

### 2.3 The two imperative islands and their contract
An island is a plain JavaScript module that draws its own DOM inside one host element. React does not render its content. There are two: `yardSim.js` and `radioSim.js`.

| Item | Today | Where |
|---|---|---|
| Entry and host | A lazy `import()`. Each island is its own chunk in the build. The hosts are `<div class="yard-host">` and `<div class="radio-host">`. | `Yard.tsx`; `Radio.tsx`; `RadioTest.tsx` (for `STEPS`) |
| Module shape | `{ mount(host, ctx), unmount?() }`. `yardSim.js` exports `mount` and `unmount`. `radioSim.js` exports `mount` and `STEPS`. | `imperativeStation.ts`; `yardSim.js`; `radioSim.js` |
| Bridge object `ctx` | Seven fields: `profile`, `settings`, `speak`, `save`, `recordYardWin`, `go(route)`, `lookUp(itemId)`. One object for the life of the mount. React writes the new values into the same object on each render. | `imperativeStation.ts` |
| Style and scope | The style of the Yard is two sheets: `yard/yard.css` (imported by `Yard.tsx` and `yardSim.js`; the build puts it in the main sheet) and `yard/drawing/drawing.css` (in the sheet of the Yard chunk). The Radio island adds one `<style id="radio-style">` element. Each island rule is under `.yard-wrap` or `.radio-wrap`. | `Yard.tsx`; `yardSim.js`; `draw.ts`; `radioSim.js` |
| Teardown | In a layout effect, the hook calls `unmount()` of the module when it exports one, then empties the host (C2). | `imperativeStation.ts` |
| A failed load | When the module does not load, or its mount throws, the host says "This station did not load." with "Reload" (row U-07). | `imperativeStation.ts`; `RadioTest.tsx` |
| What an island reads | The Yard: `ctx.settings.reduce` (at each effect), `ctx.profile.yard`, `ctx.save`, `ctx.recordYardWin`, `ctx.lookUp`. It does not call `ctx.go` or `ctx.speak`. The Radio: `ctx.settings.audio` and `ctx.speak`. It writes nothing to the profile. | `yardSim.js`; `radioSim.js` |

The island comments of `Yard.tsx`, `imperativeStation.ts` and `Radio.tsx` no longer call an island byte-for-byte (Y1, B3; `ISLAND-COMMENT`). Line 9 of `tsconfig.app.json` still calls the Yard engine byte-for-byte (R6 section 11, row 20). No job of Wave 2c owns that file.

### 2.4 `src/stations/yard`: the engine, the motion and the sound
| File | Owns | Imported by |
|---|---|---|
| `geometry.js` FROZEN | The logical space 1340 by 460. Six tracks AS71 to AS76. Switch positions, routes, arclength helpers. Lengths and clearances: `CLEAR`, `SPOT_CLEAR`, `LEAD_CLEAR`. The five car types with a length and a kick flag (`TYPES`). | `model.js`, `solver.js`, `yardSim.js`, `draw.ts`, the four files of `drawing/` |
| `model.js` FROZEN | The state and the moves: `freshState`, `lineSwitch`, `pull`, `spot`, `kick`, `secure`, the `can…` checks with their refusal messages, `checkWin`, `unsecuredGoal`, `grade`. It reads lengths and clearances from `geometry.js`. | `solver.js`, `yardSim.js`, `drawing/layout.ts`, `tools/securement-check.mjs` |
| `solver.js` FROZEN | `solve` (cost: moves, then joints) and `replay`. It applies the moves of `model.js`. | `tools/solve.mjs` only. |
| `puzzles.js` FROZEN | `RULES`: ten rule chips with their citation text. `TIERS`: seven. `PUZZLES`: 19 jobs, each with a start layout, a goal, a par, the line `opt` and `optJoints`. | `yardSim.js`, `tools/solve.mjs`, `tools/securement-check.mjs` |
| `anim.js` | `easeInOut`, `readTime`, `play(steps, { onFrame, onDone })`. A step with the role "in" or "out" takes `--yard-run-in` (840 ms) or `--yard-run-out` (420 ms) of the bridge (`LEG-ROLE`). With the option `still`, `play` runs each step with its end value at once (reduced motion). | `yardSim.js` |
| `sound.js` | Synthesized effects, no asset file: `sfx`, `resume`, `toggleMute`, `loadMuted`, `stopAll`. The sound is off by default. The key `sl_muted` is read at each mount, and each read and write of it is guarded. Nothing reads storage when the module loads. | `yardSim.js` |

`render.js` and the canvas are gone (Y2). Section 6 gives the view, the drawing and the access layer.

### 2.5 `public/data`: the five content files and the trust rule
| File | Items | Trust values (counted on 2026-11-21) | Loaded by |
|---|---|---|---|
| `definitions.json` | 63 | 63 verified | `loadContent` (`store.ts`) |
| `signals.json` | 42 | 38 verified, 4 needs-review | `loadContent` |
| `rules.json` | 100 | 100 verified | `loadContent` |
| `radio-script.json` | 14 | 8 verified, 6 operating-practice | `loadContent` |
| `rule-questions.json` | 226 questions, each with a `ruleId` | — | `loadContent` |

The trust rule:
1. Each content item has `citation.trust`: `verified`, `needs-review` or `operating-practice` (`types.ts`). Reference and the look-up dialog show each item with its trust mark in words (`TrustMark`, `Entry.tsx`).
2. Only a `verified` item enters a graded path: section 3, guard F1.
3. `tools/content-check.mjs` fails when a question points at an item that is not verified (check F), and when a graded radio step does not cite a verified CROR rule (check H).
4. Each radio item points at one step of `STEPS` by `payload.step` (`types.ts`). Check G proves that the 14 items match the 14 calls one to one.
5. No tool and no agent proves that a rule text, an answer or a citation is correct. That is the SME's (R6 6.1).

### 2.6 `tools`: the steps of `npm run check`
`npm run check` is `node tools/check.mjs`. It runs 12 offline steps in order, prints PASS or FAIL for each step, runs each step after a failure, and exits non-zero when one step failed. It needs no network, no `dist/` and no browser. Each step reads and never writes a tracked file.

| Step | Name | Tool | Proves |
|---|---|---|---|
| 1 | `check:frozen` | `tools/frozen-check.mjs`, `tools/frozen.lock.json` | The ten frozen files and the `STEPS` region (found by its anchors) are equal to the lock and to commit `94a41c5`. `public/data/` holds exactly five files. No line outside the region writes to `STEPS`. |
| 2 | `check:dusk` | `tools/dusk-lock-check.mjs` | The six Dusk files are equal to `dusk.lock.json`. No app rule names a Dusk class with no app class. Each custom property that an app file reads with no fallback is declared. |
| 3 | `check:colour` | `tools/colour-lint.mjs`, `tools/token-lint.baseline.json` | No raw colour in `src`, `index.html`, `vite.config.ts` and `public`, outside the Dusk copy, the bridge, the frozen files and the data. The baseline is empty. The two SVG icon files are the allowed places (row U-45). |
| 4 | `check:names` | `tools/name-check.mjs`, `tools/name-check.allow.json` | Only the bridge declares a Dusk name. Each other custom property of the app has the prefix `--cb-` or `--yard-`. No file declares `--lanes`. |
| 5 | `lint` | `oxlint`, `.oxlintrc.json` | At most 1 warning (`tools/check.mjs`). One warning remains (`AppContext.tsx`, `react(only-export-components)`; `LINT-ONE`). |
| 6 | `typecheck` | `tsc -b` | The types. |
| 7 | `test:unit` | `tests/unit/*.test.ts` | 88 tests of `sr`, `store`, `severity`, `drill`, `radio` and the signal drawing. |
| 8 | `sr-vectors` | `tools/sr-vectors.mjs` | 7 checks on `grade` and `newState`. |
| 9 | `solve` | `tools/solve.mjs` | 19 of 19 jobs: the authored line wins in exactly par moves, the solver finds no shorter line, `optJoints` is true. |
| 10 | `content-check` | `tools/content-check.mjs` | 9 checks, A to I, on the five content files and on the calls of `radioSim.js`, which it reads as text. |
| 11 | `securement-check` | `tools/securement-check.mjs` | 15 assertions: securement is a player action, and the 19 pars equal a second list in the script. |
| 12 | `shared-drawings` | `tools/shared-drawings.mjs` | A report: each signal drawing that two signal items or more hold (two today; note S-01). It fails only when it cannot make the list. |

### 2.7 The desktop shell, the PWA set-up and the build output
| Part | Where | What is true today |
|---|---|---|
| Desktop shell | `src-tauri/tauri.conf.json` | Product name `Clear Board`, version `0.1.0`, the identifier, one window 1040 by 840 (minimum 600 by 600) with the background colour `#0e1116`, front end `../dist` built by `npm run build`, development address on port 4548 (`vite.config.ts` sets no port), bundle target NSIS, no content security policy. No job of Wave 2 changed it (`TAURI`). The identifier must not change: the profile of a desktop learner is stored under it (upgrade list P-24; not verified here). |
| Desktop shell | `src-tauri/src/`, `Cargo.toml`, `capabilities/`, `icons/` | The shell holds no app logic: `lib.rs` adds a log plugin in debug builds only. The capability is `core:default`. The icon files are the default mark of the framework. |
| PWA | `vite.config.ts` | `registerType: 'prompt'`, `injectRegister: false`: the app registers the worker through the virtual module of the plugin (`App.tsx`) and shows "A new version is ready." with "Reload" (row U-10). The cache pattern `**/*.{js,css,html,svg,json,woff2}` includes `.json` on purpose: the content files are the app. `cleanupOutdatedCaches` is on, and `includeManifestIcons` is off. The manifest has a name, a short name, a description, `display: standalone`, a relative `start_url` and `scope`, two colours from `--glass`, and three icons (`icon.svg`, `icon-192.png`, `icon-512.png`). |
| PWA | `dist/sw.js` | The worker caches 17 files, 805,685 bytes, against a budget of 5,242,880 bytes (smoke case 19; the build of 2026-11-21). It has no run-time cache rule. |
| Build | `package.json`; `vite.config.ts` | `npm run build` runs `tsc -b`, then `vite build`. `base: './'` gives relative addresses, for a sub-path of a site and for the desktop shell. |
| Build output | `dist/` | 23 files, 892,720 bytes on disk (the build of 2026-11-21): `index.html`; `assets/index-*.js` and `assets/index-*.css` (the main chunk and its sheet); `assets/yardSim-*.js` and `assets/yardSim-*.css` (the Yard chunk and its sheet); `assets/radioSim-*.js`; `assets/workbox-window.prod.es5-*.js`; `data/*.json`; `favicon.svg`, `icon.svg`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`; `fonts/` (two font files and the licence); `manifest.webmanifest`, `sw.js`, `workbox-*.js`. |
| Deploy | `.github/workflows/deploy.yml` | On a push to `main`: `npm ci`, `npm run check`, `npm run build`, then the GitHub Pages steps. GitHub Pages is off for this repository (plan fact T13). The last step stays as it is (fence rule 12). The run history was not read for this file: not verified. |

## 3. The data flow
```
public/data/*.json ──fetch──► loadContent (store.ts) ──► { content, failed } ──► AppContext: content, contentFailed
localStorage cb.profile.v1 ──► readStoredProfile (store.ts; repair) ──► profile
localStorage cb.settings.v1 ──► loadSettings (AppContext.tsx) ──► choices ──► settings (with the device flag of motion)
                                         │
                              AppContext.tsx: the one provider
                                         │
Drill ─────── recordAnswer(item, correct) ──────────────────────┐
The Yard ──── ctx.recordYardWin(itemIds, true) ─► gradeItems ───┤─► answerCounts (drill.ts) ─► grade (sr.ts) ─► recomputeMastery ─► saveProfile
Radio test ── recordRadioStep(itemId, correct) ─► gradeItems ───┘
The Yard ──── changes profile.yard in place, then ctx.save() ─► persistProfile ─► saveProfile
Settings ──── replaceProgress(profile, settings) (a file) · resetProgress()
another open copy ── storage event ─► merge (the same createdAt) or replace
```
- **Content load.** At the start and at `retryContent()` (`AppContext.tsx`). `loadContent` fetches four item files and one question file. A file that does not load goes into the list `failed` by its name, and the shell shows "Part of the library did not load." with "Try again" (C9).
- **One profile.** One object under one key. `readStoredProfile` takes a stored profile of schema 1 and repairs a field of the wrong shape: each readable entry stays (row U-05). Before the app writes over a repaired profile or over text that is not a profile, it keeps the stored text under `cb.profile.v1.copy`. `profile.items` holds one retention state for each item id. `profile.domains` holds one mastery value for each domain.
- **Two open copies.** Before a write, a copy merges the stored profile into its own when the two have the same `createdAt` (row U-34). It follows the storage event of the other copy: the same profile is merged, another profile replaces its own, and a removed profile gives a fresh one.
- **One mastery model.** The mastery of a domain is the mean decayed familiarity of its drillable items (`store.ts`; `sr.ts`). It is computed again after the content load, after each graded answer that counts, at the first report of a new route (`MASTERY-NOW`), and at a merge, a reset and a load.
- **Three writers to the model.** The Drill, a Yard win and the Radio test. The guided Radio grades nothing. A learn card grades nothing.
- **A second write path.** The Yard changes `ctx.profile.yard` in place (`completed`, `best`) and calls `ctx.save()` (`yardSim.js`; `AppContext.tsx`). A watched line writes nothing.

| Guard | Where | What it does |
|---|---|---|
| F1, trust | `answerCounts` (`drill.ts`), called by `recordAnswer` and `gradeItems` (`AppContext.tsx`) | Only a `verified` item is graded. `drillable` (`store.ts`): a rule item needs one authored question or more. The Drill builds its session from drillable items. |
| F2, due | `answerCounts` | A correct answer on an item that is not due writes nothing. A miss always writes. |
| Signals cap | `recomputeMastery` (`store.ts`) | The signals mastery stays at 0.33 or less until one signal item has a correct answer. |
| Drill filter | `buildSession` (`drill.ts`) | The Drill draws no radio item, and no signal item with no drawing that it can ask. A drawing that two signal items hold is not asked (row U-01). |
| Learn card | `withLearnCards` (`drill.ts`) | A card grades nothing. The first question about the item comes after one other screen or more (`LEARN-GAP`). |
| Yard map | `RULE_ITEMS` (`yardSim.js`) | A win grades only the content items that `RULE_ITEMS` names for the rule chips of the job. |
| Watched line | `recordWin` (`yardSim.js`) | A watched line writes no done mark, no best record and no mastery (row U-04). The done marks of an older profile stay. |
| No "test-ready" claim | `stageFor` (`store.ts`) | The stage names make no such claim (D-0013). No code sets `testReady` to true: `freshProfile` sets it to false. |

The rows U-04, U-05, U-07, U-10, U-13, U-34 and U-44, which change this section, are built (section 0c). Row U-50 has a no.

## 4. The frozen set
No edit, no reformat, no move (fence rule 1). No job owns a frozen file in any wave.

| File | Why it is frozen |
|---|---|
| `public/data/*.json` (five files) | The content: the rule text, the answers, the citations, the trust values. The rulebook is not in the repository, so no agent can check a change. |
| `src/core/signal.ts` | The signal drawing. A wrong aspect teaches a wrong indication. The file says that it is a verbatim copy of a verified renderer (`:1-7`). |
| `src/stations/yard/model.js` | What the game allows and refuses: the moves, securement, the kick rules, the refusal messages. |
| `src/stations/yard/solver.js` | It proves each par. A change makes the proof worth nothing. |
| `src/stations/yard/puzzles.js` | The 19 jobs, the pars, the optimal lines, the rule chips with their citation text. |
| `src/stations/yard/geometry.js` | It looks like layout, but `model.js` reads its lengths and clearances. A changed number changes what the game allows. The drawing reads it through a view transform (`drawing/layout.ts`). |
| `src/stations/radioSim.js`, the `STEPS` region (lines 88 to 127 today; found by its anchors) | The call wording of 14 steps, tuned by the SME. The other lines of the file are not frozen; fence rule 3 covers their words. |

- Step 1 of `npm run check` proves the set on each run (section 2.6). On 2026-11-21 it passed on this tree: the ten whole files and the `STEPS` region are equal to commit `94a41c5`.
- Frozen does not mean correct. Open items for the SME stay open (plan T11). A finding about content is a note for the SME, never an edit.
- Locked, and not part of the frozen set: the six files in `src/styles/dusk/` and `src/styles/dusk.lock.json`. No job edits them. Step 2 of `npm run check` proves them.

## 5. The style layers
Built in Wave 2a. The surface sheets and the Yard sheets were restyled in Wave 2b, and the sweep of Wave 2c (U1-B) removed each old rule of `src/index.css` that matched no element.

### 5.1 Files and load order
`src/main.tsx` imports the sheets in this order (contract C.1):
```ts
import './styles/dusk/dusk.tokens.css'      // 1 · Dusk: each raw value
import './styles/dusk/dusk.base.css'        // 2 · Dusk: ground, type, focus ring
import './styles/dusk/dusk.components.css'  // 3 · Dusk: the parts
import './styles/dusk/dusk.compose.css'     // 4 · Dusk: where the parts sit
import './styles/dusk/dusk.motion.css'      // 5 · Dusk: entrances and ambient, OPEN only
import './styles/clear-board.tokens.css'    // 6 · the bridge
import './styles/clear-board.parts.css'     // 7 · the cb- parts
import './index.css'                        // 8 · the app sheet
import './styles/surfaces/shell.css'        // 9 · then home, settings, reference, drill, radio: the six surface sheets
```
- `dusk.process.css` is the sixth Dusk file. It stays in the copy and is not imported (R3 8.2).
- The Yard sheets: `yard/yard.css` comes after each sheet of `main.tsx` (it is imported by `Yard.tsx`), and `yard/drawing/drawing.css` is in the lazy Yard chunk. The Radio island keeps its `<style>` element. A Yard or Radio sheet holds only rules under `.yard-wrap` or `.radio-wrap`.

### 5.2 Ownership
| File | Owns | Must not contain | Writer in 2a / 2b / 2c |
|---|---|---|---|
| `src/styles/dusk/*.css` (six), `dusk.lock.json` | Dusk 0.2.0, as its own `ARCHITECTURE.md` says. Each class has the prefix `dusk-`; the one exception is `is-in`. | An edit. | never |
| `src/styles/clear-board.tokens.css`, the bridge | Six blocks, in order: (1) the old shell names on Dusk tokens (`--bg`, `--surface-2`, `--line`, `--muted`, `--space`, `--font`, `--maxw`, `--fs`); (2) the seven Dusk type sizes in `rem` and `--lh-base`; (3) the eight `--cb-*` names; (4) the dyslexia mode, with the two `@font-face` rules of Atkinson Hyperlegible; (5) the high-contrast mode; (6) the Yard block, `--yard-*`, between `/* yard:start */` and `/* yard:end */`, on `:root` (`YARD-BLOCK`). It is the only file that fence rule 4 allows a raw colour in, outside the frozen files. A recorded exception: the icon files and the desktop window colour (row U-45; D-0036). | A rule that styles a part. A declaration of `--lanes`. A new name with no `--cb-` or `--yard-` prefix. | S1 / Y2, the Yard block only / U1-B and U1-D, not the Yard block; Y4a and Y4b own the Yard block (`YARD-BLOCK-2C`) |
| `src/styles/clear-board.parts.css` | Each `cb-` part of the gap register (G1 to G20), the 44 px floor, the marks, the forced-colours block (`FORCED-COLOURS`), the rules of the reading modes, among them the three reduced-motion rules. A rule that names a Dusk class has `.cb-app` in front. | A raw colour. A declaration of a custom property that Dusk declares. A rule that only one surface needs. A bare `is-` state class. | S1 / closed / U1-B |
| `src/index.css`, the app sheet | The base rules of the page (`html { font-size: var(--fs) }` and the others), the old rules that still match an element, the reduced-motion rule of the device flag, and the s1-floor block. | A raw colour. A declaration of `--ink` or `--focus`. A new rule: a new rule goes in a surface sheet (contract C.2). | S1 / B1 / U1-B (the sweep, `SWEEP`) |
| `src/styles/surfaces/*.css` (six) | The rules that one surface needs. A class has the prefix of its surface (`cb-shell-`, `cb-home-`, `cb-settings-`, `cb-reference-`, `cb-drill-`, `cb-radio-`). An override of a Dusk class or a `cb-` part is under the scope class of the surface. | A raw colour. A class of another surface. An edit of a shared part. | S1 / B1, B2, B3, B-COL / U1-A to U1-D, and one rule of the lead in `shell.css` (`NOTE-INK`) |
| `src/stations/yard/yard.css` | The Yard chrome. Each selector starts with `.yard-wrap`. Each class is `yd-`. No transition and no animation. | A raw colour. A selector under `.yd-view` or `.yd-legend`. | Y1 / Y3 / Y4a, Y4b |
| `src/stations/yard/drawing/drawing.css` | The Yard drawing. Each selector starts with `.yard-wrap .yd-view` or `.yard-wrap .yd-legend`. Colour comes only from `--yard-*` names. | A raw colour. A chrome class. | Y1 / Y2 / Y4a, Y4b |
| The style rules in `radioSim.js` (`RADIO_CSS`) | The guided Radio, under `.radio-wrap`. | A raw colour. A changed word. | — / B3 / U1-C |

Rules for each app sheet: no raw colour; a new custom property has the prefix `--cb-` or `--yard-`; only the bridge declares a name that Dusk declares (contract B.1). Steps 2 to 4 of `npm run check` prove the first and the third rule and the prefixes.

### 5.3 The reading-mode attributes
| On | Attribute | Values | Set by | Read by |
|---|---|---|---|---|
| `html` | `data-dys` | `"1"`, `"0"` | `AppContext.tsx` | Block 4 of the bridge; the spacing rules of the parts file |
| `html` | `data-contrast` | `"1"`, `"0"` | `AppContext.tsx` | Block 5 of the bridge; the parts file |
| `html` | `data-reduce` | `"1"`, `"0"`: `"1"` when the learner chose it or while the device asks for less motion (row U-13) | `AppContext.tsx` | The three rules in the parts file (P-14); `RADIO_CSS`. The Yard reads `ctx.settings.reduce`, the same value. |
| `html` | `style="--fs: …"` | `16px`, `18.5px` | `AppContext.tsx` | `html { font-size: var(--fs) }` |
| `html` | `data-tier` | `"strict"` | `index.html`, static | `dusk.motion.css`. The tier is STRICT (section 1). |
| `body` | `class="cb-app"` | — | `index.html`, static | Each rule that names a Dusk class |

- Dusk reads three attributes only: `data-tier`, `data-ambient`, and `data-label` on a table cell. A new attribute on `html` needs the lead.
- Dusk stops its motion on the device flag only. The three rules in the parts file repeat that stop under `data-reduce` (R3 5.4). `index.css` also stops CSS motion on the device flag.
- Not stopped by reduced motion: the flashing lamp of a signal drawing, an SVG `<animate>` element of the frozen `signal.ts`. Ruling `FLASH` waits for the SME (section 10).

## 6. The Yard
```
Yard.tsx ─► yardSim.js  THE CONTROLLER ─► yard/view.ts     THE VIEW ─► yard/yard.css
                                       ─► yard/draw.ts     THE DRAWING ADAPTER ─► yard/drawing/layout.ts, bodies.ts, svg.ts, legend.ts, drawing.css
                                       ─► yard/access.ts   THE ACCESS LAYER
                                       ─► yard/anim.js, yard/sound.js
                                       ─► yard/model.js, puzzles.js, geometry.js    THE ENGINE, FROZEN (solver.js: tools only)
```
| Layer | File | Owns | Must not contain | Writer in 2a / 2b / 2c |
|---|---|---|---|---|
| Engine | `model.js`, `solver.js`, `puzzles.js`, `geometry.js` | Section 2.4. | A change. | frozen |
| Controller | `yardSim.js` | The game state, the move logic, the records, `RULE_ITEMS`, the sound calls, the event wiring, the stepper of the watched line and the move log. It exports `mount(root, ctx)` and `unmount()`. It reaches an element by an id or through a view function. | A class name. A markup string. An inline style. | Y1 / closed / Y4a, Y4b, the lead (`c3bc4db`) |
| View | `yard/view.ts` | `createView(root)`: each markup string, each class name and each write to the page of the chrome: the job picker and its key line, the readout, the work order, the move builder, the banner and the refusal with "Look it up", the question dialog (`#yard-ask`), the stepper (`#yard-back`, `#yard-next`, `#yard-play`), the move log (`#yard-log-list`), the head bar (`#yard-route`, `#yard-goal`) and the label of a past view (`#yard-view-label`). It sets `data-cb="yard-drawing"` on the frame of the drawing. | Game state. An import of a function of `model.js`. | Y1 / Y3 / Y4a, Y4b |
| Drawing adapter | `yard/draw.ts` | `createDrawing(host, { onPick })` gives `paint(state, puzzle, opts)`, `switchBoxes()`, `onLayout(fn)` and `destroy()`. `paint` takes the motion, the job, the departed state and the move in the builder (`LANDING`). It calls no sound and changes no game state. | A colour in script. A change of a number of `geometry.js`. | Y1 / Y2 / Y4a, Y4b |
| Drawing | `yard/drawing/layout.ts`, `bodies.ts`, `svg.ts`, `legend.ts`, `drawing.css` | Look C2 as one inline SVG with its words as DOM text: the view transform over `geometry.js` and the choice of the form (`layout.ts`); the facts of the yard and the motion from the state (`bodies.ts`); the elements (`svg.ts`); the legend (`legend.ts`). | A canvas. A raw colour. A typed fallback for a missing custom property. | — / Y2 / Y4a, Y4b |
| Access layer | `yard/access.ts` | The six switch buttons over the drawing, the text mirror (`#yard-mirror`) and the status region (`#yard-live`), the route words and the goal (`routeWords`, `goalOf`). | A rule text. A changed message of the model. | — / — / Y4a, Y4b |
| Motion, sound | `yard/anim.js`, `yard/sound.js` | Section 2.4. | — | — / Y2 (`anim.js`) / Y4a, Y4b |

**The drawing: look C2 on a view transform** (D-0031, D-0032; Gate A, question 1).
- One SVG for the drawing. Rails, ties, a car shape for each of the five types, an engine, plates with words, a bar for the room on a track, break marks, a legend.
- Each point of `geometry.js` goes through the view transform of `layout.ts`. `geometry.js` is imported and not changed. The view constants are values of the drawing. They are not numbers of the game.
- Two forms: the wide form (the true geometry, with empty track that can shrink) and the tall form (one row for each track). The form and the frame are chosen when a job starts, from the authored line and the routes, and kept for the job. A state that the kept wide form cannot draw turns the job to the tall form one time (`FORM-CHANGE`, `FORM-KEEP`).
- Colour is only in CSS, on the `--yard-*` names of the bridge. A script reads a custom property only for a size or a time.
- A state is a word and a shape, never a colour alone. Gold marks the lined route, the engine and the goal (`GOLD`). Each word of the drawing is 12 px or larger (`TEXT-FLOOR`).
- A still trace shows the last move (R7-P15). A travel leg takes 840 ms in and 420 ms out (R7-P4).

**The access layer** (P-02, P-03; Gate A, question 2).
- Six native `<button>` elements over the SVG, in track order, placed with `switchBoxes()` and moved on `onLayout`. Each is 44 px or more, has `data-sw`, and has a name that says the track and the lining. No button has `aria-pressed` (`SW-NAME`).
- The text mirror (`#yard-mirror`, visually hidden) states the yard with words that the app shows, and the status region (`#yard-live`) says the result of each move and each refusal of the model as it is. The SME reads the words of the mirror before the change reaches `main` (PENDING RULING `MIRROR-WORDS`).
- Motion stops with reduced motion: `still()` reads `ctx.settings.reduce` at each effect, and each move, kick, arrival, departure and watched step ends at once with its end state and words (P-01, `MOTION-STOP-OWNER`).

**The controls of the owner's picks** (D-0038; Y4b). The sound is off by default, with its own switch that holds (R7-P2). The arrival plays on request only (R7-P5). The watched line is a stepper: Back, Next, "Play all", Stop (R7-P8). Secure, a flag and a right certify play one confirm sound (R7-P9). A move log with "Play again" and "Before and after" (R7-P10). A new input ends the running effect (R7-P11). The cost of a move in words; the SME checks the words (R7-P12). After Depart the lead is empty and the job is closed until Reset (R7-P14). A switch throw clears a refusal that is no longer true (R7-P16).

**What stays.** The entry path `./yardSim.js` and the classes `yard-host` and `yard-wrap`. The ids `picker`, `readout`, `workorder`, `act`, `count`, `track`, `work`, `optimal`, `depart`, `reset`, `mute`, `msg`, `rules`, `certify`. The canvas id `yard` went with the canvas in Wave 2b.

**File type (row U-46).** `view`, `draw`, `access` and the four drawing files are TypeScript. `yardSim.js` stays a `.js` file and imports them by the full path. `imperativeStation.ts` exports the type of the bridge object, `StationCtx`; the view and the drawing have the types `YardView` and `YardDrawing`. `tools/solve.mjs` and `tools/securement-check.mjs` import frozen `.js` modules only.

## 7. The gates
`npm run check` runs the 12 steps of section 2.6. It needs no network, no `dist/` and no browser.

- **In a browser, not part of `npm run check`:** `npm run test:browser` (`tests/browser/smoke.mjs`) serves `dist/` and runs 22 gate cases in Chromium. It needs the build and Chromium. The cases: the routes, the Drill, Reference, Settings (two cases), the guided Radio (with a word tape: a SHA-256 and a word count), "Call it yourself", the Yard, offline, the shell, the dyslexia spacing, the motion rules, the 44 px targets, the Yard at 320 px, the type modes in the islands, an update (row U-10), a failed load and refused storage (row U-07), and the cache budget (row U-43). Gate case 21 checks that focus is on the first heading of the view after a change of route (C7); case 20 plays a Yard job to a win; case 22 checks the learn card. A case presses the control of each learn card first (`tools/lib/learn-card.mjs`, C11).
- **The look harness:** `npm run look:baseline` and `npm run look:compare` (`tools/look/look.mjs`, `tools/look/cb.config.json`): pictures and page facts at 1440 and 390 px, the Yard at 1280 px and three reading-mode pages, against the build of a baseline commit. The register `changes` of the config names the row of each allowed change. A job commits its pictures in `specs/pictures/<wave>-<job>/` at device scale factor 1 (`PICTURES`, `PICTURES-CAP`).
- `.github/workflows/check.yml` runs `npm ci`, the check, the build and the browser test on each pull request and on each push to a branch other than `main`, and a look compare against the merge base as a report. In `deploy.yml` only the Node line changed (`.nvmrc`, `NODE`). The last step of `deploy.yml` stays as it is.
- The colour baseline, the name allow list and the warning limit only go down. The closing commit of the G1 line tightens them at each wave merge (`G1-STEPS`).
- `tools/**`, `tests/**`, `package.json` and the lock file have one line of ownership: G1, the G1 close of each wave, G1-2. The gate tools follow the owner's reskin tools with the owner's leave (D-0039). The one new package is `playwright` 1.63.0, exact (`DEV-DEP`).
- A gate proves structure. No gate proves that a rule text is correct. No gate measures contrast.

## 8. The rules a change must keep
The full text is the fence: `specs/clear-board-2-plan.md`, section 4, rules 1 to 15. Each brief carries it in full. The short form, with the rule numbers:
- **Content (1, 2, 15).** A frozen file gets no edit, no reformat and no move. No agent writes, corrects or cites a rule: a finding about rule content is a note for the SME. Show nothing rather than something false, and mark a claim that has no check as not verified.
- **A reskin (3, 4).** It changes no behaviour, no number, no word and no control. No raw colour is outside the bridge file and the frozen files.
- **Meaning and access (5, 6, 7, 8).** Red is attention only, and words carry a state, never a colour or a glow alone. Reduced motion stops each effect and nothing goes blank. The four reading modes survive. Contrast is WCAG AA or better, a target is 44 px or more, no page scrolls sideways at 390 or 1440 px, a table reflows, and no button is a pill.
- **Work (9, 10).** One session, one branch, its own files; `package.json` and the lock file belong to the G1 line. Each wave has one wave branch, and each job has one local branch in its own worktree. A build agent commits and does not push. The lead merges and pushes (`BRANCH`; D-0037). `npm run check` and `npm run build` are green before a session reports done. Install with `npm ci`.
- **The repository (11, 12).** No secret, no timer or scheduled job, no account, server or analytics. No push to `main` and no merge into `main`. The last step of the deploy workflow stays as it is.
- **People (13, 14).** The owner runs no command. No file holds a job title or personal history.
- **This map (the contract).** A file has one owner in one wave, and a new file that is not in the matrix needs the lead. A Dusk class is always under an app class (`.cb-app`, `.yard-wrap`, `.radio-wrap`). A build agent that finds a name of the contract wrong stops and reports to the lead.

## 9. What cannot be proved in the cloud
| Item | Why | State |
|---|---|---|
| The Windows desktop build | The target is an NSIS installer and the shell uses WebView2. No Rust command was run. The sizes, the window, the icon in the task bar and the service worker inside the shell have no check (R6 9.2). | Not verified. No Wave 2 job writes `src-tauri/**`: it waits for a session that can make the Windows build (`TAURI`). |
| A real phone | Each result comes from headless Chromium with an emulated phone. No touch screen, no phone launcher, no Safari and no Firefox was tested (upgrade list, section 8; Gate A, questions 2 and 3). | Not verified. |
| A screen reader | No screen reader was run. Each statement about what a screen reader says has no check (R5). | Not verified. |
| A learner | No learner used the app of Wave 2. | Not verified. |
| The owner's look at each surface, before and after, at 1440 and 390 | It is the owner's (plan section 7). | Open. |
| A played Yard win by the owner | The open check of D-0027 (plan section 7). | Open. |
| The push to `main` and the update of the live copy | `main` moves only on the owner's typed word (fence rule 12). | Open. |
| The page law | The law text is in no repository that a session can read (R3 section 6). | Not verified. |

## 10. The rulings that shape this map
`specs/briefs/lead-rulings.md` is the source. The contract, Part E, has the state of each ruling of Waves 2a and 2b, with the options and the reason.

**Ruled.** Each one is applied in the sections named.

| Name | The ruling | Section |
|---|---|---|
| `UPGRADE-LIST` (the owner) | Rows U-01 to U-46: yes, built in Waves 2a to 2c. Rows U-47 to U-51: no. | 0c, 3 |
| `U-46`, `U-45` (the owner) | The new Yard files are TypeScript, with a named type for the bridge object. The icon files and the desktop window colour can keep a raw colour. | 2.6, 5.2, 6 |
| `FILES`, `BRANCH`, `G1-STEPS`, `Y1-STEPS`, `2C-SPLIT` | One owner for each file in each step. One wave branch and one local branch for each job. G1 closes at each wave merge. | 5, 6, 7, 8 |
| `TOOLS` (changed by D-0039), `NODE`, `DEV-DEP`, `LOOK-IDS`, `PICTURES` | The gate tools may follow the owner's reskin tools. Node `22.23.5`. `playwright` 1.63.0. The ids `yard-style` (2a) and `yard` (2b) could go. Pictures are committed at scale 1. | 7 |
| `B3-LINE`, `YARD-BLOCK`, `YARD-BLOCK-2C`, `SWEEP` | B3 could edit each colour of `radioSim.js`. Block 6 is on `:root`. Y4 owns the Yard block in 2c. U1-B made the sweep in 2c. | 5.2 |
| `ICON-SVG`, `ICON-PNG` | Two SVG files by S1 in 2a. The PNG set by B1 in 2b. | 2 |
| `YD-LEGEND`, `YD-BAR`, `ISLAND-COMMENT` | `yd-rules-legend` for the rules legend of the chrome. `yd-bar` stays a chrome class. Y1 and B3 corrected the island comments. | 2.3, 6 |
| `MOTION-STOP-OWNER`, `SOUND-OWNER`, `UNMOUNT`, `SWITCH-BUTTONS` | Y4 (Y4a and Y4b in 2c). | 6 |
| `TAURI`, `DOCS-WRITER`, `ARCH-UPDATE`, `ARCH-GATE` | `src-tauri/**` waits. D1 writes the root documents and makes the last pass of this file; the lead writes `DECISIONS.md` and this file at each wave merge. No new gate for the "must not contain" columns. | 2.7, 5.2, 6, 9 |
| `C7-DRILL`, `TILE-BAR`, `ENTRY-ONE`, `BRIDGE-DEAD`, `U44-GUARDS`, `U26-NOTE` | Rulings of Wave 2c, built by U1-D. | 2, 3, 5.2 |
| `LEARN-GAP`, `SESSION-LENGTH` | A learn card before the first question about a new item (D-0041). | 3 |
| `RADIO-SEVERITY` | A miss in the Radio test is announced by the severity of its own item (D-0042). | 2.1 |
| `SOUND-KEY`, `MASTERY-NOW`, `LOAD-NEW-PROFILE`, `RESET-COPY` | The stored progress (D-0043). | 2.1, 3 |
| `SW-NAME`, `WIN-HOLD`, `FROM-NOW`, `SOUND-STOP`, `CERTIFY-FOCUS`, `TRACK-MONO` | The Yard (D-0044 and section 2.6 of the rulings). | 6 |
| `LINT-ONE` | The last lint warning stays. The G1 close of Wave 2c sets the limit to the count that remains. | 2.6 |

**Ruled by the owner after Gate A (D-0038).** The owner took the recommended option of each of
the 19 picks of `specs/briefs/lead-rulings.md`, section 3: the written exception for travel in the
Yard drawing; one window that fills the browser; the app sizes for reading text; one tone for each
live domain; gold for the route, the engine and the goal; the form of the drawing kept for a job;
the C2 words as sketched; version `2.0.0`; and the R7 picks for motion, sound and the controls.

**Closed by the owner at the end of Wave 2c.** The new learner-facing words of each job of Wave 2c
(`specs/words/`): approved in one question (C3; D-0047, `WORDS-2C`).

**Open for the SME.** Until an answer, the behaviour of today stays.

| Name | What stays as today | Section |
|---|---|---|
| `FLASH` | The lamp flash of `signal.ts`, also with reduced motion on. | 5.3 |
| `YELLOW-WORD` | The word "yellow" in the Yard help. | 6 |
| `MIRROR-WORDS` | The words of the text mirror. The SME reads them before the change reaches `main`. | 6 |
| `R7-P6`, `R7-P7`, `R7-P13` | Where the engine rests after a spot, the picture of a kick, the sound of a spot. | 6 |
| `C2-WORDS`, R7-P12 | The rail terms of the drawing, and the words of the cost of a move. The SME confirms them. | 6 |
| `LEARN-GAP` | One other screen between a learn card and its question. Is it enough? | 3 |
| `RADIO-SEVERITY` | Each radio item is S2. Which severity does a radio call have? | 2.1 |

The 28 notes for the SME of `specs/research/upgrade-list.md`, section 10, stay open. No job fixed one.

## 11. Not verified
1. Each item of section 9.
2. The run history of the deploy workflow and the place of the live copy (plan T13). They were not read for this file.
3. That the desktop profile is stored under the identifier (upgrade list P-24).
4. (Closed.) The counts of section 7 after the G1 close of Wave 2c: the lead measured them after the last merge.
5. What a screen reader says for the text mirror, the status regions and the names of the controls.
6. Each number that this file takes from a report and did not measure: the contrast pairs of the reskin jobs, and the timings of D-0032.

Measured for this file on 2026-11-21, on this tree: the item and trust counts of the five content files (a Node script); `npm run check` (12 of 12), `npm run build`, and `npm run test:browser` (18 of 19 before the G1 close, case 8 by design; 22 of 22 after the last merge, measured by the lead); the list and the sizes of `dist/` and the precache list of `sw.js`; the importers of each module of `src/core` and of the Yard engine (`git grep`); the lines of the `STEPS` region.

Opened and read for this file: `package.json`, `vite.config.ts`, `index.html`, `.gitignore`, `.github/workflows/check.yml` and `deploy.yml`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, each file in `src/core`, `src/state` and `src/components` (`signal.ts` in the parts cited), each file in `src/stations` (`yardSim.js`, `radioSim.js` and `RadioTest.tsx` in the parts cited), the heads and the exports of each file in `src/stations/yard`, the heads of the tools of `npm run check`, the head of `tests/browser/smoke.mjs` and its cases 13 and 19, `tests/unit/signal.test.ts` (its head), the bridge (blocks 1 to 3, the heads of 4 to 6), the heads of the parts of the parts file, `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml` (its head), `src-tauri/src/lib.rs`, `src-tauri/capabilities/default.json`, `src/styles/dusk.lock.json` and `tools/frozen.lock.json`.

## 12. Check record, after the rulings
*History: the record of the check of the first version of this file (2026-11-20). Its rows describe
that version and not the sections of today.*

Check of this file after the rulings were applied, 2026-11-20, on the tree of commit `9e5dd24`. The checker changed no code and no content. The full record, with the scripts and the scratch trials, is at the end of `specs/briefs/00-contracts.md`. Result words: **pass**, **repaired** (the row says what changed), **open** (the row says why).

| # | Check | Result | What |
|---|---|---|---|
| 1 | The rulings of `lead-rulings.md`, sections 1 and 2 | repaired | Each ruling that this map names is given as ruled, in sections 2, 5, 6, 7, 8 and 10. Repaired: section 10 put `R7-P3` with the open picks. It is the pick of row U-13, which is ruled. |
| 2 | Open names | pass | The mark PENDING RULING stands only at open names: `TIER` (the exception), `FORM-CHANGE`, `GOLD`, `MIRROR-WORDS`, and the table of section 10. Each one says that the behaviour of today stays. |
| 3 | Form | pass | This file is not a brief. Section 8 gives the fence by rule number and names its source. |
| 4 | Ownership | pass | The writer columns of sections 5.2 and 6 are equal to the contract, A.3.2 to A.3.5. |
| 5 | Names | pass | Each path, class, attribute, id, npm script, tool name and type name of this file has the spelling of the contract (script `paths.mjs`). The new Yard files end in `.ts`. |
| 6 | Parallel safety | pass | This file orders no job. |
| 7 | The gate at the end of 2a | pass | Section 7 names the 11 steps of the contract, B.4. |
| 8 | The fence | pass | This file holds no rule text and no rule number, no name of a person and no job title for the owner (`grep`). |
| 9 | Truth | repaired | Opened and equal: each cited line of sections 2.1 to 2.7 and 3 that was opened (more than 50 lines), the item and trust counts of the five content files, and the 16 files and 626,140 bytes of `dist/`. Repaired: section 2.7 cited `vite.config.ts:14-42` and the block ends on line 41; the "Today" line now names this file as new at the root. |
| 10 | This file | repaired | The tier line stands alone on line 20 and is equal to line 5 of `DECISIONS.md`. The file does not name an earlier form of itself. The five links of the head resolve from the repository root. "Today" is true against the code where it was opened. "Planned" is equal to the contract. Repaired: the list "Not verified" now has the heading of section 11, which the head of the file names. |

Open, for the lead: this file is not committed yet. It is a new file in the working tree.

## 13. Record of the last pass (job D1, 2026-11-21)
| # | Check | Result | What |
|---|---|---|---|
| 1 | Truth | pass | Each statement of sections 1 to 7 was opened against the code of this tree (the list of section 11). Each count was measured again (section 11). |
| 2 | The drift rows of R6 section 11 | pass | R6 section 11 has no row in this file: the file did not exist when R6 was written. Row 31 asked for it and for the tier line; both exist. The corrections in the other documents are listed in D-0045. |
| 3 | The fence | pass | This file holds no rule text, no rule number, no name of a person and no job title for the owner (`grep`). |
| 4 | The tier line | pass | `Page law tier: STRICT` stands alone in section 1 and is equal to line 5 of `DECISIONS.md`. |
| 5 | The gates | pass | `npm run check` and `npm run build` are green after the last change of this file. |
