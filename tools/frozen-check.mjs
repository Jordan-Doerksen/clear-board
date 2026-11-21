// tools/frozen-check.mjs: the frozen-file hash gate. Step 1 of `npm run check`.
//
// It proves that no frozen file changed since the baseline commit of `tools/frozen.lock.json`.
// It reads and never writes. It hashes the bytes on disk and changes nothing first.
//
// The checks:
//   1. Each whole file of the lock exists at its path, and its bytes hash to the lock value.
//   2. The data folder holds exactly the listed files.
//   3. The STEPS region of the Radio island, found by its anchors and never by a line number.
//      Way (a): the SHA-256 of the exact text of the region.
//      Way (b): the array literal is evaluated in an empty `node:vm` context, and the SHA-256
//      of `JSON.stringify` of the result is compared. A difference names the step and the field.
//   4. The start anchor is found exactly one time.
//   5. No line outside the region writes to STEPS, to an element of it or to a field of a step.
//   6. When git and the baseline commit are in the clone, each lock value is also compared with
//      the file of the baseline commit. This proves that the lock was not edited.
//   7. A failure prints the path and both hashes, and says when only the line endings differ.
//
// The gate covers the STEPS wording as a region, not the file: the file can change outside the
// region. The gate does not see a write to STEPS through another name. The word tape of the
// browser smoke test covers that case.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, realpathSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const lock = JSON.parse(readFileSync(join(root, 'tools', 'frozen.lock.json'), 'utf8'));

const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const lfOnly = (bytes) => Buffer.from(bytes.toString('latin1').replace(/\r\n/g, '\n'), 'latin1');

const failures = [];
const fail = (text) => failures.push(text);

// One hash comparison. `what` names the item. On a difference the message holds both hashes,
// and says when the only difference is CRLF line endings.
function compareHash(what, bytes, want, side = 'on disk') {
  const got = sha(bytes);
  if (got === want) return true;
  const crlf = bytes.includes('\r\n') && sha(lfOnly(bytes)) === want;
  fail(`${what}: the hash ${side} is not the lock value\n` +
    `    lock:    ${want}\n` +
    `    ${side.padEnd(8)} ${got}` +
    (crlf ? '\n    The only difference is CRLF line endings. A frozen file keeps LF line endings.' : ''));
  return false;
}

// Find the region in the bytes of the file. The result holds the count of start anchors, the
// bytes of the region and the first line number of the region.
function findRegion(bytes, region) {
  const first = bytes.indexOf(region.startAnchor);
  let count = 0;
  for (let at = first; at !== -1; at = bytes.indexOf(region.startAnchor, at + 1)) count++;
  if (count !== 1) return { count };
  const endAt = bytes.indexOf(region.endAnchor, first + region.startAnchor.length);
  if (endAt === -1) return { count, noEnd: true };
  const end = endAt + Buffer.byteLength(region.endAnchor);
  return { count, start: first, end, bytes: bytes.subarray(first, end) };
}

// Way (b). The array literal starts at the last character of the start anchor and ends before
// the last character of the region.
function evaluateRegion(regionBytes, region) {
  const text = regionBytes.toString('utf8');
  const literal = text.slice(region.startAnchor.length - 1, text.length - 1);
  return vm.runInNewContext(`(${literal})`, Object.create(null), { timeout: 2000 });
}

function fieldsOf(steps) {
  const names = [];
  for (const step of steps) for (const key of Object.keys(step)) if (!names.includes(key)) names.push(key);
  return names;
}

// Compare the evaluated steps with the lock. `what` names the side that was read.
function compareSteps(steps, region, what) {
  const lines = [];
  if (!Array.isArray(steps)) {
    lines.push('the region does not evaluate to an array');
  } else {
    if (steps.length !== region.stepCount) lines.push(`the count of steps is ${steps.length}, the lock has ${region.stepCount}`);
    const want = region.stepFieldSha256;
    for (let i = 0; i < Math.max(steps.length, want.length); i++) {
      const name = `step ${i + 1} (STEPS[${i}])`;
      if (i >= steps.length) { lines.push(`${name} is gone`); continue; }
      if (i >= want.length) { lines.push(`${name} is new`); continue; }
      const step = steps[i] ?? {};
      for (const field of new Set([...Object.keys(want[i]), ...Object.keys(step)])) {
        if (!(field in want[i])) lines.push(`${name}: the field "${field}" is new`);
        else if (!(field in step)) lines.push(`${name}: the field "${field}" is gone`);
        else if (step[field] === undefined) lines.push(`${name}: the field "${field}" has no value`);
        else if (sha(JSON.stringify(step[field])) !== want[i][field]) lines.push(`${name}: the field "${field}" changed`);
      }
    }
    const names = fieldsOf(steps);
    const lost = region.fields.filter((f) => !names.includes(f));
    const added = names.filter((f) => !region.fields.includes(f));
    if (lost.length) lines.push(`field names that are gone: ${lost.join(', ')}`);
    if (added.length) lines.push(`field names that are new: ${added.join(', ')}`);
  }
  const got = sha(JSON.stringify(steps) ?? '');
  if (got !== region.jsonSha256 || lines.length) {
    if (!lines.length) lines.push('no value changed: the order of the fields or of the steps changed');
    fail(`${region.path}, the ${region.name} region ${what}, way (b): the values are not the lock values\n` +
      `    lock:    ${region.jsonSha256}\n` +
      `    found:   ${got}\n` +
      lines.map((l) => `    ${l}`).join('\n'));
    return false;
  }
  return true;
}

// Check 5. A line outside the region that writes to STEPS. This is a text check of each line,
// comments also.
const CHAIN = String.raw`(?:\s*\??\.\s*[\w$]+|\s*\[[^\]]*\])*`;
const WRITE_PATTERNS = [
  [new RegExp(String.raw`\bSTEPS\b${CHAIN}\s*(?:=(?![=>])|\+=|-=|\*\*?=|\/=|%=|<<=|>>>?=|&&?=|\|\|?=|\^=|\?\?=|\+\+|--)`), 'an assignment'],
  [new RegExp(String.raw`(?:\+\+|--)\s*STEPS\b`), 'an assignment'],
  [new RegExp(String.raw`\bdelete\s+STEPS\b`), 'a delete'],
  [new RegExp(String.raw`\bSTEPS\b${CHAIN}\s*\??\.\s*(?:push|pop|shift|unshift|splice|sort|reverse|fill|copyWithin)\s*\(`), 'a call of a method that changes an array'],
  [new RegExp(String.raw`\b(?:Object\s*\.\s*(?:assign|defineProperty|defineProperties|setPrototypeOf)|Reflect\s*\.\s*(?:set|defineProperty|deleteProperty|setPrototypeOf))\s*\(\s*STEPS\b`), 'a call that writes to an object'],
];

function checkWrites(bytes, found, region) {
  const text = bytes.toString('utf8');
  const before = bytes.subarray(0, found.start).toString('utf8');
  const regionText = found.bytes.toString('utf8');
  const firstRegionLine = before.split('\n').length;
  const lastRegionLine = firstRegionLine + regionText.split('\n').length - 1;
  const lines = text.split('\n');
  let ok = true;
  lines.forEach((line, index) => {
    const n = index + 1;
    if (n >= firstRegionLine && n <= lastRegionLine) return;
    for (const [pattern, kind] of WRITE_PATTERNS) {
      if (pattern.test(line)) {
        fail(`${region.path}:${n}: ${kind} on ${region.name} outside the region\n    ${line.trim().slice(0, 160)}`);
        ok = false;
        break;
      }
    }
  });
  return ok;
}

// ---- Checks 1 and 7: the whole files.
const paths = Object.keys(lock.files);
let filesOk = 0;
for (const path of paths) {
  const full = join(root, path);
  if (!existsSync(full)) {
    fail(`${path}: the file is not at its path. A frozen file does not move.\n    lock:    ${lock.files[path]}`);
    continue;
  }
  if (compareHash(path, readFileSync(full), lock.files[path])) filesOk++;
}

// ---- Check 2: the data folder.
const dataDir = join(root, lock.dataFolder.path);
const present = existsSync(dataDir) ? readdirSync(dataDir).sort() : [];
const wanted = [...lock.dataFolder.files].sort();
const extra = present.filter((f) => !wanted.includes(f));
const missing = wanted.filter((f) => !present.includes(f));
for (const f of extra) fail(`${lock.dataFolder.path}/${f}: a file that the lock does not list. The folder holds exactly ${wanted.length} files.`);
for (const f of missing) fail(`${lock.dataFolder.path}/${f}: a listed file is not in the folder.`);

// ---- Checks 3, 4 and 5: the region.
const region = lock.region;
let regionOk = false;
const regionFull = join(root, region.path);
if (!existsSync(regionFull)) {
  fail(`${region.path}: the file is not at its path.`);
} else {
  const bytes = readFileSync(regionFull);
  const found = findRegion(bytes, region);
  if (found.count !== 1) {
    fail(`${region.path}: the start anchor "${region.startAnchor}" is found ${found.count} times. It must be found exactly one time.`);
  } else if (found.noEnd) {
    fail(`${region.path}: no end anchor after the start anchor.`);
  } else {
    const a = compareHash(`${region.path}, the ${region.name} region, way (a), the exact text`, found.bytes, region.textSha256);
    let b = false;
    try {
      b = compareSteps(evaluateRegion(found.bytes, region), region, 'on disk');
    } catch (err) {
      fail(`${region.path}, the ${region.name} region, way (b): the array literal cannot be evaluated: ${err.message}`);
    }
    const c = checkWrites(bytes, found, region);
    regionOk = a && b && c;
  }
}

// ---- Check 6: the lock against the baseline commit.
function git(args, options = {}) {
  return execFileSync('git', args, { cwd: root, stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1 << 28, ...options });
}

function baselineInClone() {
  try {
    const top = git(['rev-parse', '--show-toplevel']).toString().trim();
    if (realpathSync(top) !== realpathSync(root)) return false;
    git(['cat-file', '-e', `${lock.baselineCommit}^{commit}`]);
    return true;
  } catch {
    return false;
  }
}

let baselineLine;
if (!baselineInClone()) {
  baselineLine = 'baseline commit not in this clone: files compared with the lock only';
} else {
  const before = failures.length;
  const show = (path) => {
    try {
      return git(['show', `${lock.baselineCommit}:${path}`]);
    } catch {
      fail(`${path}: the baseline commit does not hold this path, and the lock names it.`);
      return null;
    }
  };
  for (const path of paths) {
    const bytes = show(path);
    if (bytes) compareHash(`${path}: the lock was edited`, bytes, lock.files[path], 'baseline');
  }
  try {
    const listed = git(['ls-tree', '--name-only', `${lock.baselineCommit}:${lock.dataFolder.path}`]).toString().trim().split('\n').sort();
    if (JSON.stringify(listed) !== JSON.stringify(wanted)) {
      fail(`${lock.dataFolder.path}: the file list of the lock is not the list of the baseline commit\n    lock:     ${wanted.join(', ')}\n    baseline: ${listed.join(', ')}`);
    }
  } catch {
    fail(`${lock.dataFolder.path}: the baseline commit does not hold this folder.`);
  }
  const bytes = show(region.path);
  if (bytes) {
    const found = findRegion(bytes, region);
    if (found.count !== 1 || found.noEnd) {
      fail(`${region.path}: the anchors of the lock do not find one region in the file of the baseline commit.`);
    } else {
      compareHash(`${region.path}, the ${region.name} region: the lock was edited (the exact text)`, found.bytes, region.textSha256, 'baseline');
      try {
        compareSteps(evaluateRegion(found.bytes, region), region, 'of the baseline commit (the lock was edited)');
      } catch (err) {
        fail(`${region.path}: the region of the baseline commit cannot be evaluated: ${err.message}`);
      }
    }
  }
  baselineLine = failures.length === before
    ? `each lock value is equal to the value of the baseline commit ${lock.baselineCommit.slice(0, 7)}`
    : `the lock is not equal to the baseline commit ${lock.baselineCommit.slice(0, 7)}`;
}

// ---- The report.
console.log(`frozen-check: baseline ${lock.baselineCommit}`);
console.log(`  whole files equal to the lock: ${filesOk} of ${paths.length}`);
console.log(`  ${lock.dataFolder.path}: ${present.length} files, the lock lists ${wanted.length}${extra.length || missing.length ? ' (not equal)' : ''}`);
console.log(`  ${region.path}, the ${region.name} region: ${regionOk ? `equal as text and as values, ${region.stepCount} steps, no write outside the region` : 'not equal'}`);
console.log(`  ${baselineLine}`);
if (failures.length) {
  console.log('');
  for (const f of failures) console.log(`FAIL ${f}`);
  console.log(`\nfrozen-check: ${failures.length} failure(s). A frozen file does not change: no edit, no reformat, no move.`);
  process.exit(1);
}
console.log('frozen-check: no frozen file changed.');
