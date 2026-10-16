// Exercise Catalogue and Figure engine.
const test = require('node:test');
const assert = require('node:assert/strict');
const { EX } = require('../exercises.js');
const { figureSVG } = require('../figures.js');

test('every exercise has a name, cue, main muscles and poses', () => {
  Object.values(EX).forEach((e) => {
    assert.ok(e.name && e.cue, e.id);
    assert.ok(e.muscles.primary.length, e.id);
    assert.ok(e.poses.length >= 1, e.id);
  });
});

test('reps never go down from Level I to Level III', () => {
  Object.values(EX).forEach((e) => { assert.ok(e.r[0] <= e.r[1] && e.r[1] <= e.r[2], `${e.id}: ${e.r}`); });
});

test('every exercise draws a figure', () => {
  Object.values(EX).forEach((e) => { const svg = figureSVG(e); assert.match(svg, /^<svg class="fig"/, e.id); assert.ok(!/NaN/.test(svg), `${e.id} has NaN`); });
});

test('normalize: default unit, level, id, and muscles from the map or the exercise itself', () => {
  const { normalize } = require('../exercises.js');
  const ex = normalize({ a: { name: 'A' }, b: { name: 'B', u: 'sec', mus: 'quads' }, c: { name: 'C' } }, { a: 'chest triceps | front_delts', c: 'abs |' });
  assert.deepEqual(ex.a, { name: 'A', id: 'a', u: 'reps', lv: 1, muscles: { primary: ['chest', 'triceps'], secondary: ['front_delts'] } });
  assert.deepEqual(ex.b.muscles, { primary: ['quads'], secondary: [] });
  assert.equal(ex.b.u, 'sec');
  assert.deepEqual(ex.c.muscles.secondary, []);
});

test('normalize refuses an exercise with no main muscle', () => {
  const { normalize } = require('../exercises.js');
  assert.throws(() => normalize({ x: {}, y: {} }, { y: '| abs' }), /No muscles for: x, y/);
});

test('no exercise id is written twice (a second one would silently replace the first)', () => {
  const src = require('fs').readFileSync(require('path').join(__dirname, '../exercises.js'), 'utf8');
  // an entry, or a Phase 35 threesome row in TRIOS
  const ids = [...src.matchAll(/^ {4}(?:([a-z0-9_]+): \{ name:|\['([a-z0-9_]+)', '(?:[^'\\]|\\.)*', '(?:FMF|MMF)')/gm)].map((m) => m[1] || m[2]);
  assert.equal(ids.length, Object.keys(EX).length);
  assert.deepEqual(ids.filter((id, i) => ids.indexOf(id) !== i), []);
});

// Phase 24 ticket 12 (code review C3): what an exercise needs beyond its load is asked in one place
test('needs(e, gear): a bar move needs the bar; loaded and floor moves need none', () => {
  const { EX, needs } = require('../exercises.js');
  assert.equal(needs(EX.pullup, 'bar'), true);
  assert.equal(needs(EX.kb_swing, 'bar'), false);
  assert.equal(needs(EX.db_row, 'bar'), false);
  assert.equal(needs(EX.pushup, 'bar'), false);
  assert.equal(needs({ id: 'x' }, 'bar'), false);
});
