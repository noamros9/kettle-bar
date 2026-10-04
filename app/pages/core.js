/* Core: the program catalogue and lazy files, routing, the not-yet-loaded programs and render() (split from views.js). */
/* ---------------- routing ----------------
   #today (the logo, home, and the home-screen shortcut) · #programs · #exercises · #muscles · #stats · #settings · #ex-<id> · #p-<pid> · #p-<pid>-d<n>   (#d<n> = Three-Split 60, kept for old links)
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
// the program list (data/library.json, Phase 16): not in the page. The catalogue starts with an empty library and boot
// (main.js) waits for the list, which the service worker hands over from the cache at once after the first visit
const libraryFile = KBLazy.lazyFile({ fetch: fetchJson, cache: offlineCache, url: KB_LIBRARY.url, unavailable: "The program list isn't available offline yet. Open the app once while online." });
const librarySource = (summaries) => KBPrograms.fetched(summaries, { fetchJson, cache: offlineCache, name: 'library', usage: usageFile });
const programs = KBPrograms.createProgramCatalogue(librarySource([]));
let booted = false; // true once the program list is here and the first page has drawn; nothing draws before
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
let route = { view: 'program', pid: null, day: null }; // set at boot, once the program list is here
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
  if (h === 'muscles') return { view: 'muscles' };
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
window.addEventListener('hashchange', () => { if (!booted) return; route = parseHash(); render(true); });
const dayHash = (pid, n) => `p-${pid}-d${n}`;


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
  const oldStrip = $('.ftabs', app), stripX = oldStrip ? oldStrip.scrollLeft : 0, wasChosen = oldStrip && $('[aria-pressed="true"]', oldStrip);
  const wasKey = wasChosen ? wasChosen.dataset.filter : null;
  if (needsProgram && stillLoading([route.pid]).length) app.innerHTML = loadingView(route.pid);
  else app.innerHTML = v === 'programs' ? viewPrograms() : v === 'build' ? viewBuild() : v === 'random' ? viewRandom() : v === 'add' ? viewAdd() : v === 'library' ? viewLibrary() : v === 'settings' ? viewSettings() : v === 'stats' ? viewStats() : v === 'muscles' ? viewMuscles() : v === 'exercise' ? viewExercise() : v === 'day' ? viewDay() : viewProgram();
  const section = v === 'library' || v === 'exercise' ? 'library' : v === 'settings' || v === 'stats' || v === 'muscles' ? v : 'programs';
  document.querySelectorAll('.top [data-go]').forEach((b) => b.setAttribute('aria-current', b.dataset.go === section ? 'page' : 'false'));
  // the family tabs are a scrolling row: a redraw keeps it where it was (Phase 17 ticket 2: it snapped back mid-swipe);
  // only a newly chosen tab moves it, just enough to show that tab whole
  const chosen = document.querySelector('.ftab[aria-pressed="true"]');
  if (chosen) {
    const row = chosen.parentElement; row.scrollLeft = stripX;
    if (wasKey !== chosen.dataset.filter) {
      const t = chosen.getBoundingClientRect(), b = row.getBoundingClientRect();
      if (t.right > b.right) row.scrollLeft += t.right - b.right + 4; else if (t.left < b.left) row.scrollLeft -= b.left - t.left + 4;
    }
  }
  stopAnimation();
  if (v === 'exercise') startAnimation(route.ex);
  const showTimer = v === 'day' || (v === 'random' && !!random.current());
  $('#timer').hidden = !showTimer; document.body.classList.toggle('has-timer', showTimer);
  if (scrollTop) window.scrollTo(0, 0);
}
