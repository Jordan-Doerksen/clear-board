// Shared "imperative island" bridge for stations that are byte-for-byte vanilla `mount(root, ctx)`
// modules (The Yard, Radio). Keeps the verified engine untouched; React just provides a host element,
// a ctx bridged to React state (navigate / settings / live profile / read-aloud / persist-on-win),
// and a clean teardown on unmount. Lazy-loads the module so its code stays out of the main bundle.
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';

type StationModule = { mount: (host: HTMLElement, ctx: unknown) => void };

export function useImperativeStation(load: () => Promise<StationModule>) {
  const { profile, settings, persistProfile, speak, recordYardWin } = useApp();
  const navigate = useNavigate();
  const hostRef = useRef<HTMLDivElement>(null);

  // Stable bridge the engine reads at mount; kept pointed at the latest React values.
  const ctxRef = useRef({
    profile,
    settings,
    speak,
    save: persistProfile,
    recordYardWin,                     // one-brain: a Yard win grades the puzzle's rule items
    go: (route: string) => navigate(route ? `/${route}` : '/'),
  });
  ctxRef.current.profile = profile;
  ctxRef.current.settings = settings;
  ctxRef.current.speak = speak;
  ctxRef.current.save = persistProfile;
  ctxRef.current.recordYardWin = recordYardWin;

  useEffect(() => {
    let cancelled = false;
    const host = hostRef.current;
    load().then(mod => { if (!cancelled && host) mod.mount(host, ctxRef.current); });
    // Teardown drops the engine's DOM + listeners. These stations have no infinite loops,
    // so anything in flight resolves harmlessly against a detached node.
    return () => { cancelled = true; if (host) host.innerHTML = ''; };
    // run once: `load` is a constant module-import thunk
  }, []);

  return hostRef;
}
