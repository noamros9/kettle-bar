// Phase 9 ticket 4: workouts by weekday and by time of day (from when a day was marked done), for a span.
const test = require('node:test');
const assert = require('node:assert/strict');
const { byWeekday, byTimeOfDay } = require('../app/stats.js');

const d = { est: 30, blocks: [] };
const dayOf = (pid) => (pid === 'gone' ? undefined : d);
const at = (day, h, m = 0) => ({ pid: 'p', day: 1, time: new Date(2026, 8, day, h, m).toISOString() });
const span = { dayOf, from: new Date(2026, 8, 27), to: new Date(2026, 9, 4) }; // Sun 27 Sep – Sat 3 Oct

test('time of day: the bucket edges (04:59 night, 05:00 morning, 12:00 afternoon, 17:00 evening, 22:00 night)', () => {
  const es = [at(28, 4, 59), at(28, 5), at(28, 11, 59), at(28, 12), at(28, 17), at(28, 21, 59), at(28, 22)];
  assert.deepEqual(byTimeOfDay(es, span), { morning: 2, afternoon: 1, evening: 2, night: 2 });
});

test('by weekday: Sunday first; counts follow the span; days the app lacks are left out', () => {
  const es = [at(27, 9), at(28, 9), at(28, 18), at(30, 9), at(20, 9), { ...at(29, 9), pid: 'gone' }];
  assert.deepEqual(byWeekday(es, span), [1, 2, 0, 1, 0, 0, 0]);
  assert.deepEqual(byTimeOfDay(es, span), { morning: 3, afternoon: 0, evening: 1, night: 0 });
});
