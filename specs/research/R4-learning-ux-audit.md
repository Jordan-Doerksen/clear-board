# R4 — Learning and UX audit of Clear Board

Wave 1, research. Read-only on code and content. Date of the audit: 2026-11-20.
Branch `claude/peaceful-mayer-qat99l`, commit `1e48578`.

- Check: confirmed. The branch head is now `cb51d4b`. `git diff 1e48578 HEAD -- src public tools
  index.html vite.config.ts package.json` is empty, and the work tree has no change in those paths.
  The served build holds the strings of the source ("Not so fast", "your best: ", "Hardware variants").

This report was checked on 2026-11-20 by a second, adversarial pass. Each finding, each table row
and each note now has a line or a column "Check". The check record is in section 2.

## 1. Summary

- 40 findings. 9 HIGH, 19 MEDIUM, 12 LOW. The first pass had 36 (9, 17, 10). The check added
  UX-37 to UX-40.
- The most serious finding is in the Signals drill. One drawing belongs to two indications in the
  data. The drill can offer both names and mark one of them wrong (UX-01). The app showed this on
  screen in the audit and again in the check.
- Fact T4 of the plan is wrong in direction. Reduce motion does not make the Yard faster. It makes
  each move 5.7 times slower (UX-02).
- Two paths lose the work of a learner: "Look it up" ends the session or the job (UX-04), and there
  is no export or import of the profile (UX-05).
- The shell (Home, Reference, Drill, Settings) obeys the three type modes. The Yard and the guided
  Radio do not (UX-16). Reduce motion has one failure in the shell: a flashing lamp in Reference and
  in the Drill does not stop (UX-17).
- No screen had sideways scroll at 390 px or at 1440 px, with the modes off or on.
- No numbered finding was refuted. 9 findings were corrected. Section 10 lists the statements that
  were withdrawn.

- Check: corrected. The count is now 40. The first pass said that the shell obeys "the four reading
  modes"; UX-17 contradicts that for reduce motion, so the bullet now says three type modes. The
  sideways-scroll bullet is confirmed for the modes of the app only (6 routes and the Settings dialog,
  at 390 and 1440, modes off, each type mode on, and all three on). A text-spacing override of the
  browser was not tested here.

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

- Check: confirmed, with one figure not verified. The three gate scripts were run again and gave the
  same results (`solve.mjs`: "19/19 passed"; `content-check.mjs`: "All checks A–I passed";
  `securement-check.mjs`: "Securement behaves as a player action"). `tools/sr-vectors.mjs:11-15`
  writes `.gate/sr.mjs`, so it was not run. The profile shape matches the two cited files. The spread
  of "27 ms or less" belongs to the first pass and cannot be re-derived; the spread in the check was
  48 ms or less.

### Check record

- Method of the check: each cited file and line was opened. Each data count was computed again from
  `public/data/*.json` with a read-only script. Each behaviour was driven again in the built app with
  new scripts, on fresh browser contexts. Each contrast ratio was computed again. Each picture in
  `specs/research/pictures/R4-*.png` was opened and compared with its claim.
- Scripts and working pictures of the check are in
  `/tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/R4-check/`.
- Machine load during the timing runs: load average 1.2 to 2.2 on 4 cores. Each timing in a Check
  line is the median of 3 runs unless the line says "one run".
- Web research: none. One statement depends on a licence (UX-16); it is marked "not verified".
- Meaning of the words: "confirmed" means that the check derived the same result again. "corrected"
  means that a figure, a line number, a statement or a fix changed; the Check line says what.
  "not verified" means that the check could not reproduce the item.
- Fence: each fix was tested against section 4 of the plan. A fix that changes a behaviour, a word
  or a control is an upgrade row (job U1 or Y4). It is not part of a reskin job (fence item 3).
  Each Check line says where a fix was rewritten.

| What was checked | Confirmed | Corrected | Refuted | Not verified |
|---|---|---|---|---|
| Numbered findings UX-01 to UX-36 | 27 | 9 | 0 | 0 |
| Plan facts (4 rows) | 4 | 0 | 0 | 0 |
| REVAMP status rows (50 rows) | 48 | 1 | 0 | 1 |
| Notes for the SME S-01 to S-12 | 10 | 2 | 0 | 0 |
| "What works well" items (15) | 13 | 2 | 0 | 0 |

Findings added by the check: 4 (UX-37 to UX-40). Notes for the SME added: 4 (S-13 to S-16).
The verdict of the check carries the first row and the count of added findings.

### Plan facts checked

| Fact | Result | Measurement | Check |
|---|---|---|---|
| T2 | Confirmed. | At 390 px the canvas is 352 x 121 CSS px. Scale 0.2627. A 9 px car number draws at 2.36 px (1.58 px after the shrink loop in `render.js:171-172`). The plan says "about 2.6". | confirmed. Measured 352 x 120.8, scale 0.2627; 9 x 0.2627 = 2.36; the loop stops at 6 units = 1.58 px. |
| T3 | Confirmed. | Hit radius 18 units = 4.73 CSS px at 390. A tap 6 px beside a switch did not line it. The Tab key reaches no switch (tab stops listed in UX-08). | confirmed. A tap 6 px beside the centre of the AS73 switch left the mark green. A tap 4 px beside it lined the switch. 16 Tab presses reached no switch. |
| T4 | **Wrong in direction.** | `anim.js:17` multiplies the duration by the speed factor. `yardSim.js:229` sets the factor to 6 for reduce motion. A PULL takes 1590 ms with motion and 9012 ms with reduce motion. See UX-02. The line is `yardSim.js:228-229`, not 227. | confirmed. Measured 1587 ms and 9006 ms. The code gives 1480 ms x 6 = 8880 ms of tween. |
| T10 | Confirmed. | `src/stations/Home.tsx:7-11` and `:64`. More emoji are listed in UX-33. | confirmed. The plan cites `Home.tsx:6`; the icons are on lines 7 to 11. |

## 3. Findings

Form: id, title, severity, evidence, fix, effort (S under half a day, M one to two days, L more),
risk of the fix, the line "Frozen", and the line "Check".

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
  - Rate: 47 of 1385 signal questions showed one of the two shared drawings (3.4 %). The case with
    both names in the options appeared 7 times in those 1385 questions (0.5 %). The first pass saw
    12 of 267 (4.5 %) and one two-name case; an earlier run of the first pass, with 175 signal
    questions, showed a shared drawing 3 times and the two-name case 0 times.
  - The gate does not look for this. REVAMP section 7 item 5 asks for a one-to-one mapping of aspect
    to title. `tools/content-check.mjs` has no such check.
- Fix: in `Drill.tsx`, do not ask a signal question with a drawing that belongs to more than one
  indication. Add a check to `tools/content-check.mjs` that reports each shared drawing and does not
  fail the gate. Keep this until the SME rules on the two pairs (section 6, note S-01). Do not edit
  the data. Do not accept both names as correct in code: that is a decision about signal content.
- Effort: S
- Risk: LOW
- Frozen: no (the selection code and the gate). The data question goes to the SME.
- Check: corrected. What stays: the data pairs, the code lines and the picture are confirmed. The
  check reproduced the mirror case on screen: one red lamp on a mast, options "439 STOP",
  "437 STOP AND PROCEED", "435 SLOW TO STOP", "408 CLEAR TO DIVERGING"; the choice "437 STOP AND
  PROCEED" got "Not quite. 439 STOP — Stop. Safety-critical — lock this one in."
  (scratch `R4-check/pics/signal-two-names-marked-wrong.png`). What changed: the rate. 150 fresh
  sessions gave 1500 questions, 1385 of them signal questions; 47 showed a shared drawing and 7 had
  both names. The computed rate for a uniform pick is 3.1 % and 0.25 %. A second run of 1209
  questions had one two-name case. The fix changed in two points. A check that fails would make
  `npm run check` red while the data is frozen (fence items 1 and 10), so the check must report only.
  `tools/**` belongs to job G1 (fence item 9). The red mast lamp is in the list of `sig.439` two
  times (2 of 5 entries), which raises its weight (UX-40).

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
  Read the setting at each move, not only at mount. The watched line needs a static form also: one
  step, one pause, and the banner words for each step.
- Effort: S
- Risk: LOW
- Frozen: no
- Check: confirmed. Medians of 3 runs: motion on 1587 ms (1575 to 1623); app setting on 9006 ms
  (9000 to 9011); OS preference only 9012 ms (9010 to 9024). The ratio is 5.7. With the OS preference
  on and the app setting stored as off, a PULL took 1591 ms: the app setting rules after the first
  visit. A "Reset" click 300 ms into a move changed nothing. Watched line: 11.1 s and 29.0 s (one run
  each). Added: the setting is read one time at mount (`yardSim.js:228`). A switch of "Reduce motion"
  in Settings with the Yard open left the PULL at 1566 ms; after a leave and a return it took
  9001 ms. Fence: the fix is behaviour, so it belongs to job Y4, not to a reskin.

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
- Check: confirmed. 219 rows. Detail at y = 19 419 (1440) and y = 27 816 (390); `scrollY` 0; focus on
  the row. Deep link `?focus=rule.112` at 390: detail at y = 768. The old entry stays: with "405 CLEAR
  SIGNAL" open, the search "kicking" showed two rows and the entry "405 CLEAR SIGNAL" below them.
  Fence: the fix is behaviour (job U1), not a reskin.

#### UX-04 — "Look it up" ends the session or the job, and there is no way back
- Severity: HIGH
- Evidence:
  - Drill: at question 3 of 10, "Look it up →" opened `#/reference?focus=sig.431`. Reference has
    only "← Home". The browser Back button returned to "Question 1 of 10 / 0 correct". The list of
    misses for the review round was also gone. Code: `Drill.tsx:244` navigates away; the session
    lives in component state (`Drill.tsx:73-79`).
  - Yard: after one PULL (readout "Moves 2 / par 5"), a refusal, "Look it up →" and Back, the readout
    was "Moves 0 / par 5 · Joints 0". Code: `yardSim.js:652` and `imperativeStation.ts:37` (the host
    is emptied on leave). One job has par 19.
  - Radio "Call it yourself": the same pattern (`RadioTest.tsx:192`). A switch of mode also resets
    the run: "Call 2 of 14 / 1 correct" became "Call 1 of 14 / 0 correct" (`Radio.tsx:36`).
  - Answers already given stay graded. The place in the session and the Yard position do not.
- Fix: show the looked-up entry in a dialog on top of the station (the Settings dialog already uses
  this pattern), with "Back to your question" / "Back to the job". Keep the Radio run when the
  learner changes mode.
- Effort: M
- Risk: MEDIUM
- Frozen: no
- Check: corrected. Two details changed: the navigation is on `Drill.tsx:244` (245 is the "Next"
  button), and one job has par 19 (`p1-sort`), not "some jobs". The behaviour is confirmed. Drill:
  "Question 3 of 10 / 1 correct", then "Look it up →", then Back gave "Question 1 of 10 / 0 correct";
  the stored profile kept the 3 graded items; the miss list is reset at each build
  (`Drill.tsx:157`). Yard: "Moves 2 / par 5 · Joints 1" became "Moves 0 / par 5 · Joints 0". Radio:
  "Call 2 of 14 / 1 correct" became "Call 1 of 14 / 0 correct" after a change of mode and back.
  Fence: behaviour (job U1). The guided Radio state can be kept in `Radio.tsx`; the `STEPS` wording
  is not touched.

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
- Check: confirmed. The grep finds one line. The open dialog holds 7 controls: "Done", five
  checkboxes and "Reset". The note text is as quoted. Fence: no server and no account is necessary
  (item 11); the copy is a local file. The Yard sound state has its own key `sl_muted`
  (`yard/sound.js:5`); include it in the file or leave it out by decision.

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
- Check: confirmed. Readout "Moves 2 / par 5 · Joints 1" became "Moves 0 / par 5 · Joints 0" with no
  dialog. A "Reset" click during the demo left the banner "▶ Watching the optimal line — par 5
  moves". After the demo: picker "✓ Make up the cut · par 5", "→ Add to the cut · par 5"; stored
  `yard` = `{"completed":["p0-1"],"best":{}}`; all domain mastery values stayed 0. The picture shows
  the ✓ on the closed picker; it does not show the → line. Fence: behaviour (job U1).

#### UX-07 — Reference rows show unverified content with no trust mark
- Severity: HIGH
- Evidence: `Reference.tsx:55-57` renders the title and the plain text of each item. The trust badge
  is only in the detail (`:75`), and the detail is out of view (UX-03). Rows with no trust word at
  all: 4 `needs-review` signals (`sig.410`, `sig.418`, `sig.433A`, `sig.440`). Example row: "410
  CLEAR TO RESTRICTING — Proceed, next signal is displaying restricting signal." The detail, when
  found, is honest: "⚠ not yet verified — reference only". The 6 `operating-practice` radio steps
  have no badge in the row, but the plain text of each row says "never graded" in words.
  SPEC says each look-up gives "a plain answer + the cited source + a trust flag".
- Fix: put the trust mark in each row, as a word and not only a colour. Keep the order: mark, then
  text. Use the labels that the app already has (`Reference.tsx:8-12`); see UX-38 for one of them.
- Effort: S
- Risk: LOW
- Frozen: no
- Check: corrected. The 4 signal rows are confirmed: 219 rows hold 0 badges, and the row for
  `sig.410` shows only the title and the indication text. The statement about the 6 radio steps
  changed: each of those rows carries its status in the row text (for example "… played and
  explained, never graded"), so those rows lack the badge and not the information. The SPEC quote is
  at `SPEC.md:42-43`. Severity stays HIGH because of the 4 signal rows.

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
  controls outside the canvas). Until then, a plain notice on narrow screens is possible; the owner
  decides this with Gate A question 2 (phone).
- Effort: L
- Risk: MEDIUM
- Frozen: no (`geometry.js` stays untouched; `render.js` and `yardSim.js` are not frozen)
- Check: confirmed. 390: canvas 352 x 120.8, scale 0.2627; computed sizes 2.36, 3.41, 2.63, 3.68,
  9.46 and 22.9 px. 1440: canvas 882 wide, scale 0.658, car number 5.92 px. Tap at 6 px: not lined,
  banner empty. Tab stops as listed, then the page body. Canvas `tabIndex` -1, no role, no label,
  empty content. Two `.ord-row` elements in job `p2-list`: `div`, no `tabindex`, no role. Contrast
  `#39b58a` to `#f2b134` = 1.36:1. Banner top at y = 829 of 844. Fence: the redraw is jobs Y2 and Y4.

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
- Fix: make the copy match the data. Where an entry has no rule text, the entry says in app words
  that the rule text is not in the app. The entry already shows the source line from the data; no
  new citation is written. The owner approves the new words of the two promise sentences. The
  content gap itself is note S-05 for the SME.
- Effort: S
- Risk: LOW
- Frozen: no (the copy and the entry layout). The rule text and the plain text are frozen content.
- Check: corrected. The evidence is confirmed: 100 of 100 rule items have `verbatim: null`; 63 of 63
  and 42 of 42 have the text; the `rule.112` entry reads as quoted and has no "Show the rule text"
  control. The fix changed. The first pass said "name the rule number to read in the rulebook"; a
  sentence that an agent writes with a rule number is a citation (fence item 2). The fix now uses
  only the `citation.ref` that the entry shows today. The two sentences are a word change, so they
  are not part of a reskin (fence item 3).

### MEDIUM

#### UX-10 — Home gives a new learner no first step
- Severity: MEDIUM
- Evidence: Home has 7 domain cards and 5 station cards of equal weight, and one disabled "Exam"
  card. No control says where to start. At 390 the first screen shows the lede, the path and two
  cards; the heading "Ways to learn" is at y = 1425 and its first card at y = 1455
  (`pictures/R4-09-home-first-screen.png`). A domain card
  looks like a progress tile. Its visible text has no verb. Only the `aria-label` says "Drill …"
  (`Home.tsx:54`). A click starts question 1 at once. "Signals" is on Home two times (domain card and
  station card) and both open the same screen (`App.tsx:43-45`).
- Fix: one primary control on the path card: "Start here" for a fresh profile, "Continue" with the
  count of items due for a profile with history. Put the visible verb on the domain cards.
- Effort: M
- Risk: LOW
- Frozen: no
- Check: corrected. Counts confirmed: 7 domain cards, 5 station cards, 1 disabled card. First card
  text: "The words / CROR definitions — the language of the job."; `aria-label` "Drill The words". A
  click opened `#/drill/definitions` at "Question 1 of 10". The Signals card opens `#/drill/signals`
  and the Signals station opens `#/signals`; both render the same drill. Changed: at 390 x 844 the
  first screen holds two cards (the second card ends at y = 811), not one; the heading "Ways to
  learn" is at y = 1425, and y = 1455 is its first card. The picture is a full-page picture
  (390 x 2069), not the first screen. Radio is also on Home two times, with two different
  destinations (UX-37). Fence: the new words are a copy change for the owner.

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
- Check: confirmed for the pattern; the two cited sessions are not verified, because the draw is
  random. 12 fresh sessions of the general Drill gave 120 questions: 32 rule questions, 53 definition
  questions and 35 signal questions; 1 to 5 signal questions in a session (6 was not seen). One fresh
  session started with a rule question from Authority ("A foreman protecting track work or operating
  track units holds a…"). The summaries of the 12 sessions named 6 different domains. The code lines
  are as cited. Fence: the "Learn" step shows the text that the data already holds; no agent writes
  item text.

#### UX-12 — Progress numbers read as "nothing happened", and the due rule is silent
- Severity: MEDIUM
- Evidence:
  - First session, 7 of 10 correct. Summary: "The words: +0% → 0% · Authority: +0% → 0% · Signals:
    +0% → 0% · Switching: +0% → 0%. Spaced out over the next days so it sticks." Home after: "0%
    mastered", all 7 bars at 0. This session is not verified (see the Check line). Picture
    `pictures/R4-08-drill-summary-zero.png` shows a different first session: 5 of 10 correct,
    "Signals: +0% → 0% · The words: +0% → 0%".
  - Cause: one correct answer adds 1/30 to one item (`sr.ts:18`, `:24`). The numbers are true. The
    screen does not tell the learner why they are small.
  - A correct answer on an item that is not due counts for nothing (`AppContext.tsx:79`). A miss
    always counts. Seeded profile, securement drill two times in a row, all correct each time:
    "+0% → 89%" both times. "Drill again" is offered directly after each session. Extra practice on
    the same day can only lower mastery. No screen says this.
  - No screen shows how many items are due, or when to come back.
- Fix: keep the model and the numbers. Add true counts in words, computed from the stored due
  dates: how many answers were right, how many items started, and when each group comes back. Show
  "N due now" on Home and before a session. When nothing is due, say that this round is practice and
  does not move the bar.
- Effort: M
- Risk: LOW
- Frozen: no
- Check: corrected. The picture shows a session of 5 of 10 with two domains; the first pass quoted a
  session of 7 of 10 with four domains, which the picture does not show and the check cannot
  reproduce (the draw is random). The evidence now names both. The behaviour is confirmed: a fresh session of
  5 of 10 over 6 domains gave "+0% → 0%" for all 6, and Home showed "0% mastered" with 7 bars at 0.
  Seeded profile, securement, all correct: "+0% → 89%" (6 of 6). The same session with one miss:
  "5 / 6 … Securement: -29% → 61%". Home has no text with "due". The first pass proposed the words
  "They come back tomorrow"; that is false for a missed item (due at once, `sr.ts:21`, `:25`), so
  the fix now says that the words are computed (fence item 15).

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
  the frozen `model.js`). Start the builder on a track of the job. Raise the hint contrast through a
  bridge token.
- Effort: S
- Risk: LOW
- Frozen: no
- Check: confirmed. Builder at load: PULL, 1, AS71. The closed section is at y = 1104.5 at 1440.
  First "Work it": "AS71 is lined normal — line its switch reverse for the track (CROR 104)." with
  "Look it up →". `#6f7884` on `#171c24` = 3.82:1 and on `#11151b` = 4.09:1. Fence: the control hint
  is app copy about the control, not rule text; the new colour goes through the bridge file (item
  4); the changes are behaviour and words (job U1 or Y3 by decision of the lead).

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
- Check: confirmed. Computed borders `rgb(63, 185, 80)` and `rgb(248, 81, 73)`; ratio 1.32:1; the
  two fills are 1.12:1 to each other. The option buttons hold the answer text only. Live example of a
  rule question: the feedback was "Not quite. Rule 849 — A TOP (Track Occupancy Permit) is the
  authority a foreman holds …"; it did not repeat the option text as an answer. Fence: a word
  change (job U1); it also meets fence item 5.

#### UX-15 — A finish above par does not say that the job is done
- Severity: MEDIUM
- Evidence: first job finished in 7 moves. Banner: "7 moves — par 5 · 3 couplings · your best:
  5m/2j", neutral style, no "done" word (`yardSim.js:501-502`; picture
  `pictures/R4-05-yard-overpar-finish.png`). At par the banner starts with "✓ Par!". The neutral tone
  for an S1 result is correct (REVAMP section 6). The missing word is the defect. "5m/2j" is not
  explained. The readout says "Joints", the banner says "couplings".
- Fix: start each finish with "Job done." in `yardSim.js`. Write "5 moves, 2 couplings". Use the
  word "couplings" in the readout also; the frozen `model.js:271` fixes that word in the banner.
- Effort: S
- Risk: LOW
- Frozen: no (`yardSim.js`). The head text "Par! …" is in the frozen `model.js:270`.
- Check: corrected. The evidence is confirmed: after a par run and a 7-move run the banner was
  "7 moves — par 5 · 3 couplings · your best: 5m/2j" with class `banner ok`, and the readout was
  "Moves 7 / par 5 · Joints 3". The fix changed: "use one word for joints" can only mean
  "couplings", because `model.js:271` writes "coupling" and is frozen. The readout text is in
  `yardSim.js:149`, `:260`, `:420`, `:432`; "5m/2j" is in `yardSim.js:492-494` and `:700`. None of
  these is frozen. Fence: a word change (job U1 or Y3).

#### UX-16 — Three reading modes do not reach the Yard and the guided Radio
- Severity: MEDIUM
- Evidence (computed styles at 390, default against each mode):

  | Screen | Bigger text | Dyslexia type | Higher contrast |
  |---|---|---|---|
  | Home, Reference, Drill (9 probes) | 9 of 9 scale (16 → 18.5 px) | 9 of 9 change | 9 of 9 change |
  | Yard (7 probes) | 0 of 7 change | font family 0 of 7; letter spacing 5 of 7 | 0 of 7 change |
  | Guided Radio (6 probes in the island) | 0 of 6 change | font family 6 of 6; letter spacing 5 of 6 | 0 of 6 change |

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
- Check: corrected. The check used its own probes (shell: `.lede p`, `.card p`, `.station small`,
  `.ref-row b`, `.ref-row small`, `.search`, `.prompt`, `.opt`, `.drill-top span`; Yard: `.wo-job`,
  `.wo-meta`, `.readout`, `#act`, `#work`, `.legend`, `.chip span`; Radio: `.scenario`, `.rtitle`,
  `.rsub`, `.call`, `#keyBtn`, `#notebody`). All cells are confirmed but two. Letter spacing in the
  Yard changed on 5 of 7 probes, not 6 of 7: the `select` and the `button` do not take it. In the
  Radio island it changed on 5 of 6. `document.fonts` is empty and no `@font-face` exists outside
  the Dusk copy. Fence: a size in `rem` gives the same px at the default, so it changes no number at
  the default (item 3) and makes the mode work (item 7). Job B3 may edit style rules only in
  `radioSim.js`. A shipped font file needs a licence check: not verified. The file also counts in
  the cache budget of the PWA.

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
- Check: confirmed. The `<animate>` element is at `signal.ts:35`. Opacity samples of the first
  flashing lamp of `sig.406`, 130 ms apart: app setting on: 0.97, 0.79, 0.56, 0.35, 0.12, 0.35, 0.59,
  0.82; OS preference on: 0.94, 0.82, 0.59, 0.35, 0.12, 0.35, 0.59, 0.82. The page text holds no
  "flash". Fence test of the fix: the wrapper can hold the lamp lit with no edit of `signal.ts` and
  no change of its output. A call of `pauseAnimations()` and `setCurrentTime(0)` on the rendered
  `svg` element gave opacity 1 on 8 of 8 samples, and the 5 `<animate>` elements stayed in the
  markup. The word "flashing" and which lamp it names are signal content: the SME confirms first
  (note S-10).

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
- Check: confirmed. All files blocked: 7 locked cards, 7 "Coming soon" marks, "0% mastered", no
  retry control; the four messages as quoted. Only `rules.json` blocked: Switching, Securement,
  Authority and Operating said "Coming soon". Fence: behaviour and words (job U1).

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
- Check: confirmed. `{"schema":1}` and a profile with no `domains`: `#root` empty on 5 of 5 routes,
  the header gone, the same TypeError. Added: a profile with no `items` field is also blank
  ("reading 'def.advance-signal'"). A profile with no `yard` field works (the picker showed 19
  jobs). Invalid JSON and `{"schema":0}` gave a working fresh app.

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
- Check: confirmed. Measured at 390: picker 39, action 39, count 39, track 39, "Work it" 37, "Watch
  optimal" 37, "Reset" 37, mute 43.5 x 37, summary 19.5, switch-list row 36. Measured at 1440:
  "Look it up →" 91 x 25 and summary 19.5; the other Yard sizes are fixed px in
  `yardSim.js:97-100`. "Key the radio" 134 x 41, switch 50 x 28, tip link 33.7 high and mark 42 x 42
  at both widths. `#msg`, `#log` and `#notebody` have no `aria-live`. The label of a switch toggles
  it (`Settings.tsx:40`). What a screen reader says: not verified. Fence: item 8 asks for 44 px, so
  the size change is inside a reskin; the live regions are behaviour (job Y4 and U1).

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
- Check: confirmed, live and from the data. "securement": 1 row, "Rule 66". "CROR 112": 0 rows and
  the message. "hand brake": 4 rows ("Radio call — air to the tail", "Rule 112", "Rule 113.2",
  "Rule 113.6"). 97 titles match "Rule <number>"; the other 3 are "General Rule A", "B" and "C".
  Row 1 is "405 CLEAR SIGNAL". Fence: behaviour (job U1).

#### UX-22 — Yard and Radio words have no look-up
- Severity: MEDIUM
- Evidence: words on the Yard screen and in its hints: cut, lead, ladder, throat, foul point, joint,
  par, spot, kick, shove, bad-order, manifest, special instruction. No entry of the library has one
  of these words as its title: joint, cut, lead, ladder, throat, foul, spot, shove, bad-order,
  manifest, special instruction, hand brake. Only "KICKING" has an entry. Home uses the same words
  on the station cards: "Work the cuts", "Back to a joint" (`Home.tsx:9`, `:11`). The audience is a
  first-day learner. The guided Radio explains each call in "Why this call"; that part works.
- Fix: a place for a short "Words on this screen" list in the Yard and in the Radio. No agent
  writes a line of that list. The SME supplies each line (note S-13). Show no list until the text
  exists. The owner approves new words for the two Home subtitles.
- Effort: S for the place, plus SME time for the text
- Risk: LOW
- Frozen: no for the place. The puzzle hints and tier labels are in the frozen `puzzles.js`.
- Check: corrected. The statement "a title search finds none of" was too wide: "joint" is in the
  title "Radio call — stop and stretch the joint" and "cut" is in "Radio call — hoses coupled, air
  cut in". Neither entry explains the word, so the finding stands in the form above. A search of the
  whole text finds no row for lead, ladder, throat, bad-order and manifest. The fix changed: a
  definition of a rail word is content that can teach a wrong thing, so the text moved to the SME
  (fence item 2).

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
- Check: confirmed. The SVG is 336 px wide at 390 (factor 0.442): 6.19, 4.86, 4.64, 4.42 and 3.98
  px. No DOM element outside the SVG holds "10 cars to the joint" in guided mode. The test-mode
  readout is 18.4 px. "Key the radio" is at y = 938 at 1440 and at y = 944 of 844 at 390. Fence: the
  readout text comes from the `read` and `status` fields of `STEPS`, with no change of wording. The
  new DOM line is markup and behaviour, so it is job U1; job B3 may change style rules only.

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
- Check: confirmed. The four strings are at the cited lines. Added: SPEC failure mode F3 asks for
  an explicit "this isn't the official test" label (`SPEC.md:59-60`). A search of `src/` and
  `index.html` for "official" finds nothing. Fence: a word change; the owner picks.

#### UX-25 — Home shows "Exam — Coming soon"
- Severity: MEDIUM
- Evidence: `Home.tsx:64`, a disabled card. The plan forbids an Exam station in this change. D-0013
  defers it with no date. The card is a promise that the product does not plan to keep now. The
  subtitle is 2.76:1 (disabled state).
- Fix: the owner picks: remove the card, or keep it (owner question 2).
- Effort: S
- Risk: LOW
- Frozen: no
- Check: confirmed. The card is disabled and has opacity 0.5. Computed: `#9aa7b4` at 0.5 on
  `#1c232c` at 0.5 over `#0e1116` = 2.76:1. Plan section 8 rules out an Exam station.

#### UX-26 — Read aloud speaks the question only
- Severity: MEDIUM
- Evidence: `Drill.tsx:167-169` speaks `promptText`. It does not speak the options or the feedback.
  A signal question speaks nothing. The Yard never calls `speak` (`grep -n speak
  src/stations/yardSim.js` finds nothing). `Settings.tsx:10` says "Speak rules & questions". The
  same switch also sets the Yard sound: `yardSim.js:715` mutes the Yard at each visit when Read
  aloud is off, and a learner who turns the Yard sound on gets it off again at the next visit.
- Fix: a "Read this" button at each option and at the feedback. For the Yard sound, the smaller fix
  is to remove the forced mute at mount; the Yard keeps its own stored state
  (`yard/sound.js:5`). A separate "Yard sounds" switch is the larger fix.
- Effort: M
- Risk: LOW
- Frozen: no
- Check: confirmed, with a stub in place of `speechSynthesis`. Read aloud on, definition question:
  the stub received the prompt one time; nothing after the answer. On a signal question the stub
  received nothing. Yard, Read aloud off: mute shows 🔇; one click gives 🔊; after a leave and a
  return it shows 🔇 again. Scope: the title is about the Drill. Reference has a "Read aloud" button
  for an entry when the setting is on (`Reference.tsx:95-97`), the guided Radio speaks each call
  (`radioSim.js:179`), and the Radio test speaks the incoming line or the readout
  (`RadioTest.tsx:97-99`).

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
- Check: confirmed. Radio run 1: "… moved your Radio mastery: +2% → 2%"; run 2 at once: "… moved
  your Radio mastery: +0% → 2%". Drill, securement, all wrong: "Practice the 3 you missed →" opened
  "Question 1 of 6"; the count differs from run to run (5 in the first pass). Fence: a word change.

#### UX-28 — The Radio card on Home still names hand signals
- Severity: LOW
- Evidence: `store.ts:11`: "Radio & hand signals." D-0022 moved `rule.12` (hand signals) to the
  `operating` domain. The 5 rule items in the radio domain are 120, 121, 122, 123 and 123.2.
- Fix: change the description. The words need the SME (note S-07).
- Effort: S
- Risk: LOW
- Frozen: no
- Check: confirmed. `rule.12` has `domain: "operating"`. The radio domain holds the 5 rule items and
  14 radio-script items. Fence: a word change.

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
- Check: confirmed. Guided: "← Home" at y = 207 and the tabs at y = 122 (1440). Test mode: "← Home"
  at y = 122 and the tabs at y = 176. The Yard button has a border and a fill (`yardSim.js:53-57`).
  A move of a control is a change of a control; the lead decides if it is inside a reskin (fence
  item 3).

#### UX-30 — "Look it up" is larger than "Next"
- Severity: LOW
- Evidence: in the feedback box the secondary action "Look it up →" has the full width and "Next →"
  is small at the left (`index.css:95-97`; picture `pictures/R4-07-drill-miss-colour.png`). The
  larger control ends the session (UX-04).
- Fix: "Next" is the primary control. "Look it up" is a text link.
- Effort: S
- Risk: LOW
- Frozen: no
- Check: confirmed. At 1440: "Look it up →" 850 x 44, "Next →" 78 x 44. Focus goes to "Next" after
  an answer (`Drill.tsx:245`, `autoFocus`).

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
- Check: confirmed. The empty banner is 22 px high at load. Last job ("Build the outbound &
  depart"): clicks on "Work it" gave an empty banner for 5.2 s (one run); the timer limit is 5800 ms
  (`yardSim.js:281`). A wrong certify gave "Not so fast — AS75 has no CN 318044 — that car isn't
  where the list says." The page holds no text that explains ✓ and →. Fence: words and behaviour.

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
- Check: confirmed. Two tabs, 0 tab panels. The label has an empty `for`. Each signal picture has no
  `aria-label`. The title is "Clear Board — become a conductor, free" on 6 of 6 routes. After a load
  the main area was the active element with a 3 px outline. Added: a Reference row is a `button`
  with `role="listitem"` (`Reference.tsx:55`); a query for buttons with the name of row 1 found 0,
  and a query for list items found 219. Added: a Settings toggle shows no focus ring; the focused
  input has opacity 0 (`index.css:114`) and its visible part has no outline (scratch
  `R4-check/pics/settings-toggle-focus.png`). R5 covers these in detail. A name for a signal picture
  that describes its lamps is signal content; the SME confirms the words.

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
- Check: confirmed. Each cited line holds the cited character. The station buttons render as
  "📖 Reference", "🎯 Drill", "🚂 The Yard", "🚦 Signals", "📻 Radio walkthrough", "📝 Exam". The
  Yard mute button has no text name; its name is the emoji and the `title` "Sound".

#### UX-34 — "SME" is shown as a source
- Severity: LOW
- Evidence: Radio "Call it yourself", call 6, the cite line is "SME" alone (`RadioTest.tsx:190`
  prints `c.source`). The learner does not know this word. The badge above the options is in plain
  words and is good.
- Fix: map the source code to plain words in the cite line.
- Effort: S
- Risk: LOW
- Frozen: no
- Check: confirmed. The cite line is "SME" alone on calls 6, 8, 9 and 10. Reference shows the same
  word as "Source: SME" on the four entries (UX-38). Fence: the plain words can be the words of the
  badge that the app already shows; no new statement about a rule is written.

#### UX-35 — An empty entry has a "verified" badge
- Severity: LOW
- Evidence: `#/reference?focus=rule.573` shows "Rule 573", "✓ verified", no text, "Source: CROR ·
  CROR 573". The item has an empty `plain`, no rule text and no question.
- Fix: the app hides an entry that has no text, or shows "No text yet". The content is note S-04.
- Effort: S
- Risk: LOW
- Frozen: no for the display. The item is frozen content.
- Check: confirmed. The entry text is "Rule 573 / ✓ verified / Source: CROR · CROR 573". It is the
  only item with an empty `plain`, and it has 0 questions.

#### UX-36 — The guided Radio promises a next layer
- Severity: LOW
- Evidence: the end text says "The move/departure is the next layer." (`radioSim.js:183`). No such
  layer exists or is planned in this change.
- Fix: the owner picks: keep or remove the sentence. It is outside `STEPS`.
- Effort: S
- Risk: LOW
- Frozen: no
- Check: confirmed. The end text after 14 calls holds the sentence. `STEPS` is lines 84 to 123; the
  sentence is on line 183.

### Added by the check

#### UX-37 — The Radio bar on Home cannot pass 38 % from the Radio card
- Severity: MEDIUM
- Evidence: the Radio domain card opens the rule drill (`Home.tsx:54`, `/drill/radio`). The Drill
  removes the radio-script items (`Drill.tsx:92`), so it asks the 5 radio rules only. The Radio bar
  is the mean over 13 items: the 5 rules and the 8 verified radio-script items (`store.ts:69-72`,
  `:80-82`). The 8 items are graded only in the Radio station, mode "Call it yourself"
  (`RadioTest.tsx:150`). Live: a profile with the 5 radio rules at full familiarity showed the Radio
  bar at 38. The card opened `#/drill/radio` with "What does the rule say?"; the screen had no
  pointer to the Radio station. The station card is named "Radio walkthrough — Back to a joint"
  (`Home.tsx:11`); it does not say that a scored mode is there.
- Fix: the Radio card, or the summary of its drill, points to "Call it yourself". Name the scored
  mode on the station card. The owner picks the form (owner question 8).
- Effort: S
- Risk: LOW
- Frozen: no
- Check: added. Evidence: the cited lines, and the live run in scratch `R4-check/n-extra.mjs`
  (5 / 13 = 0.38). Fence: words and one link (job U1); no frozen file.

#### UX-38 — Reference calls four entries "CN practice (GOI)" when their source is "SME"
- Severity: MEDIUM
- Evidence: `Reference.tsx:11` gives one label to each `operating-practice` item: "● CN practice
  (GOI), not a CROR rule". Four of the six such items have `citation.source: "SME"`
  (`radio.joint.06`, `.08`, `.09`, `.10`); two have "GOI". Live, `#/reference?focus=radio.joint.06`:
  the badge says "● CN practice (GOI), not a CROR rule", the text says "no CROR paragraph is cited
  for it in the verified source", and the last line says "Source: SME". The Radio test picks the
  label by source (`RadioTest.tsx:170-172`) and shows "● No CROR citation in the verified source"
  for the same four steps. SPEC F1 says "CROR-vs-GOI always distinguished" (`SPEC.md:55-56`).
- Fix: Reference picks the label by `citation.source`, with the two labels that the Radio test
  already has. No new label text is necessary. The question about the four steps is note S-13.
- Effort: S
- Risk: LOW
- Frozen: no
- Check: added. Evidence: the data, the two code places, and the live entry. Fence: the fix reuses
  existing app text; it writes no rule and no citation. This also qualifies item 1 of section 7.

#### UX-39 — After a direct load, the session summary shows time decay as a loss
- Severity: LOW
- Evidence: the Drill takes its start values from the stored profile at build (`Drill.tsx:155`).
  After a direct load of a drill route, the build runs before the recompute that applies the decay
  (`AppContext.tsx:49-52`). Live: a profile with the 3 securement items familiar, last seen 10 days
  ago, stored mastery 1.0. Direct load of `#/drill/securement`, 6 of 6 correct: "Securement: -11% →
  89%". The same profile through Home (bar at 89), 6 of 6 correct: "Securement: +0% → 89%". The tier
  limit reads the same stale value (`Drill.tsx:102`).
- Fix: take the start values after the recompute (for example from a recomputed copy of the profile
  at build).
- Effort: S
- Risk: LOW
- Frozen: no
- Check: added. One run for each path, scratch `R4-check/n-extra.mjs`. The case needs a load or a
  reload on a drill route (`/#/drill`, `/#/drill/<domain>`, `/#/signals`) after time has passed.

#### UX-40 — A signal entry shows one drawing two times, and "Drill these aspects" opens a general session
- Severity: LOW
- Evidence: each of the 38 signal items with drawings holds one repeated drawing: 140 list entries,
  102 different drawings. Reference shows the list as it is, under the line "Hardware variants — all
  the same indication." (`Reference.tsx:79-80`). Live, `sig.437`: 3 drawings, the first and the third
  identical. The Drill picks a list entry at random (`Drill.tsx:55-56`), so a repeated drawing has
  double weight; in `sig.439` the repeated drawing is the shared red mast lamp (UX-01). The button
  "Drill these aspects →" opens `#/signals` (`Reference.tsx:63`, `:83`), a session over all signals.
- Fix: Reference and the Drill use each different drawing one time (display and selection code; no
  data edit). Rename the button to what it does. The data question is note S-14.
- Effort: S
- Risk: LOW
- Frozen: no for the code. `signals.json` is frozen.
- Check: added. Evidence: read-only count over `signals.json`, the live entry, and one click on the
  button from `sig.405` (it opened `#/signals`). Fence: no frozen file; the new button text is a
  word change.

## 4. Not offered: needs a frozen file or is behind the fence

| Item | Why it is not offered | Check |
|---|---|---|
| Remove the exclamation mark in "Par! 5 moves" | `model.js:270` is frozen. | confirmed |
| Add the control hint inside the refusal texts | `model.js:69-72` is frozen. UX-13 adds the hint in `yardSim.js`. | confirmed |
| Plain words in the puzzle hints and tier labels | `puzzles.js` is frozen. UX-22 adds a place for a word list outside it. | confirmed |
| Rule titles with a name, rule text for the 100 rules, text for `rule.573` | `public/data/*.json` is frozen and it is rule content. Notes S-04, S-05. | confirmed |
| Change the two shared signal drawings | `signals.json` is frozen and it is signal content. Note S-01. | confirmed |
| A scaffold job before the par-19 job (REVAMP item 16) | New puzzles are behind the fence. | confirmed (plan section 8) |
| Point-protection step on a shove (REVAMP item 18, second half) | Behind the fence (D-0029). | confirmed (plan section 8) |
| Exam station, "test-ready" bar (REVAMP section 3 step 5, section 9 question 6) | Behind the fence (D-0013). | confirmed (plan section 8) |
| A softer grade for a win above par (D-0018, open) | It changes mastery numbers. It needs the owner and the SME. | confirmed (`DECISIONS.md`, D-0018, "Open") |
| Stop the lamp flash in the renderer | `signal.ts` is frozen. UX-17 works in the wrapper. | confirmed; the wrapper method was tested (UX-17) |
| The word "couplings" in the win banner, and "coupling" for one | `model.js:271` is frozen. UX-15 changes the readout word in `yardSim.js`. | added by the check |
| Remove the repeated drawing from each aspect list | `signals.json` is frozen. UX-40 works in the display and selection code. Note S-14. | added by the check |
| A gate check that fails on a shared drawing | It would make `npm run check` red while the data is frozen. UX-01 reports only. | added by the check |

## 5. REVAMP-DESIGN.md — status of each item today

Key: **done** (with the decision), **done in part**, **open**, **superseded**, **fenced** (the plan
forbids it in this change). Each status was checked in the code or in the running app.

### Section 4 — recommendations

| # | Item | Status | Checked in | Check |
|---|---|---|---|---|
| 1 | `tools/solve.mjs` | done, D-0017 | Run today: 19 of 19 pass. | confirmed; run again |
| 2 | `tools/content-check.mjs` | done, D-0017 | Run today: checks A to I pass. | confirmed; run again |
| 3 | `npm run check` blocks the deploy | done in part, D-0017 and D-0019 | `package.json:12` runs four scripts. `tsc` and the lint are not in it (T9). | confirmed; `npm run build` runs `tsc -b` (`package.json:8`) |
| 4 | The Yard writes mastery on a win | done, D-0018 | Live: one win moved Switching 0 → 0.0119 and Securement 0 → 0.0111. | confirmed; stored values 0.011905 and 0.011111 |
| 5 | Puzzles tagged with rule categories | done, D-0018 | `yardSim.js:25-33` (`RULE_ITEMS`). | confirmed |
| 6 | One `MistakeEvent` type from each station | open | No such type in `src/`. | confirmed; grep finds nothing |
| 7 | Refusals name the condition and link to Reference | done, D-0020 | Live: the track is named; the link opens the rule. The link ends the job (UX-04). Refusals with no "CROR n" have no link. | confirmed; the link opened `#/reference?focus=rule.104`; the rule for no link is `yardSim.js:657-660` |
| 8 | Tier-aware Drill and a first-session seed | done in part, D-0020 | Tier limit: `Drill.tsx:100-104`. The seed is not built (UX-11). | confirmed |
| 9 | One aspect recall before signals can read mastered; `signalId` link | done in part, D-0021 | Cap: `store.ts:76`, `:86`. No `signalId` in `src/` or `tools/`. | confirmed |
| 10 | Severity-weighted remediation | done in part, D-0023 and D-0024 | Review round with S3 first: `Drill.tsx:116`. No re-show in the same session; no jump of the due order. | confirmed; D-0024 defers the re-queue |
| 11 | SR numbers reconciled, golden vectors | done, D-0022 | `tools/sr-vectors.mjs` is in `npm run check`. Not run today (it writes a folder). | confirmed by `package.json:12`; the run is not verified |
| 12 | Move `rule.12` out of radio | done, D-0022, confirmed D-0024 | `rule.12` is in `operating`. The Home text is not updated (UX-28). | confirmed |
| 13 | Cap questions for one rule in a session | done, D-0021 | `Drill.tsx:35` (`PER_RULE_CAP = 3`). | confirmed |
| 14 | Best record for each puzzle | done, D-0027 | Live (D-0027 could not test it): the profile stored `{"moves":5,"joints":2,…}`; a worse run did not replace it; the banner said "your best: 5m/2j". | confirmed; the same three results |
| 15 | Picker in tiers with a "next" mark | done, D-0026 | Live: 7 groups, 19 options, none disabled. The mark is wrong after a watched line (UX-06). | confirmed |
| 16 | Fill the ramp gaps | done in part, D-0026; the rest is fenced | The par-19 job is in tier 3. New puzzles are fenced. | confirmed; "Tier 3 — build it in order: Build it in order · par 19" |
| 17 | `optJoints` from the solver | done, D-0027 | `yardSim.js:530`; `solve.mjs` passes. | confirmed |
| 18 | SECURE as an action; point-protection step | done in part, D-0029; the rest is fenced | Live: the win needs SECURE; the refusal names the track. Point protection is fenced. | confirmed; "… AS75 is standing loose … SECURE AS75 to finish the job." |
| 19 | Graded aspect mode; graded Radio by step | superseded, D-0025 | `/signals` is the Drill (`App.tsx:45`). Radio has a second, graded mode. | confirmed |
| 20 | Empty domains on Home | done, D-0027 (no work was necessary) | 7 domains, all with items. "Coming soon" appears only when the data fails (UX-18). | confirmed; 7 live cards on a fresh load |

### Section 6 — error feedback

| Item | Status | Checked in | Check |
|---|---|---|---|
| One `MistakeEvent` from each station | open | See item 6. | confirmed |
| Stop the unsafe action, then explain, with a link | done, D-0020 | Live in Drill, Yard and Radio. | confirmed |
| A Yard refusal feeds the mastery model | open (deferred in D-0023) | Only a win grades (`yardSim.js:484`). | confirmed |
| Severity ladder S1, S2, S3 | done for the Drill, D-0024; open for the Yard | `src/core/severity.ts`; `Drill.tsx:240-242`. | confirmed |
| Two channels (red blocks, amber advises), words and icon, never colour alone | open | Options are colour only (UX-14). Switch state is colour only (UX-08). No amber channel exists. | confirmed; the Yard banner tones are `bad`, `ok` and `win` (`yardSim.js:115-117`) |
| S3 miss comes back in the same session | open (deferred in D-0024) | Not in `Drill.tsx`. | confirmed |
| Confusion-pair drill after the same wrong answer two times | open | Not in `src/`. | confirmed |
| Calm voice, no "WRONG", no exclamation mark | done in part | Feedback text is calm. Two exceptions: "Par!" (frozen) and "Not so fast —" (UX-31). | confirmed for the feedback seen in the check; a full search for other exclamation marks was not made |
| No rule number on screen that is not in the verified set | open, for the SME | The Yard texts carry rule numbers in code. No decision records a sign-off (note S-03). | confirmed |

### Section 7 — validation checklist

| # | Item | Status | Checked in | Check |
|---|---|---|---|---|
| 1 | Solver gate | done, D-0017 | Run today. | confirmed |
| 2 | Content gate | done, D-0017 | Run today. | confirmed |
| 3 | Rule mapping with SME sign-off | open | No gate; no sign-off in `DECISIONS.md`. | confirmed |
| 4 | Drill effectiveness (tier histogram asserted) | done in part, D-0020 | Built in the Drill. No gate asserts it. | confirmed |
| 5 | Quiz validity | done in part, D-0025 | Radio: check I. Drill: no collision check; the aspect to title mapping is not one-to-one (UX-01). | corrected: the quiz-validity check is check I; check G is the step index and check H is the trust rule |
| 6 | One brain | done, D-0018 and D-0025 | Live: a Yard win and a Radio run moved mastery. No gate asserts it. | confirmed; Radio 0 → 0.0205 after one perfect run |
| 7 | SR golden vectors, no marathon | done, D-0022 | `AppContext.tsx:79`; live: a second run at once gave +0 %. | confirmed |
| 8 | Redundancy lint (`distinctObjective`) | open; the signals cap is done, D-0021 | No such check in `tools/`. | confirmed |
| 9 | A refusal is a no-op that names its condition; negative test of the gate | done in part, D-0017 and D-0029 | Live refusals changed no state. A negative test exists for securement only. | confirmed; `securement-check.mjs:48-56` |
| 10 | Accessibility | open in five parts | Targets (UX-20). Reduce motion (UX-02). Live regions (UX-20). Colour only (UX-08, UX-14). Keyboard path and text mirror (UX-08). Read aloud at each prompt: in part (UX-26). | confirmed |
| 11 | Playtest by one tester for each release | not verified | No record in the repository. | not verified; a search of the root documents finds the requirement and no record |
| 12 | Test-ready guard | done, D-0013 | `store.ts:27`; nothing sets `testReady` to true. The word "job-ready" is on Home (UX-24). | confirmed; `testReady` is in two lines of `src/` |
| 13 | Fix order data, then par, then engine | done as a rule, D-0017 | A process rule; not checkable in code. | confirmed as a text in D-0017 |

### Section 9 — open questions

| # | Question | Status | Checked in | Check |
|---|---|---|---|---|
| 1 | Each rule number in the Yard confirmed | open, for the SME | No decision. Note S-03. | confirmed |
| 2 | What makes a cut "unattended" | open, for the SME | D-0029 built the action. The trigger in code is a cut of 2 or more (`model.js:212-213`). Note S-02. | confirmed |
| 3 | Kick limits and the no-kick car types | open, for the SME | Code comments record an SME call (`model.js:48-50`, `geometry.js:41-42`). No decision in `DECISIONS.md`. | confirmed |
| 4 | Home domain of `rule.12` | done, D-0022, confirmed D-0024 | `operating`. | confirmed |
| 5 | Yard speed as a sim check | open (no decision) | The code has no such check, as the document recommends. | confirmed |
| 6 | Test-ready bar | fenced, D-0013 | — | confirmed |
| 7 | Puzzle count | superseded, D-0026 | The count is 19. New puzzles are fenced. | confirmed |
| 8 | Weight of a Yard win | done in part, D-0018 | A win is a plain correct answer. The softer grade is open. | confirmed |

## 6. Notes for the SME

These notes give the texts as they are. They propose no rule wording.

- **S-01. Two signal drawings belong to two indications each.**
  `{"heads":["R"],"type":"mast"}` is an aspect of `sig.437` (title "437 STOP AND PROCEED", plain
  "Stop, then proceed at RESTRICTED speed.") and of `sig.439` (title "439 STOP", plain "Stop.").
  `{"heads":["G"],"type":"dwarf"}` is an aspect of `sig.405` ("405 CLEAR SIGNAL", plain "Proceed.")
  and of `sig.431` ("431 SLOW TO CLEAR", plain "Proceed, SLOW speed passing signal and through
  turnouts."). The drill marks one of the two names wrong (UX-01). Question: is each drawing correct
  for both items?
  - Check: confirmed from the data. All four items are `verified`. The red mast lamp is entry 2 of 3
    in `sig.437` and entries 1 and 5 of 5 in `sig.439`. The green dwarf lamp is entry 2 of 4 in
    `sig.405` and entry 3 of 5 in `sig.431`.
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
  - Check: confirmed. Each of the seven texts is at its cited place.
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
  - Check: confirmed. The Yard texts are at `model.js:69`, `:114`, `:126`, `:170` and
    `puzzles.js:11`. The entry texts are in `rules.json`. Added: the Yard drawing also carries the
    label "15 MPH · REDUCED (CROR 105)" (`render.js:94`).
- **S-04. `rule.573`** is `verified`, has an empty plain text, no rule text and no question.
  - Check: confirmed.
- **S-05. Rule entries.** 100 of 100 rule items have no rule text (`verbatim: null`). 97 titles are a
  number only. Some plain texts start with one paragraph label, for example `rule.112` "(ii)",
  `rule.114` "(b)", `rule.120` "(a)", `rule.113.5` "(a)". Question: is each entry meant to give the
  whole rule?
  - Check: confirmed. 20 of the 100 plain texts start with "Rule <number>(<label>)".
- **S-06. `rule.113.4`**, plain text: "Rule 113.4 prohibits them on …". The entry does not say what
  "them" is.
  - Check: confirmed.
- **S-07. Home card for Radio** (`store.ts:11`): "Radio & hand signals." Hand signals (`rule.12`) are
  in Operating since D-0022.
  - Check: confirmed.
- **S-08. Switch colours in the Yard help** (`yardSim.js:190-191`): "yellow = lined into the track /
  diverging, green = normal". The code comment in `render.js:2` calls yellow a rule convention. That
  claim is not verified (T12).
  - Check: confirmed that both texts are there. The claim itself stays not verified.
- **S-09. Kick limits and car types.** The limits "5 total / 3 loaded" and the no-kick types (tank,
  autorack, centerbeam) are in code comments as an SME call (`model.js:48-50`,
  `geometry.js:41-42`). `DECISIONS.md` has no entry for them.
  - Check: confirmed.
- **S-10. A flashing lamp under reduce motion** (UX-17). Question: is a lit, still lamp with the word
  "flashing" an acceptable picture of a flashing aspect?
  - Check: confirmed as an open question. The check showed that the wrapper can hold the lamp lit
    with no change to the frozen renderer.
- **S-11. Items that stay open from T11**, seen on screen today: `sig.410`, `sig.418`, `sig.433A`
  and `sig.440` show "⚠ not yet verified — reference only" in the entry (and no mark in the list
  row, UX-07). Six radio steps show "never scored".
  - Check: corrected. The entry of `sig.410` shows the mark. The six radio steps show "never scored"
    in the badge of the Radio test, and "never graded" in their Reference text. The four signal
    items have an empty aspect list, so their entries show no drawing.
- **S-12. The label "Safety-critical — lock this one in."** appears on each miss of an item that
  `severity.ts` puts in S3 (103 items by D-0024). The file says that the SME owns this list.
  - Check: corrected. The count 103 is the count of D-0024 over the 205 items that are not radio
    steps. 98 of the 103 can come up in the Drill; the other 5 are the 4 `needs-review` signals and
    `rule.573`.
- **S-13. Added by the check. Four radio steps and the label "CN practice (GOI)".** Reference shows
  "● CN practice (GOI), not a CROR rule" on `radio.joint.06`, `.08`, `.09` and `.10`. Their source in
  the data is "SME", and their text says that no paragraph is cited (UX-38). Question: which label
  is true for these four steps? A second question from UX-22: the Yard and the Radio use the words
  cut, lead, ladder, throat, foul point, joint, par, spot, shove, bad-order, manifest and special
  instruction, and the library has no entry for them. Does the SME supply a line for each word?
- **S-14. Added by the check. Each aspect list holds one repeated drawing.** 38 of 38 signal items
  with drawings have one drawing two times (140 entries, 102 different). In 20 items the last entry
  repeats the first. Example, `sig.437`: red over red staggered, one red, red over red staggered.
  Question: is each repeat intended, or does a list lack a drawing that the repeat stands for?
- **S-15. Added by the check. The four `needs-review` signal items have no drawing** (`aspects: []`).
  Reference shows their indication text and the rule text control. Question for the SME review of
  T11: is the text of these four entries safe to show before the review ends?
- **S-16. Added by the check. The words that describe a signal picture.** Each signal picture has no
  text name (UX-32). A name such as a list of lamp colours is signal content. Question: which words
  does the SME accept for a lamp colour, a flashing lamp, a plaque and a dwarf signal?

## 7. What works well and must not be lost in the reskin

1. **Trust is on the screen in words.** Reference entries show "✓ verified", "⚠ not yet verified —
   reference only", "● CN practice (GOI), not a CROR rule". The Radio test says "answered and
   explained, never scored" before the learner answers.
   - Check: corrected. The words are on the screen as quoted. One qualification: the third label is
     shown on four entries whose source is "SME" (UX-38).
2. **The feedback voice is calm.** "Not quite." then the cause, then the source. No blame.
   - Check: confirmed (`Drill.tsx:238-243`, and each feedback seen in the check).
3. **Each error has a look-up one tap away**, with the same label in three stations. Keep the link;
   repair the loss of state (UX-04).
   - Check: confirmed. "Look it up →" in the Drill, the Yard refusal and each of the 14 Radio calls.
4. **"Practice the N you missed"** with safety items first.
   - Check: confirmed (`Drill.tsx:116`, and the button in two runs).
5. **A Yard refusal changes nothing** and names the track and the condition. The loose-cut refusal
   says what to do next. TIED and LOOSE are words on the track, not only a colour.
   - Check: confirmed. The readout did not change after a refusal. The words are drawn at
     `render.js:146`; at 390 they are 2.6 px high (UX-08).
6. **Records are honest.** A first clear claims no record. A watched line writes no best record and
   no mastery. A profile with no record shows a blank.
   - Check: confirmed. First par run: "✓ Par! 5 moves — 2 couplings, clean" with no record text.
     After a watched line: `best` = `{}` and all mastery 0. The watched line does write `completed`
     (UX-06).
7. **Nothing is locked.** The picker shows tiers and a "next" mark, and each job stays open. The
   picker is a native `select`, so the keyboard works.
   - Check: confirmed. 19 options, 0 disabled; the picker is a tab stop.
8. **The guided Radio is not scored**, and "Why this call" explains each step. The scored mode is
   separate.
   - Check: confirmed. A full guided run left the stored profile with no radio item.
9. **No sideways scroll** at 390 or 1440 on each screen measured, also with all three type modes
   on.
   - Check: confirmed. 6 routes and the Settings dialog at both widths with all three modes on:
     scroll width equal to the client width in each case.
10. **Offline works after one load.** With the service worker in control and the network off, a
    reload showed Home, and Reference, the Signals drill, the Yard and the Radio opened.
    - Check: confirmed. The same five results, with no console error.
11. **Settings**: the live sample, the native dialog, Esc to close, focus back on the Settings
    button, and a clear reset question.
    - Check: confirmed. After Esc the dialog was closed and the active element was "⚙ Settings".
12. **Shell targets**: options are 48 px high, shell buttons are 44 px, the focus ring is visible, a
    skip link exists.
    - Check: corrected. Options are 48 px or more (52 at 1440), `.iconbtn` and `.back` are 44 px, and
      the skip link exists (`App.tsx:28`). The ring is visible on a Reference row and on the main
      area. It is not visible on the five Settings toggles (UX-32). The header mark is 42 x 42 and
      the tip link is 33.7 high (UX-20).
13. **No "test-ready" claim** and a slow, true mastery number. Keep the number; add words (UX-12).
    - Check: confirmed. One exception to "true": the delta in the summary after a direct load
      (UX-39).
14. **Phone flow in the Drill**: after an answer at 390, focus goes to "Next" and the page scrolls
    to the feedback.
    - Check: confirmed. Active element "Next →", `scrollY` 250, the button in view.
15. **Reading modes in the shell**: 9 of 9 probes obey each of the three type modes.
    - Check: confirmed with the probes of the check (UX-16).

## 8. Picks for the owner

1. The wording "job-ready" on Home, in the page description and in the app manifest (UX-24).
2. The "Exam — Coming soon" card: remove it or keep it (UX-25).
3. Jobs that old profiles hold as complete after a watched line: leave the marks or clear them
   (UX-06). The two cases cannot be told apart in the stored data.
4. The first step that Home offers a new learner, and the items of the first session (UX-10, UX-11).
   The item list also needs the SME.
5. The look-up: a dialog on top of the station, or a separate screen that keeps the station state
   (UX-04).
6. A flashing lamp under reduce motion: a still lamp with the word "flashing", or the flash stays
   (UX-17). This also needs the SME (note S-10).
7. The sentence "The move/departure is the next layer." at the end of the guided Radio (UX-36).
8. Added by the check. Where the Radio card on Home leads, and the name of the Radio station card
   (UX-37).
9. Added by the check. The words of the two promise sentences about the rule text (UX-09), and the
   words of the two station subtitles "Work the cuts" and "Back to a joint" (UX-22).

- Check: confirmed. Each pick names a finding that stands. No pick hands the owner a command, a
  path or a step to carry out. Picks 8 and 9 were added.

## 9. Not verified

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

Added by the check:

- The two first sessions that UX-11 quotes, and the session of 7 of 10 that the first pass quoted in
  UX-12. The draw is random. The pattern is confirmed; these sessions are not.
- The timing spread of "27 ms or less" of the first pass. The spread in the check was 48 ms or less.
- The licence of the dyslexia font, if a font file is shipped (UX-16).
- The times in the check for the watched line (11.1 s, 29.0 s) and the arrival scene (5.2 s): one
  run each, the same as in the first pass.
- A full search of the app text for exclamation marks (section 5, error feedback, row 8).
- Sideways scroll with a text-spacing override of the browser. The check covered the modes of the
  app only.
- The pictures of the check are in the scratch folder, not in `specs/research/pictures/`. The check
  had no write access to that folder.

## 10. Withdrawn

No numbered finding was refuted. These statements of the first pass were refuted. Each one was
removed or replaced in the text above.

| Where | Statement of the first pass | Reason |
|---|---|---|
| Section 1 | The shell obeys the four reading modes. | A flashing lamp in Reference and in the Drill does not stop under reduce motion (UX-17). Three type modes are confirmed. |
| UX-01 | 12 of 267 signal questions (4.5 %) is the rate. | A small sample. 1385 signal questions gave 3.4 %; the computed rate is 3.1 %. |
| UX-04 | The navigation is on `Drill.tsx:245`. Some jobs have par 19. | The line is 244. One job has par 19. |
| UX-07 | The 6 radio-step rows show unverified content with no mark. | Each of the 6 rows says "never graded" in its row text. They lack the badge only. |
| UX-09 | Fix: name the rule number to read in the rulebook. | A new sentence with a rule number is a citation written by an agent (fence item 2). |
| UX-10 | At 390 the first screen shows one card. "Ways to learn" starts at y = 1455. | Two cards are in the first screen. The heading is at y = 1425. |
| UX-12 | Picture R4-08 shows the session of 7 of 10. Fix text: "They come back tomorrow." | The picture shows 5 of 10 and two domains. The fix text is false for a missed item, which is due at once. |
| UX-15 | Fix: use one word for joints (no word named). | The frozen `model.js:271` fixes the word "coupling", so the word must be "couplings". |
| UX-16 | Yard, letter spacing: 6 of 7 probes change. | 5 of 7 with the probes of the check; the form controls do not take it. |
| UX-22 | A title search of the library finds none of: joint, cut, … | Two radio-call titles hold "joint" and "cut". No entry explains the words. The word-list text moved to the SME. |
| Section 5 | Quiz validity for the Radio is "checks G and I". | It is check I. Check G is the step index. |
| Section 6, S-12 | 103 items can show the label. | 98 of the 103 can come up in the Drill. |
| Section 7, item 12 | In the shell the focus ring is visible. | It is not visible on the five Settings toggles. |
