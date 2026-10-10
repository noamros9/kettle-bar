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
  const names = (arr) => arr.map((k) => `<button class="chip" data-exmuscle-link="${k}" aria-label="Exercises that work ${MUSCLE_NAMES[k]}">${MUSCLE_NAMES[k]}</button>`).join(' '); // #234
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
/* Exercises page: a search (name, muscle, cue) and chips by family and equipment, through KBLibrary.searchExercises.
   Typing redraws only the results, so the field keeps focus; the search stays while you look at an exercise and come back.
   #234: one muscle at a time (main or secondary), from the route: the URL holds it, so Back and a shared link keep it.
   Phase 21: one row of family tabs, then the picked family's subjects; sections follow the pick (all / family / subject).
   Equipment and Muscle are one-line menus, like Programs' Length and Equipment. Which menu is open is page state only, never the URL. */
const exFamName = Object.fromEntries(KBLibrary.EX_FAMILIES.map(([k, n]) => [k, n]));
const exSubName = Object.fromEntries(KBLibrary.EX_FAMILIES.flatMap(([, , list]) => list));
const exSearch = { q: '', family: 'all', sub: 'all', gear: 'all', muscle: null };
let exMenu = null; // 'gear' | 'muscle': which of "Equipment: Any" and "Muscle: Any" is open
const toggleExMenu = (which) => { exMenu = exMenu === which ? null : which; };
const exFound = () => KBLibrary.searchExercises(EX, exSearch.q, { ...exSearch, muscles: exSearch.muscle ? [exSearch.muscle] : [] }, { names: MUSCLE_NAMES });
const exCounter = (r) => (r.count === r.total ? `${r.total} exercises` : `${r.count} of ${r.total} exercises`);
// Phase 30 (211): the Muscles family's parts sit under Upper / Core / Lower labels; other families stay one row
const TOP_OF_PART = Object.fromEntries(KBEx.MUSCLE_GROUPS.flatMap(([, name, parts]) => parts.map(([p]) => [p, name])));
function subChips(subjects, fam, chip) {
  const one = (c) => chip('sub', c.key, c.key === 'all' ? 'All' : exSubName[c.key], c.pressed, c.count);
  if (fam !== 'muscles') return subjects.map(one).join('');
  let last = null;
  return subjects.map((c) => {
    const top = TOP_OF_PART[c.key] || null, label = top && top !== last ? `<span class="fglabel" aria-hidden="true">${esc(top)}</span>` : '';
    if (c.key !== 'all') last = top;
    return (c.key === 'full' ? '<span class="fglabel" aria-hidden="true"></span>' : label) + one(c);
  }).join('');
}
function exResults() {
  const r = exFound();
  const chip = (k, key, label, on, count) => `<button class="fchip acc" data-exf="${k}:${key}" aria-pressed="${on}">${esc(label)}${count === undefined ? '' : ` <span class="fcount">${count}</span>`}</button>`;
  const card = (e) => `<article class="ex"><button class="exlink" data-ex="${e.id}" aria-label="${esc(e.name)}: how to and muscles worked"><div class="figbox">${fig(e.id)}</div><div class="nm">${esc(e.name)}</div></button>${e.load ? `<div class="ld">${esc(LOAD[e.load])}</div>` : ''}<p class="cue">${esc(e.cue)}</p></article>`;
  const fam = r.families.find((c) => c.pressed).key;
  const sub = (r.subjects.find((c) => c.pressed) || { key: 'all' }).key;
  const groupOf = (e) => { const x = KBLibrary.familyOf(e); return fam === 'all' ? x.family : x.subject; };
  const keys = fam === 'all' ? r.families.slice(1).map((c) => c.key) : sub !== 'all' ? [sub] : r.subjects.slice(1).map((c) => c.key);
  const title = (k) => (fam === 'all' ? exFamName[k] : exSubName[k]);
  const sections = keys.map((k) => { const list = r.list.filter((e) => groupOf(e) === k); return list.length ? `<section class="libcat"><h2>${esc(title(k))}</h2><div class="exgrid">${list.map(card).join('')}</div></section>` : ''; }).join('');
  return `${chipsHTML(r, chip)}
    ${sections || '<p class="lede" style="margin-top:24px">No exercises match. Try another word or fewer filters.</p>'}`;
}
function chipsHTML(r, chip) {
  const gearLabel = exSearch.gear === 'all' ? 'Any' : KBLibrary.GEAR.find(([k]) => k === exSearch.gear)[1];
  const muscleLabel = MUSCLE_NAMES[exSearch.muscle] || 'Any';
  const menuLine = (k, name, label) => `<button class="lenline" data-ex-menu="${k}" aria-expanded="${exMenu === k}">${name}: <b>${esc(label)}</b> <span aria-hidden="true">${exMenu === k ? '▴' : '▾'}</span></button>`;
  const menuChips = (k, what, list) => `<div class="filters" role="group" aria-label="Filter by ${what}">${list.map((l) => `<button class="fchip acc" data-exf="${k}:${l.key}" aria-pressed="${l.pressed}">${esc(l.label)}</button>`).join('')}</div>`;
  const tab = (c) => `<button class="ftab" data-exf="family:${c.key}" aria-pressed="${c.pressed}">${esc(c.key === 'all' ? 'All' : exFamName[c.key])} <span class="fcount">${c.count}</span></button>`;
  const gears = KBLibrary.GEAR.map(([key, label]) => ({ key, label, pressed: exSearch.gear === key }));
  const muscles = Object.entries(MUSCLE_NAMES).map(([key, label]) => ({ key, label, pressed: exSearch.muscle === key }));
  return `<div class="ftabs" role="group" aria-label="Filter by family">${r.families.map(tab).join('')}</div>
    ${r.subjects.length ? `<div class="filters" role="group" aria-label="Filter by subject">${subChips(r.subjects, fam, chip)}</div>` : ''}
    <div class="lenlines">${menuLine('gear', 'Equipment', gearLabel)}${menuLine('muscle', 'Muscle', muscleLabel)}</div>
    ${exMenu === 'gear' ? menuChips('gear', 'equipment', gears) : exMenu === 'muscle' ? menuChips('muscle', 'muscle', muscles) : ''}
    ${exSearch.q || exSearch.family !== 'all' || exSearch.sub !== 'all' || exSearch.gear !== 'all' || exSearch.muscle ? '<button class="fchip" data-ex-clear="1">Clear all</button>' : ''}`;
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
    ${KBEx.MUSCLE_GROUPS.map(([top, name, parts]) => `<div class="filters mgroup" role="group" aria-label="${esc(name)} muscles"><span class="fglabel" aria-hidden="true">${esc(name)}</span>${parts.map(([part, pname, ms]) =>
      `<button class="fchip acc partchip" data-expart="${part}" aria-pressed="${ms.every((m) => picked.includes(m))}">${esc(pname)}${ms.length > 1 ? ' <span class="fcount" aria-hidden="true">all</span>' : ''}</button>${ms.length > 1 ? ms.map((m) => `<button class="fchip acc" data-exmuscle="${m}" aria-pressed="${picked.includes(m)}">${esc(MUSCLE_NAMES[m])}</button>`).join('') : ''}`).join('')}</div>`).join('')}
    ${picked.length ? '<div class="filters"><button class="fchip" data-exmuscle-clear="1">Clear</button></div>' : ''}`;
}
// Phase 30 (210): a part's chip picks all its muscles, or unpicks them when all are picked; a one-muscle part is that muscle
function exPart(part) {
  const ms = KBEx.MUSCLE_GROUPS.flatMap(([, , parts]) => parts).find(([p]) => p === part)[2];
  const all = ms.every((m) => musclePick.muscles.includes(m));
  musclePick.muscles = all ? musclePick.muscles.filter((m) => !ms.includes(m)) : [...musclePick.muscles, ...ms.filter((m) => !musclePick.muscles.includes(m))];
  muscleRefresh();
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
// a muscle pick replaces the one picked (tapping it again unpicks it) and replaces the URL, so it adds no Back step
function exFilter(k, v) {
  if (k === 'muscle') { exSearch.muscle = exSearch.muscle === v ? null : v; history.replaceState(null, '', '#exercises' + (exSearch.muscle ? '?muscle=' + exSearch.muscle : '')); }
  else { exSearch[k] = v; if (k === 'family') exSearch.sub = 'all'; }
  if (k === 'gear' || k === 'muscle') exMenu = null; // picking a chip closes its menu
  exRefresh();
}
function exClear() {
  Object.assign(exSearch, { q: '', family: 'all', sub: 'all', gear: 'all', muscle: null });
  exMenu = null;
  history.replaceState(null, '', '#exercises');
  const field = $('#ex-search'); if (field) field.value = '';
  exRefresh();
}
function viewLibrary() {
  exSearch.muscle = route.muscle || null;
  return `<div class="eyebrow" id="excount">${exCounter(exFound())}</div><h1>Exercises</h1><p class="lede">Every movement and stretch used in the programs, with the equipment you have: dumbbells, one kettlebell, a pull-up bar and a mat. Tap one to see the muscles it works.</p>
  <label class="exsearch"><span class="sr">Search exercises</span><input id="ex-search" type="search" placeholder="Search by name, muscle or cue" value="${esc(exSearch.q)}" autocomplete="off" enterkeyhint="search"></label>
  <div id="exmap">${exMap()}</div>
  <div id="exresults">${exResults()}</div>`;
}
