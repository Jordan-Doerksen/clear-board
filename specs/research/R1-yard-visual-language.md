# R1. Yard visual language

Clear Board 2, Wave 1, research. Date: 2026-11-20. Branch `claude/peaceful-mayer-qat99l`, commit `1e48578`.
Read-only on code and content. This file is the only file that R1 wrote in the repository.

## 1. Summary

1. Sources agree on one point: a yard diagram that reads at a glance shows topology and order, not distance. It writes capacity as a number or a bar. It writes switch state as geometry and a word.
2. The colours of real dispatcher displays differ by vendor and by decade. No source gives one convention. A colour in the Yard must have a word beside it.
3. The present drawing has 31 visual elements and 12 chrome parts. Section 4 lists each one with file and line. The drawing carries switch state by colour and glow only. It has no car count, no capacity mark, no goal mark and no route mark.
4. The shared scene is puzzle `p4-peel` after 3 of its 4 authored moves, with the route lined for move 4. It shows 4 car types, loaded and empty cars, the engine with one car, one reverse switch, four TIED cuts, one LOOSE cut, a gap between two cuts and a kickable track. The frozen engine produced every value.
5. Three look directions are ready for the designers: A "panel", B "list", C "model". They differ in data use, in drawing technology and in phone strategy. The three seeds stay. Research refined each one.
6. Measured: at a 390 px viewport the present canvas is 352 px wide. A car number is 2.36 px high. The switch hit radius is 4.73 px.
7. Measured: under simulated red-green colour-vision deficiency, the Dusk green, amber and red inks come as near as 8.1 (CIEDE2000). Dusk holds 15 for normal vision. Words must carry every state.

## 2. Method and limits

- Web search was reachable. Page fetch was not: `trainweb.us`, `friendstm.org`, `en.wikipedia.org` and `jmri.org` did not resolve from this session. R1 stopped after four failures. To open these pages, the session network settings must allow the hosts.
- For that reason each web finding below is from the summary that the search tool gave for the listed page. R1 did not open the page. The tag is **[search summary]**. Treat the detail as "not verified against the page".
- **[measured]** is a measurement by an R1 script. **[read]** is a fact read in a repository file at the given line. **[model knowledge, not verified]** has no source.
- Scripts, pictures and the scene are in the scratch folder `/tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/R1/`. Nothing there is in the repository.
- R1 ran no `npm` command and no git command that changes something. `git status` shows only the untracked folder `specs/research/`.

## 3. Part 1. Findings

### 3.1 Track schematics, dispatcher panels and dispatch displays

| # | Finding | Source | Status |
|---|---|---|---|
| F1 | One software dispatch display shows a lined route in green with a direction arrow, an occupied track in red with a direction arrow, a stored route in orange, and track under a work authority in blue or lavender. | https://trainweb.us/southwestshorts/wscdigicon1.html | [search summary] |
| F2 | A requested route flashes until the field confirms it. Then it is steady. | Search results for "CTC dispatcher panel track diagram colors"; the summary did not name the page. Candidates: https://trainweb.us/southwestshorts/wscdigicon1.html , https://www.trainmountain.org/ctc/cs-gjct.htm | [search summary], page not identified |
| F3 | A 1959 push-button CTC console used an amber lamp for track occupancy and lunar white lamps for switch position. | https://jonroma.net/media/signaling/railway-signaling/1959/Pushbutton%20console%20for%20CTC.pdf | [search summary] |
| F4 | One model board shows grey for a vacant track and red for an occupied track. | https://friendstm.org/Signals/ModelBoardDescription.shtml | [search summary] |
| F5 | JMRI Layout Editor gives each block three track colours: unoccupied, occupied, and an alternate colour for "allocated but not occupied". Occupied wins. A JMRI bug report says that red for occupancy must have priority. | https://jmri.org/help/en/package/jmri/jmrit/display/LayoutEditor.shtml , https://bugs.launchpad.net/bugs/515063 | [search summary] |
| F6 | SimSig users objected when a failed track circuit and an occupied track had the same red. | https://www.simsig.co.uk/Forum/PostView/45458 | [search summary], low confidence |
| F7 | Rail Route condenses long plain runs between busy places into a "shortcut". It does not draw them at length. It shows allocated track in green. | https://steamcommunity.com/app/1124180/discussions/0/3069747783696267676 , https://gamedev.net/blogs/entry/2269575-rail-route-a-train-dispatcher-simulator-graphics-update | [search summary] |
| F8 | A symbol library for track schematics has a turnout with an optional fouling point indicator, an option for the points position (left, right, moving), and a buffer stop. | https://ctan.csail.mit.edu/graphics/pgf/contrib/tikz-trackschematic/tikz-trackschematic-symbology-table.pdf | [search summary] |
| F9 | On many panel diagrams the selected leg of a turnout is continuous and the other leg has a gap. | none | [model knowledge, not verified] |

What this gives the Yard:
- F1, F3, F4: three sources, three colour sets. There is no one panel convention to copy. A legend and a word define each colour.
- F5, F6: when two states meet on one line, one must win, and one colour must not mean two things.
- F7: a schematic can compress an empty run. Direction A uses this at 390 px.
- F8, F9: the points position is geometry. The fouling point is a mark at the turnout.

### 3.2 Switch lists and yard paperwork

| # | Finding | Source | Status |
|---|---|---|---|
| F10 | A track check records for each car: initials and number, loaded or empty, and type. A switch list marks where each cut is made and gives the destination track for each group of cars. Crews count the cars of each cut. | https://armytransportation.tpub.com/TR0636/Freight-On-Hard-86.htm , https://armytransportation.tpub.com/TR0636/Switch-List-81.htm | [search summary] |
| F11 | A switch list can be abbreviated: no initials, or only the last 3 digits of the number, with a note of where each car goes. | https://opsig.org/Resources/Primer_Switchlists | [search summary] |
| F12 | JMRI OperationsPro lines are "pick up" or "set out", then road, number, type, load and track. A two-column form puts pulls in one column and spots in the other. A switch list is organised by location. | https://www.jmri.org/help/en/package/jmri/jmrit/operations/Operations.shtml , https://largescalecentral.com/t/trainops-to-jmri/69335 | [search summary] |
| F13 | The X12 423 "Rail Industrial Switch List" carries car identity, placement, pull and destination. | https://www.stedi.com/edi/x12-005040/423 | [search summary] |
| F14 | A page of printed switch list styles exists (a railway form, a belt railway form, a typed short-line form). R1 did not get its detail. | https://www.vasonabranch.com/railroad/switchlist-examples.html | [search summary] |

What this gives the Yard:
- The identity of a car is its mark and number. Load state is a column, a letter, not a colour.
- A cut is a counted group with one destination.
- The goal of a job is a destination beside each car. Direction B uses this.
- The present drawing already drops the initials (`render.js:169`). F11 shows that this is real practice. It also shows the risk: a shorter number can collide.

### 3.3 Switching puzzles

| # | Finding | Source | Status |
|---|---|---|---|
| F15 | Inglenook Sidings: three sidings that hold 5, 3 and 3 wagons, and a headshunt for 3 wagons and the engine. Eight wagons. The goal is a train of 5 wagons in a given order. Tokens drawn at random give the order. | https://en.wikipedia.org/wiki/Inglenook_Sidings , https://arxiv.org/abs/1810.07970 | [search summary] |
| F16 | In the mathematical model of the puzzle, one move is two engine movements: into a siding, then back to the headshunt. Wagons are never left across the points. | https://arxiv.org/abs/1810.07970 | [search summary] |
| F17 | Timesaver: the capacity of each spur and siding, in cars, is "critical to the game". | https://en.wikipedia.org/wiki/Timesaver , https://forum.trains.com/t/john-allen-time-saver/186220 | [search summary] |

What this gives the Yard:
- Capacity is the puzzle, and both puzzles state it as a count for each track. The present drawing states no capacity.
- The goal is an ordered list of car identities beside the layout.
- The lead has a capacity too. In the Yard it is `LEAD_CLEAR` = 558 units (`geometry.js:56`). The present drawing does not show it.

### 3.4 Rail games and simulators

| # | Finding | Source | Status |
|---|---|---|---|
| F18 | Derail Valley: a switch sign shows the set direction with a diagonal white line on a red ground. The sign moves when the switch changes. Players print yard maps because the in-game map is not a yard view. | https://manual.derailvalley.com/wiki/Switches_%26_Switch_Signs , https://steamcommunity.com/app/588030/discussions/0/3730702146117073944 | [search summary] |
| F19 | Railroader: a switch list window. A player reports that delivered cars are crossed out. Players throw switches in the map mode and ask for one master list of cars. | https://gameplay.tips/guides/railroader-guide-to-set-up-a-switch-list-signals-meaning.html , https://steamcommunity.com/app/1683150/discussions/0/4030224579615293120 | [search summary], player reports |
| F20 | Train Sim World: players use the map to throw switches and report that it is not reliable. | https://steamcommunity.com/app/530070/discussions/0/133261369998611169 | [search summary], player reports |
| F21 | Andy's Trains Pocket (phone): tap a switch to change it, tap a coupler to uncouple, drag the engine. The goal is to sort wagons into an order. | https://apps.apple.com/us/app/id1031077250 | [search summary] |
| F22 | Transum Shunting Puzzles (browser): items are coloured circles. A later version added an option to name the colours. | https://www.transum.org/software/shunting | [search summary] |

What this gives the Yard:
- F18: a switch state reads from the shape or direction of a sign. A colour change alone is not the carrier.
- F19, F20: players want a list and a map. Each one alone leaves a gap.
- F21: on a phone, a direct tap on the switch is the usual control.
- F22: a colour-only identity got a text option later. Start with the text.

### 3.5 Clearance and foul points

| # | Finding | Source | Status |
|---|---|---|---|
| F23 | One railway's customer safety page describes fouling as equipment left so near a switch that a movement on the next track has no safe clearance. It describes a painted clearance marker. | https://cn.ca/en/stories/20220908-keeping-employees-customers-safe | [search summary]; see Notes for the SME |
| F24 | Fouling point signs and markers are sold as products. | https://aldonco.com/product-category/signs-and-lights/fouling-point | [search summary] |

What this gives the Yard: in the field the mark is a thing at a place. A tick across the track with a word is a fair picture of it. R1 proposes no colour meaning for it.

### 3.6 Colour vision and targets

| # | Finding | Source | Status |
|---|---|---|---|
| F25 | Red-green deficiency is the most common inherited form. It affects about 8 percent of men. | https://www.hse.gov.uk/PUBNS/web03.pdf | [search summary] |
| F26 | Guidance for categories: do not use colour as the only channel; add a shape, a pattern or a label; keep to about seven categories. | https://data.europa.eu/apps/data-visualisation-guide/colour-for-categories , https://www.datawrapper.de/blog/colorblindness-part2 | [search summary] |
| F27 | WCAG 2.2: target size 24 by 24 CSS px at level AA (2.5.8) and 44 by 44 CSS px at level AAA (2.5.5). | https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced , https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html | [search summary] |
| F28 | Dusk tones under simulated colour-vision deficiency: see the table below. | `scratchpad/R1/cvd.mjs` | [measured] |
| F29 | The present drawing at a 390 px viewport: see section 3.8. | `scratchpad/R1/drive-app.mjs` | [measured] |

F28, CIEDE2000 between two Dusk tokens. Simulation: Machado, Oliveira and Fernandes 2009, full severity, in linear RGB. Distance: `deltaE2000` of `/home/user/dusk/lib/color.mjs`. Token values: `src/styles/dusk/dusk.tokens.css`. A simulation is a model. It is not a test with people.

| Pair | Use in the looks | Normal | Protan | Deutan | Tritan |
|---|---|---|---|---|---|
| `--green-ink` and `--amber-ink` | switch normal and reverse | 39.5 | 13.7 | 15.4 | 55.2 |
| `--green-ink` and `--red-ink` | normal and refusal | 66.8 | 18.9 | 9.3 | 68.8 |
| `--amber-ink` and `--red-ink` | reverse or LOOSE and refusal | 32.0 | 16.2 | 8.1 | 11.4 |
| `--amber-ink` and `--wall-4` (`--lit`) | reverse and the lit route | 15.1 | 15.9 | 14.4 | 13.8 |
| `--green-ink` and `--wall-4` (`--lit`) | normal and the lit route | 35.7 | 6.2 | 14.5 | 50.2 |
| `--violet-ink` and `--blue-ink` | tank and autorack | 18.3 | 3.1 | 1.8 | 18.1 |
| `--grey-ink` and `--teal-ink` | box and hopper | 25.8 | 13.6 | 6.9 | 17.7 |
| `--grey-ink` and `--violet-ink` | box and tank | 15.0 | 15.9 | 15.1 | 11.6 |
| `--green-ink` and `--teal-ink` | normal and hopper | 18.2 | 21.4 | 24.4 | 3.3 |
| `--amber-ink` and each of grey, teal, violet, blue | centerbeam and the other types | 40.9 to 60.8 | 30.0 to 60.1 | 37.2 to 61.6 | 33.1 to 60.0 |

Contrast on the floor `--glass` (WCAG 2, normal vision) [measured]: `--ink-3` 7.11, `--ink-2` 11.54, `--ink` 17.67, `--wall-4` 12.11, `--green-ink` 8.47, `--amber-ink` 7.10, `--red-ink` 5.86, `--grey-ink` 6.02, `--teal-ink` 7.75, `--violet-ink` 5.82, `--blue-ink` 5.85. White on each cap light end: 4.55 to 4.67.

### 3.7 What makes each thing readable at a glance

| Thing | What carries it in the sources | What the Yard looks use |
|---|---|---|
| Car identity | Mark and number as text (F10). Abbreviation is common (F11). | The number as mono text, 12 px or more. The full mark in the text mirror. |
| Car type | A column in the list (F10, F12). A shape in a game. | The tag (BX, HP, TK, CB, AR), the true length, and a category tone. In C also a shape. |
| Loaded or empty | A column, a letter (F10). | Solid or hollow. The frozen words say so (`puzzles.js:18`). |
| Order in a cut | Order of the lines (F10). Order on the track. | True order, throat first. |
| Coupled cut and separate cars | A marked cut with a count (F10). | Cars of one cut touch. A gap separates two cuts. |
| Engine and what it holds | A distinct piece at the end of the cut (F15, F21). | A distinct object with the word ENGINE, then the held cars in order. |
| Switch and its lining | Geometry of the legs (F8, F9). A sign that turns (F18). A lamp (F3). | The joined leg, the word NORMAL or REVERSE, then a colour. |
| Route from engine to track | One coloured line with a direction (F1, F7). | One continuous carrier from the engine to the first car, and the words "Route: LEAD → AS73". |
| Clearance or foul point | A mark at the turnout (F8). A physical marker (F23, F24). | A tick across the track and the words "foul point". |
| Track capacity | A count for each track (F15, F17). | A true-proportion bar. A car count where it is exact. |
| Secured and not secured | No source found. | The words TIED and LOOSE with a glyph. |
| Goal of the job | An ordered list of cars (F15). A destination for each car (F10, F12). Done lines crossed out (F19). | The work order words, the word BUILD on the goal track, a count "3 / 4". |

### 3.8 What fails on a phone, and what survives colour-blind viewing

Fails on a phone [measured on the built app, viewport 390 by 844, `drive-app.mjs`]:

| Measure | At 1440 | At 390 |
|---|---|---|
| Canvas width in CSS px | 882 | 352 |
| CSS px for each logical unit | 0.658 | 0.263 |
| Car number (9 units, `render.js:171`) | 5.92 px | 2.36 px |
| Type tag (6.5 units, `render.js:175`) | 4.28 px | 1.71 px |
| Track label (13 units, `render.js:139`) | 8.56 px | 3.41 px |
| Switch hit radius (18 units, `yardSim.js:290`) | 11.85 px | 4.73 px |
| Distance between two switches (87.2 units) | 57.4 px | 22.9 px |

- A uniform scale of a 1340 by 460 drawing cannot work at 390 px. Two 44 px targets cannot stand 22.9 px apart.
- Text on the drawing is under 6 px at both widths.
- A pan gesture inside the page competes with the page scroll.
- Information that needs hover does not exist on a phone.

Survives colour-blind viewing: position, the joined leg of a switch, words, glyph shapes, solid against hollow, length, order, and bright against dim (`--wall-4` at 12.1 to 1 against `--ink-3` at 7.1 to 1).

Does not survive (F28): green against amber against red (8.1 to 15.4 under deutan simulation), violet against blue (1.8), grey against teal (6.9), green against gold under protan simulation (6.2).

## 4. Part 2. The inventory of the present drawing

Files read: `src/stations/yard/render.js` (215 lines), `anim.js` (29), `geometry.js` (127, frozen), `model.js` (273, frozen), `puzzles.js` (388, frozen), `src/stations/yardSim.js` (718). Each row below is [read] at the given line. The new drawing must still carry each row, or say where it went.

### 4.1 The drawing (canvas)

| # | Element | What it is today | Where |
|---|---|---|---|
| D1 | Floor | One fill of the full canvas. | `render.js:22-23` |
| D2 | Frame | A border, a 12 px corner and a shadow around the canvas. | `yardSim.js:60-63` |
| D3 | Size and scale | A fixed 1340 by 460 unit drawing. CSS scales it to the column width. The pixel ratio is capped at 2. | `geometry.js:5`, `yardSim.js:64`, `yardSim.js:234-235` |
| D4 | Main line | A dim line, width 3, from the AS76 switch off the top right. | `render.js:82`, `geometry.js:28-29` |
| D5 | Ladder | Dim lines, width 3, from the foot through the six switches. | `render.js:84-85`, `geometry.js:15-22` |
| D6 | Lead / drill | A line, width 4, from off the frame at the left to the foot at x 300, y 372. | `render.js:87`, `geometry.js:9-11` |
| D7 | Body tracks | Six lines, width 4, AS71 (lowest) to AS76, each from its switch to x 1292. No end stop. | `render.js:89`, `geometry.js:17-24` |
| D8 | Label | "◄ DEPARTURE · LEAD / DRILL", above the lead at the left. | `render.js:92` |
| D9 | Label | "MAIN LINE → the road", at the top. | `render.js:93` |
| D10 | Label | "15 MPH · REDUCED (CROR 105)", at the top right. | `render.js:94` |
| D11 | Label plate | A dark rounded plate behind each label, so a rail or a car does not hide it. 12 px mono. | `render.js:98-105` |
| D12 | Switch target | A diamond with a 14 unit side at each switch. Green fill for normal, yellow fill for reverse. No word. | `render.js:112-122`, called at `render.js:30` |
| D13 | Switch glow | A yellow disc of radius 13 at 25 percent, only when reverse. | `render.js:124-127` |
| D14 | Clearance tick | A red tick, 18 units high, 30 units from each switch on the body track. No word. No tick on the lead. | `render.js:130-134`, called at `render.js:29`, `geometry.js:35` |
| D15 | Track id | "AS71" to "AS76", 13 px mono, right of each track end. | `render.js:139` |
| D16 | TIED or LOOSE | A 10 px tag under the track id. Shown only when the puzzle has the rule `secure` or `kick` and the track holds 2 or more cars. TIED is yellow, LOOSE is red. A single car has no tag. | `render.js:26`, `render.js:144-148` |
| D17 | Kickable mark | "⚡ KICKABLE", 9 px, yellow, under the other tags, on each track in `state.kickable`. | `render.js:150` |
| D18 | Car | A rounded block, 20 units high, with the length of its type (box 42, hopper 47, tank 50, centerbeam 61, autorack 75), at the position that `model.js` keeps. | `render.js:154-167`, `render.js:189-199`, `geometry.js:43-50` |
| D19 | Car type colour | One fill and one edge colour for each type. | `geometry.js:44-48`, `render.js:164-166` |
| D20 | Load state | Loaded: solid fill, dark number. Empty: dark body, outline and number in the type colour. | `render.js:164-170`, `model.js:12`, `model.js:25` |
| D21 | Car number | The last word of the mark ("70110" of "CN 70110"), bold mono, 9 units, reduced to 6 units when it does not fit. The initials are not drawn. | `render.js:168-173` |
| D22 | Type tag | BX, HP, TK, CB or AR, 6.5 units, at the top corner of the throat end. | `render.js:174-176`, `geometry.js:44-48` |
| D23 | Cut and gap | Cars of one cut touch. A gap of 42 units separates two cuts. There is no coupler mark; the gap is bare track. | `model.js:82`, `model.js:95-99` |
| D24 | Engine | A dark rounded block, 64 by 24 units, with a cyan edge. No word. | `render.js:158-160`, `geometry.js:34` |
| D25 | Headlight | A warm dot of radius 2.6 at the end of the engine away from the cars. | `render.js:161-162` |
| D26 | Held cut | The cars that the engine holds follow it on the lead, toward the yard. The engine rests farther left when the cut is longer. | `render.js:47-49`, `render.js:204-214`, `geometry.js:58-62`, `geometry.js:81` |
| D27 | Move animation | The engine runs lead, foot, ladder, track and back. 600 ms in, 600 ms out. After a pull, a 280 ms stretch of 6 units. Cars turn with the route. | `yardSim.js:316-382`, `anim.js:4-29`, `geometry.js:72-79` |
| D28 | Shove animation | A branch that slides a standing cut. `spotPlan` always returns `shove: false`, so this branch does not run today. | `render.js:193-196`, `yardSim.js:331`, `model.js:102` |
| D29 | Arrival cinematic | Only on a puzzle with `inbound` (p6-road). A road train (engine, 6 cars, the set-out cars, 5 cars) comes in on the through route and stops. The set-out cars slide into their track. The train leaves by the lead. 2200, 1100 and 1700 ms, with a forced end at 5800 ms. The player's engine is not drawn and input is off while it runs. | `yardSim.js:270-282`, `yardSim.js:286`, `render.js:33-45`, `render.js:55-78`, `geometry.js:86-91` |
| D30 | Departure run | On a depart goal, the engine and its cut run out by the lead in 1300 ms. | `yardSim.js:508-524` |
| D31 | Watch optimal | The app lines each route and plays the authored line at 1.7 times the normal duration, with pauses of 520, 420 and 320 ms. | `yardSim.js:401-429` |

Pointer: a click on the canvas changes the nearest switch within 18 units. A click does nothing while a move or the cinematic runs. The switch sound plays. (`yardSim.js:285-296`.) There is no hover state, no pointer cursor on the canvas, no focus and no key handler.

### 4.2 The chrome (DOM)

| # | Part | Words and behaviour | Where |
|---|---|---|---|
| C1 | Back button | "← Home". | `yardSim.js:144` |
| C2 | Picker | A native select, grouped by tier label. Option: "✓ " or "→ ", the title, " · par N", and " · your best Nm" when a record exists. | `yardSim.js:147`, `yardSim.js:682-712`, `puzzles.js:25-33` |
| C3 | Readout | "Moves M / par P · Joints J". | `yardSim.js:149`, `yardSim.js:432` |
| C4 | Work order | Top line "WORK ORDER <ID> · <title>". Job line "Build <track> — gather <numbers> onto it (now on <tracks>)." or the depart form. Target line "Target N moves (par) — fewest moves wins." Then the hint. | `yardSim.js:621-634` |
| C5 | Switch-list check | Only p2-list. "SWITCH LIST <ID> · the list can be wrong", rows with ▢ or ⚑, mark, →, track, the button "Certify order ▸". After it: "WORK ORDER ✓ <track> · verified" with "(list was wrong)" beside a corrected line. | `yardSim.js:562-618` |
| C6 | Move builder | Action PULL, SPOT, KICK, SECURE; a count; the word "cars"; a track; "Work it ▸"; "▶ Watch optimal"; "Reset"; the sound button 🔊 or 🔇. The count is off and dim for SECURE. | `yardSim.js:156-172`, `yardSim.js:532-547` |
| C7 | Depart | "Depart ▸". Shown only on a depart goal. Off until the outbound is built. | `yardSim.js:168`, `yardSim.js:258`, `yardSim.js:437` |
| C8 | Banner | Four tones: none, ok, bad, win. A refusal that cites a rule number adds the button "Look it up →". The texts come from `model.js` and from `yardSim.js:386`, `411`, `438`, `446`, `502`, `514`, `590`, `606`. | `yardSim.js:636-660` |
| C9 | Legend line | "Rules in play — CROR = the national rulebook (applies everywhere) · S.I. = a special instruction, specific to this yard — you must know your yard's." | `yardSim.js:176-180` |
| C10 | Rule chips | One chip for each rule of the puzzle: the cite in bold mono, then the label. Kind `cror` has a blue left edge. Kind `si` has a yellow left edge and wash. | `yardSim.js:549-558`, `puzzles.js:9-20` |
| C11 | Note | "What this trainer builds" and its paragraph. | `yardSim.js:183-185` |
| C12 | How to play | A closed details block. It states the colour meaning of the switch target and the meaning of ⚡. | `yardSim.js:187-209` |

### 4.3 What the present drawing does not have

R1 looked for each of these and did not find it in `render.js` or in `yardSim.js`:

- A count of cars on a track or on the engine.
- A mark or a figure for track capacity, or for the capacity of the lead (`LEAD_CLEAR`, `geometry.js:56`).
- A goal mark on the canvas. The goal is in the work order words only.
- A mark of the lined route. Only the six diamonds show the lining.
- A word for the switch state. Colour and glow are the only carriers (D12, D13).
- A word on the engine.
- A mark of the cars that the selected move takes, or of the place where they land.
- A text alternative of the canvas. Measured: the canvas has no `tabindex`, no `role`, no `aria-label` and no fallback text.

### 4.4 The plan's facts T2, T3 and T12

| Fact | Result | Evidence |
|---|---|---|
| T2 | True, with one corrected figure. The drawing is 1340 by 460 and CSS scales it. At a 390 px viewport the canvas is 352 px wide, so a 9 unit number is 2.36 px. The plan says about 2.6 px; that figure assumes a canvas 390 px wide. | `geometry.js:5`, `yardSim.js:64`, `render.js:171`; [measured] `drive-app.mjs` |
| T3 | True. The click handler is at `yardSim.js:285`. The radius is 18 units (`yardSim.js:290`): 4.73 px at 390, 11.85 px at 1440. The canvas cannot take focus. Six key presses (Enter, Space, two arrow keys, 1, 3) changed no pixel of the canvas. The Yard has 10 controls in the tab order and one hidden button (Depart); the canvas is not one of them. There is no text mirror. | [read]; [measured] `drive-app.mjs` |
| T12 | True. `render.js:2` reads "YELLOW diverging target (CROR yard convention)". R1 found no evidence for the claim and does not repeat it as true. The same colour meaning is told to the learner at `yardSim.js:190-191`. | [read] |

### 4.5 Other facts found in the same reading

These are outside the subject of R1. They go to the lead.

1. `yardSim.js:229` sets the animation speed factor to 6 for reduced motion, and its comment says "≈ instant". `anim.js:17` multiplies the duration by the factor. With a fake clock, a 600 ms step ended after 608 ms at factor 1, 1024 ms at factor 1.7, and 3600 ms at factor 6 (`check-anim.mjs`). So the code makes each move 6 times longer, not shorter. Fact T4 of the plan says "6 times faster". R1 did not time it in the running app with the setting on: not verified in the app.
2. The tag "⚡ KICKABLE" is cut at the right edge of the canvas. It starts at x 1302 and the canvas ends at 1340. The picture `present-canvas-1440.png` shows "⚡ KICKA".
3. With a long cut the engine is off the frame. Computed from `geometry.js:60-62`: with 6 box cars (252 units) the engine centre is at x -14; with 4 autoracks (300 units) it is at x -62; at the lead limit (558 units) it is at x -320. A new view must show the lead to the left of x 0, or show the held cut in another way.
4. The work order is built from the start layout and does not change (`yardSim.js:623-626`). In the scene it reads "(now on AS73, AS71)", but AS71 is empty and car 70110 is on the engine. This is a false statement on screen during play. It belongs to R4.
5. Dusk control sizes [read]: `.dusk-btn` has a minimum height of `--row-h` (29 px) and a `.dusk-seg` button has `--ico-size` (24 px) (`dusk.compose.css:160-178`). `.dusk-tile` has a minimum height of `--tile-h` (138 px) (`dusk.compose.css:280-286`). A 44 px target and a car-size tile need page-local size rules. This belongs to the gap register of R3.

## 5. Part 3. The shared scene

File: `/tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/look/scene.json` (35,631 bytes).

### 5.1 The choice

`survey.mjs` replayed every prefix of every authored opt line (19 puzzles) and counted the inventory items in each state. The best state is `p4-peel` at k = 3.

| Puzzle, k | Car types | Loaded and empty | Engine holds | TIED tracks | LOOSE tracks | Kickable | Gap between cuts | Rule chips |
|---|---|---|---|---|---|---|---|---|
| p4-peel, 3 of 4 | 4 | yes | 1 | 4 | AS72 | AS73 | 1 | 8 |
| p2-types, 3 of 4 | 5 | no | 1 | 2 | AS72 | AS73 | 1 | 7 |
| p4-loads, 1 of 2 | 4 | yes | 2 | 5 | none | AS73 | 0 | 8 |

`p2-types` has the fifth car type (centerbeam) but no empty car and no `loads` rule chip. R1 chose `p4-peel`. The centerbeam type is in `scene.geometry.carTypes` for the legend.

### 5.2 The state

- Puzzle `p4-peel`, "Don’t slam a load into empties", tier 4, par 6.
- Moves replayed: PULL 3 from AS71, KICK 1 to AS73, SPOT 1 to AS72. Then the player lines the route for move 4: AS72 to normal, AS73 to reverse.
- Readout: "Moves 4 / par 6 · Joints 2". Banner: "Spotted 1 to AS72."
- Engine: at rest on the lead, centre x 120, y 372. It holds CN 70110 (box, empty).
- AS71: empty. AS72: CN 70222 (box, loaded), a gap of 42 units, GATX 8810 and GATX 8828 (tank, loaded); LOOSE. AS73: CN 70134, CN 70010, CN 70028 (box, empty); TIED; kickable; the goal track; switch reverse. AS74: SHPX 6610, SHPX 6628 (hopper, loaded); TIED. AS75: ETTX 9001, ETTX 9020 (autorack, loaded); TIED. AS76: CN 81002, CN 81044 (box, empty); TIED.
- Next move of the opt line: KICK 1 to AS73. It is legal in the scene. It wins the job: "✓ Par! 6 moves — 2 couplings, clean".
- Not in the scene: a centerbeam car, a track with one car, the arrival cinematic, the departure run, the switch-list check, a long held cut.

### 5.3 How it was produced

`make-scene.mjs` imports `geometry.js`, `model.js`, `puzzles.js` and `solver.js` from the repository and changes no file.

1. `freshState(puzzle)`.
2. For each of the first 3 moves of `puzzle.opt`: line the route with the real `lineSwitch()` (a toggle), as a player must, then call the real `pull`, `kick` or `spot`. The script stops if the engine refuses.
3. On a copy of the state, ask the engine about move 4 before relining. The refusal text is in `scene.refusalExample`.
4. Line the route for move 4 with `lineSwitch()`. Ask the engine about move 4 again: it is legal.
5. Read positions from `state.pos`, `switchPos()`, `trackY()`, `restS()` and `polyAt()`. Read the landing place of move 4 from `spotPlan()`.
6. Cross-check: `replay()` of `solver.js` on the full opt line gives ok, 6 moves, 2 joints. Par is 6 and `optJoints` is 2.

The file holds: the puzzle; the 10 replay steps; the state (lined map, secured flags, each track with its ordered cars, each car with id, number, type, tag, load state, length and resting position); the engine and its cars; the lined route as a polyline; the goal and its progress; the words of the work order, readout, banner, picker, builder, legend and canvas labels; the 8 rule chips; the next move and its result; a refusal example; the words that bind the drawing; and the geometry (W, H, the lead, the foot, switch positions, track y values, track ends, clearance points, car lengths, all route polylines). Fields under `derived` and the lined route are computed by R1 from engine values and are marked so.

### 5.4 Checks

- [measured] `drive-app.mjs` drove the built app at http://127.0.0.1:4173/#/yard to the same state through its own controls (the picker, six canvas clicks on switches, the move builder). The work order, readout, banner, picker label, legend and the 8 rule chips in the app are equal, string for string, to the scene file. This ran at 1440 and at 390.
- [measured] `selftest.mjs` drew the scene from `scene.json` alone, with no import from the repository. The picture `selftest.png` agrees by eye with the app picture `present-canvas-1440.png`: same cars, same places, same lining, same tags.
- The frozen files at the time of the run (SHA-256, first 12 characters): `geometry.js` 49bc3f5e0703, `model.js` 144ec6862179, `puzzles.js` 633cc6056cdc, `solver.js` e547180bca95. The full values are in `scene.source.files`.

### 5.5 How to reproduce

From any folder: `node /tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/R1/make-scene.mjs` writes the scene file again. `node .../R1/survey.mjs` prints the choice table. `node .../R1/drive-app.mjs` repeats the app check and writes `app-facts.json` and the present pictures. `node .../R1/selftest.mjs` writes `selftest.html`. `node .../R1/cvd.mjs` prints the colour distances. `node .../R1/check-anim.mjs` prints the animation durations. These lines are for an agent. They are not for the owner.

## 6. Part 4. Three look directions

### 6.1 The seeds

R1 keeps the three seeds. No source gave a better fourth direction. Research changed each seed in one way:

- A, "panel": the phone view compresses empty runs (F7), and the open leg of a switch has a gap (F8, F9).
- B, "list": each goal car carries its destination, as a real switch list does (F10, F12), and a true-proportion bar carries capacity (F15, F17).
- C, "model": the phone view uses three fixed cameras, because a uniform scale fails at 390 px (section 3.8) and a rotation breaks the app word "below" (`yardSim.js:203`).

### 6.2 How the three differ in structure

| | A, panel | B, list | C, model |
|---|---|---|---|
| What it takes from the scene | Positions, with separate x and y factors | Order, lengths and cut boundaries only | Positions, with one uniform scale |
| Drawing | One SVG schematic | No drawing: a table of rows and tiles | One SVG (or canvas) model with DOM text |
| Route | One lit line | A lit spine and a hot row | Bright rails and chevrons |
| Car | Plain block, mono figure | Capped tile | Shape by type |
| Switch state | Gap in the open leg, word beside the node | Word in a button in the row | Point blades, word on a plate |
| Capacity | Proportion bar under each line | `.dusk-heat` bar and car count | True length in the picture |
| Strategy at 390 px | Re-project: vertical spine, rows, break marks | Stack: the table reflows | Pan and zoom: three fixed cameras |
| Stage for motion | The lines | Row changes only | The model |
| Text mirror | Separate | The table is the mirror | Separate |

### 6.3 The briefs

Each brief below is complete alone. Each one ends with the same common rules. The designers receive the brief text, the inventory of section 4 and the scene file.

#### Brief: panel

```text
DIRECTION A, "panel": the yard as a dispatcher track diagram.

Idea. A dispatcher panel shows topology, not distance. Thin lit lines on the near-black floor. The lined route is one lit line from the engine to the track. A car is a plain block with a mono figure. Each switch has its state in words beside it. The picture drops every pictorial detail.

Structure.
- One window (`.dusk-stage--app` with `.dusk-win`): title bar and thread; a strip of readings; one framed panel that holds the diagram; then the work order panel, the move builder, the banner and the rule chips; a status bar.
- The diagram is one inline SVG. At 1440 it uses the true positions of the scene with an affine view transform that has separate x and y factors: x' = ax * x + bx, y' = ay * y + by. Choose ay larger than ax so that the track pitch (52 units) becomes 60 px or more. The ladder becomes steeper. That is correct for a schematic. Reserve a label column of about 170 px at the right of the track ends, so that no label is cut (the present drawing cuts "⚡ KICKABLE" at the canvas edge).
- A car block has the length len * ax and a fixed height of 26 px.

How each inventory element reads.
- Tracks, lead, ladder, main line: 2 px lines in `--ink-3` (measured 7.1 to 1 on `--glass`). The main line leaves at the top right with its label. The lead leaves at the left with its label. The label "15 MPH · REDUCED (CROR 105)" stays at the top right.
- Lined route: the polyline scene.state.linedRoute.points drawn 4 px in `--lit` with one still glow (define the glow one time in the bridge block). It runs from the far end of the held cut, along the lead, up the ladder, through the reverse switch, to the first standing car of AS73. The words "Route: LEAD → AS73" are in the panel head bar. An unlined track stays thin and dim.
- Switch: a node at the junction. The closed leg is joined. The open leg has a 6 px gap at the node, so the geometry shows the lining without colour. Beside each node, on the empty side at the left of the ladder, is the text "AS73 REVERSE" or "AS72 NORMAL" in mono 12 px. REVERSE is `--amber-ink`, NORMAL is `--green-ink`. The node is the visible mark of a 44 px `<button>` laid over it.
- Foul point: a 2 px tick in `--ink-2` across each track at clearanceX. The words "foul point" label the tick of the lined track only. The legend names the tick.
- Car: a block. Loaded is a solid fill in the type tone (`--tile-<tone>`) with the number in `--on-tile`. Empty is a hollow block on `--well` with a `--<tone>-ink` edge and the number in `--ink`. The number is mono 12 px, inside the block when it fits and above it when it does not. The type tag is 11 px under the block at its throat end.
- Cut: the cars of one cut touch. A gap in the line separates two cuts (AS72 has a gap of 42 units between 70222 and 8810).
- Engine: a block on `--head` with a `--lit` edge and the word ENGINE. The headlight is a small `--lit` dot at the end away from the cars (scene.state.engine.headlight). The held car 70110 is the next block.
- TIED, LOOSE, KICKABLE, track id: in the label column at the right of each track, one line: "AS73 ‖ TIED ⚡ KICKABLE", "AS72 ■ LOOSE", "AS71".
- Goal: in the label column of AS73, the word BUILD and the chip "3 / 4". The landing place of the next move (scene.nextMove.landing) is a dashed block outline in `--lit`.
- Capacity: a 3 px bar under each track line, in true proportion: the occupied part in `--ink-2`, the free part in `--hair-2`. No figure.
- Refusal: show it as a second small picture or as a state toggle. The banner takes scene.refusalExample.text with the glyph ? in `--red-ink` and the button "Look it up →". The node of the switch that causes it has a red ring.
- Arrival and departure: the road train runs on the through route (scene.geometry.polylines.throughRoute). The departure runs out on the lead. Both have room in this view. Draw neither.

Strategy at 390 px: re-project. Do not scale the picture (at 390 the present drawing gives a car number of 2.4 px).
- The ladder becomes one vertical spine at x = 28 px. From the top: the main line stub with its label, then the nodes AS76 down to AS71, then the foot, then the lead continues down with the held cars (one block for each car, the car at the far end nearest the foot), then the engine, then the label "◄ DEPARTURE · LEAD / DRILL". AS71 stays below AS76.
- Each track is one horizontal row to the right of its node, 80 px or more high: the 44 px switch button on the spine, the words "AS73 REVERSE ‖ TIED ⚡ KICKABLE" on one line, then the track line with its blocks. The blocks stand in true order, throat at the left, each 36 px or more wide. The empty part of the track becomes a break mark "⋯". The block width is not in proportion at this width, so the true-proportion bar under each row is mandatory here.
- The lit route keeps one continuous line: up the lead, up the spine, right along the row of AS73.
- The mapping from logical units to this view must be continuous and monotonic along each polyline, so that a later animation can run on it.

Dusk parts. `.dusk-titlebar` (brand, crumb "Yard / Don’t slam a load into empties"), `.dusk-thread`. `.dusk-strip`: key cell "Job P4-PEEL", then Moves 4, par 6, Joints 2 (the readout split into cells; the three labels keep their words), then "Route LEAD → AS73"; `.dusk-strip-end` holds Reset and the sound button. `.dusk-panel--framed` for the diagram: head bar with the name "Yard", the sub-line with the route words, and a `.dusk-count`. `.dusk-panel--framed` for the work order with a `.dusk-count` "par 6". `.dusk-seg` for PULL, SPOT, KICK, SECURE or native selects, and `.dusk-btn`. `.dusk-state` words for TIED, LOOSE and the banner. `.dusk-status` with a `.dusk-led` beside a word.

Tokens. Floor `--glass`; panel `--panel-fill` with `--neon`; rails `--ink-3`; route `--lit`; labels `--ink-2`; figures `--font-mono`; car tones as in the common rules.

Switch by pointer and by keyboard. Six `<button>` elements, absolutely placed over the nodes, 44 by 44 px. At 1440 the step between two nodes is 70 units * ax across and 52 units * ay down; two 44 px squares do not overlap when one of the two steps is 44 px or more. Check it. Tab order AS71 to AS76; Space or Enter changes the lining; the text beside the node changes with it.

Risks.
- The gold route can merge with the gold panel edges. Keep the route thicker than the chrome line and keep it away from the frame.
- Two layouts (affine at 1440, re-projected at 390) are two code paths.
- At 390 the block width does not show the car length. Two puzzles (p5-long, p5-room) teach length. The proportion bar must be clear.
- The switch words on the diagonal ladder can collide with the lead label near AS71.
- A reader can take a lit line on a panel for a signal or for permission to move. The words say "Route".

COMMON RULES (the same text is in each of the three briefs)

1. The data. Read the scene file /tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/look/scene.json and embed its content in the page as one JavaScript object. Draw from that object only. Do not type a coordinate, a car, a count or a state by hand. The scene is puzzle p4-peel ("Don’t slam a load into empties") after 3 of its 4 authored moves, with the route lined for move 4. Units are the logical units of geometry.js: W 1340, H 460, x to the right, y down. geometry.js never changes. Your look is a view transform on top of these units.

2. The words. Copy every word from scene.words, scene.ruleChips and scene.state. Change no word and no figure. This covers the work order (top line, job line, target line, tip), the readout "Moves 4 / par 6 · Joints 2", the banner "Spotted 1 to AS72.", the picker label, the move builder (PULL, SPOT, KICK, SECURE, the word "cars", the six track names, "Work it ▸", "▶ Watch optimal", "Reset", the sound button), the legend line, the eight rule chips, and the three labels of the drawing ("◄ DEPARTURE · LEAD / DRILL", "MAIN LINE → the road", "15 MPH · REDUCED (CROR 105)"). A new label that the present app does not have (for example NORMAL, REVERSE, ENGINE, BUILD, "foul point") is permitted only where this brief names it. List every new label in your report.

3. Words that bind the drawing (scene.wordsThatBindTheDrawing). Loaded is solid and empty is hollow. The glyph ⚡ marks a kickable track. A standing cut of 2 or more cars reads TIED or LOOSE; a single car shows no tag. A car is called by its number (the last word of its mark). A track nearer the lead is below a track farther from the lead, and the ladder runs up. Each switch has a visible target.

4. Colour. Use Dusk tokens only. If you need a value that Dusk does not have, put it in one `:root` block with the comment "bridge" and list it in your report. The meanings and their tokens:
   - Car type (a category): box `--tile-grey`, hopper `--tile-teal`, tank `--tile-violet`, centerbeam `--tile-amber`, autorack `--tile-blue`; the matching `--<tone>-ink` is the edge of an empty car. The type tag (BX, HP, TK, CB, AR) is always on screen. Measured under simulated red-green colour-vision deficiency, violet and blue are 1.8 to 3.1 apart (CIEDE2000) and grey and teal are 6.9 apart, so the colour does not carry the type alone.
   - Load state: no colour. Loaded is a solid fill. Empty is a hollow outline on `--well` with the number in `--ink`.
   - Switch normal: `--green-ink` and the word NORMAL. Switch reverse: `--amber-ink` and the word REVERSE. Both colours are "SME to confirm". The word is always there.
   - Lined route: the look's own carrier (see the brief), in `--lit` or `--ink`, and the words "Route: LEAD → AS73".
   - Foul point (the present red tick at 30 units from each switch): `--ink-2`, a tick, and the words "foul point" at least one time. It is red only inside a refusal.
   - TIED: `--ink-2` with the glyph ‖ (`.dusk-state--hold`). LOOSE: `--amber-ink` with the glyph ■ (`.dusk-state--caution`).
   - Kickable: `--ink-2`, the glyph ⚡ and the word KICKABLE.
   - Engine: a `--lit` edge (`--neon-ctl`) on `--head`, and the word ENGINE.
   - Goal: `--lit`, the word BUILD and a `.dusk-count` chip with "3 / 4" (from scene.state.goalProgress).
   - Refusal: `--red-ink` with the glyph ? (`.dusk-state--attn`) and the refusal words. Red has no other use.
   - Rule chip kind: the words CROR and S.I. carry it. No category colour.

5. A colour or a glow is never the only carrier of a state. Each state has a word or a glyph beside it. Gold light (`--lit`, `--neon`) is chrome and selection. Do not use gold for a state.

6. Sizes. No text is smaller than 11 px (`--fs-xs`). A car number is 12 px or more. Each pointer target is 44 by 44 px or more. In Dusk, `.dusk-btn` has a minimum height of 29 px and a `.dusk-seg` button has 24 px. Add a page-local size rule (class prefix `yd-`) and list it in your report as a gap. No pill shape on a control: 6 px corner or plain text. No sideways page scroll at 390 px and at 1440 px.

7. The static state first. The sketch is a still picture of the scene. It needs no animation. Reduced motion must leave the same picture. Say in your report where each motion (move, couple, kick, arrival, departure) has room in your look.

8. Reading modes. The layout must hold when text is scaled up, when a dyslexia typeface is set, in high contrast, and with motion off. Put text in elements that grow with the text. Do not put text in a bitmap.

9. Switch control. Each of the six switches is a real `<button>` with `aria-pressed` (true is reverse) and a name of the form "AS73 switch, lined reverse". A pointer presses a target of 44 px or more. A keyboard reaches the six buttons with Tab in the order AS71 to AS76, and Space or Enter changes the lining. The lined state is also in text that a screen reader reaches.

10. The deliverable. One self-contained HTML file with inline CSS and inline JavaScript and no external file. Write a source file with the single marker line <!--DUSK-LAYERS--> in the head, then run: node /tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/tools/inline-dusk.mjs <input.src.html> <output.html> . The helper copies the six Dusk layers byte for byte. Do not rebuild Dusk. Take pictures at 1440 and 390 with: node /tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/tools/shot.mjs <output.html> <out-prefix> --scale 2 . Look at both pictures before you report.

11. The inventory. The inventory list comes with this brief. Each element of it is in your sketch, or your report says where it went and why.

12. The fence. Edit no file in the repository. Write or correct no rule. Give a rule finding as a note for the SME. Mark each claim that you did not check as "not verified".
```

#### Brief: list

```text
DIRECTION B, "list": the yard as a live switch list.

Idea. Yard paperwork is a list: one line for each car, in order, with its destination. This look has no track drawing. One row is one track. The cars are capped tiles in their true order. The ladder is a spine of six switch controls. On a phone the rows reflow. Nothing is scaled.

Structure.
- One window (`.dusk-stage--app` with `.dusk-win`): title bar and thread; a strip of readings; one framed panel "Yard" that holds a `.dusk-table`; then the work order panel, the move builder, the banner, the rule chips; a status bar.
- The table has seven rows. From the top: AS76, AS75, AS74, AS73, AS72, AS71, then LEAD. AS71 is below AS76, as the app text demands, and the lead is below AS71.
- Columns: Switch, Track, Cars, State, Room. Put `data-label` on every cell; Dusk stacks the row below 760 px.
- This look uses the order of the cars, their lengths and the cut boundaries from the scene. It does not use x and y. That is its view transform: a projection of each track to an ordered list.

How each inventory element reads.
- Ladder and switches: the Switch column. A 2 px line runs down the column through all seven rows (the spine). The part from the LEAD row up to the reverse row is lit in `--lit`. Each track row holds one switch button, 44 px high, with the word NORMAL (`--green-ink`) or REVERSE (`--amber-ink`) and a glyph that shows the leg: "│" for normal, "└→" for reverse. The spine line passes straight through a normal row and turns into the row at the reverse row.
- Lined route: the lit spine, the row of AS73 as the hot row (`.dusk-hot`), and the words "Route: LEAD → AS73" in the head bar of the panel.
- Main line: a short line of text above the first row: "MAIN LINE → the road" and "15 MPH · REDUCED (CROR 105)". The spine continues up to it, dim.
- Lead: the last row. Its Track cell reads "LEAD / DRILL" with "◄ DEPARTURE". Its Cars cell holds the engine tile first, then the held cars in order (scene.state.engine.holds; the first is nearest the engine).
- Car: a compact capped tile, page-local size (about 44 px high; Dusk's `.dusk-tile` has a minimum height of 138 px, so add a `yd-` size class and list it as a gap). The cap carries the number in mono 12 px. The body carries the type tag and, on an empty car, the letter E (a new mark: list it). Loaded: the cap is solid in the type tone with the number in `--on-tile`. Empty: the cap is hollow, `--well` with a `--<tone>-ink` edge and the number in `--ink`. The tile width follows the car length (len * 1.3 px, 56 px or more), so an autorack is wider than a box car.
- Order and cuts: tiles stand throat first, at the left. Tiles of one cut touch. A gap with the glyph "┊" separates two cuts (AS72: 70222, gap, 8810 and 8828). A small mark "throat ▸" at the start of the Cars cell names the end that a PULL takes.
- Foul point: a tick "┃" in `--ink-2` at the start of each Cars cell, with the words "foul point" in the column head.
- Capacity: the Room cell holds a `.dusk-heat` bar in true proportion (occupied length over track length, from scene.state.tracks[].derived) and the car count as a figure ("3 cars"). Give no figure in feet.
- Engine: a tile with a `--lit` edge, the word ENGINE, and a `--lit` dot for the headlight at the end away from the cars.
- TIED, LOOSE, KICKABLE: the State cell: "‖ TIED", "■ LOOSE", "⚡ KICKABLE". A track with one car or no car has an empty State cell.
- Goal: the State cell of AS73 also holds the word BUILD and the chip "3 / 4". Each goal car that is not yet on AS73 (70110, on the engine) carries a small `--lit` tag "→ AS73". This is the destination column of a real switch list.
- Next move: the tile of 70110 has a `--lit` outline, and a dashed empty slot at the throat end of the AS73 cut shows where it lands.
- Refusal: the banner takes scene.refusalExample.text with the glyph ? in `--red-ink` and the button "Look it up →". The switch button that causes it has a red ring.
- Arrival and departure: this look has no stage for the road train. State it as a gap in your report. A row change (tiles that enter a row) is the only place for it.

Strategy at 390 px: stack. No transform and no scaling.
- Below 760 px each row becomes a block. Line 1: the 44 px switch button, the track id, the state words, the count chip. Line 2: the tiles, which wrap to a second line when they do not fit. Line 3: the room bar.
- The spine stays as a line down the left edge of the blocks, lit up to the reverse row.
- The LEAD block stays last. Consider a sticky position at the bottom of the window so that the engine and its cars stay in view; show it only if it does not cover a target.

Dusk parts. `.dusk-titlebar` (brand, crumb), `.dusk-thread`. `.dusk-strip`: key cell "Job P4-PEEL", Moves 4, par 6, Joints 2 (the readout split into cells; the labels keep their words), "Holding 1 car". `.dusk-panel--framed` with `.dusk-panel-body--flush` for the table; head bar: name "Yard", sub-line with the route words, `.dusk-count`. `.dusk-table` with `.dusk-hot` on the lined row and `.dusk-heat` in the Room cell. Capped tiles (`.dusk-tile`, `.dusk-tile-cap`, `.dusk-tile-body`) at a page-local compact size. `.dusk-state` for TIED, LOOSE and the banner. `.dusk-count` for the counts. `.dusk-btn` and `.dusk-seg` for the builder. `.dusk-status` with `.dusk-led`.

Tokens. Floor `--glass`; table head `--thead`; rows `--zebra`; hot row `--wash-4`; spine `--ink-3`, lit part `--lit`; tile tones as in the common rules; figures `--font-mono`.

Switch by pointer and by keyboard. The six switch buttons are ordinary buttons in the document flow, 44 px high and 88 px or more wide, one in each row. Tab reaches them in document order; set the order so that it runs AS71 to AS76, or say that it runs top to bottom and why. Space or Enter changes the lining. The word in the button changes. No custom key handling is necessary. The table is also the text mirror of the yard.

Risks.
- The look reads as a spreadsheet. The spatial sense of a yard (where the ladder is, how far a car stands from the foul point) is weak. The spine and the proportion bar must do that work.
- Wrapped tiles on a phone break the single line of a track. Mark the throat end clearly.
- No stage for the arrival, the departure and the engine run. Motion becomes a change of rows.
- A table that stacks loses its native table semantics (Dusk states this cost). Check the labels.
- The tag "→ AS73" and the letter E are new marks.

COMMON RULES (the same text is in each of the three briefs)

1. The data. Read the scene file /tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/look/scene.json and embed its content in the page as one JavaScript object. Draw from that object only. Do not type a coordinate, a car, a count or a state by hand. The scene is puzzle p4-peel ("Don’t slam a load into empties") after 3 of its 4 authored moves, with the route lined for move 4. Units are the logical units of geometry.js: W 1340, H 460, x to the right, y down. geometry.js never changes. Your look is a view transform on top of these units.

2. The words. Copy every word from scene.words, scene.ruleChips and scene.state. Change no word and no figure. This covers the work order (top line, job line, target line, tip), the readout "Moves 4 / par 6 · Joints 2", the banner "Spotted 1 to AS72.", the picker label, the move builder (PULL, SPOT, KICK, SECURE, the word "cars", the six track names, "Work it ▸", "▶ Watch optimal", "Reset", the sound button), the legend line, the eight rule chips, and the three labels of the drawing ("◄ DEPARTURE · LEAD / DRILL", "MAIN LINE → the road", "15 MPH · REDUCED (CROR 105)"). A new label that the present app does not have (for example NORMAL, REVERSE, ENGINE, BUILD, "foul point") is permitted only where this brief names it. List every new label in your report.

3. Words that bind the drawing (scene.wordsThatBindTheDrawing). Loaded is solid and empty is hollow. The glyph ⚡ marks a kickable track. A standing cut of 2 or more cars reads TIED or LOOSE; a single car shows no tag. A car is called by its number (the last word of its mark). A track nearer the lead is below a track farther from the lead, and the ladder runs up. Each switch has a visible target.

4. Colour. Use Dusk tokens only. If you need a value that Dusk does not have, put it in one `:root` block with the comment "bridge" and list it in your report. The meanings and their tokens:
   - Car type (a category): box `--tile-grey`, hopper `--tile-teal`, tank `--tile-violet`, centerbeam `--tile-amber`, autorack `--tile-blue`; the matching `--<tone>-ink` is the edge of an empty car. The type tag (BX, HP, TK, CB, AR) is always on screen. Measured under simulated red-green colour-vision deficiency, violet and blue are 1.8 to 3.1 apart (CIEDE2000) and grey and teal are 6.9 apart, so the colour does not carry the type alone.
   - Load state: no colour. Loaded is a solid fill. Empty is a hollow outline on `--well` with the number in `--ink`.
   - Switch normal: `--green-ink` and the word NORMAL. Switch reverse: `--amber-ink` and the word REVERSE. Both colours are "SME to confirm". The word is always there.
   - Lined route: the look's own carrier (see the brief), in `--lit` or `--ink`, and the words "Route: LEAD → AS73".
   - Foul point (the present red tick at 30 units from each switch): `--ink-2`, a tick, and the words "foul point" at least one time. It is red only inside a refusal.
   - TIED: `--ink-2` with the glyph ‖ (`.dusk-state--hold`). LOOSE: `--amber-ink` with the glyph ■ (`.dusk-state--caution`).
   - Kickable: `--ink-2`, the glyph ⚡ and the word KICKABLE.
   - Engine: a `--lit` edge (`--neon-ctl`) on `--head`, and the word ENGINE.
   - Goal: `--lit`, the word BUILD and a `.dusk-count` chip with "3 / 4" (from scene.state.goalProgress).
   - Refusal: `--red-ink` with the glyph ? (`.dusk-state--attn`) and the refusal words. Red has no other use.
   - Rule chip kind: the words CROR and S.I. carry it. No category colour.

5. A colour or a glow is never the only carrier of a state. Each state has a word or a glyph beside it. Gold light (`--lit`, `--neon`) is chrome and selection. Do not use gold for a state.

6. Sizes. No text is smaller than 11 px (`--fs-xs`). A car number is 12 px or more. Each pointer target is 44 by 44 px or more. In Dusk, `.dusk-btn` has a minimum height of 29 px and a `.dusk-seg` button has 24 px. Add a page-local size rule (class prefix `yd-`) and list it in your report as a gap. No pill shape on a control: 6 px corner or plain text. No sideways page scroll at 390 px and at 1440 px.

7. The static state first. The sketch is a still picture of the scene. It needs no animation. Reduced motion must leave the same picture. Say in your report where each motion (move, couple, kick, arrival, departure) has room in your look.

8. Reading modes. The layout must hold when text is scaled up, when a dyslexia typeface is set, in high contrast, and with motion off. Put text in elements that grow with the text. Do not put text in a bitmap.

9. Switch control. Each of the six switches is a real `<button>` with `aria-pressed` (true is reverse) and a name of the form "AS73 switch, lined reverse". A pointer presses a target of 44 px or more. A keyboard reaches the six buttons with Tab in the order AS71 to AS76, and Space or Enter changes the lining. The lined state is also in text that a screen reader reaches.

10. The deliverable. One self-contained HTML file with inline CSS and inline JavaScript and no external file. Write a source file with the single marker line <!--DUSK-LAYERS--> in the head, then run: node /tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/tools/inline-dusk.mjs <input.src.html> <output.html> . The helper copies the six Dusk layers byte for byte. Do not rebuild Dusk. Take pictures at 1440 and 390 with: node /tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/tools/shot.mjs <output.html> <out-prefix> --scale 2 . Look at both pictures before you report.

11. The inventory. The inventory list comes with this brief. Each element of it is in your sketch, or your report says where it went and why.

12. The fence. Edit no file in the repository. Write or correct no rule. Give a rule finding as a note for the SME. Mark each claim that you did not check as "not verified".
```

#### Brief: model

```text
DIRECTION C, "model": the yard as a top-down pictorial model.

Idea. The yard looks like a model seen from above, on the true ladder geometry of geometry.js. Rails and ties. A car shape for each type. The engine is an object with a hood, a cab and a headlight. Depth comes from lit edges on a near-black floor. A learner who learns by doing sees the thing itself.

Structure.
- One window (`.dusk-stage--app` with `.dusk-win`): title bar and thread; a strip of readings; one framed panel with a flush body that holds the model; then the work order panel, the move builder, the banner, the rule chips; a status bar.
- The model is one inline SVG (or a canvas with DOM text and DOM buttons over it; say which you used). The view transform is one uniform scale and one offset: x' = s * x + bx, y' = s * y + by. No rotation: the app text says that the tracks nearer the lead are "below". At 1440 the view shows x from -20 to about 1500 units (the label column at the right needs room), so s is about 0.93.

How each inventory element reads.
- Track: a ballast band in `--panel-lo`, ties as short cross strokes in `--hair-2` every 10 units, two rails 1.5 px in `--ink-3`, 6 units apart. The lead, the ladder, the main line and the six body tracks all use it. The deep end of each body track gets a small end stop. The labels "◄ DEPARTURE · LEAD / DRILL", "MAIN LINE → the road" and "15 MPH · REDUCED (CROR 105)" sit on dark plates at their present places (scene.words.canvasLabels).
- Switch: the point blades are drawn toward the lined leg. Beside each switch is a switch stand: a small target mark that is the visible part of a 44 px `<button>`, and a dark plate with the word NORMAL (`--green-ink`) or REVERSE (`--amber-ink`).
- Lined route: the rails of the route (scene.state.linedRoute.points) are brighter (`--ink`), and small `--lit` chevrons "›" along the route point from the engine toward AS73. No thick line. The words "Route: LEAD → AS73" are in the head bar of the panel.
- Foul point: a bar across the track at clearanceX in `--ink-2`, like a painted mark on the ties. A plate with the words "foul point" stands at the lined track only. The legend names the bar.
- Car: a top-down shape, 20 units wide, with its true length. Box: a rectangle with three roof lines across. Hopper: a rectangle with a row of four hatches. Tank: rounded ends and a dome dot. Centerbeam: a centre beam with two bulkhead ends. Autorack: a long rectangle with many close roof lines. Only box, hopper, tank and autorack are in the scene; show all five in the legend. Loaded: the roof is solid in the type tone (`--tile-<tone>`) with a 1 px lit top edge. Empty: the same shape as an outline in `--<tone>-ink` on `--well`. A soft still shadow under each car gives depth (define it one time in the bridge block).
- Car number: on a dark plate centred on the car, mono 12 px, always horizontal. The type tag stands under the car in 11 px.
- Cut: the cars of one cut touch, with a small coupler line between them. Two cuts have open track between them (AS72: 42 units between 70222 and 8810).
- Engine: a locomotive shape, 64 units long and 24 wide: a long hood, a cab near one end, a walkway line, and a headlight at the end away from the cars (scene.state.engine.headlight) with a short still light wedge. A `--lit` edge. A plate with the word ENGINE. The held car 70110 follows it on the lead.
- TIED, LOOSE, KICKABLE, track id: at the deep end of each track, on plates: "AS73", "‖ TIED", "⚡ KICKABLE"; "AS72", "■ LOOSE". A small brake-wheel mark at the end of a tied cut is permitted as an extra, never alone.
- Goal: the plate of AS73 also holds BUILD and the chip "3 / 4". The landing place of the next move (scene.nextMove.landing) is a dashed outline in `--lit`.
- Capacity: the true length is visible in the model at 1440. Add no figure.
- Refusal: the banner takes scene.refusalExample.text with the glyph ? in `--red-ink` and the button "Look it up →". The switch stand that causes it has a red ring.
- Arrival and departure: the model is the natural stage. The road train runs on scene.geometry.polylines.throughRoute. Draw neither.

Strategy at 390 px: pan and zoom with fixed cameras, stacked. Do not scale the whole model to the phone and expect it to be read (at 390 the present drawing gives a car number of 2.4 px).
- Camera 1, the map: the whole yard, fit to the width (s about 0.26), about 125 px high. Shapes only: tracks, car shapes in their tones, solid or hollow, the bright route. No text inside the map. It has `role="img"` and a text name that gives the route.
- Under the map, a track selector: six buttons "AS71" to "AS76", each 44 px high, in one row (`.dusk-seg` skin with a page-local size). Each shows the track id and the word NORMAL or REVERSE in short form below it only if 11 px text fits; if it does not fit, show the id and a glyph and keep the word in camera 2. The selector chooses the track that camera 2 shows. It does not change a switch.
- Camera 2, the track: the selected track at s = 1.1 or more, as a strip about 110 px high. It shows the switch stand with its 44 px button and its word, the foul point, a break mark for the empty run, and the cars with number plates. If the cars are longer than the strip, show the throat end first and give two 44 px pan buttons.
- Camera 3, the lead: the engine and the held cut at the same scale, with the far end of the cut in view.
- The three cameras are three views of the same transform family (s and offset). geometry.js does not change.

Dusk parts. `.dusk-titlebar` (brand, crumb), `.dusk-thread`. `.dusk-strip`: key cell "Job P4-PEEL", Moves 4, par 6, Joints 2 (the readout split into cells; the labels keep their words), "Route LEAD → AS73". `.dusk-panel--framed` with `.dusk-panel-body--flush` for the model, head bar with name, sub-line and `.dusk-count`. `.dusk-seg` for the track selector on a phone. `.dusk-state` for TIED, LOOSE and the banner. `.dusk-count` for "3 / 4". `.dusk-btn` for the builder. `.dusk-status` with `.dusk-led`.

Tokens. Floor `--glass`; ballast `--panel-lo`; ties `--hair-2`; rails `--ink-3`, lined rails `--ink`; chevrons and engine edge `--lit`; plates `--well` with `--ink-2` text; car tones as in the common rules; figures `--font-mono`.

Switch by pointer and by keyboard. Six `<button>` elements placed over the switch stands, 44 by 44 px. At 1440 the step between two stands is 65 px across and 48 px down at s = 0.93, so the squares do not overlap; check it at your scale. Tab order AS71 to AS76; Space or Enter changes the lining; the plate word changes and the blades move to the other leg. On a phone the button is in camera 2 and the selector reaches each track.

Risks.
- This look has the most drawing work: five shapes, two load states, the engine, the points.
- Pictorial detail competes with the words. Keep the plates clear of the rails.
- Below about 1 px for each unit the shapes and ties become noise. The phone needs three cameras, and the state is then split over three views.
- The tank shape has round ends. The rule "no pill" is for controls; say in your report that the shape is a car and not a control.
- The switch target is small in the model; the 44 px button is larger than its mark. Show the focus ring on the button.
- A canvas would put text in a bitmap. Text must stay in SVG or DOM.

COMMON RULES (the same text is in each of the three briefs)

1. The data. Read the scene file /tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/look/scene.json and embed its content in the page as one JavaScript object. Draw from that object only. Do not type a coordinate, a car, a count or a state by hand. The scene is puzzle p4-peel ("Don’t slam a load into empties") after 3 of its 4 authored moves, with the route lined for move 4. Units are the logical units of geometry.js: W 1340, H 460, x to the right, y down. geometry.js never changes. Your look is a view transform on top of these units.

2. The words. Copy every word from scene.words, scene.ruleChips and scene.state. Change no word and no figure. This covers the work order (top line, job line, target line, tip), the readout "Moves 4 / par 6 · Joints 2", the banner "Spotted 1 to AS72.", the picker label, the move builder (PULL, SPOT, KICK, SECURE, the word "cars", the six track names, "Work it ▸", "▶ Watch optimal", "Reset", the sound button), the legend line, the eight rule chips, and the three labels of the drawing ("◄ DEPARTURE · LEAD / DRILL", "MAIN LINE → the road", "15 MPH · REDUCED (CROR 105)"). A new label that the present app does not have (for example NORMAL, REVERSE, ENGINE, BUILD, "foul point") is permitted only where this brief names it. List every new label in your report.

3. Words that bind the drawing (scene.wordsThatBindTheDrawing). Loaded is solid and empty is hollow. The glyph ⚡ marks a kickable track. A standing cut of 2 or more cars reads TIED or LOOSE; a single car shows no tag. A car is called by its number (the last word of its mark). A track nearer the lead is below a track farther from the lead, and the ladder runs up. Each switch has a visible target.

4. Colour. Use Dusk tokens only. If you need a value that Dusk does not have, put it in one `:root` block with the comment "bridge" and list it in your report. The meanings and their tokens:
   - Car type (a category): box `--tile-grey`, hopper `--tile-teal`, tank `--tile-violet`, centerbeam `--tile-amber`, autorack `--tile-blue`; the matching `--<tone>-ink` is the edge of an empty car. The type tag (BX, HP, TK, CB, AR) is always on screen. Measured under simulated red-green colour-vision deficiency, violet and blue are 1.8 to 3.1 apart (CIEDE2000) and grey and teal are 6.9 apart, so the colour does not carry the type alone.
   - Load state: no colour. Loaded is a solid fill. Empty is a hollow outline on `--well` with the number in `--ink`.
   - Switch normal: `--green-ink` and the word NORMAL. Switch reverse: `--amber-ink` and the word REVERSE. Both colours are "SME to confirm". The word is always there.
   - Lined route: the look's own carrier (see the brief), in `--lit` or `--ink`, and the words "Route: LEAD → AS73".
   - Foul point (the present red tick at 30 units from each switch): `--ink-2`, a tick, and the words "foul point" at least one time. It is red only inside a refusal.
   - TIED: `--ink-2` with the glyph ‖ (`.dusk-state--hold`). LOOSE: `--amber-ink` with the glyph ■ (`.dusk-state--caution`).
   - Kickable: `--ink-2`, the glyph ⚡ and the word KICKABLE.
   - Engine: a `--lit` edge (`--neon-ctl`) on `--head`, and the word ENGINE.
   - Goal: `--lit`, the word BUILD and a `.dusk-count` chip with "3 / 4" (from scene.state.goalProgress).
   - Refusal: `--red-ink` with the glyph ? (`.dusk-state--attn`) and the refusal words. Red has no other use.
   - Rule chip kind: the words CROR and S.I. carry it. No category colour.

5. A colour or a glow is never the only carrier of a state. Each state has a word or a glyph beside it. Gold light (`--lit`, `--neon`) is chrome and selection. Do not use gold for a state.

6. Sizes. No text is smaller than 11 px (`--fs-xs`). A car number is 12 px or more. Each pointer target is 44 by 44 px or more. In Dusk, `.dusk-btn` has a minimum height of 29 px and a `.dusk-seg` button has 24 px. Add a page-local size rule (class prefix `yd-`) and list it in your report as a gap. No pill shape on a control: 6 px corner or plain text. No sideways page scroll at 390 px and at 1440 px.

7. The static state first. The sketch is a still picture of the scene. It needs no animation. Reduced motion must leave the same picture. Say in your report where each motion (move, couple, kick, arrival, departure) has room in your look.

8. Reading modes. The layout must hold when text is scaled up, when a dyslexia typeface is set, in high contrast, and with motion off. Put text in elements that grow with the text. Do not put text in a bitmap.

9. Switch control. Each of the six switches is a real `<button>` with `aria-pressed` (true is reverse) and a name of the form "AS73 switch, lined reverse". A pointer presses a target of 44 px or more. A keyboard reaches the six buttons with Tab in the order AS71 to AS76, and Space or Enter changes the lining. The lined state is also in text that a screen reader reaches.

10. The deliverable. One self-contained HTML file with inline CSS and inline JavaScript and no external file. Write a source file with the single marker line <!--DUSK-LAYERS--> in the head, then run: node /tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/tools/inline-dusk.mjs <input.src.html> <output.html> . The helper copies the six Dusk layers byte for byte. Do not rebuild Dusk. Take pictures at 1440 and 390 with: node /tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/tools/shot.mjs <output.html> <out-prefix> --scale 2 . Look at both pictures before you report.

11. The inventory. The inventory list comes with this brief. Each element of it is in your sketch, or your report says where it went and why.

12. The fence. Edit no file in the repository. Write or correct no rule. Give a rule finding as a note for the SME. Mark each claim that you did not check as "not verified".
```

## 7. Part 5. Colour conventions

The Dusk laws, as read:

- "Tile colour is a category. Chip and state colours are states. Gold is chrome only." (the plan, section 3.)
- "Gold light is chrome and selection. A tile is lit in its own colour." (`/home/user/dusk/ARCHITECTURE.md:113`.) `--lit` is "chrome and selection, never a state" (`ARCHITECTURE.md:102`).
- "Red is for attention only. It is never a category colour, a decoration or the market's down." (`/home/user/dusk/DECISIONS.md`, D-014.)
- "Teal is information, never a state." Blue, violet and grey are "lane and category fills ... never a state". (`ARCHITECTURE.md:103-104`.)
- "Colour is never the only carrier." "A glow is a still shadow and is never the only carrier of a state." (`DECISIONS.md`, constraint 6; `ARCHITECTURE.md:194`.)
- State glyphs that Dusk writes: ok ✔, caution ■, attention ?, hold ‖, info ● (`dusk.components.css:570-576`).

The plan says "gold is chrome only". The Dusk source says "chrome and selection". The table uses gold for three selection meanings: the lined route, the engine, and the goal. The lead decides if that reading holds. The fallback is `--ink` at double weight.

| Meaning | Dusk token | Word or glyph that also carries it | Mark |
|---|---|---|---|
| Car type: box | cap `--tile-grey`; empty edge `--grey-ink` | tag BX; length 42 | SME to confirm: no car colour is a commodity code or a hazard code |
| Car type: hopper | cap `--tile-teal`; empty edge `--teal-ink` | tag HP; length 47 | SME to confirm, as above |
| Car type: tank | cap `--tile-violet`; empty edge `--violet-ink` | tag TK; length 50 | SME to confirm: a reader could take a tank car colour for a dangerous goods mark |
| Car type: centerbeam | cap `--tile-amber`; empty edge `--amber-ink` | tag CB; length 61 | SME to confirm, as above. Amber is also a state colour; here it is a category on a tile cap, which the Dusk law permits |
| Car type: autorack | cap `--tile-blue`; empty edge `--blue-ink` | tag AR; length 75 | SME to confirm, as above |
| Load state: loaded | no colour of its own: the solid fill of the type tone, number in `--on-tile` | solid shape | Bound by frozen words (`puzzles.js:18`, `puzzles.js:281`). The app's own convention |
| Load state: empty | no colour of its own: `--well` body, type ink edge, number in `--ink` | hollow shape; in B also the letter E | Bound by the same frozen words |
| Switch normal | `--green-ink` | the word NORMAL; the joined straight leg | **SME to confirm.** The app says "green = normal" (`yardSim.js:191`) |
| Switch reverse | `--amber-ink` | the word REVERSE; the joined diverging leg | **SME to confirm.** `render.js:2` calls yellow a rule convention; that claim is not verified (T12). The app says "yellow = lined into the track / diverging" (`yardSim.js:190`). `--amber-ink` is a dark yellow |
| Lined route | A: `--lit` line. B: `--lit` spine and `--wash-4` row. C: `--ink` rails and `--lit` chevrons | one continuous path from the engine to the first car; the words "Route: LEAD → AS73" | **SME to confirm** that a lit route does not read as a signal indication or as permission to move. The looks use no green and no red for it |
| Clearance / foul point | `--ink-2` | a tick across the track; the words "foul point" | **SME to confirm** the term and that no colour is expected. The present tick is always red; red is attention only, so the new tick is not red |
| Secured | `--ink-2` | ‖ TIED (`.dusk-state--hold`) | **SME to confirm** the word. The present TIED is yellow |
| Loose | `--amber-ink` | ■ LOOSE (`.dusk-state--caution`) | **SME to confirm** the word. The present LOOSE is red. It becomes red only inside the refusal that names it |
| Kickable track | `--ink-2` | ⚡ KICKABLE | Bound by frozen words (`puzzles.js:17`). See Notes for the SME, S9 |
| Engine | edge `--lit` (`--neon-ctl`), body `--head`, headlight `--lit` | the word ENGINE; its shape; its place at the end of the held cut | No rule colour. See Notes for the SME, S5 |
| Goal | `--lit` | the word BUILD; a `.dusk-count` chip "3 / 4"; a dashed landing outline | No rule colour |
| Refusal | `--red-ink` (`--attn-ink`) | ? and the refusal words (`.dusk-state--attn`); the button "Look it up →"; a ring at the cause | Attention only. No other red in the Yard |
| Job won | `--green-ink` | ✔ and the win words (`.dusk-state--ok`) | Green then has two uses: switch normal and job won. The words separate them |
| Rule chip: CROR | `--ink-2` | the word CROR in the cite | No category colour |
| Rule chip: S.I. | `--ink-2`, dashed edge | the word S.I. in the legend; the cite | No category colour. The present S.I. chip is yellow |

Three limits on this table:

1. Amber has three uses (switch reverse, LOOSE, the centerbeam cap). The first two are states of the same kind: a thing to keep in mind. The third is a category on a tile and is in one puzzle only.
2. The measured distances of section 3.6 show that no pair of state colours is safe for a reader with a red-green deficiency. The word column is the real carrier. The colour column is a second cue.
3. If the owner or the SME rejects green and amber for the switch, the fallback has no hue: NORMAL in `--ink-3`, REVERSE in `--ink` with the lit leg. The sentence at `yardSim.js:190-191` must then change. A reskin changes no word, so that change needs the owner's decision.

## 8. Notes for the SME

R1 proposes no rule wording. Each note is a question about content or about a mark that a learner could take for a rule.

- S1. `render.js:2` says that a yellow diverging target is a "CROR yard convention". R1 found no evidence. The app tells the learner "yellow = lined into the track / diverging, green = normal" (`yardSim.js:190-191`). Is there a colour convention for a switch target, and does the app's use agree with it?
- S2. The drawing carries the label "15 MPH · REDUCED (CROR 105)" (`render.js:94`). `render.js` is not a frozen file and Wave 2 rewrites it. The new drawing copies the label without change. Please confirm the label.
- S3. The clearance tick stands 30 units from every switch (`geometry.js:35`) and is red. The lead has a limit too (`LEAD_CLEAR`, `geometry.js:56`) and no tick. The app's refusals say "foul point" (`model.js:126`); the code comment says "clearance / foul point". Which term is correct for the mark? Should the lead show its limit? One railway's customer page describes a painted clearance marker (https://cn.ca/en/stories/20220908-keeping-employees-customers-safe , search summary, not opened). R1 gives the mark no colour meaning.
- S4. A track with one car shows no TIED or LOOSE tag (`render.js:144`), and the engine refuses SECURE on one car (`model.js:212-213`). The rule chip reads "Unattended equipment gets a hand brake (secured)" (`puzzles.js:15`). Do these two statements agree?
- S5. The headlight is at the end of the engine away from the cars, toward the departure end of the lead (`render.js:161-162`). Is that the correct end?
- S6. The car type colours are categories only. Please confirm that none of the five reads as a commodity code or a placard colour.
- S7. A code comment gives the scale as about 0.84 px for each foot and gives car lengths in feet (`geometry.js:31`, `geometry.js:44-48`). The looks print no length in feet. If a later look prints a length or a capacity figure, it needs confirmation first.
- S8. The words TIED and LOOSE on the drawing (`render.js:146`), and "tied down" and "standing loose" in the messages (`model.js:215`, `yardSim.js:446`). Are these the words a crew uses?
- S9. The glyph ⚡ marks a kickable track (`puzzles.js:17`, `render.js:150`). On signs, a lightning glyph often means an electrical hazard. Could a learner take it for a railway symbol?
- S10. The labels "LEAD / DRILL", "DEPARTURE" and "MAIN LINE → the road" (`render.js:92-93`). Please confirm the terms.
- S11. A lit route line resembles a dispatcher display. Sources show that such displays use green for a lined route and red for an occupied track on some systems and other colours on others (F1, F3, F4). The looks avoid both colours for the route. Is there a risk that a learner reads the lit route as authority to move?

## 9. Notes for the lead

1. The sentence at `yardSim.js:190-191` binds the switch colours, and the sentence at `yardSim.js:203` ("the ones below it normal") binds the orientation. The briefs keep both true. A look that breaks one needs a word change and the owner's decision.
2. Gold for the route, the engine and the goal rests on "chrome and selection" in the Dusk source. The plan's short form is "chrome only". One ruling settles it.
3. The briefs name six new labels that the present app does not have: NORMAL, REVERSE, ENGINE, BUILD, "foul point", "Route: LEAD → AS73". B adds the letter E and the tag "→ AS73". They add carriers; they change no existing word. They need a yes before Wave 2, because they are words in a safety trainer.
4. The briefs split the readout into strip cells (Moves, par, Joints). The three labels keep their words.
5. Section 4.5 holds five facts for other jobs: the reduced-motion factor (R5, R7), the cut KICKABLE tag (Y2), the engine off the frame (Y2, R2), the stale "(now on ...)" words (R4), and the Dusk control sizes (R3).
6. Direction B has no stage for the arrival, the departure and the engine run. If the owner picks B, R7's motion sheet needs a row-based form.
7. Direction C needs three cameras on a phone. This bears on Gate A question 2 (full play on a phone, or desktop first).

## 10. Not verified

- Every [search summary] finding: R1 did not open the page. The hosts did not resolve.
- F2: the page that carries it is not identified.
- F6: low confidence; the summary did not tie the statement to one post.
- F9: model knowledge, no source.
- The reduced-motion duration in the running app with the setting on. The fake-clock result is for `anim.js` alone.
- The colour-vision table is a simulation, not a test with people.
- The scale "about 0.93" and the step sizes in the briefs are estimates for a 1440 px window. Each designer must measure them in the sketch.
- R1 did not build the three sketches. The briefs are not yet proven by a picture.
- R1 did not read `preview/index.html` of Dusk in full. R1 read `preview/desk.html`, `ARCHITECTURE.md`, `DECISIONS.md` and the token and layer files.

## 11. Sources

Web (search summaries, 2026-11-20): the URLs are in the tables of section 3.
Repository [read]: `src/stations/yard/render.js`, `anim.js`, `geometry.js`, `model.js`, `puzzles.js`, `solver.js`, `src/stations/yardSim.js`, `tools/solve.mjs`, `src/styles/dusk/*.css`, `specs/clear-board-2-plan.md`.
Dusk [read]: `/home/user/dusk/ARCHITECTURE.md`, `/home/user/dusk/DECISIONS.md`, `/home/user/dusk/preview/desk.html`, `/home/user/dusk/lib/color.mjs`.
Scratch (R1): `survey.mjs`, `make-scene.mjs`, `drive-app.mjs`, `selftest.mjs`, `cvd.mjs`, `check-anim.mjs`, `app-facts.json`, `present-canvas-1440.png`, `present-canvas-390.png`, `present-page-1440.png`, `present-page-390.png`, `selftest.png`, the four brief files.
