// Settings — accessibility is core, not polish (SPEC Principle 4). A native <dialog> so ::backdrop works.
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useApp } from '../state/AppContext';
import { progressFile, readProgressFile, saveTextFile } from '../core/store';
import type { Settings as SettingsType } from '../core/types';

const TOGGLES: { key: keyof SettingsType; label: string; sub: string }[] = [
  { key: 'dys', label: 'Dyslexia-friendly text', sub: 'Clearer font + looser spacing' },
  { key: 'contrast', label: 'Higher contrast', sub: 'Brighter text on dark' },
  { key: 'reduce', label: 'Reduce motion', sub: 'No animations' },
  { key: 'audio', label: 'Read aloud', sub: 'Speak rules & questions (where supported)' },
  { key: 'big', label: 'Bigger text', sub: 'Scales the whole app' },
];

export function Settings({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { settings, choices, deviceReduce, deviceContrast, setSetting, resetProgress, replaceProgress, speak, profile } = useApp();
  const ref = useRef<HTMLDialogElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileNote, setFileNote] = useState('');

  // U-18: the file stays on this device. Nothing is sent anywhere.
  function saveProgress() {
    const file = progressFile(profile, choices);
    saveTextFile(file.name, file.text);
    setFileNote('');
  }
  async function loadProgress(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const loaded = readProgressFile(await file.text(), choices);
    if (!loaded) {
      setFileNote('This file is not a Clear Board progress file. Nothing changed.');
      return;
    }
    if (!confirm('Replace your progress on this device with the progress in this file? This cannot be undone.')) return;
    replaceProgress(loaded.profile, loaded.settings);
    setFileNote(loaded.settings ? 'Your progress and your settings are loaded from the file.' : 'Your progress is loaded from the file.');
  }

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
    <dialog className="cb-dialog cb-settings-view" id="settings" ref={ref} aria-label="Settings" onClose={onClose} onCancel={onClose}>
      <div className="dusk-panel-head"><h2 className="dusk-panel-name">Settings</h2><span className="dusk-spacer" /><button className="dusk-btn" onClick={onClose}>Done</button></div>
      <div className="dusk-panel-body">
        <div className="cb-settings-sample">
          <span className="cb-settings-aa">Aa</span>
          <div><b>The quick brown fox jumps.</b><small>Rule 112 — secure unattended equipment. This preview reflects your settings live.</small></div>
        </div>
        {TOGGLES.map(t => {
          // U-13: while the device asks for less motion, motion stays reduced. The toggle shows it
          // on, cannot be changed, and says why. It stays in the tab order, so that each learner
          // can reach it and hear the reason.
          const locked = t.key === 'reduce' && deviceReduce;
          const reason = locked ? 'Your device asks for less motion, so this stays on.'
            : t.key === 'contrast' && deviceContrast ? 'Your device asks for more contrast.' : '';
          return (
            <div className="cb-setrow" key={t.key}>
              <div>
                <label htmlFor={`t-${t.key}`}>{t.label}</label><small id={`t-${t.key}-sub`}>{t.sub}</small>
                {reason && <small id={`t-${t.key}-why`}>{reason}</small>}
              </div>
              <span className="cb-toggle">
                <input type="checkbox" id={`t-${t.key}`} aria-describedby={reason ? `t-${t.key}-sub t-${t.key}-why` : `t-${t.key}-sub`} aria-disabled={locked || undefined}
                  checked={settings[t.key]} onChange={e => { if (!locked) toggle(t.key, e.target.checked); }} />
                <i />
              </span>
            </div>
          );
        })}
        <div className="cb-setrow">
          <div><span className="cb-settings-label">Save my progress</span><small>Keep a copy in a file on this device</small></div>
          <button className="dusk-btn" onClick={saveProgress}>Save to a file</button>
        </div>
        <div className="cb-setrow">
          <div>
            <span className="cb-settings-label">Load my progress</span><small>Replace the progress on this device with a saved file</small>
            <small className="cb-settings-filenote" role="status">{fileNote}</small>
          </div>
          <button className="dusk-btn" onClick={() => fileRef.current?.click()}>Load a file</button>
          <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={loadProgress} />
        </div>
        <div className="cb-setrow">
          <div><span className="cb-settings-label">Reset my progress</span><small>Clear mastery, drills &amp; yard wins on this device</small></div>
          <button className="cb-btn--attn" onClick={() => {
            if (confirm('Reset all your progress on this device? Mastery, drills and yard wins will be cleared. This cannot be undone.')) {
              resetProgress();
              onClose();
            }
          }}>Reset</button>
        </div>
        <p className="dusk-note">Everything is saved only on this device — no account, nothing sent anywhere.</p>
        <p className="dusk-note">A clean-up of the data of this site in the browser deletes your progress.</p>
      </div>
    </dialog>
  );
}
