# Clear Board — DECISIONS

*ADR-style. Each real call: what was chosen, what else was weighed, why. Last updated 2026-06-23.*

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

---
*V1. Edit as decisions are made or reversed.*
