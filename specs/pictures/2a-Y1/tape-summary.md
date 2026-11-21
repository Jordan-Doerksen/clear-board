# Job Y1: the tape comparisons and the pictures

Written 2026-11-20 for step 1 and 2026-11-21 for step 2 by the build job Y1 (brief
`specs/briefs/Y1.md`, requirements 1 to 4, 22, 23 and 30 to 34). Each number in this file comes
from a run of a script of the job on that date.

## 1. What is in this folder

| Path | What it is |
|---|---|
| `step1/` | 15 full-page pictures of the Yard on the build of the step 1 commit, at device scale factor 1. |
| `step2/` | 15 full-page pictures of the Yard on the build of the step 2 commit, and 3 pictures of the first job at 390 in the three reading modes. Device scale factor 1. |
| `tapes/before.tape.json` | The compact tape of the build of the start commit `c2fb637`. |
| `tapes/step1.tape.json` | The compact tape of the build of the step 1 commit `1a0110f`. |
| `tapes/step2-base.tape.json` | The compact tape of the step 2 baseline: the build of the merge commit `f4a98ad`. |
| `tapes/step2.tape.json` | The compact tape of the build of the step 2 commit `73dd803`. |
| `tape-summary.md` | This file. |

The recorder script `yard-tape.mjs`, the probe script of step 2 `y1-probe.mjs` and the full tapes
are in the scratch folder of the job and are not in the repository (`Y1-TAPE`, option a). The
recorder did not change between step 1 and step 2. The report of step 1 holds the text of the
recorder. The report of step 2 names the probe script, its path and its SHA-256.

A compact record holds the step name, the short fields as recorded (`banner`, `readout`, `canvas`,
`sounds`, `hash`, the count of `errors`) and a SHA-256 of each long field (`words`, `tree`,
`controls`, `storage`). Each comparison of this file ran on the full tapes.

## 2. The builds

| Name | Commit | How it was made |
|---|---|---|
| before | `c2fb637` | `npm ci`, `npm run build`, then a copy of `dist/` to the scratch folder. |
| step 1 | `1a0110f` | The working tree was clean. `npm run check`, `npm run build`, then a copy of `dist/`. |
| step 2 baseline | `f4a98ad` | The local merge of the wave branch `claude/cb2-wave-2a` at `5cf25ac` into `cb2/2a-Y1`. Then `npm ci`, `npm run build` and a copy of `dist/`. The merge changed no file of Y1. |
| step 2 | `73dd803` | The working tree was clean. `npm run build`, then a copy of `dist/`. |

Step 2 changes one source file, `src/stations/yard/yard.css`, in two commits: `79025f2` (the
colours) and `73dd803` (the type).

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
equal in each record. The tapes of step 1, of the step 2 baseline and of step 2 are all after the
class map, so their comparisons use no map.

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

In the compact files `before` and `step1`, the fields `words`, `controls`, `storage`, `readout`,
`canvas`, `sounds`, `hash`, `errors` and the text of `banner` are equal in each of the 272
records. The hash of `tree` differs in each record that holds the Yard, because the hash is taken
before the class map. That is expected.

## 6. Pair 3: the build of step 1 against the step 2 baseline

This pair proves the tape part of requirement 23: the merge of the wave branch (jobs G1 and S1)
changes no record of the tape. The build of the merge commit is the step 2 baseline.

| Pass | Records | Records that are not equal |
|---|---|---|
| A | 238 | 0 |
| B | 24 | 0 |
| C | 6 | 0 |
| D | 4 | 0 |

- Pass C, `reducedMotion: 'no-preference'`: median 1531 ms for step 1 and 1550 ms for the step 2
  baseline, ratio 1.012. The three times of the step 2 baseline: 1550, 1550, 1545 ms.
- Pass C, `reducedMotion: 'reduce'`: median 8961 ms and 8963 ms, ratio 1.000. The three times of
  the step 2 baseline: 8963, 8953, 8963 ms.
- Page errors: 2 in pass A and 1 in pass D, in both builds (known defect 9).
- Records where only the last digits of a domain mastery differ: 228 (section 3).
- `padding-bottom` of `.yard-wrap` at each mount: `20px` in both builds.

The pictures of the step 2 baseline differ from the pictures of step 1, as the brief expects: S1
changes the shell around the Yard. The help paragraphs of the Yard keep their margins on the step 2
baseline (the picture `yard-help`; the S1 brief, requirement 13).

## 7. Pair 4: the step 2 baseline against the build of step 2

This pair proves the tape part of requirement 33: the tokens of step 2 change no record of the
tape.

| Pass | Records | Records that are not equal |
|---|---|---|
| A | 238 | 0 |
| B | 24 | 0 |
| C | 6 | 0 |
| D | 4 | 0 |

- Pass C, `reducedMotion: 'no-preference'`: median 1550 ms on the step 2 baseline and 1533 ms on
  step 2, ratio 0.989. The three times of step 2: 1519, 1547, 1533 ms.
- Pass C, `reducedMotion: 'reduce'`: median 8963 ms and 8962 ms, ratio 1.000. The three times of
  step 2: 8962, 8967, 8957 ms. In each of these runs `html[data-reduce]` is `1`.
- Page errors: 2 in pass A and 1 in pass D, in both builds (known defect 9).
- Records where only the last digits of a domain mastery differ: 130 (section 3).
- The tape of step 2 is also equal to the tape of step 1 in each of the 272 records.

In the compact files `step1`, `step2-base` and `step2`, each field is equal in each of the 272
records, the hash of `tree` also.

## 8. The pictures

Each picture has its own new context: the actions that reach the state, wait for rest, the
pointer at the top left corner, then one full-page picture. `reducedMotion` is `'no-preference'`.
Seven states, each at 1440 by 900 and at 390 by 844, and the first state also at 1280 by 800.

### 8.1 Step 1

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

### 8.2 Step 2

Each picture of step 2 has the same size as its picture of step 1 and of the step 2 baseline. Each
one differs from its picture of the step 2 baseline in colour only: the box of each element of the
Yard is the same (section 9.2). No picture scrolls sideways: `scrollWidth` is equal to
`clientWidth` in each state (1440, 390 and 1280).

| Picture | Size in px | SHA-256, first 16 characters | Pixels that differ from the step 2 baseline |
|---|---|---|---|
| `yard@w1440.png` | 1440 by 1234 | `fde15e30a8f20146` | 682210 |
| `yard@w390.png` | 390 by 1586 | `b0f1d6c9c567c510` | 446301 |
| `yard@w1280.png` | 1280 by 1234 | `58b13d55aec44ff7` | 682210 |
| `yard-refusal@w1440.png` | 1440 by 1259 | `ca75e22613fb355d` | 708144 |
| `yard-refusal@w390.png` | 390 by 1656 | `fb18ebde0a8b037c` | 475255 |
| `yard-list@w1440.png` | 1440 by 1353 | `f7d693b02dad086e` | 790836 |
| `yard-list@w390.png` | 390 by 1768 | `c7c8b4f611c4c71a` | 511791 |
| `yard-verified@w1440.png` | 1440 by 1216 | `84bf0c0560e7bb16` | 671822 |
| `yard-verified@w390.png` | 390 by 1591 | `2aeb827b0d8ef6e1` | 452303 |
| `yard-win@w1440.png` | 1440 by 1257 | `5a7993a2951cae46` | 706324 |
| `yard-win@w390.png` | 390 by 1608 | `38873d819fb0af77` | 457041 |
| `yard-depart@w1440.png` | 1440 by 1281 | `2f1ab6b6f95fe831` | 727540 |
| `yard-depart@w390.png` | 390 by 1662 | `52a552110ee8dc09` | 476377 |
| `yard-help@w1440.png` | 1440 by 1563 | `d627c8567ea22700` | 977222 |
| `yard-help@w390.png` | 390 by 2226 | `e9e3a73fc089805c` | 675017 |

The 15 pictures of the build of `79025f2` (the colours only) have the same SHA-256 as these: on
this machine the type commit `73dd803` changes no pixel. Cause: the old font stacks and the tokens
`--font-ui` and `--font-mono` give the same faces here (Inter, and DejaVu Sans Mono for the mono
rules; read with `CSS.getPlatformFontsForNode`).

### 8.3 Step 2: the three reading modes

The first job at 390 by 844. The mode is in the stored settings before the page loads. Each other
setting is off.

| Picture | Size in px | SHA-256, first 16 characters | Mode |
|---|---|---|---|
| `yard-dys@w390.png` | 390 by 1698 | `0aea8a712eaaf53e` | The dyslexia type. None of its three named faces is installed on this machine, so the browser shows its fallback face (Liberation Sans). Before step 2 the Yard kept Inter in this mode. |
| `yard-contrast@w390.png` | 390 by 1586 | `03c6972d1ec06680` | Higher contrast. |
| `yard-big@w390.png` | 390 by 1769 | `8a9c52da5be0ee52` | Bigger text. |

No picture scrolls sideways.

### 8.4 The look harness of G1

`npm run look:baseline`, with no flag, on `dist/` of the step 2 baseline: 23 pictures, each one
stable. Then `node tools/look/look.mjs compare --look --gate` on `dist/` of step 2 (ruling
`LOOK-MODE`): 0 shots fail. The three pictures of the page `yard` differ in colour (682210,
446301 and 682210 pixels at 1440, 390 and 1280; listed only, `--look`). On each Yard shot no word,
number, control, id or class is lost, no control and no text is smaller, and the page does not
scroll sideways. 19 of the 23 pictures are the same.

One picture of a page that step 2 does not reach, `reference@w390`, differed by 16 pixels in that
run. The 16 pixels are at the two top corners of the focus ring of the page area. Two more runs of
that shot gave "same on take 2" and 16 pixels again. The style file of the Yard does not load on
that page. The shot is not stable at those corners.

## 9. Computed values

### 9.1 Step 1: one computed value that is not equal

A second script read each computed style value of each Yard element (132 to 143 elements, 480
values each) in five states at 1440 and 390, before and after. Each value is equal, with one
exception. The two toolbar rows compute `background-position: 0px 0px` after, and `0% 0%` before.
Cause: the build tool writes `background: none` of the toolbar rule as `background: 0 0`. The
rule text in `yard.css` is the same as before. The rows have no background image, so no pixel
changes, and the pictures are equal.

### 9.2 Step 2

The probe script of step 2 (`y1-probe.mjs`) read the computed style and the box of each element in
`main`, in the seven states of 8.2, at 1440 and at 390, with each reading mode on and with all
modes off: 56 pages for each build. It compared the build of step 2 with the step 2 baseline.

- Type (requirement 26): with all modes off, each text element of the Yard computes the same
  `font-size` as on the step 2 baseline, to 0.01 px (1476 elements in the 14 pages). With "Bigger
  text" on, each one computes 18.5 / 16 times its size on the baseline, to 0.01 px.
- Boxes (requirement 32): with all modes off, the box of each element of the Yard has the same
  place and the same size as on the step 2 baseline, the 150 control boxes also. 16848 values of
  radius, padding, margin, gap, opacity, `aspect-ratio`, `min-height` and border width are equal.
- The three reading modes (requirement 30, the pass check of R5 A11Y-15). At load, `main` holds 104
  text elements (71 shown; the others are the 32 options of the four selects and the Depart
  button, which does not show at load).
  With "Bigger text" on, each of the 104 is larger (0 on the step 2 baseline). With the dyslexia
  setting on, the first family of each of the 104 is the first family of `body`, "Atkinson
  Hyperlegible" (0 on the baseline). With "Higher contrast" on, 44 of the 104 change colour (0 on
  the baseline): each element that reads `--ink`. The other 60 read `--ink-2` or a tone ink, which
  block 5 of the bridge does not change. The same holds in each of the seven states at both sizes.
- `.yard-wrap` computes the `--ink` of `html`: `#f4f1ec`, and `#fff` in the high-contrast mode.
  The only `--yard-` names on `.yard-wrap` are the 38 names of the Yard block of the bridge, which
  it takes from `:root`.
- The colour words of the help (requirement 27): "yellow" computes `rgb(204, 143, 0)`, the
  `--amber-ink`; "green" computes `rgb(63, 191, 121)`, the `--green-ink`, a green hue.
- The flagged line (requirement 28): the track name of line 0 of `p2-list` computes the `--ink` of
  `html`: `rgb(244, 241, 236)`, and `rgb(255, 255, 255)` in the high-contrast mode. The track name
  of the line that is not flagged computes the `--blue-ink`.
- The lit buttons (requirement 25): Work it, Watch optimal and Depart compute the same
  background (`rgba(242, 194, 122, 0.1)`), the same edge (a transparent border and the ring of
  `--neon-ctl`) and the same text colour (`rgb(242, 194, 122)`), in both modes and at both sizes.
  On hover, Work it also takes a gold border from the rule `.yard-wrap button:hover`. Watch optimal
  and Depart keep the transparent border, because their rules have an id. The cascade is the
  cascade of the step 2 baseline.

## 10. Contrast in step 2, measured from pixels

The probe script read each text pair and each control edge of the Yard on the build of step 2, in
the seven states of 8.2, at 1440 and at 390, in the default mode and in the high-contrast mode, at
rest and with the pointer on each of nine controls: 3172 samples.

Method. The text of the Yard is made transparent. The page is scrolled from the top to the end in
steps of half the window, and at each step the probe takes a picture of the window. The ground of a
text is each pixel of the boxes of its own text nodes in that picture. The colour of the text is its
computed colour. The ratio of a text is the lowest over each pixel of its ground and each sample.
A text in the closed help is not read, because the browser does not paint it. The edge of a control
is its border pixel, or the ring of its shadow where the border is transparent. Its ground is the
pixel 4 px and the pixel 14 px outside the edge, and the ratio is the lower of the two. A pixel of
the focus ring of the page area is not a ground.

Result: each text pair is 4.5 or more, and each edge of an enabled control is 3 or more, in both
modes. The lowest text pairs: the refusal text (`--red-ink` on the red wash over `--panel-hi`)
4.73; the track name of a line that is not flagged (`--blue-ink` on `--head`) 5.37; the label of a
CROR chip (`--blue-ink` on `--panel-hi`) 5.52; the label of an S.I. chip (`--amber-ink` on the
amber wash over the floor) 5.56. The lowest edge of an enabled control: "Look it up" on the red
wash, 3.92. The count select, while it is disabled, keeps the inline opacity .45 that the view sets
(contract A.4): its text is 4.13 and its edge 1.61 in the default mode. A disabled control is exempt
from the need. The opacity is a known item for job Y3 (R3, Check G6).

The ground of a text on the floor includes the glow of the horizon behind the lower part of the
window. So some measured values are lower than the values that the brief computed from the token
values with no browser. Each one stays above its need.

| Kind | Element | State | Text colour | Default mode, lowest | High contrast, lowest | Need | Result |
|---|---|---|---|---|---|---|---|
| edge | `button.yd-back` | hover | - | 12.11 | 12.11 | 3 | pass |
| edge | `button.yd-back` | rest | - | 4.49 | 12.11 | 3 | pass |
| edge | `button.yd-go#certify` | hover | - | 7.65 | 7.65 | 3 | pass |
| edge | `button.yd-go#certify` | rest | - | 6.74 | 6.74 | 3 | pass |
| edge | `button.yd-go#work` | hover | - | 7.53 | 7.53 | 3 | pass |
| edge | `button.yd-go#work` | rest | - | 6.68 | 6.68 | 3 | pass |
| edge | `button.yd-lookup` | hover | - | 4.18 | 9.85 | 3 | pass |
| edge | `button.yd-lookup` | rest | - | 3.92 | 9.85 | 3 | pass |
| edge | `button#depart` | hover | - | 7.61 | 7.61 | 3 | pass |
| edge | `button#depart` | rest | - | 6.29 | 6.29 | 3 | pass |
| edge | `button#mute` | hover | - | 11.11 | 11.11 | 3 | pass |
| edge | `button#mute` | rest | - | 4.12 | 11.11 | 3 | pass |
| edge | `button#optimal` | hover | - | 7.46 | 7.46 | 3 | pass |
| edge | `button#optimal` | rest | - | 6.16 | 6.16 | 3 | pass |
| edge | `button#reset` | hover | - | 11.61 | 11.61 | 3 | pass |
| edge | `button#reset` | rest | - | 4.31 | 11.61 | 3 | pass |
| edge | `div.yd-ord-row.yd-flagged` | hover | - | 6.82 | 6.82 | 3 | pass |
| edge | `div.yd-ord-row.yd-flagged` | rest | - | 6.82 | 6.82 | 3 | pass |
| edge | `div.yd-ord-row` | rest | - | 4.34 | 11.70 | 3 | pass |
| edge | `select#act` | rest | - | 4.35 | 11.74 | 3 | pass |
| edge | `select#count` | rest | - | 4.12; 1.61 disabled | 11.11; 2.86 disabled | 3 | pass |
| edge | `select#picker` | rest | - | 4.49 | 12.11 | 3 | pass |
| edge | `select#track` | rest | - | 4.25 | 11.47 | 3 | pass |
| text | `b` | rest | --ink, --ink-2, --blue-ink, --amber-ink, --ink (high contrast) | 5.52 | 5.52 | 4.5 | pass |
| text | `button.yd-back` | hover | --ink, --ink (high contrast) | 16.22 | 18.27 | 4.5 | pass |
| text | `button.yd-back` | rest | --ink, --ink (high contrast) | 16.22 | 18.27 | 4.5 | pass |
| text | `button.yd-go#certify` | hover | --lit | 8.08 | 8.08 | 4.5 | pass |
| text | `button.yd-go#certify` | rest | --lit | 9.80 | 9.80 | 4.5 | pass |
| text | `button.yd-go#work` | hover | --lit | 7.85 | 7.85 | 4.5 | pass |
| text | `button.yd-go#work` | rest | --lit | 9.57 | 9.57 | 4.5 | pass |
| text | `button.yd-lookup` | hover | --lit | 8.54 | 8.54 | 4.5 | pass |
| text | `button.yd-lookup` | rest | --lit | 9.78 | 9.78 | 4.5 | pass |
| text | `button#depart` | hover | --lit | 8.00 | 8.00 | 4.5 | pass |
| text | `button#depart` | rest | --lit | 9.73 | 9.73 | 4.5 | pass |
| text | `button#mute` | hover | --ink, --ink (high contrast) | 16.22 | 18.27 | 4.5 | pass |
| text | `button#mute` | rest | --ink, --ink (high contrast) | 16.22 | 18.27 | 4.5 | pass |
| text | `button#optimal` | hover | --lit | 7.85 | 7.85 | 4.5 | pass |
| text | `button#optimal` | rest | --lit | 9.54 | 9.54 | 4.5 | pass |
| text | `button#reset` | hover | --ink, --ink (high contrast) | 16.22 | 18.27 | 4.5 | pass |
| text | `button#reset` | rest | --ink, --ink (high contrast) | 16.22 | 18.27 | 4.5 | pass |
| text | `code` | rest | --ink-2 | 10.59 | 10.59 | 4.5 | pass |
| text | `div.yd-banner.yd-bad#msg` | rest | --red-ink | 4.73 | 4.73 | 4.5 | pass |
| text | `div.yd-banner.yd-win#msg` | rest | --green-ink | 6.43 | 6.43 | 4.5 | pass |
| text | `div.yd-note` | rest | --ink, --ink (high contrast) | 15.08 | 16.99 | 4.5 | pass |
| text | `div.yd-readout#readout` | rest | --ink, --ink (high contrast) | 16.22 | 18.27 | 4.5 | pass |
| text | `div.yd-rules-legend` | rest | --ink-2 | 10.95 | 10.95 | 4.5 | pass |
| text | `div.yd-wo-job` | rest | --ink, --ink (high contrast) | 16.68 | 18.79 | 4.5 | pass |
| text | `div.yd-wo-meta` | rest | --ink-2 | 11.07 | 11.07 | 4.5 | pass |
| text | `div.yd-wo-top` | rest | --ink-2 | 10.89 | 10.89 | 4.5 | pass |
| text | `em` | rest | --ink-2 | 10.78 | 10.78 | 4.5 | pass |
| text | `li` | rest | --ink-2 | 10.59 | 10.59 | 4.5 | pass |
| text | `p` | rest | --ink-2 | 11.27 | 11.27 | 4.5 | pass |
| text | `select#act` | rest | --ink, --ink (high contrast) | 16.22 | 18.27 | 4.5 | pass |
| text | `select#count` | rest | --ink, --ink (high contrast) | 16.22; 4.13 disabled | 18.27; 4.51 disabled | 4.5 | pass |
| text | `select#picker` | rest | --ink, --ink (high contrast) | 16.22 | 18.27 | 4.5 | pass |
| text | `select#track` | rest | --ink, --ink (high contrast) | 16.22 | 18.27 | 4.5 | pass |
| text | `span.yd-key-kick` | rest | --amber-ink | 6.99 | 6.99 | 4.5 | pass |
| text | `span.yd-key-normal` | rest | --green-ink | 8.47 | 8.47 | 4.5 | pass |
| text | `span.yd-key-reverse` | rest | --amber-ink | 7.10 | 7.10 | 4.5 | pass |
| text | `span.yd-k` | rest | --blue-ink | 5.51 | 5.51 | 4.5 | pass |
| text | `span.yd-note-more` | rest | --ink-2 | 9.33 | 9.33 | 4.5 | pass |
| text | `span.yd-ord-arrow` | rest | --ink-2 | 9.19 | 9.19 | 4.5 | pass |
| text | `span.yd-ord-fix` | rest | --amber-ink | 6.77 | 6.77 | 4.5 | pass |
| text | `span.yd-ord-flag` | rest | --amber-ink, --ink-2 | 5.66 | 5.66 | 4.5 | pass |
| text | `span.yd-ord-mark` | rest | --ink, --ink (high contrast) | 14.07 | 15.85 | 4.5 | pass |
| text | `span.yd-ord-trk` | rest | --ink, --blue-ink, --ink (high contrast) | 5.37 | 5.37 | 4.5 | pass |
| text | `span.yd-s` | rest | --amber-ink | 6.68 | 6.68 | 4.5 | pass |
| text | `span.yd-unit` | rest | --ink-2 | 10.84 | 10.84 | 4.5 | pass |
| text | `span.yd-wo-from` | rest | --ink-2 | 10.98 | 10.98 | 4.5 | pass |
| text | `span.yd-wo-id` | rest | --ink, --ink (high contrast) | 16.68 | 18.79 | 4.5 | pass |
| text | `span.yd-wo-tag.yd-si` | rest | --teal-ink | 7.32 | 7.32 | 4.5 | pass |
| text | `span.yd-wo-tag` | rest | --teal-ink | 7.32 | 7.32 | 4.5 | pass |
| text | `span.yd-wo-tip` | rest | --ink-2 | 11.09 | 11.09 | 4.5 | pass |
| text | `span` | rest | --ink-2 | 9.11 | 9.11 | 4.5 | pass |
| text | `strong.yd-note-head` | rest | --amber-ink | 6.08 | 6.08 | 4.5 | pass |
| text | `strong` | rest | --ink-2, --ink, --ink (high contrast) | 10.84 | 10.84 | 4.5 | pass |
| text | `summary` | rest | --ink, --ink (high contrast) | 16.64 | 18.74 | 4.5 | pass |

77 groups, 3172 samples; no group is under its need. A disabled control is exempt and is not counted.

## 11. Not verified

Step 1:

- The tape ran in headless Chromium (Playwright 1.63.0) only. No other browser and no real phone.
- Sound is counted as calls of `createOscillator`. No sound was heard.
- The branch of the switch-list refusal for a flag on a correct line cannot be reached with the
  data of today. The tape does not cover it. A reading check found the same condition and the
  same sentence in the new controller.
- The hover state of a control is in no picture. A script compared each style rule of the old
  style string with the new files after the class map and the name map: each of the 58 old rules
  has the same selector and the same declarations.

Step 2:

- Each measurement of step 2 ran in headless Chromium (Playwright 1.63.0) on Linux, on this
  machine only. No other browser, no real phone and no screen reader.
- The faces. On this machine the old stacks and the tokens give the same faces, so no box moved.
  On a Mac or on Windows the token `--font-ui` names faces (for example "Segoe UI Variable") that
  the old stack did not name. A face can then differ, and a box can change size. Not measured.
- The dyslexia faces are not installed here. The picture `yard-dys` shows the fallback face of the
  browser, not "Atkinson Hyperlegible".
- The hover state is in no picture. The probe read the computed look of nine controls on hover, and
  measured their contrast on hover (section 10). The focus state and the pressed state were not
  measured.
- The canvas keeps its own colours until job Y2. The help text says "yellow" and "green" for the
  colours of the canvas. The two words now show in the Dusk amber ink and green ink. Whether a
  learner reads the Dusk amber as "yellow" is the open ruling `YELLOW-WORD`, for the SME.
