// tools/colour-lint.mjs: the raw-colour lint. Step 3 of `npm run check`.
//
// Use: node tools/colour-lint.mjs <folder or file> [more] [options]
//   --tokens <path>          A token file or a folder of token files. It can hold raw colours
//                            and is not counted. The option can be given more than one time.
//   --exclude <path>         A file or a folder that is not read. More than one time.
//   --baseline <file>        The ratchet. A file fails only when it holds more raw colours
//                            than its baseline value. A file that the baseline does not name
//                            has the value 0.
//   --write-baseline <file>  Write the counts of today as the baseline, and exit 0.
//   --list                   Print each finding as file:line:column.
//   --json <file>            Write the full result as JSON.
//   --no-allowed-places      Count the allowed places as each other file.
// Each path is relative to the repository root. Name the folders. Do not give `.`: the lint
// then reads build output and documents also.
// Exit code: 0 no file is worse than its limit; 1 one file or more is worse; 2 wrong use.
//
// Node only, no package. It reads and never writes, except for the two options that name an
// output file.
//
// What it reads:
//   - `.css` files.
//   - `.html` and `.svg` files: the `<style>` blocks, the `style` attributes, the colour
//     attributes (`fill`, `stroke`, `stop-color`, `flood-color`, `lighting-color`, `color`,
//     `bgcolor`), the `theme-color` meta element and the `<script>` blocks.
//   - `.js`, `.mjs`, `.cjs`, `.jsx`, `.ts` and `.tsx` files: the string literals only.
//   - No `.json` file.
//
// What it counts as a raw colour:
//   - In a style value: a hex value, a colour function (`rgb()`, `hsl()` and the like) and a
//     named colour of CSS. Only the value of a declaration is read, so an id selector is not
//     a colour. The fallback of a `var()` counts.
//   - In a string literal of a script: a hex value and a colour function with a number as its
//     first argument. A colour name is not counted there: a sentence can hold the word "green".
//     A hex value of three or four digits counts only when it is the whole string, because the
//     same text can be an id selector.
//
// What it does not count:
//   - `transparent`, `currentColor`, `inherit`, `none` and a system colour.
//   - The name of a custom property: `var(--green-ink)` holds no raw colour.
//   - The text inside a quoted string or a `url()` of a style value, and a comment.
//   - A character reference such as `&#9654;`.
//   - The value of a `mask` property: a mask is read as alpha and is not painted.
//   - A derived colour: `color-mix()`, a colour function with `from`, or a colour function
//     with a `var()` inside. It is built from tokens. It is reported and does not fail. A raw
//     colour inside it is counted.
//
// A limit of the lint: it does not see a colour that a script builds from pieces.
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chunks, quiet } from './lib/css-scan.mjs';
import { stringLiterals } from './lib/js-scan.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// The allowed places of row U-45 of the upgrade list: an icon file cannot read a style sheet,
// so its colours are copied token values. The lint counts these files and does not fail on
// them. They are not in the baseline. This list is the one place for an allowed path.
const ALLOWED_PLACES = ['public/favicon.svg', 'public/icon.svg'];
const ALLOWED_ROW = 'U-45';

const NAMED = new Set(('aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet ' +
  'brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan ' +
  'darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred ' +
  'darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue ' +
  'dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray ' +
  'green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen ' +
  'lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink ' +
  'lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen ' +
  'linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue ' +
  'mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy ' +
  'oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip ' +
  'peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown ' +
  'seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal ' +
  'thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen').split(' '));
const COLOUR_FUNCTIONS = new Set(['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'color', 'color-mix']);
const HEX_LENGTHS = new Set([3, 4, 6, 8]);
const COLOUR_ATTRIBUTES = new Set(['fill', 'stroke', 'stop-color', 'flood-color', 'lighting-color', 'color', 'bgcolor']);
const NOT_PAINTED = new Set(['', 'none', 'currentcolor', 'inherit', 'transparent', 'context-fill', 'context-stroke']);
const SCRIPT_FILE = /\.(?:m?js|cjs|jsx|tsx?)$/i;
const READ_FILE = /\.(?:css|html?|svg|m?js|cjs|jsx|tsx?)$/i;
const FAIL_KINDS = ['hex', 'function', 'named'];
const isNamePart = (c) => c !== undefined && /[\w-]/.test(c);
// A hash token is a hex colour when it holds 3, 4, 6 or 8 hex digits and no other character.
const isHexColour = (token) => HEX_LENGTHS.has(token.length - 1) && /^#[0-9a-f]+$/i.test(token);
// A mask is read as alpha and is not painted.
const isMaskProperty = (property) => property.replace(/^-webkit-/, '').split('-')[0] === 'mask';

// ---- The arguments.
const VALUE_OPTIONS = ['--tokens', '--exclude', '--baseline', '--write-baseline', '--json'];
const FLAGS = ['--list', '--no-allowed-places'];
const options = { '--tokens': [], '--exclude': [] };
const flags = new Set();
const roots = [];
function usage(message) {
  console.error(`colour-lint: ${message}`);
  console.error('use: node tools/colour-lint.mjs <folder or file> [more] [--tokens <path>] [--exclude <path>] [--baseline <file>] [--write-baseline <file>] [--list] [--json <file>] [--no-allowed-places]');
  process.exit(2);
}
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (VALUE_OPTIONS.includes(a)) {
    const value = argv[++i];
    if (value === undefined) usage(`${a} needs a value`);
    if (Array.isArray(options[a])) options[a].push(value); else options[a] = value;
  } else if (FLAGS.includes(a)) flags.add(a);
  else if (a.startsWith('--')) usage(`${a} is not an option`);
  else roots.push(a);
}
if (!roots.length) usage('name one folder or file, or more');

const slash = (p) => p.split(sep).join('/');
const rel = (p) => slash(resolve(root, p)).slice(slash(root).length + 1);
const under = (path, list) => list.some((item) => path === item || path.startsWith(`${item}/`));
const tokenPaths = options['--tokens'].map(rel);
const excludePaths = options['--exclude'].map(rel);
const allowedPlaces = flags.has('--no-allowed-places') ? [] : ALLOWED_PLACES;

// ---- Text helpers. A blanked span keeps each line break, so each offset stays true.
const blank = (text) => text.replace(/[^\n]/g, ' ');
function position(text, index) {
  const before = text.slice(0, index);
  return { line: before.split('\n').length, column: index - before.lastIndexOf('\n') };
}

// The end of a function call: the offset after the `)` that closes the `(` at `open`.
function callEnd(text, open) {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === '(') depth++;
    else if (text[i] === ')' && --depth === 0) return i + 1;
  }
  return text.length;
}

// One style value, as quiet text. `base` is the offset of the value in the file text. The value
// is read token by token: a custom property name, a hash token, a function name, a word.
const VALUE_TOKEN = /--[\w-]*|#[\w-]*|[A-Za-z_][\w-]*\(?/g;
function scanValue(value, base, push, property = '') {
  if (isMaskProperty(property)) return;
  let colourFunctionEnd = 0;
  for (const m of value.matchAll(VALUE_TOKEN)) {
    const token = m[0];
    const before = value[m.index - 1];
    if (token.startsWith('--')) continue;
    if (token[0] === '#') {
      if (before !== '&' && !/\w/.test(before ?? '') && isHexColour(token)) push('hex', base + m.index, token);
      continue;
    }
    if (isNamePart(before)) continue;
    if (token.endsWith('(')) {
      const name = token.slice(0, -1).toLowerCase();
      // A colour function inside a colour function is one finding.
      if (!COLOUR_FUNCTIONS.has(name) || m.index < colourFunctionEnd) continue;
      colourFunctionEnd = callEnd(value, m.index + token.length - 1);
      const whole = value.slice(m.index, colourFunctionEnd);
      const derived = name === 'color-mix' || /^[\w-]+\(\s*from\s/i.test(whole) || /var\(/i.test(whole);
      push(derived ? 'derived' : 'function', base + m.index, whole.replace(/\s+/g, ' ').slice(0, 60));
    } else if (NAMED.has(token.toLowerCase())) {
      push('named', base + m.index, token);
    }
  }
}

// Style text. Only the value of a declaration is read: an id selector is not a colour.
function scanStyle(css, offset, push) {
  for (const part of chunks(quiet(css))) {
    if (part.closer === '{') continue;
    const colon = part.text.indexOf(':');
    const property = part.text.slice(0, colon).trim();
    if (colon < 1 || !/^[\w-]+$/.test(property)) continue;
    scanValue(part.text.slice(colon + 1), offset + part.start + colon + 1, push, property.toLowerCase());
  }
}

// Script text: the string literals only. A colour name is not counted in a script.
const SCRIPT_TOKEN = /#[\w-]*|[A-Za-z][\w-]*\(\s*[\d.]?/g;
const SELECTOR_CALLS = ['querySelector', 'querySelectorAll', 'getElementById', 'closest', 'matches', '$', 'href'];
function scanScript(script, offset, push) {
  for (const literal of stringLiterals(script)) {
    const body = literal.text;
    // The code before the quote mark of the literal: a call that takes a selector, or `href =`.
    const lead = script.slice(Math.max(0, literal.start - 40), literal.start - 1).trimEnd();
    const selectorCall = /[(=]$/.test(lead) && SELECTOR_CALLS.some((name) => lead.slice(0, -1).trimEnd().endsWith(name));
    for (const m of body.matchAll(SCRIPT_TOKEN)) {
      const token = m[0];
      const before = body[m.index - 1];
      const at = offset + literal.start + m.index;
      if (token[0] === '#') {
        if (before === '&' || /\w/.test(before ?? '') || !isHexColour(token)) continue;
        // The text of a short hex value can be an id selector. It counts only as the whole string.
        const short = token.length <= 5;
        if (short && (selectorCall || body.trim() !== token)) continue;
        push('hex', at, token);
        continue;
      }
      if (isNamePart(before)) continue;
      const name = token.slice(0, token.indexOf('(')).toLowerCase();
      if (name === 'color-mix') push('derived', at, body.slice(m.index, m.index + 50));
      else if (COLOUR_FUNCTIONS.has(name) && name !== 'color' && /[\d.]$/.test(token)) push('function', at, `${body.slice(m.index, m.index + 40).split(')')[0]})`);
    }
  }
}

// An `.html` or `.svg` file: each style block, each script block with no `src`, and the
// attributes of each other tag.
const TAG = /<(style|script)\b([^>]*)>([\s\S]*?)<\/\1\s*>|<([A-Za-z][\w:-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g;
const ATTRIBUTE = /([^\s"'=<>/]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
function scanMarkup(markup, push) {
  const text = markup.replace(/<!--[\s\S]*?-->/g, blank);
  for (const tag of text.matchAll(TAG)) {
    if (tag[1]) {
      const bodyAt = tag.index + tag[0].indexOf('>') + 1;
      if (tag[1].toLowerCase() === 'style') scanStyle(tag[3], bodyAt, push);
      else if (!/\bsrc\s*=/i.test(tag[2])) scanScript(tag[3], bodyAt, push);
      continue;
    }
    const element = tag[4].toLowerCase();
    const attributesAt = tag.index + 1 + tag[4].length;
    const attributes = [...tag[5].matchAll(ATTRIBUTE)].map((m) => ({ name: m[1].toLowerCase(), value: m[2] ?? m[3], at: attributesAt + m.index + m[0].length - (m[2] ?? m[3]).length - 1 }));
    for (const attribute of attributes) {
      if (attribute.name === 'style') scanStyle(attribute.value, attribute.at, push);
      else if (COLOUR_ATTRIBUTES.has(attribute.name)) {
        const value = quiet(attribute.value);
        if (!NOT_PAINTED.has(value.trim().toLowerCase())) scanValue(value, attribute.at, push);
      } else if (element === 'meta' && attribute.name === 'content' && attributes.some((a) => a.name === 'name' && a.value.toLowerCase() === 'theme-color')) {
        scanValue(attribute.value, attribute.at, push);
      }
    }
  }
}

// ---- The files.
const files = [];
const tokenFiles = [];
function walk(path) {
  const name = path.split('/').pop();
  if (name === 'node_modules' || name === '.git' || under(path, excludePaths)) return;
  const full = join(root, path);
  if (statSync(full).isDirectory()) {
    for (const entry of readdirSync(full).sort()) walk(`${path}/${entry}`);
  } else if (READ_FILE.test(path)) {
    if (under(path, tokenPaths)) tokenFiles.push(path); else files.push(path);
  }
}
for (const r of roots) {
  const path = rel(r);
  if (!path || path.startsWith('..')) usage(`${r}: name a folder or a file inside the repository, and not the repository root`);
  if (!existsSync(join(root, path))) usage(`${r} does not exist`);
  walk(path);
}

// ---- The run.
const results = [];
for (const file of files) {
  const text = readFileSync(join(root, file), 'utf8').replace(/\r\n/g, '\n');
  const findings = [];
  const push = (kind, index, snippet) => findings.push({ kind, ...position(text, index), text: snippet });
  if (/\.css$/i.test(file)) scanStyle(text, 0, push);
  else if (SCRIPT_FILE.test(file)) scanScript(text, 0, push);
  else scanMarkup(text, push);
  const count = (kind) => findings.filter((f) => f.kind === kind).length;
  const row = { file, hex: count('hex'), function: count('function'), named: count('named'), derived: count('derived'), findings };
  row.raw = FAIL_KINDS.reduce((n, kind) => n + row[kind], 0);
  row.allowed = allowedPlaces.includes(file);
  results.push(row);
}

let baseline = null;
if (options['--baseline']) {
  const path = join(root, rel(options['--baseline']));
  if (!existsSync(path)) usage(`${options['--baseline']} does not exist. Write it one time with --write-baseline.`);
  baseline = JSON.parse(readFileSync(path, 'utf8')).files ?? {};
}
const limitOf = (row) => (baseline ? baseline[row.file] ?? 0 : 0);
const counted = results.filter((r) => !r.allowed);
const worse = counted.filter((r) => r.raw > limitOf(r));
const better = baseline ? counted.filter((r) => r.raw < limitOf(r)) : [];
const total = (rows, key) => rows.reduce((n, r) => n + r[key], 0);

// ---- The report.
const shown = results.filter((r) => r.raw || r.derived || limitOf(r)).sort((a, b) => b.raw - a.raw || a.file.localeCompare(b.file));
const width = Math.max(5, ...shown.map((r) => r.file.length));
const columns = ['hex', 'function', 'named', 'raw', 'derived'];
console.log(`colour-lint: ${results.length} files read; ${tokenFiles.length} token files not counted; ${excludePaths.length} excluded paths not read`);
console.log(`${'file'.padEnd(width)}  ${columns.map((c) => c.padStart(8)).join(' ')}${baseline ? '  baseline' : ''}`);
for (const r of shown) {
  const mark = r.allowed ? `  allowed place (row ${ALLOWED_ROW})` : baseline ? `  ${String(limitOf(r)).padStart(8)}${r.raw > limitOf(r) ? '  worse' : ''}` : '';
  console.log(`${r.file.padEnd(width)}  ${columns.map((c) => String(r[c]).padStart(8)).join(' ')}${mark}`);
}
console.log(`${'TOTAL, counted files'.padEnd(width)}  ${columns.map((c) => String(total(counted, c)).padStart(8)).join(' ')}${baseline ? `  ${String(Object.values(baseline).reduce((a, b) => a + b, 0)).padStart(8)}` : ''}`);
console.log(`  raw = hex + function + named: ${total(counted, 'raw')} raw colours in ${counted.filter((r) => r.raw).length} counted files. derived = built from tokens: reported, does not fail.`);
if (allowedPlaces.length) {
  console.log(`  allowed places (row ${ALLOWED_ROW}): ${allowedPlaces.join(' and ')} can hold raw colours. They do not fail and are not in the baseline.`);
}
for (const r of better) console.log(`  ${r.file}: ${r.raw} raw colours, below its baseline of ${limitOf(r)}. The closing commit of the G1 line lowers the baseline.`);
if (baseline) {
  for (const file of Object.keys(baseline)) {
    if (!results.some((r) => r.file === file)) console.log(`  ${file}: the baseline names this file and the lint did not read it.`);
  }
}

const listed = flags.has('--list') ? shown : worse.filter((r) => r.findings.length <= 12);
if (listed.length) console.log('');
for (const r of listed) {
  for (const f of r.findings) console.log(`  ${r.file}:${f.line}:${f.column}  ${f.kind.padEnd(8)}  ${f.text}`);
}

if (options['--json']) {
  writeFileSync(resolve(options['--json']), `${JSON.stringify({ tokenFiles, excluded: excludePaths, allowedPlaces, files: results }, null, 2)}\n`);
}
if (options['--write-baseline']) {
  const out = {
    note: 'The baseline of the raw-colour lint (tools/colour-lint.mjs): the count of raw colours of each file on the day of the baseline. A value only goes down. A build job does not edit this file. The closing commit of the G1 line writes it again after each wave merge.',
    files: Object.fromEntries(counted.filter((r) => r.raw).map((r) => [r.file, r.raw]).sort(([a], [b]) => a.localeCompare(b))),
  };
  writeFileSync(resolve(root, rel(options['--write-baseline'])), `${JSON.stringify(out, null, 2)}\n`);
  console.log(`\ncolour-lint: wrote the baseline: ${total(counted, 'raw')} raw colours in ${Object.keys(out.files).length} files -> ${rel(options['--write-baseline'])}`);
  process.exit(0);
}

if (worse.length) {
  console.log('');
  for (const r of worse) {
    console.log(`FAIL ${r.file}: ${r.raw} raw colours, and its limit is ${limitOf(r)} (${limitOf(r)} -> ${r.raw}). ${baseline && r.file in baseline ? 'A file does not get worse than its baseline.' : 'A file that the baseline does not name has the limit 0.'}`);
  }
  console.log(`\ncolour-lint: ${worse.length} file(s) worse than the limit. A colour comes from a token: var(--name). Run with --list to see each finding.`);
  process.exit(1);
}
console.log(baseline ? 'colour-lint: no file is worse than its baseline.' : 'colour-lint: no raw colour.');
