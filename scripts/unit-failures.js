#!/usr/bin/env node
/* CI (after a failed unit run): each failing test of node --test's TAP, with its location and error, and any coverage
   shortfall, as a GitHub annotation (::error), so the PR shows what failed without opening the raw log. */
const fs = require('fs');

function failures(text) {
  const lines = text.split('\n'), out = [];
  lines.forEach((l, i) => {
    const m = l.match(/^\s*not ok \d+ - (.+)$/);
    if (!m) return;
    const block = lines.slice(i + 1, i + 30);
    const end = block.findIndex((x) => /^\s*\.\.\.\s*$/.test(x));
    const body = (end < 0 ? block : block.slice(0, end)).join('\n');
    if (/failureType: 'subtestsFailed'/.test(body)) return; // a file's summary line: its failing test is listed itself
    const loc = (body.match(/location: '([^']+)'/) || [])[1] || '';
    const err = (body.match(/error: \|?-?\s*\n?\s*'?([^\n']+)/) || [])[1] || '';
    out.push({ name: m[1].trim(), loc, err: err.trim() });
  });
  const cover = lines.filter((l) => /coverage threshold|does not meet/i.test(l)).map((l) => l.replace(/^#\s*/, '').trim());
  return { tests: out, cover };
}
module.exports = { failures };
if (require.main === module) {
  const { tests, cover } = failures(fs.readFileSync(process.argv[2], 'utf8'));
  const esc = (s) => s.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
  tests.slice(0, 20).forEach((t) => console.log(`::error title=${esc(t.name.slice(0, 120))}::${esc(`${t.err} (${t.loc.replace(/^.*\/tests\//, 'tests/')})`)}`));
  cover.forEach((c) => console.log(`::error title=Coverage::${esc(c)}`));
  if (!tests.length && !cover.length) console.log('::error::The unit run failed before any test result (see the raw log).');
}
