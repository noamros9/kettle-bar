// Phase 34 ticket 3 (decisions 259, 261, 262, 266, 267): 15 minutes everywhere it's offered, and the rest-day card's
// 10 and 15. The hidden day types (configs/short.js, ticket 2) make them; this is where people reach them.
const test = require('node:test');
const assert = require('node:assert/strict');
const R = require('../recipes.js');
const Builder = require('../program-builder.js');
const cat = require('../exercises.js');
const Random = require('../app/random.js');
const Own = require('../app/own.js');

const recipes = R.of(R.book());
const deps = { recipes, buildDay: Builder.buildDay, newMemory: Builder.newMemory, makeRnd: Builder.makeRnd, cat };
const mains = (day) => day.blocks.filter((b) => b.kind !== 'warmup' && b.kind !== 'cooldown');

test('every family builds a 15-minute random workout at every gear it allows', () => {
  Random.FAMILIES.forEach((family) => ['all', 'kb', 'bw'].forEach((equipment) => {
    const choice = { family, minutes: 15, equipment };
    if (Random.problem(recipes, choice)) { assert.notEqual(equipment, 'all', `${family}: no 15 even with all equipment`); return; }
    const made = Random.make(deps, choice, { level: 3, seed: `${family}${equipment}` });
    assert.ok(Math.abs(made.day.est - 15) <= 2.5, `${family} ${equipment}: ${made.day.est} min`);
  }));
});

test('a random workout from a 15-min circuit is named for its subject (267)', () => {
  const made = Random.make(deps, { subject: 'Boxing', minutes: 15, equipment: 'bw' }, { level: 1, seed: 'b' });
  assert.equal(made.day.name, 'Boxing · 15-min circuit');
  const other = Random.make(deps, { subject: 'Yoga', minutes: 25, equipment: 'bw' }, { level: 1, seed: 'y' });
  assert.doesNotMatch(other.day.name, /15-min circuit/);
});

test('the rest-day card: 10 and 15 minutes, each a flow of poses ending on a breathing drill, no equipment', () => {
  assert.deepEqual(Random.REST_DAY, { subjects: ['Mobility & posture', 'Flexibility', 'Yoga'], minutes: [10, 15], equipment: 'bw' });
  const subjects = new Set();
  Random.REST_DAY.minutes.forEach((m) => ['a', 'b', 'c', 'd', 'e', 'f'].forEach((seed) => {
    const choice = Random.restChoice(m);
    assert.deepEqual(Random.minutesOf(choice), [10, 15]);
    const made = Random.make(deps, choice, { level: 2, seed });
    subjects.add(made.subject);
    assert.ok(Math.abs(made.day.est - m) <= 2.5, `${m} ${seed}: ${made.day.est} min`);
    const last = mains(made.day).at(-1);
    assert.equal(last.items.length, 1);
    assert.equal(cat.EX[last.items[0].ex].sub, 'breath', `${m} ${seed}: ends on ${last.items[0].ex}`);
    made.day.blocks.flatMap((b) => b.items).forEach((it) => assert.ok(cat.allowedIn('bw', cat.EX[it.ex]), it.ex));
  }));
  assert.ok(subjects.size >= 2, [...subjects].join(', '));
  assert.deepEqual(Random.minutesOf({ family: 'Strength', minutes: 25, equipment: 'kb' }), Random.MINUTES);
});

test('a rest-day record from before (two subjects, 15 minutes) still makes its day', () => {
  const made = Random.make(deps, { subjects: ['Mobility & posture', 'Flexibility'], minutes: 15, equipment: 'bw' }, { level: 1, seed: 'old' });
  assert.ok(Math.abs(made.day.est - 15) <= 2.5);
});

test('Build your own offers 15 with one subject, and not with two', () => {
  assert.deepEqual(Own.MINUTES, [15, 20, 25, 30, 35, 40]);
  const one = { subjects: ['Boxing'], split: 2, minutes: 15, equipment: 'bw' };
  assert.equal(Own.states(recipes, one).minutes[15].ok, true);
  assert.equal(Own.problem(recipes, one), null);
  const two = { subjects: ['Strength', 'Yoga'], split: 2, minutes: 20, equipment: 'all' };
  assert.deepEqual(Own.states(recipes, two).minutes[15], { ok: false, reason: '15 minutes is for one subject.' });
  assert.equal(Own.problem(recipes, { ...two, minutes: 15 }), '15 minutes is for one subject: a mix starts at 20.');
});
