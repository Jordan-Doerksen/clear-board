// Clear Board — one provider for the whole app: content library, the single profile, and settings.
// Mirrors the vanilla `ctx` object (profile/content/settings/save/recompute/speak) as React context.
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { freshProfile, keepProfileCopy, loadContent, readStoredProfile, recomputeMastery, saveProfile, SETTINGS_KEY } from '../core/store';
import { grade, isDue } from '../core/sr';
import type { Content, ContentItem, Profile, Settings } from '../core/types';

function defaultSettings(): Settings {
  return { dys: false, contrast: false, reduce: matchMedia('(prefers-reduced-motion: reduce)').matches, audio: false, big: false };
}
// A stored setting counts only when it is true or false. Each other value gives the default.
function loadSettings(): Settings {
  const settings = defaultSettings();
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null');
    if (stored && typeof stored === 'object') {
      for (const key of Object.keys(settings) as (keyof Settings)[]) {
        const value = (stored as Record<string, unknown>)[key];
        if (typeof value === 'boolean') settings[key] = value;
      }
    }
  } catch { /* storage blocked, or text that is not JSON: the defaults */ }
  return settings;
}

// The profile at the start. A stored profile that needed a repair, or that the app cannot read,
// is kept under the second key before the app writes over it (U-05).
function startProfile(): Profile {
  const stored = readStoredProfile(loadSettings());
  if ((stored.state === 'repaired' || stored.state === 'unreadable') && stored.text !== null) keepProfileCopy(stored.text);
  return stored.profile;
}

interface AppValue {
  content: Content | null;
  // 2c-plan C9 (U-07): the names of the content files that did not load, for example "rules.json".
  // Empty when each file loaded. retryContent() loads the library again.
  contentFailed: string[];
  retryContent: () => void;
  profile: Profile;
  settings: Settings;
  setSetting: (key: keyof Settings, value: boolean) => void;
  resetProgress: () => void;
  // Replaces the profile, and the settings when the file holds them (U-18, "Load my progress").
  replaceProgress: (profile: Profile, settings: Settings | null) => void;
  recordAnswer: (item: ContentItem, correct: boolean) => void;
  recordYardWin: (itemIds: string[], correct: boolean) => void;
  recordRadioStep: (itemId: string, correct: boolean) => void;
  persistProfile: () => void;
  speak: (text: string) => void;
  // 2c-plan C1 (U-17): opens the Reference entry of an item in a dialog on top of the current
  // route. The station stays mounted. Closing the dialog returns focus to the control that opened it.
  lookUp: (itemId: string) => void;
  // The request of the look-up dialog, or null. Each call of lookUp makes a new request, so a late
  // close event of the dialog clears only the request that it closes.
  lookUpRequest: LookUpRequest | null;
  closeLookUp: (request: LookUpRequest) => void;
}
export interface LookUpRequest { itemId: string }

const Ctx = createContext<AppValue | null>(null);

export function useApp(): AppValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used inside <AppProvider>');
  return v;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Content | null>(null);
  const [contentFailed, setContentFailed] = useState<string[]>([]);
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [profile, setProfile] = useState<Profile>(startProfile);

  // Load the content library at the start, and again on retryContent(). A load that runs is not
  // started a second time.
  const loading = useRef(false);
  const retryContent = useCallback(() => {
    if (loading.current) return;
    loading.current = true;
    loadContent()
      .then(({ content: library, failed }) => { setContent(library); setContentFailed(failed); })
      .finally(() => { loading.current = false; });
  }, []);
  useEffect(() => { retryContent(); }, [retryContent]);

  // Recompute mastery as soon as content arrives (decay applies even before any new drill).
  useEffect(() => {
    if (!content) return;
    setProfile(prev => { const p = structuredClone(prev); recomputeMastery(p, content); saveProfile(p); return p; });
  }, [content]);

  // Apply accessibility settings to <html> and persist them. CSS keys off these data-attrs + --fs.
  useEffect(() => {
    const el = document.documentElement;
    el.dataset.dys = settings.dys ? '1' : '0';
    el.dataset.contrast = settings.contrast ? '1' : '0';
    el.dataset.reduce = settings.reduce ? '1' : '0';
    el.style.setProperty('--fs', settings.big ? '18.5px' : '16px');
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch { /* ignore */ }
  }, [settings]);

  const setSetting = useCallback((key: keyof Settings, value: boolean) => {
    setSettings(s => ({ ...s, [key]: value }));
  }, []);

  const speak = useCallback((text: string) => {
    if (!settings.audio) return;
    try { speechSynthesis.cancel(); speechSynthesis.speak(new SpeechSynthesisUtterance(text)); } catch { /* no voice */ }
  }, [settings.audio]);

  const recordAnswer = useCallback((item: ContentItem, correct: boolean) => {
    setProfile(prev => {
      const p = structuredClone(prev);
      // Anti-marathon (F2 / validation #7): a CORRECT answer only advances the schedule when the item
      // is actually due — re-drilling before its interval elapses can't farm familiarity. A miss always
      // counts (resetting the interval is safety signal regardless of timing).
      if (correct && !isDue(p.items[item.id])) return prev;
      p.items[item.id] = grade(p.items[item.id], correct);
      const dom = p.domains[item.domain] || (p.domains[item.domain] = { mastery: 0, lastDrill: null });
      dom.lastDrill = new Date().toISOString();
      if (content) recomputeMastery(p, content);
      saveProfile(p);
      return p;
    });
  }, [content]);

  // One brain: the stations outside the Drill grade real content items into the SAME mastery
  // model the Drill uses. Safety guards: only VERIFIED items are ever graded (F1 — a
  // needs-review or operating-practice item must never enter a graded path), and a correct rep
  // only counts when the item is DUE, so replaying easy content can't farm familiarity (F2).
  const gradeItems = useCallback((itemIds: string[], correct: boolean) => {
    if (!content) return;
    setProfile(prev => {
      const p = structuredClone(prev);
      const now = new Date().toISOString();
      let touched = false;
      for (const id of itemIds) {
        const item = content.byId[id];
        if (!item || item.citation?.trust !== 'verified') continue;   // F1: never grade unverified
        if (correct && !isDue(p.items[id])) continue;                 // F2: no same-session fam farming
        p.items[id] = grade(p.items[id], correct);
        const dom = p.domains[item.domain] || (p.domains[item.domain] = { mastery: 0, lastDrill: null });
        dom.lastDrill = now;
        touched = true;
      }
      if (!touched) return prev;                                      // nothing due — no write, no churn
      recomputeMastery(p, content);
      saveProfile(p);
      return p;
    });
  }, [content]);

  // The Yard: a puzzle win grades the rule items it exercises.
  const recordYardWin = gradeItems;
  // Radio "Call it yourself": one graded call per step. The six steps with no verified CROR
  // citation (the closing counts, and the two CN GOI steps) are `operating-practice` in
  // radio-script.json, so gradeItems' F1 filter drops them — they play, they explain, they
  // never move the bar. That is the point, not a gap (D-0025).
  const recordRadioStep = useCallback((itemId: string, correct: boolean) => {
    gradeItems([itemId], correct);
  }, [gradeItems]);

  // The Yard mutates profile.yard.completed in place (vanilla engine) then calls this to persist.
  const persistProfile = useCallback(() => {
    setProfile(prev => { saveProfile(prev); return prev; });
  }, []);

  const resetProgress = useCallback(() => {
    try { localStorage.removeItem('cb.profile.v1'); } catch { /* ignore */ }
    setProfile(() => {
      const p = freshProfile(settings);
      if (content) recomputeMastery(p, content);
      return p;
    });
  }, [settings, content]);

  // C1: the look-up dialog. An id that the full library does not hold opens nothing.
  const [lookUpRequest, setLookUpRequest] = useState<LookUpRequest | null>(null);
  // An id that the library does not hold opens nothing, unless part of the library did not load:
  // then the dialog says so.
  const lookUp = useCallback((itemId: string) => {
    if (content && !content.byId[itemId] && contentFailed.length === 0) return;
    setLookUpRequest({ itemId });
  }, [content, contentFailed]);
  const closeLookUp = useCallback((request: LookUpRequest) => {
    setLookUpRequest(current => (current === request ? null : current));
  }, []);

  const replaceProgress = useCallback((next: Profile, nextSettings: Settings | null) => {
    const p = structuredClone(next);
    if (content) recomputeMastery(p, content);
    saveProfile(p);
    setProfile(p);
    if (nextSettings) setSettings(nextSettings);
  }, [content]);

  return (
    <Ctx.Provider value={{ content, contentFailed, retryContent, profile, settings, setSetting, resetProgress, replaceProgress, recordAnswer, recordYardWin, recordRadioStep, persistProfile, speak, lookUp, lookUpRequest, closeLookUp }}>
      {children}
    </Ctx.Provider>
  );
}
