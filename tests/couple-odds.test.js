// ci-only: builds or reads the whole program library; the commit hook skips it, CI runs it (decision 312)
// Phase 20 ticket 8 (Noam): in a sex block every couple exercise has about the same chance of being drawn, old or new,
// and the basics (`basic: 1`) come up about 1.5x as often. The builder does it with the merged pools (sexPositions,
// sexWarm, sexFuck). Standing: every couple program on catalogue 11 or later, found at test time, so the programs of
// later tickets and phases are checked without being listed.
const test = require('node:test');
const assert = require('node:assert/strict');
const cat = require('../exercises.js');
const Builder = require('../program-builder.js');

const { EX } = cat;
const MERGED = ['sexPositions', 'sexWarm', 'sexFuck'];
const usesMerged = (c) => Object.values(c.dayTypes).some((t) => t.blocks.some((b) => (b.slots || []).some((s) => MERGED.includes(s.replace('?', '')))));
const programs = Builder.CONFIGS.filter((c) => c.couple && (c.catalogue || 0) >= 11);
const byId = Object.fromEntries(require('./helpers/library.js').built(programs.map((c) => c.id)).map((p) => [p.id, p])); // the shared build (Phase 31 ticket 5)
const median = (ns) => { const s = [...ns].sort((a, b) => a - b), m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

test('every couple program on catalogue 11 or later draws its sex blocks from the merged pools', () => {
  assert.ok(programs.length >= 20, `${programs.length} programs`);
  programs.forEach((c) => assert.ok(usesMerged(c), `${c.id} names no merged pool`));
});

test('in each of them, every exercise its sex blocks can use comes up, about equally, basics about 1.5x', () => {
  programs.forEach((c) => {
    const p = byId[c.id]; // the shared build (Phase 31 ticket 5)
    const names = new Set(Object.values(c.dayTypes).flatMap((t) => t.blocks.flatMap((b) => (b.slots || []).map((s) => s.replace('?', '')).filter((s) => MERGED.includes(s)))));
    const usable = new Set([...names].flatMap((n) => Builder.mergedAt(c.catalogue)[n]));
    const count = Object.fromEntries([...usable].map((id) => [id, 0]));
    p.days.forEach((d) => d.blocks.forEach((b) => b.items.forEach((it) => { if (it.ex in count) count[it.ex] += 1; })));
    const ids = Object.keys(count), basic = ids.filter((id) => EX[id].basic), other = ids.filter((id) => !EX[id].basic);
    const mean = (list) => list.reduce((s, id) => s + count[id], 0) / list.length;
    assert.deepEqual(ids.filter((id) => !count[id]), [], `${c.id}: never drawn`);
    const ratio = mean(basic) / mean(other);
    assert.ok(ratio >= 1.2 && ratio <= 2, `${c.id}: basics ${ratio.toFixed(2)}x the others`);
    const med = median(other.map((id) => count[id]));
    assert.deepEqual(other.filter((id) => count[id] > 3 * med), [], `${c.id}: drawn more than 3x the median (${med})`);
  });
});
