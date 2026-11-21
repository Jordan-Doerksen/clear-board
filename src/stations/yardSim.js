// yardSim.js — the controller of the Yard station.
//
// It holds the game state, the move logic, the records, the sound calls and the event wiring.
// It exports mount(root, ctx) and unmount(), and nothing else. It works with these files in ./yard/:
//   view.ts            each markup string, each class name and each DOM write of the chrome
//   yard.css           the style of the chrome
//   draw.ts            the drawing: the picture, the hit test of a click and the one draw call
//   access.ts          the access layer: the six switch buttons, the text mirror, the status region
//   anim.js, sound.js  the tween driver and the sounds
//   model.js, puzzles.js, geometry.js, solver.js
//                      the engine. These four modules are frozen: no job edits them. This file
//                      imports the first three. tools/solve.mjs uses solver.js to prove each par.
//
// Two seam rules. This file holds no class name, no markup string and no inline style: it reaches
// an element by its id or through a view function. This file draws only through the drawing
// object: it does not import render.js.
//
// This file runs no statement of its own when it is imported. Its imports have one effect: the two
// style files go into the page (yard.css, and drawing/drawing.css through draw.ts). The station
// wrapper (Yard.tsx) also imports yard.css, so the build puts that file in the sheet of the app.

import { TRACK_IDS, engineRoute, ENGLEN, restS, carLen, LEAD_ROUTE, THROUGH_ROUTE, routeLength } from './yard/geometry.js';
import { freshState, lineSwitch, routeReady, canPull, canSpot, canKick, canSecure, spotPlan, pull, spot, kick, secure, checkWin, unsecuredGoal, grade } from './yard/model.js';
import { play, readTime } from './yard/anim.js';
import { sfx, resume, toggleMute, loadMuted, stopAll } from './yard/sound.js';
import { PUZZLES, RULES, TIERS } from './yard/puzzles.js';
import './yard/yard.css';
import { createView } from './yard/view.ts';
import { createDrawing } from './yard/draw.ts';
import { createMirror, createLive, createSwitchButtons, routeWords, goalOf } from './yard/access.ts';

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

// The teardown of the Yard that is mounted now, or null (UNMOUNT, 2c-plan C2).
let teardown = null;

// Stops each timer, each animation frame, each loop, each listener and each sound of the mounted
// Yard: also the notes of the win melody that sound.js has timed and not played yet (SOUND-STOP).
// The bridge calls it before it empties the host. A second call does nothing.
export function unmount() {
  if (!teardown) return;
  const stop = teardown;
  teardown = null;
  stop();
}

export function mount(root, ctx) {
  unmount();                          // one Yard at a time
  // The view puts the scoped markup into the container Clear Board gave us. The way back to Home and
  // the heading are drawn by the station wrapper (Yard.tsx).
  const view = createView(root);

  // Reduced motion (P-01, MOTION-STOP-OWNER). The setting is read at the time of each effect, not at
  // mount, so that a change in Settings acts on the next effect (2c-plan C4: the app sets the value).
  // With it on, each move, kick, arrival, departure and watched step ends at once: play() runs each
  // step one time with its end value, and the end state is painted with its words and the trace of
  // the last move. No effect is slower. With it off, each effect keeps its times.
  const still = () => !!(ctx.settings && ctx.settings.reduce);

  // The drawing adapter makes the picture inside the frame that the view gives.
  const drawing = createDrawing(view.drawHost, { onPick });
  // The access layer (P-03): the text mirror of the yard, and the one status region. The region says
  // the result of each move and the words of each refusal, with the words of the banner as they are.
  const mirror = createMirror(view.el('yard-mirror'));
  const live = createLive(view.el('yard-live'));
  // The six switch buttons (P-02): a press, Enter or Space throws the switch through onPick, the path
  // of a click on the picture. The buttons move with each layout of the picture.
  const switches = createSwitchButtons(drawing, view.drawHost, TRACK_IDS, onPick);

  let puzzle, state, anim = null;
  // watched: the state of this job came from the optimal line. saved: a win of this run is in the
  // profile. (U-12: the Yard asks before it discards a run.)
  let watched = false, saved = false;
  let gen = 0;                        // gen invalidates the answers and the pauses of an earlier load
  // The effect that runs now (a move, the departure, a step of the watched line), or null. Its handle
  // ends it at once at its end state (finish) or stops it with no end (cancel).
  let effect = null;
  // The watched line (R7-P8), or null: see startDemo().
  let demo = null;
  // After Depart the train has left (R7-P14, F6): the lead shows empty, and the job is closed until
  // Reset or another job. model.js holds no such state, so the controller holds the flag.
  let departed = false;
  // The state before the last move, a copy: the picture draws the trace of that move from it
  // (R7-P15). null after an action that ends the trace (a throw, a secure, the arrival, a load).
  let lastFrom = null;
  // The move log (R7-P10): one entry for each call of the run. `past` is set while the picture shows a
  // past state of the run (see showPast); `pastState` is the copy that it shows then.
  let log = [];
  let past = null;
  const pastState = {};
  let ordered = true;                 // is the switch list verified? (true when there's no list to check)
  const flagged = new Set();          // indices the player has flagged as wrong
  let cine = null;                    // a frame of the arrival of the inbound train, or null
  // The refusal on the banner when it is about the lining of the route: the track of the call and the
  // text of the model, or null (R7-P16). A throw of a switch clears it when it is no longer true.
  let refusal = null;

  const $ = (id) => view.el(id);

  // `say` is true when the learner asked for the load (a new job, Reset): the region then says the
  // job and the readout at its start.
  function load(p, say = false) {
    gen++;                              // invalidate the answers and the pauses of an earlier load
    cancelEffect();                     // stop a move, the departure, the arrival or a step of the watched line
    clearPauses();
    cine = null;
    puzzle = p; state = freshState(p); anim = null;
    watched = false; saved = false; demo = null; departed = false; view.setDemo(null);
    lastFrom = null; log = []; past = null; view.setViewLabel(null); renderLog();
    ordered = !p.listed; flagged.clear();
    view.setDepart({ shown: !!p.goal.depart, enabled: false });
    // U-16: the move builder starts on a track of the job, the first track that holds a car of the goal.
    const goalCars = new Set(p.goal.cars);
    const startTrack = TRACK_IDS.find((t) => state.tracks[t].some((m) => goalCars.has(m)));
    if (startTrack) $('track').value = startTrack;
    renderRules(); renderOrder(); syncBuilder(); paint(); banner('', '');
    const readout = view.setReadout({ moves: 0, par: p.par, joints: 0 });
    if (say) live.say(`${p.title}. ${readout}.`);
  }

  // The mirror and the names of the switch buttons state the model at each paint with no motion frame.
  // After the departure the picture shows the lead empty (the motion of the departure draws the train).
  // The picture shows the yard now, or a past state of the move log (a copy). The job of each paint is
  // `gen`, so a copy keeps the form of the job; `from` gives the trace of the last move.
  // With no motion, the yard now shows where the spot or the kick of the move builder lands (LANDING).
  function paint() {
    if (past) drawing.paint(pastState, puzzle, { anim, cine: null, job: gen, from: past.from });
    else {
      const atRest = !anim && !cine;
      const builder = atRest && !demo && !departed ? { act: $('act').value, n: +$('count').value, track: $('track').value } : undefined;
      drawing.paint(state, puzzle, { anim, cine, job: gen, from: lastFrom, departed: departed && !anim, builder });
    }
    if (!anim && !cine) {
      mirror.update(state, puzzle, { departed }); switches.setLining(state.lined);
      view.setArrival(canArrive());
      // The head bar says the route and the goal of the state that the picture shows.
      const shown = past ? pastState : state;
      view.setYardHead({ route: routeWords(shown.lined), goal: goalOf(shown, puzzle) });
    }
  }

  // The arrival of the inbound train (R7-P5, F9), only on a job with an inbound train and only on
  // request, from the control in the work order: nothing starts by itself. The train comes in off the
  // main, stops, sets out its cars onto their track, and leaves out the lead; your engine is off the
  // picture the whole time. The set-out cars stand on their track in the model from the start of the
  // job, so the arrival is a picture only, and a new input ends it at the yard that it sets out
  // (R7-P11). With reduced motion the request shows that end state at once. The picture of the set-out
  // stays as it was (SME note S5).
  // While it plays, the banner and the region say "Wait for the train." (U-39); at its end they say
  // that the road train has left.
  function showArrival() {
    if (!canArrive()) return;
    settle();
    lastFrom = null;
    const quiet = still();
    if (!quiet) { const text = 'Wait for the train.'; banner(text, 'ok'); live.say(text); }
    const lenR = routeLength(THROUGH_ROUTE), stopS = lenR - 110;
    cine = { introS: -220, setoutCars: puzzle.inbound.cars, to: puzzle.inbound.to, phase: 'arrive', spotProg: 0 };
    run([
      { dur: 2200, fn: (t) => { cine.phase = 'arrive'; cine.introS = -220 + (stopS + 220) * t; } },                    // arrive & stop
      { dur: 1100, fn: (t) => { cine.phase = 'setout'; cine.spotProg = t; } },                                         // spot the cars in
      { dur: 1700, fn: (t) => { cine.phase = 'depart'; cine.introS = stopS + (lenR + 420 - stopS) * t; } },            // depart out the lead
    ], quiet, () => {
      cine = null; paint();
      const text = 'The road train has left out the lead.';
      banner(text, 'ok'); live.say(text);
    });
  }
  // The arrival is offered while the yard is as the job starts: no move, and each switch lined normal
  // as the train passes the ladder. In another state the picture of the arrival would be false.
  function canArrive() {
    return !!puzzle.inbound && !demo && !departed && state.moves === 0 && TRACK_IDS.every((t) => state.lined[t] === 'normal');
  }
  view.onArrival(() => { resume(); showArrival(); });

  // --- input: line a switch by clicking its target -------------------------
  // The drawing adapter calls this for each click on the drawing: with the track id of the
  // switch that was hit, or with null. A click that hits no switch still resumes the sound.
  // A switch button calls it with its track id.
  function onPick(id) {
    resume();
    if (id === null) return;
    settle();
    // During the watched line the switches belong to the demonstration (R7-P8). After the departure
    // the job is closed (R7-P14).
    if (demo) { demoRefusal(); return; }
    if (departed) { closedRefusal(); return; }
    lineSwitch(state, id); sfx.points(); lastFrom = null; paint();
    // R7-P16, F8: a refusal about the lining of the route goes when the throw makes its text false. The
    // model checks the same call again; a refusal of another kind stays.
    if (refusal) {
      const r = routeReady(state, refusal.id);
      if (r.ok || r.msg !== refusal.msg) banner('', '');
    }
    live.say(`${id} switch, lined ${state.lined[id]}. Route: ${routeWords(state.lined)}.`);
  }

  // --- the move builder ----------------------------------------------------
  $('work').addEventListener('click', () => {
    resume();
    settle();
    const kind = $('act').value, id = $('track').value, n = +$('count').value;
    doMove(kind, id, n);
  });
  // "Watch optimal" opens the watched line; while it shows, the same button reads "Stop watching" and
  // loads the job again at its start (U-12, A11Y-29). Before the line discards moves of the learner,
  // the Yard asks; No keeps the moves.
  $('optimal').addEventListener('click', () => {
    resume();
    if (demo) { load(puzzle, true); return; }
    settle();
    if (!puzzle.opt) return;
    if (!atRisk()) { startDemo(); return; }
    const g = gen;
    view.ask(`Watch the optimal line? You lose your ${movesWords()} on this job.`, (yes) => { if (yes && gen === g) startDemo(); });
  });
  view.bindDemo({ back: demoBack, next: demoNext, play: demoPlay });
  $('depart').addEventListener('click', () => { resume(); settle(); departOut(); });
  $('reset').addEventListener('click', () => { settle(); load(puzzle, true); });
  $('mute').addEventListener('click', () => { resume(); view.setMuted(toggleMute()); });

  // Full validation up front (lining + count + foul/clearance) so a fouling move is
  // refused before the engine ever moves.
  function precheck(kind, id, n) {
    if (kind === 'secure') return canSecure(state, id);
    return kind === 'pull' ? canPull(state, id, n) : kind === 'kick' ? canKick(state, id, n) : canSpot(state, id, n);
  }

  // Runs the steps of one effect, with the frames painted. The effect stays in `effect` until it ends.
  // `onEnd` runs when the end state shows: after the last frame, or at once when the effect is ended
  // by finishEffect().
  function run(steps, quiet, onEnd) {
    const me = { finish() {}, cancel() {} };
    effect = me;
    const h = play(steps, { onFrame: paint, still: quiet, onDone: () => { if (effect === me) effect = null; onEnd(); } });
    me.finish = h.finish; me.cancel = h.cancel;
  }
  // Ends the effect that runs now at its end state (its end runs in this call), or stops it with no end.
  function finishEffect() { const e = effect; effect = null; if (e) e.finish(); }
  function cancelEffect() { const e = effect; effect = null; if (e) e.cancel(); anim = null; }
  // Nothing locks during motion (R7-P11, F4). Each input that acts on the yard calls this first: the
  // running effect (a move, the departure, the arrival, a step of the watched line) ends at its end
  // state, and "Play all" of the watched line stops. Then the input runs on that state.
  function settle() {
    stopPlay();
    ending = true; finishEffect(); ending = false;
    endPast(false);
  }
  let ending = false;                 // true while settle() ends an effect: a film of the log then says nothing

  // One move of the engine on the state `st`. `quiet` is the reduced-motion value that the caller read
  // for this move: each step of the move then runs one time at its end value, in this call. Each step
  // still runs, because the step after the run in commits the move to the model (commitOnce). `onEnd`
  // runs when the end state shows.
  function animateMove(st, kind, id, n, quiet, onEnd) {
    const i = TRACK_IDS.indexOf(id);
    const route = engineRoute(i);
    const sw = sSwitch(i);
    const heldLen = st.engine.reduce((a, c) => a + carLen(st.type[c]), 0);
    // where the cut's deepest car comes to rest on the track — the loco stops here,
    // never driving past it into standing cars.
    let coupleFar, shoveBase = null;
    if (kind === 'pull') {
      coupleFar = sw + st.pos[id][0];                          // the throat car's near edge
    } else {
      const plan = spotPlan(st, id, n);
      const deepCar = st.engine[st.engine.length - 1];         // deepest spotted car
      coupleFar = sw + plan.yourPos[plan.yourPos.length - 1] + carLen(st.type[deepCar]);
      if (plan.shove) shoveBase = { id, from: st.pos[id].slice(), to: plan.newStanding, oldThroat: st.pos[id][0] };
    }
    const engIn = coupleFar - ENGLEN / 2 - heldLen;
    const restStart = restS(heldLen);
    const cutFarStart = restStart + ENGLEN / 2 + heldLen;
    // the standing cut only starts moving once the loco's cut actually reaches it
    const contactF = shoveBase && coupleFar !== cutFarStart
      ? Math.min(0.92, Math.max(0, (sw + shoveBase.oldThroat - cutFarStart) / (coupleFar - cutFarStart)))
      : 0;
    const lerp = (a, b, t) => a + (b - a) * t;
    let cut = st.engine.slice();           // what the loco carries on the way in
    let committed = false, restEnd = restStart;
    const commitOnce = () => {
      if (committed) return;
      committed = true;
      const onto = kind === 'spot' && st.tracks[id].length > 0;
      MOVES[kind](st, id, n);
      if (kind === 'kick') sfx.roll(); else if (kind === 'pull' || onto) sfx.couple(); else sfx.roll();
      cut = st.engine.slice();             // what it carries on the way out
      restEnd = restS(st.engine.reduce((a, c) => a + carLen(st.type[c]), 0));
    };
    // The legs carry their role (LEG-ROLE): anim.js gives the run in and the run out their times.
    const phases = [
      {
        role: 'in', fn: (t) => {
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
      role: 'out', fn: (t) => {
        commitOnce();
        anim = { route, engS: lerp(engIn, restEnd, t), cut, shove: null };
      },
    });
    run(phases, quiet, () => { anim = null; onEnd(); });
  }
  const MOVES = { pull, spot, kick };

  // A call of the learner. The result shows at the start of the effect (R7-P11, R7 section 6 rule 4):
  // the model runs on a copy of the state, and the banner, the counters, the Depart control and the
  // region say the result of that copy. The motion follows; the model commits the move to the state of
  // the game at the contact, as before, and the end state shows when the motion ends or when a new
  // input ends it. The win sound plays when the end state shows.
  function doMove(kind, id, n) {
    if (departed) { closedRefusal(); return; }
    if (!ordered) {
      const text = 'Verify the switch list first — flag the bad lines and certify the order.';
      sfx.refuse(); banner(text, 'bad'); live.say(text); return;
    }
    const chk = precheck(kind, id, n);
    if (!chk.ok) {
      sfx.refuse(); refusalBanner(chk.msg);
      // Keep the call when its refusal is about the lining of the route (routeReady of the model).
      const r = kind === 'secure' ? null : routeReady(state, id);
      if (r && !r.ok && r.msg === chk.msg) refusal = { id, msg: chk.msg };
      return;
    }
    const before = structuredClone(state);
    // SECURE is the conductor on the ground, not an engine leg — no animation, no move cost.
    if (kind === 'secure') {
      secure(state, id); sfx.confirm();
      lastFrom = null;
      addLog(kind, id, n, before, state);
      const won = announce(state, costWords(kind, before, state));
      syncBuilder(); paint();
      if (won) sfx.win();
      return;
    }
    const after = structuredClone(state);
    MOVES[kind](after, id, n);
    lastFrom = before;
    addLog(kind, id, n, before, after);
    const won = announce(after, costWords(kind, before, after));
    animateMove(state, kind, id, n, still(), () => { syncBuilder(); paint(); if (won) sfx.win(); });
  }

  // The moves of the learner on this job are at risk: a change of job or the watched line would
  // discard them. Moves of the watched line and a run with a saved win are not at risk.
  function atRisk() { return state.moves > 0 && !watched && !saved; }
  const movesWords = () => `${state.moves} move${state.moves === 1 ? '' : 's'}`;

  // Auto-line the ladder for the route to `id`: its switch reverse, all others normal.
  function autoLine(id) { for (const t of TRACK_IDS) state.lined[t] = (t === id) ? 'reverse' : 'normal'; }
  // A pause between two steps of "Play all". A load, a stop and the teardown clear each pause that has
  // not ended.
  const pauses = new Set();
  function later(ms, fn) {
    const t = setTimeout(() => { pauses.delete(t); fn(); }, ms);
    pauses.add(t);
  }
  function clearPauses() { for (const t of pauses) clearTimeout(t); pauses.clear(); }
  // The state `st` takes the values of the copy `copy`; the copy does not change (a step back of the
  // watched line works on the copies of its steps).
  function restore(st, copy) {
    const c = structuredClone(copy);
    for (const k of Object.keys(st)) if (!(k in c)) delete st[k];
    Object.assign(st, c);
  }
  // A call in words, in the form of the help text: PULL 3 from AS73, SPOT 6 to AS75, SECURE AS75.
  function callWords(act, trk, n) {
    return act === 'secure' ? `SECURE ${trk}` : `${act.toUpperCase()} ${n} ${act === 'pull' ? 'from' : 'to'} ${trk}`;
  }
  // The cost of a call in words (R7-P12, F7): the change of the two counters, from the states before
  // and after the call. model.js charges a move of the engine in legs: a pull is back in and pull out
  // (2), a spot is the shove in (1) and leaves its pull-out to the next time the engine moves, a kick
  // is one shove (1), a secure moves no engine (0). The next move after a spot pays that pull-out
  // (+1): the words name it, so that the cost has a visible cause. The SME checks these words.
  function costWords(act, before, after) {
    const m = after.moves - before.moves, j = after.joints - before.joints;
    const counts = (legs) => `+${m} move${m === 1 ? '' : 's'}${legs ? ` (${legs})` : ''}, +${j} coupling${j === 1 ? '' : 's'}.`;
    if (act === 'secure') return counts('');
    const late = before.out ? '' : 'the pull-out of your last spot, then ';
    const legs = act === 'pull' ? (late ? `${late}back in and pull out` : 'back in, pull out') : act === 'spot' ? `${late}shove in` : `${late}one shove`;
    const tail = act === 'spot' ? ' The pull-out of this spot counts the next time the engine moves.' : '';
    return counts(legs) + tail;
  }

  // ---- The watched line (R7-P8, U-04) -------------------------------------------------------------
  // A stepper over the optimal line of the job. It replaces the run of the learner (the Yard asks
  // first, U-12). Next plays the next step with the times of a move of the learner; Back shows the
  // state after the step before; "Play all" plays the rest in turn, and Stop ends it. Each step lines
  // the switches for the learner, as the film of the line did before. The words, the counters and the
  // region say each step at its start. A step back works on copies: `post[k]` is the state after step
  // k, and `pre[k]` the state before step k with its lining. A watched line gets no done mark and no
  // win sound: it never reaches recordWin().
  function startDemo() {
    load(puzzle);
    watched = true;
    if (!ordered) {                    // the line starts with the switch list certified
      puzzle.listed.forEach((e, i) => { if (e.error) flagged.add(i); });
      ordered = true; renderOrder();
    }
    demo = { line: puzzle.opt, at: 0, pre: [null], post: [structuredClone(state)], playing: false };
    const text = `▶ Watching the optimal line — par ${puzzle.par} move${puzzle.par === 1 ? '' : 's'}`;
    showDemo();
    banner(text, 'ok');
    live.say(`${text}. ${demoWords(0)}`);
  }

  function showDemo() { view.setDemo({ steps: demo.line.map(([a, t, n]) => callWords(a, t, n)), at: demo.at, playing: demo.playing }); }

  // The words of the state after step k.
  function demoWords(k) {
    const N = demo.line.length;
    if (k === 0) return `Step 0 of ${N}: the yard at the start of the job.`;
    const [act, trk, n] = demo.line[k - 1];
    const end = k === N ? ' The demonstration is over. A watched line gets no done mark.' : '';
    return `Step ${k} of ${N}: ${callWords(act, trk, n)}. ${demo.post[k].msg} ${costWords(act, demo.post[k - 1], demo.post[k])}${end}`;
  }

  // The banner, the counters and the region say step k.
  function sayStep(k) {
    const st = demo.post[k];
    const readout = view.setReadout({ moves: st.moves, par: puzzle.par, joints: st.joints });
    const text = demoWords(k);
    banner(text, 'ok');
    live.say(`${text} ${readout}.`);
    showDemo();
  }

  // Plays the next step. Its end state is known at its start (the model on a copy), so the words come
  // first and the motion follows.
  function demoStep() {
    const k = demo.at + 1;
    const [act, trk, n] = demo.line[k - 1];
    autoLine(trk); sfx.points();
    demo.pre[k] = structuredClone(state);
    demo.at = k;
    lastFrom = act === 'secure' ? null : demo.pre[k];
    if (act === 'secure') {
      secure(state, trk); sfx.confirm();
      demo.post[k] = structuredClone(state);
      sayStep(k); paint(); demoNextOfPlay();
      return;
    }
    const after = structuredClone(state);
    MOVES[act](after, trk, n);
    demo.post[k] = after;
    sayStep(k);
    animateMove(state, act, trk, n, still(), () => { paint(); demoNextOfPlay(); });
  }

  // "Play all" goes on after a step: the next step after a pause, or at once with reduced motion.
  function demoNextOfPlay() {
    if (!demo || !demo.playing) return;
    if (demo.at >= demo.line.length) { demo.playing = false; showDemo(); return; }
    if (still()) { demoStep(); return; }
    const g = gen;
    later(readTime('--yard-step-gap'), () => { if (gen === g && demo && demo.playing) demoStep(); });
  }

  function stopPlay() {
    if (!demo || !demo.playing) return;
    demo.playing = false; clearPauses(); showDemo();
  }

  function demoNext() {
    if (!demo) return;
    stopPlay(); finishEffect();        // a new input ends the running step at its end state
    if (demo.at < demo.line.length) demoStep();
  }

  function demoBack() {
    if (!demo) return;
    stopPlay(); finishEffect();
    if (demo.at === 0) return;
    const k = demo.at - 1;
    restore(state, demo.post[k]);
    demo.at = k;
    lastFrom = k > 0 && demo.line[k - 1][0] !== 'secure' ? demo.pre[k] : null;
    sayStep(k); paint();
  }

  // "Play all", or Stop while it plays. Stop ends the running step at its end state.
  function demoPlay() {
    if (!demo) return;
    if (demo.playing) { stopPlay(); finishEffect(); return; }
    finishEffect();
    if (demo.at >= demo.line.length) return;
    demo.playing = true; showDemo();
    demoStep();
  }

  // ---- The move log (R7-P10, R7 section 9) ------------------------------------------------------------
  // One line for each call of the run: the call, the result of the model and its cost. The picture can
  // show a past state of the run, from the copies of the log: "Before and after" on the last line
  // changes the picture between the yard before the last call and the yard now; "Play again" on the
  // line of a move plays that move one more time on a copy and then shows the yard now. With reduced
  // motion "Play again" shows the two still states, one at each press, and a third press shows the
  // yard now. No past state changes the game state, and each input on the yard shows the yard now
  // first (settle). The head bar of the picture and the region say which state the picture shows.
  function addLog(act, trk, n, before, after) {
    log.push({ act, trk, n, call: callWords(act, trk, n), msg: after.msg, cost: costWords(act, before, after), before, after: structuredClone(after) });
    renderLog();
  }
  function renderLog() { view.renderLog(log.map((e) => ({ call: e.call, msg: e.msg, cost: e.cost, again: e.act !== 'secure' }))); }

  function showPast(k, phase) {
    const e = log[k - 1];
    restore(pastState, phase === 'before' ? e.before : e.after);
    past = { k, phase, from: phase === 'after' && e.act !== 'secure' ? e.before : null };
    view.setViewLabel(`${phase === 'before' ? 'Before' : 'After'} move ${k}`);
    paint();
    live.say(`The picture shows the yard ${phase} move ${k}, ${e.call}.`);
  }
  function endPast(say) {
    if (!past) return;
    past = null; view.setViewLabel(null); paint();
    if (say) live.say('The picture shows the yard now.');
  }
  // "Play again" with motion: the move on a copy of the state before it, then the yard now.
  function film(k) {
    const e = log[k - 1];
    restore(pastState, e.before);
    past = { k, phase: 'film', from: null };
    view.setViewLabel(`Move ${k} again`);
    live.say(`Move ${k} again: ${e.call}.`);
    animateMove(pastState, e.act, e.trk, e.n, false, () => endPast(!ending));
  }
  view.onLog((action, k) => {
    resume();
    const was = past;
    const same = (phase) => !!was && was.k === k && was.phase === phase;
    settle();
    if (action === 'before-after') {
      if (same('before')) live.say('The picture shows the yard now.');
      else showPast(k, 'before');
      return;
    }
    if (!still()) { film(k); return; }
    if (same('before')) showPast(k, 'after');
    else if (same('after')) live.say('The picture shows the yard now.');
    else showPast(k, 'before');
  });

  // A call or a switch after the departure: the train has left, and the job is closed until Reset.
  function closedRefusal() {
    const text = 'The train has departed. Press Reset to work this job again.';
    sfx.refuse(); banner(text, 'bad'); live.say(text);
  }

  // A switch during the watched line: the line is a demonstration, not the run of the learner.
  function demoRefusal() {
    const text = 'This is the demonstration. Press Stop watching to play the job yourself.';
    sfx.refuse(); banner(text, 'bad'); live.say(text);
  }

  // The result of a call, from the state after it (`after`): the banner, the readout, the Depart
  // control and the region. The banner shows the last of its texts. The region says the result of the
  // move, the readout and the text that followed, in one message (R7 F14), so that no part of the
  // result is lost. A win goes into the profile here. Returns true when the call wins the job.
  function announce(after, cost) {
    const readout = view.setReadout({ moves: after.moves, par: puzzle.par, joints: after.joints });
    const said = [after.msg, cost, `${readout}.`];
    banner(`${after.msg} ${cost}`, 'ok');
    const done = checkWin(after, puzzle);
    let won = false;
    if (done && puzzle.goal.depart) {
      view.setDepart({ shown: true, enabled: true });   // built in order — let them depart
      const text = `✓ Outbound built${puzzle.goal.ordered ? ' in order' : ''} — call Depart ▸ to leave.`;
      banner(text, 'win'); said.push(text);
    } else {
      view.setDepart({ shown: !!puzzle.goal.depart, enabled: false });
      if (done) { said.push(winBanner(after)); won = true; }
      else {
        // Built right but left loose. This is the one refusal that isn't a mistake in the work —
        // it's the step people forget, so name it plainly instead of just withholding the win.
        const loose = unsecuredGoal(after, puzzle);
        if (loose) {
          const text = `The cars are where they belong, but ${loose} is standing loose — a cut left unattended gets hand brakes before you walk away (CROR 112). SECURE ${loose} to finish the job.`;
          refusalBanner(text, false); said.push(text);
        }
      }
    }
    live.say(said.join(' '));
    return won;
  }

  // Returns the PREVIOUS best for this puzzle (before this win is folded in), or null.
  function bestRecord() {
    const b = ctx.profile.yard && ctx.profile.yard.best;
    return (b && b[puzzle.id]) || null;
  }

  // A win of the learner goes into the profile. A watched line never comes here (U-04): it gets no done
  // mark, no record and no mastery. The marks in old profiles stay.
  function recordWin(st) {
    if (watched) return;
    saved = true;
    if (!ctx.profile.yard) ctx.profile.yard = { completed: [], best: {} };
    if (!ctx.profile.yard.best) ctx.profile.yard.best = {};   // migrate a pre-D-0027 profile
    const y = ctx.profile.yard;
    let dirty = false;

    if (!y.completed.includes(puzzle.id)) { y.completed.push(puzzle.id); dirty = true; }

    // Per-puzzle best record (#14).
    const prev = y.best[puzzle.id];
    const now = {
      moves: st.moves, joints: st.joints,
      beatPar: st.moves <= puzzle.par, departed: !!puzzle.goal.depart,
    };
    // Fewer moves wins; joints break the tie. Never overwrite a better run with a worse one.
    const better = !prev || now.moves < prev.moves || (now.moves === prev.moves && now.joints < prev.joints);
    if (better) { y.best[puzzle.id] = now; dirty = true; }

    // The picker shows the marks ✓ and → and the record as you play, not only after the station
    // mounts again, so it is made again after the record is written.
    if (dirty) { ctx.save(); buildPicker(); }

    // One brain: a genuine player win feeds the SAME rule mastery the Drill grades. AppContext only
    // writes verified, currently-due items.
    if (typeof ctx.recordYardWin === 'function') ctx.recordYardWin(masteryItemsFor(puzzle), true);
  }

  // "Beat your best" (#14): compare against the record BEFORE this win is folded in. A first
  // clear says nothing (there is no best yet) rather than claiming a record. The record reads in the
  // form "5 moves, 2 couplings" (U-23).
  function bestSuffix(prev, st) {
    if (!prev) return '';
    const rec = `${prev.moves} move${prev.moves === 1 ? '' : 's'}, ${prev.joints} coupling${prev.joints === 1 ? '' : 's'}`;
    if (st.moves < prev.moves || (st.moves === prev.moves && st.joints < prev.joints)) return ` · new best (was ${rec})`;
    return ` · your best: ${rec}`;
  }

  // Shows the win of the state `st`, puts it into the profile and returns its text. The caller plays
  // the win sound when the end state shows.
  function winBanner(st) {
    const g = grade(st, puzzle);
    const prev = bestRecord();
    const clean = st.joints <= bestJoints() ? ` — ${g.bonus}, clean` : ` · ${g.bonus}`;
    // Each finish starts with "Job done." (U-23): a finish above par says that the job is done too.
    const text = `Job done. ${g.beatPar ? '✓ ' : ''}${g.head}${clean}${bestSuffix(prev, st)}`;
    banner(text, g.beatPar ? 'win' : 'ok');
    recordWin(st);
    return text;
  }

  // Depart — the deliberate final call once the outbound is assembled (P6). The
  // consist is already coupled to the loco; it leaves out the lead, off-frame.
  function departOut() {
    if (departed || demo || !puzzle.goal.depart || !checkWin(state, puzzle)) return;
    departed = true; lastFrom = null;
    const g = grade(state, puzzle);
    const prev = bestRecord();
    sfx.win();
    const clean = state.joints <= bestJoints() ? ` — ${g.bonus}, clean` : ` · ${g.bonus}`;
    const text = `Job done. ✓ Departed out the lead — ${g.head}${clean}${bestSuffix(prev, state)}`;
    banner(text, g.beatPar ? 'win' : 'ok'); live.say(text);   // win registered now
    recordWin(state);
    view.setDepart({ shown: true, enabled: false });
    // flavor: pull the whole train out the lead, off-frame left
    const cutLen = state.engine.reduce((a, c) => a + carLen(state.type[c]), 0);
    const startS = restS(cutLen), endS = -(cutLen + ENGLEN + 220);
    const cut = state.engine.slice();
    run([{ dur: 1300, fn: (t) => { anim = { route: LEAD_ROUTE, engS: startS + (endS - startS) * t, cut }; } }],
      still(), () => { anim = null; paint(); });
  }

  // The joint count of the solver-proven optimal line, baked into each puzzle by tools/solve.mjs
  // and asserted by the gate. This used to be `ceil(par/2)` — a guess that was wrong on 16 of 19
  // puzzles and always too generous (p2-build awarded "clean" at 4 joints when 2 is optimal).
  // Show nothing false: the badge now means what it says.
  function bestJoints() { return Math.max(1, puzzle.optJoints ?? Math.ceil(puzzle.par / 2)); }

  function syncBuilder() {
    // keep the count cap sensible for the chosen action
    const kind = $('act').value, id = $('track').value;
    const cur = +$('count').value;
    const max = kind === 'pull' ? (state.tracks[id]?.length || 1) : Math.max(1, state.engine.length);
    // SECURE acts on the whole standing cut — a car count would be meaningless.
    view.setCount({ max: Math.max(1, max), value: Math.min(cur || 1, Math.max(1, max)), disabled: kind === 'secure' });
  }
  // A change of the move builder draws the landing place of the new move again.
  ['act', 'track'].forEach((id) => $(id).addEventListener('change', () => { syncBuilder(); paint(); }));
  $('count').addEventListener('change', () => paint());

  function renderRules() {
    const list = [];
    for (const key of puzzle.rules) {
      const r = RULES[key]; if (!r) continue;
      list.push({ kind: r.kind, cite: r.cite, label: r.label });
    }
    view.renderRules(list);
  }

  // Route the work-order panel: a normal order, the interactive switch-list check
  // (#7), or the verified/corrected order once certified.
  function renderOrder() {
    if (!puzzle.listed) { renderWorkOrder(); return; }
    if (ordered) { renderVerifiedOrder(); return; }

    view.renderSwitchList({
      id: puzzle.id, goalTrack: puzzle.goal.track, hint: puzzle.hint,
      lines: puzzle.listed.map((e, i) => ({ mark: e.listedMark, track: e.listedTrack, flagged: flagged.has(i) })),
    }, {
      onFlag: (i) => {
        resume();                     // a flag can be the first press of the page: the sound needs its context
        if (flagged.has(i)) flagged.delete(i); else flagged.add(i);
        sfx.confirm(); view.setLineFlag(i, flagged.has(i));   // in place: focus stays on the line
      },
      onCertify: certify,
    });
  }

  function certify() {
    resume();
    const errs = new Set(puzzle.listed.map((e, i) => (e.error ? i : -1)).filter((i) => i >= 0));
    const ok = flagged.size === errs.size && [...flagged].every((i) => errs.has(i));
    if (ok) {
      ordered = true; sfx.confirm();
      renderOrder(); syncBuilder();
      const text = `✓ Order verified — now work the real cars onto ${puzzle.goal.track}.`;
      banner(text, 'win'); live.say(text);
      return;
    }
    sfx.refuse();
    const missed = [...errs].find((i) => !flagged.has(i));
    const over = [...flagged].find((i) => !errs.has(i));
    let why;
    // Calm words for the refusal of the list (U-39): "Not quite", the word of the Drill for a miss.
    if (missed != null) {
      const e = puzzle.listed[missed];
      why = e.error === 'location'
        ? `${e.listedTrack} has no ${e.listedMark} — that car isn't where the list says.`
        : `read ${e.listedTrack} again — the number on the ground isn't ${e.listedMark}.`;
    } else {
      const e = puzzle.listed[over];
      why = `${e.listedMark} on ${e.listedTrack} checks out — leave a good line unflagged.`;
    }
    banner(`Not quite — ${why}`, 'bad'); live.say(`Not quite — ${why}`);
  }

  function renderVerifiedOrder() {
    view.renderVerifiedOrder({
      goalTrack: puzzle.goal.track, par: puzzle.par,
      lines: puzzle.listed.map((e) => ({ mark: e.trueMark, track: e.trueTrack, corrected: !!e.error })),
    });
  }

  // The job, stated like a switch list — derived from the puzzle goal.
  function renderWorkOrder() {
    const g = puzzle.goal;
    const src = {};
    for (const [trk, entries] of Object.entries(puzzle.start || {}))
      for (const e of entries) { const m = Array.isArray(e) ? e[0] : e; if (typeof m === 'string') src[m] = trk; }
    const from = [...new Set(g.cars.map((c) => src[c]).filter(Boolean))];
    view.renderWorkOrder({
      id: puzzle.id, title: puzzle.title, hint: puzzle.hint, par: puzzle.par,
      depart: !!g.depart, ordered: !!g.ordered, goalTrack: g.track, cars: g.cars, from,
      arrival: !!puzzle.inbound, first: puzzle === PUZZLES[0],
    });
  }

  function banner(text, tone) { refusal = null; view.setBanner(text, tone); }

  // A refused move is a teaching moment: keep the cited rule, add a one-tap link to its
  // plain-language Reference entry (cause → rule → correct action; REVAMP §6).
  // "Look it up" opens the entry in a dialog on top of the Yard (U-17, 2c-plan C1): the job, the moves
  // and the drawing stay, and the close of the dialog returns focus to the control.
  // The region says the refusal as the model wrote it, unless the caller says it in a longer message.
  function refusalBanner(msg, say = true) {
    refusal = null;
    const id = ruleItemFromMsg(msg);
    view.setRefusal(msg, id && ctx && typeof ctx.lookUp === 'function' ? () => ctx.lookUp(id) : null);
    if (say) live.say(msg);
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
  view.setTracks(TRACK_IDS);

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

    const groups = [];
    for (const t of TIERS) {
      const inTier = ordered.filter((e) => e.p.tier === t.tier);
      if (!inTier.length) continue;                       // never render an empty group
      groups.push({
        label: t.label,
        options: inTier.map(({ p, k }) => {
          const b = best[p.id];
          return {
            value: k, title: p.title, par: p.par,
            state: completed.includes(p.id) ? 'done' : (next && next.p.id === p.id ? 'next' : ''),
            best: b ? { moves: b.moves } : null,                // blank, never a guess, if unrecorded
          };
        }),
      });
    }
    view.renderPicker(groups, keep);                      // a rebuild must not change the selection
  }

  buildPicker();
  // A new job. If moves of the learner are at risk, the job stays and the Yard asks first (U-12,
  // A11Y-18); No keeps the moves, Yes loads the new job.
  picker.addEventListener('change', () => {
    settle();                         // a move in motion ends first, so that its moves count below
    const next = PUZZLES[+picker.value];
    if (!atRisk()) { load(next, true); return; }
    picker.value = String(PUZZLES.indexOf(puzzle));
    const g = gen;
    view.ask(`Change to the job “${next.title}”? You lose your ${movesWords()} on this job.`, (yes) => {
      if (!yes || gen !== g) return;
      picker.value = String(PUZZLES.indexOf(next));
      load(next, true);
    });
  });

  // The sound (R7-P2, U-36, 2c-plan C8): off by default, with its own switch that holds the choice.
  // The Yard reads the stored choice at each mount, so that a reset of the progress (it removes the
  // key) shows at the next visit. The Yard does not change the choice at mount, and "Read aloud" does
  // not set it.
  view.setMuted(loadMuted());
  load(PUZZLES[0]);

  // The teardown (UNMOUNT). A move, a step of the watched line, the departure and the arrival stop at
  // once: the frame of each is cancelled, each pause is cleared, and the new gen makes a late answer
  // do nothing. The drawing removes its observers and its listeners of the window. The listeners of
  // the elements of the Yard go with the elements when the host is emptied.
  teardown = () => {
    gen++;
    cancelEffect();
    clearPauses();
    view.closeAsk();                  // an open question closes with No; its answer finds a new gen and does nothing
    stopAll();                        // the timed notes of the win melody and each tone that sounds now
    drawing.destroy();
  };
}
