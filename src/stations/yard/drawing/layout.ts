// layout.ts — the view transform of the Yard drawing (look C2, D-0031).
//
// Each point of the picture comes from geometry.js through this file. geometry.js is read and never
// changed. The picture has two forms:
// - The wide form: the true geometry at one car scale s. When the host is too narrow, the same
//   length D (px) of empty track is left out of each of the six tracks, between the foul point and
//   the first car. A break mark stands on each stretch that shrank. A long held cut makes the lead
//   of the picture longer to the left, so that the engine stays in the picture.
// - The tall form: the ladder is a spine at the left, one row for each track (AS76 at the top), the
//   lead runs down from the foot. A row of cars that is longer than its row goes on in the next line.
// The script measures the words, so the least car scale keeps two neighbour number plates apart and
// each type tag inside its car.
//
// The form and the frame of a job (FORM-CHANGE, FORM-KEEP). At the start of a job the drawing
// replays the authored line on its own copy of the state. It takes the wide form when the wide form
// holds in each state of the line and in each of the seven routes that the switches can line; else
// the tall form. The frame (the car scale, the length left out, the left edge, the plate column,
// the compact plates and the place of the legend) is computed over the same states and kept for
// the job. A state that the kept wide form cannot draw turns the job to the tall form one time.
//
// Travel (requirement 33). The route of a move is a chain of runs ("pieces"): the lead, the ladder,
// the track. Each run maps the units of the route to px. A run that crosses a stretch that was left
// out has fewer px for each unit, and a row that goes on in the next line is two runs that join with
// no length. A coupled consist that moves is one rigid chain in px: its anchor (the end toward the
// deep end of the track) goes through the runs of the route, and each other body follows back along
// the drawn route by its own length in px. So a body does not shrink in a stretch that was left out:
// the bodies behind the anchor take the px that the stretch does not have. A body that crosses the
// turn of a row leaves the end of one line and comes out at the start of the next line: a body is
// drawn on the run that holds its centre. A body beyond the drawn end of the lead is not drawn.
//
// Each constant below with the comment "picture" is a value of the picture, not a number of the game.

import {
  NTRACK, TRACK_IDS, switchPos, TRACK_RIGHT, MAIN_OUT, FOOT, LEAD_Y, LEAD_LEFT, CLEAR, W as GEO_W,
  ENGLEN, S_FOOT, THROUGH_ROUTE,
} from '../geometry.js';
import { freshState, pull, spot, kick, secure, spotPlan } from '../model.js';
import type { YardFacts, TrackFact, CarFact, Lining, ModelState, ModelPuzzle, ChainSpec, PathKind } from './bodies.ts';
import { yardFacts, switchArc } from './bodies.ts';

// ---- Values of the picture ------------------------------------------------------------------------
export const VIEW_X0 = 0;          // picture: the left edge of the wide form, in units, with a short held cut
export const VIEW_Y0 = -6;         // picture: the top of the wide form, in units
export const VIEW_Y1 = 412;        // picture: the bottom of the wide form, in units
export const BMIN = 26;            // picture: px, the least width of a stretch that was left out (the break mark)
export const STUB = 44;            // picture: units of bare track that an empty track keeps before its end stop
export const K_BAR = 0.1;          // picture: px for each unit in each room bar; one scale for all bars
export const S_MIN = 0.8;          // picture: the least car scale
export const S_MAX_WIDE = 1.3;     // picture: the largest car scale of the wide form
export const S_MAX_TALL = 1.1;     // picture: the largest car scale of the tall form
export const GAUGE = 3;            // picture: units from the centre line to each rail
export const TIE_STEP = 10;        // picture: units from one tie to the next
export const MIN_W = 240;          // picture: px; under this host width no picture is laid out
export const CAR_H = 20;           // picture: the height of a car in units (render.js:157 before Wave 2b)
export const ENG_H = 24;           // picture: the height of the engine in units (render.js:160 before Wave 2b)
export const LAMP_R = 2.6;         // picture: the radius of the headlight in units (render.js:162 before Wave 2b)
export const FOUL_HALF = 9;        // picture: units of the foul point bar on each side of the track (render.js:133 before Wave 2b)
const TALL_XS = 34;                // picture: px, the x of the spine of the tall form
const TALL_DZ = 14;                // picture: px, the corner from the spine into a row
const TALL_CONT = 20;              // picture: px, the room of the hook of a row that goes on
const TRACE_SIDE = 5.5;            // picture: units from the centre line to the trace

/** The three labels of the drawing of today, with their places (render.js:92-94 before Wave 2b). */
export const LABELS = [
  { text: '◄ DEPARTURE · LEAD / DRILL', x: 10, y: LEAD_Y - 24, align: 'left' },
  { text: 'MAIN LINE → the road', x: 840, y: 18, align: 'left' },
  { text: '15 MPH · REDUCED (CROR 105)', x: GEO_W - 10, y: 18, align: 'right' },
] as const;

const TR = TRACK_RIGHT;
const PITCH = switchPos(0).y - switchPos(1).y;          // units between two tracks (from geometry.js)

// ---- Types ------------------------------------------------------------------------------------
export type Pt = [number, number];
export type Anchor = 'c' | 'tc' | 'tl' | 'l' | 'r';

/** One run of a route: the unit u0 is at the px point (x, y); each unit is k px in the direction (dx, dy). */
export interface Piece { u0: number; u1: number; x: number; y: number; dx: number; dy: number; k: number }

/** What the layout needs to know about the size of the words. The drawing measures them (svg.ts). */
export interface Measures {
  num(text: string): number;
  numH: number;
  tagW: number;
  tagH: number;
  foulW: number;
  plateH: number;
  engW: number;
  labels: Array<{ w: number; h: number }>;
  labelWrapH(k: number, width: number): number;
  leadBarW: number;
  leadBarH: number;
  end(t: TrackFact, compact: boolean): { w: number; h: number };
  cap(t: TrackFact, lin: Lining, width: number): number;
  /** The side of a switch box in px: the value of --cb-target. */
  target: number;
}

/** The move in the builder, when a later job passes it (LANDING). */
export interface Builder { act: string; n: number; track: string }

export interface Land { car: CarFact; x0: number; x1: number }

export interface TrackLayout {
  id: string;
  y: number;
  /** Unit x on the track to px, from the switch. */
  pieces: Piece[];
  /** The drawn rail lines. Line 0 starts at the switch point. */
  lines: Pt[][];
  foul: Pt;
  foulL: number | null;
  stop: Pt;
  brk: Pt | null;
  routeEnd: Pt;
  pa: number;
  pc: number;
}

/** A body at rest or in motion: its centre, its angle (degrees) and its length in px. */
export interface Placed {
  key: string;
  kind: 'car' | 'engine' | 'land';
  car: CarFact | null;
  inbound: boolean;
  track: string | null;
  line: number;
  cx: number;
  cy: number;
  rot: number;
  len: number;
  /** The landing outline is cut at the switch (a move that does not fit). */
  cut?: boolean;
}

export interface Stand { id: string; px: number; py: number; sx: number; sy: number; d: number; bx: number; by: number; plate: { x: number; y: number } | null }

export interface Layout {
  form: 'wide' | 'tall';
  s: number;
  D: number;
  w: number;
  h: number;
  tr: Record<string, TrackLayout>;
  swp: Record<string, Pt>;
  foot: Pt;
  leadStart: Pt;
  mainEnd: Pt;
  /** Unit x on the lead to px, with x growing toward the foot. */
  lead: Piece[];
  items: Placed[];
  held: Placed[];
  engine: Placed;
  brks: Array<{ x: number; y: number; id: string | null; v: boolean; lit: boolean }>;
  conts: Array<{ from: Pt; to: Pt }>;
  turns: Pt[];
  cutline: { x: number; y0: number; y1: number } | null;
  ends: Array<{ t: TrackFact; x: number; y: number }>;
  endW: number;
  compact: boolean;
  caps: Array<{ t: TrackFact; x: number; y: number; w: number }>;
  labels: Array<{ k: number; x: number; y: number; a: Anchor; wrapW: number }>;
  leadBar: { x: number; y: number; a: Anchor } | null;
  stands: Stand[];
  foulPlate: { x: number; y: number; a: Anchor } | null;
  leadTop: number;
  leadBot: number;
  sideMin: number;
  folds: number;
}

/** The frame of a job: the values that do not change during the job. */
export interface Frame {
  form: 'wide' | 'tall';
  s: number;
  D: number;
  x0u: number;
  endW: number;
  compact: boolean;
  legend: 'corner' | 'below' | 'side';
  width: number;
}

// ---- Small helpers ------------------------------------------------------------------------------
const linings = (): Array<Record<string, Lining>> => [null, ...TRACK_IDS].map((id) => Object.fromEntries(TRACK_IDS.map((t) => [t, t === id ? 'reverse' : 'normal'])) as Record<string, Lining>);
/** The seven routes that the six switches can line: none reverse, or the first reverse switch. */
export const ROUTES7 = linings();
const unitDir = (a: Pt, b: Pt): [number, number] => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]; };
export function along(a: Pt, b: Pt, dist: number): Pt { const [dx, dy] = unitDir(a, b); return [a[0] + dx * dist, a[1] + dy * dist]; }

/** A run from px point a to px point b for the units u0 to u1. */
function run(u0: number, u1: number, a: Pt, b: Pt): Piece {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const [dx, dy] = len > 1e-9 ? unitDir(a, b) : [1, 0];
  return { u0, u1, x: a[0], y: a[1], dx, dy, k: u1 > u0 ? len / (u1 - u0) : 0 };
}
/** A run that starts at px point a, goes in direction (dx, dy) with k px for each unit. */
const ray = (u0: number, u1: number, a: Pt, dx: number, dy: number, k: number): Piece => ({ u0, u1, x: a[0], y: a[1], dx, dy, k });

/** The px point of unit u on a list of runs. A unit outside the runs extends the first or the last run. */
export function pointOn(pieces: Piece[], u: number): Pt {
  let p = pieces[0];
  for (const q of pieces) { if (u >= q.u0) p = q; }
  const t = (u - p.u0) * p.k;
  return [p.x + p.dx * t, p.y + p.dy * t];
}

/** The px distance along the runs to unit u (runs join with no length at a turn). */
export function distOf(pieces: Piece[], u: number): number {
  let d = 0;
  for (let i = 0; i < pieces.length; i++) {
    const q = pieces[i];
    const last = i === pieces.length - 1;
    if (u < q.u0 && i === 0) return (u - q.u0) * q.k;
    if (u <= q.u1 || last) return d + (u - q.u0) * q.k;
    d += (q.u1 - q.u0) * q.k;
  }
  return d;
}

/** The px point and the direction at px distance d along the runs. A run with no length is passed over. */
export function atDist(pieces: Piece[], d: number): { p: Pt; dx: number; dy: number; run: number } {
  let acc = 0;
  for (let i = 0; i < pieces.length; i++) {
    const q = pieces[i];
    const len = (q.u1 - q.u0) * q.k;
    const last = i === pieces.length - 1;
    if (len <= 0 && !last) continue;
    if (d < acc + len || last) {
      const t = d - acc;
      return { p: [q.x + q.dx * t, q.y + q.dy * t], dx: q.dx, dy: q.dy, run: i };
    }
    acc += len;
  }
  return { p: [0, 0], dx: 1, dy: 0, run: 0 };
}

// ---- The least car scale ----------------------------------------------------------------------
const bodyH = (c: CarFact): number => CAR_H * (c.type === 'tank' ? 0.86 : 1);

/** The landing place of the move in the builder, on the track that the route reaches (LANDING). */
export function landingOf(state: ModelState | null, F: YardFacts, b: Builder | null | undefined): { track: string; fit: Land[]; over: Land[] } | null {
  if (!state || !b || (b.act !== 'spot' && b.act !== 'kick') || F.reaches !== b.track) return null;
  const n = Math.max(1, Math.min(b.n, state.engine.length));
  if (!state.engine.length) return null;
  const copy = JSON.parse(JSON.stringify(state)) as ModelState;
  const plan = spotPlan(copy, b.track, n, b.act === 'kick') as { yourPos: number[]; nearEdge: number };
  const t = F.tracks.find((q) => q.id === b.track) as TrackFact;
  const marks = state.engine.slice(state.engine.length - n);
  const cars = marks.map((m, k) => {
    const h = F.engine.held.find((c) => c.mark === m) as CarFact;
    const x0 = t.swx + plan.yourPos[k];
    return { car: h, x0, x1: x0 + h.len };
  });
  const over = plan.nearEdge < CLEAR;
  return { track: b.track, fit: over ? [] : cars.filter((l) => l.x1 > Math.max(l.x0, t.swx) + 1), over: over ? cars : [] };
}

/** The least car scale of the wide form and of the tall form for one state (measured words). */
export function leastScale(F: YardFacts, M: Measures, land: { track: string; fit: Land[] } | null): { wide: number; tall: number } {
  const pairs = (items: Array<{ c: number; w: number }>): number => {
    let need = 0;
    for (let i = 0; i + 1 < items.length; i++) need = Math.max(need, ((items[i].w + items[i + 1].w) / 2 + 1.5) / (items[i + 1].c - items[i].c));
    return need;
  };
  let onTracks = 0;
  for (const t of F.tracks) {
    const lands = land && land.track === t.id ? land.fit.map((l) => ({ c: (l.x0 + l.x1) / 2, w: M.num(l.car.number) })) : [];
    onTracks = Math.max(onTracks, pairs(lands.concat(t.cars.map((c) => ({ c: (c.x0 + c.x1) / 2, w: M.num(c.number) })))));
  }
  const e = F.engine;
  const onLead = pairs([{ c: e.cx, w: M.engW }].concat(e.held.map((c) => ({ c: (c.x0 + c.x1) / 2, w: M.num(c.number) }))));
  let tagFlat = 0, tagUp = 0;
  for (const t of F.tracks) for (const c of t.cars) tagFlat = Math.max(tagFlat, (M.tagH + 1) / bodyH(c));
  for (const c of e.held) { tagFlat = Math.max(tagFlat, (M.tagH + 1) / bodyH(c)); tagUp = Math.max(tagUp, M.tagW / bodyH(c)); }
  return { wide: Math.max(S_MIN, onTracks, onLead, tagFlat), tall: Math.max(S_MIN, onTracks, tagFlat, tagUp) };
}

// ---- The wide form ------------------------------------------------------------------------------
interface Zone { t: TrackFact; a: number; c: number; B: number }

function wideZones(F: YardFacts, reaches: string | null, s: number, M: Measures, land: { track: string; fit: Land[] } | null): Zone[] {
  return F.tracks.map((t) => {
    const lined = reaches === t.id;
    const a = t.foulX + (lined ? (M.foulW / 2) / s + 3 : 9);
    const lands = land && land.track === t.id ? land.fit.map((l) => l.x0) : [];
    const first = Math.min(TR - STUB, ...t.cars.map((c) => c.x0), ...lands);
    const c = Math.max(a, first - 6);
    return { t, a, c, B: c - a };
  });
}
const dMaxAt = (zones: Zone[], s: number): number => Math.max(0, Math.min(...zones.map((z) => z.B * s - Math.min(BMIN, Math.max(0, z.B * s)))));

/** The length that each track can give, over the seven routes. */
function dMaxAll(F: YardFacts, s: number, M: Measures, land: { track: string; fit: Land[] } | null): number {
  return Math.min(...ROUTES7.map((r) => {
    const reaches = TRACK_IDS.find((id) => r[id] === 'reverse') || null;
    return dMaxAt(wideZones(F, reaches, s, M, land && land.track === reaches ? land : null), s);
  }));
}

/** The frame of the wide form for a list of states, or null when the wide form does not hold. */
export function wideFrame(width: number, states: YardFacts[], M: Measures): Frame | null {
  const x0u = Math.min(VIEW_X0, ...states.map((F) => F.engine.x0 - 6));
  const unitsTrue = TR + 2.5 - x0u;
  const sMin = Math.max(...states.map((F) => leastScale(F, M, null).wide));
  const column = (compact: boolean) => {
    const boxes = states.map((F) => F.tracks.map((t) => M.end(t, compact)));
    const endW = Math.max(...boxes.flat().map((b) => b.w));
    const colW = endW + 9 + 4;
    const sTrue = (width - colW) / unitsTrue;
    const s = Math.max(sMin, Math.min(sTrue, S_MAX_WIDE));
    const pitch = PITCH * s;
    const clash = boxes.some((bs) => bs.some((b, i) => i + 1 < bs.length && (b.h + bs[i + 1].h) / 2 + 2 > pitch));
    return { compact, endW, colW, s, clash };
  };
  let col = column(false);
  if (col.clash) col = column(true);
  if (col.clash) return null;
  const s = col.s;
  const D = Math.max(0, unitsTrue * s + col.colW - width);
  for (const F of states) if (D > dMaxAll(F, s, M, null) + 0.01) return null;
  return { form: 'wide', s, D, x0u, endW: col.endW, compact: col.compact, legend: 'below', width };
}

/** True when the kept wide frame draws this state with no defect (FORM-KEEP). */
export function wideHolds(fr: Frame, F: YardFacts, M: Measures, land: { track: string; fit: Land[] } | null): boolean {
  if (leastScale(F, M, land).wide > fr.s + 1e-9) return false;
  if (F.engine.x0 - 6 < fr.x0u - 1e-9) return false;
  const boxes = F.tracks.map((t) => M.end(t, fr.compact));
  if (boxes.some((b) => b.w > fr.endW + 0.5)) return false;
  if (boxes.some((b, i) => i + 1 < boxes.length && (b.h + boxes[i + 1].h) / 2 + 2 > PITCH * fr.s)) return false;
  return fr.D <= dMaxAll(F, fr.s, M, land) + 0.01;
}

/** The wide form of one state in a kept frame (the sketch, planWide). */
export function planWide(F: YardFacts, fr: Frame, M: Measures, width: number, land: { track: string; fit: Land[]; over: Land[] } | null): Layout {
  const s = fr.s, D = fr.D;
  const XL = (x: number): number => (x - fr.x0u) * s;
  const Y = (y: number): number => (y - VIEW_Y0) * s;
  const xEnd = XL(TR) - D;
  const zones = wideZones(F, F.reaches, s, M, land);
  const swp: Record<string, Pt> = {};
  TRACK_IDS.forEach((id, i) => { const p = switchPos(i); swp[id] = [XL(p.x), Y(p.y)]; });
  const L: Layout = {
    form: 'wide', s, D, w: width, h: Math.round((VIEW_Y1 - VIEW_Y0) * s), tr: {}, swp,
    foot: [XL(FOOT.x), Y(FOOT.y)], leadStart: [XL(LEAD_LEFT), Y(LEAD_Y)], mainEnd: [XL(MAIN_OUT.x), Y(MAIN_OUT.y)],
    lead: [ray(LEAD_LEFT - 4000, FOOT.x, [XL(LEAD_LEFT - 4000), Y(LEAD_Y)], 1, 0, s)],
    items: [], held: [], engine: null as unknown as Placed, brks: [], conts: [], turns: [], cutline: null,
    ends: [], endW: fr.endW, compact: fr.compact, caps: [], labels: [], leadBar: null, stands: [], foulPlate: null,
    leadTop: 0, leadBot: 0, sideMin: 0, folds: 0,
  };
  let lo = -Infinity, hi = Infinity;
  zones.forEach((z) => { lo = Math.max(lo, XL(z.a)); hi = Math.min(hi, xEnd - (TR - z.c) * s); });
  const common = D > 0.5 && hi - lo >= 18;
  for (const z of zones) {
    const t = z.t, y = Y(t.y), pa = XL(z.a), pc = xEnd - (TR - z.c) * s;
    const map = (x: number): number => (x <= z.a ? XL(x) : x >= z.c ? xEnd - (TR - x) * s : pa + (x - z.a) / ((z.c - z.a) || 1) * (pc - pa));
    const pieces: Piece[] = [ray(t.swx, z.a, [XL(t.swx), y], 1, 0, s)];
    if (z.c > z.a) pieces.push(run(z.a, z.c, [pa, y], [pc, y]));
    pieces.push(ray(z.c, TR + 4000, [pc, y], 1, 0, s));
    const tr: TrackLayout = {
      id: t.id, y, pieces, lines: [[swp[t.id], [xEnd, y]]], foul: [XL(t.foulX), y], foulL: null,
      stop: [xEnd + 2.5 * s, y], brk: null, routeEnd: [t.cars.length ? map(t.cars[0].x0) : xEnd, y], pa, pc,
    };
    if (D > 0.5) { tr.brk = [common ? (lo + hi) / 2 : (pa + pc) / 2, y]; L.brks.push({ x: tr.brk[0], y, id: t.id, v: false, lit: F.reaches === t.id }); }
    if (land && land.track === t.id) {
      for (const l of land.fit) L.items.push({ key: `land:${l.car.mark}`, kind: 'land', car: l.car, inbound: false, track: t.id, line: 0, cx: (map(l.x0) + map(l.x1)) / 2, cy: y, rot: 0, len: map(l.x1) - map(l.x0) });
      placeOver(L, t, land.over, tr.routeEnd[0], XL(t.swx), y, s);
    }
    for (const c of t.cars) L.items.push({ key: c.mark, kind: 'car', car: c, inbound: false, track: t.id, line: 0, cx: (map(c.x0) + map(c.x1)) / 2, cy: y, rot: 0, len: c.len * s });
    L.tr[t.id] = tr;
  }
  if (common) L.cutline = { x: (lo + hi) / 2, y0: Y(zones[zones.length - 1].t.y) - 14 * s, y1: Y(zones[0].t.y) + 14 * s };
  // Repair 4 of the review: at a small scale the "foul point" plate of the lined track reaches the
  // track under it; the break mark of that track moves out from under the plate.
  if (F.reaches && !common) {
    const ri = TRACK_IDS.indexOf(F.reaches), under = ri > 0 ? L.tr[TRACK_IDS[ri - 1]] : null;
    const plateBottom = Math.max(FOUL_HALF * s + 6, M.target / 2 - 8 * s + 3) + M.plateH;
    const markTop = PITCH * s - Math.round(15 * s + 4) / 2;
    if (under && under.brk && plateBottom + 2 > markTop) {
      const t = F.tracks[ri];
      const fx = XL(t.foulX), half = M.foulW / 2 + 13;
      if (Math.abs(under.brk[0] - fx) < half) {
        const nx = fx + half <= under.pc - 13 ? fx + half : (fx - half >= under.pa + 13 ? fx - half : under.brk[0]);
        under.brk[0] = nx;
        const b = L.brks.find((k) => k.id === TRACK_IDS[ri - 1]);
        if (b) b.x = nx;
      }
    }
  }
  const e = F.engine;
  L.engine = { key: 'engine', kind: 'engine', car: null, inbound: false, track: null, line: 0, cx: XL(e.cx), cy: Y(LEAD_Y), rot: 0, len: ENGLEN * s };
  for (const c of e.held) L.held.push({ key: c.mark, kind: 'car', car: c, inbound: false, track: null, line: 0, cx: XL((c.x0 + c.x1) / 2), cy: Y(LEAD_Y), rot: 0, len: c.len * s });
  // The plates at the end of each track, past the end stop.
  L.ends = F.tracks.map((t) => ({ t, x: xEnd + 2.5 * s + 9, y: Y(t.y) }));
  // The three labels of today, and the room bar of the lead.
  let rightLeft = width;
  LABELS.forEach((lb, k) => { if (lb.align === 'right') { L.labels.push({ k, x: width - 8, y: Y(lb.y), a: 'r', wrapW: 0 }); rightLeft = Math.min(rightLeft, width - 8 - M.labels[k].w); } });
  LABELS.forEach((lb, k) => {
    if (lb.align === 'right') return;
    const ly = Y(lb.y);
    if (lb.y > LEAD_Y - 60) {
      // Repair 3: the label of the lead stays over the engine; the lead bar goes over the label when
      // the place at its right belongs to the AS71 switch.
      const lw = M.labels[k].w, lh = M.labels[k].h, yLab = Math.min(ly, Y(LEAD_Y) - ENG_H * s / 2 - lh / 2 - 3);
      const sw0 = switchPos(0);
      const limitX = Math.min(XL(sw0.x) - 6 * s - M.target / 2, XL(sw0.x + CLEAR) - M.foulW / 2) - 4;
      L.labels.push({ k, x: 4, y: yLab, a: 'l', wrapW: 0 });
      L.leadBar = 4 + lw + 6 + M.leadBarW <= limitX ? { x: 4 + lw + 6, y: yLab, a: 'l' } : { x: 4, y: yLab - lh / 2 - 2 - M.leadBarH / 2, a: 'l' };
    } else if (XL(lb.x) + M.labels[k].w + 8 <= rightLeft) {
      L.labels.push({ k, x: XL(lb.x), y: ly, a: 'l', wrapW: 0 });
    } else {
      // No room at the right of the main line: the label stands at its left.
      const top = switchPos(NTRACK - 1);
      const xLine = top.x + (top.y - lb.y) * (MAIN_OUT.x - top.x) / (top.y - MAIN_OUT.y);
      L.labels.push({ k, x: Math.min(XL(xLine) - 26 * s, XL(top.x) - 6 * s - M.target / 2 - 4), y: ly, a: 'r', wrapW: 0 });
    }
  });
  // The switch stands, their 44 px boxes, and the plates with the word at the left of each stand.
  TRACK_IDS.forEach((id) => {
    const [px, py] = swp[id];
    const sx = px - 12 * s, sy = py - 16 * s, d = Math.max(5, 5.5 * s);
    const bx = px - 6 * s, by = py - 8 * s;
    L.stands.push({ id, px, py, sx, sy, d, bx, by, plate: { x: Math.min(sx - d - 7, bx - M.target / 2 - 3), y: sy } });
  });
  if (F.reaches) {
    const tr = L.tr[F.reaches];
    L.foulPlate = { x: tr.foul[0], y: tr.foul[1] + Math.max(FOUL_HALF * s + 6, M.target / 2 - 8 * s + 3), a: 'tc' };
  }
  return L;
}

/** A landing that does not fit: outlines from the first car back toward the switch, cut there. */
function placeOver(L: Layout, t: TrackFact, over: Land[], fromPx: number, limitPx: number, y: number, s: number): void {
  let x1 = fromPx;
  for (let i = over.length - 1; i >= 0 && x1 > limitPx; i--) {
    const len = (over[i].x1 - over[i].x0) * s, x0 = Math.max(limitPx, x1 - len);
    if (x1 - x0 > 2) L.items.push({ key: `land:${over[i].car.mark}`, kind: 'land', car: over[i].car, inbound: false, track: t.id, line: 0, cx: (x0 + x1) / 2, cy: y, rot: 0, len: x1 - x0, cut: x1 - x0 < len - 0.5 });
    x1 -= len;
  }
}

// ---- The tall form ------------------------------------------------------------------------------
/** A body of a row of the tall form: a car, or a landing outline of the move in the builder. */
interface Tok { kind: 'car' | 'land'; car: CarFact; x0: number; x1: number }
interface TallZone {
  t: TrackFact; lined: boolean; Xa: (x: number) => number; xF: number; xA: number; foulL: number | null;
  toks: Tok[]; aU: number; cU: number; trueFits: boolean; oneLine: boolean;
}

function tallZones(F: YardFacts, reaches: string | null, s: number, M: Measures, width: number, land: { track: string; fit: Land[] } | null): TallZone[] {
  const xs = TALL_XS, dz = TALL_DZ, diag = dz * Math.SQRT2, xEnd = width - 12;
  return F.tracks.map((t) => {
    const lined = reaches === t.id;
    const Xa = (x: number): number => xs + dz + ((x - t.swx) * s - diag);
    const xF = Xa(t.foulX);
    let xA = xF + 10, foulL: number | null = null;
    if (lined) { foulL = Math.max(xF - M.foulW / 2, xs + 19); xA = Math.max(xA, foulL + M.foulW + 4); }
    const toks: Tok[] = [];
    if (land && land.track === t.id) for (const l of land.fit) toks.push({ kind: 'land', car: l.car, x0: l.x0, x1: l.x1 });
    for (const c of t.cars) toks.push({ kind: 'car', car: c, x0: c.x0, x1: c.x1 });
    const first = toks.length ? toks[0].x0 : TR - STUB;
    const aU = t.swx + (xA - xs - dz + diag) / s, cU = first - 6;
    const trueFits = Xa(TR) + 2.5 * s <= xEnd + 0.01;
    const oneLine = trueFits || (cU >= aU && (TR - cU) * s + 2.5 * s + Math.min(BMIN, (cU - aU) * s) <= xEnd - xA + 0.01);
    return { t, lined, Xa, xF, xA, foulL, toks, aU, cU, trueFits, oneLine };
  });
}

/** The car scale of the tall form for one state: the largest that keeps each row in one line in each route. */
function tallScaleOf(F: YardFacts, sMin: number, M: Measures, width: number): number {
  for (let k = S_MAX_TALL; k >= sMin - 1e-9; k -= 0.01) {
    if (ROUTES7.every((r) => tallZones(F, TRACK_IDS.find((id) => r[id] === 'reverse') || null, k, M, width, null).every((z) => z.oneLine))) return k;
  }
  return sMin;
}

/** The frame of the tall form for a list of states. */
export function tallFrame(width: number, states: YardFacts[], M: Measures): Frame {
  const sMin = Math.max(...states.map((F) => leastScale(F, M, null).tall));
  const s = Math.max(sMin, Math.min(...states.map((F) => tallScaleOf(F, sMin, M, width))));
  const sideMin = 8 + M.labels[0].w + 14;
  const sideX = Math.max(TALL_XS + 190, sideMin), sideW = Math.min(520, width - sideX - 12);
  return { form: 'tall', s, D: 0, x0u: 0, endW: 0, compact: false, legend: sideW >= 300 ? 'side' : 'below', width };
}

/** True when the kept tall frame draws this state with no touching number plates. */
export function tallHolds(fr: Frame, F: YardFacts, M: Measures, land: { track: string; fit: Land[] } | null): boolean {
  return leastScale(F, M, land).tall <= fr.s + 1e-9;
}

/** The tall form of one state in a kept frame (the sketch, planTall). */
export function planTall(F: YardFacts, fr: Frame, M: Measures, width: number, land: { track: string; fit: Land[]; over: Land[] } | null): Layout {
  const s = fr.s, xs = TALL_XS, dz = TALL_DZ, diag = dz * Math.SQRT2, xEnd = width - 12, xLine = xs + dz + TALL_CONT + 6;
  const capX = xs + 24, capW = width - capX - 8;
  const zones = tallZones(F, F.reaches, s, M, width, land);
  const L: Layout = {
    form: 'tall', s, D: 0, w: width, h: 0, tr: {}, swp: {}, foot: [xs, 0], leadStart: [xs, 0], mainEnd: [xs, -4], lead: [],
    items: [], held: [], engine: null as unknown as Placed, brks: [], conts: [], turns: [], cutline: null,
    ends: [], endW: 0, compact: false, caps: [], labels: [], leadBar: null, stands: [], foulPlate: null,
    leadTop: 0, leadBot: 0, sideMin: 0, folds: 0,
  };
  const lineH = CAR_H * s + 3 + M.numH + 9;
  // The top: the main line and its two labels. A label wider than the picture wraps (repair 5).
  let y = 6, labX = xs + 12, topH = 0;
  const tops = LABELS.map((_, k) => k).filter((k) => LABELS[k].y < switchPos(NTRACK - 1).y);
  tops.forEach((k, n) => {
    const maxW = width - (xs + 12) - 8;
    let w = M.labels[k].w, h = M.labels[k].h, wrapW = 0;
    if (w > maxW) { wrapW = maxW; w = maxW; h = M.labelWrapH(k, maxW); }
    if (n === 0) { L.labels.push({ k, x: labX, y: y + h / 2, a: 'l', wrapW }); labX += w + 8; topH = h; }
    else if (!wrapW && labX + w <= width - 8) { L.labels.push({ k, x: width - 8, y: y + h / 2, a: 'r', wrapW: 0 }); topH = Math.max(topH, h); }
    else { y += topH + 4; L.labels.push({ k, x: xs + 12, y: y + h / 2, a: 'l', wrapW }); topH = h; }
    if (n === tops.length - 1) y += topH + 4;
  });
  // The rows, AS76 first.
  zones.slice().reverse().forEach((z) => {
    const t = z.t;
    // Repair 6: the height of the caption does not follow the lining word.
    const capH = Math.max(M.cap(t, 'normal', capW), M.cap(t, 'reverse', capW));
    L.caps.push({ t, x: capX, y: y + 4, w: capW });
    const y0 = y + 4 + capH + 5 + 10 * s;
    const P: Pt = [xs, y0 + dz];
    L.swp[t.id] = P;
    const corner: Pt = [xs + dz, y0];
    const cornerU = t.swx + diag / s;
    const tr: TrackLayout = { id: t.id, y: y0, pieces: [run(t.swx, cornerU, P, corner)], lines: [], foul: [z.xF, y0], foulL: z.foulL, stop: [0, y0], brk: null, routeEnd: [0, y0], pa: 0, pc: 0 };
    const put = (tk: Tok, px0: number, yy: number, line: number): void => {
      L.items.push({ key: tk.kind === 'land' ? `land:${tk.car.mark}` : tk.car.mark, kind: tk.kind, car: tk.car, inbound: false, track: t.id, line, cx: px0 + (tk.x1 - tk.x0) * s / 2, cy: yy, rot: 0, len: (tk.x1 - tk.x0) * s });
    };
    if (z.oneLine) {
      const map = z.trueFits ? z.Xa : (x: number): number => xEnd - 2.5 * s - (TR - x) * s;
      const endPx = map(TR);
      tr.lines.push([P, corner, [endPx, y0]]);
      tr.stop = [endPx + 2.5 * s, y0];
      z.toks.forEach((tk) => put(tk, map(tk.x0), y0, 0));
      if (z.trueFits) tr.pieces.push(ray(cornerU, TR + 4000, corner, 1, 0, s));
      else {
        tr.pieces.push(ray(cornerU, z.aU, corner, 1, 0, s));
        tr.pieces.push(run(z.aU, z.cU, [z.xA, y0], [map(z.cU), y0]));
        tr.pieces.push(ray(z.cU, TR + 4000, [map(z.cU), y0], 1, 0, s));
        if ((z.cU - z.aU) * s - (map(z.cU) - z.xA) > 1) { tr.brk = [(z.xA + map(z.cU)) / 2, y0]; L.brks.push({ x: tr.brk[0], y: y0, id: t.id, v: false, lit: F.reaches === t.id }); }
      }
      tr.routeEnd = [t.cars.length ? map(t.cars[0].x0) : endPx, y0];
      tr.pa = z.xA; tr.pc = map(z.cU);
    } else {
      L.folds += 1;
      const shrunk = z.cU >= z.aU && (z.cU - z.aU) * s > BMIN;
      const start0 = z.cU >= z.aU ? z.xA + Math.min(BMIN, (z.cU - z.aU) * s) : z.Xa(z.cU);
      if (z.cU >= z.aU) { tr.pieces.push(ray(cornerU, z.aU, corner, 1, 0, s)); tr.pieces.push(run(z.aU, z.cU, [z.xA, y0], [start0, y0])); }
      else tr.pieces.push(ray(cornerU, z.cU, corner, 1, 0, s));
      const lines: Array<{ startPx: number; u0: number; toks: Tok[]; y: number }> = [];
      let cur = { startPx: start0, u0: z.cU, toks: [] as Tok[], y: y0 };
      z.toks.forEach((tk) => {
        if (cur.startPx + (tk.x1 - cur.u0) * s > xEnd - TALL_CONT && cur.toks.length) { lines.push(cur); cur = { startPx: xLine, u0: tk.x0, toks: [], y: y0 + lines.length * lineH }; }
        cur.toks.push(tk);
      });
      lines.push(cur);
      lines.forEach((ln, k) => {
        const last = k === lines.length - 1;
        const px = (x: number): number => ln.startPx + (x - ln.u0) * s;
        const endPx = last ? px(TR) : px(ln.toks[ln.toks.length - 1].x1) + 8;
        tr.lines.push(k === 0 ? [P, corner, [endPx, ln.y]] : [[xLine - 6, ln.y], [endPx, ln.y]]);
        ln.toks.forEach((tk) => put(tk, px(tk.x0), ln.y, k));
        tr.pieces.push(ray(ln.u0, last ? TR + 4000 : lines[k + 1].u0, [ln.startPx, ln.y], 1, 0, s));
        if (last) tr.stop = [endPx + 2.5 * s, ln.y];
        else {
          L.conts.push({ from: [endPx, ln.y], to: [xLine - 6, ln.y + lineH] });
          // TURN-MARK: a coupler mark on both sides of a turn that falls inside a coupled cut.
          const a = ln.toks[ln.toks.length - 1], b = lines[k + 1].toks[0];
          if (a.kind === 'car' && b.kind === 'car' && Math.abs(a.x1 - b.x0) < 1e-6) {
            L.turns.push([px(a.x1), ln.y]);
            L.turns.push([xLine, lines[k + 1].y]);
          }
        }
        if (k === 0) tr.routeEnd = [t.cars.length && ln.toks.some((q) => q.car === t.cars[0]) ? px(t.cars[0].x0) : endPx, y0];
      });
      if (shrunk) { tr.brk = [z.xA + BMIN / 2, y0]; L.brks.push({ x: tr.brk[0], y: y0, id: t.id, v: false, lit: F.reaches === t.id }); }
      tr.pa = z.xA; tr.pc = start0;
    }
    if (land && land.track === t.id) placeOver(L, t, land.over, tr.routeEnd[0], xs + dz, y0, s);
    L.tr[t.id] = tr;
    y = tr.lines[tr.lines.length - 1][tr.lines[tr.lines.length - 1].length - 1][1] + 10 * s + 3 + M.numH + 8;
  });
  // The break marks of rows in one line stand in one column when the rows allow it.
  const one = zones.filter((z) => z.oneLine && !z.trueFits && L.tr[z.t.id].brk);
  if (one.length >= 2) {
    const lo = Math.max(...one.map((z) => z.xA)) + 9, hi = Math.min(...one.map((z) => xEnd - 2.5 * s - (TR - z.cU) * s)) - 9;
    if (hi >= lo) one.forEach((z) => { const b = L.brks.find((k) => k.id === z.t.id); const mid = (lo + hi) / 2; if (b) b.x = mid; (L.tr[z.t.id].brk as Pt)[0] = mid; });
  }
  // The foot and the lead, down from the foot. The 30 units next to the foot keep s; more empty lead shrinks.
  const e = F.engine, cutEnd = e.cutEnd;
  const yF = y + 6;
  L.foot = [xs, yF];
  const dTrue = (FOOT.x - cutEnd) * s, dShown = Math.min(dTrue, CLEAR * s + BMIN);
  if (dTrue - dShown > 1) L.brks.push({ x: xs, y: yF + CLEAR * s + BMIN / 2, id: null, v: true, lit: true });
  const yCut = yF + dShown;
  const leadPos = (x: number): Pt => [xs, yCut + (cutEnd - x) * s];
  L.lead = [ray(LEAD_LEFT - 4000, cutEnd, leadPos(LEAD_LEFT - 4000), 0, -1, s), run(cutEnd, FOOT.x, [xs, yCut], [xs, yF])];
  L.engine = { key: 'engine', kind: 'engine', car: null, inbound: false, track: null, line: 0, cx: xs, cy: leadPos(e.cx)[1], rot: -90, len: ENGLEN * s };
  for (const c of e.held) L.held.push({ key: c.mark, kind: 'car', car: c, inbound: false, track: null, line: 0, cx: xs, cy: leadPos((c.x0 + c.x1) / 2)[1], rot: -90, len: c.len * s });
  const yBot = leadPos(e.x0)[1] + 40 * s;
  L.leadStart = [xs, yBot];
  L.leadTop = yF; L.leadBot = yBot;
  let yy = yBot + 6;
  const lw = M.labels[0].w, lh = M.labels[0].h;
  L.labels.push({ k: 0, x: 8, y: yy + lh / 2, a: 'l', wrapW: 0 });
  L.sideMin = 8 + lw + 14;
  yy += lh + 4;
  L.leadBar = { x: 8, y: yy + lh / 2, a: 'l' };
  yy += lh + 6;
  L.h = Math.round(yy + 2);
  // The switch stands and their boxes. The word stands in the row caption.
  TRACK_IDS.forEach((id) => {
    const [px, py] = L.swp[id];
    L.stands.push({ id, px, py, sx: px - 15, sy: py - 3, d: Math.max(5, 5.5 * s), bx: px - 7, by: py - 1, plate: null });
  });
  if (F.reaches) {
    const tr = L.tr[F.reaches];
    if (tr.foulL != null) L.foulPlate = { x: tr.foulL, y: tr.foul[1] + FOUL_HALF * s + 6 + M.plateH / 2, a: 'l' };
  }
  return L;
}

// ---- The lined route, the paths of motion, the trace ------------------------------------------

/** The lined route in px: from the far end of the held cut, along the lead, up the ladder, into the track. */
export function routePx(L: Layout, F: YardFacts): Pt[] {
  const pts: Pt[] = [pointOn(L.lead, F.engine.cutEnd), L.foot];
  for (const id of TRACK_IDS) {
    pts.push(L.swp[id]);
    if (F.reaches === id) {
      const l0 = L.tr[id].lines[0];
      for (let k = 1; k < l0.length - 1; k++) pts.push(l0[k]);
      pts.push(L.tr[id].routeEnd);
      return pts;
    }
  }
  pts.push(L.mainEnd);
  return pts;
}

/** The runs of a route in px, with the unit arclength of that route as u. */
export function pathOf(L: Layout, path: PathKind): Piece[] {
  const shift = (pieces: Piece[], du: number): Piece[] => pieces.map((p) => ({ ...p, u0: p.u0 + du, u1: p.u1 + du }));
  const leadRuns = shift(L.lead, -LEAD_LEFT);                     // u = x - LEAD_LEFT on LEAD_ROUTE and engineRoute
  if (path.kind === 'lead') return leadRuns.map((p, i, a) => (i === a.length - 1 ? { ...p, u1: p.u1 + 4000 } : p));
  if (path.kind === 'track') {
    const i = path.index, id = TRACK_IDS[i];
    const sArc = switchArc(i);
    const ladder = run(S_FOOT, sArc, L.foot, L.swp[id]);
    const leadUpToFoot = leadRuns.map((p) => ({ ...p, u1: Math.min(p.u1, S_FOOT) })).filter((p) => p.u1 > p.u0);
    return [...leadUpToFoot, ladder, ...shift(L.tr[id].pieces, sArc - switchPos(i).x)];
  }
  // The road (THROUGH_ROUTE): the main line, down the ladder past each switch, the foot, out the lead.
  const pieces: Piece[] = [];
  let u = 0;
  const pts: Pt[] = [L.mainEnd, ...TRACK_IDS.slice().reverse().map((id) => L.swp[id]), L.foot];
  const units = THROUGH_ROUTE.slice(0, pts.length);
  for (let k = 0; k + 1 < pts.length; k++) {
    const du = Math.hypot(units[k + 1].x - units[k].x, units[k + 1].y - units[k].y);
    pieces.push(run(u, u + du, pts[k], pts[k + 1]));
    u += du;
  }
  // Down the lead: x falls from the foot, so the lead runs are walked backward.
  const uFoot = u;
  const back = L.lead.slice().reverse().map((p) => {
    const a = pointOn([p], p.u1), b = pointOn([p], p.u0);
    return run(uFoot + (FOOT.x - p.u1), uFoot + (FOOT.x - p.u0), a, b);
  }).filter((p) => p.u1 > p.u0);
  return [...pieces, ...back];
}

/**
 * The px distances along a path where the drawn lead ends, in the tall form: a body whose centre is
 * beyond the drawn end of the lead is not drawn. An engine route and the lead walk the lead up from
 * its far end, so the limit is a least distance; the road walks it down, so the limit is a largest
 * distance. In the wide form the picture edge clips the lead.
 */
function leadLimits(L: Layout, path: PathKind, pieces: Piece[]): [number, number] {
  if (L.form === 'wide') return [-Infinity, Infinity];
  let acc = 0;
  for (const p of pieces) {
    const len = (p.u1 - p.u0) * p.k;
    const y1 = p.y + p.dy * len;
    const lo = Math.min(p.y, y1) - 1e-9, hi = Math.max(p.y, y1) + 1e-9;
    if (Math.abs(p.dy) > 0.5 && L.leadBot >= lo && L.leadBot <= hi) {
      const d = acc + (L.leadBot - p.y) / p.dy;
      return path.kind === 'through' ? [-Infinity, d] : [d, Infinity];
    }
    acc += len;
  }
  return [-Infinity, Infinity];
}

/** Place the bodies of a chain on the drawn route (requirement 33). */
export function placeChain(L: Layout, chain: ChainSpec): Placed[] {
  const pieces = pathOf(L, chain.path);
  const dA = distOf(pieces, chain.anchorS);
  const [min, max] = leadLimits(L, chain.path, pieces);
  const out: Placed[] = [];
  for (const { body, offset } of chain.bodies) {
    const dc = dA - (offset + body.len / 2) * L.s;
    if (dc < min || dc > max) continue;
    const at = atDist(pieces, dc);
    out.push({ key: body.key, kind: body.kind, car: body.car, inbound: body.inbound, track: null, line: at.run, cx: at.p[0], cy: at.p[1], rot: Math.atan2(at.dy, at.dx) * 180 / Math.PI, len: body.len * L.s });
  }
  return out;
}

/** The trace of the last move (R7-P15): the drawn route from the far end of the held cut to the place of contact. */
export function tracePx(L: Layout, F: YardFacts, track: string, contactX: number): Pt[][] {
  const i = TRACK_IDS.indexOf(track);
  const pieces = pathOf(L, { kind: 'track', index: i });
  const sArc = switchArc(i);
  const d0 = distOf(pieces, F.engine.cutEnd - LEAD_LEFT);
  const d1 = distOf(pieces, sArc + (contactX - switchPos(i).x));
  if (d1 - d0 < 4) return [];
  const runs: Pt[][] = [];
  let acc = 0;
  for (let k = 0; k < pieces.length; k++) {
    const p = pieces[k], len = (p.u1 - p.u0) * p.k;
    const a = Math.max(d0, acc), b = Math.min(d1, acc + len);
    if (b > a) {
      const pa: Pt = [p.x + p.dx * (a - acc), p.y + p.dy * (a - acc)], pb: Pt = [p.x + p.dx * (b - acc), p.y + p.dy * (b - acc)];
      const lastRun = runs[runs.length - 1];
      const prev = lastRun ? lastRun[lastRun.length - 1] : null;
      if (prev && Math.hypot(prev[0] - pa[0], prev[1] - pa[1]) < 0.5) lastRun.push(pb);
      else runs.push([pa, pb]);
    }
    acc += len;
  }
  return runs;
}

/** The side offset of the trace, in units (a value of the picture). */
export const traceSide = (s: number): number => TRACE_SIDE * s;

// ---- The states of the authored line (requirement 11) ------------------------------------------

/** Replay the authored line of a job on a copy, as the demo does (yardSim.js, autoLine), and return each state. */
export function lineStates(puzzle: ModelPuzzle): ModelState[] {
  const st = freshState(puzzle) as unknown as ModelState;
  const out: ModelState[] = [structuredClone(st)];
  for (const [act, trk, n] of puzzle.opt || []) {
    if (act === 'secure') secure(st, trk);
    else {
      for (const t of TRACK_IDS) st.lined[t] = t === trk ? 'reverse' : 'normal';
      if (act === 'pull') pull(st, trk, n); else if (act === 'kick') kick(st, trk, n); else spot(st, trk, n);
    }
    out.push(structuredClone(st));
  }
  return out;
}

/** The facts of each state of the authored line, with the lining of each state. */
export const lineFacts = (puzzle: ModelPuzzle): YardFacts[] => lineStates(puzzle).map((st) => yardFacts(st, puzzle));

/** The px length of a room bar. */
export const barPx = (units: number): number => Math.round(units * K_BAR);

