/* ---------------- the print view (Phase 32 ticket 2) ----------------
   #print/ex-<id> · #print/p-<pid>-d<n> · #print/p-<pid> · #print/random: a clean, light page made for paper, then the
   phone's print dialog (Print → Save as PDF) once it has drawn. Always the light theme, no top bar, no timer; a Back
   link for when the dialog is dismissed. Everything is already in the page, so it works offline.
     - an exercise: its card (drawing, how to, the dose at each level, equipment)
     - a day: its blocks, each exercise with its drawing beside it (the day as you'll do it, swaps applied)
     - a program: its about, then its days (exercises by name, sets × reps, minutes), then a glossary: each exercise it
       uses once, with its drawing and cue
     - the open random workout: as a day
   An explicit exercise is drawn in your view (272): today that is its figure; Phase 28 adds the approved drawing. */
const printed = new Set(); // the print routes whose dialog has opened (once per visit, not on every redraw)
let printFromApp = false; // the Export sheet opened this print view: Back is history.back(); a fresh link goes to the page
// the page a print view stands for: where Back goes when it was opened fresh
function printReturn() {
  const t = route.target;
  if (!t) return 'programs';
  return t.kind === 'ex' ? 'ex-' + t.ex : t.kind === 'day' ? dayHash(t.pid, t.day) : t.kind === 'program' ? 'p-' + t.pid : 'random';
}
// a route's target: { kind: 'ex', ex } | { kind: 'day', pid, day } | { kind: 'program', pid } | { kind: 'random' }, or nothing
function printTarget(path) {
  const x = path.match(/^ex-([a-z0-9_]+)$/);
  if (x) return EX[x[1]] ? { kind: 'ex', ex: x[1] } : null;
  const pd = path.match(/^p-([a-z0-9-]+)-d(\d+)$/);
  if (pd && programs.has(pd[1])) return { kind: 'day', pid: pd[1], day: +pd[2] };
  const pp = path.match(/^p-([a-z0-9-]+)$/);
  if (pp && programs.has(pp[1])) return { kind: 'program', pid: pp[1] };
  if (path === 'random') return { kind: 'random' };
  return null;
}
const doseLine = (it, b) => `${esc(EX[it.ex].name)} <span class="pdose">· ${esc(KBExport.dose(it, b, EX))}${it.note ? ` · ${esc(it.note)}` : ''}</span>`;
const stretchLine = (it) => `${esc(EX[it.ex].name)} <span class="pdose">· ${it.n} ${EX[it.ex].side ? 'sec each side' : 'seconds'}</span>`;
function printBlocks(w, p, { figs }) {
  const R = { ...KBSession.DEFAULT_RESTS, ...(p.rests || {}) };
  const item = (line, id) => (figs ? `<li class="pitem"><div class="pfig">${fig(id)}</div><div>${line}</div></li>` : `<li>${line}</li>`);
  const stretch = (s, label) => (figs
    ? `<section class="pblock"><h3>${label} <span class="pdose">· ${s.items.length} stretches</span></h3><ul class="pfigs">${s.items.map((it) => item(stretchLine(it), it.ex)).join('')}</ul></section>`
    : `<p class="pstretch"><b>${label}</b> · ${s.items.map(stretchLine).join(', ')}</p>`); // a program's days: one line
  return `${w.warmup ? stretch(w.warmup, 'Warm-up') : ''}${w.blocks.map((b, bi) => {
    const f = b.format || 'straight', next = w.blocks[bi + 1];
    const rest = next ? `<p class="prest">${next.kind === 'abs' ? `Rest ${R.beforeAbs / 60} min, then abs` : `Rest ${R.block / 60} min`}</p>` : '';
    return `<section class="pblock"><h3>${esc(KBExport.blockLabel(b, bi))}${f === 'straight' ? '' : ` <span class="pdose">· ${fmtFormat[f]}</span>`}</h3>
      <ul class="${figs ? 'pfigs' : 'plines'}">${b.items.map((it) => item(doseLine(it, b), it.ex)).join('')}</ul></section>${rest}`;
  }).join('')}${w.cooldown ? stretch(w.cooldown, 'Cool-down') : ''}`;
}
const dayMeta = (w, p) => [((p.dayTypes || {})[w.type] || {}).label || w.title, p.levels[w.level - 1], `about ${w.est} min${w.stretchMin ? ` + ${w.stretchMin} min stretching` : ''}`].map(esc).join(' · ');
function printExercise(e) {
  return `<h1>${esc(e.name)}</h1><div class="pcard"><div class="pbig">${fig(e.id)}</div>
    <dl class="facts"><div><dt>How to</dt><dd>${esc(e.cue)}</dd></div>
      <div><dt>${e.u === 'sec' || e.cat === 'warmup' || e.cat === 'cooldown' ? 'Hold' : 'Reps'}</dt><dd>${esc(KBExport.exerciseDose(e))}</dd></div>
      <div><dt>Equipment</dt><dd>${esc(KBExport.equipment(e))}</dd></div></dl></div>`;
}
function printDay(w, p, eyebrow, heading) {
  return `<div class="eyebrow">${esc(eyebrow)}</div><h1>${esc(heading)}</h1><p class="pmeta">${dayMeta(w, p)}</p>${printBlocks(w, p, { figs: true })}`;
}
// every exercise a program uses, once, in the order it first appears
const exercisesOf = (ds) => [...new Set(ds.flatMap((w) => [...(w.warmup ? w.warmup.items : []), ...w.blocks.flatMap((b) => b.items), ...(w.cooldown ? w.cooldown.items : [])].map((it) => it.ex)))];
function printProgram(p) {
  const ds = p.days.map((d) => days.resolved(p.id, d.day) || d);
  const list = exercisesOf(ds);
  return `<div class="eyebrow">${esc([p.subject, `${ds.length} days`].filter(Boolean).join(' · '))}</div><h1>${esc(p.name)}</h1>
    <p class="pabout">${esc(p.about || p.blurb || '')}</p>${p.gear ? `<p class="pmeta">${esc(p.gear)}</p>` : ''}
    <div class="pdays">${ds.map((w) => `<section class="pday"><h2>Day ${w.day} · ${esc(w.name)}</h2><p class="pmeta">${dayMeta(w, p)}</p>${printBlocks(w, p, { figs: false })}</section>`).join('')}</div>
    <section class="pgloss"><h2>The exercises</h2><div class="pglist">${list.map((id) => `<article class="pgitem"><div class="pfig">${fig(id)}</div><div><b>${esc(EX[id].name)}</b><p>${esc(EX[id].cue)}</p></div></article>`).join('')}</div></section>`;
}
let printable = false; // the view drew something to print (not "Nothing to print")
const nothing = (title, text) => `<div class="pnone"><h1>${title}</h1><p class="lede">${text}</p></div>`;
function printBody(t) {
  if (!t) return nothing('Nothing to print', "This link is for a page that isn't here.");
  if (t.kind === 'ex') return printExercise(EX[t.ex]);
  if (t.kind === 'program') return printProgram(prog());
  if (t.kind === 'day') {
    const D = days.open(t.pid, t.day);
    return D ? printDay(D.day, D.program, D.program.name, `Day ${D.day.day} · ${D.day.name}`) : nothing('Nothing to print', "That day isn't in this program.");
  }
  const D = random.open();
  return D ? printDay(D.day, D.program, `Random workout · ${D.program.subject}`, D.day.name) : nothing('No random workout open', 'Start one, then print it from its page.');
}
function viewPrint() {
  const body = printBody(route.target);
  printable = !body.startsWith('<div class="pnone">');
  return `<div class="printview"><p class="pback"><button class="linkbtn" data-print-back="1">← Back</button> <button class="linkbtn" data-print-again="1">Print again</button></p>${body}
    <p class="pfoot">Kettle &amp; Bar</p></div>`;
}
// after a print route has drawn: the light theme while it is open, and the print dialog once
function afterPrint(v) {
  const on = v === 'print';
  document.body.classList.toggle('printing', on); document.documentElement.classList.toggle('printing', on);
  if (!on) printed.clear(); // the next visit prints again
  if (on) document.documentElement.dataset.theme = 'light'; else if (document.documentElement.dataset.theme === 'light') delete document.documentElement.dataset.theme;
  if (on && printable && !printed.has(location.hash)) {
    printed.add(location.hash);
    setTimeout(() => window.print(), 300); // the drawings have laid out
  }
}
