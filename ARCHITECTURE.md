# ARCHITECTURE.md — Clear Board

The map. What each file owns today, what each file will own after Wave 2, and what a file must not hold.

Written 2026-11-20, after Gate A closed. Paper only: no code and no content changed. The lead updates this file at each wave merge, and job D1 makes the last pass (`ARCH-UPDATE`).
Sources: [`specs/briefs/00-contracts.md`](specs/briefs/00-contracts.md) (names, paths, owners; "the contract" below), [`specs/briefs/lead-rulings.md`](specs/briefs/lead-rulings.md) (the rulings), [`specs/clear-board-2-plan.md`](specs/clear-board-2-plan.md) (the fence, section 4), [`specs/gate-a-answers.md`](specs/gate-a-answers.md), [`DECISIONS.md`](DECISIONS.md) (D-0030 to D-0037), and the reports `R1` to `R7` in `specs/research/`.

- **Today** means: read from the code on 2026-11-20. Outside `specs/`, `DECISIONS.md` and this file, the tree is equal to commit `86cfef2` (`git diff --stat`). Each line number is a line of that tree.
- **Planned** means: Wave 2, not built. Each planned statement comes from the contract. The lead accepted each file row of it (`FILES`).
- **PENDING RULING `NAME`** means: the owner or the SME has not answered. Until an answer, each job keeps the behaviour of today. Section 10 lists each one that changes this map. **Not verified** means: no check was made (section 11).
- State: Wave 1 is complete. Gate A is closed: the owner answered the four questions (D-0031 to D-0035) and the lead ruled (D-0037). Wave 2 has not started.

## 1. What the app is
1. Clear Board is a free trainer for the conductor qualification under the Canadian Rail Operating Rules (CROR).
2. It is a single-page app: Vite, React and TypeScript, with a hash router (`package.json:14-28`; `src/App.tsx:3`). Stations: Home, Reference, Drill, Signals, The Yard, Radio. Settings is a dialog.
3. One build ships two ways: an offline PWA and a Tauri desktop shell (`vite.config.ts:9`, `:14`; `src-tauri/tauri.conf.json:8`).
4. It has no server, no account and no analytics. Content is five JSON files. Progress is one profile in `localStorage` on the device.
5. The content is safety-critical. A wrong rule taught as correct is the worst failure. The rulebook is not in the repository. No agent writes, corrects or cites a rule.

Page law tier: STRICT

The line above is also line 5 of `DECISIONS.md` (D-0030). The owner kept STRICT and approved one written exception (D-0038): the Yard drawing can show travel of equipment after a learner action. Reduced motion stops it.

## 2. The file map, today
```
index.html                       the one page: the root element, the theme colour, the description
vite.config.ts                   the build: relative base, the React plugin, the PWA plugin and its manifest
package.json                     6 scripts, 3 run-time packages, 9 development packages
public/data/*.json               FROZEN. The five content files.
public/favicon.svg               the tab icon and the manifest icon. A template file today (D-0034). Planned: S1 replaces it with the 16 px drawing of the monogram and adds public/icon.svg, the master drawing, for the manifest (ICON-SVG). B1 makes the PNG set in 2b (ICON-PNG).
public/icons.svg                 dead. Shipped and cached (vite.config.ts:17).
src/main.tsx                     the entry. One style import (line 3). Renders App.
src/App.tsx                      the shell: skip link, header, hash routes, focus move on navigation, the Settings dialog
src/index.css                    the app sheet: each shell and station rule, the reading modes (148 lines)
src/App.css, src/assets/*        dead template files (plan T5)
src/core/                        logic and types. No React import. No import from state/ or stations/.
src/state/AppContext.tsx         the one provider: content, profile, settings, grading
src/stations/*.tsx               the React stations
src/stations/imperativeStation.ts  the bridge hook for the two islands
src/stations/yardSim.js          island: the Yard station. Style, markup and controller in one file (718 lines).
src/stations/radioSim.js         island: the guided Radio. Lines 84 to 123 are STEPS (FROZEN region).
src/stations/yard/*.js           the Yard engine: four FROZEN modules, and render, anim, sound
src/styles/dusk/*.css            Dusk 0.2.0, the locked copy, six files. Nothing imports it today (checked by grep).
src/styles/dusk.lock.json        the source commit and a SHA-256 for each of the six files
tools/*.mjs                      the four gate scripts of npm run check
src-tauri/                       the desktop shell
.github/workflows/deploy.yml     check, build and deploy on a push to main
dist/, .gate/, node_modules/     build output and scratch. Not committed (.gitignore:10-13).
DECISIONS.md, ARCHITECTURE.md    the decisions and this map. The lead writes both (DOCS-WRITER).
```

### 2.1 `src/core` and `src/state`
| File | Owns | Read by |
|---|---|---|
| `core/sr.ts` | The retention schedule: `newState`, `grade`, `isDue`, `decayedFam`. A correct answer gives the interval 1, then 6, then interval times ease. Ease stays in 1.3 to 2.8. Familiarity is interval / 30, at most 1. The half-life is 60 days (`:18-24`, `:37`). | `store.ts`, `AppContext.tsx`, `Drill.tsx`. `tools/sr-vectors.mjs` pins `grade` and `newState`. |
| `core/store.ts` | `DOMAINS`: seven domains, each one live (`:6-14`). The profile: `freshProfile`, `loadProfile`, `saveProfile`, key `cb.profile.v1` (`:16`, `:21-43`). The content: `loadContent` (`:46-61`). The trust filters `gradable` and `drillable` (`:64-72`). `recomputeMastery` with the signals cap (`:76-92`). `stageFor` (`:95-102`). | `AppContext.tsx`, `Home.tsx`, `Drill.tsx`. No file in `src/` imports `gradable` (checked by `grep`). |
| `core/severity.ts` | S1, S2 or S3 for an item: a default for each domain and 11 overrides by item id (`:11-23`). Line 3 is one of the six places of P-25. | `Drill.tsx`: the tone of a miss, the order of the review round. |
| `core/signal.ts` | FROZEN. `drawSignal(spec)` returns one SVG string. `lampFill` gives the lamp colours. The lamp flash is an `<animate>` element (`:35`). | `Signal.tsx` only. |
| `core/types.ts` | The types of content, profile and settings. No run-time code. | Each file above, and the stations. |
| `state/AppContext.tsx` | The one provider (`App.tsx:59`). It holds `content` (null until the load ends), `profile` and `settings`. It gives seven functions: `setSetting`, `resetProgress`, `recordAnswer`, `recordYardWin`, `recordRadioStep`, `persistProfile`, `speak` (`:19-30`). It writes the reading modes on `html` (`:57-60`). Settings key `cb.settings.v1` (`:9`, `:61`). The first value of `reduce` comes from the device flag, read one time (`:12`). | Each station, through `useApp()`. |

### 2.2 `src/stations`
| File | Route | Owns | Writes to the profile |
|---|---|---|---|
| `Home.tsx` | `/` | The stage, the overall mastery, seven domain cards, the station buttons, the footer. | No. |
| `Reference.tsx` | `/reference`, with `?focus=<item id>` | The search over each content item (219 today), the trust badge, the detail with the rule text and the source. It shows an item of each trust value. | No. |
| `Drill.tsx` | `/drill`, `/drill/:domain`, `/signals` | The session builder, the question builder, the feedback, the review round. | `recordAnswer` (`:219`). |
| `Signal.tsx` | — | A wrapper: it puts the string of `drawSignal` into `span.signal`. | No. |
| `Radio.tsx` | `/radio` | Two tabs: Guided (the island) and "Call it yourself". | No. |
| `RadioTest.tsx` | inside `/radio` | The graded call quiz. It reads `STEPS` by a lazy import of `radioSim.js` (`:65`). | `recordRadioStep`, only for a verified item (`:95`, `:150`). |
| `Yard.tsx` | `/yard` | The host element of the Yard island (`:7-8`). | Through the bridge object. |
| `Settings.tsx` | a dialog | The native `<dialog id="settings">`, five toggles with the ids `t-dys`, `t-contrast`, `t-reduce`, `t-audio`, `t-big`, and the reset. | `setSetting`, `resetProgress`. |
| `imperativeStation.ts` | — | The hook `useImperativeStation`: section 2.3. | No. |

### 2.3 The two imperative islands and their contract
An island is a plain JavaScript module that draws its own DOM inside one host element. React does not render its content. There are two: `yardSim.js` and `radioSim.js`.

| Item | Today | Where |
|---|---|---|
| Entry and host | A lazy `import()`. Each island is its own chunk in the build. The hosts are `<div class="yard-host">` and `<div class="radio-host">`. | `Yard.tsx:7-8`; `Radio.tsx:12-13`; `RadioTest.tsx:65` |
| Module shape | `{ mount: (host, ctx) => void }`. `radioSim.js` also exports `STEPS`. | `imperativeStation.ts:9`; `radioSim.js:84`, `:133` |
| Bridge object `ctx` | Six fields: `profile`, `settings`, `speak`, `save`, `recordYardWin`, `go(route)`. One object for the life of the mount. React writes the new values into the same object on each render. | `imperativeStation.ts:17-29` |
| Mount and scope | The island adds one `<style>` element to `<head>` (`yard-style`, `radio-style`) and sets `innerHTML` of the host. Each island rule is under `.yard-wrap` or `.radio-wrap`. | `yardSim.js:40-43`, `:213-222`; `radioSim.js:6`, `:125-135` |
| Teardown | React sets `host.innerHTML = ''`. The module gets no call. | `imperativeStation.ts:37` |
| What an island reads | The Yard: `ctx.go`, `ctx.settings.reduce` (one time, at mount), `ctx.profile.yard`, `ctx.save`, `ctx.recordYardWin`, `ctx.settings.audio`. It does not call `ctx.speak`. The Radio: `ctx.go`, `ctx.settings.audio`, `ctx.speak`. It writes nothing to the profile. | `yardSim.js:225`, `:228`, `:452-484`, `:715`; `radioSim.js:136`, `:178` |

The comments that call an island "byte-for-byte" are not true today (`Yard.tsx:1-2`, `imperativeStation.ts:1`, `Radio.tsx:2`; `yardSim.js:3-7` says so itself; R6 section 11, row 20). Planned: Y1 corrects the first two in 2a, and B3 corrects the third in 2b (`ISLAND-COMMENT`).

### 2.4 `src/stations/yard`: the engine modules
| File | Owns | Imported by |
|---|---|---|
| `geometry.js` FROZEN | The logical space 1340 by 460 (`:5`). Six tracks AS71 to AS76 (`:17`). Switch positions, routes, arclength helpers. Lengths and clearances: `CLEAR`, `SPOT_CLEAR`, `LEAD_CLEAR` (`:35-56`). The five car types with a length and a kick flag (`TYPES`, `:43-48`). | `model.js`, `solver.js`, `render.js`, `yardSim.js` |
| `model.js` FROZEN | The state and the moves: `freshState`, `lineSwitch`, `pull`, `spot`, `kick`, `secure`, the `can…` checks with their refusal messages, `checkWin`, `unsecuredGoal`, `grade`. It reads lengths and clearances from `geometry.js` (`:9`). | `solver.js`, `yardSim.js`, `tools/securement-check.mjs` |
| `solver.js` FROZEN | `solve` (cost: moves, then joints) and `replay`. It applies the moves of `model.js`. | `tools/solve.mjs` only. No file in `src/` imports it (checked by `grep`). |
| `puzzles.js` FROZEN | `RULES`: ten rule chips with their citation text (`:9-20`). `TIERS`: seven (`:25-33`). `PUZZLES`: 19 jobs, each with a start layout, a goal, a par, the line `opt` and `optJoints`. | `yardSim.js`, `tools/solve.mjs`, `tools/securement-check.mjs` |
| `render.js` | One function, `render(ctx, state, puzzle, { anim, cine })`, on a 2D canvas. Its own palette (`:10-19`). | `yardSim.js:16`, `:264` |
| `anim.js` | `easeInOut`, `setSpeed`, `play(steps, { onFrame, onDone })`. `play` multiplies each duration by the speed factor (`:17`). | `yardSim.js:17` |
| `sound.js` | Synthesized effects, no asset file. `sfx`, `resume`, `toggleMute`, `isMuted`. It reads the key `sl_muted` from `localStorage` when the module loads (`:5`). | `yardSim.js:18` |

`yardSim.js` holds the rest: the style (`YARD_CSS`, `:42-138`), the markup (`YARD_HTML`, `:142-211`), and `mount` with the game loop, the move builder, the switch list, the records and the job picker (`:213-718`). The canvas click is the only way to line a switch (`:285-296`). With "Reduce motion" on, a move is 6 times slower and does not stop (`:228-229`; `anim.js:17`; plan correction T4).

### 2.5 `public/data`: the five content files and the trust rule
| File | Items | Trust values (counted on 2026-11-20) | Loaded by |
|---|---|---|---|
| `definitions.json` | 63 | 63 verified | `store.ts:17` |
| `signals.json` | 42 | 38 verified, 4 needs-review | `store.ts:17` |
| `rules.json` | 100 | 100 verified | `store.ts:17` |
| `radio-script.json` | 14 | 8 verified, 6 operating-practice | `store.ts:17` |
| `rule-questions.json` | 226 questions, each with a `ruleId` | — | `store.ts:18` |

The trust rule:
1. Each content item has `citation.trust`: `verified`, `needs-review` or `operating-practice` (`types.ts:3`, `:10-16`). Reference shows each item with its trust badge (`Reference.tsx:8-12`).
2. Only a `verified` item enters a graded path: section 3, guard F1.
3. `tools/content-check.mjs` fails when a question points at an item that is not verified (check F), and when a graded radio step does not cite a verified CROR rule (check H).
4. Each radio item points at one step of `STEPS` by `payload.step` (`types.ts:34-36`). Check G proves that the 14 items match the 14 calls one to one.
5. No tool and no agent proves that a rule text, an answer or a citation is correct. That is the SME's (R6 6.1).

### 2.6 `tools`: the four gates
`npm run check` is one `&&` chain today (`package.json:12`). The first failure stops the chain. Lint and `tsc` are not in it. `tsc` runs in `npm run build` (`package.json:8`). Each script reads and never edits data.

| Order | Script | Proves (R6 6.1, checked there) |
|---|---|---|
| 0 | `sr-vectors.mjs` | 7 checks on `grade` and `newState`. It writes `.gate/sr.mjs` into the tree (`:9-15`). |
| 1 | `solve.mjs` | 19 of 19 jobs: the authored line wins in exactly par moves, the solver finds no shorter line, `optJoints` is true. |
| 2 | `content-check.mjs` | 9 checks, A to I, on the five content files and on the calls of `radioSim.js`, which it reads as text (`:37-43`). |
| 3 | `securement-check.mjs` | 15 assertions: securement is a player action, and the 19 pars equal a second list in the script. |

### 2.7 The desktop shell, the PWA set-up and the build output
| Part | Where | What is true today |
|---|---|---|
| Desktop shell | `src-tauri/tauri.conf.json` | Product name `Clear Board`, version `0.1.0`, the identifier, one window 1040 by 840 (minimum 600 by 600), front end `../dist` built by `npm run build`, bundle target NSIS, no content security policy. The identifier must not change: the profile of a desktop learner is stored under it (upgrade list P-24; not verified here). |
| Desktop shell | `src-tauri/src/`, `Cargo.toml`, `capabilities/`, `icons/` | The shell holds no app logic: `lib.rs` adds a log plugin in debug builds only. The capability is `core:default`. The 16 icon files are the default mark of the framework (plan T6). |
| PWA | `vite.config.ts:14-41` | `registerType: 'autoUpdate'`, `injectRegister: 'auto'`. The cache pattern `**/*.{js,css,html,svg,json,woff2}` includes `.json` on purpose: the content files are the app (`:19-21`). The manifest has a name, a short name, a description, `display: standalone`, a relative `start_url` and `scope`, two colour values and one SVG icon (`:24-40`). |
| PWA | `dist/sw.js` | The worker caches 14 files, 609,219 bytes, against a budget of 5 MB (R6 4.2, checked there; `SPEC.md:187`). It has no run-time cache rule (R6 section 8). |
| Build | `package.json:8`; `vite.config.ts:9` | `npm run build` runs `tsc -b`, then `vite build`. `base: './'` gives relative addresses, so one build runs under a sub-path and inside the desktop shell. |
| Build output | `dist/` | 16 files, 626,140 bytes on disk (checked with `wc -c`; equal to R6 4.1; no build was run for this file): `index.html`; `assets/index-*.js` and `assets/index-*.css` (the main chunk and the one sheet); `assets/yardSim-*.js` and `assets/radioSim-*.js` (the two lazy island chunks); `data/*.json`, `favicon.svg`, `icons.svg` (copies of `public/`); `manifest.webmanifest`, `registerSW.js`, `sw.js`, `workbox-*.js` (the PWA plugin). |
| Deploy | `.github/workflows/deploy.yml` | On a push to `main`: `npm ci`, `npm run check`, `npm run build`, then the Pages steps. The last steps fail, and the live copy is served from the owner's site repository (plan T13; the run history was not read for this file: not verified). |

## 3. The data flow
```
public/data/*.json ──fetch──► loadContent (store.ts) ──► content { items, byId, byDomain, questions, questionsByRule }
localStorage cb.profile.v1 ──► loadProfile (store.ts) ──► profile { settings, items, domains, yard, path }
                                         │
                              AppContext.tsx: the one provider
                                         │
Drill ─────── recordAnswer(item, correct) ────────────────────┐
The Yard ──── ctx.recordYardWin(itemIds, true) ─► gradeItems ─┤─► grade (sr.ts) ─► recomputeMastery ─► saveProfile
Radio test ── recordRadioStep(itemId, correct) ─► gradeItems ─┘
The Yard ──── changes profile.yard in place, then ctx.save() ─► persistProfile ─► saveProfile
```
- **Content load.** One load at start (`AppContext.tsx:46`). `loadContent` fetches four item files and one question file (`store.ts:17-18`, `:46-61`). A file that does not load is skipped with no message (`:49`, `:53`).
- **One profile.** One object under one key. `loadProfile` takes a stored profile only when `schema` is 1; in each other case it returns a fresh profile (`store.ts:30-39`). `profile.items` holds one retention state for each item id. `profile.domains` holds one mastery value for each domain.
- **One mastery model.** The mastery of a domain is the mean decayed familiarity of its drillable items (`store.ts:78-92`; `sr.ts:34-38`). It is computed again after the content load and after each graded answer (`AppContext.tsx:51`, `:83`, `:109`).
- **Three writers to the model.** The Drill, a Yard win and the Radio test. The guided Radio grades nothing (`radioSim.js:184-186`).
- **A second write path.** The Yard changes `ctx.profile.yard` in place (`completed`, `best`) and calls `ctx.save()` (`yardSim.js:457-480`; `AppContext.tsx:125-128`).

| Guard | Where | What it does |
|---|---|---|
| F1, trust | `store.ts:69-72`; `AppContext.tsx:101`; `RadioTest.tsx:95`, `:150` | Only a `verified` item is graded. A rule item is drillable only with one authored question or more. The Drill builds its queue with `drillable` (`Drill.tsx:86-87`). `recordAnswer` has no trust check of its own (`AppContext.tsx:73-87`). |
| F2, due | `AppContext.tsx:79`, `:102` | A correct answer on an item that is not due writes nothing. A miss always writes. |
| Signals cap | `store.ts:76`, `:86-88` | The signals mastery stays at 0.33 or less until one signal aspect has a correct answer. |
| Drill filter | `Drill.tsx:88`, `:92` | The Drill draws no radio item and no signal item with an empty aspect list. |
| Yard map | `yardSim.js:25-38` | A win grades only the content items that `RULE_ITEMS` names for the rule chips of the job. |
| Watched line | `yardSim.js:425`, `:484` | A watched optimal line writes no best record and no mastery. It still adds the job to `completed` (`:463-464`). Row U-04 has the owner's yes: the old marks stay, and U1 changes the write in 2c. |
| No "test-ready" claim | `store.ts:94-102` | The stage names make no such claim (D-0013). |

These upgrade rows have the owner's yes (D-0035) and change sections 2 and 3 when they are built: U-04, U-05, U-07, U-10, U-13, U-34, U-44. U1 and G1-2 carry them in Wave 2c. Row U-50 has a no. None is in a Wave 2a brief.

## 4. The frozen set
No edit, no reformat, no move (fence rule 1). No job owns a frozen file in any wave.

| File | Why it is frozen |
|---|---|
| `public/data/*.json` (five files) | The content: the rule text, the answers, the citations, the trust values. The rulebook is not in the repository, so no agent can check a change. |
| `src/core/signal.ts` | The signal drawing. A wrong aspect teaches a wrong indication. The file says that it is a verbatim copy of a verified renderer (`:1-7`). |
| `src/stations/yard/model.js` | What the game allows and refuses: the moves, securement, the kick rules, the refusal messages. |
| `src/stations/yard/solver.js` | It proves each par. A change makes the proof worth nothing. |
| `src/stations/yard/puzzles.js` | The 19 jobs, the pars, the optimal lines, the rule chips with their citation text. |
| `src/stations/yard/geometry.js` | It looks like layout, but `model.js` reads its lengths and clearances (`model.js:9`). A changed number changes what the game allows. |
| `src/stations/radioSim.js`, lines 84 to 123 (`STEPS`) | The call wording of 14 steps, tuned by the SME (`:81-83`). The other lines of the file are not frozen; fence rule 3 covers their words. |

- Checked on 2026-11-20: the ten whole files are equal to commit `94a41c5` (`git diff --stat`, empty), each SHA-256 is equal to the table of R6 5.1, and the text hash of the `STEPS` region is equal to R6 5.1.
- Today no gate proves the set. Planned: `check:frozen` is step 1 of `npm run check` (section 7).
- Frozen does not mean correct. Open items for the SME stay open (plan T11). A finding about content is a note for the SME, never an edit.
- Locked, and not part of the frozen set: the six files in `src/styles/dusk/` and `src/styles/dusk.lock.json`. No job edits them. On 2026-11-20 each file hash was equal to the lock.

## 5. The style layers (planned)
Today there is one sheet (`src/index.css`) and two `<style>` elements that the islands add. Each statement below is planned.

### 5.1 Files and load order
`src/main.tsx` imports the sheets in this order (contract C.1). S1 writes the fourteen lines in 2a. No 2b job edits `src/main.tsx`.
```ts
import './styles/dusk/dusk.tokens.css'      // 1 · Dusk: each raw value
import './styles/dusk/dusk.base.css'        // 2 · Dusk: ground, type, focus ring
import './styles/dusk/dusk.components.css'  // 3 · Dusk: the parts
import './styles/dusk/dusk.compose.css'     // 4 · Dusk: where the parts sit
import './styles/dusk/dusk.motion.css'      // 5 · Dusk: entrances and ambient, OPEN only
import './styles/clear-board.tokens.css'    // 6 · the bridge
import './styles/clear-board.parts.css'     // 7 · the cb- parts
import './index.css'                        // 8 · the app sheet (the old rules, until the sweep)
import './styles/surfaces/shell.css'        // 9 · then home, settings, reference, drill, radio: the six surface sheets
```
- `dusk.process.css` is the sixth Dusk file. It stays in the copy and is not imported (R3 8.2).
- The Yard sheets (`yard/yard.css`, `yard/drawing/drawing.css`) are in the lazy Yard chunk. The Radio island keeps its `<style>` element. A lazy sheet holds only rules under `.yard-wrap` or `.radio-wrap`. Dusk and the bridge stay out of each lazy chunk (R3 8.1).
- The first eight imports were built and measured (R3 Check 8.1.2). The order with the six surface sheets was not built: not verified.

### 5.2 Ownership
| File | Owns | Must not contain | Writer in 2a / 2b / 2c |
|---|---|---|---|
| `src/styles/dusk/*.css` (six), `dusk.lock.json` | Dusk 0.2.0, as its own `ARCHITECTURE.md` says. Each class has the prefix `dusk-`; the one exception is `is-in`. | An edit. | never |
| `src/styles/clear-board.tokens.css`, the bridge | Six blocks, in order: (1) the old shell names on Dusk tokens; (2) the seven Dusk type sizes in `rem` and `--lh-base`; (3) the eight `--cb-*` names; (4) the dyslexia block; (5) the high-contrast block; (6) the Yard block, `--yard-*`, between `/* yard:start */` and `/* yard:end */`. It is the only file that fence rule 4 allows a raw colour in, outside the frozen files. A recorded exception: the icon files and the desktop window colour (row U-45; D-0036). The selector of block 6 is `:root` (`YARD-BLOCK`). | A rule that styles a part: the file declares custom properties, and the two spacing declarations of block 4. A declaration of `--lanes`. A map of the old island names. A new name with no `--cb-` or `--yard-` prefix. | S1 / Y2, the Yard block only / U1, not the Yard block; Y4 owns the Yard block (`YARD-BLOCK-2C`) |
| `src/styles/clear-board.parts.css` | Each `cb-` part of the gap register (G1 to G20), the 44 px floor, the three reduced-motion rules, the mark rules in one block. A rule that names a Dusk class has `.cb-app` in front. | A raw colour. A declaration of a custom property that Dusk declares (`--led-size` is one). A rule that only one surface needs. A bare `is-` state class: a state is a `data-` or an ARIA attribute. | S1 / closed / U1 |
| `src/index.css`, the app sheet | The old shell and station rules, until the sweep. `html { font-size: var(--fs) }`. The reduced-motion block for the device flag. | A raw colour. A declaration of `--ink` or `--focus`. After 2a, a new rule: a new rule goes in a surface sheet (contract C.2). | S1 / B1, the rules of the B1 list only / U1, the sweep (`SWEEP`) |
| `src/styles/surfaces/*.css` (six) | The rules that one surface needs. A class has the prefix of its surface (`cb-shell-`, `cb-home-`, `cb-settings-`, `cb-reference-`, `cb-drill-`, `cb-radio-`). An override of a Dusk class or a `cb-` part is under the scope class of the surface. | A raw colour. A class of another surface. An edit of a shared part. | S1 makes each one / B1, B2, B3 / U1 |
| `src/stations/yard/yard.css` | The Yard chrome. Each selector starts with `.yard-wrap`. Each class is `yd-`. | A raw colour, after step 2 of Y1. A selector under `.yd-view` or `.yd-legend`. | Y1 / Y3 / Y4 |
| `src/stations/yard/drawing/drawing.css` | The Yard drawing. Each selector starts with `.yard-wrap .yd-view` or `.yard-wrap .yd-legend`. Colour comes only from `--yard-*` names. | A raw colour. A chrome class. | Y1 (the one canvas rule) / Y2 / Y4 |
| The style rules in `radioSim.js` (lines 5 to 33) | The guided Radio, under `.radio-wrap`. | A raw colour, after B3. A changed word. `B3-LINE`: B3 can edit each colour and each style value of the file, in a style rule, in markup and in script, and no word. | — / B3 / U1 |

Rules for each app sheet: no raw colour; a new custom property has the prefix `--cb-` or `--yard-`; only the bridge declares a name that Dusk declares (contract B.1, the five rules).

### 5.3 The reading-mode attributes
| On | Attribute | Values | Set by | Read by |
|---|---|---|---|---|
| `html` | `data-dys` | `"1"`, `"0"` | `AppContext.tsx:57` | Block 4 of the bridge |
| `html` | `data-contrast` | `"1"`, `"0"` | `AppContext.tsx:58` | Block 5 of the bridge |
| `html` | `data-reduce` | `"1"`, `"0"` | `AppContext.tsx:59` | The three rules in the parts file (P-14) |
| `html` | `style="--fs: …"` | `16px`, `18.5px` | `AppContext.tsx:60` | `html { font-size: var(--fs) }` |
| `html` | `data-tier` | `"strict"` | S1, static, in `index.html` | `dusk.motion.css`. The tier is STRICT (section 1). |
| `body` | `class="cb-app"` | — | S1, static, in `index.html` | Each rule that names a Dusk class |

- The "Set by" column of the first four rows is true today. The last two rows and the "Read by" column are planned. `AppContext.tsx` does not change in 2a or 2b.
- Dusk reads three attributes only: `data-tier`, `data-ambient`, and `data-label` on a table cell. A new attribute on `html` needs the lead.
- Dusk stops its motion on the device flag only. The three rules in the parts file repeat that stop under `data-reduce` (R3 5.4).

## 6. The Yard (planned)
```
Yard.tsx ─► yardSim.js  THE CONTROLLER ─► yard/view.ts    THE VIEW (2a) ─► yard/yard.css
                                       ─► yard/draw.ts    THE DRAWING ADAPTER (2a) ─► yard/drawing/layout.ts, bodies.ts, svg.ts (2b), drawing.css
                                       ─► yard/access.ts  THE ACCESS LAYER (2c)
                                       ─► yard/anim.js, yard/sound.js
                                       ─► yard/model.js, puzzles.js, geometry.js    THE ENGINE, FROZEN (solver.js: tools only)
```
| Layer | File | Owns | Must not contain | Writer in 2a / 2b / 2c |
|---|---|---|---|---|
| Engine | `model.js`, `solver.js`, `puzzles.js`, `geometry.js` | Section 2.4. | A change. | frozen |
| Controller | `yardSim.js` | The game state, the move logic, the records, `RULE_ITEMS`, the sound calls, the event wiring. It exports `mount(root, ctx)` and nothing else. It reaches an element by an id or through a view function. | A class name. A markup string. An inline style. An import of `render.js`. | Y1 / closed / Y4 |
| View | `yard/view.ts` | `createView(root)`: each markup string, each class name, the functions of contract C.4 (`setReadout`, `setBanner`, `setRefusal`, and the others). It sets `data-cb="yard-drawing"` on the frame of the drawing. | Game state. An import of a function of `model.js`. | Y1 / Y3 / Y4 |
| Drawing adapter | `yard/draw.ts` | `createDrawing(host, { onPick })` gives `paint(state, puzzle, { anim, cine })`, `switchBoxes()`, `onLayout(fn)`, `destroy()`. In 2a it holds the canvas (`canvas#yard.yd-view`) and calls `render.js`. In 2b Y2 replaces the inside. | A colour in script. A change of a number of `geometry.js`. | Y1 / Y2 / Y4 |
| Drawing | `yard/drawing/layout.ts`, `bodies.ts`, `svg.ts` | The SVG drawing of look C2: the view transform and the rule that selects the form; one pure function from the state, `anim` and `cine` to a list of bodies; the one inline SVG with one group for each body. | A canvas. A raw colour. A typed fallback for a missing custom property. | — / Y2 / Y4 |
| Access layer | `yard/access.ts` | The switch buttons, the text mirror, the status region (below). | A rule text. A changed message of the model. | — / — / Y4 |
| Motion, sound | `yard/anim.js`, `yard/sound.js` | The three exports and the four exports of today keep their signatures in 2b. | — | — / Y2 (`anim.js`) / Y4 (`SOUND-OWNER`) |
| Old drawing | `yard/render.js` | Y2 deletes it, or keeps it with no raw colour. The claim in its comment on line 2 does not move into a new file (plan T12). | — | — / Y2 / Y4 |

**The drawing: look C2 on a view transform.** Gate A, question 1: the look is C2 (`specs/research/yard-looks/look-model2.*`). R2: one inline SVG, no canvas.
- One SVG whose viewBox equals its CSS size. Rails, ties, a car shape for each of the five types, an engine.
- Each point of `geometry.js` goes through one pure view-transform function. `geometry.js` is imported and not changed. The view constants are values of the drawing. They are not numbers of the game.
- One picture, two forms: the wide form (the true geometry) and the tall form (one row for each track). Empty track can shrink, with a break mark. A bar carries the room on a track. The drawing measures its own host and selects its form. PENDING RULING `FORM-CHANGE` sets the rule for a change of form during a job.
- Colour is only in CSS, on the `--yard-*` names of the bridge. The drawing does not read the colours of `TYPES` in `geometry.js`. A script reads a custom property only for a size or a time.
- A state is a word and a shape, never a colour alone. Red is only the ring at the cause of a refusal. Gold for the route, the engine and the goal waits for PENDING RULING `GOLD`.
- Test hooks, proposed in the contract (C.5; E.5): `data-car`, `data-track`, `data-lined`.
- In 2b Y2 keeps a pointer path to each switch and leaves a place for each switch button in the view transform (`SWITCH-BUTTONS`). The room bar of a track has a class with the prefix `yd-view-`; the toolbar row of the chrome keeps `yd-bar` (`YD-BAR`).

**The access layer (Y4, 2c).** Gate A, question 2: a learner can finish each of the 19 jobs on a phone 390 px wide.
- Six native `<button>` elements over the SVG, in track order, placed with `switchBoxes()` and moved on `onLayout`. Each holds the switch name and the state word. Each is 44 px or more; that holds down to a window of about 378 px (Gate A, question 2). Reserved in the contract (B.6): `data-sw`, `aria-pressed`.
- A text mirror of the yard state (`#yard-mirror`) and one status region (`#yard-live`). Y4 builds the mirror from state words that the app has today, and the SME reads it before the change reaches `main` (PENDING RULING `MIRROR-WORDS`).
- Motion that stops with "Reduce motion" on (P-01): Y4 (`MOTION-STOP-OWNER`). A teardown call from React to the island: Y4, in a commit of its own (`UNMOUNT`). The sound module: Y4 (`SOUND-OWNER`).

**What stays.** The entry path `./yardSim.js`, the export `mount(root, ctx)`, the six fields of `ctx` and the teardown do not change in 2a or 2b. The classes `yard-host` and `yard-wrap` stay. The ids `picker`, `readout`, `workorder`, `act`, `count`, `track`, `work`, `optimal`, `depart`, `reset`, `mute`, `msg`, `rules`, `certify` stay through 2c. The id `yard` goes with the canvas.

**File type (row U-46, approved).** `view`, `draw` and `access` are TypeScript files, and the three drawing files of Y2 follow the same row. `yardSim.js` stays a `.js` file at its path and imports `./yard/view.ts` and `./yard/draw.ts` by the full path. `imperativeStation.ts` exports a named type for the bridge object, `StationCtx`; the view object and the drawing object have the types `YardView` and `YardDrawing` (the three names are set in the contract, C.4, and the lead can change them). `tools/solve.mjs` and `tools/securement-check.mjs` import frozen `.js` modules only, so they run unchanged.

## 7. The gates (planned)
After G1, `npm run check` is `node tools/check.mjs`. It runs each offline step in order, prints PASS or FAIL for each step, runs the remaining steps after a failure, and exits non-zero if one step failed. It needs no network, no `dist/` and no browser (contract B.4; R6 section 5).

| Step | npm script | Proves |
|---|---|---|
| 1 | `check:frozen` | No frozen file changed, moved or was reformatted. `public/data/` holds exactly five files. The `STEPS` region is equal to the lock, as text and as values. |
| 2 | `check:dusk` | The six Dusk files are equal to `dusk.lock.json`. No app rule restyles a Dusk class with no app class in front. |
| 3 | `check:colour` | No file has more raw colours than `tools/token-lint.baseline.json` says. The baseline only goes down. |
| 4 | `check:names` | No app name collides with a Dusk name. Each new custom property has its prefix. No file declares `--lanes`. |
| 5 | `lint` | `oxlint`, with a warning limit that only goes down. |
| 6 | `typecheck` | `tsc -b`. |
| 7 | `test:unit` | Unit tests for `sr`, `store` and `severity`. |
| 8 to 11 | (the four scripts of today) | Section 2.6. |

- On request, with a build and Chromium, and not part of `npm run check`: `test:browser` (the smoke test; it selects by an id or by a `data-cb` hook) and `look:baseline`, `look:compare` (pictures at 1440 and 390, and the Yard at 1280; a job commits its pictures in `specs/pictures/<wave>-<job>/` at device scale factor 1: `PICTURES`).
- Three steps start loose and get tighter at each wave merge: the colour baseline, the name allow list and the warning limit (G1-close; `G1-STEPS`).
- `.github/workflows/check.yml` runs the check on each branch and each pull request. In `deploy.yml` only line 26 changes: it moves to the Node line of `.nvmrc`, which holds `22.23.5` (`NODE`). The last step of `deploy.yml` stays as it is.
- The tools behind steps 2 and 3 are `tools/dusk-lock-check.mjs` and `tools/colour-lint.mjs`, and the look harness is `tools/look/look.mjs`. G1 writes the three as small equivalents of the reskin tools and copies no code from them (`TOOLS`, option c). The one new package is `playwright` 1.63.0, exact (`DEV-DEP`). `tools/**`, `tests/**`, `package.json` and the lock file have one line of ownership: G1, G1-close, G1-2.
- `check:colour` does not fail on the two icon files (row U-45; D-0036).
- A gate proves structure. No gate proves that a rule text is correct.

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
| The owner's look at each surface, before and after, at 1440 and 390 | It is the owner's (plan section 7). | Open. |
| A played Yard win by the owner | The open check of D-0027 (plan section 7). | Open. |
| The push to `main` and the update of the live copy | `main` moves only on the owner's typed word (fence rule 12). | Open. |
| The page law | The law text is in no repository that a session can read (R3 section 6). | Not verified. |

## 10. The rulings that shape this map
The contract, Part E, has the state of each ruling, with the options and the reason. `specs/briefs/lead-rulings.md` is the source.

**Ruled.** Each one is applied in the sections named.

| Name | The ruling | Section |
|---|---|---|
| `UPGRADE-LIST` (the owner) | Rows U-01 to U-46: yes. Rows U-47 to U-51: no. U1 and the named jobs of 2b and 2c carry them. | 3 |
| `U-46`, `U-45` (the owner) | The new Yard files are TypeScript, with a named type for the bridge object. The icon files and the desktop window colour can keep a raw colour. | 5.2, 6, 7 |
| `FILES`, `BRANCH`, `G1-STEPS`, `Y1-STEPS` | Each proposed file row is accepted. One wave branch and one local branch for each job. G1 closes at each wave merge. Y1 has two steps. | 5, 6, 7, 8 |
| `TOOLS`, `NODE`, `DEV-DEP`, `LOOK-IDS`, `PICTURES` | G1 writes its own three tools. Node `22.23.5`. `playwright` 1.63.0. The ids `yard-style` (2a) and `yard` (2b) can go. Pictures are committed at scale 1. | 7 |
| `B3-LINE`, `YARD-BLOCK`, `YARD-BLOCK-2C`, `SWEEP` | B3 can edit each colour of `radioSim.js`. Block 6 is on `:root`. Y4 owns the Yard block in 2c. U1 makes the sweep in 2c. | 5.2 |
| `ICON-SVG`, `ICON-PNG` | Two SVG files by S1 in 2a. The PNG set by B1 in 2b. | 2 |
| `YD-LEGEND`, `YD-BAR`, `ISLAND-COMMENT` | `yd-rules-legend` for the rules legend of the chrome. `yd-bar` stays a chrome class. Y1 and B3 correct the island comments. | 2.3, 6 |
| `MOTION-STOP-OWNER`, `SOUND-OWNER`, `UNMOUNT`, `SWITCH-BUTTONS` | Y4. Y2 keeps a pointer path in 2b. | 6 |
| `TAURI`, `DOCS-WRITER`, `ARCH-UPDATE`, `ARCH-GATE` | `src-tauri/**` waits. D1 writes the root documents; the lead writes `DECISIONS.md` and this file at each wave merge. No new gate for the "must not contain" columns. | 5.2, 6, 9 |

**Ruled by the owner after Gate A (D-0038).** The owner took the recommended option of each of
the 19 picks of `specs/briefs/lead-rulings.md`, section 3: the written exception for travel in the
Yard drawing; one window that fills the browser; the app sizes for reading text; one tone for each
live domain; gold for the route, the engine and the goal; the form of the drawing kept for a job;
the C2 words as sketched; version `2.0.0`; and the R7 picks for motion, sound and the controls.

**Open for the SME.** Until an answer, each job keeps the behaviour of today.

| Name | What stays as today | Section |
|---|---|---|
| `FLASH` | The lamp flash of `signal.ts`. | 6 |
| `YELLOW-WORD` | The word "yellow" in the Yard help. | 6 |
| `MIRROR-WORDS` | Y4 builds the text mirror from words the app has today; the SME reads it before the change reaches `main`. | 6 |
| `R7-P6`, `R7-P7`, `R7-P13` | Where the engine rests after a spot, the picture of a kick, the sound of a spot. | 6 |

## 11. Not verified
1. Each planned statement. Nothing of Wave 2 is built. The marks of `specs/briefs/00-contracts.md`, Part F, stay in force.
2. The run history of the deploy workflow and the place of the live copy (plan T13). They were not read for this file.
3. That `dist/` on disk is the build of the present tree. Its 16 file names and sizes are equal to R6 4.1. No build was run for this file.
4. Each number that this file takes from a report and marks "checked there": the gate counts of 2.6, the cache size of 2.7.
5. That the desktop profile is stored under the identifier (upgrade list P-24).
6. Each item of section 9.
7. That `tsc -b` and Vite accept the planned file type of section 6 for the full files of Y1: a `.js` controller that imports two `.ts` files, and the type `StationCtx` on the module type of the two `.js` islands. A small form was tried in a scratch copy by the check after the rulings: `tsc -b` exits 0 and `vite build` passes (the Y1 brief, requirement 36). No job has built the full files.
8. That the three tools that G1 writes give the same result as the reskin tools on each case (section 7).

Opened and read for this file: `package.json`, `vite.config.ts`, `index.html`, `.gitignore`, `.oxlintrc.json`, the three `tsconfig` files, `.github/workflows/deploy.yml`, each file in `src/core` and `src/state` in full, each file in `src/stations` (in full, except `Drill.tsx`, `RadioTest.tsx`, `yardSim.js` and `radioSim.js`: those four in the parts cited), the head, the imports and the exports of each file in `src/stations/yard`, the four files in `tools/` (`content-check.mjs`: lines 1 to 70 and each check heading), `src-tauri/tauri.conf.json`, `Cargo.toml`, `src/lib.rs`, `src/main.rs`, `capabilities/default.json`, `src/styles/dusk.lock.json`, the listing of `dist/`, and the Dusk files `ARCHITECTURE.md` and `README.md`.

Checks made, all read-only: the item and trust counts of the five content files (a Node one-line script); `sha256sum` of the ten frozen files and of the six Dusk files; the text hash and the call count of the `STEPS` region; `git diff --stat` against `86cfef2` and `94a41c5`; `grep` for each "no file imports" statement. No git command that changes something was run. No `npm install`, `npm ci` or `npm run build` was run in the repository.

Checked again when the rulings were applied (2026-11-20, commit `9e5dd24`): `DECISIONS.md:5` (the tier line); `imperativeStation.ts:1-4`, `:9`, `:17-24`; `Yard.tsx:1-3`, `:7`; `tsconfig.app.json:9`, `:13`; `tools/solve.mjs:16-17` and `tools/securement-check.mjs:16-17` (frozen `.js` imports only); `deploy.yml:26`; `git diff --stat 86cfef2 HEAD` outside `specs/` names `DECISIONS.md` only.

## 12. Check record, after the rulings
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
