# Look B, "list": the yard as a live switch list

Wave 1 sketch. Read-only on all code and content. Date of the work: 2026-11-20.

Files:

- `look-list.src.html`: the source. It holds the marker line for the Dusk layers, the page-local CSS, the markup, the scene object and the script.
- `look-list.html`: the built file. One file, inline CSS and JS, no external file. It is the output of `inline-dusk.mjs` on the source.
- The scene object and the two text blocks of the app were put into the source by a script (`build.mjs` in the scratch folder), not typed. The source is complete without that script.
- `look-list-1440.png`, `look-list-390.png`: full-page pictures at scale 2.

Each statement below is checked, with the command or the place, or it is marked "not verified". The check scripts of the designer are in the scratch folder `look-list/` (`measure.mjs`, `verify.mjs`, `a11y.mjs`, `facts.mjs`, `facts2.mjs`, `clip.mjs`, `build.mjs`).

Sections 1 to 11 are the record of the designer. An independent reviewer then examined the sketch, repaired it and rebuilt it on the same day. Where a repair changed a fact, the reviewer corrected the text of sections 1 to 11. The record of the reviewer is the last section, "Eye review". The check scripts of the reviewer are in the scratch folder `critic-list/` (`audit.mjs`, `truth.mjs`, `static.mjs`, `nontext.mjs`, `replay.mjs`, `variant.mjs`, `cols.mjs`, `clip.mjs`).

## 1. What the look is

The yard is a table. One row is one track. There is no track drawing and no scaling.

- The rows run from the top: MAIN LINE, AS76, AS75, AS74, AS73, AS72, AS71, then the lead. AS71 is below AS76 and the lead is below AS71.
- A spine runs down the Switch column. It is the ladder. Each track row has one switch button on the spine.
- From the lead, the lined route is one lit line: from the far end of the held cut, to the foot, up the spine, into the reverse switch, along the rail of that row, to the dashed slot where the next car lands.
- In each row the cars are capped tiles, in their true order from the throat. The tile width follows the car length. Tiles of one cut touch. A dotted mark separates two cuts.
- The Room column shows each track to one common scale: the track, the foul tick, and the cars at the far end.
- The work order, the move builder and the banner stand beside the yard at 1440 px and below it at 390 px.

The view transform is a projection of each track to an ordered list. The page uses the order of the cars, their lengths, the cut boundaries and the distance of each cut from its switch. It does not use y. It changes no length and no clearance of `geometry.js`.

## 2. Where the sketch departs from the brief, and why

1. **Column order.** The brief: Switch, Track, Cars, State, Room. The sketch: Track, State, Switch, Cars, Room. Reason: with the spine in the first column, the lead row shows the engine between the ladder and the held cars, and "◄ DEPARTURE" points at the ladder. That is false. With Track and State left of the spine, the lead row uses those two columns: departure at the left, then the engine, then the held cars, then the foot of the ladder. The topology is the same as in the present drawing. The track id is also the first cell of each row, which is the cell that Dusk styles as the key of a row.
2. **The lead at 390 px** is a stem below the ladder, not a row. The car nearest to the yard is at the top, the engine is below it, the headlight is at the bottom of the engine. A short rail goes on below the engine, and the label "◄ DEPARTURE · LEAD / DRILL" stands below that rail, at the departure end. No sticky position is used: a sticky block at the bottom of a phone window covers targets.
3. **Glyphs.** The switch glyph is an inline SVG (a straight leg, or a leg that turns with an arrow), not the characters "│" and "└→". The foul tick and the gap mark are CSS shapes, not the characters "┃" and "┊". Reason: box-drawing characters depend on the font of the device.
4. **Room bar.** The brief: occupied length over track length. The sketch adds: all bars use one scale (the longest track, AS71, is the full width), the cars stand at the far end of the bar, and a tick stands at the foul point (30 units). The left ends of the six bars step in, as the ladder does. The lead bar uses the same scale and the lead limit of the scene (558 units); it is left-aligned. The bar has an edge in `--ink-3`: the ground of the bar (`--well`) against the panel measures 1.06 to 1, so the edge carries the length.
5. **Lined route width.** The brief: a 2 px line, lit. The sketch: 4 px lit, 2 px not lit. Reason: `--lit` against `--ink-3` is only 1.70 to 1 (computed with `lib/color.mjs`), so the width also carries the difference.
6. **Switch button ground.** The button keeps the lit edge of `.dusk-btn`, but its ground is `--well`, not the gold wash. Reason: `--amber-ink` on the gold wash over the hot row measured 4.43 to 1. On `--well` it measures 7.21.
7. **Tile edge.** A 1 px border in the tone ink. No glow. The Dusk tile glow (30 px) runs over the next tile when tiles touch.
8. **The goal tag "→ AS73"** stands above its tile (1440) or beside it (390 stem). A row that holds a tag gets 14 px of headroom. Tested with a scratch copy of the scene in which 70222 is a goal car.
9. **Interaction.** The brief permits one small interaction (line a switch). The sketch also lets "Work it ▸" and "Reset" act, only with answers that the scene file holds: the win of the next move (`nextMove.afterIt`) and the refusal (`refusalExample.text`). For any other call the banner shows a flag that begins "Sketch:". The page invents no engine answer.
10. **Tab order** runs top to bottom, AS76 to AS71, not AS71 to AS76. Reason: it is the visual order and the reading order. A positive `tabindex` moves the six switches before the title bar and the picker.
11. **Two prefixes.** `cb-` marks a gap that any Clear Board page has (12 classes in the page CSS). `yd-` marks a part of the Yard list (95 classes in the page CSS; counted by `static.mjs`).
12. **The car count** (added by the reviewer). The brief: the Room cell holds the bar and the car count ("3 cars"). The sketch: the count stands below the track id, at both widths. The Room cell holds the bar only. Reason: below the head "Room", the words "0 cars" on the empty track read as "no room". The empty track has the most room. For the lead the count reads "Holding 1 car", beside the label.

## 3. How each inventory element reads

| # | Element | In this look |
|---|---|---|
| 1 | D1 floor | `--glass` window floor; the table sits in a framed panel (`--panel-fill`) |
| 2 | D2 frame | `.dusk-panel--framed`: lit edge, 8 px corner. No shadow frame |
| 3 | D3 size and scale | Gone. Nothing is scaled. Sizes are CSS pixels at each width |
| 4 | D4 main line | The first row of the table. The spine turns right into the words. Dim |
| 5 | D5 ladder | The spine in the Switch column |
| 6 | D6 lead / drill | The last row. A dim rail runs from the left edge to the engine; a lit stub runs from the last held car to the foot. At 390 px: a stem, with a dim rail below the engine |
| 7 | D7 body tracks | Six rows. Each has a rail from its switch button to its first car. No end stop |
| 8 | D8 label | "◄ DEPARTURE · LEAD / DRILL", whole, in the lead cell. At 390 px it stands below the engine, at the departure end |
| 9 | D9 label | "MAIN LINE → the road" in the main line row |
| 10 | D10 label | "15 MPH · REDUCED (CROR 105)" at the right of the main line row |
| 11 | D11 label plate | Not necessary. No rail and no car passes over a label |
| 12 | D12 switch target | A button, 44 px high, 119 px wide (1440) or 124 px (390), with the word NORMAL or REVERSE and a glyph |
| 13 | D13 switch glow | Gone. The reverse switch has the word REVERSE, the turn of the spine and the hot row |
| 14 | D14 clearance tick | A tick in `--ink-2` on the rail at the start of each Cars cell; the words "foul point" in the column head (1440) and in the Key (both widths, two times); a second tick on the Room bar, to scale. None on the lead |
| 15 | D15 track id | The Track cell, 14 px mono bold |
| 16 | D16 TIED or LOOSE | The State cell: "‖ TIED" (`.dusk-state--hold`), "■ LOOSE" (`.dusk-state--caution`), 12 px. Only for 2 or more cars |
| 17 | D17 kickable mark | "⚡ KICKABLE" in the State cell, 12 px, `--ink-2`. It is not cut |
| 18 | D18 car | A compact capped tile, 44 px high. Width is the length times 1.3 px, 56 px or more: box 56, hopper 61.1, tank 65, autorack 97.5 (measured). Position is the order in the row |
| 19 | D19 type colour | Cap tone: box grey, hopper teal, tank violet, centerbeam amber, autorack blue. The tag is always on screen |
| 20 | D20 load state | Loaded: solid cap in the tone, number in `--on-tile`. Empty: hollow, `--well`, edge in the tone ink, number in `--ink`, and the letter E |
| 21 | D21 car number | The cap, 12 px mono bold. It is never reduced |
| 22 | D22 type tag | BX, HP, TK, AR in the tile body, 11 px mono bold. CB is in the Key |
| 23 | D23 cut and gap | Tiles of one cut touch. A 22 px gap with a dotted mark separates two cuts (AS72). The gap is not to scale in the Cars cell; it is to scale on the Room bar |
| 24 | D24 engine | A tile, 83.2 px wide (64 units), `--head` ground, `--neon-ctl` edge, the word ENGINE |
| 25 | D25 headlight | A `.dusk-eye` dot at the end away from the cars: left at 1440, bottom at 390 |
| 26 | D26 held cut | The held cars follow the engine toward the foot. A long cut wraps; the engine never leaves the frame. See section 9 |
| 27 | D27 move animation | No stage. A move is a change of rows. See section 7 |
| 28 | D28 shove animation | Not shown. The branch does not run today |
| 29 | D29 arrival cinematic | No stage. A gap of this look. The main line row is the one place for the road train. See section 7 |
| 30 | D30 departure run | No stage. The lead row tiles leave toward "◄ DEPARTURE" |
| 31 | D31 watch optimal | The button is there. It does not act in the sketch |
| 32 | Pointer | Each switch is a button. Pointer, Space and Enter change it. A focus ring is visible |
| 33 | C1 back button | "← Home" in the title bar, 72.6 by 44 px |
| 34 | C2 picker | A native select in the strip, with the group label and the option label of the scene. The marks "✓" and "→" are not shown: the scene does not say which applies |
| 35 | C3 readout | Strip cells Moves 4, par 6, Joints 2. The whole readout string is the accessible name of the strip. Dusk prints cell labels in capitals by CSS; the words in the markup are the app's |
| 36 | C4 work order | A framed panel: top line in the head, then the job line, the target line and the tip |
| 37 | C5 switch-list check | Not in this puzzle. Not shown |
| 38 | C6 move builder | Action and track are `.dusk-seg` groups (today: selects). The count is a select. "Work it ▸", "▶ Watch optimal", "Reset", the sound button. The count is disabled for SECURE |
| 39 | C7 depart button | Hidden for this puzzle, as in the app. Not shown |
| 40 | C8 banner | One block below the builder. ok: "✔" and green ink. Refusal: "?" and red ink, with "Look it up →". Win: green ink, the words hold their own "✓" |
| 41 | C9 legend line | Whole, above the chips |
| 42 | C10 rule chips | Eight chips. A CROR chip carries the word in its cite. An S.I. chip has the tag "S.I." and a dashed edge. No category colour |
| 43 | C11 note | Whole. Copied from `yardSim.js` by the build script; the inline styles are removed |
| 44 | C12 how to play | A closed details block, whole, copied the same way. Summary target 44.8 px high |
| 45 | Not in the present drawing | Added: a car count for each track (below the track id) and for the engine ("Holding 1 car"); a room bar; a goal mark (BUILD, "3 / 4", "→ AS73"); a mark of the lined route; a word for the switch state; the word ENGINE; a mark of the car the move takes and of its landing place; the table as the text alternative |

## 4. The 390 strategy

Stack. No transform and no scaling.

- Below 760 px each row is a block. Line 1: the switch button, the track id with the car count below it, the state words and the goal chip. Line 2: the foul tick, "throat ▸" and the tiles. Line 3: "Room" and the bar.
- The spine runs down the left edge of the blocks, lit from the lead up to the reverse row. In the reverse row it turns into the button. From each button a rail drops to the line of cars; it is lit in the lined row.
- Tiles wrap when they do not fit. At 390 px with this scene no row wraps (each car list is one line; `cols.mjs`). With the type tokens at 1.25 times, AS73 wraps to two lines at 390 px and stays on one line at 1440 px (seen in the test pictures). The first line stays at the throat mark. One line of the Cars cell takes four box cars at each width (measured cell: 323 px at 1440, 322 px at 390).
- The lead is the last block, as a stem (section 2, item 2).
- The hot row draws one wash and one lit line pair for the block. Dusk draws them on each cell, which makes stripes in a stacked row. The zebra wash of each second row is also drawn for the block.
- The Switch cell is as high as line 1 and the button stands at its top. The spine and the drop rail join the button at fixed offsets, so the join holds when the state words take three lines.
- The table has explicit ARIA roles, so the stacked rows stay rows and cells in the accessibility tree (checked with `ariaSnapshot()` at 390 px). The column heads are hidden at 390 px. The Room cell shows its `data-label`; the other cells carry their own words.

Cost, measured after the repairs (`cols.mjs`): the yard panel is 1097 px high at 390 px. The "Work it ▸" button is 1740 px from the top of the page. At 1440 px the yard is 984 by 582 px and the button is at 501 px.

## 5. Token map

| Meaning | Token | Word or glyph that also carries it | Mark |
|---|---|---|---|
| Car type box, hopper, tank, centerbeam, autorack | cap `--tile-grey`, `--tile-teal`, `--tile-violet`, `--tile-amber`, `--tile-blue`; edge and tag in the matching `--<tone>-ink` | tag BX, HP, TK, CB, AR; tile width | SME to confirm |
| Loaded | solid cap, number in `--on-tile` | solid shape | App words |
| Empty | `--well`, number in `--ink` | hollow shape; the letter E | App words; E is new |
| Switch normal | `--green-ink` on `--well` | NORMAL; straight glyph; the spine passes | SME to confirm |
| Switch reverse | `--amber-ink` on `--well` | REVERSE; turning glyph; the spine turns in; `aria-pressed="true"` | SME to confirm |
| Lined route | `--lit`, 4 px; row `--wash-4` and `--neon-row` (`.dusk-hot`) | "Route: LEAD → AS73"; one joined line | SME to confirm |
| Track not lined | `--ink-3`, 2 px | not joined to the spine | |
| Foul point | `--ink-2` | a tick; "foul point" | SME to confirm the term |
| Room | bar ground `--well`, edge `--ink-3`, cars `--grey` (`.dusk-heat`), tick `--ink-2` | the head "Room"; the Key line | No state. A length |
| TIED | `--ink-2` | ‖ TIED | |
| LOOSE | `--amber-ink` | ■ LOOSE | |
| Kickable | `--ink-2` | ⚡ KICKABLE | App words |
| Engine | `--head`, edge `--neon-ctl`, headlight `--lit` | ENGINE | |
| Goal | `--lit` | BUILD; chip "3 / 4"; tag "→ AS73" | |
| Next move | `--lit` outline; `--lit` dashed slot | the slot holds the car number; a screen reader gets "the next move puts 70110 here" | |
| Refusal | `--red-ink`; switch edge `--rowneon-red` | "?" and the refusal words; "?" on the switch; "Look it up →" | Red has no other use |
| Move done | `--green-ink` | ✔ and the words | |
| Rule chip kind | `--ink-2`; S.I. dashed edge | CROR in the cite; the tag S.I. | No category colour |

Bridge: the page has one `:root` block with the comment "bridge". It holds eleven sizes (44 px tap, 1.3 px for each unit, tile height, spine offsets, rail widths, tag headroom). It holds no colour. The sketch needed no colour that Dusk does not have.

Gold is used for chrome and selection: the lit edges, the pressed segments, the route, the goal, the next move. The plan says "gold is chrome only"; the Dusk source says "chrome and selection". The lead decides.

## 6. Measurements

All from Playwright with Chromium, device scale 1, on the built file. Fonts that the test machine used (read with the browser's font report): Inter for the UI stack, DejaVu Sans Mono for the mono stack, DejaVu Sans for the glyph ⚡, Noto Color Emoji for 🔊. The fonts of a user device are not verified.

The figures below are those of the rebuilt file, measured by the reviewer (`audit.mjs`, `truth.mjs`, `static.mjs`, `nontext.mjs`), unless a line says "designer".

- **Sideways scroll:** none at 1440, 390, 320, 761, 1024 and 1180 px (`scrollWidth` equals `clientWidth`).
- **Targets:** 25 interactive elements at each width (26 in the refusal state). Smallest: 44 by 44 px. None under 44 px. Switch buttons: 119 by 44 (1440 and 1024), 124 by 44 (390 and 320), 105.3 by 44 (761), 100.5 by 44 (1180).
- **Smallest text:** 11 px (`--fs-xs`). Car number 12 px. Type tag 11 px.
- **Text contrast:** 40 ink and ground pairs at each width (text nodes and the text of pseudo-elements), computed with `/home/user/dusk/lib/color.mjs` from the computed colours; each ground is the composite of all ancestors, and for a gradient the worst stop. None under 4.5, also in the refusal state and the win state. The lowest: white on the box cap 4.55; white on the tank cap 4.56; white on the centerbeam square of the Key 4.56; white on the autorack cap 4.58; AR tag on its tile body 4.61; TK tag 4.63; white on the hopper cap 4.67; BX tag on a loaded tile 4.77. Designer: `--red-ink` on `--well` 5.94; NORMAL on `--well` 8.60; REVERSE on `--well` 7.21.
- **Not text** (`nontext.mjs`, against the composite ground): spine and rail not lit 6.50 on a plain row and 5.56 on the hot row; spine lit 11.07; rail lit on the hot row 9.47; foul tick 10.55 and 9.03; edge of an empty box car 5.50 and 4.71; landing slot 9.47; car fill on the room bar 5.39; tick on the room bar 11.71; ground of the room bar against the row 1.06 (the edge in `--ink-3` carries it, 6.50). Designer: focus ring on `--glass` 11.20; `--lit` against `--ink-3` 1.70 (see section 2, item 5).
- **Console errors:** none. **Scene checks in the page:** 0 problems (readout, route, goal count, car lengths, held length).
- **Raw colour:** none in the page CSS (24.2 kB read) and none in the page script (23.9 kB read): no hex, no colour function, no colour name. The one keyword is `currentColor`, which takes the ink of its element. No inline style attribute in the markup. The script sets widths, offsets and one length variable by `style`; it sets no colour.
- **Self-contained:** one network request, the file itself. No link, no script source, no import, no `url()`. The six Dusk layers are in the built file byte for byte, in the load order; the block holds nothing more than six comment lines of the helper. The built file equals the source with the marker line replaced. The embedded scene object equals `scene.json`.
- **Words:** 46 strings of the scene are in the page without change (work order, readout, banner, picker, builder, legend, chips, three labels, refusal). The 13 car numbers stand one time each, in scene order. The two text blocks from `yardSim.js` have the same words as the file (`verify.mjs`).
- **Reduced motion:** the full-page pictures with and without `prefers-reduced-motion` have the same SHA-256 at both widths (`shot.mjs` with and without `--reduce`). The sketch has no motion of its own.
- **Text scale and dyslexia type:** tested with the type tokens at 1.25 times, and with 1.25 times plus a wide font, letter spacing 0.03 em, word spacing 0.1 em, line height 1.8. No sideways scroll, no clipped box, no text outside the window, no tile over a tile, no target under 44 px at 1440 and 390. At 320 px with both, the window clips the picker sideways; that width is outside the gate. The app's "Bigger text" is 18.5 over 16 (`src/state/AppContext.tsx:60`), which is 1.16 times.
- **High contrast:** the app's own high-contrast switch is not tested: Dusk has no high-contrast token set in this copy. A forced palette was tested (Chromium, `forcedColors: 'active'`, picture seen at 1440): the spine, the rails and the ticks stay (they are borders), each switch button and the engine get an outline, a car and a room bar keep their own inks. Each state has a word or a glyph, so a change of ink does not remove a state.
- **Keyboard:** Tab reaches the six switches in the order AS76 to AS71. Space and Enter change the lining; focus stays on the button; the name, `aria-pressed`, the word, the route words and the hot row change (`a11y.mjs`, both widths).
- **Looked at:** designer: 1440 px in three rounds and 390 px in four rounds. Reviewer: the first pictures and the final pictures at both widths, with clipped pictures of each panel at scale 2; the refusal state, the win state, the state with no reverse switch and the state with two reverse switches; text at 1.25 times with and without the dyslexia spacing; the forced palette; keyboard focus on a switch.

## 7. Where each motion has room

The static state is complete. Motion is a change of rows.

- **Move (pull, spot):** tiles leave one row and enter another. A tile can slide between its old place and its new place. The engine run along the lead and the ladder has no stage; the lit route shows the path before the move.
- **Couple:** the gap mark closes and the tiles touch. The stretch can be a short shift of the cut.
- **Kick:** the tile goes from the lead row to the dashed slot. The win state of the sketch shows the end of this move.
- **Arrival:** the main line row is the only place for the road train. Its tiles can stand there, and the set-out cars can drop into their row. This is not built and not tested.
- **Departure:** the tiles of the lead row leave toward "◄ DEPARTURE".
- **Watch optimal:** the same row changes, one at a time, with the switch words changing first.
- **Reduced motion:** the rows change at once. The banner says what happened.

## 8. New labels (words that the present app does not have)

Named by the brief: NORMAL, REVERSE, ENGINE, BUILD, "foul point", "throat ▸", "→ AS73", the letter E, "Route: LEAD → AS73", "Job", "Holding 1 car" (in the strip, and also beside the lead label), "3 cars" (below each track id), the column heads Track, State, Switch, Cars, Room, and the panel name "Yard".

Added by this sketch:

- "Route: LEAD → no track" (no switch is reverse); "13 cars" (the count in the head bar); "1 car" (singular).
- The Key panel: "Key", "A word or a glyph carries each state. Colour is a second cue.", the type names box, hopper, tank, centerbeam, autorack (keys of `geometry.carTypes`), "The colour is a category.", "solid: loaded", "hollow and E: empty", "the lined route", "a track that is not lined", "the end that a PULL takes", "a gap between two cuts", "Room", "the track to one scale: foul point, free track, cars", "2 or more cars:", "a kickable track", "the goal track and its count", "a goal car that is not there", "the car that the move takes", "the place where it lands", "SME to confirm", and the refusal caption.
- Sketch chrome: "SKETCH · look B · list", the status bar words, "Skip to the yard", the two banner flags that begin "Sketch:".
- For a screen reader only: the table caption, the list names ("AS73, cars in order from the throat"), ", box, empty" after each car, "gap", "the next move puts 70110 here", the Room bar names ("AS73: cars stand on 16 percent of the length"), the switch names ("AS73 switch, lined reverse").
- "Clear Board" and "The Yard" in the title bar are app words (`src/App.tsx:33`, `src/stations/Home.tsx:9`).

## 9. How the build job would draw it, and what is hard

DOM only. No canvas. No SVG except the two switch glyphs. A table, flex rows and CSS lines. The table is the text mirror, so no second structure is necessary. Text scale, the dyslexia typeface and high contrast act on real text.

Gaps in Dusk that this look needs (candidates for the gap register):

1. A window with no sidebar (`.cb-win`).
2. A 44 px size for `.dusk-btn` and for a `.dusk-seg` button (`.cb-tap`, `.cb-seg`).
3. A select (`.cb-select`).
4. A banner (`.cb-banner`), a chip with a cite and a line of words (`.cb-chips`, `.cb-chip`), a details block (`.cb-details`).
5. A primary button. "Work it ▸" differs from its neighbours only in width.
6. A compact, still tile. `.yd-tile` overrides `.dusk-tile` in size (138 px minimum), glow, hover lift and transition.
7. A composed stacked row. Dusk stacks a table as label and value lines; this look needs three composed lines, and one hot wash for the block.
8. A track for `.dusk-heat`. Dusk gives the fill only.

What is hard:

1. **The spine.** It is made of segments in each row. The join depends on a fixed band (44 px) at the top of each cell and on the row padding. It held with wrapped tiles, with a goal tag and with scaled text in the tests. It needs a look gate.
2. **Long cuts.** AS71 takes about 21 box cars (`roomInBoxCars`). At 56 px each that is 1176 px; the Cars cell is 323 px wide at 1440 px. A full track wraps to four lines or more. The lead limit is 558 units, about 13 box cars, 728 px; the lead cell is 299 px wide. The reviewer tested two real engine states of puzzle p5-long in a scratch copy (see "Eye review", check 3). The build needs a rule: a smaller unit for a long cut, or a count tile.
3. **Motion.** No stage for the engine run, the arrival and the departure (section 7). R7's motion sheet needs a row-based form.
4. **The lead at two widths.** A row at 1440 and a stem at 390. The same markup serves both; the order flips by CSS.
5. **Names of the toggle.** The brief asks for `aria-pressed` and a name that holds the state. A screen reader then says the state two times. Not tested with a screen reader.
6. **The select to segments change** in the builder is a change of control type. The owner decides if a reskin permits it.

## 10. Not verified

- The look on a real phone, with touch, and with a real screen reader.
- Fonts other than those of the test machine. The glyphs ⚡, ◄, ▸, ▶, ‖, ■, ✔ and 🔊 depend on the device font. `font-variant-emoji: text` keeps ⚡ a text glyph in Chromium; other engines are not verified.
- The app's own high-contrast switch. A forced palette was tested in Chromium only.
- Hover and pressed states: not measured for contrast. The switch button keeps `--well` in both.
- A puzzle with a centerbeam car, a track with one car, the switch-list check, the depart button, the arrival and the departure. None is in the scene. A long cut was tested in a scratch copy only; no picture of it is in the repository.
- The colour-vision figures of the brief (CIEDE2000). This job did not repeat them.
- The 1.3 px unit and the 56 px minimum are choices for this scene. No other scene was drawn.
- The win state of the sketch keeps TIED on AS73. The reviewer ran the frozen engine (`replay.mjs`): after the next move AS73 holds 70110, 70134, 70010, 70028 and is secured.
- The refusal words are shown whenever AS73 is lined normal and the call is KICK 1 to AS73. The reviewer ran the frozen engine for the lining of the example (AS72 reverse, AS73 normal): the words are the same. Other linings follow `model.js:66-70` (read, not run).

## 11. Notes for the SME

No rule wording is proposed here.

- S1. With all six switches normal, the sketch says "Route: LEAD → no track" and lights nothing. `geometry.throughRoute` shows that the ladder goes on to the main line. Should the trainer show where that route leads?
- S2. In the scene the next move wins the job with the words "clean", while AS72 holds three cars and reads LOOSE. `checkWin` tests the goal track only (`model.js:246-255`). The rule chip says "Unattended equipment gets a hand brake (secured)". Do the two agree?
- S3. The new words "throat", "foul point", "free track", "Room", NORMAL, REVERSE, ENGINE, BUILD and the letter E for an empty car. Are these the words a crew uses? Could E be taken for another mark?
- S4. Green for NORMAL and a dark yellow (`--amber-ink`) for REVERSE. The app text says "yellow = lined into the track / diverging, green = normal" (`yardSim.js:190-191`). Is there a colour convention, and does this agree with it?
- S5. The lit route line. Could a learner read it as authority to move?
- S6. The Room bar shows the foul tick to scale (30 units from the switch) and the lead limit (558 units) with no tick. The page prints no length in feet. Is a picture of room without a figure correct to teach?
- S7. The refusal marks the AS73 switch only. In the example AS72 is also lined reverse. The engine's words name AS73 only. Is that the correct switch to point at first?
- S8. The headlight is at the end of the engine away from the cars. Is that the correct end?
- S9. The work order keeps "(now on AS73, AS71)" after the cars left AS71. The sketch copies the words without change.
- S10 (reviewer). After the spot of 70222 on AS72, the engine marks the whole track as not secured (`model.js:152-155`; engine run in `replay.mjs`). The tag LOOSE then stands for all three cars. The two tank cars read TIED before that move. The sketch shows one tag for the track, as the present drawing does. Is one tag for a track that holds two cuts correct to teach?
- S11 (reviewer). The readout says "Joints 2" after three moves. The engine added the second joint for the spot on AS72 (`scene.replay.steps`: joints 1 after the kick, 2 after the spot; `model.js:151`). The same spot left 70222 as a cut of its own, one car length short of the tank cars (`scene.state.tracks` AS72 `gaps`). This look draws that gap with a mark, so the gap and the count stand side by side. Do the two agree?

## 12. Eye review

The reviewer did not build the sketch. Date of the review: 2026-11-20. The reviewer took fresh pictures, measured the built file with Playwright and Chromium at device scale 1, repaired the source, rebuilt it with `inline-dusk.mjs` and took the two pictures again with `shot.mjs --scale 2`. The reviewer looked at the final pictures. Each line below is "pass", "repaired" or "open".

Limits of this review: one machine, one browser engine, the fonts of that machine. No timing was measured. No web source was used.

### Repairs (what changed in the source)

- R1. **The car count.** Before: the Room cell read, for the empty track, "Room" and "0 cars". A learner reads that as "no room". The empty track has the most room. After: the count stands below the track id ("AS71", "0 cars"). The lead reads "Holding 1 car" beside its label. The Room cell holds the bar only.
- R2. **The room bar.** Before: the ground of the bar against the row measured 1.06 to 1, so the length of a track was almost not visible; on the empty track only the tick was visible. After: the bar has an edge in `--ink-3` (6.50 to 1). The bar is also longer, because the figure left the cell: AS71 is 172 px at 1440 (before: 119 px) and 284 px at 390 (before: 230 px). The Key has a line "Room".
- R3. **The lead at 390 px.** Before: the label "◄ DEPARTURE · LEAD / DRILL" stood at the right of the stem, and its arrow pointed at the tag "→ AS73". After: the label stands below the engine, at the departure end, and a short dim rail goes from the engine to it.
- R4. **The route line at 390 px with large text.** Before: when the state words took three lines, Dusk centred the switch button in its cell. The lit line then missed the button, and the drop rail stopped 8 px (text at 1.25 times) or 16 px (1.25 times and dyslexia spacing) above the rail of the cars (measured). After: the button stands at the top of the cell and the join holds (measured: the drop ends at the rail).
- R5. **The goal chip.** Before: with text at 1.25 times and dyslexia spacing at 390 px, the chip "3 / 4" broke into "3 /" and "4". After: the chip does not break.
- R6. **The goal tag on a wrapped line.** Before: when tiles wrap, the tag "→ AS71" of a tile covered the type tag of the tile above (seen in a scratch copy with a real state of puzzle p5-long). After: a row that has goal tags keeps the room of the tag between lines. At 390 px the held cars in the stem still touch.
- R7. **Washes at 390 px.** Before: the zebra wash of Dusk made pale patches behind single cells of a stacked row. After: the wash is on the block.
- R8. **Forced palette.** Before: in a forced palette the spine, the rails, the foul ticks, the room bars, the edge of each switch button and the edge of the engine were blank (picture seen). After: lines are borders, which stay; a switch button and the engine get an outline; a car and a room bar keep their inks. Seen in the picture at 1440. At 390 the test picture kept the Dusk colours; the cause was not found, so 390 is not verified.
- R9. **The room bar of the lead at 1440** is level with the lead rail (before: at the top of the row).
- R10. Two rules that nothing used were removed from the page CSS.

### Check 1. Truth of the scene: pass

- The reviewer ran the frozen engine on puzzle p4-peel (`replay.mjs`: `freshState`, then the three moves and the switch calls of `scene.replay`). The engine state equals the scene in moves, joints, lined, secured, the cars of each track with position, type and load, and the held car: 0 differences. The engine gives the refusal words of the scene for the lining of the example. The eight rule chips and the hint equal `puzzles.js`.
- `truth.mjs` reads the drawn yard back from the DOM at 1440 and 390 and compares it with `scene.json`: row order (main line, AS76 to AS71, lead), each switch word, `aria-pressed` and name, each car number in order, type tag, tone, solid or hollow, the letter E, tile width (length times 1.3 px, 56 px or more), the gap on AS72, touching tiles inside a cut, the state words, the hot row, the lit rail, the landing slot, the engine first on the lead, the held car with its goal tag and next-move mark, the route words, the room bar segments and tick (within 1 px). Result: 0 differences.
- The words: the work order (four lines), the banner, the legend, the picker group and option, the builder words, the three drawing labels, the eight chips and the refusal words are in the page without change (`truth.mjs`). The two text blocks from `yardSim.js:183-209` were compared with the file by a script, with the markup removed: same words.
- Controls against `yardSim.js:144-172`: back, picker, action, count, track, "Work it ▸", "▶ Watch optimal", "Reset", sound are all there with the same words and titles. "Depart ▸" is hidden, as in the app for this puzzle. Open: see O7 (two selects became segment groups) and O8 (the six switch buttons and the example button are new controls; the brief asks for the switch buttons).

### Check 2. The inventory: pass, with the gaps that section 3 states

The reviewer read each line of the inventory against the final pictures. Readable in the picture: D1, D2, D4 to D10, D12, D14 to D26, the pointer target, C1 to C4, C6, C8 to C12, and the additions of line 45. Not in the picture, with the reason in section 3: D3 (nothing is scaled), D11 (no plate is necessary), D13 (no glow), D27 to D31 (a still picture; this look has no stage, see O9), C5 and C7 (not in this puzzle). CB (centerbeam) is in the Key only: the scene has no such car.

### Check 3. The two-second read: repaired (R1, R2, R3), with open points

At 1440:

- Each car and its order: reads. Number, type tag, solid or hollow and the letter E are legible. Tiles of a cut touch. The gap on AS72 is clear.
- Which way each switch is lined: reads. The word and the glyph carry it. Five green NORMAL and one REVERSE.
- The lit route: reads at once. One gold line from the held car, up the spine, through REVERSE, to the dashed slot. This is the best part of the look.
- The engine: reads by its word. See O5.
- Tied against loose: reads by word and glyph.
- The goal: reads. BUILD, "3 / 4", the tag "→ AS73" and the slot agree.

At 390: the same things read, one track for each block. The page is long: the yard panel is 1097 px high and "Work it ▸" is 1740 px from the top (measured). A learner does not see the lead and the lined track together with the move builder.

What a first-time learner can still misread:

- "throat ▸" points at the cars. A learner who does not know the word "throat" gets no help from the picture. The Key explains it.
- The Room bar shows a length and no figure. It does not say how many more cars fit.
- The order of the columns puts the cars far from the track id when the State cell is wide.
- A wrapped line of tiles starts below the first tile and has no mark that says "continued" (see O2).
- See O5 (the engine looks like a button) and O6 (REVERSE and LOOSE have one ink).

Long cuts, tested in a scratch copy with two real engine states of puzzle p5-long (`variant.mjs`; pictures in the scratch folder only):

- Eight autoracks on AS71: four lines of two tiles at 1440 and at 390. No overlap, no sideways scroll. The single line of a track is lost.
- Four autoracks on the lead at 1440: the lead cell grows, the Track column becomes 398 px wide, the Cars column falls to 224 px, and the four autoracks of AS74 stand one on each line (measured with `cols.mjs`). At 390 the stem takes five items and reads well.

### Check 4. Self-contained: pass

`static.mjs`: no link, no script source, no import, no `url()`, no remote address in the built file. One network request (the file). The block marked `data-dusk` holds the six layers byte for byte in the load order (27090, 2063, 23291, 10597, 5775 and 3667 bytes) and six comment lines of the helper. The built file equals the source with the marker replaced.

### Check 5. No raw colour: pass

`static.mjs` on the page CSS (24.2 kB) and the page script (23.9 kB), comments removed: no hex, no `rgb()`, `hsl()`, `oklch()` or other colour function, no colour name. One keyword, `currentColor`, on the stroke of the Key glyph. No `style` attribute and no colour attribute in the markup. Each token that the page uses is in Dusk or in the bridge block.

### Check 6. Dusk laws: pass, with open points

- Tile colour is a category: pass. The five tones are the five car types and nothing else.
- State colours are states: pass. NORMAL green ink, REVERSE and LOOSE amber ink, TIED and KICKABLE `--ink-2`, refusal red ink.
- Red is attention only: pass. Red is on the refusal words, the "?" and the edge of the refused switch, and in the Key example.
- No state by colour or glow alone: pass. Each state has a word or a glyph. In the forced palette the words stay.
- No pill: pass. Radii in the page CSS are `--r-control`, `--r-chip`, `--r-bar` and, for the bend of a line, `--r-window`.
- Gold: open, see O4.
- Parts used outside their description in `ARCHITECTURE.md`: open, see O13.

### Check 7. Measured at 1440 and 390: pass

`audit.mjs` on the final file: no sideways scroll; 25 targets, none under 44 by 44 px; smallest text 11 px (`--fs-xs`); car number 12 px; no console error; 0 scene problems; 40 text pairs, none under 4.5 to 1 (lowest 4.55, white on the box cap). The same in the refusal state (26 targets) and the win state. Open: the cap pairs are 4.55 to 4.67, which is 0.05 to 0.17 above the floor. These are Dusk cap colours with white text; the sketch did not choose them.

### Check 8. Motion off and text at 125 percent: repaired (R4, R5), then pass

- Motion off: the pictures with and without reduced motion have the same SHA-256 at both widths.
- Text at 1.25 times (type tokens times 1.25): no blank part, no clipped box, no text outside the window, no tile over a tile, no target under 44 px at both widths. AS73 wraps to two lines at 390 px (open, O2).
- The method scales the Dusk type tokens. The app scales with a `--fs` variable (`src/state/AppContext.tsx:60`). How Dusk will take the text scale in the build is not decided, so the method is an estimate.

### Check 9. "SME to confirm" and rule text: pass

- The Key marks car type colour, switch colour and route colour with "SME to confirm". Red is stated as "for a refusal only".
- Rule numbers in the page: CROR 104, 105, 112, 113.0 / 113.2, 113.4 / 113.5, 115 in the chips; CROR 104, Rule 112, Rule 113.5 and Rule 113.2 in "How to play"; CROR 105 in the main line label; CROR 104 in the refusal. Each is in the app for this puzzle (`puzzles.js:9-20`, `yardSim.js:187-209`, `render.js:94`, `model.js:66-70`). The sketch adds no rule text and no rule number.
- The words "yellow" and "green" in "How to play" are the app's words. The sketch uses a dark yellow ink for REVERSE. Section 11, S4 holds the question.

### Check 10. The direction is still itself: pass

The yard is a table: one row for each track, no track drawing, no scaling, a spine of six switch buttons, tiles in order, a stack at 390 px. The repairs changed no part of the structure. The room bar is a proportion bar with an edge; it is not a track drawing.

### Open points

- O1. **Long cuts.** See check 3. The look has no rule for a cut that is longer than one line. The build needs one (a smaller unit, or a count tile). The widths of the Track and Cars columns follow the content of the lead row, because the table layout is automatic.
- O2. **Wrap.** One line takes four box cars. A fifth car, or text at 1.25 times at 390 px, starts a second line with no mark of continuation.
- O3. **Departures from the brief** that the designer chose and the reviewer kept: the column order (Track, State, Switch, Cars, Room), the Tab order from AS76 to AS71, the count below the track id (R1). The lead decides.
- O4. **Gold.** `--lit` marks the lined route, the goal (BUILD, the tag) and the next move. The brief asks for this. The plan says gold is chrome only; Dusk says chrome and selection, never a state. A route and a next move are selections. BUILD is nearer to a state. The lead decides.
- O5. **The engine looks like a control.** The engine tile and the six switch buttons have the same lit edge on a dark ground. The engine is not a control. The brief asks for the lit edge.
- O6. **One ink for two states.** REVERSE and LOOSE both use `--amber-ink`. The words differ. The brief asks for both tokens.
- O7. **Control type.** The action select and the track select of the app are segment groups here (ten buttons). The words are the same. A reskin changes no control: the owner decides.
- O8. **The Key panel and the refusal example are additions of the sketch.** The app has no key. The example holds a second "Look it up →" button that a keyboard reaches and that does nothing.
- O9. **Motion.** This look has no stage for the engine run, the arrival and the departure (D27, D29, D30). A move is a change of rows. Not built, not tested.
- O10. **The sound glyph** is an emoji of the device font. On the test machine it is a dim picture on the dark button.
- O11. **High contrast.** The app's own switch is not tested (no Dusk token set for it). The forced palette at 390 is not verified (R8).
- O12. **The picker** shows one option, without the marks "✓" and "→".
- O13. **Dusk parts outside their description:** `.dusk-eye` is the headlight (Dusk: the dot of a badge); `.dusk-up` colours the win banner (Dusk: direction ink for a number); `.dusk-heat` stands without its number (Dusk: a measure beside its number); `.dusk-tile` is overridden in size, glow and motion. The build needs `yd-` parts or new Dusk parts.
- O14. **Not repeated by the reviewer:** the font report of the designer, the contrast of hover and pressed states, the 46-string count of the designer (the reviewer checked the strings with a different list).
- O15. A real phone, touch and a screen reader: not verified. The accessibility tree of the stacked table at 390 px keeps table, row, row header and cell roles (`ariaSnapshot()`, seen).

### Verdict for the owner

- It reads. One lit line and one word tell a learner which switch is reverse and where the route goes.
- It is best at: order of cars, the words for each state, the text mirror for a screen reader, text scale, and a phone layout with no scaling.
- It is worst at: the sense of a yard as a place, long cuts (they wrap), motion (no stage), and length of the page on a phone.
- The owner should know this before a decision: the pictures show a small scene, with three cars or fewer on each track. A puzzle with eight autoracks on one track does not look like these pictures. The Key panel is an addition of the sketch; the app has no key.
