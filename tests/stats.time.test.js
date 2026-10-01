// Phase 8 ticket 5: where time goes (by family, subject and format) and the kind of work, in stats.report.
// Workout minutes are split over a day's blocks by each block's time; the rest between two blocks goes to the
// second one; the parts are scaled so they add up to the day's estimate.
const test = require('node:test');
const assert = require('node:assert/strict');
const { report, dayParts, DEFAULT_RESTS } = require('../app/stats.js');
const Formats = require('../formats.js');

const EX = {
  squat: { tp: 2.5, muscles: { primary: ['quads'], secondary: [] } },
  jab: { u: 'sec', muscles: { primary: ['front_delts'], secondary: [] } },
  pose: { u: 'sec', tp: 1, muscles: { primary: ['hamstrings'], secondary: [] } },
};
const R = { set: 60, exercise: 90, beforeAbs: 120, superset: 45, round: 60, block: 60 };
const strength = { format: 'straight', sets: 3, items: [{ ex: 'squat', n: 10 }] };
const flow = { format: 'flow', repeat: 2, items: [{ ex: 'pose', n: 40 }] };
const DAYS = {
  lift: { est: 20, blocks: [strength] },
  box: { est: 30, blocks: [{ format: 'bouts', bouts: 3, rest: 60, items: [{ ex: 'jab', n: 180 }] }] },
  mix: { est: 36, blocks: [{ ...strength, family: 'Strength' }, { ...flow, family: 'Mind & body' }] },
};
const INFO = {
  lift: { family: 'Strength', subject: 'Strength', rests: R },
  box: { family: 'Cardio & combat', subject: 'Boxing', rests: R },
  mix: { family: 'Mixed', subject: 'Strength & stretch', rests: R },
};
const now = new Date(2026, 8, 30, 12);
const at = (d) => new Date(2026, 8, d, 9).toISOString();
const entries = [{ pid: 'lift', day: 1, time: at(28) }, { pid: 'box', day: 1, time: at(29) }, { pid: 'mix', day: 1, time: at(30) }];
const run = (es = entries, infoOf = (e) => INFO[e.pid]) => report({ entries: es, dayOf: (pid) => DAYS[pid], EX, names: {}, infoOf }, { scope: 'all', span: 'week', now });
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} ≈ ${b}`);

test('a week of a strength day, a boxing day and a mixed strength + yoga day: minutes land in the right families', () => {
  const t = run();
  const tS = Formats.of(strength).time(strength, R, EX), tF = Formats.of(flow).time(flow, R, EX) + R.block;
  const mixS = 36 * tS / (tS + tF), mixF = 36 * tF / (tS + tF);
  close(t.byFamily.Strength, 20 + mixS);
  close(t.byFamily['Cardio & combat'], 30);
  close(t.byFamily['Mind & body'], mixF);
  assert.equal(t.byFamily.Mixed, undefined, 'a mixed day is split by its blocks');
  close(Object.values(t.byFamily).reduce((a, b) => a + b, 0), t.totals.workoutMin);
});

test('by subject, inside each family: a mixed day\'s blocks count under the mixed program\'s subject', () => {
  const t = run();
  close(t.bySubject.Strength.Strength, 20);
  assert.ok(t.bySubject.Strength['Strength & stretch'] > 0);
  assert.ok(t.bySubject['Mind & body']['Strength & stretch'] > 0);
  close(t.bySubject['Cardio & combat'].Boxing, 30);
});

test('by format: straight sets, flows and bouts', () => {
  const t = run();
  assert.deepEqual(Object.keys(t.byFormat).sort(), ['bouts', 'flow', 'straight']);
  close(t.byFormat.bouts, 30);
  close(t.byFormat.straight + t.byFormat.flow, 20 + 36);
});

test('kind of work: strength sets and reps, cardio minutes, mind & body minutes', () => {
  const { kinds, byFamily } = run();
  assert.equal(kinds.strengthSets, 6); assert.equal(kinds.strengthReps, 60);
  close(kinds.cardioMin, 30);
  close(kinds.mindMin, byFamily['Mind & body']);
});

test('dayParts: a day with one block is all one part, whatever its time model says', () => {
  const parts = dayParts(DAYS.box, EX, INFO.box);
  assert.equal(parts.length, 1); assert.equal(parts[0].min, 30); assert.equal(parts[0].family, 'Cardio & combat');
});

test('without rests or a family (a random workout, an old record) the default rests and "Other" are used', () => {
  const parts = dayParts(DAYS.mix, EX, {});
  assert.deepEqual(parts.map((p) => p.family), ['Strength', 'Mind & body']);
  assert.equal(dayParts(DAYS.lift, EX, {})[0].family, 'Other');
  assert.equal(dayParts(DAYS.lift, EX, {})[0].subject, 'Other');
  assert.ok(DEFAULT_RESTS.block > 0);
  const t = run(entries, () => undefined);
  close(t.byFamily.Other, 50);
});

test('a day whose blocks take no time splits its minutes evenly', () => {
  const zero = { est: 10, blocks: [{ format: 'emom', minutes: 0, items: [] }, { format: 'emom', minutes: 0, items: [] }] };
  assert.deepEqual(dayParts(zero, EX, { rests: { ...R, block: 0 } }).map((p) => p.min), [5, 5]);
});

test('a mixed day\'s abs finisher (no family of its own) goes with the block before it', () => {
  const abs = { format: 'straight', kind: 'abs', sets: 2, items: [{ ex: 'squat', n: 10 }] };
  const d = { est: 30, blocks: [{ ...flow, family: 'Mind & body' }, { ...strength, family: 'Strength' }, abs] };
  assert.deepEqual(dayParts(d, EX, INFO.mix).map((p) => p.family), ['Mind & body', 'Strength', 'Strength']);
});
