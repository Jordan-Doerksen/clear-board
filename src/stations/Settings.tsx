// Settings — accessibility is core, not polish (SPEC Principle 4). A native <dialog> so ::backdrop works.
import { useEffect, useRef } from 'react';
import { useApp } from '../state/AppContext';
import type { Settings as SettingsType } from '../core/types';

const TOGGLES: { key: keyof SettingsType; label: string; sub: string }[] = [
  { key: 'dys', label: 'Dyslexia-friendly text', sub: 'Clearer font + looser spacing' },
  { key: 'contrast', label: 'Higher contrast', sub: 'Brighter text on dark' },
  { key: 'reduce', label: 'Reduce motion', sub: 'No animations' },
  { key: 'audio', label: 'Read aloud', sub: 'Speak rules & questions (where supported)' },
  { key: 'big', label: 'Bigger text', sub: 'Scales the whole app' },
];

export function Settings({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { settings, setSetting, resetProgress, speak } = useApp();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    else if (!open && dlg.open) dlg.close();
  }, [open]);

  function toggle(key: keyof SettingsType, value: boolean) {
    setSetting(key, value);
    if (key === 'audio' && value) speak('Read aloud is on. Definitions, rules and questions will be read to you.');
  }

  return (
    <dialog id="settings" ref={ref} aria-label="Settings" onClose={onClose} onCancel={onClose}>
      <div className="set-h"><h2>Settings</h2><button className="iconbtn" onClick={onClose}>Done</button></div>
      <div className="set-body">
        <div className="set-sample">
          <span className="ss-aa">Aa</span>
          <div><b>The quick brown fox jumps.</b><small>Rule 112 — secure unattended equipment. This preview reflects your settings live.</small></div>
        </div>
        {TOGGLES.map(t => (
          <div className="row" key={t.key}>
            <div><label htmlFor={`t-${t.key}`}>{t.label}</label><small>{t.sub}</small></div>
            <span className="sw">
              <input type="checkbox" id={`t-${t.key}`} checked={settings[t.key]} onChange={e => toggle(t.key, e.target.checked)} />
              <i />
            </span>
          </div>
        ))}
        <div className="row">
          <div><label>Reset my progress</label><small>Clear mastery, drills &amp; yard wins on this device</small></div>
          <button className="iconbtn danger" onClick={() => {
            if (confirm('Reset all your progress on this device? Mastery, drills and yard wins will be cleared. This cannot be undone.')) {
              resetProgress();
              onClose();
            }
          }}>Reset</button>
        </div>
        <p className="set-note">Everything is saved only on this device — no account, nothing sent anywhere.</p>
      </div>
    </dialog>
  );
}
