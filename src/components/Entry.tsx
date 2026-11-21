// The entry of one item, as the look-up dialog shows it (2c-plan C1, U-17). It shows what the
// Reference entry shows: the trust mark, the plain words, the drawings of a signal, the rule text
// when the data holds it, the source line, and "Read aloud" when that setting is on.
//
// It is a copy of the entry of Reference.tsx at 49d3ba0, with three differences. (1) An item with
// the trust "operating-practice" takes its label from its source. A GOI item says "CN practice
// (GOI)"; an item from another source says that no CROR paragraph is cited, with the first part of
// the label that the Radio test shows for it (R4 UX-38). (2) There is no "Drill these aspects"
// control: the dialog does not leave the station. (3) An item with no plain words shows no empty
// paragraph. The heading of the item is the heading of the dialog (LookUp.tsx).
// The Reference entry changes in Wave 2c (rows U-02, U-08, U-11, U-37, job U1-A). When the callers
// switch to the dialog (job U1-D), the two entries must show the same thing: one component for both.
import { Signal } from '../stations/Signal';
import type { ContentItem } from '../core/types';

function trustLabel(item: ContentItem): [string, string] {
  const c = item.citation;
  if (c.trust === 'verified') return ['✓ verified', 'cb-chip--ok'];
  if (c.trust === 'needs-review') return ['⚠ not yet verified — reference only', 'cb-chip--caution'];
  return c.source === 'GOI'
    ? ['● CN practice (GOI), not a CROR rule', 'cb-chip--caution']
    : ['● No CROR citation in the verified source', 'cb-chip--caution'];
}

export function Entry({ item, audio, onSpeak }: { item: ContentItem; audio: boolean; onSpeak: (text: string) => void }) {
  const c = item.citation;
  const aspects = item.type === 'signal' ? item.payload?.aspects ?? [] : [];
  const [label, tone] = trustLabel(item);
  return (
    <>
      <span className={`cb-chip ${tone}`}>{label}</span>
      {item.plain && <p className="cb-prose cb-prose--lead">{item.plain}</p>}
      {aspects.length > 0 && (
        <>
          <div className="cb-shell-lookup-aspects">{aspects.slice(0, 8).map((a, i) => <Signal key={i} aspect={a} />)}</div>
          <p className="cb-sub">Hardware variants — all the same indication.</p>
        </>
      )}
      {c.verbatim && (
        <details className="cb-disclosure">
          <summary>Show the rule text{c.ref ? ` — ${c.ref}` : ''}</summary>
          <blockquote className="cb-quote">{c.verbatim}</blockquote>
        </details>
      )}
      <div className="cb-sub">
        Source: {c.source}{c.ref ? ` · ${c.ref}` : ''}{c.relatedRef ? ` · related: ${c.relatedRef}` : ''}
      </div>
      {audio && (
        <button className="dusk-btn" onClick={() => onSpeak(`${item.title}. ${item.plain || ''}. ${c.verbatim || ''}`)}><span aria-hidden="true">🔊</span> Read aloud</button>
      )}
    </>
  );
}
