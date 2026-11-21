// Unit tests of src/core/drill.ts: the selection of the Drill and the guard of the grading (row U-44).
// A test pins what the code does today. It does not say that the code is right, and no test
// states a rule. The frozen content files of public/data are read and never written. Each made-up
// item has a made-up id. The clock is a mock. Node prints a warning for the mock clock.
//
// Not tested here: the learn card of row U-28 (ruling LEARN-GAP). Job U1-D builds it in the same
// step. Its test waits for the merge of U1-D.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, mock, test } from 'node:test';
import { answerCounts, askableAspects, buildSession, distinctAspects, drawingOf, PER_RULE_CAP, sharedDrawings } from '../../src/core/drill.ts';
import type { Rng } from '../../src/core/drill.ts';
import { drawSignal } from '../../src/core/signal.ts';
import { freshProfile } from '../../src/core/store.ts';
import type { Content, ContentItem, Domain, ItemType, Profile, Question, Settings, SignalAspect, SRState, Trust } from '../../src/core/types.ts';

const NOW = Date.UTC(2026, 0, 15, 12, 0, 0);
const DAY = 86400000;
const SETTINGS: Settings = { dys: false, contrast: false, reduce: false, audio: false, big: false };

beforeEach(() => { mock.timers.enable({ apis: ['Date'], now: NOW }); });
afterEach(() => { mock.timers.reset(); });

// A fixed generator in place of Math.random: the generator of the seed of the smoke test.
function seeded(start: number): Rng {
  let state = start >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

// ---- The content: the frozen files, read as the app reads them (store.ts, loadContent).
function contentOf(items: ContentItem[], questions: Question[] = []): Content {
  const byDomain: Record<string, ContentItem[]> = {};
  for (const i of items) (byDomain[i.domain] ||= []).push(i);
  const questionsByRule: Record<string, Question[]> = {};
  for (const q of questions) (questionsByRule[q.ruleId] ||= []).push(q);
  return { items, byId: Object.fromEntries(items.map((i) => [i.id, i])), byDomain, questions, questionsByRule };
}
const readData = <T>(file: string): T[] => JSON.parse(readFileSync(new URL(`../../public/data/${file}`, import.meta.url), 'utf8')) as T[];
const FROZEN = contentOf(
  ['definitions.json', 'signals.json', 'rules.json', 'radio-script.json'].flatMap((f) => readData<ContentItem>(f)),
  readData<Question>('rule-questions.json'),
);
const signalItems = FROZEN.items.filter((i) => i.type === 'signal');
const aspectsOf = (id: string): SignalAspect[] => FROZEN.byId[id].payload?.aspects ?? [];

// ---- Made-up items.
const item = (id: string, domain: Domain, type: ItemType, trust: Trust = 'verified', aspects?: SignalAspect[]): ContentItem => ({
  id, domain, type, title: `made-up title ${id}`, plain: `made-up text ${id}`,
  citation: { source: 'derived', ref: null, relatedRef: null, verbatim: null, trust },
  payload: aspects ? { aspects } : null,
});
const question = (ruleId: string, n: number): Question => ({
  id: `q.${ruleId}.${n}`, ruleId, domain: 'made-up', stem: `made-up stem ${n}`, choices: ['a', 'b', 'c'], answer: 'a', explain: 'made-up', tier: 1,
});
const sr = (over: Partial<SRState> = {}): SRState => ({
  fam: 0, seen: 1, correct: 0, lastSeen: new Date(NOW - DAY).toISOString(), due: new Date(NOW).toISOString(), ease: 2.5, interval: 0, ...over,
});
const fresh = (): Profile => freshProfile(SETTINGS);

// The ids of a session, in its order, with the drawing of each signal question.
const shape = (slots: ReturnType<typeof buildSession>['slots']) => slots.map((s) => ({
  id: s.item.id,
  kind: s.q.kind,
  correct: s.q.correct,
  options: s.q.options,
  drawing: s.q.kind === 'signal' ? drawingOf(s.q.aspect) : null,
}));

// ---- sharedDrawings (row U-01)

test('sharedDrawings: the frozen data holds two drawings that belong to two signal items each', () => {
  const shared = sharedDrawings(FROZEN);
  assert.equal(shared.length, 2);
  assert.deepEqual(shared.map((d) => [...d.itemIds].sort()), [['sig.405', 'sig.431'], ['sig.437', 'sig.439']]);
});

test('sharedDrawings: each shared drawing is the drawing of the frozen drawing function for the entries of the two items', () => {
  const [first, second] = sharedDrawings(FROZEN);
  // sig.405 entry 2 of 4, sig.431 entry 3 of 5.
  assert.equal(drawSignal(aspectsOf('sig.405')[1]), first.svg);
  assert.equal(drawSignal(aspectsOf('sig.431')[2]), first.svg);
  // sig.437 entry 2 of 3, sig.439 entries 1 and 5 of 5.
  assert.equal(drawSignal(aspectsOf('sig.437')[1]), second.svg);
  assert.equal(drawSignal(aspectsOf('sig.439')[0]), second.svg);
  assert.equal(drawSignal(aspectsOf('sig.439')[4]), second.svg);
});

test('sharedDrawings: a drawing that one item holds two times is not shared; a drawing of two items is', () => {
  const a: SignalAspect = { heads: ['Y'], type: 'mast' };
  const b: SignalAspect = { heads: ['Y', 'G'], type: 'dwarf' };
  const one = contentOf([item('test.sig.one', 'signals', 'signal', 'verified', [a, { ...a }])]);
  assert.deepEqual(sharedDrawings(one), []);
  const two = contentOf([
    item('test.sig.one', 'signals', 'signal', 'verified', [a]),
    item('test.sig.two', 'signals', 'signal', 'verified', [b, { ...a }]),
  ]);
  assert.deepEqual(sharedDrawings(two).map((d) => d.itemIds), [['test.sig.one', 'test.sig.two']]);
});

// ---- distinctAspects (row U-37)

test('distinctAspects: each drawing comes one time, in the order of the list, as its first entry', () => {
  const a: SignalAspect = { heads: ['G'], type: 'mast' };
  const b: SignalAspect = { heads: ['R'], type: 'mast' };
  const c: SignalAspect = { heads: ['Y'], type: 'dwarf' };
  const list = [a, b, { ...a }, c, { ...b }];
  const out = distinctAspects(list);
  assert.equal(out.length, 3);
  assert.equal(out[0], list[0]);
  assert.equal(out[1], list[1]);
  assert.equal(out[2], list[3]);
});

test('distinctAspects: the frozen data has 140 entries in its signal items, and 102 different drawings item by item', () => {
  assert.equal(signalItems.length, 42);
  let entries = 0;
  let distinct = 0;
  for (const i of signalItems) {
    const aspects = i.payload?.aspects ?? [];
    const out = distinctAspects(aspects);
    const drawings = out.map(drawingOf);
    assert.equal(new Set(drawings).size, drawings.length, `${i.id}: a drawing comes two times`);
    assert.equal(new Set(aspects.map(drawingOf)).size, drawings.length, `${i.id}: a drawing is lost`);
    entries += aspects.length;
    distinct += out.length;
  }
  assert.equal(entries, 140);
  assert.equal(distinct, 102);
});

// ---- askableAspects and buildSession: the skip of row U-01

test('askableAspects: no askable entry of the frozen data has a shared drawing; 98 entries are askable', () => {
  const shared = new Set(sharedDrawings(FROZEN).map((d) => d.svg));
  let askable = 0;
  for (const i of signalItems) {
    const list = askableAspects(i, FROZEN);
    for (const a of list) assert.ok(!shared.has(drawingOf(a)), `${i.id}: an askable entry has a shared drawing`);
    askable += list.length;
  }
  assert.equal(askable, 98);
});

test('buildSession: a session of Signals or of each live domain asks no shared drawing, over 200 seeds', () => {
  const shared = new Set(sharedDrawings(FROZEN).map((d) => d.svg));
  let signalQuestions = 0;
  for (let seed = 1; seed <= 200; seed++) {
    for (const domain of ['signals', undefined]) {
      for (const s of buildSession({ content: FROZEN, profile: fresh(), domain }, seeded(seed)).slots) {
        if (s.q.kind !== 'signal') continue;
        signalQuestions++;
        assert.ok(!shared.has(drawingOf(s.q.aspect)), `seed ${seed}, ${domain ?? 'each live domain'}: ${s.item.id} asks a shared drawing`);
      }
    }
  }
  assert.ok(signalQuestions > 0, 'no session asked a signal question');
});

test('buildSession: a signal item whose only drawing is shared is not in a session', () => {
  const a: SignalAspect = { heads: ['Y'], type: 'mast' };
  const b: SignalAspect = { heads: ['G', 'Y'], type: 'mast' };
  const items = [
    item('test.sig.only-shared', 'signals', 'signal', 'verified', [a]),
    item('test.sig.also', 'signals', 'signal', 'verified', [{ ...a }, b]),
    ...Array.from({ length: 6 }, (_, n) => item(`test.sig.own.${n}`, 'signals', 'signal', 'verified', [{ heads: ['R', 'Y', 'G'].slice(0, (n % 3) + 1), type: n < 3 ? 'mast' : 'dwarf' }])),
  ];
  const content = contentOf(items);
  for (let seed = 1; seed <= 50; seed++) {
    const { slots } = buildSession({ content, profile: fresh(), domain: 'signals' }, seeded(seed));
    assert.ok(!slots.some((s) => s.item.id === 'test.sig.only-shared'), `seed ${seed}: the item with only a shared drawing is in the session`);
    for (const s of slots) {
      if (s.item.id === 'test.sig.also' && s.q.kind === 'signal') assert.equal(drawingOf(s.q.aspect), drawingOf(b), `seed ${seed}`);
    }
  }
});

// ---- buildSession: the size, the kinds and the seed

test('buildSession: one seed gives the same session two times', () => {
  for (const domain of ['signals', 'switching', undefined]) {
    const first = buildSession({ content: FROZEN, profile: fresh(), domain }, seeded(12345));
    const second = buildSession({ content: FROZEN, profile: fresh(), domain }, seeded(12345));
    assert.deepEqual(shape(second.slots), shape(first.slots), domain ?? 'each live domain');
    assert.deepEqual(second.newIds, first.newIds);
  }
});

test('buildSession: a session has 10 questions or fewer and no radio-script item, over 100 seeds', () => {
  for (let seed = 1; seed <= 100; seed++) {
    for (const domain of [undefined, 'definitions', 'signals', 'switching', 'securement', 'radio', 'authority', 'operating']) {
      const { slots } = buildSession({ content: FROZEN, profile: fresh(), domain }, seeded(seed));
      assert.ok(slots.length <= 10, `seed ${seed}, ${domain}: ${slots.length} questions`);
      assert.ok(slots.every((s) => s.item.type !== 'radio-script'), `seed ${seed}, ${domain}: a radio-script item`);
      assert.ok(slots.every((s) => s.item.citation.trust === 'verified'), `seed ${seed}, ${domain}: an item that is not verified`);
      assert.ok(slots.every((s) => s.q.options.includes(s.q.correct)), `seed ${seed}, ${domain}: the right option is not in the options`);
    }
  }
});

test('buildSession: a thin domain is padded with other questions of its rules, at most 3 for one rule', () => {
  const rules = [item('test.rule.a', 'securement', 'rule'), item('test.rule.b', 'securement', 'rule')];
  const questions = [1, 2, 3, 4, 5].flatMap((n) => [question('test.rule.a', n), question('test.rule.b', n)]);
  const content = contentOf(rules, questions);
  for (let seed = 1; seed <= 20; seed++) {
    const { slots } = buildSession({ content, profile: fresh(), domain: 'securement' }, seeded(seed));
    assert.equal(slots.length, 2 * PER_RULE_CAP, `seed ${seed}`);
    for (const id of ['test.rule.a', 'test.rule.b']) {
      const mine = slots.filter((s) => s.item.id === id);
      assert.equal(mine.length, PER_RULE_CAP, `seed ${seed}, ${id}`);
      assert.equal(new Set(mine.map((s) => s.q.kind === 'rule' ? s.q.promptText : '')).size, PER_RULE_CAP, `seed ${seed}, ${id}: a question comes two times`);
    }
  }
});

test('buildSession: a review round keeps the order of the severity classes, S3 first', () => {
  // The severity table is for the SME to review. This test reads the classes of today.
  const items = [item('test.def', 'definitions', 'definition'), item('test.radio', 'radio', 'definition'), item('test.switching', 'switching', 'definition')];
  const content = contentOf(items);
  for (let seed = 1; seed <= 20; seed++) {
    const { slots } = buildSession({ content, profile: fresh(), focusIds: ['test.def', 'test.radio', 'test.switching'] }, seeded(seed));
    assert.deepEqual(slots.map((s) => s.item.id), ['test.switching', 'test.radio', 'test.def'], `seed ${seed}`);
  }
});

// ---- The options of a review round (finding F-1 of the last review of Wave 2c; ruling WEAK-REVIEW)

test('buildSession: a review round of few misses offers signal names only on a signal question, with no repeat, over 300 seeds', () => {
  const defs = FROZEN.items.filter((i) => i.type === 'definition' && i.citation.trust === 'verified').slice(0, 4).map((i) => i.id);
  const sig = signalItems.find((i) => i.citation.trust === 'verified' && askableAspects(i, FROZEN).length > 0)!;
  const signalTitles = new Set(signalItems.map((i) => i.title));
  let signalQuestions = 0;
  for (let seed = 1; seed <= 300; seed++) {
    const profile = fresh();
    for (const id of [sig.id, ...defs]) profile.items[id] = sr();
    const { slots } = buildSession({ content: FROZEN, profile, focusIds: [sig.id, ...defs] }, seeded(seed));
    for (const s of slots) {
      assert.equal(new Set(s.q.options).size, s.q.options.length, `seed ${seed}: an option repeats: ${JSON.stringify(s.q.options)}`);
      assert.ok(s.q.options.includes(s.q.correct), `seed ${seed}: the right answer is not an option`);
      if (s.q.kind !== 'signal') continue;
      signalQuestions++;
      assert.equal(s.q.options.length, 4, `seed ${seed}: a signal question has ${s.q.options.length} options`);
      for (const o of s.q.options) assert.ok(signalTitles.has(o), `seed ${seed}: the option "${o}" is not the name of a signal item`);
    }
  }
  assert.ok(signalQuestions >= 300, `signal questions: ${signalQuestions}`);
});

test('buildSession: a review round of one missed item still offers four options', () => {
  const def = FROZEN.items.find((i) => i.type === 'definition' && i.citation.trust === 'verified')!;
  const sig = signalItems.find((i) => i.citation.trust === 'verified' && askableAspects(i, FROZEN).length > 0)!;
  for (const id of [def.id, sig.id]) {
    // The item was seen before, so the round asks it with no learn card (a new item alone gets a
    // card and no question: ruling LEARN-GAP).
    const profile = fresh();
    profile.items[id] = sr();
    let asked = 0;
    for (let seed = 1; seed <= 50; seed++) {
      const { slots } = buildSession({ content: FROZEN, profile, focusIds: [id] }, seeded(seed));
      for (const s of slots) { asked++; assert.equal(s.q.options.length, 4, `${id}, seed ${seed}: ${JSON.stringify(s.q.options)}`); }
    }
    assert.ok(asked >= 50, `${id}: ${asked} questions asked`);
  }
});

// ---- answerCounts: the guard of the grading

test('answerCounts: an item that is not verified never counts', () => {
  for (const trust of ['needs-review', 'operating-practice'] as Trust[]) {
    const i = item('test.def', 'definitions', 'definition', trust);
    assert.equal(answerCounts(i, undefined, true), false, trust);
    assert.equal(answerCounts(i, undefined, false), false, trust);
    assert.equal(answerCounts(i, sr({ due: new Date(NOW - DAY).toISOString() }), true), false, trust);
  }
});

test('answerCounts: a right answer counts only when the item is due', () => {
  const i = item('test.def', 'definitions', 'definition');
  assert.equal(answerCounts(i, undefined, true), true, 'no state: due');
  assert.equal(answerCounts(i, sr({ due: new Date(NOW - DAY).toISOString() }), true), true, 'a past due time');
  assert.equal(answerCounts(i, sr({ due: new Date(NOW).toISOString() }), true), true, 'a due time of now');
  assert.equal(answerCounts(i, sr({ due: new Date(NOW + DAY).toISOString() }), true), false, 'a future due time');
});

test('answerCounts: a miss counts, due or not', () => {
  const i = item('test.def', 'definitions', 'definition');
  assert.equal(answerCounts(i, undefined, false), true);
  assert.equal(answerCounts(i, sr({ due: new Date(NOW + DAY).toISOString() }), false), true);
  assert.equal(answerCounts(i, sr({ due: new Date(NOW - DAY).toISOString() }), false), true);
});

test('buildSession: practiceOnly is true only when no item of the session is due at its start', () => {
  const items = Array.from({ length: 6 }, (_, n) => item(`test.def.${n}`, 'definitions', 'definition'));
  const content = contentOf(items);
  const notDue = fresh();
  for (const i of items) notDue.items[i.id] = sr({ due: new Date(NOW + 3 * DAY).toISOString() });
  assert.equal(buildSession({ content, profile: notDue, domain: 'definitions' }, seeded(7)).practiceOnly, true);
  const oneDue = structuredClone(notDue);
  oneDue.items['test.def.0'] = sr({ due: new Date(NOW - DAY).toISOString() });
  assert.equal(buildSession({ content, profile: oneDue, domain: 'definitions' }, seeded(7)).practiceOnly, false);
  assert.equal(buildSession({ content, profile: fresh(), domain: 'definitions' }, seeded(7)).practiceOnly, false);
});
