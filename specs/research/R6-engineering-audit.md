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
| Checked | 2026-11-20, by a second session that did each trial again with its own scripts (section 18, folder `R6-check`). Each finding, each measured table and each summary line has a line "Check:". Each fix has a line "Fence:". Section 19 holds the counts. Section 20 holds the withdrawn statements. |

Check: corrected. The branch head is now `069f90e`. `git diff --name-only cb51d4b HEAD` lists files in `specs/research/` only (0 other paths), so the audited sources, tools, workflow and root documents are the same. The check used a `git archive` of `cb51d4b` with its own `npm ci`. A fresh `vite build` there is byte-identical to the repository's `dist/` (`diff -rq`). Node `v22.23.5`, npm `10.9.9`: the same. The documentation site `vite-pwa-org.netlify.app` was refused by the proxy again (HTTP 403).

## 1. Summary

1. A release breaks the open app. After a new version lands, the page that is already open shows a
   blank Yard. The trial reproduced it 5 times in 5 runs (ENG-01).
   Check: corrected. The check reproduced it in 4 of 4 runs when the release changed the Yard
   chunk, and in 0 of 3 runs when the release changed the main chunk only. The condition is: the
   release changes the chunk of that station. The Clear Board 2 release changes both station chunks.
2. A failed load shows a blank screen or a false statement, never a message (ENG-02).
   Check: confirmed. The three trials were run again (ENG-02).
3. The offline cache is 609,219 bytes. That is 11.6 % of the 5 MB budget. With the six Dusk layers
   linked it is 648,596 bytes, 12.4 % (section 4).
   Check: confirmed. Both sizes were measured again from a new build and from Cache Storage.
4. The gate proves the pars, the content links, the securement mechanic and seven SM-2 vectors. It
   does not run lint, `tsc`, a unit test or a browser. No check runs on a branch or a pull request
   (ENG-04, ENG-06).
   Check: confirmed. `package.json:12`, `.github/workflows/deploy.yml:5-8`, and a run of each gate.
5. The three reskin tools work on this repository as they are. `dusk-sync check` accepts the lock
   that is in the repository. `token-lint` counts 238 raw colours in 12 files. `visual-regress` gave
   10 of 14 stable pictures; the Drill and Signals pictures need a seeded random source (section 7).
   Check: corrected. The three tools work and the three counts are the same. Two points change.
   With a seed the question pictures are stable, but the picture of an answered question failed
   `compare --gate` in 3 of 3 runs (section 5.7). The tools' own README keeps the look tool
   outside a repository (section 7).
6. All eleven frozen items are byte-identical to commit `94a41c5`. The `STEPS` wording can be hashed
   in three ways; all three work today (section 5.1).
   Check: confirmed. All thirteen hashes of section 5.1 were computed again with a new script.
7. Plan fact T4 is wrong in direction. The setting "Reduce motion" makes the Yard slower. R5
   reports it as A11Y-04. This audit measured it a second way (section 2).
   Check: confirmed. 9,513 ms with the setting off and 27,403 ms with it on (median of 3 each).
8. The count of findings is 23: 2 HIGH, 9 MEDIUM, 12 LOW.
   Check: corrected. The first count was 20. The check added ENG-21, ENG-22 and ENG-23, all LOW.
   No numbered finding was withdrawn.

Severity is the scale of the brief. Where a finding hurts a contributor first and a learner second,
the text says so.

## 2. Plan facts checked

| Fact | Result | Evidence |
|---|---|---|
| T1 | Correct. | `token-lint`: `src/stations/yardSim.js` 43 hex and 1 colour function, all in the CSS block that starts at line 42 (the first colour is on line 44, the last on line 137). `src/stations/radioSim.js` 45 hex. `src/stations/yard/render.js` 19 hex and 3 functions (the palette starts at line 10). `src/index.css` 17 hex and 5 functions. None is a Dusk token. |
| T4 (not in the list; checked because the look harness depends on it) | Not correct in direction. | "Watch optimal" on puzzle `p0-1`: 9,500 ms with the setting off, 27,398 ms with the setting on (median of 3 runs each; all 3 runs within 30 ms). `yardSim.js:229` sets factor 6. `yard/anim.js:17` multiplies the duration by the factor. `anim.js:6` says "greater than 1 = slower". R5 A11Y-04 has the PULL timing. |
| T5 | Correct, and one more file. | `grep` for `App.css`, `hero.png`, `react.svg`, `vite.svg`, `assets/` in `src/`, `index.html`, `vite.config.ts`: no match. None of the four is in `dist/`. `public/icons.svg` is also dead (ENG-12). |
| T6 | Correct. | `package.json:2` `clear-board-react`, `:4` `0.0.0`. `src-tauri/tauri.conf.json:5` `0.1.0`. `src-tauri/Cargo.toml:2-3` name `app`, version `0.1.0`. `src-tauri/icons/icon.png` is the default Tauri mark (viewed). |
| T7 | Correct. | `SPEC.md:70` "No build step." `SPEC.md:167` "Verification (no build, no CI)". |
| T8 | Correct. | No `ARCHITECTURE.md` in the root. `grep -i "page law"` in `DECISIONS.md`: no match. |
| T9 | Correct. | `package.json:12`: four `node tools/*.mjs` calls. `lint` is a separate script. `tsc -b` runs in `build` only. |
| T13 | Correct, and older than the plan says. | `gh run view`: runs on `86cfef2`, `94a41c5` and `2b7adb3` (2026-07-28) all pass steps 4 to 6 (`npm ci`, `npm run check`, `npm run build`) and fail at step 7, `actions/configure-pages@v5`, with "Get Pages site failed". The last green run was on 2026-06-25. The repository reports `has_pages: false`. The runs used Node `v20.20.2` and npm `10.8.2` on `ubuntu-26.04`. |

- T1. Check: corrected. The four counts are the same (`token-lint`: 44, 45, 22, 22). The line range of the Yard block was wrong by a few lines and is now exact.
- T4. Check: confirmed. Three runs each with a new script: 9,515, 9,513, 9,504 ms off and 27,405, 27,403, 27,396 ms on. Ratio 2.88. `yardSim.js:410` sets factor 6 for "Watch optimal" with the setting on and 1.7 with it off; the pauses at lines 414, 417 and 421 do not scale. `anim.js:6` and `:17` read as stated.
- T5. Check: confirmed. `grep` in `src/`, `index.html`, `vite.config.ts`: no match for the four names. `public/icons.svg` is named only at `vite.config.ts:17`.
- T6. Check: confirmed. Each cited line was opened. `src-tauri/icons/128x128.png` was viewed: the default Tauri mark.
- T7. Check: confirmed. `SPEC.md:70` and `:167` were opened.
- T8. Check: confirmed. No `ARCHITECTURE.md`. `grep -i "page law"` in `DECISIONS.md`: no match.
- T9. Check: confirmed. `package.json:8` and `:12`.
- T13. Check: confirmed. `gh run list` and `gh run view` on the three runs: steps 4 to 6 pass and step 7 fails in each. The log of the run on `86cfef2` shows `ubuntu-26.04`, `node: v20.20.2`, `npm: 10.8.2` and the error text. `gh api` gives `has_pages: false`. The same call gives `private: false`: this repository is public (see ENG-17).

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
  - `src/stations/imperativeStation.ts:34`: `load().then(...)` has no `catch`.
  - In the middle of a drill nothing visible happens. The drill continued and showed the next
    question (measured). The Drill code is in the main chunk and the content is in memory.
  - After one reload the page is on version 2 and the Yard draws. The profile is intact.
  - Offline, the same request fails in the same way: the old chunk is in no cache.
  - Radio guided has the same code path (`Radio.tsx:12`, `RadioTest.tsx:65`). In the trial its chunk
    hash did not change, so it kept working. (A statement about every hash stood here. It is
    withdrawn: section 20, W1.)
  - Condition, added by the check. The two station chunks import nothing from the main chunk
    (`dist/assets/yardSim-*.js` and `radioSim-*.js` hold no `import`). The name of a station chunk
    changes only when its own source changes. A release that changes only the main chunk leaves
    the old station chunk in the new cache list, and the Yard draws. So the blank Yard needs two
    things: the release changes the Yard sources, and the learner did not open the Yard in this
    page before the update. A change of the stylesheet alone changes the name of the main chunk
    (seen in the Dusk trial build), not the name of a station chunk.
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
- Check: corrected. Trial `update.mjs`, version 1 against a version 2 with a changed Yard source:
  blank Yard in 4 of 4 runs (one first run and 3 more). Each run: the old page shows version 1,
  the request for `assets/yardSim-DhRiMDpN.js` gets a 404, `.yard-host` is empty, the header is
  visible, the page error is "Failed to fetch dynamically imported module", the old chunk is in
  no cache, the drill gave its next question, Radio guided drew, and after one reload the page
  is on version 2 with the Yard and with the one graded item. 3 s after the release an open page
  had the same cache. Version 1 against a version 2 with a changed main chunk only: the Yard drew
  in 3 of 3 runs, with no 404. The line number of the missing `catch` was 36 and is 34. The
  forced-update trial (2 of 2) was not run again. The picture of the blank Yard was viewed.
- Check of fix (b), added: a trial build with `registerType: 'prompt'` and no other change
  (`prompt.mjs`, 3 runs). After the release the new worker waits. The old page keeps its whole
  cache: the Yard drew from the old chunk in 3 of 3 runs, with no 404. After every page was
  closed and the app was opened again, version 2 showed in 3 of 3 runs. Offline, the six routes
  drew after one load (`offline2.mjs`). In this mode the first page is not controlled by the
  worker until the next load. The "new version is ready" control itself was not built.
- Fence: pass, with one condition. No frozen file. No rule content. The fix adds words and a
  control, so it is not part of a reskin job (rule 3): it is an upgrade row for U1 after the
  owner's pick. `vite.config.ts` is in S1's Files line and `imperativeStation.ts` is in no job's
  Files line: the lead names the job. The message uses bridge tokens (rule 4). Nothing is handed
  to the owner.
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
- Check: confirmed. Trial `fail.mjs`. `data/rules.json` aborted, answered 404 and answered 500:
  the same result each time, four cards "Coming soon" and "Not enough verified content to drill
  yet." on `#/drill/securement`, 0 page errors (`store.ts:49` also drops a response that is not
  `ok`). All content blocked: seven cards "Coming soon", Reference ends "No match. Try another
  word.", Drill shows the same false sentence. `localStorage` refused: Home, Drill and Radio
  guided draw; the Yard has 0 canvas, an empty `.yard-host` and one page error. Each cited line
  was opened. Added: `src/` holds no React error boundary (`grep`: no match), so a render error
  has no fallback screen. `RadioTest.tsx:65` also has no `catch`.
- Fence: pass. No frozen file: `sound.js` is not in the frozen set. The fix adds words and a
  control, so it is a U1 row, not a reskin (rule 3). It serves rule 15. `sound.js`, `store.ts`
  and `AppContext.tsx` are in no job's Files line: the lead names the job.

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
- Check: confirmed. Each cited line was opened. `grep exportProfile` in `src/` and `tools/`: one
  match. In the browser (`fail.mjs`, part 3): a stored profile with `schema: 2` and a stored
  value that is not JSON were both replaced by a new profile after one load; the old text was
  gone. Added: `src/` makes no call to `navigator.storage.persist` (`grep`: no match). Whether a
  browser removes the stored profile of a site that is not used for some days is not verified.
- Fence: pass as a U1 row after the owner's pick. It adds two controls and words (rule 3: not a
  reskin). The file stays on the device: no server and no account (rule 11). No frozen file.

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
- Check: confirmed. `ls .github/workflows`: one file. `deploy.yml:5-8` holds the two triggers.
  `gh run list`: three failed runs since 2026-07-28, the last success on 2026-06-25.
- Fence: pass. The file is in G1's Files line. No secret and no timer (rule 11). It does not
  touch the last step of `deploy.yml` and does not turn Pages on (rule 12). One detail: with
  both triggers, a branch that has an open pull request gets two runs for each push.

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
- Added by the check: with `engine-strict=true` and the `engines` range below, `npm ci` on
  Node 20 stops at step 4, before the gates. A trial in a scratch folder with a range that
  excludes this machine's Node gave `npm error code EBADENGINE`, exit 1, and no `node_modules`.
  Without `engine-strict` the same case is a warning only.
- Fix: `.nvmrc` with `22.23.5`, `"engines": { "node": ">=22.18 <23" }` in `package.json`,
  `engine-strict=true` in `.npmrc`, `node-version-file: .nvmrc` in both workflows. Raise the major
  version of the three actions when G1 has read their current release notes (not verified here).
- Effort: S. Risk: LOW. Frozen: no.
- Now verified (it was "not verified"): Node 22.18.0 is the release that turned type stripping
  on by default. The Node 22 changelog has the heading "Type stripping is enabled by default"
  under "2025-07-31, Version 22.18.0"
  (`https://raw.githubusercontent.com/nodejs/node/main/doc/changelogs/CHANGELOG_V22.md`). It is
  on in 22.23.5: `process.features.typescript` prints `strip`.
- Check: corrected. Confirmed: no `.nvmrc`, `.node-version`, `.npmrc` or `engines` field;
  `deploy.yml:26`; the run log (`v20.20.2`, the runner warning that names the three actions); the
  schedule file (v20 ends 2026-04-30, v22 ends 2027-04-30); the `engines` range of `vite`,
  `oxlint` and `@vitejs/plugin-react` in the lock file. Changed: the failing step is 4, not 5,
  when `engine-strict` is set; the 22.18 fact is now verified. Added: the schedule file gives v24
  an end date of 2028-04-30. A pin to the 22 line lasts until 2027-04-30. The unit tests were
  not run on Node 24 (it is not on this machine): not verified. The workflow names its actions
  by major tag only (`deploy.yml:23`, `:24`, `:31`, `:32`, `:44`).
- Fence: pass, with three conditions. (1) `.nvmrc` and `.npmrc` are outside G1's Files line
  (`tools/**`, `tests/**`, `package.json`, the lock file, `.github/workflows/`): the lead widens
  the line. (2) Line 26 of `deploy.yml` is not the last step, so rule 12 allows it; after the
  change the run on `main` must still pass steps 4 to 6 and fail at step 7. (3) `engine-strict`
  also stops `npm ci` on the machine that makes the Windows build if its Node is outside the
  range. Which Node that machine has is not verified, and the owner runs no commands (rule 13).
  Recommended form: `.nvmrc`, `engines` and `node-version-file` now; `engine-strict` only after
  the lead knows the Node of that machine.

#### ENG-06 — Large parts of the logic have no test

- Severity: MEDIUM. A wrong schedule or a wrong selection misleads a learner and nothing would
  catch it.
- Evidence: section 6.1 and 6.2. No test covers `isDue`, `decayedFam`, `store.ts`, `severity.ts`,
  the Drill selection, the grading guards in `AppContext.tsx`, the signal renderer, or any React
  station. `SPEC.md:174` promises a signal harness; no such file exists in `tools/`.
- Fix: section 6.3 and 5.5.
- Effort: M. Risk: LOW. Frozen: no (a test reads a frozen file and does not change it).
- Check: confirmed. `ls tools`: four scripts, no signal harness. `SPEC.md:174` was opened. The
  nine trial tests were run again (section 6.3).
- Fence: pass. A test imports a frozen file and never writes it. The move of logic to a pure
  function (section 6.2) is a change with no change of behaviour in a file that is not frozen;
  the job that owns the file does it, and the smoke test proves it.

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
- Check: confirmed. `src/index.css:9`, `grep -c "@font-face"` gives 0, `find dist` gives 0 font
  files, `vite.config.ts:21`, `Settings.tsx:7`, `dusk.tokens.css:338-339`. The first load made 9
  requests, all to the app's own host.
- Fence: pass as an owner's pick. Rule 7 (the dyslexia mode survives) holds with both options.
  A change of the label is a change of a word, so it is a U1 row and not a reskin (rule 3).
  `dusk.tokens.css:336` says "No web font, no font file, no CDN" for Dusk's own type. A font
  file of the app sits outside the Dusk copy; R3 owns how the reading mode maps to Dusk. The
  licence of the font was not read: not verified.

#### ENG-08 — Names collide between the app, the two islands and Dusk

- Severity: MEDIUM for Wave 2a. A learner sees it only if it ships.
- Evidence (`dusk-collide.mjs`):
  - Custom properties. `src/index.css:4-5` declares `--ink`, `--caution` and `--focus` on `:root`.
    Dusk declares the same three names, and its rules read `--ink` and `--focus`.
    `yardSim.js:45` declares `--ink` on `.yard-wrap`. When S1 links the layers, the order of the
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
- Check: corrected. A new script gave the same sets: `--ink`, `--caution`, `--focus` (shell and
  Dusk; Dusk rules read `--ink` and `--focus`); `--ink` (Yard and Dusk); `.next`, `.stage`,
  `.tip`, `.who` (shell and Radio); `.back`, `.bar` (shell and Yard); 0 app classes with the
  `dusk-` prefix; 151 Dusk classes (`dusk-sync diff`). `index.css:41`, `yardSim.js:90-91`,
  `:146`, `:156` and `dusk.base.css:38-47` were opened. Changed: `--ink` is on line 45 of
  `yardSim.js`, not 46.
- Fence: pass. No frozen file. A new class name is not a change of behaviour (rule 3). The look
  harness fails on a lost class name, so the config of G1 lists each renamed class under
  `classesMayGo` for that one job.

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
- Check: confirmed. `token-lint --list` on `radioSim.js`: 16 findings on lines 6 to 31, 27 on
  lines 45 to 66, 2 on line 145; 16 + 27 + 2 = 45. `render.js` 22. `vite.config.ts:32-33`,
  `index.html:7`, `public/favicon.svg` 50, `tauri.conf.json:24`. The tool reads no `.json` file.
- Fence: pass, as a ruling for the lead only. (1) `STEPS` is lines 84 to 123 and stays
  untouched. (2) The wider line lets B3 edit lines 35 to 79. Those lines also hold words (the
  title, the scenario line, the labels in the drawing, the note text, the tip). Rule 3 forbids a
  changed word there, so the word tape of section 5.6 must be recorded before B3 starts.
  (3) A raw colour in the manifest, the `theme-color` meta, the favicon and the Tauri window is
  an exception to rule 4. This report cannot grant it. The lead or the owner rules on it.

#### ENG-10 — The design documents disagree with the code

- Severity: MEDIUM. A contributor who trusts `SPEC.md` builds the wrong thing.
- Evidence: section 11, 46 rows. T7 and T8 are rows of it.
- Fix: D1 rewrites `SPEC.md` to the present state, adds `ARCHITECTURE.md` and the page law line,
  adds the missing decisions (the hosting state of T13, the Dusk copy, the line-ending rule), and
  corrects the stale code comments in files it may edit.
- Effort: M. Risk: LOW. Frozen: no, except the comments listed in section 14.
- Check: corrected. Each of the 46 rows was opened (section 11). 42 rows are as written. The
  evidence or the wording of rows 15, 20, 21 and 26 changed.
- Fence: pass. D1 edits documents only. A stale comment in a frozen file stays (rule 1). D1
  writes and corrects no rule text (rule 2) and keeps names out of the new text (rule 14).

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
- Check: confirmed, by reading only. `tauri.conf.json:5`, `:6`, `:9`, `:24`, `:28`;
  `vite.config.ts` has no `server` block; `README.md:41`; no `.claude/` folder is tracked. The
  schema text for `identifier` and for `version` was read in
  `node_modules/@tauri-apps/cli/config.schema.json` (CLI 2.11.3). The icon was viewed. No Rust
  command was run.
- Fence: pass. No frozen file. `src-tauri/**` is in no job's Files line and `vite.config.ts` is
  S1's: the lead names the job. The Windows build stays on the list of section 7 of the plan;
  nothing is handed to the owner (rule 13).

### LOW

#### ENG-12 — Dead files and dead code

- Severity: LOW.
- Evidence: each row was proved by a search of `src/`, `tools/`, `index.html` and `vite.config.ts`.

| Item | Proof it is unused | Shipped |
|---|---|---|
| `src/App.css` (184 lines, 2,891 bytes) | No import. It reads 7 custom properties that nothing declares (`dusk-sync check --uses src`). | No |
| `src/assets/hero.png` (13,057), `react.svg` (4,126), `vite.svg` (8,709) | No reference. | No |
| `public/icons.svg` (5,031 bytes) | Its six symbols (`bluesky-icon`, `discord-icon`, `documentation-icon`, `github-icon`, `social-icon`, `x-icon`) have no `<use>` in `src/`. The only mention is `vite.config.ts:17`. | Yes: in `dist/` and in the offline cache |
| `exportProfile` (`store.ts:44`) | One match, the definition. | Removed by the bundler (checked: the main chunk holds no `JSON.stringify(…,null,2)`) |
| `gradable` (`store.ts:64`) | No caller. The word in `tools/content-check.mjs:153` is message text. | Same (checked: the main chunk holds one filter on `trust`, the one of `drillable`) |
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
- Check: confirmed. Each row was searched again with `grep` in `src/` and `tools/`. Sizes by
  `wc -c`: 2,891, 13,057, 4,126, 8,709 and 5,031 bytes; `App.css` has 184 lines. `dusk-sync check
  --uses src` lists 7 custom properties, all read in `App.css`. `oxlint` reports `watching`
  (`yardSim.js:237`); it is assigned on lines 237, 256, 410 and 424 and never read. A new word
  match over the 65 class selectors of `index.css` found none unused. `solver.js` is imported
  only at `tools/solve.mjs:17`. The two cells that said "not verified in the chunk" are now
  checked.
- Fence: pass. No frozen file is touched; the `solver.js` note stays a note. `public/icons.svg`
  is not in `public/data/` and is not in S1's Files line (`src/App.css` and `src/assets/` are):
  the lead adds it. `store.ts` and `types.ts` are in no job's Files line.

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
  - The bridge between React and an island has no type: `imperativeStation.ts:9` declares `ctx`
    as `unknown`. The island reads `ctx.profile.yard`, `ctx.settings.reduce`, `ctx.save`,
    `ctx.recordYardWin`, `ctx.go`, `ctx.speak`.
- Fix: D1 and G1 set the name `clear-board` and one version (section 9.3). Y1 writes its new files
  in TypeScript and gives the bridge a named type. New files import the frozen `.js` files
  unchanged.
- Effort: S for the names, M for the types. Risk: LOW. Frozen: no.
- Check: corrected. Confirmed: `package.json:2` and `:4`; `package-lock.json:2-3` and `:8-9`;
  `Cargo.toml:2-3`, `:14`; `main.rs:5`; `Cargo.lock:79-80`; `README.md:48`; `CHANGELOG.md:3`;
  `git tag` prints nothing; line 1 of `yardSim.js`; the three storage keys; `wc -l` gives 2,082
  lines of `.js` and 1,312 of `.ts` and `.tsx` (61 %), 886 of them frozen and 1,196 not;
  `tsconfig.app.json:9`. `grep` of `ctx.` in the two islands gives the six fields named, and
  `ctx.settings.audio`. Changed: the `unknown` type is on line 9 of `imperativeStation.ts`.
- Fence: pass. The plan gives the name fields to D1 through G1. A new TypeScript file imports a
  frozen `.js` file and does not change it.

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
- Check: confirmed. `npx oxlint` in the repository and in the scratch copy: "Found 5 warnings
  and 0 errors", 31 files, 103 rules, the same five places (oxlint 1.71.0). The time was 34 ms
  and 40 ms in the check, not 22 ms. `--deny-warnings`: exit 1. `npx tsc -b` and
  `npx tsc --noEmit -p tsconfig.app.json`: exit 0.
- Fence: pass. None of the five lines is in a frozen file. Each correction keeps the behaviour:
  `yardSim.js:578` and `anim.js:23` are an expression used as a statement, and `watching` is
  never read. `.oxlintrc.json` is outside G1's Files line: the lead widens the line.

#### ENG-15 — Details of the web app manifest and the cache list

- Severity: LOW.
- Evidence: `dist/sw.js` lists 16 entries for 14 files: `favicon.svg` and `icons.svg` are there
  twice, once from `includeAssets` (`vite.config.ts:17`) and once from the `svg` pattern
  (`vite.config.ts:21`). The manifest has one icon, an SVG with `sizes: any`
  (`vite.config.ts:38`); `index.html` has no `apple-touch-icon`. The colour is `#0d1117` in the
  manifest and the `theme-color` meta, and `#0e1116` in `index.css:3` and `tauri.conf.json:24`.
  `vite.config.ts:5-6` describes a GitHub Pages address that is off (T13).
- Fix: remove `includeAssets` and set `includeManifestIcons: false` (the pattern covers the
  files; see the Check line). Add PNG icons of 192 and 512 px and
  an Apple icon when the owner has picked the mark (Gate A, question 3). Use one background colour.
- Effort: S. Risk: LOW. Frozen: no.
- Not verified: whether a browser offers "install" with an SVG icon only.
- Check: corrected. Confirmed: 16 entries for 14 files, the two duplicates, one SVG icon, no
  `apple-touch-icon`, the two colour values at the four places. Changed: a trial build with
  `includeAssets` removed still lists `favicon.svg` twice (15 entries), because the plugin also
  adds the manifest icon. With `includeManifestIcons: false` as well the list has 14 entries and
  no duplicate. The cache holds 14 files and 609,219 bytes in all three builds: a duplicate
  entry costs no storage. The first wording of the fix is withdrawn (section 20, W3).
- Fence: pass. `vite.config.ts` and `index.html` are S1's files. The icons wait for the owner's
  pick. "One background colour" changes a colour value: it belongs to S1's skin work, and the
  places are the rule 4 exceptions of ENG-09.

#### ENG-16 — Tunable numbers are in code

- Severity: LOW.
- Evidence: section 10. `DECISIONS.md:358` states the rule: "Tunables belong in config".
- Fix: one typed module, `src/core/tunables.ts`, or one JSON file, read by `sr.ts`, `store.ts`,
  `severity.ts` and `Drill.tsx`. Do it only after the unit tests pin the present behaviour, and
  with no change of a value. The numbers in frozen files stay where they are.
- Effort: M. Risk: MEDIUM (these numbers are the learning model). Frozen: no for the listed rows;
  the frozen rows are in section 14.
- Check: confirmed. `DECISIONS.md:358` was opened. Each row of section 10 was opened.
- Fence: pass, with two conditions. (1) If the choice is a JSON file, it must not be in
  `public/data/`: that folder is frozen, and the hash gate of section 5.1 fails on a sixth file
  there. A typed module in `src/core/` has no such problem. (2) No value changes (rule 3). The
  numbers in `geometry.js`, `model.js` and `puzzles.js` stay (rule 1).

#### ENG-17 — Files give a person's name and personal history

- Severity: LOW. Fence rule 14.
- Evidence: section 12, 42 places.
- Fix: D1 decides the wording. Five comment lines are in frozen files and stay (section 14).
- Effort: S. Risk: LOW. Frozen: no for 37 places, yes for 5.
- Check: confirmed. `git grep` for the name, the account name and the machine path over all
  tracked files except `specs/research/` and the two lock files: every match is in the list of
  section 12, and no match is missing from it. The count is 42: 37 and 5. Added: `gh api` reports
  this repository as public, so the 42 places are public today.
- Fence: pass. This finding is rule 14. The five comments in frozen files stay (rule 1). The
  licence keeps its holder. The tip jar link is a working control: a change of it is the owner's
  pick, not a document edit.

#### ENG-18 — Dependencies: 15 packages with advisories, 2 of them shipped

- Severity: LOW.
- Evidence: `npm audit` on the lock file: 15 packages with at least one advisory (1 low,
  5 moderate, 9 high). The tool counts packages, not advisories.
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
- Check: corrected. `npm audit --json` in the scratch copy: total 15 (1 low, 5 moderate,
  9 high); `--omit=dev`: 2, `react-router` and `react-router-dom`, both 7.18.0 in the lock file.
  11 of the 15 have `fixAvailable: true`; the other 4 (`glob`, `minimatch`, `workbox-build`,
  `vite-plugin-pwa`) name `vite-plugin-pwa` 1.1.0. `npm ci` in an empty folder: "added 360
  packages" in 4.6 s. Lock file version 3. Changed: the unit is packages, not advisories; the
  title and the first evidence line now say so.
- Fence: needs a ruling. Rule 10 says "Install with `npm ci`, never a fresh resolve".
  `npm audit fix` resolves part of the tree again and rewrites the lock file. Rule 9 gives the
  lock file to G1 alone. The lead rules whether this one deliberate lock change is allowed. If
  it is, it is a commit of its own, never inside a reskin commit: the update of `react-router`
  changes the bytes of the shipped main chunk.

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
- Check: confirmed. `index.html` has no policy; `tauri.conf.json:28`; `Home.tsx:68`. Added, a
  trial of the fix (`csp.mjs`): the policy above as a `meta` tag in a scratch copy of the build,
  in Chromium, with the service worker on. The worker took control. All six routes drew. One
  drill answer, the Settings dialog and one Radio call worked. The console had no error and no
  policy message. The built `index.html` holds no inline script. The policy in the Tauri shell
  and in other browsers: not verified.
- Fence: pass. No frozen file. `index.html` is S1's file; `tauri.conf.json` and `Home.tsx` (B1)
  need a named job. It is not a reskin item.

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
     The Yard sound is tied to a setting with another meaning. Exercised in the browser by the
     check (see the Check line).
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
- Check: confirmed. Item 1: in Node, seven times 0.85 divided by 7 is 0.8499999999999999; in
  the browser a profile with every item at familiarity 0.85 showed "Coming along" and "85%
  mastered" on the same line. Item 2: `AppContext.tsx:131`, `store.ts:16`. Item 3, in the
  browser: first visit `sl_muted=1`; one press of the sound control gives `0`; on the next visit
  to the Yard it is `1` again. Item 4: after "Reset" the key `sl_muted` is still stored. Item 5:
  `tools/sr-vectors.mjs:11-15`; `.gitignore` lists `.gate`. Item 6: the import of `radioSim.js`
  works in Node (section 5.1); lines 37 to 39 and 64 were opened. Item 7: 15 assertions counted
  in a run; `CHANGELOG.md:15` and `DECISIONS.md:444` say 13.
- Fence: pass for items 2, 5, 6 and 7. Items 1 and 3 change what the learner sees or hears (a
  stage name at a boundary, the sound default): they are U1 rows that need the owner's yes, and
  no reskin job may make them (rule 3). Item 4: a new key name must carry the stored value
  over, or the learner's choice is lost once.

#### ENG-21 — Two open tabs overwrite each other's progress (added by the check)

- Severity: LOW. A learner loses graded items and sees no sign of it. It needs two open copies
  of the app in one browser.
- Evidence: trial `tabs.mjs`, 2 runs, same result. Two pages in one browser profile. Page A
  answers one question: the stored profile holds one item. Page B, which was open before that
  answer, answers one question: the stored profile holds the item of page B only. The item of
  page A is gone. `AppContext.tsx:43` reads the profile once, when the page starts.
  `store.ts:40-43` writes the whole profile from memory on each save. `src/` has no listener for
  the `storage` event (`grep`: no match). The installed web app and a browser tab on the same
  address are two such copies (from model knowledge, not verified).
- Fix: before a save, read the stored profile and keep, for each item, the state with the later
  `lastSeen`; or listen for the `storage` event and take the newer profile. Unit tests first.
- Effort: S to M. Risk: MEDIUM (it changes how the profile is written). Frozen: no.
- Check: confirmed. Reproduced in 2 of 2 runs. The fix was not built or tested.
- Fence: pass as a U1 row for the owner's yes. It changes behaviour, so no reskin job may make
  it (rule 3). No frozen file. `store.ts` and `AppContext.tsx` are in no job's Files line.

#### ENG-22 — No gate checks the offline cache budget (added by the check)

- Severity: LOW. No effect on a learner today.
- Evidence: `SPEC.md:187` sets the budget, under 5 MB. `grep -i "size\|budget\|5 MB"` in
  `tools/*.mjs` and in the workflow file: no match. The present use is 609,219 bytes, 11.6 %
  (section 4.2). Nothing fails if a font set, a picture set or a second copy of a library takes
  the cache over the budget.
- Fix: one step after the build in the browser gates of G1: read the cache list of `dist/sw.js`,
  add the sizes of the listed files, and fail above 5,242,880 bytes. The lead may set a lower
  ratchet value.
- Effort: S. Risk: LOW. Frozen: no.
- Check: confirmed. The search and the sizes are from the check. The fix is the method of
  `measure.mjs` in the scratch folder, which gave 609,219 bytes.
- Fence: pass. It is a script in `tools/**`, G1's line. It reads and never writes.

#### ENG-23 — The tool chain of the desktop build is not pinned (added by the check)

- Severity: LOW for a learner. MEDIUM for the next desktop release.
- Evidence: no `rust-toolchain.toml` and no `rust-toolchain` file in the root or in `src-tauri/`
  (`ls`). `Cargo.toml:9` has `rust-version = "1.77.2"`, which is a lowest version, not a pin.
  This machine has `rustc 1.97.0`. `src-tauri/Cargo.lock` is tracked, so the crate versions are
  pinned. `README.md:52-57` says the build needs a GNU tool chain and a second compiler set on
  the path of one machine. `package.json` has no `packageManager` field, so npm is not pinned
  (this machine 10.9.9, CI 10.8.2).
- Fix: a `rust-toolchain.toml` in `src-tauri/` that names the channel of the last good Windows
  build. That version is not known here. Nothing here can run the Windows build to prove the
  file. The item goes on the list of section 7 of the plan, with ENG-11.
- Effort: S. Risk: MEDIUM (not provable from the cloud). Frozen: no.
- Check: confirmed, for the missing files and the cited lines. The fix is not verified.
- Fence: pass. No frozen file. The version cannot be asked of the owner as a command to run
  (rule 13); it comes from the session that next makes the Windows build.

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

Check: confirmed. A new script (`measure.mjs`) gave the same three numbers for each of the 16
files and for the total, on the repository's `dist/` and on a new build.

### 4.2 Offline cache against the budget

The budget is "under 5 MB" (`SPEC.md:187`).

| Measure | Bytes | Share of 5 MiB (5,242,880) |
|---|---:|---:|
| Offline cache today: 14 files (`sw.js` lists 16 entries, 2 are duplicates) | 609,219 | 11.6 % |
| The same, read from Cache Storage in Chromium: 1 cache, 14 entries | 609,219 | 11.6 % |
| Storage use reported by the browser after the first load | 633,140 (the check run gave 631,606) | 12.1 % (12.0 %) |
| All of `dist/` (cache plus the two worker files) | 626,140 | 11.9 % |
| Offline cache with the six Dusk layers linked (trial build) | 648,596 | 12.4 % |
| Content files only (5 JSON) | 253,026 | 4.8 % |

The plugin prints "precache 16 entries (594.54 KiB)". Offline trial (`offline.mjs`): after one load
with the worker, with the network off, all six routes draw after a reload.

Check: corrected. Confirmed: 609,219 bytes in 14 files from `sw.js` and from Cache Storage
(1 cache, 14 entries); 626,140; 648,596 with the Dusk layers (the plugin then prints 632.99 KiB);
253,026 for the five JSON files; the plugin line; six routes draw offline. The first load makes
9 requests. Changed: the browser's storage figure was 631,606 bytes in the check run. It is an
estimate by the browser and it moves from run to run. All shares are of 5 MiB; of 5,000,000
bytes the cache is 12.2 %.

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

Check: confirmed. A new source-map reader (`chunks.mjs`) on a new `--sourcemap` build gave the
same shares for the main chunk and the Yard chunk, the same 29,608 characters of application
code, and the same nine file figures. For the Radio chunk it gave 50.2 % and 49.3 %: 0.2 points
from the table, from a different count of the chunk's characters.

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

Check: confirmed. The six file rows and the raw sizes are exact. Two figures depend on an order,
which the table did not state. "Joined" is the six files in alphabetical order (17,076 and
14,392; in the order tokens, base, components, compose, motion, process the join gives 16,925
and 14,339). The built stylesheet is 49,619, 10,508
and 9,262 bytes when the layers are imported in Dusk's load order with the process layer before
the motion layer (`ARCHITECTURE.md:36-50` of Dusk); with the motion layer first it is 49,619,
10,516 and 9,244. The added bytes are 39,377 raw in both orders. The trial also changed the
name of the main chunk, because the stylesheet name is in it.

### 4.5 Timings

| Command | Time | Runs | Check run (median of 3 unless stated) |
|---|---|---|---|
| `npm run check` (four gates) | 4.98 s | median of 3 (4.65, 4.98, 5.08) | 5.54 s (5.28, 5.54, 5.62) |
| of which `tools/solve.mjs` | 4.07 s | 1 | 4.56 s (4.54, 4.56, 4.88) |
| `npx tsc -b` | 2.8 s | 1 | 3.11 s (3.01, 3.11, 3.25) |
| `npx oxlint` | 0.35 s | 1 | 0.37 s (0.32, 0.37, 0.39) |
| `npx vite build` | 2.7 s wall, 0.23 s reported | 1 | 2.80 s wall (2.54, 2.80, 3.01), 0.25 s reported |
| `npm ci` in an empty folder | 4.05 s | 1 | 4.58 s, 1 run |
| Trial unit tests, 9 tests, `node --test` | 0.24 s | median of 3 | 0.21 s (0.19, 0.21, 0.22) |
| `visual-regress baseline`, 14 pictures | 31.5 s | 1 | 31.7 s, 1 run |
| `visual-regress compare`, 14 pictures | 23.7 s | 1 | 23.1 s, 1 run |

Check: corrected. Each command was timed again; the new column holds the values. The gate, the
solver and `tsc` were 11 % to 12 % slower in the check run. Other agents used the machine at the
same time in both sessions, so each time is a guide and not a limit. No time changes a finding.

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

Check: confirmed. `sha256sum` of each file on disk and of `git show 94a41c5:<path>`: the eleven
whole-file hashes are equal on both sides and equal to the table. `git diff --stat 94a41c5 HEAD`
and `git diff --stat 94a41c5` (the working tree) on the set are empty. A new script
(`steps.mjs`) gave the two region hashes on disk and at `94a41c5`. `public/data/` holds five
files.

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

Check: confirmed. The start anchor is found once, on line 84; the region ends on line 123 and
is 4,385 bytes; the literal evaluates to 14 steps with the nine field names; the import in Node
exports `STEPS` and `mount` and gives the same JSON hash as (b). `STEPS` is on lines 84, 160,
161, 171, 172 and 181 only. One more weak point of (b), added: `JSON.stringify` drops a field
whose value is `undefined`, so (b) alone does not see that case; (a) does.

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

Fence: pass. The gate reads and never writes. It enforces rule 1: a move, an edit, a reformat
and a sixth file in `public/data/` all fail. `tools/frozen.lock.json` and
`tools/frozen-check.mjs` are in G1's Files line. `.gitattributes:9` was opened.

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

Check: confirmed. The tool was run again with the same arguments: 34 files read, 6 not linted,
213 hex and 25 functions, 238 in 12 files, exit 1, and the same twelve rows. With the
exclusions: 196 in 8 files. With `--radius`: 15 and 7 in `src/index.css` (and 2 raw radius
values in the dead `src/App.css`). Added: the gate command below, without the baseline flag,
gives 216 raw colours in 10 files today, exit 1; that is the start value of the ratchet.

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

Check: confirmed. `token-lint .` gave 476 findings in 24 files. The help text of the tool
states the `--tokens` rule, the baseline ratchet and the `token-lint: allow` mark (source lines
232-233). The gate command accepted the bridge path while the file does not exist. The
statement that the tools' README describes the vendoring is true for `token-lint` and
`dusk-sync` (README lines 341-354).

Fence: pass, with the ruling of ENG-09. The exclusions name the five frozen source files and
`public/data`, which rule 4 exempts. The `allow` marks and the exclusion of `public/favicon.svg`
are exceptions to rule 4 that the lead or the owner must grant. The tools repository is private
and this repository is public: a vendored copy publishes the tool. The three script files hold
no name and no machine path (`grep`). The lead rules on it (section 16).

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

Check: confirmed. `check --expect 0.2.0`: the quoted line, exit 0. `--expect 0.1.0`: exit 1. A
scratch copy with one line added to `dusk.base.css`: "edited since the sync", exit 1. `diff`:
"byte for byte (6 files)", 255 and 255, 151 and 151. `outdated`: "up to date with dusk 0.2.0".
The gate command: exit 0, 0 `dusk-` classes outside the copy, 7 custom properties read and
declared nowhere, all in `App.css`. With `--strict-uses`: exit 1. `selftest.mjs`: "39 passed,
0 failed". The head of the Dusk repository is `1f7f971`.

Fence: pass. `check` reads and never writes; it enforces "never edit the copy". Only `check`
enters the gate.

### 5.4 Lint and `tsc` in `npm run check`

- `oxlint --deny-warnings` after the five warnings of ENG-14 are gone. `.oxlintrc.json` gets
  `ignorePatterns` for the five frozen source files and for `tools/reskin/**` (the vendored
  `visual-regress.mjs` has one warning under this configuration, at line 468).
- `tsc -b`, as in the build script. It writes its build information to `node_modules/.tmp/`, not
  into tracked files (`tsconfig.app.json:3`, `tsconfig.node.json:3`).
- Cost: about 3.2 s more per run.
- The tests need a third project file, for example `tsconfig.tests.json`, that includes `tests/`
  with the Node types, so that `tsc -b` also checks the tests.

Check: corrected. `tsconfig.app.json:3` and `tsconfig.node.json:3` point the build information
at `node_modules/.tmp/`. The vendored `visual-regress.mjs` gives one warning at line 468 under
the project's linter and configuration. Changed: the added cost was 3.5 s in the check run
(3.11 s and 0.37 s), not 3.2 s.

Fence: pass, with one condition. `.oxlintrc.json`, `tsconfig.json` and a new
`tsconfig.tests.json` are outside G1's Files line: the lead widens the line. An ignore pattern
for the frozen files makes sure no lint rule can ask for an edit of a frozen file.

### 5.5 Unit tests

Runner: `node:test` with Node's own type stripping (section 6.3). Location: `tests/unit/*.test.ts`.
Command: `node --import ./tests/ts-resolve.mjs --test "tests/unit/**/*.test.ts"`. First set of
tests: section 6.2, right column.

Check: confirmed. The same form of command ran the nine trial tests in the scratch folder:
9 pass, 0 fail (section 6.3).

### 5.6 The browser smoke test

One script, `tests/browser/smoke.mjs`, plain Playwright, no test framework. It serves `dist/` with
a small static server on a free port (the trial server is 12 lines) and stops it at the end. The
service worker is blocked except in the two offline and update cases. Each case fails on a page
error, a console error, or sideways scroll at 390 or 1440 px.

| Case | Asserts |
|---|---|
| Each of the six routes at 390 and 1440 | The key element is there (`.grid .card`, `.ref-row`, `.opt`, `.prompt-signal svg`, `canvas#yard`, `.radio-wrap`). `.yard-host` and `.radio-host` are not empty. For Signals, assert `.opt` without a seed and `.prompt-signal svg` only with a seed (see the Check line). |
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

Check: corrected. Confirmed: the six key elements exist (each was used by a check script); the
Yard case ends at "Moves 5 / par 5" in 9.5 s and 27.4 s; the offline case; the update case
fails today when the Yard chunk changes; `playwright` 1.63.0 is installed here with its browser
in `/opt/pw-browsers`; it adds 2 entries to the lock file (443 to 445); `npm view playwright
version` prints 1.65.1. Changed: the Signals route does not always open on a drawn aspect. In
30 loads with a new profile, `.opt` was there 30 times and `.prompt-signal svg` 28 times
(`sig.mjs`): two loads opened on a text question. A smoke test that asserts the drawing with no
seed fails in some runs. The cases for Reference, Settings, Radio "Call it yourself" and the
word tape were not built or run: not verified as designs.

Fence: pass. The test reads the built app and writes only its own output. `tests/**` and
`package.json` are G1's. The word tape is the check for rule 3 on the Radio words outside
`STEPS`. The update case and the failure case fail until ENG-01 and ENG-02 are fixed, so they
enter the gate with those fixes and not before (rule 10).

### 5.7 The look harness

Adopt `visual-regress.mjs` as it is. Vendor it with its `styles/` folder to `tools/look/` if the
lead rules so: the tools' own README says this tool "always stays outside" a repository
(README line 354; see the Check line and section 16). It
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
| Stable with a seed | A config that opens Home, runs one `evaluate` step that replaces `Math.random` with a fixed generator, then clicks into Drill or Signals (no page reload happens on a hash route). Words and controls equal on every take. Two of six pictures differed by about 950 px on the first take and passed on the retake; the tool reports them as "unstable". In the check the two question pages were stable in 3 of 3 compares, and the answered-question page was not (see the Check line). |
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

Check: corrected. Confirmed: the trial was run again with a copy of the tool and the same
config. Baseline: 14 pictures, 31.7 s, 4 "unstable" (Drill and Signals at both sizes). `compare
--gate`: "10 same, 4 different of 14", "no shot scrolls sideways", exit 1; the ten are Home,
Reference, Yard, Radio and Settings at both sizes, each 0 px. Smallest text 11.52 px on Home,
9 px on Radio, 11 px on Yard; sideways scroll 0 px on all 14. The tool sets
`reducedMotion: 'reduce'` and `serviceWorkers: 'block'` (source lines 267-268), stops the page
clock (lines 287-303) and has no start-script key. Its token file is 26,934 bytes and its lock
names `73013b6`; this repository's is 27,090 bytes from `1f7f971`. `pixelmatch` and `pngjs` with
`playwright` add 4 lock entries (443 to 447). Changed, two points. (1) With the seed, three
compares gave: the Drill and Signals question pages "same" at both sizes each time (one of them
only on a retake); the answered-question page "DIFFERENT" at 390 px in 3 of 3 compares (485 or
486 px) and at 1440 px in 1 of 3 (950 px). Words and controls were equal each time. That page
needs `maxDiffPixels`, a mask or a wait step before it can gate. (2) The README of the tools
(lines 341-354) describes copies of the two package-free scripts inside a repository and says
that `visual-regress` "always stays outside (it needs packages and pictures)". The plain verdict
"vendor it" is withdrawn (section 20, W2); the place of the tool is a ruling for the lead.

Fence: pass, with a ruling. `compare --look --gate` is the check for rule 3 and for the
sideways-scroll part of rule 8. The tool pictures the reduced-motion state by default, which
fits rule 6. The vendored `styles/` folder is a second Dusk copy from another commit: it must
stay out of `src/styles/` and out of the Dusk lock check, and the raw-colour lint must exclude
`tools/`. Whether a private tool enters this public repository is for the lead and the owner.

### 5.8 A pinned Node

ENG-05: `.nvmrc`, `engines`, `engine-strict`, and `node-version-file` in both workflows.

### 5.9 The new workflow

`.github/workflows/check.yml`, on `pull_request` and on a push to any branch except `main`:
checkout with `fetch-depth: 0`; `actions/setup-node` with `node-version-file: .nvmrc` and the npm
cache; `npm ci`; `npm run check`; `npm run build`; `npx playwright install chromium`; the smoke
test; the look compare against the merge base; upload of the report. No secret, no timer.
`deploy.yml` changes in one line only (line 26, the Node version).

Check: confirmed, by reading. `deploy.yml` has 44 lines; line 26 is `node-version: 20`; the
last step of the build job is line 32 and the deploy job starts at line 36. The workflow was
not written or run.

Fence: pass, with the conditions of ENG-04 and ENG-05. No secret and no timer (rule 11). The
last step of `deploy.yml` stays (rule 12). `.nvmrc` and `.npmrc` need a wider Files line for G1.

## 6. Tests

### 6.1 What the four gate scripts prove, and what they do not

| Script | Proves (measured today) | Does not prove |
|---|---|---|
| `tools/sr-vectors.mjs` | 7 checks on `grade` and `newState`: three right answers give intervals 1, 6, 16 and ease 2.55, 2.60, 2.65; a miss gives interval 0 and ease 2.45; ease stays in 1.3 to 2.8; the defaults. | `isDue`. `decayedFam` and the 60-day half-life. The `due` date. `seen`, `correct`, `lastSeen`. It writes a file into the tree. |
| `tools/solve.mjs` | 19 of 19 puzzles: the authored line wins in exactly par moves; the solver finds no shorter line (0 unverified); `optJoints` equals the joints of the authored line. 4.1 s. | Anything on the screen. The canvas, the move builder, the banner, the refusal text. That the game calls the model the way the script does. |
| `tools/content-check.mjs` | 9 checks, A to I: legal trust values; no duplicate id; each answer is one of its choices; each `ruleId` exists; no question on an unverified item; the radio items match the 14 calls one to one; a graded radio step cites a verified rule; each call has 2 usable wrong options. | Whether any rule text, answer or citation is correct (that is the SME's). The shape of a signal aspect. That `payload.aspects` is not empty for a verified signal. That every domain has enough items for a session. |
| `tools/securement-check.mjs` | 15 assertions: a spot does not tie a cut; an untied goal is not a win; SECURE costs no move; SECURE refuses an empty track, a single car and a tied cut; a kick needs a tied backstop and refuses for that reason; the 19 pars equal a second list in the script. | The SECURE control on the screen. The words TIED and LOOSE on the canvas. |

Check: confirmed. Each script was run in the scratch copy and its lines were counted: 7 checks;
"19/19 passed", 0 unverified, the `optJoints` test at `tools/solve.mjs:69-75`; checks A to I,
all pass; 15 assertions. The solver took 4.5 s to 4.9 s in the check. The column "does not
prove" is by reading the scripts. Added: the four signal items with no aspect are the four
`needs-review` items, so no verified signal has an empty aspect list today; no gate checks that.

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

Check: confirmed, for the facts. No test file exists in the repository (`git ls-files`: no
`tests/` folder, four scripts in `tools/`). `Drill.tsx:82-160` is one `useEffect`. The data has
42 signal items with 140 aspects. The nine trial tests pass. The right column is a proposal and
was not built.

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

Check: confirmed. Lock entries, measured again with `npm install --package-lock-only` in scratch
copies: 443 today; 460 with `vitest` (17 more, vitest 5.1.1); 501 with `jsdom` and
`@testing-library/react` as well (58 more). The trial tests: "tests 9, pass 9, fail 0" in 3 of 3
runs, 0.21 s median. Coverage: `sr.ts` 100 %, `severity.ts` 100 %, `store.ts` 80.39 % of the
lines. Without the hook: `ERR_MODULE_NOT_FOUND` for `./sr` imported from `store.ts`. The hook
has 15 lines. Node prints the "MockTimers" experimental warning. `tsconfig.app.json:22`.
`process.features.typescript` prints `strip`. vitest was not run.

Fence: pass. No package is added. `tests/**` is G1's. The resolve hook is used in place of an
edit of `store.ts:3`, which is not G1's file. Node 22.18 or later is needed (ENG-05).

## 7. The reskin tools: can each be adopted

| Tool | Verdict | Packages | Recorded here |
|---|---|---|---|
| `dusk-sync.mjs` | Adopt as it is, vendored to `tools/reskin/`. Use `check` only. | None | It accepts the repository's lock. Exit 0. Output in section 5.3. |
| `token-lint.mjs` | Adopt as it is, vendored, with a baseline file during Wave 2. | None | 238 raw colours in 12 files, exit 1. Table in section 5.2. |
| `visual-regress.mjs` | Adopt as it is. Its place needs a ruling: `tools/look/` with its `styles/` folder, or outside the repository as its README says. One small addition is useful later (`initScript`). | `playwright` 1.63.0, `pixelmatch` 8.0.0, `pngjs` 7.0.0 | 10 of 14 pictures stable with no setup. Drill and Signals need a seed, and the answered-question page needs a tolerance or a mask. Section 5.7. |
| `selftest.mjs` | Run once after vendoring. Not part of the gate. | None | "39 passed, 0 failed". |

The tools' README states that they were tested on Linux only and never on Windows. This audit also
ran them on Linux only.

Check: corrected. Each tool was run again (sections 5.2, 5.3, 5.7): each tool works on this
repository, as the table says. README line 22 has the Linux statement. `package.json` of the tools
pins `playwright` 1.63.0, `pixelmatch` 8.0.0 and `pngjs` 7.0.0. Changed: the row for
`visual-regress.mjs`. The README (lines 28 and 354) keeps that tool outside a repository, and
the seeded trial left one page unstable.

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

Check: confirmed. `vite.config.ts:14-42` was opened. `dist/sw.js` holds `skipWaiting()`,
`clientsClaim()`, the 16 entries, `cleanupOutdatedCaches()` and the navigation route to
`index.html`, and no run-time route. The worker inside the Tauri window stays not verified.

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

Check: confirmed. Each row was read from the cited file. `ls src-tauri/icons` gives 16 files.
`file` reports `icon.png` as 512 by 512. `Cargo.lock` gives `tauri` 2.11.3, `tauri-build` 2.6.3,
`tauri-plugin-log` 2.8.0, `wry` 0.55.1. `lib.rs:5-11` adds the log plugin in debug builds only.

### 9.2 What could not be done here

The Windows build cannot run here: the target is an NSIS installer for Windows and the shell uses
WebView2. `cargo` and `rustc` are on this machine, but no Rust command was run: a build writes
`src-tauri/target/` and `src-tauri/gen/` into the repository. So the sizes in `README.md:47-48`
(about 18 MB and about 4 MB), the window, the icon in the task bar and the behaviour of the
service worker in the shell are all not verified.

Check: not verified. The check also ran no Rust command and no Windows build. `cargo` and
`rustc` 1.97.0 are on this machine. The sizes, the window and the worker in the shell stay open.

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

Check: confirmed, by reading. Each place in the table was opened. The schema text reads: "It is
a semver version number or a path to a `package.json` file containing the `version` field", and
"If removed the version number from `Cargo.toml` is used". The path form was not tried in a
build.

Fence: pass. `identifier` stays, so the desktop learner's stored profile stays where it is.
The name fields go to D1 through G1, as the plan says. No frozen file.

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

Check: confirmed. Each of the 37 rows was opened at its file and line, and each value is there.
`yardSim.js:410` gives 6 with the setting "Reduce motion" on and 1.7 with it off. Rows in frozen
files are not in this table; they are in section 14.

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
| 15 | `SPEC.md:175` | A committed pre-ship checklist | No checklist file. The line itself lists three steps; it can be read as the checklist, so this row is weak | file list |
| 16 | `SPEC.md:35`, `:74`, `:186` | Reduced motion: "all motion skipped/static", "honored everywhere" | The Yard gets slower and does not stop | T4; R5 A11Y-04 |
| 17 | `SPEC.md:191-199` | V1 is Reference and Drill; three domains have content | Five stations and seven domains are live | `App.tsx:41-48`; `store.ts:6-14` |
| 18 | `SPEC.md:192` | A station "Signal Reader" | The route `/signals` is the Drill on one domain | `App.tsx:45` |
| 19 | `SPEC.md:210` | The tip jar address is open | The address is in the code | `Home.tsx:68` |
| 20 | `README.md:17`; `Yard.tsx:1-2`; `imperativeStation.ts:1`; `Radio.tsx:2`; `RadioTest.tsx:60`; `tsconfig.app.json:9`; `specs/yard-ramp-visible-tiers.md:62`; `DECISIONS.md:359` | The Yard engine, `yardSim.js` and `radioSim.js` are byte-for-byte copies | Not since D-0025 and D-0029; `yardSim.js:3-7` says so itself for the Yard files. For `radioSim.js` the origin file is not in the repository, so "not a copy" is not verified; lines 82 to 83 of the file say that `STEPS` was made an export | `yardSim.js:3-7`; commit `2b7adb3` |
| 21 | `README.md:18`; `DECISIONS.md:401`; `vite.config.ts:19` | "the four content files" | Five JSON files: four hold content items and one holds the questions | `ls public/data`; `store.ts:17-18` |
| 22 | `README.md:32` | A task about a folder beside this one and two other records | Not about this repository | — |
| 23 | `README.md:40` | `npm install` | The fence asks for `npm ci` | plan, rule 10 |
| 24 | `README.md:41`; `tauri.conf.json:9` | The dev server is on port 4548 "via `.claude/launch.json`" | No such file in the repository; no port in `vite.config.ts` | file list |
| 25 | `README.md:23-27`; `DECISIONS.md:408-418` | The favicon's origin is an open question | Still open; `public/icons.svg` has the same open origin and is not named anywhere | ENG-12 |
| 26 | `DECISIONS.md:3` | "Last updated 2026-06-23" | The newest entries (D-0027 to D-0029, lines 368 to 420) carry no date in the file. They were committed on 2026-07-28 | `git log --date=short -- DECISIONS.md` |
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

Check: corrected. Each of the 46 rows was opened at its cited lines. 42 rows are as written.
Four rows changed: row 15 (weak), row 20 (the Radio part is not verified), row 21 (one more
place, and what the five files are), row 26 (the evidence: the entries have no date; the date
is from `git log`). Counts used by rows 5, 10 and 11 were made again from the data: 29 items in
`operating`, none in `protection`; 42 signal items with 140 aspects; no item of type `scenario`.
Row 45: line 1 of the token file is `/* dusk 0.2.0 — the control panel */`; the plan's words
"reads `dusk 0.2.0`" are true as a part of that line, so the drift is in the name only.

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

Check: confirmed. `git grep -n -i` for the first name, the family name and the folder prefix
of the personal machine, over every tracked file except `specs/research/` and the two lock
files, gives 40 lines. Each is in the table. The table has two more places that hold none of
the three strings: the quoted phrase at `DECISIONS.md:17` and the pronoun at line 148 of the
plan. 42 places in all. This report holds none of the three strings (`grep`: no match).

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
- Secrets: none found in the tracked files. The check ran a pattern search (`git grep -I -i -E`
  for cloud key prefixes, token prefixes, private key headers, and `api key`, `secret` and
  `password` assignments) over the tracked files except the lock files and `specs/research/`:
  no match. No tracked file has a name with `.env`, `.pem`, `.key`, `credentials` or `secret`.
  A pattern search is not a full secret scanner.
- Advisories: ENG-18.

Check: corrected. Confirmed: 9 requests on the first load, all to the app's own host (the page,
two assets, `registerSW.js`, five JSON files); the only outside address in `src/` and
`index.html` is the tip jar link (two more matches are the SVG name space); two `fetch` calls
(`store.ts:49`, `:53`); three storage keys; `Signal.tsx:7`; 8 uses of `innerHTML` in each island;
`Reference.tsx:31`. Changed: the secrets line. A pattern search was now run.

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

Check: confirmed. Each cited line was opened. `grep -rlw` in `src/` and `tools/`: each of the
nine exports is named only in its own file, and `throatPoint` is on one line (`geometry.js:65`).
`token-lint` counts 12 and 10. No item of this table is offered as a fix anywhere in the report.

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
5. Added by the check. `src/stations/radioSim.js:76` (the tip under the note box) states which
   items of the walkthrough are operating practice and which are rules, and what the engineer
   repeats. The line is outside `STEPS`, so the hash gate does not protect it. Whether the
   statement is right is the SME's. A restyle of the island must not change it.
6. Added by the check. `src/core/store.ts:10` and `:12` put a rule number and four system names
   into the text of two domain cards on Home. The file is not frozen. Whether the text is right
   is the SME's.

Check: confirmed. Each cited line was opened. Notes 1 to 4 are as written: `render.js:2`,
`severity.ts:1-23` with 7 defaults and 11 overrides, D-0024 (`DECISIONS.md:274-296`) records no
review of the table by the SME, `SPEC.md:149`, `index.html:9`. No note proposes rule wording.

## 16. Decisions for the lead, and picks for the owner

For the lead:

1. Widen B3's file line for `radioSim.js` (ENG-09).
2. Rule on the places where a raw colour may stay: the manifest, the `theme-color` meta, the
   favicon file, the Tauri window colour (ENG-09).
3. Move line 26 of `deploy.yml` to the pinned Node in the same commit that adds the unit tests to
   `npm run check` (ENG-05). Without it the red run on `main` changes its failing step.
4. Vendor the three reskin tools, or have G1 write small equivalents (section 7).
5. Correct plan fact T4 before a Yard brief quotes it.
6. Added by the check. Widen G1's Files line. `.nvmrc`, `.npmrc`, `.oxlintrc.json` and a new
   `tsconfig.tests.json` (with its entry in `tsconfig.json`) are outside `tools/**`, `tests/**`,
   `package.json`, the lock file and `.github/workflows/`.
7. Added by the check. Name a job for the files that are in no Files line and that a fix here
   needs: `src/stations/imperativeStation.ts`, `src/stations/yard/sound.js`, `src/core/store.ts`,
   `src/core/types.ts`, `src/state/AppContext.tsx`, `src-tauri/**`, `public/icons.svg`.
8. Added by the check. Rule on `npm audit fix` against fence rule 10 (ENG-18).
9. Added by the check. Rule on the place of the look tool: its README keeps it outside a
   repository; the tools repository is private and this repository is public (sections 5.7, 7).
10. Added by the check. `engine-strict` only when the Node of the machine that makes the Windows
    build is known (ENG-05). Choose the Node line: 22 ends on 2027-04-30, 24 on 2028-04-30.
11. Added by the check. If the tunables go to a JSON file, keep it out of `public/data/`
    (ENG-16).
12. Added by the check. Record the word tape of the Radio island before B3 starts (ENG-09).

For the owner (Gate A, question 4, one row each):

1. The update behaviour: a "new version ready" control that the learner presses, or stay as today
   with a clear message on a failed load (ENG-01).
2. Save and load of progress as a file (ENG-03).
3. The dyslexia font: ship the font file, or change the promise (ENG-07).
4. The tip jar link carries the account name into the shipped app (section 12).
5. The package name and the first version number (ENG-13).
6. Added by the check. Two open copies of the app: keep both sets of answers, or leave it as
   today (ENG-21).
7. Added by the check. The Yard sound default and the stage name at the 85 % line (ENG-20,
   items 3 and 1).

Check: confirmed, for form. Each row for the owner is a pick with no command, no path to open
and no step to carry out (rule 13). No row names a person or a job title (rule 14).

## 17. Not verified

- The Windows desktop build, its sizes, its icon, its window, and the service worker inside it.
- `tauri dev` on a clean clone. The port mismatch is from reading the configuration.
- That `"version": "../package.json"` works in a build. It is from the installed schema text.
- Whether a browser offers "install" with an SVG icon only.
- The response headers of the host that serves the live copy.
- The text of the 15 advisories. Only the titles were read.
- The current major versions of the three GitHub actions.
- The size of the Atkinson Hyperlegible font files.
- Update behaviour over a long open session. Only 3 s after the change was measured.
- The origin of `public/favicon.svg` and `public/icons.svg`. From model knowledge, both match the
  files of the Vite project template, as do the four dead files of T5.
- The reskin tools on Windows.
- The vite-plugin-pwa documents were read from the project's GitHub repository. The documentation
  site was not reachable.

Three items left this list after the check, because they are now verified: the first Node 22
release with type stripping on by default (ENG-05); the Yard mute behaviour in a browser
(ENG-20); the removal of `exportProfile` and `gradable` by the bundler (ENG-12).

Added by the check, not verified:

- The forced-update trial of ENG-01 (2 of 2 runs). Only the natural path was run again.
- The "new version is ready" control of ENG-01. Only the waiting worker was tried.
- The unit tests on Node 24. That version is not on this machine.
- Which Node the machine that makes the Windows build has.
- The content security policy of ENG-19 in the Tauri shell and in a browser other than Chromium.
- That a browser removes stored data of a site that is not used for some days (ENG-03).
- That the installed web app and a browser tab share one profile (ENG-21). From model knowledge.
- The fixes of ENG-21, ENG-22 and ENG-23. None was built.
- The licence of the Atkinson Hyperlegible font (ENG-07).
- Whether `radioSim.js` still equals its origin file (section 11, row 20).
- The smoke test cases for Reference, Settings, Radio "Call it yourself" and the word tape.
  They are designs.

Check: confirmed. The list is true to the report: each item above has no measurement behind it.

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

### 18.1 Evidence of the check

Scratch folder of the check:
`/tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/R6-check/`

| File or folder | What it is |
|---|---|
| `copy/` | `git archive` of `cb51d4b`, with its own `npm ci` and its own build. `copy/dist` is byte-identical to the repository's `dist/`. |
| `v2a/`, `v2b/` | Version 2 with a changed main chunk only, and version 2 with a changed Yard source as well. |
| `p1/`, `p2/` | Versions 1 and 2 built with `registerType: 'prompt'`. |
| `dusk/`, `map/`, `noinc/`, `csp/` | The build with the six Dusk layers; the build with source maps; the build without `includeAssets`; the build with the policy of ENG-19 as a `meta` tag. |
| `measure.mjs`, `chunks.mjs`, `steps.mjs` | Sizes and the cache list; the content of each chunk; the three `STEPS` hashes. |
| `serve.mjs`, `update.mjs`, `prompt.mjs`, `offline.mjs`, `offline2.mjs` | The static server and the update and offline trials. `update-islandChanged-yard.png` is the blank Yard. |
| `fail.mjs`, `tabs.mjs`, `sig.mjs`, `csp.mjs`, `t4.mjs` | The failure, storage, mute and stage trials; the two-tab trial; the Signals key element; the policy trial; the "Watch optimal" timing. |
| `unit/`, `vr/`, `fp-*/`, `eng/`, `tamper/`, `st/` | The unit tests; the look harness trial; the lock entry counts; the `engine-strict` trial; the edited Dusk copy; the tools' self-test. |
| `audit.json`, `node22-changelog.md` | The output of `npm audit --json`; the Node 22 changelog. |

Writes of the check: this file, and the scratch folder. One `npx oxlint` call in a folder with
no local install made npm download `oxlint` 1.94.0 into the npm cache of this machine; the result
quoted in section 5.4 is from the project's own 1.71.0. `npx oxlint` (read only) also ran in the
repository. No `npm install`, `npm ci`, build or git change ran in the repository.

Web sources of the check:
`https://raw.githubusercontent.com/nodejs/Release/main/schedule.json`,
`https://raw.githubusercontent.com/nodejs/node/main/doc/changelogs/CHANGELOG_V22.md`,
`https://raw.githubusercontent.com/vite-pwa/docs/main/guide/auto-update.md`,
`https://raw.githubusercontent.com/vite-pwa/docs/main/guide/register-service-worker.md`, the npm
registry, and the GitHub API through `gh`. The two plugin documents say what ENG-01 quotes: no
reload without a virtual module, and the risk of lost input with an automatic reload.

## 19. Check record

The unit is one line that starts with "Check:" (or holds "Check:" after a row label).

| Result | Count |
|---|---:|
| Confirmed | 50 |
| Corrected | 20 |
| Not verified | 1 |
| Withdrawn statements (section 20) | 3 |
| Findings added (ENG-21, ENG-22, ENG-23) | 3 |

No numbered finding was withdrawn. ENG-01 to ENG-20 are all still valid. The corrections that
change what a job must do are these:

1. ENG-01: the blank Yard needs a release that changes the Yard sources. `registerType:
   'prompt'` alone removed it in the trial.
2. ENG-05: with `engine-strict` the run on `main` would fail at step 4. Node 22.18 is verified
   as the first release that strips types by default.
3. ENG-15: `includeAssets` is one of two causes of the duplicate cache entry.
4. ENG-18: the unit is packages. `npm audit fix` needs a ruling against fence rule 10.
5. Section 5.6: the Signals route opens on a text question in about 2 of 30 loads.
6. Section 5.7: with a seed, the answered-question page still fails the pixel gate. The tools'
   README keeps the look tool outside a repository.
7. Fence: some fixes need files that no job owns, and four gate files are outside G1's Files
   line (section 16, items 6 and 7).

Fence result: no proposed fix edits a frozen file, writes or corrects a rule, uses a raw colour,
or hands the owner a command. Fixes that change behaviour, a word or a control are marked as U1
rows that need the owner's yes: ENG-01, ENG-02, ENG-03, ENG-07, ENG-20 items 1 and 3, ENG-21.
Rulings that only the lead or the owner can give: the rule 4 exceptions of ENG-09, the lock
change of ENG-18, the place of the look tool.

## 20. Withdrawn

No numbered finding is withdrawn. Three statements are withdrawn.

| # | Where it stood | Statement | Reason |
|---|---|---|---|
| W1 | ENG-01, the Radio line | "A real release changes every hash." | Not true. The two station chunks import nothing from the main chunk. A trial release that changed the main chunk only kept `yardSim-DhRiMDpN.js` and `radioSim-BkSw6bln.js`, and the Yard drew in 3 of 3 runs. A chunk gets a new name when its own sources change. |
| W2 | Sections 5.7 and 7, the verdict for `visual-regress.mjs` | "Adopt `visual-regress.mjs` as it is. Vendor it with its `styles/` folder to `tools/look/`", given as a plain verdict | The tools' own README says the opposite for this tool. Line 354: "`visual-regress` always stays outside (it needs packages and pictures)". Line 28 puts the whole folder outside every repository. The README describes copies inside a repository for `dusk-sync` and `token-lint` only (lines 341-354). The tool works here; where it goes is now a ruling for the lead. |
| W3 | ENG-15, the fix | "remove `includeAssets` (the pattern covers the files)" as the whole fix | A trial build without `includeAssets` still lists `favicon.svg` twice. `includeManifestIcons: false` is needed as well. |
