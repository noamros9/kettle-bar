#!/usr/bin/env node
// THROWAWAY (review branch, never merged): the slowest unit/UI tests and the coverage gaps, as CI notices.
const fs = require('fs');
const [kind, file] = process.argv.slice(2);
const text = fs.readFileSync(file, 'utf8');
const esc = (s) => s.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
const note = (title, lines) => { for (let i = 0; i < lines.length; i += 40) console.log(`::notice title=${title} ${i / 40 + 1}::${esc(lines.slice(i, i + 40).join('\n'))}`); };
if (kind === 'unit') {
  const lines = text.split('\n'), files = [], tests = [];
  lines.forEach((l, i) => {
    const m = l.match(/^(\s*)(?:not )?ok \d+ - (.+)$/); if (!m) return;
    const d = lines.slice(i + 1, i + 12).map((x) => x.match(/duration_ms: ([\d.]+)/)).find(Boolean);
    if (!d) return;
    (m[1].length === 0 ? files : tests).push([+d[1], m[2].trim()]);
  });
  files.sort((a, b) => b[0] - a[0]); tests.sort((a, b) => b[0] - a[0]);
  note('Slowest unit files', files.slice(0, 25).map(([ms, n]) => `${(ms / 1000).toFixed(1)} s  ${n}`));
  note('Slowest unit tests', tests.slice(0, 25).map(([ms, n]) => `${(ms / 1000).toFixed(1)} s  ${n}`));
  const total = files.reduce((t, [ms]) => t + ms, 0);
  note('Unit totals', [`${files.length} files, ${tests.length} tests, sum of file times ${(total / 60000).toFixed(1)} min`]);
  const cov = lines.filter((l) => /^#\s+\S+\.js\s*\|/.test(l) && !/100\.00 \|\s+100\.00 \|\s+100\.00/.test(l)).map((l) => l.replace(/^#\s*/, ''));
  note('Coverage gaps', cov.length ? cov : ['none']);
} else {
  const rows = [];
  text.split('\n').forEach((l) => {
    const m = l.match(/›\s+(tests-ui\/[^ ]+)\s+›\s+(.+?)\s+\((\d+(?:\.\d+)?)(ms|s|m)\)\s*$/); if (!m) return;
    const ms = +m[3] * (m[4] === 'ms' ? 1 : m[4] === 's' ? 1000 : 60000); rows.push([ms, `${m[1]} › ${m[2]}`]);
  });
  rows.sort((a, b) => b[0] - a[0]);
  const byFile = {}; rows.forEach(([ms, n]) => { const f = n.split(' › ')[0].replace(/:\d+:\d+$/, ''); byFile[f] = (byFile[f] || 0) + ms; });
  note('Slowest UI tests', rows.slice(0, 25).map(([ms, n]) => `${(ms / 1000).toFixed(1)} s  ${n}`));
  note('UI spec files by total', Object.entries(byFile).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([f, ms]) => `${(ms / 1000).toFixed(1)} s  ${f}`));
  note('UI totals', [`${rows.length} tests, sum ${(rows.reduce((t, [ms]) => t + ms, 0) / 60000).toFixed(1)} min`]);
}
