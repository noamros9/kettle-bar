// Phase 9 ticket 2: a program's muscle focus (stats.programFocus) and ranking programs for picked muscles (library.rankPrograms).
const test = require('node:test');
const assert = require('node:assert/strict');
const { programFocus } = require('../app/stats.js');
const { rankPrograms } = require('../app/library.js');

const EX = {
  squat: { tp: 2.5, muscles: { primary: ['quads', 'glutes'], secondary: [] } },
  bridge: { tp: 2.5, muscles: { primary: ['glutes'], secondary: ['hamstrings'] } },
  press: { tp: 2.5, muscles: { primary: ['front_delts'], secondary: ['triceps'] } },
};
const day = (ex, sets = 3) => ({ est: 30, blocks: [{ sets, items: [{ ex, n: 10 }] }] });

test('programFocus: each muscle\'s share of the weighted sets over all the days; the shares add up to 1', () => {
  const f = programFocus([day('squat'), day('bridge')], EX);
  const total = 3 + 3 + 3 + 1.5; // squat: quads + glutes; bridge: glutes + ½ hamstrings
  assert.deepEqual(f, { quads: 3 / total, glutes: 6 / total, hamstrings: 1.5 / total });
  assert.ok(Math.abs(Object.values(f).reduce((a, b) => a + b, 0) - 1) < 1e-12);
  assert.deepEqual(programFocus([], EX), {});
});

test('rankPrograms: with glutes picked, a legs program ranks above an upper-body one, which is not listed', () => {
  const focus = { legs: programFocus([day('squat'), day('bridge')], EX), upper: programFocus([day('press')], EX) };
  assert.deepEqual(rankPrograms(focus, ['glutes']), ['legs']);
});

test('rankPrograms: programs with all the picked muscles first, then the sum of their shares, then the order given', () => {
  const focus = { a: { glutes: 0.9 }, b: { glutes: 0.1, hamstrings: 0.1 }, c: { glutes: 0.1, hamstrings: 0.1 }, d: { quads: 1 } };
  assert.deepEqual(rankPrograms(focus, ['glutes', 'hamstrings']), ['b', 'c', 'a']);
  assert.deepEqual(rankPrograms(focus, ['glutes', 'hamstrings'], 2), ['b', 'c']);
  assert.deepEqual(rankPrograms(focus, []), []);
});
