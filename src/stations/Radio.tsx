// Radio — the "Back to a Joint" procedure, in two modes.
//   Guided      — the SME-tuned walkthrough. Imperative island (./radioSim.js: mount(root, ctx);
//                 its STEPS wording is frozen), and UNGRADED on purpose: REVAMP §5 — merging the walkthrough with
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

type Mode = 'guided' | 'test';

export function Radio() {
  const [mode, setMode] = useState<Mode>('guided');
  // "Call it yourself" mounts when the learner opens it for the first time. After that both modes
  // stay mounted and the mode that is not shown is hidden, so a change of mode keeps the run of
  // each mode (row U-17).
  const [testOpen, setTestOpen] = useState(false);
  const navigate = useNavigate();
  const show = (next: Mode) => { setMode(next); if (next === 'test') setTestOpen(true); };

  return (
    <div className="cb-radio-view">
      {/* The island renders its own "← Home"; in test mode this station provides it. */}
      {mode === 'test' && <button className="cb-btn--plain" onClick={() => navigate('/')}>← Home</button>}

      {/* One station heading for both modes, in the form of the Reference title (contract C7). The
          name is the station name of Home.tsx; the icon is decoration and is not in the name. */}
      <h2 className="dusk-title cb-radio-title"><span className="dusk-ico" aria-hidden="true">📻</span> Radio walkthrough</h2>

      <div className="cb-tabs" role="tablist" aria-label="Radio mode">
        <button role="tab" aria-selected={mode === 'guided'} className="cb-tab"
          onClick={() => show('guided')}>
          Guided<small>Walk it through — nothing scored</small>
        </button>
        <button role="tab" aria-selected={mode === 'test'} className="cb-tab"
          onClick={() => show('test')}>
          Call it yourself<small>Pick the right call — counts toward Radio</small>
        </button>
      </div>

      <div hidden={mode !== 'guided'}><Guided /></div>
      {testOpen && <div hidden={mode !== 'test'}><RadioTest active={mode === 'test'} /></div>}
    </div>
  );
}

export default Radio;
