// ci-only: builds or reads the whole program library; the commit hook skips it, CI runs it (decision 312)
// Phase 20 ticket 8 (Noam): in a sex block every couple exercise has about the same chance of being drawn, old or new,
// and the basics (`basic: 1`) come up about 1.5x as often. The builder does it with the merged pools (sexPositions,
// sexWarm, sexFuck). Standing: every couple program on catalogue 11 or later, found at test time, so the programs of
// later tickets and phases are checked without being listed.
// Phase 36 ticket 3 (366, Noam, 16 Oct 2026): the order of a session wins. Teases open, props come off once, a finish
// closes its set and anal waits, so those can't come up as often; among the exercises the order leaves free, none is
// drawn far more than the rest. "Every exercise comes up" and "basics about 1.5x" went with it.
const test = require('node:test');
const assert = require('node:assert/strict');
const cat = require('../exercises.js');
const Builder = require('../program-builder.js');
const { tagAll } = require('../session-tags.js');

const { EX } = cat;
const T = tagAll(EX);
// what the order holds to a place in the session (296–300): a tease, a prop, a finish, anal, the shower or the water
const free = (id) => { const t = T[id]; return !t || (!['clothed', 'undress'].includes(t.dress) && !t.props.length && !t.finish && !t.anal && t.place !== 'shower' && t.place !== 'water'); };
const MERGED = ['sexPositions', 'sexWarm', 'sexFuck', 'sexPositionsHome', 'sexFuckHome']; // the home pools: Phase 20 ticket 8b
const usesMerged = (c) => Object.values(c.dayTypes).some((t) => t.blocks.some((b) => (b.slots || []).some((s) => MERGED.includes(s.replace('?', '')))));
const programs = Builder.CONFIGS.filter((c) => c.couple && (c.catalogue || 0) >= 11);
const byId = Object.fromEntries(require('./helpers/library.js').built(programs.map((c) => c.id)).map((p) => [p.id, p])); // the shared build (Phase 31 ticket 5)
const median = (ns) => { const s = [...ns].sort((a, b) => a - b), m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

test('every couple program on catalogue 11 or later draws its sex blocks from the merged pools', () => {
  assert.ok(programs.length >= 20, `${programs.length} programs`);
  // a water day draws only its place's own pools, warm-up and all (Phase 36 ticket 3, 364): equal odds inside each
  const placeOnly = (c) => Object.values(c.dayTypes).every((t) => t.blocks.every((b) => (b.slots || []).every((s) => !/^sex/.test(s) || /^sex(Pool|Hottub)(Warm)?\??$/.test(s))));
  programs.forEach((c) => assert.ok(usesMerged(c) || placeOnly(c), `${c.id} names no merged pool`));
});

test('in each of them, no exercise the order leaves free is drawn far more than the rest', () => {
  programs.forEach((c) => {
    const p = byId[c.id]; // the shared build (Phase 31 ticket 5)
    const names = new Set(Object.values(c.dayTypes).flatMap((t) => t.blocks.flatMap((b) => (b.slots || []).map((s) => s.replace('?', '')).filter((s) => MERGED.includes(s)))));
    if (!names.size) return; // a water day (364)
    const usable = new Set([...names].flatMap((n) => Builder.mergedAt(c.catalogue)[n]).filter(free));
    const count = Object.fromEntries([...usable].map((id) => [id, 0]));
    p.days.forEach((d) => d.blocks.forEach((b) => b.items.forEach((it) => { if (it.ex in count) count[it.ex] += 1; })));
    const other = Object.keys(count).filter((id) => !EX[id].basic);
    const med = median(other.map((id) => count[id]));
    assert.deepEqual(other.filter((id) => count[id] > Math.max(3, 3 * med)), [], `${c.id}: drawn more than 3x the median (${med})`);
  });
});
