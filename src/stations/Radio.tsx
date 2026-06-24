// Radio — the "Back to a Joint" guided walkthrough (SME-tuned call wording, never reworded).
// Imperative island: the station (./radioSim.js) is byte-for-byte vanilla; this wrapper lazy-loads
// it and bridges ctx (navigate / settings / read-aloud / profile.radio.done + save) via the shared hook.
import { useImperativeStation } from './imperativeStation';

export function Radio() {
  const hostRef = useImperativeStation(() => import('./radioSim.js'));
  return <div ref={hostRef} className="radio-host" />;
}

export default Radio;
