# Clear Board — DECISIONS

*ADR-style. Each real call: what was chosen, what else was weighed, why. Last updated 2026-11-21.*

Page law tier: STRICT

---

### D-0001 — Unify the four rail apps into one product
**Chosen:** absorb CN Conductor Trainer + switch-list + cror-signals + training-assistant into
one app with a shared content library + one profile.
**Weighed:** keep them separate and link; unify the shell only.
**Why:** they overlap heavily (signals ×2, switching ×2, quiz ×2) — duplication is the
overwhelm. One product, one source of truth, one progress.

### D-0002 — Spine = the qualification path
**Chosen:** a trainee → test-ready progression with one mastery profile and a progress-map home.
**Weighed:** one-living-yard sim; study→drill→certify course; pure adaptive-brain.
**Why:** matches the emotional goal (confidence, *"not scared"*), motivates return, and
naturally orders disparate content into a journey rather than a launcher.

### D-0003 — Free, always — tip jar only
**Chosen:** every station free; no paid tier; a Ko-fi / Buy-Me-a-Coffee tip jar.
**Weighed:** free core + paid Pro; a commercial store product.
**Why:** Jordan's call — the mission is helping people the rulebook failed *become railroaders*,
not profit. Also removes the ethics of paywalling safety knowledge, and deletes the entire
free/paid architecture.
**Consequence:** cror-signals stops being a separate paid product (its content folds in free);
its store-launch blockers (PNG icons, assetlinks SHA, the Ko-fi placeholder) are moot.

### D-0004 — Mission as design law (built for people the book failed)
**Chosen:** plain-language-first; accessibility as core (dyslexia font, read-aloud, contrast,
reduced-motion, screen-reader); confidence-first pedagogy.
**Why:** the audience is *defined* by having bounced off dense text. If it reads like the
rulebook, it fails the one person it's for.

### D-0005 — No build, vanilla ES modules, PWA, local-first
**Chosen:** static offline-first PWA; `localStorage` profile + export; no accounts/server.
**Weighed:** a framework + accounts/cloud sync.
**Why:** the cardinal no-build rule; works on the train offline; zero hosting cost for a free
public good; no PII to safeguard.

### D-0006 — Single content library is THE source; old apps retire
**Chosen:** migrate verified content into one cited / trust-flagged library; deprecate the four
apps after parity.
**Weighed:** keep the apps live and sync content between them.
**Why:** parallel copies drift (F4) and re-create the duplication we set out to remove.

### D-0007 — Reuse verified content; never re-derive safety material
**Chosen:** migrate the existing verified content — DEFS (63 terms), ASPECTS / VARIANTS
(~102 signal forms), the rule BANK, the switch-list switching engine, the radio scripts —
with their citations intact.
**Weighed:** re-authoring fresh from the CROR PDF.
**Why:** re-authoring safety content risks introducing errors; the existing content is already
SME/CROR-verified. The rebuild is the *shell + unified core + migration*, not a re-write of
the rules. (mitigates F1)

### D-0008 — Jordan (SME) is the verifier; what "verified" means
**Chosen:** `trust:"verified"` = the item is cited to a specific CROR rule (or explicitly flagged GOI)
and has been cross-checked by Jordan against the **Jan 2025 CROR** by him. Jordan holds the flag;
he re-checks affected items when the CROR is reissued.
**Why:** safety-critical content needs a named, accountable verifier and a concrete bar, not a vibe. (B2)

### D-0009 — Migration carries honest trust state; `needs-review` is reference-only
**Chosen:** content migrates with its *real* current status. Anything not fully verified — the 4
unencoded signal indications (410, 418, 433A, 440), the `ASPECTS_DRAFT` set, the 407 conflict —
migrates as `needs-review`: it may appear in **Reference** (clearly flagged) but **never** in a
graded Drill/Exam until Jordan verifies it.
**Weighed:** copy everything in as verified (fast, wrong).
**Why:** F1. A wrong rule taught as correct is the cardinal sin; honesty over coverage. (B1)

### D-0010 — CROR verbatim text may ship (it is a public document)
**Chosen:** the CROR is a **public regulatory document** (Jordan, SME), so `citation.verbatim`
text may be bundled in the public offline app. The official **PDF** is still never committed
(D-0007 / existing rule). Plain-language stays the front door by *pedagogy* (Principle 1), with
verbatim one tap deeper.
**Weighed:** ship rule-number citations only, paraphrase everything (was the safe fallback).
**Why:** resolves B8; gives learners the authoritative text without the legalese-first wall.

### D-0011 — Fresh start; old apps redirect at parity; one portfolio entry
**Chosen:** existing apps' saved progress does **not** migrate (tiny userbase). Once Clear Board
hits feature parity, the four apps redirect to it; their four Observatory cards collapse into one
**Clear Board** entry.
**Why:** B7/N16/F4 — no parallel copies to drift, no half-migrated profiles, one story on the portfolio.

### D-0012 — Retention model = SM-2-lite (specified, not vibes)
**Chosen:** a concrete SuperMemo-2-style scheduler (intervals, ease, decay) drives Drill and
familiarity — full numbers in SPEC §Retention.
**Why:** B4/F2 — the anti-false-confidence mechanism must be a real, testable algorithm.

### D-0013 — Exam + "test-ready" are deferred past V1
**Chosen:** V1 ships **no Exam station and makes no "test-ready" claim.** The per-domain mastery
threshold + retention bar for `testReady` are set *with Jordan (SME)* when the Exam station is built.
**Why:** B5/F3 — a safety claim ("you're ready") won't ship on a guessed number.

### D-0014 — Solvability verification is a committed harness + pre-ship checklist
**Chosen:** the switching solver/validator is **checked into the repo** as a test harness (run
manually pre-ship since there's no CI), plus a written pre-ship checklist. No "remember to run the
throwaway script."
**Why:** B9 — "machine-verified" needs a real, durable owner in a no-build project.

### D-0015 — Citation schema records GOI *and* its anchoring CROR rule
**Chosen:** `citation` gains `relatedRef` so an item can be `source:"GOI"` *and* point at the
nearest CROR rule (e.g. "set and center" → GOI, relatedRef "CROR 109") without ever showing GOI
as the rule.
**Why:** B3/F1 — the CROR-vs-GOI distinction must be representable, not just promised.

### D-0016 — Adopt Vite + React + TypeScript + Tauri (reverses D-0005's "no build")
**Chosen:** Clear Board moves to a Vite + React + TypeScript front end, shipped as a static
offline PWA for GitHub Pages and (later) a Tauri desktop exe. The React pilot lives in
`../clear-board-react` until it reaches parity, then it replaces this folder (the vanilla build
becomes reference, then retires).
**Weighed:** stay vanilla ES modules (D-0005); Electron instead of Tauri.
**Why:** Jordan is standardizing on React for tools with real UI state, and on a clean-exe stack.
Vite still ships a static, offline-first PWA (the *spirit* of D-0005 — train-side offline, zero
hosting cost), and Tauri adds the ~5 MB clean exe Electron can't. React's default escaping also
removes the hand-rolled `esc()` from every station — a safety win for rendering verbatim CROR text.
**Consequence:** the SPEC §Hard-constraints "No build step" line is superseded for this project;
the offline-PWA + local-first + never-commit-the-PDF constraints still hold. The four verified data
JSON files migrate untouched; the signal renderer stays byte-for-byte (now wrapped in a component).
**Status (2026-06-24):** spine ported + verified live — shell, core (sr/store), Home/path,
Reference, Drill incl. signals. SM-2 grading replay-checked in the browser (miss → ease 2.5→2.3,
interval reset, persisted). **The Yard now ported too** — the 7 SHA-verified engine modules + the
station kept byte-for-byte, wrapped as a React "imperative island" (`Yard.tsx`) that lazy-loads
them, bridges `ctx` (navigate/settings/profile/save), and tears down cleanly on unmount; verified
live (19 puzzles load, canvas paints, engine responds, no leak across remounts, 0 errors). **Radio
ported too** via the same shared `useImperativeStation` hook — drove the full 14-step walkthrough live,
`profile.radio.done` persisted. **FEATURE PARITY REACHED** — all five stations (Home/path · Reference ·
Drill · The Yard · Radio) + settings + profile run on React, 0 console errors. **TAURI EXE BUILT &
VERIFIED RUNNING (2026-06-24)** — `npm run tauri build` produces a self-contained `Clear Board.exe`
(~18 MB, OS WebView2) + a `Clear Board_0.1.0_x64-setup.exe` NSIS installer (~4 MB); launched the exe,
native window "Clear Board" opened, 35 MB resident, no crash. Build needed a complete MinGW-w64 on
PATH (`C:\projects\.toolchains\mingw64\bin`) — rustup's bundled GNU MinGW lacks `as.exe`.
**CONSOLIDATED (2026-06-24)** — the React build IS now `clear-board` (the vanilla folder was deleted;
its tree is preserved in git history before this rebuild commit). Pushed to `main` and the repo's
GitHub Pages switched from legacy root-serve to a GitHub Actions build (`.github/workflows/deploy.yml`);
verified live at https://jordan-doerksen.github.io/clear-board/ serving the React bundle. `map.md` updated.
Remaining: PWA service worker (vite-plugin-pwa already a dep), custom app icon (currently default Tauri
logo), and the Observatory card-collapse (four rail cards → one Clear Board card, tied to retiring the
old rail apps per D-0011).

### D-0017 — Committed verification gates (solver + content/trust), `npm run check`
**Chosen:** two committed Node harnesses. `tools/solve.mjs` drives the existing in-app solver
(`src/stations/yard/solver.js`): for every puzzle it replays the authored optimal line and asserts it
wins in exactly `par`, and asserts `solve()`'s own optimum agrees. `tools/content-check.mjs` enforces
the F1 firewall + integrity: legal `trust` enum, no duplicate ids, every question's answer ∈ its
choices, every `ruleId` resolves, and **no graded question hangs off a non-verified item**. `npm run
check` runs both; either failing exits non-zero.
**Weighed:** the prior state — an uncommitted throwaway solver script (the harness `puzzles.js` *names*
was never carried into the React build, so every `par` was an unverified claim and the trust firewall
was runtime-only); a full hosted CI service (overkill for a no-build static app).
**Why:** SPEC §Verification *promised* a committed solver + a pre-ship checklist enforcing F1, but
nothing enforced them. Now it's a one-command gate. First run: **19/19 puzzles pass** (pars achievable
AND optimal); **all six content checks pass** (226 questions; the 4 `needs-review` items are correctly
untouched by any graded question). Honesty rule baked in: a failing par is *reported*, never patched by
editing the solver or data to agree (fix order is data → par → engine).

### D-0018 — The Yard feeds the ONE mastery model (close "switching = 0% forever")
**Chosen:** a genuine Yard win grades the CROR rule items the puzzle exercises into the SAME SM-2
mastery model the Drill writes. The map (engine rule-chips → real `rule.*` ContentItem ids) lives in
the editable wrapper `yardSim.js` (`RULE_ITEMS`); `AppContext.recordYardWin(ids)` grades them and
recomputes domain mastery. Two safety guards: only **verified** items are graded (F1), and only items
currently **due** (so replaying an easy puzzle can't farm familiarity — F2). Watched-optimal demos do
not grade. The byte-for-byte engine and `puzzles.js` are untouched — the puzzles already carry a
curated `rules:[...]` list, which is the join key.
**Weighed:** the prior state — a win only appended to `profile.yard.completed`, invisible to the path;
a separate bespoke "yard mastery" number (would re-fragment the one brain); grading a sloppy/over-par
win identically to a clean one.
**Why:** Drill was the only station writing mastery, so The Yard / Signal Reader / Radio taught real
skills and discarded the result — switching & securement read 0% no matter how well the yard was
worked. This is the single biggest "one brain, not panels" fix (REVAMP-DESIGN §1). Verified live: a
`p2-kick` win moves Switching 0 → 0.017 and Securement 0 → 0.011. The nudge is deliberately modest
(one rep → `fam` ≈ 0.03, averaged over the domain) and still decays, so sim completion alone can never
certify a rule.
**Open (Jordan / SME):** should an over-par or refusal-heavy win grade *softer* than a clean one, and
what exact `fam` weight? SM-2-lite is boolean today; this needs a quality signal. Tracked as tuning,
not a blocker.

### D-0019 — Pages deploy is gated on `npm run check`
**Chosen:** the GitHub Actions deploy workflow runs `npm run check` (the solver + content/trust gates,
D-0017) between `npm ci` and `npm run build`; a red gate fails the `build` job, so `deploy` (which
`needs: build`) never publishes.
**Weighed:** trust the pre-ship checklist by hand; a separate scheduled check.
**Why:** a gate only protects the user if it actually blocks a bad ship. A broken par or a leaked
`needs-review` item now stops the deploy instead of reaching the public site.

### D-0020 — The practice loop teaches from errors and ramps gently
**Chosen:** two REVAMP §4/§6 learning-loop wins. (1) **Errors teach:** every Drill miss and every Yard
refusal shows a one-tap "Look it up →" to the cited rule's plain-language Reference entry
(`/reference?focus=<itemId>`; Reference reads `?focus` and opens that item). The Yard maps its refusal
text's "CROR n" cite → the matching `rule.n` item. (2) **Tier-aware Drill seeding:** a fresh profile
(nothing seen) is clamped to tier-1 questions so the first session is winnable, never tier-3 cold; the
ceiling widens (2, then 3) as the candidate domains' mastery grows, using the `tier` already on every
question in `rule-questions.json`.
**Weighed:** a full severity ladder + a dedicated remediation queue (REVAMP §6) now; a separate
"easy mode" toggle.
**Why:** Drill explained answers but never linked the *rule*, and the Yard's cited refusals were a
dead end — the plain-language rule is the whole mission and should be one tap from the mistake. Novices
were drawing tier-3 questions cold (the gentle ramp was specified but unimplemented). The heavier
severity-weighted remediation queue is deferred — these are the high-leverage, low-risk slices.
**Verified live:** Reference `?focus=rule.104` opens Rule 104; a Yard PULL-without-lining refusal shows
the CROR 104 cite + a working "Look it up →" that lands on Rule 104; a fresh profile drills 10 tier-1
questions, a high-mastery profile reaches tier 3.

### D-0021 — Signals aspect-recall gate + thin-domain drill fill; rule.12 flagged not moved
**Chosen:** three REVAMP §4/§9 items. (1) **Signal aspect-recall gate:** the `signals` domain mastery
is capped (≤0.33) until the learner has correctly read at least one actual SVG aspect — knowing the
signal *rules* on paper must never read as "can read a signal on sight." The aggregate already weights
the 38 drillable aspect items, so this is an explicit, future-proof backstop more than a live hole.
(2) **Thin-domain drill fill:** a domain with too few items (securement has only 3) couldn't reach the
4-question floor, so its dedicated drill showed "Not enough verified content." The Drill now pads a thin
session with DISTINCT authored facets of its rules — capped at 3 per rule so no one rule (rule.112 has
17) dominates — and a same-session repeat only records a MISS, never a correct re-advance (no
familiarity farming). (3) **rule.12 NOT moved** — flagged for SME (below).
**Weighed:** capping rule.112 per session (moot — Drill already drew one question per item per session);
lowering the 4-question floor (would allow trivially short sessions); moving rule.12's domain (would
relocate a mislabeled item without fixing it).
**Why:** signals is the one read-on-sight skill and deserves an explicit invariant; securement's drill
was effectively dead; and rule.112's 17 facets were under-used (one seen per session). The heavier
severity-ladder/remediation-queue (REVAMP §6) stays deferred.
**rule.12 — open for SME (Q #4):** the swarm flagged "hand signals (rule.12) mis-filed under radio."
But the data item titled "Rule 12" / cited "CROR 12" (which *is* hand signals in the CROR) carries the
plain text *"Doubt = STOP… on the radio (123.2(v))"* — the 123.2 doubt principle, **not** hand signals.
So it is mislabeled or mis-authored, not merely mis-filed; the correct fix (retitle/recite, or rewrite
the plain text) is a CROR-accuracy call left to Jordan/SME — never guessed.
**Verified live:** signals capped at 0.33 with no aspect recalled, lifts to full on first recall; the
securement drill now builds a 5-question session (was dead); cross-domain + signals drills unaffected;
0 console errors; `npm run check` green.

### D-0022 — rule.12 corrected to Hand Signals (verified migration); marathon gate; SR golden vectors
**Chosen:** three integrity fixes. (1) **rule.12 fixed, not guessed:** a read-only pass over the verified
source repos found CROR Rule 12 *is* "Hand Signals," and `training-assistant/content/operating.js` (op-12,
sourced verbatim from the Jan 2025 CROR) carries the hand-signals text; rule.12's six questions
(`q.12`–`q.12.6`) were already correct hand-signals questions. So rule.12's `plain` — wrongly the 123.2(v)
*doubt* text, which `rule.123.2` already covers — was replaced with the verified hand-signals content, and
the item **plus its six questions moved `radio` → `operating`**. Citation "CROR 12" kept. (2) **Anti-marathon
gate:** `recordAnswer` now advances the SM-2 schedule on a CORRECT answer only when the item is **due** — a
miss always counts (resetting is safety signal). Closes the marathon false-mastery hole (validation #7) and
subsumes the Drill's same-session guard (now removed). (3) **SR golden vectors:** `tools/sr-vectors.mjs`
transpiles `sr.ts` with the installed tsc and pins the exact schedule (1✓→{int 1, ease 2.55, fam .033} …
ceiling 2.8 / floor 1.3); added to `npm run check`; SPEC §Retention reconciled to the actual conservative V1
values (`+0.05` correct / `−0.2` miss — no easy/hard buttons yet).
**Weighed (rule.12):** guessing the content; leaving it flagged; moving only the domain (would relocate
wrong text). The verified source made a proper, non-guessed fix possible.
**Why:** safety-critical content must be right *and* sourced; cramming must not read as retention; the
retention engine must provably match its docs.
**rule.12 domain — flagged for Jordan:** placed in `operating` to mirror the verified source's own
classification (its tags were signals / hand-signals / switching). If you'd rather it sit under `signals`
or `switching`, that's a one-line change — flagging the bucket, not the content.
**Verified live:** rule.12 reference shows the hand-signals text in `operating`; the marathon gate holds (a
2nd immediate correct doesn't advance the interval); sr-vectors 7/7; `npm run check` + `tsc -b` + lint all
green. (The new SR gate even caught a Date-overflow in its own 20-correct ceiling test — fixed as a test
artifact; not reachable in real use, especially now that correct-advances are due-gated.)

### D-0023 — Mistake-driven remediation: "practice your misses" + a core-priority cue (#10, partial)
**Chosen:** the remediation half of REVAMP #10/§6. (1) The Drill remembers the items you miss in a session
and offers a **"Practice the N you missed →"** round at the end — a focused review built from exactly those
items, tier-unfiltered (you see every miss regardless of its tier band). (2) A transparent, domain-based
**priority cue:** a miss in a "core" domain (switching / securement / signals — the hands-on, someone-gets-
hurt ones) shows a calm "Core one — worth nailing; review your misses at the end" note. The priority lives
in `src/core/severity.ts` and is explicitly **not** a per-rule safety classification.
**Weighed:** a full per-rule S1/S2/S3 severity ladder; a live in-session re-queue that jumps the SM-2 due
order; hand-tagging all 226 questions with a severity.
**Why:** "log mistakes and adapt" is the heart of remediation and needs no risky per-rule safety labelling.
The end-of-session review is contained, calm (the audience is anxious learners — a miss is a UX gap to
scaffold, never a scolding), and rides the existing SM-2 + due-gate: a missed item is now due, so the review
correctly re-advances it on a clean recall.
**Deferred — flagged for SME/Jordan:** the full S1/S2/S3 ladder requires deciding which rules are
safety-critical (the same kind of CROR-judgment call as rule.12 — won't guess); and Yard mistake-attempt
tracking (repeated illegal-move attempts feeding remediation). `severity.ts`'s core/standard split is a
reviewable starting point, not the final ladder.
**Verified live:** drove a 10-question operating drill, missed 8 → the summary offered "Practice the 8 you
missed →" → the review round built exactly those 8; a securement (core) miss shows the cue; 0 console errors;
`tsc -b` + lint + `npm run check` green.

### D-0024 — The real S1/S2/S3 severity ladder (Drill tone + remediation order); rule.12 = operating confirmed
**Chosen:** a 3-tier severity model in `src/core/severity.ts` (`severityOf(item)` → S1/S2/S3), built from
transparent **domain defaults + a short reasoned override list** — a REVIEWABLE v1, not a legal safety
ranking. Hands-on operational domains (securement / switching / signals / authority) default S3; comms +
general procedure (radio / operating) S2; vocabulary (definitions) S1. Overrides downgrade sign-identification
and "proceed"/plate signals to S2, and upgrade doubt=STOP / hand-signals to S3. Severity drives: (a)
**feedback tone** — an S3 miss shows "Safety-critical — lock this one in," S2 "Worth nailing," S1 nothing;
and (b) **remediation order** — the "practice your misses" round sorts **safety-critical first**.
**Distribution (v1):** S3 = 103 · S2 = 39 · S1 = 63. S3 is broad (~half) because most conductor content is
genuinely safety-relevant; to make S3 more selective, tune `DOMAIN_SEV` / `SEV_OVERRIDE` (e.g. signals
default S2 with S3 only for the STOP/Restricting family).
**Weighed:** hand-classifying all 100 rules (false precision); a live mid-session re-queue that jumps the
SM-2 due order (deferred — the end-of-session review + S3-first order already weights safety).
**Why:** Jordan asked for the real S1/S2/S3. Domain-default + overrides is the honest, reviewable shape — he
owns the classification and can retune any rule in one line. The Yard already gives the strongest possible
S3 response (it *blocks* unsafe moves) and an over-par win already reads as gentle S1, so the ladder's main
learner-facing home is the Drill.
**Deferred:** Yard refusal severity-tagging (emphasis only — moves are already blocked + cited); the live
mid-session S3 re-queue.
**rule.12 = `operating`: CONFIRMED by Jordan** (was flagged in D-0022). Resolved.
**Verified live:** `severityOf` spot-checks all correct (rule.112 / 114 / 439 / 12 / 123.2 → S3; rule.405 /
104.1 → S2; definitions → S1); a securement miss shows the S3 cue; `tsc -b` + lint + `npm run check` green;
0 console errors.

### D-0025 — Radio joins the one brain via a SECOND mode, not by grading the walkthrough (#19)
**Chosen:** the Radio station gets two modes. **Guided** is the existing "Back to a Joint" walkthrough,
byte-for-byte and **ungraded**. **Call it yourself** replays the same procedure with the call hidden and
three options — the real call plus two other real calls from the same procedure — and grades it into the
one SM-2 model via `recordRadioStep` (`AppContext`), reusing the Yard's exact F1/F2 guards.
`public/data/radio-script.json` adds 14 `radio-script` ContentItems, one per step, each indexing radioSim's
`STEPS`; the call wording stays in radioSim only, so the two modes cannot drift.
**Supersedes the literal wording of REVAMP rec #19** ("per-step graded Radio"), which contradicted §5 of
the same document — *"merging turns a confidence-builder into a test."* It was also hollow: pressing
**Key the radio ▶** has no wrong answer, so grading it would have graded attendance.
**Only 8 of the 14 steps are gradable, on purpose.** A step is graded iff its own trust is `verified`,
which requires a CROR citation. The two CN GOI steps (set-and-center, cutting the air in) and the four
uncited closing counts are `operating-practice` — they play, they explain, they never move the bar, and
the station **says so on screen** rather than scoring them silently. New gate checks H (a graded radio step
must cite a verified CROR rule; a CROR-sourced step must be gradable) and G/I (1:1 with `STEPS`; every call
has ≥2 usable distractors) make that structural instead of a convention.
**Distractors are never invented** — they are other real calls from the procedure, because the true
confusions are *which* call belongs *where* (engine number past two car lengths, "over" on a running count,
feet too early). §7.5's collision test is applied at runtime and at the gate.
**`profile.radio.done` is retired** — it graded attendance and could never decay. Old profiles drop the
field on load. `radio-script` is no longer a declared-but-unused type; the Drill explicitly excludes those
items (they have no term↔definition reading).
**Also:** Reference's signal-aspect card gets **Drill these aspects →** into `/signals`. Rec #19's other
half — "a light graded mode in the Signal Reader" — was **already built and is not rebuilt**: `/signals`
has routed to `<Drill domain="signals">` since D-0016, and D-0021 already gates signals mastery on a real
SVG recall. Building a second answer surface would have been the duplication §5 forbids.
**Weighed:** grading each guided step (rejected — §5, and nothing to get wrong); a call-ordering puzzle
(rejected — tests sequence, not wording, and the wording is the SME-tuned asset); leaving Radio ungraded
and retiring the boolean only (rejected — the station would still teach and throw it away).
**Known effect:** the 8 new verified items enlarge the `radio` domain denominator, so an existing profile's
Radio mastery reads slightly lower than before. That is honest — there is now more in the domain to know.
**Open for SME:** steps 6 and 8–10 ("last car, one" and the feet counts) are correct practice with no CROR
paragraph cited in the verified source. If they map to one, they become gradable. Left uncited, not guessed.
**Verified live:** a fresh profile answering call 1 correctly moves Radio 0 → 0.0026 with exactly
`radio.joint.01` graded; a full 14/14 run grades exactly the 8 verified steps (06/08/09/10 answered, not
graded) and reads "+2% → 2%"; an immediate perfect replay moves mastery by **zero** (F2); call 6 shows
"● No CROR citation in the verified source", call 12 shows "● CN practice (GOI), not a CROR rule"; a miss
offers **Look it up →** and the misses-review round; guided mode still mounts and renders its first call
identically; radioSim keeps its own 13.4 kB lazy chunk; `npm run check` A–I green, `tsc -b` + build clean,
0 console errors.

### D-0026 — The Yard's tiers become real; `p1-sort` re-placed to tier 3 (#16 + #15)
**The revamp doc was wrong about this one.** `REVAMP-DESIGN.md` §4 #16 says tiers 2/4/5/6 hold 1–2
puzzles each and describes a par-5 → par-19 cliff *between* tiers, plus a "19-vs-22 count" question.
The actual set is **19 puzzles**: T0=4 (par 5,5,5,7) · T1=4 (7,**19**,9,9) · T2=**5** (5,3,4,6,7) ·
**T3=0** · T4=3 (3,5,6) · T5=2 (7,9) · T6=1 (4). Tier 2 has five, not one or two.
**The real defect:** `tier` was a **dead field** — authored on every puzzle since the start and read by
**nothing** in the repo. The picker was a flat `<select>` of all 19 in array order, so the ramp existed
in the data and never reached the screen. And `p1-sort` (par 19) sat *sixth in that flat list*, right
after three par-5 warm-ups, while being the only tier-0/1 puzzle that introduces the `order` rule. The
cliff was a **sequencing bug, not a content gap**.
**Chosen:** (a) `p1-sort` moves **tier 1 → tier 3**, filling the empty tier and sitting beside the rule
it teaches. Layout, par and `rules[]` are untouched — `solve.mjs` proves the same par 19. (b) The picker
groups into `<optgroup>`s from a new `TIERS` table in `puzzles.js`, labelled by what each tier teaches,
with par on every option. (c) **✓** marks completed, **→** marks the recommended next (first uncompleted
in tier order), rebuilt on each win so the marks never go stale.
**The arrow is a marker, not a lock** — every puzzle stays selectable (REVAMP §3: soft gates, never lock
learning content). Verified: 0 disabled options.
**Kept a native `<select>`** rather than a bespoke menu — keyboard-complete and screen-reader-correct
for free, and `optgroup` is exactly the grouping primitive this needed.
**`TIERS` lives in `puzzles.js`,** not a `.json`. Tunables belong in config, but the Yard island is
byte-for-byte vanilla with its content inline; making the engine fetch JSON for a label table would be
a real architecture change for no gain. It sits with `PUZZLES`/`RULES`, where every tier number already lived.
**Deferred:** authoring a scaffold rung before `p1-sort` — the owner's call after seeing the ramp with
tiers visible; per-puzzle best records (#14); solver-emitted `optJoints` (#17).
**Verified live:** picker renders **7 groups, none empty, 19 options, 0 disabled**; tier 1 now reads
7/9/9 with no par-19 wall; tier 3 is populated; a profile with `p0-1`/`p0-2` completed shows exactly
2 ✓ and 1 → on the next puzzle; `npm run check` green (p1-sort still `par=19 solver=19`); build clean;
0 console errors.

### D-0027 — The "clean" badge stops guessing (#17); per-puzzle best records (#14); #20 is already resolved
**#17 — the badge was praising sloppy runs.** `bestJoints()` was `ceil(par / 2)`, a placeholder that
was **wrong on 16 of 19 puzzles and always too generous** — `p2-build` awarded "clean" at 4 joints when
the optimal line makes 2; `p4-split` at 3 when the answer is 1. Every puzzle now carries a solver-derived
`optJoints`, taken from `replay(puzzle, puzzle.opt).joints` — the real joint count of the authored
optimal line — and `tools/solve.mjs` **hard-fails** if the stored number ever disagrees. Verified by a
deliberate corruption: setting `p0-1` to `optJoints: 9` produced
`✗ HARD FAIL p0-1: optJoints=9 but the optimal line makes 2 joint(s)`, exit 1; restoring it went green.
**#14 — per-puzzle best records.** `profile.yard.best[id] = {moves, joints, beatPar, departed}`, added
**alongside** the existing `completed: string[]` rather than replacing it (everything already reads that
list; a migration would have been churn for no gain). Fewer moves wins, joints break the tie, and a
worse run never overwrites a better one. The picker shows `· your best 6m` only where a record exists —
a profile from before this ships shows **blank, not a fabricated record**. The win banner reads
`· new best (was 7m/3j)` or `· your best: 5m/2j`; a first clear says nothing, because there is no best yet.
**A watched-optimal demo never sets a record** — it is the answer, not your run (`fromDemo` guard, the
same one that already blocks mastery writes).
**#20 was already resolved — no work done.** The doc says the `authority` and `protection` domains are
empty and read 0% on Home. In fact `authority` has **37 drillable verified items**, and `protection` is
not in `DOMAINS` at all, so it is never rendered. `recomputeMastery` also skips any domain with no items.
There is nothing to fix; recorded here so it is not "fixed" again later.
**Not verified live:** the end-to-end win path (play → banner → best written) could not be exercised in
this session — the Yard's animations run on `requestAnimationFrame`, which is suspended while the
browser pane is hidden, so neither a played win nor the watched demo can complete. What *was* verified:
the gate (including the negative test above), the picker rendering a seeded record correctly while
leaving unrecorded puzzles blank, `tsc -b` + build clean, 0 console errors. **The banner text and the
first real win still need the owner's screenshot loop.**

### D-0028 — PWA offline shipped; the app icon is NOT decided (it needs the owner)
**Offline is the point, not a nicety** — this gets studied on a train with no signal (SPEC:
local-first). `vite-plugin-pwa` was a devDep for months without being wired; it is now configured in
`vite.config.ts` with `registerType: 'autoUpdate'`.
**The trap that would have shipped a lying app:** Workbox's default `globPatterns` does **not** include
`.json`. Left at the default, Clear Board would have advertised offline support and then 404'd its
entire rulebook the moment the signal dropped — the four content files *are* the app. The glob is
explicit: `**/*.{js,css,html,svg,json,woff2}`.
**Also fixed:** `index.html` referenced `/favicon.svg` absolutely while `base` is `'./'`, so the icon
404'd on the Pages subpath and inside Tauri. Now relative. Added `theme-color`.
**Verified live, properly:** built, served `dist/`, confirmed the SW registers and takes control
(1 registration, `controller` non-null, 14 cache entries), then **stopped the server** and reloaded.
With nothing listening, `index.html` and all five data files still resolved from cache
(definitions 63 · signals 42 · rules 100 · rule-questions 226 · radio-script 14), and a hard navigation
to `/#/drill` rendered a real signal question. That is genuine offline operation, not a manifest audit.
**The app icon is deliberately NOT resolved.** `public/favicon.svg` is a purple lightning-bolt mark with
no relationship to railroading or to Clear Board, and it is currently the app's whole visual identity
(web favicon + the manifest icon); the Tauri desktop build still wears the default Tauri logo. The
manifest points at the existing mark rather than a generated PNG set **on purpose** — designing a logo
is a taste call that belongs to the owner, and an identity mark is not something to decide silently.
**Two questions for the owner:** (1) where did `favicon.svg` come from — it resembles a third-party
tool's default mark, which would be a provenance problem, not a style preference; (2) what should the
icon actually be. Once there is a source mark, `npm run tauri icon <src>` generates the full desktop
set and PNG manifest icons in one step.

### D-0029 — Securement becomes a player ACTION (#18); point protection deferred
**The problem:** Rule 112 is the most safety-critical thing the Yard teaches, and the engine was
doing it *for* you — `spot()` set `secured = true` automatically on any 2+ car cut. The learner never
decided anything; securement was a flag that happened to them. Same for the kick backstop.
**Chosen:** a real **SECURE T** move (`model.js` — `canSecure` / `secure`). Spotting no longer ties a
cut down; leaving the goal track's standing cut loose is **not a win**; kicking still demands a secured
backstop, which you must now tie yourself.
**SECURE costs ZERO engine moves — and that is the honest physics, not a dodge.** `moves` counts engine
direction-legs; applying hand brakes is the conductor on the ground and the engine doesn't move. The
consequence matters enormously: **every authored par still means exactly what it meant.** All 19 pars
re-proven unchanged, with **0 puzzles dropping to "optimality unverified"** — the risk that an engine
edit would invalidate hand-tuned puzzle design did not materialise. What securement costs you is
remembering, which is the thing being trained.
**Solver:** searches with `checkWin(..., { requireSecured: false })` and appends the required SECURE on
a win. Sound because a 0-cost, always-available action cannot change a fewest-moves line — and it keeps
the search space from multiplying (`key()` doesn't encode securement, so including it would have been
incorrect as well as expensive).
**Data:** 11 authored `opt` lines gained a trailing `['secure', <goal>]` (the 7 kick puzzles already
end tied, since a kick lands on a secured backstop; `p6-road` departs, so nothing is left standing).
The same 11 gained the `secure` rule chip — every non-depart job genuinely exercises CROR 112 now, so
the chips say so and `masteryItemsFor` grades it on every win.
**Visible at its source:** the canvas tags a standing 2+ cut **TIED** or **LOOSE** on the track itself,
words not colour alone — not just a banner after you try to walk away. The refusal names the specific
track and cites 112.
**New gate — `tools/securement-check.mjs` (GATE 3, in `npm run check`).** 13 assertions pin the
behaviour so it cannot quietly revert to a passive flag. Writing it caught a **false pass in my own
first test**: "kick refused onto an untied backstop" was passing because the engine was empty
("You're only holding 0 cars"), not because of securement. The committed version replays up to the
kick so the engine is actually holding cars, asserts the kick is ALLOWED when tied, and requires the
refusal to cite 113.4/113.5.
**DEFERRED — the point-protection acknowledgment on shove.** #18's second half would put a
confirmation in front of every SPOT and KICK, i.e. on the primary verb, several times a minute. That is
a game-feel call about the moment-to-moment rhythm of the core loop, and it belongs to the owner with
hands on the controls — not to a silent judgment here. Securement was separable and is done; this half
is not started.

### D-0030 — Clear Board 2: one change request, in waves, behind a fence
**Chosen:** Clear Board takes the skin Dusk 0.2.0, the Yard gets a new drawing, and each safe upgrade
is found, ranked and built. The work is one change request on this repository, in waves: research,
Gate A, foundation (2a), surfaces (2b), integration (2c). The plan is `specs/clear-board-2-plan.md`.
Its section 4 is the fence. Each brief carries the fence in full.
**Dusk:** the six layer files in `src/styles/dusk/` are a locked copy (`src/styles/dusk.lock.json`).
No job edits the copy. App token names map to Dusk tokens in one bridge file,
`src/styles/clear-board.tokens.css`.
**Page law tier:** STRICT. The line is at the top of this file. The owner has not picked OPEN. One
question is open: an exception for travel of equipment in the Yard drawing
(`specs/briefs/lead-rulings.md`, section 3, `TIER`). Until an answer, the page has no exception.
**Frozen:** `public/data/*.json`, `src/core/signal.ts`, `src/stations/yard/model.js`, `solver.js`,
`puzzles.js`, `geometry.js`, and the `STEPS` wording in `src/stations/radioSim.js`. The baseline is
commit `94a41c5`.
**Step zero, 2026-11-20:** `npm ci`, `npm run check` and `npm run build` were green on a clean clone
of `86cfef2`. The Dusk copy matched its lock.
**Research:** seven reports, `specs/research/R1` to `R7`. A second job checked R2 to R7 against the
code and the running app. Not verified in any report: a real phone, Safari, the Windows desktop
build, a real screen reader.

### D-0031 — The Yard look is C2: the pictorial model, with a view that can shrink empty track
**Chosen (the owner, Gate A, question 1):** look C2. The yard is drawn as a model seen from above:
rails, ties, a car shape for each type, an engine. Empty track can shrink, with a break mark, so the
yard stays one picture. A phone and a narrow window get the same drawing as one row for each track.
The sketch and its review are `specs/research/yard-looks/look-model2.*`.
**Weighed:** look A, a dispatcher track diagram (calmer, the least work); look B, a switch list (best
for a phone and a screen reader, and it does not look like a yard); look C with one uniform scale
(it needs a window of 1335 px and splits into three views below that).
**Why:** the learners of this product learn by doing. A yard that looks like a yard, and a car type
that reads by shape, serve them. Look C2 keeps that and removes the split of look C.
**Known cost, told to the owner before the pick:** the wide form holds in each of 84 authored states
from a window of 1366 px. Under that width the form can change with the state of the game. Room on a
track is carried by a bar and not by eye. Look C2 is the most drawing work of the options.
**Open:** the rule for the change of form during a job, the new words of the legend, and gold for
the route, the engine and the goal (`specs/briefs/lead-rulings.md`, section 3).
**Colour:** each colour meaning that a reader can take for a rail convention carries the mark "SME
to confirm". The claim in `yard/render.js` line 2, that yellow is a convention for a diverging
switch, is not verified (plan fact T12).

### D-0032 — The Yard is drawn in SVG, with native buttons and a text list
**Chosen (the lead, from report R2):** one inline SVG for the drawing, native HTML buttons for the
six switches, and a text list of the yard state. No canvas. The drawing stands on a view transform
over `geometry.js`. No number in `geometry.js` changes.
**Weighed:** a canvas (the present form), and a canvas with an SVG layer. R2 built and measured a
prototype of each (`specs/research/yard-tech/`).
**Why:** text in SVG is real text. It follows the text scale, the dyslexia type and a token change
with no code, and a test can read it. With a slowed processor at phone width the SVG drew 74 to 75
of 75 frames and the canvas drew 47 to 58.
**Not verified:** each timing is from a headless browser with no graphics card. The order of the
options on a real phone is not verified.

### D-0033 — Full play on a phone
**Chosen (the owner, Gate A, question 2):** a learner can finish each of the 19 Yard jobs on a phone
390 px wide. The build is held to that: the move controls stay in reach, a long cut that goes on in
a second line carries a mark, and a browser test plays a job to a win at phone width.
**Weighed:** desktop first, with a phone view that can be read.
**Why:** `SPEC.md` says the app is used on the train, and it ships as an offline app for a phone.
Today a car number draws at 2.4 px on a phone and a switch has a hit radius of about 5 px.
**Not verified:** a real phone. Each test used an emulated phone.

### D-0034 — The app icon is the monogram; the favicon origin is settled (closes D-0028)
**The origin:** `public/favicon.svg` is the logo of the Vite project template, byte for byte
(create-vite 9.3.4, `template-react-ts/public/favicon.svg`; SHA-256 compared on 2026-11-20).
`public/icons.svg` and the files of plan fact T5 come from the same template. The mark leaves the app.
**Chosen (the owner, Gate A, question 3):** icon C, the monogram: the letter C drawn as a track
line, which holds one lit board. The files are `specs/research/icon/icon-mark.svg` and
`icon-mark-small.svg` (the 16 px drawing).
**Weighed:** a lit lamp (the header mark of today, a common form); a yard ladder (it can read as a
chart at small sizes).
**Colour:** an icon file cannot read a style sheet. Its colours are copied values of Dusk tokens,
and the notes name the token for each. This is an allowed place for a raw colour (D-0035, row U-45).
**Open:** the PNG set for the manifest (job B1). The desktop icon set waits for a session that can
make the Windows build. The green light carries the mark "SME to confirm".
**Not verified:** only Chromium rendered the icon. No phone launcher and no desktop taskbar was
tested. No search for similar marks was made.

### D-0035 — The upgrade list: 46 rows have a yes, 5 rows have a no
**Chosen (the owner, Gate A, question 4):** yes to each recommended row of
`specs/research/upgrade-list.md`. Rows U-01 to U-46 have a yes. Rows U-47 to U-51 have a no.
**What a row is:** a change of a behaviour, a word or a control that three audits found (R4 learning
and UX, R5 accessibility, R6 engineering). A reskin job makes no such change. Each row has a job.
**The picks inside rows:** U-13: motion is reduced when the learner's choice or the device asks for
it. U-17: the look-up opens on top of the station. U-30: the dyslexia face ships as a font file only
if its licence allows it. U-42: the tip link stays. U-45: the icon files and the desktop window
colour can keep a raw colour.
**New words:** rows U-11, U-24, U-25, U-27, U-33, U-37 and U-40 come back to the owner for the exact
words before they ship.
**The five rows with a no:** a dependency update (U-47), a fixed starter list (U-48), a content
security policy (U-49), a settings module for the numbers of the learning model (U-50), the desktop
set-up (U-51). Each one has its reason in the table.
**Not fixed, on purpose:** 28 notes for the SME are in section 10 of that file. No job edits rule
content, signal aspects, puzzle layouts, pars or the solver.

### D-0036 — Facts that Wave 1 corrected, and two recorded exceptions
**Reduced motion in the Yard is slower today, not faster.** The plan said "6 times faster" (fact
T4). `yard/anim.js` line 17 multiplies each duration by the factor that `yardSim.js` line 228 sets
to 6. Measured: about 9.0 s against 1.6 s for one move. Three reports agree. Motion does not stop.
Job Y4 makes it stop.
**The Signals drill can mark a correct name as wrong.** In `public/data/signals.json` one drawing
(one red lamp on a mast) belongs to `sig.437` and to `sig.439`, and one drawing (one green lamp on a
dwarf) belongs to `sig.405` and to `sig.431`. Each of the four items is `verified`. The audit saw the
drill show the red lamp, offer the two names, and mark "439 STOP" as wrong. The data is frozen and
is not changed. Row U-01 stops the drill from asking such a question. Whether each drawing is right
for the two items is a note for the SME (S-01).
**Exception to fence rule 5:** a red lamp in the frozen signal drawing is content. It is not an
attention colour of the skin. No file changes.
**Exception to fence rule 4:** the icon files and the desktop window colour can keep a raw colour
(row U-45). Each value is a copied Dusk token value.

### D-0037 — The lead's rulings for Wave 2
**Chosen:** the file `specs/briefs/lead-rulings.md` holds each ruling of the lead and each question
that is still open for the owner or for the SME. `specs/briefs/00-contracts.md` holds the agreement
between the parallel jobs: the owner of each file in each wave, the names, the file layout and the
merge order.
**Main rulings:** one wave branch and one local branch for each job; a build agent commits and the
lead pushes. Job G1 writes small equivalents of the reskin tools and copies no code from them,
because that repository is private and this one is public. The Files line of B3 is wider than the
plan: B3 can change each colour in `radioSim.js` and no word. `src-tauri/**` waits for a session
that can make the Windows build. Pictures of a job are committed at scale 1.
**Until the owner answers an open question,** each job keeps the behaviour of today for it.

### D-0038 — The owner's picks for Wave 2b and 2c, and the written exception to STRICT
**Chosen (the owner, 2026-11-21, the words "yes to all recommended" and "yes"):** the recommended
option of each of the 19 picks of `specs/briefs/lead-rulings.md`, section 3.
**The written exception to STRICT:** the tier line stays `Page law tier: STRICT`. The Yard drawing
can show travel of equipment after a learner action: a move, a kick, the arrival when the learner
asks for it, and the departure. Nothing else on a page moves except a state change. Reduced motion
stops each travel effect, and the end state shows at once with its words.
**The page:** one window that fills the browser; lines of text stay capped. The app sizes stay for
reading text; the small Dusk sizes are for labels and counts. A domain tile has one tone when the
domain is live and grey when it is not.
**The Yard drawing (look C2):** gold marks the lined route, the engine and the goal (Dusk: gold is
chrome and selection). The form of the drawing is selected when a job starts and kept for that job.
The new words of the C2 legend and the six labels are approved as sketched; the SME confirms the
rail terms. A travel leg takes 840 ms in and 420 ms out. A still trace shows the last move.
**The Yard controls:** the sound is off by default, with its own switch that holds the choice. The
arrival plays on request only. The watched optimal line is a stepper (Next, Back, Play all, Stop).
Secure, flag and certify get one new confirmation sound. A move log has "Play again". A new input
ends a running effect. The cost of a move is said in words; the SME checks the words. After Depart
the lead shows empty and the job is closed until Reset. A switch throw clears a refusal that is no
longer true.
**The version:** the first version of Clear Board 2 is `2.0.0`.
**Still open for the SME, not built:** the flashing lamp under reduced motion, the word "yellow",
the wording of the Yard text mirror (Y4 builds it from words the app has today; the SME reads it
before the change reaches `main`), where the engine rests after a spot, the picture of a kick, the
sound of a spot.

### D-0039 — The gate tools may follow the owner's reskin tools (changes the TOOLS ruling of D-0037)
**Chosen (the owner, 2026-11-21, "Yes, publish it"):** the code of the gate tools of job G1 can be
published in this public repository as it is. `tools/colour-lint.mjs` follows the structure of the
owner's reskin tool `token-lint.mjs` closely, with other names. The uses check of
`tools/dusk-lock-check.mjs` follows `dusk-sync.mjs`, and two helpers of `tools/look/look.mjs` follow
`visual-regress.mjs`. The reskin tools stay in their own private repository; no file of them is
copied whole.
**Why the question came up:** the lead had ruled that G1 copies no code from the private
repository (TOOLS, option c), because the owner had not said that it could be published. The
independent review of G1 found the close match. The lead checked the files: they hold no private
name, path or project reference.
**Correction:** the message of one unpushed commit said that no code of the reskin tools is in the
repository. The lead corrected that message before the first push. The trees did not change.

---
*V1. Edit as decisions are made or reversed.*
