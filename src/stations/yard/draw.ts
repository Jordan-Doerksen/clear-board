// draw.ts — the drawing adapter of the Yard. It owns the canvas element, the pixel-ratio lines,
// the hit test of a click and the one call of render(). The controller (../yardSim.js) draws only
// through the object that createDrawing() returns. This file calls no sound and no function of
// the game model.
import './drawing/drawing.css';
import { render } from './render.js';
import { W, H, NTRACK, TRACK_IDS, switchPos } from './geometry.js';

/** The game state of model.js. The adapter gives it to render() and reads no field of it. */
export type YardState = Readonly<Record<string, unknown>>;
/** One job of puzzles.js. The adapter gives it to render() and reads no field of it. */
export type YardPuzzle = Readonly<Record<string, unknown>>;
/** A frame of a move or of the arrival, as the controller builds it. `null` is no motion. */
export type YardMotion = Readonly<Record<string, unknown>> | null;

/** The two motion values that render() reads. */
export interface PaintOptions { anim: YardMotion; cine: YardMotion }

/** The box of one switch, in CSS px. The origin is the top left corner of the padding box of the host. */
export interface SwitchBox { id: string; x: number; y: number; width: number; height: number }

/** What the controller gives to the adapter. */
export interface DrawingOptions {
  /** Called for each click on the drawing: with the track id of the switch that was hit, or with null. */
  onPick: (trackId: string | null) => void;
}

/** The drawing object. `createDrawing` makes it. */
export interface YardDrawing {
  /** The one draw call. */
  paint(state: YardState, puzzle: YardPuzzle, opts: PaintOptions): void;
  /** Six boxes, in the order AS71 to AS76. Each box is the square around the hit circle of a switch. */
  switchBoxes(): SwitchBox[];
  /** `fn` is called after each change of the size of the drawing. */
  onLayout(fn: () => void): void;
  /** Stops the size observer. */
  destroy(): void;
}

// The radius of the hit circle of a switch, in units of the drawing.
const HIT = 18;

export function createDrawing(host: HTMLElement, { onPick }: DrawingOptions): YardDrawing {
  const canvas = document.createElement('canvas');
  canvas.id = 'yard';
  canvas.className = 'yd-view';
  host.appendChild(canvas);

  // The bitmap is W by H times the pixel ratio. The ratio is not more than 2.
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = W * dpr; canvas.height = H * dpr; context.scale(dpr, dpr);

  // A click lines the nearest switch that is closer than the hit radius.
  canvas.addEventListener('click', (e) => {
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width * W, y = (e.clientY - r.top) / r.height * H;
    let best = -1, bd = HIT;
    for (let i = 0; i < NTRACK; i++) {
      const s = switchPos(i), d = Math.hypot(s.x - x, s.y - y);
      if (d < bd) { bd = d; best = i; }
    }
    onPick(best >= 0 ? TRACK_IDS[best] : null);
  });

  let observer: ResizeObserver | null = null;
  const layoutFns: Array<() => void> = [];

  return {
    paint(state, puzzle, { anim, cine }) {
      render(context, state, puzzle, { anim, cine });
    },

    switchBoxes() {
      const c = canvas.getBoundingClientRect(), h = host.getBoundingClientRect();
      const sx = c.width / W, sy = c.height / H;
      const left = c.left - h.left - host.clientLeft, top = c.top - h.top - host.clientTop;
      return TRACK_IDS.map((id, i) => {
        const s = switchPos(i);
        return { id, x: left + (s.x - HIT) * sx, y: top + (s.y - HIT) * sy, width: 2 * HIT * sx, height: 2 * HIT * sy };
      });
    },

    onLayout(fn) {
      layoutFns.push(fn);
      if (observer) return;
      // The observer is made at the first call. A ResizeObserver also reports the size that the
      // element has when the observer starts: that report is not a change and is not passed on.
      let seen = canvas.getBoundingClientRect();
      observer = new ResizeObserver(() => {
        const now = canvas.getBoundingClientRect();
        if (now.width === seen.width && now.height === seen.height) return;
        seen = now;
        for (const f of layoutFns) f();
      });
      observer.observe(canvas);
    },

    destroy() {
      if (observer) observer.disconnect();
      observer = null;
      layoutFns.length = 0;
    },
  };
}
