# R6 — Engineering audit

Wave 1 research for the Clear Board 2 change request. Read-only on code and content.

| Item | Value |
|---|---|
| Date | 2026-11-20 |
| Tree | branch `claude/peaceful-mayer-qat99l`, commit `cb51d4b`. Source files are those of `86cfef2`: `git diff 94a41c5 HEAD -- src public index.html vite.config.ts package.json package-lock.json tsconfig*.json` shows only the seven Dusk files. |
| Build under test | `dist/` in the repository. A fresh `vite build` of the tracked sources in a scratch copy gave the same bytes (`diff -rq`: identical). |
| Machine | Node `v22.23.5`, npm `10.9.9`, Linux. Other agents used the machine at the same time. A timing is the median of 3 runs where the text says so. Otherwise it is one run. |
| Writes | This file only. All trials ran in the scratch folder (section 18). No `npm install`, `npm ci` or build ran in the repository. `npm run check` as a whole was not run in the repository because `tools/sr-vectors.mjs` writes `.gate/sr.mjs`; it ran in the scratch copy. The three gates that only read (`solve`, `content-check`, `securement-check`) and `oxlint` also ran in the repository. |
| Web | Reached: `raw.githubusercontent.com` (Node release schedule, vite-plugin-pwa documents), the npm registry, the GitHub API through `gh`. Not reached: `vite-pwa-org.netlify.app`. |

## 1. Summary

1. A release breaks the open app. After a new version lands, the page that is already open shows a
   blank Yard. The trial reproduced it 5 times in 5 runs (ENG-01).
2. A failed load shows a blank screen or a false statement, never a message (ENG-02).
3. The offline cache is 609,219 bytes. That is 11.6 % of the 5 MB budget. With the six Dusk layers
   linked it is 648,596 bytes, 12.4 % (section 4).
4. The gate proves the pars, the content links, the securement mechanic and seven SM-2 vectors. It
   does not run lint, `tsc`, a unit test or a browser. No check runs on a branch or a pull request
   (ENG-04, ENG-06).
5. The three reskin tools work on this repository as they are. `dusk-sync check` accepts the lock
   that is in the repository. `token-lint` counts 238 raw colours in 12 files. `visual-regress` gave
   10 of 14 stable pictures; the Drill and Signals pictures need a seeded random source (section 7).
6. All eleven frozen items are byte-identical to commit `94a41c5`. The `STEPS` wording can be hashed
   in three ways; all three work today (section 5.1).
7. Plan fact T4 is wrong in direction. The setting "Reduce motion" makes the Yard slower. R5
   reports it as A11Y-04. This audit measured it a second way (section 2).
8. The count of findings is 20: 2 HIGH, 9 MEDIUM, 9 LOW.

Severity is the scale of the brief. Where a finding hurts a contributor first and a learner second,
the text says so.

## 2. Plan facts checked

| Fact | Result | Evidence |
|---|---|---|
| T1 | Correct. | `token-lint`: `src/stations/yardSim.js` 43 hex and 1 colour function, all in the CSS block at lines 42 to 141. `src/stations/radioSim.js` 45 hex. `src/stations/yard/render.js` 19 hex and 3 functions (the palette starts at line 10). `src/index.css` 17 hex and 5 functions. None is a Dusk token. |
| T4 (not in the list; checked because the look harness depends on it) | Not correct in direction. | "Watch optimal" on puzzle `p0-1`: 9,500 ms with the setting off, 27,398 ms with the setting on (median of 3 runs each; all 3 runs within 30 ms). `yardSim.js:229` sets factor 6. `yard/anim.js:17` multiplies the duration by the factor. `anim.js:6` says "greater than 1 = slower". R5 A11Y-04 has the PULL timing. |
| T5 | Correct, and one more file. | `grep` for `App.css`, `hero.png`, `react.svg`, `vite.svg`, `assets/` in `src/`, `index.html`, `vite.config.ts`: no match. None of the four is in `dist/`. `public/icons.svg` is also dead (ENG-12). |
| T6 | Correct. | `package.json:2` `clear-board-react`, `:4` `0.0.0`. `src-tauri/tauri.conf.json:5` `0.1.0`. `src-tauri/Cargo.toml:2-3` name `app`, version `0.1.0`. `src-tauri/icons/icon.png` is the default Tauri mark (viewed). |
| T7 | Correct. | `SPEC.md:70` "No build step." `SPEC.md:167` "Verification (no build, no CI)". |
| T8 | Correct. | No `ARCHITECTURE.md` in the root. `grep -i "page law"` in `DECISIONS.md`: no match. |
| T9 | Correct. | `package.json:12`: four `node tools/*.mjs` calls. `lint` is a separate script. `tsc -b` runs in `build` only. |
| T13 | Correct, and older than the plan says. | `gh run view`: runs on `86cfef2`, `94a41c5` and `2b7adb3` (2026-07-28) all pass steps 4 to 6 (`npm ci`, `npm run check`, `npm run build`) and fail at step 7, `actions/configure-pages@v5`, with "Get Pages site failed". The last green run was on 2026-06-25. The repository reports `has_pages: false`. The runs used Node `v20.20.2` and npm `10.8.2` on `ubuntu-26.04`. |

## 3. Findings

Form: id, title, severity, evidence, fix, effort (S under half a day, M one to two days, L more),
risk of the fix, and the frozen line.

### HIGH

#### ENG-01 — After a new version lands, the open app shows a blank Yard

- Severity: HIGH. A learner is blocked and sees no reason.
- Evidence:
  - `vite.config.ts:15-16`: `registerType: 'autoUpdate'`, `injectRegister: 'auto'`. No source file
    imports `virtual:pwa-register`, so the plugin writes the plain `dist/registerSW.js`. It only
    registers the worker. Nothing reloads the page. `dist/sw.js` calls `skipWaiting()` and
    `clientsClaim()`.
  - Trial (`pwa-update-natural.mjs`, 3 runs, same result each run): the app is loaded once on
    version 1. The server then holds only version 2. The learner opens the app again. The page shows
    version 1 from the cache. In the background the new worker installs, takes control and removes
    the old files from the cache. The learner opens The Yard. The request for the old chunk
    `assets/yardSim-DhRiMDpN.js` gets a 404. The page shows the header and nothing below it: no
    canvas, no text, no Home link from the island. Console: "Failed to fetch dynamically imported
    module". A second trial that forced the update check gave the same result in 2 of 2 runs.
  - `src/stations/imperativeStation.ts:36`: `load().then(...)` has no `catch`.
  - In the middle of a drill nothing visible happens. The drill continued and showed the next
    question (measured). The Drill code is in the main chunk and the content is in memory.
  - After one reload the page is on version 2 and the Yard draws. The profile is intact.
  - Offline, the same request fails in the same way: the old chunk is in no cache.
  - Radio guided has the same code path (`Radio.tsx:12`, `RadioTest.tsx:65`). In the trial its chunk
    hash did not change, so it kept working. A real release changes every hash.
- Stale content: yes, for one load. The first open after a release shows the old application and
  the old content files. The next load shows the new ones. A page that stays open makes no update
  check on hash navigation: 3 s after the change the worker and the cache were unchanged
  (measured; a long session was not measured).
- Fix: (a) catch a failed island load and show a message with a "Reload" control. (b) Change the
  update mode to a prompt: import `virtual:pwa-register`, show "A new version is ready" with one
  control, and reload only when the learner chooses. The plugin documents state that the reload of
  `autoUpdate` needs the virtual module, and that an automatic reload can lose unsaved input. A
  forced reload in the middle of a question is not acceptable here. (c) Keep the two-version trial
  as a browser test (section 5.6).
- Effort: M. Risk: MEDIUM (it changes how the service worker is registered). Frozen: no.
- Files: `vite.config.ts`, `src/stations/imperativeStation.ts`, one small new component.
- Source: `https://raw.githubusercontent.com/vite-pwa/docs/main/guide/auto-update.md`,
  `https://raw.githubusercontent.com/vite-pwa/docs/main/guide/register-service-worker.md`.

#### ENG-02 — A failed load shows a blank screen or a false statement

- Severity: HIGH. A learner is blocked or misled. It also breaks fence rule 15.
- Evidence (`failure-modes.mjs`, one run each):
  - One content file fails (`data/rules.json` blocked): Home shows "Coming soon" on Switching,
    Securement, Authority and Operating. `#/drill/securement` shows "Not enough verified content to
    drill yet." Both statements are false. `src/core/store.ts:49` and `:53` drop a failed file with
    an empty `catch`.
  - All content files fail: all seven cards show "Coming soon". Reference shows "No match. Try
    another word."
  - The browser refuses `localStorage`: Home draws. The Yard is blank (0 canvas, empty `main`, page
    error). `src/stations/yard/sound.js:5` reads `localStorage` at module load with no `try`, so the
    whole Yard chunk fails to load. Radio guided draws.
  - `src/stations/Home.tsx:17` has one state for missing content: "Loading…". It has no error state.
- Fix: `loadContent` reports which files failed. Home, Reference and Drill show "Part of the
  library did not load" with a retry control, and show no "Coming soon" for a domain whose file
  failed. Guard the `localStorage` read in `sound.js`. Catch the island load (ENG-01 a).
- Effort: M. Risk: LOW. Frozen: no.

### MEDIUM

#### ENG-03 — Progress cannot be saved outside the browser

- Severity: MEDIUM. A learner loses all progress when the site data is cleared or the device
  changes. It needs an outside event.
- Evidence: `SPEC.md:65` names F6 "lost progress" and promises "profile export/import; PWA; clear
  warning". `SPEC.md:72` says "Profile in `localStorage` + export". `src/core/store.ts:44`
  `exportProfile` has no caller (`grep`: one match, the definition). No import function exists.
  `src/stations/Settings.tsx:56` tells the learner that everything is on this device only.
  `CHANGELOG.md:188` lists "profile export/import" as not done.
  `store.ts:33`: a stored profile with another `schema` number is replaced by a new one, and
  `AppContext.tsx:51` saves the new one as soon as the content arrives. The old data is then gone.
  A trial unit test confirmed the replacement.
- Fix: "Save my progress to a file" and "Load progress from a file" in Settings, with a check of
  the shape before the load. Keep a copy of an unreadable profile under a second key instead of
  writing over it.
- Effort: M. Risk: LOW. Frozen: no.

#### ENG-04 — No check runs on a branch or a pull request

- Severity: MEDIUM. The effect on a learner is indirect: a bad change can reach `main` with no
  machine check.
- Evidence: `.github/workflows/deploy.yml:5-8`: the only triggers are a push to `main` and a manual
  start. No other workflow file exists. `oxlint` runs in no workflow. The one workflow has ended
  red on every push to `main` since 2026-07-28 (T13), so a red mark on `main` carries no signal.
- Fix: a second workflow, `check.yml`, on `pull_request` and on a push to any branch except
  `main`. Steps: checkout with full history, Node from `.nvmrc`, `npm ci`, `npm run check`,
  `npm run build`, the browser smoke test, and the look report as an artifact (section 5.9). Do
  not change the last steps of `deploy.yml` (fence rule 12).
- Effort: S. Risk: LOW. Frozen: no.

#### ENG-05 — Node is not pinned, and CI runs a Node line that has ended

- Severity: MEDIUM for the change request, LOW for a learner.
- Evidence: no `.nvmrc`, `.node-version`, `.npmrc` or `engines` field. `deploy.yml:26`
  `node-version: 20`; the run on `86cfef2` used `v20.20.2`. This machine has `v22.23.5`. The Node
  release schedule gives the end of v20 as 2026-04-30 and of v22 as 2027-04-30
  (`https://raw.githubusercontent.com/nodejs/Release/main/schedule.json`). The tightest `engines`
  range in the lock file is `^20.19.0 || >=22.12.0` (vite, oxlint, the React plugin). The same run
  log carries the runner warning that `actions/checkout@v4`, `actions/setup-node@v4` and
  `actions/configure-pages@v5` target Node 20 and are forced to Node 24.
- A link to the gates: the unit test runner in section 6.3 needs Node 22. If the unit tests enter
  `npm run check` and `deploy.yml` stays on Node 20, the red run on `main` moves from step 7 to
  step 5. That changes the known state of T13. The Node line of `deploy.yml` must move in the same
  commit. This is line 26, not the last step.
- Fix: `.nvmrc` with `22.23.5`, `"engines": { "node": ">=22.18 <23" }` in `package.json`,
  `engine-strict=true` in `.npmrc`, `node-version-file: .nvmrc` in both workflows. Raise the major
  version of the three actions when G1 has read their current release notes (not verified here).
- Effort: S. Risk: LOW. Frozen: no.
- Not verified: that Node 22.18 is the first 22 release with type stripping on by default (from
  model knowledge). It is on in 22.23.5: `process.features.typescript` prints `strip`.

#### ENG-06 — Large parts of the logic have no test

- Severity: MEDIUM. A wrong schedule or a wrong selection misleads a learner and nothing would
  catch it.
- Evidence: section 6.1 and 6.2. No test covers `isDue`, `decayedFam`, `store.ts`, `severity.ts`,
  the Drill selection, the grading guards in `AppContext.tsx`, the signal renderer, or any React
  station. `SPEC.md:174` promises a signal harness; no such file exists in `tools/`.
- Fix: section 6.3 and 5.5.
- Effort: M. Risk: LOW. Frozen: no (a test reads a frozen file and does not change it).

#### ENG-07 — The dyslexia mode names a font that the app does not ship

- Severity: MEDIUM. The learner who needs the mode gets a font that depends on the device.
- Evidence: `src/index.css:9`: `--font:"Atkinson Hyperlegible","Comic Sans MS",Verdana,sans-serif`.
  `grep -c "@font-face" src/index.css` gives 0. `dist/` holds 0 font files. `vite.config.ts:21`
  lists `woff2` in the cache pattern, but there is no such file. The app loads nothing from the
  network, so the font shows only where the device already has it. `Settings.tsx:7` promises
  "Clearer font + looser spacing". Dusk names system fonts only (`dusk.tokens.css:338-339`).
- Fix: a pick for the owner (section 16). Either ship the font file in the bundle and add it to
  the cache, or change the list and the label to what the app delivers. The size of the font files
  was not measured.
- Effort: S. Risk: LOW. Frozen: no.

#### ENG-08 — Names collide between the app, the two islands and Dusk

- Severity: MEDIUM for Wave 2a. A learner sees it only if it ships.
- Evidence (`dusk-collide.mjs`):
  - Custom properties. `src/index.css:4-5` declares `--ink`, `--caution` and `--focus` on `:root`.
    Dusk declares the same three names, and its rules read `--ink` and `--focus`.
    `yardSim.js:46` declares `--ink` on `.yard-wrap`. When S1 links the layers, the order of the
    files decides which value a Dusk part gets. Inside the Yard a Dusk part reads the Yard's
    `--ink`. Neither reskin tool reports this.
  - Classes. No app class has the `dusk-` prefix (0 collisions with the 151 Dusk classes). But the
    shell and the islands share global names: `.next`, `.stage`, `.tip`, `.who` (shell and Radio),
    `.back`, `.bar` (shell and Yard). The shell rule `.bar` (`index.css:41`, a 12 px rounded
    progress track) also matches the two Yard toolbars (`<div class="bar">` in `yardSim.js`). The
    Yard must cancel each property of it. A change to the shell rule can break the Yard toolbar.
  - Dusk's base layer sets `h1,h2,h3,p { margin: 0 }` and `a { color: inherit }`
    (`dusk.base.css:38-47`). These element rules change the app's spacing as soon as the layer is
    linked.
- Fix: the bridge file uses names that Dusk does not use (R3 owns the table). Y1 gives the Yard
  classes a prefix or keeps every rule under `.yard-wrap` and renames `.bar`. G1 adds a small
  check: no file outside `src/styles/dusk/` declares a custom property that Dusk declares, except
  the bridge file. The look harness takes its baseline before S1 lands.
- Effort: S. Risk: LOW. Frozen: no.

#### ENG-09 — The raw-colour gate cannot reach zero under the planned file lines

- Severity: MEDIUM for the plan. No effect on a learner.
- Evidence (`token-lint --list`): of the 45 raw colours in `radioSim.js`, 16 are in the CSS block
  (lines 5 to 33), 27 are colour attributes in the markup (lines 35 to 79, most in the SVG), and 2
  are in `mount()` at line 145. The plan gives B3 "style rules only in `radioSim.js`". The 29
  colours outside the CSS block stay unless the line is wider. The Yard canvas palette
  (`render.js`, 22 colours) is script: the new drawing must read its colours from the bridge
  tokens at run time, for example with `getComputedStyle`, or the lint fails on it. Three places
  hold a raw colour that no token can replace: the web manifest (`vite.config.ts:32-33`), the
  `theme-color` meta (`index.html:7`) and `public/favicon.svg` (50). `src-tauri/tauri.conf.json:24`
  also holds one; the lint does not read JSON.
- Fix: the lead widens B3's line to "style rules, colour attributes of the island's markup, and
  line 145; `STEPS` untouched, proved by the hash gate". The lead rules that the manifest, the
  `theme-color` meta, the favicon file and the Tauri window colour are allowed places, each marked
  on its line with `token-lint: allow` or excluded by path (section 5.2).
- Effort: S. Risk: LOW. Frozen: no (all of it is outside `STEPS`).

#### ENG-10 — The design documents disagree with the code

- Severity: MEDIUM. A contributor who trusts `SPEC.md` builds the wrong thing.
- Evidence: section 11, 46 rows. T7 and T8 are rows of it.
- Fix: D1 rewrites `SPEC.md` to the present state, adds `ARCHITECTURE.md` and the page law line,
  adds the missing decisions (the hosting state of T13, the Dusk copy, the line-ending rule), and
  corrects the stale code comments in files it may edit.
- Effort: M. Risk: LOW. Frozen: no, except the comments listed in section 14.

#### ENG-11 — The desktop build is not ready for a rename or a release

- Severity: MEDIUM for a desktop learner at the next release, LOW today.
- Evidence: section 9. The icon is the default Tauri mark. `tauri.conf.json:9` expects the dev
  server on port 4548; `vite.config.ts` sets no port and Vite uses 5173 by default; `README.md:41`
  says the port comes from `.claude/launch.json`, which is not in the repository. The content
  security policy is `null` (`tauri.conf.json:28`). The version is in five places with two values.
  The installed Tauri schema states that `identifier` is used for the path to the webview data
  directory: a change of `com.observatory.clear-board` moves that directory, and the desktop
  learner's profile is in it.
- Fix: section 9.3. Keep `identifier` as it is. Set `server.port` and `strictPort` in
  `vite.config.ts` or change `devUrl`. Take the version from `package.json`.
- Effort: S, plus the icon set after the owner's pick. Risk: MEDIUM (nothing here can run the
  Windows build). Frozen: no.

### LOW

#### ENG-12 — Dead files and dead code

- Severity: LOW.
- Evidence: each row was proved by a search of `src/`, `tools/`, `index.html` and `vite.config.ts`.

| Item | Proof it is unused | Shipped |
|---|---|---|
| `src/App.css` (184 lines, 2,891 bytes) | No import. It reads 7 custom properties that nothing declares (`dusk-sync check --uses src`). | No |
| `src/assets/hero.png` (13,057), `react.svg` (4,126), `vite.svg` (8,709) | No reference. | No |
| `public/icons.svg` (5,031 bytes) | Its six symbols (`bluesky-icon`, `discord-icon`, `documentation-icon`, `github-icon`, `social-icon`, `x-icon`) have no `<use>` in `src/`. The only mention is `vite.config.ts:17`. | Yes: in `dist/` and in the offline cache |
| `exportProfile` (`store.ts:44`) | One match, the definition. | Removed by the bundler (not verified in the chunk) |
| `gradable` (`store.ts:64`) | No caller. The word in `tools/content-check.mjs:153` is message text. | Same |
| Profile fields `path.stage`, `path.unlocked`, `path.testReady` (`store.ts:27`, `types.ts:83`) | Written once at creation. No read. The stage on Home comes from `stageFor()`. | Stored in `localStorage` |
| Profile field `lastDrill` (`AppContext.tsx:82`, `:105`) | Written. No read. | Stored |
| Profile field `settings` (`store.ts:24`) | A copy made at creation. Never read and never updated. The live settings are under `cb.settings.v1`. | Stored |
| Type members `Domain: 'protection'`, `ItemType: 'scenario'`, `Source: 'derived'` (`types.ts:4-8`) | The five content files hold none of them. | No |
| Variable `watching` (`yardSim.js:237`) | Assigned, never read (`oxlint`). | Yes |

- `src/index.css` has 65 class selectors. Each one has at least one use in `src/`, by a word
  match (`unused-css.mjs`). A word match can hide a dead selector; it cannot invent one.
- `src/stations/yard/solver.js` is in `src/` but no application file imports it. Only
  `tools/solve.mjs` does. It is in no built chunk. It is frozen; this is a note, not a fix.
- Fix: S1 removes the template files (planned) and `public/icons.svg` with its entry in
  `includeAssets`. Remove the two dead exports, or use `exportProfile` for ENG-03. Leave the stored
  profile fields in place unless the profile shape gets a tested migration.
- Effort: S. Risk: LOW. Frozen: no.

#### ENG-13 — Names, versions and file types are not consistent

- Severity: LOW.
- Evidence:
  - Package name `clear-board-react` (`package.json:2`, `package-lock.json` twice). The folder, the
    product and the repository are `clear-board`. Cargo package `app`, library `app_lib`
    (`Cargo.toml:2`, `:14`; `src-tauri/src/main.rs:5`).
  - Version `0.0.0` in `package.json` and the lock file. `0.1.0` in `tauri.conf.json:5`,
    `Cargo.toml:3`, `Cargo.lock:80` and in the installer name at `README.md:48`. `CHANGELOG.md:3`
    has one heading, "[Unreleased] — V1 in progress". `git tag` prints nothing.
  - File names: line 1 of `yardSim.js` calls the file `yard.js`. `Signal.tsx` is a component and
    `imperativeStation.ts` is a hook; both sit in `src/stations/` with the stations. The storage
    keys are `cb.profile.v1`, `cb.settings.v1` and `sl_muted` (`sound.js:5`).
  - File types: 2,082 lines of `.js` and 1,312 lines of `.ts`/`.tsx` in `src/`. `tsconfig.app.json:9`
    allows JavaScript and does not check it, so 61 % of the source lines have no type check. 886 of
    the JavaScript lines are frozen. The other 1,196 (`yardSim.js`, `radioSim.js`, `anim.js`,
    `render.js`, `sound.js`) are not.
  - The bridge between React and an island has no type: `imperativeStation.ts:10` declares `ctx`
    as `unknown`. The island reads `ctx.profile.yard`, `ctx.settings.reduce`, `ctx.save`,
    `ctx.recordYardWin`, `ctx.go`, `ctx.speak`.
- Fix: D1 and G1 set the name `clear-board` and one version (section 9.3). Y1 writes its new files
  in TypeScript and gives the bridge a named type. New files import the frozen `.js` files
  unchanged.
- Effort: S for the names, M for the types. Risk: LOW. Frozen: no.

#### ENG-14 — Lint has five warnings and is not a gate

- Severity: LOW.
- Evidence: `npx oxlint` in the repository: "Found 5 warnings and 0 errors", 31 files, 103 rules,
  22 ms. With `--deny-warnings` the exit code is 1. The five: `AppContext.tsx:34`
  (`only-export-components`), `imperativeStation.ts:34` (`exhaustive-deps`), `yardSim.js:237`
  (unused variable), `yardSim.js:578` and `yard/anim.js:23` (unused expression). None is in a
  frozen file. `npx tsc -b` and `npx tsc --noEmit -p tsconfig.app.json` in the scratch copy: exit 0,
  no output.
- Fix: the five are corrected or excused line by line by the jobs that own those files. G1 adds
  the frozen files and the vendored tools to `ignorePatterns`, so a new lint rule can never ask
  for an edit of a frozen file. Then `oxlint --deny-warnings` and `tsc -b` enter the gate
  (section 5.4).
- Effort: S. Risk: LOW. Frozen: no.

#### ENG-15 — Details of the web app manifest and the cache list

- Severity: LOW.
- Evidence: `dist/sw.js` lists 16 entries for 14 files: `favicon.svg` and `icons.svg` are there
  twice, once from `includeAssets` (`vite.config.ts:17`) and once from the `svg` pattern
  (`vite.config.ts:21`). The manifest has one icon, an SVG with `sizes: any`
  (`vite.config.ts:38`); `index.html` has no `apple-touch-icon`. The colour is `#0d1117` in the
  manifest and the `theme-color` meta, and `#0e1116` in `index.css:3` and `tauri.conf.json:24`.
  `vite.config.ts:5-6` describes a GitHub Pages address that is off (T13).
- Fix: remove `includeAssets` (the pattern covers the files). Add PNG icons of 192 and 512 px and
  an Apple icon when the owner has picked the mark (Gate A, question 3). Use one background colour.
- Effort: S. Risk: LOW. Frozen: no.
- Not verified: whether a browser offers "install" with an SVG icon only.

#### ENG-16 — Tunable numbers are in code

- Severity: LOW.
- Evidence: section 10. `DECISIONS.md:358` states the rule: "Tunables belong in config".
- Fix: one typed module, `src/core/tunables.ts`, or one JSON file, read by `sr.ts`, `store.ts`,
  `severity.ts` and `Drill.tsx`. Do it only after the unit tests pin the present behaviour, and
  with no change of a value. The numbers in frozen files stay where they are.
- Effort: M. Risk: MEDIUM (these numbers are the learning model). Frozen: no for the listed rows;
  the frozen rows are in section 14.

#### ENG-17 — Files give a person's name and personal history

- Severity: LOW. Fence rule 14.
- Evidence: section 12, 42 places.
- Fix: D1 decides the wording. Five comment lines are in frozen files and stay (section 14).
- Effort: S. Risk: LOW. Frozen: no for 37 places, yes for 5.

#### ENG-18 — Dependencies: 15 advisories, 2 of them in shipped packages

- Severity: LOW.
- Evidence: `npm audit` on the lock file: 15 advisories (1 low, 5 moderate, 9 high).
  `npm audit --omit=dev`: 2 high, `react-router` and `react-router-dom` 7.18.0
  (`https://github.com/advisories/GHSA-qwww-vcr4-c8h2`, "RSC Mode CSRF Bypass"). The app uses
  `HashRouter` in the browser and has no server. The other 13 are in build tools (`vite`,
  `postcss`, `nanoid`, `source-map-js`, `brace-expansion`, `browserslist`,
  `baseline-browser-mapping`, `fast-uri`, `serialize-javascript`, and `glob`, `minimatch`,
  `workbox-build`, `vite-plugin-pwa`). They run on a developer machine and in CI, not in the
  learner's browser. `npm audit` offers a fix without a major change for 11 of the 15; for the
  `glob` chain it offers a downgrade of `vite-plugin-pwa` to 1.1.0.
  `npm ci` works from the lock file: 360 packages in 4 s in an empty scratch folder. The lock file
  is version 3. All ranges in `package.json` are caret ranges, one is a tilde range.
- Fix: G1 owns `package.json` and the lock file. It runs `npm audit fix` once, in its own commit,
  then the full gate and the build. It does not take the `vite-plugin-pwa` downgrade.
- Effort: S. Risk: MEDIUM (a tool update can change the built bytes; compare `dist/` before and
  after). Frozen: no.
- Not verified: the text of the advisories. Only the titles were read.

#### ENG-19 — No content security policy; the external link sends a referrer

- Severity: LOW.
- Evidence: `index.html` has no policy. `tauri.conf.json:28` is `"csp": null`. The response
  headers of the host that serves the live copy were not read. `Home.tsx:68` opens the tip jar
  with `rel="noopener"`; without `noreferrer` the browser sends the page address to that site.
- Fix: a policy for both shells: `default-src 'self'`, `script-src 'self'`,
  `style-src 'self' 'unsafe-inline'` (the islands and React write inline styles),
  `img-src 'self' data:`, `connect-src 'self'`, `worker-src 'self'`, `manifest-src 'self'`. Prove
  it with the browser smoke test before it ships. Add `noreferrer`.
- Effort: S. Risk: MEDIUM (a wrong policy blanks the app; the smoke test must run with it).
  Frozen: no.

#### ENG-20 — Small defects in code and in the gate scripts

- Severity: LOW.
- Evidence:
  1. `store.ts:98`: with all seven domains at mastery 0.85, the mean is 0.8499999999999999 and
     `stageFor` returns "Coming along", while Home rounds the same mean to "85% mastered". Found by
     a trial unit test.
  2. `AppContext.tsx:131` repeats the literal `'cb.profile.v1'`; `store.ts:16` holds the constant
     and does not export it.
  3. `yardSim.js:715`: on every mount, if "Read aloud" is off and the Yard is not muted, the Yard
     mutes itself and stores it. The learner's choice of Yard sound does not last past one visit.
     The Yard sound is tied to a setting with another meaning. By code reading; not exercised in
     the browser.
  4. `sound.js:5`: the key `sl_muted` has no `cb.` prefix, and "Reset my progress" does not clear
     it.
  5. `tools/sr-vectors.mjs:15` writes `.gate/sr.mjs` into the tree on every `npm run check`. The
     folder is ignored by git. A check that writes is harder to run in a shared tree.
  6. `tools/content-check.mjs:37-39` says that an import of `radioSim.js` in Node "would drag in
     the DOM". The import works in Node today (section 5.1). Line 64 says "three content files";
     the check reads four.
  7. `tools/securement-check.mjs` makes 15 assertions (measured). `CHANGELOG.md:15` and
     `DECISIONS.md:444` say 13.
- Fix: each is a change of one to five lines in a file that is not frozen. Item 5 goes away when
  `sr-vectors` imports `sr.ts` directly (section 6.3).
- Effort: S. Risk: LOW. Frozen: no.

## 4. Measured tables

### 4.1 Build output (`dist/`, 16 files)

gzip is level 9. brotli is quality 11. "P" marks a file in the offline cache.

| P | File | Raw bytes | gzip | brotli |
|---|---|---:|---:|---:|
| P | `assets/index-D3qDtqBc.js` | 263,536 | 83,424 | 72,470 |
| P | `assets/index-z9tuAY47.css` | 10,242 | 2,766 | 2,428 |
| P | `assets/radioSim-BkSw6bln.js` | 13,427 | 4,677 | 3,968 |
| P | `assets/yardSim-DhRiMDpN.js` | 52,954 | 17,728 | 15,471 |
| P | `data/definitions.json` | 34,612 | 5,616 | 4,518 |
| P | `data/radio-script.json` | 7,269 | 1,493 | 1,238 |
| P | `data/rule-questions.json` | 142,524 | 28,621 | 22,406 |
| P | `data/rules.json` | 42,370 | 6,820 | 5,359 |
| P | `data/signals.json` | 26,251 | 2,343 | 1,860 |
| P | `favicon.svg` | 9,522 | 1,485 | 1,237 |
| P | `icons.svg` (dead, ENG-12) | 5,031 | 2,104 | 1,886 |
| P | `index.html` | 935 | 523 | 356 |
| P | `manifest.webmanifest` | 410 | 287 | 227 |
| P | `registerSW.js` | 136 | 126 | 90 |
|   | `sw.js` | 1,809 | 964 | 815 |
|   | `workbox-9c191d2f.js` | 15,112 | 5,191 | 4,689 |
|   | **All of `dist/`** | **626,140** | **164,168** | **139,018** |

### 4.2 Offline cache against the budget

The budget is "under 5 MB" (`SPEC.md:187`).

| Measure | Bytes | Share of 5 MiB (5,242,880) |
|---|---:|---:|
| Offline cache today: 14 files (`sw.js` lists 16 entries, 2 are duplicates) | 609,219 | 11.6 % |
| The same, read from Cache Storage in Chromium: 1 cache, 14 entries | 609,219 | 11.6 % |
| Storage use reported by the browser after the first load | 633,140 | 12.1 % |
| All of `dist/` (cache plus the two worker files) | 626,140 | 11.9 % |
| Offline cache with the six Dusk layers linked (trial build) | 648,596 | 12.4 % |
| Content files only (5 JSON) | 253,026 | 4.8 % |

The plugin prints "precache 16 entries (594.54 KiB)". Offline trial (`offline.mjs`): after one load
with the worker, with the network off, all six routes draw after a reload.

### 4.3 What is in each chunk

From the source map of a trial build (`chunk-breakdown.mjs`). The share is of the characters of
the chunk.

| Chunk | Raw | gzip | Content |
|---|---:|---:|---|
| `index-*.js` (main) | 263,536 | 83,424 | `react-dom` 68.1 %, `react-router` 15.8 %, `react` 3.0 %, `scheduler` 1.3 %; application code 11.2 % (29,608 characters): `Drill.tsx` 6,380, `RadioTest.tsx` 4,686, `Home.tsx` 3,269, `Reference.tsx` 2,720, `store.ts` 2,448, `Settings.tsx` 2,204, `AppContext.tsx` 2,139, `App.tsx` 1,571, `signal.ts` 1,449, the rest 2,742 |
| `yardSim-*.js` (loaded on the first visit to the Yard) | 52,954 | 17,728 | `puzzles.js` 33.0 %, `yardSim.js` 21.8 %, `model.js` 11.3 %, `render.js` 8.9 %, `geometry.js` 2.8 %, `sound.js` 1.5 %, `anim.js` 0.7 %, not mapped 19.6 % (template text: the CSS and the markup) |
| `radioSim-*.js` (loaded on the first visit to Radio) | 13,427 | 4,677 | `radioSim.js` 50.0 %, not mapped 49.1 % (template text) |
| `index-*.css` | 10,242 | 2,766 | `src/index.css` |

Both islands are separate chunks. `RadioTest.tsx:65` and `Radio.tsx:12` import `radioSim.js`
dynamically, so the main chunk holds no copy. The libraries are 88 % of the main chunk; the
application code is not the place to save bytes.

### 4.4 What a Dusk skin adds

| File | Raw | gzip | brotli |
|---|---:|---:|---:|
| `dusk.tokens.css` | 27,090 | 6,952 | 5,812 |
| `dusk.components.css` | 23,291 | 5,119 | 4,359 |
| `dusk.compose.css` | 10,597 | 2,643 | 2,290 |
| `dusk.process.css` | 5,775 | 1,812 | 1,491 |
| `dusk.motion.css` | 3,667 | 1,286 | 1,093 |
| `dusk.base.css` | 2,063 | 1,021 | 847 |
| Six source files, joined | 72,483 | 17,076 | 14,392 |
| The built stylesheet today | 10,242 | 2,766 | 2,428 |
| The built stylesheet with the six layers imported (trial build, minified) | 49,619 | 10,508 | 9,262 |
| **Added by the layers after the build** | **39,377** | **7,742** | **6,834** |

The trial imported the six files in `src/main.tsx` in a scratch copy. It did not change the page.
The whole of `dist/` became 665,517 bytes.

### 4.5 Timings

| Command | Time | Runs |
|---|---|---|
| `npm run check` (four gates) | 4.98 s | median of 3 (4.65, 4.98, 5.08) |
| of which `tools/solve.mjs` | 4.07 s | 1 |
| `npx tsc -b` | 2.8 s | 1 |
| `npx oxlint` | 0.35 s | 1 |
| `npx vite build` | 2.7 s wall, 0.23 s reported | 1 |
| `npm ci` in an empty folder | 4.05 s | 1 |
| Trial unit tests, 9 tests, `node --test` | 0.24 s | median of 3 |
| `visual-regress baseline`, 14 pictures | 31.5 s | 1 |
| `visual-regress compare`, 14 pictures | 23.7 s | 1 |

## 5. The gates that G1 builds

One command runs every offline gate: `npm run check`. A second command runs the gates that need a
build and a browser. Recommended shape: `tools/check.mjs` runs each step, prints PASS or FAIL per
step, runs the remaining steps after a failure, and exits non-zero if one failed. Dusk's own
`tests/run.mjs` has this shape. Order: cheapest and most basic first.

| Step | Gate | Needs | New package |
|---|---|---|---|
| 1 | Frozen-file hash gate | Node | none |
| 2 | Dusk lock check | Node | none |
| 3 | Raw-colour lint | Node | none |
| 4 | Name collision check (ENG-08) | Node | none |
| 5 | `oxlint --deny-warnings` | installed | none |
| 6 | `tsc -b` | installed | none |
| 7 | Unit tests | Node 22 | none |
| 8 to 11 | `sr-vectors`, `solve`, `content-check`, `securement-check` | as today | none |
| B1 | Browser smoke test | a build, Chromium | `playwright` |
| B2 | Look harness | a build, Chromium | `playwright`, `pixelmatch`, `pngjs` |

### 5.1 The frozen-file hash gate

**The frozen set and its baseline.** All eleven items are identical to commit
`94a41c522b8b4be7bc6ac11f1d7da29cf2defbf1` today: `git diff --stat 94a41c5 HEAD -- <the set>` is
empty, and the SHA-256 of each file on disk equals the SHA-256 of `git show 94a41c5:<path>`.

| Path | SHA-256 at `94a41c5` and on disk |
|---|---|
| `public/data/definitions.json` | `4ebe84b34c054e7502586cf43eda339026606cb4ebd27796944db0cc2c129366` |
| `public/data/radio-script.json` | `1c5fda97e2950c796386fe88ffce7f8d1b0868bfaf5f473b1e650a862ab1dda4` |
| `public/data/rule-questions.json` | `74ce0ca5d7f412dd4d8864d5b71a1f5ecd2dbac4130a764b8456181ec809226a` |
| `public/data/rules.json` | `895316b97d6a27240f1e9f8bc5212e923a188779454402010f30cc50cf0a30fb` |
| `public/data/signals.json` | `2c24e1584c8b748acf763baa90d06a6f462e85e9c749095d3d57c56205b4a15c` |
| `src/core/signal.ts` | `bf034f68af809da7e7a0a78d533ef70e11fb3827a8cec6335a3f837d814a89e4` |
| `src/stations/yard/model.js` | `144ec68621795ff6c4186335c2129dabcbde41fe12cfae800034563f65ba0ceb` |
| `src/stations/yard/solver.js` | `e547180bca95f723c30e16b89e7af0b4d0595d73764bd8dac1119a38a5bc2215` |
| `src/stations/yard/puzzles.js` | `633cc6056cdca7df5249508c566ac0891aedbf03ee7b9189d2617b913869bb9b` |
| `src/stations/yard/geometry.js` | `49bc3f5e0703d8dbde31219ce95e86525f8e7fbbf0f027689eef15a9077c13d5` |
| `src/stations/radioSim.js`, region `STEPS` as text | `43de095fd0353da3cfef329692416cb0532691f8795e6fd1b43329026e7b4add` |
| `src/stations/radioSim.js`, region `STEPS` as JSON | `bfa768b5db3d4ac7a6848b65a4f5ebd43b1df4a585d0cd827072cf9a49b0b84c` |
| For reference: the whole of `radioSim.js` at `94a41c5` (B3 will change it) | `6fb6fcb1789c9f1658e620e8a3f5043acd624ab3b39044f75485c1568bb064c5` |

**How to hash the `STEPS` wording.** `radioSim.js` was read. Three ways were tried
(`steps-hash.mjs`). All three work today, on disk and on the file of `94a41c5`.

| Way | What it does | Result | Catches | Weak point |
|---|---|---|---|---|
| (a) Text between two anchors | Takes the exact text from `export const STEPS = [` (line 84, found once) to the first `\n];` after it (line 123). 4,385 bytes. No change of the text before the hash. | Works | Any change in the region: a word, a number, a space, a comment, a moved line | It does not see code elsewhere that changes `STEPS` at run time |
| (b) The array literal, evaluated in an empty `node:vm` context | Evaluates the text from `[` to `]`, then hashes `JSON.stringify` of the result. 14 steps. | Works | A change of any value in any of the nine fields (`call`, `ack`, `pre`, `rule`, `note`, `goi`, `read`, `status`, `feet`) | A reformat passes |
| (c) Import of the module in Node | `import()` of the file, then the JSON hash of the export. | Works today, same hash as (b). The module has no DOM use at the top level. | The same as (b), and a mutation at load | It fails as soon as B3 adds a style import or any DOM use at the top level |

Recommendation: the gate uses (a) and (b) together. (a) is the fence: "no edit, no reformat".
(b) tells the reader which step and which field changed, and it does not depend on how B3
restyles the file. The gate also fails if the start anchor is found more than once or not at all,
and if any line outside the region assigns to `STEPS` or to a field of a step (today `STEPS` is
read on lines 160, 161, 171, 172 and 181 and written nowhere). (c) is not used: it can break for a
reason that is not a wording change.

The words of the Radio island that are outside `STEPS` are not in the frozen set: the scenario
line (42), the note text (74, 76), the closing message (183), the labels. Fence rule 3 still
covers them. The browser smoke test records them (section 5.6).

**Design.**

- `tools/frozen.lock.json`: the baseline commit in full, the ten whole-file paths with their
  SHA-256, the region with its two anchors and its two hashes, and the list of file names in
  `public/data/`.
- `tools/frozen-check.mjs`, Node only, reads and never writes:
  1. Each of the ten files exists at its path (a move fails) and its bytes hash to the lock value.
  2. `public/data/` holds exactly the five listed `.json` files. A new or a missing file fails.
  3. The region check, ways (a) and (b).
  4. When git and the baseline commit are in the clone, it also compares each lock value with
     `git show <baseline>:<path>`. This proves that nobody edited the lock. When the commit is not
     in the clone it prints "baseline commit not in this clone: files compared with the lock only".
     The new CI workflow fetches full history (`fetch-depth: 0`) so that this step runs there.
  5. On a failure it prints the path, both hashes, and whether the only difference is CRLF line
     endings.
- Line endings: `.gitattributes:9` (`* text=auto eol=lf`) keeps every text file LF on every
  machine. The gate hashes the bytes on disk and changes nothing first. For an LF file this is
  what `sha256sum` prints. `dusk-sync` reads CRLF as LF before it hashes; the frozen gate does not
  need that rule and stays stricter.
- It is step 1 of `npm run check`, and it runs first in CI.

### 5.2 The raw-colour lint

Adopt `token-lint.mjs` as it is: one file, 20 KB, Node only, no package. Vendor it to
`tools/reskin/token-lint.mjs` with a header line that names the source repository and commit. CI
cannot read the private tools repository, and the tool's own README describes this vendoring.

Recorded output today, default flags, on `src index.html public vite.config.ts`: 34 files read,
6 Dusk files not linted, 238 raw colours in 12 files, exit 1.

| File | hex | function | Total | Note |
|---|---:|---:|---:|---|
| `public/favicon.svg` | 34 | 16 | 50 | An image file. No token can reach it. |
| `src/stations/radioSim.js` | 45 | 0 | 45 | ENG-09 |
| `src/stations/yardSim.js` | 43 | 1 | 44 | Y1 |
| `src/index.css` | 17 | 5 | 22 | S1 |
| `src/stations/yard/render.js` | 19 | 3 | 22 | Y2 |
| `src/assets/vite.svg` | 19 | 0 | 19 | Dead file |
| `src/core/signal.ts` | 12 | 0 | 12 | Frozen: exempt by the fence |
| `public/icons.svg` | 10 | 0 | 10 | Dead file |
| `src/stations/yard/geometry.js` | 10 | 0 | 10 | Frozen: exempt by the fence |
| `vite.config.ts` | 2 | 0 | 2 | Manifest colours, lines 32 and 33 |
| `index.html` | 1 | 0 | 1 | `theme-color`, line 7 |
| `src/assets/react.svg` | 1 | 0 | 1 | Dead file |

With the frozen files, `public/data`, `src/assets` and `src/App.css` excluded: 196 in 8 files.
With `--radius` the tool also counts 15 raw radius values and 7 pill radii in `src/index.css`
(report only; fence rule 8 forbids pill buttons).

Gate command, as trialled:

```
node tools/reskin/token-lint.mjs src index.html vite.config.ts public \
  --tokens src/styles/dusk --tokens src/styles/clear-board.tokens.css \
  --exclude src/core/signal.ts --exclude src/stations/yard/geometry.js \
  --exclude src/stations/yard/model.js --exclude src/stations/yard/solver.js \
  --exclude src/stations/yard/puzzles.js --exclude public/data \
  --baseline tools/token-lint.baseline.json
```

Rules that follow from how the tool works:

- Name the folders. Do not pass `.`: the tool then reads `dist/` and `specs/` too (476 findings in
  24 files in the trial).
- `--tokens` replaces the default rule, so both the Dusk folder and the bridge file must be named.
  The tool accepted the bridge path before the file exists.
- Start with a baseline file (a ratchet): a file fails only when it gets worse. Each Wave 2 job
  lowers its own file. At the end of Wave 2c the baseline file is deleted and the count is zero.
- The allowed places of ENG-09 get `token-lint: allow` on the line (the tool reads the mark on any
  line, in any comment form), and `public/favicon.svg` is excluded by path.
- The tool reads string literals in scripts. A colour that a template builds from pieces is not
  seen (the tool's own stated limit). The canvas palette must come from tokens at run time.

### 5.3 The Dusk lock check

Adopt `dusk-sync.mjs` as it is, for `check` only: one file, 26 KB, Node only, no package. Vendor
it to `tools/reskin/dusk-sync.mjs`.

**Does it accept the lock that is in the repository?** Yes. Recorded output:

```
$ node dusk-sync.mjs check --to src/styles/dusk --expect 0.2.0
dusk-sync check: 6 files match the lock · dusk 0.2.0 · 1f7f971          (exit 0)
```

More trials: `--expect 0.1.0` fails with exit 1. A copy with one line added to `dusk.base.css`
fails with "edited since the sync", exit 1. `diff --from /home/user/dusk` reports "the copy is the
reference, byte for byte (6 files)"; 255 custom properties and 151 `dusk-` classes on both sides.
`outdated` reports "up to date". The tool's own self-test gives "39 passed, 0 failed" on this
machine.

Gate command: `node tools/reskin/dusk-sync.mjs check --to src/styles/dusk --expect 0.2.0
--namespace src --strict-namespace --uses src`. Today `--strict-namespace` exits 0 (no rule
outside the copy names a `dusk-` class). `--uses src` lists 7 custom properties that are read and
declared nowhere; all 7 are in the dead `src/App.css`. `--strict-uses` exits 1 today for that
reason. G1 adds `--strict-uses` after S1 has deleted `App.css`.

Only `check` goes in the gate. `sync`, `diff` and `outdated` need the Dusk repository and are not
for a consumer's gate (the tool's own rule).

If the lead prefers no vendored file, G1 can write an equivalent of about 30 lines: the SHA-256
of the six files against the lock, the first line of the token file against the lock, and no
other file in the folder. It then loses the namespace and the uses checks.

### 5.4 Lint and `tsc` in `npm run check`

- `oxlint --deny-warnings` after the five warnings of ENG-14 are gone. `.oxlintrc.json` gets
  `ignorePatterns` for the five frozen source files and for `tools/reskin/**` (the vendored
  `visual-regress.mjs` has one warning under this configuration, at line 468).
- `tsc -b`, as in the build script. It writes its build information to `node_modules/.tmp/`, not
  into tracked files (`tsconfig.app.json:3`, `tsconfig.node.json:3`).
- Cost: about 3.2 s more per run.
- The tests need a third project file, for example `tsconfig.tests.json`, that includes `tests/`
  with the Node types, so that `tsc -b` also checks the tests.

### 5.5 Unit tests

Runner: `node:test` with Node's own type stripping (section 6.3). Location: `tests/unit/*.test.ts`.
Command: `node --import ./tests/ts-resolve.mjs --test "tests/unit/**/*.test.ts"`. First set of
tests: section 6.2, right column.

### 5.6 The browser smoke test

One script, `tests/browser/smoke.mjs`, plain Playwright, no test framework. It serves `dist/` with
a small static server on a free port (the trial server is 12 lines) and stops it at the end. The
service worker is blocked except in the two offline and update cases. Each case fails on a page
error, a console error, or sideways scroll at 390 or 1440 px.

| Case | Asserts |
|---|---|
| Each of the six routes at 390 and 1440 | The key element is there (`.grid .card`, `.ref-row`, `.opt`, `.prompt-signal svg`, `canvas#yard`, `.radio-wrap`). `.yard-host` and `.radio-host` are not empty. |
| Drill, with a seeded random source | One answer writes `cb.profile.v1` with one graded item. A second correct answer to the same item on the same day does not move the schedule. |
| Reference | A search narrows the list. `#/reference?focus=<id>` opens that item. A `needs-review` item shows its badge. |
| Settings | Each of the five toggles sets its `data-` attribute or `--fs`, and the value is still set after a reload. |
| Radio guided | 14 presses of the key. The words on the page after each press equal a recorded word tape. The tape is recorded once at the baseline. This covers the island's words outside `STEPS`. |
| Radio "Call it yourself" | One right call grades one item. A step with trust `operating-practice` grades nothing. |
| Yard | "Watch optimal" on `p0-1` ends at "Moves 5 / par 5". Run it with the setting "Reduce motion" off: 9.5 s. With it on the same case takes 27.4 s today. |
| Offline | Load once with the worker, go offline, reload: six routes draw. The trial script does this in a few seconds. |
| Update | The two-version trial of ENG-01. It is expected to fail until ENG-01 is fixed; add it with the fix. |
| Failure | The three trials of ENG-02, when that fix lands. |

Package: `playwright`, pinned to `1.63.0`. That is the version in this cloud image, with its
Chromium in `/opt/pw-browsers`. It adds 2 entries to the lock file (measured with
`npm install --package-lock-only` in a scratch copy). CI adds one step:
`npx playwright install chromium`. The current release is 1.65.1; a move needs a new browser
download and new baseline pictures.

### 5.7 The look harness

Adopt `visual-regress.mjs` as it is. Vendor it with its `styles/` folder to `tools/look/`. It
needs `playwright`, `pixelmatch` 8.0.0 and `pngjs` 7.0.0: 4 lock entries in total. The folder
carries the tool's own Dusk copy for its report page (source commit `73013b6` by its README; the token file is
26,934 bytes, while this repository's copy is 27,090 bytes from `1f7f971`). Keep the two copies
apart and say so in a README line, or the second copy will confuse a reader.

Trial on the built app (`cb.config.json`, 7 pages, 2 sizes):

| Result | Detail |
|---|---|
| Works with the hash routes | Addresses of the form `/index.html#/drill`. |
| Stable with no setup | Home, Reference, Yard, Radio and the open Settings dialog, at both sizes: two baseline takes equal, and a later `compare --gate` gave 0 px on all 10, "no shot scrolls sideways", exit 0. |
| Not stable with no setup | Drill and Signals, both sizes. The questions come from `Math.random`. `compare` gave exit 1 with thousands of changed pixels, words "gone" and "new", and controls "gone". |
| Stable with a seed | A config that opens Home, runs one `evaluate` step that replaces `Math.random` with a fixed generator, then clicks into Drill or Signals (no page reload happens on a hash route). Words and controls equal on every take. Two of six pictures differed by about 950 px on the first take and passed on the retake; the tool reports them as "unstable". |
| Facts it prints for free | Smallest text: 11.52 px on Home, 9 px on Radio, 11 px on Yard. Sideways scroll 0 px on all 14. |

What G1 must know:

- The tool always sets the browser to reduced motion. The app then starts with the setting
  "Reduce motion" on (`AppContext.tsx:12`). Every picture shows that mode unless a step turns the
  toggle off. The four reading modes are reached with `click` and `check` steps in the Settings
  dialog.
- The tool has no key for a start script. A state that needs a stored profile (a learner with
  progress) cannot be seeded before the page loads. A small addition to the vendored copy, an
  `initScript` key that calls `context.addInitScript`, solves it. Until then, picture the
  new-profile states only.
- It stops the page clock and blocks the service worker. Both are right for this app.
- Baseline pictures are not committed. Each build job takes the baseline from the commit it
  started on, then runs `compare --look --gate` on its branch. `--look` lists the pixel changes
  and still fails on a lost word, a lost or smaller control, a lost id or class, a new script
  error, sideways scroll, or smaller text. That is fence rule 3 as a check. The report page and
  the pictures at 1440 and 390 are attached to the pull request. In CI they are an artifact.
- The baseline for the whole change request is taken at `86cfef2`, before S1 lands.

### 5.8 A pinned Node

ENG-05: `.nvmrc`, `engines`, `engine-strict`, and `node-version-file` in both workflows.

### 5.9 The new workflow

`.github/workflows/check.yml`, on `pull_request` and on a push to any branch except `main`:
checkout with `fetch-depth: 0`; `actions/setup-node` with `node-version-file: .nvmrc` and the npm
cache; `npm ci`; `npm run check`; `npm run build`; `npx playwright install chromium`; the smoke
test; the look compare against the merge base; upload of the report. No secret, no timer.
`deploy.yml` changes in one line only (line 26, the Node version).

## 6. Tests

### 6.1 What the four gate scripts prove, and what they do not

| Script | Proves (measured today) | Does not prove |
|---|---|---|
| `tools/sr-vectors.mjs` | 7 checks on `grade` and `newState`: three right answers give intervals 1, 6, 16 and ease 2.55, 2.60, 2.65; a miss gives interval 0 and ease 2.45; ease stays in 1.3 to 2.8; the defaults. | `isDue`. `decayedFam` and the 60-day half-life. The `due` date. `seen`, `correct`, `lastSeen`. It writes a file into the tree. |
| `tools/solve.mjs` | 19 of 19 puzzles: the authored line wins in exactly par moves; the solver finds no shorter line (0 unverified); `optJoints` equals the joints of the authored line. 4.1 s. | Anything on the screen. The canvas, the move builder, the banner, the refusal text. That the game calls the model the way the script does. |
| `tools/content-check.mjs` | 9 checks, A to I: legal trust values; no duplicate id; each answer is one of its choices; each `ruleId` exists; no question on an unverified item; the radio items match the 14 calls one to one; a graded radio step cites a verified rule; each call has 2 usable wrong options. | Whether any rule text, answer or citation is correct (that is the SME's). The shape of a signal aspect. That `payload.aspects` is not empty for a verified signal. That every domain has enough items for a session. |
| `tools/securement-check.mjs` | 15 assertions: a spot does not tie a cut; an untied goal is not a win; SECURE costs no move; SECURE refuses an empty track, a single car and a tied cut; a kick needs a tied backstop and refuses for that reason; the 19 pars equal a second list in the script. | The SECURE control on the screen. The words TIED and LOOSE on the canvas. |

### 6.2 What has no test

| Code | What is untested | First tests to write |
|---|---|---|
| `src/core/sr.ts` beyond the vectors | `isDue` (no state, no date, a past date, a future date). `decayedFam` (no `lastSeen`, 0 days, 60 days, 120 days). `grade` writes `due = now + interval`. `fam` reaches 1 at interval 30. | With a mocked clock. The trial has three of these and they pass. |
| `src/core/store.ts` | `drillable` (verified only; a rule needs a question). `recomputeMastery` (the mean; the 0.33 cap on signals until one aspect is recalled; a domain with no items keeps its value). `stageFor` at 0.15, 0.50, 0.85. `loadProfile` (bad JSON, another schema number, the dropped `radio` field). `freshProfile`. `loadContent` with a failed file. | The trial has five of these; they pass, and one of them found ENG-20 item 1. |
| `src/core/severity.ts` | A domain default, an override, an unknown domain, the rank order. | The trial has one test for all four. |
| Grading guards in `src/state/AppContext.tsx` | A right answer on an item that is not due changes nothing. A miss always counts. An unverified item is never graded. Nothing is written when no item was touched. | The logic is inside React callbacks. Cover it in the browser smoke test, or move the two guards to a pure function in `src/core/` and test that. |
| Drill selection in `src/stations/Drill.tsx:82-160` | The tier ceiling (1, 2, 3 at 0.15 and 0.45). The order "due and in band first". At most 10 items. At most 3 questions for one rule. The padding to 8. The floor of 4. The review round order by severity. No `radio-script` item. | It is inside a `useEffect` and is not exported. A unit test needs the logic moved to a pure function, for example `src/core/drillSession.ts`, with the random source as a parameter. That is a change with no change of behaviour, for B2 or U1. Until then the smoke test covers it with a seed. |
| `src/core/signal.ts` (frozen) | The drawing itself. `SPEC.md:174` promises a harness; none exists. | A test that reads the file and does not change it: for each of the 140 aspects in `signals.json`, the count of lamps in the SVG equals the count of heads, and a flashing code gives a flashing lamp. |
| React stations and the islands | Everything on the screen. | The browser smoke test (section 5.6). |
| `src/stations/RadioTest.tsx` | `distinct` and `optionsFor`: the answer is always among the options; no option contains or equals another call; near calls first. | Move the two functions to a module and test them, or cover them in the smoke test. |

### 6.3 Which runner

| | `node:test` with Node's type stripping | vitest |
|---|---|---|
| New packages | 0 | 17 lock entries for `vitest` alone; 58 with `jsdom` and `@testing-library/react` (measured with `npm install --package-lock-only` in a scratch copy; vitest 5.1.1) |
| Trial in this audit | 9 tests on `sr.ts`, `severity.ts` and `store.ts` pass in 0.24 s (median of 3). Built-in coverage reports 100 % of the lines of `sr.ts` and `severity.ts` and 80 % of `store.ts` for these 9 tests. | Not run |
| TypeScript | Node 22.23.5 strips types with no flag. `tsconfig.app.json:22` already sets `erasableSyntaxOnly`, so every source file can be stripped. Node does not check types; `tsc -b` in the gate does. | Uses the Vite pipeline |
| Imports with no extension | Node does not resolve them. `store.ts:3` imports `'./sr'`, and the trial failed there with `ERR_MODULE_NOT_FOUND`. A resolve hook of 15 lines in `tests/` solved it (`ts-resolve.mjs`, in the scratch folder). The other way is `'./sr.ts'` in `store.ts`; the project already allows that form, but `store.ts` is not one of G1's files. | No problem |
| `import.meta.env` | Not defined in Node. `store.ts` uses it only inside `loadContent`. A test of `loadContent` must set it. | Defined |
| Fake clock | `mock.timers` works for `Date`. Node marks it as experimental and prints a warning. | Stable API |
| React components in a simulated DOM | No | Yes, with two more packages |
| Node version | Needs Node 22. It does not run on the Node 20 of `deploy.yml` (ENG-05). | Runs on both |
| Fit with the project | The same style as the four gate scripts and as Dusk's own tests: Node only. | A second tool chain to keep current |

Recommendation: `node:test`. The untested logic is pure functions. The screen is tested in a real
browser by the smoke test, which the plan already asks for, so the one thing that only vitest
offers is not needed. With this runner `tools/sr-vectors.mjs` can import `sr.ts` directly and stop
writing `.gate/sr.mjs`. This is a recommendation; `package.json` belongs to G1 alone.

## 7. The reskin tools: can each be adopted

| Tool | Verdict | Packages | Recorded here |
|---|---|---|---|
| `dusk-sync.mjs` | Adopt as it is, vendored to `tools/reskin/`. Use `check` only. | None | It accepts the repository's lock. Exit 0. Output in section 5.3. |
| `token-lint.mjs` | Adopt as it is, vendored, with a baseline file during Wave 2. | None | 238 raw colours in 12 files, exit 1. Table in section 5.2. |
| `visual-regress.mjs` | Adopt as it is, vendored to `tools/look/` with its `styles/` folder. One small addition is useful later (`initScript`). | `playwright` 1.63.0, `pixelmatch` 8.0.0, `pngjs` 7.0.0 | 10 of 14 pictures stable with no setup. Drill and Signals need a seed. Section 5.7. |
| `selftest.mjs` | Run once after vendoring. Not part of the gate. | None | "39 passed, 0 failed". |

The tools' README states that they were tested on Linux only and never on Windows. This audit also
ran them on Linux only.

## 8. PWA

- Configuration: `vite.config.ts:14-42`. `generateSW` mode, `registerType: 'autoUpdate'`,
  `injectRegister: 'auto'`, cache pattern `**/*.{js,css,html,svg,json,woff2}`,
  `cleanupOutdatedCaches: true`. A navigation request is answered with the cached `index.html`.
- What the worker caches: the 14 files marked "P" in section 4.1. Nothing else. There is no
  run-time cache rule. The two worker files are stored by the browser, not in the cache.
- What a learner sees when a new version lands: ENG-01.
- Whether stale content can stay: for one load after a release, yes (ENG-01).
- Fonts: `src/index.css:7` and `:9` name system fonts, "Atkinson Hyperlegible", "Comic Sans MS"
  and Verdana. The app ships no font file (ENG-07).
- The service worker inside the desktop shell: `registerSW.js` also runs in the Tauri window. What
  it does there after a desktop update was not tested. The risk is the one of ENG-01. Not verified.

## 9. Tauri

### 9.1 State

| Item | Value | Where |
|---|---|---|
| Product and binary name | `Clear Board` | `tauri.conf.json:3-4` |
| Version | `0.1.0` | `tauri.conf.json:5`, `Cargo.toml:3`, `Cargo.lock:80` |
| Identifier | `com.observatory.clear-board` | `tauri.conf.json:6` |
| Front end | `../dist`, built by `npm run build` | `tauri.conf.json:8-11` |
| Dev address | `http://localhost:4548`; `npm run dev` serves on Vite's default port, because `vite.config.ts` has no `server` block | `tauri.conf.json:9` |
| Window | 1040 by 840, minimum 600 by 600, dark, background `#0e1116` | `tauri.conf.json:14-25` |
| Content security policy | `null` | `tauri.conf.json:28` |
| Capabilities | `core:default` for the window `main` | `src-tauri/capabilities/default.json` |
| Bundle | NSIS only. Five icon files named, sixteen icon files in the folder. | `tauri.conf.json:31-40` |
| Icons | The default Tauri mark (T6). `icon.png` is 512 by 512. | `src-tauri/icons/` |
| Rust | `tauri` 2.11.3, `tauri-build` 2.6.3, `tauri-plugin-log` 2.8.0 (debug builds only), `wry` 0.55.1 | `Cargo.lock`, `src-tauri/src/lib.rs` |
| Crate | name `app`, library `app_lib`, an author field with a full name | `Cargo.toml:2`, `:5`, `:14` |

### 9.2 What could not be done here

The Windows build cannot run here: the target is an NSIS installer for Windows and the shell uses
WebView2. `cargo` and `rustc` are on this machine, but no Rust command was run: a build writes
`src-tauri/target/` and `src-tauri/gen/` into the repository. So the sizes in `README.md:47-48`
(about 18 MB and about 4 MB), the window, the icon in the task bar and the behaviour of the
service worker in the shell are all not verified.

### 9.3 What must change when the app name or the version changes

| Place | Name | Version |
|---|---|---|
| `package.json:2`, `:4` | yes | yes |
| `package-lock.json`, the root and the first package entry | yes | yes |
| `src-tauri/tauri.conf.json:3-5` | `productName`, `mainBinaryName` | `version` |
| `src-tauri/tauri.conf.json:6` | **Do not change `identifier`.** The installed schema says it is used for the path to the webview data directory. The learner's profile is there. | — |
| `src-tauri/Cargo.toml:2-3`, `:14`; `src-tauri/src/main.rs:5` | `app`, `app_lib` | yes |
| `src-tauri/Cargo.lock:79-80` | follows `Cargo.toml` | follows; a Rust command rewrites it |
| `vite.config.ts:25-28`, `index.html:9-10` | manifest name, title, description | — |
| `README.md:47-50` | the names of the two built files | the installer name holds the version |
| `CHANGELOG.md:3` | — | a version heading |
| `src-tauri/icons/*` | the whole set, made from one source mark | — |

One source for the version: the installed Tauri schema says the `version` field can be "a path to
a `package.json` file containing the `version` field". Set it to `"../package.json"`. Then the
version lives in `package.json`, and `Cargo.toml` is the one other place. Not verified by a build.

## 10. Tunables in code

The rule is in `DECISIONS.md:358`. The same entry gives the reason why `TIERS` is in `puzzles.js`.

| File:line | Value | Meaning |
|---|---|---|
| `src/core/sr.ts:8` | ease 2.5, interval 0 | The start state |
| `src/core/sr.ts:18` | 1, 6 | The first two intervals in days |
| `src/core/sr.ts:19` | 2.8, +0.05 | Ease ceiling and step up |
| `src/core/sr.ts:22` | 1.3, −0.2 | Ease floor and step down |
| `src/core/sr.ts:24` | 30 | Days of interval for familiarity 1 |
| `src/core/sr.ts:37` | 60 | Half-life in days |
| `src/core/store.ts:6-14` | 7 domains: id, name, description, `live` | The domain list and its words |
| `src/core/store.ts:16`, `src/state/AppContext.tsx:9`, `:131`, `src/stations/yard/sound.js:5` | `cb.profile.v1`, `cb.settings.v1`, `sl_muted` | Storage keys |
| `src/core/store.ts:17-18` | 5 file paths | The content file list |
| `src/core/store.ts:76` | 0.33 | The signals cap before one aspect is recalled |
| `src/core/store.ts:98-100` | 0.85, 0.50, 0.15 | Stage thresholds, with the four stage names |
| `src/core/severity.ts:11-14` | 7 rows | Severity by domain |
| `src/core/severity.ts:17-23` | 11 rows | Severity overrides by item id |
| `src/core/severity.ts:26` | `S2` | Severity of an unknown domain |
| `src/stations/Drill.tsx:34-35` | 8, 3 | Session target; most questions for one rule |
| `src/stations/Drill.tsx:39` | 3 | Wrong options per question |
| `src/stations/Drill.tsx:103` | 0.15, 0.45 | Tier bands |
| `src/stations/Drill.tsx:115`, `:153` | 10 | Most items and most questions in a session |
| `src/stations/Drill.tsx:173` | 4, 1 | Fewest questions for a session and for a review round |
| `src/stations/RadioTest.tsx:40`, `:42` | 3, 2 | "Near" distance in steps; wrong options per call |
| `src/stations/Reference.tsx:79` | 8 | Most aspects shown for one indication. The largest count in the data is 8, so none is hidden today. |
| `src/state/AppContext.tsx:60` | 18.5 px, 16 px | The two text sizes |
| `src/stations/yardSim.js:229` | 6, 1 | Speed factor with and without "Reduce motion" (see T4) |
| `src/stations/yardSim.js:234` | 2 | Cap on the device pixel ratio |
| `src/stations/yardSim.js:277-279`, `:281` | 2200, 1100, 1700; 5800 ms | The arrival sequence and its safety timer |
| `src/stations/yardSim.js:290` | 18 | Hit radius of a switch, in drawing units |
| `src/stations/yardSim.js:354`, `:367`, `:374` | 600, 280, 600 ms | The phases of a move |
| `src/stations/yardSim.js:410` | 1.7 | Speed factor of "Watch optimal" |
| `src/stations/yardSim.js:414`, `:417`, `:421` | 520, 420, 320 ms | Pauses in "Watch optimal" |
| `src/stations/yardSim.js:522` | 1300 ms | The departure |
| `src/stations/yardSim.js:25-33` | 7 rows | Rule chip to content item ids |
| `src/stations/yard/sound.js:30-34` | frequencies, lengths, gains | The five sounds |
| `src/index.css:6` | 14 px, 920 px, 16 px, 1.5 | Radius, page width, base size, line height |
| `src/index.css:42`, `:115-116` | 0.6 s, 0.2 s | The two transitions |
| `tools/solve.mjs:20-23` | 28 and 150,000; 32 and 600,000 | Solver limits in the gate |
| `tools/securement-check.mjs:84-88` | 19 pars | A second copy of the pars, on purpose |
| `vite.config.ts:32-33`, `index.html:7`, `tauri.conf.json:24` | `#0d1117`, `#0d1117`, `#0e1116` | Shell colours |

## 11. Document drift

"Code" means the tree at `cb51d4b`.

| # | Where | It says | What is true | Evidence |
|---|---|---|---|---|
| 1 | `SPEC.md:4`, `:214` | Written before the repository exists; last updated 2026-06-23 | The repository exists; line 170 of the same file is dated 2026-06-25 | `SPEC.md:170` |
| 2 | `SPEC.md:70` (T7) | "No build step. Vanilla HTML / CSS / ES modules", "runs by double-click" | Vite, React, TypeScript; a build step | `package.json:8`; `DECISIONS.md:106` |
| 3 | `SPEC.md:70`; `README.md:9`, `:42`; `vite.config.ts:5-6`; `deploy.yml:1-3` | The host is GitHub Pages | Pages is off; the live copy is served elsewhere (T13) | `gh api`: `has_pages: false` |
| 4 | `SPEC.md:167` (T7) | "Verification (no build, no CI)" | A build and a CI workflow exist | `.github/workflows/deploy.yml` |
| 5 | `SPEC.md:85` | Seven domains; no `operating`; has `protection` | The code and the data have `operating` (29 items); no item has `protection` | `types.ts:5-7`; data count |
| 6 | `SPEC.md:106-113` | The profile has no `yard` field | It has `yard.completed` and `yard.best` | `types.ts:82` |
| 7 | `SPEC.md:109` | Settings `reducedMotion`, `dyslexiaFont`, `audio`, `textScale` (a number) | `dys`, `contrast`, `reduce`, `audio`, `big`, all true or false, stored under a separate key | `types.ts:65-67`; `AppContext.tsx:9` |
| 8 | `SPEC.md:65`, `:72` | Profile export and import | No export control and no import (ENG-03) | `store.ts:44` |
| 9 | `SPEC.md:136` | Domain mastery is the mean over the verified items | The mean over the drillable items (verified, and a rule needs a question), with a cap of 0.33 on signals | `store.ts:69-72`, `:76-91` |
| 10 | `SPEC.md:149` | "136 variants collapse to ~100 distinct" | 42 signal items with 140 aspects in total | `public/data/signals.json` (count) |
| 11 | `SPEC.md:151` | A puzzle is a content item of type `scenario` | Puzzles are in `puzzles.js`; no content item has that type | data count; `puzzles.js` |
| 12 | `SPEC.md:152` | A radio item holds the steps in `payload.steps[]` | A radio item holds one step index and a rule id; the wording is in `radioSim.js` | `types.ts:34-36` |
| 13 | `SPEC.md:157-161` | Aspect fields `heads` (a string), `mount`, `plate` | `heads` is a list; the fields are `type`, `plaque`, `flash` | `types.ts:18-25` |
| 14 | `SPEC.md:174` | A signal harness checks lamp count and flash | No such file | `ls tools/` |
| 15 | `SPEC.md:175` | A committed pre-ship checklist | No checklist file | file list |
| 16 | `SPEC.md:35`, `:74`, `:186` | Reduced motion: "all motion skipped/static", "honored everywhere" | The Yard gets slower and does not stop | T4; R5 A11Y-04 |
| 17 | `SPEC.md:191-199` | V1 is Reference and Drill; three domains have content | Five stations and seven domains are live | `App.tsx:41-48`; `store.ts:6-14` |
| 18 | `SPEC.md:192` | A station "Signal Reader" | The route `/signals` is the Drill on one domain | `App.tsx:45` |
| 19 | `SPEC.md:210` | The tip jar address is open | The address is in the code | `Home.tsx:68` |
| 20 | `README.md:17`; `Yard.tsx:1-2`; `imperativeStation.ts:1`; `Radio.tsx:2`; `RadioTest.tsx:60`; `tsconfig.app.json:9`; `specs/yard-ramp-visible-tiers.md:62`; `DECISIONS.md:359` | The Yard engine, `yardSim.js` and `radioSim.js` are byte-for-byte copies | Not since D-0025 and D-0029; `yardSim.js:3-7` says so itself | `yardSim.js:3-7`; commit `2b7adb3` |
| 21 | `README.md:18`; `DECISIONS.md:401` | "the four content files" | Five JSON files | `ls public/data` |
| 22 | `README.md:32` | A task about a folder beside this one and two other records | Not about this repository | — |
| 23 | `README.md:40` | `npm install` | The fence asks for `npm ci` | plan, rule 10 |
| 24 | `README.md:41`; `tauri.conf.json:9` | The dev server is on port 4548 "via `.claude/launch.json`" | No such file in the repository; no port in `vite.config.ts` | file list |
| 25 | `README.md:23-27`; `DECISIONS.md:408-418` | The favicon's origin is an open question | Still open; `public/icons.svg` has the same open origin and is not named anywhere | ENG-12 |
| 26 | `DECISIONS.md:3` | "Last updated 2026-06-23" | The newest entries are dated 2026-07-28 | `DECISIONS.md:395-420` |
| 27 | `DECISIONS.md:114` and `:129` | The desktop file is "~5 MB" and, later in the same entry, "~18 MB" | Two values; neither verified here | — |
| 28 | `DECISIONS.md:135`; `CHANGELOG.md:183` | The app is live on GitHub Pages | T13 | — |
| 29 | `DECISIONS.md:177-183` (D-0019) | The check gates the Pages deploy | The check runs; no deploy can follow | T13 |
| 30 | `DECISIONS.md` | — | No entry for: Pages off and where the live copy is; the Dusk copy (`86cfef2`); the line-ending rule (`94a41c5`) | headings list |
| 31 | `DECISIONS.md` (T8) | — | No page law tier line; no `ARCHITECTURE.md` | — |
| 32 | `DECISIONS.md:444`; `CHANGELOG.md:15` | 13 assertions | 15 | run of the script |
| 33 | `CHANGELOG.md:3` | One heading, "Unreleased" | Versions 0.0.0 and 0.1.0 exist in files; no release heading, no tag | ENG-13 |
| 34 | `CHANGELOG.md:186-189` | "Next": PWA and offline | Done on 2026-07-28, in the same file | `CHANGELOG.md:21` |
| 35 | `CHANGELOG.md` | — | No entry for the commits `94a41c5` and `86cfef2` | `git log` |
| 36 | `GAP-REVIEW.md:4`, `:42-44` | No repository yet; "no-build, no-CI" | A record of the first gate; it has no line that says so | — |
| 37 | `index.html:9` | "job-ready as a CN conductor" | The manifest and the README say "CROR conductor-qualification trainer"; the Home footer says the tool is not affiliated with that railway | `vite.config.ts:27-28`; `Home.tsx:69-71` |
| 38 | `package.json:2` | `clear-board-react` | The product is Clear Board (T6) | — |
| 39 | `package.json:4` against `tauri.conf.json:5` | `0.0.0` against `0.1.0` | Two values (T6) | — |
| 40 | `yardSim.js:1` | The file is `yard.js` | `yardSim.js` | — |
| 41 | `yardSim.js:12` | "No top-level side effects" | `sound.js:5` reads `localStorage` when the chunk loads | ENG-02 |
| 42 | `yardSim.js:229` | "setSpeed(6) ≈ instant" | Six times longer | `anim.js:6`, `:17` |
| 43 | `tools/content-check.mjs:37-39`, `:64` | An import of `radioSim.js` needs the DOM; "three content files" | The import works in Node; four files | ENG-20 |
| 44 | Plan, T4 | "6 times faster" | Slower | section 2 |
| 45 | Plan, section 3 | Line 1 of the token file reads "dusk 0.2.0"; the name is "the lit panel" | Line 1 reads "dusk 0.2.0 — the control panel"; the lock holds both names | `dusk.tokens.css:1`; `dusk.lock.json:4-5` |
| 46 | `.gitattributes:7`, `:42-50` | Rules for another kind of project and the name of another repository | Not about this repository; the active rule is line 9 | — |

## 12. Fence rule 14: names, titles, personal history

A list for D1. This file does not repeat the name. "Name" means a person's first name or full
name. "Account" means a web address or a repository path that holds the person's account name.

| File:line | What is there |
|---|---|
| `SPEC.md:15-16` | Name. A sentence about the person's state of mind and a quoted personal sentence. Personal history. |
| `SPEC.md:204` | Name, as the verifier |
| `DECISIONS.md:17` | A quoted personal phrase, no name |
| `DECISIONS.md:23` | Name |
| `DECISIONS.md:56` | Name in a heading, joined to the role "SME" |
| `DECISIONS.md:58-59` | Name twice, "him", "he" |
| `DECISIONS.md:66`, `:71`, `:91` | Name |
| `DECISIONS.md:112` | Name, with a statement about the person's working habits |
| `DECISIONS.md:131` | A folder path on a personal machine |
| `DECISIONS.md:135` | Account, in a web address |
| `DECISIONS.md:173`, `:223`, `:245`, `:266`, `:293` | Name |
| `DECISIONS.md:287` | Name, "he" |
| `GAP-REVIEW.md:62` | Name twice |
| `CHANGELOG.md:168` | Account, in the tip jar address |
| `CHANGELOG.md:183` | Account, in a web address |
| `README.md:56` | A folder path on a personal machine |
| `REVAMP-DESIGN.md:106`, `:158` | Name |
| `REVAMP-APPENDIX.md:280`, `:428`, `:499` | Name; two of the lines describe the person's voice |
| `LICENSE:3` | Full name, as the copyright holder. A licence needs a holder. |
| `src-tauri/Cargo.toml:5` | Full name, in the author field |
| `src-tauri/Cargo.toml:7` | Account, in the repository address |
| `src/core/severity.ts:3` | Name, in a comment |
| `src/stations/Home.tsx:68` | Account, in the tip jar address. It is a working link and it is in the shipped bundle. |
| `src/stations/radioSim.js:3` | Name, with a judgement. Outside `STEPS`. |
| `vite.config.ts:6` | Account, in a web address |
| `specs/clear-board-2-plan.md:27`, `:33` | Account, in two repository paths |
| `specs/clear-board-2-plan.md:148` | "his own browser" |
| `src/stations/yard/geometry.js:42`; `model.js:40`, `:50`; `solver.js:76` | Name, in comments. Frozen files (section 14). |
| `src/core/signal.ts:3` | A folder path on a personal machine. Frozen file (section 14). |

Job title: no line gives the owner a job title. `DECISIONS.md:56` gives the named person the roles
"SME" and "verifier". The documents so identify the SME and the named person as one. D1 decides
how to write that.

## 13. Security and privacy

- Network calls: the app fetches its own five JSON files (`store.ts:49`, `:53`) and its own
  chunks. The first load made 9 requests. The source holds no address of another host except
  the tip jar link. No analytics, no font or script from another host.
- Third-party script: none. The service worker library is built into `dist/`.
- External link: one, the tip jar (`Home.tsx:68`), opened in a new tab (ENG-19).
- `localStorage`: three keys. `cb.profile.v1` (the schedule state per item, mastery per domain,
  Yard records, dates), `cb.settings.v1` (five true or false values), `sl_muted`. No name, no
  account, no free text from the learner.
- HTML written as text: `Signal.tsx:7` writes the SVG that `drawSignal` builds from the content
  files. The two islands write their own strings with `innerHTML`. The `focus` parameter of
  Reference is used as a key only (`Reference.tsx:31`). No input from the learner or from another
  host reaches these places.
- Content security policy: none in either shell (ENG-19).
- Secrets: none found in the tracked files (a search for key and token patterns was not run as a
  tool scan; this is from reading the files).
- Advisories: ENG-18.

## 14. Not offered: needs a frozen file

| Item | File:line | Why it is not offered |
|---|---|---|
| A person's name in four comments | `yard/geometry.js:42`; `yard/model.js:40`, `:50`; `yard/solver.js:76` | Frozen. A comment edit changes the hash. |
| A folder path on a personal machine in a comment | `src/core/signal.ts:3` | Frozen |
| Raw colours | `src/core/signal.ts` (12), `yard/geometry.js` (10) | Frozen. The fence exempts them. |
| Exports with no outside use | `throatPoint`, `TRACK_HEAD`, `LEAD_REST`, `S_FOOT`, `REST_DEFAULT` in `geometry.js`; `lampFill` in `signal.ts`; `lenOf`, `loadedOf`, `routeReady` in `model.js` | Frozen. `throatPoint` has no caller at all. |
| Layout and physics numbers | `yard/geometry.js:5-56` | Frozen. `model.js` reads them. |
| `solver.js` sits in `src/` but only the gate uses it | `src/stations/yard/solver.js` | Frozen: no move |
| `TIERS` and `RULES` tables in code | `yard/puzzles.js:9`, `:25` | Frozen; `DECISIONS.md:358` gives the reason |

## 15. Notes for the SME

No rule wording is proposed here.

1. `src/stations/yard/render.js:2` says that the yellow target for a diverging switch is a "CROR
   yard convention" (plan fact T12). This audit found nothing in the repository that supports the
   claim. `render.js` is not frozen, but the claim is about a rule.
2. `src/core/severity.ts:11-23` decides which misses show the words "Safety-critical — lock this
   one in". Its own header calls the table "a reviewable v1" and asks the SME to adjust it. No
   decision entry records that the SME has reviewed the seven domain defaults and the eleven
   overrides.
3. `SPEC.md:149` gives a count of signal variants ("136", "~100") that differs from the data: 42
   indications with 140 aspects. Which count is right is a content question.
4. `index.html:9` describes the product as a trainer for one named railway. The manifest and the
   README describe it by the rule book. Which description is correct for the content is the
   SME's and the owner's call.

## 16. Decisions for the lead, and picks for the owner

For the lead:

1. Widen B3's file line for `radioSim.js` (ENG-09).
2. Rule on the places where a raw colour may stay: the manifest, the `theme-color` meta, the
   favicon file, the Tauri window colour (ENG-09).
3. Move line 26 of `deploy.yml` to the pinned Node in the same commit that adds the unit tests to
   `npm run check` (ENG-05). Without it the red run on `main` changes its failing step.
4. Vendor the three reskin tools, or have G1 write small equivalents (section 7).
5. Correct plan fact T4 before a Yard brief quotes it.

For the owner (Gate A, question 4, one row each):

1. The update behaviour: a "new version ready" control that the learner presses, or stay as today
   with a clear message on a failed load (ENG-01).
2. Save and load of progress as a file (ENG-03).
3. The dyslexia font: ship the font file, or change the promise (ENG-07).
4. The tip jar link carries the account name into the shipped app (section 12).
5. The package name and the first version number (ENG-13).

## 17. Not verified

- The Windows desktop build, its sizes, its icon, its window, and the service worker inside it.
- `tauri dev` on a clean clone. The port mismatch is from reading the configuration.
- That `"version": "../package.json"` works in a build. It is from the installed schema text.
- Whether a browser offers "install" with an SVG icon only.
- The response headers of the host that serves the live copy.
- The text of the 15 advisories. Only the titles were read.
- The first Node 22 release with type stripping on by default.
- The current major versions of the three GitHub actions.
- The size of the Atkinson Hyperlegible font files.
- The Yard mute behaviour of ENG-20 item 3, in a browser.
- That the bundler removes `exportProfile` and `gradable` from the chunk.
- Update behaviour over a long open session. Only 3 s after the change was measured.
- The origin of `public/favicon.svg` and `public/icons.svg`. From model knowledge, both match the
  files of the Vite project template, as do the four dead files of T5.
- The reskin tools on Windows.
- The vite-plugin-pwa documents were read from the project's GitHub repository. The documentation
  site was not reachable.

## 18. Evidence

Scratch folder:
`/tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/R6/`

| File or folder | What it is |
|---|---|
| `copy/` | The tracked sources of `cb51d4b` with a private copy of `node_modules`. `copy/dist` is the trial build that equals the repository's `dist/`. `copy/dist-map` is the build with source maps. |
| `copy2/` | Version 2 for the update trial (two text changes). |
| `copy3/` | The trial build with the six Dusk layers imported. |
| `measure-dist.mjs` | Sizes of `dist/` and the cache list. |
| `chunk-breakdown.mjs` | The content of each chunk from its source map. |
| `dusk-collide.mjs` | Sizes of the Dusk layers and the name collisions. |
| `unused-exports.mjs`, `unused-css.mjs` | The dead code searches. |
| `steps-hash.mjs`, `radioSim-94a41c5.js` | The three ways to hash `STEPS`, on disk and at the baseline. |
| `pwa-update.mjs`, `pwa-update-natural.mjs`, `pwa-3c-natural.png` | The update trials and the picture of the blank Yard. |
| `offline.mjs` | The offline trial and the Cache Storage count. |
| `failure-modes.mjs` | The three trials of ENG-02. |
| `yard-reduce.mjs` | The timing of "Watch optimal" with the setting on and off. |
| `unit/` | The trial unit tests and the resolve hook. |
| `vr/` | The trial of `visual-regress`: two configs, the baseline and the report. |
| `fp/` | Lock files for the package counts of section 6.3 and 5.6. |
| `ci/` | The `npm ci` proof. |
| `gate-*.txt` | Output of three of the four gates. |

Commands whose output is quoted: `git diff --stat 94a41c5 HEAD -- <frozen set>`; `sha256sum`;
`git show 94a41c5:<path> | sha256sum`; `npx oxlint`; `npx tsc -b`; `npx vite build`; `npm audit`;
`npm audit --omit=dev`; `npm ci`; `gh run list`; `gh run view <id>`; `node dusk-sync.mjs check|diff|outdated`;
`node token-lint.mjs`; `node visual-regress.mjs baseline|compare`; `node selftest.mjs`;
`node --test`.
