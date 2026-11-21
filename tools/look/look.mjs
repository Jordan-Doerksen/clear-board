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
// control that stays 44 by 44 px or more gives a warning only, with both sizes). A word and the
// name of a control are read as the markup writes them: a letter case that a style sets
// (text-transform) changes the picture only. With no `--look` a pixel difference fails also. The
// pixels are counted with no package: the SHA-256 of the two files is compared, and where they
// differ both are decoded in a browser page.
//
// A baseline is compared only with pictures from the same machine.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

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

// The facts of the page. This function runs in the page.
function collectFacts() {
  const shown = (el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
  const collapse = (text) => (text ?? '').replace(/\s+/g, ' ').trim();
  const ids = [...new Set([...document.querySelectorAll('[id]')].map((el) => el.id))].sort();
  const classes = [...new Set([...document.querySelectorAll('[class]')].flatMap((el) => [...el.classList]))].sort();
  let smallest = null;
  for (const el of document.body.querySelectorAll('*')) {
    if (!shown(el)) continue;
    if (![...el.childNodes].some((node) => node.nodeType === 3 && node.textContent.trim())) continue;
    const px = parseFloat(getComputedStyle(el).fontSize);
    if (!smallest || px < smallest.px) smallest = { px, where: `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}: ${collapse(el.textContent).slice(0, 40)}` };
  }
  // The words and the names of the controls are read as the markup writes them. A rule with
  // text-transform changes the look of a word, not the word: the picture shows that change.
  // So text-transform is off while the text is read, and on again before a control is measured.
  const asWritten = document.createElement('style');
  asWritten.textContent = '*, *::first-letter, *::first-line { text-transform: none !important; }';
  document.head.append(asWritten);
  const words = {};
  for (const word of collapse(document.body.innerText).split(' ')) if (word) words[word] = (words[word] ?? 0) + 1;
  const named = [];
  for (const el of document.querySelectorAll('button, a[href], select, input, textarea, summary, [role="tab"], [role="button"]')) {
    if (!shown(el)) continue;
    const tag = el.tagName.toLowerCase();
    const name = collapse(el.getAttribute('aria-label')) || (tag === 'select' ? '' : collapse(el.innerText)) || collapse(el.getAttribute('placeholder')) || collapse(el.getAttribute('title')) || (el.id ? `#${el.id}` : '');
    named.push({ el, key: `${tag} "${name}"` });
  }
  asWritten.remove();
  const controls = named.map(({ el, key }) => {
    const box = el.getBoundingClientRect();
    return { key, width: Math.round(box.width * 100) / 100, height: Math.round(box.height * 100) / 100 };
  });
  const page = document.documentElement;
  return { ids, classes, smallestText: smallest, words, controls, sidewaysScroll: Math.max(0, page.scrollWidth - page.clientWidth), pageWidth: page.scrollWidth, pageHeight: page.scrollHeight };
}

async function runStep(page, step) {
  if (step.click) await page.locator(step.click).first().click();
  else if (step.focus) await page.locator(step.focus).first().focus();
  else if (step.press) await page.keyboard.press(step.press);
  else if (step.fill) await page.locator(step.fill).first().fill(step.text ?? '');
  else if (step.waitFor) await page.locator(step.waitFor).first().waitFor();
  else if (step.waitGone) await page.locator(step.waitGone).first().waitFor({ state: 'detached' });
  else throw new Error(`a step of the config has no known kind: ${JSON.stringify(step)}`);
}

// Take one picture and its facts, in a new browser process, a new context and a new page.
async function take(shot) {
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
    await page.goto(`${base}/#${shot.page.route}`, { waitUntil: 'networkidle' });
    if (shot.page.waitFor) await page.locator(shot.page.waitFor).first().waitFor();
    for (const step of shot.page.steps ?? []) await runStep(page, step);
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
    const facts = await page.evaluate(collectFacts);
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
function compareFacts(before, now) {
  const fails = [];
  const warnings = [];
  for (const id of before.ids.filter((x) => !now.ids.includes(x))) {
    (mayGo(id, config.idsMayGo) ? warnings : fails).push(`an element id is gone: ${id}${mayGo(id, config.idsMayGo) ? ' (in idsMayGo)' : ''}`);
  }
  const lostClasses = before.classes.filter((x) => !now.classes.includes(x));
  const allowed = lostClasses.filter((c) => mayGo(c, config.classesMayGo));
  for (const c of lostClasses.filter((x) => !allowed.includes(x))) fails.push(`a class name is gone: ${c}`);
  if (allowed.length) warnings.push(`${allowed.length} class names are gone and are in classesMayGo: ${allowed.join(' ')}`);
  for (const error of now.errors.filter((e) => !before.errors.includes(e))) fails.push(`a new script error: ${error}`);
  if (now.sidewaysScroll > before.sidewaysScroll) fails.push(`sideways scroll: ${before.sidewaysScroll} px in the baseline, ${now.sidewaysScroll} px now`);
  if (before.smallestText && now.smallestText && now.smallestText.px < before.smallestText.px - 0.01) {
    fails.push(`smaller smallest text: ${before.smallestText.px} px in the baseline, ${now.smallestText.px} px now (${now.smallestText.where})`);
  }
  const gone = [];
  const added = [];
  for (const word of new Set([...Object.keys(before.words), ...Object.keys(now.words)])) {
    const was = before.words[word] ?? 0;
    const is = now.words[word] ?? 0;
    if (is < was) gone.push(was - is > 1 || is > 0 ? `${word} (${was} -> ${is})` : word);
    if (is > was) added.push(is - was > 1 || was > 0 ? `${word} (${was} -> ${is})` : word);
  }
  if (gone.length) fails.push(`words or numbers that are gone: ${gone.slice(0, 40).join(' | ')}${gone.length > 40 ? ` | and ${gone.length - 40} more` : ''}`);
  if (added.length) fails.push(`words or numbers that are new: ${added.slice(0, 40).join(' | ')}${added.length > 40 ? ` | and ${added.length - 40} more` : ''}`);
  const group = (controls) => { const map = new Map(); for (const c of controls) map.set(c.key, [...(map.get(c.key) ?? []), c]); return map; };
  const was = group(before.controls);
  const is = group(now.controls);
  for (const [key, list] of was) {
    const current = is.get(key) ?? [];
    if (current.length < list.length) fails.push(`a control is gone: ${key} (${list.length} -> ${current.length})`);
    current.slice(0, list.length).forEach((c, i) => {
      if (c.width < list[i].width - 0.5 || c.height < list[i].height - 0.5) {
        const line = `a control is smaller: ${key}: ${list[i].width} by ${list[i].height} px in the baseline, ${c.width} by ${c.height} px now`;
        if (flag('--look') && c.width >= TARGET_FLOOR && c.height >= TARGET_FLOOR) warnings.push(`${line}; it stays ${TARGET_FLOOR} by ${TARGET_FLOOR} px or more (--look)`);
        else fails.push(line);
      }
    });
  }
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
    for (const shot of shots) {
      // Two takes must be equal. If they are not, the harness takes the picture again.
      let first = await take(shot);
      let takes = 1;
      let stable = false;
      while (takes < 4 && !stable) {
        const next = await take(shot);
        takes++;
        stable = next.sha256 === first.sha256;
        if (!stable) first = next;
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
    writeReport('Look harness: the baseline', [`The baseline: ${manifest.source}. ${shots.length} pictures.`], rows);
    const unstable = Object.values(manifest.shots).filter((s) => !s.stable).length;
    console.log(`\nlook: baseline of ${shots.length} pictures from ${manifest.source} in ${((Date.now() - started) / 1000).toFixed(1)} s -> ${outDir}${unstable ? `; ${unstable} not stable` : ''}`);
    if (unstable) exitCode = 1;
  } else {
    const manifestPath = join(outDir, 'baseline', 'manifest.json');
    if (!existsSync(manifestPath)) stop(`${outDir} holds no baseline. Take the baseline first.`);
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    for (const folder of ['current', 'diff']) { rmSync(join(outDir, folder), { recursive: true, force: true }); mkdirSync(join(outDir, folder), { recursive: true }); }
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
      let now = await take(shot);
      let takes = 1;
      const equal = () => createHash('sha256').update(before.png).digest('hex') === now.sha256;
      // A picture that is not equal is taken again, two times at most. A shot that is equal
      // only on a later take passes, and the report names it.
      while (!equal() && takes < 3) { now = await take(shot); takes++; }
      writeFileSync(join(outDir, 'current', `${shot.name}.png`), now.png);
      writeFileSync(join(outDir, 'current', `${shot.name}.json`), `${JSON.stringify(now.facts, null, 1)}\n`);
      const { fails, warnings } = compareFacts(before.facts, now.facts);
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
    writeReport('Look harness: compare', [`The baseline: ${manifest.source}, made ${manifest.made}. Compared with ${distDir}.`, `${same} of ${shots.length} pictures are the same. ${failed} shots fail.${flag('--look') ? ' A pixel difference is listed only (--look).' : ''}${flag('--gate') ? ' A shot that scrolls sideways fails (--gate).' : ''}`], rows);
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
