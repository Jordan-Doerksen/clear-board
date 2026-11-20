# Look A, "panel": notes

Clear Board 2, Wave 1, research. Date: 2026-11-20. Branch `claude/peaceful-mayer-qat99l`, commit `cb51d4b`.
One of three look sketches for the Yard station. Read-only on code and content.
A second job, an independent reviewer, checked and repaired the sketch on the same day (tree at commit `069f90e`). Its record is section 14, "Eye review". Sections 1 to 13 are the notes of the designer, corrected where a repair changed a fact.

Files of this job:

- `specs/research/yard-looks/look-panel.src.html` : the source (964 lines after the repairs of section 14; own CSS, markup, script, the scene object).
- `specs/research/yard-looks/look-panel.html` : the built sketch (147 kB; one file; the six Dusk layers inline).
- `specs/research/yard-looks/look-panel-1440.png`, `look-panel-390.png` : full-page pictures at scale 2, taken again after the last repair.
- `specs/research/yard-looks/look-panel.notes.md` : this file.
- Scratch folder `/tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/look-panel/` : the template, the build script and the check scripts. Nothing there is in the repository.

Status words in this file: **[measured]** is a result of a script of this job. **[read]** is a fact read in a file. **not verified** has no check.

## 1. What the look is

The yard is a dispatcher track diagram. It shows topology and order. It drops every pictorial detail.

- Thin lines (`--ink-3`, 2 px) on the near-black floor (`--glass`) are the lead, the ladder, the six tracks and the main line.
- The lined route is one lit line (`--lit`, 4 px, one still glow). It runs from the far end of the held cut, along the lead, up the ladder, through the reverse switch, to the first standing car. The words "Route: LEAD → AS73" are in the head bar of the panel and in the strip.
- A car is a plain block with its number in mono figures. Loaded is a solid block. Empty is a hollow block. The type tag (BX, HP, TK, AR) is under the block at the throat end.
- A switch is a diamond on the junction. The joined leg is the lined leg. The other leg starts after a gap. The words "AS73 REVERSE" or "AS72 NORMAL" are beside the diamond. Reverse is a solid diamond. Normal is a hollow diamond. The diamond is the visible mark of a 44 by 44 px button.
- The right of each track has its name and its state words: "AS73 ‖ TIED", "⚡ KICKABLE", "BUILD 3 / 4".
- The place where the called move lands is a dashed block with the car number.
- The page is one Dusk window: title bar and thread, a strip of readings, the framed Yard panel with its legend, the work order panel, the move builder with the banner, the rules, the two text blocks of the app, a refusal example, and a status bar that gives the lining of the six switches in words.

The sketch has two views of the same scene and one rule that selects the view (section 4).

## 2. How the sketch was built

1. `build.mjs` (scratch) reads `scene.json` and puts it in the page as one object, `const SCENE`. It copies two text blocks from `src/stations/yardSim.js` (the note, lines 183-185, and the "How to play" block, lines 187-209) and removes their old inline colours. It writes `look-panel.src.html`. Then it runs `inline-dusk.mjs`.
2. The script of the page draws from `SCENE` only. It types no coordinate, no car, no count and no state.
3. **[measured]** `verify.mjs`: the object in the built page is deep-equal to `scene.json`. The six Dusk layer files are in the built page byte for byte. The built page has 2 style blocks (Dusk, own) and 1 script block. It refers to no external file. The one "http" string in it is the SVG namespace name in the script; the browser does not fetch it.
4. **[measured]** The function `routeFor()` of the sketch computes the lined route from the lined map with the logic of `model.js:66-75`. For the scene it gives the same points as `scene.state.linedRoute.points` (`data-route-check="ok"` on the root element at both widths).

Limit: the page needs its script. With no script the diagram, the work order and the rules are empty. The Dusk rule "no text depends on JavaScript" (`/home/user/dusk/ARCHITECTURE.md:189`) does not hold for this sketch. Common rule 1 of the brief ("draw from that object only") is the reason. The app is a script application, so the build job has the same condition.

## 3. How each inventory element reads

### 3.1 The drawing

| # | Element | In the sketch |
|---|---|---|
| D1 | Floor | `.cb-yard` has the one fill `--glass`. |
| D2 | Frame | `.dusk-panel--framed`: the lit edge `--neon`, 8 px corner (`--r-tile`), a head bar. The present 12 px corner and drop shadow are gone. |
| D3 | Size and scale | No fixed bitmap. The wide view computes its x factor from the width of the panel. Text is DOM text at Dusk type sizes at every width. |
| D4 | Main line | A 2 px line from the AS76 switch off the top. Its label is beside its top end. |
| D5 | Ladder | 2 px lines from the foot through the six switches. In the row view the ladder is one vertical spine. |
| D6 | Lead / drill | A 2 px line from the left edge of the picture to the foot. In the row view it continues down below AS71. |
| D7 | Body tracks | Six 2 px lines, AS71 lowest. No end stop (none today). |
| D8 | Label "◄ DEPARTURE · LEAD / DRILL" | Wide view: under the lead at the left. Row view: beside the engine at the bottom. Copied without change. |
| D9 | Label "MAIN LINE → the road" | Beside the top end of the main line. Copied without change. |
| D10 | Label "15 MPH · REDUCED (CROR 105)" | In the head bar of the Yard panel, at the top right. Copied without change. It left the drawing because it is a condition of the whole yard, not of a place. |
| D11 | Label plate | `.cb-plate`: a `--glass` plate with a 4 px corner behind each label of the diagram, 12 px mono. |
| D12 | Switch target | A diamond, 14 px side, on each junction. Normal: hollow, `--green-ink` edge. Reverse: solid `--amber-ink`. The word NORMAL or REVERSE is beside it. The gap in the open leg shows the lining with no colour. |
| D13 | Switch glow | Removed. The solid diamond, the word and the joined leg carry the reverse state. The only glow of the diagram is the route. |
| D14 | Clearance tick | A 2 px tick in `--ink-2`, 20 px high, at `clearanceX` of each track. Not red. The words "foul point" are at the tick of the lined track. The legend names the tick. No tick on the lead (none today). |
| D15 | Track id | Wide view: 13 px bold mono at the right of the track end. Row view: the first word of the row. Also beside each switch. |
| D16 | TIED or LOOSE | `.dusk-state--hold` "‖ TIED" in `--ink-2`; `.dusk-state--caution` "■ LOOSE" in `--amber-ink`. 12 px. Shown only where the scene gives `securementTag` (AS71, with no car, has none). |
| D17 | Kickable mark | "⚡ KICKABLE" in `--ink-2`, 12 px, never cut: the label column is measured before the x factor is set. |
| D18 | Car | A block, 26 px across the track, 4 px corner. Wide view: length = len × ax, at the true position. Row view: length = len × k, in true order. |
| D19 | Car type colour | A category: box `--tile-grey`, hopper `--tile-teal`, tank `--tile-violet`, centerbeam `--tile-amber`, autorack `--tile-blue`. The matching `--<tone>-ink` is the edge of an empty car and the colour of the tag. |
| D20 | Load state | Loaded: solid fill, number in `--on-tile`. Empty: `--well` body, 1.5 px edge in the type ink, number in `--ink`. |
| D21 | Car number | The last word of the mark, 12 px bold mono, in the block. When it does not fit, it stands above the block, and neighbours take two heights in turn. No smaller size. "Fit" is: 3 px or more from the number to the outer edge of a block that has an edge line, 1.5 px or more to the edge of a solid block (section 14, repair 4). |
| D22 | Type tag | 11 px mono under the block at the throat end. Always on screen. |
| D23 | Cut and gap | Cars of one cut touch. The 42 unit gap on AS72 shows bare line between 70222 and 8810. No coupler mark. |
| D24 | Engine | A block on `--head` with the lit edge `--neon-ctl` and the word ENGINE in `--lit`. 30 px across the track. |
| D25 | Headlight | A 6 px `--lit` dot at the end of the engine away from the cars, placed from `scene.state.engine.headlight`. |
| D26 | Held cut | The held car 70110 is the block next to the engine, toward the yard. In the row view the held cars are a stack on the lead, the far-end car nearest the foot. |
| D27 | Move animation | Not drawn. Room: section 9. |
| D28 | Shove animation | Not drawn. The branch does not run today. |
| D29 | Arrival cinematic | Not drawn. Room: section 9. |
| D30 | Departure run | Not drawn. Room: section 9. |
| D31 | Watch optimal | The button is there and does nothing in the sketch. |
| Pointer | Click on the canvas | Six real buttons, 44 by 44 px, one on each switch. Pointer, Space and Enter change the lining. The words, the diamond, the gap, the route line, the route words, the status bar and a polite live line change with it. |

### 3.2 The chrome

| # | Part | In the sketch |
|---|---|---|
| C1 | Back button "← Home" | `.dusk-btn` in the title bar. |
| C2 | Picker | A native select in `.dusk-strip-end`, with the group label and the option label of the scene. One option only: the scene holds one job. |
| C3 | Readout | Three strip cells: Moves 4, par 6, Joints 2. The label words are cut from the readout text by the script. The strip has the full text "Moves 4 / par 6 · Joints 2" as its accessible name. |
| C4 | Work order | A framed panel. Head: the top line, without change, and a `.dusk-count` "par 6". Body: the job line, the target line and the hint, with the same bold and dim parts. |
| C5 | Switch-list check | Not in this puzzle. Not drawn. Its place is the body of the work order panel. |
| C6 | Move builder | `.dusk-seg` for PULL, SPOT, KICK, SECURE (KICK pressed); a select for the count; the word "cars"; a select for the track; "Work it ▸"; "▶ Watch optimal". "Reset" and the sound button are in `.dusk-strip-end`, as the brief says. The titles of the app are on the controls. |
| C7 | Depart button | Hidden for this puzzle. Not drawn. Its place is after "▶ Watch optimal". |
| C8 | Banner | Tone ok: "Spotted 1 to AS72." in `--ink` on a sunk slot, no glyph, as today. Tone bad: the refusal example, `.dusk-state--attn` (glyph ?, `--red-ink`), a red lit edge (`--rowneon-red`), the button "Look it up →". Tones none and win are not drawn. |
| C9 | Legend line | Copied without change. CROR and S.I. are bold `--ink`. No category colour. |
| C10 | Rule chips | Eight chips. The cite is bold mono. A chip of kind S.I. has a dashed edge and the tag "S.I." before its cite. A chip of kind CROR has a solid edge; its cite starts with the word CROR. |
| C11 | Note "What this trainer builds" | Copied from `yardSim.js`. **[measured]** Its text is equal to the app text. |
| C12 | "How to play & why these rules" | A closed details block, copied from `yardSim.js`. **[measured]** Its text is equal to the app text. The words "yellow" and "green" in it take `--amber-ink` and `--green-ink`. |

### 3.3 Things the present drawing does not have (inventory item 45)

| Thing | In the sketch |
|---|---|
| A mark of the lined route | Yes: the lit line and the route words. |
| A word for the switch state | Yes: NORMAL, REVERSE. |
| A word on the engine | Yes: ENGINE. |
| A goal mark | Yes: BUILD and the chip "3 / 4" on AS73. |
| The landing place of the called move | Yes: a dashed block with the number 70110. |
| A capacity mark for a track | Row view: a bar under each row. Wide view: none (section 6, deviation 1). |
| A capacity mark for the lead | Row view: a bar beside the engine (42 of 558 units, from `scene.state.engine`). The taken part is at the yard end, the right end, as on a track bar and in the legend (section 14, repair 3). Wide view: none. |
| A car count on a track or on the engine | No. The brief asks for none. |
| A text alternative | A hidden list (`#mirror`, class `.dusk-sr`) gives the route, the engine with its cars, and each track with its lining, state words and cars. The visible status bar gives the six linings. |

## 4. The two views and the 390 strategy

One rule selects the view. The script draws the wide view first. It uses the row view when the x factor is under 0.8, or when any word, block or target of the wide view touches another one or leaves the frame (function `collides()`).

**Wide view (1440).** Affine, with separate factors: x' = ax × (x − 40), y' = 64 + 1.35 × (y − 60).

- **[measured]** At a 1440 px viewport the diagram is 1416 by 543 px and ax is 1.038 (a box car block is 43.6 px; 42 units). The track pitch is 70.2 px.
- The label column at the right is measured first. Its width sets ax. No label is cut.
- **[measured]** The step between two switch buttons is 72.6 px across and 70.2 px down. No two buttons overlap.

**Row view (390).** Re-projection, not a scale.

- The ladder is one vertical spine at x = 28 px. From the top: the main line stub with its label; the rows AS76 down to AS71; the foot; the lead continues down with the held cars (the far-end car nearest the foot); the engine; the label of the lead and the lead bar.
- Each track is one row to the right of its switch: the words ("AS73 REVERSE ‖ TIED ⚡ KICKABLE BUILD 3 / 4", they wrap), then the track line with its blocks, then the track bar. **[measured]** The row pitch at 390 is 92 px (110.5 px for AS73, where the words take two lines). The diagram is 366 by 723.5 px.
- Along a track the map from units to px has three linear pieces: switch to foul point, foul point to the nearest thing (car or landing place), nearest thing to track end. The last piece is at car scale (k = 1.1 px for each unit: a box car is 46.2 px). The map is continuous and monotonic. A motion can run on it.
- The middle piece is not to scale. The mark "⋯" on the line says so. The legend says "⋯ not to scale". On the lined track the mark has the route ink `--lit`, so the route reads as one line (section 14, repair 2).
- The track bar is mandatory in this view. It runs from the foul point to the track end in true proportion. The hollow part is room. The solid part, at the car end, is taken (cars and the gaps between cuts).
- When the cars of a row need more width than the row has, k goes down for that row only.
- The lit route is one continuous line: up the lead, up the spine, right along the row of AS73.
- The row view is also the view at 768 and 1024 px, and at 1440 px when the text is 30 percent larger. It is the safe fallback of the look.

Limits of the row view:

1. **[measured]** At 390 px the diagram is 723.5 px high. The move builder starts below it. A person must scroll between the switches and "Work it ▸". Full play on a phone needs a fixed builder bar, or a shorter diagram. This sketch has neither.
2. **[measured]** Scratch test with the longest standing cut of the authored lines (p5-long, AS71 after move 4: 8 autoracks, 600 units): at 390 px each block is 32.1 px, under the 36 px of the brief. Nothing overlaps. In that row an autorack is narrower than a box car of another row. Block length is comparable inside one row only. The bar is the only true length cue between rows. Puzzles p5-long and p5-room teach length, so this is a real risk.
3. The arrow "◄" of the lead label points left. In the row view the lead leaves at the bottom. The label is a copied word, so the sketch does not change it.
4. The Tab order is AS71 to AS76 (the brief). In the row view that is from the bottom row up.
5. Held cars on the lead are a stack of blocks of one height. They do not show length. The lead bar does.

## 5. Token map

| Meaning | Token | Word, glyph or shape that also carries it | Mark |
|---|---|---|---|
| Floor of the diagram | `--glass` | | |
| Track, lead, ladder, main line | `--ink-3`, 2 px | position; labels | |
| Lined route | `--lit`, 4 px; the same line 13 px wide at 0.22 opacity, blurred 3 px, as the still glow | one continuous line; "Route: LEAD → AS73" | SME to confirm |
| Switch normal | `--green-ink` | NORMAL; hollow diamond; the ladder leg is joined | SME to confirm |
| Switch reverse | `--amber-ink` | REVERSE; solid diamond; the track leg is joined | SME to confirm |
| Foul point | `--ink-2` | a tick; "foul point" | SME to confirm |
| Car type | `--tile-grey`, `--tile-teal`, `--tile-violet`, `--tile-amber`, `--tile-blue`; edge and tag `--<tone>-ink` | BX, HP, TK, CB, AR; length | SME to confirm |
| Loaded | the type fill; number `--on-tile` | solid block | bound by the app words |
| Empty | `--well`; number `--ink` | hollow block | bound by the app words |
| TIED | `--ink-2` | ‖ TIED (`.dusk-state--hold`) | SME to confirm |
| LOOSE | `--amber-ink` | ■ LOOSE (`.dusk-state--caution`) | SME to confirm |
| Kickable | `--ink-2` | ⚡ KICKABLE | |
| Engine | `--head`, `--neon-ctl`, word in `--lit` | ENGINE; headlight dot | |
| Goal | `--lit` | BUILD; `.dusk-count` "3 / 4" | |
| Landing place | `--lit` dashed edge on `--glass` | dashed block; the car number; legend "KICK 1 to AS73" | |
| Track bar | edge `--ink-3`, taken part `--ink-2` | hollow and solid; legend "room", "cars" | |
| Refusal | `--red-ink`, `--rowneon-red` | ? and the refusal words; a ring and a "?" at the switch that the text names | |
| Rule chip kind | no colour | "CROR" in the cite; the tag "S.I." and a dashed edge | |
| Status bar lamp | `.dusk-led--ok`, `.dusk-led--caution` | "AS73 REVERSE" beside each lamp | SME to confirm |

Red has one use in the sketch: the refusal example. Gold has these uses: chrome, the pressed segment, the route, the engine, the goal, the landing place. R1 asked the lead to decide if route, engine and goal count as "selection" (`R1-yard-visual-language.md`, section 7). That decision is open.

## 6. New labels, bridge values, gaps, deviations

**New labels (the present app has none of them).** On the diagram: NORMAL, REVERSE, ENGINE, BUILD, "foul point", "⋯", the chip "3 / 4", the car number in the landing block. In the chrome: "Route" (strip cell, and "Route: LEAD → AS73" or "Route: LEAD → MAIN LINE" in the head bar), "Job" (strip cell), "Yard" (panel name), the tag "S.I." on two chips (the word is from the app's legend line). In the legend: "room", "not to scale", "SME to confirm", the type names box, hopper, tank, centerbeam, autorack (the keys of `geometry.carTypes`), "loaded", "empty" (`loadWord` of the scene), "KICK 1 to AS73" (`nextMove.asSentence`). Sketch only: "SKETCH · look A, panel · p4-peel, 3 of 4", "Refusal example", "SKETCH ONLY", the sub-line "KICK 1 to AS73 · AS72 REVERSE · AS73 NORMAL". Not visible: the names "AS73 switch, lined reverse", "Yard track diagram", "Move builder", "Rules in play", "Switch lining", "Legend", the skip link "Skip to the yard", and the text of the hidden list (for example "ENGINE, LEAD: 70110 BX empty.", "AS71 switch, lined normal. 0 cars.").

**Bridge block (`:root`, comment "bridge").** 12 values. All are lengths or plain numbers. None is a colour: `--cb-rail-w`, `--cb-route-w`, `--cb-route-glow-w`, `--cb-route-glow-a`, `--cb-route-glow-blur`, `--cb-block-h`, `--cb-engine-h`, `--cb-target`, `--cb-ay`, `--cb-k`, `--cb-spine-x`, `--cb-row-indent`. The glow of the route is the route line again in `--lit`, wider, faint and blurred. Dusk has no gold glow token that `drop-shadow()` can take. The corner of the track bar is the Dusk token `--r-bar` (section 14, repair 6).

**Gaps in Dusk 0.2.0 that the sketch filled with page-local rules.**

1. Target size. `.dusk-btn` is 29 px high and a `.dusk-seg` button is 24 px. Rules `.yd-t44` and `.yd-seg44` set 44 px.
2. A window with no sidebar. `.dusk-win` has two columns. Rule `.cb-win > .dusk-main` spans both.
3. A select. Dusk has no select or input part. Rule `.cb-select`.
4. A main button. Dusk has one button weight. Rule `.cb-btn--key` takes the hover tokens of the button for "Work it ▸".
5. A message slot (the banner). Rule `.cb-banner`.
6. A small chip of text (the rule chips). Rule `.cb-chip`.
7. A details block. Rule `.cb-how`.
8. `.dusk-legend i` and `.dusk-legend b` restyle every `i` and `b` inside a legend. A legend with other marks must undo that.

**Deviations from the brief of R1.**

1. No track bar in the wide view. In the first round the bar under each track read as a second track, and a number above a block met the bar of the track above (seen in the first picture; the vertical need was 79 px against a pitch of 67.6 px). In the wide view the picture is to scale, so the line between the tick and the first car is the room. The row view keeps the bar.
2. The free part of the bar is not `--hair-2`. **[measured]** `--hair-2` on `--glass` is 1.46 to 1. The bar is a hollow slot with a `--ink-3` edge (7.11 to 1) and a solid `--ink-2` part.
3. The label column has up to three short lines ("AS73 ‖ TIED", "⚡ KICKABLE", "BUILD 3 / 4"), not one line. A narrow column gives ax 1.038. In the first round (one line, the view from x = 0) the 5-figure numbers did not fit in a box car block.
4. The wide view starts at x = 40 units, not at 0, for the same reason. 48 units of lead stay visible at the left of the engine.
5. The text is DOM text over one inline SVG of lines. The brief says one inline SVG. DOM blocks take the Dusk tile gradients and the type tokens directly.
6. The label "15 MPH · REDUCED (CROR 105)" is in the head bar of the panel. The head bar has no `.dusk-count`. The two count chips of the page are "3 / 4" and "par 6".
7. The lead label is under the lead in the wide view. Above the lead it met the words of the AS71 switch at 1280 px.
8. The foul point word is at the right of its tick. Under the tick it was inside the 44 px target of the switch.
9. Reverse is a solid diamond and normal is a hollow diamond. The brief gives the colour and the gap only. The fill is one more carrier with no colour.
10. The status bar gives the six switch linings. The brief asks for "a lamp beside a word" and names no content.

## 7. Measurements

Tool: Playwright 1.63.0, Chromium 157.0.8103.78, Linux. UI text drew in Inter and figures in DejaVu Sans Mono (the last names of the Dusk font stacks that this machine has). On another machine the widths of words differ. Scripts: `measure.mjs`, `verify.mjs`, `stress.mjs` in the scratch folder. No timing was measured.

| Check | 1440 | 390 |
|---|---|---|
| View | wide | rows |
| Diagram | 1416 by 543 px | 366 by 723.5 px |
| Page height | 1545 px | 3442 px |
| Sideways page scroll | none (scrollWidth 1440) | none (scrollWidth 390) |
| Interactive elements seen | 20 | 20 |
| Smallest target | 44 by 44 px | 44 by 44 px |
| Corner over 6 px on a control | 0 | 0 |
| Smallest text | 11 px | 11 px |
| Smallest car number | 12 px | 12 px |
| Words, blocks or targets of the diagram that touch | 0 | 0 |
| Parts of the diagram outside the frame | 0 | 0 |
| Car numbers above their block | 0 | 0 |
| Tab order of the switches | AS71 to AS76 | AS71 to AS76 |
| Lowest text contrast | 4.55 to 1 | 4.55 to 1 |
| Text pairs under 4.5 to 1 | 0 | 0 |
| Console errors | 0 | 0 |
| Picture with motion off against motion on | the same (equal hash) | the same (equal hash) |

The 20 elements: Home, picker, Reset, sound, six switches, four action buttons, two selects, "Work it ▸", "▶ Watch optimal", the summary, "Look it up →". The skip link is not in the count; it is off screen until it has focus.

**Keyboard and pointer [measured, both widths].** Space on AS73: `aria-pressed` true to false; name "AS73 switch, lined normal"; the word beside the switch "AS73 NORMAL"; head bar "Route: LEAD → MAIN LINE"; the strip cell and the status bar change; the live line reads "AS73 switch, lined normal. Route: LEAD → MAIN LINE."; the landing block goes; the focus stays on AS73. Enter puts all of it back. A pointer click 3 px inside a corner of the 44 px target of AS75 changes it.

**Words [measured, both widths].** Equal to the scene, string for string: the work order top, job, target and hint; the banner; the readout (as the name of the strip; its three figures in cells); the picker group and option; the four actions; "cars"; the six tracks; the count option; the four buttons; "← Home"; the six titles; the legend line; the eight chips; the three labels of the drawing; the refusal text and "Look it up →". The 13 car numbers on the diagram are the 13 of the scene. The six switch names and pressed states are those of the scene.

**Colour [measured].** `token-lint.mjs` on the source: 0 hex, 0 colour functions, 0 colour names. A second check of the own style block and script (the scene object taken out): 0. No `style` attribute in the markup. Every `var()` of a Dusk name is a name that `dusk.tokens.css` declares (51 names, 0 unknown).

**Contrast [measured]** with `contrast()` of `/home/user/dusk/lib/color.mjs`. Each text node against the ground under it, at the worst end of a gradient, with washes laid over. The lowest and the most used pairs:

| Ink | Ground | Ratio | Smallest size |
|---|---|---|---|
| `--on-tile` car number | the light end of `--tile-grey` | 4.55 | 12 px bold |
| `--violet-ink` tag TK | `--glass` | 5.82 | 11 px |
| `--blue-ink` tag AR | `--glass` | 5.85 | 11 px |
| `--red-ink` refusal | `--well` | 5.94 | 13 px |
| `--red-ink` "?" | `--glass` | 5.86 | 14 px |
| `--grey-ink` tag BX | `--glass` | 6.02 | 11 px |
| `--ink-3` strip label | `--wash-2` over the strip (key cell) | 5.56 | 11 px |
| `--ink-3` sub-line | `--head` | 6.52 | 12 px |
| `--amber-ink` REVERSE, LOOSE | `--glass` | 7.10 | 12 px |
| `--ink-3` status bar | `--glass-side` | 7.17 | 11 px |
| `--teal-ink` tag HP | `--glass` | 7.75 | 11 px |
| `--lit` button word | the hover fill of the main button | 7.76 | 12 px |
| `--green-ink` NORMAL | `--glass` | 8.47 | 12 px |
| `--ink-2` labels, state words | `--glass` | 11.54 | 11 px |
| `--lit` BUILD | `--glass` | 12.11 | 12 px |
| `--ink` empty car number | `--well` | 17.92 | 12 px |

Lines and marks, on `--glass`: `--ink-3` 7.11, `--ink-2` 11.54, `--lit` 12.11. Edge of an empty block on `--well`: grey 6.10, teal 7.87, violet 5.91, blue 5.94. Light end of a loaded block against `--glass`: 4.26 to 4.37. The contrast script does not see an SVG line under a word. The overlap check shows that no word of the diagram is over another part, and each label on a line has a plate.

**Other widths [measured].**

| Viewport | View | Result |
|---|---|---|
| 320 | rows | no sideways scroll, no overlap; 4 numbers above their blocks on AS73 |
| 360, 768, 1024, 1200 | rows | no sideways scroll, no overlap, all numbers in their blocks |
| 1210, 1220, 1240 | wide | no overlap; every 5-figure number, the two tank numbers of AS72 and the word ENGINE above their blocks |
| 1280, 1300, 1340, 1360 | wide | no overlap; 7 numbers above their blocks, in two heights: the 5 standing empty box cars, the held car, the landing block |
| 1366, 1380, 1440, 1920 | wide | no overlap, all numbers in their blocks |

These rows are the values after the repairs of section 14 **[measured by the reviewer]**. Before repair 4 the numbers were inside the blocks from 1290 px, but they were almost on the edge line (1.0 px of room on each side at 1300 px).

So the clean wide view needs a viewport of 1366 px or more with this font. From 1210 to 1360 px it is correct but less calm. Under 1210 px the page uses the row view.

**Longest cuts [measured, scratch copy only].** `stress.mjs` put the longest standing cut and the longest held cut of the authored lines (from the frozen engine) into a scratch copy. At 390: no overlap, no sideways scroll; diagram 897.5 px high. At 1440: the engine is off the frame at x = −319, the collision rule finds it, and the page uses the row view. The wide view has no answer of its own for a long held cut.

## 8. Reading modes

| Mode | Check | Result |
|---|---|---|
| Text scale | All Dusk type tokens set to 130 percent in the test | **[measured]** 1440: the wide view collides, so the page uses the row view; no overlap, no sideways scroll, targets 44 px. 390: rows; no overlap; numbers stand above their blocks and the rows grow. |
| Dyslexia type | DejaVu Sans, letter spacing 0.06 em, word spacing 0.16 em (no dyslexia typeface is on this machine) | **[measured]** No overlap and no sideways scroll at both widths. At 1440 the 7 box car numbers stand above their blocks. A real dyslexia typeface: not verified. |
| Reduced motion | `prefers-reduced-motion: reduce` | **[measured]** The picture is the same, byte for byte. The sketch has one transition (the hover wash of a switch) and stops it. |
| High contrast | The app's own setting is a token change in the bridge file (R3). | Not verified. `.cb-yard` has `forced-color-adjust: none`, so a forced palette of the system cannot remove the solid fill of a loaded car. In the test the browser reported forced colours as active, but the picture did not change, so this is not verified. |

The diagram draws again when the width changes and when the type changes. Two hidden probes watch the type. In the app, a change of a reading mode must start the same new layout.

## 9. Where each motion has room

Static form first: the still picture of this sketch is the state between two moves. The dashed landing block is the static form of "what the called move does".

| Motion | Room in this look |
|---|---|
| Move (pull, spot) | Blocks travel on the lined route. Both views give a continuous monotonic map along the lead, the ladder and each track. In the wide view blocks turn on the ladder. |
| Couple | Two blocks that touch are one cut. The static form is the touch. A short closing of the last gap has room on the line. |
| Kick | One block leaves the held cut and travels alone on the lit route to the dashed block. Static form: the dashed block and the legend entry "KICK 1 to AS73". |
| Switch throw | The diamond changes fill, the gap changes leg, the word changes. Static form: the same three. |
| Arrival | The through route is the main line, the ladder and the lead. All three are in both views (top to bottom in the row view). |
| Departure | Out by the lead: to the left edge in the wide view, to the bottom in the row view. |

Hard for motion: in the row view the middle piece of a track is not to scale, so a block at constant logical speed changes its screen speed twice on one track. The held cut is a stack of upright blocks on the lead and a line of blocks on a track, so a block changes its shape at the foot.

## 10. How the build job would draw it

Recommended form for this look: one SVG for the lines (lead, ladder, tracks, ticks, route, ring) and DOM elements for everything with text (blocks, numbers, tags, labels, switch buttons, bars). R2 decides the technology; this is what the look needs from it.

- All colour comes from CSS classes on tokens. The script holds no colour and reads none. A canvas version must read each token with `getComputedStyle` and must draw the tile gradients itself.
- A switch is a DOM button in every case, so focus, `aria-pressed` and the 44 px target cost nothing.
- The layout is a function of (scene state, lined map, width, type size). It runs again on a width change and on a type change.

What is hard:

1. Two layout paths (affine and rows) and the rule that selects one. The sketch uses a collision test after a trial layout. The build job needs the same test, or a width limit that depends on the font.
2. The number fit. A 5-figure number in a 42 unit block needs ax of about 0.98 or more with the font of this machine. The font of the owner's machine is different: not verified.
3. A long held cut in the wide view (the engine leaves the frame; `R1-yard-visual-language.md` section 4.5 item 3). The sketch falls back to the row view. A better answer needs design work: for example a second linear piece for x under 0 with a "⋯" mark.
4. The row view when one track holds 8 cars (limit 2 of section 4).
5. The phone layout of the page (limit 1 of section 4).
6. Motion on the row view (section 9).
7. The refusal ring needs the id of the switch at fault. Today the engine gives a text only. The sketch takes the first word of the text. The build job must not parse a message; it can call `routeReady()` logic on the lined map (`model.js:66-75` is frozen and can be read, not changed).
8. The glyphs ⚡, ▶ and ◄ are emoji code points on some systems. The sketch sets `font-variant-emoji: text` so they draw in token ink. **[measured]** This Chromium supports the property. Other browsers: not verified. The sound glyph 🔊 stays a colour picture; it is outside the Dusk tokens.

## 11. Not verified

- The look on the owner's machine and browser (fonts, emoji, 1440 and 390).
- A real forced-colours or high-contrast mode, and the app's own high-contrast setting on Dusk tokens.
- A real dyslexia typeface.
- A screen reader. The names and the hidden list were read from the DOM by script, not heard.
- A touch device. The 44 px targets were pressed with a mouse pointer in the test.
- A track with 8 box cars with 5-figure numbers at 390 px (the scratch test had 8 autoracks with 4-figure numbers).
- A centerbeam car on the diagram. The scene has none. The legend shows its tone and tag.
- A track with one car, the arrival, the departure, the switch-list check, the win banner: not in the scene, not drawn.
- The web was not used in this job. No finding here has a web source.
- Colour-vision deficiency: this job did no new measurement. It relies on R1 (F28).

## 12. Notes for the SME

This job proposes no rule wording. Each note is a question about a mark or a word that a learner could take for a rule.

- P1. The sketch keeps the app sentence "yellow = lined into the track / diverging, green = normal" (`yardSim.js:190-191`) and draws reverse in `--amber-ink` and normal in `--green-ink`. Same question as R1 note S1.
- P2. The status bar has a green lamp beside "NORMAL" and an amber lamp beside "REVERSE" for each switch. Could a learner take a green lamp for a signal indication or for permission to move?
- P3. The lit route line stops at the first standing car, and the dashed block shows where the kicked car stops. Does this picture agree with what a crew expects of a kick onto a standing cut? The positions are output of the frozen engine.
- P4. The words "foul point" stand at one tick. The legend calls the tick "foul point". Same question as R1 note S3 on the term.
- P5. The legend names the car types "box, hopper, tank, centerbeam, autorack" (the keys of `geometry.js`). The "How to play" text says "centrebeam". Which words and which spelling are correct for the learner?
- P6. The "How to play" text says "Rule 112", "Rule 113.5", "Rule 113.2". The chips say "CROR 112", "CROR 113.4 / 113.5", "CROR 113.0 / 113.2". The sketch copies both without change. Is the difference in naming intended?
- P7. The refusal example rings the AS73 switch, because the app text names AS73. In that state the movement would enter AS72 first. Which switch must the picture mark?
- P8. The row view shows the lead under the yard and the label "◄ DEPARTURE · LEAD / DRILL" beside it. Is a lead drawn downward a problem for a learner who knows the lead as "left" from the wide view?
- P9 (reviewer). The tag LOOSE or TIED is one tag for a whole track. In this scene AS72 holds one lone car (70222) and, 42 units from it, a cut of two tank cars. The frozen engine set the whole track to "not secured" when the lone car was spotted there (`model.js:150-155`, decision D-0029). The sketch copies that state: "AS72 ■ LOOSE". A learner cannot see which of the two cuts the word is about. Is one tag for a track correct for the learner?
- P10 (reviewer). The scene file says that the next authored move wins the job (`nextMove.afterIt.jobWon` is true) while AS72 still reads LOOSE. The sketch shows only the state before that move. Is a won job with a LOOSE track the intended lesson? **[measured]** The reviewer replayed the fourth move with the frozen engine: `checkWin` gives true, and AS72 holds 3 cars with `secured` false. The win check reads the goal track only (`model.js:254`).

## 13. Notes for the lead

1. In the present app the kind of an S.I. chip is carried by colour only: the cites "Loads & empties" and "Kickable tracks" do not hold the word S.I. (`puzzles.js`, frozen). The sketch adds the tag "S.I." from the legend line. This is one new label on two chips.
2. The work order line "(now on AS73, AS71)" is false in this scene (R1, section 4.5 item 4). The sketch copies it.
3. The strip cell "Route" and the head bar of the Yard panel say the same words. The brief asks for both. One of them can go.
4. The builder controls of the sketch do nothing, except that an action button takes the pressed state. Only the six switches work.
5. Other agents changed files under `specs/research/` in the same tree during this job. This job wrote only the five files named at the top. `git status` shows no change under `src/` or `public/`. The SHA-256 values of `geometry.js`, `model.js`, `puzzles.js` and `solver.js` are equal to the values in `scene.source.files`.
6. The helper lines of this file are for an agent. They are not for the owner.

## 14. Eye review

An independent reviewer did this section. The reviewer did not build the sketch. Date: 2026-11-20. Tree at commit `069f90e`, branch `claude/peaceful-mayer-qat99l`. The reviewer wrote the five files of this job only. The scratch folder of the review is `/tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/critic-panel/`. The scripts there are new and do not use the scripts of the designer: `replay.mjs`, `win.mjs`, `m.mjs`, `static.mjs`, `lines.mjs`, `kb.mjs`, `words.mjs`, `forced.mjs`, `fonts.mjs`, `facts.mjs`, `el.mjs`.

Result words: **pass**, **repaired** (what changed), **open** (why). Each number is a result of a script of the review, unless the line says "not verified". Tool: Playwright with Chromium, Linux. UI text drew in Inter and figures in DejaVu Sans Mono (read with `CSS.getPlatformFontsForNode`). No timing was measured. The web was not used.

### 14.1 The repairs

All six repairs are in `look-panel.src.html`. After the last repair the reviewer built `look-panel.html` with `inline-dusk.mjs`, took both pictures with `shot.mjs --scale 2`, and looked at both.

| # | Defect found | Evidence | Repair |
|---|---|---|---|
| 1 | Refusal example. The red "?" beside the ring stood on the ladder line in the wide view. In the row view it stood 7.6 px from the word BUILD, and the eye read "? BUILD 3 / 4". | `lines.mjs`; pictures at both widths | The "?" is up and left of the ring. Wide view: on no line, 10.8 px from the words "AS73 NORMAL". Row view: left of the spine, 41.6 px from the nearest word. |
| 2 | Row view. A plate with a grey "⋯" cut the lit route on the lined track. The brief asks for one continuous lit line. In this look a gap in a line also means an open switch leg. | picture at 390 | On the lined track the break mark has the route ink `--lit`. Other tracks keep the mark in `--ink-2`. |
| 3 | Row view. The bar of the lead had its taken part at the left. The track bars and the legend ("room", bar, "cars") have it at the right. The held cars are at the yard end of the lead. | picture at 390 | The taken part of the lead bar is at the right, the yard end. |
| 4 | Number fit. The test used rounded widths. From 1290 to 1360 px it kept a 5-figure number in a block with about 1 px of room on each side (at 1300 px: number 34.9 px, block 38.9 px with its edge line, room 1.0 px on each side). In the picture the number is on the edge line. | `facts.mjs` at 1300; picture | The test uses true widths. A number stays in a block when it has 3 px or more to the outer edge of a block with an edge line, or 1.5 px or more to the edge of a solid block. The result is the same at pixel ratio 1 and 2. Numbers stand above their blocks from 1210 to 1360 px, and inside from 1366 px. At 125 percent text the loaded 5-figure number (70222) also stands above its block; before, in the picture, it filled the block from edge to edge. |
| 5 | Wide view. The word ENGINE touched the headlight dot at 1280 px (overlap 0.6 px). In the picture of the dyslexia test at 1440 px the two also touch. | `m.mjs` and `facts.mjs` at 1280; pictures | The engine block keeps the left 9 px or more for the dot. The fit test knows this. At 1280 px the gap from the dot to the word went from −0.6 px to 4.7 px. At 1440 px it went from 2.8 px to 8.4 px (the word moved 5.6 px to the right). From 1210 to 1240 px the word stands above the block. |
| 6 | Own CSS had a raw corner value (2 px) in three places. Dusk has a token for a bar corner. | reading | The track bar uses `--r-bar`. The legend line has no corner. |

The pictures changed only where a repair is: at 1440 the two engine blocks and the "?"; at 390 the break mark, the bars, and the "?" (pixel difference of the old and new pictures, by region).

### 14.2 The ten checks

**Check 1. Truth of the scene: pass.**

- `replay.mjs` built puzzle p4-peel from `puzzles.js:317-334` with the frozen engine, lined the switches, and made the first 3 authored moves. Compared with `scene.json`: moves, joints, the lined map, the secured map, the kickable list, the held car, and for each track the cars, their order, type, load state and position. 0 differences. The landing place of the next move (`spotPlan`) is equal. The refusal text of the engine is equal to `scene.refusalExample.text`.
- `m.mjs` read the built page at 1440 and 390. Each of the 13 cars (12 standing, 1 held) is drawn one time with the correct tag, tone and load class. The order along each track is correct. Cars of one cut touch. The two cuts of AS72 do not touch. AS71 is the lowest track. The six switch buttons have the pressed state and the name of the scene. 0 differences.
- `words.mjs`: the work order (4 lines), banner, readout, picker, the 4 actions, "cars", the 6 tracks, the count, the buttons and their titles, the legend line, the 8 chips, the 3 drawing labels and the refusal text are equal to the scene, string for string, at both widths. The note and the "How to play" block are equal to `yardSim.js:183-209`.
- Controls against `yardSim.js:144-173`. Lost: none. Renamed: none. The action select is four segment buttons (the brief permits it). Reset and the sound button are in the strip (the brief). "Depart ▸" is hidden in the app for this puzzle and is absent here. Added: the six switch buttons (they replace the canvas click), the skip link, and "Look it up →" in the refusal example (the app shows it in a refusal).
- Open, small: the app sets "special instruction", "this" and "you must know your yard's." in italic or bold (`yardSim.js:176-180`). The sketch does not. The scene file holds the line as plain text. The words are equal.
- Open, known: the work order says "(now on AS73, AS71)". That is false in this scene (AS71 is empty). It is the text of the app, which does not change during play. The sketch copies it. The owner can read it as an error of the sketch.

**Check 2. The inventory: pass, with the items below.** Each element was looked for in the final pictures.

| Items | Result |
|---|---|
| D1, D3 to D9, D11, D12, D14, D15, D17 to D26 | pass. Each one reads at both widths. D14: the tick is `--ink-2`, not red, and only the tick of the lined track has the words (the brief). D22: the tag is under the block (the brief). |
| D2 | pass. The frame is the lit edge of a Dusk panel with an 8 px corner. The 12 px corner and the drop shadow of the app are gone. |
| D10 | pass. The label is in the head bar of the Yard panel, not on the drawing. |
| D13 | not drawn, by the brief. A solid diamond, the word REVERSE and the joined leg carry the state. |
| D16 | pass. TIED and LOOSE are beside the track id, 12 px. AS71 (no car) has no tag. A track with one car is not in the scene. |
| D27 to D31 | not drawn. The sketch is a still picture (common rule 7). Section 9 says where each motion has room. "▶ Watch optimal" is there and does nothing. |
| Pointer | pass. Six real buttons. Checked with a pointer at 3 px inside a corner, with Space and with Enter. |
| C1 to C4, C6, C9 to C12 | pass. |
| C5, C7 | not in this puzzle. Not drawn. The notes say where they go. |
| C8 | pass for the tones ok and bad. The tones none and win are not drawn. |
| Item 45 | route mark, switch word, engine word, goal mark, landing place, text alternative: all there. Car count: none (the brief asks for none). Capacity mark: row view only. |

Open: the wide view (1440) has no capacity bar. The brief asks for a bar under each track at both widths. The designer removed it because it read as a second track (deviation 1 of section 6). The reviewer agrees: in the wide view the picture is to scale, and the bare line from the tick to the first car is the room. The owner sees a bar in the 390 picture and no bar in the 1440 picture.

**Check 3. The two-second read: pass at 1440, pass with limits at 390.** From the final pictures.

At 1440:

- Each car and its order: reads. 12 px bold figures in blocks, 43.6 px for a box car.
- Each switch: reads. Word, solid or hollow diamond, and the gap in the open leg.
- The lit route: the strongest thing in the picture. One gold line from the held car to the dashed block.
- The engine: reads by its word. It is small and at the far left.
- Tied against loose: reads in the label column. "‖ TIED" is grey and "■ LOOSE" is amber.
- The goal: the weakest of the six. "BUILD 3 / 4" is the third line of the AS73 label. A learner finds it in more than two seconds.

At 390:

- Cars, order, switches, route, engine, tied and loose: all read. Each block is 44.9 px or more.
- The first screen (844 px high) shows the title bar, the strip, and the tracks AS76 to AS73. The strip with the picker takes 201 px. The diagram is 723.5 px high and starts at 355 px. AS72 is cut by the screen edge. AS71, the lead and the engine (at 1017 px) are below the first screen. "Work it ▸" is at 1707 px, 629 px below the end of the diagram.

What a first-time learner can misread:

1. The dashed block "70110" at the end of AS73. A learner can count four cars on AS73, or can see car 70110 in two places. The legend says "KICK 1 to AS73" beside a dashed block. The chip says "3 / 4".
2. The tick near each switch. It looks like a small cross on the track. Only one tick has the words "foul point". A learner can take it for a second switch or for a signal.
3. The gold line. A learner can take a lit line for permission to move. The word "Route" is in the head bar and the strip, not on the line.
4. "AS72 ■ LOOSE" is one tag for a track with two cuts (note P9).
5. The headlight dot in front of the word ENGINE looks like a list bullet or a status lamp.
6. The green lamps beside NORMAL in the status bar can read as "safe" (note P2).
7. Row view: the arrow "◄" of the lead label points left, and the lead runs down (limit 3 of section 4).
8. Row view: the solid part of a track bar is shorter than the blocks over it, because the blocks are not to scale and the bar is. The mark "⋯" and the legend say so. At 390 the legend starts at 1078 px, 685 px below the first track.
9. Row view: the bar of the lead has no word beside it. It can read as a progress bar.

None of the nine was repaired. Each one needs a new label or a change of the look, and the brief permits neither to the reviewer.

**Check 4. Self-contained: pass.** `static.mjs`: one file, 2 style blocks, 1 script block. No link, no script source, no import, no remote address. The one "http" string is the SVG namespace name in the script. The page made 0 requests when it loaded. The block marked `data-dusk` holds the six files of `/home/user/clear-board/src/styles/dusk/` byte for byte, in the Dusk load order; the rest of the block is the six marker comments of the helper. The built file is equal to the source with the marker replaced.

**Check 5. No raw colour: pass.** `token-lint.mjs` on the final source: 0 hex, 0 colour functions, 0 colour names. No `style` attribute in the markup. The own CSS and script use 65 token names; each one that is not `--cb-*` is declared in `dusk.tokens.css`. The scene object in the page is equal to `scene.json`.

**Check 6. Dusk laws: pass, with four open items for the lead.**

- Tile colour is a category: pass. The five car tones use the tile tokens, and the tag is always there.
- Chip and state colours are states: pass. NORMAL green, REVERSE amber, LOOSE amber, TIED grey, each with a word and a glyph or a shape.
- Red is attention only: pass. Red is in the refusal example only (ring, "?", banner edge, refusal text).
- No state by colour or glow alone: pass. The route is a thick line and words. A lamp has its word beside it.
- No pill: pass. No interactive element has a corner over 6 px.
- Parts as `ARCHITECTURE.md` describes them: title bar, thread, strip with cells and a key cell, strip end with controls, framed panels with head bars, count chips, segment, state words, flags, legend, status bar with lamps beside words, skip link first: pass.
- Repaired: a raw corner value (repair 6).
- Open 1: gold is on the route, the engine edge and word, the goal word and the landing block. The brief orders each one. Dusk says gold is chrome and selection, never a state. The decision is with the lead (see the end of section 5).
- Open 2: "Work it ▸" has a second button weight (`.cb-btn--key`). Dusk has one.
- Open 3: the head bar of the Yard panel ends with the speed label. Dusk says a head bar ends with a count or a control. The brief asked for a count chip there.
- Open 4: the page needs its script for all text of the diagram, the work order and the rules. Dusk rule 2 ("no text depends on JavaScript") does not hold. The designer said so in section 2.
- Seen, not a defect of this sketch: at 390 the strip wraps, and the cell "Route" on the second line keeps the short left rule of Dusk (`dusk.components.css:303`). It is a Dusk behaviour and will show in each look.

**Check 7. Measured at 1440 and 390: pass.** Final build, `m.mjs`, `kb.mjs`, `lines.mjs`.

| Measure | 1440 | 390 |
|---|---|---|
| View | wide | rows |
| Page width against window | 1440 of 1440, no sideways scroll | 390 of 390, no sideways scroll |
| Interactive elements seen | 20 | 20 |
| Smallest target | 44 by 44 px | 44 by 44 px |
| Step between two switch buttons | 72.6 px across, 70.2 px down | 92 px down (110.5 px at AS73) |
| Smallest text | 11 px (`--fs-xs`) | 11 px |
| Smallest car number | 12 px | 12 px |
| Console errors | 0 | 0 |
| Lowest text contrast | 4.55 to 1 (`--on-tile` on the light end of `--tile-grey`) | 4.55 to 1 |
| Text under 4.5 to 1 | 0 | 0 |
| Parts of the diagram that overlap | 0 | 0 |
| Parts of the diagram outside the frame | 0 | 0 |
| Words that lie on a line with no plate | 0 | 0 |
| Tab order of the switches | AS71 to AS76 | AS71 to AS76 |
| Focus ring on a switch | 2 px, visible in the picture | 2 px, visible in the picture |

The contrast script takes each visible text node, the ink colour, and the ground of the nearest ancestor that holds the text and has a fill, at both ends of a gradient, with `contrast()` of `/home/user/dusk/lib/color.mjs`. It does not see the glyphs that CSS writes before a state word; they have the ink of the word. It does not see a line under a word; `lines.mjs` checks that.

Space on AS73 at both widths: pressed true to false, the name "AS73 switch, lined normal", the word beside the switch, the head bar "Route: LEAD → MAIN LINE", the strip cell, the status bar and the live line all change; the landing block goes; the focus stays. Enter puts it back.

**Check 8. Motion off and text at 125 percent: pass.**

- Motion off: the pictures at 1440 and 390 are equal to the pictures with motion on, pixel for pixel (scale 1).
- Text at 125 percent (each Dusk type token times 1.25): at 1440 the wide view does not fit and the page uses the row view. At both widths: no sideways scroll, no overlap, no clipped text, nothing blank, targets 44 px. The 5-figure numbers stand above their blocks.
- A dyslexia-like setting (DejaVu Sans, letter spacing 0.02 em, word spacing 0.08 em, the values of the app): no overlap and no sideways scroll at both widths; wide view at 1440. A real dyslexia typeface: not verified.
- Open: high contrast. With the forced-colours setting of Playwright the page reports forced colours as active, and 0.7 percent of the pixels change at 1440 (measured on the build before the repairs). Nothing is blank. This is not a test of a real contrast theme, and the high-contrast setting of the app on Dusk tokens does not exist yet. Not verified.

**Check 9. "SME to confirm": pass.** The legend has the flag on five meanings: car type tones, NORMAL and REVERSE, the route, the foul point, TIED and LOOSE. The lamps of the status bar use the two switch colours and have no flag of their own. Rule numbers on the page: "CROR 105" in the copied label, the cites of the 8 chips, "CROR 104" in the copied refusal text, and the numbers in the copied "How to play" block. Each one is text of the app for this puzzle. The sketch adds no rule text and no rule number.

**Check 10. The direction is still itself: pass.** The wide view is a track diagram: thin lines, plain blocks, state in words, one lit route, no pictorial detail. The row view is the re-projection that the brief orders; it keeps the spine and the lit route. The repairs changed no structure.

### 14.3 What the owner must know before the pick

1. The 1440 picture is the best case of this look. The clean wide view needs a window of 1366 px or more with the font of this machine. From 1210 to 1360 px the 5-figure numbers stand above their blocks in two heights. Under 1210 px, and at 125 percent text, the page uses the row view of the 390 picture, drawn wide. The owner sees none of these states in the two pictures.
2. The fit of a 5-figure number depends on the mono font of the machine. The font of the owner's machine: not verified.
3. On a phone the diagram is 723.5 px high. The first screen shows four of the six tracks and not the engine. The move builder is below the diagram and its legend. A person must scroll between the switches and "Work it ▸".
4. The row view does not show car length by block width. Two puzzles teach length. The bar is the only length cue there.
5. The refusal example is a second small picture with the flag "SKETCH ONLY". It is not a state of the main diagram.
6. Only the six switches work. The builder does nothing.

### 14.4 Not verified by the reviewer

- The look on the owner's machine and browser.
- A real high-contrast or forced-colours mode.
- A real dyslexia typeface.
- A screen reader and a touch device.
- A centerbeam car, a track with one car, a long held cut, the arrival, the departure, the switch-list check and the win banner: not in the scene.
- The stress test of the designer with 8 autoracks (section 7): not run again.
- Colour-vision deficiency: no new measurement.
