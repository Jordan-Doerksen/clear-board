# Job Y1, step 1: the tape comparison and the pictures

Written 2026-11-20 by the build job Y1 (brief `specs/briefs/Y1.md`, requirements 1 to 4, 22 and 34).
Each number in this file comes from a run of the recorder on that date. Step 2 is not started, so
this folder holds no `step2/` folder and no step 2 tape.

## 1. What is in this folder

| Path | What it is |
|---|---|
| `step1/` | 15 full-page pictures of the Yard on the build of the step 1 commit, at device scale factor 1. |
| `tapes/before.tape.json` | The compact tape of the build of the start commit `c2fb637`. |
| `tapes/step1.tape.json` | The compact tape of the build of the step 1 commit `1a0110f`. |
| `tape-summary.md` | This file. |

The recorder script `yard-tape.mjs` and the full tapes are in the scratch folder of the job and
are not in the repository (`Y1-TAPE`, option a). The report of the job holds the script text.

A compact record holds the step name, the short fields as recorded (`banner`, `readout`, `canvas`,
`sounds`, `hash`, the count of `errors`) and a SHA-256 of each long field (`words`, `tree`,
`controls`, `storage`). Each comparison of this file ran on the full tapes.

## 2. The builds

| Name | Commit | How it was made |
|---|---|---|
| before | `c2fb637` | `npm ci`, `npm run build`, then a copy of `dist/` to the scratch folder. |
| step 1 | `1a0110f` | The working tree was clean. `npm run check`, `npm run build`, then a copy of `dist/`. |

## 3. The tape

One tape has 272 records in four passes. Each context has an empty storage and blocked service
workers. A count on `AudioContext.prototype.createOscillator` gives the field `sounds`. The tape
runs in real time: the recorder changes no clock and no timer of the page.

| Pass | Size | Records | What it holds |
|---|---|---|---|
| A | 1440 by 900, scale factor 1 | 238 | 19 loads, 86 authored steps by hand, 1 Depart, 19 resets, 19 watched lines, the switch list of `p2-list`, a refused move and three clicks on the drawing for each job, the help, the sound control, "Look it up" with a new mount, and a leave during "Watch optimal". |
| B | 390 by 844, scale factor 3 | 24 | Each of the six switches, two times. The edge of the hit circle at the AS73 switch. The authored line of the first job. |
| C | 1440 by 900, scale factor 1 | 6 | The time of one PULL of 3 cars on job `p0-1`: three runs with `reducedMotion: 'no-preference'` and three with `'reduce'`. |
| D | 1440 by 900, scale factor 1 | 4 | A leave during "Watch optimal" with a new profile and the sound on. |

Added by Y1 to the tape of the brief:

- Step A8: step A7 again with the sound on. In step A7 the Yard is muted, because it mutes itself
  at each mount. The sound count then cannot show a loop that runs on after the leave.
- Pass D. In pass A each job is complete before step A7. So step A7 cannot show a job that is
  marked complete after the leave. In pass D the stored profile starts with `completed: []`.
- Pass B: one click 20 units right of the centre of the AS73 switch, and one reset before the
  authored line. Reason: a click event gives whole CSS px. At 390 px the click 19 units right of
  the centre lands 15.5 units from the centre and is a hit. The click 20 units right lands 19.3
  units from the centre and is no hit. Measured on the build "before".

What "equal" means: brief Y1, requirement 3. `words`, `controls`, `readout`, `canvas`, `sounds`,
`storage` and `hash` are equal character for character. `tree` and the class list of `banner` are
equal after the class map of requirement 14 is put on the "before" side, with the differences
that requirement 3 names: seven elements lose the `style` attribute and get one class, the frame
of the drawing gets `data-cb`, and the canvas gets the class `yd-view`. The count of `errors` is
equal in each record.

One stored value is rounded for the comparison: the mastery of a domain in `cb.profile.v1`. It
falls with the time since the last answer, so its last digits differ from run to run. Measured: two
runs of the build "before" differ by at most 2.9e-11, and "before" and step 1 differ by at most
3.5e-10. The comparison rounds the value to 3 places. Each other stored value is compared as it is.

## 4. Pair 1: two runs of the build "before"

This is the proof that the method is stable. It was made before a source file changed.

| Pass | Records | Records that are not equal |
|---|---|---|
| A | 238 | 0 |
| B | 24 | 0 |
| C | 6 | 0 |
| D | 4 | 0 |

- Pass C, median time: 1550 ms and 1546 ms with the setting off; 8955 ms and 8965 ms with it on.
- Records where only the last digits of a domain mastery differ: 130. Cause: the value depends
  on the time (section 3). No other field differs in a record.
- The 15 pictures of the two runs are equal: each pair of PNG files has the same SHA-256.

## 5. Pair 2: the build "before" against the build of step 1

| Pass | Records | Records that are not equal |
|---|---|---|
| A | 238 | 0 |
| B | 24 | 0 |
| C | 6 | 0 |
| D | 4 | 0 |

- Pass C, `reducedMotion: 'no-preference'`: median 1550 ms before, 1531 ms after, ratio 0.988.
  The three times after: 1531, 1545, 1530 ms.
- Pass C, `reducedMotion: 'reduce'`: median 8955 ms before, 8961 ms after, ratio 1.001. The three
  times after: 8965, 8960, 8961 ms. In each of these runs `html[data-reduce]` is `1`.
- Both ratios are inside the limit of 10 %.
- Page errors: 2 in pass A and 1 in pass D, in both builds. Each one is
  `TypeError: Cannot set properties of null (setting 'textContent')`, after the leave during
  "Watch optimal" (steps A7 and A8, pass D). It is known defect 9 of the brief, and it stays.
- After the leave with the sound on (step A8 and pass D): the sound count is equal 14 s later in
  both builds (700 in step A8, 3 in pass D). In pass D the stored profile holds `completed: []`
  14 s after the leave, in both builds.
- The bitmap of the canvas is 1340 by 460 in passes A, C and D and 2680 by 920 in pass B, in both
  builds. The SHA-256 of the bitmap is equal in each of the 265 records that hold the Yard.
- Records where only the last digits of a domain mastery differ: 228 (section 3).
- In each record of the step 1 tape, each class under `.yard-wrap` starts with `yd-`.

Tested alone, and not a part of the equality:

- The count of `#yard-style` elements while the Yard is open is 1 before and 0 after.
- The computed `padding-bottom` of `.yard-wrap`, read by a `MutationObserver` at the moment the
  Yard markup enters the document, is `20px` at each mount in both builds. So the style file of
  the Yard chunk is in force before the Yard shows.

In the two compact files of this folder, the fields `words`, `controls`, `storage`, `readout`,
`canvas`, `sounds`, `hash`, `errors` and the text of `banner` are equal in each of the 272
records. The hash of `tree` differs in each record that holds the Yard, because the hash is taken
before the class map. That is expected.

## 6. The pictures

Seven states, each at 1440 by 900 and at 390 by 844, and the first state also at 1280 by 800.
Each picture has its own new context: the actions that reach the state, wait for rest, the
pointer at the top left corner, then one full-page picture. `reducedMotion` is `'no-preference'`.

Each of the 15 pictures of step 1 is equal to its picture of the build "before": each pair of PNG
files has the same SHA-256. No picture scrolls sideways: `scrollWidth` is equal to `clientWidth`
in each state (1440, 390 and 1280).

| Picture | Size in px | SHA-256, first 16 characters | State |
|---|---|---|---|
| `yard@w1440.png` | 1440 by 1234 | `fc0cd781b078ff1c` | The first job at load. |
| `yard@w390.png` | 390 by 1586 | `8ed9da87713c66e5` | The same. |
| `yard@w1280.png` | 1280 by 1234 | `bef42185fceb47e9` | The same. |
| `yard-refusal@w1440.png` | 1440 by 1259 | `3f9a345f3fe0cecc` | The first job after a PULL from a track that is not lined. |
| `yard-refusal@w390.png` | 390 by 1656 | `a7a869f82e230c96` | The same. |
| `yard-list@w1440.png` | 1440 by 1353 | `34a489b9a3de5a12` | Job `p2-list` with line 0 flagged. |
| `yard-list@w390.png` | 390 by 1768 | `32f8f8a26207db53` | The same. |
| `yard-verified@w1440.png` | 1440 by 1216 | `7ce540054e1c1acd` | Job `p2-list` after the order is verified. |
| `yard-verified@w390.png` | 390 by 1591 | `7012474a16277998` | The same. |
| `yard-win@w1440.png` | 1440 by 1257 | `d371a6f6d7c9dd44` | The first job after its authored line. |
| `yard-win@w390.png` | 390 by 1608 | `b4ed5833d77321c5` | The same. |
| `yard-depart@w1440.png` | 1440 by 1281 | `8e73da39cea78df0` | Job `p6-road` after its authored line, before Depart. |
| `yard-depart@w390.png` | 390 by 1662 | `0df96c17a10954c7` | The same. |
| `yard-help@w1440.png` | 1440 by 1563 | `98ee0bca42f18f5b` | The first job with the help open. |
| `yard-help@w390.png` | 390 by 2226 | `79be0f69dd637c32` | The same. |

The blue line around the page in the pictures `yard`, `yard-list` and `yard-help` is the focus
ring of the page area. The app puts the focus there when a page opens. It is the same in the
build "before".

## 7. One computed value that is not equal

A second script read each computed style value of each Yard element (132 to 143 elements, 480
values each) in five states at 1440 and 390, before and after. Each value is equal, with one
exception. The two toolbar rows compute `background-position: 0px 0px` after, and `0% 0%` before.
Cause: the build tool writes `background: none` of the toolbar rule as `background: 0 0`. The
rule text in `yard.css` is the same as before. The rows have no background image, so no pixel
changes, and the pictures are equal.

## 8. Not verified

- The tape ran in headless Chromium (Playwright 1.63.0) only. No other browser and no real phone.
- Sound is counted as calls of `createOscillator`. No sound was heard.
- The branch of the switch-list refusal for a flag on a correct line cannot be reached with the
  data of today. The tape does not cover it. A reading check found the same condition and the
  same sentence in the new controller.
- The hover state of a control is in no picture. A script compared each style rule of the old
  style string with the new files after the class map and the name map: each of the 58 old rules
  has the same selector and the same declarations.
