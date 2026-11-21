// legend.ts — the legend of the Yard drawing (look C2): what each mark of the picture means.
//
// The groups, the items and the small pictures are those of the picked sketch
// (look-model2.src.html, legendNode). The small pictures use the classes and the gradients of the
// picture. The legend is a plain block: no control, no element that takes focus. An item for a
// mark that this job cannot show is left out (the sketch leaves out the kickable item the same way).

import { carShape, barHtml, esc } from './svg.ts';
import { CAR_H } from './layout.ts';
import { carLen, TYPES } from '../geometry.js';

const NS = 'http://www.w3.org/2000/svg';
const TAGS: Record<string, { tag: string }> = TYPES;
const f1 = (n: number): string => String(Math.round(n * 10) / 10);

/** The facts that select the items of the legend. */
export interface LegendFacts {
  s: number;
  tagW: number;
  /** A row of the picture goes on in the next line. */
  folds: boolean;
  kickable: boolean;
  goal: boolean;
  secured: boolean;
  /** The landing place of the move in the builder is drawn (a later job). */
  landing: boolean;
}

export const legendKey = (o: LegendFacts): string => JSON.stringify([f1(o.s), f1(o.tagW), o.folds, o.kickable, o.goal, o.secured, o.landing]);

function svg(w: number, h: number): SVGSVGElement {
  const e = document.createElementNS(NS, 'svg') as SVGSVGElement;
  e.setAttribute('width', String(w)); e.setAttribute('height', String(h));
  e.setAttribute('aria-hidden', 'true'); e.setAttribute('focusable', 'false');
  return e;
}
function shape(parent: Element, tag: string, cls: string, a: Record<string, string>): SVGElement {
  const e = document.createElementNS(NS, tag) as SVGElement;
  e.setAttribute('class', cls);
  for (const k in a) e.setAttribute(k, a[k]);
  parent.appendChild(e);
  return e;
}

/** A small car of a type, solid or hollow, with its tag, at the car scale of the picture. */
function carPic(type: string, loaded: boolean, o: LegendFacts): HTMLElement {
  const lenPx = carLen(type) * o.s, w = Math.ceil(lenPx) + 2, h = Math.ceil(CAR_H * o.s) + 6;
  const wrap = document.createElement('span');
  wrap.className = 'yd-legend-car';
  wrap.style.width = `${w}px`; wrap.style.height = `${h}px`;
  const pic = svg(w, h);
  const g = shape(pic, 'g', 'yd-view-car', { 'data-type': type, 'data-load': loaded ? 'loaded' : 'empty', transform: `translate(${f1(lenPx / 2 + 1)} ${f1(h / 2 - 1)})` });
  carShape(g, type, loaded, lenPx, o.s, o.tagW + 3 + (type === 'tank' ? 3 : 0));
  wrap.appendChild(pic);
  const tag = document.createElement('span');
  tag.className = 'yd-view-tag';
  tag.dataset.type = type; tag.dataset.load = loaded ? 'loaded' : 'empty'; tag.dataset.a = 'l';
  tag.style.left = `${f1(1 + 1.2 * o.s + (type === 'tank' ? 5 : 2.5))}px`; tag.style.top = `${f1(h / 2 - 1)}px`;
  tag.textContent = TAGS[type].tag;
  wrap.appendChild(tag);
  return wrap;
}

/** A short piece of track: ballast, ties, two rails; lined, with chevrons; or with a foul point bar. */
function railPic(lined: boolean, bar: boolean): SVGSVGElement {
  const pic = svg(46, 16);
  shape(pic, 'line', 'yd-view-ballast', { x1: '0', y1: '8', x2: '46', y2: '8', 'stroke-width': '14' });
  shape(pic, 'line', 'yd-view-tie', { x1: '0', y1: '8', x2: '46', y2: '8', 'stroke-width': '11', 'stroke-dasharray': '1.7 8' });
  [5, 11].forEach((y) => shape(pic, 'line', lined ? 'yd-view-rail yd-view-rail-lined' : 'yd-view-rail', { x1: '0', y1: String(y), x2: '46', y2: String(y) }));
  if (lined) [12, 34].forEach((x) => shape(pic, 'polyline', 'yd-view-chev', { points: `${x - 1.6},3.6 ${x + 1.6},8 ${x - 1.6},12.4` }));
  if (bar) shape(pic, 'line', 'yd-view-foulbar', { x1: '23', y1: '0', x2: '23', y2: '16' });
  return pic;
}

/** A switch stand mark, hollow (normal) or filled (reverse). */
function standPic(lin: 'normal' | 'reverse'): SVGSVGElement {
  const pic = svg(16, 16);
  shape(pic, 'polygon', 'yd-view-stand-mark', { points: '8,2 14,8 8,14 2,8', 'data-state': lin });
  return pic;
}

/** Fill the legend element with its groups. Each word is a word of the second table of requirement 22. */
export function fillLegend(box: HTMLElement, o: LegendFacts): void {
  box.replaceChildren();
  let grp: HTMLElement = box;
  const group = (headHtml: string): void => {
    grp = document.createElement('div'); grp.className = 'yd-legend-group';
    const head = document.createElement('div'); head.className = 'yd-legend-head'; head.innerHTML = headHtml;
    grp.appendChild(head); box.appendChild(grp);
  };
  const row = (): HTMLElement => { const r = document.createElement('div'); r.className = 'yd-legend-row'; grp.appendChild(r); return r; };
  const item = (r: HTMLElement, pic: Element | null, html: string): void => {
    const sp = document.createElement('span'); sp.className = 'yd-legend-item';
    if (pic) sp.appendChild(pic);
    sp.insertAdjacentHTML('beforeend', html);
    r.appendChild(sp);
  };

  group('Colour meanings · <span class="yd-legend-sme">SME to confirm</span>');
  let r = row();
  ['box', 'hopper', 'tank'].forEach((t) => item(r, carPic(t, true, o), esc(t)));
  r = row();
  ['centerbeam', 'autorack'].forEach((t) => item(r, carPic(t, true, o), esc(t)));
  r = row();
  item(r, standPic('normal'), '<span class="yd-view-lin" data-state="normal">NORMAL</span>');
  item(r, standPic('reverse'), '<span class="yd-view-lin" data-state="reverse">REVERSE</span>');
  item(r, railPic(true, false), 'lined route');
  r = row();
  item(r, railPic(false, true), 'foul point');
  if (o.secured) {
    item(r, null, '<span class="dusk-state dusk-state--hold yd-view-sec" data-state="tied">TIED</span>');
    item(r, null, '<span class="dusk-state dusk-state--caution yd-view-sec" data-state="loose">LOOSE</span>');
  }

  group('From the words of the app');
  r = row();
  item(r, carPic('box', true, o), 'solid = loaded');
  item(r, carPic('box', false, o), 'hollow = empty');
  if (o.kickable || o.goal) {
    r = row();
    if (o.kickable) item(r, null, '⚡ = kickable track');
    if (o.goal) item(r, null, '<span class="yd-view-goal">BUILD</span><span class="dusk-count yd-view-count">n / n</span> goal cars on the track');
  }
  if (o.landing) {
    r = row();
    const pic = svg(30, 16);
    shape(pic, 'rect', 'yd-view-land', { x: '1', y: '2', width: '28', height: '12', rx: '1.5' });
    item(r, pic, 'the move in the builder lands here');
  }

  group('Length');
  r = row();
  item(r, null, 'A car and a gap between cars have true length.');
  r = row();
  item(r, null, '<span class="yd-view-brk" data-key="1">⋯</span> empty track left out');
  if (o.folds) {
    const pic = svg(26, 16);
    shape(pic, 'polyline', 'yd-view-cont', { points: '2,4 12,4 12,13' });
    shape(pic, 'polyline', 'yd-view-cont', { points: '8.5,9 12,13.5 15.5,9' });
    item(r, pic, 'the track goes on in the next line');
  }
  r = row();
  item(r, null, `room ${barHtml(380, 150, 0)} cars`);
  item(r, null, 'All bars have one scale.');
}
