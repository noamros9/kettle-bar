/* ---------------- random workout (Phase 7, #64) ----------------
   A sheet on the Programs page: a family (or one of its subjects), 15 / 25 / 35 minutes and equipment; the day it makes
   (app/random.js, from the recipe book) shows before Start, and Reshuffle makes another. Its level is the level of the
   day marked done last. Started, it opens at #random, a day page of its own; Mark as done writes it to the account, and
   it counts in stats, not in any program. */
let randomState = null; // { choice, seed } while the sheet is open
let randomNotice = ''; // "Random workout done…", once, on the Programs page
let randomCache = { key: '', made: null };
const RANDOM_GEAR = { all: 'All equipment', kb: 'Kettlebell only', bw: 'No equipment' };
// every day marked done, as { time, level }: program days by their day number, random workouts by their own level
const doneLevels = () => [...programs.ids().flatMap((pid) => store.entries(pid).map((e) => ({ time: e.time, level: KBRandom.levelOfDay(e.day, programs.summary(pid).dayCount) }))), ...random.levels()];
const randomDeps = () => ({ recipes: recipeBook, buildDay: KBBuilder.buildDay, newMemory: KBBuilder.newMemory, makeRnd: KBBuilder.makeRnd, cat: KBEx });
function randomMade(st) {
  const key = JSON.stringify([st.choice, st.seed]);
  if (randomCache.key !== key) randomCache = { key, made: KBRandom.make(randomDeps(), st.choice, { level: KBRandom.levelOf(doneLevels()), seed: st.seed }) };
  return randomCache.made;
}
const familyOfSubject = (name) => recipeBook.book().subjects.find(([n]) => n === name)[1];
const familyOfChoice = (c) => c.family || familyOfSubject(c.subject || c.subjects[0]);
// Rest-day flow (Phase 7 ticket 3): on a day with nothing marked done, a card offers a short mobility or flexibility
// flow; it opens the random workout's sheet with that choice. "Not today" hides it until tomorrow (on this device).
const REST_KEY = 'kb-rest-dismissed';
const doneTimes = () => doneEntries().map((e) => e.time);
function restCard() {
  let dismissed = null; try { dismissed = localStorage.getItem(REST_KEY); } catch (e) { /* blocked: shown */ }
  if (random.current() || !KBRandom.restDay(doneTimes(), new Date(), dismissed)) return '';
  return `<div class="restcard"><div class="rc-t"><b>Rest day?</b><span>A ${KBRandom.REST_DAY.minutes}-minute mobility or flexibility flow, no equipment.</span></div>
    <div class="rc-a"><button class="btn" data-rest-open="1">Show me</button><button class="btn ghost" data-rest-dismiss="1">Not today</button></div></div>`;
}
function restOpen() {
  randomNotice = '';
  randomState = { choice: JSON.parse(JSON.stringify(KBRandom.REST_DAY)), seed: KBRandom.newSeed() };
  render();
}
function restDismiss() { try { localStorage.setItem(REST_KEY, KBRandom.dayKey(new Date())); } catch (e) { /* blocked */ } render(); }
function randomSet(k, v) {
  const c = randomState.choice, keep = { minutes: c.minutes, equipment: c.equipment };
  if (k === 'family') randomState.choice = { family: v, ...keep };
  else if (k === 'subject') randomState.choice = v ? { subject: v, ...keep } : { family: familyOfChoice(c), ...keep };
  else randomState.choice = { ...c, [k]: k === 'minutes' ? +v : v };
  render();
}
function randomSheet() {
  if (!randomState) return '';
  const wrap = (body) => `<div class="sheetwrap"><button class="sheetbg" data-random-cancel="1" aria-label="Close"></button>
    <div class="sheet rsheet" role="dialog" aria-modal="true" aria-labelledby="random-h"><h2 id="random-h">Random workout</h2>${body}</div></div>`;
  if (!recipeBook) {
    if (!bookLoading && !bookError) {
      bookLoading = true;
      loadBook().then(() => { bookLoading = false; rerender(); }, (e) => { bookLoading = false; bookError = e.message; rerender(); });
    }
    return wrap(bookError
      ? `<p class="notice" role="alert">${esc(bookError.replace('Build your own', 'The random workout'))}</p><div class="actions"><button class="btn ghost" data-book-retry="1">Try again</button><button class="btn ghost" data-random-cancel="1">Cancel</button></div>`
      : '<p class="loading lede" role="status">Loading…</p>');
  }
  const c = randomState.choice, family = familyOfChoice(c), name = c.subjects ? c.subjects.join(' or ') : c.subject || family;
  const subjects = recipeBook.book().subjects.filter(([, f]) => f === family).map(([n]) => n);
  const chip = (key, value, label, on, why) => `<button class="fchip acc" data-random-set="${key}:${esc(value)}" aria-pressed="${on}"${why ? ` disabled title="${esc(why)}"` : ''}>${esc(label)}</button>`;
  const whyMinutes = (m) => KBRandom.problem(recipeBook, { ...c, minutes: m });
  const whyGear = (eq) => (KBRandom.MINUTES.some((m) => !KBRandom.problem(recipeBook, { ...c, minutes: m, equipment: eq })) ? '' : `No ${name} workouts with ${RANDOM_GEAR[eq].toLowerCase()}.`);
  const why = KBRandom.problem(recipeBook, c);
  const reasons = [...new Set(KBRandom.MINUTES.map(whyMinutes).filter((r) => r && r !== why))];
  let preview;
  if (why) preview = `<p class="notice" role="alert">${esc(why)}</p>`;
  else {
    const m = randomMade(randomState), w = m.day;
    preview = `<div class="rprev" data-seed="${esc(randomState.seed)}"><b class="rname">${esc(w.name)}</b><span class="hint">${esc(m.subject)} · about ${w.est} min${w.stretchMin ? ` + ${w.stretchMin} min stretching` : ''} · ${esc(m.program.levels[w.level - 1].split(' · ')[0])}</span>
      <ul class="rblocks">${w.blocks.map((b) => `<li><b>${esc(b.title)}</b>${(b.format || 'straight') !== 'straight' ? ` · ${esc(fmtFormat[b.format])}` : ''}: ${esc(b.items.map((it) => EX[it.ex].name).join(', '))}</li>`).join('')}</ul></div>`;
  }
  return wrap(`<p class="muted">Built fresh, at the level of the last day you marked done. It counts in your stats, not in any program.</p>
    <div class="filters" role="group" aria-label="Family">${KBRandom.FAMILIES.map((f) => chip('family', f, f, family === f)).join('')}</div>
    <div class="filters" role="group" aria-label="Subject">${chip('subject', '', `Any ${family.toLowerCase()}`, !c.subject && !c.subjects)}${subjects.map((n) => chip('subject', n, n, c.subject === n || (c.subjects || []).includes(n))).join('')}</div>
    <div class="filters" role="group" aria-label="Minutes">${KBRandom.MINUTES.map((m) => chip('minutes', m, `${m} min`, c.minutes === m, whyMinutes(m))).join('')}</div>
    ${reasons.map((r) => `<p class="hint">${esc(r)}</p>`).join('')}
    <div class="filters" role="group" aria-label="Equipment">${['all', 'kb', 'bw'].map((eq) => chip('equipment', eq, RANDOM_GEAR[eq], c.equipment === eq, whyGear(eq))).join('')}</div>
    ${preview}
    <div class="actions"><button class="btn" data-random-start="1"${why ? ' disabled' : ''}>Start</button><button class="btn ghost" data-random-shuffle="1"${why ? ' disabled' : ''}>Reshuffle</button><button class="btn ghost" data-random-cancel="1">Cancel</button></div>`);
}
function randomOpen() {
  if (random.current()) return go('random');
  randomNotice = '';
  randomState = { choice: { family: 'Strength', minutes: 25, equipment: 'all' }, seed: KBRandom.newSeed() };
  if (route.view !== 'programs') go('programs'); else render();
}
function randomStart() {
  const made = randomMade(randomState);
  randomState = null;
  random.start(made);
  go('random');
}
function randomDone() {
  const id = random.done();
  if (id) randomNotice = `Random workout done: ${random.dayOf(id).est} min added to this week. Stats has it under Random workouts.`;
  go('programs');
}
function randomFinish(w) {
  const v = KBStats.dayVolume(w, EX);
  return `<section class="finish" aria-labelledby="finish-h"><h2 id="finish-h">Workout complete</h2>
    <dl class="fstats">
      <div><dt>Sets</dt><dd class="num" data-testid="sets">${v.sets}</dd></div>
      <div><dt>Workout</dt><dd class="num" data-testid="workout-min">${Math.round(v.workoutMin)} min</dd></div>
      <div><dt>Stretching</dt><dd class="num" data-testid="stretch-min">${Math.round(v.stretchMin)} min</dd></div>
    </dl>
    <p class="fweek" data-testid="week">${weekLine()}</p>
    <div class="fmap"><h3>Muscles worked today</h3>${muscleMapSVG(v.muscles, 'Muscles worked today')}${heatLegend()}</div>
    <button class="btn" data-random-done="1">Mark as done</button>
  </section>`;
}
function viewRandom() {
  const D = random.open();
  if (!D) {
    return `<div class="crumbs"><button class="back" data-go="programs">← All programs</button></div><div class="eyebrow">Random workout</div><h1>No random workout open</h1>
      <p class="lede">Pick a family, the minutes and your equipment, and one is built for you.</p><button class="btn" data-random-open="1">Choose a random workout</button>`;
  }
  const p = D.program, w = D.day, ses = D.session();
  if (ses.started() !== null) S.resume(ses.started());
  const t = p.dayTypes[w.type], nEx = w.blocks.reduce((n, b) => n + b.items.length, 0);
  return `<div class="crumbs"><button class="back" data-go="programs">← All programs</button></div>
    <div class="whead"><div><div class="eyebrow">Random workout · ${esc(p.subject)} · ${esc(p.levels[w.level - 1].split(' · ')[0])}</div><h1>${esc(w.name)}</h1>
      <p class="daysum">${KBSummary.daySummary(w, p, KBEx).map((l) => `<span>${esc(l)}</span>`).join('')}</p>
      <div class="meta"><span class="ty"><i class="dot" style="--c:${t.c}"></i>${esc(t.label)}</span><span>About ${w.est} min${w.stretchMin ? ` + ${w.stretchMin} min stretching` : ''}</span><span>${nEx} exercises</span></div></div>
      <div class="rtools"><button class="btn" data-random-done="1">Mark as done</button><button class="btn ghost" data-random-discard="1">Discard</button></div></div>
    ${D.restored() ? '<p class="resumed" role="status">Picked up where you left off</p>' : ''}
    <p class="how">Counts in your stats when you mark it done, not in any program. Tap a set, round or pair number when you finish it and the right rest starts on the timer.</p>
    ${w.warmup ? stretchBlock(w.warmup, 'warm', 'W', 'Before you start', ses) : ''}
    ${w.blocks.map((b, bi) => blockHTML(p, w, b, bi, ses, D)).join('')}
    ${w.cooldown ? `<div class="between">Then stretch</div>${stretchBlock(w.cooldown, 'cool', 'C', w.blocks.at(-1).kind === 'abs' ? 'After the abs' : 'After the workout', ses)}` : ''}
    ${ses.allDone() ? randomFinish(w) : ''}
    ${swapSheet(D)}`;
}
