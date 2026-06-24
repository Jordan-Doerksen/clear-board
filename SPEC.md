# Clear Board — SPEC (V1)

*Working name. A free, unified CROR conductor-qualification trainer.*
*Design-gate doc — written **before** the repo exists. Last updated 2026-06-23.*

---

## What it is, and who it's for
One browser app that takes someone from *"first day, knows nothing"* to *"ready to sit
the CN conductor qualification"* — by drilling the real job (CROR rules, signals,
switching, securement, radio) under **one profile** that tracks mastery and **one path**
that ramps gently.

**Who:** not rule-lawyers. The person who'd have made a good railroader but **bounced off a
dense rulebook** — anxious, never tested well, learns by doing. Jordan is user zero
(*"i don't want to be scared anymore"*); the mission is everyone like him. This reframes
the product: it is **an on-ramp for people the book failed**, not a comprehensive reference
that happens to quiz. The design follows from that (see Principles).

**Free. Always.** No tier, no gate, no store. A tip jar (Ko-fi / Buy-Me-a-Coffee) for
"if this helped you get there." Safety knowledge is never withheld.

---

## Principles (the mission, as design law)
1. **Plain language is the front door.** Every rule gets a human explanation first; the
   verbatim CROR text is one tap deeper — always present, always cited. Never lead with the
   legalese that lost them.
2. **Confidence through low-stakes reps.** Tiny wins, gentle ramp, never condescend. A wrong
   answer is a UX gap to scaffold, not the learner's failing.
3. **Trust is sacred (safety-critical).** Nothing is taught as fact without a citation + a
   trust flag. **Show nothing rather than something false.** (Hard rule, carried from the trainer.)
4. **Built for the people the book failed.** Accessibility is *core, not polish*:
   dyslexia-friendly type option, audio read-aloud, high contrast, big targets,
   `prefers-reduced-motion` as law, screen-reader clean. If they can't use it, it failed its one job.
5. **One brain, not panels.** One content library, one profile, one path. Every station
   reads and writes the same core.

---

## What "correct" looks like
- A learner can look up **any** rule / signal / definition and get a plain answer + the cited
  source + a trust flag — **offline**.
- Drilling updates a **single** mastery model; the home path reflects real **progress**, not activity.
- **"Test-ready"** appears only when the learner has shown *breadth across domains* **and**
  *retention over time* — and is always labelled *"practice, not the official test."*
- Every signal aspect is rendered by **our own SVG** (never a shipped copyrighted screenshot)
  and matches the verified encoding.
- The switching sim grades by **Moves** (canonical switch-list model); every scenario is
  machine-verified solvable before it ships.

---

## Failure modes that matter (named)
- **F1 — a wrong rule/signal taught as correct.** The cardinal sin. → every item carries
  citation + trust; un-verified items **never** appear in graded drills; CROR-vs-GOI always distinguished.
- **F2 — false "mastered."** Learner thinks they know it; they don't. → mastery needs spaced
  reps over time + a retention check, never one correct answer.
- **F3 — false "test-ready."** Someone walks into the real qualification under-prepared. →
  conservative bar (breadth + retention); explicit *"this isn't the official test"* labelling.
- **F4 — content drift.** Unified app and old apps disagree. → the unified content library is
  THE source; old apps are migrated and **retired**, not run in parallel.
- **F5 — accessibility lockout.** The exact people it's for can't use it. → Principle 4 is
  testable acceptance criteria, not aspiration.
- **F6 — lost progress.** localStorage cleared. → profile export/import; PWA; clear warning.

---

## Hard constraints
- **No build step.** Vanilla HTML / CSS / ES modules. Static host (GitHub Pages) + runs by
  double-click. **PWA, offline-first** (used on the train, the night before).
- **Local-first:** no accounts, no server, no PII. Profile in `localStorage` + export.
- **Never commit/republish the CROR PDF** (gitignored).
- `prefers-reduced-motion` honored everywhere.

---

## Content library — schema (the safety-critical heart)
Single source of truth, **migrated from the four apps' already-verified content** (never
re-derived). One record per item:

```
ContentItem {
  id:       string        // stable unique — "rule.112", "sig.405", "def.controlled-signal"
  domain:   "definitions" | "signals" | "switching" | "securement" | "radio" | "authority" | "protection"
  type:     "rule" | "definition" | "signal" | "scenario" | "radio-script"
  title:    string
  plain:    string        // plain-language explanation (the front door)
  citation: {
    source:     "CROR" | "GOI" | "SME" | "derived"
    ref:        string|null  // primary cite, e.g. "CROR 112(a)"; null only when source != "CROR"
    relatedRef: string|null  // GOI anchored to a rule, e.g. "CROR 109"; else null (B3/D-0015)
    verbatim:   string|null  // exact CROR text — public document, OK to ship (D-0010); null for non-CROR
    trust:      "verified" | "needs-review" | "operating-practice"
  }
  payload:  object|null    // type-specific: signal-aspect spec | switching scenario | radio steps
}
```
**Rule:** an item with `trust:"needs-review"` may appear in **Reference** (clearly flagged)
but **never** in a graded **Drill / Exam**. (mitigates F1)

---

## Profile / mastery — schema
```
Profile {
  schema:    1
  createdAt, updatedAt: ISO8601
  settings:  { reducedMotion:bool, dyslexiaFont:bool, audio:bool, textScale:number }
  items:     { [itemId]: { fam:0..1, seen:int, correct:int, lastSeen:ISO, due:ISO, ease:number, interval:int } }  // interval = SM-2 days, persisted
  domains:   { [domain]: { mastery:0..1, lastDrill:ISO } }
  path:      { stage:string, unlocked:[stationId], testReady:bool }
}
```
- `fam` (familiarity) and `mastery` are `0..1`. Domain `mastery` = retention-weighted aggregate
  of its items' `fam`, decayed by time since `lastSeen`. (mitigates F2)
- `testReady` is **deferred past V1** (D-0013): V1 ships no Exam and makes no "test-ready" claim.
  The threshold + retention bar are set with the SME when the Exam station is built. (mitigates F3)

---

## Retention model (SM-2-lite)
The anti-false-confidence engine (mitigates F2). Each drilled item runs a SuperMemo-2-style schedule:
- **State per item:** `ease` (default 2.5, floor 1.3), `interval` (days), `due`.
- **Correct recall:** 1st → 1d; 2nd → 6d; thereafter → `round(interval × ease)`; ease nudges by
  recall quality (+0.1 easy / −0.15 hard).
- **Miss:** interval resets (re-show same session), `ease −= 0.2` (floor 1.3).
- **`fam` (0..1)** = `min(1, interval / 30)` — not "familiar" until it survives ~a month of spacing.
- **Domain `mastery` (0..1)** = mean `fam` of the domain's *verified* items, decayed by time since
  `lastSeen` (half-life 60d). Decay is why mastery falls if you stop — it reflects retention, not activity.
- A future **retention check** (for the deferred test-ready) = a mixed sample of items past their
  first interval, answered ≥ a bar set by the SME. **Not in V1.**

---

## Content migration mapping (per source → ContentItem)
The rebuild is shell + core + **migration**, not a re-author (D-0007). Field-by-field (B6):
- **training-assistant** defs/reference → `type:"definition"`/`"rule"`; `plain` from its explanations;
  `verbatim` from `DEFS`; `trust` per its existing flag.
- **CROR Quiz `BANK`** (MC + tier + cite) → drill questions on the cited `ContentItem`; tier survives as drill metadata.
- **Signal Reading / cror-signals `ASPECTS`+`VARIANTS`** → `type:"signal"`; **one item per *indication***
  (136 variants collapse to ~100 distinct — deliberate), variants in `payload.aspects[]`;
  `ASPECTS_DRAFT`/unencoded → `trust:"needs-review"` (D-0009).
- **switch-list `PUZZLES`** → `type:"scenario"`; `payload` keeps `par`/`parsol`/geometry/`KICKABLE` intact (nothing solver-verified dropped).
- **Radio Steps** → `type:"radio-script"`; ordered steps in `payload.steps[]`, exact wording preserved.

**Signal payload** (needed in V1 to render signals), reusing the verified encoding:
```
payload.aspects[] = [{
  heads:   string         // top→bottom lamp codes G/R/Y/L/D; 'f' suffix = flashing (e.g. "Yf" over "R")
  mount:   "mast" | "dwarf"
  plate:   "DV" | "R" | "L" | null
  stagger: bool
}]
```
Our own SVG renders these; copyrighted screenshots are never shipped.

---

## Verification (no build, no CI)
- **Switching scenarios:** solver/validator **committed** as `tools/verify-scenarios`, run manually
  pre-ship; every scenario must report solvable at par. (B9)
- **Signal encodings:** stubbed-DOM harness asserts lamp count + flash-vs-steady per head vs the renderer.
- **Pre-ship checklist** (committed): run both harnesses; run the accessibility pass; confirm no
  `needs-review` item leaked into a graded drill.

---

## Accessibility — acceptance criteria (testable, mitigates F5)
- **Contrast** ≥ WCAG 2.1 **AA** (4.5:1 body, 3:1 large/UI).
- **Targets** ≥ 44×44 px. **Keyboard:** all interactions reachable + visible focus.
  **Screen-reader:** labelled controls, live regions for drill feedback.
- **Dyslexia option:** toggle to a dyslexia-friendly face + wider spacing.
- **Read-aloud:** Web Speech API; **degrades gracefully with no offline voice** (N13) — never blocks use.
- **`prefers-reduced-motion`:** all motion skipped/static.
- **Offline budget:** V1 cache target **< 5 MB** (N10).

---

## Stations (V1 = the first two)
Reference · Drill · The Yard · Signal Reader · Radio · Exam — all read/write the one core.

**V1 builds:** the shell + content library + profile + **Reference** + **Drill** (rules *and*
signals), so mastery from drills lights up the path. This is the smallest slice that proves
the spine — *one brain across two content types, not panels*. The remaining stations
(The Yard from the switch-list engine, Signal Reader, Radio, Exam) each plug into the same
core, one at a time. V1 populates the **definitions**, **rules**, and **signals** domains; the
others are schema-reserved but empty until their station lands. (N15)

---

## Open questions — status
**Resolved at the gate (2026-06-23):** verifier = Jordan (D-0008) · honest trust migration (D-0009) ·
CROR verbatim OK / public document (D-0010) · fresh start + redirect at parity + one portfolio entry
(D-0011) · test-ready deferred past V1 (D-0013).

**Still open — pre-public-launch, NOT build blockers:**
1. **Name** — "Clear Board" is the working name; confirm before public launch.
2. **Tip-jar handle** — real Ko-fi / Buy-Me-a-Coffee URL.
3. **V1 drill seed** — which rule/signal sets a new trainee starts on (content-ordering, tune during build).

---
*V1. This is a design-gate doc: no repo is created until the gap review comes back with nothing
that would change behavior.*
