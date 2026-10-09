// Phase 22 ticket 21: catalogue 13 opens to own programs and random workouts. Saved ones keep the catalogue they stored.
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const R = require('../recipes.js');
const Builder = require('../program-builder.js');
const cat = require('../exercises.js');
const Random = require('../app/random.js');
const Own = require('../app/own.js');

const recipes = R.of(R.book());
const hash = (x) => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 16);

test('the book is at catalogue 13: new own programs are made at it', () => {
  assert.equal(R.book().catalogue, 13);
  assert.equal(recipes.make({ subjects: ['Strength'], split: 3, minutes: 30, equipment: 'all', levers: ['weight', 'reps'] }, 's').catalogue, 13);
});

// A record stores its config (app/own.js): this one was made by the catalogue-12 book on 9 Oct 2026.
test('an own program saved at catalogue 12 builds the same days as before (pinned)', () => {
  const config = require('./fixtures/own-catalogue-12.json');
  assert.equal(config.catalogue, 12);
  assert.equal(hash(Own.programOf({ build: Builder.build, ex: cat }, { pid: 'own-pin', name: 'Pin', config }).days), '229c39b04339d57b');
});

test('a random workout can draw a catalogue-13 exercise', () => {
  const deps = { recipes, buildDay: Builder.buildDay, newMemory: Builder.newMemory, makeRnd: Builder.makeRnd, cat };
  const fresh = ['Strength', 'Cardio & combat', 'Mind & body'].flatMap((family) => ['a', 'b', 'c', 'd', 'e', 'f'].flatMap((seed) =>
    Random.make(deps, { family, minutes: 30, equipment: 'all' }, { level: 1, seed }).day.blocks.flatMap((b) => b.items.map((it) => it.ex))))
    .filter((ex) => cat.EX[ex].added === 13);
  assert.ok(fresh.length > 0, 'no catalogue-13 exercise in 18 random workouts');
});
