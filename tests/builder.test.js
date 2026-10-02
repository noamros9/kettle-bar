// Program Builder invariants for every program and every day.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { EX } = require('../exercises.js');
const { buildAll, CONFIGS, timing } = require('../program-builder.js');

const programs = require('./helpers/library.js').library();
const hasBar = (id) => (EX[id].equip || []).includes('bar');

test('every program has 60 days, unique ids', () => {
  assert.equal(programs.length, CONFIGS.length);
  assert.equal(new Set(programs.map((p) => p.id)).size, programs.length);
  programs.forEach((p) => assert.equal(p.days.length, 60, p.id));
});

test('Three-Split 60 stays exactly as saved', () => {
  const saved = JSON.parse(fs.readFileSync(path.join(__dirname, '../programs/three-split-60.json'), 'utf8'));
  assert.deepEqual(programs.find((p) => p.id === 'three-split-60').days, saved.days);
});

test('every exercise used exists; abs come last without the pull-up bar (or not at all with absSlots: [])', () => {
  const cfgOf = Object.fromEntries(CONFIGS.map((c) => [c.id, c]));
  // a day type's absSlots win over the program's (mixed days: the ones that end in a flow have none)
  const noAbs = (p, d) => { const c = cfgOf[p.id], t = c.dayTypes[d.type]; return ((t && t.absSlots) || c.absSlots || ['x']).length === 0; };
  programs.forEach((p) => p.days.forEach((d) => {
    d.blocks.forEach((b) => b.items.forEach((it) => assert.ok(EX[it.ex], `${p.id} d${d.day}: ${it.ex}`)));
    if (noAbs(p, d)) { assert.ok(d.blocks.every((b) => b.kind !== 'abs'), `${p.id} d${d.day} has abs`); return; }
    const abs = d.blocks.at(-1);
    assert.equal(abs.kind, 'abs', `${p.id} d${d.day}`);
    abs.items.forEach((it) => assert.ok(!hasBar(it.ex), `${p.id} d${d.day}: ${it.ex} uses the bar`));
  }));
});

test('equipment rules: kettlebell-only and bodyweight programs', () => {
  programs.filter((p) => p.equip !== 'all').forEach((p) => p.days.forEach((d) => d.blocks.forEach((b) => b.items.forEach((it) => {
    const e = EX[it.ex];
    if (p.equip === 'kb') assert.ok((!e.load || e.load === 'kb') && !hasBar(it.ex), `${p.id}: ${it.ex}`);
    if (p.equip === 'bw') assert.ok(!e.load && !hasBar(it.ex), `${p.id}: ${it.ex}`);
  }))));
});

test('generated days land in their time range (within a minute of rounding)', () => {
  const cfg = Object.fromEntries(CONFIGS.map((c) => [c.id, c]));
  programs.filter((p) => !cfg[p.id].frozen).forEach((p) => p.days.forEach((d) => {
    const [lo, hi] = cfg[p.id].dayTypes[d.type].minutes || cfg[p.id].minutes;
    const t = timing.dayTime(d.blocks, p.rests) / 60;
    assert.ok(t >= lo - 1 && t <= hi + 1.1, `${p.id} d${d.day}: ${t.toFixed(1)} min, want ${lo}-${hi}`);
  }));
});

test('every day has a ~1 min warm-up and ~2 min cool-down', () => {
  programs.forEach((p) => p.days.forEach((d) => {
    assert.ok(d.warmup.seconds >= 60 && d.warmup.seconds <= 75, `${p.id} d${d.day} warm-up ${d.warmup.seconds}`);
    assert.ok(d.cooldown.seconds >= 120 && d.cooldown.seconds <= 135, `${p.id} d${d.day} cool-down ${d.cooldown.seconds}`);
  }));
});

// Edges of the builder, on configs derived from real ones.
const base = () => JSON.parse(JSON.stringify(CONFIGS.find((c) => c.id === 'twenty-flat')));
const { buildConfig: build } = require('../program-builder.js'); // Node: frozen-aware

test('a slot with nothing usable for the equipment is a config error', () => {
  const cfg = { ...base(), equip: 'bw' };
  cfg.dayTypes.a.blocks[0].slots = ['kb_swing'];
  assert.throws(() => build(cfg), /twenty-flat: pool kb_swing is empty/);
});

test('when a pool runs out within a day, an exercise may repeat', () => {
  const cfg = base();
  cfg.dayTypes.a.blocks[0].slots = ['pushup', 'pushup', 'squat', 'row'];
  const d1 = build(cfg).days[0];
  assert.deepEqual(d1.blocks[0].items.slice(0, 2).map((it) => it.ex), ['pushup', 'pushup']);
});

test('a frozen program takes its equipment from the config, default all', () => {
  const frozen = CONFIGS.find((c) => c.frozen);
  assert.equal(build(frozen).equip, 'all');
  assert.equal(build({ ...frozen, equip: 'kb' }).equip, 'kb');
});

test('an unknown format has no time', () => {
  assert.throws(() => timing.blockTime({ format: 'yoga', items: [] }), /format yoga/);
});

test('the builder runs without Node: build(config, catalogue) in a sandbox with no require or fs, after formats.js', () => {
  const vm = require('vm');
  const src = fs.readFileSync(path.join(__dirname, '../program-builder.js'), 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../formats.js'), 'utf8'), sandbox); // the page loads formats.js first
  vm.runInNewContext(src, sandbox);
  const cat = require('../exercises.js');
  const cfg = CONFIGS.find((c) => c.id === 'iron-ppl');
  const inPage = sandbox.window.KBBuilder.build(cfg, cat);
  assert.equal(JSON.stringify(inPage), JSON.stringify(programs.find((p) => p.id === 'iron-ppl')));
  assert.throws(() => sandbox.window.KBBuilder.build(CONFIGS.find((c) => c.frozen), cat), /frozen/);
});

test('build(config, catalogue) in Node gives the same program; a frozen config is refused', () => {
  const B = require('../program-builder.js'), cat = require('../exercises.js');
  assert.equal(JSON.stringify(B.build(CONFIGS.find((c) => c.id === 'engine'), cat)), JSON.stringify(programs.find((p) => p.id === 'engine')));
  assert.throws(() => B.build(CONFIGS.find((c) => c.frozen), cat), /three-split-60 is frozen/);
});

test('every program has a hand-written paragraph: 3–6 sentences, the first short enough for a card', () => {
  const sentences = (t) => t.match(/[^.!?]+[.!?]+(\s|$)/g) || [];
  programs.forEach((p) => {
    assert.equal(typeof p.about, 'string', p.id);
    const s = sentences(p.about);
    assert.ok(s.length >= 3 && s.length <= 6, `${p.id}: ${s.length} sentences`);
    assert.ok(s[0].trim().length <= 130, `${p.id}: first sentence is ${s[0].trim().length} characters`);
  });
});

// The pin: days people are halfway through never change. Each existing program's days are hashed in
// tests/fixtures/program-days.json; new exercises (added: 5) stay out of the computed pools unless a config
// opts in with catalogue: 5.
const crypto = require('crypto');
const PINS = require('./fixtures/program-days.json');
const hashDays = (p) => crypto.createHash('sha256').update(JSON.stringify(p.days)).digest('hex');
const unpinned = (list) => Object.entries(PINS).filter(([id]) => list.some((p) => p.id === id) && hashDays(list.find((p) => p.id === id)) !== PINS[id]).map(([id]) => id);

test('every program is pinned (npm run pin), and its days match the saved hash', () => {
  assert.deepEqual(programs.filter((p) => !PINS[p.id]).map((p) => p.id), [], 'run npm run pin for new programs');
  Object.keys(PINS).forEach((id) => assert.ok(programs.find((p) => p.id === id), `${id} is missing`));
  assert.deepEqual(unpinned(programs), []);
});

// a catalogue with one more abs exercise, warm-up and cool-down (copies of real ones under new ids)
const cat = require('../exercises.js');
function withNew(added) {
  const extra = { zz_crunch: 'crunch', zz_warm: Object.keys(EX).find((k) => EX[k].cat === 'warmup'), zz_cool: Object.keys(EX).find((k) => EX[k].cat === 'cooldown') };
  const ex = { ...EX };
  Object.entries(extra).forEach(([id, from]) => { ex[id] = { ...EX[from], id, ...(added ? { added } : {}) }; });
  return { ...cat, EX: ex };
}
// programs that opt in with catalogue: 5 take new exercises by design, so they're left out here
const buildWith = (c) => CONFIGS.filter((cfg) => !cfg.frozen && !cfg.catalogue).map((cfg) => require('../program-builder.js').build(cfg, c));

test('new exercises marked added: 5 stay out of the computed pools: every program keeps its days', () => {
  assert.deepEqual(unpinned([...buildWith(withNew(5)), programs.find((p) => p.id === 'three-split-60')]), []);
});

test('the pin catches a new exercise that leaks into a pool', () => {
  assert.ok(unpinned([...buildWith(withNew(0)), programs.find((p) => p.id === 'three-split-60')]).length > 0);
});

test('a config with catalogue: 5 opts in to the new exercises', () => {
  const B = require('../program-builder.js'), c = withNew(5);
  const uses = (p, id) => p.days.some((d) => [...d.blocks, d.warmup, d.cooldown].some((b) => b.items.some((it) => it.ex === id)));
  const cfg = CONFIGS.find((x) => x.id === 'engine');
  assert.ok(!uses(B.build(cfg, c), 'zz_crunch'));
  assert.ok(uses(B.build({ ...cfg, catalogue: 5 }, c), 'zz_crunch'));
});

// ---------- one day from a recipe (review III ticket 4) ----------
const B4 = require('../program-builder.js');
const { S, SS, F } = require('../configs/shared.js');
const levelOf = (d) => (d <= 20 ? 1 : d <= 40 ? 2 : 3);

test('buildDay over the 60-day loop, with one memory and one rnd stream, gives every day of build()', () => {
  ['iron-ppl', 'engine', 'sun-and-strength', 'fight-camp', 'twenty-flat'].forEach((id) => {
    const cfg = CONFIGS.find((c) => c.id === id), rec = B4.recipesOf(cfg);
    const memory = B4.newMemory(), rnd = B4.makeRnd(cfg.id);
    programs.find((p) => p.id === id).days.forEach((want) => {
      const got = B4.buildDay(rec[cfg.cycle[(want.day - 1) % cfg.cycle.length]], { day: want.day, level: levelOf(want.day), rnd, memory }, cat);
      const { name, ...rest } = want;
      assert.equal(JSON.stringify(got), JSON.stringify(rest), `${id} d${want.day}`);
    });
  });
});

test('recipesOf: one recipe per day type, with what one day needs', () => {
  const cfg = CONFIGS.find((c) => c.id === 'fight-camp'), rec = B4.recipesOf(cfg);
  assert.deepEqual(Object.keys(rec), Object.keys(cfg.dayTypes));
  const [k, type] = Object.entries(cfg.dayTypes)[0], r = rec[k];
  assert.deepEqual([r.program, r.key, r.label, r.equip, r.catalogue], [cfg.id, k, type.label, 'bw', cfg.catalogue || 0]);
  assert.equal(r.blocks, type.blocks);
  assert.deepEqual([r.minutes, r.levers, r.absSlots], [cfg.minutes, cfg.levers, ['absW', 'abs', 'abs?']]);
  assert.deepEqual(r.rests, { ...B4.REST, ...cfg.rests });
  const own = { ...base(), dayTypes: { a: { ...base().dayTypes.a, minutes: [9, 12], levers: [null, 'weight', 'weight'], absSlots: [] } }, cycle: ['a'] };
  assert.deepEqual([B4.recipesOf(own).a.minutes, B4.recipesOf(own).a.levers, B4.recipesOf(own).a.absSlots], [[9, 12], [null, 'weight', 'weight'], []]);
  assert.equal(B4.recipesOf(base()).a.equip, undefined, 'no equip in the config: all gear');
});

test('buildDay lands in the day type\'s time range at every level, for several subjects, memories and seeds', () => {
  ['iron-ppl', 'engine', 'tabata-ten', 'fight-camp', 'sun-and-strength', 'twenty-flat', 'spring-loaded', 'core-foundations'].forEach((id) => {
    const cfg = CONFIGS.find((c) => c.id === id);
    Object.entries(B4.recipesOf(cfg)).forEach(([k, r]) => [1, 2, 3].forEach((level) => ['a', 'b', 'c'].forEach((seed) => {
      const day = B4.buildDay(r, { day: 5, level, rnd: B4.makeRnd(seed), memory: B4.newMemory() }, cat);
      const t = timing.dayTime(day.blocks, r.rests) / 60;
      assert.ok(t >= r.minutes[0] - 1 && t <= r.minutes[1] + 1.1, `${id}/${k} L${level} ${seed}: ${t.toFixed(1)} min, want ${r.minutes}`);
      assert.deepEqual([day.day, day.type, day.title, day.level], [5, k, r.label, level]);
    })));
  });
});

test('buildDay fills the memory it is given: used, count and stretchUsed', () => {
  const r = Object.values(B4.recipesOf(CONFIGS.find((c) => c.id === 'iron-ppl')))[0];
  const memory = B4.newMemory();
  assert.deepEqual(memory, { used: {}, count: {}, stretchUsed: {} });
  const day = B4.buildDay(r, { day: 3, level: 1, rnd: B4.makeRnd('x'), memory }, cat);
  const first = day.blocks[0].items[0].ex;
  assert.equal(memory.used[first], 3);
  assert.ok(memory.count[first] >= 1);
  assert.ok(Object.values(memory.stretchUsed).every((d) => d === 3) && Object.keys(memory.stretchUsed).length > 0);
});

// a small test-only config: a program with one lever, and day types that override it
const mixed = () => ({
  id: 'test-mixed', name: 'Test', subject: 'Test', minutes: [20, 30], levers: [null, 'reps', 'reps'], absSlots: ['absW', 'abs'],
  split: 'x', blurb: 'x', names: ['One'], cycle: ['own', 'plain', 'blk'],
  dayTypes: {
    own: { label: 'Own', short: 'O', levers: [null, 'weight', 'weight'], absSlots: [], blocks: [S('Press', ['pushLoad', 'pushLoad', 'pushLoad'])] },
    plain: { label: 'Plain', short: 'P', blocks: [S('Press', ['pushLoad', 'pushLoad', 'pushLoad'])] },
    blk: { label: 'Blk', short: 'B', blocks: [S('Press', ['pushLoad', 'pushLoad', 'pushLoad'], { lever: ['base', 'weight', 'weight'] }), S('Squat', ['squat', 'squat', 'squat'])] },
  },
});
const notes = (day, i = 0) => day.blocks[i].items.map((it) => it.note);
const dayOf = (rec, key, level) => B4.buildDay(rec[key], { day: 1, level, rnd: B4.makeRnd('t'), memory: B4.newMemory() }, cat);

test('a day type with its own levers and absSlots: [] uses them; the program\'s other day types do not', () => {
  const rec = B4.recipesOf(mixed());
  const own = dayOf(rec, 'own', 2), plain = dayOf(rec, 'plain', 2);
  assert.ok(notes(own).every((n) => n === 'Go one weight up'), notes(own).join());
  assert.ok(own.blocks.every((b) => b.kind !== 'abs'));
  assert.ok(notes(plain).every((n) => n === undefined));
  assert.equal(plain.blocks.at(-1).kind, 'abs');
  assert.ok(notes(dayOf(rec, 'own', 1)).every((n) => n === undefined), 'level I is always the base');
});

test('a block lever wins over the day type\'s and the program\'s, and only for its own block', () => {
  const rec = B4.recipesOf(mixed());
  const day = dayOf(rec, 'blk', 3);
  assert.ok(notes(day, 0).every((n) => n === 'Go one weight up'));
  assert.ok(notes(day, 1).every((n) => n === undefined), 'the squat block follows the program\'s reps lever');
  assert.ok(notes(dayOf(rec, 'blk', 1)).every((n) => n === undefined));
  // and a day type's lever wins over the program's when the block says nothing
  const rec2 = B4.recipesOf({ ...mixed(), dayTypes: { blk: { ...mixed().dayTypes.own, absSlots: undefined } }, cycle: ['blk'] });
  assert.ok(notes(dayOf(rec2, 'blk', 2)).every((n) => n === 'Go one weight up'));
});

test('an explicit lever for the day replaces the day type\'s and the program\'s (a block still wins)', () => {
  const rec = B4.recipesOf(mixed());
  const run = (key, lever) => B4.buildDay(rec[key], { day: 1, level: 2, lever, rnd: B4.makeRnd('t'), memory: B4.newMemory() }, cat);
  assert.ok(notes(run('plain', 'weight')).every((n) => n === 'Go one weight up'));
  assert.ok(notes(run('own', 'reps')).every((n) => n === undefined));
  assert.ok(notes(run('blk', 'reps'), 0).every((n) => n === 'Go one weight up'));
});

// Phase 6 ticket 1: a mixed day type. A strength block (weight lever) and a flexibility flow (holds lever) in one day,
// each main block tagged with its family; the day that ends in a flow has no abs, the one that ends in strength does.
const mixedDay = () => ({
  id: 'test-mixed-day', name: 'Test', subject: 'Test', minutes: [25, 35], levers: [null, 'weight', 'weight'], equip: 'all',
  split: 'x', blurb: 'x', names: ['One'], cycle: ['lift', 'flowFirst', 'plainDay'],
  dayTypes: {
    lift: { label: 'Lift then flow', short: 'L', absSlots: [], blocks: [
      S('Press & row', ['pushLoad', 'row', 'pushLoad'], { family: 'Strength' }),
      F('Shoulder flow', ['fxUpper', 'fxUpper', 'fxUpper'], { family: 'Mind & body', lever: [null, 'holds', 'holds'] })] },
    flowFirst: { label: 'Flow then lift', short: 'F', blocks: [
      F('Hip flow', ['fxHips', 'fxHips', 'fxHips'], { family: 'Mind & body', lever: [null, 'holds', 'holds'] }),
      S('Squat & hinge', ['squat', 'hinge', 'squat'], { family: 'Strength' })] },
    plainDay: { label: 'Plain', short: 'P', blocks: [S('Press', ['pushLoad', 'pushLoad', 'pushLoad'])] },
  },
});

test('a mixed day at Level III: the strength block levels by weight, the flow by holds, and no abs after a flow', () => {
  const rec = B4.recipesOf(mixedDay());
  const at = (key, level) => dayOf(rec, key, level);
  const day = at('lift', 3), day1 = at('lift', 1);
  assert.deepEqual(day.blocks.map((b) => b.format), ['straight', 'flow']);
  assert.ok(day.blocks.every((b) => b.kind === 'main'), 'a day that ends in a flow has no abs block');
  const strength = day.blocks[0].items.filter((it) => EX[it.ex].load);
  assert.ok(strength.length > 0 && strength.every((it) => it.note === 'Go one weight up'), 'strength: weight');
  day.blocks[1].items.forEach((it) => {
    assert.equal(it.note, undefined, 'a hold has no note: it is longer');
    assert.equal(it.n, EX[it.ex].r[2], 'flow: the Level III hold');
  });
  assert.ok(day1.blocks[1].items.every((it) => it.n === EX[it.ex].r[0]), 'Level I: the base holds');
  assert.ok(day1.blocks[0].items.every((it) => it.note === undefined), 'Level I: no weight note');
  const total = (d) => d.blocks[1].items.reduce((a, it) => a + it.n, 0);
  assert.ok(total(day) > total(day1), 'the holds are longer than at Level I');
  assert.deepEqual(day.blocks.map((b) => b.family), ['Strength', 'Mind & body']);
});

test('a day that starts with a flow and ends with strength keeps its abs; a day type without absSlots follows the program', () => {
  const rec = B4.recipesOf(mixedDay());
  const day = dayOf(rec, 'flowFirst', 3);
  assert.deepEqual(day.blocks.map((b) => b.kind), ['main', 'main', 'abs']);
  assert.deepEqual(day.blocks.slice(0, 2).map((b) => b.format), ['flow', 'straight']);
  assert.equal(dayOf(rec, 'plainDay', 1).blocks.at(-1).kind, 'abs');
});

test('each main block of a mixed day carries its family; the abs block and blocks without one carry none', () => {
  const rec = B4.recipesOf(mixedDay());
  assert.deepEqual(dayOf(rec, 'lift', 2).blocks.map((b) => b.family), ['Strength', 'Mind & body']);
  const flowFirst = dayOf(rec, 'flowFirst', 2);
  assert.deepEqual(flowFirst.blocks.map((b) => b.family), ['Mind & body', 'Strength', undefined]);
  assert.ok(flowFirst.blocks.every((b) => 'family' in b === (b.kind === 'main')));
  const plain = dayOf(rec, 'plainDay', 2);
  assert.ok(plain.blocks.every((b) => !('family' in b)), 'existing programs\' blocks have no family key');
});

test('KBBuilder in the page has build, buildDay, blockTimes, recipesOf, newMemory, makeRnd and ABS_SLOTS', () => {
  const vm = require('vm');
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../formats.js'), 'utf8'), sandbox);
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../program-builder.js'), 'utf8'), sandbox);
  const K = sandbox.window.KBBuilder;
  assert.deepEqual(Object.keys(K).sort(), ['ABS_SLOTS', 'blockTimes', 'build', 'buildDay', 'makeRnd', 'newMemory', 'recipesOf']);
  const r = K.recipesOf(CONFIGS.find((c) => c.id === 'iron-ppl'));
  const day = K.buildDay(Object.values(r)[0], { day: 1, level: 1, rnd: K.makeRnd('page'), memory: K.newMemory() }, cat);
  assert.equal(day.day, 1);
});
