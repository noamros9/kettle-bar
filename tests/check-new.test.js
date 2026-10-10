// `npm run check:new` (scripts/check-new.js): the library rules CI checks over every program, run before a push on
// this phase's programs only, one config at a time. Here on single real configs, never the whole library.
const test = require('node:test');
const assert = require('node:assert/strict');
const { problemsOf } = require('../scripts/check-new.js');
const { CONFIGS } = require('../program-builder.js');

const copy = (id) => JSON.parse(JSON.stringify(CONFIGS.find((c) => c.id === id)));

test('a library program that CI passes has no problems', () => {
  assert.deepEqual(problemsOf(copy('twenty-flat')), []);
});

test('a day outside its time range, a short about and a missing day name are named', () => {
  const c = copy('twenty-flat');
  c.minutes = [40, 42];
  c.about = 'Too short.';
  c.names = c.names.slice(1);
  const p = problemsOf(c);
  assert.ok(p.some((x) => /^d1 L1 .* min \(40-42\)$/.test(x)), p.join('; '));
  assert.ok(p.includes('about: 1 sentences'));
  assert.ok(p.includes('names: 19'));
});

test('bodyweight only: a lateral raise left without a floor stand-in is named (floor.test\'s rule)', () => {
  const c = copy('twenty-flat');
  c.dayTypes.a.blocks = [{ f: 'straight', title: 'Raises', slots: ['db_lu_raise', 'leaning_lateral_raise', 'lateral_raise'] }];
  assert.ok(problemsOf(c).some((x) => /travel: lateral_raise/.test(x)));
});

test('a muscle program whose own muscle is not trained most is named (library.test\'s focus rule)', () => {
  const c = { ...copy('twenty-flat'), subject: 'Arms' };
  assert.ok(problemsOf(c).some((x) => /^focus: /.test(x)));
});
