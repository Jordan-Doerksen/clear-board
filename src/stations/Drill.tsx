// Drill — adaptive (SM-2-lite) MC across content types; updates mastery → the path. (vanilla drill.js)
// Definitions → term↔definition MC. Signals → read-the-aspect MC. Rules → authored MC bank. One loop, one profile.
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { Signal } from './Signal';
import { DOMAINS } from '../core/store';
import { severityOf } from '../core/severity';
import { buildSession } from '../core/drill';
import type { Session } from '../core/drill';

// The station heading (U-29, 2c-plan C7): one visible h2 with the station name of Home, in the form
// of the Reference title. The route /signals is the station Signals; each other route is the Drill.
function StationTitle({ signals }: { signals: boolean }) {
  return (
    <div className="dusk-top cb-drill-head">
      <h2 className="dusk-title cb-drill-title"><span className="dusk-ico">{signals ? '🚦' : '🎯'}</span> {signals ? 'Signals' : 'Drill'}</h2>
    </div>
  );
}

export function Drill({ domain }: { domain?: string }) {
  const { content, profile, recordAnswer, speak } = useApp();
  const navigate = useNavigate();
  const onSignals = useLocation().pathname === '/signals';
  const title = <StationTitle signals={onSignals} />;
  const profileRef = useRef(profile);
  profileRef.current = profile;

  const [sessionKey, setSessionKey] = useState(0);
  const [built, setBuilt] = useState<Session | null>(null);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [focusIds, setFocusIds] = useState<string[] | null>(null);   // set ⇒ a "practice your misses" round
  const missedRef = useRef<Set<string>>(new Set());                  // items missed in the current session
  // U-14: after "Next" keyboard focus stays in the task. The control that had focus is removed, so
  // focus goes to the heading of the next question, or to the end heading after "Finish".
  const questionHeadRef = useRef<HTMLHeadingElement>(null);
  const doneHeadRef = useRef<HTMLHeadingElement>(null);
  const focusTo = useRef<'question' | 'any' | null>(null);
  useEffect(() => {
    const want = focusTo.current;
    if (!want) return;
    const el = questionHeadRef.current ?? (want === 'any' ? doneHeadRef.current : null);
    if (el) { focusTo.current = null; el.focus(); }
  });

  // Build the session once per (content, domain, sessionKey). profileRef → pre-session snapshot.
  // The selection is the pure function buildSession of src/core/drill.ts (row U-44).
  useEffect(() => {
    if (!content) return;
    const session = buildSession({ content, profile: profileRef.current, domain, focusIds });
    missedRef.current = new Set();
    setBuilt(session);
    setIdx(0); setScore(0); setPicked(null);
  }, [content, domain, sessionKey, focusIds]);

  const slot = built && idx < built.slots.length ? built.slots[idx] : null;
  const item = slot?.item ?? null;
  const q = slot?.q ?? null;

  // Read-aloud the prompt (not the signal SVG) when a new question appears.
  useEffect(() => {
    if (q && (q.kind === 'rule' || q.kind === 'text')) speak(q.promptText);
  }, [q, speak]);

  if (!content || !built) return <div className="cb-drill-view">{title}<p className="dusk-lede">Loading…</p></div>;

  if (built.slots.length < (focusIds ? 1 : 4)) {
    return (
      <div className="cb-drill-view">
        <button className="cb-btn--plain" onClick={() => navigate('/')}>← Home</button>
        {title}
        <p className="dusk-lede">Not enough verified content to drill yet.</p>
      </div>
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
      <div className="cb-drill-view">
        <button className="cb-btn--plain" onClick={() => navigate('/')}>← Home</button>
        {title}
        <div className="dusk-tile dusk-tile--teal cb-drill-done">
          <div className="dusk-tile-cap"><h3 className="dusk-tile-lab" ref={doneHeadRef} tabIndex={-1}>{focusIds ? 'Review done' : 'Session done'}</h3></div>
          <div className="dusk-tile-body">
            <p className="dusk-tile-num">{score} / {built.slots.length}</p>
            <p className="dusk-tile-sub">{lines}. Spaced out over the next days so it sticks.</p>
          </div>
        </div>
        <div className="cb-drill-actions">
          {missedRef.current.size > 0 && (
            <button className="dusk-btn" onClick={() => { focusTo.current = 'question'; setFocusIds([...missedRef.current]); setSessionKey(k => k + 1); }}>
              Practice the {missedRef.current.size} you missed →
            </button>
          )}
          <button className="dusk-btn" onClick={() => { focusTo.current = 'question'; setFocusIds(null); setSessionKey(k => k + 1); }}>Drill again</button>
          <button className="dusk-btn" onClick={() => navigate('/')}>Back to the path</button>
        </div>
      </div>
    );
  }

  const answered = picked !== null;
  const ok = picked === q.correct;
  const c = item.citation;
  const explain = q.explain || item.plain || c.verbatim;
  // U-06: after a miss the feedback names the right answer. The line of the title and the
  // explanation names it already for a signal and a term; for a rule question it can miss it.
  const namesAnswer = `${item.title} — ${explain ?? ''}`.includes(q.correct);

  function choose(value: string) {
    if (picked !== null) return;
    const correct = value === q!.correct;
    setPicked(value);
    if (correct) setScore(s => s + 1);
    else missedRef.current.add(item!.id);   // remembered for the end-of-session review round (#10)
    recordAnswer(item!, correct);   // AppContext gates a correct re-advance by due-ness (anti-marathon, F2)
  }

  return (
    <div className="cb-drill-view">
      <button className="cb-btn--plain" onClick={() => navigate('/')}>← Home</button>
      {title}
      <div className="cb-drill-top"><span className="cb-sub">Question {idx + 1} of {built.slots.length}</span><span className="dusk-count">{score} correct</span></div>
      <div className="dusk-panel dusk-panel--framed cb-drill-q">
        <div className="dusk-panel-head"><h3 className="dusk-panel-name" ref={questionHeadRef} tabIndex={-1}>{q.heading}</h3></div>
        <div className="dusk-panel-body cb-drill-prompt" data-cb="prompt">
          {q.kind === 'signal'
            ? <div className="cb-drill-signal" data-cb="prompt-signal"><Signal aspect={q.aspect} /></div>
            : <div className="cb-prose cb-prose--lead">{q.promptText}</div>}
        </div>
      </div>
      <div className="cb-opts">
        {q.options.map((o, i) => {
          // U-06: after an answer the right option and the picked wrong option carry words, not only a colour.
          const right = answered && o === q.correct;
          const wrong = answered && !right && o === picked;
          const cls = right ? 'cb-opt cb-opt--right' : wrong ? 'cb-opt cb-opt--wrong' : 'cb-opt';
          return (
            <button key={i} className={cls} data-cb="opt" disabled={answered} onClick={() => choose(o)}>
              {o}
              {right && <>{' '}<span className="cb-drill-tag">Correct answer</span></>}
              {wrong && <>{' '}<span className="cb-drill-tag">Your answer</span></>}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="dusk-panel cb-drill-feedback" data-cb="feedback" aria-live="polite">
          <b className={ok ? 'cb-result cb-result--ok' : 'cb-result cb-result--no'}>{ok ? 'Right.' : 'Not quite.'}</b>
          {!ok && !namesAnswer && <span className="cb-drill-answer">Correct answer: <b>{q.correct}</b></span>}
          <span><b>{item.title}</b> — {explain}</span>
          {!ok && severityOf(item) !== 'S1' && (
            <span className="cb-drill-severity">{severityOf(item) === 'S3' ? 'Safety-critical — lock this one in.' : 'Worth nailing.'} Review your misses at the end.</span>
          )}
          <span className="cb-sub">{c.source}{c.ref ? ` · ${c.ref}` : ''}</span>
          {/* U-38: "Next" is the main control; "Look it up" is a text link. */}
          <button className="cb-link cb-drill-lookup" onClick={() => navigate(`/reference?focus=${encodeURIComponent(item!.id)}`)}>Look it up →</button>
          <button className="dusk-btn cb-drill-next" autoFocus onClick={() => {
            focusTo.current = idx + 1 < built.slots.length ? 'question' : 'any';
            setIdx(i => i + 1); setPicked(null);
          }}>
            {idx + 1 < built.slots.length ? 'Next →' : 'Finish'}
          </button>
        </div>
      )}
    </div>
  );
}
