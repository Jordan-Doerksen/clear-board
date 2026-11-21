// draw.ts — the drawing adapter of the Yard. It owns the picture of look C2 (D-0031): one inline SVG
// with the words as DOM text over it (D-0032), in a wide form and a tall form. The controller
// (../yardSim.js) draws only through the object that createDrawing() returns. This file calls no
// sound and changes no game state: it reads the state that paint() gets, and it replays the authored
// line of a job only on its own copy (./drawing/layout.ts, lineStates).
//
// The pointer path (SWITCH-BUTTONS, option a): one click listener on the root of the picture. A
// click inside the 44 px box of a switch calls onPick with the id of that switch; a click elsewhere
// in the picture calls onPick(null). The boxes are the places of the switch buttons of a later job
// (switchBoxes, onLayout, and the empty layer .yd-view-controls).

import './drawing/drawing.css';
import { createRenderer } from './drawing/svg.ts';
import type { Scene } from './drawing/svg.ts';
import {
  MIN_W, wideFrame, tallFrame, wideHolds, tallHolds, planWide, planTall, placeChain, lineFacts, landingOf, tracePx,
  pathOf, distOf, atDist,
} from './drawing/layout.ts';
import type { Frame, Layout, Measures, Placed, Pt, Builder } from './drawing/layout.ts';
import { yardFacts, motionOf } from './drawing/bodies.ts';
import type { ModelState, ModelPuzzle, MoveFrame, ArrivalFrame, YardFacts } from './drawing/bodies.ts';
import { fillLegend, legendKey } from './drawing/legend.ts';
import type { LegendFacts } from './drawing/legend.ts';
import { TRACK_IDS, switchPos } from './geometry.js';

/** The game state of model.js. The adapter reads it and writes nothing to it. */
export type YardState = Readonly<Record<string, unknown>>;
/** One job of puzzles.js. The adapter reads it and writes nothing to it. */
export type YardPuzzle = Readonly<Record<string, unknown>>;
/** A frame of a move or of the arrival, as the controller builds it. `null` is no motion. */
export type YardMotion = Readonly<Record<string, unknown>> | null;

/**
 * The values of one paint. `departed` and `builder` are for a later job (R7-P14, LANDING): with
 * `departed` the lead shows no engine and no held car; with `builder` the picture shows where the
 * move in the builder lands. No caller sets them in Wave 2b.
 */
export interface PaintOptions {
  anim: YardMotion;
  cine: YardMotion;
  departed?: boolean;
  builder?: { act: string; n: number; track: string };
}

/** The box of one switch, in CSS px. The origin is the top left corner of the padding box of the host. */
export interface SwitchBox { id: string; x: number; y: number; width: number; height: number }

/** What the controller gives to the adapter. */
export interface DrawingOptions {
  /** Called for each click on the drawing: with the track id of the switch that was hit, or with null. */
  onPick: (trackId: string | null) => void;
}

/** The drawing object. `createDrawing` makes it. */
export interface YardDrawing {
  /** The one draw call. */
  paint(state: YardState, puzzle: YardPuzzle, opts: PaintOptions): void;
  /** Six boxes, in the order AS71 to AS76: the 44 px box of each switch, where a press lines it. */
  switchBoxes(): SwitchBox[];
  /** `fn` is called after each layout that moves a box or changes the size of the picture. */
  onLayout(fn: () => void): void;
  /** Stops the observers and removes the click listener. */
  destroy(): void;
}

/** This commit draws no trace yet; the trace of the last move comes in the next commit. */
const NO_TRACE = true;

interface Snapshot { engine: string[]; tracks: Record<string, string[]>; pos: Record<string, number[]>; lined: string; secured: string }

export function createDrawing(host: HTMLElement, { onPick }: DrawingOptions): YardDrawing {
  const R = createRenderer(host);
  const legend = document.createElement('div');
  legend.className = 'yd-legend';
  let legendBuilt = '';

  let M: Measures | null = null;
  let frame: Frame | null = null;
  let job: { state: object; puzzle: ModelPuzzle; line: YardFacts[]; legendBelow: boolean } | null = null;
  let last: { state: ModelState; puzzle: ModelPuzzle; opts: PaintOptions } | null = null;
  let width = 0;
  let L: Layout | null = null;
  let rest: Snapshot | null = null;
  let trace: { track: string; contactX: number; toLead: boolean } | null = null;
  let boxesKey = '';
  const layoutFns: Array<() => void> = [];

  const snap = (st: ModelState): Snapshot => ({
    engine: st.engine.slice(),
    tracks: Object.fromEntries(TRACK_IDS.map((id) => [id, st.tracks[id].slice()])),
    pos: Object.fromEntries(TRACK_IDS.map((id) => [id, st.pos[id].slice()])),
    lined: JSON.stringify(st.lined), secured: JSON.stringify(st.secured),
  });

  /** The form and the frame of the job, for the width of the host and the measured words. */
  function selectFrame(extra: YardFacts | null): void {
    width = host.clientWidth;
    if (!job || width < MIN_W) { frame = null; return; }
    if (!M) M = R.makeMeasures();
    const states = extra ? job.line.concat([extra]) : job.line;
    const keepTall = frame !== null && frame.form === 'tall';
    frame = (!keepTall && wideFrame(width, states, M)) || tallFrame(width, states, M);
    if (frame.form === 'wide' && (job.legendBelow || !legendFitsCorner(states))) { frame.legend = 'below'; job.legendBelow = true; }
    else if (frame.form === 'wide') frame.legend = 'corner';
    R.clearProbe();
  }

  /** The legend stands in the empty corner above the ladder when it touches no plate, no box and no part of the ladder. */
  function legendFitsCorner(states: YardFacts[]): boolean {
    if (!frame || !M || !last) return false;
    const fr = frame;
    const lf = legendFacts(false);
    const probeBox = document.createElement('div');
    probeBox.className = 'yd-legend';
    probeBox.dataset.place = 'corner';
    fillLegend(probeBox, lf);
    R.probe.replaceChildren(probeBox);
    const lr = probeBox.getBoundingClientRect();
    const cs = getComputedStyle(probeBox);
    R.probe.replaceChildren();
    const left = parseFloat(cs.getPropertyValue('--sp-4')) || 0;
    const box = { x0: left, y0: left, x1: left + lr.width, y1: left + lr.height };
    for (const F of states) {
      const lay = planWide(F, fr, M, width, null);
      for (const r of obstacles(lay, F)) if (!(r.x1 < box.x0 - 4 || r.x0 > box.x1 + 4 || r.y1 < box.y0 - 4 || r.y0 > box.y1 + 4)) return false;
      // The ladder (and its stands) must stay clear of the legend.
      const by = box.y1 + 14, bx = box.x1 + 14;
      const foot = lay.foot, top = lay.swp[TRACK_IDS[TRACK_IDS.length - 1]];
      if (by > top[1]) {
        const xl = foot[0] + (by - foot[1]) * (top[0] - foot[0]) / (top[1] - foot[1]);
        if (xl - 34 * fr.s < bx) return false;
      }
    }
    return true;
  }

  /** The rectangles of the plates and boxes of a wide layout (for the place of the legend). */
  function obstacles(lay: Layout, F: YardFacts): Array<{ x0: number; y0: number; x1: number; y1: number }> {
    const m = M as Measures;
    const out: Array<{ x0: number; y0: number; x1: number; y1: number }> = [];
    const at = (x: number, y: number, w: number, h: number, a: string): void => {
      const x0 = a === 'r' ? x - w : a === 'tc' || a === 'c' ? x - w / 2 : x;
      const y0 = a === 'tc' ? y : y - h / 2;
      out.push({ x0, y0, x1: x0 + w, y1: y0 + h });
    };
    for (const st of lay.stands) {
      out.push({ x0: st.bx - m.target / 2, y0: st.by - m.target / 2, x1: st.bx + m.target / 2, y1: st.by + m.target / 2 });
      if (st.plate) at(st.plate.x, st.plate.y, m.num(`${st.id} REVERSE`) + 8, m.plateH, 'r');
    }
    for (const lb of lay.labels) at(lb.x, lb.y, m.labels[lb.k].w, m.labels[lb.k].h, lb.a);
    if (lay.leadBar) at(lay.leadBar.x, lay.leadBar.y, m.leadBarW, m.leadBarH, lay.leadBar.a);
    for (const it of [...lay.items, ...lay.held]) if (it.car) at(it.cx, it.cy + 10 * lay.s + 3, m.num(it.car.number), m.numH, 'tc');
    at(lay.engine.cx, lay.engine.cy + 12 * lay.s + 3, m.engW, m.plateH, 'tc');
    for (const id of TRACK_IDS) { const tr = lay.tr[id]; at(tr.foul[0], tr.foul[1] + Math.max(9 * lay.s + 6, m.target / 2 - 8 * lay.s + 3), m.foulW, m.plateH, 'tc'); }
    void F;
    return out;
  }

  function legendFacts(folds: boolean): LegendFacts {
    const F = last ? yardFacts(last.state, last.puzzle) : null;
    return {
      s: frame ? frame.s : 1, tagW: M ? M.tagW : 16, folds,
      kickable: !!F && F.kickableJob, goal: !!F && F.goalJob, secured: !!F && F.showSecured, landing: false,
    };
  }

  function placeLegend(lay: Layout, folds: boolean, landing: boolean): number {
    const lf = { ...legendFacts(folds), landing };
    const key = legendKey(lf);
    if (key !== legendBuilt) { fillLegend(legend, lf); legendBuilt = key; }
    const place = frame ? frame.legend : 'below';
    if (legend.dataset.place !== place) legend.dataset.place = place;
    let h = lay.h;
    if (place === 'below') {
      if (legend.parentElement !== host || legend.previousElementSibling !== R.root) R.root.after(legend);
      legend.style.removeProperty('left'); legend.style.removeProperty('top'); legend.style.removeProperty('width');
    } else {
      if (legend.parentElement !== R.root) R.root.appendChild(legend);
      if (place === 'side') {
        const sideX = Math.max(34 + 190, lay.sideMin), sideW = Math.min(520, lay.w - sideX - 12);
        setPx(legend, 'left', sideX); setPx(legend, 'top', Math.round(lay.leadTop + 14)); setPx(legend, 'width', sideW);
        h = Math.max(h, Math.round(lay.leadTop + 14 + legend.getBoundingClientRect().height + 10));
      } else { legend.style.removeProperty('left'); legend.style.removeProperty('top'); legend.style.removeProperty('width'); }
    }
    return h;
  }
  const setPx = (el: HTMLElement, prop: string, v: number): void => { const s = `${Math.round(v * 10) / 10}px`; if (el.style.getPropertyValue(prop) !== s) el.style.setProperty(prop, s); };

  function render(): void {
    if (!last || !job) return;
    if (!frame) { selectFrame(null); if (!frame) return; }
    const m = M as Measures;
    const st = last.state, pz = last.puzzle, opts = last.opts;
    const F = yardFacts(st, pz);
    const land = landingOf(st, F, opts.builder as Builder | undefined);
    // FORM-KEEP: a state that the kept frame cannot draw turns the job to the tall form one time.
    if (frame.form === 'wide' && !wideHolds(frame, F, m, land)) { frame = tallFrame(width, job.line.concat([F]), m); }
    else if (frame.form === 'tall' && !tallHolds(frame, F, m, land)) { frame = tallFrame(width, job.line.concat([F]), m); }
    const lay = frame.form === 'wide' ? planWide(F, frame, m, width, land) : planTall(F, frame, m, width, land);
    L = lay;
    const anim = opts.anim as MoveFrame | null, cine = opts.cine as ArrivalFrame | null;
    const motion = motionOf(st, anim, cine);
    const moving: Placed[] = [];
    const couplers: Array<{ p: Pt; dx: number; dy: number }> = [];
    for (const ch of motion.chains) {
      const placed = placeChain(lay, ch);
      moving.push(...placed);
      // A coupler mark between two bodies of the chain that touch.
      const pieces = pathOf(lay, ch.path), dA = distOf(pieces, ch.anchorS);
      for (let k = 0; k + 1 < ch.bodies.length; k++) {
        const a = ch.bodies[k], b = ch.bodies[k + 1];
        if (Math.abs(a.offset + a.body.len - b.offset) > 1e-6) continue;
        if (!placed.some((q) => q.key === a.body.key) || !placed.some((q) => q.key === b.body.key)) continue;
        const at = atDist(pieces, dA - b.offset * lay.s);
        couplers.push({ p: at.p, dx: at.dx, dy: at.dy });
      }
    }
    // The trace of the last move (R7-P15): found from the change of the state between two paints with no frame.
    if (anim || cine) trace = null;
    else {
      const now = snap(st);
      if (rest && now.lined === rest.lined && now.secured === rest.secured && now.engine.length !== rest.engine.length) {
        const prev = rest;
        if (now.engine.length > prev.engine.length) {
          const id = TRACK_IDS.find((t) => now.tracks[t].length < prev.tracks[t].length);
          if (id) trace = { track: id, contactX: switchPos(TRACK_IDS.indexOf(id)).x + prev.pos[id][0], toLead: true };
        } else {
          const id = TRACK_IDS.find((t) => now.tracks[t].length > prev.tracks[t].length);
          if (id) trace = { track: id, contactX: switchPos(TRACK_IDS.indexOf(id)).x + now.pos[id][0], toLead: false };
        }
      } else if (rest && (now.lined !== rest.lined || now.secured !== rest.secured)) trace = null;
      rest = now;
    }
    const departed = !!opts.departed;
    const landU: Record<string, number> = {};
    if (land) landU[land.track] = land.fit.reduce((a, l) => a + (l.x1 - l.x0), 0);
    const sc: Scene = {
      L: lay, F, moving, movingCouplers: couplers, hidden: motion.hidden, engineMoves: motion.engineMoves, departed,
      trace: trace && !departed && !NO_TRACE ? { runs: tracePx(lay, F, trace.track, trace.contactX), toLead: trace.toLead } : null,
      landU,
    };
    if (sc.trace && !sc.trace.runs.length) sc.trace = null;
    R.draw(sc, m);
    const h = placeLegend(lay, lay.folds > 0, !!land && land.fit.length + land.over.length > 0);
    if (h !== lay.h) { R.root.style.height = `${h}px`; }
    R.clearProbe();
    const key = JSON.stringify([lay.w, h, boxesOf(lay)]);
    if (key !== boxesKey) {
      const first = boxesKey === '';
      boxesKey = key;
      if (!first) for (const f of layoutFns) f();
    }
  }

  function boxesOf(lay: Layout): SwitchBox[] {
    const t = (M as Measures).target;
    return lay.stands.map((st) => ({ id: st.id, x: st.bx - t / 2, y: st.by - t / 2, width: t, height: t }));
  }

  /** The box that holds a point of the root, or null. */
  function hit(x: number, y: number): string | null {
    if (!L || !M) return null;
    for (const b of boxesOf(L)) if (x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height) return b.id;
    return null;
  }
  const onClick = (e: MouseEvent): void => {
    const r = R.root.getBoundingClientRect();
    onPick(hit(e.clientX - r.left, e.clientY - r.top));
  };
  R.root.addEventListener('click', onClick);

  // A new width of the host, or a new reading mode, lays out the kept form again (FORM-KEEP).
  let seenWidth = -1;
  const ro = new ResizeObserver(() => {
    const w = host.clientWidth;
    if (w === seenWidth) return;
    const firstReport = seenWidth === -1;
    seenWidth = w;
    if (firstReport && w === width) return;      // the report at the start is not a change
    if (job) { selectFrame(last ? yardFacts(last.state, last.puzzle) : null); render(); }
  });
  ro.observe(host);
  const mo = new MutationObserver(() => {
    M = null;
    if (job) { selectFrame(last ? yardFacts(last.state, last.puzzle) : null); render(); }
  });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-dys', 'data-contrast', 'style'] });
  // Print: the whole yard on the page. The picture is laid out for the width of the page before printing.
  const onPrint = (): void => { if (job) { selectFrame(last ? yardFacts(last.state, last.puzzle) : null); render(); } };
  window.addEventListener('beforeprint', onPrint);
  window.addEventListener('afterprint', onPrint);

  return {
    paint(state, puzzle, opts) {
      if (!job || state !== job.state) {
        job = { state, puzzle: puzzle as unknown as ModelPuzzle, line: lineFacts(puzzle as unknown as ModelPuzzle), legendBelow: false };
        last = { state: state as unknown as ModelState, puzzle: puzzle as unknown as ModelPuzzle, opts };
        frame = null; rest = null; trace = null;
        selectFrame(null);
      }
      last = { state: state as unknown as ModelState, puzzle: puzzle as unknown as ModelPuzzle, opts };
      render();
    },

    switchBoxes() {
      if (!L || !M) return [];
      const r = R.root.getBoundingClientRect(), h = host.getBoundingClientRect();
      const left = r.left - h.left - host.clientLeft, top = r.top - h.top - host.clientTop;
      return boxesOf(L).map((b) => ({ ...b, x: b.x + left, y: b.y + top }));
    },

    onLayout(fn) { layoutFns.push(fn); },

    destroy() {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener('beforeprint', onPrint);
      window.removeEventListener('afterprint', onPrint);
      R.root.removeEventListener('click', onClick);
      layoutFns.length = 0;
    },
  };
}
