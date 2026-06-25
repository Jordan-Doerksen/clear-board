<!-- Generated 2026-06-25 by the clear-board-revamp-swarm multi-agent design pass. -->
<!-- 7 specialists (Rules, Gameplay, Training, Error-checking, Fun, Redundancy, QA) + aggregator. -->
<!-- CROR rule specifics flagged [verify vs CROR/SME] — never treat a number here as confirmed. -->

# Clear Board — Revamp Design (multi-agent synthesis)

## 1. Executive summary

The throughline: **Clear Board is already "one brain" for content but only "panels" for practice** — Drill is the only station that writes to the mastery model, while The Yard, Radio, and the Signal Reader teach real skills and throw the result away. The revamp is mostly *wiring what exists together*, not building new systems. Top 3 moves: **(1)** make The Yard, Radio, and Signal Reader write to the one SM-2-lite mastery model (close the "switching = 0% forever" hole); **(2)** ship the missing `tools/solve.mjs` + `tools/content-check.mjs` gates and block the Pages deploy on them (today every par is an unverified claim and the F1 trust firewall is runtime-only); **(3)** make every error — a refused Yard move or a missed Drill — a cause→rule-category→correct-action teaching moment that feeds a severity-weighted remediation queue.

---

## 2. Consolidated rule → mechanic map

| Rule category | Learning objective | Taught primarily by | Status today | [verify?] |
|---|---|---|---|---|
| Switch lining / route | Target switch reverse, intermediates normal; don't divert | Sim (Yard) + Drill | Enforced (sim) / partial (no mastery write) | [verify vs CROR/SME] |
| Securement (unattended cut) | A standing 2+ car cut must be tied down | Sim + Drill + Reference | Enforced as a *passive boolean*; no player ACTION | [verify unattended trigger vs CROR/SME] |
| Kicking restrictions | Kickable track + secured 2+ backstop + type ban + ≤5/≤3 + no load-onto-empty | Sim (Yard) | Enforced | [verify limits vs CROR/SME] |
| Lead foul / track capacity | A cut too long won't clear; a full track has no room | Sim (Yard) | Enforced | [verify vs CROR/SME] |
| Shoving / point protection | Shove only with route lined AND the point protected | Reference + Drill | Partial — route gated, point protection absent | [verify vs CROR/SME] |
| Yard speed / range of vision | Stop within half the range of vision | Reference + Drill | Content-only (modeled as a constant, never tested) | [verify vs CROR/SME] |
| Switch-list verification | Verify cars by their markings; the printed list can be wrong | Sim (p2-list) + Reference | Partial — a puzzle type, not a graded micro-mechanic | [verify S.I. vs CROR/SME] |
| Signal indications (recognition) | Read the lamp aspect on sight | Signal Reader + Drill | Partial — reader is look-only, writes nothing | [verify aspect encodings vs CROR/SME] |
| Signal action / consequence | What you must DO on a given indication | Drill | Partial | [verify vs CROR/SME] |
| Hand / lantern signals | Arm-signal recognition (distinct from radio voice) | Drill | Mis-filed under `radio` domain | [verify domain vs CROR/SME] |
| Radio voice procedure | Exact-wording calls, ordered steps | Radio walkthrough + Drill | Partial — walkthrough sets one boolean | [verify wording vs CROR/SME] |
| Manifest / blocking order | Build/depart in exact outbound order | Sim (p6-road) + Drill | Enforced (sim) / partial | [verify vs CROR/SME] |
| Movement authority | (reserved) | Reference | Missing — `authority` domain empty | [verify vs CROR/SME] |
| Track protection / blue-flag | (reserved) | Reference | Missing — `protection` domain empty | [verify vs CROR/SME] |

---

## 3. Final training pipeline (novice → qualification-ready)

**Spine:** every graded action → `recordAnswer(item, correct)` → `sr.grade` → `profile.items[id]` → `recomputeMastery` → domain mastery (decayed, 60d half-life) → path. Today only Drill calls it. **Fix that first.**

**The ramp (soft gates — recommend the next step, never lock learning content):**

1. **Seed (new profile).** First Drill session is hand-seeded: ~8–10 tier-1 definitions + a few easy verified signals. Guaranteed early wins for an anxious learner. No cold cross-domain random draw.
2. **Recognition → recall.** Drill is tier-aware: tier-mix scales with domain mastery (low mastery → mostly tier-1; high → tier-2/3), still due-first within tier. Signals can't read "mastered" until ≥1 correct **SVG-aspect** recall (kills the text-only false-mastery path).
3. **Application (The Yard).** Each puzzle is tagged with the rule categories it exercises (route-lining, securement, kicking, lead-foul, order, verify-marks). A clean win at/under par nudges those **micro-skill** items up modestly (never to 1.0); over-par or refusal-heavy wins grade softer. The Yard now feeds the same switching/securement mastery Drill does.
4. **Breadth + retention gate (soft).** Harder tiers are *recommended* once a domain's verified items clear a fam floor; a "Mixed review" session samples only items with `interval ≥ 1` (survived spacing). Nothing is hard-locked.
5. **Deferred Exam / test-ready bar.** `path.testReady` stays **hard-pinned false**. It may only flip when an SME-set breadth threshold AND a retention threshold (mastery held across ≥1 spacing interval) are met, the exam pool has zero needs-review items, and sign-off is recorded in DECISIONS. The "Mixed review" session is the probe this bar will later use — built now, claimed never (in V1).

**Writes to the one model:** Drill (rule/signal/text MC) · The Yard (per-rule-category synthetic grade on win/refusal) · Signal Reader (a light "name this aspect" graded mode) · Radio (per ordered-step, replacing the single `radio.done` boolean so radio mastery decays like everything else).

---

## 4. Prioritized recommendations (ranked)

| # | What | Why | Touches | Size | When |
|---|---|---|---|---|---|
| 1 | Ship `tools/solve.mjs` — assert every puzzle solvable, `solve().par === puzzle.par`, optimal line replays to a win | The doc claims this gate exists; it doesn't. Every par is currently unverified | Yard / solver | S | **V1-now** |
| 2 | Ship `tools/content-check.mjs` — no needs-review reachable from graded path; answer ∈ choices; ruleId resolves; no dup ids; trust enum-checked | Turns the F1 cardinal firewall from a runtime hope into a build-time gate | Drill / Reference | S | **V1-now** |
| 3 | Add `npm run check` (solve + content-check + `tsc --noEmit` + oxlint) and block the Pages deploy on red | The only CI is deploy-only; a broken par or leaked item ships silently | CI | S | **V1-now** |
| 4 | Wire The Yard into mastery: on win, emit per-rule-category `sr.grade` for the puzzle's tagged categories | Closes the "switching = 0% forever" hole; the single biggest one-brain fix | Yard / sr.ts | M | **V1-now** |
| 5 | Tag each puzzle with the rule categories it exercises (extend existing `rules[]`) | The join key for #4 and for visible sim↔quiz complementarity | Yard | S | **V1-now** |
| 6 | Standardize one `MistakeEvent {itemId, domain, ruleCategory, severity, correctAction, citationRef, trust}` emitted by every station | One feedback contract → one brain; Yard's `{ok,msg}` is the template | all | M | **V1-now** |
| 7 | Make every Yard refusal name the *specific* failing condition + offending switch, and deep-link the matching Reference item | "route not lined" teaches nothing; naming the divert track stops random toggling | Yard | S | **V1-now** |
| 8 | Tier-aware Drill selection (use the `tier` already in rule-questions.json) + first-session seed | The promised gentle ramp is specified but unimplemented; novices draw tier-3 cold today | Drill | M | **V1-now** |
| 9 | Require ≥1 SVG-aspect recall before `signals` reads mastered; link 1:1 signal questions to their aspect by `signalId` | Kills text-only false-mastery on a safety-critical skill | Drill / signals | M | **V1-now** |
| 10 | Severity-weighted remediation: S3 miss re-shows same session + jumps the due queue until one clean recall (with a frustration cap) | Over-practices the cardinal safety rules; builds on SM-2-lite, no new engine | sr.ts / Drill / Yard | M | **V1-now** |
| 11 | Reconcile SR drift (code `+0.05`/ceiling 2.8 vs spec `+0.1`) and pin with a golden-vector test | The anti-false-confidence engine must mean what the docs say | sr.ts | S | **V1-now** |
| 12 | Re-file `rule.12` (hand signals) out of the `radio` domain | Mixing arm signals with voice procedure is a real operating-confusion trap | data | S | **V1-now** |
| 13 | Cap per-`ruleId` picks per session (rule.112 owns 17/20 securement Qs) | Stops one rule monopolizing a domain session | Drill | S | **V1-now** |
| 14 | Per-puzzle best record `{bestMoves, bestJoints, beatPar, departed}` (migrate the old `string[]`) | Enables "beat your best" replay value; today only the id is stored | Yard | S | later |
| 15 | Group the flat puzzle picker by tier with a "recommended next" marker (soft, no lock) | Calm wayfinding; kills choice-overwhelm | Yard | S | later |
| 16 | Fill ramp gaps: tiers 2/4/5/6 have 1–2 puzzles each; add a scaffold rung before par-19 `p1-sort`; resolve empty tier-3 and the 19-vs-22 count | The par-5 → par-19 cliff reads as personal failure | Yard / docs | M | later |
| 17 | Replace `bestJoints()=ceil(par/2)` with a solver-emitted `optJoints` | The "clean" badge is currently a guess — show nothing false | Yard / solver | S | later |
| 18 | Make securement a player ACTION (SECURE move) + add a point-protection acknowledgment on shove | Turns two passive checks into trained decisions (engine edit → re-prove all pars) | Yard | L | later |
| 19 | Light graded "name this aspect" mode in Signal Reader; per-step graded Radio | Removes two dead-end panels from the one-brain model | Signal / Radio | M | later |
| 20 | Prevent empty reserved domains (`authority`, `protection`) reading as 0% on Home; label "not in this version" | A false "you're behind" signal feeds F3 | Home | S | later |

---

## 5. Mechanics removed or merged (the redundancy verdict)

| Item | Source | Action | Rationale |
|---|---|---|---|
| Signals taught two ways (SVG aspect item + signals rule-question) | cror-signals + CN Conductor Trainer | **differentiate** | SVG = recognition, text = action/consequence — two real objectives, but de-double-count via `signalId` so signals can't max on text alone |
| `sig.437`/`sig.439` as both SVG item AND rule-question | cror-signals + CNCT | **differentiate** | Keep only if SVG tests recognition and text tests the required action; link them |
| Switching: Yard sim vs 37 switching Drill questions | switch-list + CNCT | **keep** (differentiate roles) | Do-it vs know-it are complementary; converge both onto the *same* switching micro-skill items |
| Radio walkthrough vs 20 radio Drill questions | training-assistant/switch-list + CNCT | **differentiate** | Walkthrough = wording fluency (ungraded, anxiety-friendly); quiz = graded knowledge. Do NOT merge — merging turns a confidence-builder into a test |
| Yard rule numbers: hardcoded strings in `model.js` AND `citation.ref` in rules.json | switch-list | **merge** (single-source) | Engine should reference the content library's citation, not carry literal copies that can drift |
| Definitions glossary (63 items) | training-assistant + CNCT | **merge** | Two concatenated glossaries risk the same term defined two ways — one canonical definition per term |
| Duplicate quiz stems on the same `ruleId` from two banks | CNCT + cror-signals | **gate** | Build-time de-dup/conflict check per ruleId so two apps can't teach one rule two ways |
| `rule.12` hand signals filed under `radio` | CNCT | **differentiate** | Re-file to signals/switching; radio drills stay pure voice procedure |
| `rule.112` 17 securement questions | CNCT | **keep** (re-weight) | Genuinely distinct facets, not dupes — fix by capping per-ruleId per session, not removing |
| Watch-optimal (▶) vs a future "hint after N refusals" | switch-list | **keep** (one affordance) | Route the hint trigger to Watch-optimal; don't build a second answer-reveal |
| needs-review / operating-practice items | all four | **gate** | Reference only (flagged); build-time assertion bars them from any graded path |

---

## 6. Error-feedback system

**One `MistakeEvent` from every station**, always in this order: **(1) stop the unsafe action** (Yard refuses the move as a pure no-op; Drill marks wrong) → **(2) explain** cause → rule category → correct action, with a one-tap link into Reference (plain language first, verbatim deeper) → **(3) feed the brain** (a miss decays `fam`; high-severity safety misses also enter the remediation queue).

**Severity ladder (drives tone + remediation weight):**
- **S3 safety-critical** — securement skipped, route fouled/mis-lined, kick a tank/autorack, kick load-onto-empty, depart with an unsecured cut. Strongest correction; must clear a clean recall before the domain bar can rise.
- **S2 rule violation** — over kick-limit, lead foul, spot a too-full track, wrong switch lined. Normal reset.
- **S1 inefficiency** — legal but wasteful (spot where a kick was allowed, extra pulls). **Coached, never punished**; measured against the solver-proven par only.

**Two visual channels:** red = unsafe/blocking, amber = inefficient/advisory — meaning carried by **plain words + icon, never colour alone** (accessibility). An S1 "you used 7, par is 5" must never read like a safety failure to an anxious learner.

**Remediation loop:** S3 miss re-shows same session AND jumps ahead of SM-2 due dates until one clean recall (capped to avoid a frustration loop). S2 follows the normal interval reset. S1 is advisory, never re-queued. A repeated *same* wrong answer triggers a targeted confusion-pair drill (e.g. CLEAR vs CLEAR-TO-LIMITED). **Voice:** Jordan's calm, non-shaming register — no "WRONG", no exclamation, cause-then-fix. This is for people the rulebook already failed.

**Hard rule:** if a correction would need a rule number/text not in the verified set, show the rule **category + plain action only** with an internal `[verify vs CROR/SME]` flag. Show nothing false.

---

## 7. Final gated validation checklist

1. **Solver gate** — `node tools/solve.mjs` exits 0: every puzzle solvable, `solve().par === puzzle.par`, `replay(solve().opt)` wins at that move count. *Fail on any mismatch.*
2. **Content gate** — `node tools/content-check.mjs` exits 0: zero needs-review reachable by `gradable`/`drillable`; every drillable rule has ≥1 question; every `ruleId` resolves; every `answer ∈ choices`; no duplicate ids; `trust` is one of the three legal values.
3. **Rule-mapping** — every Yard refusal and every graded question maps to a real rule category; no player-facing CROR number ships without SME sign-off; orphan citations = fail.
4. **Drill-effectiveness** — first session is mostly tier-1; a high-mastery profile draws tier-2/3 (assert the tier histogram); first session returns ≥4 winnable items.
5. **Quiz-validity** — distractor-collision check passes: no distractor equals/contains/is-contained-by the answer; signal aspect→title mapping is one-to-one.
6. **One-brain** — completing a Yard puzzle increments a switching/securement `SRState` and moves domain mastery above 0; Radio writes per-step, not one boolean.
7. **Mastery/SR** — golden-vector test reproduces the documented interval/ease/fam/decay exactly; a one-day marathon cannot push fam past the first-interval ceiling.
8. **Redundancy** — content-lint fails if one CROR ref is represented by two content types without an explicit `distinctObjective` flag; signals can't read mastered without ≥1 SVG-aspect recall.
9. **Safety/error** — every refused Yard move is a state no-op that names its specific failing condition; no graded path can surface a needs-review item (negative test of the gate).
10. **Accessibility** — all targets ≥44px; `prefers-reduced-motion` makes Yard animation instant; feedback announced via `aria-live` (polite S1 / assertive S3), not colour-only; read-aloud fires per prompt and degrades silently offline; canvas switch-lining is keyboard-reachable with a text/ARIA mirror of yard state.
11. **Playtest** — one tester per release: each tier-representative puzzle is winnable to par via in-game hints, has no unrecoverable softlock, and a slow learner reaches end-of-tier-1 with no fail state, lock, or discouraging number.
12. **Test-ready guard** — `path.testReady` is false in a fresh profile and cannot flip true without SME sign-off + breadth/retention thresholds; the UI nowhere claims "qualification-ready."
13. **Revision loop** — on a harness failure the fix order is **data → par → engine**; never edit the solver to agree with a wrong par; any `model.js` cost change re-runs all puzzle pars.

---

## 8. Sample taxonomies

**Lesson taxonomy (by trust + delivery)**
- `verified` rule → Reference (plain + verbatim) + Drill question + (if procedural) Yard enforcement
- `verified` signal → Signal Reader aspect + Drill recall (recognition + action)
- `verified` definition → Reference + bidirectional term↔plain Drill
- `operating-practice` / `needs-review` → Reference only, flagged, **never graded**

**Scenario taxonomy (The Yard, by micro-skill)**
- Gather / make-up (tier 0) → route-lining
- Dig-out / build-in-order / clear-the-build / messy-yard (tier 1) → route + capacity + order
- Trust-the-marks / kick demos / peel-a-type (tier 2) → verify-marks S.I. + kicking
- *(tier 3 — combined-skill scaffold, currently empty: fill or document)*
- Loads-and-empties kicks (tier 4) → kicking limits (≤5/≤3, no load-onto-empty)
- Long-cars-short-lead (tier 5) → lead foul
- Build-the-outbound + depart (tier 6) → manifest order + DEPART

**Quiz-bank structure**
- Keyed by `ruleId`; one canonical question per micro-skill (dupes merged at content-merge)
- Each item: `{ ruleId, domain, tier, choices, answer, explain, trust:'verified', severity, signalId? }`
- Distractors = genuinely confusable rules/aspects (no joke options, no paraphrase-of-answer)
- Per-session cap per `ruleId`; tier-mix weighted by domain mastery

**Novice → qualified progression**
`Seed (tier-1 wins)` → `Recognition (signals + definitions)` → `Recall under spacing (Drill)` → `Application (The Yard, micro-skill-tagged)` → `Breadth + retention (soft gate, Mixed review)` → `[DEFERRED] Exam / test-ready (SME bar, zero needs-review, sign-off in DECISIONS)`

---

## 9. Open questions for Jordan / the SME

1. **Every player-facing CROR number** hardcoded in `model.js` and the rule chips (104 / 112 / 113.4 / 113.5 / 114 / 115) — confirm each against the current CROR before ship. A wrong number taught procedurally is the cardinal sin. *[verify vs CROR/SME]*
2. **Securement "unattended" trigger** — what exactly un-secures a cut, and should leaving a 2+ cut at DEPART be a hard S3 block? *[verify vs CROR/SME]*
3. **Kicking limits** — is the yard S.I. ceiling exactly ≤5 total / ≤3 loaded, and are tank/autorack/centerbeam the full no-kick list? *[verify vs CROR/SME]*
4. **Hand signals (`rule.12`)** — correct home domain (signals vs switching), separate from radio voice procedure? *[verify vs CROR/SME]*
5. **Yard speed / range-of-vision (105)** — Reference + Drill only in V1, or worth a sim check? (Recommendation: Reference + Drill, no shaky sim mechanic in the safety path.)
6. **Test-ready bar** — set the breadth threshold (fam floor per live domain) and the retention threshold (mastery held across ≥1 spacing interval) before any Exam ships. Until then `testReady` stays false.
7. **Puzzle count** — author the 3 missing puzzles to reach the briefed ~22 (and fill empty tier-3), or correct the docs to 19?
8. **Yard win → mastery weighting** — is a clean at-par solve "correct" for SR, and how modest is the fam nudge so sim completion alone never certifies a rule? (Recommendation: soft-correct, capped well below 1.0, decay still applies.)
