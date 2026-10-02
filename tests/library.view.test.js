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

// Phase 8 ticket 1: favourites and hidden subjects, from the synced prefs ({ favourites: [id], hidden: [subject] }).
const withPrefs = (prefs, f = {}) => libraryView(S, { ...start, ...f }, { families: FAM, lengthOf, prefs });

test('favourites and hidden subjects: the favourites shelf first, counts without the hidden subject', () => {
  const v = withPrefs({ favourites: ['g', 'b'], hidden: ['HIIT'] });
  assert.deepEqual(v.favourites.map((p) => p.id), ['b', 'g'], 'library order, not the order they were starred');
  assert.deepEqual(v.families.map((f) => [f.name, f.count]), [['All', 7], ['Strength', 3], ['Mind', 4]], 'Cardio had only HIIT, so it goes');
  assert.ok(!names(v.subjects).includes('HIIT'));
  assert.deepEqual(v.shelves.map((s) => s.subject), ['Signature', 'Strength', 'Core', 'Yoga']);
  assert.equal(v.counter, '7 programs');
  assert.deepEqual(v.hidden, ['HIIT']);
});

test('favourites: the shelf ignores the filters; a starred program stays on its own shelf too', () => {
  const v = withPrefs({ favourites: ['d'] }, { family: 'Mind', len: 'short' });
  assert.deepEqual(v.favourites.map((p) => p.id), ['d']);
  assert.ok(!v.shelves.some((s) => s.programs.some((p) => p.id === 'd')));
  assert.deepEqual(withPrefs({ favourites: ['d'] }).shelves.find((s) => s.subject === 'HIIT').programs.map((p) => p.id), ['d']);
});

test('a starred program whose subject is hidden stays a favourite: the star is the more specific choice', () => {
  assert.deepEqual(withPrefs({ favourites: ['d'], hidden: ['HIIT'] }).favourites.map((p) => p.id), ['d']);
});

test('favourites: ids no longer in the library are skipped; no prefs means no shelf and nothing hidden', () => {
  assert.deepEqual(withPrefs({ favourites: ['gone', 'a'] }).favourites.map((p) => p.id), ['a']);
  const v = view();
  assert.deepEqual(v.favourites, []); assert.deepEqual(v.hidden, []);
  assert.deepEqual(withPrefs({}).favourites, []);
});

test('hiding the subject or family that is picked falls back to All', () => {
  const v = withPrefs({ hidden: ['Yoga'] }, { family: 'Mind', subject: 'Yoga' });
  assert.deepEqual(pressed(v.subjects), ['All']);
  assert.deepEqual(v.shelves.map((s) => s.subject), ['Core']);
  assert.equal(v.counter, 'Mind · 1 program');
  const w = withPrefs({ hidden: ['HIIT'] }, { family: 'Cardio' });
  assert.deepEqual(pressed(w.families), ['All']);
  assert.equal(w.count, 7);
});

test('subjectsOf: every subject with programs, in family order, for the Hidden subjects setting', () => {
  const { subjectsOf } = require('../app/library.js');
  assert.deepEqual(subjectsOf(S, FAM), [['Strength', ['Signature', 'Strength']], ['Cardio', ['HIIT']], ['Mind', ['Core', 'Yoga']]]);
});

test('toggleIn: adds a missing value, removes a present one, and never changes the list it was given', () => {
  const { toggleIn } = require('../app/library.js');
  const l = ['a'];
  assert.deepEqual(toggleIn(l, 'b'), ['a', 'b']);
  assert.deepEqual(toggleIn(l, 'a'), []);
  assert.deepEqual(toggleIn(undefined, 'a'), ['a']);
  assert.deepEqual(l, ['a']);
});

// Phase 8 ticket 2: the equipment filter. Like the recipes: "Kettlebell only" is what you can do with a kettlebell
// (kettlebell and no-equipment programs), "No equipment" only no-equipment ones. Unlike length, the counts follow it.
const G = [
  { id: 'a', subject: 'Signature', minutes: [30, 30], equip: 'all' }, { id: 'b', subject: 'Strength', minutes: [20, 20], equip: 'kb' },
  { id: 'c', subject: 'Strength', minutes: [40, 40], equip: 'bw' }, { id: 'd', subject: 'HIIT', minutes: [20, 20], equip: 'bw' },
  { id: 'e', subject: 'Core', minutes: [20, 20] },
];
const gear = (f = {}) => libraryView(G, { ...start, ...f }, { families: FAM, lengthOf });

test('equipment: counts, shelves and the counter follow it', () => {
  const kb = gear({ equip: 'kb' });
  assert.deepEqual(kb.families.map((f) => [f.name, f.count]), [['All', 3], ['Strength', 2], ['Cardio', 1]], 'Mind has nothing with a kettlebell only');
  assert.deepEqual(kb.subjects.map((s) => [s.name, s.count]), [['All', 3], ['Strength', 2], ['HIIT', 1]]);
  assert.deepEqual(kb.shelves.map((s) => s.programs.map((p) => p.id)), [['b', 'c'], ['d']]);
  assert.equal(kb.counter, '3 programs');
  const bw = gear({ equip: 'bw', subject: 'Strength' });
  assert.equal(bw.counter, 'Strength · 1 program');
  assert.equal(bw.equipLabel, 'No equipment');
  assert.deepEqual(bw.equips.map((e) => [e.key, e.pressed]), [['all', false], ['kb', false], ['bw', true]]);
});

test('equipment: a program with no equip tag needs all the gear; "Any" when none is set', () => {
  const v = gear();
  assert.equal(v.count, 5); assert.equal(v.equipLabel, 'Any');
  assert.ok(!gear({ equip: 'kb' }).shelves.some((s) => s.programs.some((p) => p.id === 'e' || p.id === 'a')));
});

test('equipment with length: the count follows both, the total only the equipment', () => {
  const v = gear({ equip: 'kb', len: 'short' });
  assert.equal(v.count, 2); assert.equal(v.total, 3);
  assert.equal(v.counter, '2 of 3 programs');
});

test('equipment: a picked family left empty by it falls back to All', () => {
  assert.deepEqual(pressed(gear({ equip: 'bw', family: 'Mind' }).families), ['All']);
});

test('equipment: changing it keeps the family and subject', () => {
  assert.deepEqual(setFilter({ family: 'Mind', subject: 'Yoga', len: 'all', equip: 'all' }, 'equip', 'bw'), { family: 'Mind', subject: 'Yoga', len: 'all', equip: 'bw' });
});

// Phase 13 ticket 1: exercises I skip, as `skip: [exercise id]` in the synced prefs
test('skipped: the exercises in prefs.skip this app knows, once each, in the order they were skipped', () => {
  const { skipped, toggleIn } = require('../app/library.js');
  const EXS = { pushup: {}, kb_swing: {}, pullup: {} };
  assert.deepEqual(skipped({}, EXS), []);
  assert.deepEqual(skipped(null, EXS), []);
  assert.deepEqual(skipped({ skip: 'pushup' }, EXS), [], 'not a list: nothing skipped');
  assert.deepEqual(skipped({ skip: ['kb_swing', 'gone', 3, 'pushup', 'kb_swing'] }, EXS), ['kb_swing', 'pushup']);
  assert.deepEqual(skipped({ skip: toggleIn(toggleIn([], 'pullup'), 'pushup') }, EXS), ['pullup', 'pushup']);
});

// Phase 14 ticket 2: ~260 programs. A shelf shows its first 6, plus any program you started, and "Show all N"
test('a long shelf shows its first 6 and how many more; opened, or its subject picked, it shows all', () => {
  const { SHELF } = require('../app/library.js');
  assert.equal(SHELF, 6);
  const many = Array.from({ length: 10 }, (_, i) => mk(`y${i}`, 'Yoga', 20));
  const lib = [...many, mk('c1', 'Core', 20)];
  const v = (f = {}, o = {}) => libraryView(lib, { ...start, ...f }, { families: FAM, lengthOf, prefs: { favourites: ['y9'] }, ...o });
  const yoga = (x) => x.shelves.find((s) => s.subject === 'Yoga');
  assert.deepEqual(yoga(v()).programs.map((p) => p.id), ['y0', 'y1', 'y2', 'y3', 'y4', 'y5']);
  assert.deepEqual([yoga(v()).total, yoga(v()).more], [10, 4]);
  assert.deepEqual(v().shelves.find((s) => s.subject === 'Core').more, 0);
  assert.equal(v().count, 11, 'the counter counts every program, shown or not');
  assert.deepEqual(v().favourites.map((p) => p.id), ['y9'], 'favourites are never cut');
  assert.equal(yoga(v({}, { opened: ['Yoga'] })).programs.length, 10);
  assert.equal(yoga(v({}, { opened: ['Yoga'] })).more, 0);
  assert.equal(yoga(v({ subject: 'Yoga' })).programs.length, 10, 'a picked subject shows all');
  // a program you started stays on its shelf, in its place
  assert.deepEqual(yoga(v({}, { keep: ['y8'] })).programs.map((p) => p.id), ['y0', 'y1', 'y2', 'y3', 'y4', 'y5', 'y8']);
  assert.equal(yoga(v({}, { keep: ['y8'] })).more, 3);
});
