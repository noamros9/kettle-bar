// Phase 21 ticket 1: exercise families and subjects on the Exercises page.
const test = require('node:test');
const assert = require('node:assert/strict');
const { familyOf, searchExercises, EX_FAMILIES } = require('../app/library.js');
const { EX, MUSCLE_NAMES } = require('../exercises.js');

const SUBS = {
  warmup: ['dynamic', 'joints', 'activation'],
  cooldown: ['static', 'breath'],
  couple: ['fuck', 'oral', 'hands', 'anal', 'toys', 'partner', 'tease', 'dare', 'massage'],
};
const famName = Object.fromEntries(EX_FAMILIES.map(([k, n]) => [k, n]));
const subName = Object.fromEntries(EX_FAMILIES.flatMap(([k, , list]) => list.map(([sk, sn]) => [`${k}:${sk}`, sn])));
const label = (e) => {
  const { family, subject } = familyOf(e);
  return [famName[family], subName[`${family}:${subject}`]];
};
const find = (f = {}) => searchExercises(EX, '', { family: 'all', sub: 'all', gear: 'all', ...f }, { names: MUSCLE_NAMES });

test('every exercise has exactly one family and one subject from the table', () => {
  const allowed = new Map(EX_FAMILIES.map(([k, , list]) => [k, new Set(list.map(([sk]) => sk))]));
  const used = new Set();
  Object.values(EX).forEach((e) => {
    const { family, subject } = familyOf(e);
    assert.ok(allowed.has(family), `${e.id}: family ${family}`);
    assert.ok(allowed.get(family).has(subject), `${e.id}: ${family}/${subject}`);
    assert.ok(subject, `${e.id}: empty subject`);
    used.add(`${family}:${subject}`);
  });
  EX_FAMILIES.forEach(([fam, , list]) => list.forEach(([sk, sn]) => {
    assert.ok(used.has(`${fam}:${sk}`), `${sn} of ${famName[fam]} has no exercises`);
  }));
});

test('every warm-up, cool-down and couple exercise has a known sub; no other exercise has one', () => {
  Object.values(EX).forEach((e) => {
    if (SUBS[e.cat]) {
      assert.ok(SUBS[e.cat].includes(e.sub), `${e.id}: sub ${e.sub}`);
    } else {
      assert.equal(e.sub, undefined, e.id);
    }
  });
});

test('Goblet squat, half split and 69 land on the table', () => {
  assert.deepEqual(label(EX.goblet_squat), ['Muscles', 'Legs & glutes']);
  assert.deepEqual(label(EX.half_split), ['Stretch & cool-down', 'Flexibility']);
  assert.deepEqual(label(EX.oral_69), ['Couples', 'Oral']);
});

test('searchExercises with muscles / chest returns chest exercises only, with counts', () => {
  const r = find({ family: 'muscles', sub: 'chest' });
  assert.ok(r.list.length > 0);
  assert.ok(r.list.every((e) => familyOf(e).family === 'muscles' && familyOf(e).subject === 'chest'));
  const muscles = Object.values(EX).filter((e) => familyOf(e).family === 'muscles');
  const chest = muscles.filter((e) => familyOf(e).subject === 'chest');
  assert.equal(r.count, chest.length);
  assert.equal(r.families.find((c) => c.key === 'muscles').count, muscles.length);
  assert.equal(r.families.find((c) => c.pressed).key, 'muscles');
  assert.equal(r.subjects.find((c) => c.key === 'chest').count, chest.length);
  assert.equal(r.subjects.find((c) => c.pressed).key, 'chest');
  assert.ok(!r.subjects.some((c) => c.key === 'breath'));
});

test('a picked family with nothing left falls back to All; Breathing is offered', () => {
  const emptyFam = find({ family: 'warmup', gear: 'bar' });
  assert.equal(emptyFam.families.find((c) => c.pressed).key, 'all');
  assert.deepEqual(emptyFam.subjects, []);
  const stretch = find({ family: 'stretch', sub: 'breath' });
  assert.equal(stretch.families.find((c) => c.pressed).key, 'stretch');
  assert.equal(stretch.subjects.find((c) => c.pressed).key, 'breath');
  assert.ok(stretch.subjects.some((c) => c.key === 'breath'));
  assert.equal(stretch.list.length, 6);
  assert.ok(stretch.list.every((e) => familyOf(e).subject === 'breath'));
  const all = find();
  assert.deepEqual(all.families.map((c) => c.key), ['all', ...EX_FAMILIES.map(([k]) => k)]);
  assert.deepEqual(all.subjects, []);
  assert.equal(all.families[0].count, Object.keys(EX).length);
});
