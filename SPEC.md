# Clear Board — SPEC

*Working name. A free, unified CROR conductor-qualification trainer.*
*Written on 2026-06-23 as the design-gate document, before the repository existed. Made true to
the code after Wave 2c on 2026-11-21 (version 2.0.0). A section that is a plan says so.
`ARCHITECTURE.md` is the map of the code. `DECISIONS.md` holds the decisions.*

---

## What it is, and who it's for
One browser app that takes someone from *"first day, knows nothing"* to *"ready to sit
the CN conductor qualification"* — by drilling the real job (CROR rules, signals,
switching, securement, radio) under **one profile** that tracks mastery and **one path**
that ramps gently.

**Who:** not rule-lawyers. The person who would have made a good railroader but **bounced off a
dense rulebook** — anxious, never tested well, learns by doing. This reframes
the product: it is **an on-ramp for people the book failed**, not a comprehensive reference
that happens to quiz. The design follows from that (see Principles).

**Free. Always.** No tier, no gate, no store. A tip jar link on Home, for "if this helped you get
there". The link opens a new tab and sends no page address (row U-42). Safety knowledge is never
withheld.

---

## Principles (the mission, as design law)
1. **Plain language is the front door.** Each entry gives plain words first, then its cited
   source. Where the data holds the rule text, the text is one tap deeper ("Show the rule
   text"). The definition and signal entries hold their text. The 100 rule entries hold no rule
   text, and each of them says so (row U-11; note S-05 for the SME). Never lead with the
   legalese that lost them.
2. **Confidence through low-stakes reps.** Tiny wins, gentle ramp, never condescend. A wrong
   answer is a UX gap to scaffold, not the learner's failing.
3. **Trust is sacred (safety-critical).** Nothing is taught as fact without a citation + a
   trust flag. **Show nothing rather than something false.** (Hard rule, carried from the trainer.)
4. **Built for the people the book failed.** Accessibility is *core, not polish*:
   dyslexia-friendly type option, audio read-aloud, high contrast, big targets,
   `prefers-reduced-motion` as law, screen-reader clean. If they cannot use it, it failed its one job.
   The state of each criterion is in "Accessibility", below.
5. **One brain, not panels.** One content library, one profile, one path. Each station reads
   the same core. Each station that grades writes to the same mastery model: the Drill, a Yard
   win and the Radio test "Call it yourself".

---

## What "correct" looks like
- A learner can look up each rule, signal and definition and get plain words, the cited
  source and a trust mark — **offline**. An entry with no text says so (row U-11).
- Drilling updates a **single** mastery model; the home path reflects real **progress**, not activity.
- The app makes no **"test-ready"** claim (D-0013). Home says "Practice, not the official test."
  (row U-25). A plan, not in the app: a "test-ready" mark needs *breadth across domains* **and**
  *retention over time*, with a bar that the SME sets.
- Each signal aspect is drawn by **our own SVG** function (`src/core/signal.ts`, frozen) from its
  encoding in `public/data/signals.json`. No screenshot ships. Whether each drawing is right for
  its item is the SME's (note S-01).
- The Yard counts **moves** against a par. `tools/solve.mjs` (step 9 of `npm run check`) proves
  each of the 19 jobs: the authored line wins in exactly par moves, and the solver finds no
  shorter line.

---

## Failure modes that matter (named)
- **F1 — a wrong rule/signal taught as correct.** The cardinal sin. → every item carries
  citation + trust; un-verified items **never** appear in graded drills; CROR-vs-GOI always distinguished.
- **F2 — false "mastered."** Learner thinks they know it; they do not. → mastery needs spaced
  reps over time, never one correct answer. Familiarity is the interval divided by 30 days, and a
  right answer counts only when the item is due. The retention check is a plan (see below).
- **F3 — false "test-ready."** Someone walks into the real qualification under-prepared. → the
  app makes no "test-ready" claim (D-0013), and Home says "Practice, not the official test."
- **F4 — content drift.** Unified app and old apps disagree. → the unified content library is
  THE source (`public/data/`, frozen). The four old apps are outside this repository. Their
  retirement (D-0011) is not verified here.
- **F5 — accessibility lockout.** The exact people it's for can't use it. → Principle 4 is
  testable acceptance criteria, not aspiration.
- **F6 — lost progress.** localStorage cleared. → Settings saves the progress to a file on the
  device and loads it again (row U-18). Settings says that a clean-up of the site data in the
  browser deletes the progress. The app works offline (PWA).

---

## Hard constraints
- **A build step.** Vite, React and TypeScript (D-0016 replaced the "no build" rule of D-0005).
  `npm run build` runs `tsc -b`, then `vite build` into `dist/`. One build ships two ways: an
  offline PWA and the Tauri desktop shell. The addresses are relative (`base: './'`), for a
  sub-path of a site and for the desktop shell. GitHub Pages is off for this repository (plan
  fact T13). No session of Wave 2 made the Windows desktop build: not verified.
  **PWA, offline-first** (used on the train, the night before).
- **Local-first:** no account, no server, no analytics, no personal data. The profile is in
  `localStorage`. Settings can save it to a file on the device and load it again.
- **Never commit or republish the CROR PDF.** No PDF is in the repository. `.gitignore` has no
  rule for it (both checked on 2026-11-21).
- **Reduced motion** is a hard constraint. Its state is in "Accessibility", below.

---

## Content library — schema (the safety-critical heart)
Single source of truth, **migrated from the four apps' already-verified content** (never
re-derived). Five JSON files in `public/data/`: four files of content items and one file of
questions. The five files are frozen since commit `94a41c5` (fence rule 1). The types are in
`src/core/types.ts`.

```
ContentItem {
  id:       string        // stable unique — "rule.112", "sig.405", "def.controlled-signal"
  domain:   "definitions" | "signals" | "switching" | "securement" | "radio" | "authority" | "operating"
  type:     "rule" | "definition" | "signal" | "radio-script"
  title:    string
  plain:    string        // plain-language explanation (the front door)
  citation: {
    source:     "CROR" | "GOI" | "SME" | "derived"
    ref:        string|null  // primary cite as the data holds it, e.g. "CROR 112" (rule.112)
    relatedRef: string|null  // GOI anchored to a rule, e.g. "CROR 109"; else null (B3/D-0015)
    verbatim:   string|null  // the rule text — public document, OK to ship (D-0010); null when the data has none
    trust:      "verified" | "needs-review" | "operating-practice"
  }
  payload:  object|null    // a signal: { aspects }; a radio step: { step, ruleId, scenario }; else null
}

Question {                 // public/data/rule-questions.json
  id, ruleId, domain, stem, choices[], answer, explain, tier, trust
}
```
- The types also allow the domain `"protection"` and the type `"scenario"`. No item has either.
  The domain list of the app (`DOMAINS`, `src/core/store.ts`) does not hold `"protection"`.
- Counted on 2026-11-21: 219 items (63 definitions, 42 signals, 100 rules, 14 radio steps) and
  226 questions. 209 items are `verified`, 4 signal items are `needs-review` and 6 radio steps are
  `operating-practice`.

**Rule:** an item with `trust:"needs-review"` may appear in **Reference** (marked "⚠ not yet
verified — reference only") but **never** in a graded drill. The Drill draws verified items
only. `answerCounts` (`src/core/drill.ts`) grades a verified item only. `tools/content-check.mjs`
fails when a question points at an item that is not verified. There is no Exam station.
(mitigates F1)

---

## Profile / mastery — schema
```
Profile {                  // localStorage key cb.profile.v1
  schema:    1
  createdAt, updatedAt: ISO8601
  settings:  { dys:bool, contrast:bool, reduce:bool, audio:bool, big:bool }
  items:     { [itemId]: { fam:0..1, seen:int, correct:int, lastSeen:ISO|null, due:ISO, ease:number, interval:int } }  // interval = SM-2 days, persisted
  domains:   { [domain]: { mastery:0..1, lastDrill:ISO|null } }
  yard:      { completed:[jobId], best?:{ [jobId]: { moves:int, joints:int, beatPar:bool, departed:bool } } }
  path:      { stage:string, unlocked:[stationId], testReady:bool }
}
```
- The settings that the app uses are the learner's choices, stored under a separate key,
  `cb.settings.v1`. "Reduce motion" is also on while the device asks for less motion. "Higher
  contrast" starts from the device. The profile also holds a `settings` field.
- Two more keys: `cb.profile.v1.copy` keeps the stored text before the app writes a repaired or
  a fresh profile over it (row U-05), and `sl_muted` holds the sound choice of the Yard (no value
  or "1" is off, "0" is on). "Reset my progress" removes the profile, the copy and the sound
  choice.
- A stored profile with a field of the wrong shape is repaired on load, and each readable entry
  stays (row U-05). Two open copies of the app merge their answers (row U-34). A load from a
  file gives the profile a new `createdAt` (ruling `LOAD-NEW-PROFILE`).
- `fam` (familiarity) and `mastery` are `0..1`. Domain `mastery` is the mean decayed `fam` of the
  domain's drillable items (see "Retention model"). (mitigates F2)
- `path` is written when the profile is made: the stage "First-day trainee", Reference and Drill
  unlocked, `testReady` false. Only the creation and the repair of a profile write it. Home
  computes the stage name from the mastery.
- `testReady` is **deferred** (D-0013): the app ships no Exam and makes no "test-ready" claim.
  The threshold + retention bar are set with the SME when an Exam station is built. (mitigates F3)

---

## Retention model (SM-2-lite)
The anti-false-confidence engine (mitigates F2), in `src/core/sr.ts`. Each graded item runs a
SuperMemo-2-style schedule:
- **State per item:** `ease` (default 2.5, floor 1.3), `interval` (days), `due`.
- **Correct recall:** 1st → 1d; 2nd → 6d; thereafter → `round(interval × ease)`; `ease += 0.05`,
  capped at **2.8**. (V1 grades on a single correct/incorrect signal — no easy/hard buttons yet — so the
  bump is the conservative `+0.05`; the future easy/hard grading is what would split it into ±. The
  conservative bump is *deliberate*: slower familiarity growth is safer for an anti-false-confidence engine.)
- **Miss:** the interval resets to 0, so the item is due again at once; `ease −= 0.2` (floor 1.3).
  The end of a Drill session offers a round of the items that the learner missed.
- A correct answer only advances the schedule when the item is **due** — re-drilling early cannot
  farm familiarity (anti-marathon, F2 / validation #7). A miss always counts.
- **`fam` (0..1)** = `min(1, interval / 30)` — not "familiar" until it survives ~a month of spacing.
- **Golden vectors** (pinned by `tools/sr-vectors.mjs`, run in `npm run check` — drift fails the gate):
  fresh → `1✓ {int 1, ease 2.55, fam .033}` → `2✓ {6, 2.60, .20}` → `3✓ {16, 2.65, .533}` → `✗ {0, 2.45}`;
  ease ceiling **2.8**, floor **1.3**.
- **Domain `mastery` (0..1)** = the mean `fam` of the domain's *drillable* items (verified; a rule
  item also needs one authored question or more), each decayed by the time since `lastSeen`
  (half-life 60d). Until the learner has one right answer on a signal item, the signals mastery
  stays at 0.33 or less (D-0021). The app computes the mastery again after the content loads,
  after each answer that counts and at each change of route. Decay is why mastery falls if you
  stop — it reflects retention, not activity.
- A plan, not in the app: a **retention check** for a future "test-ready" mark = a mixed sample
  of items past their first interval, answered ≥ a bar set by the SME.

---

## Content migration mapping (per source → ContentItem)
History: this is how the content of the four old apps came into the library: four files in June
2026, and `radio-script.json` on 2026-07-28 (D-0025). The library is now frozen. The rebuild is shell + core + **migration**, not a re-author (D-0007).
Field-by-field (B6):
- **training-assistant** defs/reference → `type:"definition"`/`"rule"`; `plain` from its explanations;
  `verbatim` from `DEFS`; `trust` per its existing flag.
- **CROR Quiz `BANK`** (MC + tier + cite) → drill questions on the cited `ContentItem`; tier survives as drill metadata.
- **Signal Reading / cror-signals `ASPECTS`+`VARIANTS`** → `type:"signal"`; **one item per *indication***,
  variants in `payload.aspects[]`; `ASPECTS_DRAFT`/unencoded → `trust:"needs-review"` (D-0009).
  The data holds 42 signal items with 140 aspect entries. This file said earlier that "136
  variants collapse to ~100 distinct". Which count is right is a question for the SME (R6 note 3).
- **switch-list `PUZZLES`** → not content items. The 19 jobs stay in
  `src/stations/yard/puzzles.js` (frozen), each with its layout, its goal, its par, its authored
  line `opt`, its `optJoints` and its rule chips.
- **Radio Steps** → `public/data/radio-script.json`: 14 items of `type:"radio-script"`, one for
  each call. Each item holds `payload.step` (the index into `STEPS`), `payload.ruleId` and
  `payload.scenario`. The call wording stays only in `STEPS` of `src/stations/radioSim.js`, a
  frozen region.

**Signal payload** (`SignalAspect` in `src/core/types.ts`), the verified encoding as the data holds it:
```
payload.aspects[] = [{
  heads:    string[]      // top→bottom lamp codes G/R/Y/L/D; an 'f' at the end = that lamp flashes
  type:     "mast" | "dwarf"
  plaque?:  "DV" | "R" | "L" | null
  stagger?: bool
  flash?:   bool          // the type allows it; no entry of the data has it
}]
```
Our own SVG renders these; copyrighted screenshots are never shipped.

---

## Verification
`npm run check` (`tools/check.mjs`) runs 12 offline steps. It needs no network, no `dist/` and no
browser. It runs each step after a failure, and exits non-zero when one step failed.
1. `check:frozen`: no frozen file changed since `94a41c5`; the `STEPS` region is checked as text and as values.
2. `check:dusk`: the Dusk copy equals its lock, and no app rule restyles a Dusk class with no app class.
3. `check:colour`: no raw colour in the files that it reads (`src`, `index.html`, `vite.config.ts`,
   `public`), except in the Dusk copy, the bridge file, the frozen files and the two SVG icon
   files (row U-45).
4. `check:names`: no custom property of the app collides with a Dusk name.
5. `lint` (oxlint, with a warning limit) and 6. `typecheck` (`tsc -b`).
7. `test:unit`: 79 unit tests of `sr`, `store`, `severity`, `drill`, `radio` and the signal drawing.
8. `tools/sr-vectors.mjs`: the golden vectors of the schedule.
9. **Switching jobs:** `tools/solve.mjs` drives the in-app solver (`src/stations/yard/solver.js`).
   For each job the authored line wins in exactly par moves, the solver finds no shorter line,
   and the stored `optJoints` is the count of the authored line. (B9; D-0017, D-0027)
10. **Content / trust (F1):** `tools/content-check.mjs`, checks A to I: a legal `trust` value, no
    duplicate item id or question id, each answer is one of its choices, each `ruleId` resolves,
    **no question on an item that is not verified**, the radio items match `STEPS` one to one,
    a graded radio step cites a verified CROR rule, and each call has two usable distractors.
    (D-0017, D-0025)
11. `tools/securement-check.mjs`: 15 assertions that securement is a player action and that no
    authored par changed (D-0029).
12. `tools/shared-drawings.mjs`: a report of each signal drawing that belongs to two signal items
    or more (row U-01). A shared drawing does not fail the step.

- **Signal encodings:** `tests/unit/signal.test.ts` (step 7) checks, for each of the 140 entries
  of `signals.json`, one ring and one lamp for each head code, and a flash only on a lit lamp
  whose code ends in "f". It pins what the frozen function draws today. It does not prove that
  a drawing is right for its item.
- **In a browser:** `npm run test:browser` (`tests/browser/smoke.mjs`) serves `dist/` and runs
  22 gate cases in Chromium. It needs the build and Chromium. The look
  harness (`npm run look:baseline`, `npm run look:compare`) compares pictures and page facts
  with the build of a baseline commit.
- **CI:** `.github/workflows/check.yml` runs `npm ci`, the check, the build and the browser test
  on each pull request and on each push to a branch other than `main`. A look compare runs as a
  report. `.github/workflows/deploy.yml` runs the check and the build on a push to `main`, then
  its GitHub Pages steps.
- **Pre-ship checklist** (this list; no other file holds it): `npm run check` green (the solver,
  the content and trust gates and the F1 check); `npm run build` green; the accessibility pass,
  `npm run test:browser` green (cases 11 to 15: the dyslexia spacing, the motion rules, the 44 px
  targets, the Yard at 320 px and the type modes); the owner's look at each surface.

---

## Accessibility — acceptance criteria (testable, mitigates F5)
- **Contrast** ≥ WCAG 2.1 **AA** (4.5:1 body, 3:1 large/UI). The jobs of Wave 2 measured the text
  pairs in Chromium and reported them. No gate measures contrast.
- **Targets** ≥ 44×44 px. Smoke case 13 fails when an enabled control on a route or in Settings
  is smaller, at 390 and 1440 px wide.
- **Keyboard:** all interactions reachable + visible focus. Each control is a native button,
  link, input, select or summary. The six Yard switches have native buttons (P-02), and the lines of a
  switch list are buttons (row U-09). After a change of route, focus goes to the heading of the
  view (row U-29). No test in this tree plays the whole app by keyboard.
- **Screen-reader:** labelled controls, live regions for drill feedback. The Drill and the Radio
  test put the verdict into a status region, or into an alert for a miss on a safety-critical
  item (row U-19). The Yard has a text mirror (`#yard-mirror`) and a status region (`#yard-live`)
  (P-03). The emoji of a control is hidden from a screen reader (row U-41). Two signs stay in the
  name of a control: ▶ in "▶ Watch optimal" (the Yard) and in "Key the radio ▶" (the guided Radio),
  and ⚠ in the trust mark of the four Reference rows of the `needs-review` items. No screen reader
  was run: what a screen reader says is not verified.
- **Dyslexia option:** toggle to a dyslexia-friendly face + wider spacing. The face is Atkinson
  Hyperlegible, two font files that ship with the app with their licence text (row U-30).
- **Read-aloud:** Web Speech API; **degrades gracefully with no offline voice** (N13) — never blocks
  use. Settings says "No voice on this device." when the browser has no voice. The speech stops
  on a change of route (row U-31).
- **Reduced motion:** on when the learner turns it on, or while the device asks for less motion
  (read live, row U-13). It stops the transitions of the app, and each Yard effect (a move, a
  kick, the arrival, the departure, a watched step) ends at once with its end state and its
  words (P-01). **Not stopped:** the flashing lamp of a signal drawing. It is an SVG `animate`
  element of the frozen `src/core/signal.ts`. Whether the flash stops, and which word stands for
  it, waits for the SME (ruling `FLASH`).
- **Offline budget:** the offline cache is at most 5 MB (5,242,880 bytes). Smoke case 19 fails over
  it (row U-43). The build of 2026-11-21 caches 17 files, 805,685 bytes (15.4 %).

---

## Stations
Home · Reference · Drill · Signals · The Yard · Radio walkthrough — each reads the one core.
Settings is a dialog. There is no Exam station: D-0013 defers it, and Clear Board 2 does not
build it.
- **Home** (`/`): the stage and the overall mastery, one main control ("Start here", or
  "Continue" with the count of items due now), a tile for each live domain, the stations and
  the tip jar link.
- **Reference** (`/reference`): a search over each content item, in groups by kind. Each row
  shows its domain and its trust mark in words. A pressed row opens its entry under the row.
- **Drill** (`/drill`, `/drill/<domain>`): a session of at most 10 questions over the live
  domains or one domain. A learn card shows a new item one time before its first question
  (row U-28). "Look it up" opens the entry in a dialog on top of the session (row U-17).
- **Signals** (`/signals`): the Drill on the signals domain. It is not a separate "Signal
  Reader" station.
- **The Yard** (`/yard`): 19 switching jobs in seven tiers, drawn as look C2 (D-0031, D-0032).
  Each switch has a native button (P-02). A played win grades the verified rule items of the
  job that are due.
- **Radio walkthrough** (`/radio`): "Guided", the walkthrough, which grades nothing; and "Call it
  yourself", which grades the 8 verified calls (D-0025).

Seven domains are live: definitions ("The words"), signals, switching, securement, radio,
authority and operating.

---

## Open questions — status
**Resolved at the gate (2026-06-23):** verifier = the SME (D-0008) · honest trust migration (D-0009) ·
CROR verbatim OK / public document (D-0010) · fresh start + redirect at parity + one portfolio entry
(D-0011) · test-ready deferred past V1 (D-0013).

**Resolved later:** the tip jar link is in the app (Home), and row U-42 keeps it (D-0035).

**Still open — pre-public-launch, NOT build blockers:**
1. **Name** — "Clear Board" is the working name; confirm before public launch.
2. **V1 drill seed** — which rule/signal sets a new trainee starts on. Today a fresh profile gets
   tier-1 questions (D-0020) and a learn card before each new item (row U-28). A fixed starter
   list (row U-48) has a no: the owner and the SME pick the items first.

**Open for the SME:** `FLASH`, `YELLOW-WORD`, `MIRROR-WORDS`, `R7-P6`, `R7-P7`, `R7-P13`
(`specs/briefs/lead-rulings.md`, section 4), and the 28 notes of `specs/research/upgrade-list.md`,
section 10.

---
*This file started as the design-gate document of 2026-06-23. It describes the app after Wave 2c
(version 2.0.0).*
