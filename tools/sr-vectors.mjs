// sr-vectors.mjs — golden-vector pin for the SM-2-lite retention engine (src/core/sr.ts).
// The anti-false-confidence engine must keep meaning exactly what the docs say; this fails the gate
// if the schedule / ease math ever silently drifts (REVAMP rec #11). No test runner needed — we
// transpile sr.ts with the installed tsc (types erased) and import the result.
import ts from 'typescript';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const srcUrl = new URL('../src/core/sr.ts', import.meta.url);
const outDir = new URL('../.gate/', import.meta.url);
const outUrl = new URL('../.gate/sr.mjs', import.meta.url);
mkdirSync(outDir, { recursive: true });
const js = ts.transpileModule(readFileSync(srcUrl, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText;
writeFileSync(outUrl, js);
const sr = await import(outUrl.href);

console.log('═══ GATE 0: sr-vectors.mjs — SM-2-lite schedule ═══');
let failed = 0;
const approx = (a, b) => Math.abs(a - b) < 1e-9;
const check = (name, cond) => { console.log(`  ${cond ? '✓' : '✗'} ${name}`); if (!cond) failed++; };

// Golden vectors — boolean (correct/incorrect) V1 mode, from a fresh item.
let s = sr.grade(undefined, true);
check('1st correct → interval 1, ease 2.55, fam 1/30', s.interval === 1 && approx(s.ease, 2.55) && approx(s.fam, 1 / 30));
s = sr.grade(s, true);
check('2nd correct → interval 6, ease 2.60, fam 0.2', s.interval === 6 && approx(s.ease, 2.6) && approx(s.fam, 0.2));
s = sr.grade(s, true);
check('3rd correct → interval 16, ease 2.65, fam 16/30', s.interval === 16 && approx(s.ease, 2.65) && approx(s.fam, 16 / 30));
s = sr.grade(s, false);
check('miss → interval 0, ease 2.45', s.interval === 0 && approx(s.ease, 2.45));

// ease reaches the 2.8 ceiling after 6 corrects (2.5 + 6×0.05); 8 is plenty and keeps `interval`
// (and thus `due`) inside the valid Date range — an unrealistic immediate streak overflows it.
let hi = sr.newState(); for (let i = 0; i < 8; i++) hi = sr.grade(hi, true);
check('ease ceiling 2.8', approx(hi.ease, 2.8));
let lo = sr.newState(); for (let i = 0; i < 8; i++) lo = sr.grade(lo, false);
check('ease floor 1.3', approx(lo.ease, 1.3));
const n = sr.newState();
check('newState defaults: ease 2.5, interval 0, fam 0', n.ease === 2.5 && n.interval === 0 && n.fam === 0);

console.log(failed
  ? `\n✗ sr-vectors: ${failed} golden vector(s) drifted from the documented schedule (SPEC §Retention).`
  : '\n✓ sr-vectors: SM-2-lite matches its documented schedule.');
process.exit(failed ? 1 : 0);
