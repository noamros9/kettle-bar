/* Stats: what the days marked done add up to. Pure: no page, no storage.
   Counts the PLANNED work of a day (ADR 2); the rules are in docs/plans/phase-2-finish-and-stats.md.

     dayVolume(day, EX) -> { workoutMin, stretchMin, sets, reps, muscles: { muscle: load } }
     weekStart(date) -> Sunday 00:00 local time of that date's week
     summarize(entries, { dayOf, EX, from, to }) -> totals of the done days in [from, to)
       dayOf(pid, n, round): the day as done in that round (its swaps applied), or nothing if the app doesn't have it
       entries: [{ pid, day, time }] (time = when the day was first marked done)
     spanRange('week' | '4weeks' | '3months' | 'year' | 'all', now, entries) -> { from, to }   whole weeks, this one
       included (3 months: 13 weeks); 'year' starts on 1 January (not a Sunday), so its first week is a part week
     weekly(entries, { dayOf, EX, from, to }) -> [{ start, ...totals }] one per week, newest first; the oldest row starts
       on `from` when that isn't a Sunday
     monthly(entries, { dayOf, EX, from, to }) -> [{ start, ...totals }] one per calendar month, newest first, cut to
       [from, to) the same way; weeks and months each add up to the span's totals
     rankMuscles(muscles, names) -> [{ muscle, name, load, share }] worked muscles, biggest load first
     dayParts(day, EX, { family, subject, rests }) -> [{ family, subject, format, min, sets, reps }] one per block: the
       day's workout minutes split by each block's time (Formats' time model, the rest between two blocks going to the
       second), scaled to add up to day.est. A block's own `family` (mixed days) wins over the program's, and a block without one
       on such a day (the abs finisher) goes with the block before it; no family or
       subject -> 'Other'; no rests -> DEFAULT_RESTS (only the shares matter)
     breakdown(entries, { dayOf, EX, from, to, infoOf }) -> { byFamily: { family: min }, bySubject: { family: { subject:
       min } }, byFormat: { format: min }, kinds: { strengthSets, strengthReps, cardioMin, mindMin } }
       infoOf(entry) -> { family, subject, rests } of the program (or random workout) the entry belongs to
     report({ entries, dayOf, EX, names }, { scope: 'all' | pid, round?, span, now })   round: one round only
       -> { from, to, totals, weeks (null for one week), months (this year only, else null), muscles (ranked),
            hasHistory (any done day in scope),
            byFamily, bySubject, byFormat, kinds (breakdown) }   input.infoOf as for breakdown
     exerciseHistory(entries, { dayOf, from, to }) -> [{ ex, days, last }] each exercise of the workout blocks (swaps
       applied: dayOf resolves them) on the done days in [from, to): on how many days it came up, and the last one;
       most days first, then the most recent
     levelOverTime(entries, { dayOf, from, to }) -> [{ pid, weeks: [{ start, level | null }] }] per program done in the
       span (in the order first done), the highest level done each week, oldest week first
     toCSV(entries, { dayOf, EX, nameOf }) -> text: a header, then one row per done day, oldest first: date (local),
       program (nameOf(pid); "Random" for random workouts), day (empty for random), level, workout minutes,
       stretching minutes, sets, reps. Days the app no longer has are left out.
   Muscle load: each set counts 1 for every main muscle and 0.5 for every secondary muscle. */
(function (root, Formats) {
  // every set a day asks for, as [{ ex, sets, repsPerSet }]; timed blocks are converted to sets
  function setsOf(day, EX) {
    const out = [];
    day.blocks.forEach((b) => out.push(...Formats.of(b).sets(b, EX)));
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
    if (span === '3months') return { from: plusDays(thisWeek, -84), to };
    if (span === 'year') return { from: new Date(now.getFullYear(), 0, 1), to };
    if (span === 'all') {
      const first = entries.reduce((m, e) => Math.min(m, new Date(e.time).getTime()), now.getTime());
      return { from: weekStart(new Date(first)), to };
    }
    throw new Error('Unknown span ' + span);
  }

  // rows of [start, end) going back from `to`, the oldest cut at `from`
  function rows(entries, { dayOf, EX, from, to }, back) {
    const out = [];
    for (let end = to; end > from;) {
      const s = back(end), start = s < from ? from : s;
      out.push({ start, ...summarize(entries, { dayOf, EX, from: start, to: end }) });
      end = start;
    }
    return out;
  }
  const weekly = (entries, opts) => rows(entries, opts, (end) => plusDays(end, -7));
  const monthly = (entries, opts) => rows(entries, opts, (end) => { const d = plusDays(end, -1); return new Date(d.getFullYear(), d.getMonth(), 1); });

  function rankMuscles(muscles, names) {
    const worked = Object.entries(muscles).filter(([, x]) => x > 0).sort((a, b) => b[1] - a[1]);
    const max = worked.length ? worked[0][1] : 1;
    return worked.map(([muscle, load]) => ({ muscle, name: names[muscle], load, share: load / max }));
  }

  const DEFAULT_RESTS = { set: 30, exercise: 60, beforeAbs: 120, superset: 45, round: 60, block: 60 };
  function dayParts(day, EX, { family = 'Other', subject = 'Other', rests = DEFAULT_RESTS } = {}) {
    const secs = day.blocks.map((b, i) => Formats.of(b).time(b, rests, EX) + (i ? (b.kind === 'abs' ? rests.beforeAbs : rests.block) : 0));
    const sum = secs.reduce((a, x) => a + x, 0);
    let last = family; // a mixed day's abs finisher has no family of its own: it goes with the block before it
    return day.blocks.map((b, i) => {
      const sets = Formats.of(b).sets(b, EX).filter((x) => x.sets > 0);
      last = b.family || last;
      return {
        family: last, subject, format: b.format || 'straight',
        min: day.est * (sum > 0 ? secs[i] / sum : 1 / day.blocks.length),
        sets: sets.reduce((a, x) => a + x.sets, 0), reps: sets.reduce((a, x) => a + x.sets * x.repsPerSet, 0),
      };
    });
  }
  function breakdown(entries, { dayOf, EX, from, to, infoOf = () => ({}) }) {
    const out = { byFamily: {}, bySubject: {}, byFormat: {}, kinds: { strengthSets: 0, strengthReps: 0, cardioMin: 0, mindMin: 0 } };
    const add = (o, k, x) => { o[k] = (o[k] || 0) + x; };
    entries.forEach((e) => {
      const t = new Date(e.time), d = dayOf(e.pid, e.day, e.round);
      if (!d || t < from || t >= to) return;
      dayParts(d, EX, infoOf(e) || {}).forEach((p) => {
        add(out.byFamily, p.family, p.min);
        add(out.bySubject[p.family] || (out.bySubject[p.family] = {}), p.subject, p.min);
        add(out.byFormat, p.format, p.min);
        if (p.family === 'Strength') { out.kinds.strengthSets += p.sets; out.kinds.strengthReps += p.reps; }
        if (p.family === 'Cardio & combat') out.kinds.cardioMin += p.min;
        if (p.family === 'Mind & body') out.kinds.mindMin += p.min;
      });
    });
    return out;
  }

  const inSpan = (entries, { dayOf, from, to }) => entries.map((e) => ({ e, t: new Date(e.time), d: dayOf(e.pid, e.day, e.round) }))
    .filter(({ t, d }) => d && t >= from && t < to).sort((a, b) => a.t - b.t);

  function exerciseHistory(entries, opts) {
    const seen = {};
    inSpan(entries, opts).forEach(({ t, d }) => {
      new Set(d.blocks.flatMap((b) => b.items.map((it) => it.ex))).forEach((ex) => {
        const h = seen[ex] || (seen[ex] = { ex, days: 0, last: t });
        h.days += 1; h.last = t;
      });
    });
    return Object.values(seen).sort((a, b) => b.days - a.days || b.last - a.last);
  }

  function levelOverTime(entries, opts) {
    const done = inSpan(entries, opts), out = [];
    done.forEach(({ e }) => { if (!out.some((r) => r.pid === e.pid)) out.push({ pid: e.pid }); });
    const starts = [];
    for (let w = weekStart(opts.from); w < opts.to; w = plusDays(w, 7)) starts.push(w);
    out.forEach((r) => {
      r.weeks = starts.map((start) => {
        const lv = done.filter(({ e, t }) => e.pid === r.pid && t >= start && t < plusDays(start, 7)).map(({ d }) => d.level);
        return { start, level: lv.length ? Math.max(...lv) : null };
      });
    });
    return out;
  }

  const pad = (n) => String(n).padStart(2, '0');
  const cell = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
  function toCSV(entries, { dayOf, EX, nameOf }) {
    const rows = inSpan(entries, { dayOf, from: new Date(-8.64e15), to: new Date(8.64e15) }).map(({ e, t, d }) => {
      const v = dayVolume(d, EX), random = e.pid === 'random';
      return [`${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`, random ? 'Random' : nameOf(e.pid), random ? '' : e.day, d.level,
        Math.round(v.workoutMin), Math.round(v.stretchMin), v.sets, v.reps].map(cell).join(',');
    });
    return ['date,program,day,level,workout_minutes,stretching_minutes,sets,reps', ...rows].join('\n') + '\n';
  }

  function report({ entries, dayOf, EX, names, infoOf }, { scope, round, span, now }) {
    const mine = entries.filter((x) => (scope === 'all' || x.pid === scope) && (round === undefined || x.round === round));
    const { from, to } = spanRange(span, now, mine);
    const opts = { dayOf, EX, from, to };
    const totals = summarize(mine, opts);
    return { from, to, totals, weeks: span === 'week' ? null : weekly(mine, opts), muscles: rankMuscles(totals.muscles, names), months: span === 'year' ? monthly(mine, opts) : null, hasHistory: mine.length > 0, ...breakdown(mine, { ...opts, infoOf }) };
  }

  const api = { dayVolume, weekStart, summarize, spanRange, weekly, monthly, rankMuscles, exerciseHistory, levelOverTime, toCSV, report, dayParts, breakdown, DEFAULT_RESTS };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBStats = api;
})(typeof window !== 'undefined' ? window : globalThis, typeof module !== 'undefined' && module.exports ? require('../formats.js') : window.KBFormats);
