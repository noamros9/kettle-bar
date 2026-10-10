// Signature IIs (Phase 23 ticket 2, decisions 84–86 and 171): a II of each of the 15 Signature programs, built a level up
// (`step: 1`) at catalogue 13; its Level III adds a set where the day has room (up to 3 minutes over its range).
const test = require('node:test');
const assert = require('node:assert/strict');
const B = require('../program-builder.js');
const cat = require('../exercises.js');

const ids = B.CONFIGS.map((c) => c.id);
const originals = B.CONFIGS.filter((c) => c.subject === 'Signature' && !c.step);
const IIs = B.CONFIGS.filter((c) => c.step);
const built = Object.fromEntries(IIs.map((c) => [c.id, B.buildConfig(c)]));
const mainSets = (days) => days.reduce((a, d) => a + d.blocks.filter((b) => b.kind === 'main').reduce((x, b) => x + (b.sets || b.rounds || 0), 0), 0) / days.length;

test('15 IIs, one per Signature program, on the Signature shelf after every original; 60 days at catalogue 13', () => {
  assert.equal(originals.length, 15);
  assert.deepEqual(IIs.map((c) => c.id), originals.map((c) => `${c.id}-ii`));
  const lastOriginal = Math.max(...originals.map((c) => ids.indexOf(c.id)));
  IIs.forEach((c) => {
    assert.ok(ids.indexOf(c.id) > lastOriginal, c.id);
    assert.equal(c.subject, 'Signature'); assert.equal(c.catalogue, 13); assert.equal(c.step, 1); assert.equal(c.added, 23);
    assert.match(c.name, / II$/);
    assert.equal(built[c.id].days.length, 60);
  });
});

test('a step up: every day is built at the next level (Level I = the original\'s Level II), keeping its own level number', () => {
  IIs.forEach((c) => {
    built[c.id].days.forEach((d) => {
      assert.equal(d.level, d.day <= 20 ? 1 : d.day <= 40 ? 2 : 3, `${c.id} day ${d.day}`);
      const at = Math.min(3, d.level + 1);
      d.blocks.filter((b) => b.kind === 'main').forEach((b) => b.items.filter((it) => !it.note).forEach((it) => {
        const e = cat.EX[it.ex];
        assert.equal(it.n, cat.scaleReps(e, e.r[at - 1], b.format), `${c.id} day ${d.day} ${it.ex}`);
      }));
    });
  });
});

test('Level III adds a set where there is room: more sets than the original\'s Level III, and no day over its range by 3 minutes', () => {
  IIs.forEach((c) => {
    const src = c.id === 'three-split-60-ii' ? 'three-split-60-tempo' : c.id.replace(/-ii$/, '');
    const orig = B.buildConfig(B.CONFIGS.find((x) => x.id === src));
    const l3 = (p) => p.days.filter((d) => d.level === 3);
    assert.ok(mainSets(l3(built[c.id])) > mainSets(l3(orig)), c.id);
    built[c.id].days.forEach((d) => assert.ok(d.est <= c.dayTypes[d.type].minutes[1] + 3, `${c.id} day ${d.day}: ${d.est} min`));
  });
});

test('without step the builder is as before: a day past Level III never comes up', () => {
  const c = originals.find((x) => x.id === 'four-split-60');
  assert.deepEqual(B.buildConfig(c).days.map((d) => d.level), B.buildConfig({ ...c, step: 0 }).days.map((d) => d.level));
});
