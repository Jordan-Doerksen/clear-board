// Drill — adaptive (SM-2-lite) MC across content types; updates mastery → the path. (vanilla drill.js)
// Definitions → term↔definition MC. Signals → read-the-aspect MC. Rules → authored MC bank. One loop, one profile.
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { LibraryNotice } from '../components/LookUp';
import { Signal } from './Signal';
import { DOMAINS } from '../core/store';
import { severityOf } from '../core/severity';
import { answerCounts, buildSession, distinctAspects, dueGroups, withRecomputedMastery } from '../core/drill';
import type { DrillQuestion, Screen, Session } from '../core/drill';

// The station heading (U-29, 2c-plan C7): one visible h2 with the station name of Home, in the form
// of the Reference title. The route /signals is the station Signals; each other route is the Drill.
function StationTitle({ signals }: { signals: boolean }) {
  return (
    <div className="dusk-top cb-drill-head">
      <h2 className="dusk-title cb-drill-title"><span className="dusk-ico">{signals ? '🚦' : '🎯'}</span> {signals ? 'Signals' : 'Drill'}</h2>
    </div>
  );
}

// "1 item", "3 items": a count with its noun.
const count = (n: number, noun: string) => `${n} ${noun}${n === 1 ? '' : 's'}`;

// U-26: the note of a session in which no item was due at the start. It states the guard of the
// grading (answerCounts in src/core/drill.ts), so it is true for each answer of the session.
const PRACTICE_NOTE = 'A right answer counts only when the item is due. A miss always counts.';

// U-31: Read aloud speaks the words of the screen, in the order of the screen. Each part ends as a
// sentence, so that a voice makes a stop between two options.
const said = (text: string) => { const t = text.trim(); return /[.?!:…]$/.test(t) ? t : `${t}.`; };
function questionSpeech(q: DrillQuestion): string {
  const parts = [q.heading, ...(q.kind === 'signal' ? [] : [q.promptText]), ...q.options.map((o, i) => `${i + 1}. ${o}`)];
  return parts.filter(Boolean).map(said).join(' ');
}

// U-28 (LEARN-GAP): the words of a learn card, in the order of the card: the title, the chip and the
// plain words. Read aloud speaks them when the card shows.
const NEW_ITEM = 'New item';
function screenSpeech(screen: Screen): string {
  if (screen.kind === 'ask') return questionSpeech(screen.slot.q);
  return [screen.item.title, NEW_ITEM, screen.item.plain].filter(Boolean).map(said).join(' ');
}

export function Drill({ domain }: { domain?: string }) {
  const { content, contentFailed, profile, recordAnswer, speak, lookUp } = useApp();
  const navigate = useNavigate();
  const onSignals = useLocation().pathname === '/signals';
  // C7-DRILL: each state draws the heading with the same key. The loading state draws it first and
  // each other state draws "← Home" first, so with no key React would make a new heading and the
  // focus that the shell puts on the heading after a change of route would fall to the page body.
  const title = <StationTitle key="station-title" signals={onSignals} />;
  const profileRef = useRef(profile);
  profileRef.current = profile;

  const [built, setBuilt] = useState<Session | null>(null);
  const [isReview, setIsReview] = useState(false);                     // the session is a "practice your misses" round
  const [reviewNext, setReviewNext] = useState<Session | null>(null); // that round, built at "Finish" (U-15)
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const missedRef = useRef<Set<string>>(new Set());                    // items missed in the current session
  const [counted, setCounted] = useState(false);                        // an answer of the session counted (U26-NOTE)
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

  // Build the first session once per (content, domain). profileRef → pre-session snapshot.
  // The selection is the pure function buildSession of src/core/drill.ts (row U-44). A reset or a
  // load in Settings replaces the stored profile (a new createdAt): the session then starts again
  // from the profile that is stored now, so that its end does not count the loaded progress as its
  // own gain (finding F-3 of the last review of Wave 2c).
  const profileId = profile.createdAt;
  useEffect(() => {
    if (!content) return;
    missedRef.current = new Set();
    setBuilt(buildSession({ content, profile: profileRef.current, domain }));
    setIsReview(false); setReviewNext(null);
    setIdx(0); setScore(0); setPicked(null); setCounted(false);
  }, [content, domain, profileId]);

  // Start a new session from the end screen ("Drill again", or the review of the misses).
  function start(session: Session, review: boolean) {
    focusTo.current = 'question';
    missedRef.current = new Set();
    setBuilt(session); setIsReview(review); setReviewNext(null);
    setIdx(0); setScore(0); setPicked(null); setCounted(false);
  }

  // The screens of the session: a question, or a learn card before the first question about a new
  // item (U-28). `idx` counts the screens.
  const screen = built && idx < built.screens.length ? built.screens[idx] : null;
  const slot = screen?.kind === 'ask' ? screen.slot : null;
  const learn = screen?.kind === 'learn' ? screen.item : null;
  const item = slot?.item ?? null;
  const q = slot?.q ?? null;

  // Read aloud a new screen. A question: its heading, its prompt (a signal question has a drawing and
  // no prompt text) and its options (U-31). A learn card: its words. speak does nothing when Read
  // aloud is off.
  useEffect(() => {
    if (screen) speak(screenSpeech(screen));
  }, [screen, speak]);

  if (!content || !built) return <div className="cb-drill-view">{title}<p className="dusk-lede">Loading…</p></div>;

  if (built.slots.length < (isReview ? 1 : 4)) {
    // U-07 (2c-plan C9): when a content file did not load, the items of this domain can be in it, so
    // the sentence about the verified content would not be true. The notice of the shell says what
    // happened, with its retry control.
    return (
      <div className="cb-drill-view">
        <button className="cb-btn--plain" onClick={() => navigate('/')}>← Home</button>
        {title}
        {contentFailed.length > 0
          ? <LibraryNotice />
          : <p className="dusk-lede">Not enough verified content to drill yet.</p>}
      </div>
    );
  }

  // Finished — show the session summary with mastery deltas.
  if (!screen) {
    // U-15 (UX-27): the button of the review says the count of items and the count of questions of
    // the round that it starts.
    const reviewItems = new Set(reviewNext?.slots.map(s => s.item.id)).size;
    // U-26: items that were new and now have an answer; and when the items of the session come back.
    const started = built.newIds.filter(id => (profile.items[id]?.seen ?? 0) > 0).length;
    const due = dueGroups(built.slots.map(s => s.item.id), profile)
      .map(g => (g.days === 0 ? `${g.count} now` : `${g.count} in ${count(g.days, 'day')}`));
    // U-15: the end value is also read after the decay, as the start value is (buildSession). The app
    // context recomputes the mastery at the load, at an answer that counts and at a change of route
    // (MASTERY-NOW). A session can stay open for days with no change of route, so a session in which
    // no answer counts would otherwise show the decay as a gain.
    const after = withRecomputedMastery(profile, content);
    const lines = built.drilledDomains.map(d => {
      const name = (DOMAINS.find(x => x.id === d) || {}).name || d;
      const end = after.domains[d]?.mastery || 0;
      const delta = Math.round((end - (built.startMastery[d] || 0)) * 100);
      return `${name}: ${delta >= 0 ? '+' : ''}${delta}% → ${Math.round(end * 100)}%`;
    }).join(' · ');
    return (
      <div className="cb-drill-view">
        <button className="cb-btn--plain" onClick={() => navigate('/')}>← Home</button>
        {title}
        <div className="dusk-tile dusk-tile--teal cb-drill-done">
          <div className="dusk-tile-cap"><h3 className="dusk-tile-lab" ref={doneHeadRef} tabIndex={-1}>{isReview ? 'Review done' : 'Session done'}</h3></div>
          <div className="dusk-tile-body">
            <p className="dusk-tile-num">{score} / {built.slots.length}</p>
            <p className="dusk-tile-sub">{lines}. Spaced out over the next days so it sticks.</p>
            {/* U-26: progress in words, from the stored profile */}
            <p className="dusk-tile-sub cb-drill-progress">Right answers: {score} of {built.slots.length}.{started > 0 ? ` New items started: ${started}.` : ''}</p>
            {due.length > 0 && <p className="dusk-tile-sub cb-drill-progress">Items due again: {due.join(', ')}.</p>}
            {/* U26-NOTE: the end note shows only when no answer of the session counted. A miss always
                counts, and after a miss the mastery can fall: the note would then not be true. */}
            {built.practiceOnly && !counted && <p className="dusk-tile-sub cb-drill-progress">This session was practice only: no item in it was due at the start. {PRACTICE_NOTE}</p>}
          </div>
        </div>
        <div className="cb-drill-actions">
          {reviewNext && reviewNext.slots.length > 0 && (
            <button className="dusk-btn" onClick={() => start(reviewNext, true)}>
              Practice the {count(reviewItems, 'item')} you missed: {count(reviewNext.slots.length, 'question')} →
            </button>
          )}
          <button className="dusk-btn" onClick={() => start(buildSession({ content, profile: profileRef.current, domain }), false)}>Drill again</button>
          {/* U-40 (2c-plan C6): the way back to Home has one name. */}
          <button className="dusk-btn" onClick={() => navigate('/')}>← Home</button>
        </div>
      </div>
    );
  }

  // U-28 (LEARN-GAP, 2c-plan C11): the learn card of a new item. It shows the text that the data
  // holds: the title, the plain words and each different drawing of a signal; and one control to go
  // on. It grades nothing. The question about the item comes later, after one other screen or more.
  if (learn) {
    const aspects = learn.type === 'signal' ? distinctAspects(learn.payload?.aspects ?? []) : [];
    return (
      <div className="cb-drill-view">
        <button className="cb-btn--plain" onClick={() => navigate('/')}>← Home</button>
        {title}
        <div className="dusk-panel dusk-panel--framed cb-drill-learn" data-cb="learn">
          <div className="dusk-panel-head"><h3 className="dusk-panel-name" ref={questionHeadRef} tabIndex={-1}>{learn.title}</h3></div>
          <div className="dusk-panel-body">
            <span className="cb-chip cb-chip--info">{NEW_ITEM}</span>
            <p className="cb-prose cb-prose--lead">{learn.plain}</p>
            {aspects.length > 0 && <div className="cb-drill-learn-aspects">{aspects.map((a, i) => <Signal key={i} aspect={a} />)}</div>}
          </div>
        </div>
        <button className="dusk-btn cb-drill-learn-next" data-cb="learn-next" onClick={() => {
          focusTo.current = 'question';
          setIdx(i => i + 1);
        }}>Next →</button>
      </div>
    );
  }
  if (!slot || !item || !q) return null;

  // The number of this question among the questions of the session; a learn card is not counted.
  const questionNumber = built.screens.slice(0, idx + 1).filter(s => s.kind === 'ask').length;
  const answered = picked !== null;
  const ok = picked === q.correct;
  const c = item.citation;
  const explain = q.explain || item.plain || c.verbatim;
  // U-06: after a miss the feedback names the right answer. The line of the title and the
  // explanation names it already for a signal and a term; for a rule question it can miss it.
  const namesAnswer = `${item.title} — ${explain ?? ''}`.includes(q.correct);
  const sev = severityOf(item);
  const sevLine = `${sev === 'S3' ? 'Safety-critical — lock this one in.' : 'Worth nailing.'} Review your misses at the end.`;
  // U-19: the verdict goes into a live region that is in the view before the answer. A miss on a
  // safety-critical item (S3) goes into an alert, so that a screen reader says it at once.
  const urgent = answered && !ok && sev === 'S3';
  const verdict = !answered ? '' : ok ? 'Right.'
    : ['Not quite.', `Correct answer: ${q.correct}.`, sev !== 'S1' ? sevLine : ''].filter(Boolean).join(' ');

  function choose(value: string) {
    if (picked !== null) return;
    const correct = value === q!.correct;
    setPicked(value);
    if (correct) setScore(s => s + 1);
    else missedRef.current.add(item!.id);   // remembered for the end-of-session review round (#10)
    // The guard of the grading, with the profile of this answer (U26-NOTE).
    if (answerCounts(item!, profileRef.current.items[item!.id], correct)) setCounted(true);
    recordAnswer(item!, correct);   // AppContext gates a correct re-advance by due-ness (anti-marathon, F2)
    // Read aloud the feedback (U-31): the verdict, the right answer after a miss, the explanation
    // and the severity line, as the panel shows them.
    const words = correct ? ['Right.'] : ['Not quite.', namesAnswer ? '' : `Correct answer: ${q!.correct}`];
    words.push(`${item!.title}. ${explain ?? ''}`);
    if (!correct && sev !== 'S1') words.push(sevLine);
    speak(words.filter(Boolean).map(said).join(' '));
  }

  return (
    <div className="cb-drill-view">
      <button className="cb-btn--plain" onClick={() => navigate('/')}>← Home</button>
      {title}
      <div className="cb-drill-top"><span className="cb-sub">Question {questionNumber} of {built.slots.length}</span><span className="dusk-count">{score} correct</span></div>
      {built.practiceOnly && <p className="cb-sub cb-drill-note">This session is practice only: no item in it was due at the start. {PRACTICE_NOTE}</p>}
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
      <p className="dusk-sr" role="status">{answered && !urgent ? verdict : ''}</p>
      <p className="dusk-sr" role="alert">{urgent ? verdict : ''}</p>
      {answered && (
        <div className="dusk-panel cb-drill-feedback" data-cb="feedback">
          <b id="cb-drill-verdict" className={ok ? 'cb-result cb-result--ok' : 'cb-result cb-result--no'}>{ok ? 'Right.' : 'Not quite.'}</b>
          {!ok && !namesAnswer && <span className="cb-drill-answer">Correct answer: <b>{q.correct}</b></span>}
          <span><b>{item.title}</b> — {explain}</span>
          {!ok && sev !== 'S1' && <span className="cb-drill-severity">{sevLine}</span>}
          <span className="cb-sub">{c.source}{c.ref ? ` · ${c.ref}` : ''}</span>
          {/* U-38: "Next" is the main control; "Look it up" is a text link. U-17 (2c-plan C1): the
              entry opens in a dialog on top of the Drill, so the session stays. */}
          <button className="cb-link cb-drill-lookup" onClick={() => lookUp(item!.id)}>Look it up →</button>
          <button className="dusk-btn cb-drill-next" autoFocus aria-describedby="cb-drill-verdict" onClick={() => {
            const last = idx + 1 >= built.screens.length;
            focusTo.current = last ? 'any' : 'question';
            // At "Finish", build the review of the misses now, so that its button can count it (U-15).
            if (last && missedRef.current.size > 0) setReviewNext(buildSession({ content, profile: profileRef.current, domain, focusIds: [...missedRef.current] }));
            setIdx(i => i + 1); setPicked(null);
          }}>
            {idx + 1 < built.screens.length ? 'Next →' : 'Finish'}
          </button>
        </div>
      )}
    </div>
  );
}
