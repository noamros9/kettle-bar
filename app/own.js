/* Your programs (Phase 6): what "build your own" makes, keeps and shows. Pure: runs in Node and in the page (KBOwn).
   A program you build is stored as its choices, its seed and the config those made (never its days): the days are
   built from the stored config alone, with the catalogue version it was made with, so they come out the same every
   time, even when the recipe book grows or changes. The choices stay for showing and for editing (edit = make again).

     choices = { subjects: [one], split: 1-5, minutes: 20..40, equipment: 'all'|'kb'|'bw', formats: [...], levers: [Level II, Level III] }
     defaults(recipes, subject) -> the choices a subject starts with (its formats ticked, two of its levers)
     fit(recipes, choices) -> the choices with what the subject cannot do moved to what it can (minutes, equipment, formats, levers)
     problem(recipes, choices) -> null, or the message for people why nothing can be built from them
     states(recipes, choices) -> { equipment: { all|kb|bw: { ok, reason } }, minutes: { 20..40: { ok, reason } } }
     subjects(recipes) -> [{ name, family }]

     toConfig(recipes, { id, name, choices, seed, catalogue? }) -> a config for KBBuilder.build, id `own-<id>` (the preview)
     configOf(recipes, { choices, seed, catalogue? }) -> the compact config to store: what make() produced, without
                                                  id, name and the 60 day names (those are worked out again)
     toRecord({ name, choices, seed, catalogue, config, createdAt? }, now) -> the doc users/{uid}/programs/{id}:
                                                  { name, choices, seed, catalogue, config, createdAt, updatedAt }
     fromRecord(id, record) -> { id, pid, name, choices, seed, catalogue, config?, createdAt, updatedAt } (throws when damaged)
     programOf({ build, ex }, entry) -> the 60-day program of an entry, from its config only (throws without one)
     summaryLine(program) -> "Push / Legs / Pull · 60 days · ~28–32 min · kettlebell only"

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
  const defaultName = (subject) => `My ${subject} 60`;
  const newId = (now = Date.now(), rnd = Math.random) => now.toString(36) + Math.floor(rnd() * 1296).toString(36).padStart(2, '0');
  const newSeed = (rnd = Math.random) => Math.floor(rnd() * 2 ** 32).toString(36);
  const subjects = (recipes) => recipes.book().subjects.map(([name, family]) => ({ name, family }));

  const leversOf = (o) => [o.levers[0], o.levers[1] === undefined ? o.levers[0] : o.levers[1]];
  function defaults(recipes, subject) {
    const o = recipes.options(subject);
    return fit(recipes, { subjects: [subject], split: 3, minutes: 30, equipment: 'all', formats: o.formats, levers: leversOf(o) });
  }

  // what the subject cannot do moves to what it can: gear first, then the nearest minutes
  function fit(recipes, c) {
    const o = recipes.options(c.subjects[0]);
    const equipment = o.equipment[c.equipment].length ? c.equipment : EQUIPMENT.find((eq) => o.equipment[eq].length);
    const options = o.equipment[equipment];
    const minutes = options.includes(c.minutes) ? c.minutes : options.reduce((best, m) => (Math.abs(m - c.minutes) < Math.abs(best - c.minutes) ? m : best));
    const own = leversOf(o);
    return {
      ...clone(c), split: Math.min(5, Math.max(1, c.split)), minutes, equipment,
      formats: c.formats.filter((f) => o.formats.includes(f)),
      levers: c.levers.map((l, i) => (o.levers.includes(l) ? l : own[i])),
    };
  }

  function problem(recipes, c) {
    if (Array.isArray(c.formats) && !c.formats.length) return 'Tick at least one format.';
    try { recipes.make(c, 'check'); return null; } catch (e) { return e.message; }
  }

  function states(recipes, c) {
    const [subject] = c.subjects, o = recipes.options(subject);
    const equipment = {}, minutes = {};
    EQUIPMENT.forEach((eq) => { const ok = o.equipment[eq].length > 0; equipment[eq] = { ok, reason: ok ? '' : `No ${subject} days with ${GEAR[eq]}.` }; });
    MINUTES.forEach((m) => { const ok = o.equipment[c.equipment].includes(m); minutes[m] = { ok, reason: ok ? '' : `No ${m}-minute ${subject} days with ${GEAR[c.equipment]}.` }; });
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

  function toRecord({ name, choices, seed, catalogue, config, createdAt }, now) {
    return { name, choices: clone(choices), seed, catalogue, config: clone(config), createdAt: createdAt || now, updatedAt: now };
  }

  function fromRecord(id, r) {
    if (!isObject(r)) throw new Error('This program is damaged.');
    if (typeof r.name !== 'string' || !r.name.trim()) throw new Error('This program has no name.');
    if (!isObject(r.choices)) throw new Error('This program has no choices.');
    if (typeof r.seed !== 'string') throw new Error('This program has no seed.');
    if (!Number.isInteger(r.catalogue)) throw new Error('This program has no catalogue version.');
    if (r.config !== undefined && !isObject(r.config)) throw new Error('This program has a damaged config.');
    return { id, pid: pidOf(id), name: r.name, choices: clone(r.choices), seed: r.seed, catalogue: r.catalogue, config: r.config, createdAt: r.createdAt, updatedAt: r.updatedAt };
  }

  function programOf({ build, ex }, entry) {
    if (!entry.config) throw new Error('This program has no config yet.');
    return build({ ...clone(entry.config), id: entry.pid, name: entry.name, names: namesOf(entry.config) }, ex);
  }

  function summaryLine(p) {
    const mins = `~${Math.round(p.minutes[0])}–${Math.round(p.minutes[1])} min`;
    return [p.split, `${p.days.length} days`, mins, SUMMARY_GEAR[p.equip]].join(' · ');
  }

  function source(docs, deps) {
    const built = [], skipped = [];
    Object.keys(docs).forEach((id) => {
      try { const e = fromRecord(id, docs[id]); built.push({ e, p: programOf(deps, e) }); } catch (error) { skipped.push({ id, error: error.message }); }
    });
    const made = (x) => x.e.createdAt || ''; // newest first; the same time (or none): by id, so the order never flickers
    built.sort((a, b) => made(b).localeCompare(made(a)) || a.e.id.localeCompare(b.e.id));
    const programs = built.map((x) => x.p);
    return { ...Programs.inlined(programs, 'own'), first: true, skipped, load: (pid) => Promise.resolve(programs.find((p) => p.id === pid)) };
  }

  function link({ store, programs, load, build, ex }) {
    let pending = null;
    const mine = new Set(); // the own ids the store has been told about
    programs.onChange(() => {
      const now = new Set(programs.list().filter((s) => s.source === 'own').map((s) => s.id));
      now.forEach((pid) => { if (!mine.has(pid)) { store.addProgram(pid); mine.add(pid); } });
      [...mine].filter((pid) => !now.has(pid)).forEach((pid) => { store.dropProgram(pid); mine.delete(pid); });
    });
    function refresh() {
      const docs = store.docs('programs');
      programs.setSource('own', source(docs, { build, ex }));
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

  const api = { defaults, fit, problem, states, subjects, toConfig, configOf, toRecord, fromRecord, programOf, summaryLine, source, link, pidOf, defaultName, newId, newSeed, MINUTES, EQUIPMENT };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBOwn = api;
})(typeof window !== 'undefined' ? window : globalThis, typeof module !== 'undefined' && module.exports ? require('./programs.js') : window.KBPrograms);
