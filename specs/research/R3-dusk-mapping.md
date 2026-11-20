# R3 — Clear Board mapped onto Dusk 0.2.0

Wave 1 research. Read-only on code and content. Written 2026-11-20 on branch `claude/peaceful-mayer-qat99l` at commit `1e48578`.

This report holds five things for the build jobs S1, B1, B2, B3 and Y3:

1. Table 1, the mapping: each screen part to a Dusk part.
2. Table 2, the bridge: each old token name to a Dusk token.
3. Table 3, the gap register: the parts Dusk lacks, each with a page-local specification.
4. The reading-mode plan and the page-law tier.
5. Table 4, the contrast table, measured.

A statement in this report is checked or it is marked "not verified". Section 13 lists everything that is not verified. Section 10 lists the picks that only the owner can make.

**Checked on 2026-11-20 by a second agent, at commit `cb51d4b`.** The checker assumed each claim was wrong and made each number again. Each section now ends with lines that start with "Check". A check line says one of four things: confirmed (and how), corrected (and what changed), not verified (and why), or refuted. Where a statement was refuted, the text in place is now the corrected text, and the old statement is in section 17, "Withdrawn". Section 15 holds the findings that the check added. Section 16 holds the fixes that cannot stay inside the fence without a ruling. The checker's scripts and pictures are in `/tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/R3-check/`.

The five results that change work in Wave 2:

1. The draft rules that name a Dusk class with no app class in the selector fail the strict namespace check of the reskin tools. Corrected selectors pass (section 15, A4).
2. The mapping makes some reading text smaller than today, for example the question heading from 20.8 px to 13 px (section 15, A2). Owner pick 3 said that no reading text gets smaller. That statement is withdrawn.
3. Three sentences on the screen name a colour ("yellow", "green", "Green lines are the engineer"). A reskin changes no word, so the new colours must keep these sentences true (section 15, A1).
4. `.dusk-rows` changes to columns of 150 px or more below 760 px. The Reference list has 219 rows and becomes two narrow columns on a phone (section 15, A3).
5. The Yard and the guided Radio keep their old palettes after S1, because their own declarations come later in the cascade than the bridge (section 15, A7).

The count: 219 check lines. 149 confirmed. 50 corrected. 5 refuted (section 17). 15 not verified. 13 findings added (A1 to A13 in section 15), with 2 notes for the SME (5 and 6 in section 11) and 8 traps (15 to 22 in section 9) that point at them. 10 items are in section 16.

---

## 0. How each number was made

- **Dusk files.** I read the six layer files in `src/styles/dusk/`, and `ARCHITECTURE.md`, `DECISIONS.md`, `ROLLOUT.md`, `README.md`, `preview/index.html` and `preview/desk.html` in the Dusk repository. `sha256sum` of the six files matches `src/styles/dusk.lock.json`. `cmp` shows each file is equal to `/home/user/dusk/styles/` at commit `1f7f971`.
- **App files.** I read `src/index.css`, `src/App.tsx`, `src/main.tsx`, each file in `src/stations/`, `src/stations/yard/render.js`, `anim.js`, the head of `geometry.js`, `src/core/signal.ts`, `src/state/AppContext.tsx`, `index.html`, `vite.config.ts`.
- **The running app.** The built app at `http://127.0.0.1:4173/` was open in Chromium (Playwright) at 1440 and 390 for Home, Reference, Drill, Signals, Yard, Radio (both modes) and Settings. No route scrolls sideways at either width today.
- **Contrast.** Each ratio is WCAG 2 contrast. The method is the one in `/home/user/dusk/lib/color.mjs` (`luminance`, `contrast`, `over`). A harness page holds the six Dusk layers byte for byte (through `inline-dusk.mjs`), a draft bridge and a draft of each page-local part. Chromium renders it. A script reads the computed colour of each text node, composites each background layer from the root down, and gives the ratio. A gradient gives one candidate for each stop, and the table keeps the worst one. A second script hides all text, takes a picture and reads the real ground pixels under 18 samples. The real worst value is equal to or better than the table value in 11 samples and lower in 7, because an inset glow adds light near an edge. The differences: strip key label 5.41 against 5.56; three tile sub-lines 8.52 to 8.76 against 8.75 to 8.91; wrong option 13.81 against 13.90; refusal banner 15.65 against 15.88; score figure 11.26 against 13.40. The white cap labels, the lowest pairs in the table, are better in the picture (4.98 to 5.35 against 4.55 to 4.67). No sample is under 4.5.
- **Scratch files** (not in the repository): `/tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/R3/`. The important ones: `bridge.draft.css`, `parts.draft.css`, `map.html` (the harness), `map-measure.json` (all Dusk measurements), `today.json` (measurements of the app as it is), `shots/` (pictures).
- **The web.** `WebFetch` could not resolve `www.w3.org`, `vite.dev` or `www.brailleinstitute.org` from this session. `WebSearch` worked and gave summaries only. A fact that comes from a search summary says so. A fact from model knowledge is marked "not verified".

Checks for section 0:

- **Check 0.1: confirmed.** `sha256sum` of the six files is equal to `src/styles/dusk.lock.json`. `cmp` gives no difference from `/home/user/dusk/styles/`. The Dusk repository is at `1f7f971`. The reskin tool `dusk-sync.mjs check --expect 0.2.0` says "6 files match the lock · dusk 0.2.0 · 1f7f971".
- **Check 0.2: confirmed.** No route scrolls sideways today. The checker opened Home, Reference, Drill, Signals, Yard and Radio at 1440 and at 390 with its own script (`today.mjs`): `scrollWidth` is equal to `clientWidth` on each. The scroll width was not read again with the Settings dialog open.
- **Check 0.3: confirmed, with a second method.** The checker did not use the report's walker. It made each ratio again with `/home/user/dusk/lib/color.mjs` from the hex values and from the token values in `dusk.tokens.css` (`recompute.mjs`). It also wrote its own pixel reader (`s1floor.mjs`): text is hidden, a picture is taken, nine ground pixels are read under each text node. On the app as it is, the pixel reader gives the same values as section 7.5 (2.76, 4.59, 4.72, 4.27, 4.13, 5.13, 5.16, 4.83, 4.97).
- **Check 0.4: not verified.** The 18 pixel samples of the report's own picture check (5.41 against 5.56, and the others in this paragraph) were not made again. The files are in the report's scratch folder.
- **Check 0.5: confirmed.** `www.w3.org` did not resolve for the checker also. `raw.githubusercontent.com` did resolve (see section 13).
- **Check 0.6: confirmed.** The branch is now at `cb51d4b`. `git diff --stat 1e48578 HEAD -- src public index.html vite.config.ts src-tauri` is empty, and `git status` shows no change in those paths. Each line number in this report was read against that tree.

---

## 1. Facts checked first

| Fact | Result | Where |
|---|---|---|
| T1, shell palette | 22 raw colours in rules, 22 different values. 3 more are in one comment. | `src/index.css:3-5,10,21,42,64,93,94,102,117`; comment at `:20` |
| T1, Yard inline CSS | 44 raw colours: 43 hex and 1 `rgba()`. 36 different values. The plan says 43: that is the hex count. 13 are variable declarations, 31 are typed in rules. | `src/stations/yardSim.js:44-48` and `:58-137` |
| T1, Yard canvas palette | 22 raw colours, 22 different values: 17 in the `C` table, 5 typed in drawing code. | `src/stations/yard/render.js:10-19,102,120,166,175` |
| T1, Radio island | 45 raw colours, 25 different values: 16 in `RADIO_CSS`, 27 in SVG attributes of `RADIO_HTML`, 2 in script. The plan says 45: correct. A plain regular expression also matches the entity `&#9654;` at `:163`, which is not a colour. | `src/stations/radioSim.js:6-33`, `:45-66`, `:145` |
| More raw colours, not in T1 | `index.html:7` (1), `vite.config.ts:32-33` (2), `src-tauri/tauri.conf.json:24` (1), `public/favicon.svg` (34, 5 values), `public/icons.svg` (10, 3 values). Frozen files: `yard/geometry.js` (10), `core/signal.ts` (15, 13 values). | counted with `count-colours.mjs` |
| The theme colour is not the app ground | `index.html` and the manifest say `#0d1117`. The shell ground is `#0e1116`. Tauri says `#0e1116`. | `index.html:7`, `vite.config.ts:32-33`, `src/index.css:3`, `tauri.conf.json:24` |
| T8 | `DECISIONS.md` has no line `Page law tier:`. No `ARCHITECTURE.md` in the repository root. | `grep -n -i "page law\|tier:" DECISIONS.md` gives nothing |
| A script reads a token | No. `getComputedStyle` and `getPropertyValue` do not occur in `src/`. | `grep -rn "getComputedStyle\|getPropertyValue" src/` gives nothing |
| A table in the app | No. `<table` does not occur in `src/`. | `grep -rn "<table" src` gives nothing |
| The dyslexia face is shipped | No. `src/index.css:9` names "Atkinson Hyperlegible". No `@font-face` rule and no font file is in `src/`, `public/` or `dist/`. | `find` for `*.woff*`, `*.ttf`, `*.otf` gives nothing |
| Dusk class names clash with app class names | No. Each Dusk class starts with `dusk-`. No app class does. | `ARCHITECTURE.md` "Namespace"; `src/index.css` |

Checks for section 1, one for each row:

- **Check 1.1: confirmed.** Shell palette: 22 raw colours in rules, 22 values, on lines 3 (4), 4 (2), 5 (4), 10 (5), 21, 42, 64, 93, 94, 102 and 117 of `src/index.css`. The comment on line 20 holds 3 more. Counted with `grep -n -o` for each line.
- **Check 1.2: confirmed.** Yard inline CSS: 44 raw colours (43 hex, 1 `rgba()`), 36 values. 13 are on lines 44 to 47 (declarations). 31 are in rules: line 48 (1) and lines 58 to 137 (30).
- **Check 1.3: confirmed.** Yard canvas: 22 raw colours, 22 values. 17 are on lines 11 to 18 (the `C` table is lines 10 to 19). 5 are on lines 102, 120, 166 and 175 (2).
- **Check 1.4: confirmed.** Radio island: 45 raw colours, 25 values: 16 in `RADIO_CSS` (10 on lines 6 and 7, 6 in rules), 27 on lines 45 to 66, 2 on line 145. The entity `&#9654;` is on line 163.
- **Check 1.5: confirmed.** The counts for `index.html`, `vite.config.ts`, `tauri.conf.json`, `public/favicon.svg`, `public/icons.svg`, `yard/geometry.js` and `core/signal.ts` are the output of the report's `count-colours.mjs`, run again. The script finds hex and `rgb()` forms only. A separate `grep` for colour names in `src/index.css`, `yardSim.js`, `radioSim.js` and `render.js` found one keyword in a rule, `transparent`, on `src/index.css:33` and `radioSim.js:27`.
- **Check 1.6: confirmed.** `index.html:7` and `vite.config.ts:32-33` say `#0d1117`. `src/index.css:3` and `src-tauri/tauri.conf.json:24` say `#0e1116`.
- **Check 1.7: confirmed.** `grep -n -i "page law\|tier:" DECISIONS.md` gives nothing. `ARCHITECTURE.md` is not in the repository root.
- **Check 1.8: confirmed.** `grep -rn "getComputedStyle\|getPropertyValue" src/` gives nothing.
- **Check 1.9: confirmed.** `grep -rn "<table" src` gives nothing.
- **Check 1.10: confirmed.** `find` gives no `*.woff*`, `*.ttf` or `*.otf` outside `node_modules`. `grep -rn "font-face" src public index.html` gives nothing.
- **Check 1.11: confirmed.** The six layer files hold 151 different `dusk-` class names (counted by script, comments removed). No file in `src/` outside `src/styles/dusk/` holds the text `dusk-`.

---

## 2. Table 1 — the mapping

Rules for each row:

- A reskin changes no behaviour, no number, no word and no control (fence rule 3). Each "markup change" below is a class change or a wrapper. Where a row needs more than that, the row says so.
- "S1 floor" means: after S1, the part has Dusk colours through the bridge and keeps its shape. The Dusk part in the row arrives with the surface job.
- `cb-` parts are in Table 3.
- Each Dusk control is lower than 44 px (Table 3, G20). Each row that uses `.dusk-btn`, `.dusk-row` or `.dusk-seg` needs the 44 px floor.

### 2.1 Shell — `src/App.tsx`, owner B1

| Part | Where | Today | Dusk part | Markup change |
|---|---|---|---|---|
| Skip link | `App.tsx:28` | `a.skip` (green fill, raw ink) | `.dusk-skip` (base layer) | Class swap. Must be the first focusable element. |
| Page frame | `App.tsx:29` | `div.wrap`, 920 px column | `div.dusk-stage.dusk-stage--app` > `section.dusk-win.cb-win` | Two wrappers replace one. See owner pick 2. |
| Header | `App.tsx:30` | `header.top` | `header.dusk-titlebar`, then `div.dusk-thread[aria-hidden]` | Class swap, one new empty element. |
| Home mark | `App.tsx:31` | `button.mark > span` | `button.cb-mark` in `.dusk-brand`, with `i.dusk-led.dusk-led--ok` inside | Class swap. The lamp stays beside the words "Clear Board". |
| Name and tag line | `App.tsx:32-35` | `.brand h1`, `.brand p` | `h1` in `.dusk-brand`; the tag line in `.dusk-crumb` | Class swap, **and one page-local size rule for the `h1`** (corrected by Check 2.1.2). |
| Spacer | `App.tsx:36` | `div.grow` | `span.dusk-spacer` | Class swap. |
| Settings button | `App.tsx:37` | `button.iconbtn` | `button.dusk-btn` | Class swap. |
| Content area | `App.tsx:39` | `main#view` | `main.dusk-main#view` | Class added. Needs the page-local rule `.cb-win > .dusk-main { grid-column: 1 / -1 }` (trap 9.3). |
| Status bar | none today | none | `.dusk-status`, `.dusk-led`: **not used** | The app has no words for a status bar. New words are not a reskin. |
| Sidebar | none today | none | `.dusk-side`, `.dusk-dots`, `.dusk-who`, `.dusk-grp`: **not used** | A sidebar is a new control. |

Checks for 2.1:

- **Check 2.1.1: confirmed.** Each line number in the table is correct in `src/App.tsx`. Each Dusk class in the table is a selector in the six layer files (checked by script for each Dusk class name in this report, 104 names after the check: each one is a selector in the six layer files).
- **Check 2.1.2: corrected.** The `h1` row needs more than a class swap. Dusk sets no size on `h1` (`dusk.base.css:38-45` sets margin and weight only). In the checker's probe, with the draft bridge and draft parts, the `h1` in `.dusk-brand` computes 32 px. The title bar is then 60 px high at 1440 and 140 px high at 390, where it wraps to three lines. Today the `h1` is 21.6 px and the header is 80 px high at 1440 and 101 px at 390 (measured). B1 must set a size on the `h1` under an app class. With `.cb-app .dusk-brand h1 { font-size: var(--fs-l) }` the title bar is 56 px at 1440. At 390 it is still 136 px, because the tag line (265 px wide at 16 px) and the Settings button each take their own line. B1 must look at the 390 title bar.
- **Check 2.1.3: corrected.** `.dusk-skip` has a fill that is 90 % clear: `--btn-bg` is gold at 0.10 (`dusk.tokens.css:157`, `dusk.base.css:78`). In the probe at 390 the focused skip link is at 8,8 and is 148 × 44 px. The home mark and the first letters of the name show through it (picture `R3-check/skip-focus-390.png`). The skip link needs an opaque ground under its wash, set under an app class. Drawn by the check: `.cb-app .dusk-skip { background-color: var(--glass); background-image: linear-gradient(var(--btn-bg), var(--btn-bg)) }` gives a solid link that hides what is under it (picture `R3-check/fix-skip-390.png`), `--lit` on that ground is 10.35, and the rule passes the strict namespace check. See section 15, A11.
- **Check 2.1.4: confirmed.** With no `.dusk-side`, `.dusk-main` is 212 px wide at 1440. With `.cb-win > .dusk-main { grid-column: 1 / -1 }` it is 1440 px wide (probe).
- **Check 2.1.5: confirmed against the fence.** "Status bar: not used" and "Sidebar: not used" are correct under fence rule 3. A status bar needs new words. A sidebar is a new control.
- **Check 2.1.6: not verified.** The lamp inside the home mark as `i.dusk-led.dusk-led--ok` was not drawn by the report: the draft part uses its own `span` (`parts.draft.css`, `.cb-mark span`). See Check G19.

### 2.2 Home — `src/stations/Home.tsx`, owner B1

| Part | Where | Today | Dusk part | Markup change |
|---|---|---|---|---|
| Lede | `Home.tsx:24-29` | `section.lede`, `b` in green | `.dusk-panel` with `p.cb-prose` | Class swap. The bold words take `--ink`: green is a state colour, not an emphasis colour. |
| "Free" chip | `Home.tsx:25` | `span.free` (green pill) | `span.dusk-badge` | Class swap. No pill. |
| Section headings | `Home.tsx:31,39,59` | `h2.section` | `h2.dusk-rule` with the words in `<b>` | Class swap, one inner `<b>`. |
| Path panel | `Home.tsx:32-33` | `.path`, `.stage` | `.dusk-panel`; the figure "N% mastered" takes `.dusk-num` | Class swap. |
| Overall progress | `Home.tsx:34-36` | `.bar[role=progressbar] > i` | `.dusk-bar[role=progressbar] > i.dusk-fill.dusk-fill--teal` | Class swap. The ARIA attributes stay. The width transition goes (static first). |
| Domain grid | `Home.tsx:40` | `.grid` | `.dusk-grid` | Class swap. |
| Live domain card | `Home.tsx:54`, `:46-49` | `button.card`: `.h` (`.dot`, `h3`), `p`, `.mini` | `button.dusk-tile.dusk-tile--teal`: `.dusk-tile-cap` (`.dusk-ico`, `h3.dusk-tile-lab`), `.dusk-tile-body` (`.dusk-tile-sub`, `.dusk-bar > .dusk-fill--teal`) | Two wrappers (cap, body) and class swaps. Needs the button reset G7. Owner pick 4 (tone). |
| Not-live domain card | `Home.tsx:55`, `:50` | `div.card.locked` (opacity .55), `span.soon` | `div.dusk-tile.dusk-tile--grey`; "Coming soon" in `.dusk-tile-tag` | Class swap. No opacity: the grey tone and the words carry it. |
| Station list | `Home.tsx:60` | `.stations` | `.dusk-rows` with a page-local column rule | Class swap. |
| Station button | `Home.tsx:62` | `button.station`: `b` (emoji and name), `small` | `button.dusk-row`: `span.dusk-ico[aria-hidden]`, then `span` > `b`, `small` | One wrapper `span`; the icon moves into `.dusk-ico` (T10). Needs G7 and the 44 px floor. |
| Disabled station | `Home.tsx:64` | `button.station[disabled]` (opacity .5) | `button.dusk-row[disabled]` | Same. No opacity: `--ink-2` name, `--ink-3` sub-label, `not-allowed` cursor. |
| Tip link | `Home.tsx:68` | `a.tip` (amber pill) | `a.dusk-btn` | Class swap. No pill. |
| Footer text | `Home.tsx:69-71` | `footer p` in `--muted` | `p.cb-sub.dusk-measure` | Class swap. `.dusk-note` is 11 px: too small for this text. |

Checks for 2.2:

- **Check 2.2.1: confirmed.** Each line number in the table is correct in `src/stations/Home.tsx`. Each Dusk class exists.
- **Check 2.2.2: corrected.** The row "Not-live domain card" has no use with today's content. `DOMAINS` in `src/core/store.ts:6-14` marks all seven domains `live: true`, and the running app shows 7 cards and 0 locked cards (measured). The row stays correct for a domain with no drillable item.
- **Check 2.2.3: corrected.** The station button row adds `aria-hidden` to the icon. Today the emoji is inside `<b>` (`Home.tsx:62`), so it is part of the accessible name of the button. With `aria-hidden` the spoken name loses the emoji. That is a change of the spoken words, not of the look. Fence rule 3: the lead must rule, or B1 must leave `aria-hidden` off. The same applies to the Reference title emoji (2.4) if it moves.
- **Check 2.2.4: corrected.** Several texts in this table get smaller than today. Measured today, then in the Dusk part: section heading 12.48 px → 11 px (`.dusk-rule b`); domain name 16 px → 12 px (`.dusk-tile-lab`); domain description 13.44 px → 12 px (`.dusk-tile-sub`); station sub-label 13.33 px → 11 px (`.dusk-row small`). See section 15, A2.
- **Check 2.2.5: confirmed.** `button.dusk-row` with the 44 px floor is 44 px high with one line and 54.7 px with two lines at 390 (probe). `button.dusk-tile` is 138 px high.
- **Check 2.2.6: confirmed against the fence.** No row adds a word or a control. The lost opacity, the lost pill and the gold tip link are changes of look only.
- **Check 2.2.7: confirmed.** The domain names fit the tile cap at the 176 px minimum: in the probe "Securement" has `scrollWidth` equal to `clientWidth` (134 px).

### 2.3 Settings — `src/stations/Settings.tsx`, owner B1

| Part | Where | Today | Dusk part | Markup change |
|---|---|---|---|---|
| Dialog | `Settings.tsx:31` | `dialog#settings` | `dialog.cb-dialog` (G3). `.dusk-win` must not go on a `<dialog>` (trap 9.4). | Class added. |
| Head | `Settings.tsx:32` | `.set-h`: `h2`, `button.iconbtn` | `header.dusk-panel-head`: `h2.dusk-panel-name`, `.dusk-spacer`, `button.dusk-btn` | Class swap, one spacer. |
| Body | `Settings.tsx:33` | `.set-body` | `.dusk-panel-body` | Class swap. |
| Sample | `Settings.tsx:34-37` | `.set-sample`, `.ss-aa` in green | A well: `--well`, `--ring-well`, `--r-control`. "Aa" in `--lit`. | Class swap. |
| Setting row | `Settings.tsx:39-46` | `.row`: `label`, `small`, `.sw` | `cb-setrow` with `cb-toggle` (G4) | Class swap. |
| Reset | `Settings.tsx:47-55` | `button.iconbtn.danger` | `button.cb-btn--attn` (G12) | Class swap. |
| Note | `Settings.tsx:56` | `p.set-note` | `p.dusk-note` | Class swap. |

Checks for 2.3:

- **Check 2.3.1: confirmed.** Each line number is correct in `src/stations/Settings.tsx` (the setting rows are lines 38 to 46). Each Dusk class exists.
- **Check 2.3.2: confirmed.** A closed `<dialog class="dusk-win">` computes `display: grid` and has a visible box of about 250 × 62 px (probe). A closed `dialog.cb-dialog` computes `display: none`. Open, it computes `display: block`, the fill `rgb(10, 8, 16)` and a 10 px corner.
- **Check 2.3.3: corrected.** Three texts get smaller: the title "Settings" 16.8 px → 13 px (`.dusk-panel-name`), the note 12.8 px → 11 px (`.dusk-note`), a row sub-line 12.8 px → 12 px (`cb-setrow small`). Measured. See section 15, A2.
- **Check 2.3.4: confirmed.** The "Done" button is 44 px high only when the dialog is inside the element that has the class `cb-app`. In the probe, a dialog outside that element gave a 29 px button. `Settings` renders inside `#root` (`App.tsx:52`), so a `cb-app` class on `body` covers it.

### 2.4 Reference — `src/stations/Reference.tsx`, owner B2

| Part | Where | Today | Dusk part | Markup change |
|---|---|---|---|---|
| Back | `Reference.tsx:46` | `button.back` | `button.cb-btn--plain` (G11) | Class swap. |
| Title and lede | `Reference.tsx:47-48` | `h2.view-title`, `p.muted` | `.dusk-top` > `div` > `h2.dusk-title`, `p.dusk-lede` | Two wrappers. The emoji in the title is T10. |
| Search | `Reference.tsx:49` | `input.search` | `input.cb-input` (G5) | Class swap. |
| Result list | `Reference.tsx:52` | `.ref-list[role=list]` | `.dusk-rows` | Class swap. |
| Result row | `Reference.tsx:55-57` | `button.ref-row`: `b`, `small` | `button.dusk-row`: `span.dusk-ico[aria-hidden]`, `span` > `b`, `small.cb-sub` | One wrapper and one decorative icon square: the row grid needs it (trap 9.7). The `small` holds rule text and must not take the 11 px Dusk size. **Corrected by Check 2.4.2: the class `cb-sub` alone does not do this. The rule must be `.cb-app .dusk-row .cb-sub`.** |
| Detail | `Reference.tsx:73-74` | `.ref-detail`, `h3` | `section.dusk-panel.dusk-panel--framed`: `header.dusk-panel-head` (`h3.dusk-panel-name`), `.dusk-panel-body` | Two wrappers. `aria-live` stays on the section. |
| Trust badge | `Reference.tsx:8-17` | `span.badge.clear` or `.caution` | `span.cb-chip.cb-chip--ok` or `--caution` (G13) | Class swap. `.dusk-state` does not fit: it writes a second glyph (trap 9.8). |
| Plain words | `Reference.tsx:76` | `p.plain` | `p.cb-prose.cb-prose--lead` | Class swap. |
| Aspect row | `Reference.tsx:79` | `.aspects` > `.signal` | Each aspect in `span.cb-signal` (G8) | Class added in `Signal.tsx:7`. |
| "Drill these aspects" | `Reference.tsx:83` | `button.iconbtn` | `button.dusk-btn` | Class swap. |
| Rule text | `Reference.tsx:87-90` | `details`, `summary`, `blockquote` | `details.cb-disclosure`, `blockquote.cb-quote` (G15) | Class added. |
| Source line | `Reference.tsx:92-94` | `.cite` | `p.cb-sub` | Class swap. The citation is content: `--ink-2`, not the 11 px note. |
| Read aloud | `Reference.tsx:96` | `button.iconbtn` | `button.dusk-btn` | Class swap. |
| `.dusk-table` | none | none | **not used** | The app has no table. A reference table is an upgrade for U1, not a reskin. If one is added, each `td` needs `data-label` and the table stacks below 760 px (measured in the harness: `thead` is hidden and `td` is a grid at 390). |

Checks for 2.4:

- **Check 2.4.1: confirmed.** Each line number is correct in `src/stations/Reference.tsx`. Each Dusk class exists.
- **Check 2.4.2: refuted.** With the draft parts, a `small.cb-sub` inside a `.dusk-row` computes 11 px and `rgb(157, 152, 169)`, which is `--ink-3` (probe). `.dusk-row small` (`dusk.components.css:111-115`) has more specificity than `.cb-sub`. The report's own table 7.1 shows the same thing: "reference row" is listed under `--ink-3` at 11 px. Today this text is 13.33 px. A rule with an app class and two more classes, `.cb-app .dusk-row .cb-sub`, has more specificity than `.dusk-row small`. Drawn by the check: with that rule the text computes 14 px and `rgb(200, 195, 208)`, which is `--ink-2`, and the rule passes the strict namespace check (`fixes.mjs`).
- **Check 2.4.3: corrected.** `.dusk-rows` is one column at 1440. Below 760 px it is `repeat(auto-fill, minmax(150px, 1fr))` (`dusk.compose.css:399-401`). In the probe at 390 the list is two columns of 182 px, and a result row with a two-line title and a long plain-words text is 195 px high. The Reference list has 219 rows today (measured) and each row is 354 px wide at 390. The result list needs a one-column rule under an app class. Drawn by the check: an app class on the list with `grid-template-columns: minmax(0, 1fr)` gives one column of 366 px at 390, and the same row is 111 px high. See section 15, A3.
- **Check 2.4.4: corrected.** The entry title gets smaller: `h3` 18.72 px today → 13 px as `.dusk-panel-name` (measured). See section 15, A2.
- **Check 2.4.5: confirmed.** At 390 a `.dusk-table` computes `thead` `display: none`, `td` `display: grid`, and the `td::before` content is the `data-label` text. At 1440 it is a normal table (probe).
- **Check 2.4.6: confirmed.** `.dusk-state` writes a glyph before the word (`dusk.components.css:570-576`). The trust strings hold a glyph already (`Reference.tsx:9-11`).
- **Check 2.4.7: not verified.** The "one decorative icon square" on each result row is a new picture element with no content. It is not a word and not a control, so it is inside fence rule 3. A row with no icon square is also possible: a one-column grid on the row under an app class. The lead can pick. Neither form was drawn on the real list of 219 rows.

### 2.5 Drill and Signals — `src/stations/Drill.tsx`, `Signal.tsx`, owner B2

| Part | Where | Today | Dusk part | Markup change |
|---|---|---|---|---|
| Back | `Drill.tsx:176,192,224` | `button.back` | `button.cb-btn--plain` | Class swap. |
| Question frame | `Drill.tsx:225-229` | `.drill-top` (two `span.muted`), `h2.view-title`, `.prompt` | `section.dusk-panel.dusk-panel--framed`: head = `h2.dusk-panel-name` (the heading), `span.dusk-panel-sub` ("Question N of M"), `.dusk-spacer`, `span.dusk-count` ("N correct"); body = the prompt | The three parts move into one panel. Same words. **Corrected by Check 2.5.2: the order of reading changes.** Today it is count, score, heading (`Drill.tsx:225-226`). This row makes it heading, count, score. To keep today's order, the count line stays above the panel and the head holds the heading only. |
| Prompt text | `Drill.tsx:227-229` | `.prompt` | `p.cb-prose.cb-prose--lead` in `.dusk-panel-body` | Class swap. |
| Prompt signal | `Drill.tsx:227-228` | `.prompt.prompt-signal` > `.signal` | `span.cb-signal` in `.dusk-panel-body` (G8) | Class swap. The drawing is frozen. |
| Options | `Drill.tsx:230-235` | `.opts` > `button.opt`, `.right`, `.wrong` | `.cb-opts` > `button.cb-opt`, `cb-opt--right`, `cb-opt--wrong` (G1) | Class swap. |
| Feedback | `Drill.tsx:237-248` | `.feedback[aria-live]`, `b.fb-ok` or `.fb-no`, `.cite`, two `button.iconbtn` | `.dusk-panel[aria-live]`: `b.cb-result.cb-result--ok` or `--no` (G14), `span.cb-sub`, `button.cb-btn--plain` (Look it up), `button.dusk-btn` (Next) | Class swap. `autoFocus` stays on Next. |
| Session done | `Drill.tsx:193-195` | `h2.view-title`, `p.big-score`, `p.muted` | `article.dusk-tile.dusk-tile--teal`: cap = `h2.dusk-tile-lab`, body = `p.dusk-tile-num` (the score), `p.dusk-tile-sub` (the mastery lines) | Two wrappers. |
| End actions | `Drill.tsx:196-204` | `.opts` > `button.opt` | `button.dusk-btn` in a flex row | Class swap. They are actions, not answers. |
| Loading and empty lines | `Drill.tsx:171,177` | `p.muted` | `p.dusk-lede` | Class swap. |

Checks for 2.5:

- **Check 2.5.1: confirmed.** Each line number is correct in `src/stations/Drill.tsx` and `Signal.tsx`. Each Dusk class exists.
- **Check 2.5.2: refuted.** The question frame row said "same order of reading: heading, count, score". Today the DOM order is count, score, heading, prompt (`Drill.tsx:225-229`). The row as first written changes the order that a screen reader reads. The old statement is in section 17.
- **Check 2.5.3: corrected.** The question frame makes four texts smaller. Measured today, then in the Dusk part: the question heading ("What does the rule say?", "What signal is this?", `Drill.tsx:52,58,64`) 20.8 px → 13 px (`.dusk-panel-name`); "Question N of M" 16 px → 12 px (`.dusk-panel-sub`); "N correct" 16 px → 11 px (`.dusk-count`). The session-done row makes three texts smaller: the heading 20.8 px → 12 px (`.dusk-tile-lab`), the score 38.4 px → 27 px (`.dusk-tile-num`), the mastery lines 16 px → 12 px (`.dusk-tile-sub`). See section 15, A2.
- **Check 2.5.4: confirmed.** The prompt text (17.6 px today) and an answer option (16 px today) keep their size: `cb-prose--lead` computes 17.6 px and `cb-opt` computes 16 px in the probe.
- **Check 2.5.5: confirmed against the fence.** The options, the feedback and the end actions keep their words, their order and their handlers. `autoFocus` stays on "Next". Red is on the wrong pick only.
- **Check 2.5.6: not verified.** The session-done tile and the question panel were not drawn with real app strings by the check. `.dusk-tile-lab` cuts a long text to one line (trap 9.10).

### 2.6 Radio — `src/stations/Radio.tsx`, `RadioTest.tsx`, `radioSim.js`, owner B3

| Part | Where | Today | Dusk part | Markup change |
|---|---|---|---|---|
| Mode tabs | `Radio.tsx:25-32` | `.mode-tabs[role=tablist]` > `button.mode-tab[role=tab]` | `.cb-tabs` > `button.cb-tab` (G10) | Class swap. `.dusk-seg` does not fit: it reads `aria-pressed`, and the tabs use `aria-selected` (trap 9.9). |
| Back (test mode) | `Radio.tsx:23` | `button.back` | `button.cb-btn--plain` | Class swap. |
| Test: count line | `RadioTest.tsx:155-158` | `.drill-top` | Head of a `.dusk-panel--framed`, as in Drill: `.dusk-panel-sub` ("Call N of M"), `.dusk-count` ("N correct") | Same as Drill. |
| Test: readout | `RadioTest.tsx:160` | `.radio-readout[aria-live]` | `.dusk-strip` > `.dusk-cell.dusk-cell--key` > `b[aria-live]` | Two wrappers. |
| Test: incoming call | `RadioTest.tsx:163` | `p.radio-incoming`, `span.who` | `p.cb-tx.cb-tx--eng`, `span.cb-who` (G16) | Class swap. |
| Test: question | `RadioTest.tsx:166` | `h2.view-title` | `h2.dusk-panel-name` in the panel head | Class swap. |
| Test: not-scored note | `RadioTest.tsx:169-173` | `p.badge.caution` | `p.cb-chip.cb-chip--caution` | Class swap. |
| Test: options, feedback, done | `RadioTest.tsx:176-200`, `:111-133` | `.opts`, `.opt`, `.feedback`, `.radio-ack`, `.big-score` | As Drill. `.radio-ack` is `cb-tx cb-tx--eng`. | Class swap. |
| Guided: all parts | `radioSim.js:6-33` (style), `:35-79` (markup) | Island classes: `.scenario`, `.rhead`, `.sigmark`, `.stage`, `.radio`, `.note`, `.log`, `.tx`, `.call`, `.rbtn.key`, `.rbtn.again`, `.done`, `.tip` | **No Dusk class.** B3 may change style rules only. The rules read bridge tokens and copy the recipe of a Dusk part: `.radio` and `.note` = panel (`--panel-fill`, `--neon`, `--r-tile`); `.scenario` and `.tx` = `cb-tx` recipe; `.call` = `cb-call`; `.rbtn.key` = button recipe (`--btn-bg`, `--btn-ink`, `--neon-ctl`); `.rbtn.again` = plain button; `.done` = `--rowwash-green`, `--rowneon-green`; `.stage` = `--well`, `--ring-well` | None. This is the way the desk shell took Dusk (`ROLLOUT.md` step 2: it reads Dusk tokens, not Dusk classes). |
| Guided: raw colours outside style rules | `radioSim.js:45-66` (27 SVG attributes), `:145` (2 in script) | Typed colours | See trap 9.12 | **B3's Files line does not cover them.** The lead must widen it or excuse the lines. |

Checks for 2.6:

- **Check 2.6.1: confirmed.** Each line number is correct in `Radio.tsx`, `RadioTest.tsx` and `radioSim.js` (the markup is lines 35 to 79, the style is lines 5 to 33, the SVG colours are on lines 45 to 66, the script colours are on line 145).
- **Check 2.6.2: confirmed.** `.dusk-seg` lights `button[aria-pressed="true"]` (`dusk.components.css:234`). The tabs carry `aria-selected` (`Radio.tsx:26,30`).
- **Check 2.6.3: corrected.** "Test: count line" and "Test: question" put the count and the question into one panel head, "as Drill". Today the DOM order is: count, score, readout, incoming call, question, note, options (`RadioTest.tsx:155-181`). One panel head for the count and the question moves the question in front of the readout and the incoming call, or moves the count behind them. The question "What do you reply?" refers to the incoming call, so the call must be read first. To keep today's order: the count line stays where it is, and the question heading keeps its place after the incoming call.
- **Check 2.6.4: corrected.** Texts that get smaller: the readout 18.4 px → 15 px (`.dusk-cell--key b`); the question 20.8 px → 13 px (`.dusk-panel-name`); "Call N of M" 16 px → 12 px; "N correct" 16 px → 11 px. Measured today and in the probe. See section 15, A2.
- **Check 2.6.5: corrected.** The guided Radio has a sentence on the screen that names a colour: "Green lines are the engineer" (`radioSim.js:76`). Table 2 (3.3) maps the engineer's lines to teal. See section 15, A1.
- **Check 2.6.6: confirmed against the fence.** The guided row changes style rules only and touches no word in `STEPS`. The last row is correct: 27 SVG attributes and one script line hold raw colours that a style rule cannot remove from the file (fence rule 4), and B3's Files line is "style rules only".

### 2.7 Yard chrome — `src/stations/yardSim.js` today, Y1's view and style files later, owner Y3

The drawing (`canvas#yard`, `render.js`, `anim.js`) is Y2. It is not in this table.

| Part | Where | Today | Dusk part | Markup change |
|---|---|---|---|---|
| Wrapper | `yardSim.js:143`, style `:43-51` | `.yard-wrap` with its own ground, ink and font | Keep the class as a scope. It declares no ground, no `--ink`, no font. | Style only. |
| Back | `yardSim.js:144` | `button.back` | `button.cb-btn--plain` | Class swap. |
| Picker and readout | `yardSim.js:146-150` | `.bar`: `select#picker`, `.spacer`, `div.readout` | `.dusk-strip`: `.dusk-cell` > `b#readout`; `.dusk-strip-end` > `select.cb-select#picker` | Class swap. The readout is one string that the controller writes (`:260`, `:420`, `:432`): it stays one element. |
| Work order | `yardSim.js:152`, built at `:572-576`, `:615-617`, `:628-633` | `.workorder`: `.wo-top` (`.wo-tag`, `.wo-id`), `.wo-job`, `.wo-meta`, `.wo-tip` | `.dusk-panel.dusk-panel--framed`: head = `.dusk-panel-name` (the tag), `.dusk-panel-sub` (the title), `.dusk-spacer`, `.dusk-count` (the id); body = `p.cb-prose` (job; car numbers in `b.dusk-num`), `p.cb-sub` (meta), `p.cb-sub` (tip, not italic) | The view builds the same strings into the new classes. |
| Switch-list line | `yardSim.js:566-570`, `:577` | `div.ord-row`, `.flagged`; a `div` with a click only | `.dusk-row.dusk-row--amber`, plus `.dusk-row--on` when flagged; the glyph (`⚑` or `▢`) in `.dusk-ico` | Class swap, **and one wrapper `span` around the mark, the arrow and the track** (corrected by Check 2.7.2). Making the line a `<button>` is Y4 (access), not Y3. |
| Certify | `yardSim.js:575` | `button.go#certify` | `button.dusk-btn` | Class swap. |
| Drawing frame | `yardSim.js:154`, style `:60-64` | `.yardframe` | `.dusk-panel` with no padding | Class swap. Y2 owns what is inside. |
| Move builder | `yardSim.js:156-172` | `.bar`: three `select`, "cars", `button.go`, `#optimal`, `#depart`, `#reset`, `#mute` | A flex row in a `.dusk-panel`: `select.cb-select` (three), `button.dusk-btn` (Work it, Watch optimal, Depart), `button.cb-btn--plain` (Reset, mute) | Class swap. Three button colours become one Dusk button: gold is the only chrome light. |
| Message | `yardSim.js:174`, written at `:639`, `:646` | `.banner`, `.ok`, `.bad`, `.win` | `cb-banner`, `--ok`, `--bad`, `--win` (G9) | The controller writes the new class names. |
| Look it up | `yardSim.js:651` | `button.lookup` | `button.cb-btn--plain` | Class swap. |
| Rule legend | `yardSim.js:176-180` | `.legend`, `.k`, `.s` | `p.dusk-rule`: `<b>Rules in play</b>`, then the text in `<span>` | Class swap. The dash after "Rules in play" stays in the text. |
| Rule chips | `yardSim.js:181`, built at `:554-555` | `.chip.cror` or `.chip.si`: `b`, `span` | `.dusk-grid` of small tiles: `article.dusk-tile.dusk-tile--blue` (CROR) or `--amber` (S.I.): cap = `b.dusk-tile-lab.dusk-num` (the citation), body = `span.dusk-tile-sub` (the label) | Two wrappers. Page-local `min-height: 0`. A tile colour is a category in Dusk: that fits. |
| "What this trainer builds" | `yardSim.js:183-185` | Inline style: amber edge and wash | `.dusk-panel`; heading words in `--si` | The inline `style` attributes go into the style file. |
| How to play | `yardSim.js:187-209` | `details`, `summary`, `code`, inline colours | `details.cb-disclosure`, `code.cb-code` | Class added. |
| "cars" label | `yardSim.js:164` | Inline `style="color:var(--dim)"` | `span.cb-sub` | Class swap. |

Checks for 2.7:

- **Check 2.7.1: corrected.** One line number was wrong: the class of the message is written on lines 639 and 646 (the table said 647, which is the text). The table now says 646. Each other line number is correct in `src/stations/yardSim.js`.
- **Check 2.7.2: corrected.** A switch-list line has four children: the flag, the mark, the arrow, the track (`yardSim.js:567-570`). The `.dusk-row` grid has three columns (`dusk.compose.css:126`). In the probe the fourth child, the track name, falls to a second line in the 24 px column. The report's own harness sample wraps the three words in one `span`. The row now says so.
- **Check 2.7.3: corrected.** The work order row puts the tag, then the title, then the id. Today the order is tag, id, " · ", title (`yardSim.js:628`). The verified form is tag, track, " · verified" (`:615`). The switch-list form is tag, id, " · the list can be wrong" (`:572`). To keep the same words in the same order, the head must be: name (the tag), count (the id), sub (the text after the dot). The `.dusk-spacer` is optional in a panel head.
- **Check 2.7.4: corrected.** The picker row puts the readout first and the picker in `.dusk-strip-end`. Today the picker is first in the DOM (`yardSim.js:147-149`). The reading order changes. Y3 can keep the DOM order and place the two parts with the strip classes, or the lead accepts the change.
- **Check 2.7.5: corrected.** Texts that get smaller: the readout 16 px → 14 px (`.dusk-cell b`); the rule label in a chip 12.5 px → 12 px (`.dusk-tile-sub`); the legend 12.5 px → 12 px and its name 12.5 px → 11 px (`.dusk-rule`, `.dusk-rule b`). Measured today and in the probe. The work order job (16 px), the hint (12.5 px → 14 px as `cb-sub`) and the message (15 px → 16 px) do not get smaller.
- **Check 2.7.6: confirmed.** The rule citations fit a 176 px tile cap in the mono face: "CROR 113.4 / 113.5" and "Manifest / blocking" have `scrollWidth` equal to `clientWidth` (162 px) in the probe.
- **Check 2.7.7: corrected.** The help text names two colours in words: "yellow = lined into the track / diverging" and "green = normal" (`yardSim.js:190-191`). The word "yellow" is drawn in `--si` and the word "green" in `--good`. Table 2 maps `--si` to `--amber-ink` (`#cc8f00`) and the canvas `reverse` colour to `--amber`. See section 15, A1.
- **Check 2.7.8: confirmed against the fence.** No row adds a word or a control. One Dusk button in place of three button colours is a change of look. The inline `style` attributes that move to the style file hold tokens, not words.
- **Check 2.7.9: confirmed.** The Yard drawing is 882 px wide in a 1440 px window today (measured: `canvas#yard` 882 × 302.8).

### 2.8 Dusk parts with no use in this change

`.dusk-side`, `.dusk-side-foot`, `.dusk-dots`, `.dusk-disc`, `.dusk-who`, `.dusk-grp`, `.dusk-chev`, `.dusk-seg`, `.dusk-eye`, `.dusk-flag`, `.dusk-clock`, `.dusk-status`, `.dusk-legend`, `.dusk-table`, `.dusk-heat`, `.dusk-feed`, `.dusk-state`, `.dusk-up`, `.dusk-down`, `.dusk-spark`, `.dusk-pair`, `.dusk-panels`, `.dusk-stack`, `.dusk-enter`, and the six process parts (`.dusk-track`, `.dusk-station`, `.dusk-exit`, `.dusk-lanes`, `.dusk-lane`, `.dusk-lanes-list`).

- `.dusk-station` is a step on a process track in `dusk.process.css`. It is not the app's "station". A process track for the Radio steps or for the path is new structure, not a reskin. U1 can propose it.
- `.dusk-feed` has a 4.25 rem first column for a `<time>`. A radio transcript line starts with a speaker name. The feed does not fit: see G16.
- `.dusk-state` writes its own glyph. The app strings already hold a glyph (`✓ verified`, `⚠ …`, `● …`, `Reference.tsx:9-11`). See G13 and G14.

Checks for 2.8:

- **Check 2.8.1: corrected.** The list is not complete. The six layer files hold 151 `dusk-` class names. These are also not used by the mapping and are not in the list: `.dusk-panel-title`, `.dusk-panel-body--flush`, `.dusk-tile-chev`, `.dusk-ico--solid` and the eight `.dusk-ico--<tone>` classes, `.dusk-led--caution`, `.dusk-led--attn`, `.dusk-sr`, the table helpers (`.dusk-r`, `.dusk-opt`, `.dusk-ask`, `.dusk-bid`, `.dusk-hot`, `.dusk-mid`, `.dusk-col--bar`), `.dusk-spark-line`, `.dusk-traveller`, and the inner process names (`.dusk-station-title`, `.dusk-exits`, `.dusk-lanes-head`, `.dusk-lanes-label`).
- **Check 2.8.2: confirmed.** `.dusk-station` is in `dusk.process.css`. `.dusk-feed li` has a `4.25rem` first column (`dusk.compose.css:382`). `.dusk-state--<name>::before` writes a glyph (`dusk.components.css:570-576`).
- **Check 2.8.3: confirmed.** `.dusk-sr` exists (`dusk.base.css:84-94`): it hides text from the eye and keeps it for a screen reader. It is the Dusk part for a spoken state, if the lead rules that a right or wrong option needs spoken words (see the ruling at the end of section 4). Spoken words are new words: that is a U1 row, not a reskin.

---

## 3. Table 2 — the bridge

The one bridge file is `src/styles/clear-board.tokens.css`. S1 writes it. A draft that renders and that every number in section 7 was measured with is at `scratchpad/R3/bridge.draft.css`.

### 3.1 Shell names (`src/index.css:3-7`)

| Old name | Old value | Maps to | Dusk value | Reason |
|---|---|---|---|---|
| `--bg` | `#0e1116` | `var(--glass)` | `#0a0810` | The window floor. Body text sits on it. |
| `--surface` | `#161b22` | `var(--panel-hi)` | `#13101b` | A panel. Dusk measures text on this end of the panel gradient. |
| `--surface-2` | `#1c232c` | `var(--head)` | `#17131f` | The lightest Dusk surface with all three inks measured on it. The surface jobs move sunk tracks (`.bar`, `.mini`, `.sw`) to `--well`. |
| `--line` | `#2a3340` | `var(--lit-rule)` | `rgba(242,194,122,0.30)` | A rule inside a container (`ROLLOUT.md` step 1). 2.00 to 2.09 against its ground: a divider, not the edge of a control. A control edge reads `--cb-edge`. |
| `--ink` | `#e6edf3` | **not declared**: Dusk's `--ink` | `#f4f1ec` | Clash 1 below. |
| `--muted` | `#9aa7b4` | `var(--ink-2)` | `#c8c3d0` | The app uses `--muted` for rule summaries, descriptions and citations. `--ink-2` gives 10.89 on a panel. `--ink-3` gives 6.71 there, lower than today's 7.05. Labels move to `--ink-3` through Dusk parts. |
| `--clear` | `#3fb950` | `var(--green-ink)` | `#3fbf79` | Text-safe green. A fill uses `--green` (`.dusk-fill--green`, `.dusk-led--ok`). Hover and selection stop using green: in Dusk they are gold. |
| `--caution` | `#d29922` | `var(--amber-ink)` | `#cc8f00` | Caution text and edge. |
| `--stop` | `#f85149` | `var(--red-ink)` | `#ea5d50` | Attention only: a wrong answer, the Reset control. |
| `--focus` | `#58a6ff` | **not declared**: Dusk's `--focus` | `#9fc4ff` | Clash 2 below. |
| `--r` | `14px` | `var(--r-tile)` | `8px` | Panels and tiles. Controls use `--r-control` (6 px), chips `--r-chip` (4 px). Each pill radius in `src/index.css` goes: 7 uses of `999px`, at lines 35, 41, 53, 55, 63, 75 and 115. A dot keeps a circle through `--r-circle`. |
| `--maxw` | `920px` | kept as an app layout name, or dropped | none | Dusk has no page cap. It caps text columns at `--measure` (78ch). Owner pick 2. |
| `--fs` | `16px` | kept | none | `AppContext.tsx:60` writes it on `<html>`. See 5.3. |
| `--space` | `1.5` | `var(--lh-base)`; the bridge sets `--lh-base: 1.5` | Dusk `1.45` | One line-height name. The dyslexia mode raises it. |
| `--font` | system stack | `var(--font-ui)` | Dusk system stack | One font name. The dyslexia mode overrides `--font-ui`. |

Checks for 3.1:

- **Check 3.1.1: confirmed.** The 15 old names and their values are `src/index.css:3-7`. Each "maps to" token is declared in `dusk.tokens.css` with the value in the table (read by script). Dusk's own `ROLLOUT.md` step 1 uses the same kind of bridge (`--bg: var(--glass)`, `--good: var(--green-ink)`), and line 76 of that file names `--lit-rule` for a rule inside a container.
- **Check 3.1.2: confirmed.** Recomputed: `--lit-rule` against its ground 2.00 (glass), 2.07 (panel), 2.09 (head). `--ink-2` on `--panel-hi` 10.89. `--ink-3` on `--panel-hi` 6.71. Today `--muted` on `--surface` 7.05.
- **Check 3.1.3: confirmed.** `999px` is a corner radius on 7 lines of `src/index.css`: 35, 41, 53, 55, 63, 75, 115. Line 21 holds `left:-999px`, which is not a radius.
- **Check 3.1.4: confirmed in an emulation.** The checker served the built app with the five Dusk layers, this bridge and the app sheet without its own `:root` block (method in section 15, A8). The shell took Dusk colours and kept its shapes. The picture is `R3-check/s1floor-home-1440.png`.
- **Check 3.1.5: corrected.** The table gives no token for the 7 colours that are typed in shell rules, and fence rule 4 lets none of them stay in `src/index.css`. See section 15, A12.

### 3.2 Yard names (`yardSim.js:44-47`, scope `.yard-wrap`)

| Old name | Old value | Maps to | Reason |
|---|---|---|---|
| `--bg` | `#0b0e12` | delete: inherit the shell `--bg` | Same meaning as the shell name. |
| `--panel` | `#14181f` | `var(--panel-hi)` | Dusk renamed its own `--panel` to `--panel-fill` in 0.2.0 (W-048), so the name is free. A `--yard-` prefix is safer. |
| `--panel2` | `#1b212a` | `var(--head)` | As `--surface-2`. |
| `--line` | `#2a313b` | delete: inherit the shell `--line` | Same meaning. |
| `--ink` | `#e7ebf0` | **delete**: Dusk's `--ink` | Clash 3 below. |
| `--dim` | `#8b94a0` | `var(--ink-2)` | Rule labels and hints are content. Today 5.27 to 5.80; `--ink-2` gives 10.89 on a panel. |
| `--steel` | `#7d8794` | `var(--grey)`, or delete | Declared and never read (`grep` finds one occurrence). |
| `--cror` | `#9cc3ff` | `var(--blue-ink)` | An information colour: a category, never a state. 5.52 on a panel. |
| `--crorbg` | `#18243a` | `var(--rowwash-blue)`, or delete | Declared and never read. |
| `--si` | `#f2b134` | `var(--amber-ink)` | Special instruction. 6.71 on a panel. |
| `--sibg` | `#2e2410` | `var(--rowwash-amber)` | An amber wash. `--ink` on it over a panel: 13.81. |
| `--good` | `#39b58a` | `var(--green-ink)` | A win. |
| `--bad` | `#e2574c` | `var(--red-ink)` | A refused move. The old value is equal to Dusk's `--red` fill. |

The 31 colours typed in Yard rules, by line, and the token for each:

| Lines | Typed today | Token |
|---|---|---|
| `:48` | `#161c25` (a radial wash) | Delete the gradient. The window floor shows. |
| `:58`, `:83`, `:109` | `#3a4554` (hover edge) | The hover state of the Dusk part (`--neon-ctl-on`), or `--lit`. |
| `:62` | `#0f1216`, `rgba(0,0,0,.45)` | `--well`; the shadow becomes the lit edge `--neon`. |
| `:67` | `#171c24`, `#11151b` | `--panel-fill`. |
| `:68`, `:71` | `#19b6d8` | `--teal-ink` (information). |
| `:73` | `#cfe8ff` | `--ink`. |
| `:76` | `#6f7884` | `--ink-2` through `cb-sub`. Today this hint is 3.82: it fails AA. |
| `:102-103` | `#1d4ed8`, `#2c5bdc`, `#2356e6` | `.dusk-btn`: `--btn-bg`, `--neon-ctl`, `--btn-bg-hover`. |
| `:104-105` | `#14313a`, `#1d5563`, `#aee9f6`, `#1a3d48` | `.dusk-btn`. |
| `:106-107` | `#1f4a3c`, `#2a6b54`, `#bdf0db`, `#245741` | `.dusk-btn`. |
| `:116` | `#4a2723`, `#1d1413` | `--rowneon-red`, `--rowwash-red`. |
| `:117` | `#1f4a3c`, `#102019` | `--rowneon-green`, `--rowwash-green`. |
| `:135`, `:137` | `#cfe8ff`, `#14313a`, `#1d5563`, `#1a3d48` | `cb-btn--plain`: `--lit`. |

Checks for 3.2:

- **Check 3.2.1: confirmed.** The 13 names and values are `yardSim.js:44-47`. `--steel` and `--crorbg` each occur once in the file (`grep -c`), so they are declared and never read. Each "maps to" token exists in Dusk.
- **Check 3.2.2: confirmed.** The second table accounts for all 31 typed colours: the rows hold 1, 3, 2, 2, 2, 1, 1, 3, 4, 4, 2, 2 and 4 colours, and each hex is on the line the row names (read line by line).
- **Check 3.2.3: confirmed.** Recomputed: `--dim` today 5.27 (on `--panel2`) to 5.80 (on `--panel`); the hint today 3.82 (`#6f7884` on `#171c24`); `--blue-ink` on a panel 5.52; `--amber-ink` on a panel 6.71; `--ink` on the amber wash over a panel 13.81. `--bad` today (`#e2574c`) is equal to Dusk `--red`.
- **Check 3.2.4: corrected.** One pair is missing from the reasons and from Table 4. The track name on a switch-list line reads `--cror` (`yardSim.js:87`). On a flagged line it sits on `--sibg`. With this bridge that is `--blue-ink` on `--rowwash-amber`: 4.57 over `--panel-hi`, 4.97 over `--glass`, and **4.41 over `--head`, which fails AA**. Today the pair is 8.48 (`#9cc3ff` on `#2e2410`). See section 15, A9.
- **Check 3.2.5: confirmed.** These declarations beat the bridge while they are in `yardSim.js`. In the emulated S1 floor `.yard-wrap` computes `--ink: #e7ebf0`, `--panel: #14181f` and `--bg: #0b0e12`: the old values. See section 15, A7.

### 3.3 Radio names (`radioSim.js:6-7`, scope `.radio-wrap`)

| Old name | Old value | Maps to | Reason |
|---|---|---|---|
| `--rbg` | `#14181d` | `var(--glass)`, or delete | Declared and never read. |
| `--rcard` | `#1d222b` | `var(--panel-hi)` | A panel. |
| `--rcard2` | `#232a34` | `var(--head)` | The signal mark slot. |
| `--rline` | `#2c3340` | `var(--lit-rule)` | A rule. |
| `--rink` | `#eef2f6` | `var(--ink)` | Body text. |
| `--rmuted` | `#9aa3b0` | `var(--ink-2)` | Explanations are content. |
| `--ryellow` | `#36d07f` (a green) | `var(--green-ink)` | The rule line and the "you" accent. The key button takes the button recipe, not this colour. A blue rule line (`--blue-ink`, 5.52) would match the Yard's CROR colour: see owner pick 4. |
| `--rblue` | `#4aa3ff` | `var(--blue-ink)` for an edge or text; `var(--blue)` for a fill | Your transmissions. |
| `--rgreen` | `#33c27f` | `var(--teal-ink)` or `var(--teal)` — **see Check 3.3.2: the screen says "Green lines are the engineer"** | The engineer's lines. Teal is information in Dusk. Green would read as "correct". |
| `--rorange` | `#ff8a3d` | `var(--amber-ink)` | GOI, operating practice. 6.71 on a panel. |

The 6 colours typed in `RADIO_CSS` rules: `#262b34` (`:13`) → `--hair-2`; `#10131a` (`:15`), `#1d222b` (`:21`), `#0e1a28` (`:25`) → `--well`; `#06301c` (`:27`) → `--btn-ink`; `#123326` (`:31`) → `--rowwash-green`.

Checks for 3.3:

- **Check 3.3.1: confirmed.** The 10 names and values are `radioSim.js:6-7`. `--rbg` occurs once in the file, so it is never read. The 6 typed colours are on lines 13, 15, 21, 25, 27 and 31. Each "maps to" token exists in Dusk.
- **Check 3.3.2: corrected.** `radioSim.js:76` shows this sentence in the guided Radio: "Green lines are the engineer; he repeats the car counts and calls the air to the tail." The sentence is markup, not a style rule and not `STEPS` wording, so B3 cannot change it, and fence rule 3 lets no reskin change it. If the engineer's lines turn teal (`#2fb3ad`), the sentence is in doubt. Inside the fence there is one safe value: the engineer's edge stays a green, `var(--green)`. The other way needs a word change, which is a U1 row for the owner. See section 15, A1.
- **Check 3.3.3: confirmed.** The dyslexia face and the line height reach the guided Radio today: `.radio-wrap .scenario` computes the dyslexia stack when the mode is on (measured). The island sets sizes in px but no `font-family` (`radioSim.js:8-33`). The bridge rule `.radio-wrap { … }` has no effect while lines 6 and 7 stay (section 15, A7).

### 3.4 New app names in the bridge

Each is a Dusk token under an app name. None is a raw colour.

| Name | Value | Use |
|---|---|---|
| `--cb-link` | `var(--lit)` | A text button and a link. Dusk has no link colour: `a { color: inherit }` (`dusk.base.css:47`). Today the app uses `--focus` for links (`src/index.css:16,67,77`). |
| `--cb-edge` | `var(--lit-line)` | The edge of an input, a select, a toggle track and a bar track. 4.17 to 4.19 against its ground. |
| `--cb-ok-ink`, `--cb-caution-ink`, `--cb-attn-ink`, `--cb-info-ink` | `--green-ink`, `--amber-ink`, `--red-ink`, `--teal-ink` | State words in `cb-` parts. The high-contrast mode points all four at `--ink`. |
| `--cb-target` | `44px` | The target floor. |
| `--cb-scrim` | `color-mix(in srgb, var(--ground-0) 72%, transparent)` | The dialog backdrop. Dusk has no scrim token. Derived from a token, so it is not a raw colour. Chromium resolves it on `::backdrop` (measured: `color(srgb 0.027 0.024 0.043 / 0.72)`). |
| Seven `--fs-*` names | rem values, see 5.3 | Dusk type that follows the text scale. |

Checks for 3.4:

- **Check 3.4.1: confirmed.** `a { color: inherit }` is `dusk.base.css:47`. Today `--focus` colours a link, the back button and a `summary` (`src/index.css:16,67,77`).
- **Check 3.4.2: confirmed.** Recomputed: `--lit-line` over its ground against that ground is 4.19 (glass), 4.17 (panel), 4.18 (well).
- **Check 3.4.3: confirmed.** In the probe, `getPropertyValue('--cb-scrim')` gives `color-mix(in srgb, #07060b 72%, transparent)` and the open dialog's `::backdrop` computes `color(srgb 0.027451 0.0235294 0.0431373 / 0.72)`.
- **Check 3.4.4: confirmed against the fence.** Each new name is a Dusk token, a length or a `color-mix()` of a Dusk token, and each is in the bridge file, where fence rule 4 allows a colour.

### 3.5 Name clashes

A clash is one name with two declarations after the bridge loads.

| # | Name | App meaning and value | Dusk meaning and value | How the bridge resolves it |
|---|---|---|---|---|
| 1 | `--ink` (shell) | Body text, `#e6edf3` | Body text, `#f4f1ec` | Same meaning. S1 deletes the app declaration (`src/index.css:4`). The bridge does not declare `--ink`. The high-contrast rule re-declares it on purpose (5.2). |
| 2 | `--focus` (shell) | The focus ring **and** the link colour, `#58a6ff` | The focus ring only, `#9fc4ff` | Same name, two app meanings. S1 deletes the app declaration. The ring is Dusk's. Links read `--cb-link`. |
| 3 | `--ink` (Yard, on `.yard-wrap`) | Body text, `#e7ebf0` | Body text | The Yard declaration shadows Dusk's `--ink` for every Dusk part inside `.yard-wrap`. Y1 deletes it. |
| 4 | `--bg`, `--line` (Yard) | Shadow the shell names inside `.yard-wrap` | Not Dusk names | Not a Dusk clash. Y1 deletes both: the shell mapping is the same. |
| 5 | `--line`, `--panel` | App names | Dusk used both names in 0.2.0 and renamed them to `--lit-line` and `--panel-fill` before any page took them (Dusk W-048) | No clash today. A later Dusk version must not take the names back: the `--yard-` prefix removes the risk. |

No other app token name is a Dusk token name. Check: none of `--surface`, `--surface-2`, `--muted`, `--clear`, `--caution`, `--stop`, `--r`, `--maxw`, `--fs`, `--space`, `--font`, `--dim`, `--steel`, `--cror`, `--crorbg`, `--si`, `--sibg`, `--good`, `--bad` or the ten `--r*` Radio names is declared in `dusk.tokens.css`.

**Load-order rule that follows.** A leftover `:root { --ink: … }` in `src/index.css` wins against Dusk if the app sheet loads after Dusk. S1 must delete lines 3 to 5 and line 10 of `src/index.css`, not only add the bridge.

Checks for 3.5:

- **Check 3.5.1: confirmed.** A script read every custom property that the app declares (15 in `src/index.css`, 13 in `yardSim.js`, 10 in `radioSim.js`) and compared each with the 255 Dusk tokens and the 13 local names of the other layers (`--row-neon`, `--tile-cap` and the like). The only names in both sets are `--ink` (shell and Yard) and `--focus` (shell).
- **Check 3.5.2: confirmed.** Dusk `DECISIONS.md` W-048 says: `--line` is now `--lit-line`, `--line-2` is `--lit-rule`, `--panel` is `--panel-fill`.
- **Check 3.5.3: confirmed.** In the emulation, with lines 3 to 5 and line 10 removed, the shell computes Dusk's `--ink` and `--focus`. The Yard still computes its own `--ink` (`#e7ebf0`), which is clash 3.
- **Check 3.5.4: confirmed.** Line 9 of `src/index.css` (the dyslexia rule) can stay or go. It sets `--font` and `--space` only. The bridge's own dyslexia rule (5.1) sets `--font-ui` and `--lh-base`, which the Dusk parts read. The emulation removed line 9 and the bridge rule did the work.

### 3.6 Tokens a script reads

Today: none (section 1). After Y2 the drawing reads tokens. Rules for that:

- `getComputedStyle(root).getPropertyValue('--name')` gives the declared text with each `var()` replaced. Measured in Chromium on the harness.
- A canvas takes a hex, an `rgba()` and a `color-mix()` text. It does not take a gradient or a shadow list.
- Text on the canvas can only be checked for contrast when its ground is one solid colour.

| Token | What the script gets | Canvas takes it | Solid |
|---|---|---|---|
| `--glass`, `--well`, `--head`, `--panel-hi` | `#0a0810`, `#07060b`, `#17131f`, `#13101b` | yes | yes |
| `--ink`, `--ink-2`, `--ink-3`, `--lit`, `--focus` | `#f4f1ec`, `#c8c3d0`, `#9d98a9`, `#f2c27a`, `#9fc4ff` | yes | yes |
| `--grey`, `--tile-grey-lo`, `--green`, `--amber`, `--red`, `--teal-ink`, `--disc-hi`, `--attn`, `--up` | each a six-digit hex | yes | yes |
| `--bg` (bridge) | `#0a0810` | yes | yes |
| `--lit-line`, `--lit-rule`, `--hair-2`, `--rowwash-amber`, `--btn-bg`, `--line` (bridge) | an `rgba()` text | yes | **no** |
| `--cb-scrim` | a `color-mix()` text | yes | **no** |
| `--panel-fill`, `--bar`, `--neon` | a gradient or a shadow list | **no** | no |

Rule for Y2: each colour the drawing reads is a bridge name with a `--yard-` prefix that points at a solid Dusk token. A missing token must stop the drawing with an error, not fall back to a typed colour (Dusk W-032 does the same for its Mermaid bridge).

A first map of the `render.js` palette, for Y2 and R1 to decide. Colour meanings on the track are marked "SME to confirm" (plan T12).

| `render.js` name | Today | Candidate | Solid |
|---|---|---|---|
| `bg`, `panel` | `#0f1216`, `#161a20` | `--well`, `--panel-hi` | yes |
| `rail`, `railDim`, `tie` | `#7d8794`, `#4a525c`, `#2a2f37` | `--grey`, `--tile-grey-lo`, `--head` | yes |
| `normal` | `#39b58a` | `--green` — SME to confirm | yes |
| `reverse` | `#f2b134` | `--amber` — SME to confirm | yes |
| `clear` (foul tick) | `#e2574c` | `--red`: a foul point is attention | yes |
| `loco`, `locoEdge`, `head` | `#2d333c`, `#11a3c4`, `#ffd27a` | `--head`, `--teal-ink`, `--disc-hi` | yes |
| `label`, `dim`, `main` | `#cfd6df`, `#7b8590`, `#9aa3ad` | `--ink-2`, `--ink-3`, `--ink-3` | yes |
| `car`, `carEdge`, `carText` and the car types | `geometry.js` `TYPES`, frozen | The new drawing brings its own palette (fence rule 1). | — |

Checks for 3.6:

- **Check 3.6.1: confirmed.** In the probe, `getPropertyValue` gives: `--glass` `#0a0810`; `--attn` `#e2574c`; `--up` `#3fbf7a`; `--lit` `#f2c27a`; `--bg` (bridge) `#0a0810`; `--line` (bridge) `rgba(242,194,122,0.30)`; `--rowwash-amber` `rgba(204,143,0,0.14)`; `--panel-fill` `linear-gradient(180deg, #13101b, #0d0b14)`; `--cb-scrim` a `color-mix()` text. Each `var()` is replaced.
- **Check 3.6.2: confirmed.** A canvas `fillStyle` takes the `--glass` text, the `--lit-line` text and the `--cb-scrim` text. It does not take the `--panel-fill` text or the `--neon` text: the fill stays at its old value (probe).
- **Check 3.6.3: confirmed.** The `render.js` names and values are `render.js:10-19`. Each candidate token exists and is one solid hex.
- **Check 3.6.4: corrected.** The row for `clear` says red is the foul tick. `render.js:146` also draws the word "LOOSE" in that colour, and draws "TIED" and "⚡ KICKABLE" (`:146,150`) in the `reverse` colour. So the amber candidate carries three meanings on the canvas (a switch lined reverse, a tied cut, a kickable track) and the red candidate carries two. Note 3 for the SME now says so.
- **Check 3.6.5: corrected.** The words on the screen call the `reverse` colour "yellow" and the `normal` colour "green" (`yardSim.js:190-191`), and two rule labels say "Solid = loaded, hollow = empty" (`puzzles.js:18,281`, frozen). The Y2 palette and drawing must keep each of these sentences true. See section 15, A1.
- **Check 3.6.6: confirmed against the fence.** The rule for Y2 keeps fence rule 4: the drawing reads `--yard-` names from the bridge and types no colour. `geometry.js` is not touched.

### 3.7 The colours in `index.html`, `vite.config.ts` and `tauri.conf.json`

A manifest, a `<meta>` tag and a Tauri configuration cannot read a CSS variable. Fence rule 4 allows a raw colour only in the bridge and the frozen files. The way to keep both:

1. `vite.config.ts` reads the value at build time from `src/styles/dusk/dusk.tokens.css`: one regular expression for `--glass:\s*(#[0-9a-f]{6})`. It stops the build with an error when the token is not found. It never falls back to a typed colour.
2. It passes the value to `manifest.theme_color` and `manifest.background_color`.
3. A small `transformIndexHtml` hook in the same file writes `<meta name="theme-color">`. `index.html:7` loses its typed colour.
4. Result: no colour is typed in `index.html` or `vite.config.ts`. The value is `--glass` (`#0a0810`), the window floor, because with `.dusk-stage--app` the window is the whole page. The title bar is a gradient (`--bar`) and cannot be a theme colour.

Both files are S1's. This plan is a design, not a built thing: **not verified** by a build of the real app.

`src-tauri/tauri.conf.json:24` holds `"backgroundColor": "#0e1116"`. A JSON file cannot read a build value. No Wave 2 job has this file in its Files line. The lead must give it to a job. Two ways: a gate check that the value is equal to `--glass`, or a named exception in the raw-colour lint.

`public/favicon.svg` and `public/icons.svg` hold raw colours. They are pictures. The lint (G1) must skip `public/`, or the icon pick (Gate A, D-0028) must settle them.

Checks for 3.7:

- **Check 3.7.1: confirmed.** `index.html:7` holds `#0d1117`. `vite.config.ts:32-33` holds it twice. `src-tauri/tauri.conf.json:24` holds `#0e1116`. `dusk.tokens.css:127` reads `--glass:            #0a0810;`, which the regular expression in step 1 matches. `--glass-side` on line 128 does not match it, because the colon must follow `--glass`.
- **Check 3.7.2: not verified.** The four steps were not built by the check. Both files are in S1's Files line.
- **Check 3.7.3: confirmed.** `--glass` is the body ground in the S1 floor also: in the emulation `body` computes `rgb(10, 8, 16)`, because the app sheet keeps `body { background: var(--bg) }` and the bridge points `--bg` at `--glass`.
- **Check 3.7.4: corrected.** Tested against the fence, and moved. A "named exception in the raw-colour lint" for `tauri.conf.json`, and a lint that skips `public/`, are exceptions to fence rule 4. No fix for these three files stays inside rule 4 as it is written. They are in section 16 for the lead.

---

## 4. Table 3 — the gap register

Each part is page-local, has the prefix `cb-`, and reads Dusk tokens only. A draft of each is in `scratchpad/R3/parts.draft.css`; the harness renders it and section 7 holds its measured ratios.

**Who writes the parts.** Parts G1, G5, G6, G9, G11, G13 and G20 are used on two or more surfaces. If B1, B2, B3 and Y3 each write them, two jobs write one rule. Recommendation: S1 writes one file, `src/styles/clear-board.parts.css`, from this table. The surface jobs only put the classes on. The "owner" column gives the job that writes the style, then the job that uses it first.

States, where a part has them: rest, hover, focus, press, selected, correct, wrong, disabled. Focus is always Dusk's ring (`:focus-visible`, 2 px `--focus`, 2 px offset): 10.28 to 11.36 against each ground.

| # | Part | Why no Dusk part fits (nearest) | Specification, Dusk tokens only | How it meets the fence | Owner |
|---|---|---|---|---|---|
| G1 | **Answer option** `cb-opt`, list `cb-opts` | Nearest: `.dusk-btn`. A Dusk button has a gold word on a gold wash, 12 px. Four long answers in gold text is wrong: an answer is reading text. `.dusk-seg` is for short words. | **Rest:** text `--ink`, fill `--head`, edge `1px --lit-rule`, corner `--r-control`. **Hover:** fill plus `--wash-1`, edge `--neon-ctl`. **Press:** fill plus `--wash-2`, edge `--neon-ctl-on`. **Selected** (`aria-pressed="true"`; not used today, the answer is marked at once): fill plus `--wash-2`, edge `--neon-ctl`. **Correct** `cb-opt--right`: text `--ink`, fill plus `--rowwash-green`, edge `--rowneon-green`, a `✔` mark before the text in `--cb-ok-ink`. **Wrong** `cb-opt--wrong`: text `--ink`, fill plus `--rowwash-red`, edge `--rowneon-red`, a `✕` mark in `--cb-attn-ink`. **Disabled** (the other options after an answer): text `--ink-2`, fill `--well`, `not-allowed` cursor. No opacity. | Height 50 px with one line of text (corrected by Check G1: the minimum height is 48 px and the measured height is 50 px). 6 px corner. State: mark, edge and fill, and the feedback panel says "Right." or "Not quite." in words. Text 11.71 to 16.22. Red only on the wrong pick. | S1, B2 |
| G2 | **Progress bar** | **Not a gap.** `.dusk-bar` with one `.dusk-fill--<tone>` carries it. Keep `role="progressbar"` and the `aria-value*` attributes in the markup. | One addition: `.cb-app .dusk-bar { border: 1px solid var(--cb-edge) }`. Without it the empty track is `--well` on `--panel-hi`: 1.07, with a ring at 1.30. A learner at 0 % sees no bar. With the edge: 4.17. No width transition. | Not a target. Fill against track 5.36 to 8.60. The path panel says the number in words. A domain tile shows no number: see section 12. | S1, B1 |
| G3 | **Dialog** `cb-dialog` | Nearest: `.dusk-win`. Its layout is a two-column grid and it sets `display: grid`, which shows a closed `<dialog>` (measured). | Fill `--glass`, corner `--r-window`, edge `--neon` (a floating surface has a lit edge, `ROLLOUT.md` step 3), width `min(92%, 440px)`, `::backdrop` = `--cb-scrim`. Head = `.dusk-panel-head`. Rows `cb-setrow`: a `--hair` rule between rows. | Native `<dialog>`: Esc and focus trap stay. "Done" is a `.dusk-btn` at 44 px. 6 px controls. | S1, B1 |
| G4 | **Toggle** `cb-toggle` | Nearest: `.dusk-seg` with two segments. That changes the control and adds two words. | A native checkbox, invisible, covers a 56 × 44 px box. Track 50 × 28 px: `--well`, edge `--cb-edge`, corner `--r-control`. Knob 20 × 20 px, corner `--r-chip`. **Off:** knob `--ink-3`, at the left. **On:** track plus `--wash-2`, edge `--neon-ctl`, knob `--lit`, at the right. **Hover:** track plus `--wash-1`. **Focus:** the ring on the track. The knob does not slide: it changes place at once. | Target 56 × 44 px (today 50 × 28). No pill and no circle: Dusk allows `--r-circle` on dots only (W-012). State: knob place and lit edge, not colour alone. Knob against track 7.21 off, 10.59 on (corrected by Check G4: the "on" track has the gold wash). | S1, B1 |
| G5 | **Text input** `cb-input` (search) | Nearest: none. `dusk.base.css:49-55` only sets `font` and `color`. | Fill `--well`, edge `1px --cb-edge`, corner `--r-control`, text `--ink`, placeholder `--ink-3` with `opacity: 1`. **Hover:** edge `--lit`. **Disabled:** text `--ink-2`, edge `--hair-2`. | Height 44 px. Edge 4.18 against the well. Placeholder 7.21 (today 3.44: it fails). | S1, B2 |
| G6 | **Select** `cb-select` | Nearest: none. | The same skin as G5. The native arrow and the native list stay. `color-scheme: dark` (`dusk.base.css:10`) makes the list dark. | Height 44 px (today 39 px in the Yard). The disabled count select loses its inline `opacity: .45` (`yardSim.js:538`). | S1, Y3 |
| G7 | **A tile or a row that is a `<button>`** | `.dusk-tile` and `.dusk-row` are written for `<a>`, `<article>` and `<div>`. On a `<button>` the browser's border, padding, centred text and grey fill stay. | A reset with **zero specificity** and with the app class inside it (corrected by Check G7): `:where(.cb-app button.dusk-tile, .cb-app button.dusk-row) { border: 0; padding: 0; font: inherit; text-align: left; width: 100%; cursor: pointer }` and `:where(.cb-app button.dusk-row) { background: none; padding: var(--sp-1) var(--sp-3) }`. Disabled row: name `--ink-2`, no hover wash, `not-allowed`. | See trap 9.2: a reset with normal specificity removes the lit state. Row height 54.7 px with two lines; the floor gives 44 px with one. | S1, B1 |
| G8 | **Signal frame** `cb-signal` | Nearest: `.dusk-panel`. A panel has a gold lit edge and a gradient: light and colour beside a signal lamp. | Fill `--well`, edge `--ring-well`, corner `--r-tile`, padding `--sp-6`. No glow, no gold, no tone. The SVG from `signal.ts` is not touched: its size rules (`170px`, `120px`) move from `src/index.css:83-84`. | Nothing in the frame has a state. The well is the best Dusk ground for the frozen mast colour: 2.77 (panel 2.58, today 2.37). The flash is a `<animate>` element inside the frozen drawing: see 5.4 and owner pick 6 in section 10. | S1, B2 |
| G9 | **Message banner** `cb-banner` | Nearest: `.dusk-flag` (amber only, with its own `■`) and `.dusk-exit` (a process chip). The app has no toast: the Yard message is the one changing message. | **Rest:** text `--ink-2`, fill `--well`, edge `--ring-well`, corner `--r-control`. **ok:** text `--ink`. **bad:** text `--ink`, fill plus `--rowwash-red`, edge `--rowneon-red`, a `✕` mark in `--cb-attn-ink`. **win:** text `--ink`, fill plus `--rowwash-green`, edge `--rowneon-green` (the app's win strings start with `✓`). | Minimum height 44 px, so the page does not jump when a message comes. The message is `--ink` (15.02 to 17.92), not red text as today (4.91). Red is on the edge and the mark only. | S1, Y3 |
| G10 | **Tabs** `cb-tabs`, `cb-tab` | Nearest: `.dusk-seg`. It lights `button[aria-pressed="true"]`. The app's tabs carry `aria-selected`. A seg button is 24 px high and holds one short word; a tab holds a name and a sub-line. | Track: `--well`, `--ring-well`, `--r-control`. **Rest:** name `--ink-2`, sub-line `--ink-2`. **Hover:** `--wash-1`. **Selected** (`aria-selected="true"`): `--wash-2`, name `--lit`, edge `--neon-ctl`, corner `--r-chip`. | Height 60 px (measured). Selection is gold: chrome, not green as today. `--lit` on the wash 10.59. | S1, B3 |
| G11 | **Plain button and link** `cb-btn--plain`, `cb-link` | Nearest: `.dusk-btn`. Dusk has one button weight. Back, "Look it up", Reset (Yard) and mute are second-rank actions. The fence allows "6 px radius or plain text". | Text `--cb-link`, no fill, corner `--r-control`. **Hover:** `--wash-1` and an underline. **Press:** `--wash-2`. A link inside a sentence stays underlined and takes `--cb-link`. | Height 44 px. 10.35 to 12.11 in each state. | S1, B2 |
| G12 | **Attention button** `cb-btn--attn` | Nearest: `.dusk-btn`. Dusk has no red control. | Text `--cb-attn-ink`, edge `1px --red-ink`, no fill, corner `--r-control`. **Hover:** `--rowwash-red`. **Press:** `--wash-1`. | Height 44 px. Used once: "Reset" in Settings. The word carries it. 5.16 to 5.86 (today 4.72, and 4.27 in today's high-contrast mode: that fails). | S1, B1 |
| G13 | **Chip with its own glyph** `cb-chip`, `--ok`, `--caution`, `--info` | Nearest: `.dusk-state` (adds a second glyph), `.dusk-flag` (amber only), `.dusk-badge` (gold, chrome), `.dusk-tile-tag` (inside a tile only). | Fill `--well`, corner `--r-chip`, size `--fs-s`. **ok:** text `--cb-ok-ink`, edge `--green-ink`. **caution:** text `--cb-caution-ink`, edge `--amber-ink`, dashed. **info:** text `--cb-info-ink`, edge `--teal-ink`. | Not a control. The app's words and glyph carry the state; the dashed edge is a second carrier for caution. 7.21 to 8.60. | S1, B2 |
| G14 | **Result word** `cb-result`, `--ok`, `--no` | Nearest: `.dusk-state--ok` and `--attn`. The Dusk attention glyph is `?`. "? Not quite." reads as a question. | Bold. **ok:** `--cb-ok-ink`, mark `✔`. **no:** `--cb-attn-ink`, mark `✕`. Each mark is CSS content with an empty spoken form, as Dusk writes its own glyphs. | The word is the carrier. 8.00 and 5.53 on a panel. | S1, B2 |
| G15 | **Disclosure and quote** `cb-disclosure`, `cb-quote` | Nearest: none. | Summary: text `--cb-link`, minimum height 44 px. Quote: text `--ink`, fill `--well`, left edge `3px --lit-line`, capped at `--measure`. | Summary height 44 px (today 20 to 24 px). Rule text at the highest contrast in the app: 17.92. | S1, B2 |
| G16 | **Transcript line and call box** `cb-tx`, `cb-tx--eng`, `cb-who`, `cb-call` | Nearest: `.dusk-feed` (first column is a `<time>`), `.dusk-row` (a hover wash on a line that is not a control). | Line: text `--ink`, fill `--well`, left edge `3px --blue` (you) or `--teal` (engineer). Speaker label: `--ink-3`, `--fs-xs`, upper case, as a Dusk label. Call box: text `--ink`, fill `--well`, edge `1px dashed --blue-ink`. | Not a control. The speaker name is in words. 17.92 for the line, 7.21 for the label. | S1, B3 |
| G17 | **Reading text** `cb-prose`, `cb-prose--lead`, `cb-sub` | Dusk type is for a dense desk tool: body 13 px, notes and labels 11 px. A rule, a prompt and an answer are reading text. | `cb-prose`: `--ink`, `1rem`, capped at `--measure`. `--lead`: `1.1rem`. `cb-sub`: `--ink-2`, `--fs-base`. | See owner pick 3. | S1, all |
| G18 | **Code** `cb-code` | Nearest: `.dusk-num`. It has no ground. | `--font-mono`, fill `--well`, corner `--r-chip`. | 17.92. | S1, Y3 |
| G19 | **Home mark** `cb-mark` | Nearest: `.dusk-disc` in `.dusk-brand`. The disc is an ornament, not a control. | A 44 × 44 px button: fill `--well`, edge `--ring-well`, corner `--r-control`. Inside: `i.dusk-led.dusk-led--ok`, with `--led-size` set to 14 px on the mark only. | 44 px (today 42). The lamp is beside the name. `aria-label="Home"` stays. | S1, B1 |
| G20 | **The 44 px floor** (a size gap, not a part) | Dusk control heights, measured: `.dusk-btn` 29 px, `.dusk-seg button` 24 px, `.dusk-badge` 24 px, `.dusk-row` 36 px minimum. | `.cb-app .dusk-btn, .cb-app .dusk-seg button, .cb-app .dusk-row { min-height: var(--cb-target) }` (corrected by Check G20: no `:is()` list). `body` gets the class `cb-app`. The button word rises to `--fs-base`. | Written this way it is a Dusk class under an app class: the kind of rule the reskin tools allow (`reskin-tools/README.md`, `--namespace`, third kind). Measured with the floor: 44 px each. | S1 |

Token gaps (Dusk has no token; the bridge gives one in 3.4): a link colour, a control edge, a scrim, a target size, a high-contrast set, a type scale that follows the root.

**A ruling the lead must make.** Parts G1, G9 and G14 add a `✔` or `✕` mark in CSS. Today a right or wrong option is marked by colour alone (`src/index.css:93-94`). Fence rule 5 asks for more than colour. Fence rule 3 says a reskin adds no word. A CSS mark is not a word and a screen reader does not speak it. If the lead rules that a mark is a change of content, the three parts lose the mark and a U1 row must add a spoken state.

Checks for section 4. Each part was read in `parts.draft.css` and drawn in the checker's own probe pages with the six Dusk layers, the draft bridge and the draft parts. Each fix was tested against the fence and against the strict namespace check of the reskin tools (`dusk-sync.mjs check --namespace … --strict-namespace`).

- **Check G1: corrected.** The option is 50 px high with one line, not 48: `min-height` is 48 px, and 24 px of text, 24 px of padding and a 2 px border make 50 (probe, and the report's own `map-measure.json` says 50). Ratios recomputed: `--ink` on `--head` 16.22, on the green wash 13.00, on the red wash 13.90; the red mark on the red wash 4.61; disabled text 11.71. Fence: tokens only, 6 px corner, red on the wrong pick only. The mark is the ruling at the end of this section.
- **Check G2: confirmed.** An empty `.dusk-bar` is `--well` on `--panel-hi`: 1.07. The ring is 1.30. With `.cb-app .dusk-bar { border: 1px solid var(--cb-edge) }` the probe computes a 1 px edge of gold at 0.55: 4.17 on a panel. The rule passes the strict namespace check.
- **Check G3: confirmed.** See Check 2.3.2. Fence: the native `<dialog>` is kept, so the keyboard behaviour does not change.
- **Check G4: corrected.** The box is 56 × 44 px and the track is 50 × 28 px (probe). The "on" knob is `--lit` on the well with the gold wash (`#1f1916`): 10.59, not 12.28. 12.28 is `--lit` on the plain well. The "off" knob is 7.21. The draft puts the focus ring on the track: today the ring is on an input with `opacity: 0` (`src/index.css:114`).
- **Check G5: confirmed.** Height 44 px (probe). Edge 4.18 on the well. Placeholder `--ink-3` on the well 7.21. Today the placeholder is 3.44 (`#757575` on `--surface-2`), and 3.10 in high contrast.
- **Check G6: corrected.** Height 44 px (probe); today 39 px (measured). The inline `opacity: .45` is set by controller code (`yardSim.js:538`), not by a style rule. After Y1 that line is in the controller file, and Y3's Files line is "Y1's view and style files". The lead must name who removes it. While it stays, the disabled select text computes about 3.0 against the well (`--ink-2` at 0.45).
- **Check G7: corrected.** The draft reset `:where(button.dusk-tile, button.dusk-row)` keeps the lit wash (probe: `rgba(242, 194, 122, 0.1)`), but it fails the strict namespace check: "restyles 2 of Dusk's classes everywhere". With the app class inside the `:where()` the check passes, the specificity is still zero, and the lit row keeps its wash (probe 2). A reset with normal specificity loses the wash (probe: `rgba(0, 0, 0, 0)`), as trap 9.2 says. The draft's three `button.dusk-row[disabled]` rules need `.cb-app` in front for the same reason.
- **Check G8: confirmed.** Recomputed: the mast `#46586e` is 2.77 on `--well`, 2.58 on `--panel-hi`, 2.73 on `--glass`, 2.37 today on `--surface`. Fence: `signal.ts` is not touched; the frame is a wrapper class in `Signal.tsx:7`.
- **Check G9: confirmed.** Minimum height 44 px (probe). Recomputed: `--ink` 17.92 on the well, 15.88 on the red wash, 15.02 on the green wash; rest text 11.71; today's refusal text 4.91. Each win string in `yardSim.js` starts with `✓` (lines 438, 502, 514, 590). The `✕` mark is the ruling at the end of this section.
- **Check G10: confirmed.** Height 60 px (probe). `--lit` on the wash over the well 10.59; the sub-line 10.10. Fence rule 5: a selected tab is shown by fill, edge and ink colour, with no mark and no word. That is the same as today (`src/index.css:126`) and the same as Dusk's own `.dusk-seg`. `aria-selected` carries the state for a screen reader. The lead can accept this or ask U1 for a mark.
- **Check G11: confirmed.** Height 44 px (probe). 12.11 at rest, 11.07 on hover, 10.35 on press.
- **Check G12: confirmed.** Height 44 px (probe). 5.86 at rest, 5.16 on hover, 5.36 on press. Today 4.72, and 4.27 in high contrast. Fence rule 5: red is on one control, "Reset", and the word carries the meaning.
- **Check G13: confirmed.** Recomputed on the well: green 8.60, amber 7.21, teal 7.87. The size is 12 px (probe); today the badge is 11.52 px.
- **Check G14: confirmed.** Recomputed on a panel: green 8.00, red 5.53. The Dusk attention glyph is `?` (`dusk.components.css:574`).
- **Check G15: confirmed.** Summary 44 px (probe). Today a `summary` is 24 px high in Reference and 20 px in the Yard (measured).
- **Check G16: confirmed.** Recomputed: line text 17.92, speaker label 7.21. The edge colours are in Check 3.3.2: the engineer's edge must stay a green while the sentence at `radioSim.js:76` stays.
- **Check G17: corrected.** `cb-prose` computes 16 px, `cb-prose--lead` 17.6 px, `cb-sub` 14 px (probe). The class `cb-sub` loses against `.dusk-row small` (Check 2.4.2). The mapping uses Dusk's small sizes for more than labels (section 15, A2).
- **Check G18: confirmed.** 17.92 on the well. Not drawn in the probe.
- **Check G19: corrected.** The mark is 44 × 44 px (probe); today 42 × 42 (measured). The specification says `i.dusk-led.dusk-led--ok` inside. The draft part does not use it: it draws its own `span`. `.dusk-led` has `margin-right: var(--sp-2)` (`dusk.compose.css:93`), so a lamp in the middle of the mark needs `margin: 0` under an app class. In Dusk a `.dusk-led--ok` is a state lamp that is "always beside its word" (`dusk.components.css:62`). In the mark the lamp is the brand, not a state. The Dusk lamp in the mark was not drawn: **not verified**.
- **Check G20: refuted.** Bare Dusk heights in the probe: `.dusk-btn` 29 px, `.dusk-seg button` 24 px, `.dusk-badge` 24 px, `.dusk-row` 36 px. The draft rule with `:is(…)` gives 44 px each but fails the strict namespace check ("restyles 2 of Dusk's classes everywhere: .dusk-row .dusk-seg"): the tool reads each item of the `:is()` list alone. The same rule written as three selectors with `.cb-app` in front of each passes and gives 44 px each (probe 2).
- **Check 4.1 (the ruling on a CSS mark): confirmed.** Today a right or wrong option differs by edge and fill colour only (`src/index.css:93-94`), and the draft marks are CSS `content` with an empty spoken form. The ruling belongs to the lead. `.dusk-sr` (Check 2.8.3) is the Dusk part for a spoken state.
- **Check 4.2 (who writes the parts): confirmed.** `src/styles/**` is in S1's Files line (plan, Wave 2a), so one parts file by S1 keeps "one writer for one file".

---

## 5. The four reading modes on Dusk

### 5.1 Dyslexia type

| | |
|---|---|
| Today | `html[data-dys="1"]` sets `--font` to `"Atkinson Hyperlegible","Comic Sans MS",Verdana,sans-serif`, `--space: 1.8`, letter spacing `.02em`, word spacing `.08em` (`src/index.css:9`). `AppContext.tsx:57` writes the attribute. The Yard (`yardSim.js:49`) sets its own `font`, so the mode does not reach it. The guided Radio sets no font family, so the face and the line height do reach it (corrected by Check 5.1.2). The letter spacing and the word spacing do not reach text inside a `<button>`, an `<input>` or a `<select>` on any screen (Check 5.1.3). |
| Is the face shipped | **No.** No `@font-face`, no font file (section 1). On this Linux machine Chromium painted the dyslexia mode in "Liberation Sans": none of the three named faces is installed here (measured through `CSS.getPlatformFontsForNode`). A device shows the first of the three faces it has, or its default sans-serif. `vite.config.ts:21` already lists `woff2` in the offline cache pattern. |
| What Dusk gives | Two font tokens: `--font-ui` and `--font-mono`. `body` reads `--font-ui` (`dusk.base.css:21`). 10 rules in the components layer and 1 in the base layer set `font-family: var(--font-mono)` for figures. Dusk ships no font file (D-011). Line height is `--lh-base` (1.45) on `body`; 9 rules set a fixed line height (1, 1.2, 1.25, 1.3, 1.35 or `--lh-tight`). 6 rules in the components layer make a label upper case, with `--track-label` (0.07em). |
| Plan | In the bridge, under `html[data-dys="1"]`: `--font-ui` = the dyslexia stack; `--font-mono: var(--font-ui)`, so figures change too (figures stay tabular: `dusk.base.css:59`); `--lh-base: 1.8`; `--track-label: .03em`; keep `letter-spacing: .02em; word-spacing: .08em` on `html`. The Yard and Radio style files stop setting `font`. |
| Measured | With the draft bridge, each Dusk part and each `cb-` part computes the dyslexia stack, body line height is 28.8 px at 16 px, and the harness has no sideways scroll at 390 with the dyslexia mode and the text scale both on. |
| Limits | Parts with a fixed line height do not loosen (`.dusk-tile-sub` stays 1.35). Upper-case labels stay upper case: a token cannot change `text-transform`. If the owner wants plain-case labels in this mode, it is one page-local rule under `html[data-dys="1"]`. Whether upper case is a problem for these readers is **not verified**: the dyslexia style guide could not be opened from this session. |
| To make the mode real | Ship the face in the app. See owner pick 5. |

Checks for 5.1:

- **Check 5.1.1: confirmed.** `src/index.css:9` is as quoted. With the mode on, Chromium's `CSS.getPlatformFontsForNode` reports "Liberation Sans" for a heading on this machine. No font file is in the repository. `vite.config.ts:21` lists `woff2`.
- **Check 5.1.2: refuted.** With the mode on, `.yard-wrap` computes `system-ui, -apple-system, "Segoe UI", sans-serif` at 15 px: the mode does not reach the Yard. `.radio-wrap .scenario` computes the dyslexia stack: the mode does reach the guided Radio. The Radio island sets sizes only (`radioSim.js:8-33`). The old statement is in section 17.
- **Check 5.1.3: corrected.** The plan keeps `letter-spacing: .02em; word-spacing: .08em` on `html`. A browser does not pass these two properties into a form control. Measured in the running app with the mode on: `body` computes letter spacing 0.32 px and word spacing 1.28 px; an answer option (`.opt`), the back button and a `.iconbtn` compute `normal` and 0 px. In the probe a `cb-opt` computes `normal` also. So the spacing of the mode does not reach an answer option, a result row, a station button, a domain card or a tab, today or in the plan. One rule under the mode would carry it: `letter-spacing: inherit; word-spacing: inherit` on `button, input, select`. That makes the mode do more than today, so the lead must rule if it is part of the reskin or a U1 row. See section 15, A6.
- **Check 5.1.4: confirmed.** Counted with `grep`: `font-family: var(--font-mono)` is in 10 rules of the components layer and 1 of the base layer; 9 rules of the components layer set a fixed line height (1.2, 1.25, 1, 1, 1, 1.2, `--lh-tight`, 1.3, 1.35); 6 rules of the components layer set `text-transform: uppercase`.
- **Check 5.1.5: confirmed.** In the probe with the draft bridge and the mode on: body text, a `.dusk-count`, a `.dusk-tile-num` and a `cb-opt` compute the dyslexia stack; body line height is 33.3 px at 18.5 px (1.8); `.dusk-tile-sub` stays at 1.35. No sideways scroll at 1440 or 390 with the mode and the text scale both on.
- **Check 5.1.6: not verified.** The dyslexia style guide did not open for the check either. The effect of upper-case labels on these readers stays not verified.

### 5.2 High contrast

| | |
|---|---|
| Today | `html[data-contrast="1"]` raises `--ink` to `#ffffff`, `--muted` to `#d6e0ea`, `--line` to `#5b6a79`, and makes the two surfaces **lighter** (`src/index.css:10`). Measured effect: body text 16.00 → 18.91, muted 7.05 → 12.12. Three pairs get **worse**: "✓ verified" 6.81 → 6.38, "Not quite." 5.16 → 4.83, "Reset" 4.72 → **4.27, which fails AA**. The mode does not reach the Yard or the guided Radio: every pair there is the same in both modes. |
| What Dusk gives | No high-contrast set. One dark ground (D-012). Default Dusk is already above AA: `--ink` 16.22 to 17.92, `--ink-2` solved to 10, `--ink-3` to 6.5, each semantic ink to 4.5 or more on every surface. The lowest pairs are white on a tile cap: 4.55 to 4.67, solved to the 4.5 floor. |
| Plan | In the bridge, under `html[data-contrast="1"]`, re-declare Dusk tokens with other Dusk tokens. No raw colour. The Dusk copy is not edited; Dusk's own preview uses scoped overrides the same way (W-025). |

| Token | Default | High contrast | Measured effect |
|---|---|---|---|
| `--ink` | `#f4f1ec` | `var(--on-tile)` = `#ffffff` | On `--glass` 17.67 → 19.90. On `--panel-hi` 16.68 → 18.79. |
| `--ink-3` | `#9d98a9` | `var(--ink-2)` = `#c8c3d0` | Labels, notes, sub-lines: 6.52 (worst, on `--head`) → 10.59. The two lower text levels become one. |
| `--hair` | white 0.075 | `var(--hair-2)` = white 0.15 | A row rule: 1.16 → 1.46 on `--glass`. |
| `--lit-rule` (and so `--line`) | gold 0.30 | `var(--lit-line)` = gold 0.55 | A divider: 2.00 → 4.19 on `--glass`. |
| `--cb-edge` | `--lit-line` | `var(--lit)` | An input edge: 4.18 → 12.28 on `--well`. |
| The four `--cb-*-ink` names | the semantic inks | `var(--ink)` | A state word in a `cb-` part: 5.53 (red) → 18.79. The edge and the mark keep the tone. |
| `--tile-<tone>-hi`, eight names | the light cap end | `var(--tile-<tone>-lo)` | White on a cap: 4.55 to 4.67 → 6.35 (teal), 6.45 (green), 7.48 to 10.03 (the other six). The cap is one flat colour. |

Result, all measured: the lowest text pair goes from 4.55 to 5.52. Measured samples under 7: 42 → 15 (as different pairs: 23 → 8; clarified by Check 5.2.3). The 15 are Dusk parts that read a semantic ink directly (`--blue-ink` 5.52 and 5.85, `--red-ink` in `.dusk-state--attn` 5.53, `--amber-ink` 5.55 to 6.71, `--grey-ink` 6.10) and the teal and green caps. The plan cannot raise those without a raw colour: Dusk 0.2.0 has no paler ink. The mode reaches the Yard chrome and the Radio, because both read bridge tokens. `--ink-2` cannot rise by a token: a custom property cannot read its own old value, and `--ink-2: var(--ink)` would make all three levels one colour.

Checks for 5.2:

- **Check 5.2.1: confirmed.** Today's numbers, recomputed from `src/index.css:3-5,10` and read again from real pixels: body text 16.00 → 18.91; muted on a surface 7.05 → 12.12; "✓ verified" 6.81 → 6.38; "Not quite." 5.16 → 4.83; "Reset" 4.72 → 4.27. The Yard and the guided Radio give the same value in both modes for each of their text nodes (81 in the Yard, 14 in the guided Radio, `today4.mjs`).
- **Check 5.2.2: confirmed.** The plan's table, recomputed: `--ink` 17.67 → 19.90 on glass and 16.68 → 18.79 on a panel; `--ink-3` on `--head` 6.52 → 10.59; `--hair` on glass 1.16 → 1.46; `--lit-rule` on glass 2.00 → 4.19; `--cb-edge` on the well 4.18 → 12.28; white on the eight flat caps 6.35 (teal), 6.45 (green), 7.48 (red), 7.92 (blue), 8.46 (down), 9.27 (amber), 9.64 (violet), 10.03 (grey).
- **Check 5.2.3: corrected.** "42 → 15" counts measured samples in the report's `map-measure.json` (159 samples by default, 152 in high contrast). Counted as different pairs, as tables 7.1 and 7.2 count, it is 23 → 8. The sentence now gives both.
- **Check 5.2.4: corrected.** The plan has a side effect that the report does not name. The edge of an icon square reads `--tile-<tone>-hi` (`dusk.components.css:131,146-160`). The high-contrast rule points each `-hi` name at the darker `-lo` name. The edge of an unlit icon square against `--glass` then drops: grey 4.37 → 1.98, amber 4.36 → 2.15, teal 4.26 → 3.13 (recomputed). The square itself is `--well` on `--glass`, 1.01, so the edge is what shows it. The glyph inside keeps its ink. See section 15, A10.
- **Check 5.2.5: confirmed against the fence.** The rule re-declares Dusk tokens with other Dusk tokens, in the bridge file. No raw colour. The Dusk copy is not edited. In the emulated S1 floor with the mode on, no text pair on the shell screens is under 5.25 except the disabled Exam button.
- **Check 5.2.6: confirmed.** The mode does not reach the Yard or the guided Radio until Y1 and B3 remove the island declarations (section 15, A7). After that it reaches them, because they read bridge names.

### 5.3 Text scale

| | |
|---|---|
| Today | `AppContext.tsx:60` sets `--fs` on `<html>` to `16px` or `18.5px`. `src/index.css:14` sets `html { font-size: var(--fs) }`. Every size in `src/index.css` is in rem. The Yard and the guided Radio size their text in px (`yardSim.js:49,70-134`, `radioSim.js:10-33`): the scale does not reach them. Text drawn on the canvas and in the Radio SVG does not scale. |
| What Dusk gives | Type in **px**: `--fs-xs` 11, `--fs-s` 12, `--fs-data` 13, `--fs-base` 14, `--fs-l` 15, `--fs-title` 20, `--fs-num` 27 (`dusk.tokens.css:340-346`). Space and heights are px too. A rem root change does not reach a Dusk part. One exception: `.dusk-feed li` uses `4.25rem` (`dusk.compose.css:382`). |
| Plan | The bridge re-declares the seven names in rem, at the same size for a 16 px root: `.6875rem`, `.75rem`, `.8125rem`, `.875rem`, `.9375rem`, `1.25rem`, `1.6875rem`. `html { font-size: var(--fs) }` stays. `AppContext.tsx` does not change. The Yard and Radio style files move to rem or to the `--fs-*` names. |
| Measured | With `--fs: 18.5px` each Dusk part grows by 1.156: `.dusk-count` 11 → 12.72 px, `.dusk-panel-name` 13 → 15.03, `.dusk-tile-num` 27 → 31.22, `.dusk-title` 20 → 23.13. Control heights hold at 44 px or grow. No sideways scroll at 1440 or 390. The fixed 20 px icon square holds a 13.9 px glyph. |
| Limits | The step is 16 → 18.5 px only (15.6 %). Space tokens stay in px, so padding does not grow. That is the same as today. |

Checks for 5.3:

- **Check 5.3.1: confirmed.** `AppContext.tsx:60` and `src/index.css:14` are as quoted. The seven Dusk sizes are `dusk.tokens.css:340-346`. The one `rem` in a Dusk layer is `dusk.compose.css:382`.
- **Check 5.3.2: confirmed.** The seven rem values are the px values divided by 16 (11, 12, 13, 14, 15, 20, 27).
- **Check 5.3.3: confirmed.** In the probe with `--fs: 18.5px`: `.dusk-count` 12.72 px, `.dusk-panel-name` 15.03 px, `.dusk-tile-num` 31.22 px, `.dusk-title` 23.13 px, the glyph in an icon square 13.88 px. Heights: `.dusk-btn` 44, `.dusk-row` 44 (62 with two lines at 390), `cb-opt` 53.8, `cb-tab` 66.6, `cb-input` 44. No sideways scroll at 1440 or 390.
- **Check 5.3.4: confirmed.** With "Bigger text" on, the root is 18.5 px and the Radio tabs grow from 16 px to 18.5 px. The island text does not change: Yard wrapper 15 px, readout 16 px, hint 12.5 px, back button 14 px; Radio scenario 13.5 px, title 17 px (measured in the running app, both settings). The Radio SVG text has `font-size` attributes from 9 to 14 in a 760-unit box.

### 5.4 Reduced motion

| | |
|---|---|
| Today | The setting starts from the operating system flag once (`AppContext.tsx:12`) and is stored after that. `html[data-reduce="1"]` stops two transitions only: the bar width and the toggle (`src/index.css:43,119`). A media query stops every animation and transition when the operating system flag is on (`src/index.css:140-148`). The Yard reads the setting and plays 6 times faster (`yardSim.js:228-229`, T4). **The signal lamp flash does not stop**, with the setting or with the flag: it is a `<animate>` element inside the frozen drawing (`signal.ts:35`; the flag that turns it on is on line 33). Measured in the running app: lamp opacity 0.68, then 0.38 after 480 ms, in both cases. 25 of the 42 signal items have a flashing aspect. |
| What Dusk gives | A media query only: `@media (prefers-reduced-motion: reduce)` in the components layer (`dusk.components.css:630-639`), the motion layer (`dusk.motion.css:62-78`) and the process layer (`:164-166`). Dusk does not know the app attribute. With the setting on and the flag off, Dusk Tier 1 still runs: 160 ms transitions on `.dusk-btn`, `.dusk-row`, `.dusk-seg button`, `.dusk-tile`, and the 2 px tile lift (measured: `matrix(1, 0, 0, 1, 0, -2)`). |
| Plan | Three rules in the app sheet repeat Dusk's own reduced-motion block under the app attribute, with the same parts. **Corrected by Check 5.4.3: each selector carries the app class and no `:is()` list**: (1) `html[data-reduce="1"] .cb-app .dusk-tile, html[data-reduce="1"] .cb-app .dusk-btn, html[data-reduce="1"] .cb-app .dusk-seg button, html[data-reduce="1"] .cb-app .dusk-row { transition: none }`; (2) `html[data-reduce="1"] .cb-app .dusk-tile:hover, html[data-reduce="1"] .cb-app .dusk-tile:focus-within { transform: none }`; (3) `html[data-reduce="1"] [class*="cb-"] { transition: none; animation: none }`. The two `.dusk-station` selectors of Dusk's block are not needed: the mapping uses no process part. Keep the media-query block of `src/index.css:140-148` for the flag. The pressed `translateY(1px)` of `src/index.css:136-137` goes: a press is a fill change in Dusk. |
| Measured | With the setting on and the flag off, each of the five parts computes `transition: 0s / none`, and a hovered tile computes `transform: none`. The brighter edge, the wash and the focus ring stay, so each state is still visible. |
| Tiers 2 and 3 | With STRICT and no `.dusk-enter` in the markup there is nothing to stop. If the owner picks OPEN, the app must also write `data-ambient="off"` and remove the entrance when the setting is on: Dusk's own stop is behind the media query only. |
| Not in the plan | The Yard motion (R7, Y4). The lamp flash: owner pick 6 and note 1 for the SME. |

Checks for 5.4:

- **Check 5.4.1: confirmed.** `AppContext.tsx:12`, `src/index.css:43,119,140-148` and `yardSim.js:228-229` are as described.
- **Check 5.4.2: corrected.** The lamp flash runs in all three cases. The checker read the lamp opacity six times, 170 ms apart, on the Reference entry "406 CLEAR TO LIMITED": with default settings 0.91, 0.59, 0.30, 0.27, 0.56, 0.85; with the app setting on 0.88, 0.59, 0.30, 0.27, 0.56, 0.88; with the operating system flag on 0.91, 0.59, 0.30, 0.27, 0.56, 0.85. The `<animate>` element is on `signal.ts:35`, not 33: the text now says so. The cycle is one second (`dur="1s"`, values 1, 0.12, 1). 25 of the 42 items in `public/data/signals.json` have an aspect with a flashing lit lamp (counted by script with the same test as `signal.ts:32-33`).
- **Check 5.4.3: corrected.** The first two rules of the plan, written with `:is(…)` and no app class, fail the strict namespace check ("restyles 2 of Dusk's classes everywhere"). The corrected rules in the table pass it. Drawn by the check with the setting on and the flag off: `.dusk-btn` and `.dusk-row` compute `transition: 0s none`, and a hovered tile computes `transform: none` (`fixes.mjs`). The `:is()` form gave the same computed values in the first probe.
- **Check 5.4.4: confirmed.** With the setting off, the probe computes 160 ms transitions on `.dusk-btn`, `.dusk-row`, `.dusk-seg button`, `.dusk-tile` and `cb-opt`, and a hovered tile computes `matrix(1, 0, 0, 1, 0, -2)`. With the setting on, the hovered tile keeps its brighter edge.
- **Check 5.4.5: confirmed.** Each rule of `dusk.motion.css` is under `html[data-tier="open"]`, under `html[data-tier="strict"][data-ambient="on"]`, a `@keyframes` block, or inside the reduced-motion block (lines 20 to 78). The Dusk blocks are `dusk.components.css:630-639`, `dusk.motion.css:62-78`, `dusk.process.css:164-166`.
- **Check 5.4.6: corrected.** Tested against the fence: the report names the gap but not the rule. Fence rule 6 says reduced motion stops every effect. The flash is an effect and it does not stop. The plan cannot stop it without an edit to a frozen file or a change beside it. This is in section 16.

---

## 6. The page-law tier

**Source limit.** The page law is in the owner's law files. They are not in this repository or in the Dusk repository. This section says what the Dusk files say. A page-law rule that Dusk does not repeat is **not verified**.

| | STRICT (also: no attribute) | OPEN |
|---|---|---|
| Markup | `<html data-tier="strict">`, or no attribute | `<html data-tier="open">` |
| Tier 1, state changes: button and row fills, the brighter lit edge, the 2 px tile lift, 160 ms | on | on |
| Tier 2, entrance: `.dusk-enter` rests 8 px low and settles in 420 ms when a page script writes `.is-in` | **off** | on |
| Tier 2, the traveller on a process track, 6 s | **off** | on |
| Tier 3, ambient: the horizon behind the windows drifts on a 120 s loop | **off**. A STRICT page may opt in with `data-ambient="on"`, on `body::before` only (W-026). | on, unless `data-ambient="off"` |
| Reduced motion (the operating system flag) | every effect stops | every effect stops |

Sources: `ARCHITECTURE.md` "The tier switch"; `dusk.motion.css:20-56`; Dusk `DECISIONS.md` D-017, W-018, W-026.

Three more facts:

- Dusk's `README.md` (step 3) names the tier for "Desk, Rail, and any page with no tier line": STRICT. Clear Board is a rail page (plan T13: served at `/rail/clear-board/`).
- A page that is one whole window (`.dusk-stage--app`) covers the horizon (`dusk.base.css:25-28`). The ambient drift would not be seen. So OPEN adds one thing to this app: the entrance, and it needs a new script.
- The app's own motion is not Dusk motion: the Yard animation, the lamp flash. A tier does not switch it.

**Recommendation: STRICT.** Reasons: (1) the audience is anxious learners, and a part that moves when it comes into view takes attention from the rule on the screen; (2) Dusk names STRICT for a rail page; (3) OPEN adds only an entrance, and the entrance needs a script, a stop under the app setting and a test; (4) no line already means STRICT, so the app is correct today. The work: add the line `Page law tier: STRICT` to `DECISIONS.md` and `data-tier="strict"` to `index.html`. The tier is the owner's pick (owner pick 1).

Checks for section 6:

- **Check 6.1: confirmed.** The tier table agrees with `ARCHITECTURE.md` "The tier switch" (lines 69 to 81), with `dusk.motion.css:20-56` and with the tokens: `--m-enter: 420ms`, `--enter-shift: 8px`, `--m-ride: 6000ms`, `--m-drift: 120s`, `--m-confirm: 160ms`, `--lift: -2px` (`dusk.tokens.css:410-416`). Dusk `DECISIONS.md` holds D-017, W-018 and W-026 with the meanings used here.
- **Check 6.2: confirmed.** Dusk `README.md` line 29 reads `<html lang="en" data-tier="strict">   <!-- Desk, Rail, and any page with no tier line -->`, and line 33 says a page with no `data-tier` behaves as STRICT.
- **Check 6.3: not verified.** That "Rail" in that comment means the part of the owner's site that serves `/rail/clear-board/` is a reading of the name. No file says it. The second half of the comment, "any page with no tier line", covers Clear Board in each case.
- **Check 6.4: corrected.** "A page that is one whole window covers the horizon" is true only after B1 adds `.dusk-stage--app`. In the S1 floor there is no Dusk window, and the horizon (`body::before`, `dusk.base.css:29-36`) shows as a faint warm glow low on the page behind the app (picture `R3-check/s1floor-home-1440.png`). No text pair went under 5.25 because of it in the emulation. S1 must look at it, and can keep it or hide it with one rule in the app sheet.
- **Check 6.5: confirmed against the fence.** STRICT adds no motion and no script. The recommendation needs two lines of work, both outside this wave. The tier stays the owner's pick.
- **Check 6.6: not verified.** The page law itself is not in either repository. This section says what the Dusk files say.

---

## 7. Table 4 — contrast, measured

Each ratio is from Chromium's computed colours on the harness. "Need" is 4.5 for text and 3 for large text (24 px, or 18.66 px bold). The grounds are the worst stop of any gradient. Result of the whole table: **no text pair fails AA in either mode.** Default: 82 different pairs, lowest 4.55. High contrast: 72 different pairs, lowest 5.52.

**Check 7.0: corrected.** The result is true for the 82 and 72 pairs that the harness drew: the check recomputed each one. It is not the whole mapping. The check found one pair that the bridge can make and that the harness did not draw: `--blue-ink` on the amber wash over `--head`, 4.41, under AA in both modes. The same ink on the amber wash over a panel is 4.57. The rows are under table 7.1, and the rule that keeps the 4.41 pair out of the build is in section 15, A9.

### 7.1 Default mode — every text pair

The rows "tile red" are measured for completeness. The mapping uses no red tile: red is attention only. "Used by" names the sample in the harness.

| Ratio | Need | Result | Text | Ground | Smallest size | Used by |
|---|---|---|---|---|---|---|
| 4.55 | 4.5 | pass | --on-tile #ffffff | --tile-grey-hi #6f7686 | 12 px | tile grey; row lit gold |
| 4.56 | 4.5 | pass | --on-tile #ffffff | --tile-violet-hi #8059f0 | 12 px | tile violet |
| 4.56 | 4.5 | pass | --on-tile #ffffff | --tile-amber-hi #9c6d00 | 12 px | tile amber; row lit amber (flagged list line); rule tile S.I. |
| 4.56 | 4.5 | pass | --on-tile #ffffff | --tile-red-hi #dc3629 | 12 px | tile red |
| 4.57 | 4.5 | pass | --on-tile #ffffff | --tile-green-hi #2c8555 | 12 px | tile green |
| 4.57 | 4.5 | pass | --on-tile #ffffff | --tile-down-hi #df2a54 | 12 px | tile down |
| 4.58 | 4.5 | pass | --on-tile #ffffff | --tile-blue-hi #1070ef | 12 px | tile blue; rule tile CROR |
| 4.61 | 4.5 | pass | --red-ink #ea5d50 | --rowwash-red on --head #331d25 | 16 px | option wrong |
| 4.67 | 4.5 | pass | --on-tile #ffffff | --tile-teal-hi #22817c | 12 px | tile teal; row lit teal; score tile |
| 5.27 | 4.5 | pass | --red-ink #ea5d50 | --rowwash-red on --well #261114 | 16 px | banner bad |
| 5.52 | 4.5 | pass | --blue-ink #3d8bf2 | --panel-hi #13101b | 12 px | rule cite line (blue) |
| 5.53 | 4.5 | pass | --red-ink #ea5d50 | --panel-hi #13101b | 16 px | dusk-state attn; result no |
| 5.55 | 4.5 | pass | --amber-ink #cc8f00 | --rowwash-amber on --panel-hi #2d2217 | 16 px | S.I. heading on amber wash |
| 5.56 | 4.5 | pass | --ink-3 #9d98a9 | --wash-2 on --panel-hi #292225 | 11 px | strip key cell |
| 5.85 | 4.5 | pass | --blue-ink #3d8bf2 | --glass #0a0810 | 12 px | CROR key |
| 5.86 | 4.5 | pass | --red-ink #ea5d50 | --glass #0a0810 | 14 px | attention button (Reset) |
| 6.10 | 4.5 | pass | --grey-ink #828dab | --well #07060b | 11 px | tile grey; row (station); row disabled (Exam); reference row |
| 6.24 | 4.5 | pass | --green-ink #3fbf79 | --rowwash-green on --head #1d2b2c | 16 px | option correct |
| 6.52 | 4.5 | pass | --ink-3 #9d98a9 | --head #17131f | 12 px | panel head; panel sub |
| 6.65 | 4.5 | pass | --ink-3 #9d98a9 | --thead #14111c | 11 px | table head |
| 6.71 | 4.5 | pass | --amber-ink #cc8f00 | --panel-hi #13101b | 12 px | dusk-state caution; dusk-flag; GOI line |
| 6.71 | 4.5 | pass | --ink-3 #9d98a9 | --panel-hi #13101b | 11 px | note (cite) on panel; feedback panel; strip cell; work order tip (note); dusk-feed row |
| 6.82 | 4.5 | pass | --ink-3 #9d98a9 | --bar, light end #110e18 | 16 px | title bar |
| 7.10 | 4.5 | pass | --amber-ink #cc8f00 | --glass #0a0810 | 12 px | S.I. key |
| 7.11 | 4.5 | pass | --ink-3 #9d98a9 | --glass #0a0810 | 11 px | section heading (dusk-rule b); row (station); row disabled (Exam); note (footer); reference row; named rule (legend) |
| 7.17 | 4.5 | pass | --ink-3 #9d98a9 | --glass-side #08070c | 11 px | status bar |
| 7.21 | 4.5 | pass | --on-tile #ffffff | #525763 | 12 px | tile grey |
| 7.21 | 4.5 | pass | --amber-ink #cc8f00 | --well #07060b | 12 px | chip caution |
| 7.21 | 4.5 | pass | --ink-3 #9d98a9 | --well #07060b | 11 px | transcript who; search input |
| 7.24 | 4.5 | pass | --on-tile #ffffff | #5f42b2 | 12 px | tile violet |
| 7.24 | 4.5 | pass | --on-tile #ffffff | #735100 | 12 px | tile amber |
| 7.25 | 4.5 | pass | --on-tile #ffffff | #21623f | 12 px | tile green |
| 7.28 | 4.5 | pass | --on-tile #ffffff | #0c53b1 | 12 px | tile blue |
| 7.30 | 4.5 | pass | --on-tile #ffffff | #a3281e | 12 px | tile red |
| 7.32 | 4.5 | pass | --on-tile #ffffff | #a51f3e | 12 px | tile down |
| 7.32 | 4.5 | pass | --teal-ink #31b3ad | --panel-hi #13101b | 16 px | dusk-state info |
| 7.37 | 4.5 | pass | --on-tile #ffffff | #195f5c | 12 px | tile teal |
| 7.87 | 4.5 | pass | --teal-ink #31b3ad | --well #07060b | 12 px | chip info |
| 8.00 | 4.5 | pass | --green-ink #3fbf79 | --panel-hi #13101b | 12 px | dusk-state ok; result ok; rule cite line (green, as today) |
| 8.60 | 4.5 | pass | --green-ink #3fbf79 | --well #07060b | 12 px | chip ok (verified) |
| 8.63 | 4.5 | pass | --ink-2 #c8c3d0 | --tint-green top on --panel-hi #1a2a29 | 12 px | tile green |
| 8.75 | 4.5 | pass | --ink-2 #c8c3d0 | --tint-teal top #172831 | 12 px | tile teal; score tile |
| 8.87 | 4.5 | pass | --ink-2 #c8c3d0 | --tint-amber top #2f2317 | 12 px | tile amber; rule tile S.I. |
| 8.91 | 4.5 | pass | --ink-2 #c8c3d0 | --tint-down top #331e2c | 12 px | tile down |
| 9.02 | 4.5 | pass | --ink-2 #c8c3d0 | --rowwash-amber on --panel-hi #2d2217 | 14 px | secondary text on amber wash |
| 9.09 | 4.5 | pass | --ink-2 #c8c3d0 | --tint-blue top #19223b | 12 px | tile blue; rule tile CROR |
| 9.12 | 4.5 | pass | --lit #f2c27a | --btn-bg on --head #2d2528 | 14 px | unlabelled sample |
| 9.14 | 4.5 | pass | --ink-2 #c8c3d0 | --tint-grey top #23212d | 12 px | tile grey |
| 9.17 | 4.5 | pass | --ink-2 #c8c3d0 | --tint-violet top #251e3b | 12 px | tile violet |
| 9.27 | 4.5 | pass | --ink-2 #c8c3d0 | --tint-red top #321b22 | 12 px | tile red |
| 9.47 | 4.5 | pass | --lit #f2c27a | --wash-2 on --panel-hi #292225 | 12 px | badge (free); feedback panel; strip key cell; readout (strip key) |
| 9.69 | 4.5 | pass | --lit #f2c27a | --btn-bg on --bar #282022 | 14 px | title bar |
| 9.70 | 4.5 | pass | --ink-2 #c8c3d0 | --rowwash-teal on --glass #0f2026 | 11 px | row lit teal |
| 9.72 | 4.5 | pass | --ink-2 #c8c3d0 | --wash-1 on --panel-hi #1f1c26 | 14 px | button disabled |
| 9.87 | 4.5 | pass | --ink-2 #c8c3d0 | --wash-2 or --btn-bg on --glass #211b1b | 11 px | row lit gold |
| 10.10 | 4.5 | pass | --ink-2 #c8c3d0 | --wash-2 on --well #1f1916 | 12 px | tab selected |
| 10.35 | 4.5 | pass | --lit #f2c27a | --wash-2 or --btn-bg on --glass #211b1b | 14 px | link button (tip jar) |
| 10.59 | 4.5 | pass | --lit #f2c27a | --wash-2 on --well #1f1916 | 12 px | skip link; tab selected; seg pressed |
| 10.88 | 4.5 | pass | --lit #f2c27a | --rowwash-red on --well #261114 | 16 px | banner lookup |
| 10.89 | 4.5 | pass | --ink-2 #c8c3d0 | --panel-hi #13101b | 13 px | path panel; dusk-state hold; secondary text on panel; work order meta; dusk-feed row |
| 11.43 | 4.5 | pass | --lit #f2c27a | --panel-hi #13101b | 16 px | disclosure summary; feedback panel |
| 11.54 | 4.5 | pass | --ink-2 #c8c3d0 | --glass #0a0810 | 12 px | row disabled (Exam); footer as cb-sub; lede; named rule (legend); settings row; table first cell |
| 11.71 | 4.5 | pass | --ink-2 #c8c3d0 | --well #07060b | 12 px | option disabled; banner rest; tab rest; seg rest; settings sample |
| 12.11 | 4.5 | pass | --lit #f2c27a | --glass #0a0810 | 16 px | plain button (back) |
| 12.28 | 4.5 | pass | --lit #f2c27a | --well #07060b | 11 px | count chip |
| 12.28 | 3 | pass | --lit #f2c27a | --well #07060b | 30.4 px | sample Aa |
| 13.00 | 4.5 | pass | --ink #f4f1ec | --rowwash-green on --head #1d2b2c | 16 px | option correct |
| 13.31 | 4.5 | pass | --ink #f4f1ec | --btn-bg on --head #2d2528 | 16 px | option selected |
| 13.40 | 3 | pass | --ink #f4f1ec | --tint-teal top #172831 | 27 px | score tile |
| 13.81 | 4.5 | pass | --ink #f4f1ec | --rowwash-amber on --panel-hi #2d2217 | 16 px | yard note panel |
| 13.90 | 4.5 | pass | --ink #f4f1ec | --rowwash-red on --head #331d25 | 16 px | option wrong |
| 14.86 | 4.5 | pass | --ink #f4f1ec | --rowwash-teal on --glass #0f2026 | 16 px | row lit teal |
| 15.02 | 4.5 | pass | --ink #f4f1ec | --rowwash-amber on --glass #251b0e | 16 px | row lit amber (flagged list line) |
| 15.02 | 4.5 | pass | --ink #f4f1ec | --rowwash-green on --well #0f201b | 16 px | banner win |
| 15.11 | 4.5 | pass | --ink #f4f1ec | --wash-2 or --btn-bg on --glass #211b1b | 13 px | row lit gold; table hot row |
| 15.88 | 4.5 | pass | --ink #f4f1ec | --rowwash-red on --well #261114 | 16 px | banner bad |
| 16.22 | 4.5 | pass | --ink #f4f1ec | --head #17131f | 13 px | panel head; panel name; option rest |
| 16.68 | 4.5 | pass | --ink #f4f1ec | --panel-hi #13101b | 13 px | lede panel; path panel; body text on panel; feedback panel; strip cell; dusk-feed row |
| 16.95 | 4.5 | pass | --ink #f4f1ec | --bar, light end #110e18 | 15 px | title bar |
| 17.67 | 4.5 | pass | --ink #f4f1ec | --glass #0a0810 | 16 px | row (station); reference row; settings row |
| 17.67 | 3 | pass | --ink #f4f1ec | --glass #0a0810 | 20 px | view title |
| 17.92 | 4.5 | pass | --ink #f4f1ec | --well #07060b | 13 px | rule quote; banner ok; code; transcript you; call box; settings sample |

Rows added by the check (not in the harness; computed with `lib/color.mjs` from the token values):

| Ratio | Need | Result | Text | Ground | Smallest size | Used by |
|---|---|---|---|---|---|---|
| 4.41 | 4.5 | **fail** | --blue-ink #3d8bf2 | --rowwash-amber on --head #30241b | 14 px | The track name on a flagged switch-list line, if the line keeps `--head` under the wash and the name keeps the CROR blue. Do not build this pair. |
| 4.57 | 4.5 | pass | --blue-ink #3d8bf2 | --rowwash-amber on --panel-hi #2d2217 | 14 px | The same name on a flagged line inside a panel |
| 4.77 | 4.5 | pass | --red-ink #ea5d50 | --rowwash-red on --panel-hi #301a22 | 16 px | A red mark on a red wash inside a panel |
| 4.97 | 4.5 | pass | --blue-ink #3d8bf2 | --rowwash-amber on --glass #251b0e | 14 px | The same name on a flagged line on the window floor |
| 5.36 | 4.5 | pass | --amber-ink #cc8f00 | --rowwash-amber on --head #30241b | 11 px | "(list was wrong)" and an S.I. citation on an amber wash over `--head` |
| 6.04 | 4.5 | pass | --amber-ink #cc8f00 | --rowwash-amber on --glass #251b0e | 12 px | An S.I. citation on an amber wash on the window floor |
| 10.35 | 4.5 | pass | --lit #f2c27a | --btn-bg on --glass #211b1b | 16 px | The skip link with the opaque ground of Check 2.1.3 |

Checks for 7.1:

- **Check 7.1.1: confirmed.** All 82 rows were recomputed from the two hex values of the row. 70 rows agree to 0.03. 12 rows differ by 0.03 to 0.07 (for example 13.31 against 13.25 on `#2d2528`): each is a ground that is a mix of two colours. The table ratio is made from the mix before it is rounded to a hex, and the check made the same number that way for each "X on Y" ground. No row changes its result.
- **Check 7.1.2: confirmed.** Each token name in the Text column has the hex value of the row in `dusk.tokens.css`. Each one-token ground has the hex value of the row. Each "X on Y" ground is the alpha mix of the two tokens (checked by script; no mismatch).
- **Check 7.1.3: confirmed.** The failing rows: none. The borderline rows (under 5): the eight white-on-cap rows 4.55 to 4.67 and the red mark on the wrong option 4.61. Each was recomputed: 4.55, 4.56, 4.56, 4.56, 4.57, 4.57, 4.58, 4.67 and 4.61.
- **Check 7.1.4: confirmed, sample of ten others.** 5.52, 5.56, 6.10, 6.52, 7.11, 8.00, 9.47, 10.89, 12.28 and 17.92 were each recomputed from tokens and agree to 0.01.
- **Check 7.1.5: corrected.** The table is not complete for the mapping. One pair that the bridge makes is under AA on one ground (4.41) and near it on two more (4.57, 4.97). The rows are added above. Section 15, A9.
- **Check 7.1.6: corrected.** The "Used by" column lists "reference row" under `--ink-3` at 11 px (7.11 and 6.10). That is the measured state of the harness, and it disagrees with the mapping, which says the row text is `cb-sub` (`--ink-2`, 14 px). See Check 2.4.2. With the corrected rule the pair is `--ink-2` on `--glass`: 11.54.
- **Check 7.1.7: not verified.** The size column ("Smallest size") was not measured again for each row. The sizes of the Dusk parts in section 15, A2 agree with it where they overlap (11, 12, 13, 14, 15, 27 px).

In this mode `#ffffff` as text is `--ink`: the bridge points `--ink` at `--on-tile`. `#c8c3d0` is `--ink-2` and also `--ink-3`.

| Ratio | Need | Result | Text | Ground | Smallest size | Used by |
|---|---|---|---|---|---|---|
| 5.52 | 4.5 | pass | --blue-ink #3d8bf2 | --panel-hi #13101b | 12 px | rule cite line (blue) |
| 5.53 | 4.5 | pass | --red-ink #ea5d50 | --panel-hi #13101b | 16 px | dusk-state attn |
| 5.55 | 4.5 | pass | --amber-ink #cc8f00 | --rowwash-amber on --panel-hi #2d2217 | 16 px | S.I. heading on amber wash |
| 5.85 | 4.5 | pass | --blue-ink #3d8bf2 | --glass #0a0810 | 12 px | CROR key |
| 6.10 | 4.5 | pass | --grey-ink #828dab | --well #07060b | 11 px | tile grey; row (station); row disabled (Exam); reference row |
| 6.35 | 4.5 | pass | --on-tile #ffffff | --tile-teal-lo #156a6b | 12 px | tile teal; row lit teal; score tile |
| 6.45 | 4.5 | pass | --on-tile #ffffff | --tile-green-lo #1d6b4a | 12 px | tile green |
| 6.71 | 4.5 | pass | --amber-ink #cc8f00 | --panel-hi #13101b | 12 px | dusk-state caution; dusk-flag; GOI line |
| 7.10 | 4.5 | pass | --amber-ink #cc8f00 | --glass #0a0810 | 12 px | S.I. key |
| 7.32 | 4.5 | pass | --teal-ink #31b3ad | --panel-hi #13101b | 16 px | dusk-state info |
| 7.48 | 4.5 | pass | --on-tile #ffffff | --tile-red-lo #9c2a3a | 12 px | tile red |
| 7.92 | 4.5 | pass | --on-tile #ffffff | --tile-blue-lo #1d4f9c | 12 px | tile blue; rule tile CROR |
| 8.00 | 4.5 | pass | --green-ink #3fbf79 | --panel-hi #13101b | 12 px | dusk-state ok; rule cite line (green, as today) |
| 8.46 | 4.5 | pass | --on-tile #ffffff | --tile-down-lo #8a2a3e | 12 px | tile down |
| 8.63 | 4.5 | pass | --ink-2 #c8c3d0 | --tint-green top on --panel-hi #1a2a29 | 12 px | tile green |
| 8.75 | 4.5 | pass | --ink-2 #c8c3d0 | --tint-teal top #172831 | 12 px | tile teal; score tile |
| 8.87 | 4.5 | pass | --ink-2 #c8c3d0 | --tint-amber top #2f2317 | 12 px | tile amber; rule tile S.I. |
| 8.91 | 4.5 | pass | --ink-2 #c8c3d0 | --tint-down top #331e2c | 12 px | tile down |
| 9.02 | 4.5 | pass | --ink-2 #c8c3d0 | --rowwash-amber on --panel-hi #2d2217 | 14 px | secondary text on amber wash |
| 9.03 | 4.5 | pass | --ink-2 #c8c3d0 | --wash-2 on --panel-hi #292225 | 11 px | strip key cell |
| 9.09 | 4.5 | pass | --ink-2 #c8c3d0 | --tint-blue top #19223b | 12 px | tile blue; rule tile CROR |
| 9.12 | 4.5 | pass | --lit #f2c27a | --btn-bg on --head #2d2528 | 14 px | unlabelled sample |
| 9.14 | 4.5 | pass | --ink-2 #c8c3d0 | --tint-grey top #23212d | 12 px | tile grey |
| 9.17 | 4.5 | pass | --ink-2 #c8c3d0 | --tint-violet top #251e3b | 12 px | tile violet |
| 9.27 | 4.5 | pass | --on-tile #ffffff | --tile-amber-lo #5f4200 | 12 px | tile amber; row lit amber (flagged list line); rule tile S.I. |
| 9.27 | 4.5 | pass | --ink-2 #c8c3d0 | --tint-red top #321b22 | 12 px | tile red |
| 9.39 | 4.5 | pass | --on-tile #ffffff | #104e4f | 12 px | tile teal |
| 9.47 | 4.5 | pass | --lit #f2c27a | --wash-2 on --panel-hi #292225 | 12 px | badge (free); feedback panel; strip key cell; readout (strip key) |
| 9.50 | 4.5 | pass | --on-tile #ffffff | #154f37 | 12 px | tile green |
| 9.64 | 4.5 | pass | --on-tile #ffffff | --tile-violet-lo #4a2f9c | 12 px | tile violet |
| 9.69 | 4.5 | pass | --lit #f2c27a | --btn-bg on --bar #282022 | 14 px | title bar |
| 9.70 | 4.5 | pass | --ink-2 #c8c3d0 | --rowwash-teal on --glass #0f2026 | 11 px | row lit teal |
| 9.72 | 4.5 | pass | --ink-2 #c8c3d0 | --wash-1 on --panel-hi #1f1c26 | 14 px | button disabled |
| 9.87 | 4.5 | pass | --ink-2 #c8c3d0 | --wash-2 or --btn-bg on --glass #211b1b | 11 px | row lit gold |
| 10.03 | 4.5 | pass | --on-tile #ffffff | --tile-grey-lo #3d4250 | 12 px | tile grey; row lit gold |
| 10.10 | 4.5 | pass | --ink-2 #c8c3d0 | --wash-2 on --well #1f1916 | 12 px | tab selected |
| 10.35 | 4.5 | pass | --lit #f2c27a | --wash-2 or --btn-bg on --glass #211b1b | 14 px | link button (tip jar) |
| 10.59 | 4.5 | pass | --lit #f2c27a | --wash-2 on --well #1f1916 | 12 px | skip link; tab selected; seg pressed |
| 10.59 | 4.5 | pass | --ink-2 #c8c3d0 | --head #17131f | 12 px | panel head; panel sub |
| 10.68 | 4.5 | pass | --on-tile #ffffff | #731f2b | 12 px | tile red |
| 10.80 | 4.5 | pass | --ink-2 #c8c3d0 | --thead #14111c | 11 px | table head |
| 10.88 | 4.5 | pass | --lit #f2c27a | --rowwash-red on --well #261114 | 16 px | banner lookup |
| 10.89 | 4.5 | pass | --ink-2 #c8c3d0 | --panel-hi #13101b | 11 px | path panel; dusk-state hold; note (cite) on panel; secondary text on panel; feedback panel; strip cell |
| 11.07 | 4.5 | pass | --ink-2 #c8c3d0 | --bar, light end #110e18 | 16 px | title bar |
| 11.07 | 4.5 | pass | --on-tile #ffffff | #153a73 | 12 px | tile blue |
| 11.43 | 4.5 | pass | --lit #f2c27a | --panel-hi #13101b | 16 px | disclosure summary; feedback panel |
| 11.54 | 4.5 | pass | --ink-2 #c8c3d0 | --glass #0a0810 | 11 px | section heading (dusk-rule b); row (station); row disabled (Exam); note (footer); footer as cb-sub; lede |
| 11.64 | 4.5 | pass | --ink-2 #c8c3d0 | --glass-side #08070c | 11 px | status bar |
| 11.65 | 4.5 | pass | --on-tile #ffffff | #661f2e | 12 px | tile down |
| 11.71 | 4.5 | pass | --ink-2 #c8c3d0 | --well #07060b | 11 px | option disabled; banner rest; tab rest; seg rest; transcript who; settings sample |
| 12.11 | 4.5 | pass | --lit #f2c27a | --glass #0a0810 | 16 px | plain button (back) |
| 12.28 | 4.5 | pass | --lit #f2c27a | --well #07060b | 11 px | count chip |
| 12.28 | 3 | pass | --lit #f2c27a | --well #07060b | 30.4 px | sample Aa |
| 12.36 | 4.5 | pass | --on-tile #ffffff | #463100 | 12 px | tile amber |
| 12.74 | 4.5 | pass | --on-tile #ffffff | #372373 | 12 px | tile violet |
| 13.02 | 4.5 | pass | --on-tile #ffffff | #2d313b | 12 px | tile grey |
| 14.65 | 4.5 | pass | --on-tile #ffffff | --rowwash-green on --head #1d2b2c | 16 px | option correct |
| 15.00 | 4.5 | pass | --on-tile #ffffff | --btn-bg on --head #2d2528 | 16 px | option selected |
| 15.10 | 3 | pass | --on-tile #ffffff | --tint-teal top #172831 | 27 px | score tile |
| 15.56 | 4.5 | pass | --on-tile #ffffff | --rowwash-amber on --panel-hi #2d2217 | 16 px | yard note panel |
| 15.66 | 4.5 | pass | --on-tile #ffffff | --rowwash-red on --head #331d25 | 16 px | option wrong |
| 16.74 | 4.5 | pass | --on-tile #ffffff | --rowwash-teal on --glass #0f2026 | 16 px | row lit teal |
| 16.92 | 4.5 | pass | --on-tile #ffffff | --rowwash-amber on --glass #251b0e | 16 px | row lit amber (flagged list line) |
| 16.92 | 4.5 | pass | --on-tile #ffffff | --rowwash-green on --well #0f201b | 16 px | banner win |
| 17.02 | 4.5 | pass | --on-tile #ffffff | --wash-2 or --btn-bg on --glass #211b1b | 13 px | row lit gold; table hot row |
| 17.89 | 4.5 | pass | --on-tile #ffffff | --rowwash-red on --well #261114 | 16 px | banner bad |
| 18.27 | 4.5 | pass | --on-tile #ffffff | --head #17131f | 13 px | panel head; panel name; option rest |
| 18.79 | 4.5 | pass | --on-tile #ffffff | --panel-hi #13101b | 13 px | lede panel; path panel; body text on panel; result ok; result no; feedback panel |
| 19.09 | 4.5 | pass | --on-tile #ffffff | --bar, light end #110e18 | 15 px | title bar |
| 19.90 | 4.5 | pass | --on-tile #ffffff | --glass #0a0810 | 14 px | row (station); reference row; settings row; attention button (Reset) |
| 19.90 | 3 | pass | --on-tile #ffffff | --glass #0a0810 | 20 px | view title |
| 20.19 | 4.5 | pass | --on-tile #ffffff | --well #07060b | 12 px | chip ok (verified); chip caution; chip info; rule quote; banner ok; code |

Checks for 7.2:

- **Check 7.2.1: confirmed.** All 72 rows were recomputed from the two hex values of the row. 59 agree to 0.03 and 13 differ by 0.03 to 0.07, for the reason in Check 7.1.1. No row changes its result. The lowest row is 5.52.
- **Check 7.2.2: confirmed.** The eight flat cap grounds are the `--tile-<tone>-lo` values of `dusk.tokens.css:210-224`, and white on each is the ratio of its row.
- **Check 7.2.3: corrected.** The rows added to 7.1 do not change in this mode: `--blue-ink` and `--amber-ink` are read directly, not through a `--cb-` name. The pair 4.41 on `--head` fails here also. The red mark on a red wash becomes white (`--cb-attn-ink` is `--ink`) and passes at 15 or more.

### 7.3 Controls in each state

Rest, hover and press were made with a real pointer. Disabled, selected, correct and wrong are in 7.1 and 7.2 under "button disabled", "option selected", "option correct", "option wrong", "option disabled", "tab selected".

| Part | State | Default: text on ground, ratio | High contrast: text on ground, ratio | Need | Result |
|---|---|---|---|---|---|
| `.dusk-btn` (Settings, in the title bar) | rest | #f2c27a on #282022 = 9.69 | #f2c27a on #282022 = 9.69 | 4.5 | pass |
| `.dusk-btn` (Settings, in the title bar) | hover | #f2c27a on #3a2e2a = 7.95 | #f2c27a on #3a2e2a = 7.95 | 4.5 | pass |
| `.dusk-btn` (Settings, in the title bar) | press | #f2c27a on #4c3d31 = 6.35 | #f2c27a on #4c3d31 = 6.35 | 4.5 | pass |
| `cb-opt` answer option | rest | #f4f1ec on #17131f = 16.22 | #ffffff on #17131f = 18.27 | 4.5 | pass |
| `cb-opt` answer option | hover | #f4f1ec on #231f2a = 14.36 | #ffffff on #231f2a = 16.18 | 4.5 | pass |
| `cb-opt` answer option | press | #f4f1ec on #2d2528 = 13.31 | #ffffff on #2d2528 = 15.00 | 4.5 | pass |
| `cb-btn--plain` (back, Look it up) | rest | #f2c27a on #0a0810 = 12.11 | #f2c27a on #0a0810 = 12.11 | 4.5 | pass |
| `cb-btn--plain` (back, Look it up) | hover | #f2c27a on #16141c = 11.07 | #f2c27a on #16141c = 11.07 | 4.5 | pass |
| `cb-btn--plain` (back, Look it up) | press | #f2c27a on #211b1b = 10.35 | #f2c27a on #211b1b = 10.35 | 4.5 | pass |
| `.dusk-row` as a button (station): name, sub-label, icon square | rest | #828dab on #07060b = 6.10<br>#9d98a9 on #0a0810 = 7.11<br>#f4f1ec on #0a0810 = 17.67 | #828dab on #07060b = 6.10<br>#c8c3d0 on #0a0810 = 11.54<br>#ffffff on #0a0810 = 19.90 | 4.5 | pass |
| `.dusk-row` as a button (station): name, sub-label, icon square | hover | #828dab on #07060b = 6.10<br>#9d98a9 on #16141c = 6.50<br>#f4f1ec on #16141c = 16.15 | #828dab on #07060b = 6.10<br>#c8c3d0 on #16141c = 10.55<br>#ffffff on #16141c = 18.20 | 4.5 | pass |
| `.dusk-row` as a button (station): name, sub-label, icon square | press | #828dab on #07060b = 6.10<br>#9d98a9 on #16141c = 6.50<br>#f4f1ec on #16141c = 16.15 | #828dab on #07060b = 6.10<br>#c8c3d0 on #16141c = 10.55<br>#ffffff on #16141c = 18.20 | 4.5 | pass |
| `cb-tab` not selected | rest | #c8c3d0 on #07060b = 11.71 | #c8c3d0 on #07060b = 11.71 | 4.5 | pass |
| `cb-tab` not selected | hover | #c8c3d0 on #131217 = 10.77 | #c8c3d0 on #131217 = 10.77 | 4.5 | pass |
| `cb-tab` not selected | press | #c8c3d0 on #131217 = 10.77 | #c8c3d0 on #131217 = 10.77 | 4.5 | pass |
| `cb-btn--attn` (Reset) | rest | #ea5d50 on #0a0810 = 5.86 | #ffffff on #0a0810 = 19.90 | 4.5 | pass |
| `cb-btn--attn` (Reset) | hover | #ea5d50 on #281318 = 5.16 | #ffffff on #281318 = 17.53 | 4.5 | pass |
| `cb-btn--attn` (Reset) | press | #ea5d50 on #16141c = 5.36 | #ffffff on #16141c = 18.20 | 4.5 | pass |

Checks for 7.3:

- **Check 7.3.1: confirmed.** All 48 ratios in the table were recomputed from their two hex values. 35 agree to 0.03 and 13 differ by 0.03 to 0.07 (rounded mix, as in Check 7.1.1). The lowest is 5.16.
- **Check 7.3.2: confirmed.** The grounds were recomputed from tokens: `.dusk-btn` on the title bar is `--btn-bg` (0.10), `--btn-bg-hover` (0.18) and `--btn-bg-press` (0.26) over `#110e18`: 9.69, 7.95, 6.35. A row on hover is `--wash-1` over `--glass`: `--ink-3` on it is 6.50.
- **Check 7.3.3: not verified.** The check did not press each control with a real pointer again. It hovered a tile and a row in its own probe only.
- **Check 7.3.4: corrected.** A `.dusk-btn` in a panel body or a panel head was not in this table. Computed: `--lit` on the pressed fill over `--panel-hi` 6.20, over `--head` 5.97. Both pass.

### 7.4 Edges, fills, the focus ring and the frozen signal

Need is 3 for the edge of a control, for a state mark and for a part of a picture that a reader needs. A row that is "below 3" is a divider or an ornament unless the note under the table says more.

| Pair | Ground | Default ratio | High contrast ratio | Need | Result (default / high contrast) |
|---|---|---|---|---|---|
| focus ring #9fc4ff | glass #0a0810 | 11.20 | 11.20 | 3 | pass / pass |
| focus ring #9fc4ff | panel-hi #13101b | 10.57 | 10.57 | 3 | pass / pass |
| focus ring #9fc4ff | panel-lo #0d0b14 | 10.99 | 10.99 | 3 | pass / pass |
| focus ring #9fc4ff | head #17131f | 10.28 | 10.28 | 3 | pass / pass |
| focus ring #9fc4ff | well #07060b | 11.36 | 11.36 | 3 | pass / pass |
| focus ring #9fc4ff | glass-side #08070c | 11.29 | 11.29 | 3 | pass / pass |
| container edge --lit-line #8a6e4a | glass #0a0810 | 4.19 | 4.19 | 3 | pass / pass |
| container edge --lit-line #8e724f | panel-hi #13101b | 4.17 | 4.17 | 3 | pass / pass |
| container edge --lit-line #886d48 | well #07060b | 4.18 | 4.18 | 3 | pass / pass |
| rule --lit-rule (bridge --line) #504030 | glass #0a0810 | 2.00 | 4.19 | 3 | below 3 / pass |
| rule --lit-rule (bridge --line) #564538 | panel-hi #13101b | 2.07 | 4.17 | 3 | below 3 / pass |
| rule --lit-rule (bridge --line) #59483a | head #17131f | 2.09 | 4.14 | 3 | below 3 / pass |
| hair --hair #1c1b22 | glass #0a0810 | 1.16 | 1.46 | 3 | below 3 / below 3 |
| hair --hair #25222c | panel-hi #13101b | 1.20 | 1.53 | 3 | below 3 / below 3 |
| hair --hair-2 #2f2d34 | glass #0a0810 | 1.46 | 1.46 | 3 | below 3 / below 3 |
| hair --hair-2 #36343d | panel-hi #13101b | 1.53 | 1.53 | 3 | below 3 / below 3 |
| hair --hair-2 #2c2b30 | well #07060b | 1.44 | 1.44 | 3 | below 3 / below 3 |
| well ring (white 0.10, the colour in --ring-well) #201f23 | well #07060b | 1.23 | 1.23 | 3 | below 3 / below 3 |
| well ring (white 0.10, the colour in --ring-well) #232128 | glass #0a0810 | 1.25 | 1.25 | 3 | below 3 / below 3 |
| well ring (white 0.10, the colour in --ring-well) #2b2832 | panel-hi #13101b | 1.30 | 1.30 | 3 | below 3 / below 3 |
| well ring (white 0.10, the colour in --ring-well) #2e2b35 | head #17131f | 1.31 | 1.31 | 3 | below 3 / below 3 |
| control ring (gold 0.75, the core of --neon-ctl) #b89460 | glass #0a0810 | 7.02 | 7.02 | 3 | pass / pass |
| control ring (gold 0.75, the core of --neon-ctl) #ba9662 | panel-hi #13101b | 6.80 | 6.80 | 3 | pass / pass |
| control ring (gold 0.75, the core of --neon-ctl) #bb9663 | head #17131f | 6.68 | 6.68 | 3 | pass / pass |
| control ring (gold 0.75, the core of --neon-ctl) #b7935e | well #07060b | 7.07 | 7.07 | 3 | pass / pass |
| input edge --cb-edge #8a6e4a | glass #0a0810 | 4.19 | 12.11 | 3 | pass / pass |
| input edge --cb-edge #8e724f | panel-hi #13101b | 4.17 | 11.43 | 3 | pass / pass |
| input edge --cb-edge #886d48 | well #07060b | 4.18 | 12.28 | 3 | pass / pass |
| fill --teal #2fb3ad | well #07060b | 7.86 | 7.86 | 3 | pass / pass |
| fill --green #3fbf7a | well #07060b | 8.60 | 8.60 | 3 | pass / pass |
| fill --amber #cc8f00 | well #07060b | 7.21 | 7.21 | 3 | pass / pass |
| fill --red #e2574c | well #07060b | 5.48 | 5.48 | 3 | pass / pass |
| fill --blue #3d8bf2 | well #07060b | 5.94 | 5.94 | 3 | pass / pass |
| fill --violet #8e6cf2 | well #07060b | 5.36 | 5.36 | 3 | pass / pass |
| fill --grey #7d8494 | well #07060b | 5.39 | 5.39 | 3 | pass / pass |
| fill --down #e96f8b | well #07060b | 6.84 | 6.84 | 3 | pass / pass |
| toggle knob off --ink-3 #9d98a9 | well #07060b | 7.21 | 11.71 | 3 | pass / pass |
| toggle knob on --lit #f2c27a | wash-2/well #1f1916 (corrected by Check 7.4.2; the table said the plain well and 12.28) | 10.59 | 10.59 | 3 | pass / pass |
| edge --green-ink (correct) #3fbf79 | glass #0a0810 | 8.47 | 8.47 | 3 | pass / pass |
| edge --green-ink (correct) #3fbf79 | panel-hi #13101b | 8.00 | 8.00 | 3 | pass / pass |
| edge --green-ink (correct) #3fbf79 | head #17131f | 7.78 | 7.78 | 3 | pass / pass |
| edge --red-ink (wrong, attention) #ea5d50 | glass #0a0810 | 5.86 | 5.86 | 3 | pass / pass |
| edge --red-ink (wrong, attention) #ea5d50 | panel-hi #13101b | 5.53 | 5.53 | 3 | pass / pass |
| edge --red-ink (wrong, attention) #ea5d50 | head #17131f | 5.38 | 5.38 | 3 | pass / pass |
| edge --amber-ink #cc8f00 | glass #0a0810 | 7.10 | 7.10 | 3 | pass / pass |
| edge --amber-ink #cc8f00 | panel-hi #13101b | 6.71 | 6.71 | 3 | pass / pass |
| edge --blue-ink #3d8bf2 | glass #0a0810 | 5.85 | 5.85 | 3 | pass / pass |
| edge --blue-ink #3d8bf2 | panel-hi #13101b | 5.52 | 5.52 | 3 | pass / pass |
| edge --blue-ink #3d8bf2 | well #07060b | 5.94 | 5.94 | 3 | pass / pass |
| edge --teal-ink #31b3ad | panel-hi #13101b | 7.32 | 7.32 | 3 | pass / pass |
| edge --teal-ink #31b3ad | well #07060b | 7.87 | 7.87 | 3 | pass / pass |
| signal mast #46586e (frozen) #46586e | well #07060b | 2.77 | 2.77 | 3 | below 3 / below 3 |
| signal mast #46586e (frozen) #46586e | panel-hi #13101b | 2.58 | 2.58 | 3 | below 3 / below 3 |
| signal mast #46586e (frozen) #46586e | glass #0a0810 | 2.73 | 2.73 | 3 | below 3 / below 3 |
| signal lamp housing ring #2c3340 (frozen) #2c3340 | well #07060b | 1.59 | 1.59 | 3 | below 3 / below 3 |
| signal lamp housing ring #2c3340 (frozen) #2c3340 | panel-hi #13101b | 1.48 | 1.48 | 3 | below 3 / below 3 |
| well vs panel (empty bar track) #07060b | panel-hi #13101b | 1.07 | 1.07 | 3 | below 3 / below 3 |
| well vs panel (empty bar track) #07060b | glass #0a0810 | 1.01 | 1.01 | 3 | below 3 / below 3 |
| --lit on --wash-2 over well (pressed segment, selected tab) #f2c27a | wash-2/well #1f1916 | 10.59 | 10.59 | 3 | pass / pass |

Notes:

- **Focus ring:** 10.28 to 11.36 on every ground, in both modes. Today: 6.85 to 7.49.
- **`--lit-rule`, `--hair`, `--hair-2`, the well ring:** below 3. Use them for dividers and for the edge of a part that has a text label. Do not use one as the only edge of an input, a select, a toggle track or an empty bar track: that is why `--cb-edge` exists.
- **An empty bar track:** `--well` on `--panel-hi` is 1.07. See G2.
- **The signal mast** (`#46586e`, frozen) is 2.58 to 2.77 on Dusk grounds and 2.37 today. No dark ground can give it 3: against pure black it is 2.88 at most. The lamp housing ring (`#2c3340`, frozen) is 1.48 to 1.59, and 1.36 today. A dark lamp (`#16202c`) on its housing (`#0a0f16`) is 1.17 on any ground: both are inside the drawing. The reskin makes none of these worse. None can be fixed without an edit to `signal.ts`.

Checks for 7.4:

- **Check 7.4.1: confirmed.** All 59 default ratios were recomputed from the two hex values of the row. 58 agree to 0.03. One differs by 0.03 (7.02 against 7.05, a rounded mix). The high-contrast column was recomputed for the rows that change: `--lit-rule` 4.19, 4.17, 4.14; `--hair` 1.46, 1.53; `--cb-edge` 12.11, 11.43, 12.28; the "off" knob 11.71.
- **Check 7.4.2: corrected.** The "on" knob of the toggle sits on the track with the gold wash, `#1f1916`, not on the plain well. `--lit` on it is 10.59. The row now says so.
- **Check 7.4.3: confirmed.** The frozen signal: mast 2.77, 2.58, 2.73 on the three Dusk grounds, 2.37 today, 2.88 on pure black; housing ring 1.59 and 1.48, 1.36 today; a dark lamp on its housing 1.17. The colours are `signal.ts:21,29,30,34`.
- **Check 7.4.4: confirmed.** The focus ring today: `#58a6ff` is 7.49 on `--bg` and 6.85 on `--surface`. It is 6.27 on `--surface-2`, which the note does not list.
- **Check 7.4.5: corrected.** One edge is missing from the table: the edge of an icon square, in both modes. See Check 5.2.4.
- **Check 7.4.6: confirmed against the fence.** The signal rows offer no fix. A fix needs `src/core/signal.ts`, which is frozen. The item is in section 16 and in note 2 for the SME.

### 7.5 The app as it is today — the pairs near or under the need

For comparison. From `today.json`: 10 screens and states, both modes. Only pairs under the need plus 0.75 are listed.

| Screen and mode | Ratio | Text on ground | Size | Element | Sample |
|---|---|---|---|---|---|
| default home | 2.76 | #58616b on #151a21 | 13.3 px | `small` | Coming soon |
| default home | 4.59 | #7e848a on #151a21 | 16 px | `b` | 📝 Exam |
| default settings | 4.72 | #f85149 on #1c232c | 14.4 px | `button.iconbtn.danger` | Reset |
| default reference | 3.44 | #757575 on #1c232c | 16 px | `input.search::placeholder` | Search a term… |
| default signals-answered | 5.16 | #f85149 on #161b22 | 16 px | `b.fb-no` | Not quite. |
| default yard | 3.82 | #6f7884 on #171c24 | 12.5 px | `span.wo-tip` | Six cars for AS75 — three on A |
| default yard | 4.97 | #8b94a0 on #2e2410 | 13 px | `span` | The next level — out on the gr |
| default yard-after-refusal | 4.91 | #e2574c on #1d1413 | 15 px | `div.banner.bad` | AS71 is lined normal — line it |
| contrast home | 4.13 | #777f88 on #181e27 | 13.3 px | `small` | Coming soon |
| contrast home | 5.13 | #8c8f93 on #181e27 | 16 px | `b` | 📝 Exam |
| contrast settings | 4.27 | #f85149 on #222b37 | 14.4 px | `button.iconbtn.danger` | Reset |
| contrast reference | 3.10 | #757575 on #222b37 | 16 px | `input.search::placeholder` | Search a term… |
| contrast signals-answered | 4.83 | #f85149 on #1a212b | 16 px | `b.fb-no` | Not quite. |
| contrast yard | 3.82 | #6f7884 on #171c24 | 12.5 px | `span.wo-tip` | Six cars for AS75 — three on A |
| contrast yard | 4.97 | #8b94a0 on #2e2410 | 13 px | `span` | The next level — out on the gr |
| contrast yard-after-refusal | 4.91 | #e2574c on #1d1413 | 15 px | `div.banner.bad` | AS71 is lined normal — line it |

Four of these are under AA today: the search placeholder (3.44; 3.10 in high contrast), the Yard hint (3.82), "Reset" in high contrast (4.27), and the "Coming soon" line of the disabled Exam button (2.76; a disabled control is exempt from the rule, and the line is still words a learner reads). Each has a higher value in the mapping: 7.21, 10.89, 19.90 (5.86 in default) and 7.11.

Checks for 7.5:

- **Check 7.5.1: confirmed.** All 16 rows were recomputed from their two hex values: 15 agree to 0.03, one differs by 0.03 (4.59 against 4.62).
- **Check 7.5.2: confirmed, with a second method.** The checker's pixel reader on the running app (758 text nodes on 14 screens and states) gives the same values for each row that is a text node: 2.76, 4.59, 4.72, 5.16, 4.97, 4.13, 5.13, 4.27, 4.83. The Yard hint reads 4.02 at the sampled pixels, because its ground is a gradient; against the light end `#171c24` it is 3.82. The placeholder is not a text node: 3.44 and 3.10 are recomputed from `#757575` and the two `--surface-2` values. The refusal text 4.91 is recomputed from `#e2574c` on `#1d1413`.
- **Check 7.5.3: corrected.** "Coming soon" on the disabled Exam button is 7.11 only after B1 removes the opacity. In the S1 floor the button keeps `opacity: .5` (`src/index.css:60`) and the emulation reads 3.54 for "Coming soon" and 4.86 for the name. Today they are 2.76 and 4.59. The control is disabled, so the rule does not apply, and the text is still read.

---

## 8. Load order, the layers needed, and the size

### 8.1 Load order

Dusk's order (`ARCHITECTURE.md` "Load order"): tokens, base, components, compose, then process only for a page that draws a process, then motion.

Recommended for this app, in `src/main.tsx`, in place of the one line `import './index.css'` (`src/main.tsx:3`):

```ts
import './styles/dusk/dusk.tokens.css'
import './styles/dusk/dusk.base.css'
import './styles/dusk/dusk.components.css'
import './styles/dusk/dusk.compose.css'
import './styles/dusk/dusk.motion.css'
import './styles/clear-board.tokens.css'   // the bridge
import './styles/clear-board.parts.css'    // the cb- parts, if the lead takes the recommendation in section 4
import './index.css'                       // the app sheet, last
```

Why this order: Dusk first, as Dusk says. The bridge after Dusk, because it re-declares Dusk tokens for three reading modes. The app sheet last, because it must win a tie against a Dusk rule (for example `body`, `a`, `:focus-visible`).

What Vite does to the order, **measured**: a scratch project outside the repository, built with the repository's Vite 8.1.0, with these imports. Vite writes one CSS file and one `<link>` in `<head>`. The rules are in import order: tokens at byte 6, base at 10,963, components at 12,066, compose at 28,095, motion at 34,812, the bridge at 35,853, the app sheet at 38,025. A second build with one entry sheet and eight `@import` lines gives the same order. Either way works. The import lines in `main.tsx` are the smaller change.

Linking the files from `index.html` with `<link>` tags is **not verified** in a Vite build. It is not needed.

Three things to know:

- **The version line does not reach the bundle.** Vite removes comments. `/* dusk 0.2.0 — the control panel */` is in the source and not in `dist/` (measured). The proof of the version is `src/styles/dusk.lock.json` and the lock check of G1.
- **The island sheets come last.** `yardSim.js:215-219` and `radioSim.js:125-130` add a `<style>` tag to `<head>` when the station opens. It is after the bundled sheet, so an island rule wins a tie against Dusk and the app sheet. After Y1 the Yard style is a file that the lazy chunk imports; the scratch build shows that Vite writes a separate CSS file for a lazy chunk.
- **Keep Dusk and the bridge out of every lazy chunk.** Search summaries of Vite issues (16588, 15155, 5902) report a wrong CSS order where styles are split over dynamic chunks. I did not open the issues: **not verified** beyond the summaries. The safe rule: a lazy chunk's sheet holds only rules under `.yard-wrap` or `.radio-wrap`.

Checks for 8.1:

- **Check 8.1.1: confirmed.** Dusk's order is `ARCHITECTURE.md` lines 36 to 48: tokens, base, components, compose, motion, and the process layer between compose and motion "only then". `src/main.tsx:3` is the one CSS import today.
- **Check 8.1.2: confirmed by a new build.** The checker made its own scratch project outside the repository (`R3-check/vite-a/`) with the eight imports of this section, the real `src/index.css` as the app sheet and one lazy chunk with its own sheet, and built it with the repository's Vite 8.1.0. Result: one CSS file and one `<link>` in the page; the rules in import order (tokens at byte 6, base 11,471, components 11,863, compose 28,039, motion 34,760, the bridge 36,195, the app sheet 38,733); a second CSS file for the lazy chunk. The byte numbers differ from the report's because the marker strings and the app sheet differ. The order is the same.
- **Check 8.1.3: confirmed.** The text `dusk 0.2.0` is not in the built CSS file of that build.
- **Check 8.1.4: confirmed, and it has a result the report does not name.** `yardSim.js:215-219` and `radioSim.js:125-130` add a `<style>` element to `<head>` at mount. It is later than the bundle, so an island declaration beats a bridge declaration with the same selector. See section 15, A7.
- **Check 8.1.5: not verified.** The one-entry-sheet build with `@import` lines was not made again. The Vite issue pages were not opened. A `<link>` to each layer from `index.html` was not built.

### 8.2 Are `dusk.process.css` and `dusk.motion.css` needed

- **`dusk.process.css`: no.** The mapping uses none of its six parts (2.8). Do not import it. Dusk says a page links it "only then" (`ARCHITECTURE.md`). The file stays in the copy: the copy is the whole folder.
- **`dusk.motion.css`: not needed for behaviour under STRICT, and import it.** Every rule in it is behind `html[data-tier="open"]` or `html[data-tier="strict"][data-ambient="on"]`, or inside the reduced-motion block. With STRICT and no `.dusk-enter` it does nothing. Dusk's `README.md` (step 2) says to link five files "in this order, and no other". The cost of following it is 1,039 bytes minified and 268 bytes gzip. If the owner later picks OPEN, nothing changes in the imports.

### 8.3 Size

| What | Bytes | gzip |
|---|---|---|
| The CSS bundle today (`dist/assets/index-z9tuAY47.css`) | 10,242 | 2,800 |
| Dusk source, five files, raw (`wc -c`) | 66,708 | 15,730 |
| Dusk source, six files, raw | 72,483 | 17,076 |
| Dusk in a Vite 8.1.0 build, four layers (no motion, no process) | 34,835 | 7,393 |
| Dusk in a Vite 8.1.0 build, **five layers (the recommendation)** | **35,874** | **7,661** |
| Dusk in a Vite 8.1.0 build, six layers | 39,413 | 8,237 |
| Five layers, the draft bridge and a marker rule | 38,099 | 8,261 |

gzip is level 9 from Node `zlib` for the build rows and for the source rows, and the `gzip` command at its default level for today's bundle. The token file is 27,090 of the raw bytes. It declares 255 custom properties (counted with `grep`), and Vite keeps each one because a custom property cannot be removed safely. The final app sheet gets smaller as the surface jobs replace app rules with Dusk parts: that number is **not measured**, because the sheets are not written.

Added to the offline cache: about 36 kB before compression. The cache budget of R6 is 5 MB.

Checks for 8.2 and 8.3:

- **Check 8.2.1: confirmed.** No class of `dusk.process.css` is in Table 1 or Table 3. Dusk `README.md` line 16 says "Link them in this order, and no other".
- **Check 8.3.1: confirmed.** `dist/assets/index-z9tuAY47.css` is 10,242 bytes, and 2,800 bytes through `gzip`.
- **Check 8.3.2: confirmed.** `wc -c`: five files 66,708 bytes, six files 72,483 bytes, the token file 27,090 bytes. `grep -c` finds 255 declarations in the token file and 255 different names.
- **Check 8.3.3: confirmed by a new build.** The checker's five-layer build (`R3-check/vite-c/`) is 35,874 bytes and 7,661 bytes at gzip level 9: the same as the report. The report's own outputs for four layers (34,835 and 7,393), six layers (39,413 and 8,237) and five layers with the bridge (38,099 and 8,261) were read and compressed again and agree. The motion layer costs 1,039 bytes and 268 bytes compressed.
- **Check 8.3.4: corrected.** The two source gzip figures were made in two ways. 15,730 is the five files joined in load order. 17,076 is the six files joined in name order. In load order the six files are 16,907. The difference does not change a decision.
- **Check 8.3.5: not verified.** The cache budget of 5 MB is R6's number. The check did not read R6.

---

## 9. Traps for the build jobs

Each one was seen in the harness or in the files.

1. **A leftover app token beats Dusk.** `src/index.css:3-5` declares `--ink` and `--focus` on `:root`. If the lines stay and the app sheet loads last, Dusk parts take the old colours. Delete them (3.5).
2. **A button reset can remove a lit state.** `button.dusk-row { background: none }` has more specificity than `.dusk-row--on`. The lit row lost its wash in the first harness run. The reset must be inside `:where()` (G7).
3. **`.dusk-win` has a sidebar column.** Its grid is `var(--side-w) minmax(0, 1fr)` (`dusk.compose.css:34`). With no `.dusk-side`, `.dusk-main` falls into the 212 px column (measured: 212 px wide against 1440 px with the fix). Fix: `.cb-win > .dusk-main { grid-column: 1 / -1 }`.
4. **`.dusk-win` on a `<dialog>` shows the closed dialog.** It sets `display: grid` (measured on a closed dialog). Use `cb-dialog`.
5. **Dusk base and compose change the page before any markup changes.** `body { padding: var(--gutter) }` (`dusk.compose.css:12`) adds 16 px on each side; `h1, h2, h3, p { margin: 0 }` (`dusk.base.css:38-41`) removes paragraph margins that the lede, the footer, the Reference detail and the Yard help text use; `a { color: inherit }` and `:focus-visible` meet the app's own rules. S1 must look at each screen at 390 after it links the layers, and set `body { padding: 0 }` in the app sheet until B1 adds `.dusk-stage--app`.
6. **Each Dusk control is under 44 px** (G20).
7. **`.dusk-row` needs an icon square first.** Its grid is `var(--ico-size) minmax(0, 1fr) auto` (`dusk.compose.css:126`). Without `.dusk-ico` the name falls into the 24 px column.
8. **`.dusk-state` writes a glyph.** The app strings already have one. Do not put `.dusk-state` on them.
9. **`.dusk-seg` reads `aria-pressed`.** The Radio tabs use `aria-selected`. Do not change the ARIA to fit the skin.
10. **`.dusk-tile-lab` cuts long text.** It is one line with an ellipsis (`dusk.components.css:441-443`). The names in the app today fit at 176 px. A longer cap text needs a page-local `white-space: normal`.
11. **`.dusk-tile` lifts on hover even when it is not a control** (`dusk.components.css:380-384`). The rule-chip tiles and the score tile are not controls. If the lift misleads, a page-local `transform: none` on those tiles stops it.
12. **Raw colours in `radioSim.js` outside the style rules.** 27 SVG attributes (`:45-66`) and one script line (`:145`, two colours). CSS can repaint an SVG attribute, but the typed colour stays in the file and a lint finds it. The script line sets an inline style, which beats a style rule. B3's Files line says "style rules only". The words in `STEPS` are not touched by a colour change.
13. **`.dusk-win { overflow: hidden }`** (`dusk.components.css:19`) cuts a focus ring that reaches the window edge. `main#view` takes focus on each route change (`App.tsx:24`) and its ring is at the edge. B1 must look at it.
14. **App class names that clash with each other today:** `.stage` (`src/index.css:39` and the Radio island), `.bar` (`src/index.css:41` and the Yard, which resets it at `yardSim.js:91`), `.next`, `.tip`, `.back`. The move to `dusk-` and `cb-` names ends each one. Until then a rename on one side can break the other.

Checks for section 9, one for each trap:

- **Check 9.1: confirmed.** `src/index.css:4-5` declares `--ink` and `--focus`. In the emulation, with those lines gone, the shell computes Dusk's values.
- **Check 9.2: confirmed.** Probe: a reset `button.dusk-row { background: none }` under a wrapper class gives a lit row the background `rgba(0, 0, 0, 0)`. The `:where()` reset keeps `rgba(242, 194, 122, 0.1)`. The reset must also hold the app class to pass the namespace check (Check G7).
- **Check 9.3: confirmed.** Probe: `.dusk-main` is 212 px wide at 1440 with no sidebar and 1440 px with the fix. `--side-w` is 212 px (`dusk.tokens.css:368`).
- **Check 9.4: confirmed.** Probe: a closed `<dialog class="dusk-win">` computes `display: grid`.
- **Check 9.5: confirmed.** `dusk.compose.css:12`, `dusk.base.css:38-41` and `:47` are as quoted. In the emulation the lede paragraph, the footer paragraph and the Yard help paragraphs compute margin 0. The emulation set `body { padding: 0 }`, as this trap says.
- **Check 9.6: confirmed.** See Check G20.
- **Check 9.7: confirmed.** Probe: a `.dusk-row` with no icon square puts the name in the 24 px column (the name box is 24 px wide and 109 px high).
- **Check 9.8: confirmed.** `dusk.components.css:570-576`.
- **Check 9.9: confirmed.** `dusk.components.css:234`; `Radio.tsx:26,30`.
- **Check 9.10: confirmed.** `dusk.components.css:441-443`. The domain names and the two longest rule citations fit at 176 px (Checks 2.2.7 and 2.7.6).
- **Check 9.11: confirmed.** `dusk.components.css:380-384`. Probe: a hovered tile computes `matrix(1, 0, 0, 1, 0, -2)`.
- **Check 9.12: confirmed.** 27 colours on `radioSim.js:45-66` and 2 on `:145`. Line 145 writes `style.background` and `style.boxShadow`.
- **Check 9.13: confirmed.** Probe: with focus on `main` inside `.dusk-win`, only the top edge of the ring shows. The left, right and bottom edges are outside the window and are cut (picture `R3-check/probe2-focus-1440.png`).
- **Check 9.14: confirmed.** `.stage`: `src/index.css:39` and `radioSim.js:15`. `.bar`: `src/index.css:41` and `yardSim.js:91`. `.next`: `src/index.css:97` and `radioSim.js:24`. `.tip`: `src/index.css:63` and `radioSim.js:33`. `.back`: `src/index.css:67` and `yardSim.js:53`.

Traps added by the check (evidence in section 15): 15. `.dusk-rows` is columns below 760 px (A3). 16. `.dusk-row small` beats `.cb-sub` (Check 2.4.2). 17. A rule that names a Dusk class with no app class fails the strict namespace check, and so does an `:is()` list (A4). 18. An island declaration beats the bridge (A7). 19. `.dusk-skip` is see-through (A11). 20. An `h1` in `.dusk-brand` is 32 px (Check 2.1.2). 21. The horizon shows in the S1 floor (Check 6.4). 22. A `.dusk-row` holds three columns: a fourth child wraps (Check 2.7.2).

---

## 10. Picks that only the owner can make

One question at a time, the recommended option first.

1. **The page-law tier.** STRICT (recommended): nothing moves except a state change; Dusk names STRICT for a rail page. Or OPEN: parts settle into place as they come into view; it needs a new script. Section 6.
2. **The page width.** One window that fills the browser, with text lines capped at 78 characters (recommended): it is how Dusk draws a tool, and the Yard drawing gets the full width in place of 882 px of a 1440 px window (measured). Or keep the centred 920 px column of today: nothing moves, and Dusk's title bar then sits on a card.
3. **The size of reading text.** Keep the app's sizes for rules, prompts, answers and explanations, and use Dusk's small sizes only for labels, counts and bars (recommended). **Corrected by Check 10.3:** with Table 1 as it is, this option still makes some text smaller than today: the question heading, the title of a Reference entry, the name and the description of a domain, the score and the lines at the end of a session, and the readouts. Section 15, A2 gives each size. So the owner's pick has one more part: do these texts keep today's size through a page-local rule (recommended: a heading and a description are reading text), or do they take the Dusk size. Or use Dusk's sizes everywhere: body text goes from 16 px to 13 px. Or scale every Dusk size up: the look moves away from the picked Dusk look.
4. **The colour of a domain tile.** One tone for each live domain and grey for a domain that is not live (recommended): colour then says one thing, and no domain looks like a warning or a pass. Or one tone for each of the seven domains: easier to tell apart, but the seven tones left after red include green, amber and a pink-red that Dusk uses for states. The same pick decides whether a rule citation in the Radio is blue, as in the Yard, or stays green.
5. **The dyslexia face.** Ship the Atkinson Hyperlegible font files inside the app (recommended): the mode then shows the same face on each device and offline. It adds files, and the licence must be read first. Or keep today's stack: the face is not shipped, so a device shows it only if it has it, and otherwise shows another face.
6. **Reduced motion and a flashing lamp.** Keep the flash when reduced motion is on, and say so in Settings (recommended until the SME answers note 1 in section 11): the flash is the meaning. Or stop the flash and show a word: this needs the SME's word and a change beside the frozen drawing.

Checks for section 10. Each pick was tested against the fence. No pick hands the owner a command, a path or a step.

- **Check 10.1: confirmed.** See section 6. STRICT needs no new script. No line in `DECISIONS.md` already means STRICT (plan T8).
- **Check 10.2: confirmed.** The Yard drawing is 882 px wide in a 1440 px window today (measured). `.dusk-stage` has no `max-width` (`dusk.compose.css:14`). The whole-window option changes where each part sits on a wide screen: that is a change of look, not of behaviour.
- **Check 10.3: refuted.** The sentence "no reading text gets smaller than today" was false for the mapping as written. It is in section 17. The pick now names the texts.
- **Check 10.4: confirmed.** Dusk has eight tile tones (`dusk.components.css:385-424`): red, amber, green, down, teal, blue, violet, grey. Seven are left after red. All seven domains are live today (Check 2.2.2), so the grey tile has no use today. The second half of this pick (a blue or a green rule line in the Radio) meets the sentence at `radioSim.js:76`: see section 15, A1.
- **Check 10.5: corrected.** The licence is no longer "not verified" in full. The file `OFL.txt` in the `googlefonts/atkinson-hyperlegible` repository was fetched (https://raw.githubusercontent.com/googlefonts/atkinson-hyperlegible/main/OFL.txt). The fetch tool reports the first lines as a 2020 copyright of the Braille Institute of America and "This Font Software is licensed under the SIL Open Font License, Version 1.1". The check read it through the tool's summary, not as raw text. The size of the font files and the place of the licence text in the app are still not measured. Font files are new files: `src/assets/` and `src/styles/**` are in S1's Files line.
- **Check 10.6: corrected.** Tested against the fence, and the pick does not pass as written. The recommended option keeps the flash when reduced motion is on. Fence rule 6 says reduced motion stops every effect. "Say so in Settings" adds words, which a reskin cannot do (fence rule 3). The second option needs a word from the SME (fence rule 2). So neither option is a reskin and neither can be built in Wave 2b without the owner's exception to rule 6 or an approved U1 row. See section 16. Facts for the pick: the flash is one cycle each second, from full to 0.12 opacity (`signal.ts:35`); 25 of 42 signal items have it.

---

## 11. Notes for the SME

No rule wording is proposed. These are questions about how rule content is shown.

1. **Flashing aspects and reduced motion.** 25 of the 42 signal items have at least one flashing lamp (counted from `public/data/signals.json`, read only). The flash is the only thing on the screen that tells a flashing aspect from a steady one. Today the flash runs when the reduced-motion setting is on and when the operating system flag is on (measured). Fence rule 6 says reduced motion stops every effect. If the flash stops, a still lamp shows a different aspect unless a word or a mark says "flashing". Question: is a still lamp with a word an acceptable way to show a flashing aspect in a trainer, and what is the word?
2. **Mast and dwarf.** The mast is 2.37 against its ground today and 2.58 to 2.77 on Dusk grounds. The housing ring is under 1.6 in both. Question: must a learner see the mast or the housing to read an aspect correctly, for example to tell a mast signal from a dwarf signal? If yes, the frozen drawing needs a change that only the SME can approve.
3. **Colour as a category.** The mapping keeps the app's categories and gives each a Dusk tone: CROR in blue, special instructions in amber, GOI practice in amber, the engineer's radio lines in teal, your lines in blue, "verified" in green. Amber is also the colour of a switch lined reverse and of "TIED" on the Yard canvas today (`render.js:14,146`), and red is the foul tick. Question: does any of these tones conflict with a colour meaning a conductor learns on the railway? Plan T12 already asks this for yellow.
4. **Red in the signal drawing.** Fence rule 5 says red is attention only. A red lamp in an aspect is content in a frozen file. The mapping treats it as outside the rule. The SME does not need to act; the lead should record the exception.
5. **Added by the check: colour words on the screen.** The Yard help says "yellow = lined into the track / diverging" and "green = normal" (`yardSim.js:190-191`). The guided Radio says "Green lines are the engineer" (`radioSim.js:76`). Two Yard labels say "Solid = loaded, hollow = empty" (`puzzles.js:18,281`). Today the "yellow" is `#f2b134`. The Dusk candidate is `--amber`, `#cc8f00`, a darker amber. Question: is the colour of a switch target a convention that a conductor learns, and if it is, does a learner still call the Dusk amber "yellow"? This joins plan T12. No word is proposed here.
6. **Added by the check: more than one meaning for one canvas colour.** On the Yard canvas today the `reverse` colour is used for a switch lined reverse, for the word "TIED" and for "⚡ KICKABLE", and the `clear` colour is used for the foul tick and for the word "LOOSE" (`render.js:119,125,132,146,150`). Each word is drawn beside its colour, so the colour is not the only carrier. Question: is any of these pairs a conflict for a learner?

Checks for section 11:

- **Check 11.1: confirmed.** 25 of 42 items, and the flash runs with the setting and with the flag (Check 5.4.2). The note asks a question and proposes no word.
- **Check 11.2: confirmed.** Mast 2.37 today and 2.58 to 2.77 on Dusk grounds; housing ring 1.36 today and 1.48 to 1.59 (Check 7.4.3). `signal.ts` is frozen: the note is the right place.
- **Check 11.3: corrected.** The note said red is the foul tick. Red is also the word "LOOSE", and amber is also "⚡ KICKABLE" (`render.js:146,150`). Note 6 now holds the full list.
- **Check 11.4: confirmed.** The lamp colours are `signal.ts:21`. The lead records the exception to fence rule 5; no agent edits the file.
- **Check 11.5: confirmed.** No note in this section writes, corrects or cites a rule (fence rule 2). Where this report quotes a citation string (for example "CROR 113.4 / 113.5" in Check 2.7.6), it quotes text from an app file as a string to measure, not as rule content.

---

## 12. Seen in passing — for R4, R5 and R6

Not part of the mapping. Each was measured or read while doing it.

- Targets under 44 px today, at 390 wide: the skip link 138 × 40, the home mark 42 × 42, the tip link 258 × 34, each settings toggle 50 × 28, each Yard select 39 high, the Yard buttons 37 high, "Key the radio" 41 high, each `summary` 20 to 24 high.
- The high-contrast mode today makes three pairs worse and does not reach the Yard or the guided Radio (5.2).
- A domain tile shows mastery as a bar with no visible number (`Home.tsx:49`): the value is only in `aria-valuenow`.
- A switch-list line is a `div` with a click handler and no keyboard path (`yardSim.js:566-570,577`).
- The Yard message `#msg` has no `aria-live` (`yardSim.js:174`).
- Text inside the Radio SVG has sizes from 9 to 14 user units in a 760-unit box (`radioSim.js:44-66`). At 390 wide the box is about 334 px, so 9 units is about 4 px. Not measured on a real phone.
- The comment at `radioSim.js:3` holds a person's name (fence rule 14).

Checks for section 12:

- **Check 12.1: confirmed.** Measured at 1440 and at 390, the same at both: skip link 138 × 40, home mark 42 × 42, tip link 258 × 34, toggle 50 × 28, each Yard select 39 high, the Yard buttons 37 high, "Key the radio" 41 high, `summary` 20 high in the Yard and 24 high in Reference.
- **Check 12.2: confirmed.** See Check 5.2.1.
- **Check 12.3: confirmed.** `Home.tsx:49`: the bar has `aria-valuenow` and no text.
- **Check 12.4: confirmed.** `yardSim.js:567` builds a `div`; `:577` adds a click listener only.
- **Check 12.5: confirmed.** `#msg` has no `aria-live` attribute in the running app (measured) and in `yardSim.js:174`.
- **Check 12.6: confirmed.** The SVG has `viewBox="0 0 760 240"` and text sizes 9, 10, 10.5, 11, 13.5 and 14. At 390 the SVG is 336 px wide (measured), so 9 units is 4.0 px. Not measured on a real phone.
- **Check 12.7: confirmed.** The comment on `radioSim.js:3` holds a first name. This report does not repeat it.

---

## 13. Not verified

- Any page-law rule that the Dusk files do not repeat (section 6).
- The plan for the theme colours in `vite.config.ts` (3.7): designed, not built.
- A `<link>` to each Dusk layer from `index.html` in a Vite build (8.1).
- The reports of a wrong CSS order across lazy chunks in Vite: search summaries only (8.1).
- WCAG wording. The numbers 4.5, 3 and 44 px are from the fence and from model knowledge. The WCAG pages did not open. A search summary agrees on 24 px for criterion 2.5.8 and 44 px for 2.5.5.
- The licence of the Atkinson Hyperlegible face. A search summary says the common copies are under the SIL Open Font License 1.1 and that the first release had its own licence text. I did not read a licence file. The size of the font files is not measured.
- Whether upper-case labels are harder for readers with dyslexia (5.1).
- Every font result is for this Linux machine only. Windows, macOS, iOS and Android have other installed faces.
- The mapping in a real build. The harness is a static page with sample markup, not the app. No app file was changed. Pictures of the real surfaces come from the build jobs.
- Safari and Firefox. Every measurement is Chromium. `color-mix()` on `::backdrop` and `:where()` are **not verified** in the Tauri web view or in Safari.
- The size of the final app sheet (8.3).

Checks for section 13:

- **Check 13.1: confirmed.** Each item above is still not verified after the check, with two changes. (1) The licence of Atkinson Hyperlegible: the licence file was fetched and its summary says SIL Open Font License 1.1 (Check 10.5). (2) "The mapping in a real build": the checker emulated the S1 floor on the served build (section 15, A8). That is the bridge on the real app, not the Dusk parts on the real app. The surfaces of B1, B2, B3 and Y3 are still not drawn on the app.
- **Check 13.2: not verified.** WCAG wording. `www.w3.org` did not resolve for the check. The numbers 4.5, 3, 24 px and 44 px are from the fence and from model knowledge. That a disabled control is outside the contrast rule is from model knowledge.
- **Check 13.3: not verified.** Added by the check and not drawn or built: the question panel and the session tile with real strings (Check 2.5.6); the Reference row with no icon square (Check 2.4.7); the Dusk lamp in the home mark (Check G19); each control pressed with a real pointer (Check 7.3.3); the theme colour build step (Check 3.7.2); the `@import` build (Check 8.1.5); the 18 pixel samples of the report (Check 0.4); the size column of Table 4 (Check 7.1.7); the cache budget (Check 8.3.5); the meaning of "Rail" (Check 6.3); the page law (Check 6.6); the dyslexia style guide (Check 5.1.6).
- **Check 13.4: not verified.** Every measurement of the check is Chromium on one Linux machine, as the report's are. Load from other agents on the machine can change a timing. The check has one timing: the lamp samples of Check 5.4.2. They show that the opacity changes in each case; the value of one sample depends on the moment it was taken. Each other number is a size, a colour or a count, which load does not change.

---

## 14. Sources and scratch files

Files read: the list in section 0.

Web, search summaries only (no page opened):

- Atkinson Hyperlegible: https://en.wikipedia.org/wiki/Atkinson_Hyperlegible ; https://github.com/googlefonts/atkinson-hyperlegible
- WCAG target size: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html ; https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced
- Dyslexia style guide (not opened): https://www.bdadyslexia.org.uk/advice/educators/teaching-for-neurodiversity/creating-dyslexia-friendly-resources
- Vite CSS order reports: https://github.com/vitejs/vite/pull/16588 ; https://github.com/vitejs/vite/issues/15155 ; https://github.com/vitejs/vite/issues/5902

Hosts that must be allowed in the session's network settings for a full check: `www.w3.org`, `vite.dev`, `www.brailleinstitute.org`.

Scratch folder: `/tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/R3/`

| File | What it is |
|---|---|
| `bridge.draft.css` | The draft bridge that every Dusk number was measured with. |
| `parts.draft.css` | The draft `cb-` parts. |
| `build-map.mjs`, `map.src.html`, `map.html` | The harness page: the six layers byte for byte, the bridge, the parts, sample markup. |
| `walker.js`, `measure-map.mjs`, `map-measure.json` | The contrast walker, the measuring script, all results. |
| `pixel-check.mjs` | The check of the maths against real pixels. |
| `today.mjs`, `today.json`, `misc-today.mjs` | The app as it is: contrast, the lamp flash, small targets. |
| `count-colours.mjs` | The T1 count. |
| `vite-order/` | Five scratch builds for the order and the size. |
| `shots/` | Pictures: the app today at 1440 and 390 (`now-*.png`), the harness (`map-1440.png`, `map-390.png`, `map-390-dysbig.png`). |

Checks for section 14:

- **Check 14.1: confirmed.** Each file in the table is in the scratch folder. The draft bridge and the draft parts there are the first drafts: they still hold the `:is()` rules and the reset with no app class. The corrected rules of the check are in the checker's folder (below). S1 must write the real files from the corrected text of this report, not from the first drafts.
- **Check 14.2: confirmed.** One more source was opened by the check: https://raw.githubusercontent.com/googlefonts/atkinson-hyperlegible/main/OFL.txt (the licence file, through a fetch tool's summary). `www.w3.org` did not resolve.

The checker's scratch folder: `/tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/R3-check/`

| File | What it is |
|---|---|
| `names.mjs`, `inv.mjs` | Each Dusk class and token named in this report against the six layer files; the full list of 151 Dusk classes. |
| `recompute.mjs`, `calc2.mjs` | Every ratio of section 7 made again with `lib/color.mjs`; today's pairs; the pairs that the table did not hold. |
| `today.mjs`, `today2.mjs`, `today3.mjs`, `today4.mjs` | The running app: sideways scroll, targets, text sizes, the dyslexia mode, the lamp flash, the islands in each mode. |
| `build-probe.mjs`, `probe.html`, `probe.mjs` | The first probe: bare Dusk, then Dusk with the draft bridge and draft parts. |
| `build-probe2.mjs`, `probe2.html`, `probe2.mjs`, `skipshot.mjs` | The second probe: `body.cb-app`, the corrected resets, the row grids at 390, the title bar, the focus ring, the skip link. |
| `fixes.mjs`, `ns3.css`, `parts.corrected.css` | The corrected rules of the check, drawn, and the same rules as files for the namespace check. |
| `s1floor.mjs`, `s1shot.mjs`, `s1-floor.json`, `s1-today.json` | The emulated S1 floor and the pixel reader. |
| `vite-a/`, `vite-c/` | Two new scratch builds for the order and the size. |
| `*.png` | Pictures: `skip-focus-390.png`, `fix-skip-390.png`, `probe2-focus-1440.png`, `s1floor-*.png`. |

---

## 15. Added by the check

Each finding has its evidence. A fix in this section stays inside the fence, or the finding says that it needs a ruling.

**A1. Sentences on the screen name a colour or a drawing style. A reskin must keep them true.**

| Where | The words | What draws the colour today | What the mapping does |
|---|---|---|---|
| `yardSim.js:190` | "yellow = lined into the track / diverging" | The word is in `--si` (`#f2b134`). The switch target is `C.reverse` (`#f2b134`, `render.js:14,119`). | `--si` → `--amber-ink` (`#cc8f00`); `reverse` → `--amber` (`#cc8f00`) |
| `yardSim.js:191` | "green = normal, straight up the ladder" | The word is in `--good` (`#39b58a`). The target is `C.normal` (`render.js:13,119`). | `--good` → `--green-ink`; `normal` → `--green`. Still a green. |
| `radioSim.js:76` | "Green lines are the engineer" | The left edge of an engineer line is `--rgreen` (`#33c27f`, `radioSim.js:22`). | `--rgreen` → `--teal` or `--teal-ink` (`#2fb3ad`, `#31b3ad`) |
| `puzzles.js:18,281` (frozen) | "Solid = loaded, hollow = empty", "Solid cars are loaded, hollow are empty" | The car drawing in `render.js`. | Y2 redraws the cars. |

Fence rule 3 says a reskin changes no word. Fence rule 15 says show nothing rather than something false. So: (1) the engineer's edge in the Radio stays a green (`--green`), or the owner approves a word change as a U1 row; (2) the Y2 drawing keeps a loaded car solid and an empty car hollow; (3) whether the Dusk amber still reads as "yellow" is a question for the owner and the SME (note 5 in section 11). The first two are checked facts. The third is a judgement and is **not verified**.

**A2. The mapping makes these texts smaller than today.** "Today" is the computed size in the running app at the default text scale. "Mapped" is the computed size of the Dusk part in the probe with the draft bridge. Each mapped size follows the text scale, because the bridge gives the Dusk sizes in rem.

| Text | Today | Mapped | Dusk part |
|---|---|---|---|
| Drill question heading | 20.8 px | 13 px | `.dusk-panel-name` |
| Radio test question | 20.8 px | 13 px | `.dusk-panel-name` |
| Reference entry title | 18.72 px | 13 px | `.dusk-panel-name` |
| Settings title | 16.8 px | 13 px | `.dusk-panel-name` |
| "Session done" heading | 20.8 px | 12 px | `.dusk-tile-lab` |
| Score at the end of a session | 38.4 px (2.4 rem, `src/index.css:98`; not measured) | 27 px | `.dusk-tile-num` |
| Mastery lines at the end of a session | 16 px | 12 px | `.dusk-tile-sub` |
| "Question N of M", "Call N of M" | 16 px | 12 px | `.dusk-panel-sub` |
| "N correct" | 16 px | 11 px | `.dusk-count` |
| Domain name | 16 px | 12 px | `.dusk-tile-lab` |
| Domain description | 13.44 px | 12 px | `.dusk-tile-sub` |
| Station sub-label | 13.33 px | 11 px | `.dusk-row small` |
| Reference row text, with the draft parts | 13.33 px | 11 px | `.dusk-row small` (14 px with the corrected rule of Check 2.4.2) |
| Section heading on Home | 12.48 px | 11 px | `.dusk-rule b` |
| Radio test readout | 18.4 px | 15 px | `.dusk-cell--key b` |
| Yard readout | 16 px | 14 px | `.dusk-cell b` |
| Yard legend; its name | 12.5 px | 12 px; 11 px | `.dusk-rule`; `.dusk-rule b` |
| Yard rule label in a chip | 12.5 px | 12 px | `.dusk-tile-sub` |
| Settings note | 12.8 px | 11 px | `.dusk-note` |
| Settings row sub-line | 12.8 px | 12 px | `cb-setrow small` |
| A button word | 14.4 px | 14 px | `.dusk-btn` with the floor rule (12 px without it) |

These do not get smaller: the prompt (17.6 px), an answer option (16 px), the lede, the footer text (13.12 → 14 px), the trust chip (11.52 → 12 px), the source line (12.8 → 14 px), the work order job, the Yard hint (12.5 → 14 px), the Yard message (15 → 16 px). One text gets larger with no rule: the app name, 21.6 → 32 px (Check 2.1.2).

Fix inside the fence: a page-local size on the same element, under an app class, for each text that the owner counts as reading text. Owner pick 3 now asks.

**A3. `.dusk-rows` is a column grid below 760 px.** `dusk.compose.css:399-401`: `grid-template-columns: repeat(auto-fill, minmax(var(--chip-min), 1fr))`, and `--chip-min` is 150 px. Probe at 390: two columns of 182 px. A Reference row with a long text is 195 px high there. The Reference list has 219 rows (measured). Today each row is one column, 354 px wide. Fix, drawn by the check: an app class on the list with `grid-template-columns: minmax(0, 1fr)`: one column of 366 px. The station list on Home has short rows and can keep the Dusk columns: Table 1 already gives it a page-local column rule.

**A4. The strict namespace check of the reskin tools fails on the first drafts.** Command: `dusk-sync.mjs check --to src/styles/dusk --expect 0.2.0 --namespace <folder> --strict-namespace` on a folder that holds the draft bridge and the draft parts. Result: "check FAILED: 10 dusk- classes are defined, or restyled everywhere, outside the copied folder". The tool passes a rule where a Dusk class is under a class of the page's own. It fails a rule whose selector holds Dusk classes only, and it reads each item of an `:is()` list alone. Tested one rule at a time:

| Rule | Result |
|---|---|
| `.cb-app :is(.dusk-btn, .dusk-seg button, .dusk-row) { … }` | fails: `.dusk-row`, `.dusk-seg` |
| `.cb-app .dusk-btn, .cb-app .dusk-seg button, .cb-app .dusk-row { … }` | passes |
| `:where(button.dusk-tile, button.dusk-row) { … }` | fails |
| `:where(.cb-app button.dusk-tile, .cb-app button.dusk-row) { … }` | passes; specificity is still zero; the lit row keeps its wash |
| `html[data-reduce="1"] :is(.dusk-tile, .dusk-btn) { … }` | fails |
| `html[data-reduce="1"] .cb-app .dusk-tile, html[data-reduce="1"] .cb-app .dusk-btn { … }` | passes |
| `button.dusk-row[disabled] { … }` | fails |
| `.cb-win > .dusk-main { … }`, `.cb-app .dusk-bar { … }` | pass |

The corrected parts file and the corrected rules of this report pass together: "0 to fix, 12 placed under the page's own class". Whether G1 puts this check in the gate is G1's decision. Dusk D-009 reserves the `dusk-` prefix in each case.

**A5. Reading order.** Four rows of Table 1 changed the DOM order of words that are on the screen today: the Drill question frame (Check 2.5.2), the Radio test (Check 2.6.3), the Yard work order (Check 2.7.3) and the Yard picker (Check 2.7.4). Each row now says how to keep today's order.

**A6. The dyslexia spacing does not reach a form control.** Measured in the running app with the mode on: `body` letter spacing 0.32 px and word spacing 1.28 px; `.opt`, `.back` and `.iconbtn` `normal` and 0 px. The face and the line height do reach them. The answer options are the text a learner reads most. A rule `letter-spacing: inherit; word-spacing: inherit` on `button, input, select` under the mode would carry the spacing. It changes what the mode does, so it needs the lead's ruling: reskin or U1.

**A7. An island declaration beats the bridge.** The Yard and the Radio each add a `<style>` element to `<head>` at mount (`yardSim.js:215-219`, `radioSim.js:125-130`). It is later than the bundle. The islands declare their names on `.yard-wrap` and `.radio-wrap`, and the draft bridge uses the same two selectors. Same specificity, later rule: the island wins. Measured in the emulated S1 floor: `.yard-wrap` computes `--panel: #14181f`, `--ink: #e7ebf0`, `--bg: #0b0e12`; `.radio-wrap` computes `--rcard: #1d222b`. So after S1 alone the Yard and the guided Radio keep their old palettes inside a Dusk shell, the high-contrast mode still does not reach them, and the Yard still shadows Dusk's `--ink`. This ends when Y1 deletes `yardSim.js:44-47` and B3 deletes `radioSim.js:6-7`. S1's "the app turns Dusk-coloured" is true for the shell, Home, Reference, Drill, Signals, Settings and the Radio test, and not for the two islands.

**A8. The S1 floor, emulated on the served build.** Method: the browser rewrote the one CSS response of the built app, in memory only. New sheet: the five Dusk layers, the draft bridge, then the app sheet without its `:root` block, its dyslexia rule and its high-contrast rule, then `body { padding: 0 }`. No file was changed and nothing was built. The pixel reader then read 758 text nodes on 14 screens and states (Home, Settings, Reference with an entry open, Signals after a wrong answer, the Radio test, the guided Radio, the Yard; default and high contrast).

| Result | Value |
|---|---|
| Lowest pair of an enabled control or of plain text, shell screens, both modes | 5.25 or more |
| The disabled Exam button | 3.54 ("Coming soon") and 4.86 (the name); today 2.76 and 4.59 |
| The Yard, both modes | as today: the hint 4.02 at the sampled pixels, the note 4.97 (see A7) |
| Sideways scroll at 1440 and 390 on Home, Reference, Yard, Radio | none |
| Paragraph margins in the lede, the footer and the Yard help | 0 px (trap 9.5) |
| The horizon | shows low on the page (Check 6.4) |

This is an emulation. A real build by S1 is still needed.

**A9. One pair of the bridge is under AA on one ground.** The track name on a switch-list line reads `--cror` (`yardSim.js:87`). On a flagged line the ground is `--sibg` (`:84`). Bridge: `--blue-ink` on `--rowwash-amber`. Computed: 4.41 over `--head`, 4.57 over `--panel-hi`, 4.97 over `--glass`. Today: 8.48. Today the flagged line replaces its `--panel2` ground with `--sibg`; with the bridge `--sibg` is see-through, so the ground under it is the work order panel (`--panel-fill`, light end `--panel-hi`): 4.57, a pass with 0.07 to spare. Rule for Y1 and Y3: the track name on a flagged line takes `--ink`, or the line never has `--head` under its wash. The rows are in 7.1.

**A10. A side effect of the high-contrast plan.** See Check 5.2.4. Fix inside the fence: one more line in the high-contrast rule, under an app class, gives the icon square an edge in `--lit-line` (4.19 on `--glass`): for example `html[data-contrast="1"] .cb-app .dusk-ico { border-color: var(--lit-line) }`. Not drawn: **not verified**.

**A11. `.dusk-skip` is see-through.** See Check 2.1.3. The fix was drawn and passes the namespace check.

**A12. The seven colours typed in shell rules have no row in Table 2.** Fence rule 4 lets none of them stay in `src/index.css`, and S1 owns that file. Candidates, each a token that exists:

| Line | Typed today | Use | Candidate |
|---|---|---|---|
| `:21` | `#00340f` | skip link ink on a green fill | The Dusk skip link: `--btn-ink` on `--btn-bg`, with the ground of A11. If S1 keeps the old shape for one wave: `--well` on `--clear` is 8.60. |
| `:42` | `#6fd17f` | the light end of the progress fill | One flat fill: `--green` (or `--teal` if the owner picks teal for the tile tone). |
| `:64` | `rgba(210,153,34,.12)` | tip link hover | `--rowwash-amber` |
| `:93` | `rgba(63,185,80,.16)` | right option fill | `--rowwash-green` (`--ink` on it over `--head`: 13.00) |
| `:94` | `rgba(248,81,73,.14)` | wrong option fill | `--rowwash-red` (`--ink` on it over `--head`: 13.90) |
| `:102` | `rgba(0,0,0,.6)` | dialog backdrop | `--cb-scrim` |
| `:117` | `rgba(63,185,80,.25)` | toggle "on" fill | `--rowwash-green`, or `--wash-2` when B1 brings the `cb-toggle` |

The comment on line 20 holds three more hex values. A lint that reads comments finds them: S1 can reword the comment. The candidates were not drawn: **not verified**, except the two ratios, which are in 7.1.

**A13. The list of unused Dusk parts in 2.8 was not complete.** See Check 2.8.1.

---

## 16. Not offered: needs a frozen file, or a ruling on a fence rule

No agent can close these inside the fence. Each one needs the lead, the owner or the SME.

| # | Item | Why it cannot be a fix here | Who |
|---|---|---|---|
| 1 | The signal mast (2.58 to 2.77) and the lamp housing ring (1.48 to 1.59) are under 3 on each dark ground | The colours are in `src/core/signal.ts`, which is frozen (fence rule 1) | The SME, note 2 |
| 2 | The lamp flash does not stop under reduced motion | The `<animate>` element is in `signal.ts` (frozen). Stopping it changes what an aspect shows (fence rule 2). Keeping it breaks fence rule 6 as written. A sentence in Settings is new words (fence rule 3). | The owner, pick 6; the SME, note 1 |
| 3 | Raw colours in `src-tauri/tauri.conf.json:24`, `public/favicon.svg`, `public/icons.svg` | Fence rule 4 allows a raw colour in the bridge and in the frozen files only. A JSON file and a picture cannot read a token. Each way out is an exception to rule 4. | The lead |
| 4 | Raw colours in `radioSim.js:45-66` and `:145` | Not frozen, but outside B3's Files line ("style rules only") | The lead: widen the line |
| 5 | The inline `opacity: .45` on the disabled count select, `yardSim.js:538` | Controller code, outside Y3's Files line | The lead: name the job |
| 6 | A colour word on the screen that the new colour makes doubtful (A1) | A word change is not a reskin (fence rule 3) | The owner, through U1, or the colour stays |
| 7 | `aria-hidden` on a station icon (Check 2.2.3) | It changes the spoken name of a button | The lead |
| 8 | A `✔` or `✕` mark in CSS on an option, a result and a message | Fence rules 3 and 5 pull two ways | The lead (the ruling in section 4) |
| 9 | The dyslexia spacing inside form controls (A6) | It makes the mode do more than today | The lead |
| 10 | A selected tab with no mark (Check G10) | The same as today and as Dusk's own part; fence rule 5 asks for more than colour | The lead |

---

## 17. Withdrawn

Statements of the first report that the check found false. The corrected text is in place in the section named. The old statement is kept here with the reason.

| # | Where | The statement | Why it is withdrawn |
|---|---|---|---|
| W1 | 2.5, question frame | "Same words, same order of reading: heading, count, score." | Today the order is count, score, heading (`Drill.tsx:225-226`). The row changed the reading order. |
| W2 | 2.4, result row | "The `small` holds rule text: it takes `cb-sub`, not the 11 px Dusk size." | With the draft parts it computes 11 px and `--ink-3`: `.dusk-row small` has more specificity than `.cb-sub` (probe; and table 7.1 lists the row under `--ink-3` at 11 px). |
| W3 | 4, G20 (and the same form in 5.4 and G7) | The rule `.cb-app :is(.dusk-btn, .dusk-seg button, .dusk-row)` "is a Dusk class under an app class: the kind of rule the reskin tools allow". | The tool fails that rule, and it fails the two other draft forms with no app class (section 15, A4). |
| W4 | 5.1, "Today" | "The Yard and the guided Radio set their own `font`, so the mode does not reach them." | True for the Yard. False for the guided Radio: it computes the dyslexia stack when the mode is on (measured). |
| W5 | 10, pick 3 | "no reading text gets smaller than today" | With Table 1 as written, the 21 rows of texts in section 15, A2 get smaller, and the question heading goes from 20.8 px to 13 px. |
