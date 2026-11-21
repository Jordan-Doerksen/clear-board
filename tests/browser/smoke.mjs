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
// offline case. A case that needs the same questions on each run sets a seed before the page
// loads: a fixed generator in place of `Math.random`. Each gate case fails on a page error, on
// a console error, or on sideways scroll at 390 or 1440. The script prints PASS or FAIL and the
// time for each gate case, and exits non-zero when one gate case fails.
//
// A report-only case prints PENDING with a count and the job that owns the fix. It does not
// change the exit code. A count of 0 means that the case passes on this build. The closing
// commit of the G1 line turns a report-only case into a gate when its owner is merged and the
// case passes.
//
// An element is selected by "the hook, or the old selector" (the table HOOKS), so that a later
// job can replace an old class and put the hook on the same element, with no edit of this file.
// No case states a rule. The tape holds a hash and a word count of the page text, not the text.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

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
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8',
};
const server = createServer((request, response) => {
  const path = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
  let file = normalize(join(distDir, path));
  if (file !== distDir && !file.startsWith(distDir + sep)) { response.writeHead(403).end(); return; }
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

class CaseFailure extends Error {}
function ok(condition, message) {
  if (!condition) throw new CaseFailure(message);
}

// Open one page in a new context, run `body`, then make the common checks.
// Options: width (390 or 1440, or another width), seed, serviceWorker, settings (stored before
// the page loads), reduce (the device flag for reduced motion).
async function withPage(options, body) {
  const size = SIZES[options.width ?? 1440] ?? { width: options.width, height: 800 };
  const context = await browser.newContext({
    viewport: size,
    deviceScaleFactor: 1,
    locale: 'en-CA',
    timezoneId: 'America/Winnipeg',
    reducedMotion: options.reduce ? 'reduce' : 'no-preference',
    serviceWorkers: options.serviceWorker ? 'allow' : 'block',
  });
  const errors = [];
  try {
    if (options.seed !== false) await context.addInitScript(seedScript, options.seed ?? SEED);
    if (options.settings) {
      await context.addInitScript(([key, value]) => { if (!localStorage.getItem(key)) localStorage.setItem(key, value); }, [SETTINGS_KEY, JSON.stringify(options.settings)]);
    }
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    page.on('pageerror', (err) => errors.push(`page error: ${err.message}`));
    page.on('console', (message) => { if (message.type() === 'error' && !options.offlineNoise?.(message.text())) errors.push(`console error: ${message.text()}`); });
    const result = await body(page, context);
    if (options.common !== false) {
      ok(errors.length === 0, errors.join('; '));
      if (size.width === 390 || size.width === 1440) {
        const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        ok(over <= 0, `sideways scroll of ${over} px at ${size.width} px wide, on ${page.url().replace(base, '')}`);
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

// The six routes and the key element of each one.
const ROUTES = [
  { route: '/', name: 'home', async check(page) {
    await page.locator(hook('domain-card')).first().waitFor();
    ok(await count(page, hook('station')) > 0, 'Home has no station button');
  } },
  { route: '/reference', name: 'reference', async check(page) { await page.locator(hook('ref-row')).first().waitFor(); } },
  { route: '/drill', name: 'drill', async check(page) { await page.locator(hook('opt')).first().waitFor(); } },
  { route: '/signals', name: 'signals', async check(page) {
    await page.locator(hook('opt')).first().waitFor();
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

const storedJson = (page, key) => page.evaluate((k) => JSON.parse(localStorage.getItem(k) || 'null'), key);

// The text of the guided Radio, as the tape reads it: the visible text of `.radio-wrap`, with
// each run of white space made one space.
async function radioText(page) {
  return (await page.locator('.radio-wrap').innerText()).replace(/\s+/g, ' ').trim();
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
    await withPage({}, async (page) => {
      await open(page, '/yard');
      await page.locator('#optimal').waitFor();
      ok(await page.evaluate(() => document.documentElement.dataset.reduce) === '0', '"Reduce motion" is not off');
      ok(await page.locator('#picker').evaluate((el) => el.selectedIndex) === 0, 'the picker is not on the first job');
      const start = await page.locator('#readout').textContent();
      ok(start.startsWith('Moves 0 / par 5'), `the readout of the first job starts as "${start}", and "Moves 0 / par 5" is expected`);
      await page.locator('#optimal').click();
      await page.waitForFunction(() => document.querySelector('#readout').textContent.startsWith('Moves 5 / par 5'), null, { timeout: 30000 })
        .catch(async () => { throw new CaseFailure(`after 30 s the readout is "${await page.locator('#readout').textContent()}", and "Moves 5 / par 5" is expected`); });
    });
  } },

  { name: '9 offline', async run() {
    const offlineNoise = (text) => /net::ERR_INTERNET_DISCONNECTED/.test(text);
    await withPage({ serviceWorker: true, offlineNoise }, async (page, context) => {
      await open(page, '/');
      await page.locator(hook('domain-card')).first().waitFor();
      // Wait for the worker and for its cache to stop growing.
      await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
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
        await page.locator(hook('opt')).first().waitFor();
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
      await page.locator(hook('opt')).first().waitFor();
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
];

// ---- The report-only cases. Each one prints PENDING with its count. It is a gate only after
// the closing commit of the G1 line makes it one.
const reportPage = (options, body) => withPage({ common: false, ...options }, body);

const REPORT_CASES = [
  // The floor is 44 px, not 43.5 px (ruling TARGETS-44). The case becomes a gate when its count
  // is 0, in a later wave.
  { name: 'targets', owner: 'P-05: B1, B2, B3, Y3', what: 'controls under 44 by 44 px, on the six routes and the Settings dialog, at 390 and 1440', async run() {
    let small = 0;
    const measure = (page) => page.evaluate(() => {
      const shown = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; };
      let n = 0;
      for (const el of document.querySelectorAll('button, a, select, summary, input')) {
        if (el.disabled || !shown(el)) continue;
        const dialog = document.querySelector('dialog[open]');
        if (dialog && !dialog.contains(el)) continue;
        let r = el.getBoundingClientRect();
        const label = el.tagName === 'INPUT' ? el.closest('label') : null;
        if (label) { const l = label.getBoundingClientRect(); if (l.width * l.height > r.width * r.height) r = l; }
        if (r.width < 44 || r.height < 44) n++;
      }
      return n;
    });
    for (const width of [390, 1440]) {
      for (const r of ROUTES) {
        small += await reportPage({ width }, async (page) => { await open(page, r.route); await r.check(page); return measure(page); });
      }
      small += await reportPage({ width }, async (page) => {
        await open(page, '/');
        await page.locator(hook('settings-open')).first().click();
        await page.locator('dialog#settings[open]').waitFor();
        return measure(page);
      });
    }
    return small;
  } },

  { name: 'yard at 320', owner: 'P-11: Y3', what: 'px of sideways scroll on the Yard at 320 px wide', async run() {
    return reportPage({ width: 320 }, async (page) => {
      await open(page, '/yard');
      await page.locator('#picker').waitFor();
      return page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
    });
  } },

  { name: 'type modes in the islands', owner: 'P-06: Y1, Y3, B3', what: 'text elements of the Yard and the guided Radio that are not larger with "Bigger text" on', async run() {
    const sizes = (big, route, ready) => reportPage({ settings: { ...allOff, big } }, async (page) => {
      await open(page, route);
      await page.locator(ready).first().waitFor();
      return page.evaluate(() => [...document.querySelectorAll('main *')]
        .filter((el) => [...el.childNodes].some((node) => node.nodeType === 3 && node.textContent.trim()))
        .map((el) => parseFloat(getComputedStyle(el).fontSize)));
    });
    let notLarger = 0;
    for (const [route, ready] of [['/yard', '#picker'], ['/radio', '#keyBtn']]) {
      const off = await sizes(false, route, ready);
      const on = await sizes(true, route, ready);
      if (off.length !== on.length) throw new Error(`${route}: ${off.length} text elements with the setting off and ${on.length} with it on`);
      notLarger += off.filter((size, i) => !(on[i] > size)).length;
    }
    return notLarger;
  } },
];

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
      note: 'The word tape of the guided Radio. tests/browser/smoke.mjs recorded it and compares the page with it. A record is the SHA-256 and the word count of the visible text of .radio-wrap, with each run of white space made one space: before the first press of the key control (press 0) and after each of the 14 presses. The file holds no text of the page. A build job does not edit this file.',
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
        await c.run();
        console.log(`PASS  ${c.name}  ${seconds(Date.now() - t0)}`);
      } catch (err) {
        failed++;
        console.log(`FAIL  ${c.name}  ${seconds(Date.now() - t0)}\n      ${err instanceof CaseFailure ? err.message : String(err.stack ?? err).split('\n').slice(0, 4).join('\n      ')}`);
      }
    }
    for (const c of REPORT_CASES.filter(wanted)) {
      const t0 = Date.now();
      try {
        const n = await c.run();
        console.log(`PENDING  ${c.name}  count ${n}  ${seconds(Date.now() - t0)}  (report only; owner ${c.owner}; ${c.what}${n > 0 ? '' : '; the count is 0 on this build, so the case can be a gate when its owner is merged'})`);
      } catch (err) {
        console.log(`PENDING  ${c.name}  count not known  ${seconds(Date.now() - t0)}  (report only; owner ${c.owner}; the case did not run: ${String(err.message).split('\n')[0]})`);
      }
    }
    console.log(`\nsmoke: ${ran - failed} of ${ran} gate cases passed in ${seconds(Date.now() - started)}. A report-only case does not change the result.`);
    if (ran === 0 && !REPORT_CASES.some(wanted)) { console.log(`smoke: no case has "${only}" in its name.`); exitCode = 2; }
    if (failed) exitCode = 1;
  }
} finally {
  await browser.close();
  await new Promise((done) => server.close(done));
}
process.exit(exitCode);
