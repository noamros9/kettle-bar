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

// ---------- rest of the program, and undo ----------
const { undoSwap } = require('../app/swaps.js');
const on = (n) => ({ ...day, day: n });

test('"rest of the program" applies from that day on, not before', () => {
  const swaps = [{ day: 10, ex: 'pushup', to: 'pike_pushup', onward: true }];
  assert.equal(applySwaps(on(9), swaps, cat).blocks[0].items[0].ex, 'pushup');
  assert.equal(applySwaps(on(10), swaps, cat).blocks[0].items[0].ex, 'pike_pushup');
  assert.equal(applySwaps(on(60), swaps, cat).blocks[0].items[0].ex, 'pike_pushup');
});

test('a later today-only swap on top of it wins for that day only', () => {
  const swaps = [{ day: 10, ex: 'pushup', to: 'pike_pushup', onward: true }, { day: 20, ex: 'pike_pushup', to: 'diamond_pushup' }];
  assert.equal(applySwaps(on(20), swaps, cat).blocks[0].items[0].ex, 'diamond_pushup');
  assert.equal(applySwaps(on(21), swaps, cat).blocks[0].items[0].ex, 'pike_pushup');
});

test('undo removes the swap that made the card, one step at a time; others stay', () => {
  const onward = { day: 10, ex: 'pushup', to: 'pike_pushup', onward: true };
  const today = { day: 20, ex: 'pike_pushup', to: 'diamond_pushup' };
  const other = { day: 20, ex: 'db_row', to: 'renegade_row' };
  assert.deepEqual(undoSwap([onward, today, other], 20, 'diamond_pushup'), [onward, other]);
  assert.deepEqual(undoSwap([onward, other], 15, 'pike_pushup'), [other], 'an onward swap is removed for every day');
  assert.deepEqual(undoSwap([onward], 9, 'pike_pushup'), [onward], 'nothing to undo on a day it does not reach');
});

test('swapBehind names the swap that put an exercise on a day; undo removes exactly that one', () => {
  const { swapBehind } = require('../app/swaps.js');
  const onward = { day: 10, ex: 'pushup', to: 'pike_pushup', onward: true };
  const today = { day: 20, ex: 'pike_pushup', to: 'diamond_pushup' };
  assert.deepEqual(swapBehind([onward, today], 20, 'diamond_pushup'), today);
  assert.deepEqual(swapBehind([onward, today], 15, 'pike_pushup'), onward);
  assert.equal(swapBehind([onward], 9, 'pike_pushup'), undefined);
});

test('guided kinds swap only for their own kind, and are never offered for anything else', () => {
  const cat = require('../exercises.js'), E = cat.EX, prog = { equip: 'all' };
  const yoga = alternatives('warrior_two', { items: [{ ex: 'warrior_two' }] }, prog, cat);
  assert.ok(yoga.length > 0);
  yoga.forEach((id) => assert.equal(E[id].cat, 'yoga', id));
  const squat = alternatives('goblet_squat', { items: [{ ex: 'goblet_squat' }] }, prog, cat);
  assert.ok(squat.length > 0);
  squat.forEach((id) => assert.notEqual(E[id].cat, 'yoga', id));
});
