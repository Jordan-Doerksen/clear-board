// Clear Board — app shell: header chrome, hash routing, accessible focus handling, settings dialog.
import { useEffect, useRef, useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AppProvider } from './state/AppContext';
import { Home } from './stations/Home';
import { Reference } from './stations/Reference';
import { Drill } from './stations/Drill';
import { Yard } from './stations/Yard';
import { Radio } from './stations/Radio';
import { Settings } from './stations/Settings';

function DrillRoute() {
  const { domain } = useParams();
  return <Drill domain={domain} />;
}

function Shell() {
  const location = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef<HTMLElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Move focus to the view on navigation (screen-reader + keyboard friendly).
  useEffect(() => { mainRef.current?.focus(); }, [location.pathname]);

  return (
    <>
      <a className="dusk-skip cb-shell-skip" href="#view" onClick={e => { e.preventDefault(); mainRef.current?.focus(); }}>Skip to content</a>
      <div className="dusk-stage dusk-stage--app">
        <section className="dusk-win cb-win cb-shell-win">
          <header className="dusk-titlebar" role="banner">
            <div className="dusk-brand">
              <button className="cb-mark" aria-label="Home" onClick={() => navigate('/')}><i className="dusk-led dusk-led--ok" /></button>
              <h1>Clear Board</h1>
            </div>
            <p className="dusk-crumb">Become a conductor. Free, forever.</p>
            <span className="dusk-spacer" />
            <button className="dusk-btn" aria-haspopup="dialog" data-cb="settings-open" onClick={() => setSettingsOpen(true)}><span aria-hidden="true">⚙</span> Settings</button>
          </header>
          <div className="dusk-thread" aria-hidden="true" />
          <main className="dusk-main" id="view" ref={mainRef} tabIndex={-1}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/reference" element={<Reference />} />
              <Route path="/drill" element={<Drill />} />
              <Route path="/drill/:domain" element={<DrillRoute />} />
              <Route path="/signals" element={<Drill domain="signals" />} />
              <Route path="/yard" element={<Yard />} />
              <Route path="/radio" element={<Radio />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </section>
      </div>
      <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Shell />
      </HashRouter>
    </AppProvider>
  );
}
