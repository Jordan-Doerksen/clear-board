// Clear Board — the Drill selection as pure functions (row U-44). The selection moved from
// Drill.tsx with no change of behaviour; rows U-01, U-37, U-15, U-26 and U-28 then changed it, each
// in a commit of its own. A function that draws takes the random source as its last parameter; with no
// argument it is Math.random, as before the move. A test passes a fixed generator and gets the same
// session each time. Nothing here reads the page or the storage. The clock (Date.now) is read by
// the due test (isDue), by the decay of the mastery (withRecomputedMastery) and by dueGroups, which
// also takes the time as a parameter; a test fixes the clock with a mock.
import { DOMAINS, drillable, recomputeMastery } from './store';
import { isDue } from './sr';
import { severityOf, SEV_RANK } from './severity';
import { drawSignal } from './signal';
import type { Content, ContentItem, Profile, Question, SignalAspect, SRState } from './types';

export type Rng = () => number;

export function shuffle<T>(a: T[], rng: Rng = Math.random): T[] {
  const x = a.slice();
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; }
  return x;
}

// An item's intro difficulty: the easiest question a rule can ask; defs/signals are gentle (tier 1).
export function itemTier(item: ContentItem, content: Content): number {
  if (item.type !== 'rule') return 1;
  const tiers = (content.questionsByRule[item.id] || []).map(qq => qq.tier ?? 1);
  return tiers.length ? Math.min(...tiers) : 1;
}

// ---- Row U-01: a drawing of two or more signal items is not asked ------------------------------
// signals.json is frozen, and two of its drawings belong to two items each (note S-01 for the SME).
// A question with such a drawing has two right names. The Drill does not ask it: the Drill never
// decides which name is right. Two drawings are the same when the frozen drawing function gives the
// same SVG text for them.
const svgOfAspect = new WeakMap<SignalAspect, string>();
export function drawingOf(aspect: SignalAspect): string {
  let svg = svgOfAspect.get(aspect);
  if (svg === undefined) { svg = drawSignal(aspect); svgOfAspect.set(aspect, svg); }
  return svg;
}

// For each drawing of the library: the ids of the signal items that hold it.
const ownersOfContent = new WeakMap<Content, Map<string, Set<string>>>();
function drawingOwners(content: Content): Map<string, Set<string>> {
  let owners = ownersOfContent.get(content);
  if (!owners) {
    owners = new Map();
    for (const i of content.items) {
      if (i.type !== 'signal') continue;
      for (const a of i.payload?.aspects || []) {
        const svg = drawingOf(a);
        const ids = owners.get(svg) ?? new Set<string>();
        ids.add(i.id);
        owners.set(svg, ids);
      }
    }
    ownersOfContent.set(content, owners);
  }
  return owners;
}

// Each drawing that belongs to two or more signal items, with the ids of those items.
export interface SharedDrawing { svg: string; itemIds: string[] }
export function sharedDrawings(content: Content): SharedDrawing[] {
  return [...drawingOwners(content)].filter(([, ids]) => ids.size > 1).map(([svg, ids]) => ({ svg, itemIds: [...ids] }));
}

// Row U-37: each list of aspects in signals.json holds one drawing two times (note S-14 for the
// SME). This gives each different drawing one time, in the order of the list.
export function distinctAspects(aspects: SignalAspect[]): SignalAspect[] {
  const seen = new Set<string>();
  return aspects.filter(a => { const svg = drawingOf(a); if (seen.has(svg)) return false; seen.add(svg); return true; });
}

// The aspects of a signal item that the Drill can ask: each different drawing one time (U-37),
// and only a drawing that no other item holds (U-01).
export function askableAspects(item: ContentItem, content: Content): SignalAspect[] {
  const owners = drawingOwners(content);
  return distinctAspects(item.payload?.aspects || []).filter(a => (owners.get(drawingOf(a))?.size ?? 0) <= 1);
}

export type DrillQuestion =
  | { kind: 'rule'; heading: string; promptText: string; correct: string; options: string[]; explain: string }
  | { kind: 'signal'; heading: string; aspect: SignalAspect; correct: string; options: string[]; explain?: string }
  | { kind: 'text'; heading: string; promptText: string; correct: string; options: string[]; explain?: string };

export interface QuestionContext { pool: ContentItem[]; byType: Record<string, ContentItem[]>; ceiling: number }
export interface Slot { item: ContentItem; q: DrillQuestion }
// One screen of a session: a learn card of a new item (U-28), or a question.
export type Screen = { kind: 'learn'; item: ContentItem } | { kind: 'ask'; slot: Slot };
export interface Session {
  slots: Slot[];          // the questions, in the order of the screens
  screens: Screen[];      // the questions and the learn cards, in the order of the session (U-28)
  drilledDomains: string[];
  startMastery: Record<string, number>;
  newIds: string[];       // the items of the session that were never answered before it (U-26)
  practiceOnly: boolean;  // no item of the session was due at its start (U-26)
}

// ---- Row U-28 (LEARN-GAP, 2c-plan C11): a learn card before the first question about a new item ----
// A new item is an item that the learner never answered (seen 0). The Drill shows it one time, on a
// learn card, before the first question about it. The first question never comes right after its
// card: one other screen or more comes between them. The questions keep their order, except that
// the questions of a new item wait until one other screen comes after its card. A card that would
// be the last screen moves one screen earlier. When the session has no other screen (it asks about
// one new item only), that item gets no card and no question in this session. A card grades
// nothing: the mastery model does not change.
export function withLearnCards(slots: Slot[], isNew: (item: ContentItem) => boolean): Screen[] {
  const out: Screen[] = [];
  const carded = new Set<string>();
  let waiting: Screen[] = [];          // the questions of the item of the last card, which wait
  let waitingId: string | null = null;
  // The questions that wait go out when the last screen is not the card of their item.
  const release = () => {
    const last = out[out.length - 1];
    if (!waiting.length || (last?.kind === 'learn' && last.item.id === waitingId)) return;
    out.push(...waiting);
    waiting = [];
    waitingId = null;
  };
  for (const slot of slots) {
    const { item } = slot;
    if (isNew(item) && !carded.has(item.id)) {
      carded.add(item.id);
      out.push({ kind: 'learn', item });
      release();
      waiting = [{ kind: 'ask', slot }];
      waitingId = item.id;
    } else if (item.id === waitingId) {
      waiting.push({ kind: 'ask', slot });
    } else {
      release();
      out.push({ kind: 'ask', slot });
      release();
    }
  }
  release();
  if (waiting.length) {
    // The card of the waiting item is the last screen. The screen before it (a question of another
    // item) moves after it. With no screen before it, the item is not asked in this session.
    const card = out.pop()!;
    const before = out.pop();
    if (before) out.push(card, before, ...waiting);
  }
  return out;
}

// ---- The grading guards (U-44) ---------------------------------------------------------------------
// The guards of the grading as one pure function. F1: an item that is not verified is never graded.
// F2: a right answer counts only when the item is due; a miss always counts. recordAnswer and
// gradeItems of AppContext.tsx call it, so the guard that the tests cover is the guard that the app
// runs. The Drill draws verified items only, so F1 changes no answer of the Drill. The Drill also
// reads it for its words (U-26).
export function answerCounts(item: ContentItem, state: SRState | undefined, correct: boolean): boolean {
  if (item.citation?.trust !== 'verified') return false;
  return !correct || isDue(state);
}

// U-26: when the items of a session come back, from the stored due dates: the count of items for
// each number of days from now. 0 days is "due now". Items with no stored state are not counted.
const DAY = 86400000;
export function dueGroups(itemIds: string[], profile: Profile, now: number = Date.now()): { days: number; count: number }[] {
  const byDays = new Map<number, number>();
  for (const id of new Set(itemIds)) {
    const due = profile.items[id]?.due;
    if (!due) continue;
    const days = Math.max(0, Math.ceil((new Date(due).getTime() - now) / DAY));
    byDays.set(days, (byDays.get(days) ?? 0) + 1);
  }
  return [...byDays].sort((a, b) => a[0] - b[0]).map(([days, count]) => ({ days, count }));
}

export const TARGET = 8;        // aim for a ~8-question session
export const PER_RULE_CAP = 3;  // …but no single rule may fill more than 3 of it (REVAMP §5, rule.112's 17)

export function distractors(item: ContentItem, pool: ContentItem[], byType: Record<string, ContentItem[]>,
  fieldFn: (o: ContentItem) => string, rng: Rng = Math.random): string[] {
  const same = (byType[item.type] || pool).filter(o => o.id !== item.id);
  let opts = shuffle(same, rng).slice(0, 3).map(fieldFn);
  if (opts.length < 3) opts = opts.concat(shuffle(pool.filter(o => o.id !== item.id), rng).slice(0, 3 - opts.length).map(fieldFn));
  return opts;
}

// Build one question. For rules, `forceQ` pins a specific authored question (so a thin domain can
// draw several DISTINCT facets of one rule); otherwise one is picked within the tier band.
export function buildQuestion(item: ContentItem, content: Content, ctx: QuestionContext, forceQ?: Question,
  rng: Rng = Math.random): DrillQuestion {
  if (item.type === 'rule') {
    const qs = content.questionsByRule[item.id] || [];
    const band = qs.filter(qq => (qq.tier ?? 1) <= ctx.ceiling);   // ask within the learner's tier band (#8)
    const from = band.length ? band : qs;
    const Q = forceQ || from[Math.floor(rng() * from.length)];
    return { kind: 'rule', heading: 'What does the rule say?', promptText: Q.stem, correct: Q.answer, options: shuffle(Q.choices.slice(), rng), explain: Q.explain };
  }
  if (item.type === 'signal') {
    const aspects = askableAspects(item, content);   // U-01 and U-37
    const aspect = aspects[Math.floor(rng() * aspects.length)];
    const correct = item.title;
    return { kind: 'signal', heading: 'What signal is this?', aspect, correct, options: shuffle([correct, ...distractors(item, ctx.pool, ctx.byType, o => o.title, rng)], rng) };
  }
  const dir = rng() < 0.5 ? 'term' : 'def';
  const field = (it: ContentItem) => (dir === 'term' ? (it.plain || it.citation.verbatim || '') : it.title);
  const promptText = dir === 'term' ? item.title : (item.plain || item.citation.verbatim || '');
  const correct = field(item);
  return { kind: 'text', heading: dir === 'term' ? 'What does this mean?' : 'Which term is this?', promptText, correct, options: shuffle([correct, ...distractors(item, ctx.pool, ctx.byType, field, rng)], rng) };
}

// Row U-15 (UX-39): a session reads the mastery of the profile after the decay. After a direct load
// of a drill route the Drill builds its session before AppContext recomputes the stored profile, so
// the start values and the tier limit read stale numbers. This recomputes a copy; the profile of the
// caller does not change.
export function withRecomputedMastery(profile: Profile, content: Content): Profile {
  const p = structuredClone(profile);
  recomputeMastery(p, content);
  return p;
}

export interface SessionInput {
  content: Content;
  profile: Profile;            // the profile before the session
  domain?: string;             // one domain, or every live domain
  focusIds?: string[] | null;  // set ⇒ a "practice your misses" round over these items
}

// Build one session: at most 10 questions.
export function buildSession({ content, profile: stored, domain, focusIds }: SessionInput, rng: Rng = Math.random): Session {
  const profile = withRecomputedMastery(stored, content);   // U-15
  let items: ContentItem[] = [];
  if (focusIds) items = focusIds.map(id => content.byId[id]).filter((i): i is ContentItem => !!i);   // misses-review round
  else if (domain) items = drillable(content.byDomain[domain], content);
  else for (const d of DOMAINS.filter(d => d.live)) items.push(...drillable(content.byDomain[d.id], content));
  items = items.filter(i => i.type !== 'signal' || askableAspects(i, content).length > 0);   // U-01
  // radio-script items are graded in the Radio station's "Call it yourself" mode, where the
  // question is "which call comes next" — they have no term↔definition reading, so the Drill
  // must never draw them (they'd fall to the text branch and ask nonsense).
  items = items.filter(i => i.type !== 'radio-script');

  const byType: Record<string, ContentItem[]> = {};
  for (const i of items) (byType[i.type] ||= []).push(i);
  const due = items.filter(i => isDue(profile.items[i.id]));

  // Tier-aware seeding (#8): a fresh profile (nothing seen) starts gentle — tier-1 only — so the
  // first session is winnable, never tier-3 cold; the band widens as domain mastery grows.
  const cand = domain ? [domain] : DOMAINS.filter(d => d.live).map(d => d.id);
  const seenAny = items.some(i => (profile.items[i.id]?.seen ?? 0) > 0);
  const mast = cand.reduce((s, d) => s + (profile.domains[d]?.mastery || 0), 0) / Math.max(1, cand.length);
  const ceiling = focusIds ? Infinity : !seenAny ? 1 : mast < 0.15 ? 1 : mast < 0.45 ? 2 : 3;   // a review round includes every miss, any tier
  const tierOK = (i: ContentItem) => itemTier(i, content) <= ceiling;
  const ctx: QuestionContext = { pool: items, byType, ceiling };

  // Priority: due & in-band → in-band (not-due, fills a fresh session) → due but harder → the rest.
  const order = [
    ...shuffle(due.filter(tierOK), rng),
    ...shuffle(items.filter(i => tierOK(i) && !due.includes(i)), rng),
    ...shuffle(due.filter(i => !tierOK(i)), rng),
    ...shuffle(items.filter(i => !tierOK(i) && !due.includes(i)), rng),
  ];
  const seen = new Set<string>();
  let chosen = order.filter(i => !seen.has(i.id) && !!seen.add(i.id)).slice(0, 10);
  if (focusIds) chosen = chosen.sort((a, b) => SEV_RANK[severityOf(a)] - SEV_RANK[severityOf(b)]);   // review: safety-critical misses first

  // One slot per chosen item, tracking which authored questions each rule has used so a thin
  // domain (e.g. securement's 3 items) can pad with DISTINCT facets rather than stall under the
  // 4-question floor — capped per rule so no one rule (rule.112 has 17) dominates the session.
  const bandQs = (it: ContentItem) => {
    const qs = content.questionsByRule[it.id] || [];
    const b = qs.filter(qq => (qq.tier ?? 1) <= ceiling);
    return b.length ? b : qs;
  };
  const usedQ: Record<string, Set<string>> = {};
  const slots: Slot[] = [];
  for (const it of chosen) {
    if (it.type === 'rule') {
      const qs = bandQs(it);
      const pick = qs[Math.floor(rng() * qs.length)];
      (usedQ[it.id] ||= new Set()).add(pick?.id ?? '');
      slots.push({ item: it, q: buildQuestion(it, content, ctx, pick, rng) });
    } else slots.push({ item: it, q: buildQuestion(it, content, ctx, undefined, rng) });
  }
  // Pad a thin session with extra distinct rule facets (round-robin, ≤ PER_RULE_CAP each).
  const rules = chosen.filter(it => it.type === 'rule');
  let progressed = rules.length > 0;
  while (slots.length < TARGET && progressed) {
    progressed = false;
    for (const it of rules) {
      if (slots.length >= TARGET) break;
      const used = (usedQ[it.id] ||= new Set());
      if (used.size >= PER_RULE_CAP) continue;
      const unused = bandQs(it).filter(qq => !used.has(qq.id));
      if (!unused.length) continue;
      const pick = unused[Math.floor(rng() * unused.length)];
      used.add(pick.id);
      slots.push({ item: it, q: buildQuestion(it, content, ctx, pick, rng) });
      progressed = true;
    }
  }
  const ordered = (focusIds ? slots : shuffle(slots, rng)).slice(0, 10);   // a review round keeps the safety-first order
  // U-28: a learn card before the first question about each new item (LEARN-GAP).
  const screens = withLearnCards(ordered, i => (profile.items[i.id]?.seen ?? 0) === 0);
  const finalSlots = screens.flatMap(s => (s.kind === 'ask' ? [s.slot] : []));
  const drilledDomains = [...new Set(finalSlots.map(s => s.item.domain))];
  const startMastery = Object.fromEntries(drilledDomains.map(d => [d, profile.domains[d]?.mastery || 0]));
  const sessionItems = [...new Map(finalSlots.map(s => [s.item.id, s.item])).values()];
  const newIds = sessionItems.filter(i => (profile.items[i.id]?.seen ?? 0) === 0).map(i => i.id);
  const practiceOnly = sessionItems.length > 0 && sessionItems.every(i => !answerCounts(i, profile.items[i.id], true));
  return { slots: finalSlots, screens, drilledDomains, startMastery, newIds, practiceOnly };
}
