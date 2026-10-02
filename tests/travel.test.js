// Travel mode (Phase 7 ticket 5): a setting (no bar / kettlebell only / bodyweight only) that swaps, on every day page,
// the exercises needing missing gear for ones that work the same first main muscle, until turned off.
const test = require('node:test');
const assert = require('node:assert/strict');
const cat = require('../exercises.js');
const S = require('../app/swaps.js');
const { buildAll } = require('../program-builder.js');

const all = buildAll(), three = all.find((p) => p.id === 'three-split-60');
const EX = cat.EX;
const needsGear = (e) => !!e.load || (e.equip || []).includes('bar');
const mains = (day) => day.blocks.flatMap((b) => b.items);
const GUIDED = ['warmup', 'cooldown', 'yoga', 'pilates', 'flex', 'mobility', 'boxing', 'kick'];
// something without gear, not a stretch or a pose, led by one of this exercise's main muscles
const bodyweightFor = (id) => Object.keys(EX).some((o) => o !== id && !needsGear(EX[o]) && !GUIDED.includes(EX[o].cat) && EX[id].muscles.primary.includes(EX[o].muscles.primary[0]));

// ---- the plan's test first ----
test('bodyweight only: a Three-Split 60 day needs no dumbbells, kettlebell or bar, and each swap works the same first main muscle (or, failing that, another of its main muscles)', () => {
  const loosened = new Set(), missing = new Set();
  for (const day of three.days) {
    const t = S.travel(day, 'bw', three, cat);
    // gear is left only where nothing without it works any of the exercise's main muscles, or the floor-only pulls are
    // used up that day (curls, pull-ups and hangs, and a third pull; marked on the card)
    mains(t).forEach((it) => {
      if (!needsGear(EX[it.ex])) return;
      assert.equal(it.travelMissing, true, `day ${day.day}: ${it.ex}`);
      missing.add(it.ex);
    });
    t.blocks.forEach((b, bi) => b.items.forEach((it, i) => {
      const was = day.blocks[bi].items[i];
      if (it.ex === was.ex) { assert.equal(it.travel, undefined); return; }
      assert.equal(it.travel, true);
      assert.equal(it.swappedFrom, was.ex);
      // the same first main muscle; when nothing without the gear has it (a bar hold), one of its main muscles
      const same = EX[it.ex].muscles.primary[0] === EX[was.ex].muscles.primary[0];
      assert.ok(same || EX[was.ex].muscles.primary.includes(EX[it.ex].muscles.primary[0]), `day ${day.day}: ${was.ex} -> ${it.ex}`);
      if (!same) loosened.add(was.ex);
      assert.equal(it.n, cat.scaleReps(EX[it.ex], EX[it.ex].r[day.level - 1], b.format), 'its own reps for the level');
    }));
  }
  assert.ok(loosened.size < 8, [...loosened].join(', ')); // a few swap to another of their main muscles
  assert.ok(missing.size < 12, [...missing].join(', '));
});

// ---- the rest ----
test('no bar keeps dumbbells and the kettlebell; kettlebell only keeps the kettlebell; no mode changes nothing', () => {
  let bars = 0, dbs = 0;
  for (const day of three.days) {
    const nobar = S.travel(day, 'nobar', three, cat), kb = S.travel(day, 'kb', three, cat);
    mains(nobar).forEach((it) => assert.ok(!(EX[it.ex].equip || []).includes('bar'), it.ex));
    mains(day).forEach((it, k) => {
      if ((EX[it.ex].equip || []).includes('bar')) bars++;
      if (EX[it.ex].load && EX[it.ex].load !== 'kb') { dbs++; assert.equal(mains(nobar)[k].ex, it.ex, 'dumbbells stay'); }
    });
    mains(kb).forEach((it) => assert.ok(cat.allowedIn('kb', EX[it.ex]) || it.travelMissing, it.ex));
  }
  assert.ok(bars > 0 && dbs > 0, 'the program has both to test');
  const day = three.days[0];
  assert.equal(S.travel(day, null, three, cat), day);
  assert.equal(S.travel(day, undefined, three, cat), day);
});

test('two exercises swapped in one day never become the same one; an exercise with nothing to swap to stays, marked', () => {
  for (const p of all.slice(0, 40)) {
    for (const day of p.days.slice(0, 10)) {
      const t = S.travel(day, 'bw', p, cat);
      t.blocks.forEach((b) => {
        const ids = b.items.map((it) => it.ex);
        assert.equal(new Set(ids).size, ids.length, `${p.id} ${day.day}: a block holds an exercise twice`);
        b.items.filter((it) => it.travelMissing).forEach((it) => assert.ok(needsGear(EX[it.ex])));
      });
    }
  }
  // a made-up day whose exercise has no bodyweight alternative
  const lonely = Object.keys(EX).find((id) => needsGear(EX[id]) && !GUIDED.includes(EX[id].cat) && !bodyweightFor(id));
  assert.ok(lonely, 'some gear exercise has no bodyweight stand-in');
  {
    const t = S.travel({ day: 1, level: 1, blocks: [{ format: 'straight', sets: 3, items: [{ ex: lonely, n: 8 }] }] }, 'bw', { equip: 'all' }, cat);
    assert.deepEqual(t.blocks[0].items[0], { ex: lonely, n: 8, travelMissing: true });
  }
});

test('what an exercise can be swapped for in travel mode leaves out the missing gear', () => {
  const b = three.days[0].blocks[0], id = b.items.find((it) => EX[it.ex].load).ex;
  const alts = S.alternatives(id, b, three, cat, 'bw');
  assert.ok(alts.length);
  alts.forEach((a) => assert.ok(!needsGear(EX[a]), a));
  assert.ok(S.alternatives(id, b, three, cat).some((a) => needsGear(EX[a])), 'without travel mode, gear is offered');
  assert.deepEqual(S.TRAVEL, ['nobar', 'kb', 'bw']);
  assert.equal(S.travelAllows('nobar', EX.pullup), false);
  assert.equal(S.travelAllows(null, EX.pullup), true);
});
