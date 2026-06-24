// Clear Board — app shell: settings, profile/content boot, hash routing, home (the qualification path).
import * as store from './core/store.js';
import * as reference from './stations/reference.js';
import * as drill from './stations/drill.js';

const SETTINGS_KEY = 'cb.settings.v1';
const docEl = document.documentElement;
const defaults = { dys: false, contrast: false, reduce: matchMedia('(prefers-reduced-motion: reduce)').matches, audio: false, big: false };

let settings = loadSettings();
let profile, content;

function loadSettings() { try { return { ...defaults, ...(JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}) }; } catch { return { ...defaults }; } }
function saveSettings() { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch {} }
function applySettings() {
  docEl.dataset.dys = settings.dys ? '1' : '0';
  docEl.dataset.contrast = settings.contrast ? '1' : '0';
  docEl.dataset.reduce = settings.reduce ? '1' : '0';
  docEl.style.setProperty('--fs', settings.big ? '18.5px' : '16px');
}
function speak(text) { if (!settings.audio) return; try { speechSynthesis.cancel(); speechSynthesis.speak(new SpeechSynthesisUtterance(text)); } catch {} }
function go(route) { location.hash = route ? '#/' + route : '#/'; }

const ctx = () => ({
  profile, content, settings,
  save: () => store.saveProfile(profile),
  recompute: () => { store.recomputeMastery(profile, content); store.saveProfile(profile); },
  speak, go,
});

const esc = s => (s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function renderHome(view) {
  const live = store.DOMAINS.filter(d => d.live);
  const pct = Math.round(live.reduce((s, d) => s + (profile.domains[d.id]?.mastery || 0), 0) / Math.max(1, live.length) * 100);
  const cards = store.DOMAINS.map(d => {
    const m = Math.round((profile.domains[d.id]?.mastery || 0) * 100);
    const liveCard = d.live && (content.byDomain[d.id] || []).some(i => i.citation?.trust === 'verified');
    return `<div class="card ${liveCard ? '' : 'locked'}">
      <div class="h"><span class="dot" style="${liveCard ? '' : 'background:var(--muted)'}"></span><h3>${d.name}</h3></div>
      <p>${d.desc}</p>
      ${liveCard
        ? `<div class="mini" role="progressbar" aria-label="${d.name} mastery" aria-valuenow="${m}" aria-valuemin="0" aria-valuemax="100"><i style="width:${m}%"></i></div>`
        : `<span class="soon">Coming soon</span>`}
    </div>`;
  }).join('');

  view.innerHTML = `
    <section class="lede">
      <span class="free">Free · tip jar only</span>
      <p>Start on your first day knowing nothing. Get <b>job-ready, one piece at a time</b>. Every rule
      explained in plain words first, the real CROR text one tap deeper — and a safe place to make every
      mistake until the right move is automatic.</p>
    </section>

    <h2 class="section">Your path</h2>
    <div class="path">
      <div class="stage"><b>${esc(store.stageFor(profile))}</b><span>${pct}% mastered</span></div>
      <div class="bar" role="progressbar" aria-label="Overall mastery" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:${pct}%"></i></div>
    </div>

    <h2 class="section">The job, one piece at a time</h2>
    <div class="grid">${cards}</div>

    <h2 class="section">Ways to learn</h2>
    <div class="stations">
      <button class="station" data-go="reference"><b>📖 Reference</b><small>Look anything up — cited</small></button>
      <button class="station" data-go="drill"><b>🎯 Drill</b><small>Adaptive practice</small></button>
      <button class="station" disabled><b>🚂 The Yard</b><small>Coming soon</small></button>
      <button class="station" disabled><b>🚦 Signals</b><small>Coming soon</small></button>
      <button class="station" disabled><b>📻 Radio</b><small>Coming soon</small></button>
      <button class="station" disabled><b>📝 Exam</b><small>Coming soon</small></button>
    </div>

    <footer>
      <a class="tip" href="https://ko-fi.com/jordandoerksen" target="_blank" rel="noopener">☕ Tip jar — if it helped you get there</a>
      <p>An independent study tool. Cites the <b>Canadian Rail Operating Rules</b> (a public document)
      and flags CN operating practice (GOI) as not-a-rule. Not affiliated with CN, Transport Canada,
      or the RAC. Built for the people the book failed.</p>
    </footer>`;

  view.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));
}

function route() {
  applySettings();
  const view = document.getElementById('view');
  const h = location.hash.replace(/^#\/?/, '');
  if (h === 'reference') reference.mount(view, ctx());
  else if (h === 'drill') drill.mount(view, ctx());
  else renderHome(view);
  view.focus?.();
}

function wireSettings() {
  const dlg = document.getElementById('settings');
  document.getElementById('openSet').addEventListener('click', () => dlg.showModal());
  document.getElementById('closeSet').addEventListener('click', () => dlg.close());
  const map = { 't-dys': 'dys', 't-con': 'contrast', 't-red': 'reduce', 't-aud': 'audio', 't-big': 'big' };
  for (const [id, key] of Object.entries(map)) {
    const el = document.getElementById(id);
    el.checked = settings[key];
    el.addEventListener('change', e => { settings[key] = e.target.checked; saveSettings(); applySettings(); });
  }
}

(async function boot() {
  applySettings();
  profile = store.loadProfile(settings);
  content = await store.loadContent();
  store.recomputeMastery(profile, content);
  store.saveProfile(profile);
  wireSettings();
  window.addEventListener('hashchange', route);
  route();
})();
