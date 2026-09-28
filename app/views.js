/* Views: routing and page rendering. Reads the Progress Store (store) and Workout Session (sessionFor);
   never changes them. Globals shared with main.js and clock.js: $, esc, route, render, rerender. */
const { EX, LOAD, MUSCLE_NAMES } = KBEx;
const { figureSVG, muscleMapSVG } = KBFig;
const TYPES = {
  cba: { label: 'Chest, back & abs', short: 'Chest · Back', c: 'var(--t-cba)' },
  up: { label: 'Full body · upper focus', short: 'Upper body', c: 'var(--t-up)' },
  low: { label: 'Full body · lower focus', short: 'Lower body', c: 'var(--t-low)' },
  ac: { label: 'Abs & cardio', short: 'Abs · Cardio', c: 'var(--t-ac)' },
};
const CAT = { chest: 'Chest', back: 'Back', abs: 'Abs', cardio: 'Cardio', upper: 'Shoulders & arms', full: 'Total body', lower: 'Legs & glutes', warmup: 'Warm-up', cooldown: 'Cool-down stretches' };
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
   #programs · #exercises · #stats · #settings · #ex-<id> · #p-<pid> · #p-<pid>-d<n>   (#d<n> = Three-Split 60, kept for old links) */
const PBYID = Object.fromEntries(PROGRAMS.map((p) => [p.id, p]));
const lastPid = () => { try { const v = localStorage.getItem('kb-last-program'); return PBYID[v] ? v : null; } catch (e) { return null; } };
const rememberPid = (pid) => { try { localStorage.setItem('kb-last-program', pid); } catch (e) {} };
let route = { view: 'program', pid: PROGRAMS[0].id, day: null };
function parseHash() {
  const h = location.hash.replace('#', '');
  if (h === 'programs') return { view: 'programs' };
  if (h === 'exercises') return { view: 'library' };
  if (h === 'settings') return { view: 'settings' };
  if (h === 'stats') return { view: 'stats' };
  const x = h.match(/^ex-([a-z0-9_]+)$/);
  if (x && EX[x[1]]) return { view: 'exercise', ex: x[1], pid: route.pid };
  const pd = h.match(/^p-([a-z0-9-]+)-d(\d+)$/);
  if (pd && PBYID[pd[1]]) return { view: 'day', pid: pd[1], day: +pd[2] };
  const pp = h.match(/^p-([a-z0-9-]+)$/);
  if (pp && PBYID[pp[1]]) return { view: 'program', pid: pp[1] };
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
const prog = () => PBYID[route.pid] || PROGRAMS[0];
const typesOf = (p) => p.dayTypes || TYPES;
const itemSets = (b, it) => it.sets || b.sets;
function nextDay(p) { const d = p.days.find((w) => !store.isDone(p.id, w.day)); return d ? d.day : null; }
const unitText = (e) => KBSession.unitText(e);
function cycleDays(p, key) {
  const d = p.days.filter((w) => w.type === key).slice(0, 3).map((w) => w.day);
  return d.length ? `Days ${d.join(', ')}…` : '';
}

/* ---------------- programs page ---------------- */
const SUBJECT_ORDER = ['Signature', 'Strength', 'Pull-ups', 'Legs & glutes', 'Kettlebell only', 'Conditioning', 'Mobility & core', 'Bodyweight', 'Busy week'];
const LENGTHS = [['all', 'Any length'], ['short', 'Up to 25 min'], ['mid', '26–32 min'], ['long', '33 min +']];
const filters = { subject: 'all', len: 'all' };
const lenOf = (p) => { const m = (p.minutes[0] + p.minutes[1]) / 2; return m <= 25.5 ? 'short' : m <= 32.5 ? 'mid' : 'long'; };
function viewPrograms() {
  const last = lastPid();
  const subjects = SUBJECT_ORDER.filter((s) => PROGRAMS.some((p) => p.subject === s));
  const shown = PROGRAMS.filter((p) => (filters.subject === 'all' || p.subject === filters.subject) && (filters.len === 'all' || lenOf(p) === filters.len));
  const card = (p) => {
    const n = store.count(p.id), mins = p.minutes[0] === p.minutes[1] ? p.minutes[0] : `${Math.round(p.minutes[0])}–${Math.round(p.minutes[1])}`;
    return `<button class="pcard${p.id === last ? ' current' : ''}" data-open-prog="${p.id}">
      <div class="pc-main"><span class="eyebrow">${esc(p.subject)}${p.id === last ? ' · current' : ''}</span><b>${esc(p.name)}</b><p>${esc(p.blurb)}</p>
        <div class="pc-tags"><span class="chip">${esc(p.split)}</span><span class="chip">~${mins} min</span>${(p.formats || ['straight']).map((f) => `<span class="chip">${fmtFormat[f]}</span>`).join('')}${p.equip === 'kb' ? '<span class="chip">Kettlebell only</span>' : p.equip === 'bw' ? '<span class="chip">No equipment</span>' : ''}</div></div>
      <div class="pc-prog"><span class="num">${n}/${p.days.length}</span><div class="bar"><b style="width:${(n / p.days.length) * 100}%"></b></div></div></button>`;
  };
  const groups = subjects.map((s) => { const list = shown.filter((p) => p.subject === s); return list.length ? `<section class="pgroup"><h2>${esc(s)}</h2><div class="plist">${list.map(card).join('')}</div></section>` : ''; }).join('');
  return `<div class="eyebrow">${PROGRAMS.length} programs · 60 days each</div><h1>Programs</h1>
    <p class="lede">Every program starts at intermediate and ends each workout with abs, with a matched warm-up and cool-down. Progress is kept per program.</p>
    <div class="filters" role="group" aria-label="Filter by subject"><button class="fchip" data-filter="subject:all" aria-pressed="${filters.subject === 'all'}">All</button>${subjects.map((s) => `<button class="fchip" data-filter="subject:${esc(s)}" aria-pressed="${filters.subject === s}">${esc(s)}</button>`).join('')}</div>
    <div class="filters" role="group" aria-label="Filter by length">${LENGTHS.map(([k, l]) => `<button class="fchip" data-filter="len:${k}" aria-pressed="${filters.len === k}">${l}</button>`).join('')}</div>
    ${groups || '<p class="lede" style="margin-top:24px">No programs match these filters.</p>'}`;
}

/* ---------------- program page ---------------- */
function viewProgram() {
  const p = prog(), n = store.count(p.id), nx = nextDay(p), TY = typesOf(p);
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
    <div class="phead"><div><div class="eyebrow">${esc(p.subject || 'Program')} · ${esc(p.split || '')} ${mins ? '· ' + mins : ''}</div><h1>${esc(p.name)}</h1><p class="lede">${esc(p.blurb)}</p>
      ${p.gear ? `<p class="gear">${esc(p.gear)}</p>` : ''}</div>
    <div class="progress"><div class="big num">${n}<small> / ${p.days.length} days</small></div><div class="bar"><b style="width:${(n / p.days.length) * 100}%"></b></div></div></div>
  <div class="cycle">${Object.entries(TY).map(([k, t]) => `<div><i class="dot" style="--c:${t.c}"></i><b>${esc(t.label)}</b><span class="days">${cycleDays(p, k)}</span></div>`).join('')}</div>
  ${nw ? `<div class="nextup"><div class="t"><span class="eyebrow">Next up · Day ${nw.day}</span><b>${esc(nw.name)}</b><span>${esc((TY[nw.type] || {}).label || nw.title)} · about ${nw.est} min</span></div><button class="btn" data-day="${nw.day}">Open workout</button></div>`
       : `<div class="nextup"><div class="t"><b>All ${p.days.length} days done</b><span>That's the full program.</span></div></div>`}
  ${levels}`;
}

/* ---------------- workout page ---------------- */
// one Workout Session per open day (kept while you look at exercise pages and come back)
const live = { key: null, s: null };
function sessionFor(p, w) {
  const key = p.id + ':' + w.day;
  if (live.key !== key) { live.key = key; live.s = KBSession.createSession(p, w, { EX }); }
  return live.s;
}
const fmtFormat = KBSession.FORMAT_NAMES;
function noteChip(it) { return it.note ? `<span class="notechip">${esc(it.note)}</span>` : ''; }
function exCard(it, i, bi, opts = {}) {
  const e = EX[it.ex], b = opts.block, st = opts.state, ses = opts.session;
  const straight = st && st.f === 'straight';
  const sets = b ? ses.itemSets(b, it) : 0, done = straight ? st.sets[i] : 0;
  const count = opts.count || `<b class="num">${it.n}</b><span>${unitText(e, it.n)}</span>`;
  const pips = straight ? `<div class="pips" role="group" aria-label="Sets of ${esc(e.name)} done"><span class="lbl">Sets</span>${Array.from({ length: sets }, (_, k) =>
    `<button class="pip num${done > k ? ' on' : ''}" data-pip="${bi}:${i}:${k + 1}" aria-pressed="${done > k}" aria-label="Set ${k + 1} of ${esc(e.name)} done">${k + 1}</button>`).join('')}</div>` : '';
  const work = straight && e.u === 'sec' && done < sets ? `<button class="workbtn" data-work="${bi}:${i}">▶ Start set ${done + 1} · ${it.n} s${e.side ? ' each side' : ''}</button>` : '';
  return `<article class="ex${straight && done >= sets ? ' fin' : ''}"><div class="ord">${opts.label || String(i + 1).padStart(2, '0')}${straight ? ` · ${sets} sets` : ''}</div>
    <button class="exlink" data-ex="${it.ex}" aria-label="${esc(e.name)}: how to and muscles worked"><div class="figbox">${fig(it.ex)}</div>
    <div class="cnt">${count}</div><div class="nm">${esc(e.name)}</div></button>
    ${noteChip(it)}${e.load ? `<div class="ld">${esc(LOAD[e.load])}</div>` : ''}
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
function blockHTML(p, w, b, bi, ses) {
  const R = ses.rests, st = ses.state(bi), f = b.format || 'straight';
  const letter = b.kind === 'abs' ? 'Abs' : String(bi + 1);
  const perUnit = (it, what) => `<b class="num">${it.n}</b><span>${EX[it.ex].u === 'sec' ? 'sec' : 'reps'} ${what}${what === 'per minute' && EX[it.ex].side && EX[it.ex].u !== 'sec' ? ', each side' : ''}</span>`;
  let desc = '', body = '', side = '';
  if (f === 'straight') {
    const sets = [...new Set(b.items.map((it) => ses.itemSets(b, it)))];
    desc = `${b.items.length} exercises · ${sets.join('/')} sets each · ${R.set} s between sets · ${R.exercise / 60} min between exercises`;
    body = `<div class="exgrid">${b.items.map((it, i) => exCard(it, i, bi, { block: b, state: st, session: ses })).join('')}</div>`;
  } else if (f === 'superset') {
    desc = `Pairs: do the two back to back, then rest ${R.superset} s · ${b.sets} rounds per pair · ${R.exercise / 60} min between pairs`;
    body = Array.from({ length: ses.pairsOf(b) }, (_, pi) => b.items.slice(pi * 2, pi * 2 + 2)).map((pair, pi) => `<div class="pair"><div class="pairhead"><b>Pair ${LETTERS[pi]}</b>${roundPips(bi + ':' + pi, b.sets, st.sets[pi], 'Rounds')}</div>
      <div class="exgrid">${pair.map((it, j) => exCard(it, pi * 2 + j, bi, { label: `${LETTERS[pi]}${j + 1}` })).join('')}</div></div>`).join('');
  } else if (f === 'circuit') {
    desc = `One after another with no rest · ${b.rounds} rounds · ${R.round / 60} min rest between rounds`;
    side = roundPips(bi, b.rounds, st.rounds, 'Rounds');
    body = `<div class="exgrid">${b.items.map((it, i) => exCard(it, i, bi)).join('')}</div>`;
  } else if (f === 'emom') {
    desc = `Every minute on the minute for ${b.minutes} min: do the reps, rest until the next minute. The exercise changes each minute.`;
    side = runButton(bi, st, `EMOM · ${b.minutes} min`);
    body = `<div class="exgrid">${b.items.map((it, i) => exCard(it, i, bi, { label: `Min ${i + 1}, ${i + 1 + b.items.length}…`, count: perUnit(it, 'per minute') })).join('')}</div>`;
  } else if (f === 'amrap') {
    desc = `As many rounds as possible in ${b.minutes} min, moving steadily. Tap + after each round.`;
    side = runButton(bi, st, `AMRAP · ${b.minutes} min`) + counter(bi, st.count, 'Rounds');
    body = `<div class="exgrid">${b.items.map((it, i) => exCard(it, i, bi, { count: perUnit(it, 'per round') })).join('')}</div>`;
  } else if (f === 'tabata') {
    desc = `${b.tabatas} × 4 min: 20 s as hard as you can, 10 s rest, 8 rounds, exercises rotate. 1 min between Tabatas. The timer runs it all.`;
    side = runButton(bi, st, `Tabata · ${b.tabatas * 4} min`);
    body = `<div class="exgrid">${b.items.map((it, i) => exCard(it, i, bi, { count: '<b class="num">20</b><span>sec hard, 10 sec rest</span>' })).join('')}</div>`;
  } else if (f === 'ladder') {
    desc = `${b.minutes} min: 1 rep of each exercise, then 2, then 3… keep climbing until time runs out. Tap + after each rung.`;
    side = runButton(bi, st, `Ladder · ${b.minutes} min`) + counter(bi, st.count, 'Rungs');
    body = `<div class="exgrid">${b.items.map((it, i) => exCard(it, i, bi, { count: `<b class="num">1→</b><span>${EX[it.ex].side ? 'reps each side, ' : 'reps, '}+1 each rung</span>` })).join('')}</div>`;
  }
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
// every day marked done, in every program: [{ pid, day, time }]
const doneEntries = () => PROGRAMS.flatMap((p) => Object.entries(store.days(p.id)).map(([day, time]) => ({ pid: p.id, day: +day, time })));
function weekLine() {
  const from = KBStats.weekStart(new Date()), to = new Date(from); to.setDate(to.getDate() + 7);
  const s = KBStats.summarize(doneEntries(), { programs: PBYID, EX, from, to });
  const nw = (t) => `<span class="nw">${t}</span>`; // keep each phrase on one line when it wraps
  return `${nw(`This week: ${plural(s.workouts, 'workout')}`)} · ${nw(`${Math.round(s.workoutMin)} min`)} + ${nw(`${Math.round(s.stretchMin)} min stretching`)}`;
}
// the next day not done yet after this one (or the first one left)
function nextPreview(p, w) {
  const left = p.days.filter((d) => !store.isDone(p.id, d.day));
  const n = left.find((d) => d.day > w.day) || left.find((d) => d.day !== w.day);
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
function viewDay() {
  const p = prog(), w = p.days[route.day - 1];
  if (!w) return viewProgram();
  rememberPid(p.id);
  const ses = sessionFor(p, w);
  const TY = typesOf(p), t = TY[w.type] || { label: w.title, c: 'var(--muted)' }, isD = store.isDone(p.id, w.day);
  const nEx = w.blocks.reduce((n, b) => n + b.items.length, 0);
  return `<div class="crumbs"><button class="back" data-go="program">← ${esc(p.name)}</button>
      <div class="step"><button data-day="${w.day - 1}" ${w.day <= 1 ? 'disabled' : ''} aria-label="Previous day">‹</button><button data-day="${w.day + 1}" ${w.day >= p.days.length ? 'disabled' : ''} aria-label="Next day">›</button></div></div>
    <div class="whead"><div><div class="eyebrow">Day ${w.day} · ${esc(p.levels[w.level - 1])}</div><h1>${esc(w.name)}</h1>
      <div class="meta"><span class="ty"><i class="dot" style="--c:${t.c}"></i>${esc(t.label || w.title)}</span><span>About ${w.est} min${w.stretchMin ? ` + ${w.stretchMin} min stretching` : ''}</span><span>${nEx} exercises</span></div></div>
      <button class="btn ${isD ? 'done' : ''}" data-toggle="${w.day}" aria-pressed="${isD}">${isD ? '✓ Done' : 'Mark as done'}</button></div>
    <p class="how">Tap a set, round or pair number when you finish it and the right rest starts on the timer. EMOM, AMRAP, Tabata and ladder blocks have a Start button that runs the clock for you.</p>
    ${w.warmup ? stretchBlock(w.warmup, 'warm', 'W', 'Before you start', ses) : ''}
    ${w.blocks.map((b, bi) => blockHTML(p, w, b, bi, ses)).join('')}
    ${w.cooldown ? `<div class="between">Then stretch</div>${stretchBlock(w.cooldown, 'cool', 'C', 'After the abs', ses)}` : ''}
    ${ses.allDone() ? finishCard(p, w, isD) : ''}
    <p class="note">Tap any exercise for how to do it and the muscles it works. Weights are starting points: pick a load where the last two reps are hard but clean. "Go one weight up" means the next dumbbell size or the heavier bell; "3 s lowering" means a slow 3-second lowering on every rep.</p>`;
}

/* ---------------- exercise page + library ---------------- */
function usesEx(w, id) { return [...w.blocks.flatMap((b) => b.items), ...(w.warmup ? w.warmup.items : []), ...(w.cooldown ? w.cooldown.items : [])].some((it) => it.ex === id); }
function viewExercise() {
  const e = EX[route.ex], m = e.muscles, p = prog();
  const days = p.days.filter((w) => usesEx(w, e.id)).map((w) => w.day);
  const others = PROGRAMS.filter((q) => q.id !== p.id && q.days.some((w) => usesEx(w, e.id)));
  const names = (arr) => arr.map((k) => `<span class="chip">${MUSCLE_NAMES[k]}</span>`).join(' ');
  const r = e.r, stretch = e.cat === 'warmup' || e.cat === 'cooldown';
  const dose = stretch ? `${r[0]} s${e.side ? ' each side' : ''}` : e.u === 'sec' ? `${r.join(' / ')} s${e.side ? ' each side' : ''} (Level I / II / III)` : `${r.join(' / ')} ${unitText(e)} (Level I / II / III)`;
  return `<div class="crumbs"><button class="back" data-back="1">← Back</button></div>
    <div class="eyebrow">${CAT[e.cat] || ''}</div><h1>${esc(e.name)}</h1>
    <div class="expage">
      <div class="card"><div class="bigfig">${fig(e.id)}</div>
        <dl class="facts">
          <div><dt>How to</dt><dd>${esc(e.cue)}</dd></div>
          <div><dt>${stretch ? 'Hold' : 'Reps'}</dt><dd>${dose}</dd></div>
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
// Import in progress: null · { error } · { done } · { name, programs, unknown, diff }
let importState = null;
function importReview(st) {
  const ids = Object.keys(st.diff);
  const add = ids.reduce((a, pid) => a + st.diff[pid].added.length, 0);
  const remove = ids.reduce((a, pid) => a + st.diff[pid].removed.length, 0);
  const line = (pid) => {
    const { added, removed } = st.diff[pid];
    const parts = [];
    if (added.length) parts.push(`+${plural(added.length, 'day')} (${KBBackup.dayRanges(added)})`);
    if (removed.length) parts.push(`−${plural(removed.length, 'day')} (${KBBackup.dayRanges(removed)})`);
    return `<li>${esc(PBYID[pid].name)}: ${parts.join(' · ')}</li>`;
  };
  const skipped = st.unknown.length ? `<p class="muted">Skipped ${plural(st.unknown.length, 'program')} this app doesn't have: ${st.unknown.map(esc).join(', ')}</p>` : '';
  const body = ids.length
    ? `<ul class="difflist">${ids.map(line).join('')}</ul>${skipped}
      <p class="muted">Merge keeps every day from both. Replace makes each program in the file match it exactly${remove ? ', so the days marked − are removed' : ''}.</p>
      <div class="actions">${add ? `<button class="btn" data-backup="merge">Merge: add ${plural(add, 'day')}</button>` : ''}
        <button class="btn ghost" data-backup="replace">Replace: add ${add}, remove ${remove}</button>
        <button class="btn ghost" data-backup="cancel">Cancel</button></div>`
    : `<p>This backup matches your progress. Nothing to import.</p>${skipped}<div class="actions"><button class="btn ghost" data-backup="cancel">Close</button></div>`;
  return `<div class="review" id="import-review"><p><b>${esc(st.name)}</b></p>${body}</div>`;
}
function viewSettings() {
  const counts = PROGRAMS.map((p) => store.count(p.id)).filter((n) => n > 0);
  const days = counts.reduce((a, n) => a + n, 0);
  const st = importState || {};
  return `<h1>Settings</h1>
  <section class="card setting"><h2>Backup</h2>
    <p>Download the days you've marked done in every program as one file. Keep it somewhere safe, or import it on another device.</p>
    <p class="muted" id="backup-summary">${days ? `${plural(days, 'day')} done across ${plural(counts.length, 'program')}` : 'No days marked done yet'}</p>
    <div class="actions"><button class="btn" data-backup="export">Export progress</button>
      <button class="btn ghost" data-backup="import">Import a backup</button></div>
    <input type="file" id="import-file" accept=".json,application/json" hidden>
    ${st.error ? `<p class="err" role="alert">${esc(st.error)}</p>` : ''}
    ${st.done ? `<p class="ok" role="status">${esc(st.done)}</p>` : ''}
    ${st.diff ? importReview(st) : ''}
  </section>`;
}

/* ---------------- stats ---------------- */
const fmtNum = (n) => Math.round(n).toLocaleString('en-US');
function statTiles(s) {
  const tile = (label, value) => `<div class="tile-stat" role="group" aria-label="${label}"><span class="lbl">${label}</span><b>${fmtNum(value)}</b></div>`;
  return `<div class="kpis">${tile('Workouts', s.workouts)}${tile('Workout minutes', s.workoutMin)}${tile('Stretching minutes', s.stretchMin)}${tile('Sets', s.sets)}${tile('Reps', s.reps)}</div>`;
}
function viewStats() {
  const from = KBStats.weekStart(new Date()), to = new Date(from); to.setDate(to.getDate() + 7);
  const s = KBStats.summarize(doneEntries(), { programs: PBYID, EX, from, to });
  const range = `${from.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${new Date(to - 864e5).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
  return `<div class="eyebrow">This week · ${range} · all programs</div><h1>Stats</h1>
    ${s.workouts ? statTiles(s) : '<p class="lede">No workouts marked done this week yet.</p>'}
    <p class="note">Counts the planned work of each day you marked done: its sets, reps and minutes. Weeks start on Sunday.</p>`;
}

function render(scrollTop) {
  const app = $('#app');
  const v = route.view;
  app.innerHTML = v === 'programs' ? viewPrograms() : v === 'library' ? viewLibrary() : v === 'settings' ? viewSettings() : v === 'stats' ? viewStats() : v === 'exercise' ? viewExercise() : v === 'day' ? viewDay() : viewProgram();
  const section = v === 'library' || v === 'exercise' ? 'library' : v === 'settings' || v === 'stats' ? v : 'programs';
  document.querySelectorAll('.top [data-go]').forEach((b) => b.setAttribute('aria-current', b.dataset.go === section ? 'page' : 'false'));
  const showTimer = v === 'day';
  $('#timer').hidden = !showTimer; document.body.classList.toggle('has-timer', showTimer);
  if (scrollTop) window.scrollTo(0, 0);
}

