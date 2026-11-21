// access.ts — the access layer of the Yard (P-02, P-03): the six switch buttons, the text mirror of
// the yard and the one status region. The controller (../yardSim.js) calls it. It holds no game
// state and it changes none: it reads the state of model.js through the facts of the picture
// (./drawing/bodies.ts), and a press of a switch button calls the path of today (onPick).
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
import type { SwitchBox } from './draw.ts';

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

/** What the mirror needs to know besides the state of the model. */
export interface MirrorOptions {
  /** The train has departed out the lead (R7-P14): the engine line says so, with its cars. */
  departed?: boolean;
}

/** The lines of the mirror for one state: the engine and the cars it holds, then the six tracks from AS71 to AS76. */
export function mirrorLines(state: ModelState, puzzle: ModelPuzzle, opts: MirrorOptions = {}): string[] {
  const F = yardFacts(state, puzzle);
  const engine = opts.departed
    ? `ENGINE departed out the lead with ${carList(F.engine.held, 'from the engine')}`
    : `ENGINE holding ${carList(F.engine.held, 'from the engine')}`;
  return [engine, ...F.tracks.map((t) => trackLine(t, F.lined[t.id]))];
}

/** The text mirror: a list with one item for each line. */
export interface YardMirror {
  /** Writes the lines of this state. An item is written only when its text changed. */
  update(state: object, puzzle: object, opts?: MirrorOptions): void;
}

export function createMirror(list: HTMLElement): YardMirror {
  const items: HTMLLIElement[] = [];
  return {
    update(state, puzzle, opts) {
      const lines = mirrorLines(state as ModelState, puzzle as ModelPuzzle, opts);
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
      const next = text === last.replace(/\u00a0$/, '') && !last.endsWith('\u00a0') ? `${text}\u00a0` : text;
      last = next;
      region.textContent = next;
    },
  };
}

// ---- The six switch buttons (P-02, A11Y-01, SWITCH-BUTTONS) -------------------------------------

/** The name of a switch button: the track and the lining in words (contract B.6). */
export const switchName = (id: string, lin: Lining): string => `${id} switch, lined ${lin}`;

/** What the buttons need from the drawing (draw.ts). */
export interface SwitchPlaces {
  readonly controls: HTMLElement;
  switchBoxes(): SwitchBox[];
  onLayout(fn: () => void): void;
}

/** The six buttons. */
export interface SwitchButtons {
  /** Writes the lining of each switch into the name of its button. */
  setLining(lined: Record<string, Lining>): void;
}

/**
 * One native button for each switch, in the control layer of the picture, in the order of `ids`
 * (AS71 to AS76). Each button lies on the 44 px box of its switch, in the wide form and in the
 * tall form. After each layout of the picture the buttons move; they are never made again, so
 * focus stays on the pressed button (R2 C15). A press, Enter or Space calls `onPress` with the
 * track id. The click does not reach the click listener of the picture, so that one press throws
 * the switch one time. `host` is the frame that switchBoxes() measures from.
 *
 * The name says the lining ("AS73 switch, lined reverse"). The button has no pressed state, so that
 * a screen reader says the lining one time (ruling SW-NAME).
 */
export function createSwitchButtons(places: SwitchPlaces, host: HTMLElement, ids: readonly string[], onPress: (id: string) => void): SwitchButtons {
  const layer = places.controls;
  const buttons = new Map<string, HTMLButtonElement>();
  for (const id of ids) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'yd-view-sw';
    b.dataset.sw = id;
    b.setAttribute('aria-label', switchName(id, 'normal'));
    b.addEventListener('click', (e) => { e.stopPropagation(); onPress(id); });
    layer.appendChild(b);
    buttons.set(id, b);
  }
  const px = (v: number): string => `${Math.round(v * 10) / 10}px`;
  // Moves each button to its box. switchBoxes() measures from the padding box of the host; the
  // layer can stand at another place in the host, so the place of the layer is taken off.
  function place(): void {
    const boxes = places.switchBoxes();
    const lr = layer.getBoundingClientRect(), hr = host.getBoundingClientRect();
    const dx = lr.left - hr.left - host.clientLeft, dy = lr.top - hr.top - host.clientTop;
    for (const [id, b] of buttons) {
      const box = boxes.find((x) => x.id === id);
      b.hidden = !box;
      if (!box) continue;
      const left = px(box.x - dx), top = px(box.y - dy), width = px(box.width), height = px(box.height);
      if (b.style.left !== left) b.style.left = left;
      if (b.style.top !== top) b.style.top = top;
      if (b.style.width !== width) b.style.width = width;
      if (b.style.height !== height) b.style.height = height;
    }
  }
  places.onLayout(place);
  return {
    setLining(lined) {
      for (const [id, b] of buttons) {
        const name = switchName(id, lined[id] === 'reverse' ? 'reverse' : 'normal');
        if (b.getAttribute('aria-label') !== name) b.setAttribute('aria-label', name);
      }
    },
  };
}
