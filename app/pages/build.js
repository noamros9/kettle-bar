/* ---------------- build your own ----------------
   #build: pick one to three subjects (the order you tap is the order of each day's blocks: a mix) and the rest, see the
   first six days, regenerate (a new seed), save. The choices and the seed are what is saved (app/own.js); the days are
   built here from them. */
const LEVER_TEXT = { reps: 'More reps', holds: 'Longer holds', weight: 'Heavier weights', variation: 'Harder variations', tempo: 'Slower tempo' };
const GEAR_TEXT = { all: 'All equipment', kb: 'Kettlebell only', bw: 'No equipment' };
let buildState = null; // { c: choices, seed, name: null (the default) | text, editId?: the own program being edited }
const ownIdOf = (pid) => pid.replace(/^own-/, '');
const isOwn = (pid) => !!programs.summary(pid) && programs.summary(pid).source === 'own';
const ownDeps = () => ({ build: KBBuilder.build, ex: KBEx });
// every day marked done in any round: an edit keeps what you did on them
const ownDoneDays = (pid) => [...new Set(store.entries(pid).map((e) => e.day))];
let bookError = null, bookLoading = false;
let previewCache = { key: '', program: null };
// the edited record as it would be saved (done days frozen), or a new program's first days
function editedRecord(b, now) {
  return KBOwn.edit({ recipes: recipeBook, ...ownDeps() }, b.editId, store.doc('programs', b.editId), { name: b.name || undefined, choices: b.c, seed: b.seed, doneDays: ownDoneDays(KBOwn.pidOf(b.editId)) }, now);
}
function buildPreview(b) {
  const key = JSON.stringify([b.c, b.seed, b.editId || null]);
  if (previewCache.key !== key) {
    const program = b.editId
      ? KBOwn.programOf(ownDeps(), KBOwn.fromRecord(b.editId, editedRecord(b, 'preview')))
      : KBOwn.programOf(ownDeps(), { pid: 'own-preview', name: 'Preview', config: KBOwn.configOf(recipeBook, { choices: b.c, seed: b.seed }) });
    previewCache = { key, program };
  }
  return previewCache.program;
}
function buildSet(k, v) {
  const b = buildState, c = b.c;
  if (k === 'subject') b.c = KBOwn.toggle(recipeBook, c, v);
  else if (k === 'split' || k === 'minutes') b.c = KBOwn.fit(recipeBook, { ...c, [k]: +v });
  else if (k === 'equipment') b.c = KBOwn.fit(recipeBook, { ...c, equipment: v });
  else if (k === 'lever') { const [i, l] = v.split('='); b.c = { ...c, levers: c.levers.map((x, j) => (j === +i ? l : x)) }; } // i: 2 × subject + (0 for Level II, 1 for III)
  else if (k === 'format') { // tick or untick, keeping the subjects' order
    const all = recipeBook.options(c.subjects).formats;
    b.c = { ...c, formats: all.filter((f) => (f === v ? !c.formats.includes(f) : c.formats.includes(f))) };
  }
  render();
}
function buildRegenerate() { buildState.seed = KBOwn.newSeed(); render(); }
function buildSave() {
  const b = buildState;
  const name = (b.name || '').trim() || KBOwn.defaultName(b.c.subjects);
  if (b.editId) { // the same program, with new choices: days you did stay as they were
    const pid = KBOwn.pidOf(b.editId);
    store.setDoc('programs', b.editId, editedRecord({ ...b, name }, new Date().toISOString()));
    buildState = null;
    go('p-' + pid);
    return;
  }
  const id = KBOwn.newId();
  const made = { choices: b.c, seed: b.seed, catalogue: recipeBook.book().catalogue };
  // the config the recipes made is what is kept: the days never depend on the recipe book again
  store.setDoc('programs', id, KBOwn.toRecord({ name, ...made, config: KBOwn.configOf(recipeBook, made) }, new Date().toISOString())); // the catalogue follows at once
  buildState = null;
  go('p-' + KBOwn.pidOf(id));
}
function viewBuild() {
  if (buildState && buildState.editId && !store.doc('programs', buildState.editId)) buildState = null; // deleted on another device meanwhile
  const editing = buildState && buildState.editId;
  const head = editing
    ? `<div class="crumbs"><button class="back" data-b-cancel="1">← ${esc(store.doc('programs', editing).name)}</button></div><div class="eyebrow">Your programs</div><h1>Edit your program</h1>`
    : `<div class="crumbs"><button class="back" data-go="programs">← All programs</button></div><div class="eyebrow">Programs</div><h1>Build your own</h1>`;
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
  const c = b.c, o = rb.options(c.subjects), st = KBOwn.states(rb, c), mix = c.subjects.length > 1;
  const chip = (key, value, label, on, state) => `<button class="fchip acc" data-b="${key}:${value}" aria-pressed="${on}"${state && !state.ok ? ` disabled title="${esc(state.reason)}"` : ''}>${esc(label)}</button>`;
  const why = (list) => list.filter((x) => x && x.reason).map((x) => `<p class="hint">${esc(x.reason)}</p>`).join('');
  // subjects: chips by family; the number is the order you tapped them in, which is the order of each day's blocks
  const subs = KBOwn.subjectStates(rb, c), families = [...new Set(subs.map((x) => x.family))];
  const subChip = (x) => `<button class="fchip acc subj" data-bsub="${esc(x.name)}" aria-pressed="${x.order > 0}"${x.ok ? '' : ` disabled title="${esc(x.reason)}"`}>${x.order ? `<b class="ord" aria-hidden="true">${x.order}</b>` : ''}${esc(x.name)}</button>`;
  const greyed = [...new Set(subs.filter((x) => !x.ok).map((x) => (x.reason.startsWith('No mix') ? 'Greyed out: no mix with it fits 20 to 40 minutes.' : x.reason)))];
  const alone = rb.mixReason(c.subjects);
  const pickLine = mix ? `Each day: ${c.subjects.join(', then ')}.` : alone ? `${alone} Tap another subject to start over with it.` : 'Tap up to three to mix them: each day then has a block of each, in the order you tap.';
  const subjectPicker = `<p class="hint bpick" role="status">${esc(pickLine)}</p>${families.map((f) => `<div class="bfam"><h3>${esc(f)}</h3><div class="filters" role="group" aria-label="${esc(f)}">${subs.filter((x) => x.family === f).map(subChip).join('')}</div></div>`).join('')}${greyed.map((r) => `<p class="hint">${esc(r)}</p>`).join('')}`;
  // how it gets harder: a Level II and a Level III lever for each subject, over its own blocks
  const lists = mix ? o.levers : [o.levers];
  const leverSelect = (j, level) => { const i = 2 * j + level - 2, id = `b-lever${level}${j ? '-' + (j + 1) : ''}`; return `<label class="bfield" for="${id}"><span>Level ${level === 2 ? 'II' : 'III'}</span><select id="${id}" data-blever="${i}">${lists[j].map((l) => `<option value="${l}"${c.levers[i] === l ? ' selected' : ''}>${LEVER_TEXT[l]}</option>`).join('')}</select></label>`; };
  const levers = c.subjects.map((s, j) => `${mix ? `<h3 class="blev">${j + 1} · ${esc(s)}</h3>` : ''}<div class="bfields">${leverSelect(j, 2)}${leverSelect(j, 3)}</div>`).join('');
  const problem = KBOwn.problem(rb, c);
  let preview;
  if (problem) preview = `<p class="notice" role="alert">${esc(problem)}</p>`;
  else {
    const p = buildPreview(b), TY = typesOf(p);
    preview = `<p class="pvline num">${esc(KBOwn.summaryLine(p))}</p><div class="grid pv" data-seed="${esc(b.seed)}">${p.days.slice(0, 6).map((w) => {
      const t = TY[w.type] || { short: w.title, c: 'var(--muted)' }; // a day you did keeps its own title
      return `<div class="tile"><span class="open"><span class="n num">${w.day}</span><span class="nm">${esc(w.name)}</span><span class="ty"><i class="dot" style="--c:${t.c}"></i>${esc(t.short)} · ${w.est}′</span></span></div>`;
    }).join('')}</div>`;
  }
  const doneCount = editing ? ownDoneDays(KBOwn.pidOf(editing)).length : 0;
  const lede = editing
    ? `Change what you want; the first six days show below as they will be. ${doneCount ? `The ${doneCount === 1 ? 'day' : doneCount + ' days'} you have done stay${doneCount === 1 ? 's' : ''} exactly as you did ${doneCount === 1 ? 'it' : 'them'}; the rest are made again.` : 'No day is done yet, so every day is made again.'}`
    : 'Pick what you want; the first six days show below. Regenerate for a different set of days, with the same choices.';
  return `${head}<p class="lede">${lede}</p>
    <section class="bsec"><h2>${mix ? 'Subjects' : 'Subject'}</h2>${subjectPicker}</section>
    <section class="bsec"><h2>Days in a cycle</h2><div class="filters" role="group" aria-label="Days in a cycle">${[1, 2, 3, 4, 5].map((n) => chip('split', n, n, c.split === n)).join('')}</div></section>
    <section class="bsec"><h2>Minutes a day</h2><div class="filters" role="group" aria-label="Minutes a day">${KBOwn.MINUTES.map((m) => chip('minutes', m, m, c.minutes === m, st.minutes[m])).join('')}</div>${why(KBOwn.MINUTES.map((m) => st.minutes[m]))}</section>
    <section class="bsec"><h2>Equipment</h2><div class="filters" role="group" aria-label="Equipment">${KBOwn.EQUIPMENT.map((e) => chip('equipment', e, GEAR_TEXT[e], c.equipment === e, st.equipment[e])).join('')}</div>${why(KBOwn.EQUIPMENT.map((e) => st.equipment[e]))}</section>
    <section class="bsec"><h2>Formats</h2><div class="filters" role="group" aria-label="Formats">${o.formats.map((f) => `<label class="fchip acc fmt"><input type="checkbox" data-bfmt="${f}"${c.formats.includes(f) ? ' checked' : ''}> ${esc(fmtFormat[f])}</label>`).join('')}</div></section>
    <section class="bsec"><h2>How it gets harder</h2>${levers}</section>
    <section class="bsec"><h2>Preview</h2>${preview}
      <div class="actions"><button class="btn ghost" data-b-regen="1"${problem ? ' disabled' : ''}>Regenerate</button></div></section>
    <section class="bsec"><h2>Save</h2><label class="bfield" for="b-name"><span>Name</span><input id="b-name" type="text" maxlength="60" value="${esc(b.name === null ? KBOwn.defaultName(c.subjects) : b.name)}" autocomplete="off"></label>
      <div class="actions"><button class="btn" data-b-save="1"${problem ? ' disabled' : ''}>${editing ? 'Save changes' : 'Save program'}</button>${editing ? '<button class="btn ghost" data-b-cancel="1">Cancel</button>' : ''}</div></section>`;
}

/* ---------------- a shared program (#add=<code>) ----------------
   Read the link, show the program's first days, and add it to Your programs under the id it was made with (the builder
   draws the exercises from it, so the days are the same as the sharer's). No server: everything is in the link. */
let addState = { code: null }; // { code, shared?, program?, error? }: the link being shown
function viewAdd() {
  const code = route.code;
  const head = '<div class="crumbs"><button class="back" data-go="programs">← All programs</button></div><div class="eyebrow">Shared with you</div>';
  if (addState.code !== code) {
    addState = { code };
    KBOwn.readShare(code, ownDeps()).then((shared) => {
      if (addState.code !== code) return;
      addState.shared = shared;
      addState.program = KBOwn.programOf(ownDeps(), { pid: KBOwn.pidOf(shared.id), name: shared.name, config: shared.config });
      rerender();
    }, (e) => { if (addState.code === code) { addState.error = e.message; rerender(); } });
  }
  if (addState.error) return `${head}<h1>This link can't be opened</h1><p class="notice" role="alert">${esc(addState.error)}</p>`;
  if (!addState.program) return `${head}<h1>A shared program</h1><p class="loading lede" role="status">Loading…</p>`;
  const sh = addState.shared, p = addState.program, TY = typesOf(p), pid = KBOwn.pidOf(sh.id);
  const tiles = `<div class="grid pv">${p.days.slice(0, 6).map((w) => {
    const t = TY[w.type] || { short: w.title, c: 'var(--muted)' };
    return `<div class="tile"><span class="open"><span class="n num">${w.day}</span><span class="nm">${esc(w.name)}</span><span class="ty"><i class="dot" style="--c:${t.c}"></i>${esc(t.short)} · ${w.est}′</span></span></div>`;
  }).join('')}</div>`;
  const have = !!store.doc('programs', sh.id);
  const actions = have
    ? `<p class="hint" role="status">This program is already in Your programs${programs.has(pid) && programs.summary(pid).name !== sh.name ? `, as ${esc(programs.summary(pid).name)}` : ''}.</p><div class="actions"><button class="btn" data-add-open="${esc(pid)}">Open it</button></div>`
    : '<div class="actions"><button class="btn" data-add-confirm="1">Add this program</button><button class="btn ghost" data-go="programs">Not now</button></div>';
  return `${head}<h1>${esc(sh.name)}</h1><p class="lede">${esc(p.about)} Adding it gives you your own copy: your progress is yours, and you can rename or edit it.</p>
    <section class="bsec"><h2>First six days</h2><p class="pvline num">${esc(KBOwn.summaryLine(p))}</p>${tiles}${actions}</section>`;
}
function addShared() {
  const sh = addState.shared;
  if (!sh) return;
  const { id, ...made } = sh;
  if (!store.doc('programs', id)) store.setDoc('programs', id, KBOwn.toRecord(made, new Date().toISOString())); // the catalogue follows at once
  location.replace('#p-' + KBOwn.pidOf(id)); // back from the program goes where you were before the link, not to it
}
