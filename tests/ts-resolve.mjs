// tests/ts-resolve.mjs: the resolve hook of the unit tests.
//
// Node runs a `.ts` file with no flag: it removes the types. Node does not resolve an import
// with no extension. Some app sources have such imports. This hook resolves a relative import
// with no extension, from a file, to the `.ts` file or the `.tsx` file when that file exists.
// So no app source is edited for a test.
//
// Use: node --import ./tests/ts-resolve.mjs --test "tests/unit/**/*.test.ts"
import { existsSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { fileURLToPath } from 'node:url';

const HAS_EXTENSION = /\.[A-Za-z0-9]+$/;

registerHooks({
  resolve(specifier, context, nextResolve) {
    const relative = specifier.startsWith('./') || specifier.startsWith('../');
    if (relative && context.parentURL?.startsWith('file:') && !HAS_EXTENSION.test(specifier)) {
      for (const extension of ['.ts', '.tsx']) {
        const url = new URL(specifier + extension, context.parentURL);
        if (existsSync(fileURLToPath(url))) return nextResolve(url.href, context);
      }
    }
    return nextResolve(specifier, context);
  },
});
