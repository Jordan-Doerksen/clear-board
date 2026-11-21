// anim.js — a tiny sequential tween driver for the "watch the engineer work it"
// animations. play() runs steps back-to-back; each step gets eased t∈[0,1].
//
// The travel legs of a move take the two times of the Yard block of the bridge
// (src/styles/clear-board.tokens.css; R7-P4, D-0038). When the steps of a list hold a first and a
// last step of LEG ms (the run in and the run out of a move, ../yardSim.js animateMove), the first
// step takes --yard-run-in and the last step takes --yard-run-out (ruling LEG-ROLE). Each other
// step keeps its time. Each time is multiplied by the speed factor, as before.
//
// Reduced motion (MOTION-STOP-OWNER): with the option `still`, play() runs each step one time with
// its end value (t = 1), in order, in the same call. Then it calls onFrame one time and onDone. It
// asks for no frame and lets no time pass. Each step runs, because a step can commit a part of a
// move to the model (yardSim.js, commitOnce).

export const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

let speedFactor = 1;                 // >1 = slower (Watch-optimal slow-mo, later)
export function setSpeed(f) { speedFactor = f; }

// The time that the controller gives to the run in and to the run out of a move. It marks the two
// legs; the time of each leg comes from the bridge.
const LEG = 600;

// A time of the bridge, in ms. The value is "840ms" or "0.84s". A missing value stops with an error.
function readTime(name) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const m = /^(\d+(?:\.\d+)?|\.\d+)(ms|s)$/.exec(raw);
  if (!m) throw new Error(`anim.js reads ${name} and found "${raw}"`);
  return parseFloat(m[1]) * (m[2] === 's' ? 1000 : 1);
}

// steps: [{ dur, fn(t) }]. onFrame() is called after each fn (to redraw).
// With still: true the steps end at once (see the head of this file); onDone is called before
// play() returns.
// Returns a cancel() handle.
export function play(steps, { onFrame, onDone, still = false } = {}) {
  if (still) {
    for (const step of steps) step.fn(1);
    if (onFrame) onFrame();
    if (onDone) onDone();
    return () => {};
  }
  const runIn = readTime('--yard-run-in');
  const runOut = readTime('--yard-run-out');
  const durs = steps.map((step) => step.dur);
  if (durs.length >= 2 && durs[0] === LEG && durs[durs.length - 1] === LEG) {
    durs[0] = runIn;
    durs[durs.length - 1] = runOut;
  }
  let i = 0, start = null, raf = 0, cancelled = false;
  function frame(now) {
    if (cancelled) return;
    if (start == null) start = now;
    const step = steps[i];
    const dur = Math.max(1, durs[i] * speedFactor);
    const t = Math.min(1, (now - start) / dur);
    step.fn(easeInOut(t));
    if (onFrame) onFrame();
    if (t >= 1) {
      i++; start = null;
      if (i >= steps.length) { if (onDone) onDone(); return; }
    }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  return () => { cancelled = true; cancelAnimationFrame(raf); };
}
