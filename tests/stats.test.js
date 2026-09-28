// Stats: what a done day counts for (planned work, ADR 2), on a hand-made day.
const test = require('node:test');
const assert = require('node:assert/strict');
const { dayVolume } = require('../app/stats.js');

const EX = {
  push: { muscles: { primary: ['chest', 'triceps'], secondary: ['front_delts'] } },
  row: { muscles: { primary: ['lats'], secondary: ['biceps'] } },
  lunge: { side: 1, muscles: { primary: ['quads', 'glutes'], secondary: [] } },
  plank: { u: 'sec', muscles: { primary: ['abs'], secondary: [] } },
};
const it = (ex, n, extra) => ({ ex, n, ...extra });
const day = (blocks) => ({ est: 30, warmup: { seconds: 60 }, cooldown: { seconds: 120 }, blocks });

test('minutes: workout estimate and stretching (warm-up + cool-down), kept apart', () => {
  const v = dayVolume(day([]), EX);
  assert.equal(v.workoutMin, 30);
  assert.equal(v.stretchMin, 3);
  assert.equal(dayVolume({ est: 20, blocks: [] }, EX).stretchMin, 0);
});

test('straight sets: each item its own sets or the block\'s; one-side reps count both sides; holds add sets, not reps', () => {
  const v = dayVolume(day([{ sets: 3, items: [it('push', 10, { sets: 4 }), it('lunge', 8), it('plank', 30)] }]), EX);
  assert.equal(v.sets, 4 + 3 + 3);
  assert.equal(v.reps, 4 * 10 + 3 * 8 * 2);
});

test('supersets use the block sets, circuits the rounds', () => {
  assert.deepEqual(pick(dayVolume(day([{ format: 'superset', sets: 3, items: [it('push', 10), it('row', 8)] }]), EX)), { sets: 6, reps: 54 });
  assert.deepEqual(pick(dayVolume(day([{ format: 'circuit', rounds: 4, items: [it('push', 10), it('plank', 20)] }]), EX)), { sets: 8, reps: 40 });
});

test('EMOM: one set per minute, rotating through the exercises, with their reps', () => {
  const v = dayVolume(day([{ format: 'emom', minutes: 5, items: [it('push', 8), it('row', 6)] }]), EX);
  assert.deepEqual(pick(v), { sets: 5, reps: 3 * 8 + 2 * 6 });
});

test('Tabata: one set per 20 s round, no reps', () => {
  assert.deepEqual(pick(dayVolume(day([{ format: 'tabata', tabatas: 2, items: [it('push', 0), it('row', 0)] }]), EX)), { sets: 16, reps: 0 });
});

test('AMRAP and ladder: one set per exercise per 2 minutes (at least one), no reps', () => {
  assert.deepEqual(pick(dayVolume(day([{ format: 'amrap', minutes: 8, items: [it('push', 5), it('row', 5)] }]), EX)), { sets: 8, reps: 0 });
  assert.deepEqual(pick(dayVolume(day([{ format: 'ladder', minutes: 1, items: [it('push', 1)] }]), EX)), { sets: 1, reps: 0 });
});

function pick(v) { return { sets: v.sets, reps: v.reps }; }
