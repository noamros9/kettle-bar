// ci-only: builds or reads the whole program library; the commit hook skips it, CI runs it (decision 312)
// Phase 20 ticket 13: Date night warm-up, Positions tour, Morning glory / Sunday, 27 programs, three session shapes.
// The tours are 60 one-off days (decision 346): each day one position, first in its sex block, and one way in.
// Catalogue 13, home pools. Each sex block draws one of sexPositionsHome, sexFuckHome, sexWarm.
const test = require('node:test');
const assert = require('node:assert/strict');
const { EX } = require('../exercises.js');
const { CONFIGS, POOLS, poolsAt } = require('../program-builder.js');
const R = require('../recipes.js');
const { built } = require('./helpers/library.js');

const DATE_GYM = ['date-circuit-night', 'date-strength-night', 'date-kiss-night'];
const DATE_SEX = ['date-mouth-hands', 'date-fingers-mouth', 'date-tease-mouth'];
const DATE_POS = ['date-mix-holds', 'date-long-holds', 'date-deep-holds'];
const TOUR_GYM = ['stand-tour-sixty', 'strong-tour-sixty', 'face-tour-sixty'];
const TOUR_SEX = ['behind-tour-sixty', 'close-tour-sixty', 'deep-tour-sixty'];
const TOUR_POS = ['house-tour-sixty', 'grand-tour-sixty', 'kneel-tour-sixty'];
const MORNING_GYM = ['morning-circuit-bed', 'morning-strength-bed', 'morning-carry-bed'];
const MORNING_SEX = ['morning-mouth-hands', 'morning-fingers-bed', 'morning-tease-sheet'];
const MORNING_POS = ['sunday-mix-holds', 'sunday-long-holds', 'sunday-deep-holds'];
const DATE = [...DATE_GYM, ...DATE_SEX, ...DATE_POS];
const TOUR = [...TOUR_GYM, ...TOUR_SEX, ...TOUR_POS];
const MORNING = [...MORNING_GYM, ...MORNING_SEX, ...MORNING_POS];
const GYM = [...DATE_GYM, ...TOUR_GYM, ...MORNING_GYM];
const SEX = [...DATE_SEX, ...TOUR_SEX, ...MORNING_SEX];
const POS = [...DATE_POS, ...TOUR_POS, ...MORNING_POS];
const IDS = [...DATE, ...TOUR, ...MORNING];
const SHAPE = Object.fromEntries([...GYM.map((id) => [id, 'gym']), ...SEX.map((id) => [id, 'sex']), ...POS.map((id) => [id, 'positions'])]);
const SUBJECT = Object.fromEntries([...DATE.map((id) => [id, 'Date night warm-up']), ...TOUR.map((id) => [id, 'Positions tour']), ...MORNING.map((id) => [id, 'Morning glory / Sunday'])]);
// Date night 22–30 (decision 345), the tours 29–36 (346), Morning glory 48–58 (347)
const BAND = (id) => ({ 'Date night warm-up': [22, 30], 'Positions tour': [29, 36], 'Morning glory / Sunday': [48, 58] })[SUBJECT[id]];
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

test('Date night warm-up, Positions tour, Morning glory / Sunday: 27 programs, for two, catalogue 13, added 20, 60 days', () => {
  assert.deepEqual(programs.map((p) => p.id), IDS);
  assert.equal(DATE.length + TOUR.length + MORNING.length, 27);
  [[DATE_GYM, DATE_SEX, DATE_POS], [TOUR_GYM, TOUR_SEX, TOUR_POS], [MORNING_GYM, MORNING_SEX, MORNING_POS]].forEach((s) => assert.deepEqual(s.map((l) => l.length), [3, 3, 3]));
  IDS.forEach((id) => {
    const c = cfgOf(id);
    const p = prog(id);
    assert.equal(c.subject, SUBJECT[id], id);
    assert.equal(c.added, 20, id);
    assert.equal(c.catalogue, 13, id);
    assert.equal(c.couple, true, id);
    assert.equal(c.equip, 'bw', id);
    assert.deepEqual(c.minutes, BAND(id), id);
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

test('every day is its shape, gym then positions, sex then fuck, and minutes stay in the band', () => {
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
      assert.ok(d.est >= BAND(id)[0] && d.est <= BAND(id)[1], `${where}: ${d.est} min`);
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
    const own = new Set(TOUR.includes(id) ? Object.values(cfgOf(id).dayTypes).map((ty) => ty.blocks.at(-1).slots[0]) : []);
    slots.forEach((n) => assert.ok(HOME.has(n) || own.has(n), `${id}: ${n}`));
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

test('each tour is 60 one-off days, 30 positions × 2 ways, its position first in the sex block and every pussy position', () => {
  TOUR.forEach((id) => {
    const c = cfgOf(id);
    assert.equal(c.cycle.length, 60, id);
    assert.equal(new Set(c.cycle).size, 60, id);
    const pos = c.cycle.map((k) => c.dayTypes[k].blocks.at(-1).slots[0]);
    assert.equal(new Set(pos).size, 30, id);
    pos.forEach((p) => assert.match(p, /^(pos|fuck)_/, `${id}: ${p}`));
    prog(id).days.forEach((d, i) => assert.equal(mains(d).at(-1).items[0].ex, pos[i], `${id} d${d.day}`));
  });
});
