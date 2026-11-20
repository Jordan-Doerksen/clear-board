# R7 — The Yard: motion and sound sheet

Wave 1 research. Read-only on code and content. Written 2026-11-20 on branch
`claude/peaceful-mayer-qat99l` at commit `1e48578`. Measured on the built app at
`http://127.0.0.1:4173/#/yard`.

Each statement is checked (file and line, a command, or a measurement) or it carries the words
"not verified". Section 15 lists every statement that is not verified.

This sheet proposes changes. It makes none. A reskin job (S1, Y1, Y3) keeps the behaviour of today.
The proposals are for Y2 (drawing), Y4 (access layer) and the upgrade list of the owner.

## Check pass

A second session checked this report on 2026-11-20. It took each claim as wrong until it got the
same result by itself. It opened each cited line, ran each measurement again and drove the built
app. Its scripts, results and pictures are in the scratch folder `R7-check/` (section 16).

- A line that starts with "Check:" gives the result for the item above it. The result is one of:
  confirmed, corrected, not verified, refuted.
- For a fact, "confirmed" means that this pass got the same result by itself. For a proposal,
  "confirmed" means that the facts under it are confirmed and that it passed the fence test
  (section 17). It does not mean that the design is tested with learners.
- "corrected" means that the item was wrong or not complete. The line says what changed in the
  text, or which limit it adds when the text did not change.
- The words "Added in the check pass." mark an item that the first report did not have.
- Totals: 161 confirmed, 46 corrected, 27 not verified,
  3 refuted. The count is one for each line that starts with "Check:". 22 items are added:
  7 in section 3, 1 in section 4, 4 picks, 1 note for the SME, 5 notes for other jobs and 4 in
  section 15. Sections 17 and 18 are new.
- Check: confirmed (the source did not change after the report. `git diff --stat 1e48578 HEAD --
  src public index.html` prints nothing at the head `cb51d4b`. The served bundle
  `dist/assets/yardSim-DhRiMDpN.js` holds `?6:1` and `?6:1.7`, so the measured app has the code
  that the report cites.)

---

## 1. Summary

1. The Yard has 24 effects (section 7). Nine of them move, through three animation routines: a
   move, the arrival and the departure. The watched line plays the move routine again. The others
   are instant state changes.
   - Check: confirmed (section 7 has 24 rows. Nine rows have "yes" under "Moves today". The three
     routines are `animateMove` (`yardSim.js:316`), `arrivalCinematic` (`:270`) and `departOut`
     (`:508`).)
2. **Fact T4 is wrong in direction.** With the app setting "Reduce motion" on, a Yard move is six
   times slower, not faster. A pull runs 8950 ms in place of 1534 ms (measured, section 3, F1).
   - Check: confirmed (this pass: a pull runs 1532 ms with the setting off, median of 22, and 8950
     ms with it on, median of 13. The ratio is 5.8.)
3. The reduce setting is read one time, when the Yard mounts. A change in Settings while the Yard
   is open has no effect until the learner leaves and comes back (measured, F2).
   - Check: confirmed (scenario G, run again: 1534 ms, then 1518 ms after the change in Settings,
     then 8944 ms after Home and back.)
4. The Yard does not follow the operating system flag after the first visit (measured, F3).
   - Check: confirmed (scenario J, run again.)
5. Four pictures do not agree with the words or with the model: the kick (F5), the departure
   (F6), the engine position after a spot (F7) and the arrival (F9).
   - Check: corrected (the first text said three pictures. Each of the three is confirmed. The
     arrival is the fourth (F9). One more limit: on the first kick job the word "Kicked" does not
     show (F14).)
6. A switch throw has colour as its only carrier, and the banner keeps a refusal text that is no
   longer true (F8).
   - Check: confirmed (scenario A, 3 runs: one paint, and the refusal text stays after the throw.)
7. A watched optimal line marks the job as done and plays the win sound (F10).
   - Check: confirmed (scenario D, 3 runs: the profile holds `completed: ["p0-1"]`, and four win
     notes start at 11030 ms.)
8. Sound is off by default. The default comes from the "Read aloud" setting. A learner who turns
   the sound on loses that choice at the next visit to the Yard (measured, F12).
   - Check: corrected (confirmed for a learner who has "Read aloud" off. With "Read aloud" on,
     `yardSim.js:715` changes nothing and the mute state holds: measured, `R7-check/x11.mjs`. "Read
     aloud" reads nothing aloud in the Yard (F12). The text of the item did not change.)
9. Dusk gives four duration tokens (160 ms, 420 ms, 6000 ms, and 120 s for the ground drift
   only), five distance tokens and one easing token. A STRICT page may animate state confirmation
   only. Travel along a track is a Tier 2 class effect. It needs OPEN, or a written exception
   (section 4).
   - Check: corrected (the first text said three durations and two distances. The token file has
     four time values, at lines 410, 413, 414 and 416. The distance tokens are `--lift`,
     `--enter-shift`, `--travel-y`, `--drift-x` and `--drift-y`. The other statements are confirmed
     with the limits of section 4.)
10. The proposal: each effect has a static form that carries all the information (end state, a
    trace of the last move, words). Motion is short, starts only on a learner action, and never
    locks the controls. Reduced motion stops all of it.
    - Check: corrected (the fence test is now in section 17. Four proposals had no pick, and one
      option broke the fence. No learner test was run.)
11. Sixteen picks are open for the owner (section 12). Ten notes are for the SME (section 13).
    - Check: corrected (the first text said twelve picks and nine notes. Picks P13 to P16 and note
      S10 are added in the check pass. Option (c) of P3 is withdrawn.)

---

## 2. Method and limits

- **Code read:** `src/stations/yard/anim.js`, `sound.js`, `render.js`, `model.js`, `geometry.js`,
  `puzzles.js` (read-only), `src/stations/yardSim.js`, `src/stations/imperativeStation.ts`,
  `src/stations/Yard.tsx`, `src/stations/Settings.tsx`, `src/state/AppContext.tsx`, `src/index.css`.
  - Check: not verified (a later pass cannot show what a session read. This pass opened each cited
    line of these files. One citation was wrong: see F2.)
- **Dusk read:** the six files in `src/styles/dusk/`, and `/home/user/dusk/ARCHITECTURE.md`,
  `DECISIONS.md`, `README.md`, `preview/cards/process.html`, `preview/cards/living.html`.
  - Check: not verified (the same limit. This pass opened each cited Dusk line. Each is right.)
- **Measurement:** Playwright with headless Chromium, viewport 1440 by 900, service workers
  blocked. A hook on `CanvasRenderingContext2D.clearRect` records the time of each paint
  (`render()` calls it one time for each paint, `render.js:22`). The duration of an effect is the
  time from its first paint to its last paint. A hook on `OscillatorNode.start` records each sound.
  Each timing is the median of 3 runs, or more where the table says so.
  - Check: confirmed (this pass read `measure.mjs`. `render.js:22` is the only `clearRect` call in
    the Yard. All 11 scenarios ran again from a copy in `R7-check/`.)
- **Machine load:** other agents used the machine. The load average was 0.3 at the start and 2.5
  at one point. `anim.js:18` computes progress from the clock, so load changes the number of
  frames, not the duration. The runs agree within 46 ms (pull: 1507 to 1552 ms in 19 samples).
  - Check: not verified (the load values 0.3 and 2.5 are history. In this pass the load average was
    0.7 to 1.9. `anim.js:18` is confirmed. The pull samples of this pass run from 1517 to 1551 ms
    in 22 samples, inside the stated range.)
- **Single runs:** F2 and F3 are one run each. They test a yes or no behaviour, and the timing
  values in them agree with the medians of F1.
  - Check: corrected (this pass ran F2 and F3 one more time each. The results agree. Each is now
    two runs.)
- **Frame slop:** a measured duration is the nominal duration plus about one frame (17 ms) for
  each phase, because each phase starts on the frame after the last one ends (`anim.js:21-25`).
  - Check: confirmed (`anim.js:21-27` read. This pass: 1480 ms nominal, 1517 to 1551 ms measured.)
- **Web research:** the search tool gave result summaries. The pages did not open from this
  session (`www.w3.org` and `gameaccessibilityguidelines.com` did not resolve). Each research
  statement in section 5 is from a search summary and is not verified against the page.
  - Check: confirmed (in this pass `www.w3.org` and `www.nngroup.com` did not resolve. A search
    tool gave summaries only.)
- **Scripts and pictures** are in the scratch folder (section 16). A cleanup can remove them.
  - Check: confirmed (each file of section 16 exists.)

---

## 3. What is true today

### F1. Reduced motion makes the Yard six times slower

- `yardSim.js:228-229`: `const fast = () => reduce ? 6 : 1;` with the comment "setSpeed(6) ≈
  instant".
  - Check: confirmed (lines 228-229 read. The built bundle holds the same expression.)
- `anim.js:6`: "`>1 = slower`". `anim.js:17`: `dur = step.dur * speedFactor`. A factor of 6
  multiplies each duration by 6.
  - Check: confirmed (lines 6 and 17 read.)
- `yardSim.js:410` proves the direction: the slow-motion demo uses `setSpeed(1.7)`.
  - Check: confirmed (line 410 reads `setSpeed(reduce ? 6 : 1.7)`. With the setting on, the demo
    runs at 6 times the normal duration, not at 1.7 times.)

| Effect | Nominal in code | Measured, setting off | Measured, setting on |
|---|---|---|---|
| Pull | 600 + 280 + 600 = 1480 ms | 1534 ms (median of 19, range 1507 to 1552) | 8950 ms (median of 12, range 8948 to 8973) |
| Spot | 600 + 600 = 1200 ms | 1217 ms (median of 3) | 7250 ms (median of 3) |
| Kick | 600 + 600 = 1200 ms | 1234 ms (median of 3) | 7250 ms (median of 3, measured in the check pass; formula: 7200 ms) |
| Arrival of the inbound cut | 2200 + 1100 + 1700 = 5000 ms, cap 5800 ms | 5079 ms (median of 3) | 5801 ms, then a jump cut (median of 3) |
| Departure | 1300 ms | 1317 ms (median of 3) | 7817 ms (median of 3) |
| Watched optimal line, job p0-1 (4 steps) | 10852 ms by formula | 11024 ms (median of 3) | 28921 ms (median of 3) |
| Switch throw, secure, refusal | 0 ms | 1 paint, 1 paint, 0 paints | the same |

- Check: confirmed (Pull row. This pass: 1517 to 1551 ms in 22 samples, median 1532 ms, with the
  setting off. 8944 to 8951 ms in 13 samples, median 8950 ms, with the setting on.)
- Check: confirmed (Spot row. This pass: 1217 ms and 7250 ms, median of 3 each.)
- Check: corrected (Kick row. Setting off: 1234 ms, median of 3, confirmed. Setting on: the cell
  said "not measured". This pass measured 7250 ms in each of 3 runs.)
- Check: confirmed (Arrival row. This pass: 5057 ms, median of 3, range 5045 to 5084 ms. With the
  setting on: 5801 ms in each of 3 runs. The cap is the timer at `yardSim.js:281`.)
- Check: confirmed (Departure row. This pass: 1317 ms and 7817 ms, median of 3 each.)
- Check: confirmed (Watched line row. This pass: 11022 ms and 28922 ms, median of 3 each. The
  formula gives 10852 ms and 28740 ms.)
- Check: confirmed (Switch throw, secure, refusal row. This pass: 1 paint, 1 paint, 0 paints, with
  the setting off and on.)

- `REVAMP-DESIGN.md:123` says reduced motion "makes Yard animation instant". `Settings.tsx:9`
  labels the setting "No animations". `SPEC.md:186` says "all motion skipped/static". The three
  statements are false for the Yard today.
  - Check: confirmed (the three lines read. Each is false for the Yard today.)
- The plan's T4 says "6 times faster". The part "read from the app setting" is true. The part
  "does not stop" is true. The direction is wrong.
  - Check: confirmed (plan line 71 read. A note for the lead is in section 14.)
- Added in the check pass. With the setting on, the sound is late also. The coupling sound plays
  3634 ms after the first frame of a pull. With the setting off it plays at 617 ms. The sound sits
  on the model change (`yardSim.js:348`), and the model change waits for the slow run in.
  - Check: confirmed (scenario Areduce, 3 runs: 3634 or 3635 ms. Scenario A, 3 runs: 617 or 618
    ms.)

### F2. The setting is read at mount and then it is stale

- `yardSim.js:228` reads `ctx.settings.reduce` one time into a constant.
  - Check: confirmed (line read.)
- `imperativeStation.ts:31-39` mounts the station one time. Settings is a dialog over the Yard,
  so the Yard stays mounted.
  - Check: corrected (the first text cited lines 42-50. The file has 42 lines. The mount is the
    effect at lines 31-39. Measured: the Yard stays in the page while the Settings dialog is open.)
- Measured: pull 1534 ms. The learner turns "Reduce motion" on in Settings
  (`html[data-reduce]` changes to `1`). The next pull runs 1552 ms. After the learner goes Home
  and comes back, the pull runs 8951 ms.
  - Check: confirmed (this pass: 1534 ms, then 1518 ms, then 8944 ms. `data-reduce` changed to
    `1`.)
- Added in the check pass. The value of the moment is already in reach of the Yard.
  `imperativeStation.ts:26` writes each new settings object to the same `ctx` object that `mount`
  received (`:34`). A read of `ctx.settings.reduce` at the time of each effect gives the value of
  the moment. The defect is only the copy at `yardSim.js:228`.
  - Check: confirmed (by reading lines 17 to 34. Not run: a run needs a code change.)

### F3. The Yard does not follow the operating system flag after the first visit

- `AppContext.tsx:12` reads the flag for the default. `AppContext.tsx:61` saves all settings on
  the first render. After that, the saved value wins (`AppContext.tsx:15`). No code listens for a
  change of the flag.
  - Check: confirmed (lines 12, 15 and 61 read. A search of `src` finds `matchMedia` at that one
    line only, and no `change` listener.)
- Measured, first visit with the flag on: `data-reduce` is `1`. The flag goes off and the page
  reloads: `data-reduce` stays `1`.
  - Check: confirmed (scenario J, run again: the same values.)
- Measured, first visit with the flag off, then the flag goes on: `data-reduce` stays `0`, the
  pull runs 1518 ms. After a reload with the flag on: `data-reduce` is `0`, the pull runs 1534 ms.
  - Check: confirmed (this pass: `data-reduce` stays `0` and the pull runs 1534 ms. After the
    reload: `0`, 1535 ms.)
- The CSS catch-all at `index.css:140-148` follows the flag live. It has no effect on a canvas.
  - Check: confirmed (lines read. Measured: no element in the Yard has a transition or an
    animation.)

### F4. Motion locks the controls and gives no sign

- During a move, `busy` is true. The canvas click, "Work it", "Watch optimal", "Depart" and
  "Reset" return with no effect (`yardSim.js:286`, `:385`, `:402`, `:509`, `:306`). No control
  shows a disabled state. No words say why.
  - Check: confirmed (each line read. Measured 300 ms into a pull: `#work`, `#optimal`, `#reset`
    and each select have `disabled` false, opacity 1 and the pointer cursor. There is no
    `aria-busy`. The banner is empty. A press on Reset changed nothing. One addition: the job
    picker is not locked. A change of job ends the move (`yardSim.js:712`, `:252-253`).)
- During the arrival, the canvas click and each move return with no effect (`yardSim.js:286`,
  `:385`). Measured: a switch click at 1000 ms into the arrival changes nothing and the banner is
  empty. "Reset" restarts the arrival. There is no skip.
  - Check: confirmed (this pass: the banner stayed empty after the click. After Reset the arrival
    ran again for 5067 ms.)
- With the reduce setting on, the lock lasts 8.9 s for each pull (F1).
  - Check: confirmed (8950 ms.)

### F5. A kick is drawn as a spot

- `animateMove` has one path for spot and kick (`yardSim.js:325-332`). The engine carries the cut
  to its rest point in the track and comes back.
  - Check: confirmed (lines 325-332 read.)
- Measured pictures at 450 ms and 590 ms into a kick on job p2-kick: the engine is inside AS73,
  past the foul mark, coupled to the two cars it kicks.
  - Check: confirmed (this pass took the same pictures: `R7-check/B-kick-590.png` and
    `B-kick-700.png`.)
- The words on the page say a kick is "shove and cut away; the cars coast in on their own"
  (`yardSim.js:195`). The picture shows no roll.
  - Check: confirmed (line 195 read. The words are inside the closed "How to play" block that
    starts at `yardSim.js:187`.)
- During the motion, the only difference between a kick and a spot onto the same cut is the
  sound (`yardSim.js:348`). After the motion the differences are: the word "Kicked" in the
  banner, the Joints counter (a kick adds none, `model.js:196`; a spot onto a cut adds one,
  `model.js:151`) and the track tag (TIED after a kick, `model.js:197`; LOOSE after a spot,
  `model.js:155`). A spot onto an empty track plays the same sound as a kick.
  - Check: corrected (the first text named the word and the sound as the only differences. See W2.
    Measured on job p2-save: the kick left Joints at 1 and the tag at TIED. The spot onto AS74
    moved Joints to 2 and showed the tag LOOSE. Evidence: `R7-check/extra-X7.json`,
    `X7-after-gap-spot.png`.)

### F6. After Depart, the train comes back

- `departOut` moves the train off the left edge in 1300 ms, then sets `anim = null` and paints
  (`yardSim.js:522-523`). `render.js:49` then draws the engine and its cut at rest on the lead,
  because `state.engine` still holds the cars.
  - Check: confirmed (lines 522-523 and `render.js:49` read.)
- Measured picture, 600 ms after the departure ends: the banner reads "✓ Departed out the lead —
  Par! 4 moves — 2 couplings, clean" and the train stands on the lead with cars 401001, 401002
  and 401003.
  - Check: confirmed (`R7-check/X6-after-depart-canvas.png`: the same banner text, and the train on
    the lead with 401001, 401002 and 401003.)
- Added in the check pass. The job goes on after the departure. `departOut` changes no model state.
  Measured on p6-road: after Depart, the call SPOT 3 to AS73 ran. The banner read "Spotted 3 to
  AS73." and the readout read "Moves 5 / par 4 · Joints 2". The learner set out the train that the
  words said had departed.
  - Check: confirmed (`R7-check/extra-X6.json`, `X6-after-depart-then-spot.png`.)

### F7. The engine position after a spot does not agree with the model

- `model.js:156`: a spot sets `state.out = false`. The pull-out is charged on the next move as
  one extra move (`model.js:139`, `:156`, `:198`).
  - Check: confirmed (the three lines read.)
- The drawing shows the engine go back to the lead after each spot (`yardSim.js:373-378`), and the
  rest picture always puts the engine on the lead (`render.js:49`).
  - Check: confirmed (lines read.)
- Checked by a replay of job p1-dig: the first spot costs 1 move and the second spot costs 2. The
  two spots show the same animation. The readout shows totals only (`yardSim.js:432`). No words
  give the cost of a move.
  - Check: confirmed (`R7-check/myfacts.mjs`: cost 1, then cost 2. Four optimal lines hold a spot
    that costs 2: p1-dig, p1-clear, p1-messy and p5-room.)
- Added in the check pass. The help text gives a cost for each call: a pull is 2, a spot is 2, and
  the last spot is 1 (`yardSim.js:197-201`). The readout adds the cost at a different time. A spot
  adds 1, and the next move adds the pull-out. A pull after a spot adds 3 (`model.js:139`). The
  totals agree at the end. The steps do not agree with the help text move by move.
  - Check: confirmed (by reading. `model.js:139` reads `(state.out ? 0 : 1) + 2`.)

### F8. A switch throw has colour only, and the banner goes stale

- `drawSwitch` fills a diamond with one of two colours and adds a halo for reverse
  (`render.js:112-128`). There is no word, no shape change and no text outside the canvas.
  - Check: confirmed (lines read. The help text gives the colour key in words
    (`yardSim.js:189-191`). No text gives the position of a switch.)
- The throw does not update the banner (`yardSim.js:295`). Measured: the learner gets the refusal
  "AS73 is lined normal — line its switch reverse for the track (CROR 104)." The learner lines
  AS73 reverse. The banner still shows that text.
  - Check: confirmed (scenario A, 3 runs.)

### F9. The arrival shows cars that move alone through a switch lined against them

- Measured pictures of job p6-road. At 2100 ms the inbound train is on the lead and the foot of
  the ladder, and its engine is off the left edge. At 3000 ms cars 401002 and 401003 are on AS73 and slide to the deep
  end with no engine. The AS73 switch shows normal the whole time.
  - Check: confirmed (`R7-check/C-cine-2100.png`, `C-cine-2500.png`, `C-cine-3000.png`.)
- `render.js:66-78` draws the slide. `yardSim.js:278` runs it for 1100 ms.
  - Check: confirmed (lines read.)
- The arrival starts by itself on each load and each Reset of that job (`yardSim.js:261`). It runs
  5079 ms (measured). It has no words and no sound.
  - Check: confirmed (this pass: 5057 ms, median of 3. The routine at `yardSim.js:270-282` calls no
    sound and writes no words.)
- With the reduce setting on, the train moves slowly for 5.8 s and reaches only the top of the
  ladder. Then the picture jumps to the end state (measured picture at 5700 ms and 6000 ms).
  - Check: confirmed (5801 ms in each of 3 runs. By the geometry the engine is at x 637, y 122 at
    the cut, 365 of 1295 units. Picture `R7-check/Creduce-cine-5700.png`.)
- Added in the check pass. The same pictures show three more faults. (1) At the end of the first
  phase the two set-out cars stand on the lead, at x 95 and x 137. In the next frame they are on
  AS73 at x 630. No picture shows how they got there. (2) In the same frame the five cars behind
  them jump 84 units forward, because the train is drawn again without the two cars
  (`render.js:58-63`). (3) The numbers on the two cars are upside down while they ride the inbound
  train.
  - Check: confirmed (`R7-check/myfacts.mjs` for the positions. `C-cine-2100.png` and
    `C-cine-2500.png` for the jump and the numbers.)

### F10. A watched optimal line counts as done

- `recordWin` adds the job to `completed` before the `fromDemo` guard (`yardSim.js:463-466`). The
  guard covers the best record and the mastery write only (`:469`, `:484`).
  - Check: confirmed (lines read.)
- Measured on a fresh profile: after "Watch optimal" on p0-1 the picker changes from
  "→ Make up the cut · par 5" to "✓ Make up the cut · par 5". The stored profile holds
  `completed: ["p0-1"]`, `best: {}`.
  - Check: confirmed (scenario D, 3 runs.)
- The demo ends with the win banner "✓ Par! 5 moves — 2 couplings, clean" and the win sound
  (measured).
  - Check: confirmed (the win banner at 11105 ms and four win notes from 11030 ms.)
- "Watch optimal" resets the job first and does not ask (`yardSim.js:403`).
  - Check: confirmed (line 403 read. The file holds no `confirm(` call.)
- The banner shows one text for all the engine moves of the demo: "▶ Watching the optimal line —
  par 5 moves" (measured: from 0 ms to 10.3 s). No words name the step.
  - Check: confirmed (this pass: from 85 ms to 10362 ms.)
- There is no stop control. A change of job stops the demo (`yardSim.js:404`, `:413`). Leaving
  the Yard stops it also, through an error (section 14).
  - Check: corrected (the first text said that only a change of job stops the demo. Leaving the
    Yard stops it also, through a fault. Measured: 74 paints after leaving, then no paint, no sound
    and no done mark in 14 s. The page logs `TypeError: Cannot set properties of null`. Evidence:
    `R7-check/extra-X3.json`, `x8.mjs`.)
- By formula (checked against the measurement of p0-1 within 2 %), the demo runs from 6.2 s
  (p2-kick) to 32.4 s (p1-sort). With the reduce setting on it runs from 17.8 s to 90.1 s.
  - Check: confirmed (`R7-check/myfacts.mjs`: 6236 ms to 32440 ms, and 17760 ms to 90060 ms. For
    p0-1 the formula gives 10852 ms and the measurement gives 11022 ms: 1.6 %.)

### F11. One effect is dead code

- `spotPlan` returns the literal `shove: false` (`model.js:102`). A replay of all 19 optimal lines
  made 36 calls and none returned `shove: true`.
  - Check: confirmed (`model.js:102` read. This pass made 72 calls over the 19 optimal lines, with
    and without the couple flag. None returned true.)
- The code that moves a standing cut (`yardSim.js:331`, `:337-339`, `:355-357`,
  `render.js:189-199`) never runs.
  - Check: confirmed (by reading: each branch needs `plan.shove` to be true.)

### F12. Sound: the default, the mute and the map

- Five sounds, each made of one to four oscillator tones (`sound.js:18-35`). No sound file.
  - Check: confirmed (`sound.js:29-35` read. The tone function is at `:18-27`.)
- **Default.** `AppContext.tsx:12`: "Read aloud" is off by default. `yardSim.js:715`: if "Read
  aloud" is off and the Yard is not muted, the Yard mutes itself at mount. Measured on a first
  visit: the button shows the muted glyph and `sl_muted` is `1`. With "Read aloud" on, the Yard
  starts with sound on (measured).
  - Check: confirmed (scenario H, run again.)
- **The mute does not hold.** Measured: the learner turns sound on (`sl_muted` is `0`). After
  Home and back, the Yard is muted (`sl_muted` is `1`). After a reload it is muted.
  - Check: corrected (confirmed for a learner who has "Read aloud" off. With "Read aloud" on, line
    715 changes nothing and the state holds. Measured: the learner mutes the Yard, and it is still
    muted after Home and back and after a reload (`R7-check/x11.mjs`). The text of the item did not
    change.)
- **The mute button.** Its name is the title "Sound". Its content is one emoji. It has no
  `aria-pressed`. It measures 43 by 37 px (measured at 1440).
  - Check: confirmed (43.5 by 37 px at 1440 and at 390. Title "Sound". No `aria-pressed` and no
    `aria-label`.)
- **One sound, many meanings.** See the table in section 11.
  - Check: confirmed (see 11.1.)
- **Sound against picture.** A spot onto a track that holds a cut plays the couple sound and adds
  a joint (`yardSim.js:346-348`, `model.js:151`), also when the model leaves a gap of one car
  length. Three spots in the optimal lines do this (p2-save, p2-types, p4-peel: gap 42 units,
  joint +1).
  - Check: confirmed (`R7-check/myfacts.mjs`: three spots with a gap of 42 units and joint +1.
    Picture `X7-after-gap-spot.png` shows the gap on AS74 after the coupling sound.)
- The win sound plays at the press of Depart, before the train moves (measured: first note 3 to
  5 ms after the first frame).
  - Check: confirmed (the first note is 2 to 5 ms after the first frame, 4 runs.)
- No sound plays without a learner action. The arrival routine calls no sound
  (`yardSim.js:270-282`).
  - Check: corrected (the first text gave the measurement as the proof. The measurement cannot
    prove it: no audio context exists before the first press that calls `resume()`, so no sound can
    be recorded then. The proof is the code: the arrival routine calls no sound.)
- Added in the check pass. "Read aloud" reads nothing aloud in the Yard. `yardSim.js` never calls
  `ctx.speak`. In the Yard the setting has one effect: it turns the effect sounds on at mount
  (`yardSim.js:715`).
  - Check: confirmed (a search of `yardSim.js` for `speak` finds nothing.)

### F13. No effect reaches a screen reader

- The Yard has no live region and no role (measured in the DOM: none; `#msg` has `class` and `id`
  only). The canvas has no name and no fallback text.
  - Check: confirmed (measured again: no `aria-live`, no `role="status"` and no `role="alert"` in
    the document while the Yard shows. `#yard` has `id`, `width` and `height` only, and no
    content.)
- No element in the Yard has a CSS transition or animation (measured: none).
  - Check: confirmed (0 elements.)

### F14. The result text of the last move never shows

Added in the check pass.

- `afterMove` writes the move text to the banner (`yardSim.js:433`). In the same call it writes the
  win text, the Depart text or the loose notice over it (`:438`, `:441`, `:446`). The learner sees
  the second text only.
- Measured: on job p2-kick the kick wins the job. The banner after the kick reads "✓ Par! 3 moves —
  1 coupling, clean". The text "Kicked 2 to AS73." never shows. This is the first job that teaches
  the kick.
- Measured: on job p0-1 the banner after the last spot is the loose notice, not "Spotted 6 to
  AS75." After the secure it is the win text, not "Hand brakes applied — AS75 is tied down."
- Measured: on job p2-save the kick is not the last move, and the banner reads "Kicked 2 to AS73."
- For section 10: a live region that copies the banner gets two texts in one task. The access layer
  must send one message that holds the two parts in order.
- Check: confirmed (`result-B.json`, `result-A.json` and `extra-X7.json` in `R7-check/`. Lines
  431-448 read.)

---

## 4. What Dusk gives, and what the page-law tier allows

The law text itself (the rules named SKIN-04, SKIN-06, SAFE-04, SAFE-05) is not in a repository
this session can read. This section reads the Dusk layers and the Dusk records. The reading of
the law is **not verified** against the law text.

Check: confirmed (a search of `/home/user/dusk` and of the helper folder finds the rule names only
as references. `/home/user/dusk/DECISIONS.md:175` says that another owner holds the law files. The
reading of the law stays not verified against the law text.)

### 4.1 The motion tokens (`src/styles/dusk/dusk.tokens.css:410-419`, and `:400` for `--travel-y`)

| Token | Value | Tier | Used by Dusk for |
|---|---|---|---|
| `--m-confirm` | 160 ms | 1 | hover, focus, press; the arrived state of a station |
| `--ease` | `ease` | 1 and 2 | each transition and the entrance |
| `--lift` | -2 px | 1 | the tile lift on hover and focus |
| `--m-enter` | 420 ms | 2, OPEN only | the entrance |
| `--enter-shift` | 8 px | 2, OPEN only | the distance of the entrance |
| `--m-ride` | 6000 ms | 2, OPEN only | one pass of the traveller down a process track, `linear` |
| `--travel-y` | 0 px, set by the page | 2, OPEN only | the distance of the ride. The page measures it |
| `--m-drift`, `--drift-x`, `--drift-y` | 120 s, 2vw, -1.5vh | 3 | the slow drift of the ground |

Check: confirmed (each value read at `dusk.tokens.css:400` and `:410-418`. One limit: the comment
at `:416` says "Tier 3, OPEN only" for the drift, and W-026 lets a STRICT page opt in.)

Dusk has no duration between 420 ms and 6000 ms. Dusk has no sound token. Dusk uses the keywords
`linear` (`dusk.motion.css:37`) and `ease-in-out` (`dusk.motion.css:50`) without a token.

Check: confirmed (the token file has four time values, at lines 410, 413, 414 and 416. No Dusk
layer holds the word "sound" or "audio". `linear` is at `dusk.motion.css:37` and `ease-in-out` is
at `:50`.)

Added in the check pass. The token file says who reads these tokens: "Nothing here is read by the
STRICT tier except the Tier 1 lift" (`dusk.tokens.css:407-408`). By that comment a STRICT page does
not read `--m-enter`, `--enter-shift` or `--m-ride`. Rule 7 of section 6 and option (a) of pick P4
read them. This matters for pick P1.

Check: confirmed (lines 406-409 read.)

### 4.2 The three tiers (`/home/user/dusk/ARCHITECTURE.md:69-94`)

| | STRICT (also: no `data-tier`) | OPEN |
|---|---|---|
| Tier 1, state confirmation: `transition` on `background-color` and `box-shadow`, the tile lift by `transform`, 160 ms | yes | yes |
| Tier 2, the entrance: `.dusk-enter` settles 8 px in 420 ms | no | yes |
| Tier 2, the traveller: one mark rides a track one time, on a press it rides again | no | yes |
| Tier 3, the ambient drift of the ground (`body::before` only) | off. Opt-in with `data-ambient="on"` | on. Off with `data-ambient="off"` |
| Reduced motion | each effect stops | each effect stops |

Check: confirmed (`/home/user/dusk/ARCHITECTURE.md:69-94` and `dusk.motion.css:1-56` read. The
traveller row comes from `dusk.motion.css:30-38`. The table in `ARCHITECTURE.md` does not list the
traveller.)

- **A STRICT page may animate:** a state change of a part, in place, in 160 ms (the lit edge, the
  wash, the 2 px lift). With an opt-in, the ground drift. Nothing else.
  `/home/user/dusk/DECISIONS.md:141` (W-026): "nothing else moves on STRICT".
  - Check: confirmed (W-026 read at line 141. The Tier 1 transitions are at
    `dusk.components.css:108`, `:198`, `:231` and `:378`.)
- **A STRICT page may not animate:** an entrance, a ride along a track, or any keyframe on a part.
  - Check: not verified (the Dusk test covers Dusk selectors only. No Dusk line speaks about a
    drawing that a page makes on a canvas. The statement is a reading by this job.)
- **OPEN adds:** the entrance, the one-time ride with a replay on a press, and the ground drift by
  default.
  - Check: confirmed (`dusk.motion.css:20-51` read.)
- **On both tiers:** the motion layer writes `translate` only, never `transform`, `transition` or
  `opacity` (`dusk.motion.css:3-4`). A glow is a still shadow and never moves
  (`dusk.tokens.css:246-251`). "No text depends on JavaScript, canvas or a completed animation"
  (`ARCHITECTURE.md:189`). A glow is never the only carrier of a state (`ARCHITECTURE.md:194`).
  - Check: confirmed (each of the four cited places read.)
- **Today:** Clear Board has no tier line (plan T8; no `data-tier` on `<html>`, measured). No line
  means STRICT.
  - Check: confirmed (the repository root has no `ARCHITECTURE.md`. `DECISIONS.md` has no "Page law
    tier" line. Measured: `<html>` has no `data-tier` attribute. `dusk.motion.css:4-5` says that no
    attribute is STRICT.)

### 4.3 The reduced-motion blocks in Dusk

- Tier 1 (`dusk.components.css:630-639`): `transition: none`, and the lift stops. The brighter
  edge and the wash stay, so each state still shows.
  - Check: confirmed (lines read.)
- Tiers 2 and 3 (`dusk.motion.css:62-78`): `animation: none` and `translate: none`. The part sits
  in its arrived position. "Nothing is left part-way".
  - Check: confirmed (lines read.)
- The traveller (`dusk.process.css:164-166`): hidden. The record gives the reason: a mark that
  cannot move would point at the wrong station (`/home/user/dusk/DECISIONS.md:170`, W-034). The
  ring on the current station stays as the static signal.
  - Check: confirmed (lines read. W-034 is at `/home/user/dusk/DECISIONS.md:170`.)
- The Dusk blocks follow the operating system flag only. Clear Board also has an app setting
  (`html[data-reduce]`). The bridge must make the Dusk parts obey the two. This is a note for R3
  and S1.
  - Check: confirmed (no Dusk layer holds `data-reduce`. `src/index.css:43` and `:119` use it
    today.)

### 4.4 What this means for the Yard

The Yard drawing is page content, not a Dusk part. Dusk does not name it. The nearest part in
Dusk is the traveller: a mark that rides a track to show a process. Dusk puts that ride in
Tier 2, OPEN only, one pass, started by the page or a press, hidden under reduced motion.

By that precedent, this sheet puts each Yard effect in one of two classes.

| Class | Yard effects | STRICT | OPEN |
|---|---|---|---|
| **Confirm** (Tier 1 class): a state change in place, `--m-confirm`, `--ease` | switch throw, secure, refusal mark, counter change, banner tone, flag a line, certify, mute | allowed | allowed |
| **Travel** (Tier 2 class): equipment moves along a track | pull, couple and stretch, spot, uncouple gap, kick and roll, arrival, set-out, departure, the watched line | not allowed by a literal reading | allowed |

Check: not verified (the two classes are a reading by this job. Dusk has no line about a page
drawing. One Dusk line does apply to the drawing: no text may depend on a canvas,
`/home/user/dusk/ARCHITECTURE.md:189`.)

The owner picks the tier at the gate (pick P1, section 12). Each row of the sheet gives a static
form first, so each of the three options in P1 is buildable.

A drawing made with canvas or SVG can read a token at run time with
`getComputedStyle(document.documentElement).getPropertyValue('--m-enter')`. This is a note for Y2:
read durations and distances from tokens through the bridge file. Do not write a number in the
drawing code. Measured in Chromium with the locked token file:

- `--m-confirm` reads `160ms`. `--m-enter` reads `420ms`. `--m-ride` reads `6000ms`.
  `--enter-shift` reads `8px`. `--ease` reads `ease`.
- An alias `--yard-run-in: calc(var(--m-enter) * 2)` reads `calc(420ms * 2)`. That is a text, not
  a time. A script cannot use it as a number.
- The same alias registered with `@property` and the syntax `<time>` reads `0.84s`. The same
  alias used as the `transition-duration` of an element reads `0.84s` from that element.

The script must parse the two units, `ms` and `s`. A multiple must be resolved in one of the two
ways above, or the script must do the multiplication.

The CSS keyword `ease` is `cubic-bezier(0.25, 0.1, 0.25, 1)`. Measured: two paused animations,
one with each easing, give the same position at 100, 250, 500, 750 and 900 ms of 1000 ms.
`anim.js:4` uses a different curve today, a symmetric quadratic. A canvas tween cannot use the
keyword directly. The drawing code needs its own cubic-bezier function, or the Web Animations
API.

Check: corrected (the trap of the `calc()` alias and of the unit is added. The value of `ease` is
now measured. Evidence: `R7-check/extra-X5.json`.)

---

## 5. Research: what motion teaches, and what is noise

Each statement here is from a search summary. The pages did not open. **Not verified against the
page.** No source was found that studies motion in a switching game or a logistics game. The
application to the Yard is a judgement of this job, not a finding.

Check: not verified (this pass could not open a page either. The Yard figures in the last column
are confirmed in section 3: 1.5 s, 8.9 s, 5079 ms, 5801 ms and 0.5 s.)

| # | Source | What the summary says | What it means for the Yard |
|---|---|---|---|
| 1 | "Animation: can it facilitate?", International Journal of Human-Computer Studies 57(4), 2002. https://hci.stanford.edu/courses/cs448b/papers/Tversky_AnimationFacilitate_IJHCS02.pdf | Two principles. Congruence: the form of a graphic must match the idea. Apprehension: people think of an event as a sequence of discrete steps, and an animation can be too fast to read. Interactivity can remove the two problems. Animation can help for a reorientation in space. | Show a move as discrete steps. Let the learner set the pace. The order of cars on a cut after a pull is a reorientation: this is the case where motion can help. |
| 2 | "Instructional animation versus static pictures: A meta-analysis", Learning and Instruction 17(6), 2007. https://www.leibniz-ipn.de/en/research/publications/instructional-animation-versus-static-pictures-a-meta-analysis | 26 studies. Overall d = 0.37 for animation. Larger when the animation is representational and not decorational (d = 0.40). Largest for procedural-motor knowledge (d = 1.06). | The move animation is representational and the subject is a procedure: the supported case. The arrival is decorational: the unsupported case. |
| 3 | Later analyses, summarised in Instructional Science, 2021. https://link.springer.com/article/10.1007/s11251-021-09541-w | Two later meta-analyses give a smaller overall effect (g about 0.23). Animation helps most when the learner must learn the specifics of a change. | Do not expect much from motion alone. Keep it where the change itself is the lesson: contact, gap, free roll. |
| 4 | Research-based principles for multimedia instruction. https://www.unh.edu/teaching-learning-resource-hub/sites/default/files/media/2023-06/itow-research-based-principles-for-designing-multimedia-instruction-mayer.pdf | Segmenting: learner-paced segments are better than one continuous run. Signalling: a cue that marks the essential part helps (26 of 28 tests). Coherence: remove extra material (18 of 19 tests). Temporal contiguity: show the words and the picture at the same time. | The watched line becomes a stepper. A trace marks the last move. The words arrive with the end state. Decoration goes. |
| 5 | "The effects of juiciness in an action RPG", Entertainment Computing, 2020. https://www.x-mol.com/paper/1307980428882448384 | 3018 players, four levels of extra feedback. No feedback and extreme feedback each gave less play time, lower experience and lower performance than the middle levels. | Give a clear confirmation for each action. Do not add shake, burst or fanfare. |
| 6 | "How does juicy game feedback motivate?", 2024. https://spiral.imperial.ac.uk/entities/publication/253c32f5-d124-4a23-88b5-9aaaf114608d | The gain from feedback ties to a legible link between the action and its outcome. | Each effect must show which call caused which change. |
| 7 | Animation duration, Nielsen Norman Group. https://www.nngroup.com/articles/animation-duration/ | Most interface animations: 100 to 500 ms, longer for a longer travel. Simple feedback: about 100 ms. Use the shortest duration that is not jarring. Remove animation for a user who asks for reduced motion. | A confirmation at 160 ms fits. A travel of 420 to 840 ms is at or above the top of the range: keep it interruptible. |
| 8 | Response time limits, Nielsen Norman Group. https://www.nngroup.com/articles/website-response-times/ | 0.1 s feels direct. 1 s keeps the flow of thought. 10 s is the limit of attention. | A locked control for 1.5 s breaks the flow. A locked control for 8.9 s (F1) is close to the limit of attention. |
| 9 | WCAG 2.2.2 Pause, Stop, Hide (Level A). https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide | Motion that starts by itself, lasts more than five seconds and shows beside other content needs a way to pause, stop or hide it, unless the motion is essential. | The arrival starts by itself and runs 5079 ms (5801 ms with the reduce setting). It has no stop. |
| 10 | WCAG 2.3.3 Animation from Interactions (Level AAA). https://w3c.github.io/wcag/understanding/animation-from-interactions | Motion that an interaction starts can be turned off, unless it is essential. A user setting or the system flag is a sufficient way. | With a static form for each effect, no Yard motion is essential. All of it can stop. |
| 11 | WCAG 1.4.2 Audio Control (Level A). https://www.w3.org/WAI/WCAG21/Understanding/audio-control.html | Audio that plays by itself for more than 3 seconds needs a stop or its own volume control. | Each Yard sound is 0.5 s or less and follows a learner action. The criterion is not triggered. |
| 12 | WCAG 4.1.3 Status Messages (Level AA). https://www.w3.org/WAI/WCAG21/Understanding/status-messages | A status message must reach assistive technology without a move of focus. | The banner and the readout need a live region (F13). |
| 13 | Game Accessibility Guidelines, and Xbox Accessibility Guideline 105. https://gameaccessibilityguidelines.com/ and https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/105 | Basic level: no essential information by sound alone. Basic level: separate volume controls or mutes. Offer a way to pass a part that is not the core mechanic. | Each sound has a visual twin and words. The Yard sound has its own switch. The arrival has a skip or is on request. |
| 14 | Earcons and auditory icons. https://www.dcs.gla.ac.uk/~stephen/papers/CHI93.PDF and https://www.dcs.gla.ac.uk/~stephen/papers/ICAD2003_david.pdf | Sound added to a graphical interface cut task time and error recovery time. Sound does not replace the graphics. Sounds from the real world are easier to link to a command. Abstract tones interfere with one another. | Sound is a second channel for confirmation. One sound has one meaning. A coupling sound must mean a coupling. |
| 15 | Web Audio and the autoplay policy. https://developer.chrome.com/blog/web-audio-autoplay | An audio context made before a user gesture starts suspended. Resume it after the first click or tap. | `sound.js:13-16` does this. The flag-a-line click and the mute click do not call `resume()` (`yardSim.js:307`, `:577-579`). |
| 16 | The reduced-motion media query. https://web.dev/articles/prefers-reduced-motion | Read the query with `matchMedia`, and listen for its `change` event to follow the user. | The Yard rule in section 8 uses this. |
| 17 | Switching puzzles on a computer. https://www.wikiwand.com/en/articles/Inglenook_Sidings and https://ogrforum.com/topic/shunting-an-inglenook-shunt-puzzle-free-app-on-google-playstore | Computer versions of the classic shunting puzzles let the player click a car to couple or uncouple, click the points, and move forward or back. | The summary gives no data on motion or sound design. Not usable as evidence. |

- Check: not verified (rows 2, 4 and 5. A second search in this pass gave the same summary for the
  main statement of each row. It did not give the two subgroup values of row 2, 0.40 and 1.06, or
  the segmenting statement of row 4.)
- Check: corrected (row 9. The first text gave two conditions. By the search summary of this pass
  the criterion has three: the motion starts by itself, lasts more than five seconds, and shows
  beside other content. It has an exception for motion that is essential. The arrival meets the
  three conditions: it shows beside the work order and the controls. Not verified against the
  page.)
- Check: not verified (rows 1, 3, 6, 7, 8, 10 to 14, 16 and 17. Not searched again. The hosts did
  not resolve.)
- Check: confirmed (row 15, the Yard column only. Measured with sound on: a first press on a line
  of the switch list made no sound. A press on a line after Certify made the `points` sound.
  `sound.js:13-16`, `yardSim.js:307` and `:577-579` read. Evidence: `R7-check/extra-X4.json`. The
  source statement of row 15 is not verified.)

### 5.1 What motion teaches in the Yard

| Motion teaches | Why a still picture is weaker | The static twin |
|---|---|---|
| **Cause and effect:** this call moved this cut along this route | A still shows the result, not the route | A trace of the last move on the track, and the words |
| **Order:** which car is at which end of the cut after a pull | The learner must work it out | The cut is drawn in order with its numbers. The text mirror lists the cars from the engine out |
| **Contact or gap:** a coupling, or a cut left apart | A small gap is hard to see at phone size | A coupling mark or a gap mark by shape, and the words |
| **Free roll or shove:** a kick against a spot | The two end states look the same | The trace is dashed where the cars rolled alone. The engine rests in a different place. The words |
| **Where the engine is** when the move ends | Needed to explain the cost of the next move | The engine is drawn where the model has it. The text mirror says it |

Check: not verified (a judgement of this job. No source and no learner test.)

### 5.2 What is noise in the Yard

- Motion that starts by itself (the arrival).
- Motion that locks the controls (each move today).
- Slow motion of the whole demo. A learner needs control of the pace, not a slower film.
- A reward effect for a line the learner did not play (the win sound after the demo).
- A shake, a flash or a burst on a refusal or a win.
- A glow as the carrier of a state (the reverse switch today).
- A loop of any kind. A counter that ticks up.
- A sound that means two things.
- Check: not verified (the list is a judgement of this job. Each Yard fact in it is confirmed in
  section 3.)

---

## 6. Design rules for the Yard

These rules come from the fence (plan section 4), Dusk (section 4) and section 5.

1. **Static first.** After each effect, the screen shows the end state, a trace of the last move,
   and words. That form carries all the information. Motion adds nothing that the static form
   does not also say.
   - Check: confirmed (it follows fence items 6 and 15. The new words and marks are new copy and
     new drawing. They need the owner's yes: section 17.)
2. **The learner starts each motion.** Nothing moves on load.
   - Check: confirmed (it removes the automatic arrival. That is pick P5.)
3. **Motion never locks a control.** A new input ends the running effect at once: the drawing
   jumps to the end state, and the new input runs.
   - Check: corrected (this is option (a) of pick P11, not a settled rule. It is a behaviour
     change. A double press then makes two moves: today the lock stops the second press. Not
     tested. The text of the rule did not change.)
4. **The result does not wait for the motion.** The words, the counters and the announcement
   change at the start of the effect. `departOut` does this today (`yardSim.js:514`).
   - Check: corrected (`yardSim.js:514` is confirmed. For a move, the rule changes the time of the
     model change: today it is at the contact, `yardSim.js:343-351` and `:368`. That is a behaviour
     change in the controller. It belongs to pick P11. It needs no frozen file. The text of the
     rule did not change.)
5. **One thing moves at a time.** The eye ends on the place of the next decision.
   - Check: not verified (a judgement.)
6. **The drawing shows what the model holds.** No picture of a leg that the model did not count.
   - Check: confirmed (the drawing reads `state.out`, `state.pos` and `state.engine`. It writes
     nothing to `model.js`. Picks P6 and P14.)
7. **Token values only.** Confirm: `--m-confirm`, `--ease`. Travel in: 2 × `--m-enter`. Travel
   out: `--m-enter`. Nudge: `--enter-shift`. Long ride: `--m-ride`, `linear`. A travel distance
   comes from the drawing, as `--travel-y` does in Dusk. The multiples go in the bridge file as
   named aliases (pick P4).
   - Check: corrected (the arithmetic is right: 2 × 420 = 840. Two limits are added. An alias made
     with `calc()` does not read as a time (4.4). The token file says that a STRICT page reads only
     the Tier 1 tokens (4.1). The text of the rule did not change.)
8. **Reduced motion stops everything** (section 8).
   - Check: confirmed (fence item 6.)
9. **Sound confirms. It never carries.** One sound, one meaning. Each sound has a visual twin and
   words (section 11).
   - Check: confirmed (it follows fence item 5. A change of the sound map needs picks P9 and P13.)
10. **Red is attention only.** A refusal may use it. A trace, a route and a state do not.
    - Check: confirmed (fence item 5.)

**The trace.** This is the main new static device. After a move, a thin line with an arrow head
follows the route of that move on the track. It is solid where the engine moved the cars. It is
dashed where cars rolled alone. It stays until the next action. Pattern and words carry it, not
colour. Its look belongs to R1 and Y2.

Check: corrected (the trace is a new part of the drawing. No pick covered it. Pick P15 is added.
The text did not change.)

---

## 7. The sheet

Each block is one row of the sheet. The fields are the columns: today, purpose, static form,
motion form, sound, reduced motion, risk. Durations in "today" are measured unless the block says
"nominal". "Units" are canvas units of `geometry.js` (1340 wide). At 1440 px one unit is
0.658 CSS px. At 390 px one unit is 0.263 CSS px (measured).

Check: confirmed (measured: the canvas is 882 CSS px wide at 1440 and 352 CSS px wide at 390. One
unit is 0.658 and 0.263 CSS px.)

Overview:

| # | Effect | Moves today | Measured today | Class | Sound today |
|---|---|---|---|---|---|
| 1 | Switch throw | no | 1 paint | confirm | points |
| 2 | Pull | yes | 1534 ms | travel | couple |
| 3 | Couple and stretch | yes, part of 2 | 280 ms nominal | travel | couple |
| 4 | Spot (shove) | yes | 1217 ms | travel | couple or roll |
| 5 | Uncouple | no | none | confirm | none |
| 6 | Shove of a standing cut | never runs | none | travel | none |
| 7 | Kick and the roll | yes, as a spot | 1234 ms | travel | roll |
| 8 | Secure (tie down) | no | 1 paint | confirm | points |
| 9 | Refusal | no | 0 paints | confirm | refuse |
| 10 | Counter change | no | text swap | confirm | none |
| 11 | Built but loose notice | no | text swap | confirm | the move sound only |
| 12 | Arrival of the inbound cut | yes | 5079 ms, all three phases | travel | none |
| 13 | Set-out | yes, part of 12 | 1100 ms nominal | travel | none |
| 14 | Departure of the inbound train | yes, part of 12 | 1700 ms nominal | travel | none |
| 15 | Outbound built, Depart enabled | no | text swap | confirm | couple (from the pull) |
| 16 | Departure of the learner's train | yes | 1317 ms | travel | win |
| 17 | The win | no | text swap | confirm | win |
| 18 | The watched optimal line | yes | 11.0 s for p0-1 | travel | each move sound, then win |
| 19 | Switch list: flag a line | no | DOM swap | confirm | points |
| 20 | Switch list: certify | no | DOM swap | confirm | couple or refuse |
| 21 | Load a job, Reset | no, but it starts 12 | instant | confirm | none |
| 22 | Mute | no | glyph swap | confirm | none |
| 23 | The lock during motion | no sign | up to 8.9 s | — | none |
| 24 | Still decoration: reverse-switch glow, headlight, button hover and press | no | — | — | none |

Check: confirmed (each measured value is within 25 ms of this pass. Each sound in the last column
is measured again in scenarios A, B, C, D and K.)

### 7.1 Switch throw

- **Today.** `yardSim.js:285-296`, `render.js:112-128`. A click inside 18 units of a switch flips
  it. One paint. The diamond changes colour and a halo shows for reverse. No word. The banner does
  not change (F8).
- **Purpose.** It tells the learner the position of the switch now, and which track the lead
  reaches now.
- **Static form.** The switch shows its position by shape and by a word at the switch. The lined
  route from the lead is drawn as one continuous path to the track it reaches. The text mirror
  gives each switch position and the track that the route reaches. The banner drops a refusal
  that is no longer true.
- **Motion form.** Confirm class. The switch mark changes over `--m-confirm` with `--ease`. Its
  edge changes to its "on" form and stays. R3 and R1 name the token for that edge. No travel.
  Allowed on STRICT.
- **Sound.** Today: `points` (square, 880 Hz, 50 ms). Proposed: the same. This is its one meaning.
- **Reduced motion.** The new position shows at once with its word.
- **Risk.** Colour as the only carrier (today). A flash on each click, if the edge change is made
  bright. A stale banner teaches the wrong state.
- Check: corrected (the facts of today are confirmed: hit radius 18 units, one paint, `points`. The
  first text named the token `--neon-ctl` for the edge. That token exists (`dusk.tokens.css:256`),
  but it is the gold edge of a control, and gold is chrome only (plan section 3). The token name is
  removed. Fence: the word at the switch follows fence item 5. The route path belongs to the Yard
  look (Gate A, question 1). The dropped refusal is pick P16.)

### 7.2 Pull

- **Today.** `yardSim.js:316-382`. Three phases: run in 600 ms, stretch 280 ms, run out 600 ms.
  Measured 1534 ms. The engine travels 892 to 1142 units to the contact in the optimal lines,
  always in 600 ms.
  The model changes at the start of the stretch (`yardSim.js:368`). The banner reads "Pulled 3
  from AS73." at the end.
- **Purpose.** It shows the route of the engine, which cars it took (the cars at the throat end),
  and the order of the cut on the lead.
- **Static form.** The engine stands on the lead with the cut in order, each car with its number.
  The track shows the cars that stay. The trace runs from the track to the lead. The words give
  the call, the result and the cost of the move. The text mirror lists the cut from the engine
  out.
- **Motion form.** Travel class. Run in: 2 × `--m-enter` (840 ms), `--ease`, so the engine slows
  into the contact. Then 7.3. Run out: `--m-enter` (420 ms), `--ease`. Total 1580 ms. The
  distance is the route length from the drawing.
- **Sound.** Today: `couple` at the contact (measured 617 to 635 ms after the first frame).
  Proposed: the same, at the contact.
- **Reduced motion.** One paint. The end state, the trace and the words show at once.
- **Risk.** A long travel in a short time is hard to follow (up to 751 CSS px in 600 ms at 1440
  today). A fixed duration makes a near track look slow and a far track look fast.
- Check: corrected (the first text gave 739 to 1167 units for a pull. That range is for all moves:
  its two ends are spots. A pull runs 892 to 1142 units, up to 751 CSS px at 1440. The timing is
  confirmed: 1532 ms, and the contact sound at 617 to 636 ms. The proposed total is 840 + 320 + 420
  = 1580 ms.)

### 7.3 Couple and stretch

- **Today.** `yardSim.js:362-372`. After the contact the engine moves 6 units toward the lead and
  back in 280 ms. At 1440 px that is 3.9 CSS px. At 390 px it is 1.6 CSS px. No words show at
  the time of the stretch. The rule chip "Couple, then stretch to verify the joint" shows on each
  of the 19 jobs (`puzzles.js:12`), and the help text names the stretch (`yardSim.js:207-208`). A
  code comment at `yardSim.js:362` ties the motion to a rule.
- **Purpose.** It tells the learner that the joint is made and tested.
- **Static form.** A coupling mark by shape between the engine cut and the first car taken. The
  Joints counter with its change. The words say the cut is coupled. The wording of a test of the
  joint is for the SME (S3).
- **Motion form.** Travel class. A nudge of `--enter-shift` (8 CSS px, not canvas units, so it
  shows at phone size) toward the lead in `--m-confirm`, and back in `--m-confirm`. Total 320 ms.
- **Sound.** Today: `couple` (triangle 150 Hz for 120 ms and sine 90 Hz for 180 ms). Proposed:
  `couple`, only where the drawing shows cars in contact.
- **Reduced motion.** No nudge. The coupling mark and the words show.
- **Risk.** At phone size the stretch of today is below 2 px and does not show. A stretch with no
  words at that moment is easy to miss.
- Check: corrected (the first text said that no words name the stretch. See W1. The sizes are
  confirmed: 6 × 0.658 = 3.9 px and 6 × 0.263 = 1.6 px. The sound values are confirmed at
  `sound.js:31`.)

### 7.4 Spot (shove)

- **Today.** `yardSim.js:325-332`, `:373-378`. Run in 600 ms, run out 600 ms. Measured 1217 ms.
  The model changes at the start of the run out. The engine goes back to the lead in the picture.
  The model holds the engine in the track (F7).
- **Purpose.** It shows where the cars rest, that they rest clear of the foul mark, whether they
  join a standing cut or stand apart, and where the engine is.
- **Static form.** The cars stand on the track with their numbers. A gap mark or a coupling mark
  shows by shape whether they joined the standing cut. The track tag reads LOOSE where the game
  shows tags (`render.js:144-147`). The engine is drawn where the model has it. The trace runs
  from the lead into the track. The words give the call, the result and the cost.
- **Motion form.** Travel class. Run in: 2 × `--m-enter`, `--ease`. Then 7.5. If the owner keeps
  the engine on the lead after a spot (pick P6), add a run out of `--m-enter`.
- **Sound.** Today: `couple` if the track held a car, also when a gap stays (F12). `roll`
  (sawtooth 320 Hz, 250 ms) if the track was empty. Proposed: `couple` only for cars in contact.
  No sound for a spot onto an empty track or a spot that leaves a gap.
- **Reduced motion.** One paint. The end state, the trace and the words.
- **Risk.** The picture shows a pull-out that the model has not counted. The cost of the next
  move then has no visible cause. A couple sound over a visible gap says two things.
- Check: corrected (the facts of today are confirmed: 1217 ms, `roll` onto an empty track, `couple`
  with a gap on job p2-save. The proposed change of the spot sound had no pick. Pick P13 is added.
  It waits for S2.)

### 7.5 Uncouple

- **Today.** No effect. The cars separate from the engine with no sign (`model.js:148`).
- **Purpose.** It tells the learner that the engine let go of the cars, and which cars.
- **Static form.** A gap by shape between the engine and the cars it left. The text mirror shows
  the engine with fewer cars, or light.
- **Motion form.** Confirm class if the gap mark changes in place over `--m-confirm`. Travel class
  if the engine backs off by `--enter-shift` in `--m-confirm`.
- **Sound.** Today: none. Proposed: none.
- **Reduced motion.** The gap shows at once.
- **Risk.** A gap too small to see at phone size. Use a fixed CSS px size, not canvas units.
- Check: confirmed (`model.js:148` read. No effect of its own shows in any scenario. Fence: a new
  mark, no frozen file.)

### 7.6 Shove of a standing cut

- **Today.** Dead code (F11).
- **Purpose.** None today. The model never moves a standing cut.
- **Static form, motion form, sound, reduced motion.** None. Y2 does not draw it.
- **Risk.** A new drawing that copies the dead branch draws a thing the game cannot do.
- Check: confirmed (F11.)

### 7.7 Kick and the roll of kicked cars

- **Today.** The same picture as a spot (F5). Measured 1234 ms. The engine carries the cars to
  the standing cut. The banner reads "Kicked 2 to AS73." when the kick is not the last move (job
  p2-save, measured). On job p2-kick the win text replaces it at once (F14).
- **Purpose.** It shows the one thing that makes a kick a kick: the engine stops, and the cars go
  on alone to the standing cut. It shows that the engine does not enter the track and ends clear.
- **Static form.** The cars stand at the standing cut. The engine stands where the model has it
  (clear, `model.js:198`). The trace is solid from the lead to the release point and dashed from
  there to the rest point. The words say "Kicked" with the count and the track. The Joints counter
  does not change, and the words say so. The track keeps its kickable mark (`render.js:150`).
- **Motion form.** Travel class. Shove: `--m-enter`, `--ease`, to the release point. Roll: the
  cars alone, 2 × `--m-enter`, `--ease`, so they slow to a stop. Engine back to rest:
  `--m-enter`. Total 1680 ms. The release point is a value of the new drawing, not of
  `geometry.js`. Its place is for the SME (S1).
- **Sound.** Today: `roll` at the moment the model changes. Proposed: `roll` at the release, for
  the kick only. Whether a sound marks the end of the roll waits for the SME (S1).
- **Reduced motion.** One paint. The end state, the two-part trace and the words. The dashed part
  of the trace is the static form of the roll.
- **Risk.** Today a learner sees no difference between the most restricted move in the game and a
  plain spot. A wrong release point teaches a wrong habit.
- Check: corrected (the banner statement changed: see F14. The timing is confirmed: 1234 ms, and
  7250 ms with the reduce setting on. The arithmetic is confirmed: 420 + 840 + 420 = 1680 ms.
  Fence: the new picture reads `spotPlan` from `model.js` and writes nothing to it. The release
  point is a value of the new drawing. The words about the roll and the Joints counter touch
  practice: they wait for S1. Pick P7.)

### 7.8 Secure (tie down)

- **Today.** `yardSim.js:390`, `render.js:144-147`. No motion. One paint. The track tag changes
  from LOOSE to TIED. The banner reads "Hand brakes applied — AS75 is tied down." when the secure
  does not end the job (F14). No move cost.
- **Purpose.** It tells the learner that the cut is tied down, on which track, and that it cost
  no engine move.
- **Static form.** The words TIED or LOOSE at the track (present today). A brake mark by shape on
  the cut (R1). The banner words. The text mirror line for that track.
- **Motion form.** Confirm class. The tag changes over `--m-confirm`. No travel. Allowed on
  STRICT.
- **Sound.** Today: `points`, the switch sound. Proposed: a separate short `confirm` sound, or
  none (pick P9).
- **Reduced motion.** The tag and the words change at once.
- **Risk.** The tag today is 10 px type on the canvas (`render.js:147`), about 2.6 px at phone
  size. The same sound as a switch throw blurs two actions.
- Check: corrected (the banner statement changed: on job p0-1 the secure ends the job, and the win
  text shows (F14). The other facts are confirmed: one paint, `points`, 10 px type that draws at
  2.6 CSS px at 390. A brake mark waits for S7.)

### 7.9 Refusal

- **Today.** `yardSim.js:386-388`, `:644-655`. No motion. No paint. The banner turns to the "bad"
  tone with the reason and a "Look it up →" button. The engine does not move.
- **Purpose.** It tells the learner that nothing moved, why, and where to read more.
- **Static form.** The banner words (they come from `model.js` and are frozen). A mark by shape
  and glyph at the place of the problem: the switch or the foul mark. The look-up control.
- **Motion form.** Confirm class. The mark and the banner edge change over `--m-confirm`. No
  shake. No flash.
- **Sound.** Today: `refuse` (sawtooth 140 Hz, 180 ms). Proposed: the same.
- **Reduced motion.** The banner and the mark show at once.
- **Risk.** A shake or a red flash punishes the learner and can cause discomfort. The refusal
  text must go away when it is no longer true (F8).
- Check: confirmed (scenario A: 0 paints, `refuse`, the "bad" tone, the look-up button. Fence: the
  refusal texts stay as `model.js` has them. The removal of a stale refusal is pick P16.)

### 7.10 Counter change (moves and joints)

- **Today.** `yardSim.js:432`. The readout text changes at the end of the move. It shows totals:
  "Moves 2 / par 5 · Joints 1".
- **Purpose.** It tells the learner what the move cost.
- **Static form.** The totals, and the change from the last move in words.
- **Motion form.** Confirm class. The figure's surface changes over `--m-confirm`. No ticking
  count.
- **Sound.** None today. None proposed.
- **Reduced motion.** The numbers change at once.
- **Risk.** With no change shown, a spot that costs 2 looks the same as a spot that costs 1 (F7).
- Check: confirmed (the readout text is measured. The change in words is pick P12.)

### 7.11 Built but loose notice

- **Today.** `yardSim.js:441-447`. After the move that completes the build, the banner turns to
  the "bad" tone and names the track that stands loose. No sound of its own.
- **Purpose.** It tells the learner that the build is right and one step is left.
- **Static form.** The banner words (present today). The LOOSE tag on the goal track. The Secure
  action stays in reach.
- **Motion form.** Confirm class, as 7.9, without the refusal mark.
- **Sound.** None proposed. This is not a refusal.
- **Reduced motion.** At once.
- **Risk.** The tone of a mistake for work that is right.
- Check: confirmed (scenario A: the "bad" tone, and only the `roll` of the spot. The sheet proposes
  no change of tone.)

### 7.12 Arrival of the inbound cut

- **Today.** `yardSim.js:270-282`, `render.js:55-64`. One job has it: p6-road. It starts by itself
  on load and on Reset. Phase 1, 2200 ms nominal: a train of an engine and 13 cars runs 1515 units
  from the main line down the ladder to the lead. Measured total with 7.13 and 7.14: 5079 ms. No
  words, no sound, no skip. The controls are locked (F4, F9).
- **Purpose.** It tells the learner where the cars on AS73 came from, and that this job builds an
  outbound train.
- **Static form.** The yard as it is after the set-out. The work order says it in words: the
  job hint has the sentence today (`puzzles.js:372`). The text mirror lists the cars on AS73.
- **Motion form.** Travel class. On request only, from a control in the work order (pick P5). One
  ride of `--m-ride`, `linear`, for the three phases, shared by distance. Any input ends it. On
  STRICT: no motion, the static form only.
- **Sound.** None today. None proposed.
- **Reduced motion.** It does not play. The control to show it is not offered, or it shows the
  static form.
- **Risk.** It is decoration (section 5, source 2). It starts by itself and runs longer than five
  seconds (source 9). It repeats on each Reset. It locks the job.
- Check: confirmed (13 cars, 1515 units, 5057 ms in this pass. One addition: `--m-ride` is 6000 ms,
  so the proposed ride is longer than the arrival of today. It is on request, so the five-second
  note of source 9 does not apply to it. Pick P5.)

### 7.13 Set-out

- **Today.** `yardSim.js:278`, `render.js:66-78`. Phase 2 of the arrival, 1100 ms nominal. The two
  cars slide alone along AS73 to the deep end. The AS73 switch shows normal (F9).
- **Purpose.** It tells the learner which cars the inbound train left, and on which track.
- **Static form.** The two cars stand on AS73 with their numbers. The words in the work order
  name them.
- **Motion form.** None proposed until the SME confirms what a set-out looks like (S5). Until
  then the cars stand on AS73 from the start of the arrival.
- **Sound.** None.
- **Reduced motion.** The static form.
- **Risk.** The picture of today shows cars that move with no engine through a switch lined
  against them. That is the opposite of the lesson of the game.
- Check: confirmed (the pictures of F9. The two cars also jump from the lead to AS73 in one frame.
  S5.)

### 7.14 Departure of the inbound train

- **Today.** `yardSim.js:279`. Phase 3 of the arrival, 1700 ms nominal, 530 units. The train
  leaves off the left end of the lead.
- **Purpose.** It tells the learner that the inbound train is gone and the lead is free.
- **Static form.** The lead is empty except for the learner's engine.
- **Motion form.** Part of the ride in 7.12.
- **Sound.** None.
- **Reduced motion.** The static form.
- **Risk.** The learner's engine is not drawn during the arrival (`render.js:42-45`) and appears
  at the end. An engine that appears from nothing is a jump.
- Check: confirmed (530 units by the geometry. `render.js:42-45` read.)

### 7.15 Outbound built, Depart enabled

- **Today.** `yardSim.js:436-438`. The Depart button changes from disabled (opacity 0.4) to
  enabled. The banner reads "✓ Outbound built in order — call Depart ▸ to leave."
- **Purpose.** It tells the learner that the build is right and names the next call.
- **Static form.** The banner words. The enabled button with its label.
- **Motion form.** Confirm class. The button edge changes over `--m-confirm`.
- **Sound.** None of its own. None proposed.
- **Reduced motion.** At once.
- **Risk.** A change of opacity alone is a weak sign. The banner words carry it.
- Check: confirmed (the banner text is measured. The opacity is at `yardSim.js:107`.)

### 7.16 Departure of the learner's train

- **Today.** `yardSim.js:508-524`. The win registers at the press. The train leaves off the left
  edge in 1300 ms nominal, measured 1317 ms. Then the train is drawn on the lead again (F6).
- **Purpose.** It tells the learner that the train left with the right cars, and the job is done.
- **Static form.** The lead is empty. The banner gives the result. The Depart button is disabled.
  The text mirror says the train departed with its cars in order. The drawing does not show the
  consist at rest after the departure.
- **Motion form.** Travel class. One leg off the frame: 2 × `--m-enter`, `--ease`.
- **Sound.** Today: `win` at the press. Proposed: `win`, one time, at the press.
- **Reduced motion.** One paint: the empty lead and the words.
- **Risk.** Today the end picture says the train is still there while the words say it left.
- Check: corrected (the facts of today are confirmed: 1317 ms, the win at the press, the train
  drawn again. The proposed empty lead had no pick. Pick P14 is added. The text did not change.)

### 7.17 The win

- **Today.** `yardSim.js:497-504`. No motion. The banner turns to the "win" tone with a check
  glyph and the grade. The picker gains a check mark for the job (`yardSim.js:465`).
- **Purpose.** It tells the learner that the job is done, how the line compares with par, and
  whether it is a new best.
- **Static form.** The banner words with the glyph. The picker mark. The readout.
- **Motion form.** Confirm class. The banner edge changes over `--m-confirm` and stays. No burst.
- **Sound.** Today: `win` (four triangle notes, 523, 659, 784 and 1047 Hz, 490 ms in all).
  Proposed: the same, for a line the learner played. Not for a watched line.
- **Reduced motion.** At once.
- **Risk.** A reward effect larger than the result. A win effect for a line the learner watched.
- Check: confirmed (scenario A: the four notes start 9, 92, 181 and 271 ms after the paint of the
  last move. By `sound.js:35` the last note ends 490 ms after the first one starts.)

### 7.18 The watched optimal line

- **Today.** `yardSim.js:401-429`. It resets the job, lines each switch for the learner, and plays
  each move at 1.7 times the normal duration, with pauses of 520 ms and 320 ms. Measured for
  p0-1: 11.0 s. Pull 2572 ms, spot 2074 ms. One banner text for all the engine moves. No stop. It
  ends with the win banner, the win sound and the done mark (F10).
- **Purpose.** It shows the learner one line that reaches par: which call, in which order, with
  which switch.
- **Static form.** A numbered list of the steps of the line, from `puzzle.opt`. A stepper: Next
  and Back. Each step shows its end state, its trace and its words. The words say that this is a
  demonstration and not the learner's run.
- **Motion form.** Travel class. On Next, the step plays with the durations of a normal move. No
  slow motion: the learner sets the pace. "Play all" runs the steps in turn and has a Stop.
- **Sound.** The sound of each move. No `win` at the end.
- **Reduced motion.** The stepper only. Each Next shows the end state of the step at once.
- **Risk.** It replaces the learner's work without a question (today). A long film with no stop
  (up to 32 s, or 90 s with the reduce setting). A done mark for a job the learner did not do.
- Check: confirmed (this pass: 11022 ms. Pull 2574 to 2581 ms, spot 2074 ms. One banner text until
  10.4 s. Pick P8.)

### 7.19 Switch list: flag a line

- **Today.** `yardSim.js:577-579`. A click on a line changes its glyph from a box to a flag and
  its surface. The DOM re-renders.
- **Purpose.** It tells the learner which lines are marked as wrong.
- **Static form.** The glyph and the surface (present today), and a pressed state for the access
  layer.
- **Motion form.** Confirm class, `--m-confirm`.
- **Sound.** Today: `points`. Proposed: `confirm` or none (P9).
- **Reduced motion.** At once.
- **Risk.** The switch sound for an action on paper.
- Check: confirmed (scenario K. One addition: the first press makes no sound, see section 5, row
  15.)

### 7.20 Switch list: certify

- **Today.** `yardSim.js:583-607`. Right: the banner turns to "win" with "✓ Order verified — now
  work the real cars onto AS73." Wrong: the banner turns to "bad" with the reason.
- **Purpose.** It tells the learner whether the check of the list is right, and if not, which
  line to read again.
- **Static form.** The banner words. The verified work order (`yardSim.js:609-618`).
- **Motion form.** Confirm class.
- **Sound.** Today: `couple` for right, `refuse` for wrong. Proposed: `confirm` or none for
  right, `refuse` for wrong.
- **Reduced motion.** At once.
- **Risk.** A coupling sound when nothing coupled.
- Check: confirmed (scenario K: the two banner texts, `couple` for right, `refuse` for wrong.)

### 7.21 Load a job, Reset

- **Today.** `yardSim.js:251-262`, `:306`. Instant. The banner clears. On p6-road the arrival
  starts again.
- **Purpose.** It tells the learner that the job is at its start state.
- **Static form.** The start state, the work order, the readout at zero.
- **Motion form.** None.
- **Sound.** None.
- **Reduced motion.** The same.
- **Risk.** Reset is ignored during a move with no sign (F4).
- Check: confirmed (lines read. After Reset on p6-road the arrival ran again for 5067 ms.)

### 7.22 Mute

- **Today.** `yardSim.js:307`, `:715-716`. The glyph changes. See F12.
- **Purpose.** It tells the learner whether the Yard makes sound.
- **Static form.** A button with a word label and a pressed state, 44 px or more.
- **Motion form.** Confirm class.
- **Sound.** None. A short `points` when sound goes on is an option. Not proposed.
- **Reduced motion.** The same.
- **Risk.** A choice that does not hold (F12).
- Check: confirmed (F12. The word label and the pressed state are a control change: section 17.)

### 7.23 The lock during motion

- **Today.** F4. No sign. Up to 1.5 s for each move, up to 8.9 s with the reduce setting.
- **Purpose.** None for the learner.
- **Proposed.** Remove it (rule 3 in section 6, pick P11). If the owner keeps it: each locked
  control shows a disabled state, and the status words say that a move is running.
- **Risk.** A press that does nothing looks like a fault.
- Check: confirmed (F4. Pick P11.)

### 7.24 Still decoration

- **Today.** The halo on a reverse switch (`render.js:124-127`). The headlight dot
  (`render.js:161-162`). A border colour on hover (`yardSim.js:58`, `:83`, `:109`). A 1 px press
  shift on the Back button (`index.css:136-137`).
- **Purpose.** The halo carries the switch state today, which the fence does not allow as the
  only carrier. The others carry nothing.
- **Proposed.** The halo stays only as a still glow beside a word and a shape. Hover and press go
  to the Dusk button states (R3, Y3).
- **Risk.** None from motion. None of these moves.
- Check: confirmed (each cited line read. The press shift at `index.css:136-137` has no
  transition.)

---

## 8. The rule for reduced motion in the Yard

1. **Motion is off when the app setting is on, or when the operating system flag is on.** One of
   the two is enough (pick P3).
   - Check: confirmed (fence item 6. Pick P3, option (a).)
2. **The Yard reads the two at the time of each effect.** It does not keep a copy from the mount.
   It listens for the `change` event of the media query. A change in Settings acts on the next
   effect.
   - Check: confirmed (the controller can do it with no new bridge: F2.)
3. **Off means stop.** The drawing goes from the start state to the end state in one paint. No
   frame shows a part-way position. No speed factor is used for reduced motion. "Faster" is not
   an option, and "slower" is the defect of today.
   - Check: confirmed (fence item 6 says "stops every effect".)
4. **Nothing goes blank.** Each effect has its end state, its trace and its words (section 7).
   - Check: confirmed (fence item 6.)
5. **No timed wait.** The pauses of the demo (520 ms, 420 ms, 320 ms) do not run. The demo is a
   stepper.
   - Check: confirmed (the three pauses are at `yardSim.js:414`, `:417` and `:421`.)
6. **Nothing starts by itself and nothing locks a control.** The arrival does not play.
   - Check: confirmed (picks P5 and P11.)
7. **Confirm effects also stop.** As in Dusk, the transition is cut and the new state is there.
   Each state stays distinguishable with no movement.
   - Check: confirmed (the Dusk Tier 1 block does the same: 4.3.)
8. **Sound does not depend on motion.** If sound is on, the sound of an effect plays when its end
   state shows.
   - Check: confirmed (today the sound waits for the slow motion: F1.)
9. **The four reading modes together.** The trace and the marks use shape and words, so they hold
   in high contrast. The words are DOM text, so they follow the type and scale settings.
   - Check: not verified (no build exists. The four modes were not tested together.)

**Pass check.** With the app setting on, and again with the flag on and the setting off: each
move makes one paint, and the time from the first paint to the last is 0 ms. The hook of section
2 measures this. Today the result is 538 paints over 8950 ms.

Check: confirmed (this pass: 539 paints over 8950 ms today.)

---

## 9. How a learner replays a move without motion

1. **The move log.** A numbered text list of the moves of this run. Each line: the call, the
   result, the cost. It is always there, with motion on or off. It is the static form of the
   whole run.
   - Check: confirmed (the texts of the log exist today in `state.msg`. The log is a new part: pick
     P10.)
2. **The trace.** It shows the route of the last move until the next action.
   - Check: corrected (the trace had no pick. Pick P15 is added. The text did not change.)
3. **Before and after.** A control on the last line of the log changes the drawing between the
   state before the move and the state after it. Each press is one still picture. The learner
   sets the pace. It changes no game state.
   - Check: confirmed (the controller can copy the state. `model.js` is not edited. Not built.)
4. **Review my line.** The same stepper as the watched line (7.18), over the moves of the
   learner.
   - Check: confirmed (picks P8 and P10. Not built.)
5. **With motion on:** "Play again" on a log line plays that move one more time and changes no
   game state. The Dusk traveller sets the precedent: one pass, then a replay on a press
   (`/home/user/dusk/preview/cards/living.html:83`).
   - Check: confirmed (`/home/user/dusk/preview/cards/living.html:83` reads "Replay on a press".
     The same line reads "One pass on load": the Dusk part starts by itself. Rule 2 of section 6 is
     stricter than Dusk.)

The controller keeps a copy of the state before each move. `model.js` does not change. These are
new controls. They need the owner's yes (pick P10).

Check: confirmed (no frozen file. Pick P10.)

---

## 10. What the access layer announces

One polite status region for results. One assertive region for refusals
(`REVAMP-DESIGN.md:123`). The announcement is the change. The text mirror is the whole state.
Focus does not move.

Check: confirmed (`REVAMP-DESIGN.md:123` read. No region exists today: F13.)

The examples use words that are in the app today. A new sentence is copy for the lead to write.
Where a sentence touches a rule, the SME checks it. This sheet proposes no rule wording.

| Effect | Region | The announcement says | Words that exist today | Text mirror lines that change |
|---|---|---|---|---|
| Switch throw | polite | The switch, its new position, the track the lead now reaches | none. New copy | that switch; the route line |
| Pull | polite | The call and result; the cost; the cut the engine now holds | "Pulled 3 from AS73." (`model.js:140`), the readout (`yardSim.js:432`) | that track; the engine line; the counters |
| Couple and stretch | — | Part of the pull announcement. No second message | none | the Joints counter |
| Spot | polite | The call and result; whether the cars joined a cut or stand apart; the cost; where the engine is | "Spotted 6 to AS75." (`model.js:157`) | that track with its tag; the engine line; the counters |
| Uncouple | — | Part of the spot or kick announcement | none | the engine line |
| Kick | polite | The call and result; that the cars rolled in alone; the cost; that Joints did not change | "Kicked 2 to AS73." (`model.js:199`) | that track; the engine line; the counters |
| Secure | polite | The track and its new state | "Hand brakes applied — AS75 is tied down." (`model.js:223`) | that track's tag |
| Refusal | assertive | The full refusal text; that nothing moved; the look-up control is next in the tab order | each refusal text in `model.js:69-215` and `yardSim.js:386` | none |
| Built but loose | polite | The full notice | the text at `yardSim.js:446` | none |
| Counter change | — | Part of the move announcement. Not a second message | the readout | the counters |
| Arrival, set-out | polite, one time on load | Which cars stand on which track from the inbound train | the job hint (`puzzles.js:372`) | none. The mirror already shows the state |
| Outbound built | polite | The banner text; Depart is now available | "✓ Outbound built in order — call Depart ▸ to leave." (`yardSim.js:438`) | the Depart state |
| Departure | polite | The banner text | "✓ Departed out the lead — …" (`yardSim.js:514`) | the engine line: departed |
| Win | polite | The banner text | the text built at `yardSim.js:502` | the job's done mark |
| Watched line | polite | At the start: this is a demonstration. For each step: step number of the total, the call, the result. At the end: the demonstration is over. No win words | "▶ Watching the optimal line — par 5 moves" (`yardSim.js:411`) | the whole mirror follows each step |
| Flag a line | none, the control state | The pressed state of the line | the line text | none |
| Certify | polite for right, assertive for wrong | The banner text | `yardSim.js:590`, `:606` | the work order |
| Load a job, Reset | polite | The job title and that it is at its start | the work order text | the whole mirror |
| Mute | none, the control state | The pressed state of the button | none | none |
| A move in progress | — | Nothing. The result is announced at the start of the effect (rule 4, section 6) | — | — |

Check: corrected (each cited line is read and right. Three limits are added. (1) By F14 the texts
"Spotted …", "Kicked …" and "Hand brakes applied …" do not show today when the move ends the job or
the build. The access layer must send the two parts as one message. (2) The new sentences for a
kick, "rolled in alone" and "Joints did not change", touch practice. They wait for S1. (3) The row
"A move in progress" depends on pick P11. The table did not change.)

A screen reader was not used in this session. The table is a design, **not verified** with a
screen reader.

Check: not verified (this pass used no screen reader either.)

---

## 11. Sound

### 11.1 The five sounds of today (`sound.js:29-35`)

| Name | Wave, frequency, length, gain | Plays today for | Proposed meaning (one only) |
|---|---|---|---|
| `points` | square, 880 Hz, 50 ms, 0.08 | a switch throw (`yardSim.js:295`); secure (`:390`); flag a line (`:578`); each auto-line in the demo (`:414`) | a switch changes position |
| `couple` | triangle 150 Hz 120 ms 0.25, with sine 90 Hz 180 ms 0.2 | a pull; a spot onto a track that holds a car, with or without a gap (`:346-348`); certify right (`:588`) | cars couple, and the drawing shows contact |
| `roll` | sawtooth, 320 Hz, 250 ms, 0.05 | a kick; a spot onto an empty track (`:348`) | cars roll with no engine (a kick) |
| `refuse` | sawtooth, 140 Hz, 180 ms, 0.12 | a refusal (`:388`); a move before the list is certified (`:386`); certify wrong (`:593`) | the call is refused |
| `win` | four triangle notes, 523 to 1047 Hz, 90 ms apart, 220 ms each, 0.18 | a win (`:500`); Depart (`:512`); the end of the demo | the learner completed the job |

Check: confirmed (each wave, frequency, length and gain read at `sound.js:29-35`. Each use is
measured again in scenarios A, B, C, D and K.)

The gains differ by a factor of 5 (0.05 to 0.25). No one listened to the sounds in this session.
Their loudness and their fit are **not verified**.

Check: not verified (no one listened in this pass either. The factor is confirmed: 0.25 / 0.05 =
5.)

### 11.2 Proposed rules

1. **Off by default** (pick P2). Today the default is off, because "Read aloud" is off by default.
   - Check: confirmed (F12. Pick P2.)
2. **Its own switch.** The Yard sound does not depend on "Read aloud". Speech and effects are two
   things (section 5, source 13).
   - Check: confirmed ("Read aloud" reads nothing aloud in the Yard today: F12.)
3. **The choice holds.** The mute state is saved and is not changed at mount.
   - Check: confirmed (the defect is at `yardSim.js:715`. No frozen file.)
4. **The button** has a word label, a pressed state, and a size of 44 px or more.
   - Check: confirmed (fence item 8 asks for 44 px. The word label is new copy: section 17.)
5. **One sound, one meaning** (the last column of 11.1).
   - Check: corrected (the change for a spot needs pick P13, which is added. The text of the rule
     did not change.)
6. **A sound follows a learner action.** Nothing sounds on load.
   - Check: confirmed (true today by the code: F12.)
7. **A sound sits on its event.** `couple` at the contact. `roll` at the release. `win` at the
   result.
   - Check: confirmed (today: `couple` at 617 ms, `win` at 3 ms. The `roll` at a release point
     waits for S1.)
8. **Each sound has a visual twin and words.** Sound is never the only carrier.
   - Check: confirmed (fence item 5.)
9. **A sixth sound, `confirm`,** for an action of the conductor that moves no equipment: secure,
   flag a line, certify right (pick P9). It is one new line in `sound.js`. That file is not
   frozen.
   - Check: corrected (`sound.js` is not in the frozen list of plan section 4: confirmed. One limit
     is added: no Wave 2 job has `sound.js` in its Files line (plan section 6). The lead must give
     the file to one job before a sound changes. The text of the rule did not change.)
10. **Reduced motion does not mute.** The two settings are separate.
    - Check: confirmed (the two settings are two keys today: `reduce` and `audio`,
      `AppContext.tsx:12`.)

---

## 12. Open picks for the owner

Each pick lists the recommended option first, with a reason for each option.

**P1. The page-law tier (HIGH).**
- (a) STRICT, with one written exception: the Yard drawing may show equipment travel after a
  learner action. Reason: the shell stays still, which fits a study tool and the default of
  today. The travel is content, and it is the one place where motion teaches.
- (b) OPEN, with `data-ambient="off"` and no entrance used. Reason: travel is inside the law as a
  Tier 2 class effect, with no local exception. It also opens the door to entrances and to the
  drift later.
- (c) STRICT with no exception. Reason: the least motion and the least work. Each move is a state
  change with a 160 ms confirmation and a trace. The kick loses its roll.
- Check: corrected (one limit is added for option (a). `dusk.tokens.css:407-408` says that a STRICT
  page reads only the Tier 1 tokens. Under (a) the written exception must cover the read of
  `--m-enter` and `--m-ride` also, or the travel durations are own values in the bridge file, as in
  option (c) of P4. The plan sets the tier line at Gate A (plan lines 108-109). The options did not
  change.)

**P2. Sound (MEDIUM).**
- (a) Off by default, with its own switch that holds. Reason: a learner in a shared room is not
  surprised, and a choice is kept.
- (b) On by default. Reason: confirmation by sound from the first move. Risk: sound that a
  learner did not ask for.
- (c) As today: tied to "Read aloud", and reset at each visit. Reason: no change. The defect F12
  stays.
- Check: confirmed (F12, run again. The word label and the pressed state of the button are a
  control change. They need the owner's yes with this pick.)

**P3. What turns motion off (HIGH).**
- (a) The app setting or the system flag, each one alone, read live. Reason: the safest. A
  learner who set the flag never sees motion.
- (b) The app setting only, which starts from the flag on the first visit (today), but read live.
  Reason: one control. A learner who sets the flag later still sees motion.
- (c) Withdrawn in the check pass. See section 18, W3.
- Check: corrected (option (c) is withdrawn: see W3. One limit is added for option (b): a learner
  who sets the system flag after the first visit still sees motion. That is weak against fence item
  6.)

**P4. The duration of a travel leg (MEDIUM).** Dusk has no token between 420 ms and 6000 ms.
- (a) Run in 840 ms (2 × `--m-enter`), run out 420 ms, as named aliases in the bridge file.
  Reason: the informative leg is readable. A pull takes 1580 ms, 100 ms more than the 1480 ms
  of today.
- (b) 420 ms for each leg. Reason: one token, no multiple. A travel of up to 768 px in 420 ms is
  hard to follow.
- (c) Keep 600 ms. Reason: no change. It needs a new token in the Dusk repository, because the
  copy is locked, or a raw duration in the bridge file. Dusk does not allow a raw duration in its
  own layers (`/home/user/dusk/DECISIONS.md:32`). The fence of this plan names raw colour only.
No learner test was run. The choice is **not verified** with learners.

Check: corrected (option (a) said "the same pace as today". A pull is 100 ms longer: 1580 ms
against 1480 ms nominal. The alias must not be a bare `calc()` (4.4).
`/home/user/dusk/DECISIONS.md:32` and fence item 4 are read and right. No learner test in this pass
either.)

**P5. The arrival (MEDIUM).**
- (a) On request only, from the work order. Reason: nothing starts by itself, nothing locks, and
  the work order already says it in words.
- (b) Automatic one time for each visit, with a Skip, never on Reset. Reason: it keeps the scene.
  It still starts by itself.
- (c) Remove it. Reason: it is decoration, and its set-out picture is in doubt (S5).
- Check: confirmed (F9. Each option leaves `puzzles.js` as it is: the routine is in `yardSim.js`.)

**P6. Where the engine rests after a spot (HIGH, after the SME answers S4).**
- (a) Where the model has it: in the track, with the pull-out drawn at the start of the next
  move. Reason: the picture then explains the cost of the next move.
- (b) On the lead, as today, with the cost of each move in words. Reason: the look does not
  change. The picture and the count stay apart.
- Check: corrected (one limit is added for option (a). The model holds no engine position. It holds
  "in" or "out" only (`model.js:58`). The drawing must derive the place from the spotted cars. A
  new question is added to S4. The options did not change.)

**P7. The picture of a kick (HIGH, after the SME answers S1).**
- (a) The engine stops and the cars roll in alone. Reason: it is what the words on the page say.
- (b) As today. Reason: no change. A kick stays the same picture as a spot.
- Check: confirmed (F5. The picture waits for S1.)

**P8. The watched optimal line (MEDIUM).**
- (a) A stepper with Next, Back, "Play all" and Stop. It asks before it replaces the learner's
  work. It gives no done mark and no win sound. Reason: the learner sets the pace, and a watched
  line is not a win.
- (b) The film of today with a Stop added. Reason: less work.
- (c) As today. Reason: no change. F10 stays.
- Check: confirmed (F10. `recordWin` is in `yardSim.js`, which is not frozen. The loss of the done
  mark is a behaviour change: the owner's yes comes with this pick.)

**P9. The sound for secure, flag and certify (LOW).**
- (a) One new `confirm` sound. Reason: one sound, one meaning.
- (b) No sound for these. Reason: no new sound. The words carry them.
- (c) As today. Reason: no change. The switch sound and the coupling sound keep two meanings.
- Check: corrected (one limit is added: `sound.js` has no owner job in Wave 2. See 11.2, rule 9.
  The options did not change.)

**P10. Replay controls (MEDIUM).**
- (a) The move log, before and after, and "Play again". Reason: a learner can study a move with
  motion off.
- (b) The move log only. Reason: the least new surface.
- (c) None. Reason: no change. A move that the learner missed is gone.
- Check: confirmed (no frozen file. Not built.)

**P11. Controls during motion (HIGH).**
- (a) A new input ends the running effect and runs. Reason: nothing locks, and a fast learner is
  not slowed. Risk: a double press then makes two moves. Today the lock stops the second press.
- (b) Keep the lock, with a disabled state and status words. Reason: simpler to build.
- Check: corrected (the risk of a double press is added to option (a). Rules 3 and 4 of section 6
  belong to this pick. The risk is reasoned from `yardSim.js:385`. It is not tested.)

**P12. The cost of a move in words (MEDIUM).** New copy, for example the change of the two
counters after each move.
- (a) Yes. Reason: the cost has a visible cause (F7).
- (b) No. Reason: no new words. The totals stay the only sign.
- Check: corrected (one limit is added. A pull after a spot adds 3, and the help text says that a
  pull is 2 (F7). The new words must name the pull-out that the model charges late. The lead writes
  the words and the SME checks them. The options did not change.)

**P13. The sound of a spot (LOW, after the SME answers S2).** Added in the check pass.
- (a) `couple` only when the drawing shows cars in contact. No sound for a spot onto an empty track
  or for a spot that leaves a gap. Reason: one sound, one meaning.
- (b) As today. Reason: no change. A coupling sound plays over a visible gap.
- Check: confirmed (7.4 proposed this change and no pick covered it. The facts are in F12.)

**P14. After Depart (MEDIUM).** Added in the check pass.
- (a) The lead shows empty, and the job is closed until Reset. Reason: the picture agrees with the
  words.
- (b) As today. Reason: no change. The train comes back, and the learner can work it again (F6).
- Check: confirmed (7.16 proposed the empty lead and no pick covered it. The controller can hold a
  "departed" flag. `model.js` is not edited.)

**P15. The trace of the last move (MEDIUM).** Added in the check pass.
- (a) Yes, in the new drawing. Reason: it is the static form of each travel effect.
- (b) No. Reason: the least new drawing. With motion off, the route of a move then shows nowhere.
- Check: confirmed (section 6 calls the trace the main new static device and no pick covered it.
  Its look is part of the Yard look, Gate A question 1.)

**P16. The banner after a switch throw (LOW).** Added in the check pass.
- (a) A throw clears a refusal that is no longer true. Reason: the banner does not teach a wrong
  state.
- (b) As today. Reason: no change. F8 stays.
- Check: confirmed (7.1 and 7.9 proposed this and no pick covered it. The change is in
  `yardSim.js`.)

---

## 13. Notes for the SME

This section holds each finding that touches rule content or what real practice looks like. It
proposes no wording.

- **S1. The picture of a kick.** The page says a kick is a shove and a cut away, and the cars
  coast in alone (`yardSim.js:195`). The drawing carries the cars in with the engine (F5). For a
  true picture the drawing needs: where the engine stops, where the cars separate, and what
  happens when the cars reach the standing cut. A comment in `model.js:79-80` says the kicked cars
  join the cut. The hint of job p2-kick says "a kick makes no coupling" (`puzzles.js:205`), and
  the model adds no joint (`model.js:196`). The two statements need one answer, because the sound
  and the mark at the end of the roll depend on it.
  - Check: confirmed (`yardSim.js:195`, `model.js:79-80`, `puzzles.js:205` and `model.js:196`
    read.)
- **S2. A spot that leaves a gap counts a joint.** The model leaves a gap of one car length
  between a spotted cut and a standing cut that is not the goal (`model.js:96-99`). It still adds
  one joint (`model.js:151`), and the Yard plays the coupling sound. Three optimal lines do this
  (F12). Is a joint right here?
  - Check: confirmed (`R7-check/myfacts.mjs`: p2-save, p2-types and p4-peel. Measured on p2-save:
    Joints 1 to 2, the coupling sound, and a gap in the picture.)
- **S3. The stretch after a coupling.** The drawing moves the engine 6 units toward the lead and
  back after each pull. A code comment at `yardSim.js:362` names a rule for it. A rule chip and
  the help text name the stretch (`puzzles.js:12`, `yardSim.js:207-208`). No words show at the
  time of the motion. Is the picture right, and does it need words at that time?
  - Check: corrected (the first text said that no words on the screen say what it is. See W1.)
- **S4. The engine after a spot.** The model keeps the engine in the track after a spot and
  charges the pull-out on the next move (`model.js:54-57`, `:156`). The drawing shows the engine
  go back to the lead at once. Which picture is true to practice? With
  the engine drawn in the track, the learner lines the next route while the engine stands beyond
  a switch. Does that picture need a step that the game does not have?
  - Check: corrected (one question is added in the check pass. `model.js:54-57` and `:156` are read
    and right.)
- **S5. The picture of a set-out.** In the arrival, the inbound train runs from the main line
  down the ladder to the lead and stops with its engine off the frame. Two cars then jump from the lead to AS73 in one frame and slide alone
  along AS73 while its switch shows normal. The train leaves off the end of the lead (F9). Is any
  part of this a true picture of a set-out?
  - Check: corrected (the jump of the two cars from the lead to AS73 is added: F9.)
- **S6. A speed label beside fast motion.** The canvas prints "15 MPH · REDUCED (CROR 105)"
  (`render.js:94`) while equipment crosses the yard in 0.6 s. The time is compressed. Does the
  label beside that motion mislead?
  - Check: confirmed (`render.js:94` read. The label shows in each picture of this pass.)
- **S7. Secure.** Today the only signs are the word TIED and one sentence (`model.js:223`). If the
  new drawing adds a brake mark, where does it go and on how many cars?
  - Check: confirmed (`model.js:223` and `render.js:144-147` read.)
- **S8. The demonstration lines the switches for the learner.** Before each move the demo sets the
  target switch reverse and each other switch normal (`yardSim.js:397`). It shows no step for
  that. It does the same before a SECURE step, which needs no route (`yardSim.js:414-417`). Does the demo then show a complete routine?
  - Check: corrected (one fact is added in the check pass: the demo lines a switch reverse before a
    SECURE step also. Measured in scenario D: the switch sound at 9760 ms, then the secure text.)
- **S9. Open fact T12 stays open.** The comment at `render.js:2` calls the reverse colour a rule
  convention. The throw has colour as its only carrier today (F8). The new static form uses a
  word and a shape, so the question of colour is no longer a carrier question.
  - Check: confirmed (`render.js:2` read.)
- **S10. The tag after a kick.** Added in the check pass. After a kick the model marks the whole
  cut as tied down (`model.js:197`), and the track tag reads TIED. The learner applied no hand
  brake to the kicked cars. A spot onto the same cut marks it loose (`model.js:155`). Is the tag
  after a kick right?
  - Check: confirmed (the two lines read. Picture `R7-check/X7-after-gap-spot.png`: AS73 reads TIED
    after the kick.)

---

## 14. Notes for other jobs

Found on the way. Not motion or sound in the narrow sense.

| For | Note | Where |
|---|---|---|
| Lead | Plan fact T4 needs a correction: "6 times slower". | F1 |
| R5, Y4 | The reduce setting is stale after mount, and the flag is not followed. | F2, F3 |
| R5, Y4 | No live region, no role, no canvas name in the Yard. | F13 |
| R5, Y3 | The mute button: 43 by 37 px, an emoji as its only content, no pressed state. | F12 |
| R4, U1 | A watched line marks the job done and plays the win. "Watch optimal" replaces the learner's work with no question. | F10 |
| R4, Y2 | The train is drawn again after Depart. | F6 |
| R4, Y3 | The banner keeps a refusal after the learner fixed its cause. | F8 |
| R6, Y1 | Dead code: the shove of a standing cut. | F11 |
| R6, Y1 | `anim.js:6` keeps the speed factor in a module variable. Each caller shares it. | `anim.js:6-7` |
| R6, Y1 | `sound.js:5` reads `localStorage` at import with no guard. If storage throws, the import fails. Tested in the check pass with a forced error for that key: the Yard does not mount. The key `sl_muted` does not use the `cb.` prefix of the app. | `sound.js:5`, `:10` |
| R3, S1 | The Dusk reduced-motion blocks follow the system flag only. The bridge must also apply them for `html[data-reduce="1"]`. | section 4.3 |
| Y2 | Read durations and distances from tokens at run time. Use CSS px for a nudge or a gap, so it shows at phone size. | section 4.4, 7.3 |
| Y2 | The kick animation calls `spotPlan` without the couple flag (`yardSim.js:328`), and the model calls it with the flag (`model.js:192`). No difference shows today: in each of the 7 jobs with a kickable track, that track is the goal track. | `yardSim.js:328` |
| D1 | `REVAMP-DESIGN.md:123`, `SPEC.md:186` and `Settings.tsx:9` state a reduced-motion behaviour that the Yard does not have. | F1 |
| Lead | Added in the check pass. `sound.js` is in no Files line of Wave 2. A change of the sound map needs an owner job. | plan section 6 |
| R6, Y1 | Added in the check pass. Leaving the Yard during a watched line throws `TypeError: Cannot set properties of null`. The loop writes to a page that is gone (`yardSim.js:420`). By reading, a move in flight does the same at `:432`. | measured, `R7-check/x8.mjs` |
| Lead | Added in the check pass. Plan fact T2: a 9 px car number draws at about 2.4 CSS px at 390 (9 × 0.263), not 2.6. The 10 px tag draws at 2.6. | section 7, `render.js:171` |
| R4, Y4 | Added in the check pass. The text of the last move does not show when the move ends the job. | F14 |
| R5, Y4 | Added in the check pass. "Read aloud" reads nothing aloud in the Yard. | F12 |

- Check: confirmed (row 1, T4. Plan line 71 read.)
- Check: confirmed (row 2. F2 and F3, run again.)
- Check: confirmed (row 3. F13, measured again.)
- Check: confirmed (row 4. 43.5 by 37 px.)
- Check: confirmed (row 5. F10, 3 runs.)
- Check: confirmed (row 6. F6.)
- Check: confirmed (row 7. F8.)
- Check: confirmed (row 8. F11.)
- Check: confirmed (row 9. `anim.js:6-7` read. `yardSim.js:256`, `:410` and `:424` set the factor.)
- Check: corrected (row 10. The first text said "not tested". This pass forced an error for the key
  `sl_muted`: the Yard does not mount, the host stays empty and the page logs `SecurityError`.
  Evidence: `R7-check/x9.mjs`. The key name is confirmed at `sound.js:5` and `:10`.)
- Check: confirmed (row 11. 4.3.)
- Check: corrected (row 12. A limit is added in 4.4: an alias made with `calc()` does not read as a
  time, and a value can read in `s`. The row did not change.)
- Check: corrected (row 13. The first text said "not checked". This pass checked the data: in each
  of the 7 jobs with a kickable track, that track is the goal track. By the code, a kickable track
  that is not the goal would show a jump of 42 units.)
- Check: confirmed (row 14. The three lines read.)
- Check: confirmed (rows 15 to 19, added in the check pass. The evidence is in each row.)

---

## 15. Not verified

1. The law text (the rules named SKIN and SAFE) was not readable. Section 4 reads the Dusk layers
   and records only. The classing of Yard travel as a Tier 2 class effect is a reading by this
   job.
   - Check: not verified (the same limit in this pass.)
2. Each research statement in section 5 is from a search summary. No page was opened.
   - Check: not verified (the same limit in this pass.)
3. No learner test was run. No duration proposal is tested with learners.
   - Check: not verified (the same limit in this pass.)
4. No one listened to the sounds. Only the oscillator calls were recorded.
   - Check: not verified (the same limit in this pass.)
5. No screen reader was used. Section 10 is a design.
   - Check: not verified (the same limit in this pass.)
6. All timing is from headless Chromium at 1440 by 900. Firefox, Safari, a phone and the Tauri
   desktop build were not measured. At 390 px only the canvas size was measured.
   - Check: not verified (this pass used the same browser. It measured the canvas and the mute
     button at 390 also.)
7. Resolved in the check pass. The kick with the reduce setting on runs 7250 ms (median of 3).
   - Check: corrected (the item was open. It is now measured: `R7-check/extra-X1.json`.)
8. The demo durations for jobs other than p0-1 are by formula. The formula is within 2 % of the
   measurement for p0-1.
   - Check: not verified (still by formula. `R7-check/myfacts.mjs` gives the same formula values.)
9. Resolved in the check pass. The CSS keyword `ease` gives the same positions as
   `cubic-bezier(0.25, 0.1, 0.25, 1)` in Chromium (4.4).
   - Check: corrected (the item was open. It is now measured: `R7-check/extra-X5.json`.)
10. Resolved in part in the check pass. A forced error for the key `sl_muted` stops the mount of
    the Yard. A real browser that blocks all storage was not tested.
    - Check: corrected (the item was open. It is now tested with a forced error:
      `R7-check/x9.mjs`.)
11. Whether audio starts on the first gesture in each browser is not checked. The measurement
    used a browser flag that allows audio without a gesture.
    - Check: not verified (this pass used the same browser flag.)
12. The purpose of each effect in section 7 is a statement of intent by this job. The code
    comments support it for the stretch (`yardSim.js:362-364`), the arrival (`yardSim.js:266-269`)
    and the departure (`yardSim.js:506-507`). The others are not stated in the code.
    - Check: not verified (the three comments are at the cited lines. The other purposes stay a
      statement of this job.)
13. Added in the check pass. The double press under option (a) of pick P11 is reasoned from the
    code. It is not tested.
    - Check: not verified (no build of option (a) exists.)
14. Added in the check pass. The load values of the first pass (0.3 and 2.5), and the list of files
    that the first pass read, cannot be shown again.
    - Check: not verified (history.)
15. Added in the check pass. The tables of 5.1 and 5.2 and rule 5 of section 6 are judgements of
    this job. No source and no learner test supports them directly.
    - Check: not verified (a judgement.)
16. Added in the check pass. Rule 9 of section 8 says that the four reading modes hold together. No
    build exists, so the four modes were not tested together.
    - Check: not verified (no build exists.)

---

## 16. Evidence

Scratch folder:
`/tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/R7/`

| File | Holds |
|---|---|
| `measure.mjs` | The measurement script: the paint hook, the sound hook, each scenario |
| `result-A.json`, `result-Areduce.json` | Switch throw, refusal, pull, spot, secure, win. Setting off and on |
| `result-B.json`, `B-kick-*.png` | The kick: timing, sounds, seven canvas pictures in flight |
| `result-C.json`, `result-Creduce.json`, `C-cine-*.png`, `Creduce-cine-*.png`, `C-after-depart.png` | The arrival and the departure: timing and pictures. Setting off and on |
| `result-D.json`, `result-Dreduce.json` | The watched optimal line: timing, sounds, banner changes, the profile after |
| `result-G.json` | The setting changed while the Yard is open |
| `result-H.json` | The mute default and its loss |
| `result-J.json` | The operating system flag |
| `result-K.json` | The switch list: flag and certify |
| `facts.mjs`, `facts2.mjs` | Read-only checks of `geometry.js`, `model.js`, `puzzles.js`: travel distances, `shove`, gap spots, move costs, demo durations |
| `dom.mjs` | Canvas size at 1440 and 390, live regions, CSS motion |

Check: confirmed (each file of the table exists in the folder `R7/`.)

Added in the check pass. The files of the check pass are in the scratch folder:
`/tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/R7-check/`

| File | Holds |
|---|---|
| `measure.mjs`, `result-*.json`, `log-*.txt`, `progress.txt` | The 11 scenarios of the first report, run again. `progress.txt` holds the load average after each one |
| `B-kick-*.png`, `C-cine-*.png`, `Creduce-cine-*.png`, `C-depart-*.png` | The pictures of the kick, the arrival and the departure, taken again |
| `myfacts.mjs` | A second script for the facts of `geometry.js`, `model.js` and `puzzles.js`: travel distances, `shove`, gap spots, move costs, demo durations, the positions of the inbound cars |
| `extra.mjs`, `extra-X1.json` to `extra-X7.json` | The kick with the reduce setting on (X1). The state of the controls during a move, the DOM facts and the sizes at 390 and 1440 (X2). Leaving during the watched line (X3). The first press on a list line (X4). The token reads and the `ease` curve (X5). The arrival, the departure and a move after Depart (X6). A kick that is not the last move, and the spot with a gap (X7) |
| `X6-after-depart-canvas.png`, `X6-after-depart-then-spot.png`, `X7-after-kick.png`, `X7-after-gap-spot.png` | The pictures for F6, F12, F14 and S10 |
| `x8.mjs`, `x9.mjs`, `x10.mjs`, `x11.mjs` | The error after leaving during the watched line. The forced storage error. The rule chips on the page. The mute state with "Read aloud" on |

---

## 17. Fence test of each proposal

Added in the check pass. Each proposal of this sheet is tested against plan section 4. The
questions are: does it edit a frozen file, does it write, correct or cite a rule, does it change a
behaviour, a word or a control, does it use a raw colour, and does it hand the owner a command.

| # | Proposal | Files it touches | Frozen file | Rule content | Behaviour, word or control | Route |
|---|---|---|---|---|---|---|
| 1 | Reduced motion stops each effect; the setting and the flag are read at the time of each effect (section 8) | Yard controller | no | no | yes. Fence item 6 asks for it | Y4 ("motion that stops"), pick P3 |
| 2 | A word and a shape at each switch; coupling, gap and refusal marks | new drawing | no | no. The words "normal", "reverse", "TIED" and "LOOSE" are in the app today | yes, new drawing. Fence item 5 asks for the word | The Yard look (Gate A, question 1), Y2 |
| 3 | A brake mark on a tied cut | new drawing | no | yes, practice | yes | SME note S7 first |
| 4 | The trace | new drawing | no | no | yes, new | pick P15 |
| 5 | The text mirror and the two live regions (section 10) | Yard controller, one new file | no | The new sentences that touch practice wait for S1 | yes, new words | Y4. The lead writes the words |
| 6 | Travel durations from Dusk tokens (rule 7 of section 6) | drawing code, the bridge file | no. The Dusk copy is read, not edited | no | yes, each duration changes | picks P1 and P4 |
| 7 | The picture of a kick with a roll | drawing code | no. `spotPlan` is read. The release point is a value of the new drawing, not of `geometry.js` | yes, practice | yes | pick P7, after S1 |
| 8 | The engine drawn where the model has it | drawing code | no. `state.out` is read | yes, practice | yes | pick P6, after S4 |
| 9 | An empty lead after Depart | controller, drawing code | no | no | yes | pick P14 |
| 10 | The arrival on request, or removed | controller | no. `puzzles.js` keeps `inbound` and the hint | yes for the set-out picture | yes | pick P5, SME note S5 |
| 11 | The watched line as a stepper, with no done mark and no win sound | controller | no | no | yes | pick P8 |
| 12 | No lock during motion; the result at the start of the effect | controller | no | no | yes | pick P11 |
| 13 | The cost of a move in words | controller | no | The words are checked by the SME | yes, new words | pick P12 |
| 14 | The move log, before and after, "Play again" | controller, one new part | no. The controller copies the state | no | yes, new controls | pick P10 |
| 15 | Sound with its own switch that holds; a word label, a pressed state and 44 px on the button | `sound.js`, controller, view | no | no | yes. Fence item 8 asks for 44 px | pick P2 |
| 16 | A `confirm` sound; `couple` for contact only | `sound.js`, controller | no. `sound.js` is not frozen, but no Wave 2 job owns it | The joint count waits for S2 | yes | picks P9 and P13 |
| 17 | A switch throw clears a stale refusal | controller | no | no | yes | pick P16 |
| 18 | The dead shove branch is not drawn again | `yardSim.js`, `render.js` | no. `shove: false` stays in `model.js` | no | no. The branch never runs | R6, Y1, Y2 |
| 19 | The system flag as the only switch for motion (P3, option c) | controller, Settings | no | no | yes, and it breaks fence item 7 | withdrawn, W3 |

- No proposal edits a frozen file.
- No proposal writes, corrects or cites a rule. The rule numbers in this report are inside quoted
  app text only (F8 and S6 quote the app). Each question about practice is in section 13.
- No proposal names a raw colour.
- No proposal hands the owner a command, a path or a step.
- Rows 1 to 17 change a behaviour, a word or a control. None of them is a reskin. A reskin job (S1,
  Y1, Y3) builds none of them. Each one needs the owner's yes through the pick or the gate question
  in its row.
- Check: confirmed (each row was tested against plan lines 39 to 62 in this pass. The files in the
  third column are read from the code of today. The file split of Y1 can change the file names.)

### 17.1 Not offered: needs a frozen file

This sheet offers no change for these items. Each one would need an edit of a frozen file.

- The joint that the model counts for a spot that leaves a gap (`model.js:151`). The question is in
  S2.
- The TIED state after a kick (`model.js:197`). The question is in S10.
- The words of each refusal and of each move result (`model.js:69-223`), and the hint that tells
  the arrival in words (`puzzles.js:372`).
- The lengths and clearances of the yard (`geometry.js`). The new drawing puts its own values, such
  as a release point, in its own files.
- The fields `shove` and `newStanding` that `spotPlan` returns and nothing uses (`model.js:102`).
- Check: confirmed (each cited line read.)

---

## 18. Withdrawn

Added in the check pass. This section holds each statement that the check pass refuted, with the
reason. The corrected text is at the place of the first statement.

- **W1. "No words name it" (7.3) and "No words on the screen say what it is" (S3), about the
  stretch after a coupling.** Reason: the rule chip "Couple, then stretch to verify the joint"
  shows on each of the 19 jobs (`puzzles.js:12`; each job lists `couple`), and the help text names
  the stretch (`yardSim.js:207-208`). What stays true: no words show at the time of the motion.
  - Check: refuted (`R7-check/myfacts.mjs`: 19 of 19 jobs list the chip. Measured on jobs p0-1,
    p2-kick and p6-road: the chip shows on the page, and the help block is closed at the start
    (`R7-check/x10.mjs`). The two lines read.)
- **W2. "The only differences between a kick and a spot onto the same cut today are the word
  "Kicked" in the banner and the sound" (F5).** Reason: the Joints counter and the track tag differ
  also, and on job p2-kick the word does not show. What stays true: during the motion, the sound is
  the only difference.
  - Check: refuted (measured on jobs p2-save and p2-kick: `R7-check/extra-X7.json`,
    `result-B.json`.)
- **W3. Option (c) of pick P3: "The system flag only."** Reason: the option takes the meaning from
  the app setting "Reduce motion". Fence item 7 says that the four reading modes survive, and
  reduced motion is one of them.
  - Check: refuted (against plan line 50.)
