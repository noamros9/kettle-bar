/* Progress Store: each program's Program Progress (done days, exercise swaps and short days), and the account's other synced
   data (own programs, random workouts, preferences), kept in sync.
   Always keeps a device copy (storage adapter). A remote adapter can be attached for sync:
     remote = { kind, account?,
                subscribe(collection, id, onData(doc | null), onErr) -> unsubscribe,
                subscribeAll?(collection, onDocs({ id: doc }), onErr) -> unsubscribe,
                write(collection, id, doc) -> Promise, remove?(collection, id) -> Promise }
   Progress: collection 'progress', one cloud document per program (users/{uid}/progress/{pid}); its shape belongs to
   Program Progress (app/progress.js), and every write sends the whole value, so a tick never wipes a swap.
   Account data: collections 'programs', 'random', 'prefs' (users/{uid}/<collection>/{id}), any number of docs each;
   their rules belong to app/docs.js. The store adds a generic interface for them:
     doc(collection, id) -> body | null     docs(collection) -> { id: body }
     setDoc(collection, id, body)           stamps the time; device copy, cloud, 'docs' event
     deleteDoc(collection, id)              replaceDocs(collection, { id: body })  (an import: exactly this set)
   Your own programs come and go: addProgram(pid), dropProgram(pid) (forgets it in memory; the device copy stays, as a doc
   that vanishes for a moment must not cost you your progress), deleteProgress(pid) (a deleted program: drops it, removes
   its device keys and its cloud progress document).
   Device copy of a doc: kb-doc-<collection>-<id>, with the ids of a collection in kb-docs-<collection>.
   A refused or failed account-data write never changes the sync status or makes progress view-only: progress must
   keep working when the rules for the new collections are not published yet. The doc stays on the device and goes
   up at the next first sync.
   Outbox (Phase 12): while signed in, every cloud write is kept on the device (kb-outbox) until confirmed, sent again on
   online() and at attach, where it wins over the cloud's copy; waiting() says how many; an 'outbox' event on change.
   Adapters: Firebase (firebase-sync.js), in-memory (tests).
   The store never touches the page: it emits 'change' (pid), 'docs' (collection), 'outbox' (count) and 'status' (ok | saving |
   offline | local | signin | ro | err) events. storage = { get, set, remove? } (a device without remove clears
   the text instead). */
(function (root, P, D) {
  function createStore({ programIds: given, storage, now = () => new Date().toISOString(), isOnline = () => true, retryDelay = () => 600 + Math.random() * 800 }) {
    const programIds = given.slice(); // grows and shrinks at runtime: your own programs (addProgram, dropProgram)
    const listeners = { change: [], status: [], docs: [], outbox: [] };
    const emit = (ev, x) => listeners[ev].forEach((f) => f(x));
    const progress = {};
    let remote = null, unsubs = [], progressUnsubs = {}, seen = {}, docSeen = {}, queue = Promise.resolve(), docQueue = Promise.resolve(), readonly = false, auth = null, status = 'local';
    const keys = (pid) => ({ done: 'kb-progress-' + pid, swaps: 'kb-swaps-' + pid, past: 'kb-past-' + pid, short: 'kb-short-' + pid, again: 'kb-again-' + pid });
    const fromDevice = (pid) => { const k = keys(pid); return P.fromDevice({ done: read(k.done), swaps: read(k.swaps), past: read(k.past), short: read(k.short), again: read(k.again) }); };
    const setStatus = (s) => { status = s; emit('status', s); };
    const of = (pid) => progress[pid] || P.empty();

    // account data: { collection: { id: body } }; pending: writes not finished yet, per 'collection/id'
    const pending = {};
    // the outbox (Phase 12): 'progress/<pid>' or '<collection>/<id>' -> { s: the number of its latest change, n: how many
    // changes it holds } (an older device's plain number reads as one change). Kept on the device
    // (kb-outbox) until the cloud confirms that change; sent again on reconnect (online()) and at the next attach, where
    // a waiting change wins over the cloud's copy. Only while signed in (a remote, or an account known from sign-in).
    let outbox = {}, seq = 0;
    const OUTBOX = 'kb-outbox';
    const changes = () => Object.values(outbox).reduce((a, x) => a + x.n, 0);
    const saveOutbox = () => { // an empty box leaves no key: the device copy is as it was before
      if (Object.keys(outbox).length) { try { storage.set(OUTBOX, JSON.stringify(outbox)); } catch (e) { /* best effort */ } } else forgetKey(OUTBOX);
      emit('outbox', changes());
    };
    // a change to send (a retry of one already waiting doesn't count as another)
    const mark = (k, again) => { if (!remote && !auth) return 0; outbox[k] = { s: ++seq, n: (outbox[k] ? outbox[k].n : 0) + (again ? 0 : 1) }; saveOutbox(); return seq; };
    const sent = (k, n) => { if (n && outbox[k] && outbox[k].s === n) { delete outbox[k]; saveOutbox(); } };
    const waits = (k) => outbox[k] !== undefined;
    const account = Object.fromEntries(D.COLLECTIONS.map((c) => [c, {}]));
    const docKey = (c, id) => 'kb-doc-' + c + '-' + id, indexKey = (c) => 'kb-docs-' + c;
    const known = (c) => { if (!D.COLLECTIONS.includes(c)) throw new Error('Unknown collection ' + c); return c; };
    const read = (key) => { try { return storage.get(key); } catch (e) { return null; } };
    const parseDoc = (text) => { try { const b = JSON.parse(text); return b && typeof b === 'object' && !Array.isArray(b) ? b : null; } catch (e) { return null; } };

    function load() {
      try { const o = JSON.parse(read(OUTBOX)); outbox = o && typeof o === 'object' && !Array.isArray(o) ? o : {}; } catch (e) { outbox = {}; }
      outbox = Object.fromEntries(Object.entries(outbox).map(([k, x]) => [k, typeof x === 'number' ? { s: x, n: 1 } : { s: +x.s || 0, n: +x.n || 1 }]));
      seq = Math.max(0, ...Object.values(outbox).map((x) => x.s));
      programIds.forEach((pid) => {
        progress[pid] = fromDevice(pid);
      });
      D.COLLECTIONS.forEach((c) => {
        let ids; try { ids = JSON.parse(read(indexKey(c))); } catch (e) { ids = null; }
        account[c] = {};
        (Array.isArray(ids) ? ids : []).forEach((id) => { const b = parseDoc(read(docKey(c, id))); if (b) account[c][id] = b; });
      });
    }
    function save(pid) {
      const k = keys(pid), text = P.toDevice(progress[pid]);
      try { storage.set(k.done, text.done); storage.set(k.swaps, text.swaps); storage.set(k.past, text.past); } catch (e) { /* storage full or blocked: keep going */ }
      if (text.short) { try { storage.set(k.short, text.short); } catch (e) { /* as above */ } } else forgetKey(k.short); // none: no key, as before
      if (text.again) { try { storage.set(k.again, text.again); } catch (e) { /* as above */ } } else forgetKey(k.again); // Phase 30: as short
    }
    function saveDoc(c, id) { try { storage.set(docKey(c, id), JSON.stringify(account[c][id])); } catch (e) { /* device copy is best effort */ } }
    function forgetKey(key) { try { if (storage.remove) storage.remove(key); else storage.set(key, ''); } catch (e) { /* device copy is best effort */ } }
    const forgetDoc = (c, id) => forgetKey(docKey(c, id));
    function saveIndex(c) { try { storage.set(indexKey(c), JSON.stringify(Object.keys(account[c]).sort())); } catch (e) { /* as above */ } }
    // a new value for one program: device copy, cloud (when signed in and allowed), change event
    function set(pid, value) {
      progress[pid] = value; save(pid);
      if (!readonly) write(pid); // signed out: nothing to send (write keeps nothing); offline while signed in: the outbox
      emit('change', pid);
    }

    function attach(r) {
      detach(true);
      remote = r; seen = {}; readonly = false; setStatus('ok');
      docSeen = {};
      programIds.forEach(follow);
      // account data: an error here (e.g. the rules for the new collections are not published) is not a sync problem for progress
      if (r.subscribeAll) D.COLLECTIONS.forEach((c) => unsubs.push(r.subscribeAll(c, (docs) => onDocs(c, docs), (e) => console.warn('sync error (' + c + ')', e))));
      // waiting deletes of programs no longer here (their progress isn't followed)
      Object.keys(outbox).filter((k) => k.startsWith('progress/') && !programIds.includes(k.slice(9))).forEach((k) => removeProgress(k.slice(9), true));
    }
    // send everything waiting (reconnect): programs followed get their whole value again, docs their current body
    function retryOutbox() {
      if (!remote) return;
      Object.keys(outbox).forEach((k) => {
        const i = k.indexOf('/'), c = k.slice(0, i), id = k.slice(i + 1);
        if (c !== 'progress') writeDoc(c, id, true); else if (programIds.includes(id)) write(id, true); else removeProgress(id, true);
      });
    }
    // listen to one program's cloud document
    function follow(pid) {
      const r = remote;
      progressUnsubs[pid] = r.subscribe('progress', pid, (doc) => onRemote(pid, P.fromDoc(doc)), (e) => { if (typeof console !== 'undefined') console.warn('sync error', e); setStatus('err'); });
    }
    function detach(silent) {
      [...unsubs, ...Object.values(progressUnsubs)].forEach((u) => { try { u(); } catch (e) { /* already gone */ } });
      unsubs = []; progressUnsubs = {}; remote = null;
      if (!silent) setStatus(auth ? 'signin' : 'local');
    }
    function onRemote(pid, cloud) {
      if (!programIds.includes(pid)) return; // a program dropped while its last update was on its way
      const mine = waits('progress/' + pid); // a change still waiting for the cloud: the phone's copy wins
      const before = JSON.stringify(P.toDevice(of(pid)));
      if (!seen[pid]) {
        seen[pid] = true;
        if (mine) { write(pid, true); return; }
        const { merged, changed } = P.mergeFirstSync(of(pid), cloud);
        progress[pid] = merged; save(pid);
        if (changed) write(pid, true); // the first sync's own write: kept until sent, not counted as a change of yours
      } else { // later snapshots replace the copy here, as before (a live connection's snapshot includes our own writes)
        progress[pid] = cloud || P.empty(); save(pid);
      }
      // a reply that leaves this device's copy as it was (most programs at sign-in, our own echoes) redraws nothing
      if (JSON.stringify(P.toDevice(of(pid))) !== before) emit('change', pid);
    }
    function onDocs(c, cloud) {
      const prev = Object.keys(account[c]);
      if (!docSeen[c]) {
        docSeen[c] = true;
        const { merged, push } = D.mergeFirstSync(account[c], cloud);
        // a change still waiting in the outbox wins: kept as it is here, or gone if it was deleted here
        const waiting = Object.keys(outbox).filter((k) => k.startsWith(c + '/')).map((k) => k.slice(c.length + 1));
        waiting.forEach((id) => { if (account[c][id]) merged[id] = account[c][id]; else delete merged[id]; });
        account[c] = merged; saveAll(c, prev);
        [...new Set([...push, ...waiting])].forEach((id) => writeDoc(c, id, true));
      } else { // the cloud's set, except docs with a write still on its way: those stay as they are here
        const next = D.mergeFirstSync({}, cloud).merged;
        [...Object.keys(pending).filter((k) => pending[k] > 0), ...Object.keys(outbox)].filter((k) => k.startsWith(c + '/')).map((k) => k.slice(c.length + 1)).forEach((id) => {
          if (account[c][id]) next[id] = account[c][id]; else delete next[id];
        });
        account[c] = next; saveAll(c, prev);
      }
      emit('docs', c);
    }
    function saveAll(c, prev) {
      prev.filter((id) => !account[c][id]).forEach((id) => forgetDoc(c, id));
      Object.keys(account[c]).forEach((id) => saveDoc(c, id));
      if (prev.length || Object.keys(account[c]).length) saveIndex(c); // nothing to say about an empty collection
    }
    function writeDoc(c, id, again) {
      const k = c + '/' + id, n = mark(k, again);
      const r = remote; if (!r) return docQueue;
      pending[k] = (pending[k] || 0) + 1;
      docQueue = docQueue.then(async () => {
        try { if (account[c][id]) await r.write(c, id, account[c][id]); else await r.remove(c, id); sent(k, n); }
        catch (e) { console.warn('account data not saved to the cloud (' + c + ')', e); }
        finally { pending[k]--; }
      });
      return docQueue;
    }
    const put = (c, id, body) => { account[c][id] = body; saveDoc(c, id); saveIndex(c); writeDoc(c, id); };
    function drop(c, id) { delete account[c][id]; forgetDoc(c, id); saveIndex(c); writeDoc(c, id); }
    function setDoc(c, id, body) { put(known(c), id, D.stamp(body, now())); emit('docs', c); return docQueue; }
    function deleteDoc(c, id) { if (known(c) && account[c][id]) { drop(c, id); emit('docs', c); } return docQueue; }
    // an import: exactly these docs (their own time stamps kept); the others are removed
    function replaceDocs(c, set) {
      known(c);
      Object.keys(account[c]).filter((id) => !set[id]).forEach((id) => drop(c, id));
      Object.entries(set).forEach(([id, body]) => put(c, id, D.keepStamp(body, now())));
      emit('docs', c);
      return docQueue;
    }
    // your own programs come and go while the page is open: learn a program's id (its device copy, its cloud
    // document), or forget it (the device copy stays; deleteProgress removes it for a program you deleted yourself)
    function addProgram(pid) {
      if (programIds.includes(pid)) return;
      programIds.push(pid);
      progress[pid] = fromDevice(pid);
      if (remote) follow(pid);
      emit('change', pid);
    }
    function dropProgram(pid) {
      const i = programIds.indexOf(pid);
      if (i < 0) return;
      programIds.splice(i, 1);
      delete progress[pid]; delete seen[pid];
      if (progressUnsubs[pid]) { progressUnsubs[pid](); delete progressUnsubs[pid]; }
      emit('change', pid);
    }
    // delete a program's progress for good: its device copy and its cloud document (the caller deletes the program itself,
    // deleteDoc); other devices forget the program when its doc disappears. Resolves when the cloud has been asked.
    function deleteProgress(pid) {
      const k = keys(pid);
      dropProgram(pid);
      [k.done, k.swaps, k.past, k.short, k.again].forEach(forgetKey);
      return removeProgress(pid);
    }
    function removeProgress(pid, again) {
      const k = 'progress/' + pid, n = mark(k, again);
      const r = remote; if (!r) return queue;
      queue = queue.then(async () => { try { await r.remove('progress', pid); sent(k, n); } catch (e) { console.warn('progress not deleted from the cloud', e); } });
      return queue;
    }
    const toggle = (pid, day) => set(pid, P.toggle(of(pid), day, now()));
    const doAgain = (pid, day) => set(pid, P.doAgain(of(pid), day, now())); // Phase 30: done, or done again today (212)
    const removeMark = (pid, day, time) => set(pid, P.removeMark(of(pid), day, time)); // History's Remove (215)
    const setSwaps = (pid, list) => set(pid, P.withSwaps(of(pid), list));
    const setShort = (pid, day, on) => set(pid, P.setShort(of(pid), day, on)); // "short on time" for that day (Phase 7)
    // a new round: the current one is kept as it was; `keep` = the onward swaps to carry over
    const startRound = (pid, keep) => set(pid, P.startRound(of(pid), now(), keep));
    // set whole programs at once (an import): { pid: Program Progress }; one write per program
    function replaceAll(values) {
      Object.entries(values).forEach(([pid, v]) => set(pid, P.fromDoc(v))); // fromDoc fills in what a value leaves out
      return queue;
    }
    function write(pid, again) {
      const key = 'progress/' + pid, n = mark(key, again);
      const r = remote; if (!r) return queue;
      setStatus(isOnline() ? 'saving' : 'offline');
      queue = queue.then(async () => {
        const doc = P.toDoc(of(pid), now());
        try { await r.write('progress', pid, doc); sent(key, n); if (remote === r) setStatus('ok'); }
        catch (e) {
          const code = e && e.code;
          if (code === 'unavailable') {
            await new Promise((res) => setTimeout(res, retryDelay()));
            try { await r.write('progress', pid, doc); sent(key, n); setStatus('ok'); return; } catch (e2) { /* fall through */ }
          }
          if (code === 'invalid_argument' || code === 'permission-denied') { readonly = true; sent(key, n); setStatus('ro'); } else setStatus('err'); // refused for good: not kept
        }
      });
      return queue;
    }
    return {
      load, attach, detach, addProgram, dropProgram, deleteProgress, programIds: () => programIds.slice(), toggle, doAgain, removeMark, replaceAll, setSwaps, setShort, startRound, setDoc, deleteDoc, replaceDocs,
      doc: (c, id) => (known(c) && account[c][id] ? JSON.parse(JSON.stringify(account[c][id])) : null),
      docs: (c) => JSON.parse(JSON.stringify(account[known(c)])),
      round: (pid) => P.round(of(pid)),
      entries: (pid) => P.entries(pid, of(pid)),
      progress: (pid) => P.fromDoc(of(pid)), // a copy
      swaps: (pid) => of(pid).swaps.map((x) => ({ ...x })),
      isDone: (pid, day) => P.isDone(of(pid), day),
      isShort: (pid, day) => P.isShort(of(pid), day),
      marks: (pid, day) => P.marks(of(pid), day), // a day's dates in the current round, oldest first (Phase 30)
      againOf: (pid) => JSON.parse(JSON.stringify(of(pid).again || {})),
      shortOf: (pid, round) => P.shortOfRound(of(pid), round === undefined ? P.round(of(pid)) : round),
      count: (pid) => P.count(of(pid)),
      days: (pid) => ({ ...of(pid).done }),
      setAuth(a) { auth = a; setStatus(remote ? status : 'signin'); },
      online() { if (status === 'offline') setStatus('saving'); retryOutbox(); },
      waiting: changes, // changes not confirmed by the cloud yet (Phase 12)
      on(ev, fn) { listeners[ev].push(fn); return () => { listeners[ev] = listeners[ev].filter((f) => f !== fn); }; },
      flush: () => Promise.all([queue, docQueue]).then(() => {}),
      get auth() { return auth; },
      get remote() { return remote; },
      get status() { return status; },
      get readonly() { return readonly; },
    };
  }

  // In-memory remote adapter: behaves like Firestore for one account: whole documents per collection (tests).
  // `initial`: the progress documents { pid: doc }, also `remote.docs`; `collections`: the account data { collection: { id: doc } }.
  function createMemoryRemote(initial = {}, { failWith, collections = {} } = {}) {
    const clone = (x) => JSON.parse(JSON.stringify(x));
    const all = { progress: clone(initial), ...Object.fromEntries(D.COLLECTIONS.map((c) => [c, clone(collections[c] || {})])) };
    const subs = {}, listSubs = {};
    const snapshot = (col, id) => (all[col][id] ? clone(all[col][id]) : null);
    const notify = (col, id) => {
      (subs[col + '/' + id] || []).forEach((f) => f(snapshot(col, id)));
      (listSubs[col] || []).forEach((f) => f(clone(all[col])));
    };
    const fail = () => { if (failWith) { const e = new Error(failWith); e.code = failWith; throw e; } };
    return {
      kind: 'memory', docs: all.progress, collections: all,
      subscribe(col, id, onData) {
        const key = col + '/' + id;
        (subs[key] = subs[key] || []).push(onData);
        Promise.resolve().then(() => onData(snapshot(col, id)));
        return () => { subs[key] = subs[key].filter((f) => f !== onData); };
      },
      subscribeAll(col, onDocs) {
        (listSubs[col] = listSubs[col] || []).push(onDocs);
        Promise.resolve().then(() => onDocs(clone(all[col])));
        return () => { listSubs[col] = listSubs[col].filter((f) => f !== onDocs); };
      },
      async write(col, id, doc) { fail(); all[col][id] = clone(doc); notify(col, id); },
      async remove(col, id) { fail(); delete all[col][id]; notify(col, id); },
    };
  }

  const api = { createStore, createMemoryRemote };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBStore = api;
})(typeof window !== 'undefined' ? window : globalThis, typeof module !== 'undefined' && module.exports ? require('./progress.js') : window.KBProgress, typeof module !== 'undefined' && module.exports ? require('./docs.js') : window.KBDocs);
