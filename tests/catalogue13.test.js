// Phase 22 (catalogue 13, docs/plans/phase-22-catalogue-13.md): the pools catalogue-13 exercises join, without
// moving anything an older catalogue draws.
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const cat = require('../exercises.js');
const { poolsAt, mergedAt } = require('../program-builder.js');
const { generate, NEWEST } = require('../recipe-book.js');
const { EX_FAMILIES } = require('../app/library.js');

const hash = (x) => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 16);
const KINDS = { sexRough: 'rough', sexKink: 'kink', sexBody: 'body', sexRim: 'rim' };
const added13 = (sub) => Object.values(cat.EX).filter((e) => e.added === 13 && (!sub || e.sub === sub)).map((e) => e.id);

test('the merged sex pools of catalogues 10 to 12 are as they were before Phase 22 (pinned)', () => {
  assert.equal(hash(mergedAt(10)), '3460ced71899c2b8');
  assert.equal(hash(mergedAt(11)), '53cc78427034f7ca');
  assert.equal(hash(mergedAt(12)), '53cc78427034f7ca');
});

test('each new kind has a pool of its own: its catalogue-13 exercises, empty below 13', () => {
  Object.entries(KINDS).forEach(([pool, sub]) => {
    assert.deepEqual(poolsAt(12)[pool], [], `${pool} at 12`);
    assert.deepEqual([...poolsAt(13)[pool]].sort(), added13(sub).sort(), `${pool} at 13`);
  });
});

test('at catalogue 13 the merged pools take the new exercises by role (decision 117)', () => {
  const at12 = mergedAt(12), at13 = mergedAt(13);
  const role = { sexFuck: ['fuck', 'anal', 'toys', 'rough', 'body'], sexWarm: ['oral', 'hands', 'kink', 'rim'] };
  Object.entries(role).forEach(([pool, subs]) => {
    assert.deepEqual(at13[pool].slice(0, at12[pool].length), at12[pool], `${pool} keeps its order`);
    assert.deepEqual([...at13[pool].slice(at12[pool].length)].sort(), subs.flatMap(added13).sort(), pool);
  });
  assert.deepEqual([...at13.sexPositions.slice(at12.sexPositions.length)].sort(), Object.values(KINDS).concat('fuck', 'oral', 'anal', 'toys', 'hands').flatMap(added13).sort());
});

test('own programs and random workouts stay at catalogue 12 while Phase 22 lands (decision 121)', () => {
  assert.equal(NEWEST, 12);
  cat.EX.fake_c13 = { id: 'fake_c13', added: 13 };
  try {
    const cfg = { id: 'tiny', subject: 'Yoga', minutes: [28, 32], levers: [null, 'holds', 'holds'], equip: 'bw', cycle: ['a'], names: ['x'],
      dayTypes: { a: { label: 'Only', short: 'Only', blocks: require('../program-builder.js').CONFIGS.find((c) => c.id === 'flow-state').dayTypes.a.blocks } } };
    assert.equal(generate({ configs: [cfg] }).catalogue, 12);
  } finally { delete cat.EX.fake_c13; }
});

test('the four new kinds are Couples subjects on the Exercises page', () => {
  const couples = EX_FAMILIES.find(([k]) => k === 'couples')[2].map(([k]) => k);
  ['rough', 'kink', 'body', 'rim'].forEach((k) => assert.ok(couples.includes(k), k));
});
