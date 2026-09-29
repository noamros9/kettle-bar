/* Main: wires the Progress Store, the Workout Session and the clock to the page, then boots. */

/* ---------------- progress store + sync ---------------- */
const localStore = {
  get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* blocked: device copy is best effort */ } },
  remove: (k) => { try { localStorage.removeItem(k); } catch (e) { /* blocked */ } },
};
const store = KBStore.createStore({ programIds: programs.ids(), storage: localStore, isOnline: () => navigator.onLine !== false });
// a day as you'll do it: swaps applied, its live Workout Session, swap / undo (app/day.js)
// your own programs: the store's programs docs -> the catalogue's 'own' source (built from their stored configs),
// and the catalogue's own ids -> the store (app/own.js)
const ownLink = KBOwn.link({ store, programs, load: loadBook, build: KBBuilder.build, ex: KBEx });
const days = KBDay.createDays({ programs, store, cat: KBEx, createSession: KBSession.createSession, storage: localStore });
const SYNC_TEXT = { ok: 'Synced', saving: 'Saving…', offline: 'Offline, will sync', local: 'Saved on this device', signin: 'Sign in', ro: 'View only', err: 'Sync problem' };
function paintSync(s) {
  const el = $('#sync'); el.dataset.s = s;
  const who = s === 'ok' && store.remote && store.remote.account ? ' · ' + store.remote.account.name : '';
  $('span', el).textContent = (SYNC_TEXT[s] || '') + who;
  el.disabled = !store.auth;
  el.title = s === 'signin' ? 'Sign in with Google to sync your progress across devices' : '';
}
store.on('status', paintSync);
store.on('change', () => rerender());
programs.onChange(() => rerender()); // your programs changed (here or synced from another device): redraw the page
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
const openDay = () => days.open(prog().id, route.day);
const openSession = () => openDay().session();
function finish(target) { T.apply(openSession().complete(target)); rerender(); }
// the workout clock starts with the first tick or Start; the day's session keeps that time
function startClock() { S.start(); const ses = openSession(); if (ses.started() === null) ses.setStarted(S.startAt); }
function tick(target) {
  T.unlockAudio(); startClock();
  const ins = openSession().complete(target);
  if (!ins.none) { T.clear(); T.apply(ins); }
  rerender();
}
function runPlanned(target, withClock = true) {
  const ses = openSession(), plan = ses.plan(target);
  if (!plan) return;
  T.unlockAudio(); if (withClock) startClock();
  T.runPlan(plan, () => finish(plan.then));
}

// resetting the workout clock forgets when this day's workout started (or the page would bring it back)
$('#sessreset').addEventListener('click', () => { if (route.view === 'day') openSession().setStarted(null); });

document.addEventListener('click', (ev) => {
  const el = ev.target.closest('button'); if (!el) return;
  const d = el.dataset;
  if (el.id === 'brand') return go('today'); // home: the next day in the program of your last done workout (as the shortcut)
  if (d.go === 'programs') return go('programs');
  if (d.go === 'build') { if (buildState && buildState.editId) buildState = null; return go('build'); } // "Build your own" starts fresh, not from an edit
  if (d.bCancel) { const pid = buildState && buildState.editId ? KBOwn.pidOf(buildState.editId) : null; buildState = null; return go(pid && programs.has(pid) ? 'p-' + pid : 'programs'); }
  if (d.ownRename) { ownState = { pid: prog().id, mode: 'rename', text: prog().name, error: null }; render(); const i = $('#own-name'); if (i) { i.focus(); i.select(); } return; }
  if (d.ownCancel) { ownState = null; render(); return; }
  if (d.ownEdit) return ownEdit(prog().id);
  if (d.ownDelete) { ownState = { pid: prog().id, mode: 'delete' }; render(); return; }
  if (d.ownDeleteConfirm) return ownDelete(ownState.pid);
  if (d.b) { const [k, v] = d.b.split(':'); return buildSet(k, v); }
  if (d.bsub) return buildSet('subject', d.bsub);
  if (d.bRegen) return buildRegenerate();
  if (d.bSave) return buildSave();
  if (d.bookRetry) { bookError = null; render(); return; }
  if (d.go === 'library') return go('exercises');
  if (d.go === 'settings') return go('settings');
  if (d.go === 'stats') return go('stats');
  if (d.backup) return backupAction(d.backup);
  if (d.roundStart) { roundState = { pid: prog().id }; rerender(); return; }
  if (d.roundCancel) { roundState = null; rerender(); return; }
  if (d.roundConfirm) {
    const pid = roundState.pid, onward = KBProgress.onwardSwaps(store.progress(pid));
    const keep = onward.filter((_, i) => { const box = document.querySelector(`[data-keep="${i}"]`); return box && box.checked; });
    roundState = null; store.startRound(pid, keep); window.scrollTo(0, 0); return;
  }
  if (d.retry) { delete loadFailures[d.retry]; render(); return; }
  if (d.statSpan) { statsView.span = d.statSpan; render(); return; }
  if (d.swap) { const [bi, i] = d.swap.split(':').map(Number); swapState = { key: prog().id + ':' + route.day, bi, i }; rerender(); return; }
  if (d.swapTo) { swapState.to = d.swapTo; rerender(); return; }
  if (d.swapBack) { delete swapState.to; rerender(); return; }
  if (d.swapCancel) { swapState = null; rerender(); return; }
  if (d.unswap) { const [bi, i] = d.unswap.split(':').map(Number); openDay().undo(bi, i); return; }
  if (d.swapApply) { const { bi, i, to } = swapState; swapState = null; openDay().swap(bi, i, to, { onward: d.swapApply === 'onward' }); return; }
  if (d.go === 'program') return go('p-' + prog().id);
  if (d.openProg) return go('p-' + d.openProg);
  if (d.lenMenu) { toggleLengthMenu(); render(); return; }
  if (d.filter) { const [k, v] = d.filter.split(':'); setFilter(k, v); render(); return; }
  if (d.toggle) { days.forget(prog().id, +d.toggle); store.toggle(prog().id, +d.toggle); return; } // marked or un-marked: the saved session is done with
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
  const rounds = Object.fromEntries(programs.ids().map((pid) => [pid, store.progress(pid).past]));
  download(KBBackup.fileName(new Date()), JSON.stringify(KBBackup.exportProgress(allDone(), { swaps: allSwaps(), rounds, ownPrograms: store.docs('programs'), random: store.docs('random'), prefs: store.docs('prefs') }), null, 2));
}

const allDone = () => Object.fromEntries(programs.ids().map((pid) => [pid, store.days(pid)]));
const allSwaps = () => Object.fromEntries(programs.ids().map((pid) => [pid, store.swaps(pid)]));
const showImport = (st) => { importState = st; render(); };
const allDocs = () => Object.fromEntries(KBDocs.COLLECTIONS.map((c) => [c, store.docs(c)]));
const allProgress = () => Object.fromEntries(programs.ids().map((pid) => [pid, store.progress(pid)]));
async function readImport(file) {
  try {
    showImport(KBBackup.planImport(allProgress(), await file.text(), { known: programs.ids(), uid: store.remote && store.remote.account && store.remote.account.uid, name: file.name, docs: allDocs() }));
  } catch (e) { showImport({ error: e.message }); }
}
function backupAction(what) {
  const plan = importState;
  if (what === 'export') return exportProgress();
  if (what === 'import') { $('#import-file').value = ''; return $('#import-file').click(); }
  if (what === 'cancel') return showImport(null);
  store.replaceAll(plan.result(what));
  const docs = plan.docsResult(what); // own programs, random workouts, preferences: only what the file has
  KBDocs.COLLECTIONS.forEach((c) => { if (docs[c]) store.replaceDocs(c, docs[c]); });
  showImport({ done: plan.message(what) });
}
document.addEventListener('change', (e) => {
  if (e.target.dataset.blever) buildSet('lever', `${e.target.dataset.blever}=${e.target.value}`);
  if (e.target.dataset.bfmt) buildSet('format', e.target.dataset.bfmt);
  if (e.target.id === 'import-file' && e.target.files[0]) readImport(e.target.files[0]);
  if (e.target.id === 'stats-scope') { statsView.pid = e.target.value; statsView.round = undefined; render(); }
  if (e.target.id === 'stats-round') { statsView.round = e.target.value === 'all' ? undefined : +e.target.value; render(); }
  if (e.target.id === 'voice-toggle') { try { localStorage.setItem('kb-voice', e.target.checked ? 'on' : 'off'); } catch (err) { /* blocked: stays on */ } }
});

document.addEventListener('input', (e) => {
  if (e.target.id === 'b-name') buildState.name = e.target.value;
  if (e.target.id === 'own-name') ownState.text = e.target.value;
});
document.addEventListener('submit', (e) => { if (e.target.dataset.ownForm) { e.preventDefault(); ownRenameSave(); } });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && e.target.id === 'own-name') { ownState = null; render(); } });

/* ---------------- your programs: rename, edit, delete ---------------- */
function ownRenameSave() {
  const id = ownIdOf(ownState.pid), record = store.doc('programs', id), text = ownState.text, problem = KBOwn.checkName(text);
  if (problem) { ownState.error = problem; render(); const i = $('#own-name'); if (i) i.focus(); return; }
  ownState = null;
  if (record) store.setDoc('programs', id, KBOwn.renamed(record, text, new Date().toISOString())); // the catalogue follows at once
  render();
}
// the builder opens with the program's own choices, seed and name; Save updates the same record
function ownEdit(pid) {
  const id = ownIdOf(pid), e = KBOwn.fromRecord(id, store.doc('programs', id));
  buildState = { c: e.choices, seed: e.seed, name: e.name, editId: id };
  go('build');
}
// the program and its progress (device and cloud); other devices drop it when its doc disappears
function ownDelete(pid) {
  ownState = null;
  store.deleteProgress(pid);
  store.deleteDoc('programs', ownIdOf(pid));
  go('programs');
}

/* ---------------- boot ---------------- */
store.load(); // before the route: #today needs your progress
function start() {
  route = parseHash();
  render();
  // then every program, quietly, for offline use: the open one and the ones with progress first
  programs.loadEverything([route.pid, ...programs.ids().filter((pid) => store.count(pid) > 0)], () => {}).then(() => Promise.all([programs.loadUsage(), fetchBuildFiles()])).catch(() => {});
}
ownLink.refresh(); // your own programs are built from their stored configs: no recipe book, no wait
start();
T.paint();
if (!store.remote) paintSync(store.auth ? 'signin' : 'local');
