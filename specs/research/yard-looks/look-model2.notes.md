# Look C2, "model" with a compressing view: notes after an independent review

## Verdict in five lines

1. **One picture: yes.** Look C2 draws one yard picture at every window width. The three cameras of look C are gone. After the repairs of the review, the sketch has no split view, no overlap and no cut label in 84 game states and at 198 widths from 320 to 1700 px.
2. **One form: no.** The picture has two forms. The wide form is the yard of look C. The tall form is the row layout of look A with the car drawings of look C. The window, the text size and the state of the game select the form.
3. **The wide form is sure only from 1366 px, with normal text, on the authored lines.** At 1280 px it shows in 79 of 84 states, and the picture changes its form during 3 of 18 jobs. At 1024 px it shows in 10 of 84 states. On a tablet in portrait and on a phone it never shows.
4. **Larger text takes the wide form away from most laptops.** Text at 125 percent: 55 of 84 states at 1440 px, 11 of 84 at 1280 px. The "Bigger text" value of the present app (116 percent): 79 of 84 at 1440 px, 28 of 84 at 1280 px.
5. **Cost for the learner.** Empty track is not true to scale, so a cut that the game accepts can look too long for a track (12 of 45 states at 1280 px, 28 of 49 on a phone). On a phone a track goes on in a second line in 39 of 84 states, and the engine is under the first screen. Pick look C2 for its drawing. Do not pick it for "one yard on a laptop and a phone": that claim is half true.

The claim under test: look C can keep its drawing and stay one picture from a wide desktop down to a tablet, and be a single re-projected picture on a phone. Result: **partly**. It is one picture everywhere. It is the same picture only from about 1340 px. The sketch scene is one of the 10 best states of 84 for this claim: it keeps the wide form down to 1002 px, and the median state needs 1158 px.

---

Clear Board 2, research for the gate. Date: 2026-11-20. Read-only on code and content.

This file replaces the notes of the builder. The reviewer did not build the sketch. The reviewer measured again from the start with new scripts, repaired seven defects of execution in the source, and recorded each failure of the idea without a repair.

Files of this job:

- `specs/research/yard-looks/look-model2.src.html` : the source (1300 lines; own CSS 220 lines, own script 959 lines, the scene object). It started as a copy of `look-model.src.html`. The files of looks A, B and C are not changed (checked: their dates are before this job).
- `specs/research/yard-looks/look-model2.html` : the built sketch (one file, 181 kB, the six Dusk layers inline).
- `specs/research/yard-looks/look-model2-1440.png`, `-1280.png`, `-1024.png`, `-768.png`, `-390.png` : full-page pictures at device scale factor 2, taken after the last repair.
- `specs/research/yard-looks/look-model2-longcut-1280.png`, `-longcut-390.png` : two long-cut states, each as a full-page picture. At 1280 one above the other, at 390 side by side. First: the stress scene (p5-room after 3 moves). Second: the state that the reviewer selected (p5-long after 3 moves).
- Scratch folder of the review: `/tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/model2-review/` (scripts; `out/` working pictures and results; `fail/` one picture for each recorded failure; `before/` the files as the builder left them).

Status words: **[measured]** is a result of a script of the review. **[seen]** is a fact that the reviewer saw in a picture. **[read]** is a fact read in a file. **not verified** has no check.

## 1. How the review measured

- **84 states, not one.** The script `gen-all.mjs` replays the authored `opt` line of each puzzle through the frozen `model.js` and writes one scene for each move (k = 0 to the last move). 18 of 19 puzzles give 84 states. The builder of the next move is the next authored move, and the route is lined for it. Puzzle p6-road (a depart goal) stops the scene script; its 2 states are not in the count. **[measured]**
- **An independent replay.** `replay.mjs` replays a line with its own code and compares positions, types, load states, the engine and the landing place with a scene file. Shared scene, stress scene and the reviewer's state: equal. **[measured]**
- **One page for each state.** `build-scene.mjs` puts a scene into a scratch copy of the sketch. The sketch file holds the shared scene only.
- **Scripts:** `survey.mjs` (form and defects for each state and width), `toggles.mjs` (each of the seven routes that the switches can line, for each state), `sweep.mjs` (one window resized through every width), `bisect.mjs` (the exact width where the form changes), `truth.mjs` (the drawn page against the scene), `room.mjs` (shown room against true room), `contrast.mjs`, `static.mjs`, `motion.mjs`, `kb.mjs`, `fold.mjs`.
- **Defect tests at each state and width:** sideways page scroll; a target under 44 px; text under 11 px; two plates that overlap; a plate cut by the frame; text wider than its plate; a car or the engine outside the picture; two cars that overlap; a type tag outside its car; a plate on a car; a switch button on a car or on a number; more or less than one picture; a console error.
- **Fonts of this machine:** the UI stack resolves to Inter, the mono stack to DejaVu Sans Mono. Each width in this file is for these fonts. The layout measures text at run time, so another font moves each width.
- Chromium of Playwright. Scrollbars take no width in this browser. A window with a classic scrollbar has about 15 px less.

## 2. The rule (as built, after the repairs)

1. One car scale s for the whole picture. Each car, each gap between two cuts, the engine, the lead, the ladder and the 30 units from each switch to its foul point keep s.
2. Only empty track between a foul point and the first car (or the landing place of the move in the builder) can shrink. A break mark "⋯" stands on each stretch that shrank.
3. Wide form: the true geometry of `geometry.js`. When the window is too narrow, the same length is left out of each of the six tracks. When the held cut is long, the lead of the picture grows to the left as far as the engine.
4. The script measures the words. It computes the least s at which two neighbouring number plates do not touch and each type tag stays in its car (floor 0.8). It draws the wide form when the length to leave out is not more than the smallest empty stretch can give. In every other case it draws the tall form.
5. The form and the scale come from the worst of the seven routes that the switches can line (repair 1). So a switch does not change the form.
6. Tall form: the same shapes at one s. The ladder is a vertical spine at the left, each track is a row (AS76 at the top, AS71 at the bottom), the lead runs down from the foot. A row of cars that is longer than the row goes on in the next line.

The view constants (break mark 26 px, bar scale 0.1 px for each unit, scale limits 0.8 to 1.3) are values of the sketch. They are not numbers of the game. `geometry.js` is not changed.

## 3. Which form shows: the main result

### 3.1 Normal text, the 84 authored states [measured]

| Window | Wide form in | Jobs with the wide form on the whole authored line | Jobs that change form on the line | Jobs with the tall form on the whole line |
|---|---|---|---|---|
| 1440 px | 84 of 84 | 18 of 18 | 0 | 0 |
| 1366 px | 84 of 84 | 18 of 18 | 0 | 0 |
| 1280 px | 79 of 84 | 15 of 18 | 3 (p0-1, p1-dig, p1-clear) | 0 |
| 1152 px | 33 of 84 | 5 of 18 | 5 | 8 |
| 1024 px | 10 of 84 | 2 of 18 (p4-loads, p4-peel) | 1 (p5-room) | 15 |
| 768 px | 0 of 84 | 0 | 0 | 18 |
| 390 px | 0 of 84 | 0 | 0 | 18 |

- The least window for the wide form, over the 84 states: from **887 px** (p5-room, start) to **1342 px** (p1-dig after 2 moves). Median **1158 px**. The page states this width in its status bar, and `bisect.mjs` found the same width by resizing for 8 states (1 px under it the page draws the tall form).
- The shared scene: wide from **1002 px**, tall at 1001 px. The scene is puzzle p4-peel. By the worst state of each job, p4-peel (1002 px) and p4-loads (1015 px) are the two best jobs of 18. The builder reported 970 px for the scene; repair 1 moved it to 1002 px.
- Why most states need more: 58 of 84 states hold two coupled box cars with six-figure numbers. Two such number plates side by side set the car scale to 1.116, and the same 58 states have that scale. The scene has five-figure numbers (0.943).
- "No track left out" (the true picture of look C): 24 of 84 states at 1440 px, 20 of 84 at 1366 px. So at 1440 px most states have break marks. The width for a true picture is 1175 to 1799 px, median 1583 px.
- The tall states at 1280 px: p0-1 after 2 moves, p1-dig after 2 moves, p1-clear after 3, 4 and 5 moves.

### 3.2 A learner leaves the authored line [measured]

- A legal line of three moves in p5-long (PULL 4 from AS73, SPOT 4 to AS76, PULL 4 from AS74; the engine accepts each) leaves 106 units of empty track on AS76. The wide form then needs **1428 px**. At 1366 and 1280 px the page draws the tall form. Picture: `fail/F2-player-made-state-1366-tall.png`.
- In the same state the builder is set to SPOT 1 to AS76 (legal; the landing place fills AS76 to 31 units from the foul point). The wide form then needs **1456 px**: a window of 1440 px gets the tall form. With the builder set to SPOT 2 to AS76 (the engine refuses it) the same state is wide at 1440 px. So a change in the move builder can change the form. Pictures: `fail/F2-builder-SPOT-1-to-AS76-legal-1440-tall.png`, `fail/F2-builder-SPOT-2-to-AS76-refused-1440-wide.png`. The sketch has no live builder; the two pictures are two scratch scenes.
- The worst state by the rule: one track with no empty stretch. The wide form then needs the "no track left out" width (up to 1799 px in the 84 states). **Computed, not drawn.**

### 3.3 Larger text and other fonts, the 84 states [measured]

| Text | 1440 px | 1366 px | 1280 px | 1024 px | Least window: least, median, most |
|---|---|---|---|---|---|
| Normal | 84 | 84 | 79 | 10 | 887, 1158, 1342 px |
| "Bigger text" of the present app (root 18.5 px, 116 percent; each Dusk type token times 1.156) | 79 | 60 | 28 | not run | 995, 1315, 1522 px |
| 125 percent (each Dusk type token times 1.25, root 125 percent) | 55 | 27 | 11 | 0 (computed from the least windows) | 1064, 1409, 1631 px |
| Wider mono font (DejaVu Sans Mono with letter spacing 0.08 em on every mono text) | 79 | not run | 34 | 4 | 896, 1289, 1491 px |

The cells are the count of states of 84 with the wide form.

- The shared scene alone: wide from 1213 px at 125 percent, 1134 px with "Bigger text", 1114 px with the wider mono font, 1353 px with 125 percent and the wider mono font, 1047 px with the dyslexia test sheet (the font of the app setting is not on this machine; the sheet uses its fallback).
- The builder wrote "text at 125 percent keeps the wide form at 1440 and at 1280 px". That is true for the scene and false for most states.
- At 125 percent and 1440 px, 5 of 18 jobs change form on the authored line and 4 of 18 are tall on the whole line.
- A real wider mono font is not on this machine (each installed mono font has an advance of about 0.6 em). The test adds letter spacing.

### 3.4 The shared scene at each width of the check [measured]

| Window | Form | Car scale | Left out of each track | Picture | First screen |
|---|---|---|---|---|---|
| 1440 x 900 | wide | 1.004 | nothing | 1416 x 420 px | the picture with the engine, and "Work it ▸" (ends at 818 px) |
| 1366 x 768 | wide | 0.947 | nothing | 1342 x 396 px | not measured |
| 1280 x 800 | wide | 0.943 | 81.6 px (87 units) | 1256 x 394 px | the picture with the engine, and "Work it ▸" (ends at 788 px) |
| 1152 x 864 | wide | 0.943 | 209.6 px (222 units) | 1128 x 394 px | not measured |
| 1024 x 768 | wide | 0.943 | 337.6 px (358 units) | 1000 x 394 px | the picture with the engine; "Work it ▸" ends at 788 px, under the edge |
| 900 | tall | 1.1 | row by row | 876 x 837 px | not measured |
| 768 x 1024 | tall | 1.1 | row by row | 744 x 837 px | the whole picture with the engine (ends at 827 px) |
| 600 | tall | 1.1 | row by row | 576 x 837 px | not measured |
| 480 | tall | 1.1 | row by row | 456 x 760 px | not measured |
| 390 x 844 | tall | 1.02 | row by row | 366 x 765 px | six rows and six switch buttons; the engine ends at 978 px, 134 px under the edge |
| 360 | tall | 0.943 | row by row | 336 x 742 px | not measured |

`sweep.mjs` resized one window from 1700 px down to 320 px in steps of 7 px (198 widths). The form changes one time (wide to tall). No width has a defect. The same for the stress scene, the reviewer's state and the player-made state, and for the scene with 125 percent text, with the wider mono font and with the dyslexia test sheet.

## 4. The tall form is one picture, and it is not one screen [measured]

Picture height in the tall form, the 84 states, picture only (no title bar, no strip, no legend):

| Window | States in the tall form | Picture height: least, median, most | Picture taller than the screen |
|---|---|---|---|
| 390 x 844 | 84 | 670, 813, 1192 px | 30 of 84 |
| 768 x 1024 | 84 | 809, 842, 1257 px | 5 of 84 |
| 1024 x 768 | 74 | 837, 842, 1257 px | 74 of 74 |
| 1152 x 864 | 51 | 837, 842, 1257 px | 13 of 51 |
| 1280 x 800 | 5 | 842, 964, 1122 px | 5 of 5 |

- At 1024 x 768 the tall form never fits the screen. The switches are at the top and the engine is at the bottom of one picture, and a person scrolls between them. Picture: `fail/F1-F4-typical-state-1024x768-tall-first-screen.png`.
- With the stress scene the engine ends 565 px under the edge at 1024 x 768 and 464 px under the edge at 390 x 844 (`fold.mjs`). Picture: `fail/F4-phone-first-screen-long-cut-390.png`.
- Look C had the state in three places. C2 has it in one picture that can be taller than the screen. This is better, and it is not "all in sight".
- Between the forms the yard is mirrored in one way: in the wide form the deep ends of the six tracks stand in one line and the switch ends step; in the tall form the switch ends stand in one line and the deep ends step (seen at 1024 and 1280 px, where each row has its true length).

## 5. What the compression hides (check 4)

What `model.js` checks **[read]**: SPOT and KICK refuse a cut when its near edge would be inside the foul point (`canSpot`, `canKick`: `plan.nearEdge < CLEAR`). So a cut fits when its length is not more than the empty stretch from the foul point to the first car. PULL refuses when the held cut and the pulled cars are longer than `LEAD_CLEAR`, 558 units (`canPull`).

How the picture carries these lengths:

1. **The landing place of the move in the builder** is a dashed outline at the car scale. When the move fits, the outline is true and it stands out of the stretch that shrank. When the engine would refuse the move, the outline runs from the first car back across the foul point bar and is cut at the switch. **[seen]** at 1440, 1280 and 390 px with two refused moves (`out/nofit2-1440.png`, `out/nofit7-1280.png`, `out/nofit2-390.png`). So a learner can see "does not fit" before the call, for the one move in the builder, after the route is lined. Limits: no word says it; the outline does not show by how much; on a phone the outline is a short piece between the spine and the first car.
2. **A room bar** on each track and on the lead, all at one scale (0.1 px for each unit). `truth.mjs` checked each bar against the frozen numbers: equal. The bar is small: 54 px for AS76, 89 px for AS71, a box car is 4 px.
3. **PULL has no picture.** The lead is true to scale in the wide form, but the picture does not show the end of the lead and has no landing place on it. The lead bar is the only cue.

Is a picture misleading about room? **Yes, in one direction.** `room.mjs`, all switches normal, the 84 states **[measured]**:

| Window, form | Shown length of the most shrunk track, as a part of its true length (least; median) | States with a held cut where a cut that the engine accepts is drawn longer than the empty stretch of that track | States where two tracks are drawn in the wrong order of room |
|---|---|---|---|
| 1440, wide (84 states) | 0.38; 0.71 | 4 of 49 | 0 |
| 1280, wide (79) | 0.24; 0.39 | 12 of 45 | 0 |
| 1152, wide (33) | 0.15; 0.43 | 5 of 18 | 0 |
| 1024, wide (10) | 0.19; 0.22 | 2 of 6 | 0 |
| 1024, tall (74) | 0.82; 0.92 | 0 of 43 | 16 of 74 |
| 768, tall (84) | 0.39; 0.65 | 0 of 49 | 74 of 84 |
| 390, tall (84) | 0.06; 0.18 | 28 of 49 | 78 of 84 |

- No track is drawn longer than true in any state. The picture never shows room that is not there.
- The picture does show less room than there is. Example: `fail/F6-legal-cut-looks-too-long-for-AS76-1280.png` (p0-2 after 2 moves, 1280 px). The engine holds 4 box cars. AS76 has 392 units of empty track (437 px at the car scale 1.116). The picture shows 134.5 px of it. 3 box cars on the lead are 141 px and 4 are 188 px. The engine accepts SPOT 3 and SPOT 4 to AS76.
- The wide form keeps the order of room between the tracks, because each track loses the same length. The tall form does not: a track with more room can look shorter than a track with less (`fail/F6-room-order-and-fit-390.png`).
- Tier 5 teaches room. The bars and the landing outline carry the truth there; the rails do not.

## 6. Long cuts (check 5) [measured, seen]

| | Stress scene: p5-room after 3 moves | Reviewer's state: p5-long after 3 moves | Player-made state (section 3.2) |
|---|---|---|---|
| What | 7 autoracks on the engine, 525 of 558 units; engine from x = −319; builder SPOT 4 to AS74 | 4 autoracks on the engine (300 units), 4 on AS71; builder SPOT 4 to AS71 | 4 autoracks held; AS76 holds 4 autoracks and 2 hoppers |
| 1280 px | wide, s = 0.8, 154 px left out; engine and 7 held cars inside; 0 overlap | wide, s = 0.943, 176 px left out; inside; 0 overlap | tall, s = 1.1, picture 1009 px high |
| 390 px | tall, s = 0.8, picture 1087 px; the landing place goes on in a second line | tall, s = 0.943, picture 1043 px; AS71 in three lines (2, 3 and 3 pieces) | tall, s = 0.943, picture 1080 px; two rows go on in a next line; 4 of 6 switch buttons on the first screen |
| Wide form from | 1199 px | 1253 px | 1428 px |
| Drawn against the scene (`truth.mjs`) | equal at 1440, 1280, 1024, 768, 390 | equal at the same five widths | equal at 1440, 1280, 390 |

- The engine and each held car are inside the picture at each width from 320 to 1700 px in the three states (`sweep.mjs`). The weak point 2 of look C is closed.
- A row that goes on in the next line has no overlap and no cut plate in any state.
- **What the second line costs.** At 390 px a row is in more than one line in 39 of 84 states (58 of 84 at 125 percent text), with up to three lines. The turn can fall inside a coupled cut: the coupler mark is not drawn at the turn, so one cut reads as two or three. Picture: `fail/F5-row-in-three-lines-splits-a-coupled-cut-390.png` (the hopper 3328 stands alone on the third line; it is coupled to 3300). The lines after the first have no track name.
- **Rows move on a phone.** When a switch is lined at 390 px, the picture reserves room for the "foul point" plate and the landing place on that track, and the row can go to a second line. The lined button does not move (0 of 84 states). Another switch button moves in 32 of 84 states (69 of 84 at 125 percent). At 768 px and wider no button moves.

## 7. Look C2 against look A at 1280 and 390 px (check 3)

By the reviewer's eye on pictures of both sketches at the same size (`out/cmp-A-*.png`, `out/cmp-C2-*.png`). No learner looked.

| Read in two seconds | 1280 px | 390 px |
|---|---|---|
| Each car and its order | Both pass. A writes most numbers in the block, and five-figure numbers of box cars stand over the block in two heights. C2 writes each number under its car in one line and the type tag in the car. C2 shows the type by the shape; A by the tag and the colour. | Both pass for the scene. A has larger blocks with the number in the block. C2 has smaller cars with the number under the car. |
| Which way each switch is lined | Equal. The word and the hollow or solid target are the same. C2 adds drawn point blades; they are small. | Equal. |
| The route | **A is better.** One thick lit line. C2 has two thin bright rails with chevrons; it reads, but slower. | A is better, for the same reason. |
| The engine | C2 is a little better: a shape with a headlight and the word. A: a box with the word. | Equal. In both the engine is under the first screen (A: at 1017 px **[read]**; C2: ends at 978 px). |
| Tied against loose | Equal: the same words on the track plate. | Equal: the same words over the row. |
| The goal | Equal: BUILD 3 / 4. | Equal. |
| Room | A is to scale at 1280 px with the scene and has no bar. C2 has break marks (a sign to learn) and a small bar. | **A is better.** A has a bar under each row at the width of the row. C2 has a bar of 54 to 89 px at the right of the row words. |
| Length of a car | Both true inside the picture. | **C2 is better.** One car scale for all rows and the lead; a held car has its length. In A the scale is for each row, and held cars are blocks of one size **[read]**. |
| A full track | Not in the scene. | A shrinks the blocks of a full row **[read]**. C2 keeps the size and goes on in a second line. |
| Amount of ink | A is calmer. C2 has ballast, ties and two rails for each track. | The same. |
| Switch buttons on the first screen | 6 and 6 **[measured]** | A: 4 of 6. C2: 6 of 6 for the scene, 4 of 6 for the player-made state. **[measured]** |

What the two looks share: both have a wide form and a row form, and in both the text size and a long cut select the form. Look A's own notes say: clean wide view from 1366 px, wide view from 1210 px, row view at 1024 px, row view at 1440 px with large text and with the longest held cut **[read]**. For the shared scene C2 keeps its wide form to 1002 px and with the longest held cut to 1199 px, so on these two points C2 does better than A.

**Not verified:** look A over the 84 states. The sketch of look A draws the shared scene only; a scratch copy with another scene stops with a script error in 82 of 84 states. So this file cannot say how many states keep the wide view of look A at 1280 px.

## 8. Is it still look C? (check 9)

- **Wide form: yes.** Rails, ties, ballast, the diagonal ladder, a car shape for each of five types, solid and hollow, the engine with hood, cab and headlight, the stand with its target, the true shape of the yard. The only new signs are the break marks, the room bars and one faint dashed line through the break marks.
- **Tall form: the layout is look A.** A spine at the left, one row for each track, the words over the row, a bar, the lead down. This is the row view of look A. What stays of look C is the drawing of each part and the one car scale.
- What a viewer gets from C2 that look A does not give: (1) the type of a car by its shape, with no need to read; (2) track that looks like track, and a switch drawn as points; (3) an engine with a head end; (4) one car scale for the whole picture in both forms, so a held cut and a standing cut compare by eye; (5) the wide form at 1024 to 1200 px for the states that allow it; (6) the engine and a long held cut inside the wide form.
- What look A gives and C2 does not: a route that reads at once; a calmer picture; a large room bar in the row view; no second line.

## 9. What a learner loses against the uniform-scale look C

1. **True length of empty track by eye**, on every window under about 1583 px (median of the 84 states; 1362 px for the scene). Section 5 has the cases where this misleads.
2. **A stable picture.** Look C had one form for each window. In C2 the form follows the state, the text size and the move in the builder. At 1280 px the picture changes form during 3 of 18 jobs; at 1152 px during 5 of 18.
3. **The whole state on one screen at 1024 x 768**: 74 of 84 states get a tall picture that is taller than the screen.
4. **In the tall form: the shape of the yard.** The ladder is a straight spine and the lead runs down. The arrow "◄" of the copied lead label points left.
5. **In the tall form on a phone: one line for a track.** 39 of 84 states have a row in two or three lines, and a coupled cut can split at the turn.
6. **In the tall form: the order of room between tracks by eye.**
7. **One car size.** The car scale follows the numbers in the yard and the text size. In the 84 states with normal text it is from 0.8 to 1.116 in the wide form up to 1440 px: a box car is 34 to 47 px long. The rule allows up to 1.3 on a wider window, and large text gave 1.37 in one picture.
8. **The legend in the empty corner at 1440 px.** It is under the picture.

What a learner gains against look C: one picture in place of three views under 1335 px; all six switches and all cars in one picture; the engine and the whole held cut in the picture; a bar for the lead; no map and no track picker to learn.

## 10. Repairs by the reviewer (defects of execution)

Each repair is in the source. The built file and every picture are from after repair 7.

| # | Defect found | How found | Repair | After |
|---|---|---|---|---|
| 1 | A click on a switch changed the whole form, wide to tall, and the picture left the pointer. 3 of 84 states at 1280 px, 1 of 84 at 1024 px. The least window moved by up to 232 px with the lining. | `toggles.mjs`; pictures `fail/before-repair-1-*.png` | The form and the car scale come from the worst of the seven routes. | 0 of 84 states at 1440, 1280, 1024, 768 and 390 px. The scene needs 1002 px (before: 970 px). At 390 px the scene has s = 1.02 (before: 1.1). |
| 2 | With 125 percent text the tag "TK" was taller than a tank car at s = 0.8. | `survey.mjs` with the text sheet | The least scale also keeps each tag in its car. | 0 states. The p5-room states need more width with large text. |
| 3 | With 125 percent text at a small scale the label of the lead stood on the engine, and the lead bar stood on the "foul point" plate. With the wider mono font at 1024 px the lead bar stood on the AS71 button (4 states). | `survey.mjs`; picture `fail/before-repair-3-*.png` | The label stays over the engine. The bar goes over the label when the place at its right belongs to the AS71 switch. | 0 states. |
| 4 | Normal text: the "foul point" plate of the lined track stood on the break mark of the track under it (p5-room after 4 moves, 1024 px, AS75 lined). | `toggles.mjs`; picture `fail/before-repair-4-*.png` | The break mark of the track under the plate moves out from under it. | 0 states in 84 states times 7 routes times 5 widths. |
| 5 | With 125 percent text and the wider mono font the label "15 MPH · REDUCED (CROR 105)" was cut by the frame at 352 px and narrower. | `sweep.mjs` | A label that is wider than the picture wraps. | 0 widths; seen in `out/wrap-label-340-top.png`. |
| 6 | Tall form: the height of the row words could follow the word NORMAL or REVERSE. No case was seen. | reading the source | The height comes from the taller of the two. | Preventive. |
| 7 | At 390 px a tap on a switch moved that button by 15.8 px, because the route words in the panel head and in the strip changed their line breaks. 58 of 84 states. | `kb.mjs`, `toggles.mjs` | The route words keep the width of their longest form. | The lined button moves in 0 of 84 states. The panel head at 390 px has two lines for every route (16 px more). |

A fault of the reviewer's first contrast method, found and corrected: the script read the dashed border of the break mark and the dashed outline of the landing number as the ground of the text (1.70 and 1.00). The script now reads 2 px inside the line box.

## 11. Recorded failures of the idea (no repair)

| | Failure | Numbers | Picture in `fail/` |
|---|---|---|---|
| F1 | The wide form does not hold down to a tablet, and it changes with the state. | Section 3.1 | `F1-form-changes-in-a-job-1280-after-move-2-wide.png`, `F1-form-changes-in-a-job-1280-after-move-3-tall.png`, `F1-typical-state-1024-tall-yard.png` |
| F2 | A legal player-made state and a legal move in the builder take the wide form away at 1366 and at 1440 px. | Section 3.2 | `F2-*.png` |
| F3 | Larger text takes the wide form away from most laptops. | Section 3.3 | `F3-text-125-percent-1280-tall.png`, `F3-text-125-percent-1440-tall.png` |
| F4 | The tall form is taller than the screen at 1024 x 768 in every state, and on a phone in 30 of 84 states. | Section 4 | `F1-F4-typical-state-1024x768-tall-first-screen.png`, `F4-phone-first-screen-long-cut-390.png` |
| F5 | On a phone a track goes on in a second or third line, a coupled cut splits at the turn, and rows move when a switch is lined. | Section 6 | `F5-row-in-three-lines-splits-a-coupled-cut-390.png` |
| F6 | The picture shows less room than there is, and the tall form mixes the order of room. | Section 5 | `F6-*.png` |

Options for F1 and F2, for the owner (from the builder, with the reviewer's numbers):

1. Take the rule as it is. Between about 890 and 1460 px the form follows the state.
2. Select the form for each job from its fullest authored state and keep it for the job. A learner who leaves the authored line can still need more (1428 px measured).
3. Select the form from the window only. A safe limit is then about 1460 px or more with normal text, and 1280 and 1366 px always get the tall form. This gives away the gain of C2.

## 12. New copy that the owner must approve

Visible, and not in look C (from the builder; the reviewer changed no word):

- Legend, new group: the heading "Length"; "A car and a gap between cars have true length."; "⋯ empty track left out"; "the track goes on in the next line" (shown only when a row does so); "room", a bar, "cars"; "All bars have one scale."
- The break mark "⋯" on a track and on the lead. The hook and the arrow of a row that goes on.
- The room bar on each track plate, on each row and at the label of the lead. It has no word on the picture; the legend names it.
- Status bar of the sketch: "Sketch: only the switches work."; "View: wide form, no track left out (window N px or wider)"; "View: wide form, empty track left out (wide form from N px; no track left out from N px)"; "View: tall form (the wide form needs a window of N px for this state of the yard)". These lines belong to the sketch, not to the app.
- Sketch flag: "SKETCH · look C2, model".

Changed place, same words: in the tall form the track id, the lining word, TIED or LOOSE, BUILD n / n and ⚡ KICKABLE stand in one line over the row. Gone with the cameras: the six track selector buttons, the two pan buttons and their names. No word and no control of the app is lost or renamed (`truth.mjs` compared each word of the scene with the page).

## 13. The build cost against look A (from the builder; the reviewer added points 8 and 9)

1. The drawing: five car shapes in two load states, the engine, ballast, ties and two rails, the points, the stand.
2. Each shape in two directions (upright on the lead in the tall form).
3. Number plates and tags as DOM text that follow the shapes.
4. A length map for each track and for the lead, in place of one scale.
5. The second line: the hook, the arrow, the place of each car, and a rule for motion across the turn.
6. The layout rule with measured text.
7. The room bars at one scale.
8. The rule reads the state, the seven routes and the move in the builder. The sketch measures the words eight times for each drawing. The cost of a redraw is **not verified**.
9. A decision for F1 and F2 (section 11), and a test of the rule over all states of all puzzles in the test set of the app. The sketch had one scene; the defects of section 10 showed only with other states.

In short: C2 costs the drawing work of look C and the map work of look A, and the second line. It is the most work of the looks.

## 14. Notes for the SME

This job writes and corrects no rule. These are questions about what the picture could teach. The notes S1 to S13 of look C stay open.

- S14. The break mark. A track in the picture is shorter than true where "⋯" stands. Could a learner take the picture for the true room of a track? Section 5 shows that the picture then says "too long" for a cut that fits.
- S15. The room bar. It runs from the foul point to the end of the track, and counts a gap between two cuts as taken. Is "room" the right word?
- S16. The row in two lines. Could a track that goes on in a second line teach a false thing about a yard? A coupled cut splits at the turn.
- S17. The tall form. The ladder is a straight spine and the lead runs down. The label of the lead keeps its arrow to the left. Does this teach a false direction?
- S18. A landing outline that crosses the foul point bar is the picture of "does not fit". Is this picture right for a cut that would foul the switch?
- S19. Amber has three uses in the colour table of R1: the centerbeam car (a category), REVERSE and LOOSE (states). Each has a word or a tag. The legend says "SME to confirm".

## 15. Not verified

- Any learner. No person outside this job saw a picture. The two-second read is the reviewer's eye.
- A screen reader. The text mirror is in the page and names each car; it has no lengths and does not say that track was left out.
- A real phone and a real touch. Playwright emulation only.
- Fonts of other systems. A real wider mono font. The dyslexia typeface of the app.
- The high contrast mode and the forced colours of an operating system. The bridge of the app does not exist yet.
- Colour-vision deficiency for the new marks.
- Look A over the 84 states (section 7).
- Puzzle p6-road and every depart goal, the arrival, the switch-list check, the win banner. The final state of each job (after the last move).
- The worst state by the rule (a full track) in a picture.
- A window with a classic scrollbar. The widths in this file are widths of the page.
- Any motion and any sound. The sketch has none. A motion across the turn of a row needs a rule.
- The cost of a redraw.
- Rail practice (section 14).
- The reduced-motion run at 390 px gave one unequal full-page picture in one run, while the machine did other work; four more runs were equal. The cause is not found.

## 16. Eye review

Each check of the review brief. **Pass** means the check found nothing. **Repaired** names the repair of section 10. **Fail** names the failure of section 11 and its picture in the scratch folder `fail/`. All pictures of this job are from after the last repair, and the reviewer looked at each of them.

| # | Check | Result |
|---|---|---|
| 1 | **Truth.** The drawn page against `scene.json` at 1440 and 390 px (and at 1280, 1024, 768, 360): each car with its number, type tag, type shape, load state; the order on each track; the gap between cuts and the length of each car at the car scale; the engine, its head end and what it holds, in order; each switch (word, target, pressed state, name); TIED and LOOSE; the goal words; the kickable mark; the landing place; each room bar against the frozen numbers; each word of the chrome. The scene object in the page is equal to the file. The stress scene and two more states replayed with the frozen engine by the reviewer's own script, and drawn pages compared. A test with four false values in the scene gave 11 reports for each width, so the script can fail. | **Pass.** `truth.mjs`, `replay.mjs`. |
| 2a | **One picture** at 1440, 1366, 1280, 1152, 1024, 900, 768, 600, 480, 390, 360 px: one picture at each; forms as in section 3.4; no split view, no overlap, no cut label, no number outside its plate. The same in 84 states at seven widths, in seven routes for each state, and at 198 widths for four states. | **Pass.** |
| 2b | **The exact width where the wide form gives way.** Scene: wide at 1002 px, tall at 1001 px. Over the states: 887 to 1342 px; 1428 and 1456 px for two legal player-made cases. | Recorded. Before repair 1 the width also moved with the lining: **repaired (1)**. |
| 2c | **The wide form from a wide desktop down to a tablet.** | **Fail (F1, F2).** Sure from 1366 px on the authored lines only. 79 of 84 at 1280 px, 10 of 84 at 1024 px, 0 at 768 px. |
| 2d | **Root font at 125 percent and a wider mono font.** No defect in the scene at the eleven widths and in the 84 states. | Defects: **repaired (2, 3, 5)**. The wide form: **fail (F3)**: 55 of 84 at 1440 px and 11 of 84 at 1280 px with 125 percent; 34 of 84 at 1280 px with the wider mono font. |
| 3 | **The two-second read at 1280 and 390 px, against look A.** Each item reads in C2. A is better for the route, for calm and for the room bar on a phone. C2 is better for car type, car length and the switch buttons on the first screen of a phone. | **Pass**, with the losses of section 7. Reviewer's eye only. |
| 4 | **What the compression hides.** A refused SPOT shows before the call as an outline over the foul point bar, for the move in the builder only, with no word. PULL has the lead bar only. The picture shows less room than there is: 12 of 45 states at 1280 px, 28 of 49 at 390 px. The tall form mixes the order of room between tracks: 78 of 84 states at 390 px. No picture shows more room than there is. | **Fail in part (F6).** `room.mjs`; pictures `fail/F6-*.png`, `out/nofit2-1440.png`. |
| 5 | **Long cuts** at 1280 and 390 px: the stress scene, the reviewer's state from p5-long, and a player-made state. Engine and held cars inside the picture; no overlap; rows that wrap have no overlap. | **Pass** for inside and overlap. **Fail (F5)** for the second line: a coupled cut splits at the turn; 39 of 84 states wrap on a phone; rows move when a switch is lined. |
| 6 | **Self-contained and Dusk.** One file; no reference to another file; the six Dusk layers byte for byte and in load order; the built file is the source with the marker replaced. 0 hex colours, 0 colour functions and 0 colour names in the own CSS, the own script (without the scene object) and the markup; the script does not read the colours of the frozen file. Car type uses the tile tones; NORMAL, REVERSE, TIED and LOOSE use the state classes with a word and a glyph; red is in the refusal example only; each state has a word or a glyph; no control has a corner over 6 px; no transition and no animation in the own CSS. | **Pass.** `static.mjs`, 15 tests. Note S19 for amber. |
| 7 | **Measured at each of the eleven widths:** no sideways page scroll; 18 or 19 targets, none under 44 px; smallest text 11 px; 0 console errors; 0 requests to another file; 199 to 219 text boxes, none under AA, lowest contrast 5.48 to 5.62 (the key cell of the strip). The same for the two long-cut states at 1280 and 390 px and for the scene with 125 percent text. Keyboard: Tab order skip link, Home, picker, AS71 to AS76, builder; Space and Enter line a switch, the focus stays, the live line speaks; 12 clicks and 12 taps near the corners of the six buttons change the switch each time. | **Pass.** One defect: **repaired (7)**. `widths.mjs`, `contrast.mjs`, `kb.mjs`. |
| 8 | **Motion off and forced large text.** Reduced motion: the picture and the full page are equal to the page with motion at five widths (the sketch has no motion); nothing is blank. Large text: nothing blank and nothing cut in the 84 states at 1440, 1366, 1280, 768 and 390 px and in the sweeps. | **Pass** after **repairs (2, 3, 5)**. High contrast and the dyslexia typeface: not verified. |
| 9 | **It is still look C.** The wide form is look C with three new signs. The tall form has the layout of the row view of look A and the drawing of look C. | **Pass** for the wide form. **In part** for the tall form (section 8). |

### What the owner must know before the pick

1. The pictures at 1440, 1280 and 1024 px show the best case. The scene is one of 10 states of 84 that keep the wide form at 1024 px.
2. On a laptop of 1366 px or wider with normal text, C2 is the yard of look C with all cars, all switches and the engine in one picture. This is the strong case.
3. On a laptop of 1280 px the picture changes its form during some jobs. With "Bigger text" most states at 1280 px get the tall form.
4. On a tablet and on a phone C2 is the layout of look A, drawn with the shapes of look C, and a long track goes on in a second line.
5. Look A has the same kind of limit by its own notes. It was measured on one scene and two stress states only, so the two looks are not compared over all states.
6. C2 is the most build work of the looks, and it needs a decision about the change of form (section 11).
