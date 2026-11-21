// Radio — the "Back to a Joint" procedure, in two modes.
//   Guided      — the SME-tuned walkthrough. Imperative island (./radioSim.js: mount(root, ctx);
//                 its STEPS wording is frozen), and UNGRADED on purpose: REVAMP §5 — merging the walkthrough with
//                 grading turns a confidence-builder into a test.
//   Call it yourself — the same procedure with the call hidden; this is where mastery is earned.
import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImperativeStation } from './imperativeStation';
import { RadioTest } from './RadioTest';

function Guided() {
  const hostRef = useImperativeStation(() => import('./radioSim.js'));
  return <div ref={hostRef} className="radio-host" />;
}

type Mode = 'guided' | 'test';
const MODES: Mode[] = ['guided', 'test'];

export function Radio() {
  const [mode, setMode] = useState<Mode>('guided');
  // "Call it yourself" mounts when the learner opens it for the first time. After that both modes
  // stay mounted and the mode that is not shown is hidden, so a change of mode keeps the run of
  // each mode (row U-17).
  const [testOpen, setTestOpen] = useState(false);
  const navigate = useNavigate();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const show = (next: Mode) => { setMode(next); if (next === 'test') setTestOpen(true); };

  // The mode switch is a tab list (row U-22). Only the selected tab is a Tab stop. The arrow keys
  // move to the other tab and show its mode; Home and End go to the first and the last tab.
  function onTabKey(e: KeyboardEvent<HTMLDivElement>) {
    const at = tabRefs.current.indexOf(e.target as HTMLButtonElement);
    if (at === -1) return;
    const last = MODES.length - 1;
    const to = e.key === 'ArrowRight' ? (at === last ? 0 : at + 1)
      : e.key === 'ArrowLeft' ? (at === 0 ? last : at - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : -1;
    if (to === -1) return;
    e.preventDefault();
    show(MODES[to]);
    tabRefs.current[to]?.focus();
  }

  const tab = (m: Mode, i: number, name: string, sub: string) => (
    <button ref={el => { tabRefs.current[i] = el; }} role="tab" id={`cb-radio-tab-${m}`} aria-controls={`cb-radio-panel-${m}`}
      aria-selected={mode === m} tabIndex={mode === m ? 0 : -1} className="cb-tab" onClick={() => show(m)}>
      {name}<small>{sub}</small>
    </button>
  );

  return (
    <div className="cb-radio-view">
      {/* One "← Home" for both modes, first in the view (rows U-22 and U-40). */}
      <button className="cb-btn--plain" onClick={() => navigate('/')}>← Home</button>

      {/* One station heading for both modes, in the form of the Reference title (contract C7). The
          name is the station name of Home.tsx; the icon is decoration and is not in the name. */}
      <h2 className="dusk-title cb-radio-title"><span className="dusk-ico" aria-hidden="true">📻</span> Radio walkthrough</h2>

      <div className="cb-tabs" role="tablist" aria-label="Radio mode" onKeyDown={onTabKey}>
        {tab('guided', 0, 'Guided', 'Walk it through — nothing scored')}
        {tab('test', 1, 'Call it yourself', 'Pick the right call — counts toward Radio')}
      </div>

      <div role="tabpanel" id="cb-radio-panel-guided" aria-labelledby="cb-radio-tab-guided" hidden={mode !== 'guided'}>
        <Guided />
      </div>
      <div role="tabpanel" id="cb-radio-panel-test" aria-labelledby="cb-radio-tab-test" hidden={mode !== 'test'}>
        {testOpen && <RadioTest active={mode === 'test'} />}
      </div>
    </div>
  );
}

export default Radio;
