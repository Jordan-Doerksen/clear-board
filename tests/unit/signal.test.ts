// Unit tests of the signal drawing: drawSignal and lampFill of src/core/signal.ts (row U-44; R6
// ENG-06). The file is frozen: the tests import it and never change it. The entries of the frozen
// file public/data/signals.json are read and never written. A test pins what the drawing function
// gives today; it does not say what an aspect means, and no test states a rule.
//
// The frozen file holds no dark lamp (the code "D") and no entry with the field "flash" today. Made-up
// entries cover those two branches of the function; their ids start with "made-up".
//
// The parts of one drawing, as the function writes them today: for each head code, top to bottom,
// a ring (a circle of radius 15) and a lamp (a circle of radius 12). A lit lamp (a code that is not
// "D") also gets a small highlight (radius 3.2). A lamp that flashes holds one <animate> element.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { drawSignal, lampFill } from '../../src/core/signal.ts';
import type { ContentItem, SignalAspect } from '../../src/core/types.ts';

const ITEMS = (JSON.parse(readFileSync(new URL('../../public/data/signals.json', import.meta.url), 'utf8')) as ContentItem[])
  .filter((i) => i.type === 'signal');
const ENTRIES: { id: string; n: number; aspect: SignalAspect }[] = ITEMS.flatMap((i) =>
  (i.payload?.aspects ?? []).map((aspect, k) => ({ id: i.id, n: k + 1, aspect })));
const MADE: { id: string; n: number; aspect: SignalAspect }[] = [
  { heads: ['D', 'G'], type: 'mast' },
  { heads: ['Df', 'Y'], type: 'mast', flash: true },
  { heads: ['R'], type: 'dwarf', flash: true },
  { heads: ['Y', 'D', 'Rf'], type: 'mast', stagger: true, plaque: 'DV' },
].map((aspect, k) => ({ id: 'made-up', n: k + 1, aspect: aspect as SignalAspect }));
// Each entry of the frozen file, and the made-up entries.
const ALL = [...ENTRIES, ...MADE];
const where = (e: { id: string; n: number }) => `${e.id} entry ${e.n}`;

// The parts of a drawing, read from its SVG text.
function partsOf(svg: string) {
  const lamps = [...svg.matchAll(/<circle cx="([^"]+)" cy="([^"]+)" r="12" fill="([^"]+)"[^>]*>(<animate [^>]*\/>)?<\/circle>/g)]
    .map((m) => ({ cy: Number(m[2]), fill: m[3], flashes: Boolean(m[4]) }));
  return {
    rings: (svg.match(/ r="15" /g) ?? []).length,
    lamps,
    highlights: (svg.match(/ r="3\.2" /g) ?? []).length,
    animates: (svg.match(/<animate /g) ?? []).length,
    plaque: /<text [^>]*>([^<]*)<\/text>/.exec(svg)?.[1] ?? null,
  };
}
const codeOf = (head: string) => (head.endsWith('f') ? head.slice(0, -1) : head);

test('the frozen file has 42 signal items with 140 entries, each a mast or a dwarf', () => {
  assert.equal(ITEMS.length, 42);
  assert.equal(ENTRIES.length, 140);
  for (const e of ENTRIES) assert.ok(e.aspect.type === 'mast' || e.aspect.type === 'dwarf', where(e));
});

test('drawSignal: each entry gives one ring and one lamp for each head code, top to bottom', () => {
  for (const e of ALL) {
    const p = partsOf(drawSignal(e.aspect));
    assert.equal(p.rings, e.aspect.heads.length, `${where(e)}: rings`);
    assert.equal(p.lamps.length, e.aspect.heads.length, `${where(e)}: lamps`);
    for (let k = 1; k < p.lamps.length; k++) assert.ok(p.lamps[k].cy > p.lamps[k - 1].cy, `${where(e)}: lamp ${k + 1} is not under lamp ${k}`);
  }
});

test('drawSignal: the fill of each lamp is lampFill of its head code, with no "f" at the end', () => {
  for (const e of ALL) {
    const p = partsOf(drawSignal(e.aspect));
    e.aspect.heads.forEach((head, k) => assert.equal(p.lamps[k].fill, lampFill(codeOf(head)), `${where(e)}: lamp ${k + 1}`));
  }
});

test('drawSignal: a lamp flashes when its code ends with "f" or the entry flashes, and only when it is lit', () => {
  let flashing = 0;
  for (const e of ALL) {
    const p = partsOf(drawSignal(e.aspect));
    e.aspect.heads.forEach((head, k) => {
      const want = (head.endsWith('f') || Boolean(e.aspect.flash)) && codeOf(head) !== 'D';
      assert.equal(p.lamps[k].flashes, want, `${where(e)}: lamp ${k + 1}`);
      if (want) flashing++;
    });
    assert.equal(p.animates, p.lamps.filter((l) => l.flashes).length, `${where(e)}: an <animate> outside a lamp`);
  }
  assert.ok(flashing > 0, 'no entry has a lamp that flashes');
  // The made-up entries: a dark lamp never flashes; the field flash makes each lit lamp flash.
  assert.deepEqual(MADE.map((e) => partsOf(drawSignal(e.aspect)).animates), [0, 1, 1, 1]);
});

test('drawSignal: each lit lamp has one highlight, and a dark lamp ("D") has none', () => {
  for (const e of ALL) {
    const lit = e.aspect.heads.filter((h) => codeOf(h) !== 'D').length;
    assert.equal(partsOf(drawSignal(e.aspect)).highlights, lit, where(e));
  }
  assert.deepEqual(MADE.map((e) => partsOf(drawSignal(e.aspect)).highlights), [1, 1, 1, 2]);
});

test('drawSignal: an entry with a plaque draws its letters, and an entry with no plaque draws no text', () => {
  for (const e of ALL) {
    assert.equal(partsOf(drawSignal(e.aspect)).plaque, e.aspect.plaque ?? null, where(e));
  }
});

test('drawSignal: the same entry gives the same text two times', () => {
  for (const e of ALL) assert.equal(drawSignal(e.aspect), drawSignal(structuredClone(e.aspect)), where(e));
});

test('drawSignal: an entry with no field "heads" gets one lamp of the code "R"; an empty list gets no lamp', () => {
  const q = partsOf(drawSignal({ type: 'mast' } as SignalAspect));
  assert.deepEqual(q.lamps.map((l) => l.fill), [lampFill('R')]);
  // The code reads `spec.heads || ['R']`: an empty list is a list, so it stays empty.
  assert.equal(partsOf(drawSignal({ heads: [], type: 'mast' })).lamps.length, 0);
});

test('lampFill: the five codes give five different fills; an unknown code gives the fill of "D"', () => {
  const fills = ['G', 'R', 'Y', 'L', 'D'].map(lampFill);
  assert.equal(new Set(fills).size, 5);
  assert.equal(lampFill('X'), lampFill('D'));
  assert.equal(lampFill(''), lampFill('D'));
});
