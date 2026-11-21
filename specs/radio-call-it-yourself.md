# Spec — Radio: "Call it yourself" mode (one-brain, rec #19)

Status: **approved by the owner 2026-07-28 — built and verified live**. Shipped as **D-0025**.
Author: Game Designer hat, 2026-07-28. Source: `REVAMP-DESIGN.md` §3, §4 rec #19, §5, §6.

*This file records the design of 2026-07-28 (D-0025). Its line numbers and its code describe that
day. Later changes: the button "Drill these aspects →" reads "Open the Signals drill →" (row U-37),
and "Look it up →" opens the entry in a dialog on top of the Radio test (row U-17). What is true now
is in `ARCHITECTURE.md`.*

---

## 1. Problem

Radio is the last station outside the one brain. Fourteen SME-tuned calls collapse into a single
`profile.radio.done` boolean (`radioSim.js:182-183`) that:

- is set by pressing a button fourteen times — it grades attendance, not knowledge;
- can never decay, so it reads "done" forever after one pass;
- never touches `sr.grade`, so the `radio` domain mastery bar moves only from the 20 authored
  Drill questions.

The `radio-script` item type declared at `src/core/types.ts:8` is referenced by nothing — a dead
pointer, which the no-dead-mechanics rule forbids.

## 2. What this is NOT

`REVAMP-DESIGN.md` §5 rules that the walkthrough must stay ungraded — *"merging turns a
confidence-builder into a test."* Rec #19's literal wording ("per-step graded Radio") contradicts
its own document. **Guided mode is not touched.** This spec adds a second mode beside it.

## 3. Design

### 3.1 Mode switch
Two tabs at the top of `/radio`, guided selected by default:

- **Guided** — the current walkthrough, unchanged. Ungraded. The anxiety-friendly entry point.
- **Call it yourself** — same scenario, same SVG readout, but the call is hidden. You pick the
  correct next transmission before the engineer answers.

Visibility mode: `always` (a two-item segmented control in the station's own header zone). It is
not HUD chrome; the bible's ≤3-cluster rule is unaffected.

### 3.2 The test loop
Per step, in `Call it yourself`:

1. Readout + log show the state (identical to guided).
2. If the step has a `pre`, the engineer's incoming call is shown first.
3. Three options: the step's real `call` plus two distractors.
4. On pick → the same `note` / `rule` / `goi` panel guided mode shows, plus the mistake treatment
   from §6 of the revamp (cause → rule → correct action, one-tap **Look it up →** to
   `/reference?focus=<ruleId>`). Then advance.
5. At the end: score, and a **Practice the N you missed →** round matching the Drill's existing
   affordance (D-0023).

### 3.3 Distractors — from the real wording only
Distractors are drawn from **other steps' actual calls**, never invented. This is the pedagogy,
not a shortcut: the genuine confusions in this procedure are *which* call belongs *here* —
carrying the engine number past two car lengths (123.2(ii)), saying "over" on a running count
(120b), switching to feet too early (123.2(vi)).

Gate: the existing quiz-validity check (§7.5) is extended over this bank — no distractor equals,
contains, or is contained by the answer.

### 3.4 Grading — and where F1 stops it
A new `public/data/radio-script.json`: one item per step, each with an explicit `ruleId` into
`rules.json` and a `citation.trust`. All nine cited rules exist and are `verified` (checked:
`rule.121`, `.122`, `.120`, `.123`, `.123.2`, `.115`, `.113.0`, `.113.2`, `.109`).

**Six of the fourteen steps must not be graded**, and this is the point rather than a gap:

| Step | Call | Cited as | Graded? |
|---|---|---|---|
| 1 | positive identification | rule.121 | ✅ |
| 2 | back ten cars to a joint | rule.123.2 · .115 · .123 | ✅ |
| 3 | five cars, five | rule.123.2 · .122 | ✅ |
| 4 | three cars, three | rule.115 | ✅ |
| 5 | two cars, two | rule.123.2 | ✅ |
| 6 | last car, one | *"Last car count"* — no rule | ❌ ungraded |
| 7 | half a car | rule.123.2(vi) | ✅ |
| 8–10 | twenty / ten / five feet | *"Closing"* — no rule | ❌ ungraded |
| 11 | that'll do — stop and stretch | rule.113.0 · .113.2 | ✅ |
| 12 | set and center | **CN GOI**, not CROR | ❌ ungraded |
| 13 | hoses coupled, air cut in | **CN GOI**, not CROR | ❌ ungraded |
| 14 | air to the tail | rule.113.2 · .123 | ✅ |

Steps 12 and 13 carry the sim's own `goi` flag — CN operational practice, explicitly *not* a CROR
rule. Grading them would put unverified content on a graded path, which F1 forbids outright. They
are still played, still answered, still explained; they just don't move the mastery bar. The
station says so plainly rather than silently scoring them.

Eight graded steps → `sr.grade` through a new `recordRadioStep`, mirroring `recordYardWin`
(`AppContext.tsx:92`) exactly: verified-only (F1), due-only on a correct rep (F2, anti-marathon),
misses always count.

### 3.5 Retiring the boolean
`profile.radio.done` is removed; `radio` mastery comes from the SR items like every other domain.
Existing profiles migrate by dropping the field (it was write-only — nothing reads it for
gating; confirm at implementation time before deleting).

### 3.6 Folded in — the Signals link
`/signals` already routes to `<Drill domain="signals" />` (`App.tsx:45`), so the "look-only signal
reader" in rec #19 no longer exists. The only remnant is Reference's aspect card
(`Reference.tsx:75-77`), which shows aspects with no way through. Add a **Drill these aspects →**
link to `/signals`. No new grading surface — the drill already owns that, and D-0021 already gates
signals mastery on a real SVG recall.

## 4. Out of scope
New radio scenarios beyond "Back to a Joint" · voice/speech-recognition input · reordering the
STEPS · any change to the call wording of guided mode (`STEPS`), which is SME-tuned and stays
unchanged (the frozen-file gate, step 1 of `npm run check`, compares it with commit `94a41c5`).

## 5. Definition of done
1. `npm run check` green, with `content-check.mjs` extended over `radio-script.json`:
   every `ruleId` resolves · trust enum legal · **no graded step on a GOI/unverified citation** ·
   answer ∈ options · no distractor collision.
2. Guided mode byte-diff-clean in behaviour — the fourteen calls and notes render identically.
3. A `Call it yourself` run moves `radio` domain mastery above 0 from a fresh profile; a second
   immediate run does **not** move it further (F2 proof).
4. A miss deep-links to the cited rule in Reference.
5. Reduced-motion, read-aloud, contrast and bigger-text all honoured in the new mode.
6. `radio-script` is no longer a dead type; `profile.radio.done` is gone.
7. `CHANGELOG.md` + a `DECISIONS.md` entry (this supersedes rec #19's literal wording — record why).

## 6. Open question for SME
Steps 6 and 8–10 ("last car, one", the feet counts) are real, correct practice with no rule
citation attached in the source. If they map to a CROR paragraph, they become gradable too. Left
uncited rather than guessed — show nothing false.
