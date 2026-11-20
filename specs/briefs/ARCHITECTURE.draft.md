# ARCHITECTURE.md — Clear Board (draft)

The map. What each file owns today, what each file will own after Wave 2, and what a file must not hold.

**Draft.** Written 2026-11-20. Paper only: no code and no content changed. The lead moves this file to the repository root after Gate A is closed.
Sources: [`00-contracts.md`](00-contracts.md) (names, paths, owners), [`../clear-board-2-plan.md`](../clear-board-2-plan.md) (the fence, section 4), [`../gate-a-answers.md`](../gate-a-answers.md), `specs/research/R1` to `R7`.

- **Today** means: read from the code on 2026-11-20. Outside `specs/`, the tree is equal to commit `86cfef2` (`git diff --stat`, empty). Each line number is a line of that tree.
- **Planned** means: Wave 2, not built. Each planned statement comes from `00-contracts.md`. **[P]** means: proposed there, the lead rules (`FILES`).
- **PENDING RULING `NAME`** means: the owner or the lead has not ruled. Section 10 lists each one that changes this map. **Not verified** means: no check was made (section 11).
- State: Wave 1 is complete. Gate A questions 1 to 3 have an answer. Question 4 (the upgrade list) is open. Wave 2 has not started.

## 1. What the app is
1. Clear Board is a free trainer for the conductor qualification under the Canadian Rail Operating Rules (CROR).
2. It is a single-page app: Vite, React and TypeScript, with a hash router (`package.json:14-28`; `src/App.tsx:3`). Stations: Home, Reference, Drill, Signals, The Yard, Radio. Settings is a dialog.
3. One build ships two ways: an offline PWA and a Tauri desktop shell (`vite.config.ts:9`, `:14`; `src-tauri/tauri.conf.json:8`).
4. It has no server, no account and no analytics. Content is five JSON files. Progress is one profile in `localStorage` on the device.
5. The content is safety-critical. A wrong rule taught as correct is the worst failure. The rulebook is not in the repository. No agent writes, corrects or cites a rule.

**The page-law tier line is not written in this draft: PENDING RULING `TIER`.** The owner has not ruled. The recommended option is STRICT with one written exception for travel of equipment in the Yard drawing. With no tier line a page is STRICT (Dusk `README.md`, step 3, checked). No `Page law tier:` line is in `DECISIONS.md` today (checked by `grep`). When the owner has ruled, the lead writes the line here, with the value that the owner picked, and removes this paragraph.

## 2. The file map, today
```
index.html                       the one page: the root element, the theme colour, the description
vite.config.ts                   the build: relative base, the React plugin, the PWA plugin and its manifest
package.json                     6 scripts, 3 run-time packages, 9 development packages
public/data/*.json               FROZEN. The five content files.
public/favicon.svg               the tab icon and the manifest icon. A template file today. Planned [P]: S1 replaces it with the monogram (Gate A, question 3); the PNG set waits (ICON-PNG).
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

The comments that call an island "byte-for-byte" are not true today (`Yard.tsx:1-2`, `imperativeStation.ts:1`, `Radio.tsx:2`; `yardSim.js:3-7` says so itself; R6 section 11, row 20).

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
| PWA | `vite.config.ts:14-42` | `registerType: 'autoUpdate'`, `injectRegister: 'auto'`. The cache pattern `**/*.{js,css,html,svg,json,woff2}` includes `.json` on purpose: the content files are the app (`:19-21`). The manifest has a name, a short name, a description, `display: standalone`, a relative `start_url` and `scope`, two colour values and one SVG icon (`:24-40`). |
| PWA | `dist/sw.js` | The worker caches 14 files, 609,219 bytes, against a budget of 5 MB (R6 4.2, checked there; `SPEC.md:187`). It has no run-time cache rule (R6 section 8). |
| Build | `package.json:8`; `vite.config.ts:9` | `npm run build` runs `tsc -b`, then `vite build`. `base: './'` gives relative addresses, so one build runs under a sub-path and inside the desktop shell. |
| Build output | `dist/` | 16 files, 626,140 bytes on disk (checked with `wc -c`; equal to R6 4.1; this job ran no build): `index.html`; `assets/index-*.js` and `assets/index-*.css` (the main chunk and the one sheet); `assets/yardSim-*.js` and `assets/radioSim-*.js` (the two lazy island chunks); `data/*.json`, `favicon.svg`, `icons.svg` (copies of `public/`); `manifest.webmanifest`, `registerSW.js`, `sw.js`, `workbox-*.js` (the PWA plugin). |
| Deploy | `.github/workflows/deploy.yml` | On a push to `main`: `npm ci`, `npm run check`, `npm run build`, then the Pages steps. The last steps fail, and the live copy is served from the owner's site repository (plan T13; the run history was not read in this job: not verified). |

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
| Watched line | `yardSim.js:425`, `:484` | A watched optimal line writes no best record and no mastery. It still adds the job to `completed` (`:463-464`). Row U-04 waits for the owner's yes. |
| No "test-ready" claim | `store.ts:94-102` | The stage names make no such claim (D-0013). |

These upgrade rows wait for the owner's yes and change sections 2 and 3: U-04, U-05, U-07, U-10, U-13, U-34, U-44, U-50. None is in a brief.

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

- Checked in this job: the ten whole files are equal to commit `94a41c5` (`git diff --stat`, empty), each SHA-256 is equal to the table of R6 5.1, and the text hash of the `STEPS` region is equal to R6 5.1.
- Today no gate proves the set. Planned: `check:frozen` is step 1 of `npm run check` (section 7).
- Frozen does not mean correct. Open items for the SME stay open (plan T11). A finding about content is a note for the SME, never an edit.
- Locked, and not part of the frozen set: the six files in `src/styles/dusk/` and `src/styles/dusk.lock.json`. No job edits them. In this job each file hash was equal to the lock.

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
| `src/styles/clear-board.tokens.css`, the bridge | Six blocks, in order: (1) the old shell names on Dusk tokens; (2) the seven Dusk type sizes in `rem` and `--lh-base`; (3) the eight `--cb-*` names; (4) the dyslexia block; (5) the high-contrast block; (6) the Yard block, `--yard-*`, between `/* yard:start */` and `/* yard:end */`. It is the only file with a raw colour outside the frozen files (fence rule 4). | A rule that styles a part: the file declares custom properties, and the two spacing declarations of block 4. A declaration of `--lanes`. A map of the old island names. A new name with no `--cb-` or `--yard-` prefix. | S1 / Y2 [P], the Yard block only / U1 [P], not the Yard block (the Yard block in 2c: PENDING RULING `YARD-BLOCK-2C`) |
| `src/styles/clear-board.parts.css` | Each `cb-` part of the gap register (G1 to G20), the 44 px floor, the three reduced-motion rules, the mark rules in one block. A rule that names a Dusk class has `.cb-app` in front. | A raw colour. A declaration of a custom property that Dusk declares (`--led-size` is one). A rule that only one surface needs. A bare `is-` state class: a state is a `data-` or an ARIA attribute. | S1 / closed / U1 [P] |
| `src/index.css`, the app sheet | The old shell and station rules, until the sweep. `html { font-size: var(--fs) }`. The reduced-motion block for the device flag. | A raw colour. A declaration of `--ink` or `--focus`. After 2a, a new rule: a new rule goes in a surface sheet (contract C.2). | S1 / B1, the rules of the B1 list only / U1 [P], the sweep |
| `src/styles/surfaces/*.css` (six) | The rules that one surface needs. A class has the prefix of its surface (`cb-shell-`, `cb-home-`, `cb-settings-`, `cb-reference-`, `cb-drill-`, `cb-radio-`). An override of a Dusk class or a `cb-` part is under the scope class of the surface. | A raw colour. A class of another surface. An edit of a shared part. | S1 makes each one / B1, B2, B3 / U1 |
| `src/stations/yard/yard.css` | The Yard chrome. Each selector starts with `.yard-wrap`. Each class is `yd-`. | A raw colour, after step 2 of Y1. A selector under `.yd-view` or `.yd-legend`. | Y1 / Y3 / Y4 |
| `src/stations/yard/drawing/drawing.css` | The Yard drawing. Each selector starts with `.yard-wrap .yd-view` or `.yard-wrap .yd-legend`. Colour comes only from `--yard-*` names. | A raw colour. A chrome class. | Y1 (the one canvas rule) / Y2 / Y4 |
| The style rules in `radioSim.js` (lines 5 to 33) | The guided Radio, under `.radio-wrap`. | A raw colour, after B3 (PENDING RULING `B3-LINE`). A changed word. | — / B3 / U1 |

Rules for each app sheet: no raw colour; a new custom property has the prefix `--cb-` or `--yard-`; only the bridge declares a name that Dusk declares (contract B.1, the five rules).

### 5.3 The reading-mode attributes
| On | Attribute | Values | Set by | Read by |
|---|---|---|---|---|
| `html` | `data-dys` | `"1"`, `"0"` | `AppContext.tsx:57` | Block 4 of the bridge |
| `html` | `data-contrast` | `"1"`, `"0"` | `AppContext.tsx:58` | Block 5 of the bridge |
| `html` | `data-reduce` | `"1"`, `"0"` | `AppContext.tsx:59` | The three rules in the parts file (P-14) |
| `html` | `style="--fs: …"` | `16px`, `18.5px` | `AppContext.tsx:60` | `html { font-size: var(--fs) }` |
| `html` | `data-tier` | `"strict"` | S1, static, in `index.html` | `dusk.motion.css`. PENDING RULING `TIER`. |
| `body` | `class="cb-app"` | — | S1, static, in `index.html` | Each rule that names a Dusk class |

- The "Set by" column of the first four rows is true today. The last two rows and the "Read by" column are planned. `AppContext.tsx` does not change in 2a or 2b.
- Dusk reads three attributes only: `data-tier`, `data-ambient`, and `data-label` on a table cell. A new attribute on `html` needs the lead.
- Dusk stops its motion on the device flag only. The three rules in the parts file repeat that stop under `data-reduce` (R3 5.4).

## 6. The Yard (planned)
```
Yard.tsx ─► yardSim.js  THE CONTROLLER ─► yard/view.js    THE VIEW (2a) ─► yard/yard.css
                                       ─► yard/draw.js    THE DRAWING ADAPTER (2a) ─► yard/drawing/layout.js, bodies.js, svg.js (2b), drawing.css
                                       ─► yard/access.js  THE ACCESS LAYER (2c)
                                       ─► yard/anim.js, yard/sound.js
                                       ─► yard/model.js, puzzles.js, geometry.js    THE ENGINE, FROZEN (solver.js: tools only)
```
| Layer | File | Owns | Must not contain | Writer in 2a / 2b / 2c |
|---|---|---|---|---|
| Engine | `model.js`, `solver.js`, `puzzles.js`, `geometry.js` | Section 2.4. | A change. | frozen |
| Controller | `yardSim.js` | The game state, the move logic, the records, `RULE_ITEMS`, the sound calls, the event wiring. It exports `mount(root, ctx)` and nothing else. It reaches an element by an id or through a view function. | A class name. A markup string. An inline style. An import of `render.js`. | Y1 / closed / Y4 |
| View | `yard/view.js` | `createView(root)`: each markup string, each class name, the functions of contract C.4 (`setReadout`, `setBanner`, `setRefusal`, and the others). It sets `data-cb="yard-drawing"` on the frame of the drawing. | Game state. An import of a function of `model.js`. | Y1 / Y3 / Y4 |
| Drawing adapter | `yard/draw.js` | `createDrawing(host, { onPick })` gives `paint(state, puzzle, { anim, cine })`, `switchBoxes()`, `onLayout(fn)`, `destroy()`. In 2a it holds the canvas (`canvas#yard.yd-view`) and calls `render.js`. In 2b Y2 replaces the inside. | A colour in script. A change of a number of `geometry.js`. | Y1 / Y2 / Y4 |
| Drawing | `yard/drawing/layout.js`, `bodies.js`, `svg.js` | The SVG drawing of look C2: the view transform and the rule that selects the form; one pure function from the state, `anim` and `cine` to a list of bodies; the one inline SVG with one group for each body. | A canvas. A raw colour. A typed fallback for a missing custom property. | — / Y2 / Y4 |
| Access layer | `yard/access.js` | The switch buttons, the text mirror, the status region (below). | A rule text. A changed message of the model. | — / — / Y4 |
| Motion, sound | `yard/anim.js`, `yard/sound.js` | The three exports and the four exports of today keep their signatures in 2b. | — | — / Y2 (`anim.js`) / Y4 |
| Old drawing | `yard/render.js` | Y2 deletes it, or keeps it with no raw colour. The claim in its comment on line 2 does not move into a new file (plan T12). | — | — / Y2 / Y4 |

**The drawing: look C2 on a view transform.** Gate A, question 1: the look is C2 (`specs/research/yard-looks/look-model2.*`). R2: one inline SVG, no canvas.
- One SVG whose viewBox equals its CSS size. Rails, ties, a car shape for each of the five types, an engine.
- Each point of `geometry.js` goes through one pure view-transform function. `geometry.js` is imported and not changed. The view constants are values of the drawing. They are not numbers of the game.
- One picture, two forms: the wide form (the true geometry) and the tall form (one row for each track). Empty track can shrink, with a break mark. A bar carries the room on a track. The drawing measures its own host and selects its form. PENDING RULING `FORM-CHANGE` sets the rule for a change of form during a job.
- Colour is only in CSS, on the `--yard-*` names of the bridge. The drawing does not read the colours of `TYPES` in `geometry.js`. A script reads a custom property only for a size or a time.
- A state is a word and a shape, never a colour alone. Red is only the ring at the cause of a refusal. Gold for the route, the engine and the goal waits for PENDING RULING `GOLD`.
- Test hooks [P]: `data-car`, `data-track`, `data-lined`.

**The access layer (Y4, 2c).** Gate A, question 2: a learner can finish each of the 19 jobs on a phone 390 px wide.
- Six native `<button>` elements over the SVG, in track order, placed with `switchBoxes()` and moved on `onLayout`. Each holds the switch name and the state word. Each is 44 px or more; that holds down to a window of about 378 px (Gate A, question 2). Reserved [P]: `data-sw`, `aria-pressed`.
- A text mirror of the yard state (`#yard-mirror` [P]) and one status region (`#yard-live` [P]). The wording waits for PENDING RULING `MIRROR-WORDS`.
- Motion that stops with "Reduce motion" on (P-01). The owner of this work: PENDING RULING `MOTION-STOP-OWNER` (recommended: Y4). A teardown call from React to the island: PENDING RULING `UNMOUNT`.

**What stays.** The entry path `./yardSim.js`, the export `mount(root, ctx)`, the six fields of `ctx` and the teardown do not change in 2a or 2b. The classes `yard-host` and `yard-wrap` stay. The ids `picker`, `readout`, `workorder`, `act`, `count`, `track`, `work`, `optimal`, `depart`, `reset`, `mute`, `msg`, `rules`, `certify` stay through 2c. The id `yard` goes with the canvas.

**File type.** PENDING RULING `U-46`: with a yes, `view`, `draw` and `access` are `.ts` files and `imperativeStation.ts` exports a named type for `ctx`. `yardSim.js` stays a `.js` file at its path in each case.

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

- On request, with a build and Chromium, and not part of `npm run check`: `test:browser` (the smoke test; it selects by an id or by a `data-cb` hook) and `look:baseline`, `look:compare` (pictures at 1440 and 390, and the Yard at 1280 [P]).
- Three steps start loose and get tighter at each wave merge: the colour baseline, the name allow list and the warning limit (G1-close, PENDING RULING `G1-STEPS`).
- `.github/workflows/check.yml` runs the check on each branch and each pull request. In `deploy.yml` only line 26 changes.
- The file names behind steps 2 and 3 wait for PENDING RULING `TOOLS`. The script names are the same in each case. `tools/**`, `tests/**`, `package.json` and the lock file have one line of ownership: G1, G1-close, G1-2.
- A gate proves structure. No gate proves that a rule text is correct.

## 8. The rules a change must keep
The full text is the fence: `specs/clear-board-2-plan.md`, section 4, rules 1 to 15. Each brief carries it in full. The short form, with the rule numbers:
- **Content (1, 2, 15).** A frozen file gets no edit, no reformat and no move. No agent writes, corrects or cites a rule: a finding about rule content is a note for the SME. Show nothing rather than something false, and mark a claim that has no check as not verified.
- **A reskin (3, 4).** It changes no behaviour, no number, no word and no control. No raw colour is outside the bridge file and the frozen files.
- **Meaning and access (5, 6, 7, 8).** Red is attention only, and words carry a state, never a colour or a glow alone. Reduced motion stops each effect and nothing goes blank. The four reading modes survive. Contrast is WCAG AA or better, a target is 44 px or more, no page scrolls sideways at 390 or 1440 px, a table reflows, and no button is a pill.
- **Work (9, 10).** One session, one branch, its own files; `package.json` and the lock file belong to the G1 line. `npm run check` and `npm run build` are green before a session reports done. Install with `npm ci`.
- **The repository (11, 12).** No secret, no timer or scheduled job, no account, server or analytics. No push to `main` and no merge into `main`. The last step of the deploy workflow stays as it is.
- **People (13, 14).** The owner runs no command. No file holds a job title or personal history.
- **This map (`00-contracts.md`).** A file has one owner in one wave, and a new file that is not in the matrix needs the lead. A Dusk class is always under an app class (`.cb-app`, `.yard-wrap`, `.radio-wrap`). A build agent that finds a name of the contract wrong stops and reports to the lead.

## 9. What cannot be proved in the cloud
| Item | Why | State |
|---|---|---|
| The Windows desktop build | The target is an NSIS installer and the shell uses WebView2. No Rust command was run. The sizes, the window, the icon in the task bar and the service worker inside the shell have no check (R6 9.2). | Not verified. No Wave 2 job writes `src-tauri/**` (PENDING RULING `TAURI`). |
| A real phone | Each result comes from headless Chromium with an emulated phone. No touch screen, no phone launcher, no Safari and no Firefox was tested (upgrade list, section 8; Gate A, questions 2 and 3). | Not verified. |
| A screen reader | No screen reader was run. Each statement about what a screen reader says has no check (R5). | Not verified. |
| The owner's look at each surface, before and after, at 1440 and 390 | It is the owner's (plan section 7). | Open. |
| A played Yard win by the owner | The open check of D-0027 (plan section 7). | Open. |
| The push to `main` and the update of the live copy | `main` moves only on the owner's typed word (fence rule 12). | Open. |
| The page law | The law text is in no repository that a session can read (R3 section 6). | Not verified. |

## 10. Open rulings that change this map
`00-contracts.md`, Part E, has the options and the reason for each. This table says what changes here.

| Name | Who | Recommended | What changes in this file |
|---|---|---|---|
| `UPGRADE-LIST` | the owner | As the list recommends | Section 3 (the rows named there). No U-row is in this file as planned work. |
| `TIER` | the owner | STRICT, with one written exception for travel in the Yard drawing | The tier line of section 1; `data-tier` in 5.3. |
| `U-46` | the owner | Yes | The file type of `view`, `draw`, `access` in section 6. |
| `PAGE-WIDTH` | the owner | One window that fills the browser | The width that the Yard drawing gets; `--maxw` in block 1 of the bridge. |
| `FORM-CHANGE`, `MIRROR-WORDS` (the owner); `GOLD` (the lead) | — | Contract Part E | Section 6. |
| `FILES` | the lead | Accept | Each [P] in sections 5 and 6. |
| `TOOLS` | the lead, with the owner's word | Vendor the two tools | The file names behind steps 2 and 3 of section 7. |
| `B3-LINE`; `YARD-BLOCK` (S1 brief) | the lead | Widen; `:root` | The last row of 5.2; the selector of block 6 of the bridge. |
| `YD-LEGEND` (Y1 brief); `LOOK-IDS` (the check of the briefs) | the lead | `yd-rules-legend`; a key `idsMayGo` | The class names of section 6; the look harness of section 7. The ids `yard-style` (2a) and `yard` (2b) go by the contract. |
| `MOTION-STOP-OWNER`, `SOUND-OWNER`, `UNMOUNT`, `SWITCH-BUTTONS` | the lead | Y4 | Section 6. |
| `G1-STEPS`, `TAURI` | the lead | Accept; it waits | Sections 7 and 9. |
| `YARD-BLOCK-2C` (from this draft; now in contract E.4) | the lead | Y4 | The Yard block of the bridge has no owner in 2c: contract A.3.2 gives 2c to "U1, not the Yard block". Options: Y4; U1; closed. |
| `ISLAND-COMMENT` (from this draft; now in contract E.4) | the lead | Y1, lines 1 to 4 only, in each case | The comment of `imperativeStation.ts:1-4` is not true today (section 2.3) and is less true after Y1. The file has an owner in 2a only with a yes to U-46. Options: Y1; Y4 in 2c; D1. Until the ruling Y1 does not edit the file (the Y1 brief). |
| `ARCH-UPDATE` (from this draft; now in contract E.4) | the lead | The lead, at each wave merge | Who changes "today" and "planned" in this file after a wave is merged. Contract A.3.8 gives the file to the lead in 2a and 2b and to D1 in 2c. Options: the lead at each merge, and D1 for the last pass; D1 one time in 2c. |
| `ARCH-GATE` (from this draft; now in contract E.4) | the lead | No new gate | The "must not contain" columns of 5.2 and 6 are proved only in part (steps 1 to 4 of section 7). Options: no new gate; G1-2 adds a layer check in 2c. |

## 11. Not verified, and evidence
Not verified:
1. Each planned statement. Nothing of Wave 2 is built. The marks of `00-contracts.md`, Part F, stay in force.
2. The run history of the deploy workflow and the place of the live copy (plan T13). This job did not read them.
3. That `dist/` on disk is the build of the present tree. Its 16 file names and sizes are equal to R6 4.1. This job ran no build.
4. Each number that this file takes from a report and marks "checked there": the gate counts of 2.6, the cache size of 2.7.
5. That the desktop profile is stored under the identifier (upgrade list P-24).
6. Each item of section 9.

Opened and read for this file: `package.json`, `vite.config.ts`, `index.html`, `.gitignore`, `.oxlintrc.json`, the three `tsconfig` files, `.github/workflows/deploy.yml`, each file in `src/core` and `src/state` in full, each file in `src/stations` (in full, except `Drill.tsx`, `RadioTest.tsx`, `yardSim.js` and `radioSim.js`: those four in the parts cited), the head, the imports and the exports of each file in `src/stations/yard`, the four files in `tools/` (`content-check.mjs`: lines 1 to 70 and each check heading), `src-tauri/tauri.conf.json`, `Cargo.toml`, `src/lib.rs`, `src/main.rs`, `capabilities/default.json`, `src/styles/dusk.lock.json`, the listing of `dist/`, and the Dusk files `ARCHITECTURE.md` and `README.md`.

Checks made, all read-only: the item and trust counts of the five content files (a Node one-line script); `sha256sum` of the ten frozen files and of the six Dusk files; the text hash and the call count of the `STEPS` region; `git diff --stat` against `86cfef2` and `94a41c5`; `grep` for each "no file imports" statement. No git command that changes something was run. No `npm install`, `npm ci` or `npm run build` was run in the repository. This job wrote this file only.

## 12. Check record
Check of the Wave 2a paper, 2026-11-20, on the tree of commit `fc49394`. The checker assumed each statement wrong until it opened the file or ran the script. Read-only runs in the repository only. The scripts of the check are in the scratch folder `…/scratchpad/brief-check/` (`00-contracts.md`, Check record). Result words: **pass**, **repaired** (the row says what changed), **open** (the row says why). The lead removes this section when the file moves to the repository root.

| # | Check | Result | What |
|---|---|---|---|
| 1 | Form | pass | This file is not a brief. It needs no six lines. Section 8 gives the fence in a short form and names the full text: plan section 4. Each of the 15 rule numbers is in the short form. |
| 2 | Ownership | repaired | Each "Writer" cell of sections 5.2 and 6 is equal to contract A.3.2 to A.3.4. Repaired in 5.2: the bridge row now names `YARD-BLOCK-2C` (the Yard block has no owner in 2c). The four rulings that this draft added are now rows of contract E.4. |
| 3 | Parallel safety | repaired | Each script name of section 7, each class prefix, each attribute of 5.3 and each member name of section 6 has the spelling of the contract and of the three briefs (`grep`). Repaired in 5.2: the parts file must not declare a custom property that Dusk declares (`--led-size`). Repaired in sections 6 and 7: the class `yd-view` on the canvas in 2a, the Yard picture at 1280. Added to section 10: `YD-LEGEND` and `LOOK-IDS`. |
| 4 | The fence | pass | The file states no rule and cites no rule number. It names the rulebook by its title in section 1, and it describes what a gate script checks. No U-row is planned work here: section 3 lists eight rows as "wait". |
| 5 | Truth | pass | Opened and equal, more than 45 line citations of sections 2 to 4: `types.ts:3`, `:10`, `:34`; `Reference.tsx:8-12`; `AppContext.tsx:9`, `:12`, `:19-30`, `:46`, `:57-60`, `:73`, `:79`, `:83`, `:101`, `:102`, `:109`, `:125`; `store.ts:6-14`, `:16-19`, `:21`, `:30`, `:46`, `:49`, `:53`, `:64-72`, `:76`, `:86`, `:95-102`; `sr.ts:18`, `:24`, `:37`; `Drill.tsx:86-88`, `:92`, `:219`; `RadioTest.tsx:65`, `:95`, `:150`; `radioSim.js:81`, `:84`, `:133`, `:136`, `:178`, `:184`; `signal.ts:1`, `:35`; `model.js:9`; `puzzles.js:9-20`, `:25-33`; `geometry.js:5`, `:17`, `:35-56`; `imperativeStation.ts:9`, `:17-29`, `:37`; `Yard.tsx:1-3`, `:7-8`; `package.json:8`, `:12`, `:14-28`; `vite.config.ts:9`, `:14-42`; `tauri.conf.json:8`; `SPEC.md:187`. Counted again and equal: the items and the trust values of the five content files (63; 42 with 38 and 4; 100; 14 with 8 and 6; 226), the 19 jobs, `dist/` with 16 files and 626,140 bytes, the ten frozen hashes and the `STEPS` text hash. No `Page law tier:` line is in `DECISIONS.md`. No citation was wrong. |
| 6 | Completeness | pass | Plan section 6 asks for `ARCHITECTURE.md` and the tier line. The draft holds the map of today, the planned layers, the frozen set, the gates and the rules. Nothing of contract Parts A to C that changes the map is missing after the repairs of checks 2 and 3. |
| 7 | Buildability | pass | The file is a map and builds nothing. Each "planned" statement is marked and section 11 says that none is verified. |
| 8 | Gate answers | repaired | Look C2 (section 6), full play on a phone (section 6, the access layer), the monogram (section 2, `public/favicon.svg`) are as the owner answered. Repaired in section 1: the draft held the line `Page law tier: STRICT` with a pending mark beside it. The owner has not ruled on `TIER`, so the draft now holds no tier line, only the statement that the line is not written. Not decided here: `FORM-CHANGE`, `GOLD`, `MIRROR-WORDS`, `U-46`, `PAGE-WIDTH`, and each U-row. |
| 9 | Voice | pass | No name of a person, no job title for the owner, no personal history, no contraction, no exclamation mark (`grep`). Section 1 names the qualification that the product trains for. That is the product, not a person. |

Open after this check, for the lead: each row of section 10.
