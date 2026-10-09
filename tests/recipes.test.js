// Recipes by subject (Phase 6 ticket 4): the library is the recipe book. pick() says which day types fit, make() turns a
// choice into a config that KBBuilder.build builds into 60 days, options() says which choices a subject allows.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const vm = require('vm');
const R = require('../recipes.js');
const Builder = require('../program-builder.js');
const cat = require('../exercises.js');
const CONFIGS = require('../programs.config.js');
const { FAMILIES } = require('../app/library.js');

const SUBJECTS = FAMILIES.flatMap(([, list]) => list).filter((s) => s !== 'Variety' && !['Couples', 'Date night warm-up', 'Positions tour', 'Morning glory / Sunday', 'Explicit', 'Rough', 'Kink-lite', 'Body play', 'Rimming', 'Edging', 'Massage', 'Strip and tease', 'Shower and bath', 'Pool', 'Hot tub', 'Balcony', 'Doorframe'].includes(s)); // Variety (Phase 16) is not in build your own: 60 one-off day types are not a subject to pick; nor Couples (Phase 18), Explicit (Phase 20), Rough and Kink-lite (Phase 22), Body play and Rimming (Phase 22), Edging and Massage (Phase 22), Strip and tease and Shower and bath (Phase 22), Pool and Hot tub (Phase 22), or Balcony and Doorframe (Phase 22): sessions for two
const MINUTES = [20, 25, 30, 35, 40];
const EQUIPS = ['all', 'kb', 'bw'];
const GEAR = { all: 'all equipment', kb: 'a kettlebell only', bw: 'no equipment' };
// levers: two of the subject's own, k picks which pair (k = 0, 1, 2 ... goes through them)
const leversFor = (subject, k = 0) => { const ls = R.options(subject).levers; return [ls[k % ls.length], ls[(k + 1) % ls.length]]; };
const choice = (subject, equipment, minutes, extra = {}) => ({ subjects: [subject], split: 3, minutes, equipment, levers: leversFor(subject), ...extra });

// the days of a made config, checked against its own range: 60 days, each inside it give or take a minute (the tolerance of
// the library's own programs, tests/builder.test.js)
function built(cfg) {
  const p = Builder.build(cfg, cat);
  assert.equal(p.days.length, 60);
  p.days.forEach((d) => {
    const t = Builder.timing.dayTime(d.blocks, p.rests) / 60;
    const [lo, hi] = cfg.dayTypes[d.type].minutes;
    assert.ok(t >= Math.min(lo - 1, lo * 0.9) && t <= Math.max(hi + 1.1, hi * 1.1), // 10% either way is fine (Noam, 9 Oct 2026)
      `${cfg.subject} ${cfg.equip} d${d.day} ${d.type}: ${t.toFixed(1)} min, want ${lo}-${hi}`);
  });
  return p;
}

test('the book holds every day type of every library config that has blocks; Three-Split 60 (frozen) has none', () => {
  const types = R.pick({});
  const want = CONFIGS.filter((c) => !c.frozen && !c.variety && !c.couple).flatMap((c) => Object.keys(c.dayTypes).map((k) => `${c.id}:${k}`));
  const have = new Set(types.map((t) => t.id));
  // identical day types of one subject are one recipe: every config day type is there, or is the same as one that is
  const missing = want.filter((id) => !have.has(id));
  missing.forEach((id) => {
    const [pid, key] = id.split(':'), c = CONFIGS.find((x) => x.id === pid), dt = c.dayTypes[key];
    assert.ok(types.some((t) => t.subject === c.subject && t.label === dt.label && JSON.stringify(t.blocks) === JSON.stringify(dt.blocks)), id);
  });
  assert.ok(types.length >= 100, `${types.length} day types`);
  assert.ok(!types.some((t) => t.program === 'three-split-60'));
  assert.deepEqual(R.skipped, ['three-split-60', ...CONFIGS.filter((c) => c.variety || c.couple).map((c) => c.id)]); // couple sessions (Phase 18) too
});

test('every subject of the library has day types, tagged with subject, family, formats, equipment, time range', () => {
  const familyOf = Object.fromEntries(FAMILIES.flatMap(([f, list]) => list.map((s) => [s, f])));
  SUBJECTS.forEach((s) => assert.ok(R.pick({ subjects: [s] }).length > 0, s));
  R.pick({}).forEach((t) => {
    assert.equal(t.family, familyOf[t.subject], t.id);
    assert.ok(['all', 'kb', 'bw'].includes(t.equip), t.id);
    assert.ok(t.formats.length > 0 && t.formats.every((f) => f in require('../formats.js').FORMATS), t.id);
    assert.ok(t.minutes[0] < t.minutes[1], t.id);
    assert.ok(Array.isArray(t.blocks) && Array.isArray(t.absSlots) && t.rests.set > 0, t.id);
    assert.equal(t.levers.length, 2, t.id);
    if (t.family === 'Mixed') assert.ok(t.families.length > 1 && !t.families.includes('Mixed'), `${t.id} lists its blocks' families`);
    else assert.deepEqual(t.families, [t.family], t.id);
  });
  const fight = R.pick({ subjects: ['Fighter'] })[0];
  assert.equal(fight.family, 'Mixed');
  assert.ok(fight.families.includes('Cardio & combat'));
});

test('a day type\'s equipment is the least gear it can be built with', () => {
  const byId = Object.fromEntries(CONFIGS.map((c) => [c.id, c]));
  R.pick({}).forEach((t) => {
    const own = byId[t.program].equip || 'all';
    assert.ok(EQUIPS.indexOf(t.equip) >= EQUIPS.indexOf(own) || own === 'all' || (own === 'kb' && t.equip !== 'all') || own === 'bw' && t.equip === 'bw', t.id);
  });
  assert.ok(R.pick({ subjects: ['Bodyweight'] }).every((t) => t.equip === 'bw'));
  assert.ok(R.pick({ subjects: ['Kettlebell only'] }).every((t) => t.equip !== 'all'));
  assert.ok(R.pick({ subjects: ['Yoga'] }).every((t) => t.equip === 'bw'));
  assert.ok(R.pick({ subjects: ['Strength'] }).some((t) => t.equip === 'all'), 'heavy dumbbell days need all the gear');
});

test('pick: equipment rule: bw fits every choice, kb fits kb and all, all fits only all', () => {
  const bw = R.pick({ equipment: 'bw' }), kb = R.pick({ equipment: 'kb' }), all = R.pick({ equipment: 'all' });
  assert.ok(bw.every((t) => t.equip === 'bw'));
  assert.ok(kb.every((t) => t.equip !== 'all') && kb.some((t) => t.equip === 'kb'));
  assert.equal(all.length, R.pick({}).length, 'all gear fits everything');
  assert.ok(bw.length < kb.length && kb.length < all.length);
  bw.forEach((t) => assert.ok(kb.includes(t) && all.includes(t)));
  assert.throws(() => R.pick({ equipment: 'barbell' }), /equipment/);
});

test('pick: subjects and families are "any of"; formats: a day type fits when all of its formats are ticked', () => {
  const two = R.pick({ subjects: ['Yoga', 'Pilates'] });
  assert.ok(two.length > 0 && two.every((t) => ['Yoga', 'Pilates'].includes(t.subject)));
  assert.ok(two.some((t) => t.subject === 'Yoga') && two.some((t) => t.subject === 'Pilates'));
  const fam = R.pick({ families: ['Cardio & combat'] });
  assert.ok(fam.length > 0 && fam.every((t) => t.family === 'Cardio & combat'), 'family = the shelf, so Fighter (Mixed) is not in Cardio & combat');
  assert.deepEqual(R.pick({ subjects: ['Yoga'], families: ['Strength'] }), []);
  assert.deepEqual(R.pick({ subjects: ['No such subject'] }), []);
  const flows = R.pick({ subjects: ['Yoga'], formats: ['flow'] });
  assert.ok(flows.length > 0 && flows.every((t) => t.formats.every((f) => f === 'flow')));
  const sets = R.pick({ subjects: ['Strength'], formats: ['straight'] });
  assert.ok(sets.length > 0 && sets.every((t) => t.formats.every((f) => f === 'straight')));
  assert.ok(sets.length < R.pick({ subjects: ['Strength'], formats: ['straight', 'superset', 'circuit', 'emom', 'amrap', 'tabata', 'ladder'] }).length);
  assert.deepEqual(R.pick({ subjects: ['Boxing'], formats: ['flow'] }), []);
  assert.deepEqual(R.pick({ formats: [] }), []);
});

test('pick: minutes: a day type fits when it builds within 2.5 min of the target; the grid is 15 to 40 in fives', () => {
  const at = (m, o) => R.pick({ minutes: m, ...o });
  // the same rule for 22 and 20 (both nearest to the 20 target), and 23 sits between 20 and 25 so either target will do
  assert.deepEqual(at(21).map((t) => t.id), at(20).map((t) => t.id));
  assert.ok(at(23).length >= at(20).length && at(23).length >= at(25).length);
  assert.deepEqual(at(50), [], 'far out of every range');
  assert.ok(at(15).length > 0, 'a random 15-minute workout has day types');
  const boxing20 = at(20, { subjects: ['Boxing'], equipment: 'all' }), boxing30 = at(30, { subjects: ['Boxing'] });
  assert.equal(boxing20.length, 0, 'a bout is 3 min plus rest: boxing does not shrink to 20');
  assert.ok(boxing30.length > 0);
  // every day type it returns builds in the window at that many minutes (the book was made from real builds)
  [15, 20, 30, 40].forEach((m) => at(m).slice(0, 25).forEach((t) => {
    const rec = R.recipeFor(t, { minutes: m, equipment: t.equip, levers: t.levers });
    const mem = Builder.newMemory(), rnd = Builder.makeRnd('pick');
    [1, 21, 41].forEach((day) => {
      const d = Builder.buildDay(rec, { day, level: day < 20 ? 1 : day < 40 ? 2 : 3, rnd, memory: mem }, cat);
      const tm = Builder.timing.dayTime(d.blocks, rec.rests) / 60;
      assert.ok(tm >= m - 2.5 && tm <= m + 2.5, `${t.id} ${m} min day ${day}: ${tm.toFixed(1)}`);
    });
  }));
  assert.throws(() => R.pick({ minutes: 'soon' }), /Minutes must be a number/);
});

test('options(subject): the equipment and minutes it allows, its formats and levers', () => {
  const o = R.options('Yoga');
  assert.deepEqual(Object.keys(o).sort(), ['equipment', 'formats', 'levers', 'subject']);
  assert.equal(o.subject, 'Yoga');
  assert.deepEqual(Object.keys(o.equipment), ['all', 'kb', 'bw'], 'every equipment, each with its minutes (maybe none)');
  assert.deepEqual(o.equipment.bw, o.equipment.all, 'yoga needs no gear: every choice gives the same days');
  assert.ok(o.equipment.bw.length > 0 && o.equipment.bw.every((m) => MINUTES.includes(m)));
  assert.ok(o.formats.includes('flow'));
  assert.ok(o.levers.includes('holds'));
  const boxing = R.options('Boxing');
  assert.ok(!boxing.equipment.all.includes(20) && boxing.equipment.all.includes(30));
  assert.throws(() => R.options('Basket weaving'), /Basket weaving/);
  // the minutes it allows are exactly the ones make() accepts
  SUBJECTS.forEach((s) => EQUIPS.forEach((eq) => MINUTES.forEach((m) => {
    const allowed = R.options(s).equipment[eq].includes(m);
    assert.equal(R.pick({ subjects: [s], equipment: eq, minutes: m }).some((t) => R.fitsExactly(t, eq, m)), allowed, `${s} ${eq} ${m}`);
  })));
});

test('make: for every subject, every equipment it allows, and 20 / 30 / 40 minutes: 60 days inside the range', () => {
  const t0 = Date.now();
  let combos = 0;
  SUBJECTS.forEach((subject) => {
    const allowed = R.options(subject).equipment;
    EQUIPS.forEach((eq) => [20, 30, 40].filter((m) => allowed[eq].includes(m)).forEach((m) => {
      ['a', 'b', 'c'].forEach((seed, k) => {
        const cfg = R.make(choice(subject, eq, m, { levers: leversFor(subject, k) }), seed);
        const p = built(cfg);
        assert.equal(p.subject, subject);
        assert.equal(p.equip, eq);
        assert.deepEqual(cfg.minutes, [m - 2, m + 2]);
        // gear rules
        p.days.forEach((d) => d.blocks.forEach((b) => b.items.forEach((it) => {
          const e = cat.EX[it.ex];
          if (eq === 'bw') assert.ok(!e.load && !(e.equip || []).includes('bar'), `${subject} bw: ${it.ex}`);
          if (eq === 'kb') assert.ok((!e.load || e.load === 'kb') && !(e.equip || []).includes('bar'), `${subject} kb: ${it.ex}`);
        })));
        combos++;
      });
    }));
  });
  console.log(`# make: ${combos} programs built in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  assert.ok(combos > 200);
});

test('make: 25 and 35 minutes, every split 1 to 5, other levers: a sample of subjects builds in range', () => {
  const some = ['Strength', 'Kettlebell only', 'Bodyweight', 'HIIT', 'Plyometrics', 'Kickboxing', 'Yoga', 'Flexibility', 'Fighter', 'Balanced week'];
  some.forEach((subject) => [25, 35].forEach((m) => {
    const allowed = R.options(subject).equipment;
    EQUIPS.filter((eq) => allowed[eq].includes(m)).forEach((eq) => {
      const split = 1 + ((m / 5 + some.indexOf(subject)) % 5);
      const levers = leversFor(subject, m / 5 + split);
      const cfg = R.make(choice(subject, eq, m, { split, levers }), 'x' + split);
      assert.deepEqual(cfg.levers, [null, ...levers]);
      assert.equal(cfg.cycle.length, split);
      built(cfg);
    });
  }));
});

test('make: what the config holds', () => {
  const cfg = R.make(choice('Strength', 'kb', 30, { split: 4, levers: ['weight', 'reps'] }), 'seed');
  assert.equal(cfg.id, 'own-preview');
  assert.equal(cfg.subject, 'Strength');
  assert.equal(cfg.equip, 'kb');
  assert.deepEqual(cfg.levers, [null, 'weight', 'reps']);
  assert.equal(cfg.catalogue, 13, 'the newest catalogue (Phase 22)');
  assert.equal(cfg.cycle.length, 4);
  assert.equal(new Set(cfg.cycle).size, 4);
  assert.equal(typeof cfg.about, 'string');
  assert.equal(typeof cfg.blurb, 'string');
  assert.ok(cfg.name.includes('Strength'));
  assert.equal(cfg.names.length, 60, 'one name per day, so a cycle never runs out of names');
  assert.equal(new Set(cfg.names).size, 60);
  cfg.cycle.forEach((k) => {
    const dt = cfg.dayTypes[k];
    assert.ok(dt.label && dt.blocks.length && dt.minutes[0] === 28 && dt.minutes[1] === 32 && Array.isArray(dt.absSlots));
    assert.equal(dt.levers, undefined, 'the choice\'s levers rule the day');
  });
  assert.ok(cfg.split.split(' / ').length === 4);
  // an older catalogue can be asked for (a saved program is rebuilt with the catalogue it was made with)
  assert.equal(R.make(choice('Strength', 'kb', 30, { catalogue: 3 }), 's').catalogue, 3);
  // no levers given: the first day type's own
  const noLevers = R.make({ subjects: ['Yoga'], split: 2, minutes: 30, equipment: 'bw' }, 's');
  assert.equal(noLevers.levers.length, 3);
  assert.equal(noLevers.levers[0], null);
  assert.ok(noLevers.levers.slice(1).every((l) => R.options('Yoga').levers.includes(l)));
});

test('make: no duplicate day types when there are enough, and a cycle can repeat one when there are not', () => {
  R.options('Strength'); // touches the book
  for (const seed of ['1', '2', '3', '4', '5', '6']) {
    const cfg = R.make(choice('Strength', 'all', 40, { split: 5 }), seed);
    const labels = cfg.cycle.map((k) => cfg.dayTypes[k].label);
    assert.equal(new Set(labels).size, 5, labels.join(', '));
  }
  const few = R.pick({ subjects: ['Boxing'], equipment: 'bw', minutes: 30 });
  assert.ok(few.length >= 1);
  const cfg = R.make(choice('Boxing', 'bw', 30, { split: 5 }), 'q');
  assert.equal(cfg.cycle.length, 5, 'still five days a cycle');
  built(cfg);
});

test('make: a config for one subject whose day types differ in rests keeps to one rests table', () => {
  const rests = (cfg) => new Set(Object.values(cfg.dayTypes).map((d) => JSON.stringify(d.rests || cfg.rests || null)));
  ['Athlete', 'Plyometrics', 'Fighter'].forEach((s) => {
    const o = R.options(s).equipment;
    const eq = EQUIPS.find((e) => o[e].length);
    ['a', 'b', 'c', 'd'].forEach((seed) => {
      const cfg = R.make(choice(s, eq, o[eq][0], { split: 4 }), seed);
      assert.ok(rests(cfg).size === 1, s);
      built(cfg);
    });
  });
});

test('make: deterministic per seed, different across seeds', () => {
  const c = choice('Strength', 'all', 40, { split: 3 });
  const a = JSON.stringify(Builder.build(R.make(c, 'one'), cat)), b = JSON.stringify(Builder.build(R.make(c, 'one'), cat));
  assert.equal(a, b);
  assert.equal(JSON.stringify(R.make(c, 'one')), JSON.stringify(R.make(c, 'one')));
  const variants = new Set(['1', '2', '3', '4', '5', '6', '7', '8'].map((s) => JSON.stringify(R.make(c, s).cycle.map((k) => R.make(c, s).dayTypes[k].label))));
  assert.ok(variants.size >= 5, `${variants.size} different splits from 8 seeds`);
  assert.notEqual(JSON.stringify(Builder.build(R.make(c, 'one'), cat).days), JSON.stringify(Builder.build(R.make(c, 'two'), cat).days));
  assert.equal(JSON.stringify(R.make(c, 7)), JSON.stringify(R.make(c, '7')), 'a number seed is its text');
  assert.doesNotThrow(() => R.make(c)); // no seed: the same as ''
});

test('make: formats limit the day types, and the built days use only those formats', () => {
  const cfg = R.make(choice('Strength', 'all', 30, { formats: ['straight'] }), 's');
  const p = built(cfg);
  assert.deepEqual(p.formats, ['straight']);
  assert.throws(() => R.make(choice('Yoga', 'bw', 30, { formats: ['tabata'] }), 's'), /Yoga day types fit 30 min with no equipment using only Tabata/);
});

test('make: what cannot be made says why, for people', () => {
  // yoga at 20 min with a kettlebell only: whatever yoga allows, the words name subject, minutes and gear
  const refused = [];
  SUBJECTS.forEach((s) => EQUIPS.forEach((eq) => MINUTES.forEach((m) => {
    if (R.options(s).equipment[eq].includes(m)) return;
    refused.push(`${s} × ${eq} × ${m}`);
    assert.throws(() => R.make(choice(s, eq, m), 'x'), { message: `No ${s} day types fit ${m} min with ${GEAR[eq]}.` }, `${s} ${eq} ${m}`);
  })));
  console.log(`# refused: ${refused.length}: ${refused.join('; ')}`);
  assert.ok(refused.some((r) => r.startsWith('Boxing × all × 20')));
  assert.throws(() => R.make(choice('Boxing', 'kb', 20), 'x'), /^Error: No Boxing day types fit 20 min with a kettlebell only\.$/);
});

test('make: a choice that is not a choice is refused', () => {
  const bad = (o, re) => assert.throws(() => R.make(choice('Yoga', 'bw', 30, o), 's'), re);
  bad({ subjects: [] }, /subject/);
  bad({ subjects: ['Yoga', 'Pilates', 'Boxing', 'HIIT'] }, /up to 3 subjects/);
  bad({ subjects: ['Nonsense'] }, /Nonsense/);
  bad({ split: 0 }, /Days per cycle/);
  bad({ split: 6 }, /Days per cycle/);
  bad({ split: 2.5 }, /Days per cycle/);
  bad({ minutes: 22 }, /Minutes: pick/);
  bad({ equipment: 'barbell' }, /equipment/);
  bad({ formats: ['juggling'] }, /Unknown format: juggling/);
  bad({ formats: 'straight' }, /Formats: pick/);
  bad({ levers: ['holds'] }, /lever for Level II and one for Level III/);
  bad({ levers: ['holds', 'weight'] }, /^Error: Yoga does not get harder by heavier weights: pick longer holds/);
  bad({ levers: ['holds', 'flying'] }, /flying/);
  assert.throws(() => R.make(undefined, 's'), /choice/);
  assert.throws(() => R.make({ split: 3, minutes: 30, equipment: 'bw' }, 's'), /subject/);
});

test('recipeFor: a recipe buildDay accepts, from a day type', () => {
  const t = R.pick({ subjects: ['Strength'], equipment: 'kb', minutes: 30 })[0];
  const r = R.recipeFor(t, { minutes: 30, equipment: 'kb', levers: ['weight', 'reps'] });
  assert.deepEqual([r.minutes, r.equip, r.levers, r.catalogue, r.key, r.label], [[28, 32], 'kb', [null, 'weight', 'reps'], 13, t.key, t.label]);
  const d = Builder.buildDay(r, { day: 1, level: 1, rnd: Builder.makeRnd('r'), memory: Builder.newMemory() }, cat);
  assert.equal(d.title, t.label);
});

test('the builder builds the made config in the page too: no Node calls, same days, the book from a loader', async () => {
  const load = (f, sb) => vm.runInContext(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'), sb);
  const sandbox = vm.createContext({ window: {} });
  ['formats.js', 'exercises.js', 'app/length.js', 'program-builder.js', 'recipes.js'].forEach((f) => load(f, sandbox));
  const page = sandbox.window;
  assert.ok(page.KBRecipes && page.KBBuilder);
  assert.equal(page.KBRecipes.pick, undefined, 'the page has no book until the loader brings it');
  // the page fetches data/recipes.json (what build.js writes)
  const { render } = require('../build.js');
  const file = require('./helpers/library.js').rendered()['data/recipes.json'];
  const loader = require('../app/lazy.js').lazyFile({ fetch: async (url) => { assert.equal(url, 'data/recipes.json'); return JSON.parse(file); }, cache: { get: async () => undefined, put: async () => {} }, url: 'data/recipes.json', unavailable: '' });
  const recipes = page.KBRecipes.of(await loader.load());
  const c = choice('Fighter', 'all', 35, { split: 3 });
  const inPage = recipes.make(c, 'page');
  assert.equal(JSON.stringify(inPage), JSON.stringify(R.make(c, 'page')));
  const days = page.KBBuilder.build(inPage, page.KBEx);
  assert.equal(days.days.length, 60);
  assert.equal(JSON.stringify(days), JSON.stringify(Builder.build(R.make(c, 'page'), cat)));
  assert.deepEqual(JSON.stringify(recipes.options('Yoga')), JSON.stringify(R.options('Yoga')));
  // a mix is checked by building it: in the page with the page's builder, to the same config
  const m = { subjects: ['Strength', 'Yoga'], split: 2, minutes: 30, equipment: 'kb', levers: ['weight', 'reps', 'holds', 'holds'] };
  assert.equal(JSON.stringify(recipes.make(m, 'page')), JSON.stringify(R.make(m, 'page')));
  assert.equal(JSON.stringify(recipes.options(['Yoga', 'Boxing'])), JSON.stringify(R.options(['Yoga', 'Boxing'])));
  assert.equal(recipes.pick({ subjects: ['Yoga'] }).length, R.pick({ subjects: ['Yoga'] }).length);
  assert.equal(sandbox.require, undefined);
});

test('the recipe book file is small (under 500 KB raw, 70 KB gzipped) and is not in index.html', () => {
  const { render } = require('../build.js');
  const out = require('./helpers/library.js').rendered(), json = out['data/recipes.json'];
  const gz = zlib.gzipSync(json).length;
  console.log(`# data/recipes.json: ${json.length} bytes raw, ${gz} bytes gzipped; ${R.pick({}).length} day types, ${R.book().specs.length} specs`);
  assert.ok(json.length < 500 * 1024 && gz < 70 * 1024, `${json.length} raw, ${gz} gzipped`); // 300 / 40 KB until Phase 16 (306 KB with the muscle subjects and after-dark, ~470 KB expected after its +50%); 140 / 20 KB until Phase 14: each new program's day types add about 1 KB raw; the book loads only when Build your own opens // the mix parts (ticket 7) are about 17 KB raw, 4 KB gzipped
  assert.equal(json, JSON.stringify(R.book()));
  assert.ok(!out['index.html'].includes('RECIPE_BOOK') && !out['index.html'].includes('"specs"'), 'the page does not carry the book');
  assert.ok(!out['index.html'].includes('function recipeFor') && out['data/recipes.js'].includes('KBRecipes'), 'its code is data/recipes.js');
});

test('the committed book is fresh: recipes/book.json holds the hash of the files it comes from', () => {
  const RB = require('../recipe-book.js');
  const saved = RB.stored();
  assert.ok(saved, 'run npm run recipes');
  assert.equal(saved.hash, RB.hash(), 'the committed recipe book is stale: run npm run recipes');
  assert.ok(RB.INPUTS().includes('configs/mixed.js') && RB.INPUTS().every((f) => fs.existsSync(path.join(__dirname, '..', f))));
  assert.match(require('../package.json').scripts.recipes, /recipe-book/);
});

test('the book file is reused when the hash matches, and made and rewritten when not', () => {
  const RB = require('../recipe-book.js');
  const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'recipes-'));
  const file = path.join(dir, 'sub', 'book.json');
  let made = 0;
  const make = () => { made++; return { v: 'made' + made }; };
  assert.deepEqual(RB.refresh({ file, make }), { v: 'made1' }, 'no file: made and written');
  assert.equal(RB.stored(file).hash, RB.hash());
  assert.deepEqual(RB.refresh({ file, make }), { v: 'made1' }, 'same hash: reused');
  assert.equal(made, 1);
  fs.writeFileSync(file, JSON.stringify({ hash: 'old', book: { v: 'old' } }));
  assert.deepEqual(RB.refresh({ file, make }), { v: 'made2' }, 'other hash: made again');
  assert.deepEqual(RB.stored(file).book, { v: 'made2' });
  fs.writeFileSync(file, 'not json');
  assert.equal(RB.stored(file), null);
  assert.deepEqual(RB.refresh({ file, make }), { v: 'made3' });
  fs.rmSync(dir, { recursive: true });
});

test('the book is made from the library, so it changes with it: generate() over a small config list', () => {
  const { generate } = require('../recipe-book.js');
  const cfg = { id: 'tiny', subject: 'Yoga', minutes: [28, 32], levers: [null, 'holds', 'holds'], equip: 'bw', cycle: ['a'], names: ['x'],
    dayTypes: { a: { label: 'Only', short: 'Only', blocks: CONFIGS.find((c) => c.id === 'flow-state').dayTypes.a.blocks } } };
  const book = generate({ configs: [cfg, { ...cfg, id: 'twin' }, { id: 'frozen', frozen: 'x', subject: 'Yoga', dayTypes: {} }] });
  assert.equal(book.types.length, 1, 'the twin day type (same subject, label and blocks) is one recipe');
  assert.deepEqual(book.skipped, ['frozen']);
  assert.throws(() => generate({ configs: [{ ...cfg, subject: 'Lost' }] }), /Lost/);
});

test('the book: a day type that fails for a reason other than missing gear is an error, not a skipped gear', () => {
  const { generate } = require('../recipe-book.js');
  const cfg = { id: 'odd', subject: 'Yoga', minutes: [28, 32], levers: [null, 'holds', 'holds'], equip: 'bw', cycle: ['a'], names: ['x'],
    dayTypes: { a: { label: 'Odd', short: 'Odd', blocks: [{ f: 'nonsense', title: 'x', slots: ['push'] }] } } };
  assert.throws(() => generate({ configs: [cfg] }));
});

test('the book: generating from real configs covers variation levers, short names and Mixed families', () => {
  const { generate } = require('../recipe-book.js');
  const real = CONFIGS.filter((c) => !c.frozen);
  const variation = real.find((c) => c.subject === 'Boxing' && c.levers.includes('variation'));
  const shortName = real.find((c) => Object.values(c.dayTypes).some((d) => d.short !== d.label));
  const mixed = real.find((c) => FAMILIES.find(([f, list]) => f === 'Mixed' && list.includes(c.subject)));
  const book = generate({ configs: [variation, shortName, mixed] });
  assert.ok(book.types.length >= 3);
  assert.ok(book.types.some((t) => t.short), 'a short name that differs from the label is kept');
  assert.ok(book.types.some((t) => t.mixed && t.mixed.length > 1), 'a mixed day lists its blocks\' families');
  assert.ok(book.types.every((t) => t.fit.length >= 1));
});
