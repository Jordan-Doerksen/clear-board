// The bridge hook for the two imperative islands, the Yard and the Radio. An island is a plain
// module with mount(host, ctx) and, when it has work to stop, unmount(). The hook gives it a host
// element and one bridge object, `ctx`, and writes the latest React values into that object. It
// loads the module lazily, so the island code stays out of the main bundle. At the teardown the
// hook calls unmount() of the module, when the module exports it, and then empties the host
// (2c-plan C2). When the module does not load, the host says so (U-07).
import { useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import type { Profile, Settings } from '../core/types';

export type StationCtx = {
  profile: Profile;
  settings: Settings;
  speak: (text: string) => void;
  save: () => void;
  recordYardWin: (itemIds: string[], correct: boolean) => void;
  go: (route: string) => void;
  // 2c-plan C1: opens the Reference entry of an item in a dialog on top of the station.
  lookUp: (itemId: string) => void;
};

type StationModule = { mount: (host: HTMLElement, ctx: StationCtx) => void; unmount?: () => void };

// U-07 (R6 ENG-01 a): when the module of an island does not load, or its mount throws, the host
// says so and offers a reload. A reload gets the files of the version that the app now holds.
function showLoadFailure(host: HTMLElement) {
  const notice = document.createElement('div');
  notice.className = 'cb-banner cb-banner--bad cb-shell-island-fail';
  notice.setAttribute('role', 'alert');
  const reload = document.createElement('button');
  reload.className = 'dusk-btn';
  reload.textContent = 'Reload';
  reload.addEventListener('click', () => window.location.reload());
  notice.append('This station did not load. ', reload);
  host.replaceChildren(notice);
}

export function useImperativeStation(load: () => Promise<StationModule>) {
  const { profile, settings, persistProfile, speak, recordYardWin, lookUp } = useApp();
  const navigate = useNavigate();
  const hostRef = useRef<HTMLDivElement>(null);

  // Stable bridge the engine reads at mount; kept pointed at the latest React values.
  const ctxRef = useRef<StationCtx>({
    profile,
    settings,
    speak,
    save: persistProfile,
    recordYardWin,                     // one-brain: a Yard win grades the puzzle's rule items
    go: (route: string) => navigate(route ? `/${route}` : '/'),
    lookUp,
  });
  ctxRef.current.profile = profile;
  ctxRef.current.settings = settings;
  ctxRef.current.speak = speak;
  ctxRef.current.save = persistProfile;
  ctxRef.current.recordYardWin = recordYardWin;
  ctxRef.current.lookUp = lookUp;

  // The loader is read one time, at mount: it is a constant thunk of a dynamic import.
  const loadRef = useRef(load);

  useLayoutEffect(() => {
    let cancelled = false;
    let mounted: StationModule | null = null;
    const host = hostRef.current;
    loadRef.current()
      .then(mod => {
        if (cancelled || !host) return;
        mod.mount(host, ctxRef.current);
        mounted = mod;
      })
      .catch(() => { if (!cancelled && host) showLoadFailure(host); });
    // The teardown calls unmount() of the module first, so that the module stops the work that it
    // has in flight: timers, animation frames, sounds and listeners. A module with no unmount() gets
    // no call: its work in flight then runs against a host that is no longer in the page. Then the
    // host is emptied, also when unmount() throws. This is a layout effect: React runs its teardown
    // before it takes the host out of the page, so unmount() sees the host as the module left it.
    return () => {
      cancelled = true;
      try { mounted?.unmount?.(); } finally { if (host) host.innerHTML = ''; }
    };
  }, []);

  return hostRef;
}
