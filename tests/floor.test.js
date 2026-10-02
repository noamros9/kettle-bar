// Phase 10: floor-only stand-ins for rows and lateral raises (prone lat pulls, superman rows, side-lying lateral raises).
const test = require('node:test');
const assert = require('node:assert/strict');
const cat = require('../exercises.js');
const S = require('../app/swaps.js');
const { buildAll, buildConfig, CONFIGS } = require('../program-builder.js');

const NEW = ['prone_lat_pull', 'superman_row', 'side_lying_raise'];
const all = require('./helpers/library.js').library();

test('bodyweight only, over every library day: lateral raises never keep "Needs gear"; a row only on a day with 4+ pulls needing gear, at most one', () => {
  const ROWS = ['db_row', 'one_arm_row', 'kb_row'];
  const gearPulls = (d) => d.blocks.flatMap((b) => b.items).filter((it) => !cat.allowedIn('bw', cat.EX[it.ex]) && cat.EX[it.ex].muscles.primary.some((m) => m === 'lats' || m === 'upper_back')).length;
  let raises = 0;
  for (const p of all) for (const day of p.days) {
    const left = S.travel(day, 'bw', p, cat).blocks.flatMap((b) => b.items).filter((it) => it.travelMissing);
    raises += left.filter((it) => it.ex === 'lateral_raise').length;
    const rows = left.filter((it) => ROWS.includes(it.ex)).length;
    if (rows) {
      assert.equal(rows, 1, `${p.id} day ${day.day}: ${rows} rows need gear`);
      assert.ok(gearPulls(day) >= 4, `${p.id} day ${day.day}: a row needs gear with only ${gearPulls(day)} pulls`); // Phase 13: four floor pulls, each once a day
    }
  }
  assert.equal(raises, 0);
});

test('the three new exercises: floor only (no load, no bar), added in catalogue 6, with muscles, cues, reps and drawings', () => {
  NEW.forEach((id) => {
    const e = cat.EX[id];
    assert.ok(e, id);
    assert.equal(e.added, 6); assert.equal(e.load, undefined); assert.ok(!(e.equip || []).includes('bar'));
    assert.ok(cat.allowedIn('bw', e));
    assert.equal(e.r.length, 3); assert.ok(e.cue.length > 20); assert.ok(e.poses.length >= 2, 'moves between two positions');
  });
  assert.deepEqual(cat.EX.prone_lat_pull.muscles.primary, ['lats', 'upper_back']);
  assert.deepEqual(cat.EX.superman_row.muscles.primary, ['upper_back', 'lats']);
  assert.deepEqual(cat.EX.side_lying_raise.muscles.primary, ['side_delts']);
  assert.equal(cat.EX.side_lying_raise.side, 1);
});

test('a build at catalogue 6 can draw them; library programs at catalogue 5 and older never do', () => {
  const used = (p) => new Set(p.days.flatMap((d) => d.blocks.flatMap((b) => b.items.map((it) => it.ex))));
  const cfg = Object.fromEntries(CONFIGS.map((c) => [c.id, c]));
  all.filter((p) => (cfg[p.id].catalogue || 0) < 6).forEach((p) => NEW.forEach((id) => assert.ok(!used(p).has(id), `${p.id} draws ${id}`)));
  const fresh = CONFIGS.filter((c) => c.equip === 'bw' && !c.frozen).map((c) => buildConfig({ ...c, catalogue: 6 }));
  assert.ok(fresh.some((p) => NEW.some((id) => used(p).has(id))), 'some bodyweight program at catalogue 6 uses one');
});

// ---- Phase 13 ticket 3: a fourth floor pull, Reverse snow angels ----
test('reverse snow angels: floor only, upper-back led, added in catalogue 7 (catalogue 6 builds stay as they are)', () => {
  const e = cat.EX.reverse_snow_angel;
  assert.ok(e);
  assert.equal(e.added, 7); assert.equal(e.load, undefined); assert.ok(!(e.equip || []).includes('bar'));
  assert.ok(cat.allowedIn('bw', e));
  assert.equal(e.r.length, 3); assert.ok(e.cue.length > 20); assert.ok(e.poses.length >= 2, 'moves between two positions');
  assert.deepEqual(e.muscles.primary, ['upper_back', 'rear_delts']);
  const used = (p) => new Set(p.days.flatMap((d) => d.blocks.flatMap((b) => b.items.map((it) => it.ex))));
  const bw = CONFIGS.filter((c) => c.equip === 'bw' && !c.frozen);
  bw.filter((c) => (c.catalogue || 0) < 7).map((c) => buildConfig({ ...c, catalogue: 6 })).forEach((p) => assert.ok(!used(p).has('reverse_snow_angel'), p.id)); // the configs made before it
  assert.ok(bw.map((c) => buildConfig({ ...c, catalogue: 7 })).some((p) => used(p).has('reverse_snow_angel')), 'some bodyweight program at catalogue 7 uses it');
});
