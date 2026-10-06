// Phase 21 tickets 3–4: catalogue 12 warm-ups and cool-downs.
// Ticket 3: 24 new cat 'warmup' exercises, added: 12, eight each of dynamic, joints and activation.
// Catalogue 11 still draws the original six warm-ups.
// Ticket 4: 18 new cat 'cooldown' exercises, added: 12, twelve static and six breath.
// Catalogue 11 still draws the original twelve cool-downs.
const test = require('node:test');
const assert = require('node:assert/strict');
const cat = require('../exercises.js');
const { figureSVG } = require('../figures.js');
const { familyOf } = require('../app/library.js');
const { POOLS, poolsAt, CONFIGS, recipesOf, buildDay, newMemory, makeRnd } = require('../program-builder.js');

const SUBS = ['dynamic', 'joints', 'activation'];
const BEFORE = ['arm_circles', 'inchworm', 'cat_cow', 'leg_swings', 'bw_squat', 'worlds_greatest'];
const WARM = Object.values(cat.EX).filter((e) => e.cat === 'warmup');
const ADDED = WARM.filter((e) => e.added === 12);

test('30 warm-ups, 24 added at catalogue 12, eight per subject, each with poses and muscles', () => {
  assert.equal(WARM.length, 30);
  assert.equal(ADDED.length, 24);
  assert.deepEqual(WARM.filter((e) => !e.added).map((e) => e.id), BEFORE);
  ADDED.forEach((e) => {
    assert.ok(SUBS.includes(e.sub), `${e.id}: sub ${e.sub}`);
    assert.equal(familyOf(e).family, 'warmup', e.id);
    assert.equal(familyOf(e).subject, e.sub, e.id);
    assert.ok(e.poses.length >= 2, `${e.id}: poses move`);
    assert.ok(e.muscles.primary.length >= 1, e.id);
    [...e.muscles.primary, ...e.muscles.secondary].forEach((m) => assert.ok(cat.MUSCLE_NAMES[m], `${e.id}: ${m}`));
    assert.equal(e.load, undefined, e.id);
    assert.equal((e.equip || []).includes('bar'), false, e.id);
    assert.equal(e.cue.includes('\n') || e.cue.includes('\r'), false, e.id);
    assert.ok(e.cue.length > 20, e.id);
    assert.equal(e.r.length, 3, e.id);
    if (e.u === 'sec') e.r.forEach((n) => assert.ok(n >= 20 && n <= 40, `${e.id}: ${e.r}`));
    else {
      assert.equal(e.u, 'reps', e.id);
      e.r.forEach((n) => assert.ok(n >= 8 && n <= 15, `${e.id}: ${e.r}`));
    }
    const svg = figureSVG(e);
    assert.match(svg, /^<svg class="fig"/, e.id);
    assert.doesNotMatch(svg, /NaN/, e.id);
  });
  SUBS.forEach((sub) => assert.equal(ADDED.filter((e) => e.sub === sub).length, 8, sub));
});

test('a catalogue 11 config draws the same warm-ups as before; at catalogue 12 the pool holds 30', () => {
  for (let n = 0; n <= 11; n++) assert.deepEqual(poolsAt(n).warmups, BEFORE, `catalogue ${n}`);
  assert.equal(poolsAt(12).warmups.length, 30);
  assert.deepEqual(poolsAt(12).warmups.filter((id) => (cat.EX[id].added || 0) <= 11), BEFORE);
  assert.ok(poolsAt(11).mobility.every((id) => (cat.EX[id].added || 0) <= 11));
  assert.deepEqual(POOLS.warmups, BEFORE);

  const cfg = CONFIGS.find((c) => c.catalogue === 11);
  const rec = recipesOf(cfg)[cfg.cycle[0]];
  const day = buildDay(rec, { day: 1, level: 1, rnd: makeRnd(cfg.id), memory: newMemory() }, cat);
  assert.ok(day.warmup.items.length > 0, cfg.id);
  day.warmup.items.forEach((it) => assert.ok(BEFORE.includes(it.ex), `${cfg.id} draws ${it.ex}`));

  const at12 = { ...rec, catalogue: 12 };
  const later = buildDay(at12, { day: 1, level: 1, rnd: makeRnd(cfg.id), memory: newMemory() }, cat);
  later.warmup.items.forEach((it) => assert.equal(cat.EX[it.ex].cat, 'warmup', it.ex));
  assert.equal(poolsAt(12).warmups.length, 30);
});

const COOL_SUBS = ['static', 'breath'];
const COOL_BEFORE = ['chest_opener', 'cross_body_shoulder', 'overhead_triceps', 'childs_pose', 'cobra_stretch', 'seated_forward_fold', 'standing_quad', 'kneeling_hip_flexor', 'knee_hug', 'butterfly', 'down_dog', 'standing_side_stretch'];
const COOL = Object.values(cat.EX).filter((e) => e.cat === 'cooldown');
const COOL_NEW = COOL.filter((e) => e.added === 12);

test('30 cool-downs, 18 added at catalogue 12, twelve static and six breath, each with poses and muscles', () => {
  assert.equal(COOL.length, 30);
  assert.equal(COOL_NEW.length, 18);
  assert.deepEqual(COOL.filter((e) => !e.added).map((e) => e.id), COOL_BEFORE);
  COOL_NEW.forEach((e) => {
    assert.ok(COOL_SUBS.includes(e.sub), `${e.id}: sub ${e.sub}`);
    assert.equal(familyOf(e).family, 'stretch', e.id);
    assert.equal(familyOf(e).subject, e.sub, e.id);
    assert.equal(e.u, 'sec', e.id);
    assert.equal(e.r.length, 3, e.id);
    if (e.sub === 'breath') {
      assert.ok(e.poses.length >= 1, `${e.id}: a still pose`);
      e.r.forEach((n) => assert.ok(n >= 60 && n <= 90, `${e.id}: ${e.r}`));
    } else {
      assert.ok(e.poses.length >= 2, `${e.id}: poses move`);
      assert.notDeepEqual(e.poses[0], e.poses[1], `${e.id}: the two poses differ`);
      if (e.side) e.r.forEach((n) => assert.ok(n >= 15 && n <= 30, `${e.id}: ${e.r}`));
      else e.r.forEach((n) => assert.ok(n >= 30 && n <= 60, `${e.id}: ${e.r}`));
    }
    assert.ok(e.muscles.primary.length >= 1, e.id);
    [...e.muscles.primary, ...e.muscles.secondary].forEach((m) => assert.ok(cat.MUSCLE_NAMES[m], `${e.id}: ${m}`));
    assert.equal(e.load, undefined, e.id);
    assert.equal((e.equip || []).includes('bar'), false, e.id);
    assert.equal(e.cue.includes('\n') || e.cue.includes('\r'), false, e.id);
    assert.ok(e.cue.length > 20, e.id);
    const svg = figureSVG(e);
    assert.match(svg, /^<svg class="fig"/, e.id);
    assert.doesNotMatch(svg, /NaN/, e.id);
  });
  assert.equal(COOL_NEW.filter((e) => e.sub === 'static').length, 12);
  assert.equal(COOL_NEW.filter((e) => e.sub === 'breath').length, 6);
});

test('a catalogue 11 config draws the same cool-downs as before; at catalogue 12 the pool holds 30', () => {
  for (let n = 0; n <= 11; n++) assert.deepEqual(poolsAt(n).cooldowns, COOL_BEFORE, `catalogue ${n}`);
  assert.equal(poolsAt(12).cooldowns.length, 30);
  assert.deepEqual(poolsAt(12).cooldowns.filter((id) => (cat.EX[id].added || 0) <= 11), COOL_BEFORE);
  assert.deepEqual(POOLS.cooldowns, COOL_BEFORE);

  const cfg = CONFIGS.find((c) => c.catalogue === 11);
  const rec = recipesOf(cfg)[cfg.cycle[0]];
  const day = buildDay(rec, { day: 1, level: 1, rnd: makeRnd(cfg.id), memory: newMemory() }, cat);
  assert.ok(day.cooldown.items.length > 0, cfg.id);
  day.cooldown.items.forEach((it) => assert.ok(COOL_BEFORE.includes(it.ex), `${cfg.id} draws ${it.ex}`));

  const at12 = { ...rec, catalogue: 12 };
  const later = buildDay(at12, { day: 1, level: 1, rnd: makeRnd(cfg.id), memory: newMemory() }, cat);
  later.cooldown.items.forEach((it) => assert.equal(cat.EX[it.ex].cat, 'cooldown', it.ex));
  assert.equal(poolsAt(12).cooldowns.length, 30);
});
