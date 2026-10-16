// Phase 34 ticket 2 (decisions 259, 260, 262): hidden day types in configs/short.js. The recipe book reads them, the
// library never does: a 15-min circuit for every fitness subject that had no 15, and a rest-day flow at 10 and 15.
const test = require('node:test');
const assert = require('node:assert/strict');
const SHORT = require('../configs/short.js');
const PROGRAMS = require('../programs.config.js');
const PINS = require('./fixtures/program-days.json');
const R = require('../recipes.js');
const { SHELVES } = require('../app/library.js');
const { book } = require('../recipe-book.js');

const BOOK = book();
const bit = (m) => 1 << R.GRID.indexOf(m);
const typesOf = (pred) => BOOK.types.filter((t) => pred(t, BOOK.subjects[t.subject][0]));
const fits = (t, m) => t.fit.some((mask) => mask & bit(m));
const NOT_FITNESS = new Set(['Signature', 'Variety', 'Surprise', ...SHELVES.find(([s]) => s === 'After dark')[1]]);

test('every short config is hidden, and no hidden config is in the library (made in ORDER) or the pins', () => {
  assert.ok(SHORT.length > 0);
  SHORT.forEach((c) => {
    assert.equal(c.hidden, true, c.id);
    assert.ok(!PROGRAMS.some((p) => p.id === c.id), `${c.id} in the library`);
    assert.ok(!(c.id in PINS), `${c.id} pinned`);
  });
  assert.ok(!PROGRAMS.some((p) => p.hidden));
});

test('10 is the last target of GRID, so every older fit mask keeps its bits', () => {
  assert.deepEqual(R.GRID, [15, 20, 25, 30, 35, 40, 10]);
});

test('every fitness subject but Signature has a day type that fits 15 at some gear', () => {
  const subjects = [...new Set(BOOK.subjects.map(([s]) => s))].filter((s) => !NOT_FITNESS.has(s));
  assert.ok(subjects.length >= 40, `${subjects.length} subjects`);
  subjects.forEach((s) => assert.ok(typesOf((t, sub) => sub === s).some((t) => fits(t, 15)), `${s} has no 15`));
});

test('the three rest-day flows fit 10 and 15 with no gear, and end on a breathing drill', () => {
  ['Mobility & posture', 'Flexibility', 'Yoga'].forEach((s) => {
    const [t] = typesOf((x, sub) => sub === s && x.id.startsWith('rest-'));
    assert.ok(t, s);
    assert.equal(t.equip, 'bw', s);
    assert.ok(t.fit[0] & bit(10) && t.fit[0] & bit(15), `${s}: ${t.fit[0].toString(2)}`);
    assert.deepEqual(BOOK.specs[t.spec].b.at(-1).slice(0, 3), ['flow', 'Breathe', 'breath'], s);
  });
});

test('a hidden day type fits only its own targets, and is never a part of a mix', () => {
  const { generate } = require('../recipe-book.js');
  const circuit = SHORT.find((c) => c.subject === 'Back care');
  // a real Back care program too: a subject's levers come from its library programs, never a hidden one
  const own = PROGRAMS.find((c) => c.subject === 'Back care');
  const made = generate({ configs: [own, circuit], families: [['Mind & body', ['Back care']]], catalogue: 15 });
  const t = made.types.find((x) => x.id.startsWith('short-'));
  assert.ok(t.fit.some((mask) => mask & bit(15)), 'fits 15');
  assert.ok(t.fit.every((mask) => (mask & ~bit(15)) === 0), `only 15: ${t.fit.map((m) => m.toString(2))}`);
  assert.ok(made.mix.parts.every(([, spec]) => spec !== t.spec), 'never a part');
});
