// Drill — adaptive (SM-2-lite) MC across content types; updates mastery → the path. (vanilla drill.js)
// Definitions → term↔definition MC. Signals → read-the-aspect MC. Rules → authored MC bank. One loop, one profile.
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { Signal } from './Signal';
import { DOMAINS } from '../core/store';
import { severityOf } from '../core/severity';
import { buildSession } from '../core/drill';
import type { Session } from '../core/drill';

export function Drill({ domain }: { domain?: string }) {
  const { content, profile, recordAnswer, speak } = useApp();
  const navigate = useNavigate();
  const profileRef = useRef(profile);
  profileRef.current = profile;

  const [sessionKey, setSessionKey] = useState(0);
  const [built, setBuilt] = useState<Session | null>(null);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [focusIds, setFocusIds] = useState<string[] | null>(null);   // set ⇒ a "practice your misses" round
  const missedRef = useRef<Set<string>>(new Set());                  // items missed in the current session

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

  if (!content || !built) return <div className="cb-drill-view"><p className="dusk-lede">Loading…</p></div>;

  if (built.slots.length < (focusIds ? 1 : 4)) {
    return (
      <div className="cb-drill-view">
        <button className="cb-btn--plain" onClick={() => navigate('/')}>← Home</button>
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
        <div className="dusk-tile dusk-tile--teal cb-drill-done">
          <div className="dusk-tile-cap"><h2 className="dusk-tile-lab">{focusIds ? 'Review done' : 'Session done'}</h2></div>
          <div className="dusk-tile-body">
            <p className="dusk-tile-num">{score} / {built.slots.length}</p>
            <p className="dusk-tile-sub">{lines}. Spaced out over the next days so it sticks.</p>
          </div>
        </div>
        <div className="cb-drill-actions">
          {missedRef.current.size > 0 && (
            <button className="dusk-btn" onClick={() => { setFocusIds([...missedRef.current]); setSessionKey(k => k + 1); }}>
              Practice the {missedRef.current.size} you missed →
            </button>
          )}
          <button className="dusk-btn" onClick={() => { setFocusIds(null); setSessionKey(k => k + 1); }}>Drill again</button>
          <button className="dusk-btn" onClick={() => navigate('/')}>Back to the path</button>
        </div>
      </div>
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
    <div className="cb-drill-view">
      <button className="cb-btn--plain" onClick={() => navigate('/')}>← Home</button>
      <div className="cb-drill-top"><span className="cb-sub">Question {idx + 1} of {built.slots.length}</span><span className="dusk-count">{score} correct</span></div>
      <div className="dusk-panel dusk-panel--framed cb-drill-q">
        <div className="dusk-panel-head"><h2 className="dusk-panel-name">{q.heading}</h2></div>
        <div className="dusk-panel-body cb-drill-prompt" data-cb="prompt">
          {q.kind === 'signal'
            ? <div className="cb-drill-signal" data-cb="prompt-signal"><Signal aspect={q.aspect} /></div>
            : <div className="cb-prose cb-prose--lead">{q.promptText}</div>}
        </div>
      </div>
      <div className="cb-opts">
        {q.options.map((o, i) => {
          const cls = answered ? (o === q.correct ? 'cb-opt cb-opt--right' : (o === picked ? 'cb-opt cb-opt--wrong' : 'cb-opt')) : 'cb-opt';
          return <button key={i} className={cls} data-cb="opt" disabled={answered} onClick={() => choose(o)}>{o}</button>;
        })}
      </div>
      {answered && (
        <div className="dusk-panel cb-drill-feedback" data-cb="feedback" aria-live="polite">
          <b className={ok ? 'cb-result cb-result--ok' : 'cb-result cb-result--no'}>{ok ? 'Right.' : 'Not quite.'}</b>
          <span><b>{item.title}</b> — {q.explain || item.plain || c.verbatim}</span>
          {!ok && severityOf(item) !== 'S1' && (
            <span className="cb-drill-severity">{severityOf(item) === 'S3' ? 'Safety-critical — lock this one in.' : 'Worth nailing.'} Review your misses at the end.</span>
          )}
          <span className="cb-sub">{c.source}{c.ref ? ` · ${c.ref}` : ''}</span>
          <button className="dusk-btn" onClick={() => navigate(`/reference?focus=${encodeURIComponent(item!.id)}`)}>Look it up →</button>
          <button className="dusk-btn" autoFocus onClick={() => { setIdx(i => i + 1); setPicked(null); }}>
            {idx + 1 < built.slots.length ? 'Next →' : 'Finish'}
          </button>
        </div>
      )}
    </div>
  );
}
