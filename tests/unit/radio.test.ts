// Unit tests of src/core/radio.ts: the options of "Call it yourself" (row U-44).
// A test pins what the code does today. It does not say that the code is right, and no test
// states a rule. The calls are read from the STEPS region of src/stations/radioSim.js: the region
// is found by its anchors and its array literal is evaluated in an empty node:vm context, as the
// hash gate reads it (tools/frozen-check.mjs). The file is read and never written. A message names
// a step by its number and holds no call text.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import { distinct, optionsFor, shuffle } from '../../src/core/radio.ts';
import type { RadioCall, Random } from '../../src/core/radio.ts';

// A fixed generator in place of Math.random: the generator of the seed of the smoke test.
function seeded(start: number): Random {
  let state = start >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

const START = 'export const STEPS = [';
function readSteps(): RadioCall[] {
  const text = readFileSync(new URL('../../src/stations/radioSim.js', import.meta.url), 'utf8');
  const start = text.indexOf(START);
  assert.notEqual(start, -1, 'the start anchor of the STEPS region is not in radioSim.js');
  assert.equal(text.indexOf(START, start + 1), -1, 'the start anchor of the STEPS region is in radioSim.js two times');
  const end = text.indexOf('\n];', start);
  assert.notEqual(end, -1, 'the STEPS region has no end');
  const literal = text.slice(start + START.length - 1, end + 2);
  return vm.runInNewContext(`(${literal})`, Object.create(null), { timeout: 2000 }) as RadioCall[];
}
const STEPS = readSteps();
const SEEDS = Array.from({ length: 100 }, (_, n) => n + 1);

// Made-up calls. Calls 0 to 9 are different, and none holds another.
const made = (n: number): RadioCall => ({ call: `made-up call ${String.fromCharCode(65 + n)}${n}` });
const MADE = Array.from({ length: 10 }, (_, n) => made(n));

test('the STEPS region of radioSim.js holds 14 calls', () => {
  assert.equal(STEPS.length, 14);
  assert.ok(STEPS.every((s) => typeof s.call === 'string' && s.call.length > 0));
});

test('optionsFor: for each call of the 14 and 100 seeds, the answer is one of the options', () => {
  for (let step = 0; step < STEPS.length; step++) {
    for (const seed of SEEDS) {
      assert.ok(optionsFor(STEPS, step, seeded(seed)).includes(STEPS[step].call), `step ${step + 1}, seed ${seed}: the answer is not one of the options`);
    }
  }
});

test('optionsFor: the options of a call differ, and no distractor equals the answer, holds it or is held by it', () => {
  for (let step = 0; step < STEPS.length; step++) {
    for (const seed of SEEDS) {
      const options = optionsFor(STEPS, step, seeded(seed));
      assert.equal(new Set(options).size, options.length, `step ${step + 1}, seed ${seed}: an option comes two times`);
      for (const option of options) {
        if (option === STEPS[step].call) continue;
        assert.ok(distinct(STEPS[step].call, option), `step ${step + 1}, seed ${seed}: a distractor is not distinct from the answer`);
      }
    }
  }
});

test('optionsFor: each call of the 14 gets three options: the answer and two distractors', () => {
  for (let step = 0; step < STEPS.length; step++) {
    assert.equal(optionsFor(STEPS, step, seeded(1)).length, 3, `step ${step + 1}`);
  }
});

test('optionsFor: one seed gives the same options two times, for each call', () => {
  for (let step = 0; step < STEPS.length; step++) {
    assert.deepEqual(optionsFor(STEPS, step, seeded(12345)), optionsFor(STEPS, step, seeded(12345)), `step ${step + 1}`);
  }
});

test('optionsFor: two distractors near the answer in the list (3 steps or fewer) come before a far one', () => {
  for (const seed of SEEDS) {
    const options = optionsFor(MADE, 5, seeded(seed));
    const gaps = options.filter((o) => o !== MADE[5].call).map((o) => Math.abs(MADE.findIndex((m) => m.call === o) - 5));
    assert.equal(gaps.length, 2, `seed ${seed}`);
    assert.ok(gaps.every((g) => g >= 1 && g <= 3), `seed ${seed}: the gaps are ${gaps.join(', ')}`);
  }
});

test('optionsFor: a far distractor fills in when fewer than two near calls are distinct from the answer', () => {
  // Step 0. Steps 2 and 3 hold the answer, so they are not distractors. Step 1 is the one near
  // distractor. Steps 4 and 5 are far.
  const calls: RadioCall[] = [{ call: 'call zero' }, { call: 'near one' }, { call: 'call zero, over' }, { call: 'say call zero' }, { call: 'far one' }, { call: 'far two' }];
  for (const seed of SEEDS) {
    const options = optionsFor(calls, 0, seeded(seed));
    assert.equal(options.length, 3, `seed ${seed}`);
    assert.ok(options.includes('near one'), `seed ${seed}: the near distractor is not an option`);
    assert.equal(options.filter((o) => o === 'far one' || o === 'far two').length, 1, `seed ${seed}: one far distractor is expected`);
  }
  // A list of two calls gives one distractor.
  assert.equal(optionsFor(MADE.slice(0, 2), 0, seeded(3)).length, 2);
});

test('optionsFor: a call that holds the answer, or that the answer holds, is never a distractor', () => {
  const calls: RadioCall[] = [{ call: 'Made-up call' }, { call: 'made-up call, over' }, { call: 'up call' }, { call: 'another one' }, { call: 'a third one' }];
  for (const seed of SEEDS) {
    const options = optionsFor(calls, 0, seeded(seed));
    assert.ok(!options.includes(calls[1].call) && !options.includes(calls[2].call), `seed ${seed}`);
    assert.deepEqual([...options].sort(), ['Made-up call', 'a third one', 'another one'].sort(), `seed ${seed}`);
  }
});

test('distinct: equal calls, and calls where one holds the other with any letter case, are not distinct', () => {
  assert.equal(distinct('Five feet.', 'Five feet.'), false);
  assert.equal(distinct('Five feet.', 'five feet. over.'), false);
  assert.equal(distinct('FIVE FEET, OVER.', 'five feet'), false);
  assert.equal(distinct('Five feet.', 'Ten feet.'), true);
});

test('shuffle: the list does not change, and the copy holds the same entries', () => {
  const list = ['a', 'b', 'c', 'd', 'e'];
  const copy = shuffle(list, seeded(9));
  assert.deepEqual(list, ['a', 'b', 'c', 'd', 'e']);
  assert.deepEqual([...copy].sort(), list);
  assert.deepEqual(shuffle(list, seeded(9)), copy);
});
