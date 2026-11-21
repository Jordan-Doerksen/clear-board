// Clear Board — profile + content library (SPEC schemas). Local-first; one profile, one library.
// Ported from the vanilla core/store.js — same logic + safety filters, now typed.
import { decayedFam } from './sr';
import type { Content, ContentItem, DomainDef, DomainState, Profile, Question, Settings, SRState, YardBest } from './types';

export const DOMAINS: DomainDef[] = [
  { id: 'definitions', name: 'The words', desc: 'CROR definitions — the language of the job.', live: true },
  { id: 'signals',     name: 'Signals',   desc: 'Read the aspect, know the indication.',       live: true },
  { id: 'switching',   name: 'Switching', desc: 'Switches, derails, coupling, kicking, shoving.', live: true },
  { id: 'securement',  name: 'Securement', desc: 'Rule 112 — tie it down so it stays put.',     live: true },
  { id: 'radio',       name: 'Radio',     desc: 'Radio & hand signals.',                        live: true },
  { id: 'authority',   name: 'Authority', desc: 'OCS · ABS · CTC · interlocking — who owns the track.', live: true },
  { id: 'operating',   name: 'Operating', desc: 'Speeds, crew duties, time, crossings, bulletins.', live: true },
];

// The stations of Home, in the order of Home. The shell reads the names for the page title of each
// route (2c-plan C7).
export const STATIONS = [
  { go: '/reference', icon: '📖', name: 'Reference', sub: 'Look anything up — cited' },
  { go: '/drill', icon: '🎯', name: 'Drill', sub: 'Adaptive practice' },
  { go: '/yard', icon: '🚂', name: 'The Yard', sub: 'Work the cuts' },
  { go: '/signals', icon: '🚦', name: 'Signals', sub: 'Read the aspect' },
  { go: '/radio', icon: '📻', name: 'Radio walkthrough', sub: 'Back to a joint' },
];

export const PROFILE_KEY = 'cb.profile.v1';
// The second key: a copy of a stored profile that the app could not use whole (it was repaired or
// could not be read), or the profile before "Start fresh". The app reads it only to save it to a
// file. U-05; R6 ENG-03.
export const PROFILE_COPY_KEY = 'cb.profile.v1.copy';
export const SETTINGS_KEY = 'cb.settings.v1';
// The stored sound choice of the Yard (yard/sound.js). The key keeps its name (2c-plan C8).
export const YARD_SOUND_KEY = 'sl_muted';
const CONTENT_FILES =['data/definitions.json', 'data/signals.json', 'data/rules.json', 'data/radio-script.json']; // grows as domains migrate
const QUESTION_FILES = ['data/rule-questions.json'];                                      // authored MC banks, keyed to a ruleId
const url = (f: string) => `${import.meta.env.BASE_URL}${f}`;

export function freshProfile(settings: Settings): Profile {
  return {
    schema: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    settings, items: {},
    domains: Object.fromEntries(DOMAINS.map(d => [d.id, { mastery: 0, lastDrill: null }])),
    yard: { completed: [], best: {} },
    path: { stage: 'First-day trainee', unlocked: ['reference', 'drill'], testReady: false },
  };
}
// ---- The repair of a stored profile (U-05; R4 UX-19, R6 ENG-02, ENG-03) ----------------------
// A stored profile with schema 1 is read field by field. A field of the wrong shape gets the value
// of a fresh profile. In a map (items, domains, Yard records) each entry of the right shape stays
// and each other entry goes. So the repaired profile keeps each item that the app can read.
type Raw = Record<string, unknown>;
const isObj = (x: unknown): x is Raw => typeof x === 'object' && x !== null && !Array.isArray(x);
const isNum = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);
const isTime = (x: unknown): x is string => typeof x === 'string' && !Number.isNaN(Date.parse(x));
const isTimeOrNull = (x: unknown): boolean => x === null || isTime(x);

function isItemState(x: unknown): x is SRState {
  return isObj(x) && isNum(x.fam) && isNum(x.seen) && isNum(x.correct) && isNum(x.ease)
    && isNum(x.interval) && isTime(x.due) && isTimeOrNull(x.lastSeen);
}
function isDomainState(x: unknown): x is DomainState {
  return isObj(x) && isNum(x.mastery) && isTimeOrNull(x.lastDrill);
}
function isYardBest(x: unknown): x is YardBest {
  return isObj(x) && isNum(x.moves) && isNum(x.joints) && typeof x.beatPar === 'boolean' && typeof x.departed === 'boolean';
}
function isPath(x: unknown): boolean {
  return isObj(x) && typeof x.stage === 'string' && typeof x.testReady === 'boolean'
    && Array.isArray(x.unlocked) && x.unlocked.every(u => typeof u === 'string');
}
const SETTING_KEYS: (keyof Settings)[] = ['dys', 'contrast', 'reduce', 'audio', 'big'];
function isSettings(x: unknown): x is Settings {
  return isObj(x) && SETTING_KEYS.every(k => typeof x[k] === 'boolean');
}

// Keeps each entry of a map that passes the test. `dropped` says that one entry or more went.
function keepEntries<T>(x: Raw, test: (v: unknown) => v is T): { kept: Record<string, T>; dropped: boolean } {
  const kept: Record<string, T> = {};
  let dropped = false;
  for (const [key, value] of Object.entries(x)) {
    if (test(value)) kept[key] = value;
    else dropped = true;
  }
  return { kept, dropped };
}

// Returns null when `raw` is not a profile of schema 1. Else it returns the profile, repaired where
// a field has the wrong shape, and says whether a repair was made.
export function repairProfile(raw: unknown, settings: Settings): { profile: Profile; repaired: boolean } | null {
  if (!isObj(raw) || raw.schema !== 1) return null;
  const fresh = freshProfile(settings);
  const p: Raw = { ...raw };
  let repaired = false;
  delete p.radio;   // D-0025: the write-only `radio.done` boolean is retired; nothing gated on it

  if (!isTime(p.createdAt)) { p.createdAt = fresh.createdAt; repaired = true; }
  if (!isTime(p.updatedAt)) { p.updatedAt = fresh.updatedAt; repaired = true; }
  if (!isSettings(p.settings)) { p.settings = fresh.settings; repaired = true; }
  if (!isPath(p.path)) { p.path = fresh.path; repaired = true; }

  if (isObj(p.items)) {
    const r = keepEntries(p.items, isItemState);
    p.items = r.kept;
    if (r.dropped) repaired = true;
  } else { p.items = fresh.items; repaired = true; }

  if (isObj(p.domains)) {
    const r = keepEntries(p.domains, isDomainState);
    p.domains = r.kept;
    if (r.dropped) repaired = true;
  } else { p.domains = fresh.domains; repaired = true; }

  if (isObj(p.yard)) {
    const y: Raw = { ...p.yard };
    const completed = Array.isArray(y.completed) ? y.completed : null;
    y.completed = (completed ?? []).filter((c): c is string => typeof c === 'string');
    if (!completed || (y.completed as string[]).length !== completed.length) repaired = true;
    // A profile from before D-0027 has no `best`. That is not damage: the Yard adds it.
    if ('best' in y) {
      if (isObj(y.best)) {
        const r = keepEntries(y.best, isYardBest);
        y.best = r.kept;
        if (r.dropped) repaired = true;
      } else { y.best = {}; repaired = true; }
    }
    p.yard = y;
  } else { p.yard = fresh.yard; repaired = true; }

  return { profile: p as unknown as Profile, repaired };
}

// What the app found under the profile key: nothing, a whole profile, a profile that needed a
// repair, or text that is not a profile of this app. `text` is the stored text.
export type StoredProfileState = 'none' | 'ok' | 'repaired' | 'unreadable';
export interface StoredProfile { profile: Profile; state: StoredProfileState; text: string | null }

export function readStoredProfile(settings: Settings): StoredProfile {
  let text: string | null = null;
  try { text = localStorage.getItem(PROFILE_KEY); } catch { /* storage blocked: start fresh */ }
  if (text === null) return { profile: freshProfile(settings), state: 'none', text };
  let raw: unknown;
  try { raw = JSON.parse(text); } catch { return { profile: freshProfile(settings), state: 'unreadable', text }; }
  const r = repairProfile(raw, settings);
  if (!r) return { profile: freshProfile(settings), state: 'unreadable', text };
  return { profile: r.profile, state: r.repaired ? 'repaired' : 'ok', text };
}

export function loadProfile(settings: Settings): Profile {
  return readStoredProfile(settings).profile;
}

// Keeps the stored text under the second key before the app writes a repaired or a fresh profile
// over it.
export function keepProfileCopy(text: string): void {
  try { localStorage.setItem(PROFILE_COPY_KEY, text); } catch { /* storage full or blocked */ }
}

// "Start fresh" on the screen for a render error: the stored profile goes to the second key, and
// the profile key is cleared. The page then opens again with a fresh profile.
export function clearProfileKeepCopy(): void {
  try {
    const text = localStorage.getItem(PROFILE_KEY);
    if (text !== null) localStorage.setItem(PROFILE_COPY_KEY, text);
    localStorage.removeItem(PROFILE_KEY);
  } catch { /* storage blocked: nothing is stored */ }
}

// ---- Files on the device (U-05, U-18) ----------------------------------------------------------
// A file holds JSON. It stays on the device: the app sends nothing anywhere (fence rule 11).
const FILE_APP = 'clear-board';
const today = () => new Date().toISOString().slice(0, 10);

// Gives the browser a file to save. The browser asks where to save it, or saves it to the folder
// of downloads.
export function saveTextFile(name: string, text: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// "Save a copy of the stored data": the text of each stored key of the app, as it is, also when it
// is not a profile that the app can read.
export function storedDataFile(): { name: string; text: string } {
  const keys: Record<string, string> = {};
  for (const key of [PROFILE_KEY, PROFILE_COPY_KEY, SETTINGS_KEY, YARD_SOUND_KEY]) {
    try { const v = localStorage.getItem(key); if (v !== null) keys[key] = v; } catch { /* storage blocked */ }
  }
  const text = JSON.stringify({ app: FILE_APP, kind: 'stored-data', saved: new Date().toISOString(), keys }, null, 2);
  return { name: `clear-board-stored-data-${today()}.json`, text };
}

// "Save my progress": the profile and the stored settings in one file (U-18; R4 UX-05).
export function progressFile(profile: Profile, settings: Settings): { name: string; text: string } {
  const text = JSON.stringify({ app: FILE_APP, kind: 'progress', saved: new Date().toISOString(), profile, settings }, null, 2);
  return { name: `clear-board-progress-${today()}.json`, text };
}

// Each setting of `x` that is true or false, on top of `base`. Null when `x` holds no setting.
function settingsFrom(x: unknown, base: Settings): Settings | null {
  if (!isObj(x)) return null;
  const out = { ...base };
  let found = false;
  for (const key of SETTING_KEYS) {
    const value = x[key];
    if (typeof value === 'boolean') { out[key] = value; found = true; }
  }
  return found ? out : null;
}

// "Load my progress": reads a file of "Save my progress" or of "Save a copy of the stored data".
// The profile in the file gets the same repair as a stored profile. Null when the file holds no
// profile of this app: then nothing changes.
export function readProgressFile(text: string, settings: Settings): { profile: Profile; settings: Settings | null } | null {
  let file: unknown;
  try { file = JSON.parse(text); } catch { return null; }
  if (!isObj(file) || file.app !== FILE_APP) return null;
  if (file.kind === 'progress') {
    const r = repairProfile(file.profile, settings);
    return r ? { profile: r.profile, settings: settingsFrom(file.settings, settings) } : null;
  }
  if (file.kind === 'stored-data' && isObj(file.keys)) {
    const keys = file.keys;
    const parse = (key: string): unknown => {
      try { return typeof keys[key] === 'string' ? JSON.parse(keys[key] as string) : null; } catch { return null; }
    };
    // The profile key first. The copy is the older profile.
    for (const key of [PROFILE_KEY, PROFILE_COPY_KEY]) {
      const r = repairProfile(parse(key), settings);
      if (r) return { profile: r.profile, settings: settingsFrom(parse(SETTINGS_KEY), settings) };
    }
  }
  return null;
}
// ---- Two open copies of the app (U-34; R6 ENG-21) -----------------------------------------------
// Each copy holds the profile in memory and writes the whole profile on each save, so the later save
// removed the answers of the other copy. Now a copy merges the stored profile into its own before a
// save, and it follows the storage event of the other copy (AppContext). A merge keeps, for each
// item, the state that was seen last; each Yard job that one copy completed; and the better Yard
// record of each job (fewer moves, then fewer joints, as the Yard rule). It merges only two copies
// of one profile (the same createdAt): another profile comes from a reset or a load, and is not
// merged.
const seenAt = (st: SRState) => (st.lastSeen ? Date.parse(st.lastSeen) : -Infinity);
function laterState(a: SRState, b: SRState): SRState {
  if (seenAt(a) !== seenAt(b)) return seenAt(a) > seenAt(b) ? a : b;
  return b.seen > a.seen ? b : a;
}
const betterRecord = (a: YardBest, b: YardBest) => (b.moves < a.moves || (b.moves === a.moves && b.joints < a.joints) ? b : a);

// Merges `other` into `p`; `p` changes. The mastery of a domain is not merged: the caller computes it
// again from the merged items.
export function mergeProfileInto(p: Profile, other: Profile): void {
  for (const [id, st] of Object.entries(other.items)) p.items[id] = p.items[id] ? laterState(p.items[id], st) : st;
  for (const [id, d] of Object.entries(other.domains)) {
    const mine = p.domains[id];
    if (!mine) p.domains[id] = { ...d };
    else if (d.lastDrill && (!mine.lastDrill || Date.parse(d.lastDrill) > Date.parse(mine.lastDrill))) mine.lastDrill = d.lastDrill;
  }
  if (!p.yard) p.yard = { completed: [], best: {} };
  for (const id of other.yard?.completed ?? []) if (!p.yard.completed.includes(id)) p.yard.completed.push(id);
  if (other.yard?.best) {
    const best = p.yard.best ?? (p.yard.best = {});
    for (const [id, b] of Object.entries(other.yard.best)) best[id] = best[id] ? betterRecord(best[id], b) : b;
  }
}

// Reads the stored profile and merges it into `p` when it is a copy of the same profile; `p`
// changes. Returns true when it merged.
export function mergeStoredProfile(p: Profile): boolean {
  let raw: unknown;
  try { raw = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null'); } catch { return false; }
  const stored = repairProfile(raw, p.settings);
  if (!stored || stored.profile.createdAt !== p.createdAt) return false;
  mergeProfileInto(p, stored.profile);
  return true;
}

export function saveProfile(p: Profile): void {
  p.updatedAt = new Date().toISOString();
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch { /* storage full / blocked */ }
}
export function exportProfile(p: Profile): string { return JSON.stringify(p, null, 2); } // F6: progress is portable

// The library and the names of the content files that did not load (2c-plan C9, U-07; R6 ENG-02).
// A file did not load when the request fails, the answer is not ok, or the file is not a JSON list.
// A name is the file name, for example "rules.json". `failed` is empty when each file loaded.
export interface ContentLoad { content: Content; failed: string[] }

export async function loadContent(): Promise<ContentLoad> {
  const failed: string[] = [];
  async function read<T>(f: string): Promise<T[]> {
    try {
      const r = await fetch(url(f));
      if (!r.ok) throw new Error(`answer ${r.status}`);
      const list: unknown = await r.json();
      if (!Array.isArray(list)) throw new Error('not a list');
      return list as T[];
    } catch {
      failed.push(f.slice(f.lastIndexOf('/') + 1));
      return [];
    }
  }
  const items: ContentItem[] = [];
  for (const f of CONTENT_FILES) items.push(...await read<ContentItem>(f));
  const questions: Question[] = [];
  for (const f of QUESTION_FILES) questions.push(...await read<Question>(f));
  const byId = Object.fromEntries(items.map(i => [i.id, i]));
  const byDomain: Record<string, ContentItem[]> = {};
  for (const i of items) (byDomain[i.domain] ||= []).push(i);
  const questionsByRule: Record<string, Question[]> = {};
  for (const q of questions) (questionsByRule[q.ruleId] ||= []).push(q);
  return { content: { items, byId, byDomain, questions, questionsByRule }, failed };
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

// The mean mastery of the live domains, as the whole percent that Home shows.
export function overallPercent(profile: Profile): number {
  const live = DOMAINS.filter(d => d.live);
  const avg = live.reduce((s, d) => s + (profile.domains[d.id]?.mastery || 0), 0) / Math.max(1, live.length);
  return Math.round(avg * 100);
}

// V1 stage labels — deliberately NO "test-ready" claim (D-0013: deferred past V1).
// The stage reads the whole percent that Home shows, so the name and "N% mastered" agree at each
// edge. With seven domains at 0.85 the mean is 0.8499999999999999: the stage was "Coming along"
// beside "85% mastered" (U-15; R6 ENG-20 item 1).
export function stageFor(profile: Profile): string {
  const pct = overallPercent(profile);
  if (pct >= 85) return 'Sharp';
  if (pct >= 50) return 'Coming along';
  if (pct >= 15) return 'Learning the ropes';
  return 'First-day trainee';
}
