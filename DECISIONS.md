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

---
*V1. Edit as decisions are made or reversed.*
