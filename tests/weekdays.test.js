// Phase 33 ticket 3 (#291): the next training weekday from a program's weekdays, today and whether today is done.
const test = require('node:test');
const assert = require('node:assert/strict');
const { nextWorkout, WEEKDAY_NAMES } = require('../app/progress.js');

// 2026-10-11 is a Sunday; day d of that week is 11 + d
const on = (d) => new Date(2026, 9, 11 + d, 9, 0);
const SUN_TUE_THU = [0, 2, 4];

test('no weekdays: nothing to say', () => {
  assert.equal(nextWorkout([], on(1), false), null);
  assert.equal(nextWorkout(undefined, on(1), false), null);
});

test('every weekday, today not done: today when it is a training day, else the next one', () => {
  const want = [[0, 0], [2, 1], [2, 0], [4, 1], [4, 0], [0, 2], [0, 1]]; // [day, inDays] for Sun..Sat
  want.forEach(([day, inDays], d) => assert.deepEqual(nextWorkout(SUN_TUE_THU, on(d), false), { day, inDays, name: WEEKDAY_NAMES[day] }, WEEKDAY_NAMES[d]));
});

test('every weekday, today done: the next training day after today, across the week\'s end', () => {
  const want = [[2, 2], [2, 1], [4, 2], [4, 1], [0, 3], [0, 2], [0, 1]];
  want.forEach(([day, inDays], d) => assert.deepEqual(nextWorkout(SUN_TUE_THU, on(d), true), { day, inDays, name: WEEKDAY_NAMES[day] }, WEEKDAY_NAMES[d]));
});

test('one weekday that is today, done: a week from now', () => {
  assert.deepEqual(nextWorkout([1], on(1), true), { day: 1, inDays: 7, name: 'Monday' });
});
