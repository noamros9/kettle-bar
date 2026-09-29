/* Your programs (Phase 6): what "build your own" makes, keeps and shows. Pure: runs in Node and in the page (KBOwn).
   A program you build is stored as its choices, its seed and the config those made (never its days): the days are
   built from the stored config alone, with the catalogue version it was made with, so they come out the same every
   time, even when the recipe book grows or changes. The choices stay for showing and for editing (edit = make again).

     choices = { subjects: [1 to 3, in the order picked], split: 1-5, minutes: 20..40, equipment: 'all'|'kb'|'bw', formats: [...],
                 levers: [Level II, Level III] of each subject in turn (flat, as Firestore keeps no arrays in arrays) }
     defaults(recipes, subject) -> the choices a subject starts with (its formats ticked, two of its levers)
     fit(recipes, choices) -> the choices with what the subjects cannot do moved to what they can (minutes, equipment, formats, levers)
     toggle(recipes, choices, subject) -> the choices after tapping a subject: a new one joins at the end (up to three), a
                                          picked one leaves (never the last); one that cannot be mixed (a Mixed subject,
                                          Plyometrics), or any while one of those is picked, starts over alone
     problem(recipes, choices) -> null, or the message for people why nothing can be built from them
     states(recipes, choices) -> { equipment: { all|kb|bw: { ok, reason } }, minutes: { 20..40: { ok, reason } } }
     subjectStates(recipes, choices) -> [{ name, family, order: 1-3 or 0, ok, reason }]: which subjects a tap can add
     subjects(recipes) -> [{ name, family }]

     toConfig(recipes, { id, name, choices, seed, catalogue? }) -> a config for KBBuilder.build, id `own-<id>` (the preview)
     configOf(recipes, { choices, seed, catalogue? }) -> the compact config to store: what make() produced, without
                                                  id, name and the 60 day names (those are worked out again)
     toRecord({ name, choices, seed, catalogue, config, frozenDays?, createdAt? }, now) -> the doc users/{uid}/programs/{id}:
                                                  { name, choices, seed, catalogue, config, frozenDays?, createdAt, updatedAt }
     fromRecord(id, record) -> { id, pid, name, choices, seed, catalogue, config?, frozenDays?, createdAt, updatedAt } (throws when damaged)
     programOf({ build, ex }, entry) -> the 60-day program of an entry, from its config only (throws without one);
                                                  frozen days are taken as they are stored
     checkName(text) -> null, or the message for people    renamed(record, text, now) -> the record with a new name
     edit({ recipes, build, ex }, id, record, { name?, choices, seed?, doneDays }, now) -> the record after an edit: the new
                                                  choices' config, and every day in doneDays (of any round) frozen as it was built
                                                  from the OLD record: `frozenDays: { n: day }`, without the day number
     summaryLine(program) -> "Push / Legs / Pull · 60 days · ~28–32 min · kettlebell only"
                             (a mix: "Strength + Yoga, 3 days a cycle · 60 days · ~28–32 min · all equipment")

     source(docs, { recipes, build, ex }) -> a Program Catalogue source named 'own', `first`, from the store's programs docs
       (newest first; a doc that is damaged or that the recipes can no longer build is left out and listed in `skipped`)
     link({ store, programs, load, build, ex }) -> { refresh() }
       keeps the catalogue's own source in step with the store's programs docs, and the Progress Store's ids in step with
       the catalogue (a saved program's progress is kept and synced like any program's; a deleted one is dropped).
       refresh() builds from what is stored now, with no recipe book. A doc without a config (none should exist) is made
       once through load() -> recipes and saved back with its config; until then it is left out. */
(function (root, Programs) {
  const GEAR = { all: 'all equipment', kb: 'a kettlebell only', bw: 'no equipment' };
  const SUMMARY_GEAR = { all: 'all equipment', kb: 'kettlebell only', bw: 'no equipment' };
  const EQUIPMENT = ['all', 'kb', 'bw'], MINUTES = [20, 25, 30, 35, 40];
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const isObject = (x) => x && typeof x === 'object' && !Array.isArray(x);

  const pidOf = (id) => 'own-' + id;
  const nameOf = (subjects) => (Array.isArray(subjects) ? subjects.join(' + ') : subjects);
  const defaultName = (subjects) => `My ${nameOf(subjects)} 60`;
  const newId = (now = Date.now(), rnd = Math.random) => now.toString(36) + Math.floor(rnd() * 1296).toString(36).padStart(2, '0');
  const newSeed = (rnd = Math.random) => Math.floor(rnd() * 2 ** 32).toString(36);
  const subjects = (recipes) => recipes.book().subjects.map(([name, family]) => ({ name, family }));

  const pairOf = (ls) => [ls[0], ls[1] === undefined ? ls[0] : ls[1]];
  const leverLists = (o) => (o.subjects ? o.levers : [o.levers]); // the levers each subject offers, in order
  function defaults(recipes, subject) {
    const o = recipes.options(subject);
    return fit(recipes, { subjects: [subject], split: 3, minutes: 30, equipment: 'all', formats: o.formats, levers: pairOf(o.levers) });
  }

  // what the subjects cannot do moves to what they can: gear first, then the nearest minutes
  function fit(recipes, c) {
    const o = recipes.options(c.subjects);
    const equipment = o.equipment[c.equipment].length ? c.equipment : EQUIPMENT.find((eq) => o.equipment[eq].length) || c.equipment;
    const options = o.equipment[equipment];
    const minutes = !options.length || options.includes(c.minutes) ? c.minutes : options.reduce((best, m) => (Math.abs(m - c.minutes) < Math.abs(best - c.minutes) ? m : best));
    const lists = leverLists(o);
    return {
      ...clone(c), split: Math.min(5, Math.max(1, c.split)), minutes, equipment,
      formats: c.formats.filter((f) => o.formats.includes(f)),
      levers: c.levers.map((l, i) => { const own = lists[Math.floor(i / 2)]; return own.includes(l) ? l : pairOf(own)[i % 2]; }),
    };
  }

  // the same choices for other subjects: each keeps its levers, a new one brings two of its own and its formats ticked
  function withSubjects(recipes, c, list) {
    const before = recipes.options(c.subjects), after = recipes.options(list);
    const levers = list.flatMap((s, j) => {
      const i = c.subjects.indexOf(s);
      return i >= 0 ? c.levers.slice(2 * i, 2 * i + 2) : pairOf(leverLists(after)[j]);
    });
    const formats = after.formats.filter((f) => c.formats.includes(f) || !before.formats.includes(f));
    return fit(recipes, { ...clone(c), subjects: list.slice(), levers, formats });
  }
  function toggle(recipes, c, subject) {
    const picked = c.subjects, max = recipes.MAX_SUBJECTS;
    if (picked.includes(subject)) return picked.length === 1 ? clone(c) : withSubjects(recipes, c, picked.filter((s) => s !== subject));
    if (recipes.mixReason([subject]) || recipes.mixReason(picked)) return withSubjects(recipes, c, [subject]);
    return picked.length < max ? withSubjects(recipes, c, picked.concat([subject])) : clone(c);
  }
  function subjectStates(recipes, c) {
    const picked = c.subjects, alone = !!recipes.mixReason(picked);
    return subjects(recipes).map(({ name, family }) => {
      const order = picked.indexOf(name) + 1;
      let reason = '';
      if (!order && !alone && !recipes.mixReason([name])) {
        if (picked.length >= recipes.MAX_SUBJECTS) reason = `Up to ${recipes.MAX_SUBJECTS} subjects: tap one to take it out first.`;
        else reason = recipes.options(picked.concat([name])).reason || '';
      }
      return { name, family, order, ok: !reason, reason };
    });
  }

  function problem(recipes, c) {
    if (Array.isArray(c.formats) && !c.formats.length) return 'Tick at least one format.';
    try { recipes.make(c, 'check'); return null; } catch (e) { return e.message; }
  }

  function states(recipes, c) {
    const text = nameOf(c.subjects), o = recipes.options(c.subjects);
    const equipment = {}, minutes = {};
    EQUIPMENT.forEach((eq) => { const ok = o.equipment[eq].length > 0; equipment[eq] = { ok, reason: ok ? '' : `No ${text} days with ${GEAR[eq]}.` }; });
    MINUTES.forEach((m) => { const ok = o.equipment[c.equipment].includes(m); minutes[m] = { ok, reason: ok ? '' : `No ${m}-minute ${text} days with ${GEAR[c.equipment]}.` }; });
    return { equipment, minutes };
  }

  function toConfig(recipes, { id, name, choices, seed, catalogue }) {
    return { ...recipes.make({ ...clone(choices), catalogue }, seed), id: pidOf(id), name };
  }

  // what build needs and nothing else: the 60 day names are worked out from the cycle again (namesOf)
  function configOf(recipes, { choices, seed, catalogue }) {
    const { id, name, names, ...config } = recipes.make({ ...clone(choices), catalogue }, seed);
    return config;
  }
  function namesOf(config) {
    const count = {};
    return Array.from({ length: 60 }, (_, d) => {
      const label = config.dayTypes[config.cycle[d % config.cycle.length]].label;
      count[label] = (count[label] || 0) + 1;
      return `${label} ${count[label]}`;
    });
  }

  function toRecord({ name, choices, seed, catalogue, config, frozenDays, createdAt }, now) {
    const record = { name, choices: clone(choices), seed, catalogue, config: clone(config), createdAt: createdAt || now, updatedAt: now };
    if (frozenDays && Object.keys(frozenDays).length) record.frozenDays = clone(frozenDays);
    return record;
  }

  const NAME_MAX = 60; // as the name field's maxlength
  const checkName = (text) => {
    const t = String(text).trim();
    return !t ? 'Give it a name.' : t.length > NAME_MAX ? `Keep the name to ${NAME_MAX} characters.` : null;
  };
  function renamed(record, text, now) {
    const problem = checkName(text);
    if (problem) throw new Error(problem);
    return { ...clone(record), name: String(text).trim(), updatedAt: now };
  }

  // a day you did is kept as it was made: the record holds it without its number (the key is the number)
  const frozenOk = (n, d) => Number.isInteger(+n) && +n >= 1 && +n <= 60 && isObject(d) && Array.isArray(d.blocks);
  function edit({ recipes, build, ex }, id, record, { name, choices, seed, doneDays }, now) {
    const old = fromRecord(id, record), oldProgram = programOf({ build, ex }, old);
    const frozenDays = { ...(old.frozenDays || {}) };
    doneDays.filter((n) => Number.isInteger(n) && n >= 1 && n <= 60).forEach((n) => { const { day, ...rest } = oldProgram.days[n - 1]; frozenDays[n] = clone(rest); });
    const made = { choices, seed: seed === undefined ? old.seed : seed, catalogue: recipes.book().catalogue };
    return toRecord({ name: name === undefined ? old.name : name, ...made, config: configOf(recipes, made), frozenDays, createdAt: old.createdAt }, now);
  }

  function fromRecord(id, r) {
    if (!isObject(r)) throw new Error('This program is damaged.');
    if (typeof r.name !== 'string' || !r.name.trim()) throw new Error('This program has no name.');
    if (!isObject(r.choices)) throw new Error('This program has no choices.');
    if (typeof r.seed !== 'string') throw new Error('This program has no seed.');
    if (!Number.isInteger(r.catalogue)) throw new Error('This program has no catalogue version.');
    if (r.config !== undefined && !isObject(r.config)) throw new Error('This program has a damaged config.');
    if (r.frozenDays !== undefined && !(isObject(r.frozenDays) && Object.entries(r.frozenDays).every(([n, d]) => frozenOk(n, d)))) throw new Error('This program has damaged frozen days.');
    const entry = { id, pid: pidOf(id), name: r.name, choices: clone(r.choices), seed: r.seed, catalogue: r.catalogue, config: r.config, createdAt: r.createdAt, updatedAt: r.updatedAt };
    if (r.frozenDays) entry.frozenDays = clone(r.frozenDays);
    return entry;
  }

  function programOf({ build, ex }, entry) {
    if (!entry.config) throw new Error('This program has no config yet.');
    const program = build({ ...clone(entry.config), id: entry.pid, name: entry.name, names: namesOf(entry.config) }, ex);
    Object.entries(entry.frozenDays || {}).forEach(([n, d]) => {
      const t = program.dayTypes[d.type];
      // the day keeps its look only while the rebuilt cycle still calls that day type the same; else it shows by its own title
      const { type, ...rest } = d;
      program.days[n - 1] = { day: +n, ...(t && t.label === d.title ? { type } : {}), ...clone(rest) };
    });
    return program;
  }

  function summaryLine(p) {
    const mins = `~${Math.round(p.minutes[0])}–${Math.round(p.minutes[1])} min`;
    const n = Object.keys(p.dayTypes).length, split = p.mix ? `${p.mix.join(' + ')}, ${n} ${n === 1 ? 'day' : 'days'} a cycle` : p.split;
    return [split, `${p.days.length} days`, mins, SUMMARY_GEAR[p.equip]].join(' · ');
  }

  // cache (optional): Map of the programs already built, by what their days come from (config, seed, frozen days), so a
  // rename or a change to another program doesn't rebuild 60 days of every program
  function cachedProgramOf(deps, e) {
    if (!deps.cache) return programOf(deps, e);
    const key = JSON.stringify([e.pid, e.config, e.frozenDays || null]);
    const hit = deps.cache.get(key);
    if (hit) return { ...hit, name: e.name };
    const p = programOf(deps, e);
    deps.cache.set(key, p);
    return p;
  }

  function source(docs, deps) {
    const built = [], skipped = [];
    Object.keys(docs).forEach((id) => {
      try { const e = fromRecord(id, docs[id]); built.push({ e, p: cachedProgramOf(deps, e) }); } catch (error) { skipped.push({ id, error: error.message }); }
    });
    if (deps.cache && deps.cache.size > 2 * (built.length + 1)) deps.cache.clear(); // edited and deleted programs don't pile up
    const made = (x) => x.e.createdAt || ''; // newest first; the same time (or none): by id, so the order never flickers
    built.sort((a, b) => made(b).localeCompare(made(a)) || a.e.id.localeCompare(b.e.id));
    const programs = built.map((x) => x.p);
    return { ...Programs.inlined(programs, 'own'), first: true, skipped, load: (pid) => Promise.resolve(programs.find((p) => p.id === pid)) };
  }

  function link({ store, programs, load, build, ex }) {
    let pending = null;
    const cache = new Map(); // built programs, reused while their config and frozen days stay the same
    const mine = new Set(); // the own ids the store has been told about
    programs.onChange(() => {
      const now = new Set(programs.list().filter((s) => s.source === 'own').map((s) => s.id));
      now.forEach((pid) => { if (!mine.has(pid)) { store.addProgram(pid); mine.add(pid); } });
      [...mine].filter((pid) => !now.has(pid)).forEach((pid) => { store.dropProgram(pid); mine.delete(pid); });
    });
    function refresh() {
      const docs = store.docs('programs');
      programs.setSource('own', source(docs, { build, ex, cache }));
      const legacy = Object.keys(docs).filter((id) => isObject(docs[id]) && !docs[id].config);
      if (!legacy.length) return Promise.resolve();
      if (pending) return pending; // the book is on its way
      // (defensive: none exist) a doc from before configs were kept: made once now and saved back with its config
      pending = load().then((recipes) => {
        legacy.forEach((id) => {
          try { store.setDoc('programs', id, { ...docs[id], config: configOf(recipes, fromRecord(id, docs[id])) }); } catch (e) { /* damaged or unbuildable: stays out */ }
        });
      }, () => { /* no book (offline, never fetched): they come when it loads */ });
      pending.then(() => { pending = null; });
      return pending;
    }
    store.on('docs', (c) => { if (c === 'programs') refresh(); });
    return { refresh };
  }

  const api = { checkName, renamed, edit, defaults, fit, toggle, subjectStates, problem, states, subjects, toConfig, configOf, toRecord, fromRecord, programOf, summaryLine, source, link, pidOf, defaultName, newId, newSeed, MINUTES, EQUIPMENT };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBOwn = api;
})(typeof window !== 'undefined' ? window : globalThis, typeof module !== 'undefined' && module.exports ? require('./programs.js') : window.KBPrograms);
