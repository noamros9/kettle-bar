/* Progress Store: each program's Program Progress (done days and exercise swaps), kept in sync.
   Always keeps a device copy (storage adapter). A remote adapter can be attached for sync:
     remote = { kind, account?, subscribe(pid, onData(doc | null), onErr) -> unsubscribe, write(pid, doc) -> Promise }
   One cloud document per program; its shape belongs to Program Progress (app/progress.js), and every write
   sends the whole value, so a tick never wipes a swap.
   Adapters: Firebase (firebase-sync.js), in-memory (tests).
   The store never touches the page: it emits 'change' (pid) and 'status' (ok | saving | offline |
   local | signin | ro | err) events. */
(function (root, P) {
  function createStore({ programIds, storage, now = () => new Date().toISOString(), isOnline = () => true, retryDelay = () => 600 + Math.random() * 800 }) {
    const listeners = { change: [], status: [] };
    const emit = (ev, x) => listeners[ev].forEach((f) => f(x));
    const progress = {};
    let remote = null, unsubs = [], seen = {}, queue = Promise.resolve(), readonly = false, auth = null, status = 'local';
    const keys = (pid) => ({ done: 'kb-progress-' + pid, swaps: 'kb-swaps-' + pid });
    const setStatus = (s) => { status = s; emit('status', s); };
    const of = (pid) => progress[pid] || P.empty();

    function load() {
      programIds.forEach((pid) => {
        const k = keys(pid);
        const read = (key) => { try { return storage.get(key); } catch (e) { return null; } };
        progress[pid] = P.fromDevice({ done: read(k.done), swaps: read(k.swaps) });
      });
    }
    function save(pid) {
      const k = keys(pid), text = P.toDevice(progress[pid]);
      try { storage.set(k.done, text.done); storage.set(k.swaps, text.swaps); } catch (e) { /* storage full or blocked: keep going */ }
    }
    // a new value for one program: device copy, cloud (when signed in and allowed), change event
    function set(pid, value) {
      progress[pid] = value; save(pid);
      if (remote && !readonly) write(pid);
      emit('change', pid);
    }

    function attach(r) {
      detach(true);
      remote = r; seen = {}; readonly = false; setStatus('ok');
      programIds.forEach((pid) => {
        unsubs.push(r.subscribe(pid, (doc) => onRemote(pid, P.fromDoc(doc)), (e) => { if (typeof console !== 'undefined') console.warn('sync error', e); setStatus('err'); }));
      });
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
    const toggle = (pid, day) => set(pid, P.toggle(of(pid), day, now()));
    const setSwaps = (pid, list) => set(pid, P.withSwaps(of(pid), list));
    // set whole programs at once (an import): done days, and swaps where given (otherwise it keeps its own)
    function replaceAll(programs, swaps = {}) {
      Object.entries(programs).forEach(([pid, days]) => set(pid, { done: { ...days }, swaps: (swaps[pid] || of(pid).swaps).map((x) => ({ ...x })) }));
      return queue;
    }
    function write(pid) {
      const r = remote; if (!r) return queue;
      setStatus(isOnline() ? 'saving' : 'offline');
      queue = queue.then(async () => {
        const doc = P.toDoc(of(pid), now());
        try { await r.write(pid, doc); if (remote === r) setStatus('ok'); }
        catch (e) {
          const code = e && e.code;
          if (code === 'unavailable') {
            await new Promise((res) => setTimeout(res, retryDelay()));
            try { await r.write(pid, doc); setStatus('ok'); return; } catch (e2) { /* fall through */ }
          }
          if (code === 'invalid_argument' || code === 'permission-denied') { readonly = true; setStatus('ro'); } else setStatus('err');
        }
      });
      return queue;
    }
    return {
      load, attach, detach, toggle, replaceAll, setSwaps,
      progress: (pid) => { const v = of(pid); return { done: { ...v.done }, swaps: v.swaps.map((x) => ({ ...x })) }; },
      swaps: (pid) => of(pid).swaps.map((x) => ({ ...x })),
      isDone: (pid, day) => P.isDone(of(pid), day),
      count: (pid) => P.count(of(pid)),
      days: (pid) => ({ ...of(pid).done }),
      setAuth(a) { auth = a; setStatus(remote ? status : 'signin'); },
      online() { if (status === 'offline') setStatus('saving'); },
      on(ev, fn) { listeners[ev].push(fn); return () => { listeners[ev] = listeners[ev].filter((f) => f !== fn); }; },
      flush: () => queue,
      get auth() { return auth; },
      get remote() { return remote; },
      get status() { return status; },
      get readonly() { return readonly; },
    };
  }

  // In-memory remote adapter: behaves like Firestore for one account: whole documents per program (tests).
  function createMemoryRemote(initial = {}, { failWith } = {}) {
    const docs = JSON.parse(JSON.stringify(initial));
    const subs = {};
    const snapshot = (pid) => (docs[pid] ? JSON.parse(JSON.stringify(docs[pid])) : null);
    return {
      kind: 'memory', docs,
      subscribe(pid, onData) {
        (subs[pid] = subs[pid] || []).push(onData);
        Promise.resolve().then(() => onData(snapshot(pid)));
        return () => { subs[pid] = subs[pid].filter((f) => f !== onData); };
      },
      async write(pid, doc) {
        if (failWith) { const e = new Error(failWith); e.code = failWith; throw e; }
        docs[pid] = JSON.parse(JSON.stringify(doc));
        (subs[pid] || []).forEach((f) => f(snapshot(pid)));
      },
    };
  }

  const api = { createStore, createMemoryRemote };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBStore = api;
})(typeof window !== 'undefined' ? window : globalThis, typeof module !== 'undefined' && module.exports ? require('./progress.js') : window.KBProgress);
