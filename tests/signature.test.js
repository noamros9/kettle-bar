// Signature variations (Phase 6 ticket 3b): every signature program has two variations, Tempo and Harder moves. Same split,
// cycle, day types, time ranges and equipment as the original; only how it gets harder differs (docs/plans/phase-6-build-your-own.md).
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const { EX, allowedIn } = require('../exercises.js');
const { buildAll, CONFIGS, timing } = require('../program-builder.js');

const programs = buildAll();
const cfgOf = Object.fromEntries(CONFIGS.map((c) => [c.id, c]));
const progOf = Object.fromEntries(programs.map((p) => [p.id, p]));
const PINS = require('./fixtures/program-days.json');
const hasBar = (id) => (EX[id].equip || []).includes('bar');

const ORIGINALS = { 'three-split-60': 'Three-Split 60', 'four-split-60': 'Four-Split 60', 'two-split-60': 'Two-Split 60', 'five-split-60': 'Five-Split 60', 'full-body-duo-60': 'Full-Body Duo 60' };
const LEVERS = { tempo: ['Tempo', [null, 'tempo', 'tempo']], harder: ['Harder Moves', [null, 'variation', 'variation']] };
// [id, original id, kind]
const VARIATIONS = Object.keys(ORIGINALS).flatMap((o) => Object.keys(LEVERS).map((k) => [`${o}-${k}`, o, k]));
const TEMPO = VARIATIONS.filter((v) => v[2] === 'tempo'), HARDER = VARIATIONS.filter((v) => v[2] === 'harder');

const mainItems = (p, level) => p.days.filter((d) => d.level === level).flatMap((d) => d.blocks.filter((b) => b.kind === 'main').flatMap((b) => b.items));
const share = (items, fn) => items.filter(fn).length / items.length;

test('the ten variations: two per signature program, named "<original> Tempo" and "<original> Harder Moves"', () => {
  assert.equal(VARIATIONS.length, 10);
  VARIATIONS.forEach(([id, o, k]) => {
    const c = cfgOf[id];
    assert.ok(c, id);
    assert.equal(c.name, `${ORIGINALS[o]} ${LEVERS[k][0]}`);
    assert.equal(c.subject, 'Signature');
    assert.equal(c.added, 6, id);
    assert.ok(!c.frozen, `${id} is generated, not frozen`);
    assert.deepEqual(c.levers, LEVERS[k][1], id);
    assert.ok(c.blurb && c.blurb.length < 140, `${id}: a short blurb`);
    assert.ok(c.names.length === 20 && new Set(c.names).size === 20, `${id}: 20 day names`);
    const sentences = c.about.split(/(?<=[.!?])\s+/).length;
    assert.ok(sentences >= 3 && sentences <= 6, `${id}: about has ${sentences} sentences`);
    assert.notEqual(c.about, cfgOf[o].about, id);
  });
});

test('the four generated originals\' variations keep their split: cycle, day types, time ranges, abs, equipment, catalogue', () => {
  VARIATIONS.filter((v) => v[1] !== 'three-split-60').forEach(([id, o, kind]) => {
    const c = cfgOf[id], orig = cfgOf[o];
    assert.equal(c.split, orig.split, id);
    assert.deepEqual(c.cycle, orig.cycle, id);
    assert.deepEqual([c.minutes, c.absSlots, c.equip, c.catalogue], [orig.minutes, orig.absSlots, orig.equip, orig.catalogue], id);
    // Tempo: the day types are the original's, block for block. Harder moves may swap a few slots for pools with harder
    // versions (HARDER_SLOTS in configs/strength.js), but day types, times, blocks and the number of exercises (and which
    // are optional) stay.
    if (kind === 'tempo') return assert.deepEqual(c.dayTypes, orig.dayTypes, id);
    assert.deepEqual(Object.keys(c.dayTypes), Object.keys(orig.dayTypes), id);
    const shape = (t) => ({ label: t.label, short: t.short, minutes: t.minutes, blocks: t.blocks.map((b) => ({ ...b, slots: b.slots.map((sl) => sl.endsWith('?')) })) });
    Object.keys(orig.dayTypes).forEach((k) => assert.deepEqual(shape(c.dayTypes[k]), shape(orig.dayTypes[k]), `${id} ${k}`));
  });
});

test('only the three Harder moves variations whose pools had few harder versions swap slots; Four-Split 60\'s needs none', () => {
  const same = (id, o) => JSON.stringify(cfgOf[id].dayTypes) === JSON.stringify(cfgOf[o].dayTypes);
  assert.ok(same('four-split-60-harder', 'four-split-60'));
  ['two-split-60', 'five-split-60', 'full-body-duo-60'].forEach((o) => {
    assert.ok(same(`${o}-tempo`, o), o);
    assert.ok(!same(`${o}-harder`, o), o);
  });
});

test('Three-Split 60\'s variations are generated look-alikes: its day types, its 6-day cycle (upper focus on 2, 8, 14…, lower on 5, 11, 17…) and its time ranges', () => {
  const orig = cfgOf['three-split-60'];
  assert.ok(orig.frozen, 'the original stays frozen');
  VARIATIONS.filter((v) => v[1] === 'three-split-60').forEach(([id]) => {
    const c = cfgOf[id], p = progOf[id];
    assert.equal(c.split, orig.split, id);
    assert.deepEqual(Object.keys(c.dayTypes), Object.keys(orig.dayTypes), id);
    Object.keys(orig.dayTypes).forEach((k) => assert.deepEqual([c.dayTypes[k].label, c.dayTypes[k].short], [orig.dayTypes[k].label, orig.dayTypes[k].short], `${id} ${k}`));
    assert.deepEqual(c.cycle, ['cba', 'up', 'ac', 'cba', 'low', 'ac'], id);
    const types = p.days.map((d) => d.type);
    [1, 4, 7, 10].forEach((d) => assert.equal(types[d - 1], 'cba', `${id} d${d}`));
    [3, 6, 9, 12].forEach((d) => assert.equal(types[d - 1], 'ac', `${id} d${d}`));
    [2, 8, 14, 20].forEach((d) => assert.equal(types[d - 1], 'up', `${id} d${d}`));
    [5, 11, 17, 23].forEach((d) => assert.equal(types[d - 1], 'low', `${id} d${d}`));
    ['cba', 'up', 'low'].forEach((k) => assert.deepEqual(c.dayTypes[k].minutes, [34.5, 38.4], `${id} ${k}`));
    assert.deepEqual(c.dayTypes.ac.minutes, [25.5, 31.4], id);
    p.days.forEach((d) => assert.equal(d.title, orig.dayTypes[d.type].label, `${id} d${d.day}`));
  });
});

test('the variations: 60 days, each in its day type\'s time range, abs last (no bar), every exercise drawn, with muscles, and fitting the gear', () => {
  VARIATIONS.forEach(([id]) => {
    const p = progOf[id], c = cfgOf[id];
    assert.equal(p.days.length, 60, id);
    p.days.forEach((d) => {
      const [lo, hi] = c.dayTypes[d.type].minutes || c.minutes;
      const t = timing.dayTime(d.blocks, p.rests) / 60;
      assert.ok(t >= lo - 1 && t <= hi + 1.1, `${id} d${d.day}: ${t.toFixed(1)} min, want ${lo}-${hi}`);
      const abs = d.blocks.at(-1);
      assert.equal(abs.kind, 'abs', `${id} d${d.day}`);
      abs.items.forEach((it) => assert.ok(!hasBar(it.ex), `${id} d${d.day}: ${it.ex} uses the bar`));
      d.blocks.forEach((b) => b.items.forEach((it) => {
        const e = EX[it.ex];
        assert.ok(e && e.poses.length && e.muscles.primary.length, `${id} d${d.day}: ${it.ex}`);
        assert.ok(allowedIn(c.equip, e), `${id} d${d.day}: ${it.ex} does not fit the gear`);
      }));
    });
  });
});

test('the variations sit on the Signature shelf right after their original, and are pinned; no existing pin changed', () => {
  const sig = CONFIGS.filter((c) => c.subject === 'Signature').map((c) => c.id);
  assert.equal(sig.length, 15);
  assert.deepEqual(sig, Object.keys(ORIGINALS).flatMap((o) => [o, `${o}-tempo`, `${o}-harder`]));
  VARIATIONS.forEach(([id]) => {
    assert.match(PINS[id] || '', /^[0-9a-f]{64}$/, `${id}: run npm run pin`);
    assert.equal(PINS[id], crypto.createHash('sha256').update(JSON.stringify(progOf[id].days)).digest('hex'), id);
  });
  assert.equal(Object.keys(PINS).length, 138);
});

test('the Tempo variations: at Level III, at least 40% of the main-block exercises carry the 3 s lowering, and only Levels II and III do', () => {
  assert.equal(TEMPO.length, 5);
  TEMPO.forEach(([id]) => {
    const p = progOf[id];
    const tempoShare = (level) => share(mainItems(p, level), (it) => it.tempo === 1);
    assert.ok(tempoShare(3) >= 0.4, `${id}: ${(100 * tempoShare(3)).toFixed(0)}% at Level III`);
    assert.ok(tempoShare(2) >= 0.4, `${id}: ${(100 * tempoShare(2)).toFixed(0)}% at Level II`);
    assert.equal(tempoShare(1), 0, id);
    // held exercises never take it, and the note says what it is
    p.days.forEach((d) => d.blocks.forEach((b) => b.items.forEach((it) => {
      if (EX[it.ex].u === 'sec') assert.ok(!it.tempo, `${id} d${d.day}: ${it.ex} is held`);
      if (it.tempo) assert.equal(it.note, '3 s lowering');
    })));
    assert.deepEqual(p.levels.slice(1), ['Level II · Slow tempo', 'Level III · Slow tempo'], id);
  });
});

test('the Harder moves variations: at Level III, at least 25% of the main-block exercises are a harder variation, and only at Levels II and III', () => {
  assert.equal(HARDER.length, 5);
  HARDER.forEach(([id]) => {
    const p = progOf[id];
    const harderShare = (level) => share(mainItems(p, level), (it) => it.note === 'Harder variation');
    assert.ok(harderShare(3) >= 0.25, `${id}: ${(100 * harderShare(3)).toFixed(0)}% at Level III`);
    assert.ok(harderShare(2) >= 0.25, `${id}: ${(100 * harderShare(2)).toFixed(0)}% at Level II`);
    assert.equal(harderShare(1), 0, id);
    assert.ok(!mainItems(p, 3).some((it) => it.tempo), id);
    assert.deepEqual(p.levels.slice(1), ['Level II · Harder variations', 'Level III · Harder variations'], id);
  });
});
