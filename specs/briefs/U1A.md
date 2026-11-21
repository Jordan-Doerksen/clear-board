# Brief U1-A — the upgrade rows of the Drill, Signals and Reference

Goal: Build the approved upgrade rows that touch the Drill, Signals and Reference, and move the Drill selection and the grading guards into pure functions so that job G1-2 can test them.
Files: `src/stations/Drill.tsx`, `src/styles/surfaces/drill.css`, `src/stations/Reference.tsx`, `src/styles/surfaces/reference.css`, `src/stations/Signal.tsx` (the wrapper only), `src/core/drill.ts` (new: pure functions), `specs/words/U1A.md`, `specs/pictures/2c-U1A/`.
Done when: `npm run check` green (11 steps); `npm run build` green; `npm run test:browser` green (15 gate cases); the hash gate shows no frozen file changed since `94a41c5` and the `STEPS` region of `radioSim.js` byte-equal; the look compare in look mode against the baseline of `49d3ba0` (`npm run look:baseline -- --ref 49d3ba0`, then `node tools/look/look.mjs compare --look --gate --config tools/look/cb.config.json`) has 0 failing shots, except the word changes that an approved row of this brief names, each listed in the report; each row of section 3 passes its pass check, run by the job; pictures at 1440 and 390 (the Yard also 1280) committed in `specs/pictures/2c-U1A/` at device scale factor 1; the proposed words of the job in `specs/words/U1A.md`; the work committed on `cb2/2c-U1A` and the working tree clean (the lead pushes the wave branch).
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
Also ruled out for this job: any file outside the Files line; `tools/**`, `tests/**`, `package.json` and the lock file (they are G1's); a rule written, corrected or cited; a word that no row of this brief asks for; a change of a frozen file; any push; any merge. `src/core/store.ts`, `src/core/sr.ts`, `src/state/AppContext.tsx` (job U1-B); any decision about which signal name is right for a drawing.
Reports to: the lead. The report gives: what was built, by row; what was not, and why; each check with its command and its true output; each claim that is not verified; each note for the SME; the change lines for `CHANGELOG.md`.
Voice: terse, no hype.

## 1. Why this job exists
The owner said yes to rows U-01 to U-46 (D-0035). These rows touch the files of this job. Row U-01 is the worst class of failure: the Signals drill can mark a correct name as wrong (D-0036).

## 2. Read first
`specs/briefs/2c-plan.md`; `specs/research/upgrade-list.md` section 2 (each row below, with its "why", its source findings and its links) and section 10 (the SME notes S-01, S-14); the findings that each row names in `R4-learning-ux-audit.md` and `R5-accessibility-audit.md` (each R5 finding has a pass check); `lead-rulings.md` sections 2 to 2.5 (`TEXT-READING`, `READ-ORDER`, `PROMPT-SIGNAL`); `specs/briefs/B2.md` (the parts and hooks of these screens).

## 3. What to build (each row: the upgrade-list text is the requirement; its source finding gives the pass check)
1. **U-01 (app part).** The Signals drill does not ask a question whose drawing belongs to two indications (`signals.json` is frozen; the code finds such drawings). The drill never decides which name is right. The G1 report check is job G1-2.
2. **U-02.** Each row of the Reference list shows its trust mark as a word.
3. **U-03.** A pressed Reference row opens its entry at that row, and focus moves to the entry (A11Y-06).
4. **U-06.** After an answer, the right option and the picked wrong option carry words, and the feedback names the right answer (A11Y-11).
5. **U-08 (Reference part).** Reference takes the source label of an entry from its data.
6. **U-11 (Reference part, words).** An entry with no rule text, or with no text, says so in app words. Write no rule and no citation.
7. **U-14 (Drill part).** After "Next", keyboard focus stays in the task (A11Y-09).
8. **U-15 (Drill parts).** After a direct load, the start values and the tier limit come from the profile after the recompute (UX-39, its check). The button "Practice the N you missed" says the count of items and the count of questions (UX-27; words).
9. **U-19 (Drill part).** A screen reader hears the verdict after an answer; a miss on a safety item is announced at once (A11Y-10).
10. **U-26 (Drill part).** Progress in words at the end of a session, and a note when a round is practice only.
11. **U-28.** The Drill shows an item one time before it tests that item for the first time. The text is the text of the data.
12. **U-32.** The Reference search also reads the source line, the rule text and the domain name; the list has groups, and each row shows its domain.
13. **U-37 (words).** A signal entry shows each different drawing one time, and the Drill draws each one time. The button "Drill these aspects" gets a name that says what it does.
14. **U-38.** In the Drill feedback, "Next" is the main control and "Look it up" is a text link.
15. **U-40 (Drill part, words).** One name for the way back to Home and one word for a session, as `2c-plan.md` C6 proposes.
16. **U-44 (the move).** The Drill selection and the grading guards move to pure functions in `src/core/drill.ts` that take the random source as a parameter (default `Math.random`), with no change of behaviour (prove it with a seeded comparison before and after).
17. **U-29 (the Drill, Signals and Reference part, 2c-plan C7).** Each of the three views shows one visible `h2` with the station name as its first heading in `#view`; the question heading becomes an `h3` with no change of its look. Pass check: A11Y-22 for these views.
18. **U-31 (the Drill part, 2c-plan C10).** With Read aloud on, the Drill also passes the options and the feedback to `speak`, and a signal question speaks its question text. Pass check: A11Y-25 with a recorder in place of `speechSynthesis.speak`.
The "Look it up" of the Drill keeps its route in this job; job U1-D switches it to the overlay (U-17).

## 4. Contracts
2c-plan C3, C5, C6, C7, C10. The hooks of contract B.6 (`opt`, `feedback`, `prompt`, `prompt-signal`, `ref-*`) stay.

## 5. Traps
`signals.json` is frozen: U-01 and U-37 change selection and display code only. The drill must not mark both names right: that decides signal content. The FLASH item stays as today. A new word that no row asks for is not allowed.

## 6. Not in this job
U-17 (job U1-B builds the overlay; job U1-D switches the callers), U-07 (job U1-B, then job U1-D in the Drill and Reference), U-13 and the shell parts of U-29 and U-31 (job U1-B), the Radio rows (job U1-C), the tests of U-44 (job G1-2).

## 7. Order of work
One row or a few small rows per commit, each green; U-01 first; U-44 before the rows that change the selection.
