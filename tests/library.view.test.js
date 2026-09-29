// The programs page's filters: libraryView(summaries, filters, { families, lengthOf }) decides what the page shows.
const test = require('node:test');
const assert = require('node:assert/strict');
const { libraryView, setFilter, FAMILIES, LENGTHS, lengthOf, counterText } = require('../app/library.js');

const FAM = [['Strength', ['Signature', 'Strength']], ['Cardio', ['HIIT']], ['Mind', ['Core', 'Yoga', 'Pilates']]];
const mk = (id, subject, minutes) => ({ id, subject, minutes: [minutes, minutes] });
const S = [
  mk('a', 'Signature', 30), mk('b', 'Strength', 20), mk('c', 'Strength', 40),
  mk('d', 'HIIT', 20),
  mk('e', 'Core', 20), mk('f', 'Yoga', 20), mk('g', 'Yoga', 30), mk('h', 'Yoga', 40),
];
const start = { family: 'all', subject: 'all', len: 'all' };
const view = (f = {}) => libraryView(S, { ...start, ...f }, { families: FAM, lengthOf });
const names = (xs) => xs.map((x) => x.name);
const pressed = (xs) => xs.filter((x) => x.pressed).map((x) => x.name);

test('All: families and subjects with counts, every program shown, in family order', () => {
  const v = view();
  assert.deepEqual(v.families.map((f) => [f.name, f.count]), [['All', 8], ['Strength', 3], ['Cardio', 1], ['Mind', 4]]);
  assert.deepEqual(pressed(v.families), ['All']);
  assert.deepEqual(v.subjects.map((s) => [s.name, s.count]), [['All', 8], ['Signature', 1], ['Strength', 2], ['HIIT', 1], ['Core', 1], ['Yoga', 3]]);
  assert.deepEqual(pressed(v.subjects), ['All']);
  assert.deepEqual(v.shelves.map((s) => [s.subject, s.programs.map((p) => p.id)]), [['Signature', ['a']], ['Strength', ['b', 'c']], ['HIIT', ['d']], ['Core', ['e']], ['Yoga', ['f', 'g', 'h']]]);
  assert.equal(v.count, 8); assert.equal(v.total, 8);
  assert.deepEqual(v.unknown, []);
  assert.equal(v.counter, '8 programs');
});

test('subjects without programs do not show (Pilates here)', () => {
  assert.ok(!names(view().subjects).includes('Pilates'));
});

test('a family with no programs at all does not show', () => {
  const v = libraryView(S, start, { families: [...FAM, ['Empty', ['Nothing']]], lengthOf });
  assert.ok(!names(v.families).includes('Empty'));
});

test('a family shows only its own subjects and shelves', () => {
  const v = view({ family: 'Mind' });
  assert.deepEqual(pressed(v.families), ['Mind']);
  assert.deepEqual(names(v.subjects), ['All', 'Core', 'Yoga']);
  assert.deepEqual(v.subjects[0].count, 4);
  assert.deepEqual(v.shelves.map((s) => s.subject), ['Core', 'Yoga']);
  assert.equal(v.count, 4);
  assert.equal(v.counter, 'Mind · 4 programs');
});

test('a subject narrows to its shelf', () => {
  const v = view({ family: 'Mind', subject: 'Yoga' });
  assert.deepEqual(pressed(v.subjects), ['Yoga']);
  assert.deepEqual(v.shelves.map((s) => s.subject), ['Yoga']);
  assert.equal(v.count, 3); assert.equal(v.total, 3);
  assert.equal(v.counter, 'Yoga · 3 programs');
});

test('a subject picked under All families still works', () => {
  const v = view({ subject: 'HIIT' });
  assert.equal(v.counter, 'HIIT · 1 program');
});

test('a family change resets the subject; other changes keep it', () => {
  const f = { family: 'Mind', subject: 'Yoga', len: 'all' };
  assert.deepEqual(setFilter(f, 'family', 'Strength'), { family: 'Strength', subject: 'all', len: 'all' });
  assert.deepEqual(setFilter(f, 'subject', 'Core'), { family: 'Mind', subject: 'Core', len: 'all' });
  assert.deepEqual(setFilter(f, 'len', 'short'), { family: 'Mind', subject: 'Yoga', len: 'short' });
  assert.equal(f.family, 'Mind', 'the old filters are not changed');
});

test('length: count follows it, chip counts and total do not', () => {
  const v = view({ family: 'Mind', subject: 'Yoga', len: 'short' });
  assert.equal(v.count, 1); assert.equal(v.total, 3);
  assert.equal(v.counter, 'Yoga · 1 of 3 programs');
  assert.deepEqual(v.subjects.map((s) => s.count), [4, 1, 3]);
  assert.deepEqual(v.shelves.map((s) => s.programs.map((p) => p.id)), [['f']]);
  assert.equal(v.lengthLabel, 'Up to 25 min');
  assert.deepEqual(pressed(v.lengths.map((l) => ({ name: l.label, pressed: l.pressed }))), ['Up to 25 min']);
});

test('length with nothing left: no shelves, count 0', () => {
  const v = view({ subject: 'Signature', len: 'short' });
  assert.equal(v.count, 0); assert.deepEqual(v.shelves, []);
  assert.equal(v.counter, 'Signature · 0 of 1 program');
});

test('length under All: "N of M programs"', () => {
  assert.equal(view({ len: 'long' }).counter, '2 of 8 programs');
});

test('lengths: four choices, "Any" when none is set', () => {
  const v = view();
  assert.deepEqual(v.lengths.map((l) => l.key), ['all', 'short', 'mid', 'long']);
  assert.equal(v.lengthLabel, 'Any');
  assert.deepEqual(LENGTHS.map(([k]) => k), ['all', 'short', 'mid', 'long']);
});

test('lengthOf: the middle of the range, cut at 25.5 and 32.5 minutes', () => {
  assert.equal(lengthOf({ minutes: [25, 26] }), 'short');
  assert.equal(lengthOf({ minutes: [26, 26] }), 'mid');
  assert.equal(lengthOf({ minutes: [32, 33] }), 'mid');
  assert.equal(lengthOf({ minutes: [33, 33] }), 'long');
});

test('a subject missing from the families is returned in unknown and not shown', () => {
  const v = libraryView([...S, mk('z', 'Mystery', 20), mk('y', 'Mystery', 20)], start, { families: FAM, lengthOf });
  assert.deepEqual(v.unknown, ['Mystery']);
  assert.equal(v.count, 8);
  assert.ok(!names(v.subjects).includes('Mystery'));
});

test('counterText: one program is singular', () => {
  assert.equal(counterText('All', 1, 1), '1 program');
});

test('the real families cover every subject in the real configs', () => {
  const { CONFIGS } = require('../program-builder.js');
  const known = new Set(FAMILIES.flatMap(([, l]) => l));
  assert.deepEqual([...new Set(CONFIGS.map((c) => c.subject))].filter((s) => !known.has(s)), []);
});
