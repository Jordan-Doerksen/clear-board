# Wave 2c, fix round 2 (F2) — the plan of the lead (2026-11-21)

Goal: fix the open findings of the last review of Wave 2c that need no ruling of the owner, and give
the fixes of the lead a second reader. Four build jobs (F2-A to F2-D) each get an independent
review. One more job (F2-R) reads the fixes of the lead. The lead merges each job into
`claude/cb2-wave-2c`.

The source of each finding is `specs/handoff/final-review.json` (steps, cause, fix and verdict) and
`HANDOFF.md`, sections 5.1 and 5.2. The rulings of this round are in `lead-rulings.md`, section 2.8.

Not in this round: F-2 (the owner rules first: it changes the selection) and the message part of
F-7 (it needs new words: the owner approves them first).

## 1. The fence (verbatim)

1. **Frozen files. No edit, no reformat, no move.** `public/data/*.json`, `src/core/signal.ts`, `src/stations/yard/model.js`, `solver.js`, `puzzles.js`, `geometry.js`, and the `STEPS` wording in `src/stations/radioSim.js`. `geometry.js` looks like layout, but `model.js` reads its lengths and clearances, so a changed number changes what the game allows. The new drawing uses a view transform on top of it and its own palette.
2. **No rule is written, corrected or cited by you or by a sub-agent.** The rulebook is not in the repository and never will be. A finding about rule content is a note for the SME, never an edit.
3. A reskin changes no behaviour, no number, no word and no control.
4. No raw colour outside the bridge file and the frozen files.
5. Red is attention only. A colour or a glow is never the only carrier of a state. Words carry it.
6. Reduced motion stops every effect and nothing goes blank. Design the static state first.
7. The four reading modes survive: dyslexia type, high contrast, text scale, reduced motion.
8. Contrast is WCAG AA or better. Targets are 44 px or more. No sideways scroll at 390 or 1440 px wide. A table reflows. No pill buttons: 6 px radius or plain text.
9. One session, one branch, its own files only. `package.json` and the lock file belong to G1 alone.
10. `npm run check` and `npm run build` are green before any session reports done. Install with `npm ci`, never a fresh resolve.
11. No secret in the repository. No timer, cron or scheduled job. No accounts, server or analytics.
12. **No push to `main` and no merge into `main`.** Push branches and open draft pull requests. `main` moves only on the owner's typed word. Do not turn GitHub Pages on for this repository and do not "fix" the deploy workflow's last step (see T13).
13. The owner runs no commands. Never hand the owner a command, a path to open or a step to carry out.
14. Never present the owner by a job title, and keep personal history out of every file.
15. Show nothing rather than something false. Mark a claim you did not check as not verified.

## 2. The rules for each job

1. Work only in your worktree `/home/user/wt/2c-<job>` on the branch `cb2/2c-<job>`. It starts at the
   commit of `claude/cb2-wave-2c` that holds this plan. Do not push. Do not merge. The lead merges.
   F2-R works on a detached worktree and commits nothing.
2. Install with `npm ci` in the worktree. Use Node 22 (`.nvmrc`).
3. Touch only the files that your job names in section 3. When a file of another job must change,
   stop that part and say so in the report. Do not touch `HANDOFF.md`: it is the lead's.
4. Use only your block of ports (table below), for `test:browser`, the look harness and each probe
   server. Stop each server that you start. Keep probes, logs and pictures in your scratch folder
   `/tmp/claude-0/-home-user/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/F2/<job>/`, not in the
   repository.

   | Job | Ports |
   |---|---|
   | F2-A | 4610 to 4619 |
   | F2-B | 4620 to 4629 |
   | F2-C | 4630 to 4639 |
   | F2-D | 4640 to 4649 |
   | F2-R | 4650 to 4659 |

5. No new learner-facing word. A message can join words that the app has today. No change to a
   rule text, a number, a selection of items, a stored key or a control, except the change that
   your requirement names.
6. Write comments, documents and commit messages in Simplified Technical English: short sentences,
   one instruction or one fact in each sentence, active voice. A comment says what the code does
   and why, with the name of the finding (for example F-11) or of the ruling. End each commit
   message with these two lines:

   ```
   Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
   Claude-Session: https://claude.ai/code/session_01XxUY36piWe7YXrQhjhYbRs
   ```

7. When your change makes a line of `ARCHITECTURE.md`, `SPEC.md`, `README.md`, `CHANGELOG.md` or
   `DECISIONS.md` untrue, correct that line in your job.
8. The gates before you report done, each from a clean tree:
   - `npm run check` (12 steps; lint limit 1 warning).
   - `npm run build`.
   - `CB_PORT=<your first port> npm run test:browser` (each gate case passes).
   - The look gate: `node tools/look/look.mjs baseline --ref 49d3ba0a356896a7aed1fbe961d23639b0ff9215 --port <port>`
     one time, then `npm run build` and `node tools/look/look.mjs compare --look --port <port>`.
     The compare must show no failure: each change of a word, a control, an id or a class is in the
     register with its exact count (ruling `LOOK-EXACT`). At the start of the round the lead ran
     this compare on the start commit; ask nothing about it, run it yourself.
   - The frozen files: `sha256sum -c specs/handoff/frozen-files-94a41c5.sha256` (each file OK) and
     the `STEPS` region of `src/stations/radioSim.js`, found by its markers
     (`awk '/^export const STEPS = \[/{p=1} p{print} p&&/^\];/{exit}' src/stations/radioSim.js | sha256sum`),
     equal to `dc38610359f800ba7e336c981e038d629e0c541d60f11da7722f2add919ca3c5`.
9. Prove each requirement with your own probe in the built app (Playwright; Chromium is installed,
   `require('playwright')` from the worktree). Give the command and the output lines in the report.
   Mark a claim that you did not check as not verified.

## 3. The jobs

### 3.A F2-A: the spoken names (F-14, K-1)

Files: `src/stations/Drill.tsx`, `src/stations/Reference.tsx`, `src/stations/yard/view.ts`,
`src/stations/radioSim.js` (outside `STEPS`), `src/components/Entry.tsx`, `tools/look/cb.config.json`
(new entries only), `tests/browser/smoke.mjs` (only where a case finds a control by a name that
changes), and a document line that becomes untrue.

| # | Requirement |
|---|---|
| A1 | `HEAD-ONE` (F-14). The icon of the station heading of the Drill, Signals and Reference is decoration: its span gets `aria-hidden="true"`, as in `Yard.tsx` and `Radio.tsx`. The spoken names become "Drill", "Signals" and "Reference". The words on the screen do not change. Correct each comment that says the icon is in the name. |
| A2 | `SIGN-NAME` (K-1, row U-41). The sign ▶ of "▶ Watch optimal" (`view.ts`, each place that writes it), the sign ▶ of "Key the radio ▶" (`radioSim.js`, outside `STEPS`; each place that writes the label), and the signs ✓ ⚠ ● of the trust mark (`Entry.tsx`: the chip of an entry and the words of a Reference row) go in their own span with `aria-hidden="true"`. The text on the screen does not change. The spoken name keeps each word. |
| A3 | No other change of a name. List in the report each other control or heading whose spoken name holds a sign or an icon (for example ◂ ▸ → ✓ ⚠ ● 🔊 ▶ 📖), with its file and line. The lead decides on them later. |
| A4 | The look gate passes: add an entry to the register for each name that changes, with the row (`U-41` or `HEAD-ONE`), the baseline `49d3ba0a356896a7aed1fbe961d23639b0ff9215`, the pages and the exact counts. Do not change an existing entry, except where its count changes because of A1 or A2; then say which entry and why. |
| A5 | When a gate case finds a control by a name that changes, give the case the new name. The case stays as strict as before. |

Pass checks: the accessible name (Chromium AX tree or `ariaSnapshot`) of the first `h2` of `#view`
on `/drill`, `/signals`, `/reference`, `/yard` and `/radio`, and of each control of A2, at 1440 and
390, before and after; the visible text (`innerText`) of each one is equal before and after; the
gates of section 2.

### 3.B F2-B: forced colours (F-10)

Files: `src/styles/clear-board.parts.css` (the block `FORCED-COLOURS`), `src/stations/radioSim.js`
(`RADIO_CSS` only, outside `STEPS`), and a sheet of `src/styles/surfaces/` when a rule belongs there.

| # | Requirement |
|---|---|
| B1 | With forced colours, each mode tab of the Radio has an edge, and the selected tab has a heavier edge than the other (for example a bottom border of 3 px). The selected mode shows with no colour. |
| B2 | With forced colours, a control that cannot act (`aria-disabled="true"` or `disabled`) shows its words and its edge in `GrayText`. "◂ Back" at step 0 of the stepper, and "Next ▸" and "▶ Play all" at the end, look different from a control that can act. |
| B3 | With forced colours, "Key the radio ▶" has an edge, as each `dusk-btn` beside it. |
| B4 | With forced colours, each label of the Radio scene has a contrast of 4.5:1 or more against its ground, in the light and the dark forced palette. Keep the stage as drawn (`forced-color-adjust: none` on the stage), or put its text on system colours. Look first at how the Yard drawing does it (`src/styles/surfaces/` and `src/stations/yard/`), and do the same where it fits. |
| B5 | With forced colours off, nothing changes: the look gate passes, and the pixels of each shot are equal to the pixels of the start commit (run the compare with a baseline taken from `dist/` of the start commit, then with your change). |
| B6 | Use system colour keywords only (`CanvasText`, `ButtonText`, `GrayText`, `Highlight`, ...), or a border with no colour value, as the block does today. `npm run check:colour` passes. |

Pass checks: a probe with `forcedColors: 'active'` and `colorScheme` light and dark, at 1440 and 390:
the computed edge of each tab and of the selected tab; the colour and the edge of "◂ Back" at step 0
against "Next ▸"; the edge of the Key button; the contrast of each label of the scene after three
presses of the Key button. Pictures of each state in your scratch folder, before and after.

### 3.C F2-C: the Yard stepper (F-11, K-4)

Files: `src/stations/yardSim.js` and `tests/browser/smoke.mjs`.

| # | Requirement |
|---|---|
| C1 | `PLAY-ALL-ONE` (F-11). With Reduce motion (the setting or the device flag), one press of "▶ Play all" writes one message to the status region `#yard-live` that holds each step that it played, in order, each in the words that `sayStep` gives a step today. With motion on, each step keeps its own message, about 2 s apart, as today. The banner, the mirror, the step list and the readout do not change. The fix copy of the verifier (`/tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/final-review/verify-access-13/fix.diff`) is a reference. Read it; do not copy it blindly. |
| C2 | `GATE-44` (K-4). A gate case measures each control of the stepper (at step 0, at a middle step and at the end) and each control of the win state of a job (the move log controls, "Before and after", "Play again" and each other control that shows at the win) at 390 and 1440. Each one is 44 by 44 px or more. A failure says the control and its size. |
| C3 | A gate case checks C1: with Reduce motion, one press of "▶ Play all" at step 0 of job p0-1 gives one new text in `#yard-live`, and it holds "Step 1 of N" to "Step N of N" in order. |
| C4 | Prove each new case: a fault that you put in the tree for the proof (for example a rule that makes one stepper control 40 px high, or the old code of C1) makes the case fail with its sentence; the case passes without the fault. Do not commit a fault. |

Pass checks: a probe that records each write to `#yard-live` and each text that a MutationObserver
sees, with Reduce motion (setting and device flag) at 1440 and 390, for "Play all" at step 0, after
"Next", and on job p1-sort; and with motion on (the control case). The gates of section 2.

### 3.D F2-D: the learn card of a twin, and the form of the register (F-12, K-3)

Files: `src/core/drill.ts` (`withLearnCards` only), `tests/unit/` (new or changed tests),
`tests/browser/smoke.mjs` (case 22 only), `tools/look/cb.config.json`, `tools/look/look.mjs` (only for
a new form of the register), and a document line that becomes untrue.

| # | Requirement |
|---|---|
| D1 | `LEARN-TWIN` (F-12). `withLearnCards` counts items that share a `citation.ref` as one item for the gap of `LEARN-GAP`: a question never comes right after the learn card of its own item or of an item with the same `citation.ref`. A ref that many items share as a section of the book, and not as one rule (for example "CROR Definitions"), is not a key. Measure in the data which refs items share, and by how many items; write the rule that you pick, and its reason, in a comment and in the report. Do not read, write or judge the text of a rule: use the ref as a key only. |
| D2 | No other change of a session: the same items, the same cards and the same counts. Only the order changes, and only where D1 needs it. The mastery model does not change. |
| D3 | Unit tests: over 20,000 seeded first sessions on `signals` and on each other live domain, no question comes right after the card of its own item or of its twin. Show that the new test fails on the code before the fix, and passes after it. The tests of `LEARN-GAP` that exist pass. |
| D4 | `REGISTER-FORM` (K-3). The look register holds no word of the text of an item: no title, no plain words, no rule text and no name of an option that comes from the data (ruling `TAPE-FORM` keeps content words out of the gates). Today the entry of the shot `drill-learn` holds such words. Give the register a form that holds no item text: for example a key that names the parts of a page whose words the compare does not count, as `LOOK-MIRROR` does for visually hidden text. Each other word of the page keeps its exact count. |
| D5 | Prove D4: change one word of the app on the learn card in your tree (for example the control "Next →"): the compare fails and names the word. Without the change it passes. Do not commit the change. When D1 changes the first screens of the shot `drill-learn`, the register follows. |
| D6 | Case 22 of the browser test checks D1 as it checks `LEARN-GAP` today, when this costs no more than a few seconds. |

Pass checks: the unit tests with their counts; a browser probe of a first session on `/signals` with
the seeds of the finding (702 at 1440; 565 at 1440; 654 at 390) that shows no twin question right
after a card; the gates of section 2.

### 3.R F2-R: the second reader of the fixes of the lead

Read, line by line, the commits `3076815` (F-1), `62cedd7` (F-4, F-5, K-2), `5a7f3fc` (F-3) and
`b0c70f3` (F-6, F-7, F-8, F-9, F-13), with their findings in `specs/handoff/final-review.json`. Work
on a detached worktree at the start commit. Commit nothing; edit no file of the repository.

1. For each fix: does it fix the finding in each case that the finding names, at 1440 and 390?
   Run the steps of the finding again on the built app.
2. Try to break each fix: a case that the fix forgets, a new defect that it brings, a change of
   behaviour that no finding asks for, a fence item that it breaks. For example: does the focus
   move of F-7 take focus away from a control that the learner uses? Does the reload of F-8 lose a
   learner's work in another case? Does the height of the head in F-6 follow the text scale and a
   change of the name? Does the review round of F-1 still offer four different options of one
   kind?
3. Report each finding with its steps, what happens, what should happen, the evidence, a severity
   and the size of the fix. Report a fix that holds as "holds", with the evidence.

## 4. The independent review of each build job

The reviewer of a job did not build it. The reviewer works in the same worktree, after the build.

1. Run the gates of section 2 from a clean state (`git status` clean, `rm -rf node_modules dist`,
   `npm ci`).
2. Check the frozen files and the `STEPS` region.
3. Check that the job touched only its files (`git diff --stat` against the start commit).
4. Read the diff line by line.
5. Check each requirement with your own probe, not with the probe of the builder. Try to refute each
   claim of the report.
6. Check the fence, the words (no new learner-facing word) and the reading modes.
7. Repair each defect that is small, in a commit of its own on the same branch, with the two
   trailer lines. Run the gates again after the repairs.
8. Report: ready or not ready, each finding with its state (repaired or open) and its evidence, and
   the gates with their output lines.
