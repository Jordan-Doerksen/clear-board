// tools/solve.mjs — the solver / par gate.
//
// For EVERY puzzle in PUZZLES:
//   1. ALWAYS assert replay(puzzle, puzzle.opt) wins AND moves === puzzle.par.
//      (Proves the authored par is achievable and the authored optimal line is valid.)
//      A failure here is a HARD FAIL.
//   2. Run solve(puzzle). If it returns a result, assert result.par === puzzle.par
//      (optimality — no shorter line exists). If solve() returns null even after
//      raising caps, do NOT fail hard on optimality — print a ⚠ note instead.
//   3. Print a per-puzzle line: id, par, replay result, solver par (or "—"), PASS/FAIL/⚠.
//
// Exit 0 only if every puzzle passes step 1 AND every completed solve() agreed on par.
//
// HONESTY: this script never edits data. If a par/opt doesn't validate, it REPORTS it.

import { PUZZLES } from '../src/stations/yard/puzzles.js';
import { solve, replay } from '../src/stations/yard/solver.js';

// Caps: start at the solver defaults, then escalate before giving up on optimality.
const CAP_LADDER = [
  { maxMoves: 28, maxStates: 150000 },
  { maxMoves: 32, maxStates: 600000 },
];

let hardFails = 0;   // step 1 replay failures, or step 2 disagreements
let unverified = 0;  // solve() returned null within caps (not a failure)
let passes = 0;

const pad = (s, n) => String(s).padEnd(n);

console.log('═══ GATE 1: solve.mjs — par / optimality ═══');
console.log(`Checking ${PUZZLES.length} puzzles.\n`);

for (const puzzle of PUZZLES) {
  const id = puzzle.id;
  const par = puzzle.par;

  // ---- Step 1: replay the authored optimal line (ALWAYS) ----
  const rp = replay(puzzle, puzzle.opt);
  const replayOk = rp.ok === true && rp.moves === par;
  let replayStr;
  if (rp.ok !== true) {
    replayStr = `replay BROKE @ ${rp.where || '?'} (${rp.msg || 'did not win'})`;
  } else if (rp.moves !== par) {
    replayStr = `replay wins but moves=${rp.moves} ≠ par=${par}`;
  } else {
    replayStr = `replay ok (${rp.moves}m/${rp.joints}j)`;
  }

  // ---- Step 2: solve() for optimality ----
  let solveRes = null;
  let usedCap = null;
  for (const cap of CAP_LADDER) {
    solveRes = solve(puzzle, cap);
    usedCap = cap;
    if (solveRes) break;
  }

  let solverParStr;
  let optimalityOk;     // true = agreed, false = disagreed, null = unverified within caps
  if (solveRes) {
    solverParStr = String(solveRes.par);
    optimalityOk = solveRes.par === par;
  } else {
    solverParStr = '—';
    optimalityOk = null;
  }

  // ---- Verdict ----
  let verdict;
  if (!replayOk) {
    verdict = 'FAIL';
    hardFails++;
  } else if (optimalityOk === false) {
    verdict = 'FAIL';
    hardFails++;
  } else if (optimalityOk === null) {
    verdict = '⚠';
    unverified++;
    passes++; // replay still proves achievability — counts as a pass for exit purposes
  } else {
    verdict = 'PASS';
    passes++;
  }

  // ---- Per-puzzle line ----
  let line = `${pad(verdict, 4)} ${pad(id, 9)} par=${pad(par, 3)} ${pad(replayStr, 40)} solver=${pad(solverParStr, 4)}`;
  if (optimalityOk === false) {
    line += `  ← solver found a SHORTER/DIFFERENT par (${solveRes.par}) than authored (${par})`;
  } else if (optimalityOk === null) {
    line += `  ⚠ optimality unverified within caps (maxMoves=${usedCap.maxMoves}, maxStates=${usedCap.maxStates}); par achievability still proven by replay`;
  }
  console.log(line);

  // Loud explicit failure echo so it can't be missed in CI logs.
  if (!replayOk) {
    console.log(`     ✗ HARD FAIL ${id}: authored opt line does NOT achieve par. ${replayStr}`);
  } else if (optimalityOk === false) {
    console.log(`     ✗ HARD FAIL ${id}: authored par=${par} is NOT optimal — solver line is ${solveRes.par} move(s).`);
  }
}

console.log('\n─── summary ───');
console.log(`${passes}/${PUZZLES.length} passed the replay/par gate (${unverified} ⚠ optimality-unverified within caps).`);
if (hardFails > 0) {
  console.log(`✗ ${hardFails} HARD FAILURE(S). Fix order is data → par → engine. Do NOT edit the checker.`);
} else {
  console.log('✓ All authored pars are achievable; every completed solve agreed on par.');
}

process.exit(hardFails > 0 ? 1 : 0);
