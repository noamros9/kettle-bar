// Phase 8 ticket 7: exercise history, level over time, and the CSV of done days.
const test = require('node:test');
const assert = require('node:assert/strict');
const { exerciseHistory, levelOverTime, toCSV } = require('../app/stats.js');

const EX = {
  push: { tp: 2.5, muscles: { primary: ['chest'], secondary: [] } },
  dip: { tp: 2.5, muscles: { primary: ['triceps'], secondary: [] } },
  row: { tp: 2.5, muscles: { primary: ['lats'], secondary: [] } },
};
const at = (m, d) => new Date(2026, m - 1, d, 9).toISOString();
const block = (...ex) => ({ sets: 3, items: ex.map((e) => ({ ex: e, n: 10 })) });
// program p: day 1 pushes and rows, day 2 was done with push swapped for dips (dayOf applies swaps); day 25 is level II
const DAYS = {
  p: { 1: { level: 1, est: 30, blocks: [block('push', 'row')], warmup: { seconds: 60 }, cooldown: { seconds: 120 } },
       2: { level: 1, est: 25, blocks: [block('dip', 'row')] }, 25: { level: 2, est: 40, blocks: [block('push')] } },
  random: { r1: { level: 3, est: 15, blocks: [block('row')] } },
};
const dayOf = (pid, n) => (DAYS[pid] || {})[n];
const entries = [
  { pid: 'p', day: 1, time: at(9, 14) }, { pid: 'p', day: 2, time: at(9, 21) },
  { pid: 'p', day: 25, time: at(9, 29) }, { pid: 'random', day: 'r1', time: at(9, 30) },
];
const span = { from: new Date(2026, 8, 13), to: new Date(2026, 9, 4) };

test('exerciseHistory counts a swapped exercise as the one done: days it came up and when last, most days first', () => {
  const h = exerciseHistory(entries, { dayOf, ...span });
  assert.deepEqual(h.map((x) => [x.ex, x.days, x.last.getDate()]), [['row', 3, 30], ['push', 2, 29], ['dip', 1, 21]]);
});

test('exerciseHistory keeps to the span and counts an exercise once per day, however many blocks have it', () => {
  const twice = { p: { 1: { level: 1, est: 30, blocks: [block('push'), block('push')] } } };
  const h = exerciseHistory([{ pid: 'p', day: 1, time: at(9, 14) }, { pid: 'p', day: 1, time: at(8, 1) }, { pid: 'gone', day: 1, time: at(9, 14) }],
    { dayOf: (pid, n) => (twice[pid] || {})[n], ...span });
  assert.deepEqual(h.map((x) => [x.ex, x.days]), [['push', 1]]);
});

test('levelOverTime: per program, the highest level done each week, oldest first; empty weeks are null', () => {
  const rows = levelOverTime(entries, { dayOf, ...span });
  assert.deepEqual(rows.map((r) => [r.pid, r.weeks.map((w) => w.level)]), [['p', [1, 1, 2]], ['random', [null, null, 3]]]);
  assert.deepEqual(rows[0].weeks.map((w) => w.start.getDate()), [13, 20, 27]);
});

test('toCSV: a header and one row per done day, random workouts included, oldest first', () => {
  const csv = toCSV([...entries].reverse(), { dayOf, EX, nameOf: (pid) => (pid === 'p' ? 'Push, "Pull" & legs' : null) });
  const lines = csv.trim().split('\n');
  assert.equal(lines[0], 'date,program,day,level,workout_minutes,stretching_minutes,sets,reps');
  assert.equal(lines.length, 1 + 4);
  assert.equal(lines[1], '2026-09-14,"Push, ""Pull"" & legs",1,1,30,3,6,60');
  assert.equal(lines[4], '2026-09-30,Random,,3,15,0,3,30');
  assert.ok(csv.endsWith('\n'));
});

test('toCSV leaves out days the app no longer has', () => {
  assert.equal(toCSV([{ pid: 'gone', day: 1, time: at(9, 1) }], { dayOf, EX, nameOf: () => 'x' }).trim().split('\n').length, 1);
});

test('exerciseHistory: on the same number of days, the most recent comes first', () => {
  const two = { p: { 1: { level: 1, est: 30, blocks: [block('push')] }, 2: { level: 1, est: 30, blocks: [block('dip')] } } };
  const h = exerciseHistory([{ pid: 'p', day: 1, time: at(9, 14) }, { pid: 'p', day: 2, time: at(9, 21) }], { dayOf: (pid, n) => two[pid][n], ...span });
  assert.deepEqual(h.map((x) => x.ex), ['dip', 'push']);
});
