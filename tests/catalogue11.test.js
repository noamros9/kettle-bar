// Phase 20 tickets 5–6: catalogue 11. Every added: 11 exercise is category `couple`, timed, marked on
// both figures. Pools `fuck`, `oralSex` and `hands` are new names. Ticket 7 extends CATALOGUE_11_POOLS
// with `anal`, `toy` and `explicit`.
const test = require('node:test');
const assert = require('node:assert/strict');
const cat = require('../exercises.js');
const { figureSVG } = require('../figures.js');
const { POOLS } = require('../program-builder.js');

const ADDED = Object.values(cat.EX).filter((e) => e.added === 11);
const idsOf = (prefix) => ADDED.filter((e) => e.id.startsWith(prefix)).map((e) => e.id).sort();
// Ticket 7 adds anal, toy and explicit to this list.
const CATALOGUE_11_POOLS = ['fuck', 'oralSex', 'hands'];

test('every catalogue 11 exercise is couple, timed, marked on both figures, with muscles and a one-paragraph cue', () => {
  ADDED.forEach((e) => {
    assert.equal(e.cat, 'couple', e.id);
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

test('fuck, oralSex and hands hold exactly their ids, and no other pool holds an added: 11 exercise', () => {
  assert.deepEqual([...POOLS.fuck].sort(), idsOf('fuck_'));
  assert.equal(new Set(POOLS.fuck).size, 24);
  assert.deepEqual([...POOLS.oralSex].sort(), idsOf('oral_'));
  assert.equal(new Set(POOLS.oralSex).size, 24);
  assert.deepEqual([...POOLS.hands].sort(), idsOf('hands_'));
  assert.equal(new Set(POOLS.hands).size, 8);
  Object.entries(POOLS).filter(([name]) => !CATALOGUE_11_POOLS.includes(name)).forEach(([name, list]) => {
    list.forEach((id) => assert.notEqual(cat.EX[id] && cat.EX[id].added, 11, `${name} holds ${id}`));
  });
});
