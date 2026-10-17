/* ---------------- the guests (Phase 35 ticket 3g2, decisions 415, 416, 419, 425) ----------------
   #guests: every named guest's card, from KBGuests (app/guests.js). No menu or link leads here: a
   long-press (600 ms) on the Group sex chip opens it, and on a guest's name in a cue it opens at her (#guests/<name>).
   A tap on the name shows her card in a sheet; a tap on the chip still filters. */
// 3g13 (451-453): flag, country, age and height (a man: no height); the body facts only until her line is written
const guestFacts = (g) => [`${g.flag} ${g.country}`, g.age, g.height && `${g.height} cm`, ...(g.line ? [] : g.kind === 'woman'
  ? [g.body, `${g.breasts} tits`, `${g.ass} ass`, g.pussy] : [g.body, `${g.skin} skin`, `${g.hair} hair`, `cock: ${g.cock}`])].filter(Boolean).join(' · ');
const guestLine = (g, tag) => (g.line ? `<${tag} class="gline">${esc(g.line)}</${tag}>` : '');
function guestBody(name, hid) {
  const g = KBGuests.GUESTS[name];
  return `<h2 id="${hid}">${esc(name)}</h2><p class="gfacts">${esc(guestFacts(g))}</p>${guestLine(g, 'p')}${g.hook ? `<p class="ghook">${esc(g.hook)}</p>` : ''}
    ${g.text ? `<p>${esc(g.text)}</p>` : '<p class="muted">Not written yet.</p>'}`;
}
// a guest's name in a cue, through cueOf: plain on paper
const guestName = (n) => (route.view === 'print' ? n : `<button class="guestname" data-guest="${n}">${n}</button>`);
/* 3g7 (434-440): cards fold to name, facts and hook and unfold on a tap; a search, tabs and filters through
   KBGuestFind; all of it kept while the app is open (440). Typing redraws only the results, so the field keeps focus.
   3g9 (442-445): the filters are a row of pills, Filters and the three groups, each opening a sheet at its filters with
   live counts; what's picked shows as chips that remove it; Sort beside them. */
const guestFind = { q: '', kind: 'all', pick: {}, sort: 'az', menu: null, sheet: null, open: new Set() };
const GKIND = [['all', 'All'], ['woman', 'Women'], ['man', 'Men']];
// a picked value said in full: "small tits", "red hair", "into rim"
const PICKED = { breasts: '$ tits', ass: '$ ass', hair: '$ hair', skin: '$ skin', eyes: '$ eyes', cock: 'cock: $', acts: 'into $', age: 'age $' };
const pickedLabel = (key, v) => (key === 'ink' ? (v.key === 'inked' ? 'inked' : 'no ink') : (PICKED[key] || '$').replace('$', v.label));
function guestCard(n) {
  const g = KBGuests.GUESTS[n], on = guestFind.open.has(n);
  return `<article class="card guest" id="g-${n}"><button class="gsum" data-guest-fold="${n}" aria-expanded="${on}" aria-controls="gt-${n}">
    <span class="gname">${esc(n)}</span><span class="gfacts">${esc(guestFacts(g))}</span>${guestLine(g, 'span')}${g.hook ? `<span class="ghook">${esc(g.hook)}</span>` : ''}</button>
    <p class="gtext" id="gt-${n}"${on ? '' : ' hidden'}>${g.text ? esc(g.text) : '<span class="muted">Not written yet.</span>'}</p></article>`;
}
function guestSheet(menus, shown) {
  const groups = KBGuestFind.GROUPS.filter(([k]) => guestFind.sheet === 'all' || guestFind.sheet === k);
  const chip = (m, v) => `<button class="fchip acc${v.count || v.on ? '' : ' dim'}" data-gf="pick:${m.key}:${esc(v.key)}" aria-pressed="${v.on}">${esc(v.label)} <span class="fcount">${v.count}</span></button>`;
  const body = groups.map(([, gl, keys]) => {
    const ms = keys.map((k) => menus.find((m) => m.key === k)).filter(Boolean);
    return ms.length ? `<h3 class="gsgroup">${gl}</h3>${ms.map((m) => `<div class="gsfilter"><span class="gslabel">${m.label}</span><div class="filters" role="group" aria-label="${m.label}">${m.values.map((v) => chip(m, v)).join('')}</div></div>`).join('')}` : '';
  }).join('');
  return `<div class="sheetwrap gfsheet"><button class="sheetbg" data-gf="sheet:close" aria-label="Close"></button>
    <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="gf-h"><h2 id="gf-h">Filters</h2>${body}
    <div class="gsbtns"><button class="btn ghost" data-gf="clear:1">Clear</button><button class="btn" data-gf="sheet:close">Show ${shown}</button></div></div></div>`;
}
function guestResults() {
  const f = guestFind, r = KBGuestFind.find(KBGuests.GUESTS, f), total = Object.keys(KBGuests.GUESTS).length;
  const menus = KBGuestFind.menus(KBGuests.GUESTS, f.kind, f.pick, f.q);
  const n = (keys) => menus.filter((m) => keys.includes(m.key)).reduce((x, m) => x + m.values.filter((v) => v.on).length, 0);
  const all = n(menus.map((m) => m.key)), badge = (x) => (x ? ` <span class="fcount">${x}</span>` : '');
  const sortLabel = KBGuestFind.SORTS.find(([k]) => k === f.sort)[1];
  const pills = `<button class="gpill" data-gf="sheet:all">Filters${badge(all)}</button>${KBGuestFind.GROUPS.map(([k, l, keys]) => `<button class="gpill" data-gf="sheet:${k}">${l}${badge(n(keys))}</button>`).join('')}`;
  const sort = `<button class="lenline" data-gf="menu:sort" aria-expanded="${f.menu === 'sort'}">Sort: <b>${esc(sortLabel)}</b> <span aria-hidden="true">${f.menu === 'sort' ? '▴' : '▾'}</span></button>`;
  const sorts = f.menu === 'sort' ? `<div class="filters" role="group" aria-label="Sort">${KBGuestFind.SORTS.map(([k, l]) => `<button class="fchip acc" data-gf="sort:${k}" aria-pressed="${f.sort === k}">${l}</button>`).join('')}</div>` : '';
  const picked = menus.flatMap((m) => m.values.filter((v) => v.on).map((v) => `<button class="fchip acc" data-gf="pick:${m.key}:${esc(v.key)}" aria-pressed="true" aria-label="Remove ${esc(pickedLabel(m.key, v))}">${esc(pickedLabel(m.key, v))} <span aria-hidden="true">✕</span></button>`));
  const any = f.q || f.kind !== 'all' || f.sort !== 'az' || all;
  return { count: r.list.length === total ? `${total} guests` : `${r.list.length} of ${total} guests`, html: `<div class="ftabs" role="group" aria-label="Women or men">${GKIND.map(([k, l]) => `<button class="ftab" data-gf="kind:${k}" aria-pressed="${f.kind === k}">${l} <span class="fcount">${r.counts[k]}</span></button>`).join('')}</div>
    <div class="gpills">${pills}${sort}</div>${sorts}
    ${picked.length || any ? `<div class="filters gpicked">${picked.join('')}${any ? '<button class="fchip" data-gf="clear:1">Clear all</button>' : ''}</div>` : ''}
    <div class="guests">${r.list.map(guestCard).join('') || '<p class="lede">No guests match. Try another word or fewer filters.</p>'}</div>
    ${f.sheet ? guestSheet(menus, r.list.length) : ''}` };
}
function viewGuests() {
  if (route.at) { // arriving at her (#guests/<name>): she shows, unfolded
    guestFind.open.add(route.at);
    if (!KBGuestFind.find(KBGuests.GUESTS, guestFind).list.includes(route.at)) Object.assign(guestFind, { q: '', kind: 'all', pick: {}, menu: null, sheet: null });
  }
  const r = guestResults();
  return `<div class="eyebrow" id="gcount">${r.count}</div><h1>The guests</h1>
    <label class="exsearch"><span class="sr">Search guests</span><input id="guest-search" type="search" placeholder="Search by name, look, job or words" value="${esc(guestFind.q)}" autocomplete="off" enterkeyhint="search"></label>
    <div id="gresults">${r.html}</div>`;
}
function guestRefresh() { const r = guestResults(), el = $('#gresults'), c = $('#gcount'); if (el) el.innerHTML = r.html; if (c) c.textContent = r.count; }
// data-gf: kind:<k>, sheet:<all|group|close>, menu:sort, pick:<key>:<value>, sort:<k>, clear:1
function guestFilter(v) {
  const [what, key, ...rest] = v.split(':'), f = guestFind;
  if (what === 'kind') { f.kind = key; f.menu = null; }
  if (what === 'sheet') { f.sheet = key === 'close' ? null : key; f.menu = null; }
  if (what === 'menu') f.menu = f.menu === key ? null : key;
  if (what === 'pick') { const val = rest.join(':'), l = f.pick[key] || []; f.pick[key] = l.includes(val) ? l.filter((x) => x !== val) : [...l, val]; }
  if (what === 'sort') { f.sort = key; f.menu = null; }
  if (what === 'clear') { Object.assign(f, { q: '', kind: 'all', pick: {}, sort: 'az', menu: null }); const s = $('#guest-search'); if (s) s.value = ''; }
  guestRefresh();
}
function guestFold(n) {
  const on = !guestFind.open.has(n), card = document.getElementById('g-' + n);
  if (on) guestFind.open.add(n); else guestFind.open.delete(n);
  if (card) { card.querySelector('.gsum').setAttribute('aria-expanded', on); card.querySelector('.gtext').hidden = !on; }
}
const closeGuest = () => document.querySelectorAll('.guestwrap').forEach((w) => w.remove());
function openGuest(name) {
  closeGuest();
  document.body.insertAdjacentHTML('beforeend', `<div class="sheetwrap guestwrap"><button class="sheetbg" data-guest-close="1" aria-label="Close"></button>
    <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="gs-h">${guestBody(name, 'gs-h')}
    <button class="btn ghost sheetclose" data-guest-close="1">Close</button></div></div>`);
}
window.addEventListener('hashchange', closeGuest);
// the long-press: the click that follows it is swallowed, so the chip doesn't filter and the name doesn't open her sheet
const PRESSABLE = '[data-guest], [data-exf="family:group"]';
let pressTimer = null, pressed = false;
document.addEventListener('pointerdown', (ev) => {
  pressed = false; clearTimeout(pressTimer);
  const el = ev.target.closest && ev.target.closest(PRESSABLE);
  if (el) pressTimer = setTimeout(() => { pressed = true; go(el.dataset.guest ? 'guests/' + el.dataset.guest : 'guests'); }, 600);
});
['pointerup', 'pointercancel'].forEach((t) => document.addEventListener(t, () => clearTimeout(pressTimer)));
document.addEventListener('click', (ev) => { if (pressed) { pressed = false; ev.stopPropagation(); ev.preventDefault(); } }, true);
document.addEventListener('contextmenu', (ev) => { if (ev.target.closest && ev.target.closest(PRESSABLE)) ev.preventDefault(); });
