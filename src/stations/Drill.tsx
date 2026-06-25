// Drill — adaptive (SM-2-lite) MC across content types; updates mastery → the path. (vanilla drill.js)
// Definitions → term↔definition MC. Signals → read-the-aspect MC. Rules → authored MC bank. One loop, one profile.
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { Signal } from './Signal';
import { DOMAINS, drillable } from '../core/store';
import { isDue } from '../core/sr';
import { severityOf, SEV_RANK } from '../core/severity';
import type { Content, ContentItem, Question, SignalAspect } from '../core/types';

const shuffle = <T,>(a: T[]): T[] => {
  const x = a.slice();
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; }
  return x;
};

// An item's intro difficulty: the easiest question a rule can ask; defs/signals are gentle (tier 1).
function itemTier(item: ContentItem, content: Content): number {
  if (item.type !== 'rule') return 1;
  const tiers = (content.questionsByRule[item.id] || []).map(qq => qq.tier ?? 1);
  return tiers.length ? Math.min(...tiers) : 1;
}

type Q =
  | { kind: 'rule'; heading: string; promptText: string; correct: string; options: string[]; explain: string }
  | { kind: 'signal'; heading: string; aspect: SignalAspect; correct: string; options: string[]; explain?: string }
  | { kind: 'text'; heading: string; promptText: string; correct: string; options: string[]; explain?: string };

interface QCtx { pool: ContentItem[]; byType: Record<string, ContentItem[]>; ceiling: number }
interface Slot { item: ContentItem; q: Q }
interface Built { slots: Slot[]; drilledDomains: string[]; startMastery: Record<string, number> }

const TARGET = 8;        // aim for a ~8-question session
const PER_RULE_CAP = 3;  // …but no single rule may fill more than 3 of it (REVAMP §5, rule.112's 17)

function distractors(item: ContentItem, pool: ContentItem[], byType: Record<string, ContentItem[]>, fieldFn: (o: ContentItem) => string): string[] {
  const same = (byType[item.type] || pool).filter(o => o.id !== item.id);
  let opts = shuffle(same).slice(0, 3).map(fieldFn);
  if (opts.length < 3) opts = opts.concat(shuffle(pool.filter(o => o.id !== item.id)).slice(0, 3 - opts.length).map(fieldFn));
  return opts;
}

// Build one question. For rules, `forceQ` pins a specific authored question (so a thin domain can
// draw several DISTINCT facets of one rule); otherwise one is picked within the tier band.
function buildQ(item: ContentItem, content: Content, ctx: QCtx, forceQ?: Question): Q {
  if (item.type === 'rule') {
    const qs = content.questionsByRule[item.id] || [];
    const band = qs.filter(qq => (qq.tier ?? 1) <= ctx.ceiling);   // ask within the learner's tier band (#8)
    const from = band.length ? band : qs;
    const Q = forceQ || from[Math.floor(Math.random() * from.length)];
    return { kind: 'rule', heading: 'What does the rule say?', promptText: Q.stem, correct: Q.answer, options: shuffle(Q.choices.slice()), explain: Q.explain };
  }
  if (item.type === 'signal') {
    const aspects = item.payload?.aspects || [];
    const aspect = aspects[Math.floor(Math.random() * aspects.length)];
    const correct = item.title;
    return { kind: 'signal', heading: 'What signal is this?', aspect, correct, options: shuffle([correct, ...distractors(item, ctx.pool, ctx.byType, o => o.title)]) };
  }
  const dir = Math.random() < 0.5 ? 'term' : 'def';
  const field = (it: ContentItem) => (dir === 'term' ? (it.plain || it.citation.verbatim || '') : it.title);
  const promptText = dir === 'term' ? item.title : (item.plain || item.citation.verbatim || '');
  const correct = field(item);
  return { kind: 'text', heading: dir === 'term' ? 'What does this mean?' : 'Which term is this?', promptText, correct, options: shuffle([correct, ...distractors(item, ctx.pool, ctx.byType, field)]) };
}

export function Drill({ domain }: { domain?: string }) {
  const { content, profile, recordAnswer, speak } = useApp();
  const navigate = useNavigate();
  const profileRef = useRef(profile);
  profileRef.current = profile;

  const [sessionKey, setSessionKey] = useState(0);
  const [built, setBuilt] = useState<Built | null>(null);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [focusIds, setFocusIds] = useState<string[] | null>(null);   // set ⇒ a "practice your misses" round
  const missedRef = useRef<Set<string>>(new Set());                  // items missed in the current session

  // Build the session once per (content, domain, sessionKey). profileRef → pre-session snapshot.
  useEffect(() => {
    if (!content) return;
    let items: ContentItem[] = [];
    if (focusIds) items = focusIds.map(id => content.byId[id]).filter((i): i is ContentItem => !!i);   // misses-review round
    else if (domain) items = drillable(content.byDomain[domain], content);
    else for (const d of DOMAINS.filter(d => d.live)) items.push(...drillable(content.byDomain[d.id], content));
    items = items.filter(i => i.type !== 'signal' || (i.payload?.aspects?.length ?? 0) > 0);

    const byType: Record<string, ContentItem[]> = {};
    for (const i of items) (byType[i.type] ||= []).push(i);
    const due = items.filter(i => isDue(profileRef.current.items[i.id]));

    // Tier-aware seeding (#8): a fresh profile (nothing seen) starts gentle — tier-1 only — so the
    // first session is winnable, never tier-3 cold; the band widens as domain mastery grows.
    const cand = domain ? [domain] : DOMAINS.filter(d => d.live).map(d => d.id);
    const seenAny = items.some(i => (profileRef.current.items[i.id]?.seen ?? 0) > 0);
    const mast = cand.reduce((s, d) => s + (profileRef.current.domains[d]?.mastery || 0), 0) / Math.max(1, cand.length);
    const ceiling = focusIds ? Infinity : !seenAny ? 1 : mast < 0.15 ? 1 : mast < 0.45 ? 2 : 3;   // a review round includes every miss, any tier
    const tierOK = (i: ContentItem) => itemTier(i, content) <= ceiling;
    const ctx: QCtx = { pool: items, byType, ceiling };

    // Priority: due & in-band → in-band (not-due, fills a fresh session) → due but harder → the rest.
    const order = [
      ...shuffle(due.filter(tierOK)),
      ...shuffle(items.filter(i => tierOK(i) && !due.includes(i))),
      ...shuffle(due.filter(i => !tierOK(i))),
      ...shuffle(items.filter(i => !tierOK(i) && !due.includes(i))),
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
        const pick = qs[Math.floor(Math.random() * qs.length)];
        (usedQ[it.id] ||= new Set()).add(pick?.id ?? '');
        slots.push({ item: it, q: buildQ(it, content, ctx, pick) });
      } else slots.push({ item: it, q: buildQ(it, content, ctx) });
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
        const pick = unused[Math.floor(Math.random() * unused.length)];
        used.add(pick.id);
        slots.push({ item: it, q: buildQ(it, content, ctx, pick) });
        progressed = true;
      }
    }
    const finalSlots = (focusIds ? slots : shuffle(slots)).slice(0, 10);   // a review round keeps the safety-first order
    const drilledDomains = [...new Set(finalSlots.map(s => s.item.domain))];
    const startMastery = Object.fromEntries(drilledDomains.map(d => [d, profileRef.current.domains[d]?.mastery || 0]));

    missedRef.current = new Set();
    setBuilt({ slots: finalSlots, drilledDomains, startMastery });
    setIdx(0); setScore(0); setPicked(null);
  }, [content, domain, sessionKey, focusIds]);

  const slot = built && idx < built.slots.length ? built.slots[idx] : null;
  const item = slot?.item ?? null;
  const q = slot?.q ?? null;

  // Read-aloud the prompt (not the signal SVG) when a new question appears.
  useEffect(() => {
    if (q && (q.kind === 'rule' || q.kind === 'text')) speak(q.promptText);
  }, [q, speak]);

  if (!content || !built) return <p className="muted">Loading…</p>;

  if (built.slots.length < (focusIds ? 1 : 4)) {
    return (
      <>
        <button className="back" onClick={() => navigate('/')}>← Home</button>
        <p className="muted">Not enough verified content to drill yet.</p>
      </>
    );
  }

  // Finished — show the session summary with mastery deltas.
  if (!slot || !item || !q) {
    const lines = built.drilledDomains.map(d => {
      const name = (DOMAINS.find(x => x.id === d) || {}).name || d;
      const end = profile.domains[d]?.mastery || 0;
      const delta = Math.round((end - (built.startMastery[d] || 0)) * 100);
      return `${name}: ${delta >= 0 ? '+' : ''}${delta}% → ${Math.round(end * 100)}%`;
    }).join(' · ');
    return (
      <>
        <button className="back" onClick={() => navigate('/')}>← Home</button>
        <h2 className="view-title">{focusIds ? 'Review done' : 'Session done'}</h2>
        <p className="big-score">{score} / {built.slots.length}</p>
        <p className="muted">{lines}. Spaced out over the next days so it sticks.</p>
        <div className="opts">
          {missedRef.current.size > 0 && (
            <button className="opt" onClick={() => { setFocusIds([...missedRef.current]); setSessionKey(k => k + 1); }}>
              Practice the {missedRef.current.size} you missed →
            </button>
          )}
          <button className="opt" onClick={() => { setFocusIds(null); setSessionKey(k => k + 1); }}>Drill again</button>
          <button className="opt" onClick={() => navigate('/')}>Back to the path</button>
        </div>
      </>
    );
  }

  const answered = picked !== null;
  const ok = picked === q.correct;
  const c = item.citation;

  function choose(value: string) {
    if (picked !== null) return;
    const correct = value === q!.correct;
    setPicked(value);
    if (correct) setScore(s => s + 1);
    else missedRef.current.add(item!.id);   // remembered for the end-of-session review round (#10)
    recordAnswer(item!, correct);   // AppContext gates a correct re-advance by due-ness (anti-marathon, F2)
  }

  return (
    <>
      <button className="back" onClick={() => navigate('/')}>← Home</button>
      <div className="drill-top"><span className="muted">Question {idx + 1} of {built.slots.length}</span><span className="muted">{score} correct</span></div>
      <h2 className="view-title">{q.heading}</h2>
      <div className={`prompt ${q.kind === 'signal' ? 'prompt-signal' : ''}`}>
        {q.kind === 'signal' ? <Signal aspect={q.aspect} /> : q.promptText}
      </div>
      <div className="opts">
        {q.options.map((o, i) => {
          const cls = answered ? (o === q.correct ? 'opt right' : (o === picked ? 'opt wrong' : 'opt')) : 'opt';
          return <button key={i} className={cls} disabled={answered} onClick={() => choose(o)}>{o}</button>;
        })}
      </div>
      {answered && (
        <div className="feedback" aria-live="polite">
          <b className={ok ? 'fb-ok' : 'fb-no'}>{ok ? 'Right.' : 'Not quite.'}</b>
          <span><b>{item.title}</b> — {q.explain || item.plain || c.verbatim}</span>
          {!ok && severityOf(item) !== 'S1' && (
            <span className="muted">{severityOf(item) === 'S3' ? 'Safety-critical — lock this one in.' : 'Worth nailing.'} Review your misses at the end.</span>
          )}
          <span className="cite">{c.source}{c.ref ? ` · ${c.ref}` : ''}</span>
          <button className="iconbtn" onClick={() => navigate(`/reference?focus=${encodeURIComponent(item!.id)}`)}>Look it up →</button>
          <button className="iconbtn next" autoFocus onClick={() => { setIdx(i => i + 1); setPicked(null); }}>
            {idx + 1 < built.slots.length ? 'Next →' : 'Finish'}
          </button>
        </div>
      )}
    </>
  );
}
