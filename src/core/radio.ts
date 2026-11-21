// Clear Board — the pure logic of "Call it yourself" (RadioTest.tsx). No React and no page.
// Each function that draws at random takes the random source as its last parameter. With no
// such parameter it uses Math.random, as the station does. A test gives a fixed source.
import type { Severity } from './severity';
import type { Citation } from './types';

/** Where the verdict of an answer goes for a screen reader (row U-19): a miss on a
 *  safety-critical item (S3 in severity.ts) goes into the alert, which a screen reader says at
 *  once; each other verdict goes into the status, which it says when it is free. */
export function verdictRegion(correct: boolean, severity: Severity): 'status' | 'alert' {
  return !correct && severity === 'S3' ? 'alert' : 'status';
}

// The two labels of a call with no verified CROR citation. The badge of a call that is not
// scored shows one of them. The source line shows the second one in place of the code "SME",
// a word that the learner does not know (row U-08).
export const LABEL_GOI = 'CN practice (GOI), not a CROR rule';
export const LABEL_NO_CITATION = 'No CROR citation in the verified source';

/** One text for Read aloud (row U-31), from words of the screen in screen order. An empty part
 *  goes. A part that does not end with a stop gets a full stop, so that the voice makes a pause. */
export function spokenText(parts: readonly (string | null | undefined | false)[]): string {
  return parts
    .filter((p): p is string => typeof p === 'string' && p.trim() !== '')
    .map(p => p.trim())
    .map(p => (/[.?!…]$/.test(p) ? p : `${p}.`))
    .join(' ');
}

/** The words of the source line of a call: the source, its paragraph and a related paragraph. */
export function sourceLine(c: Pick<Citation, 'source' | 'ref' | 'relatedRef'>): string {
  const source = c.source === 'SME' ? LABEL_NO_CITATION : c.source;
  return `${source}${c.ref ? ` · ${c.ref}` : ''}${c.relatedRef ? ` · related: ${c.relatedRef}` : ''}`;
}

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
