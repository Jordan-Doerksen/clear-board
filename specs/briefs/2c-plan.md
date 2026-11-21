# Wave 2c — the plan, the jobs and the shared contracts (the lead, 2026-11-21)

Wave 2c builds the access layer of the Yard, the Yard controls of the owner's picks (D-0038), the approved upgrade rows (D-0035), the tests and the cache budget, and the documents. The briefs of this wave are written by the lead from the checked research, to save cost; each job still gets an independent review. The base of each 2c-1 job is `49d3ba0`, the head of the Wave 2b branch.

## Jobs

| Step | Job | What | Files (short) |
|---|---|---|---|
| 2c-1 | Y4a | The Yard access layer, motion that stops, two Yard layout fixes | the Yard files |
| 2c-1 | U1-A | The rows of the Drill, Signals and Reference; the move of the Drill logic for U-44 | `Drill.tsx`, `Reference.tsx`, `Signal.tsx`, their sheets, `src/core/drill.ts` |
| 2c-1 | U1-B | The rows of the shell, the profile, Home and Settings; the overlay for "Look it up" | `App.tsx`, `main.tsx`, `AppContext.tsx`, `store.ts`, `types.ts`, `imperativeStation.ts`, Home, Settings, the shell sheets, `index.css`, the parts file, `index.html`, `vite.config.ts` |
| 2c-1 | U1-C | The rows of the Radio; the move of the Radio options for U-44 | `Radio.tsx`, `RadioTest.tsx`, `radio.css`, `radioSim.js` outside `STEPS`, `src/core/radio.ts` |
| 2c-2 | Y4b | The Yard controls of the owner's picks (R7-P2, P5, P8 to P12, P14, P16), `LEG-ROLE`, `ROUTE-WORDS`, `YARD-HEAD`, `LANDING`, rows U-04, U-16, U-23, U-36 (Yard part), U-39, and the Yard caller of `lookUp` | the Yard files |
| 2c-2 | U1-D | The callers of `lookUp` in the Drill and the Radio test (U-17); the notice of a failed load in the Drill, Reference and the Radio test (U-07) | `Drill.tsx`, `Reference.tsx`, `RadioTest.tsx` |
| 2c-2 | G1-2 | Row U-01 (a report check of the shared signal drawings), U-43 (the cache budget gate), U-44 (the tests of `src/core/drill.ts`, `src/core/radio.ts` and the signal drawing), a browser test that plays a Yard job to a win at 390 px, the word tape recorded again after U1-C, the package name `clear-board` and the version `2.0.0` (VERSION), and the closing step of the gates | `tools/**`, `tests/**`, `package.json`, the lock file |
| 2c-3 | G1-close | The last tightening of the gates after Wave 2c-2: a browser test that plays a Yard job to a win at 390 px by touch and at 1440 px by keyboard, the focus case of C7 as a gate case, the look config after Y4b and U1-D, the lint limit | `tools/**`, `tests/**` |
| 2c-3 | D1 | `SPEC.md`, `README.md`, `CHANGELOG.md`, the last pass of `ARCHITECTURE.md`, the places with a person's name (P-25) | the documents |

## Shared contracts

- **C1 `lookUp`.** U1-B adds `lookUp(itemId: string): void` to the app context and to the bridge object of the islands (`StationCtx`). It opens the Reference entry of the item in a dialog on top of the current route; the station stays mounted; closing the dialog returns focus to the control that opened it. In 2c-1 each caller keeps its route; in 2c-2, U1-D switches the Drill and the Radio test, and Y4b switches the Yard.
- **C2 `unmount`.** `imperativeStation.ts` (U1-B) calls `mod.unmount?.()` before it clears the host. `yardSim.js` (Y4a) exports `unmount()`.
- **C3 The words.** Each job writes the new learner-facing words it proposes in `specs/words/<job>.md`: the row, the place, the words of today, the proposed words. The owner approves the words of the rows marked "(words)" in one question at the end of the wave. A job writes no other new word.
- **C4 Reduce motion.** U1-B makes the setting follow the device flag live (U-13). The Yard (Y4a) reads `ctx.settings.reduce` at each move.
- **C5 Pictures.** `specs/pictures/2c-<job>/`, scale 1, at most 6000 px high (`PICTURES-CAP`).
- **C6 One name for one thing (U-40, proposed; the owner approves the words).** The way back to Home: "← Home". The word for a scored set of questions or calls: "session". The word for a join of two cars: "coupling" (Y4b, with U-23).
- **C7 Titles and headings (U-29, A11Y-22, A11Y-23).** U1-B: the shell sets `document.title` to the station name, then " — Clear Board", on each route (the station names of `Home.tsx`); it does not move focus at the first load; after a route change it moves focus to the first `h2` in `#view` (it gives that heading `tabindex="-1"`); `main` draws no outline. Each station shows one visible `h2` with its station name as the first heading in `#view`, in the form of the Reference title (`dusk-title`): U1-A for the Drill, Signals and Reference; U1-C for the Radio (one heading for both modes); Y4a for the Yard; U1-B for Home (Home can keep "Your path" as its first `h2`). A question heading under the station heading becomes an `h3`, with no change of its look.
- **C8 The Yard sound key (U-36, ENG-20).** The stored Yard sound choice keeps the key `sl_muted` of `yard/sound.js`. U1-B makes "Reset my progress" remove it. Y4a guards each read and write of it (U-07). Y4b stops the forced mute at mount (R7-P2).
- **C9 A failed load (U-07, ENG-02).** U1-B adds `contentFailed: string[]` (the names of the content files that did not load; empty when each loaded) and `retryContent(): void` to the app context, shows one notice with a retry control in the shell, and shows no "Coming soon" on Home for a domain whose file failed. U1-D uses the two names in the Drill, Reference and the Radio test, so that they show the notice and no false sentence.
- **C11 The learn card (U-28, `LEARN-GAP`).** U1-D draws a learn card before the first question about a new item. The card has `data-cb="learn"`, and its control `data-cb="learn-next"`. G1-2 makes each smoke case and look shot press `learn-next` while a learn card shows.
- **C10 Read aloud (U-31, A11Y-25).** U1-B changes the inside of `speak` (the confirmation, "No voice on this device", a stop on a change of route). U1-A (the Drill) and U1-C (the Radio test) also pass the options and the feedback to `speak` when Read aloud is on.

## Merge order

2c-1: U1-B first (it holds C1, C2, C7, C9 and C10), then U1-A, U1-C, Y4a. A merge conflict in a shared file is resolved by the lead, and the gates run again. 2c-2 starts after the 2c-1 merges. 2c-3 after 2c-2. The lead runs the gates after each merge.
