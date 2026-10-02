// Random workout (Phase 7 ticket 2, #64): a day built fresh from the recipe book for a family or subject, 15 / 25 / 35
// minutes and some equipment, at the level of the last day marked done. It counts in stats, not in any program.
const test = require('node:test');
const assert = require('node:assert/strict');
const R = require('../recipes.js');
const Builder = require('../program-builder.js');
const cat = require('../exercises.js');
const Stats = require('../app/stats.js');
const { createSession } = require('../app/session.js');
const { createStore } = require('../app/store.js');
const Random = require('../app/random.js');

const recipes = R.of(R.book());
const deps = { recipes, buildDay: Builder.buildDay, newMemory: Builder.newMemory, makeRnd: Builder.makeRnd, cat };
const itemsOf = (day) => day.blocks.flatMap((b) => b.items.map((it) => it.ex));
const T0 = Date.parse('2026-09-30T08:00:00.000Z');
function setup() {
  const m = {}, clock = { t: T0 };
  const store = createStore({ programIds: ['three-split-60'], storage: { get: (k) => m[k] ?? null, set: (k, v) => { m[k] = v; }, remove: (k) => { delete m[k]; } }, now: () => new Date(clock.t).toISOString() });
  store.load();
  const device = { get: (k) => m['dev:' + k] ?? null, set: (k, v) => { m['dev:' + k] = v; }, remove: (k) => { delete m['dev:' + k]; } };
  const make = () => Random.createRandom({ store, cat, createSession, storage: device, now: () => clock.t });
  return { store, device, clock, make, random: make(), keys: () => Object.keys(m).filter((k) => k.startsWith('dev:')).map((k) => k.slice(4)) };
}
const strengthKb = { family: 'Strength', minutes: 25, equipment: 'kb' };
// a straight-set block, and in it an item that can be swapped
const straight = (D) => D.day.blocks.findIndex((b) => (b.format || 'straight') === 'straight');
const started = (random, choice = strengthKb, seed = 's1', level = 2) => random.start(Random.make(deps, choice, { level, seed }), { id: 'r1' });

// ---- the plan's test first ----
test('the level is the level of the last day marked done (in any program, random ones too); none -> Level I', () => {
  assert.equal(Random.levelOf([]), 1);
  assert.equal(Random.levelOf([{ time: '2026-09-01T08:00:00Z', level: 3 }, { time: '2026-09-20T08:00:00Z', level: 2 }, { time: '2026-09-10T08:00:00Z', level: 1 }]), 2);
  // round 2 after a finished round 1: day 3 is the last one done, so Level I (the level of the day, as Noam said)
  const round1 = Array.from({ length: 60 }, (_, i) => ({ time: new Date(T0 + i * 864e5).toISOString(), level: Random.levelOfDay(i + 1) }));
  const round2 = [1, 2, 3].map((n) => ({ time: new Date(T0 + (60 + n) * 864e5).toISOString(), level: Random.levelOfDay(n) }));
  assert.equal(Random.levelOf(round1), 3);
  assert.equal(Random.levelOf([...round1, ...round2]), 1);
  assert.deepEqual([1, 20, 21, 40, 41, 60].map((d) => Random.levelOfDay(d)), [1, 1, 2, 2, 3, 3]);
});

test('a 25-minute kettlebell Strength workout lands in range and uses kettlebell exercises only', () => {
  for (const seed of ['a', 'b', 'c', 'd', 'e']) {
    const made = Random.make(deps, strengthKb, { level: 2, seed });
    assert.ok(made.day.est >= 23 && made.day.est <= 27, `${seed}: ${made.day.est} min`);
    assert.equal(made.day.level, 2);
    itemsOf(made.day).forEach((ex) => assert.ok(cat.allowedIn('kb', cat.EX[ex]), `${seed}: ${ex} needs more than a kettlebell`));
    assert.equal(made.program.equip, 'kb');
    const [shape, emphasis] = require('../app/summary.js').daySummary(made.day, made.program, cat);
    assert.ok(shape.startsWith(made.day.name + ':'), shape);
    assert.match(emphasis, /Level II: /);
  }
});

test('a done random workout adds to the week\'s minutes and sets, but to no program\'s count', () => {
  const { store, random, clock } = setup();
  started(random);
  clock.t = T0 + 40 * 60 * 1000;
  const id = random.done();
  assert.equal(id, 'r1');
  assert.equal(store.count('three-split-60'), 0);
  assert.deepEqual(store.entries('three-split-60'), []);
  const entries = random.entries();
  assert.deepEqual(entries, [{ pid: 'random', day: 'r1', time: new Date(T0 + 40 * 60 * 1000).toISOString() }]);
  const dayOf = (pid, n) => (pid === 'random' ? random.dayOf(n) : undefined);
  const week = Stats.report({ entries, dayOf, EX: cat.EX, names: cat.MUSCLE_NAMES }, { scope: 'all', span: 'week', now: new Date(T0 + 3600e3) });
  assert.equal(week.totals.workouts, 1);
  assert.equal(week.totals.workoutMin, random.dayOf('r1').est);
  assert.ok(week.totals.sets > 0);
  const own = Stats.report({ entries, dayOf, EX: cat.EX, names: cat.MUSCLE_NAMES }, { scope: 'random', span: 'week', now: new Date(T0 + 3600e3) });
  assert.equal(own.totals.workouts, 1, 'its own scope, "Random workouts"');
});

// ---- the rest ----
test('the same choice and seed make the same workout; another seed another one', () => {
  const a = Random.make(deps, strengthKb, { level: 1, seed: 's1' }), b = Random.make(deps, strengthKb, { level: 1, seed: 's1' });
  assert.deepEqual(a, b);
  const others = ['s2', 's3', 's4', 's5'].map((seed) => JSON.stringify(itemsOf(Random.make(deps, strengthKb, { level: 1, seed }).day)));
  assert.ok(others.some((x) => x !== JSON.stringify(itemsOf(a.day))), 'reshuffle changes the exercises');
});

test('one subject instead of a family, every family, and every length and equipment it offers', () => {
  const yoga = Random.make(deps, { subject: 'Yoga', minutes: 15, equipment: 'bw' }, { level: 1, seed: 'y' });
  assert.equal(yoga.subject, 'Yoga');
  assert.ok(yoga.day.est >= 13 && yoga.day.est <= 17, `${yoga.day.est} min`);
  itemsOf(yoga.day).forEach((ex) => assert.ok(cat.allowedIn('bw', cat.EX[ex]), ex));
  for (const family of Random.FAMILIES) {
    for (const minutes of Random.MINUTES) {
      for (const equipment of ['all', 'kb', 'bw']) {
        const choice = { family, minutes, equipment };
        const why = Random.problem(recipes, choice);
        if (why) { assert.throws(() => Random.make(deps, choice, { level: 1, seed: 'x' }), { message: why }); continue; }
        const made = Random.make(deps, choice, { level: 3, seed: 'x' });
        assert.equal(made.family, family);
        assert.ok(Math.abs(made.day.est - minutes) <= 2.5, `${family} ${minutes} ${equipment}: ${made.day.est}`);
      }
    }
  }
  // the recipe book has 15-minute days only in Mind & body: the others start at 20 and say so
  assert.equal(Random.problem(recipes, { family: 'Mind & body', minutes: 15, equipment: 'bw' }), null);
  assert.equal(Random.problem(recipes, { family: 'Cardio & combat', minutes: 15, equipment: 'all' }), 'No 15-minute Cardio & combat workout with all equipment.');
  assert.equal(Random.problem(recipes, { family: 'Cardio & combat', minutes: 25, equipment: 'bw' }), null);
});

test('what cannot be made says why', () => {
  assert.match(Random.problem(recipes, { subject: 'Nope', minutes: 25, equipment: 'all' }), /No Nope workouts/);
  assert.match(Random.problem(recipes, { subject: 'Yoga', minutes: 35, equipment: 'bw' }) || 'fits', /No 35-minute Yoga workout with no equipment|fits/);
  assert.throws(() => Random.make(deps, { family: 'Nope', minutes: 25, equipment: 'all' }, { level: 1, seed: 'x' }), { message: /No Nope workouts/ });
  assert.equal(Random.problem(recipes, strengthKb), null);
});

test('the open workout lives on the device: its session is saved, reopened, and survives a new page', () => {
  const { random, make, keys } = setup();
  assert.equal(random.current(), null);
  assert.equal(random.open(), undefined);
  started(random);
  const D = random.open();
  assert.equal(D.program.id, 'random');
  assert.equal(D.day.day, 1);
  const b = straight(D);
  D.session().complete({ type: 'set', bi: b, i: 0, k: 1 });
  assert.ok(keys().includes('kb-random-open') && keys().includes('kb-session-random-r1'));
  const again = make().open(); // the app closed and opened
  assert.equal(again.restored(), true);
  assert.equal(again.session().state(b).sets[0], 1);
  assert.equal(random.open().restored(), false, 'the page that ticked it: live, not restored');
});

test('swaps are today only and are kept with the workout; undo takes them back', () => {
  const { random } = setup();
  started(random);
  const D = random.open();
  const b = straight(D);
  const i = D.day.blocks[b].items.findIndex((it, k) => D.alternatives(b, k).length);
  assert.ok(i >= 0);
  const from = D.day.blocks[b].items[i].ex, to = D.alternatives(b, i)[0];
  D.session().complete({ type: 'set', bi: b, i: 0, k: 1 });
  D.swap(b, i, to, { onward: true }); // there is no rest of the program: today only
  const after = random.open();
  assert.equal(after.day.blocks[b].items[i].ex, to);
  assert.deepEqual(after.swapBehind(b, i), { day: 1, ex: from, to });
  assert.equal(after.session().state(b).sets[0], 1, 'the ticks carry over');
  after.undo(b, i);
  assert.equal(random.open().day.blocks[b].items[i].ex, from);
  random.open().swap(b, i, to);
  random.done();
  assert.equal(random.dayOf('r1').blocks[b].items[i].ex, to, 'stats count the exercise done');
});

test('done writes the synced record and clears the device; discard just clears; 12 hours forgets it', () => {
  const { store, random, clock, keys, device } = setup();
  started(random, strengthKb, 's1', 3);
  random.open().session().complete({ type: 'set', bi: straight(random.open()), i: 0, k: 1 });
  clock.t = T0 + 30 * 60e3;
  random.done();
  const rec = store.doc('random', 'r1');
  assert.equal(rec.name, 'Random: ' + rec.day.title);
  assert.equal(rec.level, 3);
  assert.deepEqual(rec.choices, strengthKb);
  assert.equal(rec.seed, 's1');
  assert.equal(rec.time, new Date(T0 + 30 * 60e3).toISOString());
  assert.deepEqual(keys(), []);
  assert.equal(random.current(), null);
  assert.equal(random.done(), null, 'nothing open: nothing to mark');

  started(random);
  random.discard();
  assert.deepEqual(keys(), []);

  started(random);
  clock.t += 13 * 3600e3;
  assert.equal(random.current(), null);
  assert.deepEqual(keys().filter((k) => k === 'kb-random-open'), []);
  device.set('kb-random-open', '{not json');
  assert.equal(random.current(), null);
  device.set('kb-random-open', JSON.stringify({ startedAt: clock.t, day: 'no' }));
  assert.equal(random.current(), null, 'damaged: ignored');
});

test('records from another device or a backup: damaged ones are left out of stats', () => {
  const { store, random } = setup();
  started(random); random.done();
  store.setDoc('random', 'bad1', { name: 'x' });
  store.setDoc('random', 'bad2', { name: 'x', time: 'yesterday', day: { blocks: [] }, level: 1 });
  store.setDoc('random', 'bad3', 'nope');
  assert.deepEqual(random.entries().map((e) => e.day), ['r1']);
  assert.equal(random.dayOf('bad1'), undefined);
  assert.equal(random.dayOf('missing'), undefined);
  assert.equal(random.levels().length, 1);
  assert.equal(random.levels()[0].level, 2);
});

test('newId and newSeed make short distinct strings', () => {
  assert.notEqual(Random.newId(1000, () => 0.1), Random.newId(1001, () => 0.1));
  assert.match(Random.newSeed(() => 0.5), /^[a-z0-9]+$/);
  assert.match(Random.newId(), /^[a-z0-9]+$/);
  assert.match(Random.newSeed(), /^[a-z0-9]+$/);
});

// ---- Rest-day flow (Phase 7 ticket 3) ----
test('the rest-day card: shown when nothing is marked done today, hidden once a day is (or it was dismissed today)', () => {
  const now = new Date(2026, 8, 30, 18, 0); // local time: "today" is the phone's day
  const yesterday = new Date(2026, 8, 29, 23, 30).toISOString(), today = new Date(2026, 8, 30, 0, 10).toISOString();
  assert.equal(Random.restDay([], now, null), true);
  assert.equal(Random.restDay([yesterday], now, null), true);
  assert.equal(Random.restDay([yesterday, today], now, null), false, 'one day done today');
  assert.equal(Random.restDay([], now, Random.dayKey(now)), false, 'dismissed today');
  assert.equal(Random.restDay([], now, Random.dayKey(new Date(2026, 8, 29, 12))), true, 'dismissed yesterday: back today');
  assert.equal(Random.dayKey(new Date(2026, 0, 5, 1)), '2026-01-05');
});

test('the rest-day flow: mobility & posture or flexibility, 15 minutes (the shortest the book makes), no equipment', () => {
  assert.deepEqual(Random.REST_DAY, { subjects: ['Mobility & posture', 'Flexibility'], minutes: 15, equipment: 'bw' });
  assert.equal(Random.problem(recipes, Random.REST_DAY), null);
  const subjects = new Set();
  for (const seed of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) {
    const made = Random.make(deps, Random.REST_DAY, { level: 2, seed });
    subjects.add(made.subject);
    assert.ok(Math.abs(made.day.est - 15) <= 2.5, `${seed}: ${made.day.est}`);
    itemsOf(made.day).forEach((ex) => assert.ok(cat.allowedIn('bw', cat.EX[ex]), ex));
  }
  assert.deepEqual([...subjects].sort(), ['Flexibility', 'Mobility & posture'], 'either subject comes up');
  assert.equal(Random.problem(recipes, { subjects: ['Boxing', 'HIIT'], minutes: 15, equipment: 'bw' }), 'No 15-minute Boxing or HIIT workout with no equipment.');
  assert.equal(Random.problem(recipes, { subjects: ['Nope'], minutes: 15, equipment: 'bw' }), 'No Nope workouts.');
});

test('a random workout\'s warm-up matches its format too (Phase 7 ticket 6)', () => {
  const { random } = setup();
  random.start(Random.make(deps, { subject: 'Boxing', minutes: 25, equipment: 'bw' }, { level: 1, seed: 'w' }), { id: 'rb' });
  assert.equal(random.open().day.warmup.items[0].ex, 'shadow_footwork');
});
