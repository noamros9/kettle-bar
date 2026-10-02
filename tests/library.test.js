// The Phase 5 library, one subject at a time: what each new subject promises (docs/plans/phase-5-catalogue-and-library.md).
const test = require('node:test');
const assert = require('node:assert/strict');
const cat = require('../exercises.js');
const { buildAll, CONFIGS, timing, build, POOLS } = require('../program-builder.js');

const { EX, allowedIn } = cat;
const programs = require('./helpers/library.js').library();
const cfgOf = Object.fromEntries(CONFIGS.map((c) => [c.id, c]));
const itemsOf = (d) => [...d.blocks.flatMap((b) => b.items), ...d.warmup.items, ...d.cooldown.items];

// subject -> how many programs, whether days end with abs, and the formats its main blocks may use
const SUBJECTS = {
  Yoga: { count: 5, abs: false, formats: ['flow'] },
  Pilates: { count: 5, abs: false, formats: ['flow'] },
  Boxing: { count: 5, abs: true, formats: ['bouts', 'circuit', 'tabata'] },
  Kickboxing: { count: 5, abs: true, formats: ['bouts', 'circuit', 'tabata'] },
  Flexibility: { count: 5, abs: false, formats: ['flow'] },
  'Mobility & posture': { count: 5, abs: false, formats: ['flow', 'circuit'] },
  'Balance & stability': { count: 5, abs: true, formats: ['circuit', 'straight'] },
  HIIT: { count: 5, abs: true, formats: ['circuit', 'amrap', 'emom', 'tabata', 'ladder'] },
  Plyometrics: { count: 5, abs: true, formats: ['straight'] },
  Strength: { count: 6, abs: true, formats: ['straight', 'superset'] },
  'Pull-ups': { count: 6, abs: true, formats: ['straight', 'superset', 'emom'] },
  'Legs & glutes': { count: 6, abs: true, formats: ['straight'] },
  'Kettlebell only': { count: 6, abs: true, formats: ['straight', 'circuit', 'emom'] },
  'Core & abs': { count: 6, abs: true, formats: ['circuit', 'straight'] },
  Conditioning: { count: 6, abs: true, formats: ['circuit', 'amrap', 'ladder', 'emom'] },
  Bodyweight: { count: 6, abs: true, formats: ['superset', 'straight', 'circuit'] },
  'Busy week': { count: 6, abs: true, formats: ['circuit', 'superset', 'amrap', 'emom'] },
  // Mixed (Phase 6): abs depends on the day type, so it has its own test below
  'Strength & stretch': { count: 6, abs: undefined, formats: ['straight', 'superset', 'flow'] },
  Fighter: { count: 6, abs: undefined, formats: ['bouts', 'straight', 'superset', 'circuit', 'emom', 'amrap', 'tabata', 'flow'] },
  Athlete: { count: 6, abs: undefined, formats: ['straight', 'superset', 'circuit'] },
  'Balanced week': { count: 6, abs: undefined, formats: ['straight', 'superset', 'circuit', 'emom', 'amrap', 'tabata', 'ladder', 'bouts', 'flow'] },
  'Calm strength': { count: 6, abs: undefined, formats: ['straight', 'superset', 'circuit', 'flow'] },
};

for (const [subject, want] of Object.entries(SUBJECTS)) {
  test(`${subject}: ${want.count} programs of 60 days, each day inside its time range`, () => {
    const list = programs.filter((p) => p.subject === subject);
    assert.equal(list.length, want.count);
    list.forEach((p) => {
      assert.equal(p.days.length, 60, p.id);
      const cfg = cfgOf[p.id];
      p.days.forEach((d) => {
        const [lo, hi] = cfg.dayTypes[d.type].minutes || cfg.minutes, t = timing.dayTime(d.blocks, p.rests) / 60;
        assert.ok(t >= lo - 1 && t <= hi + 1.1, `${p.id} d${d.day}: ${t.toFixed(1)} min, want ${lo}-${hi}`);
      });
    });
  });

  test(`${subject}: every exercise exists, has poses and muscles, and fits the program's equipment`, () => {
    programs.filter((p) => p.subject === subject).forEach((p) => p.days.forEach((d) => itemsOf(d).forEach((it) => {
      const e = EX[it.ex];
      assert.ok(e && e.poses.length && e.muscles.primary.length, `${p.id} d${d.day}: ${it.ex}`);
      assert.ok(allowedIn(p.equip, e), `${p.id} d${d.day}: ${it.ex} needs more than ${p.equip}`);
    })));
  });

  // (programs from before Phase 5 in the subject, like Flow State, keep their pinned days)
  test(`${subject}: new programs have ${want.abs === undefined ? 'abs by day type' : want.abs ? 'an abs block last' : 'no abs finisher'}; main blocks are ${want.formats.join(' / ')}`, () => {
    programs.filter((p) => p.subject === subject && cfgOf[p.id].added).forEach((p) => p.days.forEach((d) => {
      const main = d.blocks.filter((b) => b.kind !== 'abs');
      if (want.abs !== undefined) assert.equal(d.blocks.at(-1).kind === 'abs', want.abs, `${p.id} d${d.day}`);
      main.forEach((b) => assert.ok(want.formats.includes(b.format), `${p.id} d${d.day}: ${b.format}`));
    }));
  });
}

test('every exercise added in Phase 5 is marked added: 5, and only programs marked added: 5 use them', () => {
  const PHASE5_CATS = ['yoga', 'pilates', 'flex', 'mobility', 'boxing', 'kick', 'balance'];
  Object.values(EX).filter((e) => PHASE5_CATS.includes(e.cat)).forEach((e) => assert.equal(e.added, 5, e.id));
  programs.forEach((p) => p.days.forEach((d) => itemsOf(d).forEach((it) => {
    assert.ok((EX[it.ex].added || 0) <= (cfgOf[p.id].added || 0), `${p.id} d${d.day}: ${it.ex} is newer than the program`);
  })));
});

test('a flow repeats 1–3 times and its time is its poses plus 5 s to move into each (per side)', () => {
  const b = { format: 'flow', repeat: 2, items: [{ ex: 'warrior_two', n: 40 }, { ex: 'boat_pose', n: 30 }, { ex: 'sun_salutation', n: 3 }] };
  assert.equal(timing.blockTime(b), 2 * (2 * (5 + 40) + (5 + 30) + (5 + 3 * 30)));
});

test('a block scale lengthens holds in 5 s steps, up to its cap', () => {
  const cfg = JSON.parse(JSON.stringify(cfgOf['yin-deep-stretch']));
  const blocks = cfg.dayTypes.hips.blocks;
  delete blocks[0].cap;
  const d = build(cfg, cat).days[0], n = d.blocks[0].items.map((it) => it.n);
  assert.ok(n.every((x) => x % 5 === 0));
  assert.ok(Math.max(...build(cfgOf['yin-deep-stretch'], cat).days.flatMap((w) => w.blocks.flatMap((b) => b.items.map((it) => it.n)))) <= 240);
});

test('bouts: 3 minutes each with 1 minute of rest between, and every bout is a boxing combo', () => {
  assert.equal(timing.blockTime({ format: 'bouts', rest: 60, items: [{ ex: 'jab_cross', n: 180 }, { ex: 'four_punch', n: 180 }] }), 180 + 60 + 180);
  programs.filter((p) => p.subject === 'Boxing').forEach((p) => p.days.forEach((d) => d.blocks.filter((b) => b.format === 'bouts').forEach((b) => {
    assert.equal(b.rest, 60);
    b.items.forEach((it) => { assert.equal(EX[it.ex].cat, 'boxing', it.ex); assert.equal(it.n, 180); assert.ok(EX[it.ex].call, it.ex); });
  })));
  assert.ok(programs.find((p) => p.id === 'southpaw-switch').days.every((d) => d.blocks[0].switchStance === 1));
});

test('plyometrics rest longer: 60 s between sets and 90 s between exercises, used by the timing and the session', () => {
  const p = programs.find((x) => x.id === 'spring-loaded');
  assert.equal(p.rests.set, 60);
  assert.equal(p.rests.exercise, 90);
  assert.equal(p.rests.beforeAbs, 120);
  const b = { format: 'straight', sets: 3, items: [{ ex: 'broad_jump', n: 5 }, { ex: 'drop_squat', n: 6 }] };
  assert.equal(timing.blockTime(b, p.rests) - timing.blockTime(b), 2 * 2 * 30 + 30);
  const { createSession } = require('../app/session.js');
  const s = createSession(p, p.days[0], { EX });
  assert.equal(s.complete({ type: 'set', bi: 0, i: 0, k: 1 }).rest.sec, 60);
});

test('the core programs opt in to the new catalogue (catalogue: 5): their abs finishers can use the new core moves', () => {
  const fresh = new Set(Object.keys(EX).filter((id) => EX[id].added));
  const optIn = programs.filter((p) => cfgOf[p.id].catalogue === 5);
  assert.ok(optIn.length >= 4);
  assert.ok(optIn.some((p) => p.days.some((d) => d.blocks.at(-1).items.some((it) => fresh.has(it.ex)))));
});

test('the library: 138 programs in 23 subjects', () => {
  assert.equal(programs.length, 138);
  assert.equal(new Set(programs.map((p) => p.subject)).size, 23);
});

test('the Signature shelf has 15 programs: each original, then its Tempo and Harder moves variations', () => {
  const { libraryView, FAMILIES, lengthOf } = require('../app/library.js');
  const { summarize } = require('../app/programs.js');
  const v = libraryView(programs.map(summarize), { family: 'Strength', subject: 'Signature', len: 'all' }, { families: FAMILIES, lengthOf });
  assert.deepEqual(v.shelves.map((s) => s.subject), ['Signature']);
  assert.deepEqual(v.shelves[0].programs.map((p) => p.name), [
    'Three-Split 60', 'Three-Split 60 Tempo', 'Three-Split 60 Harder Moves', 'Four-Split 60', 'Four-Split 60 Tempo', 'Four-Split 60 Harder Moves',
    'Two-Split 60', 'Two-Split 60 Tempo', 'Two-Split 60 Harder Moves', 'Five-Split 60', 'Five-Split 60 Tempo', 'Five-Split 60 Harder Moves',
    'Full-Body Duo 60', 'Full-Body Duo 60 Tempo', 'Full-Body Duo 60 Harder Moves',
  ]);
  assert.equal(v.count, 15);
});

// ---------- Mixed: Strength & stretch (Phase 6 ticket 1) ----------
const STRETCH = ['lift-and-lengthen', 'iron-yoga', 'strong-hips', 'upper-and-open', 'kettlebell-and-yoga', 'posture-strength'];
const stretch = programs.filter((p) => p.subject === 'Strength & stretch');
const FAMILY_TAGS = ['Strength', 'Cardio & combat', 'Mind & body'];
const absOf = (cfg, type) => (cfg.dayTypes[type].absSlots || cfg.absSlots || ['absW', 'abs', 'abs?']).length > 0;

test('Strength & stretch: the six programs, in order, are Mixed, added: 6, on the whole catalogue', () => {
  assert.deepEqual(stretch.map((p) => p.id), STRETCH);
  stretch.forEach((p) => {
    const cfg = cfgOf[p.id];
    assert.equal(cfg.added, 6, p.id);
    assert.equal(cfg.catalogue, 5, p.id);
    assert.ok(cfg.blurb && cfg.names.length === 20 && new Set(cfg.names).size === 20, p.id);
  });
});

test('Strength & stretch: every day is a mixed day: a strength block and a flow, each main block tagged with its family', () => {
  stretch.forEach((p) => p.days.forEach((d) => {
    const main = d.blocks.filter((b) => b.kind === 'main');
    assert.ok(main.every((b) => FAMILY_TAGS.includes(b.family)), `${p.id} d${d.day}`);
    assert.ok(d.blocks.filter((b) => b.kind === 'abs').every((b) => !('family' in b)), `${p.id} d${d.day}: abs is untagged`);
    assert.deepEqual([...new Set(main.map((b) => b.family))].sort(), ['Mind & body', 'Strength'], `${p.id} d${d.day}`);
    main.forEach((b) => assert.equal(b.format === 'flow', b.family === 'Mind & body', `${p.id} d${d.day}: ${b.title}`));
  }));
});

test('Strength & stretch: abs follow the day type: days that end in a flow have none, days that end in strength keep them', () => {
  const seen = new Set();
  stretch.forEach((p) => p.days.forEach((d) => {
    const cfg = cfgOf[p.id];
    const last = d.blocks.at(-1);
    assert.equal(last.kind === 'abs', absOf(cfg, d.type), `${p.id} d${d.day} (${d.type})`);
    if (last.format === 'flow') assert.ok(!absOf(cfg, d.type), `${p.id} d${d.day}: a flow day has no abs`);
    seen.add(absOf(cfg, d.type));
  }));
  assert.deepEqual([...seen].sort(), [false, true], 'both kinds of day exist in the subject');
});

test('Strength & stretch: the strength blocks level by weight or reps, the flows by holds (Level III)', () => {
  stretch.forEach((p) => {
    const cfg = cfgOf[p.id];
    Object.values(cfg.dayTypes).forEach((t) => t.blocks.filter((b) => b.f === 'flow').forEach((b) => assert.deepEqual(b.lever, [null, 'holds', 'holds'], p.id)));
    assert.ok(['weight', 'reps'].includes(cfg.levers[1]) && ['weight', 'reps'].includes(cfg.levers[2]), p.id);
    p.days.filter((d) => d.level === 3).forEach((d) => d.blocks.filter((b) => b.format === 'flow').forEach((b) => b.items.forEach((it) => {
      assert.ok(it.n >= EX[it.ex].r[2], `${p.id} d${d.day}: ${it.ex} is held for ${it.n}`); // scaled stretches are longer still
      assert.equal(it.note, undefined);
    })));
  });
});

test('Strength & stretch: kettlebell-and-yoga uses one kettlebell and a mat, the others the dumbbells, bar and mat', () => {
  assert.equal(cfgOf['kettlebell-and-yoga'].equip, 'kb');
  assert.ok(stretch.filter((p) => p.id !== 'kettlebell-and-yoga').every((p) => p.equip === 'all'));
});

// ---------- Mixed: Fighter and Athlete (Phase 6 ticket 2) ----------
const FIGHTER = ['fight-ready', 'strike-and-lift', 'southpaw-strength', 'muay-thai-conditioning', 'boxers-body', 'knockout-circuit'];
const ATHLETE = ['jump-lift-stick', 'court-ready', 'field-day', 'explosive-legs', 'power-and-poise', 'all-round-athlete'];
const fighter = programs.filter((p) => p.subject === 'Fighter');
const athlete = programs.filter((p) => p.subject === 'Athlete');
const mainOf = (d) => d.blocks.filter((b) => b.kind === 'main');
const familiesOf = (d) => [...new Set(mainOf(d).map((b) => b.family))];

// ---------- Mixed: Balanced week and Calm strength (Phase 6 ticket 3) ----------
const BALANCED = ['three-in-one', 'everyday-athlete', 'balanced-30', 'whole-body-week', 'lift-sweat-stretch', 'the-generalist'];
const CALM = ['slow-burn', 'steady-strength', 'pilates-and-iron', 'yin-and-yang', 'quiet-power', 'control'];
const balanced = programs.filter((p) => p.subject === 'Balanced week');
const calm = programs.filter((p) => p.subject === 'Calm strength');

// (which kinds of day a subject has: abs at the end or not)
for (const [subject, list, ids, kinds] of [['Fighter', fighter, FIGHTER, [false, true]], ['Athlete', athlete, ATHLETE, [false, true]], ['Balanced week', balanced, BALANCED, [false, true]], ['Calm strength', calm, CALM, [false]]]) {
  test(`${subject}: the six programs, in order, are Mixed, added: 6, on the whole catalogue, with 20 distinct day names`, () => {
    assert.deepEqual(list.map((p) => p.id), ids);
    list.forEach((p) => {
      const cfg = cfgOf[p.id];
      assert.equal(cfg.added, 6, p.id);
      assert.equal(cfg.catalogue, 5, p.id);
      assert.ok(cfg.blurb && cfg.names.length === 20 && new Set(cfg.names).size === 20, p.id);
    });
  });

  test(`${subject}: every main block is tagged with its family, the abs block is not, and abs follow the day type`, () => {
    const seen = new Set();
    list.forEach((p) => p.days.forEach((d) => {
      const cfg = cfgOf[p.id];
      assert.ok(mainOf(d).every((b) => FAMILY_TAGS.includes(b.family)), `${p.id} d${d.day}`);
      assert.ok(d.blocks.filter((b) => b.kind === 'abs').every((b) => !('family' in b)), `${p.id} d${d.day}: abs is untagged`);
      assert.ok(familiesOf(d).length >= 2, `${p.id} d${d.day}: a mixed day`);
      assert.equal(d.blocks.at(-1).kind === 'abs', absOf(cfg, d.type), `${p.id} d${d.day} (${d.type})`);
      if (d.blocks.at(-1).format === 'flow') assert.ok(!absOf(cfg, d.type), `${p.id} d${d.day}: a flow day has no abs`);
      seen.add(absOf(cfg, d.type));
    }));
    assert.deepEqual([...seen].sort(), kinds, 'the kinds of day the subject has');
  });
}

test('Fighter: every day has 2–5 bouts of boxing or kickboxing, each block levels in its own way, and the flows hold longer', () => {
  fighter.forEach((p) => {
    const cfg = cfgOf[p.id];
    assert.equal(p.equip, cfg.equip || 'all');
    p.days.forEach((d) => {
      const bouts = mainOf(d).filter((b) => b.format === 'bouts');
      assert.equal(bouts.length, 1, `${p.id} d${d.day}`);
      assert.equal(bouts[0].family, 'Cardio & combat');
      assert.ok(bouts[0].items.length >= 2 && bouts[0].items.length <= 5, `${p.id} d${d.day}: ${bouts[0].items.length} bouts`);
      bouts[0].items.forEach((it) => assert.ok(['boxing', 'kick'].includes(EX[it.ex].cat) && it.n === 180, `${p.id} d${d.day}: ${it.ex}`));
      mainOf(d).filter((b) => b.format === 'flow').forEach((b) => assert.equal(b.family, 'Mind & body'));
    });
    Object.values(cfg.dayTypes).forEach((t) => t.blocks.forEach((b) => {
      if (b.f === 'bouts') assert.deepEqual(b.lever, [null, 'variation', 'variation'], p.id);
      if (b.f === 'flow') assert.deepEqual(b.lever, [null, 'holds', 'holds'], p.id);
    }));
    assert.ok(['weight', 'reps'].includes(cfg.levers[1]) && ['weight', 'reps'].includes(cfg.levers[2]), p.id);
    p.days.filter((d) => d.level === 3).forEach((d) => mainOf(d).filter((b) => b.format === 'flow').forEach((b) => b.items.forEach((it) => assert.ok(it.n >= EX[it.ex].r[2], `${p.id} d${d.day}: ${it.ex}`))));
  });
  assert.ok(fighter.some((p) => p.days.some((d) => d.blocks.some((b) => b.switchStance))), 'a switch-stance program');
  assert.ok(fighter.some((p) => p.days.some((d) => d.blocks.some((b) => b.items.some((it) => EX[it.ex].cat === 'kick')))), 'kickboxing appears');
  assert.ok(fighter.some((p) => p.days.some((d) => mainOf(d).some((b) => b.family === 'Strength'))), 'strength appears');
  assert.ok(fighter.some((p) => p.days.some((d) => mainOf(d).some((b) => b.format === 'circuit' || b.format === 'tabata'))), 'conditioning appears');
  const bw = fighter.filter((p) => p.equip === 'bw').length;
  assert.ok(bw >= 4 && bw < 6, `most Fighter programs need no equipment, one or two use a bell or dumbbells (${bw} bw)`);
});

test('Athlete: every day is a plyometrics block first, then strength and balance, on long plyometric rests', () => {
  const PLYO = new Set(['plyoLow', 'plyoLat', 'plyoUp', 'plyoVert'].flatMap((n) => POOLS[n]));
  const VARIATIONS = new Set(['burpee_broad_jump', 'single_leg_hops', 'bounding', 'tuck_jumps', 'jump_lunge', 'skater_jumps']); // where the variation lever leads a jump
  const BALANCE = new Set(['blStatic', 'blDynamic', 'blStrength', 'blPower'].flatMap((n) => POOLS[n]));
  athlete.forEach((p) => {
    assert.ok(p.rests.set >= 60 && p.rests.exercise >= 90, `${p.id}: plyometric rests`);
    p.days.forEach((d) => {
      const main = mainOf(d);
      assert.equal(main[0].family, 'Cardio & combat', `${p.id} d${d.day}: jumps lead`);
      assert.equal(main[0].format, 'straight');
      assert.ok(main[0].items.every((it) => PLYO.has(it.ex) || VARIATIONS.has(it.ex)), `${p.id} d${d.day}: ${main[0].items.map((i) => i.ex)}`);
      assert.deepEqual(familiesOf(d).sort(), ['Cardio & combat', 'Mind & body', 'Strength'], `${p.id} d${d.day}: jump, lift, stick`);
      assert.ok(main.filter((b) => b.family === 'Mind & body').every((b) => b.items.every((it) => BALANCE.has(it.ex))), `${p.id} d${d.day}: balance block`);
    });
    const cfg = cfgOf[p.id];
    Object.values(cfg.dayTypes).forEach((t) => assert.deepEqual(t.blocks[0].lever, [null, 'reps', 'variation'], p.id));
    assert.ok(['weight', 'reps'].includes(cfg.levers[1]) && ['weight', 'reps'].includes(cfg.levers[2]), p.id);
  });
  const bw = athlete.filter((p) => p.equip === 'bw').length;
  assert.ok(bw >= 1 && bw < 6, 'some Athlete programs need no gear, some use dumbbells or a bell');
});

test('Balanced week: every day has a block from each of the three families, and the subject mixes formats and gear', () => {
  balanced.forEach((p) => p.days.forEach((d) => {
    assert.deepEqual(familiesOf(d).sort(), ['Cardio & combat', 'Mind & body', 'Strength'], `${p.id} d${d.day}`);
    const main = mainOf(d);
    assert.ok(main.length >= 3 && main.length <= 4, `${p.id} d${d.day}: ${main.length} blocks`);
    assert.ok(main.filter((b) => b.family === 'Mind & body').every((b) => ['flow', 'circuit'].includes(b.format)), `${p.id} d${d.day}`);
  }));
  const formats = new Set(balanced.flatMap((p) => p.formats));
  ['superset', 'tabata', 'flow', 'bouts', 'amrap', 'emom'].forEach((f) => assert.ok(formats.has(f), f));
  assert.ok(balanced.some((p) => p.equip === 'bw') && balanced.some((p) => p.equip === 'kb') && balanced.some((p) => p.equip === 'all'), 'no gear, one bell and full gear');
  balanced.forEach((p) => {
    assert.ok(['weight', 'reps'].includes(cfgOf[p.id].levers[1]) && ['weight', 'reps'].includes(cfgOf[p.id].levers[2]), p.id);
    Object.values(cfgOf[p.id].dayTypes).forEach((t) => t.blocks.filter((b) => b.f === 'flow').forEach((b) => assert.deepEqual(b.lever, [null, 'holds', 'holds'], p.id)));
  });
});

test('Calm strength: a Pilates or core block, slow-tempo strength and a long-hold yin flow to finish, on every day', () => {
  const YIN = new Set(['ygYinHips', 'ygYinSpine'].flatMap((n) => POOLS[n]));
  const CALM_MIND = new Set(['plAbs', 'plRoll', 'plBack', 'plSide', 'plGlute', 'core2', 'coreAnti', 'coreRot', 'coreHollow', 'core'].flatMap((n) => POOLS[n] || []).concat(Object.keys(EX).filter((id) => EX[id].cat === 'pilates')));
  calm.forEach((p) => {
    const cfg = cfgOf[p.id];
    assert.ok(cfg.levers.slice(1).includes('tempo'), `${p.id}: the tempo lever`);
    let slow = 0;
    p.days.forEach((d) => {
      const main = mainOf(d), last = main.at(-1);
      assert.equal(last.format, 'flow', `${p.id} d${d.day}: a yin finish`);
      assert.ok(last.items.length >= 3 && last.items.every((it) => YIN.has(it.ex) && it.n >= 90), `${p.id} d${d.day}: yin holds ${last.items.map((i) => i.n)}`);
      const strength = main.filter((b) => b.family === 'Strength');
      assert.ok(strength.length >= 1 && strength.every((b) => b.format === 'straight' || b.format === 'superset'), `${p.id} d${d.day}`);
      const calmBlocks = main.filter((b) => b !== last && b.family === 'Mind & body');
      assert.equal(calmBlocks.length, 1, `${p.id} d${d.day}: one Pilates or core block`);
      assert.ok(calmBlocks[0].items.every((it) => CALM_MIND.has(it.ex)), `${p.id} d${d.day}: ${calmBlocks[0].items.map((i) => i.ex)}`);
      const tempoItems = strength.flatMap((b) => b.items).filter((it) => it.tempo);
      if (d.level === 1) assert.equal(tempoItems.length, 0, `${p.id} d${d.day}: Level I has no slow tempo`);
      slow += tempoItems.length;
    });
    assert.ok(slow > 0, `${p.id}: some slow-tempo reps at Level II or III`);
    p.days.filter((d) => d.level === 3).forEach((d) => assert.ok(mainOf(d).at(-1).items.every((it) => it.n >= EX[it.ex].r[2]), `${p.id} d${d.day}`));
  });
  assert.ok(calm.some((p) => p.days.some((d) => mainOf(d).some((b) => b.items.some((it) => EX[it.ex].cat === 'pilates')))), 'Pilates appears');
  assert.ok(calm.some((p) => p.equip === 'bw') && calm.some((p) => p.equip === 'kb') && calm.some((p) => p.equip === 'all'), 'no gear, one bell and full gear');
});
