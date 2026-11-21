// Clear Board — app shell: header chrome, hash routing, accessible focus handling, settings dialog.
import { Component, useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AppProvider, useApp } from './state/AppContext';
import { clearProfileKeepCopy, saveTextFile, storedDataFile } from './core/store';
import { Home } from './stations/Home';
import { Reference } from './stations/Reference';
import { Drill } from './stations/Drill';
import { Yard } from './stations/Yard';
import { Radio } from './stations/Radio';
import { Settings } from './stations/Settings';
import { LookUp } from './components/LookUp';

function DrillRoute() {
  const { domain } = useParams();
  return <Drill domain={domain} />;
}

// ---- The screen for a render error (U-05, U-07) -------------------------------------------------
// When a part of the app throws while it draws, the guard shows this screen in place of a blank
// page. It reads the stored data directly, so it works with no app state.
function RenderFailed() {
  const headingId = useId();
  function saveCopy() {
    const file = storedDataFile();
    saveTextFile(file.name, file.text);
  }
  function startFresh() {
    if (!confirm('Clear your progress on this device and start fresh? Save a copy first if you want to keep it.')) return;
    clearProfileKeepCopy();
    window.location.hash = '#/';
    window.location.reload();
  }
  return (
    <section className="cb-shell-fail" aria-labelledby={headingId}>
      <h2 className="dusk-title" id={headingId}>Clear Board could not show this screen</h2>
      <p className="cb-prose">Save a copy of the stored data to a file first. The file keeps your progress.</p>
      <p className="cb-prose">Start fresh clears your progress on this device and opens Home again.</p>
      <div className="cb-shell-fail-actions">
        <button className="dusk-btn" onClick={saveCopy}>Save a copy of the stored data</button>
        <button className="cb-btn--attn" onClick={startFresh}>Start fresh</button>
      </div>
    </section>
  );
}

// `whole`: the guard holds the whole app, so its screen also draws the window.
class RenderGuard extends Component<{ children: ReactNode; whole?: boolean }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError(): { failed: boolean } { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    if (!this.props.whole) return <RenderFailed />;
    return (
      <div className="dusk-stage dusk-stage--app">
        <section className="dusk-win cb-win cb-shell-win">
          <main className="dusk-main" id="view"><RenderFailed /></main>
        </section>
      </div>
    );
  }
}

// ---- The notices of the shell -----------------------------------------------------------------
// One row under the thread. It is a live region that is always in the page, so that a screen reader
// hears a notice when it comes. With no notice it is empty and takes no room.
// U-07 (2c-plan C9): part of the library did not load.
function Notices() {
  const { contentFailed, retryContent } = useApp();
  return (
    <div className="cb-shell-notices" role="status">
      {contentFailed.length > 0 && (
        <p className="cb-shell-notice">
          <span>Part of the library did not load.</span>
          <button className="dusk-btn" onClick={retryContent}>Try again</button>
        </p>
      )}
    </div>
  );
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
          <Notices />
          <main className="dusk-main" id="view" ref={mainRef} tabIndex={-1}>
            {/* A new route gives a new guard, so a screen for a render error goes with its route. */}
            <RenderGuard key={location.pathname}>
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
            </RenderGuard>
          </main>
        </section>
      </div>
      <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <LookUp />
    </>
  );
}

export default function App() {
  return (
    <RenderGuard whole>
      <AppProvider>
        <HashRouter>
          <Shell />
        </HashRouter>
      </AppProvider>
    </RenderGuard>
  );
}
