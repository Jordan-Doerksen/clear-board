# Brief U1-B — the upgrade rows of the shell, the profile, Home and Settings

Goal: Build the approved upgrade rows that touch the shell, the stored profile, the update path, Home and Settings, the overlay for "Look it up", and four rulings of the lead on shared parts.
Files: `src/App.tsx`, `src/main.tsx`, `src/state/AppContext.tsx`, `src/core/store.ts`, `src/core/types.ts`, `src/stations/imperativeStation.ts`, `src/stations/Home.tsx`, `src/styles/surfaces/home.css`, `src/stations/Settings.tsx`, `src/styles/surfaces/settings.css`, `src/styles/surfaces/shell.css`, `src/index.css`, `src/styles/clear-board.parts.css`, `src/components/` (new, for the overlay), `index.html`, `vite.config.ts`, `src/pwa-env.d.ts` (new, the types of the PWA plugin), block 4 of `src/styles/clear-board.tokens.css` (only the `@font-face` rule of U-30), `public/fonts/` (new, only with U-30), `specs/words/U1B.md`, `specs/pictures/2c-U1B/`.
Done when: `npm run check` green (11 steps); `npm run build` green; `npm run test:browser` green (15 gate cases); the hash gate shows no frozen file changed since `94a41c5` and the `STEPS` region of `radioSim.js` byte-equal; the look compare in look mode against the baseline of `49d3ba0` (`npm run look:baseline -- --ref 49d3ba0`, then `node tools/look/look.mjs compare --look --gate --config tools/look/cb.config.json`) has 0 failing shots, except the word changes that an approved row of this brief names, each listed in the report; each row of section 3 passes its pass check, run by the job; pictures at 1440 and 390 (the Yard also 1280) committed in `specs/pictures/2c-U1B/` at device scale factor 1; the proposed words of the job in `specs/words/U1B.md`; the work committed on `cb2/2c-U1B` and the working tree clean (the lead pushes the wave branch).
Ruled out: (section 4 of the plan, the fence, in full)
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
Also ruled out for this job: any file outside the Files line; `tools/**`, `tests/**`, `package.json` and the lock file (they are G1's); a rule written, corrected or cited; a word that no row of this brief asks for; a change of a frozen file; any push; any merge. the Drill, Reference, Radio and Yard station files (jobs U1-A, U1-C, Y4a); the bridge file except a rule the brief names.
Reports to: the lead. The report gives: what was built, by row; what was not, and why; each check with its command and its true output; each claim that is not verified; each note for the SME; the change lines for `CHANGELOG.md`.
Voice: terse, no hype.

## 1. Why this job exists
The owner said yes to rows U-01 to U-46 (D-0035) with the picks of rows U-13, U-17, U-30 and U-42. These rows touch the files of this job.

## 2. Read first
`specs/briefs/2c-plan.md`; `specs/research/upgrade-list.md` section 2 (each row below) and section 7; the findings each row names in `R4`, `R5` and `R6` (R6 ENG-01, -02, -03, -07, -21 hold the trials of the update, the failed load and the two copies); `lead-rulings.md` sections 2 to 2.5 (`OPTION-EDGE`, `FORCED-COLOURS`, `SWEEP`, `MAXW`, `TEXT-READING`, `TILE-TONE`); `specs/briefs/B1.md`.

## 3. What to build (each row: the upgrade-list text is the requirement; its source finding gives the pass check)
1. **U-05.** A damaged stored profile is repaired on load; if the app cannot draw, a screen offers "Save a copy of the stored data" and "Start fresh". Before U-18.
2. **U-07 (the store and shell part, 2c-plan C9).** `loadContent` reports which files failed; the shell shows one notice "Part of the library did not load" with a retry control; Home shows no "Coming soon" for a domain whose file failed; a failed load of a station island says so and offers a retry (R6 ENG-01 a); a render error shows a fallback screen and not a blank page. The Drill, Reference and Radio test parts are job U1-D; the Yard part is job Y4a.
3. **U-10.** After a release, the open app shows "A new version is ready" with one control and reloads only when the learner chooses (prompt mode of the PWA plugin, R6 ENG-01 trial).
4. **U-11 (Home part, words).** Home promises only what the app holds.
5. **U-13.** "Reduce motion" is on when the learner chose it or when the device asks for it, and it follows a change of the device flag live; "Higher contrast" starts from the device; Settings gives the reason (A11Y-07, A11Y-27).
6. **U-15 (the store part).** The stage name at exactly 85 % (R6 ENG-20 item 1, `store.ts`).
7. **U-17 (the overlay, 2c-plan C1).** `lookUp(itemId)` in the app context and in the bridge object of the islands opens the Reference entry of the item in a dialog on top of the current station; closing it returns focus to the control that opened it. The callers switch in job U1-D.
8. **U-18.** Settings can save the progress to a file and load it again, and one sentence says that a browser clean-up deletes the progress.
9. **U-24, U-25, U-27, U-33 (words).** The Radio card, "job-ready" and one line "practice, not the official test", one main control "Start here" or "Continue", and the domain cards (UX-37, UX-24, UX-10, A11Y-24, UX-22).
10. **U-26 (Home part).** "N due now" on Home, from the stored due dates.
11. **U-29 (the shell part, 2c-plan C7).** The page title of each route; no focus move at the first load; after a change of station, focus goes to the first `h2` of the view; `main` draws no outline (A11Y-22, A11Y-23).
12. **U-30.** The dyslexia mode names the face "Atkinson Hyperlegible" (block 4 of the bridge file). Ship it as a font file only if its licence allows it. Get the file with no change of `package.json` (for example `npm pack` of a published font package into the scratch folder), read its licence file first, report it, and commit the licence text next to the font. The offline cache takes the font file. If the licence is not clear, the label changes to what the setting does and no file ships.
13. **U-31 (the core part, 2c-plan C10).** Read aloud speaks its confirmation after the state change, the setting row says "No voice on this device" when that is true, and the speech stops on a change of route (A11Y-25). The Drill and the Radio test pass their options and feedback (jobs U1-A and U1-C).
14. **U-34.** Two open copies of the app keep the answers of both (R6 ENG-21; the store tests of G1 exist).
15. **U-35 (Home part).** Home loses the card "Exam — Coming soon".
16. **U-36 (Settings part, 2c-plan C8).** "Reset my progress" also removes the stored sound choice of the Yard (the key `sl_muted`).
17. **U-40 (Home part, words).** One name for the way back to Home (2c-plan C6).
18. **U-42.** The tip link says that it opens a new tab and does not send the page address.
19. **Lead rulings.** `OPTION-EDGE` (the edge of `cb-opt` takes `--cb-edge`), `FORCED-COLOURS` (one forced-colours block in the parts file), the disabled `cb-select` keeps opacity 1 (Y3 review), `SWEEP` (the dead rules of `src/index.css` go), the comment of `imperativeStation.ts` about work in flight becomes true, and the teardown call of 2c-plan C2.

## 4. Contracts
2c-plan C1 (`lookUp`), C2 (the optional `unmount` call), C3, C4 (the reduce setting), C5, C6, C7, C8, C9, C10.

## 5. Traps
The service worker: prompt mode must not leave a learner on a stale rulebook with no word (R6 ENG-01). A repaired profile keeps each item it can read (F6). The font licence is not verified (U-30). Do not change a word that no row asks for.

## 6. Not in this job
The callers of `lookUp` (job U1-D), the Drill, Reference and Radio rows (jobs U1-A, U1-C), the Yard (jobs Y4a, Y4b), the package name and version (job G1-2), the documents (job D1).

## 7. Order of work
U-05 first, then U-18; the overlay (C1), the failed-load fields (C9) and the shell part of C7 early, so that jobs U1-D and Y4b can start after the merge; each row or small group in its own commit, each green.
