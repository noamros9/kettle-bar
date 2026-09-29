/* Recipes by subject (Phase 6): "a day of subject X" without a hand-made config. The library is the recipe book: every
   day type of every library program, tagged with its subject, family, formats and equipment, and with the times it
   really builds to. The book is made from the configs (recipe-book.js, Node), kept in recipes/book.json and written to
   data/recipes.json at build time; this file itself is written to data/recipes.js. The page fetches both when build
   your own first needs them (app/lazy.js) and keeps them for offline: neither is in index.html. It only reads a book it
   is given, so it is pure and runs in Node and in the page (KBRecipes).

     pick({ subjects, families, equipment, formats, minutes }) -> the day types that fit (all keys optional)
     make(choice, seed) -> a config KBBuilder.build turns into 60 days (throws a message for people when nothing fits)
       choice = { subjects: [1 to 3, in the order picked], split: 1-5 days per cycle, minutes: 20|25|30|35|40,
                  equipment: 'all'|'kb'|'bw', formats?: [...], catalogue?: N (default: the newest),
                  levers: [Level II, Level III] for each subject in turn (flat: [a II, a III, b II, b III, ...]) }
     options(subject) -> { subject, equipment: { all: [minutes], kb: [minutes], bw: [minutes] }, formats, levers }:
       what make() accepts for the subject (an equipment with no minutes is greyed out), and what the pickers offer
     options([a, b, c?]) -> { subjects, equipment, formats, levers: [a's, b's, ...], reason }: the same for a mix; reason is
       null, or why the mix cannot be made at all (then every equipment has no minutes)
     mixReason([subjects]) -> null, or why these subjects cannot be in a mix at all (a Mixed subject, Plyometrics)
     recipeFor(dayType, { minutes, equipment, levers, catalogue? }) -> a recipe for KBBuilder.buildDay
     of(book) -> { pick, make, options, recipeFor, book(), skipped } over a book (in the page: KBRecipes.of(await load()))
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
   Mixes (2-3 subjects): every day is a mixed day, joined from one part (a main block of a library day type, see
   recipe-book.js) of each subject, in the order picked; each block is tagged with its subject's family and gets harder
   by its own subject's levers. A mix is made only of subjects that are one family and rest like the rest (not a Mixed
   subject, not Plyometrics). The abs finisher comes last when the last subject is a Strength one (as in configs/mixed.js);
   it levels by that subject's levers, which are the program's own. Equipment and formats apply to every part.
   - Minutes (the split): after the rests between blocks (a minute each) and the abs (two minutes' rest and its usual
     length), the day's minutes are shared evenly between the blocks; a block that cannot be that short or that long
     (a flow comes in whole rounds) is held at what it can do and the others share the rest. Each block's share is its
     `target` (give or take 2 minutes): the builder keeps it there when it can, after the day's window.
   - What is refused: a mix reaches a time when some parts, one per subject, have ranges (per level, what every trial
     of the part could be built to) that add up, with the rests and the abs, to a total that can land in the window at
     every level. options() offers exactly those times. make() then builds the whole program it made and checks every
     day lands in the window (its minutes rounded as the app shows them, as the book's trials); a day type whose days do not is swapped
     for the next parts that reach, a few times, and if that never works the mix is refused with a message.
   Day types are read-only data: do not change what pick returns. */
(function (root, Formats, deps) {
  const GRID = [15, 20, 25, 30, 35, 40], MINUTES = [20, 25, 30, 35, 40];
  const WINDOW = 2, SLACK = 2.5;
  const ROUNDS = 6; // builds of a mix tried before it is refused
  const MAX_SUBJECTS = 3;
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
    const familyOf = Object.fromEntries(book.subjects.map(([name, family]) => [name, family]));
    // mixes: the parts, the abs finisher's range and the one rests table a mix has (recipe-book.js)
    const ranges = (equip, fit) => Object.fromEntries(Object.keys(RANK).slice(RANK[equip]).map((eq, i) => [eq, fit[i]]));
    const parts = book.mix.parts.map(([si, spec, bi, equip, fit]) => {
      const [f, title, sl, more] = book.specs[spec].b[bi], [subject, family] = book.subjects[si];
      return { subject, family, block: { f, title, slots: slots(sl), ...more }, f, equip, range: ranges(equip, fit) };
    });
    const absRange = ranges('bw', book.mix.absFit), mixRests = book.rests[book.mix.rests];

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

    function single(subject) {
      const own = types.filter((t) => t.subject === subject);
      if (!own.length) throw new Error(`Unknown subject: ${subject}`);
      const equipment = {};
      Object.keys(RANK).reverse().forEach((eq) => { equipment[eq] = MINUTES.filter((m) => own.some((t) => fitsGear(t, eq) && fitsExactly(t, eq, m))); });
      return { subject, equipment, formats: [...new Set(own.flatMap((t) => t.formats))], levers: leversOf(subject) };
    }
    const leversOf = (subject) => book.subjects.find(([name]) => name === subject)[2];
    function options(which) {
      const list = Array.isArray(which) ? which : [which];
      if (list.length === 1) return single(list[0]);
      list.forEach((s) => { if (!subjects.includes(s)) throw new Error(`Unknown subject: ${s}`); });
      const key = JSON.stringify(list);
      if (!mixOptions.has(key)) {
        let reason = mixReason(list);
        const equipment = {};
        Object.keys(RANK).reverse().forEach((eq) => { equipment[eq] = reason ? [] : MINUTES.filter((m) => someMix(list, eq, m)); });
        if (!reason && !Object.values(equipment).some((ms) => ms.length)) reason = `No mix of ${list.join(' + ')} fits ${MINUTES[0]} to ${MINUTES.at(-1)} minutes.`;
        const formats = [...new Set(list.flatMap((s) => parts.filter((p) => p.subject === s).map((p) => p.f)))];
        mixOptions.set(key, { subjects: list.slice(), equipment, formats, levers: list.map(leversOf), reason });
      }
      return JSON.parse(JSON.stringify(mixOptions.get(key)));
    }

    function valid(c) {
      if (!c || typeof c !== 'object') throw new Error('Make needs a choice: subject, days per cycle, minutes, equipment and levers.');
      if (!Array.isArray(c.subjects) || !c.subjects.length) throw new Error('Pick a subject.');
      if (c.subjects.length > MAX_SUBJECTS) throw new Error(`Pick up to ${MAX_SUBJECTS} subjects.`);
      c.subjects.forEach((s) => { if (!subjects.includes(s)) throw new Error(`Unknown subject: ${s}`); });
      if (new Set(c.subjects).size < c.subjects.length) throw new Error('Pick each subject once.');
      if (!Number.isInteger(c.split) || c.split < 1 || c.split > 5) throw new Error('Days per cycle: pick 1 to 5.');
      if (!MINUTES.includes(c.minutes)) throw new Error(`Minutes: pick ${MINUTES.join(', ')}.`);
      if (!(c.equipment in RANK)) throw new Error(`Unknown equipment: ${c.equipment}`);
      if (c.formats !== undefined) {
        if (!Array.isArray(c.formats)) throw new Error('Formats: pick from the list.');
        c.formats.forEach((f) => { if (!(f in Formats.NAMES)) throw new Error(`Unknown format: ${f}`); });
      }
      if (c.levers !== undefined) {
        const n = c.subjects.length;
        if (!(Array.isArray(c.levers) && c.levers.length === 2 * n)) throw new Error(`Pick a lever for Level II and one for Level III${n > 1 ? ' for each subject' : ''}.`);
        c.levers.forEach((l, i) => {
          const s = c.subjects[Math.floor(i / 2)], own = leversOf(s);
          if (!own.includes(l)) throw new Error(`${s} does not get harder by ${LEVER_NAMES[l] || l}: pick ${own.map((x) => LEVER_NAMES[x]).join(', ')}.`);
        });
      }
    }

    // ---------- mixes ----------
    const mixOptions = new Map(), made = new Map();
    // why these subjects cannot be mixed at all, or null
    function mixReason(list) {
      for (const s of list) {
        if (familyOf[s] === 'Mixed') return `${s} is already a mix: pick it on its own.`;
        if (!parts.some((p) => p.subject === s)) {
          return types.some((t) => t.subject === s && JSON.stringify(t.rests) !== JSON.stringify(mixRests))
            ? `${s} can't be mixed: it rests longer between sets than the others.`
            : `${s} has no blocks to mix: pick it on its own.`;
        }
      }
      return null;
    }
    const absLast = (list) => familyOf[list.at(-1)] === 'Strength';
    // does a mix of these parts (one per subject, in order) reach `minutes` at every level? Quarter minutes throughout
    function reaches(combo, eq, minutes, abs) {
      const rest = ((combo.length - 1) * mixRests.block + (abs ? mixRests.beforeAbs : 0)) / 15;
      return [0, 1, 2].every((L) => {
        let short = rest, long = rest;
        combo.concat(abs ? [{ range: absRange }] : []).forEach((p) => { short += p.range[eq][2 * L]; long += p.range[eq][2 * L + 1]; });
        return short <= 4 * (minutes + WINDOW) && long >= 4 * (minutes - WINDOW);
      });
    }
    // the parts a subject offers with this gear and these formats
    const partsOf = (s, eq, formats) => parts.filter((p) => p.subject === s && fitsGear(p, eq) && (!formats || formats.includes(p.f)));
    // is there a mix of these subjects that reaches the time? (depth first, dropping a start that already cannot)
    function someMix(list, eq, minutes) {
      const abs = absLast(list), lists = list.map((s) => partsOf(s, eq));
      if (lists.some((l) => !l.length)) return false;
      const rest = ((list.length - 1) * mixRests.block + (abs ? mixRests.beforeAbs : 0)) / 15;
      const lo = 4 * (minutes - WINDOW), hi = 4 * (minutes + WINDOW);
      // per level: the most the lists after k can still add to the long end
      const most = lists.map((_, k) => [0, 1, 2].map((L) => lists.slice(k + 1).reduce((a, l) => a + Math.max(...l.map((p) => p.range[eq][2 * L + 1])), 0)));
      const start = [0, 1, 2].map((L) => rest + (abs ? absRange[eq][2 * L] : 0)), end = [0, 1, 2].map((L) => rest + (abs ? absRange[eq][2 * L + 1] : 0));
      const walk = (k, short, long) => lists[k].some((p) => {
        const s = short.map((x, L) => x + p.range[eq][2 * L]), l = long.map((x, L) => x + p.range[eq][2 * L + 1]);
        if (s.some((x) => x > hi) || l.some((x, L) => x + most[k][L] < lo)) return false;
        return k === lists.length - 1 || walk(k + 1, s, l);
      });
      return walk(0, start, end);
    }
    // every mix that reaches the time, from lists of parts (one list per subject), walking them together: first the
    // first of every list, then mixes of the first two of each, and so on (so the days of a cycle differ)
    function mixes(list, eq, minutes, lists) {
      const abs = absLast(list);
      let out = [[]];
      lists.forEach((l) => { out = out.flatMap((cb) => l.map((p, i) => cb.concat([[p, i]]))); });
      const rank = (cb) => [Math.max(...cb.map(([, i]) => i)), cb.reduce((a, [, i]) => a + i, 0)];
      return out.map((cb) => ({ cb, r: rank(cb) }))
        .sort((a, b) => a.r[0] - b.r[0] || a.r[1] - b.r[1])
        .map((x) => x.cb.map(([p]) => p))
        .filter((cb) => reaches(cb, eq, minutes, abs));
    }
    // each block's share of the day, as its target: [minutes - 2, minutes + 2], in half minutes
    function shares(combo, eq, minutes, abs) {
      const absMin = abs ? (absRange[eq][0] + absRange[eq][1]) / 8 + mixRests.beforeAbs / 60 : 0;
      const bounds = combo.map((p) => { const [a, b] = p.range[eq]; return [Math.min(a, b) / 4, Math.max(a, b) / 4]; });
      const out = [], free = new Set(combo.map((_, i) => i));
      let left = minutes - ((combo.length - 1) * mixRests.block) / 60 - absMin;
      for (let moved = true; moved && free.size;) {
        moved = false;
        const share = left / free.size;
        [...free].forEach((i) => {
          const [lo, hi] = bounds[i];
          if (share < lo || share > hi) { out[i] = share < lo ? lo : hi; left -= out[i]; free.delete(i); moved = true; }
        });
      }
      free.forEach((i) => { out[i] = left / free.size; });
      return out.map((m) => { const h = Math.round(m * 2) / 2; return [h - WINDOW, h + WINDOW]; });
    }

    function makeMix(c, seed) {
      const { subjects: list, split, minutes, equipment, formats } = c;
      const reason = mixReason(list);
      if (reason) throw new Error(reason);
      const text = list.join(' + '), abs = absLast(list), rnd = rngOf(seed);
      const using = formats ? ` using only ${formats.map((f) => Formats.NAMES[f]).join(', ')}` : '';
      const refuse = () => new Error(`No mix of ${text} fits ${minutes} min with ${GEAR[equipment]}${using}.`);
      const lists = list.map((s) => shuffled(partsOf(s, equipment, formats), rnd));
      const found = mixes(list, equipment, minutes, lists);
      if (!found.length) throw refuse();
      // the cycle: each day the first mix that reuses the fewest parts already in it
      const used = new Set(), tried = new Set();
      const next = () => {
        const reuse = (cb) => cb.filter((p) => used.has(p)).length;
        const open = found.filter((cb) => !tried.has(cb));
        const cb = open.reduce((best, x) => (reuse(x) < reuse(best) ? x : best), open[0]);
        if (cb) { tried.add(cb); cb.forEach((p) => used.add(p)); }
        return cb;
      };
      let again = 0; // fewer mixes than days: the cycle repeats them
      const chosen = Array.from({ length: split }, () => next() || found[again++ % found.length]);
      const pair = (j) => (c.levers ? c.levers.slice(2 * j, 2 * j + 2) : ((ls) => [ls[0], ls[1] === undefined ? ls[0] : ls[1]])(leversOf(list[j])));
      const configOf = () => {
        const dayTypes = {}, cycle = [], count = {}, names = [];
        chosen.forEach((cb, i) => {
          const target = shares(cb, equipment, minutes, abs);
          dayTypes[`d${i + 1}`] = {
            label: cb.map((p) => p.block.title).join(' + '), short: `Mix ${i + 1}`, // the label: the blocks' own titles, 'Push + Standing flow'
            blocks: cb.map((p, j) => ({ ...JSON.parse(JSON.stringify(p.block)), family: p.family, lever: [null, ...pair(j)], target: target[j] })),
            absSlots: abs ? slots(book.mix.abs) : [], minutes: [minutes - WINDOW, minutes + WINDOW],
          };
          cycle.push(`d${i + 1}`);
        });
        for (let d = 0; d < 60; d++) {
          const label = dayTypes[cycle[d % split]].label;
          count[label] = (count[label] || 0) + 1;
          names.push(`${label} ${count[label]}`);
        }
        const blocks = list.map((s) => s.toLowerCase()).join(' block, then a ');
        return {
          id: 'own-preview', name: `My ${text} 60`, subject: text, mix: list.slice(),
          blurb: `${split} ${split === 1 ? 'day' : 'days'} a cycle, about ${minutes} minutes each: ${list.join(', then ')}${abs ? ', then abs' : ''}.`,
          about: `A mix built from your choices: every day has a ${blocks} block${abs ? ', then abs' : ''}, about ${minutes} minutes in all, ${split} ${split === 1 ? 'day' : 'days'} in a cycle. Each block gets harder in its own way.`,
          split: cycle.map((k) => dayTypes[k].label).join(' / '), minutes: [minutes - WINDOW, minutes + WINDOW], equip: equipment,
          levers: [null, ...pair(abs ? list.length - 1 : 0)], catalogue: c.catalogue === undefined ? book.catalogue : c.catalogue,
          rests: mixRests, cycle, names, dayTypes,
        };
      };
      // build the program and check every day: a day type with a day out of the window is swapped for the next mix
      const { Builder, ex } = deps();
      for (let round = 0; round < ROUNDS; round++) {
        const cfg = configOf(), bad = new Set();
        Builder.build(cfg, ex).days.forEach((d) => { // est: the day's minutes as the app shows them, rounded
          if (d.est < minutes - WINDOW || d.est > minutes + WINDOW) bad.add(cfg.cycle.indexOf(d.type));
        });
        if (!bad.size) return cfg;
        bad.forEach((i) => { chosen[i] = next() || chosen[i]; });
      }
      throw refuse();
    }

    // choice + seed -> a config for KBBuilder.build
    function make(c, seed = '') {
      valid(c);
      if (c.subjects.length > 1) {
        // a mix is built to be checked, so it is made once per choice and seed
        const key = JSON.stringify([c, String(seed)]);
        if (!made.has(key)) {
          try { made.set(key, { cfg: makeMix(c, seed) }); } catch (e) { made.set(key, { error: e.message }); }
        }
        const m = made.get(key);
        if (m.error) throw new Error(m.error);
        return JSON.parse(JSON.stringify(m.cfg));
      }
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

    return { pick, make, options, recipeFor: (t, o) => recipeFor(t, o, book.catalogue), book: () => book, get skipped() { return book.skipped; }, fitsExactly, mixReason, MAX_SUBJECTS };
  }

  const api = { of, GRID, MINUTES, LEVERS, MAX_SUBJECTS, fitsExactly, recipeOf: recipeFor };
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
    recipeFor: (t, o) => lazy().recipeFor(t, o), mixReason: (l) => lazy().mixReason(l), book: () => lazy().book(), get skipped() { return lazy().skipped; },
  };
  /* node:coverage ignore next 3 */
})(typeof window !== 'undefined' ? window : globalThis, ...(typeof module !== 'undefined' && module.exports
  ? [require('./formats.js'), () => ({ Builder: require('./program-builder.js'), ex: require('./exercises.js') })] // a mix is checked by building it
  : [window.KBFormats, () => ({ Builder: window.KBBuilder, ex: window.KBEx })]));
