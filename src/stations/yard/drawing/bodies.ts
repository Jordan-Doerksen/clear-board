// bodies.ts — the facts of the Yard picture, read from the game state.
//
// Each function here is pure. It reads the state of model.js, the job of puzzles.js and the motion
// values that the controller sends (anim, cine), and it writes nothing. It calls no function of
// model.js. The text mirror of a later job can state the same facts as the picture from these
// functions (yardFacts, routeReaches, trackCuts).
//
// Units: the units of geometry.js. On a track, x is the x of geometry.js. On the lead, x is the x of
// the lead (LEAD_ROUTE runs from LEAD_LEFT to the right).

import {
  NTRACK, TRACK_IDS, switchPos, TRACK_RIGHT, CLEAR, ENGLEN, LEAD_CLEAR, LEAD_ROUTE, TYPES, carLen, restS, polyAt,
  routeLength, engineRoute, SPOT_CLEAR,
} from '../geometry.js';

export type Lining = 'normal' | 'reverse';

/** The fields of the game state of model.js that the drawing reads. */
export interface ModelState {
  tracks: Record<string, string[]>;
  pos: Record<string, number[]>;
  type: Record<string, string>;
  loaded: Record<string, boolean>;
  engine: string[];
  secured: Record<string, boolean>;
  lined: Record<string, Lining>;
  kickable: string[];
  goalTrack?: string;
}

/** The fields of a job of puzzles.js that the drawing reads. */
export interface ModelPuzzle {
  id: string;
  rules?: string[];
  goal: { track?: string; cars: string[]; depart?: boolean; ordered?: boolean };
  opt?: Array<[string, string, number]>;
  kickable?: string[];
}

/** One move of the controller: the engine and its cut on a route (yardSim.js, animateMove and departOut). */
export interface MoveFrame { route: Array<{ x: number; y: number }>; engS: number; cut: string[] }

/** One frame of the arrival (yardSim.js, arrivalCinematic). */
export interface ArrivalFrame { introS: number; setoutCars: string[]; to: string; phase: 'arrive' | 'setout' | 'depart'; spotProg: number }

const TYPE_TABLE: Record<string, { tag: string }> = TYPES;
const typeOf = (state: ModelState, mark: string): string => (state.type[mark] in TYPE_TABLE ? state.type[mark] : 'box');

/** One car. x0 is the end toward the switch on a track, and the end toward the engine on the lead. */
export interface CarFact {
  mark: string;
  /** The last word of the mark: the way a car is called (render.js:169 before Wave 2b). */
  number: string;
  type: string;
  tag: string;
  loaded: boolean;
  len: number;
  x0: number;
  x1: number;
  /** The index of the cut of this car on its track. Two cars of one cut touch. */
  cut: number;
}

export interface TrackFact {
  id: string;
  index: number;
  /** The x and the y of the switch, and the x of the foul point (CLEAR units from the switch). */
  swx: number;
  y: number;
  foulX: number;
  /** The cars from the switch to the deep end. */
  cars: CarFact[];
  /** TIED or LOOSE, by the rule of the drawing of today: a job with the rule secure or kick, 2 cars or more. */
  securement: 'TIED' | 'LOOSE' | null;
  kickable: boolean;
  /** BUILD k / m on the goal track: m cars of the goal, k of them on the track now. */
  goal: { have: number; want: number } | null;
  /** The room bar: the length from the foul point to the end, and the length from the first car to the end. */
  room: { lengthU: number; takenU: number };
}

export interface EngineFact {
  /** The engine at rest on the lead (render.js:47-49 before Wave 2b): its ends and its centre. */
  x0: number;
  x1: number;
  cx: number;
  /** The cars that the engine holds. held[0] is next to the engine. */
  held: CarFact[];
  heldLen: number;
  /** The end of the held cut away from the engine, or the end of the engine with no cut. */
  cutEnd: number;
}

export interface YardFacts {
  tracks: TrackFact[];
  engine: EngineFact;
  lined: Record<string, Lining>;
  /** The track that the lined route reaches: the first reverse switch from AS71 (model.js:66-75). */
  reaches: string | null;
  /** The room bar of the lead: the length that the lead holds clear, and the held length. */
  lead: { lengthU: number; takenU: number };
  /** True when the job shows TIED and LOOSE. */
  showSecured: boolean;
  /** True when the job has a kickable track, and when it has a goal track. */
  kickableJob: boolean;
  goalJob: boolean;
}

/** The track that the lining reaches, with the logic of model.js:66-75: the first reverse switch from AS71. */
export function routeReaches(lined: Record<string, Lining>): string | null {
  for (const id of TRACK_IDS) if (lined[id] === 'reverse') return id;
  return null;
}

/** The cuts of a list of cars: two cars are coupled when the end of one is the start of the next. */
export function trackCuts(cars: CarFact[]): string[][] {
  const cuts: string[][] = [];
  cars.forEach((c, k) => {
    if (k > 0 && Math.abs(cars[k - 1].x1 - c.x0) < 1e-6) cuts[cuts.length - 1].push(c.mark);
    else cuts.push([c.mark]);
  });
  return cuts;
}

function carFact(state: ModelState, mark: string, x0: number): CarFact {
  const type = typeOf(state, mark);
  const len = carLen(type);
  return { mark, number: mark.split(' ').pop() as string, type, tag: TYPE_TABLE[type].tag, loaded: state.loaded[mark] !== false, len, x0, x1: x0 + len, cut: 0 };
}

/** The engine at rest and its held cut, for a list of held cars. */
export function engineAtRest(state: ModelState, held: string[]): EngineFact {
  const heldLen = held.reduce((a, m) => a + carLen(typeOf(state, m)), 0);
  const cx = polyAt(LEAD_ROUTE, restS(heldLen)).x;
  const x0 = cx - ENGLEN / 2, x1 = cx + ENGLEN / 2;
  let x = x1;
  const cars = held.map((m) => { const c = carFact(state, m, x); x = c.x1; return c; });
  return { x0, x1, cx, held: cars, heldLen, cutEnd: x };
}

/**
 * The facts of the picture for one state. `lined` replaces the lining of the state (the layout tries
 * each of the seven routes that the switches can line); with no `lined`, the lining of the state counts.
 */
export function yardFacts(state: ModelState, puzzle: ModelPuzzle, lined?: Record<string, Lining>): YardFacts {
  const rules = puzzle.rules || [];
  const showSecured = rules.includes('secure') || rules.includes('kick');
  const lining = lined || state.lined;
  const goalOn = !puzzle.goal.depart && state.goalTrack ? state.goalTrack : null;
  const tracks: TrackFact[] = [];
  for (let i = 0; i < NTRACK; i++) {
    const id = TRACK_IDS[i], sw = switchPos(i);
    const marks = state.tracks[id], P = state.pos[id];
    const cars = marks.map((m, k) => carFact(state, m, sw.x + P[k]));
    trackCuts(cars).forEach((cut, k) => cut.forEach((m) => { (cars.find((c) => c.mark === m) as CarFact).cut = k; }));
    const goal = goalOn === id ? { have: puzzle.goal.cars.filter((m) => marks.includes(m)).length, want: puzzle.goal.cars.length } : null;
    tracks.push({
      id, index: i, swx: sw.x, y: sw.y, foulX: sw.x + CLEAR, cars,
      securement: showSecured && cars.length >= 2 ? (state.secured[id] ? 'TIED' : 'LOOSE') : null,
      kickable: state.kickable.includes(id),
      goal,
      room: { lengthU: TRACK_RIGHT - sw.x - CLEAR, takenU: cars.length ? TRACK_RIGHT - cars[0].x0 : 0 },
    });
  }
  const engine = engineAtRest(state, state.engine);
  return {
    tracks, engine, lined: lining, reaches: routeReaches(lining),
    lead: { lengthU: LEAD_CLEAR, takenU: engine.heldLen },
    showSecured, kickableJob: (puzzle.kickable || []).length > 0, goalJob: !!goalOn,
  };
}

// ---- Bodies that move -------------------------------------------------------------------------

/** One body of a chain: the engine or a car. A filler car of the inbound train has no mark. */
export interface BodySpec {
  key: string;
  kind: 'engine' | 'car';
  /** The learner's engine, or the engine of the inbound train. */
  inbound: boolean;
  car: CarFact | null;
  len: number;
}

/** The path of a chain: a move to a track (engineRoute), the lead (LEAD_ROUTE), or the road (THROUGH_ROUTE). */
export type PathKind = { kind: 'track'; index: number } | { kind: 'lead' } | { kind: 'through' };

/**
 * A chain of bodies that moves as one rigid piece. `anchorS` is the arclength of the anchor on the
 * route of `path`. Body k lies from `anchorS - offset - len` to `anchorS - offset` (offset and len in
 * units); the layout turns the units into px with the car scale, so the chain keeps its length in px.
 */
export interface ChainSpec { path: PathKind; anchorS: number; bodies: Array<{ body: BodySpec; offset: number }> }

export interface Motion {
  chains: ChainSpec[];
  /** Cars that stand in the model but are not drawn on their track in this frame (the set-out cars of the arrival). */
  hidden: Set<string>;
  /** True when the learner's engine and its held cut are drawn by a chain or not at all. */
  engineMoves: boolean;
}

const sum = (a: number[]): number => a.reduce((x, y) => x + y, 0);

/** The index of the track of an engine route, or -1. The controller passes engineRoute(i) or LEAD_ROUTE. */
export function routeTrack(route: Array<{ x: number; y: number }>): number {
  if (route === LEAD_ROUTE || route.length !== 4) return -1;
  for (let i = 0; i < NTRACK; i++) { const p = switchPos(i); if (p.x === route[2].x && p.y === route[2].y) return i; }
  return -1;
}

/** The arclength of the switch of track i on its engine route. */
export const switchArc = (i: number): number => routeLength(engineRoute(i).slice(0, 3));

/** The bodies that move in this frame, as chains (requirement 33 of the Y2 brief). */
export function motionOf(state: ModelState, anim: MoveFrame | null, cine: ArrivalFrame | null): Motion {
  const chains: ChainSpec[] = [];
  const hidden = new Set<string>();
  if (cine) {
    // The arrival (render.js:33-45, :55-78 before Wave 2b): the learner's engine is not drawn; the
    // set-out cars ride the inbound train and stand on their track only from the depart phase.
    if (cine.phase !== 'depart') cine.setoutCars.forEach((m) => hidden.add(m));
    const train: Array<{ body: BodySpec; offset: number }> = [];
    train.push({ body: { key: 'inbound', kind: 'engine', inbound: true, car: null, len: ENGLEN }, offset: 0 });
    let off = ENGLEN;
    const filler = (k: number, type: string): void => {
      const len = carLen(type);
      train.push({ body: { key: `filler:${k}`, kind: 'car', inbound: true, car: { mark: '', number: '', type, tag: TYPE_TABLE[type].tag, loaded: true, len, x0: 0, x1: len, cut: 0 }, len }, offset: off });
      off += len;
    };
    for (let k = 0; k < 6; k++) filler(k, k % 2 ? 'hopper' : 'box');
    if (cine.phase === 'arrive') {
      for (const m of cine.setoutCars) {
        const c = carFact(state, m, 0);
        train.push({ body: { key: m, kind: 'car', inbound: true, car: c, len: c.len }, offset: off });
        off += c.len;
      }
    }
    for (let k = 0; k < 5; k++) filler(6 + k, k % 2 ? 'box' : 'hopper');
    chains.push({ path: { kind: 'through' }, anchorS: cine.introS + ENGLEN / 2, bodies: train });
    if (cine.phase === 'setout') {
      // The set-out cars slide in from the throat (render.js:68-78 before Wave 2b).
      const i = TRACK_IDS.indexOf(cine.to);
      const marks = state.tracks[cine.to], P = state.pos[cine.to];
      const idx = marks.map((m, k) => (cine.setoutCars.includes(m) ? k : -1)).filter((k) => k >= 0);
      if (idx.length) {
        // render.js:73: the cars start bunched at the throat, at SPOT_CLEAR, and slide deep.
        const shift = (P[idx[0]] - SPOT_CLEAR) * (1 - cine.spotProg);
        const last = idx[idx.length - 1];
        const deep = P[last] + carLen(typeOf(state, marks[last])) - shift;
        const bodies = idx.slice().reverse().map((k) => {
          const c = carFact(state, marks[k], 0);
          return { body: { key: marks[k], kind: 'car' as const, inbound: false, car: c, len: c.len }, offset: deep - (P[k] - shift + c.len) };
        });
        chains.push({ path: { kind: 'track', index: i }, anchorS: switchArc(i) + deep, bodies });
      }
    }
    return { chains, hidden, engineMoves: true };
  }
  if (anim) {
    const cut = anim.cut;
    const lens = cut.map((m) => carLen(typeOf(state, m)));
    const cutLen = sum(lens);
    const bodies: Array<{ body: BodySpec; offset: number }> = [];
    let off = 0;
    for (let k = cut.length - 1; k >= 0; k--) {
      const c = carFact(state, cut[k], 0);
      bodies.push({ body: { key: cut[k], kind: 'car', inbound: false, car: c, len: c.len }, offset: off });
      off += lens[k];
    }
    bodies.push({ body: { key: 'engine', kind: 'engine', inbound: false, car: null, len: ENGLEN }, offset: off });
    const i = routeTrack(anim.route);
    chains.push({ path: i >= 0 ? { kind: 'track', index: i } : { kind: 'lead' }, anchorS: anim.engS + ENGLEN / 2 + cutLen, bodies });
    return { chains, hidden, engineMoves: true };
  }
  return { chains, hidden, engineMoves: false };
}
