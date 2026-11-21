// The bridge hook for the two imperative islands, the Yard and the Radio. An island is a plain
// module with mount(host, ctx). The hook gives it a host element and one bridge object, `ctx`, and
// writes the latest React values into that object. It loads the module lazily, so the island code
// stays out of the main bundle. The teardown empties the host: the module gets no call.
import { useEffect, useRef } from 'react';
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

type StationModule = { mount: (host: HTMLElement, ctx: StationCtx) => void };

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
