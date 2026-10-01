// Phase 9 ticket 1: pick muscles on the Exercises page's map. byMuscles(list, picked) and searchExercises' filters.muscles.
const test = require('node:test');
const assert = require('node:assert/strict');
const { byMuscles, searchExercises } = require('../app/library.js');
const { EX, MUSCLE_NAMES } = require('../exercises.js');

const ids = (l) => l.map((e) => e.id);
const all = Object.values(EX);
const works = (e, m) => e.muscles.primary.includes(m) || e.muscles.secondary.includes(m);

test('glutes + hamstrings: Romanian deadlifts (both main) before hip thrusts (one main, one secondary), both before one-muscle ones', () => {
  const r = ids(byMuscles(all, ['glutes', 'hamstrings']));
  assert.ok(r.indexOf('db_rdl') < r.indexOf('hip_thrust'));
  const firstSingle = byMuscles(all, ['glutes', 'hamstrings']).findIndex((e) => !(works(e, 'glutes') && works(e, 'hamstrings')));
  assert.ok(r.indexOf('hip_thrust') < firstSingle);
  assert.ok(byMuscles(all, ['glutes', 'hamstrings']).slice(firstSingle).every((e) => !(works(e, 'glutes') && works(e, 'hamstrings'))));
});

test('an exercise working none of the picked muscles is not listed; nothing picked keeps the list as it is', () => {
  assert.ok(byMuscles(all, ['calves']).every((e) => works(e, 'calves')));
  assert.ok(!ids(byMuscles(all, ['calves'])).includes('pushup'));
  assert.equal(byMuscles(all, []).length, all.length);
});

test('same muscles worked: more weight first (main 1, secondary ½), then catalogue order', () => {
  const list = [
    { id: 'a', muscles: { primary: [], secondary: ['glutes'] } },
    { id: 'b', muscles: { primary: ['glutes'], secondary: [] } },
    { id: 'c', muscles: { primary: ['glutes'], secondary: [] } },
  ];
  assert.deepEqual(ids(byMuscles(list, ['glutes'])), ['b', 'c', 'a']);
});

test('searchExercises: picked muscles and a search word both apply, in muscle order, counts follow', () => {
  const r = searchExercises(EX, 'deadlift', { cat: 'all', gear: 'all', muscles: ['glutes', 'hamstrings'] }, { names: MUSCLE_NAMES });
  assert.ok(r.list.length > 0);
  assert.ok(r.list.every((e) => works(e, 'glutes') || works(e, 'hamstrings')));
  assert.equal(r.list[0].id, 'db_rdl');
  assert.equal(r.cats[0].count, r.count);
  const none = searchExercises(EX, '', { cat: 'all', gear: 'all', muscles: [] }, { names: MUSCLE_NAMES });
  assert.equal(none.count, all.length);
});
