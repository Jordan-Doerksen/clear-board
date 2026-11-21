# Clear Board 2 — the handoff

This file is the handoff and the final report of the Clear Board 2 change request, written by the
lead on 2026-11-21. The work stops here because the account of the session ends. Each piece of
work is pushed to GitHub. A new session (an agent or a developer) can pick it up from this file.
The owner runs no command (fence rule 13): section 8 is for the next session, not for the owner.

## 1. Where the work is

| Pull request | Head branch | Base branch | What it holds |
|---|---|---|---|
| [#1](https://github.com/Jordan-Doerksen/clear-board/pull/1) | `claude/peaceful-mayer-qat99l` | `main` | Wave 1: the plan, the research (R1 to R7), the upgrade list, Gate A |
| [#2](https://github.com/Jordan-Doerksen/clear-board/pull/2) | `claude/cb2-wave-2a` | `claude/peaceful-mayer-qat99l` | Wave 2a: the gates, the Dusk skin floor, the Yard split |
| [#3](https://github.com/Jordan-Doerksen/clear-board/pull/3) | `claude/cb2-wave-2b` | `claude/cb2-wave-2a` | Wave 2b: the surfaces in Dusk parts, the new Yard drawing (look C2) |
| [#4](https://github.com/Jordan-Doerksen/clear-board/pull/4) | `claude/cb2-wave-2c` | `claude/cb2-wave-2b` | Wave 2c: the Yard access and controls, the upgrade rows, the tests, the documents, this file |

- Each pull request is a draft. Each one is based on the one before it, so they merge in the order
  #1, #2, #3, #4. `main` has not moved: it is still at `86cfef2`. `main` moves only on the owner's
  typed word (fence rule 12).
- The GitHub check (`check.yml`: the check, the build and the browser test) passed on each head of
  #4 on 2026-11-21, the last one `b92d1e6` included.
- **A live preview** of `claude/cb2-wave-2c` at `b92d1e6` is at https://clear-board-2-preview.vercel.app
  (the Vercel project `clear-board-2-preview` of the owner's Vercel account, made on 2026-11-21 at the
  owner's request). It is a project of its own: the owner's live site and `main` did not change. A
  later push to the branch does not update it by itself (not verified): deploy again to see a change.

## 2. The "done when" list of the plan (section 9)

| Item | State |
|---|---|
| 1. Each wave branch pushed, one draft pull request for each wave | Done: #1 to #4. |
| 2. `npm run check` and `npm run build` green on the last branch, with the output | Done: section 3. |
| 3. The hash gate proves that no frozen file changed since `94a41c5` | Done: section 3. |
| 4. `DECISIONS.md`, `ARCHITECTURE.md`, `SPEC.md`, `README.md`, `CHANGELOG.md` say what is true | Done at `dc88b14` (job D1, then the lead). D-0040 to D-0047 are the decisions of Wave 2c. |
| 5. One final report | This file. The last review of the whole wave finished (section 5.1). |

## 3. The gates on `claude/cb2-wave-2c` at `dc88b14`, run by the lead on 2026-11-21

`npm run check`:

```
PASS  step  1  check:frozen  0.11 s
PASS  step  2  check:dusk  0.10 s
PASS  step  3  check:colour  0.15 s
PASS  step  4  check:names  0.10 s
PASS  step  5  lint  0.09 s
PASS  step  6  typecheck  4.59 s
PASS  step  7  test:unit  0.54 s
PASS  step  8  sr-vectors  0.07 s
PASS  step  9  solve  4.56 s
PASS  step 10  content-check  0.05 s
PASS  step 11  securement-check  0.04 s
PASS  step 12  shared-drawings  0.14 s
check: 12 of 12 steps passed in 10.54 s
npm run check exit 0
```

`npm run build` (last lines):

```
✓ built in 385ms
PWA v1.3.0
mode      generateSW
precache  17 entries (786.23 KiB)
files generated
  dist/sw.js
  dist/workbox-2fbc6a65.js
npm run build exit 0
```

`npm run test:browser`: 22 of 22 gate cases passed in 52.31 s (the run of the lead after the last
merge of code, at `5b44e34`; the later commits change documents only). The cases include a Yard job
played to a win by touch only at 390 px and by keyboard only at 1440 px.

The hash gate (`specs/handoff/frozen-files-94a41c5.sha256`, then the `STEPS` region of
`src/stations/radioSim.js`, found by its markers `export const STEPS = [` and `];`):

```
public/data/definitions.json: OK
public/data/radio-script.json: OK
public/data/rule-questions.json: OK
public/data/rules.json: OK
public/data/signals.json: OK
src/core/signal.ts: OK
src/stations/yard/model.js: OK
src/stations/yard/solver.js: OK
src/stations/yard/puzzles.js: OK
src/stations/yard/geometry.js: OK
exit 0
STEPS region at 94a41c5: dc38610359f800ba7e336c981e038d629e0c541d60f11da7722f2add919ca3c5
STEPS region now:        dc38610359f800ba7e336c981e038d629e0c541d60f11da7722f2add919ca3c5
```

### 3.1 The gates at `b0c70f3`, the last fix commit of the lead (2026-11-21)

```
check: 12 of 12 steps passed in 8.52 s        (81 unit tests; lint 1 warning, limit 1)
npm run build                                 (exit 0; the offline cache: 17 files)
smoke: 22 of 22 gate cases passed in 51.02 s.
sha256sum -c specs/handoff/frozen-files-94a41c5.sha256   -> each frozen file equal
STEPS region at 94a41c5 and now: dc38610359f800ba... (equal)
```

## 4. What landed

- **Wave 1.** The research R1 to R7, the upgrade list (51 rows), Gate A: look C2 for the Yard, full
  play on a phone, the monogram icon, yes to the recommended rows U-01 to U-46.
- **Wave 2a.** The gates (`npm run check`, the browser smoke test, the look harness, CI), the Dusk
  0.2.0 skin floor (a locked copy of Dusk and one bridge file of tokens), the Yard split into a
  controller, a view and a drawing.
- **Wave 2b.** Each surface in Dusk parts (the shell, Home, Settings, Reference, the Drill, the
  Radio, the Yard chrome), the new Yard drawing in SVG (look C2), the 19 picks of the owner (D-0038).
- **Wave 2c.** The Yard by keyboard and by touch, a text mirror and a status region, Reduce motion
  that ends each effect; the Yard controls of the owner's picks (the sound off by default, the
  stepper of the watched line, the move log, the cost of a move in words, the arrival on request,
  the empty lead after Depart); the approved upgrade rows U-01 to U-46 (among them: the Drill asks no
  drawing that two signals share; a damaged profile is repaired; the progress saves to a file and
  loads again; a failed load says so; a new version waits for the learner; "Look it up" opens on top
  of the station; a learn card before the first question about a new item; one heading and one
  title for each station); the second pass and the close of the gates; the documents for 2.0.0. The
  owner approved all 153 lines of new words (D-0047).
- The full list of changes is the entry 2.0.0 of `CHANGELOG.md`.

## 5. What is open

After the handoff the lead fixed F-1, F-3, F-4, F-5, F-6, F-8, F-9, F-13 and K-2, and the focus part of F-7, on the same branch (section 5.1 marks each one). The gates stayed green: check 12 of 12 with 81 unit tests, build, smoke 22 of 22, frozen files and the `STEPS` region equal (section 3.1). A second reader then checked these fixes (section 5.1.1), and the lead repaired what it found in `c276de5`. Fix round 2 (`specs/briefs/2c-F2-plan.md`) builds the rest of section 5.1 and 5.2 that needs no ruling of the owner.

### 5.1 The last review of the whole wave (finished)

Four independent reviewers worked on `dc88b14`: learner journeys, accessibility, the fence and
safety, and code correctness. An independent verifier tried to refute each finding: 20 were
confirmed and 2 refuted. The raw output is `specs/handoff/final-review.json` (each finding with its
steps, cause, fix and verdict). The reviewers found the fence whole: the frozen files and the
`STEPS` region equal, no raw colour, no new rule text, no timer, server or analytics, and the stored
data, U-01, the grading guard and MASTERY-NOW correct.

The confirmed findings, with the same defect found twice shown once:

| # | Severity | Finding | State |
|---|---|---|---|
| F-1 | high | In the review of the misses, a signal question could offer a term of another kind ("FIXED SIGNAL", or "Rule 405" for the drawing of 405) and mark it wrong as safety-critical. | **Fixed in `3076815`** (two unit tests over 350 seeds; both fail on the code before it). |
| F-2 | medium | "Continue" beside "N due now" asks mostly new items, so the due items wait (`src/core/drill.ts` line 239 with `src/core/sr.ts` line 30). | Open: the owner rules first (it changes the selection). |
| F-3 | medium | After Reset or Load in Settings, an open station shows the old progress. | **Fixed in `5a7f3fc`.** |
| F-4 | medium | The look-up dialog stays open after a browser Back, and its close drops focus to the page body. | **Fixed in `62cedd7`.** |
| F-5 | medium | Reference says "No match" while the library loads. | **Fixed in `62cedd7`.** |
| F-6 | medium | Settings: the sticky head of the dialog hides the control that has focus when focus moves up (`clear-board.parts.css`, the rule of `.cb-dialog > .dusk-panel-head`). Fix: `scroll-padding-top` on `.cb-dialog`. | **Fixed in `b0c70f3`.** The look-up dialog had the same defect with a long name (its head is up to 162 px high at 390 px); it writes the height of its head for the rule. Probe: each control of both dialogs keeps its whole focus ring below the head. |
| F-7 | medium | After a "Try again" that works, focus falls to the page body and no result is said (`src/App.tsx`, `src/components/LookUp.tsx`). | **Focus fixed in `b0c70f3` and `c276de5`:** it goes to the heading of the view, or of the look-up dialog, also after a try that loads only part of the library. Open: one message that says the result of a try (loaded, or still not loaded). It needs new words, so the owner approves them first. |
| F-8 | medium | "Reload" of the notice "A new version is ready" does nothing on a page that no service worker controls (`src/App.tsx` lines 87 to 90). Fix: reload the page when no worker waits. | **Fixed in `b0c70f3` and `c276de5`.** Probe with two builds: on a first visit, on a second visit and with two open copies, the first press of "Reload" opens build 2. |
| F-9 | medium | The guided Radio: the end summary is not announced (`src/stations/radioSim.js` line 79, outside `STEPS`). Fix: put the done box in a `role="status"` region. | **Fixed in `b0c70f3`.** The `STEPS` region stays equal; the gaps round the box stay 10 px. |
| F-10 | low | Forced colours: the selected Radio mode, the stepper controls that cannot act and the Key button lose their marks. | Open. |
| F-11 | low | The Yard stepper with Reduce motion: "Play all" announces only the last step (`src/stations/yardSim.js` near line 495). | Open. |
| F-12 | low | LEARN-GAP: the learn card of a twin item (the rule item and the signal item of one CROR rule) can come right before a question about the other, and holds its answer (`src/core/drill.ts` lines 107 to 131). A question for the SME too. | Open. |
| F-13 | low | Comments and one document line that Wave 2c made untrue: `ARCHITECTURE.md` near line 397 (the report case of C7 is now gate case 21), `src/stations/yard/view.ts` lines 5 to 8, `src/App.tsx` lines 127 and 128. | **Fixed in `b0c70f3`.** |
| F-14 | low | The headings of the Drill and Reference carry their icon in the accessible name; the Yard and the Radio do not. | Open: one verifier refuted it (brief B2 asked for "📖 Reference" as the heading). |

#### 5.1.1 The second reader of the fixes of the lead (job F2-R, 2026-11-21)

An independent reader checked `3076815`, `62cedd7`, `5a7f3fc` and `b0c70f3` with its own probes at
1440 and 390. F-1, F-3, F-4, F-5, F-6, F-9 and K-2 hold. It found six more items; the lead repaired
each one in `c276de5` and ran the reader's probes again on that build:

| # | Item | State |
|---|---|---|
| R-1 | A "Try again" that loads only part of the library dropped focus to the page body (Drill, Reference, Radio test). | **Fixed in `c276de5`.** |
| R-2 | After a "Try again" in the look-up dialog, each later look-up opened on its heading, not on "Close". | **Fixed in `c276de5`.** |
| R-3 | With two open copies, the first press of "Reload" in the copy that no worker controls did nothing. | **Fixed in `c276de5`.** |
| R-4 | A Reset in another copy restarts the Drill or the Radio test under an open look-up dialog; closing it dropped focus to the page body. | **Fixed in `c276de5`.** |
| R-5 | The F-6 offset scrolled a dialog to its top when focus reached "Done" or "Close". | **Fixed in `c276de5`.** |
| R-6 | Comments and document lines that the fixes left untrue. | **Fixed in `c276de5`**, except line 4 of `src/stations/yardSim.js` (it does not name `profileChanged()`): it waits for job F2-C, which owns that file in fix round 2. |

### 5.2 Small known items for the same final fix job

| # | Item |
|---|---|
| K-1 | Row U-41 (an icon in a control is decoration) is not complete: the sign ▶ of "▶ Watch optimal" (`src/stations/yard/view.ts` lines 177 and 449) and of "Key the radio ▶" (`src/stations/radioSim.js` line 174, outside `STEPS`), and the trust signs ✓ ⚠ ● of the Reference rows (`src/components/Entry.tsx`), are part of the accessible name. Hide each sign with `aria-hidden`, and add the name changes to the look register with row U-41. |
| K-2 | **Fixed in `62cedd7`.** Comments that are no longer true: `tsconfig.app.json` line 9, `index.html` line 5, `src/stations/Reference.tsx` near line 52. (`deploy.yml` stays as it is: fence rule 12.) |
| K-3 | The register entry of the look shot `drill-learn` (`tools/look/cb.config.json`) holds word counts of the plain text of one signal item. Replace it with a form that holds no item text (ruling `TAPE-FORM` keeps content words out of the gates). |
| K-4 | No gate case measures the controls of the Yard stepper and of the win state (44 px). A probe found no defect; add the case. |

### 5.3 Known items, ruled, that stay as they are

`NOTICE-TWICE` (a failed load shows the notice in the shell and in the station), `RETRY-RESTART`
("Try again" during a session restarts it; older than Wave 2c), `TAG-HOME`, `SESSION-LENGTH` (a first
Drill session can hold 10 learn cards and 10 questions), `P16-NIT`, `PICKER-CUT` (on a phone the closed
job picker cuts a long option), `LINT-ONE` (one lint warning), `FLASH` (a flashing signal lamp still
flashes with Reduce motion on: the frozen `signal.ts` draws it). Each has its line in
`specs/briefs/lead-rulings.md`, sections 2.6 and 2.7.

### 5.4 Section 7 of the plan: the steps that need the owner or another machine

1. The owner's own look in the owner's browser at 1440 and 390 px.
2. The owner's played Yard win (D-0027).
3. The Windows desktop build. `src-tauri/**` waits (ruling `TAURI`): its version is 0.1.0 against
   2.0.0, its window colour is the page ground from before Wave 2a, its icon set is the default
   mark, its author line holds a name, and its dev port is 4548.
4. The merge to `main` in the order #1, #2, #3, #4, and the update of the owner's site copy.

### 5.5 Not verified

A real phone, Safari, Firefox, the Windows desktop build, a real screen reader, the sounds by ear,
and any test with a learner. Each measurement is from headless Chromium on Linux.

## 6. Notes for the SME (content; nothing was fixed)

- The 28 notes of `specs/research/upgrade-list.md`, section 10.
- S-01: two drawings belong to two signal items each (the green dwarf lamp of 405 and 431; the red
  mast lamp of 437 and 439). The Drill no longer asks them; Reference and the learn card show them.
- S-13: which label is true for the radio calls `radio.joint.06`, `.08`, `.09` and `.10`, whose
  source in the data is "SME" (today: "● No CROR citation in the verified source").
- S-14: each of the 38 aspect lists holds one drawing two times.
- S-04, S-05: `rule.573` has no text; 107 entries say "The rule text is not in the app."
- S-12: the list of safety-critical (S3) items in `src/core/severity.ts`; no entry records that the
  SME reviewed it. `RADIO-SEVERITY`: each radio call is S2 by its domain; which severity is right.
- S-15: the four needs-review signal items show in the list with "⚠ not yet verified".
- `FLASH`, `YELLOW-WORD` (the help text says "yellow" for a reverse switch), `MIRROR-WORDS` (the
  words of the Yard mirror and of the switch names), R7-P6 (where the engine rests after a spot),
  R7-P7 (the picture of a kick), R7-P13 (the sound of a spot), S5 (the arrival picture), S8 (the
  stepper lines the switches before each step), R7-P12 (the cost words of a move,
  `specs/words/Y4b.md` section 2).
- `LEARN-GAP`: is one other screen between a learn card and its first question enough for a read on
  sight (the signals cap depends on it)?
- "Correct answer" on a call of practice in the Radio test; "Route: LEAD → MAIN LINE"; "The road
  train has left out the lead."; "from the switch" against "throat" in the mirror.
- R6 note 3 (the count of signal drawings), R6 note 4 (the page description names a CN conductor),
  and the rule paragraphs of `specs/radio-call-it-yourself.md` lines 54 and 55 (no report checked
  them).

## 7. The records to read

- `specs/clear-board-2-plan.md`: the plan; section 4 is the fence, in full.
- `specs/briefs/lead-rulings.md`: each ruling of the lead and each answer of the owner.
- `specs/briefs/2c-plan.md`, `2c-1-merge-notes.md`, `2c-2-merge-notes.md`: the jobs and the contracts
  of Wave 2c. `specs/briefs/*.md`: the brief of each job.
- `DECISIONS.md` (D-0030 to D-0047), `ARCHITECTURE.md` (section 0c: the state after Wave 2c),
  `CHANGELOG.md` (2.0.0).
- `specs/words/*.md`: the approved words. `specs/handoff/words-sheet.html`: the same words as one
  page, screen by screen (open the file in a browser).

## 8. For the next session: how to pick it up

1. Clone the repository and check out `claude/cb2-wave-2c`. Use Node 22.23.5 (`.nvmrc`) and
   install with `npm ci`, never a fresh resolve (fence rule 10).
2. Run `npm run check` (12 steps), `npm run build`, and `npm run test:browser` (22 gate cases; it
   needs Chromium for Playwright 1.63.0).
3. Read the fence (plan, section 4) and keep it. The frozen files and the `STEPS` region must stay
   equal to `94a41c5`: `specs/handoff/lead-merge-check.sh` checks them with
   `specs/handoff/frozen-files-94a41c5.sha256`.
4. Fix round 2 builds F-10, F-11, F-12, F-14, K-1, K-3 and K-4 (`specs/briefs/2c-F2-plan.md`; the
   rulings are in `specs/briefs/lead-rulings.md`, section 2.8). Its jobs work on local branches
   (`cb2/2c-F2A` to `cb2/2c-F2D`). The lead merges each job into `claude/cb2-wave-2c` after its
   review. When a job of section 3 of the plan is not merged on this branch, do it again from the
   plan. The message part of F-7 needs new words: ask the owner first. F-2 waits for the owner's
   ruling. The repairs of the lead in `c276de5` had the probes of the second reader and the gates,
   but no second reader of their own.
   Work on a new branch from `claude/cb2-wave-2c`, give the job an independent review, merge it into
   `claude/cb2-wave-2c`, run the gates, and push. The draft pull request #4 then shows the change.
5. After the fix job, run the last review again on the whole wave (the four lenses of section
   5.1: learner journeys, accessibility, the fence and safety, code correctness), verify each
   finding, and fix what is small.
6. Do not merge into `main`. The owner says when.
