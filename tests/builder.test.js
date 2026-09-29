// Program Builder invariants for every program and every day.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { EX } = require('../exercises.js');
const { buildAll, CONFIGS, timing } = require('../program-builder.js');

const programs = buildAll();
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
  const noAbs = new Set(CONFIGS.filter((c) => c.absSlots && !c.absSlots.length).map((c) => c.id));
  programs.forEach((p) => p.days.forEach((d) => {
    d.blocks.forEach((b) => b.items.forEach((it) => assert.ok(EX[it.ex], `${p.id} d${d.day}: ${it.ex}`)));
    if (noAbs.has(p.id)) { assert.ok(d.blocks.every((b) => b.kind !== 'abs'), `${p.id} d${d.day} has abs`); return; }
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
    const t = timing.dayTime(d.blocks) / 60;
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

test('the builder runs without Node: build(config, catalogue) in a sandbox with no require or fs', () => {
  const vm = require('vm');
  const src = fs.readFileSync(path.join(__dirname, '../program-builder.js'), 'utf8');
  const sandbox = { window: {} };
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
const unpinned = (list) => Object.entries(PINS).filter(([id]) => hashDays(list.find((p) => p.id === id)) !== PINS[id]).map(([id]) => id);

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
const buildWith = (c) => CONFIGS.filter((cfg) => !cfg.frozen).map((cfg) => require('../program-builder.js').build(cfg, c));

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
