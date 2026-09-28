/* Main: wires the Progress Store, the Workout Session and the clock to the page, then boots. */

/* ---------------- progress store + sync ---------------- */
const localStore = {
  get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* blocked: device copy is best effort */ } },
};
const store = KBStore.createStore({ programIds: PROGRAMS.map((p) => p.id), storage: localStore, isOnline: () => navigator.onLine !== false });
const SYNC_TEXT = { ok: 'Synced', saving: 'Saving…', offline: 'Offline, will sync', local: 'Saved on this device', signin: 'Sign in to sync', ro: 'View only', err: 'Sync problem' };
function paintSync(s) {
  const el = $('#sync'); el.dataset.s = s;
  const who = s === 'ok' && store.remote && store.remote.account ? ' · ' + store.remote.account.name : '';
  $('span', el).textContent = (SYNC_TEXT[s] || '') + who;
  el.disabled = !store.auth;
  el.title = s === 'signin' ? 'Sign in with Google to sync your progress across devices' : '';
}
store.on('status', paintSync);
store.on('change', () => rerender());
window.addEventListener('online', () => store.online());
// hooks for the Firebase module (GitHub Pages build)
window.kbSync = { attach: (r) => store.attach(r), detach: () => store.detach(), setAuth: (a) => store.setAuth(a) };
$('#sync').addEventListener('click', (e) => {
  e.stopPropagation();
  const a = store.auth; if (!a) return;
  if (!store.remote) { a.signIn(); return; }
  const pop = $('#acct'); pop.hidden = !pop.hidden;
  if (!pop.hidden) $('#acctwho').textContent = (store.remote.account && store.remote.account.email) || 'Signed in';
});
document.addEventListener('click', (e) => { const pop = $('#acct'); if (!pop.hidden && !e.target.closest('#acct')) pop.hidden = true; });
$('#signout').addEventListener('click', () => { $('#acct').hidden = true; store.auth && store.auth.signOut(); });

/* ---------------- workout: page -> session -> clock ---------------- */
const openSession = () => sessionFor(prog(), dayOf(prog().id, route.day));
function finish(target) { T.apply(openSession().complete(target)); rerender(); }
function tick(target) {
  T.unlockAudio(); S.start();
  const ins = openSession().complete(target);
  if (!ins.none) { T.clear(); T.apply(ins); }
  rerender();
}
function runPlanned(target, startClock = true) {
  const ses = openSession(), plan = ses.plan(target);
  if (!plan) return;
  T.unlockAudio(); if (startClock) S.start();
  T.runPlan(plan, () => finish(plan.then));
}

document.addEventListener('click', (ev) => {
  const el = ev.target.closest('button'); if (!el) return;
  const d = el.dataset;
  if (el.id === 'brand') return go('programs');
  if (d.go === 'programs') return go('programs');
  if (d.go === 'library') return go('exercises');
  if (d.go === 'settings') return go('settings');
  if (d.go === 'stats') return go('stats');
  if (d.backup) return backupAction(d.backup);
  if (d.statSpan) { statsView.span = d.statSpan; render(); return; }
  if (d.swap) { const [bi, i] = d.swap.split(':').map(Number); swapState = { key: prog().id + ':' + route.day, bi, i }; rerender(); return; }
  if (d.swapTo) { swapState.to = d.swapTo; rerender(); return; }
  if (d.swapBack) { delete swapState.to; rerender(); return; }
  if (d.swapCancel) { swapState = null; rerender(); return; }
  if (d.unswap) { const p = prog(); store.setSwaps(p.id, KBSwaps.undoSwap(store.swaps(p.id), route.day, d.unswap)); return; }
  if (d.swapApply) {
    const p = prog(), w = dayOf(p.id, route.day), ex = w.blocks[swapState.bi].items[swapState.i].ex, to = swapState.to;
    swapState = null;
    store.setSwaps(p.id, [...store.swaps(p.id), { day: route.day, ex, to, ...(d.swapApply === 'onward' ? { onward: true } : {}) }]);
    return;
  }
  if (d.go === 'program') return go('p-' + prog().id);
  if (d.openProg) return go('p-' + d.openProg);
  if (d.filter) { const [k, v] = d.filter.split(':'); filters[k] = v; render(); return; }
  if (d.toggle) { store.toggle(prog().id, +d.toggle); return; }
  if (d.day) { const n = +d.day; if (n >= 1 && n <= prog().days.length) go(dayHash(prog().id, n)); return; }
  if (d.pip) { const [bi, i, k] = d.pip.split(':').map(Number); return tick({ type: 'set', bi, i, k }); }
  if (d.rpip) {
    const parts = d.rpip.split(':').map(Number);
    return parts.length === 3 ? tick({ type: 'pair', bi: parts[0], pi: parts[1], k: parts[2] }) : tick({ type: 'round', bi: parts[0], k: parts[1] });
  }
  if (d.work) { const [bi, i] = d.work.split(':').map(Number); return runPlanned({ type: 'hold', bi, i }); }
  if (d.run) return runPlanned({ type: 'block', bi: +d.run });
  if (d.count) { const [bi, delta] = d.count.split(':').map(Number); openSession().count(bi, delta); rerender(); return; }
  if (d.ex) { navDepth++; return go('ex-' + d.ex); }
  if (d.back) { if (navDepth > 0) { navDepth--; history.back(); } else go('exercises'); return; }
  if (d.stretch) return runPlanned({ type: 'stretch', key: d.stretch }, d.stretch === 'warm');
});

/* ---------------- settings: backup ---------------- */
function download(name, text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function exportProgress() {
  download(KBBackup.fileName(new Date()), JSON.stringify(KBBackup.exportProgress(allDone()), null, 2));
}

const allDone = () => Object.fromEntries(PROGRAMS.map((p) => [p.id, store.days(p.id)]));
const showImport = (st) => { importState = st; render(); };
async function readImport(file) {
  try {
    const { programs, unknown } = KBBackup.parseBackup(await file.text(), { known: PROGRAMS.map((p) => p.id), uid: store.remote && store.remote.account && store.remote.account.uid });
    showImport({ name: file.name, programs, unknown, diff: KBBackup.diffProgress(allDone(), programs) });
  } catch (e) { showImport({ error: e.message }); }
}
function backupAction(what) {
  const st = importState;
  if (what === 'export') return exportProgress();
  if (what === 'import') { $('#import-file').value = ''; return $('#import-file').click(); }
  if (what === 'cancel') return showImport(null);
  const ids = Object.keys(st.diff);
  const added = ids.reduce((a, pid) => a + st.diff[pid].added.length, 0);
  const removed = ids.reduce((a, pid) => a + st.diff[pid].removed.length, 0);
  store.replaceAll(KBBackup.applyImport(allDone(), st.programs, what));
  showImport({ done: what === 'merge' ? `Merged: ${added} day${added === 1 ? '' : 's'} added.` : `Replaced: ${added} day${added === 1 ? '' : 's'} added, ${removed} removed.` });
}
document.addEventListener('change', (e) => {
  if (e.target.id === 'import-file' && e.target.files[0]) readImport(e.target.files[0]);
  if (e.target.id === 'stats-scope') { statsView.pid = e.target.value; render(); }
  if (e.target.id === 'voice-toggle') { try { localStorage.setItem('kb-voice', e.target.checked ? 'on' : 'off'); } catch (err) { /* blocked: stays on */ } }
});

/* ---------------- boot ---------------- */
route = parseHash();
store.load();
render();
T.paint();
if (!store.remote) paintSync(store.auth ? 'signin' : 'local');
