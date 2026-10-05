// Phase 20 ticket 8: Explicit, 20 programs, three session shapes. Catalogue 11 exercises sit alongside catalogue 10's
// couple exercises. A positions-only day is one family, marked `oneFamily` so the two-families rule skips it, and only it.
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
const cfgOf = (id) => CONFIGS.find((c) => c.id === id);
const mains = (d) => d.blocks.filter((b) => b.kind !== 'abs' && b.kind !== 'warmup' && b.kind !== 'cooldown');
const programs = CONFIGS.filter((c) => IDS.includes(c.id)).map((c) => Builder.build(c, cat));
const prog = (id) => programs.find((p) => p.id === id);
const addedOf = (items) => new Set(items.map((it) => EX[it.ex].added));

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

test('every day is its shape, and every sex block draws catalogue 10 and catalogue 11', () => {
  IDS.forEach((id) => prog(id).days.forEach((d) => {
    const m = mains(d);
    const where = `${id} d${d.day}`;
    assert.ok(m.every((b) => TAGS.includes(b.family)), `${where}: untagged`);
    assert.ok(!d.blocks.some((b) => b.kind === 'abs'), `${where}: abs`);
    m.forEach((b) => {
      const ids = b.items.map((it) => it.ex);
      assert.equal(new Set(ids).size, ids.length, `${where} ${b.title}`);
      assert.ok(ids.every((ex) => EX[ex].cat === 'couple'), `${where}: a solo exercise`);
    });
    const dayAdded = addedOf(m.flatMap((b) => b.items));
    assert.ok(dayAdded.has(10) && dayAdded.has(11), `${where}: both catalogues`);
    if (SHAPE[id] === 'gym') {
      assert.equal(m.length, 2, where);
      assert.equal(m[1].title, 'Positions', where);
      assert.equal(m[1].format, 'flow', where);
      assert.ok(m[0].items.every((it) => EX[it.ex].added === 10 && !inPool('explicit', it.ex) && !inPool('positions', it.ex)), `${where}: gym block`);
      assert.ok(m[1].items.every((it) => inPool('explicit', it.ex) || inPool('positions', it.ex)), `${where}: positions`);
      const sex = addedOf(m[1].items);
      assert.ok(sex.has(10) && sex.has(11), `${where}: positions block mixes both catalogues`);
    } else if (SHAPE[id] === 'sex') {
      assert.equal(m.length, 2, where);
      assert.equal(m[0].title, 'Warm-up', where);
      assert.equal(m[1].title, 'Fuck', where);
      assert.ok(m[0].items.every((it) => WARM.some((n) => inPool(n, it.ex))), `${where}: warm-up`);
      assert.ok(m[1].items.every((it) => FUCK.some((n) => inPool(n, it.ex))), `${where}: fuck`);
      [0, 1].forEach((i) => {
        const a = addedOf(m[i].items);
        assert.ok(a.has(10) && a.has(11), `${where}: ${m[i].title} mixes both catalogues`);
      });
    } else {
      assert.equal(m.length, 1, where);
      assert.equal(m[0].title, 'Positions', where);
      assert.equal(m[0].format, 'flow', where);
      assert.ok(m[0].items.every((it) => inPool('explicit', it.ex) || inPool('positions', it.ex)), `${where}: positions`);
      const a = addedOf(m[0].items);
      assert.ok(a.has(10) && a.has(11), `${where}: the flow mixes both catalogues`);
    }
  }));
});

test('two families a day, except a day marked oneFamily, and only positions-only days are marked', () => {
  const marked = [];
  CONFIGS.forEach((c) => Object.entries(c.dayTypes).forEach(([k, t]) => { if (t.oneFamily) marked.push(`${c.id}:${k}`); }));
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
