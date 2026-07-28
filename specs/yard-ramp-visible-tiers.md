# Spec — The Yard: make the tiers real (rec #16 + #15)

Status: **approved by the owner 2026-07-28** (design chosen in interview: "make the existing
tiers real, re-place p1-sort"). Source: `REVAMP-DESIGN.md` §4 recs #15/#16.

---

## 1. Problem — and where the revamp doc is wrong

The doc says tiers 2/4/5/6 hold 1–2 puzzles each and describes a par-5 → par-19 cliff between
tiers. Neither is true. The real set is 19 puzzles:

| Tier | n | Pars | Introduces |
|---|---|---|---|
| 0 | 4 | 5,5,5,7 | line · speed · couple · shove |
| 1 | 4 | 7,**19**,9,9 | — (`p1-sort` silently adds `order`) |
| 2 | 5 | 5,3,4,6,7 | verify · kickable · secure · kick |
| 3 | **0** | — | **empty** |
| 4 | 3 | 3,5,6 | loads |
| 5 | 2 | 7,9 | — (long strings, short lead) |
| 6 | 1 | 4 | order + depart |

Two real defects:

1. **`tier` is a dead field.** It appears only in `puzzles.js` — nothing else in the repo reads it.
   The picker (`yardSim.js:609`) is a flat `<select>` of all 19 in array order. The curriculum
   exists in the data and never reaches the screen. Dead data by the no-dead-mechanics rule.
2. **`p1-sort` is misplaced.** Par 19 among par-5→9 neighbours, sixth in a flat list, and it is
   the only tier-0/1 puzzle that introduces `order`. That is the cliff — a sequencing bug, not a
   content gap.

## 2. Design

### 2.1 Re-place `p1-sort`
`p1-sort` moves **tier 1 → tier 3**, filling the empty tier and putting it beside the rule it
actually teaches. Nothing about the puzzle itself changes: same layout, same par 19, same
`rules[]` — so `tools/solve.mjs` proves the identical par and stays green.

Tier 3's meaning becomes explicit: **blocking order** — build the cut in a required sequence.
That makes the ladder read line/couple/shove → yard work → kicking & securement → **order** →
loads → room & reach → the road job.

### 2.2 Surface the tiers in the picker
The picker stays a native `<select>` (keyboard-complete, screen-reader-correct, zero new
components — the accessible default beats a bespoke menu). Options are grouped into
`<optgroup>`s, one per tier, labelled with what the tier teaches:

    Tier 0 — learn the move
      ✓ 1. Make up the cut · par 5
      → 2. Add to the cut · par 5

- **✓** — already completed (from `profile.yard.completed`).
- **→** — the recommended next: the first uncompleted puzzle in tier order. A **marker, not a
  lock** — every puzzle stays selectable, per the revamp's "soft gates, never lock learning
  content."
- Par ships on the label so length is visible before you commit to a job.

Option `value` stays the index into `PUZZLES`, so `load(PUZZLES[+picker.value])` is untouched.

### 2.3 Tier labels live beside the data they label
A `TIERS` table is exported from `puzzles.js` next to `PUZZLES` and `RULES`. Tunables belong in
config, but the Yard island is byte-for-byte vanilla with its content inline; fetching JSON from
inside the engine would be a real architecture change for a label table. Kept with `PUZZLES`,
which is where every other tier number already lives.

### 2.4 The marks refresh on a win
`yardSim.js:435` already pushes to `profile.yard.completed` on a win. The picker labels are
rebuilt at that moment, so ✓ and → move as you play instead of going stale until re-mount.

## 3. Out of scope
Authoring any new puzzle (a scaffold rung before `p1-sort` is the owner's separate call, after
seeing the ramp with tiers visible) · changing any layout, par, or rule tag · per-puzzle best
records (#14) · solver-emitted `optJoints` (#17).

## 4. Definition of done
1. `npm run check` green — solver proves all 19 pars including `p1-sort` at par 19 after the
   tier move.
2. The picker shows seven labelled groups; **no group is empty**.
3. ✓ marks completed puzzles; → marks exactly one recommended-next; both update after a win
   without re-mounting.
4. Every puzzle is still selectable — nothing is locked.
5. `tier` is no longer a dead field: it drives the picker.
6. `CHANGELOG.md` + a `DECISIONS.md` entry recording that the doc's tier counts were wrong and
   what was actually there.
