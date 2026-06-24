// Clear Board — profile + content library (SPEC schemas). Local-first; one profile, one library.
import { decayedFam } from './sr.js';

export const DOMAINS = [
  { id: 'definitions', name: 'The words', desc: 'CROR definitions — the language of the job.', live: true },
  { id: 'signals',     name: 'Signals',   desc: 'Read the aspect, know the indication.',       live: true },
  { id: 'switching',   name: 'Switching', desc: 'Switches, derails, coupling, kicking, shoving.', live: true },
  { id: 'securement',  name: 'Securement',desc: 'Rule 112 — tie it down so it stays put.',      live: true },
  { id: 'radio',       name: 'Radio',     desc: 'Radio & hand signals.',                        live: true },
  { id: 'authority',   name: 'Authority', desc: 'OCS · ABS · CTC · interlocking — who owns the track.', live: true },
  { id: 'operating',   name: 'Operating', desc: 'Speeds, crew duties, time, crossings, bulletins.', live: true },
];

const PROFILE_KEY = 'cb.profile.v1';
const CONTENT_FILES = ['data/definitions.json', 'data/signals.json', 'data/rules.json'];   // grows as domains are migrated
const QUESTION_FILES = ['data/rule-questions.json'];   // authored MC banks, keyed to a ruleId

export function freshProfile(settings) {
  return {
    schema: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    settings, items: {},
    domains: Object.fromEntries(DOMAINS.map(d => [d.id, { mastery: 0, lastDrill: null }])),
    yard: { completed: [] },
    radio: { done: false },
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
  const questions = [];
  for (const f of QUESTION_FILES) {
    try { const r = await fetch(f); if (r.ok) questions.push(...(await r.json())); } catch {}
  }
  const byId = Object.fromEntries(items.map(i => [i.id, i]));
  const byDomain = {};
  for (const i of items) (byDomain[i.domain] ||= []).push(i);
  const questionsByRule = {};
  for (const q of questions) (questionsByRule[q.ruleId] ||= []).push(q);
  return { items, byId, byDomain, questions, questionsByRule };
}

// F1: only verified content is ever drilled/graded. needs-review is reference-only.
export function gradable(items) { return (items || []).filter(i => i.citation && i.citation.trust === 'verified'); }

// Drillable = verified AND actually answerable: rules need at least one authored question.
export function drillable(items, content) {
  return (items || []).filter(i => i.citation && i.citation.trust === 'verified'
    && (i.type !== 'rule' || ((content.questionsByRule[i.id] || []).length > 0)));
}

export function recomputeMastery(profile, content) {
  for (const d of DOMAINS) {
    const items = drillable(content.byDomain[d.id], content);
    if (!items.length) continue;
    const sum = items.reduce((s, i) => s + decayedFam(profile.items[i.id]), 0);
    profile.domains[d.id] = profile.domains[d.id] || { mastery: 0, lastDrill: null };
    profile.domains[d.id].mastery = sum / items.length;
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
