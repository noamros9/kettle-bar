// Swaps: alternatives for an exercise, and the day as you'll do it once swaps apply.
const test = require('node:test');
const assert = require('node:assert/strict');
const cat = require('../exercises.js');
const { EX, allowedIn } = cat;
const { alternatives, applySwaps } = require('../app/swaps.js');

const block = (items, extra) => ({ title: 'Main', sets: 3, items: items.map((ex) => ({ ex, n: 10 })), ...extra });

test('alternatives work the same main muscle, are the same kind, fit the equipment and are not already in the block', () => {
  const b = block(['pushup', 'diamond_pushup']);
  const alts = alternatives('pushup', b, { equip: 'bw' }, cat);
  assert.ok(alts.length >= 2, alts.join());
  alts.forEach((id) => {
    const e = EX[id];
    assert.equal(e.muscles.primary[0], 'chest', id);
    assert.notEqual(e.u, 'sec', id);
    assert.ok(allowedIn('bw', e), id);
    assert.ok(!['pushup', 'diamond_pushup'].includes(id), id);
    assert.ok(!['warmup', 'cooldown'].includes(e.cat), id);
  });
});

test('holds swap only for holds; the abs block never gets the pull-up bar', () => {
  const holds = alternatives('plank', block(['plank'], { kind: 'abs' }), { equip: 'all' }, cat);
  assert.ok(holds.length > 0);
  holds.forEach((id) => { assert.equal(EX[id].u, 'sec', id); assert.ok(!(EX[id].equip || []).includes('bar'), id); });
  assert.ok(alternatives('pullup', block(['pullup']), { equip: 'all' }, cat).includes('chinup'), 'outside abs, bar swaps for bar');
  assert.deepEqual(alternatives('pullup', block(['pullup']), { equip: 'bw' }, cat).filter((id) => (EX[id].equip || []).includes('bar')), []);
});

test('an exercise with no match has no alternatives', () => {
  const lonely = Object.keys(EX).find((id) => !['warmup', 'cooldown'].includes(EX[id].cat) && alternatives(id, block([id]), { equip: 'all' }, cat).length === 0);
  assert.ok(lonely, 'the catalogue has some');
  assert.deepEqual(alternatives(lonely, block([lonely]), { equip: 'all' }, cat), []);
});

const day = { day: 5, level: 2, blocks: [block(['pushup', 'db_row']), { title: 'E', format: 'emom', minutes: 6, items: [{ ex: 'pushup', n: 8 }] }],
  warmup: { items: [{ ex: Object.keys(EX).find((id) => EX[id].cat === 'warmup'), n: 30 }] } };
day.blocks[0].items[0].note = 'Harder variation'; day.blocks[0].items[0].tempo = 1; day.blocks[0].items[0].sets = 4;

test('a today-only swap puts the new exercise in with its own reps for the level; sets stay, notes go', () => {
  const out = applySwaps(day, [{ day: 5, ex: 'pushup', to: 'pike_pushup' }], cat);
  assert.deepEqual(out.blocks[0].items[0], { ex: 'pike_pushup', n: EX.pike_pushup.r[1], sets: 4, swappedFrom: 'pushup' });
  assert.equal(out.blocks[1].items[0].n, Math.max(3, Math.round(EX.pike_pushup.r[1] * 0.5)), 'EMOM reps are halved as the builder does');
  assert.equal(out.blocks[0].items[1].ex, 'db_row', 'others untouched');
  assert.equal(day.blocks[0].items[0].ex, 'pushup', 'the program itself is not changed');
});

test('swaps for other days, or none, leave the day as it is', () => {
  assert.equal(applySwaps(day, [{ day: 6, ex: 'pushup', to: 'pike_pushup' }], cat), day);
  assert.equal(applySwaps(day, [], cat), day);
  assert.equal(applySwaps(day, undefined, cat), day);
});

test('a swap of a swap follows the chain, in the order they were made', () => {
  const out = applySwaps(day, [{ day: 5, ex: 'pushup', to: 'pike_pushup' }, { day: 5, ex: 'pike_pushup', to: 'diamond_pushup' }], cat);
  assert.equal(out.blocks[0].items[0].ex, 'diamond_pushup');
  assert.equal(out.blocks[0].items[0].swappedFrom, 'pushup');
});
