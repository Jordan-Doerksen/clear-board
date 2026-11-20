# R5 — Accessibility audit of Clear Board

Wave 1 research for the Clear Board 2 change request. Read-only on code and content.
Date: 2026-11-20. Branch `claude/peaceful-mayer-qat99l`. Standard: WCAG 2.1 level AA, and the
acceptance criteria in `SPEC.md` lines 180 to 187.

Checked on 2026-11-20 by the adversarial checker of Wave 1. The checker is now the only writer of
this file. The section "Check record" has the method and the counts. Each finding, each table and
each summary line has a line "Check:".

## Check record

Method of the check:

- Each cited file and line was opened.
- Each measurement was run again with new scripts, against the same build
  (`assets/index-D3qDtqBc.js`), with Playwright 1.63.0, Chromium 157.0.8103.78 and axe-core 4.14.1.
  Service workers were blocked.
- The automated scan was run again on a sample: 17 states, 2 widths, the default mode and the
  high-contrast mode. This is 68 scans.
- Each count in the report was counted again from the raw scan file. The table in section 6 was
  compared with the raw file, cell by cell: 240 cells, 0 different.
- Each proposed fix was tested against the fence (plan section 4). Each finding has a line "Fence:".
- Four fixes were tried in the running page with an injected style or script (A11Y-08, A11Y-13,
  A11Y-26, A11Y-27). No file of the repository was changed.
- Machine load: the load average was 0.9 to 1.2 during the timing runs of the check. Each timing
  was run 3 or 5 times. The check gives the median.
- Web research was not possible. `www.w3.org` did not resolve from the check session.

Meaning of the words in a Check line:

- "confirmed": no statement, number or fix changed. Text marked "Added by the check" can be there.
- "corrected": a statement, a number or a fix changed. The line says what changed.
- "not verified": the check could not reproduce the item. The line says why.

Counts of the Check lines in this file:

| Scope | Check lines | confirmed | corrected | not verified | refuted |
|---|---|---|---|---|---|
| Findings A11Y-01 to A11Y-28 | 28 | 21 | 7 | 0 | 0 |
| Finding A11Y-29, added by the check | 1 | 1 | 0 | 0 | 0 |
| Summary lines, tables and other sections | 38 | 28 | 7 | 3 | 0 |
| Total | 67 | 50 | 14 | 3 | 0 |

The corrected findings are A11Y-04, A11Y-05, A11Y-07, A11Y-13, A11Y-17, A11Y-20 and A11Y-27. In
each of them the evidence was confirmed, and a statement, a count or the fix changed. The check
added one finding (A11Y-29) and marked each other addition "Added by the check".

No finding was refuted. Section 19 lists the statements that the check withdrew.

Items that the lead must read before Gate A:

1. **A flashing lamp (A11Y-13).** `pauseAnimations()` alone can stop a lamp almost dark. A dark lamp
   shows a different aspect. The fix now sets the time to 0 after the pause. R3 (pick 6) and this
   report (pick 2) recommend different options. The owner must get one question, not two.
2. **The dyslexia face (A11Y-20).** The recommended pick ships a font file. Dusk decision D-011 says
   "No web font, no font file" for Dusk. The owner must see this fact with the pick.
3. **`radioSim.js` (A11Y-09, A11Y-16, A11Y-19).** Three fixes edit this file outside the `STEPS`
   wording. Job B3 may change style rules only. The hash gate of G1 must cover the `STEPS` wording
   only, or these fixes make the gate red. The gate does not exist yet (plan fact T9).
4. **Words for signal content (A11Y-05, A11Y-13).** The first text of two fixes gave words for a
   lamp. The fixes now give no word. The SME gives each word.
5. **Reskin or upgrade.** Four fixes are style rules that a reskin job can carry in full: A11Y-08,
   A11Y-15, A11Y-17 and A11Y-26. Each other fix changes a behaviour, a word, a number on the
   screen, a control or the markup. It is work for Y2, for Y4 or for an approved upgrade row (U1).
   It is not reskin work (fence item 3). The line "Fence:" of each finding says which.

## 1. Summary

- The audit has 29 findings: 6 HIGH, 16 MEDIUM, 7 LOW. The first report had 28. The check added
  A11Y-29 (MEDIUM).
  - Check: corrected. The count of the headings in section 3 is 6, 16 and 7 after the addition.
- **Does the reduced-motion setting follow the operating system flag? No.** The app reads the flag
  one time, at the first load of a new profile. It then stores the value. After that the stored value
  wins and the app does not look at the flag again. Section 4 has the measurements.
  - Check: confirmed. The six rows of the table in section 4.1 were measured again. Each row is
    equal. `src/` has one `matchMedia` call (`src/state/AppContext.tsx:12`) and no listener on a
    media query (grep).
- The setting "Reduce motion" makes the Yard slower. It does not stop the motion. A PULL takes
  9.0 s with the setting on and 1.6 s with the setting off (median of 5 runs each). Plan fact T4
  says "6 times faster". The measurement shows 5.7 times slower.
  - Check: confirmed. Measured again, 5 runs each: 8,962 ms with the setting on and 1,545 ms with
    the setting off. The ratio is 5.8. The code gives 6.
- The Yard cannot be played with a keyboard. A screen reader gets no yard state. Plan fact T3 is
  correct: the measured hit radius of a switch at 390 px wide is 4.0 to 5.5 CSS px.
  - Check: confirmed. The walk and the hit-radius test were run again (sections 7 and 8).
- A signal drawing has no text alternative. A learner who cannot see the drawing cannot answer a
  signal question.
  - Check: confirmed. Each `.signal` element has no `aria-label` and each SVG has no `title`
    (A11Y-05).
- The five toggles in Settings show no focus ring.
  - Check: confirmed. A picture of a row with focus on its toggle is equal, byte for byte, to a
    picture of the same row with no focus on it (A11Y-08).
- The automated scan found 9 axe rules that fail, in 123 of 240 scans. It found no contrast failure
  in the default mode. It found one contrast failure in the high-contrast mode.
  - Check: confirmed. Counted again from the raw scan file: 240 scans, 123 with a failure, 9 rules,
    2 scans with `color-contrast`, the two in the high-contrast mode. The sample of 68 scans gave
    the same rules and the same node counts.
- No route scrolls sideways at 390 or at 1440 px wide (240 scans). No keyboard trap was found.
  The Settings dialog handles focus correctly.
  - Check: confirmed. The raw file has 0 scans with sideways scroll. The sample of 68 scans has 0.
    The walk of the check found no trap on 9 states at 2 widths. The dialog test was run again
    (section 7).
- Web research was not possible. The host `www.w3.org` is not reachable from this session. The
  names and levels of the WCAG criteria in this report are from model knowledge and from the rule
  tags of axe-core 4.14.1. They are not verified against the standard.
  - Check: not verified. The check session could not reach `www.w3.org` either. The names and the
    levels stay "from model knowledge, not verified". The check found no name or level that it
    knows to be wrong.

## 2. Method

| Subject | Tool and conditions |
|---|---|
| Build under test | `dist/` served at `http://127.0.0.1:4173/`. Built at 13:30 from the tree. The served `index.html` names `assets/index-D3qDtqBc.js`, which is the file in `dist/assets/`. |
| Browser | Playwright 1.63.0, Chromium 157.0.8103.78, headless, service workers blocked. |
| Automated scan | axe-core 4.14.1, installed in the scratch folder. Tags: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `best-practice`. 30 states, 2 widths (1440 and 390), 4 modes (default, high contrast, dyslexia type, bigger text). 240 scans. |
| Keyboard walk | Playwright key presses (Tab, Shift+Tab, Enter, Space, Escape, arrow keys) at 1440 and at 390. The script recorded each focus stop, its box, its computed outline, and its effective opacity. |
| Names and roles | The ARIA snapshot of Playwright for 11 states, and a DOM query for headings, landmarks, live regions and images. |
| Motion | Playwright `reducedMotion` emulation with a fresh profile and with a stored profile. A counter on `CanvasRenderingContext2D.clearRect` counted the canvas paints. |
| Target sizes | `getBoundingClientRect` of each interactive element in each scan state: 3,744 boxes. |
| Contrast | axe for DOM text. A script computed the worst gradient stop for text on a gradient. The canvas and SVG pairs are computed from the colour constants in the source. |
| Zoom and reflow | Viewports of 640 and 320 CSS px with a device scale factor of 2. This is equal to 200 % and 400 % zoom at 1280 px. |

- Check: confirmed. The file times in `dist/assets/` are 13:30 and no file in `src/`, `public/` or
  `index.html` is newer. The served page names `assets/index-D3qDtqBc.js`. Playwright reports
  1.63.0 and Chromium reports 157.0.8103.78. The axe file reports 4.14.1. The raw scan file holds
  240 scans, 30 states and 3,744 target boxes (counted again).

Limits of the method:

- No screen reader was run. Each statement about what a screen reader says is marked "not verified".
- The scan is of headless Chromium on Linux. Firefox, Safari, a phone and the Tauri desktop build
  were not tested.
- The Drill draws questions at random. Some scan states show a signal question in one scan and a
  text question in the next scan. Section 6 marks the rows where this occurs.
- Machine load: other agents used the machine. The load average was 1.2 to 2.3 during the timing
  runs. Each timing was run 5 times. The spread in a set was 49 ms or less.

- Check: not verified. The load average of the first runs (1.2 to 2.3) cannot be read again. The
  spread of 49 ms agrees with the runs in section 4.2. In the check the load average was 0.9 to 1.2
  and the largest spread in a set of 5 was 40 ms.
- Check: confirmed. The other three limits are correct: the scripts run no screen reader, they run
  headless Chromium only, and the Drill draws at random (the sample showed it on `/#/signals`).

### Plan facts checked

| Fact | Result |
|---|---|
| T2 | Confirmed. The canvas is 1340 by 460 units (`yard/geometry.js:5`), scaled by CSS (`yardSim.js:64`). At 390 px wide the canvas is 352 by 121 CSS px. A 9 px car number draws at 2.36 CSS px. The plan says "about 2.6 px". |
| T3 | Confirmed. `yardSim.js:285-296` is the only code that lines a switch. The radius is 18 units. Measured at 390: 4.0 to 5.5 CSS px, by direction. The canvas has no `tabindex`, no role, no name and no fallback content. No text mirror exists. |
| T4 | Not correct in direction. `yardSim.js:228-229` sets a speed factor of 6 when the setting is on. `yard/anim.js:6` and `anim.js:17` multiply the duration by this factor. The result is 6 times the duration. Measured: 5.7 times slower (section 4.2). The motion does not stop. |
| T10 | Confirmed. `src/stations/Home.tsx:6-12` uses emoji as icons. The emoji are part of the accessible name of each button. |

- Check: confirmed. T2: `geometry.js:5` and `yardSim.js:64` were read; the canvas measured 352.0 by
  120.8 CSS px at 390, and 9 px times the scale 0.2627 is 2.36 px. T3: `yardSim.js:285-296` was
  read; the radius was measured again (section 7). T4: `yardSim.js:228-229` and `anim.js:6,17` were
  read; the time was measured again (section 4.2). T10: the walk of Home gave the names
  "📖 Reference …", "🎯 Drill …", "🚂 The Yard …", "🚦 Signals …" and "📻 Radio walkthrough …".

## 3. Findings

Form of each finding: severity, WCAG criterion, evidence, fix, effort (S: less than half a day,
M: one to two days, L: more), risk of the fix, frozen file, survives the reskin, pass check.
"SPEC 182" means `SPEC.md` line 182. "UX-nn" refers to a finding in `R4-learning-ux-audit.md`.

Added by the check: each finding has a line "Fence:" (the test of the fix against plan section 4)
and a line "Check:". "AppContext.tsx" in this report is the file `src/state/AppContext.tsx`.

- Check: confirmed. `SPEC.md` lines 181 to 187 and line 35 say what the findings quote. Each
  finding UX-nn that this report names is a heading in `R4-learning-ux-audit.md`.
  `REVAMP-DESIGN.md` section 7 item 10 is line 123 of that file.
- Check: not verified. The lines "Effort", "Risk" and "Survives the reskin" of each finding are
  estimates and forecasts. The reskin does not exist yet. The check did not test them.

### HIGH

#### A11Y-01 — The Yard cannot be played with a keyboard
- Severity: HIGH. A learner who does not use a pointer is blocked at the first move.
- WCAG: 2.1.1 Keyboard (A). Also SPEC 182 and `REVAMP-DESIGN.md` section 7 item 10.
- Evidence:
  - `src/stations/yardSim.js:285-296`: a `click` listener on the canvas is the only path to
    `lineSwitch`. No key listener exists in the file.
  - Keyboard walk of `/#/yard` (1440 and 390): 10 stops in the view. The canvas is not a stop.
  - Steps: Tab to "Work it", press Enter. The banner showed "AS71 is lined normal — line its switch
    reverse for the track (CROR 104)." No key changes the switch. Each job needs a lined switch.
- Fix: job Y4. Add one real button for each switch (six buttons, in track order), in the DOM. Each
  button states the track and the position in text. The canvas click calls the same function.
- Effort: M. Risk: MEDIUM (the controller must stay in step with the canvas). Frozen: no.
- Survives the reskin: yes.
- Pass check: with key presses only (Tab, Shift+Tab, Enter, Space, arrow keys), a browser test
  completes job `p0-1` and the element `#msg` shows the win text.
- See also: UX-08.
- Fence: passes. The fix adds controls, so it is not reskin work (fence item 3). It is in job Y4. It
  calls `lineSwitch` from `model.js` and edits no frozen file. The SME confirms the words for the
  position (section 15, note 4).
- Check: confirmed. `yardSim.js:285-296` was read. The file has no `keydown`, `keyup` or `keypress`
  listener (grep). The walk was run again at 1440 and at 390: 10 stops in `main`, and the canvas is
  not a stop. The canvas has no `tabindex`, no role and no name. After a press of "Work it" the
  banner showed the text that the finding quotes.

#### A11Y-02 — The lines of the switch list cannot be flagged with a keyboard
- Severity: HIGH. A job with a switch list cannot start without a pointer.
- WCAG: 2.1.1 Keyboard (A); 4.1.2 Name, Role, Value (A).
- Evidence:
  - `yardSim.js:567-579`: each line is a `div.ord-row` with a `click` listener. It has no role, no
    `tabindex` and no state attribute.
  - Keyboard walk of job `p2-list`: 11 stops in the view. No `.ord-row` is a stop.
  - `yardSim.js:386`: a move is refused until the list is certified. To certify, the learner must
    flag the wrong lines.
  - The state of a line is a glyph (`▢` or `⚑`) and a colour. A screen reader gets the glyph only
    (not verified with a screen reader).
- Fix: make each line a `button` with `aria-pressed`, or a checkbox with a label. Keep the words.
- Effort: S. Risk: LOW. Frozen: no (the list data is in `puzzles.js`; the markup is in `yardSim.js`).
- Survives the reskin: yes.
- Pass check: on job `p2-list` each list line is a Tab stop, Space changes its state, and the
  element exposes the state (`aria-pressed` or `checked`) to the accessibility tree.
- Fence: passes. The element type and the state of a control change, so it is not reskin work. It is
  in job Y4 or an upgrade row (U1). The list data in `puzzles.js` is read only.
- Check: confirmed. `yardSim.js:567-579` and `:386` were read. In the running app each `.ord-row`
  has no role, no `tabindex` and no `aria-pressed`. The walk on job `p2-list` has 11 stops in `main`
  and no `.ord-row`. A press of "Work it" before the list is certified gave the refusal "Verify the
  switch list first — flag the bad lines and certify the order." What a screen reader says for the
  glyph: not verified.

#### A11Y-03 — The Yard gives a screen reader no state and no result
- Severity: HIGH. A learner who cannot see the canvas gets no yard, and no answer to a move.
- WCAG: 1.1.1 Non-text Content (A); 1.3.1 Info and Relationships (A); 4.1.3 Status Messages (AA);
  1.4.5 Images of Text (AA).
- Evidence (ARIA snapshot of `/#/yard` after a refused move):
  - The tree has: button "← Home", combobox "Pick a job", one run of loose text (the readout and the
    work order), three comboboxes, the text "cars", four buttons, the refusal text, a button
    "Look it up →", loose text for the rule chips, and one group.
  - The canvas is not in the tree. `canvas#yard` has no role, no `aria-label` and no fallback
    content (`yardSim.js:154`).
  - Track contents, switch positions, the engine and its cut, TIED, LOOSE and KICKABLE are drawn on
    the canvas only (`yard/render.js`).
  - `#msg` and `#readout` have no `aria-live` and no role (`yardSim.js:149`, `:174`). A refusal, a
    win and the move count change with no announcement (not verified with a screen reader).
  - The view has no heading. The only heading on the route is the `h1` of the shell.
- Fix: job Y4. Add a text mirror: one list item for each track with the switch position, the cars in
  order, and the words TIED, LOOSE and KICKABLE; one line for the engine and its cut. Give `#msg`
  `role="status"`, and `role="alert"` for a refusal. Give the canvas `role="img"` and a name that
  points to the mirror. Add an `h2`.
- Effort: M. Risk: LOW. Frozen: no. The mirror reads the state that `model.js` holds. It does not
  change `model.js`.
- Survives the reskin: yes.
- Pass check: after a refused move, an element with `role="alert"` or `role="status"` contains the
  refusal text; and an element in the DOM lists, for each of the six tracks, the switch position and
  the car numbers, and its text changes after a switch is lined.
- Fence: passes. The mirror, the roles and the heading are new content. They are in job Y4, not in a
  reskin job. The mirror reads the state and does not edit `model.js`. The refusal words stay as
  `model.js` gives them. The SME reads the mirror before it ships (section 15, note 5).
- Check: confirmed. The ARIA snapshot was taken again after a refused move and has the same parts.
  `canvas#yard` has no role, no name and no fallback content. `main` has 0 elements with
  `aria-live`, `role="status"`, `role="alert"` or `role="log"`, and 0 headings. What a screen reader
  says: not verified.

#### A11Y-04 — "Reduce motion" makes the Yard slower and does not stop the motion
- Severity: HIGH. The learner who asks for no motion gets the same motion at about one sixth of the
  speed, and waits 7.4 s more for each move.
- WCAG: 2.2.2 Pause, Stop, Hide (A) for the arrival and the watch mode; 2.3.3 Animation from
  Interactions (AAA). Also SPEC 186 ("all motion skipped/static") and fence item 6.
- Evidence:
  - Code: `yardSim.js:229` `fast = () => reduce ? 6 : 1`. `yard/anim.js:17`
    `dur = step.dur * speedFactor`. `anim.js:6` says "greater than 1 = slower".
  - Measured, one PULL of 3 cars from AS73 on job `p0-1`, 5 runs each: section 4.2. Setting off:
    median 1,568 ms, 93 canvas paints. Setting on: median 9,009 ms, 539 canvas paints.
  - Watch optimal on `p0-1` (one run each): 10.3 s and 445 paints with the setting off, 28.3 s and
    1,518 paints with the setting on. The check ran it 3 times each: median 10,306 ms and 445
    paints, and 28,186 ms and 1,519 paints.
  - Arrival on job `p6-road` (one run each): 5.1 s with the setting off, 5.8 s with the setting on.
    The timer at `yardSim.js:281` cuts the arrival at 5.8 s. The check ran it 3 times each: median
    5,087 ms and 5,814 ms.
  - During a move and during the arrival the controls do nothing and show no message
    (`yardSim.js:286`, `:385`). A click on "Work it" during the arrival left the banner empty.
  - The setting is read one time, when the Yard mounts (`yardSim.js:228`). With the Yard open, the
    setting was turned on in Settings: `data-reduce` became `1`, and the next PULL took 1,593 ms.
  - The operating system flag has no effect on the Yard: flag on and setting off gave 1,580 ms.
  - The depart move (`yardSim.js:522`), measured by the check on job `p6-road`, 3 runs each: median
    1,284 ms with the setting off and 7,794 ms with the setting on. The first report had no
    measurement.
  - Added by the check: `REVAMP-DESIGN.md` section 7 item 10 asks that reduced motion "makes Yard
    animation instant". The comment at `yardSim.js:227-229` says "near-instant". The code does the
    opposite.
- Fix: when motion is reduced, do not call `play()`. Commit the move and paint the end state one
  time. Skip the arrival. In watch mode, show each step as a still picture with a fixed pause. Read
  the setting at each move. Use one resolved value for the whole app (A11Y-07).
- Effort: S to M. Risk: MEDIUM. The commit runs inside the animation today (`commitOnce`,
  `yardSim.js:343-351`). The static path must call the same model functions in the same order.
- Frozen: no (`yardSim.js` and `yard/anim.js` are not frozen).
- Survives the reskin: yes.
- Pass check: with "Reduce motion" on, the time from the click on "Work it" for a valid PULL to the
  change of `#readout` is less than 200 ms, and the canvas is cleared 2 times or less in that time.
- See also: UX-02 (the same ratio, measured independently), R7, A11Y-29.
- Fence: passes. `yardSim.js` and `yard/anim.js` are not frozen. The fix changes behaviour, so it is
  in job Y4 ("motion that stops"), not in a reskin job. The static path calls `pull`, `spot` and
  `kick` of `model.js` and does not edit them. The end state is painted one time, so nothing goes
  blank (fence item 6).
- Check: corrected. The code lines were read. The PULL was timed again, 5 runs each: median 1,545 ms
  and 94 paints with the setting off, 8,962 ms and 539 paints with the setting on, 1,555 ms with the
  flag on and the setting off. A click on "Work it" during the arrival left the banner empty (3
  runs). With the Yard open, the setting was turned on: `data-reduce` became `1` and the next PULL
  took 1,545 ms. Changed: the severity line said "5.7 times more motion", but the motion is the same
  and it is slower; the depart move is now measured; the watch mode and the arrival are now timed 3
  times each.

#### A11Y-05 — A signal drawing has no text alternative
- Severity: HIGH. A learner who cannot see the drawing cannot answer a signal question and cannot
  read a signal entry in Reference.
- WCAG: 1.1.1 Non-text Content (A). axe rule `role-img-alt` (serious).
- Evidence:
  - `src/stations/Signal.tsx:7`: `<span role="img">` with no `aria-label`. The SVG from
    `drawSignal` has no `title` (`src/core/signal.ts:28`).
  - axe: 4 nodes on a signal entry in Reference, 1 node on each signal question and its feedback.
  - ARIA snapshot of a signal question: `img` with a child `img: DV`. The plate text is the only
    content. A drawing with no plate gives an image with no name. In the snapshot of the check the
    drawing had no plate, and the tree was `img` with a child `img`, the two with no name.
  - Read-aloud does not read a signal question (`Drill.tsx:168`).
- Fix: in `Signal.tsx`, build the name from the aspect data: the type, the lamps from top to
  bottom, the flash suffix, the plate and a staggered head. The SME gives the word for each of these
  (section 15, note 1). This report gives none. The name describes the drawing. It does not name the
  indication, so it does not give the answer in a drill. Do not put the item title in the name.
  Until the SME gives the words, ship no name (fence item 15).
- Effort: S. Risk: MEDIUM (a wrong word for a lamp is a content error). Frozen: no for `Signal.tsx`.
  `signal.ts` stays as it is.
- Survives the reskin: yes.
- Pass check: each `.signal[role="img"]` has an accessible name that is not empty; and on a signal
  question the name contains none of the four option texts.
- Note: UX-01 found that one drawing can belong to two indications. A text alternative has the
  same property. It does not make that defect worse.
- Fence: corrected. The first text of the fix gave words for the name ("mast or dwarf", "flashing").
  A word that describes a signal aspect is signal content (fence item 2). The fix now gives no word
  and names the SME as the source. `signal.ts` stays as it is. A new name is new content: an upgrade
  row (U1), not job B2.
- Check: corrected. `Signal.tsx:7` and `signal.ts:28` were read. In the running app each `.signal`
  has no `aria-label` and each SVG has no `title`. axe gave `role-img-alt` on 4 nodes for `sig.405`
  in Reference and on 1 node for each signal question in the sample. `Drill.tsx:168` does not speak
  a signal question (the speech recorder got 0 calls). Changed: the fix text.

#### A11Y-06 — A selected Reference entry opens out of view, and focus does not move
- Severity: HIGH. The learner presses a row and the screen does not change.
- WCAG: 2.4.3 Focus Order (A); 1.3.2 Meaningful Sequence (A); 4.1.3 Status Messages (AA).
- Evidence:
  - `Reference.tsx:52-62`: the detail is rendered after the full list. The list has 219 rows.
  - Measured after Enter on row 1. At 1440: the row is at 331 px, the detail is at 19,419 px, the
    viewport is 900 px high. At 390: the row is at 376 px, the detail is at 27,816 px.
  - Focus stays on the row. The other 218 rows are between the pressed row and the detail in the
    Tab order.
  - The detail has `aria-live="polite"` (`Reference.tsx:73`), but the element is created with its
    content. Whether a screen reader announces it: not verified.
  - With `?focus=rule.104` the search field filters the list to 5 rows, and the detail is in reach.
- Fix: open the detail in place, directly after the pressed row, and set `aria-expanded` on the row.
  Or move focus to the heading of the detail and scroll it into view.
- Effort: S to M. Risk: LOW. Frozen: no.
- Survives the reskin: yes.
- Pass check: after Enter on a Reference row, the heading of the detail is inside the viewport, and
  it is the next element after that row in the DOM order or it has focus.
- See also: UX-03.
- Fence: passes. The fix changes where the detail opens or where focus goes. This is a behaviour: an
  upgrade row (U1), not job B2.
- Check: confirmed. `Reference.tsx:52-62` and `:73` were read. Enter on row 1 was measured again:
  the row is at 331 px and the detail at 19,419 px at 1440 (viewport 900 px high); the row is at 376
  px and the detail at 27,816 px at 390. The list has 219 rows. Focus stays on the row.
  `?focus=rule.104` gives 5 rows. What a screen reader says: not verified.

### MEDIUM

#### A11Y-07 — The "Reduce motion" setting does not follow the operating system flag, and two mechanisms disagree
- Severity: MEDIUM today. It can become HIGH after the reskin if the app sheet does not handle it.
  This is a forecast, not verified.
- WCAG: 2.3.3 Animation from Interactions (AAA). SPEC 186 and SPEC 35 ("`prefers-reduced-motion`
  as law"). Fence items 6 and 7.
- Evidence: section 4. In short:
  - `AppContext.tsx:12` reads the flag only to make the default. `AppContext.tsx:55-63` stores the
    settings at the first render. From then on `loadSettings` (`:14-17`) returns the stored value.
  - No `change` listener on the media query exists in `src/`.
  - CSS uses both. `src/index.css:43` and `:119` use `html[data-reduce="1"]` (2 rules).
    `src/index.css:140-148` uses `@media (prefers-reduced-motion: reduce)` (1 catch-all rule).
  - The Yard uses the app setting only.
  - Result with the flag on and the stored setting off: CSS transitions stop, the Yard animates at
    full speed, and the toggle shows "off".
  - Result with the flag off and the stored setting on: the two CSS transitions stop and the Yard
    runs 5.7 times slower.
  - Dusk 0.2.0 stops its motion with the media query only (`dusk.components.css:630`,
    `dusk.motion.css:62`, `dusk.process.css:164`). It does not know `data-reduce`. After the reskin a
    learner who turns the app setting on, with the flag off, will get the Dusk motion. With the page
    law STRICT (plan fact T8) the Dusk motion is the state transitions of `dusk.components.css`
    only; the motion layer is for the OPEN tier (Dusk `ARCHITECTURE.md`, file table).
- Fix: one resolved value: reduced = the learner's choice is on, or the flag is on. Store only a
  choice that the learner made. Listen for a change of the flag. Write the result to
  `html[data-reduce]`. In the app sheet, after the Dusk layers, add rules under
  `html[data-reduce="1"]` that stop transitions and animations, because the Dusk copy cannot be
  edited. R3 section 5.4 has the selectors that R3 tested. The bridge file holds tokens; the first
  text of this fix put the rule there. Show the reason in Settings when the flag forces the value.
  The rule "on if one of the two is on" is a pick for the owner (section 16).
- Effort: S. Risk: LOW. Frozen: no.
- Survives the reskin: yes.
- Pass check: (a) with a fresh profile and the flag on, `html[data-reduce]` is `1`; (b) with a
  profile that holds no choice by the learner, a change of the flag while the app is open changes
  `html[data-reduce]` in less than 1 s; (c) with `html[data-reduce="1"]` and the flag off, the
  computed `transition-duration` and `animation-name` of each element in each scan state are `0s`
  and `none`.
- Fence: corrected. The first text put a style rule in the bridge file. The bridge file is for
  tokens (plan section 3). The rule now goes in the app sheet, as R3 section 5.4 plans it. The other
  parts (store only a choice of the learner, a listener, a reason text in Settings) change behaviour
  and add words: an upgrade row (U1). The rule "on if one of the two is on" is a pick for the owner.
- Check: corrected. `src/state/AppContext.tsx:12`, `:14-17` and `:55-63` were read. The six rows of
  section 4.1 were measured again and are equal. `src/` has no listener on a media query (grep).
  `src/index.css:43`, `:119` and `:140-148` were read. The three Dusk lines were read; the Dusk copy
  has no `data-reduce`. The Yard with the flag on and the setting off took 1,555 ms for a PULL.
  Changed: the place of the rule in the fix, the severity forecast, and a note on the STRICT tier.

#### A11Y-08 — The five toggles in Settings show no focus ring
- Severity: MEDIUM. A keyboard user cannot see which reading mode Space will change.
- WCAG: 2.4.7 Focus Visible (AA).
- Evidence:
  - `src/index.css:114`: the checkbox has `opacity:0`. The outline of the checkbox is not visible.
    No rule draws a ring on the visible track (`.sw i`).
  - Keyboard walk: each toggle matches `:focus-visible` with a 3 px outline, at an effective
    opacity of 0.
  - Picture `pictures/R5-01-settings-toggle-focus-no-ring-390.png`: focus is on "Higher contrast".
    The picture is equal, byte for byte, to a picture of the dialog with no focus.
- Fix: draw the ring on the track: `.sw input:focus-visible + i`. Keep the ring colour.
- Effort: S. Risk: LOW. Frozen: no.
- Survives the reskin: yes, if the toggle keeps the hidden checkbox. R3 lists the toggle as a part
  that Dusk does not have.
- Pass check: with focus on each checkbox in Settings, a picture of its row differs from a picture
  of the same row with no focus, and the differing pixels have a contrast of 3:1 or more with the
  dialog surface.
- Fence: passes. The fix is one style rule with the `--focus` token. It has no raw colour and
  changes no behaviour, word or control. Job S1 or B1 can carry it.
- Check: confirmed. At 1440 and at 390 each of the five toggles matches `:focus-visible` with a 3 px
  solid outline and an effective opacity of 0. A picture of the row "Higher contrast" with focus on
  its toggle is equal, byte for byte, to a picture of the same row with focus on "Done". The fix was
  tried in the running page: with the rule `.sw input:focus-visible + i` and a 3 px outline in
  `--focus`, the two pictures differ and the ring shows around the track. `--focus` on the dialog
  surface has 6.85:1 (computed).

#### A11Y-09 — Focus is lost after each question and after each radio call
- Severity: MEDIUM. A keyboard user needs 6 Tab presses for each question. 2 are necessary.
- WCAG: 2.4.3 Focus Order (A).
- Evidence:
  - Drill, keyboard only: 2 Tab presses to the first option. Space answers. Focus moves to
    "Next →" (`Drill.tsx:245`, `autoFocus`). Enter on "Next →" removes the button. Focus goes to
    `body`. The next Tab stops are: browser, skip link, Home, Settings, "← Home", first option.
  - "Call it yourself" has the same code (`RadioTest.tsx:196`).
  - Guided radio: Enter on "Key the radio" replaces the button (`radioSim.js:163`). Focus goes to
    `body`. One Tab press returns to the new button in Chromium. Other browsers: not verified.
  - A screen reader that loses focus goes back to the top of the page (not verified).
- Fix: after "Next", move focus to the heading of the new question (`tabindex="-1"`) or to the first
  option. In the guided radio, keep one button element and change its text, or focus the new button.
- Effort: S. Risk: LOW. Frozen: no (no change to the `STEPS` wording).
- Survives the reskin: yes.
- Pass check: after Enter on "Next →", `document.activeElement` is inside `main`, and one Tab press
  reaches the first answer option. After Enter on "Key the radio", `document.activeElement` is the
  "Key the radio" button.
- Fence: passes with one condition. A focus move is a behaviour: an upgrade row (U1). The
  guided-radio part edits `radioSim.js` outside the `STEPS` wording. Job B3 may change style rules
  only in that file, so this part is not B3 work. The hash gate of G1 must cover the `STEPS` wording
  only. The gate does not exist yet (plan fact T9): not verified.
- Check: confirmed. Run again at 1440 and at 390: 2 Tab presses to the first option; Space answers;
  focus goes to "Next →"; Enter puts focus on `body`; then 6 Tab presses reach the first option
  (browser, skip link, Home, Settings, "← Home", option). "Call it yourself": focus goes to "Next
  call →", then to `body`. Guided radio: after Enter on "Key the radio" focus is on `body`, and one
  Tab press reaches the new `#keyBtn`. Other browsers and a screen reader: not verified.

#### A11Y-10 — The feedback live region is created with its content, and it is always polite
- Severity: MEDIUM. A screen reader user can miss "Right." or "Not quite.".
- WCAG: 4.1.3 Status Messages (AA). `REVAMP-DESIGN.md` section 7 item 10 asks for polite for S1 and
  assertive for S3.
- Evidence:
  - `Drill.tsx:236-237` and `RadioTest.tsx:183-184`: the `div.feedback` with `aria-live="polite"`
    is added to the DOM with its text. No live region exists before the answer.
  - At the same moment focus moves to "Next →". The focus announcement can replace the message.
    Not verified with a screen reader.
  - The region is polite for each severity. `severityOf` is used for the text only (`Drill.tsx:240`).
  - The Yard has no live region (A11Y-03). The guided radio has no live region (A11Y-19).
- Fix: keep one empty `role="status"` element in the view from the first render. Write the verdict
  into it. For a miss on an S3 item use `role="alert"`. Add `aria-describedby` on "Next →" that
  points to the verdict.
- Effort: S. Risk: LOW. Frozen: no.
- Survives the reskin: yes.
- Pass check: before an answer, `main` contains one element with `role="status"` and no text. After
  a wrong answer on an S3 item, an element with `role="alert"` or `aria-live="assertive"` contains
  "Not quite.".
- Fence: passes. A new live region and a new role are new markup with a new behaviour: an upgrade
  row (U1).
- Check: confirmed. `Drill.tsx:236-245` and `RadioTest.tsx:183-196` were read. In the running app
  `main` has no live region on a Drill question, and the feedback element is created with
  `aria-live="polite"` and its text. Focus is on "Next →" at that moment. What a screen reader says:
  not verified.

#### A11Y-11 — The right option and the wrong option differ by colour only
- Severity: MEDIUM. A learner who cannot tell red from green can keep the wrong answer in memory.
- WCAG: 1.4.1 Use of Color (A); 4.1.2 Name, Role, Value (A). Fence item 5.
- Evidence:
  - `src/index.css:93-94`: `.opt.right` and `.opt.wrong` change the border colour and the tint.
    No text and no icon is added (`Drill.tsx:232-233`, `RadioTest.tsx:178-179`).
  - Contrast between the two border colours: 1.32:1 (`#3fb950` against `#f85149`).
  - After a wrong answer the four buttons have no `aria-label`, no `aria-pressed` and no
    description. The class is the only difference.
  - With forced colours emulated, the computed border colour of the four options is the same.
  - The words "Right." and "Not quite." are in the feedback. The feedback text does not always
    repeat the text of the right option.
  - Added by the check: in 27 wrong answers on four Drill domains, the feedback text held the text
    of the right option in 19 and did not hold it in 8.
  - Added by the check: after the answer the four options are disabled and are not Tab stops. The
    feedback state has 3 stops in `main`: "← Home", "Look it up →" and "Next →".
  - Picture `pictures/R5-03-drill-wrong-answer-390.png`.
- Fix: add visible words to the two options, for example a mark and "Correct answer" and
  "Your answer", and make the words part of the accessible name.
- Effort: S. Risk: LOW. Frozen: no. This adds words, so it is an upgrade row (U1), not reskin work.
- Survives the reskin: yes.
- Pass check: after a wrong answer, the accessible name of the right option contains "correct", the
  accessible name of the picked option contains "your answer", and the two texts are visible.
- See also: UX-14.
- Fence: passes. The fix adds visible words, so it is an upgrade row (U1), as the finding says. The
  words are interface words, not rule content.
- Check: confirmed. `src/index.css:93-94`, `Drill.tsx:232-233` and `RadioTest.tsx:178-179` were
  read. `#3fb950` against `#f85149` is 1.32:1 (computed again). After a wrong answer the four
  options have no `aria-label`, no `aria-pressed` and no `aria-describedby`. With forced colours the
  border of the four options is `rgb(96, 0, 0)`.

#### A11Y-12 — The position of a switch is shown by colour only
- Severity: MEDIUM. With A11Y-01 it is part of a HIGH block.
- WCAG: 1.4.1 Use of Color (A). Fence item 5.
- Evidence:
  - `yard/render.js:112-128`: the same diamond is filled `#39b58a` for normal and `#f2b134` for
    reverse. Reverse adds a circle at 25 % alpha (a glow).
  - Contrast between the two fills: 1.36:1. No shape, letter or word differs.
  - Plan fact T12: the comment that calls yellow a rule convention is not verified.
  - Added by the check: the help text of the Yard explains the two positions with the colour words
    "yellow" and "green" only (`yardSim.js:189-191`).
- Fix: job Y2. Show the position by shape (the lined route, or the angle of the target) and by a
  word in the DOM (A11Y-01, A11Y-03). The SME confirms the words and the colours.
- Effort: inside Y2. Risk: LOW. Frozen: no (`render.js` is not frozen).
- Survives the reskin: yes, unless Y2 draws the position by shape.
- Pass check: each switch control in the DOM contains the word for its position, and a picture of
  the canvas changed to grey shows a different shape for a switch lined normal and a switch lined
  reverse.
- Fence: passes. `render.js` is not frozen. The new drawing takes its colours from bridge tokens
  (fence item 4). The words for the positions, and whether a colour is a convention, are for the SME
  (section 15, note 4; plan fact T12).
- Check: confirmed. `yard/render.js:112-128` was read. `#39b58a` against `#f2b134` is 1.36:1
  (computed again). In the running app the pixel at the centre of a switch changes between a green
  fill and a yellow fill, and the shape does not change.

#### A11Y-13 — A flashing lamp flashes with reduced motion on, and no word says "flashing"
- Severity: MEDIUM.
- WCAG: 2.2.2 Pause, Stop, Hide (A). The exception for essential motion can apply. Fence items 5
  and 6.
- Evidence:
  - `src/core/signal.ts:35`: an SVG `<animate>` changes the opacity from 1 to 0.12 and back in 1 s,
    with no end.
  - Measured on `sig.413` in Reference: 4 `animate` elements. In 12 samples the opacity of the lamp
    changed between 0.21 and 0.97 with the setting off, and between 0.18 and 0.94 with the setting on
    and the flag on. `animationsPaused()` returned false in the two runs.
  - The CSS rules for reduced motion do not act on SVG animation.
  - In `signals.json` the `f` suffix is the only difference between some aspects, for example
    `["Yf","G"]` (`sig.413`). A stopped lamp with no word shows a different aspect.
  - Added by the check, counted from `signals.json` (read only): 25 of the 42 signal items have a
    flashing lamp. In 29 groups of aspects the `f` suffix is the only difference between aspects of
    different items.
  - The rate is 1 flash each second. This is below the limit of 3 each second in 2.3.1.
- Fix: the owner and the SME pick (sections 15 and 16). Option for reduced motion on: from
  `Signal.tsx`, call `pauseAnimations()` and then `setCurrentTime(0)` on the SVG, so that each lamp
  stops at full brightness. Show a word next to the drawing, with a pointer to the lamp, that says
  that the lamp flashes. The SME gives the word (section 15, note 2). Without the word, do not stop
  the lamp. Without reduced motion, add the same word to the text alternative (A11Y-05).
  - Added by the check: `pauseAnimations()` alone stops a lamp at the opacity of that moment. In
    the test the four lamps of `sig.413` stopped at 0.53. The animation goes down to 0.12
    (`signal.ts:35`), so a lamp can stop almost dark. With `setCurrentTime(0)` after the pause, each
    lamp had an opacity of 1 and `animationsPaused()` was true.
- Effort: S. Risk: MEDIUM (a still lamp with no word teaches a wrong aspect). Frozen: no for the
  wrapper. A static mark inside the drawing needs `signal.ts` (section 14).
- Survives the reskin: yes.
- Pass check (for this option): with reduced motion on, `animationsPaused()` is true for each
  signal SVG, the computed opacity of each lamp is 1, and each drawing that has a flashing lamp has
  a visible text that contains the word that the SME gave.
- See also: UX-17.
- Fence: corrected. (1) `pauseAnimations()` alone can stop a lamp almost dark. This is against fence
  item 6 ("nothing goes blank") and it shows a different aspect. The fix now sets the time to 0. (2)
  The first text gave the word "flashing". The word is signal content (fence item 2); the SME gives
  it. (3) The option adds a word, so it is an upgrade row (U1) after the owner's pick, not job B2.
  `signal.ts` is not edited.
- Check: corrected. `signal.ts:35` was read. On `sig.413` in Reference: 4 `animate` elements; in 12
  samples the opacity went from 0.15 to 0.94 with the setting off, and from 0.18 to 0.94 with the
  setting on and the flag on; `animationsPaused()` was false on the 4 drawings in the two runs.
  Changed: the fix, the pass check, and two counts from the data. R3 (pick 6, and its Check 10.6)
  treats the same subject and recommends the other option; the lead must put one question to the
  owner.

#### A11Y-14 — 24 kinds of control, and the switch target, are smaller than 44 px
- Severity: MEDIUM. The switch target at 390 is HIGH (A11Y-01, UX-08).
- WCAG: 2.5.5 Target Size (AAA). It is a rule here because of SPEC 182 and fence item 8.
- Evidence: the table in section 9. The sizes are the same at 390 and at 1440, and the same with
  "Bigger text" on for the Yard and the guided radio.
- Fix: a minimum height and width of 44 px on each control, or a hit area of 44 px (for the toggle,
  make the row the label). For the canvas, the buttons of A11Y-01.
- Effort: S for the DOM controls. The canvas is inside Y2 and Y4. Risk: LOW. Frozen: no.
- Survives the reskin: no for the DOM controls (the new skin sets the sizes). Yes for the switch.
- Pass check: at 390 and at 1440 px wide, in each scan state, each enabled `button`, `a`, `select`,
  `summary` and `input` (or the label that holds it) has a box of 44 by 44 CSS px or more, and each
  Yard switch has a pointer target of 44 by 44 CSS px or more.
- See also: UX-20.
- Fence: passes. A minimum size in CSS changes no behaviour and no word; a reskin job can carry it
  (fence item 8 gives the 44 px rule). The part "make the row the label" changes the markup and the
  hit area: an upgrade row (U1). The switch buttons are in Y4.
- Check: confirmed. Each size was measured again at 390, at 1440 and at 390 with "Bigger text" on
  (section 9). The count of 24 kinds is correct.

#### A11Y-15 — Three reading modes do not reach the Yard and the guided radio
- Severity: MEDIUM.
- WCAG: 1.4.4 Resize Text (AA) for the app setting. SPEC 184 and fence item 7.
- Evidence (computed style of each text element in `main`, each mode against the default):

  | Route | Text elements | Bigger text changes the size | Dyslexia changes the family | High contrast changes the colour |
  |---|---|---|---|---|
  | Home | 37 | 37 | 37 | 34 |
  | Reference | 17 | 17 | 17 | 15 |
  | Yard | 71 | 0 | 0 | 0 |
  | Radio, guided | 17 | 5 | 17 | 4 |
  | Radio, call it yourself | 12 | 12 | 12 | 11 |

  - Cause: `yardSim.js:44-49` and `radioSim.js:6-33` have their own colours and sizes in px.
    `.yard-wrap` sets its own font family.
  - The canvas text and the SVG text do not change in any mode.
  - Browser zoom works on these routes (section 11).
  - Added by the check: the letter spacing of the dyslexia setting reaches 63 of the 71 text
    elements of the Yard, because `html` sets it and the Yard does not. The family and the line
    height do not reach the Yard.
- Fix: jobs Y1, Y3 and B3 move the two islands to bridge tokens and to `rem`. The pass check is the
  test that they did.
- Effort: inside Y1, Y3, B3. Risk: LOW. Frozen: no (style rules only).
- Survives the reskin: no.
- Pass check: on `/#/yard` and on `/#/radio`, with "Bigger text" on, the computed `font-size` of
  each text element in `main` is larger than with it off; with "Higher contrast" on, the computed
  colour of the body text changes; with the dyslexia setting on, the first font family is the same
  as on `body`.
- See also: UX-16.
- Fence: passes. The fix is style rules in files of Y1, Y3 and B3. In `radioSim.js` it changes style
  rules only, which B3 may do. It uses bridge tokens (fence item 4).
- Check: confirmed. An independent script counted again: the 20 counts of the table are equal.
  `yardSim.js:44-49` and `radioSim.js:6-33` were read.

#### A11Y-16 — Drawn text is too small to read
- Severity: MEDIUM. On a phone it is part of a HIGH block (UX-08).
- WCAG: 1.4.4 Resize Text (AA); 1.4.5 Images of Text (AA); 1.4.10 Reflow (AA).
- Evidence (font size in the source times the measured scale):

  | Text | Source px | At 390 | At 1440 |
  |---|---|---|---|
  | Yard, track id | 13 | 3.4 | 8.6 |
  | Yard, chrome tags | 12 | 3.2 | 7.9 |
  | Yard, TIED and LOOSE | 10 | 2.6 | 6.6 |
  | Yard, car number | 9 | 2.4 | 5.9 |
  | Yard, KICKABLE tag (added by the check, `render.js:150`) | 9 | 2.4 | 5.9 |
  | Yard, a long car number (added by the check, `render.js:172`) | down to 6 | 1.6 | 3.9 |
  | Yard, type tag | 6.5 | 1.7 | 4.3 |
  | Radio scene, gap text | 14 | 6.2 | 15.9 |
  | Radio scene, labels | 9 to 11 | 4.0 to 4.9 | 10.3 to 12.5 |

  - The Yard canvas is 352 CSS px wide at 390 and 882 CSS px wide at 1440.
  - The radio scene is 336 CSS px wide at 390. The check measured 866 CSS px at 1440.
  - Added by the check: `render.js:172` makes the font of a car number smaller, in steps of 0.5 px
    down to 6 px, until the number fits the car. Whether a car in the 19 jobs gets 6 px: not
    verified.
  - Pictures `pictures/R5-02-yard-390.png` and `pictures/R5-04-radio-stage-390.png`.
- Fix: job Y2 for the Yard: a view transform that keeps each text at 12 CSS px or more, or labels in
  the DOM. For the radio scene: put the labels in HTML, outside the SVG.
- Effort: inside Y2. S for the radio scene. Risk: LOW. Frozen: no (`geometry.js` stays; the
  transform is on top of it).
- Survives the reskin: no for the Yard (Y2 draws it again). Yes for the radio scene.
- Pass check: at 390 px wide, no text in the Yard drawing and no text in the radio scene has a
  rendered size of less than 12 CSS px (for a canvas: the font size times the canvas scale).
- See also: UX-08, UX-23.
- Fence: passes. `geometry.js` stays; the view transform is on top of it (fence item 1). The radio
  part moves labels from the SVG to HTML. This edits `radioSim.js` outside `STEPS`, keeps each word,
  and is not B3 style work: an upgrade row (U1), with the same condition on the hash gate as
  A11Y-09.
- Check: confirmed. The scales were measured: 0.2627 at 390 and 0.6582 at 1440 for the Yard canvas
  (352 and 882 CSS px wide), 0.4421 and 1.1395 for the radio scene (336 and 866 CSS px wide). Each
  value of the table is the source size times the scale (computed again). The source sizes were read
  in `render.js` and `radioSim.js`.

#### A11Y-17 — Contrast below AA in 4 text pairs and 7 non-text pairs
- Severity: MEDIUM.
- WCAG: 1.4.3 Contrast (Minimum) (AA); 1.4.11 Non-text Contrast (AA). Fence item 8.
- Evidence: the tables in section 10. The list:
  - Corrected by the check: the list below holds 4 text pairs and 5 non-text pairs. The heading
    says 7 non-text pairs. Section 10 has 7 failing non-text values when the toggle track edge in
    the high-contrast mode (2.92:1) and the switch pair of A11Y-12 (1.36:1) are counted.
  - Added by the check: the edge of the four Yard selects is `#2a313b`. It has 1.30:1 to 1.47:1
    against the Yard background (`#161c25` to `#0b0e12`). Each select shows its value as text.
  - Yard hint text (`.wo-tip`, 12.5 px italic): 3.82:1 at the worst stop of its gradient.
  - "Reset" in Settings in the high-contrast mode: 4.26:1 (axe, `color-contrast`).
  - Placeholder of the Reference search field: 3.44:1 (3.10:1 in the high-contrast mode).
  - Car type tag on the canvas: 2.71:1 to 3.19:1.
  - Search field edge: 1.48:1. Toggle track edge: 1.36:1 (2.92:1 in the high-contrast mode).
    Domain bar track: 1.36:1. Ladder rail on the canvas: 2.37:1. Rail in the radio scene: 1.46:1.
- Fix: the bridge tokens of the new skin. For the hint text use the muted ink token.
- Effort: inside S1, B1, B2, Y2, Y3. Risk: LOW. Frozen: no. The car fills in `geometry.js` pass;
  the tag ink is in `render.js`.
- Survives the reskin: no.
- Pass check: axe `color-contrast` returns zero nodes in each scan state in the default mode and in
  the high-contrast mode; and each pair in section 10 has 4.5:1 or more for text and 3:1 or more for
  a graphic, computed from the bridge tokens.
- Fence: passes. The fix is bridge tokens. The ink of the type tag in the new drawing must come from
  a token (fence item 4). No car fill changes, so `geometry.js` stays.
- Check: corrected. An independent script computed each ratio of the list and of section 10 again
  from the source colours. Each value is equal; for "Reset" the script gives 4.27 and axe gives
  4.26. The placeholder colour is `rgb(117, 117, 117)` in the running app. Changed: the count of
  non-text pairs is explained, and one pair is added.

#### A11Y-18 — Yard move builder: names from `title` only, a sound button with no name, and the job picker discards the job
- Severity: MEDIUM.
- WCAG: 3.3.2 Labels or Instructions (A); 4.1.2 Name, Role, Value (A); 3.2.2 On Input (A).
- Evidence:
  - axe `label-title-only`: 4 nodes in each Yard state (`#picker`, `#act`, `#count`, `#track`).
    No visible label exists. The text "cars" is not a label.
  - `#mute` has the text `🔊` or `🔇` only (`yardSim.js:171`, `:307`). It has no `aria-pressed`.
  - Steps: do one PULL (readout "Moves 2 / par 5 · Joints 1"), focus `#picker`, press ArrowDown.
    The job changed to `p0-2` and the readout showed "Moves 0". No dialog asked for confirmation
    (`yardSim.js:712`).
  - Added by the check: the job picker marks a completed job with `✓` and the next job with `→`
    (`yardSim.js:698`). No word says what a mark means. The first option reads
    "→ Make up the cut · par 5".
- Fix: visible labels for the four selects. Text and `aria-pressed` for the sound button. A
  confirmation when the move count is more than 0, or a "Load job" button.
- Effort: S. Risk: LOW. Frozen: no.
- Survives the reskin: yes.
- Pass check: axe `label-title-only` returns zero nodes on `/#/yard`; and after one PULL, ArrowDown
  on `#picker` does not change `#readout` until the learner confirms.
- Fence: passes. Visible labels, a text and a state on the sound button, and a confirmation are new
  words and a new behaviour: Y4 or an upgrade row (U1), not job Y3.
- Check: confirmed. axe gave `label-title-only` on 4 nodes in each Yard state of the sample. `#mute`
  shows `🔇` or `🔊` and has no `aria-pressed`. After one PULL ("Moves 2 / par 5 · Joints 1"),
  ArrowDown on `#picker` loaded `P0-2` and the readout showed "Moves 0 / par 5 · Joints 0".

#### A11Y-19 — Guided radio: the log is not announced, cannot be scrolled with keys, and the structure has errors
- Severity: MEDIUM.
- WCAG: 4.1.3 Status Messages (AA); 2.1.1 Keyboard (A); 4.1.2 Name, Role, Value (A); 1.1.1
  Non-text Content (A); 3.2.3 Consistent Navigation (AA).
- Evidence:
  - `#log` and `#notebody` have no `aria-live` and no role (`radioSim.js:71-74`). The reply of the
    engineer and the note change with no announcement (not verified with a screen reader).
  - axe `scrollable-region-focusable`: `#log` (maximum height 240 px, `radioSim.js:20`) after 3
    calls. A keyboard user cannot scroll back.
  - axe `aria-prohibited-attr`: `div#sigmark` has `aria-label` and no role (`radioSim.js:38`).
  - axe `heading-order`: the view goes from `h1` to `h3`. The title of the walkthrough is a `div`.
  - The scene SVG has no role and no name (`radioSim.js:44`).
  - `Radio.tsx:25-33`: a `tablist` with two tabs, no `tabpanel`, no `aria-controls`. ArrowRight on
    a tab does nothing. Both tabs are Tab stops.
  - "← Home" is the third stop in the guided mode and the first stop on each other route.
- Fix: `role="log"` on `#log` and `tabindex="0"`. Remove the label from the decoration and add
  `aria-hidden`. Make the title an `h2`. Give the scene `role="img"` and a name from the readout.
  Make the two modes a group of two buttons with `aria-pressed`, or a full tab pattern. Put
  "← Home" first.
- Effort: S. Risk: LOW. Frozen: no. The `STEPS` wording does not change.
- Survives the reskin: yes.
- Pass check: axe returns zero nodes for `scrollable-region-focusable`, `aria-prohibited-attr` and
  `heading-order` in the three guided states; `#log` has `role="log"`; and the first Tab stop in
  `main` is "← Home" in the two modes.
- Fence: passes with the condition of A11Y-09. Each part edits `radioSim.js` outside `STEPS`, or
  `Radio.tsx`. New roles, a new heading and a new order of controls are not B3 style work: an
  upgrade row (U1). No `STEPS` word changes.
- Check: confirmed. The sample gave `aria-prohibited-attr` 1 and `heading-order` 1 on the guided
  start, and `scrollable-region-focusable` 1 more after 3 calls, at 2 widths and in 2 modes. After 3
  calls `#log` is 528 px of content in a 240 px box, with no `tabindex`, no role and no `aria-live`.
  `#sigmark` has `aria-label` and no role. The scene SVG has no `role` and no `aria-label`. The tab
  list has 0 `tabpanel` and 0 `aria-controls`; ArrowRight on a tab changed nothing. The Tab order is
  "Guided", "Call it yourself", "← Home", "Key the radio".

#### A11Y-20 — The dyslexia setting ships no font, and its spacing does not reach buttons
- Severity: MEDIUM. The setting can change nothing but the line height on a device.
- WCAG: none. SPEC 184 ("a dyslexia-friendly face + wider spacing").
- Evidence:
  - `src/index.css:9` names "Atkinson Hyperlegible", then "Comic Sans MS", then Verdana.
  - The build ships no font file: `dist/` holds no `woff`, `woff2`, `ttf` or `otf`. The page has no
    `@font-face` rule, `document.fonts.size` is 0, and no font request was made.
  - In the test browser the face in use was "Liberation Sans" (Chromium DevTools protocol,
    `CSS.getPlatformFontsForNode`). None of the three named faces is on that machine.
  - The face that a learner sees depends on the device: not verified on Windows, macOS, Android
    or iOS.
  - Spacing: with the setting on, `.prompt` has a letter spacing of 0.32 px and a word spacing of
    1.28 px. `.opt`, `.ref-row`, `.back` and `.search` have `normal` and `0px`. The browser sets
    these to normal on form controls, and `font:inherit` does not carry them.
  - The setting does not change the font family in the Yard (A11Y-15).
  - Added by the check: on Home the letter spacing changes on 7 of the 37 text elements. The other
    30 are inside buttons.
- Fix: the owner picks (section 16): ship the face as `woff2` in the offline cache, or keep system
  faces and say so in the setting. In both cases add `letter-spacing:inherit` and
  `word-spacing:inherit` to buttons and inputs.
  - Added by the check: Dusk decision D-011 (Dusk `DECISIONS.md` line 57) says "No web font, no
    font file, no CDN" for Dusk. A font file for one reading mode of the app is outside the Dusk
    copy, but the owner must see this fact with the pick. A face from a package changes
    `package.json`, which belongs to G1 (fence item 9). A font file in the repository does not.
    The licence of the face: not verified.
- Effort: S. Risk: LOW. A font file adds to the offline cache (budget less than 5 MB, SPEC 187).
  Frozen: no.
- Survives the reskin: yes.
- Pass check: with the dyslexia setting on, the computed `letter-spacing` of `.opt` is equal to the
  computed `letter-spacing` of `.prompt`; and, if the owner picks a shipped face, `document.fonts`
  holds a face with the status `loaded` and that family name.
- Fence: corrected. The fix now names two facts that the first text did not have: Dusk decision
  D-011, and the rule that `package.json` belongs to G1 (fence item 9). The two `inherit` rules are
  style rules; a reskin job can carry them. A font file and a new setting text are an upgrade row
  (U1) after the owner's pick.
- Check: corrected. `src/index.css:9` was read. `dist/` holds 0 font files. In the running app
  `document.fonts.size` is 0, the page has 0 `@font-face` rules and made 0 font requests. The
  platform font of `.prompt` is "Liberation Sans" (`CSS.getPlatformFontsForNode`), and `fc-list`
  finds none of the three named faces on the machine. With the setting on, `.prompt` has 0.32 px and
  1.28 px; `.opt`, `.back`, `.ref-row` and `.search` have `normal` and `0px`. Changed: the fix text.

#### A11Y-21 — The Reference list has wrong roles
- Severity: MEDIUM.
- WCAG: 4.1.2 Name, Role, Value (A); 1.3.1 Info and Relationships (A).
- Evidence:
  - `Reference.tsx:55`: `<button role="listitem">`. The role replaces the button role. axe
    `aria-allowed-role`: 219 nodes.
  - `Reference.tsx:59`: with no match the `div[role="list"]` holds a `p`. axe
    `aria-required-children` (critical): 1 node.
  - The "No match" text is not a status message.
- Fix: `ul`, `li`, and a `button` inside each `li`. Put the "No match" text outside the list, in the
  status element.
- Effort: S. Risk: LOW. Frozen: no.
- Survives the reskin: yes.
- Pass check: axe returns zero nodes for `aria-allowed-role` and `aria-required-children` on
  `/#/reference` with a match and with no match, and each row has the role `button`.
- See also: UX-21.
- Fence: passes. The fix changes markup and roles. No behaviour changes, and the "No match" words
  stay. Job B2 can carry it, or an upgrade row (U1).
- Check: confirmed. `Reference.tsx:55` and `:59` were read. The sample gave `aria-allowed-role` on
  219 nodes and `aria-required-children` on 1 node with no match. With no match the list holds one
  `p` element.

### LOW

#### A11Y-22 — The page title does not change, and two views have no heading
- Severity: LOW.
- WCAG: 2.4.2 Page Titled (A); 2.4.6 Headings and Labels (AA); 1.3.1 Info and Relationships (A).
- Evidence:
  - `document.title` is "Clear Board — become a conductor, free" on each route (`index.html:10`).
  - Headings in `main`: Yard, none. Radio guided, two `h3`. Radio "call it yourself" and Drill,
    one `h2` that is the question. Reference and Home, in order.
- Fix: set the title on each route change: station name, then the app name. Give each view one `h2`
  with the station name.
- Effort: S. Risk: LOW. Frozen: no. Survives the reskin: yes.
- Pass check: `document.title` contains the station name on each route and differs between routes;
  the first heading in `main` on each route is an `h2`.
- Fence: passes. A title for each route and a heading for each view are new words: an upgrade row
  (U1). The station names are in `Home.tsx:6-12`.
- Check: confirmed. `document.title` is the same text on 7 states. Headings in `main`: Yard 0;
  guided radio two `h3`; Drill, Signals and "Call it yourself" one `h2`; Reference `h2` then `h3`;
  Home `h2` and `h3` in order.

#### A11Y-23 — Focus goes to the whole view at load, and a ring frames the view
- Severity: LOW.
- WCAG: 2.4.3 Focus Order (A); 2.4.1 Bypass Blocks (A) passes.
- Evidence:
  - `App.tsx:24` focuses `main` on each path change and at the first render.
  - At a fresh load, with no key pressed, `main` matches `:focus-visible` and has a 3 px outline
    around the full view (headless Chromium; a desktop browser: not verified). Pictures
    `pictures/R5-02-yard-390.png` and `pictures/R5-05-route-change-focus-ring-1440.png`.
  - After a route change by mouse the ring does not show. After a route change by keyboard it shows.
  - At load the first Tab stop is inside `main`. The skip link, Home and Settings come after all
    the content. On Reference this is after 219 rows. Shift+Tab reaches Settings in 1 press.
  - The skip link works: it is visible at focus (5.52:1), and Enter moves focus to `main`.
  - The change of the search string (`?focus=`) with no change of path does not move focus.
- Fix: do not move focus at the first load. On a route change, focus the `h2` of the view and draw
  no outline on `main`.
- Effort: S. Risk: LOW. Frozen: no. Survives the reskin: yes.
- Pass check: after a fresh load the first Tab stop is "Skip to content"; after a route change
  `document.activeElement` is the `h2` of the view; `main` has no visible outline at any time.
- Fence: passes. A focus move is a behaviour: an upgrade row (U1) after the owner's pick 4.
- Check: confirmed. `App.tsx:24` was read. At a fresh load `main` has focus, matches
  `:focus-visible` and has a 3 px solid outline (headless Chromium, 2 widths). The first Tab stop on
  Home is the first domain card; the skip link comes after the 13 stops of `main`. Shift+Tab from
  the load reaches "Settings". Enter on the skip link puts focus on `main`. After a route change by keyboard `main`
  matches `:focus-visible`; after a route change by mouse it does not. The effect at `App.tsx:24`
  depends on `location.pathname` only (read). A desktop browser with a window: not verified.

#### A11Y-24 — Home cards: the accessible name hides the visible text, and mastery for each domain has no number
- Severity: LOW.
- WCAG: 2.5.3 Label in Name (A). axe `label-content-name-mismatch` (serious), 7 nodes.
- Evidence:
  - `Home.tsx:54`: `aria-label="Drill The words"` replaces the visible title, the description and
    the progress bar inside the button.
  - `Home.tsx:49`: the mastery of a domain is a 7 px bar with no number. A bar inside a button is
    not announced as a progress bar by a screen reader (not verified).
- Fix: remove the `aria-label`. Add a visible number, for example "12 %", and keep it in the name.
- Effort: S. Risk: LOW. Frozen: no. Survives the reskin: yes.
- Pass check: axe `label-content-name-mismatch` returns zero nodes on Home; the accessible name of
  each domain card contains its visible title and a percent value.
- Fence: passes. Removing the `aria-label` changes no visible word. A visible percent value is a new
  number on the screen: an upgrade row (U1) (fence item 3).
- Check: confirmed. `Home.tsx:54` and `:49` were read. The sample gave `label-content-name-mismatch`
  on 7 nodes. The name of the first card is "Drill The words"; its visible text is "The words" and
  the description. The bar is a `progressbar` with `aria-valuenow`, inside the button. What a screen
  reader says: not verified.

#### A11Y-25 — Read-aloud: the confirmation is not spoken, a device with no voice gets no notice, and it reads the prompt only
- Severity: LOW.
- WCAG: none. SPEC 185.
- Evidence: section 12. In short:
  - `Settings.tsx:27` calls `speak` in the same event that turns the setting on. `speak` still holds
    the old value (`AppContext.tsx:68-71`) and returns. With the speech API recorded, 0 calls were
    made at the toggle.
  - With no voice (`getVoices()` returned 0 in the test browser) and with no speech API, the app
    showed no error and no notice. The toggle stayed on. No code reads `getVoices`.
  - It reads: the question text of a rule or text question, the readout or the incoming call in
    "Call it yourself", the call in the guided radio, and a Reference entry on a button press.
  - It does not read: the answer options, the feedback, a signal question, or the Yard.
  - No control stops the speech. A route change does not stop it.
- Fix: speak the confirmation after the state change. Show "No voice on this device" in the setting
  row when no voice is found. Add the options and the feedback to the text. Cancel on a route change.
- Effort: S. Risk: LOW. Frozen: no. Survives the reskin: yes.
- Pass check: with `speechSynthesis.speak` replaced by a recorder, the toggle to on makes one call
  with the confirmation text; with `getVoices()` empty, the setting row contains the text
  "No voice".
- See also: UX-26.
- Fence: passes. A spoken confirmation, a notice text and more spoken text are a new behaviour and
  new words: an upgrade row (U1).
- Check: confirmed. With `speechSynthesis.speak` replaced by a recorder: 0 calls at the toggle; 1
  call for a rule question (the prompt text); 0 calls for the feedback; 0 calls for a signal
  question; 1 call at "Key the radio"; 1 call in "Call it yourself" (the readout); 0 calls in the
  Yard; 1 call from the "Read aloud" button in Reference. `cancel` was called 0 times on a route
  change. `getVoices()` returned 0 voices. With no speech API the app gave 0 page errors and no
  notice. `src/` has no `getVoices` (grep).

#### A11Y-26 — The Yard scrolls sideways at 320 px, and with wider text spacing at 390 px
- Severity: LOW.
- WCAG: 1.4.10 Reflow (AA); 1.4.12 Text Spacing (AA).
- Evidence: section 11. `select#picker` is 310 px wide at each viewport width. At 320 CSS px the
  page is 328 px wide. With the spacing values of 1.4.12 at 390 px the select is 405 px wide and the
  page is 423 px wide.
- Fix: `max-width:100%` on the select.
- Effort: S. Risk: LOW. Frozen: no. Survives the reskin: no.
- Pass check: on `/#/yard` at 320 px wide, and at 390 px wide with the 1.4.12 spacing values
  applied, `document.documentElement.scrollWidth` is not more than `clientWidth`.
- Fence: passes. The fix is one style rule; job Y3 can carry it.
- Check: confirmed. `select#picker` is 310 px wide at 320, 390, 640 and 1440. At 320 the page is 328
  px wide. With the spacing values of 1.4.12 the select is 405 px wide and the page is 423 px wide
  at 390. The fix was tried in the running page: with `max-width:100%` on the select the page is 320
  px wide at 320.

#### A11Y-27 — With an operating system contrast theme, the toggle state does not show; the contrast setting does not start from the system flag
- Severity: LOW.
- WCAG: 1.4.11 Non-text Contrast (AA); 1.4.1 Use of Color (A).
- Evidence:
  - With forced colours emulated, the computed colour of the toggle knob and of the track is white
    on a white dialog, for a toggle that is on and for a toggle that is off. Picture
    `pictures/R5-06-settings-forced-colours-390.png` (the first toggle is on).
  - Detail from the check: the knob is `rgb(255, 255, 255)`. The track is `rgb(255, 255, 255)` when
    off and `rgba(255, 255, 255, 0.25)` when on. The track edge is `rgb(0, 0, 0)`. The knob is at
    3 px when off and at 25 px when on, but it does not show.
  - The right and the wrong option get the same forced border colour (A11Y-11).
  - Other routes with forced colours: not verified. The emulation did not give stable pictures.
  - `AppContext.tsx:12` reads the motion flag for the default. It does not read
    `prefers-contrast` for the contrast default.
- Fix: draw the knob with a border, and show the state with a position and a mark. A transparent
  border is sufficient, because forced colours paint it. It needs no colour value, so fence item 4
  is not in question. Read `prefers-contrast: more` for the default.
  - Added by the check: the fix was tried in the running page with the rule
    `.sw i::after{border:2px solid transparent}`. With forced colours the border of the knob became
    `rgb(0, 0, 0)`. The knob showed on the left for a toggle that is off and on the right for a
    toggle that is on.
- Effort: S. Risk: LOW. Frozen: no.
- Survives the reskin: yes for the state. No for the colours.
- Pass check: with forced colours emulated, a picture of a toggle that is on differs from a picture
  of the same toggle that is off.
- Fence: passes. A transparent border needs no colour value. Whether a system colour keyword such as
  `CanvasText` is a raw colour under fence item 4 is not decided; the lint helper `token-lint.mjs`
  does not flag it (tested on a trial file in the scratch folder). The border and the mark are style
  work. A default from `prefers-contrast` is a behaviour: an upgrade row (U1).
- Check: corrected. With forced colours emulated, enlarged pictures of a toggle that is on and of a
  toggle that is off show the same empty track. With `prefers-contrast: more` and a fresh profile,
  `data-contrast` is `0`. Other routes with forced colours: not verified. Changed: the fix now says
  how to draw the border, and the fix was tested; the first report said that the track is white, and
  the track of a toggle that is on is white at 25 % alpha.

#### A11Y-28 — Small defects in the shell
- Severity: LOW.
- WCAG: 1.3.1 Info and Relationships (A); 4.1.2 Name, Role, Value (A).
- Evidence:
  - `Settings.tsx:48`: `<label>Reset my progress</label>` has no control.
  - `Settings.tsx:40`: the second line of each toggle ("No animations") is not tied to the control.
  - Emoji are part of the names "⚙ Settings", "📖 Reference", "🔊 Read aloud" and of the tip link
    (T10). A screen reader reads the emoji name first (not verified).
  - The tip link opens a new tab with no notice (`Home.tsx:68`).
  - The selected radio mode differs by border colour and ink colour only. `aria-selected` is set.
  - Added by the check: arrow and triangle glyphs are part of these names: "← Home", "Work it ▸",
    "▶ Watch optimal", "Next →", "Look it up →", "Key the radio ▶". How a screen reader says a
    glyph: not verified.
- Fix: a plain text for the reset row. `aria-describedby` for each toggle. `aria-hidden` on each
  emoji, or an icon from the new skin. Add "(opens a new tab)" to the link.
- Effort: S. Risk: LOW. Frozen: no. Survives the reskin: yes, but the emoji are replaced.
- Pass check: each `label` in the document has a control; each checkbox in Settings has an
  `aria-describedby` that points to its second line; no accessible name of a control starts with
  an emoji.
- See also: UX-32, UX-33.
- Fence: passes. A changed label element, `aria-describedby` and `aria-hidden` change no visible
  word. The text "(opens a new tab)" is a new word: an upgrade row (U1). A new icon set is in the
  reskin (B1).
- Check: confirmed. `Settings.tsx:48` and `:40` were read. In the running app the sixth `label` has
  no control, and 0 checkboxes have `aria-describedby`. `Home.tsx:68` has `target="_blank"`. The
  emoji are in the names. What a screen reader says for an emoji: not verified.

### Added by the check

#### A11Y-29 — "Watch optimal" cannot be stopped or paused
- Severity: MEDIUM. The learner cannot stop a demonstration that runs for 10 s, or for 28 s with
  "Reduce motion" on.
- WCAG: 2.2.2 Pause, Stop, Hide (A). Fence item 6.
- Evidence:
  - `yardSim.js:306`: "Reset" does nothing while a move or the watch mode runs (`if (!busy)`).
    `yardSim.js:385`: "Work it" does nothing. The file has no key listener.
  - Measured on job `p0-1` (3 runs each): the watch mode runs 10.3 s with the setting off and
    28.2 s with the setting on.
  - Steps: press "Watch optimal", wait 1.2 s, press "Reset", press Escape, press "Work it". The
    banner showed "▶ Watching the optimal line — par 5 moves" after each press. Then the job picker
    was changed: the watch mode stopped and the new job loaded.
  - No text says that the job picker is the way out.
  - From the code, not run: "Watch optimal" loads the job again at its start (`yardSim.js:403`), so
    the moves of the learner are discarded with no confirmation.
- Fix: job Y4. Let "Reset" stop the watch mode and load the job again, or show a "Stop" button
  while the watch mode runs. Ask before the moves of the learner are discarded.
- Effort: S. Risk: LOW. Frozen: no (`yardSim.js` is not frozen).
- Survives the reskin: yes.
- Pass check: during "Watch optimal", a press of the stop control ends the watch mode in less than
  200 ms, `#msg` does not show "Watching", and "Work it" answers the next press.
- See also: A11Y-04.
- Fence: passes. A stop control is a new behaviour or a new control: job Y4 or an upgrade row (U1),
  not job Y3. No frozen file changes.
- Check: confirmed. The check added this finding and measured it (`extra.mjs`, `motion3.mjs`). The
  line on the discarded moves is from the code and is not verified in the running app.

## 4. Reduced motion: the answer, with evidence

### 4.1 Does the setting follow the operating system flag?

No. The four questions of the brief:

| Question | Answer | Evidence |
|---|---|---|
| Does the setting follow the flag after the first load? | No. | Rows 1 and 2: the flag changed while the app was open, and again before a reload. `data-reduce` did not change. No listener exists in `src/`. |
| Is the choice stored? | Yes, and also when the learner made no choice. | `AppContext.tsx:61` stores all settings at the first render. Row 1: after the first load the stored value is `false`. |
| What wins when the stored value and the flag disagree? | The stored value wins for the toggle, for `data-reduce` and for the Yard. The flag wins for CSS transitions only. | Rows 4 and 5. |
| Does CSS use the media query or the data attribute? | Both. | `index.css:43` and `:119` use `html[data-reduce="1"]`. `index.css:140-148` uses the media query. The injected styles of the Yard and of the radio have no motion rule and no query. |

- Check: confirmed. Each answer agrees with the code lines and with the table below, which was
  measured again. The injected styles of the Yard and of the radio hold no `transition`,
  `animation` or media query (grep of `yardSim.js` and `radioSim.js`).

Measured with Playwright (`reducedMotion` emulation). "Bar" is the computed transition of the
mastery bar on Home.

| # | Stored before load | Flag at load | `data-reduce` | Toggle | Bar | Flag changed to | `data-reduce` after the change | Bar after the change | `data-reduce` after a reload |
|---|---|---|---|---|---|---|---|---|---|
| 1 | nothing | off | 0 | off | width 0.6s | on | 0 | none | 0 |
| 2 | nothing | on | 1 | on | none | off | 1 | none | 1 |
| 3 | reduce off | off | 0 | off | width 0.6s | on | 0 | none | 0 |
| 4 | reduce off | on | 0 | off | none | off | 0 | width 0.6s | 0 |
| 5 | reduce on | off | 1 | on | none | on | 1 | none | 1 |
| 6 | reduce on | on | 1 | on | none | off | 1 | none | 1 |

- Check: confirmed. The six rows were measured again with a new script (`motion1.mjs`): 54 cells,
  each equal. The stored value after the first load of row 1 is `"reduce":false`, and of row 2
  `"reduce":true`.

### 4.2 The Yard

One PULL of 3 cars from AS73, job `p0-1`. Time from the click on "Work it" to the change of the
readout. 5 runs for each row, each run on a fresh page.

| Setting | Flag | Runs (ms) | Median (ms) | Canvas paints, median |
|---|---|---|---|---|
| Reduce motion off | off | 1591, 1611, 1565, 1562, 1568 | 1,568 | 93 |
| Reduce motion on | off | 9010, 9009, 9013, 8982, 9007 | 9,009 | 539 |
| Reduce motion off | on | 1586, 1576, 1577, 1589, 1580 | 1,580 | 94 |
| Reduce motion on | on | 9008, 9006, 9017, 9010, 8996 | 9,008 | 539 |

The code gives 1,480 ms and 8,880 ms (600 + 280 + 600 ms, times 1 or times 6). The ratio of the
medians is 5.7.

Measured again by the check (`motion2.mjs`): a timer in the page, 5 runs for each row, each run on
a fresh page. The load average was 0.9 to 1.2.

| Setting | Flag | Runs (ms) | Median (ms) | Canvas paints, median |
|---|---|---|---|---|
| Reduce motion off | off | 1567, 1539, 1546, 1545, 1538 | 1,545 | 94 |
| Reduce motion on | off | 8952, 8962, 8962, 8965, 8957 | 8,962 | 539 |
| Reduce motion off | on | 1558, 1561, 1553, 1518, 1555 | 1,555 | 95 |
| Reduce motion on | on | 8961, 8965, 8961, 8952, 8952 | 8,961 | 539 |

- Check: confirmed. The medians of the check are 0.5 % to 1.6 % lower than the first medians. The
  first runs timed from outside the page; the check timed inside the page. The ratio of the medians
  of the check is 5.8. The paint counts agree (93 to 95, and 539).

### 4.3 Every animation and transition in the app

| Where | What | With the setting on | With the flag on |
|---|---|---|---|
| `index.css:42` | Mastery bar width, 0.6 s | stops | stops |
| `index.css:115-116` | Settings toggle, 0.2 s | stops | stops |
| `index.css:137` | Pressed controls move 1 px, no transition | no change | no change |
| `yard/anim.js` (`requestAnimationFrame`) | Yard move, stretch, depart | 6 times longer (measured: PULL 5.8 times, depart 6.1 times) | no change |
| `yardSim.js:270-282` | Arrival of the inbound train, 5.0 s | 5.8 s, then cut by the timer | no change |
| `yardSim.js:401-429` | Watch optimal, with pauses from `setTimeout` | 28.3 s in place of 10.3 s | no change |
| `core/signal.ts:35` (SVG `animate`) | Flashing lamp, 1 s cycle | no change | no change |
| `radioSim.js:149`, `:157` | Scene shift and log scroll, immediate | no change | no change |

The built CSS and the two injected style elements were read in the browser on five routes. They
hold the three transition rules above and no `@keyframes`.

- Check: confirmed. A grep of `src/` (the Dusk copy not included) finds three `transition`
  declarations (`index.css:42`, `:115`, `:116`), one `requestAnimationFrame` loop
  (`yard/anim.js`), one `<animate>` (`core/signal.ts:35`), no `@keyframes` and no `setInterval`.
  The built CSS holds `transition:width .6s`, two times `transition:all .2s`, and no `@keyframes`.
  The times of the Yard rows were measured again 3 times each: arrival 5,087 ms and 5,814 ms;
  watch mode 10,306 ms and 28,186 ms; depart 1,284 ms and 7,794 ms (`motion3.mjs`). The lamp was
  measured again (A11Y-13).

## 5. Scan summary by rule

axe-core 4.14.1. 240 scans. 117 scans had no failure. No scan had a page error.

| Code | axe rule | Impact | WCAG tag | Where | Finding |
|---|---|---|---|---|---|
| I | `role-img-alt` | serious | 1.1.1 | Signal drawings | A11Y-05 |
| C | `aria-required-children` | critical | 1.3.1 | Reference, no match | A11Y-21 |
| R | `aria-allowed-role` | minor | best practice | Reference rows | A11Y-21 |
| L | `label-content-name-mismatch` | serious | 2.5.3 | Home cards | A11Y-24 |
| T | `label-title-only` | serious | best practice | Yard selects | A11Y-18 |
| P | `aria-prohibited-attr` | serious | 4.1.2 | Guided radio | A11Y-19 |
| H | `heading-order` | moderate | best practice | Guided radio | A11Y-19 |
| S | `scrollable-region-focusable` | serious | 2.1.1 | Guided radio log | A11Y-19 |
| K | `color-contrast` | serious | 1.4.3 | Settings, high contrast | A11Y-17 |

axe marked 758 nodes as "needs review" for `color-contrast`. The causes were a gradient behind the
text (Home lede, Yard) and an overlap (SVG text). Section 10 has the hand check of these.

- Check: confirmed. Counted again from the raw scan file: 240 scans, 117 with no failure, 0 page
  errors, 9 rules with the impacts and tags of the table, and 758 "needs review" nodes, each for
  `color-contrast`. The sample of 68 scans gave the same impact and tag for each rule. axe gives
  `scrollable-region-focusable` the tags 2.1.1 and 2.1.3.

## 6. Scan results by state, mode and width

A cell shows the rule code and the number of nodes. `0` means no failure.
Rows marked (r) depend on the random draw of a question: a cell with `0` had a text question.

| State | default 1440 | default 390 | contrast 1440 | contrast 390 | dys 1440 | dys 390 | big 1440 | big 390 |
|---|---|---|---|---|---|---|---|---|
| home | L7 | L7 | L7 | L7 | L7 | L7 | L7 | L7 |
| reference | R219 | R219 | R219 | R219 | R219 | R219 | R219 | R219 |
| reference-focus-rule104 | R5 | R5 | R5 | R5 | R5 | R5 | R5 | R5 |
| reference-signal-detail-open | R1 I4 | R1 I4 | R1 I4 | R1 I4 | R1 I4 | R1 I4 | R1 I4 | R1 I4 |
| reference-no-match | C1 | C1 | C1 | C1 | C1 | C1 | C1 | C1 |
| drill-mixed-question (r) | 0 | I1 | I1 | 0 | 0 | 0 | 0 | I1 |
| drill-definitions-question | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| drill-signals-question (r) | I1 | I1 | I1 | 0 | I1 | I1 | I1 | I1 |
| drill-switching-question | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| drill-securement-question | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| drill-radio-question | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| drill-authority-question | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| drill-operating-question | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| signals-question (r) | I1 | I1 | I1 | I1 | I1 | I1 | I1 | I1 |
| drill-feedback-right | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| drill-feedback-wrong | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| signals-feedback (r) | I1 | I1 | I1 | I1 | 0 | I1 | I1 | I1 |
| drill-summary | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| yard-start | T4 | T4 | T4 | T4 | T4 | T4 | T4 | T4 |
| yard-refusal | T4 | T4 | T4 | T4 | T4 | T4 | T4 | T4 |
| yard-switch-list | T4 | T4 | T4 | T4 | T4 | T4 | T4 | T4 |
| yard-win | T4 | T4 | T4 | T4 | T4 | T4 | T4 | T4 |
| radio-guided-start | P1 H1 | P1 H1 | P1 H1 | P1 H1 | P1 H1 | P1 H1 | P1 H1 | P1 H1 |
| radio-guided-step3 | P1 H1 S1 | P1 H1 S1 | P1 H1 S1 | P1 H1 S1 | P1 H1 S1 | P1 H1 S1 | P1 H1 S1 | P1 H1 S1 |
| radio-guided-done | P1 H1 S1 | P1 H1 S1 | P1 H1 S1 | P1 H1 S1 | P1 H1 S1 | P1 H1 S1 | P1 H1 S1 | P1 H1 S1 |
| radio-test-question | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| radio-test-right | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| radio-test-wrong | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| radio-test-summary | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| settings-dialog | 0 | 0 | K1 | K1 | 0 | 0 | 0 | 0 |

States, in the order of the table: Home; Reference (full list); Reference with `?focus=rule.104`;
Reference with a signal entry and the rule text open; Reference with a search that has no match; a
Drill question on `/#/drill` and on each of the seven domain routes; a question on `/#/signals`;
the feedback after a right answer and after a wrong answer; the feedback on `/#/signals`; the
end-of-session summary; the Yard at start, with a refusal banner, with a switch list, and after a
win; the guided radio at start, after 3 calls and at the end; "Call it yourself" at a question,
after a right answer, after a wrong answer, and at the summary; the Settings dialog.

A scan that passes does not show that a screen is accessible. The Yard rows show `T4` only, and the
Yard has four HIGH findings. axe does not test a canvas.

- Check: confirmed. The 240 cells of the table were compared with the raw scan file by a script:
  0 cells differ. The check scanned a sample again with its own script (`scan.mjs`): 17 states
  (Home; Reference full, no match, `sig.405` open, `rule.104`; Signals question and feedback; Drill
  feedback; Yard start, refusal, switch list, help open; guided radio start and after 3 calls;
  "Call it yourself" question and feedback; Settings), at 1440 and 390, in the default and the
  high-contrast mode. Each of the 68 results agrees with the table. In the rows marked (r) a scan
  with a text question gave no `role-img-alt`, as the table says. One state is new: the Yard with
  the help text open gave `T4` only. The dyslexia and bigger-text columns were not scanned again:
  those 120 cells are confirmed against the raw file only.

## 7. Keyboard walk

The same result at 1440 and at 390 unless the text says a width.

| Route or state | Stops in `main` | Order against the DOM | Order against the screen | Stops with no ring | Trap |
|---|---|---|---|---|---|
| Home | 13 | same | same | 0 | no |
| Reference (first 12 of 221) | 12 | same | same | 0 | no |
| Reference `?focus=rule.104` | 7 | same | same | 0 | no |
| Drill, question | 5 | same | same | 0 | no |
| Drill, feedback | 3 | same | same | 0 | no |
| Signals, question | 5 | same | same | 0 | no |
| Yard, start | 10 | same | same | 0 | no |
| Yard, switch list | 11 | same | same | 0 | no |
| Radio, guided | 4 | same | same | 0 | no |
| Radio, call it yourself | 6 | same | same | 0 | no |
| Settings dialog | 7 | same | same | 5 | no (correct trap) |

The shell adds 3 stops on each route: the skip link, Home and Settings.

- Check: confirmed. A new script walked each row again at 1440 and at 390 (`kbd.mjs`): 13, 12, 7,
  5, 3, 5, 10, 11, 4, 6 and 7 stops. In each walk the order in the DOM and the order on the screen
  did not go back. The only stops with no visible ring are the five toggles. Each full walk came
  back to its first stop. The row "Reference (first 12 of 221)" is 219 rows, "← Home" and the search
  field; the check walked the first 12 only.

Results for each check of the brief:

| Check | Result |
|---|---|
| Tab order against reading order | Passes on each route. No stop went back in the DOM or up the screen. Two exceptions of position: the Reference detail (A11Y-06) and "← Home" in the guided radio (A11Y-19). |
| A visible focus ring on each stop | Passes, except the five toggles in Settings (A11Y-08). The ring is 3 px, `#58a6ff`, 7.49:1 on the page. |
| Skip link | Works. It is not the first stop after a load, because focus starts in `main` (A11Y-23). |
| Focus on route change | Focus moves to `main`. The title does not change (A11Y-22). A ring frames the view (A11Y-23). |
| Settings dialog | Passes. Focus moves to "Done". Tab stays in the dialog (7 stops, then the browser, then "Done"). Escape closes it. Focus returns to "Settings". "Done" does the same. Space changes a toggle. The dialog has the name "Settings". |
| Each control works with Enter or Space | Passes for each control that is a Tab stop. Fails for the two things that are not controls: the canvas switches (A11Y-01) and the switch list lines (A11Y-02). |
| Keyboard trap | None found. Each walk returned to its first stop. |
| Drill with the keyboard only | Works. Focus is lost after "Next →" (A11Y-09). |
| Guided radio with the keyboard only | Works. Focus is lost after each call (A11Y-09). |
| Yard with the keyboard only | Blocked at the first move (A11Y-01). |

- Check: confirmed. Each row was run again. The ring is 3 px, solid, `rgb(88, 166, 255)`;
  7.49:1 on the page is computed again. Settings: focus goes to "Done"; 7 stops in the dialog and
  one stop outside the page (the browser); Space on "Bigger text" changed the `html` font size to
  18.5 px; Escape put focus on "⚙ Settings"; the dialog has the name "Settings". The check did not
  press "Done" to close the dialog: that one statement is not verified. Enter on a tab stop was
  tested for the Reference row, the Drill option (Space), "Next →", "Key the radio", the station
  button and "Settings"; the other controls were not pressed one by one.

### The Yard canvas: the hit radius of a switch

`yardSim.js:290` sets 18 canvas units. A click was moved away from the centre of switch AS71 in
steps of 0.25 CSS px until the switch did not change.

| Width | Canvas, CSS px | Scale | Radius from the code | Radius measured (right, left, down, up) | Drawn diamond | Next switch |
|---|---|---|---|---|---|---|
| 390 | 352 by 121 | 0.263 | 4.73 px | 4.75, 4.0, 5.5, 4.25 px | 3.7 px | 22.9 px away |
| 1440 | 882 by 303 | 0.658 | 11.85 px | 12.0, 11.5, 12.0, 10.75 px | 9.2 px | 57.4 px away |

At 390 the target is about 9.5 px across. The rule is 44 px. Six targets of 44 px do not fit on
this ladder at this scale: the switches are 22.9 px apart.

- Check: confirmed. Measured again with the same method and a new script (`targets.mjs`); the
  state of the switch was read from the pixel at its centre. At 390: canvas 352.0 by 120.8, scale
  0.2627, last hit at 4.75, 4.0, 5.5 and 4.25 px. At 1440: canvas 882.0 by 302.8, scale 0.6582,
  last hit at 12.25, 11.5, 12.0 and 10.75 px. One value differs from the table by one step of
  0.25 px (12.25 against 12.0, to the right at 1440). The distance to the next switch is 87.2 units
  (70 and 52 units, `geometry.js:15`), which is 22.9 px and 57.4 px. The side of the diamond is
  14 units (`render.js:121`), which is 3.7 px and 9.2 px.

## 8. Names and roles

| Check | Result |
|---|---|
| Each control has a name | Passes for each control that is in the tree. Poor names: Yard sound button (an emoji), the four Yard selects (from `title`), Home cards (the name hides the text). |
| Headings in order | Home: `h1`, `h2`, `h3`, in order. Reference: in order. Drill and "Call it yourself": `h1`, then one `h2` (the question). Yard: `h1` only. Guided radio: `h1`, then `h3`. |
| Landmarks | `header`, `main`. Home has a `footer` inside `main`. No `nav`. |
| Language | `lang="en"` is set. |
| Drill feedback in a live region | `aria-live="polite"` is present. It is created with its content and it is never assertive (A11Y-10). |
| Signal SVG text alternative | None (A11Y-05). |
| Yard state | Not exposed (A11Y-03). |
| Live regions on each route | Reference detail (polite), Drill feedback (polite), radio readout and feedback in "Call it yourself" (polite). None on Home, Yard, guided radio and Settings. |

What a screen reader gets on the Yard (from the ARIA snapshot; the speech of a screen reader is
not verified): the job picker, the readout and the work order as one run of text, the three selects
and four buttons of the move builder, the banner text, the rule chips as one run of text, and the
help group. It gets no track, no car, no switch, no engine and no change.

- Check: confirmed. Headings, landmarks, `lang` and live regions were read again from the DOM on 7
  states (`misc.mjs`), and the ARIA snapshots were taken again for a signal question, a signal
  entry, a Home card, the Yard after a refusal, the guided radio after 3 calls and the Settings
  dialog. Each row of the table agrees. The feedback live regions exist only after an answer.
  The speech of a screen reader: not verified.

## 9. Target sizes

3,744 boxes were measured: each interactive element, in each of the 30 states, at 2 widths, in 4
modes. The kinds below are under 44 px. Each other control that the scan saw is 44 by 44 px or
more. Width by height, in CSS px.

| Where | Control | At 390 | At 1440 | With "Bigger text" |
|---|---|---|---|---|
| Shell, each route | Home mark (`button.mark`) | 42 × 42 | 42 × 42 | same |
| Shell, each route | Skip link, when it has focus (from the keyboard walk) | 138 × 40 | 138 × 40 | 155 × 44 (43.8 high; measured by the check) |
| Home | Tip link | 258 × 34 | 258 × 34 | 294 × 37 |
| Reference | "Show the rule text" (`summary`) | 316 × 24 | 846 × 24 | height 28 |
| Settings | 5 toggles (`input`) | 50 × 28 | 50 × 28 | same |
| Yard | Job picker (`select#picker`) | 310 × 39 | 310 × 39 | same |
| Yard | Action (`select#act`) | 102 × 39 | 102 × 39 | same |
| Yard | Count (`select#count`) | 52 to 55 × 39 | 52 to 55 × 39 | same |
| Yard | Track (`select#track`) | 82 × 39 | 82 × 39 | same |
| Yard | "Work it" | 85 × 37 | 85 × 37 | same |
| Yard | "Watch optimal" | 140 × 37 | 140 × 37 | same |
| Yard | "Reset" | 64 × 37 | 64 × 37 | same |
| Yard | Sound | 43.5 × 37 | 43.5 × 37 | same |
| Yard | "Certify order" | 123 × 37 | 123 × 37 | same |
| Yard | "Depart" (disabled when measured) | 83 × 37 | 83 × 37 (measured by the check) | same (measured by the check) |
| Yard | "Look it up" in the banner | 91 × 25 | 91 × 25 | same |
| Yard | Switch list line (`div.ord-row`) | 317 × 36 | 360 × 36 | same |
| Yard | "How to play" (`summary`) | 354 × 19.5 | 884 × 19.5 | same |
| Yard | Switch on the canvas (6) | 9.5 × 9.5 | 23.7 × 23.7 | same |
| Radio, guided | "Key the radio" | 134 × 41 | 134 × 41 | same |
| Radio, guided | "Run it again" | 110 × 43 | 110 × 43 | same |

Count: 24 kinds of DOM control (the five toggles count as five), and the six canvas switches.

Added by the check: the text label of each toggle is also a pointer target for it. The five labels
are 78 to 153 px wide and 19 px high (21 px with "Bigger text").

- Check: corrected. A new script measured each control again in 14 states at 390, at 1440 and at
  390 with "Bigger text" (`targets.mjs`). Each size of the table agrees within 0.5 px. No other
  `a`, `button`, `input`, `select` or `summary` in those states is under 44 px. The count of 3,744
  boxes and the list of small controls agree with the raw scan file. Changed: three cells that
  said "not measured" now hold a measurement. "Depart" was measured disabled only; its enabled
  state is not verified.

## 10. Contrast

### 10.1 DOM text

- axe, default mode: zero `color-contrast` failures in 60 scans. The same in the dyslexia and
  bigger-text modes.
- axe, high-contrast mode: one failure. "Reset" in Settings, `#f85149` on `#222b37`, 4.26:1.
  In the default mode the same text has 4.72:1.
- Hand check of text on a gradient and in the two islands (12 states, each in the default and the
  high-contrast mode, worst gradient stop): one more failure. Yard hint text `.wo-tip`, `#6f7884`,
  12.5 px, 3.82:1 against `#171c24` and 4.09:1 against `#11151b`. The result is the same in the
  high-contrast mode, because the mode does not reach the Yard.
- The Home lede (text on a gradient) passes at each stop.
- Placeholder of the search field: `rgb(117,117,117)` on `#1c232c`, 3.44:1. In the high-contrast
  mode 3.10:1. axe does not test a placeholder.

- Check: confirmed. The raw scan file has `color-contrast` failures in 2 scans, the two for
  "Reset" in the high-contrast mode (4.26:1). The sample of 34 default-mode scans has 0. The
  ratios 4.72, 3.82, 4.09, 3.44 and 3.10 were computed again (`contrast.mjs`). The placeholder is
  `rgb(117, 117, 117)` on `rgb(28, 35, 44)` in the running app. The check computed 39 more DOM
  text pairs of the Yard, the guided radio and the shell from the source colours
  (`contrast2.mjs`): each has 4.5:1 or more. The check did not repeat the hand check of the 12
  states on the rendered page: not verified.

### 10.2 Yard canvas (computed from `render.js:10-19` and `geometry.js:44-48`)

The floor is `#0f1216`. A label sits on a pill of `rgba(10,13,17,0.8)`.

| Pair | Ratio | Need | Result |
|---|---|---|---|
| Track id `#cfd6df` on the pill | 13.2 | 4.5 | pass |
| Lead tag `#7b8590` on the pill | 5.16 | 4.5 | pass |
| Main line and speed tag `#9aa3ad` on the pill | 7.57 | 4.5 | pass |
| TIED and KICKABLE `#f2b134` on the pill | 10.24 | 4.5 | pass |
| LOOSE `#e2574c` on the pill | 5.25 | 4.5 | pass |
| Car number on a loaded car, five types | 7.27 to 8.37 | 4.5 | pass |
| Car number on an empty car, five types | 8.13 to 9.35 | 4.5 | pass |
| Type tag on a loaded car, five types | 3.03 to 3.19 | 4.5 | fail |
| Type tag on an empty car | 2.71 | 4.5 | fail |
| Loaded car body against the floor, five types | 8.26 to 9.51 | 3 | pass |
| Switch normal `#39b58a` against the floor | 7.29 | 3 | pass |
| Switch reverse `#f2b134` against the floor | 9.94 | 3 | pass |
| Switch normal against switch reverse | 1.36 | 3 | fail (A11Y-12) |
| Body track rail `#7d8794` against the floor | 5.15 | 3 | pass |
| Ladder and main rail `#4a525c` against the floor | 2.37 | 3 | fail |
| Clearance tick `#e2574c` against the floor | 5.10 | 3 | pass |
| Engine body `#2d333c` against the floor | 1.48 | 3 | the edge passes |
| Engine edge `#11a3c4` against the floor | 6.31 | 3 | pass |

Each ratio is correct only if the text can be read. At 390 px the text is 1.7 to 3.4 px (A11Y-16).

- Check: confirmed. Each of the 18 rows was computed again from `render.js:10-19`, `:102`, `:175`
  and `geometry.js:44-48` (`contrast.mjs`). Each value is equal. The pill over the floor is
  `#0b0e12`. The ratios are computed from the source colours; no pixel of the canvas was sampled
  for them.

### 10.3 Radio scene (computed from `radioSim.js:44-68`)

| Pair | Ratio | Need | Result |
|---|---|---|---|
| Seven text pairs | 5.20 to 15.92 | 4.5 | pass |
| Rail `#2c3340` on the stage `#10131a` | 1.46 | 3 | fail |
| Car body `#3a4a5e` on the stage | 2.05 | 3 | the edge passes |
| Car edge `#5878a0` on the stage | 4.08 | 3 | pass |

- Check: confirmed. The seven text pairs were computed again: 5.20, 5.43, 7.46, 8.11, 9.28, 10.74
  and 15.92. The three other rows are equal.

### 10.4 Shell, non-text (computed from `src/index.css:3-10`)

| Pair | Default | High contrast | Need |
|---|---|---|---|
| Focus ring on the page | 7.49 | 7.49 (the page colour does not change) | 3 |
| Search field edge on the page | 1.48 | 3.41 | 3 |
| Toggle track edge on the dialog | 1.36 | 2.92 | 3 |
| Toggle knob on the track | 6.46 | 10.70 | 3 |
| Domain bar track edge on the card | 1.36 | 2.92 | 3 |
| Domain bar fill on the track | 6.23 | 5.63 | 3 |
| Skip link text on its background | 5.52 | 5.52 (the two colours do not change) | 4.5 |
| Edge of the four Yard selects on the Yard background (added by the check) | 1.30 to 1.47 | 1.30 to 1.47 (the mode does not reach the Yard) | 3 |

- Check: corrected. Each value of the first table was computed again and is equal. Changed: the
  five cells that said "not computed" now hold a value computed from `src/index.css:3-10`, and one
  row is added from `yardSim.js:44-49` and `:97-101`.

## 11. Text scale, zoom and reflow

| Condition | Result |
|---|---|
| "Bigger text" setting | `html` font size 16 px to 18.5 px (116 %). It scales Home, Reference, Drill, "Call it yourself" and Settings. It does not scale the Yard and the guided radio (A11Y-15). |
| 200 % zoom at 1280 (640 CSS px), 10 states | No sideways scroll. No content past the edge. No clipped element. The same with "Bigger text" on. |
| 400 % zoom at 1280 (320 CSS px), 10 states | Yard: sideways scroll, 328 px against 320 px (A11Y-26). Each other state passes. |
| 320 CSS px with "Bigger text" and dyslexia type | The same result: the Yard only. |
| 390 px with the WCAG 1.4.12 spacing values | Yard: sideways scroll, 423 px against 390 px (A11Y-26). Each other state passes. |
| 390 px with "Bigger text" and dyslexia type | No sideways scroll. |
| Settings dialog at a viewport height of 256 and 400 px | The dialog scrolls inside. The last row is reachable. |
| 390 and 1440, 240 scans | No sideways scroll in any state or mode. |
| Viewport meta | `width=device-width, initial-scale=1.0`. Zoom is not blocked. |

Zoom does not repair the Yard drawing. At 200 % zoom at 1280 the canvas is 602 CSS px wide
(measured by the check), and a car number is 4.0 CSS px, which is 8.1 px on the screen (computed
from the measured width).

Dyslexia type: see A11Y-20. The build ships no font file. A fallback face showed in the test
browser.

- Check: corrected. A new script ran 10 states in each condition (`reflow.mjs`): 640 CSS px, 640
  with "Bigger text", 320, 320 with "Bigger text" and dyslexia type, 390 with the 1.4.12 spacing
  values, and 390 with "Bigger text" and dyslexia type. The results agree: sideways scroll on the
  Yard only, 328 against 320 and 423 against 390. The `html` font size with "Bigger text" is
  18.5 px. The viewport meta is as quoted. The Settings dialog was tested at a viewport height of
  256 and of 450 px: it scrolls inside and the last line can be scrolled into view. The height of
  400 px was not run again: not verified. "No clipped element" was not tested again: not verified.
  Changed: the canvas width at 200 % zoom is now measured (602, not "about 604").

## 12. Read-aloud

The speech API was recorded in one run and removed in a second run.

| Place | What it reads | Source |
|---|---|---|
| Settings, toggle to on | Nothing. The sentence at `Settings.tsx:27` is not spoken. | recorded: 0 calls |
| Home | Nothing. | recorded |
| Reference | Nothing when an entry opens. The button "🔊 Read aloud" reads the title, the plain text and the rule text. The button shows only with the setting on. | `Reference.tsx:95-97`, recorded |
| Drill | The question text of a rule or text question. Not the options. Not the feedback. | `Drill.tsx:168`, recorded |
| Signals | Nothing for a signal question. | recorded |
| Radio, guided | The call, when "Key the radio" is pressed. | `radioSim.js:178`, recorded |
| Radio, call it yourself | The readout, or the incoming call. Not the options. Not the feedback. | `RadioTest.tsx:98`, recorded |
| Yard | Nothing. The setting only starts the Yard with sound effects on. | `yardSim.js:715`, recorded |

With no voice: the test browser has 0 voices. `speak` was called, no sound was made, and the app
showed no error and no notice. With no speech API: the same. No page error occurred, the toggle
stayed on, and the "Read aloud" button stayed on the screen with no effect. The acceptance
criterion "never blocks use" (SPEC 185) passes. The learner is not told (A11Y-25).

- Check: confirmed. The speech API was recorded in one run and removed in a second run
  (`forced.mjs`). Each row agrees: 0 calls at the toggle, on Home, when a Reference entry opens,
  for a signal question, for the feedback and in the Yard; 1 call for the "Read aloud" button, for
  a rule question, for "Key the radio" and for the readout in "Call it yourself". With no speech
  API: 0 page errors and no notice. With the setting on, the Yard sound button showed `🔊`.

## 13. What works and must not be lost in the reskin

- No sideways scroll at 390 and at 1440 in 240 scans.
- No keyboard trap. Tab order is equal to the DOM order and to the screen order on each route.
- The Settings dialog is a native `dialog`: focus moves in, stays in, Escape closes it, and focus
  returns to the opener.
- A 3 px focus ring with 7.49:1 on each stop, except the toggles.
- A working skip link with 5.52:1.
- No axe contrast failure in the default mode.
- Drill options are 48 px high or more. "← Home", "Settings", "Done", "Next →" and "Look it up →"
  in the Drill are 44 px high or more.
- 200 % zoom works on each route.
- `lang` is set, and zoom is not blocked.
- Words carry these states today: TIED and LOOSE, the trust badge, "Right." and "Not quite.",
  "Coming soon", and the refusal text.
- The puzzle picker is a native `select` with groups.
- The mastery bar on Home is a `progressbar` with a name and a value.

- Check: confirmed. Each line was tested again or read in the code: sideways scroll (raw file and
  68 scans), no trap and the orders (section 7), the dialog (section 7), the ring and the skip
  link (sections 7 and 10.4), contrast in the default mode (section 10.1), the heights (no option
  and none of the five named buttons is under 44 px in section 9), zoom (section 11), `lang` and
  the viewport meta (section 8), the words (TIED and LOOSE at `render.js:146`, the badge at
  `Reference.tsx:8-12`, the verdict at `Drill.tsx:238`, "Coming soon" at `Home.tsx:50` and `:64`),
  the `select` with `optgroup` (`yardSim.js:695`), and the bar (`Home.tsx:34`). "Coming soon"
  shows on the Exam button only today: each of the seven domains is live (`src/core/store.ts:6-14`).

## 14. Not offered: needs a frozen file

- A mark inside the signal drawing for a flashing lamp, or a letter inside each lamp for a learner
  who cannot tell the colours. The drawing is `src/core/signal.ts`. The wrapper `Signal.tsx` can add
  a text alternative and a caption (A11Y-05, A11Y-13). It cannot change the drawing.
- A change of the car fills. They are in `yard/geometry.js`. No change is necessary: each fill
  passes. The tag ink that fails is in `render.js`.
- A change of the hint or refusal words. They are in `yard/puzzles.js` and `yard/model.js`. No
  finding needs it.
- Added by the check: a change of the `STEPS` wording in `radioSim.js`. No finding needs it. The
  fixes of A11Y-09, A11Y-16 and A11Y-19 edit the same file outside `STEPS`.

- Check: confirmed. `signal.ts`, `geometry.js`, `puzzles.js` and `model.js` are frozen (plan
  section 4, item 1). No fix in section 3 edits one of them, a file in `public/data/`,
  `solver.js`, or the `STEPS` wording. Each car fill passes in section 10.2.

## 15. Notes for the SME

1. **Words for a signal text alternative (A11Y-05).** The alternative needs a word for each lamp
   code in `signal.ts` (`G`, `R`, `Y`, `L`, `D`), for the `f` suffix, for "mast" and "dwarf", for the
   plates `DV`, `R` and `L`, and for a staggered head. The code holds letters only. The SME gives the
   words. This report proposes none. Counted from the data (read only): `signals.json` uses the
   codes `G`, `R`, `Y`, `Gf`, `Yf` and `Rf`, the types mast and dwarf, the plates `DV`, `R` and
   `L`, and 18 staggered aspects of 140. The codes `L` and `D` are in `signal.ts` and not in the
   data.
2. **A flashing lamp with reduced motion (A11Y-13).** In `signals.json` the flash is the only
   difference between some aspects. If the flash stops, a word must say that the lamp flashes. The
   SME says whether a still lamp with a word is an acceptable picture of a flashing aspect, and
   gives the word. Counted from the data (read only): 25 of the 42 signal items have a flashing lamp, and in
   29 groups of aspects the flash is the only difference between different items. The flash rate in
   the drawing is 1 each second; whether this is a correct picture of the real rate is not verified.
3. **Colour as the carrier of a signal aspect.** The drawing shows red, yellow and green by colour
   only. This is the nature of a signal. The SME says whether a colour word in the text alternative,
   or a visible aid, is acceptable in a recognition drill.
4. **Switch position (A11Y-12, T12).** The fix needs a word for each position in the DOM and a
   shape in the drawing. `model.js` uses "normal" and "reverse". The SME confirms the words, and
   whether yellow for a diverging switch is a convention. The help text of the Yard explains the
   two positions with the colour words only (`yardSim.js:189-191`).
5. **The text mirror of the Yard (A11Y-03).** It will state the track contents and the words TIED,
   LOOSE and KICKABLE as text. The words come from `render.js` and `model.js`. The SME reads the
   mirror before it ships.
6. **One drawing, two indications.** UX-01 found it. A text alternative for the drawing is then
   equal for two indications. No action here; it is for the SME with UX-01. Counted from the data
   (read only): 2 drawings are equal under two or more items.

- Check: corrected. Each note was read against the fence: the notes hold no rule wording and no
  proposed word. Changed: note 2 quoted a word for a lamp; it now asks the SME for the word.
  Counts from `signals.json` are added to notes 1, 2 and 6, and one code line to note 4. The check
  did not judge any rule content.

## 16. Picks for the owner

1. **The reduced-motion rule (A11Y-07).** Recommended: motion is reduced when the learner's choice
   is on or when the device flag is on. Reason: it is the safe side, and the Dusk layers stop on the
   device flag and cannot be edited. Other option: the learner's choice always wins. Reason: full
   control; but it needs CSS that turns the Dusk motion back on.
2. **A flashing lamp with reduced motion on (A11Y-13).** Recommended: the lamp stops at full
   brightness and a word from the SME shows. Reason: fence item 6. Other option: the lamp keeps
   flashing because the flash is the content. Reason: the picture stays equal to the real aspect.
   The SME answers note 2 first. Added by the check: R3 (pick 6) recommends the other option until
   the SME answers, and its Check 10.6 says that neither option is reskin work. The lead gives the
   owner one question for the two reports.
3. **The dyslexia face (A11Y-20).** Recommended: ship one face as a font file in the offline cache.
   Reason: the setting then does the same thing on each device. Other option: system faces only,
   and the setting text says "wider spacing". Reason: no file, no licence text, no cache cost.
   Added by the check: Dusk decision D-011 says "No web font, no font file" for Dusk. The second
   option agrees with D-011. The first option needs the owner's word that D-011 does not bind a
   reading mode of the app.
4. **Focus at the first load (A11Y-23).** Recommended: no focus move at the first load, and focus on
   the view heading after a route change. Reason: the skip link and the header come first, and no
   ring frames the view.
5. **The 44 px switch target on a phone (A11Y-14).** This is part of the Gate A pick "Phone". Six
   targets of 44 px do not fit on the ladder at 390 px with the present geometry. The DOM buttons of
   A11Y-01 give a 44 px path without a change of geometry.

- Check: corrected. Each pick has a recommended option first and a reason for each option. No pick
  gives the owner a command, a path or a step (fence item 13). Changed: pick 2 no longer quotes a
  word for a lamp and now names the R3 pick on the same subject; pick 3 now names Dusk decision
  D-011. The arithmetic of pick 5 is confirmed (section 7).

## 17. Not verified

- The speech of a screen reader (NVDA, JAWS, VoiceOver, TalkBack) on any route. Each statement
  about an announcement is from the DOM, the ARIA snapshot and the known behaviour of live regions.
- The names and levels of the WCAG criteria. `www.w3.org` was not reachable. They are from model
  knowledge and from the axe-core rule tags.
- Firefox, Safari, a phone, a touch screen, and the Tauri desktop build.
- The face that the dyslexia setting shows on Windows, macOS, Android and iOS.
- Forced colours on routes other than Settings and the Drill options.
- The focus ring on `main` at the first load in a desktop browser with a window (seen in headless
  Chromium only).
- The Yard "Depart" button in its enabled state. It was measured disabled, at 390 and at 1440.
- The lines "Effort", "Risk" and "Survives the reskin" of each finding. They are estimates.
- The load average of the first timing runs.
- Whether a car number in the 19 jobs is drawn at the smallest font of 6 px (A11Y-16).
- The licence of the dyslexia face (A11Y-20).
- Whether a system colour keyword is a raw colour under fence item 4 (A11Y-27).
- The scope of the hash gate for `radioSim.js` (A11Y-09, A11Y-16, A11Y-19). The gate does not
  exist yet.
- That "Watch optimal" discards the moves of the learner (A11Y-29). It is from the code.
- The dyslexia and bigger-text columns of section 6 were not scanned again by the check.
- The Settings dialog at a viewport height of 400 px, "Done" as the control that closes the
  dialog, and "no clipped element" at 200 % zoom were not tested again by the check.
- A voice that reads text: the test browser has no voice. The calls to the speech API were recorded.
- The offline (PWA) mode: service workers were blocked in each test.
- The contrast of text in a `select` popup: the browser draws it.

Measured by the check, and no longer in this list: the time of the depart move; the watch mode and
the arrival, 3 runs each; the "Depart" button at 1440; the canvas width at 200 % zoom.

- Check: corrected. Four items left the list because the check measured them. Ten items are new.
  The other items are still not verified: the check ran no screen reader, no other browser, no
  phone, no Tauri build and no offline test, and it could not reach `www.w3.org`.

## 18. Evidence

Pictures, in `specs/research/pictures/`, scale 1:

| File | Shows |
|---|---|
| `R5-01-settings-toggle-focus-no-ring-390.png` | Settings with keyboard focus on "Higher contrast". No ring is visible. |
| `R5-02-yard-390.png` | The Yard at 390 px: the 352 by 121 px canvas, the small controls, and the ring around the view at load. |
| `R5-03-drill-wrong-answer-390.png` | A wrong answer: the two options differ by colour only. |
| `R5-04-radio-stage-390.png` | The guided radio at 390 px: scene text of 4 to 6 px. |
| `R5-05-route-change-focus-ring-1440.png` | The ring around the whole view after a route change by keyboard. |
| `R5-06-settings-forced-colours-390.png` | Settings with forced colours: the first toggle is on and looks the same as the others. |

Scripts and raw results, for the lead, in the scratch folder
`/tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/R5/`:
`scan.mjs` and `scan-default_contrast_dys_big-1440_390.json` (240 scans, with the target boxes);
`kbd.mjs`, `kbd-1440.log`, `kbd-390.log`; `tree.mjs` and `tree-*.yml`; `motion.mjs` and
`motion-*.json`; `misc.mjs` and `misc-*.json`; `extra.mjs`, `extra2.mjs`, `forced.mjs`. The scratch
folder is not durable. The numbers in this report are copied from these files.

Scripts and logs of the check, for the lead, in the scratch folder
`/tmp/claude-0/-home-user-clear-board/97369320-fcc4-5a82-bc9f-093035f8cbac/scratchpad/R5-check/`:
`scan.mjs` and `scan-sample.log` (68 scans); `agg.mjs` and `table6.mjs` (the counts and section 6
against the raw file); `motion1.mjs`, `motion2.mjs`, `motion3.mjs`, `flash.mjs`; `kbd.mjs` and
`kbd.log`; `targets.mjs` and `targets.log`; `contrast.mjs`, `contrast2.mjs`; `modes.mjs`;
`misc.mjs` and `misc.log`; `reflow.mjs` and `reflow.log`; `forced.mjs`, `forced2.mjs`,
`forced3.mjs`; `fb.mjs`; `extra.mjs`. `R5-original.md` is the report before the check. This
folder is not durable.

- Check: confirmed. The six picture files exist in `specs/research/pictures/`. The check looked
  at each picture: each shows what the table says. The check added no picture to the repository.

## 19. Withdrawn

No numbered finding was refuted. The check withdrew these statements of the first report. Each
is corrected in its place.

| Where | Statement of the first report | Reason |
|---|---|---|
| A11Y-04, severity | "gets 5.7 times more motion" | The motion is the same. It takes 5.7 to 5.8 times longer. |
| A11Y-05, fix | The name has the words "mast or dwarf" and "flashing" | A word for a signal aspect is signal content. The SME gives it (fence item 2). |
| A11Y-07, fix | The rule for `html[data-reduce="1"]` goes in the bridge file | The bridge file is for tokens. R3 section 5.4 puts the rules in the app sheet. |
| A11Y-13, fix | With reduced motion on, call `pauseAnimations()` | The lamp stops at the opacity of that moment: 0.53 in the test, and down to 0.12 by the code. A lamp that is almost dark shows a different aspect. The fix now sets the time to 0. |
| A11Y-13, fix and pass check; section 15 note 2; section 16 pick 2 | The word "flashing" shows next to the drawing | The SME gives the word (fence item 2). |
| A11Y-17, heading | "7 non-text pairs" as the count of the list | The list holds 5. Section 10 holds 7 failing non-text values. |
| Section 11 | The canvas is "about 604 CSS px wide" at 200 % zoom | Measured: 602. |
| Section 1 | "28 findings: 6 HIGH, 15 MEDIUM, 7 LOW" | The check added A11Y-29. The count is 29: 6, 16 and 7. |
