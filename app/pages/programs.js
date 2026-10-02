/* ---------------- programs page ---------------- */
const { libraryView, suggestNext, FAMILIES, LENGTHS, lengthOf } = KBLibrary;
let filters = { family: 'all', subject: 'all', len: 'all', equip: 'all' };
let progQuery = ''; // the name search (Phase 15): words in the name, subject, split or first sentence
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
    <div class="pbtns"><button class="btn buildbtn" data-go="build">Build your own</button><button class="btn ghost buildbtn" data-random-open="1">${random.current() ? 'Random workout · continue' : 'Random workout'}</button></div>
    ${randomNotice ? `<p class="hint rnotice" role="status">${esc(randomNotice)}</p>` : ''}${restCard()}
    ${yours}${favs}
    <label class="exsearch progsearch"><span class="sr">Search programs</span><input id="prog-search" type="search" placeholder="Search programs by name or subject" value="${esc(progQuery)}" autocomplete="off" enterkeyhint="search"></label>
    <div class="ftabs" role="group" aria-label="Filter by family">${lib.families.map((f) => tab('family', f)).join('')}</div>
    <div class="filters" role="group" aria-label="Filter by subject">${lib.subjects.map(chip).join('')}</div>
    <div class="lenlines">${menuLine('len', 'Length', lib.lengthLabel)}${menuLine('equip', 'Equipment', lib.equipLabel)}</div>
    ${filterMenu === 'len' ? menuChips('len', 'length', lib.lengths) : filterMenu === 'equip' ? menuChips('equip', 'equipment', lib.equips) : ''}
    ${groups || `<p class="lede" style="margin-top:24px">${progQuery.trim() ? `No programs match “${esc(progQuery.trim())}” with these filters.` : 'No programs match these filters.'}</p>`}${randomSheet()}`;
}
