#!/usr/bin/env node
/* The coverage gate over CI's unit shards (decision 313): node scripts/coverage-gate.js a/lcov.info b/lcov.info …
   Merges the shards' lcov (a line, function or branch counts as covered if any shard covered it), keeps the files in
   test:coverage's --test-coverage-include list, and applies its thresholds (lines, functions, branches) to the total,
   as node's own gate does on one run. Exits 1 below the gate. */
const fs = require('fs');
const path = require('path');

function parse(text, into = {}) {
  let f = null;
  text.split('\n').forEach((line) => {
    const [k, v = ''] = line.split(/:(.*)/s);
    if (k === 'SF') f = into[v] || (into[v] = { lines: {}, fns: {}, branches: {} });
    else if (!f) return;
    else if (k === 'DA') { const [n, hits] = v.split(','); f.lines[n] = (f.lines[n] || 0) + +hits; }
    else if (k === 'FN') { const name = v.split(',').slice(1).join(','); if (!(name in f.fns)) f.fns[name] = 0; }
    else if (k === 'FNDA') { const [hits, ...name] = v.split(','); const n = name.join(','); f.fns[n] = (f.fns[n] || 0) + +hits; }
    else if (k === 'BRDA') { const [l, b, br, taken] = v.split(','); const key = `${l},${b},${br}`; f.branches[key] = (f.branches[key] || 0) + (taken === '-' ? 0 : +taken); }
    else if (k === 'end_of_record') f = null;
  });
  return into;
}

function totals(files, keep) {
  const t = { lines: [0, 0], functions: [0, 0], branches: [0, 0] };
  Object.entries(files).filter(([file]) => keep(file)).forEach(([, f]) => {
    [['lines', f.lines], ['functions', f.fns], ['branches', f.branches]].forEach(([k, m]) => {
      const v = Object.values(m); t[k][0] += v.filter((h) => h > 0).length; t[k][1] += v.length;
    });
  });
  return Object.fromEntries(Object.entries(t).map(([k, [hit, all]]) => [k, all ? (100 * hit) / all : 100]));
}

function gateOf(script) {
  const n = (name) => +script.match(new RegExp(`--test-coverage-${name}=(\\d+)`))[1];
  return { lines: n('lines'), functions: n('functions'), branches: n('branches'), include: script.match(/--test-coverage-include=(\S+)/g).map((s) => s.split('=')[1]) };
}

function check(lcovTexts, script, root) {
  const files = lcovTexts.reduce((into, t) => parse(t, into), {});
  const gate = gateOf(script);
  const wanted = new Set(gate.include.map((f) => path.resolve(root, f)));
  const found = Object.keys(files).filter((f) => wanted.has(path.resolve(root, f)));
  const t = totals(files, (f) => wanted.has(path.resolve(root, f)));
  const below = ['lines', 'functions', 'branches'].filter((k) => t[k] < gate[k]);
  const missing = [...wanted].filter((w) => !found.some((f) => path.resolve(root, f) === w));
  return { totals: t, gate, below, missing };
}

module.exports = { parse, totals, gateOf, check };

if (require.main === module) {
  const root = path.join(__dirname, '..');
  const r = check(process.argv.slice(2).map((f) => fs.readFileSync(f, 'utf8')), require('../package.json').scripts['test:coverage'], root);
  ['lines', 'functions', 'branches'].forEach((k) => console.log(`${k.padEnd(10)} ${r.totals[k].toFixed(2)}% (gate ${r.gate[k]}%)`));
  if (r.missing.length) console.log('no coverage for: ' + r.missing.map((f) => path.relative(root, f)).join(', '));
  if (r.below.length || r.missing.length) { console.log('BLOCKED: core coverage below the gate'); process.exit(1); }
  console.log('Coverage gate OK.');
}
