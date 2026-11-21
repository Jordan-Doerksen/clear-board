# Wave 2c-1 — notes of the lead after the four merges (2026-11-21)

The four jobs of step 2c-1 are merged into `claude/cb2-wave-2c` in the order U1-A, U1-C, Y4a, U1-B.
The merge head is `6d74633`. Each job had an independent review. This paper tells the jobs of step
2c-2 what changed and what each gate must now expect. The rulings are in `lead-rulings.md`, section
2.6.

## 1. The gates at the merge head

| Gate | Result at `6d74633` |
|---|---|
| Frozen files against `94a41c5` | 10 of 10 equal. The `STEPS` region of `radioSim.js` (40 lines, found by its markers) is equal. |
| `npm run check` | 11 of 11 steps pass. Lint: 1 warning (`AppContext.tsx`, `react(only-export-components)`), limit 2. |
| `npm run build` | Green. Precache: 17 entries, 770.56 KiB (the two files of the dyslexia face are new). |
| `npm run test:browser` | 14 of 15. Case 6 (the word tape of the guided Radio) fails by design: row U-21 adds one line at each press and row U-35 removes one sentence at press 14. Job G1-2 records the tape again. |

New word counts of the tape, by press 0 to 14: 167, 209, 233, 237, 233, 250, 265, 281, 271, 267,
268, 332, 364, 371, 439.

## 2. The probe of the lead across the four jobs

Run on the build of `6d74633` at 1440 and 390 px. 19 of 23 lines pass.

- The first load moves no focus; the first Tab stop is "Skip to content".
- Six routes give six titles, in the form "Drill — Clear Board".
- After a change of route, focus is on the first `h2` of the view on `/reference`, `/radio`,
  `/yard` and `/`. **On `/drill` and `/signals` focus falls to the page body** (ruling `C7-DRILL`,
  job U1-D): the loading branch of the Drill draws the title first, and the session draws
  "← Home" first, so React replaces the heading.
- A leave of the Yard during a move gives 0 page errors (contract C2 works across U1-B and Y4a).
- 0 page errors over the whole walk.
- The device flag `prefers-reduced-motion: reduce` sets `data-reduce="1"` (row U-13).

## 3. What each job added that a later job reads

| Job | Names and hooks | Note |
|---|---|---|
| U1-A | `src/core/drill.ts`: `buildSession`, `sharedDrawings`, `distinctAspects`, `answerCounts`, `withRecomputedMastery` and more. The station heading `h2.cb-drill-title`. Status and alert regions `.dusk-sr` in the question view. | `sharedDrawings(content)` returns two drawings: the green dwarf lamp (sig.405 entry 2 of 4, sig.431 entry 3 of 5) and the red mast lamp (sig.437 entry 2 of 3, sig.439 entries 1 and 5 of 5). Row U-28 is not built (ruling `LEARN-GAP`). |
| U1-B | The app context: `contentFailed`, `retryContent`, `lookUp`, `lookUpRequest`, `closeLookUp`, `choices`, `deviceReduce`, `deviceContrast`, `replaceProgress`. `StationCtx.lookUp`. `src/components/LookUp.tsx` and `Entry.tsx`. The worker registers from `virtual:pwa-register/react` (prompt mode). | The element `vite-plugin-pwa:register-sw` is gone from each page (`LOOK-REGISTER`). The entry of the dialog is a copy of the entry of `49d3ba0` (`ENTRY-ONE`). |
| U1-C | `src/core/radio.ts`. The station heading `h2.cb-radio-title` "Radio walkthrough". The ids `cb-radio-tab-guided`, `cb-radio-tab-test`, `cb-radio-panel-guided`, `cb-radio-panel-test`, `cb-radio-verdict`, `scene`, `gapline`, `loghead`. | Both modes stay mounted; the hidden mode is `hidden`. |
| Y4a | Six switch buttons with `data-sw`, `aria-pressed` and the name "AS73 switch, lined reverse" (`SW-NAME` drops `aria-pressed` in Y4b). `#yard-mirror` (visually hidden), `#yard-live` (status). The question dialog `#yard-ask`, `#yard-ask-q`, `#yard-ask-yes`, `#yard-ask-no`. The station heading `h2.yd-title` "The Yard". `unmount()` of `yardSim.js`. | "← Home" of the Yard moved from the island into `Yard.tsx`. The three selects lost their `title`; each has a visible label. |

## 4. What the look compare now lists against `49d3ba0`

Each line below is a change that a row asks for. Job G1-2 records it in the look config.

- Every shot: the id `vite-plugin-pwa:register-sw` is gone (U-10).
- Home shots: the words and controls of U-11, U-24, U-25, U-26, U-27, U-33, U-35 and U-42.
- Settings shot: the words and controls of U-13, U-18 and U-31.
- `drill`, `signals`: the station headings "🎯 Drill" and "🚦 Signals" (U-29).
- `reference`: the old lede words go, and the lede, group, domain and mark words come (U-02, U-08,
  U-11, U-32); each of the 219 row controls has a new name (domain and mark before the words).
- `radio`: the readout line, for example "10 cars to the joint" (U-21), and the heading
  "📻 Radio walkthrough" (U-29). `radio-test`: the heading (U-29).
- `yard`: the heading "🚂 The Yard" (U-29); the labels "Pick a job", "Action", "Which track"; the
  button "🔇 Sound off" (U-20); the words of the hidden mirror (U-09, P-03: `LOOK-MIRROR`); the
  three selects named by a title are now named by a label.

## 5. Open items that go to step 2c-2

| Item | Job |
|---|---|
| `C7-DRILL`, `U26-NOTE`, `MASTERY-NOW`, `U44-GUARDS`, `RESET-COPY`, `TILE-BAR`, `ENTRY-ONE`, `BRIDGE-DEAD`, `LEARN-GAP` (U-28), U-06 and U-15 in the Radio test, U-07 and U-17 in the Drill, Reference and the Radio test, P-27 item 2, P-25 in `severity.ts` | U1-D |
| `SW-NAME`, `SOUND-STOP`, `CERTIFY-FOCUS`, `TRACK-MONO`, the sound read at each mount, and the rows of the brief | Y4b |
| The tape, `LOOK-REGISTER`, `LOOK-MIRROR`, the C7 focus case (report only), the learn-card helper (C11), and the rows of the brief | G1-2 |
