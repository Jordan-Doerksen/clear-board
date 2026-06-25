// Reference — look anything up: plain words first, the rule text one tap deeper, always cited. (vanilla reference.js)
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { Signal } from './Signal';
import type { ContentItem, Trust } from '../core/types';

const TRUST: Record<Trust, [string, string]> = {
  'verified':           ['✓ verified', 'clear'],
  'needs-review':       ['⚠ not yet verified — reference only', 'caution'],
  'operating-practice': ['● CN practice (GOI), not a CROR rule', 'caution'],
};

function Badge({ trust }: { trust: Trust }) {
  const [label, cls] = TRUST[trust] || ['', ''];
  return <span className={`badge ${cls}`}>{label}</span>;
}

export function Reference() {
  const { content, settings, speak } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const focusId = params.get('focus');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<ContentItem | null>(null);

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
    <>
      <button className="back" onClick={() => navigate('/')}>← Home</button>
      <h2 className="view-title">📖 Reference</h2>
      <p className="muted">Look anything up. Plain words first — the rule text is one tap deeper, always cited.</p>
      <input className="search" type="search" placeholder="Search a term…" aria-label="Search reference"
        value={q} onChange={e => setQ(e.target.value)} />

      <div className="ref-list" role="list">
        {rows.length
          ? rows.map(i => (
            <button key={i.id} className="ref-row" role="listitem" onClick={() => setSelected(i)}>
              <b>{i.title}</b><small>{i.plain}</small>
            </button>
          ))
          : <p className="muted">No match. Try another word.</p>}
      </div>

      {selected && <Detail key={selected.id} item={selected} audio={settings.audio} onSpeak={speak} />}
    </>
  );
}

function Detail({ item, audio, onSpeak }: { item: ContentItem; audio: boolean; onSpeak: (t: string) => void }) {
  const c = item.citation;
  const aspects = item.type === 'signal' ? item.payload?.aspects ?? [] : [];
  return (
    <div className="ref-detail" aria-live="polite">
      <h3>{item.title}</h3>
      <Badge trust={c.trust} />
      <p className="plain">{item.plain}</p>
      {aspects.length > 0 && (
        <>
          <div className="aspects">{aspects.slice(0, 8).map((a, idx) => <Signal key={idx} aspect={a} />)}</div>
          <p className="muted small">Hardware variants — all the same indication.</p>
        </>
      )}
      {c.verbatim && (
        <details>
          <summary>Show the rule text{c.ref ? ` — ${c.ref}` : ''}</summary>
          <blockquote>{c.verbatim}</blockquote>
        </details>
      )}
      <div className="cite">
        Source: {c.source}{c.ref ? ` · ${c.ref}` : ''}{c.relatedRef ? ` · related: ${c.relatedRef}` : ''}
      </div>
      {audio && (
        <button className="iconbtn" onClick={() => onSpeak(`${item.title}. ${item.plain || ''}. ${c.verbatim || ''}`)}>🔊 Read aloud</button>
      )}
    </div>
  );
}
