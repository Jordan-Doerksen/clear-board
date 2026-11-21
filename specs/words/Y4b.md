# The words of job Y4b (Wave 2c): the Yard controls of the owner's picks

Each new or changed learner-facing word of job Y4b, by row of the brief (`specs/briefs/Y4b.md`,
section 3). The owner approves the words at the end of the wave. The lead approves the words of the
cost of a move (row 10, pick R7-P12), and the SME checks them: each case is in the second table,
with the numbers of the model that it explains.

No word here states, corrects or cites a rule. A refusal of the model (`model.js`, frozen), the
result of a move ("Pulled 3 from AS73.") and the grade of a finish ("Par! 5 moves", "2 couplings")
keep their words. "N", "k" and "m" stand for a number that the app counts; "<call>" is a call in the
form "PULL 3 from AS73", "SPOT 6 to AS75", "KICK 2 to AS73" or "SECURE AS75"; "<result>" is the
result text of the model for that call; "<cost>" is the cost words of row 10.

The words were not checked by the SME. A screen reader was not used: the words of the status region
and of the text mirror are read from the DOM.

## 1. The words by row

| Row | Place | The words of today | The proposed words |
|---|---|---|---|
| 5 (R7-P8, U-04) | The tooltip of "▶ Watch optimal" | "Auto-line and play the fewest-moves line in slow motion" | "Auto-line and show the fewest-moves line, one step at a time" |
| 5 | Three buttons that take the place of the move builder while the line is watched | none (the line played as one film, with no stop) | "◂ Back", "Next ▸" and "▶ Play all"; while the steps play, "■ Stop" in place of "▶ Play all" (the glyphs are hidden from a screen reader) |
| 5 | A panel under the builder while the line is watched: its heading, its sub line and its count | none | the heading "The optimal line"; the sub line "a demonstration, not your run · it gets no done mark"; the count "k / N" |
| 5 | The list of that panel: one line for each step of the line | none | the number of the step, a mark ("✓" a step that has played, "▸" the next step) and the call ("PULL 3 from AS73") |
| 5 | The status region at the start of the watched line (the banner keeps its words of today) | "▶ Watching the optimal line — par N moves" | "▶ Watching the optimal line — par N moves. Step 0 of N: the yard at the start of the job." |
| 5 | The banner and the status region after each step, Next or Back | the result of the model ("Pulled 3 from AS73."); the region added the readout | "Step k of N: <call>. <result> <cost>"; the region adds the readout. After the last step the words go on: "The demonstration is over. A watched line gets no done mark." Back to the start: "Step 0 of N: the yard at the start of the job." |
| 5 | The end of the watched line | the win banner of the job (for example "✓ Par! 5 moves — 2 couplings, clean"), the win sound; on a job that ends with Depart, also the departure and its banner | no win words, no win sound and no departure: the words of the last step (above) |
| 5 | The banner and the status region when a switch is pressed while the line is watched | none (the press did nothing) | "This is the demonstration. Press Stop watching to play the job yourself." |
| 7 (R7-P14) | The banner and the status region when a call or a switch comes after the departure | none (the call acted on the train that the words said had departed) | "The train has departed. Press Reset to work this job again." |
| 7 | The text mirror, the line of the engine after the departure (not on the screen) | "ENGINE holding N cars from the engine: <mark> <type> loaded, …" | "ENGINE departed out the lead with N cars from the engine: <mark> <type> loaded, …" (then the route words of row 12) |
| 8 (R7-P5) | A button in the work order of the job with an inbound train (p6-road), at the start state of the job | none (the arrival played by itself at each load and each Reset) | "▶ Show the arrival" (the glyph is hidden from a screen reader) |
| 9 (R7-P10) | A panel under the builder after the first call of a run: its heading and its count | none | the heading "Your moves on this job"; the count "N" |
| 9 | One line of that panel for each call | none | the number, then "<call> <result> <cost>" |
| 9 | The controls of a line of the move log | none | "Play again" on the line of each PULL, SPOT or KICK; "Before and after" on the last line. The names for a screen reader: "Play again, move k" and "Before and after, move k" |
| 9 | The head bar of the picture while it shows a past state | none | "Before move k", "After move k" or "Move k again" |
| 9 | The status region when the picture shows a past state, and when it shows the yard of now again | none | "The picture shows the yard before move k, <call>." or "The picture shows the yard after move k, <call>."; "Move k again: <call>."; "The picture shows the yard now." |
| 10 (R7-P12) | The banner after each call, after the result of the model; the status region; the line of the move log; each step of the watched line | the result of the model only ("Pulled 3 from AS73.") | "<result> <cost>", for example "Pulled 3 from AS73. +2 moves (back in, pull out), +1 coupling." Each case of the cost words is in section 2 |
| 11 (U-23, U-40) | The readout of the counters | "Moves k / par N · Joints m" | "Moves k / par N · Couplings m" |
| 11 | The help text, "How the yard works" | "**Joints** (couplings) is a second, "also good" stat: lower is cleaner." | "**Couplings** are a second, "also good" stat: lower is cleaner." |
| 11 | The banner of each finish | "✓ Par! 5 moves — 2 couplings, clean" or "7 moves — par 5 · 3 couplings" (the grade of the model) | "Job done. ✓ Par! 5 moves — 2 couplings, clean" or "Job done. 7 moves — par 5 · 3 couplings" |
| 11 | The banner of the departure | "✓ Departed out the lead — Par! 4 moves — 2 couplings, clean" | "Job done. ✓ Departed out the lead — Par! 4 moves — 2 couplings, clean" |
| 11 | The record in the banner of a finish | " · new best (was 7m/3j)" or " · your best: 5m/2j" | " · new best (was 7 moves, 3 couplings)" or " · your best: 5 moves, 2 couplings" (one: "1 move", "1 coupling") |
| 11 | The record in the job picker | " · your best 5m" | " · your best 5 moves" (one: "1 move") |
| 12 (`ROUTE-WORDS`, `YARD-HEAD`) | The head bar of the yard panel, at its left | none | "Route: LEAD → AS73" (the track of the first reverse switch from AS71), or "Route: LEAD → MAIN LINE" when no switch is reverse |
| 12 | The head bar of the yard panel, at its right, on a job with a goal track | none | "BUILD AS75", then the count "k / m" (the goal cars on the goal track, and the goal cars in all) |
| 12 | The text mirror, at the end of the line of the engine (not on the screen) | the line ends with the cars of the engine | the same line, then "Route: LEAD → AS73." |
| 12 | The status region after a throw of a switch | "AS73 switch, lined reverse" | "AS73 switch, lined reverse. Route: LEAD → AS73." |
| 15 (U-16) | The work order of the first job (p0-1), above the picture | none (the help was in a closed section under the first screen) | "To line a switch, press its box on the picture: the word at the switch changes from NORMAL to REVERSE. To call a move, choose the action, the number of cars and the track under the picture, then press **Work it ▸**." |
| 16 (U-39) | A key under the job picker; it is also the description of the picker for a screen reader | none | "✓ job done · → your next job" |
| 16 | The banner and the status region while the arrival plays (not with Reduce motion) | none (presses got no answer for about 5 s) | "Wait for the train." |
| 16 | The banner and the status region at the end of the arrival | none | "The road train has left out the lead." |
| 16 | The refusal of the switch list, at its start | "Not so fast — …" | "Not quite — …" (the word of the Drill and of the Radio test for a miss) |
| 16 | The refusal of the switch list when a good line is flagged | "<mark> on <track> checks out — don't flag a good line." | "<mark> on <track> checks out — leave a good line unflagged." |

Rows 1, 2, 3, 4, 6, 13, 14 and 17 add no word and change no word:

- Row 1: "Look it up" keeps its words. It opens the entry on top of the Yard.
- Row 2: a throw that makes a refusal untrue empties the banner. No new text.
- Row 3: the sound button keeps "🔊 Sound on" and "🔇 Sound off". Only the start value changes.
- Row 4: a sound, no word.
- Row 6: the banner and the region say the result of a call at the start of its motion. The words
  are those of rows 10 and 11.
- Row 13: the landing place uses the words of the drawing of today (the number on the dashed plate,
  and the legend line "the move in the builder lands here").
- Row 14: a time, no word.
- Row 17: (a) a switch button loses its pressed state for a screen reader; its name stays "AS73
  switch, lined reverse". (b) A sound. (c) Focus. (d) A track id in the job line takes the mono face.

## 2. The cost of a call in words (row 10, pick R7-P12), case by case

The words say the change of the two counters after each call. The numbers are those of the model:
`model.js:139` (a pull: +2, and +1 more when the engine stands in a track after a spot),
`model.js:137` (a pull: +1 coupling), `model.js:156` (a spot: +1, and +1 more after a spot; the
engine then stands in the track), `model.js:151` (a spot onto a track that holds cars: +1 coupling),
`model.js:198` (a kick: +1, and +1 more after a spot; no coupling, `model.js:196`) and
`model.js:223` (secure: +0). The state "the engine stands in a track after a spot" is the field `out`
of the model (`false` after a spot). The pull-out of a spot counts at the next call that moves the
engine, so the cost words of that call name it: "the pull-out of your last spot".

Each example was played in the built app (scratch probe of row 10). Each change of the readout is
the number in the words.

| Case | The model | The words | Example played (readout before → after) |
|---|---|---|---|
| A pull, the engine out (the first call, or a call after a pull or a kick) | +2 moves, +1 coupling | "+2 moves (back in, pull out), +1 coupling." | p0-1, PULL 3 from AS73: Moves 0 → 2, Couplings 0 → 1 |
| A pull after a spot | +3 moves, +1 coupling | "+3 moves (the pull-out of your last spot, then back in and pull out), +1 coupling." | p0-1, after SPOT 1 to AS75 twice, PULL 1 from AS75: Moves 5 → 8, Couplings 2 → 3 |
| A spot onto an empty track, the engine out | +1 move, +0 couplings | "+1 move (shove in), +0 couplings. The pull-out of this spot counts the next time the engine moves." | p0-1, after PULL 3 from AS73, SPOT 1 to AS75: Moves 2 → 3, Couplings 1 → 1 |
| A spot onto a track that holds cars, the engine out | +1 move, +1 coupling | "+1 move (shove in), +1 coupling. The pull-out of this spot counts the next time the engine moves." | p0-1, after the pull above, SPOT 1 to AS75: Moves 8 → 9, Couplings 3 → 4 |
| A spot onto an empty track, after a spot | +2 moves, +0 couplings | "+2 moves (the pull-out of your last spot, then shove in), +0 couplings. The pull-out of this spot counts the next time the engine moves." | p0-1, PULL 3 from AS73, SPOT 1 to AS75, then SPOT 1 to AS73 (now empty): Moves 3 → 5, Couplings 1 → 1 |
| A spot onto a track that holds cars, after a spot | +2 moves, +1 coupling | "+2 moves (the pull-out of your last spot, then shove in), +1 coupling. The pull-out of this spot counts the next time the engine moves." | p0-1, SPOT 1 to AS75 a second time: Moves 3 → 5, Couplings 1 → 2 |
| A kick, the engine out | +1 move, +0 couplings | "+1 move (one shove), +0 couplings." | p2-kick, after PULL 2 from AS71, KICK 2 to AS73: Moves 2 → 3, Couplings 1 → 1 |
| A kick after a spot | +2 moves, +0 couplings | "+2 moves (the pull-out of your last spot, then one shove), +0 couplings." | p2-types, PULL 3 from AS71, KICK 1 to AS73, SPOT 1 to AS72, KICK 1 to AS73: Moves 4 → 6, Couplings 2 → 2 |
| Secure | +0 moves, +0 couplings | "+0 moves, +0 couplings." | p0-1, SECURE AS75: Moves 9 → 9, Couplings 4 → 4 |

One number or more is singular: "+1 move", "+1 coupling". The words name a move of the engine as the
model counts it (`model.js:227-231`); they do not say what a crew does on the ground.

Two points for the SME and the lead:

- A spot onto a track that holds cars counts a coupling also when the spotted cars stop short of the
  standing cut and the picture shows a gap (SME note S2, R7). The words follow the model: p2-save,
  PULL 3 from AS71, SPOT 1 to AS74 reads "+1 move (shove in), +1 coupling. …" (Couplings 1 → 2).
- A spot that ends the job is never followed by a call, so its pull-out never counts. The tail "The
  pull-out of this spot counts the next time the engine moves" stays true, because the engine does
  not move again. The lead decides whether the last spot of a job keeps the tail.
