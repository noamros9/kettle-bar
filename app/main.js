/* Main: wires the Progress Store, the Workout Session and the clock to the page, then boots. */

/* ---------------- progress store + sync ---------------- */
const localStore = {
  get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* blocked: device copy is best effort */ } },
  remove: (k) => { try { localStorage.removeItem(k); } catch (e) { /* blocked */ } },
};
// the library's ids come with the page (the list itself loads at boot): progress is read and synced by program id from the start
const store = KBStore.createStore({ programIds: [...programs.ids(), ...KB_LIBRARY.ids], storage: localStore, isOnline: () => navigator.onLine !== false });
// a day as you'll do it: swaps applied, its live Workout Session, swap / undo (app/day.js)
// your own programs: the store's programs docs -> the catalogue's 'own' source (built from their stored configs),
// and the catalogue's own ids -> the store (app/own.js)
const ownLink = KBOwn.link({ store, programs, load: loadBook, build: KBBuilder.build, ex: KBEx });
const days = KBDay.createDays({ programs, store, cat: KBEx, createSession: KBSession.createSession, storage: localStore, travel: () => travelMode(), skip: () => skipList() });
// the random workout: the open one on the device, done ones in the account (app/random.js)
const random = KBRandom.createRandom({ store, cat: KBEx, createSession: KBSession.createSession, storage: localStore, skip: () => skipList() });
const SYNC_TEXT = { ok: 'Synced', saving: 'Saving…', offline: 'Offline, will sync', local: 'Saved on this device', signin: 'Sign in', ro: 'View only', err: 'Sync problem' };
// the header's sync status; with changes waiting for the account (Phase 12): "Offline · 2 changes waiting" (said in full
// to screen readers and on wide screens; a small count next to the dot on a phone)
function paintSync(s = store.status) {
  const el = $('#sync'); el.dataset.s = s;
  const n = store.waiting(), who = s === 'ok' && !n && store.remote && store.remote.account ? ' · ' + store.remote.account.name : '';
  const text = (SYNC_TEXT[s] || '').replace(/, will sync$/, '') + (n && s !== 'signin' && s !== 'local' ? ` · ${n} change${n === 1 ? '' : 's'} waiting` : '') + who;
  $('span', el).textContent = text;
  el.setAttribute('aria-label', text);
  const c = $('.wcount', el); c.hidden = !n || s === 'signin' || s === 'local'; c.textContent = c.hidden ? '' : n;
  el.disabled = !store.auth;
  el.title = s === 'signin' ? 'Sign in with Google to sync your progress across devices' : '';
  const w = $('#acctwait'); if (w) { w.hidden = !n; w.textContent = `${n} change${n === 1 ? ' is' : 's are'} saved on this phone and will reach your account when you're back online.`; }
}
store.on('status', paintSync);
store.on('outbox', () => paintSync());
window.addEventListener('offline', () => paintSync(store.remote ? 'offline' : store.status));
store.on('change', () => rerender());
store.on('docs', (c) => { if (c === 'random' || c === 'prefs') rerender(); }); // prefs: travel mode, favourites, hidden subjects, here or from another device // a random workout done here or on another device: stats and the week line
programs.onChange(() => rerender()); // your programs changed (here or synced from another device): redraw the page
window.addEventListener('online', () => store.online());
// hooks for the Firebase module (GitHub Pages build)
window.kbSync = { attach: (r) => store.attach(r), detach: () => store.detach(), setAuth: (a) => store.setAuth(a) };
$('#sync').addEventListener('click', (e) => {
  e.stopPropagation();
  const a = store.auth; if (!a) return;
  if (!store.remote && !store.waiting()) { a.signIn(); return; }
  const pop = $('#acct'); pop.hidden = !pop.hidden;
  if (!pop.hidden) $('#acctwho').textContent = (store.remote && store.remote.account && store.remote.account.email) || 'Signed in';
});
document.addEventListener('click', (e) => { const pop = $('#acct'); if (!pop.hidden && !e.target.closest('#acct')) pop.hidden = true; });
$('#signout').addEventListener('click', () => { $('#acct').hidden = true; store.auth && store.auth.signOut(); });

/* ---------------- workout: page -> session -> clock ---------------- */
const openDay = () => (route.view === 'random' ? random.open() : days.open(prog().id, route.day));
const openKey = () => (route.view === 'random' ? 'random:1' : prog().id + ':' + route.day); // the swap sheet's day
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
$('#sessreset').addEventListener('click', () => { if (route.view === 'day' || (route.view === 'random' && random.current())) openSession().setStarted(null); });

/* Button actions (architecture review IV ticket 2): a button names its action with a data attribute; this table maps each
   attribute to what it does, in the order they are tried (the first one a button carries wins). The click listener
   only dispatches; a phone test checks that every button the pages draw has an action here. */
const ACTIONS = [
  ['go', (v) => ({
    programs: () => go('programs'),
    build: () => { if (buildState && buildState.editId) buildState = null; go('build'); }, // "Build your own" starts fresh, not from an edit
    library: () => go('exercises'), settings: () => go('settings'), stats: () => go('stats'), muscles: () => go('muscles'),
    program: () => go('p-' + prog().id),
  }[v] || (() => {}))()],
  ['bCancel', () => { const pid = buildState && buildState.editId ? KBOwn.pidOf(buildState.editId) : null; buildState = null; go(pid && programs.has(pid) ? 'p-' + pid : 'programs'); }],
  ['ownRename', () => { ownState = { pid: prog().id, mode: 'rename', text: prog().name, error: null }; render(); const i = $('#own-name'); if (i) { i.focus(); i.select(); } }],
  ['ownCancel', () => { ownState = null; render(); }],
  ['ownEdit', () => ownEdit(prog().id)],
  ['ownDelete', () => { ownState = { pid: prog().id, mode: 'delete' }; render(); }],
  ['ownDeleteConfirm', () => ownDelete(ownState.pid)],
  ['ownShare', () => ownShare(prog().id)],
  ['addConfirm', () => addShared()],
  ['addOpen', (v) => go('p-' + v)],
  ['b', (v) => { const [k, x] = v.split(':'); buildSet(k, x); }],
  ['bsub', (v) => buildSet('subject', v)],
  ['bRegen', () => buildRegenerate()],
  ['bSave', () => buildSave()],
  ['bookRetry', () => { bookError = null; render(); }],
  ['randomOpen', () => randomOpen()],
  ['restOpen', () => restOpen()],
  ['travel', (v) => setTravel(v || null)],
  ['star', (v) => toggleFavourite(v)],
  ['hide', (v) => toggleHidden(v)],
  ['shelf', (v) => toggleShelf(v)],
  ['skip', (v) => toggleSkip(v)],
  ['restDismiss', () => restDismiss()],
  ['randomSet', (v) => { const k = v.slice(0, v.indexOf(':')); randomSet(k, v.slice(k.length + 1)); }],
  ['randomShuffle', () => { randomState.seed = KBRandom.newSeed(); render(); }],
  ['randomCancel', () => { randomState = null; render(); }],
  ['randomStart', () => randomStart()],
  ['randomDone', () => randomDone()],
  ['randomDiscard', () => { random.discard(); go('programs'); }],
  ['backup', (v) => backupAction(v)],
  ['roundStart', () => { roundState = { pid: prog().id }; rerender(); }],
  ['roundCancel', () => { roundState = null; rerender(); }],
  ['roundConfirm', () => {
    const pid = roundState.pid, onward = KBProgress.onwardSwaps(store.progress(pid));
    const keep = onward.filter((_, i) => { const box = document.querySelector(`[data-keep="${i}"]`); return box && box.checked; });
    roundState = null; store.startRound(pid, keep); window.scrollTo(0, 0);
  }],
  ['retry', (v) => { delete loadFailures[v]; render(); }],
  ['statFamily', (v) => { statsView.family = statsView.family === v ? '' : v; rerender(); }],
  ['statMtop', (v) => { statsView.mpart = null; statsView.mtop = statsView.mtop === v ? null : v; rerender(); }], // Phase 30 (208)
  ['statMpart', (v) => { statsView.mpart = statsView.mpart === v ? null : v; rerender(); }],
  ['statAllex', () => { statsView.allEx = !statsView.allEx; render(); }],
  ['csv', () => downloadCSV()],
  ['hmonth', (v) => historyMove(+v)],
  ['hday', (v) => { statsView.histDay = statsView.histDay === v ? null : v; render(); }],
  ['hopen', (v) => { const [pid, n] = v.split(':'); go(dayHash(pid, +n)); }],
  ['statTab', (v) => { statsView.tab = v; render(); }],
  ['statSpan', (v) => { statsView.span = v; render(); }],
  ['swap', (v) => { const [bi, i] = v.split(':').map(Number); swapState = { key: openKey(), bi, i }; rerender(); }],
  ['swapTo', (v) => { swapState.to = v; rerender(); }],
  ['swapBack', () => { delete swapState.to; rerender(); }],
  ['swapCancel', () => { swapState = null; rerender(); }],
  ['unswap', (v) => { const [bi, i] = v.split(':').map(Number); openDay().undo(bi, i); rerender(); }], // a random workout's swaps are on the device: no store event
  ['swapApply', (v) => { const { bi, i, to } = swapState; swapState = null; openDay().swap(bi, i, to, { onward: v === 'onward' }); rerender(); }],
  ['openProg', (v) => { pickState = null; go('p-' + v); }],
  ['pickOpen', () => pickOpen()],
  ['pickSet', (v) => { const k = v.slice(0, v.indexOf(':')); pickSet(k, v.slice(k.length + 1)); }],
  ['pickClose', () => { pickState = null; render(); }],
  ['askOk', () => askAgree()],
  ['askNo', () => { askState.phase = null; render(); }],
  ['filterMenu', (v) => { toggleFilterMenu(v); render(); }],
  ['mgear', (v) => { musclePick.gear = v; muscleRefresh(); }],
  ['exmuscle', (v) => exMuscle(v)],
  ['expart', (v) => exPart(v)], // Phase 30 (210)
  ['exmuscleClear', () => exMuscle(null)],
  ['exMenu', (v) => { toggleExMenu(v); exRefresh(); }],
  ['exmuscleLink', (v) => { exMenu = null; go('exercises?muscle=' + v); }], // a muscle link lands with the menu closed
  ['exClear', () => exClear()],
  ['exf', (v) => { const [k, x] = v.split(':'); exFilter(k, x); }],
  ['filter', (v) => { const [k, x] = v.split(':'); setFilter(k, x); render(); }],
  ['short', () => { const D = openDay(); D.setShort(!D.short()); }], // the store's change event redraws
  // Phase 30 (212, 314): marking is done, or done again (another date); it never unmarks (Remove is in History, 215)
  ['toggle', (v) => { days.forget(prog().id, +v); store.doAgain(prog().id, +v); }], // the saved session is done with
  ['redo', (v) => { days.forget(prog().id, +v); render(); window.scrollTo(0, 0); }], // Do it again: a fresh session
  ['hremove', (v) => { statsView.removing = statsView.removing === v ? null : v; render(); }], // History: Remove asks first
  ['hremoveYes', (v) => { const [pid, day, ...t] = v.split(':'); statsView.removing = null; store.removeMark(pid, +day, t.join(':')); }],
  ['day', (v) => { const n = +v; if (n >= 1 && n <= prog().days.length) go(dayHash(prog().id, n)); }],
  ['pip', (v) => { const [bi, i, k] = v.split(':').map(Number); tick({ type: 'set', bi, i, k }); }],
  ['rpip', (v) => {
    const parts = v.split(':').map(Number);
    tick(parts.length === 3 ? { type: 'pair', bi: parts[0], pi: parts[1], k: parts[2] } : { type: 'round', bi: parts[0], k: parts[1] });
  }],
  ['work', (v) => { const [bi, i] = v.split(':').map(Number); runPlanned({ type: 'hold', bi, i }); }],
  ['run', (v) => runPlanned({ type: 'block', bi: +v })],
  ['count', (v) => { const [bi, delta] = v.split(':').map(Number); openSession().count(bi, delta); rerender(); }],
  ['ex', (v) => { navDepth++; go('ex-' + v); }],
  ['back', () => { if (navDepth > 0) { navDepth--; history.back(); } else go('exercises'); }],
  ['stretch', (v) => runPlanned({ type: 'stretch', key: v }, v === 'warm')],
];
window.KB_ACTIONS = ACTIONS.map(([k]) => k);
document.addEventListener('click', (ev) => {
  const muscle = ev.target.closest('.mmpick [data-m]'); if (muscle) return exMuscle(muscle.dataset.m); // the Muscles page's body map
  const statM = ev.target.closest('.mmstats [data-m]'); if (statM) return statMuscle(statM.dataset.m); // Stats: the map opens the muscle's row (209)
  const el = ev.target.closest('button'); if (!el) return;
  if (el.id === 'brand') return go('today'); // home: the next day in the program of your last done workout (as the shortcut)
  const hit = ACTIONS.find(([k]) => el.dataset[k] !== undefined);
  if (hit) hit[1](el.dataset[hit[0]], el);
});


/* ---------------- settings: backup ---------------- */
function download(name, text, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function exportProgress() {
  const rounds = Object.fromEntries(programs.ids().map((pid) => [pid, store.progress(pid).past]));
  download(KBBackup.fileName(new Date()), JSON.stringify(KBBackup.exportProgress(allDone(), { swaps: allSwaps(), rounds, short: Object.fromEntries(programs.ids().map((pid) => [pid, store.shortOf(pid)])), again: Object.fromEntries(programs.ids().map((pid) => [pid, store.againOf(pid)])), ownPrograms: store.docs('programs'), random: store.docs('random'), prefs: store.docs('prefs') }), null, 2));
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
  if (e.target.id === 'ask-q') askState.q = e.target.value; // kept through redraws
  if (e.target.id === 'ex-search') { exSearch.q = e.target.value; exRefresh(); }
  if (e.target.id === 'prog-search') { // the whole page redraws (shelves, chips, counter), then the field gets its focus back
    progQuery = e.target.value; const at = e.target.selectionStart; render();
    const i = $('#prog-search'); if (i) { i.focus(); i.setSelectionRange(at, at); }
  }
});
document.addEventListener('submit', (e) => {
  if (e.target.dataset.ownForm) { e.preventDefault(); ownRenameSave(); }
  if (e.target.dataset.askForm) { e.preventDefault(); askSubmit($('#ask-q').value); }
});
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
// Share: the phone's share sheet where there is one (WhatsApp, messages…), else the link is copied (or shown to copy)
async function ownShare(pid) {
  const id = ownIdOf(pid), name = prog().name;
  const link = KBOwn.shareLink(location.href, await KBOwn.shareCode(KBOwn.fromRecord(id, store.doc('programs', id))));
  if (navigator.share) {
    try { await navigator.share({ title: name, text: `${name}: a ${KBLength.dayCountOf(prog())}-day program for Kettle & Bar`, url: link }); return; } catch (e) { if (e && e.name === 'AbortError') return; }
  }
  let copied = false;
  try { await navigator.clipboard.writeText(link); copied = true; } catch (e) { /* no clipboard: the link shows to copy by hand */ }
  ownState = { pid, mode: 'share', link, copied };
  render();
  if (!copied) { const i = $('#share-link'); if (i) { i.focus(); i.select(); } }
}
function ownDelete(pid) {
  ownState = null;
  store.deleteProgress(pid);
  store.deleteDoc('programs', ownIdOf(pid));
  go('programs');
}

/* ---------------- boot ---------------- */
store.load(); // before the route: #today needs your progress
function start() {
  booted = true;
  route = { view: 'program', pid: firstPid(), day: null }; // what an exercise page opened cold comes back to
  route = parseHash();
  render();
  // then every program, quietly, for offline use: the open one and the ones with progress first
  programs.loadEverything([route.pid, ...programs.ids().filter((pid) => store.count(pid) > 0)], () => {}).then(() => Promise.all([programs.loadUsage(), fetchBuildFiles(), focusFile.load()])).catch(() => {});
}
ownLink.refresh(); // your own programs are built from their stored configs: no recipe book, no wait
// the program list first (Phase 16): from the cache at once after the first visit, else the network
libraryFile.load().then((list) => { programs.setSource('library', librarySource(list)); start(); }, (e) => {
  $('#app').innerHTML = `<div class="empty"><h1>No programs yet</h1><p>${esc(e.message)}</p><button class="btn" onclick="location.reload()">Try again</button></div>`;
});
T.paint();
if (!store.remote) paintSync(store.auth ? 'signin' : 'local');

// a newer build is out (Phase 12): the page came from the cache, so it asks version.json (never cached) when it opens and
// when it comes back to the front; a different version: "A new version is ready · Reload". Reload drops the cached page
// first, so it comes from the network.
window.kbUpdateReady = () => {
  if (document.getElementById('updatenote')) return;
  const n = Object.assign(document.createElement('div'), { id: 'updatenote', className: 'updatenote' });
  n.setAttribute('role', 'status');
  n.innerHTML = '<span>A new version is ready.</span><button class="btn" id="update-reload">Reload</button><button class="linkbtn" id="update-later">Later</button>';
  document.body.appendChild(n);
  $('#update-reload').addEventListener('click', async () => {
    try { const c = await caches.open(OFFLINE_CACHE); await Promise.all(['index.html', './'].map((u) => c.delete(new URL(u, location.href).href))); } catch (e) { /* no cache: a plain reload */ }
    location.reload();
  });
  $('#update-later').addEventListener('click', () => n.remove());
};
function checkVersion() {
  if (!window.KB_VERSION) return;
  fetch('version.json', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).then((v) => { if (v && v.v && v.v !== window.KB_VERSION) window.kbUpdateReady(); }, () => { /* offline: ask next time */ });
}
checkVersion();
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') checkVersion(); });
