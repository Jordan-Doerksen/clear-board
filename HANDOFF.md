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
- The GitHub check (`check.yml`: the check, the build and the browser test) passed on the head of
  #4 (`dc88b14`) on 2026-11-21.

## 2. The "done when" list of the plan (section 9)

| Item | State |
|---|---|
| 1. Each wave branch pushed, one draft pull request for each wave | Done: #1 to #4. |
| 2. `npm run check` and `npm run build` green on the last branch, with the output | Done: section 3. |
| 3. The hash gate proves that no frozen file changed since `94a41c5` | Done: section 3. |
| 4. `DECISIONS.md`, `ARCHITECTURE.md`, `SPEC.md`, `README.md`, `CHANGELOG.md` say what is true | Done at `dc88b14` (job D1, then the lead). D-0040 to D-0047 are the decisions of Wave 2c. |
| 5. One final report | This file. The last review of the whole wave did not finish (section 5.1). |

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

After the handoff the lead fixed F-1, F-3, F-4, F-5 and K-2 on the same branch (section 5.1 marks each one). The gates stayed green: check 12 of 12 with 81 unit tests, build, smoke 22 of 22, frozen files equal.

### 5.1 The last review of the whole wave (not finished)

Four independent reviewers started on `dc88b14`: learner journeys, accessibility, the fence and
safety, and code correctness. Only the journeys review finished before the account ended. Its five
findings are below. Their independent verification did not finish. The raw output is
`specs/handoff/final-review-partial.json`. The next session runs the other three reviews again.

| # | Severity | Finding | Cause and fix size |
|---|---|---|---|
| F-1 | high | **Fixed in `3076815`** (two unit tests over 350 seeds; both fail on the code before it). In the review of the misses, a signal question can offer a definition term ("FIXED SIGNAL", "ADVANCE SIGNAL", "BLOCK", "INTERLOCKING", "CONTROLLED SIGNAL") as an option, and marks it wrong with "Safety-critical — lock this one in." The entry of FIXED SIGNAL is true of each signal. Seeded model: 171 of 11,808 review signal questions. | `src/core/drill.ts` lines 175 to 181: with fewer than three other signals among the misses, the distractors come from the pool of the misses, which holds other kinds. Fix: a signal question takes its distractors from the signal items of the library. Small. This is ruling `WEAK-REVIEW` with a new fact: it is now a defect to fix. |
| F-2 | medium | "Continue" beside "N due now" asks mostly new items: on a test profile with 33 items due, a session asked 1.9 due items and 8.1 new items on average. | `src/core/drill.ts` line 239 with `src/core/sr.ts` line 30: an item with no state counts as due, so new items land in the first bucket. The comment of the same function says due items come first. Small, but it changes the selection: the owner rules first. |
| F-3 | medium | **Fixed in `5a7f3fc`** (probe of the lead: a reset while the Yard is open clears the open picker; the restart of the Drill and of the Radio test after a load is not probed in the running app). After Reset or Load in Settings, an open Yard keeps its old job marks, and an open Drill or Radio session counts the loaded progress as its own gain. | `yardSim.js` builds the job picker at mount and after a win only; the Drill and the Radio test read their start values once. Small: refresh on a change of the stored profile. |
| F-4 | medium | **Fixed in `62cedd7`** (probe of the lead, 1440 and 390 px). The look-up dialog stays open over the next route after a browser Back, and closing it drops focus to the page body. | `src/components/LookUp.tsx` does not watch the route. Small: a change of route closes the dialog. |
| F-5 | medium | **Fixed in `62cedd7`** (probe of the lead, 1440 and 390 px). Reference says "No match. Try another word." while the library still loads (7.3 s on a slow network; 0.1 to 0.2 s on each direct load). | `src/stations/Reference.tsx` lines 103 to 105. Small: show "Loading…" as the other stations do. |

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
4. Do the final fix job: K-1, K-3 and K-4 (F-1, F-3, F-4, F-5 and K-2 are fixed; F-2 waits for the owner's ruling). Give the fixes of the lead (`3076815`, `62cedd7`, `5a7f3fc`) an independent review: they had probes and the gates, but no second reader. Check the top of section 5.1 first: the lead may have fixed more before the account ended.
   Work on a new branch from `claude/cb2-wave-2c`, give the job an independent review, merge it into
   `claude/cb2-wave-2c`, run the gates, and push. The draft pull request #4 then shows the change.
5. Run the three reviews that did not finish (accessibility, the fence and safety, code
   correctness), verify each finding, and fix what is small.
6. Do not merge into `main`. The owner says when.
