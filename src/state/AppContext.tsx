// Clear Board — one provider for the whole app: content library, the single profile, and settings.
// Mirrors the vanilla `ctx` object (profile/content/settings/save/recompute/speak) as React context.
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { freshProfile, loadContent, loadProfile, recomputeMastery, saveProfile } from '../core/store';
import { grade } from '../core/sr';
import type { Content, ContentItem, Profile, Settings } from '../core/types';

const SETTINGS_KEY = 'cb.settings.v1';

function defaultSettings(): Settings {
  return { dys: false, contrast: false, reduce: matchMedia('(prefers-reduced-motion: reduce)').matches, audio: false, big: false };
}
function loadSettings(): Settings {
  try { return { ...defaultSettings(), ...(JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null') || {}) }; }
  catch { return defaultSettings(); }
}

interface AppValue {
  content: Content | null;
  profile: Profile;
  settings: Settings;
  setSetting: (key: keyof Settings, value: boolean) => void;
  resetProgress: () => void;
  recordAnswer: (item: ContentItem, correct: boolean) => void;
  persistProfile: () => void;
  speak: (text: string) => void;
}

const Ctx = createContext<AppValue | null>(null);

export function useApp(): AppValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used inside <AppProvider>');
  return v;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Content | null>(null);
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [profile, setProfile] = useState<Profile>(() => loadProfile(loadSettings()));

  // Load the content library once.
  useEffect(() => { loadContent().then(setContent).catch(() => setContent(null)); }, []);

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
      p.items[item.id] = grade(p.items[item.id], correct);
      const dom = p.domains[item.domain] || (p.domains[item.domain] = { mastery: 0, lastDrill: null });
      dom.lastDrill = new Date().toISOString();
      if (content) recomputeMastery(p, content);
      saveProfile(p);
      return p;
    });
  }, [content]);

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

  return (
    <Ctx.Provider value={{ content, profile, settings, setSetting, resetProgress, recordAnswer, persistProfile, speak }}>
      {children}
    </Ctx.Provider>
  );
}
