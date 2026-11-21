// Clear Board — app shell: header chrome, hash routing, accessible focus handling, settings dialog.
import { Component, useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { AppProvider, useApp } from './state/AppContext';
import { clearProfileKeepCopy, saveTextFile, storedDataFile, STATIONS } from './core/store';
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

// ---- The update of the app (U-10; R6 ENG-01) ------------------------------------------------------
// The worker of a new version waits. The notice says so, and the page reloads only when the learner
// presses "Reload". When the learner comes back to the app, it asks for a new version: that is an
// event of the page, not a timer.
function UpdateNotice() {
  const asked = useRef(false);     // the learner pressed "Reload" in this copy of the app
  const takenOver = useRef(false); // the new version controls this copy already: another copy chose it
  const registered = useRef<ServiceWorkerRegistration | null>(null);
  const { needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return;
      registered.current = registration;
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') registration.update().catch(() => { /* offline: ask later */ });
      });
    },
    // The new version took control. This copy reloads only when its learner chose it here.
    onNeedReload() {
      if (asked.current) window.location.reload();
      else { takenOver.current = true; setNeedRefresh(true); }
    },
  });
  if (!needRefresh) return null;
  // With no new worker in waiting (the new version took control already, or no worker controls this
  // page), only a reload of the page loads the new version (finding F-8 of the last review of Wave 2c).
  function reload() {
    asked.current = true;
    if (takenOver.current || !registered.current?.waiting) window.location.reload();
    else void updateServiceWorker(true);
  }
  return (
    <p className="cb-shell-notice">
      <span>A new version is ready.</span>
      <button className="dusk-btn" onClick={reload}>Reload</button>
    </p>
  );
}

// ---- The notices of the shell -----------------------------------------------------------------
// One row under the thread. It is a live region that is always in the page, so that a screen reader
// hears a notice when it comes. With no notice it is empty and takes no room.
// U-10: a new version is ready. U-07 (2c-plan C9): part of the library did not load.
function Notices() {
  const { contentFailed, retryContent } = useApp();
  return (
    <div className="cb-shell-notices" role="status">
      <UpdateNotice />
      {contentFailed.length > 0 && (
        <p className="cb-shell-notice">
          <span>Part of the library did not load.</span>
          <button className="dusk-btn" onClick={retryContent}>Try again</button>
        </p>
      )}
    </div>
  );
}

// ---- The page title and the focus of a route (U-29, 2c-plan C7; R5 A11Y-22, A11Y-23) -------------
// The title is the station name of Home, then " — Clear Board". Home has the name "Home".
function stationName(pathname: string): string {
  if (pathname === '/drill' || pathname.startsWith('/drill/')) return 'Drill';
  return STATIONS.find(s => s.go === pathname)?.name ?? 'Home';
}

// Focus goes to the first h2 of the view. The heading gets tabindex="-1", so that a script can
// focus it. Each station draws its heading with React (Wave 2c). When the view has no h2 yet,
// focus is on the view, and it moves to the heading when the heading comes, if it is still on the
// view. The return value stops the wait.
function focusViewHeading(main: HTMLElement): () => void {
  const toHeading = (heading: HTMLElement) => {
    if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
    heading.focus();
  };
  const now = main.querySelector('h2');
  if (now) { toHeading(now); return () => {}; }
  main.focus();
  const wait = new MutationObserver(() => {
    if (document.activeElement !== main) { wait.disconnect(); return; }
    const heading = main.querySelector('h2');
    if (heading) { wait.disconnect(); toHeading(heading); }
  });
  wait.observe(main, { childList: true, subtree: true });
  return () => wait.disconnect();
}

function Shell() {
  const location = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef<HTMLElement>(null);
  const lastPath = useRef<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { contentFailed } = useApp();
  const hadFailed = useRef(false);

  // After a "Try again" that loads the library, the notice and its control go, and focus fell to the
  // page body. It now goes to the heading of the view, as after a change of route (finding F-7 of the
  // last review of Wave 2c). An open dialog moves focus inside itself (LookUp.tsx).
  useEffect(() => {
    const failed = contentFailed.length > 0;
    const loaded = hadFailed.current && !failed;
    hadFailed.current = failed;
    const lost = !document.activeElement || document.activeElement === document.body;
    if (loaded && lost && mainRef.current) return focusViewHeading(mainRef.current);
  }, [contentFailed]);

  // Each route sets the page title. Focus does not move at the first load, so the first Tab stop is
  // "Skip to content". After a change of route, focus goes to the heading of the new view.
  useEffect(() => {
    document.title = `${stationName(location.pathname)} — Clear Board`;
    const before = lastPath.current;
    lastPath.current = location.pathname;
    if (before === null || before === location.pathname) return;
    // U-31 (2c-plan C10): the speech of the last route stops.
    try { speechSynthesis.cancel(); } catch { /* no speech in this browser */ }
    if (mainRef.current) return focusViewHeading(mainRef.current);
  }, [location.pathname]);

  return (
    <>
      <a className="dusk-skip cb-shell-skip" href="#view" onClick={e => { e.preventDefault(); if (mainRef.current) focusViewHeading(mainRef.current); }}>Skip to content</a>
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
