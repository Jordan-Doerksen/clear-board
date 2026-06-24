// Clear Board — Drill station. Adaptive (SM-2-lite) MC over verified content; updates mastery → the path.
import { grade, isDue } from '../core/sr.js';
import { gradable } from '../core/store.js';

const shuffle = a => { const x = a.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; };
const esc = s => (s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function mount(root, ctx) {
  const pool = gradable(ctx.content.byDomain['definitions']);
  if (pool.length < 4) {
    root.innerHTML = `<button class="back" data-go="">← Home</button><p class="muted">Not enough verified content to drill yet.</p>`;
    root.addEventListener('click', e => { const g = e.target.closest('[data-go]'); if (g) ctx.go(g.dataset.go); });
    return;
  }

  // Session: prefer items that are due (SM-2), else least-recently-seen; cap at 10.
  const withState = pool.map(i => ({ i, st: ctx.profile.items[i.id] }));
  const due = withState.filter(x => isDue(x.st));
  const chosen = shuffle(due.length ? due : withState).slice(0, 10).map(x => x.i);

  let idx = 0, score = 0;
  const startMastery = ctx.profile.domains['definitions']?.mastery || 0;

  function question(item) {
    const dir = Math.random() < 0.5 ? 'term' : 'def';            // term→def or def→term
    const field = it => (dir === 'term' ? (it.plain || it.citation.verbatim) : it.title);
    const promptText = dir === 'term' ? item.title : (item.plain || item.citation.verbatim);
    const correct = field(item);
    const distractors = shuffle(pool.filter(o => o.id !== item.id)).slice(0, 3).map(field);
    const options = shuffle([correct, ...distractors]);
    return { dir, promptText, correct, options };
  }

  function render() {
    if (idx >= chosen.length) return finish();
    const item = chosen[idx];
    const q = question(item);
    root.innerHTML = `
      <button class="back" data-go="">← Home</button>
      <div class="drill-top"><span class="muted">Question ${idx + 1} of ${chosen.length}</span><span class="muted">${score} correct</span></div>
      <h2 class="view-title">${q.dir === 'term' ? 'What does this mean?' : 'Which term is this?'}</h2>
      <div class="prompt">${esc(q.promptText)}</div>
      <div class="opts">${q.options.map(o => `<button class="opt" data-val="${esc(o)}">${esc(o)}</button>`).join('')}</div>
      <div class="feedback" hidden aria-live="polite"></div>`;
    if (ctx.settings.audio) ctx.speak(q.promptText);

    const opts = root.querySelector('.opts');
    const fb = root.querySelector('.feedback');
    opts.addEventListener('click', e => {
      const b = e.target.closest('.opt'); if (!b || opts.dataset.done) return;
      opts.dataset.done = '1';
      const ok = b.dataset.val === q.correct;
      if (ok) score++;
      // record SM-2 + mastery
      ctx.profile.items[item.id] = grade(ctx.profile.items[item.id], ok);
      ctx.profile.domains['definitions'].lastDrill = new Date().toISOString();
      ctx.recompute();
      opts.querySelectorAll('.opt').forEach(o => {
        if (o.dataset.val === q.correct) o.classList.add('right');
        else if (o === b) o.classList.add('wrong');
        o.disabled = true;
      });
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
    const end = ctx.profile.domains['definitions']?.mastery || 0;
    const delta = Math.round((end - startMastery) * 100);
    root.innerHTML = `
      <button class="back" data-go="">← Home</button>
      <h2 class="view-title">Session done</h2>
      <p class="big-score">${score} / ${chosen.length}</p>
      <p class="muted">"The words" mastery ${delta >= 0 ? '+' : ''}${delta}% → now ${Math.round(end * 100)}%. Spaced out over the next days so it sticks.</p>
      <div class="opts"><button class="opt" id="again">Drill again</button><button class="opt" data-go="">Back to the path</button></div>`;
    root.querySelector('#again').addEventListener('click', () => mount(root, ctx));
    root.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => ctx.go('')));
  }

  render();
}
