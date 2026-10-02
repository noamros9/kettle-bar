// Program length and levels in one place (architecture review IV, ticket 4)
const test = require('node:test');
const assert = require('node:assert/strict');
const L = require('../app/length.js');
const Random = require('../app/random.js');

test('a 60-day program: levels at days 1-20, 21-40, 41-60', () => {
  assert.deepEqual([1, 20, 21, 40, 41, 60].map((d) => L.levelOf(60, d)), [1, 1, 2, 2, 3, 3]);
  assert.deepEqual(L.levelStarts(60), [1, 21, 41]);
  assert.equal(L.levelRanges(60), 'I days 1–20, II days 21–40, III days 41–60');
});

test('a 30-day program: levels at days 1-10, 11-20, 21-30', () => {
  assert.deepEqual([1, 10, 11, 20, 21, 30].map((d) => L.levelOf(30, d)), [1, 1, 2, 2, 3, 3]);
  assert.deepEqual(L.levelStarts(30), [1, 11, 21]);
  assert.equal(L.levelRanges(30), 'I days 1–10, II days 11–20, III days 21–30');
});

test('every level start is where levelOf steps up', () => {
  for (const n of [30, 60]) {
    const [, two, three] = L.levelStarts(n);
    assert.deepEqual([L.levelOf(n, two - 1), L.levelOf(n, two), L.levelOf(n, three - 1), L.levelOf(n, three)], [1, 2, 2, 3]);
  }
});

test('a program\'s length: from a config, a built program or a summary; 60 when nothing says', () => {
  assert.equal(L.DAYS, 60);
  assert.equal(L.dayCountOf({ id: 'x' }), 60);
  assert.equal(L.dayCountOf({ days: 30 }), 30);
  assert.equal(L.dayCountOf({ days: Array.from({ length: 30 }, (_, i) => ({ day: i + 1 })) }), 30);
  assert.equal(L.dayCountOf({ dayCount: 30 }), 30);
});

test('random workouts take a done day\'s level from its program\'s length', () => {
  assert.deepEqual([1, 20, 21, 40, 41, 60].map((d) => Random.levelOfDay(d)), [1, 1, 2, 2, 3, 3]);
  assert.deepEqual([10, 11, 21].map((d) => Random.levelOfDay(d, 30)), [1, 2, 3]);
});
