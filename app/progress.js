/* Program Progress: one program's done days, exercise swaps and shortened days, as a value.
   The only module that knows how progress is stored: the cloud document and the device copy.

     value: { done: { day: time first marked }, swaps: [swap], past: [{ round, done, swaps, short?, again?, notes?, endedAt }], short?, again?,
              paused?, weekdays?, notes? }
       done, swaps and short are the current round's; past rounds are kept as they were
       short: { day: true } for the days done "short on time" (Phase 7), present only when there is one, so documents,
       device copies and backups from before (and rounds without any) keep their shape
       again: { day: [time] } for a done day done again (Phase 30, 212 and 217): every later date, oldest first; present
       only when there is one, like short, so old apps, documents and backups ignore it
       paused: the time the program was paused (Phase 33, 252), absent when it isn't; weekdays: the training weekdays,
       0-6 Sunday first, sorted (250), absent when none; both are the program's, not a round's, so a new round keeps them
       notes: { day: { mark: { text, at } } }: a one-line note per time a day was done (251, 269), keyed by that mark's
       time, `at` when it was last written; a new round moves them into its past entry. All three present only when set,
       like short, so old documents, device copies and backups read as not paused, no weekdays, no notes
     empty(), fromDoc(doc | null), toDoc(value, now), fromDevice({ done, swaps, past }), toDevice(value)
     round(v), startRound(v, now, keep), onwardSwaps(v), swapsOfRound(v, round)
     isDone(v, day), count(v), toggle(v, day, now), withSwaps(v, list)
     isShort(v, day), setShort(v, day, on), shortOfRound(v, round) -> { day: true }
     pausedAt(v) -> time | null, setPaused(v, time | null); weekdaysOf(v) -> [0-6], setWeekdays(v, list)
     nextWorkout(weekdays, now, doneToday) -> { day: 0-6, inDays: 0-7, name } the next training weekday (today when today
       is one and nothing is done yet today), or null with no weekdays (Phase 33, 250)
     setNote(v, day, text, now, mark?) the note of a mark of the day (its latest by default): trimmed, cut to 140
       characters, empty removes it; noteOf(v, round, day, mark?) -> its text, or '' (the latest mark's by default)
     doAgain(v, day, now) marks the day done, or done again; removeMark(v, day, time) removes one date (the next
       becomes the day's first; the last one unmarks it); marks(v, day) -> its dates, oldest first
     entries(pid, v) -> every date of every round (a day done twice is two entries): [{ pid, day, time, round }]
     nextDay(v, dayNumbers, after?)  the first day not done (after `after` if given, else from the start)
     mergeFirstSync(local, cloud) -> { merged, changed }   changed: the cloud needs the merged copy
     importMerge(current, fromFile, 'merge' | 'replace')

   Cloud document (Firestore users/{uid}/progress/{pid}): { done, swaps, past, short?, updatedAt }.
   Device copy: three strings, stored under kb-progress-<pid>, kb-swaps-<pid> and kb-past-<pid>, and kb-short-<pid>
   when there are short days.
   Two copies in different rounds: the one further along wins whole.
   Merging days: every day from both, the earliest time wins; short days: every one from both; again dates: every one from both. Merging swaps: mine, then the other side's
   (the other side's last, so they win where they overlap). Notes: every one from both, the newer `at` wins per mark
   (so an edit on another phone isn't lost to the document's own time); paused and weekdays: the other side's (the
   cloud's, the file's) when it has them, else mine. */
(function (root) {
  const empty = () => ({ done: {}, swaps: [], past: [] });
  const clone = (x) => JSON.parse(JSON.stringify(x));
  // { short } when there are short days, else nothing: spread into a value
  const shortOf = (x) => {
    const days = x && typeof x === 'object' && !Array.isArray(x) ? Object.keys(x).filter((d) => x[d] === true) : [];
    return days.length ? { short: Object.fromEntries(days.map((d) => [d, true])) } : {};
  };
  // { again } when a day was done again, else nothing: { day: [time, …] } with each list sorted, no empty lists
  const againOf = (x) => {
    const days = x && typeof x === 'object' && !Array.isArray(x) ? Object.keys(x).filter((d) => Array.isArray(x[d]) && x[d].length && x[d].every((t) => typeof t === 'string')) : [];
    return days.length ? { again: Object.fromEntries(days.map((d) => [d, [...x[d]].sort()])) } : {};
  };
  // Phase 33: { paused } when a time is set; { weekdays } when there are any, sorted, each once; { notes } when there are any
  const pausedOf = (x) => (typeof x === 'string' && x ? { paused: x } : {});
  const weekdaysOf_ = (x) => {
    const list = Array.isArray(x) ? [...new Set(x.filter((d) => Number.isInteger(d) && d >= 0 && d <= 6))].sort() : [];
    return list.length ? { weekdays: list } : {};
  };
  const isNote = (n) => !!n && typeof n === 'object' && typeof n.text === 'string' && n.text && typeof n.at === 'string';
  const notesOf = (x) => {
    const out = {};
    if (x && typeof x === 'object' && !Array.isArray(x)) {
      Object.entries(x).forEach(([d, marks]) => {
        if (!marks || typeof marks !== 'object' || Array.isArray(marks)) return;
        const kept = Object.entries(marks).filter(([, n]) => isNote(n));
        if (kept.length) out[d] = Object.fromEntries(kept.map(([m, n]) => [m, { text: n.text, at: n.at }]));
      });
    }
    return Object.keys(out).length ? { notes: out } : {};
  };
  const extras = (x) => ({ ...pausedOf(x.paused), ...weekdaysOf_(x.weekdays), ...notesOf(x.notes) });
  const copy = (v) => ({ done: { ...v.done }, swaps: v.swaps.map((s) => ({ ...s })), past: clone(v.past), ...shortOf(v.short), ...againOf(v.again), ...extras(v) });
  const parse = (text, fallback) => { try { return JSON.parse(text) || fallback; } catch (e) { return fallback; } };

  const fromDoc = (doc) => (doc ? { done: { ...(doc.done || {}) }, swaps: (doc.swaps || []).map((s) => ({ ...s })), past: clone(doc.past || []), ...shortOf(doc.short), ...againOf(doc.again), ...extras(doc) } : null);
  const toDoc = (v, now) => ({ ...copy(v), updatedAt: now });
  const fromDevice = ({ done, swaps, past, short, again, paused, weekdays, notes }) => ({ done: parse(done, {}), swaps: parse(swaps, []), past: parse(past, []), ...shortOf(parse(short, null)), ...againOf(parse(again, null)),
    ...extras({ paused: parse(paused, null), weekdays: parse(weekdays, null), notes: parse(notes, null) }) });
  const toDevice = (v) => ({ done: JSON.stringify(v.done), swaps: JSON.stringify(v.swaps), past: JSON.stringify(v.past),
    ...['short', 'again', 'paused', 'weekdays', 'notes'].reduce((o, k) => (v[k] ? { ...o, [k]: JSON.stringify(v[k]) } : o), {}) });

  const isDone = (v, day) => !!v.done[day];
  const count = (v) => Object.keys(v.done).length;
  function toggle(v, day, now) {
    const done = { ...v.done };
    if (done[day]) delete done[day]; else done[day] = now;
    const { again, notes, ...rest } = copy(v), left = { ...(again || {}) }, keptNotes = { ...(notes || {}) };
    if (!done[day]) { delete left[day]; delete keptNotes[day]; } // an unmarked day keeps no again dates and no notes
    return { ...rest, done, ...againOf(left), ...notesOf(keptNotes) };
  }
  // Phase 30: a day done again keeps every date (212); the first stays in `done`, so counting days is unchanged
  const marks = (v, day) => (v.done[day] ? [v.done[day], ...((v.again && v.again[day]) || [])] : []);
  function doAgain(v, day, now) {
    if (!v.done[day]) return { ...copy(v), done: { ...v.done, [day]: now } };
    const { again, ...rest } = copy(v);
    return { ...rest, ...againOf({ ...(again || {}), [day]: [...((again && again[day]) || []), now] }) };
  }
  function removeMark(v, day, time) {
    const dates = marks(v, day), i = dates.indexOf(time);
    if (i < 0) return copy(v);
    const left = [...dates.slice(0, i), ...dates.slice(i + 1)].sort();
    const { again, done, notes, ...rest } = copy(v), nextDone = { ...done }, nextAgain = { ...(again || {}) }, nextNotes = clone(notes || {});
    delete nextAgain[day];
    if (left.length) { nextDone[day] = left[0]; if (left.length > 1) nextAgain[day] = left.slice(1); } else delete nextDone[day];
    if (nextNotes[day]) delete nextNotes[day][time]; // that date's note goes with it
    return { done: nextDone, ...rest, ...againOf(nextAgain), ...notesOf(nextNotes) };
  }
  const withSwaps = (v, list) => ({ ...copy(v), swaps: list.map((s) => ({ ...s })) });
  const isShort = (v, day) => !!(v.short && v.short[day]);
  function setShort(v, day, on) {
    const { short, ...rest } = copy(v), next = { ...(short || {}) };
    if (on) next[day] = true; else delete next[day];
    return { ...rest, ...shortOf(next) };
  }
  // Phase 33: pause, training weekdays, a note per time a day was done
  const pausedAt = (v) => v.paused || null;
  const setPaused = (v, time) => { const { paused, ...rest } = copy(v); return { ...rest, ...pausedOf(time) }; };
  const weekdaysOf = (v) => [...(v.weekdays || [])];
  const setWeekdays = (v, list) => { const { weekdays, ...rest } = copy(v); return { ...rest, ...weekdaysOf_(list) }; };
  const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function nextWorkout(weekdays, now, doneToday) {
    if (!weekdays || !weekdays.length) return null;
    const today = now.getDay();
    // within a week there is always one: today (when not done) or a day after it, up to the same weekday next week
    const inDays = [0, 1, 2, 3, 4, 5, 6, 7].find((n) => (n > 0 || !doneToday) && weekdays.includes((today + n) % 7)), day = (today + inDays) % 7;
    return { day, inDays, name: WEEKDAY_NAMES[day] };
  }
  const NOTE_MAX = 140;
  function setNote(v, day, text, now, mark) {
    const at = mark || marks(v, day).at(-1);
    if (!at || !marks(v, day).includes(at)) return copy(v); // a note belongs to a time the day was done
    const { notes, ...rest } = copy(v), next = clone(notes || {}), line = String(text).trim().slice(0, NOTE_MAX).trim();
    next[day] = { ...(next[day] || {}) };
    if (line) next[day][at] = { text: line, at: now }; else delete next[day][at];
    return { ...rest, ...notesOf(next) };
  }
  function noteOf(v, r, day, mark) {
    const x = r === round(v) ? v : v.past.find((p) => p.round === r);
    if (!x || !x.done[day]) return '';
    const at = mark || marks(x, day).at(-1), n = x.notes && x.notes[day] && x.notes[day][at];
    return n ? n.text : '';
  }
  const round = (v) => v.past.length + 1;
  const roundEntries = (pid, x, r) => Object.entries(x.done).flatMap(([day, time]) => [time, ...((x.again && x.again[day]) || [])].map((t) => ({ pid, day: +day, time: t, round: r })));
  const entries = (pid, v) => [...v.past.flatMap((r) => roundEntries(pid, r, r.round)), ...roundEntries(pid, v, round(v))];
  const swapsOfRound = (v, r) => (r === round(v) ? v.swaps : v.past.find((x) => x.round === r).swaps);
  const shortOfRound = (v, r) => ({ ...((r === round(v) ? v : v.past.find((x) => x.round === r)).short || {}) });
  const onwardSwaps = (v) => v.swaps.filter((s) => s.onward);
  // a new round: the current one is kept as it was; days start again; the onward swaps in `keep` reach the whole
  // new round (today-only swaps belonged to their day)
  function startRound(v, now, keep) {
    const kept = new Set(keep.map((s) => JSON.stringify(s)));
    return {
      done: {},
      swaps: onwardSwaps(v).filter((s) => kept.has(JSON.stringify(s))).map((s) => ({ ...s, day: 1 })),
      past: [...clone(v.past), { round: round(v), done: { ...v.done }, swaps: v.swaps.map((s) => ({ ...s })), ...shortOf(v.short), ...againOf(v.again), ...notesOf(v.notes), endedAt: now }],
      ...pausedOf(v.paused), ...weekdaysOf_(v.weekdays), // the program's, not the round's
    };
  }
  function nextDay(v, days, after) {
    const left = days.filter((d) => !v.done[d]);
    const n = after === undefined ? left[0] : left.find((d) => d > after) || left.find((d) => d !== after);
    return n === undefined ? null : n;
  }

  function mergeDays(a, b) {
    const out = { ...a };
    Object.entries(b).forEach(([d, t]) => { if (!out[d] || t < out[d]) out[d] = t; });
    return out;
  }
  // again dates from both sides, each once; a date that became a day's first (`done`) on one side isn't repeated
  function mergeAgain(done, a = {}, b = {}) {
    const out = {};
    [...new Set([...Object.keys(a), ...Object.keys(b)])].forEach((d) => {
      if (!done[d]) return;
      const dates = [...new Set([...(a[d] || []), ...(b[d] || [])])].filter((t) => t !== done[d]);
      if (dates.length) out[d] = dates;
    });
    return againOf(out);
  }
  // notes from both sides, per mark the newer `at` wins; only those of marks the merged days still have
  function mergeNotes(done, again, a = {}, b = {}) {
    const out = {};
    [...new Set([...Object.keys(a), ...Object.keys(b)])].forEach((d) => {
      const have = new Set(done[d] ? [done[d], ...((again && again[d]) || [])] : []);
      const both = { ...(a[d] || {}) };
      Object.entries(b[d] || {}).forEach(([m, n]) => { if (!both[m] || n.at > both[m].at) both[m] = n; });
      const kept = Object.entries(both).filter(([m]) => have.has(m));
      if (kept.length) out[d] = Object.fromEntries(kept.map(([m, n]) => [m, { ...n }]));
    });
    return notesOf(out);
  }
  // paused and weekdays: the other side's when it has them, else mine
  const programFields = (mine, other) => ({ ...pausedOf(other.paused !== undefined ? other.paused : mine.paused), ...weekdaysOf_(other.weekdays !== undefined ? other.weekdays : mine.weekdays) });
  const same = (x, y) => JSON.stringify(x || null) === JSON.stringify(y || null);
  const dates = (x) => Object.values(x.again || {}).reduce((n, l) => n + l.length, 0);
  // the swaps in `list` that `other` doesn't have
  const notIn = (list, other) => { const keys = new Set(other.map((s) => JSON.stringify(s))); return list.filter((s) => !keys.has(JSON.stringify(s))); };
  const mergeSwaps = (mine, theirs) => [...notIn(mine, theirs), ...theirs];

  function mergeFirstSync(local, cloud) {
    const c = cloud || empty();
    if (round(local) !== round(c)) { // different rounds: the one further along wins whole
      const ahead = round(local) > round(c);
      return { merged: copy(ahead ? local : c), changed: ahead };
    }
    // the cloud's swaps first, then the device's new ones
    const done = mergeDays(c.done, local.done), again = mergeAgain(done, c.again, local.again);
    const merged = { done, swaps: [...c.swaps, ...notIn(local.swaps, c.swaps)], past: clone(c.past), ...shortOf({ ...c.short, ...local.short }), ...again,
      ...programFields(local, cloud ? c : local), ...mergeNotes(done, again.again, local.notes, c.notes) };
    const shorts = (x) => Object.keys(x.short || {}).length;
    // no cloud copy: written only when there's something to say (an empty program needs no document of its own: a missing
    // one reads as empty everywhere), so a first sign-in doesn't write a document for every program in the library
    const something = (x) => count(x) > 0 || x.swaps.length > 0 || x.past.length > 0 || shorts(x) > 0 || !!(x.paused || x.weekdays || x.notes);
    const changed = (!cloud && something(merged)) || (!!cloud && (count(merged) !== count(c) || merged.swaps.length !== c.swaps.length || shorts(merged) !== shorts(c) || dates(merged) !== dates(c)
      || !same(merged.paused, c.paused) || !same(merged.weekdays, c.weekdays) || !same(merged.notes, c.notes)));
    return { merged, changed };
  }

  function importMerge(current, file, mode) {
    if (mode !== 'merge' && mode !== 'replace') throw new Error('Unknown import mode ' + mode);
    const cur = current || empty(), fileSwaps = file.swaps, filePast = file.past || cur.past;
    const prog = programFields(cur, file); // paused and weekdays: the file's when it has them
    if (mode === 'replace') {
      const again = mergeAgain(file.done, file.again !== undefined ? file.again : cur.again);
      return { done: { ...file.done }, swaps: (fileSwaps || cur.swaps).map((s) => ({ ...s })), past: clone(filePast), ...shortOf(file.short !== undefined ? file.short : cur.short), ...again, ...prog,
        ...mergeNotes(file.done, again.again, file.notes !== undefined ? file.notes : cur.notes) };
    }
    if (filePast.length !== cur.past.length) { // different rounds: the one further along wins whole
      if (filePast.length < cur.past.length) return copy(cur);
      const again = mergeAgain(file.done, file.again);
      return { done: { ...file.done }, swaps: (fileSwaps || []).map((s) => ({ ...s })), past: clone(filePast), ...shortOf(file.short), ...again, ...prog, ...mergeNotes(file.done, again.again, file.notes) };
    }
    const done = mergeDays(cur.done, file.done), again = mergeAgain(done, cur.again, file.again);
    return { done, swaps: fileSwaps ? mergeSwaps(cur.swaps, fileSwaps) : cur.swaps.map((s) => ({ ...s })), past: clone(cur.past), ...shortOf({ ...cur.short, ...file.short }), ...again, ...prog,
      ...mergeNotes(done, again.again, cur.notes, file.notes) };
  }

  const api = { nextWorkout, WEEKDAY_NAMES, pausedAt, setPaused, weekdaysOf, setWeekdays, setNote, noteOf, NOTE_MAX, empty, fromDoc, toDoc, fromDevice, toDevice, isDone, count, toggle, marks, doAgain, removeMark, withSwaps, isShort, setShort, shortOfRound, entries, nextDay, mergeFirstSync, importMerge, round, startRound, onwardSwaps, swapsOfRound };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBProgress = api;
})(typeof window !== 'undefined' ? window : globalThis);
