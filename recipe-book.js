/* Recipe book (Node only, made at build time): every day type of every library config, ready for recipes.js.
     generate({ configs, families, catalogue }) -> the book (compact, JSON-safe; recipes.js `of(book)` reads it)
     book() -> the book of the library: read from recipes/book.json when its hash still matches the inputs, else generated
     hash() -> sha256 of the files the book comes from; refresh() -> book(), rewriting recipes/book.json when stale
   Making it builds every day type a few thousand times (about 20 s), so it is kept in recipes/book.json (committed)
   with the hash of its inputs. build.js reuses it when the hash matches and rewrites it when not; a test fails when the
   committed one is stale: run `npm run recipes`.
   A day type is read from recipesOf(config), so nothing is written by hand. Each one is tagged with its subject, family
   (Mixed for mixed days, whose blocks' families are in `families`), formats, and its equipment: the least gear it builds
   with (bw, then kb, then all), found by really building it. `fit` says at which time targets it really builds inside the
   window, per equipment: a bit per target of GRID, over three levels. Blocks, abs slots and rests are
   kept once in `specs` (identical ones shared), and a day type of the same subject with the same label and spec is one recipe.
   The book: { v, catalogue, skipped, subjects: [[name, family, levers]], rests: [table], specs: [{ b: blocks, a: abs slots, r: rests }],
   types: [{ id: 'program:key', label, short?, subject: index, spec: index, equip, fit: [mask per equipment from `equip` up],
   minutes, levers, mixed?: families of the blocks }], mix: { rests: index, abs: 'slot slot?', absFit: [range per equipment:
   bw, kb, all], parts: [[subject index, spec index, block index, equip, [range per equipment from `equip` up]]] } }. Blocks are
   [format, title, 'slot slot?', rest of the block?].
   Mix (build your own with 2-3 subjects, Phase 6 ticket 7): the parts a mixed day is joined from. A part is a block of three
   or more slots of a day type whose subject is not Mixed (a mix of mixes is not offered) and that rests like the
   builder's REST (`rests`: one program has one rests table, so Plyometrics, which rests longer, is not mixed), once per
   subject. Each part is tried alone, like a day type: at Level I, and at Levels II and III with every lever of its
   subject, with the draws below, and its range says, per level, how short every trial can build it and how long every
   trial can build it: [short I, long I, short II, long II, short III, long III] in quarter minutes (short rounded up,
   long rounded down). The abs finisher of a mixed day is tried the same way with the strength levers. recipes.js adds
   ranges up to see which mixes can reach a time at all, then builds the program it makes to check every day.
   Programs with no blocks to read (Three-Split 60 is frozen: its days are saved, not built) are listed in `skipped`. */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Recipes = require('./recipes.js');
const Builder = require('./program-builder.js');
const L = require('./app/length.js');
const cat = require('./exercises.js');
const { FAMILIES } = require('./app/library.js');

const EQUIPS = ['bw', 'kb', 'all'];
// A day is inside its window when its estimate, rounded to whole minutes as the app shows it, is: the trial asks for that
// (half a minute either side). The library's own programs are held to a minute either side (tests/builder.test.js), which
// leaves half a minute for what a trial cannot see.
const SLACK = 0.5;
// A day type is only tried at targets within 40% of the middle of its own range (a 40-minute day is not tried at 15)
const STRETCH = 0.4;

// how long an exercise takes at a level, roughly: what makes one draw of exercises slower than another
const duration = (e, level) => (e.u === 'sec' ? e.r[level - 1] : e.r[level - 1] * e.tp) * (e.side ? 2 : 1);
const IDS = Object.keys(cat.EX);
// Draws of exercises for one day. buildDay takes the least used exercise of a pool first, so "used" says who goes first:
// the slowest of every pool, then the fastest, then two random ones. A "variation" lever swaps in a harder exercise when
// rnd() < 0.6, so the slowest and the fastest are tried with it always and never.
const usedFor = {}; // the starting "used" of a draw depends on the level and the sign only: made once
function draws(level, lever) {
  const memoryWith = (sign) => () => {
    const k = `${sign}|${level}`;
    usedFor[k] = usedFor[k] || Object.fromEntries(IDS.map((id) => [id, sign * duration(cat.EX[id], level) - (sign < 0 ? 1000 : 0)]));
    return { ...Builder.newMemory(), used: { ...usedFor[k] } };
  };
  const rnds = lever === 'variation' ? [() => 0, () => 0.99] : [Builder.makeRnd('x')];
  return [
    ...rnds.map((rnd) => () => ({ memory: memoryWith(-1)(), rnd })),
    ...rnds.map((rnd) => () => ({ memory: memoryWith(1)(), rnd })),
    () => ({ memory: Builder.newMemory(), rnd: Builder.makeRnd('a') }),
    () => ({ memory: Builder.newMemory(), rnd: Builder.makeRnd('b') }),
  ];
}

// does this day type build, inside its window, at this target with this gear, whichever of the subject's levers is
// picked? Level I, and Levels II and III with every lever; each with the draws above
function builds(type, minutes, equipment, catalogue, levers) {
  const rec = Recipes.recipeOf(type, { minutes, equipment, levers: type.levers, catalogue });
  const [lo, hi] = rec.minutes;
  const [, two, three] = L.levelStarts(L.DAYS); // the first day of Levels II and III
  const days = [{ day: 1, level: 1 }, ...levers.flatMap((lever) => [{ day: two, level: 2, lever }, { day: three, level: 3, lever }])];
  return days.every((d) => draws(d.level, d.lever).every((draw) => {
    const day = Builder.buildDay(rec, { ...d, ...draw() }, cat);
    const t = Builder.timing.dayTime(day.blocks, rec.rests) / 60;
    return t >= lo - SLACK && t <= hi + SLACK;
  }));
}
// the least gear something builds with: a slot with nothing usable for the gear is the builder's own error
const leastGear = (tryWith) => EQUIPS.find((eq) => {
  try { tryWith(eq); return true; } catch (e) {
    if (/ is empty$/.test(e.message)) return false;
    throw e;
  }
});

// ---------- parts: blocks tried alone, for mixes ----------
const q = (m, round) => round(m * 4 - (round === Math.ceil ? 1e-9 : -1e-9)); // minutes -> quarter minutes
// per level: the longest of the trials' shortest times, and the shortest of their longest times
function range(rec, levers) {
  const trials = [{ level: 1 }, ...levers.flatMap((lever) => [{ level: 2, lever }, { level: 3, lever }])];
  const out = [[0, Infinity], [0, Infinity], [0, Infinity]];
  trials.forEach((d) => draws(d.level, d.lever).forEach((draw) => {
    const times = Builder.blockTimes(rec, { ...d, ...draw() }, cat)[0], r = out[d.level - 1];
    r[0] = Math.max(r[0], Math.min(...times)); r[1] = Math.min(r[1], Math.max(...times));
  }));
  return out.flatMap(([lo, hi]) => [q(lo, Math.ceil), q(hi, Math.floor)]);
}
// one block (or only the abs finisher) as a recipe of its own
const partRecipe = (block, absSlots, equipment, catalogue) => ({ program: 'part', key: 'part', label: 'part', blocks: block ? [block] : [], minutes: [0, 0], equip: equipment, rests: Builder.REST, catalogue, levers: [null, null, null], absSlots });
// a part's least gear, and its range with that gear and every one above it
function partFit(block, absSlots, levers, catalogue) {
  const gear = leastGear((eq) => Builder.blockTimes(partRecipe(block, absSlots, eq, catalogue), { level: 1, ...draws(1)[0]() }, cat));
  return { equip: gear, fit: EQUIPS.slice(EQUIPS.indexOf(gear)).map((eq) => range(partRecipe(block, absSlots, eq, catalogue), levers)) };
}

const near = ([lo, hi], m) => Math.abs(m - (lo + hi) / 2) <= STRETCH * ((lo + hi) / 2);
const intern = (list, keyOf, value) => {
  const k = keyOf(value);
  let i = list.findIndex((x) => keyOf(x) === k);
  if (i < 0) i = list.push(value) - 1;
  return i;
};
const json = JSON.stringify;

// The newest catalogue own programs and random workouts are made at. Held while a phase adds to it, so a program saved
// mid-phase never reshuffles when the next ticket grows its pools (Phase 22, decision 121); moved when the phase is in.
const NEWEST = 13;

function generate({ configs = require('./programs.config.js'), families = FAMILIES, catalogue = NEWEST } = {}) {
  const familyOf = new Map(families.flatMap(([f, list]) => list.map((s) => [s, f])));
  // the levers a subject's programs use at Level II and III: what a choice for that subject may pick
  const levers = {};
  configs.filter((c) => !c.frozen).forEach((c) => Object.values(Builder.recipesOf(c)).forEach((r) => r.levers.slice(1).forEach((l) => { (levers[c.subject] = levers[c.subject] || new Set()).add(l); })));
  const subjects = [], restTables = [], specs = [], types = [], skipped = [], seen = new Set(), trial = new Map();
  const parts = [], partSeen = new Set(), partTrial = new Map();
  configs.forEach((cfg) => {
    if (cfg.frozen || cfg.variety || cfg.couple) { skipped.push(cfg.id); return; } // frozen; Variety (Phase 16): 60 one-off day types, not a subject to pick; couple sessions (Phase 18): for two, not for build your own or a random workout
    const family = familyOf.get(cfg.subject);
    if (!family) throw new Error(`${cfg.id}: subject ${cfg.subject} is in no family`);
    const subject = intern(subjects, json, [cfg.subject, family, Recipes.LEVERS.filter((l) => levers[cfg.subject].has(l))]);
    Object.entries(Builder.recipesOf(cfg)).forEach(([key, r]) => {
      const blocks = r.blocks.map(({ f, title, slots, ...more }) => (Object.keys(more).length ? [f, title, slots.join(' '), more] : [f, title, slots.join(' ')]));
      const spec = { b: blocks, a: r.absSlots.join(' '), r: intern(restTables, json, r.rests) };
      const index = intern(specs, json, spec), dedupe = `${cfg.subject}|${r.label}|${index}`;
      if (seen.has(dedupe)) return;
      seen.add(dedupe);
      const blockFamilies = [...new Set(r.blocks.map((b) => b.family).filter(Boolean))];
      const short = cfg.dayTypes[key].short;
      const type = { id: `${r.program}:${key}`, label: r.label, subject, spec: index, minutes: r.minutes, levers: r.levers.slice(1) };
      if (short !== r.label) type.short = short;
      if (family === 'Mixed') type.mixed = blockFamilies;
      // equipment and fit depend on the spec and the subject's levers: tried once for each
      const trialKey = `${index}|${subject}`;
      if (!trial.has(trialKey)) {
        const hydrated = { program: r.program, key, label: r.label, blocks: r.blocks, absSlots: r.absSlots, rests: r.rests, levers: type.levers }, fit = [];
        const gear = leastGear((eq) => builds(hydrated, 30, eq, catalogue, []));
        EQUIPS.slice(EQUIPS.indexOf(gear)).forEach((eq) => {
          fit.push(Recipes.GRID.reduce((bits, m, i) => bits | (near(r.minutes, m) && builds(hydrated, m, eq, catalogue, subjects[subject][2]) ? 1 << i : 0), 0));
        });
        trial.set(trialKey, { equip: gear, fit });
      }
      types.push({ ...type, ...trial.get(trialKey) });
      // its blocks as parts of a mix: blocks that stand on their own, of a subject that is one family, resting like REST
      if (family === 'Mixed' || json(r.rests) !== json(Builder.REST)) return;
      r.blocks.forEach((block, bi) => {
        const key = `${subject}|${json(block)}`;
        if (block.slots.length < 3 || partSeen.has(key)) return;
        partSeen.add(key);
        const tried = `${json(block)}|${subjects[subject][2]}`;
        if (!partTrial.has(tried)) partTrial.set(tried, partFit(block, [], subjects[subject][2], catalogue));
        const made = partTrial.get(tried);
        parts.push([subject, index, bi, made.equip, made.fit]);
      });
    });
  });
  // the abs finisher of a mix whose last block is strength: it levels by that subject's lever, so every strength lever is tried
  const strengthLevers = Recipes.LEVERS.filter((l) => subjects.some(([, f, ls]) => f === 'Strength' && ls.includes(l)));
  const abs = Builder.ABS_SLOTS;
  const mix = { rests: intern(restTables, json, Builder.REST), abs: abs.join(' '), absFit: partFit(null, abs, strengthLevers, catalogue).fit, parts };
  return { v: 2, catalogue, skipped, subjects, rests: restTables, specs, types, mix };
}

// what the book comes from: the configs, the builder and what it reads, the families, and this file
const INPUTS = () => [
  ...fs.readdirSync(path.join(__dirname, 'configs')).filter((f) => f.endsWith('.js')).sort().map((f) => `configs/${f}`),
  'programs.config.js', 'exercises.js', 'formats.js', 'program-builder.js', 'app/length.js', 'app/library.js', 'recipes.js', 'recipe-book.js',
];
const hash = () => {
  const h = crypto.createHash('sha256');
  INPUTS().forEach((f) => h.update(`${f}\n`).update(fs.readFileSync(path.join(__dirname, f))));
  return h.digest('hex');
};
const FILE = path.join(__dirname, 'recipes', 'book.json');
const stored = (file = FILE) => { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return null; } };

// the stored book when its hash matches the inputs, else a made one (written to the file when `write`)
function load(file, make, write) {
  const saved = stored(file), h = hash();
  if (saved && saved.hash === h) return saved.book;
  const made = make();
  if (write) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify({ hash: h, book: made }) + '\n');
  }
  return made;
}
let cached;
const book = () => (cached = cached || load(FILE, generate, false));
// npm run recipes, and build.js: the committed file is fresh, or made again and rewritten
const refresh = ({ file = FILE, make = generate } = {}) => load(file, make, true);
/* node:coverage ignore next 2 */ // npm run recipes
if (require.main === module) { refresh(); console.log('recipes/book.json is fresh'); }
module.exports = { generate, book, hash, refresh, stored, FILE, INPUTS, NEWEST };
