/* Program Catalogue: which programs exist, a program's days, and which programs use an exercise.
   The page reads programs only through here, so where programs come from can change behind this seam.

     const programs = createProgramCatalogue(source);
     programs.ids(), programs.list(), programs.summary(pid), programs.has(pid)
       summaries: the program without its days, plus dayCount and the exercises it uses
     programs.get(pid), programs.day(pid, n)   synchronous; nothing until the program is loaded
     programs.load(pid) -> Promise<program>    loads it once (later calls share the same load)
     programs.programsUsing(exId) -> [pid]

   Sources (adapters): inlined(programs), every program already in the page (today; tests).
   Coming: fetched per program with an offline cache (roadmap item 11), and your own programs (Phase 6). */
(function (root) {
  const itemsOf = (w) => [...w.blocks.flatMap((b) => b.items), ...(w.warmup ? w.warmup.items : []), ...(w.cooldown ? w.cooldown.items : [])];

  function summarize(p) {
    const { days, ...rest } = p;
    const exercises = [...new Set(days.flatMap((w) => itemsOf(w).map((it) => it.ex)))].sort();
    return { ...rest, dayCount: days.length, exercises };
  }

  // every program already in the page
  function inlined(programs) {
    return { summaries: programs.map(summarize), preloaded: programs };
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
        return loading[pid] || (loading[pid] = load(pid).then((p) => { loaded[pid] = p; delete loading[pid]; return p; }));
      },
      programsUsing: (exId) => summaries.filter((s) => s.exercises.includes(exId)).map((s) => s.id),
    };
  }

  const api = { createProgramCatalogue, inlined, summarize };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBPrograms = api;
})(typeof window !== 'undefined' ? window : globalThis);
