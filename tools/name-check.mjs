// tools/name-check.mjs: the name collision check. Step 4 of `npm run check`.
//
// It proves three rules for the names of custom properties (CSS variables):
//   1. Only the bridge file `src/styles/clear-board.tokens.css` declares a name that the Dusk
//      copy declares, and the bridge declares only the names of the list BRIDGE_CAN_DECLARE.
//   2. Each other name that an app file declares has the prefix `--cb-` or `--yard-`.
//   3. No app file declares `--lanes`: a Dusk rule reads that name and Dusk does not declare it.
//
// It reads each `.css`, `.js`, `.mjs`, `.ts` and `.tsx` file under `src/` outside the Dusk
// copy, and `index.html`, with comments removed. It reads the set of Dusk names from the Dusk
// copy on each run. It reads and never writes.
//
// `tools/name-check.allow.json` holds the names that exist today and go in a later job:
//   collisions  pairs of a file and a Dusk name that the file declares today.
//   legacy      for each file, the old names with no prefix that the file declares today.
// An entry that no file needs gives one line in the output and does not fail.
//
// A declaration is the text `--name:`, or a quoted key `'--name':` in a script. A name that a
// script sets with `setProperty` is not read as a declaration.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { customProperties } from './lib/css-scan.mjs';
import { withoutJsComments } from './lib/js-scan.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DUSK_DIR = 'src/styles/dusk';
const BRIDGE = 'src/styles/clear-board.tokens.css';
const PREFIXES = ['--cb-', '--yard-'];
const NEVER = ['--lanes'];
// The Dusk names that the bridge file declares again on purpose.
const BRIDGE_CAN_DECLARE = new Set([
  '--fs-xs', '--fs-s', '--fs-data', '--fs-base', '--fs-l', '--fs-title', '--fs-num', '--lh-base',
  '--font-ui', '--font-mono', '--track-label',
  '--ink', '--ink-3', '--hair', '--lit-rule',
  ...['red', 'amber', 'green', 'down', 'teal', 'blue', 'violet', 'grey'].map((tone) => `--tile-${tone}-hi`),
]);

const slash = (p) => p.split(sep).join('/');
const withoutCssComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
const withoutHtmlComments = (text) => text.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' '));

function walk(dir) {
  return readdirSync(join(root, dir), { withFileTypes: true }).flatMap((e) => {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) return p === DUSK_DIR || e.name === 'node_modules' ? [] : walk(p);
    return [p];
  });
}

// The names that a text declares, each with the line number of its first declaration.
function declaredIn(text) {
  const names = new Map();
  for (const use of customProperties(text)) {
    if (use.kind === 'declared' && !names.has(use.name)) names.set(use.name, text.slice(0, use.index).split('\n').length);
  }
  return names;
}

function clean(path, text) {
  if (/\.css$/i.test(path)) return withoutCssComments(text);
  if (/\.html?$/i.test(path)) return withoutCssComments(withoutHtmlComments(text));
  return withoutCssComments(withoutJsComments(text));
}

// ---- The Dusk names.
const duskFiles = readdirSync(join(root, DUSK_DIR)).filter((n) => /\.css$/i.test(n)).sort();
const dusk = new Set();
for (const name of duskFiles) {
  for (const n of declaredIn(withoutCssComments(readFileSync(join(root, DUSK_DIR, name), 'utf8'))).keys()) dusk.add(n);
}

// ---- The app files.
const appFiles = [...walk('src').filter((p) => /\.(css|m?js|tsx?)$/i.test(p)), 'index.html']
  .filter((p) => existsSync(join(root, p)))
  .map(slash)
  .sort();
const allow = JSON.parse(readFileSync(join(root, 'tools', 'name-check.allow.json'), 'utf8'));
const collisionKey = (file, name) => `${file}\n${name}`;
const allowedCollisions = new Set(allow.collisions.map((c) => collisionKey(c.file, c.name)));
const usedCollisions = new Set();
const usedLegacy = new Set();

const failures = [];
let declarations = 0;
let filesWithNames = 0;
for (const file of appFiles) {
  const names = declaredIn(clean(file, readFileSync(join(root, file), 'utf8')));
  if (names.size) filesWithNames++;
  declarations += names.size;
  const legacy = allow.legacy[file] ?? [];
  for (const [name, line] of names) {
    const at = `${file}:${line}`;
    if (NEVER.includes(name)) {
      failures.push(`${at}: declares ${name}. No app file declares this name: a Dusk rule reads it and Dusk does not declare it.`);
    } else if (dusk.has(name)) {
      if (file === BRIDGE) {
        if (!BRIDGE_CAN_DECLARE.has(name)) failures.push(`${at}: the bridge file declares the Dusk name ${name}, and the name is not one of the ${BRIDGE_CAN_DECLARE.size} names that the bridge can declare.`);
      } else if (allowedCollisions.has(collisionKey(file, name))) {
        usedCollisions.add(collisionKey(file, name));
      } else {
        failures.push(`${at}: declares the Dusk name ${name}. Only ${BRIDGE} declares a name that Dusk declares.`);
      }
    } else if (PREFIXES.some((p) => name.startsWith(p))) {
      // A new app name with a prefix: allowed.
    } else if (legacy.includes(name)) {
      usedLegacy.add(collisionKey(file, name));
    } else {
      failures.push(`${at}: declares ${name}. A new custom property of the app has the prefix ${PREFIXES.join(' or ')}.`);
    }
  }
}

// ---- The report.
console.log(`name-check: ${dusk.size} Dusk names in ${duskFiles.length} files; ${declarations} declarations in ${filesWithNames} of ${appFiles.length} app files`);
console.log(`  allowed today: ${usedCollisions.size} collisions, ${usedLegacy.size} old names with no prefix`);
for (const c of allow.collisions) {
  if (!usedCollisions.has(collisionKey(c.file, c.name))) console.log(`  not needed: collisions entry ${c.file} ${c.name}`);
}
for (const [file, names] of Object.entries(allow.legacy)) {
  if (!existsSync(join(root, file))) {
    console.log(`  ${file} does not exist: its ${names.length} legacy entries are not used`);
    continue;
  }
  for (const name of names) {
    if (!usedLegacy.has(collisionKey(file, name))) console.log(`  not needed: legacy entry ${file} ${name}`);
  }
}
if (failures.length) {
  console.log('');
  for (const f of failures) console.log(`FAIL ${f}`);
  console.log(`\nname-check: ${failures.length} failure(s).`);
  process.exit(1);
}
console.log('name-check: no name collides.');
