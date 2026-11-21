# Brief U1-D — the callers of the look-up overlay, the notice of a failed load, and three small defects

Goal: Switch "Look it up" in the Drill and in the Radio test to the overlay, so that the session stays; show the notice of a failed load in the Drill, Reference and the Radio test in place of a false sentence; build the two Radio test parts of rows U-06 and U-15 that no 2c-1 brief carried; and close three small defects.
Files: `src/stations/Drill.tsx`, `src/styles/surfaces/drill.css`, `src/core/drill.ts`, `src/stations/Reference.tsx`, `src/stations/RadioTest.tsx`, `src/core/severity.ts` (the comment on line 3 only), `src/core/store.ts` (the export of the profile key only), `src/state/AppContext.tsx` (rows 3, 9, 10 and 13 only), `src/stations/Home.tsx` (row 12 only), `src/components/Entry.tsx`, `src/components/LookUp.tsx`, block 1 of `src/styles/clear-board.tokens.css` (row 15 only), `specs/words/U1D.md`, `specs/pictures/2c-U1D/`.
Done when: `npm run check` green (11 steps); `npm run build` green; `npm run test:browser` green (the gate cases of the wave branch at the start of the job); the hash gate shows no frozen file changed since `94a41c5` and the `STEPS` region of `radioSim.js` byte-equal; the look compare in look mode against the baseline of `6d74633b40853e052ed09fd30119bd45514b4643` (`npm run look:baseline -- --ref 6d74633b40853e052ed09fd30119bd45514b4643`, then `node tools/look/look.mjs compare --look --gate --config tools/look/cb.config.json`) has 0 failing shots, except the word changes that an approved row of this brief names, each listed in the report; each row of section 3 passes its pass check, run by the job; pictures at 1440 and 390 (the Yard also 1280) committed in `specs/pictures/2c-U1D/` at device scale factor 1; the proposed words of the job in `specs/words/U1D.md`; the work committed on `cb2/2c-U1D` and the working tree clean (the lead pushes the wave branch).
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
Also ruled out for this job: any file outside the Files line; `tools/**`, `tests/**`, `package.json` and the lock file (they are G1's); a rule written, corrected or cited; a word that no row of this brief asks for; a change of a frozen file; any push; any merge. the Yard files (job Y4b).
Reports to: the lead. The report gives: what was built, by row; what was not, and why; each check with its command and its true output; each claim that is not verified; each note for the SME; the change lines for `CHANGELOG.md`.
Voice: terse, no hype.

## 1. Why this job exists
Row U-17: a help link must not cost the work. Row U-07 and fence item 15: show nothing rather than something false. Job U1-B built `lookUp`, `contentFailed` and `retryContent` (2c-plan C1, C9).

## 2. Read first
`specs/briefs/2c-plan.md` (C1, C7, C9, C11); `specs/briefs/2c-1-merge-notes.md`; `specs/briefs/lead-rulings.md` section 2.6; `specs/research/upgrade-list.md` rows U-06, U-07, U-15, U-17, U-26, U-28 and U-44; R4 UX-04 and R6 ENG-02 (each has its check); R6 ENG-20 item 2 and section 12; the code that job U1-B merged (`AppContext.tsx`, `imperativeStation.ts`, the overlay).

## 3. What to build
1. **U-17 (the Drill and the Radio test).** "Look it up" calls `lookUp(itemId)`. The session, the question, the answer state and the scroll stay. Pass check: answer a question, press "Look it up", close the overlay: the same question and its feedback show, and focus is on "Look it up".
2. **U-07 (the Drill, Reference and the Radio test, 2c-plan C9).** When the file of a domain did not load, the Drill and the Radio test show the notice of the shell words "Part of the library did not load" with the retry control, and not "Not enough verified content to drill yet."; Reference shows the notice and not "No match. Try another word." when no entry loaded. The Radio test catches a failed load (R6 ENG-02 "RadioTest.tsx:65 also has no catch"). Pass check: the ENG-02 trial (one file blocked; all blocked).
3. **P-27 item 2 (R6 ENG-20 item 2).** `store.ts` exports the profile key; `AppContext.tsx` imports it and repeats no literal.
4. **`C7-DRILL`.** The Drill and Signals keep one station heading element from the first render (the loading state) to the session, so that the focus that the shell puts on it after a change of route stays. Today the loading branch draws the title first and the session draws "← Home" first, so React replaces the heading and focus falls to the page body. Pass check: after a change of route to `/drill` and to `/signals`, `document.activeElement` is the first `h2` of `#view`, at 1440 and 390.
5. **P-25 (R6 section 12, `src/core/severity.ts:3`).** The comment names no person: it says that the SME can adjust the two lists.
6. **U-06 (the Radio test part, A11Y-11).** After an answer in the Radio test, the right option and the picked wrong option carry words, and the feedback names the right answer, in the same form as the Drill (job U1-A built the Drill part). Pass check: A11Y-11 for `RadioTest.tsx`.
7. **U-15 (the Radio test part, UX-39).** The start value of the Radio test comes from the profile after the recompute, as in the Drill (job U1-A). Pass check: the UX-39 trial on `#/radio` after a direct load.
8. **U-28 (`LEARN-GAP`, 2c-plan C11).** The Drill shows an item one time, on a learn card, before it tests that item for the first time (an item with `seen` 0). The card shows the text that the data holds (the title, the plain words, each different drawing of a signal) and one control to go on. The first question about that item never comes right after its card: at least one other screen comes between them; if the session has no room, the item is not tested in this session. The mastery model does not change (UX-11: "No change to the mastery model"), so a right answer still counts as the model says. The card has the hook `data-cb="learn"` and its control `data-cb="learn-next"`. Pass check: a fresh profile on `#/drill` and `#/signals` shows a learn card first; no question follows its own card at once; the smoke cases pass with the helper of G1-2.
9. **U-44 (the grading guards in the app).** `recordAnswer` and `gradeItems` in `AppContext.tsx` call `answerCounts` of `src/core/drill.ts` (job U1-A wrote it), so the tested guard is the guard that the app runs. No change of behaviour: prove it with the same seeded answers before and after.
10. **One value of mastery (`MASTERY-NOW`).** The app context recomputes the mastery on a change of route, so Home shows the same current value as the end of a Drill session (job U1-A reads the end value after the decay).
11. **U-26 (`U26-NOTE`, words).** The end note "This session was practice only" shows only when no answer of the session counted. List the case in the words file.
12. **`TILE-BAR`.** The progress bar inside a domain tile of Home is hidden from a screen reader; the visible number stays in the name of the tile. Pass check: the accessible name of each live tile holds the number one time.
13. **`RESET-COPY`.** "Reset my progress" also removes `cb.profile.v1.copy`.
14. **`ENTRY-ONE`.** The look-up dialog and Reference show one entry component (today `src/components/Entry.tsx` is a copy of the entry of `49d3ba0`, and Reference has the entry of job U1-A). The entry keeps the words and the look of the Reference entry of today, with the label rule of U-08 (the source gives the label).
15. **`BRIDGE-DEAD`.** Search each of `--surface`, `--clear`, `--caution`, `--stop` and `--r` in `src/`, `index.html` and the Dusk copy. Remove from block 1 of the bridge each name that nothing reads, and list the search in the report.

## 4. Traps
Do not change the look of the Drill, Reference or the Radio test except where a row asks for it. The notice words are the words of the shell (U1-B). The learn card shows only text that the data holds: no agent writes item text. The smoke helper of G1-2 presses `learn-next`; until G1-2 is merged the smoke cases of the first screen can fail on your branch only because of the learn card: list each one. A Yard file is job Y4b's.

## 5. Order of work
Rows 4, 1, 2, 3, 5; then 6, 7; then 9, 10, 11, 13; then 12, 14, 15; row 8 last, with its proof.
