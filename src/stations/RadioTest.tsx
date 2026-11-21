// Radio — "Call it yourself" mode. The guided walkthrough stays ungraded (REVAMP §5: merging it
// with grading turns a confidence-builder into a test); this is the test that sits BESIDE it.
//
// The call wording, the acknowledgements and the "why this call" notes all come from radioSim's
// STEPS — one source, no drift. Distractors are other REAL calls from the same procedure, never
// invented: the genuine confusions here are which call belongs where (carrying the engine number
// past two car lengths, saying "over" on a running count, switching to feet too early).
//
// Grading goes through recordRadioStep → the one SM-2 model, and its F1 filter silently drops the
// six steps with no verified CROR citation. This screen says so out loud instead.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import type { ContentItem } from '../core/types';

interface Step {
  call: string; ack?: string; pre?: string; rule: string; note: string; goi?: string; read?: string; status?: string;
}

const shuffle = <T,>(a: T[]): T[] => {
  const x = a.slice();
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; }
  return x;
};

// A distractor must be a different real call that can't be eliminated by shape alone: never equal
// to, containing, or contained by the answer (the quiz-validity gate, REVAMP §7.5).
function distinct(answer: string, other: string): boolean {
  if (other === answer) return false;
  const a = answer.toLowerCase(), b = other.toLowerCase();
  return !a.includes(b) && !b.includes(a);
}

// Prefer neighbouring calls — "five cars, five, CN 2204" against "two cars, two" is the confusion
// that actually costs you on the ground; a closing "ten feet" against the opening ID is not.
function optionsFor(all: Step[], step: number): string[] {
  const answer = all[step].call;
  const pool = all.map((s, i) => ({ call: s.call, gap: Math.abs(i - step) }))
    .filter(o => o.gap > 0 && distinct(answer, o.call));
  const near = shuffle(pool.filter(o => o.gap <= 3)).map(o => o.call);
  const far = shuffle(pool.filter(o => o.gap > 3)).map(o => o.call);
  const picked = [...new Set([...near, ...far])].slice(0, 2);
  return shuffle([answer, ...picked]);
}

const READOUT_START = '10 cars to the joint';

export function RadioTest() {
  const { content, profile, recordRadioStep, speak } = useApp();
  const navigate = useNavigate();

  const [runKey, setRunKey] = useState(0);
  const [focus, setFocus] = useState<number[] | null>(null);   // a "practice your misses" round
  const [pos, setPos] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const missedRef = useRef<Set<number>>(new Set());
  const startRef = useRef(0);

  // radioSim is loaded dynamically here as well as in guided mode, so the island module
  // keeps its own code-split chunk instead of being pulled into the main bundle.
  const [allSteps, setAllSteps] = useState<Step[] | null>(null);
  useEffect(() => {
    let live = true;
    import('./radioSim.js').then(m => { if (live) setAllSteps(m.STEPS as Step[]); });
    return () => { live = false; };
  }, []);

  // The radio-script items, in procedure order. Their trust decides what may be graded (F1).
  const items = useMemo(() => {
    const all = (content?.byDomain['radio'] || []).filter(i => i.type === 'radio-script');
    return all.slice().sort((a, b) => (a.payload?.step ?? 0) - (b.payload?.step ?? 0));
  }, [content]);

  const order = useMemo(
    () => (focus ? focus.slice() : items.map((_, i) => i)),
    [focus, items],
  );

  // Options are built once per run so re-renders don't reshuffle the buttons under the cursor.
  const runOptions = useMemo(
    () => (allSteps ? items.map(it => optionsFor(allSteps, it.payload?.step ?? 0)) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, allSteps, runKey],
  );

  useEffect(() => {
    startRef.current = profile.domains['radio']?.mastery || 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runKey]);

  const at = order[pos];
  const item: ContentItem | undefined = items[at];
  const step: Step | undefined = item && allSteps ? allSteps[item.payload?.step ?? 0] : undefined;
  const graded = item?.citation.trust === 'verified';

  useEffect(() => {
    if (step) speak(step.pre ? step.pre : (step.read || step.status || ''));
  }, [step, speak]);

  if (!content || !allSteps) return <p className="muted">Loading…</p>;
  if (!items.length) return <p className="muted">The radio script hasn't loaded.</p>;

  // ── Run finished ──
  if (item === undefined || step === undefined) {
    const gradedCount = order.filter(i => items[i]?.citation.trust === 'verified').length;
    const end = profile.domains['radio']?.mastery || 0;
    const delta = Math.round((end - startRef.current) * 100);
    return (
      <>
        <h2 className="view-title">{focus ? 'Review done' : 'Run done'}</h2>
        <p className="big-score">{score} / {order.length}</p>
        <p className="muted">
          {gradedCount} of those {order.length} calls carry a verified CROR citation and moved your
          Radio mastery: {delta >= 0 ? '+' : ''}{delta}% → {Math.round(end * 100)}%. The rest are real
          practice with no rule to cite — they're never scored against you.
        </p>
        <div className="opts">
          {missedRef.current.size > 0 && (
            <button className="opt" onClick={() => {
              setFocus([...missedRef.current]); missedRef.current = new Set();
              setPos(0); setPicked(null); setScore(0); setRunKey(k => k + 1);
            }}>
              Practice the {missedRef.current.size} you missed →
            </button>
          )}
          <button className="opt" onClick={() => {
            setFocus(null); missedRef.current = new Set();
            setPos(0); setPicked(null); setScore(0); setRunKey(k => k + 1);
          }}>Run it again</button>
          <button className="opt" onClick={() => navigate('/')}>Back to the path</button>
        </div>
      </>
    );
  }

  const opts = runOptions[at] || [step.call];
  const answered = picked !== null;
  const ok = picked === step.call;
  const c = item.citation;
  const readout = step.status || step.read || READOUT_START;

  function choose(value: string) {
    if (picked !== null) return;
    const correct = value === step!.call;
    setPicked(value);
    if (correct) setScore(s => s + 1);
    else missedRef.current.add(at);
    // F1 is enforced in AppContext too; this keeps the intent visible at the call site.
    if (graded) recordRadioStep(item!.id, correct);
  }

  return (
    <>
      <div className="drill-top">
        <span className="muted">Call {pos + 1} of {order.length}</span>
        <span className="muted">{score} correct</span>
      </div>

      <div className="radio-readout" aria-live="polite">{readout}</div>

      {step.pre && (
        <p className="radio-incoming"><span className="who">Engineer · CN 2204</span> {step.pre}</p>
      )}

      <h2 className="view-title">{step.pre ? 'What do you reply?' : 'What do you call?'}</h2>

      {!graded && (
        <p className="badge caution">
          {c.source === 'GOI'
            ? '● CN practice (GOI), not a CROR rule — answered and explained, never scored'
            : '● No CROR citation in the verified source — answered and explained, never scored'}
        </p>
      )}

      <div className="opts">
        {opts.map((o, i) => {
          const cls = answered ? (o === step.call ? 'opt right' : (o === picked ? 'opt wrong' : 'opt')) : 'opt';
          return <button key={i} className={cls} disabled={answered} onClick={() => choose(o)}>{o}</button>;
        })}
      </div>

      {answered && (
        <div className="feedback" aria-live="polite">
          <b className={ok ? 'fb-ok' : 'fb-no'}>{ok ? 'Right.' : 'Not quite.'}</b>
          {/* Only on a correct call: the engineer would not acknowledge a transmission you didn't make. */}
          {ok && step.ack && <span className="radio-ack"><span className="who">Engineer · CN 2204</span> {step.ack}</span>}
          {step.goi && <span className="muted">{step.goi}</span>}
          <span><b>{step.rule}</b> — {step.note}</span>
          <span className="cite">{c.source}{c.ref ? ` · ${c.ref}` : ''}{c.relatedRef ? ` · related: ${c.relatedRef}` : ''}</span>
          {item.payload?.ruleId && (
            <button className="iconbtn" onClick={() => navigate(`/reference?focus=${encodeURIComponent(String(item.payload!.ruleId))}`)}>
              Look it up →
            </button>
          )}
          <button className="iconbtn next" autoFocus onClick={() => { setPos(p => p + 1); setPicked(null); }}>
            {pos + 1 < order.length ? 'Next call →' : 'Finish'}
          </button>
        </div>
      )}
    </>
  );
}
