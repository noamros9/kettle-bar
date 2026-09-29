/* Program Catalogue: which programs exist, a program's days, and which programs use an exercise.
   The page reads programs only through here, so where programs come from can change behind this seam.

     const programs = createProgramCatalogue(librarySource, ...moreSources);
     programs.ids(), programs.list(), programs.summary(pid), programs.has(pid)
       summaries: the program without its days, plus dayCount, the exercises it uses and `source`
       (the name of the source it comes from: 'library', later 'own')
     programs.get(pid), programs.day(pid, n)   synchronous; nothing until the program is loaded
     programs.load(pid) -> Promise<program>    loads it once (later calls share the same load)
     programs.programsUsing(exId) -> [pid]   library programs are found through their source's exercise index (data/index.json,
       loaded on demand: programs.loadUsage() -> Promise, programs.usageReady()); sources whose summaries list `exercises`
       (your own programs) need no index

     programs.loadEverything(first, onLoaded)  background download of every program, for offline

     programs.setSource(name, source)   add or replace a source at runtime; the list, has, summary and get follow
     programs.onChange(fn) -> stop      fn() after every setSource, so the page can re-render

   A source is { name, summaries, load(pid), preloaded?, first? }. Sources are listed in the order given, except
   that ones marked `first` come before the rest (your own programs before the library). Ids never clash: a
   duplicate id across sources throws (own programs are `own-<id>`).
   A source may have `usage`, a lazy file ({ load() }) of { exerciseId: [pid] } for its programs.
   The page's summaries are slim (slim(): what cards and filters need, the first sentence of `about`); the rest of a
   program comes with its data file when it is opened.
   Sources (adapters): fetched(summaries, { fetchJson, cache, usage }) in the page, named 'library'; inlined(programs, name)
   in tests. Your own programs (app/own.js): built in the page from stored choices, named 'own', `first`. */
(function (root) {
  const itemsOf = (w) => [...w.blocks.flatMap((b) => b.items), ...(w.warmup ? w.warmup.items : []), ...(w.cooldown ? w.cooldown.items : [])];

  function summarize(p) {
    const { days, ...rest } = p;
    const exercises = [...new Set(days.flatMap((w) => itemsOf(w).map((it) => it.ex)))].sort();
    return { ...rest, dayCount: days.length, exercises };
  }

  // program cards show the paragraph's first sentence
  const firstSentence = (t) => (t.match(/^[^.!?]+[.!?]/) || [t])[0];

  // what the page carries for the library: enough for the cards, the filters and the progress bars, and no more
  const SLIM = ['id', 'name', 'subject', 'split', 'minutes', 'formats', 'equip', 'dayCount'];
  function slim(s) {
    const out = {};
    SLIM.forEach((k) => { if (s[k] !== undefined) out[k] = s[k]; });
    return { ...out, about: firstSentence(s.about || s.blurb) };
  }

  // exercise -> the programs that use it, in list order (data/index.json)
  function usageIndex(programs) {
    const index = {};
    programs.forEach((p) => summarize(p).exercises.forEach((ex) => { (index[ex] = index[ex] || []).push(p.id); }));
    return index;
  }

  // every program already in the page (tests, and your own programs once built)
  function inlined(programs, name = 'library') {
    return { name, summaries: programs.map(summarize), preloaded: programs };
  }

  // the page: summaries inlined, each program's days fetched from data/<id>.json when first opened and kept in
  // the offline cache (Cache API), which is read when the network isn't there
  function fetched(summaries, { fetchJson, cache, name = 'library', usage }) {
    const title = (pid) => summaries.find((s) => s.id === pid).name;
    return {
      name,
      summaries,
      usage,
      load(pid) {
        const url = `data/${pid}.json`;
        return fetchJson(url)
          .then((p) => cache.put(url, p).then(() => p, () => p))
          .catch(() => cache.get(url).then((p) => { if (!p) throw new Error(`${title(pid)} isn't available offline yet. Open it once while online.`); return p; }));
      },
    };
  }

  // sources: [{ name, summaries, load(pid), preloaded?, first? }]. Listed in the order given, except that sources
  // with `first` come before the others (your own programs before the library). Ids must not clash.
  function createProgramCatalogue(...given) {
    let sources = [];
    let list = [], byId = {}, sourceOf = {};
    let loaded = {};
    const loading = {};
    const listeners = [];
    const usageOf = {}; // source name -> its loaded exercise index
    const usageLoading = {};

    // the order the list uses, and the checks; throws before anything is changed
    const arrange = (all) => {
      const names = new Set(), owner = {};
      all.forEach((src) => {
        if (!src.name) throw new Error('A program source needs a name');
        if (names.has(src.name)) throw new Error(`There are two sources named ${src.name}`);
        names.add(src.name);
        src.summaries.forEach((s) => {
          if (owner[s.id]) throw new Error(`Program id "${s.id}" is in both ${owner[s.id]} and ${src.name}`);
          owner[s.id] = src.name;
        });
      });
      return [...all.filter((x) => x.first), ...all.filter((x) => !x.first)];
    };
    const index = () => {
      list = sources.flatMap((src) => src.summaries.map((s) => ({ ...s, source: src.name })));
      byId = Object.fromEntries(list.map((s) => [s.id, s]));
      sourceOf = Object.fromEntries(sources.flatMap((src) => src.summaries.map((s) => [s.id, src])));
    };
    sources = arrange(given);
    index();
    sources.forEach((src) => (src.preloaded || []).forEach((p) => { loaded[p.id] = p; }));

    const api = {
      ids: () => list.map((s) => s.id),
      list: () => list,
      summary: (pid) => byId[pid],
      has: (pid) => !!byId[pid],
      get: (pid) => loaded[pid],
      day: (pid, n) => (loaded[pid] ? loaded[pid].days[n - 1] : undefined),
      load(pid) {
        if (loaded[pid] || !byId[pid]) return Promise.resolve(loaded[pid]);
        const src = sourceOf[pid];
        return loading[pid] || (loading[pid] = src.load(pid).then(
          (p) => { if (sourceOf[pid] === src) { loaded[pid] = p; delete loading[pid]; } return p; },
          (e) => { if (sourceOf[pid] === src) delete loading[pid]; throw e; }));
      },
      // Add a source or replace the one with this name (you saved, renamed or deleted an own program). What the
      // old one had loaded is dropped; listeners are told. A clashing id throws and changes nothing.
      setSource(name, source) {
        const next = { ...source, name };
        const rest = sources.filter((x) => x.name !== name);
        const arranged = arrange([...rest, next]);
        sources.filter((x) => x.name === name).forEach((old) => old.summaries.forEach((s) => { delete loaded[s.id]; delete loading[s.id]; }));
        delete usageOf[name]; delete usageLoading[name];
        sources = arranged;
        index();
        (next.preloaded || []).forEach((p) => { loaded[p.id] = p; });
        listeners.slice().forEach((fn) => fn());
      },
      // fn() after every setSource; returns the function that stops listening
      onChange(fn) {
        listeners.push(fn);
        return () => { listeners.splice(listeners.indexOf(fn), 1); };
      },
      // background download for offline: `first` in order, then the rest of every source, one at a time;
      // onLoaded(pid) as each arrives. Programs that can't load now (offline, nothing cached) are skipped until next time.
      async loadEverything(first, onLoaded) {
        const order = [...new Set([...first, ...list.map((s) => s.id)])].filter((pid) => byId[pid]);
        for (const pid of order) {
          if (loaded[pid]) continue;
          try { await api.load(pid); onLoaded(pid); } catch (e) { /* try again next time */ }
        }
      },
      // the exercise index of every source that has one, loaded once (rejects with a message for people when it can't be)
      usageReady: () => sources.every((src) => !src.usage || usageOf[src.name]),
      loadUsage() {
        const pending = sources.filter((src) => src.usage && !usageOf[src.name]).map((src) => usageLoading[src.name] || (usageLoading[src.name] = src.usage.load().then(
          (idx) => { if (sources.includes(src)) { usageOf[src.name] = idx; delete usageLoading[src.name]; } },
          (e) => { if (sources.includes(src)) delete usageLoading[src.name]; throw e; })));
        return Promise.all(pending).then(() => {});
      },
      programsUsing: (exId) => list.filter((s) => (s.exercises ? s.exercises.includes(exId) : ((usageOf[s.source] || {})[exId] || []).includes(s.id))).map((s) => s.id),
    };
    return api;
  }

  const api = { createProgramCatalogue, inlined, fetched, summarize, slim, firstSentence, usageIndex };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBPrograms = api;
})(typeof window !== 'undefined' ? window : globalThis);
