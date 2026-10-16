// ci-only: builds or reads the whole program library; the commit hook skips it, CI runs it (decision 312)
// Phase 20 ticket 9: Beach body, Bedroom stamina, Sex positions, 27 programs, three session shapes.
// Catalogue 13, home pools. Each sex block draws one of sexPositionsHome, sexFuckHome, sexWarm.
const test = require('node:test');
const { inBand } = require('./helpers/band.js');
const assert = require('node:assert/strict');
const { EX } = require('../exercises.js');
const { CONFIGS, POOLS, poolsAt } = require('../program-builder.js');
const R = require('../recipes.js');
const { built } = require('./helpers/library.js');

const BEACH_GYM = ['beach-set-then-fuck', 'beach-pump-then-grab', 'beach-flex-then-spread'];
const BEACH_SEX = ['beach-mouth-then-body', 'beach-lick-the-abs', 'beach-tease-then-grab'];
const BEACH_POS = ['beach-grab-and-stay', 'beach-shirtless-holds', 'beach-body-she-grabs'];
const BED_GYM = ['bed-set-then-last', 'bed-sweat-then-hard', 'bed-lift-then-again'];
const BED_SEX = ['bed-mouth-then-last', 'bed-hands-then-again', 'bed-tease-then-keep'];
const BED_POS = ['bed-stay-hard', 'bed-round-after-round', 'bed-keep-it-up'];
const SEXPOS_GYM = ['fold-then-fuck', 'open-then-hold-her', 'kiss-then-fold'];
const SEXPOS_SEX = ['mouth-then-fold', 'hands-then-the-angle', 'tease-then-fold'];
const SEXPOS_POS = ['stay-in-the-fold', 'hold-the-angle', 'deeper-every-angle'];
const BEACH = [...BEACH_GYM, ...BEACH_SEX, ...BEACH_POS];
const BED = [...BED_GYM, ...BED_SEX, ...BED_POS];
const SEXPOS = [...SEXPOS_GYM, ...SEXPOS_SEX, ...SEXPOS_POS];
const GYM = [...BEACH_GYM, ...BED_GYM, ...SEXPOS_GYM];
const SEX = [...BEACH_SEX, ...BED_SEX, ...SEXPOS_SEX];
const POS = [...BEACH_POS, ...BED_POS, ...SEXPOS_POS];
const IDS = [...BEACH, ...BED, ...SEXPOS];
const SHAPE = Object.fromEntries([...GYM.map((id) => [id, 'gym']), ...SEX.map((id) => [id, 'sex']), ...POS.map((id) => [id, 'positions'])]);
const SUBJECT = Object.fromEntries([...BEACH.map((id) => [id, 'Beach body']), ...BED.map((id) => [id, 'Bedroom stamina']), ...SEXPOS.map((id) => [id, 'Sex positions'])]);
const TAGS = ['Strength', 'Cardio & combat', 'Mind & body'];
const HOME = new Set(['sexPositionsHome', 'sexFuckHome', 'sexWarm']);
const PLACES = new Set(['shower', 'pool', 'hottub', 'balcony', 'doorframe']);
const BANNED = /\b(slot|slots|dealt|deals|deal|catalogue|old ones|new ones|old positions|new positions|positions you (already )?know|the new exercises)\b/i;
const explicit = new Set(poolsAt(11).explicit);
const inPool = (name, id) => (name === 'explicit' ? explicit.has(id) : (POOLS[name] || []).includes(id));
const cfgOf = (id) => CONFIGS.find((c) => c.id === id);
const mains = (d) => d.blocks.filter((b) => b.kind !== 'abs' && b.kind !== 'warmup' && b.kind !== 'cooldown');
const programs = built(IDS);
const prog = (id) => programs.find((p) => p.id === id);
const closer = (id) => {
  if (SHAPE[id] === 'gym') return 'Level II adds reps to the partner work. Level III holds every position longer.';
  if (SHAPE[id] === 'positions') return 'Level II and Level III hold every position longer.';
  return 'Level II and Level III hold every part longer.';
};
const sexSlots = (id) => Object.values(cfgOf(id).dayTypes).flatMap((t) => {
  const blocks = SHAPE[id] === 'gym' ? t.blocks.slice(1) : t.blocks;
  return blocks.flatMap((b) => (b.slots || []).map((s) => s.replace('?', '')));
});

test('Beach body, Bedroom stamina, Sex positions: 27 programs, for two, catalogue 13, added 20, 60 days', () => {
  assert.deepEqual(programs.map((p) => p.id), IDS);
  assert.equal(BEACH.length + BED.length + SEXPOS.length, 27);
  assert.deepEqual([BEACH_GYM.length, BEACH_SEX.length, BEACH_POS.length], [3, 3, 3]);
  assert.deepEqual([BED_GYM.length, BED_SEX.length, BED_POS.length], [3, 3, 3]);
  assert.deepEqual([SEXPOS_GYM.length, SEXPOS_SEX.length, SEXPOS_POS.length], [3, 3, 3]);
  IDS.forEach((id) => {
    const c = cfgOf(id);
    const p = prog(id);
    assert.equal(c.subject, SUBJECT[id], id);
    assert.equal(c.added, 20, id);
    assert.equal(c.catalogue, 13, id);
    assert.equal(c.couple, true, id);
    assert.equal(c.equip, 'bw', id);
    assert.deepEqual(c.minutes, [31, 40], id);
    assert.deepEqual(c.levers, SHAPE[id] === 'gym' ? [null, 'reps', 'holds'] : [null, 'holds', 'holds'], id);
    assert.equal(p.days.length, 60, id);
    assert.deepEqual([1, 20, 21, 40, 41, 60].map((n) => p.days[n - 1].level), [1, 1, 2, 2, 3, 3], id);
    assert.ok(R.skipped.includes(id), id);
    assert.equal(c.blurb.trim(), c.blurb, id);
    assert.ok(c.blurb.length > 0 && c.blurb.length <= 140, `${id}: blurb is ${c.blurb.length}`);
    assert.deepEqual(c.blurb.match(/[.!?]/g), [c.blurb.at(-1)], `${id}: blurb is not one sentence`);
    assert.equal(c.about.trim(), c.about, id);
    assert.ok(!/[\r\n]/.test(c.about) && /[.!?]/.test(c.about), `${id}: about`);
    const sentences = c.about.split(/(?<=[.!?])\s+/).filter(Boolean);
    assert.ok(sentences.length >= 3 && sentences.length <= 6, `${id}: ${sentences.length} sentences`);
    assert.ok(sentences[0].trim().length <= 130, `${id}: first sentence is ${sentences[0].trim().length}`);
    assert.ok(c.about.endsWith(closer(id)), `${id}: closer`);
    assert.doesNotMatch(`${c.blurb}\n${c.about}`, BANNED, id);
  });
});

test('every day is its shape, gym then positions, sex then fuck, and minutes stay 31–40', () => {
  IDS.forEach((id) => {
    prog(id).days.forEach((d) => {
      const m = mains(d);
      const where = `${id} d${d.day}`;
      assert.ok(m.every((b) => TAGS.includes(b.family)), `${where}: untagged`);
      assert.ok(!d.blocks.some((b) => b.kind === 'abs'), `${where}: abs`);
      m.forEach((b) => {
        const ids = b.items.map((it) => it.ex);
        assert.equal(new Set(ids).size, ids.length, `${where} ${b.title}`);
        assert.ok(ids.every((ex) => EX[ex].cat === 'couple'), `${where}: a solo exercise`);
        assert.ok(ids.every((ex) => !PLACES.has(EX[ex].sub)), `${where}: place ${ids.find((ex) => PLACES.has(EX[ex].sub))}`);
      });
      assert.ok(inBand(d.est, [31, 40]), `${where}: ${d.est} min`);
      if (SHAPE[id] === 'gym') {
        assert.equal(m.length, 2, where);
        assert.equal(m[1].title, 'Positions', where);
        assert.equal(m[1].format, 'flow', where);
        assert.ok(m[0].items.every((it) => EX[it.ex].added === 10 && !inPool('explicit', it.ex) && !inPool('positions', it.ex)), `${where}: gym block`);
      } else if (SHAPE[id] === 'sex') {
        assert.equal(m.length, 2, where);
        assert.equal(m[0].title, 'Warm-up', where);
        assert.equal(m[1].title, 'Fuck', where);
      } else {
        assert.equal(m.length, 1, where);
        assert.equal(m[0].title, 'Positions', where);
        assert.equal(m[0].format, 'flow', where);
      }
    });
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

test('every sex slot names sexPositionsHome, sexFuckHome or sexWarm', () => {
  IDS.forEach((id) => {
    const slots = sexSlots(id);
    assert.ok(slots.length > 0, id);
    slots.forEach((n) => assert.ok(HOME.has(n), `${id}: ${n}`));
  });
});

test('20 unique day names per program, none matching any other config, none Day/Lead/Plain', () => {
  const seen = new Map();
  CONFIGS.forEach((c) => (c.names || []).forEach((n) => {
    if (!seen.has(n)) seen.set(n, c.id);
  }));
  IDS.forEach((id) => {
    const c = cfgOf(id);
    assert.equal(c.names.length, 20, id);
    assert.equal(new Set(c.names).size, 20, id);
    c.names.forEach((n) => {
      assert.doesNotMatch(n, /\bDay\b|Lead|Plain/, `${id}: ${n}`);
      assert.equal(seen.get(n), id, `${id}: ${n} also in ${seen.get(n)}`);
    });
  });
});
