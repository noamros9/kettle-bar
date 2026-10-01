// Phase 8 ticket 6: longer spans (3 months, this year) and the trend: weekly() and monthly() rows.
const test = require('node:test');
const assert = require('node:assert/strict');
const { spanRange, weekly, monthly, report, summarize } = require('../app/stats.js');

const EX = { push: { tp: 2.5, muscles: { primary: ['chest'], secondary: [] } } };
const day = { est: 30, blocks: [{ sets: 3, items: [{ ex: 'push', n: 10 }] }] };
const dayOf = () => day;
const wed = new Date(2026, 8, 30, 12); // Wednesday 30 Sep 2026
const at = (m, d) => ({ pid: 'p', day: 1, time: new Date(2026, m - 1, d, 9).toISOString() });
const entries = [at(1, 1), at(1, 3), at(2, 14), at(6, 30), at(7, 1), at(9, 27), at(9, 30), { ...at(12, 31), time: new Date(2025, 11, 31, 9).toISOString() }];
const sum = (rows, k) => rows.reduce((a, r) => a + r[k], 0);

test('3 months: the last 13 whole weeks, this one included', () => {
  assert.deepEqual(spanRange('3months', wed, []), { from: new Date(2026, 6, 5), to: new Date(2026, 9, 4) });
});

test("this year: from 1 January to the end of this week", () => {
  assert.deepEqual(spanRange('year', wed, []), { from: new Date(2026, 0, 1), to: new Date(2026, 9, 4) });
});

test('monthly(): a row per month, newest first, the first one starting on the span\'s first day', () => {
  const { from, to } = spanRange('year', wed, []);
  const rows = monthly(entries, { dayOf, EX, from, to });
  assert.deepEqual(rows.map((r) => r.start.getMonth()), [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
  assert.deepEqual(rows.map((r) => r.workouts), [0, 2, 0, 1, 1, 0, 0, 0, 1, 2]);
});

test('this year: monthly() and weekly() totals each equal the span\'s totals (31 Dec 2025 left out)', () => {
  const opts = { dayOf, EX, ...spanRange('year', wed, []) };
  const total = summarize(entries, opts), weeks = weekly(entries, opts), months = monthly(entries, opts);
  assert.equal(total.workouts, 7);
  for (const k of ['workouts', 'workoutMin', 'sets', 'reps']) {
    assert.equal(sum(months, k), total[k], `months: ${k}`);
    assert.equal(sum(weeks, k), total[k], `weeks: ${k}`);
  }
  assert.deepEqual(weeks[weeks.length - 1].start, new Date(2026, 0, 1), 'the first week starts on 1 January, a Thursday');
});

test('report: months for this year only; weeks for every span longer than one week', () => {
  const input = { entries, dayOf, EX, names: {} };
  const y = report(input, { scope: 'all', span: 'year', now: wed });
  assert.equal(y.months.length, 10); assert.ok(y.weeks.length > 30);
  const q = report(input, { scope: 'all', span: '3months', now: wed });
  assert.equal(q.months, null); assert.equal(q.weeks.length, 13); assert.equal(q.totals.workouts, 2, "30 Jun and 1 Jul are before 5 Jul");
  assert.equal(report(input, { scope: 'all', span: 'week', now: wed }).months, null);
});
