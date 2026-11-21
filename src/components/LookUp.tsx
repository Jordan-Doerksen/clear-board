// The look-up dialog (2c-plan C1, U-17; R4 UX-04). lookUp(itemId) of the app context, or of the
// bridge object of an island, opens the entry of the item in a native modal dialog on top of the
// current route. The station under it stays mounted, so the session, the Yard job and the Radio run
// stay. Closing the dialog (Close, Escape) returns focus to the control that opened it.
import { useEffect, useId, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import type { LookUpRequest } from '../state/AppContext';
import { Entry } from './Entry';

// U-07 (2c-plan C9): the notice of the shell, with its retry control, for a place in the page that
// shows nothing true while a content file did not load: the look-up dialog, the Drill, Reference
// and the Radio test. The words are the words of the shell notice (App.tsx).
export function LibraryNotice() {
  const { retryContent } = useApp();
  return <p className="cb-shell-notice"><span>Part of the library did not load.</span><button className="dusk-btn" onClick={retryContent}>Try again</button></p>;
}

export function LookUp() {
  const { content, contentFailed, lookUpRequest, closeLookUp, settings, speak } = useApp();
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const shown = useRef<LookUpRequest | null>(null);
  const headingId = useId();
  const location = useLocation();

  // A change of route (the browser Back, for example) closes the dialog: its entry belongs to the
  // station that asked for it (finding F-4 of the last review of Wave 2c). This effect runs before the
  // effect of the shell, which then moves focus to the heading of the new view (contract C7), so
  // focus does not return to the control of the old station.
  useEffect(() => {
    const dialog = ref.current;
    if (dialog?.open) { opener.current = null; dialog.close(); }
  }, [location.pathname]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (lookUpRequest) {
      shown.current = lookUpRequest;
      if (!dialog.open) {
        // The control that has focus now is the control that asked for the look-up.
        opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        dialog.showModal();
      }
    } else if (dialog.open) dialog.close();
  }, [lookUpRequest]);

  // The close event comes after Close, Escape and a close by the app, in a later task. A new
  // look-up can come before it: the event then clears only the request that it closes.
  function onClose() {
    if (shown.current) closeLookUp(shown.current);
    if (ref.current?.open) return;
    const back = opener.current;
    opener.current = null;
    if (back && back.isConnected) back.focus();
  }

  // The head of the dialog stays at its top edge (job U1-B), and a long name takes more lines at a
  // narrow width. The dialog gets the height of its head, so that the scroll keeps a control that has
  // focus below the head (finding F-6 of the last review of Wave 2c; the rule of .cb-dialog).
  useEffect(() => {
    const dialog = ref.current;
    const head = dialog?.querySelector<HTMLElement>('.dusk-panel-head');
    if (!dialog || !head || typeof ResizeObserver === 'undefined') return;
    const fit = () => dialog.style.setProperty('--cb-dialog-head', `${head.offsetHeight}px`);
    const watch = new ResizeObserver(fit);
    watch.observe(head);
    fit();
    return () => watch.disconnect();
  }, []);

  const lookedUp = lookUpRequest?.itemId ?? null;
  const item = lookedUp && content ? content.byId[lookedUp] : undefined;

  // When the entry comes after a "Try again" in the dialog, the control that had focus goes, and
  // focus fell to the page body. It now goes to the heading of the dialog (finding F-7 of the last
  // review of Wave 2c).
  const itemId = item?.id ?? null;
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog?.open || !itemId) return;
    const active = document.activeElement;
    if (active && active !== document.body && dialog.contains(active)) return;
    const heading = dialog.querySelector('h2');
    if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus(); }
  }, [itemId]);
  return (
    <dialog className="cb-dialog cb-shell-lookup" ref={ref} aria-labelledby={headingId} onClose={onClose}>
      <div className="dusk-panel-head">
        <h2 className="dusk-panel-name" id={headingId}>{item ? item.title : 'Reference'}</h2>
        <span className="dusk-spacer" />
        <button className="dusk-btn" onClick={() => ref.current?.close()}>Close</button>
      </div>
      <div className="dusk-panel-body">
        {item
          ? <Entry key={item.id} item={item} place="look-up" audio={settings.audio} onSpeak={speak} />
          : lookedUp && (content && contentFailed.length > 0
            // U-07: the entry is in a part of the library that did not load.
            ? <LibraryNotice />
            : <p className="dusk-lede">Loading…</p>)}
      </div>
    </dialog>
  );
}
