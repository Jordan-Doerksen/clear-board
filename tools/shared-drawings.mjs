// tools/shared-drawings.mjs: the report of row U-01, step 12 of `npm run check`.
//
// It lists each signal drawing that belongs to two signal items or more. It reads the frozen
// content files of public/data and calls sharedDrawings of src/core/drill.ts, which draws each
// entry with the frozen drawing function (drawSignal of src/core/signal.ts). Two entries have one
// drawing when the function gives the same SVG text for them. The Drill does not ask such a
// drawing (row U-01). The content is frozen, and the shared drawings are a question for the SME
// (note S-01), so the list is a report: a shared drawing does not fail the step. The step fails
// only when it cannot make the list.
//
// It reads and never writes. It needs no network, no dist/ and no browser.
//
// Use: node --import ./tests/ts-resolve.mjs tools/shared-drawings.mjs
// (src/core/drill.ts imports with no extension; the resolve hook of the unit tests finds the file.)
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { drawingOf, sharedDrawings } from '../src/core/drill.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// The content files of the app, as store.ts loads them.
const CONTENT_FILES = ['definitions.json', 'signals.json', 'rules.json', 'radio-script.json'];
const QUESTION_FILES = ['rule-questions.json'];
const read = (file) => {
  const list = JSON.parse(readFileSync(join(root, 'public', 'data', file), 'utf8'));
  if (!Array.isArray(list)) throw new Error(`public/data/${file} is not a list`);
  return list;
};

const items = CONTENT_FILES.flatMap(read);
const questions = QUESTION_FILES.flatMap(read);
const byDomain = {};
for (const i of items) (byDomain[i.domain] ||= []).push(i);
const questionsByRule = {};
for (const q of questions) (questionsByRule[q.ruleId] ||= []).push(q);
const content = { items, byId: Object.fromEntries(items.map((i) => [i.id, i])), byDomain, questions, questionsByRule };

const signalItems = items.filter((i) => i.type === 'signal');
const entries = signalItems.reduce((n, i) => n + (i.payload?.aspects?.length ?? 0), 0);
if (!signalItems.length || !entries) throw new Error('the content files hold no signal item with a drawing');

// The words of one entry, as the data gives them: the head codes from the top, and the fields.
const describe = (a) => [`heads ${(a.heads ?? []).join(' ')}`, a.type ? `type ${a.type}` : '', a.plaque ? `plaque ${a.plaque}` : '', a.stagger ? 'stagger' : '', a.flash ? 'flash' : '']
  .filter(Boolean).join(', ');
// "entry 2 of 4", "entries 1 and 5 of 5".
const places = (ns, of) => `${ns.length === 1 ? 'entry' : 'entries'} ${ns.length === 1 ? ns[0] : `${ns.slice(0, -1).join(', ')} and ${ns.at(-1)}`} of ${of}`;

const shared = sharedDrawings(content);
console.log(`shared-drawings: ${signalItems.length} signal items with ${entries} entries.`);
console.log(`shared-drawings: ${shared.length} drawings belong to two signal items or more. The Drill does not ask them (row U-01). Note S-01 is for the SME.`);
shared.forEach((d, k) => {
  const owners = d.itemIds.map((id) => {
    const aspects = content.byId[id].payload.aspects;
    const at = aspects.map((a, n) => (drawingOf(a) === d.svg ? n + 1 : 0)).filter(Boolean);
    return { id, at, of: aspects.length, first: aspects[at[0] - 1] };
  });
  console.log(`  drawing ${k + 1} (${describe(owners[0].first)}): ${owners.map((o) => `${o.id} ${places(o.at, o.of)}`).join('; ')}`);
});
console.log('shared-drawings: a report only. A shared drawing does not fail the step.');
