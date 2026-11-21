// tools/look/look.mjs: the look harness. `npm run look:baseline` and `npm run look:compare`.
//
// It takes one stable picture of each page of the config at each of its sizes, and records
// facts beside each picture. `compare` takes the pictures again and compares the pictures and
// the facts with the baseline. It needs `dist/` (run the build first) and Chromium. It uses
// the package `playwright` and no other package.
//
// Use: node tools/look/look.mjs baseline [--ref <commit>] [options]
//      node tools/look/look.mjs compare [--look] [--gate] [options]
//   --config <file>   The config. With no option: tools/look/cb.config.json.
//   --ref <commit>    baseline only. Build that commit outside the tree, from a `git archive`,
//                     with the installed node_modules, and take the baseline from that build.
//                     With no option the baseline comes from `dist/` of the working tree.
//   --look            compare only. A pixel difference is listed and does not fail. A control
//                     that is smaller and stays 44 by 44 px or more gives a warning only.
//   --gate            compare only. A shot that scrolls sideways fails, also when the baseline
//                     scrolls sideways.
//   --only <text>     Take only the shots whose name holds this text.
//   --dist <folder>   Serve this folder and not `dist/` of the repository.
//   --out <folder>    The output folder. With no option: `.look/` in the repository root.
//   --port <number>   Serve on this port, or on the port of the variable CB_PORT. With no
//                     option and no variable the system gives a free port.
//
// The output folder holds `baseline/`, `current/`, `diff/` and the report page `report.html`.
// It is not committed.
//
// The same on each run: a new browser process and a new page for each picture; a full-page
// picture at device scale factor 1; reduced motion on; the service worker blocked; a fixed
// page clock, locale and time zone; no request to another host; fonts awaited; CSS animations
// and the caret off; the pointer moved to the corner of the page; each `svg` element paused at
// time 0, so that a lamp of a signal drawing does not flash between two pictures; the whole
// page painted again from nothing before the picture; the picture taken until two pictures in
// a row of the page are equal. A page with `"seed": true` gets a fixed generator in place of
// `Math.random` before the page loads.
//
// `compare` fails on these facts: an element id that is gone (an id of `idsMayGo` gives a
// warning only); a class name that is gone (a class of `classesMayGo` gives a warning only; an
// entry can end with `*`); a new script error; more sideways scroll; a smaller smallest text;
// a word or a number that is gone or new; a control that is gone or smaller (with `--look`, a
// control that stays 44 by 44 px or more gives a warning only, with both sizes); a text mirror
// that a page names and that is not whole. A word and the name of a control are read as the
// markup writes them: a letter case that a style sets (text-transform) changes the picture only.
// Text that is visually hidden (a box of 1 by 1 px or less that clips its content, as the class
// dusk-sr does) is not page text: its words and its size are not read (ruling LOOK-MIRROR). The
// text of a content part of the register (`contentParts`) is not page text either: its words are
// not read. A select with no aria-label and no title is named by its label. With no `--look` a pixel
// difference fails also. The pixels are counted with no package: the SHA-256 of the two files is
// compared, and where they differ both are decoded in a browser page.
//
// The register of changes (ruling LOOK-EXACT). Each entry of the list `changes` of the config names
// the row that asks for the change (`row`), the full commit of the baseline that it was measured on
// (`baseline`), and the pages it holds for (`pages`; all pages when it names none). An entry holds
// for a compare only when the baseline was taken from the build of that commit (`--ref`): a baseline
// from `dist/` has no commit, and no entry holds for it. Each change that an entry names is expected,
// with its count:
//   `idsGo`, `classesGo`      ids and class names that the row takes out of the page. Each one must
//                             be gone.
//   `wordsGo`, `wordsCome`    objects of words, each with the count that the row takes out or puts
//                             in. For each word, the count now must be the count of the baseline,
//                             less each `wordsGo` and plus each `wordsCome` of the entries that hold.
//                             So a word that no row moved cannot go or come in the shadow of a row.
//   `controlsGo`              an object of control keys (`tag "name"`), each with the count of the
//                             controls of that key that the row takes out.
//   `controlsRenamed`         `{ count, gainWords }`: exactly `count` controls that are gone are the
//                             same controls under a new name. A new name holds each word of the old
//                             name, and each other word of it is in `gainWords`.
//   `smallestText`            the size in px of the smallest text of the page now, when the row
//                             makes it smaller than in the baseline.
//   `contentParts`            selectors of the parts of the page whose words come from the content
//                             files: the title and the plain words of an item, the name of an answer
//                             option, the prompt of a question, a drawing. In the baseline and now,
//                             the words of these parts are not read, and a control in such a part (or
//                             that is one) is named `(content)`. So the register holds no word of the
//                             text of an item (ruling REGISTER-FORM; ruling TAPE-FORM keeps content
//                             words out of the gates), and each other word of the page keeps its
//                             exact count. The facts of a shot hold the parts that they were read
//                             with. When the register names other parts than the baseline was read
//                             with, the shot fails: take the baseline again.
// A change of the register gives a warning that names its row. A change that no entry names fails,
// and a change that an entry names and that the page does not show fails too.
//
// A shot that does not reach its state (a page that does not load, an element that the page waits
// for and that does not show, a step that does not end) fails with a sentence, and the run goes on
// with the next shot (ruling LOOK-CRASH).
//
// A baseline is compared only with pictures from the same machine.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { passLearnCards } from '../lib/learn-card.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

// ---- The arguments.
const argv = process.argv.slice(2);
const command = argv[0];
const flag = (name) => argv.includes(name);
const option = (name) => { const i = argv.indexOf(name); return i !== -1 ? argv[i + 1] : undefined; };
function stop(message) {
  console.error(`look: ${message}`);
  process.exit(2);
}
if (command !== 'baseline' && command !== 'compare') stop('use: node tools/look/look.mjs baseline [--ref <commit>] | compare [--look] [--gate]');
const config = JSON.parse(readFileSync(resolve(root, option('--config') ?? 'tools/look/cb.config.json'), 'utf8'));

// The register must have the form of LOOK-EXACT. A key that the harness does not know stops the run:
// a key of an older form would otherwise allow nothing and say nothing.
const REGISTER_KEYS = ['row', 'baseline', 'what', 'pages', 'idsGo', 'classesGo', 'wordsGo', 'wordsCome', 'controlsGo', 'controlsRenamed', 'smallestText', 'contentParts'];
const count1 = (n) => Number.isInteger(n) && n > 0;
const pageNames = new Set(config.pages.map((p) => p.name));
for (const [k, c] of (config.changes ?? []).entries()) {
  const at = `the entry ${k + 1} of changes (row ${c.row ?? '?'})`;
  const extra = Object.keys(c).filter((key) => !REGISTER_KEYS.includes(key));
  if (extra.length) stop(`${at} has keys that the harness does not know: ${extra.join(', ')}`);
  if (typeof c.row !== 'string' || !c.row) stop(`${at} names no row`);
  if (!/^[0-9a-f]{40}$/.test(c.baseline ?? '')) stop(`${at} names no baseline commit in full (40 hex digits)`);
  if (c.pages && (!Array.isArray(c.pages) || c.pages.some((p) => !pageNames.has(p)))) stop(`${at} names a page that the config does not have`);
  for (const key of ['idsGo', 'classesGo']) if (c[key] && (!Array.isArray(c[key]) || !c[key].every((x) => typeof x === 'string' && x))) stop(`${at}: ${key} is not a list of names`);
  if (c.contentParts && (!Array.isArray(c.contentParts) || !c.contentParts.every((x) => typeof x === 'string' && x))) stop(`${at}: contentParts is not a list of selectors`);
  for (const key of ['wordsGo', 'wordsCome', 'controlsGo']) {
    if (c[key] && (typeof c[key] !== 'object' || Array.isArray(c[key]) || !Object.values(c[key]).every(count1))) stop(`${at}: ${key} is not an object with a count of 1 or more for each key`);
  }
  if (c.controlsRenamed && (!count1(c.controlsRenamed.count) || !Array.isArray(c.controlsRenamed.gainWords))) stop(`${at}: controlsRenamed needs a count of 1 or more and a list gainWords`);
  if (c.smallestText !== undefined && !(typeof c.smallestText === 'number' && c.smallestText > 0)) stop(`${at}: smallestText is not a size in px`);
}
const outDir = resolve(root, option('--out') ?? '.look');
const only = option('--only');
const ref = option('--ref');
if (ref && command !== 'baseline') stop('--ref is an option of baseline only');

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  stop('the package "playwright" is not installed. Install the packages of the lock file first.');
}

// ---- The build that is served.
let builtDir = null;
function buildRef(commit) {
  let full;
  try {
    full = execFileSync('git', ['rev-parse', '--verify', `${commit}^{commit}`], { cwd: root }).toString().trim();
  } catch {
    stop(`the commit ${commit} is not in this clone`);
  }
  builtDir = mkdtempSync(join(tmpdir(), 'cb-look-ref-'));
  const archive = execFileSync('git', ['archive', '--format=tar', full], { cwd: root, maxBuffer: 1 << 30 });
  execFileSync('tar', ['-x', '-C', builtDir], { input: archive });
  symlinkSync(join(root, 'node_modules'), join(builtDir, 'node_modules'), 'junction');
  console.log(`look: building the commit ${full} outside the tree`);
  execFileSync(process.execPath, [join(root, 'node_modules', 'vite', 'bin', 'vite.js'), 'build'], { cwd: builtDir, stdio: ['ignore', 'ignore', 'inherit'] });
  return { dir: join(builtDir, 'dist'), commit: full };
}
const source = ref ? buildRef(ref) : { dir: resolve(option('--dist') ?? join(root, 'dist')), commit: null };
const distDir = source.dir;
if (!existsSync(join(distDir, 'index.html'))) stop(`${distDir} holds no index.html. The look harness needs the build: run the build first.`);

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
await new Promise((done, fail) => { server.once('error', fail); server.listen(Number(option('--port') ?? process.env.CB_PORT ?? 0), '127.0.0.1', done); })
  .catch((err) => stop(`the server did not start: ${err.message}`));
const base = `http://127.0.0.1:${server.address().port}`;

// Each picture comes from a new browser process. In one process, the pages that were drawn
// before can change one or two pixels of a rounded edge of a later page, and then a picture
// depends on the order of the shots.
async function launch() {
  try {
    return await chromium.launch();
  } catch (err) {
    server.close();
    return stop(`Chromium did not start. The look harness needs the Chromium of Playwright.\n${String(err.message).split('\n')[0]}`);
  }
}

// ---- One shot.
function seedScript(start) {
  let state = start >>> 0;
  Math.random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

// The facts of the page. This function runs in the page. `mirror` is the text mirror that the
// config of the page names, or null. `parts` are the content parts of the register for the shot
// (ruling REGISTER-FORM): their words are not read, and a control in a part is named `(content)`.
function collectFacts([mirror, parts]) {
  const shown = (el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
  const partEls = parts.flatMap((selector) => {
    try {
      return [...document.querySelectorAll(selector)];
    } catch {
      throw new Error(`the content part "${selector}" of the register is not a selector`);
    }
  });
  const inPart = (el) => partEls.some((part) => part.contains(el));
  const collapse = (text) => (text ?? '').replace(/\s+/g, ' ').trim();
  // Visually hidden: a box of 1 by 1 px or less that clips its content (ruling LOOK-MIRROR). A
  // screen reader reads such text; the screen does not show it.
  const visuallyHidden = (el) => {
    const style = getComputedStyle(el);
    if (style.display === 'none') return false;
    const box = el.getBoundingClientRect();
    const clips = style.overflow === 'hidden' || style.overflowX === 'hidden' || style.clipPath !== 'none' || (style.clip !== '' && style.clip !== 'auto');
    return box.width <= 1 && box.height <= 1 && clips;
  };
  const hidden = [...document.body.querySelectorAll('*')].filter(visuallyHidden);
  const inHidden = (el) => hidden.some((h) => h.contains(el));
  const ids = [...new Set([...document.querySelectorAll('[id]')].map((el) => el.id))].sort();
  const classes = [...new Set([...document.querySelectorAll('[class]')].flatMap((el) => [...el.classList]))].sort();
  let smallest = null;
  for (const el of document.body.querySelectorAll('*')) {
    if (!shown(el) || inHidden(el)) continue;
    if (![...el.childNodes].some((node) => node.nodeType === 3 && node.textContent.trim())) continue;
    const px = parseFloat(getComputedStyle(el).fontSize);
    if (!smallest || px < smallest.px) smallest = { px, where: `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}: ${collapse(el.textContent).slice(0, 40)}` };
  }
  // The words and the names of the controls are read as the markup writes them. A rule with
  // text-transform changes the look of a word, not the word: the picture shows that change.
  // So text-transform is off while the text is read, and on again before a control is measured.
  // While the words are read, each visually hidden element is out of the layout, so that its text
  // is not page text. The mark and the rule go before the controls are named.
  const asWritten = document.createElement('style');
  asWritten.textContent = '*, *::first-letter, *::first-line { text-transform: none !important; } [data-look-hidden] { display: none !important; }';
  document.head.append(asWritten);
  for (const el of [...hidden, ...partEls]) el.setAttribute('data-look-hidden', '');
  const words = {};
  for (const word of collapse(document.body.innerText).split(' ')) if (word) words[word] = (words[word] ?? 0) + 1;
  for (const el of [...hidden, ...partEls]) el.removeAttribute('data-look-hidden');
  // The name of a control: its aria-label, its text (not for a select), its placeholder, its title,
  // the text of its label (a select only: ruling LOOK-MIRROR), or its id. A control in a content
  // part is named `(content)` (ruling REGISTER-FORM).
  const labelOf = (el) => collapse([...(el.labels ?? [])].map((label) => label.innerText).join(' '));
  const named = [];
  for (const el of document.querySelectorAll('button, a[href], select, input, textarea, summary, [role="tab"], [role="button"]')) {
    if (!shown(el)) continue;
    const tag = el.tagName.toLowerCase();
    const name = inPart(el) ? '(content)' : collapse(el.getAttribute('aria-label')) || (tag === 'select' ? '' : collapse(el.innerText)) || collapse(el.getAttribute('placeholder')) || collapse(el.getAttribute('title')) || (tag === 'select' ? labelOf(el) : '') || (el.id ? `#${el.id}` : '');
    named.push({ el, key: `${tag} "${name}"` });
  }
  asWritten.remove();
  const controls = named.map(({ el, key }) => {
    const box = el.getBoundingClientRect();
    return { key, width: Math.round(box.width * 100) / 100, height: Math.round(box.height * 100) / 100 };
  });
  // The text mirror: its lines, and the ids of the tracks that the page names in the attribute of
  // the config. The words of the lines are not compared: the mirror check reads the lines.
  let textMirror = null;
  if (mirror) {
    const list = document.querySelector(mirror.list);
    textMirror = {
      found: Boolean(list),
      lines: list ? [...list.children].map((li) => collapse(li.textContent)) : [],
      tracks: [...document.querySelectorAll(`[${mirror.trackAttribute}]`)].map((el) => el.getAttribute(mirror.trackAttribute)),
    };
  }
  const page = document.documentElement;
  return { ids, classes, smallestText: smallest, words, controls, textMirror, contentParts: parts, sidewaysScroll: Math.max(0, page.scrollWidth - page.clientWidth), pageWidth: page.scrollWidth, pageHeight: page.scrollHeight };
}

// The check of a text mirror (ruling LOOK-MIRROR): the mirror is in the page, and it has one line for
// the engine and one line for each track. A track line starts with the id of its track. The engine
// line is the first line, and it starts with no track id. The ids come from the page (the attribute
// of the config), and the config gives their count.
function mirrorFails(mirror, facts) {
  const m = facts.textMirror;
  if (!m || !m.found) return [`the text mirror ${mirror.list} is not in the page`];
  const fails = [];
  const tracks = [...new Set(m.tracks)];
  if (tracks.length !== mirror.tracks) fails.push(`the page names ${tracks.length} tracks in [${mirror.trackAttribute}], and ${mirror.tracks} are expected`);
  const startsWith = (line, id) => line === id || (line.startsWith(id) && !/[\w]/.test(line[id.length]));
  const trackOf = (line) => tracks.filter((id) => startsWith(line, id));
  for (const id of tracks) {
    const n = m.lines.filter((line) => startsWith(line, id)).length;
    if (n !== 1) fails.push(`the text mirror has ${n} lines for the track ${id}, and 1 is expected`);
  }
  const other = m.lines.filter((line) => trackOf(line).length === 0).length;
  if (other !== 1) fails.push(`the text mirror has ${other} lines that name no track, and 1 (the engine) is expected`);
  else if (trackOf(m.lines[0]).length !== 0) fails.push('the first line of the text mirror names a track, and the engine line is expected');
  if (m.lines.length !== tracks.length + 1) fails.push(`the text mirror has ${m.lines.length} lines, and ${tracks.length + 1} are expected (the engine and each track)`);
  return fails;
}

// A step of the config. `learnCards` presses the control of each learn card of the Drill that shows
// (2c-plan C11), until the element of its selector shows; with no learn card it presses nothing.
async function runStep(page, step) {
  if (step.learnCards) await passLearnCards(page, step.learnCards);
  else if (step.click) await page.locator(step.click).first().click();
  else if (step.focus) await page.locator(step.focus).first().focus();
  else if (step.press) await page.keyboard.press(step.press);
  else if (step.fill) await page.locator(step.fill).first().fill(step.text ?? '');
  else if (step.waitFor) await page.locator(step.waitFor).first().waitFor();
  else if (step.waitGone) await page.locator(step.waitGone).first().waitFor({ state: 'detached' });
  else throw new Error(`a step of the config has no known kind: ${JSON.stringify(step)}`);
}

// A shot that does not reach its state (ruling LOOK-CRASH). The message is a sentence.
class ShotFailure extends Error {}
// Run one part of a shot. When it does not end, the shot fails with the sentence `what`. A time-out
// gives the sentence only; another error gives the sentence and the first line of the error.
async function reach(what, part) {
  try {
    return await part();
  } catch (err) {
    if (err instanceof ShotFailure) throw err;
    throw new ShotFailure(err?.name === 'TimeoutError' ? what : `${what}: ${String(err?.message ?? err).split('\n')[0]}`);
  }
}

// Take one picture and its facts, in a new browser process, a new context and a new page. When the
// shot does not reach its state, the result holds `failure`, a sentence, and no picture. `commit` is
// the commit of the baseline, or null: the content parts of the register for that commit are read.
async function take(shot, commit) {
  const size = config.sizes[shot.size];
  const browser = await launch();
  const context = await browser.newContext({
    viewport: { width: size.width, height: size.height },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
    locale: config.locale,
    timezoneId: config.timezone,
  });
  const errors = [];
  try {
    await context.route('**/*', (route) => (route.request().url().startsWith(base) ? route.continue() : route.abort()));
    if (shot.page.seed) await context.addInitScript(seedScript, config.seed);
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    await page.clock.setFixedTime(new Date(config.clock));
    page.on('pageerror', (err) => errors.push(`page error: ${err.message}`));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(`console error: ${message.text()}`); });
    await reach(`the page #${shot.page.route} did not load in 15 s`, () => page.goto(`${base}/#${shot.page.route}`, { waitUntil: 'networkidle' }));
    if (shot.page.waitFor) await reach(`the element ${shot.page.waitFor} that the page waits for did not show in 15 s`, () => page.locator(shot.page.waitFor).first().waitFor());
    for (const [k, step] of (shot.page.steps ?? []).entries()) await reach(`step ${k + 1} of the page (${JSON.stringify(step)}) did not end in 15 s`, () => runStep(page, step));
    // Move the pointer off the page content, so that no picture shows a hover state of a step.
    await page.mouse.move(0, 0);
    await page.evaluate(async () => {
      await document.fonts.ready;
      // Paint the whole page again from nothing. A page that got its content in two paints
      // or more can keep one or two pixels of an edge from an earlier paint, and then two
      // pictures of the same page are not equal. The focus and an open dialog stay.
      const html = document.documentElement;
      const display = html.style.display;
      html.style.display = 'none';
      void html.offsetHeight;
      html.style.display = display;
      void html.offsetHeight;
      for (const svg of document.querySelectorAll('svg')) { svg.pauseAnimations(); svg.setCurrentTime(0); }
      await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
    });
    const facts = await page.evaluate(collectFacts, [shot.page.mirror ?? null, contentPartsFor(shot.page, commit)]);
    // The picture is taken until two pictures in a row of this page are equal. A page can
    // paint one more time after its content is there, and one pixel of an edge can change.
    const shoot = () => page.screenshot({ fullPage: true, animations: 'disabled', caret: 'hide', scale: 'css' });
    let png = await shoot();
    let settled = false;
    for (let i = 0; i < 6 && !settled; i++) {
      const next = await shoot();
      settled = next.equals(png);
      png = next;
      if (!settled) await page.waitForTimeout(100);
    }
    return { png, sha256: createHash('sha256').update(png).digest('hex'), facts: { ...facts, errors }, settled };
  } catch (err) {
    const sentence = err instanceof ShotFailure ? err.message : `the shot stopped: ${String(err?.message ?? err).split('\n')[0]}`;
    return { failure: `${sentence}${errors.length ? `. Before that: ${errors.join('; ')}` : ''}` };
  } finally {
    await browser.close();
  }
}

// Count the pixels that differ, in a browser page. The page decodes both files and makes the
// diff picture: a pale copy of the first picture, with a strong mark on each pixel that differs.
let diffBrowser = null;
let diffPage = null;
async function pixelDiff(a, b) {
  if (!diffPage) {
    diffBrowser = await launch();
    diffPage = await diffBrowser.newPage();
  }
  return diffPage.evaluate(async ([first, second]) => {
    const load = async (b64) => { const image = new Image(); image.src = `data:image/png;base64,${b64}`; await image.decode(); return image; };
    const [one, two] = [await load(first), await load(second)];
    const width = Math.max(one.width, two.width);
    const height = Math.max(one.height, two.height);
    const data = (image) => { const c = new OffscreenCanvas(width, height); const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(image, 0, 0); return g.getImageData(0, 0, width, height); };
    const p = data(one), q = data(two);
    const out = new ImageData(width, height);
    let different = 0;
    for (let i = 0; i < p.data.length; i += 4) {
      const x = (i / 4) % width, y = Math.floor(i / 4 / width);
      const inBoth = x < one.width && y < one.height && x < two.width && y < two.height;
      const same = inBoth && p.data[i] === q.data[i] && p.data[i + 1] === q.data[i + 1] && p.data[i + 2] === q.data[i + 2] && p.data[i + 3] === q.data[i + 3];
      if (same) {
        const grey = Math.round((p.data[i] + p.data[i + 1] + p.data[i + 2]) / 3);
        out.data[i] = out.data[i + 1] = out.data[i + 2] = 200 + Math.round(grey * 0.2);
      } else {
        different++;
        out.data[i] = 255; out.data[i + 1] = 0; out.data[i + 2] = 200;
      }
      out.data[i + 3] = 255;
    }
    const canvas = new OffscreenCanvas(width, height);
    canvas.getContext('2d').putImageData(out, 0, 0);
    const bytes = new Uint8Array(await (await canvas.convertToBlob({ type: 'image/png' })).arrayBuffer());
    let binary = '';
    for (let i = 0; i < bytes.length; i += 32768) binary += String.fromCharCode(...bytes.subarray(i, i + 32768));
    return { different, width, height, sameSize: one.width === two.width && one.height === two.height, diff: btoa(binary) };
  }, [a.toString('base64'), b.toString('base64')]);
}

// ---- Compare the facts of one shot.
// The floor of a target, in CSS px (fence rule 8). With `--look`, a control that is smaller than
// in the baseline and stays 44 by 44 px or more gives a warning with both sizes (ruling
// LOOK-SMALLER). A control under the floor in width or in height fails.
const TARGET_FLOOR = 44;
const mayGo = (name, list) => (list ?? []).some((entry) => (entry.endsWith('*') ? name.startsWith(entry.slice(0, -1)) : name === entry));

// The entries of the register that hold for a page and a baseline: the entries that were measured on
// the commit of the baseline and that name the page, or name no page (ruling LOOK-EXACT).
const changesFor = (page, commit) => (config.changes ?? []).filter((c) => commit && c.baseline === commit && (!c.pages || c.pages.includes(page.name)));
// The content parts of the entries that hold for a page and a baseline, in one sorted list (ruling
// REGISTER-FORM).
const contentPartsFor = (page, commit) => [...new Set(changesFor(page, commit).flatMap((c) => c.contentParts ?? []))].sort();
// The words of the name of a control, from its key `tag "name"`.
const tagOf = (key) => key.slice(0, key.indexOf(' '));
const nameWords = (key) => key.slice(key.indexOf('"') + 1, -1).split(' ').filter(Boolean);
// The words of `next` that `old` does not hold, or null when `next` does not hold each word of `old`.
function gainedWords(old, next) {
  const left = new Map();
  for (const w of nameWords(old)) left.set(w, (left.get(w) ?? 0) + 1);
  const gained = [];
  for (const w of nameWords(next)) {
    if (left.get(w) > 0) left.set(w, left.get(w) - 1);
    else gained.push(w);
  }
  return [...left.values()].every((n) => n === 0) ? gained : null;
}
const signed = (n) => (n > 0 ? `+${n}` : String(n));

// `commit` is the commit of the baseline, or null for a baseline from dist/.
function compareFacts(before, now, page, commit) {
  const fails = [];
  const warnings = [];
  const entries = changesFor(page, commit);
  // The words of both facts must be read with the content parts that the register names now.
  const parts = JSON.stringify(contentPartsFor(page, commit));
  if (JSON.stringify(before.contentParts ?? []) !== parts || JSON.stringify(now.contentParts ?? []) !== parts) {
    fails.push(`the baseline was read with the content parts ${JSON.stringify(before.contentParts ?? [])}, and the register names ${parts}: take the baseline again`);
  }
  const byRow = (lines) => {
    const map = new Map();
    for (const { rows, text } of lines) { const key = rows.join('; '); map.set(key, [...(map.get(key) ?? []), text]); }
    return map;
  };
  // Ids and class names. A name of a standing list of the contract (idsMayGo, classesMayGo) may go.
  // A name of the register must go.
  const registered = (key) => {
    const map = new Map();
    for (const c of entries) for (const name of c[key] ?? []) map.set(name, [...(map.get(name) ?? []), c.row]);
    return map;
  };
  for (const [what, key, standing, list] of [['element id', 'idsGo', config.idsMayGo, 'idsMayGo'], ['class name', 'classesGo', config.classesMayGo, 'classesMayGo']]) {
    const facts = what === 'element id' ? 'ids' : 'classes';
    const rows = registered(key);
    const lost = before[facts].filter((x) => !now[facts].includes(x));
    const listed = [];
    for (const name of lost) {
      if (rows.has(name)) warnings.push(`row ${rows.get(name).join('; ')}: the ${what} ${name} is gone, as the row expects`);
      else if (mayGo(name, standing)) listed.push(name);
      else fails.push(`${what === 'element id' ? 'an' : 'a'} ${what} is gone: ${name}`);
    }
    if (listed.length) warnings.push(`${listed.length} ${what}s are gone and are in ${list}: ${listed.join(' ')}`);
    for (const [name, r] of rows) {
      if (!before[facts].includes(name)) fails.push(`row ${r.join('; ')} expects the ${what} ${name} to go, and the baseline has no ${what} ${name}`);
      else if (now[facts].includes(name)) fails.push(`row ${r.join('; ')} expects the ${what} ${name} to go, and it is still in the page`);
    }
  }
  for (const error of now.errors.filter((e) => !before.errors.includes(e))) fails.push(`a new script error: ${error}`);
  if (now.sidewaysScroll > before.sidewaysScroll) fails.push(`sideways scroll: ${before.sidewaysScroll} px in the baseline, ${now.sidewaysScroll} px now`);
  // The smallest text. It can be smaller than in the baseline only when an entry gives its size now.
  const sized = entries.filter((c) => c.smallestText !== undefined);
  if (before.smallestText && now.smallestText) {
    const smaller = now.smallestText.px < before.smallestText.px - 0.01;
    const expected = sized.find((c) => Math.abs(c.smallestText - now.smallestText.px) <= 0.01);
    if (smaller && expected) warnings.push(`row ${expected.row}: the smallest text is ${now.smallestText.px} px, as the row expects (${before.smallestText.px} px in the baseline; ${now.smallestText.where})`);
    else if (smaller) fails.push(`smaller smallest text: ${before.smallestText.px} px in the baseline, ${now.smallestText.px} px now (${now.smallestText.where})`);
    for (const c of sized.filter((x) => Math.abs(x.smallestText - now.smallestText.px) > 0.01)) fails.push(`row ${c.row} expects the smallest text at ${c.smallestText} px, and it is ${now.smallestText.px} px (${now.smallestText.where})`);
  }
  // Each word: the count now must be the count of the baseline with the change of each entry, with
  // no more and no less. A word whose count no entry changes must keep its count.
  const expected = new Map();
  for (const c of entries) {
    for (const [key, sign] of [['wordsGo', -1], ['wordsCome', 1]]) {
      for (const [word, n] of Object.entries(c[key] ?? {})) {
        const e = expected.get(word) ?? { change: 0, rows: [] };
        e.change += sign * n;
        e.rows.push(`${c.row} ${signed(sign * n)}`);
        expected.set(word, e);
      }
    }
  }
  const gone = [];
  const added = [];
  const wrong = [];
  const allowedWords = [];
  for (const word of new Set([...Object.keys(before.words), ...Object.keys(now.words), ...expected.keys()])) {
    const was = before.words[word] ?? 0;
    const is = now.words[word] ?? 0;
    const e = expected.get(word);
    if (!e) {
      if (is < was) gone.push(was - is > 1 || is > 0 ? `${word} (${was} -> ${is})` : word);
      else if (is > was) added.push(is - was > 1 || was > 0 ? `${word} (${was} -> ${is})` : word);
      continue;
    }
    if (is - was === e.change) allowedWords.push({ rows: [...new Set(e.rows.map((r) => r.slice(0, r.lastIndexOf(' '))))], text: `${word} (${was} -> ${is})` });
    else wrong.push(`${word} (${was} -> ${is}; the register expects ${was} -> ${was + e.change}: ${e.rows.join('; ')})`);
  }
  if (gone.length) fails.push(`words or numbers that are gone: ${gone.slice(0, 40).join(' | ')}${gone.length > 40 ? ` | and ${gone.length - 40} more` : ''}`);
  if (added.length) fails.push(`words or numbers that are new: ${added.slice(0, 40).join(' | ')}${added.length > 40 ? ` | and ${added.length - 40} more` : ''}`);
  if (wrong.length) fails.push(`words or numbers with another count than the register expects: ${wrong.slice(0, 40).join(' | ')}${wrong.length > 40 ? ` | and ${wrong.length - 40} more` : ''}`);
  for (const [rows, texts] of byRow(allowedWords)) warnings.push(`row ${rows}: ${texts.length} ${texts.length === 1 ? 'word or number' : 'words or numbers'} changed as the row expects: ${texts.join(' | ')}`);
  // The controls. A control that is gone is a control that a row takes out (controlsGo, with its
  // count), or a control that a row renames (controlsRenamed); each other one fails.
  const group = (controls) => { const map = new Map(); for (const c of controls) map.set(c.key, [...(map.get(c.key) ?? []), c]); return map; };
  const was = group(before.controls);
  const is = group(now.controls);
  // The controls of the current page that the baseline does not hold: a renamed control can be one.
  const newKeys = [];
  for (const [key, list] of is) for (let i = was.get(key)?.length ?? 0; i < list.length; i++) newKeys.push(key);
  const allowedControls = [];
  const goes = entries.filter((c) => c.controlsGo);
  const renames = entries.filter((c) => c.controlsRenamed).map((c) => ({ c, found: 0 }));
  for (const [key, list] of was) {
    const current = is.get(key) ?? [];
    const lost = Math.max(0, list.length - current.length);
    const expectedGo = goes.reduce((n, c) => n + (c.controlsGo[key] ?? 0), 0);
    const rows = goes.filter((c) => c.controlsGo[key]).map((c) => c.row);
    if (expectedGo > 0) {
      if (lost >= expectedGo) allowedControls.push({ rows, text: `${key} is gone (${list.length} -> ${list.length - expectedGo})` });
      else fails.push(`row ${rows.join('; ')} expects ${expectedGo} controls ${key} to go, and ${lost} went (${list.length} -> ${current.length})`);
    }
    for (let k = expectedGo; k < lost; k++) {
      let renamed = null;
      for (const r of renames) {
        const at = newKeys.findIndex((n) => tagOf(n) === tagOf(key) && gainedWords(key, n)?.every((w) => r.c.controlsRenamed.gainWords.includes(w)));
        if (at !== -1) { renamed = { row: r.c.row, next: newKeys[at] }; r.found++; newKeys.splice(at, 1); break; }
      }
      if (renamed) allowedControls.push({ rows: [renamed.row], text: `${key} is now ${renamed.next}` });
      else fails.push(`a control is gone: ${key} (${list.length} -> ${current.length})`);
    }
    current.slice(0, list.length).forEach((c, i) => {
      if (c.width < list[i].width - 0.5 || c.height < list[i].height - 0.5) {
        const line = `a control is smaller: ${key}: ${list[i].width} by ${list[i].height} px in the baseline, ${c.width} by ${c.height} px now`;
        if (flag('--look') && c.width >= TARGET_FLOOR && c.height >= TARGET_FLOOR) warnings.push(`${line}; it stays ${TARGET_FLOOR} by ${TARGET_FLOOR} px or more (--look)`);
        else fails.push(line);
      }
    });
  }
  for (const c of goes) for (const key of Object.keys(c.controlsGo)) if (!was.has(key)) fails.push(`row ${c.row} expects controls ${key} to go, and the baseline has no such control`);
  for (const r of renames) if (r.found !== r.c.controlsRenamed.count) fails.push(`row ${r.c.row} expects ${r.c.controlsRenamed.count} controls with a new name, and ${r.found} have one`);
  for (const [rows, texts] of byRow(allowedControls)) {
    warnings.push(`row ${rows}: ${texts.length} ${texts.length === 1 ? 'control is gone or has' : 'controls are gone or have'} a new name, as the row expects: ${texts.slice(0, 3).join(' | ')}${texts.length > 3 ? ` | and ${texts.length - 3} more` : ''}`);
  }
  if (page.mirror) fails.push(...mirrorFails(page.mirror, now));
  return { fails, warnings };
}

// ---- The run.
const shots = [];
for (const page of config.pages) {
  for (const size of page.sizes ?? config.defaultSizes) {
    const name = `${page.name}@${size}`;
    if (!only || name.includes(only)) shots.push({ name, page, size });
  }
}
if (!shots.length) stop(`no shot has "${only}" in its name`);

const escapeHtml = (text) => String(text).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function writeReport(title, intro, rows) {
  const body = rows.map((row) => `<section><h2>${escapeHtml(row.name)}: ${escapeHtml(row.status)}</h2>
${row.lines.length ? `<ul>${row.lines.map((l) => `<li>${escapeHtml(l)}</li>`).join('')}</ul>` : ''}
<p>${row.images.map(([label, path]) => `<a href="${escapeHtml(path)}">${escapeHtml(label)}</a>`).join(' · ')}</p>
<div class="pictures">${row.images.map(([label, path]) => `<figure><img src="${escapeHtml(path)}" alt="${escapeHtml(`${row.name}, ${label}`)}" loading="lazy"><figcaption>${escapeHtml(label)}</figcaption></figure>`).join('')}</div></section>`).join('\n');
  writeFileSync(join(outDir, 'report.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
  :root { color-scheme: light dark; }
  body { font: 16px/1.5 system-ui, sans-serif; margin: 1.5rem; }
  section { border-top: 1px solid; margin-top: 1.5rem; padding-top: 0.5rem; }
  .pictures { display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-start; }
  figure { margin: 0; max-width: 100%; }
  img { max-width: min(100%, 480px); height: auto; border: 1px solid; }
</style></head><body>
<h1>${escapeHtml(title)}</h1>
${intro.map((line) => `<p>${escapeHtml(line)}</p>`).join('\n')}
<p>Each picture is a full page at device scale factor 1, with reduced motion on, so the app shows "Reduce motion" on.</p>
<p>The lamp animations of a signal drawing are stopped for the picture. A lamp that is still in a picture can be a lamp that flashes in the app: do not read the aspect of a signal from a picture.</p>
<p>A baseline is compared only with pictures from the same machine.</p>
${body}
</body></html>
`);
}

const started = Date.now();
let exitCode = 0;
try {
  if (command === 'baseline') {
    rmSync(outDir, { recursive: true, force: true });
    mkdirSync(join(outDir, 'baseline'), { recursive: true });
    const rows = [];
    const manifest = { made: new Date().toISOString(), commit: source.commit, source: source.commit ? `the build of the commit ${source.commit}` : 'dist/ of the working tree', shots: {} };
    let failedShots = 0;
    for (const shot of shots) {
      // Two takes must be equal. If they are not, the harness takes the picture again. A shot that
      // does not reach its state fails with its sentence, and the run goes on (LOOK-CRASH).
      let first = await take(shot, source.commit);
      let takes = 1;
      let stable = false;
      while (!first.failure && takes < 4 && !stable) {
        const next = await take(shot, source.commit);
        takes++;
        if (next.failure) { first = next; break; }
        stable = next.sha256 === first.sha256;
        if (!stable) first = next;
      }
      if (first.failure) {
        failedShots++;
        manifest.shots[shot.name] = { failure: first.failure, takes };
        console.log(`FAIL      ${shot.name}  ${first.failure}`);
        rows.push({ name: shot.name, status: 'not taken', lines: [`FAIL: ${first.failure}`], images: [] });
        continue;
      }
      writeFileSync(join(outDir, 'baseline', `${shot.name}.png`), first.png);
      writeFileSync(join(outDir, 'baseline', `${shot.name}.json`), `${JSON.stringify(first.facts, null, 1)}\n`);
      manifest.shots[shot.name] = { sha256: first.sha256, takes, stable };
      const lines = [`smallest text ${first.facts.smallestText?.px} px`, `sideways scroll ${first.facts.sidewaysScroll} px`, `${first.facts.errors.length} script errors`];
      if (!stable) lines.push('not stable: two takes in a row were not equal');
      console.log(`${stable ? 'taken   ' : 'UNSTABLE'}  ${shot.name}  ${first.facts.pageWidth} by ${first.facts.pageHeight} px  ${takes} takes${first.facts.sidewaysScroll ? `  sideways scroll ${first.facts.sidewaysScroll} px` : ''}`);
      rows.push({ name: shot.name, status: stable ? 'taken' : 'not stable', lines, images: [['baseline', `baseline/${shot.name}.png`]] });
    }
    writeFileSync(join(outDir, 'baseline', 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
    writeReport('Look harness: the baseline', [`The baseline: ${manifest.source}. ${shots.length - failedShots} pictures.${failedShots ? ` ${failedShots} shots fail: they did not reach their state.` : ''}`], rows);
    const unstable = Object.values(manifest.shots).filter((s) => !s.failure && !s.stable).length;
    console.log(`\nlook: baseline of ${shots.length - failedShots} pictures from ${manifest.source} in ${((Date.now() - started) / 1000).toFixed(1)} s -> ${outDir}${unstable ? `; ${unstable} not stable` : ''}${failedShots ? `; ${failedShots} shots fail` : ''}`);
    if (unstable || failedShots) exitCode = 1;
  } else {
    const manifestPath = join(outDir, 'baseline', 'manifest.json');
    if (!existsSync(manifestPath)) stop(`${outDir} holds no baseline. Take the baseline first.`);
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    for (const folder of ['current', 'diff']) { rmSync(join(outDir, folder), { recursive: true, force: true }); mkdirSync(join(outDir, folder), { recursive: true }); }
    const held = (config.changes ?? []).filter((c) => manifest.commit && c.baseline === manifest.commit).length;
    const registerLine = manifest.commit
      ? `The register has ${held} entries for the baseline of ${manifest.commit}.`
      : 'The baseline comes from dist/ and has no commit: no entry of the register holds.';
    console.log(`look: ${registerLine}`);
    const rows = [];
    let same = 0;
    let failed = 0;
    for (const shot of shots) {
      const basePng = join(outDir, 'baseline', `${shot.name}.png`);
      if (!existsSync(basePng)) {
        console.log(`FAIL  ${shot.name}  the baseline has no picture of this shot`);
        rows.push({ name: shot.name, status: 'no baseline', lines: [], images: [] });
        failed++;
        continue;
      }
      const before = { png: readFileSync(basePng), facts: JSON.parse(readFileSync(join(outDir, 'baseline', `${shot.name}.json`), 'utf8')) };
      let now = await take(shot, manifest.commit ?? null);
      let takes = 1;
      const equal = () => createHash('sha256').update(before.png).digest('hex') === now.sha256;
      // A picture that is not equal is taken again, two times at most. A shot that is equal
      // only on a later take passes, and the report names it.
      while (!now.failure && !equal() && takes < 3) { now = await take(shot, manifest.commit ?? null); takes++; }
      // A shot that does not reach its state fails with its sentence, and the run goes on (LOOK-CRASH).
      if (now.failure) {
        console.log(`FAIL  ${shot.name}  ${now.failure}`);
        rows.push({ name: shot.name, status: 'FAIL, not taken', lines: [`FAIL: ${now.failure}`], images: [['baseline', `baseline/${shot.name}.png`]] });
        failed++;
        continue;
      }
      writeFileSync(join(outDir, 'current', `${shot.name}.png`), now.png);
      writeFileSync(join(outDir, 'current', `${shot.name}.json`), `${JSON.stringify(now.facts, null, 1)}\n`);
      const { fails, warnings } = compareFacts(before.facts, now.facts, shot.page, manifest.commit ?? null);
      const lines = [];
      const images = [['baseline', `baseline/${shot.name}.png`], ['current', `current/${shot.name}.png`]];
      let pixels = 0;
      if (!equal()) {
        const diff = await pixelDiff(before.png, now.png);
        pixels = diff.different;
        writeFileSync(join(outDir, 'diff', `${shot.name}.png`), Buffer.from(diff.diff, 'base64'));
        images.push(['diff', `diff/${shot.name}.png`]);
        const text = `${pixels} pixels differ${diff.sameSize ? '' : `, and the two pictures do not have the same size (${before.facts.pageWidth} by ${before.facts.pageHeight} px, then ${now.facts.pageWidth} by ${now.facts.pageHeight} px)`}`;
        if (flag('--look')) lines.push(`${text} (listed only: --look)`); else fails.push(text);
      } else if (takes > 1) {
        warnings.push(`the picture was equal to the baseline only on take ${takes}`);
      }
      if (flag('--gate') && now.facts.sidewaysScroll > 0 && !fails.some((f) => f.startsWith('sideways scroll'))) fails.push(`sideways scroll of ${now.facts.sidewaysScroll} px (--gate)`);
      const pictureWord = equal() ? 'same' : `DIFFERENT (${pixels} px)`;
      console.log(`${fails.length ? 'FAIL' : 'ok  '}  ${shot.name}  picture ${pictureWord}${takes > 1 && equal() ? ` on take ${takes}` : ''}`);
      for (const f of fails) console.log(`      FAIL: ${f}`);
      for (const w of warnings) console.log(`      warning: ${w}`);
      for (const l of lines) console.log(`      ${l}`);
      if (equal()) same++;
      if (fails.length) failed++;
      rows.push({ name: shot.name, status: `${fails.length ? 'FAIL' : 'ok'}, picture ${pictureWord}`, lines: [...fails.map((f) => `FAIL: ${f}`), ...warnings.map((w) => `warning: ${w}`), ...lines], images });
    }
    writeReport('Look harness: compare', [`The baseline: ${manifest.source}, made ${manifest.made}. Compared with ${distDir}.`, registerLine, `${same} of ${shots.length} pictures are the same. ${failed} shots fail.${flag('--look') ? ' A pixel difference is listed only (--look).' : ''}${flag('--gate') ? ' A shot that scrolls sideways fails (--gate).' : ''}`], rows);
    console.log(`\nlook: ${same} of ${shots.length} pictures are the same; ${failed} shots fail; ${((Date.now() - started) / 1000).toFixed(1)} s; the report is ${join(outDir, 'report.html')}`);
    if (failed) exitCode = 1;
  }
} finally {
  if (diffBrowser) await diffBrowser.close();
  await new Promise((done) => server.close(done));
  if (builtDir) {
    // Remove the link to node_modules first, so that the removal of the folder cannot follow it.
    try { unlinkSync(join(builtDir, 'node_modules')); } catch { /* the link is not there */ }
    rmSync(builtDir, { recursive: true, force: true });
  }
}
process.exit(exitCode);
