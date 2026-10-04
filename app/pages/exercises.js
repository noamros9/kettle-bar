/* ---------------- exercise page + library ---------------- */
function usesEx(w, id) { return [...w.blocks.flatMap((b) => b.items), ...(w.warmup ? w.warmup.items : []), ...(w.cooldown ? w.cooldown.items : [])].some((it) => it.ex === id); }
// "Also in" needs the exercise index (data/index.json): asked for when the first exercise page opens, the page draws again
// when it is here; if it can't be had (offline, never cached) the card says so, and the next exercise tries again
let usageLoading = false, usageError = null;
// "Skip this exercise" (Phase 13): the button and, when skipped, what that means
function skipRow(e) {
  const on = skipList().includes(e.id);
  return `<div class="expage-skip"><button class="btn ghost" data-skip="${e.id}" aria-pressed="${on}">${on ? "Don't skip" : 'Skip this exercise'}</button>
    ${on ? '<p class="note" role="status">You skip this exercise: workouts swap it for one that works the same muscles. Settings lists the ones you skip.</p>' : ''}</div>`;
}
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
    ${stretch ? '' : skipRow(e)}
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
const exSearch = { q: '', cat: 'all', gear: 'all' };
const exFound = () => KBLibrary.searchExercises(EX, exSearch.q, exSearch, { names: MUSCLE_NAMES, cats: Object.keys(CAT) });
const exCounter = (r) => (r.count === r.total ? `${r.total} exercises` : `${r.count} of ${r.total} exercises`);
function exResults() {
  const r = exFound();
  const chip = (k, key, label, on, count) => `<button class="fchip acc" data-exf="${k}:${key}" aria-pressed="${on}">${esc(label)}${count === undefined ? '' : ` <span class="fcount">${count}</span>`}</button>`;
  const card = (e) => `<article class="ex"><button class="exlink" data-ex="${e.id}" aria-label="${esc(e.name)}: how to and muscles worked"><div class="figbox">${fig(e.id)}</div><div class="nm">${esc(e.name)}</div></button>${e.load ? `<div class="ld">${esc(LOAD[e.load])}</div>` : ''}<p class="cue">${esc(e.cue)}</p></article>`;
  const sections = r.cats.slice(1).map((c) => { const list = r.list.filter((e) => e.cat === c.key); return list.length ? `<section class="libcat"><h2>${CAT[c.key]}</h2><div class="exgrid">${list.map(card).join('')}</div></section>` : ''; }).join('');
  return `${chipsHTML(r, chip)}
    ${sections || '<p class="lede" style="margin-top:24px">No exercises match. Try another word or fewer filters.</p>'}`;
}
function chipsHTML(r, chip) {
  return `<div class="filters" role="group" aria-label="Filter by category">${r.cats.map((c) => chip('cat', c.key, c.key === 'all' ? 'All' : CAT[c.key], c.pressed, c.count)).join('')}</div>
    <div class="filters" role="group" aria-label="Filter by equipment">${KBLibrary.GEAR.map(([k, label]) => chip('gear', k, label, exSearch.gear === k)).join('')}</div>`;
}
// the Exercises page points to the Muscles page (2 Oct: the map has its own page)
const exMap = () => '<button class="lenline" data-go="muscles">Find exercises by muscle <span aria-hidden="true">→</span></button>';
/* Programs that train the picked muscles (Phase 9 ticket 2): the top 5 by muscle focus, library (data/muscles.json) and
   your own (worked out here from their days). Shown above the exercises: five cards, before a long list. */
let focusState = { data: null, loading: false, error: null };
function musclePrograms(picked, names) {
  if (!focusState.data && !focusState.loading && !focusState.error) {
    focusState.loading = true;
    focusFile.load().then((data) => { focusState = { data, loading: false, error: null }; muscleRefresh(); }, (e) => { focusState = { data: null, loading: false, error: e.message }; muscleRefresh(); });
  }
  const head = `<h2>Programs for ${esc(names)}</h2>`;
  if (focusState.error) return `<section class="libcat">${head}<p class="muted" role="status">${esc(focusState.error)}</p></section>`;
  if (!focusState.data) return `<section class="libcat">${head}<p class="muted loading" role="status">Finding programs…</p></section>`;
  const own = programs.list().filter((p) => p.source === 'own' && programs.get(p.id)).map((p) => [p.id, KBStats.programFocus(programs.get(p.id).days, EX)]);
  const focus = { ...Object.fromEntries(own), ...Object.fromEntries(Object.entries(focusState.data).filter(([pid]) => programs.has(pid))) };
  const ids = KBLibrary.rankPrograms(focus, picked, 5);
  const card = (q) => `<button class="wncard" data-open-prog="${q.id}"><span class="eyebrow">${esc(q.subject)}</span><b>${esc(q.name)}</b><span>${picked.map((m) => `${MUSCLE_NAMES[m]} ${Math.round((focus[q.id][m] || 0) * 100)}%`).join(' · ')}</span></button>`;
  return `<section class="libcat">${head}<div class="wnlist">${ids.map((id) => card(programs.summary(id))).join('')}</div>
    <p class="note">Each program's share of its sets that works the muscle, over all its days.</p></section>`;
}
/* The Muscles page (2 Oct, Noam): the front/back body always shown; tap muscles (or their chips) and every exercise that
   works them is listed, "Main muscle" first, then "Also works" (secondary), after the programs that train them most.
   Several muscles combine (Phase 9). Equipment chips narrow it, as on the Exercises page. */
const musclePick = { muscles: [], gear: 'all' };
function muscleResults() {
  const picked = musclePick.muscles;
  if (!picked.length) return '<p class="lede" style="margin-top:20px">Tap a muscle on the body, or pick one above, to see every exercise that works it.</p>';
  const names = picked.map((m) => MUSCLE_NAMES[m]).join(' + ');
  const list = Object.values(EX).filter((e) => e.cat !== 'couple' && (musclePick.gear === 'all' || KBLibrary.gearOf(e) === musclePick.gear)); // couple exercises (Phase 18) need two: not a way to train a muscle alone
  const { main, also } = KBLibrary.splitByMuscles(list, picked);
  const card = (e) => `<article class="ex"><button class="exlink" data-ex="${e.id}" aria-label="${esc(e.name)}: how to and muscles worked"><div class="figbox">${fig(e.id)}</div><div class="nm">${esc(e.name)}</div></button>${e.load ? `<div class="ld">${esc(LOAD[e.load])}</div>` : ''}<p class="cue">${esc(e.cue)}</p></article>`;
  const section = (id, title, sub, l) => `<section class="libcat" aria-labelledby="${id}"><h2 id="${id}">${title}</h2><p class="muted">${sub(l.length)}</p>${l.length ? `<div class="exgrid">${l.map(card).join('')}</div>` : ''}</section>`;
  const or = picked.map((m) => MUSCLE_NAMES[m]).join(' or ');
  const gear = `<div class="filters" role="group" aria-label="Filter by equipment">${KBLibrary.GEAR.map(([k, label]) => `<button class="fchip acc" data-mgear="${k}" aria-pressed="${musclePick.gear === k}">${esc(label)}</button>`).join('')}</div>`;
  return `${musclePrograms(picked, names)}${gear}
    ${section('main-h', 'Main muscle', (n) => `${plural(n, 'exercise')} with ${esc(or)} as a main muscle.`, main)}
    ${section('also-h', 'Also works', (n) => `${plural(n, 'exercise')} that work ${esc(or)} as a secondary muscle.`, also)}`;
}
function muscleMap() {
  const picked = musclePick.muscles, heat = Object.fromEntries(Object.keys(MUSCLE_NAMES).map((m) => [m, picked.includes(m) ? 1 : 0]));
  return `<div class="mmpick">${muscleMapSVG(heat, 'Body, front and back: tap a muscle to add or remove it')}</div>
    <div class="filters" role="group" aria-label="Muscles">${Object.entries(MUSCLE_NAMES).map(([m, n]) => `<button class="fchip acc" data-exmuscle="${m}" aria-pressed="${picked.includes(m)}">${esc(n)}</button>`).join('')}${picked.length ? '<button class="fchip" data-exmuscle-clear="1">Clear</button>' : ''}</div>`;
}
function viewMuscles() {
  return `<div class="eyebrow">${musclePick.muscles.length ? esc(musclePick.muscles.map((m) => MUSCLE_NAMES[m]).join(' + ')) : 'Front and back'}</div><h1>Muscles</h1>
    <div id="mmap">${muscleMap()}</div><div id="mresults">${muscleResults()}</div>`;
}
// redraw the map and the results only (keeps the scroll where you tapped)
function muscleRefresh() { const a = $('#mmap'), b = $('#mresults'), e = $('#app .eyebrow'); if (a) a.innerHTML = muscleMap(); if (b) b.innerHTML = muscleResults(); if (e && route.view === 'muscles') e.textContent = musclePick.muscles.length ? musclePick.muscles.map((m) => MUSCLE_NAMES[m]).join(' + ') : 'Front and back'; }
function exMuscle(m) { musclePick.muscles = m === null ? [] : KBLibrary.toggleIn(musclePick.muscles, m); muscleRefresh(); }
// redraw the counter, the map and the results only (typing in the search field keeps its focus)
function exRefresh() { const box = $('#exresults'), n = $('#excount'); if (box) box.innerHTML = exResults(); if (n) n.textContent = exCounter(exFound()); }
function exFilter(k, v) { exSearch[k] = v; exRefresh(); }
function viewLibrary() {
  return `<div class="eyebrow" id="excount">${exCounter(exFound())}</div><h1>Exercises</h1><p class="lede">Every movement and stretch used in the programs, with the equipment you have: dumbbells, one kettlebell, a pull-up bar and a mat. Tap one to see the muscles it works.</p>
  <label class="exsearch"><span class="sr">Search exercises</span><input id="ex-search" type="search" placeholder="Search by name, muscle or cue" value="${esc(exSearch.q)}" autocomplete="off" enterkeyhint="search"></label>
  <div id="exmap">${exMap()}</div>
  <div id="exresults">${exResults()}</div>`;
}
