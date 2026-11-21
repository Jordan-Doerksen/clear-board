# Brief Y4a — the Yard access layer, motion that stops, and two Yard layout fixes

Goal: Make the Yard playable to a win by keyboard alone and by touch on a phone 390 px wide, give a screen reader the state of the yard and the result of each move, and make "Reduce motion" stop each Yard effect so that the end state shows at once with its words.
Files: `src/stations/yardSim.js`, `src/stations/yard/view.ts`, `src/stations/yard/yard.css`, `src/stations/yard/access.ts` (new), `src/stations/yard/anim.js`, `src/stations/yard/sound.js` (only the guard of the stored key, C8), `src/stations/yard/draw.ts` and `src/stations/yard/drawing/*` (only for the place of the switch buttons and the facts that the mirror reads), the Yard block of `src/styles/clear-board.tokens.css`, `src/stations/Yard.tsx`, `specs/words/Y4a.md`, `specs/pictures/2c-Y4a/`.
Done when: `npm run check` green (11 steps); `npm run build` green; `npm run test:browser` green (15 gate cases); a scratch script of the job plays job p0-1 to a win at 390 px by touch only and at 1440 px by keyboard only, and its output is in the report; the hash gate shows no frozen file changed since `94a41c5` and the `STEPS` region of `radioSim.js` byte-equal; the look compare in look mode against the baseline of `49d3ba0` (`npm run look:baseline -- --ref 49d3ba0`, then `node tools/look/look.mjs compare --look --gate --config tools/look/cb.config.json`) has 0 failing shots, except the word changes that an approved row of this brief names, each listed in the report; each row of section 3 passes its pass check, run by the job; pictures at 1440 and 390 (the Yard also 1280) committed in `specs/pictures/2c-Y4a/` at device scale factor 1; the proposed words of the job in `specs/words/Y4a.md`; the work committed on `cb2/2c-Y4a` and the working tree clean (the lead pushes the wave branch).
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
Also ruled out for this job: any file outside the Files line; `tools/**`, `tests/**`, `package.json` and the lock file (they are G1's); a rule written, corrected or cited; a word that no row of this brief asks for; a change of a frozen file; any push; any merge. the controls and behaviours of job Y4b (section 6).
Reports to: the lead. The report gives: what was built, by row; what was not, and why; each check with its command and its true output; each claim that is not verified; each note for the SME; the change lines for `CHANGELOG.md`.
Voice: terse, no hype.

## 1. Why this job exists
The Yard cannot be played with a keyboard, a switch has a hit area of about 5 px on a phone, a screen reader gets no state, and "Reduce motion" makes each move about 6 times slower (D-0036). The owner picked full play on a phone (D-0033). Plan wave 2c, job Y4; contract Part H; `lead-rulings.md` sections 2 to 2.5.

## 2. Read first
`specs/briefs/2c-plan.md` (the contracts of Wave 2c); `specs/research/upgrade-list.md` section 3 rows P-01, P-02, P-03 and section 2 rows U-09, U-12, U-20; `specs/research/R5-accessibility-audit.md` findings A11Y-01, -02, -03, -04, -18, -29 (each has a pass check); `R2-yard-drawing-technology.md` section 9 (what Y4 needs: native buttons over the SVG, moved and not rebuilt, C15); `R7-yard-motion-sound.md` (the static form of each effect); `specs/briefs/Y2.md` and the code of `yard/draw.ts` (`switchBoxes()`, `onLayout`, the control layer `.yd-view-controls`) and `yard/drawing/bodies.ts` (the facts for the mirror); `lead-rulings.md` rows `SWITCH-BUTTONS`, `MOTION-STOP-OWNER`, `MIRROR-WORDS`, `UNMOUNT`, `Y-FIX`, `READOUT-CELLS`.

## 3. What to build
1. **Six switch buttons (P-02, A11Y-01, `SWITCH-BUTTONS`).** One native `<button>` for each switch, in the control layer of the drawing, placed by `switchBoxes()` in the wide and the tall form, 44 by 44 px or more. Its name says the track and the lining in words. A press or Enter or Space throws the switch through the path of today (`onPick`). On `onLayout` the buttons move; they are not rebuilt, so focus stays on the pressed button (R2 C15). The pointer path of Y2 stays. Pass check: A11Y-01.
2. **The text mirror and one status region (P-03, A11Y-03).** A list `#yard-mirror` that says, track by track, the cars in order (mark, type, load state), TIED, LOOSE, KICKABLE and BUILD k / m, the lining of each switch, and the engine and what it holds; one region `#yard-live` (polite) that says the result of each move and the words of each refusal. Use only words that the app shows today and the state words of the drawing (`MIRROR-WORDS`: the SME reads the mirror before the change reaches `main`; list it in the words file). The SVG gets an accessible name or stays hidden with the mirror as its text form. Pass check: A11Y-03.
3. **Motion that stops (P-01, A11Y-04, `MOTION-STOP-OWNER`).** The controller reads `ctx.settings.reduce` at each move, not at mount. With it on, each move, kick, arrival, departure and watched step ends at once: each step function of `anim.js` runs one time with its end value, the end state is painted with its words, and the trace of the last move shows. No effect is slower. With it off, the times of Y2 stay. Pass check: A11Y-04 (the move ends in under 50 ms with the setting on).
4. **The switch-list lines (U-09, A11Y-02).** Each line can be flagged and unflagged by keyboard (a native button or a control with the right role and state). Pass check: A11Y-02.
5. **Labels (U-20, A11Y-18).** The four selects (action, count, track, job) have visible labels. The sound button has a text name and its state in words.
6. **Stop and ask (U-12, A11Y-29).** "Watch optimal" can be stopped. Before "Watch optimal" or a change of job discards the moves of the learner, the Yard asks, and "No" keeps the moves.
7. **Two layout fixes (`Y-FIX`).** The message well and the note panel take the full width of the Yard; their text keeps the cap at `--measure`. Only a car mark or a number of the job line takes the mono face.
8. **The heading (U-29, 2c-plan C7).** The Yard shows one visible `h2` with the station name as the first heading of the view, in the form of the Reference title. Pass check: A11Y-22 for the Yard.
9. **The Yard loads with storage refused (U-07, ENG-02, C8).** Each read and write of `sl_muted` in `sound.js` is guarded; with `localStorage` refused, the Yard draws and plays. Pass check: the ENG-02 trial with storage refused gives a drawn Yard and 0 page errors.
10. **Teardown (`UNMOUNT`, 2c-plan C2).** `yardSim.js` exports `unmount()`, which stops each timer, animation frame, sound and listener of the Yard. Pass check: leaving the Yard during a move gives no page error (today it gives a TypeError, Y1 review).

## 4. Contracts
2c-plan: C2 (`unmount`), C3 (the words file), C5 (pictures), C7 (the heading), C8 (the sound key). The ids `#yard-mirror` and `#yard-live`. The hooks of contract B.6 stay. The class prefix `yd-`; the drawing keeps `yd-view-`.

## 5. Traps
A rebuilt button loses focus (R2 C15). The reduce setting was read once at mount (R7 F2). Each step function commits a part of the move to the model: a jump to the end must still run each one. A refusal message of the model is frozen text; the region repeats it and does not change it. `geometry.js` and `model.js` are frozen.

## 6. Not in this job (job Y4b, after this job)
The sound default and its own switch (R7-P2), the arrival on request (R7-P5), the stepper of the watched line (R7-P8), the sound for secure, flag and certify (R7-P9), the move log (R7-P10), a new input that ends an effect (R7-P11), the cost of a move in words (R7-P12), the empty lead after Depart (R7-P14), the banner cleared by a throw (R7-P16), the role of each step (`LEG-ROLE`), the route words and the head bar (`ROUTE-WORDS`, `YARD-HEAD`), the landing place (`LANDING`), rows U-04, U-16, U-23, U-36, U-39, and the switch of "Look it up" to the overlay (U-17).

## 7. Order of work
Small commits, each green: teardown; the storage guard; the reduce read and the jump to the end; the mirror and the region; the six buttons; the switch-list keyboard; the labels; stop and ask; the layout fixes; the heading; the proof script; the pictures.
