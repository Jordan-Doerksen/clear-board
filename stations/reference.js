// Clear Board — Reference station. Look anything up: plain words first, rule text one tap deeper, always cited.
const TRUST = {
  'verified':           ['✓ verified',                              'clear'],
  'needs-review':       ['⚠ not yet verified — reference only',     'caution'],
  'operating-practice': ['● CN practice (GOI), not a CROR rule',    'caution'],
};

export function mount(root, ctx) {
  root.innerHTML = `
    <button class="back" data-go="">← Home</button>
    <h2 class="view-title">📖 Reference</h2>
    <p class="muted">Look anything up. Plain words first — the rule text is one tap deeper, always cited.</p>
    <input id="ref-q" class="search" type="search" placeholder="Search a term…" aria-label="Search reference">
    <div id="ref-list" class="ref-list" role="list"></div>
    <div id="ref-detail" class="ref-detail" hidden aria-live="polite"></div>`;

  const items = ctx.content.items.slice().sort((a, b) => a.title.localeCompare(b.title));
  const listEl = root.querySelector('#ref-list');
  const detailEl = root.querySelector('#ref-detail');

  const esc = s => (s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const badge = c => { const [label, cls] = TRUST[c.trust] || ['', '']; return `<span class="badge ${cls}">${label}</span>`; };

  function renderList(filter) {
    const f = (filter || '').trim().toLowerCase();
    const rows = items.filter(i => !f || i.title.toLowerCase().includes(f) || (i.plain || '').toLowerCase().includes(f));
    listEl.innerHTML = rows.length
      ? rows.map(i => `<button class="ref-row" role="listitem" data-id="${i.id}"><b>${esc(i.title)}</b><small>${esc(i.plain)}</small></button>`).join('')
      : `<p class="muted">No match. Try another word.</p>`;
  }
  function showDetail(i) {
    detailEl.hidden = false;
    const c = i.citation;
    detailEl.innerHTML = `
      <h3>${esc(i.title)}</h3>
      ${badge(c)}
      <p class="plain">${esc(i.plain)}</p>
      ${c.verbatim ? `<details><summary>Show the rule text${c.ref ? ' — ' + esc(c.ref) : ''}</summary><blockquote>${esc(c.verbatim)}</blockquote></details>` : ''}
      <div class="cite">Source: ${esc(c.source)}${c.ref ? ' · ' + esc(c.ref) : ''}${c.relatedRef ? ' · related: ' + esc(c.relatedRef) : ''}</div>
      ${ctx.settings.audio ? `<button class="iconbtn" id="ref-say">🔊 Read aloud</button>` : ''}`;
    detailEl.scrollIntoView({ behavior: ctx.settings.reduce ? 'auto' : 'smooth', block: 'nearest' });
    const say = detailEl.querySelector('#ref-say');
    if (say) say.addEventListener('click', () => ctx.speak(`${i.title}. ${i.plain || ''}. ${c.verbatim || ''}`));
  }

  renderList('');
  root.querySelector('#ref-q').addEventListener('input', e => renderList(e.target.value));
  listEl.addEventListener('click', e => { const b = e.target.closest('[data-id]'); if (b) showDetail(ctx.content.byId[b.dataset.id]); });
  root.addEventListener('click', e => { const g = e.target.closest('[data-go]'); if (g) ctx.go(g.dataset.go); });
}
