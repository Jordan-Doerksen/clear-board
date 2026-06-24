// Clear Board — Drill station. Adaptive (SM-2-lite) MC across content types; updates mastery → the path.
// Definitions → term↔definition MC. Signals → read-the-aspect MC. One loop, one profile.
import { grade, isDue } from '../core/sr.js';
import { gradable, DOMAINS } from '../core/store.js';
import { drawSignal } from './signal-render.js';

const shuffle = a => { const x = a.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; };
const esc = s => (s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function mount(root, ctx, opts = {}) {
  // Pool: verified-only (F1) items, filtered to one domain or across all live domains.
  let items = [];
  if (opts.domain) items = gradable(ctx.content.byDomain[opts.domain]);
  else for (const d of DOMAINS.filter(d => d.live)) items.push(...gradable(ctx.content.byDomain[d.id]));
  // signals need a renderable aspect to be drillable
  items = items.filter(i => i.type !== 'signal' || (i.payload && i.payload.aspects && i.payload.aspects.length));

  if (items.length < 4) {
    root.innerHTML = `<button class="back" data-go="">← Home</button><p class="muted">Not enough verified content to drill yet.</p>`;
    root.addEventListener('click', e => { const g = e.target.closest('[data-go]'); if (g) ctx.go(g.dataset.go); });
    return;
  }

  const byType = {};
  for (const i of items) (byType[i.type] ||= []).push(i);

  const due = items.filter(i => isDue(ctx.profile.items[i.id]));
  const chosen = shuffle(due.length ? due : items).slice(0, 10);

  let idx = 0, score = 0;
  const drilledDomains = [...new Set(chosen.map(i => i.domain))];
  const startMastery = Object.fromEntries(drilledDomains.map(d => [d, ctx.profile.domains[d]?.mastery || 0]));

  function distractors(item, fieldFn) {
    const same = (byType[item.type] || items).filter(o => o.id !== item.id);
    let opts = shuffle(same).slice(0, 3).map(fieldFn);
    if (opts.length < 3) opts = opts.concat(shuffle(items.filter(o => o.id !== item.id)).slice(0, 3 - opts.length).map(fieldFn));
    return opts;
  }

  function buildQ(item) {
    if (item.type === 'signal') {
      const aspects = item.payload.aspects;
      const spec = aspects[Math.floor(Math.random() * aspects.length)];
      const correct = item.title;
      const options = shuffle([correct, ...distractors(item, o => o.title)]);
      return { kind: 'signal', svg: drawSignal(spec), heading: 'What signal is this?', correct, options };
    }
    const dir = Math.random() < 0.5 ? 'term' : 'def';
    const field = it => (dir === 'term' ? (it.plain || it.citation.verbatim) : it.title);
    const promptText = dir === 'term' ? item.title : (item.plain || item.citation.verbatim);
    const correct = field(item);
    const options = shuffle([correct, ...distractors(item, field)]);
    return { kind: 'text', heading: dir === 'term' ? 'What does this mean?' : 'Which term is this?', promptText, correct, options };
  }

  function render() {
    if (idx >= chosen.length) return finish();
    const item = chosen[idx];
    const q = buildQ(item);
    root.innerHTML = `
      <button class="back" data-go="">← Home</button>
      <div class="drill-top"><span class="muted">Question ${idx + 1} of ${chosen.length}</span><span class="muted">${score} correct</span></div>
      <h2 class="view-title">${q.heading}</h2>
      <div class="prompt ${q.kind === 'signal' ? 'prompt-signal' : ''}">${q.kind === 'signal' ? q.svg : esc(q.promptText)}</div>
      <div class="opts">${q.options.map(o => `<button class="opt" data-val="${esc(o)}">${esc(o)}</button>`).join('')}</div>
      <div class="feedback" hidden aria-live="polite"></div>`;
    if (ctx.settings.audio && q.kind === 'text') ctx.speak(q.promptText);

    const opts = root.querySelector('.opts');
    const fb = root.querySelector('.feedback');
    opts.addEventListener('click', e => {
      const b = e.target.closest('.opt'); if (!b || opts.dataset.done) return;
      opts.dataset.done = '1';
      const ok = b.dataset.val === q.correct;
      if (ok) score++;
      ctx.profile.items[item.id] = grade(ctx.profile.items[item.id], ok);
      const dom = ctx.profile.domains[item.domain] || (ctx.profile.domains[item.domain] = { mastery: 0, lastDrill: null });
      dom.lastDrill = new Date().toISOString();
      ctx.recompute();
      opts.querySelectorAll('.opt').forEach(o => { if (o.dataset.val === q.correct) o.classList.add('right'); else if (o === b) o.classList.add('wrong'); o.disabled = true; });
      fb.hidden = false;
      const c = item.citation;
      fb.innerHTML = `<b class="${ok ? 'fb-ok' : 'fb-no'}">${ok ? 'Right.' : 'Not quite.'}</b>
        <span><b>${esc(item.title)}</b> — ${esc(item.plain || c.verbatim)}</span>
        <span class="cite">${esc(c.source)}${c.ref ? ' · ' + esc(c.ref) : ''}</span>
        <button class="iconbtn next" id="next">${idx + 1 < chosen.length ? 'Next →' : 'Finish'}</button>`;
      fb.querySelector('#next').addEventListener('click', () => { idx++; render(); });
      fb.querySelector('#next').focus();
    });
    root.querySelector('[data-go]').addEventListener('click', () => ctx.go(''));
  }

  function finish() {
    const lines = drilledDomains.map(d => {
      const name = (DOMAINS.find(x => x.id === d) || {}).name || d;
      const end = ctx.profile.domains[d]?.mastery || 0;
      const delta = Math.round((end - startMastery[d]) * 100);
      return `${name}: ${delta >= 0 ? '+' : ''}${delta}% → ${Math.round(end * 100)}%`;
    }).join(' · ');
    root.innerHTML = `
      <button class="back" data-go="">← Home</button>
      <h2 class="view-title">Session done</h2>
      <p class="big-score">${score} / ${chosen.length}</p>
      <p class="muted">${lines}. Spaced out over the next days so it sticks.</p>
      <div class="opts"><button class="opt" id="again">Drill again</button><button class="opt" data-go="">Back to the path</button></div>`;
    root.querySelector('#again').addEventListener('click', () => mount(root, ctx, opts));
    root.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => ctx.go('')));
  }

  render();
}
