// tools/lib/css-scan.mjs: small readers for style text. The gate tools share them.
//
//   quiet(css)             The text with each comment, each quoted string and the inside of each
//                          url() made blank. Each line break stays, so each offset stays true.
//   chunks(css)            The parts of quiet text between `{`, `}` and `;`. A part that ends
//                          with `{` is a selector or the start of an at-rule. Each other part
//                          can be a declaration.
//   customProperties(text) Each use of a custom property name (`--name`) in a text, with its
//                          kind: `declared` (`--name:` or a quoted key `'--name':`), `set` (a
//                          script sets it with setProperty), `read` (`var(--name)`), `fallback`
//                          (`var(--name, ...)`: a read that has a fallback) or `other`.

const isNamePart = (c) => c !== undefined && /[\w-]/.test(c);

export function quiet(css) {
  const out = css.split('');
  const n = css.length;
  const fill = (from, to) => { for (let k = from; k < to && k < n; k++) if (out[k] !== '\n') out[k] = ' '; };
  const stringEnd = (at) => {
    const quote = css[at];
    let j = at + 1;
    while (j < n && css[j] !== quote && css[j] !== '\n') j += css[j] === '\\' ? 2 : 1;
    return Math.min(n, j + 1);
  };
  let i = 0;
  while (i < n) {
    const c = css[i];
    if (c === '/' && css[i + 1] === '*') {
      const close = css.indexOf('*/', i + 2);
      const end = close === -1 ? n : close + 2;
      fill(i, end);
      i = end;
    } else if (c === '"' || c === "'") {
      const end = stringEnd(i);
      fill(i, end);
      i = end;
    } else if ((c === 'u' || c === 'U') && css.slice(i, i + 4).toLowerCase() === 'url(' && !isNamePart(css[i - 1])) {
      let j = i + 4;
      while (j < n && /\s/.test(css[j])) j++;
      if (css[j] === '"' || css[j] === "'") j = stringEnd(j);
      const close = css.indexOf(')', j);
      const end = close === -1 ? n : close + 1;
      fill(i, end);
      i = end;
    } else {
      i++;
    }
  }
  return out.join('');
}

export function chunks(quietCss) {
  const list = [];
  let start = 0;
  let depth = 0;
  for (let i = 0; i <= quietCss.length; i++) {
    const c = quietCss[i];
    if (c === '(') { depth++; continue; }
    if (c === ')') { depth = Math.max(0, depth - 1); continue; }
    const end = i === quietCss.length;
    const brace = c === '{' || c === '}';
    if (!end && !brace && !(c === ';' && depth === 0)) continue;
    if (i > start) list.push({ text: quietCss.slice(start, i), start, closer: end ? '' : c });
    start = i + 1;
    if (brace) depth = 0;
  }
  return list;
}

export function customProperties(text) {
  const uses = [];
  for (const m of text.matchAll(/--[A-Za-z0-9_-]+/g)) {
    const at = m.index;
    const before = text.slice(Math.max(0, at - 24), at);
    if (isNamePart(before.at(-1))) continue;
    let after = at + m[0].length;
    const quoted = /["'`]/.test(before.at(-1) ?? '') && text[after] === before.at(-1);
    if (quoted) after++;
    while (/\s/.test(text[after] ?? '')) after++;
    const next = text[after];
    let kind = 'other';
    if (/var\(\s*$/.test(before)) kind = next === ')' ? 'read' : next === ',' ? 'fallback' : 'other';
    else if (/setProperty\(\s*["'`]$/.test(before)) kind = 'set';
    else if (next === ':' && (quoted || !/["'`]/.test(text[at + m[0].length] ?? ''))) kind = 'declared';
    uses.push({ name: m[0], index: at, kind });
  }
  for (const m of text.matchAll(/@property\s+(--[A-Za-z0-9_-]+)/g)) uses.push({ name: m[1], index: m.index, kind: 'declared' });
  return uses;
}
