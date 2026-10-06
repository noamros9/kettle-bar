// Phase 20 tickets 5–7: catalogue 11. Category `couple`, added: 11, pelvic mark on both figures.
// Named pools `fuck`, `anal`, `toy`. `explicit` is computed from added === 11 (empty below catalogue 11).
// Named pools `oralSex` and `hands` are ticket 6.
const test = require('node:test');
const assert = require('node:assert/strict');
const cat = require('../exercises.js');
const { figureSVG } = require('../figures.js');
const { POOLS, poolsAt } = require('../program-builder.js');

const ADDED = Object.values(cat.EX).filter((e) => e.added === 11);
const CATALOGUE11 = ['fuck', 'anal', 'toy', 'explicit', 'oralSex', 'hands'];
const idsStarting = (prefix) => Object.keys(cat.EX).filter((id) => id.startsWith(prefix) && cat.EX[id].added === 11).sort();

test('every catalogue 11 exercise is couple, timed, marked on both figures, with muscles and a one-paragraph cue', () => {
  assert.equal(ADDED.length, 88);
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

test('fuck, oralSex, hands, anal and toy hold exactly their ids', () => {
  assert.deepEqual([...POOLS.oralSex].sort(), idsStarting('oral_'));
  assert.equal(new Set(POOLS.oralSex).size, 24);
  assert.deepEqual([...POOLS.hands].sort(), idsStarting('hands_'));
  assert.equal(new Set(POOLS.hands).size, 8);
  assert.deepEqual([...POOLS.fuck].sort(), idsStarting('fuck_'));
  assert.equal(new Set(POOLS.fuck).size, 24);
  assert.deepEqual([...POOLS.anal].sort(), idsStarting('anal_'));
  assert.equal(new Set(POOLS.anal).size, 24);
  assert.deepEqual([...POOLS.toy].sort(), idsStarting('toy_'));
  assert.equal(new Set(POOLS.toy).size, 8);
  ['fuck', 'oralSex', 'hands', 'anal', 'toy'].forEach((name) => {
    POOLS[name].forEach((id) => assert.equal(cat.EX[id].added, 11, id));
  });
});

test('each toy is named in at least two toy exercises, and no anal or toy cue puts anything in him', () => {
  const toys = POOLS.toy.map((id) => cat.EX[id]);
  ['wand', 'plug', 'strap-on', 'cock ring'].forEach((word) => {
    const n = toys.filter((e) => `${e.name} ${e.cue}`.toLowerCase().includes(word)).length;
    assert.ok(n >= 2, `${word} in ${n}`);
  });
  // Pegging, or anything in his ass. "She grabs his ass" is not this; "in his ass" is.
  const inHim = /pegging|pegged|\bpegs\b|\bpeg\b|in his ass|into his ass|up his ass|his asshole|his hole|fucks him|fuck him|fucking him|inside him|into him|\bin him\b/;
  [...POOLS.anal, ...POOLS.toy].forEach((id) => {
    const text = `${cat.EX[id].name} ${cat.EX[id].cue}`.toLowerCase();
    assert.equal(inHim.test(text), false, `${id}: ${text}`);
  });
});

test('explicit at catalogue 11 is every added: 11 exercise, and no other pool holds one', () => {
  assert.deepEqual([...poolsAt(11).explicit].sort(), ADDED.map((e) => e.id).sort());
  assert.deepEqual(poolsAt(10).explicit, []);
  const at11 = { ...POOLS, ...poolsAt(11) };
  Object.entries(at11).filter(([name]) => !CATALOGUE11.includes(name)).forEach(([name, list]) => {
    list.forEach((id) => assert.notEqual(cat.EX[id] && cat.EX[id].added, 11, `${name} holds ${id}`));
  });
});
