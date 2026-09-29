/* Progress Store: each program's Program Progress (done days and exercise swaps), and the account's other synced
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
   Device copy of a doc: kb-doc-<collection>-<id>, with the ids of a collection in kb-docs-<collection>.
   A refused or failed account-data write never changes the sync status or makes progress view-only: progress must
   keep working when the rules for the new collections are not published yet. The doc stays on the device and goes
   up at the next first sync.
   Adapters: Firebase (firebase-sync.js), in-memory (tests).
   The store never touches the page: it emits 'change' (pid), 'docs' (collection) and 'status' (ok | saving |
   offline | local | signin | ro | err) events. storage = { get, set, remove? } (a device without remove clears
   the text instead). */
(function (root, P, D) {
  function createStore({ programIds, storage, now = () => new Date().toISOString(), isOnline = () => true, retryDelay = () => 600 + Math.random() * 800 }) {
    const listeners = { change: [], status: [], docs: [] };
    const emit = (ev, x) => listeners[ev].forEach((f) => f(x));
    const progress = {};
    let remote = null, unsubs = [], seen = {}, docSeen = {}, queue = Promise.resolve(), docQueue = Promise.resolve(), readonly = false, auth = null, status = 'local';
    const keys = (pid) => ({ done: 'kb-progress-' + pid, swaps: 'kb-swaps-' + pid, past: 'kb-past-' + pid });
    const setStatus = (s) => { status = s; emit('status', s); };
    const of = (pid) => progress[pid] || P.empty();

    // account data: { collection: { id: body } }; pending: writes not finished yet, per 'collection/id'
    const pending = {};
    const account = Object.fromEntries(D.COLLECTIONS.map((c) => [c, {}]));
    const docKey = (c, id) => 'kb-doc-' + c + '-' + id, indexKey = (c) => 'kb-docs-' + c;
    const known = (c) => { if (!D.COLLECTIONS.includes(c)) throw new Error('Unknown collection ' + c); return c; };
    const read = (key) => { try { return storage.get(key); } catch (e) { return null; } };
    const parseDoc = (text) => { try { const b = JSON.parse(text); return b && typeof b === 'object' && !Array.isArray(b) ? b : null; } catch (e) { return null; } };

    function load() {
      programIds.forEach((pid) => {
        const k = keys(pid);
        progress[pid] = P.fromDevice({ done: read(k.done), swaps: read(k.swaps), past: read(k.past) });
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
    }
    function saveDoc(c, id) { try { storage.set(docKey(c, id), JSON.stringify(account[c][id])); } catch (e) { /* device copy is best effort */ } }
    function forgetDoc(c, id) { try { if (storage.remove) storage.remove(docKey(c, id)); else storage.set(docKey(c, id), ''); } catch (e) { /* as above */ } }
    function saveIndex(c) { try { storage.set(indexKey(c), JSON.stringify(Object.keys(account[c]).sort())); } catch (e) { /* as above */ } }
    // a new value for one program: device copy, cloud (when signed in and allowed), change event
    function set(pid, value) {
      progress[pid] = value; save(pid);
      if (remote && !readonly) write(pid);
      emit('change', pid);
    }

    function attach(r) {
      detach(true);
      remote = r; seen = {}; readonly = false; setStatus('ok');
      docSeen = {};
      programIds.forEach((pid) => {
        unsubs.push(r.subscribe('progress', pid, (doc) => onRemote(pid, P.fromDoc(doc)), (e) => { if (typeof console !== 'undefined') console.warn('sync error', e); setStatus('err'); }));
      });
      // account data: an error here (e.g. the rules for the new collections are not published) is not a sync problem for progress
      if (r.subscribeAll) D.COLLECTIONS.forEach((c) => unsubs.push(r.subscribeAll(c, (docs) => onDocs(c, docs), (e) => console.warn('sync error (' + c + ')', e))));
    }
    function detach(silent) {
      unsubs.forEach((u) => { try { u(); } catch (e) { /* already gone */ } });
      unsubs = []; remote = null;
      if (!silent) setStatus(auth ? 'signin' : 'local');
    }
    function onRemote(pid, cloud) {
      if (!seen[pid]) {
        seen[pid] = true;
        const { merged, changed } = P.mergeFirstSync(of(pid), cloud);
        progress[pid] = merged; save(pid);
        if (changed) write(pid);
      } else {
        progress[pid] = cloud || P.empty(); save(pid);
      }
      emit('change', pid);
    }
    function onDocs(c, cloud) {
      const prev = Object.keys(account[c]);
      if (!docSeen[c]) {
        docSeen[c] = true;
        const { merged, push } = D.mergeFirstSync(account[c], cloud);
        account[c] = merged; saveAll(c, prev);
        push.forEach((id) => writeDoc(c, id));
      } else { // the cloud's set, except docs with a write still on its way: those stay as they are here
        const next = D.mergeFirstSync({}, cloud).merged;
        Object.keys(pending).filter((k) => pending[k] > 0 && k.startsWith(c + '/')).map((k) => k.slice(c.length + 1)).forEach((id) => {
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
    function writeDoc(c, id) {
      const r = remote; if (!r) return docQueue;
      const k = c + '/' + id;
      pending[k] = (pending[k] || 0) + 1;
      docQueue = docQueue.then(async () => {
        try { if (account[c][id]) await r.write(c, id, account[c][id]); else await r.remove(c, id); }
        catch (e) { console.warn('account data not saved to the cloud (' + c + ')', e); }
        finally { pending[k]--; }
      });
      return docQueue;
    }
    const put = (c, id, body) => { account[c][id] = body; saveDoc(c, id); saveIndex(c); if (remote) writeDoc(c, id); };
    function drop(c, id) { delete account[c][id]; forgetDoc(c, id); saveIndex(c); if (remote) writeDoc(c, id); }
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
    const toggle = (pid, day) => set(pid, P.toggle(of(pid), day, now()));
    const setSwaps = (pid, list) => set(pid, P.withSwaps(of(pid), list));
    // a new round: the current one is kept as it was; `keep` = the onward swaps to carry over
    const startRound = (pid, keep) => set(pid, P.startRound(of(pid), now(), keep));
    // set whole programs at once (an import): { pid: Program Progress }; one write per program
    function replaceAll(values) {
      Object.entries(values).forEach(([pid, v]) => set(pid, P.fromDoc(v))); // fromDoc fills in what a value leaves out
      return queue;
    }
    function write(pid) {
      const r = remote; if (!r) return queue;
      setStatus(isOnline() ? 'saving' : 'offline');
      queue = queue.then(async () => {
        const doc = P.toDoc(of(pid), now());
        try { await r.write('progress', pid, doc); if (remote === r) setStatus('ok'); }
        catch (e) {
          const code = e && e.code;
          if (code === 'unavailable') {
            await new Promise((res) => setTimeout(res, retryDelay()));
            try { await r.write('progress', pid, doc); setStatus('ok'); return; } catch (e2) { /* fall through */ }
          }
          if (code === 'invalid_argument' || code === 'permission-denied') { readonly = true; setStatus('ro'); } else setStatus('err');
        }
      });
      return queue;
    }
    return {
      load, attach, detach, toggle, replaceAll, setSwaps, startRound, setDoc, deleteDoc, replaceDocs,
      doc: (c, id) => (known(c) && account[c][id] ? JSON.parse(JSON.stringify(account[c][id])) : null),
      docs: (c) => JSON.parse(JSON.stringify(account[known(c)])),
      round: (pid) => P.round(of(pid)),
      entries: (pid) => P.entries(pid, of(pid)),
      progress: (pid) => P.fromDoc(of(pid)), // a copy
      swaps: (pid) => of(pid).swaps.map((x) => ({ ...x })),
      isDone: (pid, day) => P.isDone(of(pid), day),
      count: (pid) => P.count(of(pid)),
      days: (pid) => ({ ...of(pid).done }),
      setAuth(a) { auth = a; setStatus(remote ? status : 'signin'); },
      online() { if (status === 'offline') setStatus('saving'); },
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
