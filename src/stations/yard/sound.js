// sound.js — synthesized Web Audio sfx (no asset files). Lazy context resumed on
// first gesture; mute persisted in localStorage. SPEC §9.
//
// The key sl_muted holds the stored choice (2c-plan C8): '0' is sound on, '1' is sound off. The
// sound is off by default (R7-P2): with no stored value the Yard is silent. The controller reads the
// stored choice at each mount (loadMuted), so that a reset of the progress, which removes the key,
// shows at the next visit with no reload. Nothing here reads storage when the module loads.
//
// Each read and each write of the key is guarded: a browser can refuse storage, and then the call
// throws. With storage refused, the choice of this page holds until the page is closed, and the Yard
// still loads and plays (U-07).

const KEY = 'sl_muted';
let ctx = null;
let muted = true;
// The notes of the win melody that wait for their time, and the tones that sound now. stopAll()
// stops both (ruling SOUND-STOP), so that no note plays after the learner leaves the Yard.
const timers = new Set();
const tones = new Set();

/** Reads the stored choice and returns true when the sound is off. With no stored value it is off. */
export function loadMuted() {
  try { muted = localStorage.getItem(KEY) !== '0'; } catch { /* storage refused: the choice of this page holds */ }
  return muted;
}

export function toggleMute() {
  muted = !muted;
  try { localStorage.setItem(KEY, muted ? '1' : '0'); } catch { /* storage refused: the choice holds for this page */ }
  return muted;
}
export function resume() {
  if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { /* no audio */ } }
  if (ctx && ctx.state === 'suspended') ctx.resume();
}

function blip(freq, dur, type = 'sine', gain = 0.18) {
  if (muted || !ctx) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t); o.stop(t + dur);
  tones.add(o);
  o.onended = () => tones.delete(o);
}

/** Stops each timed note and each tone that sounds now. The controller calls it from unmount(). */
export function stopAll() {
  for (const id of timers) clearTimeout(id);
  timers.clear();
  for (const o of tones) { try { o.stop(); } catch { /* the tone has ended */ } }
  tones.clear();
}

// One sound, one meaning (R7 11.1, 11.2). points: a switch changes position. couple: cars couple.
// roll: cars roll with no engine. refuse: the call is refused. win: the learner completed the job.
// confirm (R7-P9): an action of the conductor that moves no equipment: secure, flag a line of the
// switch list, and a right certify.
export const sfx = {
  points() { blip(880, 0.05, 'square', 0.08); },        // switch target click
  confirm() { blip(660, 0.12, 'sine', 0.12); },
  couple() { blip(150, 0.12, 'triangle', 0.25); blip(90, 0.18, 'sine', 0.2); }, // clunk
  roll() { blip(320, 0.25, 'sawtooth', 0.05); },
  refuse() { blip(140, 0.18, 'sawtooth', 0.12); },
  win() {
    [523, 659, 784, 1047].forEach((f, k) => {
      const id = setTimeout(() => { timers.delete(id); blip(f, 0.22, 'triangle', 0.18); }, k * 90);
      timers.add(id);
    });
  },
};
