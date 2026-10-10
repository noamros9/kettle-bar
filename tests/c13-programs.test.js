// ci-only: builds or reads the whole program library; the commit hook skips it, CI runs it (decision 312)
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
const { built } = require('./helpers/library.js');
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
const programs = built(IDS); // the shared build (Phase 31 ticket 5)
const prog = (id) => programs.find((p) => p.id === id);
const bare = (block) => (block.slots || []).map((s) => s.replace('?', ''));
const pure = (block, name) => bare(block).length > 0 && bare(block).every((n) => n === name);
const sexBlocks = (type) => type.blocks.filter((b) => bare(b).some((n) => ['sexPositions', 'sexWarm', 'sexFuck', 'sexRough', 'sexKink', 'sexBody', 'sexRim', 'sexEdging', 'sexMassage', 'sexTease', 'sexShower', 'sexPool', 'sexHottub', 'sexBalcony', 'sexDoorframe'].includes(n)));
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

// Phase 22 ticket 20: Body play and Rimming, 12 each. Body play pairs sexBody with sexWarm, like Rough.
// Rimming pairs sexRim with sexFuck, like Kink-lite. Body sex days are sexWarm, then a sexBody block last.
const BODY_GYM = ['body-set-then-tits', 'body-sweat-then-grind', 'body-lift-then-thigh', 'body-push-then-cum'];
const BODY_SEX = ['body-tits-then-hold', 'body-grind-then-hold', 'body-quick-and-slick', 'body-long-on-her'];
const BODY_POS = ['body-stay-on-tits', 'body-grind-and-stay', 'body-thighs-and-hips', 'body-cum-on-her'];
const RIM_GYM = ['rim-set-then-tongue', 'rim-sweat-then-ass', 'rim-lift-then-rim', 'rim-grind-then-tongue'];
const RIM_SEX = ['rim-tongue-then-fuck', 'rim-ass-then-cock', 'rim-quick-lick', 'rim-long-tongue'];
const RIM_POS = ['rim-stay-and-lick', 'rim-open-and-eat', 'rim-tongue-holds', 'rim-her-tongue'];
const BODY = [...BODY_GYM, ...BODY_SEX, ...BODY_POS];
const RIM = [...RIM_GYM, ...RIM_SEX, ...RIM_POS];
const IDS20 = [...BODY, ...RIM];
const GYM20 = [...BODY_GYM, ...RIM_GYM];
const SEX20 = [...BODY_SEX, ...RIM_SEX];
const POS20 = [...BODY_POS, ...RIM_POS];
const SHAPE20 = Object.fromEntries([...GYM20.map((id) => [id, 'gym']), ...SEX20.map((id) => [id, 'sex']), ...POS20.map((id) => [id, 'positions'])]);
const SHORT20 = new Set(['body-quick-and-slick', 'rim-quick-lick']);
const LONG20 = new Set(['body-long-on-her', 'rim-long-tongue']);
const programs20 = built(IDS20); // the shared build (Phase 31 ticket 5)
const prog20 = (id) => programs20.find((p) => p.id === id);
const closer20 = (id) => {
  if (SHAPE20[id] === 'gym') return 'Level II adds reps to the partner work. Level III holds every position longer.';
  if (SHAPE20[id] === 'positions') return 'Level II and Level III hold every position longer.';
  return SHORT20.has(id) ? 'Level II and Level III hold every part a little longer.' : 'Level II and Level III hold every part longer.';
};
const olderNames = new Set(CONFIGS.filter((c) => ['Explicit', 'Rough', 'Kink-lite'].includes(c.subject)).flatMap((c) => c.names));

test('Body play and Rimming: 24 programs, for two, catalogue 13, 60 days, out of build your own', () => {
  assert.deepEqual(programs20.map((p) => p.id), IDS20);
  assert.equal(CONFIGS.filter((c) => c.subject === 'Body play').length, 12);
  assert.equal(CONFIGS.filter((c) => c.subject === 'Rimming').length, 12);
  assert.deepEqual([BODY_GYM.length, BODY_SEX.length, BODY_POS.length], [4, 4, 4]);
  assert.deepEqual([RIM_GYM.length, RIM_SEX.length, RIM_POS.length], [4, 4, 4]);
  const mixed = FAMILIES.find(([name]) => name === 'Mixed')[1];
  const after = SHELVES.find(([name]) => name === 'After dark')[1];
  assert.deepEqual(mixed.slice(mixed.indexOf('Explicit'), mixed.indexOf('Explicit') + 5), ['Explicit', 'Rough', 'Kink-lite', 'Body play', 'Rimming']);
  assert.deepEqual(after.slice(after.indexOf('Explicit'), after.indexOf('Explicit') + 5), ['Explicit', 'Rough', 'Kink-lite', 'Body play', 'Rimming']);
  IDS20.forEach((id) => {
    const c = cfgOf(id);
    const p = prog20(id);
    const [lo, hi] = SHORT20.has(id) ? [22, 30] : LONG20.has(id) ? [46, 54] : [31, 40];
    assert.equal(c.subject, BODY.includes(id) ? 'Body play' : 'Rimming', id);
    assert.equal(c.added, 20, id);
    assert.equal(c.catalogue, 13, id);
    assert.equal(c.couple, true, id);
    assert.equal(c.equip, 'bw', id);
    assert.deepEqual(c.minutes, [lo, hi], id);
    assert.deepEqual(c.levers, SHAPE20[id] === 'gym' ? [null, 'reps', 'holds'] : [null, 'holds', 'holds'], id);
    assert.equal(p.days.length, 60, id);
    assert.deepEqual([1, 20, 21, 40, 41, 60].map((n) => p.days[n - 1].level), [1, 1, 2, 2, 3, 3], id);
    assert.ok(R.skipped.includes(id), id);
    assert.equal(c.names.length, 20, id);
    assert.equal(new Set(c.names).size, 20, id);
    assert.deepEqual(c.names.filter((n) => olderNames.has(n)), [], id);
    assert.equal(c.blurb.trim(), c.blurb, id);
    assert.ok(c.blurb.length > 0 && c.blurb.length <= 140, `${id}: blurb is ${c.blurb.length}`);
    assert.deepEqual(c.blurb.match(/[.!?]/g), [c.blurb.at(-1)], `${id}: blurb is not one sentence`);
    assert.equal(c.about.trim(), c.about, id);
    assert.ok(!/[\r\n]/.test(c.about) && /[.!?]/.test(c.about), `${id}: about`);
    assert.ok(c.about.endsWith(closer20(id)), `${id}: closer`);
    const sentences = c.about.split(/(?<=[.!?])\s+/).filter(Boolean);
    assert.ok(sentences.length >= 4 && sentences.length <= 5, `${id}: ${sentences.length} sentences`);
    assert.doesNotMatch(`${c.blurb}\n${c.about}`, BANNED, id);
    assert.doesNotMatch(`${c.blurb}\n${c.about}`, ABSENT, id);
    assert.doesNotMatch(`${c.blurb}\n${c.about}\n${c.names.join('\n')}\n${c.split}`, /chok/i, id);
  });
  assert.deepEqual(R.pick({ subjects: ['Body play'] }), []);
  assert.deepEqual(R.pick({ subjects: ['Rimming'] }), []);
});

test('gym and positions cycle warm, warm, lead; Body sex is warm then body every day; Rim sex leads with rim once', () => {
  BODY_SEX.forEach((id) => {
    const c = cfgOf(id);
    const types = Object.values(c.dayTypes);
    assert.equal(types.length, 2, id);
    types.forEach((t) => {
      assert.deepEqual(t.blocks.map((b) => b.title), ['Warm-up', 'Body'], id);
      assert.ok(pure(t.blocks[0], 'sexWarm'), id);
      assert.ok(pure(t.blocks[1], 'sexBody'), id);
    });
    assert.notEqual(JSON.stringify(types[0].blocks), JSON.stringify(types[1].blocks), id);
  });
  RIM_SEX.forEach((id) => {
    const types = Object.values(cfgOf(id).dayTypes);
    assert.equal(types.length, 2, id);
    types.forEach((t) => assert.deepEqual(t.blocks.map((b) => b.title), ['Warm-up', 'Fuck'], id));
    const lead = types.filter((t) => pure(t.blocks[0], 'sexRim'));
    assert.equal(lead.length, 1, id);
    assert.ok(pure(lead[0].blocks[1], 'sexFuck'), id);
    const rest = types.filter((t) => t !== lead[0]);
    assert.ok(rest[0].blocks.every((b) => pure(b, 'sexFuck')), id);
  });
  [...GYM20, ...POS20].forEach((id) => {
    const c = cfgOf(id);
    const own = c.subject === 'Body play' ? 'sexBody' : 'sexRim';
    const cover = c.subject === 'Body play' ? 'sexWarm' : 'sexFuck';
    assert.deepEqual([c.cycle[0], c.cycle[1] === c.cycle[0], c.cycle[2] !== c.cycle[0]], [c.cycle[0], true, true], id);
    const warm = c.dayTypes[c.cycle[0]];
    const lead = c.dayTypes[c.cycle[2]];
    const warmSex = sexBlocks(warm);
    const leadSex = sexBlocks(lead);
    assert.ok(warmSex.every((b) => pure(b, cover)), `${id}: warm`);
    assert.ok(pure(leadSex[0], own), `${id}: lead`);
    if (POS20.includes(id) && c.subject === 'Rimming') {
      assert.equal(warmSex.length, 1, id);
      assert.equal(leadSex.length, 2, id);
      assert.ok(pure(leadSex[1], 'sexFuck'), id);
    } else {
      assert.equal(warmSex.length, 1, id);
      assert.equal(leadSex.length, 1, id);
    }
    if (SHAPE20[id] === 'gym') {
      assert.equal(warm.blocks.length, 2, id);
      assert.equal(lead.blocks.length, 2, id);
      assert.equal(warm.blocks[1].title, 'Positions', id);
      assert.equal(lead.blocks[1].title, 'Positions', id);
    }
  });
});

test('every day is its shape, the lead day draws the subject, and a Body play program stays inside the sexWarm window', () => {
  const warmIds = new Set(mergedAt(13).sexWarm);
  IDS20.forEach((id) => {
    const c = cfgOf(id);
    const sub = c.subject === 'Body play' ? 'body' : 'rim';
    const leadType = SHAPE20[id] === 'sex' && c.subject === 'Body play'
      ? null
      : (SHAPE20[id] === 'sex' ? Object.entries(c.dayTypes).find(([, t]) => pure(t.blocks[0], 'sexRim'))[0] : c.cycle[2]);
    let warmDraws = 0;
    prog20(id).days.forEach((d) => {
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
      if (SHAPE20[id] === 'gym') {
        assert.equal(m.length, 2, where);
        assert.equal(m[1].title, 'Positions', where);
        assert.equal(m[1].format, 'flow', where);
        assert.ok(m[0].items.every((it) => EX[it.ex].added === 10 && !inPool('explicit', it.ex) && !inPool('positions', it.ex)), `${where}: gym block`);
      } else if (SHAPE20[id] === 'sex') {
        assert.equal(m.length, 2, where);
        assert.equal(m[0].title, 'Warm-up', where);
        assert.equal(m[1].title, c.subject === 'Body play' ? 'Body' : 'Fuck', where);
      } else {
        const blocks = c.subject === 'Rimming' && d.type === 'lead' ? 2 : 1;
        assert.equal(m.length, blocks, where);
        m.forEach((b) => {
          assert.equal(b.title, 'Positions', where);
          assert.equal(b.format, 'flow', where);
        });
      }
    });
    if (c.subject === 'Body play') assert.ok(warmDraws >= 277 && warmDraws <= 450, `${id}: ${warmDraws} sexWarm draws`);
  });
});

test('Body play and Rimming: two families a day, except a day marked oneFamily', () => {
  const marked = [];
  IDS20.forEach((id) => Object.entries(cfgOf(id).dayTypes).forEach(([k, t]) => { if (t.oneFamily) marked.push(`${id}:${k}`); }));
  const expect = POS20.flatMap((id) => Object.keys(cfgOf(id).dayTypes).map((k) => `${id}:${k}`));
  assert.deepEqual(marked.sort(), expect.sort());
  IDS20.forEach((id) => {
    const cfg = cfgOf(id);
    prog20(id).days.forEach((d) => {
      const n = new Set(mains(d).map((b) => b.family)).size;
      if (cfg.dayTypes[d.type].oneFamily) assert.equal(n, 1, `${id} d${d.day}: positions-only is one family`);
      else assert.ok(n >= 2, `${id} d${d.day}: two families`);
      assert.equal(!!cfg.dayTypes[d.type].oneFamily, SHAPE20[id] === 'positions', `${id} d${d.day}: mark`);
    });
  });
});

test('Body play and Rimming abouts say what the other days hold, and her rim places him', () => {
  [...BODY_GYM, ...BODY_POS].forEach((id) => {
    const about = cfgOf(id).about;
    assert.match(about, /two days in three/i, id);
    assert.match(about, /mouth/i, id);
    assert.match(about, /tit|grind|thigh|cum/i, id);
  });
  [...RIM_GYM, ...RIM_POS].forEach((id) => {
    const about = cfgOf(id).about;
    assert.match(about, /two days in three/i, id);
    assert.match(about, /fuck/i, id);
    assert.match(about, /tongue|asshole/i, id);
  });
  [...BODY_SEX, ...RIM_SEX].forEach((id) => assert.doesNotMatch(cfgOf(id).about, /two days in three/i, id));
  RIM.forEach((id) => {
    const c = cfgOf(id);
    assert.match(c.about, /standing tall|lying flat on your back/, id);
    assert.match(c.about, /your asshole/, id);
    assert.doesNotMatch(`${c.blurb}\n${c.about}\n${c.names.join('\n')}\n${c.split}`, /all fours|bent over|ass up/i, id);
  });
  assert.match(cfgOf('rim-her-tongue').blurb, /standing tall|lying flat on your back/);
});

// Phase 22 ticket 20b: Edging and Massage, 12 each. Edging pairs sexEdging with sexWarm, like Rough.
// Massage pairs sexMassage with sexFuck, like Kink-lite. Edging sex days are sexWarm, then a sexEdging block last.
const EDGE_GYM = ['edge-set-then-stop', 'edge-sweat-then-out', 'edge-lift-then-slow', 'edge-squat-then-still'];
const EDGE_SEX = ['edge-stop-then-fuck', 'edge-out-then-shallow', 'edge-quick-stop', 'edge-long-still'];
const EDGE_POS = ['edge-stay-and-stop', 'edge-pull-and-stay', 'edge-slow-and-deep', 'edge-brace-and-hold'];
const MASS_GYM = ['massage-set-then-oil', 'massage-sweat-then-hands', 'massage-lift-then-back', 'massage-squat-then-oil'];
const MASS_SEX = ['massage-oil-then-fuck', 'massage-forearm-then-fuck', 'massage-quick-oil', 'massage-long-oil'];
const MASS_POS = ['massage-stay-oiled', 'massage-hands-down-her', 'massage-oiled-holds', 'massage-she-oils-you'];
const EDGE = [...EDGE_GYM, ...EDGE_SEX, ...EDGE_POS];
const MASS = [...MASS_GYM, ...MASS_SEX, ...MASS_POS];
const IDS20B = [...EDGE, ...MASS];
const GYM20B = [...EDGE_GYM, ...MASS_GYM];
const SEX20B = [...EDGE_SEX, ...MASS_SEX];
const POS20B = [...EDGE_POS, ...MASS_POS];
const SHAPE20B = Object.fromEntries([...GYM20B.map((id) => [id, 'gym']), ...SEX20B.map((id) => [id, 'sex']), ...POS20B.map((id) => [id, 'positions'])]);
const SHORT20B = new Set(['edge-quick-stop', 'massage-quick-oil']);
const LONG20B = new Set(['edge-long-still', 'massage-long-oil']);
const programs20b = built(IDS20B); // the shared build (Phase 31 ticket 5)
const prog20b = (id) => programs20b.find((p) => p.id === id);
const closer20b = (id) => {
  if (SHAPE20B[id] === 'gym') return 'Level II adds reps to the partner work. Level III holds every position longer.';
  if (SHAPE20B[id] === 'positions') return 'Level II and Level III hold every position longer.';
  return SHORT20B.has(id) ? 'Level II and Level III hold every part a little longer.' : 'Level II and Level III hold every part longer.';
};
const olderNames20b = new Set(CONFIGS.filter((c) => ['Explicit', 'Rough', 'Kink-lite', 'Body play', 'Rimming'].includes(c.subject)).flatMap((c) => c.names));
const SCHEDULE20B = /\b(day|days|third|lead|plain|second|next|warm)\b|both holds|fuck hold|from the start|other day|the hold|next hold/i;

test('Edging and Massage: 24 programs, for two, catalogue 13, 60 days, out of build your own', () => {
  assert.deepEqual(programs20b.map((p) => p.id), IDS20B);
  assert.equal(CONFIGS.filter((c) => c.subject === 'Edging').length, 12);
  assert.equal(CONFIGS.filter((c) => c.subject === 'Massage').length, 12);
  assert.deepEqual([EDGE_GYM.length, EDGE_SEX.length, EDGE_POS.length], [4, 4, 4]);
  assert.deepEqual([MASS_GYM.length, MASS_SEX.length, MASS_POS.length], [4, 4, 4]);
  const mixed = FAMILIES.find(([name]) => name === 'Mixed')[1];
  const after = SHELVES.find(([name]) => name === 'After dark')[1];
  assert.deepEqual(mixed.slice(mixed.indexOf('Explicit'), mixed.indexOf('Explicit') + 7), ['Explicit', 'Rough', 'Kink-lite', 'Body play', 'Rimming', 'Edging', 'Massage']);
  assert.deepEqual(after.slice(after.indexOf('Explicit'), after.indexOf('Explicit') + 7), ['Explicit', 'Rough', 'Kink-lite', 'Body play', 'Rimming', 'Edging', 'Massage']);
  const allNames = [];
  IDS20B.forEach((id) => {
    const c = cfgOf(id);
    const p = prog20b(id);
    const [lo, hi] = SHORT20B.has(id) ? [22, 30] : LONG20B.has(id) ? [46, 54] : [31, 40];
    assert.equal(c.subject, EDGE.includes(id) ? 'Edging' : 'Massage', id);
    assert.equal(c.added, 20, id);
    assert.equal(c.catalogue, 13, id);
    assert.equal(c.couple, true, id);
    assert.equal(c.equip, 'bw', id);
    assert.deepEqual(c.minutes, [lo, hi], id);
    assert.deepEqual(c.levers, SHAPE20B[id] === 'gym' ? [null, 'reps', 'holds'] : [null, 'holds', 'holds'], id);
    assert.equal(p.days.length, 60, id);
    assert.deepEqual([1, 20, 21, 40, 41, 60].map((n) => p.days[n - 1].level), [1, 1, 2, 2, 3, 3], id);
    assert.ok(R.skipped.includes(id), id);
    assert.equal(c.names.length, 20, id);
    assert.equal(new Set(c.names).size, 20, id);
    assert.deepEqual(c.names.filter((n) => olderNames20b.has(n)), [], id);
    c.names.forEach((n) => assert.doesNotMatch(n, SCHEDULE20B, `${id}: ${n}`));
    allNames.push(...c.names);
    assert.equal(c.blurb.trim(), c.blurb, id);
    assert.ok(c.blurb.length > 0 && c.blurb.length <= 140, `${id}: blurb is ${c.blurb.length}`);
    assert.deepEqual(c.blurb.match(/[.!?]/g), [c.blurb.at(-1)], `${id}: blurb is not one sentence`);
    assert.equal(c.about.trim(), c.about, id);
    assert.ok(!/[\r\n]/.test(c.about) && /[.!?]/.test(c.about), `${id}: about`);
    assert.ok(c.about.endsWith(closer20b(id)), `${id}: closer`);
    const sentences = c.about.split(/(?<=[.!?])\s+/).filter(Boolean);
    assert.ok(sentences.length >= 4 && sentences.length <= 5, `${id}: ${sentences.length} sentences`);
    assert.doesNotMatch(`${c.blurb}\n${c.about}`, BANNED, id);
    assert.doesNotMatch(`${c.blurb}\n${c.about}`, ABSENT, id);
    assert.doesNotMatch(`${c.blurb}\n${c.about}\n${c.names.join('\n')}\n${c.split}`, /chok/i, id);
  });
  assert.equal(new Set(allNames).size, allNames.length);
  assert.deepEqual(R.pick({ subjects: ['Edging'] }), []);
  assert.deepEqual(R.pick({ subjects: ['Massage'] }), []);
});

test('gym and positions cycle warm, warm, lead; Edging sex is warm then edging every day; Massage sex leads with massage once', () => {
  EDGE_SEX.forEach((id) => {
    const c = cfgOf(id);
    const types = Object.values(c.dayTypes);
    assert.equal(types.length, 2, id);
    types.forEach((t) => {
      assert.deepEqual(t.blocks.map((b) => b.title), ['Warm-up', 'Edging'], id);
      assert.ok(pure(t.blocks[0], 'sexWarm'), id);
      assert.ok(pure(t.blocks[1], 'sexEdging'), id);
    });
    assert.notEqual(JSON.stringify(types[0].blocks), JSON.stringify(types[1].blocks), id);
  });
  MASS_SEX.forEach((id) => {
    const types = Object.values(cfgOf(id).dayTypes);
    assert.equal(types.length, 2, id);
    types.forEach((t) => assert.deepEqual(t.blocks.map((b) => b.title), ['Warm-up', 'Fuck'], id));
    const lead = types.filter((t) => pure(t.blocks[0], 'sexMassage'));
    assert.equal(lead.length, 1, id);
    assert.ok(pure(lead[0].blocks[1], 'sexFuck'), id);
    const rest = types.filter((t) => t !== lead[0]);
    assert.ok(rest[0].blocks.every((b) => pure(b, 'sexFuck')), id);
  });
  [...GYM20B, ...POS20B].forEach((id) => {
    const c = cfgOf(id);
    const own = c.subject === 'Edging' ? 'sexEdging' : 'sexMassage';
    const cover = c.subject === 'Edging' ? 'sexWarm' : 'sexFuck';
    assert.deepEqual([c.cycle[0], c.cycle[1] === c.cycle[0], c.cycle[2] !== c.cycle[0]], [c.cycle[0], true, true], id);
    const warm = c.dayTypes[c.cycle[0]];
    const lead = c.dayTypes[c.cycle[2]];
    const warmSex = sexBlocks(warm);
    const leadSex = sexBlocks(lead);
    assert.ok(warmSex.every((b) => pure(b, cover)), `${id}: warm`);
    assert.ok(pure(leadSex[0], own), `${id}: lead`);
    assert.equal(warmSex.length, 1, id);
    assert.equal(leadSex.length, 1, id);
    if (SHAPE20B[id] === 'gym') {
      assert.equal(warm.blocks.length, 2, id);
      assert.equal(lead.blocks.length, 2, id);
      assert.equal(warm.blocks[1].title, 'Positions', id);
      assert.equal(lead.blocks[1].title, 'Positions', id);
    }
  });
});

test('every day is its shape, the lead day draws the subject, and an Edging program stays inside the sexWarm window', () => {
  const warmIds = new Set(mergedAt(13).sexWarm);
  IDS20B.forEach((id) => {
    const c = cfgOf(id);
    const sub = c.subject === 'Edging' ? 'edging' : 'massage';
    const leadType = SHAPE20B[id] === 'sex' && c.subject === 'Edging'
      ? null
      : (SHAPE20B[id] === 'sex' ? Object.entries(c.dayTypes).find(([, t]) => pure(t.blocks[0], 'sexMassage'))[0] : c.cycle[2]);
    let warmDraws = 0;
    prog20b(id).days.forEach((d) => {
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
      if (SHAPE20B[id] === 'gym') {
        assert.equal(m.length, 2, where);
        assert.equal(m[1].title, 'Positions', where);
        assert.equal(m[1].format, 'flow', where);
        assert.ok(m[0].items.every((it) => EX[it.ex].added === 10 && !inPool('explicit', it.ex) && !inPool('positions', it.ex)), `${where}: gym block`);
      } else if (SHAPE20B[id] === 'sex') {
        assert.equal(m.length, 2, where);
        assert.equal(m[0].title, 'Warm-up', where);
        assert.equal(m[1].title, c.subject === 'Edging' ? 'Edging' : 'Fuck', where);
      } else {
        assert.equal(m.length, 1, where);
        assert.equal(m[0].title, 'Positions', where);
        assert.equal(m[0].format, 'flow', where);
      }
    });
    if (c.subject === 'Edging') assert.ok(warmDraws >= 277 && warmDraws <= 450, `${id}: ${warmDraws} sexWarm draws`);
  });
});

test('Edging and Massage: two families a day, except a day marked oneFamily', () => {
  const marked = [];
  IDS20B.forEach((id) => Object.entries(cfgOf(id).dayTypes).forEach(([k, t]) => { if (t.oneFamily) marked.push(`${id}:${k}`); }));
  const expect = POS20B.flatMap((id) => Object.keys(cfgOf(id).dayTypes).map((k) => `${id}:${k}`));
  assert.deepEqual(marked.sort(), expect.sort());
  IDS20B.forEach((id) => {
    const cfg = cfgOf(id);
    prog20b(id).days.forEach((d) => {
      const n = new Set(mains(d).map((b) => b.family)).size;
      if (cfg.dayTypes[d.type].oneFamily) assert.equal(n, 1, `${id} d${d.day}: positions-only is one family`);
      else assert.ok(n >= 2, `${id} d${d.day}: two families`);
      assert.equal(!!cfg.dayTypes[d.type].oneFamily, SHAPE20B[id] === 'positions', `${id} d${d.day}: mark`);
    });
  });
});

test('Edging and Massage abouts say what the other days hold', () => {
  [...EDGE_GYM, ...EDGE_POS].forEach((id) => {
    const about = cfgOf(id).about;
    assert.match(about, /two days in three/i, id);
    assert.match(about, /mouth/i, id);
    assert.match(about, /stop|pull|shallow|brace|still/i, id);
  });
  [...MASS_GYM, ...MASS_POS].forEach((id) => {
    const about = cfgOf(id).about;
    assert.match(about, /two days in three/i, id);
    assert.match(about, /fuck/i, id);
    assert.match(about, /oil|forearm/i, id);
  });
  [...EDGE_SEX, ...MASS_SEX].forEach((id) => assert.doesNotMatch(cfgOf(id).about, /two days in three/i, id));
});

// Phase 22 ticket 20c: Strip and tease, and Shower and bath, 12 each. Strip and tease pairs sexTease with sexFuck.
// Shower and bath pairs sexShower with sexWarm. Shower sex days are sexWarm, then a sexShower block last.
// Strip and tease positions are one flow on every day: sexTease on the lead, sexFuck on the warm days.
const TEASE_GYM = ['tease-set-then-zip', 'tease-sweat-then-bra', 'tease-lift-then-panties', 'tease-grind-then-lap'];
const TEASE_SEX = ['tease-zip-then-fuck', 'tease-bra-then-cock', 'tease-quick-strip', 'tease-long-strip'];
const TEASE_POS = ['tease-stay-and-peel', 'tease-skirt-up', 'tease-dry-holds', 'tease-her-strip'];
const SHOWER_GYM = ['shower-set-then-tile', 'shower-sweat-then-soap', 'shower-lift-then-tub', 'shower-push-then-stream'];
const SHOWER_SEX = ['shower-tile-then-hold', 'shower-soap-then-hold', 'shower-quick-and-wet', 'shower-long-steam'];
const SHOWER_POS = ['shower-stay-on-tile', 'shower-soap-and-stay', 'shower-tub-and-hips', 'shower-stream-on-her'];
const TEASE = [...TEASE_GYM, ...TEASE_SEX, ...TEASE_POS];
const SHOWER = [...SHOWER_GYM, ...SHOWER_SEX, ...SHOWER_POS];
const IDS20C = [...TEASE, ...SHOWER];
const GYM20C = [...TEASE_GYM, ...SHOWER_GYM];
const SEX20C = [...TEASE_SEX, ...SHOWER_SEX];
const POS20C = [...TEASE_POS, ...SHOWER_POS];
const SHAPE20C = Object.fromEntries([...GYM20C.map((id) => [id, 'gym']), ...SEX20C.map((id) => [id, 'sex']), ...POS20C.map((id) => [id, 'positions'])]);
const SHORT20C = new Set(['tease-quick-strip', 'shower-quick-and-wet']);
const LONG20C = new Set(['tease-long-strip', 'shower-long-steam']);
const programs20c = built(IDS20C); // the shared build (Phase 31 ticket 5)
const prog20c = (id) => programs20c.find((p) => p.id === id);
const closer20c = (id) => {
  if (SHAPE20C[id] === 'gym') return 'Level II adds reps to the partner work. Level III holds every position longer.';
  if (SHAPE20C[id] === 'positions') return 'Level II and Level III hold every position longer.';
  return SHORT20C.has(id) ? 'Level II and Level III hold every part a little longer.' : 'Level II and Level III hold every part longer.';
};
const olderNames20c = new Set(CONFIGS.filter((c) => ['Explicit', 'Rough', 'Kink-lite', 'Body play', 'Rimming', 'Edging', 'Massage'].includes(c.subject)).flatMap((c) => c.names));
const SCHEDULE20C = /\b(day|days|lead|plain|third)\b/i;

test('Strip and tease, and Shower and bath: 24 programs, for two, catalogue 13, 60 days, out of build your own', () => {
  assert.deepEqual(programs20c.map((p) => p.id), IDS20C);
  assert.equal(CONFIGS.filter((c) => c.subject === 'Strip and tease').length, 12);
  assert.equal(CONFIGS.filter((c) => c.subject === 'Shower and bath').length, 12);
  assert.deepEqual([TEASE_GYM.length, TEASE_SEX.length, TEASE_POS.length], [4, 4, 4]);
  assert.deepEqual([SHOWER_GYM.length, SHOWER_SEX.length, SHOWER_POS.length], [4, 4, 4]);
  const mixed = FAMILIES.find(([name]) => name === 'Mixed')[1];
  const after = SHELVES.find(([name]) => name === 'After dark')[1];
  assert.deepEqual(mixed.slice(mixed.indexOf('Explicit'), mixed.indexOf('Explicit') + 9), ['Explicit', 'Rough', 'Kink-lite', 'Body play', 'Rimming', 'Edging', 'Massage', 'Strip and tease', 'Shower and bath']);
  assert.deepEqual(after.slice(after.indexOf('Explicit'), after.indexOf('Explicit') + 9), ['Explicit', 'Rough', 'Kink-lite', 'Body play', 'Rimming', 'Edging', 'Massage', 'Strip and tease', 'Shower and bath']);
  const allNames = [];
  IDS20C.forEach((id) => {
    const c = cfgOf(id);
    const p = prog20c(id);
    const [lo, hi] = SHORT20C.has(id) ? [22, 30] : LONG20C.has(id) ? [46, 54] : [31, 40];
    assert.equal(c.subject, TEASE.includes(id) ? 'Strip and tease' : 'Shower and bath', id);
    assert.equal(c.added, 20, id);
    assert.equal(c.catalogue, 13, id);
    assert.equal(c.couple, true, id);
    assert.equal(c.equip, 'bw', id);
    assert.deepEqual(c.minutes, [lo, hi], id);
    assert.deepEqual(c.levers, SHAPE20C[id] === 'gym' ? [null, 'reps', 'holds'] : [null, 'holds', 'holds'], id);
    assert.equal(p.days.length, 60, id);
    assert.deepEqual([1, 20, 21, 40, 41, 60].map((n) => p.days[n - 1].level), [1, 1, 2, 2, 3, 3], id);
    assert.ok(R.skipped.includes(id), id);
    assert.equal(c.names.length, 20, id);
    assert.equal(new Set(c.names).size, 20, id);
    assert.deepEqual(c.names.filter((n) => olderNames20c.has(n)), [], id);
    c.names.forEach((n) => assert.doesNotMatch(n, SCHEDULE20C, `${id}: ${n}`));
    allNames.push(...c.names);
    assert.equal(c.blurb.trim(), c.blurb, id);
    assert.ok(c.blurb.length > 0 && c.blurb.length <= 140, `${id}: blurb is ${c.blurb.length}`);
    assert.deepEqual(c.blurb.match(/[.!?]/g), [c.blurb.at(-1)], `${id}: blurb is not one sentence`);
    assert.equal(c.about.trim(), c.about, id);
    assert.ok(!/[\r\n]/.test(c.about) && /[.!?]/.test(c.about), `${id}: about`);
    assert.ok(c.about.endsWith(closer20c(id)), `${id}: closer`);
    const sentences = c.about.split(/(?<=[.!?])\s+/).filter(Boolean);
    assert.ok(sentences.length >= 4 && sentences.length <= 5, `${id}: ${sentences.length} sentences`);
    assert.doesNotMatch(`${c.blurb}\n${c.about}`, BANNED, id);
    assert.doesNotMatch(`${c.blurb}\n${c.about}`, ABSENT, id);
    assert.doesNotMatch(`${c.blurb}\n${c.about}\n${c.names.join('\n')}\n${c.split}`, /chok/i, id);
  });
  assert.equal(new Set(allNames).size, allNames.length);
  assert.deepEqual(R.pick({ subjects: ['Strip and tease'] }), []);
  assert.deepEqual(R.pick({ subjects: ['Shower and bath'] }), []);
});

test('gym and positions cycle warm, warm, lead; Shower sex is warm then shower every day; Tease sex leads with tease once', () => {
  SHOWER_SEX.forEach((id) => {
    const c = cfgOf(id);
    const types = Object.values(c.dayTypes);
    assert.equal(types.length, 2, id);
    types.forEach((t) => {
      assert.deepEqual(t.blocks.map((b) => b.title), ['Warm-up', 'Shower'], id);
      assert.ok(pure(t.blocks[0], 'sexWarm'), id);
      assert.ok(pure(t.blocks[1], 'sexShower'), id);
    });
    assert.notEqual(JSON.stringify(types[0].blocks), JSON.stringify(types[1].blocks), id);
  });
  TEASE_SEX.forEach((id) => {
    const types = Object.values(cfgOf(id).dayTypes);
    assert.equal(types.length, 2, id);
    types.forEach((t) => assert.deepEqual(t.blocks.map((b) => b.title), ['Warm-up', 'Fuck'], id));
    const lead = types.filter((t) => pure(t.blocks[0], 'sexTease'));
    assert.equal(lead.length, 1, id);
    assert.ok(pure(lead[0].blocks[1], 'sexFuck'), id);
    const rest = types.filter((t) => t !== lead[0]);
    assert.ok(rest[0].blocks.every((b) => pure(b, 'sexFuck')), id);
  });
  [...GYM20C, ...POS20C].forEach((id) => {
    const c = cfgOf(id);
    const own = c.subject === 'Shower and bath' ? 'sexShower' : 'sexTease';
    const cover = c.subject === 'Shower and bath' ? 'sexWarm' : 'sexFuck';
    assert.deepEqual([c.cycle[0], c.cycle[1] === c.cycle[0], c.cycle[2] !== c.cycle[0]], [c.cycle[0], true, true], id);
    const warm = c.dayTypes[c.cycle[0]];
    const lead = c.dayTypes[c.cycle[2]];
    const warmSex = sexBlocks(warm);
    const leadSex = sexBlocks(lead);
    assert.ok(warmSex.every((b) => pure(b, cover)), `${id}: warm`);
    assert.ok(pure(leadSex[0], own), `${id}: lead`);
    assert.equal(warmSex.length, 1, id);
    assert.equal(leadSex.length, 1, id);
    if (SHAPE20C[id] === 'gym') {
      assert.equal(warm.blocks.length, 2, id);
      assert.equal(lead.blocks.length, 2, id);
      assert.equal(warm.blocks[1].title, 'Positions', id);
      assert.equal(lead.blocks[1].title, 'Positions', id);
    }
  });
});

test('every day is its shape, the lead day draws the subject, and a Shower program stays inside the sexWarm window', () => {
  const warmIds = new Set(mergedAt(13).sexWarm);
  IDS20C.forEach((id) => {
    const c = cfgOf(id);
    const sub = c.subject === 'Shower and bath' ? 'shower' : 'tease';
    const leadType = SHAPE20C[id] === 'sex' && c.subject === 'Shower and bath'
      ? null
      : (SHAPE20C[id] === 'sex' ? Object.entries(c.dayTypes).find(([, t]) => pure(t.blocks[0], 'sexTease'))[0] : c.cycle[2]);
    let warmDraws = 0;
    prog20c(id).days.forEach((d) => {
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
      if (SHAPE20C[id] === 'gym') {
        assert.equal(m.length, 2, where);
        assert.equal(m[1].title, 'Positions', where);
        assert.equal(m[1].format, 'flow', where);
        assert.ok(m[0].items.every((it) => EX[it.ex].added === 10 && !inPool('explicit', it.ex) && !inPool('positions', it.ex)), `${where}: gym block`);
      } else if (SHAPE20C[id] === 'sex') {
        assert.equal(m.length, 2, where);
        assert.equal(m[0].title, 'Warm-up', where);
        assert.equal(m[1].title, c.subject === 'Shower and bath' ? 'Shower' : 'Fuck', where);
      } else {
        assert.equal(m.length, 1, where);
        assert.equal(m[0].title, 'Positions', where);
        assert.equal(m[0].format, 'flow', where);
      }
    });
    if (c.subject === 'Shower and bath') assert.ok(warmDraws >= 277 && warmDraws <= 450, `${id}: ${warmDraws} sexWarm draws`);
  });
});

test('Strip and tease, and Shower and bath: two families a day, except a day marked oneFamily', () => {
  const marked = [];
  IDS20C.forEach((id) => Object.entries(cfgOf(id).dayTypes).forEach(([k, t]) => { if (t.oneFamily) marked.push(`${id}:${k}`); }));
  const expect = POS20C.flatMap((id) => Object.keys(cfgOf(id).dayTypes).map((k) => `${id}:${k}`));
  assert.deepEqual(marked.sort(), expect.sort());
  IDS20C.forEach((id) => {
    const cfg = cfgOf(id);
    prog20c(id).days.forEach((d) => {
      const n = new Set(mains(d).map((b) => b.family)).size;
      if (cfg.dayTypes[d.type].oneFamily) assert.equal(n, 1, `${id} d${d.day}: positions-only is one family`);
      else assert.ok(n >= 2, `${id} d${d.day}: two families`);
      assert.equal(!!cfg.dayTypes[d.type].oneFamily, SHAPE20C[id] === 'positions', `${id} d${d.day}: mark`);
    });
  });
});

test('Strip and tease, and Shower and bath abouts say what the other days hold', () => {
  [...TEASE_GYM, ...TEASE_POS].forEach((id) => {
    const about = cfgOf(id).about;
    assert.match(about, /two days in three/i, id);
    assert.match(about, /fuck/i, id);
    assert.match(about, /zip|bra|panties|grind|strip|skirt|dress|denim/i, id);
  });
  [...SHOWER_GYM, ...SHOWER_POS].forEach((id) => {
    const about = cfgOf(id).about;
    assert.match(about, /two days in three/i, id);
    assert.match(about, /mouth/i, id);
    assert.match(about, /tile|soap|tub|stream|shower|bath/i, id);
  });
  [...TEASE_SEX, ...SHOWER_SEX].forEach((id) => assert.doesNotMatch(cfgOf(id).about, /two days in three/i, id));
});

// Phase 22 ticket 20d: Pool and Hot tub, 12 each. Both pair sexPool or sexHottub with sexWarm.
// Sex days are sexWarm, then the subject's block last. Positions are one flow on every day.
const POOL_GYM = ['pool-set-then-wall', 'pool-sweat-then-step', 'pool-lift-then-lounge', 'pool-push-then-jet'];
const POOL_SEX = ['pool-wall-then-hold', 'pool-step-then-hold', 'pool-quick-soak', 'pool-long-soak'];
const POOL_POS = ['pool-stay-on-wall', 'pool-step-and-stay', 'pool-lounge-and-hips', 'pool-jet-on-her'];
const HOT_GYM = ['hottub-set-then-seat', 'hottub-sweat-then-bubbles', 'hottub-lift-then-cover', 'hottub-push-then-heat'];
const HOT_SEX = ['hottub-seat-then-hold', 'hottub-bubble-then-hold', 'hottub-quick-steam', 'hottub-long-heat'];
const HOT_POS = ['hottub-stay-in-seat', 'hottub-bubbles-and-stay', 'hottub-cover-and-hips', 'hottub-jet-in-seat'];
const POOL = [...POOL_GYM, ...POOL_SEX, ...POOL_POS];
const HOT = [...HOT_GYM, ...HOT_SEX, ...HOT_POS];
const IDS20D = [...POOL, ...HOT];
const GYM20D = [...POOL_GYM, ...HOT_GYM];
const SEX20D = [...POOL_SEX, ...HOT_SEX];
const POS20D = [...POOL_POS, ...HOT_POS];
const SHAPE20D = Object.fromEntries([...GYM20D.map((id) => [id, 'gym']), ...SEX20D.map((id) => [id, 'sex']), ...POS20D.map((id) => [id, 'positions'])]);
const SHORT20D = new Set(['pool-quick-soak', 'hottub-quick-steam']);
const LONG20D = new Set(['pool-long-soak', 'hottub-long-heat']);
const programs20d = built(IDS20D); // the shared build (Phase 31 ticket 5)
const prog20d = (id) => programs20d.find((p) => p.id === id);
const closer20d = (id) => {
  if (SHAPE20D[id] === 'gym') return 'Level II adds reps to the partner work. Level III holds every position longer.';
  if (SHAPE20D[id] === 'positions') return 'Level II and Level III hold every position longer.';
  return SHORT20D.has(id) ? 'Level II and Level III hold every part a little longer.' : 'Level II and Level III hold every part longer.';
};
const olderNames20d = new Set(CONFIGS.filter((c) => ['Explicit', 'Rough', 'Kink-lite', 'Body play', 'Rimming', 'Edging', 'Massage', 'Strip and tease', 'Shower and bath'].includes(c.subject)).flatMap((c) => c.names));
const SCHEDULE20D = /\b(day|days|lead|plain|third)\b/i;
const ownPool = (subject) => (subject === 'Pool' ? 'sexPool' : 'sexHottub');
const ownTitle = (subject) => (subject === 'Pool' ? 'Pool' : 'Hot tub');

test('Pool and Hot tub: 24 programs, for two, catalogue 13, 60 days, out of build your own', () => {
  assert.deepEqual(programs20d.map((p) => p.id), IDS20D);
  assert.equal(CONFIGS.filter((c) => c.subject === 'Pool').length, 12);
  assert.equal(CONFIGS.filter((c) => c.subject === 'Hot tub').length, 12);
  assert.deepEqual([POOL_GYM.length, POOL_SEX.length, POOL_POS.length], [4, 4, 4]);
  assert.deepEqual([HOT_GYM.length, HOT_SEX.length, HOT_POS.length], [4, 4, 4]);
  const mixed = FAMILIES.find(([name]) => name === 'Mixed')[1];
  const after = SHELVES.find(([name]) => name === 'After dark')[1];
  assert.deepEqual(mixed.slice(mixed.indexOf('Shower and bath'), mixed.indexOf('Shower and bath') + 3), ['Shower and bath', 'Pool', 'Hot tub']);
  assert.deepEqual(after.slice(after.indexOf('Shower and bath'), after.indexOf('Shower and bath') + 3), ['Shower and bath', 'Pool', 'Hot tub']);
  const allNames = [];
  IDS20D.forEach((id) => {
    const c = cfgOf(id);
    const p = prog20d(id);
    const [lo, hi] = SHORT20D.has(id) ? [22, 30] : LONG20D.has(id) ? [46, 54] : [31, 40];
    assert.equal(c.subject, POOL.includes(id) ? 'Pool' : 'Hot tub', id);
    assert.equal(c.added, 20, id);
    assert.equal(c.catalogue, 13, id);
    assert.equal(c.couple, true, id);
    assert.equal(c.equip, 'bw', id);
    assert.deepEqual(c.minutes, [lo, hi], id);
    assert.deepEqual(c.levers, SHAPE20D[id] === 'gym' ? [null, 'reps', 'holds'] : [null, 'holds', 'holds'], id);
    assert.equal(p.days.length, 60, id);
    assert.deepEqual([1, 20, 21, 40, 41, 60].map((n) => p.days[n - 1].level), [1, 1, 2, 2, 3, 3], id);
    assert.ok(R.skipped.includes(id), id);
    assert.equal(c.names.length, 20, id);
    assert.equal(new Set(c.names).size, 20, id);
    assert.deepEqual(c.names.filter((n) => olderNames20d.has(n)), [], id);
    c.names.forEach((n) => assert.doesNotMatch(n, SCHEDULE20D, `${id}: ${n}`));
    allNames.push(...c.names);
    assert.equal(c.blurb.trim(), c.blurb, id);
    assert.ok(c.blurb.length > 0 && c.blurb.length <= 140, `${id}: blurb is ${c.blurb.length}`);
    assert.deepEqual(c.blurb.match(/[.!?]/g), [c.blurb.at(-1)], `${id}: blurb is not one sentence`);
    assert.equal(c.about.trim(), c.about, id);
    assert.ok(!/[\r\n]/.test(c.about) && /[.!?]/.test(c.about), `${id}: about`);
    assert.ok(c.about.endsWith(closer20d(id)), `${id}: closer`);
    const sentences = c.about.split(/(?<=[.!?])\s+/).filter(Boolean);
    assert.ok(sentences.length >= 4 && sentences.length <= 5, `${id}: ${sentences.length} sentences`);
    assert.doesNotMatch(`${c.blurb}\n${c.about}`, BANNED, id);
    assert.doesNotMatch(`${c.blurb}\n${c.about}`, ABSENT, id);
    assert.doesNotMatch(`${c.blurb}\n${c.about}\n${c.names.join('\n')}\n${c.split}`, /chok/i, id);
  });
  assert.equal(new Set(allNames).size, allNames.length);
  assert.deepEqual(R.pick({ subjects: ['Pool'] }), []);
  assert.deepEqual(R.pick({ subjects: ['Hot tub'] }), []);
});

test('gym and positions cycle warm, warm, lead; Pool and Hot tub sex is warm then the water every day', () => {
  SEX20D.forEach((id) => {
    const c = cfgOf(id);
    const types = Object.values(c.dayTypes);
    const title = ownTitle(c.subject);
    const own = ownPool(c.subject);
    assert.equal(types.length, 2, id);
    types.forEach((t) => {
      assert.deepEqual(t.blocks.map((b) => b.title), ['Warm-up', title], id);
      assert.ok(pure(t.blocks[0], 'sexWarm'), id);
      assert.ok(pure(t.blocks[1], own), id);
    });
    assert.notEqual(JSON.stringify(types[0].blocks), JSON.stringify(types[1].blocks), id);
  });
  [...GYM20D, ...POS20D].forEach((id) => {
    const c = cfgOf(id);
    const own = ownPool(c.subject);
    assert.deepEqual([c.cycle[0], c.cycle[1] === c.cycle[0], c.cycle[2] !== c.cycle[0]], [c.cycle[0], true, true], id);
    const warm = c.dayTypes[c.cycle[0]];
    const lead = c.dayTypes[c.cycle[2]];
    const warmSex = sexBlocks(warm);
    const leadSex = sexBlocks(lead);
    assert.ok(warmSex.every((b) => pure(b, 'sexWarm')), `${id}: warm`);
    assert.ok(pure(leadSex[0], own), `${id}: lead`);
    assert.equal(warmSex.length, 1, id);
    assert.equal(leadSex.length, 1, id);
    if (SHAPE20D[id] === 'gym') {
      assert.equal(warm.blocks.length, 2, id);
      assert.equal(lead.blocks.length, 2, id);
      assert.equal(warm.blocks[1].title, 'Positions', id);
      assert.equal(lead.blocks[1].title, 'Positions', id);
    }
  });
});

test('every Pool and Hot tub day is its shape, the lead day draws the subject, and sexWarm stays in the window', () => {
  const warmIds = new Set(mergedAt(13).sexWarm);
  IDS20D.forEach((id) => {
    const c = cfgOf(id);
    const sub = c.subject === 'Pool' ? 'pool' : 'hottub';
    const leadType = SHAPE20D[id] === 'sex' ? null : c.cycle[2];
    let warmDraws = 0;
    prog20d(id).days.forEach((d) => {
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
      if (SHAPE20D[id] === 'gym') {
        assert.equal(m.length, 2, where);
        assert.equal(m[1].title, 'Positions', where);
        assert.equal(m[1].format, 'flow', where);
        assert.ok(m[0].items.every((it) => EX[it.ex].added === 10 && !inPool('explicit', it.ex) && !inPool('positions', it.ex)), `${where}: gym block`);
      } else if (SHAPE20D[id] === 'sex') {
        assert.equal(m.length, 2, where);
        assert.equal(m[0].title, 'Warm-up', where);
        assert.equal(m[1].title, ownTitle(c.subject), where);
      } else {
        assert.equal(m.length, 1, where);
        assert.equal(m[0].title, 'Positions', where);
        assert.equal(m[0].format, 'flow', where);
      }
    });
    assert.ok(warmDraws >= 277 && warmDraws <= 450, `${id}: ${warmDraws} sexWarm draws`);
  });
});

test('Pool and Hot tub: two families a day, except a day marked oneFamily', () => {
  const marked = [];
  IDS20D.forEach((id) => Object.entries(cfgOf(id).dayTypes).forEach(([k, t]) => { if (t.oneFamily) marked.push(`${id}:${k}`); }));
  const expect = POS20D.flatMap((id) => Object.keys(cfgOf(id).dayTypes).map((k) => `${id}:${k}`));
  assert.deepEqual(marked.sort(), expect.sort());
  IDS20D.forEach((id) => {
    const cfg = cfgOf(id);
    prog20d(id).days.forEach((d) => {
      const n = new Set(mains(d).map((b) => b.family)).size;
      if (cfg.dayTypes[d.type].oneFamily) assert.equal(n, 1, `${id} d${d.day}: positions-only is one family`);
      else assert.ok(n >= 2, `${id} d${d.day}: two families`);
      assert.equal(!!cfg.dayTypes[d.type].oneFamily, SHAPE20D[id] === 'positions', `${id} d${d.day}: mark`);
    });
  });
});

test('Pool and Hot tub abouts say what the other days hold', () => {
  [...POOL_GYM, ...POOL_POS].forEach((id) => {
    const about = cfgOf(id).about;
    assert.match(about, /two days in three/i, id);
    assert.match(about, /mouth/i, id);
    assert.match(about, /pool|wall|step|lounge|jet|coping/i, id);
  });
  [...HOT_GYM, ...HOT_POS].forEach((id) => {
    const about = cfgOf(id).about;
    assert.match(about, /two days in three/i, id);
    assert.match(about, /mouth/i, id);
    assert.match(about, /seat|bubble|cover|lounger|tub|jet|steam/i, id);
  });
  [...POOL_SEX, ...HOT_SEX].forEach((id) => assert.doesNotMatch(cfgOf(id).about, /two days in three/i, id));
});

// Phase 22 ticket 20e: Balcony and Doorframe, 12 each. Both pair sexBalcony or sexDoorframe with sexWarm.
// Sex days are sexWarm, then the subject's block last. Positions are one flow on every day.
const BALCONY_GYM = ['balcony-set-then-rail', 'balcony-sweat-then-glass', 'balcony-lift-then-chair', 'balcony-push-then-table'];
const BALCONY_SEX = ['balcony-rail-then-hold', 'balcony-glass-then-hold', 'balcony-quick-air', 'balcony-long-night'];
const BALCONY_POS = ['balcony-stay-at-rail', 'balcony-glass-and-stay', 'balcony-chair-and-hips', 'balcony-fingers-on-her'];
const FRAME_GYM = ['doorframe-set-then-jamb', 'doorframe-sweat-then-lintel', 'doorframe-lift-then-threshold', 'doorframe-push-then-door'];
const FRAME_SEX = ['doorframe-jamb-then-hold', 'doorframe-lintel-then-hold', 'doorframe-quick-frame', 'doorframe-long-frame'];
const FRAME_POS = ['doorframe-stay-on-jamb', 'doorframe-lintel-and-stay', 'doorframe-threshold-and-hips', 'doorframe-mouth-in-frame'];
const BALCONY = [...BALCONY_GYM, ...BALCONY_SEX, ...BALCONY_POS];
const FRAME = [...FRAME_GYM, ...FRAME_SEX, ...FRAME_POS];
const IDS20E = [...BALCONY, ...FRAME];
const GYM20E = [...BALCONY_GYM, ...FRAME_GYM];
const SEX20E = [...BALCONY_SEX, ...FRAME_SEX];
const POS20E = [...BALCONY_POS, ...FRAME_POS];
const SHAPE20E = Object.fromEntries([...GYM20E.map((id) => [id, 'gym']), ...SEX20E.map((id) => [id, 'sex']), ...POS20E.map((id) => [id, 'positions'])]);
const SHORT20E = new Set(['balcony-quick-air', 'doorframe-quick-frame']);
const LONG20E = new Set(['balcony-long-night', 'doorframe-long-frame']);
const programs20e = built(IDS20E); // the shared build (Phase 31 ticket 5)
const prog20e = (id) => programs20e.find((p) => p.id === id);
const closer20e = (id) => {
  if (SHAPE20E[id] === 'gym') return 'Level II adds reps to the partner work. Level III holds every position longer.';
  if (SHAPE20E[id] === 'positions') return 'Level II and Level III hold every position longer.';
  return SHORT20E.has(id) ? 'Level II and Level III hold every part a little longer.' : 'Level II and Level III hold every part longer.';
};
const olderNames20e = new Set(CONFIGS.filter((c) => ['Explicit', 'Rough', 'Kink-lite', 'Body play', 'Rimming', 'Edging', 'Massage', 'Strip and tease', 'Shower and bath', 'Pool', 'Hot tub'].includes(c.subject)).flatMap((c) => c.names));
const SCHEDULE20E = /\b(day|days|lead|plain|third)\b/i;
const ownPool20e = (subject) => (subject === 'Balcony' ? 'sexBalcony' : 'sexDoorframe');
const ownTitle20e = (subject) => (subject === 'Balcony' ? 'Balcony' : 'Doorframe');

test('Balcony and Doorframe: 24 programs, for two, catalogue 13, 60 days, out of build your own', () => {
  assert.deepEqual(programs20e.map((p) => p.id), IDS20E);
  assert.equal(CONFIGS.filter((c) => c.subject === 'Balcony').length, 12);
  assert.equal(CONFIGS.filter((c) => c.subject === 'Doorframe').length, 12);
  assert.deepEqual([BALCONY_GYM.length, BALCONY_SEX.length, BALCONY_POS.length], [4, 4, 4]);
  assert.deepEqual([FRAME_GYM.length, FRAME_SEX.length, FRAME_POS.length], [4, 4, 4]);
  const mixed = FAMILIES.find(([name]) => name === 'Mixed')[1];
  const after = SHELVES.find(([name]) => name === 'After dark')[1];
  assert.deepEqual(mixed.slice(mixed.indexOf('Hot tub'), mixed.indexOf('Hot tub') + 3), ['Hot tub', 'Balcony', 'Doorframe']);
  assert.deepEqual(after.slice(after.indexOf('Hot tub'), after.indexOf('Hot tub') + 3), ['Hot tub', 'Balcony', 'Doorframe']);
  const allNames = [];
  IDS20E.forEach((id) => {
    const c = cfgOf(id);
    const p = prog20e(id);
    const [lo, hi] = SHORT20E.has(id) ? [22, 30] : LONG20E.has(id) ? [46, 54] : [31, 40];
    assert.equal(c.subject, BALCONY.includes(id) ? 'Balcony' : 'Doorframe', id);
    assert.equal(c.added, 20, id);
    assert.equal(c.catalogue, 13, id);
    assert.equal(c.couple, true, id);
    assert.equal(c.equip, 'bw', id);
    assert.deepEqual(c.minutes, [lo, hi], id);
    assert.deepEqual(c.levers, SHAPE20E[id] === 'gym' ? [null, 'reps', 'holds'] : [null, 'holds', 'holds'], id);
    assert.equal(p.days.length, 60, id);
    assert.deepEqual([1, 20, 21, 40, 41, 60].map((n) => p.days[n - 1].level), [1, 1, 2, 2, 3, 3], id);
    assert.ok(R.skipped.includes(id), id);
    assert.equal(c.names.length, 20, id);
    assert.equal(new Set(c.names).size, 20, id);
    assert.deepEqual(c.names.filter((n) => olderNames20e.has(n)), [], id);
    c.names.forEach((n) => assert.doesNotMatch(n, SCHEDULE20E, `${id}: ${n}`));
    allNames.push(...c.names);
    assert.equal(c.blurb.trim(), c.blurb, id);
    assert.ok(c.blurb.length > 0 && c.blurb.length <= 140, `${id}: blurb is ${c.blurb.length}`);
    assert.deepEqual(c.blurb.match(/[.!?]/g), [c.blurb.at(-1)], `${id}: blurb is not one sentence`);
    assert.equal(c.about.trim(), c.about, id);
    assert.ok(!/[\r\n]/.test(c.about) && /[.!?]/.test(c.about), `${id}: about`);
    assert.ok(c.about.endsWith(closer20e(id)), `${id}: closer`);
    const sentences = c.about.split(/(?<=[.!?])\s+/).filter(Boolean);
    assert.ok(sentences.length >= 4 && sentences.length <= 5, `${id}: ${sentences.length} sentences`);
    assert.doesNotMatch(`${c.blurb}\n${c.about}`, BANNED, id);
    assert.doesNotMatch(`${c.blurb}\n${c.about}`, ABSENT, id);
    assert.doesNotMatch(`${c.blurb}\n${c.about}\n${c.names.join('\n')}\n${c.split}`, /chok/i, id);
  });
  assert.equal(new Set(allNames).size, allNames.length);
  assert.deepEqual(R.pick({ subjects: ['Balcony'] }), []);
  assert.deepEqual(R.pick({ subjects: ['Doorframe'] }), []);
});

test('gym and positions cycle warm, warm, lead; Balcony and Doorframe sex is warm then the place every day', () => {
  SEX20E.forEach((id) => {
    const c = cfgOf(id);
    const types = Object.values(c.dayTypes);
    const title = ownTitle20e(c.subject);
    const own = ownPool20e(c.subject);
    assert.equal(types.length, 2, id);
    types.forEach((t) => {
      assert.deepEqual(t.blocks.map((b) => b.title), ['Warm-up', title], id);
      assert.ok(pure(t.blocks[0], 'sexWarm'), id);
      assert.ok(pure(t.blocks[1], own), id);
    });
    assert.notEqual(JSON.stringify(types[0].blocks), JSON.stringify(types[1].blocks), id);
  });
  [...GYM20E, ...POS20E].forEach((id) => {
    const c = cfgOf(id);
    const own = ownPool20e(c.subject);
    assert.deepEqual([c.cycle[0], c.cycle[1] === c.cycle[0], c.cycle[2] !== c.cycle[0]], [c.cycle[0], true, true], id);
    const warm = c.dayTypes[c.cycle[0]];
    const lead = c.dayTypes[c.cycle[2]];
    const warmSex = sexBlocks(warm);
    const leadSex = sexBlocks(lead);
    assert.ok(warmSex.every((b) => pure(b, 'sexWarm')), `${id}: warm`);
    assert.ok(pure(leadSex[0], own), `${id}: lead`);
    assert.equal(warmSex.length, 1, id);
    assert.equal(leadSex.length, 1, id);
    if (SHAPE20E[id] === 'gym') {
      assert.equal(warm.blocks.length, 2, id);
      assert.equal(lead.blocks.length, 2, id);
      assert.equal(warm.blocks[1].title, 'Positions', id);
      assert.equal(lead.blocks[1].title, 'Positions', id);
    }
  });
});

test('every Balcony and Doorframe day is its shape, the lead day draws the subject, and sexWarm stays in the window', () => {
  const warmIds = new Set(mergedAt(13).sexWarm);
  IDS20E.forEach((id) => {
    const c = cfgOf(id);
    const sub = c.subject === 'Balcony' ? 'balcony' : 'doorframe';
    const leadType = SHAPE20E[id] === 'sex' ? null : c.cycle[2];
    let warmDraws = 0;
    prog20e(id).days.forEach((d) => {
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
      if (SHAPE20E[id] === 'gym') {
        assert.equal(m.length, 2, where);
        assert.equal(m[1].title, 'Positions', where);
        assert.equal(m[1].format, 'flow', where);
        assert.ok(m[0].items.every((it) => EX[it.ex].added === 10 && !inPool('explicit', it.ex) && !inPool('positions', it.ex)), `${where}: gym block`);
      } else if (SHAPE20E[id] === 'sex') {
        assert.equal(m.length, 2, where);
        assert.equal(m[0].title, 'Warm-up', where);
        assert.equal(m[1].title, ownTitle20e(c.subject), where);
      } else {
        assert.equal(m.length, 1, where);
        assert.equal(m[0].title, 'Positions', where);
        assert.equal(m[0].format, 'flow', where);
      }
    });
    assert.ok(warmDraws >= 277 && warmDraws <= 450, `${id}: ${warmDraws} sexWarm draws`);
  });
});

test('Balcony and Doorframe: two families a day, except a day marked oneFamily', () => {
  const marked = [];
  IDS20E.forEach((id) => Object.entries(cfgOf(id).dayTypes).forEach(([k, t]) => { if (t.oneFamily) marked.push(`${id}:${k}`); }));
  const expect = POS20E.flatMap((id) => Object.keys(cfgOf(id).dayTypes).map((k) => `${id}:${k}`));
  assert.deepEqual(marked.sort(), expect.sort());
  IDS20E.forEach((id) => {
    const cfg = cfgOf(id);
    prog20e(id).days.forEach((d) => {
      const n = new Set(mains(d).map((b) => b.family)).size;
      if (cfg.dayTypes[d.type].oneFamily) assert.equal(n, 1, `${id} d${d.day}: positions-only is one family`);
      else assert.ok(n >= 2, `${id} d${d.day}: two families`);
      assert.equal(!!cfg.dayTypes[d.type].oneFamily, SHAPE20E[id] === 'positions', `${id} d${d.day}: mark`);
    });
  });
});

test('Balcony and Doorframe abouts say what the other days hold', () => {
  [...BALCONY_GYM, ...BALCONY_POS].forEach((id) => {
    const about = cfgOf(id).about;
    assert.match(about, /two days in three/i, id);
    assert.match(about, /mouth/i, id);
    assert.match(about, /rail|glass|door|chair|table|lounger|wall/i, id);
  });
  [...FRAME_GYM, ...FRAME_POS].forEach((id) => {
    const about = cfgOf(id).about;
    assert.match(about, /two days in three/i, id);
    assert.match(about, /mouth/i, id);
    assert.match(about, /jamb|lintel|threshold|door/i, id);
  });
  [...BALCONY_SEX, ...FRAME_SEX].forEach((id) => assert.doesNotMatch(cfgOf(id).about, /two days in three/i, id));
});
