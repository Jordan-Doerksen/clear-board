// yard.js — Clear Board station wrapping the switch-list canvas sim.
//
// The 7 engine modules in ./yard/ WERE byte-for-byte copies of switch-list/src. That is no longer
// true: D-0029 made securement a player action, which required editing model.js, solver.js,
// render.js and puzzles.js. Divergence from switch-list is now deliberate and gated —
// tools/solve.mjs re-proves all 19 pars and tools/securement-check.mjs pins the new behaviour.
// Treat those files as OWNED here, not mirrored: don't re-sync them from switch-list.
//
// This file is the station adaptation:
// switch-list/src/main.js, wrapped in mount(root, ctx) with all DOM scoped to
// `root`, CSS scoped to `.yard-wrap`, and Clear Board hooks (profile/save,
// back button, reduced-motion, sound default). No top-level side effects.

import { W, H, NTRACK, TRACK_IDS, switchPos, engineRoute, ENGLEN, restS, carLen, LEAD_ROUTE, THROUGH_ROUTE, routeLength } from './yard/geometry.js';
import { freshState, lineSwitch, canPull, canSpot, canKick, canSecure, spotPlan, pull, spot, kick, secure, checkWin, unsecuredGoal, grade } from './yard/model.js';
import { render } from './yard/render.js';
import { play, setSpeed } from './yard/anim.js';
import { sfx, resume, toggleMute, isMuted } from './yard/sound.js';
import { PUZZLES, RULES, TIERS } from './yard/puzzles.js';
import './yard/yard.css';

// --- Clear Board: map the engine's rule chips → the content-library items a puzzle
// exercises, so a genuine win feeds the SAME switching/securement mastery the Drill grades
// (the "one brain"). Only chips with a real verified CROR ContentItem are listed; pure
// special-instruction chips (loads / order / verify) map to nothing and grade nothing.
const RULE_ITEMS = {
  line:     ['rule.104'],                  // CROR 104 — line & examine the route
  speed:    ['rule.105'],                  // CROR 105 — reduced yard speed
  couple:   ['rule.113.0', 'rule.113.2'],  // CROR 113.0/113.2 — knuckle open, stretch the joint
  shove:    ['rule.115'],                  // CROR 115 — shove only lined & protected
  secure:   ['rule.112'],                  // CROR 112 — secure the unattended cut
  kick:     ['rule.113.4', 'rule.113.5'],  // CROR 113.4/113.5 — where kicking is / isn't allowed
  kickable: ['rule.113.5'],                // the kickable-track special instruction lives under 113.5
};
function masteryItemsFor(puzzle) {
  const ids = new Set();
  for (const key of puzzle.rules || []) for (const id of (RULE_ITEMS[key] || [])) ids.add(id);
  return [...ids];
}

// The .wrap body contents from switch-list/index.html (header dropped — Clear
// Board has its own), with a Back button prepended, wrapped in .yard-wrap.
const YARD_HTML = `
  <div class="yard-wrap">
    <button class="back" data-go="">← Home</button>

    <div class="bar">
      <select id="picker" title="Pick a job"></select>
      <span class="spacer"></span>
      <div class="readout" id="readout">Moves 0 / par 0 · Joints 0</div>
    </div>

    <div class="workorder" id="workorder"></div>

    <div class="yardframe"><canvas id="yard"></canvas></div>

    <div class="bar">
      <select id="act" title="Action">
        <option value="pull">PULL</option>
        <option value="spot">SPOT</option>
        <option value="kick">KICK</option>
        <option value="secure">SECURE</option>
      </select>
      <select id="count" title="How many cars"></select>
      <span style="color:var(--dim)">cars</span>
      <select id="track" title="Which track"></select>
      <button class="go" id="work">Work it ▸</button>
      <button id="optimal" title="Auto-line and play the fewest-moves line in slow motion">▶ Watch optimal</button>
      <button id="depart" title="Depart the assembled outbound out the lead" style="display:none">Depart ▸</button>
      <span class="spacer"></span>
      <button id="reset">Reset</button>
      <button id="mute" title="Sound">🔊</button>
    </div>

    <div class="banner" id="msg"></div>

    <div class="legend">
      Rules in play —
      <span class="k">CROR</span> = the national rulebook (applies everywhere) ·
      <span class="s">S.I.</span> = a <em>special instruction</em>, specific to <em>this</em> yard — <strong>you must know your yard's.</strong>
    </div>
    <div class="rules" id="rules"></div>

    <div style="margin:10px 0 4px; padding:10px 13px; border-left:3px solid var(--si); background:var(--sibg); border-radius:6px; font-size:13px;">
      <strong style="color:var(--si)">What this trainer builds</strong> — the instinct to <strong>think several moves ahead</strong> and learn the <strong>switching routine</strong>: read the yard, line the road, call clean moves, win in the fewest. <span style="color:var(--dim)">The next level — out on the ground — is minimizing the actual distance you run and using the lead as working room. That's real-yard efficiency that comes with seat time, beyond what this tool scores.</span>
    </div>

    <details>
      <summary>How to play & why these rules</summary>
      <p><strong>You are the conductor, not the engineer.</strong> Click a switch target to line it
      (<span style="color:var(--si)">yellow</span> = lined into the track / diverging,
      <span style="color:var(--good)">green</span> = normal, straight up the ladder). Then call a move:</p>
      <ul>
        <li><strong>PULL n from a track</strong> — back in, couple the near (throat) cut, pull <code>n</code> cars onto the lead.</li>
        <li><strong>SPOT n to a track</strong> — shove <code>n</code> cars in and leave them.</li>
        <li><strong>KICK n to a track</strong> — shove and cut away; the cars coast in on their own with no coupling. Only where a special instruction allows it (<span style="color:var(--si)">⚡</span>), only onto a secured 2+ car cut, and only car types that can be kicked.</li>
      </ul>
      <p><strong>Score = fewest engine MOVES</strong> — beat or match <em>par</em>. A move is one run of the
      engine in one direction, so every change of direction counts: a <strong>PULL = 2</strong> (back in, pull
      out) and a <strong>SPOT = 2</strong> (shove in, pull out) — <em>except the spot that finishes the job is 1</em>,
      because the engine just leaves the cars and is done (no pull-out). A <strong>KICK = 1</strong> (one shove,
      the cars coast in by themselves). So <em>pull, pull, spot</em> = 5 moves, and kicking saves the pull-out.
      <strong>Joints</strong> (couplings) is a second, "also good" stat: lower is cleaner. To reach a
      track, line <em>its</em> switch reverse and the ones below it normal, or the engineer refuses
      (<strong>CROR 104</strong>).</p>
      <p><strong>Securing &amp; kicking.</strong> <strong>Rule 112</strong> — any car left unattended gets a hand brake.
      A <strong>KICK</strong> (Rule 113.5) needs a <em>secured</em> cut of at least two cars as a <em>backstop</em> to
      catch the rolling car — and a tank, autorack or centrebeam is never kicked. After coupling, the engineer
      <em>stretches</em> the joint to confirm the knuckles are locked before moving (<strong>Rule 113.2</strong>).</p>
    </details>
  </div>
`;

export function mount(root, ctx) {
  // Inject the scoped markup into the container Clear Board gave us.
  root.innerHTML = YARD_HTML;

  // Back button → Clear Board home.
  root.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => ctx.go(b.dataset.go)));

  // reduced motion: animations near-instant when the user's setting asks for it.
  const reduce = !!(ctx.settings && ctx.settings.reduce);
  const fast = () => reduce ? 6 : 1;          // setSpeed(6) ≈ instant; setSpeed(1) = normal

  // --- everything below is switch-list/src/main.js, scoped to `root` ----------
  const canvas = root.querySelector('#yard');
  const cctx = canvas.getContext('2d');
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = W * dpr; canvas.height = H * dpr; cctx.scale(dpr, dpr);

  let puzzle, state, anim = null, busy = false, fromDemo = false;
  let gen = 0, stopAnim = null;       // gen invalidates in-flight loops on (re)load; stopAnim aborts the live tween
  let ordered = true;                 // is the switch list verified? (true when there's no list to check)
  const flagged = new Set();          // indices the player has flagged as wrong
  let cine = null, cineCancel = null, cineTimer = null;   // inbound-arrival cinematic state

  const $ = (id) => root.querySelector('#' + id);

  function cancelCine() {
    if (cineCancel) cineCancel();
    if (cineTimer) clearTimeout(cineTimer);
    cineCancel = cineTimer = null; cine = null;
  }

  function load(p) {
    gen++;                              // invalidate any in-flight move / watch-optimal loop
    if (stopAnim) stopAnim();          // abort the live tween (mid-move, depart, etc.)
    stopAnim = null;
    cancelCine();
    puzzle = p; state = freshState(p); anim = null; busy = false; setSpeed(fast());
    ordered = !p.listed; flagged.clear();
    const dep = $('depart'); dep.style.display = p.goal.depart ? '' : 'none'; dep.disabled = true;
    renderRules(); renderOrder(); syncBuilder(); paint(); banner('', '');
    $('readout').textContent = `Moves 0 / par ${p.par} · Joints 0`;
    arrivalCinematic();
  }

  function paint() { render(cctx, state, puzzle, { anim, cine }); }

  // Inbound road train (only on `inbound` puzzles): in off the main, STOP, set out a
  // few cars onto the set-out track, then DEPART out the lead — your power is off-scene
  // the whole time. Self-finishes even if rAF is throttled, so the puzzle always
  // becomes playable (the cars are already on the track in the model).
  function arrivalCinematic() {
    cancelCine();
    if (!puzzle.inbound) { paint(); return; }
    const lenR = routeLength(THROUGH_ROUTE), stopS = lenR - 110;
    cine = { introS: -220, setoutCars: puzzle.inbound.cars, to: puzzle.inbound.to, phase: 'arrive', spotProg: 0 };
    const finish = () => { cancelCine(); paint(); };
    cineCancel = play([
      { dur: 2200, fn: (t) => { if (cine) { cine.phase = 'arrive'; cine.introS = -220 + (stopS + 220) * t; } } },   // arrive & stop
      { dur: 1100, fn: (t) => { if (cine) { cine.phase = 'setout'; cine.spotProg = t; } } },                        // spot the cars in
      { dur: 1700, fn: (t) => { if (cine) { cine.phase = 'depart'; cine.introS = stopS + (lenR + 420 - stopS) * t; } } }, // depart out the lead
    ], { onFrame: paint, onDone: finish });
    cineTimer = setTimeout(finish, 5800);
  }

  // --- input: line a switch by clicking its target -------------------------
  canvas.addEventListener('click', (e) => {
    if (busy || cine) return;
    resume();
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width * W, y = (e.clientY - r.top) / r.height * H;
    let best = -1, bd = 18;
    for (let i = 0; i < NTRACK; i++) {
      const s = switchPos(i), d = Math.hypot(s.x - x, s.y - y);
      if (d < bd) { bd = d; best = i; }
    }
    if (best >= 0) { lineSwitch(state, TRACK_IDS[best]); sfx.points(); paint(); }
  });

  // --- the move builder ----------------------------------------------------
  $('work').addEventListener('click', () => {
    resume();
    const kind = $('act').value, id = $('track').value, n = +$('count').value;
    doMove(kind, id, n);
  });
  $('optimal').addEventListener('click', () => { resume(); watchOptimal(); });
  $('depart').addEventListener('click', () => { resume(); departOut(); });
  $('reset').addEventListener('click', () => { if (!busy) load(puzzle); });
  $('mute').addEventListener('click', () => { $('mute').textContent = toggleMute() ? '🔇' : '🔊'; });

  // Full validation up front (lining + count + foul/clearance) so a fouling move is
  // refused before the engine ever moves.
  function precheck(kind, id, n) {
    if (kind === 'secure') return canSecure(state, id);
    return kind === 'pull' ? canPull(state, id, n) : kind === 'kick' ? canKick(state, id, n) : canSpot(state, id, n);
  }

  function animateMove(kind, id, n) {
    return new Promise((resolve) => {
      const i = TRACK_IDS.indexOf(id);
      const route = engineRoute(i);
      const sw = sSwitch(i);
      const heldLen = state.engine.reduce((a, c) => a + carLen(state.type[c]), 0);
      // where the cut's deepest car comes to rest on the track — the loco stops here,
      // never driving past it into standing cars.
      let coupleFar, shoveBase = null;
      if (kind === 'pull') {
        coupleFar = sw + state.pos[id][0];                       // the throat car's near edge
      } else {
        const plan = spotPlan(state, id, n);
        const deepCar = state.engine[state.engine.length - 1];   // deepest spotted car
        coupleFar = sw + plan.yourPos[plan.yourPos.length - 1] + carLen(state.type[deepCar]);
        if (plan.shove) shoveBase = { id, from: state.pos[id].slice(), to: plan.newStanding, oldThroat: state.pos[id][0] };
      }
      const engIn = coupleFar - ENGLEN / 2 - heldLen;
      const restStart = restS(heldLen);
      const cutFarStart = restStart + ENGLEN / 2 + heldLen;
      // the standing cut only starts moving once the loco's cut actually reaches it
      const contactF = shoveBase && coupleFar !== cutFarStart
        ? Math.min(0.92, Math.max(0, (sw + shoveBase.oldThroat - cutFarStart) / (coupleFar - cutFarStart)))
        : 0;
      const lerp = (a, b, t) => a + (b - a) * t;
      let cut = state.engine.slice();        // what the loco carries on the way in
      let committed = false, restEnd = restStart;
      const commitOnce = () => {
        if (committed) return;
        committed = true;
        const onto = kind === 'spot' && state.tracks[id].length > 0;
        (kind === 'pull' ? pull : kind === 'kick' ? kick : spot)(state, id, n);
        if (kind === 'kick') sfx.roll(); else if (kind === 'pull' || onto) sfx.couple(); else sfx.roll();
        cut = state.engine.slice();          // what it carries on the way out
        restEnd = restS(state.engine.reduce((a, c) => a + carLen(state.type[c]), 0));
      };
      const phases = [
        {
          dur: 600, fn: (t) => {
            const shove = shoveBase
              ? { id: shoveBase.id, from: shoveBase.from, to: shoveBase.to, prog: Math.min(1, Math.max(0, (t - contactF) / (1 - contactF))) }
              : null;
            anim = { route, engS: lerp(restStart, engIn, t), cut, shove };
          },
        },
      ];
      // CROR 113.2 — after coupling, the engineer STRETCHES the joint to confirm the knuckles
      // are locked before pulling. PULL only (you've just coupled on). A subtle tug toward the
      // lead to take up the slack, then settle — flavour, not a gate; the move is already committed.
      if (kind === 'pull') {
        phases.push({
          dur: 280, fn: (t) => {
            commitOnce();                                  // cars are now on the loco
            anim = { route, engS: engIn - 6 * Math.sin(t * Math.PI), cut, shove: null };
          },
        });
      }
      phases.push({
        dur: 600, fn: (t) => {
          commitOnce();
          anim = { route, engS: lerp(engIn, restEnd, t), cut, shove: null };
        },
      });
      const cancel = play(phases, { onFrame: paint, onDone: () => { stopAnim = null; anim = null; resolve(); } });
      stopAnim = () => { cancel(); resolve(); };          // load() can abort this move mid-flight
    });
  }

  function doMove(kind, id, n) {
    if (busy || cine) return;
    if (!ordered) { sfx.refuse(); banner('Verify the switch list first — flag the bad lines and certify the order.', 'bad'); return; }
    const chk = precheck(kind, id, n);
    if (!chk.ok) { sfx.refuse(); refusalBanner(chk.msg); return; }
    // SECURE is the conductor on the ground, not an engine leg — no animation, no move cost.
    if (kind === 'secure') { secure(state, id); sfx.points(); afterMove(); return; }
    busy = true;
    const g = gen;
    animateMove(kind, id, n).then(() => { if (gen !== g) return; busy = false; afterMove(); });
  }

  // Auto-line the ladder for the route to `id`: its switch reverse, all others normal.
  function autoLine(id) { for (const t of TRACK_IDS) state.lined[t] = (t === id) ? 'reverse' : 'normal'; }
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // ▶ Watch optimal — reset, then auto-line + play the fewest-moves line in slow-mo.
  async function watchOptimal() {
    if (busy || cine || !puzzle.opt) return;
    load(puzzle);
    const myGen = gen;                 // if the puzzle is switched mid-demo, bail out cleanly
    cancelCine();                      // skip the arrival cinematic for the demo
    if (!ordered) {                                   // auto-certify the list for the demo
      puzzle.listed.forEach((e, i) => { if (e.error) flagged.add(i); });
      ordered = true; renderOrder();
    }
    busy = true; setSpeed(reduce ? 6 : 1.7);
    banner(`▶ Watching the optimal line — par ${puzzle.par} move${puzzle.par === 1 ? '' : 's'}`, 'ok');
    for (const [act, trk, n] of puzzle.opt) {
      if (gen !== myGen) return;
      autoLine(trk); sfx.points(); paint(); await sleep(520);
      if (gen !== myGen) return;
      // SECURE has no engine movement to animate — show it as the beat it is.
      if (act === 'secure') { secure(state, trk); banner(state.msg, 'ok'); paint(); await sleep(420); }
      else await animateMove(act, trk, n);
      if (gen !== myGen) return;
      $('readout').textContent = `Moves ${state.moves} / par ${puzzle.par} · Joints ${state.joints}`;
      await sleep(320);
    }
    if (gen !== myGen) return;
    setSpeed(fast()); busy = false;
    fromDemo = true;                                                  // a watched line is not the player's win — don't grade mastery
    afterMove();
    if (puzzle.goal.depart && checkWin(state, puzzle)) departOut();   // finish the demo by departing
    fromDemo = false;
  }

  function afterMove() {
    $('readout').textContent = `Moves ${state.moves} / par ${puzzle.par} · Joints ${state.joints}`;
    banner(state.msg, 'ok');
    syncBuilder(); paint();
    const done = checkWin(state, puzzle);
    if (done && puzzle.goal.depart) {
      $('depart').disabled = false;                    // built in order — let them depart
      banner(`✓ Outbound built${puzzle.goal.ordered ? ' in order' : ''} — call Depart ▸ to leave.`, 'win');
    } else {
      $('depart').disabled = true;
      if (done) winBanner();
      else {
        // Built right but left loose. This is the one refusal that isn't a mistake in the work —
        // it's the step people forget, so name it plainly instead of just withholding the win.
        const loose = unsecuredGoal(state, puzzle);
        if (loose) refusalBanner(`The cars are where they belong, but ${loose} is standing loose — a cut left unattended gets hand brakes before you walk away (CROR 112). SECURE ${loose} to finish the job.`);
      }
    }
  }

  // Returns the PREVIOUS best for this puzzle (before this win is folded in), or null.
  function bestRecord() {
    const b = ctx.profile.yard && ctx.profile.yard.best;
    return (b && b[puzzle.id]) || null;
  }

  function recordWin() {
    if (!ctx.profile.yard) ctx.profile.yard = { completed: [], best: {} };
    if (!ctx.profile.yard.best) ctx.profile.yard.best = {};   // migrate a pre-D-0027 profile
    const y = ctx.profile.yard;
    let dirty = false;

    if (!y.completed.includes(puzzle.id)) {
      y.completed.push(puzzle.id); dirty = true;
      buildPicker();   // ✓ / → move as you play instead of going stale until the station re-mounts
    }

    // Per-puzzle best record (#14). A watched-optimal demo is NOT your record — it's the answer.
    if (!fromDemo) {
      const prev = y.best[puzzle.id];
      const now = {
        moves: state.moves, joints: state.joints,
        beatPar: state.moves <= puzzle.par, departed: !!puzzle.goal.depart,
      };
      // Fewer moves wins; joints break the tie. Never overwrite a better run with a worse one.
      const better = !prev || now.moves < prev.moves || (now.moves === prev.moves && now.joints < prev.joints);
      if (better) { y.best[puzzle.id] = now; dirty = true; }
    }

    if (dirty) ctx.save();

    // One brain: a genuine player win feeds the SAME rule mastery the Drill grades. Skipped
    // on a watched demo (fromDemo); AppContext only writes verified, currently-due items.
    if (!fromDemo && typeof ctx.recordYardWin === 'function') ctx.recordYardWin(masteryItemsFor(puzzle), true);
  }

  // "Beat your best" (#14): compare against the record BEFORE this win is folded in. A first
  // clear says nothing (there is no best yet) rather than claiming a record.
  function bestSuffix(prev) {
    if (fromDemo || !prev) return '';
    if (state.moves < prev.moves || (state.moves === prev.moves && state.joints < prev.joints)) {
      return ` · new best (was ${prev.moves}m/${prev.joints}j)`;
    }
    return ` · your best: ${prev.moves}m/${prev.joints}j`;
  }

  function winBanner() {
    const g = grade(state, puzzle);
    const prev = bestRecord();
    sfx.win();
    const clean = state.joints <= bestJoints() ? ` — ${g.bonus}, clean` : ` · ${g.bonus}`;
    banner(`${g.beatPar ? '✓ ' : ''}${g.head}${clean}${bestSuffix(prev)}`, g.beatPar ? 'win' : 'ok');
    recordWin();
  }

  // Depart — the deliberate final call once the outbound is assembled (P6). The
  // consist is already coupled to the loco; it leaves out the lead, off-frame.
  function departOut() {
    if (busy || !puzzle.goal.depart || !checkWin(state, puzzle)) return;
    const g = grade(state, puzzle);
    const prev = bestRecord();
    sfx.win();
    const clean = state.joints <= bestJoints() ? ` — ${g.bonus}, clean` : ` · ${g.bonus}`;
    banner(`✓ Departed out the lead — ${g.head}${clean}${bestSuffix(prev)}`, g.beatPar ? 'win' : 'ok');   // win registered now
    recordWin();
    $('depart').disabled = true;
    // flavor: pull the whole train out the lead, off-frame left
    busy = true;
    const cutLen = state.engine.reduce((a, c) => a + carLen(state.type[c]), 0);
    const startS = restS(cutLen), endS = -(cutLen + ENGLEN + 220);
    const cut = state.engine.slice();
    stopAnim = play([{ dur: 1300, fn: (t) => { anim = { route: LEAD_ROUTE, engS: startS + (endS - startS) * t, cut }; } }],
      { onFrame: paint, onDone: () => { stopAnim = null; anim = null; busy = false; paint(); } });
  }

  // The joint count of the solver-proven optimal line, baked into each puzzle by tools/solve.mjs
  // and asserted by the gate. This used to be `ceil(par/2)` — a guess that was wrong on 16 of 19
  // puzzles and always too generous (p2-build awarded "clean" at 4 joints when 2 is optimal).
  // Show nothing false: the badge now means what it says.
  function bestJoints() { return Math.max(1, puzzle.optJoints ?? Math.ceil(puzzle.par / 2)); }

  function syncBuilder() {
    // keep the count cap sensible for the chosen action
    const kind = $('act').value, id = $('track').value;
    const cntSel = $('count');
    // SECURE acts on the whole standing cut — a car count would be meaningless.
    cntSel.disabled = kind === 'secure';
    cntSel.style.opacity = kind === 'secure' ? '.45' : '';
    const max = kind === 'pull' ? (state.tracks[id]?.length || 1) : Math.max(1, state.engine.length);
    const cnt = cntSel; const cur = +cnt.value;
    cnt.innerHTML = '';
    for (let k = 1; k <= Math.max(1, max); k++) {
      const o = document.createElement('option'); o.value = k; o.textContent = k; cnt.appendChild(o);
    }
    cnt.value = Math.min(cur || 1, Math.max(1, max));
  }
  ['act', 'track'].forEach((id) => $(id).addEventListener('change', syncBuilder));

  function renderRules() {
    const box = $('rules'); box.innerHTML = '';
    for (const key of puzzle.rules) {
      const r = RULES[key]; if (!r) continue;
      const chip = document.createElement('div');
      chip.className = `chip ${r.kind}`;
      chip.innerHTML = `<b>${r.cite}</b><span>${r.label}</span>`;
      box.appendChild(chip);
    }
  }

  // Route the work-order panel: a normal order, the interactive switch-list check
  // (#7), or the verified/corrected order once certified.
  function renderOrder() {
    if (!puzzle.listed) { renderWorkOrder(); return; }
    if (ordered) { renderVerifiedOrder(); return; }

    const rows = puzzle.listed.map((e, i) =>
      `<div class="ord-row${flagged.has(i) ? ' flagged' : ''}" data-i="${i}">`
      + `<span class="ord-flag">${flagged.has(i) ? '⚑' : '▢'}</span>`
      + `<span class="ord-mark">${e.listedMark}</span><span class="ord-arrow">→</span><span class="ord-trk">${e.listedTrack}</span>`
      + `</div>`).join('');
    $('workorder').innerHTML =
      `<div class="wo-top"><span class="wo-tag si">SWITCH LIST</span> <span class="wo-id">${puzzle.id.toUpperCase()}</span> · the list can be wrong</div>`
      + `<div class="wo-job">Build <b>${puzzle.goal.track}</b> from these cars. Check each line against the yard — tap any that <b>don't match</b>, then certify.</div>`
      + `<div class="ord-list">${rows}</div>`
      + `<button class="go" id="certify">Certify order ▸</button>`
      + `<div class="wo-meta"><span class="wo-tip">${puzzle.hint}</span></div>`;
    $('workorder').querySelectorAll('.ord-row').forEach((row) => row.addEventListener('click', () => {
      const i = +row.dataset.i;
      if (flagged.has(i)) flagged.delete(i); else flagged.add(i);
      sfx.points(); renderOrder();
    }));
    $('certify').addEventListener('click', certify);
  }

  function certify() {
    resume();
    const errs = new Set(puzzle.listed.map((e, i) => (e.error ? i : -1)).filter((i) => i >= 0));
    const ok = flagged.size === errs.size && [...flagged].every((i) => errs.has(i));
    if (ok) {
      ordered = true; sfx.couple();
      renderOrder(); syncBuilder();
      banner(`✓ Order verified — now work the real cars onto ${puzzle.goal.track}.`, 'win');
      return;
    }
    sfx.refuse();
    const missed = [...errs].find((i) => !flagged.has(i));
    const over = [...flagged].find((i) => !errs.has(i));
    let why;
    if (missed != null) {
      const e = puzzle.listed[missed];
      why = e.error === 'location'
        ? `${e.listedTrack} has no ${e.listedMark} — that car isn't where the list says.`
        : `read ${e.listedTrack} again — the number on the ground isn't ${e.listedMark}.`;
    } else {
      const e = puzzle.listed[over];
      why = `${e.listedMark} on ${e.listedTrack} checks out — don't flag a good line.`;
    }
    banner(`Not so fast — ${why}`, 'bad');
  }

  function renderVerifiedOrder() {
    const g = puzzle.goal;
    const lines = puzzle.listed
      .map((e) => `<b>${e.trueMark}</b> → ${e.trueTrack}${e.error ? ' <span class="ord-fix">(list was wrong)</span>' : ''}`)
      .join(' · ');
    $('workorder').innerHTML =
      `<div class="wo-top"><span class="wo-tag">WORK ORDER ✓</span> <span class="wo-id">${g.track}</span> · verified</div>`
      + `<div class="wo-job">Build <b>${g.track}</b>: ${lines}.</div>`
      + `<div class="wo-meta">Target <b>${puzzle.par} move${puzzle.par === 1 ? '' : 's'}</b> (par) — fewest moves wins.</div>`;
  }

  // The job, stated like a switch list — derived from the puzzle goal.
  function renderWorkOrder() {
    const g = puzzle.goal;
    const src = {};
    for (const [trk, entries] of Object.entries(puzzle.start || {}))
      for (const e of entries) { const m = Array.isArray(e) ? e[0] : e; if (typeof m === 'string') src[m] = trk; }
    const from = [...new Set(g.cars.map((c) => src[c]).filter(Boolean))];
    const nums = g.cars.map((c) => c.split(' ').pop());
    const head = `<div class="wo-top"><span class="wo-tag">WORK ORDER</span> <span class="wo-id">${puzzle.id.toUpperCase()}</span> · ${puzzle.title}</div>`;
    const meta = `<div class="wo-meta">Target <b>${puzzle.par} move${puzzle.par === 1 ? '' : 's'}</b> (par) — fewest moves wins.<span class="wo-tip">${puzzle.hint}</span></div>`;
    const job = g.depart
      ? `<div class="wo-job">Build the outbound${g.ordered ? ' in order' : ''} — gather <b>${nums.join(' · ')}</b> onto your train${from.length ? ` <span class="wo-from">(set out on ${from.join(', ')})</span>` : ''}, then <b>Depart ▸</b>.</div>`
      : `<div class="wo-job">Build <b>${g.track}</b> — gather <b>${nums.join(' · ')}</b> onto it${from.length ? ` <span class="wo-from">(now on ${from.join(', ')})</span>` : ''}.</div>`;
    $('workorder').innerHTML = head + job + meta;
  }

  function banner(text, tone) {
    const el = $('msg');
    el.textContent = text || '';
    el.className = `banner ${tone || ''}`;
  }

  // A refused move is a teaching moment: keep the cited rule, add a one-tap link to its
  // plain-language Reference entry (cause → rule → correct action; REVAMP §6).
  function refusalBanner(msg) {
    const el = $('msg');
    el.className = 'banner bad';
    el.textContent = msg || '';
    const id = ruleItemFromMsg(msg);
    if (id && ctx && typeof ctx.go === 'function') {
      const b = document.createElement('button');
      b.className = 'lookup'; b.textContent = 'Look it up →';
      b.addEventListener('click', () => ctx.go(`reference?focus=${id}`));
      el.appendChild(b);
    }
  }
  // "…(CROR 113.4/113.5(a)(v))" → rule.113.4; special-instruction-only refusals have no CROR item.
  function ruleItemFromMsg(msg) {
    const m = /CROR\s+(\d+(?:\.\d+)?)/.exec(msg || '');
    return m ? `rule.${m[1]}` : null;
  }

  // arclength from the lead bumper to track i's switch, along its engine route
  function sSwitch(i) {
    const r = engineRoute(i);
    return Math.hypot(r[1].x - r[0].x, r[1].y - r[0].y) + Math.hypot(r[2].x - r[1].x, r[2].y - r[1].y);
  }

  // --- track dropdown (kept in sync with geometry) -------------------------
  const trackSel = $('track');
  TRACK_IDS.forEach((id) => { const o = document.createElement('option'); o.value = id; o.textContent = id; trackSel.appendChild(o); });

  // --- puzzle picker -------------------------------------------------------
  // Grouped by tier so the authored ramp is visible. It used to be a flat list of all 19, which
  // put par-19 'Build it in order' sixth, right after three par-5 warm-ups. Still a native
  // <select>: keyboard-complete and screen-reader-correct for free.
  //
  // ✓ = completed · → = recommended next (first uncompleted, in tier order). The arrow is a
  // MARKER, NOT A LOCK — every job stays selectable (REVAMP §3: soft gates, never lock content).
  const picker = $('picker');
  const completedIds = () => (ctx.profile && ctx.profile.yard && ctx.profile.yard.completed) || [];

  function buildPicker() {
    const completed = completedIds();
    const best = (ctx.profile && ctx.profile.yard && ctx.profile.yard.best) || {};
    const keep = picker.value;
    const ordered = TIERS.flatMap((t) => PUZZLES
      .map((p, k) => ({ p, k }))
      .filter((e) => e.p.tier === t.tier));
    const next = ordered.find((e) => !completed.includes(e.p.id));

    picker.innerHTML = '';
    for (const t of TIERS) {
      const inTier = ordered.filter((e) => e.p.tier === t.tier);
      if (!inTier.length) continue;                       // never render an empty group
      const g = document.createElement('optgroup');
      g.label = t.label;
      for (const { p, k } of inTier) {
        const mark = completed.includes(p.id) ? '✓ ' : (next && next.p.id === p.id ? '→ ' : '');
        const b = best[p.id];
        const yours = b ? ` · your best ${b.moves}m` : '';   // blank, never a guess, if unrecorded
        const o = document.createElement('option');
        o.value = k;
        o.textContent = `${mark}${p.title} · par ${p.par}${yours}`;
        g.appendChild(o);
      }
      picker.appendChild(g);
    }
    if (keep !== '') picker.value = keep;                 // a rebuild must not change the selection
  }

  buildPicker();
  picker.addEventListener('change', () => load(PUZZLES[+picker.value]));

  // sound default: start muted if Clear Board's audio setting is off.
  if (ctx.settings && !ctx.settings.audio && !isMuted()) toggleMute();
  $('mute').textContent = isMuted() ? '🔇' : '🔊';
  load(PUZZLES[0]);
}
