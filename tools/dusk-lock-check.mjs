// tools/dusk-lock-check.mjs: the Dusk lock check. Step 2 of `npm run check`.
//
// Use: node tools/dusk-lock-check.mjs --copy <folder of the Dusk copy> --expect <version> --app <folder>
//
// It proves that the Dusk copy is whole and that no app rule takes a Dusk class. Node only, no
// package. It reads and never writes. It does three checks.
//
//   1. The lock. The lock file is `dusk.lock.json` beside the folder of the copy. The SHA-256 of
//      the bytes of each file is the lock value. The folder holds no other file. The first line
//      of `dusk.tokens.css` is the line of the lock. The version of the lock is the version
//      that the command expects.
//   2. The namespace rule, always strict. It reads each `.css` file of the app folder outside
//      the copy, and each `<style>` block of an `.html` or `.svg` file. The selector of a rule
//      is split at each comma, inside `:is()` and `:where()` also. An item fails when it names
//      a `dusk-` class and no class with another prefix. A class is a dot and a name. The text
//      `dusk-` inside an attribute selector or inside a string is not a class.
//   3. The uses check. Each custom property that a file of the app folder reads with `var()`
//      and with no fallback is declared by a file of the copy or by a file of the app folder.
//      A name that a script sets with `setProperty` counts as declared. The files of the copy
//      give declared names only: the check does not read them for their `var()` reads.
//      A name that no file declares fails. The check is strict at all times: no file makes it
//      a report.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chunks, customProperties, quiet } from './lib/css-scan.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const HEADER = /^\/\* dusk (\d+\.\d+\.\d+) /;

const args = process.argv.slice(2);
const option = (name) => { const i = args.indexOf(name); return i !== -1 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : null; };
const copyArg = option('--copy');
const expect = option('--expect');
const appArg = option('--app');
if (!copyArg || !expect || !appArg) {
  console.error('dusk-lock-check: use --copy <folder> --expect <version> --app <folder>');
  process.exit(2);
}
const copyDir = resolve(root, copyArg);
const appDir = resolve(root, appArg);
const slash = (p) => p.split(sep).join('/');
const rel = (p) => slash(p.slice(root.length + 1));
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const lineOf = (text, index) => text.slice(0, index).split('\n').length;

const failures = [];
const report = [];

// ---- Check 1: the lock.
const lockPath = join(dirname(copyDir), 'dusk.lock.json');
let lock = null;
if (!existsSync(copyDir)) failures.push(`${rel(copyDir)}: the folder of the Dusk copy does not exist.`);
else if (!existsSync(lockPath)) failures.push(`${rel(lockPath)}: the lock file does not exist.`);
else lock = JSON.parse(readFileSync(lockPath, 'utf8'));

let wholeFiles = 0;
if (lock) {
  for (const [name, want] of Object.entries(lock.files)) {
    const p = join(copyDir, name);
    if (!existsSync(p)) { failures.push(`${rel(p)}: the lock names this file and the folder does not hold it.`); continue; }
    const bytes = readFileSync(p);
    const got = sha(bytes);
    if (got === want) { wholeFiles++; continue; }
    const lf = Buffer.from(bytes.toString('latin1').replace(/\r\n/g, '\n'), 'latin1');
    failures.push(`${rel(p)}: the file was edited since the copy was made. The Dusk copy is never edited.\n` +
      `    lock:    ${want}\n    on disk: ${got}` +
      (bytes.includes('\r\n') && sha(lf) === want ? '\n    The only difference is CRLF line endings.' : ''));
  }
  for (const name of readdirSync(copyDir).sort()) {
    if (!(name in lock.files)) failures.push(`${rel(join(copyDir, name))}: the folder holds this file and the lock does not name it. The folder holds exactly the ${Object.keys(lock.files).length} files of the lock.`);
  }
  const tokens = join(copyDir, 'dusk.tokens.css');
  if (existsSync(tokens)) {
    const firstLine = readFileSync(tokens, 'utf8').split('\n')[0].replace(/\r$/, '');
    if (firstLine !== lock.first_line_of_tokens) failures.push(`${rel(tokens)}: line 1 is not the line of the lock\n    lock:    ${lock.first_line_of_tokens}\n    on disk: ${firstLine}`);
    const header = HEADER.exec(firstLine);
    if (!header || header[1] !== lock.version) failures.push(`${rel(tokens)}: line 1 gives the version ${header ? header[1] : '(none)'}, and the lock gives ${lock.version}.`);
  }
  if (lock.version !== expect) failures.push(`the lock gives Dusk ${lock.version}, and the command expects ${expect}.`);
}

// ---- The files of the app folder, outside the copy.
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return p === copyDir || e.name === 'node_modules' || e.name === '.git' ? [] : walk(p);
    return [p];
  });
}
const appFiles = existsSync(appDir) ? walk(appDir).sort() : [];
const copyFiles = existsSync(copyDir) ? readdirSync(copyDir).filter((n) => /\.css$/i.test(n)).sort() : [];
const copyText = copyFiles.map((n) => quiet(readFileSync(join(copyDir, n), 'utf8')));

// ---- Check 2: the namespace rule.
const CLASS = /\.(-?[A-Za-z_][\w-]*)/g;
const duskClasses = new Set(copyText.flatMap((css) => [...css.matchAll(/\.(dusk-[A-Za-z0-9_-]+)/g)].map((m) => m[1])));
let placed = 0;
let bare = 0;
const unknownClasses = new Map();
for (const file of appFiles) {
  let sheets;
  if (/\.css$/i.test(file)) sheets = [{ css: readFileSync(file, 'utf8'), line: 1 }];
  else if (/\.(html?|svg)$/i.test(file)) {
    const text = readFileSync(file, 'utf8');
    sheets = [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => ({ css: m[1], line: lineOf(text, m.index + m[0].indexOf('>') + 1) }));
  } else continue;
  for (const sheet of sheets) {
    const css = quiet(sheet.css);
    // A part that ends with `{` is a selector list, or the start of an at-rule.
    for (const part of chunks(css)) {
      if (part.closer !== '{' || part.text.trim().startsWith('@')) continue;
      for (const item of part.text.split(',')) {
        const classes = [...item.replace(/\[[^\]]*\]?/g, ' ').matchAll(CLASS)].map((m) => m[1]);
        const dusk = classes.filter((c) => c.startsWith('dusk-'));
        if (!dusk.length) continue;
        for (const c of dusk) if (!duskClasses.has(c)) unknownClasses.set(c, rel(file));
        if (classes.some((c) => !c.startsWith('dusk-'))) { placed += dusk.length; continue; }
        bare += dusk.length;
        const at = `${rel(file)}:${sheet.line + lineOf(css, part.start + part.text.length - part.text.trimStart().length) - 1}`;
        failures.push(`${at}: the selector item "${item.trim().replace(/\s+/g, ' ')}" names ${dusk.map((c) => `.${c}`).join(' ')} and no class with another prefix. An app rule puts a Dusk class under a class of the app.`);
      }
    }
  }
}
report.push(`dusk- classes in app rules outside the copy: ${bare} with no app class (each one fails), ${placed} under an app class`);
for (const [c, file] of unknownClasses) report.push(`reported: ${file} names .${c}, and the Dusk copy has no class with that name. The prefix dusk- belongs to Dusk.`);

// ---- Check 3: the uses check.
const declared = new Set();
for (const css of copyText) for (const use of customProperties(css)) if (use.kind === 'declared') declared.add(use.name);
const reads = new Map();
for (const file of appFiles) {
  if (!/\.(css|html?|svg|m?js|jsx|tsx?)$/i.test(file)) continue;
  const raw = readFileSync(file, 'utf8');
  const text = /\.css$/i.test(file) ? quiet(raw) : raw.replace(/<!--[\s\S]*?-->/g, '');
  for (const use of customProperties(text)) {
    if (use.kind === 'declared' || use.kind === 'set') declared.add(use.name);
    // A read with a fallback is not counted: the sheet has a value for the case of no token.
    if (use.kind !== 'read') continue;
    if (!reads.has(use.name)) reads.set(use.name, new Set());
    reads.get(use.name).add(rel(file));
  }
}
const undeclared = [...reads.entries()].filter(([name]) => !declared.has(name)).sort(([a], [b]) => a.localeCompare(b));
const where = [...new Set(undeclared.flatMap(([, files]) => [...files]))].sort();
report.push(`custom properties that an app file reads and no file declares: ${undeclared.length}${undeclared.length ? ` (in ${where.join(', ')})` : ''}`);
for (const [name, files] of undeclared) {
  failures.push(`${name} is read in ${[...files].sort().join(', ')} and no file declares it. A read of a name that no file declares gives the initial value, with no error.`);
}
report.push('the uses check is strict: a read of a name that no file declares fails');

// ---- The report.
console.log(`dusk-lock-check: ${lock ? `${wholeFiles} of ${Object.keys(lock.files).length} files equal to the lock; Dusk ${lock.version}; commit ${lock.commit}` : 'no lock'}`);
for (const line of report) console.log(`  ${line}`);
if (failures.length) {
  console.log('');
  for (const f of failures) console.log(`FAIL ${f}`);
  console.log(`\ndusk-lock-check: ${failures.length} failure(s).`);
  process.exit(1);
}
console.log('dusk-lock-check: the Dusk copy is whole and no app rule takes a Dusk class.');
