// Phase 20 ticket 5: catalogue 11 intercourse. Category `couple`, added: 11, pelvic mark on both figures,
// pool `fuck` only (a new name, so no catalogue-10 pool is reshuffled).
const test = require('node:test');
const assert = require('node:assert/strict');
const cat = require('../exercises.js');
const { figureSVG } = require('../figures.js');
const { POOLS } = require('../program-builder.js');

const ADDED = Object.values(cat.EX).filter((e) => e.added === 11);

test('24 intercourse positions, all couple, marked on both figures, with muscles and a one-paragraph cue', () => {
  assert.equal(ADDED.length, 24);
  ADDED.forEach((e) => {
    assert.equal(e.cat, 'couple', e.id);
    assert.equal(e.id.startsWith('fuck_'), true, e.id);
    assert.equal(e.u, 'sec', e.id);
    assert.equal(e.r.length, 3, e.id);
    e.r.forEach((n) => assert.ok(Number.isInteger(n) && n > 0, e.id));
    assert.equal(e.cue.includes('\n') || e.cue.includes('\r'), false, e.id);
    assert.ok(e.cue.length > 40 && e.cue.length <= 400, `${e.id} is ${e.cue.length}`);
    assert.ok(e.muscles.primary.length >= 1, e.id);
    [...e.muscles.primary, ...e.muscles.secondary].forEach((m) => assert.ok(cat.MUSCLE_NAMES[m], `${e.id}: ${m}`));
    assert.ok(e.poses.length >= 1, e.id);
    e.poses.forEach((p) => {
      assert.equal(p.mark, 1, e.id);
      assert.ok(p.two, `${e.id}: both figures`);
      assert.equal(p.two.mark, 1, e.id);
    });
    const svg = figureSVG(e);
    assert.equal((svg.match(/fill="var\(--mark\)"/g) || []).length, e.poses.length * 2, `${e.id}: mark on both`);
    assert.equal((svg.match(/fill="var\(--fig2\)"/g) || []).length, e.poses.length, e.id);
    assert.doesNotMatch(svg, /NaN/, e.id);
  });
});

test('fuck holds exactly the 24, and no earlier pool holds an added: 11 exercise', () => {
  assert.deepEqual([...POOLS.fuck].sort(), ADDED.map((e) => e.id).sort());
  assert.equal(new Set(POOLS.fuck).size, 24);
  Object.entries(POOLS).filter(([name]) => name !== 'fuck').forEach(([name, list]) => {
    list.forEach((id) => assert.notEqual(cat.EX[id] && cat.EX[id].added, 11, `${name} holds ${id}`));
  });
});
