// Workout Session, rule by rule, on a tiny hand-made day so every case is visible in the test.
const test = require('node:test');
const assert = require('node:assert/strict');
const { createSession, unitText, DEFAULT_RESTS } = require('../app/session.js');

const EX = {
  push: { name: 'Push-up' }, row: { name: 'Row' }, lunge: { name: 'Lunge', side: 1 }, climb: { name: 'Climber', alt: 1 },
  plank: { name: 'Plank', u: 'sec' }, sidePlank: { name: 'Side plank', u: 'sec', side: 1 },
};
const it = (ex, n, extra) => ({ ex, n, ...extra });
const straight = { title: 'Main', items: [it('push', 10, { sets: 2 }), it('row', 8)], sets: 3 };
const superset = { title: 'Pairs', format: 'superset', sets: 2, items: [it('push', 10), it('row', 8), it('lunge', 6)] };
const circuit = { title: 'Circuit', format: 'circuit', rounds: 2, items: [it('push', 10), it('row', 8)] };
const abs = { title: 'Abs', kind: 'abs', items: [it('plank', 30), it('sidePlank', 20)], sets: 1 };
const warmup = { title: 'Warm-up', items: [it('lunge', 10), it('push', 5)] };
const cooldown = { title: 'Cool-down', items: [it('plank', 10), it('sidePlank', 15)] };
const dayOf = (blocks, extra) => ({ day: 1, blocks, warmup, cooldown, ...extra });
const session = (blocks, extra, program = {}) => createSession(program, dayOf(blocks, extra), { EX });

test('unit text names seconds, sides, alternating and reps', () => {
  assert.equal(unitText(EX.sidePlank), 'sec each side');
  assert.equal(unitText(EX.plank), 'seconds');
  assert.equal(unitText(EX.lunge), 'each side');
  assert.equal(unitText(EX.climb), 'total, alternating');
  assert.equal(unitText(EX.push), 'reps');
});

test('a program can override some rests; the rest keep their defaults', () => {
  const s = session([straight], {}, { rests: { set: 20 } });
  assert.equal(s.rests.set, 20);
  assert.equal(s.rests.exercise, DEFAULT_RESTS.exercise);
  assert.equal(s.complete({ type: 'set', bi: 0, i: 0, k: 1 }).rest.sec, 20);
});

test('an item can have its own number of sets; otherwise the block decides', () => {
  const s = session([straight]);
  assert.equal(s.itemSets(straight, straight.items[0]), 2);
  assert.equal(s.itemSets(straight, straight.items[1]), 3);
});

test('straight sets: next set, then the next exercise with its reps and sets, then the next block', () => {
  const s = session([straight, circuit]);
  assert.deepEqual(s.complete({ type: 'set', bi: 0, i: 0, k: 1 }).rest, { sec: 30, label: 'Rest · set 2 of 2 next', sub: 'Push-up' });
  assert.deepEqual(s.complete({ type: 'set', bi: 0, i: 0, k: 2 }).rest, { sec: 60, label: 'Rest · next: Row', sub: '8 reps × 3 sets' });
  assert.equal(s.blockDone(0), false);
  s.complete({ type: 'set', bi: 0, i: 1, k: 1 }); s.complete({ type: 'set', bi: 0, i: 1, k: 2 });
  assert.deepEqual(s.complete({ type: 'set', bi: 0, i: 1, k: 3 }).rest, { sec: 60, label: 'Rest · circuit next', sub: 'First: Push-up' });
  assert.equal(s.blockDone(0), true);
});

test('before the abs block the rest is 2 min', () => {
  const s = session([circuit, abs]);
  s.complete({ type: 'round', bi: 0, k: 1 });
  assert.deepEqual(s.complete({ type: 'round', bi: 0, k: 2 }).rest, { sec: 120, label: 'Rest · abs next', sub: 'First: Plank' });
});

test('the last block ends the workout, pointing to the cool-down only when the day has one', () => {
  assert.deepEqual(session([circuit]).complete({ type: 'block', bi: 0 }), { clear: { label: 'Workout finished', sub: 'Time for the cool-down stretches' } });
  assert.deepEqual(session([circuit], { cooldown: undefined }).complete({ type: 'block', bi: 0 }), { clear: { label: 'Workout finished', sub: 'Every set is done' } });
});

test('holds tick their set, never un-tick, and rest like a set', () => {
  const s = session([abs]);
  assert.deepEqual(s.complete({ type: 'hold', bi: 0, i: 0, k: 1 }).rest, { sec: 60, label: 'Rest · next: Side plank', sub: '20 sec each side × 1 sets' });
  s.complete({ type: 'hold', bi: 0, i: 0, k: 1 });
  assert.equal(s.state(0).sets[0], 1);
});

test('supersets: rest between rounds of a pair, then the next pair, then the next block; a lone last item is its own pair', () => {
  const s = session([superset, circuit]);
  assert.equal(s.pairsOf(superset), 2);
  assert.deepEqual(s.complete({ type: 'pair', bi: 0, pi: 0, k: 1 }).rest, { sec: 45, label: 'Rest · pair A, round 2 of 2 next', sub: 'Push-up + Row' });
  assert.deepEqual(s.complete({ type: 'pair', bi: 0, pi: 0, k: 2 }).rest, { sec: 60, label: 'Rest · pair B next', sub: 'Lunge' });
  s.complete({ type: 'pair', bi: 0, pi: 1, k: 1 });
  assert.equal(s.blockDone(0), false);
  assert.equal(s.complete({ type: 'pair', bi: 0, pi: 1, k: 2 }).rest.label, 'Rest · circuit next');
  assert.equal(s.blockDone(0), true);
  assert.deepEqual(s.complete({ type: 'pair', bi: 0, pi: 1, k: 2 }), { none: true });
});

test('circuits: rest between rounds with the block title; tapping the last round again un-ticks it', () => {
  const s = session([circuit]);
  assert.deepEqual(s.complete({ type: 'round', bi: 0, k: 1 }).rest, { sec: 60, label: 'Rest · round 2 of 2 next', sub: 'Circuit' });
  assert.equal(s.blockDone(0), false);
  assert.ok(s.complete({ type: 'round', bi: 0, k: 2 }).clear);
  assert.equal(s.blockDone(0), true);
  assert.deepEqual(s.complete({ type: 'round', bi: 0, k: 2 }), { none: true });
  assert.equal(s.state(0).rounds, 1);
});

test('timed blocks are done when their plan ends; the AMRAP counter never goes below zero', () => {
  const amrap = { title: 'Burn', format: 'amrap', minutes: 8, items: [it('push', 5)] };
  const s = session([amrap]);
  assert.equal(s.blockDone(0), false);
  assert.equal(s.count(0, 1), 1);
  assert.equal(s.count(0, -5), 0);
  s.complete({ type: 'block', bi: 0 });
  assert.ok(s.allDone());
});

test('stretches: warm-up and cool-down each have their own done message', () => {
  const s = session([circuit]);
  assert.equal(s.stretchDone('cool'), false);
  assert.deepEqual(s.complete({ type: 'stretch', key: 'warm' }), { clear: { label: 'Warm-up done', sub: 'Start the first exercise' } });
  assert.deepEqual(s.complete({ type: 'stretch', key: 'cool' }), { clear: { label: 'Cool-down done', sub: 'Workout complete' } });
  assert.ok(s.stretchDone('cool'));
});

test('an unknown target is a programming error', () => {
  assert.throws(() => session([circuit]).complete({ type: 'jump', bi: 0 }), /Unknown target jump/);
});

test('hold plan for a one-sided hold, and none once every set is done', () => {
  const s = session([abs]);
  assert.deepEqual(s.plan({ type: 'hold', bi: 0, i: 0 }).phases.map((p) => p.label), ['Get ready · Plank', 'Plank']);
  assert.deepEqual(s.plan({ type: 'hold', bi: 0, i: 1 }).phases.map((p) => [p.sec, p.label]),
    [[3, 'Get ready · Side plank'], [20, 'Side plank · first side'], [5, 'Switch sides'], [20, 'Side plank · second side']]);
  s.complete({ type: 'hold', bi: 0, i: 0, k: 1 });
  assert.equal(s.plan({ type: 'hold', bi: 0, i: 0 }), null);
});

test('cool-down plan: get ready, then next; sides split; only the very end beeps long', () => {
  const plan = session([circuit]).plan({ type: 'stretch', key: 'cool' });
  assert.deepEqual(plan.phases.map((p) => [p.label, p.end]), [
    ['Get ready · Plank', 'short'], ['Plank', 'short'], ['Next · Side plank', 'short'],
    ['Side plank · first side', 'short'], ['Switch sides', 'short'], ['Side plank · second side', 'long']]);
  const warm = session([circuit]).plan({ type: 'stretch', key: 'warm' });
  assert.deepEqual(warm.phases.at(-1), { sec: 5, label: 'Push-up', sub: 'Warm-up · 2 of 2', end: 'long', work: 1 });
});

test('EMOM labels show seconds and sides; only the last minute beeps long', () => {
  const emom = { title: 'Every minute', format: 'emom', minutes: 3, items: [it('sidePlank', 20), it('push', 10), it('lunge', 6)] };
  const labels = session([emom]).plan({ type: 'block', bi: 0 }).phases.slice(1).map((p) => [p.label, p.end]);
  assert.deepEqual(labels, [['Min 1/3 · Side plank × 20 s each side', 'short'], ['Min 2/3 · Push-up × 10', 'short'], ['Min 3/3 · Lunge × 6 each side', 'long']]);
});

test('two Tabatas get a block rest between them', () => {
  const tabata = { title: 'Tabata', format: 'tabata', tabatas: 2, items: [it('push', 0), it('row', 0)] };
  const phases = session([tabata]).plan({ type: 'block', bi: 0 }).phases;
  assert.deepEqual(phases.filter((p) => p.label === 'Rest · next Tabata').map((p) => [p.sec, p.sub]), [[60, '1 to go']]);
  assert.equal(phases.length, 1 + 2 * 15 + 1);
});

test('AMRAP and ladder run one long phase; formats without a plan return none', () => {
  const amrap = { title: 'A', format: 'amrap', minutes: 6, items: [it('push', 5), it('row', 5)] };
  const ladder = { title: 'L', format: 'ladder', minutes: 5, items: [it('push', 1), it('row', 1)] };
  const s = session([amrap, ladder, straight]);
  assert.deepEqual(s.plan({ type: 'block', bi: 0 }).phases[1], { sec: 360, label: 'AMRAP · Push-up → Row', sub: 'Tap + after each round', end: 'long', work: 1 });
  assert.equal(s.plan({ type: 'block', bi: 1 }).phases[1].label, 'Ladder · Push-up + Row');
  assert.equal(s.plan({ type: 'block', bi: 2 }), null);
  assert.equal(s.plan({ type: 'set', bi: 2, i: 0, k: 1 }), null);
});
