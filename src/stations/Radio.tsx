// Radio — the "Back to a Joint" procedure, in two modes.
//   Guided      — the SME-tuned walkthrough. Imperative island (./radioSim.js is byte-for-byte
//                 vanilla), and UNGRADED on purpose: REVAMP §5 — merging the walkthrough with
//                 grading turns a confidence-builder into a test.
//   Call it yourself — the same procedure with the call hidden; this is where mastery is earned.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImperativeStation } from './imperativeStation';
import { RadioTest } from './RadioTest';

function Guided() {
  const hostRef = useImperativeStation(() => import('./radioSim.js'));
  return <div ref={hostRef} className="radio-host" />;
}

export function Radio() {
  const [mode, setMode] = useState<'guided' | 'test'>('guided');
  const navigate = useNavigate();

  return (
    <>
      {/* The island renders its own "← Home"; in test mode this station provides it. */}
      {mode === 'test' && <button className="back" onClick={() => navigate('/')}>← Home</button>}

      <div className="mode-tabs" role="tablist" aria-label="Radio mode">
        <button role="tab" aria-selected={mode === 'guided'} className={`mode-tab ${mode === 'guided' ? 'on' : ''}`}
          onClick={() => setMode('guided')}>
          Guided<small>Walk it through — nothing scored</small>
        </button>
        <button role="tab" aria-selected={mode === 'test'} className={`mode-tab ${mode === 'test' ? 'on' : ''}`}
          onClick={() => setMode('test')}>
          Call it yourself<small>Pick the right call — counts toward Radio</small>
        </button>
      </div>

      {mode === 'guided' ? <Guided /> : <RadioTest />}
    </>
  );
}

export default Radio;
