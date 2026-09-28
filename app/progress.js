/* Program Progress: one program's done days and exercise swaps, as a value.
   The only module that knows how progress is stored: the cloud document and the device copy.

     value: { done: { day: time first marked }, swaps: [swap] }
     empty(), fromDoc(doc | null), toDoc(value, now), fromDevice({ done, swaps }), toDevice(value)
     isDone(v, day), count(v), toggle(v, day, now), withSwaps(v, list), entries(pid, v)
     nextDay(v, dayNumbers, after?)  the first day not done (after `after` if given, else from the start)
     mergeFirstSync(local, cloud) -> { merged, changed }   changed: the cloud needs the merged copy
     importMerge(current, fromFile, 'merge' | 'replace')

   Cloud document (Firestore users/{uid}/progress/{pid}): { done, swaps, updatedAt }.
   Device copy: two strings, stored under kb-progress-<pid> and kb-swaps-<pid>.
   Merging days: every day from both, the earliest time wins. Merging swaps: mine, then the other side's
   (the other side's last, so they win where they overlap). */
(function (root) {
  const empty = () => ({ done: {}, swaps: [] });
  const copy = (v) => ({ done: { ...v.done }, swaps: v.swaps.map((s) => ({ ...s })) });
  const parse = (text, fallback) => { try { return JSON.parse(text) || fallback; } catch (e) { return fallback; } };

  const fromDoc = (doc) => (doc ? { done: { ...(doc.done || {}) }, swaps: [...(doc.swaps || [])] } : null);
  const toDoc = (v, now) => ({ ...copy(v), updatedAt: now });
  const fromDevice = ({ done, swaps }) => ({ done: parse(done, {}), swaps: parse(swaps, []) });
  const toDevice = (v) => ({ done: JSON.stringify(v.done), swaps: JSON.stringify(v.swaps) });

  const isDone = (v, day) => !!v.done[day];
  const count = (v) => Object.keys(v.done).length;
  function toggle(v, day, now) {
    const done = { ...v.done };
    if (done[day]) delete done[day]; else done[day] = now;
    return { ...copy(v), done };
  }
  const withSwaps = (v, list) => ({ ...copy(v), swaps: list.map((s) => ({ ...s })) });
  const entries = (pid, v) => Object.entries(v.done).map(([day, time]) => ({ pid, day: +day, time }));
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
    // the cloud's swaps first, then the device's new ones
    const merged = { done: mergeDays(c.done, local.done), swaps: [...c.swaps, ...notIn(local.swaps, c.swaps)] };
    const changed = !cloud || count(merged) !== count(c) || merged.swaps.length !== c.swaps.length;
    return { merged, changed };
  }

  function importMerge(current, file, mode) {
    if (mode !== 'merge' && mode !== 'replace') throw new Error('Unknown import mode ' + mode);
    const cur = current || empty(), fileSwaps = file.swaps;
    if (mode === 'replace') return { done: { ...file.done }, swaps: (fileSwaps || cur.swaps).map((s) => ({ ...s })) };
    return { done: mergeDays(cur.done, file.done), swaps: fileSwaps ? mergeSwaps(cur.swaps, fileSwaps) : cur.swaps.map((s) => ({ ...s })) };
  }

  const api = { empty, fromDoc, toDoc, fromDevice, toDevice, isDone, count, toggle, withSwaps, entries, nextDay, mergeFirstSync, importMerge };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBProgress = api;
})(typeof window !== 'undefined' ? window : globalThis);
