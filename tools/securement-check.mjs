// tools/securement-check.mjs — GATE 3: securement is a player ACTION, not a flag (D-0029).
//
// Rule 112 is the most safety-critical thing the Yard teaches, and until D-0029 the engine
// applied it FOR you: spotting a 2+ car cut silently set `secured = true`. This gate pins the
// behaviour that replaced it, so it can never quietly revert to a passive flag:
//
//   • spotting does NOT tie a cut down
//   • an untied goal track is NOT a win, and the refusal can name the loose track
//   • SECURE costs ZERO engine moves (moves count engine legs; hand brakes are on the ground)
//   • SECURE refuses where it would be nonsense (empty / single car / already tied)
//   • kicking still demands a SECURED backstop — and refuses for THAT reason, not another
//   • no authored par changed
//
// HONESTY: this script never edits data. It reports.

import { PUZZLES } from '../src/stations/yard/puzzles.js';
import { freshState, pull, spot, secure, canSecure, canKick, checkWin, unsecuredGoal } from '../src/stations/yard/model.js';

const P = Object.fromEntries(PUZZLES.map((p) => [p.id, p]));
let fails = 0;
const ok = (name, cond, extra = '') => {
  console.log(`  ${cond ? '✓' : '✗'} ${name}${extra ? '  — ' + extra : ''}`);
  if (!cond) fails++;
};
const auto = (s, id) => { for (const t of Object.keys(s.lined)) s.lined[t] = t === id ? 'reverse' : 'normal'; };

console.log('═══ GATE 3: securement-check.mjs — Rule 112 is a player action ═══');

// ── A. Building the job does not tie it down for you ──
{
  const p = P['p0-1'];
  const s = freshState(p);
  auto(s, 'AS73'); pull(s, 'AS73', 3);
  auto(s, 'AS72'); pull(s, 'AS72', 3);
  auto(s, 'AS75'); spot(s, 'AS75', 6);
  ok('cars are placed correctly', s.tracks['AS75'].length === 6);
  ok('spotting does NOT secure the cut', s.secured['AS75'] === false);
  ok('an untied goal track is not a win', checkWin(s, p) === false);
  ok('the refusal can name the loose track', unsecuredGoal(s, p) === 'AS75');
  const before = s.moves;
  secure(s, 'AS75');
  ok('SECURE ties it down', s.secured['AS75'] === true);
  ok('SECURE costs ZERO engine moves', s.moves === before, `${before} → ${s.moves}`);
  ok('then the job is complete', checkWin(s, p) === true);
  ok('and it still comes in at par', s.moves === p.par, `${s.moves} vs par ${p.par}`);
}

// ── B. SECURE refuses where it would be nonsense ──
{
  const p = P['p0-1'];
  const s = freshState(p);
  ok('refuses an already-tied cut', canSecure(s, 'AS72').ok === false);
  auto(s, 'AS72'); pull(s, 'AS72', 3);
  ok('refuses an empty track', canSecure(s, 'AS72').ok === false);
  auto(s, 'AS72'); spot(s, 'AS72', 1);
  ok('refuses a single car (112 is about a standing CUT)', canSecure(s, 'AS72').ok === false);
}

// ── C. Kicking still demands a secured backstop — for the RIGHT reason ──
{
  const p = P['p2-kick'];
  const s = freshState(p);
  // Replay up to the kick so the engine is actually HOLDING cars; otherwise canKick refuses
  // because the engine is empty and this check would pass for the wrong reason.
  for (const [act, T, n] of p.opt) {
    if (act === 'kick') break;
    auto(s, T);
    if (act === 'pull') pull(s, T, n);
    else if (act === 'spot') spot(s, T, n);
    else if (act === 'secure') secure(s, T);
  }
  const step = p.opt.find(([a]) => a === 'kick');
  ok('engine is holding cars before the kick check', s.engine.length > 0, `holding ${s.engine.length}`);
  auto(s, step[1]);
  ok('kick is ALLOWED onto a tied-down backstop', canKick(s, step[1], step[2]).ok === true);
  s.secured[step[1]] = false;
  const r = canKick(s, step[1], step[2]);
  ok('kick is REFUSED onto an untied backstop, citing 113.4/113.5',
    r.ok === false && /tied down/.test(r.msg), r.msg);
}

// ── D. No authored par drifted when securement became an action ──
{
  const EXPECTED = {
    'p0-1': 5, 'p0-2': 5, 'p0-3': 5, 'p0-4': 7, 'p1-dig': 7, 'p1-sort': 19, 'p1-clear': 9,
    'p1-messy': 9, 'p2-list': 5, 'p2-kick': 3, 'p2-save': 4, 'p2-types': 6, 'p2-build': 7,
    'p4-loads': 3, 'p4-split': 5, 'p4-peel': 6, 'p5-long': 7, 'p5-room': 9, 'p6-road': 4,
  };
  const drift = PUZZLES.filter((p) => p.par !== EXPECTED[p.id]).map((p) => `${p.id}:${p.par}`);
  ok('no authored par changed', drift.length === 0, drift.join(', ') || '19/19 unchanged');
}

console.log('\n─── summary ───');
console.log(fails === 0 ? '✓ Securement behaves as a player action.' : `✗ ${fails} failure(s).`);
process.exit(fails === 0 ? 0 : 1);
