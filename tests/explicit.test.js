// Phase 20 ticket 8: Explicit, 20 programs, three session shapes. Each sex block draws one merged pool (old and new
// together), basics about 1.5x. A positions-only day is one family, marked `oneFamily`, and only it.
const test = require('node:test');
const assert = require('node:assert/strict');
const { EX } = require('../exercises.js');
const { CONFIGS, POOLS, poolsAt } = require('../program-builder.js');
const Builder = require('../program-builder.js');
const cat = require('../exercises.js');
const R = require('../recipes.js');

const GYM = ['set-then-fuck', 'sweat-then-spread', 'earn-the-pussy', 'lift-her-then-fuck', 'grind-after-reps', 'short-and-dirty', 'long-afternoon'];
const SEX = ['mouth-then-cock', 'tongue-then-thrust', 'fingers-then-fuck', 'eat-then-pound', 'tease-then-bury', 'quick-and-deep', 'slow-deep-fuck'];
const POS = ['stay-inside-her', 'hold-after-hold', 'deeper-every-hold', 'all-the-positions', 'cock-in-her', 'nothing-but-fucking'];
const IDS = [...GYM, ...SEX, ...POS];
const SHAPE = Object.fromEntries([...GYM.map((id) => [id, 'gym']), ...SEX.map((id) => [id, 'sex']), ...POS.map((id) => [id, 'positions'])]);
const TAGS = ['Strength', 'Cardio & combat', 'Mind & body'];
const WARM = ['oralSex', 'hands', 'oral', 'tease', 'massage'];
const FUCK = ['fuck', 'anal', 'toy', 'positions'];
const explicit = new Set(poolsAt(11).explicit);
const inPool = (name, id) => (name === 'explicit' ? explicit.has(id) : POOLS[name].includes(id));
// The builder's merged pools (sexPositions, sexWarm, sexFuck), at catalogue 11.
const MERGED = Builder.mergedAt(11);
const idsIn = (name) => MERGED[name] || (name === 'explicit' ? [...explicit] : (POOLS[name] || [name]));
const sexBlocks = (id) => Object.values(cfgOf(id).dayTypes).flatMap((t) => (SHAPE[id] === 'gym' ? t.blocks.slice(1) : t.blocks));
const usable = (id) => [...new Set(sexBlocks(id).flatMap((b) => b.slots.map((s) => s.replace('?', '')).flatMap(idsIn)))].filter((ex) => EX[ex] && EX[ex].cat === 'couple');
const median = (ns) => {
  const s = [...ns].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const cfgOf = (id) => CONFIGS.find((c) => c.id === id);
const mains = (d) => d.blocks.filter((b) => b.kind !== 'abs' && b.kind !== 'warmup' && b.kind !== 'cooldown');
const programs = CONFIGS.filter((c) => IDS.includes(c.id)).map((c) => Builder.build(c, cat));
const prog = (id) => programs.find((p) => p.id === id);

test('Explicit: the 20 programs, for two, catalogue 11, 60 days, out of build your own', () => {
  assert.deepEqual(programs.map((p) => p.id), IDS);
  assert.equal(CONFIGS.filter((c) => c.subject === 'Explicit').length, 20);
  assert.deepEqual([GYM.length, SEX.length, POS.length], [7, 7, 6]);
  IDS.forEach((id) => {
    const c = cfgOf(id);
    const p = prog(id);
    assert.equal(c.subject, 'Explicit', id);
    assert.equal(c.added, 20, id);
    assert.equal(c.catalogue, 11, id);
    assert.equal(c.couple, true, id);
    assert.equal(c.equip, 'bw', id);
    assert.equal(p.days.length, 60, id);
    assert.deepEqual([1, 20, 21, 40, 41, 60].map((n) => p.days[n - 1].level), [1, 1, 2, 2, 3, 3], id);
    assert.ok(R.skipped.includes(id), id);
    assert.equal(c.blurb.trim(), c.blurb, id);
    assert.ok(c.blurb.length > 0 && c.blurb.length <= 140, `${id}: blurb is ${c.blurb.length}`);
    assert.deepEqual(c.blurb.match(/[.!?]/g), [c.blurb.at(-1)], `${id}: blurb is not one sentence`);
    assert.equal(c.about.trim(), c.about, id);
    assert.ok(!/[\r\n]/.test(c.about) && /[.!?]/.test(c.about), `${id}: about`);
  });
  assert.deepEqual(R.pick({ subjects: ['Explicit'] }), []);
});

test('every day is its shape, and both catalogues appear in every program', () => {
  IDS.forEach((id) => {
    const added = new Set();
    prog(id).days.forEach((d) => {
      const m = mains(d);
      const where = `${id} d${d.day}`;
      assert.ok(m.every((b) => TAGS.includes(b.family)), `${where}: untagged`);
      assert.ok(!d.blocks.some((b) => b.kind === 'abs'), `${where}: abs`);
      m.forEach((b) => {
        const ids = b.items.map((it) => it.ex);
        assert.equal(new Set(ids).size, ids.length, `${where} ${b.title}`);
        assert.ok(ids.every((ex) => EX[ex].cat === 'couple'), `${where}: a solo exercise`);
        ids.forEach((ex) => added.add(EX[ex].added));
      });
      if (SHAPE[id] === 'gym') {
        assert.equal(m.length, 2, where);
        assert.equal(m[1].title, 'Positions', where);
        assert.equal(m[1].format, 'flow', where);
        assert.ok(m[0].items.every((it) => EX[it.ex].added === 10 && !inPool('explicit', it.ex) && !inPool('positions', it.ex)), `${where}: gym block`);
        assert.ok(m[1].items.every((it) => inPool('explicit', it.ex) || inPool('positions', it.ex)), `${where}: positions`);
      } else if (SHAPE[id] === 'sex') {
        assert.equal(m.length, 2, where);
        assert.equal(m[0].title, 'Warm-up', where);
        assert.equal(m[1].title, 'Fuck', where);
        assert.ok(m[0].items.every((it) => WARM.some((n) => inPool(n, it.ex))), `${where}: warm-up`);
        assert.ok(m[1].items.every((it) => FUCK.some((n) => inPool(n, it.ex))), `${where}: fuck`);
      } else {
        assert.equal(m.length, 1, where);
        assert.equal(m[0].title, 'Positions', where);
        assert.equal(m[0].format, 'flow', where);
        assert.ok(m[0].items.every((it) => inPool('explicit', it.ex) || inPool('positions', it.ex)), `${where}: positions`);
      }
    });
    assert.ok(added.has(10) && added.has(11), `${id}: both catalogues`);
  });
});

test('two families a day, except a day marked oneFamily, and only positions-only days are marked', () => {
  const marked = [];
  IDS.forEach((id) => Object.entries(cfgOf(id).dayTypes).forEach(([k, t]) => { if (t.oneFamily) marked.push(`${id}:${k}`); }));
  const expect = POS.flatMap((id) => Object.keys(cfgOf(id).dayTypes).map((k) => `${id}:${k}`));
  assert.deepEqual(marked.sort(), expect.sort());
  IDS.forEach((id) => {
    const cfg = cfgOf(id);
    prog(id).days.forEach((d) => {
      const n = new Set(mains(d).map((b) => b.family)).size;
      if (cfg.dayTypes[d.type].oneFamily) assert.equal(n, 1, `${id} d${d.day}: positions-only is one family`);
      else assert.ok(n >= 2, `${id} d${d.day}: two families`);
      assert.equal(!!cfg.dayTypes[d.type].oneFamily, SHAPE[id] === 'positions', `${id} d${d.day}: mark`);
    });
  });
});

test('minutes: most about 31–40, a few shorter, a few toward 54, and every day builds inside its program', () => {
  const mids = IDS.map((id) => {
    const [lo, hi] = cfgOf(id).minutes;
    assert.ok(lo >= 19 && hi <= 54 && lo < hi, `${id}: ${lo}–${hi}`);
    prog(id).days.forEach((d) => assert.ok(d.est >= lo && d.est <= hi, `${id} d${d.day}: ${d.est} min, band ${lo}–${hi}`));
    return (lo + hi) / 2;
  });
  assert.ok(mids.filter((m) => m >= 31 && m <= 40).length >= 14, 'most programs about 31–40');
  assert.ok(mids.filter((m) => m < 31).length >= 2, 'a few shorter');
  assert.ok(mids.filter((m) => m > 40).length >= 2 && IDS.filter((id) => cfgOf(id).minutes[1] >= 50).length >= 2, 'a few toward 54');
});

test('each sex block draws its exercises at equal odds, basics about 1.5x', () => {
  IDS.forEach((id) => {
    const pool = usable(id);
    const counts = Object.fromEntries(pool.map((ex) => [ex, 0]));
    const sexOf = (d) => (SHAPE[id] === 'gym' ? [mains(d)[1]] : mains(d));
    prog(id).days.forEach((d) => sexOf(d).forEach((b) => b.items.forEach((it) => { if (counts[it.ex] !== undefined) counts[it.ex]++; })));
    pool.forEach((ex) => assert.ok(counts[ex] >= 1, `${id}: ${ex} never appears`));
    const basics = pool.filter((ex) => EX[ex].basic === 1);
    const rest = pool.filter((ex) => EX[ex].basic !== 1);
    assert.ok(basics.length && rest.length, `${id}: basics ${basics.length}, others ${rest.length}`);
    const mean = (xs) => xs.reduce((s, ex) => s + counts[ex], 0) / xs.length;
    const ratio = mean(basics) / mean(rest);
    assert.ok(ratio >= 1.2 && ratio <= 2, `${id}: basics are ${ratio.toFixed(2)}x the others`);
    const med = median(rest.map((ex) => counts[ex]));
    rest.forEach((ex) => assert.ok(counts[ex] <= 3 * med, `${id}: ${ex} appears ${counts[ex]}, median ${med}`));
  });
});

test('abouts and blurbs describe the session, not the builder', () => {
  const banned = /\b(slot|dealt|deals|deal|catalogue|old ones|new ones|old positions|new positions|positions you (already )?know|the new exercises)\b/i;
  IDS.forEach((id) => {
    const c = cfgOf(id);
    assert.doesNotMatch(c.blurb, banned, `${id} blurb`);
    assert.doesNotMatch(c.about, banned, `${id} about`);
  });
});
