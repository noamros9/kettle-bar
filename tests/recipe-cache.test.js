// scripts/recipe-cache.js (decision 331): main's run makes the recipe book's trials into the build cache, so a pulled
// cache carries them, and checks the book it made equals the committed one. Stubbed generate and stored book.
const test = require('node:test');
const assert = require('node:assert/strict');
const { check } = require('../scripts/recipe-cache.js');

const book = { v: 2, types: [{ id: 'a:x' }] };

test('the made book equals the committed one: ok, with the trials read and run', () => {
  const out = check({ make: () => book, stored: () => ({ hash: 'h', book }), hash: () => 'h', stats: () => ({ hits: 3, misses: 1 }) });
  assert.equal(out.ok, true);
  assert.match(out.message, /3 trials read, 1 run/);
});

test('a made book that differs fails, naming what differs', () => {
  const out = check({ make: () => ({ ...book, v: 3 }), stored: () => ({ hash: 'h', book }), hash: () => 'h', stats: () => ({ hits: 0, misses: 4 }) });
  assert.equal(out.ok, false);
  assert.match(out.message, /differs from recipes\/book\.json/);
});

test('a stale committed book is not this check\'s to judge: the unit tests fail it; the trials are still made', () => {
  let made = 0;
  const out = check({ make: () => { made++; return book; }, stored: () => ({ hash: 'old', book }), hash: () => 'new', stats: () => ({ hits: 0, misses: 2 }) });
  assert.equal(made, 1);
  assert.equal(out.ok, true);
  assert.match(out.message, /stale/);
});
