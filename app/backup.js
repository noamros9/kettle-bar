/* Backup: the progress file you download from Settings and can import again.
   Pure: no page, no storage. Settings (main.js) reads the Progress Store and does the download.

     exportProgress({ programId: { day: time } }, { now, swaps, rounds, ownPrograms, random, prefs }) -> file
     fileName(date) -> 'kettle-bar-progress-YYYY-MM-DD.json'
     parseBackup(text, { known, uid }) -> { programs, swaps, rounds, unknown, ownPrograms, random, prefs }
         throws an Error with a message for people; ownPrograms, random and prefs are null when the file has none
     diffProgress(current, incoming) -> { programId: { added: [days], removed: [days] } }
         added: days the file has and this device doesn't; removed: days only Replace would take away
     planImport(current, text, { known, uid, name, docs }) -> the review and the result, in one step:
       { name, diff, swapNotes, roundNotes, docDiff, prefsNote, unknown, added, removed, hasChanges, canMerge,
         result(mode), docsResult(mode), message(mode) }
       current and result(mode): { programId: Program Progress }
       docs and docsResult(mode): { programs, random, prefs }, each { id: body } (prefs: { main: body }); a collection
         the file does not have is null in docsResult: an import never touches what the file says nothing about
       docDiff: { programs, random }, each { added, removed, changed }: [{ id, name }]; prefsNote: null | { mine }
     dayRanges([1, 2, 3, 5]) -> '1–3, 5'
     nightlyFile([{ uid, email, pid, done }], [{ uid, email, collection, id, doc }]) -> text of the nightly backup
       (every account), stable byte for byte

   Export file:  { format: 'kettle-bar-progress', version: 2, exportedAt, programs: { programId: { day: time } },
                   swaps?: { programId: [swap] }, rounds?: { programId: [past round] }, short?: { programId: { day: true } },
                   again?: { programId: { day: [time] } } (Phase 30: the current round's days done again; optional, so v2 stays),
                   ownPrograms?: { id: doc }, random?: { id: doc }, prefs?: doc }
   Nightly file: { format: 'kettle-bar-backup', version: 2, users: { uid: { email, programs, swaps?, rounds?, short?,
                   ownPrograms?, random?, prefs? } } }
   `programs` is the progress of the library programs (as in version 1); the account's own programs are `ownPrograms`.
   Only what exists is written: swaps for programs that have any, short (the current round's days done "short on
   time", Phase 7; a past round keeps its own in `rounds`) only when a program has some, ownPrograms / random / prefs when not empty, so a
   file with none of them is the same bytes as before. Version 1 files (no account data) still import; from
   version 2 on the merge / replace rules for the docs are in app/docs.js.
   Both can be imported; from a nightly file, import takes the signed-in account (ADR 5). */
(function (root, P, D) {
  const FORMAT = 'kettle-bar-progress';
  const NIGHTLY = 'kettle-bar-backup';
  const VERSION = 2;

  const shortDays = (m) => Object.fromEntries(Object.entries(m || {}).filter(([, days]) => days && Object.keys(days).length).map(([pid, days]) => [pid, { ...days }]));
  const shortField = (m) => { const s = shortDays(m); return Object.keys(s).length ? { short: s } : {}; };
  const againField = (m) => { const s = shortDays(m); return Object.keys(s).length ? { again: s } : {}; }; // same shape test: only non-empty
  const nonEmpty = (swaps = {}) => Object.fromEntries(Object.entries(swaps).filter(([, l]) => l && l.length).map(([pid, l]) => [pid, l.map((x) => ({ ...x }))]));
  const isEmpty = (o) => !o || !Object.keys(o).length;
  // the account data a file carries, only what exists: { ownPrograms?, random?, prefs? }
  function accountFields(ownPrograms, random, prefs) {
    const out = {};
    if (!isEmpty(ownPrograms)) out.ownPrograms = D.sortKeys(ownPrograms);
    if (!isEmpty(random)) out.random = D.sortKeys(random);
    if (prefs) out.prefs = D.sortKeys(prefs);
    return out;
  }
  // prefs: the prefs docs { main: body } (or nothing)
  function exportProgress(done, { now = () => new Date().toISOString(), swaps, rounds, short, again, ownPrograms, random, prefs } = {}) {
    const programs = {};
    Object.entries(done).forEach(([pid, days]) => { programs[pid] = { ...days }; });
    return { format: FORMAT, version: VERSION, exportedAt: now(), programs, swaps: nonEmpty(swaps), rounds: nonEmpty(rounds), ...shortField(short), ...againField(again), ...accountFields(ownPrograms, random, prefs && prefs.main) };
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
    return {
      programs, swaps: readSwaps(data.swaps, known), rounds: readRounds(data.rounds, known), short: readShort(data.short, known), again: readAgain(data.again, known), unknown,
      ownPrograms: readDocs(data.ownPrograms, 'own programs'), random: readDocs(data.random, 'random workouts'), prefs: readPrefs(data.prefs),
    };
  }

  // a section of docs { id: doc }: null when the file has none
  function readDocs(section, what) {
    if (section === undefined) return null;
    if (!isObject(section)) throw new Error(`The backup file is damaged: ${what}.`);
    const out = {};
    Object.entries(section).forEach(([id, body]) => {
      if (!isObject(body)) throw new Error(`The backup file is damaged: ${what} ${id}.`);
      out[id] = JSON.parse(JSON.stringify(body));
    });
    return out;
  }
  function readPrefs(section) {
    if (section === undefined) return null;
    if (!isObject(section)) throw new Error('The backup file is damaged: preferences.');
    return JSON.parse(JSON.stringify(section));
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


  // short days: { pid: { day: true } }
  function readShort(short = {}, known) {
    if (!isObject(short)) throw new Error('The backup file is damaged: short days.');
    const out = {};
    Object.entries(short).forEach(([pid, days]) => {
      if (!isObject(days) || !Object.entries(days).every(([d, on]) => /^[1-9]\d*$/.test(d) && on === true)) throw new Error(`The backup file is damaged: ${pid} short days.`);
      if (known.includes(pid)) out[pid] = { ...days };
    });
    return out;
  }

  // again dates (Phase 30): { pid: { day: [time] } }
  function readAgain(again = {}, known) {
    if (!isObject(again)) throw new Error('The backup file is damaged: again dates.');
    const out = {};
    Object.entries(again).forEach(([pid, days]) => {
      if (!isObject(days) || !Object.entries(days).every(([d, l]) => /^[1-9]\d*$/.test(d) && Array.isArray(l) && l.every((t) => typeof t === 'string'))) throw new Error(`The backup file is damaged: ${pid} again dates.`);
      if (known.includes(pid)) out[pid] = JSON.parse(JSON.stringify(days));
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
  const COLLECTION_FIELD = { programs: 'ownPrograms', random: 'random' };
  function nightlyFile(rows, docRows = []) {
    const users = {};
    const userOf = (uid, email) => (users[uid] = users[uid] || { email: email || null, programs: {} });
    rows.forEach(({ uid, email, pid, done, swaps, past, short, again }) => {
      const u = userOf(uid, email);
      u.programs[pid] = sorted(done, true);
      if (swaps && swaps.length) (u.swaps = u.swaps || {})[pid] = swaps;
      if (past && past.length) (u.rounds = u.rounds || {})[pid] = past;
      if (short && Object.keys(short).length) (u.short = u.short || {})[pid] = sorted(short, true);
      if (again && Object.keys(again).length) (u.again = u.again || {})[pid] = sorted(again, true);
    });
    docRows.forEach(({ uid, email, collection, id, doc }) => {
      const u = userOf(uid, email);
      if (collection === 'prefs') { if (id === 'main') u.prefs = doc; return; }
      (u[COLLECTION_FIELD[collection]] = u[COLLECTION_FIELD[collection]] || {})[id] = doc;
    });
    // every account's fields in one fixed order, and every doc's keys in order
    Object.entries(users).forEach(([uid, u]) => {
      const out = { email: u.email, programs: sorted(u.programs) };
      ['swaps', 'rounds', 'short', 'again'].forEach((k) => { if (u[k]) out[k] = sorted(u[k]); });
      ['ownPrograms', 'random'].forEach((k) => { if (u[k]) out[k] = D.sortKeys(sorted(u[k])); });
      if (u.prefs) out.prefs = D.sortKeys(u.prefs);
      users[uid] = out;
    });
    return JSON.stringify({ format: NIGHTLY, version: VERSION, users: sorted(users) }, null, 2) + '\n';
  }

  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
  const WORDS = { programs: ['own program', 'own programs'], random: ['random workout', 'random workouts'] };
  const label = (body, id) => (typeof body.name === 'string' && body.name ? body.name : id);
  const named = (ids, set) => ids.map((id) => ({ id, name: label(set[id], id) }));
  const none = () => ({ added: [], removed: [], changed: [] });

  function planImport(current, text, { known, uid, name, docs = {} }) {
    const { programs, swaps, rounds, short, again, unknown, ownPrograms, random, prefs } = parseBackup(text, { known, uid });
    const have = Object.fromEntries(Object.keys(programs).map((pid) => [pid, P.fromDoc(current[pid]) || P.empty()]));
    const diff = diffProgress(Object.fromEntries(Object.entries(have).map(([pid, v]) => [pid, v.done])), programs);
    const swapNotes = Object.entries(swaps).filter(([pid, l]) => JSON.stringify(l) !== JSON.stringify(have[pid].swaps))
      .map(([pid, l]) => ({ pid, file: l.length, mine: have[pid].swaps.length }));
    const roundNotes = Object.entries(rounds).map(([pid, past]) => ({ pid, file: past.length + 1, mine: P.round(have[pid]) })).filter((x) => x.file !== x.mine);
    const shortAdds = Object.entries(short).filter(([pid, days]) => Object.keys(days).some((d) => !P.isShort(have[pid], d))).length;
    // again dates the file has that this device hasn't (Phase 30): each counts as a workout added
    const againAdds = Object.entries(again).reduce((n, [pid, days]) => n + Object.entries(days).reduce((m, [d, l]) => m + l.filter((t) => !P.marks(have[pid], d).includes(t)).length, 0), 0);
    const sum = (k) => Object.values(diff).reduce((a, d) => a + d[k].length, 0);
    const added = sum('added'), removed = sum('removed');

    // account data: what the file has, against what this device has (a collection the file lacks is left alone)
    const fileSets = { programs: ownPrograms, random, prefs: prefs ? { main: prefs } : null };
    const mine = (c) => docs[c] || {};
    const docDiff = {};
    ['programs', 'random'].forEach((c) => {
      const d = fileSets[c] ? D.diff(mine(c), fileSets[c]) : none();
      docDiff[c] = { added: named(d.added, fileSets[c] || {}), removed: named(d.removed, mine(c)), changed: named(d.changed, fileSets[c] || {}) };
    });
    const pd = fileSets.prefs ? D.diff(mine('prefs'), fileSets.prefs) : none();
    const prefsNote = pd.added.length || pd.changed.length ? { mine: !!mine('prefs').main } : null;
    const docChanges = ['programs', 'random'].some((c) => Object.values(docDiff[c]).some((l) => l.length));
    const docAdds = ['programs', 'random'].some((c) => docDiff[c].added.length || docDiff[c].changed.length);
    const mergeMessage = () => [`${plural(added, 'day')} added`, ...(againAdds ? [`${plural(againAdds, 'repeat')} added`] : []),
      ...['programs', 'random'].filter((c) => docDiff[c].added.length).map((c) => `${plural(docDiff[c].added.length, WORDS[c][0])} added`),
      ...(prefsNote && !prefsNote.mine ? ['preferences from the file'] : [])].join(', ');
    const replaceMessage = () => [`${plural(added, 'day')} added, ${removed} removed`,
      ...['programs', 'random'].filter((c) => Object.values(docDiff[c]).some((l) => l.length)).map((c) =>
        `${WORDS[c][1]}: ${['added', 'removed', 'changed'].filter((k) => docDiff[c][k].length).map((k) => `${docDiff[c][k].length} ${k}`).join(', ')}`),
      ...(prefsNote ? ['preferences from the file'] : [])].join('; ');
    return {
      name, diff, swapNotes, roundNotes, docDiff, prefsNote, unknown, added, removed,
      hasChanges: added + removed > 0 || swapNotes.length > 0 || roundNotes.length > 0 || shortAdds > 0 || againAdds > 0 || docChanges || !!prefsNote,
      canMerge: added > 0 || swapNotes.length > 0 || roundNotes.length > 0 || shortAdds > 0 || againAdds > 0 || docAdds || !!(prefsNote && !prefsNote.mine),
      result: (mode) => Object.fromEntries(Object.entries(programs).map(([pid, done]) => [pid, P.importMerge(have[pid], { done, swaps: swaps[pid], past: rounds[pid], short: short[pid], again: again[pid] }, mode)])),
      docsResult: (mode) => Object.fromEntries(D.COLLECTIONS.map((c) => [c, fileSets[c] ? D.importMerge(c, mine(c), fileSets[c], mode) : null])),
      message: (mode) => (mode === 'merge' ? `Merged: ${mergeMessage()}.` : `Replaced: ${replaceMessage()}.`),
    };
  }

  const pad = (n) => String(n).padStart(2, '0');
  const fileName = (d) => `${FORMAT}-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.json`;

  const api = { exportProgress, fileName, parseBackup, diffProgress, planImport, dayRanges, nightlyFile, FORMAT, VERSION };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBBackup = api;
})(typeof window !== 'undefined' ? window : globalThis, typeof module !== 'undefined' && module.exports ? require('./progress.js') : window.KBProgress, typeof module !== 'undefined' && module.exports ? require('./docs.js') : window.KBDocs);
