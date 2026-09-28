/* Backup: the progress file you download from Settings and can import again.
   Pure: no page, no storage. Settings (main.js) reads the Progress Store and does the download.

     exportProgress({ programId: { day: time } }, { now, swaps }) -> file
     fileName(date) -> 'kettle-bar-progress-YYYY-MM-DD.json'
     parseBackup(text, { known, uid }) -> { programs, swaps, unknown }   throws an Error with a message for people
     diffProgress(current, incoming) -> { programId: { added: [days], removed: [days] } }
         added: days the file has and this device doesn't; removed: days only Replace would take away
     planImport(current, text, { known, uid, name }) -> the review and the result, in one step:
       { name, diff, swapNotes, roundNotes, unknown, added, removed, hasChanges, result(mode), message(mode) }
       current and result(mode): { programId: Program Progress }
     dayRanges([1, 2, 3, 5]) -> '1–3, 5'
     nightlyFile([{ uid, email, pid, done }]) -> text of the nightly backup (every account), stable byte for byte

   Export file:  { format: 'kettle-bar-progress', version: 1, exportedAt, programs: { programId: { day: time } },
                   swaps?: { programId: [swap] }, rounds?: { programId: [past round] } }
   Nightly file: { format: 'kettle-bar-backup', version: 1, users: { uid: { email, programs, swaps?, rounds? } } }
   swaps only lists programs that have any; files from before swaps simply have none.
   Both can be imported; from a nightly file, import takes the signed-in account (ADR 5). */
(function (root, P) {
  const FORMAT = 'kettle-bar-progress';
  const NIGHTLY = 'kettle-bar-backup';
  const VERSION = 1;

  const nonEmpty = (swaps = {}) => Object.fromEntries(Object.entries(swaps).filter(([, l]) => l && l.length).map(([pid, l]) => [pid, l.map((x) => ({ ...x }))]));
  function exportProgress(done, { now = () => new Date().toISOString(), swaps, rounds } = {}) {
    const programs = {};
    Object.entries(done).forEach(([pid, days]) => { programs[pid] = { ...days }; });
    return { format: FORMAT, version: VERSION, exportedAt: now(), programs, swaps: nonEmpty(swaps), rounds: nonEmpty(rounds) };
  }

  const isObject = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
  const NOT_OURS = "This file isn't a Kettle & Bar backup";

  // the nightly file holds every account: take the signed-in one, or the only one
  function accountIn(data, uid) {
    const users = isObject(data.users) ? data.users : {};
    const uids = Object.keys(users);
    if (!uids.length) throw new Error('The backup file is damaged: it has no accounts.');
    if (users[uid]) return users[uid];
    if (uids.length === 1) return users[uids[0]];
    throw new Error('This backup holds more than one account. Sign in with the account you want to restore, then import again.');
  }

  function parseBackup(text, { known, uid }) {
    let data;
    try { data = JSON.parse(text); } catch (e) { throw new Error(NOT_OURS + " (it can't be read)."); }
    if (!isObject(data) || (data.format !== FORMAT && data.format !== NIGHTLY)) throw new Error(NOT_OURS + '.');
    if (data.version > VERSION) throw new Error('This backup was made by a newer version of the app. Reload the app and try again.');
    if (data.format === NIGHTLY) data = accountIn(data, uid);
    if (!isObject(data.programs)) throw new Error('The backup file is damaged: it has no programs.');
    const programs = {}, unknown = [];
    Object.entries(data.programs).forEach(([pid, days]) => {
      if (!isObject(days)) throw new Error(`The backup file is damaged: ${pid} has no days.`);
      Object.entries(days).forEach(([d, t]) => {
        if (!/^[1-9]\d*$/.test(d) || typeof t !== 'string') throw new Error(`The backup file is damaged: ${pid} day ${d}.`);
      });
      if (known.includes(pid)) programs[pid] = { ...days }; else unknown.push(pid);
    });
    return { programs, swaps: readSwaps(data.swaps, known), rounds: readRounds(data.rounds, known), unknown };
  }

  const isSwap = (x) => isObject(x) && Number.isInteger(x.day) && x.day >= 1 && typeof x.ex === 'string' && typeof x.to === 'string';
  function readSwaps(swaps = {}, known) {
    if (!isObject(swaps)) throw new Error('The backup file is damaged: swaps.');
    const out = {};
    Object.entries(swaps).forEach(([pid, list]) => {
      if (!Array.isArray(list) || !list.every(isSwap)) throw new Error(`The backup file is damaged: ${pid} swaps.`);
      if (known.includes(pid)) out[pid] = list.map((x) => ({ ...x }));
    });
    return out;
  }


  const isRound = (r) => isObject(r) && Number.isInteger(r.round) && r.round >= 1 && isObject(r.done) && Array.isArray(r.swaps) && r.swaps.every(isSwap);
  function readRounds(rounds = {}, known) {
    if (!isObject(rounds)) throw new Error('The backup file is damaged: rounds.');
    const out = {};
    Object.entries(rounds).forEach(([pid, list]) => {
      if (!Array.isArray(list) || !list.every(isRound)) throw new Error(`The backup file is damaged: ${pid} rounds.`);
      if (known.includes(pid)) out[pid] = JSON.parse(JSON.stringify(list));
    });
    return out;
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


  // [1, 2, 3, 5] -> '1–3, 5' (days are sorted)
  function dayRanges(days) {
    const out = [];
    days.forEach((d, i) => {
      if (i && d === days[i - 1] + 1) out[out.length - 1][1] = d; else out.push([d, d]);
    });
    return out.map(([a, b]) => (a === b ? String(a) : `${a}–${b}`)).join(', ');
  }

  // keys in a fixed order so the same progress always makes the same file
  const sorted = (o, byNumber) => Object.fromEntries(Object.keys(o).sort(byNumber ? (a, b) => a - b : undefined).map((k) => [k, o[k]]));
  function nightlyFile(rows) {
    const users = {};
    rows.forEach(({ uid, email, pid, done, swaps, past }) => {
      const u = users[uid] = users[uid] || { email: email || null, programs: {} };
      u.programs[pid] = sorted(done, true);
      if (swaps && swaps.length) (u.swaps = u.swaps || {})[pid] = swaps;
      if (past && past.length) (u.rounds = u.rounds || {})[pid] = past;
    });
    Object.values(users).forEach((u) => { u.programs = sorted(u.programs); if (u.swaps) u.swaps = sorted(u.swaps); if (u.rounds) u.rounds = sorted(u.rounds); });
    return JSON.stringify({ format: NIGHTLY, version: VERSION, users: sorted(users) }, null, 2) + '\n';
  }

  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
  function planImport(current, text, { known, uid, name }) {
    const { programs, swaps, rounds, unknown } = parseBackup(text, { known, uid });
    const have = Object.fromEntries(Object.keys(programs).map((pid) => [pid, P.fromDoc(current[pid]) || P.empty()]));
    const diff = diffProgress(Object.fromEntries(Object.entries(have).map(([pid, v]) => [pid, v.done])), programs);
    const swapNotes = Object.entries(swaps).filter(([pid, l]) => JSON.stringify(l) !== JSON.stringify(have[pid].swaps))
      .map(([pid, l]) => ({ pid, file: l.length, mine: have[pid].swaps.length }));
    const roundNotes = Object.entries(rounds).map(([pid, past]) => ({ pid, file: past.length + 1, mine: P.round(have[pid]) })).filter((x) => x.file !== x.mine);
    const sum = (k) => Object.values(diff).reduce((a, d) => a + d[k].length, 0);
    const added = sum('added'), removed = sum('removed');
    return {
      name, diff, swapNotes, roundNotes, unknown, added, removed, hasChanges: added + removed > 0 || swapNotes.length > 0 || roundNotes.length > 0,
      result: (mode) => Object.fromEntries(Object.entries(programs).map(([pid, done]) => [pid, P.importMerge(have[pid], { done, swaps: swaps[pid], past: rounds[pid] }, mode)])),
      message: (mode) => (mode === 'merge' ? `Merged: ${plural(added, 'day')} added.` : `Replaced: ${plural(added, 'day')} added, ${removed} removed.`),
    };
  }

  const pad = (n) => String(n).padStart(2, '0');
  const fileName = (d) => `${FORMAT}-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.json`;

  const api = { exportProgress, fileName, parseBackup, diffProgress, planImport, dayRanges, nightlyFile, FORMAT, VERSION };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBBackup = api;
})(typeof window !== 'undefined' ? window : globalThis, typeof module !== 'undefined' && module.exports ? require('./progress.js') : window.KBProgress);
