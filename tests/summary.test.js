// Day summaries: two generated lines under each workout's name.
const test = require('node:test');
const assert = require('node:assert/strict');
const { daySummary } = require('../app/summary.js');

const EX = {
  push: { name: 'Push-up', muscles: { primary: ['chest', 'triceps'], secondary: ['front_delts'] } },
  row: { name: 'Row', muscles: { primary: ['lats'], secondary: ['biceps'] } },
  squat: { name: 'Squat', muscles: { primary: ['quads', 'glutes'], secondary: [] } },
  plank: { name: 'Plank', u: 'sec', muscles: { primary: ['abs'], secondary: [] } },
};
const MUSCLE_NAMES = { chest: 'Chest', triceps: 'Triceps', front_delts: 'Front shoulders', lats: 'Lats', biceps: 'Biceps', quads: 'Quads', glutes: 'Glutes', abs: 'Abs' };
const cat = { EX, MUSCLE_NAMES };
const program = { levels: ['Level I · Intermediate', 'Level II · More reps', 'Level III · Heavier weights'], dayTypes: { a: { label: 'Chest & back' } } };
const it = (ex, n, extra) => ({ ex, n, ...extra });
const abs = { kind: 'abs', sets: 3, items: [it('plank', 30)] };

test('straight sets: focus and shape, then the muscles worked most and the level', () => {
  const day = { type: 'a', level: 1, blocks: [{ sets: 4, items: [it('push', 10), it('row', 8), it('squat', 10)] }, abs] };
  assert.deepEqual(daySummary(day, program, cat), [
    'Chest & back: 3 exercises in straight sets, then abs.',
    'Most work for chest, triceps and lats · Level I: intermediate.',
  ]);
});

test('mixed formats read in order; a day without abs and without a known type uses its title', () => {
  const day = { type: 'zzz', title: 'Engine room', level: 2, blocks: [
    { format: 'superset', sets: 3, items: [it('push', 10), it('row', 8)] },
    { format: 'circuit', rounds: 4, items: [it('squat', 10)] },
    { format: 'emom', minutes: 12, items: [it('row', 6)] },
    { format: 'amrap', minutes: 6, items: [it('push', 5)] },
    { format: 'tabata', tabatas: 1, items: [it('squat', 0)] },
    { format: 'ladder', minutes: 8, items: [it('push', 1)] },
  ] };
  assert.equal(daySummary(day, program, cat)[0],
    'Engine room: 2 exercises as supersets, a 4-round circuit of 1 exercise, a 12-minute EMOM, a 6-minute AMRAP, 1 Tabata and an 8-minute ladder.');
  assert.match(daySummary(day, program, cat)[1], /· Level II: more reps\.$/);
});

test('two Tabatas, a harder level, and a swapped day say so', () => {
  const day = { type: 'a', level: 3, blocks: [{ format: 'tabata', tabatas: 2, items: [it('squat', 0)] }, { sets: 3, items: [it('push', 10, { swappedFrom: 'row' }), it('row', 8, { swappedFrom: 'squat' })] }] };
  const [one, two] = daySummary(day, program, cat);
  assert.equal(one, 'Chest & back: 2 Tabatas and 2 exercises in straight sets.');
  assert.equal(two, 'Most work for quads, glutes and chest · Level III: heavier weights · 2 exercises swapped.');
});

test('one swapped exercise, and only one or two muscles worked', () => {
  const day = { type: 'a', level: 1, blocks: [{ sets: 2, items: [it('squat', 10, { swappedFrom: 'push' })] }] };
  assert.equal(daySummary(day, program, cat)[1], 'Most work for quads and glutes · Level I: intermediate · 1 exercise swapped.');
  const single = { type: 'a', level: 1, blocks: [{ sets: 2, items: [it('plank', 30)] }] };
  assert.equal(daySummary(single, program, cat)[1], 'Most work for abs · Level I: intermediate.');
});

test('the abs finisher does not count toward "most work": the line describes the main work', () => {
  const heavyAbs = { kind: 'abs', sets: 10, items: [it('plank', 60)] };
  const day = { type: 'a', level: 1, blocks: [{ sets: 2, items: [it('row', 8)] }, heavyAbs] };
  assert.equal(daySummary(day, program, cat)[1], 'Most work for lats and biceps · Level I: intermediate.');
});

test('guided flows: "a 6-pose flow", "an 8-pose flow done twice", and no abs to mention', () => {
  const day = { type: 'a', level: 1, blocks: [
    { format: 'flow', repeat: 1, items: Array.from({ length: 6 }, () => it('plank', 30)) },
    { format: 'flow', repeat: 2, items: Array.from({ length: 8 }, () => it('squat', 5)) },
    { format: 'flow', repeat: 3, title: 'Sun salutations', items: [it('push', 3)] },
  ] };
  assert.equal(daySummary(day, program, cat)[0], 'Chest & back: a 6-pose flow, an 8-pose flow done twice and sun salutations done three times.');
});
