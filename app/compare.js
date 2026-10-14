/* Compare two programs (Phase 33 ticket 5, #294, decision 255). Pure: runs in Node and in the page (KBCompare).

     of(a, b, EX) -> { a: side, b: side, common: [{ ex, a, b }] }
       side: { id, name, subject, days, cycle, kinds, minutes: [min, max], formats: [name], gear: [text], focus, tops,
               exercises: { ex: days used } }
         days: the program's length; cycle: the length of its repeating run of day types (null when it never repeats,
         a Variety program); kinds: how many kinds of day; minutes: the shortest and longest day (rounded);
         gear: what its exercises need (Dumbbells, Kettlebell, Pull-up bar), or "No equipment";
         focus: each muscle's share of the weighted sets over every day (KBStats.programFocus, adds up to 1);
         tops: that load summed into Upper / Core / Lower (KBStats.groupLoads with the catalogue's MUSCLE_GROUPS)
       common: the exercises both use, with the days each uses it on, the most shared first
       exercises and common count the workout's blocks, not the warm-up and cool-down */
(function (root, Stats, Formats, Ex) {
  // the workout's exercises: the warm-up and cool-down are matched to the day, so they would only crowd what's shared
  const itemsOf = (d) => d.blocks.flatMap((b) => b.items);
  // equipment in kinds, not sizes: "Dumbbells" for every dumbbell load
  const kindOf = (load) => (load === 'kb' ? 'Kettlebell' : 'Dumbbells');
  // the shortest k whose run of day types repeats through the whole program (null when none does)
  function cycleOf(days) {
    const t = days.map((d) => d.type);
    for (let k = 1; k <= t.length / 2; k++) if (t.every((x, i) => x === t[i % k])) return k;
    return null;
  }
  function side(p, EX) {
    const exercises = {};
    p.days.forEach((d) => new Set(itemsOf(d).map((it) => it.ex)).forEach((ex) => { exercises[ex] = (exercises[ex] || 0) + 1; }));
    const used = Object.keys(exercises).map((id) => EX[id]);
    const loads = [...new Set(used.filter((e) => e.load).map((e) => kindOf(e.load)))].sort();
    const gear = [...loads, ...(used.some((e) => Ex.needs(e, 'bar')) ? ['Pull-up bar'] : [])];
    const focus = Stats.programFocus(p.days, EX);
    const ests = p.days.map((d) => d.est);
    return {
      id: p.id, name: p.name, subject: p.subject || '', days: p.days.length, cycle: cycleOf(p.days), kinds: new Set(p.days.map((d) => d.type)).size,
      minutes: [Math.round(Math.min(...ests)), Math.round(Math.max(...ests))],
      formats: [...new Set(p.days.flatMap((d) => d.blocks.map((b) => b.format || 'straight')))].map((f) => Formats.NAMES[f]),
      gear: gear.length ? gear : ['No equipment'], focus, tops: Stats.groupLoads(focus, Ex.MUSCLE_GROUPS).tops, exercises,
    };
  }
  function of(a, b, EX) {
    const A = side(a, EX), B = side(b, EX);
    const common = Object.keys(A.exercises).filter((ex) => B.exercises[ex]).map((ex) => ({ ex, a: A.exercises[ex], b: B.exercises[ex] }))
      .sort((x, y) => y.a + y.b - (x.a + x.b) || x.ex.localeCompare(y.ex));
    return { a: A, b: B, common };
  }

  const api = { of, cycleOf };
  /* node:coverage ignore next 5 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBCompare = api;
})(typeof window !== 'undefined' ? window : globalThis,
  typeof module !== 'undefined' && module.exports ? require('./stats.js') : window.KBStats,
  typeof module !== 'undefined' && module.exports ? require('../formats.js') : window.KBFormats,
  typeof module !== 'undefined' && module.exports ? require('../exercises.js') : window.KBEx);
