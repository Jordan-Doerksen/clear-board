// Clear Board — the pure logic of "Call it yourself" (RadioTest.tsx). No React and no page.
// Each function that draws at random takes the random source as its last parameter. With no
// such parameter it uses Math.random, as the station does. A test gives a fixed source.

/** A source of random numbers in [0, 1), as Math.random. */
export type Random = () => number;

/** A call of the procedure. RadioTest.tsx reads the calls from the STEPS of radioSim.js. */
export interface RadioCall { call: string }

/** A copy of the list in a random order (Fisher-Yates). The list itself does not change. */
export function shuffle<T>(list: readonly T[], random: Random = Math.random): T[] {
  const x = list.slice();
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; }
  return x;
}

// A distractor is a different real call that the learner cannot remove by its shape alone. It is
// not equal to the answer, it does not contain the answer, and the answer does not contain it (the
// quiz-validity gate, REVAMP §7.5).
export function distinct(answer: string, other: string): boolean {
  if (other === answer) return false;
  const a = answer.toLowerCase(), b = other.toLowerCase();
  return !a.includes(b) && !b.includes(a);
}

// The options of one call: the answer and up to two distractors, in a random order. A distractor
// near the answer in the procedure comes first: "five cars, five, CN 2204" against "two cars, two"
// is a real confusion on the ground; a closing "ten feet" against the first call is not.
export function optionsFor(all: readonly RadioCall[], step: number, random: Random = Math.random): string[] {
  const answer = all[step].call;
  const pool = all.map((s, i) => ({ call: s.call, gap: Math.abs(i - step) }))
    .filter(o => o.gap > 0 && distinct(answer, o.call));
  const near = shuffle(pool.filter(o => o.gap <= 3), random).map(o => o.call);
  const far = shuffle(pool.filter(o => o.gap > 3), random).map(o => o.call);
  const picked = [...new Set([...near, ...far])].slice(0, 2);
  return shuffle([answer, ...picked], random);
}
