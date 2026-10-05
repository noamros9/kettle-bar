// Phase 18 ticket 2: catalogue 10, the couple exercises: partner moves, teasing, dares and positions. Category `couple`,
// two-figure drawings, never in a solo pool, swapped only for another couple exercise.
const test = require('node:test');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const cat = require('../exercises.js');
const { figureSVG } = require('../figures.js');
const { POOLS } = require('../program-builder.js');
const Swaps = require('../app/swaps.js');

const COUPLE = Object.values(cat.EX).filter((e) => e.cat === 'couple');
const ids = new Set(COUPLE.map((e) => e.id));
const NEW_POOLS = ['partner', 'partnerLower', 'partnerUpper', 'partnerCore', 'partnerHold', 'tease', 'dare', 'massage', 'positions', 'positionsBed', 'positionsStanding', 'positionsHer', 'positionsSlow', 'oral'];

test('about 40 couple exercises, all catalogue 10, and every catalogue 10 exercise is a couple one', () => {
  assert.ok(COUPLE.length >= 40, `${COUPLE.length}`);
  COUPLE.forEach((e) => assert.equal(e.added, 10, e.id));
  Object.values(cat.EX).filter((e) => e.added === 10).forEach((e) => assert.equal(e.cat, 'couple', e.id));
});

test('each has a cue, three levels, known muscles and two-figure poses that draw', () => {
  COUPLE.forEach((e) => {
    assert.ok(e.cue.length > 40, e.id);
    assert.equal(e.r.length, 3, e.id);
    e.r.forEach((n) => assert.ok(Number.isInteger(n) && n > 0, e.id));
    [...e.muscles.primary, ...e.muscles.secondary].forEach((m) => assert.ok(cat.MUSCLE_NAMES[m], `${e.id}: ${m}`));
    assert.ok(e.poses.length >= 1 && e.poses.every((p) => p.two), `${e.id}: every pose has a partner`);
    const svg = figureSVG(e);
    assert.equal((svg.match(/fill="var\(--fig2\)"/g) || []).length, e.poses.length, `${e.id}: one partner per pose`);
    assert.doesNotMatch(svg, /NaN/, e.id);
  });
});

test('the new pools hold only couple exercises, and no other pool holds one', () => {
  NEW_POOLS.forEach((name) => {
    assert.ok(POOLS[name] && POOLS[name].length >= 2, name);
    POOLS[name].forEach((id) => assert.ok(ids.has(id), `${name}: ${id}`));
  });
  Object.entries(POOLS).filter(([name]) => !NEW_POOLS.includes(name)).forEach(([name, list]) => list.forEach((id) => assert.ok(!ids.has(id), `${name} holds ${id}`)));
  const inAPool = new Set(NEW_POOLS.flatMap((n) => POOLS[n]));
  COUPLE.forEach((e) => assert.ok(inAPool.has(e.id), `${e.id} is in no pool`));
});

test('the Swap list: never a couple exercise for a solo one; only couple ones for a couple one', () => {
  const program = { equip: 'all' };
  ['goblet_squat', 'pushup', 'glute_bridge', 'plank', 'wall_sit'].forEach((id) => {
    Swaps.alternatives(id, { items: [{ ex: id }] }, program, cat).forEach((o) => assert.notEqual(cat.EX[o].cat, 'couple', `${id} -> ${o}`));
  });
  ['partner_squat', 'pos_missionary', 'slow_dance'].forEach((id) => {
    const alts = Swaps.alternatives(id, { items: [{ ex: id }] }, program, cat, null, 2);
    alts.forEach((o) => assert.equal(cat.EX[o].cat, 'couple', `${id} -> ${o}`));
  });
});

// Phase 20 ticket 2. Hash is sha256 of every non-couple cue, sorted by id, JSON-encoded, pinned before the rewrite.
const NON_COUPLE_CUES = 'c3134b2e04221ff520e0b1d1465d3df2843ee2647738e0dfe1d27ed992a63d08';

test('position and dare cues are one paragraph of at most 400 characters; every non-couple cue is unchanged', () => {
  const pos = Object.values(cat.EX).filter((e) => e.id.startsWith('pos_'));
  const dare = Object.values(cat.EX).filter((e) => e.id.startsWith('dare_'));
  assert.equal(pos.length, 17);
  assert.equal(dare.length, 7);
  [...pos, ...dare].forEach((e) => {
    assert.equal(e.cue.includes('\n') || e.cue.includes('\r'), false, e.id);
    assert.ok(e.cue.length <= 400, `${e.id} is ${e.cue.length}`);
  });
  const cues = Object.values(cat.EX).filter((e) => e.cat !== 'couple').sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)).map((e) => e.cue);
  assert.equal(createHash('sha256').update(JSON.stringify(cues)).digest('hex'), NON_COUPLE_CUES);
});
