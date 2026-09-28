/* Program Catalogue: which programs exist, a program's days, and which programs use an exercise.
   The page reads programs only through here, so where programs come from can change behind this seam.

     const programs = createProgramCatalogue(source);
     programs.ids(), programs.list(), programs.summary(pid), programs.has(pid)
       summaries: the program without its days, plus dayCount and the exercises it uses
     programs.get(pid), programs.day(pid, n)   synchronous; nothing until the program is loaded
     programs.load(pid) -> Promise<program>    loads it once (later calls share the same load)
     programs.programsUsing(exId) -> [pid]

     programs.loadEverything(first, onLoaded)  background download of every program, for offline

   Sources (adapters): fetched(summaries, { fetchJson, cache }) in the page; inlined(programs) in tests.
   Coming: your own programs (Phase 6). */
(function (root) {
  const itemsOf = (w) => [...w.blocks.flatMap((b) => b.items), ...(w.warmup ? w.warmup.items : []), ...(w.cooldown ? w.cooldown.items : [])];

  function summarize(p) {
    const { days, ...rest } = p;
    const exercises = [...new Set(days.flatMap((w) => itemsOf(w).map((it) => it.ex)))].sort();
    return { ...rest, dayCount: days.length, exercises };
  }

  // every program already in the page (tests)
  function inlined(programs) {
    return { summaries: programs.map(summarize), preloaded: programs };
  }

  // the page: summaries inlined, each program's days fetched from data/<id>.json when first opened and kept in
  // the offline cache (Cache API), which is read when the network isn't there
  function fetched(summaries, { fetchJson, cache }) {
    const name = (pid) => summaries.find((s) => s.id === pid).name;
    return {
      summaries,
      load(pid) {
        const url = `data/${pid}.json`;
        return fetchJson(url)
          .then((p) => cache.put(url, p).then(() => p, () => p))
          .catch(() => cache.get(url).then((p) => { if (!p) throw new Error(`${name(pid)} isn't available offline yet. Open it once while online.`); return p; }));
      },
    };
  }

  function createProgramCatalogue({ summaries, load, preloaded = [] }) {
    const byId = Object.fromEntries(summaries.map((s) => [s.id, s]));
    const loaded = Object.fromEntries(preloaded.map((p) => [p.id, p]));
    const loading = {};
    return {
      ids: () => summaries.map((s) => s.id),
      list: () => summaries,
      summary: (pid) => byId[pid],
      has: (pid) => !!byId[pid],
      get: (pid) => loaded[pid],
      day: (pid, n) => (loaded[pid] ? loaded[pid].days[n - 1] : undefined),
      load(pid) {
        if (loaded[pid] || !byId[pid]) return Promise.resolve(loaded[pid]);
        return loading[pid] || (loading[pid] = load(pid).then(
          (p) => { loaded[pid] = p; delete loading[pid]; return p; },
          (e) => { delete loading[pid]; throw e; }));
      },
      // background download for offline: `first` in order, then the rest, one at a time; onLoaded(pid) as each
      // arrives. Programs that can't load now (offline, nothing cached) are skipped until next time.
      async loadEverything(first, onLoaded) {
        const order = [...new Set([...first, ...summaries.map((s) => s.id)])].filter((pid) => byId[pid]);
        for (const pid of order) {
          if (loaded[pid]) continue;
          try { await this.load(pid); onLoaded(pid); } catch (e) { /* try again next time */ }
        }
      },
      programsUsing: (exId) => summaries.filter((s) => s.exercises.includes(exId)).map((s) => s.id),
    };
  }

  const api = { createProgramCatalogue, inlined, fetched, summarize };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBPrograms = api;
})(typeof window !== 'undefined' ? window : globalThis);
