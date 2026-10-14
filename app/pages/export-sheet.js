/* ---------------- Export (Phase 32 ticket 3) ----------------
   One Export button on the exercise, day, program and random-workout pages opens this sheet: PDF (the print view,
   app/pages/print.js), Text (the phone's Share, or Copy where there's none) and, on the program page, Calendar (a start
   date and the weekdays, pre-filled from the program's training days, saved as an .ics file). The words come from app/export.js. No level switch (decision 337).
   exportState: { kind: 'ex' | 'day' | 'program' | 'random', hash, note?, cal?: { start, days: [0-6] } } while it is open. */
let exportState = null;
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const exportButton = (kind) => `<button class="btn ghost exportbtn" data-export-open="${kind}">Export</button>`;
// what the open page exports: its print route, its words and its name
function exportWhat() {
  const k = exportState.kind;
  if (k === 'ex') { const e = EX[route.ex]; return { print: 'ex-' + e.id, text: () => KBExport.exerciseText(e), name: e.name }; }
  if (k === 'random') { const D = random.open(); return { print: 'random', text: () => KBExport.randomText({ subject: D.program.subject, day: D.day, program: D.program }, EX), name: D.day.name }; }
  const p = prog();
  if (k === 'day') { const D = days.open(p.id, route.day); return { print: dayHash(p.id, route.day), text: () => KBExport.dayText(D.day, p, EX, { title: `${p.name} · Day ${D.day.day} · ${D.day.name}` }), name: `${p.name} day ${route.day}` }; }
  const resolved = { ...p, days: p.days.map((d) => days.resolved(p.id, d.day) || d) };
  return { print: 'p-' + p.id, text: () => KBExport.programText(resolved, EX), name: p.name, program: resolved };
}
function exportSheet() {
  if (!exportState || exportState.hash !== location.hash) return ''; // only on the page it was opened on
  const w = exportWhat(), cal = exportState.cal;
  const calendar = exportState.kind !== 'program' ? '' : cal
    ? `<div class="expcal" role="group" aria-label="Calendar"><label class="bfield" for="exp-start"><span>Start on</span><input id="exp-start" type="date" value="${cal.start}"></label>
        <div class="expdays" role="group" aria-label="Weekdays">${WEEKDAYS.map((d, i) => `<button class="fchip acc" data-export-day="${i}" aria-pressed="${cal.days.includes(i)}">${d}</button>`).join('')}</div>
        <p class="hint">${cal.days.length ? `One event per day not done yet, from the start date on ${cal.days.map((i) => WEEKDAYS[i]).join(', ')}.` : 'Pick the weekdays you train.'}</p>
        <button class="btn" data-export-save="1"${cal.days.length ? '' : ' disabled'}>Save calendar file</button></div>`
    : '<button class="btn ghost choice" data-export-cal="1">Calendar<span>Every day as an event, on the weekdays you pick</span></button>';
  return `<div class="sheetwrap"><button class="sheetbg" data-export-close="1" aria-label="Close"></button>
    <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="exp-h"><h2 id="exp-h">Export ${esc(w.name)}</h2>
    <div class="choices"><button class="btn ghost choice" data-export-pdf="1">PDF<span>Print, or save as PDF, with the drawings</span></button>
      <button class="btn ghost choice" data-export-text="1">Text<span>${navigator.share ? 'Share' : 'Copy'} the workout as a message</span></button>
      ${calendar}</div>
    ${exportState.note ? `<p class="hint" role="status">${esc(exportState.note)}</p>` : ''}
    <button class="btn ghost sheetclose" data-export-close="1">Close</button></div></div>`;
}
function exportPdf() {
  const w = exportWhat();
  exportState = null; printFromApp = true;
  go('print/' + w.print);
}
async function exportText() {
  const w = exportWhat(), text = w.text();
  try {
    if (navigator.share) { await navigator.share({ text }); return; }
    await navigator.clipboard.writeText(text);
    exportState.note = 'Copied';
  } catch (e) {
    if (e && e.name === 'AbortError') return; // the share sheet was closed
    exportState.note = "Couldn't copy here. Try PDF instead.";
  }
  rerender();
}
function exportCal() { exportState.cal = { start: todayISO(), days: store.weekdays(prog().id) }; rerender(); } // pre-filled from the program's training days (Phase 33)
function exportDay(i) {
  const cal = exportState.cal, start = document.getElementById('exp-start');
  if (start && start.value) cal.start = start.value; // keep a date picked before the chip
  cal.days = cal.days.includes(+i) ? cal.days.filter((d) => d !== +i) : [...cal.days, +i].sort();
  rerender();
}
async function exportSave() {
  const w = exportWhat(), cal = exportState.cal, start = document.getElementById('exp-start');
  if (start && start.value) cal.start = start.value;
  const ics = KBExport.ics(w.program, { start: cal.start, weekdays: cal.days, done: w.program.days.filter((d) => store.isDone(w.program.id, d.day)).map((d) => d.day) }, EX);
  const name = `${w.program.id}.ics`;
  const file = typeof File === 'function' ? new File([ics], name, { type: 'text/calendar' }) : null;
  try {
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: w.name }); }
    else download(name, ics, 'text/calendar');
    exportState.note = 'Calendar file saved. Open it to add the days to your calendar.';
  } catch (e) {
    if (!(e && e.name === 'AbortError')) { download(name, ics, 'text/calendar'); exportState.note = 'Calendar file saved. Open it to add the days to your calendar.'; }
  }
  rerender();
}
