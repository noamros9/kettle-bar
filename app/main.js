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
const openSession = () => sessionFor(prog(), prog().days[route.day - 1]);
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

/* ---------------- boot ---------------- */
route = parseHash();
store.load();
render();
T.paint();
if (!store.remote) paintSync(store.auth ? 'signin' : 'local');
