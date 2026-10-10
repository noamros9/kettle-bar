// Program pins (scripts/pins.js): the build refuses to write when a pinned program's days changed, and `npm run pin`
// builds only this phase's programs. Both are checked here on small fake programs, never on the whole library.
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const { pinOf, pinProblems } = require('../scripts/pins.js');
const { pinEntries } = require('../scripts/pin-programs.js');

const old = (days) => crypto.createHash('sha256').update(JSON.stringify(days)).digest('hex');
const A = { id: 'a', days: [{ day: 1, n: 5 }] };
const B = { id: 'b', days: [{ day: 1, n: 6 }] };

test('a pin is the SHA-256 of the days as JSON, the same hash the pin file has always held', () => {
  assert.equal(pinOf(A.days), old(A.days));
});

test('the gate passes when every pinned program is in the build unchanged', () => {
  assert.deepEqual(pinProblems([A, B], { a: pinOf(A.days) }), []);
});

test('the gate names a pinned program whose days changed', () => {
  const changed = { id: 'a', days: [{ day: 1, n: 9 }] };
  const problems = pinProblems([changed, B], { a: pinOf(A.days) });
  assert.equal(problems.length, 1);
  assert.match(problems[0], /^a: its days changed/);
});

test('the gate names a pinned program that is no longer in the build', () => {
  assert.deepEqual(pinProblems([B], { a: pinOf(A.days) }), ['a: pinned but not in the build (delete its pin line on purpose to remove it)']);
});

test('`npm run pin` adds pins only for this phase\'s programs that have none, and checks the pins they already have', () => {
  const built = [];
  const build = (c) => { built.push(c.id); return { id: c.id, days: [{ day: 1, n: c.n }] }; };
  const configs = [{ id: 'old', added: 14, n: 1 }, { id: 'new', added: 23, n: 2 }, { id: 'ii', added: 23, n: 3 }];
  const pins = { old: 'x', ii: old([{ day: 1, n: 3 }]) };
  const out = pinEntries(configs, pins, build);
  assert.deepEqual(built, ['new', 'ii'], 'the old program is never built');
  assert.equal(out.added.join(), 'new');
  assert.deepEqual(out.problems, []);
  assert.equal(out.pins.new, old([{ day: 1, n: 2 }]));
  assert.equal(out.pins.old, 'x', 'an existing pin is never changed');
});

test('`npm run pin` reports a phase program whose pinned days changed, and adds nothing for it', () => {
  const build = (c) => ({ id: c.id, days: [{ day: 1, n: 99 }] });
  const out = pinEntries([{ id: 'ii', added: 23, n: 3 }], { ii: old([{ day: 1, n: 3 }]) }, build);
  assert.equal(out.problems.length, 1);
  assert.match(out.problems[0], /^ii: its days changed/);
  assert.equal(out.pins.ii, old([{ day: 1, n: 3 }]));
});
