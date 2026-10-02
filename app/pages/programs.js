/* ---------------- programs page ---------------- */
const { libraryView, suggestNext, FAMILIES, LENGTHS, lengthOf } = KBLibrary;
let filters = { family: 'all', subject: 'all', len: 'all', equip: 'all' };
let progQuery = ''; // the name search (Phase 15): words in the name, subject, split or first sentence
let pickState = null; // Help me pick (Phase 15): { goal, minutes, gear } while the sheet is open
let openShelves = []; // subjects whose shelf shows all its programs (Phase 14: a shelf shows 6 and "Show all N")
const toggleShelf = (subject) => { openShelves = KBLibrary.toggleIn(openShelves, subject); render(); };
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
/* Exercises I skip (Phase 13 ticket 1): `skip: [exercise id]` in the synced prefs, only while not empty. Skipped on the
   exercise page, listed in Settings to unskip. */
const skipList = () => KBLibrary.skipped(store.doc('prefs', 'main'), EX);
const toggleSkip = (id) => setPref('skip', KBLibrary.toggleIn(skipList(), id));
const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"/></svg>';
const starButton = (p) => { const on = isFavourite(p.id); return `<button class="star" data-star="${esc(p.id)}" aria-pressed="${on}" aria-label="${on ? 'Remove' : 'Add'} ${esc(p.name)} ${on ? 'from' : 'to'} favourites">${STAR}</button>`; };
function viewPrograms() {
  const last = lastPid();
  const found = KBLibrary.searchPrograms(programs.list(), progQuery), searching = !!progQuery.trim();
  const all = found.filter((p) => p.source !== 'own'); // your own programs have their own shelf
  const mine = found.filter((p) => p.source === 'own');
  const lib = libraryView(all, filters, { families: FAMILIES, lengthOf, prefs: libraryPrefs(), opened: searching ? FAMILIES.flatMap(([, list]) => list) : openShelves, keep: all.filter((p) => p.id === last || store.count(p.id) > 0).map((p) => p.id) });
  lib.unknown.forEach((s) => console.error(`Subject "${s}" has no family in FAMILIES`));
  const card = (p) => {
    const n = store.count(p.id), mins = p.minutes[0] === p.minutes[1] ? p.minutes[0] : `${Math.round(p.minutes[0])}–${Math.round(p.minutes[1])}`;
    return `<button class="pcard${p.id === last ? ' current' : ''}" data-open-prog="${p.id}">
      <div class="pc-main"><span class="eyebrow">${esc(p.subject)}${p.id === last ? ' · current' : ''}${store.round(p.id) > 1 ? ` · Round ${store.round(p.id)}` : ''}</span><b>${esc(p.name)}</b><p>${esc(firstSentence(p.about || p.blurb))}</p>
        <div class="pc-tags">${p.dayCount !== KBLength.DAYS ? `<span class="chip">${p.dayCount} days</span>` : ''}<span class="chip">${esc(p.split)}</span><span class="chip">~${mins} min</span>${(p.formats || ['straight']).map((f) => `<span class="chip">${fmtFormat[f]}</span>`).join('')}${p.equip === 'kb' ? '<span class="chip">Kettlebell only</span>' : p.equip === 'bw' ? '<span class="chip">No equipment</span>' : ''}</div></div>
      <div class="pc-prog"><span class="num">${n}/${p.dayCount}</span><div class="bar"><b style="width:${(n / p.dayCount) * 100}%"></b></div></div></button>`;
  };
  const starred = (p) => `<div class="pcwrap">${card(p)}${starButton(p)}</div>`;
  const shelfFoot = (s) => (s.more ? `<button class="lenline shelfmore" data-shelf="${esc(s.subject)}" aria-expanded="false">Show all ${s.total} ${esc(s.subject)} programs <span aria-hidden="true">▾</span></button>`
    : filters.subject === 'all' && openShelves.includes(s.subject) && s.total > KBLibrary.SHELF ? `<button class="lenline shelfmore" data-shelf="${esc(s.subject)}" aria-expanded="true">Show fewer <span aria-hidden="true">▴</span></button>` : '');
  const groups = lib.shelves.map((s) => `<section class="pgroup"><h2>${esc(s.subject)}</h2><div class="plist">${s.programs.map(starred).join('')}</div>${shelfFoot(s)}</section>`).join('');
  const favs = lib.favourites.length ? `<section class="pgroup favs"><h2>Favourites</h2><div class="plist">${lib.favourites.map(starred).join('')}</div></section>` : '';
  const yours = mine.length ? `<section class="pgroup yours"><h2>Your programs</h2><div class="plist">${mine.map(card).join('')}</div></section>` : '';
  const tab = (k, x) => `<button class="ftab" data-filter="${k}:${esc(x.key)}" aria-pressed="${x.pressed}">${esc(x.name)}</button>`;
  const menuLine = (k, name, label) => `<button class="lenline" data-filter-menu="${k}" aria-expanded="${filterMenu === k}">${name}: <b>${esc(label)}</b> <span aria-hidden="true">${filterMenu === k ? '▴' : '▾'}</span></button>`;
  const menuChips = (k, what, list) => `<div class="filters" role="group" aria-label="Filter by ${what}">${list.map((l) => `<button class="fchip acc" data-filter="${k}:${l.key}" aria-pressed="${l.pressed}">${esc(l.label)}</button>`).join('')}</div>`;
  const chip = (x) => `<button class="fchip acc" data-filter="subject:${esc(x.key)}" aria-pressed="${x.pressed}">${esc(x.name)} <span class="fcount">${x.count}</span></button>`;
  return `<div class="eyebrow">${esc(lib.counter)}</div><h1>Programs</h1>
    <p class="lede">Every program starts at intermediate, with a matched warm-up and cool-down, and most end each workout with abs. Progress is kept per program.</p>
    <div class="pbtns"><button class="btn buildbtn" data-go="build">Build your own</button><button class="btn ghost buildbtn" data-random-open="1">${random.current() ? 'Random workout · continue' : 'Random workout'}</button><button class="btn ghost buildbtn" data-pick-open="1">Help me pick</button></div>
    ${askBlock()}
    ${randomNotice ? `<p class="hint rnotice" role="status">${esc(randomNotice)}</p>` : ''}${restCard()}
    ${yours}${favs}
    <label class="exsearch progsearch"><span class="sr">Search programs</span><input id="prog-search" type="search" placeholder="Search programs by name or subject" value="${esc(progQuery)}" autocomplete="off" enterkeyhint="search"></label>
    <div class="ftabs" role="group" aria-label="Filter by family">${lib.families.map((f) => tab('family', f)).join('')}</div>
    <div class="filters" role="group" aria-label="Filter by subject">${lib.subjects.map(chip).join('')}</div>
    <div class="lenlines">${menuLine('len', 'Length', lib.lengthLabel)}${menuLine('equip', 'Equipment', lib.equipLabel)}</div>
    ${filterMenu === 'len' ? menuChips('len', 'length', lib.lengths) : filterMenu === 'equip' ? menuChips('equip', 'equipment', lib.equips) : ''}
    ${pickSheet()}${groups || `<p class="lede" style="margin-top:24px">${progQuery.trim() ? `No programs match “${esc(progQuery.trim())}” with these filters.` : 'No programs match these filters.'}</p>`}${randomSheet()}`;
}

/* Help me pick (Phase 15 ticket 2): goal, minutes and gear as taps; the top five with their why line (KBFinder.pick) */
const pickOpen = () => { pickState = { goal: null, minutes: '30', gear: 'all' }; render(); };
function pickSet(key, value) { pickState[key] = value; render(); }
function pickSheet() {
  if (!pickState) return '';
  const st = pickState, chip = (key, [k, label]) => `<button class="fchip acc" data-pick-set="${key}:${k}" aria-pressed="${st[key] === k}">${esc(label)}</button>`;
  const group = (key, name, list) => `<h3 class="pickh">${name}</h3><div class="filters" role="group" aria-label="${name}">${list.map((x) => chip(key, x)).join('')}</div>`;
  let results = '<p class="muted">Pick a goal to see programs.</p>';
  if (st.goal) {
    const lib = programs.list().filter((p) => p.source !== 'own'), r = KBFinder.pick(lib, st, { started: lib.filter((p) => store.count(p.id) > 0).map((p) => p.id) });
    const note = r.loosened === 'minutes' ? 'Nothing fits those minutes, so here are the closest with your gear.' : r.loosened === 'both' ? 'Nothing fits those minutes and gear, so here is what the goal has.' : '';
    results = `${note ? `<p class="hint" role="status">${note}</p>` : ''}<ul class="picklist">${r.list.map((p) => `<li><button class="pickres" data-open-prog="${esc(p.id)}"><b>${esc(p.name)}</b><span>${esc(KBFinder.why(p, ''))}</span></button></li>`).join('')}</ul>`;
  }
  return `<div class="sheetwrap"><button class="sheetbg" data-pick-close="1" aria-label="Close"></button>
    <div class="sheet picksheet" role="dialog" aria-modal="true" aria-labelledby="pick-h"><h2 id="pick-h">Help me pick</h2>
    ${group('goal', 'Goal', KBFinder.GOALS)}${group('minutes', 'Minutes', KBFinder.MINUTES)}${group('gear', 'Gear', KBFinder.GEAR)}
    <div class="pickout">${results}</div>
    <div class="actions"><button class="btn ghost" data-pick-close="1">Close</button></div></div></div>`;
}

/* Ask the finder (Phase 15 ticket 5): signed in, a question in your own words. The model (about 38 MB, served with the
   app) downloads once, after a yes; the program vectors come with the deploy (data/finder-vectors.json) or, without
   them (a local build), are made here from data/finder.json. Then each question is one embedding and a ranking.
   window.KB_EMBED(onProgress) -> Promise of embed(texts) replaces the model loader (the phone tests' stub). */
let askState = { q: '', phase: null }; // phase: null | 'consent' | 'loading' | 'error'; results: { q, ids, fitting }
let finderLoad = null; // Promise of { embed, vectors(dims) } once the download has started
const finderTexts = KBLazy.lazyFile({ fetch: fetchJson, cache: offlineCache, url: 'data/finder.json', unavailable: "The finder isn't available offline yet. Ask once while online." });
const finderVectors = KBLazy.lazyFile({ fetch: fetchJson, cache: offlineCache, url: 'data/finder-vectors.json', unavailable: 'no program vectors' });
const finderAgreed = () => { try { return localStorage.getItem('kb-finder') === 'yes'; } catch (e) { return false; } };
function loadFinder() {
  let files = {};
  const shown = (step) => { askState.step = step; const el = $('.askstatus'); if (el) el.textContent = step; };
  const onProgress = (ev) => { files = KBFinder.track(files, ev); const pct = KBFinder.percent(files); shown(`Downloading the finder…${pct === null ? '' : ` ${pct}%`}`); };
  shown('Downloading the finder…');
  const loader = window.KB_EMBED || ((cb) => import(new URL('data/finder-model.js', location.href).href).then((m) => m.loadEmbedder(location.href, cb)));
  return loader(onProgress).then((embed) => {
    let made = null;
    const own = async () => { // no vectors file: embed every program's finder text here, a few at a time
      const texts = await finderTexts.load(), ids = Object.keys(texts), out = {};
      for (let i = 0; i < ids.length; i += 16) {
        shown(`Getting the programs ready… ${Math.round((100 * i) / ids.length)}%`);
        (await embed(ids.slice(i, i + 16).map((id) => texts[id]))).forEach((v, j) => { out[ids[i + j]] = v; });
      }
      return out;
    };
    const vectors = (dims) => made || (made = finderVectors.load().then((f) => (f.dims === dims ? f.vectors : own()), own).catch((e) => { made = null; throw e; }));
    return { embed, vectors };
  });
}
async function askRun() {
  const q = askState.q.trim();
  askState = { q: askState.q, phase: 'loading', step: finderLoad ? 'Finding programs…' : 'Downloading the finder…', results: askState.results };
  render();
  try {
    if (!finderLoad) finderLoad = loadFinder();
    const f = await finderLoad;
    const [qv] = await f.embed([q]);
    const vecs = await f.vectors(qv.length);
    const lib = Object.fromEntries(programs.list().filter((p) => p.source !== 'own').map((p) => [p.id, p]));
    askState = { q: askState.q, phase: null, results: { q, ...KBFinder.answer(KBFinder.rank(vecs, qv, lib, KBFinder.limits(q), 8)) } };
  } catch (e) {
    finderLoad = null;
    askState = { q: askState.q, phase: 'error', error: e.message, results: askState.results };
  }
  render();
}
function askSubmit(q) {
  askState.q = q;
  if (!q.trim() || askState.phase === 'loading') return;
  if (!finderLoad && !finderAgreed()) { askState.phase = 'consent'; render(); return; }
  askRun();
}
function askAgree() {
  try { localStorage.setItem('kb-finder', 'yes'); } catch (e) { /* blocked: asks again next time */ }
  askRun();
}
function askBlock() {
  if (!store.remote) return '<p class="hint asknote">Sign in to ask in your own words. Until then, search by name or use Help me pick.</p>';
  const st = askState, busy = st.phase === 'loading';
  let out = '';
  if (st.phase === 'consent') {
    out = `<div class="askconsent" role="group" aria-label="Download the finder"><p>The finder understands questions on your phone. It downloads about 38 MB once, then works offline.</p>
      <div class="actions"><button class="btn" data-ask-ok="1">Download</button><button class="btn ghost" data-ask-no="1">Not now</button></div></div>`;
  } else if (busy) out = `<p class="hint askstatus" role="status">${esc(st.step)}</p>`;
  else if (st.phase === 'error') out = `<p class="hint askerr" role="alert">The finder couldn't load (${esc(st.error)}). Ask again to try again.</p>`;
  if (st.results && !busy) {
    const r = st.results, byId = (id) => programs.list().find((p) => p.id === id);
    const note = r.fitting === 0 ? 'Nothing fits everything you asked, so here are the closest.' : r.fitting < r.ids.length ? `Only ${r.fitting} fit${r.fitting === 1 ? 's' : ''} everything you asked; the others are close.` : '';
    out += `<div class="askout">${note ? `<p class="hint">${note}</p>` : ''}<ul class="picklist">${r.ids.map(byId).filter(Boolean).map((p) => `<li><button class="pickres" data-open-prog="${esc(p.id)}"><b>${esc(p.name)}</b><span>${esc(KBFinder.why(p, r.q))}</span></button></li>`).join('')}</ul></div>`;
  }
  return `<form class="askform" data-ask-form="1" role="search"><label class="exsearch"><span class="sr">Ask the finder</span><input id="ask-q" type="search" placeholder="Describe what you want…" value="${esc(st.q)}" autocomplete="off" enterkeyhint="search"></label><button class="btn" type="submit"${busy ? ' disabled' : ''}>Ask</button></form>
    <p class="hint askhint">For example: “20 minutes for a sore back, no gear”.</p>${out}`;
}
