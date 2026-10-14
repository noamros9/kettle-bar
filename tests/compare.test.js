// Phase 33 ticket 5 (#294): Compare two programs, on made-up programs.
const test = require('node:test');
const assert = require('node:assert/strict');
const { EX, MUSCLE_GROUPS } = require('../exercises.js');
const { groupLoads, programFocus } = require('../app/stats.js');
const { of, cycleOf } = require('../app/compare.js');

const day = (n, type, items, more = {}) => ({ day: n, type, est: 20 + n, blocks: [{ title: 'B', kind: 'main', sets: 3, items: items.map((ex) => ({ ex, n: 10 })), ...more }] });
const A = { id: 'a', name: 'Bells', subject: 'Kettlebell only', days: [day(1, 'x', ['kb_swing', 'goblet_squat']), day(2, 'y', ['pushup']), day(3, 'x', ['kb_swing', 'goblet_squat']), day(4, 'y', ['pushup', 'plank'])] };
const B = { id: 'b', name: 'Mats', days: [day(1, 'p', ['pushup', 'plank'], { format: 'circuit', rounds: 3 }), day(2, 'q', ['pushup']), day(3, 'r', ['plank', 'pullup'], { format: 'emom', minutes: 8 })] };

test('each side: length, cycle, kinds of day, minutes, formats and equipment', () => {
  const { a, b } = of(A, B, EX);
  assert.deepEqual([a.id, a.name, a.subject, a.days, a.cycle, a.kinds, a.minutes], ['a', 'Bells', 'Kettlebell only', 4, 2, 2, [21, 24]]);
  assert.deepEqual(a.formats, ['Straight sets']);
  assert.deepEqual(a.gear, ['Kettlebell']);
  assert.deepEqual([b.subject, b.cycle, b.kinds], ['', null, 3], 'a run of day types that never repeats has no cycle');
  assert.deepEqual(b.formats, ['Circuits', 'Straight sets', 'EMOM']);
  assert.deepEqual(b.gear, ['Pull-up bar']);
  const none = of({ ...A, days: [day(1, 'x', ['pushup'])] }, B, EX).a;
  assert.deepEqual(none.gear, ['No equipment']);
});

test('the muscle load: each muscle\'s share, and the group loads (Phase 30\'s groupLoads)', () => {
  const { a } = of(A, B, EX);
  assert.deepEqual(a.focus, programFocus(A.days, EX));
  assert.ok(Math.abs(Object.values(a.focus).reduce((x, y) => x + y, 0) - 1) < 1e-9);
  assert.deepEqual(a.tops, groupLoads(a.focus, MUSCLE_GROUPS).tops);
  assert.ok(a.tops.lower > 0 && a.tops.upper > 0 && a.tops.core > 0);
});

test('exercises in common: both use them, with the days each does, the most shared first', () => {
  const { common, a } = of(A, B, EX);
  assert.deepEqual(a.exercises, { kb_swing: 2, goblet_squat: 2, pushup: 2, plank: 1 });
  assert.deepEqual(common, [{ ex: 'pushup', a: 2, b: 2 }, { ex: 'plank', a: 1, b: 2 }]);
  // ties: by id
  const t = of({ ...A, days: [day(1, 'x', ['pushup', 'plank'])] }, { ...B, days: [day(1, 'x', ['plank', 'pushup'])] }, EX).common;
  assert.deepEqual(t.map((x) => x.ex), ['plank', 'pushup']);
});

test('the warm-up and cool-down don\'t count; a day uses an exercise once however often it appears', () => {
  const d = { ...day(1, 'x', ['pushup', 'pushup']), warmup: { items: [{ ex: 'arm_circles', n: 30 }] }, cooldown: { items: [{ ex: 'cross_body_shoulder', n: 30 }] } };
  assert.deepEqual(of({ ...A, days: [d] }, B, EX).a.exercises, { pushup: 1 });
  assert.deepEqual(of({ ...A, days: [day(1, 'x', ['one_arm_row', 'kb_swing'])] }, B, EX).a.gear, ['Dumbbells', 'Kettlebell']);
  assert.equal(cycleOf([{ type: 'a' }, { type: 'b' }, { type: 'a' }, { type: 'b' }, { type: 'a' }]), 2);
});
