// Mix in build your own (Phase 6 ticket 7): 2-3 subjects, every day a mixed day joined from one block of each subject,
// in the order picked. recipes.make() joins and checks them; options() says which combinations and times can be made;
// app/own.js keeps the choices (levers flat, one pair per subject) and a saved mix never depends on the book again.
const test = require('node:test');
const assert = require('node:assert/strict');
const R = require('../recipes.js');
const Builder = require('../program-builder.js');
const cat = require('../exercises.js');
const Own = require('../app/own.js');
const CONFIGS = require('../programs.config.js');
const { FAMILIES } = require('../app/library.js');

const recipes = R.of(R.book());
const deps = { build: Builder.build, ex: cat };
const familyOf = Object.fromEntries(FAMILIES.flatMap(([f, list]) => list.map((s) => [s, f])));
// two of each subject's own levers, flat: [a II, a III, b II, b III, ...]
const leversOf = (subjects) => subjects.flatMap((s) => { const ls = R.options(s).levers; return [ls[0], ls[1] === undefined ? ls[0] : ls[1]]; });
const mix = (subjects, minutes, extra = {}) => ({ subjects, split: 3, minutes, equipment: 'all', levers: leversOf(subjects), ...extra });
const minutesOf = (d, rests) => Builder.timing.dayTime(d.blocks, rests) / 60;
const mains = (d) => d.blocks.filter((b) => b.kind === 'main');
const days = (p) => JSON.stringify(p.days);

// ---- the ticket's test first ----
test('strength + yoga, 30 min: every day has a strength block then a flow, inside the window, Levels I to III', () => {
  ['all', 'kb'].forEach((equipment) => ['a', 'b', 'c'].forEach((seed) => {
    const cfg = R.make(mix(['Strength', 'Yoga'], 30, { equipment }), seed);
    assert.deepEqual(cfg.mix, ['Strength', 'Yoga']);
    const p = Builder.build(cfg, cat);
    assert.equal(p.days.length, 60);
    const levels = new Set();
    p.days.forEach((d) => {
      const [lift, flow, ...more] = mains(d);
      assert.deepEqual(more, [], `day ${d.day}: two main blocks`);
      assert.equal(lift.family, 'Strength', `day ${d.day}`);
      assert.equal(flow.family, 'Mind & body', `day ${d.day}`);
      assert.equal(flow.format, 'flow', `day ${d.day}: the yoga block is a flow`);
      assert.notEqual(lift.format, 'flow', `day ${d.day}: the strength block is sets, not a flow`);
      assert.ok(!d.blocks.some((b) => b.kind === 'abs'), 'the last block is a flow: no abs');
      const t = minutesOf(d, p.rests);
      assert.ok(t >= 28 - 0.5 && t <= 32 + 0.5, `${equipment} ${seed} day ${d.day} (Level ${d.level}): ${t.toFixed(1)} min`);
      levels.add(d.level);
    });
    assert.deepEqual([...levels], [1, 2, 3]);
  }));
});

test('three subjects: a block of each in the order picked, each tagged with its family; abs last only after strength', () => {
  const three = R.make(mix(['Yoga', 'Boxing', 'Strength'], 40, { split: 2 }), 's');
  Builder.build(three, cat).days.forEach((d) => {
    assert.deepEqual(mains(d).map((b) => b.family), ['Mind & body', 'Cardio & combat', 'Strength'], `day ${d.day}`);
    assert.equal(d.blocks.at(-1).kind, 'abs', `day ${d.day}: strength last, abs after it`);
    assert.ok(minutesOf(d, three.rests) >= 37.5 && minutesOf(d, three.rests) <= 42.5, `day ${d.day}`);
  });
  const noAbs = R.make(mix(['Strength', 'HIIT', 'Flexibility'], 35, { split: 2 }), 's');
  Builder.build(noAbs, cat).days.forEach((d) => {
    assert.deepEqual(mains(d).map((b) => b.family), ['Strength', 'Cardio & combat', 'Mind & body']);
    assert.ok(!d.blocks.some((b) => b.kind === 'abs'), 'a flow last: no abs');
  });
  // the rule for every pair of families: abs exactly when the last subject is a Strength one
  [['Yoga', 'Kettlebell only'], ['Kettlebell only', 'Yoga'], ['Boxing', 'Bodyweight'], ['Pull-ups', 'HIIT'], ['Pilates', 'Core & abs']].forEach((subjects) => {
    const eq = ['all', 'kb', 'bw'].find((e) => R.options(subjects).equipment[e].includes(35));
    const cfg = R.make(mix(subjects, 35, { equipment: eq, split: 2 }), 'r');
    const strengthLast = familyOf[subjects.at(-1)] === 'Strength';
    Object.values(cfg.dayTypes).forEach((t) => assert.deepEqual(t.absSlots, strengthLast ? Builder.ABS_SLOTS : [], subjects.join(' + ')));
  });
});

test('per-subject levers apply to their own blocks only', () => {
  const lifted = (levers) => {
    const cfg = R.make(mix(['Strength', 'Yoga'], 30, { levers }), 'lv');
    Object.values(cfg.dayTypes).forEach((t) => {
      assert.deepEqual(t.blocks[0].lever, [null, levers[0], levers[1]]);
      assert.deepEqual(t.blocks[1].lever, [null, levers[2], levers[3]]);
    });
    const p = Builder.build(cfg, cat), late = p.days.slice(40);
    return { p, notes: (i) => late.flatMap((d) => mains(d)[i].items.map((it) => it.note).filter(Boolean)) };
  };
  const heavy = lifted(['weight', 'weight', 'holds', 'holds']);
  assert.ok(heavy.notes(0).includes('Go one weight up'), 'the lift gets heavier');
  assert.deepEqual(heavy.notes(1), [], 'the flow is held longer: no weight, no harder poses');
  assert.deepEqual(heavy.p.levels, ['Level I · Intermediate', 'Level II · Heavier weights, longer holds', 'Level III · Heavier weights, longer holds']);
  const harder = lifted(['reps', 'reps', 'variation', 'variation']);
  assert.ok(harder.notes(1).includes('Harder variation'), 'the flow gets harder poses');
  assert.ok(!harder.notes(0).some((n) => n === 'Harder variation' || n === 'Go one weight up'), 'the lift only adds reps');
  assert.deepEqual(harder.p.levels.slice(1), ['Level II · More reps, harder variations', 'Level III · More reps, harder variations']);
  // the abs follow the last subject's levers when it is a strength one: the program's own levers are that subject's
  assert.deepEqual(R.make(mix(['Yoga', 'Strength'], 35, { levers: ['holds', 'variation', 'tempo', 'weight'] }), 'x').levers, [null, 'tempo', 'weight']);
  assert.deepEqual(R.make(mix(['Strength', 'Yoga'], 35, { levers: ['tempo', 'weight', 'holds', 'variation'] }), 'x').levers, [null, 'tempo', 'weight']);
});

test('the day\'s minutes are shared evenly between the blocks, after the rests and the abs; each block\'s share is its target', () => {
  const cfg = R.make(mix(['Strength', 'Yoga'], 30), 'split');
  Object.values(cfg.dayTypes).forEach((t) => {
    const mids = t.blocks.map((b) => (b.target[0] + b.target[1]) / 2);
    t.blocks.forEach((b) => assert.equal(b.target[1] - b.target[0], 4));
    assert.ok(Math.abs(mids[0] + mids[1] + 1 - 30) <= 0.5, `${t.label}: ${mids} plus a minute's rest`);
  });
  // a flow comes in whole rounds: when it cannot take half of 40 minutes it is held at what it can, the lift takes the rest
  const long = R.make(mix(['Mobility & posture', 'Boxing', 'Strength'], 40, { split: 5 }), 'long');
  const shares = Object.values(long.dayTypes).map((t) => t.blocks.map((b) => (b.target[0] + b.target[1]) / 2));
  assert.ok(shares.some((s) => new Set(s).size > 1), `${JSON.stringify(shares)}: not all even`);
  // and the builder keeps a block inside its target when the day allows
  const p = Builder.build(cfg, cat);
  const inside = p.days.filter((d) => mains(d).every((b, i) => { const bt = Builder.timing.blockTime(b, p.rests) / 60, tg = cfg.dayTypes[d.type].blocks[i].target; return bt >= tg[0] - 1 && bt <= tg[1] + 1; }));
  assert.ok(inside.length >= 45, `${inside.length} of 60 days keep each block near its share`);
});

test('options(combination): what a mix allows; refusals come from what the parts were really built to', () => {
  assert.deepEqual(R.options(['Yoga']), R.options('Yoga'), 'one subject in a list is that subject');
  const sy = R.options(['Strength', 'Yoga']);
  assert.deepEqual(Object.keys(sy).sort(), ['equipment', 'formats', 'levers', 'reason', 'subjects']);
  assert.equal(sy.reason, null);
  assert.deepEqual(sy.equipment, { all: [20, 25, 30, 35, 40], kb: [20, 25, 30, 35, 40], bw: [] }, 'strength has no blocks without gear');
  assert.deepEqual(sy.levers, [R.options('Strength').levers, R.options('Yoga').levers]);
  assert.ok(sy.formats.includes('flow') && sy.formats.includes('straight'));
  // order matters: yoga then strength ends with abs, which take time: no 20 or 25 minutes
  assert.deepEqual(R.options(['Yoga', 'Strength']).equipment.all, [30, 35, 40]);
  assert.deepEqual(R.options(['Boxing', 'Kickboxing', 'Strength']).equipment.all, [35, 40]);
  // three strength subjects and the abs cannot be 40 minutes or less
  const long = R.options(['Signature', 'Strength', 'Pull-ups']);
  assert.equal(long.reason, 'No mix of Signature + Strength + Pull-ups fits 20 to 40 minutes.');
  assert.deepEqual(long.equipment, { all: [], kb: [], bw: [] });
  // subjects that are never mixed
  assert.equal(R.options(['Yoga', 'Fighter']).reason, 'Fighter is already a mix: pick it on its own.');
  assert.equal(R.options(['Plyometrics', 'Yoga']).reason, "Plyometrics can't be mixed: it rests longer between sets than the others.");
  assert.equal(R.mixReason(['Yoga', 'Strength']), null);
  assert.throws(() => R.options(['Yoga', 'Juggling']), /Unknown subject: Juggling/);
  // a copy each time: changing it changes nothing
  sy.equipment.all.length = 0;
  assert.equal(R.options(['Strength', 'Yoga']).equipment.all.length, 5);
});

test('make agrees with options: every time it offers builds inside the window, every time it refuses says why', () => {
  const sample = [['Kettlebell only', 'Pilates'], ['HIIT', 'Mobility & posture'], ['Boxing', 'Flexibility', 'Legs & glutes'], ['Balance & stability', 'Conditioning']];
  let built = 0, refused = 0;
  sample.forEach((subjects, k) => ['all', 'kb', 'bw'].forEach((eq) => [20, 30, 40].forEach((m) => {
    const c = mix(subjects, m, { equipment: eq, split: 2 });
    if (!R.options(subjects).equipment[eq].includes(m)) {
      refused++;
      assert.throws(() => R.make(c, 'x'), { message: `No mix of ${subjects.join(' + ')} fits ${m} min with ${{ all: 'all equipment', kb: 'a kettlebell only', bw: 'no equipment' }[eq]}.` });
      return;
    }
    const cfg = R.make(c, 'k' + k);
    const p = Builder.build(cfg, cat);
    p.days.forEach((d) => {
      const t = minutesOf(d, p.rests);
      assert.ok(t >= m - 2.5 && t <= m + 2.5, `${subjects} ${eq} ${m} day ${d.day}: ${t.toFixed(1)}`);
      d.blocks.forEach((b) => b.items.forEach((it) => {
        const e = cat.EX[it.ex];
        if (eq === 'bw') assert.ok(!e.load && !(e.equip || []).includes('bar'), `bw: ${it.ex}`);
        if (eq === 'kb') assert.ok((!e.load || e.load === 'kb') && !(e.equip || []).includes('bar'), `kb: ${it.ex}`);
      }));
    });
    built++;
  })));
  assert.ok(built >= 20 && refused >= 3, `${built} built, ${refused} refused`);
  assert.throws(() => R.make(mix(['Yoga', 'Fighter'], 30), 's'), /^Error: Fighter is already a mix: pick it on its own\.$/);
});

test('make: formats apply to every subject; a mix is made once per choice and seed, and handed out as a copy', () => {
  const cfg = R.make(mix(['Strength', 'Yoga'], 30, { formats: ['straight', 'flow'] }), 'f');
  const p = Builder.build(cfg, cat);
  assert.deepEqual(p.formats.sort(), ['flow', 'straight']);
  assert.throws(() => R.make(mix(['Strength', 'Yoga'], 30, { formats: ['straight'] }), 'f'), { message: 'No mix of Strength + Yoga fits 30 min with all equipment using only Straight sets.' });
  const c = mix(['Strength', 'Yoga'], 30);
  const a = R.make(c, 'same');
  a.dayTypes.d1.blocks.length = 0;
  assert.equal(JSON.stringify(R.make(c, 'same')), JSON.stringify(R.make(c, 'same')));
  assert.equal(R.make(c, 'same').dayTypes.d1.blocks.length, 2);
  assert.notEqual(JSON.stringify(R.make(c, 'same').dayTypes), JSON.stringify(R.make(c, 'other').dayTypes));
  // what the config holds
  assert.equal(a.name, 'My Strength + Yoga 60');
  assert.equal(a.subject, 'Strength + Yoga');
  assert.equal(a.catalogue, R.book().catalogue);
  assert.deepEqual(a.minutes, [28, 32]);
  assert.equal(a.names.length, 60);
  assert.equal(a.split.split(' / ').length, 3);
  assert.deepEqual(a.cycle.map((k) => a.dayTypes[k].short), ['Mix 1', 'Mix 2', 'Mix 3']);
  const fresh = R.make(c, 'same');
  assert.equal(fresh.dayTypes.d1.label, fresh.dayTypes.d1.blocks.map((b) => b.title).join(' + '));
  assert.match(a.about, /every day has a strength block, then a yoga block, about 30 minutes/);
  assert.equal(R.make({ ...mix(['Yoga', 'Strength'], 35), split: 1 }, 's').blurb, '1 day a cycle, about 35 minutes each: Yoga, then Strength, then abs.');
  // no levers given: two of each subject's own
  const { levers, ...bare } = c;
  assert.deepEqual(R.make(bare, 's').dayTypes.d1.blocks.map((b) => b.lever), [[null, ...levers.slice(0, 2)], [null, ...levers.slice(2)]]);
  assert.deepEqual(R.make({ ...bare, subjects: ['Boxing', 'Yoga'] }, 's').dayTypes.d1.blocks[0].lever, [null, 'variation', 'variation'], 'a subject with one lever uses it twice');
  // no stored shape holds an array in an array (Firestore)
  const arrays = (x) => (Array.isArray(x) ? x.some(Array.isArray) || x.some(arrays) : x && typeof x === 'object' ? Object.values(x).some(arrays) : false);
  assert.equal(arrays(a), false);
});

test('make: a mix that is not a choice is refused', () => {
  const bad = (o, re) => assert.throws(() => R.make({ ...mix(['Strength', 'Yoga'], 30), ...o }, 's'), re);
  bad({ subjects: ['Strength', 'Yoga', 'Boxing', 'HIIT'], levers: undefined }, /^Error: Pick up to 3 subjects\.$/);
  bad({ subjects: ['Yoga', 'Yoga'], levers: undefined }, /^Error: Pick each subject once\.$/);
  bad({ subjects: ['Yoga', 'Juggling'], levers: undefined }, /Unknown subject: Juggling/);
  bad({ levers: ['weight', 'reps'] }, /^Error: Pick a lever for Level II and one for Level III for each subject\.$/);
  bad({ levers: ['weight', 'reps', 'weight', 'holds'] }, /^Error: Yoga does not get harder by heavier weights: pick longer holds, harder variations\.$/);
});

test('mixes in the book: parts from every subject that can be mixed, none from Mixed subjects or Plyometrics', () => {
  const { mix: m, subjects, specs, rests } = R.book();
  const have = new Set(m.parts.map(([si]) => subjects[si][0]));
  subjects.forEach(([name, family]) => assert.equal(have.has(name), family !== 'Mixed' && name !== 'Plyometrics', name));
  assert.deepEqual(rests[m.rests], Builder.REST);
  assert.equal(m.abs, Builder.ABS_SLOTS.join(' '));
  m.parts.forEach(([si, spec, bi, equip, fit]) => {
    assert.ok(specs[spec].b[bi][2].split(' ').length >= 3, 'a part has three slots or more');
    assert.equal(fit.length, 3 - ['bw', 'kb', 'all'].indexOf(equip));
    fit.forEach((r) => { assert.equal(r.length, 6); r.forEach((x) => assert.ok(Number.isInteger(x) && x > 0)); });
  });
  assert.equal(m.absFit.length, 3);
});

test('a subject with no blocks to mix, too few mixes for the cycle, and a mix whose days never fit are handled', () => {
  const { generate } = require('../recipe-book.js');
  const flow = CONFIGS.find((c) => c.id === 'flow-state'), lift = CONFIGS.find((c) => c.subject === 'Kettlebell only' && !c.frozen);
  const tiny = (id, subject, blocks, extra = {}) => ({ id, subject, minutes: [28, 32], levers: [null, 'reps', 'reps'], equip: 'all', cycle: ['a'], names: ['x'], dayTypes: { a: { label: id, short: id, blocks, ...extra } } });
  const book = generate({ configs: [
    tiny('bell', 'Kettlebell only', [lift.dayTypes[Object.keys(lift.dayTypes)[0]].blocks[0]]),
    tiny('flow', 'Yoga', [flow.dayTypes.a.blocks.find((b) => b.slots.length >= 3)], { absSlots: [] }),
    tiny('short', 'Pilates', [{ f: 'flow', title: 'Two', slots: ['hundred', 'seal'] }], { absSlots: [] }),
  ] });
  const small = R.of(book);
  assert.equal(small.mixReason(['Pilates']), 'Pilates has no blocks to mix: pick it on its own.');
  // one part each: a 3-day cycle repeats the one mix
  const o = small.options(['Kettlebell only', 'Yoga']), eq = ['all', 'kb'].find((e) => o.equipment[e].length);
  const cfg = small.make({ subjects: ['Kettlebell only', 'Yoga'], split: 3, minutes: o.equipment[eq][0], equipment: eq, levers: ['reps', 'reps', 'reps', 'reps'] }, 'one');
  assert.deepEqual(new Set(cfg.cycle.map((k) => cfg.dayTypes[k].label)).size, 1);
  // a book whose ranges claim every part can be any length: the builds say otherwise, and the mix is refused
  const liar = JSON.parse(JSON.stringify(R.book()));
  liar.mix.parts.forEach((p) => { p[4] = p[4].map(() => [1, 999, 1, 999, 1, 999]); });
  const lies = R.of(liar);
  const heavy = ['Signature', 'Strength', 'Pull-ups'], reps = heavy.flatMap(() => ['reps', 'reps']);
  assert.deepEqual(lies.options(heavy).equipment.all, [20, 25, 30, 35, 40], 'the ranges say yes');
  assert.throws(() => lies.make(mix(heavy, 20, { levers: reps }), 's'), { message: 'No mix of Signature + Strength + Pull-ups fits 20 min with all equipment.' });
  // the same with one part each, so nothing is left to swap in
  const one = JSON.parse(JSON.stringify(liar));
  one.mix.parts = heavy.map((name) => one.mix.parts.find(([si]) => one.subjects[si][0] === name));
  assert.throws(() => R.of(one).make(mix(heavy, 20, { split: 1, levers: reps }), 's'), /No mix of Signature \+ Strength \+ Pull-ups fits 20 min/);
});

test('single-subject programs are made as before: no mix, no block targets', () => {
  const cfg = R.make({ subjects: ['Strength'], split: 3, minutes: 30, equipment: 'kb', levers: ['weight', 'reps'] }, 'seed');
  assert.equal(cfg.mix, undefined);
  Object.values(cfg.dayTypes).forEach((t) => t.blocks.forEach((b) => { assert.equal(b.target, undefined); assert.equal(b.lever, undefined); }));
  assert.equal(Builder.build(cfg, cat).mix, undefined);
});

// ---- app/own.js ----
test('own: tapping subjects builds the ordered pick: join at the end, leave, never empty, up to three, unmixable ones alone', () => {
  let c = Own.defaults(recipes, 'Strength');
  c = Own.toggle(recipes, c, 'Yoga');
  assert.deepEqual(c.subjects, ['Strength', 'Yoga']);
  assert.equal(c.levers.length, 4);
  assert.deepEqual(c.levers.slice(2), [R.options('Yoga').levers[0], R.options('Yoga').levers[1]], 'yoga brings two of its own levers');
  assert.ok(c.formats.includes('flow'), 'and its formats, ticked');
  c = { ...c, levers: ['tempo', 'weight', ...c.levers.slice(2)] };
  c = Own.toggle(recipes, c, 'Boxing');
  assert.deepEqual(c.subjects, ['Strength', 'Yoga', 'Boxing']);
  assert.deepEqual(c.levers.slice(0, 2), ['tempo', 'weight'], 'strength keeps what you picked');
  assert.deepEqual(Own.toggle(recipes, c, 'HIIT').subjects, c.subjects, 'three is the most');
  c = Own.toggle(recipes, c, 'Yoga');
  assert.deepEqual(c.subjects, ['Strength', 'Boxing']);
  assert.deepEqual(c.levers, ['tempo', 'weight', 'variation', 'variation']);
  assert.ok(!c.formats.includes('flow'), 'yoga left: its flow is not offered any more');
  c = Own.toggle(recipes, c, 'Strength');
  assert.deepEqual(c.subjects, ['Boxing']);
  assert.deepEqual(Own.toggle(recipes, c, 'Boxing').subjects, ['Boxing'], 'the last one stays');
  // a subject that cannot be mixed starts over alone, and any tap while it is picked starts over too
  assert.deepEqual(Own.toggle(recipes, Own.toggle(recipes, c, 'Yoga'), 'Fighter').subjects, ['Fighter']);
  assert.deepEqual(Own.toggle(recipes, Own.defaults(recipes, 'Plyometrics'), 'Yoga').subjects, ['Yoga']);
  // what the pick cannot do moves to what it can: yoga then strength has no 20 minutes
  const moved = Own.toggle(recipes, { ...Own.defaults(recipes, 'Yoga'), minutes: 20 }, 'Strength');
  assert.equal(moved.minutes, 30);
  assert.equal(Own.problem(recipes, moved), null);
});

test('own: subjectStates says which subjects a tap can add, and why not', () => {
  const s = (c) => Object.fromEntries(Own.subjectStates(recipes, c).map((x) => [x.name, x]));
  const one = s(Own.defaults(recipes, 'Signature'));
  assert.deepEqual([one.Signature.order, one.Signature.ok, one.Yoga.order, one.Yoga.ok], [1, true, 0, true]);
  assert.equal(one.Fighter.ok, true, 'an unmixable subject can always be picked: it starts over');
  assert.equal(one.Signature.family, 'Strength');
  const two = s({ ...Own.defaults(recipes, 'Signature'), subjects: ['Signature', 'Strength'], levers: ['reps', 'reps', 'reps', 'reps'] });
  assert.deepEqual([two.Strength.order, two['Pull-ups'].ok], [2, false]);
  assert.equal(two['Pull-ups'].reason, 'No mix of Signature + Strength + Pull-ups fits 20 to 40 minutes.');
  const three = s({ ...Own.defaults(recipes, 'Strength'), subjects: ['Strength', 'Yoga', 'Boxing'], levers: leversOf(['Strength', 'Yoga', 'Boxing']) });
  assert.equal(three.HIIT.reason, 'Up to 3 subjects: tap one to take it out first.');
  assert.equal(three.Boxing.order, 3);
  const alone = s(Own.defaults(recipes, 'Fighter'));
  assert.ok(Object.values(alone).every((x) => x.ok), 'Fighter alone: every tap starts over');
});

test('own: states, fit, names and the summary line for a mix', () => {
  const c = Own.toggle(recipes, Own.defaults(recipes, 'Yoga'), 'Strength');
  const st = Own.states(recipes, c);
  assert.deepEqual([st.minutes[20].ok, st.minutes[30].ok], [false, true]);
  assert.equal(st.minutes[20].reason, 'No 20-minute Yoga + Strength days with all equipment.');
  assert.equal(st.equipment.bw.reason, 'No Yoga + Strength days with no equipment.');
  assert.equal(Own.fit(recipes, { ...c, equipment: 'bw' }).equipment, 'all');
  assert.deepEqual(Own.fit(recipes, { ...c, levers: ['holds', 'flying', 'weight', 'holds'] }).levers, ['holds', 'variation', 'weight', 'weight'], 'a lever a subject does not have: one of its own');
  // a pick that can make nothing keeps its gear and minutes (the page greys those picks out; nothing to move to)
  const none = Own.fit(recipes, { ...c, subjects: ['Signature', 'Strength', 'Pull-ups'], levers: ['reps', 'reps', 'reps', 'reps', 'reps', 'reps'], minutes: 25 });
  assert.deepEqual([none.equipment, none.minutes], ['all', 25]);
  assert.equal(Own.defaultName(c.subjects), 'My Yoga + Strength 60');
  assert.equal(Own.defaultName('Yoga'), 'My Yoga 60');
  const p = Own.programOf(deps, { pid: 'own-x', name: 'N', config: Own.configOf(recipes, { choices: c, seed: 's' }) });
  assert.equal(Own.summaryLine(p), 'Yoga + Strength, 3 days a cycle · 60 days · ~28–32 min · all equipment');
  assert.equal(Own.summaryLine(Own.programOf(deps, { pid: 'own-y', name: 'N', config: Own.configOf(recipes, { choices: { ...c, split: 1 }, seed: 's' }) })), 'Yoga + Strength, 1 day a cycle · 60 days · ~28–32 min · all equipment');
});

test('a saved mix builds identically after the book changes: its config holds the mixed day types', () => {
  const choices = Own.toggle(recipes, Own.defaults(recipes, 'Strength'), 'Yoga');
  const entry = { name: 'Mine', choices, seed: 'keep', catalogue: 5 };
  const record = JSON.parse(JSON.stringify(Own.toRecord({ ...entry, config: Own.configOf(recipes, entry) }, 'T')));
  assert.deepEqual(record.config.mix, ['Strength', 'Yoga']);
  Object.values(record.config.dayTypes).forEach((t) => t.blocks.forEach((b) => assert.ok(b.family && b.lever && b.target)));
  const before = days(Own.programOf(deps, Own.fromRecord('x', record)));
  // the book changes: half the parts go
  const book = JSON.parse(JSON.stringify(R.book()));
  book.mix.parts = book.mix.parts.filter((_, i) => i % 2);
  const other = R.of(book);
  assert.notEqual(days(Builder.build(Own.toConfig(other, { id: 'x', ...entry }), cat)), before, 'the changed book would make other days');
  assert.equal(days(Own.programOf(deps, Own.fromRecord('x', record))), before);
});

test('edit a mix after ticking days 1-3: those stay as they were, day 4 on is the new mix in its new window', () => {
  const choices = Own.toggle(recipes, Own.defaults(recipes, 'Strength'), 'Yoga');
  const entry = { name: 'Mine', choices, seed: 'e', catalogue: 5 };
  const record = Own.toRecord({ ...entry, config: Own.configOf(recipes, entry) }, 'T1');
  const old = Own.programOf(deps, Own.fromRecord('x', record));
  const three = Own.toggle(recipes, { ...choices, minutes: 40 }, 'Boxing');
  const edited = Own.edit({ recipes, ...deps }, 'x', record, { choices: three, doneDays: [1, 2, 3] }, 'T2');
  const p = Own.programOf(deps, Own.fromRecord('x', edited));
  [0, 1, 2].forEach((i) => assert.equal(JSON.stringify(p.days[i].blocks), JSON.stringify(old.days[i].blocks)));
  assert.deepEqual(edited.config.mix, ['Strength', 'Yoga', 'Boxing']);
  p.days.slice(3).forEach((d) => {
    assert.deepEqual(mains(d).map((b) => b.family), ['Strength', 'Mind & body', 'Cardio & combat']);
    const t = minutesOf(d, p.rests);
    assert.ok(t >= 37.5 && t <= 42.5, `day ${d.day}: ${t.toFixed(1)}`);
  });
});
