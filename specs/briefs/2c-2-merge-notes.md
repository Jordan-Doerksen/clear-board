# Wave 2c-2 — notes of the lead after the three merges (2026-11-21)

The three jobs of step 2c-2 are merged into `claude/cb2-wave-2c` in the order G1-2, U1-D, Y4b. After
them the lead added two commits: `2be82c4` (ruling `NOTE-INK`) and `c3bc4db` (rulings `WIN-HOLD` and
`FROM-NOW`). Each job had an independent review. This paper tells the jobs of step 2c-3 (the G1
close and D1) what changed. The rulings are in `lead-rulings.md`, sections 2.6 and 2.7.

## 1. The gates at the head of step 2c-2

| Gate | Result |
|---|---|
| Frozen files against `94a41c5` | 10 of 10 equal. The `STEPS` region of `radioSim.js` (40 lines, found by its markers) is equal. |
| `npm run check` | 12 of 12 steps pass. Step 12 lists the two shared signal drawings (row U-01) and does not fail. Lint: 1 warning (`AppContext.tsx`, `react(only-export-components)`), limit 2 (`LINT-ONE`). |
| `npm run build` | Green. The offline cache: 17 files, about 0.77 MB, 15 % of the budget of 5 MB (case 19). |
| `npm run test:browser` | 18 of 19 gate cases. Case 8 (the Yard, from Wave 2a) fails by design of row R7-P8: "▶ Watch optimal" now opens the stepper at "Step 0 of 4" with "Moves 0 / par 5 · Couplings 0"; "▶ Play all" (or Next four times) reaches "Moves 5 / par 5 · Couplings 2". The report case of C7 counts 0. |

## 2. What each job added that a later job reads

| Job | Names and hooks | Note |
|---|---|---|
| G1-2 | Step 12 of the check (`tools/shared-drawings.mjs`). Smoke cases 16 (update), 17 (failed load), 18 (storage refused), 19 (cache budget) and the report case of C7. `tools/lib/learn-card.mjs` (C11). The register `changes` in `tools/look/cb.config.json`, with a row for each allowed change. The look page `drill-learn`. Unit tests: 79. The package `clear-board` 2.0.0. | `LOOK-EXACT`, `UPDATE-FULL`, `LEARN-CASE` and `LOOK-CRASH` go to the G1 close. |
| U1-D | The learn card: `data-cb="learn"`, its control `data-cb="learn-next"`, the chip "New item", the pure function `withLearnCards` of `src/core/drill.ts`. `LibraryNotice` (in `src/components/LookUp.tsx`). One entry component for Reference and the look-up dialog. The app context recomputes the mastery on a change of route. | A first Drill session can hold up to 10 cards and 10 questions (`SESSION-LENGTH`). |
| Y4b | The stepper: `#yard-back`, `#yard-next`, `#yard-play`. The arrival control `#yard-arrival` ("▶ Show the arrival", on job p6-road only, at its start state). The move log `#yard-log-list` with `.yd-log-line`, "Before and after" and "Play again". The label of a past view `#yard-view-label`. The head bar `#yard-route`, `#yard-goal`. The readout says "Couplings". The sound key `sl_muted`: no key or "1" is off, "0" is on. | After Depart the lead is empty and a call is refused until Reset. |
| The lead | `.cb-shell-lookup .cb-reference-note` in `shell.css`. `view.setCarsNow()` and `carsNow()` of the Yard. The refusal of a done job goes to the region only. | Probe of the lead: 20 of 20 at 1440 and 390 on job p0-1. |

## 3. What the look compare now lists

Against `6d74633` (the head of step 2c-1), only the three Yard shots fail, each on words of Y4b:

- Gone: "Joints" (U-23, U-40). New: "Couplings".
- New: "Route:" and "LINE." (`ROUTE-WORDS`, `YARD-HEAD`; head bar and mirror).
- New: "✓", "done", "your", "job" (U-39: the key of the picker marks).
- New: the words of the first-job line (U-16).
- Page heights: 1622 → 1703 px (1440), 2697 → 2867 px (390), 1829 → 1910 px (1280).

The shot `drill-learn` holds the real learn card now; its baseline of `49d3ba0` shows a question.

## 4. Open items that go to step 2c-3

| Item | Job |
|---|---|
| Case 8 after Y4b; the Yard to a win at 390 by touch and at 1440 by keyboard; the C7 case as a gate case; the look register after 2c-2, exact and tied to its baseline (`LOOK-EXACT`); `UPDATE-FULL`; `LEARN-CASE`; `LOOK-CRASH`; the lint limit (`LINT-ONE`) | G1 close |
| The documents: `SPEC.md`, `README.md`, `CHANGELOG.md` (2.0.0), `ARCHITECTURE.md`, `DECISIONS.md` (from D-0040), the drift rows of R6 section 11, the names of R6 section 12 (P-25), P-27 item 7 | D1 |
| The words of each job (`specs/words/*.md`) | the owner, one question at the end of the wave |
| `NOTICE-TWICE`, `RETRY-RESTART`, `TAG-HOME`, `SESSION-LENGTH`, `P16-NIT`, `PICKER-CUT`, `WEAK-REVIEW` | the final report |
