// Clear Board — profile + content library (SPEC schemas). Local-first; one profile, one library.
// Ported from the vanilla core/store.js — same logic + safety filters, now typed.
import { decayedFam } from './sr';
import type { Content, ContentItem, DomainDef, Profile, Question, Settings } from './types';

export const DOMAINS: DomainDef[] = [
  { id: 'definitions', name: 'The words', desc: 'CROR definitions — the language of the job.', live: true },
  { id: 'signals',     name: 'Signals',   desc: 'Read the aspect, know the indication.',       live: true },
  { id: 'switching',   name: 'Switching', desc: 'Switches, derails, coupling, kicking, shoving.', live: true },
  { id: 'securement',  name: 'Securement', desc: 'Rule 112 — tie it down so it stays put.',     live: true },
  { id: 'radio',       name: 'Radio',     desc: 'Radio & hand signals.',                        live: true },
  { id: 'authority',   name: 'Authority', desc: 'OCS · ABS · CTC · interlocking — who owns the track.', live: true },
  { id: 'operating',   name: 'Operating', desc: 'Speeds, crew duties, time, crossings, bulletins.', live: true },
];

const PROFILE_KEY = 'cb.profile.v1';
const CONTENT_FILES = ['data/definitions.json', 'data/signals.json', 'data/rules.json']; // grows as domains migrate
const QUESTION_FILES = ['data/rule-questions.json'];                                      // authored MC banks, keyed to a ruleId
const url = (f: string) => `${import.meta.env.BASE_URL}${f}`;

export function freshProfile(settings: Settings): Profile {
  return {
    schema: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    settings, items: {},
    domains: Object.fromEntries(DOMAINS.map(d => [d.id, { mastery: 0, lastDrill: null }])),
    yard: { completed: [] },
    radio: { done: false },
    path: { stage: 'First-day trainee', unlocked: ['reference', 'drill'], testReady: false },
  };
}
export function loadProfile(settings: Settings): Profile {
  try { const p = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null'); if (p && p.schema === 1) return p as Profile; } catch { /* fall through */ }
  return freshProfile(settings);
}
export function saveProfile(p: Profile): void {
  p.updatedAt = new Date().toISOString();
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch { /* storage full / blocked */ }
}
export function exportProfile(p: Profile): string { return JSON.stringify(p, null, 2); } // F6: progress is portable

export async function loadContent(): Promise<Content> {
  const items: ContentItem[] = [];
  for (const f of CONTENT_FILES) {
    try { const r = await fetch(url(f)); if (r.ok) items.push(...(await r.json() as ContentItem[])); } catch { /* skip a missing file */ }
  }
  const questions: Question[] = [];
  for (const f of QUESTION_FILES) {
    try { const r = await fetch(url(f)); if (r.ok) questions.push(...(await r.json() as Question[])); } catch { /* skip */ }
  }
  const byId = Object.fromEntries(items.map(i => [i.id, i]));
  const byDomain: Record<string, ContentItem[]> = {};
  for (const i of items) (byDomain[i.domain] ||= []).push(i);
  const questionsByRule: Record<string, Question[]> = {};
  for (const q of questions) (questionsByRule[q.ruleId] ||= []).push(q);
  return { items, byId, byDomain, questions, questionsByRule };
}

// F1: only verified content is ever drilled/graded. needs-review is reference-only.
export function gradable(items: ContentItem[] | undefined): ContentItem[] {
  return (items || []).filter(i => i.citation && i.citation.trust === 'verified');
}

// Drillable = verified AND actually answerable: rules need at least one authored question.
export function drillable(items: ContentItem[] | undefined, content: Content): ContentItem[] {
  return (items || []).filter(i => i.citation && i.citation.trust === 'verified'
    && (i.type !== 'rule' || ((content.questionsByRule[i.id] || []).length > 0)));
}

// Until the learner has correctly read at least one actual signal aspect, the signals domain is
// capped here — knowing the rule numbers on paper must never read as "can read a signal on sight."
const SIGNALS_TEXT_CAP = 0.33;

export function recomputeMastery(profile: Profile, content: Content): void {
  for (const d of DOMAINS) {
    const items = drillable(content.byDomain[d.id], content);
    if (!items.length) continue;
    let mastery = items.reduce((s, i) => s + decayedFam(profile.items[i.id]), 0) / items.length;
    // Safety gate (REVAMP rec #9): signals is a read-it-on-sight skill. The aggregate already weights
    // the 42 SVG-aspect items, but this makes the invariant explicit and robust to content changes —
    // no aspect recalled yet ⇒ the domain can't read "mastered" off text alone. Lifts on first recall.
    if (d.id === 'signals' && !items.some(i => i.type === 'signal' && (profile.items[i.id]?.correct ?? 0) > 0)) {
      mastery = Math.min(mastery, SIGNALS_TEXT_CAP);
    }
    profile.domains[d.id] = profile.domains[d.id] || { mastery: 0, lastDrill: null };
    profile.domains[d.id].mastery = mastery;
  }
}

// V1 stage labels — deliberately NO "test-ready" claim (D-0013: deferred past V1).
export function stageFor(profile: Profile): string {
  const live = DOMAINS.filter(d => d.live);
  const avg = live.reduce((s, d) => s + (profile.domains[d.id]?.mastery || 0), 0) / Math.max(1, live.length);
  if (avg >= 0.85) return 'Sharp';
  if (avg >= 0.50) return 'Coming along';
  if (avg >= 0.15) return 'Learning the ropes';
  return 'First-day trainee';
}
