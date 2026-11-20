# R7 — The Yard: motion and sound sheet

Wave 1 research. Read-only on code and content. Written 2026-11-20 on branch
`claude/peaceful-mayer-qat99l` at commit `1e48578`. Measured on the built app at
`http://127.0.0.1:4173/#/yard`.

Each statement is checked (file and line, a command, or a measurement) or it carries the words
"not verified". Section 15 lists every statement that is not verified.

This sheet proposes changes. It makes none. A reskin job (S1, Y1, Y3) keeps the behaviour of today.
The proposals are for Y2 (drawing), Y4 (access layer) and the upgrade list of the owner.

---

## 1. Summary

1. The Yard has 24 effects (section 7). Nine of them move, through three animation routines: a
   move, the arrival and the departure. The watched line plays the move routine again. The others
   are instant state changes.
2. **Fact T4 is wrong in direction.** With the app setting "Reduce motion" on, a Yard move is six
   times slower, not faster. A pull runs 8950 ms in place of 1534 ms (measured, section 3, F1).
3. The reduce setting is read one time, when the Yard mounts. A change in Settings while the Yard
   is open has no effect until the learner leaves and comes back (measured, F2).
4. The Yard does not follow the operating system flag after the first visit (measured, F3).
5. Three pictures do not agree with the words or with the model: the kick (F5), the departure
   (F6) and the engine position after a spot (F7).
6. A switch throw has colour as its only carrier, and the banner keeps a refusal text that is no
   longer true (F8).
7. A watched optimal line marks the job as done and plays the win sound (F10).
8. Sound is off by default. The default comes from the "Read aloud" setting. A learner who turns
   the sound on loses that choice at the next visit to the Yard (measured, F12).
9. Dusk gives three durations (160 ms, 420 ms, 6000 ms), two distances (2 px, 8 px) and one easing
   token. A STRICT page may animate state confirmation only. Travel along a track is a Tier 2 class
   effect. It needs OPEN, or a written exception (section 4).
10. The proposal: each effect has a static form that carries all the information (end state, a
    trace of the last move, words). Motion is short, starts only on a learner action, and never
    locks the controls. Reduced motion stops all of it.
11. Twelve picks are open for the owner (section 12). Nine notes are for the SME (section 13).

---

## 2. Method and limits

- **Code read:** `src/stations/yard/anim.js`, `sound.js`, `render.js`, `model.js`, `geometry.js`,
  `puzzles.js` (read-only), `src/stations/yardSim.js`, `src/stations/imperativeStation.ts`,
  `src/stations/Yard.tsx`, `src/stations/Settings.tsx`, `src/state/AppContext.tsx`, `src/index.css`.
- **Dusk read:** the six files in `src/styles/dusk/`, and `/home/user/dusk/ARCHITECTURE.md`,
  `DECISIONS.md`, `README.md`, `preview/cards/process.html`, `preview/cards/living.html`.
- **Measurement:** Playwright with headless Chromium, viewport 1440 by 900, service workers
  blocked. A hook on `CanvasRenderingContext2D.clearRect` records the time of each paint
  (`render()` calls it one time for each paint, `render.js:22`). The duration of an effect is the
  time from its first paint to its last paint. A hook on `OscillatorNode.start` records each sound.
  Each timing is the median of 3 runs, or more where the table says so.
- **Machine load:** other agents used the machine. The load average was 0.3 at the start and 2.5
  at one point. `anim.js:18` computes progress from the clock, so load changes the number of
  frames, not the duration. The runs agree within 46 ms (pull: 1507 to 1552 ms in 19 samples).
- **Single runs:** F2 and F3 are one run each. They test a yes or no behaviour, and the timing
  values in them agree with the medians of F1.
- **Frame slop:** a measured duration is the nominal duration plus about one frame (17 ms) for
  each phase, because each phase starts on the frame after the last one ends (`anim.js:21-25`).
- **Web research:** the search tool gave result summaries. The pages did not open from this
  session (`www.w3.org` and `gameaccessibilityguidelines.com` did not resolve). Each research
  statement in section 5 is from a search summary and is not verified against the page.
- **Scripts and pictures** are in the scratch folder (section 16). A cleanup can remove them.

---

## 3. What is true today

### F1. Reduced motion makes the Yard six times slower

- `yardSim.js:228-229`: `const fast = () => reduce ? 6 : 1;` with the comment "setSpeed(6) ≈
  instant".
- `anim.js:6`: "`>1 = slower`". `anim.js:17`: `dur = step.dur * speedFactor`. A factor of 6
  multiplies each duration by 6.
- `yardSim.js:410` proves the direction: the slow-motion demo uses `setSpeed(1.7)`.

| Effect | Nominal in code | Measured, setting off | Measured, setting on |
|---|---|---|---|
| Pull | 600 + 280 + 600 = 1480 ms | 1534 ms (median of 19, range 1507 to 1552) | 8950 ms (median of 12, range 8948 to 8973) |
| Spot | 600 + 600 = 1200 ms | 1217 ms (median of 3) | 7250 ms (median of 3) |
| Kick | 600 + 600 = 1200 ms | 1234 ms (median of 3) | not measured (formula: 7200 ms) |
| Arrival of the inbound cut | 2200 + 1100 + 1700 = 5000 ms, cap 5800 ms | 5079 ms (median of 3) | 5801 ms, then a jump cut (median of 3) |
| Departure | 1300 ms | 1317 ms (median of 3) | 7817 ms (median of 3) |
| Watched optimal line, job p0-1 (4 steps) | 10852 ms by formula | 11024 ms (median of 3) | 28921 ms (median of 3) |
| Switch throw, secure, refusal | 0 ms | 1 paint, 1 paint, 0 paints | the same |

- `REVAMP-DESIGN.md:123` says reduced motion "makes Yard animation instant". `Settings.tsx:9`
  labels the setting "No animations". `SPEC.md:186` says "all motion skipped/static". The three
  statements are false for the Yard today.
- The plan's T4 says "6 times faster". The part "read from the app setting" is true. The part
  "does not stop" is true. The direction is wrong.

### F2. The setting is read at mount and then it is stale

- `yardSim.js:228` reads `ctx.settings.reduce` one time into a constant.
- `imperativeStation.ts:42-50` mounts the station one time. Settings is a dialog over the Yard,
  so the Yard stays mounted.
- Measured: pull 1534 ms. The learner turns "Reduce motion" on in Settings
  (`html[data-reduce]` changes to `1`). The next pull runs 1552 ms. After the learner goes Home
  and comes back, the pull runs 8951 ms.

### F3. The Yard does not follow the operating system flag after the first visit

- `AppContext.tsx:12` reads the flag for the default. `AppContext.tsx:61` saves all settings on
  the first render. After that, the saved value wins (`AppContext.tsx:15`). No code listens for a
  change of the flag.
- Measured, first visit with the flag on: `data-reduce` is `1`. The flag goes off and the page
  reloads: `data-reduce` stays `1`.
- Measured, first visit with the flag off, then the flag goes on: `data-reduce` stays `0`, the
  pull runs 1518 ms. After a reload with the flag on: `data-reduce` is `0`, the pull runs 1534 ms.
- The CSS catch-all at `index.css:140-148` follows the flag live. It has no effect on a canvas.

### F4. Motion locks the controls and gives no sign

- During a move, `busy` is true. The canvas click, "Work it", "Watch optimal", "Depart" and
  "Reset" return with no effect (`yardSim.js:286`, `:385`, `:402`, `:509`, `:306`). No control
  shows a disabled state. No words say why.
- During the arrival, the canvas click and each move return with no effect (`yardSim.js:286`,
  `:385`). Measured: a switch click at 1000 ms into the arrival changes nothing and the banner is
  empty. "Reset" restarts the arrival. There is no skip.
- With the reduce setting on, the lock lasts 8.9 s for each pull (F1).

### F5. A kick is drawn as a spot

- `animateMove` has one path for spot and kick (`yardSim.js:325-332`). The engine carries the cut
  to its rest point in the track and comes back.
- Measured pictures at 450 ms and 590 ms into a kick on job p2-kick: the engine is inside AS73,
  past the foul mark, coupled to the two cars it kicks.
- The words on the page say a kick is "shove and cut away; the cars coast in on their own"
  (`yardSim.js:195`). The picture shows no roll.
- The only differences between a kick and a spot onto the same cut today are the word "Kicked"
  in the banner and the sound (`yardSim.js:348`). A spot onto an empty track plays the same sound
  as a kick.

### F6. After Depart, the train comes back

- `departOut` moves the train off the left edge in 1300 ms, then sets `anim = null` and paints
  (`yardSim.js:522-523`). `render.js:49` then draws the engine and its cut at rest on the lead,
  because `state.engine` still holds the cars.
- Measured picture, 600 ms after the departure ends: the banner reads "✓ Departed out the lead —
  Par! 4 moves — 2 couplings, clean" and the train stands on the lead with cars 401001, 401002
  and 401003.

### F7. The engine position after a spot does not agree with the model

- `model.js:156`: a spot sets `state.out = false`. The pull-out is charged on the next move as
  one extra move (`model.js:139`, `:156`, `:198`).
- The drawing shows the engine go back to the lead after each spot (`yardSim.js:373-378`), and the
  rest picture always puts the engine on the lead (`render.js:49`).
- Checked by a replay of job p1-dig: the first spot costs 1 move and the second spot costs 2. The
  two spots show the same animation. The readout shows totals only (`yardSim.js:432`). No words
  give the cost of a move.

### F8. A switch throw has colour only, and the banner goes stale

- `drawSwitch` fills a diamond with one of two colours and adds a halo for reverse
  (`render.js:112-128`). There is no word, no shape change and no text outside the canvas.
- The throw does not update the banner (`yardSim.js:295`). Measured: the learner gets the refusal
  "AS73 is lined normal — line its switch reverse for the track (CROR 104)." The learner lines
  AS73 reverse. The banner still shows that text.

### F9. The arrival shows cars that move alone through a switch lined against them

- Measured pictures of job p6-road. At 2100 ms the inbound train is on the lead and the foot of
  the ladder, and its engine is off the left edge. At 3000 ms cars 401002 and 401003 are on AS73 and slide to the deep
  end with no engine. The AS73 switch shows normal the whole time.
- `render.js:66-78` draws the slide. `yardSim.js:278` runs it for 1100 ms.
- The arrival starts by itself on each load and each Reset of that job (`yardSim.js:261`). It runs
  5079 ms (measured). It has no words and no sound.
- With the reduce setting on, the train moves slowly for 5.8 s and reaches only the top of the
  ladder. Then the picture jumps to the end state (measured picture at 5700 ms and 6000 ms).

### F10. A watched optimal line counts as done

- `recordWin` adds the job to `completed` before the `fromDemo` guard (`yardSim.js:463-466`). The
  guard covers the best record and the mastery write only (`:469`, `:484`).
- Measured on a fresh profile: after "Watch optimal" on p0-1 the picker changes from
  "→ Make up the cut · par 5" to "✓ Make up the cut · par 5". The stored profile holds
  `completed: ["p0-1"]`, `best: {}`.
- The demo ends with the win banner "✓ Par! 5 moves — 2 couplings, clean" and the win sound
  (measured).
- "Watch optimal" resets the job first and does not ask (`yardSim.js:403`).
- The banner shows one text for all the engine moves of the demo: "▶ Watching the optimal line —
  par 5 moves" (measured: from 0 ms to 10.3 s). No words name the step.
- There is no stop control. Only a change of job stops the demo (`yardSim.js:404`, `:413`).
- By formula (checked against the measurement of p0-1 within 2 %), the demo runs from 6.2 s
  (p2-kick) to 32.4 s (p1-sort). With the reduce setting on it runs from 17.8 s to 90.1 s.

### F11. One effect is dead code

- `spotPlan` returns the literal `shove: false` (`model.js:102`). A replay of all 19 optimal lines
  made 36 calls and none returned `shove: true`.
- The code that moves a standing cut (`yardSim.js:331`, `:337-339`, `:355-357`,
  `render.js:189-199`) never runs.

### F12. Sound: the default, the mute and the map

- Five sounds, each made of one to four oscillator tones (`sound.js:18-35`). No sound file.
- **Default.** `AppContext.tsx:12`: "Read aloud" is off by default. `yardSim.js:715`: if "Read
  aloud" is off and the Yard is not muted, the Yard mutes itself at mount. Measured on a first
  visit: the button shows the muted glyph and `sl_muted` is `1`. With "Read aloud" on, the Yard
  starts with sound on (measured).
- **The mute does not hold.** Measured: the learner turns sound on (`sl_muted` is `0`). After
  Home and back, the Yard is muted (`sl_muted` is `1`). After a reload it is muted.
- **The mute button.** Its name is the title "Sound". Its content is one emoji. It has no
  `aria-pressed`. It measures 43 by 37 px (measured at 1440).
- **One sound, many meanings.** See the table in section 11.
- **Sound against picture.** A spot onto a track that holds a cut plays the couple sound and adds
  a joint (`yardSim.js:346-348`, `model.js:151`), also when the model leaves a gap of one car
  length. Three spots in the optimal lines do this (p2-save, p2-types, p4-peel: gap 42 units,
  joint +1).
- The win sound plays at the press of Depart, before the train moves (measured: first note 3 to
  5 ms after the first frame).
- No sound plays without a learner action (measured: the arrival is silent).

### F13. No effect reaches a screen reader

- The Yard has no live region and no role (measured in the DOM: none; `#msg` has `class` and `id`
  only). The canvas has no name and no fallback text.
- No element in the Yard has a CSS transition or animation (measured: none).

---

## 4. What Dusk gives, and what the page-law tier allows

The law text itself (the rules named SKIN-04, SKIN-06, SAFE-04, SAFE-05) is not in a repository
this session can read. This section reads the Dusk layers and the Dusk records. The reading of
the law is **not verified** against the law text.

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

Dusk has no duration between 420 ms and 6000 ms. Dusk has no sound token. Dusk uses the keywords
`linear` (`dusk.motion.css:37`) and `ease-in-out` (`dusk.motion.css:50`) without a token.

### 4.2 The three tiers (`/home/user/dusk/ARCHITECTURE.md:69-94`)

| | STRICT (also: no `data-tier`) | OPEN |
|---|---|---|
| Tier 1, state confirmation: `transition` on `background-color` and `box-shadow`, the tile lift by `transform`, 160 ms | yes | yes |
| Tier 2, the entrance: `.dusk-enter` settles 8 px in 420 ms | no | yes |
| Tier 2, the traveller: one mark rides a track one time, on a press it rides again | no | yes |
| Tier 3, the ambient drift of the ground (`body::before` only) | off. Opt-in with `data-ambient="on"` | on. Off with `data-ambient="off"` |
| Reduced motion | each effect stops | each effect stops |

- **A STRICT page may animate:** a state change of a part, in place, in 160 ms (the lit edge, the
  wash, the 2 px lift). With an opt-in, the ground drift. Nothing else.
  `/home/user/dusk/DECISIONS.md:141` (W-026): "nothing else moves on STRICT".
- **A STRICT page may not animate:** an entrance, a ride along a track, or any keyframe on a part.
- **OPEN adds:** the entrance, the one-time ride with a replay on a press, and the ground drift by
  default.
- **On both tiers:** the motion layer writes `translate` only, never `transform`, `transition` or
  `opacity` (`dusk.motion.css:3-4`). A glow is a still shadow and never moves
  (`dusk.tokens.css:246-251`). "No text depends on JavaScript, canvas or a completed animation"
  (`ARCHITECTURE.md:189`). A glow is never the only carrier of a state (`ARCHITECTURE.md:194`).
- **Today:** Clear Board has no tier line (plan T8; no `data-tier` on `<html>`, measured). No line
  means STRICT.

### 4.3 The reduced-motion blocks in Dusk

- Tier 1 (`dusk.components.css:630-639`): `transition: none`, and the lift stops. The brighter
  edge and the wash stay, so each state still shows.
- Tiers 2 and 3 (`dusk.motion.css:62-78`): `animation: none` and `translate: none`. The part sits
  in its arrived position. "Nothing is left part-way".
- The traveller (`dusk.process.css:164-166`): hidden. The record gives the reason: a mark that
  cannot move would point at the wrong station (`/home/user/dusk/DECISIONS.md:170`, W-034). The
  ring on the current station stays as the static signal.
- The Dusk blocks follow the operating system flag only. Clear Board also has an app setting
  (`html[data-reduce]`). The bridge must make the Dusk parts obey the two. This is a note for R3
  and S1.

### 4.4 What this means for the Yard

The Yard drawing is page content, not a Dusk part. Dusk does not name it. The nearest part in
Dusk is the traveller: a mark that rides a track to show a process. Dusk puts that ride in
Tier 2, OPEN only, one pass, started by the page or a press, hidden under reduced motion.

By that precedent, this sheet puts each Yard effect in one of two classes.

| Class | Yard effects | STRICT | OPEN |
|---|---|---|---|
| **Confirm** (Tier 1 class): a state change in place, `--m-confirm`, `--ease` | switch throw, secure, refusal mark, counter change, banner tone, flag a line, certify, mute | allowed | allowed |
| **Travel** (Tier 2 class): equipment moves along a track | pull, couple and stretch, spot, uncouple gap, kick and roll, arrival, set-out, departure, the watched line | not allowed by a literal reading | allowed |

The owner picks the tier at the gate (pick P1, section 12). Each row of the sheet gives a static
form first, so each of the three options in P1 is buildable.

A drawing made with canvas or SVG can read a token at run time with
`getComputedStyle(document.documentElement).getPropertyValue('--m-enter')`. This is a note for Y2:
read durations and distances from tokens through the bridge file. Do not write a number in the
drawing code. The CSS keyword `ease` is `cubic-bezier(0.25, 0.1, 0.25, 1)` (CSS specification
value; not checked again in this session). `anim.js:4` uses a different curve today.

---

## 5. Research: what motion teaches, and what is noise

Each statement here is from a search summary. The pages did not open. **Not verified against the
page.** No source was found that studies motion in a switching game or a logistics game. The
application to the Yard is a judgement of this job, not a finding.

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
| 9 | WCAG 2.2.2 Pause, Stop, Hide (Level A). https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide | Motion that starts by itself and lasts more than five seconds needs a way to pause, stop or hide it. | The arrival starts by itself and runs 5079 ms (5801 ms with the reduce setting). It has no stop. |
| 10 | WCAG 2.3.3 Animation from Interactions (Level AAA). https://w3c.github.io/wcag/understanding/animation-from-interactions | Motion that an interaction starts can be turned off, unless it is essential. A user setting or the system flag is a sufficient way. | With a static form for each effect, no Yard motion is essential. All of it can stop. |
| 11 | WCAG 1.4.2 Audio Control (Level A). https://www.w3.org/WAI/WCAG21/Understanding/audio-control.html | Audio that plays by itself for more than 3 seconds needs a stop or its own volume control. | Each Yard sound is 0.5 s or less and follows a learner action. The criterion is not triggered. |
| 12 | WCAG 4.1.3 Status Messages (Level AA). https://www.w3.org/WAI/WCAG21/Understanding/status-messages | A status message must reach assistive technology without a move of focus. | The banner and the readout need a live region (F13). |
| 13 | Game Accessibility Guidelines, and Xbox Accessibility Guideline 105. https://gameaccessibilityguidelines.com/ and https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/105 | Basic level: no essential information by sound alone. Basic level: separate volume controls or mutes. Offer a way to pass a part that is not the core mechanic. | Each sound has a visual twin and words. The Yard sound has its own switch. The arrival has a skip or is on request. |
| 14 | Earcons and auditory icons. https://www.dcs.gla.ac.uk/~stephen/papers/CHI93.PDF and https://www.dcs.gla.ac.uk/~stephen/papers/ICAD2003_david.pdf | Sound added to a graphical interface cut task time and error recovery time. Sound does not replace the graphics. Sounds from the real world are easier to link to a command. Abstract tones interfere with one another. | Sound is a second channel for confirmation. One sound has one meaning. A coupling sound must mean a coupling. |
| 15 | Web Audio and the autoplay policy. https://developer.chrome.com/blog/web-audio-autoplay | An audio context made before a user gesture starts suspended. Resume it after the first click or tap. | `sound.js:13-16` does this. The flag-a-line click and the mute click do not call `resume()` (`yardSim.js:307`, `:577-579`). |
| 16 | The reduced-motion media query. https://web.dev/articles/prefers-reduced-motion | Read the query with `matchMedia`, and listen for its `change` event to follow the user. | The Yard rule in section 8 uses this. |
| 17 | Switching puzzles on a computer. https://www.wikiwand.com/en/articles/Inglenook_Sidings and https://ogrforum.com/topic/shunting-an-inglenook-shunt-puzzle-free-app-on-google-playstore | Computer versions of the classic shunting puzzles let the player click a car to couple or uncouple, click the points, and move forward or back. | The summary gives no data on motion or sound design. Not usable as evidence. |

### 5.1 What motion teaches in the Yard

| Motion teaches | Why a still picture is weaker | The static twin |
|---|---|---|
| **Cause and effect:** this call moved this cut along this route | A still shows the result, not the route | A trace of the last move on the track, and the words |
| **Order:** which car is at which end of the cut after a pull | The learner must work it out | The cut is drawn in order with its numbers. The text mirror lists the cars from the engine out |
| **Contact or gap:** a coupling, or a cut left apart | A small gap is hard to see at phone size | A coupling mark or a gap mark by shape, and the words |
| **Free roll or shove:** a kick against a spot | The two end states look the same | The trace is dashed where the cars rolled alone. The engine rests in a different place. The words |
| **Where the engine is** when the move ends | Needed to explain the cost of the next move | The engine is drawn where the model has it. The text mirror says it |

### 5.2 What is noise in the Yard

- Motion that starts by itself (the arrival).
- Motion that locks the controls (each move today).
- Slow motion of the whole demo. A learner needs control of the pace, not a slower film.
- A reward effect for a line the learner did not play (the win sound after the demo).
- A shake, a flash or a burst on a refusal or a win.
- A glow as the carrier of a state (the reverse switch today).
- A loop of any kind. A counter that ticks up.
- A sound that means two things.

---

## 6. Design rules for the Yard

These rules come from the fence (plan section 4), Dusk (section 4) and section 5.

1. **Static first.** After each effect, the screen shows the end state, a trace of the last move,
   and words. That form carries all the information. Motion adds nothing that the static form
   does not also say.
2. **The learner starts each motion.** Nothing moves on load.
3. **Motion never locks a control.** A new input ends the running effect at once: the drawing
   jumps to the end state, and the new input runs.
4. **The result does not wait for the motion.** The words, the counters and the announcement
   change at the start of the effect. `departOut` does this today (`yardSim.js:514`).
5. **One thing moves at a time.** The eye ends on the place of the next decision.
6. **The drawing shows what the model holds.** No picture of a leg that the model did not count.
7. **Token values only.** Confirm: `--m-confirm`, `--ease`. Travel in: 2 × `--m-enter`. Travel
   out: `--m-enter`. Nudge: `--enter-shift`. Long ride: `--m-ride`, `linear`. A travel distance
   comes from the drawing, as `--travel-y` does in Dusk. The multiples go in the bridge file as
   named aliases (pick P4).
8. **Reduced motion stops everything** (section 8).
9. **Sound confirms. It never carries.** One sound, one meaning. Each sound has a visual twin and
   words (section 11).
10. **Red is attention only.** A refusal may use it. A trace, a route and a state do not.

**The trace.** This is the main new static device. After a move, a thin line with an arrow head
follows the route of that move on the track. It is solid where the engine moved the cars. It is
dashed where cars rolled alone. It stays until the next action. Pattern and words carry it, not
colour. Its look belongs to R1 and Y2.

---

## 7. The sheet

Each block is one row of the sheet. The fields are the columns: today, purpose, static form,
motion form, sound, reduced motion, risk. Durations in "today" are measured unless the block says
"nominal". "Units" are canvas units of `geometry.js` (1340 wide). At 1440 px one unit is
0.658 CSS px. At 390 px one unit is 0.263 CSS px (measured).

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
  lit edge goes from `--neon-ctl` to the brighter edge and stays. No travel. Allowed on STRICT.
- **Sound.** Today: `points` (square, 880 Hz, 50 ms). Proposed: the same. This is its one meaning.
- **Reduced motion.** The new position shows at once with its word.
- **Risk.** Colour as the only carrier (today). A flash on each click, if the edge change is made
  bright. A stale banner teaches the wrong state.

### 7.2 Pull

- **Today.** `yardSim.js:316-382`. Three phases: run in 600 ms, stretch 280 ms, run out 600 ms.
  Measured 1534 ms. The engine travels 739 to 1167 units in the optimal lines, always in 600 ms.
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
- **Risk.** A long travel in a short time is hard to follow (up to 768 CSS px in 600 ms at 1440
  today). A fixed duration makes a near track look slow and a far track look fast.

### 7.3 Couple and stretch

- **Today.** `yardSim.js:362-372`. After the contact the engine moves 6 units toward the lead and
  back in 280 ms. At 1440 px that is 3.9 CSS px. At 390 px it is 1.6 CSS px. No words name it. A
  code comment at `yardSim.js:362` ties it to a rule.
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
  words is decoration.

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

### 7.6 Shove of a standing cut

- **Today.** Dead code (F11).
- **Purpose.** None today. The model never moves a standing cut.
- **Static form, motion form, sound, reduced motion.** None. Y2 does not draw it.
- **Risk.** A new drawing that copies the dead branch draws a thing the game cannot do.

### 7.7 Kick and the roll of kicked cars

- **Today.** The same picture as a spot (F5). Measured 1234 ms. The engine carries the cars to
  the standing cut. The banner reads "Kicked 2 to AS73."
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

### 7.8 Secure (tie down)

- **Today.** `yardSim.js:390`, `render.js:144-147`. No motion. One paint. The track tag changes
  from LOOSE to TIED. The banner reads "Hand brakes applied — AS75 is tied down." No move cost.
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

### 7.15 Outbound built, Depart enabled

- **Today.** `yardSim.js:436-438`. The Depart button changes from disabled (opacity 0.4) to
  enabled. The banner reads "✓ Outbound built in order — call Depart ▸ to leave."
- **Purpose.** It tells the learner that the build is right and names the next call.
- **Static form.** The banner words. The enabled button with its label.
- **Motion form.** Confirm class. The button edge changes over `--m-confirm`.
- **Sound.** None of its own. None proposed.
- **Reduced motion.** At once.
- **Risk.** A change of opacity alone is a weak sign. The banner words carry it.

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

### 7.21 Load a job, Reset

- **Today.** `yardSim.js:251-262`, `:306`. Instant. The banner clears. On p6-road the arrival
  starts again.
- **Purpose.** It tells the learner that the job is at its start state.
- **Static form.** The start state, the work order, the readout at zero.
- **Motion form.** None.
- **Sound.** None.
- **Reduced motion.** The same.
- **Risk.** Reset is ignored during a move with no sign (F4).

### 7.22 Mute

- **Today.** `yardSim.js:307`, `:715-716`. The glyph changes. See F12.
- **Purpose.** It tells the learner whether the Yard makes sound.
- **Static form.** A button with a word label and a pressed state, 44 px or more.
- **Motion form.** Confirm class.
- **Sound.** None. A short `points` when sound goes on is an option. Not proposed.
- **Reduced motion.** The same.
- **Risk.** A choice that does not hold (F12).

### 7.23 The lock during motion

- **Today.** F4. No sign. Up to 1.5 s for each move, up to 8.9 s with the reduce setting.
- **Purpose.** None for the learner.
- **Proposed.** Remove it (rule 3 in section 6, pick P11). If the owner keeps it: each locked
  control shows a disabled state, and the status words say that a move is running.
- **Risk.** A press that does nothing looks like a fault.

### 7.24 Still decoration

- **Today.** The halo on a reverse switch (`render.js:124-127`). The headlight dot
  (`render.js:161-162`). A border colour on hover (`yardSim.js:58`, `:83`, `:109`). A 1 px press
  shift on the Back button (`index.css:136-137`).
- **Purpose.** The halo carries the switch state today, which the fence does not allow as the
  only carrier. The others carry nothing.
- **Proposed.** The halo stays only as a still glow beside a word and a shape. Hover and press go
  to the Dusk button states (R3, Y3).
- **Risk.** None from motion. None of these moves.

---

## 8. The rule for reduced motion in the Yard

1. **Motion is off when the app setting is on, or when the operating system flag is on.** One of
   the two is enough (pick P3).
2. **The Yard reads the two at the time of each effect.** It does not keep a copy from the mount.
   It listens for the `change` event of the media query. A change in Settings acts on the next
   effect.
3. **Off means stop.** The drawing goes from the start state to the end state in one paint. No
   frame shows a part-way position. No speed factor is used for reduced motion. "Faster" is not
   an option, and "slower" is the defect of today.
4. **Nothing goes blank.** Each effect has its end state, its trace and its words (section 7).
5. **No timed wait.** The pauses of the demo (520 ms, 420 ms, 320 ms) do not run. The demo is a
   stepper.
6. **Nothing starts by itself and nothing locks a control.** The arrival does not play.
7. **Confirm effects also stop.** As in Dusk, the transition is cut and the new state is there.
   Each state stays distinguishable with no movement.
8. **Sound does not depend on motion.** If sound is on, the sound of an effect plays when its end
   state shows.
9. **The four reading modes together.** The trace and the marks use shape and words, so they hold
   in high contrast. The words are DOM text, so they follow the type and scale settings.

**Pass check.** With the app setting on, and again with the flag on and the setting off: each
move makes one paint, and the time from the first paint to the last is 0 ms. The hook of section
2 measures this. Today the result is 538 paints over 8950 ms.

---

## 9. How a learner replays a move without motion

1. **The move log.** A numbered text list of the moves of this run. Each line: the call, the
   result, the cost. It is always there, with motion on or off. It is the static form of the
   whole run.
2. **The trace.** It shows the route of the last move until the next action.
3. **Before and after.** A control on the last line of the log changes the drawing between the
   state before the move and the state after it. Each press is one still picture. The learner
   sets the pace. It changes no game state.
4. **Review my line.** The same stepper as the watched line (7.18), over the moves of the
   learner.
5. **With motion on:** "Play again" on a log line plays that move one more time and changes no
   game state. The Dusk traveller sets the precedent: one pass, then a replay on a press
   (`/home/user/dusk/preview/cards/living.html:83`).

The controller keeps a copy of the state before each move. `model.js` does not change. These are
new controls. They need the owner's yes (pick P10).

---

## 10. What the access layer announces

One polite status region for results. One assertive region for refusals
(`REVAMP-DESIGN.md:123`). The announcement is the change. The text mirror is the whole state.
Focus does not move.

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

A screen reader was not used in this session. The table is a design, **not verified** with a
screen reader.

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

The gains differ by a factor of 5 (0.05 to 0.25). No one listened to the sounds in this session.
Their loudness and their fit are **not verified**.

### 11.2 Proposed rules

1. **Off by default** (pick P2). Today the default is off, because "Read aloud" is off by default.
2. **Its own switch.** The Yard sound does not depend on "Read aloud". Speech and effects are two
   things (section 5, source 13).
3. **The choice holds.** The mute state is saved and is not changed at mount.
4. **The button** has a word label, a pressed state, and a size of 44 px or more.
5. **One sound, one meaning** (the last column of 11.1).
6. **A sound follows a learner action.** Nothing sounds on load.
7. **A sound sits on its event.** `couple` at the contact. `roll` at the release. `win` at the
   result.
8. **Each sound has a visual twin and words.** Sound is never the only carrier.
9. **A sixth sound, `confirm`,** for an action of the conductor that moves no equipment: secure,
   flag a line, certify right (pick P9). It is one new line in `sound.js`. That file is not
   frozen.
10. **Reduced motion does not mute.** The two settings are separate.

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

**P2. Sound (MEDIUM).**
- (a) Off by default, with its own switch that holds. Reason: a learner in a shared room is not
  surprised, and a choice is kept.
- (b) On by default. Reason: confirmation by sound from the first move. Risk: sound that a
  learner did not ask for.
- (c) As today: tied to "Read aloud", and reset at each visit. Reason: no change. The defect F12
  stays.

**P3. What turns motion off (HIGH).**
- (a) The app setting or the system flag, each one alone, read live. Reason: the safest. A
  learner who set the flag never sees motion.
- (b) The app setting only, which starts from the flag on the first visit (today), but read live.
  Reason: one control. A learner who sets the flag later still sees motion.
- (c) The system flag only. Reason: the simplest. The app setting loses its meaning.

**P4. The duration of a travel leg (MEDIUM).** Dusk has no token between 420 ms and 6000 ms.
- (a) Run in 840 ms (2 × `--m-enter`), run out 420 ms, as named aliases in the bridge file.
  Reason: the informative leg is readable, and a pull takes 1580 ms, the same pace as today.
- (b) 420 ms for each leg. Reason: one token, no multiple. A travel of up to 768 px in 420 ms is
  hard to follow.
- (c) Keep 600 ms. Reason: no change. It needs a new token in the Dusk repository, because the
  copy is locked, or a raw duration in the bridge file. Dusk does not allow a raw duration in its
  own layers (`/home/user/dusk/DECISIONS.md:32`). The fence of this plan names raw colour only.
No learner test was run. The choice is **not verified** with learners.

**P5. The arrival (MEDIUM).**
- (a) On request only, from the work order. Reason: nothing starts by itself, nothing locks, and
  the work order already says it in words.
- (b) Automatic one time for each visit, with a Skip, never on Reset. Reason: it keeps the scene.
  It still starts by itself.
- (c) Remove it. Reason: it is decoration, and its set-out picture is in doubt (S5).

**P6. Where the engine rests after a spot (HIGH, after the SME answers S4).**
- (a) Where the model has it: in the track, with the pull-out drawn at the start of the next
  move. Reason: the picture then explains the cost of the next move.
- (b) On the lead, as today, with the cost of each move in words. Reason: the look does not
  change. The picture and the count stay apart.

**P7. The picture of a kick (HIGH, after the SME answers S1).**
- (a) The engine stops and the cars roll in alone. Reason: it is what the words on the page say.
- (b) As today. Reason: no change. A kick stays the same picture as a spot.

**P8. The watched optimal line (MEDIUM).**
- (a) A stepper with Next, Back, "Play all" and Stop. It asks before it replaces the learner's
  work. It gives no done mark and no win sound. Reason: the learner sets the pace, and a watched
  line is not a win.
- (b) The film of today with a Stop added. Reason: less work.
- (c) As today. Reason: no change. F10 stays.

**P9. The sound for secure, flag and certify (LOW).**
- (a) One new `confirm` sound. Reason: one sound, one meaning.
- (b) No sound for these. Reason: no new sound. The words carry them.
- (c) As today. Reason: no change. The switch sound and the coupling sound keep two meanings.

**P10. Replay controls (MEDIUM).**
- (a) The move log, before and after, and "Play again". Reason: a learner can study a move with
  motion off.
- (b) The move log only. Reason: the least new surface.
- (c) None. Reason: no change. A move that the learner missed is gone.

**P11. Controls during motion (HIGH).**
- (a) A new input ends the running effect and runs. Reason: nothing locks, and a fast learner is
  not slowed.
- (b) Keep the lock, with a disabled state and status words. Reason: simpler to build.

**P12. The cost of a move in words (MEDIUM).** New copy, for example the change of the two
counters after each move.
- (a) Yes. Reason: the cost has a visible cause (F7).
- (b) No. Reason: no new words. The totals stay the only sign.

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
- **S2. A spot that leaves a gap counts a joint.** The model leaves a gap of one car length
  between a spotted cut and a standing cut that is not the goal (`model.js:96-99`). It still adds
  one joint (`model.js:151`), and the Yard plays the coupling sound. Three optimal lines do this
  (F12). Is a joint right here?
- **S3. The stretch after a coupling.** The drawing moves the engine 6 units toward the lead and
  back after each pull. A code comment at `yardSim.js:362` names a rule for it. No words on the
  screen say what it is. Is the picture right, and does it need words?
- **S4. The engine after a spot.** The model keeps the engine in the track after a spot and
  charges the pull-out on the next move (`model.js:54-57`, `:156`). The drawing shows the engine
  go back to the lead at once. Which picture is true to practice?
- **S5. The picture of a set-out.** In the arrival, the inbound train runs from the main line
  down the ladder to the lead and stops with its engine off the frame. Two cars then slide alone
  along AS73 while its switch shows normal. The train leaves off the end of the lead (F9). Is any
  part of this a true picture of a set-out?
- **S6. A speed label beside fast motion.** The canvas prints "15 MPH · REDUCED (CROR 105)"
  (`render.js:94`) while equipment crosses the yard in 0.6 s. The time is compressed. Does the
  label beside that motion mislead?
- **S7. Secure.** Today the only signs are the word TIED and one sentence (`model.js:223`). If the
  new drawing adds a brake mark, where does it go and on how many cars?
- **S8. The demonstration lines the switches for the learner.** Before each move the demo sets the
  target switch reverse and each other switch normal (`yardSim.js:397`). It shows no step for
  that. Does the demo then show a complete routine?
- **S9. Open fact T12 stays open.** The comment at `render.js:2` calls the reverse colour a rule
  convention. The throw has colour as its only carrier today (F8). The new static form uses a
  word and a shape, so the question of colour is no longer a carrier question.

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
| R6, Y1 | `sound.js:5` reads `localStorage` at import with no guard. If storage throws, the import fails. Read from the code; not tested. The key `sl_muted` does not use the `cb.` prefix of the app. | `sound.js:5`, `:10` |
| R3, S1 | The Dusk reduced-motion blocks follow the system flag only. The bridge must also apply them for `html[data-reduce="1"]`. | section 4.3 |
| Y2 | Read durations and distances from tokens at run time. Use CSS px for a nudge or a gap, so it shows at phone size. | section 4.4, 7.3 |
| Y2 | The kick animation calls `spotPlan` without the couple flag (`yardSim.js:328`), and the model calls it with the flag (`model.js:192`). No difference showed in the 19 optimal lines. A kick onto a kickable track that is not the goal track is not checked. | `yardSim.js:328` |
| D1 | `REVAMP-DESIGN.md:123`, `SPEC.md:186` and `Settings.tsx:9` state a reduced-motion behaviour that the Yard does not have. | F1 |

---

## 15. Not verified

1. The law text (the rules named SKIN and SAFE) was not readable. Section 4 reads the Dusk layers
   and records only. The classing of Yard travel as a Tier 2 class effect is a reading by this
   job.
2. Each research statement in section 5 is from a search summary. No page was opened.
3. No learner test was run. No duration proposal is tested with learners.
4. No one listened to the sounds. Only the oscillator calls were recorded.
5. No screen reader was used. Section 10 is a design.
6. All timing is from headless Chromium at 1440 by 900. Firefox, Safari, a phone and the Tauri
   desktop build were not measured. At 390 px only the canvas size was measured.
7. The kick with the reduce setting on was not measured. The value 7200 ms is by formula.
8. The demo durations for jobs other than p0-1 are by formula. The formula is within 2 % of the
   measurement for p0-1.
9. The value of the CSS keyword `ease` is from the CSS specification as known, not checked in
   this session.
10. The `sound.js:5` storage failure is read from the code and not tested.
11. Whether audio starts on the first gesture in each browser is not checked. The measurement
    used a browser flag that allows audio without a gesture.
12. The purpose of each effect in section 7 is a statement of intent by this job. The code
    comments support it for the stretch (`yardSim.js:362-364`), the arrival (`yardSim.js:266-269`)
    and the departure (`yardSim.js:506-507`). The others are not stated in the code.

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
