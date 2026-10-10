// Muscle groups on three levels (Phase 30 ticket 1, decision 207): one definition, MUSCLE_GROUPS in exercises.js,
// read by Stats (groupLoads), the Muscles page and the Exercises page.
const test = require('node:test');
const assert = require('node:assert/strict');
const { EX, MUSCLE_NAMES, MUSCLE_GROUPS, groupOf } = require('../exercises.js');
const { groupLoads } = require('../app/stats.js');
const { familyOf, EX_FAMILIES } = require('../app/library.js');

const partsOf = (top) => MUSCLE_GROUPS.find(([t]) => t === top)[2].map(([, name]) => name);

test('every muscle is in exactly one part, under Upper / Core / Lower as decided', () => {
  const placed = MUSCLE_GROUPS.flatMap(([, , parts]) => parts.flatMap(([, , ms]) => ms));
  assert.deepEqual([...placed].sort(), Object.keys(MUSCLE_NAMES).sort());
  assert.equal(new Set(placed).size, placed.length);
  assert.deepEqual(MUSCLE_GROUPS.map(([, name]) => name), ['Upper', 'Core', 'Lower']);
  assert.deepEqual(partsOf('upper'), ['Chest', 'Back', 'Shoulders', 'Arms']);
  assert.deepEqual(partsOf('core'), ['Abs & obliques', 'Lower back']);
  assert.deepEqual(partsOf('lower'), ['Glutes & hips', 'Thighs', 'Lower legs']);
  assert.deepEqual(groupOf('lower_back'), { top: 'core', part: 'lower_back' });
  assert.deepEqual(groupOf('adductors'), { top: 'lower', part: 'glutes_hips' });
  assert.deepEqual(groupOf('neck'), { top: 'upper', part: 'back' });
});

test('groupLoads: a span\'s loads add up into parts and tops, the same weighted sets', () => {
  const loads = { chest: 6, triceps: 1.5, quads: 4, glutes: 2, calves: 1, abs: 3, lower_back: 0.5 };
  const { tops, parts } = groupLoads(loads, MUSCLE_GROUPS);
  assert.deepEqual(tops, { upper: 7.5, core: 3.5, lower: 7 });
  assert.equal(parts.chest, 6); assert.equal(parts.arms, 1.5); assert.equal(parts.back, 0);
  assert.equal(parts.thighs, 4); assert.equal(parts.glutes_hips, 2); assert.equal(parts.lower_legs, 1);
  const total = Object.values(loads).reduce((a, b) => a + b, 0);
  assert.equal(Object.values(tops).reduce((a, b) => a + b, 0), total);
  assert.equal(Object.values(parts).reduce((a, b) => a + b, 0), total);
});

test('the Exercises page sorts by part: a squat in Thighs, a superman in Lower back; Full body stays its own chip', () => {
  assert.deepEqual(familyOf(EX.goblet_squat), { family: 'muscles', subject: 'thighs' });
  assert.deepEqual(familyOf(EX.superman), { family: 'muscles', subject: 'lower_back' });
  assert.deepEqual(familyOf(EX.calf_raise), { family: 'muscles', subject: 'lower_legs' });
  const chips = EX_FAMILIES.find(([k]) => k === 'muscles')[2].map(([, name]) => name);
  assert.deepEqual(chips, ['Chest', 'Back', 'Shoulders', 'Arms', 'Abs & obliques', 'Lower back', 'Glutes & hips', 'Thighs', 'Lower legs', 'Full body']);
  // every muscle exercise lands in one of the chips
  const keys = new Set(EX_FAMILIES.find(([k]) => k === 'muscles')[2].map(([k]) => k));
  Object.values(EX).filter((e) => familyOf(e).family === 'muscles').forEach((e) => assert.ok(keys.has(familyOf(e).subject), e.id));
});
