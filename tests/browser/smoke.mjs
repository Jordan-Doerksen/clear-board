// tests/browser/smoke.mjs: the browser smoke test. `npm run test:browser`.
//
// One plain Playwright script, with no test framework. It serves `dist/` by itself on a port of
// 127.0.0.1 and stops the server at the end. It needs `dist/` (run the build first) and Chromium.
//
// Use: node tests/browser/smoke.mjs [options]
//   --only <text>     Run only the cases whose name holds this text.
//   --dist <folder>   Serve this folder and not `dist/` of the repository.
//   --port <number>   Serve on this port, or on the port of the variable CB_PORT. With no
//                     option and no variable the system gives a free port.
//   --record-tape     Record the word tape of the guided Radio, and run no case.
//                     It needs --commit <commit>: the commit of the build that is served.
//
// Each gate case has a new browser context. The service worker is blocked, except in the
// offline case and the update case. A case that needs the same questions on each run sets a seed
// before the page loads: a fixed generator in place of `Math.random`. Each gate case fails on a
// page error, on a console error that the case does not expect, or on sideways scroll at 390 or
// 1440: the page scrolls sideways, or the content of `main` is wider than `main`. The script
// prints PASS or FAIL and the time for each gate case, and exits non-zero when one gate case
// fails.
//
// The learn card of the Drill (2c-plan C11, ruling LEARN-GAP): a case that waits for the first
// question presses the control of each learn card that shows first. The one helper of
// tools/lib/learn-card.mjs does it. It presses nothing when the build shows no learn card.
//
// A report-only case prints PENDING with a count and the job that owns the fix. It does not
// change the exit code. A count of 0 means that the case passes on this build. The closing
// commit of the G1 line turns a report-only case into a gate when its owner is merged and the
// case passes. After Wave 2c no case is report-only.
//
// An element is selected by "the hook, or the old selector" (the table HOOKS), so that a later
// job can replace an old class and put the hook on the same element, with no edit of this file.
// No case states a rule. The tape holds a hash and a word count of the page text, not the text.
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { LEARN_CARD, LEARN_NEXT, passLearnCards } from '../../tools/lib/learn-card.mjs';
// The engine of the Yard, frozen (fence item 1). The case of a win reads the job and its optimal line
// from the data, and the numbers that the readout must show from the model. It changes no file.
import { PUZZLES } from '../../src/stations/yard/puzzles.js';
import { freshState, kick, pull, secure, spot, checkWin } from '../../src/stations/yard/model.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const TAPE_PATH = join(here, 'radio-words.tape.json');

// ---- The arguments.
const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const option = (name) => { const i = argv.indexOf(name); return i !== -1 ? argv[i + 1] : undefined; };
const only = option('--only')?.toLowerCase();
const distDir = resolve(option('--dist') ?? join(root, 'dist'));
const port = Number(option('--port') ?? process.env.CB_PORT ?? 0);

function stop(message) {
  console.error(`smoke: ${message}`);
  process.exit(2);
}
if (!existsSync(join(distDir, 'index.html'))) stop(`${distDir} holds no index.html. The smoke test needs the build: run the build first.`);

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  stop('the package "playwright" is not installed. Install the packages of the lock file first.');
}

// ---- The server of the build.
// The server serves `served.dir`. It is the build of --dist, or `dist/`. The update case serves a
// second build for a time, and then the first build again.
const served = { dir: distDir };
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8',
};
const server = createServer((request, response) => {
  const path = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
  const dir = served.dir;
  let file = normalize(join(dir, path));
  if (file !== dir && !file.startsWith(dir + sep)) { response.writeHead(403).end(); return; }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) { response.writeHead(404, { 'content-type': 'text/plain' }).end('not found'); return; }
  response.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
  response.end(readFileSync(file));
});
await new Promise((done, fail) => { server.once('error', fail); server.listen(port, '127.0.0.1', done); })
  .catch((err) => stop(`the server did not start on port ${port}: ${err.message}`));
const base = `http://127.0.0.1:${server.address().port}`;

let browser;
try {
  browser = await chromium.launch();
} catch (err) {
  server.close();
  stop(`Chromium did not start. The smoke test needs the Chromium of Playwright.\n${String(err.message).split('\n')[0]}`);
}

// ---- Selectors: the hook, or the old selector.
const HOOKS = {
  'domain-card': '.grid .card',
  'station': '.station',
  'settings-open': 'header .iconbtn',
  'ref-search': '.search',
  'ref-row': '.ref-row',
  'ref-detail': '.ref-detail',
  'opt': '.opt',
  'feedback': '.feedback',
  'prompt': '.prompt',
  'prompt-signal': '.prompt-signal',
  'yard-drawing': 'canvas#yard',
};
const hook = (name, inner = '') => `[data-cb="${name}"]${inner}, ${HOOKS[name]}${inner}`;

const SIZES = { 390: { width: 390, height: 844 }, 1440: { width: 1440, height: 900 } };
const SEED = 12345;
const PROFILE_KEY = 'cb.profile.v1';
const SETTINGS_KEY = 'cb.settings.v1';
const TOGGLES = ['t-dys', 't-contrast', 't-reduce', 't-audio', 't-big'];
// The stored settings with each setting off. A case turns one setting on before the page loads.
const allOff = { dys: false, contrast: false, reduce: false, audio: false, big: false };

// The seed: a fixed generator in place of Math.random. It runs before each page script.
function seedScript(start) {
  let state = start >>> 0;
  Math.random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

// The browser refuses the storage of the site, as a browser that blocks the data of sites does:
// each read of `localStorage` or `sessionStorage` throws a SecurityError. It runs before each page
// script.
function refuseStorage() {
  for (const name of ['localStorage', 'sessionStorage']) {
    Object.defineProperty(window, name, {
      configurable: true,
      get() { throw new DOMException(`Failed to read the '${name}' property from 'Window': Access is denied for this document.`, 'SecurityError'); },
    });
  }
}

class CaseFailure extends Error {}
function ok(condition, message) {
  if (!condition) throw new CaseFailure(message);
}

// The sideways overflow of the page and of `main`, in px. The window of the shell clips its
// content sideways, so content that is wider than the window does not make the page scroll
// sideways. `main` does not clip, so its overflow shows that content.
const overflowOf = (page) => page.evaluate(() => {
  const root = document.documentElement;
  const main = document.querySelector('main');
  return { page: Math.max(0, root.scrollWidth - root.clientWidth), main: main ? Math.max(0, main.scrollWidth - main.clientWidth) : 0 };
});

// The controls of the page that are under 44 by 44 px (fence item 8): each enabled button, link,
// select, summary and input that shows. The floor is 44 px, not 43.5 px (ruling TARGETS-44). An input
// in a label is measured by the larger box of the two. While a dialog is open, only the controls in
// the dialog are measured. Returns one line for each small control.
const smallControls = (page) => page.evaluate(() => {
  const shown = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; };
  const name = (el) => (el.getAttribute('aria-label') || el.innerText || el.getAttribute('placeholder') || (el.id ? `#${el.id}` : '')).replace(/\s+/g, ' ').trim().slice(0, 40);
  const found = [];
  for (const el of document.querySelectorAll('button, a, select, summary, input')) {
    if (el.disabled || !shown(el)) continue;
    const dialog = document.querySelector('dialog[open]');
    if (dialog && !dialog.contains(el)) continue;
    let r = el.getBoundingClientRect();
    const label = el.tagName === 'INPUT' ? el.closest('label') : null;
    if (label) { const l = label.getBoundingClientRect(); if (l.width * l.height > r.width * r.height) r = l; }
    if (r.width < 44 || r.height < 44) found.push(`${el.tagName.toLowerCase()} "${name(el)}" ${Math.round(r.width * 100) / 100} by ${Math.round(r.height * 100) / 100} px`);
  }
  return found;
});

// The inputs that reach a page, from its first script on: the count of key presses and the count of
// pointer presses of each kind (touch, mouse, pen). A case of one kind of input proves with it that
// it used no other kind. It runs before each page script.
function countInputs() {
  const seen = { keys: 0, touch: 0, mouse: 0, pen: 0, other: 0 };
  Object.defineProperty(window, '__cbInputs', { value: seen });
  addEventListener('keydown', () => { seen.keys++; }, true);
  addEventListener('pointerdown', (e) => { seen[['touch', 'mouse', 'pen'].includes(e.pointerType) ? e.pointerType : 'other']++; }, true);
}
const inputsOf = (page) => page.evaluate(() => ({ ...window.__cbInputs }));

// Open one page in a new context, run `body`, then make the common checks.
// Options: width (390 or 1440, or another width), seed, serviceWorker, settings (stored before
// the page loads), reduce (the device flag for reduced motion), storage (false: the browser refuses
// the storage of the site), touch (true: a phone with a touch screen), expectedError (a function of
// the text and the address of a console error: true for an error that the case causes on purpose),
// common (false: no common checks).
async function withPage(options, body) {
  const size = SIZES[options.width ?? 1440] ?? { width: options.width, height: 800 };
  const context = await browser.newContext({
    viewport: size,
    deviceScaleFactor: 1,
    locale: 'en-CA',
    timezoneId: 'America/Winnipeg',
    reducedMotion: options.reduce ? 'reduce' : 'no-preference',
    serviceWorkers: options.serviceWorker ? 'allow' : 'block',
    ...(options.touch ? { hasTouch: true, isMobile: true } : {}),
  });
  const errors = [];
  try {
    if (options.seed !== false) await context.addInitScript(seedScript, options.seed ?? SEED);
    if (options.settings) {
      await context.addInitScript(([key, value]) => { if (!localStorage.getItem(key)) localStorage.setItem(key, value); }, [SETTINGS_KEY, JSON.stringify(options.settings)]);
    }
    if (options.storage === false) await context.addInitScript(refuseStorage);
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    page.on('pageerror', (err) => errors.push(`page error: ${err.message}`));
    page.on('console', (message) => {
      if (message.type() === 'error' && !options.expectedError?.(message.text(), message.location().url ?? '')) errors.push(`console error: ${message.text()}`);
    });
    // A case that stops also names the page errors and console errors that came before it stopped.
    const result = await body(page, context).catch((err) => {
      if (!errors.length) throw err;
      throw new CaseFailure(`${err instanceof CaseFailure ? err.message : String(err.message).split('\n')[0]}; ${errors.join('; ')}`);
    });
    if (options.common !== false) {
      ok(errors.length === 0, errors.join('; '));
      if (size.width === 390 || size.width === 1440) {
        const over = await overflowOf(page);
        ok(over.page === 0, `sideways scroll of ${over.page} px at ${size.width} px wide, on ${page.url().replace(base, '')}`);
        ok(over.main === 0, `the content of main is ${over.main} px wider than main at ${size.width} px wide, on ${page.url().replace(base, '')}. The window clips it, so the page does not scroll sideways.`);
      }
    }
    return result;
  } finally {
    await context.close();
  }
}

const open = (page, route) => page.goto(`${base}/#${route}`);
const visibleText = (page, selector) => page.locator(selector).first().innerText();
const count = (page, selector) => page.locator(selector).count();

// The first question of the Drill or of Signals: the helper of C11 presses the control of each learn
// card that shows first, and then an answer option shows.
async function toFirstQuestion(page) {
  await passLearnCards(page, hook('opt'));
  await page.locator(hook('opt')).first().waitFor();
}
// The first screen of the Drill or of Signals, with no press: a learn card or an answer option.
const firstScreen = (page) => page.locator(`${LEARN_CARD}, ${hook('opt')}`).first().waitFor();

// The six routes and the key element of each one. `ready` waits for the first screen of a route
// with no press; with no `ready` the check is the first screen.
const ROUTES = [
  { route: '/', name: 'home', async check(page) {
    await page.locator(hook('domain-card')).first().waitFor();
    ok(await count(page, hook('station')) > 0, 'Home has no station button');
  } },
  { route: '/reference', name: 'reference', async check(page) { await page.locator(hook('ref-row')).first().waitFor(); } },
  { route: '/drill', name: 'drill', ready: firstScreen, async check(page) { await toFirstQuestion(page); } },
  { route: '/signals', name: 'signals', ready: firstScreen, async check(page) {
    await toFirstQuestion(page);
    // With the seed the route opens on a drawn aspect. With no seed it can open on a text question.
    await page.locator(hook('prompt-signal', ' svg')).first().waitFor();
  } },
  { route: '/yard', name: 'yard', async check(page) {
    const drawing = page.locator(hook('yard-drawing')).first();
    await drawing.waitFor();
    const box = await drawing.boundingBox();
    ok(box && box.width > 0 && box.height > 0, 'the Yard drawing has no size');
    ok(await page.locator('.yard-host').evaluate((el) => el.childElementCount > 0), '.yard-host is empty');
  } },
  { route: '/radio', name: 'radio', async check(page) {
    await page.locator('.radio-wrap').first().waitFor();
    ok(await page.locator('.radio-host').evaluate((el) => el.childElementCount > 0), '.radio-host is empty');
  } },
];

// The service worker of the page is active. The wait is on the state of the worker; the bound of
// 15 s only ends a wait for a worker that never comes (an app that registers no worker).
async function workerReady(page) {
  const ready = await page.evaluate(() => Promise.race([
    navigator.serviceWorker.ready.then(() => true),
    new Promise((done) => { setTimeout(() => done(false), 15000); }),
  ]));
  ok(ready, 'the app registered no service worker: no worker was active after 15 s');
}

const storedJson = (page, key) => page.evaluate((k) => JSON.parse(localStorage.getItem(k) || 'null'), key);

// The text of the guided Radio, as the tape reads it: the visible text of `.radio-wrap`, with
// each run of white space made one space. The words are read as the markup writes them (ruling
// TAPE-CASE). A rule with text-transform changes the look of a word, not the word. So
// text-transform is off while the text is read, as in the look harness. A word or a letter case
// that the markup changes still changes the text.
async function radioText(page) {
  const text = await page.locator('.radio-wrap').evaluate((el) => {
    const asWritten = document.createElement('style');
    asWritten.textContent = '*, *::first-letter, *::first-line { text-transform: none !important; }';
    document.head.append(asWritten);
    try {
      return el.innerText;
    } finally {
      asWritten.remove();
    }
  });
  return text.replace(/\s+/g, ' ').trim();
}
const record = (text) => ({ sha256: createHash('sha256').update(text).digest('hex'), words: text.split(' ').length });

// Press the key control 14 times. `each(press, text)` gets the text before the first press
// (press 0) and after each press.
async function walkGuidedRadio(page, each) {
  await open(page, '/radio');
  await page.locator('#keyBtn').waitFor();
  await each(0, await radioText(page));
  for (let press = 1; press <= 14; press++) {
    await page.locator('#keyBtn').click();
    await page.locator('#log .tx').nth(press - 1).waitFor();
    await each(press, await radioText(page));
  }
}

// Wait until the text of an element is `text`. On a time-out the case fails with a sentence.
const waitText = (page, selector, text, when) => page.waitForFunction(([s, t]) => document.querySelector(s)?.textContent === t, [selector, text])
  .catch(async () => { throw new CaseFailure(`${when}: ${selector} says "${await page.locator(selector).textContent().catch(() => '(not in the page)')}", and "${text}" is expected`); });

// One action on a control: a click, a tap or the choice of an option. When the control does not take
// it in the time of the page (it does not show, it is off, or another element covers it), the case
// fails with a sentence that names the control, and the reason when the log of the browser gives one
// (for example "<div> intercepts pointer events"). The log has colour codes of the terminal: they go.
const COLOUR_CODE = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, 'g');
const ROUTINE = /^- (waiting|retrying|attempting|scrolling|done scrolling|locator resolved|element is visible, enabled and stable)/;
async function onControl(what, action) {
  try {
    await action();
  } catch (err) {
    if (err instanceof CaseFailure) throw err;
    const reason = String(err.message).replace(COLOUR_CODE, '').split('\n').map((l) => l.trim())
      .filter((l) => l.startsWith('- ') && !ROUTINE.test(l)).at(-1)?.slice(2) ?? '';
    throw new CaseFailure(`${what} did not reach its control in the time of the page${reason ? `: ${reason}` : ''}`);
  }
}
const click = (page, selector) => onControl(`a click on ${selector}`, () => page.locator(selector).click());

// ---- The Yard (Y4a, Y4b). The six switch buttons have the hook data-sw and a name that says the
// lining, for example "AS73 switch, lined reverse" (ruling SW-NAME). The move builder is the selects
// #act, #count and #track and the button #work. The text mirror #yard-mirror says the yard in words.
// It changes at the end paint of a move and not during the motion, so a case waits on it and not on
// time. The status region #yard-live says the result of each call; the banner #msg shows it.
const YARD_JOB = PUZZLES[0];                      // p0-1, the first job of the picker
const READOUT = (moves, par, couplings) => `Moves ${moves} / par ${par} · Couplings ${couplings}`;
const mirrorText = (page) => page.locator('#yard-mirror').evaluate((el) => el.textContent);
const mirrorChange = (page, before, what) => page.waitForFunction((was) => document.querySelector('#yard-mirror')?.textContent !== was, before, { timeout: 15000 })
  .catch(async () => { throw new CaseFailure(`${what} did not end: the text mirror did not change in 15 s. The banner says "${await page.locator('#msg').textContent()}"`); });
const callWords = ([act, track, n]) => (act === 'secure' ? `SECURE ${track}` : `${act.toUpperCase()} ${n} ${act === 'pull' ? 'from' : 'to'} ${track}`);

// The counters of the model along the optimal line of a job: entry k is the state after call k. Each
// call is made on the lining that the case makes: the switch of the track of the call reverse and
// each other switch normal. The case states no rule: the model (frozen) gives the numbers.
function lineStates(job) {
  const st = freshState(job);
  const states = [{ moves: st.moves, joints: st.joints, won: false }];
  for (const call of job.opt) {
    const [act, track, n] = call;
    if (act !== 'secure') for (const id of Object.keys(st.lined)) st.lined[id] = id === track ? 'reverse' : 'normal';
    const r = act === 'secure' ? secure(st, track) : { pull, spot, kick }[act](st, track, n);
    if (!r.ok) throw new CaseFailure(`the model refuses the call ${callWords(call)} of the optimal line of ${job.id}: ${r.msg}`);
    states.push({ moves: st.moves, joints: st.joints, won: checkWin(st, job) });
  }
  return states;
}

// Press Tab, or Shift+Tab, until the control of `selector` has the focus. The direction is the order
// of the document, which is the order of Tab in the Yard (no positive tabindex).
async function tabTo(page, selector, max = 80) {
  for (let presses = 0; presses <= max; presses++) {
    const where = await page.evaluate((s) => {
      const target = document.querySelector(s);
      const active = document.activeElement;
      if (!target) return 'none';
      if (active === target) return 'here';
      if (!active || active === document.body) return 'after';
      return active.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING ? 'after' : 'before';
    }, selector);
    if (where === 'here') return;
    if (where === 'none') throw new CaseFailure(`the control ${selector} is not in the page`);
    await page.keyboard.press(where === 'after' ? 'Tab' : 'Shift+Tab');
  }
  throw new CaseFailure(`the keyboard did not reach the control ${selector} in ${max} presses of Tab`);
}

// The two ways to play. `press` presses a button and `choose` sets a select. `only` is true when the
// counts of the inputs of the page show this way and no other.
const TOUCH = {
  name: 'touch', width: 390, touch: true,
  press: (page, selector) => onControl(`a tap on ${selector}`, () => page.locator(selector).tap()),
  // The list of a select is a part of the system, not of the page. The case taps the select, and then
  // picks the option as that list does: selectOption sets the option and sends input and change.
  async choose(page, selector, value) {
    await onControl(`a tap on ${selector}`, () => page.locator(selector).tap());
    await onControl(`the choice of the option "${value}" of ${selector}`, () => page.locator(selector).selectOption(value));
  },
  only: (seen) => seen.touch > 0 && seen.keys + seen.mouse + seen.pen + seen.other === 0,
};
const KEYBOARD = {
  name: 'keyboard', width: 1440, touch: false,
  // Space presses a switch button, and Enter each other button.
  async press(page, selector) {
    await tabTo(page, selector);
    await page.keyboard.press(selector.startsWith('[data-sw') ? 'Space' : 'Enter');
  },
  // A closed select of the browser changes its option with the arrow keys.
  async choose(page, selector, value) {
    await tabTo(page, selector);
    const values = await page.locator(`${selector} option`).evaluateAll((els) => els.map((o) => o.value));
    ok(values.includes(value), `the select ${selector} has no option "${value}": ${values.join(', ')}`);
    for (let k = 0; k < values.length; k++) {
      const now = await page.locator(selector).inputValue();
      if (now === value) break;
      await page.keyboard.press(values.indexOf(value) > values.indexOf(now) ? 'ArrowDown' : 'ArrowUp');
    }
    const now = await page.locator(selector).inputValue();
    ok(now === value, `the arrow keys did not move the select ${selector} to "${value}": it is on "${now}"`);
  },
  only: (seen) => seen.keys > 0 && seen.touch + seen.mouse + seen.pen + seen.other === 0,
};

// A control that the case is about to use must have its role and a name with a letter or a digit, and
// must be 44 by 44 px or more (fence item 8; the floor of ruling TARGETS-44). So a control that loses
// its name or its size fails the case, also in a state of the job that case 13 does not reach.
async function usable(page, selector, role, where) {
  const named = await page.locator(selector).and(page.getByRole(role, { name: /[A-Za-z0-9]/ })).count();
  ok(named === 1, `${where}: the control ${selector} is not a ${role} with a name`);
  const box = await page.locator(selector).boundingBox();
  const size = box ? `${Math.round(box.width * 100) / 100} by ${Math.round(box.height * 100) / 100} px` : 'not in the layout';
  ok(box && box.width >= 44 && box.height >= 44, `${where}: the control ${selector} is ${size}, and 44 by 44 px or more is expected`);
}

// One press of a switch button, and a wait until its name says the lining `want`.
async function throwSwitch(page, how, id, want, where) {
  const selector = `[data-sw="${id}"]`;
  const name = `${id} switch, lined ${want}`;
  await usable(page, selector, 'button', where);
  await how.press(page, selector);
  await page.waitForFunction(([s, n]) => document.querySelector(s)?.getAttribute('aria-label') === n, [selector, name])
    .catch(async () => { throw new CaseFailure(`${where}: after a press the switch button ${id} is named "${await page.locator(selector).getAttribute('aria-label')}", and "${name}" is expected`); });
}

// Play the first job to a win along its optimal line, one way. The case first presses each of the six
// switch buttons two times. For each call it lines the switches, sets the move builder, presses "Work
// it" and waits for the end paint of the move; the readout must then show the counters of the model.
// Each control must have its name and its size when the case uses it (usable).
// At the end it checks the win words, the readout at par, the status region and the done mark, and
// that the page got the inputs of this way only. Returns a note.
async function playToWin(how) {
  const job = YARD_JOB;
  const states = lineStates(job);
  const where = `${job.id} by ${how.name} at ${how.width}`;
  ok(states.at(-1).won && states.at(-1).moves === job.par, `the optimal line of ${job.id} does not win at par in the model`);
  return withPage({ width: how.width, touch: how.touch }, async (page, context) => {
    await context.addInitScript(countInputs);
    await open(page, '/yard');
    await page.locator('#work').waitFor();
    ok(await page.evaluate(() => document.documentElement.dataset.reduce) === '0', `${where}: "Reduce motion" is not off`);
    ok(await page.locator('#picker').inputValue() === String(PUZZLES.indexOf(job)), `${where}: the picker is not on the first job`);
    await waitText(page, '#readout', READOUT(0, job.par, 0), `${where}, at the start`);
    const ids = await page.locator('[data-sw]').evaluateAll((els) => els.map((el) => el.dataset.sw));
    ok(ids.length === 6, `${where}: the Yard has ${ids.length} switch buttons, and 6 are expected`);
    for (const id of ids) for (const want of ['reverse', 'normal']) await throwSwitch(page, how, id, want, where);
    for (const [k, call] of job.opt.entries()) {
      const [act, track, n] = call;
      if (act !== 'secure') {
        for (const id of ids) {
          const want = id === track ? 'reverse' : 'normal';
          if (!(await page.locator(`[data-sw="${id}"]`).getAttribute('aria-label')).endsWith(want)) await throwSwitch(page, how, id, want, where);
        }
      }
      for (const [selector, value] of [['#act', act], ['#track', track], ...(act !== 'secure' ? [['#count', String(n)]] : [])]) {
        await usable(page, selector, 'combobox', where);
        await how.choose(page, selector, value);
      }
      await usable(page, '#work', 'button', where);
      const before = await mirrorText(page);
      await how.press(page, '#work');
      await mirrorChange(page, before, `${where}: the call ${callWords(call)}`);
      await waitText(page, '#readout', READOUT(states[k + 1].moves, job.par, states[k + 1].joints), `${where}: after the call ${callWords(call)}`);
    }
    // The win words, the readout at par, the status region and the done mark.
    const banner = (await page.locator('#msg').textContent()).trim();
    ok(banner.startsWith('Job done.'), `${where}: after the last call the banner says "${banner}", and the win words "Job done." are expected`);
    const readout = READOUT(job.par, job.par, states.at(-1).joints);
    await waitText(page, '#readout', readout, `${where}, at the win`);
    const region = page.locator('#yard-live');
    ok(await region.getAttribute('role') === 'status', `${where}: #yard-live is not a status region`);
    const said = await region.textContent();
    ok(said.includes('Job done.') && said.includes(readout), `${where}: the status region says "${said}"; it must hold "Job done." and "${readout}"`);
    const option = `#picker option[value="${PUZZLES.indexOf(job)}"]`;
    ok((await page.locator(option).textContent()).startsWith('✓'), `${where}: after the win the picker shows "${await page.locator(option).textContent()}", with no done mark ✓`);
    ok((await storedJson(page, PROFILE_KEY))?.yard?.completed?.includes(job.id), `${where}: after the win ${PROFILE_KEY} holds no done mark for ${job.id}`);
    const seen = await inputsOf(page);
    ok(how.only(seen), `${where}: the page got inputs of another way: ${JSON.stringify(seen)}`);
    // The done mark stays after a reload.
    await page.reload();
    await page.locator('#picker').waitFor();
    ok((await page.locator(option).textContent()).startsWith('✓'), `${where}: after a reload the picker shows "${await page.locator(option).textContent()}", with no done mark ✓`);
    return `${where}: ${how.touch ? `${seen.touch} taps` : `${seen.keys} key presses`}, "${banner}"`;
  });
}

// The texts of the status region #yard-live (ruling PLAY-ALL-ONE, finding F-11). A screen reader gets
// only the last text that a region gets in one task, so a case counts each text that the region gets.
// recordLive starts the record: a MutationObserver keeps the text of each node that a write puts into
// the region, also when two writes come in one task. liveTexts waits two animation frames, stops the
// record and returns the texts in order.
const recordLive = (page) => page.evaluate(() => {
  const texts = [];
  const keep = (records) => {
    for (const r of records) {
      if (r.type === 'characterData') texts.push(r.target.data);
      else for (const node of r.addedNodes) texts.push(node.textContent);
    }
  };
  const observer = new MutationObserver(keep);
  observer.observe(document.querySelector('#yard-live'), { childList: true, characterData: true, subtree: true });
  window.__cbLiveStop = () => { keep(observer.takeRecords()); observer.disconnect(); return texts; };
});
const liveTexts = (page) => page.evaluate(async () => {
  await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
  return window.__cbLiveStop();
});
// The numbers of the steps that a text of the stepper names ("Step 2 of 4: ..."), in order.
const stepsSaid = (text) => [...text.matchAll(/Step (\d+) of \d+:/g)].map((m) => Number(m[1]));
// The words of the steps from `first` to the last step of the watched line of `job`, in order, in one
// text: for each step, "Step k of N: <the call>." and then the readout after the step, with the numbers
// of the model (`states`, from lineStates). Returns the first part that is missing or out of order, or
// null when each part is there in order.
function firstMissingStep(text, job, states, first) {
  const n = job.opt.length;
  let at = 0;
  for (let k = first; k <= n; k++) {
    for (const part of [`Step ${k} of ${n}: ${callWords(job.opt[k - 1])}.`, `${READOUT(states[k].moves, job.par, states[k].joints)}.`]) {
      const found = text.indexOf(part, at);
      if (found === -1) return part;
      at = found + part.length;
    }
  }
  return null;
}

// ---- The gate cases.
const GATE_CASES = [
  { name: '1 routes', async run() {
    for (const width of [390, 1440]) {
      for (const r of ROUTES) {
        await withPage({ width }, async (page) => {
          await open(page, r.route);
          await r.check(page).catch((err) => { throw new CaseFailure(`${r.name} at ${width}: ${err.message.split('\n')[0]}`); });
        });
      }
    }
  } },

  { name: '2 drill', async run() {
    await withPage({}, async (page) => {
      await open(page, '/drill');
      await toFirstQuestion(page);
      await page.locator(hook('opt')).first().click();
      await page.locator(hook('feedback')).first().waitFor();
      const profile = await storedJson(page, PROFILE_KEY);
      const graded = Object.values(profile?.items ?? {});
      ok(graded.length === 1, `one answer wrote ${graded.length} graded items to ${PROFILE_KEY}, and 1 is expected`);
      ok(graded[0].seen === 1, `the graded item has seen ${graded[0].seen}, and 1 is expected`);
    });
  } },

  { name: '3 reference', async run() {
    // The ids come from the content files of the build. The test reads no rule text.
    const items = [];
    for (const file of ['definitions.json', 'signals.json', 'rules.json', 'radio-script.json']) {
      items.push(...JSON.parse(readFileSync(join(distDir, 'data', file), 'utf8')));
    }
    const verified = items.find((i) => i.citation?.trust === 'verified');
    const needsReview = items.find((i) => i.citation?.trust === 'needs-review');
    ok(verified && needsReview, 'the content holds no verified item or no needs-review item');
    await withPage({}, async (page) => {
      await open(page, '/reference');
      await page.locator(hook('ref-row')).first().waitFor();
      const before = await count(page, hook('ref-row'));
      const word = (await page.locator(hook('ref-row', ' b')).first().innerText()).trim();
      await page.locator(hook('ref-search')).first().fill(word);
      await page.waitForFunction(([selector, n]) => document.querySelectorAll(selector).length < n, [hook('ref-row'), before]);
      const after = await count(page, hook('ref-row'));
      ok(after >= 1 && after < before, `a search for a row title gave ${after} rows of ${before}`);
    });
    await withPage({}, async (page) => {
      await open(page, `/reference?focus=${encodeURIComponent(verified.id)}`);
      const detail = page.locator(hook('ref-detail')).first();
      await detail.waitFor();
      ok((await detail.innerText()).includes(verified.title), `the focus parameter did not open the item ${verified.id}`);
      ok(!/not yet verified/i.test(await detail.innerText()), 'a verified item shows the badge of an item that is not verified');
    });
    await withPage({}, async (page) => {
      await open(page, `/reference?focus=${encodeURIComponent(needsReview.id)}`);
      const detail = page.locator(hook('ref-detail')).first();
      await detail.waitFor();
      ok(/not yet verified/i.test(await detail.innerText()), `the item ${needsReview.id} has trust needs-review and shows no badge with the words "not yet verified"`);
    });
  } },

  { name: '4 settings', async run() {
    const read = (page) => page.evaluate((key) => ({
      dys: document.documentElement.dataset.dys,
      contrast: document.documentElement.dataset.contrast,
      reduce: document.documentElement.dataset.reduce,
      fs: document.documentElement.style.getPropertyValue('--fs').trim(),
      audio: JSON.parse(localStorage.getItem(key) || '{}').audio,
    }), SETTINGS_KEY);
    const allOn = { dys: '1', contrast: '1', reduce: '1', fs: '18.5px', audio: true };
    await withPage({}, async (page) => {
      await open(page, '/');
      await page.locator(hook('domain-card')).first().waitFor();
      ok(JSON.stringify(await read(page)) === JSON.stringify({ dys: '0', contrast: '0', reduce: '0', fs: '16px', audio: false }), `the start values are ${JSON.stringify(await read(page))}`);
      await page.locator(hook('settings-open')).first().click();
      await page.locator('dialog#settings[open]').waitFor();
      // The toggle input is under another element, so the case moves it with focus and Space.
      for (const id of TOGGLES) {
        await page.locator(`#${id}`).focus();
        await page.keyboard.press('Space');
        ok(await page.locator(`#${id}`).isChecked(), `the toggle ${id} is not on after focus and Space`);
      }
      ok(JSON.stringify(await read(page)) === JSON.stringify(allOn), `after the five toggles the values are ${JSON.stringify(await read(page))}`);
      await page.reload();
      await page.locator(hook('domain-card')).first().waitFor();
      ok(JSON.stringify(await read(page)) === JSON.stringify(allOn), `after a reload the values are ${JSON.stringify(await read(page))}`);
    });
  } },

  { name: '5 settings dialog', async run() {
    await withPage({}, async (page) => {
      await open(page, '/');
      const opener = page.locator(hook('settings-open')).first();
      await opener.click();
      await page.locator('dialog#settings[open]').waitFor();
      ok(await page.evaluate(() => document.querySelector('dialog#settings').contains(document.activeElement)), 'focus did not move into the Settings dialog');
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => !document.querySelector('dialog#settings').open);
      ok(await opener.evaluate((el) => el === document.activeElement), 'focus did not go back to the control that opened Settings');
    });
  } },

  { name: '6 radio guided', async run() {
    ok(existsSync(TAPE_PATH), `${TAPE_PATH} does not exist. Record it one time with --record-tape.`);
    const tape = JSON.parse(readFileSync(TAPE_PATH, 'utf8'));
    await withPage({}, async (page) => {
      let presses = 0;
      await walkGuidedRadio(page, (press, text) => {
        const want = tape.records[press];
        const got = record(text);
        ok(want && want.sha256 === got.sha256 && want.words === got.words,
          `the words of the guided Radio differ from the tape at press ${press} (the tape has ${want?.words} words, the page has ${got.words}).\n      The text of the page: ${text}`);
        presses = press;
      });
      ok(presses === 14 && tape.records.length === 15, `the walk has ${presses} presses and the tape has ${tape.records.length} records`);
      ok(await count(page, '#keyBtn') === 0, 'the key control is still there after 14 presses');
    });
  } },

  { name: '7 radio call it yourself', async run() {
    // The case does not know the right call. With the seed the options have one order on each
    // load, so it tries one option in each new context until the page says "Right.".
    let graded = null;
    for (let pick = 0; pick < 6 && !graded; pick++) {
      await withPage({}, async (page) => {
        await open(page, '/radio');
        await page.locator('[role="tab"]').nth(1).click();
        await page.locator(hook('opt')).first().waitFor();
        const options = await count(page, hook('opt'));
        ok(pick < options, `no option of the ${options} gave "Right."`);
        await page.locator(hook('opt')).nth(pick).click();
        const feedback = await visibleText(page, hook('feedback'));
        if (!feedback.includes('Right.')) return;
        graded = Object.values((await storedJson(page, PROFILE_KEY))?.items ?? {});
      });
    }
    ok(graded && graded.length === 1, `one right call wrote ${graded?.length} graded items, and 1 is expected`);
    ok(graded[0].correct === 1 && graded[0].seen === 1, `the graded item has correct ${graded[0].correct} and seen ${graded[0].seen}`);
  } },

  { name: '8 yard', async run() {
    // The watched line of the first job (R7-P8, U-04): "▶ Watch optimal" opens a stepper at step 0 in
    // the place of the move builder. Next plays one step, Back shows the yard after the step before,
    // and "▶ Play all" plays each step to the end. The readout says "Couplings" (U-23). "Reduce motion"
    // is off, so a step moves the engine: each wait is on the state of the page. The numbers of the
    // readout after each step come from the model. A watched line gets no done mark.
    const job = YARD_JOB;
    const states = lineStates(job);
    const n = job.opt.length;
    const at = (k) => READOUT(states[k].moves, job.par, states[k].joints);
    await withPage({}, async (page) => {
      await open(page, '/yard');
      await page.locator('#optimal').waitFor();
      ok(await page.evaluate(() => document.documentElement.dataset.reduce) === '0', '"Reduce motion" is not off');
      ok(await page.locator('#picker').inputValue() === String(PUZZLES.indexOf(job)), `the picker is not on the first job ${job.id}`);
      await waitText(page, '#readout', at(0), `the first job ${job.id} at its start`);
      // The stepper opens at step 0, and the move builder goes.
      await click(page, '#optimal');
      await page.locator('#yard-next').waitFor();
      await waitText(page, '#yard-demo-count', `0 / ${n}`, 'after "▶ Watch optimal"');
      await waitText(page, '#readout', at(0), 'after "▶ Watch optimal"');
      ok(await page.locator('#work').isHidden(), 'the control "Work it" shows while the optimal line is watched');
      ok((await page.locator('#yard-live').textContent()).includes(`Step 0 of ${n}`), `after "▶ Watch optimal" the status region does not say "Step 0 of ${n}"`);
      // Next plays step 1. The words and the readout say its end state at its start; the text mirror
      // changes at its end paint.
      const before = await mirrorText(page);
      await click(page, '#yard-next');
      await waitText(page, '#yard-demo-count', `1 / ${n}`, 'after Next');
      await waitText(page, '#readout', at(1), 'after Next');
      await mirrorChange(page, before, 'step 1 of the optimal line after Next');
      // Back shows the yard at step 0.
      await click(page, '#yard-back');
      await waitText(page, '#yard-demo-count', `0 / ${n}`, 'after Back');
      await waitText(page, '#readout', at(0), 'after Back');
      // "▶ Play all" plays each step on its own, and then the control says "Play all" again and is off.
      await recordLive(page);
      await click(page, '#yard-play');
      await page.waitForFunction((count) => {
        const play = document.querySelector('#yard-play');
        return document.querySelector('#yard-demo-count')?.textContent === count && /Play all/.test(play?.textContent ?? '') && play?.getAttribute('aria-disabled') === 'true';
      }, `${n} / ${n}`, { timeout: 30000 }).catch(async () => {
        throw new CaseFailure(`after "▶ Play all" and 30 s the stepper is at "${await page.locator('#yard-demo-count').textContent()}" and its control says "${(await page.locator('#yard-play').textContent()).trim()}"; "${n} / ${n}" and "▶ Play all" (off) are expected`);
      });
      // With motion on, each step keeps its own text in the status region (ruling PLAY-ALL-ONE).
      // Case 23 checks "Play all" with "Reduce motion" on.
      const texts = await liveTexts(page);
      const each = texts.map(stepsSaid);
      ok(texts.length === n && each.every((steps, k) => steps.length === 1 && steps[0] === k + 1), `with motion on, "▶ Play all" gave the status region #yard-live ${texts.length} texts with the steps ${each.map((steps) => `[${steps.join(', ')}]`).join(' ')}, and ${n} texts with one step each, in order, are expected`);
      await waitText(page, '#readout', at(n), 'at the end of "▶ Play all"');
      const banner = await page.locator('#msg').textContent();
      ok(banner.includes(`Step ${n} of ${n}`), `at the end of "▶ Play all" the banner says "${banner}", and "Step ${n} of ${n}" is expected`);
      ok(!/Joints/.test(await page.locator('#readout').textContent()), 'the readout says "Joints"');
      const option = await page.locator(`#picker option[value="${PUZZLES.indexOf(job)}"]`).textContent();
      ok(!option.startsWith('✓'), `a watched line gave the job ${job.id} the done mark: "${option}"`);
    });
  } },

  { name: '9 offline', async run() {
    const expectedError = (text) => /net::ERR_INTERNET_DISCONNECTED/.test(text);
    await withPage({ serviceWorker: true, expectedError }, async (page, context) => {
      await open(page, '/');
      await page.locator(hook('domain-card')).first().waitFor();
      // Wait for the worker and for its cache to stop growing.
      await workerReady(page);
      const cached = () => page.evaluate(async () => {
        let n = 0;
        for (const name of await caches.keys()) n += (await (await caches.open(name)).keys()).length;
        return n;
      });
      let last = -1;
      for (let i = 0; i < 50; i++) {
        const n = await cached();
        if (n > 0 && n === last) break;
        last = n;
        await page.waitForTimeout(300);
      }
      ok(last > 0, 'the service worker cached no file');
      await context.setOffline(true);
      for (const r of ROUTES) {
        await open(page, r.route);
        await page.reload();
        await r.check(page).catch((err) => { throw new CaseFailure(`offline, ${r.name}: ${err.message.split('\n')[0]}`); });
      }
    });
  } },

  { name: '10 shell', async run() {
    await withPage({}, async (page) => {
      await open(page, '/');
      await page.locator(hook('domain-card')).first().waitFor();
      ok(await page.evaluate(() => document.documentElement.lang) === 'en', 'html has no lang="en"');
      const viewport = await page.evaluate(() => document.querySelector('meta[name="viewport"]')?.content ?? '');
      ok(viewport && !/maximum-scale|user-scalable\s*=\s*(no|0)/i.test(viewport), `the viewport line limits zoom: "${viewport}"`);
      const bars = await page.locator('[role="progressbar"]').evaluateAll((els) => els.map((el) => ({ name: el.getAttribute('aria-label'), value: el.getAttribute('aria-valuenow') })));
      ok(bars.length > 0 && bars.every((b) => b.name && b.value !== null && b.value !== ''), `a progressbar of Home has no name or no value: ${JSON.stringify(bars)}`);
    });
    await withPage({}, async (page) => {
      await open(page, '/yard');
      await page.locator('#picker').waitFor();
      const picker = await page.locator('#picker').evaluate((el) => ({ tag: el.tagName, groups: el.querySelectorAll('optgroup').length }));
      ok(picker.tag === 'SELECT' && picker.groups > 0, `#picker is ${picker.tag} with ${picker.groups} groups, and a select with groups is expected`);
    });
    for (const width of [390, 1440]) {
      await withPage({ width }, async (page) => {
        await open(page, '/drill');
        await toFirstQuestion(page);
        const heights = await page.locator(hook('opt')).evaluateAll((els) => els.map((el) => el.getBoundingClientRect().height));
        ok(heights.length > 0 && heights.every((h) => h >= 44), `an answer option is under 44 px high at ${width}: ${heights.map((h) => Math.round(h)).join(', ')}`);
        await page.locator(hook('opt')).first().click();
        const feedback = await visibleText(page, hook('feedback'));
        ok(feedback.includes('Right.') || feedback.includes('Not quite.'), 'the feedback holds no "Right." and no "Not quite."');
      });
    }
  } },

  // Cases 11 and 12 were report-only cases in Wave 2a. Their owner S1 is merged and each one
  // passes, so the closing commit of the G1 line made each one a gate.
  { name: '11 dyslexia spacing', async run() {
    // With the dyslexia setting on, an answer option has the letter spacing of the prompt.
    await withPage({ settings: { ...allOff, dys: true } }, async (page) => {
      await open(page, '/drill');
      await toFirstQuestion(page);
      ok(await page.evaluate(() => document.documentElement.dataset.dys) === '1', 'the dyslexia setting is not on');
      const spacing = (selector) => page.locator(selector).first().evaluate((el) => getComputedStyle(el).letterSpacing);
      const option = await spacing(hook('opt'));
      const prompt = await spacing(hook('prompt'));
      ok(option === prompt, `with the dyslexia setting on, the letter spacing of an answer option is ${option} and that of the prompt is ${prompt}`);
    });
  } },

  { name: '12 motion rules', async run() {
    // With "Reduce motion" on, no element and no ::before or ::after part has a transition time
    // or an animation name, on the six routes and in the Settings dialog.
    const moving = (page) => page.evaluate(() => [...document.querySelectorAll('*')]
      .filter((el) => [null, '::before', '::after'].some((pseudo) => {
        const style = getComputedStyle(el, pseudo);
        return style.transitionDuration.split(',').some((d) => parseFloat(d) > 0) || style.animationName !== 'none';
      }))
      .map((el) => `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${[...el.classList].map((c) => `.${c}`).join('')}`));
    for (const r of ROUTES) {
      await withPage({ settings: { ...allOff, reduce: true } }, async (page) => {
        await open(page, r.route);
        await r.check(page);
        ok(await page.evaluate(() => document.documentElement.dataset.reduce) === '1', `"Reduce motion" is not on, on ${r.name}`);
        const found = (await moving(page)).map((el) => `${r.name}: ${el}`);
        if (r.route === '/') {
          await page.locator(hook('settings-open')).first().click();
          await page.locator('dialog#settings[open]').waitFor();
          found.push(...(await moving(page)).map((el) => `settings dialog: ${el}`));
        }
        ok(found.length === 0, `with "Reduce motion" on, ${found.length} elements have a transition time or an animation name: ${found.slice(0, 8).join(', ')}${found.length > 8 ? ', ...' : ''}`);
      });
    }
  } },

  // Cases 13 and 14 were report-only cases in Wave 2a. Their owners are merged after Wave 2b and
  // each case passes, so the closing commit of the G1 line made each one a gate.
  { name: '13 targets', async run() {
    // Each enabled button, link, select, summary and input is 44 by 44 px or more, on the six
    // routes and in the Settings dialog, at 390 and 1440 (smallControls).
    const found = [];
    for (const width of [390, 1440]) {
      for (const r of ROUTES) {
        const list = await withPage({ width }, async (page) => { await open(page, r.route); await r.check(page); return smallControls(page); });
        found.push(...list.map((s) => `${r.name} at ${width}: ${s}`));
      }
      const list = await withPage({ width }, async (page) => {
        await open(page, '/');
        await page.locator(hook('settings-open')).first().click();
        await page.locator('dialog#settings[open]').waitFor();
        return smallControls(page);
      });
      found.push(...list.map((s) => `settings dialog at ${width}: ${s}`));
    }
    ok(found.length === 0, `${found.length} controls are under 44 by 44 px: ${found.slice(0, 8).join('; ')}${found.length > 8 ? '; ...' : ''}`);
  } },

  { name: '14 yard at 320', async run() {
    // On the Yard at 320 px wide, the page does not scroll sideways, and no content is wider than
    // main. The case waits for the frame of the Yard drawing first, as the route case does.
    await withPage({ width: 320 }, async (page) => {
      await open(page, '/yard');
      await ROUTES.find((r) => r.route === '/yard').check(page);
      const over = await overflowOf(page);
      ok(over.page === 0, `the Yard at 320 px wide scrolls sideways by ${over.page} px`);
      ok(over.main === 0, `on the Yard at 320 px wide, the content of main is ${over.main} px wider than main. The window clips it, so the page does not scroll sideways.`);
    });
  } },

  // Case 15 was a report-only case in Wave 2a. Its owners are merged after Wave 2b and the case
  // passes, so the closing commit of the G1 line made it a gate.
  { name: '15 type modes in the islands', async run() {
    // With "Bigger text" on, each text element in main on the Yard and on the guided Radio has a
    // larger computed font size than with it off, at 390 and 1440. A text element is an element
    // with a text node of its own. Each setting gets its own page load.
    //
    // The two loads are matched by a key, not by the order of the elements. The Yard drawing lays
    // out again with the larger text and can change its form, so elements come and go and the
    // order changes. The key of an element with an id is the id. The key of each other element
    // is the nearest element at or above it with an id or a data-cb hook, then its tag, its class
    // names and its own text. The key holds no position, no size and no order. The elements of
    // one key are compared as a group: each one with the setting on must be larger than each one
    // with the setting off.
    //
    // An element with no partner under the other setting cannot be compared. Inside the Yard
    // drawing this is expected: a plate of one form or a break mark of one layout. The case lists
    // each one. Outside the drawing each text element must have a partner, else the case fails.
    const DRAWING = '[data-cb="yard-drawing"]';
    const textKeys = (page) => page.evaluate(() => {
      const found = [];
      for (const el of document.querySelectorAll('main *')) {
        const text = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' ').replace(/\s+/g, ' ').trim();
        if (!text) continue;
        let anchor = 'main';
        for (let e = el; e && e.tagName !== 'MAIN'; e = e.parentElement) {
          if (e.id) { anchor = `#${e.id}`; break; }
          if (e.dataset?.cb) { anchor = `[data-cb="${e.dataset.cb}"]`; break; }
        }
        const key = el.id ? anchor : `${anchor} ${el.tagName.toLowerCase()}${[...el.classList].sort().map((c) => `.${c}`).join('')} "${text}"`;
        found.push({ key, px: parseFloat(getComputedStyle(el).fontSize) });
      }
      return found;
    });
    const group = (list) => {
      const map = new Map();
      for (const { key, px } of list) map.set(key, [...(map.get(key) ?? []), px]);
      return map;
    };
    const notLarger = [];
    const alone = [];
    const lost = [];
    let compared = 0;
    for (const width of [390, 1440]) {
      for (const [route, ready] of [['/yard', '#picker'], ['/radio', '#keyBtn']]) {
        const where = `${route} at ${width}`;
        const load = (big) => withPage({ width, settings: { ...allOff, big } }, async (page) => {
          await open(page, route);
          await page.locator(ready).first().waitFor();
          const fs = await page.evaluate(() => document.documentElement.style.getPropertyValue('--fs').trim());
          ok(fs === (big ? '18.5px' : '16px'), `${where}: --fs is "${fs}" with "Bigger text" ${big ? 'on' : 'off'}`);
          return group(await textKeys(page));
        });
        const off = await load(false);
        const on = await load(true);
        let matched = 0;
        for (const [key, offPx] of off) {
          const onPx = on.get(key);
          if (!onPx) { (key.startsWith(DRAWING) ? alone : lost).push(`${where}, off only: ${key}`); continue; }
          matched += offPx.length;
          if (!(Math.min(...onPx) > Math.max(...offPx))) notLarger.push(`${where}: ${key}: ${Math.max(...offPx)} px off, ${Math.min(...onPx)} px on`);
        }
        for (const key of on.keys()) if (!off.has(key)) (key.startsWith(DRAWING) ? alone : lost).push(`${where}, on only: ${key}`);
        ok(matched > 0, `${where}: no text element has a partner under the other setting`);
        compared += matched;
      }
    }
    ok(lost.length === 0, `${lost.length} text elements outside the Yard drawing have no partner under the other setting: ${lost.slice(0, 6).join('; ')}${lost.length > 6 ? '; ...' : ''}`);
    ok(notLarger.length === 0, `with "Bigger text" on, ${notLarger.length} keys of text elements are not larger: ${notLarger.slice(0, 6).join('; ')}${notLarger.length > 6 ? '; ...' : ''}`);
    return `${compared} text elements compared, each one larger with "Bigger text" on. ${alone.length} text elements of the Yard drawing have no partner under the other setting and are not compared${alone.length ? `: ${alone.join('; ')}` : ''}.`;
  } },

  // Cases 16, 17 and 18 are the trials of R6 ENG-01 and ENG-02 as browser tests (P-22). They enter
  // the gate with rows U-10 and U-07, which Wave 2c-1 merged.
  { name: '16 update', async run() {
    // Row U-10 and the trial of R6 ENG-01 in full. The server serves a first build, then a second build
    // in which the station chunk of the Yard has a new name and the old chunk is gone (secondBuild).
    // Two copies of the app are open on the first build: A and B. B is on Home and has not opened the
    // Yard. Then:
    //   1. A gets the new build: A shows "A new version is ready." with one control "Reload", and keeps
    //      the first build. A opens the Yard: the Yard draws from the old chunk, which the cache of the
    //      first build holds, although the server no longer holds it.
    //   2. The learner presses "Reload" in A: A reloads on the second build, and the Yard draws from the
    //      new chunk. The new worker now controls each copy, and the old chunk is in no cache.
    //   3. B opens the Yard: the old chunk does not load. B says "This station did not load." with a
    //      control "Reload", and does not go blank. Its "Reload" loads the second build, and the Yard
    //      draws.
    // A control "Reload" that does nothing fails the case with a sentence.
    const second = secondBuild(distDir);
    const yardRoute = ROUTES.find((r) => r.route === '/yard');
    const isOld = (url) => url.endsWith(`/assets/${second.oldYard}`);
    const isNew = (url) => url.endsWith(`/assets/${second.newYard}`);
    const loadedChunks = (page) => page.evaluate(() => performance.getEntriesByType('resource').map((e) => e.name));
    // A press of a control "Reload" that must reload the page; with no reload in 15 s the case fails.
    const reloads = async (page, control, what) => {
      const loaded = page.waitForEvent('load', { timeout: 15000 }).then(() => true, () => false);
      await onControl(`${what}: a click on "Reload"`, () => control.click());
      ok(await loaded, `${what}: the control "Reload" did not reload the page in 15 s`);
    };
    try {
      return await withPage({ serviceWorker: true }, async (page, context) => {
        await open(page, '/');
        await page.locator(hook('domain-card')).first().waitFor();
        await workerReady(page);
        // The learner opens the app again: the worker of the first build now controls the page.
        await page.reload();
        await page.locator(hook('domain-card')).first().waitFor();
        await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
        await page.evaluate(() => { window.__cbSmokeOpen = 'first build'; });
        // Copy B, on Home with the first build. Its page errors and console errors fail the case,
        // except the failed request of the old Yard chunk in step 3.
        const other = await context.newPage();
        other.setDefaultTimeout(10000);
        const otherErrors = [];
        let oldMissing = 0;
        other.on('pageerror', (err) => otherErrors.push(`page error: ${err.message}`));
        other.on('console', (message) => {
          if (message.type() !== 'error') return;
          if (isOld(message.location().url ?? '')) oldMissing++;
          else otherErrors.push(`console error: ${message.text()}`);
        });
        await open(other, '/');
        await other.locator(hook('domain-card')).first().waitFor();
        await other.waitForFunction(() => navigator.serviceWorker.controller !== null);
        await other.evaluate(() => { window.__cbSmokeOpen = 'first build'; window.__cbFirstWorker = navigator.serviceWorker.controller; });
        const stillOpen = async (when) => ok(await page.evaluate(() => window.__cbSmokeOpen) === 'first build', `the page reloaded ${when}, before the control of the notice was pressed`);
        const notice = page.getByText(UPDATE_NOTICE, { exact: true });
        // 1. The server now holds the second build. The learner comes back to the open app: the app
        // asks for a new version on that event of the page (App.tsx). The app adds its listener when
        // the worker is registered, so the event is sent again until the notice shows.
        served.dir = second.dir;
        let shown = false;
        for (let tries = 0; tries < 10 && !shown; tries++) {
          await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
          shown = await notice.waitFor({ timeout: 1500 }).then(() => true, () => false);
        }
        if (!shown) await stillOpen('by itself, and the notice did not stay');
        ok(shown, `the notice "${UPDATE_NOTICE}" did not show after the server held a second build`);
        const reload = page.locator('p', { has: notice }).getByRole('button', { name: 'Reload', exact: true });
        ok(await reload.count() === 1, `the notice "${UPDATE_NOTICE}" has no control "Reload"`);
        await stillOpen('when the notice showed');
        ok(await page.evaluate(() => document.querySelector('meta[name="cb-smoke-build"]') === null), 'the page shows the second build before the control was pressed');
        // The open app keeps the first build: the Yard draws from the old chunk, and the page does not
        // reload on a change of route.
        ok(!existsSync(join(second.dir, 'assets', second.oldYard)), `the second build still holds the old Yard chunk ${second.oldYard}`);
        await page.evaluate(() => { location.hash = '#/yard'; });
        await yardRoute.check(page).catch((err) => { throw new CaseFailure(`the open app with the first build, after the server held the second build: the Yard did not draw: ${err.message.split('\n')[0]}`); });
        ok((await loadedChunks(page)).some(isOld), `the open app did not load the old Yard chunk ${second.oldYard}`);
        await stillOpen('on a change of route');
        ok(await notice.isVisible(), 'the notice went away on a change of route');
        // 2. The learner presses the control: the page reloads on the second build.
        await reloads(page, reload, `copy A, the notice "${UPDATE_NOTICE}"`);
        await yardRoute.check(page).catch((err) => { throw new CaseFailure(`copy A after its "Reload": the Yard did not draw: ${err.message.split('\n')[0]}`); });
        ok(await page.evaluate(() => window.__cbSmokeOpen) === undefined, 'the page did not reload after the control was pressed');
        ok(await page.evaluate(() => document.querySelector('meta[name="cb-smoke-build"]')?.getAttribute('content')) === '2', 'after the reload the page does not show the second build');
        ok((await loadedChunks(page)).some(isNew), `after the reload the Yard did not load the new chunk ${second.newYard}`);
        ok(await page.getByText(UPDATE_NOTICE, { exact: true }).count() === 0, `the notice "${UPDATE_NOTICE}" still shows after the reload on the new build`);
        // 3. Copy B still runs the first build. Wait until the new worker controls B and is activated:
        // its activation takes each file that the second build does not hold out of the cache. Then
        // open the Yard in B.
        const taken = await other.waitForFunction(() => {
          const worker = navigator.serviceWorker.controller;
          return worker !== null && worker !== window.__cbFirstWorker && worker.state === 'activated';
        }, null, { timeout: 15000 }).then(() => true, () => false);
        ok(taken, 'copy B: 15 s after the reload of copy A, the worker of the second build does not control copy B');
        const oldUrl = new URL(`assets/${second.oldYard}`, `${base}/`).href;
        ok(await other.evaluate(async (url) => (await caches.match(url)) === undefined, oldUrl), `after the worker of the second build took control, a cache still holds the old Yard chunk ${second.oldYard}`);
        ok(await other.evaluate(() => window.__cbSmokeOpen) === 'first build', 'copy B reloaded before its learner pressed a control');
        await other.evaluate(() => { location.hash = '#/yard'; });
        const failed = other.locator('.yard-host [role="alert"]');
        await failed.waitFor().catch(async () => {
          const shows = (await other.locator('main').innerText().catch(() => '')).replace(/\s+/g, ' ').trim().slice(0, 160);
          throw new CaseFailure(`copy B with the first build opened the Yard after the old chunk was gone: the Yard shows no alert that it did not load. The view shows: "${shows}"`);
        });
        const said = (await failed.innerText()).replace(/\s+/g, ' ').trim();
        ok(said.startsWith('This station did not load.'), `copy B: the alert of the Yard says "${said}", and "This station did not load." is expected`);
        ok((await other.locator('main h2').first().innerText()).includes('The Yard'), 'copy B: the view of the Yard has no heading');
        const otherReload = failed.getByRole('button', { name: 'Reload', exact: true });
        ok(await otherReload.count() === 1, 'copy B: the alert of the Yard has no control "Reload"');
        // B's "Reload" loads the second build, and the Yard draws.
        await reloads(other, otherReload, 'copy B, the alert of the Yard');
        await yardRoute.check(other).catch((err) => { throw new CaseFailure(`copy B after its "Reload": the Yard did not draw: ${err.message.split('\n')[0]}`); });
        ok(await other.evaluate(() => document.querySelector('meta[name="cb-smoke-build"]')?.getAttribute('content')) === '2', 'copy B after its "Reload" does not show the second build');
        ok(otherErrors.length === 0, `copy B: ${otherErrors.join('; ')}`);
        return `the Yard chunk ${second.oldYard} became ${second.newYard} (${second.renamed.length} files renamed); copy A drew the Yard from the old chunk, then from the new one; copy B said "${said}" (${oldMissing} failed requests of the old chunk), then drew the Yard after its "Reload"`;
      });
    } finally {
      served.dir = distDir;
      rmSync(second.dir, { recursive: true, force: true });
    }
  } },

  { name: '17 failed load', async run() {
    // Row U-07 (2c-plan C9; R6 ENG-02): one content file does not load. The notice of the shell
    // shows with its control, Home shows no "Coming soon", and the control loads the file. The file
    // is blocked one time and answered with a 404 one time, as in the trial of ENG-02.
    const BLOCKED = '**/data/rules.json';
    const liveTiles = (page) => page.locator(hook('domain-card')).evaluateAll((els) => els.filter((el) => el.tagName === 'BUTTON').length);
    const all = await withPage({}, async (page) => {
      await open(page, '/');
      await page.locator(hook('domain-card')).first().waitFor();
      ok(await page.getByText(FAILED_NOTICE).count() === 0, `the notice "${FAILED_NOTICE}" shows when each file loaded`);
      return liveTiles(page);
    });
    for (const how of ['blocked', 'answered 404']) {
      await withPage({ expectedError: (text, url) => /\/data\/rules\.json$/.test(url) }, async (page, context) => {
        await context.route(BLOCKED, (route) => (how === 'blocked' ? route.abort() : route.fulfill({ status: 404, body: 'not found' })));
        await open(page, '/');
        await page.locator(hook('domain-card')).first().waitFor();
        const notice = page.getByText(FAILED_NOTICE, { exact: true });
        await notice.waitFor().catch(() => { throw new CaseFailure(`rules.json ${how}: the notice "${FAILED_NOTICE}" did not show`); });
        const retry = page.locator('p', { has: notice }).getByRole('button', { name: 'Try again', exact: true });
        ok(await retry.count() === 1, `rules.json ${how}: the notice has no control "Try again"`);
        ok(await page.getByText('Coming soon').count() === 0, `rules.json ${how}: Home shows "Coming soon"`);
        const before = await liveTiles(page);
        ok(before < all, `rules.json ${how}: Home shows ${before} domain tiles to drill, as many as when each file loaded`);
        // The file loads again: the control loads it, the notice goes, and each tile is back.
        await context.unroute(BLOCKED);
        await retry.click();
        await notice.waitFor({ state: 'detached' }).catch(() => { throw new CaseFailure(`rules.json ${how}: the notice stays after "Try again"`); });
        await page.waitForFunction(([selector, n]) => [...document.querySelectorAll(selector)].filter((el) => el.tagName === 'BUTTON').length === n, [hook('domain-card'), all])
          .catch(async () => { throw new CaseFailure(`rules.json ${how}: after "Try again" Home shows ${await liveTiles(page)} domain tiles to drill, and ${all} are expected`); });
      });
    }
  } },

  { name: '18 storage refused', async run() {
    // Row U-07 (R6 ENG-02): the browser refuses the storage of the site. Each of the six routes
    // draws its key element, with 0 page errors and 0 console errors. The Yard draws.
    for (const r of ROUTES) {
      await withPage({ storage: false }, async (page) => {
        await open(page, r.route);
        ok(await page.evaluate(() => { try { void localStorage.length; return false; } catch { return true; } }), 'the storage of the site is not refused');
        await r.check(page).catch(async (err) => {
          const shows = (await page.locator('main').innerText().catch(() => '')).replace(/\s+/g, ' ').trim().slice(0, 160);
          throw new CaseFailure(`storage refused, ${r.name}: ${err.message.split('\n')[0]} The view shows: "${shows}"`);
        });
      });
    }
  } },

  { name: '19 cache budget', async run() {
    // Row U-43 (R6 ENG-22): the offline cache of the build (the precache list of the service worker)
    // is 5 MB or less. A file of the list that the build does not hold fails the case: the sum would
    // then be false.
    const list = precacheList(distDir);
    const missing = list.filter((url) => !existsSync(join(distDir, url)));
    ok(missing.length === 0, `the precache list of sw.js names ${missing.length} files that the build does not hold: ${missing.join(', ')}`);
    const sizes = list.map((url) => ({ url, bytes: statSync(join(distDir, url)).size })).sort((a, b) => b.bytes - a.bytes);
    const total = sizes.reduce((sum, f) => sum + f.bytes, 0);
    const largest = sizes.slice(0, 3).map((f) => `${f.url} ${f.bytes}`).join(', ');
    ok(total <= CACHE_BUDGET, `the offline cache is ${total} bytes in ${list.length} files, over the budget of ${CACHE_BUDGET} bytes (5 MB). The largest files: ${largest}`);
    return `the offline cache is ${total} bytes (${(total / 1024).toFixed(2)} KiB) in ${list.length} files: ${(100 * total / CACHE_BUDGET).toFixed(1)} % of the budget of ${CACHE_BUDGET} bytes (5 MB). The largest files: ${largest}.`;
  } },

  // The cases from 20 on enter the gate at the closing commit of the G1 line after Wave 2c-2.
  { name: '20 yard to a win', async run() {
    // Gate A, question 2 (D-0033): a learner plays a job to a win at phone width. The first job is
    // played to a win along its optimal line two times: at 390 by 844 px by touch only (taps on the
    // six switch buttons and on the move builder), and at 1440 by 900 px by the keyboard only (Tab and
    // Shift+Tab, Space and Enter, and the arrow keys in a select). See playToWin.
    const notes = [];
    for (const how of [TOUCH, KEYBOARD]) notes.push(await playToWin(how));
    return notes.join('. ');
  } },

  { name: '21 focus after a change of route', async run() {
    // 2c-plan C7 (rows U-29, A11Y-22, A11Y-23): after a change of route, focus is on the first h2 of
    // #view, on each route at 390 and 1440. This was the report case of G1-2. Job U1-D made the Drill
    // and Signals keep their heading (ruling C7-DRILL), so it is a gate now. The case opens another
    // route first, changes the route in the page, and waits for the first screen of the route with no
    // press, and for the end of the wait of the shell (it holds focus on #view while the heading of an
    // island is not there).
    const misses = [];
    for (const width of [390, 1440]) {
      for (const r of ROUTES) {
        const from = ROUTES.find((x) => x.route === (r.route === '/' ? '/reference' : '/'));
        const found = await withPage({ width }, async (page) => {
          await open(page, from.route);
          await from.check(page);
          await page.evaluate((route) => { location.hash = `#${route}`; }, r.route);
          await (r.ready ?? r.check)(page);
          const settled = await page.waitForFunction(() => document.activeElement !== document.querySelector('main#view'), null, { timeout: 5000 }).then(() => true, () => false);
          if (!settled) return 'main#view (the heading did not come)';
          return page.evaluate(() => {
            const heading = document.querySelector('#view h2');
            const el = document.activeElement;
            if (heading && el === heading) return null;
            return el ? `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${[...el.classList].map((c) => `.${c}`).join('')}` : 'nothing';
          });
        });
        if (found) misses.push(`${r.name} at ${width}: focus is on ${found}`);
      }
    }
    ok(misses.length === 0, `after a change of route, focus is not on the first h2 of #view on ${misses.length} routes and widths: ${misses.join('; ')}`);
  } },

  { name: '22 learn card', async run() {
    // Row U-28 (ruling LEARN-GAP, 2c-plan C11): the Drill shows a new item one time, on a learn card,
    // before the first question about it. For a new profile on #/drill and #/signals, at 390 and 1440:
    // the first screen is a learn card with the hooks of C11 (the card and its one control); its heading
    // is the title of an item of the data, and the card holds the plain words of that item as the data
    // holds them (a signal: its drawings, each one different); each control of the screen is 44 by 44 px
    // or more. At 1440 the case walks the whole session: no question about the item of a card comes
    // right after its card; no item gets two cards; no question about the item of a card comes before
    // its card; and each item of a card gets a question later in the session. The item of a question
    // is the item that its feedback names ("<title> — <words>"). The case reads no rule text: the
    // titles and the plain words come from the content files of the build.
    const items = [];
    for (const file of ['definitions.json', 'signals.json', 'rules.json', 'radio-script.json']) items.push(...JSON.parse(readFileSync(join(distDir, 'data', file), 'utf8')));
    const byTitle = new Map(items.map((i) => [i.title, i]));
    const words = (text) => (text ?? '').replace(/\s+/g, ' ').trim();
    // The item that a feedback names: the title that comes first in the feedback with " — " after it
    // (the words of the item come after the title); of two such titles at one place, the longer one.
    const itemOfFeedback = (text) => items
      .map((i) => ({ i, at: text.indexOf(`${i.title} — `) }))
      .filter((m) => m.at !== -1)
      .sort((a, b) => a.at - b.at || b.i.title.length - a.i.title.length)[0]?.i ?? null;
    const notes = [];
    for (const route of ['/drill', '/signals']) {
      for (const width of [390, 1440]) {
        const where = `${route} at ${width}`;
        const note = await withPage({ width }, async (page) => {
          await open(page, route);
          await firstScreen(page).catch(() => { throw new CaseFailure(`${where}: the first screen shows no learn card and no answer option`); });
          // The card of the first screen: the hooks, the item of the data, the controls.
          const checkCard = async (k) => {
            const card = page.locator(LEARN_CARD);
            ok(await card.count() === 1 && await card.isVisible(), `${where}, screen ${k}: ${await card.count()} learn cards (${LEARN_CARD}) show, and 1 is expected`);
            const next = page.locator(LEARN_NEXT);
            ok(await next.count() === 1 && await next.isVisible() && await next.isEnabled(), `${where}, screen ${k}: the learn card has ${await next.count()} controls ${LEARN_NEXT}, and 1 that shows is expected`);
            ok(await count(page, hook('opt')) === 0, `${where}, screen ${k}: an answer option shows with the learn card`);
            const title = words(await card.getByRole('heading').first().textContent());
            const item = byTitle.get(title);
            ok(item, `${where}, screen ${k}: the heading of the learn card is "${title}", and no item of the data has this title`);
            const text = words(await card.textContent());
            ok(text.includes(words(item.plain)), `${where}, screen ${k}: the learn card of ${item.id} does not hold the plain words of the item as the data holds them`);
            if (item.type === 'signal') {
              const drawings = await card.locator('svg').evaluateAll((els) => els.map((el) => el.outerHTML));
              const aspects = item.payload?.aspects?.length ?? 0;
              ok(drawings.length >= 1 && drawings.length <= aspects, `${where}, screen ${k}: the learn card of the signal ${item.id} shows ${drawings.length} drawings, and 1 to ${aspects} are expected`);
              ok(new Set(drawings).size === drawings.length, `${where}, screen ${k}: the learn card of the signal ${item.id} shows one drawing two times`);
            }
            const small = await smallControls(page);
            ok(small.length === 0, `${where}, screen ${k}: ${small.length} controls of the learn card screen are under 44 by 44 px: ${small.join('; ')}`);
            return item;
          };
          const first = await checkCard(1);
          if (width !== 1440) return null;
          // The walk of the session.
          const carded = new Set();
          const asked = new Set();
          let last = null;
          let screens = 0;
          let ended = false;
          for (let k = 1; k <= 60; k++) {
            const state = await page.waitForFunction(([cardSel, optSel]) => {
              const shows = (s) => [...document.querySelectorAll(s)].some((el) => el.getClientRects().length > 0);
              if (shows(cardSel)) return 'card';
              if (shows(optSel)) return 'question';
              return document.querySelector('#view h3') && !shows(cardSel) && !shows(optSel) ? 'end' : false;
            }, [LEARN_CARD, hook('opt')]).then((h) => h.jsonValue(), () => { throw new CaseFailure(`${where}, screen ${k}: no learn card, no question and no end of the session showed`); });
            if (state === 'end') { ended = true; break; }
            screens = k;
            if (state === 'card') {
              const item = k === 1 ? first : await checkCard(k);
              ok(!carded.has(item.id), `${where}, screen ${k}: the item ${item.id} gets a second learn card`);
              ok(!asked.has(item.id), `${where}, screen ${k}: the learn card of ${item.id} comes after a question about it`);
              carded.add(item.id);
              last = { kind: 'card', item };
              const words0 = words(await page.locator(LEARN_CARD).textContent());
              await onControl(`${where}, screen ${k}: a click on ${LEARN_NEXT}`, () => page.locator(LEARN_NEXT).click());
              await page.waitForFunction(([s, w]) => { const el = document.querySelector(s); return !el || el.textContent.replace(/\s+/g, ' ').trim() !== w; }, [LEARN_CARD, words0])
                .catch(() => { throw new CaseFailure(`${where}, screen ${k}: the control ${LEARN_NEXT} did not move the page on`); });
              continue;
            }
            // A question: answer it, and read the item from its feedback.
            await onControl(`${where}, screen ${k}: a click on an answer option`, () => page.locator(hook('opt')).first().click());
            const feedback = page.locator(hook('feedback')).first();
            await feedback.waitFor().catch(() => { throw new CaseFailure(`${where}, screen ${k}: no feedback showed after an answer`); });
            const item = itemOfFeedback(await feedback.textContent());
            ok(item, `${where}, screen ${k}: the feedback names no item of the data: "${words(await feedback.textContent())}"`);
            ok(!(last?.kind === 'card' && last.item.id === item.id), `${where}, screen ${k}: the question about ${item.id} comes right after its learn card`);
            asked.add(item.id);
            last = { kind: 'question', item };
            await onControl(`${where}, screen ${k}: a click on "Next →" or "Finish"`, () => feedback.getByRole('button', { name: /^(Next →|Finish)$/ }).click());
            await feedback.waitFor({ state: 'detached' }).catch(() => { throw new CaseFailure(`${where}, screen ${k}: the feedback stays after its control "Next →" or "Finish"`); });
          }
          ok(ended, `${where}: the session did not end in 60 screens`);
          ok(carded.size > 0, `${where}: the session shows no learn card`);
          const unasked = [...carded].filter((id) => !asked.has(id));
          ok(unasked.length === 0, `${where}: the items ${unasked.join(', ')} get a learn card and no question in the session`);
          return `${where}: ${screens} screens, ${carded.size} learn cards, ${asked.size} items asked`;
        });
        if (note) notes.push(note);
      }
    }
    return notes.join('; ');
  } },

  // Case 23 enters the gate in fix round 2 of Wave 2c (job F2-C).
  { name: '23 yard play all with reduced motion', async run() {
    // Ruling PLAY-ALL-ONE (finding F-11): with "Reduce motion" on, "▶ Play all" plays each step that
    // remains at once, in one task, and a screen reader gets only the last text that the status region
    // gets in a task. So one press of "▶ Play all" must give one text in #yard-live, and that text holds
    // each step that the press played, in order: "Step k of N: <the call>." and then the readout after
    // step k (firstMissingStep). The case presses it at step 0 of the first job, and again after Next.
    // "Reduce motion" is on by the setting at 1440 and by the device flag at 390. After each press the
    // banner says the last step, and the readout and the step counter show the end of the line, as with
    // motion on (case 8). Case 8 checks that with motion on each step keeps its own text.
    const job = YARD_JOB;
    const states = lineStates(job);
    const n = job.opt.length;
    const notes = [];
    for (const [way, options] of [['the setting', { width: 1440, settings: { ...allOff, reduce: true } }], ['the device flag', { width: 390, reduce: true }]]) {
      const where = `"Reduce motion" on by ${way}, at ${options.width}`;
      notes.push(await withPage(options, async (page) => {
        await open(page, '/yard');
        await page.locator('#optimal').waitFor();
        ok(await page.evaluate(() => document.documentElement.dataset.reduce) === '1', `${where}: "Reduce motion" is not on`);
        ok(await page.locator('#picker').inputValue() === String(PUZZLES.indexOf(job)), `${where}: the picker is not on the first job ${job.id}`);
        const said = [];
        for (const first of [1, 2]) {
          // "▶ Watch optimal" opens the stepper at step 0. For the second press, Next plays step 1 first.
          await click(page, '#optimal');
          await waitText(page, '#yard-demo-count', `0 / ${n}`, `${where}: after "▶ Watch optimal"`);
          if (first === 2) {
            await click(page, '#yard-next');
            await waitText(page, '#yard-demo-count', `1 / ${n}`, `${where}: after Next`);
          }
          const when = `${where}: one press of "▶ Play all" at step ${first - 1} of ${job.id}`;
          await recordLive(page);
          await click(page, '#yard-play');
          await waitText(page, '#yard-demo-count', `${n} / ${n}`, when);
          const texts = await liveTexts(page);
          ok(texts.length === 1, `${when} gave the status region #yard-live ${texts.length} texts (${texts.map((t) => `steps [${stepsSaid(t).join(', ')}]`).join(' ')}), and one text with the steps ${first} to ${n} is expected`);
          const text = texts[0];
          const missing = firstMissingStep(text, job, states, first);
          ok(missing === null, `${when}: the text of #yard-live names the steps [${stepsSaid(text).join(', ')}], and "${missing}" is not in it in order. Each step from ${first} to ${n} is expected, in order`);
          ok(stepsSaid(text).length === n - first + 1, `${when}: the text of #yard-live names the steps [${stepsSaid(text).join(', ')}], and only the steps ${first} to ${n} are expected`);
          ok(await page.locator('#yard-live').textContent() === text, `${when}: #yard-live does not keep the text of the press`);
          const banner = await page.locator('#msg').textContent();
          ok(banner.startsWith(`Step ${n} of ${n}: ${callWords(job.opt[n - 1])}.`), `${when}: the banner says "${banner}", and the last step "Step ${n} of ${n}" is expected`);
          await waitText(page, '#readout', READOUT(states[n].moves, job.par, states[n].joints), `${when}, the readout`);
          said.push(`at step ${first - 1}, one text of ${text.length} characters with the steps ${first} to ${n}`);
          // "Stop watching" loads the job again, at its start.
          await click(page, '#optimal');
          await waitText(page, '#readout', READOUT(0, job.par, 0), `${where}: after "Stop watching"`);
        }
        return `${where}: ${said.join('; ')}`;
      }));
    }
    return notes.join('. ');
  } },
];

// ---- The report-only cases. Each one prints PENDING with its count. It is a gate only after the
// closing commit of the G1 line makes it one. After Wave 2c no case is report-only: the report case
// of contract C7 is gate case 21. A report-only case returns its count, or an object with the count
// and the list of what it found, and has the fields `owner` and `what`.
const REPORT_CASES = [];

// ---- The words of the shell notices (rows U-10 and U-07, job U1-B).
const UPDATE_NOTICE = 'A new version is ready.';
const FAILED_NOTICE = 'Part of the library did not load.';

// ---- The second build of the update case, as a release that changes the sources of the Yard gives
// it (the trial of R6 ENG-01). It is a copy of the build with these changes:
//   - The station chunk of the Yard (assets/yardSim-*.js) gets a new name. The old file is not in the
//     copy, so the server no longer holds it.
//   - A file of assets/ whose text names a renamed file changes, and a build gives a changed file of
//     assets/ a new name. So each such file gets a new name too, until no more file changes: today the
//     main chunk, which imports the Yard chunk. Each name in index.html, in sw.js and in assets/ is
//     changed to the new name.
//   - The page of the app holds one more meta element, so that a case can see which build shows.
//   - The precache list of sw.js names the new files, and the new revision of the page (the MD5 of the
//     file, as Workbox writes it). So sw.js changes, and the browser finds a new worker.
// The copy is in the folder of temporary files and is removed after the case. Returns the folder and
// the old and new name of the Yard chunk.
function secondBuild(dir) {
  const copy = mkdtempSync(join(tmpdir(), 'cb-smoke-second-build-'));
  cpSync(dir, copy, { recursive: true });
  const assets = join(copy, 'assets');
  const files = readdirSync(assets).filter((f) => /\.(js|css)$/.test(f));
  const yard = files.filter((f) => /^yardSim-[\w-]+\.js$/.test(f));
  if (yard.length !== 1) throw new CaseFailure(`the second build cannot be made: the build holds ${yard.length} station chunks of the Yard (assets/yardSim-*.js), and 1 is expected`);
  const newName = (name) => name.replace(/-[\w-]+\.(js|css)$/, (m, ext) => `-${createHash('sha256').update(`second build ${name}`).digest('base64url').slice(0, 8)}.${ext}`);
  const renamed = new Map();
  const queue = [yard[0]];
  while (queue.length) {
    const name = queue.shift();
    if (renamed.has(name)) continue;
    renamed.set(name, newName(name));
    for (const f of files) if (!renamed.has(f) && readFileSync(join(assets, f), 'utf8').includes(name)) queue.push(f);
  }
  const rename = (text) => [...renamed].reduce((t, [from, to]) => t.split(from).join(to), text);
  for (const f of files) writeFileSync(join(assets, f), rename(readFileSync(join(assets, f), 'utf8')));
  for (const [from, to] of renamed) renameSync(join(assets, from), join(assets, to));
  const page = rename(readFileSync(join(copy, 'index.html'), 'utf8'));
  if (!page.includes('</head>')) throw new CaseFailure('the second build cannot be made: index.html has no </head>');
  const changed = page.replace('</head>', '<meta name="cb-smoke-build" content="2"></head>');
  writeFileSync(join(copy, 'index.html'), changed);
  const sw = rename(readFileSync(join(copy, 'sw.js'), 'utf8'));
  const entry = /\{url:"index\.html",revision:"[0-9a-f]+"\}/;
  if (!entry.test(sw)) throw new CaseFailure('the second build cannot be made: the precache list of sw.js has no entry of index.html with a revision');
  for (const to of renamed.values()) if (!sw.includes(`assets/${to}`)) throw new CaseFailure(`the second build cannot be made: the precache list of sw.js does not name assets/${to}`);
  writeFileSync(join(copy, 'sw.js'), sw.replace(entry, `{url:"index.html",revision:"${createHash('md5').update(changed).digest('hex')}"}`));
  return { dir: copy, oldYard: yard[0], newYard: renamed.get(yard[0]), renamed: [...renamed.keys()] };
}

// ---- The precache list of the service worker of a build: the address of each file, from the
// list that sw.js gives to precacheAndRoute. The list is found by its call and its brackets, and
// evaluated in an empty node:vm context.
const CACHE_BUDGET = 5 * 1024 * 1024;   // 5 MB, as SPEC.md sets the budget (R6 ENG-22: 5,242,880 bytes)
function precacheList(dir) {
  const file = join(dir, 'sw.js');
  if (!existsSync(file)) throw new CaseFailure(`${file} does not exist: the build has no service worker`);
  const text = readFileSync(file, 'utf8');
  const call = text.indexOf('precacheAndRoute(');
  if (call === -1 || text.indexOf('precacheAndRoute(', call + 1) !== -1) throw new CaseFailure('sw.js does not hold exactly one call of precacheAndRoute');
  const start = text.indexOf('[', call);
  let depth = 0;
  let quote = null;
  let end = -1;
  for (let i = start; i < text.length && end === -1; i++) {
    const c = text[i];
    if (quote) { if (c === '\\') i++; else if (c === quote) quote = null; continue; }
    if (c === '"' || c === "'" || c === '`') quote = c;
    else if (c === '[') depth++;
    else if (c === ']' && --depth === 0) end = i;
  }
  if (start === -1 || end === -1) throw new CaseFailure('the precache list of sw.js has no end');
  const entries = vm.runInNewContext(`(${text.slice(start, end + 1)})`, Object.create(null), { timeout: 2000 });
  ok(Array.isArray(entries) && entries.length > 0 && entries.every((e) => typeof e?.url === 'string'), 'the precache list of sw.js is not a list of entries with a url');
  return entries.map((e) => decodeURIComponent(e.url.split(/[?#]/)[0]));
}

// ---- Record the tape, or run the cases.
const seconds = (ms) => `${(ms / 1000).toFixed(2)} s`;
let exitCode = 0;
try {
  if (flag('--record-tape')) {
    const commit = option('--commit');
    if (!commit || !/^[0-9a-f]{40}$/.test(commit)) stop('--record-tape needs --commit <the full commit of the build that is served>');
    const records = [];
    await withPage({}, (page) => walkGuidedRadio(page, (press, text) => { records.push({ press, ...record(text) }); }));
    const tape = {
      note: 'The word tape of the guided Radio. tests/browser/smoke.mjs recorded it and compares the page with it. A record is the SHA-256 and the word count of the visible text of .radio-wrap, with each run of white space made one space: before the first press of the key control (press 0) and after each of the 14 presses. The text is read as the markup writes it: text-transform is off while it is read. The file holds no text of the page. A build job does not edit this file.',
      commit,
      selector: '.radio-wrap',
      records,
    };
    writeFileSync(TAPE_PATH, `${JSON.stringify(tape, null, 2)}\n`);
    console.log(`smoke: recorded ${records.length} records from the build of ${commit} -> ${TAPE_PATH}`);
  } else {
    const wanted = (c) => !only || c.name.toLowerCase().includes(only);
    const started = Date.now();
    let failed = 0;
    let ran = 0;
    for (const c of GATE_CASES.filter(wanted)) {
      const t0 = Date.now();
      ran++;
      try {
        // A case can return a note. The note says what the case did not compare.
        const note = await c.run();
        console.log(`PASS  ${c.name}  ${seconds(Date.now() - t0)}`);
        if (typeof note === 'string' && note) console.log(`      ${note}`);
      } catch (err) {
        failed++;
        console.log(`FAIL  ${c.name}  ${seconds(Date.now() - t0)}\n      ${err instanceof CaseFailure ? err.message : String(err.stack ?? err).split('\n').slice(0, 4).join('\n      ')}`);
      }
    }
    for (const c of REPORT_CASES.filter(wanted)) {
      const t0 = Date.now();
      try {
        const result = await c.run();
        const n = typeof result === 'number' ? result : result.count;
        console.log(`PENDING  ${c.name}  count ${n}  ${seconds(Date.now() - t0)}  (report only; owner ${c.owner}; ${c.what}${n > 0 ? '' : '; the count is 0 on this build, so the case can be a gate when its owner is merged'})`);
        for (const line of (typeof result === 'object' ? result.found : []) ?? []) console.log(`      ${line}`);
      } catch (err) {
        console.log(`PENDING  ${c.name}  count not known  ${seconds(Date.now() - t0)}  (report only; owner ${c.owner}; the case did not run: ${String(err.message).split('\n')[0]})`);
      }
    }
    console.log(`\nsmoke: ${ran - failed} of ${ran} gate cases passed in ${seconds(Date.now() - started)}.${REPORT_CASES.length ? ' A report-only case does not change the result.' : ''}`);
    if (ran === 0 && !REPORT_CASES.some(wanted)) { console.log(`smoke: no case has "${only}" in its name.`); exitCode = 2; }
    if (failed) exitCode = 1;
  }
} finally {
  await browser.close();
  await new Promise((done) => server.close(done));
}
process.exit(exitCode);
