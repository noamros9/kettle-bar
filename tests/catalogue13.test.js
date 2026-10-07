// Phase 22 (catalogue 13, docs/plans/phase-22-catalogue-13.md): the pools catalogue-13 exercises join, without
// moving anything an older catalogue draws.
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const cat = require('../exercises.js');
const { figureSVG } = require('../figures.js');
const { poolsAt, mergedAt } = require('../program-builder.js');
const { generate, NEWEST } = require('../recipe-book.js');
const { EX_FAMILIES } = require('../app/library.js');

const hash = (x) => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 16);
const KINDS = { sexRough: 'rough', sexKink: 'kink', sexBody: 'body', sexRim: 'rim', sexEdging: 'edging', sexMassage: 'massage', sexTease: 'tease',
  sexShower: 'shower', sexPool: 'pool', sexHottub: 'hottub', sexBalcony: 'balcony', sexDoorframe: 'doorframe' };
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
  const role = { sexFuck: ['fuck', 'anal', 'toys', 'rough', 'body', 'edging', 'shower', 'pool', 'hottub', 'balcony', 'doorframe'],
    sexWarm: ['oral', 'hands', 'kink', 'rim', 'massage', 'tease'] };
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

test('the new kinds are Couples subjects on the Exercises page; tease shows as Strip and tease', () => {
  const couples = Object.fromEntries(EX_FAMILIES.find(([k]) => k === 'couples')[2]);
  ['rough', 'kink', 'body', 'rim', 'edging', 'shower', 'pool', 'hottub', 'balcony', 'doorframe'].forEach((k) => assert.ok(couples[k], k));
  assert.equal(couples.tease, 'Strip and tease');
});

test('catalogue 13 adds 91 intercourse exercises (tickets 2–4b)', () => {
  const added = Object.values(cat.EX).filter((e) => e.added === 13 && e.sub === 'fuck');
  assert.equal(added.length, 91);
  const at12 = mergedAt(12), at13 = mergedAt(13);
  added.forEach((e) => {
    assert.equal(e.cat, 'couple', e.id);
    assert.ok(e.id.startsWith('fuck_'), e.id);
    assert.equal('basic' in e, false, e.id);
    assert.equal(e.u, 'sec', e.id);
    assert.equal(e.r.length, 3, e.id);
    e.r.forEach((n) => assert.ok(Number.isInteger(n) && n > 0, e.id));
    assert.equal(e.cue.includes('\n') || e.cue.includes('\r'), false, e.id);
    assert.ok(e.cue.length > 40 && e.cue.length <= 400, `${e.id} is ${e.cue.length}`);
    assert.ok(e.mus, e.id);
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
    assert.ok(at13.sexFuck.includes(e.id), `${e.id} in sexFuck`);
    assert.ok(at13.sexPositions.includes(e.id), `${e.id} in sexPositions`);
    assert.equal(at12.sexFuck.includes(e.id), false, e.id);
    assert.equal(at12.sexPositions.includes(e.id), false, e.id);
  });
});

test('catalogue 13 adds 23 oral exercises (ticket 5)', () => {
  const added = Object.values(cat.EX).filter((e) => e.added === 13 && e.sub === 'oral');
  assert.equal(added.length, 23);
  const at12 = mergedAt(12), at13 = mergedAt(13);
  added.forEach((e) => {
    assert.equal(e.cat, 'couple', e.id);
    assert.ok(e.id.startsWith('oral_'), e.id);
    assert.equal('basic' in e, false, e.id);
    assert.equal(e.u, 'sec', e.id);
    assert.equal(e.r.length, 3, e.id);
    e.r.forEach((n) => assert.ok(Number.isInteger(n) && n > 0, e.id));
    assert.equal(e.cue.includes('\n') || e.cue.includes('\r'), false, e.id);
    assert.ok(e.cue.length > 40 && e.cue.length <= 400, `${e.id} is ${e.cue.length}`);
    assert.ok(e.mus, e.id);
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
    assert.ok(at13.sexWarm.includes(e.id), `${e.id} in sexWarm`);
    assert.ok(at13.sexPositions.includes(e.id), `${e.id} in sexPositions`);
    assert.equal(at12.sexWarm.includes(e.id), false, e.id);
    assert.equal(at12.sexPositions.includes(e.id), false, e.id);
  });
});

test('catalogue 13 adds 30 anal exercises (ticket 6)', () => {
  const added = Object.values(cat.EX).filter((e) => e.added === 13 && e.sub === 'anal');
  assert.equal(added.length, 30);
  const at12 = mergedAt(12), at13 = mergedAt(13);
  added.forEach((e) => {
    assert.equal(e.cat, 'couple', e.id);
    assert.ok(e.id.startsWith('anal_'), e.id);
    assert.equal('basic' in e, false, e.id);
    assert.equal(e.u, 'sec', e.id);
    assert.equal(e.r.length, 3, e.id);
    e.r.forEach((n) => assert.ok(Number.isInteger(n) && n > 0, e.id));
    assert.equal(e.cue.includes('\n') || e.cue.includes('\r'), false, e.id);
    assert.ok(e.cue.length > 40 && e.cue.length <= 400, `${e.id} is ${e.cue.length}`);
    assert.ok(e.mus, e.id);
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
    assert.ok(at13.sexFuck.includes(e.id), `${e.id} in sexFuck`);
    assert.ok(at13.sexPositions.includes(e.id), `${e.id} in sexPositions`);
    assert.equal(at12.sexFuck.includes(e.id), false, e.id);
    assert.equal(at12.sexPositions.includes(e.id), false, e.id);
  });
});
