// Unit tests of src/core/store.ts: the profile and the content library.
// A test pins what the code does today. It does not say that the code is right.
// Each item id here is made up. The clock is a mock. Node prints a warning for the mock clock.
//
// Not tested here: loadContent. It reads `import.meta.env`, which Node does not have, and the
// test would need an edit of store.ts.
import assert from 'node:assert/strict';
import { afterEach, beforeEach, mock, test } from 'node:test';
import { DOMAINS, drillable, freshProfile, loadProfile, recomputeMastery, stageFor } from '../../src/core/store.ts';
import type { Content, ContentItem, Domain, ItemType, Profile, Question, Settings, SRState, Trust } from '../../src/core/types.ts';

const NOW = Date.UTC(2026, 0, 15, 12, 0, 0);
const SETTINGS: Settings = { dys: false, contrast: true, reduce: false, audio: true, big: false };
const PROFILE_KEY = 'cb.profile.v1';

const item = (id: string, domain: Domain, type: ItemType, trust: Trust = 'verified'): ContentItem => ({
  id, domain, type, title: 'made-up item', plain: 'made-up text',
  citation: { source: 'derived', ref: null, relatedRef: null, verbatim: null, trust },
  payload: null,
});
const question = (ruleId: string): Question => ({
  id: `q.${ruleId}`, ruleId, domain: 'made-up', stem: 'made-up stem', choices: ['a', 'b'], answer: 'a', explain: 'made-up',
});
function contentOf(items: ContentItem[], questions: Question[] = []): Content {
  const byDomain: Record<string, ContentItem[]> = {};
  for (const i of items) (byDomain[i.domain] ||= []).push(i);
  const questionsByRule: Record<string, Question[]> = {};
  for (const q of questions) (questionsByRule[q.ruleId] ||= []).push(q);
  return { items, byId: Object.fromEntries(items.map((i) => [i.id, i])), byDomain, questions, questionsByRule };
}
const sr = (over: Partial<SRState> = {}): SRState => ({
  fam: 0, seen: 0, correct: 0, lastSeen: null, due: new Date(NOW).toISOString(), ease: 2.5, interval: 0, ...over,
});
const ids = (items: ContentItem[]) => items.map((i) => i.id);

// A stand-in for the storage of the browser. Node 22 has no localStorage with no flag.
let stored: Record<string, string> = {};
beforeEach(() => {
  mock.timers.enable({ apis: ['Date'], now: NOW });
  stored = {};
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: { getItem: (key: string) => (key in stored ? stored[key] : null) },
  });
});
afterEach(() => { mock.timers.reset(); });

// ---- drillable

test('drillable: only an item with trust "verified" is in the list', () => {
  const items = [
    item('test.a', 'definitions', 'definition', 'verified'),
    item('test.b', 'definitions', 'definition', 'needs-review'),
    item('test.c', 'definitions', 'definition', 'operating-practice'),
  ];
  assert.deepEqual(ids(drillable(items, contentOf(items))), ['test.a']);
});

test('drillable: a rule item needs one question or more', () => {
  const items = [item('test.rule.with', 'operating', 'rule'), item('test.rule.without', 'operating', 'rule')];
  const content = contentOf(items, [question('test.rule.with')]);
  assert.deepEqual(ids(drillable(items, content)), ['test.rule.with']);
});

test('drillable: an item that is not a rule needs no question', () => {
  const items = [item('test.def', 'definitions', 'definition'), item('test.sig', 'signals', 'signal')];
  assert.deepEqual(ids(drillable(items, contentOf(items))), ['test.def', 'test.sig']);
});

test('drillable: no item list gives an empty list', () => {
  assert.deepEqual(drillable(undefined, contentOf([])), []);
});

// ---- recomputeMastery

test('recomputeMastery: the mastery of a domain is the mean of its drillable items', () => {
  const items = [item('test.a', 'definitions', 'definition'), item('test.b', 'definitions', 'definition'), item('test.c', 'definitions', 'definition', 'needs-review')];
  const profile = freshProfile(SETTINGS);
  profile.items['test.a'] = sr({ fam: 0.5 });
  profile.items['test.c'] = sr({ fam: 1 });
  recomputeMastery(profile, contentOf(items));
  assert.equal(profile.domains.definitions.mastery, 0.25);
});

test('recomputeMastery: signals has a cap of 0.33 until one signal item has a correct answer', () => {
  const items = [item('test.sig', 'signals', 'signal'), item('test.rule', 'signals', 'rule')];
  const content = contentOf(items, [question('test.rule')]);
  const profile = freshProfile(SETTINGS);
  profile.items['test.rule'] = sr({ fam: 1, correct: 3 });
  recomputeMastery(profile, content);
  assert.equal(profile.domains.signals.mastery, 0.33);
});

test('recomputeMastery: signals has no cap when one signal item has a correct answer', () => {
  const items = [item('test.sig', 'signals', 'signal'), item('test.rule', 'signals', 'rule')];
  const content = contentOf(items, [question('test.rule')]);
  const profile = freshProfile(SETTINGS);
  profile.items['test.rule'] = sr({ fam: 1, correct: 3 });
  profile.items['test.sig'] = sr({ fam: 0, correct: 1 });
  recomputeMastery(profile, content);
  assert.equal(profile.domains.signals.mastery, 0.5);
});

test('recomputeMastery: a signals mean below the cap stays as it is', () => {
  const items = [item('test.sig', 'signals', 'signal'), item('test.rule', 'signals', 'rule')];
  const content = contentOf(items, [question('test.rule')]);
  const profile = freshProfile(SETTINGS);
  profile.items['test.rule'] = sr({ fam: 0.5 });
  recomputeMastery(profile, content);
  assert.equal(profile.domains.signals.mastery, 0.25);
});

test('recomputeMastery: the cap applies to signals only', () => {
  const items = [item('test.rule', 'switching', 'rule')];
  const profile = freshProfile(SETTINGS);
  profile.items['test.rule'] = sr({ fam: 1 });
  recomputeMastery(profile, contentOf(items, [question('test.rule')]));
  assert.equal(profile.domains.switching.mastery, 1);
});

test('recomputeMastery: a domain with no drillable item keeps its value', () => {
  const items = [item('test.a', 'definitions', 'definition'), item('test.r', 'radio', 'rule')];
  const profile = freshProfile(SETTINGS);
  profile.domains.radio.mastery = 0.7;
  profile.domains.authority.mastery = 0.4;
  recomputeMastery(profile, contentOf(items));
  assert.equal(profile.domains.radio.mastery, 0.7);
  assert.equal(profile.domains.authority.mastery, 0.4);
  assert.equal(profile.domains.definitions.mastery, 0);
});

test('recomputeMastery: it makes the entry of a domain that the profile does not hold', () => {
  const items = [item('test.a', 'definitions', 'definition')];
  const profile = freshProfile(SETTINGS);
  delete profile.domains.definitions;
  profile.items['test.a'] = sr({ fam: 0.5 });
  recomputeMastery(profile, contentOf(items));
  assert.deepEqual(profile.domains.definitions, { mastery: 0.5, lastDrill: null });
});

// ---- stageFor
// Each profile has a mean that is exact, or clear of a threshold by 0.01.

function profileAt(mastery: number): Profile {
  const profile = freshProfile(SETTINGS);
  for (const d of DOMAINS) profile.domains[d.id].mastery = mastery;
  return profile;
}

test('stageFor: a mean of 0 gives "First-day trainee"', () => {
  assert.equal(stageFor(profileAt(0)), 'First-day trainee');
});

test('stageFor: each side of 0.15', () => {
  assert.equal(stageFor(profileAt(0.14)), 'First-day trainee');
  assert.equal(stageFor(profileAt(0.16)), 'Learning the ropes');
});

test('stageFor: each side of 0.50, and a mean of exactly 0.5', () => {
  assert.equal(stageFor(profileAt(0.49)), 'Learning the ropes');
  assert.equal(stageFor(profileAt(0.5)), 'Coming along');
  assert.equal(stageFor(profileAt(0.51)), 'Coming along');
});

test('stageFor: each side of 0.85, and a mean of exactly 1', () => {
  assert.equal(stageFor(profileAt(0.84)), 'Coming along');
  assert.equal(stageFor(profileAt(0.86)), 'Sharp');
  assert.equal(stageFor(profileAt(1)), 'Sharp');
});

test('stageFor: a domain that the profile does not hold counts as 0', () => {
  const profile = profileAt(1);
  profile.domains = {};
  assert.equal(stageFor(profile), 'First-day trainee');
});

// ---- freshProfile and loadProfile

test('freshProfile: the start values', () => {
  const profile = freshProfile(SETTINGS);
  const now = new Date(NOW).toISOString();
  assert.equal(profile.schema, 1);
  assert.equal(profile.createdAt, now);
  assert.equal(profile.updatedAt, now);
  assert.equal(profile.settings, SETTINGS);
  assert.deepEqual(profile.items, {});
  assert.deepEqual(Object.keys(profile.domains), DOMAINS.map((d) => d.id));
  for (const d of DOMAINS) assert.deepEqual(profile.domains[d.id], { mastery: 0, lastDrill: null });
  assert.deepEqual(profile.yard, { completed: [], best: {} });
  assert.deepEqual(profile.path, { stage: 'First-day trainee', unlocked: ['reference', 'drill'], testReady: false });
});

test('loadProfile: nothing stored gives a fresh profile', () => {
  assert.deepEqual(loadProfile(SETTINGS), freshProfile(SETTINGS));
});

test('loadProfile: bad JSON gives a fresh profile', () => {
  stored[PROFILE_KEY] = '{ not json';
  assert.deepEqual(loadProfile(SETTINGS), freshProfile(SETTINGS));
});

test('loadProfile: another schema number gives a fresh profile', () => {
  stored[PROFILE_KEY] = JSON.stringify({ schema: 2, items: { 'test.a': sr({ fam: 1 }) } });
  assert.deepEqual(loadProfile(SETTINGS), freshProfile(SETTINGS));
});

test('loadProfile: a stored profile with schema 1 comes back, with no "radio" field', () => {
  const saved = { ...freshProfile(SETTINGS), items: { 'test.a': sr({ fam: 0.5, seen: 2 }) }, radio: { done: true } };
  stored[PROFILE_KEY] = JSON.stringify(saved);
  const loaded = loadProfile({ ...SETTINGS, dys: true });
  assert.equal('radio' in loaded, false);
  const { radio: _radio, ...rest } = saved;
  assert.deepEqual(loaded, rest);
});
