// Chart helpers (architecture review IV ticket 1): the trend chart's axis and the bars' lengths.
const test = require('node:test');
const assert = require('node:assert/strict');
const { axis, shares } = require('../app/charts.js');

test('axis: steps of 15 / 30 / 60 / 120 by the top value, at least 10, rounded up to a step', () => {
  assert.deepEqual(axis([0, 4]), { max: 15, step: 15, ticks: [0, 15] });
  assert.deepEqual(axis([74, 30]).max, 90);
  assert.equal(axis([74]).step, 30);
  assert.equal(axis([200]).step, 60); assert.equal(axis([200]).max, 240);
  assert.equal(axis([301]).step, 120);
  assert.deepEqual(axis([]), { max: 15, step: 15, ticks: [0, 15] });
});

test('axis: a fixed top and step (days per week: 0 to 7, every day)', () => {
  assert.deepEqual(axis([2, 3], { max: 7, step: 1 }), { max: 7, step: 1, ticks: [0, 1, 2, 3, 4, 5, 6, 7] });
});

test('shares: each value as a share of the largest; nothing above 0 is all 0', () => {
  assert.deepEqual(shares([2, 4, 0]), [0.5, 1, 0]);
  assert.deepEqual(shares([0, 0]), [0, 0]);
  assert.deepEqual(shares([]), []);
});
