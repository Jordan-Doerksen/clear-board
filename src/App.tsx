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
      <a className="skip" href="#view" onClick={e => { e.preventDefault(); mainRef.current?.focus(); }}>Skip to content</a>
      <div className="wrap">
        <header className="top">
          <button className="mark" aria-label="Home" onClick={() => navigate('/')}><span /></button>
          <div className="brand">
            <h1>Clear Board</h1>
            <p>Become a conductor. Free, forever.</p>
          </div>
          <div className="grow" />
          <button className="iconbtn" aria-haspopup="dialog" onClick={() => setSettingsOpen(true)}>⚙ Settings</button>
        </header>
        <main id="view" ref={mainRef} tabIndex={-1}>
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
