/* Recipes by subject (Phase 6): "a day of subject X" without a hand-made config. The library is the recipe book: every
   day type of every library program, tagged with its subject, family, formats and equipment, and with the times it
   really builds to. The book is made from the configs (recipe-book.js, Node), kept in recipes/book.json and written to
   data/recipes.json at build time; the page fetches it when build your own first needs it. This file only reads a
   book it is given, so it is pure and runs in Node and in the page (KBRecipes).

     pick({ subjects, families, equipment, formats, minutes }) -> the day types that fit (all keys optional)
     make(choice, seed) -> a config KBBuilder.build turns into 60 days (throws a message for people when nothing fits)
       choice = { subjects: [one], split: 1-5 days per cycle, minutes: 20|25|30|35|40, equipment: 'all'|'kb'|'bw',
                  formats?: [...], levers: [Level II, Level III], catalogue?: N (default: the newest) }
     options(subject) -> { subject, equipment: { all: [minutes], kb: [minutes], bw: [minutes] }, formats, levers }:
       what make() accepts for the subject (an equipment with no minutes is greyed out), and what the pickers offer
     recipeFor(dayType, { minutes, equipment, levers, catalogue? }) -> a recipe for KBBuilder.buildDay
     of(book) -> { pick, make, options, recipeFor, book(), skipped } over a book (in the page: KBRecipes.of(await load()))
     recipesLoader({ fetchJson, cache }) -> { load() }: Promise of the book from data/recipes.json, fetched once, kept in
       the offline cache and read from it when the network isn't there (a message for people when neither has it)
     In Node the same functions (pick, make, ...) work over the book of the library, read from recipes/book.json.

   Rules
   - Equipment: a day type's `equip` is the least gear it builds with. A `bw` day type fits every choice, `kb` fits `kb`
     and `all`, `all` fits only `all`. Every day of a made program follows the choice's equipment.
   - Minutes: the book was made by really building each day type, at each target of GRID (15 to 40, in fives), with each
     equipment it fits, over three levels: it fits a target when every day landed in [target - 2, target + 2]. pick's
     `minutes` fits a day type when a target it fits lies within 2.5 min of it (22 fits 20, 23 fits 20 or 25). make() takes
     the five targets 20 to 40 and gives every day type the window [minutes - 2, minutes + 2]. A day type that cannot
     shrink (a bout is 3 min plus rest) simply has no target below its own length, so it is never picked for a shorter one.
   - Formats: a day type fits when all of its formats are ticked (a mixed day needs both its strength and its flow).
   - Subjects and families are "any of"; family is the shelf a program sits on (a mixed day is `Mixed`, its blocks'
     families are in `families`).
   - Levers: the choice's levers rule the day, except a block's own lever (mixed days keep their flow's `holds`).
   Day types are read-only data: do not change what pick returns. */
(function (root, Formats) {
  const GRID = [15, 20, 25, 30, 35, 40], MINUTES = [20, 25, 30, 35, 40];
  const WINDOW = 2, SLACK = 2.5;
  const RANK = { bw: 0, kb: 1, all: 2 };
  const GEAR = { all: 'all equipment', kb: 'a kettlebell only', bw: 'no equipment' };
  const LEVERS = ['reps', 'holds', 'weight', 'variation', 'tempo'];
  const LEVER_NAMES = { reps: 'more reps', holds: 'longer holds', weight: 'heavier weights', variation: 'harder variations', tempo: 'slow tempo' };

  const fitsExactly = (t, eq, m) => GRID.some((g, i) => g === m && ((t.fit[eq] || 0) >> i) & 1);
  const fitsNear = (t, eq, m) => GRID.some((g, i) => ((t.fit[eq] || 0) >> i) & 1 && Math.abs(g - m) <= SLACK);
  const fitsGear = (t, eq) => RANK[t.equip] <= RANK[eq];

  // a well-mixed seeded stream (mulberry32): unlike a plain LCG, seeds like '1' and '2' give unrelated draws
  function rngOf(seed) {
    let a = [...String(seed)].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261);
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const shuffled = (list, rnd) => {
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
    return out;
  };

  // a day type as buildDay wants it: its blocks, the choice's window, gear and levers
  function recipeFor(t, { minutes, equipment, levers, catalogue }, newest = 0) {
    return {
      program: t.program, key: t.key, label: t.label, blocks: t.blocks, minutes: [minutes - WINDOW, minutes + WINDOW],
      equip: equipment, rests: t.rests, catalogue: catalogue === undefined ? newest : catalogue, levers: [null, ...levers], absSlots: t.absSlots,
    };
  }

  function of(book) {
    // read the compact book: a day type with its subject, family, gear, fit, blocks, abs slots and rests spelled out
    const slots = (text) => (text ? text.split(' ') : []);
    const types = book.types.map((t) => {
      const { b, a, r } = book.specs[t.spec], [subject, family] = book.subjects[t.subject], [program, key] = t.id.split(':');
      const [lo, hi] = t.minutes, fit = {};
      Object.keys(RANK).slice(RANK[t.equip]).forEach((eq, i) => { fit[eq] = t.fit[i]; });
      return {
        id: t.id, program, key, label: t.label, short: t.short || t.label, subject, family, families: t.mixed || [family],
        formats: [...new Set(b.map((x) => x[0]))], equip: t.equip, fit, minutes: [lo, hi], levers: t.levers,
        blocks: b.map(([f, title, sl, more]) => ({ f, title, slots: slots(sl), ...more })), absSlots: slots(a), rests: book.rests[r],
      };
    });
    const subjects = book.subjects.map(([name]) => name);

    function check(equipment, minutes) {
      if (equipment !== undefined && !(equipment in RANK)) throw new Error(`Unknown equipment: ${equipment}`);
      if (minutes !== undefined && typeof minutes !== 'number') throw new Error(`Minutes must be a number, not ${minutes}`);
    }
    function pick({ subjects: sub, families, equipment, formats, minutes } = {}) {
      check(equipment, minutes);
      return types.filter((t) => (!sub || sub.includes(t.subject)) && (!families || families.includes(t.family))
        && (!formats || t.formats.every((f) => formats.includes(f)))
        && (equipment === undefined || fitsGear(t, equipment))
        && (minutes === undefined || fitsNear(t, equipment || t.equip, minutes)));
    }

    function options(subject) {
      const own = types.filter((t) => t.subject === subject);
      if (!own.length) throw new Error(`Unknown subject: ${subject}`);
      const equipment = {};
      Object.keys(RANK).reverse().forEach((eq) => { equipment[eq] = MINUTES.filter((m) => own.some((t) => fitsGear(t, eq) && fitsExactly(t, eq, m))); });
      return { subject, equipment, formats: [...new Set(own.flatMap((t) => t.formats))], levers: book.subjects.find(([name]) => name === subject)[2] };
    }

    function valid(c) {
      if (!c || typeof c !== 'object') throw new Error('Make needs a choice: subject, days per cycle, minutes, equipment and levers.');
      if (!Array.isArray(c.subjects) || !c.subjects.length) throw new Error('Pick a subject.');
      if (c.subjects.length > 1) throw new Error('Pick one subject for now.');
      if (!subjects.includes(c.subjects[0])) throw new Error(`Unknown subject: ${c.subjects[0]}`);
      if (!Number.isInteger(c.split) || c.split < 1 || c.split > 5) throw new Error('Days per cycle: pick 1 to 5.');
      if (!MINUTES.includes(c.minutes)) throw new Error(`Minutes: pick ${MINUTES.join(', ')}.`);
      if (!(c.equipment in RANK)) throw new Error(`Unknown equipment: ${c.equipment}`);
      if (c.formats !== undefined) {
        if (!Array.isArray(c.formats)) throw new Error('Formats: pick from the list.');
        c.formats.forEach((f) => { if (!(f in Formats.NAMES)) throw new Error(`Unknown format: ${f}`); });
      }
      if (c.levers !== undefined) {
        const own = options(c.subjects[0]).levers;
        if (!(Array.isArray(c.levers) && c.levers.length === 2)) throw new Error('Pick a lever for Level II and one for Level III.');
        c.levers.forEach((l) => { if (!own.includes(l)) throw new Error(`${c.subjects[0]} does not get harder by ${LEVER_NAMES[l] || l}: pick ${own.map((x) => LEVER_NAMES[x]).join(', ')}.`); });
      }
    }

    // choice + seed -> a config for KBBuilder.build
    function make(c, seed = '') {
      valid(c);
      const [subject] = c.subjects, { split, minutes, equipment, formats } = c;
      const fit = pick({ subjects: c.subjects, equipment, formats }).filter((t) => fitsExactly(t, equipment, minutes));
      if (!fit.length) {
        const using = formats ? ` using only ${formats.map((f) => Formats.NAMES[f]).join(', ')}` : '';
        throw new Error(`No ${subject} day types fit ${minutes} min with ${GEAR[equipment]}${using}.`);
      }
      const rnd = rngOf(seed);
      const order = shuffled(fit, rnd);
      // one program has one rests table (the timer reads it): keep to the first pick's
      const restsOf = (t) => JSON.stringify(t.rests);
      const same = order.filter((t) => restsOf(t) === restsOf(order[0]));
      const seen = new Set(), fresh = [], again = [];
      same.forEach((t) => { (seen.has(t.label) ? again : fresh).push(t); seen.add(t.label); });
      const pool = fresh.concat(again);
      const chosen = Array.from({ length: split }, (_, i) => pool[i % pool.length]);

      const dayTypes = {}, cycle = [], count = {}, names = [];
      chosen.forEach((t, i) => {
        dayTypes[`d${i + 1}`] = { label: t.label, short: t.short, blocks: t.blocks, absSlots: t.absSlots, minutes: [minutes - WINDOW, minutes + WINDOW] };
        cycle.push(`d${i + 1}`);
      });
      for (let d = 0; d < 60; d++) {
        const label = chosen[d % split].label;
        count[label] = (count[label] || 0) + 1;
        names.push(`${label} ${count[label]}`);
      }
      const levers = c.levers || order[0].levers;
      return {
        id: 'own-preview', name: `My ${subject} 60`, subject, blurb: `${split} days a cycle, about ${minutes} minutes each.`,
        about: `A ${subject.toLowerCase()} program built from your choices: ${split} ${split === 1 ? 'day' : 'days'} in a cycle, about ${minutes} minutes a day.`,
        split: chosen.map((t) => t.label).join(' / '), minutes: [minutes - WINDOW, minutes + WINDOW], equip: equipment, levers: [null, ...levers],
        catalogue: c.catalogue === undefined ? book.catalogue : c.catalogue, rests: chosen[0].rests, cycle, names, dayTypes,
      };
    }

    return { pick, make, options, recipeFor: (t, o) => recipeFor(t, o, book.catalogue), book: () => book, get skipped() { return book.skipped; }, fitsExactly };
  }

  // the book is one file, fetched when first needed: kept in the offline cache, which is read when the network isn't there
  function recipesLoader({ fetchJson, cache, url = 'data/recipes.json' }) {
    let loaded;
    return {
      load() {
        if (!loaded) {
          loaded = fetchJson(url)
            .then((b) => cache.put(url, b).then(() => b, () => b))
            .catch(() => cache.get(url).then((b) => { if (!b) throw new Error("Build your own isn't available offline yet. Open it once while online."); return b; }))
            .catch((e) => { loaded = undefined; throw e; });
        }
        return loaded;
      },
    };
  }

  const api = { of, GRID, MINUTES, LEVERS, fitsExactly, recipeOf: recipeFor, recipesLoader };
  /* node:coverage ignore next 4 */ // the page: no book yet, the loader brings it
  if (typeof module === 'undefined' || !module.exports) {
    root.KBRecipes = api;
    return;
  }
  // Node: the book is made from the configs the first time it is asked for
  let cached;
  const lazy = () => (cached = cached || of(require('./recipe-book.js').book()));
  module.exports = {
    ...api,
    pick: (o) => lazy().pick(o), make: (c, s) => lazy().make(c, s), options: (s) => lazy().options(s),
    recipeFor: (t, o) => lazy().recipeFor(t, o), book: () => lazy().book(), get skipped() { return lazy().skipped; },
  };
  /* node:coverage ignore next */
})(typeof window !== 'undefined' ? window : globalThis, typeof module !== 'undefined' && module.exports ? require('./formats.js') : window.KBFormats);
