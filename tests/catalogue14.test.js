// Phase 23 ticket 1c (catalogue 14, decisions 235 and 237): yoga and Pilates exercises doubled, Yin holds and
// kettlebell Pilates among them. They join the pools only at catalogue 14, so nothing built before moves.
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const cat = require('../exercises.js');
const { figureSVG } = require('../figures.js');
const { poolsAt } = require('../program-builder.js');
const { familyOf } = require('../app/library.js');
const { NEWEST } = require('../recipe-book.js');

const hash = (x) => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 16);
const all = Object.values(cat.EX);
const added14 = all.filter((e) => e.added === 14);
const of = (c) => all.filter((e) => e.cat === c);

test('yoga and Pilates double on their count after Phase 22: 44 → 88 and 33 → 66', () => {
  assert.equal(of('yoga').filter((e) => e.added !== 14).length, 44);
  assert.equal(of('pilates').filter((e) => e.added !== 14).length, 33);
  assert.ok(of('yoga').length >= 88, `${of('yoga').length} yoga`);
  assert.ok(of('pilates').length >= 66, `${of('pilates').length} pilates`);
  assert.deepEqual([...new Set(added14.map((e) => e.cat))].sort(), ['pilates', 'yoga']);
});

test('every new one: added 14, a figure that draws, muscles, a cue, reps or holds for three levels, a family', () => {
  added14.forEach((e) => {
    assert.ok(e.poses.length >= 1, e.id);
    const svg = figureSVG(e, e.name);
    assert.ok(svg.startsWith('<svg') && !/NaN|undefined/.test(svg), `${e.id} draws`);
    assert.ok(e.muscles.primary.length, `${e.id} muscles`);
    assert.ok(e.cue.length > 30, `${e.id} cue`);
    assert.equal(e.r.length, 3, `${e.id} levels`);
    assert.deepEqual(familyOf(e), { family: 'mind', subject: e.cat }, e.id);
  });
});

test('Yin poses: twelve long passive holds, 1 to 2 minutes; kettlebell Pilates: ten moves with a bell', () => {
  const yin = poolsAt(14).ygYin;
  assert.equal(yin.length, 12);
  yin.forEach((id) => { const e = cat.EX[id]; assert.equal(e.u, 'sec', id); assert.ok(e.r[0] >= 60 && e.r[2] <= 180, id); });
  const kb = poolsAt(14).plKb;
  assert.equal(kb.length, 10);
  kb.forEach((id) => { assert.equal(cat.EX[id].load, 'kb', id); assert.ok(cat.EX[id].poses.every((p) => p.kb), `${id} holds the bell`); });
});

test('they join the pools only at catalogue 14: catalogue 13 is exactly as before, and every new one is in a pool at 14', () => {
  assert.equal(hash(poolsAt(13)), '93717a447ed31b92');
  assert.deepEqual(poolsAt(13).ygYin, undefined);
  const at14 = new Set(Object.values(poolsAt(14)).flat());
  added14.forEach((e) => assert.ok(at14.has(e.id), `${e.id} is drawn somewhere`));
  Object.entries(poolsAt(13)).forEach(([name, list]) => assert.deepEqual(poolsAt(14)[name].slice(0, list.length), list, `${name} keeps its order`));
});

test('own programs and random workouts stay at catalogue 13 until the phase\'s last ticket (264)', () => {
  assert.equal(NEWEST, 13);
});
