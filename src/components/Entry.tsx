// The entry of one item: the body of the Reference entry and of the look-up dialog (ENTRY-ONE;
// 2c-plan C1, U-17). One component, so that the two places show the same words and controls. It
// shows the trust mark, the plain words or a note when the entry has none (U-11), each different
// drawing of a signal one time (U-37), the rule text when the data holds it, a note when an entry of
// the rule book has no rule text (U-11), the source line, and "Read aloud" when that setting is on.
// The trust mark of an item of practice takes its words from its source (U-08). The heading of the
// entry belongs to the place: the panel head of the Reference entry, or the head of the dialog.
//
// `place` gives the class name of the row of drawings, so that each sheet keeps its own rules:
// reference.css styles the Reference entry, shell.css the dialog. Only Reference passes
// `onDrillSignals`: the dialog does not leave the station, so it has no control that does.
import { Signal } from '../stations/Signal';
import { distinctAspects } from '../core/drill';
import type { Citation, ContentItem } from '../core/types';

// The trust mark of an entry: its sign, its words and its tone.
function trustMark(c: Citation): [string, string, 'ok' | 'caution'] {
  if (c.trust === 'verified') return ['✓', 'verified', 'ok'];
  if (c.trust === 'needs-review') return ['⚠', 'not yet verified — reference only', 'caution'];
  return ['●', c.source === 'GOI' ? 'CN practice (GOI), not a CROR rule' : 'No CROR citation in the verified source', 'caution'];
}

// The trust mark as a chip (the entry), or as words in a row of the Reference list (U-02). The sign
// is decoration and the words carry the state. The sign is in its own span with aria-hidden, so a
// screen reader says the words only, also in the name of a Reference row (row U-41, ruling
// SIGN-NAME). The screen shows the sign, a space and the words, as before.
export function TrustMark({ citation, row = false }: { citation: Citation; row?: boolean }) {
  const [sign, words, tone] = trustMark(citation);
  const label = <><span aria-hidden="true">{sign}</span> {words}</>;
  return row
    ? <span className={`cb-reference-trust cb-reference-trust--${tone}`}>{label}</span>
    : <span className={`cb-chip cb-chip--${tone}`}>{label}</span>;
}

export function Entry({ item, place, audio, onSpeak, onDrillSignals }: {
  item: ContentItem;
  place: 'reference' | 'look-up';
  audio: boolean;
  onSpeak: (text: string) => void;
  onDrillSignals?: () => void;
}) {
  const c = item.citation;
  const aspects = item.type === 'signal' ? distinctAspects(item.payload?.aspects ?? []) : [];   // U-37: each drawing one time
  return (
    <>
      <TrustMark citation={c} />
      {/* U-11: an entry with no text says so in app words. */}
      {item.plain
        ? <p className="cb-prose cb-prose--lead">{item.plain}</p>
        : <p className="cb-reference-note">This entry has no text in the app.</p>}
      {aspects.length > 0 && (
        <>
          <div className={place === 'reference' ? 'cb-reference-aspects' : 'cb-shell-lookup-aspects'}>{aspects.slice(0, 8).map((a, idx) => <Signal key={idx} aspect={a} />)}</div>
          <p className="cb-sub">Hardware variants — all the same indication.</p>
          {/* Browsing an aspect was a dead end: the graded read-the-aspect drill already exists at
              /signals, so this is a route into it — not a second answer surface. */}
          {onDrillSignals && <button className="dusk-btn" onClick={onDrillSignals}>Open the Signals drill →</button>}
        </>
      )}
      {c.verbatim && (
        <details className="cb-disclosure">
          <summary>Show the rule text{c.ref ? ` — ${c.ref}` : ''}</summary>
          <blockquote className="cb-quote">{c.verbatim}</blockquote>
        </details>
      )}
      {/* U-11: an entry from the rule book with no rule text says so. An entry of practice has no
          rule to show; its trust mark says so already. */}
      {!c.verbatim && item.plain && c.source === 'CROR' && <p className="cb-reference-note">The rule text is not in the app.</p>}
      <div className="cb-sub">
        Source: {c.source}{c.ref ? ` · ${c.ref}` : ''}{c.relatedRef ? ` · related: ${c.relatedRef}` : ''}
      </div>
      {audio && (
        <button className="dusk-btn" onClick={() => onSpeak(`${item.title}. ${item.plain || ''}. ${c.verbatim || ''}`)}><span aria-hidden="true">🔊</span> Read aloud</button>
      )}
    </>
  );
}
