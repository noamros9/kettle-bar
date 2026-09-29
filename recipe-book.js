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
   minutes, levers, mixed?: families of the blocks }] }. Blocks are [format, title, 'slot slot?', rest of the block?].
   Programs with no blocks to read (Three-Split 60 is frozen: its days are saved, not built) are listed in `skipped`. */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Recipes = require('./recipes.js');
const Builder = require('./program-builder.js');
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
  const days = [{ day: 1, level: 1 }, ...levers.flatMap((lever) => [{ day: 21, level: 2, lever }, { day: 41, level: 3, lever }])];
  return days.every((d) => draws(d.level, d.lever).every((draw) => {
    const day = Builder.buildDay(rec, { ...d, ...draw() }, cat);
    const t = Builder.timing.dayTime(day.blocks, rec.rests) / 60;
    return t >= lo - SLACK && t <= hi + SLACK;
  }));
}
// a slot with nothing usable for the gear is the builder's own error: that gear cannot build this day type
function possible(type, equipment, catalogue) {
  try { builds(type, 30, equipment, catalogue, []); return true; } catch (e) {
    if (/ is empty$/.test(e.message)) return false;
    throw e;
  }
}

const near = ([lo, hi], m) => Math.abs(m - (lo + hi) / 2) <= STRETCH * ((lo + hi) / 2);
const intern = (list, keyOf, value) => {
  const k = keyOf(value);
  let i = list.findIndex((x) => keyOf(x) === k);
  if (i < 0) i = list.push(value) - 1;
  return i;
};
const json = JSON.stringify;

function generate({ configs = require('./programs.config.js'), families = FAMILIES, catalogue = Math.max(0, ...Object.values(cat.EX).map((e) => e.added || 0)) } = {}) {
  const familyOf = new Map(families.flatMap(([f, list]) => list.map((s) => [s, f])));
  // the levers a subject's programs use at Level II and III: what a choice for that subject may pick
  const levers = {};
  configs.filter((c) => !c.frozen).forEach((c) => Object.values(Builder.recipesOf(c)).forEach((r) => r.levers.slice(1).forEach((l) => { (levers[c.subject] = levers[c.subject] || new Set()).add(l); })));
  const subjects = [], restTables = [], specs = [], types = [], skipped = [], seen = new Set(), trial = new Map();
  configs.forEach((cfg) => {
    if (cfg.frozen) { skipped.push(cfg.id); return; }
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
        const gear = EQUIPS.find((eq) => possible(hydrated, eq, catalogue));
        EQUIPS.slice(EQUIPS.indexOf(gear)).forEach((eq) => {
          fit.push(Recipes.GRID.reduce((bits, m, i) => bits | (near(r.minutes, m) && builds(hydrated, m, eq, catalogue, subjects[subject][2]) ? 1 << i : 0), 0));
        });
        trial.set(trialKey, { equip: gear, fit });
      }
      types.push({ ...type, ...trial.get(trialKey) });
    });
  });
  return { v: 1, catalogue, skipped, subjects, rests: restTables, specs, types };
}

// what the book comes from: the configs, the builder and what it reads, the families, and this file
const INPUTS = () => [
  ...fs.readdirSync(path.join(__dirname, 'configs')).filter((f) => f.endsWith('.js')).sort().map((f) => `configs/${f}`),
  'programs.config.js', 'exercises.js', 'formats.js', 'program-builder.js', 'app/library.js', 'recipes.js', 'recipe-book.js',
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
module.exports = { generate, book, hash, refresh, stored, FILE, INPUTS };
