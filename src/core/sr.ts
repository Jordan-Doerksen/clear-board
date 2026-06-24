// Clear Board — SM-2-lite spaced repetition (SPEC §Retention). Pure functions over an item's SR state.
// Ported 1:1 from the vanilla core/sr.js — same math, now typed.
import type { SRState } from './types';

const DAY = 86400000;

export function newState(): SRState {
  return { fam: 0, seen: 0, correct: 0, lastSeen: null, due: new Date().toISOString(), ease: 2.5, interval: 0 };
}

// Update SR state after an answer. `correct` is a boolean for V1 (no easy/hard buttons yet).
export function grade(prev: SRState | undefined, correct: boolean): SRState {
  const s: SRState = { ...(prev || newState()) };
  s.seen += 1;
  s.lastSeen = new Date().toISOString();
  if (correct) {
    s.correct += 1;
    s.interval = s.interval === 0 ? 1 : s.interval === 1 ? 6 : Math.round(s.interval * s.ease);
    s.ease = Math.min(2.8, s.ease + 0.05);
  } else {
    s.interval = 0;                       // reset — re-show this session
    s.ease = Math.max(1.3, s.ease - 0.2);
  }
  s.fam = Math.min(1, s.interval / 30);   // not "familiar" until it survives ~a month of spacing
  s.due = new Date(Date.now() + s.interval * DAY).toISOString();
  return s;
}

export function isDue(st: SRState | undefined): boolean {
  return !st || !st.due || new Date(st.due).getTime() <= Date.now();
}

// Familiarity decayed by time since last seen (half-life 60d) — drives mastery, reflects retention not activity.
export function decayedFam(st: SRState | undefined): number {
  if (!st || !st.lastSeen) return (st && st.fam) || 0;
  const days = (Date.now() - new Date(st.lastSeen).getTime()) / DAY;
  return (st.fam || 0) * Math.pow(0.5, days / 60);
}
