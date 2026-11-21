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
import { LABEL_GOI, LABEL_NO_CITATION, optionsFor, sourceLine } from '../core/radio';
import type { ContentItem } from '../core/types';

interface Step {
  call: string; ack?: string; pre?: string; rule: string; note: string; goi?: string; read?: string; status?: string;
}

// The options of a call (the answer and the distractors) come from optionsFor in src/core/radio.ts.

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

  if (!content || !allSteps) return <p className="dusk-lede">Loading…</p>;
  if (!items.length) return <p className="dusk-lede">The radio script hasn't loaded.</p>;

  // ── Run finished ──
  if (item === undefined || step === undefined) {
    const gradedCount = order.filter(i => items[i]?.citation.trust === 'verified').length;
    const end = profile.domains['radio']?.mastery || 0;
    const delta = Math.round((end - startRef.current) * 100);
    return (
      <>
        <div className="dusk-tile dusk-tile--teal cb-radio-done">
          <div className="dusk-tile-cap">
            <h2 className="dusk-tile-lab">{focus ? 'Review done' : 'Run done'}</h2>
          </div>
          <div className="dusk-tile-body">
            <p className="dusk-tile-num">{score} / {order.length}</p>
            <p className="dusk-tile-sub">
              {gradedCount} of those {order.length} calls carry a verified CROR citation and moved your
              Radio mastery: {delta >= 0 ? '+' : ''}{delta}% → {Math.round(end * 100)}%. The rest are real
              practice with no rule to cite — they're never scored against you.
            </p>
          </div>
        </div>
        <div className="cb-radio-actions">
          {missedRef.current.size > 0 && (
            <button className="dusk-btn" onClick={() => {
              setFocus([...missedRef.current]); missedRef.current = new Set();
              setPos(0); setPicked(null); setScore(0); setRunKey(k => k + 1);
            }}>
              Practice the {missedRef.current.size} you missed →
            </button>
          )}
          <button className="dusk-btn" onClick={() => {
            setFocus(null); missedRef.current = new Set();
            setPos(0); setPicked(null); setScore(0); setRunKey(k => k + 1);
          }}>Run it again</button>
          <button className="dusk-btn" onClick={() => navigate('/')}>Back to the path</button>
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
      <div className="cb-radio-top">
        <span>Call {pos + 1} of {order.length}</span>
        <span className="dusk-count">{score} correct</span>
      </div>

      <div className="dusk-strip cb-radio-readout" aria-live="polite">
        <div className="dusk-cell dusk-cell--key"><b>{readout}</b></div>
      </div>

      {step.pre && (
        <p className="cb-tx cb-tx--eng"><span className="cb-who">Engineer · CN 2204</span> {step.pre}</p>
      )}

      <div className="dusk-panel dusk-panel--framed cb-radio-q">
        <div className="dusk-panel-head">
          <h2 className="dusk-panel-name">{step.pre ? 'What do you reply?' : 'What do you call?'}</h2>
        </div>
        <div className="dusk-panel-body">
          {!graded && (
            <p className="cb-chip cb-chip--caution">
              {`● ${c.source === 'GOI' ? LABEL_GOI : LABEL_NO_CITATION} — answered and explained, never scored`}
            </p>
          )}

          <div className="cb-opts">
            {opts.map((o, i) => {
              const cls = answered ? (o === step.call ? 'cb-opt cb-opt--right' : (o === picked ? 'cb-opt cb-opt--wrong' : 'cb-opt')) : 'cb-opt';
              return <button key={i} className={cls} data-cb="opt" disabled={answered} onClick={() => choose(o)}>{o}</button>;
            })}
          </div>
        </div>
      </div>

      {answered && (
        <div className="dusk-panel cb-radio-feedback" data-cb="feedback" aria-live="polite">
          <b className={ok ? 'cb-result cb-result--ok' : 'cb-result cb-result--no'}>{ok ? 'Right.' : 'Not quite.'}</b>
          {/* Only on a correct call: the engineer would not acknowledge a transmission you didn't make. */}
          {ok && step.ack && <span className="cb-tx cb-tx--eng"><span className="cb-who">Engineer · CN 2204</span> {step.ack}</span>}
          {step.goi && <span className="cb-radio-goi">{step.goi}</span>}
          <span><b>{step.rule}</b> — {step.note}</span>
          <span className="cb-sub">{sourceLine(c)}</span>
          {item.payload?.ruleId && (
            <button className="dusk-btn" onClick={() => navigate(`/reference?focus=${encodeURIComponent(String(item.payload!.ruleId))}`)}>
              Look it up →
            </button>
          )}
          <button className="dusk-btn cb-radio-next" autoFocus onClick={() => { setPos(p => p + 1); setPicked(null); }}>
            {pos + 1 < order.length ? 'Next call →' : 'Finish'}
          </button>
        </div>
      )}
    </>
  );
}
