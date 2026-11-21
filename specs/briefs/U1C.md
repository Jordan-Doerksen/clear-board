# Brief U1-C — the upgrade rows of the Radio

Goal: Build the approved upgrade rows that touch the two Radio modes, without a change of the `STEPS` wording.
Files: `src/stations/Radio.tsx`, `src/stations/RadioTest.tsx`, `src/styles/surfaces/radio.css`, `src/stations/radioSim.js` (outside the `STEPS` region, lines 84 to 123), `src/core/radio.ts` (new: pure functions), `specs/words/U1C.md`, `specs/pictures/2c-U1C/`.
Done when: `npm run check` green (11 steps); `npm run build` green; `npm run test:browser` green (15 gate cases), except smoke case 6 (the word tape of the guided Radio), which may fail only on the presses where the words of rows U-21, U-22 and U-35 change; the report lists each such press with the old and the new word count, and the lead has job G1-2 record the tape again; the hash gate shows no frozen file changed since `94a41c5` and the `STEPS` region of `radioSim.js` byte-equal; the look compare in look mode against the baseline of `49d3ba0` (`npm run look:baseline -- --ref 49d3ba0`, then `node tools/look/look.mjs compare --look --gate --config tools/look/cb.config.json`) has 0 failing shots, except the word changes that an approved row of this brief names, each listed in the report; each row of section 3 passes its pass check, run by the job; pictures at 1440 and 390 (the Yard also 1280) committed in `specs/pictures/2c-U1C/` at device scale factor 1; the proposed words of the job in `specs/words/U1C.md`; the work committed on `cb2/2c-U1C` and the working tree clean (the lead pushes the wave branch).
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
Also ruled out for this job: any file outside the Files line; `tools/**`, `tests/**`, `package.json` and the lock file (they are G1's); a rule written, corrected or cited; a word that no row of this brief asks for; a change of a frozen file; any push; any merge. the `STEPS` region of `radioSim.js`.
Reports to: the lead. The report gives: what was built, by row; what was not, and why; each check with its command and its true output; each claim that is not verified; each note for the SME; the change lines for `CHANGELOG.md`.
Voice: terse, no hype.

## 1. Why this job exists
The owner said yes to rows U-01 to U-46 (D-0035). These rows touch the Radio.

## 2. Read first
`specs/briefs/2c-plan.md`; `specs/research/upgrade-list.md` section 2 (each row below); the findings each row names in `R4` and `R5` (A11Y-09, -10, -16, -19 have pass checks); `lead-rulings.md` sections 2 to 2.5 (`B3-LINE`, `RADIO-LINE1`, `TEXT-CAP`, `SURFACE-COLUMN`); `specs/briefs/B3.md`.

## 3. What to build (each row: the upgrade-list text is the requirement; its source finding gives the pass check)
1. **U-08 (Radio part).** The Radio test shows plain words in place of "SME", from the labels that the app has.
2. **U-14 (Radio part).** After "Key the radio", keyboard focus stays in the task (A11Y-09).
3. **U-19 (Radio part).** A screen reader hears the verdict after an answer in the Radio test (A11Y-10).
4. **U-21.** The guided Radio repeats the distance and the status as page text above the call; the text comes unchanged from the `read` and `status` fields of `STEPS`.
5. **U-22.** The guided Radio gets a correct structure for keyboard and screen reader: a log that scrolls with keys and is announced, a heading, a named scene, a correct mode switch, "← Home" first (A11Y-19, UX-32, UX-29).
6. **U-35 (Radio part).** The guided Radio loses the sentence about a "next layer".
7. **U-40 (Radio part, words).** One name for the way back to Home and one word for a session (2c-plan C6).
8. **U-15 (Radio part).** The summary of the Radio test does not say "moved" when the change is 0 (UX-27; words). Check "Practice the N you missed" of the Radio test for the count error that UX-27 found in the Drill, and correct it the same way if it is there (words).
9. **U-17 (Radio part).** A change of Radio mode keeps the run of each mode: both modes stay mounted and the other mode is hidden.
10. **U-29 (Radio part, 2c-plan C7).** One visible `h2` with the station name, for both modes, as the first heading in `#view`; the question heading of the Radio test becomes an `h3` with no change of its look; the guided headings sit under it. Pass check: A11Y-22 for the Radio.
11. **U-31 (Radio test part, 2c-plan C10).** With Read aloud on, the Radio test also passes the options and the feedback to `speak`. Pass check: A11Y-25 with a recorder.
12. **U-44 (the move).** `optionsFor`, `distinct` and `shuffle` of `RadioTest.tsx` move to pure functions in `src/core/radio.ts` that take the random source as a parameter (default `Math.random`), with no change of behaviour (prove it with a seeded comparison before and after).
13. **`RADIO-LINE1`.** The comment on line 1 of `radioSim.js` says what is true.
The "Look it up" of the Radio test keeps its route in this job; job U1-D switches it to the overlay (U-17).

## 4. Contracts
2c-plan C3, C5, C6, C7, C10. The hooks `opt` and `feedback` stay.

## 5. Traps
The hash gate covers the `STEPS` region: no character there changes. The word tape (smoke case 6) reads the words on the screen; rows U-21, U-22 and U-35 change them by design (see "Done when").

## 6. Not in this job
The overlay and the callers of U-17 (jobs U1-B and U1-D); U-07 in the Radio test (job U1-D); the Drill and Home rows.

## 7. Order of work
One row per commit, each green except the named tape presses; U-44 first; U-22 before U-21.
