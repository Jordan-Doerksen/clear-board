// The look-up dialog (2c-plan C1, U-17; R4 UX-04). lookUp(itemId) of the app context, or of the
// bridge object of an island, opens the entry of the item in a native modal dialog on top of the
// current route. The station under it stays mounted, so the session, the Yard job and the Radio run
// stay. Closing the dialog (Close, Escape) returns focus to the control that opened it.
import { useEffect, useId, useRef } from 'react';
import { useApp } from '../state/AppContext';
import type { LookUpRequest } from '../state/AppContext';
import { Entry } from './Entry';

export function LookUp() {
  const { content, contentFailed, retryContent, lookUpRequest, closeLookUp, settings, speak } = useApp();
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const shown = useRef<LookUpRequest | null>(null);
  const headingId = useId();

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

  const lookedUp = lookUpRequest?.itemId ?? null;
  const item = lookedUp && content ? content.byId[lookedUp] : undefined;
  return (
    <dialog className="cb-dialog cb-shell-lookup" ref={ref} aria-labelledby={headingId} onClose={onClose}>
      <div className="dusk-panel-head">
        <h2 className="dusk-panel-name" id={headingId}>{item ? item.title : 'Reference'}</h2>
        <span className="dusk-spacer" />
        <button className="dusk-btn" onClick={() => ref.current?.close()}>Close</button>
      </div>
      <div className="dusk-panel-body">
        {item
          ? <Entry key={item.id} item={item} audio={settings.audio} onSpeak={speak} />
          : lookedUp && (content && contentFailed.length > 0
            // U-07: the entry is in a part of the library that did not load.
            ? <p className="cb-shell-notice"><span>Part of the library did not load.</span><button className="dusk-btn" onClick={retryContent}>Try again</button></p>
            : <p className="dusk-lede">Loading…</p>)}
      </div>
    </dialog>
  );
}
