// Phase 8 ticket 3: the Exercises page's search and filters, searchExercises(EX, query, filters, { names }).
const test = require('node:test');
const assert = require('node:assert/strict');
const { searchExercises, gearOf, GEAR } = require('../app/library.js');
const { EX, MUSCLE_NAMES } = require('../exercises.js');

const find = (q, f = {}) => searchExercises(EX, q, { cat: 'all', gear: 'all', ...f }, { names: MUSCLE_NAMES });
const ids = (r) => r.list.map((e) => e.id);

test('"hip" finds hip thrusts, hip CARs and hip airplanes, name matches first', () => {
  const r = find('hip');
  ['hip_thrust', 'hip_cars', 'hip_airplane'].forEach((id) => assert.ok(ids(r).includes(id), id));
  const byName = r.list.findIndex((e) => !/hip/i.test(e.name));
  assert.ok(r.list.slice(0, byName === -1 ? r.list.length : byName).every((e) => /hip/i.test(e.name)));
  assert.ok(r.list.slice(byName === -1 ? r.list.length : byName).every((e) => !/hip/i.test(e.name)), 'muscle and cue matches after the names');
});

test('the kettlebell chip keeps only kettlebell exercises', () => {
  const r = find('', { gear: 'kb' });
  assert.ok(r.list.length > 0);
  assert.ok(r.list.every((e) => e.load === 'kb'));
  assert.equal(r.count, Object.values(EX).filter((e) => e.load === 'kb').length);
});

test('gear: dumbbells, pull-up bar and none, as each exercise uses it', () => {
  assert.equal(gearOf({ load: 'heavy' }), 'db'); assert.equal(gearOf({ load: 'single' }), 'db');
  assert.equal(gearOf({ load: 'kb' }), 'kb'); assert.equal(gearOf({ equip: ['bar'] }), 'bar'); assert.equal(gearOf({}), 'none');
  assert.deepEqual(GEAR.map(([k]) => k), ['all', 'kb', 'db', 'bar', 'none']);
  assert.ok(find('', { gear: 'bar' }).list.every((e) => (e.equip || []).includes('bar')));
});

test('a muscle finds its exercises; every word must match; case and extra spaces do not matter', () => {
  assert.ok(ids(find('  GLUTES ')).includes('hip_thrust'));
  const both = find('hip thrust');
  assert.ok(ids(both).includes('hip_thrust'));
  const text = (e) => [e.name, e.cue, ...[...e.muscles.primary, ...e.muscles.secondary].map((m) => MUSCLE_NAMES[m])].join(' ').toLowerCase();
  assert.ok(both.list.every((e) => text(e).includes('hip') && text(e).includes('thrust')));
  assert.equal(find('zzzz nothing').count, 0);
});

test('the cue is searched too', () => {
  const word = EX.pushup.cue.split(/\W+/).find((w) => w.length > 6);
  assert.ok(ids(find(word)).includes('pushup'));
});

test('category: chips list each category with its count for the query and gear; the list keeps category order', () => {
  const r = find('', { cat: 'chest' });
  assert.ok(r.list.every((e) => e.cat === 'chest'));
  const chips = find('').cats;
  assert.equal(chips[0].key, 'all'); assert.equal(chips[0].count, Object.keys(EX).length);
  assert.equal(chips.find((c) => c.key === 'chest').count, Object.values(EX).filter((e) => e.cat === 'chest').length);
  const kb = find('', { gear: 'kb' }).cats;
  assert.ok(kb.every((c) => c.count > 0), 'a category with nothing left is not offered');
  assert.equal(find('', { cat: 'chest' }).total, Object.keys(EX).length, 'total: every exercise');
});

test('a picked category with nothing left falls back to All', () => {
  const r = find('', { cat: 'yoga', gear: 'bar' });
  assert.equal(r.cats.find((c) => c.pressed).key, 'all');
  assert.ok(r.list.every((e) => (e.equip || []).includes('bar')));
});

test('no query and no filters: every exercise, in catalogue order', () => {
  assert.deepEqual(ids(find('')), Object.keys(EX));
});
