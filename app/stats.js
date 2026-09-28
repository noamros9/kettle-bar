/* Stats: what the days marked done add up to. Pure: no page, no storage.
   Counts the PLANNED work of a day (ADR 2); the rules are in docs/plans/phase-2-finish-and-stats.md.

     dayVolume(day, EX) -> { workoutMin, stretchMin, sets, reps, muscles: { muscle: load } }
     weekStart(date) -> Sunday 00:00 local time of that date's week
     summarize(entries, { dayOf, EX, from, to }) -> totals of the done days in [from, to)
       dayOf(pid, n, round): the day as done in that round (its swaps applied), or nothing if the app doesn't have it
       entries: [{ pid, day, time }] (time = when the day was first marked done)
     spanRange('week' | '4weeks' | 'all', now, entries) -> { from, to }   whole weeks, this one included
     weekly(entries, { dayOf, EX, from, to }) -> [{ start, ...totals }] one per week, newest first
     rankMuscles(muscles, names) -> [{ muscle, name, load, share }] worked muscles, biggest load first
     report({ entries, dayOf, EX, names }, { scope: 'all' | pid, round?, span, now })   round: one round only
       -> { from, to, totals, weeks (null for one week), muscles (ranked), hasHistory (any done day in scope) }
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

  function weekStart(date) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    d.setDate(d.getDate() - d.getDay());
    return d;
  }

  const empty = () => ({ workouts: 0, workoutMin: 0, stretchMin: 0, sets: 0, reps: 0, muscles: {} });
  function add(total, v) {
    total.workouts += 1;
    ['workoutMin', 'stretchMin', 'sets', 'reps'].forEach((k) => { total[k] += v[k]; });
    Object.entries(v.muscles).forEach(([m, x]) => { total.muscles[m] = (total.muscles[m] || 0) + x; });
    return total;
  }
  function summarize(entries, { dayOf, EX, from, to }) {
    return entries.reduce((total, e) => {
      const t = new Date(e.time), d = dayOf(e.pid, e.day, e.round);
      if (!d || t < from || t >= to) return total;
      return add(total, dayVolume(d, EX));
    }, empty());
  }

  const plusDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  function spanRange(span, now, entries) {
    const thisWeek = weekStart(now), to = plusDays(thisWeek, 7);
    if (span === 'week') return { from: thisWeek, to };
    if (span === '4weeks') return { from: plusDays(thisWeek, -21), to };
    if (span === 'all') {
      const first = entries.reduce((m, e) => Math.min(m, new Date(e.time).getTime()), now.getTime());
      return { from: weekStart(new Date(first)), to };
    }
    throw new Error('Unknown span ' + span);
  }

  function weekly(entries, { dayOf, EX, from, to }) {
    const rows = [];
    for (let start = plusDays(to, -7); start >= from; start = plusDays(start, -7)) {
      rows.push({ start, ...summarize(entries, { dayOf, EX, from: start, to: plusDays(start, 7) }) });
    }
    return rows;
  }

  function rankMuscles(muscles, names) {
    const worked = Object.entries(muscles).filter(([, x]) => x > 0).sort((a, b) => b[1] - a[1]);
    const max = worked.length ? worked[0][1] : 1;
    return worked.map(([muscle, load]) => ({ muscle, name: names[muscle], load, share: load / max }));
  }

  function report({ entries, dayOf, EX, names }, { scope, round, span, now }) {
    const mine = entries.filter((x) => (scope === 'all' || x.pid === scope) && (round === undefined || x.round === round));
    const { from, to } = spanRange(span, now, mine);
    const opts = { dayOf, EX, from, to };
    const totals = summarize(mine, opts);
    return { from, to, totals, weeks: span === 'week' ? null : weekly(mine, opts), muscles: rankMuscles(totals.muscles, names), hasHistory: mine.length > 0 };
  }

  const api = { dayVolume, weekStart, summarize, spanRange, weekly, rankMuscles, report };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBStats = api;
})(typeof window !== 'undefined' ? window : globalThis);
