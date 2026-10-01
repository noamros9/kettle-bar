/* Views: routing and page rendering. Reads the Progress Store (store) and the open Day (days: swaps and its Workout Session);
   never changes them. Globals shared with main.js and clock.js: $, esc, route, render, rerender. */
const { EX, LOAD, MUSCLE_NAMES } = KBEx;
const { figureSVG, muscleMapSVG } = KBFig;
const TYPES = {
  cba: { label: 'Chest, back & abs', short: 'Chest · Back', c: 'var(--t-cba)' },
  up: { label: 'Full body · upper focus', short: 'Upper body', c: 'var(--t-up)' },
  low: { label: 'Full body · lower focus', short: 'Lower body', c: 'var(--t-low)' },
  ac: { label: 'Abs & cardio', short: 'Abs · Cardio', c: 'var(--t-ac)' },
};
const CAT = { chest: 'Chest', back: 'Back', abs: 'Abs', cardio: 'Cardio', upper: 'Shoulders & arms', full: 'Total body', lower: 'Legs & glutes', balance: 'Balance', yoga: 'Yoga', pilates: 'Pilates', flex: 'Flexibility', mobility: 'Mobility & posture', boxing: 'Boxing', kick: 'Kickboxing', warmup: 'Warm-up', cooldown: 'Cool-down stretches' };
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const figCache = {};
const fig = (id) => figCache[id] || (figCache[id] = figureSVG(EX[id], EX[id].name + ' illustration'));
const LETTERS = 'ABCDEF';
const CHECK = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
let rerenderQueued = false;
function rerender() {
  if (rerenderQueued) return; rerenderQueued = true;
  requestAnimationFrame(() => { rerenderQueued = false; const y = window.scrollY; render(); window.scrollTo(0, y); });
}

/* ---------------- routing ----------------
   #today (the logo, home, and the home-screen shortcut) · #programs · #exercises · #stats · #settings · #ex-<id> · #p-<pid> · #p-<pid>-d<n>   (#d<n> = Three-Split 60, kept for old links)
   · #add=<code> (a program someone shared: its preview and Add this program) · #random (the open random workout) */
// every program, through the Program Catalogue (today: all inlined in the page)
const OFFLINE_CACHE = 'kettle-bar-v2'; // the service worker's cache; the page writes loaded programs into it too
const offlineCache = {
  get: (url) => (self.caches ? caches.match(url).then((r) => r && r.json()) : Promise.resolve(undefined)),
  put: (url, v) => (self.caches ? caches.open(OFFLINE_CACHE).then((c) => c.put(url, new Response(JSON.stringify(v), { headers: { 'Content-Type': 'application/json' } }))) : Promise.resolve()),
};
const fetchJson = (url) => fetch(url).then((r) => { if (!r.ok) throw new Error(url + ': ' + r.status); return r.json(); });
const fetchText = (url) => fetch(url).then((r) => { if (!r.ok) throw new Error(url + ': ' + r.status); return r.text(); });
// the exercise index (data/index.json): which programs use an exercise, fetched when an exercise page first needs it
const usageFile = KBLazy.lazyFile({ fetch: fetchJson, cache: offlineCache, url: 'data/index.json', unavailable: "Which programs use this exercise isn't available offline yet. Open an exercise once while online." });
// the library programs' muscle focus (data/muscles.json): fetched when the muscle map is first used, kept for offline
const focusFile = KBLazy.lazyFile({ fetch: fetchJson, cache: offlineCache, url: 'data/muscles.json', unavailable: "Programs for these muscles aren't available offline yet. Pick a muscle once while online." });
const programs = KBPrograms.createProgramCatalogue(KBPrograms.fetched(PROGRAM_SUMMARIES, { fetchJson, cache: offlineCache, name: 'library', usage: usageFile }));
// build your own and the random workout: the recipe book (data/recipes.json) and the code that reads it (data/recipes.js),
// fetched when first asked for, kept for offline; neither is in the page
const BUILD_OFFLINE = "Build your own isn't available offline yet. Open it once while online.";
const bookFile = KBLazy.lazyFile({ fetch: fetchJson, cache: offlineCache, url: 'data/recipes.json', unavailable: BUILD_OFFLINE });
const bookCode = KBLazy.lazyFile({ fetch: fetchText, cache: offlineCache, url: 'data/recipes.js', unavailable: BUILD_OFFLINE });
const fetchBuildFiles = () => Promise.all([bookCode.load(), bookFile.load()]);
let recipeBook = null; // KBRecipes.of(book), once the code and the book are here
const loadBook = () => fetchBuildFiles().then(([code, book]) => {
  if (!recipeBook) {
    if (!self.KBRecipes) { const s = document.createElement('script'); s.textContent = code; document.head.appendChild(s); s.remove(); }
    recipeBook = KBRecipes.of(book);
  }
  return recipeBook;
});
// the first library program: the fallback wherever "some program" is needed (your own programs are listed before it)
const firstPid = () => programs.list().find((s) => s.source === 'library').id;
const lastPid = () => { try { const v = localStorage.getItem('kb-last-program'); return programs.has(v) ? v : null; } catch (e) { return null; } };
// the program of the workout marked done most recently (any round), or nothing before the first one
const lastDonePid = () => {
  let last = null;
  programs.ids().forEach((pid) => store.entries(pid).forEach((e) => { if (!last || e.time > last.time) last = e; }));
  return last && last.pid;
};
const rememberPid = (pid) => { try { localStorage.setItem('kb-last-program', pid); } catch (e) {} };
let route = { view: 'program', pid: firstPid(), day: null };
function parseHash() {
  const h = location.hash.replace('#', '');
  if (h === 'programs') return { view: 'programs' };
  if (h === 'build') return { view: 'build' };
  if (h === 'random') return { view: 'random' };
  if (h === 'exercises') return { view: 'library' };
  if (h === 'settings') return { view: 'settings' };
  // home (the logo) and the home-screen shortcut: the next day not done in the program of the workout marked done last
  // (before any, the program opened last); the program page once every day is done
  if (h === 'today') {
    const pid = lastDonePid() || lastPid() || firstPid(), n = nextDay(pid);
    history.replaceState(null, '', '#' + (n ? dayHash(pid, n) : 'p-' + pid));
    return n ? { view: 'day', pid, day: n } : { view: 'program', pid };
  }
  if (h === 'stats') return { view: 'stats' };
  if (h.startsWith('add=')) return { view: 'add', code: h.slice(4) };
  const x = h.match(/^ex-([a-z0-9_]+)$/);
  if (x && EX[x[1]]) return { view: 'exercise', ex: x[1], pid: route.pid };
  const pd = h.match(/^p-([a-z0-9-]+)-d(\d+)$/);
  if (pd && programs.has(pd[1])) return { view: 'day', pid: pd[1], day: +pd[2] };
  const pp = h.match(/^p-([a-z0-9-]+)$/);
  if (pp && programs.has(pp[1])) return { view: 'program', pid: pp[1] };
  const m = h.match(/^d(\d+)$/);
  if (m) return { view: 'day', pid: 'three-split-60', day: +m[1] };
  const last = lastPid();
  return last ? { view: 'program', pid: last } : { view: 'programs' };
}
function go(hash) { if (location.hash === '#' + hash) { route = parseHash(); render(true); } else location.hash = hash; }
let navDepth = 0; // exercise pages opened from inside the app go back with history.back()
window.addEventListener('hashchange', () => { route = parseHash(); render(true); });
const dayHash = (pid, n) => `p-${pid}-d${n}`;

/* ---------------- helpers ---------------- */
const prog = () => programs.get(route.pid) || programs.get(firstPid());
const typesOf = (p) => p.dayTypes || TYPES;
const itemSets = (b, it) => it.sets || b.sets;
// the next day not done (after `after`, else from the start); works from the program list, no days needed
const nextDay = (pid, after) => KBProgress.nextDay(store.progress(pid), Array.from({ length: programs.summary(pid).dayCount }, (_, i) => i + 1), after);
const unitText = (e) => KBSession.unitText(e);
function cycleDays(p, key) {
  const d = p.days.filter((w) => w.type === key).slice(0, 3).map((w) => w.day);
  return d.length ? `Days ${d.join(', ')}…` : '';
}

/* ---------------- programs page ---------------- */
const { libraryView, suggestNext, FAMILIES, LENGTHS, lengthOf } = KBLibrary;
let filters = { family: 'all', subject: 'all', len: 'all', equip: 'all' };
let filterMenu = null; // 'len' | 'equip': which of "Length: Any" and "Equipment: Any" is open, showing its choices
function setFilter(k, val) {
  filters = KBLibrary.setFilter(filters, k, val);
  if (k === 'len' || k === 'equip') filterMenu = null;
}
const toggleFilterMenu = (which) => { filterMenu = filterMenu === which ? null : which; };
const { firstSentence } = KBPrograms; // program cards show the paragraph's first sentence

/* Favourites and hidden subjects (Phase 8 ticket 1): in the synced prefs doc, as `favourites: [program id]` and
   `hidden: [subject]`, each only while not empty. A star on each library program's card and page; Settings hides subjects. */
const libraryPrefs = () => { const p = store.doc('prefs', 'main') || {}, list = (x) => (Array.isArray(x) ? x.filter((v) => typeof v === 'string') : []); return { favourites: list(p.favourites), hidden: list(p.hidden) }; };
const isFavourite = (pid) => libraryPrefs().favourites.includes(pid);
const toggleFavourite = (pid) => setPref('favourites', KBLibrary.toggleIn(libraryPrefs().favourites, pid));
const toggleHidden = (subject) => setPref('hidden', KBLibrary.toggleIn(libraryPrefs().hidden, subject));
const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"/></svg>';
const starButton = (p) => { const on = isFavourite(p.id); return `<button class="star" data-star="${esc(p.id)}" aria-pressed="${on}" aria-label="${on ? 'Remove' : 'Add'} ${esc(p.name)} ${on ? 'from' : 'to'} favourites">${STAR}</button>`; };
function viewPrograms() {
  const last = lastPid();
  const all = programs.list().filter((p) => p.source !== 'own'); // your own programs have their own shelf
  const mine = programs.list().filter((p) => p.source === 'own');
  const lib = libraryView(all, filters, { families: FAMILIES, lengthOf, prefs: libraryPrefs() });
  lib.unknown.forEach((s) => console.error(`Subject "${s}" has no family in FAMILIES`));
  const card = (p) => {
    const n = store.count(p.id), mins = p.minutes[0] === p.minutes[1] ? p.minutes[0] : `${Math.round(p.minutes[0])}–${Math.round(p.minutes[1])}`;
    return `<button class="pcard${p.id === last ? ' current' : ''}" data-open-prog="${p.id}">
      <div class="pc-main"><span class="eyebrow">${esc(p.subject)}${p.id === last ? ' · current' : ''}${store.round(p.id) > 1 ? ` · Round ${store.round(p.id)}` : ''}</span><b>${esc(p.name)}</b><p>${esc(firstSentence(p.about || p.blurb))}</p>
        <div class="pc-tags"><span class="chip">${esc(p.split)}</span><span class="chip">~${mins} min</span>${(p.formats || ['straight']).map((f) => `<span class="chip">${fmtFormat[f]}</span>`).join('')}${p.equip === 'kb' ? '<span class="chip">Kettlebell only</span>' : p.equip === 'bw' ? '<span class="chip">No equipment</span>' : ''}</div></div>
      <div class="pc-prog"><span class="num">${n}/${p.dayCount}</span><div class="bar"><b style="width:${(n / p.dayCount) * 100}%"></b></div></div></button>`;
  };
  const starred = (p) => `<div class="pcwrap">${card(p)}${starButton(p)}</div>`;
  const groups = lib.shelves.map((s) => `<section class="pgroup"><h2>${esc(s.subject)}</h2><div class="plist">${s.programs.map(starred).join('')}</div></section>`).join('');
  const favs = lib.favourites.length ? `<section class="pgroup favs"><h2>Favourites</h2><div class="plist">${lib.favourites.map(starred).join('')}</div></section>` : '';
  const yours = mine.length ? `<section class="pgroup yours"><h2>Your programs</h2><div class="plist">${mine.map(card).join('')}</div></section>` : '';
  const tab = (k, x) => `<button class="ftab" data-filter="${k}:${esc(x.key)}" aria-pressed="${x.pressed}">${esc(x.name)}</button>`;
  const menuLine = (k, name, label) => `<button class="lenline" data-filter-menu="${k}" aria-expanded="${filterMenu === k}">${name}: <b>${esc(label)}</b> <span aria-hidden="true">${filterMenu === k ? '▴' : '▾'}</span></button>`;
  const menuChips = (k, what, list) => `<div class="filters" role="group" aria-label="Filter by ${what}">${list.map((l) => `<button class="fchip acc" data-filter="${k}:${l.key}" aria-pressed="${l.pressed}">${esc(l.label)}</button>`).join('')}</div>`;
  const chip = (x) => `<button class="fchip acc" data-filter="subject:${esc(x.key)}" aria-pressed="${x.pressed}">${esc(x.name)} <span class="fcount">${x.count}</span></button>`;
  return `<div class="eyebrow">${esc(lib.counter)}</div><h1>Programs</h1>
    <p class="lede">Every program starts at intermediate, with a matched warm-up and cool-down, and most end each workout with abs. Progress is kept per program.</p>
    <div class="pbtns"><button class="btn buildbtn" data-go="build">Build your own</button><button class="btn ghost buildbtn" data-random-open="1">${random.current() ? 'Random workout · continue' : 'Random workout'}</button></div>
    ${randomNotice ? `<p class="hint rnotice" role="status">${esc(randomNotice)}</p>` : ''}${restCard()}
    ${yours}${favs}
    <div class="ftabs" role="group" aria-label="Filter by family">${lib.families.map((f) => tab('family', f)).join('')}</div>
    <div class="filters" role="group" aria-label="Filter by subject">${lib.subjects.map(chip).join('')}</div>
    <div class="lenlines">${menuLine('len', 'Length', lib.lengthLabel)}${menuLine('equip', 'Equipment', lib.equipLabel)}</div>
    ${filterMenu === 'len' ? menuChips('len', 'length', lib.lengths) : filterMenu === 'equip' ? menuChips('equip', 'equipment', lib.equips) : ''}
    ${groups || '<p class="lede" style="margin-top:24px">No programs match these filters.</p>'}${randomSheet()}`;
}

/* ---------------- random workout (Phase 7, #64) ----------------
   A sheet on the Programs page: a family (or one of its subjects), 15 / 25 / 35 minutes and equipment; the day it makes
   (app/random.js, from the recipe book) shows before Start, and Reshuffle makes another. Its level is the level of the
   day marked done last. Started, it opens at #random, a day page of its own; Mark as done writes it to the account, and
   it counts in stats, not in any program. */
let randomState = null; // { choice, seed } while the sheet is open
let randomNotice = ''; // "Random workout done…", once, on the Programs page
let randomCache = { key: '', made: null };
const RANDOM_GEAR = { all: 'All equipment', kb: 'Kettlebell only', bw: 'No equipment' };
// every day marked done, as { time, level }: program days by their day number, random workouts by their own level
const doneLevels = () => [...programs.ids().flatMap((pid) => store.entries(pid).map((e) => ({ time: e.time, level: KBRandom.levelOfDay(e.day) }))), ...random.levels()];
const randomDeps = () => ({ recipes: recipeBook, buildDay: KBBuilder.buildDay, newMemory: KBBuilder.newMemory, makeRnd: KBBuilder.makeRnd, cat: KBEx });
function randomMade(st) {
  const key = JSON.stringify([st.choice, st.seed]);
  if (randomCache.key !== key) randomCache = { key, made: KBRandom.make(randomDeps(), st.choice, { level: KBRandom.levelOf(doneLevels()), seed: st.seed }) };
  return randomCache.made;
}
const familyOfSubject = (name) => recipeBook.book().subjects.find(([n]) => n === name)[1];
const familyOfChoice = (c) => c.family || familyOfSubject(c.subject || c.subjects[0]);
// Rest-day flow (Phase 7 ticket 3): on a day with nothing marked done, a card offers a short mobility or flexibility
// flow; it opens the random workout's sheet with that choice. "Not today" hides it until tomorrow (on this device).
const REST_KEY = 'kb-rest-dismissed';
const doneTimes = () => doneEntries().map((e) => e.time);
function restCard() {
  let dismissed = null; try { dismissed = localStorage.getItem(REST_KEY); } catch (e) { /* blocked: shown */ }
  if (random.current() || !KBRandom.restDay(doneTimes(), new Date(), dismissed)) return '';
  return `<div class="restcard"><div class="rc-t"><b>Rest day?</b><span>A ${KBRandom.REST_DAY.minutes}-minute mobility or flexibility flow, no equipment.</span></div>
    <div class="rc-a"><button class="btn" data-rest-open="1">Show me</button><button class="btn ghost" data-rest-dismiss="1">Not today</button></div></div>`;
}
function restOpen() {
  randomNotice = '';
  randomState = { choice: JSON.parse(JSON.stringify(KBRandom.REST_DAY)), seed: KBRandom.newSeed() };
  render();
}
function restDismiss() { try { localStorage.setItem(REST_KEY, KBRandom.dayKey(new Date())); } catch (e) { /* blocked */ } render(); }
function randomSet(k, v) {
  const c = randomState.choice, keep = { minutes: c.minutes, equipment: c.equipment };
  if (k === 'family') randomState.choice = { family: v, ...keep };
  else if (k === 'subject') randomState.choice = v ? { subject: v, ...keep } : { family: familyOfChoice(c), ...keep };
  else randomState.choice = { ...c, [k]: k === 'minutes' ? +v : v };
  render();
}
function randomSheet() {
  if (!randomState) return '';
  const wrap = (body) => `<div class="sheetwrap"><button class="sheetbg" data-random-cancel="1" aria-label="Close"></button>
    <div class="sheet rsheet" role="dialog" aria-modal="true" aria-labelledby="random-h"><h2 id="random-h">Random workout</h2>${body}</div></div>`;
  if (!recipeBook) {
    if (!bookLoading && !bookError) {
      bookLoading = true;
      loadBook().then(() => { bookLoading = false; rerender(); }, (e) => { bookLoading = false; bookError = e.message; rerender(); });
    }
    return wrap(bookError
      ? `<p class="notice" role="alert">${esc(bookError.replace('Build your own', 'The random workout'))}</p><div class="actions"><button class="btn ghost" data-book-retry="1">Try again</button><button class="btn ghost" data-random-cancel="1">Cancel</button></div>`
      : '<p class="loading lede" role="status">Loading…</p>');
  }
  const c = randomState.choice, family = familyOfChoice(c), name = c.subjects ? c.subjects.join(' or ') : c.subject || family;
  const subjects = recipeBook.book().subjects.filter(([, f]) => f === family).map(([n]) => n);
  const chip = (key, value, label, on, why) => `<button class="fchip acc" data-random-set="${key}:${esc(value)}" aria-pressed="${on}"${why ? ` disabled title="${esc(why)}"` : ''}>${esc(label)}</button>`;
  const whyMinutes = (m) => KBRandom.problem(recipeBook, { ...c, minutes: m });
  const whyGear = (eq) => (KBRandom.MINUTES.some((m) => !KBRandom.problem(recipeBook, { ...c, minutes: m, equipment: eq })) ? '' : `No ${name} workouts with ${RANDOM_GEAR[eq].toLowerCase()}.`);
  const why = KBRandom.problem(recipeBook, c);
  const reasons = [...new Set(KBRandom.MINUTES.map(whyMinutes).filter((r) => r && r !== why))];
  let preview;
  if (why) preview = `<p class="notice" role="alert">${esc(why)}</p>`;
  else {
    const m = randomMade(randomState), w = m.day;
    preview = `<div class="rprev" data-seed="${esc(randomState.seed)}"><b class="rname">${esc(w.name)}</b><span class="hint">${esc(m.subject)} · about ${w.est} min${w.stretchMin ? ` + ${w.stretchMin} min stretching` : ''} · ${esc(m.program.levels[w.level - 1].split(' · ')[0])}</span>
      <ul class="rblocks">${w.blocks.map((b) => `<li><b>${esc(b.title)}</b>${(b.format || 'straight') !== 'straight' ? ` · ${esc(fmtFormat[b.format])}` : ''}: ${esc(b.items.map((it) => EX[it.ex].name).join(', '))}</li>`).join('')}</ul></div>`;
  }
  return wrap(`<p class="muted">Built fresh, at the level of the last day you marked done. It counts in your stats, not in any program.</p>
    <div class="filters" role="group" aria-label="Family">${KBRandom.FAMILIES.map((f) => chip('family', f, f, family === f)).join('')}</div>
    <div class="filters" role="group" aria-label="Subject">${chip('subject', '', `Any ${family.toLowerCase()}`, !c.subject && !c.subjects)}${subjects.map((n) => chip('subject', n, n, c.subject === n || (c.subjects || []).includes(n))).join('')}</div>
    <div class="filters" role="group" aria-label="Minutes">${KBRandom.MINUTES.map((m) => chip('minutes', m, `${m} min`, c.minutes === m, whyMinutes(m))).join('')}</div>
    ${reasons.map((r) => `<p class="hint">${esc(r)}</p>`).join('')}
    <div class="filters" role="group" aria-label="Equipment">${['all', 'kb', 'bw'].map((eq) => chip('equipment', eq, RANDOM_GEAR[eq], c.equipment === eq, whyGear(eq))).join('')}</div>
    ${preview}
    <div class="actions"><button class="btn" data-random-start="1"${why ? ' disabled' : ''}>Start</button><button class="btn ghost" data-random-shuffle="1"${why ? ' disabled' : ''}>Reshuffle</button><button class="btn ghost" data-random-cancel="1">Cancel</button></div>`);
}
function randomOpen() {
  if (random.current()) return go('random');
  randomNotice = '';
  randomState = { choice: { family: 'Strength', minutes: 25, equipment: 'all' }, seed: KBRandom.newSeed() };
  if (route.view !== 'programs') go('programs'); else render();
}
function randomStart() {
  const made = randomMade(randomState);
  randomState = null;
  random.start(made);
  go('random');
}
function randomDone() {
  const id = random.done();
  if (id) randomNotice = `Random workout done: ${random.dayOf(id).est} min added to this week. Stats has it under Random workouts.`;
  go('programs');
}
function randomFinish(w) {
  const v = KBStats.dayVolume(w, EX);
  return `<section class="finish" aria-labelledby="finish-h"><h2 id="finish-h">Workout complete</h2>
    <dl class="fstats">
      <div><dt>Sets</dt><dd class="num" data-testid="sets">${v.sets}</dd></div>
      <div><dt>Workout</dt><dd class="num" data-testid="workout-min">${Math.round(v.workoutMin)} min</dd></div>
      <div><dt>Stretching</dt><dd class="num" data-testid="stretch-min">${Math.round(v.stretchMin)} min</dd></div>
    </dl>
    <p class="fweek" data-testid="week">${weekLine()}</p>
    <div class="fmap"><h3>Muscles worked today</h3>${muscleMapSVG(v.muscles, 'Muscles worked today')}${heatLegend()}</div>
    <button class="btn" data-random-done="1">Mark as done</button>
  </section>`;
}
function viewRandom() {
  const D = random.open();
  if (!D) {
    return `<div class="crumbs"><button class="back" data-go="programs">← All programs</button></div><div class="eyebrow">Random workout</div><h1>No random workout open</h1>
      <p class="lede">Pick a family, the minutes and your equipment, and one is built for you.</p><button class="btn" data-random-open="1">Choose a random workout</button>`;
  }
  const p = D.program, w = D.day, ses = D.session();
  if (ses.started() !== null) S.resume(ses.started());
  const t = p.dayTypes[w.type], nEx = w.blocks.reduce((n, b) => n + b.items.length, 0);
  return `<div class="crumbs"><button class="back" data-go="programs">← All programs</button></div>
    <div class="whead"><div><div class="eyebrow">Random workout · ${esc(p.subject)} · ${esc(p.levels[w.level - 1].split(' · ')[0])}</div><h1>${esc(w.name)}</h1>
      <p class="daysum">${KBSummary.daySummary(w, p, KBEx).map((l) => `<span>${esc(l)}</span>`).join('')}</p>
      <div class="meta"><span class="ty"><i class="dot" style="--c:${t.c}"></i>${esc(t.label)}</span><span>About ${w.est} min${w.stretchMin ? ` + ${w.stretchMin} min stretching` : ''}</span><span>${nEx} exercises</span></div></div>
      <div class="rtools"><button class="btn" data-random-done="1">Mark as done</button><button class="btn ghost" data-random-discard="1">Discard</button></div></div>
    ${D.restored() ? '<p class="resumed" role="status">Picked up where you left off</p>' : ''}
    <p class="how">Counts in your stats when you mark it done, not in any program. Tap a set, round or pair number when you finish it and the right rest starts on the timer.</p>
    ${w.warmup ? stretchBlock(w.warmup, 'warm', 'W', 'Before you start', ses) : ''}
    ${w.blocks.map((b, bi) => blockHTML(p, w, b, bi, ses, D)).join('')}
    ${w.cooldown ? `<div class="between">Then stretch</div>${stretchBlock(w.cooldown, 'cool', 'C', w.blocks.at(-1).kind === 'abs' ? 'After the abs' : 'After the workout', ses)}` : ''}
    ${ses.allDone() ? randomFinish(w) : ''}
    ${swapSheet(D)}`;
}

/* ---------------- build your own ----------------
   #build: pick one to three subjects (the order you tap is the order of each day's blocks: a mix) and the rest, see the
   first six days, regenerate (a new seed), save. The choices and the seed are what is saved (app/own.js); the days are
   built here from them. */
const LEVER_TEXT = { reps: 'More reps', holds: 'Longer holds', weight: 'Heavier weights', variation: 'Harder variations', tempo: 'Slower tempo' };
const GEAR_TEXT = { all: 'All equipment', kb: 'Kettlebell only', bw: 'No equipment' };
let buildState = null; // { c: choices, seed, name: null (the default) | text, editId?: the own program being edited }
const ownIdOf = (pid) => pid.replace(/^own-/, '');
const isOwn = (pid) => !!programs.summary(pid) && programs.summary(pid).source === 'own';
const ownDeps = () => ({ build: KBBuilder.build, ex: KBEx });
// every day marked done in any round: an edit keeps what you did on them
const ownDoneDays = (pid) => [...new Set(store.entries(pid).map((e) => e.day))];
let bookError = null, bookLoading = false;
let previewCache = { key: '', program: null };
// the edited record as it would be saved (done days frozen), or a new program's first days
function editedRecord(b, now) {
  return KBOwn.edit({ recipes: recipeBook, ...ownDeps() }, b.editId, store.doc('programs', b.editId), { name: b.name || undefined, choices: b.c, seed: b.seed, doneDays: ownDoneDays(KBOwn.pidOf(b.editId)) }, now);
}
function buildPreview(b) {
  const key = JSON.stringify([b.c, b.seed, b.editId || null]);
  if (previewCache.key !== key) {
    const program = b.editId
      ? KBOwn.programOf(ownDeps(), KBOwn.fromRecord(b.editId, editedRecord(b, 'preview')))
      : KBOwn.programOf(ownDeps(), { pid: 'own-preview', name: 'Preview', config: KBOwn.configOf(recipeBook, { choices: b.c, seed: b.seed }) });
    previewCache = { key, program };
  }
  return previewCache.program;
}
function buildSet(k, v) {
  const b = buildState, c = b.c;
  if (k === 'subject') b.c = KBOwn.toggle(recipeBook, c, v);
  else if (k === 'split' || k === 'minutes') b.c = KBOwn.fit(recipeBook, { ...c, [k]: +v });
  else if (k === 'equipment') b.c = KBOwn.fit(recipeBook, { ...c, equipment: v });
  else if (k === 'lever') { const [i, l] = v.split('='); b.c = { ...c, levers: c.levers.map((x, j) => (j === +i ? l : x)) }; } // i: 2 × subject + (0 for Level II, 1 for III)
  else if (k === 'format') { // tick or untick, keeping the subjects' order
    const all = recipeBook.options(c.subjects).formats;
    b.c = { ...c, formats: all.filter((f) => (f === v ? !c.formats.includes(f) : c.formats.includes(f))) };
  }
  render();
}
function buildRegenerate() { buildState.seed = KBOwn.newSeed(); render(); }
function buildSave() {
  const b = buildState;
  const name = (b.name || '').trim() || KBOwn.defaultName(b.c.subjects);
  if (b.editId) { // the same program, with new choices: days you did stay as they were
    const pid = KBOwn.pidOf(b.editId);
    store.setDoc('programs', b.editId, editedRecord({ ...b, name }, new Date().toISOString()));
    buildState = null;
    go('p-' + pid);
    return;
  }
  const id = KBOwn.newId();
  const made = { choices: b.c, seed: b.seed, catalogue: recipeBook.book().catalogue };
  // the config the recipes made is what is kept: the days never depend on the recipe book again
  store.setDoc('programs', id, KBOwn.toRecord({ name, ...made, config: KBOwn.configOf(recipeBook, made) }, new Date().toISOString())); // the catalogue follows at once
  buildState = null;
  go('p-' + KBOwn.pidOf(id));
}
function viewBuild() {
  if (buildState && buildState.editId && !store.doc('programs', buildState.editId)) buildState = null; // deleted on another device meanwhile
  const editing = buildState && buildState.editId;
  const head = editing
    ? `<div class="crumbs"><button class="back" data-b-cancel="1">← ${esc(store.doc('programs', editing).name)}</button></div><div class="eyebrow">Your programs</div><h1>Edit your program</h1>`
    : `<div class="crumbs"><button class="back" data-go="programs">← All programs</button></div><div class="eyebrow">Programs</div><h1>Build your own</h1>`;
  if (!recipeBook) {
    if (!bookLoading && !bookError) {
      bookLoading = true;
      loadBook().then(() => { bookLoading = false; rerender(); }, (e) => { bookLoading = false; bookError = e.message; rerender(); });
    }
    return head + (bookError
      ? `<p class="lede" role="alert">${esc(bookError)}</p><button class="btn ghost buildretry" data-book-retry="1">Try again</button>`
      : '<p class="loading lede" role="status">Loading…</p>');
  }
  const rb = recipeBook;
  const b = buildState || (buildState = { c: KBOwn.defaults(rb, 'Strength'), seed: KBOwn.newSeed(), name: null });
  const c = b.c, o = rb.options(c.subjects), st = KBOwn.states(rb, c), mix = c.subjects.length > 1;
  const chip = (key, value, label, on, state) => `<button class="fchip acc" data-b="${key}:${value}" aria-pressed="${on}"${state && !state.ok ? ` disabled title="${esc(state.reason)}"` : ''}>${esc(label)}</button>`;
  const why = (list) => list.filter((x) => x && x.reason).map((x) => `<p class="hint">${esc(x.reason)}</p>`).join('');
  // subjects: chips by family; the number is the order you tapped them in, which is the order of each day's blocks
  const subs = KBOwn.subjectStates(rb, c), families = [...new Set(subs.map((x) => x.family))];
  const subChip = (x) => `<button class="fchip acc subj" data-bsub="${esc(x.name)}" aria-pressed="${x.order > 0}"${x.ok ? '' : ` disabled title="${esc(x.reason)}"`}>${x.order ? `<b class="ord" aria-hidden="true">${x.order}</b>` : ''}${esc(x.name)}</button>`;
  const greyed = [...new Set(subs.filter((x) => !x.ok).map((x) => (x.reason.startsWith('No mix') ? 'Greyed out: no mix with it fits 20 to 40 minutes.' : x.reason)))];
  const alone = rb.mixReason(c.subjects);
  const pickLine = mix ? `Each day: ${c.subjects.join(', then ')}.` : alone ? `${alone} Tap another subject to start over with it.` : 'Tap up to three to mix them: each day then has a block of each, in the order you tap.';
  const subjectPicker = `<p class="hint bpick" role="status">${esc(pickLine)}</p>${families.map((f) => `<div class="bfam"><h3>${esc(f)}</h3><div class="filters" role="group" aria-label="${esc(f)}">${subs.filter((x) => x.family === f).map(subChip).join('')}</div></div>`).join('')}${greyed.map((r) => `<p class="hint">${esc(r)}</p>`).join('')}`;
  // how it gets harder: a Level II and a Level III lever for each subject, over its own blocks
  const lists = mix ? o.levers : [o.levers];
  const leverSelect = (j, level) => { const i = 2 * j + level - 2, id = `b-lever${level}${j ? '-' + (j + 1) : ''}`; return `<label class="bfield" for="${id}"><span>Level ${level === 2 ? 'II' : 'III'}</span><select id="${id}" data-blever="${i}">${lists[j].map((l) => `<option value="${l}"${c.levers[i] === l ? ' selected' : ''}>${LEVER_TEXT[l]}</option>`).join('')}</select></label>`; };
  const levers = c.subjects.map((s, j) => `${mix ? `<h3 class="blev">${j + 1} · ${esc(s)}</h3>` : ''}<div class="bfields">${leverSelect(j, 2)}${leverSelect(j, 3)}</div>`).join('');
  const problem = KBOwn.problem(rb, c);
  let preview;
  if (problem) preview = `<p class="notice" role="alert">${esc(problem)}</p>`;
  else {
    const p = buildPreview(b), TY = typesOf(p);
    preview = `<p class="pvline num">${esc(KBOwn.summaryLine(p))}</p><div class="grid pv" data-seed="${esc(b.seed)}">${p.days.slice(0, 6).map((w) => {
      const t = TY[w.type] || { short: w.title, c: 'var(--muted)' }; // a day you did keeps its own title
      return `<div class="tile"><span class="open"><span class="n num">${w.day}</span><span class="nm">${esc(w.name)}</span><span class="ty"><i class="dot" style="--c:${t.c}"></i>${esc(t.short)} · ${w.est}′</span></span></div>`;
    }).join('')}</div>`;
  }
  const doneCount = editing ? ownDoneDays(KBOwn.pidOf(editing)).length : 0;
  const lede = editing
    ? `Change what you want; the first six days show below as they will be. ${doneCount ? `The ${doneCount === 1 ? 'day' : doneCount + ' days'} you have done stay${doneCount === 1 ? 's' : ''} exactly as you did ${doneCount === 1 ? 'it' : 'them'}; the rest are made again.` : 'No day is done yet, so every day is made again.'}`
    : 'Pick what you want; the first six days show below. Regenerate for a different set of days, with the same choices.';
  return `${head}<p class="lede">${lede}</p>
    <section class="bsec"><h2>${mix ? 'Subjects' : 'Subject'}</h2>${subjectPicker}</section>
    <section class="bsec"><h2>Days in a cycle</h2><div class="filters" role="group" aria-label="Days in a cycle">${[1, 2, 3, 4, 5].map((n) => chip('split', n, n, c.split === n)).join('')}</div></section>
    <section class="bsec"><h2>Minutes a day</h2><div class="filters" role="group" aria-label="Minutes a day">${KBOwn.MINUTES.map((m) => chip('minutes', m, m, c.minutes === m, st.minutes[m])).join('')}</div>${why(KBOwn.MINUTES.map((m) => st.minutes[m]))}</section>
    <section class="bsec"><h2>Equipment</h2><div class="filters" role="group" aria-label="Equipment">${KBOwn.EQUIPMENT.map((e) => chip('equipment', e, GEAR_TEXT[e], c.equipment === e, st.equipment[e])).join('')}</div>${why(KBOwn.EQUIPMENT.map((e) => st.equipment[e]))}</section>
    <section class="bsec"><h2>Formats</h2><div class="filters" role="group" aria-label="Formats">${o.formats.map((f) => `<label class="fchip acc fmt"><input type="checkbox" data-bfmt="${f}"${c.formats.includes(f) ? ' checked' : ''}> ${esc(fmtFormat[f])}</label>`).join('')}</div></section>
    <section class="bsec"><h2>How it gets harder</h2>${levers}</section>
    <section class="bsec"><h2>Preview</h2>${preview}
      <div class="actions"><button class="btn ghost" data-b-regen="1"${problem ? ' disabled' : ''}>Regenerate</button></div></section>
    <section class="bsec"><h2>Save</h2><label class="bfield" for="b-name"><span>Name</span><input id="b-name" type="text" maxlength="60" value="${esc(b.name === null ? KBOwn.defaultName(c.subjects) : b.name)}" autocomplete="off"></label>
      <div class="actions"><button class="btn" data-b-save="1"${problem ? ' disabled' : ''}>${editing ? 'Save changes' : 'Save program'}</button>${editing ? '<button class="btn ghost" data-b-cancel="1">Cancel</button>' : ''}</div></section>`;
}

/* ---------------- a shared program (#add=<code>) ----------------
   Read the link, show the program's first days, and add it to Your programs under the id it was made with (the builder
   draws the exercises from it, so the days are the same as the sharer's). No server: everything is in the link. */
let addState = { code: null }; // { code, shared?, program?, error? }: the link being shown
function viewAdd() {
  const code = route.code;
  const head = '<div class="crumbs"><button class="back" data-go="programs">← All programs</button></div><div class="eyebrow">Shared with you</div>';
  if (addState.code !== code) {
    addState = { code };
    KBOwn.readShare(code, ownDeps()).then((shared) => {
      if (addState.code !== code) return;
      addState.shared = shared;
      addState.program = KBOwn.programOf(ownDeps(), { pid: KBOwn.pidOf(shared.id), name: shared.name, config: shared.config });
      rerender();
    }, (e) => { if (addState.code === code) { addState.error = e.message; rerender(); } });
  }
  if (addState.error) return `${head}<h1>This link can't be opened</h1><p class="notice" role="alert">${esc(addState.error)}</p>`;
  if (!addState.program) return `${head}<h1>A shared program</h1><p class="loading lede" role="status">Loading…</p>`;
  const sh = addState.shared, p = addState.program, TY = typesOf(p), pid = KBOwn.pidOf(sh.id);
  const tiles = `<div class="grid pv">${p.days.slice(0, 6).map((w) => {
    const t = TY[w.type] || { short: w.title, c: 'var(--muted)' };
    return `<div class="tile"><span class="open"><span class="n num">${w.day}</span><span class="nm">${esc(w.name)}</span><span class="ty"><i class="dot" style="--c:${t.c}"></i>${esc(t.short)} · ${w.est}′</span></span></div>`;
  }).join('')}</div>`;
  const have = !!store.doc('programs', sh.id);
  const actions = have
    ? `<p class="hint" role="status">This program is already in Your programs${programs.has(pid) && programs.summary(pid).name !== sh.name ? `, as ${esc(programs.summary(pid).name)}` : ''}.</p><div class="actions"><button class="btn" data-add-open="${esc(pid)}">Open it</button></div>`
    : '<div class="actions"><button class="btn" data-add-confirm="1">Add this program</button><button class="btn ghost" data-go="programs">Not now</button></div>';
  return `${head}<h1>${esc(sh.name)}</h1><p class="lede">${esc(p.about)} Adding it gives you your own copy: your progress is yours, and you can rename or edit it.</p>
    <section class="bsec"><h2>First six days</h2><p class="pvline num">${esc(KBOwn.summaryLine(p))}</p>${tiles}${actions}</section>`;
}
function addShared() {
  const sh = addState.shared;
  if (!sh) return;
  const { id, ...made } = sh;
  if (!store.doc('programs', id)) store.setDoc('programs', id, KBOwn.toRecord(made, new Date().toISOString())); // the catalogue follows at once
  location.replace('#p-' + KBOwn.pidOf(id)); // back from the program goes where you were before the link, not to it
}

/* ---------------- program page ---------------- */
// Start a new round: { pid } while the sheet is open. Each rest-of-program swap: keep it, or back to the original.
let roundState = null;
function roundSheet(p, r) {
  if (!roundState || roundState.pid !== p.id) return '';
  const onward = KBProgress.onwardSwaps(store.progress(p.id));
  const list = onward.length
    ? `<p>Your rest-of-program swaps. Untick any to go back to the original exercise.</p><ul class="keeplist">${onward.map((s, i) => `<li><label><input type="checkbox" data-keep="${i}" checked aria-label="Keep ${esc(EX[s.to].name)} instead of ${esc(EX[s.ex].name)}"><span><b>${esc(EX[s.to].name)}</b> instead of ${esc(EX[s.ex].name)}</span></label></li>`).join('')}</ul>`
    : '';
  return `<div class="sheetwrap"><button class="sheetbg" data-round-cancel="1" aria-label="Close"></button>
    <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="round-h"><h2 id="round-h">Start Round ${r + 1}</h2>
    <p class="muted">Days start again from day 1. Round ${r} stays in your stats, as it is.</p>${list}
    <div class="actions"><button class="btn" data-round-confirm="1">Start Round ${r + 1}</button><button class="btn ghost" data-round-cancel="1">Cancel</button></div></div></div>`;
}
// rename, delete, edit: only for your own programs
let ownState = null; // { pid, mode: 'rename' | 'delete', text?, error? }
function ownTitle(p) {
  if (!ownState || ownState.pid !== p.id || ownState.mode !== 'rename') return `<h1>${esc(p.name)}</h1>`;
  return `<form class="renamerow" data-own-form="1"><label class="sr" for="own-name">Program name</label><input id="own-name" type="text" maxlength="60" value="${esc(ownState.text)}" autocomplete="off"${ownState.error ? ' aria-invalid="true" aria-describedby="own-err"' : ''}>
    <button class="btn" type="submit">Save name</button><button class="btn ghost" type="button" data-own-cancel="1">Cancel</button></form>${ownState.error ? `<p class="notice" id="own-err" role="alert">${esc(ownState.error)}</p>` : ''}`;
}
const ownTools = (p) => `<div class="owntools"><button class="btn ghost" data-own-share="1">Share</button><button class="btn ghost" data-own-rename="1">Rename</button><button class="btn ghost" data-own-edit="1">Edit</button><button class="btn ghost danger" data-own-delete="1">Delete</button></div>${shareNote(p)}`;
// after Share: "Link copied", or the link to copy by hand when the phone won't let the page copy it
function shareNote(p) {
  if (!ownState || ownState.pid !== p.id || ownState.mode !== 'share') return '';
  if (ownState.copied) return '<p class="hint sharenote" role="status">Link copied. Whoever opens it can add this program, with its 60 days, to their own.</p>';
  return `<div class="sharenote"><label class="bfield" for="share-link"><span>Copy this link</span><input id="share-link" type="text" readonly value="${esc(ownState.link)}"></label></div>`;
}
function deleteSheet(p) {
  if (!ownState || ownState.pid !== p.id || ownState.mode !== 'delete') return '';
  return `<div class="sheetwrap"><button class="sheetbg" data-own-cancel="1" aria-label="Close"></button>
    <div class="sheet" role="alertdialog" aria-modal="true" aria-labelledby="del-h"><h2 id="del-h">Delete ${esc(p.name)}?</h2>
    <p class="muted">Its progress goes too.</p>
    <div class="actions"><button class="btn danger" data-own-delete-confirm="1">Delete</button><button class="btn ghost" data-own-cancel="1">Cancel</button></div></div></div>`;
}
function viewProgram() {
  const p = prog(), n = store.count(p.id), nx = nextDay(p.id), TY = typesOf(p), r = store.round(p.id), own = isOwn(p.id);
  rememberPid(p.id);
  const nw = nx ? p.days[nx - 1] : null;
  const levels = [0, 1, 2].map((li) => {
    const ds = p.days.filter((w) => w.level === li + 1);
    const done = ds.filter((w) => store.isDone(p.id, w.day)).length;
    return `<section class="level"><header><h2>${esc(p.levels[li])}</h2><p>Days ${ds[0].day}–${ds[ds.length - 1].day} · ${done}/${ds.length} done</p></header>
    <div class="grid">${ds.map((w) => {
      const t = TY[w.type] || { short: w.title, c: 'var(--muted)' }, isD = store.isDone(p.id, w.day);
      return `<div class="tile${isD ? ' done' : ''}${w.day === nx ? ' next' : ''}">
        <button class="open" data-day="${w.day}" aria-label="Day ${w.day}, ${esc(w.name)}, ${esc(t.label || w.title)}${isD ? ', done' : ''}">
          <span class="n num">${w.day}</span><span class="nm">${esc(w.name)}</span>
          <span class="ty"><i class="dot" style="--c:${t.c}"></i>${esc(t.short)} · ${w.est}′</span>
        </button>
        <button class="chk" data-toggle="${w.day}" role="checkbox" aria-checked="${isD}" aria-label="Mark day ${w.day} done">${CHECK}</button>
      </div>`;
    }).join('')}</div></section>`;
  }).join('');
  const mins = p.minutes ? `~${Math.round(p.minutes[0])}–${Math.round(p.minutes[1])} min` : '';
  return `<div class="crumbs"><button class="back" data-go="programs">← All programs</button></div>
    <div class="phead"><div><div class="eyebrow">${esc(p.subject || 'Program')} · ${esc(p.split || '')} ${mins ? '· ' + mins : ''}</div>${own ? ownTitle(p) : `<div class="ptitle"><h1>${esc(p.name)}</h1>${starButton(p)}</div>`}<p class="lede">${esc(p.about || p.blurb)}</p>
      ${p.gear ? `<p class="gear">${esc(p.gear)}</p>` : ''}${own ? ownTools(p) : ''}</div>
    <div class="progress">${r > 1 ? `<div class="eyebrow">Round ${r}</div>` : ''}<div class="big num">${n}<small> / ${p.days.length} days</small></div><div class="bar"><b style="width:${(n / p.days.length) * 100}%"></b></div>
      <button class="btn ghost roundbtn" data-round-start="1">Start Round ${r + 1}</button></div></div>
  <div class="cycle">${Object.entries(TY).map(([k, t]) => `<div><i class="dot" style="--c:${t.c}"></i><b>${esc(t.label)}</b><span class="days">${cycleDays(p, k)}</span></div>`).join('')}</div>
  ${nw ? `<div class="nextup"><div class="t"><span class="eyebrow">Next up · Day ${nw.day}</span><b>${esc(nw.name)}</b><span>${esc((TY[nw.type] || {}).label || nw.title)} · about ${nw.est} min</span></div><button class="btn" data-day="${nw.day}">Open workout</button></div>`
       : `<div class="nextup"><div class="t"><b>All ${p.days.length} days done</b><span>That's the full program. Start Round ${r + 1} to go again.</span></div></div>`}
  ${levels}${whatNext(p)}${roundSheet(p, r)}${own ? deleteSheet(p) : ''}`;
}

/* ---------------- workout page ---------------- */
// one Workout Session per open day (kept while you look at exercise pages and come back)
const fmtFormat = KBFormats.NAMES;
function noteChip(it) { return it.note ? `<span class="notechip">${esc(it.note)}</span>` : ''; }
// Swap and Undo on a workout card; D is the open Day (see app/day.js)
function swapButton(D, bi, i) {
  if (!D || !D.alternatives(bi, i).length) return '';
  return `<button class="swapbtn" data-swap="${bi}:${i}" aria-label="Swap ${esc(EX[D.day.blocks[bi].items[i].ex].name)}">⇄ Swap</button>`;
}
function undoButton(D, bi, i) {
  const it = D.day.blocks[bi].items[i], s = D.swapBehind(bi, i);
  return `<button class="undobtn" data-unswap="${bi}:${i}" aria-label="Undo swap of ${esc(EX[it.ex].name)}">Undo swap${s && s.onward ? ` <span>(from day ${s.day} on)</span>` : ''}</button>`;
}
function exCard(it, i, bi, opts = {}) {
  const e = EX[it.ex], b = opts.block, st = opts.state, ses = opts.session;
  const straight = st && st.f === 'straight';
  const sets = b ? ses.itemSets(b, it) : 0, done = straight ? st.sets[i] : 0;
  const count = opts.count || `<b class="num">${it.n}</b><span>${unitText(e, it.n)}</span>`;
  const pips = straight ? `<div class="pips" role="group" aria-label="Sets of ${esc(e.name)} done"><span class="lbl">Sets</span>${Array.from({ length: sets }, (_, k) =>
    `<button class="pip num${done > k ? ' on' : ''}" data-pip="${bi}:${i}:${k + 1}" aria-pressed="${done > k}" aria-label="Set ${k + 1} of ${esc(e.name)} done">${k + 1}</button>`).join('')}</div>` : '';
  const work = straight && e.u === 'sec' && done < sets ? `<button class="workbtn" data-work="${bi}:${i}">▶ Start set ${done + 1} · ${it.n} s${e.side ? ' each side' : ''}</button>` : '';
  return `<article class="ex${straight && done >= sets ? ' fin' : ''}"><div class="exhead"><div class="ord">${opts.label || String(i + 1).padStart(2, '0')}${straight ? ` · ${sets} sets` : ''}</div>${swapButton(opts.D, bi, i)}</div>
    <button class="exlink" data-ex="${it.ex}" aria-label="${esc(e.name)}: how to and muscles worked"><div class="figbox">${fig(it.ex)}</div>
    <div class="cnt">${count}</div><div class="nm">${esc(e.name)}</div></button>
    ${it.travel ? `<span class="notechip swapped">Swapped for travel, from ${esc(EX[it.swappedFrom].name)}</span>` : it.swappedFrom ? `<span class="notechip swapped">Swapped from ${esc(EX[it.swappedFrom].name)}</span>${undoButton(opts.D, bi, i)}` : ''}${it.travelMissing ? '<span class="notechip needsgear">Needs gear: nothing to swap to</span>' : ''}${noteChip(it)}${e.load ? `<div class="ld">${esc(LOAD[e.load])}</div>` : ''}
    <p class="cue">${esc(e.cue)}</p>${work}${pips}</article>`;
}
function roundPips(id, total, done, what) {
  return `<div class="pips blockpips" role="group" aria-label="${what} done"><span class="lbl">${what}</span>${Array.from({ length: total }, (_, k) =>
    `<button class="pip num${done > k ? ' on' : ''}" data-rpip="${id}:${k + 1}" aria-pressed="${done > k}" aria-label="${what.replace(/s$/, '')} ${k + 1} done">${k + 1}</button>`).join('')}</div>`;
}
// every timed format gets a Big timer button beside its Start (the full-screen clock, clock.js)
function runButton(bi, st, text) { return `<span class="runrow"><button class="runbtn${st.done ? ' done' : ''}" data-run="${bi}">${st.done ? '✓ Done · run again' : '▶ Start ' + text}</button><button class="btbtn" data-bt>⛶ Big timer</button></span>`; }
function counter(bi, n, what) {
  return `<div class="counter" role="group" aria-label="${what}"><button data-count="${bi}:-1" aria-label="One fewer">−</button><span class="num"><b>${n}</b> ${what.toLowerCase()}</span><button data-count="${bi}:1" aria-label="One more">+</button></div>`;
}
// how each format looks on the workout page: { desc, body, side } (the words, the exercise cards, the Start button / counter)
const clockText = (secs) => `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
const BLOCK_VIEWS = {
  straight: ({ b, R, st, ses, card }) => {
    const sets = [...new Set(b.items.map((it) => ses.itemSets(b, it)))];
    return {
      desc: `${b.items.length} exercises · ${sets.join('/')} sets each · ${R.set} s between sets · ${R.exercise / 60} min between exercises`,
      body: `<div class="exgrid">${b.items.map((it, i) => card(it, i, { block: b, state: st, session: ses })).join('')}</div>`,
      side: '',
    };
  },
  superset: ({ b, bi, R, st, ses, card }) => ({
    desc: `Pairs: do the two back to back, then rest ${R.superset} s · ${b.sets} rounds per pair · ${R.exercise / 60} min between pairs`,
    body: Array.from({ length: ses.pairsOf(b) }, (_, pi) => b.items.slice(pi * 2, pi * 2 + 2)).map((pair, pi) => `<div class="pair"><div class="pairhead"><b>Pair ${LETTERS[pi]}</b>${roundPips(bi + ':' + pi, b.sets, st.sets[pi], 'Rounds')}</div>
      <div class="exgrid">${pair.map((it, j) => card(it, pi * 2 + j, { label: `${LETTERS[pi]}${j + 1}` })).join('')}</div></div>`).join(''),
    side: '',
  }),
  circuit: ({ b, bi, R, st, card }) => ({
    desc: `One after another with no rest · ${b.rounds} rounds · ${R.round / 60} min rest between rounds`,
    body: `<div class="exgrid">${b.items.map((it, i) => card(it, i)).join('')}</div>`,
    side: roundPips(bi, b.rounds, st.rounds, 'Rounds'),
  }),
  emom: ({ b, bi, st, card, perUnit }) => ({
    desc: `Every minute on the minute for ${b.minutes} min: do the reps, rest until the next minute. The exercise changes each minute.`,
    body: `<div class="exgrid">${b.items.map((it, i) => card(it, i, { label: `Min ${i + 1}, ${i + 1 + b.items.length}…`, count: perUnit(it, 'per minute') })).join('')}</div>`,
    side: runButton(bi, st, `EMOM · ${b.minutes} min`),
  }),
  amrap: ({ b, bi, st, card, perUnit }) => ({
    desc: `As many rounds as possible in ${b.minutes} min, moving steadily. Tap + after each round.`,
    body: `<div class="exgrid">${b.items.map((it, i) => card(it, i, { count: perUnit(it, 'per round') })).join('')}</div>`,
    side: runButton(bi, st, `AMRAP · ${b.minutes} min`) + counter(bi, st.count, 'Rounds'),
  }),
  tabata: ({ b, bi, st, card }) => ({
    desc: `${b.tabatas} × 4 min: 20 s as hard as you can, 10 s rest, 8 rounds, exercises rotate. 1 min between Tabatas. The timer runs it all.`,
    body: `<div class="exgrid">${b.items.map((it, i) => card(it, i, { count: '<b class="num">20</b><span>sec hard, 10 sec rest</span>' })).join('')}</div>`,
    side: runButton(bi, st, `Tabata · ${b.tabatas * 4} min`),
  }),
  flow: ({ b, bi, R, st, card }) => {
    const passes = b.repeat > 1 ? `, ${b.repeat === 2 ? 'twice' : 'three times'} through` : '';
    return {
      desc: `A guided sequence of ${b.items.length} poses${passes}. One Start runs it all: the voice names each pose and side, with 5 s to move into it.`,
      body: `<div class="exgrid">${b.items.map((it, i) => card(it, i)).join('')}</div>`,
      side: runButton(bi, st, `flow · ${clockText(KBFormats.of(b).time(b, R, EX))}`),
    };
  },
  bouts: ({ b, bi, R, st, card }) => {
    const mins = Math.round(b.items[0].n / 60);
    return {
      desc: `${b.items.length} bouts of ${mins} min, ${(b.rest || 60) / 60} min rest between. One Start runs them all: the voice calls each bout's combo, and you drill it until the bell.`,
      body: `<div class="exgrid">${b.items.map((it, i) => card(it, i, { label: `Bout ${i + 1}`, count: `<b class="num">${mins}</b><span>min bout</span>` })).join('')}</div>`,
      side: runButton(bi, st, `bouts · ${clockText(KBFormats.of(b).time(b, R, EX))}`),
    };
  },
  ladder: ({ b, bi, st, card }) => ({
    desc: `${b.minutes} min: 1 rep of each exercise, then 2, then 3… keep climbing until time runs out. Tap + after each rung.`,
    body: `<div class="exgrid">${b.items.map((it, i) => card(it, i, { count: `<b class="num">1→</b><span>${EX[it.ex].side ? 'reps each side, ' : 'reps, '}+1 each rung</span>` })).join('')}</div>`,
    side: runButton(bi, st, `Ladder · ${b.minutes} min`) + counter(bi, st.count, 'Rungs'),
  }),
};
function blockHTML(p, w, b, bi, ses, D) {
  const card = (it, i, o = {}) => exCard(it, i, bi, { ...o, D });
  const R = ses.rests, st = ses.state(bi), f = b.format || 'straight';
  const letter = b.kind === 'abs' ? 'Abs' : String(bi + 1);
  const perUnit = (it, what) => `<b class="num">${it.n}</b><span>${EX[it.ex].u === 'sec' ? 'sec' : 'reps'} ${what}${what === 'per minute' && EX[it.ex].side && EX[it.ex].u !== 'sec' ? ', each side' : ''}</span>`;
  const { desc, body, side } = BLOCK_VIEWS[f]({ b, bi, R, st, ses, card, perUnit });
  const next = w.blocks[bi + 1];
  const gap = next ? `<div class="between">Rest ${next.kind === 'abs' ? R.beforeAbs / 60 + ' min, then abs' : R.block / 60 + ' min, then ' + esc(next.title.toLowerCase())}</div>` : '';
  return `<section class="block" aria-labelledby="b${bi}">
      <div class="bhead"><div class="bletter${b.kind === 'abs' ? ' abs' : ''}">${letter}</div>
        <div class="bt"><h2 id="b${bi}">${esc(b.title)}${f !== 'straight' ? ` <span class="fmt">${fmtFormat[f]}</span>` : ''}</h2><div>${desc}</div></div>${side}
      </div>${body}
    </section>${gap}`;
}
function stretchBlock(b, key, label, n, ses) {
  const done = ses.stretchDone(key);
  const mins = Math.floor(b.seconds / 60), secs = b.seconds % 60;
  return `<section class="block stretch" aria-labelledby="s-${key}">
    <div class="bhead"><div class="bletter soft">${label}</div>
      <div class="bt"><h2 id="s-${key}">${esc(b.title)}</h2><div>${n} · ${mins}:${String(secs).padStart(2, '0')} · runs hands-free, one after another</div></div>
      <button class="runbtn${done ? ' done' : ''}" data-stretch="${key}">${done ? '✓ Done · run again' : `▶ Start ${key === 'warm' ? 'warm-up' : 'cool-down'}`}</button>
    </div>
    <div class="exgrid">${b.items.map((it) => { const e = EX[it.ex]; return `<article class="ex"><button class="exlink" data-ex="${it.ex}" aria-label="${esc(e.name)}: how to"><div class="figbox">${fig(it.ex)}</div>
      <div class="cnt"><b class="num">${it.n}</b><span>${e.side ? 'sec each side' : 'seconds'}</span></div><div class="nm">${esc(e.name)}</div></button><p class="cue">${esc(e.cue)}</p></article>`; }).join('')}</div>
  </section>`;
}
const heatLegend = () => `<div class="heatkey" aria-hidden="true"><span>Less</span>${[1, 2, 3, 4].map((n) => `<i class="mm-l${n}"></i>`).join('')}<span>More</span></div>`;
// a day as you'll do it (or did it): the program's day with its swaps applied
// a day as you'll do it (or did it): swaps applied; the Day module (days, made in main.js) knows how
const dayOf = (pid, n, round) => (pid === 'random' ? random.dayOf(n) : days.resolved(pid, n, round));
// every day marked done, in every program: [{ pid, day, time }]
const doneEntries = () => [...programs.ids().flatMap((pid) => store.entries(pid)), ...random.entries()]; // every round, and random workouts
// the stats for a scope ('all' or a program id) and a span, now (app/stats.js report)
// what a done day belongs to, for the Time tab: its family, subject and rests (a mixed day's blocks carry their own family)
const familyOfName = (subject) => (FAMILIES.find(([, list]) => list.includes(subject)) || ['Other'])[0];
function infoOf(e) {
  if (e.pid === 'random') {
    const c = (store.doc('random', e.day) || {}).choices || {};
    return { family: c.family || familyOfName(c.subject || (c.subjects || [])[0]), subject: 'Random workouts' };
  }
  const sm = programs.summary(e.pid), p = programs.get(e.pid);
  return sm ? { family: familyOfName(sm.subject), subject: sm.subject, rests: p && p.rests } : {};
}
const statsEntries = () => doneEntries().filter((x) => (statsView.pid === 'all' || x.pid === statsView.pid) && (statsView.pid === 'all' || statsView.round === undefined || x.round === statsView.round));
const statsReport = (scope, span, round) => KBStats.report({ entries: doneEntries(), dayOf, EX, names: MUSCLE_NAMES, infoOf }, { scope, round, span, now: new Date() });
function weekLine() {
  if (stillLoading(doneEntries().map((x) => x.pid)).length) return 'This week: loading…';
  const s = statsReport('all', 'week').totals;
  const nw = (t) => `<span class="nw">${t}</span>`; // keep each phrase on one line when it wraps
  return `${nw(`This week: ${plural(s.workouts, 'workout')}`)} · ${nw(`${Math.round(s.workoutMin)} min`)} + ${nw(`${Math.round(s.stretchMin)} min stretching`)}`;
}
// the next day not done yet after this one (or the first one left)
function nextPreview(p, w) {
  const nd = nextDay(p.id, w.day), n = nd && p.days[nd - 1];
  if (!n) return `<p class="fnext">Every day of ${esc(p.name)} is done.</p>`;
  const t = typesOf(p)[n.type] || { label: n.title };
  return `<button class="fnext" data-day="${n.day}"><b>Next: Day ${n.day} · ${esc(n.name)}</b><span>${esc(t.label || n.title)} · About ${n.est} min</span></button>`;
}
// When every day of the round is done: Start Round N+1 and up to three programs of the family that train differently
function whatNext(p) {
  if (store.count(p.id) < p.days.length) return '';
  const ids = suggestNext(p.id, programs.list(), (id) => store.entries(id).length, { families: FAMILIES });
  const card = (q) => `<button class="wncard" data-open-prog="${q.id}"><span class="eyebrow">${esc(q.subject)}</span><b>${esc(q.name)}</b><span>${(q.formats || ['straight']).map((f) => fmtFormat[f]).join(' · ')}</span></button>`;
  return `<section class="whatnext" aria-labelledby="wn-h"><h2 id="wn-h">What next?</h2>
    <button class="btn" data-round-start="1">Start Round ${store.round(p.id) + 1}</button>
    ${ids.length ? `<p class="muted">Or train differently:</p><div class="wnlist">${ids.map((id) => card(programs.summary(id))).join('')}</div>` : ''}</section>`;
}
// shown once every set of the day is ticked (after the cool-down, if you run it)
function finishCard(p, w, isD) {
  const v = KBStats.dayVolume(w, EX);
  const fmtMin = (m) => `${Math.round(m)} min`;
  return `<section class="finish" aria-labelledby="finish-h"><h2 id="finish-h">Workout complete</h2>
    <dl class="fstats">
      <div><dt>Sets</dt><dd class="num" data-testid="sets">${v.sets}</dd></div>
      <div><dt>Workout</dt><dd class="num" data-testid="workout-min">${fmtMin(v.workoutMin)}</dd></div>
      <div><dt>Stretching</dt><dd class="num" data-testid="stretch-min">${fmtMin(v.stretchMin)}</dd></div>
    </dl>
    <p class="fweek" data-testid="week">${weekLine()}</p>
    <div class="fmap"><h3>Muscles worked today</h3>${muscleMapSVG(v.muscles, 'Muscles worked today')}${heatLegend()}</div>
    <button class="btn ${isD ? 'done' : ''}" data-toggle="${w.day}" aria-pressed="${isD}">${isD ? `✓ Day ${w.day} done` : `Mark day ${w.day} as done`}</button>
    ${nextPreview(p, w)}
    ${whatNext(p)}
  </section>`;
}
// Swap sheet: { key: 'pid:day', bi, i, to? } while open
let swapState = null;
function swapSheet(D) {
  const st = swapState, p = D.program, w = D.day;
  if (!st || st.key !== p.id + ':' + w.day) return '';
  const b = w.blocks[st.bi], it = b.items[st.i], from = EX[it.ex];
  const reps = (id) => { const e = EX[id]; return `${KBEx.scaleReps(e, e.r[w.level - 1], b.format)} ${unitText(e)}`; };
  const body = st.to
    ? `<p><b>${esc(from.name)}</b> → <b>${esc(EX[st.to].name)}</b> · ${esc(reps(st.to))}</p>
      <div class="choices"><button class="btn" data-swap-apply="day">Today only</button>
        ${p.id === 'random' ? '' : `<button class="btn ghost choice" data-swap-apply="onward">Rest of the program<span>Days ${w.day}–${p.days.length}, wherever ${esc(from.name)} appears</span></button>`}
        <button class="btn ghost" data-swap-back="1">Back</button></div>`
    : `<p class="muted">Works the same main muscle (${esc(MUSCLE_NAMES[from.muscles.primary[0]])}) with ${p.id === 'random' ? "this workout's" : "this program's"} equipment.</p>
      <ul class="altlist">${D.alternatives(st.bi, st.i).map((id) => `<li><button data-swap-to="${id}"><b>${esc(EX[id].name)}</b><span>${esc(reps(id))}${EX[id].load ? ' · ' + esc(LOAD[EX[id].load]) : ''}</span></button></li>`).join('')}</ul>`;
  return `<div class="sheetwrap"><button class="sheetbg" data-swap-cancel="1" aria-label="Close"></button>
    <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="swap-h"><h2 id="swap-h">Swap ${esc(from.name)}</h2>${body}
    <button class="btn ghost sheetclose" data-swap-cancel="1">Cancel</button></div></div>`;
}
function viewDay() {
  const p = prog(), D = days.open(p.id, route.day);
  if (!D) return viewProgram();
  const w = D.day;
  if (!w) return viewProgram();
  rememberPid(p.id);
  const ses = D.session();
  if (ses.started() !== null) S.resume(ses.started());
  const TY = typesOf(p), t = TY[w.type] || { label: w.title, c: 'var(--muted)' }, isD = store.isDone(p.id, w.day);
  const nEx = w.blocks.reduce((n, b) => n + b.items.length, 0);
  return `<div class="crumbs"><button class="back" data-go="program">← ${esc(p.name)}</button>
      <div class="step"><button data-day="${w.day - 1}" ${w.day <= 1 ? 'disabled' : ''} aria-label="Previous day">‹</button><button data-day="${w.day + 1}" ${w.day >= p.days.length ? 'disabled' : ''} aria-label="Next day">›</button></div></div>
    <div class="whead"><div><div class="eyebrow">${store.round(p.id) > 1 ? `Round ${store.round(p.id)} · ` : ''}Day ${w.day} · ${esc(p.levels[w.level - 1])}</div><h1>${esc(w.name)}</h1>
      <p class="daysum">${KBSummary.daySummary(w, p, KBEx).map((l) => `<span>${esc(l)}</span>`).join('')}</p>
      <div class="meta"><span class="ty"><i class="dot" style="--c:${t.c}"></i>${esc(t.label || w.title)}</span><span>About ${w.est} min${w.stretchMin ? ` + ${w.stretchMin} min stretching` : ''}</span><span>${nEx} exercises</span></div>
      ${D.canShort() ? `<button class="shortbtn" data-short="1" aria-pressed="${D.short()}">${D.short() ? `<b>Short on time</b> · about ${w.est} min instead of ${w.short.from}. Tap for the full day.` : `<b>Short on time?</b> Make today about ${KBShort.TARGET} min`}</button>` : ''}</div>
      <button class="btn ${isD ? 'done' : ''}" data-toggle="${w.day}" aria-pressed="${isD}">${isD ? '✓ Done' : 'Mark as done'}</button></div>
    ${D.restored() ? '<p class="resumed" role="status">Picked up where you left off</p>' : ''}${travelNote(D)}
    <p class="how">Tap a set, round or pair number when you finish it and the right rest starts on the timer. EMOM, AMRAP, Tabata, ladder, bout and guided-flow blocks have a Start button that runs the clock for you.</p>
    ${w.warmup ? stretchBlock(w.warmup, 'warm', 'W', 'Before you start', ses) : ''}
    ${w.blocks.map((b, bi) => blockHTML(p, w, b, bi, ses, D)).join('')}
    ${w.cooldown ? `<div class="between">Then stretch</div>${stretchBlock(w.cooldown, 'cool', 'C', w.blocks.at(-1).kind === 'abs' ? 'After the abs' : 'After the workout', ses)}` : ''}
    ${ses.allDone() ? finishCard(p, w, isD) : ''}
    ${swapSheet(D)}${roundSheet(p, store.round(p.id))}
    <p class="note">Tap any exercise for how to do it and the muscles it works. Weights are starting points: pick a load where the last two reps are hard but clean. "Go one weight up" means the next dumbbell size or the heavier bell; "3 s lowering" means a slow 3-second lowering on every rep.</p>`;
}

/* ---------------- exercise page + library ---------------- */
function usesEx(w, id) { return [...w.blocks.flatMap((b) => b.items), ...(w.warmup ? w.warmup.items : []), ...(w.cooldown ? w.cooldown.items : [])].some((it) => it.ex === id); }
// "Also in" needs the exercise index (data/index.json): asked for when the first exercise page opens, the page draws again
// when it is here; if it can't be had (offline, never cached) the card says so, and the next exercise tries again
let usageLoading = false, usageError = null;
function viewExercise() {
  const e = EX[route.ex], m = e.muscles, p = prog();
  const days = p.days.filter((w) => usesEx(w, e.id)).map((w) => w.day);
  if (usageError && usageError.ex !== e.id) usageError = null;
  if (!programs.usageReady() && !usageLoading && !usageError) {
    usageLoading = true;
    programs.loadUsage().then(() => { usageLoading = false; rerender(); }, (err) => { usageLoading = false; usageError = { ex: e.id, message: err.message }; rerender(); });
  }
  const others = programs.usageReady() ? programs.programsUsing(e.id).filter((id) => id !== p.id).map((id) => programs.summary(id)) : [];
  const names = (arr) => arr.map((k) => `<span class="chip">${MUSCLE_NAMES[k]}</span>`).join(' ');
  const r = e.r, stretch = e.cat === 'warmup' || e.cat === 'cooldown';
  const dose = stretch ? `${r[0]} s${e.side ? ' each side' : ''}` : e.u === 'sec' ? `${r.join(' / ')} s${e.side ? ' each side' : ''} (Level I / II / III)` : `${r.join(' / ')} ${unitText(e)} (Level I / II / III)`;
  return `<div class="crumbs"><button class="back" data-back="1">← Back</button></div>
    <div class="eyebrow">${CAT[e.cat] || ''}</div><h1>${esc(e.name)}</h1>
    <div class="expage">
      <div class="card"><div class="bigfig">${fig(e.id)}</div>
        <dl class="facts">
          <div><dt>How to</dt><dd>${esc(e.cue)}</dd></div>
          <div><dt>${stretch || e.u === 'sec' ? 'Hold' : 'Reps'}</dt><dd>${dose}</dd></div>
          <div><dt>Equipment</dt><dd>${e.load ? esc(LOAD[e.load]) : (e.equip || []).includes('bar') ? 'Pull-up bar' : 'Bodyweight, mat'}</dd></div>
        </dl></div>
      <div class="card"><h2>Muscles worked</h2>${muscleMapSVG(m.primary, m.secondary, 'Muscles worked by ' + e.name)}
        <div class="legend">
          <div class="row"><i class="key" style="background:var(--accent)"></i><span class="lab">Main</span>${names(m.primary)}</div>
          ${m.secondary.length ? `<div class="row"><i class="key" style="background:var(--mm-sec)"></i><span class="lab">Also</span>${names(m.secondary)}</div>` : ''}
        </div></div>
    </div>
    ${days.length ? `<div class="card" style="margin-top:16px"><h2>In ${esc(p.name)}</h2><div style="color:var(--muted);font-size:14px">Used on ${days.length} day${days.length > 1 ? 's' : ''}</div>
      <div class="daychips">${days.map((d) => `<button class="num" data-day="${d}" aria-label="Open day ${d}">${d}</button>`).join('')}</div></div>` : ''}
    ${others.length ? `<div class="card" style="margin-top:16px"><h2>Also in</h2><div class="daychips">${others.map((q) => `<button class="progchip" data-open-prog="${q.id}">${esc(q.name)}</button>`).join('')}</div></div>` : usageError ? `<div class="card" style="margin-top:16px"><h2>Also in</h2><p class="muted" role="status">${esc(usageError.message)}</p></div>` : ''}`;
}
/* Exercises page: a search (name, muscle, cue) and chips by category and equipment, through KBLibrary.searchExercises.
   Typing redraws only the results, so the field keeps focus; the search stays while you look at an exercise and come back. */
const exSearch = { q: '', cat: 'all', gear: 'all', muscles: [], map: false }; // muscles, map: the "By muscle" view (Phase 9)
const exFound = () => KBLibrary.searchExercises(EX, exSearch.q, exSearch, { names: MUSCLE_NAMES, cats: Object.keys(CAT) });
const exCounter = (r) => (r.count === r.total ? `${r.total} exercises` : `${r.count} of ${r.total} exercises`);
function exResults() {
  const r = exFound();
  const chip = (k, key, label, on, count) => `<button class="fchip acc" data-exf="${k}:${key}" aria-pressed="${on}">${esc(label)}${count === undefined ? '' : ` <span class="fcount">${count}</span>`}</button>`;
  const card = (e) => `<article class="ex"><button class="exlink" data-ex="${e.id}" aria-label="${esc(e.name)}: how to and muscles worked"><div class="figbox">${fig(e.id)}</div><div class="nm">${esc(e.name)}</div></button>${e.load ? `<div class="ld">${esc(LOAD[e.load])}</div>` : ''}<p class="cue">${esc(e.cue)}</p></article>`;
  if (exSearch.muscles.length) { // picked muscles: one list, best first (the order is the point, so no category sections)
    const names = exSearch.muscles.map((m) => MUSCLE_NAMES[m]).join(' + ');
    return `${musclePrograms(names)}${chipsHTML(r, chip)}${r.list.length ? `<section class="libcat"><h2>Best for ${esc(names)}</h2><div class="exgrid">${r.list.map(card).join('')}</div></section>` : '<p class="lede" style="margin-top:24px">No exercises match. Try another word or fewer filters.</p>'}`;
  }
  const sections = r.cats.slice(1).map((c) => { const list = r.list.filter((e) => e.cat === c.key); return list.length ? `<section class="libcat"><h2>${CAT[c.key]}</h2><div class="exgrid">${list.map(card).join('')}</div></section>` : ''; }).join('');
  return `${chipsHTML(r, chip)}
    ${sections || '<p class="lede" style="margin-top:24px">No exercises match. Try another word or fewer filters.</p>'}`;
}
function chipsHTML(r, chip) {
  return `<div class="filters" role="group" aria-label="Filter by category">${r.cats.map((c) => chip('cat', c.key, c.key === 'all' ? 'All' : CAT[c.key], c.pressed, c.count)).join('')}</div>
    <div class="filters" role="group" aria-label="Filter by equipment">${KBLibrary.GEAR.map(([k, label]) => chip('gear', k, label, exSearch.gear === k)).join('')}</div>`;
}
/* "By muscle" (Phase 9 ticket 1): tap muscles on the front/back map (or their chips, for keyboards and screen readers);
   several combine. The picked ones are darkest on the map. */
function exMap() {
  const picked = exSearch.muscles;
  const toggle = `<button class="lenline" data-exmap="1" aria-expanded="${exSearch.map}">By muscle: <b>${picked.length ? esc(picked.map((m) => MUSCLE_NAMES[m]).join(', ')) : 'Any'}</b> <span aria-hidden="true">${exSearch.map ? '▴' : '▾'}</span></button>`;
  if (!exSearch.map) return toggle;
  const heat = Object.fromEntries(Object.keys(MUSCLE_NAMES).map((m) => [m, picked.includes(m) ? 1 : 0]));
  return `${toggle}<div class="mmpick">${muscleMapSVG(heat, 'Pick muscles: tap one to add or remove it')}</div>
    <div class="filters" role="group" aria-label="Muscles">${Object.entries(MUSCLE_NAMES).map(([m, n]) => `<button class="fchip acc" data-exmuscle="${m}" aria-pressed="${picked.includes(m)}">${esc(n)}</button>`).join('')}${picked.length ? '<button class="fchip" data-exmuscle-clear="1">Clear</button>' : ''}</div>`;
}
/* Programs that train the picked muscles (Phase 9 ticket 2): the top 5 by muscle focus, library (data/muscles.json) and
   your own (worked out here from their days). Shown above the exercises: five cards, before a long list. */
let focusState = { data: null, loading: false, error: null };
function musclePrograms(names) {
  if (!focusState.data && !focusState.loading && !focusState.error) {
    focusState.loading = true;
    focusFile.load().then((data) => { focusState = { data, loading: false, error: null }; exRefresh(); }, (e) => { focusState = { data: null, loading: false, error: e.message }; exRefresh(); });
  }
  const head = `<h2>Programs for ${esc(names)}</h2>`;
  if (focusState.error) return `<section class="libcat">${head}<p class="muted" role="status">${esc(focusState.error)}</p></section>`;
  if (!focusState.data) return `<section class="libcat">${head}<p class="muted loading" role="status">Finding programs…</p></section>`;
  const own = programs.list().filter((p) => p.source === 'own' && programs.get(p.id)).map((p) => [p.id, KBStats.programFocus(programs.get(p.id).days, EX)]);
  const focus = { ...Object.fromEntries(own), ...Object.fromEntries(Object.entries(focusState.data).filter(([pid]) => programs.has(pid))) };
  const ids = KBLibrary.rankPrograms(focus, exSearch.muscles, 5);
  const card = (q) => `<button class="wncard" data-open-prog="${q.id}"><span class="eyebrow">${esc(q.subject)}</span><b>${esc(q.name)}</b><span>${exSearch.muscles.map((m) => `${MUSCLE_NAMES[m]} ${Math.round((focus[q.id][m] || 0) * 100)}%`).join(' · ')}</span></button>`;
  return `<section class="libcat">${head}<div class="wnlist">${ids.map((id) => card(programs.summary(id))).join('')}</div>
    <p class="note">Each program's share of its sets that works the muscle, over its 60 days.</p></section>`;
}
function exMuscle(m) { exSearch.muscles = m === null ? [] : KBLibrary.toggleIn(exSearch.muscles, m); exRefresh(); }
// redraw the counter, the map and the results only (typing in the search field keeps its focus)
function exRefresh() { const box = $('#exresults'), n = $('#excount'), mp = $('#exmap'); if (box) box.innerHTML = exResults(); if (n) n.textContent = exCounter(exFound()); if (mp) mp.innerHTML = exMap(); }
function exFilter(k, v) { exSearch[k] = v; exRefresh(); }
function viewLibrary() {
  return `<div class="eyebrow" id="excount">${exCounter(exFound())}</div><h1>Exercises</h1><p class="lede">Every movement and stretch used in the programs, with the equipment you have: dumbbells, one kettlebell, a pull-up bar and a mat. Tap one to see the muscles it works.</p>
  <label class="exsearch"><span class="sr">Search exercises</span><input id="ex-search" type="search" placeholder="Search by name, muscle or cue" value="${esc(exSearch.q)}" autocomplete="off" enterkeyhint="search"></label>
  <div id="exmap">${exMap()}</div>
  <div id="exresults">${exResults()}</div>`;
}

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
// Import in progress: null · { error } · { done: message } · an import plan (KBBackup.planImport)
let importState = null;
function importReview(st) {
  const ids = Object.keys(st.diff), add = st.added, remove = st.removed;
  const line = (pid) => {
    const { added, removed } = st.diff[pid];
    const parts = [];
    if (added.length) parts.push(`+${plural(added.length, 'day')} (${KBBackup.dayRanges(added)})`);
    if (removed.length) parts.push(`−${plural(removed.length, 'day')} (${KBBackup.dayRanges(removed)})`);
    return `<li>${esc(programs.summary(pid).name)}: ${parts.join(' · ')}</li>`;
  };
  // own programs and random workouts: +added · −only Replace would remove · changed
  const DOC_TITLE = { programs: 'Own programs', random: 'Random workouts' };
  const docLine = (c) => {
    const d = st.docDiff[c], names = (l) => l.map((x) => esc(x.name)).join(', ');
    const parts = [];
    if (d.added.length) parts.push(`+${d.added.length} (${names(d.added)})`);
    if (d.removed.length) parts.push(`−${d.removed.length} (${names(d.removed)})`);
    if (d.changed.length) parts.push(`${d.changed.length} changed (${names(d.changed)})`);
    return parts.length ? `<li>${DOC_TITLE[c]}: ${parts.join(' · ')}</li>` : '';
  };
  const docLines = ['programs', 'random'].map(docLine).join('');
  const prefsLine = st.prefsNote ? `<p class="muted">Preferences: the file has ${st.prefsNote.mine ? 'different ones from yours. Merge keeps yours; Replace uses the file\'s' : 'some and this device has none. Merge and Replace both use the file\'s'}.</p>` : '';
  const swapLine = st.swapNotes.length ? `<p class="muted">Swaps: ${st.swapNotes.map((x) => `${esc(programs.summary(x.pid).name)} has ${x.file} in the file (you have ${x.mine})`).join('; ')}. Merge keeps both; Replace uses the file's.</p>` : '';
  const roundLine = st.roundNotes.length ? `<p class="muted">Rounds: ${st.roundNotes.map((x) => `${esc(programs.summary(x.pid).name)} is on Round ${x.file} in the file (you're on Round ${x.mine})`).join('; ')}. Merge keeps whichever is further along.</p>` : '';
  const skipped = st.unknown.length ? `<p class="muted">Skipped ${plural(st.unknown.length, 'program')} this app doesn't have: ${st.unknown.map(esc).join(', ')}</p>` : '';
  const body = st.hasChanges
    ? `<ul class="difflist">${ids.map(line).join('')}${docLines}</ul>${swapLine}${roundLine}${prefsLine}${skipped}
      <p class="muted">Merge keeps every day from both. Replace makes each program in the file match it exactly${remove ? ', so the days marked − are removed' : ''}.</p>
      <div class="actions">${st.canMerge ? `<button class="btn" data-backup="merge">Merge${add ? `: add ${plural(add, 'day')}` : ''}</button>` : ''}
        <button class="btn ghost" data-backup="replace">Replace: add ${add}, remove ${remove}</button>
        <button class="btn ghost" data-backup="cancel">Cancel</button></div>`
    : `<p>This backup matches your progress. Nothing to import.</p>${skipped}<div class="actions"><button class="btn ghost" data-backup="cancel">Close</button></div>`;
  return `<div class="review" id="import-review"><p><b>${esc(st.name)}</b></p>${body}</div>`;
}
function viewSettings() {
  const counts = programs.ids().map((pid) => store.count(pid)).filter((n) => n > 0);
  const days = counts.reduce((a, n) => a + n, 0);
  const st = importState || {};
  return `<h1>Settings</h1>
  <section class="card setting"><h2>Backup</h2>
    <p>Download the days you've marked done in every program as one file. Keep it somewhere safe, or import it on another device.</p>
    <p class="muted" id="backup-summary">${days ? `${plural(days, 'day')} done across ${plural(counts.length, 'program')}` : 'No days marked done yet'}</p>
    <div class="actions"><button class="btn" data-backup="export">Export progress</button>
      <button class="btn ghost" data-backup="import">Import a backup</button></div>
    ${st.error ? `<p class="err" role="alert">${esc(st.error)}</p>` : ''}
    ${st.done ? `<p class="ok" role="status">${esc(st.done)}</p>` : ''}
    ${st.diff ? importReview(st) : ''}
  </section>
  <section class="card setting"><h2>Workout history</h2>
    <p>Every day you marked done as a spreadsheet file (CSV): date, program, day, level, minutes, sets and reps.</p>
    <div class="actions"><button class="btn ghost" data-csv="1">Download CSV</button></div>
    ${csvNote ? `<p class="hint" role="status">${esc(csvNote)}</p>` : ''}
  </section>
  <section class="card setting"><h2>Hidden subjects</h2>
    ${KBLibrary.subjectsOf(programs.list().filter((p) => p.source !== 'own'), FAMILIES).map(([fam, list]) => `<div class="filters hidesubj" role="group" aria-label="Hide ${esc(fam)} subjects"><span class="fname">${esc(fam)}</span>${list.map((x) => `<button class="fchip acc" data-hide="${esc(x)}" aria-pressed="${libraryPrefs().hidden.includes(x)}">${esc(x)}</button>`).join('')}</div>`).join('')}
    <p class="muted">Ticked subjects don't show on the Programs page: no chip, no shelf, not counted. Programs you starred stay in Favourites. Synced with your account.</p>
  </section>
  <section class="card setting"><h2>Travel mode</h2>
    <div class="filters" role="group" aria-label="Travel mode">${[[null, 'Off'], ...Object.entries(TRAVEL_TEXT)].map(([k, l]) => `<button class="fchip acc" data-travel="${k || ''}" aria-pressed="${travelMode() === k}">${esc(l)}</button>`).join('')}</div>
    <p class="muted">Away from your gear? Every workout swaps the exercises that need it for ones that work the same muscles, until you turn this off. Synced with your account.</p>
  </section>
  <section class="card setting"><h2>Voice</h2>
    <label class="switch"><input type="checkbox" role="switch" id="voice-toggle"${T.voiceOn() ? ' checked' : ''}><span>Voice cues</span></label>
    <p class="muted">During holds and one-side moves, the phone says "Halfway", "Switch sides" and "Done". In guided flows it also names each pose and side, and in boxing bouts it calls each combo. The beeps stay either way. Remembered on this device.</p>
  </section>`;
}

/* CSV of every done day (Phase 8 ticket 7): the programs are loaded first, so no day is left out */
let csvNote = '';
function downloadCSV() {
  const all = doneEntries(), pids = [...new Set(all.map((e) => e.pid).filter((p) => p !== 'random'))];
  csvNote = ''; render();
  return Promise.all(pids.map((p) => programs.load(p))).then(() => {
    const nameOf = (pid) => (programs.summary(pid) || { name: pid }).name;
    download(`kettle-bar-workouts-${KBRandom.dayKey(new Date())}.csv`, KBStats.toCSV(doneEntries(), { dayOf, EX, nameOf }), 'text/csv');
  }, () => { csvNote = "Some programs couldn't load (offline?), so the file wasn't made. Try again when you're online."; render(); });
}

/* ---------------- travel mode (Phase 7) ----------------
   A preference (prefs doc 'main', `travel`), synced: the Day module swaps, on the day page, what needs missing gear. */
const TRAVEL_TEXT = { nobar: 'No bar', kb: 'Kettlebell only', bw: 'Bodyweight only' };
const travelMode = () => { const m = (store.doc('prefs', 'main') || {}).travel; return TRAVEL_TEXT[m] ? m : null; };
function setTravel(mode) { setPref('travel', mode); }
// one field of the synced prefs doc; an empty value (null, []) removes the field, so a doc keeps only what was set
function setPref(key, value) {
  const prefs = { ...(store.doc('prefs', 'main') || {}) };
  if (value && (!Array.isArray(value) || value.length)) prefs[key] = value; else delete prefs[key];
  delete prefs.updatedAt;
  store.setDoc('prefs', 'main', prefs);
}
function travelNote(D) {
  const mode = D.travel && D.travel();
  if (!mode) return '';
  const items = D.day.blocks.flatMap((b) => b.items), swapped = items.filter((it) => it.travel).length, stuck = items.filter((it) => it.travelMissing).length;
  const what = swapped ? `${plural(swapped, 'exercise')} swapped for today` : 'nothing needed swapping today';
  return `<p class="travelnote" role="status"><b>Travel mode: ${esc(TRAVEL_TEXT[mode].toLowerCase())}.</b> ${what}${stuck ? `; ${plural(stuck, 'exercise')} still ${stuck === 1 ? 'needs' : 'need'} gear (nothing works the same muscles without it)` : ''}. <button class="linkbtn" data-go="settings">Change</button></p>`;
}

/* ---------------- stats ---------------- */
const fmtNum = (n) => Math.round(n).toLocaleString('en-US');
function statTiles(s) {
  const tile = (label, value) => `<div class="tile-stat" role="group" aria-label="${label}"><span class="lbl">${label}</span><b>${fmtNum(value)}</b></div>`;
  return `<div class="kpis">${tile('Workouts', s.workouts)}${tile('Workout minutes', s.workoutMin)}${tile('Stretching minutes', s.stretchMin)}${tile('Sets', s.sets)}${tile('Reps', s.reps)}</div>`;
}
// the Stats page's switches: time span and program ('all' or a program id)
// and the tab (Phase 8): Overview · Muscles · Time, the switches staying above them and carrying across
const statsView = { span: 'week', pid: 'all', tab: 'overview' };
const STAT_TABS = [['overview', 'Overview'], ['muscles', 'Muscles'], ['time', 'Time'], ['exercises', 'Exercises'], ['history', 'History']];
const SPANS = [['week', 'This week'], ['4weeks', 'Last 4 weeks'], ['3months', 'Last 3 months'], ['year', 'This year'], ['all', 'All time']];
const shortDate = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
function weekRows(rows, caption = 'Week by week', head = 'Week of', label = shortDate) {
  const n = (x) => `<td class="num">${fmtNum(x)}</td>`;
  return `<div class="table-scroll"><table class="weeks"><caption>${caption}</caption>
    <thead><tr><th scope="col">${head}</th><th scope="col">Workouts</th><th scope="col">Min</th><th scope="col">Stretch min</th><th scope="col">Sets</th><th scope="col">Reps</th></tr></thead>
    <tbody>${rows.map((r) => `<tr${r.workouts ? '' : ' class="empty"'}><th scope="row">${label(r.start)}</th>${n(r.workouts)}${n(r.workoutMin)}${n(r.stretchMin)}${n(r.sets)}${n(r.reps)}</tr>`).join('')}</tbody></table></div>`;
}
function muscleBalance(r, what) {
  const ranked = r.muscles;
  const body = ranked.length
    ? `${muscleMapSVG(r.totals.muscles, `Muscle balance: ${what}`)}${heatLegend()}
      <ol class="rank">${ranked.map((m) => `<li><span class="rname">${esc(m.name)}</span><span class="rbar"><i style="width:${(m.share * 100).toFixed(1)}%"></i></span><span class="rval num">${fmtNum(m.load)}</span></li>`).join('')}</ol>
      <p class="note">Weighted sets: each set counts 1 for the main muscles and ½ for the secondary ones.</p>`
    : '<p class="muted">No sets in this span yet.</p>';
  return `<section class="card balance" aria-labelledby="bal-h"><h2 id="bal-h">Muscle balance</h2>${body}</section>`;
}
/* The Time tab (Phase 8 ticket 5): where the workout minutes went, by family (tap one for its subjects) and by format,
   and the kind of work: strength sets and reps, cardio minutes, mind & body minutes. */
const fmtMin = (m) => `${fmtNum(m)} min`;
function minuteBars(entries, label, opts = {}) {
  const list = entries.filter(([, m]) => m > 0).sort((a, b) => b[1] - a[1]);
  const max = list.length ? list[0][1] : 1;
  const row = ([k, m]) => {
    const bar = `<span class="rbar"><i style="width:${((m / max) * 100).toFixed(1)}%"></i></span><span class="rval num">${fmtMin(m)}</span>`;
    const name = opts.name ? opts.name(k) : k;
    if (opts.open === undefined) return `<li><span class="rname">${esc(name)}</span>${bar}</li>`;
    const open = opts.open === k, subs = open ? minuteBars(Object.entries(opts.subs(k)), `${name} by subject`) : '';
    return `<li class="fam"><button class="famrow" data-stat-family="${esc(k)}" aria-expanded="${open}"><span class="rname">${esc(name)} <span aria-hidden="true">${open ? '▴' : '▾'}</span></span>${bar}</button>${subs}</li>`;
  };
  return `<ol class="rank${opts.open !== undefined ? ' fams' : ''}" aria-label="${esc(label)}">${list.map(row).join('')}</ol>`;
}
function timeTab(r) {
  const k = r.kinds, tile = (label, value, sub) => `<div class="tile-stat" role="group" aria-label="${label}"><span class="lbl">${label}</span><b>${fmtNum(value)}</b>${sub ? `<span class="lbl">${sub}</span>` : ''}</div>`;
  return `<section class="card timecard" aria-labelledby="where-h"><h2 id="where-h">Where time goes</h2>
      ${minuteBars(Object.entries(r.byFamily), 'Workout minutes by family', { open: statsView.family || '', subs: (f) => r.bySubject[f] || {} })}
      <h3>By format</h3>${minuteBars(Object.entries(r.byFormat), 'Workout minutes by format', { name: (f) => fmtFormat[f] || f })}
      <p class="note">Workout minutes, stretching not included. A mixed day is split by its blocks.</p></section>
    <section class="card timecard" aria-labelledby="kind-h"><h2 id="kind-h">Kind of work</h2>
      <div class="kpis kinds">${tile('Strength sets', k.strengthSets, `${fmtNum(k.strengthReps)} reps`)}${tile('Cardio minutes', k.cardioMin)}${tile('Mind & body minutes', k.mindMin)}</div></section>`;
}
/* The trend (Phase 8 ticket 6): workout minutes per week as a line (per month as bars for This year), oldest on the
   left. One series, so no legend: the heading names it; each point and bar has a tooltip, and the table below the
   breakdown holds the same numbers. */
const monthName = (d) => d.toLocaleDateString('en-GB', { month: 'short' });
function trendChart(rows, per, o = {}) {
  const val = o.value || ((d) => d.workoutMin), id = o.id || 'trend-h', title = o.title || `Minutes per ${per}`;
  const data = rows.slice().reverse(), W = 340, H = 150, L = 30, R = 8, T = 10, B = 22, iw = W - L - R, ih = H - T - B;
  const top = o.max || Math.max(10, ...data.map(val)), step = o.step || (top <= 60 ? 15 : top <= 150 ? 30 : top <= 300 ? 60 : 120);
  const max = Math.ceil(top / step) * step, y = (v) => T + ih - (v / max) * ih;
  const grid = Array.from({ length: max / step + 1 }, (_, i) => i * step).map((v) => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="tgrid"/><text x="${L - 6}" y="${y(v) + 4}" class="tax" text-anchor="end">${v}</text>`).join('');
  const tip = (d) => `${per === 'month' ? d.start.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : `Week of ${shortDate(d.start)}`}: ${o.tip ? o.tip(d) : `${fmtMin(d.workoutMin)}, ${plural(d.workouts, 'workout')}`}`;
  let marks, labels;
  if (per === 'month') {
    const slot = iw / data.length, bw = Math.min(26, slot - 6);
    marks = data.map((d, i) => { const x = L + slot * i + (slot - bw) / 2, h = Math.max(0, y(0) - y(val(d))), r = Math.min(4, h);
      return `<g class="tmark"><rect x="${L + slot * i}" y="${T}" width="${slot}" height="${ih}" class="thit"/>${h ? `<path d="M${x},${y(0)}v${-(h - r)}q0,${-r} ${r},${-r}h${bw - 2 * r}q${r},0 ${r},${r}v${h - r}z" class="tbar"/>` : ''}<title>${esc(tip(d))}</title></g>`; }).join('');
    labels = data.map((d, i) => `<text x="${L + slot * (i + 0.5)}" y="${H - 6}" class="tax" text-anchor="middle">${esc(monthName(d.start).slice(0, 1))}</text>`).join('');
  } else {
    const x = (i) => L + (data.length === 1 ? iw / 2 : (i / (data.length - 1)) * iw);
    marks = `<polyline points="${data.map((d, i) => `${x(i)},${y(val(d))}`).join(' ')}" class="tline"/>` + data.map((d, i) => `<g class="tmark"><rect x="${x(i) - 10}" y="${T}" width="20" height="${ih}" class="thit"/><circle cx="${x(i)}" cy="${y(val(d))}" r="4" class="tdot"/><title>${esc(tip(d))}</title></g>`).join('');
    labels = `<text x="${L}" y="${H - 6}" class="tax">${esc(shortDate(data[0].start))}</text><text x="${W - R}" y="${H - 6}" class="tax" text-anchor="end">${esc(shortDate(data[data.length - 1].start))}</text>`;
  }
  return `<section class="card trend" aria-labelledby="${id}"><h2 id="${id}">${title}</h2>
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || `Workout minutes per ${per}`)}, ${esc(data.map((d) => `${tip(d)}`).join('; '))}">${grid}${marks}${labels}</svg></section>`;
}
/* The Exercises tab (Phase 8 ticket 7): each exercise done in the span (swaps counted as what was done), on how many
   days and when last, tapping through to its page; then each program's level, week by week. */
const ROMAN = ['', 'I', 'II', 'III'];
const EX_SHOWN = 20; // the rest behind "Show all"
function exercisesTab(r) {
  const opts = { dayOf, from: r.from, to: r.to }, mine = statsEntries();
  const hist = KBStats.exerciseHistory(mine, opts).filter((h) => EX[h.ex]);
  const shown = statsView.allEx ? hist : hist.slice(0, EX_SHOWN);
  const row = (h) => `<li><button class="exhrow" data-ex="${h.ex}"><span class="rname">${esc(EX[h.ex].name)}</span><span class="exhmeta">${plural(h.days, 'day')} · last ${shortDate(h.last)}</span></button></li>`;
  const more = hist.length > EX_SHOWN ? `<button class="linkbtn" data-stat-allex="1">${statsView.allEx ? 'Show fewer' : `Show all ${hist.length}`}</button>` : '';
  const levels = KBStats.levelOverTime(mine, opts);
  const nameOf = (pid) => (pid === 'random' ? 'Random workouts' : programs.summary(pid) ? programs.summary(pid).name : pid);
  const strip = (lv) => `<div class="lvrow"><span class="rname">${esc(nameOf(lv.pid))}</span><ol class="lvstrip" aria-label="${esc(nameOf(lv.pid))}, level by week">${lv.weeks.map((w) => `<li class="lv${w.level || 0}" title="Week of ${shortDate(w.start)}: ${w.level ? `level ${ROMAN[w.level]}` : 'nothing done'}"><span class="sr">Week of ${shortDate(w.start)}: </span>${w.level ? ROMAN[w.level] : '<span aria-hidden="true">·</span><span class="sr">nothing done</span>'}</li>`).join('')}</ol></div>`;
  return `<section class="card exhist" aria-labelledby="exh-h"><h2 id="exh-h">Exercises done</h2>
      <ol class="exhlist">${shown.map(row).join('')}</ol>${more}
      <p class="note">On how many of your done days each exercise came up; a swap counts as the exercise you did. Warm-ups and cool-downs not included.</p></section>
    <section class="card exhist" aria-labelledby="lv-h"><h2 id="lv-h">Level over time</h2>${levels.map(strip).join('')}
      <p class="note">The highest level you did each week, oldest week first: I days 1–20, II days 21–40, III days 41–60.</p></section>`;
}
/* The History tab (Phase 9 ticket 3): a month as a calendar, ‹ › to page, Today back; a day with workouts is filled,
   darker for more minutes; tap one for what you did. The program switch narrows it; the span switch doesn't move it (it
   pages by month on its own; the span applies to what's under it). History, not streaks: nothing counts runs of days. */
const statsMonth = () => { const n = new Date(), m = statsView.month || [n.getFullYear(), n.getMonth()]; return new Date(m[0], m[1], 1); };
const dateKey = (d) => KBRandom.dayKey(d);
const minuteLevel = (m) => (m <= 0 ? 0 : m < 25 ? 1 : m < 40 ? 2 : m < 60 ? 3 : 4);
function historyTab() {
  const m = statsMonth(), now = new Date(), today = dateKey(now), thisMonth = m.getFullYear() === now.getFullYear() && m.getMonth() === now.getMonth();
  const weeks = KBStats.calendarMonth(statsEntries(), { dayOf, year: m.getFullYear(), month: m.getMonth() });
  const label = (c) => `${c.date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}: ${c.workouts.length ? `${plural(c.workouts.length, 'workout')}, ${fmtNum(c.minutes)} minutes` : 'no workouts'}`;
  const cell = (c) => { const k = dateKey(c.date);
    return `<button class="hday mm-l${minuteLevel(c.minutes)}${c.inMonth ? '' : ' out'}${k === today ? ' today' : ''}" data-hday="${k}" aria-pressed="${statsView.histDay === k}" aria-label="${esc(label(c))}"${c.workouts.length ? '' : ' tabindex="-1"'}>${c.date.getDate()}</button>`; };
  const picked = weeks.flat().find((c) => dateKey(c.date) === statsView.histDay);
  const nav = `<div class="hnav"><button class="btn ghost hbtn" data-hmonth="-1" aria-label="Previous month">‹</button><h2 id="hist-h">${esc(m.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }))}</h2><button class="btn ghost hbtn" data-hmonth="1" aria-label="Next month">›</button>${thisMonth ? '' : '<button class="linkbtn" data-hmonth="0">Today</button>'}</div>`;
  const head = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => `<span class="hwd" aria-hidden="true">${d}</span>`).join('');
  return `<section class="card history" aria-labelledby="hist-h">${nav}<div class="hgrid">${head}${weeks.flat().map(cell).join('')}</div>
      ${heatLegend()}</section>${picked ? historyDay(picked) : '<p class="muted">Tap a day to see what you did.</p>'}`;
}
function historyDay(c) {
  const row = (e) => {
    const d = dayOf(e.pid, e.day, e.round);
    if (e.pid === 'random') { const rec = store.doc('random', e.day) || {}; return `<li class="hwork"><span class="eyebrow">Random workout</span><b>${esc((rec.name || 'Random workout').replace(/^Random: /, ''))}</b><span>${fmtMin(d.est)} · level ${ROMAN[d.level]}</span></li>`; }
    const sm = programs.summary(e.pid);
    return `<li><button class="hwork" data-hopen="${esc(e.pid)}:${e.day}"><span class="eyebrow">${esc(sm ? sm.name : e.pid)}${e.round > 1 ? ` · Round ${e.round}` : ''}</span><b>Day ${e.day} · ${esc(d.name || d.title)}</b><span>${fmtMin(d.est)} · level ${ROMAN[d.level]}</span></button></li>`;
  };
  return `<section class="card history" aria-labelledby="hday-h"><h2 id="hday-h">${esc(c.date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }))}</h2>
    ${c.workouts.length ? `<ol class="hlist">${c.workouts.map(row).join('')}</ol>` : '<p class="muted">No workouts this day.</p>'}</section>`;
}
function historyMove(n) {
  const m = statsMonth(), d = n === 0 ? new Date() : new Date(m.getFullYear(), m.getMonth() + n, 1);
  statsView.month = [d.getFullYear(), d.getMonth()]; statsView.histDay = null; render();
}
/* When you train (Phase 9 ticket 4), under the calendar, for the chosen span: workouts per weekday and per time of day,
   in their own order (not ranked), from when each day was marked done. */
function countBars(rows, label) {
  const max = Math.max(1, ...rows.map(([, n]) => n));
  return `<ol class="rank counts" aria-label="${esc(label)}">${rows.map(([k, n]) => `<li><span class="rname">${esc(k)}</span><span class="rbar"><i style="width:${((n / max) * 100).toFixed(1)}%"></i></span><span class="rval num">${n}</span></li>`).join('')}</ol>`;
}
function whenTab(r) {
  const opts = { dayOf, from: r.from, to: r.to }, mine = statsEntries();
  const wd = KBStats.byWeekday(mine, opts), td = KBStats.byTimeOfDay(mine, opts);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return `<section class="card timecard" aria-labelledby="when-h"><h2 id="when-h">When you train</h2>
      <h3>By weekday</h3>${countBars(days.map((d, i) => [d, wd[i]]), 'Workouts by weekday')}
      <h3>Time of day</h3>${countBars([['Morning', td.morning], ['Afternoon', td.afternoon], ['Evening', td.evening], ['Night', td.night]], 'Workouts by time of day')}
      <p class="note">Workouts in the span above. Time of day is when you marked the day done: morning 5–12, afternoon 12–17, evening 17–22, night 22–5.</p></section>`;
}
// days trained per week (Phase 9 ticket 5): a line on the History tab for spans longer than a week, 0 to 7
function daysTrend(r) {
  if (!r.weeks) return '';
  const rows = KBStats.daysPerWeek(statsEntries(), { dayOf, from: r.from, to: r.to });
  return trendChart(rows, 'week', { value: (d) => d.days, max: 7, step: 1, id: 'days-h', title: 'Days per week', label: 'Days you trained per week', tip: (d) => plural(d.days, 'day') });
}
function statsTab(r, what) {
  if (statsView.tab === 'history') return historyTab() + daysTrend(r) + whenTab(r);
  if (statsView.tab === 'muscles') return muscleBalance(r, what);
  if (statsView.tab === 'exercises') return exercisesTab(r);
  if (statsView.tab === 'time') {
    if (r.months) return trendChart(r.months, 'month') + timeTab(r) + weekRows(r.months, 'Month by month', 'Month', monthName);
    return (r.weeks ? trendChart(r.weeks, 'week') : '') + timeTab(r) + (r.weeks ? weekRows(r.weeks) : '<p class="muted">Pick a longer span to see each week.</p>');
  }
  return statTiles(r.totals);
}
function viewStats() {
  const { span, pid } = statsView;
  if (stillLoading(doneEntries().map((x) => x.pid)).length) return `<h1>Stats</h1><p class="loading lede" role="status">Loading your programs…</p>`;
  const r = statsReport(pid, span, pid === 'all' ? undefined : statsView.round), { from, to } = r, all = doneEntries();
  const used = programs.list().filter((p) => all.some((e) => e.pid === p.id) || p.id === pid);
  const scopeName = pid === 'all' ? 'all programs' : pid === 'random' ? 'random workouts' : programs.summary(pid).name + (statsView.round ? ` · Round ${statsView.round}` : '');
  const randomOption = all.some((e) => e.pid === 'random') || pid === 'random' ? `<option value="random"${pid === 'random' ? ' selected' : ''}>Random workouts</option>` : '';
  const history = statsView.tab === 'history';
  const when = span === 'all' ? (pid === 'all' || pid === 'random' ? 'all time' : 'since you started') : `${shortDate(from)} – ${shortDate(new Date(to - 864e5))}`;
  const none = history ? '' : { week: 'this week', '4weeks': 'in the last 4 weeks', '3months': 'in the last 3 months', year: 'this year', all: '' }[span];
  return `<div class="eyebrow">${esc(pid === 'all' ? `${when} · ${scopeName}` : `${scopeName} · ${when}`)}</div><h1>Stats</h1>
    <div class="statbar">
      <div class="filters" role="group" aria-label="Time span">${SPANS.map(([k, l]) => `<button class="fchip" data-stat-span="${k}" aria-pressed="${span === k}">${l}</button>`).join('')}</div>
      <div class="scope"><label for="stats-scope">Program</label><select id="stats-scope"><option value="all">All programs</option>${used.map((p) => `<option value="${p.id}"${p.id === pid ? ' selected' : ''}>${esc(p.name)}</option>`).join('')}${randomOption}</select></div>
      ${pid !== 'all' && pid !== 'random' && store.round(pid) > 1 ? `<div class="scope"><label for="stats-round">Round</label><select id="stats-round"><option value="all">All rounds</option>${Array.from({ length: store.round(pid) }, (_, i) => `<option value="${i + 1}"${statsView.round === i + 1 ? ' selected' : ''}>Round ${i + 1}</option>`).join('')}</select></div>` : ''}
    </div>
    <div class="ftabs stattabs" role="group" aria-label="Stats views">${STAT_TABS.map(([k, l]) => `<button class="ftab" data-stat-tab="${k}" aria-pressed="${statsView.tab === k}">${l}</button>`).join('')}</div>
    ${r.hasHistory ? statsTab(r, `${scopeName}, ${when}`) : `<p class="lede">No workouts marked done ${none || 'yet'}${none ? ' yet' : ''}.</p>`}
    <p class="note">Counts the planned work of each day you marked done: its sets, reps and minutes. Weeks start on Sunday.</p>`;
}

/* ---------------- exercise page animation (still under reduce motion; nowhere else) ---------------- */
const anim = { iv: null, cache: {} };
function stopAnimation() { clearInterval(anim.iv); anim.iv = null; }
function startAnimation(id) {
  const el = document.querySelector('.bigfig');
  if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const frames = anim.cache[id] || (anim.cache[id] = KBFig.animationFrames(EX[id], { label: EX[id].name + ' illustration' }));
  if (frames.length < 2) return;
  let i = 0;
  anim.iv = setInterval(() => { i = (i + 1) % frames.length; el.innerHTML = frames[i]; }, 55);
}

/* ---------------- programs that aren't loaded yet ---------------- */
// load any of these programs that aren't here yet, redrawing when each arrives; returns the ones still loading
const loadFailures = {};
function stillLoading(pids) {
  const missing = [...new Set(pids)].filter((pid) => programs.has(pid) && !programs.get(pid));
  // a program that failed stays failed until "Try again" (no retry loop while offline)
  missing.filter((pid) => !loadFailures[pid]).forEach((pid) => programs.load(pid).then(() => rerender(), (e) => { loadFailures[pid] = e.message; rerender(); }));
  return missing;
}
function loadingView(pid) {
  const failed = loadFailures[pid];
  return failed
    ? `<p class="lede" role="alert">${esc(failed)}</p><button class="btn" data-retry="${pid}">Try again</button>`
    : `<p class="loading lede" role="status">Loading ${esc(programs.summary(pid).name)}…</p>`;
}

function render(scrollTop) {
  const app = $('#app');
  const v = route.view;
  const needsProgram = v === 'program' || v === 'day' || v === 'exercise';
  if (needsProgram && stillLoading([route.pid]).length) app.innerHTML = loadingView(route.pid);
  else app.innerHTML = v === 'programs' ? viewPrograms() : v === 'build' ? viewBuild() : v === 'random' ? viewRandom() : v === 'add' ? viewAdd() : v === 'library' ? viewLibrary() : v === 'settings' ? viewSettings() : v === 'stats' ? viewStats() : v === 'exercise' ? viewExercise() : v === 'day' ? viewDay() : viewProgram();
  const section = v === 'library' || v === 'exercise' ? 'library' : v === 'settings' || v === 'stats' ? v : 'programs';
  document.querySelectorAll('.top [data-go]').forEach((b) => b.setAttribute('aria-current', b.dataset.go === section ? 'page' : 'false'));
  // the family tabs are a scrolling row (a re-render resets it): bring the chosen one fully into view
  const chosen = document.querySelector('.ftab[aria-pressed="true"]');
  if (chosen) { const row = chosen.parentElement; row.scrollLeft = Math.max(0, chosen.offsetLeft + chosen.offsetWidth + 4 - row.clientWidth); }
  stopAnimation();
  if (v === 'exercise') startAnimation(route.ex);
  const showTimer = v === 'day' || (v === 'random' && !!random.current());
  $('#timer').hidden = !showTimer; document.body.classList.toggle('has-timer', showTimer);
  if (scrollTop) window.scrollTo(0, 0);
}

