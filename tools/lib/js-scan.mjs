// tools/lib/js-scan.mjs: a small scanner for script source text (.js, .mjs, .ts, .tsx).
//
// It splits the text into segments of these kinds: `code`, `comment`, `string` (a quoted string
// with its quotes), `template` (one static part of a template literal, with no backtick) and
// `regex`. The segments in order hold each character of the text one time. The name check uses it to remove comments. The raw-colour lint uses it to read
// string literals only.
//
// It is a scanner and not a parser. Its limits:
//   - A quoted string and a regular expression end at the end of the line, so that a quote
//     mark in JSX text can change the reading of one line only.
//   - A `/` starts a regular expression only after an operator, an open bracket or a keyword.

const BEFORE_REGEX = new Set(['(', ',', '=', ':', '[', '!', '&', '|', '?', '{', ';', '+', '-', '*', '%', '~', '^']);
const WORD_BEFORE_REGEX = /(?:^|[^\w$.])(?:return|typeof|case|in|of|do|else|void|delete|throw|new|yield|await)$/;

export function scanJs(text) {
  const segments = [];
  const push = (kind, start, end) => { if (end > start) segments.push({ kind, start, end, text: text.slice(start, end) }); };
  const n = text.length;
  // Each entry of the stack is the brace depth of one `${ }` part of a template literal.
  const stack = [];
  let i = 0;
  let codeStart = 0;
  let lastSignificant = '';

  const regexCanStart = () => {
    if (lastSignificant === '') return true;
    if (BEFORE_REGEX.has(lastSignificant)) return true;
    return /[\w$]/.test(lastSignificant) && WORD_BEFORE_REGEX.test(text.slice(Math.max(0, i - 12), i).trimEnd());
  };

  // Read the static parts of a template literal from `i` (after the backtick or after a `}`).
  // It stops after the closing backtick, or after a `${`.
  const readTemplate = () => {
    let partStart = i;
    while (i < n) {
      const c = text[i];
      if (c === '\\') { i += 2; continue; }
      if (c === '`') { push('template', partStart, i); codeStart = i; i++; return; }
      if (c === '$' && text[i + 1] === '{') { push('template', partStart, i); codeStart = i; i += 2; stack.push(0); return; }
      i++;
    }
    push('template', partStart, n);
    codeStart = n;
  };

  while (i < n) {
    const c = text[i];
    const next = text[i + 1];
    if (c === '/' && next === '/') {
      push('code', codeStart, i);
      let end = text.indexOf('\n', i); if (end === -1) end = n;
      push('comment', i, end); i = end; codeStart = i; continue;
    }
    if (c === '/' && next === '*') {
      push('code', codeStart, i);
      let end = text.indexOf('*/', i + 2); end = end === -1 ? n : end + 2;
      push('comment', i, end); i = end; codeStart = i; continue;
    }
    if (c === '"' || c === "'") {
      push('code', codeStart, i);
      let j = i + 1;
      while (j < n && text[j] !== c && text[j] !== '\n') j += text[j] === '\\' ? 2 : 1;
      const end = Math.min(n, text[j] === c ? j + 1 : j);
      push('string', i, end); i = end; codeStart = i; lastSignificant = '"'; continue;
    }
    if (c === '`') {
      i++; push('code', codeStart, i); readTemplate(); lastSignificant = '"'; continue;
    }
    if (c === '/' && regexCanStart()) {
      let j = i + 1; let inClass = false; let closed = false;
      while (j < n && text[j] !== '\n') {
        if (text[j] === '\\') { j += 2; continue; }
        if (text[j] === '[') inClass = true;
        else if (text[j] === ']') inClass = false;
        else if (text[j] === '/' && !inClass) { closed = true; break; }
        j++;
      }
      if (closed) {
        push('code', codeStart, i);
        j++;
        while (j < n && /[a-z]/i.test(text[j])) j++;
        push('regex', i, j); i = j; codeStart = i; lastSignificant = ')'; continue;
      }
    }
    if (stack.length) {
      if (c === '{') stack[stack.length - 1]++;
      else if (c === '}') {
        if (stack[stack.length - 1] === 0) {
          stack.pop(); i++; push('code', codeStart, i); readTemplate(); lastSignificant = '"'; continue;
        }
        stack[stack.length - 1]--;
      }
    }
    if (!/\s/.test(c)) lastSignificant = c;
    i++;
  }
  push('code', codeStart, n);
  return segments;
}

// The text with each comment replaced by spaces. Line breaks stay, so line numbers stay.
export function withoutJsComments(text) {
  return scanJs(text).map((s) => (s.kind === 'comment' ? s.text.replace(/[^\n]/g, ' ') : s.text)).join('');
}

// The string literals of the text: each quoted string with no quotes, and each static part of
// a template literal. Each entry holds the text and its offset in the file.
export function stringLiterals(text) {
  const out = [];
  for (const s of scanJs(text)) {
    if (s.kind === 'string') out.push({ text: s.text.slice(1, s.text.endsWith(s.text[0]) && s.text.length > 1 ? -1 : undefined), start: s.start + 1 });
    else if (s.kind === 'template') out.push({ text: s.text, start: s.start });
  }
  return out;
}
