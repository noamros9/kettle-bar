// Phase 9 ticket 5: days trained per week, stats.daysPerWeek(entries, { dayOf, from, to }), rows like weekly().
const test = require('node:test');
const assert = require('node:assert/strict');
const { daysPerWeek, weekly } = require('../app/stats.js');

const EX = {};
const d = { est: 30, blocks: [] };
const dayOf = () => d;
const at = (day, h) => ({ pid: 'p', day: 1, time: new Date(2026, 8, day, h).toISOString() });
const span = { dayOf, from: new Date(2026, 8, 13), to: new Date(2026, 9, 4) }; // weeks of 13, 20, 27 Sep

test('two workouts on one date count as one day; a week with none is 0; newest week first', () => {
  const rows = daysPerWeek([at(28, 8), at(28, 19), at(29, 9), at(14, 9)], span);
  assert.deepEqual(rows.map((r) => [r.start.getDate(), r.days]), [[27, 2], [20, 0], [13, 1]]);
});

test('the rows are weekly()\'s weeks', () => {
  const es = [at(28, 8)];
  assert.deepEqual(daysPerWeek(es, span).map((r) => r.start.getTime()), weekly(es, { ...span, EX }).map((r) => r.start.getTime()));
});
