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

### 2.2 Rulings after the review of G1 (2026-11-21)

| Name | The ruling | The reason |
|---|---|---|
| `TOOLS` | Changed by the owner (D-0039): the gate tools can follow the owner's reskin tools. | The owner's answer. |
| `G1-LIB` | Accept `tools/lib/js-scan.mjs` and `tools/lib/css-scan.mjs`. They belong to G1, as each file of `tools/**`. | One scanner for three tools. |
| `TAPE-CASE` | At G1-close, the word tape of the guided Radio reads the words as the markup writes them (letter case from a style is off while it reads), as the look harness does after commit `b6ee6c4`. G1-close records the tape again from the build of `c2fb637` in that form. | A style that changes the letter case changes no word. B3 can change each style value of `radioSim.js` (`B3-LINE`). |
| `TARGETS-44` | When G1-close turns the report case "targets" into a gate, its floor is 44 px, not 43.5 px. | Fence rule 8. |
| `YARD-WRAP` | At G1-close, `yard-wrap` leaves the list `classesMayGo` of `tools/look/cb.config.json`. | The contract keeps `.yard-wrap` (B.2, B.6). A lost `.yard-wrap` must fail. |
| `LOOK-MODE` | A reskin job proves its look with `look.mjs compare --look --gate`: a pixel difference is listed and does not fail; a lost word, control or id, a smaller text and a sideways scroll fail. | A reskin changes pixels by design. |

### 2.3 Rulings on the open points of the Wave 2b briefs (2026-11-21)

The check of the five 2b briefs merged the open points into 18. The lead takes the recommended
option of each. A brief that says "open for the lead" for one of these names follows this table.

| Name | The ruling |
|---|---|
| `TEXT-READING` | Each reading text keeps its size of today. A label or a count takes its Dusk size only when that size is not smaller. One form in all five briefs. |
| `TEXT-CAP` | B2 and B3 cap each block of reading text at `--measure` under their scope class. Controls and containers keep the full width. |
| `PROMPT-HOOK` | At G1-close, the G1 line adds the hook `data-cb="prompt"` to contract B.6 and lets the smoke case read the hook or the class `.prompt`. B2 then puts the hook on the prompt body. |
| `B3-BACK` | B3 can swap the class `back` of the island's "← Home" (`radioSim.js:135`) for `cb-btn--plain`, in a commit of its own. No word changes. |
| `ISLAND-COMMENT` | Widened: B3 corrects the comment on lines 2 and 3 of `Radio.tsx` and the comment at `RadioTest.tsx:60-61`. Comments only. |
| `RULE-LINE-TONE` | The rule line of the Radio stays green (`--green-ink`). `TILE-TONE` names the domain tiles only. |
| `TILE-TONE` (the tone) | Teal for each live domain tile and for the path bar; grey for a domain that is not live. In Dusk, teal is information and never a state. |
| `FORM-KEEP` | Y2 selects the form when a job starts, from the width of the frame and the measured text over each state of the authored line and its routes, and keeps it for the job. If the learner's own moves reach a state that the kept wide form cannot draw with no defect, the drawing changes to the tall form one time and keeps it for the rest of the job. The lead tells the owner this case. |
| `LEG-ROLE` | `anim.js` maps the first and the last 600 ms step of a move to `--yard-run-in` and `--yard-run-out`. Each other step keeps its time. Y4 passes a role for each step in 2c. |
| `LANDING` | No landing place in 2b. Y2 adds the optional `builder` field of the paint call for Y4. |
| `ROUTE-WORDS`, `YARD-HEAD` | "Route: LEAD → …" and the head bar of the yard panel are not shown in 2b. Y4 shows them in 2c from the facts that `bodies.ts` exports. |
| `Y2-MERGE`, `Y3-MERGE` | No merge of the wave branch in 2b. Each job proves its lines on its own branch. The lead takes the Yard at 1440 and 1280 at the 2b merge check. |
| `TRACE-WORDS` | No legend line for the trace in 2b. The lead brings one line to the owner before the change reaches `main`. |
| `TEXT-FLOOR` | 12 px is the smallest size of each word of the Yard drawing and its legend (plan item P-04). |
| `TURN-MARK` | A coupler mark shows on both sides of a row turn that falls inside a coupled cut. |
| `YARD-SCOPE` | `.yard-wrap` comes first in each Yard selector. It meets the namespace check. |
| B1, section 7.5 | Each of the ten points is accepted as the brief writes it after its check: teal for `TILE-TONE`; a 180 px `apple-touch-icon.png` (the usual size; not verified); the emoji of today in the Dusk icon square, with no new glyph (the owner sees the squares at the look gate); a "control is smaller" line of the look compare is not a failure when the control stays 44 by 44 px or more, and the report lists each one with both sizes; a 6 px corner on a tile that is a button; `role="banner"` on the title bar and no name on the window section; `display: block` on `main#view`; the common `TEXT-READING` form; the letter case of today; the scope class names of the brief. |
| Y3, section 7.5 | Each of the seven points is accepted as the brief writes it. |
| The contract | Part H of `00-contracts.md` records these rulings and the D-0038 updates of B.3, B.5, C.2, D.4 and E.1. |

### 2.4 Rulings at the start of Wave 2b (2026-11-21)

| Name | The ruling | The reason |
|---|---|---|
| `2B-BASE` | Each 2b job starts from the head of the Wave 2a branch, `1590be5`. Its look baseline is built from that commit (`npm run look:baseline -- --ref 1590be5…`). Its compare runs in look mode (`--look --gate`). | Wave 2a is merged, checked and green at that commit. |
| `PICTURES-CAP` | A committed picture is at device scale factor 1. A picture taller than 6000 px is committed as its first 6000 px; the full picture stays in the uncommitted `.look/` folder. | The full Reference pages are about 20,000 px high and 2.5 MB each. The committed pictures are for the owner's look, and the top of a long page carries the look. |

### 2.5 Rulings at the merges of Wave 2b (2026-11-21)

| Name | The ruling | The reason |
|---|---|---|
| `PROMPT-SIGNAL` | The hook `data-cb="prompt-signal"` sits on the wrapper of the drawing inside the prompt body (`div.cb-drill-signal`). The hook `data-cb="prompt"` sits on the prompt body (`PROMPT-HOOK`). This corrects contract B.6. | One attribute cannot hold two values. |
| `OPTION-EDGE` | In Wave 2c, U1 gives the edge of an answer option (`cb-opt`, part G1 of the parts file) the token `--cb-edge`, so that the edge is 3 or more against its fill and its ground, for the Drill and the Radio test alike. | Today the edge is 2.1 in the default mode, the same as before the reskin. The part is shared by B2 and B3, so neither job changes it alone. |
| `LOOK-SMALLER` | A line "a control is smaller" of the look compare is accepted at a merge when the control stays 44 by 44 px or more (ruling 2.3). At the G1-close of Wave 2b, the G1 line makes such a line a warning in look mode, with the floor of 44 px in the tool. | The tool marks the line FAIL; the ruling already accepts it. |
| `SURFACE-COLUMN` | Reference, the Drill, Signals and both Radio modes sit in a centred column of at most `var(--maxw)` (920 px, the width of today) inside the full-width window. Inside that column, a box, a panel, a control and the Radio scene take the column width; a Dusk lede or note keeps its own cap at `--measure`. Home, Settings and the Yard keep the full window. Job B-COL builds it in Wave 2b. | The lead looked at the merged branch at 1440 px: with no column, the answer rows and "Look it up" run about 1,400 px wide and the Radio scene grows to 1,416 px, and boxed text in the Radio ends at another width than the scene. The owner's pick keeps the window full width for the Yard; reading surfaces read better at the width of today. The owner sees it at the look gate and can reverse it. |
| `TILE-CAP-SQUARE` | The domain tiles of Home lose the empty icon square of the cap. Job B-COL removes it. No glyph is drawn. | An empty dark square reads like an unchecked box (the review of B1). It carries no information. |
| `MAXW` | `--maxw` stays in the bridge: `SURFACE-COLUMN` reads it. U1 does not remove it. | It has a reader again. |
| `FORCED-COLOURS` | In Wave 2c, U1 adds one block `@media (forced-colors: active)` to the parts file that gives `cb-mark`, `cb-dialog`, `dusk-btn`, `dusk-tile`, `dusk-row` and `dusk-panel` a 1 px solid border with no colour value. | With forced colours the Dusk edges (box shadows) do not show, and the home mark draws nothing (the review of B1). |
| `FOCUS-OUTER` | The contrast of a focus ring is measured against the colour outside the ring. | A ring that sits on a glowing tile has two sides; the outer side meets WCAG. |
| `RADIO-LINE1` | In Wave 2c, U1 corrects the comment on line 1 of `radioSim.js` ("Ported VERBATIM"), which is no longer true for the style. A comment only. | The review of B3. |

## 3. Closed by the owner after Gate A

The owner answered the sheet of these 19 picks on 2026-11-21 with the words "yes to all
recommended" and "yes" (D-0038). Each row takes the option in the column "The answer". The text
"Until an answer" in a row is history. Where a row says that the SME confirms or checks words, that
check stays open and is in the final report.

| Name | The question | The answer (the recommended option) | Jobs that carry it |
|---|---|---|---|
| `TIER` | The page-law tier. | STRICT, with one written exception: the Yard drawing can show travel of equipment after a learner action. The tier line stays `Page law tier: STRICT`. | Y2, Y4 |
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
