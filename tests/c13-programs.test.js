// Phase 22 ticket 19: Rough and Kink-lite, 12 programs each. Same three shapes as Explicit, catalogue 13.
// One sex block names the subject's pool. The other sex blocks name one merged pool (sexWarm for Rough, sexFuck for
// Kink-lite). Rough sex-then-sex is the exception: every day is sexWarm, then a sexRough block last.
const test = require('node:test');
const assert = require('node:assert/strict');
const { EX } = require('../exercises.js');
const { CONFIGS, POOLS, poolsAt, mergedAt } = require('../program-builder.js');
const Builder = require('../program-builder.js');
const cat = require('../exercises.js');
const R = require('../recipes.js');
const { FAMILIES, SHELVES } = require('../app/library.js');

const ROUGH_GYM = ['rough-set-then-spank', 'rough-sweat-then-pin', 'rough-lift-then-hold', 'rough-grind-then-hair'];
const ROUGH_SEX = ['rough-spank-then-fuck', 'rough-pin-then-thrust', 'rough-quick-and-mean', 'rough-long-hold'];
const ROUGH_POS = ['rough-stay-and-spank', 'rough-pin-and-stay', 'rough-hair-and-hips', 'rough-held-down'];
const KINK_GYM = ['kink-set-then-blind', 'kink-sweat-then-cuffs', 'kink-lift-then-gag', 'kink-grind-then-wax'];
const KINK_SEX = ['kink-blind-then-fuck', 'kink-gag-then-ice', 'kink-quick-tie', 'kink-long-ice'];
const KINK_POS = ['kink-stay-blind', 'kink-cuffed-open', 'kink-gagged-holds', 'kink-ice-wax'];
const ROUGH = [...ROUGH_GYM, ...ROUGH_SEX, ...ROUGH_POS];
const KINK = [...KINK_GYM, ...KINK_SEX, ...KINK_POS];
const IDS = [...ROUGH, ...KINK];
const GYM = [...ROUGH_GYM, ...KINK_GYM];
const SEX = [...ROUGH_SEX, ...KINK_SEX];
const POS = [...ROUGH_POS, ...KINK_POS];
const SHAPE = Object.fromEntries([...GYM.map((id) => [id, 'gym']), ...SEX.map((id) => [id, 'sex']), ...POS.map((id) => [id, 'positions'])]);
const SHORT = new Set(['rough-quick-and-mean', 'kink-quick-tie']);
const LONG = new Set(['rough-long-hold', 'kink-long-ice']);
const TAGS = ['Strength', 'Cardio & combat', 'Mind & body'];
const BANNED = /\b(slot|slots|dealt|deals|deal|catalogue|old ones|new ones|old positions|new positions|positions you (already )?know|the new exercises)\b/i;
const ABSENT = /nothing goes in|does not go in|never goes in|doesn't go in/i;
const explicit = new Set(poolsAt(11).explicit);
const inPool = (name, id) => (name === 'explicit' ? explicit.has(id) : (POOLS[name] || []).includes(id));
const cfgOf = (id) => CONFIGS.find((c) => c.id === id);
const mains = (d) => d.blocks.filter((b) => b.kind !== 'abs' && b.kind !== 'warmup' && b.kind !== 'cooldown');
const programs = CONFIGS.filter((c) => IDS.includes(c.id)).map((c) => Builder.build(c, cat));
const prog = (id) => programs.find((p) => p.id === id);
const bare = (block) => (block.slots || []).map((s) => s.replace('?', ''));
const pure = (block, name) => bare(block).length > 0 && bare(block).every((n) => n === name);
const sexBlocks = (type) => type.blocks.filter((b) => bare(b).some((n) => ['sexPositions', 'sexWarm', 'sexFuck', 'sexRough', 'sexKink'].includes(n)));
const closer = (id) => {
  if (SHAPE[id] === 'gym') return 'Level II adds reps to the partner work. Level III holds every position longer.';
  if (SHAPE[id] === 'positions') return 'Level II and Level III hold every position longer.';
  return SHORT.has(id) ? 'Level II and Level III hold every part a little longer.' : 'Level II and Level III hold every part longer.';
};
const explicitNames = new Set(CONFIGS.filter((c) => c.subject === 'Explicit').flatMap((c) => c.names));

test('Rough and Kink-lite: 24 programs, for two, catalogue 13, 60 days, out of build your own', () => {
  assert.deepEqual(programs.map((p) => p.id), IDS);
  assert.equal(CONFIGS.filter((c) => c.subject === 'Rough').length, 12);
  assert.equal(CONFIGS.filter((c) => c.subject === 'Kink-lite').length, 12);
  assert.deepEqual([ROUGH_GYM.length, ROUGH_SEX.length, ROUGH_POS.length], [4, 4, 4]);
  assert.deepEqual([KINK_GYM.length, KINK_SEX.length, KINK_POS.length], [4, 4, 4]);
  const mixed = FAMILIES.find(([name]) => name === 'Mixed')[1];
  const after = SHELVES.find(([name]) => name === 'After dark')[1];
  assert.deepEqual(mixed.slice(mixed.indexOf('Explicit'), mixed.indexOf('Explicit') + 3), ['Explicit', 'Rough', 'Kink-lite']);
  assert.deepEqual(after.slice(after.indexOf('Explicit'), after.indexOf('Explicit') + 3), ['Explicit', 'Rough', 'Kink-lite']);
  IDS.forEach((id) => {
    const c = cfgOf(id);
    const p = prog(id);
    const [lo, hi] = SHORT.has(id) ? [22, 30] : LONG.has(id) ? [46, 54] : [31, 40];
    assert.equal(c.subject, ROUGH.includes(id) ? 'Rough' : 'Kink-lite', id);
    assert.equal(c.added, 20, id);
    assert.equal(c.catalogue, 13, id);
    assert.equal(c.couple, true, id);
    assert.equal(c.equip, 'bw', id);
    assert.deepEqual(c.minutes, [lo, hi], id);
    assert.deepEqual(c.levers, SHAPE[id] === 'gym' ? [null, 'reps', 'holds'] : [null, 'holds', 'holds'], id);
    assert.equal(p.days.length, 60, id);
    assert.deepEqual([1, 20, 21, 40, 41, 60].map((n) => p.days[n - 1].level), [1, 1, 2, 2, 3, 3], id);
    assert.ok(R.skipped.includes(id), id);
    assert.equal(c.names.length, 20, id);
    assert.equal(new Set(c.names).size, 20, id);
    assert.deepEqual(c.names.filter((n) => explicitNames.has(n)), [], id);
    assert.equal(c.blurb.trim(), c.blurb, id);
    assert.ok(c.blurb.length > 0 && c.blurb.length <= 140, `${id}: blurb is ${c.blurb.length}`);
    assert.deepEqual(c.blurb.match(/[.!?]/g), [c.blurb.at(-1)], `${id}: blurb is not one sentence`);
    assert.equal(c.about.trim(), c.about, id);
    assert.ok(!/[\r\n]/.test(c.about) && /[.!?]/.test(c.about), `${id}: about`);
    assert.ok(c.about.endsWith(closer(id)), `${id}: closer`);
    const sentences = c.about.split(/(?<=[.!?])\s+/).filter(Boolean);
    assert.ok(sentences.length >= 4 && sentences.length <= 5, `${id}: ${sentences.length} sentences`);
    assert.doesNotMatch(`${c.blurb}\n${c.about}`, BANNED, id);
    assert.doesNotMatch(`${c.blurb}\n${c.about}`, ABSENT, id);
    if (c.subject === 'Rough') assert.doesNotMatch(`${c.blurb}\n${c.about}\n${c.names.join('\n')}\n${c.split}`, /chok/i, id);
  });
  assert.deepEqual(R.pick({ subjects: ['Rough'] }), []);
  assert.deepEqual(R.pick({ subjects: ['Kink-lite'] }), []);
});

test('gym and positions cycle warm, warm, lead; Rough sex is warm then rough every day; Kink sex leads with kink once', () => {
  ROUGH_SEX.forEach((id) => {
    const c = cfgOf(id);
    const types = Object.values(c.dayTypes);
    assert.equal(types.length, 2, id);
    types.forEach((t) => {
      assert.deepEqual(t.blocks.map((b) => b.title), ['Warm-up', 'Rough'], id);
      assert.ok(pure(t.blocks[0], 'sexWarm'), id);
      assert.ok(pure(t.blocks[1], 'sexRough'), id);
    });
    assert.notEqual(JSON.stringify(types[0].blocks), JSON.stringify(types[1].blocks), id);
  });
  KINK_SEX.forEach((id) => {
    const types = Object.values(cfgOf(id).dayTypes);
    assert.equal(types.length, 2, id);
    types.forEach((t) => assert.deepEqual(t.blocks.map((b) => b.title), ['Warm-up', 'Fuck'], id));
    const lead = types.filter((t) => pure(t.blocks[0], 'sexKink'));
    assert.equal(lead.length, 1, id);
    assert.ok(pure(lead[0].blocks[1], 'sexFuck'), id);
    const rest = types.filter((t) => t !== lead[0]);
    assert.ok(rest[0].blocks.every((b) => pure(b, 'sexFuck')), id);
  });
  [...GYM, ...POS].forEach((id) => {
    const c = cfgOf(id);
    const own = c.subject === 'Rough' ? 'sexRough' : 'sexKink';
    const cover = c.subject === 'Rough' ? 'sexWarm' : 'sexFuck';
    assert.deepEqual([c.cycle[0], c.cycle[1] === c.cycle[0], c.cycle[2] !== c.cycle[0]], [c.cycle[0], true, true], id);
    const warm = c.dayTypes[c.cycle[0]];
    const lead = c.dayTypes[c.cycle[2]];
    const warmSex = sexBlocks(warm);
    const leadSex = sexBlocks(lead);
    assert.equal(warmSex.length, 1, id);
    assert.equal(leadSex.length, 1, id);
    assert.ok(pure(warmSex[0], cover), `${id}: warm`);
    assert.ok(pure(leadSex[0], own), `${id}: lead`);
    if (SHAPE[id] === 'gym') {
      assert.equal(warm.blocks.length, 2, id);
      assert.equal(lead.blocks.length, 2, id);
      assert.equal(warm.blocks[1].title, 'Positions', id);
      assert.equal(lead.blocks[1].title, 'Positions', id);
    }
  });
});

test('every day is its shape, the lead day draws the subject, and a Rough program stays inside the sexWarm window', () => {
  const warmIds = new Set(mergedAt(13).sexWarm);
  IDS.forEach((id) => {
    const c = cfgOf(id);
    const sub = c.subject === 'Rough' ? 'rough' : 'kink';
    const leadType = SHAPE[id] === 'sex' && c.subject === 'Rough'
      ? null
      : (SHAPE[id] === 'sex' ? Object.entries(c.dayTypes).find(([, t]) => pure(t.blocks[0], 'sexKink'))[0] : c.cycle[2]);
    let warmDraws = 0;
    prog(id).days.forEach((d) => {
      const m = mains(d);
      const where = `${id} d${d.day}`;
      assert.ok(m.every((b) => TAGS.includes(b.family)), `${where}: untagged`);
      assert.ok(!d.blocks.some((b) => b.kind === 'abs'), `${where}: abs`);
      m.forEach((b) => {
        const ids = b.items.map((it) => it.ex);
        assert.equal(new Set(ids).size, ids.length, `${where} ${b.title}`);
        assert.ok(ids.every((ex) => EX[ex].cat === 'couple'), `${where}: a solo exercise`);
        ids.forEach((ex) => { if (warmIds.has(ex)) warmDraws += 1; });
      });
      const drawn = m.some((b) => b.items.some((it) => EX[it.ex].sub === sub));
      if (leadType === null || d.type === leadType) assert.ok(drawn, `${where}: no ${sub}`);
      assert.ok(d.est >= c.minutes[0] && d.est <= c.minutes[1], `${where}: ${d.est} min, band ${c.minutes[0]}–${c.minutes[1]}`);
      if (SHAPE[id] === 'gym') {
        assert.equal(m.length, 2, where);
        assert.equal(m[1].title, 'Positions', where);
        assert.equal(m[1].format, 'flow', where);
        assert.ok(m[0].items.every((it) => EX[it.ex].added === 10 && !inPool('explicit', it.ex) && !inPool('positions', it.ex)), `${where}: gym block`);
      } else if (SHAPE[id] === 'sex') {
        assert.equal(m.length, 2, where);
        assert.equal(m[0].title, 'Warm-up', where);
        assert.equal(m[1].title, c.subject === 'Rough' ? 'Rough' : 'Fuck', where);
      } else {
        assert.equal(m.length, 1, where);
        assert.equal(m[0].title, 'Positions', where);
        assert.equal(m[0].format, 'flow', where);
      }
    });
    if (c.subject === 'Rough') assert.ok(warmDraws >= 277 && warmDraws <= 450, `${id}: ${warmDraws} sexWarm draws`);
  });
});

test('two families a day, except a day marked oneFamily, and only these positions-only days are marked', () => {
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

test('gym and positions abouts say what the other days hold', () => {
  [...ROUGH_GYM, ...ROUGH_POS].forEach((id) => {
    const about = cfgOf(id).about;
    assert.match(about, /two days in three/i, id);
    assert.match(about, /mouth/i, id);
    assert.match(about, /spank|pin|hair/i, id);
  });
  [...KINK_GYM, ...KINK_POS].forEach((id) => {
    const about = cfgOf(id).about;
    assert.match(about, /two days in three/i, id);
    assert.match(about, /fuck/i, id);
    assert.match(about, /blindfold|cuff|gag|ice|wax/i, id);
  });
  ROUGH_SEX.forEach((id) => assert.doesNotMatch(cfgOf(id).about, /two days in three/i, id));
});
