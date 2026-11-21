// Unit tests of src/core/drill.ts: the selection of the Drill and the guard of the grading (row U-44).
// A test pins what the code does today. It does not say that the code is right, and no test
// states a rule. The frozen content files of public/data are read and never written. Each made-up
// item has a made-up id. The clock is a mock. Node prints a warning for the mock clock.
//
// The learn card of row U-28 (rulings LEARN-GAP and LEARN-TWIN) is tested at the end of this file.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, mock, test } from 'node:test';
import { answerCounts, askableAspects, buildSession, distinctAspects, drawingOf, PER_RULE_CAP, sharedDrawings, shuffle, withLearnCards } from '../../src/core/drill.ts';
import type { DrillQuestion, Rng, Screen, Slot } from '../../src/core/drill.ts';
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

// ---- withLearnCards: the learn card of row U-28 (ruling LEARN-GAP) and the twin (ruling LEARN-TWIN)

// The key of an item for the gap, as ruling LEARN-TWIN gives it: the citation ref, or the id when
// the item has no ref or has the ref of the section "CROR Definitions". The test writes the key
// again, so that it pins it. It uses the ref as a key only: it reads no rule text.
const keyOf = (i: ContentItem) => (i.citation.ref && i.citation.ref !== 'CROR Definitions' ? `ref ${i.citation.ref}` : `item ${i.id}`);
const itemOfScreen = (s: Screen) => (s.kind === 'learn' ? s.item : s.slot.item);
const LIVE_SESSIONS: (string | undefined)[] = ['signals', 'definitions', 'switching', 'securement', 'radio', 'authority', 'operating', undefined];

// Each question that comes right after the learn card of its own item or of an item with its key.
function gapFaults(screens: Screen[]): string[] {
  const faults: string[] = [];
  for (let k = 1; k < screens.length; k++) {
    const before = screens[k - 1];
    const now = screens[k];
    if (before.kind !== 'learn' || now.kind !== 'ask' || keyOf(before.item) !== keyOf(now.slot.item)) continue;
    faults.push(`screen ${k + 1}: the question about ${now.slot.item.id} comes right after the learn card of ${before.item.id}`);
  }
  return faults;
}

// The order of LEARN-GAP alone: withLearnCards of commit 935b2c9, before ruling LEARN-TWIN, with no
// change. The test compares the order of today with it (plan of fix round 2, requirement D2).
function learnGapAlone(slots: Slot[], isNew: (item: ContentItem) => boolean): Screen[] {
  const out: Screen[] = [];
  const carded = new Set<string>();
  let waiting: Screen[] = [];
  let waitingId: string | null = null;
  const release = () => {
    const last = out[out.length - 1];
    if (!waiting.length || (last?.kind === 'learn' && last.item.id === waitingId)) return;
    out.push(...waiting);
    waiting = [];
    waitingId = null;
  };
  for (const slot of slots) {
    const { item } = slot;
    if (isNew(item) && !carded.has(item.id)) {
      carded.add(item.id);
      out.push({ kind: 'learn', item });
      release();
      waiting = [{ kind: 'ask', slot }];
      waitingId = item.id;
    } else if (item.id === waitingId) {
      waiting.push({ kind: 'ask', slot });
    } else {
      release();
      out.push({ kind: 'ask', slot });
      release();
    }
  }
  release();
  if (waiting.length) {
    const card = out.pop()!;
    const before = out.pop();
    if (before) out.push(card, before, ...waiting);
  }
  return out;
}

// A screen as a word that the test can sort: the card of an item, or a question (a slot object).
function screenNames(screens: Screen[], slots: Slot[]): string[] {
  return screens.map((s) => (s.kind === 'learn' ? `card ${s.item.id}` : `question ${slots.indexOf(s.slot)}`));
}

test('withLearnCards: in the frozen data items share 12 citation refs and 6 radio calls have none; the 63 definitions share "CROR Definitions"; 8 refs are shared by a rule item and a signal item', () => {
  // The measure of ruling LEARN-TWIN. A change of the data that shares a ref in a new way fails here.
  const drillable = (i: ContentItem) => i.citation.trust === 'verified' && i.type !== 'radio-script'
    && (i.type !== 'rule' || (FROZEN.questionsByRule[i.id] ?? []).length > 0);
  const byRef = new Map<string, ContentItem[]>();
  for (const i of FROZEN.items) if (i.citation.ref) byRef.set(i.citation.ref, [...(byRef.get(i.citation.ref) ?? []), i]);
  const shared = [...byRef].filter(([, list]) => list.length > 1);
  assert.equal(shared.length, 12, 'refs that two or more items share (and 6 radio calls have no ref)');
  assert.equal(FROZEN.items.filter((i) => !i.citation.ref).length, 6);
  assert.ok(FROZEN.items.filter((i) => !i.citation.ref).every((i) => i.type === 'radio-script'));
  const definitions = byRef.get('CROR Definitions')!;
  assert.equal(definitions.length, 63);
  assert.ok(definitions.every((i) => i.type === 'definition'));
  const twins = shared.filter(([, list]) => list.filter(drillable).length > 1);
  assert.deepEqual(twins.map(([ref]) => ref).filter((ref) => ref !== 'CROR Definitions').sort(),
    ['CROR 405', 'CROR 411', 'CROR 415', 'CROR 416', 'CROR 430', 'CROR 436', 'CROR 437', 'CROR 439']);
  for (const [ref, list] of twins) {
    if (ref === 'CROR Definitions') continue;
    assert.deepEqual(list.map((i) => i.type).sort(), ['rule', 'signal'], ref);
    assert.ok(list.every(drillable), ref);
  }
  // Each other shared ref: one rule item in the Drill and radio calls, which the Drill never asks.
  for (const [ref, list] of shared) {
    if (ref === 'CROR Definitions' || twins.some(([r]) => r === ref)) continue;
    assert.ok(list.length <= 4, ref);
    assert.deepEqual(list.filter(drillable).map((i) => i.type), ['rule'], ref);
  }
});

test('buildSession: in 20,000 seeded first sessions of Signals, of each other live domain and of each live domain, no question comes right after the learn card of its own item or of its twin', () => {
  let twinSessions = 0;
  for (const domain of LIVE_SESSIONS) {
    const faults: string[] = [];
    let cards = 0;
    for (let seed = 1; seed <= 20000; seed++) {
      const { screens } = buildSession({ content: FROZEN, profile: fresh(), domain }, seeded(seed));
      for (const f of gapFaults(screens)) faults.push(`seed ${seed}: ${f}`);
      const carded = screens.filter((s) => s.kind === 'learn').map((s) => itemOfScreen(s));
      cards += carded.length;
      if (carded.some((a) => carded.some((b) => a.id !== b.id && keyOf(a) === keyOf(b)))) twinSessions++;
    }
    assert.ok(cards > 0, `${domain ?? 'each live domain'}: no learn card`);
    assert.deepEqual(faults.slice(0, 5), [], `${domain ?? 'each live domain'}: ${faults.length} questions come right after the learn card of their item or of their twin`);
  }
  // The sessions hold twins: the test can fail.
  assert.ok(twinSessions > 1000, `sessions with the learn cards of two twins: ${twinSessions}`);
});

test('withLearnCards: the same screens as LEARN-GAP alone, in another order only where a question would come right after the card of its twin', () => {
  // The questions of seeded sessions of each live domain, in a seeded order. A first session: each
  // item is new. A later session: some items are new. The test compares each order with LEARN-GAP
  // alone.
  let changed = 0;
  let twinCases = 0;
  for (const domain of LIVE_SESSIONS) {
    for (let seed = 1; seed <= 2000; seed++) {
      const rng = seeded(seed);
      const slots = shuffle(buildSession({ content: FROZEN, profile: fresh(), domain }, rng).slots, rng);
      for (const later of [false, true]) {
        const seen = new Set(later ? slots.filter(() => rng() < 0.5).map((s) => s.item.id) : []);
        const isNew = (i: ContentItem) => !seen.has(i.id);
        const before = learnGapAlone(slots, isNew);
        const now = withLearnCards(slots, isNew);
        const at = `${domain ?? 'each live domain'}, seed ${seed}${later ? ', a later session' : ''}`;
        assert.deepEqual(screenNames(now, slots).sort(), screenNames(before, slots).sort(), `${at}: the screens are not the screens of LEARN-GAP alone`);
        assert.deepEqual(gapFaults(now), [], at);
        const asked = new Set<string>();
        for (const s of now) {
          if (s.kind === 'ask') asked.add(s.slot.item.id);
          else assert.ok(!asked.has(s.item.id), `${at}: the learn card of ${s.item.id} comes after a question about it`);
        }
        if (gapFaults(before).length) twinCases++;
        else assert.deepEqual(screenNames(now, slots), screenNames(before, slots), `${at}: the order changes, and LEARN-GAP alone has no twin case`);
        if (screenNames(now, slots).join() !== screenNames(before, slots).join()) changed++;
      }
    }
  }
  assert.ok(twinCases >= 50, `orders of LEARN-GAP alone with a twin case: ${twinCases}`);
  assert.equal(changed, twinCases);
});

// Made-up items for the order: two twins (one made-up ref) and items with their own ref.
const refItem = (id: string, ref: string | null): ContentItem => ({ ...item(id, 'signals', 'rule'), citation: { source: 'derived', ref, relatedRef: null, verbatim: null, trust: 'verified' } });
const madeUpQuestion: DrillQuestion = { kind: 'text', heading: 'made-up heading', promptText: 'made-up prompt', correct: 'a', options: ['a', 'b'] };
const slotOf = (i: ContentItem): Slot => ({ item: i, q: madeUpQuestion });
const order = (screens: Screen[]) => screens.map((s) => `${s.kind === 'learn' ? 'card' : 'question'} ${itemOfScreen(s).id}`);

test('withLearnCards: the question of a twin goes out before the card of the other twin; the other screens keep their order', () => {
  const [w, a, b, x] = [refItem('test.w', 'made-up ref w'), refItem('test.a', 'made-up ref ab'), refItem('test.b', 'made-up ref ab'), refItem('test.x', null)];
  const slots = [w, a, b, x].map(slotOf);
  assert.deepEqual(order(learnGapAlone(slots, () => true)),
    ['card test.w', 'card test.a', 'question test.w', 'card test.b', 'question test.a', 'card test.x', 'question test.b', 'question test.x']);
  assert.deepEqual(order(withLearnCards(slots, () => true)),
    ['card test.w', 'card test.a', 'question test.w', 'question test.a', 'card test.b', 'card test.x', 'question test.b', 'question test.x']);
});

test('withLearnCards: a card that would be the last screen moves before the nearest screen of another key', () => {
  const [w, a, b] = [refItem('test.w', null), refItem('test.a', 'made-up ref ab'), refItem('test.b', 'made-up ref ab')];
  // test.w and the twin test.a were answered before: only test.b is new. LEARN-GAP alone moves the
  // screen before the last card after it, and that screen is the question about the twin.
  const slots = [w, a, b].map(slotOf);
  const isNew = (i: ContentItem) => i.id === 'test.b';
  assert.deepEqual(order(learnGapAlone(slots, isNew)), ['question test.w', 'card test.b', 'question test.a', 'question test.b']);
  assert.deepEqual(order(withLearnCards(slots, isNew)), ['card test.b', 'question test.w', 'question test.a', 'question test.b']);
});

test('withLearnCards: with no screen of another key, the order of LEARN-GAP alone stays; one new item alone gets no card and no question', () => {
  const [a, b] = [refItem('test.a', 'made-up ref ab'), refItem('test.b', 'made-up ref ab')];
  const twinsOnly = [a, b].map(slotOf);
  assert.deepEqual(order(withLearnCards(twinsOnly, () => true)), order(learnGapAlone(twinsOnly, () => true)));
  assert.deepEqual(order(withLearnCards(twinsOnly, () => true)), ['card test.a', 'card test.b', 'question test.a', 'question test.b']);
  assert.deepEqual(withLearnCards([slotOf(a), slotOf(a)], () => true), []);
});

test('withLearnCards: the items of "CROR Definitions" are not twins; their order is the order of LEARN-GAP alone', () => {
  const defs = FROZEN.items.filter((i) => i.citation.ref === 'CROR Definitions').slice(0, 6);
  const slots = defs.map(slotOf);
  assert.deepEqual(order(withLearnCards(slots, () => true)), order(learnGapAlone(slots, () => true)));
});
