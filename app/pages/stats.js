/* ---------------- stats ---------------- */
const fmtNum = (n) => Math.round(n).toLocaleString('en-US');
function statTiles(s) {
  const tile = (label, value) => `<div class="tile-stat" role="group" aria-label="${label}"><span class="lbl">${label}</span><b>${fmtNum(value)}</b></div>`;
  return `<div class="kpis">${tile('Workouts', s.workouts)}${tile('Workout minutes', s.workoutMin)}${tile('Stretching minutes', s.stretchMin)}${tile('Sets', s.sets)}${tile('Reps', s.reps)}</div>`;
}
// the Stats page's switches: time span and program ('all' or a program id)
// and the tab (Phase 8): Overview · Muscles · Time, the switches staying above them and carrying across
const statsView = { span: 'week', pid: 'all', tab: 'overview' };
const STAT_TABS = [['overview', 'Overview'], ['muscles', 'Muscles'], ['time', 'Time'], ['exercises', 'Exercises'], ['history', 'History']];
const SPANS = [['week', 'This week'], ['4weeks', 'Last 4 weeks'], ['3months', 'Last 3 months'], ['year', 'This year'], ['all', 'All time']];
const shortDate = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
function weekRows(rows, caption = 'Week by week', head = 'Week of', label = shortDate) {
  const n = (x) => `<td class="num">${fmtNum(x)}</td>`;
  return `<div class="table-scroll"><table class="weeks"><caption>${caption}</caption>
    <thead><tr><th scope="col">${head}</th><th scope="col">Workouts</th><th scope="col">Min</th><th scope="col">Stretch min</th><th scope="col">Sets</th><th scope="col">Reps</th></tr></thead>
    <tbody>${rows.map((r) => `<tr${r.workouts ? '' : ' class="empty"'}><th scope="row">${label(r.start)}</th>${n(r.workouts)}${n(r.workoutMin)}${n(r.stretchMin)}${n(r.sets)}${n(r.reps)}</tr>`).join('')}</tbody></table></div>`;
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
/* The Time tab (Phase 8 ticket 5): where the workout minutes went, by family (tap one for its subjects) and by format,
   and the kind of work: strength sets and reps, cardio minutes, mind & body minutes. */
const fmtMin = (m) => `${fmtNum(m)} min`;
function minuteBars(entries, label, opts = {}) {
  const list = entries.filter(([, m]) => m > 0).sort((a, b) => b[1] - a[1]);
  const share = KBCharts.shares(list.map(([, m]) => m));
  const row = ([k, m], i) => {
    const bar = `<span class="rbar"><i style="width:${(share[i] * 100).toFixed(1)}%"></i></span><span class="rval num">${fmtMin(m)}</span>`;
    const name = opts.name ? opts.name(k) : k;
    if (opts.open === undefined) return `<li><span class="rname">${esc(name)}</span>${bar}</li>`;
    const open = opts.open === k, subs = open ? minuteBars(Object.entries(opts.subs(k)), `${name} by subject`) : '';
    return `<li class="fam"><button class="famrow" data-stat-family="${esc(k)}" aria-expanded="${open}"><span class="rname">${esc(name)} <span aria-hidden="true">${open ? '▴' : '▾'}</span></span>${bar}</button>${subs}</li>`;
  };
  return `<ol class="rank${opts.open !== undefined ? ' fams' : ''}" aria-label="${esc(label)}">${list.map(row).join('')}</ol>`;
}
function timeTab(r) {
  const k = r.kinds, tile = (label, value, sub) => `<div class="tile-stat" role="group" aria-label="${label}"><span class="lbl">${label}</span><b>${fmtNum(value)}</b>${sub ? `<span class="lbl">${sub}</span>` : ''}</div>`;
  return `<section class="card timecard" aria-labelledby="where-h"><h2 id="where-h">Where time goes</h2>
      ${minuteBars(Object.entries(r.byFamily), 'Workout minutes by family', { open: statsView.family || '', subs: (f) => r.bySubject[f] || {} })}
      <h3>By format</h3>${minuteBars(Object.entries(r.byFormat), 'Workout minutes by format', { name: (f) => fmtFormat[f] || f })}
      <p class="note">Workout minutes, stretching not included. A mixed day is split by its blocks.</p></section>
    <section class="card timecard" aria-labelledby="kind-h"><h2 id="kind-h">Kind of work</h2>
      <div class="kpis kinds">${tile('Strength sets', k.strengthSets, `${fmtNum(k.strengthReps)} reps`)}${tile('Cardio minutes', k.cardioMin)}${tile('Mind & body minutes', k.mindMin)}</div></section>`;
}
/* The trend (Phase 8 ticket 6): workout minutes per week as a line (per month as bars for This year), oldest on the
   left. One series, so no legend: the heading names it; each point and bar has a tooltip, and the table below the
   breakdown holds the same numbers. */
const monthName = (d) => d.toLocaleDateString('en-GB', { month: 'short' });
function trendChart(rows, per, o = {}) {
  const val = o.value || ((d) => d.workoutMin), id = o.id || 'trend-h', title = o.title || `Minutes per ${per}`;
  const data = rows.slice().reverse(), W = 340, H = 150, L = 30, R = 8, T = 10, B = 22, iw = W - L - R, ih = H - T - B;
  const { max, ticks } = KBCharts.axis(data.map(val), { max: o.max, step: o.step }), y = (v) => T + ih - (v / max) * ih;
  const grid = ticks.map((v) => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="tgrid"/><text x="${L - 6}" y="${y(v) + 4}" class="tax" text-anchor="end">${v}</text>`).join('');
  const tip = (d) => `${per === 'month' ? d.start.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : `Week of ${shortDate(d.start)}`}: ${o.tip ? o.tip(d) : `${fmtMin(d.workoutMin)}, ${plural(d.workouts, 'workout')}`}`;
  let marks, labels;
  if (per === 'month') {
    const slot = iw / data.length, bw = Math.min(26, slot - 6);
    marks = data.map((d, i) => { const x = L + slot * i + (slot - bw) / 2, h = Math.max(0, y(0) - y(val(d))), r = Math.min(4, h);
      return `<g class="tmark"><rect x="${L + slot * i}" y="${T}" width="${slot}" height="${ih}" class="thit"/>${h ? `<path d="M${x},${y(0)}v${-(h - r)}q0,${-r} ${r},${-r}h${bw - 2 * r}q${r},0 ${r},${r}v${h - r}z" class="tbar"/>` : ''}<title>${esc(tip(d))}</title></g>`; }).join('');
    labels = data.map((d, i) => `<text x="${L + slot * (i + 0.5)}" y="${H - 6}" class="tax" text-anchor="middle">${esc(monthName(d.start).slice(0, 1))}</text>`).join('');
  } else {
    const x = (i) => L + (data.length === 1 ? iw / 2 : (i / (data.length - 1)) * iw);
    marks = `<polyline points="${data.map((d, i) => `${x(i)},${y(val(d))}`).join(' ')}" class="tline"/>` + data.map((d, i) => `<g class="tmark"><rect x="${x(i) - 10}" y="${T}" width="20" height="${ih}" class="thit"/><circle cx="${x(i)}" cy="${y(val(d))}" r="4" class="tdot"/><title>${esc(tip(d))}</title></g>`).join('');
    labels = `<text x="${L}" y="${H - 6}" class="tax">${esc(shortDate(data[0].start))}</text><text x="${W - R}" y="${H - 6}" class="tax" text-anchor="end">${esc(shortDate(data[data.length - 1].start))}</text>`;
  }
  return `<section class="card trend" aria-labelledby="${id}"><h2 id="${id}">${title}</h2>
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || `Workout minutes per ${per}`)}, ${esc(data.map((d) => `${tip(d)}`).join('; '))}">${grid}${marks}${labels}</svg></section>`;
}
/* The Exercises tab (Phase 8 ticket 7): each exercise done in the span (swaps counted as what was done), on how many
   days and when last, tapping through to its page; then each program's level, week by week. */
const ROMAN = ['', 'I', 'II', 'III'];
const EX_SHOWN = 20; // the rest behind "Show all"
function exercisesTab(r) {
  const opts = { dayOf, from: r.from, to: r.to }, mine = statsEntries();
  const hist = KBStats.exerciseHistory(mine, opts).filter((h) => EX[h.ex]);
  const shown = statsView.allEx ? hist : hist.slice(0, EX_SHOWN);
  const row = (h) => `<li><button class="exhrow" data-ex="${h.ex}"><span class="rname">${esc(EX[h.ex].name)}</span><span class="exhmeta">${plural(h.days, 'day')} · last ${shortDate(h.last)}</span></button></li>`;
  const more = hist.length > EX_SHOWN ? `<button class="linkbtn" data-stat-allex="1">${statsView.allEx ? 'Show fewer' : `Show all ${hist.length}`}</button>` : '';
  const levels = KBStats.levelOverTime(mine, opts);
  const nameOf = (pid) => (pid === 'random' ? 'Random workouts' : programs.summary(pid) ? programs.summary(pid).name : pid);
  const strip = (lv) => `<div class="lvrow"><span class="rname">${esc(nameOf(lv.pid))}</span><ol class="lvstrip" aria-label="${esc(nameOf(lv.pid))}, level by week">${lv.weeks.map((w) => `<li class="lv${w.level || 0}" title="Week of ${shortDate(w.start)}: ${w.level ? `level ${ROMAN[w.level]}` : 'nothing done'}"><span class="sr">Week of ${shortDate(w.start)}: </span>${w.level ? ROMAN[w.level] : '<span aria-hidden="true">·</span><span class="sr">nothing done</span>'}</li>`).join('')}</ol></div>`;
  return `<section class="card exhist" aria-labelledby="exh-h"><h2 id="exh-h">Exercises done</h2>
      <ol class="exhlist">${shown.map(row).join('')}</ol>${more}
      <p class="note">On how many of your done days each exercise came up; a swap counts as the exercise you did. Warm-ups and cool-downs not included.</p></section>
    <section class="card exhist" aria-labelledby="lv-h"><h2 id="lv-h">Level over time</h2>${levels.map(strip).join('')}
      <p class="note">The highest level you did each week, oldest week first: ${KBLength.levelRanges(KBLength.DAYS)}.</p></section>`;
}
/* The History tab (Phase 9 ticket 3): a month as a calendar, ‹ › to page, Today back; a day with workouts is filled,
   darker for more minutes; tap one for what you did. The program switch narrows it; the span switch doesn't move it (it
   pages by month on its own; the span applies to what's under it). History, not streaks: nothing counts runs of days. */
const statsMonth = () => { const n = new Date(), m = statsView.month || [n.getFullYear(), n.getMonth()]; return new Date(m[0], m[1], 1); };
const dateKey = (d) => KBRandom.dayKey(d);
const minuteLevel = (m) => (m <= 0 ? 0 : m < 25 ? 1 : m < 40 ? 2 : m < 60 ? 3 : 4);
function historyTab() {
  const m = statsMonth(), now = new Date(), today = dateKey(now), thisMonth = m.getFullYear() === now.getFullYear() && m.getMonth() === now.getMonth();
  const weeks = KBStats.calendarMonth(statsEntries(), { dayOf, year: m.getFullYear(), month: m.getMonth() });
  const label = (c) => `${c.date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}: ${c.workouts.length ? `${plural(c.workouts.length, 'workout')}, ${fmtNum(c.minutes)} minutes` : 'no workouts'}`;
  const cell = (c) => { const k = dateKey(c.date);
    return `<button class="hday mm-l${minuteLevel(c.minutes)}${c.inMonth ? '' : ' out'}${k === today ? ' today' : ''}" data-hday="${k}" aria-pressed="${statsView.histDay === k}" aria-label="${esc(label(c))}"${c.workouts.length ? '' : ' tabindex="-1"'}>${c.date.getDate()}</button>`; };
  const picked = weeks.flat().find((c) => dateKey(c.date) === statsView.histDay);
  const nav = `<div class="hnav"><button class="btn ghost hbtn" data-hmonth="-1" aria-label="Previous month">‹</button><h2 id="hist-h">${esc(m.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }))}</h2><button class="btn ghost hbtn" data-hmonth="1" aria-label="Next month">›</button>${thisMonth ? '' : '<button class="linkbtn" data-hmonth="0">Today</button>'}</div>`;
  const head = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => `<span class="hwd" aria-hidden="true">${d}</span>`).join('');
  return `<section class="card history" aria-labelledby="hist-h">${nav}<div class="hgrid">${head}${weeks.flat().map(cell).join('')}</div>
      ${heatLegend()}</section>${picked ? historyDay(picked) : '<p class="muted">Tap a day to see what you did.</p>'}`;
}
function historyDay(c) {
  const row = (e) => {
    const d = dayOf(e.pid, e.day, e.round);
    if (e.pid === 'random') { const rec = store.doc('random', e.day) || {}; return `<li class="hwork"><span class="eyebrow">Random workout</span><b>${esc((rec.name || 'Random workout').replace(/^Random: /, ''))}</b><span>${fmtMin(d.est)} · level ${ROMAN[d.level]}</span></li>`; }
    const sm = programs.summary(e.pid);
    return `<li><button class="hwork" data-hopen="${esc(e.pid)}:${e.day}"><span class="eyebrow">${esc(sm ? sm.name : e.pid)}${e.round > 1 ? ` · Round ${e.round}` : ''}</span><b>Day ${e.day} · ${esc(d.name || d.title)}</b><span>${fmtMin(d.est)} · level ${ROMAN[d.level]}</span></button></li>`;
  };
  return `<section class="card history" aria-labelledby="hday-h"><h2 id="hday-h">${esc(c.date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }))}</h2>
    ${c.workouts.length ? `<ol class="hlist">${c.workouts.map(row).join('')}</ol>` : '<p class="muted">No workouts this day.</p>'}</section>`;
}
function historyMove(n) {
  const m = statsMonth(), d = n === 0 ? new Date() : new Date(m.getFullYear(), m.getMonth() + n, 1);
  statsView.month = [d.getFullYear(), d.getMonth()]; statsView.histDay = null; render();
}
/* When you train (Phase 9 ticket 4), under the calendar, for the chosen span: workouts per weekday and per time of day,
   in their own order (not ranked), from when each day was marked done. */
function countBars(rows, label) {
  const share = KBCharts.shares(rows.map(([, n]) => n));
  return `<ol class="rank counts" aria-label="${esc(label)}">${rows.map(([k, n], i) => `<li><span class="rname">${esc(k)}</span><span class="rbar"><i style="width:${(share[i] * 100).toFixed(1)}%"></i></span><span class="rval num">${n}</span></li>`).join('')}</ol>`;
}
function whenTab(r) {
  const opts = { dayOf, from: r.from, to: r.to }, mine = statsEntries();
  const wd = KBStats.byWeekday(mine, opts), td = KBStats.byTimeOfDay(mine, opts);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return `<section class="card timecard" aria-labelledby="when-h"><h2 id="when-h">When you train</h2>
      <h3>By weekday</h3>${countBars(days.map((d, i) => [d, wd[i]]), 'Workouts by weekday')}
      <h3>Time of day</h3>${countBars([['Morning', td.morning], ['Afternoon', td.afternoon], ['Evening', td.evening], ['Night', td.night]], 'Workouts by time of day')}
      <p class="note">Workouts in the span above. Time of day is when you marked the day done: morning 5–12, afternoon 12–17, evening 17–22, night 22–5.</p></section>`;
}
// days trained per week (Phase 9 ticket 5): a line on the History tab for spans longer than a week, 0 to 7
function daysTrend(r) {
  if (!r.weeks) return '';
  const rows = KBStats.daysPerWeek(statsEntries(), { dayOf, from: r.from, to: r.to });
  return trendChart(rows, 'week', { value: (d) => d.days, max: 7, step: 1, id: 'days-h', title: 'Days per week', label: 'Days you trained per week', tip: (d) => plural(d.days, 'day') });
}
function statsTab(r, what) {
  if (statsView.tab === 'history') return historyTab() + daysTrend(r) + whenTab(r);
  if (statsView.tab === 'muscles') return muscleBalance(r, what);
  if (statsView.tab === 'exercises') return exercisesTab(r);
  if (statsView.tab === 'time') {
    if (r.months) return trendChart(r.months, 'month') + timeTab(r) + weekRows(r.months, 'Month by month', 'Month', monthName);
    return (r.weeks ? trendChart(r.weeks, 'week') : '') + timeTab(r) + (r.weeks ? weekRows(r.weeks) : '<p class="muted">Pick a longer span to see each week.</p>');
  }
  return statTiles(r.totals);
}
function viewStats() {
  const { span, pid } = statsView;
  if (stillLoading(doneEntries().map((x) => x.pid)).length) return `<h1>Stats</h1><p class="loading lede" role="status">Loading your programs…</p>`;
  const r = statsReport(pid, span, pid === 'all' ? undefined : statsView.round), { from, to } = r, all = doneEntries();
  const used = programs.list().filter((p) => all.some((e) => e.pid === p.id) || p.id === pid);
  const scopeName = pid === 'all' ? 'all programs' : pid === 'random' ? 'random workouts' : programs.summary(pid).name + (statsView.round ? ` · Round ${statsView.round}` : '');
  const randomOption = all.some((e) => e.pid === 'random') || pid === 'random' ? `<option value="random"${pid === 'random' ? ' selected' : ''}>Random workouts</option>` : '';
  const history = statsView.tab === 'history';
  const when = span === 'all' ? (pid === 'all' || pid === 'random' ? 'all time' : 'since you started') : `${shortDate(from)} – ${shortDate(new Date(to - 864e5))}`;
  const none = history ? '' : { week: 'this week', '4weeks': 'in the last 4 weeks', '3months': 'in the last 3 months', year: 'this year', all: '' }[span];
  return `<div class="eyebrow">${esc(pid === 'all' ? `${when} · ${scopeName}` : `${scopeName} · ${when}`)}</div><h1>Stats</h1>
    <div class="statbar">
      <div class="filters" role="group" aria-label="Time span">${SPANS.map(([k, l]) => `<button class="fchip" data-stat-span="${k}" aria-pressed="${span === k}">${l}</button>`).join('')}</div>
      <div class="scope"><label for="stats-scope">Program</label><select id="stats-scope"><option value="all">All programs</option>${used.map((p) => `<option value="${p.id}"${p.id === pid ? ' selected' : ''}>${esc(p.name)}</option>`).join('')}${randomOption}</select></div>
      ${pid !== 'all' && pid !== 'random' && store.round(pid) > 1 ? `<div class="scope"><label for="stats-round">Round</label><select id="stats-round"><option value="all">All rounds</option>${Array.from({ length: store.round(pid) }, (_, i) => `<option value="${i + 1}"${statsView.round === i + 1 ? ' selected' : ''}>Round ${i + 1}</option>`).join('')}</select></div>` : ''}
    </div>
    <div class="ftabs stattabs" role="group" aria-label="Stats views">${STAT_TABS.map(([k, l]) => `<button class="ftab" data-stat-tab="${k}" aria-pressed="${statsView.tab === k}">${l}</button>`).join('')}</div>
    ${r.hasHistory ? statsTab(r, `${scopeName}, ${when}`) : `<p class="lede">No workouts marked done ${none || 'yet'}${none ? ' yet' : ''}.</p>`}
    <p class="note">Counts the planned work of each day you marked done: its sets, reps and minutes. Weeks start on Sunday.</p>`;
}
