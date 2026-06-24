// yard.js — Clear Board station wrapping the switch-list canvas sim.
// The 7 engine modules in ./yard/ are BYTE-FOR-BYTE copies of switch-list/src
// (verified switching logic — do not edit). This file is the only adaptation:
// switch-list/src/main.js, wrapped in mount(root, ctx) with all DOM scoped to
// `root`, CSS scoped to `.yard-wrap`, and Clear Board hooks (profile/save,
// back button, reduced-motion, sound default). No top-level side effects.

import { W, H, NTRACK, TRACK_IDS, switchPos, engineRoute, ENGLEN, restS, carLen, LEAD_ROUTE, THROUGH_ROUTE, routeLength } from './yard/geometry.js';
import { freshState, lineSwitch, canPull, canSpot, canKick, spotPlan, pull, spot, kick, checkWin, grade } from './yard/model.js';
import { render } from './yard/render.js';
import { play, setSpeed } from './yard/anim.js';
import { sfx, resume, toggleMute, isMuted } from './yard/sound.js';
import { PUZZLES, RULES } from './yard/puzzles.js';

// Scoped CSS from switch-list/index.html — :root vars moved onto .yard-wrap and
// every selector prefixed with .yard-wrap so nothing leaks into Clear Board.
const YARD_CSS = `
  .yard-wrap {
    --bg: #0b0e12; --panel: #14181f; --panel2: #1b212a; --line: #2a313b;
    --ink: #e7ebf0; --dim: #8b94a0; --steel: #7d8794;
    --cror: #9cc3ff; --crorbg: #18243a; --si: #f2b134; --sibg: #2e2410;
    --good: #39b58a; --bad: #e2574c;
    background: radial-gradient(1200px 600px at 60% -10%, #161c25, var(--bg));
    color: var(--ink); font: 15px/1.5 system-ui, -apple-system, Segoe UI, sans-serif;
    display: block; padding: 4px 0 20px;
  }
  .yard-wrap * { box-sizing: border-box; }
  .yard-wrap button.back {
    font: 600 14px system-ui, sans-serif; color: var(--ink);
    background: var(--panel2); border: 1px solid var(--line); border-radius: 8px;
    padding: 8px 12px; cursor: pointer; margin-bottom: 10px;
  }
  .yard-wrap button.back:hover { border-color: #3a4554; }
  /* fit the reading column — no break-out inside Clear Board (it mispositioned + clipped) */
  .yard-wrap .yardframe {
    width: 100%; margin: 12px 0 14px; border: 1px solid var(--line); border-radius: 12px;
    background: #0f1216; overflow: hidden; box-shadow: 0 14px 50px rgba(0,0,0,.45);
  }
  .yard-wrap canvas#yard { display: block; width: 100%; height: auto; aspect-ratio: 1340 / 460; }
  .yard-wrap .workorder {
    margin-top: 10px; padding: 12px 16px; border-radius: 10px;
    background: linear-gradient(180deg, #171c24, #11151b);
    border: 1px solid var(--line); border-left: 4px solid #19b6d8;
  }
  .yard-wrap .wo-top { font: 700 11px ui-monospace, monospace; letter-spacing: .6px; color: var(--dim); }
  .yard-wrap .wo-tag { color: #19b6d8; } .yard-wrap .wo-id { color: var(--ink); }
  .yard-wrap .wo-job { font-size: 16px; margin-top: 5px; color: var(--ink); }
  .yard-wrap .wo-job b { color: #cfe8ff; }
  .yard-wrap .wo-from { color: var(--dim); font-weight: 600; font-size: 13px; }
  .yard-wrap .wo-meta { font-size: 12.5px; color: var(--dim); margin-top: 5px; }
  .yard-wrap .wo-tip { display: block; margin-top: 3px; color: #6f7884; font-style: italic; }
  .yard-wrap .ord-list { display: flex; flex-direction: column; gap: 6px; margin: 10px 0; }
  .yard-wrap .ord-row {
    display: flex; align-items: center; gap: 10px; padding: 8px 12px; cursor: pointer;
    border: 1px solid var(--line); border-radius: 8px; background: var(--panel2);
    font: 700 14px ui-monospace, monospace; user-select: none; max-width: 360px;
  }
  .yard-wrap .ord-row:hover { border-color: #3a4554; }
  .yard-wrap .ord-row.flagged { border-color: var(--si); background: var(--sibg); }
  .yard-wrap .ord-flag { font-size: 15px; width: 16px; color: var(--dim); }
  .yard-wrap .ord-row.flagged .ord-flag { color: var(--si); }
  .yard-wrap .ord-mark { color: var(--ink); } .yard-wrap .ord-arrow { color: var(--dim); } .yard-wrap .ord-trk { color: var(--cror); }
  .yard-wrap .ord-fix { color: var(--si); font-size: 11px; font-style: italic; }
  .yard-wrap #certify { margin: 4px 0 2px; }
  .yard-wrap .bar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
  .yard-wrap .readout {
    font: 700 16px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
    background: var(--panel2); border: 1px solid var(--line); border-radius: 8px;
    padding: 10px 14px; color: var(--ink);
  }
  .yard-wrap select, .yard-wrap button {
    font: 600 14px system-ui, sans-serif; color: var(--ink);
    background: var(--panel2); border: 1px solid var(--line); border-radius: 8px;
    padding: 9px 12px; cursor: pointer;
  }
  .yard-wrap button.go { background: #1d4ed8; border-color: #2c5bdc; }
  .yard-wrap button.go:hover { background: #2356e6; }
  .yard-wrap button#optimal { background: #14313a; border-color: #1d5563; color: #aee9f6; }
  .yard-wrap button#optimal:hover { background: #1a3d48; }
  .yard-wrap button#depart { background: #1f4a3c; border-color: #2a6b54; color: #bdf0db; }
  .yard-wrap button#depart:hover { background: #245741; }
  .yard-wrap button#depart:disabled { opacity: .4; cursor: default; }
  .yard-wrap button:hover { border-color: #3a4554; }
  .yard-wrap .spacer { flex: 1; }
  .yard-wrap .banner {
    min-height: 22px; margin: 12px 0; padding: 10px 14px; border-radius: 8px;
    background: var(--panel); border: 1px solid var(--line); color: var(--dim); font-weight: 600;
  }
  .yard-wrap .banner.ok { color: var(--ink); }
  .yard-wrap .banner.bad { color: var(--bad); border-color: #4a2723; background: #1d1413; }
  .yard-wrap .banner.win { color: var(--good); border-color: #1f4a3c; background: #102019; }
  .yard-wrap .legend { color: var(--dim); font-size: 12.5px; margin: 6px 0 2px; }
  .yard-wrap .legend .k { color: var(--cror); font-weight: 700; }
  .yard-wrap .legend .s { color: var(--si); font-weight: 700; }
  .yard-wrap .rules { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; }
  .yard-wrap .chip {
    display: flex; flex-direction: column; gap: 2px; padding: 8px 12px;
    border-radius: 8px; border: 1px solid var(--line); background: var(--panel); min-width: 150px;
  }
  .yard-wrap .chip b { font: 700 12px ui-monospace, monospace; }
  .yard-wrap .chip span { font-size: 12.5px; color: var(--dim); }
  .yard-wrap .chip.cror { border-left: 3px solid var(--cror); } .yard-wrap .chip.cror b { color: var(--cror); }
  .yard-wrap .chip.si { border-left: 3px solid var(--si); background: var(--sibg); } .yard-wrap .chip.si b { color: var(--si); }
  .yard-wrap details { margin-top: 18px; color: var(--dim); font-size: 13px; }
  .yard-wrap details summary { cursor: pointer; color: var(--ink); font-weight: 600; }
  .yard-wrap code { background: var(--panel2); padding: 1px 5px; border-radius: 4px; font-size: 12.5px; }
`;

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
  // CSS once — guard with an id so re-mounting (navigate away & back) doesn't duplicate it.
  if (!document.getElementById('yard-style')) {
    const st = document.createElement('style');
    st.id = 'yard-style';
    st.textContent = YARD_CSS;
    document.head.appendChild(st);
  }
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

  let puzzle, state, anim = null, busy = false, watching = false;
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
    puzzle = p; state = freshState(p); anim = null; busy = false; watching = false; setSpeed(fast());
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
    if (!chk.ok) { sfx.refuse(); banner(chk.msg, 'bad'); return; }
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
    busy = true; watching = true; setSpeed(reduce ? 6 : 1.7);
    banner(`▶ Watching the optimal line — par ${puzzle.par} move${puzzle.par === 1 ? '' : 's'}`, 'ok');
    for (const [act, trk, n] of puzzle.opt) {
      if (gen !== myGen) return;
      autoLine(trk); sfx.points(); paint(); await sleep(520);
      if (gen !== myGen) return;
      await animateMove(act, trk, n);
      if (gen !== myGen) return;
      $('readout').textContent = `Moves ${state.moves} / par ${puzzle.par} · Joints ${state.joints}`;
      await sleep(320);
    }
    if (gen !== myGen) return;
    setSpeed(fast()); busy = false; watching = false;
    afterMove();
    if (puzzle.goal.depart && checkWin(state, puzzle)) departOut();   // finish the demo by departing
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
    }
  }

  function recordWin() {
    if (!ctx.profile.yard) ctx.profile.yard = { completed: [] };
    if (!ctx.profile.yard.completed.includes(puzzle.id)) { ctx.profile.yard.completed.push(puzzle.id); ctx.save(); }
  }

  function winBanner() {
    const g = grade(state, puzzle);
    sfx.win();
    const clean = state.joints <= bestJoints() ? ` — ${g.bonus}, clean` : ` · ${g.bonus}`;
    banner(`${g.beatPar ? '✓ ' : ''}${g.head}${clean}`, g.beatPar ? 'win' : 'ok');
    recordWin();
  }

  // Depart — the deliberate final call once the outbound is assembled (P6). The
  // consist is already coupled to the loco; it leaves out the lead, off-frame.
  function departOut() {
    if (busy || !puzzle.goal.depart || !checkWin(state, puzzle)) return;
    const g = grade(state, puzzle);
    sfx.win();
    const clean = state.joints <= bestJoints() ? ` — ${g.bonus}, clean` : ` · ${g.bonus}`;
    banner(`✓ Departed out the lead — ${g.head}${clean}`, g.beatPar ? 'win' : 'ok');   // win registered now
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

  // rough "clean" benchmark until the solver owns it
  function bestJoints() { return Math.max(1, Math.ceil(puzzle.par / 2)); }

  function syncBuilder() {
    // keep the count cap sensible for the chosen action
    const kind = $('act').value, id = $('track').value;
    const max = kind === 'pull' ? (state.tracks[id]?.length || 1) : Math.max(1, state.engine.length);
    const cnt = $('count'); const cur = +cnt.value;
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
      const i = +row.dataset.i; flagged.has(i) ? flagged.delete(i) : flagged.add(i); sfx.points(); renderOrder();
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

  // arclength from the lead bumper to track i's switch, along its engine route
  function sSwitch(i) {
    const r = engineRoute(i);
    return Math.hypot(r[1].x - r[0].x, r[1].y - r[0].y) + Math.hypot(r[2].x - r[1].x, r[2].y - r[1].y);
  }

  // --- track dropdown (kept in sync with geometry) -------------------------
  const trackSel = $('track');
  TRACK_IDS.forEach((id) => { const o = document.createElement('option'); o.value = id; o.textContent = id; trackSel.appendChild(o); });

  // --- puzzle picker -------------------------------------------------------
  const picker = $('picker');
  PUZZLES.forEach((p, k) => {
    const o = document.createElement('option'); o.value = k; o.textContent = `${k + 1}. ${p.title}`;
    picker.appendChild(o);
  });
  picker.addEventListener('change', () => load(PUZZLES[+picker.value]));

  // sound default: start muted if Clear Board's audio setting is off.
  if (ctx.settings && !ctx.settings.audio && !isMuted()) toggleMute();
  $('mute').textContent = isMuted() ? '🔇' : '🔊';
  load(PUZZLES[0]);
}
