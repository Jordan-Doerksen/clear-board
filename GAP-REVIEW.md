# Clear Board — Design Gap Review (pre-build)

*Adversarial review of SPEC.md + DECISIONS.md, 2026-06-23, per `AI-Brain/workflows/design-gate.md`.*
*No repo is created until these come back with nothing that would change behavior.*

---

## BLOCKERS (would change the design or build)

**B1. "Migrate already-verified content" assumes a verification state the source doesn't have.**
HANDOFF shows `ASPECTS_DRAFT` is still `true`; 4 of 42 signal indications unencoded (410, 418, 433A, 440); the 407 question was an open conflict; the third-party signal PDF has a known "A-plate" error. If migration copies everything in as `verified`, F1 is live on day one.
→ **Q:** Which items are *not* fully verified now, and what is each one's correct trust flag at migration?

**B2. "Verified" is a schema value but never defined — and no named verifier.**
Nothing says what evidence makes something verified, who sets the flag, or how it's re-checked when the CROR is reissued.
→ **Q:** What must be true for `trust:"verified"`, and who has authority to set it?

**B3. CROR-vs-GOI asserted as "always distinguished" but the schema can't represent it.**
Real pattern is nuanced: "set and center" is GOI whose *nearest* rule is 109; kick limits are a "113.5 special instruction." A flat single-source enum can't say "GOI, related to CROR 109" without losing one.
→ **Q:** How must the schema record *both* that an item is GOI *and* its anchoring CROR number?

**B4. The retention / spaced-repetition model is named but undefined.**
F2/F3 rest on "spaced reps + a retention check," but there's no algorithm, decay curve, interval schedule, or definition of the "mixed retention check."
→ **Q:** What is the actual retention model and the exact pass condition — or is that an SME call to specify before build?

**B5. The "test-ready" threshold is openly unmade and gates a safety claim.**
This is the F3 mitigation; "conservative" is not a spec.
→ **Q:** What per-domain threshold + retention bar = `testReady`, and may anything "test-ready" show before that number exists?

**B6. Four source apps, four data shapes — migration mapping unspecified.**
DEFS / ASPECTS+VARIANTS / quiz BANK / switch-list PUZZLES / radio scripts don't map cleanly onto one `ContentItem`; e.g. variant≠indication (136→~100), and puzzles carry solver-verified `par` the `payload:object|null` doesn't commit to preserving.
→ **Q:** Field-by-field mapping per source, and which fields must survive intact?

**B7. Existing users' progress not addressed.**
The four live apps have their own localStorage; retiring them (D-0006) silently abandons accumulated progress.
→ **Q:** Does any existing progress migrate, or is everyone reset?

**B8. Copyright: SVG signals are covered, but shipping verbatim CROR *text* offline is not.**
Schema ships `citation.verbatim` and the goal is full offline reference. Bundling verbatim CROR text into a public static site is a different question than the PDF, and it's unaddressed.
→ **Q:** Is shipping verbatim CROR rule text in a public offline bundle permitted; if not, what may be verbatim vs paraphrased?

**B9. "Machine-verified solvable" has no owner in a no-build, no-CI project.**
The solver is a throwaway, uncommitted script; there's no described gate where verification runs.
→ **Q:** Where does scenario-solvability verification live and run — committed harness, manual checklist, or other?

## NON-BLOCKING (clarify before/during build)

- **N10.** Offline bundle size asserted but never bounded — target cap?
- **N11.** "No analytics" + free public good = no way to know if it's working — accept zero usage signal, or a privacy-safe feedback path?
- **N12.** Accessibility "testable" but no criteria — WCAG level? contrast ratio? target px? read-aloud mechanism?
- **N13.** Read-aloud vs offline-first conflict (browser TTS often needs network/OS voices).
- **N14.** `payload:object|null` is an untyped escape hatch for the most safety-relevant data (signal aspect specs, scenarios).
- **N15.** Schema enumerates 7 domains / 5 types / 6 stations but V1 = Reference + Drill only — which domains are populated vs schema-reserved for V1?
- **N16.** Retiring four apps creates Observatory portfolio dead links + a story change — what happens to those entries?
- **N17.** Name + tip-jar handle are user-facing copy — lock before public launch (not before build).

---

## Triage (how each is being resolved) — added 2026-06-23
- **Resolve in SPEC (no decision needed):** B1 (migrate with honest flags; unverified → `needs-review`, reference-only), B3 (richer citation: GOI + `relatedRef`), B4 (specify SM-2-lite with numbers), B6 (write per-source mapping), B9 (commit the solver as a checked-in test harness + pre-ship checklist), N12–N15.
- **Scope out of V1:** B5 + the Exam station (no test-ready claim ships in V1).
- **Resolved at gate (confirmed by Jordan 2026-06-23):** B2 (Jordan = SME verifier, D-0008), B7 (fresh start + redirect at parity, D-0011), **B8 — CROR is a public document, so verbatim text DOES ship in V1 (D-0010); the PDF is still never committed**, N16 (four cards collapse to one Clear Board entry, D-0011).

## Re-review verdict (2026-06-23)
B1–B9 all resolved (specified or safely scoped out of V1). Two revision-introduced items fixed:
`interval` added to the Profile schema; this Triage reconciled with D-0010 (verbatim ships). **GATE-CLEAN FOR V1.**
