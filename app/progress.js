/* Program Progress: one program's done days, exercise swaps and shortened days, as a value.
   The only module that knows how progress is stored: the cloud document and the device copy.

     value: { done: { day: time first marked }, swaps: [swap], past: [{ round, done, swaps, short?, endedAt }], short? }
       done, swaps and short are the current round's; past rounds are kept as they were
       short: { day: true } for the days done "short on time" (Phase 7), present only when there is one, so documents,
       device copies and backups from before (and rounds without any) keep their shape
     empty(), fromDoc(doc | null), toDoc(value, now), fromDevice({ done, swaps, past }), toDevice(value)
     round(v), startRound(v, now, keep), onwardSwaps(v), swapsOfRound(v, round)
     isDone(v, day), count(v), toggle(v, day, now), withSwaps(v, list)
     isShort(v, day), setShort(v, day, on), shortOfRound(v, round) -> { day: true }
     entries(pid, v) -> every done day of every round: [{ pid, day, time, round }]
     nextDay(v, dayNumbers, after?)  the first day not done (after `after` if given, else from the start)
     mergeFirstSync(local, cloud) -> { merged, changed }   changed: the cloud needs the merged copy
     importMerge(current, fromFile, 'merge' | 'replace')

   Cloud document (Firestore users/{uid}/progress/{pid}): { done, swaps, past, short?, updatedAt }.
   Device copy: three strings, stored under kb-progress-<pid>, kb-swaps-<pid> and kb-past-<pid>, and kb-short-<pid>
   when there are short days.
   Two copies in different rounds: the one further along wins whole.
   Merging days: every day from both, the earliest time wins; short days: every one from both. Merging swaps: mine, then the other side's
   (the other side's last, so they win where they overlap). */
(function (root) {
  const empty = () => ({ done: {}, swaps: [], past: [] });
  const clone = (x) => JSON.parse(JSON.stringify(x));
  // { short } when there are short days, else nothing: spread into a value
  const shortOf = (x) => {
    const days = x && typeof x === 'object' && !Array.isArray(x) ? Object.keys(x).filter((d) => x[d] === true) : [];
    return days.length ? { short: Object.fromEntries(days.map((d) => [d, true])) } : {};
  };
  const copy = (v) => ({ done: { ...v.done }, swaps: v.swaps.map((s) => ({ ...s })), past: clone(v.past), ...shortOf(v.short) });
  const parse = (text, fallback) => { try { return JSON.parse(text) || fallback; } catch (e) { return fallback; } };

  const fromDoc = (doc) => (doc ? { done: { ...(doc.done || {}) }, swaps: (doc.swaps || []).map((s) => ({ ...s })), past: clone(doc.past || []), ...shortOf(doc.short) } : null);
  const toDoc = (v, now) => ({ ...copy(v), updatedAt: now });
  const fromDevice = ({ done, swaps, past, short }) => ({ done: parse(done, {}), swaps: parse(swaps, []), past: parse(past, []), ...shortOf(parse(short, null)) });
  const toDevice = (v) => ({ done: JSON.stringify(v.done), swaps: JSON.stringify(v.swaps), past: JSON.stringify(v.past), ...(v.short ? { short: JSON.stringify(v.short) } : {}) });

  const isDone = (v, day) => !!v.done[day];
  const count = (v) => Object.keys(v.done).length;
  function toggle(v, day, now) {
    const done = { ...v.done };
    if (done[day]) delete done[day]; else done[day] = now;
    return { ...copy(v), done };
  }
  const withSwaps = (v, list) => ({ ...copy(v), swaps: list.map((s) => ({ ...s })) });
  const isShort = (v, day) => !!(v.short && v.short[day]);
  function setShort(v, day, on) {
    const { short, ...rest } = copy(v), next = { ...(short || {}) };
    if (on) next[day] = true; else delete next[day];
    return { ...rest, ...shortOf(next) };
  }
  const round = (v) => v.past.length + 1;
  const roundEntries = (pid, done, r) => Object.entries(done).map(([day, time]) => ({ pid, day: +day, time, round: r }));
  const entries = (pid, v) => [...v.past.flatMap((r) => roundEntries(pid, r.done, r.round)), ...roundEntries(pid, v.done, round(v))];
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
      past: [...clone(v.past), { round: round(v), done: { ...v.done }, swaps: v.swaps.map((s) => ({ ...s })), ...shortOf(v.short), endedAt: now }],
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
    const merged = { done: mergeDays(c.done, local.done), swaps: [...c.swaps, ...notIn(local.swaps, c.swaps)], past: clone(c.past), ...shortOf({ ...c.short, ...local.short }) };
    const shorts = (x) => Object.keys(x.short || {}).length;
    const changed = !cloud || count(merged) !== count(c) || merged.swaps.length !== c.swaps.length || shorts(merged) !== shorts(c);
    return { merged, changed };
  }

  function importMerge(current, file, mode) {
    if (mode !== 'merge' && mode !== 'replace') throw new Error('Unknown import mode ' + mode);
    const cur = current || empty(), fileSwaps = file.swaps, filePast = file.past || cur.past;
    if (mode === 'replace') return { done: { ...file.done }, swaps: (fileSwaps || cur.swaps).map((s) => ({ ...s })), past: clone(filePast), ...shortOf(file.short !== undefined ? file.short : cur.short) };
    if (filePast.length !== cur.past.length) { // different rounds: the one further along wins whole
      return filePast.length > cur.past.length ? { done: { ...file.done }, swaps: (fileSwaps || []).map((s) => ({ ...s })), past: clone(filePast), ...shortOf(file.short) } : copy(cur);
    }
    return { done: mergeDays(cur.done, file.done), swaps: fileSwaps ? mergeSwaps(cur.swaps, fileSwaps) : cur.swaps.map((s) => ({ ...s })), past: clone(cur.past), ...shortOf({ ...cur.short, ...file.short }) };
  }

  const api = { empty, fromDoc, toDoc, fromDevice, toDevice, isDone, count, toggle, withSwaps, isShort, setShort, shortOfRound, entries, nextDay, mergeFirstSync, importMerge, round, startRound, onwardSwaps, swapsOfRound };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBProgress = api;
})(typeof window !== 'undefined' ? window : globalThis);
