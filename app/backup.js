/* Backup: the progress file you download from Settings and can import again.
   Pure: no page, no storage. Settings (main.js) reads the Progress Store and does the download.

     exportProgress({ programId: { day: time } }, { now }) -> file
     fileName(date) -> 'kettle-bar-progress-YYYY-MM-DD.json'
     parseBackup(text, { known }) -> { programs, unknown }   throws an Error with a message for people
     diffProgress(current, incoming) -> { programId: { added: [days], removed: [days] } }
         added: days the file has and this device doesn't; removed: days only Replace would take away
     applyImport(current, incoming, 'merge' | 'replace') -> the new done days of each program in the file
     dayRanges([1, 2, 3, 5]) -> '1–3, 5'

   File: { format: 'kettle-bar-progress', version: 1, exportedAt, programs: { programId: { day: time } } } */
(function (root) {
  const FORMAT = 'kettle-bar-progress';
  const VERSION = 1;

  function exportProgress(done, { now = () => new Date().toISOString() } = {}) {
    const programs = {};
    Object.entries(done).forEach(([pid, days]) => { programs[pid] = { ...days }; });
    return { format: FORMAT, version: VERSION, exportedAt: now(), programs };
  }

  const isObject = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
  const NOT_OURS = "This file isn't a Kettle & Bar backup";

  function parseBackup(text, { known }) {
    let data;
    try { data = JSON.parse(text); } catch (e) { throw new Error(NOT_OURS + " (it can't be read)."); }
    if (!isObject(data) || data.format !== FORMAT) throw new Error(NOT_OURS + '.');
    if (data.version > VERSION) throw new Error('This backup was made by a newer version of the app. Reload the app and try again.');
    if (!isObject(data.programs)) throw new Error('The backup file is damaged: it has no programs.');
    const programs = {}, unknown = [];
    Object.entries(data.programs).forEach(([pid, days]) => {
      if (!isObject(days)) throw new Error(`The backup file is damaged: ${pid} has no days.`);
      Object.entries(days).forEach(([d, t]) => {
        if (!/^[1-9]\d*$/.test(d) || typeof t !== 'string') throw new Error(`The backup file is damaged: ${pid} day ${d}.`);
      });
      if (known.includes(pid)) programs[pid] = { ...days }; else unknown.push(pid);
    });
    return { programs, unknown };
  }

  const daysOf = (m) => Object.keys(m).map(Number).sort((a, b) => a - b);
  function diffProgress(current, incoming) {
    const out = {};
    Object.entries(incoming).forEach(([pid, days]) => {
      const have = current[pid] || {};
      const added = daysOf(days).filter((d) => !have[d]);
      const removed = daysOf(have).filter((d) => !days[d]);
      if (added.length || removed.length) out[pid] = { added, removed };
    });
    return out;
  }

  function applyImport(current, incoming, mode) {
    if (mode !== 'merge' && mode !== 'replace') throw new Error('Unknown import mode ' + mode);
    const out = {};
    Object.entries(incoming).forEach(([pid, days]) => {
      if (mode === 'replace') { out[pid] = { ...days }; return; }
      // merge: every day from both, the earliest time wins (the same rule as the first sync)
      const merged = { ...current[pid] };
      Object.entries(days).forEach(([d, t]) => { if (!merged[d] || t < merged[d]) merged[d] = t; });
      out[pid] = merged;
    });
    return out;
  }

  // [1, 2, 3, 5] -> '1–3, 5' (days are sorted)
  function dayRanges(days) {
    const out = [];
    days.forEach((d, i) => {
      if (i && d === days[i - 1] + 1) out[out.length - 1][1] = d; else out.push([d, d]);
    });
    return out.map(([a, b]) => (a === b ? String(a) : `${a}–${b}`)).join(', ');
  }

  const pad = (n) => String(n).padStart(2, '0');
  const fileName = (d) => `${FORMAT}-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.json`;

  const api = { exportProgress, fileName, parseBackup, diffProgress, applyImport, dayRanges, FORMAT, VERSION };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBBackup = api;
})(typeof window !== 'undefined' ? window : globalThis);
