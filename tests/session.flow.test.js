// Guided flows (Phase 5): one Start runs a whole sequence of timed poses; the voice names each pose and side.
const test = require('node:test');
const assert = require('node:assert/strict');
const { createSession } = require('../app/session.js');

const EX = {
  warrior: { id: 'warrior', name: 'Warrior two', u: 'sec', side: 1 },
  mountain: { id: 'mountain', name: 'Mountain pose', u: 'sec' },
  rollup: { id: 'rollup', name: 'Roll-up', u: 'reps', tp: 4 },
};
const day = (items, repeat = 1) => ({ day: 1, level: 1, blocks: [{ format: 'flow', title: 'Sun flow', kind: 'main', repeat, items }] });

test('a flow with one sided pose: phases in order, both sides named, halfway only on the long hold', () => {
  const w = day([{ ex: 'mountain', n: 20 }, { ex: 'warrior', n: 30 }]);
  const s = createSession({}, w, { EX });
  const { phases, then } = s.plan({ type: 'block', bi: 0 });
  assert.deepEqual(phases.map((p) => [p.sec, p.say || null, !!p.work, !!p.halfway]), [
    [5, 'Mountain pose', false, false], [20, null, true, false],
    [5, 'Warrior two, left side', false, false], [30, null, true, true],
    [5, 'Warrior two, right side', false, false], [30, null, true, true],
  ]);
  assert.match(phases[0].label, /^Get ready · Mountain pose/);
  assert.match(phases[4].label, /^Switch sides · Warrior two · right/);
  assert.equal(phases[5].label, 'Warrior two · right');
  assert.deepEqual(phases.map((p) => p.fig), ['mountain', 'mountain', 'warrior', 'warrior', 'warrior', 'warrior']);
  assert.equal(phases.at(-1).end, 'long');
  assert.equal(phases.at(-1).sayEnd, 'Done');
  assert.ok(phases.slice(0, -1).every((p) => p.end === 'short' && !p.sayEnd));
  assert.match(phases[3].sub, /Sun flow · 2 of 2/);
  assert.equal(s.blockDone(0), false);
  s.complete(then);
  assert.equal(s.blockDone(0), true);
  assert.ok(s.allDone());
});

test('a pose written in reps lasts reps × seconds per rep; a repeated flow goes through twice', () => {
  const s = createSession({}, day([{ ex: 'rollup', n: 8 }], 2), { EX });
  const { phases } = s.plan({ type: 'block', bi: 0 });
  assert.deepEqual(phases.map((p) => p.sec), [5, 32, 5, 32]);
  assert.equal(phases[1].label, 'Roll-up × 8');
  assert.match(phases[0].label, /^Get ready/);
  assert.match(phases[2].label, /^Next · Roll-up/);
  assert.match(phases[3].sub, /pass 2 of 2/);
});
