// Clear Board — profile + content library (SPEC schemas). Local-first; one profile, one library.
import { decayedFam } from './sr.js';

export const DOMAINS = [
  { id: 'definitions', name: 'The words', desc: 'CROR definitions — the language of the job.', live: true },
  { id: 'signals',     name: 'Signals',   desc: 'Read the aspect, know the indication.',       live: false },
  { id: 'switching',   name: 'Switching', desc: 'Work the yard: pull, spot, kick — clean.',     live: false },
  { id: 'securement',  name: 'Securement',desc: 'Rule 112 — tie it down so it stays put.',      live: false },
  { id: 'radio',       name: 'Radio',     desc: 'The calls, word for word.',                    live: false },
  { id: 'authority',   name: 'Authority', desc: 'OCS · ABS · CTC — who owns the track.',         live: false },
];
// V1: only `definitions` has migrated content. Signals + the rest land in later slices.

const PROFILE_KEY = 'cb.profile.v1';
const CONTENT_FILES = ['data/definitions.json'];   // grows as domains are migrated

export function freshProfile(settings) {
  return {
    schema: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    settings, items: {},
    domains: Object.fromEntries(DOMAINS.map(d => [d.id, { mastery: 0, lastDrill: null }])),
    path: { stage: 'First-day trainee', unlocked: ['reference', 'drill'], testReady: false },
  };
}
export function loadProfile(settings) {
  try { const p = JSON.parse(localStorage.getItem(PROFILE_KEY)); if (p && p.schema === 1) return p; } catch {}
  return freshProfile(settings);
}
export function saveProfile(p) {
  p.updatedAt = new Date().toISOString();
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch {}
}
export function exportProfile(p) { return JSON.stringify(p, null, 2); }   // F6: progress is portable

export async function loadContent() {
  const items = [];
  for (const f of CONTENT_FILES) {
    try { const r = await fetch(f); if (r.ok) items.push(...(await r.json())); } catch {}
  }
  const byId = Object.fromEntries(items.map(i => [i.id, i]));
  const byDomain = {};
  for (const i of items) (byDomain[i.domain] ||= []).push(i);
  return { items, byId, byDomain };
}

// F1: only verified content is ever drilled/graded. needs-review is reference-only.
export function gradable(items) { return (items || []).filter(i => i.citation && i.citation.trust === 'verified'); }

export function recomputeMastery(profile, content) {
  for (const d of DOMAINS) {
    const verified = gradable(content.byDomain[d.id]);
    if (!verified.length) continue;
    const sum = verified.reduce((s, i) => s + decayedFam(profile.items[i.id]), 0);
    profile.domains[d.id] = profile.domains[d.id] || { mastery: 0, lastDrill: null };
    profile.domains[d.id].mastery = sum / verified.length;
  }
}

// V1 stage labels — deliberately NO "test-ready" claim (D-0013: deferred past V1).
export function stageFor(profile) {
  const live = DOMAINS.filter(d => d.live);
  const avg = live.reduce((s, d) => s + (profile.domains[d.id]?.mastery || 0), 0) / Math.max(1, live.length);
  if (avg >= 0.85) return 'Sharp';
  if (avg >= 0.50) return 'Coming along';
  if (avg >= 0.15) return 'Learning the ropes';
  return 'First-day trainee';
}
