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
  const r = searchExercises(EX, 'deadlift', { family: 'all', sub: 'all', gear: 'all', muscles: ['glutes', 'hamstrings'] }, { names: MUSCLE_NAMES });
  assert.ok(r.list.length > 0);
  assert.ok(r.list.every((e) => works(e, 'glutes') || works(e, 'hamstrings')));
  assert.equal(r.list[0].id, 'db_rdl');
  assert.equal(r.families[0].count, r.count);
  const none = searchExercises(EX, '', { family: 'all', sub: 'all', gear: 'all', muscles: [] }, { names: MUSCLE_NAMES });
  assert.equal(none.count, all.length);
});

// 2 Oct: the Muscles page splits the exercises for the picked muscles into main and secondary
test('splitByMuscles: "Main muscle" holds exercises where a picked muscle is main, "Also works" only secondary ones', () => {
  const { splitByMuscles } = require('../app/library.js');
  const { main, also } = splitByMuscles(all, ['glutes']);
  assert.ok(main.length > 0 && also.length > 0);
  assert.ok(main.every((e) => e.muscles.primary.includes('glutes')));
  assert.ok(also.every((e) => !e.muscles.primary.includes('glutes') && e.muscles.secondary.includes('glutes')));
  assert.equal(main.length + also.length, all.filter((e) => works(e, 'glutes')).length, 'every exercise that works it, once');
  assert.ok(ids(main).includes('hip_thrust') && ids(main).includes('db_rdl'));
  const two = splitByMuscles(all, ['glutes', 'hamstrings']);
  assert.ok(two.main.every((e) => e.muscles.primary.some((m) => m === 'glutes' || m === 'hamstrings')));
  assert.deepEqual(splitByMuscles(all, []), { main: [], also: [] });
});
