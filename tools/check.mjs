// tools/check.mjs: the runner of `npm run check`.
//
// It runs each offline gate step in order. For each step it prints the output of the step, then
// one line that starts with PASS or FAIL, with the step number, the step name and the time.
// It runs the remaining steps after a failure. It exits non-zero if one step failed.
//
// Each step is offline. No step needs the network, `dist/` or a browser. No step writes a
// tracked file.
//
// A step with an npm script name runs the command text of that script from `package.json`, so
// the arguments of a gate are in one place. A step with no script name runs its own command.
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { delimiter, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const scripts = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).scripts;

// The limit of lint warnings. It is the count of warnings after Wave 2b. The two warnings are in
// files of other jobs: `src/stations/imperativeStation.ts` (Y4) and `src/state/AppContext.tsx`
// (U1). The closing commit of the G1 line lowers this number when a job removes a warning. It
// never goes up.
const LINT_WARNING_LIMIT = 2;

// The steps, in the order of the run. `script` is an npm script name. `command` is a command
// line for a step that has no npm script name. `extra` is text that the runner adds to the
// command of the script. Step 12 is a report (row U-01): it lists the shared signal drawings and
// fails only when it cannot make the list.
const STEPS = [
  { n: 1, name: 'check:frozen', script: 'check:frozen' },
  { n: 2, name: 'check:dusk', script: 'check:dusk' },
  { n: 3, name: 'check:colour', script: 'check:colour' },
  { n: 4, name: 'check:names', script: 'check:names' },
  { n: 5, name: 'lint', script: 'lint', extra: `--max-warnings ${LINT_WARNING_LIMIT}` },
  { n: 6, name: 'typecheck', script: 'typecheck' },
  { n: 7, name: 'test:unit', script: 'test:unit' },
  { n: 8, name: 'sr-vectors', command: 'node tools/sr-vectors.mjs' },
  { n: 9, name: 'solve', command: 'node tools/solve.mjs' },
  { n: 10, name: 'content-check', command: 'node tools/content-check.mjs' },
  { n: 11, name: 'securement-check', command: 'node tools/securement-check.mjs' },
  { n: 12, name: 'shared-drawings', command: 'node --import ./tests/ts-resolve.mjs tools/shared-drawings.mjs' },
];

const env = {
  ...process.env,
  PATH: [join(root, 'node_modules', '.bin'), dirname(process.execPath), process.env.PATH ?? '']
    .join(delimiter),
};

function commandOf(step) {
  if (step.command) return step.command;
  const text = scripts[step.script];
  if (!text) return null;
  return step.extra ? `${text} ${step.extra}` : text;
}

// Run one command line. The result holds the exit code and the output, with stdout and stderr
// in the order of arrival.
function run(commandLine) {
  return new Promise((resolve) => {
    const chunks = [];
    const child = spawn(commandLine, { cwd: root, env, shell: true, stdio: ['ignore', 'pipe', 'pipe'] });
    child.stdout.on('data', (c) => chunks.push(c));
    child.stderr.on('data', (c) => chunks.push(c));
    child.on('error', (err) => resolve({ code: 1, output: `${err.message}\n` }));
    child.on('close', (code, signal) =>
      resolve({ code: code ?? 1, output: Buffer.concat(chunks).toString('utf8') + (signal ? `stopped by signal ${signal}\n` : '') }));
  });
}

const seconds = (ms) => `${(ms / 1000).toFixed(2)} s`;
const label = (step) => `step ${String(step.n).padStart(2)}  ${step.name}`;

const started = Date.now();
const results = [];
for (const step of STEPS) {
  const commandLine = commandOf(step);
  console.log(`---- ${label(step)}: ${commandLine ?? '(no command)'}`);
  const t0 = Date.now();
  const result = commandLine
    ? await run(commandLine)
    : { code: 1, output: `package.json has no script "${step.script}"\n` };
  const ms = Date.now() - t0;
  const text = result.output.replace(/\s+$/, '');
  if (text) console.log(text.split('\n').map((line) => `    ${line}`).join('\n'));
  const ok = result.code === 0;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label(step)}  ${seconds(ms)}${ok ? '' : `  (exit ${result.code})`}`);
  results.push({ step, ok, ms });
}

const failed = results.filter((r) => !r.ok);
console.log('');
console.log(`check: ${results.length - failed.length} of ${results.length} steps passed in ${seconds(Date.now() - started)}`);
if (failed.length) console.log(`check: failed: ${failed.map((r) => `${r.step.n} ${r.step.name}`).join(', ')}`);
process.exit(failed.length ? 1 : 0);
