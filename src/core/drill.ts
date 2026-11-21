// Clear Board — the Drill selection as pure functions (row U-44). Moved from Drill.tsx with no
// change of behaviour. Each function takes the random source as its last parameter; with no
// argument it is Math.random, as before the move. A test passes a fixed generator and gets the
// same session each time. Nothing here reads the page, the storage or the clock.
import { DOMAINS, drillable } from './store';
import { isDue } from './sr';
import { severityOf, SEV_RANK } from './severity';
import type { Content, ContentItem, Profile, Question, SignalAspect } from './types';

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

export type DrillQuestion =
  | { kind: 'rule'; heading: string; promptText: string; correct: string; options: string[]; explain: string }
  | { kind: 'signal'; heading: string; aspect: SignalAspect; correct: string; options: string[]; explain?: string }
  | { kind: 'text'; heading: string; promptText: string; correct: string; options: string[]; explain?: string };

export interface QuestionContext { pool: ContentItem[]; byType: Record<string, ContentItem[]>; ceiling: number }
export interface Slot { item: ContentItem; q: DrillQuestion }
export interface Session { slots: Slot[]; drilledDomains: string[]; startMastery: Record<string, number> }

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
    const aspects = item.payload?.aspects || [];
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

export interface SessionInput {
  content: Content;
  profile: Profile;            // the profile before the session
  domain?: string;             // one domain, or every live domain
  focusIds?: string[] | null;  // set ⇒ a "practice your misses" round over these items
}

// Build one session: at most 10 questions.
export function buildSession({ content, profile, domain, focusIds }: SessionInput, rng: Rng = Math.random): Session {
  let items: ContentItem[] = [];
  if (focusIds) items = focusIds.map(id => content.byId[id]).filter((i): i is ContentItem => !!i);   // misses-review round
  else if (domain) items = drillable(content.byDomain[domain], content);
  else for (const d of DOMAINS.filter(d => d.live)) items.push(...drillable(content.byDomain[d.id], content));
  items = items.filter(i => i.type !== 'signal' || (i.payload?.aspects?.length ?? 0) > 0);
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
  const finalSlots = (focusIds ? slots : shuffle(slots, rng)).slice(0, 10);   // a review round keeps the safety-first order
  const drilledDomains = [...new Set(finalSlots.map(s => s.item.domain))];
  const startMastery = Object.fromEntries(drilledDomains.map(d => [d, profile.domains[d]?.mastery || 0]));
  return { slots: finalSlots, drilledDomains, startMastery };
}
