/* Shared page helpers (architecture review IV ticket 1, split from views.js): constants, escaping, drawings, the
   redraw, small helpers every page uses. Globals shared with the pages, main.js and clock.js. */
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
// a redraw from the background (sync from another device, a program arriving) keeps the scroll and, when a text field
// with an id has the focus, its focus and cursor: typing a name isn't cut off by an update arriving
function rerender() {
  if (!booted || rerenderQueued) return; rerenderQueued = true;
  requestAnimationFrame(() => {
    rerenderQueued = false;
    const y = window.scrollY, a = document.activeElement, typing = a && a.id && a.matches('input[type="text"], input[type="search"]') ? { id: a.id, s: a.selectionStart, e: a.selectionEnd } : null;
    render(); window.scrollTo(0, y);
    const b = typing && document.getElementById(typing.id);
    if (b) { b.focus({ preventScroll: true }); try { b.setSelectionRange(typing.s, typing.e); } catch (err) { /* not a text field now */ } }
  });
}

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


const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
