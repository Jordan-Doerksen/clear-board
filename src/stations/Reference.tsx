// Reference — look anything up: plain words first, then the source; the rule text one tap deeper where the app holds it. (vanilla reference.js)
import { useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { LibraryNotice } from '../components/LookUp';
import { Entry, TrustMark } from '../components/Entry';
import { DOMAINS } from '../core/store';
import type { ContentItem, ItemType } from '../core/types';

// U-32: the list has one group for each kind of entry, in this order. A group with no row is not shown.
const KINDS: [ItemType, string][] = [
  ['definition', 'Definitions'], ['signal', 'Signals'], ['rule', 'Rules'], ['radio-script', 'Radio calls'], ['scenario', 'Scenarios'],
];
const domainName = (id: string) => DOMAINS.find(d => d.id === id)?.name ?? id;
// U-32: the words that the search reads: the title, the plain words, the source line, the rule text
// and the name of the domain.
const searchText = (i: ContentItem) => [i.title, i.plain, i.citation.source, i.citation.ref, i.citation.relatedRef,
  i.citation.verbatim, domainName(i.domain)].filter(Boolean).join('\n').toLowerCase();

// The trust mark of an entry is TrustMark of src/components/Entry.tsx (ENTRY-ONE). An item of
// operating practice takes its words from its source in the data (U-08): the two labels that the
// Radio test shows for the same items. U-02: each row of the list shows the mark as words, before
// the plain words. The mark follows the name of the domain of the entry (U-32) on one line.

export function Reference() {
  const { content, contentFailed, settings, speak } = useApp();
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

  // Deep link: ?focus=<itemId> opens Reference at the entry of that item (REVAMP §6). Since row
  // U-17, "Look it up" in the Drill, the Radio test and the Yard opens the look-up dialog over the
  // station in place of this route.
  useEffect(() => {
    if (!focusId || !content) return;
    const it = content.byId[focusId];
    if (it) { setSelected(it); setQ(it.title); }
  }, [focusId, content]);

  const items = useMemo(
    () => (content ? content.items.slice().sort((a, b) => a.title.localeCompare(b.title)).map(i => ({ item: i, text: searchText(i) })) : []),
    [content],
  );
  const groups = useMemo(() => {
    const f = q.trim().toLowerCase();
    const rows = items.filter(r => !f || r.text.includes(f)).map(r => r.item);
    return KINDS.map(([type, name]) => ({ type, name, rows: rows.filter(i => i.type === type) })).filter(g => g.rows.length);
  }, [items, q]);

  return (
    <div className="cb-reference-view">
      <button className="cb-btn--plain" onClick={() => navigate('/')}>← Home</button>
      <div className="dusk-top cb-reference-head">
        <div>
          {/* The station heading (U-29, 2c-plan C7). The icon is decoration. aria-hidden keeps it out
              of the spoken name, so a screen reader says "Reference", as on the other stations. The
              screen shows the icon as before (ruling HEAD-ONE, finding F-14). */}
          <h2 className="dusk-title cb-reference-title"><span className="dusk-ico" aria-hidden="true">📖</span> Reference</h2>
          <p className="dusk-lede">Look anything up. Plain words first, then the source. Where the app holds the rule text, it is one tap deeper.</p>
        </div>
      </div>
      <input className="cb-input" data-cb="ref-search" type="search" placeholder="Search a term…" aria-label="Search reference"
        value={q} onChange={e => setQ(e.target.value)} />

      {groups.length
        ? groups.map(g => (
          <div key={g.type} className="cb-reference-group">
            <h3 className="dusk-grp cb-reference-group-name">{g.name}</h3>
            <ul className="dusk-rows cb-reference-list" role="list">
              {g.rows.map(i => (
                <li key={i.id}>
                  <button className="dusk-row cb-reference-row" data-cb="ref-row" aria-expanded={selected?.id === i.id} onClick={() => press(i)}>
                    <b>{i.title}</b>
                    <span className="cb-reference-meta">{domainName(i.domain)} · <TrustMark citation={i.citation} row /></span>
                    <small className="cb-sub">{i.plain}</small>
                  </button>
                  {selected?.id === i.id && <Detail key={i.id} item={i} audio={settings.audio} onSpeak={speak}
                    onDrillSignals={() => navigate('/signals')} headRef={entryHeadRef} />}
                </li>
              ))}
            </ul>
          </div>
        ))
        // U-07 (2c-plan C9): with no entry loaded, "No match" would not be true. The notice of the
        // shell says what happened, with its retry control.
        // While the library loads, "No match" would not be true (finding F-5 of the last review of
        // Wave 2c; fence item 15): the list says "Loading…", as the other stations do.
        : !content
          ? <p className="dusk-lede">Loading…</p>
          : items.length === 0 && contentFailed.length > 0
            ? <LibraryNotice />
            : <p className="dusk-lede">No match. Try another word.</p>}
    </div>
  );
}

// The Reference entry: a framed panel with the title in its head and the one entry component in its
// body (ENTRY-ONE). The look-up dialog shows the same component under its own head.
function Detail({ item, audio, onSpeak, onDrillSignals, headRef }:
  { item: ContentItem; audio: boolean; onSpeak: (t: string) => void; onDrillSignals: () => void; headRef: RefObject<HTMLHeadingElement | null> }) {
  return (
    <div className="dusk-panel dusk-panel--framed cb-reference-detail" data-cb="ref-detail">
      <div className="dusk-panel-head"><h4 className="dusk-panel-name" ref={headRef} tabIndex={-1}>{item.title}</h4></div>
      <div className="dusk-panel-body">
        <Entry item={item} place="reference" audio={audio} onSpeak={onSpeak} onDrillSignals={onDrillSignals} />
      </div>
    </div>
  );
}
