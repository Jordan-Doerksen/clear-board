// The Yard station. An imperative island: this wrapper loads the controller (./yardSim.js) lazily
// and gives it a host element and the bridge object of useImperativeStation. The controller works
// with the view, the drawing adapter and the engine in ./yard/. Four engine modules are frozen.
//
// The wrapper also draws the top of the station: "← Home" and the one h2 with the station name
// (2c-plan C7, U-29), in the form of the Reference title. React draws them, so that they are in the
// view at once, before the island loads, and the shell can move focus to the heading after a change
// of route. They stand in a .yard-wrap of their own, so that the rules of yard.css reach them. This
// file imports yard.css, so that the style of the chrome is in the page before the island loads and
// the top does not change its look when the island comes. It comes after each sheet of main.tsx, as
// before. Each rule of yard.css starts with .yard-wrap, so it reaches no other station.
import { useNavigate } from 'react-router-dom';
import { useImperativeStation } from './imperativeStation';
import './yard/yard.css';

export function Yard() {
  const hostRef = useImperativeStation(() => import('./yardSim.js'));
  const navigate = useNavigate();
  return (
    <>
      <div className="yard-wrap yd-top">
        <button className="yd-back cb-btn--plain" onClick={() => navigate('/')}>← Home</button>
        <h2 className="dusk-title yd-title"><span className="dusk-ico" aria-hidden="true">🚂</span> The Yard</h2>
      </div>
      <div ref={hostRef} className="yard-host" />
    </>
  );
}

export default Yard;
