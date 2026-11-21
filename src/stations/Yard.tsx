// The Yard station. An imperative island: this wrapper loads the controller (./yardSim.js) lazily
// and gives it a host element and the bridge object of useImperativeStation. The controller works
// with the view, the drawing adapter and the engine in ./yard/. Four engine modules are frozen.
import { useImperativeStation } from './imperativeStation';

export function Yard() {
  const hostRef = useImperativeStation(() => import('./yardSim.js'));
  return <div ref={hostRef} className="yard-host" />;
}

export default Yard;
