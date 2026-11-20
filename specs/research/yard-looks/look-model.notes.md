# Look C, "model": notes

Clear Board 2, Wave 1, research. Date: 2026-11-20. Branch `claude/peaceful-mayer-qat99l`.
One of three look sketches for the Yard station. Read-only on code and content.

Files of this job:

- `specs/research/yard-looks/look-model.src.html` : the source (992 lines; own CSS 217 lines, own script 654 lines, the scene object). (rev.)
- `specs/research/yard-looks/look-model.html` : the built sketch (160 kB; one file; the six Dusk layers inline). (rev.)
- `specs/research/yard-looks/look-model-1440.png`, `look-model-390.png` : full-page pictures at scale 2.
- `specs/research/yard-looks/look-model.notes.md` : this file.
- Scratch folder `/tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/look-model/` : the template, `build.mjs`, `measure.mjs`, `verify.mjs`, `clip.mjs`, the mode style sheets and the working pictures. Nothing there is in the repository.
- Scratch folder of the review `/tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/critic-model/` : `audit.mjs`, `static.mjs`, `truth.mjs`, `kb.mjs`, `widths.mjs`, `facts.mjs`, `clip.mjs`, the patch scripts and the working pictures. (rev.)

Status words in this file: **[measured]** is a result of a script of this job. **[read]** is a fact read in a file. **[seen]** is a fact seen in a picture of this job. **not verified** has no check.

Sections 1 to 12 are the record of the build job. An independent review came after it (section 13). The review repaired the sketch and corrected the lines of sections 1 to 12 that the repairs made false. Each corrected line has the mark **(rev.)**. A number without the mark is a number of the build job, from before the repairs. Section 13 has the numbers of the final file.

## 1. What the look is

The yard is a model seen from above, on the true geometry of `geometry.js`. One uniform scale and one offset: x' = s × (x − x0), y' = s × (y − y0). No rotation. AS71 is the lowest track. The ladder runs up.

- Track: a ballast band, a tie every 10 units, two rails 6 units apart. The lead, the ladder, the main line and the six body tracks all use it. Each body track has an end stop at its deep end.
- Car: a top-down shape with its true length. Each type has its own roof detail. Loaded is a solid shape in the type tone. Empty is a hollow outline. The type tag (BX, HP, TK, AR) is on the car at the throat end. The car number hangs on a dark plate under the car.
- Engine: a locomotive shape with a hood, three fans, a cab, a lit edge, a headlight and a still beam. The word ENGINE is on a plate under it. The held car 70110 is coupled to it on the lead.
- Switch: a stand beside the points, with a diamond target and a rod. A plate at the stand has the track id and the word NORMAL or REVERSE. The rails of the leg that is not lined start after a gap. A 44 by 44 px button covers the stand and the points.
- Lined route: the rails of the route are bright, and small gold chevrons on the route point from the engine to the track. The words "Route: LEAD → AS73" are in the head bar and in the strip.
- Deep end of each track: a plate with the id and the state words: "AS73 ‖ TIED", "BUILD 3 / 4", "⚡ KICKABLE"; "AS72 ■ LOOSE".
- The place where the move in the builder lands is a dashed outline with the car number 70110 on a dashed plate. (rev.)
- The page is one Dusk window: title bar and thread, a strip of readings, the framed Yard panel, the work order panel, the move builder with the banner, the rules, the two text blocks of the app, a refusal example, a status bar.

The drawing technology of the sketch: inline SVG for every shape, DOM text on plates over the SVG, DOM buttons over the plates. No text is in the SVG. No canvas.

The sketch has two layouts of the same model and one rule that selects the layout (section 4).

## 2. How the sketch was built, and what was checked

1. `build.mjs` (scratch) reads `scene.json` and puts it in the page as one object, `const SCENE`. It copies two text blocks from `src/stations/yardSim.js` (the note and the "How to play" block) and removes their old inline colours. It writes `look-model.src.html`. Then it runs `inline-dusk.mjs`.
2. The script of the page draws from `SCENE` only. It types no coordinate, no car, no count and no state. The view window (x from 0, y from −6 to 412 units) and the drawing constants (rail spacing 6 units, tie step 10 units, stand offset) are view values of the sketch.
3. **[measured]** `verify.mjs`: the object in the built page is deep-equal to `scene.json`. The six Dusk layer files are in the built page byte for byte. The built page has 2 style blocks (Dusk, own) and 1 script block. It refers to no external file. The one "http" string is the SVG namespace name in the script; the browser does not fetch it.
4. **[measured]** The own CSS, the own script and the body markup hold no hex colour, no `rgb()`, no `hsl()`, no colour name and no inline colour style. The script holds the words 'grey', 'teal' and 'blue' as token names (`--tile-grey`), not as colours.
5. **[measured]** The function `routeFor()` of the sketch computes the lined route from the lined map with the logic of `model.js:66-75`. For the scene it gives the same points as `scene.state.linedRoute.points` (`data-route-check="ok"` on the root element at both widths).
6. **[measured]** Each word of `scene.words`, each rule chip, each car number and each type tag of the scene is in the page text at 1440. The three labels of the drawing, the words of the selected track and the banner are in the page text at 390. The text of the note C11 and of the block C12 is equal to the app text.
7. **[seen]** Rounds of look and repair: 4 rounds at 1440 (r0, r1, r2, final) and 4 rounds at 390 (r0, r1, r3, final), with clipped pictures at scale 2 to 4. Repairs: the legend moved into the empty corner; the plates at the deep end went from two wide lines to one line (three for the goal track), which raised the scale at 1440 from 0.972 to 1.001; the lead label came back in camera 3; one scale for all six tracks in camera 2; the cars of other tracks left camera 2; the red foul bar left the refusal example; the two top labels got a place at 390; the number plates got 1 px less padding.

Limit: the page needs its script. With no script the model, the work order and the rules are empty. The Dusk rule "no text depends on JavaScript" (`/home/user/dusk/ARCHITECTURE.md`, non-negotiable 2) does not hold for this sketch. Common rule 1 of the brief ("draw from that object only") is the reason. The app is a script application, so the build job has the same condition.

## 3. How each inventory element reads

### 3.1 The drawing

| # | Element | In the sketch |
|---|---|---|
| D1 | Floor | `.yd-view` has the one fill `--glass`. |
| D2 | Frame | `.dusk-panel--framed`: the lit edge `--neon`, 8 px corner (`--r-tile`), a head bar. The present 12 px corner and drop shadow are gone. |
| D3 | Size and scale | No fixed bitmap. The script computes s from the width of the panel. **[measured]** At a 1440 px viewport s is 1.001 and the model is 1416 by 419 px. Text is DOM text at Dusk type sizes at every width. |
| D4 | Main line | Ballast, ties and two rails from the AS76 switch off the top edge. |
| D5 | Ladder | Ballast, ties and two rails from the foot through the six switches. |
| D6 | Lead / drill | Ballast, ties and two rails from the left edge to the foot. |
| D7 | Body tracks | Six tracks, AS71 lowest. New: an end stop bar at the deep end (see the SME note S6). |
| D8 | "◄ DEPARTURE · LEAD / DRILL" | A plate at its present place, above the lead at the left. In camera 3 it stays at the left edge of the view. |
| D9 | "MAIN LINE → the road" | A plate at its present place. At 390: a plate above the map. |
| D10 | "15 MPH · REDUCED (CROR 105)" | A plate at the top right of the frame. At 390: a plate above the map. |
| D11 | Label plate | `.yd-plate`: `--well` ground, 4 px corner, a 1 px ring, mono text. 12 px for the three labels, 11 px above the map. |
| D12 | Switch target | A diamond on a stand beside the points. Normal: hollow, `--green-ink` edge. Reverse: solid `--amber` with a `--amber-ink` edge (rev.). The plate beside it has the id and the word. The gap in the rails of the other leg shows the lining with no colour. |
| D13 | Switch glow | Removed. The solid diamond, the word and the rails carry the reverse state. |
| D14 | Clearance tick | A bar across the rails at `clearanceX` of each track, `--ink-2`, 18 units high (the present height). Not red. The plate "foul point" is under the bar of the lined track only. The legend names the bar. No bar on the lead (none today). |
| D15 | Track id | 13 px bold mono on the plate at the deep end, and 11 px mono on the stand plate. At 390: in the selector and in the caption of camera 2. |
| D16 | TIED or LOOSE | `.dusk-state--hold` "‖ TIED" in `--ink-2`; `.dusk-state--caution` "■ LOOSE" in `--amber-ink`; 12 px. Shown only where the scene gives `securementTag`. |
| D17 | Kickable mark | "⚡ KICKABLE", 11 px, `--ink-2`, on the plate of the track. The width of the plates is measured before s is set, so no plate is cut. |
| D18 | Car | A top-down shape, 20 units across, true length. The body is 2.4 units shorter than `len`, so a coupler line shows between two cars. **[measured]** At 1440 a box car body is 39.7 by 20 px; at 390 (camera 2) it is 49.2 by 24.8 px. |
| D19 | Car type colour | A category: box `--tile-grey`, hopper `--tile-teal`, tank `--tile-violet`, centerbeam `--tile-amber`, autorack `--tile-blue`. The matching `--<tone>-ink` is the edge, the roof detail and the tag of an empty car. The roof detail also differs by type: box 3 lines across; hopper 4 hatches; tank round ends and a dome; centerbeam a beam and two bulkheads; autorack many close lines. |
| D20 | Load state | Loaded: solid fill (the tile gradient of the type), a 1 px light top edge, tag in `--on-tile` on a sunk square (`--tile-glyph`). Empty: `--well` body, 1.5 px edge in the type ink, tag in the type ink. |
| D21 | Car number | The last word of the mark, 12 px bold mono, `--ink` on a `--well` plate, under the car, always horizontal. No smaller size at any width. |
| D22 | Type tag | 11 px bold mono on the car at the throat end (the present place). Always on screen where the car is on screen. |
| D23 | Cut and gap | Cars of one cut touch, with a coupler line between them. The 42 unit gap on AS72 shows bare track between 70222 and 8810. |
| D24 | Engine | 64 by 24 units: `--head` body, `--lit` edge with a still glow, a walkway line, a long hood with three fans, a cab, a short hood. The word ENGINE in `--lit` on a plate. |
| D25 | Headlight | A dot at `scene.state.engine.headlight` and a still beam that fades toward the departure end. |
| D26 | Held cut | The held car 70110 is on the lead, coupled to the engine, toward the yard. A long held cut is not in the scene (section 11). |
| D27 | Move animation | Not drawn. Room: section 9. |
| D28 | Shove animation | Not drawn. The branch does not run today. |
| D29 | Arrival cinematic | Not drawn. Room: section 9. |
| D30 | Departure run | Not drawn. Room: section 9. |
| D31 | Watch optimal | The button is there and does nothing in the sketch. |
| Pointer | Click on the canvas | Real buttons, 44 by 44 px, over the stand and the points. Pointer, Space and Enter change the lining. The plate word, the diamond, the rails, the chevrons, the route words, the status bar, the text mirror and a polite live line change with it. |

### 3.2 The chrome

| # | Part | In the sketch |
|---|---|---|
| C1 | Back button "← Home" | `.dusk-btn` in the title bar, 44 px high. |
| C2 | Picker | A native select in `.dusk-strip-end`, with the group label and the option label of the scene. One option only: the scene holds one job. |
| C3 | Readout | Three strip cells: Moves 4, par 6, Joints 2. The script cuts the label words from the readout text. The strip has the full text "Moves 4 / par 6 · Joints 2" as its accessible name. |
| C4 | Work order | A framed panel. Head: the top line, without change. Body: the job line, the target line and the hint, with the same bold and dim parts. |
| C5 | Switch-list check | Not in this puzzle. Not drawn. Its place is the body of the work order panel. |
| C6 | Move builder | Three native selects (action, count, track), the word "cars", "Work it ▸", "▶ Watch optimal", "Reset", the sound button. The controls are the controls of the app: no select became a segmented choice. The titles of the app are on the controls. |
| C7 | Depart button | Hidden for this puzzle. Not drawn. Its place is after "▶ Watch optimal". |
| C8 | Banner | Tone ok: "Spotted 1 to AS72." in `--ink` on a sunk slot, no glyph, as today. Tone bad: the refusal example, `.dusk-state--attn` (glyph ?, `--red-ink`), a red lit edge (`--rowneon-red`), the button "Look it up →". Tones none and win are not drawn. |
| C9 | Legend line | Copied without change. CROR and S.I. are bold `--ink`. No category colour. |
| C10 | Rule chips | Eight chips. The cite is bold mono. A chip of kind S.I. has a dashed edge and the tag "S.I." before its cite. A chip of kind CROR has a solid edge; its cite starts with the word CROR. |
| C11 | Note "What this trainer builds" | Copied from `yardSim.js`. **[measured]** Its text is equal to the app text. |
| C12 | "How to play & why these rules" | A closed details block, copied from `yardSim.js`. **[measured]** Its text is equal to the app text. The words "yellow" and "green" in it take `--amber-ink` and `--green-ink`. |

### 3.3 Things the present drawing does not have (inventory item 45)

| Thing | In the sketch |
|---|---|
| A mark of the lined route | Yes: bright rails, chevrons, and the route words. |
| A word for the switch state | Yes: NORMAL, REVERSE. |
| A word on the engine | Yes: ENGINE. |
| A goal mark | Yes: BUILD and the chip "3 / 4" on the plate of AS73, and "BUILD AS73" with the chip "3 / 4" in the head bar (rev.). |
| The landing place of the move in the builder (rev.) | Yes: a dashed outline and the number 70110 on a dashed plate. It shows only while the route reaches the track of the move. |
| A capacity mark | No figure, as the brief says. At 1440 the true length of each track is in the model. At 390 it is in the map only. |
| A car count | No. The brief asks for none. |
| A text alternative | A hidden list (`#mirror`, class `.dusk-sr`) gives the route, the engine with its cars, and each track with its lining, state words and cars. The visible status bar gives the six linings. |

## 4. The two layouts and the 390 strategy

One rule selects the layout. The script measures the widest plate of a track end and the plate of a five-digit number with the real fonts. It computes the scale that fits the panel: s = (panel width − plate column) / 1296 units. It draws the whole model when s is 0.9 or more and two number plates under two box cars do not touch. In every other case it draws the three cameras.

**The whole model (1440).**

- **[measured]** At a 1440 px viewport: s = 1.001, model 1416 by 419 px, plate column 118 px. The page is 1405 px high.
- **[measured]** (rev.) The whole model shows from a viewport of 1335 px. At 1334 px the page shows the cameras. The status bar of the sketch gives this width; the script computes it. The legend is in the empty corner above the ladder from 1416 px; from 1335 to 1412 px it is under the model.
- **[measured]** The six switch buttons are 44 by 44 px. The step between two buttons is 70 px across and 52 px down. No two buttons overlap. No plate overlaps a plate. No plate is cut by the frame.
- **[measured]** At 1920 px s is 1.3 (the cap).

**The three cameras (390).** Three views of the same model, stacked. Each view is the same paint function with another scale and offset.

- Above the map: the plates "MAIN LINE → the road" and "15 MPH · REDUCED (CROR 105)".
- Camera 1, the map: the whole yard, fit to the width. **[measured]** At 390: s = 0.273, 366 by 114 px. Shapes only: one line for each track, the route as a bright line, car shapes in their tones, solid or hollow, the engine with its lit edge. No text. It has `role="img"` and a name that gives the route. Three gold frames on the map show what camera 2 (two pieces) and camera 3 show.
- The track selector: six buttons AS71 to AS76 in one row, `.dusk-seg` skin with a page-local size. **[measured]** Each is 59 by 44 px at 390. Each shows the id and the word NORMAL or REVERSE in 11 px. When the word does not fit (seen at 130 percent text), each shows the id and a glyph (◇ normal, ◆ reverse) and the word stays in camera 2. The selector chooses the track of camera 2. It does not change a switch. The pressed button is gold: gold is selection.
- Camera 2, the track: a caption with the plate words of the track ("AS73 BUILD 3 / 4 ‖ TIED ⚡ KICKABLE"), then a strip of two pieces at one scale. The throat piece has the stand, its word, the 44 px switch button, the points and the foul point. The deep piece has the landing place, the cars with tags and number plates, and the end stop. A break mark "⋯" stands between the pieces. **[measured]** At 390: s = 1.241, strip 366 by 95 px (rev.), a box car body 49.2 by 24.8 px. The scale is the same for all six tracks: the largest from 1.1 to 1.5 that shows every track with no pan.
- When the cars are longer than the deep piece, the strip shows the throat end of the cars first and the caption gets two 44 px pan buttons (◄ ►). **[measured]** This occurs at a 320 px viewport, and at 390 px with 130 percent text. It does not occur in the scene at 390 px.
- Camera 3, the lead: the engine, the held cut, the first chevrons of the route and the foot, at the scale of camera 2. Its right edge is 34 units past the foot, so the far end of the cut is in view.
- The legend is a details block under the cameras. It is open in the sketch so that the picture shows it.
- **[measured]** The cameras are also the layout at 768, 1024 and 1280 px, and at 1440 px with 130 percent text. From a panel width of 700 px camera 2 and camera 3 stand side by side. (rev.) In that layout the scale of the map is 0.5 at most (670 by 209 px), so that the three views fit one screen.

Limits of the cameras:

1. The state is split over three views. A learner sees one switch and one track in detail at a time. The selector and the map hold the rest: six lining words and all car shapes.
2. On a phone a keyboard reaches one switch button at a time (the selected track). The six selector buttons come before it in the Tab order. Common rule 9 (six switch buttons in the Tab order AS71 to AS76) holds in the whole model only.
3. **[measured]** (rev.) At 390 px the switch button is at 539 px from the page top and "Work it ▸" is at 1415 px. The legend (349 px with its summary) and the work order are between them. Play on a phone needs a scroll between the switch and the builder. A closed legend and a builder directly under the cameras would shorten this; the sketch has neither.
4. The break mark hides the empty run. Track length is true in the map only.
5. Camera 3 has no pan. A held cut longer than the view puts the engine out of the view (section 11).
6. (rev.) Laptop and tablet widths from 761 to 1334 px get the cameras, with a map that has no word in it. This is the weakest range of the look. The two pictures of this job do not show it.

## 5. Token map

| Meaning | Token | Word, glyph or shape that also carries it | Mark |
|---|---|---|---|
| Floor of the model | `--glass` | | |
| Ballast | `--panel-hi` | the band under the ties | |
| Ties | `--hair-2` | cross strokes every 10 units | |
| Rails | `--ink-3` at 62 percent, 1.5 px | two lines | |
| Lined route | rails `--ink`, 1.6 px; chevrons `--lit` | chevrons that point to the track; "Route: LEAD → AS73" | SME to confirm |
| Switch normal | `--green-ink` | NORMAL; hollow diamond; the ladder rails are joined | SME to confirm |
| Switch reverse | `--amber` fill, `--amber-ink` edge and word (rev.) | REVERSE; solid diamond; the track rails are joined | SME to confirm |
| Foul point | `--ink-2` | a bar across the rails; "foul point" | SME to confirm |
| Car type | `--tile-<tone>-hi` to `--tile-<tone>-lo` (grey, teal, violet, amber, blue); edge and tag `--<tone>-ink` | BX, HP, TK, CB, AR; roof detail; length | SME to confirm |
| Loaded | the type fill; tag `--on-tile` on `--tile-glyph` | solid shape | bound by the app words |
| Empty | `--well`; edge and tag in the type ink | hollow shape | bound by the app words |
| Car number | `--ink` on `--well` | the number | |
| TIED | `--ink-2` | ‖ TIED (`.dusk-state--hold`) | SME to confirm |
| LOOSE | `--amber-ink` | ■ LOOSE (`.dusk-state--caution`) | SME to confirm |
| Kickable | `--ink-2` | ⚡ KICKABLE | bound by the app words |
| Engine | `--head` body, `--lit` edge and glow, lamp `--disc-hi` | ENGINE; the shape | |
| Goal | `--lit` | BUILD; chip "3 / 4" (`.dusk-count`) | |
| Landing place | `--lit`, dashed | dashed outline; the number on a dashed plate | |
| Selected track (390) | `--lit`, `--wash-2`, `--neon-ctl` | the pressed segment; `aria-pressed` | |
| Camera frames on the map | `--lit` line, `--wash-2` fill | three frames | |
| Refusal | `--red-ink`, `--rowneon-red`, ring `--red-ink` with `--red` glow | glyph ?; the refusal words; a ring on the stand | |
| Rule chip kind | no colour | the words CROR and S.I.; dashed edge for S.I. | |
| Plates | `--well` ground, `--ring-well`, text `--ink-2` | | |

Red is in the refusal example only. Gold is chrome, selection, the engine edge, the goal, the chevrons of the route and the landing place of the move (rev.). Amber has two state uses (REVERSE, LOOSE) and one category use (centerbeam, in the legend only); each has its word. The flag "SKETCH" and the words "SME to confirm" are also amber.

## 6. New labels, page-local rules, bridge values

**New labels that the present app does not have** (all visible ones):

- Named by the brief: NORMAL, REVERSE, ENGINE, BUILD, "foul point", "Route: LEAD → AS73" (and the strip label "Route").
- Follows from the interaction: "LEAD → AS72" and the like; "LEAD → MAIN LINE" when no switch is reverse.
- Strip and head: "Job" (label of the key cell), "The Yard" (panel name; the station name of the app), "BUILD AS73" (head, before the count chip "3 / 4") (rev.).
- Legend: "Legend"; "Colour meanings · SME to confirm"; box, hopper, tank, centerbeam, autorack (the type keys of `geometry.js`); "lined route"; "From the words of the app"; "solid = loaded"; "hollow = empty"; "⚡ = kickable track"; "n / n"; "goal cars on the track"; "the move in the builder lands here" (rev.); "⋯ empty track left out"; "frame on the map = a view below" (rev., cameras only).
- Glyphs: ◇ and ◆ in the short form of the selector; ◄ and ► on the pan buttons; ⋯ as the break mark; ? on the stand plate of the refusal example.
- Sketch frame: "SKETCH · look C, model"; "Refusal example"; "not the scene: the same yard before the switches are relined"; the status bar texts ("Sketch: only the switches and the track selector work."; the six linings; "View: whole model (window 1335 px or wider)" or "View: three cameras (window under 1335 px)", where the script computes the number; "Dusk 0.2.0") (rev.).
- Not visible (accessible names): "AS73 switch, lined reverse"; "Show AS73. Switch lined reverse."; "Map of the whole yard. Route: … The frames show the track view and the lead view."; "Track that the track view shows"; "Pan toward the switch"; "Pan toward the end of the track"; "The yard in words" and its list; "Move builder"; "Skip to the yard".

**Bridge values** (one `:root` block with the comment "bridge"; each is built from Dusk tokens; no raw colour):

- `--yd-target: 44px` : the pointer target floor.
- `--yd-car-shadow: drop-shadow(0 2px 2px var(--ground-0))` : the still shadow under a car.
- `--yd-lit-glow: drop-shadow(0 0 3px var(--lit))` : the glow of the engine edge and of the lamp. `--neon-ctl` is a box-shadow and does not apply to an SVG shape.
- `--yd-red-glow: drop-shadow(0 0 4px var(--red))` : the ring of a refused switch.

**Gaps in Dusk 0.2.0 that the sketch fills with page-local rules** (prefix `yd-`):

1. Size: `.dusk-btn` has a minimum height of 29 px and a `.dusk-seg` button 24 px. `.yd-btn` and `.yd-seg button` set 44 px.
2. Size: `.dusk-skip` is 38.8 px high **[measured]**. A page-local rule on `.dusk-skip` sets 44 px. This is the one rule of the sketch on a Dusk class.
3. No select part: `.yd-select` (`--well`, `--ring-well`, 6 px corner, 44 px).
4. No window without a sidebar: `.yd-main` spans both columns of `.dusk-win`.
5. No plate part: `.yd-plate` (a word on a dark ground over a drawing).
6. No rule chip part: `.yd-chip`. No banner part: `.yd-banner`.
7. No glow token for an SVG shape: the two glow values of the bridge.
8. `details` and `summary` have no Dusk skin: `.yd-how`, `.yd-legend-fold` (44 px summary).
9. `--tile-<tone>` is a CSS gradient. An SVG shape cannot take it. The sketch builds one SVG gradient for each tone from `--tile-<tone>-hi` and `--tile-<tone>-lo`.

The class prefix is `yd-` for every page-local class (common rule 6 of the brief). The task text also permits `cb-`. The sketch uses one prefix.

## 7. Where the sketch does not follow the brief, and why

1. **The car number is under the car, not on it. The type tag is on the car, not under it.** At 1 px for each unit a box car is 42 by 20 px, and a 12 px five-digit number is 36 px wide. A plate on the car hides the roof and makes a loaded car look hollow. With the plate under the car, the shape and the load state stay visible, and the plates stay clear of the rails. The tag is at the present place (D22).
2. The stand plate has the track id before the word ("AS73 REVERSE"). The track id at the deep end is up to 900 px from the switch.
3. The plates at the deep end have one line for most tracks and three lines for the goal track (id and securement; BUILD and the chip; kickable). The first form (two wide lines) gave s = 0.972 at 1440 and no margin for the dyslexia letter spacing.
4. Ballast is `--panel-hi`, not `--panel-lo`. **[measured]** `--panel-lo` on `--glass` has a contrast of 1.02; `--panel-hi` has 1.06. Both are faint. `--panel-lo` was not tried in a picture.
5. Rails that are not lined are `--ink-3` at 62 percent opacity, so that the lined rails (`--ink`) stand out.
6. The chevrons are 9 px high and cross the rails. (rev.) No chevron stands on a bend of the route or on the foul point bar. Chevrons between the rails (4 px) were not tried in a picture; the size was chosen from the gauge.
7. The engine edge is a stroke with a filter glow, not `--neon-ctl` (gap 7).
8. The car shadow uses `--ground-0`. **[measured]** Its contrast on the floor is 1.02, so it is visible only where it falls on rails and ties. The light top edge of a loaded car carries the depth.
9. The brake-wheel mark is not drawn. The brief permits it as an extra.
10. The legend is in the empty corner of the model at 1440, not under it. Nothing of `geometry.js` is in that corner. The script moves the legend under the model when a plate or the ladder is near it.
11. The cameras are the layout at every width under 1335 px (rev.), not only on a phone.
12. The refusal is a separate panel with its own view of the throat (AS71 to AS73), because the scene is not a refusal. The foul bar there is not red: the refusal is about the lining, not about the foul point.
13. The move builder keeps the three native selects of the app. `.dusk-seg` is used for the track selector only.
14. The "15 MPH" plate is at the right edge of the frame, as today. With the plate column this is right of x = 1330 units.

The tank car has round ends. This is a car shape. It is not a control. No control of the sketch has a corner of more than 6 px.

## 8. Measurements

(rev.) The numbers of this section are the numbers of the build job, from before the repairs of section 13. Section 13 gives the numbers of the final file where they changed.

All with Playwright and Chromium on this machine. Viewport 1440 by 900 and 390 by 844. Fonts on this machine: the mono stack resolves to DejaVu Sans Mono; the UI stack resolves to the system sans-serif (`fc-match` gives Inter).

| Check | 1440 | 390 |
|---|---|---|
| Layout | whole model, s = 1.001 | three cameras, s = 1.241 (map 0.273) |
| Sideways page scroll | none (scroll width 1440) | none (scroll width 390) |
| Interactive elements (button, select, link, summary) | 18; all 44 px or more in both directions | 20; all 44 px or more in both directions |
| Smallest text | 11 px | 11 px |
| Car number | 12 px | 12 px |
| Plates that overlap, plates cut by a view | 0, 0 | 0, 0 |
| Text contrast, lowest pair | 5.56 (`--ink-3` on the key cell of the strip) | 5.56 (the same pair) |
| Text pairs under 4.5 | 0 of 31 pairs | 0 of 35 pairs |
| Console errors | 0 | 0 |
| Picture with reduced motion | byte-equal to the picture without | byte-equal |
| SVG nodes and plates in the Yard panel | 294 and 51 | 588 and 23 |
| One full redraw (mean of 20; other agents load the machine; two runs) | 9.3 ms, 9.1 ms | 18.4 ms, 15.2 ms |

Contrast of the ink and ground pairs of the model **[measured]** (maths of `/home/user/dusk/lib/color.mjs`):

| Ink | Ground | Ratio | Use |
|---|---|---|---|
| `--ink` | `--well` | 17.92 | car number, track id |
| `--ink-2` | `--well` | 11.71 | plates, labels, TIED, KICKABLE |
| `--lit` | `--well` | 12.28 | ENGINE, chip "3 / 4" |
| `--lit` | `--panel-hi` (ballast, the worst ground) | 11.43 | landing number |
| `--green-ink` | `--well` | 8.60 | NORMAL |
| `--amber-ink` | `--well` | 7.21 | REVERSE, LOOSE |
| `--amber-ink` | pressed segment (`--wash-2` on `--well`) | 6.22 | REVERSE in the selector |
| `--red-ink` | `--well` | 5.94 | ? and the refusal words |
| `--grey-ink` | `--well` | 6.10 | tag of an empty box car |
| `--on-tile` | `--tile-glyph` on the tile gradient, worst end | 7.21 grey, 7.24 violet, 7.24 amber, 7.28 blue, 7.37 teal | tag of a loaded car |
| `--ink-3` | `--panel-lo` | 6.97 | legend headings |

The other tag inks on `--well` (teal, violet, amber, blue for empty cars) are not in the scene: only empty box cars are. They are not measured here.

Limits of the contrast script: for text over an SVG shape it uses a rule (the tag on the tile gradient with `--tile-glyph`; the landing number on `--glass` and `--panel-hi`), not pixels. A glyph of `.dusk-state` takes the colour of its word.

Widths **[measured]**: no sideways scroll, no target under 44 px, no text pair under 4.5, no overlap at 1920, 1440, 1408, 1392, 1376, 1280, 1024, 768, 390, 360 and 320 px. At 320 px the pan buttons show and the plates of the panned view are cut at its edge, as designed.

Reading modes **[measured]** with test style sheets of this job (not the bridge of the app, which does not exist yet):

| Mode | How it was set | 1440 | 390 |
|---|---|---|---|
| Text scale 130 percent | every Dusk `--fs-*` token times 1.3 | cameras, two columns, s = 1.5; no overlap; no scroll | cameras, s = 1.177; the selector uses the glyph form; pan buttons show; no scroll |
| Dyslexia type | `--font-ui` to the app's stack, letter spacing 0.02 em, word spacing 0.08 em, line height 1.8. Atkinson Hyperlegible, Comic Sans and Verdana are not on this machine; the fallback drew it | whole model, s = 0.993; legend under the model; no overlap | cameras, s = 1.231; no overlap |
| High contrast | a guess: `--ink` white, brighter `--ink-2`, `--ink-3`, `--hair`, `--hair-2` | whole model; lowest text pair 5.94 | cameras; lowest text pair 5.94 |
| Reduced motion | `prefers-reduced-motion: reduce` | same picture | same picture |

The app sets "Bigger text" with `html{font-size:var(--fs)}` (`src/index.css:14`) **[read]**. The Dusk type tokens are px. A bridge must scale the tokens, or the Dusk text does not grow. This is a finding for G1, not a part of this sketch.

Keyboard and pointer **[measured]**:

- At 1440, Tab reaches the six switch buttons in the order AS71 to AS76.
- Space on AS73: `aria-pressed` is false, the name is "AS73 switch, lined normal", the plate reads "AS73 NORMAL", the route words read "Route: LEAD → MAIN LINE", the landing place and the foul point plate are gone, the live line reads "AS73 switch, lined normal. Route: LEAD → MAIN LINE." The focus stays on the button.
- Enter on AS72: the route words read "Route: LEAD → AS72".
- A pointer click 4 px inside the corner of the 44 px square of AS73 changes AS73.
- At 390, each of the six selector buttons shows its track in camera 2 with one switch button. A tap on the switch button of AS72 changes the route words and the word in the selector.

## 9. Where each motion has room

The sketch has no motion. The own CSS has no transition, no animation and no keyframes **[measured]**. The Dusk hover transitions of `.dusk-btn` and `.dusk-seg` are the only ones on the page.

- Move: the engine and its cut run on the rails, lead to foot to ladder to track, and turn with the route. In the whole model the run is in one view. In the cameras the map shows the whole run as shapes; camera 3 shows the engine leave; camera 2 shows the cut arrive.
- Couple: the coupler line closes. The 6 unit stretch is 6 px at 1440 and 7.4 px in camera 2.
- Kick: the car leaves the cut and rolls alone on the lined rails to the dashed outline.
- Arrival: the road train runs on the through route (main line, ladder, lead). The legend corner is not on that route. In the cameras the train is on the map.
- Departure: the engine and its cut run off the left edge on the lead.
- Reduced motion: the result is drawn at once. The dashed outline, the route and the banner already say what the move does.

## 10. How the build job would draw it, and what would be hard

Drawing: SVG for the shapes, DOM for the words and the buttons, one paint function with a scale and an offset (the function `paint()` of the sketch has this form). A canvas for the shapes is possible; the words and the buttons must stay DOM.

Hard parts:

1. The amount of drawing: five car shapes in two load states, the engine, the points, the stand. The sketch has all of them as code (55 lines for the cars and the engine; the paint function with the track, the points and the stand is about 150 lines more).
2. Words that follow moving shapes. A number plate is a DOM element. During a move each plate moves each frame, and on the ladder a horizontal plate under a turned car comes near the rails. The build needs a rule (for example: hide the plate while a car moves, or put it above the car on the ladder).
3. The layout rule. The whole model needs about 1 px for each unit, so it needs a viewport of 1335 px (rev.). Most laptop and tablet widths get the cameras. The rule depends on measured text, so the dyslexia type and the text scale change the layout. The build must test both sides of the threshold.
4. The cameras during motion: three views of one move. The arrival cinematic crosses the whole yard; only the map shows all of it, and the map has no detail.
5. Camera 3 with a long held cut: the engine rests up to 320 units left of the frame (`geometry.js:60-62`). The view needs a pan or must follow the far end of the cut.
6. The filter shadows (one for each car, one for the engine). **not verified**: the cost on a low-end phone.
7. A second focus path on a phone: the selector, then one switch button. A person who uses a keyboard on a narrow window does two steps for each switch.
8. The legend corner: the script tests plates and the ladder. A new label in a later puzzle can move the legend under the model.

## 11. Not verified

- The high contrast mode and the dyslexia type of the real bridge. The test style sheets are guesses. The dyslexia fonts are not on this machine.
- The look with other fonts (Windows, macOS, iOS, Android). The layout measures text at run time; no picture was made on those systems. Chromium only.
- A screen reader. The names, the live line and the text mirror are in the page; no screen reader read them.
- Touch on a real phone. One tap was sent with Playwright touch emulation.
- Colour-vision deficiency. The numbers in the brief are R1's. This job did not measure them.
- Scenes that are not in `scene.json`: a centerbeam car on a track (the shape is in the legend only), a single car with no tag, a long cut (p5-long), a long held cut, the switch-list check, a depart goal, the arrival cinematic. The pan buttons were seen only at 320 px and at 390 px with large text, not with a long cut.
- Banner tones none and win.
- Any motion. Any sound.
- The cost of the SVG filters and of a redraw on a phone. The redraw times in section 8 are from this machine under load.
- Whether the gold chevrons and the gold landing outline read as "chrome and selection" to the owner, or as a state. Dusk says gold is never a state.

## 12. Notes for the SME

This job writes and corrects no rule. These are questions about what the picture could teach.

- S1. Switch colours. The sketch keeps green for NORMAL and a dark yellow for REVERSE, as the app text says (`yardSim.js:190-191`). `render.js:2` calls yellow a rule convention; that claim is not verified (T12). Is there a convention for a switch target, and does this use agree with it?
- S2. Switch target shape. The target is a hollow diamond for normal and a solid diamond for reverse. Does a real target show the lining by shape, and could this picture teach a false shape?
- S3. The words NORMAL and REVERSE. The sketch takes them from the messages of `model.js` ("lined normal", "line its switch reverse"). For each ladder switch the app calls the ladder leg normal. Is that the right word for these switches?
- S4. The lined route. Bright rails and gold chevrons mark the route. Could a learner take this for a signal indication or for permission to move?
- S5. The term "foul point" and its mark. The bar is 30 units from each switch, not red. Is the term right (or "clearance point"), and is a mark of this kind expected on the ground?
- S6. End stops. The model draws an end stop at the deep end of each body track. The present drawing has none. If these tracks are open at both ends in the yard that the trainer means, the end stop teaches a false thing. The owner or the SME decides.
- S7. TIED and LOOSE. TIED is neutral (`--ink-2`), LOOSE is caution amber. Are the words right for a secured and an unsecured cut?
- S8. Car colours. The colours are categories of this app only. Violet for a tank car could be read as a dangerous goods mark. No colour here is a commodity or a hazard code.
- S9. The engine. The model shows a cab near the cars and a headlight with a beam at the end away from the cars (the present dot, made more visible). Does the position of the lamp or of the cab teach anything false about which way the engine faces or moves?
- S10. Car shapes. The roof details are generic pictures (three roof lines, four hatches, a dome, a centre beam, close lines). They claim no real car design.
- S11 (review). The landing place. The dashed outline shows the car of a KICK at rest against the standing cut, with no gap. The place comes from `spotPlan()` of `model.js`. Could this picture teach a false thing about where a kicked car stops, or about a kicked car and a coupling?
- S12 (review). The points. The model shows the lining with a gap in the rails of the leg that is not lined, and with two short bright blades on the lined leg. This is a picture convention of the sketch. Could it teach a false thing about how a switch looks or works?
- S13 (review). The label "MAIN LINE → the road" and the label "15 MPH · REDUCED (CROR 105)" are words of the present app. In the cameras they stand above the map, not at a place on a track. Does the speed label need a place on the ground to be true?

## 13. Eye review

An independent review of the sketch. Date: 2026-11-20. The reviewer did not build the sketch. The reviewer took new pictures, measured the built file with new scripts, repaired each defect in the source, built the file again with `inline-dusk.mjs`, took both pictures again at scale 2 with `shot.mjs`, and looked at the final pictures. The scripts are in the scratch folder of the review (the list is at the top of this file).

Status words of this section: **pass** (checked, no defect), **repaired** (a defect; the text says what changed), **open** (not repaired; the text says why). Each number is from a script of the review on the final file, unless the text says "read" or "seen".

### 13.1 Verdict

The sketch reads. At 1440 px one look gives each car, its order, its type, its load state, the lining of each switch, the route, the engine, the tied cuts and the loose cut, and the goal. The data is true to the scene. The words are the words of the app.

- Best: the whole yard as the thing itself, in one view, at true length. The lined route and the place where the move lands are easy to see. The switch is a real button with a word beside it.
- Worst: the whole model needs a window of 1335 px or wider and the full width of that window. Below that width the look becomes three views (a map with no word, one track, the lead). The state is then in three places, and the learner sees one switch and one track in detail at a time.
- Before the pick, the owner must know the six points of 13.6.

### 13.2 The checks

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Truth of the scene | **pass**; one repair in the chrome | `truth.mjs` compares the drawn page with `scene.json` (not with the copy in the page). 0 differences at 1440 px and at 390 px (each of the six tracks selected in turn): 13 cars, each with its track, order, type tone, load state, type tag and number; car centres within 1.5 px at 1440; one engine; the held car 70110; six switch buttons with their names and `aria-pressed`; the stand words; TIED on AS73 to AS76, LOOSE on AS72, no tag on AS71; BUILD 3 / 4; the landing place of 70110; the three labels; the work order, the banner, the builder, the legend line, the eight chips, the refusal words. The scene object in the page is deep-equal to `scene.json` (`static.mjs`). `puzzles.js:317-334` (read): start, goal, par, rules and kickable track agree with the scene. Controls against `yardSim.js:142-209` (read): no control lost, no control renamed. See 13.3 for the controls that the sketch adds. **Repaired:** the legend line (C9) had lost the emphasis of the app; now "special instruction" and "this" are in italic and "you must know your yard's." is bold, as in `yardSim.js:176-180`. `c12.mjs`: the text of C9, C11 and C12 is equal to the app text. |
| 2 | The inventory | **pass**, with the differences of 13.4 | Each of the 45 elements is in the picture or has a stated place. 13.4 lists the elements that differ from the present drawing. |
| 3 | The two-second read | **pass** at 1440; **pass with limits** at 390; two repairs | Seen in new pictures at scale 2, and in clips at scale 3 and 4. **Repaired:** a route chevron stood on the foul point bar of the lined track and hid it; a chevron stood on each bend of the route and looked bent. Now no chevron stands on a bend or on the foul point bar. **Repaired:** on a phone nothing in sight said what the gold frames on the map are; the legend of the cameras now has the row "frame on the map = a view below". The misreads that remain are in 13.5. |
| 4 | Self-contained | **pass** | `static.mjs`: one file; 2 style blocks, 1 script block; no `link`, no `script src`, no `@import`, no `import`, no `fetch`, no `@font-face`, no `img`. The one "http" string is the SVG namespace name. The two `url(#…)` strings point to gradients in the same file. The block `data-dusk` holds the six layer files byte for byte (27090, 2063, 23291, 10597, 5775 and 3667 bytes) and nothing more. The built file with the Dusk block taken out is equal to the source file. |
| 5 | No raw colour | **pass** | `static.mjs`: 0 hex colours, 0 colour functions (`rgb`, `hsl`, `oklch`, `oklab`, `lab`, `lch`, `hwb`, `color-mix`), 0 colour names as values, 0 inline `style` attributes in the own CSS, the own script (without the scene object) and the body markup. |
| 6 | Dusk laws | three **repaired**, two **open** | **Repaired:** the head bar had the words "BUILD AS73 ·" inside the `.dusk-count` chip; a count chip holds a figure. Now "BUILD AS73" stands before the chip and the chip holds "3 / 4", as on the plate of the track. **Repaired:** the solid reverse target took the ink token as its fill; it now takes the fill token `--amber` and keeps the `--amber-ink` edge (the two have the same value in Dusk 0.2.0, so the picture is the same). **Repaired:** two raw corner values of 2 px (number plate, type tag) are now `--r-chip`. Pass: tile tones are the car type (a category); state colours have a word or a glyph (NORMAL, REVERSE, ‖ TIED, ■ LOOSE, ? and the refusal words); red is in the refusal example only; no control has a corner over 6 px (the round ends of the tank are a car shape); each interactive part has the Dusk focus ring (2 px line, 2 px offset, read from the computed style and seen in a clip). **Open 6a:** gold (`--lit`) marks the chevrons of the route, the landing place, the goal word and the engine edge. Dusk says gold is chrome and selection and never a state. The brief asks for each of these in `--lit`, and each has words beside it ("Route: LEAD → AS73", the number on the dashed plate, BUILD, ENGINE). The reviewer did not change a colour that the brief names. The owner decides. Measured: gold and the amber of REVERSE are 15.1 apart (CIEDE2000, normal vision). **Open 6b:** Dusk non-negotiable 2 says that no text depends on JavaScript. The sketch draws its words from the scene object with a script (common rule 1 of the brief). The app is a script application, so the build has the same condition. |
| 7 | Measured at 1440 and 390 | two **repaired**, then **pass** | **Repaired:** a full-page picture makes the panel 8 px wide for one frame; the script then wrote negative sizes into the SVG and the console got 3 errors for each picture. `shot.mjs` did not show them, because it prints before they arrive. Now the script draws nothing under a panel width of 240 px and keeps the last picture. Console errors after the repair: 0 in each run. **Repaired:** each stand plate went 3.5 px under its own switch button at 1440, and 1.2 px at 390. Now a 3 px gap is between each plate and its button, and the views of camera 2 and camera 3 take their height from the measured word plate. Final numbers: 13.7. |
| 8 | Motion off, text at 125 percent | **pass**; one repair | The pictures with `--reduce` are byte-equal to the pictures without (`cmp`). The own CSS has no transition and no animation. Text at 125 percent (each Dusk type token times 1.25): no sideways scroll, no target under 44 px, no text cut, no plate cut, no overlap, at both widths. At 1440 px with text at 125 percent the page changes to the three cameras, because the number plates do not fit under the cars. **Repaired:** the new legend row was cut at 390 px with large text and with the dyslexia test sheet; a legend item now wraps. The dyslexia test sheet (a fallback font; the real fonts are not on this machine): no defect at both widths. |
| 9 | "SME to confirm" | **pass** | The legend has the heading "Colour meanings · SME to confirm" over the car colours, NORMAL, REVERSE, the lined route, the foul point, TIED and LOOSE, in both layouts. The token map (section 5) has the mark on each row. Rule numbers on the page: CROR 105 (label of the app), the eight chips of the puzzle, CROR 104 in the refusal text of `model.js`, and the closed "How to play" block of the app. No other rule text and no other rule number. |
| 10 | The direction | **pass** | The look is the pictorial model: rails, ties, car shapes, an engine shape, true geometry, one uniform scale. No repair moved it toward a panel or a list. |

### 13.3 The repairs, in one list

1. No chevron on the foul point bar or on a bend of the route.
2. Each stand plate is clear of its switch button by 3 px.
3. No drawing under a panel width of 240 px: no negative SVG size, no console error.
4. The legend line of the rules has the emphasis of the app again.
5. Head bar: "BUILD AS73" and then the count chip "3 / 4".
6. The status bar gives the window width from which the whole model shows. The script computes the number (1335 px on this machine). Test: 1335 px gives the whole model, 1334 px gives the cameras.
7. Side-by-side cameras (panel of 700 px or wider): the map has a scale of 0.5 at most. At 1280 px the three views now end at 609 px from the page top. Before, the map alone was 334 px high (computed: 0.8 times 418 units) and the track view started at the lower edge of an 800 px screen (seen in a picture at 1280 px). The two labels above the map keep the width of the map. The odd rule over the lead view is gone.
8. Legend: "the called move lands here" is now "the move in the builder lands here". The move is set in the builder; it is not called. New row in the cameras: "frame on the map = a view below".
9. The break mark "⋯" stands on the track, not on the middle of the strip.
10. Tokens: `--amber` for the solid target; `--r-chip` for two small corners.
11. Status bar: the first sentence is shorter ("Sketch: only the switches and the track selector work."), so that the bar stays on one line at 1440 px.

Controls that the sketch has and the present app does not have: six switch buttons (they replace the click on the canvas); six track selector buttons and, when a cut is longer than the view, two pan buttons (cameras only); the summary "Legend" (cameras only); the skip link. The refusal example has "Look it up →", which the app shows in a refusal. No control of the app is lost or renamed.

### 13.4 Inventory elements that differ from the present drawing

All other elements are in the picture as the inventory says.

- D2: the frame is the Dusk framed panel (lit edge, 8 px corner, head bar), not a 12 px corner with a drop shadow.
- D3: no fixed bitmap. The script sets the scale from the panel width.
- D7: an end stop at the deep end of each body track (the brief asks for it; SME note S6).
- D12: normal is a hollow green target, reverse is a solid amber target, each with its word.
- D13: no glow.
- D14: the foul point bar is `--ink-2`, not red. The words "foul point" are at the lined track only.
- D16: TIED is neutral with ‖, LOOSE is amber with ■. Today TIED is yellow and LOOSE is red.
- D17: "⚡ KICKABLE" is whole (today it is cut).
- D21: the number is under the car on a plate, 12 px at every width. The brief asked for the number on the car and the tag under it; section 7 item 1 gives the reason for the change. The reviewer agrees: seen at scale 4, the roof and the load state stay visible.
- D23: a coupler mark between the cars of one cut.
- D24, D25: the engine has a hood, three fans, a cab and a beam; the word ENGINE.
- D27 to D31: not drawn. The sketch is a still picture. Section 9 says where each motion has room.
- C3: three strip cells in place of one line (the brief asks for it). The line "Moves 4 / par 6 · Joints 2" is the accessible name of the strip.
- C5, C7: not in this puzzle. C8: tones ok and bad only.
- C10: an S.I. chip has the tag "S.I." and a dashed edge. Today a colour carries the kind.
- Order: the work order is under the model. Today it is above the canvas.

### 13.5 What a first-time learner can misread

At 1440 px:

1. The number 70110 is in the picture two times: under the held car on the lead, and in gold on the dashed plate at AS73. A learner can take the dashed outline for a car that is on AS73. The dashed line, the legend row and the count "3 / 4" speak against it.
2. The two short bright blades at each normal switch look like a small lit mark. They are not a state of their own.
3. The switch button is a faint square around the target. The still picture does not show that the square is a button. The focus ring is not in the picture, because nothing has the focus.
4. Amber (REVERSE, LOOSE) and gold (route, goal, engine, landing place) are both warm. The words separate them.
5. The refusal example is a second, small model under the page. The sub-line says that it is not the scene.

At 390 px:

6. The track selector shows the word NORMAL or REVERSE under each track id. A learner can press it to line a switch. It only selects the track of the track view. No word in sight says this (the name for a screen reader says "Show AS73"). A label in sight is a new word; the brief names none. **Open.**
7. The state is in three views. To see tied against loose for all tracks, the learner must select each track in turn: the map and the selector show no TIED and no LOOSE. **Open:** this is the strategy of the brief.
8. The break mark hides the empty run. The length of a track is true on the map only.
9. "MAIN LINE → the road" and "15 MPH · REDUCED (CROR 105)" stand above the map, not on a track (SME note S13).
10. The switch button is 876 px above "Work it ▸" (539 px and 1415 px from the page top). The open legend (349 px) and the work order are between them. The sketch opens the legend so that the picture shows it.

### 13.6 What the owner must know before the pick

1. The 1440 picture shows the best case. The whole model needs a window of 1335 px or wider, and the Yard must have the full width of the window. The present app has a column of 920 px (`src/index.css:6`, read). In a column of that width this look is the three cameras on every screen.
2. A laptop window of 1280 px, a tablet, and a 1440 px window with text at 125 percent get the three cameras. The two pictures do not show this layout at laptop width. The reviewer looked at it at 1280, 1024 and 768 px: it works and has no defect, and it is the weakest form of the look.
3. On a phone a keyboard reaches one switch button at a time. The order "Tab from AS71 to AS76" holds in the whole model only.
4. This look has the most drawing work of the three, and words that must follow moving shapes (section 10).
5. Gold has more jobs here than Dusk gives it (check 6, open 6a).
6. Each colour meaning and each new picture convention is for the SME to confirm (section 12, S1 to S13). The end stops, the target shapes and the points are pictures that the present app does not have.

### 13.7 Numbers of the final file

Playwright with Chromium, device scale 1 for the checks. Other agents used the machine at the same time; no timing is in this table.

| Check | 1440 | 390 |
|---|---|---|
| Layout | whole model, s = 1.001, legend in the corner | three cameras, s = 1.241, map 366 by 114 px, no pan |
| Sideways page scroll | none (1440 of 1440) | none (390 of 390) |
| Page height | 1405 px | 2904 px |
| Interactive elements | 18, all 44 px or more in both directions | 20, all 44 px or more in both directions |
| Switch buttons | six, 44 by 44 px, step 70 px across and 52 px down, no overlap | one, 44 by 44 px; six selector buttons of 58.7 by 44 px |
| Smallest text | 11 px (`--fs-xs`) | 11 px |
| Car number, type tag | 12 px, 11 px | 12 px, 11 px |
| Box car body | 39.7 by 20 px | 49.2 by 24.8 px |
| Plates that overlap, plates under a button, plates cut by a view | 0, 0, 0 | 0, 0, 0 |
| Text cut by a container | 0 | 0 |
| Text contrast, lowest pair | 5.62 (`--ink-3` on the key cell of the strip) | 4.53 (the refusal words where they stand on the red glow of the banner edge); next 5.48 |
| Text and ground pairs under 4.5 | 0 of 56 | 0 of 61 |
| Console errors | 0 | 0 |
| Requests to another file | 0 | 0 |

How the contrast was measured: the script reads the colour of each visible text node, hides all text, takes a picture, and reads the ground pixels under each text box (1 px in from each edge). It takes the ground at the 90th and at the 10th percentile of luminance and keeps the lower of the two ratios. The maths is `/home/user/dusk/lib/color.mjs`. An emoji and the text of a closed block are not in the measure. With the lightest single pixel in place of the percentile, the lowest tag on a loaded car is 4.79 (HP, white on the sunk square over the teal tile); this was measured before the repairs, and the repairs changed no tag colour.

Widths (`widths.mjs`): no sideways scroll, no target under 44 px and no plate cut at 1920, 1440, 1366, 1336, 1335, 1334, 1280, 1024, 768, 700, 600, 390 and 360 px. At 320 px the pan buttons show and a type tag of the panned view is cut at the edge of the view, as designed. A live change of the window from 1440 to 1000, 390, 844, 320 and back draws the right layout each time with no console error.

Keyboard and pointer (`kb.mjs`): at 1440 the Tab order is skip link, "← Home", picker, the six switch buttons AS71 to AS76, the builder. Space on AS73 gives `aria-pressed="false"`, the name "AS73 switch, lined normal", "Route: LEAD → MAIN LINE", no landing place, and the live line "AS73 switch, lined normal. Route: LEAD → MAIN LINE."; the focus stays on the button. Enter on AS72 gives "Route: LEAD → AS72". A click 3 px inside each corner of a button changes the switch. At 390 with touch: a tap on a selector button shows that track; a tap on the switch button of AS72 changes the route words, the word in the selector and the live line.

### 13.8 Not verified

- A screen reader. No screen reader read the page.
- A real phone and a real touch. Playwright touch emulation only.
- Fonts of other systems. The layout measures text at run time; the width of 1335 px is for the fonts of this machine (the mono stack resolves to DejaVu Sans Mono here).
- The high contrast mode and the dyslexia type of the app bridge. The bridge does not exist yet. The review used a test sheet for the dyslexia type and did not test a high contrast sheet. With forced colours the 1440 model keeps its drawing and its words (one picture, seen); this is not a design target.
- Colour-vision deficiency. The review measured gold against amber for normal vision only.
- Scenes that are not in `scene.json`: a centerbeam on a track, a single car, a long cut, a long held cut (the engine goes off the left edge, as today), a depart goal, the switch-list check, the arrival, banner tones none and win.
- Any motion, any sound, the cost of the SVG filters on a phone.
- Whether "foul point", NORMAL, REVERSE, the target shapes, the end stops and the colours agree with rail practice. See the notes for the SME.
