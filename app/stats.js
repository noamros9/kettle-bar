/* Stats: what the days marked done add up to. Pure: no page, no storage.
   Counts the PLANNED work of a day (ADR 2); the rules are in docs/plans/phase-2-finish-and-stats.md.

     dayVolume(day, EX) -> { workoutMin, stretchMin, sets, reps, muscles: { muscle: load } }
   Muscle load: each set counts 1 for every main muscle and 0.5 for every secondary muscle. */
(function (root) {
  // every set a day asks for, as [{ ex, sets, repsPerSet }]; timed blocks are converted to sets
  function setsOf(day, EX) {
    const out = [];
    const reps = (it) => (EX[it.ex].u === 'sec' ? 0 : it.n * (EX[it.ex].side ? 2 : 1));
    day.blocks.forEach((b) => {
      const f = b.format || 'straight';
      if (f === 'straight') b.items.forEach((it) => out.push({ ex: it.ex, sets: it.sets || b.sets, repsPerSet: reps(it) }));
      else if (f === 'superset') b.items.forEach((it) => out.push({ ex: it.ex, sets: b.sets, repsPerSet: reps(it) }));
      else if (f === 'circuit') b.items.forEach((it) => out.push({ ex: it.ex, sets: b.rounds, repsPerSet: reps(it) }));
      else if (f === 'emom') {
        // minute m does item (m - 1) mod n
        b.items.forEach((it, i) => out.push({ ex: it.ex, sets: Math.ceil((b.minutes - i) / b.items.length), repsPerSet: reps(it) }));
      } else if (f === 'tabata') {
        b.items.forEach((it, i) => out.push({ ex: it.ex, sets: Math.ceil((b.tabatas * 8 - i) / b.items.length), repsPerSet: 0 }));
      } else {
        // AMRAP and ladder: one set per exercise per 2 minutes, at least one
        b.items.forEach((it) => out.push({ ex: it.ex, sets: Math.max(1, Math.floor(b.minutes / 2)), repsPerSet: 0 }));
      }
    });
    return out.filter((s) => s.sets > 0);
  }

  function muscleLoads(sets, EX) {
    const out = {};
    const add = (m, x) => { out[m] = (out[m] || 0) + x; };
    sets.forEach((s) => {
      EX[s.ex].muscles.primary.forEach((m) => add(m, s.sets));
      EX[s.ex].muscles.secondary.forEach((m) => add(m, s.sets / 2));
    });
    return out;
  }

  function dayVolume(day, EX) {
    const sets = setsOf(day, EX);
    const secs = (day.warmup ? day.warmup.seconds : 0) + (day.cooldown ? day.cooldown.seconds : 0);
    return {
      workoutMin: day.est,
      stretchMin: secs / 60,
      sets: sets.reduce((a, s) => a + s.sets, 0),
      reps: sets.reduce((a, s) => a + s.sets * s.repsPerSet, 0),
      muscles: muscleLoads(sets, EX),
    };
  }

  const api = { dayVolume };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBStats = api;
})(typeof window !== 'undefined' ? window : globalThis);
