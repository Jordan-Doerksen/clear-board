// tools/content-check.mjs — the F1 trust + integrity gate.
//
// Reads the JSON content from public/data/ and asserts a set of named checks.
// Collects ALL failures (never stops at the first). Then prints an informational
// report that other work depends on.
//
// HONESTY: this script never edits data. If a question hangs off an unverified
// item (F1) or any check fails, it REPORTS it. The fix is in the data, not here.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, '..', 'public', 'data');

const TRUST_VALUES = new Set(['verified', 'needs-review', 'operating-practice']);

function load(name) {
  return JSON.parse(readFileSync(join(DATA, name), 'utf8'));
}

const definitions = load('definitions.json');
const signals = load('signals.json');
const rules = load('rules.json');
const radioScript = load('radio-script.json');
const questions = load('rule-questions.json');

const contentFiles = {
  'definitions.json': definitions,
  'signals.json': signals,
  'rules.json': rules,
  'radio-script.json': radioScript,
};
const allContent = [...definitions, ...signals, ...rules, ...radioScript];

// The radio call wording lives in exactly ONE place — radioSim.js's STEPS. Read it as text (it is a
// browser module: importing it here would drag in the DOM) so the gate can prove the JSON and the
// script agree on how many steps exist and that every call has usable distractors.
const radioSimSrc = readFileSync(join(__dirname, '..', 'src', 'stations', 'radioSim.js'), 'utf8');
const RADIO_CALLS = [...radioSimSrc.matchAll(/\bcall:\s*"((?:[^"\\]|\\.)*)"/g)].map((m) =>
  m[1].replace(/\\(.)/g, '$1'),
);

// failures: array of { check, detail }
const failures = [];
const fail = (check, detail) => failures.push({ check, detail });

console.log('═══ GATE 2: content-check.mjs — trust + integrity ═══');
console.log(
  `definitions=${definitions.length}  signals=${signals.length}  rules=${rules.length}  questions=${questions.length}\n`,
);

// ── A. Every ContentItem.citation.trust is a legal value ──
for (const [file, items] of Object.entries(contentFiles)) {
  for (const it of items) {
    const t = it && it.citation && it.citation.trust;
    if (!TRUST_VALUES.has(t)) {
      fail('A', `${file}:${it && it.id} has illegal/absent trust: ${JSON.stringify(t)}`);
    }
  }
}

// ── B. No duplicate ContentItem id across all three content files ──
{
  const seen = new Map(); // id -> file where first seen
  for (const [file, items] of Object.entries(contentFiles)) {
    for (const it of items) {
      if (seen.has(it.id)) {
        fail('B', `duplicate ContentItem id "${it.id}" (in ${seen.get(it.id)} and ${file})`);
      } else {
        seen.set(it.id, file);
      }
    }
  }
}

// ── C. No duplicate Question id ──
{
  const seen = new Set();
  for (const q of questions) {
    if (seen.has(q.id)) {
      fail('C', `duplicate Question id "${q.id}"`);
    } else {
      seen.add(q.id);
    }
  }
}

// ── D. Every Question.answer is exactly one of its own choices ──
for (const q of questions) {
  const choices = Array.isArray(q.choices) ? q.choices : [];
  if (!choices.includes(q.answer)) {
    fail('D', `Question "${q.id}" answer ${JSON.stringify(q.answer)} is not among its choices`);
  }
}

// ── E. Every Question.ruleId resolves to an existing ContentItem id ──
const contentById = new Map(allContent.map((it) => [it.id, it]));
for (const q of questions) {
  if (!contentById.has(q.ruleId)) {
    fail('E', `Question "${q.id}" ruleId "${q.ruleId}" has no matching ContentItem (orphan)`);
  }
}

// ── F. CARDINAL (F1): no Question whose ruleId points to a non-verified ContentItem ──
for (const q of questions) {
  const item = contentById.get(q.ruleId);
  if (item && item.citation && item.citation.trust !== 'verified') {
    fail(
      'F',
      `Question "${q.id}" hangs off "${q.ruleId}" whose trust is "${item.citation.trust}" (must be "verified")`,
    );
  }
}

// ── G. radio-script indexes radioSim's STEPS exactly: one item per call, unique, contiguous ──
{
  if (radioScript.length !== RADIO_CALLS.length) {
    fail('G', `radio-script.json has ${radioScript.length} items but radioSim.js has ${RADIO_CALLS.length} calls`);
  }
  const seen = new Set();
  for (const it of radioScript) {
    const s = it.payload && it.payload.step;
    if (!Number.isInteger(s) || s < 0 || s >= RADIO_CALLS.length) {
      fail('G', `${it.id} payload.step ${JSON.stringify(s)} is not a valid index into STEPS (0..${RADIO_CALLS.length - 1})`);
    } else if (seen.has(s)) {
      fail('G', `${it.id} payload.step ${s} is used by more than one item`);
    } else {
      seen.add(s);
    }
  }
}

// ── H. CARDINAL (F1): a GRADED radio step must cite a verified CROR rule ──
// A radio-script item is graded iff its own trust is "verified" (store.ts `drillable`). CN GOI
// practice and the uncited closing counts must therefore NOT be verified — they play and explain,
// they never move mastery. This is the check that keeps that honest.
for (const it of radioScript) {
  const trust = it.citation && it.citation.trust;
  const source = it.citation && it.citation.source;
  if (trust === 'verified') {
    if (source !== 'CROR') {
      fail('H', `${it.id} is graded (trust=verified) but its source is "${source}" — only CROR may be graded`);
    }
    const target = contentById.get(it.payload && it.payload.ruleId);
    if (!target) {
      fail('H', `${it.id} is graded but payload.ruleId "${it.payload && it.payload.ruleId}" resolves to nothing`);
    } else if (target.citation.trust !== 'verified') {
      fail('H', `${it.id} is graded but its rule "${target.id}" has trust "${target.citation.trust}"`);
    }
  } else if (source === 'CROR') {
    fail('H', `${it.id} cites CROR but is not verified — decide: gradable, or drop the CROR source`);
  }
}

// ── I. Quiz validity (§7.5): every call has ≥2 usable distractors among the other real calls ──
// "Usable" = not equal to, containing, or contained by the answer — the same test RadioTest.tsx
// applies at runtime. Fewer than 2 and the station would silently show a short option list.
for (let i = 0; i < RADIO_CALLS.length; i++) {
  const answer = RADIO_CALLS[i].toLowerCase();
  const usable = RADIO_CALLS.filter((other, j) => {
    if (j === i) return false;
    const b = other.toLowerCase();
    return b !== answer && !answer.includes(b) && !b.includes(answer);
  });
  if (usable.length < 2) {
    fail('I', `radio call ${i} ("${RADIO_CALLS[i]}") has only ${usable.length} usable distractor(s)`);
  }
}

// ── Print check results ──
const CHECK_NAMES = {
  A: 'A. citation.trust is a legal value',
  B: 'B. no duplicate ContentItem id',
  C: 'C. no duplicate Question id',
  D: 'D. answer is one of its choices',
  E: 'E. ruleId resolves to a ContentItem',
  F: 'F. (F1) graded question only on a verified item',
  G: 'G. radio-script indexes radioSim STEPS 1:1',
  H: 'H. (F1) graded radio step cites a verified CROR rule',
  I: 'I. every radio call has ≥2 usable distractors',
};
console.log('── checks ──');
for (const key of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']) {
  const these = failures.filter((f) => f.check === key);
  if (these.length === 0) {
    console.log(`  ✓ ${CHECK_NAMES[key]}`);
  } else {
    console.log(`  ✗ ${CHECK_NAMES[key]} — ${these.length} failure(s):`);
    for (const f of these) console.log(`      - ${f.detail}`);
  }
}

// ─────────────────────────── INFORMATIONAL REPORT ───────────────────────────
console.log('\n── informational report (not pass/fail) ──');

// Counts per domain and per trust.
const byDomain = {};
const byTrust = {};
for (const it of allContent) {
  byDomain[it.domain] = (byDomain[it.domain] || 0) + 1;
  const t = it.citation && it.citation.trust;
  byTrust[t] = (byTrust[t] || 0) + 1;
}
console.log('  ContentItems per domain:');
for (const [d, n] of Object.entries(byDomain).sort((a, b) => b[1] - a[1])) {
  console.log(`      ${d}: ${n}`);
}
console.log('  ContentItems per trust:');
for (const [t, n] of Object.entries(byTrust).sort((a, b) => b[1] - a[1])) {
  console.log(`      ${t}: ${n}`);
}

// Drillability for switching + securement: which rule items have ≥1 authored question.
const qByRule = new Map(); // ruleId -> count
for (const q of questions) {
  qByRule.set(q.ruleId, (qByRule.get(q.ruleId) || 0) + 1);
}
for (const domain of ['switching', 'securement']) {
  const items = allContent.filter((it) => it.domain === domain);
  const drillable = items.filter((it) => (qByRule.get(it.id) || 0) > 0);
  console.log(`\n  ${domain} — drillable rule items (${drillable.length}/${items.length} have ≥1 question):`);
  if (items.length === 0) {
    console.log('      (no items in this domain)');
  }
  for (const it of items) {
    const n = qByRule.get(it.id) || 0;
    const mark = n > 0 ? '✓' : '·';
    console.log(`      ${mark} ${it.id}  (${n} question${n === 1 ? '' : 's'})${n > 0 ? '' : '  ← not drillable'}`);
  }
}

// Monopolizing ruleId: any ruleId with > 6 questions.
const monopolizers = [...qByRule.entries()].filter(([, n]) => n > 6).sort((a, b) => b[1] - a[1]);
console.log('\n  ruleIds with > 6 questions (possible domain monopoly):');
if (monopolizers.length === 0) {
  console.log('      (none)');
}
for (const [ruleId, n] of monopolizers) {
  const item = contentById.get(ruleId);
  const dom = item ? item.domain : '?';
  console.log(`      ${ruleId} [${dom}]: ${n} questions`);
}

// ── Verdict / exit ──
console.log('\n─── summary ───');
if (failures.length === 0) {
  console.log('✓ All checks A–I passed.');
  process.exit(0);
} else {
  const byCheck = {};
  for (const f of failures) byCheck[f.check] = (byCheck[f.check] || 0) + 1;
  const breakdown = Object.entries(byCheck).map(([k, n]) => `${k}:${n}`).join('  ');
  console.log(`✗ ${failures.length} failure(s) across checks — ${breakdown}`);
  console.log('  Fix the DATA (not this checker). F1 failures are cardinal — a graded question must never hang off an unverified item.');
  process.exit(1);
}
