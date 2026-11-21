// svg.ts — the one inline SVG of the Yard picture, its plate layer and its control layer.
//
// The root is div.yd-view. It holds one <svg> (aria-hidden), a plate layer with the words as DOM
// text (aria-hidden), and a control layer that holds the six switch buttons of ../access.ts. The drawing
// makes each element one time and then updates it: a paint writes an attribute, a style value or a
// text only when its value changed (requirement 31), and a layout never empties the root.
// The script writes classes and data attributes. Each colour is in drawing.css, on --yard- names.

import type { Layout, Placed, Pt, Measures, Anchor } from './layout.ts';
import { LABELS, CAR_H, ENG_H, LAMP_R, FOUL_HALF, GAUGE, TIE_STEP, along, routePx, barPx } from './layout.ts';
import type { YardFacts, TrackFact, Lining, CarFact } from './bodies.ts';
import { TRACK_IDS } from '../geometry.js';

const NS = 'http://www.w3.org/2000/svg';
const f1 = (n: number): string => String(Math.round(n * 10) / 10);
const ptsAttr = (pts: Pt[]): string => pts.map((p) => f1(p[0]) + ',' + f1(p[1])).join(' ');
export const esc = (t: string): string => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
/** The five type keys of geometry.js; a type key names the tone of a car in drawing.css. */
export const TYPE_KEYS = ['box', 'hopper', 'tank', 'centerbeam', 'autorack'];

// ---- One write only when a value changed --------------------------------------------------------
const seen = new WeakMap<Node, Map<string, string>>();
function memo(el: Node): Map<string, string> { let m = seen.get(el); if (!m) { m = new Map(); seen.set(el, m); } return m; }
export function attr(el: Element, name: string, value: string): void { const m = memo(el); if (m.get(name) === value) return; m.set(name, value); el.setAttribute(name, value); }
export function styleOf(el: HTMLElement | SVGElement, prop: string, value: string): void { const m = memo(el); const k = 's:' + prop; if (m.get(k) === value) return; m.set(k, value); el.style.setProperty(prop, value); }
export function textOf(el: Element, value: string): void { const m = memo(el); if (m.get('#t') === value) return; m.set('#t', value); el.textContent = value; }
export function htmlOf(el: Element, value: string): void { const m = memo(el); if (m.get('#h') === value) return; m.set('#h', value); el.innerHTML = value; }

/** A pool of elements by key: get() returns the element of a key and makes it the first time; sweep() removes each element that no get() asked for. */
function pool(parent: Element, make: (key: string) => Element): { get: (key: string) => Element; sweep: () => void } {
  const els = new Map<string, Element>();
  const used = new Set<string>();
  return {
    get(key: string): Element {
      used.add(key);
      let el = els.get(key);
      if (!el) { el = make(key); parent.appendChild(el); els.set(key, el); }
      return el;
    },
    sweep(): void {
      for (const [k, el] of els) if (!used.has(k)) { el.remove(); els.delete(k); }
      used.clear();
    },
  };
}
const svgEl = (tag: string, cls: string): SVGElement => { const e = document.createElementNS(NS, tag) as SVGElement; if (cls) e.setAttribute('class', cls); return e; };
const div = (cls: string): HTMLDivElement => { const d = document.createElement('div'); d.className = cls; return d; };

// ---- The words of the plates (each word is one of the two word tables of requirement 22) ----------
const secHtml = (t: TrackFact): string => (t.securement === 'TIED'
  ? '<span class="dusk-state dusk-state--hold yd-view-sec" data-state="tied">TIED</span>'
  : t.securement === 'LOOSE' ? '<span class="dusk-state dusk-state--caution yd-view-sec" data-state="loose">LOOSE</span>' : '');
const goalHtml = (t: TrackFact): string => (t.goal
  ? `<span class="yd-view-goalpair"><span class="yd-view-goal">BUILD</span><span class="dusk-count yd-view-count">${t.goal.have} / ${t.goal.want}</span></span>` : '');
const kickHtml = (t: TrackFact): string => (t.kickable ? '<span class="yd-view-kick">⚡ KICKABLE</span>' : '');
const linHtml = (lin: Lining): string => `<span class="yd-view-lin" data-state="${lin}">${lin === 'reverse' ? 'REVERSE' : 'NORMAL'}</span>`;
/** A room bar: px for each unit is K_BAR; the filled part is the length that cars take; the dashed part is the landing. */
export function barHtml(lengthU: number, takenU: number, landU: number): string {
  const land = landU > 0 ? `<span class="yd-view-bar-land" style="width:${Math.max(3, barPx(landU))}px;right:${barPx(takenU) - 1}px"></span>` : '';
  return `<span class="yd-view-bar" style="width:${barPx(lengthU)}px"><span class="yd-view-bar-fill" style="width:${barPx(takenU)}px"></span>${land}</span>`;
}
const trackBar = (t: TrackFact, landU: number): string => barHtml(t.room.lengthU + 0, t.room.takenU, landU);
/** The plate past the end stop of a track (wide form). Compact: the kickable mark shares a line. */
export function endHtml(t: TrackFact, compact: boolean, landU: number): string {
  const l1 = `<span class="yd-view-tid">${t.id}</span>${secHtml(t)}`, l2 = goalHtml(t), l3 = kickHtml(t);
  const rows = compact ? [l1 + (l2 ? '' : l3), l2 + (l2 ? l3 : '')] : [l1, l2, l3];
  return rows.filter(Boolean).map((r) => `<div>${r}</div>`).join('') + `<div class="yd-view-barline">${trackBar(t, landU)}</div>`;
}
/** The caption over a row (tall form): the lining word stands here. */
export function capHtml(t: TrackFact, lin: Lining, landU: number): string {
  return `<span class="yd-view-tid">${t.id}</span>${linHtml(lin)}${secHtml(t)}${goalHtml(t)}${kickHtml(t)}<span class="yd-view-barline">${trackBar(t, landU)}</span>`;
}
const leadBarHtml = (F: YardFacts): string => barHtml(F.lead.lengthU, F.lead.takenU, 0);

// ---- The shapes ---------------------------------------------------------------------------------
/** One car, top-down, in its own frame: x along the car, the end toward the switch at the left (the sketch, drawCar). */
export function carShape(g: SVGElement, type: string, loaded: boolean, lenPx: number, s: number, tagZone: number): void {
  const add = (tag: string, cls: string, a: Record<string, string>): SVGElement => { const e = svgEl(tag, cls); for (const k in a) e.setAttribute(k, a[k]); g.appendChild(e); return e; };
  const L = lenPx - 2.4 * s, Hh = CAR_H * s;
  const x0 = -L / 2, x1 = L / 2, y0 = -Hh / 2;
  if (type === 'tank') { const hh = Hh * 0.86; add('rect', 'yd-view-body', { x: f1(x0), y: f1(-hh / 2), width: f1(L), height: f1(hh), rx: f1(hh / 2) }); }
  else add('rect', 'yd-view-body', { x: f1(x0), y: f1(y0), width: f1(L), height: f1(Hh), rx: '1.5' });
  const d0 = x0 + tagZone + (type === 'tank' ? 2 : 1.5), d1 = x1 - (type === 'tank' ? Hh * 0.3 : 3);
  const line = (xa: number, ya: number, xb: number, yb: number): void => { add('line', 'yd-view-detail', { x1: f1(xa), y1: f1(ya), x2: f1(xb), y2: f1(yb) }); };
  if (type === 'box') {
    for (let k = 1; k <= 3; k++) { const x = d0 + (d1 - d0) * (k - 0.5) / 3; line(x, y0 + 2.5, x, y0 + Hh - 2.5); }
  } else if (type === 'hopper') {
    const n = 4, pitch = (d1 - d0) / n, w = Math.max(2.5, pitch - 2.5), hh = Hh * 0.46;
    for (let k = 0; k < n; k++) add('rect', 'yd-view-detail', { x: f1(d0 + k * pitch + (pitch - w) / 2), y: f1(-hh / 2), width: f1(w), height: f1(hh), rx: '1' });
  } else if (type === 'tank') {
    const mx = (d0 + d1) / 2;
    line(d0 + 1, 0, mx - 4.5 * s, 0); line(mx + 4.5 * s, 0, d1, 0);
    add('circle', 'yd-view-detail yd-view-detail-solid', { cx: f1(mx), cy: '0', r: f1(Math.max(2, 2.6 * s)) });
    add('circle', 'yd-view-detail', { cx: f1(mx), cy: '0', r: f1(Math.max(3.4, 4.4 * s)) });
  } else if (type === 'centerbeam') {
    add('rect', 'yd-view-detail yd-view-detail-solid', { x: f1(d0), y: '-1.2', width: f1(d1 - d0), height: '2.4' });
    add('rect', 'yd-view-detail yd-view-detail-solid', { x: f1(d0), y: f1(y0 + 2), width: '2.6', height: f1(Hh - 4) });
    add('rect', 'yd-view-detail yd-view-detail-solid', { x: f1(d1 - 2.6), y: f1(y0 + 2), width: '2.6', height: f1(Hh - 4) });
  } else if (type === 'autorack') {
    const n = Math.max(4, Math.round((d1 - d0) / (3.6 * s)));
    for (let k = 0; k <= n; k++) { const x = d0 + (d1 - d0) * k / n; line(x, y0 + 2.5, x, y0 + Hh - 2.5); }
  }
  if (loaded && type !== 'tank') add('line', 'yd-view-edge', { x1: f1(x0 + 1.5), y1: f1(y0 + 0.5), x2: f1(x1 - 1.5), y2: f1(y0 + 0.5) });
}

/** The engine, top-down, in its own frame: the head (with the headlight) at the left (the sketch, drawEngine). */
function engineShape(g: SVGElement, s: number): void {
  const add = (tag: string, cls: string, a: Record<string, string>): SVGElement => { const e = svgEl(tag, cls); for (const k in a) e.setAttribute(k, a[k]); g.appendChild(e); return e; };
  const len = 64 * s;
  const x0 = -len / 2 + 0.6 * s, x1 = len / 2 - 1.2 * s, Hh = ENG_H * s;
  const hx = x0 + 4.4 * s;
  add('polygon', 'yd-view-beam', { points: ptsAttr([[hx, -1.5 * s], [hx - 36 * s, -9 * s], [hx - 36 * s, 9 * s], [hx, 1.5 * s]]) });
  add('rect', 'yd-view-eng-body', { x: f1(x0), y: f1(-Hh / 2), width: f1(x1 - x0), height: f1(Hh), rx: '2.5' });
  add('rect', 'yd-view-eng-walk', { x: f1(x0 + 2.4 * s), y: f1(-Hh / 2 + 2.4 * s), width: f1(x1 - x0 - 4.8 * s), height: f1(Hh - 4.8 * s), rx: '1' });
  const head = x0, tail = x1;
  const hoodA = head + 8 * s, cabA = tail - 21 * s, cabB = tail - 8 * s, noseB = tail - 3 * s;
  const rect = (cls: string, a: number, b: number, hh: number): void => { add('rect', cls, { x: f1(Math.min(a, b)), y: f1(-hh / 2), width: f1(Math.abs(b - a)), height: f1(hh), rx: '1.5' }); };
  rect('yd-view-eng-hood', hoodA, cabA, 13 * s);
  rect('yd-view-eng-hood', cabB, noseB, 11 * s);
  rect('yd-view-eng-cab', cabA, cabB, 19 * s);
  for (let k = 0; k < 3; k++) add('circle', 'yd-view-eng-fan', { cx: f1(hoodA + (6 + k * 9) * s), cy: '0', r: f1(3.1 * s) });
  add('circle', 'yd-view-eng-lamp', { cx: f1(hx), cy: '0', r: f1(Math.max(2.2, LAMP_R * s)) });
}

/** The sketch's offset of a polyline by d px to the left of the direction of travel (offsetPoly). */
export function offsetPoly(pts: Pt[], d: number): Pt[] {
  const nrm = (a: Pt, b: Pt): [number, number] => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dy / l, -dx / l]; };
  return pts.map((p, i) => {
    let n1 = i > 0 ? nrm(pts[i - 1], p) : null;
    let n2 = i < pts.length - 1 ? nrm(p, pts[i + 1]) : null;
    if (!n1) n1 = n2 as [number, number];
    if (!n2) n2 = n1;
    let mx = n1[0] + n2[0], my = n1[1] + n2[1];
    const l = Math.hypot(mx, my) || 1; mx /= l; my /= l;
    const k = d / ((mx * n1[0] + my * n1[1]) || 1);
    return [p[0] + mx * k, p[1] + my * k];
  });
}

// ---- The scene that one paint draws -------------------------------------------------------------
export interface Scene {
  L: Layout;
  F: YardFacts;
  /** Bodies of the chains that move in this frame, and the coupler marks between them. */
  moving: Placed[];
  movingCouplers: Array<{ p: Pt; dx: number; dy: number }>;
  /** Cars that stand in the model but are not drawn on their track in this frame. */
  hidden: Set<string>;
  /** The engine and its held cut at rest are not drawn (a chain draws them, or the arrival hides them). */
  engineMoves: boolean;
  /** After Depart, for a later job: the lead shows no engine and no held car. */
  departed: boolean;
  /** The trace of the last move: px runs from the lead to the place of contact; toLead points the arrow at the lead. */
  trace: { runs: Pt[][]; toLead: boolean } | null;
  /** The landing length on the track of the move in the builder (units), for its room bar. */
  landU: Record<string, number>;
}

export interface Renderer {
  root: HTMLDivElement;
  plates: HTMLDivElement;
  controls: HTMLDivElement;
  probe: HTMLDivElement;
  draw(sc: Scene, M: Measures): void;
  makeMeasures(): Measures;
  clearProbe(): void;
}

/** Make the root of the picture in the host, one time. */
export function createRenderer(host: HTMLElement): Renderer {
  const root = div('yd-view');
  const svg = svgEl('svg', '') as SVGSVGElement;
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const defs = svgEl('defs', '');
  // One gradient for each type of car, and the light wedge of the engine. Each stop takes its
  // colour from drawing.css; the small pictures of the legend use these ids also.
  for (const t of TYPE_KEYS) {
    const lg = svgEl('linearGradient', '');
    for (const [k, v] of Object.entries({ id: `yd-view-g-${t}`, x1: '0', y1: '0', x2: '0', y2: '1' })) lg.setAttribute(k, v);
    const s0 = svgEl('stop', `yd-view-gs-${t}-hi`); s0.setAttribute('offset', '0');
    const s1 = svgEl('stop', `yd-view-gs-${t}-lo`); s1.setAttribute('offset', '1');
    lg.append(s0, s1); defs.appendChild(lg);
  }
  const beam = svgEl('linearGradient', '');
  for (const [k, v] of Object.entries({ id: 'yd-view-g-beam', x1: '1', y1: '0', x2: '0', y2: '0' })) beam.setAttribute(k, v);
  const b0 = svgEl('stop', 'yd-view-gs-beam0'); b0.setAttribute('offset', '0');
  const b1 = svgEl('stop', 'yd-view-gs-beam1'); b1.setAttribute('offset', '1');
  beam.append(b0, b1); defs.appendChild(beam);
  const clip = svgEl('clipPath', ''); clip.setAttribute('id', 'yd-view-clip');
  const clipRect = svgEl('rect', ''); clip.appendChild(clipRect); defs.appendChild(clip);
  svg.appendChild(defs);
  const layer = (cls: string): SVGElement => { const g = svgEl('g', cls); svg.appendChild(g); return g; };
  const gBallast = layer('yd-view-l-ballast'), gTies = layer('yd-view-l-ties'), gCut = layer('yd-view-l-cut');
  const gRails = layer('yd-view-l-rails'), gMarks = layer('yd-view-l-marks'), gRoute = layer('yd-view-l-route');
  const gTrace = layer('yd-view-l-trace'), gCars = layer('yd-view-l-cars'), gEngine = layer('yd-view-l-engine'), gStands = layer('yd-view-l-stands');
  // The trace is one group: it has the class yd-view-trace only while a trace shows (requirement 36).
  const gTraceOne = svgEl('g', ''); gTrace.appendChild(gTraceOne);
  const plates = div('yd-view-plates');
  plates.setAttribute('aria-hidden', 'true');
  const probe = div('yd-view-probe');
  plates.appendChild(probe);
  const controls = div('yd-view-controls');
  root.append(svg, plates, controls);
  host.appendChild(root);

  const line = (cls: string) => (): Element => svgEl('polyline', cls);
  const P = {
    ballast: pool(gBallast, line('yd-view-ballast')),
    ties: pool(gTies, line('yd-view-tie')),
    cut: pool(gCut, () => svgEl('line', 'yd-view-cutline')),
    rails: pool(gRails, () => svgEl('polyline', '')),
    marks: pool(gMarks, () => svgEl('line', '')),
    conts: pool(gMarks, line('yd-view-cont')),
    route: pool(gRoute, () => svgEl('polyline', '')),
    trace: pool(gTraceOne, () => svgEl('polyline', '')),
    land: pool(gCars, () => svgEl('rect', 'yd-view-land')),
    cars: pool(gCars, () => svgEl('g', 'yd-view-car')),
    couplers: pool(gCars, () => svgEl('line', 'yd-view-coupler')),
    engine: pool(gEngine, () => svgEl('g', 'yd-view-engine')),
    stands: pool(gStands, () => { const g = svgEl('g', 'yd-view-stand'); g.append(svgEl('line', 'yd-view-rod'), svgEl('polygon', 'yd-view-stand-mark')); return g; }),
    plates: pool(plates, () => div('')),
  };

  function makeMeasures(): Measures {
    const cache = new Map<string, { w: number; h: number }>();
    const box = (html: string, width = 0): { w: number; h: number } => {
      const key = `${width}|${html}`;
      const hit = cache.get(key);
      if (hit) return hit;
      probe.innerHTML = html;
      const el = probe.firstElementChild as HTMLElement;
      if (width) el.style.width = `${width}px`;
      const b = el.getBoundingClientRect();
      const r = { w: b.width, h: b.height };
      cache.set(key, r);
      return r;
    };
    const raw = getComputedStyle(root).getPropertyValue('--cb-target').trim();
    const target = parseFloat(raw);
    if (!raw.endsWith('px') || !Number.isFinite(target)) throw new Error(`the Yard drawing reads --cb-target and found "${raw}"`);
    const tag = box('<span class="yd-view-tag">BX</span>');
    const foul = box('<div class="yd-view-plate">foul point</div>');
    const leadBar = box(`<div class="yd-view-plate yd-view-barplate">${barHtml(558, 0, 0)}</div>`);
    return {
      num: (t: string) => box(`<div class="yd-view-plate yd-view-num">${esc(t)}</div>`).w,
      numH: box('<div class="yd-view-plate yd-view-num">00000</div>').h,
      tagW: tag.w, tagH: tag.h,
      foulW: foul.w, plateH: foul.h,
      engW: box('<div class="yd-view-plate yd-view-engword">ENGINE</div>').w,
      labels: LABELS.map((lb) => box(`<div class="yd-view-plate yd-view-label">${esc(lb.text)}</div>`)),
      labelWrapH: (k: number, width: number) => box(`<div class="yd-view-plate yd-view-label" data-wrap="1">${esc(LABELS[k].text)}</div>`, width).h,
      leadBarW: leadBar.w, leadBarH: leadBar.h,
      end: (t: TrackFact, compact: boolean) => box(`<div class="yd-view-plate yd-view-end">${endHtml(t, compact, 0)}</div>`),
      cap: (t: TrackFact, lin: Lining, width: number) => box(`<div class="yd-view-cap">${capHtml(t, lin, 0)}</div>`, width).h,
      target,
    };
  }

  function draw(sc: Scene, M: Measures): void {
    const { L, F } = sc;
    const s = L.s, tall = L.form === 'tall';
    attr(root, 'data-form', L.form);
    attr(root, 'data-scale', s.toFixed(3));
    styleOf(root, 'height', `${L.h}px`);
    attr(svg, 'width', String(L.w));
    attr(svg, 'height', String(L.h));
    attr(svg, 'viewBox', `0 0 ${L.w} ${L.h}`);
    // In the tall form a body beyond the drawn end of the lead is clipped at that end.
    attr(clipRect, 'x', '-10'); attr(clipRect, 'y', '-1000'); attr(clipRect, 'width', String(L.w + 20));
    attr(clipRect, 'height', String(tall ? L.leadBot + 1000 : L.h + 2000));
    attr(gCars, 'clip-path', 'url(#yd-view-clip)'); attr(gEngine, 'clip-path', 'url(#yd-view-clip)');

    const swPts = TRACK_IDS.map((id) => L.swp[id]);
    const spine: Pt[] = [L.leadStart, L.foot, ...swPts, L.mainEnd];
    const lines: Array<{ key: string; pts: Pt[] }> = [{ key: 'spine', pts: spine }];
    for (const id of TRACK_IDS) L.tr[id].lines.forEach((pts, k) => lines.push({ key: `${id}:${k}`, pts }));

    // 1. Ballast, then ties: one wide dashed stroke gives a tie every TIE_STEP units.
    const tieDash = `1.7 ${f1(TIE_STEP * s - 1.7)}`;
    for (const ln of lines) {
      const b = P.ballast.get(ln.key); attr(b, 'points', ptsAttr(ln.pts)); attr(b, 'stroke-width', f1(15 * s));
      const t = P.ties.get(ln.key); attr(t, 'points', ptsAttr(ln.pts)); attr(t, 'stroke-width', f1(11.5 * s)); attr(t, 'stroke-dasharray', tieDash);
    }
    if (L.cutline) {
      const c = P.cut.get('cut');
      attr(c, 'x1', f1(L.cutline.x)); attr(c, 'y1', f1(L.cutline.y0)); attr(c, 'x2', f1(L.cutline.x)); attr(c, 'y2', f1(L.cutline.y1));
    }

    // 2. Rails. The leg that a switch is not lined for starts after a gap; a blade lies toward the lined leg.
    const rails = (key: string, pl: Pt[], cls: string, pool2: typeof P.rails): void => {
      [-1, 1].forEach((k) => { const e = pool2.get(`${key}:${k}`); attr(e, 'class', cls); attr(e, 'points', ptsAttr(offsetPoly(pl, k * GAUGE * s))); });
    };
    const gap = 9 * s, blade = 15 * s;
    rails('lead', [L.leadStart, L.foot, swPts[0]], 'yd-view-rail', P.rails);
    TRACK_IDS.forEach((id, i) => {
      const p = swPts[i], up = i < swPts.length - 1 ? swPts[i + 1] : L.mainEnd, body = L.tr[id].lines[0];
      const rev = F.lined[id] === 'reverse';
      rails(`up:${id}`, [rev ? along(p, up, gap) : p, up], 'yd-view-rail', P.rails);
      rails(`in:${id}`, [rev ? p : along(p, body[1], gap), ...body.slice(1)], 'yd-view-rail', P.rails);
      rails(`blade:${id}`, [p, along(p, rev ? body[1] : up, blade)], 'yd-view-rail yd-view-blade', P.rails);
      L.tr[id].lines.slice(1).forEach((ln, k) => rails(`${id}:line:${k + 1}`, ln, 'yd-view-rail', P.rails));
    });

    // 3. Foul point bars and end stops; the hook and the arrow of a row that goes on. The foul point
    // bar carries data-track: one element for each track, at the start of its first line (the test hook).
    for (const id of TRACK_IDS) {
      const tr = L.tr[id];
      const fb = P.marks.get(`foul:${id}`); attr(fb, 'class', 'yd-view-foulbar'); attr(fb, 'data-track', id);
      attr(fb, 'x1', f1(tr.foul[0])); attr(fb, 'y1', f1(tr.foul[1] - FOUL_HALF * s)); attr(fb, 'x2', f1(tr.foul[0])); attr(fb, 'y2', f1(tr.foul[1] + FOUL_HALF * s));
      const st = P.marks.get(`stop:${id}`); attr(st, 'class', 'yd-view-stop');
      attr(st, 'x1', f1(tr.stop[0])); attr(st, 'y1', f1(tr.stop[1] - 5.5 * s)); attr(st, 'x2', f1(tr.stop[0])); attr(st, 'y2', f1(tr.stop[1] + 5.5 * s));
    }
    L.conts.forEach((c, k) => {
      const a = c.from, b = c.to;
      const parts: Pt[][] = [
        [[a[0] + 2, a[1]], [a[0] + 9, a[1]], [a[0] + 9, a[1] + 11]],
        [[a[0] + 5.5, a[1] + 7], [a[0] + 9, a[1] + 11.5], [a[0] + 12.5, a[1] + 7]],
        [[b[0] - 12, b[1] - 11], [b[0] - 12, b[1]], [b[0] - 4, b[1]]],
        [[b[0] - 8, b[1] - 3.5], [b[0] - 3.5, b[1]], [b[0] - 8, b[1] + 3.5]],
      ];
      parts.forEach((pts, n) => attr(P.conts.get(`${k}:${n}`), 'points', ptsAttr(pts)));
    });

    // 4. The lined route: bright rails, and chevrons that point from the engine to the track.
    const route = routePx(L, F);
    rails('lined', route, 'yd-view-rail yd-view-rail-lined', P.route);
    {
      const step = 32 * s, a = 4.6 * s, b = 3.2 * s, keep = 8 * s;
      const avoid: Array<[number, number, number]> = [];
      if (F.reaches) { const tr = L.tr[F.reaches]; avoid.push([tr.foul[0], tr.foul[1], keep]); }
      L.brks.forEach((k) => avoid.push([k.x, k.y, 13]));
      let acc = 16 * s, n = 0;
      for (let i = 0; i < route.length - 1; i++) {
        const p = route[i], q = route[i + 1], len = Math.hypot(q[0] - p[0], q[1] - p[1]);
        const ux = (q[0] - p[0]) / (len || 1), uy = (q[1] - p[1]) / (len || 1);
        const lastSeg = i === route.length - 2;
        while (acc <= len - (lastSeg ? 10 * s : 0)) {
          const cx = p[0] + ux * acc, cy = p[1] + uy * acc;
          const onBend = (i > 0 && acc < keep) || (!lastSeg && len - acc < keep);
          const onMark = avoid.some((v) => Math.hypot(cx - v[0], cy - v[1]) < v[2]);
          const tip: Pt = [cx + ux * b / 2, cy + uy * b / 2], back: Pt = [cx - ux * b / 2, cy - uy * b / 2];
          if (!onBend && !onMark) {
            const e = P.route.get(`chev:${n++}`); attr(e, 'class', 'yd-view-chev');
            attr(e, 'points', ptsAttr([[back[0] - uy * a, back[1] + ux * a], tip, [back[0] + uy * a, back[1] - ux * a]]));
          }
          acc += step;
        }
        acc -= len;
      }
    }

    // 5. The trace of the last move: a thin line beside the route, with an arrow head.
    attr(gTraceOne, 'class', sc.trace ? 'yd-view-trace' : '');
    if (sc.trace) {
      const side = 5.5 * s;
      sc.trace.runs.forEach((pts, k) => { const e = P.trace.get(`run:${k}`); attr(e, 'class', 'yd-view-trace-run'); attr(e, 'points', ptsAttr(offsetPoly(pts, side))); });
      const runs = sc.trace.runs;
      const end = sc.trace.toLead ? offsetPoly(runs[0], side) : offsetPoly(runs[runs.length - 1], side);
      const tip = sc.trace.toLead ? end[0] : end[end.length - 1];
      const from = sc.trace.toLead ? end[1] : end[end.length - 2];
      const l = Math.hypot(tip[0] - from[0], tip[1] - from[1]) || 1, ux = (tip[0] - from[0]) / l, uy = (tip[1] - from[1]) / l;
      const ah = 6 + 2 * s, aw = 4 + 1 * s;
      const head = P.trace.get('head'); attr(head, 'class', 'yd-view-trace-head');
      attr(head, 'points', ptsAttr([[tip[0] - ux * ah - uy * aw, tip[1] - uy * ah + ux * aw], tip, [tip[0] - ux * ah + uy * aw, tip[1] - uy * ah - ux * aw]]));
    }

    // 6. Cars, couplers, the landing place of the move in the builder, the engine.
    const tagZoneH = M.tagW + 3, tagZoneV = M.tagH + 3;
    const carEls = new Map<string, SVGElement>();
    const drawBody = (it: Placed): void => {
      if (it.kind === 'engine') {
        const g = P.engine.get(it.inbound ? 'inbound' : 'engine') as SVGElement;
        const shapeKey = s.toFixed(4);   // the exact scale: two scales can round to the same tenth
        if (memo(g).get('#shape') !== shapeKey) { g.replaceChildren(); engineShape(g, s); memo(g).set('#shape', shapeKey); }
        if (it.inbound) attr(g, 'data-inbound', '1');
        attr(g, 'transform', `translate(${f1(it.cx)} ${f1(it.cy)})${it.rot ? ` rotate(${f1(it.rot)})` : ''}`);
        return;
      }
      const c = it.car as CarFact;
      const g = P.cars.get(it.key) as SVGElement;
      carEls.set(it.key, g);
      const vertical = Math.abs(Math.abs(it.rot) - 90) < 1;
      const tz = (vertical ? tagZoneV : tagZoneH) + (c.type === 'tank' ? 3 : 0);
      const shapeKey = `${c.type}|${c.loaded}|${f1(it.len)}|${s.toFixed(4)}|${f1(tz)}|${c.mark ? 1 : 0}`;
      if (memo(g).get('#shape') !== shapeKey) { g.replaceChildren(); carShape(g, c.type, c.loaded, it.len, s, c.mark ? tz : 0); memo(g).set('#shape', shapeKey); }
      if (c.mark) attr(g, 'data-car', c.mark);
      attr(g, 'data-load', c.loaded ? 'loaded' : 'empty');
      attr(g, 'data-type', c.type);
      attr(g, 'transform', `translate(${f1(it.cx)} ${f1(it.cy)})${it.rot ? ` rotate(${f1(it.rot)})` : ''}`);
    };
    const coupler = (key: string, x: number, y: number, dx: number, dy: number): void => {
      const e = P.couplers.get(key);
      attr(e, 'x1', f1(x - dx * 1.6 * s)); attr(e, 'y1', f1(y - dy * 1.6 * s)); attr(e, 'x2', f1(x + dx * 1.6 * s)); attr(e, 'y2', f1(y + dy * 1.6 * s));
    };
    const standing = L.items.filter((it) => it.kind === 'car' && !sc.hidden.has(it.key));
    for (const it of L.items.filter((q) => q.kind === 'land')) {
      const e = P.land.get(it.key);
      attr(e, 'x', f1(it.cx - it.len / 2 + 1.2 * s)); attr(e, 'y', f1(it.cy - CAR_H * s / 2)); attr(e, 'width', f1(Math.max(2, it.len - 2.4 * s))); attr(e, 'height', f1(CAR_H * s)); attr(e, 'rx', '1.5');
      if (it.cut) attr(e, 'data-cut', '1');
    }
    standing.forEach((it, i) => {
      drawBody(it);
      const nxt = standing[i + 1];
      const c = it.car as CarFact, n = nxt && (nxt.car as CarFact);
      if (nxt && nxt.track === it.track && nxt.line === it.line && n && n.cut === c.cut && Math.abs(c.x1 - n.x0) < 1e-6) coupler(`c:${it.key}`, it.cx + it.len / 2, it.cy, 1, 0);
    });
    L.turns.forEach((p, k) => coupler(`turn:${k}`, p[0], p[1], 1, 0));
    if (!sc.engineMoves && !sc.departed) {
      drawBody(L.engine);
      L.held.forEach((it, i) => {
        drawBody(it);
        const hl = it.len / 2, v = it.rot !== 0;
        if (i === 0) { if (v) coupler(`h0:${it.key}`, it.cx, it.cy + hl, 0, 1); else coupler(`h0:${it.key}`, it.cx - hl, it.cy, 1, 0); }
        if (L.held[i + 1]) { if (v) coupler(`h:${it.key}`, it.cx, it.cy - hl, 0, 1); else coupler(`h:${it.key}`, it.cx + hl, it.cy, 1, 0); }
      });
    }
    for (const it of sc.moving) drawBody(it);
    sc.movingCouplers.forEach((c, k) => coupler(`m:${k}`, c.p[0], c.p[1], c.dx, c.dy));

    // 7. Switch stands: the rod and the mark. The mark carries data-lined (the test hook).
    for (const st of L.stands) {
      const g = P.stands.get(st.id) as SVGElement;
      const lin = F.lined[st.id];
      attr(g, 'data-lined', lin);
      const [rod, mark] = [g.children[0], g.children[1]];
      const tall2 = tall;
      attr(rod, 'x1', f1(st.sx)); attr(rod, 'y1', f1(st.sy)); attr(rod, 'x2', f1(st.px - 2 * s)); attr(rod, 'y2', f1(tall2 ? st.py - 1 : st.py - 3 * s));
      attr(mark, 'points', ptsAttr([[st.sx, st.sy - st.d], [st.sx + st.d, st.sy], [st.sx, st.sy + st.d], [st.sx - st.d, st.sy]]));
    }

    // 8. The plates: each word of the picture is DOM text over the SVG.
    const inside = (x: number, y: number): boolean => x >= 0 && x <= L.w && y >= 0 && y <= L.h;
    const plate = (key: string, cls: string, x: number, y: number, a: Anchor): HTMLElement => {
      const d = P.plates.get(key) as HTMLElement;
      attr(d, 'class', cls);
      attr(d, 'data-a', a);
      styleOf(d, 'left', `${f1(x)}px`); styleOf(d, 'top', `${f1(y)}px`);
      return d;
    };
    const bodyPlates = (it: Placed): void => {
      const Hh = (it.kind === 'engine' ? ENG_H : CAR_H) * s;
      const r = ((it.rot % 360) + 360) % 360;
      const nearV = (r > 45 && r < 135) || (r > 225 && r < 315);
      let th = r > 90 && r <= 270 ? r - 180 : r > 270 ? r - 360 : r;   // the axis, in (-90, 90]
      if (nearV) th = 90;
      const t = th * Math.PI / 180;
      if (it.kind === 'engine') {
        if (it.inbound) return;
        const px = nearV ? [it.cx + Hh / 2 + 4, it.cy] : [it.cx - Math.sin(t) * (Hh / 2 + 3), it.cy + Math.cos(t) * (Hh / 2 + 3)];
        if (inside(px[0], px[1])) textOf(plate('eng', 'yd-view-plate yd-view-engword', px[0], px[1], nearV ? 'l' : 'tc'), 'ENGINE');
        return;
      }
      const c = it.car as CarFact;
      if (!c.mark) return;
      const px = nearV ? [it.cx + Hh / 2 + 4, it.cy] : [it.cx - Math.sin(t) * (Hh / 2 + 3), it.cy + Math.cos(t) * (Hh / 2 + 3)];
      if (inside(px[0], px[1])) textOf(plate(`num:${c.mark}`, 'yd-view-plate yd-view-num', px[0], px[1], nearV ? 'l' : 'tc'), c.number);
      // The type tag: inside the car, at the end toward the switch (the end with less arclength).
      const pad = 1.2 * s + (c.type === 'tank' ? 5 : 2.5);
      const ux = Math.cos(it.rot * Math.PI / 180), uy = Math.sin(it.rot * Math.PI / 180);
      let tx: number, ty: number, ta: Anchor;
      if (Math.abs(it.rot) < 0.5) { tx = it.cx - it.len / 2 + pad; ty = it.cy; ta = 'l'; }
      else {
        const e = (M.tagW * Math.abs(ux) + M.tagH * Math.abs(uy)) / 2;
        const back = it.len / 2 - pad - e;
        tx = it.cx - ux * back; ty = it.cy - uy * back; ta = 'c';
      }
      if (inside(tx, ty)) {
        const tg = plate(`tag:${c.mark}`, 'yd-view-tag', tx, ty, ta);
        attr(tg, 'data-type', c.type); attr(tg, 'data-load', c.loaded ? 'loaded' : 'empty');
        textOf(tg, c.tag);
      }
    };
    standing.forEach(bodyPlates);
    if (!sc.engineMoves && !sc.departed) { bodyPlates(L.engine); L.held.forEach(bodyPlates); }
    sc.moving.forEach(bodyPlates);
    for (const it of L.items.filter((q) => q.kind === 'land' && !q.cut)) {
      const c = it.car as CarFact;
      const y = it.cy + CAR_H * s / 2 + 3;
      textOf(plate(`land:${c.mark}`, 'yd-view-plate yd-view-num yd-view-landnum', it.cx, y, 'tc'), c.number);
    }
    // The stand plates (wide form): the id, and the word of the position.
    for (const st of L.stands) {
      if (!st.plate) continue;
      htmlOf(plate(`stand:${st.id}`, 'yd-view-plate yd-view-standplate', st.plate.x, st.plate.y, 'r'), `${st.id} ${linHtml(F.lined[st.id])}`);
    }
    // The 44 px box of each switch: a still ring that shows where a press lines the switch.
    for (const st of L.stands) plate(`box:${st.id}`, 'yd-view-swbox', st.bx, st.by, 'c');
    if (L.foulPlate) textOf(plate('foul', 'yd-view-plate yd-view-foulplate', L.foulPlate.x, L.foulPlate.y, L.foulPlate.a), 'foul point');
    // The break marks: track left out here. Each covers the ballast, so the rails stop at it.
    L.brks.forEach((k) => {
      const d = plate(`brk:${k.id ?? 'lead'}`, 'yd-view-plate yd-view-brk', k.x, k.y, 'c');
      attr(d, 'data-lit', k.lit && (k.id === null || k.id === F.reaches) ? '1' : '0');
      attr(d, 'data-v', k.v ? '1' : '0');
      const across = `${Math.round(15 * s + 4)}px`;
      if (k.v) { styleOf(d, 'width', across); styleOf(d, 'height', '20px'); styleOf(d, 'line-height', '16px'); }
      else { styleOf(d, 'height', across); styleOf(d, 'line-height', `${Math.round(15 * s + 4) - 2}px`); }
      textOf(d, '⋯');
    });
    // The words of each track: the end plates (wide), the row captions (tall).
    for (const en of L.ends) {
      const d = plate(`end:${en.t.id}`, 'yd-view-plate yd-view-end', en.x, en.y, 'l');
      styleOf(d, 'min-width', `${f1(L.endW)}px`);
      htmlOf(d, endHtml(en.t, L.compact, sc.landU[en.t.id] || 0));
    }
    for (const cp of L.caps) {
      const d = plate(`cap:${cp.t.id}`, 'yd-view-cap', cp.x, cp.y, 'tl');
      styleOf(d, 'width', `${f1(cp.w)}px`);
      htmlOf(d, capHtml(cp.t, F.lined[cp.t.id], sc.landU[cp.t.id] || 0));
    }
    // The three labels of today, and the room bar of the lead.
    for (const lb of L.labels) {
      const d = plate(`label:${lb.k}`, 'yd-view-plate yd-view-label', lb.x, lb.y, lb.a);
      attr(d, 'data-wrap', lb.wrapW ? '1' : '0');
      styleOf(d, 'width', lb.wrapW ? `${f1(lb.wrapW)}px` : 'auto');
      textOf(d, LABELS[lb.k].text);
    }
    if (L.leadBar) htmlOf(plate('leadbar', 'yd-view-plate yd-view-barplate', L.leadBar.x, L.leadBar.y, L.leadBar.a), leadBarHtml(F));

    for (const p of Object.values(P)) p.sweep();
  }

  return { root, plates, controls, probe, draw, makeMeasures, clearProbe: () => { probe.textContent = ''; } };
}
