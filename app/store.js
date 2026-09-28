/* Progress Store: which days are done in each program.
   Always keeps a device copy (storage adapter). A remote adapter can be attached for sync:
     remote = { kind, account?, subscribe(pid, onData, onErr) -> unsubscribe, write(pid, body) -> Promise }
   Adapters: Firebase (firebase-sync.js), in-memory (tests).
   The store never touches the page: it emits 'change' (pid) and 'status' (ok | saving | offline |
   local | signin | ro | err) events. */
(function (root) {
  // First contact with the cloud: keep every day ticked on either side, earliest time wins.
  function mergeFirstSync(local, remote) {
    const merged = { ...(remote || {}) };
    Object.entries(local || {}).forEach(([d, t]) => { if (!merged[d] || t < merged[d]) merged[d] = t; });
    return merged;
  }

  function createStore({ programIds, storage, now = () => new Date().toISOString(), isOnline = () => true, retryDelay = () => 600 + Math.random() * 800 }) {
    const listeners = { change: [], status: [] };
    const emit = (ev, x) => listeners[ev].forEach((f) => f(x));
    const done = {};
    let remote = null, unsubs = [], seen = {}, queue = Promise.resolve(), readonly = false, auth = null, status = 'local';
    const key = (pid) => 'kb-progress-' + pid;
    const setStatus = (s) => { status = s; emit('status', s); };

    function load() {
      programIds.forEach((pid) => { try { done[pid] = JSON.parse(storage.get(key(pid)) || '{}') || {}; } catch (e) { done[pid] = {}; } });
    }
    function save(pid) { try { storage.set(key(pid), JSON.stringify(done[pid])); } catch (e) { /* storage full or blocked: keep going */ } }

    function attach(r) {
      detach(true);
      remote = r; seen = {}; readonly = false; setStatus('ok');
      programIds.forEach((pid) => {
        unsubs.push(r.subscribe(pid, (data) => onRemote(pid, data), (e) => { if (typeof console !== 'undefined') console.warn('sync error', e); setStatus('err'); }));
      });
    }
    function detach(silent) {
      unsubs.forEach((u) => { try { u(); } catch (e) { /* already gone */ } });
      unsubs = []; remote = null;
      if (!silent) setStatus(auth ? 'signin' : 'local');
    }
    function onRemote(pid, r) {
      if (!seen[pid]) {
        seen[pid] = true;
        const merged = mergeFirstSync(done[pid], r);
        done[pid] = merged; save(pid);
        if (!r || Object.keys(merged).length !== Object.keys(r).length) write(pid);
      } else {
        done[pid] = { ...(r || {}) }; save(pid);
      }
      emit('change', pid);
    }
    function toggle(pid, day) {
      const d = { ...(done[pid] || {}) };
      if (d[day]) delete d[day]; else d[day] = now();
      done[pid] = d; save(pid);
      if (remote && !readonly) write(pid);
      emit('change', pid);
    }
    function write(pid) {
      const r = remote; if (!r) return queue;
      setStatus(isOnline() ? 'saving' : 'offline');
      queue = queue.then(async () => {
        const body = { done: { ...(done[pid] || {}) }, updatedAt: now() };
        try { await r.write(pid, body); if (remote === r) setStatus('ok'); }
        catch (e) {
          const code = e && e.code;
          if (code === 'unavailable') {
            await new Promise((res) => setTimeout(res, retryDelay()));
            try { await r.write(pid, body); setStatus('ok'); return; } catch (e2) { /* fall through */ }
          }
          if (code === 'invalid_argument' || code === 'permission-denied') { readonly = true; setStatus('ro'); } else setStatus('err');
        }
      });
      return queue;
    }
    return {
      load, attach, detach, toggle,
      isDone: (pid, day) => !!(done[pid] || {})[day],
      count: (pid) => Object.keys(done[pid] || {}).length,
      days: (pid) => ({ ...(done[pid] || {}) }),
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

  // In-memory remote adapter: behaves like Firestore for one account (tests, local debugging).
  function createMemoryRemote(initial = {}, { failWith } = {}) {
    const docs = JSON.parse(JSON.stringify(initial));
    const subs = {};
    const push = (pid) => (subs[pid] || []).forEach((f) => f(docs[pid] ? { ...docs[pid] } : null));
    return {
      kind: 'memory', docs,
      subscribe(pid, onData) {
        (subs[pid] = subs[pid] || []).push(onData);
        Promise.resolve().then(() => onData(docs[pid] ? { ...docs[pid] } : null));
        return () => { subs[pid] = subs[pid].filter((f) => f !== onData); };
      },
      async write(pid, body) {
        if (failWith) { const e = new Error(failWith); e.code = failWith; throw e; }
        docs[pid] = { ...body.done }; push(pid);
      },
    };
  }

  const api = { createStore, createMemoryRemote, mergeFirstSync };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBStore = api;
})(typeof window !== 'undefined' ? window : globalThis);
