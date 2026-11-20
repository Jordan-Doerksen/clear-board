# R4 — Learning and UX audit of Clear Board

Wave 1, research. Read-only on code and content. Date of the audit: 2026-11-20.
Branch `claude/peaceful-mayer-qat99l`, commit `1e48578`.

## 1. Summary

- 36 findings. 9 HIGH, 17 MEDIUM, 10 LOW.
- The most serious finding is in the Signals drill. One drawing belongs to two indications in the
  data. The drill can offer both names and mark one of them wrong (UX-01). The app showed this on
  screen during the audit.
- Fact T4 of the plan is wrong in direction. Reduce motion does not make the Yard faster. It makes
  each move 5.7 times slower (UX-02).
- Two paths lose the work of a learner: "Look it up" ends the session or the job (UX-04), and there
  is no export or import of the profile (UX-05).
- The shell (Home, Reference, Drill, Settings) obeys the four reading modes. The Yard and the guided
  Radio do not (UX-16).
- No screen had sideways scroll at 390 px or at 1440 px, with the modes off or on.

## 2. Method

- App under test: the built app at `http://127.0.0.1:4173/`. No rebuild was made.
- Tool: Playwright with headless Chromium. Viewports 1440 x 900 and 390 x 844 (touch on).
  Service workers were blocked, but not in the offline test.
- Profiles: a fresh profile (empty `localStorage`), and a seeded profile with history (63 definitions
  due, signals in part, switching not due, securement strong, three Yard jobs complete, two best
  records). The shape came from `src/core/store.ts:21-29` and `src/core/types.ts:73-84`.
- Code read: `src/App.tsx`, all files in `src/stations/`, `src/stations/yard/*.js`,
  `src/state/AppContext.tsx`, `src/core/*.ts`, `src/index.css`.
- Gate scripts run read-only today: `node tools/solve.mjs` (19 of 19 pass),
  `node tools/content-check.mjs` (checks A to I pass), `node tools/securement-check.mjs` (pass).
  `tools/sr-vectors.mjs` was not run, because it writes a `.gate/` folder in the repository.
- Timings: other agents used the same machine. Each move timing is the median of 3 runs. The spread
  in each group was 27 ms or less.
- Contrast ratios in this report are computed from the colour values in the code with the WCAG
  formula. They are not measured from pixels.
- Web research: none was necessary. No web source is used in this report.
- Scratch scripts are in
  `/tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/R4/`.

### Plan facts checked

| Fact | Result | Measurement |
|---|---|---|
| T2 | Confirmed. | At 390 px the canvas is 352 x 121 CSS px. Scale 0.2627. A 9 px car number draws at 2.36 px (1.58 px after the shrink loop in `render.js:171-172`). The plan says "about 2.6". |
| T3 | Confirmed. | Hit radius 18 units = 4.73 CSS px at 390. A tap 6 px beside a switch did not line it. The Tab key reaches no switch (tab stops listed in UX-08). |
| T4 | **Wrong in direction.** | `anim.js:17` multiplies the duration by the speed factor. `yardSim.js:229` sets the factor to 6 for reduce motion. A PULL takes 1590 ms with motion and 9012 ms with reduce motion. See UX-02. The line is `yardSim.js:228-229`, not 227. |
| T10 | Confirmed. | `src/stations/Home.tsx:7-11` and `:64`. More emoji are listed in UX-33. |

## 3. Findings

Form: id, title, severity, evidence, fix, effort (S under half a day, M one to two days, L more),
risk of the fix, and the line "Frozen".

### HIGH

#### UX-01 — The Signals drill can mark a correct name as wrong
- Severity: HIGH
- Evidence:
  - Data (read-only check of `public/data/signals.json`): two drawings each belong to two
    indications. `{"heads":["R"],"type":"mast"}` is an aspect of `sig.437` (437 STOP AND PROCEED) and
    of `sig.439` (439 STOP). `{"heads":["G"],"type":"dwarf"}` is an aspect of `sig.405` (405 CLEAR
    SIGNAL) and of `sig.431` (431 SLOW TO CLEAR). Both pairs are `verified`.
  - Code: `src/stations/Drill.tsx:54-58` picks one aspect of the item at random. The correct answer
    is the title of that item. `Drill.tsx:37-42` picks three other signal titles at random. No check
    excludes an item that has the same drawing.
  - Live, `/#/signals`, fresh profile: the screen showed one red lamp on a mast. The options were
    "439 STOP", "437 STOP AND PROCEED", "432A DIVERGING TO LIMITED", "432 SLOW TO LIMITED". The
    choice "439 STOP" got: "Not quite. 437 STOP AND PROCEED — Stop, then proceed at RESTRICTED speed.
    Safety-critical — lock this one in." Picture: `pictures/R4-01-signal-two-answers.png`.
  - Rate: 12 of 267 signal questions showed one of the two shared drawings (4.5 %). The case with
    both names in the options appeared one time in those 267 questions.
  - The gate does not look for this. REVAMP section 7 item 5 asks for a one-to-one mapping of aspect
    to title. `tools/content-check.mjs` has no such check.
- Fix: in `Drill.tsx`, do not ask a signal question with a drawing that belongs to more than one
  indication. Add a check to `tools/content-check.mjs` that lists each shared drawing. Keep this
  until the SME rules on the two pairs (section 6, note S-01). Do not edit the data.
- Effort: S
- Risk: LOW
- Frozen: no (the selection code and the gate). The data question goes to the SME.

#### UX-02 — Reduce motion makes each Yard move 5.7 times slower and locks the controls
- Severity: HIGH
- Evidence:
  - Code: `src/stations/yard/anim.js:6` ("`>1 = slower`") and `:17`
    (`dur = step.dur * speedFactor`). `src/stations/yardSim.js:229` sets the factor to 6 when reduce
    motion is on. The comment on that line says "≈ instant". The code does the opposite.
  - Measured, PULL 3 from AS73, median of 3 runs: motion on 1590 ms; app setting "Reduce motion" on
    9012 ms; OS preference only 9018 ms.
  - The OS preference is sufficient. `src/state/AppContext.tsx:12` sets the default from
    `prefers-reduced-motion`. A learner with that phone setting gets the slow Yard without a choice.
  - During a move, `busy` is true. Switch clicks, "Work it" and "Reset" do nothing
    (`yardSim.js:286`, `:306`, `:385`).
  - Watched line of the first job (par 5): 11.1 s with motion, 29.0 s with reduce motion (one run
    each).
  - `Settings.tsx:9` tells the learner: "Reduce motion — No animations".
- Fix: with reduce motion on, apply the move at once and draw the end state. No tween. This agrees
  with fence item 6 (design the static state first). The change is in `yardSim.js` and `anim.js`.
  Read the setting at each move, not only at mount.
- Effort: S
- Risk: LOW
- Frozen: no

#### UX-03 — A click on a Reference row shows the entry out of view
- Severity: HIGH
- Evidence: `src/stations/Reference.tsx:52-63` renders all rows, then the detail after the last row.
  The list has 219 rows. After a click on row 1, the detail was at y = 19 419 px (1440 wide) and at
  y = 27 816 px (390 wide). The page did not scroll (`scrollY` 0). Focus stayed on the row. To the
  learner, nothing happens. Picture: `pictures/R4-02-reference-row-click.png`.
  A deep link works, because it also filters the list (`Reference.tsx:32`). At 390 the detail then
  starts at y = 768 of 844.
- Fix: show the entry at the clicked row (expand in place), or in a panel above the list. Move focus
  to the entry heading. Remove the entry when the search no longer includes it (today the old entry
  stays below new results).
- Effort: S
- Risk: LOW
- Frozen: no

#### UX-04 — "Look it up" ends the session or the job, and there is no way back
- Severity: HIGH
- Evidence:
  - Drill: at question 3 of 10, "Look it up →" opened `#/reference?focus=sig.431`. Reference has
    only "← Home". The browser Back button returned to "Question 1 of 10 / 0 correct". The list of
    misses for the review round was also gone. Code: `Drill.tsx:245` navigates away; the session
    lives in component state (`Drill.tsx:73-79`).
  - Yard: after one PULL (readout "Moves 2 / par 5"), a refusal, "Look it up →" and Back, the readout
    was "Moves 0 / par 5 · Joints 0". Code: `yardSim.js:652` and `imperativeStation.ts:37` (the host
    is emptied on leave). Some jobs have par 19.
  - Radio "Call it yourself": the same pattern (`RadioTest.tsx:192`). A switch of mode also resets
    the run: "Call 2 of 14 / 1 correct" became "Call 1 of 14 / 0 correct" (`Radio.tsx:36`).
  - Answers already given stay graded. The place in the session and the Yard position do not.
- Fix: show the looked-up entry in a dialog on top of the station (the Settings dialog already uses
  this pattern), with "Back to your question" / "Back to the job". Keep the Radio run when the
  learner changes mode.
- Effort: M
- Risk: MEDIUM
- Frozen: no

#### UX-05 — No export and no import of the profile; lost progress has no recovery
- Severity: HIGH
- Evidence: SPEC failure mode F6 gives three mitigations: "profile export/import; PWA; clear
  warning" (`SPEC.md:65`). `exportProfile` exists (`src/core/store.ts:44`) and nothing calls it
  (`grep -rn exportProfile src` finds only the definition). The Settings dialog has no export or
  import control (`src/stations/Settings.tsx:31-58`; picture `pictures/R4-11-settings.png`). The only
  text about storage is "Everything is saved only on this device — no account, nothing sent
  anywhere." (`Settings.tsx:56`). It does not tell the learner that a browser clean-up deletes the
  progress. The reset path has a clear `confirm` text (`Settings.tsx:50`). The PWA part is done
  (D-0028; offline was tested, see section 7).
- Fix: add "Save a copy of my progress" (download a JSON file) and "Load a copy" (file input with
  validation) to Settings. Add one plain sentence about the risk. Include the settings key
  `cb.settings.v1` in the file. Do UX-19 first, or a bad file gives a blank app.
- Effort: M
- Risk: MEDIUM
- Frozen: no

#### UX-06 — To watch the optimal line marks the job as complete, discards the job in progress, and cannot be stopped
- Severity: HIGH
- Evidence:
  - Fresh profile, first job, one PULL done, then "▶ Watch optimal". No question was asked. The
    readout went from "Moves 2" to "Moves 0" (`yardSim.js:403`, `load(puzzle)`).
  - A click on "Reset" during the demo did nothing (`yardSim.js:306`).
  - After the demo the picker showed "✓ Make up the cut · par 5" and "→ Add to the cut · par 5".
    The stored profile was `{"completed":["p0-1"],"best":{}}`. Code: `yardSim.js:463-466` adds the id
    to `completed` before the `fromDemo` test at `:469`. The best record and the mastery write are
    guarded correctly (`:469`, `:484`). Picture: `pictures/R4-06-yard-after-watch.png`.
  - Result: the ✓ and the "recommended next" arrow say that the learner did a job that the learner
    only watched.
- Fix: do not add to `completed` when `fromDemo` is true. Ask before a demo discards moves. Let
  "Reset" stop a demo. Old profiles hold watched jobs as complete; these cannot be told apart
  (owner question 3).
- Effort: S
- Risk: LOW
- Frozen: no

#### UX-07 — Reference rows show unverified content with no trust mark
- Severity: HIGH
- Evidence: `Reference.tsx:55-57` renders the title and the plain text of each item. The trust badge
  is only in the detail (`:75`), and the detail is out of view (UX-03). Rows without a mark: 4
  `needs-review` signals (`sig.410`, `sig.418`, `sig.433A`, `sig.440`) and 6 `operating-practice`
  radio steps. Example row: "410 CLEAR TO RESTRICTING — Proceed, next signal is displaying
  restricting signal." The detail, when found, is honest: "⚠ not yet verified — reference only".
  SPEC says each look-up gives "a plain answer + the cited source + a trust flag".
- Fix: put the trust mark in each row, as a word and not only a colour. Keep the order: mark, then
  text.
- Effort: S
- Risk: LOW
- Frozen: no

#### UX-08 — The Yard drawing cannot be read or operated on a phone, and has no keyboard path (T2, T3)
- Severity: HIGH
- Evidence (one finding; the redraw is a different job):
  - 390 wide: canvas 352 x 121 CSS px, scale 0.2627. Car number 2.36 px. Track name 3.41 px.
    TIED / LOOSE label 2.63 px. Switch mark 3.68 px. Hit circle 9.46 px across. Distance between two
    switches 22.9 px. Picture: `pictures/R4-03-yard-phone.png`.
  - 1440 wide: the reading column limits the canvas to 882 px (scale 0.658). A car number draws at
    5.9 px. The work order tells the learner to find cars by these numbers.
  - A tap 6 px beside the switch centre did not line the switch. The app gave no sign of the miss.
  - Keyboard: tab stops are Home, picker, action, count, track, Work it, Watch optimal, Reset, mute,
    "How to play". The canvas has `tabIndex -1`, no role, no label and no fallback text. The
    switch-list rows (`.ord-row`) are `div` elements with a click listener only (`yardSim.js:577`).
  - The lined state of a switch is colour only: green or yellow, 1.36:1 between the two
    (`render.js:119`). There is no text mirror of the yard.
  - At 390, the result banner is at y = 829 of 844 after "Work it". It was not in view.
- Fix: the Yard redraw job (view transform on top of the frozen geometry, a text mirror, switch
  controls outside the canvas). Until then, show a plain notice on narrow screens.
- Effort: L
- Risk: MEDIUM
- Frozen: no (`geometry.js` stays untouched; `render.js` and `yardSim.js` are not frozen)

#### UX-09 — Reference promises the rule text for each rule; no rule entry has it
- Severity: HIGH
- Evidence: the promise is on two screens. Home: "Every rule explained in plain words first, the real
  CROR text one tap deeper" (`Home.tsx:26-27`). Reference: "the rule text is one tap deeper, always
  cited" (`Reference.tsx:48`). In `public/data/rules.json`, 100 of 100 rule items have
  `citation.verbatim: null`. The control "Show the rule text" appears only when `verbatim` is set
  (`Reference.tsx:86`). Definitions (63 of 63) and signals (42 of 42) do have it.
  The plain text of a rule entry often covers one paragraph of the rule. Example, deep link
  `#/reference?focus=rule.112`: the whole entry is "Rule 112(ii): parking brakes are considered to
  be hand brakes. Source: CROR · CROR 112". The Yard sends the learner to this entry from a
  securement refusal.
- Fix: make the copy match the data. Where an entry has no rule text, say so in plain words in the
  entry, and name the rule number to read in the rulebook. Change the two promise sentences. The
  content gap itself is note S-05 for the SME.
- Effort: S
- Risk: LOW
- Frozen: no (the copy and the entry layout). The rule text and the plain text are frozen content.

### MEDIUM

#### UX-10 — Home gives a new learner no first step
- Severity: MEDIUM
- Evidence: Home has 7 domain cards and 5 station cards of equal weight, and one disabled "Exam"
  card. No control says where to start. At 390 the first screen shows the lede, the path and one
  card; "Ways to learn" starts at y = 1455 (`pictures/R4-09-home-first-screen.png`). A domain card
  looks like a progress tile. Its visible text has no verb. Only the `aria-label` says "Drill …"
  (`Home.tsx:54`). A click starts question 1 at once. "Signals" is on Home two times (domain card and
  station card) and both open the same screen (`App.tsx:43-45`).
- Fix: one primary control on the path card: "Start here" for a fresh profile, "Continue" with the
  count of items due for a profile with history. Put the visible verb on the domain cards.
- Effort: M
- Risk: LOW
- Frozen: no

#### UX-11 — The Drill tests before it teaches; the first session is a cold draw from all domains
- Severity: MEDIUM
- Evidence: fresh profile, Home, "Drill". Question 1 was "What does this mean? INTERLOCKING LIMITS"
  with four long definitions. Later questions in the same first session: "Which term is this?" for
  FOLLOW-UP TOP, and "What signal is this?" for 413, 414A, 419A, 425A. A second fresh session had 6
  signal questions of 10. The tier limit of D-0020 applies to rule questions only: `Drill.tsx:19-23`
  gives each definition and each signal tier 1. REVAMP section 3 step 1 asks for a seeded first
  session and "no cold cross-domain random draw". `/#/signals` is also a test at once; there is no
  screen to look at the aspects first, apart from Reference.
- Fix: a first-session seed list (owner and SME pick the items), and a "Learn" step before the first
  test of an item: show the item, then ask. No change to the mastery model.
- Effort: M
- Risk: MEDIUM
- Frozen: no (the order of items). The choice of items is for the owner and the SME.

#### UX-12 — Progress numbers read as "nothing happened", and the due rule is silent
- Severity: MEDIUM
- Evidence:
  - First session, 7 of 10 correct. Summary: "The words: +0% → 0% · Authority: +0% → 0% · Signals:
    +0% → 0% · Switching: +0% → 0%. Spaced out over the next days so it sticks." Home after: "0%
    mastered", all 7 bars at 0. Picture: `pictures/R4-08-drill-summary-zero.png`.
  - Cause: one correct answer adds 1/30 to one item (`sr.ts:18`, `:24`). The numbers are true. The
    screen does not tell the learner why they are small.
  - A correct answer on an item that is not due counts for nothing (`AppContext.tsx:79`). A miss
    always counts. Seeded profile, securement drill two times in a row, 6 of 6 each: "+0% → 89%"
    both times. "Drill again" is offered directly after each session. Extra practice on the same day
    can only lower mastery. No screen says this.
  - No screen shows how many items are due, or when to come back.
- Fix: keep the model and the numbers. Add true counts in words: "7 right today. 7 items started.
  They come back tomorrow." Show "N due now" on Home and before a session. When nothing is due, say
  that this round is practice and does not move the bar.
- Effort: M
- Risk: LOW
- Frozen: no

#### UX-13 — The first Yard job: the screen does not tell how to line a switch
- Severity: MEDIUM
- Evidence: the first screen shows the work order and the hint ("PULL one cut, PULL the other onto
  it, then SPOT all six onto AS75"). The first necessary action is a click on a switch mark on the
  canvas. This is explained only in a closed section at the bottom ("How to play & why these rules",
  y = 1105 of a 900 px window; `yardSim.js:187-189`). The builder starts at PULL / 1 / AS71, a track
  with cars that are not in the job. The first "Work it" gave: "AS71 is lined normal — line its
  switch reverse for the track (CROR 104). Look it up →". The refusal names the rule, not the
  control. "Look it up" then ends the job (UX-04). Picture: `pictures/R4-04-yard-first-refusal.png`.
  The hint text is 12.5 px italic at 3.82:1 to 4.09:1 (`yardSim.js:76`), below AA.
- Fix: one visible line above the drawing on the first job: how to line a switch and how to call a
  move. Add the control hint after a lining refusal in `yardSim.js` (the refusal text itself is in
  the frozen `model.js`). Start the builder on a track of the job. Raise the hint contrast.
- Effort: S
- Risk: LOW
- Frozen: no

#### UX-14 — Right and wrong options differ by colour only
- Severity: MEDIUM
- Evidence: `src/index.css:93-94`: a green border for the right option, a red border for the picked
  wrong option. No word and no icon on the option. The two colours are 1.32:1 to each other. For a
  rule question the feedback text names the rule and the explanation, not the right option
  (`Drill.tsx:239`). The same classes are used in `RadioTest.tsx:178`. Fence item 5 and REVAMP
  section 6 both forbid colour as the only carrier. Picture: `pictures/R4-07-drill-miss-colour.png`.
- Fix: add words to the two options ("Correct answer", "Your answer") and state the right option in
  the feedback text.
- Effort: S
- Risk: LOW
- Frozen: no

#### UX-15 — A finish above par does not say that the job is done
- Severity: MEDIUM
- Evidence: first job finished in 7 moves. Banner: "7 moves — par 5 · 3 couplings · your best:
  5m/2j", neutral style, no "done" word (`yardSim.js:501-502`; picture
  `pictures/R4-05-yard-overpar-finish.png`). At par the banner starts with "✓ Par!". The neutral tone
  for an S1 result is correct (REVAMP section 6). The missing word is the defect. "5m/2j" is not
  explained. The readout says "Joints", the banner says "couplings".
- Fix: start each finish with "Job done." in `yardSim.js`. Write "5 moves, 2 couplings". Use one
  word for joints.
- Effort: S
- Risk: LOW
- Frozen: no (`yardSim.js`). The head text "Par! …" is in the frozen `model.js:270`.

#### UX-16 — Three reading modes do not reach the Yard and the guided Radio
- Severity: MEDIUM
- Evidence (computed styles at 390, default against each mode):

  | Screen | Bigger text | Dyslexia type | Higher contrast |
  |---|---|---|---|
  | Home, Reference, Drill (9 probes) | 9 of 9 scale (16 → 18.5 px) | 9 of 9 change | 9 of 9 change |
  | Yard (7 probes) | 0 of 7 change | font family 0 of 7; letter spacing 6 of 7 | 0 of 7 change |
  | Guided Radio (6 probes in the island) | 0 of 6 change | 6 of 6 change | 0 of 6 change |

  Cause: fixed `px` sizes and own palettes in `yardSim.js:44-138` and `radioSim.js:5-33`. The canvas
  and the Radio SVG text also do not scale. `Settings.tsx:11` says "Bigger text — Scales the whole
  app".
  The dyslexia face is named in `index.css:9` ("Atkinson Hyperlegible"), but no font file and no
  `@font-face` is in `src/` or in `dist/assets/`. The face appears only if the device has it.
- Fix: in the reskin, the two islands take sizes in `rem` and colours from the bridge file. Ship the
  dyslexia face as a local file, or change the label to say what the mode does.
- Effort: M
- Risk: MEDIUM
- Frozen: no

#### UX-17 — A flashing lamp flashes under reduce motion, and no word says "flashing"
- Severity: MEDIUM
- Evidence: the frozen renderer draws a flash with an SVG `<animate>` element
  (`src/core/signal.ts`, in `drawSignal`). The reduce-motion CSS (`index.css:140-147`) does not stop
  SVG animation. With reduce motion on, `sig.406` in Reference: opacity samples 0.97, 0.79, 0.56,
  0.33, 0.15, 0.38, 0.62, 0.85. No text on the screen contains "flash". The flash is part of the
  meaning of the aspect. If a reskin stops it and adds no word, the drawing shows a different
  aspect.
- Fix: in the wrapper `Signal.tsx` (not frozen), show the word "flashing" at each lamp that flashes,
  in all modes. Then, under reduce motion, hold the lamp lit. The owner and the SME must agree that
  a still lamp with the word is an acceptable picture of the aspect (owner question 6, note S-10).
- Effort: S
- Risk: MEDIUM
- Frozen: no for the wrapper. `signal.ts` is frozen and stays as it is.

#### UX-18 — A failed data load shows false messages and no retry
- Severity: MEDIUM
- Evidence: all `data/*.json` requests blocked. Home: 7 locked cards that say "Coming soon", "0%
  mastered" (`pictures/R4-10-home-data-failed.png`). Reference: "No match. Try another word."
  Drill and Signals: "Not enough verified content to drill yet." Radio "Call it yourself": "The radio
  script hasn't loaded." (the only true message). With only `rules.json` missing, four domain cards
  said "Coming soon". Cause: `store.ts:48-54` skips a failed file without a record;
  `AppContext.tsx:46`. This case needs a failed first load; after one good load the service worker
  serves the files (section 7).
- Fix: record which files failed. Show "The content did not load" with a "Try again" button. Do not
  show "Coming soon", "No match" or "Not enough verified content" for a load failure.
- Effort: S
- Risk: LOW
- Frozen: no

#### UX-19 — A stored profile with a missing field gives a blank app
- Severity: MEDIUM
- Evidence: `cb.profile.v1` set to `{"schema":1}`: all routes rendered nothing (`#root` empty), with
  "TypeError: Cannot read properties of undefined (reading 'definitions')". The same for a profile
  with no `domains`. `store.ts:30-38` checks only `schema === 1`. No error boundary exists. Settings
  and its Reset are then not reachable. Invalid JSON and an old schema number fall back to a fresh
  profile correctly. This must be fixed before an import control exists (UX-05).
- Fix: repair missing fields on load (merge on top of `freshProfile`). Add an error boundary with
  two actions: "Save a copy of the stored data" and "Start fresh".
- Effort: S
- Risk: LOW
- Frozen: no

#### UX-20 — Targets below 44 px, and Yard results are not announced
- Severity: MEDIUM
- Evidence (CSS px, the same at 390 and 1440):

  | Control | Size |
  |---|---|
  | Yard picker, action, count, track | 39 high |
  | Yard "Work it", "Watch optimal", "Reset", mute | 37 high |
  | Yard "Look it up →" in a refusal | 91 x 25 |
  | Yard "How to play" summary | 19.5 high |
  | Yard switch-list row | 36 high |
  | Guided Radio "Key the radio" | 41 high |
  | Settings switch | 50 x 28 (the label is also a target) |
  | Tip link | 33.7 high |
  | Header mark | 42 x 42 |

  The Yard banner `#msg` has no `aria-live` and no role (`yardSim.js:174`, `:636-640`). The guided
  Radio log and note also have none. Drill feedback has `aria-live="polite"`
  (`Drill.tsx:237`), but the region is created with its text; if a screen reader announces it is
  not verified.
- Fix: 44 px minimum in the reskin for each control in the table. A live region that exists before
  the text changes, in the Yard, the Radio and the Drill.
- Effort: S
- Risk: LOW
- Frozen: no

#### UX-21 — Reference search misses plain queries, and the list has no structure
- Severity: MEDIUM
- Evidence: the search reads `title` and `plain` only (`Reference.tsx:41`). Results: "securement" →
  1 row, "Rule 66", and not "Rule 112". "CROR 112" → 0 rows ("No match. Try another word."), but each
  entry shows "CROR 112" as its source. "hand brake" → 4 rows. 97 of 100 rule titles are a number
  only ("Rule 104"). The 219 rows are sorted by title with no groups and no filter; row 1 is "405
  CLEAR SIGNAL". The radio-step items are in the same list.
- Fix: search also the citation reference, the rule text and the domain name. Group or filter the
  list by domain and by kind. Show the domain name in each row. A no-match message that offers the
  nearest terms.
- Effort: M
- Risk: LOW
- Frozen: no (search and list). The titles are frozen content (note S-05).

#### UX-22 — Yard and Radio words have no look-up
- Severity: MEDIUM
- Evidence: words on the Yard screen and in its hints: cut, lead, ladder, throat, foul point, joint,
  par, spot, kick, shove, bad-order, manifest, special instruction. A title search of the library
  finds none of: joint, cut, lead, ladder, throat, foul, spot, shove, bad-order, manifest, special
  instruction, hand brake. Only "KICKING" has an entry. Home uses the same words on the station
  cards: "Work the cuts", "Back to a joint" (`Home.tsx:9`, `:11`). The audience is a first-day
  learner. The guided Radio explains each call in "Why this call"; that part works.
- Fix: a short "Words on this screen" list in the Yard and in the Radio, in app copy. The text of
  each line needs the SME. Change the two Home subtitles to plain words.
- Effort: S for the place, plus SME time for the text
- Risk: LOW
- Frozen: no for the place. The puzzle hints and tier labels are in the frozen `puzzles.js`.

#### UX-23 — The guided Radio scene text is 4 to 6 px on a phone
- Severity: MEDIUM
- Evidence: 390 wide, SVG text in CSS px: "10 cars to the joint" 6.2; "standing car · AS73" 4.9; "you
  — in the clear, watching the tail car" 4.6; "tail car" 4.4; "front" 4.0 (`radioSim.js:44-67`). The
  distance readout exists only as this SVG text in guided mode. "Call it yourself" has a DOM readout
  at 18.4 px. Picture: `pictures/R4-12-radio-guided-phone.png`. At 1440 the first "Key the radio"
  button is at y = 938 of a 900 px window.
- Fix: repeat the readout and the status as DOM text above the call. Keep the SVG as a picture.
- Effort: S
- Risk: LOW
- Frozen: no (the `STEPS` wording is not touched)

#### UX-24 — "Job-ready" on Home and in the page description is close to the forbidden claim
- Severity: MEDIUM
- Evidence: "Get job-ready, one piece at a time" (`Home.tsx:26`); "takes you from first day to
  job-ready as a CN conductor" (`index.html:9`); "first day to job-ready" (`vite.config.ts:28`);
  header "Become a conductor. Free, forever." (`App.tsx:34`). REVAMP section 7 item 12: "the UI
  nowhere claims 'qualification-ready'". D-0013 defers "test-ready". No screen says that the app is
  practice and not the official test. The footer says "An independent study tool" and "Not
  affiliated".
- Fix: the owner picks the wording (owner question 1). Add one plain line: practice, not the
  official test.
- Effort: S
- Risk: LOW
- Frozen: no

#### UX-25 — Home shows "Exam — Coming soon"
- Severity: MEDIUM
- Evidence: `Home.tsx:64`, a disabled card. The plan forbids an Exam station in this change. D-0013
  defers it with no date. The card is a promise that the product does not plan to keep now. The
  subtitle is 2.76:1 (disabled state).
- Fix: the owner picks: remove the card, or keep it (owner question 2).
- Effort: S
- Risk: LOW
- Frozen: no

#### UX-26 — Read aloud speaks the question only
- Severity: MEDIUM
- Evidence: `Drill.tsx:167-169` speaks `promptText`. It does not speak the options or the feedback.
  A signal question speaks nothing. The Yard never calls `speak` (`grep -n speak
  src/stations/yardSim.js` finds nothing). `Settings.tsx:10` says "Speak rules & questions". The
  same switch also sets the Yard sound: `yardSim.js:715` mutes the Yard at each visit when Read
  aloud is off, and a learner who turns the Yard sound on gets it off again at the next visit.
- Fix: a "Read this" button at each option and at the feedback. A separate "Yard sounds" switch.
- Effort: M
- Risk: LOW
- Frozen: no

### LOW

#### UX-27 — Small copy errors about progress
- Severity: LOW
- Evidence: Radio, perfect replay at once: "8 of those 14 calls carry a verified CROR citation and
  moved your Radio mastery: +0% → 2%" (`RadioTest.tsx:114-116`); "moved" is not true for +0%.
  Drill: the button "Practice the 3 you missed →" opened a round that said "Question 1 of 5" (the
  round adds other questions of the same rules, `Drill.tsx:137-152`).
- Fix: say "did not move" when the delta is 0. Say "3 items, 5 questions".
- Effort: S
- Risk: LOW
- Frozen: no

#### UX-28 — The Radio card on Home still names hand signals
- Severity: LOW
- Evidence: `store.ts:11`: "Radio & hand signals." D-0022 moved `rule.12` (hand signals) to the
  `operating` domain. The 5 rule items in the radio domain are 120, 121, 122, 123 and 123.2.
- Fix: change the description. The words need the SME (note S-07).
- Effort: S
- Risk: LOW
- Frozen: no

#### UX-29 — One thing has two names
- Severity: LOW
- Evidence: "← Home" and "Back to the path" go to the same screen. "Joints" and "couplings" (UX-15).
  "Session" (Drill) and "Run" (Radio). "The words" (Home) and "definitions" (card text). In guided
  Radio the "← Home" control is below the mode tabs; in "Call it yourself" it is above them
  (`Radio.tsx:23`, `radioSim.js:135`). The Yard "← Home" is a boxed button; the other stations use a
  text link.
- Fix: one name and one place for each. A reskin can fix the place and the style; a changed word is
  a copy change and needs a separate commit.
- Effort: S
- Risk: LOW
- Frozen: no

#### UX-30 — "Look it up" is larger than "Next"
- Severity: LOW
- Evidence: in the feedback box the secondary action "Look it up →" has the full width and "Next →"
  is small at the left (`index.css:95-97`; picture `pictures/R4-07-drill-miss-colour.png`). The
  larger control ends the session (UX-04).
- Fix: "Next" is the primary control. "Look it up" is a text link.
- Effort: S
- Risk: LOW
- Frozen: no

#### UX-31 — Yard small items
- Severity: LOW
- Evidence: an empty banner box is on the screen at load (`yardSim.js:174`). The picker marks ✓ and →
  have no key on the page. During the arrival scene of the last job a click on "Work it" does
  nothing and says nothing for 5.3 s (one run; `yardSim.js:281`, `:385`). The switch-list refusal
  starts with "Not so fast —" (`yardSim.js:606`). "Reset" and a change of job discard the moves with
  no question.
- Fix: hide the empty banner. One line of key under the picker. A "Wait for the train" line during
  the scene. Calm words for the list refusal.
- Effort: S
- Risk: LOW
- Frozen: no

#### UX-32 — Accessibility details in the shell
- Severity: LOW
- Evidence: the Radio mode buttons have `role="tab"` with no tab panel and no arrow keys
  (`Radio.tsx:25-34`). "Reset my progress" is a `label` with no control (`Settings.tsx:48`). The
  signal picture has `role="img"` and no name (`Signal.tsx:7`); in Reference the name can be given.
  The page title is the same on each route. After a direct load, headless Chromium drew the focus
  ring around the whole main area (`App.tsx:24`, `index.css:19`); on a real device this is not
  verified.
- Fix: correct roles and names. A page title for each station. No ring on the main area.
- Effort: S
- Risk: LOW
- Frozen: no

#### UX-33 — Emoji as icons (T10)
- Severity: LOW
- Evidence: station icons 📖 🎯 🚂 🚦 📻 📝 (`Home.tsx:7-11`, `:64`); "📖 Reference"
  (`Reference.tsx:47`); "⚙ Settings" (`App.tsx:37`); "🔊 Read aloud" (`Reference.tsx:96`); ☕
  (`Home.tsx:68`); Yard mute 🔊 / 🔇 (`yardSim.js:171`, `:307`). The emoji are in the button text,
  so a screen reader reads them as part of the name. The drawing differs on each platform.
- Fix: the icon job of the reskin. Mark each icon as decoration.
- Effort: S
- Risk: LOW
- Frozen: no

#### UX-34 — "SME" is shown as a source
- Severity: LOW
- Evidence: Radio "Call it yourself", call 6, the cite line is "SME" alone (`RadioTest.tsx:190`
  prints `c.source`). The learner does not know this word. The badge above the options is in plain
  words and is good.
- Fix: map the source code to plain words in the cite line.
- Effort: S
- Risk: LOW
- Frozen: no

#### UX-35 — An empty entry has a "verified" badge
- Severity: LOW
- Evidence: `#/reference?focus=rule.573` shows "Rule 573", "✓ verified", no text, "Source: CROR ·
  CROR 573". The item has an empty `plain`, no rule text and no question.
- Fix: the app hides an entry that has no text, or shows "No text yet". The content is note S-04.
- Effort: S
- Risk: LOW
- Frozen: no for the display. The item is frozen content.

#### UX-36 — The guided Radio promises a next layer
- Severity: LOW
- Evidence: the end text says "The move/departure is the next layer." (`radioSim.js:183`). No such
  layer exists or is planned in this change.
- Fix: the owner picks: keep or remove the sentence. It is outside `STEPS`.
- Effort: S
- Risk: LOW
- Frozen: no

## 4. Not offered: needs a frozen file or is behind the fence

| Item | Why it is not offered |
|---|---|
| Remove the exclamation mark in "Par! 5 moves" | `model.js:270` is frozen. |
| Add the control hint inside the refusal texts | `model.js:69-72` is frozen. UX-13 adds the hint in `yardSim.js`. |
| Plain words in the puzzle hints and tier labels | `puzzles.js` is frozen. UX-22 adds a word list outside it. |
| Rule titles with a name, rule text for the 100 rules, text for `rule.573` | `public/data/*.json` is frozen and it is rule content. Notes S-04, S-05. |
| Change the two shared signal drawings | `signals.json` is frozen and it is signal content. Note S-01. |
| A scaffold job before the par-19 job (REVAMP item 16) | New puzzles are behind the fence. |
| Point-protection step on a shove (REVAMP item 18, second half) | Behind the fence (D-0029). |
| Exam station, "test-ready" bar (REVAMP section 3 step 5, section 9 question 6) | Behind the fence (D-0013). |
| A softer grade for a win above par (D-0018, open) | It changes mastery numbers. It needs the owner and the SME. |
| Stop the lamp flash in the renderer | `signal.ts` is frozen. UX-17 works in the wrapper. |

## 5. REVAMP-DESIGN.md — status of each item today

Key: **done** (with the decision), **done in part**, **open**, **superseded**, **fenced** (the plan
forbids it in this change). Each status was checked in the code or in the running app.

### Section 4 — recommendations

| # | Item | Status | Checked in |
|---|---|---|---|
| 1 | `tools/solve.mjs` | done, D-0017 | Run today: 19 of 19 pass. |
| 2 | `tools/content-check.mjs` | done, D-0017 | Run today: checks A to I pass. |
| 3 | `npm run check` blocks the deploy | done in part, D-0017 and D-0019 | `package.json:12` runs four scripts. `tsc` and the lint are not in it (T9). |
| 4 | The Yard writes mastery on a win | done, D-0018 | Live: one win moved Switching 0 → 0.0119 and Securement 0 → 0.0111. |
| 5 | Puzzles tagged with rule categories | done, D-0018 | `yardSim.js:25-33` (`RULE_ITEMS`). |
| 6 | One `MistakeEvent` type from each station | open | No such type in `src/`. |
| 7 | Refusals name the condition and link to Reference | done, D-0020 | Live: the track is named; the link opens the rule. The link ends the job (UX-04). Refusals with no "CROR n" have no link. |
| 8 | Tier-aware Drill and a first-session seed | done in part, D-0020 | Tier limit: `Drill.tsx:100-104`. The seed is not built (UX-11). |
| 9 | One aspect recall before signals can read mastered; `signalId` link | done in part, D-0021 | Cap: `store.ts:76`, `:86`. No `signalId` in `src/` or `tools/`. |
| 10 | Severity-weighted remediation | done in part, D-0023 and D-0024 | Review round with S3 first: `Drill.tsx:116`. No re-show in the same session; no jump of the due order. |
| 11 | SR numbers reconciled, golden vectors | done, D-0022 | `tools/sr-vectors.mjs` is in `npm run check`. Not run today (it writes a folder). |
| 12 | Move `rule.12` out of radio | done, D-0022, confirmed D-0024 | `rule.12` is in `operating`. The Home text is not updated (UX-28). |
| 13 | Cap questions for one rule in a session | done, D-0021 | `Drill.tsx:35` (`PER_RULE_CAP = 3`). |
| 14 | Best record for each puzzle | done, D-0027 | Live (D-0027 could not test it): the profile stored `{"moves":5,"joints":2,…}`; a worse run did not replace it; the banner said "your best: 5m/2j". |
| 15 | Picker in tiers with a "next" mark | done, D-0026 | Live: 7 groups, 19 options, none disabled. The mark is wrong after a watched line (UX-06). |
| 16 | Fill the ramp gaps | done in part, D-0026; the rest is fenced | The par-19 job is in tier 3. New puzzles are fenced. |
| 17 | `optJoints` from the solver | done, D-0027 | `yardSim.js:530`; `solve.mjs` passes. |
| 18 | SECURE as an action; point-protection step | done in part, D-0029; the rest is fenced | Live: the win needs SECURE; the refusal names the track. Point protection is fenced. |
| 19 | Graded aspect mode; graded Radio by step | superseded, D-0025 | `/signals` is the Drill (`App.tsx:45`). Radio has a second, graded mode. |
| 20 | Empty domains on Home | done, D-0027 (no work was necessary) | 7 domains, all with items. "Coming soon" appears only when the data fails (UX-18). |

### Section 6 — error feedback

| Item | Status | Checked in |
|---|---|---|
| One `MistakeEvent` from each station | open | See item 6. |
| Stop the unsafe action, then explain, with a link | done, D-0020 | Live in Drill, Yard and Radio. |
| A Yard refusal feeds the mastery model | open (deferred in D-0023) | Only a win grades (`yardSim.js:484`). |
| Severity ladder S1, S2, S3 | done for the Drill, D-0024; open for the Yard | `src/core/severity.ts`; `Drill.tsx:240-242`. |
| Two channels (red blocks, amber advises), words and icon, never colour alone | open | Options are colour only (UX-14). Switch state is colour only (UX-08). No amber channel exists. |
| S3 miss comes back in the same session | open (deferred in D-0024) | Not in `Drill.tsx`. |
| Confusion-pair drill after the same wrong answer two times | open | Not in `src/`. |
| Calm voice, no "WRONG", no exclamation mark | done in part | Feedback text is calm. Two exceptions: "Par!" (frozen) and "Not so fast —" (UX-31). |
| No rule number on screen that is not in the verified set | open, for the SME | The Yard texts carry rule numbers in code. No decision records a sign-off (note S-03). |

### Section 7 — validation checklist

| # | Item | Status | Checked in |
|---|---|---|---|
| 1 | Solver gate | done, D-0017 | Run today. |
| 2 | Content gate | done, D-0017 | Run today. |
| 3 | Rule mapping with SME sign-off | open | No gate; no sign-off in `DECISIONS.md`. |
| 4 | Drill effectiveness (tier histogram asserted) | done in part, D-0020 | Built in the Drill. No gate asserts it. |
| 5 | Quiz validity | done in part, D-0025 | Radio: checks G and I. Drill: no collision check; the aspect to title mapping is not one-to-one (UX-01). |
| 6 | One brain | done, D-0018 and D-0025 | Live: a Yard win and a Radio run moved mastery. No gate asserts it. |
| 7 | SR golden vectors, no marathon | done, D-0022 | `AppContext.tsx:79`; live: a second run at once gave +0 %. |
| 8 | Redundancy lint (`distinctObjective`) | open; the signals cap is done, D-0021 | No such check in `tools/`. |
| 9 | A refusal is a no-op that names its condition; negative test of the gate | done in part, D-0017 and D-0029 | Live refusals changed no state. A negative test exists for securement only. |
| 10 | Accessibility | open in five parts | Targets (UX-20). Reduce motion (UX-02). Live regions (UX-20). Colour only (UX-08, UX-14). Keyboard path and text mirror (UX-08). Read aloud at each prompt: in part (UX-26). |
| 11 | Playtest by one tester for each release | not verified | No record in the repository. |
| 12 | Test-ready guard | done, D-0013 | `store.ts:27`; nothing sets `testReady` to true. The word "job-ready" is on Home (UX-24). |
| 13 | Fix order data, then par, then engine | done as a rule, D-0017 | A process rule; not checkable in code. |

### Section 9 — open questions

| # | Question | Status | Checked in |
|---|---|---|---|
| 1 | Each rule number in the Yard confirmed | open, for the SME | No decision. Note S-03. |
| 2 | What makes a cut "unattended" | open, for the SME | D-0029 built the action. The trigger in code is a cut of 2 or more (`model.js:212-213`). Note S-02. |
| 3 | Kick limits and the no-kick car types | open, for the SME | Code comments record an SME call (`model.js:48-50`, `geometry.js:41-42`). No decision in `DECISIONS.md`. |
| 4 | Home domain of `rule.12` | done, D-0022, confirmed D-0024 | `operating`. |
| 5 | Yard speed as a sim check | open (no decision) | The code has no such check, as the document recommends. |
| 6 | Test-ready bar | fenced, D-0013 | — |
| 7 | Puzzle count | superseded, D-0026 | The count is 19. New puzzles are fenced. |
| 8 | Weight of a Yard win | done in part, D-0018 | A win is a plain correct answer. The softer grade is open. |

## 6. Notes for the SME

These notes give the texts as they are. They propose no rule wording.

- **S-01. Two signal drawings belong to two indications each.**
  `{"heads":["R"],"type":"mast"}` is an aspect of `sig.437` (title "437 STOP AND PROCEED", plain
  "Stop, then proceed at RESTRICTED speed.") and of `sig.439` (title "439 STOP", plain "Stop.").
  `{"heads":["G"],"type":"dwarf"}` is an aspect of `sig.405` ("405 CLEAR SIGNAL", plain "Proceed.")
  and of `sig.431` ("431 SLOW TO CLEAR", plain "Proceed, SLOW speed passing signal and through
  turnouts."). The drill marks one of the two names wrong (UX-01). Question: is each drawing correct
  for both items?
- **S-02. Rule 112 has seven wordings in the app.**
  1. `rule.112`, plain: "Rule 112(ii): parking brakes are considered to be hand brakes."
  2. Home card (`store.ts:10`): "Rule 112 — tie it down so it stays put."
  3. Settings sample (`Settings.tsx:36`): "Rule 112 — secure unattended equipment."
  4. Yard chip (`puzzles.js:15`): "Unattended equipment gets a hand brake (secured)".
  5. Yard help (`yardSim.js:205`): "Rule 112 — any car left unattended gets a hand brake."
  6. Yard refusal (`model.js:213`): "… holds a single car — securement applies to a standing cut of 2
     or more (CROR 112)."
  7. Yard refusal (`yardSim.js:446`): "a cut left unattended gets hand brakes before you walk away
     (CROR 112)."
  Texts 5 and 6 disagree on a single car.
- **S-03. A Yard refusal cites a rule, and the Reference entry for that rule says a different thing.**
  - Yard: "AS71 is lined normal — line its switch reverse for the track (CROR 104)." `rule.104`:
    "Rule 104: hand-operated switches in sidings may be considered lined for the normal position
    unless advised otherwise — but verify, because 'considered' is not 'confirmed.'"
  - Yard: "That cut is too long for the lead to hold clear of the ladder — won't clear the switch
    (CROR 114)." and "… is too full — no room to spot … clear of the foul point (CROR 114)."
    `rule.114`: "Rule 114(b): a movement must not foul a track until the switches connected with the
    move are properly lined (or, for semi-automatic/spring switches, the conflicting route is known
    to be clear)."
  - Yard: "… isn't a kickable track here — kicking is only allowed where the special instruction
    says (CROR 113.4)." `rule.113.4`: "Rule 113.4 prohibits them on main track, subdivision track, a
    siding, high-risk locations, shop tracks, and onto/with passenger equipment."
  - Yard chip: "CROR 105 — Yard speed — REDUCED (stop within ½ range of vision); transfers ≤ 15
    MPH". `rule.105`: "Non-main track: REDUCED speed, not exceeding 15 MPH unless signal indication
    or special instructions allow more."
  REVAMP section 9 question 1 (each rule number in the Yard) has no recorded answer.
- **S-04. `rule.573`** is `verified`, has an empty plain text, no rule text and no question.
- **S-05. Rule entries.** 100 of 100 rule items have no rule text (`verbatim: null`). 97 titles are a
  number only. Some plain texts start with one paragraph label, for example `rule.112` "(ii)",
  `rule.114` "(b)", `rule.120` "(a)", `rule.113.5` "(a)". Question: is each entry meant to give the
  whole rule?
- **S-06. `rule.113.4`**, plain text: "Rule 113.4 prohibits them on …". The entry does not say what
  "them" is.
- **S-07. Home card for Radio** (`store.ts:11`): "Radio & hand signals." Hand signals (`rule.12`) are
  in Operating since D-0022.
- **S-08. Switch colours in the Yard help** (`yardSim.js:190-191`): "yellow = lined into the track /
  diverging, green = normal". The code comment in `render.js:2` calls yellow a rule convention. That
  claim is not verified (T12).
- **S-09. Kick limits and car types.** The limits "5 total / 3 loaded" and the no-kick types (tank,
  autorack, centerbeam) are in code comments as an SME call (`model.js:48-50`,
  `geometry.js:41-42`). `DECISIONS.md` has no entry for them.
- **S-10. A flashing lamp under reduce motion** (UX-17). Question: is a lit, still lamp with the word
  "flashing" an acceptable picture of a flashing aspect?
- **S-11. Items that stay open from T11**, seen on screen today: `sig.410`, `sig.418`, `sig.433A`
  and `sig.440` show "⚠ not yet verified — reference only" in the entry (and no mark in the list
  row, UX-07). Six radio steps show "never scored".
- **S-12. The label "Safety-critical — lock this one in."** appears on each miss of an item that
  `severity.ts` puts in S3 (103 items by D-0024). The file says that the SME owns this list.

## 7. What works well and must not be lost in the reskin

1. **Trust is on the screen in words.** Reference entries show "✓ verified", "⚠ not yet verified —
   reference only", "● CN practice (GOI), not a CROR rule". The Radio test says "answered and
   explained, never scored" before the learner answers.
2. **The feedback voice is calm.** "Not quite." then the cause, then the source. No blame.
3. **Each error has a look-up one tap away**, with the same label in three stations. Keep the link;
   repair the loss of state (UX-04).
4. **"Practice the N you missed"** with safety items first.
5. **A Yard refusal changes nothing** and names the track and the condition. The loose-cut refusal
   says what to do next. TIED and LOOSE are words on the track, not only a colour.
6. **Records are honest.** A first clear claims no record. A watched line writes no best record and
   no mastery. A profile with no record shows a blank.
7. **Nothing is locked.** The picker shows tiers and a "next" mark, and each job stays open. The
   picker is a native `select`, so the keyboard works.
8. **The guided Radio is not scored**, and "Why this call" explains each step. The scored mode is
   separate.
9. **No sideways scroll** at 390 or 1440 on each screen measured, also with all three type modes
   on.
10. **Offline works after one load.** With the service worker in control and the network off, a
    reload showed Home, and Reference, the Signals drill, the Yard and the Radio opened.
11. **Settings**: the live sample, the native dialog, Esc to close, focus back on the Settings
    button, and a clear reset question.
12. **Shell targets**: options are 48 px high, shell buttons are 44 px, the focus ring is visible, a
    skip link exists.
13. **No "test-ready" claim** and a slow, true mastery number. Keep the number; add words (UX-12).
14. **Phone flow in the Drill**: after an answer at 390, focus goes to "Next" and the page scrolls
    to the feedback.
15. **Reading modes in the shell**: 9 of 9 probes obey each of the three type modes.

## 8. Not verified

- Behaviour with a screen reader (what is announced, and when).
- A real phone or tablet, and Safari. All phone results come from headless Chromium at 390 x 844.
- The Tauri desktop build.
- Which font a device shows for the dyslexia mode when the named face is not installed.
- The focus ring around the main area on first load on a real device (UX-32).
- The watched-line times (11.1 s and 29.0 s) and the arrival-scene time (5.3 s): one run each.
- Contrast ratios: computed from the colour values in the code, not measured from pixels.
- `tools/sr-vectors.mjs` and the full `npm run check` were not run in this audit.
- REVAMP section 7 item 11 (playtest): no record was found; it is not checkable from code.
- Whether any rule text in the app is correct. This audit does not judge rule content.
