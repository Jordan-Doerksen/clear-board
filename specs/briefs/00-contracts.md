# 00 — The shared contracts for Wave 2

Clear Board 2. Written 2026-11-20 on branch `claude/peaceful-mayer-qat99l`. Paper only: this job
changed no code and no content.

The three Wave 2a briefs (G1, S1, Y1) are written from this document. Three build agents then work
in parallel and do not talk to each other. So each path and each name below is exact. A build agent
does not change a name of this document. A build agent that finds a name wrong stops and reports to
the lead.

## How to read this document

- **Checked** means: the statement has a file and a line, or a report and a section, and the writer
  of this document opened it. `R3 3.5` means section 3.5 of `specs/research/R3-dusk-mapping.md`.
  Only the checked text of a report is used. No withdrawn finding is used.
- **[P]** means: proposed, the lead rules. Each widening of a Files line of the plan has this mark.
  Until the lead rules, a [P] item is not part of a brief.
- **PENDING RULING `NAME`** means: the choice belongs to the owner or to the lead and has no answer
  in `specs/gate-a-answers.md`. Part E has one row for each name. Where a brief depends on a
  pending ruling, this document says what the job does until the ruling exists.
- **Not verified** means: no check was made. Part F lists each such statement.
- "The fence" is section 4 of `specs/clear-board-2-plan.md`. Each brief carries it in full.
- An upgrade row (`U-01` to `U-51` of `specs/research/upgrade-list.md`) is not approved. No brief
  carries a U-row. Work of section 3 of that file (`P-01` to `P-27`) is in the plan and a brief
  can carry it.

## The proposals of this document, in short

These differ from the plan text. The lead rules on each (PENDING RULING `FILES` and the rows named).

1. **Y1 has two steps.** Step 1 is the split and runs in parallel. Step 2 moves the Yard style to
   Dusk tokens and can be proved only when the wave branch holds S1, because S1 links Dusk
   (D.2, `Y1-STEPS`).
2. **Two seams keep the Yard controller closed in Wave 2b.** A drawing adapter (`draw.js`) for Y2
   and a view module (`view.js`) for Y3. Without them Y2 and Y3 both edit the controller (C.4).
3. **The parts file is closed in Wave 2b.** Each surface job gets its own sheet. S1 makes the empty
   sheets and the imports in 2a (C.2).
4. **Stable test hooks** (`data-cb`) let a 2b job change a class with no edit of a test file (B.6).
5. **G1 has a closing step at each wave merge**, and a second pass in 2c (A.2, `G1-STEPS`).
6. **No build job writes a root document.** Each job returns its change lines. D1 writes them
   (`DOCS-WRITER`).
7. **`src-tauri/**` waits.** No Wave 2 job writes it (`TAURI`).
8. **One fact of R6 is corrected here.** `--caution` is not a Dusk custom property (B.1, B.7).
9. **Added by the check of the briefs.** Each addition says so in its place. The Check record at
   the end of this file lists them. E.4 holds the rulings that the briefs, the ARCHITECTURE draft
   and the check added.

---

# Part A. The file ownership matrix

## A.1 The rules of the matrix

1. A file has one owner in one wave. A file can pass to another job in the next wave.
2. "—" means: no job writes the file in that wave. The file is closed. A job that needs a change
   reports to the lead.
3. A job writes only the files of its row. A new file that is not in the matrix needs the lead.
4. `package.json` and `package-lock.json` belong to the G1 line alone (fence rule 9).
5. A frozen file has no owner in any wave (fence rule 1).
6. The six files in `src/styles/dusk/` and `src/styles/dusk.lock.json` have no owner in any wave.
   The plan gives `src/styles/**` to S1. This contract takes these seven files out of that line.
7. Each job has its own picture folder `specs/pictures/<wave>-<job>/` (C.7). No other job writes it.

## A.2 The jobs

| Wave | Jobs of the plan | Added by this document |
|---|---|---|
| 2a | G1, S1, Y1 | **G1-close [P]**: one tightening commit by the G1 line on the wave branch, after S1 and Y1 are merged (D.3). |
| 2b | B1, B2, B3, Y2, Y3 | **G1-close [P]** at the 2b merge. No parallel job writes `tools/**`, `tests/**` or `package.json` in 2b. |
| 2c | Y4, U1, D1 | **G1-2 [P]**: a second pass of the G1 line, in parallel. The plan already sends the name fields of D1 "through G1". **U1 includes the legacy sweep [P]** (C.2). **U1 rows that touch a Yard file start after Y4 is merged [P]** (`2C-ORDER`). |

## A.3 The matrix

### A.3.1 Root and configuration

| Path | 2a | 2b | 2c | Note |
|---|---|---|---|---|
| `package.json`, `package-lock.json` | G1 | G1-close only | G1-2 | Fence rule 9. D1 passes the name and the version to G1-2 (P-24). |
| `.github/workflows/check.yml` (new) | G1 | — | G1-2 | R6 5.9. |
| `.github/workflows/deploy.yml` | G1, line 26 only | — | — | Line 26 is `node-version: 20` (checked). It moves in the commit that adds the unit tests to `npm run check` (R6 ENG-05). No other line changes (fence rule 12). |
| `.nvmrc` (new) [P] | G1 | — | — | R6 ENG-05. |
| `.npmrc` (new) [P] | G1, only after ruling `NODE` | — | G1-2 | `engine-strict` can stop the Windows build machine (R6 ENG-05, Fence line). |
| `.oxlintrc.json` [P] | G1 | G1-close | G1-2 | R6 5.4: `ignorePatterns` for the five frozen source files and the vendored tools. |
| `tsconfig.json`, `tsconfig.tests.json` (new) [P] | G1 | — | G1-2 | R6 5.4. |
| `tsconfig.app.json`, `tsconfig.node.json` | — | — | — | No finding needs a change. If a gate needs one, G1 asks the lead. |
| `.gitignore` [P] | G1 | — | G1-2 | G1 adds the look output folder `.look/` (C.7). |
| `.gitattributes` | — | — | — | Line 9 is a base of the hash gate (R6 5.1). |
| `vite.config.ts` | S1 | B1 [P], the icon entries only | U1 | Plan line for S1. 2c: only rows with words or the service worker (U-10, U-25). |
| `index.html` | S1 | B1 [P], the icon links only | U1 | Plan line for S1. |
| `public/favicon.svg` [P] | S1 (replace) | B1 [P] | — | Gate A, question 3. The present file leaves the app. |
| `public/icons.svg` [P] | S1 (delete) | — | — | Dead, shipped and cached (R6 ENG-12, P-16). |
| `public/icon-192.png`, `public/icon-512.png`, `public/apple-touch-icon.png` (new) [P] | S1 if `ICON-PNG` is ruled before 2a starts, else — | B1 | — | P-26, R6 ENG-15. Names set by this contract. |
| `public/data/*.json` | frozen | frozen | frozen | |
| `src-tauri/**` | — | — | — | It waits: `TAURI`. See A.4. |
| `dist/`, `.gate/`, `.look/`, `node_modules/` | not committed | | | `.gitignore` lists `dist` and `.gate` today (checked). |

### A.3.2 Styles

| Path | 2a | 2b | 2c | Note |
|---|---|---|---|---|
| `src/styles/dusk/*.css` (6), `src/styles/dusk.lock.json` | never | never | never | The locked copy. |
| `src/styles/clear-board.tokens.css` (new) | S1 | Y2 [P], the Yard block only (B.5) | U1 [P], not the Yard block. The Yard block has no owner in 2c in this row: PENDING RULING `YARD-BLOCK-2C` (E.4; recommended: Y4). | The bridge. The only file with a raw colour outside the frozen files (fence rule 4). |
| `src/styles/clear-board.parts.css` (new) | S1 | — (closed, C.2) | U1 [P] | All `cb-` parts of R3 section 4. |
| `src/styles/surfaces/shell.css`, `home.css`, `settings.css` (new) | S1 makes each with one header comment | B1 | U1 | C.2. |
| `src/styles/surfaces/reference.css`, `drill.css` (new) | S1, as above | B2 | U1 | |
| `src/styles/surfaces/radio.css` (new) | S1, as above | B3 | U1 | |
| `src/index.css` | S1 | B1, rules of the B1 list only (C.2) | U1 [P], the legacy sweep | The app sheet. |
| `src/App.css` | S1 (delete) | | | Dead (T5). |
| `src/assets/hero.png`, `react.svg`, `vite.svg` | S1 (delete) | | | Dead (T5). A font file of U-30 is not in this row: it waits for the owner's yes. |
| `specs/harness/parts.html` (new) [P] | S1 | — | U1 | A static page that shows each `cb-` part in each state. S1 proves the parts with it before 2b uses them. |

### A.3.3 The shell and the React stations

| Path | 2a | 2b | 2c | Note |
|---|---|---|---|---|
| `src/main.tsx` | S1 | — | U1 | S1 writes all style imports in 2a (C.1). No 2b job needs this file. |
| `src/App.tsx`, `src/stations/Home.tsx`, `src/stations/Settings.tsx` | — | B1 | U1 | Plan. |
| `src/stations/Reference.tsx`, `Drill.tsx`, `Signal.tsx` | — | B2 | U1 | Plan. `Signal.tsx` gets a wrapper class only; `src/core/signal.ts` is frozen. |
| `src/stations/Radio.tsx`, `RadioTest.tsx` | — | B3 | U1 | Plan. |
| `src/stations/Yard.tsx` [P] | Y1, the comment on lines 1 to 3 only | — | Y4 | The comment says that `yardSim.js` is kept byte for byte. After Y1 that is false. Line 7 (the import) and line 8 (the class `yard-host`) do not change (C.4). |
| `src/stations/imperativeStation.ts` [P] | Y1, only if U-46 gets a yes (the named type) | — | Y4 | See A.4. |

### A.3.4 The Yard

| Path | 2a | 2b | 2c | Note |
|---|---|---|---|---|
| `src/stations/yardSim.js` | Y1 | — (closed, C.4) | Y4 | The controller. It stays at this path. |
| `src/stations/yard/view.js` (new) | Y1 | Y3 | Y4 | The view. `.ts` if U-46 gets a yes (`U-46`). |
| `src/stations/yard/yard.css` (new) | Y1 | Y3 | Y4 | The chrome style. |
| `src/stations/yard/draw.js` (new) | Y1 | Y2 | Y4 | The drawing adapter. `.ts` if U-46 gets a yes. |
| `src/stations/yard/drawing/drawing.css` (new) | Y1 (the one canvas rule) | Y2 | Y4 | The drawing style. |
| `src/stations/yard/drawing/layout.js`, `bodies.js`, `svg.js` (new) | — | Y2 | Y4 | C.5. Y2 can add a file in this folder only. |
| `src/stations/yard/render.js` | — | Y2 (rewrite or delete) | Y4 | 22 raw colours today (R3 1). Y1 does not touch it. |
| `src/stations/yard/anim.js` | — | Y2 | Y4 | The three exports keep their signatures in 2b (C.4). |
| `src/stations/yard/sound.js` [P] | — | — | Y4 | See A.4. |
| `src/stations/yard/access.js` (new) | — | — | Y4 | The "one new file" of the plan. |
| `src/stations/yard/model.js`, `solver.js`, `puzzles.js`, `geometry.js` | frozen | frozen | frozen | |

In 2c a U1 row that touches a file of this table starts after Y4 is merged (`2C-ORDER`).

### A.3.5 The Radio island

| Path | 2a | 2b | 2c | Note |
|---|---|---|---|---|
| `src/stations/radioSim.js`, lines 84 to 123 (`STEPS`) | frozen | frozen | frozen | The hash gate proves it (R6 5.1). |
| `src/stations/radioSim.js`, all other lines | — | B3 [P, the wider line] | U1 | Plan: "style rules only". Proposed line: the style rules (lines 5 to 33), the colour attributes of the markup (lines 35 to 79), line 145, and the comment on line 3. No word changes (fence rule 3). The word tape proves it. See A.4. |

### A.3.6 Core and state

| Path | 2a | 2b | 2c | Note |
|---|---|---|---|---|
| `src/core/signal.ts` | frozen | frozen | frozen | |
| `src/core/sr.ts`, `store.ts`, `severity.ts`, `types.ts` [P] | — | — | U1 | The unit tests of G1 read these files and never write them. G1 uses a resolve hook, not an edit of `store.ts:3` (R6 6.3). |
| `src/state/AppContext.tsx` [P] | — | — | U1 | No 2a or 2b work needs it (B.3). |

### A.3.7 Tools and tests

| Path | 2a | 2b | 2c | Note |
|---|---|---|---|---|
| `tools/**` (C.6 lists the files) | G1 | G1-close | G1-2 | |
| `tools/token-lint.baseline.json` (new) | G1 | G1-close | G1-2 | A build job does not edit it. A file passes when it is not worse than the baseline (`token-lint.mjs:249`, checked). |
| `tests/**` (C.6 lists the files) | G1 | G1-close | G1-2 | A 2b job does not edit a test. B.6 makes that possible. |

### A.3.8 Documents and specs

| Path | 2a | 2b | 2c | Note |
|---|---|---|---|---|
| `DECISIONS.md`, `ARCHITECTURE.md` (new) | the lead | the lead | D1 | The plan gives the Gate A entries, `ARCHITECTURE.md` and the tier line to the lead, before Wave 2. |
| `SPEC.md`, `README.md`, `CHANGELOG.md`, `GAP-REVIEW.md`, `REVAMP-DESIGN.md`, `REVAMP-APPENDIX.md` | — | — | D1 | Each build job returns its change lines in its report. D1 writes them (`DOCS-WRITER`). |
| `LICENSE` | — | — | — | The licence keeps its holder (R6 ENG-17). |
| `specs/briefs/**`, `specs/clear-board-2-plan.md`, `specs/gate-a-answers.md` | the lead | the lead | the lead | |
| `specs/research/**` | — | — | — | Wave 1 is closed. |
| `specs/pictures/<wave>-<job>/` (new) | the job of the folder | the job of the folder | the job of the folder | C.7. |

## A.4 Files that the research found with no owner

| File | Found by | Proposed owner | Reason |
|---|---|---|---|
| `src/stations/radioSim.js`, the 29 raw colours outside the style rules (27 on lines 45 to 66, 2 on line 145) | R3 2.6, trap 9.12, 16 item 4; R6 ENG-09; upgrade list 7.3 | B3, 2b | The file is B3's in the plan. Without the wider line the raw-colour gate cannot reach zero. `STEPS` stays frozen. The lines also hold words, so G1 records the word tape in 2a, before B3 starts (R6 16 item 12). |
| The inline `opacity: .45`, `yardSim.js:538` | R3 Check G6, 16 item 5 | Y1 moves it into the view in 2a as one view call. Y3 removes the opacity in 2b. | The line is controller code today. After the move it is in a file that Y3 owns. No ruling on a third job is needed. |
| `src-tauri/tauri.conf.json:24` (the window colour `#0e1116`) | R3 3.7, 16 item 3; R6 ENG-09 | None. It waits (`TAURI`). | The Windows build does not run here (plan section 7). The raw-colour lint does not read JSON (R6 ENG-09), so no gate fails. The value differs from `--glass` (`#0a0810`) until a session that can make the Windows build changes it. |
| `src-tauri/**`, all other items (the version, the crate name, the author line, the repository line, the port) | R6 ENG-11, ENG-13, 16 item 7; U-51 | None. It waits (`TAURI`). | Same reason. The recommended answer of U-51 is "no" for this reason. |
| `src-tauri/icons/*` (16 files, the default mark) | Gate A question 3; R6 9.1 | None. It waits (`TAURI`). | The set cannot be proved here. |
| `public/favicon.svg`, `public/icons.svg` | R3 3.7, 16 item 3; R6 ENG-12 | S1, 2a | S1 owns `vite.config.ts` and `index.html`, which name the two files (`vite.config.ts:17`, `:38`; `index.html:6`). One job must change the file and its entry. |
| `src/stations/imperativeStation.ts` | R6 ENG-13, ENG-14, 16 item 7 | Y1 in 2a, only for the named type of U-46. Y4 in 2c. | The Yard controller is the larger reader of the bridge object. The lint warning on line 34 is an excuse line: Y4 writes it in 2c. Until then the lint step holds a limit (B.4). |
| `src/stations/yard/sound.js` | R7 11.2 rule 9, 14; R6 16 item 7 | Y4, 2c | Each change of the sound is a change of behaviour of a Yard control: the default (R6 ENG-20 item 3), the storage guard (R7 14), the key name. No reskin job can make it. The picks R7-P2, R7-P9 and R7-P13 are open. |
| `src/core/store.ts`, `src/core/types.ts`, `src/state/AppContext.tsx` | R6 ENG-12, ENG-20, ENG-21, 16 item 7 | U1, 2c | Each fix there is a U-row (U-05, U-13, U-15, U-34) or a small defect (P-27 item 2: the repeated key at `AppContext.tsx:131`). U1 carries P-27 item 2 with the sweep [P]. |
| `.nvmrc`, `.npmrc`, `.oxlintrc.json`, `tsconfig.json`, `tsconfig.tests.json`, `.gitignore` | R6 ENG-05, ENG-14, 5.4, 16 item 6 | G1 | Each one is a part of a gate that G1 builds. `.gitignore` is added by this document, for the look output. |
| `yard/anim.js`, "motion that stops" | R2 9 (Y2 item 9); R7 8; P-01 | Y2 owns the file in 2b. Y4 builds "motion that stops" in 2c (`MOTION-STOP-OWNER`). | The stop needs the controller: the controller passes only a speed factor today (`yardSim.js:229`). The controller is closed in 2b and is Y4's in 2c. |
| Six code and configuration places with a name or an account (P-25; R6 12) | R6 ENG-17 | `vite.config.ts:6`: S1, 2a. `radioSim.js:3`: B3, 2b. `src/core/severity.ts:3`: U1, 2c. `Home.tsx:68`: no job; the address is a working link and is row U-42. `src-tauri/Cargo.toml:5` and `:7`: wait (`TAURI`). | The owner of the file in the wave makes the edit. D1 gives the wording rule: the name goes, the meaning stays. |
| `tools/sr-vectors.mjs:15`, `tools/content-check.mjs:37-39` and `:64` (P-27 items 5 and 6) | R6 ENG-20 | G1, 2a | `tools/**` is G1's. |
| `CHANGELOG.md:15`, `DECISIONS.md:444` (P-27 item 7) | R6 ENG-20 | D1, 2c | Documents. |
| The new icon: `public/` and the manifest entry | Gate A question 3 | S1 in 2a for the SVG. S1 or B1 for the PNG set (`ICON-PNG`). | P-26 names S1. |

## A.5 Each widening of a plan Files line

Each widening is [P]. A narrowing of a plan line is not a widening and needs no ruling.

- **G1:** `.nvmrc`, `.npmrc`, `.oxlintrc.json`, `tsconfig.json`, `tsconfig.tests.json`, `.gitignore`.
  A narrowing, no ruling needed: in `.github/workflows/` the plan gives G1 each file; this
  contract gives it `check.yml` (new) and line 26 of `deploy.yml` only.
- **S1:** `public/favicon.svg`, `public/icons.svg`, the three PNG files, `specs/harness/parts.html`.
  Inside the plan line `src/styles/**` and so not a widening: the bridge file, the parts file and
  the six sheets `src/styles/surfaces/*.css`. A narrowing, no ruling needed: `src/styles/dusk/**`
  and `dusk.lock.json` are taken out of the line.
- **Y1:** `src/stations/yard/drawing/drawing.css`, the comment of `src/stations/Yard.tsx`,
  `src/stations/imperativeStation.ts` (with U-46 only).
- **B1:** `src/index.css` (the B1 list of C.2), `vite.config.ts` and `index.html` (the icon only).
- **B3:** the wider line for `radioSim.js`.
- **Y2:** `src/stations/yard/draw.js`, the Yard block of the bridge file.
- **U1:** the legacy sweep; `src/core/**` and `src/state/AppContext.tsx` for its rows.
- **Y4:** `sound.js`, `imperativeStation.ts`, `Yard.tsx`, and all Yard files of A.3.4.

---

# Part B. The names

## B.1 The bridge file `src/styles/clear-board.tokens.css`

S1 writes it from the checked text of R3 section 3, not from the first draft in the R3 scratch
folder (R3 Check 14.1). It has six blocks, in this order.

**Block 1, `:root`, the old shell names.** The app sheet reads them until the sweep in 2c.

| Name | Value | Source |
|---|---|---|
| `--bg` | `var(--glass)` | R3 3.1 |
| `--surface` | `var(--panel-hi)` | R3 3.1 |
| `--surface-2` | `var(--head)` | R3 3.1 |
| `--line` | `var(--lit-rule)` | R3 3.1 |
| `--muted` | `var(--ink-2)` | R3 3.1 |
| `--clear` | `var(--green-ink)` | R3 3.1 |
| `--caution` | `var(--amber-ink)` | R3 3.1 |
| `--stop` | `var(--red-ink)` | R3 3.1 |
| `--r` | `var(--r-tile)` | R3 3.1 |
| `--space` | `var(--lh-base)` | R3 3.1 |
| `--font` | `var(--font-ui)` | R3 3.1 |
| `--maxw` | `920px` | Kept in 2a, so that the app keeps its shape. PENDING RULING `PAGE-WIDTH`. |
| `--fs` | `16px` | `AppContext.tsx:60` writes it on the `html` element (checked). |

**Not declared:** `--ink` and `--focus`. They are Dusk names with the same meaning. S1 deletes
lines 2 to 10 of `src/index.css`: the `:root` block, the dyslexia rule and the high-contrast rule.
R3 3.5 (the load-order rule) names lines 3 to 5 and line 10. Lines 6, 7 and 9 must go also: the app
sheet loads after the bridge (C.1), so a leftover `--r`, `--space` or `--font` on `:root` of the
app sheet beats block 1 (same selector, later sheet; `src/index.css:6-7`, `:9`, checked).

**Block 2, `:root`, Dusk names that the bridge declares again on purpose** (R3 5.3):
`--fs-xs: .6875rem`, `--fs-s: .75rem`, `--fs-data: .8125rem`, `--fs-base: .875rem`,
`--fs-l: .9375rem`, `--fs-title: 1.25rem`, `--fs-num: 1.6875rem`, and `--lh-base: 1.5` (R3 3.1).

**Block 3, `:root`, new app names** (R3 3.4):

| Name | Value |
|---|---|
| `--cb-link` | `var(--lit)` |
| `--cb-edge` | `var(--lit-line)` |
| `--cb-ok-ink` | `var(--green-ink)` |
| `--cb-caution-ink` | `var(--amber-ink)` |
| `--cb-attn-ink` | `var(--red-ink)` |
| `--cb-info-ink` | `var(--teal-ink)` |
| `--cb-target` | `44px` |
| `--cb-scrim` | `color-mix(in srgb, var(--ground-0) 72%, transparent)` |

The first draft in the R3 scratch folder also holds `--cb-cat-rule`. The report tables do not. It
is not in this contract.

**Block 4, `html[data-dys="1"]`** (R3 5.1): `--font-ui: "Atkinson Hyperlegible", "Comic Sans MS",
Verdana, sans-serif` (the stack of `src/index.css:9`, unchanged), `--font-mono: var(--font-ui)`,
`--lh-base: 1.8`, `--track-label: .03em`, and the two declarations `letter-spacing: .02em;
word-spacing: .08em`.

**Block 5, `html[data-contrast="1"]`** (R3 5.2): `--ink: var(--on-tile)`, `--ink-3: var(--ink-2)`,
`--hair: var(--hair-2)`, `--lit-rule: var(--lit-line)`, `--cb-edge: var(--lit)`, the four
`--cb-*-ink` names set to `var(--ink)`, and `--tile-<tone>-hi: var(--tile-<tone>-lo)` for the
eight tones red, amber, green, down, teal, blue, violet, grey.

**Block 6, the Yard block.** It starts with the comment `/* yard:start */` and ends with
`/* yard:end */`. B.5 gives its names. The selector is `:root` [P], as in the picked sketch
(`look-model2.src.html:15`, checked): PENDING RULING `YARD-BLOCK` (E.4).

**No island block.** The first R3 draft maps the old Yard and Radio names inside the bridge. This
contract does not. Y1 (step 2) and B3 delete the old island names and write the Dusk token in
their place, from the tables of R3 3.2 and 3.3. A style sheet of the app can read a Dusk token
directly: the `cb-` parts do that (R3 section 4).

**The rules that keep a name from a collision.**

1. Only the bridge file declares a custom property that the six Dusk files declare. It declares
   only the names of blocks 2, 4 and 5. The rule has no exception for a part: a rule of the parts
   file or of a surface sheet does not set a Dusk name on one element. Example: R3 G19 sets
   `--led-size` on the home mark. `--led-size` is a Dusk name (`dusk.tokens.css:377`, checked), so
   S1 sets the `width` and the `height` of the lamp under `.cb-mark` in its place.
2. Each new custom property of the app has the prefix `--cb-` or `--yard-`. This is true for a
   name that only one rule uses also.
3. No new rule reads one of the eleven old names of block 1 (`--bg` to `--font`). Only
   `src/index.css` reads them. They go with the sweep in 2c. `--fs` and, until `PAGE-WIDTH` is
   ruled, `--maxw` stay.
4. No app file declares `--lanes`. It is the one name that a Dusk rule reads and Dusk does not
   declare (`dusk.process.css:96`, checked).
5. The gate step `check:names` (B.4) proves rules 1, 2 and 4 on each run.

## B.2 Classes

| Prefix or class | Meaning | Who writes the rule | Where it sits |
|---|---|---|---|
| `dusk-*`, `is-in` | Dusk only (Dusk D-009). 151 classes and `is-in` (checked by script). | Nobody in this repository | The locked copy |
| `cb-app` | The app root. Each rule that names a Dusk class has `.cb-app` in front (R3 A4, G20). | S1 | On `<body>`, `index.html:12`. S1 writes the attribute. The Settings dialog is inside `body`, so the class covers it (R3 Check 2.3.4). |
| `cb-win` | The app window. Rule `.cb-win > .dusk-main { grid-column: 1 / -1 }` (R3 trap 9.3). | S1 writes the rule. B1 puts the class on. | On `section.dusk-win`, in place of `div.wrap` (`App.tsx:29`). |
| `cb-<part>` | A page-local part of the gap register. The fixed list is below. | S1, in `clear-board.parts.css` | The surface jobs put the classes on. |
| `cb-shell-*`, `cb-home-*`, `cb-settings-*` | A rule that only one B1 surface needs. | B1, in its three sheets | |
| `cb-reference-*`, `cb-drill-*` | The same for B2. | B2, in its two sheets | |
| `cb-radio-*` | The same for B3. | B3, in `surfaces/radio.css` | |
| `yard-wrap`, `yard-host` | The Yard scope (`yardSim.js:143`) and the React host (`Yard.tsx:8`). They stay. | — | Each selector of each Yard sheet starts with `.yard-wrap` (R3 8.1). |
| `radio-wrap`, `radio-host` | The Radio scope (`radioSim.js:36`) and the React host (`Radio.tsx:13`). They stay. | — | |
| `yd-*` | Each Yard class. One prefix. It is the prefix of the picked sketch (`look-model2.src.html`; R1 6.3, common rule 6). | Y1, then Y3: the chrome. Y2: the drawing. | Split below. |

**The split of `yd-`.** Y2 owns `yd-view`, `yd-legend` and each class that starts with `yd-view-`
or `yd-legend-`, and each class it uses under the two roots `.yd-view` (the picture) and
`.yd-legend` (the legend of the drawing). Each selector of `drawing/drawing.css` starts with
`.yard-wrap .yd-view` or `.yard-wrap .yd-legend`. Y3 never names these two roots or a class under
them. Each other `yd-` class is the chrome and is Y1's, then Y3's.

**The Yard classes in step 1 of Y1.** The new class is `yd-` and the old class, for each class of
the Yard markup and style (`yardSim.js:42-211`): for example `bar` becomes `yd-bar`, `back`
becomes `yd-back`, `banner` becomes `yd-banner`. The ids keep their names (B.6). This ends the
collisions `.bar` and `.back` between the shell and the Yard (R3 trap 9.14; R6 ENG-08).

Three points that the prefix rule and the split do not settle alone (found by the Y1 brief and by
the check of the briefs):

1. `legend` (the rules legend of the chrome, `yardSim.js:176`) does not become `yd-legend`: that
   name is a root of Y2. Y1 writes `yd-rules-legend`, the name of the picked sketch for this part
   (`look-model2.src.html:207`, `:286`, checked) [P]. PENDING RULING `YD-LEGEND` (E.4).
2. In 2a the canvas has the class `yd-view`: `<canvas id="yard" class="yd-view">`. Then the one
   canvas rule of `drawing/drawing.css` has the selector `.yard-wrap .yd-view`, and both the rule
   of C.4 (the canvas rule is in `drawing.css`) and the rule above (each selector of that file
   starts with `.yard-wrap .yd-view` or `.yard-wrap .yd-legend`) hold. Y1 writes the class. Y2
   owns it from 2b.
3. A class name is in one group only: the chrome or the drawing [P]. The sketch uses `yd-bar`
   inside the drawing for the room bar of a track (`look-model2.src.html:179`, checked). After Y1,
   `yd-bar` is a chrome class (the two toolbar rows, with the selector `.yard-wrap > .yd-bar`). Y2
   gives the room bar a name that starts with `yd-view-`. The lead puts this in the brief of Y2.

**State.** A new Yard or app file writes no bare `is-` class. A state is a `data-` attribute or an
ARIA attribute. The sketch uses `is-empty` and `is-loaded`: Y2 writes `data-load="empty"` and
`data-load="loaded"`.

**The fixed `cb-` part classes** (R3 section 4, the checked text; S1 writes each one):

| Gap | Classes | First users |
|---|---|---|
| G1 | `cb-opts`, `cb-opt`, `cb-opt--right`, `cb-opt--wrong` | B2, B3 |
| G2 | no class: the rule `.cb-app .dusk-bar` | B1 |
| G3 | `cb-dialog`, `cb-setrow` | B1 |
| G4 | `cb-toggle` | B1 |
| G5 | `cb-input` | B2 |
| G6 | `cb-select` | Y3 |
| G7 | no class: the reset inside `:where(.cb-app button.dusk-tile, .cb-app button.dusk-row)` | B1, B2 |
| G8 | `cb-signal` | B2 |
| G9 | `cb-banner`, `cb-banner--ok`, `cb-banner--bad`, `cb-banner--win` | Y3 |
| G10 | `cb-tabs`, `cb-tab` | B3 |
| G11 | `cb-btn--plain`, `cb-link` | B2, B3, Y3 |
| G12 | `cb-btn--attn` | B1 |
| G13 | `cb-chip`, `cb-chip--ok`, `cb-chip--caution`, `cb-chip--info` | B2, B3 |
| G14 | `cb-result`, `cb-result--ok`, `cb-result--no` | B2, B3 |
| G15 | `cb-disclosure`, `cb-quote` | B2, Y3 |
| G16 | `cb-tx`, `cb-tx--eng`, `cb-who`, `cb-call` | B3 |
| G17 | `cb-prose`, `cb-prose--lead`, `cb-sub` | all |
| G18 | `cb-code` | Y3 |
| G19 | `cb-mark` | B1 |
| G20 | no class: the 44 px floor, three selectors with `.cb-app` in front | all |

The `✔` and `✕` marks of G1, G9 and G14 wait for PENDING RULING `CSS-MARK`. S1 writes the mark
rules in one block of the parts file, so that one deletion removes them.

## B.3 Attributes on the `html` element, and one class on `body`

| Attribute | Values | Who sets it | Who reads it |
|---|---|---|---|
| `lang` | `en` | `index.html:2`, static | — |
| `data-dys` | `"1"`, `"0"` | `AppContext.tsx:57`, at run time | Block 4 of the bridge |
| `data-contrast` | `"1"`, `"0"` | `AppContext.tsx:58` | Block 5 of the bridge |
| `data-reduce` | `"1"`, `"0"` | `AppContext.tsx:59` | The three rules of R3 5.4, which S1 writes in the parts file (P-14) |
| `style="--fs: …"` | `16px`, `18.5px` | `AppContext.tsx:60` | `html { font-size: var(--fs) }`, `src/index.css:14` |
| `data-tier` | `"strict"` | S1, static, in `index.html` | `dusk.motion.css`. PENDING RULING `TIER`: both recommended options are STRICT. With OPEN the value is `"open"`. |
| `data-ambient` | not set | — | Set only if `TIER` is OPEN: then `"off"` (R3 5.4). |
| `class="cb-app"` on `body` | — | S1, static, `index.html:12` | B.2 |

- `AppContext.tsx` does not change in 2a or 2b. No script writes `data-tier`.
- The six Dusk files read three attributes: `data-tier`, `data-ambient` and `data-label` on a table
  cell (checked by script). No other attribute is needed.
- A new attribute on `html` needs the lead.

## B.4 The npm scripts and the gate tools of G1

R6 section 5 gives the steps. R6 gives no script name for most steps: this contract sets them. G1
builds exactly these names. The present scripts `dev`, `build`, `preview` and `tauri` do not change.

| npm script | What it runs | Step of R6 5 |
|---|---|---|
| `check` | `node tools/check.mjs`. Each offline step in order. PASS or FAIL for each step. It runs the remaining steps after a failure. It exits non-zero if one failed. | all of 1 to 11 |
| `check:frozen` | `node tools/frozen-check.mjs` | 1 |
| `check:dusk` | The Dusk lock check on `src/styles/dusk`, version `0.2.0`, with the strict namespace check on `src` | 2 |
| `check:colour` | The raw-colour lint with `tools/token-lint.baseline.json` | 3 |
| `check:names` | `node tools/name-check.mjs` (B.1, rule 5) | 4 |
| `lint` | `oxlint`, as today (`package.json:9`). `tools/check.mjs` runs it with the warning limit below. | 5 |
| `typecheck` | `tsc -b` | 6 |
| `test:unit` | `node --import ./tests/ts-resolve.mjs --test "tests/unit/**/*.test.ts"` | 7 |
| (no new name) | The four present scripts `sr-vectors`, `solve`, `content-check`, `securement-check` | 8 to 11 |
| `test:browser` | `node tests/browser/smoke.mjs`. It needs `dist/` and Chromium. | B1 |
| `look:baseline`, `look:compare` | The look harness, with `tools/look/cb.config.json`. It needs `dist/` and Chromium. | B2 |

**Three steps must pass on G1's own branch and get tighter after the merge.** On G1's branch the
other two jobs are not merged. So:

- `check:dusk`: the flag `--strict-uses` fails while `src/App.css` exists (R6 5.3). The step adds
  the flag by itself when `src/App.css` is gone.
- `check:names`: three collisions exist today: `--ink` and `--focus` in `src/index.css`, `--ink` in
  `src/stations/yardSim.js` (checked by script, B.7). `tools/name-check.allow.json` holds two
  lists. `collisions`: these three pairs of file and name. `legacy` [P]: the old names with no
  prefix that rule 2 of B.1 does not allow for a new name and that exist today or by this contract:
  the 13 other names of `src/index.css`, the same 13 names for the bridge file (block 1), the 12
  other names of `yardSim.js` and the 10 names of `radioSim.js`. Without the second list the step
  is red on G1's own branch and on the wave branch (the G1 brief, R9). The step fails on each
  collision and on each name with no prefix that is not in its list. An entry that no file needs
  any more gives one line in the output and does not fail, so S1, Y1 and B3 remove names and do
  not edit the file.
- `lint`: five warnings exist today (R6 ENG-14). G1 does not edit the five files. The step fails
  above five warnings. The owners remove them: `yardSim.js:237` and `:578` by Y1 in 2a,
  `yard/anim.js:23` by Y2 in 2b, `imperativeStation.ts:34` by Y4 in 2c, `AppContext.tsx:34` by U1
  in 2c. The mechanism of the limit is G1's choice. `oxlint` has `--max-warnings` (version
  1.71.0; run by the G1 brief and again by the check of the briefs: exit 0 with the limit 5,
  exit 1 with the limit 4).
- G1-close removes the allow entries that no file needs (after 2a: `collisions` is empty, and
  `legacy` holds the 13 names of block 1 for the bridge file and the 10 names of `radioSim.js`),
  and lowers the baseline and the limit (D.3).

`check:colour` needs no such rule: the baseline is the ratchet.

## B.5 The token names that the Yard drawing reads

R2 section 9 (Y2 item 5): the drawing has colour only in CSS, on palette names that point at Dusk
tokens through the bridge file. No script reads a colour. R2 recommends one inline SVG and no
canvas, so the rule of R3 3.6 for a canvas (solid tokens only) does not bind a CSS rule.

S1 declares the names below in the Yard block in 2a. Y2 owns the block in 2b. Y2 can change a
value and can add a name with the prefix `--yard-`. Y2 does not rename or delete a name of this
table without the lead, because a ruling or another job (Y3, Y4) reads it. The values are the
values of the picked sketch `specs/research/yard-looks/look-model2.src.html` (line in brackets) and
the meanings are the rows of R1 section 7.

| Name | Value | Meaning | Mark |
|---|---|---|---|
| `--yard-floor` | `var(--glass)` | The ground of the picture (41, 42) | |
| `--yard-ballast` | `var(--panel-hi)` | The band under a track (48) | |
| `--yard-tie` | `var(--hair-2)` | A tie (49) | |
| `--yard-rail` | `var(--ink-3)` | A rail (50) | |
| `--yard-rail-lined` | `var(--ink)` | A rail of the lined route, a point blade (51, 52) | |
| `--yard-route` | `var(--lit)` | The marks along the lined route (53) | PENDING RULING `GOLD`. Fallback of R1: `var(--ink)`. |
| `--yard-goal` | `var(--lit)` | The landing outline and the word BUILD (56, 139) | `GOLD` |
| `--yard-engine` | `var(--head)` | The engine body (88) | |
| `--yard-engine-edge` | `var(--lit)` | The engine edge (88) | `GOLD` |
| `--yard-engine-lamp` | `var(--disc-hi)` | The headlight (93) | |
| `--yard-foul` | `var(--ink-2)` | The foul point bar (54) | SME to confirm the term (R1 note S3) |
| `--yard-normal` | `var(--green-ink)` | A switch lined normal (97, 129) | SME to confirm (R1 section 7). The help text says "green = normal" (`yardSim.js:191`): the value stays a green (fence rules 3 and 15). |
| `--yard-reverse` | `var(--amber-ink)` | A switch lined reverse (98, 130) | SME to confirm. The help text says "yellow" (`yardSim.js:190`): PENDING RULING `YELLOW-WORD`. |
| `--yard-reverse-fill` | `var(--amber)` | The fill of a reverse switch stand (98) | as above |
| `--yard-tied` | `var(--ink-2)` | TIED | SME to confirm the word (R1 section 7) |
| `--yard-loose` | `var(--amber-ink)` | LOOSE | SME to confirm the word |
| `--yard-kickable` | `var(--ink-2)` | KICKABLE (140) | |
| `--yard-refusal` | `var(--red-ink)` | The ring at the cause of a refusal (99) | Red has no other use in the Yard (fence rule 5). |
| `--yard-car-empty` | `var(--well)` | The body of an empty car (61) | "Solid = loaded, hollow = empty" is frozen text (`puzzles.js:18`, `:281`). |
| `--yard-on-car` | `var(--on-tile)` | A detail on a loaded car (77, 78) | |
| `--yard-box-hi`, `--yard-box-lo`, `--yard-box-ink` | `var(--tile-grey-hi)`, `var(--tile-grey-lo)`, `var(--grey-ink)` | Type `box` (65, 80) | SME to confirm that no car colour reads as a commodity code (R1 note S6) |
| `--yard-hopper-hi`, `-lo`, `-ink` | `var(--tile-teal-hi)`, `var(--tile-teal-lo)`, `var(--teal-ink)` | Type `hopper` (66, 81) | as above |
| `--yard-tank-hi`, `-lo`, `-ink` | `var(--tile-violet-hi)`, `var(--tile-violet-lo)`, `var(--violet-ink)` | Type `tank` (67, 82) | as above |
| `--yard-centerbeam-hi`, `-lo`, `-ink` | `var(--tile-amber-hi)`, `var(--tile-amber-lo)`, `var(--amber-ink)` | Type `centerbeam` (68, 83) | as above |
| `--yard-autorack-hi`, `-lo`, `-ink` | `var(--tile-blue-hi)`, `var(--tile-blue-lo)`, `var(--blue-ink)` | Type `autorack` (69, 84) | as above |
| `--yard-car-shadow` | `drop-shadow(0 2px 2px var(--ground-0))` | The still shadow under a car (17) | |
| `--yard-lit-glow` | `drop-shadow(0 0 3px var(--lit))` | The glow of the engine edge (18) | `GOLD` |
| `--yard-refusal-glow` | `drop-shadow(0 0 4px var(--red))` | The glow of the refusal ring (19) | |

- The five type keys are the keys of `TYPES` in `geometry.js:43-48` (checked). The drawing does
  not read the colours of that frozen table (R2 9, Y2 item 5).
- The target size is `--cb-target` (block 3). The sketch name `--yd-target` (16) is not used.
- A script of the Yard reads a custom property only for a size or a time. If the value is missing,
  the script stops with an error. It does not fall back to a typed value (R3 3.6).
- **Reserved, no value yet:** `--yard-run-in` and `--yard-run-out`, the two travel times (R7 6,
  rule 7). The value waits for the picks `TIER` and `R7-P4`. A time alias must not be a bare
  `calc()`: a script reads it as text (R7 4.4).

## B.6 The ids and the test hooks

A test of G1 and the look harness select an element by an id or by a class. In 2b the classes
change. The contract makes the selectors stable.

**The hook attribute is `data-cb`.** In 2a the smoke test selects "the hook, or the old class".
A 2b job that replaces an old class of this table puts the hook on the same element. Then no test
file changes in 2b.

| Hook | Old selector | Element today | Job that adds the hook |
|---|---|---|---|
| `data-cb="domain-card"` | `.grid .card` | `Home.tsx:54-55` | B1 |
| `data-cb="station"` | `.station` | `Home.tsx:62`, `:64` | B1 |
| `data-cb="settings-open"` | `header .iconbtn` | `App.tsx:37` | B1 |
| `data-cb="ref-search"` | `.search` | `Reference.tsx:49` | B2 |
| `data-cb="ref-row"` | `.ref-row` | `Reference.tsx:55` | B2 |
| `data-cb="ref-detail"` | `.ref-detail` | `Reference.tsx:73` | B2 |
| `data-cb="opt"` | `.opt`, an answer option only | `Drill.tsx:233`; `RadioTest.tsx:179`. The buttons at the end of a session also have the class `opt` today (`RadioTest.tsx:120`, `:127`, `:131`): they are actions and get no hook. | B2, B3 |
| `data-cb="feedback"` | `.feedback` | `Drill.tsx:237`; `RadioTest.tsx:184` | B2, B3 |
| `data-cb="prompt-signal"` | `.prompt-signal` | `Drill.tsx:227` | B2 |
| `data-cb="yard-drawing"` | `canvas#yard` | The element that the drawing adapter fills | Y1, in 2a |

**Selectors that stay and need no hook:**

- `main#view` (`App.tsx:39`), `dialog#settings`, the five toggle ids `t-dys`, `t-contrast`,
  `t-reduce`, `t-audio`, `t-big` (`Settings.tsx:42`), `[role="tab"]` (`Radio.tsx:26`, `:30`),
  `[role="progressbar"]`.
- `.yard-host`, `.yard-wrap`, `.radio-host`, `.radio-wrap`.
- The Yard ids: `picker`, `readout`, `workorder`, `act`, `count`, `track`, `work`, `optimal`,
  `depart`, `reset`, `mute`, `msg`, `rules`, `certify` (checked in `yardSim.js`). The view keeps
  each one through 2b and 2c. The id `yard` (the canvas) goes with the canvas.
- The Radio island ids: `sigmark`, `gaptxt`, `status`, `consist`, `log`, `next`, `notebox`,
  `notebody`, `done` (checked in `radioSim.js`), and the classes of the island markup. B3 changes
  style rules and colour attributes only.

**The look harness.** `tools/look/cb.config.json` lists each old class under `classesMayGo`, for
all waves: the 65 class selectors of `src/index.css` at commit `86cfef2` (the count is from R6
ENG-12), the classes of the Yard markup, and `yd-*`. The tool takes a prefix with `*` (`visual-regress.mjs:416`, checked). An id of
the lists above is never in an allow list. R6 ENG-08 asked for a list "for that one job": a
standing list is proposed here [P], so that no 2b job edits a file of G1.

**Two ids go by this contract, and the look tool has no allow list for an id.** The look tool
reads each id of the document, the `<head>` also (`visual-regress.mjs:202`, checked), and fails a
shot when one id is gone (`:481-482`, checked). It has `classesMayGo` and no such key for an id.

- `yard-style`: the `<style>` element that the Yard adds to `<head>` (`yardSim.js:215-220`). It
  goes in 2a (C.4). It is not an id of the lists above.
- `yard`: the canvas. It goes in 2b with the canvas.

So a compare of the `yard` page against the baseline of `86cfef2` fails on "1 element ids gone:
yard-style" after Y1, with the look tool as it is. PENDING RULING `LOOK-IDS` (E.4). Recommended
[P]: the config of the harness of G1 gets a key `idsMayGo` with exactly these two ids, where G1
writes the picture script. Where the look tool runs as it is (Y1 in its scratch folder, or
`TOOLS` option b), the line "1 element ids gone: yard-style" is the expected result for the
`yard` page after Y1, and each other reason fails.

**Reserved for 2c (Y4, G1-2) [P]:** each switch button has `data-sw="<track id>"`, `aria-pressed`
(true is reverse) and the name form "AS73 switch, lined reverse" (R1 6.3, common rule 9; the
sketch, line 964). The text mirror has the id `yard-mirror`. The status region has the id
`yard-live`.

## B.7 The collision checks that were made

Script: `names.mjs` in the scratch folder of this job (Part G). It reads the six Dusk files with
the comments removed.

| Check | Result |
|---|---|
| Custom properties that the six Dusk files declare | 268 names: 255 in `dusk.tokens.css`, 13 local names in `dusk.components.css` (`--row-neon`, `--row-wash`, `--ico-edge`, `--ico-ink`, and nine `--tile-*` names). R3 Check 3.5.1 gives the same two counts. |
| Names that the app declares today (15 in `src/index.css`, 13 in `yardSim.js`, 10 in `radioSim.js`) against the 268 | In both sets: `--ink` (`src/index.css`, `yardSim.js`) and `--focus` (`src/index.css`). No other name. |
| `--caution` | **Not a Dusk custom property.** The text `--caution` is in the six files only inside two class names (`dusk.components.css:68`, `:573`, `:582`). R6 ENG-08 lists `--caution` as a Dusk name. That is not correct. R3 Check 3.5.1 is correct. |
| The 13 names of block 1 (`--bg` to `--font`, `--maxw`, `--fs`) | Each is free in the six Dusk files. |
| The 8 names of block 3 (`--cb-*`) | Free in Dusk. Not declared by the app today. |
| The names of blocks 2, 4 and 5 | Each one is a Dusk token (by intent). Each "value" token named in B.1 and B.5 exists in `dusk.tokens.css`. |
| Dusk names with the prefix `--cb-`, `--yard-`, `--yd-` or `--radio-` | 0 each. `--yard-run-in` is free. |
| Dusk classes | 152: 151 with the prefix `dusk-`, and `is-in`. Dusk classes with the prefix `cb-`, `yd-`, `yard-` or `radio-`: 0. |
| App files that use a class with the prefix `cb-` or `yd-` today | 0 (`grep` over `src/`). |
| `data-cb` in `src/`, `index.html` and the research reports | 0 uses. |
| Names that Dusk reads and does not declare | One: `--lanes` (`dusk.process.css:96`). |
| Attributes that Dusk reads | `data-tier`, `data-ambient`, `data-label`. Keyframes: `dusk-enter`, `dusk-ride`, `dusk-drift`. An app keyframe name takes the prefix `cb-` or `yd-`. |
| Each new path of Part C | Free today (checked on disk): `tests/`, `tools/check.mjs`, `tools/reskin/`, `tools/look/`, the two `clear-board.*.css` files, `src/styles/surfaces/`, the Yard files of C.4 and C.5, `specs/harness/`, `specs/pictures/`, `.look/`, `.nvmrc`, `.npmrc`, `tsconfig.tests.json`, `ARCHITECTURE.md`, the three PNG paths. |
| New npm script names against `package.json:6-13` | No collision. The present names are `dev`, `build`, `lint`, `preview`, `tauri`, `check`. |

---

# Part C. The file layout

## C.1 The style files and the load order

`src/main.tsx` has one style import today, on line 3 (checked). S1 replaces it with these lines, in
this order. The first seven lines are the order of R3 8.1, which a build confirmed (R3 Check 8.1.2).

```ts
import './styles/dusk/dusk.tokens.css'
import './styles/dusk/dusk.base.css'
import './styles/dusk/dusk.components.css'
import './styles/dusk/dusk.compose.css'
import './styles/dusk/dusk.motion.css'
import './styles/clear-board.tokens.css'    // the bridge
import './styles/clear-board.parts.css'     // the cb- parts
import './index.css'                        // the app sheet (the old rules, until the sweep)
import './styles/surfaces/shell.css'        // B1
import './styles/surfaces/home.css'         // B1
import './styles/surfaces/settings.css'     // B1
import './styles/surfaces/reference.css'    // B2
import './styles/surfaces/drill.css'        // B2
import './styles/surfaces/radio.css'        // B3
```

- `dusk.process.css` is not imported (R3 8.2). The file stays in the copy.
- The six surface sheets come last, so that a surface rule wins a tie against a part and against an
  old rule. This order with the six added files was not built: **not verified**.
- Dusk and the bridge stay out of each lazy chunk (R3 8.1). The sheet of a lazy chunk holds only
  rules under `.yard-wrap` or `.radio-wrap`.

## C.2 The app sheet, the parts file, and how a 2b job adds a rule

**Decision.** S1 writes all `cb-` parts in one file, `src/styles/clear-board.parts.css` (R3
section 4, "Who writes the parts"; R3 Check 4.2). In 2b this file is closed. No 2b job writes it.

**How a 2b job adds a rule without a shared file.**

1. Each 2b surface job has its own sheets (A.3.2). S1 makes each one in 2a with one header comment
   that names the owner. S1 writes the six imports in 2a. So no 2b job edits `src/main.tsx`.
2. A new class of a surface sheet has the prefix of that surface (B.2).
3. A rule that changes a Dusk class or a `cb-` part for one surface has the scope class of that
   surface in front, for example `.cb-app .cb-drill-view .dusk-panel-name`. The scope class has
   the prefix of the surface. This keeps the rule of R3 A4: a Dusk class is always under an app
   class.
4. A 2b job that finds a defect in a shared part does not edit the part. It writes the smallest
   rule in its own sheet, under its scope class, and reports the defect. U1 folds these rules into
   the parts file in 2c.
5. S1 proves each part in 2a on `specs/harness/parts.html`, with pictures at 1440 and 390, before
   a surface job uses it.

**`src/index.css` in 2b.** B1 owns it. Three jobs read its old rules, so B1 can delete only a rule
of the B1 list.

- **The B1 list** (classes that only `App.tsx`, `Home.tsx` and `Settings.tsx` use; checked by a
  list of the `className` values of each file): `skip`, `wrap`, `top`, `mark`, `brand`, `grow`,
  `lede`, `free`, `section`, `path`, `stage`, `bar`, `grid`, `card`, `locked`, `h`, `dot`, `mini`,
  `soon`, `stations`, `station`, `tip`, `set-h`, `set-body`, `set-sample`, `ss-aa`, `set-note`,
  `row`, `sw`, `danger`, and the selectors `footer` and `dialog#settings`.
- **The shared list** (B1 does not delete or change these rules in 2b): `iconbtn`, `muted`, `back`,
  `view-title`, `badge`, `clear`, `caution`, `cite`, `small`, `drill-top`, `opts`, `opt`, `right`,
  `wrong`, `feedback`, `fb-ok`, `fb-no`, `next`, `big-score`, and each rule on an element name
  (`html`, `body`, `a`, `details`, `summary`, `blockquote`, `:focus-visible`, `*`), the press rule
  (lines 136 to 137) and the reduced-motion block (lines 140 to 148).
- **The B2 and B3 rules that only one of them uses** (`search`, `ref-list`, `ref-row`,
  `ref-detail`, `plain`, `aspects`, `prompt`, `prompt-signal`, `signal`; `mode-tabs`, `mode-tab`,
  `on`, `radio-readout`, `radio-incoming`, `radio-ack`, `who`) stay in `src/index.css` in 2b. B2
  and B3 stop using them. They do not edit the file.
- `stage` and `bar` are also class names inside the two islands (R3 trap 9.14). The island rules
  set their own values (`yardSim.js:91`; `radioSim.js:15`). Whether a deletion of the shell rule
  changes an island is **not verified**: B1 proves it with the look compare.
- **The S1 floor block [P].** S1 adds rules to `src/index.css` that the two lists above do not
  hold: the rules that keep the shapes of today under the Dusk element rules (the S1 brief,
  requirements 12 to 15). S1 writes them in one block at the end of the file, between the comments
  `/* s1-floor:start */` and `/* s1-floor:end */`. `body { padding: 0 }` of this block joins the
  B1 list: B1 deletes it in the commit that adds `.dusk-stage--app`. The other rules of the block
  stay until the sweep. PENDING RULING `S1-FLOOR-BLOCK` (E.4).
- **The sweep, 2c, U1 [P].** After 2b no markup uses an old class. U1 deletes each dead rule of
  `src/index.css` and the eleven old names of block 1 of the bridge, and folds the overrides of
  point 4 into the parts file.

## C.3 The island contract as it is today

Checked in `src/stations/imperativeStation.ts`, `Yard.tsx`, `Radio.tsx` and `yardSim.js`.

| Item | Today | Where |
|---|---|---|
| The entry of the Yard | `import('./yardSim.js')`, lazy | `Yard.tsx:7` |
| The host element | `<div class="yard-host">` | `Yard.tsx:8` |
| The module shape | `{ mount: (host: HTMLElement, ctx: unknown) => void }` | `imperativeStation.ts:9` |
| The bridge object `ctx` | `profile`, `settings`, `speak`, `save`, `recordYardWin`, `go(route)`. One object for the life of the mount. React writes the new values into the same object on each render. | `imperativeStation.ts:17-29` |
| What the Yard reads | `ctx.go` (`yardSim.js:225`, `:652`), `ctx.settings.reduce` (`:228`, one time, at mount), `ctx.profile.yard` (`:453`, `:458`, `:680`, `:684`), `ctx.save` (`:480`), `ctx.recordYardWin` (`:484`), `ctx.settings.audio` (`:715`). It does not call `ctx.speak`. | `yardSim.js` |
| The mount | It adds one `<style id="yard-style">` to `<head>` and sets `root.innerHTML` | `yardSim.js:215-222` |
| The teardown | React sets `host.innerHTML = ''`. The module gets no call. | `imperativeStation.ts:37` |
| The Radio | The same contract. `RadioTest.tsx:65` also imports `STEPS` from `radioSim.js`. | `Radio.tsx:12`; `RadioTest.tsx:65` |

Rules for Wave 2:

- The entry path, the export `mount(root, ctx)`, the six fields of `ctx` and the teardown do not
  change in 2a or 2b.
- A teardown call from React to the module is a change of behaviour. It is proposed for Y4 in 2c
  (PENDING RULING `UNMOUNT`). R7 section 14 found a `TypeError` when a learner leaves the Yard
  during a watched line.

## C.4 The Yard split of Y1

**File type.** `src/stations/yardSim.js` stays a `.js` file at its path in each case, so that
`Yard.tsx:7` does not change. The new files are `.js`. **PENDING RULING `U-46`:** if the owner says
yes to row U-46, the new files `view`, `draw` and `access` are `.ts`, and `imperativeStation.ts`
exports the named type of `ctx`. Wave 2 does not start before question 4 has an answer, so Y1 has
the answer on its first day. Whether Vite resolves a `.js` import path to a `.ts` file is **not
verified**; this contract does not depend on it.

**The files of Y1.**

| File | Holds | Exports |
|---|---|---|
| `src/stations/yardSim.js` (the controller) | The game state, the move logic, the records, the sound calls, the event wiring. `RULE_ITEMS` and `masteryItemsFor` (`:25-38`). It imports the view, the adapter and `./yard/yard.css`. | `mount(root, ctx)`, and nothing else |
| `src/stations/yard/view.js` (the view) | All markup strings (today `YARD_HTML`, `:142-211`, and the strings built at `:549-634`, `:636-655`, `:669-709`). All class names. It holds no game state and imports no function of `model.js`. | `createView(root)`, which returns the view object below |
| `src/stations/yard/yard.css` (the chrome style) | Today `YARD_CSS`, `:42-138`, without the canvas rule (`:64`) | — |
| `src/stations/yard/draw.js` (the drawing adapter) | The canvas, the pixel-ratio lines (`:232-235`), the hit test of a click (`:288-294`), the call of `render()`. It imports `./drawing/drawing.css`. | `createDrawing(host, { onPick })`, which returns the drawing object below |
| `src/stations/yard/drawing/drawing.css` | The one canvas rule (`:64`), with the selector `.yard-wrap .yd-view` (B.2, point 2) | — |

**The two seam rules.**

1. The controller holds no class name, no markup string and no inline style. It reaches an
   element by one of the ids of B.6 or through a view function.
2. The controller draws only through the drawing object. It does not import `render.js`.

**The view object** (each function replaces the lines named; Y1 can add a function, and does not
leave one out):

| Function | Replaces |
|---|---|
| `el(id)` | The `$` of `:243` |
| `drawHost` (a property) | The element `.yardframe` (`:154`). The view sets `data-cb="yard-drawing"` on it. |
| `setReadout({ moves, par, joints })` | The three writes of the readout string (`:260`, `:420`, `:432`). The view builds the same string: `Moves 0 / par 5 · Joints 0`. The object form keeps both answers of PENDING RULING `READOUT-CELLS` open with no change of the controller. |
| `setBanner(text, tone)` | `:636-640`. The tone is `''`, `'ok'`, `'bad'` or `'win'`. |
| `setRefusal(text, onLookup)` | `:644-655`. `onLookup` is a function or `null`. |
| `renderRules(list)` | `:549-558` |
| `renderSwitchList(data, { onFlag, onCertify })` | `:566-580` |
| `renderVerifiedOrder(data)`, `renderWorkOrder(data)` | `:609-618`, `:621-634` |
| `setCount({ max, value, disabled })` | `:532-546`, with the inline opacity of `:538` |
| `setTracks(ids)`, `renderPicker(groups, keep)` | `:669-670`, `:682-709` |
| `setDepart({ shown, enabled })`, `setMuted(muted)` | `:258`, `:437`, `:440`, `:516`; `:307`, `:716` |
| `onGo(fn)` (added by the Y1 brief, by the rule above) | `:225`. The back button has no id. The view calls `fn` with the `data-go` value of the button. |

**The drawing object.**

| Member | Meaning |
|---|---|
| `paint(state, puzzle, { anim, cine })` | The one draw call. The same arguments as today (`:264`; R2 9, Y2 item 8). |
| `onPick(trackId)` (the callback that the controller gives) | The adapter calls it for each click on the drawing: with the track id of the switch that was hit, or with `null`. The controller keeps the order of effects of `:286-295`. |
| `switchBoxes()` | A list of `{ id, x, y, width, height }` in CSS px, relative to `drawHost`, one for each switch. Y4 places its buttons with it (R2 9, Y4 item 8). |
| `onLayout(fn)` | The adapter calls `fn` after each change of the layout (R2 9, Y4 item 8). |
| `destroy()` | Removes observers. |

**The other rules of the split.**

- `anim.js` keeps its three exports with their signatures: `easeInOut(t)`, `setSpeed(f)`,
  `play(steps, { onFrame, onDone })` (`anim.js:4`, `:7`, `:11`). Y1 does not touch the file. Y2
  can change the inside in 2b.
- `sound.js` keeps its four exports `sfx`, `resume`, `toggleMute`, `isMuted`. No job touches the
  file before 2c.
- The style is a file that the lazy chunk imports. The `<style id="yard-style">` element goes.
  Each selector of `yard.css` and of `drawing.css` starts with `.yard-wrap`.
- **Step 1 of Y1** makes the split, the class prefix of B.2 and the two lint fixes
  (`yardSim.js:237`, `:578`). The custom property names of the Yard get the prefix `--yard-` with
  the same values. The colours do not change. Proof: the Yard pictures are equal to the baseline,
  pixel for pixel (R6 5.7 found the Yard pictures stable), and the smoke case "Watch optimal on
  `p0-1` ends at Moves 5 / par 5" passes. The Y1 brief adds a stronger proof: a recorded tape of
  the Yard (words, controls, canvas hash, sounds, stored values), taken before and after. The
  place of the recorder and of the tapes is PENDING RULING `Y1-TAPE` (E.4).
- **Step 2 of Y1** deletes the old colour names and each typed colour of the Yard style and writes
  the tokens of R3 3.2 (both tables). The track name on a flagged line takes `--ink` (R3 A9).
  After step 2 `yard.css` holds no raw colour. Step 2 starts when the wave branch holds G1 and S1
  (D.2).
- A colour word on the screen stays true (R3 A1): "yellow" and "green" at `yardSim.js:190-191`.

## C.5 The drawing files of Y2

| File | Holds | Source |
|---|---|---|
| `src/stations/yard/draw.js` | The adapter. The same members as in C.4. Y2 replaces the inside. | C.4 |
| `src/stations/yard/drawing/layout.js` | One pure view-transform function and the rule that selects the form. Each point of `geometry.js` goes through it. `geometry.js` is imported and not changed. | R2 9, Y2 item 2; `look-model2.notes.md` section 2 |
| `src/stations/yard/drawing/bodies.js` | One pure function from the state, `anim` and `cine` to a list of bodies | R2 9, Y2 item 3 |
| `src/stations/yard/drawing/svg.js` | The one inline SVG: one group for each body, a write only when a value changed | R2 9, Y2 items 1 and 4 |
| `src/stations/yard/drawing/drawing.css` | The drawing style. It reads `--yard-*` names (B.5) and Dusk size, space and type tokens. | R2 9, Y2 item 5 |
| `src/stations/yard/render.js` | Y2 deletes it, or keeps it with no raw colour. The claim in the comment on line 2 (plan fact T12) does not move into a new file. | Plan T12 |

- The file type follows `U-46`.
- Y2 keeps a pointer path to each switch in 2b: a press on the switch mark calls `onPick`. Then a
  learner can play the Yard at the end of 2b. The six page buttons are Y4's in 2c (PENDING RULING
  `SWITCH-BUTTONS`).
- A hook for the tests on each part (R2 9, Y2 item 7): `data-car="<mark>"` on each car group,
  `data-track="<id>"` on each track, `data-lined="normal"` or `"reverse"` on each switch [P].

## C.6 The files of G1

| Path | What | Source |
|---|---|---|
| `tools/check.mjs` | The runner of `npm run check` | R6 5 |
| `tools/frozen-check.mjs`, `tools/frozen.lock.json` | The hash gate. The baseline commit is `94a41c522b8b4be7bc6ac11f1d7da29cf2defbf1`. | R6 5.1 |
| `tools/reskin/dusk-sync.mjs`, `tools/reskin/token-lint.mjs` | The two vendored tools. PENDING RULING `TOOLS`. With "no vendoring" G1 writes `tools/dusk-lock-check.mjs` and `tools/colour-lint.mjs`. The npm script names of B.4 are the same in both cases. | R6 5.2, 5.3 |
| `tools/token-lint.baseline.json` | The ratchet of the raw-colour lint. 216 raw colours in 10 files today, with the gate command of R6 5.2. | R6 5.2 |
| `tools/name-check.mjs`, `tools/name-check.allow.json` | The collision check | R6 ENG-08; B.4 |
| `tools/look/cb.config.json`, and the look tool or a small picture script in `tools/look/` | The look harness. `TOOLS`. The config holds `classesMayGo` (B.6) and, with `LOOK-IDS` option (a), `idsMayGo`. | R6 5.7 |
| `tools/sr-vectors.mjs`, `solve.mjs`, `content-check.mjs`, `securement-check.mjs` | The four present gates. P-27 items 5 and 6. | R6 6.1, ENG-20 |
| `tests/ts-resolve.mjs` | The resolve hook | R6 6.3 |
| `tests/unit/sr.test.ts`, `store.test.ts`, `severity.test.ts` | The unit tests | R6 6.2 |
| `tests/browser/smoke.mjs` | The browser smoke test. It serves `dist/` by itself. | R6 5.6 |
| `tests/browser/radio-words.tape.json` | The word tape of the guided Radio. G1 records it in 2a from the build of its start commit, before B3 starts. | R6 5.6, 16 item 12 |
| `.github/workflows/check.yml` | The check on each branch and each pull request | R6 5.9 |

## C.7 The pictures

| What | Where | Committed |
|---|---|---|
| The output of the look harness: baseline, current, diff, the report page | `.look/` in the repository root | No. `.gitignore` lists it (G1). R6 5.7: baseline pictures are not committed. |
| The pictures that a build job attaches to its report: each route it changed, at 1440 and 390, after the change | `specs/pictures/<wave>-<job>/`, for example `specs/pictures/2a-S1/` | PENDING RULING `PICTURES`. Recommended: yes. |
| In CI | An artifact of `check.yml` | No |

- File name: `<page>@w1440.png` and `<page>@w390.png`. This is the name form of the look tool
  (checked in the output folder of the R6 trial).
- Page names: `home`, `reference`, `drill`, `signals`, `yard`, `radio`, `radio-test`, `settings`.
  The R6 trial had seven pages; `radio-test` is added here [P].
- Added by the briefs, in the same name form [P]:
  - G1 (R25): a third size `w1280` (1280 by 800) for the `yard` page only, `yard@w1280.png`. The
    form of look C2 can change under 1366 px (`specs/gate-a-answers.md`, question 1). And three
    pages for the reading modes, at both sizes: `home-dys`, `home-contrast`, `home-big`. PENDING
    RULING `LOOK-PAGES` (E.4).
  - S1 (requirement 30): `parts`, `parts-dys`, `parts-contrast`, `parts-big` for the harness page,
    and the three `home-` names above.
  - Y1 (requirements 4 and 34): `yard-refusal`, `yard-list`, `yard-verified`, `yard-win`,
    `yard-depart`, `yard-help`, and at 390 `yard-dys`, `yard-contrast`, `yard-big`, in the folders
    `step1/` and `step2/` of its picture folder.
  - No two jobs give one page name two meanings (checked by a list of the names of the three
    briefs).
- The baseline of the whole change request is the build of commit `86cfef2` (R6 5.7).
- The look tool sets the browser to reduced motion, so each picture shows the app with "Reduce
  motion" on unless a step turns it off (R6 5.7).
- **In 2a the harness is not in the repository yet.** S1 and Y1 take their pictures with the look
  tool at `/home/user/cloud-research-2026-11-16/ws7-design-system-trainer/reskin-tools/`, from a
  copy in their scratch folder, never inside the repository. The config of the R6 trial is
  `scratchpad/R6/vr/cb.config.json`. A scratch folder can be gone: then the job writes the same
  seven page entries again.

---

# Part D. Order and hand-overs

## D.1 Before Wave 2a starts (the lead)

1. The owner answers question 4. This also answers `U-46`.
2. The lead rules `FILES` (each [P] of Part A), `BRANCH` and `Y1-STEPS`. The three briefs depend on
   them.
3. The lead writes the Gate A entries in `DECISIONS.md`, `ARCHITECTURE.md` and the tier line.
4. Each other pending ruling can come later. Part E says which job waits.

## D.2 Wave 2a: three jobs in parallel

What removes each dependency:

| Dependency | How the contract removes it |
|---|---|
| S1 and Y1 read names of the bridge | B.1 and B.5 fix each name. S1 declares all of them, the Yard block also. |
| G1's gates must be green on G1's branch, where S1 and Y1 are not merged | The three ratchets of B.4 (the baseline, the allow list, the warning limit). |
| G1's smoke test selects classes that 2b changes | The hooks of B.6. |
| S1 and Y1 need pictures before the harness exists | C.7, last point. |
| Y1 and S1 both style `.back` and `.bar` | Y1 gives each Yard class the prefix `yd-` (B.2). The Yard back button takes its 44 px height from the shell rule `.back` today (`src/index.css:67`, checked): Y1 writes that height into its own rule (the Y1 brief, requirement 16). |
| Y1 removes the id `yard-style`, and the look compare fails on a lost id | `LOOK-IDS` (B.6). |
| S1 must not set a Dusk name in the parts file, and the name check of G1 fails on it | Rule 1 of B.1, with the example `--led-size`. |
| The tests project of G1 has no input file before the first test exists | G1 adds the tests project file and the first test file in one commit: `tsc -b` stops with error TS18003 on a project with no input, and `npm run build` runs `tsc -b` (tried in a scratch folder by the check of the briefs). |
| Y1's style on Dusk tokens needs Dusk, which S1 links | **Not removed. It is ordered.** Step 1 of Y1 runs in parallel and is proved alone. Step 2 starts when the wave branch holds G1 and S1. The names are fixed, so step 2 is a replacement by table (R3 3.2). |

## D.3 How the three 2a branches merge

Order, with the reason:

1. **G1 first.** The gates then check the next two merges.
2. **S1 second.** S1 merges the wave branch into its branch, runs the gates, corrects what fails,
   and is merged.
3. **Y1 last.** Y1 merges the wave branch into its branch, does step 2, proves it, and is merged.
   Between that merge and the end of step 2, `check:colour` is red on the branch of Y1, and only
   there: step 1 moved 44 raw colours into the new file `yard/yard.css`, and a file that the
   baseline does not name has the limit 0 (`token-lint.mjs:249`, checked). No job edits the
   baseline for this. Step 2 ends the state. The wave branch is never red.
4. **G1-close.** One commit by the G1 line: it writes the baseline again (no file higher than
   before), removes the entries of `tools/name-check.allow.json` that no file needs (B.4), lowers
   the warning limit to the count that is left, and turns each report-only case of the smoke test
   that now passes into a gate.

Files that can conflict: none, by the matrix. Each job writes its own picture folder. If a merge
shows a conflict, a job broke the matrix: the lead stops the merge and sends the conflict back to the job.

What the lead checks on the wave branch after the last merge, with its own run:

1. `npm ci`, `npm run check`, `npm run build`: green.
2. `npm run test:browser`: green. The look compare against the baseline of `86cfef2`: no lost
   word, no lost control, no lost id, no smaller text, no sideways scroll at 1440 and 390. A lost
   class is in the allow list. The one id that goes in 2a is `yard-style` (B.6, `LOOK-IDS`).
3. The hash gate: no frozen file changed since `94a41c5`.
4. For each job: the list of changed paths is inside its row of Part A.
5. The Dusk copy: equal to the lock. The strict namespace check passes. `src/App.css` is gone and
   `--strict-uses` is on.
6. The raw-colour count: `src/index.css` 0, `yardSim.js` 0, `yard.css` 0. Left, as planned:
   `render.js` 22, `radioSim.js` 45, and the icon file.
7. `deploy.yml`: only line 26 changed.
8. The four reading modes on the shell: each one still works (fence rule 7).
9. The known state, stated in the pull request text: the Yard drawing and the guided Radio keep
   their old colours until Y2 and B3 (R3 A7).

## D.4 What must be true at the end of 2a for 2b to start in parallel

1. The wave branch is green (D.3, points 1 to 3).
2. The bridge file holds each name of B.1 and B.5.
3. The parts file holds each class of B.2. `specs/harness/parts.html` shows each part in each state
   at 1440 and 390, and the pictures are in `specs/pictures/2a-S1/`.
4. The six surface sheets exist and `src/main.tsx` imports them.
5. `body` has the class `cb-app`.
6. The Yard is split: the controller has no class name, no markup and no import of `render.js`.
   The drawing object has the five members of C.4.
7. The smoke test selects by the hooks of B.6. The look config holds the standing allow list.
8. `tests/browser/radio-words.tape.json` is recorded.
9. `npm run look:baseline` and `npm run look:compare` work in the repository.
10. The lead has ruled: `B3-LINE`, `CSS-MARK`, `PAGE-WIDTH`, `TEXT-SIZE`, `TILE-TONE`, `GOLD`,
    `FORM-CHANGE`, `C2-WORDS`, `READ-ORDER`, `SWITCH-BUTTONS`. A 2b job that has none of these in
    its row of Part E can start without them.

## D.5 What each 2b and 2c job needs from 2a

| Job | Needs from 2a |
|---|---|
| B1 | Parts G2, G3, G4, G7, G12, G19, G20 and `cb-win`; its three sheets; the B1 list of C.2; the hooks `domain-card`, `station`, `settings-open`. |
| B2 | Parts G1, G5, G7, G8, G11, G13, G14, G15, G17; its two sheets; the hooks `ref-*`, `opt`, `feedback`, `prompt-signal`. |
| B3 | Parts G1, G10, G11, G13, G14, G16; its sheet; the word tape; the hash gate of `STEPS`; the hooks `opt`, `feedback`. |
| Y2 | The drawing adapter of C.4 with the canvas inside; the Yard block of the bridge; the hash gate (for `geometry.js`); `drawing.css`. |
| Y3 | The view and `yard.css`; parts G6, G9, G11, G15, G18; the ids of B.6. |
| Y4 (2c) | From Y2: `switchBoxes()` and `onLayout`. From Y3: the view. From 2a: the controller with the two seams. |
| U1 (2c) | The owner's yes for each row. The unit tests of `store` before row U-34. |
| D1 (2c) | The change lines of each job report. |
| G1-2 (2c) | The hooks reserved in B.6 for the switch buttons and the mirror. |

## D.6 Dependencies inside 2b, and what removes each

| Pair | Dependency | What removes it |
|---|---|---|
| Y2 and Y3 | Both need a change of the controller | The two seams of C.4. The controller is closed in 2b. |
| Y2 and Y3 | The frame of the drawing | Y3 owns the frame element (`drawHost`): no padding, the full width, no height and no aspect rule. Y2 owns all that is inside. |
| Y2 and Y3 | Class names with one prefix | The split of `yd-` in B.2. |
| Y2 and B1 | The width that the Yard gets | The drawing measures its own host and selects its form from that width. Y2 proves both forms. `PAGE-WIDTH` decides what a learner sees on a desktop. |
| B1 and B2, B3 | The old rules of `src/index.css` | The B1 list and the shared list of C.2. |
| B2 and B3 | The shared classes of the Drill and the Radio test | Both take the `cb-` parts of S1. Neither writes the parts file. |
| Each 2b job and G1 | Tests and the look config | B.6. `tools/**` and `tests/**` are closed in 2b. |
| Y2 and the reduced-motion work | The controller passes only a speed factor | `MOTION-STOP-OWNER`: Y4 in 2c. In 2b the Yard keeps the behaviour of today with "Reduce motion" on. |

Merge order of 2b: no order is forced. Proposed: B1, B2, B3, Y3, Y2, then G1-close. After 2b the
raw-colour count is zero outside the bridge, the frozen files and the places of row U-45.

## D.7 Wave 2c

- Y4, U1 (rows with no Yard file), D1 and G1-2 run in parallel.
- A U1 row that touches a file of A.3.4 or `imperativeStation.ts` starts after Y4 is merged
  (`2C-ORDER`).
- A changed word goes in a commit of its own, apart from a reskin commit (upgrade list 7.9).
- D1 passes the name and the version to G1-2. G1-2 writes `package.json` and the lock file.

---

# Part E. Open rulings

One row for each ruling that the research asks of the owner or of the lead and that has no answer
in `specs/gate-a-answers.md`. "2a" says whether Wave 2a can start without the ruling.

## E.1 The owner rules

| Name | The question, and the source | Options | Recommended, with the reason | Jobs that wait | 2a |
|---|---|---|---|---|---|
| `UPGRADE-LIST` | Yes or no for each of the 51 rows (Gate A question 4; `upgrade-list.md` section 2) | Yes or no for each row | As the list recommends: 46 yes, 5 no. The list gives a reason for each row. | U1 (all rows); G1 and G1-2 (U-43, U-44, U-45, U-47); Y4 (U-09, U-12, U-20); B1, B2 (U-41) | No. The plan says: build nothing before the owner has answered. |
| `U-46` | Are the new Yard files TypeScript (row U-46) | Yes; no | Yes: Y1 writes these files in any case (R6 ENG-13). | Y1 (the file type), Y2, Y4 | No, for Y1. It comes with question 4. |
| `U-45` | Can four places keep a raw colour: the manifest, the browser bar colour, the icon file, the desktop window colour (row U-45; R3 16 item 3; R6 16 item 2). It is an exception to fence rule 4. | Yes; no | Yes, for the icon file and the window colour only: S1 reads `--glass` at build time for the manifest and the meta tag (R3 3.7), so those two need no exception. | G1-close (the end of the ratchet) | Yes. The baseline covers the icon file meanwhile. |
| `U-04` | Jobs that old profiles hold as complete after a watched line (R4 pick 3) | The marks stay; the marks are cleared | The marks stay: the stored data cannot tell the two cases apart (row U-04). | U1, after Y4 | Yes |
| `U-10` | The update behaviour (R6 owner pick 1) | A "new version is ready" control; as today, with a clear message on a failed load | The control: this release changes the Yard chunk, which causes the fault (R6 ENG-01). | U1; G1-2 (the update test) | Yes |
| `U-13` | What turns motion off (R5 pick 1; the same pick as R7-P3) | The learner's choice or the device flag, read live; the learner's choice always wins | The first: the safe side, and Dusk stops on the device flag (R5 16). | U1 (`AppContext.tsx`), Y4 | Yes |
| `U-17` | The look-up (R4 pick 5) | The entry opens on top of the station; a separate screen that keeps the station state | On top of the station: the fix of the report (upgrade list, links). | U1 | Yes |
| `U-30` / `DYS-FONT` | The dyslexia face (R3 pick 5; R5 pick 3; R6 owner pick 3) | Ship the font file; keep the stack and change the label | Ship it, if the licence allows it: the mode is then the same on each device. The licence and the file size are not verified. Dusk D-011 says "no font file" for Dusk. | U1 | Yes. S1 keeps the stack of today. |
| `U-42` | The tip link: its address holds an account name (R6 owner pick 4) | The link stays (a yes accepts the name); the link changes or goes | The owner's pick. The list recommends: stays. | U1; `Home.tsx:68` | Yes |
| `U-41` | An icon in a control is decoration for a screen reader (R3 16 item 7) | Yes; no | Yes (the list). Until a yes: B1 and B2 leave `aria-hidden` off, so the spoken name does not change. | B1, B2 | Yes |
| `TIER` | The page-law tier (R3 pick 1; R7-P1) | (a) STRICT with one written exception: the Yard drawing can show travel of equipment after a learner action. (b) OPEN with `data-ambient="off"` and no entrance. (c) STRICT with no exception: each move is a state change, and the kick loses its roll. | (a): the shell stays still, and travel is the one place where motion teaches (R7 12). The exception must also cover the read of `--m-enter` and `--m-ride` (R7 Check P1). The reading of the law is not verified. | The lead (the tier line); S1 (one attribute); Y2 and Y4 (the motion form) | Yes. S1 writes `data-tier="strict"`. |
| `PAGE-WIDTH` | The page width (R3 pick 2; R2 C5, C12) | (a) One window that fills the browser, text lines capped at 78 characters. (b) The centred 920 px column of today. | (a): the Yard needs the window width. With (b) a desktop never gets the wide form of look C2, which needs about 1366 px (`gate-a-answers.md`, question 1). | B1; Y3; what Y2 shows on a desktop | Yes. S1 keeps `--maxw`. |
| `TEXT-SIZE` | The size of reading text (R3 pick 3, A2) | (a) The app sizes stay for reading text, and the texts of R3 A2 keep the size of today by a page-local rule. (b) The texts of A2 take the Dusk size. (c) Dusk sizes for all text. (d) All Dusk sizes scaled up. | (a): a heading and a description are reading text (R3 10). | B1, B2, B3, Y3 | Yes |
| `TILE-TONE` | The colour of a domain tile (R3 pick 4) | (a) One tone for each live domain, grey for a domain that is not live. (b) One tone for each of the seven domains. | (a): colour then says one thing (R3 10). | B1; S1 uses `--green` for the progress fill until then (R3 A12) | Yes |
| `FLASH` | A flashing lamp with reduced motion on (R3 pick 6; R5 pick 2; R4 pick 6; upgrade list 7.1). One question, after the SME answers. | (a) The flash stays, with the owner's exception to fence rule 6. (b) The lamp stops at full brightness and a word of the SME shows. | No recommendation here: R3 recommends (a) until the SME answers, R5 recommends (b). Neither is reskin work (R3 Check 10.6). | No Wave 2 job. B2 keeps the behaviour of today. | Yes |
| `FORM-CHANGE` | Look C2: the rule for the change of form during a job (`look-model2.notes.md` section 11) | (1) The rule as it is: between about 890 and 1460 px the form follows the state. (2) The form is selected for each job from its fullest authored state and kept for the job. (3) The form follows the window only: wide from about 1460 px. | (2), proposed by this document: the picture does not change during a job, and most laptops keep the wide form. The review gives no recommendation. A learner who leaves the authored line can still need more width (1428 px measured). | Y2 | Yes |
| `C2-WORDS` | The new words of look C2 (`look-model2.notes.md` section 12) and the six new labels NORMAL, REVERSE, ENGINE, BUILD, "foul point", "Route: LEAD → AS73" (R1 section 9, note 3) | Approve as written; change a word; leave a group out | Approve as written: each word explains a mark that the picked look adds, and none states a rule. The SME confirms the terms (R1 section 8). | Y2; Y4 (the switch words) | Yes |
| `YELLOW-WORD` | The help text says "yellow" for a reverse switch. The Dusk amber is darker than the yellow of today (R3 A1; R2 C16). With the SME. | (a) The words stay and the value stays an amber. (b) The words change (a U-row). | (a) until the SME answers. Whether a learner calls the Dusk amber "yellow" is not verified. | Y2, Y3 | Yes |
| `MIRROR-WORDS` | The wording of the text mirror of the Yard (R2 9, Y4 item 5; P-03) | Approve; change | Approve after the SME has read it (R5 note 5). | Y4 | Yes |
| `VERSION` | The first version number (R6 owner pick 5; P-24). The package name `clear-board` is in the plan. | `2.0.0`; `1.0.0`; another number | `2.0.0`, proposed by this document: the change request is named "Clear Board 2". | D1, G1-2 | Yes |
| `R7-P2` | The Yard sound default | (a) Off, with its own switch that holds. (b) On. (c) As today. | (a) (R7 12) | Y4 (`sound.js`) | Yes |
| `R7-P4` | The time of a travel leg | (a) 840 ms in, 420 ms out, as aliases. (b) 420 ms each. (c) 600 ms as today: a raw time. | (a) (R7 12). Not tested with learners. | Y2 | Yes |
| `R7-P5` | The arrival | (a) On request only. (b) One time for each visit, with a Skip. (c) Removed. | (a) (R7 12) | Y4; Y2 (the drawing of it) | Yes |
| `R7-P6` | Where the engine rests after a spot. After the SME (R7 note S4). | (a) Where the model has it. (b) On the lead, as today. | (a) (R7 12) | Y2 | Yes |
| `R7-P7` | The picture of a kick. After the SME (R7 note S1). | (a) The engine stops and the cars roll in alone. (b) As today. | (a) (R7 12) | Y2 | Yes |
| `R7-P8` | The watched optimal line | (a) A stepper with Next, Back, "Play all" and Stop; no done mark. (b) The film of today with a Stop. (c) As today. | (a) (R7 12). It meets rows U-04 and U-12. | Y4 | Yes |
| `R7-P9` | The sound for secure, flag and certify | (a) One new sound. (b) No sound. (c) As today. | (a) (R7 12) | Y4 | Yes |
| `R7-P10` | Replay controls | (a) The move log, before and after, "Play again". (b) The move log only. (c) None. | (a) (R7 12) | Y4 | Yes |
| `R7-P11` | Controls during motion | (a) A new input ends the running effect. (b) The lock stays, with a disabled state and words. | (a) (R7 12). Risk: a double press makes two moves; not tested. | Y4 | Yes |
| `R7-P12` | The cost of a move in words | (a) Yes. (b) No. | (a) (R7 12). The SME checks the words. | Y4 | Yes |
| `R7-P13` | The sound of a spot. After the SME (R7 note S2). | (a) The coupling sound only when the drawing shows contact. (b) As today. | (a) (R7 12) | Y4 | Yes |
| `R7-P14` | After Depart | (a) The lead shows empty and the job is closed until Reset. (b) As today. | (a) (R7 12) | Y4; Y2 | Yes |
| `R7-P15` | The trace of the last move | (a) Yes. (b) No. | (a) (R7 12): it is the static form of each travel effect. | Y2 | Yes |
| `R7-P16` | The banner after a switch throw | (a) A throw clears a refusal that is no longer true. (b) As today. | (a) (R7 12) | Y4 | Yes |

Note on the R7 picks. `upgrade-list.md` merges R4, R5 and R6 only (its lines 6 to 8). The picks of
R7 are not rows of it. The lead puts them to the owner. Until a yes, Y2 and Y4 keep the behaviour
of today for each one: each pick has an option "as today".

## E.2 The lead rules

| Name | The question, and the source | Options | Recommended, with the reason | Jobs that wait | 2a |
|---|---|---|---|---|---|
| `FILES` | Each [P] of Part A (R6 16 items 6 and 7; upgrade list 7.4, 7.5) | Accept; change a row | Accept: each file then has one owner in each wave. | G1, S1, Y1 (the Files lines) | No |
| `BRANCH` | The plan asks one session and one branch (fence rule 9), and one draft pull request for each wave (section 9) | (1) One wave branch and one branch for each job; the lead merges each job branch into the wave branch; one draft pull request from the wave branch. (2) One draft pull request for each job. (3) All jobs commit to one branch. | (1): it keeps both sentences of the plan. Whether a session can push a branch name of its choice is not verified. | All jobs | No |
| `Y1-STEPS` | Y1 cannot prove a style on Dusk tokens on its own branch (D.2) | (a) Two steps; step 2 after G1 and S1 are on the wave branch. (b) Y1 does the split only; Y3 moves the Yard style to tokens in 2b. (c) Y1 starts after S1. | (a): the plan asks for "a style file on bridge tokens" from Y1, and step 1 stays parallel. | Y1 | No |
| `G1-STEPS` | G1-close at each merge and G1-2 in 2c (A.2) | Accept; the lead makes the tightening commits itself | Accept: `tools/**` and `package.json` keep one line of ownership. | G1 | Yes |
| `B3-LINE` | Widen the Files line of B3 for `radioSim.js` (R3 16 item 4; R6 16 item 1; upgrade list 7.3) | Widen; excuse the 29 colours in the lint | Widen: the raw-colour gate cannot reach zero without it (R6 ENG-09). | B3 | Yes |
| `TOOLS` | Vendor the reskin tools or write small equivalents (R6 16 items 4 and 9; upgrade list 7.7). The tools repository is private and this repository is public, so the owner must agree to (a) or (b). | (a) Vendor `dusk-sync.mjs` and `token-lint.mjs` to `tools/reskin/`; the look tool stays outside and G1 writes a small picture script. (b) Vendor all three. (c) G1 writes small equivalents of all three. | (a): both tools work on this repository as they are (R6 5.2, 5.3), and their own README describes this form. Without the owner's word: (c). | G1 (steps 2 and 3, the look harness) | Yes. G1 starts with the hash gate, lint, `tsc`, the unit tests, the smoke test and the workflow. |
| `NODE` | The Node line and `engine-strict` (R6 16 item 10; upgrade list 7.6) | Node 22 or 24; `engine-strict` now or later | `.nvmrc` with `22.23.5`, the version of each measurement; the unit tests were not run on 24. `engine-strict` later: the Node of the machine that makes the Windows build is not known. | G1 | Yes |
| `CSS-MARK` | A `✔` or `✕` mark in CSS on an option, a result and a message (R3 section 4, the ruling; 16 item 8) | (a) The mark is a change of look: the parts keep it. (b) The mark is content: the parts lose it and row U-06 must add words. | (a): fence rule 5 asks for more than colour, and the mark is not a word. | S1 (parts G1, G9, G14) | Yes. S1 needs it before it reports done. |
| `DYS-SPACING` | The spacing of the dyslexia mode inside buttons and inputs (R3 A6, 16 item 9). The upgrade list puts it in the plan as P-10. | (a) Reskin work: one rule in the parts file. (b) A U1 row. | (a), as one rule of S1, not as two rules of B1 and B2: fence rule 7, and one writer for one rule. | S1 | Yes |
| `TAB-MARK` | A selected tab with no mark (R3 Check G10, 16 item 10) | Accept; ask U1 for a mark | Accept: it is the same as today and as the Dusk part, and `aria-selected` carries the state. | B3 | Yes |
| `READ-ORDER` | Four rows of the mapping changed the reading order (R3 A5) | Keep the DOM order of today; accept the new order | Keep the order of today: a change of reading order is a change for a screen reader (fence rule 3). | B2, B3, Y3 | Yes |
| `REF-ROW-ICON` | A Reference row: an empty icon square, or a one-column row (R3 Check 2.4.7) | The icon square; the one-column row | The one-column row: no new picture element on 219 rows. Neither form was drawn on the real list. | B2 | Yes |
| `READOUT-CELLS` | The Yard readout: one element (R3 2.7) or three cells with the same words (R1 section 9, note 4) | One element; three cells | One element until Y3 shows both in pictures. The view function of C.4 allows both. | Y3 | Yes |
| `GOLD` | The plan says "gold is chrome only". Dusk says "chrome and selection" (Dusk `ARCHITECTURE.md`, the three rules of the lit panel, rule 2; checked). Each sketch uses gold for the lined route, the engine and the goal (R1 section 7; R1 section 9, note 2). | (a) Gold for these three selection meanings. (b) No gold in the drawing: `--ink` at double weight. | (a): the Dusk source is the law of the skin, and the plan line is its short form. The lead tells the owner. | Y2. S1 declares the values of (a). | Yes |
| `SWITCH-BUTTONS` | Who builds the six switch buttons (R2 9, Y4 item 1; C.5) | (a) Y2 keeps a pointer path in 2b; Y4 adds the buttons in 2c. (b) Y2 builds the buttons in 2b. | (a): the plan gives the controls to Y4, and the Yard stays playable at the end of 2b. | Y2, Y4 | Yes |
| `MOTION-STOP-OWNER` | Who builds "motion that stops" (R2 9, Y2 item 9; P-01) | Y4 in 2c; Y2 in 2b | Y4: the stop needs the controller, which is closed in 2b. It is a change of behaviour with its own line in the record. | Y2, Y4 | Yes |
| `SOUND-OWNER` | No job owns `sound.js` (R7 11.2, rule 9) | Y4; U1 | Y4: the sound control is a Yard control. | Y4 | Yes |
| `UNMOUNT` | A teardown call from React to an island (C.3; R7 section 14) | Y4 adds it in 2c; no change | Y4 adds it: it ends a script error. It is a change of behaviour, so it has its own commit. | Y4 | Yes |
| `2C-ORDER` | U1 rows that touch a Yard file, and rows U-16, U-23, U-39 (upgrade list 7.9) | (a) They start after Y4 is merged, as a second step of U1. (b) Y4 carries them. | (a): Y4 stays the access layer, and each Yard file has one owner at a time. | U1, Y4 | Yes |
| `SWEEP` | The dead rules of `src/index.css` after 2b (C.2) | U1 in 2c; B1 as a last step of 2b | U1: B1 cannot delete a shared rule before B2 and B3 are merged. | U1 | Yes |
| `DOCS-WRITER` | Who writes `CHANGELOG.md` and the other root documents | D1 only; each job writes its own lines | D1 only: five jobs of one wave must not write one file. | D1 | Yes |
| `TAURI` | `src-tauri/**`: the window colour, the icon set, the version, two lines with a name | (a) It waits for a session that can make the Windows build, and goes on the list of plan section 7. (b) A 2c job edits the text fields and makes the icon files, marked "not verified". | (a): nothing here can prove the desktop build (R6 9.2). | None | Yes |
| `ICON-PNG` | The PNG set of the new icon for the manifest (Gate A question 3; P-26) | (a) S1 in 2a. (b) B1 in 2b. (c) It waits. | (b): S1 replaces the SVG in 2a, and the manifest keeps one SVG icon as today. The PNG files can be made with the Chromium of this machine. No phone launcher was tested: not verified. | S1 or B1 | Yes |
| `PICTURES` | Are the pictures of a job committed (C.7) | (a) Committed in the folder of the job. (b) An artifact only. | (a): the plan asks for pictures "attached", and Wave 1 committed its pictures. | All build jobs | Yes |
| `RED-IN-SIGNAL` | A red lamp in the frozen signal drawing against fence rule 5 (R3 section 11, note 4) | Record the exception | Record it in `DECISIONS.md`. No file changes. | The lead | Yes |
| `AUDIT-FIX` | Only if row U-47 gets a yes: `npm audit fix` against fence rule 10 (R6 16 item 8; upgrade list 7.11) | Allow one lock change in its own commit; refuse | Allow, in its own commit, with no downgrade of the PWA plugin. | G1-2 | Yes |
| `TUNABLES` | Only if row U-50 gets a yes (R6 16 item 11; upgrade list 7.10) | A typed module in `src/core/`; a JSON file | A typed module. A JSON file must not be in `public/data/`. | U1 | Yes |

## E.3 Closed, or closed by this contract

| Item | State |
|---|---|
| Plan fact T4 (R6 16 item 5; upgrade list 7.8) | Closed. The plan file has the correction (its lines 13 to 15). |
| The 44 px switch target on a phone (R5 pick 5) | Closed by the owner's answer to question 2: full play on a phone. |
| The word tape before B3 (R6 16 item 12) | Not a ruling. G1 records it in 2a (C.6). |
| The deploy line 26 (R6 16 item 3) | Not a ruling. It is in the row of `deploy.yml` (A.3.1). |
| The engineer's edge in the guided Radio (R3 A1, 16 item 6) | Closed inside the fence: the edge stays a green (`--green`), because the screen says "Green lines are the engineer" (`radioSim.js:76`). A word change is a U-row. |
| The inline opacity at `yardSim.js:538` (R3 16 item 5) | Closed by C.4: Y1 moves it into the view, Y3 removes it. |
| The mast and the housing ring under 3:1 (R3 16 item 1) | For the SME (R3 section 11, note 2). No ruling of the owner or the lead. |

## E.4 Rulings that the briefs, the ARCHITECTURE draft and the check added

Each one is for the lead, except where the row says the owner. Each brief says what its job does
until the ruling. "2a" says whether Wave 2a can start without the ruling.

| Name | Added by | The question | Options | Recommended, with the reason | Jobs that wait | 2a |
|---|---|---|---|---|---|---|
| `DEV-DEP` | G1 brief (R19) | One new development package for the browser gates. The plan gives the lock file to G1 and forbids a fresh resolve (fence rules 9 and 10). | (a) `playwright` 1.63.0 exact, added by additions only: 2 new lock entries. (b) As (a), with `pixelmatch` 8.0.0 and `pngjs` 7.0.0: 4 new entries; needed only with `TOOLS` (b). (c) No package: the scripts use the Playwright of the machine. | (a): the plan asks for a browser test, and one pinned package is the smallest change. With (c) a clean `npm ci` cannot run the browser gates. | G1 (the smoke test, the look harness) | Yes. G1 starts with the parts that need no package. |
| `TAPE-FORM` | G1 brief (R23) | What a record of the Radio word tape holds. | (a) A SHA-256 and a word count. (b) The text. | (a): the repository then holds no second copy of the call wording (fence rule 2). Weak point: a failure names the press, not the word. | G1 | Yes. G1 records form (a). |
| `LOOK-PAGES` | G1 brief (R25) | The pages of the look harness beyond the eight of C.7. | (a) The eight pages, `yard@w1280`, and three reading-mode pages. (b) The eight pages and `yard@w1280` only. | (a): fence rule 7 needs a picture proof of each reading mode. | G1; S1 uses the same three names | Yes. G1 builds (a). |
| `LOOK-CI` | G1 brief (R18) | The look compare in `check.yml`. | (a) A report that does not fail the run. (b) It fails the run. | (a) in 2a: the smoke test is the gate. The lead can change it at G1-close. | G1 | Yes |
| `LOOK-IDS` | the check of the briefs (B.6) | Two ids go by this contract (`yard-style` in 2a, `yard` in 2b). The look tool fails on a lost id and has no allow list for an id. | (a) A key `idsMayGo` in the config of the harness, with exactly these two ids. (b) The harness reads ids inside `body` only: this covers `yard-style` and not `yard`. (c) No change: the lead accepts the one failure line by hand at each merge. | (a) where G1 writes the picture script (`TOOLS` a or c). With `TOOLS` (b) the tool is a byte-for-byte copy, so (c). | G1 (R25); Y1 (the look compare of its step 1); the lead (D.3, point 2) | Yes. G1 builds (a). Y1 names the one line as expected. |
| `S1-PILLS` | S1 brief | Fence rule 8 says "no pill buttons". `src/index.css` has seven pill corners; two are controls (the tip link, the toggle track). | (a) They stay in 2a and go in 2b with the Dusk parts. (b) S1 changes the seven values now. | (a): the plan says that the app keeps its shapes in S1. | S1; B1, B2 | Yes. S1 keeps them. |
| `HORIZON` | S1 brief | The Dusk horizon shows low on the page in 2a, because no Dusk window covers it (R3 Check 6.4). | (a) Keep it. (b) Hide it with one rule of the S1 floor block until B1 adds the window. | (a), if no text pair over it measures under 4.5 on the real build. | S1 | Yes. S1 measures and reports. |
| `ICON-SVG` | S1 brief | One path, `public/favicon.svg`, has two uses (the tab icon, the manifest icon). The picked icon has two drawings: the master (32 px and larger) and the 16 px drawing. | (a) The 16 px drawing for both uses, until the PNG set exists. (b) The master for both uses. (c) Two files: `favicon.svg` (the 16 px drawing) and a new `public/icon.svg` (the master, for the manifest). | (c): each use gets the drawing that was made for it. It needs one new path in the matrix. | S1 | Yes. S1 builds (a). |
| `YARD-BLOCK` | S1 brief | The selector of block 6 of the bridge. | `:root`; `.yard-wrap` | `:root`: the picked sketch declares its values there, and a value on `:root` does not meet the old `--ink` of the Yard. | S1; Y2 | Yes. S1 writes `:root`. |
| `S1-FLOOR-BLOCK` | S1 brief (C.2) | Who deletes the rules that S1 adds to `src/index.css` to keep the shapes. | (a) `body { padding: 0 }` joins the B1 list; the other rules stay until the sweep of U1. (b) Another owner. | (a): B1 adds `.dusk-stage--app`, and the padding rule must go in the same commit. | B1, U1 | Yes |
| `Y1-TAPE` | Y1 brief (C.4) | Where the recorder of the Yard tape and the tapes live. This contract gives Y1 no file in `tests/**` or `tools/**`. | (a) The script stays in the scratch folder of Y1; the tapes and the summary are committed in `specs/pictures/2a-Y1/`; the report holds the script text. (b) The lead adds `tests/browser/yard-tape.mjs` to the Files line of Y1. (c) G1 writes the recorder, and Y1 waits. | (a): no file of G1 gets a second writer, and Y1 stays parallel. | Y1; G1-close or G1-2 (if the recorder becomes a test) | Yes. The script is in the scratch folder in each option. |
| `YD-LEGEND` | Y1 brief (B.2) | The class of the rules legend of the chrome. The prefix rule gives `yd-legend`, and B.2 gives that name to Y2. | (a) `yd-rules-legend`, the name of the picked sketch. (b) `yd-legend` for the chrome, and Y2 takes another root name. | (a): the sketch and Y2 keep their name. | Y1; Y2, Y3 | Yes. Y1 writes (a). |
| `YARD-BLOCK-2C` | ARCHITECTURE draft (A.3.2) | The Yard block of the bridge has no owner in 2c. | Y4; U1; closed | Y4: A.5 gives Y4 each Yard file in 2c. | Y4, U1 | Yes |
| `ISLAND-COMMENT` | ARCHITECTURE draft | The head comments of `imperativeStation.ts` (lines 1 to 4) and of `Radio.tsx` (line 2) call an island "byte-for-byte". That is not true today, and it is less true after Y1. `imperativeStation.ts` has an owner in 2a only with a yes to U-46. | (a) Y1 edits lines 1 to 4 of `imperativeStation.ts` in each case; B3 edits `Radio.tsx:2` in 2b. (b) Y4 in 2c. (c) D1. | (a), as the draft recommends: Y1 corrects the same claim in `Yard.tsx` (A.3.3). Cost: one more [P] file for Y1 in 2a. No gate reads a comment, so (b) breaks nothing. | Y1 or Y4; B3 | Yes. Until the ruling Y1 does not edit the file without U-46. |
| `ARCH-UPDATE` | ARCHITECTURE draft (A.3.8) | Who changes "today" and "planned" in `ARCHITECTURE.md` after a wave is merged. | (a) The lead at each wave merge, and D1 for the last pass. (b) D1 one time in 2c. | (a): A.3.8 gives the file to the lead in 2a and 2b. | The lead, D1 | Yes |
| `ARCH-GATE` | ARCHITECTURE draft | The "must not contain" columns of the ARCHITECTURE draft are proved only in part by the gates. | (a) No new gate. (b) G1-2 adds a layer check in 2c. | (a): each seam rule of C.4 has a pass check in the Y1 brief. | G1-2 | Yes |

---

# Part F. Not verified

1. The load order of C.1 with the six surface sheets. R3 built the first eight imports only.
2. That a CSS file with one comment and no rule builds with no warning in Vite 8.1.0.
3. That a deletion of the shell rules `.stage` and `.bar` changes no island (C.2).
4. Closed by the check of the briefs: `oxlint --max-warnings` was run. It exits 0 with the limit 5
   and 1 with the limit 4 (version 1.71.0, the tree of `fc49394`).
5. That Vite resolves a `.js` import path to a `.ts` file. The contract does not depend on it.
6. That the drawing adapter of C.4 can hold the canvas with no change of behaviour. It is a design
   from a reading of `yardSim.js`. Nothing was built.
7. That step 1 of Y1 gives pictures equal to the baseline pixel for pixel. R6 found the Yard
   pictures stable; no split was built.
8. The theme colour from `--glass` at build time (R3 3.7, Check 3.7.2): a design, not built.
9. The PNG set of the icon on a phone launcher. Only Chromium rendered the icon
   (`gate-a-answers.md`, question 3).
10. Each statement about the Windows desktop build.
11. The reading of the page law (R7 section 4; R3 section 6). The law text is in no repository
    that a session can read.
12. Whether a session can push a branch with a name of its choice (`BRANCH`).
13. The line numbers of `specs/clear-board-2-plan.md` that R6 section 12 cites. The plan file got
    a corrections block after R6 was written, so those numbers moved.
14. The recommended options that this document proposes itself (`FORM-CHANGE`, `VERSION`): no
    report recommends them.
15. Each "not verified" mark of a report that a row of this document cites stays in force. This
    document repeated no measurement of a report except the checks of B.7 and Part G.
16. Added by the check of the briefs. That no control gets smaller at the S1 merge on the Linux
    test machine. The font stack changes from the app stack to `--font-ui`. On this machine the
    app stack resolves to Liberation Sans and the Dusk stack to Inter (`fc-match`, checked; the
    face that Chromium draws was not read back). A
    control that takes its width from its text can change by 1 px or more. The look tool fails a
    control that is 1 px smaller (`visual-regress.mjs:504`, checked). No build measured it.
17. Added by the check of the briefs. That Vite puts the style of the lazy Yard chunk in force
    before `mount` runs (the Y1 brief, step A1 of its tape, tests it).
18. Added by the check of the briefs. The run history of the deploy workflow (the G1 brief, F3.2)
    was not read again by the check.

# Part G. Evidence

Scratch folder of this job:
`/tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/contracts/`

| File | What it is |
|---|---|
| `names.mjs` | Reads the six Dusk files and the app files. Lists each declared custom property, each class, each attribute that Dusk reads, and tests each name of B.1 and B.5. |
| `dusk-names.json` | Its output: the 268 Dusk names and the 152 Dusk classes. |

Opened and read for this document: `package.json`, `vite.config.ts`, `index.html`,
`.github/workflows/deploy.yml`, `.gitignore`, `.oxlintrc.json`, the three `tsconfig` files,
`src/main.tsx`, `src/index.css`, `src/App.tsx`, `src/state/AppContext.tsx`,
`src/stations/imperativeStation.ts`, `Yard.tsx`, `Radio.tsx`, `Signal.tsx`, `yardSim.js` (all 718
lines), `radioSim.js` (lines 1 to 36 and 120 to 150), `yard/anim.js`, `yard/sound.js`,
`yard/render.js` (lines 1 to 30), `src-tauri/tauri.conf.json`, `src/styles/dusk.lock.json`, the
six Dusk files (by script and by `grep`), `/home/user/dusk/ARCHITECTURE.md` (lines 69 to 82 and 98
to 116), `token-lint.mjs` (the baseline lines), `visual-regress.mjs` (the options and line 416),
and `look-model2.src.html` (lines 8 to 103, 122 to 140).

No git command that changes something was run. No `npm install`, `npm ci` or `npm run build` was
run in the repository. This job wrote this file and its scratch folder only.

---

# Check record

Check of the Wave 2a paper, 2026-11-20, on the tree of commit `fc49394`. The checker assumed each
statement wrong until it opened the file or ran the script. The checker changed no code and no
content, ran no git command that changes something, and ran no `npm install`, `npm ci` or
`npm run build` in the repository. Read-only runs in the repository: `oxlint`, `git diff`,
`git show`, `sha256sum`, and the two package-free reskin tools from their own folder. Scratch
folder:
`/tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/brief-check/`
(`form.mjs`, `owner.mjs`, `tokens.mjs`, `bridge.mjs`, `steps.mjs`, `hashes.txt`, `tsc-empty/`). A
scratch folder can be gone.

Result words: **pass** (checked, no change), **repaired** (the text changed; the row says what),
**open** (the lead must rule or a build must prove it; the row says why).

| # | Check | Result | What |
|---|---|---|---|
| 1 | Form | pass | This file is not a brief. It needs no six lines. It names the fence by its source (plan section 4) and each brief carries the 15 items word for word (`form.mjs`: 15 of 15 equal in G1, S1 and Y1). |
| 2 | Ownership | repaired | `owner.mjs` over the three Files lines: 0 overlaps. Each Files line equals its rows of A.3. Repaired in A.5: line 26 of `deploy.yml` and the removal of the Dusk copy are narrowings of a plan line, and the surface sheets are inside the plan line `src/styles/**`; none of them is a widening that needs `FILES`. Repaired in A.3.2: the Yard block of the bridge had no owner in 2c (`YARD-BLOCK-2C`). Open: `ISLAND-COMMENT` (a false comment in two files with no 2a owner). |
| 3 | Parallel safety | repaired | Six points where one 2a job declares and another reads. (1) B.1 rule 1: a part must not set a Dusk name; R3 G19 sets `--led-size`, which Dusk declares (`dusk.tokens.css:377`), and the name check of G1 fails on it. (2) B.6: the look tool fails on a lost id and has no allow list for an id; Y1 removes `yard-style` (`LOOK-IDS`). (3) B.4: the allow file of the name check needs the list `legacy`, or the step is red on each branch. (4) B.2: `yd-legend`, the class `yd-view` on the canvas in 2a, and `yd-bar` in two groups. (5) B.1: S1 deletes lines 2 to 10 of `src/index.css`, not lines 3 to 5 and 10. (6) C.7: the picture names that the three briefs add. Checked with no change: each npm script name, each `data-cb` value, each tool path and each ruling name has one spelling in the five files (a `grep` list for each file); the 59 bridge names and values of B.1 and B.5 are equal to the S1 brief (`bridge.mjs`, 0 differences). |
| 4 | The fence | pass | No row edits a frozen file, writes a rule, adds a timer or a `schedule` trigger, or changes a line of `deploy.yml` other than line 26. No rule number is in this file (`grep`). No U-row is a requirement: each one is under E.1 with "waits". One exception to fence rule 4 stays open by design: the three copied colour values in the new `public/favicon.svg` wait for row U-45, and the baseline covers the file. |
| 5 | Truth | repaired | Opened and equal: each line citation of C.3 and C.4 into `yardSim.js` (more than 60 lines printed), `imperativeStation.ts:9`, `:17-29`, `:34`, `:37`, `Yard.tsx:7-8`, `Radio.tsx:12-13`, each hook line of B.6 in the six React files, `AppContext.tsx:57-60`, `src/index.css:14`, `index.html:2`, `:12`, `vite.config.ts:17`, `:38`, `deploy.yml:26`, `geometry.js:5`, `anim.js:4`, `:7`, `:11`, each sketch line of B.5 (`look-model2.src.html`), `token-lint.mjs:249`, `visual-regress.mjs:416`, and the counts of B.7 (268 names, 152 classes, `--lanes` the one name read and not declared: `tokens.mjs`). Repaired: B.4 and F item 4 said that `oxlint --max-warnings` was not run; it is run. |
| 6 | Completeness | repaired | Part E did not hold the rulings that the briefs and the ARCHITECTURE draft add. E.4 now holds 16 rows. D.2 has three new dependency rows and one longer row. D.3 says when `check:colour` is red on the branch of Y1 and what G1-close does. Each row P-01 to P-27 of the upgrade list that names G1, S1 or Y1 is in a brief (the record of each brief has the list). |
| 7 | Buildability | repaired | The tree at the end of 2a against the gate of G1, step by step: green, with the three ratchets and with repairs (1) and (3) of check 3. Proof by reading and by the two reskin tools on the tree of today (216 raw colours in 10 files; 5 lint warnings). Not built: Part F. New in D.2: the tests project of G1 needs its first test file in the same commit (`tsc -b` error TS18003, tried). Open: F item 16 (a control can get smaller with the face change on the Linux machine). |
| 8 | Gate answers | pass | Look C2: B.5 takes its values from `look-model2.src.html`. Full play on a phone: E.3 closes the 44 px question; the phone test is G1-2 with Y4. The monogram: A.3.1 and A.4 (`public/favicon.svg`). Still open and not decided here: `FORM-CHANGE`, `C2-WORDS`, `GOLD`, `ICON-PNG`, `ICON-SVG`, `TAURI`, and each U-row (question 4). The values that S1 declares for `GOLD` option (a) are a fallback that B.5 marks. |
| 9 | Voice | pass | No name of a person, no job title for the owner, no personal history, no contraction, no exclamation mark (`grep`). |

Open after this check, for the lead: each row of Part E; F items 16 to 18.
