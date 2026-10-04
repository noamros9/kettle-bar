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
  <section class="card setting"><h2>Workout history</h2>
    <p>Every day you marked done as a spreadsheet file (CSV): date, program, day, level, minutes, sets and reps.</p>
    <div class="actions"><button class="btn ghost" data-csv="1">Download CSV</button></div>
    ${csvNote ? `<p class="hint" role="status">${esc(csvNote)}</p>` : ''}
  </section>
  <section class="card setting"><h2>Hidden subjects</h2>
    ${KBLibrary.subjectsOf(programs.list().filter((p) => p.source !== 'own'), KBLibrary.FAMILIES).map(([fam, list]) => `<div class="filters hidesubj" role="group" aria-label="Hide ${esc(fam)} subjects"><span class="fname">${esc(fam)}</span>${list.map((x) => `<button class="fchip acc" data-hide="${esc(x)}" aria-pressed="${libraryPrefs().hidden.includes(x)}">${esc(x)}</button>`).join('')}</div>`).join('')}
    <p class="muted">Ticked subjects don't show on the Programs page: no chip, no shelf, not counted. Programs you starred stay in Favourites. Synced with your account.</p>
  </section>
  <section class="card setting"><h2>Exercises I skip</h2>
    ${skipList().length ? `<ul class="skiplist">${skipList().map((id) => `<li class="skiprow"><button class="linkbtn" data-ex="${id}">${esc(EX[id].name)}</button><button class="btn ghost" data-skip="${id}" aria-label="Unskip ${esc(EX[id].name)}">Unskip</button></li>`).join('')}</ul>` : '<p class="muted">No exercises skipped. To skip one, open it and tap "Skip this exercise".</p>'}
    <p class="muted">Synced with your account.</p>
  </section>
  <section class="card setting"><h2>Travel mode</h2>
    <div class="filters" role="group" aria-label="Travel mode">${[[null, 'Off'], ...Object.entries(TRAVEL_TEXT)].map(([k, l]) => `<button class="fchip acc" data-travel="${k || ''}" aria-pressed="${travelMode() === k}">${esc(l)}</button>`).join('')}</div>
    <p class="muted">Away from your gear? Every workout swaps the exercises that need it for ones that work the same muscles, until you turn this off. Synced with your account.</p>
  </section>
  <section class="card setting"><h2>Voice</h2>
    <label class="switch"><input type="checkbox" role="switch" id="voice-toggle"${T.voiceOn() ? ' checked' : ''}><span>Voice cues</span></label>
    <p class="muted">During holds and one-side moves, the phone says "Halfway", "Switch sides" and "Done". In guided flows it also names each pose and side, and in boxing bouts it calls each combo. The beeps stay either way. Remembered on this device.</p>
  </section>`;
}

/* CSV of every done day (Phase 8 ticket 7): the programs are loaded first, so no day is left out */
let csvNote = '';
function downloadCSV() {
  const all = doneEntries(), pids = [...new Set(all.map((e) => e.pid).filter((p) => p !== 'random'))];
  csvNote = ''; render();
  return Promise.all(pids.map((p) => programs.load(p))).then(() => {
    const nameOf = (pid) => (programs.summary(pid) || { name: pid }).name;
    download(`kettle-bar-workouts-${KBRandom.dayKey(new Date())}.csv`, KBStats.toCSV(doneEntries(), { dayOf, EX, nameOf }), 'text/csv');
  }, () => { csvNote = "Some programs couldn't load (offline?), so the file wasn't made. Try again when you're online."; render(); });
}
