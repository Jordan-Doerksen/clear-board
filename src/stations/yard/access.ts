// access.ts — the access layer of the Yard (P-02, P-03): the text mirror of the yard and the one
// status region. The controller (../yardSim.js) calls it. It holds no game state and it changes
// none: it reads the state of model.js through the facts of the picture (./drawing/bodies.ts).
//
// The words (MIRROR-WORDS): each word of the mirror is a word that the app shows today, or a state
// word of the drawing. The track ids, the car marks, the type names, "loaded" and "empty", TIED,
// LOOSE, KICKABLE, BUILD k / m, ENGINE, "switch", "lined normal" and "lined reverse". The SME reads
// the mirror before the change reaches main. The words are listed in specs/words/Y4a.md.
//
// The status region repeats the words of the banner and the readout. A refusal of the model is
// frozen text: the region says it as it is and does not change it.

import { yardFacts } from './drawing/bodies.ts';
import type { ModelState, ModelPuzzle, TrackFact, CarFact, Lining } from './drawing/bodies.ts';

/** The words of one car: its mark, its type, and loaded or empty. */
const carWords = (c: CarFact): string => `${c.mark} ${c.type} ${c.loaded ? 'loaded' : 'empty'}`;

/** "1 car" or "n cars", with the list of the cars after a colon. */
function carList(cars: CarFact[], from: string): string {
  const n = cars.length;
  const count = `${n} car${n === 1 ? '' : 's'}`;
  return n ? `${count} ${from}: ${cars.map(carWords).join(', ')}.` : `${count}.`;
}

/** The line of one track: the lining of its switch, KICKABLE, the cars from the switch to the deep end, TIED or LOOSE, BUILD k / m. */
function trackLine(t: TrackFact, lin: Lining): string {
  const parts = [`${t.id}, switch lined ${lin}.`];
  if (t.kickable) parts.push('KICKABLE.');
  parts.push(carList(t.cars, 'from the switch'));
  if (t.securement) parts.push(`${t.securement}.`);
  if (t.goal) parts.push(`BUILD ${t.goal.have} / ${t.goal.want}.`);
  return parts.join(' ');
}

/** The lines of the mirror for one state: the engine and the cars it holds, then the six tracks from AS71 to AS76. */
export function mirrorLines(state: ModelState, puzzle: ModelPuzzle): string[] {
  const F = yardFacts(state, puzzle);
  const engine = `ENGINE holding ${carList(F.engine.held, 'from the engine')}`;
  return [engine, ...F.tracks.map((t) => trackLine(t, F.lined[t.id]))];
}

/** The text mirror: a list with one item for each line. */
export interface YardMirror {
  /** Writes the lines of this state. An item is written only when its text changed. */
  update(state: object, puzzle: object): void;
}

export function createMirror(list: HTMLElement): YardMirror {
  const items: HTMLLIElement[] = [];
  return {
    update(state, puzzle) {
      const lines = mirrorLines(state as ModelState, puzzle as ModelPuzzle);
      lines.forEach((text, k) => {
        let li = items[k];
        if (!li) { li = document.createElement('li'); items[k] = li; list.appendChild(li); }
        if (li.textContent !== text) li.textContent = text;
      });
    },
  };
}

/** The status region (polite). */
export interface YardLive {
  /** Says the text. The same text two times in a row is said again. */
  say(text: string): void;
}

export function createLive(region: HTMLElement): YardLive {
  let last = '';
  return {
    say(text) {
      // A region that gets the same text again does not change, and a screen reader then says
      // nothing. A no-break space at the end of every second repeat makes the text new.
      const next = text === last.replace(/ $/, '') && !last.endsWith(' ') ? `${text} ` : text;
      last = next;
      region.textContent = next;
    },
  };
}
