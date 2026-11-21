// Unit tests of src/core/sr.ts: the schedule of one item.
// A test pins what the code does today. It does not say that the code is right.
// The clock is a mock, so that each date is exact. Node prints a warning for the mock clock.
import assert from 'node:assert/strict';
import { afterEach, beforeEach, mock, test } from 'node:test';
import { decayedFam, grade, isDue, newState } from '../../src/core/sr.ts';
import type { SRState } from '../../src/core/types.ts';

const NOW = Date.UTC(2026, 0, 15, 12, 0, 0);
const DAY = 86400000;
const iso = (ms: number) => new Date(ms).toISOString();
const state = (over: Partial<SRState> = {}): SRState => ({
  fam: 0, seen: 0, correct: 0, lastSeen: null, due: iso(NOW), ease: 2.5, interval: 0, ...over,
});

beforeEach(() => { mock.timers.enable({ apis: ['Date'], now: NOW }); });
afterEach(() => { mock.timers.reset(); });

test('newState: the item is due now and has the start values', () => {
  assert.deepEqual(newState(), { fam: 0, seen: 0, correct: 0, lastSeen: null, due: iso(NOW), ease: 2.5, interval: 0 });
});

test('isDue: an item with no state is due', () => {
  assert.equal(isDue(undefined), true);
});

test('isDue: an item with no due date is due', () => {
  assert.equal(isDue(state({ due: '' })), true);
});

test('isDue: an item with a past due date is due', () => {
  assert.equal(isDue(state({ due: iso(NOW - DAY) })), true);
});

test('isDue: an item with a due date of now is due', () => {
  assert.equal(isDue(state({ due: iso(NOW) })), true);
});

test('isDue: an item with a future due date is not due', () => {
  assert.equal(isDue(state({ due: iso(NOW + DAY) })), false);
});

test('decayedFam: no state gives 0', () => {
  assert.equal(decayedFam(undefined), 0);
});

test('decayedFam: a state with no lastSeen keeps its familiarity', () => {
  assert.equal(decayedFam(state({ fam: 0.4, lastSeen: null })), 0.4);
});

test('decayedFam: at 0 days the familiarity is whole', () => {
  assert.equal(decayedFam(state({ fam: 0.8, lastSeen: iso(NOW) })), 0.8);
});

test('decayedFam: at 60 days the familiarity is one half', () => {
  assert.equal(decayedFam(state({ fam: 0.8, lastSeen: iso(NOW - 60 * DAY) })), 0.4);
});

test('decayedFam: at 120 days the familiarity is one quarter', () => {
  assert.equal(decayedFam(state({ fam: 0.8, lastSeen: iso(NOW - 120 * DAY) })), 0.2);
});

test('grade: a first correct answer writes due as now plus 1 day', () => {
  const s = grade(undefined, true);
  assert.equal(s.interval, 1);
  assert.equal(s.due, iso(NOW + 1 * DAY));
  assert.equal(s.lastSeen, iso(NOW));
  assert.equal(s.seen, 1);
  assert.equal(s.correct, 1);
});

test('grade: a second correct answer writes due as now plus 6 days', () => {
  const s = grade(grade(undefined, true), true);
  assert.equal(s.interval, 6);
  assert.equal(s.due, iso(NOW + 6 * DAY));
  assert.equal(s.seen, 2);
  assert.equal(s.correct, 2);
});

test('grade: a later correct answer writes due as now plus the interval', () => {
  const s = grade(state({ interval: 6, ease: 2.5, seen: 2, correct: 2 }), true);
  assert.equal(s.interval, 15);
  assert.equal(s.due, iso(NOW + 15 * DAY));
});

test('grade: a miss writes due as now and counts no correct answer', () => {
  const s = grade(state({ interval: 6, ease: 2.5, seen: 2, correct: 2, fam: 0.2 }), false);
  assert.equal(s.interval, 0);
  assert.equal(s.due, iso(NOW));
  assert.equal(s.fam, 0);
  assert.equal(s.seen, 3);
  assert.equal(s.correct, 2);
});

test('grade: it does not change the state that it gets', () => {
  const before = state({ interval: 6 });
  const copy = { ...before };
  grade(before, true);
  assert.deepEqual(before, copy);
});

test('grade: familiarity reaches 1 at an interval of 30', () => {
  const s = grade(state({ interval: 12, ease: 2.5 }), true);
  assert.equal(s.interval, 30);
  assert.equal(s.fam, 1);
});

test('grade: familiarity stays at 1 above an interval of 30', () => {
  const s = grade(state({ interval: 20, ease: 2.5 }), true);
  assert.equal(s.interval, 50);
  assert.equal(s.fam, 1);
});
