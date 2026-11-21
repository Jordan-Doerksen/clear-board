// Reference — look anything up: plain words first, the rule text one tap deeper, always cited. (vanilla reference.js)
import { useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { Signal } from './Signal';
import { distinctAspects } from '../core/drill';
import type { Citation, ContentItem } from '../core/types';

// The trust mark of an entry, as words, and its tone. An item of operating practice takes its words
// from its source in the data (U-08): the two labels that the Radio test shows for the same items.
function trustMark(c: Citation): [string, 'ok' | 'caution'] {
  if (c.trust === 'verified') return ['✓ verified', 'ok'];
  if (c.trust === 'needs-review') return ['⚠ not yet verified — reference only', 'caution'];
  return [c.source === 'GOI' ? '● CN practice (GOI), not a CROR rule' : '● No CROR citation in the verified source', 'caution'];
}

function Badge({ citation }: { citation: Citation }) {
  const [label, tone] = trustMark(citation);
  return <span className={`cb-chip cb-chip--${tone}`}>{label}</span>;
}

// U-02: each row of the list shows the trust mark of its entry as words, before the plain words.
function RowMark({ citation }: { citation: Citation }) {
  const [label, tone] = trustMark(citation);
  return <span className={`cb-reference-trust cb-reference-trust--${tone}`}>{label}</span>;
}

export function Reference() {
  const { content, settings, speak } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const focusId = params.get('focus');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<ContentItem | null>(null);

  // U-03: a pressed row opens its entry directly under the row, and focus moves to the title of the
  // entry. A second press on the open row closes it. The entry is a part of its row, so a search that
  // drops the row drops the entry too.
  const entryHeadRef = useRef<HTMLHeadingElement>(null);
  const focusEntry = useRef(false);
  useEffect(() => {
    const head = entryHeadRef.current;
    if (!focusEntry.current || !head) return;
    focusEntry.current = false;
    head.closest('[data-cb="ref-detail"]')?.scrollIntoView({ block: 'nearest' });
    head.focus({ preventScroll: true });
  });
  const press = (i: ContentItem) => {
    if (selected?.id === i.id) { setSelected(null); return; }
    focusEntry.current = true;
    setSelected(i);
  };

  // Deep link: a Drill miss or a Yard refusal opens Reference focused on the exact rule
  // (REVAMP §6 — every error one tap from the plain-language rule). ?focus=<itemId>.
  useEffect(() => {
    if (!focusId || !content) return;
    const it = content.byId[focusId];
    if (it) { setSelected(it); setQ(it.title); }
  }, [focusId, content]);

  const items = useMemo(
    () => (content ? content.items.slice().sort((a, b) => a.title.localeCompare(b.title)) : []),
    [content],
  );
  const rows = useMemo(() => {
    const f = q.trim().toLowerCase();
    return items.filter(i => !f || i.title.toLowerCase().includes(f) || (i.plain || '').toLowerCase().includes(f));
  }, [items, q]);

  return (
    <div className="cb-reference-view">
      <button className="cb-btn--plain" onClick={() => navigate('/')}>← Home</button>
      <div className="dusk-top cb-reference-head">
        <div>
          <h2 className="dusk-title cb-reference-title"><span className="dusk-ico">📖</span> Reference</h2>
          <p className="dusk-lede">Look anything up. Plain words first — the rule text is one tap deeper, always cited.</p>
        </div>
      </div>
      <input className="cb-input" data-cb="ref-search" type="search" placeholder="Search a term…" aria-label="Search reference"
        value={q} onChange={e => setQ(e.target.value)} />

      {rows.length
        ? (
          <ul className="dusk-rows cb-reference-list" role="list">
            {rows.map(i => (
              <li key={i.id}>
                <button className="dusk-row cb-reference-row" data-cb="ref-row" aria-expanded={selected?.id === i.id} onClick={() => press(i)}>
                  <b>{i.title}</b><RowMark citation={i.citation} /><small className="cb-sub">{i.plain}</small>
                </button>
                {selected?.id === i.id && <Detail key={i.id} item={i} audio={settings.audio} onSpeak={speak}
                  onDrillSignals={() => navigate('/signals')} headRef={entryHeadRef} />}
              </li>
            ))}
          </ul>
        )
        : <p className="dusk-lede">No match. Try another word.</p>}
    </div>
  );
}

function Detail({ item, audio, onSpeak, onDrillSignals, headRef }:
  { item: ContentItem; audio: boolean; onSpeak: (t: string) => void; onDrillSignals: () => void; headRef: RefObject<HTMLHeadingElement | null> }) {
  const c = item.citation;
  const aspects = item.type === 'signal' ? distinctAspects(item.payload?.aspects ?? []) : [];   // U-37: each drawing one time
  return (
    <div className="dusk-panel dusk-panel--framed cb-reference-detail" data-cb="ref-detail">
      <div className="dusk-panel-head"><h3 className="dusk-panel-name" ref={headRef} tabIndex={-1}>{item.title}</h3></div>
      <div className="dusk-panel-body">
        <Badge citation={c} />
        <p className="cb-prose cb-prose--lead">{item.plain}</p>
        {aspects.length > 0 && (
          <>
            <div className="cb-reference-aspects">{aspects.slice(0, 8).map((a, idx) => <Signal key={idx} aspect={a} />)}</div>
            <p className="cb-sub">Hardware variants — all the same indication.</p>
            {/* Browsing an aspect was a dead end: the graded read-the-aspect drill already exists at
                /signals, so this is a route into it — not a second answer surface. */}
            <button className="dusk-btn" onClick={onDrillSignals}>Open the Signals drill →</button>
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
      </div>
    </div>
  );
}
