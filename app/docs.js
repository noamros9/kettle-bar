/* Account docs: your own programs, random workouts and preferences, as plain values, and how two copies combine.
   Progress has its own module (app/progress.js); these are the other things an account syncs.

     COLLECTIONS  ['programs', 'random', 'prefs']  the cloud collections users/{uid}/<collection>/{id}
     stamp(body, now) -> a copy of body with updatedAt = now
     keepStamp(body, now) -> a copy; stamped only when it has no updatedAt
     sortKeys(x) -> a copy with every object's keys in order (stable files)
     mergeFirstSync(local, cloud) -> { merged, push }   { id: body } sets; push: the ids the cloud needs
     diff(current, file) -> { added, removed, changed }   sorted ids: only in the file, only on the device, in both but different
     importMerge(collection, current, file, 'merge' | 'replace') -> the { id: body } set to keep

   A doc is a JSON object with an `updatedAt` (ISO time); everything else in it belongs to the feature that owns it.
   Two copies of one id: the newer updatedAt wins; a tie, or a doc without one, goes to the other side (the cloud on
   first sync, the device on import). Preferences are one doc, prefs/main. */
(function (root) {
  const COLLECTIONS = ['programs', 'random', 'prefs'];
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const cloneSet = (set) => Object.fromEntries(Object.entries(set).map(([id, b]) => [id, clone(b)]));
  const stampOf = (b) => (typeof b.updatedAt === 'string' ? b.updatedAt : '');
  const newer = (a, b) => stampOf(a) > stampOf(b);

  const stamp = (body, now) => ({ ...clone(body), updatedAt: now });
  // a body as it is, or stamped when it has no time yet (an imported doc keeps its own)
  const keepStamp = (body, now) => (typeof body.updatedAt === 'string' ? clone(body) : stamp(body, now));
  const sortKeys = (x) => {
    if (Array.isArray(x)) return x.map(sortKeys);
    if (x && typeof x === 'object') return Object.fromEntries(Object.keys(x).sort().map((k) => [k, sortKeys(x[k])]));
    return x;
  };
  const same = (a, b) => JSON.stringify(sortKeys(a)) === JSON.stringify(sortKeys(b));

  function mergeFirstSync(local, cloud) {
    const merged = cloneSet(cloud), push = [];
    Object.entries(local).forEach(([id, body]) => {
      if (!merged[id] || newer(body, merged[id])) { merged[id] = clone(body); push.push(id); }
    });
    return { merged, push };
  }

  function diff(current, file) {
    const ids = (keep) => Object.keys(keep).sort();
    return {
      added: ids(file).filter((id) => !current[id]),
      removed: ids(current).filter((id) => !file[id]),
      changed: ids(file).filter((id) => current[id] && !same(current[id], file[id])),
    };
  }

  function importMerge(collection, current, file, mode) {
    if (mode !== 'merge' && mode !== 'replace') throw new Error('Unknown import mode ' + mode);
    if (mode === 'replace') return cloneSet(file);
    if (collection === 'prefs') return cloneSet({ ...file, ...current }); // the device's preferences win
    const out = cloneSet(current);
    Object.entries(file).forEach(([id, body]) => { if (!out[id] || newer(body, out[id])) out[id] = clone(body); });
    return out;
  }

  const api = { COLLECTIONS, stamp, keepStamp, sortKeys, mergeFirstSync, diff, importMerge };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBDocs = api;
})(typeof window !== 'undefined' ? window : globalThis);
