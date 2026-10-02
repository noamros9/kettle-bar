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
    ${it.travel ? `<span class="notechip swapped">Swapped for travel, from ${esc(EX[it.swappedFrom].name)}</span>` : it.skipped ? `<span class="notechip swapped">Swapped: you skip ${esc(EX[it.swappedFrom].name)}</span>` : it.swappedFrom ? `<span class="notechip swapped">Swapped from ${esc(EX[it.swappedFrom].name)}</span>${undoButton(opts.D, bi, i)}` : ''}${it.travelMissing ? '<span class="notechip needsgear">Needs gear: nothing to swap to</span>' : ''}${it.skipMissing ? '<span class="notechip needsgear">You skip this, no stand-in</span>' : ''}${noteChip(it)}${e.load ? `<div class="ld">${esc(LOAD[e.load])}</div>` : ''}
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
const statsEntries = () => KBStats.scoped(doneEntries(), statsView.pid, statsView.round);
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
    ${D.restored() ? '<p class="resumed" role="status">Picked up where you left off</p>' : ''}${travelNote(D)}${skipNote(D)}
    <p class="how">Tap a set, round or pair number when you finish it and the right rest starts on the timer. EMOM, AMRAP, Tabata, ladder, bout and guided-flow blocks have a Start button that runs the clock for you.</p>
    ${w.warmup ? stretchBlock(w.warmup, 'warm', 'W', 'Before you start', ses) : ''}
    ${w.blocks.map((b, bi) => blockHTML(p, w, b, bi, ses, D)).join('')}
    ${w.cooldown ? `<div class="between">Then stretch</div>${stretchBlock(w.cooldown, 'cool', 'C', w.blocks.at(-1).kind === 'abs' ? 'After the abs' : 'After the workout', ses)}` : ''}
    ${ses.allDone() ? finishCard(p, w, isD) : ''}
    ${swapSheet(D)}${roundSheet(p, store.round(p.id))}
    <p class="note">Tap any exercise for how to do it and the muscles it works. Weights are starting points: pick a load where the last two reps are hard but clean. "Go one weight up" means the next dumbbell size or the heavier bell; "3 s lowering" means a slow 3-second lowering on every rep.</p>`;
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
// Exercises I skip (Phase 13): what the open day swapped for them, and what stayed with no stand-in
function skipNote(D) {
  const items = D.day.blocks.flatMap((b) => b.items), swapped = items.filter((it) => it.skipped).length, stuck = items.filter((it) => it.skipMissing).length;
  if (!swapped && !stuck) return '';
  const what = [swapped ? `${plural(swapped, 'exercise')} you skip ${swapped === 1 ? 'is' : 'are'} swapped for today` : '', stuck ? `${plural(stuck, 'exercise')} you skip ${stuck === 1 ? 'stays' : 'stay'}: nothing works the same muscles` : ''].filter(Boolean).join('; ');
  return `<p class="travelnote skipnote" role="status">${what[0].toUpperCase() + what.slice(1)}. <button class="linkbtn" data-go="settings">Change</button></p>`;
}
function travelNote(D) {
  const mode = D.travel && D.travel();
  if (!mode) return '';
  const items = D.day.blocks.flatMap((b) => b.items), swapped = items.filter((it) => it.travel).length, stuck = items.filter((it) => it.travelMissing).length;
  const what = swapped ? `${plural(swapped, 'exercise')} swapped for today` : 'nothing needed swapping today';
  return `<p class="travelnote" role="status"><b>Travel mode: ${esc(TRAVEL_TEXT[mode].toLowerCase())}.</b> ${what}${stuck ? `; ${plural(stuck, 'exercise')} still ${stuck === 1 ? 'needs' : 'need'} gear (nothing works the same muscles without it)` : ''}. <button class="linkbtn" data-go="settings">Change</button></p>`;
}
