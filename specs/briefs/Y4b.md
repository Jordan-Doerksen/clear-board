# Brief Y4b — the Yard controls of the owner's picks, and the Yard rows of the upgrade list

Goal: Build the Yard controls that the owner picked (D-0038: R7-P2, P5, P8, P9, P10, P11, P12, P14, P16), the Yard parts that Y2 left for Y4 (`LEG-ROLE`, `ROUTE-WORDS`, `YARD-HEAD`, `LANDING`), the Yard rows of the upgrade list (U-04, U-16, U-23, U-36, U-39, U-40) and the Yard caller of the look-up overlay (U-17).
Files: `src/stations/yardSim.js`, `src/stations/yard/view.ts`, `src/stations/yard/yard.css`, `src/stations/yard/access.ts`, `src/stations/yard/anim.js`, `src/stations/yard/sound.js`, `src/stations/yard/draw.ts`, `src/stations/yard/drawing/*`, the Yard block of `src/styles/clear-board.tokens.css`, `src/stations/Yard.tsx`, `specs/words/Y4b.md`, `specs/pictures/2c-Y4b/`.
Done when: `npm run check` green (11 steps); `npm run build` green; `npm run test:browser` green (the gate cases of the wave branch at the start of the job); a scratch script of the job plays job p0-1 to a win at 390 px by touch only and at 1440 px by keyboard only, and its output is in the report; the hash gate shows no frozen file changed since `94a41c5` and the `STEPS` region of `radioSim.js` byte-equal; the look compare in look mode against the baseline of `6d74633b40853e052ed09fd30119bd45514b4643` (`npm run look:baseline -- --ref 6d74633b40853e052ed09fd30119bd45514b4643`, then `node tools/look/look.mjs compare --look --gate --config tools/look/cb.config.json`) has 0 failing shots, except the word changes that an approved row of this brief names, each listed in the report; each row of section 3 passes its pass check, run by the job; pictures at 1440 and 390 (the Yard also 1280) committed in `specs/pictures/2c-Y4b/` at device scale factor 1; the proposed words of the job in `specs/words/Y4b.md`; the work committed on `cb2/2c-Y4b` and the working tree clean (the lead pushes the wave branch).
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
Also ruled out for this job: any file outside the Files line; `tools/**`, `tests/**`, `package.json` and the lock file (they are G1's); a rule written, corrected or cited; a word that no row of this brief asks for; a change of a frozen file; any push; any merge. a change of the access layer of job Y4a, except where a row of this brief needs it (the mirror and the region then carry the new state in words).
Reports to: the lead. The report gives: what was built, by row; what was not, and why; each check with its command and its true output; each claim that is not verified; each note for the SME; the change lines for `CHANGELOG.md`.
Voice: terse, no hype.

## 1. Why this job exists
The owner answered the 19 picks with "yes to all recommended" (D-0038). R7 section 12 gives each pick with its reason. The upgrade rows U-04, U-16, U-23, U-36, U-39 and U-40 touch the Yard files, so they start after Y4a is merged (`2C-ORDER`).

## 2. Read first
`specs/briefs/2c-plan.md`; `specs/briefs/2c-1-merge-notes.md`; `specs/briefs/lead-rulings.md` section 2.6 (`SW-NAME`, `SOUND-STOP`, `CERTIFY-FOCUS`, `TRACK-MONO`, `RESET-ASK`), section 3 (the picks), section 4 (open for the SME: `R7-P6`, `R7-P7`, `R7-P13`, `MIRROR-WORDS` stay as they are) and the rows `LEG-ROLE`, `LANDING`, `ROUTE-WORDS`, `YARD-HEAD`; `specs/research/R7-yard-motion-sound.md` sections 3 (F4 to F14), 6, 7, 8, 9, 10, 11 and 12; `specs/research/upgrade-list.md` section 2 (each row below); `specs/briefs/Y4a.md` and the code that job Y4a merged (the six switch buttons, `#yard-mirror`, `#yard-live`, the motion stop, `unmount`).

## 3. What to build
1. **The look-up (U-17, 2c-plan C1).** The refusal control "Look it up" calls `ctx.lookUp(id)` (the bridge object `StationCtx` has it since U1-B) and not a route. The job, the moves and the drawing stay. Pass check: after a refusal, the press opens the entry on top of the Yard; after the close, the move count, the drawing and the focus are as before.
2. **The banner after a switch throw (R7-P16, F8).** A throw clears a refusal that is no longer true.
3. **The sound (R7-P2, U-36 the Yard part, R6 ENG-20 item 3, 2c-plan C8).** Sound is off by default. The sound button is its own switch, and the choice holds between visits under the key `sl_muted`. The Yard reads the stored choice at each mount, so that a reset (which removes the key) shows at the next visit with no reload. The Yard does not mute itself at mount. "Read aloud" does not set the Yard sound.
4. **One new sound (R7-P9).** One new `confirm` sound for secure, flag and certify (R7 11.2).
5. **The watched line (R7-P8, U-04, F10).** "Watch optimal" becomes a stepper with Next, Back, "Play all" and Stop. It asks before it replaces the learner's work (Y4a built the question). A watched job gets no done mark and no win sound. The marks in old profiles stay (contract `U-04`). The mirror and the region say each step (R7 section 10, the row "Watched line").
6. **Controls during motion (R7-P11, F4).** Nothing locks during motion. A new input ends the running effect at its end state and then runs. The result is announced at the start of the effect. Test the double press and report what it does (R7 gives the risk as not tested).
7. **After Depart (R7-P14, F6).** The lead shows empty, and the job is closed until Reset. The controller holds a "departed" flag. `model.js` is not edited.
8. **The arrival (R7-P5, F9).** The arrival runs on request only, from a control in the work order. Nothing starts by itself. With Reduce motion on, the request shows the end state at once. The set-out picture stays as it is (SME note S5).
9. **The move log (R7-P10, R7 section 9).** A numbered list of the moves of this run: the call, the result, the cost. "Before and after" on the last line changes the drawing between the two states and changes no game state. "Play again" on a line plays that move one more time and changes no game state; with Reduce motion on it shows the two still states.
10. **The cost of a move in words (R7-P12, F7).** After each move, words say the change of the two counters. A pull after a spot names the pull-out that the model charges late. The lead approves these words and the SME checks them: put them in the words file, with each case.
11. **Job done (U-23, U-40 the Yard part, 2c-plan C6).** Each finish starts with "Job done.". The record reads in the form "5 moves, 2 couplings". The readout says "couplings" in place of "Joints". ("← Home" is done by Y4a.)
12. **The route and the head bar (`ROUTE-WORDS`, `YARD-HEAD`).** Show "Route: LEAD → …" and the head bar of the yard panel from the facts that `bodies.ts` exports.
13. **The landing place (`LANDING`).** Show where a spot or a kick will land, through the optional `builder` field of the paint call that Y2 added.
14. **The role of each step (`LEG-ROLE`).** The controller passes a role for each step, so that `anim.js` maps the run-in and the run-out legs.
15. **The first job (U-16).** The first job says, in view, how to line a switch and how to call a move. The move builder starts on a track of the job.
16. **Small items (U-39).** A key for the picker marks; no empty banner box; a "wait" line during the arrival; calm words in the list refusal.
17. **Four points of the Y4a review.** (a) `SW-NAME`: each switch button keeps `data-sw` and the name that says its lining ("AS73 switch, lined reverse"); it loses `aria-pressed`, so that a screen reader says the state one time. (b) `SOUND-STOP`: `unmount()` also stops the notes that `sound.js` has already timed (today up to three notes of the win melody, 270 ms after a leave). (c) `CERTIFY-FOCUS`: after Certify, focus stays in the work order and does not fall to the page body. (d) `TRACK-MONO`: a track id in the job line ("AS75") is a mark, so it takes the mono face, as a car mark does.

## 4. Contracts
2c-plan C1, C3, C5, C6, C8. The hooks of contract B.6, and the reserved hooks of Y4a (`data-sw`, `#yard-mirror`, `#yard-live`). The class prefix `yd-`; the drawing keeps `yd-view-`.

## 5. Traps
Each step function of `anim.js` commits a part of the move to the model: an end at once must still run each one. A refusal text of the model is frozen text. A "Back" of the stepper and "Before and after" must not change the game state: work on a copy. A watched line must not reach `recordYardWin`. The kick picture (R7-P7), the rest place of the engine (R7-P6) and the sound of a spot (R7-P13) wait for the SME: no change.

## 6. Order of work
Small commits, each green: rows 1, 2, 3, 4, 17; 5; 6; 7; 8; 9; 10 and 11 (the words in commits of their own); 12, 13, 14; 15, 16; the proof script; the pictures. If the job cannot finish each row, it finishes the rows in this order and reports the rest.
