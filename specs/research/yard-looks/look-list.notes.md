# Look B, "list": the yard as a live switch list

Wave 1 sketch. Read-only on all code and content. Date of the work: 2026-11-20.

Files:

- `look-list.src.html`: the source. It holds the marker line for the Dusk layers, the page-local CSS, the markup, the scene object and the script.
- `look-list.html`: the built file. One file, inline CSS and JS, no external file. It is the output of `inline-dusk.mjs` on the source.
- The scene object and the two text blocks of the app were put into the source by a script (`build.mjs` in the scratch folder), not typed. The source is complete without that script.
- `look-list-1440.png`, `look-list-390.png`: full-page pictures at scale 2.

Each statement below is checked, with the command or the place, or it is marked "not verified". The check scripts are in the scratch folder `look-list/` (`measure.mjs`, `verify.mjs`, `a11y.mjs`, `facts.mjs`, `facts2.mjs`, `clip.mjs`, `build.mjs`).

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
2. **The lead at 390 px** is a stem below the ladder, not a row. The car nearest to the yard is at the top, the engine is below it, the headlight is at the bottom of the engine. No sticky position is used: a sticky block at the bottom of a phone window covers targets.
3. **Glyphs.** The switch glyph is an inline SVG (a straight leg, or a leg that turns with an arrow), not the characters "│" and "└→". The foul tick and the gap mark are CSS shapes, not the characters "┃" and "┊". Reason: box-drawing characters depend on the font of the device.
4. **Room bar.** The brief: occupied length over track length. The sketch adds: all bars use one scale (the longest track, AS71, is the full width), the cars stand at the far end of the bar, and a tick stands at the foul point (30 units). The left ends of the six bars step in, as the ladder does. The lead bar uses the same scale and the lead limit of the scene (558 units); it is left-aligned.
5. **Lined route width.** The brief: a 2 px line, lit. The sketch: 4 px lit, 2 px not lit. Reason: `--lit` against `--ink-3` is only 1.70 to 1 (computed with `lib/color.mjs`), so the width also carries the difference.
6. **Switch button ground.** The button keeps the lit edge of `.dusk-btn`, but its ground is `--well`, not the gold wash. Reason: `--amber-ink` on the gold wash over the hot row measured 4.43 to 1. On `--well` it measures 7.21.
7. **Tile edge.** A 1 px border in the tone ink. No glow. The Dusk tile glow (30 px) runs over the next tile when tiles touch.
8. **The goal tag "→ AS73"** stands above its tile (1440) or beside it (390 stem). A row that holds a tag gets 14 px of headroom. Tested with a scratch copy of the scene in which 70222 is a goal car.
9. **Interaction.** The brief permits one small interaction (line a switch). The sketch also lets "Work it ▸" and "Reset" act, only with answers that the scene file holds: the win of the next move (`nextMove.afterIt`) and the refusal (`refusalExample.text`). For any other call the banner shows a flag that begins "Sketch:". The page invents no engine answer.
10. **Tab order** runs top to bottom, AS76 to AS71, not AS71 to AS76. Reason: it is the visual order and the reading order. A positive `tabindex` moves the six switches before the title bar and the picker.
11. **Two prefixes.** `cb-` marks a gap that any Clear Board page has (13 classes). `yd-` marks a part of the Yard list (91 classes in the page).

## 3. How each inventory element reads

| # | Element | In this look |
|---|---|---|
| 1 | D1 floor | `--glass` window floor; the table sits in a framed panel (`--panel-fill`) |
| 2 | D2 frame | `.dusk-panel--framed`: lit edge, 8 px corner. No shadow frame |
| 3 | D3 size and scale | Gone. Nothing is scaled. Sizes are CSS pixels at each width |
| 4 | D4 main line | The first row of the table. The spine turns right into the words. Dim |
| 5 | D5 ladder | The spine in the Switch column |
| 6 | D6 lead / drill | The last row. A dim rail runs from the left edge to the engine; a lit stub runs from the last held car to the foot |
| 7 | D7 body tracks | Six rows. Each has a rail from its switch button to its first car. No end stop |
| 8 | D8 label | "◄ DEPARTURE · LEAD / DRILL", whole, in the lead cell |
| 9 | D9 label | "MAIN LINE → the road" in the main line row |
| 10 | D10 label | "15 MPH · REDUCED (CROR 105)" at the right of the main line row |
| 11 | D11 label plate | Not necessary. No rail and no car passes over a label |
| 12 | D12 switch target | A button, 44 px high, 119 px wide (1440) or 124 px (390), with the word NORMAL or REVERSE and a glyph |
| 13 | D13 switch glow | Gone. The reverse switch has the word REVERSE, the turn of the spine and the hot row |
| 14 | D14 clearance tick | A tick in `--ink-2` on the rail at the start of each Cars cell; the words "foul point" in the column head (1440) and in the Key (both widths); a second tick on the Room bar, to scale. None on the lead |
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
| 45 | Not in the present drawing | Added: a car count for each track and for the engine; a room bar; a goal mark (BUILD, "3 / 4", "→ AS73"); a mark of the lined route; a word for the switch state; the word ENGINE; a mark of the car the move takes and of its landing place; the table as the text alternative |

## 4. The 390 strategy

Stack. No transform and no scaling.

- Below 760 px each row is a block. Line 1: the switch button, the track id, the state words and the count chip. Line 2: the foul tick, "throat ▸" and the tiles. Line 3: "Room", the bar and the car count.
- The spine runs down the left edge of the blocks, lit from the lead up to the reverse row. In the reverse row it turns into the button. From each button a rail drops to the line of cars; it is lit in the lined row.
- Tiles wrap when they do not fit. At 390 px with this scene no row wraps (each car list is 44 px high, measured). With the type tokens at 1.3 times and the dyslexia spacing, AS73 wraps to two lines (seen in the test picture); the first line stays at the throat mark.
- The lead is the last block, as a stem (section 2, item 2).
- The hot row draws one wash and one lit line pair for the block. Dusk draws them on each cell, which makes stripes in a stacked row.
- The table has explicit ARIA roles, so the stacked rows stay rows and cells in the accessibility tree (checked with `ariaSnapshot()` at 390 px). The column heads are hidden at 390 px. The Room cell shows its `data-label`; the other cells carry their own words.

Cost, measured: the yard panel is 1070 px high at 390 px. The "Work it ▸" button is 1713 px from the top of the page. At 1440 px the yard is 984 by 563 px and the button is at 501 px.

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

- **Sideways scroll:** none at 1440, 390, 320, 761, 1024 and 1180 px (`measure.mjs`; `scrollWidth` equals `clientWidth`).
- **Targets:** 25 interactive elements at each width. Smallest: 44 by 44 px (the count select and the sound button). None under 44 px. Switch buttons: 119 by 44 (1440), 124 by 44 (390), 100.5 by 44 at the narrowest table width tested (761 and 1180 px).
- **Smallest text:** 11 px (`--fs-xs`). Car number 12 px. Type tag 11 px.
- **Text contrast:** 40 ink and ground pairs at 1440 and 39 at 390, computed with `/home/user/dusk/lib/color.mjs` from the computed colours; each ground is the composite of all ancestors, and for a gradient the worst stop. None under 4.5. The lowest: white on the box cap 4.55; white on the tank cap 4.56; white on the autorack cap 4.58; AR tag on its tile body 4.61; TK tag 4.63; white on the hopper cap 4.67; BX tag on a loaded tile 4.77; `--ink-3` on the lit key cell 5.56; `--red-ink` on `--well` 5.94. NORMAL on `--well` 8.60. REVERSE on `--well` 7.21.
- **Not text:** `--lit` on the panel 11.43; `--ink-3` on the panel 6.71; `--lit` on the hot row 9.46; `--ink-3` on the hot row 5.55; focus ring on `--glass` 11.20. `--lit` against `--ink-3` 1.70 (see section 2, item 5).
- **Console errors:** none. **Scene checks in the page:** 0 problems (readout, route, goal count, car lengths, held length).
- **Raw colour:** none in the page CSS (about 19 kB read) and none in the page script (`verify.mjs`). No inline style attribute in the markup. The script sets widths, offsets and one length variable by `style`; it sets no colour.
- **Self-contained:** one network request, the file itself. The six Dusk layers are in the built file byte for byte. The embedded scene object equals `scene.json`.
- **Words:** 46 strings of the scene are in the page without change (work order, readout, banner, picker, builder, legend, chips, three labels, refusal). The 13 car numbers stand one time each, in scene order. The two text blocks from `yardSim.js` have the same words as the file (`verify.mjs`).
- **Reduced motion:** the full-page pictures with and without `prefers-reduced-motion` have the same SHA-256 at both widths. The sketch has no motion of its own.
- **Text scale and dyslexia type:** tested with the type tokens at 1.3 times and with a wide font, letter spacing 0.02 em, word spacing 0.08 em, line height 1.8. No sideways scroll, no text outside the window, no target under 44 px at 1440 and 390. At 320 px with both, the window clips some content sideways; that width is outside the gate. The app's "Bigger text" is 18.5 over 16 (`src/state/AppContext.tsx:60`), which is 1.16 times.
- **High contrast:** not tested. Dusk has no high-contrast token set in this copy. Each state has a word or a glyph, so a change of ink does not remove a state.
- **Keyboard:** Tab reaches the six switches in the order AS76 to AS71. Space and Enter change the lining; focus stays on the button; the name, `aria-pressed`, the word, the route words and the hot row change (`a11y.mjs`, both widths).
- **Looked at:** 1440 px in three rounds and the final picture; 390 px in four rounds and the final picture; also the win state, the refusal state, the state with no reverse switch, and the scaled-text state.

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

Named by the brief: NORMAL, REVERSE, ENGINE, BUILD, "foul point", "throat ▸", "→ AS73", the letter E, "Route: LEAD → AS73", "Job", "Holding 1 car", "3 cars", the column heads Track, State, Switch, Cars, Room, and the panel name "Yard".

Added by this sketch:

- "Route: LEAD → no track" (no switch is reverse); "13 cars" (the count in the head bar); "1 car" (singular).
- The Key panel: "Key", "A word or a glyph carries each state. Colour is a second cue.", the type names box, hopper, tank, centerbeam, autorack (keys of `geometry.carTypes`), "The colour is a category.", "solid: loaded", "hollow and E: empty", "the lined route", "a track that is not lined", "the end that a PULL takes", "a gap between two cuts", "2 or more cars:", "a kickable track", "the goal track and its count", "a goal car that is not there", "the car that the move takes", "the place where it lands", "SME to confirm", and the refusal caption.
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
2. **Long cuts.** AS71 takes about 21 box cars (`roomInBoxCars`). At 56 px each that is 1176 px; the Cars cell is 310 px wide at 1440 px. A full track wraps to four lines or more. The lead limit is 558 units, about 13 box cars, 728 px; the lead cell is 311 px wide. Not tested with a long cut. The build needs a rule: a smaller unit for a long cut, or a count tile.
3. **Motion.** No stage for the engine run, the arrival and the departure (section 7). R7's motion sheet needs a row-based form.
4. **The lead at two widths.** A row at 1440 and a stem at 390. The same markup serves both; the order flips by CSS.
5. **Names of the toggle.** The brief asks for `aria-pressed` and a name that holds the state. A screen reader then says the state two times. Not tested with a screen reader.
6. **The select to segments change** in the builder is a change of control type. The owner decides if a reskin permits it.

## 10. Not verified

- The look on a real phone, with touch, and with a real screen reader.
- Fonts other than those of the test machine. The glyphs ⚡, ◄, ▸, ▶, ‖, ■, ✔ and 🔊 depend on the device font. `font-variant-emoji: text` keeps ⚡ a text glyph in Chromium; other engines are not verified.
- High contrast mode.
- Hover and pressed states: not measured for contrast. The switch button keeps `--well` in both.
- A puzzle with a centerbeam car, a track with one car, a long cut, the switch-list check, the depart button, the arrival and the departure. None is in the scene.
- The colour-vision figures of the brief (CIEDE2000). This job did not repeat them.
- The 1.3 px unit and the 56 px minimum are choices for this scene. No other scene was drawn.
- The win state of the sketch keeps TIED on AS73. That follows `model.js:197` (read, not run).
- The refusal words are shown whenever AS73 is lined normal and the call is KICK 1 to AS73. That follows `model.js:66-70` (read, not run); the scene gives the words for one lining only.

## 11. Notes for the SME

No rule wording is proposed here.

- S1. With all six switches normal, the sketch says "Route: LEAD → no track" and lights nothing. `geometry.throughRoute` shows that the ladder goes on to the main line. Should the trainer show where that route leads?
- S2. In the scene the next move wins the job with the words "clean", while AS72 holds three cars and reads LOOSE. `checkWin` tests the goal track only (`model.js:246-255`). The rule chip says "Unattended equipment gets a hand brake (secured)". Do the two agree?
- S3. The new words "throat", "foul point", NORMAL, REVERSE, ENGINE, BUILD and the letter E for an empty car. Are these the words a crew uses? Could E be taken for another mark?
- S4. Green for NORMAL and a dark yellow (`--amber-ink`) for REVERSE. The app text says "yellow = lined into the track / diverging, green = normal" (`yardSim.js:190-191`). Is there a colour convention, and does this agree with it?
- S5. The lit route line. Could a learner read it as authority to move?
- S6. The Room bar shows the foul tick to scale (30 units from the switch) and the lead limit (558 units) with no tick. The page prints no length in feet. Is a picture of room without a figure correct to teach?
- S7. The refusal marks the AS73 switch only. In the example AS72 is also lined reverse. The engine's words name AS73 only. Is that the correct switch to point at first?
- S8. The headlight is at the end of the engine away from the cars. Is that the correct end?
- S9. The work order keeps "(now on AS73, AS71)" after the cars left AS71. The sketch copies the words without change.
