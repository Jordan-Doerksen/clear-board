# Changelog

## [2.0.0] — 2026-11-21

Clear Board 2: the Dusk skin, a new drawing and new controls for the Yard, the upgrade rows that
the owner approved (U-01 to U-46), and the gates. The plan is `specs/clear-board-2-plan.md`. The
decisions are D-0030 to D-0046. Each line comes from the report of its job, or from a check of the
documents job (D1). The row or the ruling is in brackets. No learner used this version. No real
phone, no Safari, no screen reader and no Windows build was tried: each measure comes from
headless Chromium.

### The look
- The app uses the skin Dusk 0.2.0. The six layer files are a locked copy in `src/styles/dusk/`
  (commit `86cfef2`). App names map to Dusk tokens in one bridge file,
  `src/styles/clear-board.tokens.css`. The `cb-` parts are in `src/styles/clear-board.parts.css`.
- The app is one Dusk window that fills the browser. A line of reading text stops at 78
  characters. Reference, the Drill, Signals and the Radio sit in a column of at most 920 px; Home,
  Settings and the Yard use the full window. (`SURFACE-COLUMN`)
- The title bar has a lamp in the Home button, the name, the tag line, a Settings button and a gold
  thread under the bar. The skip link has an opaque ground.
- Home: a lede panel, named rules for the headings, a teal tile for each live domain, a grey tile
  with "Coming soon" for a domain that is not live, station rows with each emoji in an icon
  square, and the tip link as a Dusk button. (`TILE-TONE`, `TILE-CAP-SQUARE`)
- Settings uses the dialog part, the toggle part for the five settings and the attention part for
  Reset. The head of the dialog stays in view while the dialog scrolls. (`DIALOG-HEAD`)
- Reference, the Drill and Signals: framed panels with a lit edge, a sunk frame around each signal
  drawing, the Dusk row list and a teal tile at the end of a session.
- The Radio: lit panels, a gold selected tab, Dusk buttons, a readout strip, a framed question
  panel and a teal end tile. The rails of the scene have a contrast of 5.39:1 against the stage
  (1.46:1 before).
- The Yard chrome: a lit strip for the job picker and the readout, a framed work order with a head
  bar, panels for the drawing, the move builder, the rules and the note, and a gold help summary.
- The icon is the monogram (D-0034): the tab icon, an SVG master and PNG icons of 192 and 512 px in
  the manifest, and a 180 px `apple-touch-icon` link. The browser bar colour and the colours of the
  manifest come from the Dusk token `--glass`. The files of the Vite template are gone.
- With forced colours, six parts get a 1 px border. The edge of an answer option has a contrast of
  3:1 or more. (`FORCED-COLOURS`, `OPTION-EDGE`)

### The Yard
- The drawing is look C2 (D-0031, D-0032): one inline SVG with its words as text, with rails, ties,
  a car shape for each type, an engine, a bar for the room on a track, break marks and a legend. It
  has a wide form and a tall form. The form is chosen when a job starts and is kept for the job.
  The canvas and `render.js` are gone. (`FORM-CHANGE`)
- New words of the drawing: NORMAL or REVERSE at each switch, ENGINE, BUILD k / m, "foul point"
  and the legend. The SME confirms the rail terms (`C2-WORDS`).
- Each word of the drawing is 12 px or larger. A still trace shows the last move. A travel leg
  takes 840 ms in and 420 ms out (600 and 600 before). Before a print, the drawing lays out for
  the page. (`TEXT-FLOOR`, R7-P15, R7-P4)
- Each switch, AS71 to AS76, has a native button on its 44 px box. Tab reaches each button, and
  Enter or Space lines the switch. The name of the button says the track and the lining. The lines
  of a switch list are buttons. (P-02, U-09, `SW-NAME`)
- A text list of the yard (`#yard-mirror`) and one status region (`#yard-live`) give the state of
  the yard and the result of each move as text. The SME reads the words of the list before the
  change reaches `main` (`MIRROR-WORDS`). (P-03)
- "Reduce motion" ends each move, kick, arrival, departure and watched step at once, with the end
  state, its words and the trace. The setting is read at each move. Before, it made each move about
  six times slower. (P-01)
- "Watch optimal" opens a stepper: Back, Next, "Play all", Stop and a list of the steps. A watched
  line gets no done mark and no win sound. The done marks of an older profile stay. The Yard asks
  before "Watch optimal" or a change of job discards the moves of the learner. (R7-P8, U-04, U-12)
- Nothing locks during a move: a new press ends the move at its end state and then acts. The
  result shows when the move starts. (R7-P11)
- After Depart the lead is empty, and the job stays closed until Reset. (R7-P14)
- The arrival of job p6-road plays only on "▶ Show the arrival", with "Wait for the train." while
  it plays. (R7-P5, U-39)
- A move log lists each call with its result and its cost in words, with "Play again" and "Before
  and after". Neither changes the game. The SME checks the words of the cost. (R7-P10, R7-P12)
- Each finish starts with "Job done." The record reads "5 moves, 2 couplings", and the readout says
  "Couplings". (U-23, U-40)
- The head bar of the drawing gives the route ("Route: LEAD → AS73") and the goal ("BUILD AS75
  0 / 6"). Dashed outlines show where the move in the builder lands. (`ROUTE-WORDS`, `YARD-HEAD`,
  `LANDING`)
- The sound is off by default and has its own switch. The choice holds between visits, and "Reset
  my progress" clears it. Secure, a flag and a right certify play one new confirm sound. (R7-P2,
  U-36, R7-P9)
- The first job says in view how to line a switch and how to call a move, and the builder starts
  on a track of the job. A key line explains the marks of the job picker. An empty banner does not
  show. The refusal of a switch-list line has new words. (U-16, U-39)
- "Look it up" opens the entry in a dialog over the Yard; the job and the moves stay. A switch throw
  clears a refusal that is no longer true. (U-17, R7-P16)
- The selects have the labels "Pick a job", "Action", "Which track" and "cars". The sound button
  reads "Sound on" or "Sound off". The Yard has one heading, "The Yard", under "← Home". (U-20,
  U-29)
- Each Yard control is 44 by 44 px or more. The job picker does not push the page sideways at
  320 px. Bigger text, the dyslexia type and higher contrast reach the chrome. A refusal shows a ✕
  mark and ink text, with red on the edge and the mark only. (P-05, P-11, P-06, P-07)
- Only a car mark, a number or a track id of the job line takes the mono face. The message well and
  the note take the full width, and their text stays at the reading measure. (`Y-FIX`, `TRACK-MONO`)
- The Yard loads and plays when the browser refuses storage. When the learner leaves the Yard, it
  stops each timer, animation frame, listener and pending note of the win melody. After Certify,
  focus stays in the work order. (U-07, `UNMOUNT`, `SOUND-STOP`, `CERTIFY-FOCUS`)
- A refused call to a job that is done is said in the status region, and "Job done." stays on the
  screen. The work order says where the cars of the job stand now. (`WIN-HOLD`, `FROM-NOW`)

### Access
- Each control of the shell and of the stations is 44 by 44 px or more. Smoke case 13 checks the
  controls of each route and of Settings at 390 and 1440 px. (P-05)
- Each route has its own page title, for example "Drill — Clear Board". At the first load focus does
  not move. After a change of route, focus goes to the station heading of the view. Each station
  has one heading. (U-29, `C7-DRILL`)
- After "Next" in the Drill or in the Radio test, focus goes to the heading of the next question. In
  the guided Radio, focus stays on "Key the radio". (U-14)
- The Drill and the Radio test put the verdict into a live region. A miss on a safety-critical item
  goes into an alert. (U-19) What a screen reader says: not verified.
- The emoji of a control is hidden from a screen reader. The sign ▶ stays in the name of "▶ Watch
  optimal" and of "Key the radio ▶", and the sign ⚠ stays in the trust mark of four Reference rows.
  (U-41) What a screen reader says: not verified.
- The guided Radio: "← Home" first, one heading, mode tabs that move with the arrow keys, Home and
  End, and a log that is a Tab stop with the role "log". The distance or the status shows as page
  text above the next call, with the words of the scene. Bigger text, the dyslexia type and higher
  contrast reach the text of the scene. (U-21, U-22, P-06) What a screen reader says: not verified.
- Settings: each toggle shows a focus ring, its state shows with forced colours, and each checkbox
  is tied to its second line. "Reset my progress" is plain text. (P-08, P-09, P-13)
- "Reduce motion" follows the device setting live. "Higher contrast" starts from the device
  setting. Settings says why a row is on. (U-13)
- The dyslexia mode draws Atkinson Hyperlegible from two font files that ship with the app, beside
  the text of their licence, the SIL Open Font License 1.1. The letter and word spacing of the mode
  reach each button, input and select. (U-30, `DYS-SPACING`)
- Read aloud speaks its confirmation, says "No voice on this device" when that is true, and stops
  on a change of route. In the Drill and in the Radio test it also speaks the options and the
  feedback. (U-31)
- Reference: the result list is a list of buttons, and "No match. Try another word." stands outside
  the list. (P-12)

### Learning
- The Signals drill asks no question with a drawing that two signal items share: the Drill does not
  choose between the two names (U-01; note S-01 for the SME). A signal entry and the Drill use each
  different drawing one time. The button of a signal entry reads "Open the Signals drill →". (U-37)
- After an answer in the Drill and in the Radio test, the right option says "Correct answer" and a
  picked wrong option says "Your answer". A miss names the right answer. (U-06)
- In the Drill feedback, "Next" is the main control and "Look it up" is a text link. (U-38)
- "Look it up" in the Drill, Signals and "Call it yourself" opens the entry in a dialog on top of the
  station. The session, the answer and the scroll stay, and closing the dialog returns focus to
  "Look it up". (U-17)
- A learn card shows a new item one time before its first question: the title, the chip "New item",
  the plain words and each different drawing. One other screen comes between the card and the
  question. The mastery model does not change. A first session can hold up to 10 learn cards and 10
  questions. (U-28, `LEARN-GAP`, `SESSION-LENGTH`)
- The end of a session gives progress in words: the right answers, the new items started and when
  the items come back. The note "This session was practice only" shows only when no answer of the
  session counted. The review button counts its items and its questions. The Radio test says "did
  not move" when the change is 0. (U-26, `U26-NOTE`, U-15)
- The Drill and the Radio test read the mastery after the decay. Home shows the current mastery
  after a change of route. The stage name agrees with "N% mastered" at each edge. (U-15,
  `MASTERY-NOW`)
- Reference: each row shows its domain and its trust mark in words, and the list has one group for
  each kind of entry. The search also reads the source, the rule text and the domain. A pressed row
  opens its entry under the row and moves focus to it. An entry says when the app holds no rule
  text or no text for it. The four radio steps with the source "SME" read "● No CROR citation in the
  verified source". Reference and the look-up dialog show one entry component. (U-02, U-32, U-03,
  U-11, U-08, `ENTRY-ONE`)
- Home: one main control, "Start here", or "Continue" with "N due now"; "N%" and "Drill →" on each
  live domain tile; on the Radio tile, a line that says where the calls are scored; the line
  "Practice, not the official test."; no Exam row; and a tip link that says that it opens a new tab
  and sends no page address. (U-11, U-24, U-25, U-26, U-27, U-33, U-35, U-42)
- The Radio has one heading, "Radio walkthrough", and "← Home" first in both modes. A change of mode
  keeps the place in each mode. The end of a session says "Session done" and offers "← Home". The
  guided Radio no longer promises a "next layer". (U-29, U-17, U-40, U-35)
- The owner approved the new words of each job (`specs/words/`), the words of the rows U-11, U-24,
  U-25, U-27, U-33, U-37 and U-40 among them (D-0047). The checks of the SME that those files name
  stay open.

### Progress, loading and updates
- On load, the app repairs a damaged stored profile: each readable item stays, and the stored text
  is kept under a second key. When a screen cannot draw, the app offers "Save a copy of the stored
  data" and "Start fresh". (U-05)
- Settings saves the progress to a file and loads it again. A load gives the profile a new start
  date, so that another open copy of the app does not merge old answers back into it. One sentence
  says that a clean-up of the site data in the browser deletes the progress. (U-18,
  `LOAD-NEW-PROFILE`)
- Two open copies of the app keep the answers of both. (U-34)
- "Reset my progress" also removes the sound choice of the Yard and the copy of an older profile.
  (U-36, `RESET-COPY`)
- When a content file does not load, the shell says "Part of the library did not load." with "Try
  again". Home shows no false "Coming soon", and the Drill, Signals, Reference and "Call it
  yourself" show the notice in place of a sentence that is not true. When the module of a station
  does not load, the station says "This station did not load." with "Reload". (U-07)
- A new version waits until the learner presses "Reload" in the notice "A new version is ready."
  The page never reloads by itself. (U-10)
- The shell calls `unmount()` of a station island before it empties the host. (`UNMOUNT`)

### The gates
- `npm run check` runs 12 steps through `tools/check.mjs`: the frozen-file hash gate (baseline
  `94a41c5`), the Dusk lock check, the raw-colour lint, the name check, lint, the type check, the
  unit tests, the four scripts of before (the schedule vectors, the solver, the content and trust
  check, the securement check) and a report of the signal drawings that two items share (U-01).
- 79 unit tests cover the schedule, the store, the severity, the Drill selection and the guard of
  the grading, the options of the Radio test and the frozen signal drawing function. The Drill
  selection and the Radio options are pure functions (`src/core/drill.ts`, `src/core/radio.ts`),
  moved with no change of behaviour, and the app runs the guard that the tests cover. (U-44,
  `U44-GUARDS`)
- `npm run test:browser` runs 24 gate cases in Chromium: among them an update with a renamed station
  chunk, a failed load, refused storage, the 44 px targets, the reading modes, the offline cache
  budget of 5 MB (U-43), the focus of a route, the learn card, and a Yard job played to a win by
  touch at 390 px and by keyboard at 1440 px. A word tape (a SHA-256 and a word count) guards the words of the guided Radio. The
  look harness compares pictures and page facts with a baseline build and names the row of each
  allowed change.
- `.github/workflows/check.yml` runs the check, the build and the browser test on each pull request
  and on each push to a branch other than `main`. `.nvmrc` holds Node 22.23.5. (P-18, P-19)
- The package is `clear-board`, version 2.0.0. `src-tauri/tauri.conf.json` still holds 0.1.0: the
  desktop shell waits for a session that can make the Windows build (`TAURI`).
- The securement check has 15 assertions. Two documents said 13. (P-27 item 7)
- The documents say what is true after Wave 2c, and they name roles, not persons (D-0045, D-0046).
- The offline cache of this version is 17 files, 805,685 bytes: 15.4 % of the budget.

## Before 2.0.0 — no version number and no tag

The work below had no release heading and no tag. `package.json` held the version 0.0.0 and
`src-tauri/tauri.conf.json` held 0.1.0. Each entry describes its own day.

### Line endings belong to the repository (2026-09-22)
- `.gitattributes`: each text file is stored with LF line endings, so the bytes on disk do not
  depend on a setting of the machine (commit `94a41c5`). Clear Board 2 later took this commit as
  the baseline of the frozen files.

### Securement becomes a decision, not a flag (2026-07-28)
- **Rule 112 is now something you do.** The engine used to tie down every cut for you — spotting 2+ cars
  silently set `secured = true`. There's a real **SECURE** action now: spotting leaves cars standing
  loose, walking away from a loose cut isn't a win, and a kick backstop must be tied by you. (D-0029)
- **Every par is unchanged.** SECURE costs zero engine moves, which is the honest physics — `moves`
  counts engine legs and hand brakes are the conductor on the ground. All 19 pars re-proven, none
  dropped to "optimality unverified". (D-0029)
- **Visible on the track:** a standing 2+ cut is tagged **TIED** or **LOOSE** on the canvas itself —
  words, not colour alone — instead of only surfacing in a banner after you try to leave. The refusal
  names the track and cites 112.
- **New gate:** `tools/securement-check.mjs` (GATE 3 in `npm run check`) — 15 assertions so the mechanic
  can't quietly revert. Writing it caught a false pass in the first version of the test, where a kick was
  being refused for having an empty engine rather than an untied backstop. (D-0029)
- **Deferred:** the point-protection acknowledgment on shove. It would add a confirmation to the primary
  verb several times a minute — a game-feel call for the owner, not a silent one. (D-0029)

### Offline for real — PWA wired (2026-07-28)
- **Works with no signal.** `vite-plugin-pwa` was a devDep for months without being wired; it's now
  configured and shipping a service worker. Verified by building, serving `dist/`, **stopping the
  server**, and reloading: `index.html` and all five content files still resolved from cache and a hard
  navigation to `/#/drill` rendered a real signal question. (D-0028)
- **Caught a trap that would have shipped a lying app:** Workbox's default glob excludes `.json`, so the
  default config would have advertised offline support and then 404'd the entire rulebook offline. The
  glob now names `json` explicitly. (D-0028)
- Fixed `index.html` referencing `/favicon.svg` absolutely while `base` is `'./'` — it 404'd on the Pages
  subpath and inside Tauri. Added `theme-color`.
- **The app icon is still open and needs the owner** — see D-0028. The manifest points at the existing
  mark rather than inventing a logo.

### The "clean" badge stops guessing; per-puzzle best records (2026-07-28)
- **The "clean" badge was praising sloppy runs.** It scored against `ceil(par/2)` — a placeholder that
  was wrong on **16 of 19** puzzles and always too generous (`p2-build` called 4 joints clean when 2 is
  optimal). Every puzzle now carries a solver-derived `optJoints`, and `tools/solve.mjs` hard-fails if it
  ever drifts. Proven with a deliberate corruption, which failed the gate exactly as it should. (D-0027)
- **Per-puzzle best records** — `{moves, joints, beatPar, departed}` per puzzle. The picker shows
  `· your best 6m` where a record exists and **blank where none does**; the win banner reads "new best
  (was 7m/3j)" or "your best: 5m/2j". A watched-optimal demo never sets a record — it's the answer, not
  your run. (D-0027)
- **#20 needed no work:** the `authority` domain has 37 drillable verified items and `protection` isn't a
  live domain, so the "empty domains reading 0%" the design doc describes doesn't exist. (D-0027)

### The Yard's ramp becomes visible (2026-07-28)
- **`tier` was a dead field.** Every puzzle has carried a tier number since the start and *nothing read
  it* — the picker was a flat list of all 19 in array order. The authored ramp existed in the data and
  never reached the screen. The picker now groups by tier (`<optgroup>`, still a native select — keyboard
  and screen-reader correct for free), labelled by what each tier teaches, with **par on every option**. (D-0026)
- **The cliff was a sequencing bug, not missing content.** `p1-sort` (par 19) sat sixth in that flat list,
  right after three par-5 warm-ups, and was the only tier-0/1 puzzle introducing the `order` rule. It moves
  **tier 1 → tier 3**, filling the previously empty tier 3 and sitting beside the rule it teaches. Layout,
  par and rules unchanged — the solver proves the same par 19. Tier 1 now reads 7/9/9. (D-0026)
- **✓ / → marks.** Completed puzzles show ✓; the first uncompleted one in tier order shows →. Rebuilt on
  every win so they never go stale. The arrow is a **marker, not a lock** — all 19 stay selectable.
- Corrects `REVAMP-DESIGN.md` §4 #16, which claimed tiers 2/4/5/6 held 1–2 puzzles each (tier 2 has five)
  and put the cliff between tiers rather than inside tier 1.

### Radio joins the one brain — "Call it yourself" (2026-07-28)
- **The last dead-end station now writes to mastery.** Radio has two modes: **Guided** (the SME-tuned
  walkthrough, byte-for-byte, still **ungraded** — REVAMP §5: merging it with grading turns a
  confidence-builder into a test) and **Call it yourself**, which hides the call and asks you to pick it
  from three real transmissions. Correct calls grade into the SAME SM-2 model the Drill and the Yard use,
  through `recordRadioStep` with the Yard's exact F1/F2 guards. (D-0025)
- **Eight of the fourteen calls are gradable — deliberately.** A step is graded only if it carries a
  verified CROR citation. The two CN GOI steps (set-and-center, cutting the air in) and the four uncited
  closing counts are `operating-practice`: played, explained, never scored — and the screen says so
  ("● CN practice (GOI), not a CROR rule"). Gate check **H** makes it structural: a graded radio step must
  cite a verified CROR rule, and a CROR-sourced step must be gradable. (D-0025)
- **Distractors are other real calls**, never invented — the genuine confusions are which call belongs
  where (engine number past two car lengths, "over" on a running count, feet too early). Gate checks **G**
  (radio-script indexes radioSim's STEPS 1:1) and **I** (every call has ≥2 usable distractors) pin it.
- **`profile.radio.done` retired.** It graded attendance and could never decay; old profiles drop it on
  load. The declared-but-unused `radio-script` item type is now real content
  (`public/data/radio-script.json`, 14 items) and the Drill explicitly excludes it.
- **Signal Reader:** rec #19's "add a graded mode" was already built — `/signals` has been the graded
  read-the-aspect Drill since D-0016. Instead of duplicating it, Reference's aspect card gets a
  **Drill these aspects →** route into it.
- Verified live: fresh profile → call 1 correct moves Radio 0 → 0.0026 (exactly one item graded); a 14/14
  run grades exactly the 8 verified steps and reads "+2% → 2%"; an immediate perfect replay moves mastery
  by **zero** (anti-marathon); misses deep-link to the cited rule and feed the review round; guided mode
  unchanged; radioSim keeps its own lazy chunk. `npm run check` A–I green.

### One-brain mastery, verification gates + learning-loop wins (2026-06-25)
- **The Yard now feeds the single mastery model.** A genuine puzzle win grades the CROR rule items
  the puzzle exercises (its `rules:[...]` chips → real `rule.*` items) into the SAME SM-2 model the
  Drill uses — closing the "switching/securement read 0% no matter how you play" hole. Only
  **verified** items, and only when **due** (no familiarity-farming by replaying an easy puzzle);
  watched-optimal demos don't grade. The byte-for-byte engine is untouched — wiring lives in
  `src/stations/yardSim.js` + `AppContext.recordYardWin`. Verified live: a `p2-kick` win moves
  Switching 0 → 0.017, Securement 0 → 0.011. (D-0018)
- **Committed verification gates** (`npm run check`): `tools/solve.mjs` proves every puzzle's par is
  achievable **and** optimal (19/19 pass) by driving the existing in-app solver; `tools/content-check.mjs`
  enforces the F1 trust firewall + data integrity (legal trust enum, no duplicate ids, answer ∈ choices,
  every `ruleId` resolves, **no graded question on a needs-review item** — 226 questions, all clean). (D-0017)
- **Errors now teach.** Every Drill miss and every Yard refusal carries a one-tap **Look it up →**
  to the cited rule's plain-language Reference entry (`/reference?focus=<id>`; cause → rule → correct
  action, REVAMP §6). (D-0020)
- **Tier-aware Drill seeding.** A fresh profile starts gentle — tier-1 questions only — so the first
  session is winnable, never tier-3 cold; the band widens (tier 2, then 3) as domain mastery grows,
  using the `tier` already on every question in `rule-questions.json`. (D-0020)
- **Deploy gated.** The GitHub Actions Pages build runs `npm run check` before `vite build`, so a
  broken par or a leaked `needs-review` item can't ship. (D-0019)
- **Signals can't read "mastered" on paper.** The signals domain mastery is capped until the learner
  correctly reads ≥1 actual SVG aspect — a safety backstop for a sight-read skill (REVAMP rec #9). (D-0021)
- **Thin domains drill again.** A domain with too few items (securement's 3) no longer dead-ends under
  the 4-question floor — the Drill pads with distinct authored facets of its rules (≤3 per rule so none
  dominates; a same-session repeat only records a miss, never a correct re-advance). (D-0021)
- **`rule.12` flagged, not moved.** The swarm's "re-file hand signals out of radio" doesn't match the
  data — the item titled Rule 12 actually carries the 123.2 doubt principle — so it's left for SME to
  resolve, not guessed. (D-0021)
- **`rule.12` corrected to Hand Signals — from the verified source.** Resolving the above: CROR Rule 12
  *is* hand signals, and the item's 6 questions already were hand-signals questions. Its `plain` (the
  123.2 doubt text, already in `rule.123.2`) was replaced with the verbatim CROR hand-signals content
  from `training-assistant`, and the item + its 6 questions moved `radio` → `operating`. Not guessed. (D-0022)
- **Anti-marathon gate.** A correct answer advances the SM-2 schedule only when the item is *due* —
  cramming can't farm familiarity (validation #7); misses always count. The Drill's same-session guard
  is removed (subsumed). (D-0022)
- **SR golden-vector pin.** `tools/sr-vectors.mjs` (now in `npm run check`) transpiles `sr.ts` and pins
  the exact SM-2 schedule so the anti-false-confidence engine can't silently drift; SPEC §Retention
  reconciled to the real conservative V1 values. (D-0022)
- **Practice your misses.** The Drill remembers what you got wrong and offers a focused "Practice the N
  you missed →" review round at the end (built from exactly those items, any tier). (D-0023)
- **Real S1/S2/S3 severity.** `src/core/severity.ts` classifies every item (domain defaults + a reasoned
  override list — a reviewable v1) into S1 knowledge / S2 rule / S3 safety-critical. A Drill miss now shows
  tone by severity ("Safety-critical — lock this one in" for S3, "Worth nailing" for S2), and the "practice
  your misses" round puts safety-critical misses first. `rule.12 = operating` confirmed. (D-0024)
- **Design pass:** `REVAMP-DESIGN.md` (+ `REVAMP-APPENDIX.md`) — a multi-agent review of the whole
  trainer (consolidated rule → mechanic map, prioritized backlog, redundancy verdict, gated validation
  checklist, sample taxonomies, open SME questions).

### Rebuilt on React + TypeScript + Tauri (2026-06-24, D-0016)
- **Stack moved off vanilla ES modules to Vite + React 19 + TypeScript** (reverses D-0005's
  "no build"). The offline-PWA + local-first + never-commit-the-PDF constraints still hold.
- Core ported 1:1 and typed (`src/core/sr.ts`, `store.ts`); the four verified data JSON files
  migrated **untouched** to `public/data/`; the signal SVG renderer kept **byte-for-byte**
  (`src/core/signal.ts`, wrapped in `<Signal>`).
- Stations rebuilt as components: Home/path, Reference, Drill (rules/signals/defs). **The Yard**
  and **Radio** kept byte-for-byte as imperative islands (engine/station unchanged) behind a shared
  `useImperativeStation` hook. React's auto-escaping removed the hand-rolled `esc()` from every
  station — a safety win for verbatim CROR text.
- **Feature parity** with the vanilla build, verified live (all five stations, settings, profile).
- **Desktop:** Tauri v2 shell (`src-tauri/`) → self-contained `Clear Board.exe` (~18 MB, OS WebView2)
  + NSIS installer; verified launching. `npm run tauri build`.
- **Deploy:** Pages switched from legacy root-serve to a GitHub Actions build (`.github/workflows/deploy.yml`).
- The vanilla build is retired (recoverable in git history before this commit).

### Added
- Design gate (2026-06-23): `SPEC.md`, `DECISIONS.md`, adversarial `GAP-REVIEW.md` — **gate-clean for V1**.
- Project scaffold: README, MIT LICENSE, .gitignore, this changelog.
- Runnable shell (`index.html`): qualification-path home, accessible dark theme, settings
  (reduced-motion, dyslexia font, text size, read-aloud, high contrast), local profile skeleton.
- **Shared core** as ES modules: `core/sr.js` (SM-2-lite spaced repetition) + `core/store.js`
  (profile, content loader, mastery, gradable-only filter).
- **Content library**: `data/definitions.json` — 63 CROR definitions migrated verbatim from the
  old CROR Quiz, character-for-character verified, cited + `trust:"verified"`.
- **Reference station** (`stations/reference.js`): search, plain-language first, rule text one tap
  deeper, trust badge + citation.
- **Drill station** (`stations/drill.js`): adaptive MC (term↔definition), SM-2 scheduling, citation
  on every answer, mastery feeds the path. F1 enforced — only verified items are graded.
- `app.js`: modular shell with hash routing (home / reference / drill) + settings.
- Verified end-to-end on preview (home, search→detail→verbatim, answer→grade→mastery persist).
- **Signals domain live**: `stations/signal-render.js` (the verified `drawSignal` SVG renderer,
  copied verbatim) + `data/signals.json` (42 indications — 38 verified, 4 needs-review/reference-only).
  Reference renders the aspect variants; Drill is now type-aware (definitions → term↔def, signals →
  read-the-aspect) over one profile; plus a signals-only "🚦 Signals" station.
- **Tip jar**: the tip jar link wired into the footer.
- **Rules / operating content live**: `data/rules.json` (100 cited rule concepts) +
  `data/rule-questions.json` (226 authored MC, verbatim from the old CROR Quiz BANK; answer∈choices
  verified on all). A third drill type (authored operating-rule MC). The remaining domains go live —
  switching, securement, radio, authority, and a new **Operating** bucket — so all 7 light up.
  Live domain cards are now one-tap drills (`#/drill/<domain>`).

- **The Yard live**: the switch-list switching sim ported in as a station — 7 verified engine
  modules copied byte-for-byte (SHA-256 identical), `main.js` adapted into a scoped `mount()`
  (CSS namespaced under `.yard-wrap`, no leak), 19 solver-verified puzzles, Watch-optimal,
  reduced-motion aware, started muted unless audio is on. Puzzle wins record to `profile.yard.completed`.

- **Radio station live**: the "Back to a Joint" call walkthrough ported **verbatim** from the CN
  trainer (14 SME-tuned steps, wording untouched; scoped CSS; completion → `profile.radio.done`).
  One walkthrough for now — flagged to grow.
- **Deployed**: the build went live on GitHub Pages. (Not true now: GitHub Pages is off for this
  repository, plan fact T13.)

### Next (as written before 2.0.0)
PWA and offline came on 2026-07-28 (D-0028). The save and the load of the progress to a file came
in 2.0.0 (row U-18). The Exam station stays deferred (D-0013).
- More radio walkthroughs (only "Back to a Joint" exists — the weakest section).
- The Exam station (needs the SME "test-ready" bar first).
- PWA/offline (service worker + manifest); profile export/import.
- Surface yard/radio progress on the path/home.
