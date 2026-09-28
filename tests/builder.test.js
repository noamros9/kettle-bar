// Program Builder invariants for every program and every day.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { EX } = require('../exercises.js');
const { buildAll, CONFIGS, timing } = require('../program-builder.js');

const programs = buildAll();
const hasBar = (id) => (EX[id].equip || []).includes('bar');

test('29 programs of 60 days, unique ids', () => {
  assert.equal(programs.length, CONFIGS.length);
  assert.equal(new Set(programs.map((p) => p.id)).size, programs.length);
  programs.forEach((p) => assert.equal(p.days.length, 60, p.id));
});

test('Three-Split 60 stays exactly as saved', () => {
  const saved = JSON.parse(fs.readFileSync(path.join(__dirname, '../programs/three-split-60.json'), 'utf8'));
  assert.deepEqual(programs.find((p) => p.id === 'three-split-60').days, saved.days);
});

test('every exercise used exists; abs come last without the pull-up bar', () => {
  programs.forEach((p) => p.days.forEach((d) => {
    d.blocks.forEach((b) => b.items.forEach((it) => assert.ok(EX[it.ex], `${p.id} d${d.day}: ${it.ex}`)));
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
