# Brief G1-close of Wave 2c — the last tightening of the gates

Goal: Tighten the gates to the tree after Wave 2c-2: a browser test that plays a Yard job to a win at 390 px by touch and at 1440 px by keyboard, the focus case of contract C7 as a gate case, the Yard cases and shots after job Y4b, the look config after jobs Y4b and U1-D, and the lint limit.
Files: `tools/**`, `tests/**`, `.github/workflows/check.yml`, `.oxlintrc.json`.
Done when: `npm run check` green; `npm run build` green; `npm run test:browser` green with the new gate cases, in three runs; the look compare against the baseline of `49d3ba0a356896a7aed1fbe961d23639b0ff9215` (the state before Wave 2c) has 0 failing shots with the new config, each allowed change names its row, and a compare against the baseline of the base of this job has 0 failing shots; each new gate fails on a seeded fault (scratch only); no frozen file changed since `94a41c5`; the work committed on `cb2/2c-G1close` and the working tree clean.
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
Also ruled out for this job: any file outside the Files line; a change of app code (a test that finds a defect reports it); a weaker check; an allow-list entry with no row; a new dependency; any push; any merge.
Reports to: the lead. The report gives: what was done, by row; what was not, and why; each check with its command and its true output; each claim that is not verified; each note for the SME.
Voice: terse, no hype. The documents are dry Simplified Technical English: active voice, short sentences, no contractions, no idiom, no exclamation marks.

## 1. Why this job exists
Contract A.2: G1 has a closing step at each wave merge. Gate A, question 2: "a browser test plays a job to a win at phone width" (D-0033). Ruling `C7-DRILL` and `LINT-ONE`.

## 2. Read first
`specs/briefs/2c-plan.md`; `specs/briefs/2c-1-merge-notes.md`; the merge notes of step 2c-2 (`specs/briefs/2c-2-merge-notes.md`); `specs/briefs/lead-rulings.md` sections 2.6 and 2.7; `specs/briefs/G1.md`, `specs/briefs/G1-2.md`; the code of `tools/` and `tests/`.

## 3. What to build
1. **The Yard to a win.** A gate case plays job p0-1 to a win at 390 by 844 px by touch only (tap on the six switch buttons and the builder controls) and at 1440 by 900 px by keyboard only (Tab, Enter, Space), and checks the win words and the status region.
2. **The focus of a route.** The report case of G1-2 for contract C7 becomes a gate case.
3. **The Yard after Y4b.** Each Yard case and Yard look shot that the rows of Y4b change by design is recorded again, each change with its row.
4. **The look config after Y4b and U1-D.** Each id, class, word and control that a row of step 2c-2 adds or changes, with its row. The learn card shot.
5. **The lint limit.** The limit is the count of warnings that remains (ruling `LINT-ONE`).
6. **The register is exact (`LOOK-EXACT`, finding F1 of the G1-2 review).** Each entry of `changes` names the baseline commit it was measured on and applies only to a compare against that baseline. Each word of an entry has its expected count, not an upper bound in each direction, so a word that no row moved cannot go or come in its shadow. Prove it with the scratch build of the G1-2 review (one "the" removed from Home): it must fail.
7. **The update trial in full (finding F2).** Case 16 also renames a station chunk in the second build and removes the old chunk from the server, as the ENG-01 trial does, and checks that the open app says what it can and does not go blank. When "Reload" does nothing, the case fails with a sentence, not a raw timeout (F3).
8. **The learn card (finding F5).** A gate case checks the learn card screen of U1-D: the hooks of C11, the text of the item from the data, each control 44 by 44 px or more, and no question about the item right after its card.
9. **Case 8 after Y4b.** Smoke case 8 (the Yard, from Wave 2a) waits for "Watch optimal" to finish on its own, and the readout said "Joints". Y4b changes both by design (R7-P8, U-23). The case drives the stepper and reads the new words.
10. **The look harness does not stop (`LOOK-CRASH`, finding F3 of the U1-D review).** When the element that a page waits for does not show, the shot fails with a sentence and the compare goes on to the next shot; today `look.mjs` stops with an uncaught timeout.
11. **The proof.** Each gate from a clean state; three runs of `test:browser` with no flaky case; each new gate fails on a seeded fault.
