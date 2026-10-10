// The coverage gate over CI's unit shards (decision 313): scripts/coverage-gate.js merges the shards' lcov and applies
// test:coverage's thresholds to the files it includes.
const test = require('node:test');
const assert = require('node:assert/strict');
const { parse, totals, gateOf, check } = require('../scripts/coverage-gate.js');

const rec = (file, { da = [], fn = [], fnda = [], brda = [] }) => ['SF:' + file, ...fn.map((n) => `FN:1,${n}`), ...fnda.map(([h, n]) => `FNDA:${h},${n}`),
  ...da.map(([l, h]) => `DA:${l},${h}`), ...brda.map(([l, b, br, t]) => `BRDA:${l},${b},${br},${t}`), 'end_of_record'].join('\n');
const SCRIPT = 'node --test --test-coverage-lines=100 --test-coverage-branches=95 --test-coverage-functions=100 --test-coverage-include=app/a.js --test-coverage-include=app/b.js tests/*.test.js';

test('a line, function or branch is covered if any shard covered it', () => {
  const one = rec('/r/app/a.js', { da: [[1, 1], [2, 0]], fn: ['f', 'g'], fnda: [[1, 'f'], [0, 'g']], brda: [[1, 0, 0, 1], [1, 0, 1, '-']] });
  const two = rec('/r/app/a.js', { da: [[1, 0], [2, 3]], fn: ['f', 'g'], fnda: [[0, 'f'], [2, 'g']], brda: [[1, 0, 0, 0], [1, 0, 1, 4]] });
  const t = totals(parse(two, parse(one)), () => true);
  assert.deepEqual(t, { lines: 100, functions: 100, branches: 100 });
});

test('only the included files count; the thresholds come from test:coverage', () => {
  assert.deepEqual(gateOf(SCRIPT), { lines: 100, functions: 100, branches: 95, include: ['app/a.js', 'app/b.js'] });
  const ok = rec('/r/app/a.js', { da: [[1, 1]] }) + '\n' + rec('/r/app/b.js', { da: [[1, 1]] }) + '\n' + rec('/r/tests/x.js', { da: [[1, 0]] });
  assert.deepEqual(check([ok], SCRIPT, '/r').below, []);
});

test('below the gate, or an included file no shard loaded, blocks', () => {
  const low = rec('/r/app/a.js', { da: [[1, 1], [2, 0]] }) + '\n' + rec('/r/app/b.js', { da: [[1, 1]] });
  assert.deepEqual(check([low], SCRIPT, '/r').below, ['lines']);
  const r = check([rec('/r/app/a.js', { da: [[1, 1]] })], SCRIPT, '/r');
  assert.deepEqual(r.missing, ['/r/app/b.js']);
  assert.deepEqual(totals({}, () => true), { lines: 100, functions: 100, branches: 100 });
});
