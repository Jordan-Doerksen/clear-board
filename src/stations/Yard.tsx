// The Yard — the switch-list canvas sim. An imperative island: the 7 SHA-verified engine modules
// (./yard/*.js) and the station (./yardSim.js) are kept byte-for-byte; this wrapper just lazy-loads
// them and bridges ctx to React via useImperativeStation.
import { useImperativeStation } from './imperativeStation';

export function Yard() {
  const hostRef = useImperativeStation(() => import('./yardSim.js'));
  return <div ref={hostRef} className="yard-host" />;
}

export default Yard;
