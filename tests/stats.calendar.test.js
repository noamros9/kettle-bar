// Phase 9 ticket 3: the History tab's month calendar, stats.calendarMonth(entries, { dayOf, year, month, scope }).
const test = require('node:test');
const assert = require('node:assert/strict');
const { calendarMonth } = require('../app/stats.js');

const days = { p: { 1: { est: 30, blocks: [] }, 2: { est: 44, blocks: [] } }, q: { 1: { est: 20, blocks: [] } } };
const dayOf = (pid, n) => (days[pid] || {})[n];
const at = (m, d, h = 9) => new Date(2026, m - 1, d, h).toISOString();
const entries = [
  { pid: 'p', day: 1, time: at(9, 29, 8) }, { pid: 'p', day: 2, time: at(9, 29, 19) },
  { pid: 'q', day: 1, time: at(9, 1) }, { pid: 'p', day: 1, time: at(8, 31) }, { pid: 'gone', day: 1, time: at(9, 2) },
];
const sep = (scope) => calendarMonth(entries, { dayOf, year: 2026, month: 8, scope }); // month 8 = September (0-based)

test('September 2026 starts on Tuesday 1st: the first row begins Sunday 30 August, outside the month', () => {
  const weeks = sep('all');
  assert.equal(weeks[0][0].date.getTime(), new Date(2026, 7, 30).getTime());
  assert.equal(weeks[0][0].inMonth, false);
  assert.equal(weeks[0][2].date.getDate(), 1); assert.equal(weeks[0][2].inMonth, true);
  assert.ok(weeks.every((w) => w.length === 7));
  assert.equal(weeks.length, 5); // 30 Aug – 3 Oct
  assert.equal(weeks[4][6].date.getTime(), new Date(2026, 9, 3).getTime());
});

test('a day with two workouts adds their minutes and lists both, in the order they were done', () => {
  const cell = sep('all').flat().find((c) => c.inMonth && c.date.getDate() === 29);
  assert.equal(cell.minutes, 74);
  assert.deepEqual(cell.workouts.map((e) => e.day), [1, 2]);
});

test('days outside the month still carry their workouts (31 Aug shows in the first row); days the app lacks are left out', () => {
  const cells = sep('all').flat();
  assert.equal(cells.find((c) => !c.inMonth && c.date.getDate() === 31).minutes, 30);
  assert.equal(cells.find((c) => c.inMonth && c.date.getDate() === 2).workouts.length, 0);
});

test('a program picked: days of other programs are left out', () => {
  const cells = sep('p').flat();
  assert.equal(cells.find((c) => c.inMonth && c.date.getDate() === 1).minutes, 0);
  assert.equal(cells.find((c) => c.inMonth && c.date.getDate() === 29).minutes, 74);
});
