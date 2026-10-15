// ci-only: reads the whole library (the build cache makes it quick when warm).
// Phase 26 tickets 3–6: the re-timed programs (configs/long.js), family by family. Each one's days before the pass are
// the days that were pinned (tests/fixtures/long-was.json), the pass only adds to them, and every re-timed subject
// meets the spread (53, 155): half at 35–38, a quarter at 31–35, short of it only by what the plan's "The list" records.
const test = require('node:test');
const assert = require('node:assert/strict');
const LONG = require('../configs/long.js');
const WAS = require('./fixtures/long-was.json');
const { CONFIGS } = require('../program-builder.js');
const { pinOf } = require('../scripts/pins.js');
const { bucketOf } = require('../scripts/long-list.js');
const { library, fromBuildCache } = require('./helpers/library.js');

// recorded in "The list": what a program averaged when the pass couldn't take it into its band's bucket (170, 343:
// Mind & body's flows), and each subject's shortfall that leaves (Strength's from the list itself: nothing shorter to move)
const SHORT = {
  'classical-mat': 34.3, 'standing-pilates': 28.2, 'front-splits-60': 31, 'pancake-straddle': 29.6, 'joint-health': 34.6,
  'mobility-flow': 34.3, 'low-impact-cardio': 25.3, 'back-and-hips': 32.5, 'shoulder-health': 31.4, 'hip-mobility': 28.6,
  'gentle-flow': 28.9, 'loaded-back-care': 34.7, 'flexible-30': 30.5, 'gentle-30': 30, 'upper-back-care': 29.6,
};
const SHORT_OF = {
  Strength: { long: 0, mid: 1 }, Pilates: { long: 1, mid: 0 }, Flexibility: { long: 1, mid: 0 },
  'Mobility & posture': { long: 3, mid: 0 }, 'Gentle / low impact': { long: 1, mid: 2 }, 'Back care': { long: 2, mid: 0 },
};
// a program's bucket is its average day (342)
const avg = (p) => p.days.reduce((s, d) => s + d.est, 0) / p.days.length;
const bucket = (p) => bucketOf([avg(p), avg(p)]);

const programs = library();
const byId = new Map(programs.map((p) => [p.id, p]));
const listed = CONFIGS.filter((c) => LONG[c.id]);
const before = new Map(fromBuildCache({ configs: listed.map(({ long, ...c }) => c) }).programs.map((p) => [p.id, p]));

test('every re-timed program: its days before the pass are the pinned ones, and the pass only added to them', () => {
  assert.ok(listed.length > 0);
  listed.forEach((c) => {
    const was = before.get(c.id), now = byId.get(c.id);
    assert.equal(pinOf(was.days), WAS[c.id], `${c.id}: the days before the pass are the ones that were pinned`);
    now.days.forEach((d, i) => d.blocks.forEach((b, j) => {
      const old = was.days[i].blocks[j];
      assert.deepEqual(b.items.slice(0, old.items.length), old.items, `${c.id} d${d.day} block ${j}`);
    }));
    assert.ok(now.days.some((d, i) => d.est > was.days[i].est) && now.days.every((d, i) => d.est >= was.days[i].est), `${c.id} is longer`);
  });
});

test("every re-timed program averages into its band, or what it reached is recorded", () => {
  listed.forEach((c) => {
    const p = byId.get(c.id);
    if (SHORT[c.id]) assert.equal(Math.round(avg(p) * 10) / 10, SHORT[c.id], c.id);
    else assert.equal(bucket(p), bucketOf(c.long), `${c.id}: ${avg(p).toFixed(1)} on average`);
    assert.ok(avg(p) >= c.long[0] || SHORT[c.id], `${c.id}: the average reaches the band (340)`);
  });
});

test('every subject with re-timed programs meets the spread, short of it only by what the list records', () => {
  [...new Set(listed.map((c) => c.subject))].forEach((s) => {
    const list = programs.filter((p) => p.subject === s), count = (b) => list.filter((p) => bucket(p) === b).length;
    const short = SHORT_OF[s] || { long: 0, mid: 0 };
    assert.ok(count('long') >= Math.ceil(list.length / 2) - short.long, `${s}: ${count('long')} of ${list.length} at 35+`);
    assert.ok(count('mid') >= Math.round(list.length / 4) - short.mid, `${s}: ${count('mid')} of ${list.length} at 31–35`);
  });
});
