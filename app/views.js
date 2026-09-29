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
   #today (the logo, home, and the home-screen shortcut) · #programs · #exercises · #stats · #settings · #ex-<id> · #p-<pid> · #p-<pid>-d<n>   (#d<n> = Three-Split 60, kept for old links) */
// every program, through the Program Catalogue (today: all inlined in the page)
const OFFLINE_CACHE = 'kettle-bar-v2'; // the service worker's cache; the page writes loaded programs into it too
const offlineCache = {
  get: (url) => (self.caches ? caches.match(url).then((r) => r && r.json()) : Promise.resolve(undefined)),
  put: (url, v) => (self.caches ? caches.open(OFFLINE_CACHE).then((c) => c.put(url, new Response(JSON.stringify(v), { headers: { 'Content-Type': 'application/json' } }))) : Promise.resolve()),
};
const fetchJson = (url) => fetch(url).then((r) => { if (!r.ok) throw new Error(url + ': ' + r.status); return r.json(); });
const programs = KBPrograms.createProgramCatalogue(KBPrograms.fetched(PROGRAM_SUMMARIES, { fetchJson, cache: offlineCache, name: 'library' }));
// the recipe book for build your own and the random workout: fetched when first asked for, kept for offline
const recipes = KBRecipes.recipesLoader({ fetchJson, cache: offlineCache });
let recipeBook = null; // KBRecipes.of(book), once the book is here
const loadBook = () => recipes.load().then((b) => (recipeBook = recipeBook || KBRecipes.of(b)));
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
const { libraryView, FAMILIES, LENGTHS, lengthOf } = KBLibrary;
let filters = { family: 'all', subject: 'all', len: 'all' };
let lengthMenu = false; // the "Length: Any" line is open, showing the four choices
function setFilter(k, val) {
  filters = KBLibrary.setFilter(filters, k, val);
  if (k === 'len') lengthMenu = false;
}
const toggleLengthMenu = () => { lengthMenu = !lengthMenu; };
// program cards show the paragraph's first sentence
const firstSentence = (t) => (t.match(/^[^.!?]+[.!?]/) || [t])[0];
function viewPrograms() {
  const last = lastPid();
  const all = programs.list().filter((p) => p.source !== 'own'); // your own programs have their own shelf
  const mine = programs.list().filter((p) => p.source === 'own');
  const lib = libraryView(all, filters, { families: FAMILIES, lengthOf });
  lib.unknown.forEach((s) => console.error(`Subject "${s}" has no family in FAMILIES`));
  const card = (p) => {
    const n = store.count(p.id), mins = p.minutes[0] === p.minutes[1] ? p.minutes[0] : `${Math.round(p.minutes[0])}–${Math.round(p.minutes[1])}`;
    return `<button class="pcard${p.id === last ? ' current' : ''}" data-open-prog="${p.id}">
      <div class="pc-main"><span class="eyebrow">${esc(p.subject)}${p.id === last ? ' · current' : ''}${store.round(p.id) > 1 ? ` · Round ${store.round(p.id)}` : ''}</span><b>${esc(p.name)}</b><p>${esc(firstSentence(p.about || p.blurb))}</p>
        <div class="pc-tags"><span class="chip">${esc(p.split)}</span><span class="chip">~${mins} min</span>${(p.formats || ['straight']).map((f) => `<span class="chip">${fmtFormat[f]}</span>`).join('')}${p.equip === 'kb' ? '<span class="chip">Kettlebell only</span>' : p.equip === 'bw' ? '<span class="chip">No equipment</span>' : ''}</div></div>
      <div class="pc-prog"><span class="num">${n}/${p.dayCount}</span><div class="bar"><b style="width:${(n / p.dayCount) * 100}%"></b></div></div></button>`;
  };
  const groups = lib.shelves.map((s) => `<section class="pgroup"><h2>${esc(s.subject)}</h2><div class="plist">${s.programs.map(card).join('')}</div></section>`).join('');
  const yours = mine.length ? `<section class="pgroup yours"><h2>Your programs</h2><div class="plist">${mine.map(card).join('')}</div></section>` : '';
  const tab = (k, x) => `<button class="ftab" data-filter="${k}:${esc(x.key)}" aria-pressed="${x.pressed}">${esc(x.name)}</button>`;
  const chip = (x) => `<button class="fchip acc" data-filter="subject:${esc(x.key)}" aria-pressed="${x.pressed}">${esc(x.name)} <span class="fcount">${x.count}</span></button>`;
  return `<div class="eyebrow">${esc(lib.counter)}</div><h1>Programs</h1>
    <p class="lede">Every program starts at intermediate, with a matched warm-up and cool-down, and most end each workout with abs. Progress is kept per program.</p>
    <button class="btn buildbtn" data-go="build">Build your own</button>
    ${yours}
    <div class="ftabs" role="group" aria-label="Filter by family">${lib.families.map((f) => tab('family', f)).join('')}</div>
    <div class="filters" role="group" aria-label="Filter by subject">${lib.subjects.map(chip).join('')}</div>
    <button class="lenline" data-len-menu="1" aria-expanded="${lengthMenu}">Length: <b>${esc(lib.lengthLabel)}</b> <span aria-hidden="true">${lengthMenu ? '▴' : '▾'}</span></button>
    ${lengthMenu ? `<div class="filters" role="group" aria-label="Filter by length">${lib.lengths.map((l) => `<button class="fchip acc" data-filter="len:${l.key}" aria-pressed="${l.pressed}">${esc(l.label)}</button>`).join('')}</div>` : ''}
    ${groups || '<p class="lede" style="margin-top:24px">No programs match these filters.</p>'}`;
}

/* ---------------- build your own ----------------
   #build: pick a subject and the rest, see the first six days, regenerate (a new seed), save. The choices and the
   seed are what is saved (app/own.js); the days are built here from them. */
const LEVER_TEXT = { reps: 'More reps', holds: 'Longer holds', weight: 'Heavier weights', variation: 'Harder variations', tempo: 'Slower tempo' };
const GEAR_TEXT = { all: 'All equipment', kb: 'Kettlebell only', bw: 'No equipment' };
let buildState = null; // { c: choices, seed, name: null (the default) | text }
let bookError = null, bookLoading = false;
let previewCache = { key: '', program: null };
function buildPreview(b) {
  const key = JSON.stringify([b.c, b.seed]);
  if (previewCache.key !== key) previewCache = { key, program: KBOwn.programOf({ recipes: recipeBook, build: KBBuilder.build, ex: KBEx }, { id: 'preview', name: 'Preview', choices: b.c, seed: b.seed }) };
  return previewCache.program;
}
function buildSet(k, v) {
  const b = buildState, c = b.c;
  if (k === 'subject') b.c = KBOwn.defaults(recipeBook, v);
  else if (k === 'split' || k === 'minutes') b.c = KBOwn.fit(recipeBook, { ...c, [k]: +v });
  else if (k === 'equipment') b.c = KBOwn.fit(recipeBook, { ...c, equipment: v });
  else if (k === 'lever2' || k === 'lever3') b.c = { ...c, levers: c.levers.map((l, i) => (i === (k === 'lever2' ? 0 : 1) ? v : l)) };
  else if (k === 'format') { // tick or untick, keeping the subject's order
    const all = recipeBook.options(c.subjects[0]).formats;
    b.c = { ...c, formats: all.filter((f) => (f === v ? !c.formats.includes(f) : c.formats.includes(f))) };
  }
  render();
}
function buildRegenerate() { buildState.seed = KBOwn.newSeed(); render(); }
async function buildSave() {
  const b = buildState, id = KBOwn.newId(), subject = b.c.subjects[0];
  const name = (b.name || '').trim() || KBOwn.defaultName(subject);
  store.setDoc('programs', id, KBOwn.toRecord({ name, choices: b.c, seed: b.seed, catalogue: recipeBook.book().catalogue }, new Date().toISOString()));
  await ownLink.refresh(); // the program is in the catalogue before its page opens
  buildState = null;
  go('p-' + KBOwn.pidOf(id));
}
function viewBuild() {
  const head = `<div class="crumbs"><button class="back" data-go="programs">← All programs</button></div><div class="eyebrow">Programs</div><h1>Build your own</h1>`;
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
  const c = b.c, [subject] = c.subjects, o = rb.options(subject), st = KBOwn.states(rb, c);
  const chip = (key, value, label, on, state) => `<button class="fchip acc" data-b="${key}:${value}" aria-pressed="${on}"${state && !state.ok ? ` disabled title="${esc(state.reason)}"` : ''}>${esc(label)}</button>`;
  const why = (list) => list.filter((x) => x && x.reason).map((x) => `<p class="hint">${esc(x.reason)}</p>`).join('');
  const families = [...new Set(KBOwn.subjects(rb).map((x) => x.family))];
  const subjectSelect = `<select id="b-subject" aria-label="Subject">${families.map((f) => `<optgroup label="${esc(f)}">${KBOwn.subjects(rb).filter((x) => x.family === f).map((x) => `<option value="${esc(x.name)}"${x.name === subject ? ' selected' : ''}>${esc(x.name)}</option>`).join('')}</optgroup>`).join('')}</select>`;
  const leverSelect = (id, label, i) => `<label class="bfield" for="${id}"><span>${label}</span><select id="${id}">${o.levers.map((l) => `<option value="${l}"${c.levers[i] === l ? ' selected' : ''}>${LEVER_TEXT[l]}</option>`).join('')}</select></label>`;
  const problem = KBOwn.problem(rb, c);
  let preview;
  if (problem) preview = `<p class="notice" role="alert">${esc(problem)}</p>`;
  else {
    const p = buildPreview(b), TY = typesOf(p);
    preview = `<p class="pvline num">${esc(KBOwn.summaryLine(p))}</p><div class="grid pv" data-seed="${esc(b.seed)}">${p.days.slice(0, 6).map((w) => {
      const t = TY[w.type];
      return `<div class="tile"><span class="open"><span class="n num">${w.day}</span><span class="nm">${esc(w.name)}</span><span class="ty"><i class="dot" style="--c:${t.c}"></i>${esc(t.short)} · ${w.est}′</span></span></div>`;
    }).join('')}</div>`;
  }
  return `${head}<p class="lede">Pick what you want; the first six days show below. Regenerate for a different set of days, with the same choices.</p>
    <section class="bsec"><h2>Subject</h2>${subjectSelect}</section>
    <section class="bsec"><h2>Days in a cycle</h2><div class="filters" role="group" aria-label="Days in a cycle">${[1, 2, 3, 4, 5].map((n) => chip('split', n, n, c.split === n)).join('')}</div></section>
    <section class="bsec"><h2>Minutes a day</h2><div class="filters" role="group" aria-label="Minutes a day">${KBOwn.MINUTES.map((m) => chip('minutes', m, m, c.minutes === m, st.minutes[m])).join('')}</div>${why(KBOwn.MINUTES.map((m) => st.minutes[m]))}</section>
    <section class="bsec"><h2>Equipment</h2><div class="filters" role="group" aria-label="Equipment">${KBOwn.EQUIPMENT.map((e) => chip('equipment', e, GEAR_TEXT[e], c.equipment === e, st.equipment[e])).join('')}</div>${why(KBOwn.EQUIPMENT.map((e) => st.equipment[e]))}</section>
    <section class="bsec"><h2>Formats</h2><div class="filters" role="group" aria-label="Formats">${o.formats.map((f) => `<label class="fchip acc fmt"><input type="checkbox" data-bfmt="${f}"${c.formats.includes(f) ? ' checked' : ''}> ${esc(fmtFormat[f])}</label>`).join('')}</div></section>
    <section class="bsec"><h2>How it gets harder</h2><div class="bfields">${leverSelect('b-lever2', 'Level II', 0)}${leverSelect('b-lever3', 'Level III', 1)}</div></section>
    <section class="bsec"><h2>Preview</h2>${preview}
      <div class="actions"><button class="btn ghost" data-b-regen="1"${problem ? ' disabled' : ''}>Regenerate</button></div></section>
    <section class="bsec"><h2>Save</h2><label class="bfield" for="b-name"><span>Name</span><input id="b-name" type="text" maxlength="60" value="${esc(b.name === null ? KBOwn.defaultName(subject) : b.name)}" autocomplete="off"></label>
      <div class="actions"><button class="btn" data-b-save="1"${problem ? ' disabled' : ''}>Save program</button></div></section>`;
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
function viewProgram() {
  const p = prog(), n = store.count(p.id), nx = nextDay(p.id), TY = typesOf(p), r = store.round(p.id);
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
    <div class="phead"><div><div class="eyebrow">${esc(p.subject || 'Program')} · ${esc(p.split || '')} ${mins ? '· ' + mins : ''}</div><h1>${esc(p.name)}</h1><p class="lede">${esc(p.about || p.blurb)}</p>
      ${p.gear ? `<p class="gear">${esc(p.gear)}</p>` : ''}</div>
    <div class="progress">${r > 1 ? `<div class="eyebrow">Round ${r}</div>` : ''}<div class="big num">${n}<small> / ${p.days.length} days</small></div><div class="bar"><b style="width:${(n / p.days.length) * 100}%"></b></div>
      <button class="btn ghost roundbtn" data-round-start="1">Start Round ${r + 1}</button></div></div>
  <div class="cycle">${Object.entries(TY).map(([k, t]) => `<div><i class="dot" style="--c:${t.c}"></i><b>${esc(t.label)}</b><span class="days">${cycleDays(p, k)}</span></div>`).join('')}</div>
  ${nw ? `<div class="nextup"><div class="t"><span class="eyebrow">Next up · Day ${nw.day}</span><b>${esc(nw.name)}</b><span>${esc((TY[nw.type] || {}).label || nw.title)} · about ${nw.est} min</span></div><button class="btn" data-day="${nw.day}">Open workout</button></div>`
       : `<div class="nextup"><div class="t"><b>All ${p.days.length} days done</b><span>That's the full program. Start Round ${r + 1} to go again.</span></div></div>`}
  ${levels}${roundSheet(p, r)}`;
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
    ${it.swappedFrom ? `<span class="notechip swapped">Swapped from ${esc(EX[it.swappedFrom].name)}</span>${undoButton(opts.D, bi, i)}` : ''}${noteChip(it)}${e.load ? `<div class="ld">${esc(LOAD[e.load])}</div>` : ''}
    <p class="cue">${esc(e.cue)}</p>${work}${pips}</article>`;
}
function roundPips(id, total, done, what) {
  return `<div class="pips blockpips" role="group" aria-label="${what} done"><span class="lbl">${what}</span>${Array.from({ length: total }, (_, k) =>
    `<button class="pip num${done > k ? ' on' : ''}" data-rpip="${id}:${k + 1}" aria-pressed="${done > k}" aria-label="${what.replace(/s$/, '')} ${k + 1} done">${k + 1}</button>`).join('')}</div>`;
}
function runButton(bi, st, text) { return `<button class="runbtn${st.done ? ' done' : ''}" data-run="${bi}">${st.done ? '✓ Done · run again' : '▶ Start ' + text}</button>`; }
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
const dayOf = (pid, n, round) => days.resolved(pid, n, round);
// every day marked done, in every program: [{ pid, day, time }]
const doneEntries = () => programs.ids().flatMap((pid) => store.entries(pid)); // every round
// the stats for a scope ('all' or a program id) and a span, now (app/stats.js report)
const statsReport = (scope, span, round) => KBStats.report({ entries: doneEntries(), dayOf, EX, names: MUSCLE_NAMES }, { scope, round, span, now: new Date() });
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
        <button class="btn ghost choice" data-swap-apply="onward">Rest of the program<span>Days ${w.day}–${p.days.length}, wherever ${esc(from.name)} appears</span></button>
        <button class="btn ghost" data-swap-back="1">Back</button></div>`
    : `<p class="muted">Works the same main muscle (${esc(MUSCLE_NAMES[from.muscles.primary[0]])}) with this program's equipment.</p>
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
  const TY = typesOf(p), t = TY[w.type] || { label: w.title, c: 'var(--muted)' }, isD = store.isDone(p.id, w.day);
  const nEx = w.blocks.reduce((n, b) => n + b.items.length, 0);
  return `<div class="crumbs"><button class="back" data-go="program">← ${esc(p.name)}</button>
      <div class="step"><button data-day="${w.day - 1}" ${w.day <= 1 ? 'disabled' : ''} aria-label="Previous day">‹</button><button data-day="${w.day + 1}" ${w.day >= p.days.length ? 'disabled' : ''} aria-label="Next day">›</button></div></div>
    <div class="whead"><div><div class="eyebrow">${store.round(p.id) > 1 ? `Round ${store.round(p.id)} · ` : ''}Day ${w.day} · ${esc(p.levels[w.level - 1])}</div><h1>${esc(w.name)}</h1>
      <p class="daysum">${KBSummary.daySummary(w, p, KBEx).map((l) => `<span>${esc(l)}</span>`).join('')}</p>
      <div class="meta"><span class="ty"><i class="dot" style="--c:${t.c}"></i>${esc(t.label || w.title)}</span><span>About ${w.est} min${w.stretchMin ? ` + ${w.stretchMin} min stretching` : ''}</span><span>${nEx} exercises</span></div></div>
      <button class="btn ${isD ? 'done' : ''}" data-toggle="${w.day}" aria-pressed="${isD}">${isD ? '✓ Done' : 'Mark as done'}</button></div>
    <p class="how">Tap a set, round or pair number when you finish it and the right rest starts on the timer. EMOM, AMRAP, Tabata, ladder, bout and guided-flow blocks have a Start button that runs the clock for you.</p>
    ${w.warmup ? stretchBlock(w.warmup, 'warm', 'W', 'Before you start', ses) : ''}
    ${w.blocks.map((b, bi) => blockHTML(p, w, b, bi, ses, D)).join('')}
    ${w.cooldown ? `<div class="between">Then stretch</div>${stretchBlock(w.cooldown, 'cool', 'C', w.blocks.at(-1).kind === 'abs' ? 'After the abs' : 'After the workout', ses)}` : ''}
    ${ses.allDone() ? finishCard(p, w, isD) : ''}
    ${swapSheet(D)}
    <p class="note">Tap any exercise for how to do it and the muscles it works. Weights are starting points: pick a load where the last two reps are hard but clean. "Go one weight up" means the next dumbbell size or the heavier bell; "3 s lowering" means a slow 3-second lowering on every rep.</p>`;
}

/* ---------------- exercise page + library ---------------- */
function usesEx(w, id) { return [...w.blocks.flatMap((b) => b.items), ...(w.warmup ? w.warmup.items : []), ...(w.cooldown ? w.cooldown.items : [])].some((it) => it.ex === id); }
function viewExercise() {
  const e = EX[route.ex], m = e.muscles, p = prog();
  const days = p.days.filter((w) => usesEx(w, e.id)).map((w) => w.day);
  const others = programs.programsUsing(e.id).filter((id) => id !== p.id).map((id) => programs.summary(id));
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
    ${others.length ? `<div class="card" style="margin-top:16px"><h2>Also in</h2><div class="daychips">${others.map((q) => `<button class="progchip" data-open-prog="${q.id}">${esc(q.name)}</button>`).join('')}</div></div>` : ''}`;
}
function viewLibrary() {
  const cats = Object.keys(CAT);
  return `<div class="eyebrow">${Object.keys(EX).length} exercises</div><h1>Exercises</h1><p class="lede">Every movement and stretch used in the programs, with the equipment you have: dumbbells, one kettlebell, a pull-up bar and a mat. Tap one to see the muscles it works.</p>
  ${cats.map((c) => { const list = Object.values(EX).filter((e) => e.cat === c); return list.length ? `<section class="libcat"><h2>${CAT[c]}</h2><div class="exgrid">${list.map((e) => `<article class="ex"><button class="exlink" data-ex="${e.id}" aria-label="${esc(e.name)}: how to and muscles worked"><div class="figbox">${fig(e.id)}</div><div class="nm">${esc(e.name)}</div></button>${e.load ? `<div class="ld">${esc(LOAD[e.load])}</div>` : ''}<p class="cue">${esc(e.cue)}</p></article>`).join('')}</div></section>` : ''; }).join('')}`;
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
  <section class="card setting"><h2>Voice</h2>
    <label class="switch"><input type="checkbox" role="switch" id="voice-toggle"${T.voiceOn() ? ' checked' : ''}><span>Voice cues</span></label>
    <p class="muted">During holds and one-side moves, the phone says "Halfway", "Switch sides" and "Done". In guided flows it also names each pose and side, and in boxing bouts it calls each combo. The beeps stay either way. Remembered on this device.</p>
  </section>`;
}

/* ---------------- stats ---------------- */
const fmtNum = (n) => Math.round(n).toLocaleString('en-US');
function statTiles(s) {
  const tile = (label, value) => `<div class="tile-stat" role="group" aria-label="${label}"><span class="lbl">${label}</span><b>${fmtNum(value)}</b></div>`;
  return `<div class="kpis">${tile('Workouts', s.workouts)}${tile('Workout minutes', s.workoutMin)}${tile('Stretching minutes', s.stretchMin)}${tile('Sets', s.sets)}${tile('Reps', s.reps)}</div>`;
}
// the Stats page's switches: time span and program ('all' or a program id)
const statsView = { span: 'week', pid: 'all' };
const SPANS = [['week', 'This week'], ['4weeks', 'Last 4 weeks'], ['all', 'All time']];
const shortDate = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
function weekRows(rows) {
  const n = (x) => `<td class="num">${fmtNum(x)}</td>`;
  return `<div class="table-scroll"><table class="weeks"><caption>Week by week</caption>
    <thead><tr><th scope="col">Week of</th><th scope="col">Workouts</th><th scope="col">Min</th><th scope="col">Stretch min</th><th scope="col">Sets</th><th scope="col">Reps</th></tr></thead>
    <tbody>${rows.map((r) => `<tr${r.workouts ? '' : ' class="empty"'}><th scope="row">${shortDate(r.start)}</th>${n(r.workouts)}${n(r.workoutMin)}${n(r.stretchMin)}${n(r.sets)}${n(r.reps)}</tr>`).join('')}</tbody></table></div>`;
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
function viewStats() {
  const { span, pid } = statsView;
  if (stillLoading(doneEntries().map((x) => x.pid)).length) return `<h1>Stats</h1><p class="loading lede" role="status">Loading your programs…</p>`;
  const r = statsReport(pid, span, pid === 'all' ? undefined : statsView.round), { from, to } = r, all = doneEntries();
  const used = programs.list().filter((p) => all.some((e) => e.pid === p.id) || p.id === pid);
  const scopeName = pid === 'all' ? 'all programs' : programs.summary(pid).name + (statsView.round ? ` · Round ${statsView.round}` : '');
  const when = span === 'all' ? (pid === 'all' ? 'all time' : 'since you started') : `${shortDate(from)} – ${shortDate(new Date(to - 864e5))}`;
  const none = { week: 'this week', '4weeks': 'in the last 4 weeks', all: '' }[span];
  return `<div class="eyebrow">${esc(pid === 'all' ? `${when} · ${scopeName}` : `${scopeName} · ${when}`)}</div><h1>Stats</h1>
    <div class="statbar">
      <div class="filters" role="group" aria-label="Time span">${SPANS.map(([k, l]) => `<button class="fchip" data-stat-span="${k}" aria-pressed="${span === k}">${l}</button>`).join('')}</div>
      <div class="scope"><label for="stats-scope">Program</label><select id="stats-scope"><option value="all">All programs</option>${used.map((p) => `<option value="${p.id}"${p.id === pid ? ' selected' : ''}>${esc(p.name)}</option>`).join('')}</select></div>
      ${pid !== 'all' && store.round(pid) > 1 ? `<div class="scope"><label for="stats-round">Round</label><select id="stats-round"><option value="all">All rounds</option>${Array.from({ length: store.round(pid) }, (_, i) => `<option value="${i + 1}"${statsView.round === i + 1 ? ' selected' : ''}>Round ${i + 1}</option>`).join('')}</select></div>` : ''}
    </div>
    ${r.hasHistory ? statTiles(r.totals) + muscleBalance(r, `${scopeName}, ${when}`) + (r.weeks ? weekRows(r.weeks) : '') : `<p class="lede">No workouts marked done ${none || 'yet'}${none ? ' yet' : ''}.</p>`}
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
  else app.innerHTML = v === 'programs' ? viewPrograms() : v === 'build' ? viewBuild() : v === 'library' ? viewLibrary() : v === 'settings' ? viewSettings() : v === 'stats' ? viewStats() : v === 'exercise' ? viewExercise() : v === 'day' ? viewDay() : viewProgram();
  const section = v === 'library' || v === 'exercise' ? 'library' : v === 'settings' || v === 'stats' ? v : 'programs';
  document.querySelectorAll('.top [data-go]').forEach((b) => b.setAttribute('aria-current', b.dataset.go === section ? 'page' : 'false'));
  // the family tabs are a scrolling row (a re-render resets it): bring the chosen one fully into view
  const chosen = document.querySelector('.ftab[aria-pressed="true"]');
  if (chosen) { const row = chosen.parentElement; row.scrollLeft = Math.max(0, chosen.offsetLeft + chosen.offsetWidth + 4 - row.clientWidth); }
  stopAnimation();
  if (v === 'exercise') startAnimation(route.ex);
  const showTimer = v === 'day';
  $('#timer').hidden = !showTimer; document.body.classList.toggle('has-timer', showTimer);
  if (scrollTop) window.scrollTo(0, 0);
}

