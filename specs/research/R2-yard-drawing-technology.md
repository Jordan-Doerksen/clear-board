# R2 — The Yard: drawing technology

Wave 1 research. Read-only on code and content. Written 2026-11-20 on branch
`claude/peaceful-mayer-qat99l` at commit `cb51d4b`.

Each statement is checked (file and line, a command, or a measurement) or it carries the words
"not verified". Section 10 lists every statement that is not verified and every item that was not
measured.

This report proposes. It changes no code and no content. The three prototypes are research files,
not the game. Their look is not final: the look is job R1.

## Check record

A second job checked this report on 2026-11-20. That job is now the only writer of this file.

- The check opened each cited file and line. It ran each measurement of sections 2, 3 and 5 again
  with its own scripts, on the same machine and the same browser. Where it did not run a
  measurement again, the line says "not verified". It looked at a picture of each prototype at 1440 and at 390.
- Each numbered finding and each figure now carries a line or a cell that starts with `Check:`. The
  value is `confirmed` (with the method), `corrected` (with the change) or `not verified` (with the
  reason). A refuted finding is in section 14, the last section.
- The check wrote into the table cells only where a figure was wrong. Where the figure of the check
  differs from the first figure by measurement noise, the first figure stays and the `Check:` cell
  gives the second figure.
- The check tested each proposal against the fence (section 4 of the plan). Section 13 gives the result.
- Counts: 118 findings of the first text confirmed; 27 corrected; 17 not verified (14 from the
  first text and 3 open items that the check listed); 2 refuted and withdrawn (W1 and W2; the cell
  of row 44 points at W1); 23 findings added by the check, each with evidence. That is 187 findings
  on 188 `Check:` lines. A finding that the check added carries the words "added by the check".
- Machine load during the check: the 1-minute load was between 0.84 and 3.30 during the timing
  batches. Other jobs used the machine. That is more load than during the first measurement. Each
  timing cell of the check is the median of six runs (two batches of three).
- The check changed no prototype. No measurement was wrong because of a defect in a prototype. One
  measurement was wrong because of its method (row 44, section 14).

**The result of the check in four lines.**

1. The recommendation stands: SVG for the drawing, native buttons for the switches, a list for the
   words.
2. The speed evidence is weaker than the first text said. The CPU throttle slows only the main
   thread. That favours the SVG (rows 63 and 65). The order of the options did not change.
3. The prototype layout has limits that the first text did not give. A window of 1280 or 1366 px
   gets the tall view. A window of 360 px gets a 41.4 px target and a number that is wider than its
   car (rows 56 to 59, C12 to C14). These are for the look and for Gate A.
4. One finding is withdrawn: the canvas picture was not unstable. The capture method changed the
   picture, for every option (row 64, section 14).

---

## 1. The recommendation in one line

**Draw the Yard as one inline SVG. Put the six switch controls in native HTML buttons that sit over
the SVG, placed by the same view transform. Put the text mirror in a list beside it. Use no canvas.**

`proto-svg.html` shows this. Its address switch `?controls=html` selects the HTML buttons. Without
the switch, the same file uses SVG groups with a button role. Section 5 measures both.

Check: confirmed (the file takes the switch: `proto-svg.src.html:298`; both kinds were measured
again). The recommendation holds with the conditions in C12 to C17.

---

## 2. The facts today (checked)

| # | Fact | Evidence | Check |
|---|---|---|---|
| F1 | The drawing is one canvas of 1340 × 460 logical units. CSS scales it to the column. T2 is correct. | `yard/geometry.js:5`, `yardSim.js:64`, `yardSim.js:233-235` | Check: confirmed (read the three places). |
| F2 | The app column is 920 px wide at most. At a 1440 px window the canvas is 882 px wide. One unit is 0.658 px. A car number is 5.9 px high. A track name is 8.6 px. | `src/index.css:6` and `:17`. Measured in the built app at `127.0.0.1:4173/#/yard`: canvas box 882 × 302.8 CSS px | Check: confirmed (built app, 1440 × 900: column 920, canvas 882 × 302.77, scale 0.6582, 9 units = 5.92 px, 13 units = 8.56 px). "High" means the font size. |
| F3 | At a 390 px window the canvas is 352 px wide. One unit is 0.263 px. A car number is 2.4 px high (T2 says about 2.6). The type tag is 1.7 px. A track name is 3.4 px. | Measured in the built app: canvas box 352 × 120.8 CSS px. Font sizes from `render.js:171` (9), `:175` (6.5), `:139` (13) | Check: confirmed (352 × 120.83, scale 0.2627: 2.36, 1.71 and 3.42 px). |
| F4 | A switch is lined by a canvas click only. The hit radius is 18 units. That is 4.7 px at 390 and 11.9 px at 1440. The switches are 18.4 px by 13.7 px apart at 390, so six 44 px targets cannot sit on the drawing at that scale. T3 is correct. | `yardSim.js:285-293`. Spacing from `geometry.js:15` (70, 52) times the measured scale | Check: confirmed (code read; 4.73 and 11.85 px; 18.4 by 13.7 px at 390, 46.1 by 34.2 px at 1440). |
| F5 | The canvas has no role, no label, no tab stop and no child element. There is no text mirror. | Measured in the built app: `role`, `aria-label`, `tabindex` are all null; 0 child elements | Check: confirmed (all null at both widths; 0 child nodes; no `aria-labelledby`, no `title`; no element with `role="status"`, `role="alert"` or `aria-live` in the Yard). |
| F6 | **T4 is wrong in direction.** With the reduce setting on, a move is slower, not faster. The same PULL takes 1583 ms with the setting off and 9006 ms with it on (1440 window; 1588 ms and 9009 ms at 390). The cause: `setSpeed(6)` multiplies each duration by 6. | Measured in the built app, median of three moves for each cell. `yardSim.js:229`, `anim.js:6` ("`>1 = slower`") and `anim.js:17`. R7 found the same | Check: corrected (the first figures were 1587, 8995 and 9047 ms from one move each; the cells now give the median of three. Runs: 1579, 1583, 1584 and 9003, 9006, 9010 at 1440; 1572, 1588, 1615 and 9006, 9009, 9011 at 390). The direction is confirmed. The demo "Watch optimal" uses the same factor: `yardSim.js:410`. |
| F7 | The canvas pixel ratio stops at 2. A screen with a ratio of 3 gets a 2× bitmap. | `yardSim.js:234`. Measured: backing store 2680 × 920 at a ratio of 3 | Check: confirmed (2680 × 920 at ratio 3; 1340 × 460 at ratio 1). |
| F8 | The canvas palette is 17 raw colours in one table, and 5 more raw colours in the draw functions. | `render.js:10-19`, `:102`, `:120`, `:166`, `:175`. Counted with a search for hex and `rgba(`: 22 matches | Check: confirmed (search gave 22: 17 on lines 11 to 18; 1 each on 102, 120, 166; 2 on 175). The car fill and edge colours come from the frozen `geometry.js:44-48`; they are not in this count. |
| F9 | `render.js` is 215 lines (194 not blank). It redraws the whole canvas on each call. The controller calls it from one function, `paint()`. | `render.js`; `yardSim.js:264` | Check: confirmed (`wc -l` 215; 194 not blank; `render(` occurs once in `yardSim.js`, at line 264). |
| F10 | `anim.js` is 29 lines. It holds one tween driver, `play()`, and a speed factor. The controller calls `play()` in three places: the arrival, a move, the departure. | `anim.js`; `yardSim.js:276`, `:379`, `:522` | Check: confirmed (29 lines; three calls at those lines). The controller sets the speed factor at `yardSim.js:256`, `:410` and `:424`. |
| F11 | The canvas draws one line of words that cites a rule: `15 MPH · REDUCED (CROR 105)`. See section 11. | `render.js:94` | Check: confirmed (line 94; it is the only drawn string in `render.js` with a rule number). |
| F12 | The text scale of the app is a root font size of 18.5 px in place of 16 px. That is 115.6 %. | `src/state/AppContext.tsx:60`, `src/index.css:15` | Check: confirmed (added by the check: read the two lines). The first measurement used 125 %. Row 59 measures 18.5 px. |
| F13 | The reduce setting takes its first value from the operating-system flag. After that the stored value is used. The Yard reads the setting once, when the station mounts. | `src/state/AppContext.tsx:12`, `:14-15`, `:61`; `yardSim.js:228` | Check: confirmed (added by the check: code read). The effect of a change while the Yard is open is not verified. R5 owns the subject (its finding A11Y-07). |
| F14 | The words of the Yard name two colours of the drawing: yellow for a switch lined into the track, and green for normal. | `yardSim.js:189-191` | Check: confirmed (added by the check: read the lines). See C16. |
| F15 | The desktop build has one target: a Windows installer. | `src-tauri/tauri.conf.json:33` (`"targets": ["nsis"]`) | Check: confirmed (added by the check: read the line). |

---

## 3. The three options

### 3.1 What is the same in all three

- **The state is real.** Puzzle `p1-clear`, after four moves of its authored line: `pull AS74 3`,
  `pull AS73 2`, `pull AS72 2`, `spot AS74 4`. A Node script imported the frozen `puzzles.js`,
  `model.js` and `geometry.js`, replayed the moves through `model.js`, and wrote the state. The engine
  holds three autoracks. AS74 holds four box cars, loose. AS71 and AS75 hold two cars each, tied.
  The move count is 7 of par 9.
  Check: confirmed (a second Node script replayed the four moves through the frozen `model.js`. The
  state equals the `SCENE.before` object in the prototypes on every key. The three files hold the
  same `SCENE` text, same SHA-256).
- **The move is real.** The next move of the authored line, `spot AS76 3`. The tween numbers come
  from the same arithmetic as `yardSim.js:316-381`: two phases of 600 ms. The model refuses this
  move with the switches as they stand and accepts it with AS76 reverse and the others normal. The
  script checked both. The prototype plays the move only when the switches match the accepted state.
  Check: confirmed (`canSpot` gave `ok: false` as the switches stand and `ok: true` with AS76
  reverse. The tween numbers 333, 1458.2055 and 440 equal the numbers of the check. The state after
  the move equals `SCENE.after` on every key. A click on the play button with the route not lined
  left the move count at 7).
- **Geometry is data.** Each prototype holds the switch positions, lengths and routes as numbers that
  the frozen `geometry.js` computed. No number is typed by hand. The prototypes have their own
  route function. It agrees with the frozen `polyAt` at 603 sample points; the worst difference
  is 1.1e-13.
  Check: confirmed (each geometry value in `SCENE.geo` equals the value from `geometry.js`. The
  route function of each file against `polyAt`: 603 points, worst 1.14e-13, angle difference 0; and
  60,000 random points, worst 1.14e-13).
- **The view transform.** One function maps geometry units to CSS px. It has two forms.
  - *Wide*: one unit is `k` CSS px. It is used when the yard box is 1340 px or more, so that
    `k` is 1 or more.
  - *Tall*: the yard turns a quarter turn. Geometry x runs down the page. Geometry y runs across.
    Each track is a lane. A unit along the track is 0.7 px. The lanes share the box width. The yard
    box is 334 × 966 px at a 390 px window, and the page scrolls down. There is no sideways scroll.
  - A car is a rectangle that turns with the route. Its label stays upright. Its length comes from
    the geometry. Its thickness is 28 CSS px in the wide view. In the tall view it is the lane width
    less 6 px, and 46 px at most: 41.7 px at a 390 px window.

  Check: corrected (the first text gave the tall thickness as a fixed "about 42". It is
  `min(46, lane - 6)`: `proto-svg.src.html:157`. Measured: 31.7 px at 320, 37.4 at 360, 41.7 at 390,
  44.9 at 412, and 46 from 768 up. The other values are confirmed: `proto-svg.src.html:148-163`; yard box 334 × 966
  measured; no sideways scroll at 13 widths from 320 to 1920).
- **Text.** All text in the drawing is 0.6875 rem (11 px at a 16 px root). A car carries its number
  and its type tag on two lines.
  Check: confirmed (row 19; `proto-svg.src.html:33`).
- **Colour.** A page-local palette of 15 names (`--yt-rail`, `--yt-car`, `--yt-loose` and so on).
  Each name points at a Dusk token. There is no raw colour in the three source files (checked with
  a search for hex, `rgb(` and `hsl(`: 0 matches in each). Reverse is amber with the word REVERSE.
  Loose is the attention ink with the word LOOSE. The words carry each state.
  Check: confirmed (15 colour names and 2 type names in `proto-svg.src.html:17-33`. The lint
  `token-lint.mjs` of the reskin tools read the three source files: 0 hex, 0 colour function, 0
  named colour. The forced-colours block uses system colour keywords; the lint accepts them).
- **Reading modes.** High contrast and dyslexia type are token remaps on `html[data-contrast="1"]`
  and `html[data-dys="1"]`, the attributes the app sets today. Text scale follows the root font size.
  Reduced motion follows the operating-system flag or `html[data-reduce="1"]`.
  Check: confirmed (the app sets the three attributes: `AppContext.tsx:57-59`. The prototypes read
  them: `proto-svg.src.html:41`, `:54`, `:225`. Rows 35, 39, 41, 45 and 46 measure them).
- **Words.** A status line (`role="status"`) says each switch change in the words of the prototype
  ("AS71 switch lined reverse."), and the result of the move in the words of the model ("Spotted 3
  to AS76."). When the route is not lined, the prototype shows its own sentence and not the refusal
  message of the model. A list of seven items mirrors the yard: the engine, then each track with its
  switch state, car count, tied or loose, and each car with its type.
  Check: corrected (the first text said that all of these were the words of the model. Only the
  move result is: `proto-svg.src.html:250`, `:247`, `:270`. Measured in the page: the three
  sentences above and "The route to AS76 is not lined. The move did not start.". The list has 7
  items).
- **The Dusk layers** are in each file byte for byte, put there by `inline-dusk.mjs`.
  Check: confirmed (the check ran `inline-dusk.mjs` on each `.src.html` into its scratch folder.
  `cmp` found each result equal to the built file beside the source).

### 3.2 `proto-canvas.html`

One canvas. The backing store is the CSS size times the device pixel ratio, with no limit. The code
reads 15 palette values and the font from `getComputedStyle` and keeps them in a table. Every frame
redraws the whole canvas, as `render.js` does today. A click on the canvas is hit-tested against the
switch boxes in CSS px. The accessible fallback is a group of six HTML buttons below the canvas.
When one of them has focus, the canvas paints a ring on the switch it controls.

Nothing tells a canvas that a token, a font size or the pixel ratio changed. The prototype has three
watchers for that: a `MutationObserver` on the attributes of `<html>`, a `ResizeObserver` on a 1 rem
probe, and a media query listener for the pixel ratio.

Check: confirmed (source read: 15 keys, the full redraw in `frame()`, the hit test, the six
buttons, the three watchers. A picture shows the painted ring and the outline of the button).
A canvas that redraws only the parts that move was not built and not measured (section 10, item 14).

### 3.3 `proto-svg.html`

One inline SVG. Its viewBox equals its CSS size, so one SVG unit is one CSS px and a rem is a rem.
Rails, marks, names, tags and cars are SVG elements. CSS rules on the palette names give them their
colour. Each car is a group with a rectangle and a text. A frame moves a car by its `transform`
attribute and writes an attribute only when its value changed, so a standing car costs nothing.

Two kinds of control are in the file:

- default: each switch is an SVG group with `role="button"`, `tabindex="0"`, a name, a key handler
  for Enter and Space, and its own focus ring;
- with `?controls=html`: each switch is a native HTML `<button>` in a layer over the SVG. The button
  holds the switch name and the word NORMAL or REVERSE as HTML text. The SVG is `aria-hidden`.

Check: confirmed (source read: `proto-svg.src.html:303`, `:310`, `:322-338`, `:367-372`. Both kinds
were driven with the keyboard and the mouse). "Costs nothing" means that the script writes no
attribute for a standing car. The cost to the browser was not measured for a standing car alone.

### 3.4 `proto-hybrid.html`, and why the split is where it is

Canvas: every pixel that can move in a frame. That is the rails, the switch marks, the cars, the
engine and the car numbers. DOM, over the canvas: every part that a person operates or reads as a
state. That is the six switch buttons with their words, the track names, and the TIED and LOOSE tags.

The reason for this line: the frame loop touches only the canvas, and the DOM layer is written only
on an action or a resize. A control then needs no hit test and no painted focus ring, and a state
word is real text. The car numbers stay on the canvas because they move with the cars.

A second split was considered and not built: an SVG for all parts at rest, and a canvas only for the
train while it moves. It needs two renderers for one car and a hand-over at the start and the end of
each move.

Check: confirmed (source read; the canvas of the hybrid also draws the rails and the marks, which
do not move, on each frame). The second split was not built, so nothing about it is measured.

---

## 4. Method

- Browser: headless Chromium 157.0.8103.78 through Playwright 1.63.0, Node 22.23.5, Linux, 4 cores.
  Check: confirmed (read from the browser, the package file and Node).
- **This browser has no GPU.** WebGL reports `SwiftShader` (measured). Canvas and SVG are both
  drawn by the CPU here. A phone draws both with a GPU. The order of the options on a phone is
  not verified.
  Check: confirmed (the renderer string names SwiftShader). The order on a phone stays not verified.
- **Other agents used this machine at the same time.** The 1-minute load was between 0.18 and 1.59
  during the final timing batch. Trust the order of the options more than an absolute figure.
  Check: not verified (a past load cannot be read again). During the check the load was 0.84 to 3.30.
- Views: 1440 × 900 at a pixel ratio of 1; 390 × 844 at a pixel ratio of 3; and 390 × 844 at a ratio of
  3 with `Emulation.setCPUThrottlingRate` at 4.
  Check: confirmed (the check used the same three views). The throttle slows the main thread only:
  row 63.
- Timing: three runs for each cell, a new page for each run, the variants in turn inside each run.
  A cell gives the median of the three runs and the worst of the three runs.
  Check: confirmed (the check used the same order, with six runs for each cell).
- Two scenes: the move (`spot AS76 3`, 1200 ms, an engine and three cars move), and a stress train
  (the "arrive" phase of the arrival, `yardSim.js:277`: one engine and 14 cars for 2200 ms on the
  through route, three of them with a label).
  Check: confirmed (`proto-svg.src.html:215-219`, `:253-256`; `yardSim.js:277`). The arrival of the
  app has 13 cars today, not 14: see section 6.
- The display runs at 60 Hz, so a frame interval of 16.7 ms is the floor. A run of the move has
  about 75 frames when no frame is lost. A run of the stress train has 134.
  Check: confirmed (74 to 76 frames and 133 to 135 frames in the runs with no lost frame).

---

## 5. The measurements

Columns: **Canvas** = `proto-canvas.html`. **SVG** = `proto-svg.html`. **SVG + buttons** =
`proto-svg.html?controls=html` (the recommendation). **Hybrid** = `proto-hybrid.html`.

In the `Check` column, "second figures" are the figures of the check in the column order Canvas;
SVG; SVG + buttons; Hybrid. A timing figure of the check is the median of six runs.

| # | Measure | Method | Canvas | SVG | SVG + buttons | Hybrid | Check |
|---|---|---|---|---|---|---|---|
| 1 | Move, frame interval at 1440: median / worst, ms | `requestAnimationFrame` time stamps in the tween; median of 3 run medians / worst frame of 3 runs | 16.7 / 16.8 | 16.7 / 16.8 | 16.7 / 16.8 | 16.7 / 16.8 | Check: confirmed. Second figures: 16.7 / 16.8 for the first three. Hybrid: 16.7 / 33.3, one frame of 33.3 ms in one run of six, at a load of 1.4. |
| 2 | Move, frame interval at 390: median / worst, ms | as row 1 | 16.7 / 16.8 | 16.7 / 16.8 | 16.7 / 16.8 | 16.7 / 16.8 | Check: confirmed. Six runs: 16.7 / 16.8 for all four. |
| 3 | Move, frame interval at 390 with CPU × 4: median / worst, ms | as row 1 | 16.7 / 66.6 to 83.3 | 16.7 / 16.8 | 16.7 / 16.8 | 16.7 to 33.3 / 66.6 to 83.3 | Check: corrected. The first cells were 16.7 / 66.6 (canvas) and 33.3 / 83.3 (hybrid). In the six runs of the check the hybrid median was 16.7 in each run and its worst frame 66.6; the canvas median was 16.7 in five runs and 33.3 in one, worst 83.3. The cells now give both ranges. |
| 4 | Move at 390 with CPU × 4: frames drawn in each run (about 75 is all) | count of time stamps | 58, 52, 47 | 75, 74, 75 | 75, 75, 74 | 48, 58, 47 | Check: confirmed. Second figures: 52, 56, 59, 58, 65, 45; 75, 75, 75, 76, 74, 76; 76, 74, 75, 75, 75, 76; 63, 54, 62, 67, 56, 52. |
| 5 | Move at 390 with CPU × 4: frames later than 25 ms, each run | count of intervals over 25 ms | 16, 21, 29 | 0, 0, 0 | 0, 0, 0 | 26, 13, 27 | Check: confirmed. Second figures: 23, 18, 15, 15, 8, 29; 0 in six runs; 0 in six runs; 12, 19, 13, 8, 19, 20. |
| 6 | Stress train at 390 with CPU × 4: frames drawn in each run (134 is all) | as row 4 | 88, 96, 80 | 134, 134, 133 | 133, 134, 134 | 89, 97, 77 | Check: confirmed. Second figures: 74, 102, 91, 100, 89, 79; 134, 134, 133, 134, 134, 134; 135, 134, 134, 134, 134, 134; 94, 95, 99, 96, 109, 96. |
| 7 | Stress train at 390 with CPU × 4: frame interval median / worst, ms | as row 1 | 16.7 to 33.3 / 50.1 | 16.7 / 33.4 | 16.7 / 16.8 | 16.7 to 33.2 / 50.1 to 66.6 | Check: corrected. The first cells were 33.2 / 50.0 (canvas) and 33.2 / 50.1 (hybrid). In the check the canvas run medians were 16.7 in three runs and 33.3 in three; the hybrid median was 16.7 in each run, worst 66.6. SVG: 16.7 / 33.3 (one late frame in one run). SVG + buttons: 16.7 / 16.8. |
| 8 | Stress train at 1440 and at 390, no throttle | as rows 1 and 4 | 16.7 / 16.8, all frames | 16.7 / 16.8, all frames | 16.7 / 16.8, 133 of 134 in one run | 16.7 / 16.8, all frames | Check: confirmed. Six runs for each cell: 16.7 / 16.8 for all four. One frame short (133) in one SVG run at 390 and in two hybrid runs at 1440. The run that is one frame short differs between the batches; it is noise. |
| 9 | Main-thread work for each frame of the move, ms: 1440 / 390 / 390 with CPU × 4 | CDP `Performance.getMetrics`, `TaskDuration` before and after the move, divided by the frames; median of 3 runs | 1.86 / 5.39 / 24.22 | 0.96 / 1.09 / 4.36 | 1.07 / 1.05 / 4.68 | 1.90 / 5.08 / 27.17 | Check: confirmed. Second figures: 2.23 / 5.68 / 22.49; 1.06 / 1.19 / 4.26; 1.11 / 1.14 / 4.37; 2.03 / 5.47 / 21.35. |
| 10 | The same, worst run | as row 9 | 2.06 / 6.08 / 28.19 | 1.18 / 1.18 / 5.27 | 1.08 / 1.28 / 4.78 | 2.23 / 5.55 / 27.25 | Check: confirmed. Second figures, worst of six: 3.02 / 6.60 / 29.12; 1.23 / 1.25 / 5.18; 1.50 / 1.27 / 5.00; 2.42 / 6.64 / 24.46. |
| 11 | Main-thread work for each frame of the stress train, ms: 1440 / 390 / 390 with CPU × 4 | as row 9 | 2.01 / 5.48 / 25.40 | 1.04 / 1.05 / 5.26 | 1.11 / 1.20 / 5.46 | 2.12 / 5.44 / 25.31 | Check: confirmed. Second figures: 2.48 / 5.83 / 24.99; 1.16 / 1.21 / 5.03; 1.17 / 1.22 / 5.03; 2.08 / 5.60 / 23.31. |
| 12 | Script time for each frame of the move, ms: 1440 / 390 | CDP `ScriptDuration`, as row 9 | 0.42 / 0.44 | 0.20 / 0.21 | 0.21 / 0.21 | 0.36 / 0.36 | Check: confirmed. Second figures: 0.47 / 0.49; 0.21 / 0.23; 0.22 / 0.22; 0.39 / 0.42. |
| 13 | CPU time of all browser processes for each frame of the move, ms: 1440 / 390 (median, worst run in brackets) | CDP `SystemInfo.getProcessInfo`, the sum of `cpuTime` over all processes, before and after. Not given with the throttle on: the throttle itself burns about 800 ms of CPU each second | 6.08 (6.13) / 7.70 (9.05) | 4.19 (4.34) / 3.51 (3.51) | 4.53 (4.61) / 3.47 (3.47) | 6.40 (6.58) / 8.40 (8.78) | Check: confirmed. Second figures: 5.97 (6.22) / 8.52 (8.82); 4.33 (5.00) / 3.51 (3.73); 4.46 (5.00) / 3.33 (3.92); 6.53 (6.93) / 8.66 (9.33). The throttle burned 758 to 858 ms each second at rest. |
| 14 | CPU at rest, ms each second, no throttle | as row 13, 1.2 s with no animation, 6 runs | 0 to 17 | 0 to 8 | 0 to 8 | 0 to 25 | Check: corrected. The hybrid cell was "0 to 8". Twelve runs of the check: canvas 0 to 17; SVG 0 to 8; SVG + buttons 0; hybrid 0 to 25. The measure has a step of 8.3 ms. It shows no steady work at rest for any option. It cannot rank them. |
| 15 | Canvas with the pixel ratio held at 2 (the limit of today), 390 with CPU × 4: frames of the move / of the stress train, each run | an earlier batch with `?maxdpr=2`; as rows 4 and 6 | 73, 74, 69 / 119, 126, 133 | no canvas | no canvas | 71, 72, 74 / 133, 120, 134 | Check: confirmed. Second figures: canvas 76, 74, 74 / 129, 131, 132; hybrid 74, 75, 71 / 126, 134, 126. Bitmap 668 × 1932. Main-thread work for each frame of the move: 13.1 to 14.7 ms (canvas), 11.9 to 14.0 ms (hybrid). |
| 16 | Time to first draw, ms after navigation start: 1440 / 390 / 390 with CPU × 4 (median) | `performance.now()` when the first draw call returns; file loaded from disk | 29.7 / 36.1 / 150.5 | 24.5 / 28.0 / 126.7 | 29.1 / 26.2 / 125.6 | 27.4 / 36.1 / 181.6 | Check: confirmed. Second figures, at a higher load: 37.2 / 35.6 / 167.4; 26.6 / 28.9 / 111.2; 28.1 / 27.0 / 106.9; 33.6 / 39.4 / 152.4. The differences between the options are smaller than the spread between runs at 1440. |
| 17 | The same, worst run | as row 16 | 40.5 / 38.7 / 156.9 | 51.9 / 30.7 / 131.6 | 35.2 / 27.1 / 127.3 | 30.8 / 37.6 / 190.7 | Check: confirmed. Second figures, worst of six: 48.2 / 40.0 / 186.3; 39.7 / 32.0 / 148.1; 32.1 / 29.3 / 143.7; 37.4 / 45.2 / 185.7. |
| 18 | First contentful paint, ms: 1440 / 390 / 390 with CPU × 4 (median) | the browser's `paint` timing entry | 84 / 72 / 264 | 88 / 52 / 184 | 80 / 52 / 184 | 80 / 80 / 288 | Check: confirmed. Second figures: 88 / 76 / 270; 84 / 58 / 172; 88 / 54 / 174; 92 / 76 / 252. |
| 19 | Smallest text in the drawing, CSS px, at 1440 and at 390 | computed `font-size` of each text node; for a canvas, the font of each `fillText` call times the transform, divided by the pixel ratio | 11 and 11 | 11 and 11 | 11 and 11 | 11 and 11 | Check: confirmed (the same method, written again: 11 and 11 for all four). |
| 20 | Text in the drawing that is real text / that is painted pixels | count of text nodes in the yard / count of different painted strings | 0 / 27 | 45 / 0 | 45 / 0 | 22 / 16 | Check: confirmed (0 / 27; 45 / 0; 45 / 0; 22 / 16). The buttons of the last two hold 6 more text nodes that only a screen reader gets. |
| 21 | Box of a switch target at 1440, CSS px | `getBoundingClientRect`; for the canvas, the hit box in the code | 96 × 44 on the canvas, and a 116.3 × 44 button beside it (124.1 × 44 with the word REVERSE) | 96 × 44 | 96 × 44 | 96 × 44 | Check: corrected (the button with the word REVERSE is 124.1 px wide; the first cell gave one width). The other values are confirmed. No two boxes overlap. |
| 22 | Box of a switch target at 390, CSS px | as row 21 | 45.7 × 76 on the canvas, and a 116.3 × 44 button beside it | 45.7 × 76 | 45.7 × 76 | 45.7 × 76 | Check: confirmed (45.7 × 76 for all; no two boxes overlap). Rows 56 and 57 give other widths. |
| 23 | Real pointer clicks that lined the right switch and no other | 30 mouse clicks for each width: the centre and the four inner corners of each of the six boxes | 30 of 30, both widths | 30 of 30, both widths | 30 of 30, both widths | 30 of 30, both widths | Check: confirmed (30 of 30 at both widths for all four. Six more clicks 3 px outside each box lined no switch). |
| 24 | What a screen reader gets for the drawing | Playwright ARIA snapshot and CDP `Accessibility.getFullAXTree` | `img "Yard diagram. The switches and the yard state follow in words."`, then `group "Switches"` with 6 buttons | `group "Yard diagram"` with 6 buttons | 6 buttons | 6 buttons | Check: confirmed (both methods). No screen reader spoke it: section 10, item 4. |
| 25 | The name of a switch control | as row 24 | `AS74 switch, lined REVERSE` | `AS74 switch, lined reverse` | `AS74 switch, lined REVERSE` | `AS74 switch, lined REVERSE` | Check: confirmed. |
| 26 | What a screen reader gets for the yard state | as row 24 | a list of 7 items, and a status region | the same | the same | the same | Check: confirmed (1 list, 7 list items, 1 status in each tree). |
| 27 | Key presses to line one switch (AS74) from the top of the page | Playwright keyboard: Tab until the control has focus, then Enter | 7 (6 Tab, Enter) | 7 | 7 | 7 | Check: confirmed (7 for all; focus order: play, reset, AS71 to AS74). |
| 28 | Key presses to line the route (AS74 normal, AS76 reverse) and start the move | as row 27, then 2 Tab, Space, 7 Shift+Tab, Enter; the move started in each case | 18 | 18 | 18 | 18 | Check: confirmed (18 for all; Enter and Space both lined a switch; the move ended with "Spotted 3 to AS76." and 3 cars on AS76). |
| 29 | Visible focus | a picture of the focused control; computed outline | the Dusk outline on the button, and a ring painted on the canvas | its own ring, drawn by CSS on an SVG rectangle; the outline is off | the Dusk outline, 2 px | the Dusk outline, 2 px | Check: confirmed (button outline `solid 2px rgb(159, 196, 255)`, offset 2 px; SVG kind: outline `none`, ring stroke `rgb(159, 196, 255)` 2 px; pictures looked at). |
| 30 | At 390, is the drawn switch in the window when its control has focus | box of the drawn switch against the window | **no**: the button is below the canvas | yes | yes | yes | Check: confirmed (canvas: the top of the drawn switch is 198 px above the window when its button has focus; the other three: in the window). |
| 31 | DOM elements: whole page / inside the yard | `querySelectorAll('*').length` | 58 / 2, and 13 for the button group | 179 / 136 | 180 / 137 | 89 / 46 | Check: confirmed. |
| 32 | Canvas bitmap: 1440 at ratio 1 / 390 at ratio 3 | `canvas.width × height × 4` bytes, in units of 1,048,576 bytes | 2.5 MB / 11.1 MB | none | none | 2.5 MB / 11.1 MB | Check: confirmed (1384 × 475 and 1002 × 2898: 2.51 and 11.08 in units of 1,048,576 bytes; 2.63 and 11.62 in units of 1,000,000 bytes). |
| 33 | Source of the drawing code: script lines + style lines, not blank (bytes) | line count of the block between the two "drawing code" markers, and of its style rules | 93 + 0 (5.5 kB) | 85 + 29 (7.8 kB), both control kinds | the same file | 90 + 13 (6.7 kB) | Check: confirmed (93, 85 and 90 script lines; 0, 29 and 13 style lines; script bytes 5475, 5670 and 5744). |
| 34 | Source that all three share: view transform, stock list, tween, text mirror | line count | 164 + 51 | 164 + 51 | 164 + 51 | 164 + 51 | Check: confirmed (164 script lines before the drawing code, and 7 more start lines after it; 51 style lines). |
| 35 | High contrast set on `<html>`: does the picture follow with no call into the drawing code | a picture of the yard before and after; pixels that differ | yes | yes | yes | yes | Check: confirmed (pixels that differ at 1440, of 658,784: 43,514; 43,505; 43,523; 43,532). |
| 36 | What must be redrawn for row 35, and how | counters in the page; a count of canvas calls; computed `fill` and `stroke` before and after | the code reads 15 values and the font again, then redraws all: 108 canvas calls | no script. The browser repaints 70 of 135 elements | no script. 53 of 111 elements | the code reads the values again, redraws all: 86 canvas calls; the browser restyles the DOM layer | Check: confirmed (1 token read, 1 redraw and 108 calls; 0 redraws and 70 of 135; 0 redraws and 53 of 111; 1 redraw and 86 calls). |
| 37 | Main-thread work for row 35, ms: 1440 / 390 | CDP `TaskDuration` | 4.1 / 10.9 | 2.6 / 2.8 | 3.5 / 3.0 | 6.1 / 9.0 | Check: confirmed (one run each: 3.6 / 9.2; 2.8 / 2.4; 3.3 / 3.4; 4.6 / 6.6). One run for each cell; the order is the same. |
| 38 | A token changed by a style sheet, with no change on `<html>`: does the picture follow | a new `<style>` element that remaps two tokens; pixels that differ at 1440 | **no**: 0 px change. The picture is stale | yes: 37,018 px | yes: 37,018 px | **no** for the canvas part: 0 px change | Check: confirmed (0; 37,018; 37,018; 0). The canvas stays stale after its next redraws too: row 62. |
| 39 | Root font size 125 %: does the drawing text follow | size of the car number after the change | yes, 13.75 px. The probe watcher starts 2 redraws | yes, 13.75 px. No script | yes, 13.75 px. No script | yes, 13.75 px. The probe watcher starts 2 redraws | Check: confirmed (13.75 px for all; 2 redraws and 2 token reads for the two canvas kinds; 0 for the two SVG kinds). |
| 40 | Root font size 125 %: does the car number fit | width of `480066` against the car | no. Wide: 49.7 px in a 43.4 px car. Tall: 49.5 px across a 41.7 px car, in a 47.7 px lane | the same | the same | the same | Check: confirmed (the same four figures for all; picture looked at: the numbers of two cars that touch run together). Row 59 gives the text scale of the app. |
| 41 | Dyslexia type set on `<html>`: does the drawing font follow | font family of the car number after the change | yes, through the token read | yes, no script | yes, no script | yes, through the token read | Check: confirmed (the family string starts with "Atkinson Hyperlegible" in all four; the face on this machine is a fallback: section 10, item 9). |
| 42 | Sharpness at a pixel ratio of 1, 2 and 3 | mean brightness step between neighbour pixels in a crop of one car label, device pixels | 28.04, 15.55, 10.55 | 28.04, 15.54, 10.55 | 28.04, 15.54, 10.55 | 28.04, 15.55, 10.55 | Check: confirmed (the same twelve figures, from a script of the check). |
| 43 | Canvas bitmap px for each CSS px at a ratio of 1, 2, 3 | `canvas.width` / box width | 1, 2, 3 | none | none | 1, 2, 3 | Check: confirmed. |
| 44 | Withdrawn. See section 14, W1, and row 64 | | | | | | Check: refuted (the check got the same figures, but their cause is the capture and not the canvas). |
| 45 | Reduced motion, operating-system flag: time from the call to the end state, and frames | `performance.now()` around the move; frame count | 1.7 ms, 0 frames | 0.9 ms, 0 frames | 1.0 ms, 0 frames | 1.3 ms, 0 frames | Check: confirmed (1.6; 0.8; 1.0; 1.2 ms; 0 frames in each). |
| 46 | Reduced motion, app attribute `data-reduce="1"` | as row 45 | 2.1 ms, 0 frames | 1.0 ms, 0 frames | 1.1 ms, 0 frames | 1.5 ms, 0 frames | Check: confirmed (2.9; 0.8; 1.2; 1.1 ms; 0 frames in each). |
| 47 | Reduced motion: do the words show the end state | text of the status line, the readout and the mirror | yes: "Spotted 3 to AS76.", "Moves 9 / par 9", "AS76. … 3 cars, loose …", "Engine … holds no cars." | the same | the same | the same | Check: confirmed (the four texts, in all four). |
| 48 | Reduced motion: is the end picture the same as the end picture after the animation | pixels that differ, of 322,978 | 0 | 0 | 0 | 0 | Check: confirmed (0 for all four; each picture from a new page, taken the same way). |
| 49 | Find-in-page finds a word of the drawing: REVERSE / the type tag BX / LOOSE | `window.find()` | yes (from the button beside) / no / no | yes / yes / yes | yes / yes / yes | yes / no / yes | Check: confirmed (and where the hit is: canvas, in the button group; the two SVG kinds, in the yard; hybrid, in the yard for REVERSE and LOOSE). |
| 50 | What a browser test can read from the drawing: car nodes / switch states / tags | `querySelectorAll` in the yard | 0 / 0 / none | 12 / 6 / `TIED,LOOSE,TIED` | 12 / 6 switches, each state on 2 elements / `TIED,LOOSE,TIED` | 0 / 6 / `TIED,LOOSE,TIED` | Check: corrected (with the HTML buttons, 12 elements carry `data-state`: the SVG group and the button of each switch. A test must pick one). A car group has no attribute with its mark; a test reads its text. |
| 51 | Print to PDF, Letter: is the car number text in the PDF; is the whole yard on the page | `page.pdf()`, then `pdftotext`; a picture of the page | text yes; the yard is cut at the paper edge | text yes; cut | text yes; cut | text yes; cut | Check: confirmed (`9001` and `480066` are in the text of each PDF; 1 page each; the picture of each page shows the tracks cut at the right edge, with the cars at the deep end off the paper). |
| 52 | Forced colours with the palette as it was: is the yard readable | a picture with `forcedColors: 'active'` | yes, unchanged: the canvas ignores the user colours | **no**: light names on a white floor | partly: the button words are black on white; the track names and tags are light on white | partly: black words on white plates over a dark canvas | Check: corrected (the SVG + buttons cell was "not pictured"). The check removed the remap block from scratch copies and took the four pictures. The other three cells are confirmed. |
| 53 | Forced colours with a remap of the 15 palette names to system colours (one CSS block, now in all three files) | the same picture after the change | follows | follows | follows | follows | Check: confirmed (four pictures looked at: black on white, the reverse switch in the highlight colour). |
| 54 | Sideways scroll at 1440 and at 390; console errors | `scrollWidth` against `clientWidth`; the console | none; 0 | none; 0 | none; 0 | none; 0 | Check: confirmed (and no sideways scroll at 320, 360, 375, 378, 412, 768, 1024, 1280, 1366, 1536 and 1920). |
| 55 | Contrast of the palette (one palette for all) | WCAG ratio with `dusk/lib/color.mjs` on the token values | lowest text pair 5.94 (LOOSE on the floor); lowest shape pair 5.39 (ladder rail on the floor) | the same | the same | the same | Check: confirmed (the check took the colours that the browser computed for each text and each line, not a list of token pairs: lowest text 5.94, lowest shape 5.39; in high contrast 5.94 and 7.21). |
| 56 | Which view does a window get. Added by the check | view mode and yard box at 13 window widths, ratio 1 | tall up to 1366; wide from 1440 | the same | the same | the same | Check: confirmed (added by the check: 320, 360, 375, 378, 390, 412, 768, 1024, 1280 and 1366 give the tall view, 966 px high; 1440, 1536 and 1920 give the wide view. At 1366 the yard box is 1310 px and a lane is 187 px wide. Picture looked at). |
| 57 | Box of a switch target at narrow windows. Added by the check | as row 21, at 320 / 360 / 375 / 378 | on the canvas 35.7 / 41.4 / 43.6 / 44.0 wide, 76 high; the button beside it stays 116.3 × 44 | 35.7 / 41.4 / 43.6 / 44.0 wide, 76 high | the same | the same | Check: confirmed (added by the check: measured). The target is under 44 px wide below a window of 378 px. |
| 58 | Does the number `480066` fit its car at the base text size. Added by the check | width of the text against the car, 16 px root | 1440: 39.7 in 43.4, fits. 390: 39.6 across 41.7, fits. 360: 39.6 across 37.4, **no**. 320: 39.6 across 31.7, **no** | the same | the same | the same | Check: confirmed (added by the check: measured; picture at 360 looked at). |
| 59 | Does the number fit at the text scale of the app, 18.5 px root. Added by the check | as row 40 | **no**. Wide: 45.9 px in a 43.4 px car. Tall: 45.7 px across a 41.7 px car, in a 47.7 px lane | the same (45.8 tall) | the same (45.8 tall) | the same | Check: confirmed (added by the check: measured; text size 12.72 px; picture looked at). |
| 60 | Touch: a tap on each switch control at 390. Added by the check | Playwright touch emulation with a mobile view; one tap at the centre of each box | 6 of 6 | 6 of 6 | 6 of 6 | 6 of 6 | Check: confirmed (added by the check: measured; tall view, no sideways scroll). Not a real finger: section 10, item 1. |
| 61 | Does the switch control keep focus. Added by the check | focus the AS74 control; change the window width 390 to 412; read `document.activeElement`. Then press Enter | kept after the width change; kept after Enter | **lost** after the width change; kept after Enter | **lost**; kept after Enter | **lost**; kept after Enter | Check: confirmed (added by the check: measured). The three prototypes build their controls again on each layout. See C15. |
| 62 | A token changed through a class on `<body>`, and a later redraw. Added by the check | a rule `body.x .yt-yard{…}` and the class; pixels that differ at 1440. Then two actions that redraw | 0 px. Still 0 px after the redraws | 19,724 px | 19,724 px | 0 px for the canvas part | Check: confirmed (added by the check: measured). The canvas reads tokens only when a watcher fires. A redraw does not read them. |
| 63 | Does the CPU throttle slow other threads. Added by the check | one loop of 40 million square roots, on the main thread and in a worker, at rate 1 and at rate 4; 3 runs each | main thread: 390 to 544 ms at rate 1, 1897 to 2325 ms at rate 4. Worker: 370 to 395 ms at rate 1, 323 to 432 ms at rate 4 | no difference between the options: the test has no drawing | | | Check: confirmed (added by the check: measured). The throttle slows the main thread about 4 times. It does not slow a worker thread. |
| 64 | A capture taller than the window changes how the browser draws text afterward. Added by the check | a window picture; then a picture of the yard element or of the full page; then a window picture; pixels that differ, 390 at ratio 3 / at ratio 1. Control: the same with no tall capture | 3,029 / 389 at once; 16,193 / 3,011 after its next redraw. Control: 0 | 28,772 / 3,553 at once. Control: 0 | 21,923 / 3,221 at once. Control: 0 | 15,209 / 2,366 at once; 18,564 / 3,031 after its next redraw. Control: 0 | Check: confirmed (added by the check: measured). It happens in every option. A scroll, a window picture and a window resize did not cause it (tested on the canvas file). The cause in the browser is not verified. This replaces row 44. |
| 65 | An estimate: CPU for each frame if every thread were 4 times slower, ms. Added by the check | row 13 of the check at 390, times 4. For the stress train the same measure times 4. Not a measurement | move 34.1; stress train 34.8 | move 14.0; stress train 16.3 | move 13.3; stress train 16.3 | move 34.6; stress train 35.1 | Check: confirmed (added by the check: arithmetic on measured figures: 8.52, 3.51, 3.33, 8.66 and 8.69, 4.08, 4.07, 8.77 ms). The frame is 16.7 ms. The CPU time is the sum over more than one thread, so the estimate does not say that a frame is lost. |

Contrast pairs behind row 55, all on the floor `--well` unless a surface is named: names and NORMAL
and TIED `--ink-2` 11.71; REVERSE `--amber-ink` 7.21; LOOSE `--attn-ink` 5.94; car text `--ink` on
`--tile-grey-lo` 8.90; ENG `--ink` on `--panel-hi` 16.68; rail and car edge `--ink-3` 7.21; ladder
rail `--grey` 5.39; engine edge `--teal-ink` 7.87; focus ring `--focus` 11.36. In high contrast:
names `--ink` 17.92; car text `--ink` on `--ground-0` 17.92; ladder rail `--ink-2` 11.71.

Check: confirmed (the check got each figure again from `dusk/lib/color.mjs`, and from the colours that the
browser computed). Two pairs were not in the list. The fill of a car against the floor is 2.01 and
the fill of the engine against the floor is 1.07. The edge carries each shape (7.21 and 7.87), so the
shape passes. In high contrast the fill of a car equals the floor and its edge is 17.92.

### What the table shows

1. **Speed.** With no throttle, all four hold 60 frames each second in both scenes. With the main
   thread at one quarter, the two options with a canvas lose frames (rows 4 to 7) and the two SVG
   variants lose one frame at most in a run. The cost of the canvas follows the size of its bitmap,
   1002 × 2898 at a ratio of 3: the script time for a frame is 0.5 ms of the 5.7 ms of main-thread
   work (rows 9 and 12), and the work falls when the bitmap is smaller (row 15). With the pixel ratio held at 2 the canvas loses few frames (row 15).
   The SVG uses about 40 % of the CPU of the canvas at 390 and about 73 % at 1440 (row 13).
   Check: corrected (three changes. "Do not" became "lose one frame at most in a run": row 6 has
   133 of 134. "The CPU at one quarter" became "the main thread at one quarter": row 63. "About
   half the CPU at 390" became "about 40 % at 390 and about 73 % at 1440": 3.51 / 8.52 and
   4.33 / 5.97).
2. **This result does not prove that a canvas is slow on a phone.** A phone draws a canvas with a
   GPU (section 4). The throttle of this test slows only the main thread (row 63). A canvas does
   most of its work on the main thread here: 5.68 of 8.52 ms. An SVG does most of its work on other
   threads: 2.3 of 3.5 ms. So the test with the throttle favours the SVG. If every thread were 4
   times slower, the SVG would use 13 to 16 ms of CPU for a frame of 16.7 ms, over more than one
   thread, and the canvas 34 to 35 ms (row 65, an estimate). The order of the options stays. The
   margin of the SVG on a slow device is not verified.
   Check: corrected (the first text said that the result shows that the SVG has a margin in the
   worst case measured. That holds only for the main thread. The paragraph now gives the limit of
   the test, from rows 9, 13, 63 and 65).
3. **Tokens and reading modes.** The SVG follows a token, a font and a font-size change with no
   code (rows 36, 39, 41). A canvas follows only the changes that its watchers see. It missed a
   token change made by a style sheet (row 38) and one made through a class on `<body>` (row 62).
   Check: confirmed (rows 36, 38, 39, 41 and 62).
4. **Text.** All four reach 11 px at both widths, because the text size is not tied to the geometry
   scale any more. Only the SVG keeps every word of the drawing as real text (row 20).
   Check: confirmed (rows 19 and 20). The other side of this choice: a number can be wider than its
   car (rows 40, 58, 59).
5. **Targets and keyboard.** All four give a 44 px target at 1440 and at 390, and the same key
   count. The canvas keeps its keyboard controls beside the drawing. On a phone the control with
   focus and the switch it lines are not on the screen together (row 30).
   Check: corrected ("a 44 px target" is true at 1440 and at 390. Below a window of 378 px the
   target on the drawing is under 44 px wide: row 57).
6. **Sharpness.** No difference at a pixel ratio of 1, 2 or 3 when the canvas uses the full ratio
   (row 42). The cost for the canvas is the bitmap: 11.1 MB at a phone size (row 32).
   Check: confirmed (rows 32 and 42).
7. **The two SVG control kinds are equal** on every row in this browser, but for the name in row 25
   and the count in row 50. Section 7 gives the reason for the HTML buttons.
   Check: confirmed (no timing row of the check separates them).

---

## 6. Weighed from the code

**The cost to port `render.js` and `anim.js`.**

- A canvas port is close to line for line. The changes are: the palette table becomes a token read
  (`render.js:10-19`); each coordinate goes through the view transform; the text no longer shrinks
  to fit (`render.js:171-172`); the pixel ratio and the three watchers are added. The canvas
  prototype is 93 lines for a part of the features.
  Check: confirmed (lines read; 93 lines counted).
- An SVG port is not line for line. `render.js` paints from the state on each call. An SVG keeps
  elements. The port has three parts: a function that turns the state, `anim` and `cine` into a
  list of bodies (pure, and the same for any option; 22 lines in the prototypes); a builder for the
  parts at rest; and a pool that moves one group for each body. The SVG prototype is 85 script
  lines and 29 style lines for the same part of the features. An estimate for the full port, not
  verified: 200 to 260 script lines and 40 to 60 style lines.
  Check: confirmed (`stock()` is 22 lines, `proto-svg.src.html:201-222`; 85 and 29 counted). The
  estimate stays not verified.
- The controller keeps its one call. `paint()` at `yardSim.js:264` passes the state, the puzzle,
  `anim` and `cine`. An SVG renderer can take the same four values. Four more places in the
  controller change with the canvas: the CSS rule for the canvas (`yardSim.js:64`), the canvas
  element in the markup (`:154`), the context and the pixel ratio (`:232-235`), and the click
  handler with its hit test (`:285-296`).
  Check: corrected (the first text said that only the canvas context argument goes away. The four
  places above also change. They are in the files of Y1, Y2 and Y4, not in a frozen file).
- `anim.js` is the same for any option. One change is needed for any option: with reduced motion,
  `play()` must call each step once with `t = 1` and then finish. The speed factor of 6 makes the
  move slower (F6).
  Check: confirmed (code read: each step function must still run once, because a step function
  commits the move to the model, `yardSim.js:343-351`, `:368`, `:375`. The change was not built or
  run). `anim.js` is not a frozen file. See section 13, P9.

**The arrival and the departure.** Both are lists of bodies on a route. The arrival draws an engine
and 11 or 13 cars on the through route (`render.js:55-65`), then slides the set-out cars along their
track (`render.js:68-78`), and hides those cars from the track until then (`render.js:39`). The
departure moves the engine and its cut off the left edge (`yardSim.js:508-524`). In an SVG each is
the same pool with more bodies. The stress train measured a train of 14 cars, one more than the
largest today (rows 6 to 8, 11). The off-frame positions need a clip, which the SVG box gives.

Check: corrected (the first text said "11 to 14 cars". The code draws 11 cars and the set-out cars
of the puzzle. One puzzle of 19 has an arrival, `p6-road`, with 2 set-out cars: 13 cars while it
arrives, 11 after. Read from `puzzles.js` through a Node import). The other lines are confirmed.
The arrival and the departure were not built in a prototype.

**Testing.** With an SVG, a browser test can assert the yard state from the drawing itself: which
cars exist, where each one is, the state of each switch, each tag (row 50). With a canvas, a test
can assert only the text mirror or a picture. No gate script reads `render.js` or the canvas today.

Check: corrected (the sentence "A picture test of a canvas is not stable at a pixel ratio of 3" is
withdrawn: section 14, W2. The last sentence is added by the check: a search of `tools/` for
`render.js`, `yardSim` and `canvas` gave 0 matches). A rule for the look harness of G1 follows from
row 64: take each picture from a new page, or take the pictures of one page in one fixed order.

**Printing and zoom.** All four cut the yard at the paper edge, because the script lays the yard out
for the screen width and print does not run it again (row 51). A print rule or a `beforeprint` layout
is needed for any option. Browser zoom changes the CSS width, so the view transform runs again
through the `ResizeObserver`; that part is the same for all. A canvas must also be redrawn at the
new pixel ratio. That path was not verified (section 10).

Check: confirmed for print (row 51). Not verified for zoom: the check changed the window width and
the layout ran again (row 61), but it did not test browser zoom.

**The Tauri WebView2 and a phone browser.** WebView2 is Chromium, the engine that was measured. It
was not tested. A phone browser was not tested. Safari and any WebKit view were not tested: only
Chromium is installed here.

Check: not verified ("WebView2 is Chromium" is from model knowledge. The desktop build has one
target, a Windows installer: F15. No WebView2 and no phone were tested).

---

## 7. The recommendation and its reasons

**One inline SVG for the whole drawing. Six native HTML buttons over it for the switches. A list
beside it for the text mirror. No canvas.**

The split:

| Layer | Holds | Written when |
|---|---|---|
| SVG, `aria-hidden` | rails, clearance marks, switch marks, cars, engine, car numbers and type tags, track names, TIED and LOOSE tags | parts at rest: on a layout. Switch marks and tags: on an action. Cars: on a frame, and only the attributes that changed |
| HTML buttons, over the SVG | the six switch controls, each with its name and the word NORMAL or REVERSE | on a layout and on an action |
| HTML list and status line, beside the SVG | the text mirror and the spoken result | on an action |

Check: confirmed (this is what `proto-svg.html?controls=html` does: source read and page driven).
One change for the build: place the buttons again on a layout, but do not build them again (row 61,
C15).

Reasons, each from the table:

1. It was the only kind of option that held the frame rate in the hardest case measured: one late
   frame at most in a run (rows 4 to 7). The method of the hardest case favours the SVG (rows 63
   and 65).
   Check: corrected (the first text said "lost no frame". Row 6 has a run with 133 of 134. The
   limit of the test is added).
2. It follows a token change, the text scale and the dyslexia font with no code (rows 36, 38, 39,
   41, 62). The four reading modes then cannot go stale in the Yard.
   Check: confirmed (rows 36, 38, 39, 41, 62; reduced motion: rows 45 to 48).
3. Every word in the drawing is real text at 11 px or more (rows 19, 20, 49).
   Check: confirmed.
4. The control is on the switch it lines, at both widths (rows 21, 22, 30).
   Check: confirmed.
5. A test can assert the yard state from the drawing (row 50). The gate job G1 can use that.
   Check: confirmed (row 50). The car groups need a mark attribute for that: section 9, Y2 item 7.
6. It needs no bitmap, no pixel-ratio code and no watcher for a token or a font size (rows 32, 43).
   It keeps one `ResizeObserver` for the layout, as all the options do.
   Check: corrected (the first text said "no watcher". The SVG file has one, for the width:
   `proto-svg.src.html:384`).

Why HTML buttons and not SVG groups with a button role: the two were equal on every timing row here.
A native button gives Enter, Space, the Dusk focus ring and forced-colour handling with no code. The
SVG kind needs its own key handler and its own ring (row 29). How a WebKit screen reader treats a
button role on an SVG group is not verified. The native button removes that question.

Check: confirmed for this browser (rows 28, 29, 52). The WebKit part stays not verified.

Why not the canvas: it is stale after a token change that its watchers do not see (rows 38, 62);
none of its text is real (row 20); its keyboard controls are away from the drawing (row 30); a test
cannot read it (row 50).

Check: confirmed (rows 20, 30, 38, 50, 62).

Why not the hybrid: it has the costs of both. It has the token read, the pixel-ratio code and the watchers
of the canvas, and the placed layer of the SVG variant. Its frame cost equals the canvas (rows 4, 9).
The car numbers are still pixels (row 20).

Check: confirmed (rows 4, 9, 13, 20; source read).

---

## 8. The costs and risks of the recommendation

| # | Cost or risk | Size | Check |
|---|---|---|---|
| C1 | The port is a rewrite of `render.js`, not a translation (section 6). | 200 to 260 script lines and 40 to 60 style lines, not verified | Check: not verified (an estimate; nothing was built at full size). |
| C2 | The page has about 120 more elements (row 31). | measured | Check: confirmed (180 against 58: 122 more, for 11 cars and an engine). The count grows with the cars. |
| C3 | The frame cost grows with the count of moving cars. 15 were measured. A longer train was not. | not measured | Check: not verified (not measured in the check). The largest train of the app today is an engine and 13 cars (section 6). |
| C4 | WebKit was not tested: the two-line `tspan` labels, `dominant-baseline`, and the speed. | not verified | Check: not verified (only Chromium is installed here). |
| C5 | The wide view needs a yard box of 1340 px or more. The app column is 920 px at most today (F2). If the Yard stays in that column, a desktop gets the tall view. The Yard must get the window width, or the look must give a third view. A car number of 6 digits at 11 px is 39.7 px wide; a 42-unit car reaches that only at 0.95 px a unit, a box of 1267 px. | measured widths; the choice is for the look and for Gate A | Check: confirmed (39.7 px measured; 39.7 / 42 = 0.945; 0.945 × 1340 = 1267). The window width alone is not enough: see C12. A wider Yard changes `src/index.css:6` and `:17`, which are shell files, not Yard files. |
| C6 | The tall view is 966 px high at a 390 px window. The window is 844 px. The learner scrolls to see the whole yard. | measured; a matter for the look and for Gate A question 2 | Check: confirmed (966 px at every tall width; the page is 1554 px high at 390). |
| C7 | In the tall view a switch target is the lane width less 2 px. It is 45.7 px at a 390 px window. It is 44 px or more only when the yard box is 322 px or more: a window of 378 px with the paddings of the prototype. At a 360 px window it is 41.4 px. With no padding in the panel it is 44.9 px at 360. | measured at 320, 360, 375, 378 and 390; the 44.9 is computed | Check: confirmed (row 57: 35.7, 41.4, 43.6, 44.0 and 45.7 px. The paddings are 16 + 16 px on the body and 12 + 12 px in the panel, measured. 360 - 32 = 328; 328 / 7 - 2 = 44.9). The first text gave the 360 value as computed; it is now measured. |
| C8 | At a text scale of 125 % a 6-digit number is wider than its car by 6.3 px (wide) and wider than its lane by 1.8 px (tall) (row 40). The build needs a rule for that case. | measured | Check: confirmed (49.7 - 43.4 and 49.5 - 47.7). The text scale of the app is not 125 %: see C14. |
| C9 | The button layer must be placed again on each layout. A drift between the two layers is possible if the SVG is ever scaled by CSS. Keep the viewBox equal to the CSS size. | design rule | Check: confirmed as a rule (the 30 clicks of row 23 hit at both widths, so the two layers agree in the prototype). See C15 for the focus. |
| C10 | Forced colours need the remap block (rows 52, 53). Print needs a rule (row 51). | 15 declarations in a block of 7 lines for forced colours; print not built | Check: corrected (the first text said "15 lines". The block is 7 lines with 15 declarations: `proto-svg.src.html:47-53`). |
| C11 | The frame times come from a browser with no GPU (section 4). | not verified on a real device | Check: not verified (no real device in the check). |
| C12 | A window of 1280 or 1366 px gets the tall view, even when the Yard has the full window width. The wide view starts at a window of 1396 px with the paddings of the prototype. | measured (row 56); the 1396 is computed: 1340 + 56 | Check: confirmed (added by the check: 1366 gives a yard box of 1310 px and the tall view; 1440 gives 1384 px and the wide view). The look needs a view for the widths between a phone and 1396 px. This is for R1 and for Gate A. |
| C13 | At a window of 360 px the tall view gives a target of 41.4 px, and the number `480066` is 2.2 px wider than its car at the base text size. At 320 px the target is 35.7 px. | measured (rows 57, 58) | Check: confirmed (added by the check). Fence 8 asks for 44 px. The lane width must grow, or the control must leave the lane, for a window under 378 px. |
| C14 | At the text scale of the app (18.5 px) the number `480066` is 2.5 px wider than its car in the wide view and 4.1 px wider than its car in the tall view. It stays inside its lane by 1.9 px. | measured (row 59) | Check: confirmed (added by the check). The rule of C8 is needed at the setting that the app has today, not only at 125 %. |
| C15 | The prototypes with the controls on the drawing build the controls again on each layout. The control with focus then loses focus. | measured (row 61) | Check: confirmed (added by the check). The build must move the six buttons on a layout and keep the elements. |
| C16 | The "How to play" text of the Yard names yellow and green as the colours of a switch (F14). The prototypes use amber for reverse and a neutral ink for normal. If the new palette drops green, that text is false. | `yardSim.js:189-191`; `proto-svg.src.html:26-27` | Check: confirmed (added by the check: both places read). A reskin changes no word (fence 3) and shows nothing false (fence 15). The look must keep the two colour meanings that the text names, or the owner must approve new words. See section 11, note 2. |
| C17 | The method of the speed test with the throttle favours the SVG. | rows 63 and 65 | Check: confirmed (added by the check). A test on a real slow phone is the only proof: section 10, item 1. |
| C18 | A picture taken after a capture that is taller than the window differs from a picture taken before, in every option. | row 64 | Check: confirmed (added by the check). It matters for the look harness of G1, not for the choice of technology. |

---

## 9. What the build jobs need from this

Each item below is a proposal. The `Check:` line gives the result of its test against the fence.
Section 13 gives the test in one table.

### Y2, the drawing

1. One inline SVG whose viewBox equals its CSS size. One SVG unit is one CSS px.
   Check: confirmed (no fence line is touched; measured in the prototype).
2. One pure view-transform function. Every point from `geometry.js` goes through it. `geometry.js` is
   imported and not changed. Lengths along a track come from the geometry; the thickness of a car
   and all text sizes are CSS values.
   Check: confirmed (fence 1 holds: the frozen file is read, not changed; the prototypes hold only
   numbers that it computed).
3. One pure function from the state, `anim` and `cine` to a list of bodies (a place, an angle, a
   length, a number, a type, loaded or empty). The move, the arrival and the departure all use it.
   Check: confirmed (no fence line is touched). The arrival and the departure were not built.
4. One group for each body, moved by its `transform`. Write an attribute only when its value changed.
   Check: confirmed (no fence line is touched; `proto-svg.src.html:367-372`).
5. Colour only in CSS, on palette names that point at Dusk tokens through the bridge file
   `src/styles/clear-board.tokens.css`. No colour in the script. Job S1 owns that file; Y2 needs
   the names in it.
   Check: confirmed (fence 4 holds; the lint found 0 raw colours in the prototypes). The colours of
   the car types in the frozen `geometry.js:44-48` are not used by the new drawing.
6. Text in rem, 11 px or more at a 16 px root. Labels stay upright.
   Check: confirmed (fence 7 holds: the text follows the root size, rows 39 and 59).
7. A stable hook on each part for the tests of G1: the car mark on each car group, the track on each
   track, the lined state on each switch.
   Check: confirmed (no fence line is touched). The prototype has the hook only on the switches and
   the tags (row 50).
8. The same entry as today, so that the controller keeps one call: the state, the puzzle, `anim`,
   `cine` (`yardSim.js:264`). The canvas element, its CSS rule, its pixel-ratio lines and its click
   handler leave the controller (`yardSim.js:64`, `:154`, `:232-235`, `:285-296`).
   Check: corrected (the four places were added; see section 6). No frozen file is in the list.
9. In `anim.js`: with reduced motion, `play()` runs each step once at its end value and then calls
   `onDone`. Each step function must still run, because it commits the move to the model. The
   controller must pass the reduce state; today it passes only a speed factor (`yardSim.js:229`,
   `:256`, `:410`, `:424`). The static end state is designed first.
   Check: corrected (the second and third sentences were added). `anim.js` is not a frozen file and
   it is in the files of Y2. Fence 6 asks for this change. It is a change of behaviour, so it is not
   part of a reskin: make it as its own change with its own line in the record. The plan gives
   "motion that stops" to Y4; the lead must say which job owns it.
10. A rule for text scale (C8, C14), a block for forced colours, and a rule for print (C10). The
    rule for text scale must not make the text smaller than the setting asks and must not cut a
    number (fences 7 and 15).
    Check: corrected (the last sentence was added, so that the rule cannot break fence 7).
11. A decision from Gate A and R1 on the width the Yard gets (C5) and on the view for the widths
    between a phone and 1396 px (C12), before the views are fixed.
    Check: corrected (C12 was added). The decision is for the owner. This report gives no command
    and no step to the owner.

### Y4, the access layer

1. Six native `<button>` elements in a layer over the SVG, placed by the view transform of Y2, in
   track order AS71 to AS76. The SVG is `aria-hidden`. On a layout the buttons move; they are not
   built again (C15).
   Check: corrected (the last sentence was added from row 61). New controls are the job of Y4 in
   the plan; they are not part of a reskin (fence 3). No pill shape: the prototype uses the Dusk
   control radius.
2. Each button holds its switch name and its state word as text. The name that was measured:
   `AS74 switch, lined REVERSE`.
   Check: confirmed (row 25; fence 5 holds: the word carries the state).
3. A target of 44 px or more in both views (C7 and C13 give the limit for the tall view).
   Check: corrected (C13 was added). The prototype does not meet this below a window of 378 px.
4. The Dusk focus ring, not a custom one.
   Check: confirmed (row 29).
5. A text mirror in a list after the yard: the engine and what it holds, then each track with its
   switch state, its car count, tied or loose, and each car with its type and with "empty" when it
   is empty. The type names, "tied", "loose", "normal", "reverse" and "lead" are words of the app
   today. The phrase "from the switch end" is not in the app; the app says "throat"
   (`yardSim.js:193`).
   Check: corrected (the first text said that the prototype wording uses only words the app has
   today. A search of `src/` and `public/data/` for "switch end" gave 0 matches). The mirror is new
   copy for the access layer. It states no rule. Its wording is for the owner to approve with the
   other copy.
6. One status region for the result of each action, with the message of the model unchanged.
   Check: confirmed (fences 2 and 3 hold: the message of the model is shown as it is; no rule is
   written or cited by the layer). Some messages of the model cite a rule today; they stay as they
   are.
7. Reduced motion stops the motion in the Yard (fence 6). The app setting drives it. Whether the
   operating-system flag also counts when the app setting is off is the subject of R5 and of the
   upgrade list at Gate A. This report does not decide it. The prototypes stop for either one. The
   setting takes its first value from the flag today (F13); the Yard reads only the setting
   (`yardSim.js:228`).
   Check: corrected (the first text made the flag a requirement. That is a change of behaviour that
   another job owns. F13 was added).
8. Y4 needs from Y2: the view transform, the switch boxes it gives, and a layout event.
   Check: confirmed (no fence line is touched).

---

## 10. What was not measured, and what is not verified

1. No real phone and no GPU. Every frame time is from a CPU-drawn headless browser. The order of
   the options on a phone is not verified.
   Check: not verified (the same limit in the check).
2. No WebKit: Safari on a phone or a desktop, and a WebKit view. Not tested.
   Check: not verified.
3. The Tauri WebView2 build. Not tested.
   Check: not verified.
4. A screen reader. The accessibility tree was read through the browser. No screen reader spoke it.
   Check: not verified.
5. A change of pixel ratio while the page is open. The CDP override changed `devicePixelRatio` to 2,
   but the page got no media query event and no device-pixel resize callback. The test cannot show
   what a real screen change does. The canvas bitmap did not follow in the test (1384 px wide
   before and after).
   Check: confirmed (the same result in the check: ratio 2 after the override, 0 media query events,
   0 redraws, bitmap 1384 px before and after). What a real screen change does stays not verified.
6. Pinch zoom. The capture of the zoomed view came back at 390 × 844 px for a 1170 × 2532 device
   view, which cannot show a blur. From model knowledge, not verified: a canvas bitmap is enlarged
   by a pinch and loses sharpness; SVG and HTML text are drawn again at the new scale.
   Check: not verified (not run again).
7. Whether the CPU throttle also slows the threads that draw an SVG. The throttle slows the main
   thread about 4 times and does not slow a worker thread (row 63, measured). The CPU figures agree
   with that for the drawing threads: with the throttle on, the SVG used 17.4 ms of CPU for a frame,
   of which the throttle burned about 13.7 ms, which leaves about 3.7 ms against 3.5 ms with no
   throttle. So the throttle favours the SVG over the canvas. Row 13, with no throttle,
   does not have this fault.
   Check: corrected (the first text gave this from model knowledge. The worker test and the CPU
   figures are now measured. The drawing threads were not timed one by one).
8. A train longer than 15 cars.
   Check: not verified.
9. The Atkinson Hyperlegible font is not installed on this machine. The dyslexia rows show that the
   font family follows, with a fallback face.
   Check: confirmed (`fc-list` has no entry for the font).
10. The size of the full port (C1) is an estimate.
    Check: not verified.
11. No web source was used. This report has no claim from the web.
    Check: confirmed (the check used no web source). Two statements are from model knowledge and
    are marked: WebView2 (section 6) and pinch zoom (item 6).
12. One run in an earlier batch gave a single 83 ms gap for the SVG at 390 with no throttle. It did
    not come back in the six other runs of that cell. Machine load is the probable cause; not
    verified.
    Check: not verified (a past run). In the 12 runs of the check for the two SVG kinds at 390 with
    no throttle, the worst gap was 16.8 ms.
13. The raw results and the scripts are in the scratch folder of this job, which is temporary. The
    numbers that matter are in this report.
    Check: confirmed (the folder of the first job and the folder of the check both exist at the
    time of writing; both are temporary).
14. A canvas that redraws only the parts that move, or that keeps the parts at rest on a second
    canvas. Not built. The script time for a frame is 0.5 ms of 5.7 ms at 390 (rows 9 and 12), so
    fewer draw calls alone cannot remove most of the cost. Whether a smaller canvas for the train
    alone removes it was not measured.
    Check: not verified (added by the check as an open item).
15. Browser zoom, and the WCAG reflow case of 320 CSS px with a real zoom. The check measured a
    window of 320 px (rows 56 to 58), not a zoom.
    Check: not verified (added by the check as an open item).
16. The arrival and the departure in an SVG. The stress train has the bodies of the arrival but not
    its three phases.
    Check: not verified (added by the check as an open item).

---

## 11. Notes for the SME

These are findings about rule content that the drawing shows. No wording is proposed.

1. `render.js:94` writes `15 MPH · REDUCED (CROR 105)` on the picture. The prototypes leave this
   line out. Whether the new drawing shows a speed line, and what it says, is for the SME. The
   statement was not checked.
   Check: confirmed (the line is there; a search of the three prototypes for a rule number gave 0
   matches). If the new drawing leaves a word out that the old drawing shows, that is a change of
   words, not a reskin: the owner and the SME decide it.
2. `render.js:2` calls yellow the colour of a diverging switch and calls that a rule convention
   (fact T12). That is not verified. The prototypes use amber only as a placeholder, with the word
   REVERSE. The colour convention for a lined switch is for the SME.
   Check: confirmed (line read). The words of the app name yellow and green for the two switch
   states (`yardSim.js:189-191`, F14). Whether those two colours are a convention that the drawing
   must keep is for the SME.
3. `render.js:141-146` shows TIED or LOOSE only for a standing cut of two cars or more, and gives a
   rule as the reason. A single standing car shows no state. The prototypes and the text mirror copy
   this. Whether a single car must show a state is for the SME.
   Check: confirmed (lines read; the prototypes copy it at `proto-svg.src.html:197`). One more
   condition is in the code: the words show only in a puzzle whose rule list has `secure` or `kick`
   (`render.js:26`). The prototypes copy that too.
4. `render.js:15` and `:130-134` draw a red mark 30 units from each switch and call it the clearance
   or foul point. The prototypes draw the mark at the same place in a neutral ink, because red is
   for attention only. Whether the place and the meaning of the mark are right is for the SME.
   Check: confirmed (lines read; the distance is `CLEAR = 30` in the frozen `geometry.js:35`; the
   prototypes use the same number through `SCENE.geo`).
5. The prototypes show the word LOOSE in the attention ink (the red family) and the word TIED in a
   neutral ink. The drawing of today shows LOOSE in red and TIED in amber (`render.js:146`). Whether
   a loose cut is an attention state is for the SME and for the look.
   Check: confirmed (added by the check: `proto-svg.src.html:28-29`, `render.js:146`).
6. The refusal message of the model for a switch that is not lined cites a rule. The prototypes do
   not show that message; they show a sentence of their own. The build shows the message of the
   model unchanged (section 9, Y4 item 6). Whether the rule numbers in the messages of the model are
   right is for the SME; they are in a frozen file.
   Check: confirmed (added by the check: `canSpot` gave the message in the frozen
   `model.js` when the check replayed the puzzle).

---

## 12. Files

- This report: `specs/research/R2-yard-drawing-technology.md`.
- The prototypes: `specs/research/yard-tech/proto-canvas.html`, `proto-svg.html`, `proto-hybrid.html`.
  Each is one self-contained file. Each was built by `inline-dusk.mjs` from the `.src.html` beside
  it. `proto-svg.html` takes `?controls=html`. The two canvas files take `?maxdpr=2`.
- No other file in the repository was written. No code and no content was changed.

Check: confirmed (the six prototype files exist; each built file equals its source plus the Dusk
layers; the check wrote only this report). The check changed no prototype.

---

## 13. Fence test of each proposal

Added by the check. "Fence" is section 4 of the plan. No proposal needs a frozen file, so this
report has no section "Not offered: needs a frozen file".

| # | Proposal | Fence lines tested | Result |
|---|---|---|---|
| P1 | SVG drawing on a view transform over `geometry.js` (Y2 items 1 to 4) | 1, 3 | Passes. The frozen file is read and not changed. |
| P2 | Palette names in the bridge file (Y2 item 5) | 4 | Passes. The lint found 0 raw colours in the prototypes. |
| P3 | Amber for reverse, attention ink for LOOSE, neutral ink for the clearance mark | 2, 5, 15 | Passes fence 5: a word carries each state. The colours are placeholders. The meaning of each colour is for the SME (section 11, notes 2, 4, 5). The words of the app that name colours must stay true (C16). |
| P4 | Text in rem, 11 px or more (Y2 item 6) | 7, 8 | Passes for size. A number can be wider than its car at the text scale of the app (C14); the rule of Y2 item 10 must solve that with no smaller text. |
| P5 | Six native buttons over the drawing (Y4 items 1 to 4) | 3, 8 | Passes as a job of Y4, not as a reskin. Fails 44 px below a window of 378 px in the prototype layout (C13); the build must change the tall view for those widths. |
| P6 | The text mirror (Y4 item 5) | 2, 3, 15 | Passes as a job of Y4. It states no rule. It is new copy; the owner approves it. |
| P7 | The status region with the message of the model (Y4 item 6) | 2, 3 | Passes. The message is shown unchanged. |
| P8 | The speed line of the old drawing is left out of the prototypes (section 11, note 1) | 2, 3 | Not a proposal of this report. To drop or to keep the line is a change of words for the owner and the SME. |
| P9 | `play()` ends at once with reduced motion (Y2 item 9) | 1, 3, 6 | Passes. `anim.js` is not frozen. Fence 6 asks for it. It is a change of behaviour: its own change, not part of a reskin. |
| P10 | Reduced motion from the operating-system flag (first text of Y4 item 7) | 3 | Rewritten. The flag question belongs to R5 and Gate A. |
| P11 | The Yard gets more than the 920 px column (C5) | 3, 9 | Passes the fence. It changes shell files, not Yard files; the lead must give it to a job that owns them. The owner decides at Gate A. |
| P12 | A rule for print and a block for forced colours (Y2 item 10) | 4, 7 | Passes. System colour keywords are not raw colours for the lint. |
| P13 | Hooks for the tests of G1 (Y2 item 7) | 9 | Passes. Y2 writes the hooks; G1 writes the tests. |
| P14 | No command, path or step is given to the owner | 13, 14 | Passes. This report names no person and no job title. |

---

## 14. Withdrawn

- **W1. Row 44 of section 5.** The first text: "The same canvas calls, two pictures: first draw
  against a later redraw, 390 at ratio 3. Canvas: 27,057 pixels differ (text is a little heavier in
  the first draw). 0 at ratio 1. SVG: 0. Hybrid: 12,168. 0 at ratio 1."
  Check: refuted. The check got the same figures (27,057 and 12,168). The cause is not the canvas.
  - Five redraws in a row gave the same bitmap, byte for byte (`toDataURL`, same SHA-256).
  - The bitmap changed only on the first redraw after a picture of the yard element or of the full
    page, which is taller than the window. A scroll, a window picture and a window resize did not
    change it.
  - "0 at ratio 1" is wrong. At 390 with a ratio of 1 the same test gave 5,343 pixels (canvas) and
    2,352 (hybrid). At 1440 the yard fits in the window, so the capture is not tall and the result
    is 0 at a ratio of 1 and at a ratio of 3.
  - The SVG shows the same effect, at once: 28,772 pixels at a ratio of 3 and 3,553 at a ratio of
    1 (row 64). The first test did not see it because both of its SVG pictures were taken after a
    tall capture.
- **W2. One sentence of section 6, "Testing".** The first text: "A picture test of a canvas is not
  stable at a pixel ratio of 3: the same calls gave two pictures (row 44)."
  Check: refuted (it rests on W1). A picture test is as stable for a canvas as for an SVG in this
  browser, when each picture is taken the same way.
