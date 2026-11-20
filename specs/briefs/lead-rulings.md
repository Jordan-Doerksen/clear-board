# The lead's rulings for Wave 2

Written 2026-11-20, after the owner answered the four questions of Gate A
(`specs/gate-a-answers.md`). Each name is a row of Part E of `00-contracts.md`. A ruling here closes
that row. A ruling of the lead can be changed by the owner at any time.

A row that belongs to the owner and has no answer is in section 3. Until the owner answers, each job
keeps the behaviour of today for that row.

## 1. Closed by the owner's answers

| Name | The answer | Source |
|---|---|---|
| `UPGRADE-LIST` | Rows U-01 to U-46: yes. Rows U-47 to U-51: no. | Gate A, question 4 |
| `U-46` | Yes. The new Yard files `view`, `draw` and `access` are TypeScript, and `imperativeStation.ts` exports a named type for the bridge object. | Row U-46 |
| `U-45` | Yes. A raw colour can stay in the icon files and in the desktop window colour. S1 reads `--glass` from the Dusk token file at build time for the manifest and for the browser bar colour. If that design does not build, those two places can also keep a copied value, with a comment that names the token. | Row U-45 |
| `U-04` | The old "done" marks stay. | Row U-04 |
| `U-10` | The "new version is ready" control. | Row U-10 |
| `U-13` | Motion is reduced when the learner's choice is on or when the device asks for it, read live. | Row U-13 |
| `U-17` | The look-up opens on top of the station. | Row U-17 |
| `U-30` / `DYS-FONT` | Ship the font file only if its licence allows it. The job reads the licence file first and reports. If the licence is not clear, the label changes and no file ships. | Row U-30 |
| `U-42` | The tip link stays. | Row U-42 |
| `U-41` | An icon in a control is decoration for a screen reader. | Row U-41 |
| `AUDIT-FIX` | Not needed: row U-47 has a no. | Row U-47 |
| `TUNABLES` | Not needed: row U-50 has a no. | Row U-50 |

## 2. Ruled by the lead

| Name | The ruling | The reason |
|---|---|---|
| `FILES` | Accept each [P] of Part A of `00-contracts.md`, with the changes of this table. | Each file then has one owner in each wave. |
| `BRANCH` | One wave branch for each wave and one local branch for each job. The lead merges each job branch into the wave branch. One draft pull request for each wave, from the wave branch onto the branch of the wave before it. A build agent commits and does not push. The lead pushes. The wave branches are `claude/cb2-wave-2a`, `claude/cb2-wave-2b` and `claude/cb2-wave-2c`. If the session cannot push a branch with that name, each wave goes on the branch `claude/peaceful-mayer-qat99l`, and the lead tells the owner. | It keeps fence rule 9 and section 9 of the plan. |
| `Y1-STEPS` | (a) Two steps. Step 1 (the split) runs in parallel with G1 and S1. Step 2 (the style on bridge tokens) runs after G1 and S1 are on the wave branch. | The plan asks Y1 for a style file on bridge tokens. |
| `G1-STEPS` | Accept. G1 makes a closing commit at each wave merge, and G1-2 runs in Wave 2c. | `tools/**` and `package.json` keep one line of ownership. |
| `B3-LINE` | Widen. B3 can edit each colour and each style value in `radioSim.js`, in a style rule, in markup and in script. B3 changes no word. The `STEPS` wording stays frozen. | The raw-colour gate cannot reach zero without it. |
| `TOOLS` | (c) G1 writes small equivalents: a Dusk lock check, a raw-colour lint and a picture script. G1 can read the reskin tools to learn their rules. G1 copies no file and no block of code from them. | The tools repository is private and this repository is public. The owner has not said that the tools can be published. |
| `NODE` | `.nvmrc` holds `22.23.5`. The `engines` field asks for Node 22. No `engine-strict` now. `deploy.yml` moves to the same Node line in the same commit. The last step of `deploy.yml` stays as it is. | Each measurement was made on that version. The Node of the machine that makes the Windows build is not known. |
| `CSS-MARK` | (a) The mark is a change of look. The parts keep it. | Fence rule 5 asks for more than colour. Row U-06 adds the words. |
| `DYS-SPACING` | (a) One rule of S1 in the parts file. | Fence rule 7, and one writer for one rule. |
| `TAB-MARK` | Accept. | It is the same as today, and `aria-selected` carries the state. |
| `READ-ORDER` | Keep the DOM order of today. | A change of reading order is a change for a screen reader. |
| `REF-ROW-ICON` | The one-column row. | No new picture element on 219 rows. |
| `READOUT-CELLS` | One element, until Y3 shows the two forms in pictures. | The view function allows the two forms. |
| `SWITCH-BUTTONS` | (a) Y2 keeps a pointer path in 2b. Y4 adds the six buttons in 2c. Y2 leaves a place for each button in the view transform, so that Y4 moves a button and does not rebuild it. | The plan gives the controls to Y4. R2 found that a rebuilt control loses focus. |
| `MOTION-STOP-OWNER` | Y4. | The stop needs the controller, which is closed in 2b. |
| `SOUND-OWNER` | Y4. | The sound control is a Yard control. |
| `UNMOUNT` | Y4 adds the teardown call, in a commit of its own. | It ends a script error. It is a change of behaviour. |
| `2C-ORDER` | (a) The U1 rows that touch a Yard file start after Y4 is merged. | Each Yard file has one owner at a time. |
| `SWEEP` | U1 in 2c. | B1 cannot delete a shared rule before B2 and B3 are merged. |
| `DOCS-WRITER` | D1 only. The lead writes `DECISIONS.md` and `ARCHITECTURE.md` at each gate and at each wave merge. | Five jobs of one wave must not write one file. |
| `TAURI` | (a) `src-tauri/**` waits for a session that can make the Windows build. It goes on the list of section 7 of the plan. | Nothing here can prove the desktop build. |
| `ICON-PNG` | (b) B1 in 2b. | S1 replaces the SVG in 2a. |
| `ICON-SVG` | (c) Two files: `public/favicon.svg` holds the 16 px drawing and a new `public/icon.svg` holds the master, for the manifest. S1 owns the two files in 2a. | Each use gets the drawing that was made for it. |
| `PICTURES` | (a) Committed in the folder of the job, `specs/pictures/<wave>-<job>/`, at device scale factor 1. Full pages at 1440 and 390, and the Yard at 1280. | The plan asks for pictures attached. Scale 1 keeps the repository small. |
| `RED-IN-SIGNAL` | Recorded in `DECISIONS.md`: a red lamp in the frozen signal drawing is content. Fence rule 5 does not apply to it. | No file changes. |
| `DEV-DEP` | (a) `playwright` 1.63.0, exact, as a development package, added by additions only. | The plan asks for a browser test. A clean `npm ci` must be able to run it. |
| `TAPE-FORM` | (a) A SHA-256 and a word count. | The repository then holds no second copy of the call wording. |
| `LOOK-PAGES` | (a) The eight pages, `yard@w1280`, and three reading-mode pages. | Fence rule 7 needs a picture proof of each reading mode. |
| `LOOK-CI` | (a) A report that does not fail the run, in 2a. | The smoke test is the gate. |
| `LOOK-IDS` | (a) A key `idsMayGo` in the config of the picture script, with exactly the ids `yard-style` and `yard`. | G1 writes the picture script (`TOOLS` c). |
| `S1-PILLS` | (a) The seven pill corners stay in 2a and go in 2b with the Dusk parts. | The app keeps its shapes in S1. |
| `HORIZON` | (a) Keep it, if no text pair over it measures under 4.5 on the real build. S1 measures and reports. If a pair fails, S1 hides the horizon with one rule until B1 adds the window. | A text pair under 4.5 breaks fence rule 8. |
| `YARD-BLOCK` | `:root`. | A value on `:root` does not meet the old `--ink` of the Yard. |
| `S1-FLOOR-BLOCK` | (a) `body { padding: 0 }` joins the B1 list. The other rules stay until the sweep of U1. | B1 adds the window, and the padding rule must go in the same commit. |
| `Y1-TAPE` | (a) The recorder script stays in the scratch folder of Y1. The tapes and the summary are committed in `specs/pictures/2a-Y1/`. The report holds the script text. | No file of G1 gets a second writer. |
| `YD-LEGEND` | (a) `yd-rules-legend` for the rules legend of the chrome. | The picked sketch and Y2 keep their name. |
| `YD-BAR` | One class name is in one group only. The toolbar row of the chrome keeps `yd-bar`. Y2 names the room bar of the drawing with the prefix `yd-view-`. | A chrome rule must not reach an element of the drawing. |
| `YARD-BLOCK-2C` | Y4 owns the Yard block of the bridge file in 2c. | Y4 owns each Yard file in 2c. |
| `ISLAND-COMMENT` | (a) Y1 edits lines 1 to 4 of `imperativeStation.ts`. B3 edits line 2 of `Radio.tsx` in 2b. | Y1 corrects the same claim in `Yard.tsx`. |
| `ARCH-UPDATE` | (a) The lead at each wave merge, and D1 for the last pass. | The contract gives the file to the lead in 2a and 2b. |
| `ARCH-GATE` | (a) No new gate. | Each seam rule has a pass check in the Y1 brief. |

### 2.1 Defaults that the papers set, confirmed by the lead

The job that applied the rulings set a default where a ruling gave no name. The lead confirms each one.

| Item | Confirmed |
|---|---|
| Type names | `StationCtx` in `imperativeStation.ts`, `YardView` in `view.ts`, `YardDrawing` in `draw.ts`. |
| Tool names of G1 | `tools/dusk-lock-check.mjs`, `tools/colour-lint.mjs`, `tools/look/look.mjs`. The baseline keeps the name `tools/token-lint.baseline.json`. |
| The icon files and the colour lint | G1 gives the two icon files an allowed place in the lint now (row U-45). |
| Rows U-01 (the report of shared signal drawings), U-43 and U-44 | G1-2 builds them in Wave 2c. The fix of row U-01 in the Drill is U1 work in Wave 2c. |
| The tape of Y1 | The compact form is committed. Full tapes stay in the scratch folder. |
| Pictures of S1 | S1 also takes the Yard at 1280. |
| The two forms of `look:baseline`, the rules of the colour lint and of the lock check | As the check wrote them in the G1 brief (R6, R8, R25). |
| The items of contract E.5 | Each one stands as written. |
| A control that is 1 px smaller at the merge check of S1 | The lead rules when S1 reports it. |

## 3. Open: the owner rules

Each row keeps the behaviour of today until the owner answers. Wave 2a can start without each one.

| Name | The question | Recommended | Jobs that wait |
|---|---|---|---|
| `TIER` | The page-law tier. | STRICT, with one written exception: the Yard drawing can show travel of equipment after a learner action. Until an answer: `Page law tier: STRICT`, with no exception. | Y2, Y4 |
| `PAGE-WIDTH` | The page width. | One window that fills the browser. Text lines stay capped. | B1, Y3, Y2 |
| `TEXT-SIZE` | The size of reading text. | The app sizes stay for reading text. | B1, B2, B3, Y3 |
| `TILE-TONE` | The colour of a domain tile. | One tone for each live domain, grey for a domain that is not live. | B1 |
| `GOLD` | Gold for the lined route, the engine and the goal in the Yard drawing. | Yes. Dusk says gold is chrome and selection. | Y2 |
| `FORM-CHANGE` | Look C2: the rule for the change of form during a job. | The form is selected at the start of a job and kept for the job. | Y2 |
| `C2-WORDS` | The new words of look C2. | Approve as written. The SME confirms the terms. | Y2, Y4 |
| `VERSION` | The first version number. | `2.0.0` | D1, G1-2 |
| `R7-P2` | The Yard sound default. | Off, with its own switch that holds. | Y4 |
| `R7-P4` | The time of a travel leg. | 840 ms in and 420 ms out. | Y2 |
| `R7-P5` | The arrival. | On request only. | Y4, Y2 |
| `R7-P8` | The watched optimal line. | A stepper with Next, Back, "Play all" and Stop. | Y4 |
| `R7-P9` | The sound for secure, flag and certify. | One new sound. | Y4 |
| `R7-P10` | Replay controls. | The move log, with "Play again". | Y4 |
| `R7-P11` | Controls during motion. | A new input ends the running effect. | Y4 |
| `R7-P12` | The cost of a move in words. | Yes. The SME checks the words. | Y4 |
| `R7-P14` | After Depart. | The lead shows empty, and the job is closed until Reset. | Y4, Y2 |
| `R7-P15` | The trace of the last move. | Yes. | Y2 |
| `R7-P16` | The banner after a switch throw. | A throw clears a refusal that is no longer true. | Y4 |

## 4. Open: waits for the SME

Each one keeps the behaviour of today, with one exception: Y4 builds the text mirror of the Yard
from state words that the app has today, and the SME reads it before the change reaches `main`.
Each one is in the final report.

| Name | The question |
|---|---|
| `FLASH` | A flashing lamp with reduced motion on: does the flash stay, or does the lamp stop with a word, and which word. |
| `YELLOW-WORD` | The help text says "yellow" for a reverse switch. Is yellow a convention (plan fact T12, not verified). |
| `MIRROR-WORDS` | The wording of the text mirror of the Yard. The SME reads it before it ships. |
| `R7-P6` | Where the engine rests after a spot. |
| `R7-P7` | The picture of a kick. |
| `R7-P13` | The sound of a spot. |
