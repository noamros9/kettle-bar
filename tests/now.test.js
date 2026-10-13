// Do now (Phase 25 ticket 1): the pool of quiet, no-gear exercises for dead time, and the pick (Random or What I missed).
const test = require('node:test');
const assert = require('node:assert/strict');
const cat = require('../exercises.js');
const N = require('../app/now.js');

const { EX } = cat;
const LOUD = /jump|hop|bound|explosive|burpee|plyo|sprint|skip|clap|sprawl|tuck/i;

test('every pool exercise exists, needs no equipment, is quiet, standing or seated, and is no couple or cardio move', () => {
  assert.ok(N.POOL.length >= 35 && N.POOL.length <= 50, `${N.POOL.length} in the pool`);
  assert.equal(new Set(N.POOL).size, N.POOL.length, 'no duplicates');
  N.POOL.forEach((id) => {
    const e = EX[id];
    assert.ok(e, `${id} exists`);
    assert.ok(cat.allowedIn('bw', e), `${id}: no equipment`);
    assert.ok(!(e.poses || []).some((p) => p.mat), `${id}: nothing on the floor`);
    assert.ok(!['cardio', 'couple'].includes(e.cat), `${id}: ${e.cat}`);
    assert.ok(!LOUD.test(`${id} ${e.name} ${e.cue}`), `${id}: quiet`);
  });
});

test('pick is the same for the same seed, lasts 20 to 30 seconds, and never repeats one of the last three', () => {
  const a = N.pick(cat, { mode: 'random', seed: 's1' }), b = N.pick(cat, { mode: 'random', seed: 's1' });
  assert.deepEqual(a, b);
  const seen = new Set();
  for (let i = 0; i < 60; i++) {
    const p = N.pick(cat, { mode: 'random', seed: 'k' + i, level: 1 + (i % 3) });
    assert.ok(N.POOL.includes(p.ex));
    assert.ok(p.seconds >= 20 && p.seconds <= 30, `${p.ex}: ${p.seconds} s`);
    assert.equal(p.level, 1 + (i % 3));
    seen.add(p.ex);
  }
  assert.ok(seen.size > 15, 'the seed spreads the picks');
  const recent = N.POOL.slice(0, N.POOL.length - 1); // only one left
  assert.equal(N.pick(cat, { mode: 'random', seed: 'x', recent }).ex, N.POOL[N.POOL.length - 1]);
  assert.ok(N.POOL.includes(N.pick(cat, { mode: 'random', seed: 'x', recent: N.POOL }).ex), 'all recent: any of them');
});

test('What I missed picks an exercise for the least-loaded muscle the pool can train', () => {
  const muscles = [...new Set(N.POOL.map((id) => EX[id].muscles.primary[0]))];
  const target = muscles[3];
  const loads = Object.fromEntries(muscles.map((m) => [m, m === target ? 0.5 : 10]));
  for (let i = 0; i < 10; i++) {
    const p = N.pick(cat, { mode: 'missed', loads, seed: 'm' + i });
    assert.equal(EX[p.ex].muscles.primary[0], target, p.ex);
  }
  // a muscle no load mentions counts as zero: the least loaded
  const untouched = muscles[5];
  const p = N.pick(cat, { mode: 'missed', loads: Object.fromEntries(muscles.filter((m) => m !== untouched).map((m) => [m, 1])), seed: 'z' });
  assert.equal(EX[p.ex].muscles.primary[0], untouched);
  // its exercises all recent: the next least-loaded muscle
  const only = N.POOL.filter((id) => EX[id].muscles.primary[0] === target);
  const q = N.pick(cat, { mode: 'missed', loads, seed: 'r', recent: only });
  assert.notEqual(EX[q.ex].muscles.primary[0], target);
});

test('loads sum the muscle load of the days done in the last 7 days, through Stats\' own rule', () => {
  const now = new Date('2026-10-13T12:00:00Z');
  const day = { est: 1, blocks: [{ sets: 2, items: [{ ex: 'wall_sit', n: 30 }] }] };
  const entries = [{ pid: 'p', day: 1, time: '2026-10-12T10:00:00Z' }, { pid: 'p', day: 2, time: '2026-10-01T10:00:00Z' }, { pid: 'p', day: 3, time: '2026-10-12T11:00:00Z' }];
  const dayOf = (pid, n) => (n === 3 ? undefined : day); // a day the app doesn't have is left out
  const one = require('../app/stats.js').dayVolume(day, EX).muscles;
  assert.deepEqual(N.loads(entries, dayOf, EX, now), one, 'only the day in the last 7 days counts');
  assert.deepEqual(N.loads([], dayOf, EX, now), {});
});

test('the seconds: a hold\'s own, reps at about two seconds each, both sides counted, kept inside 20 to 30', () => {
  assert.equal(N.secondsOf({ u: 'sec', r: [25, 25, 25] }, 1), 25);
  assert.equal(N.secondsOf({ u: 'sec', r: [60, 60, 60] }, 1), 30);
  assert.equal(N.secondsOf({ u: 'sec', r: [10, 10, 10] }, 1), 20);
  assert.equal(N.secondsOf({ u: 'reps', r: [12, 12, 12] }, 1), 24);
  assert.equal(N.secondsOf({ u: 'sec', side: 1, r: [12, 12, 12] }, 1), 24);
  assert.equal(N.secondsOf({ u: 'reps', r: [5, 8, 30] }, 3), 30);
});
