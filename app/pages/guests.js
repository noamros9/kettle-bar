/* ---------------- the guests (Phase 35 ticket 3g2, decisions 415, 416, 419, 425) ----------------
   #guests: every named guest's card, women then men, from KBGuests (app/guests.js). No menu or link leads here: a
   long-press (600 ms) on the Group sex chip opens it, and on a guest's name in a cue it opens at her (#guests/<name>).
   A tap on the name shows her card in a sheet; a tap on the chip still filters. */
const guestFacts = (g) => (g.kind === 'woman'
  ? `${g.age} · ${g.height} cm · ${g.body} · ${g.breasts} tits · ${g.ass} ass · ${g.pussy}`
  : `${g.age} · ${g.body} · ${g.skin} skin · ${g.hair} hair · cock: ${g.cock}`);
function guestBody(name, hid) {
  const g = KBGuests.GUESTS[name];
  return `<h2 id="${hid}">${esc(name)}</h2><p class="gfacts">${esc(guestFacts(g))}</p>${g.hook ? `<p class="ghook">${esc(g.hook)}</p>` : ''}
    ${g.text ? `<p>${esc(g.text)}</p>` : '<p class="muted">Not written yet.</p>'}`;
}
// a guest's name in a cue, through cueOf: plain on paper
const guestName = (n) => (route.view === 'print' ? n : `<button class="guestname" data-guest="${n}">${n}</button>`);
function viewGuests() {
  const card = (n) => `<article class="card guest" id="g-${n}">${guestBody(n, 'gh-' + n)}</article>`;
  return `<div class="eyebrow">${KBThird.WOMEN.length} women, ${KBThird.MEN.length} men</div><h1>The guests</h1>
    <section class="libcat"><h2>Women</h2><div class="guests">${KBThird.WOMEN.map(card).join('')}</div></section>
    <section class="libcat"><h2>Men</h2><div class="guests">${KBThird.MEN.map(card).join('')}</div></section>`;
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
