/* ---------------- Compare two programs (Phase 33 ticket 5, #294, decision 255) ----------------
   A Compare button on a program's page opens a picker (the Programs search, results as buttons); picking one opens
   #compare/<a>/<b>: two columns: length, cycle, minutes, formats and equipment; each one's muscle map with its Upper /
   Core / Lower bars (Phase 30's groups); then the exercises they share. The numbers come from app/compare.js. */
let compareState = null; // { pid, q } while the picker is open
const COMPARE_SHOWN = 20, COMMON_SHOWN = 12;
let compareAll = false; // every shared exercise shown
function comparePicks() {
  const list = KBLibrary.searchPrograms(programs.list(), compareState.q).filter((p) => p.id !== compareState.pid);
  return list.length
    ? `<ul class="cmplist">${list.slice(0, COMPARE_SHOWN).map((p) => `<li><button data-compare-to="${esc(p.id)}"><b>${esc(p.name)}</b><span>${esc(p.subject || 'Your program')}</span></button></li>`).join('')}</ul>${list.length > COMPARE_SHOWN ? `<p class="hint">${list.length - COMPARE_SHOWN} more: type to narrow them down.</p>` : ''}`
    : '<p class="muted">No programs match.</p>';
}
function compareSheet(p) {
  if (!compareState || compareState.pid !== p.id) return '';
  return `<div class="sheetwrap"><button class="sheetbg" data-compare-close="1" aria-label="Close"></button>
    <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="cmp-h"><h2 id="cmp-h">Compare ${esc(p.name)} with…</h2>
    <label class="exsearch"><span class="sr">Search programs</span><input id="cmp-search" type="search" placeholder="Search programs by name or subject" value="${esc(compareState.q)}" autocomplete="off"></label>
    <div id="cmp-results">${comparePicks()}</div>
    <button class="btn ghost sheetclose" data-compare-close="1">Cancel</button></div></div>`;
}
function compareRefresh() { const box = $('#cmp-results'); if (box) box.innerHTML = comparePicks(); }
const compareButton = () => '<button class="btn ghost roundbtn" data-compare-open="1">Compare</button>';

function viewCompare() {
  const [a, b] = [route.a, route.b].map((id) => programs.get(id)), c = KBCompare.of(a, b, EX);
  const cell = (s, f) => `<td>${f(s)}</td>`;
  const row = (label, f) => `<tr><th scope="row">${label}</th>${cell(c.a, f)}${cell(c.b, f)}</tr>`;
  const mins = (s) => (s.minutes[0] === s.minutes[1] ? `${s.minutes[0]} min` : `${s.minutes[0]}–${s.minutes[1]} min`);
  const groups = KBEx.MUSCLE_GROUPS, max = Math.max(...[c.a, c.b].flatMap((s) => Object.values(s.tops)));
  const bars = (s) => `<ol class="rank cmpbars" aria-label="${esc(s.name)}: muscle groups">${groups.map(([top, name]) => `<li><span class="rname">${name}</span><span class="rbar"><i style="width:${((s.tops[top] / max) * 100).toFixed(1)}%"></i></span><span class="rval num">${Math.round(s.tops[top] * 100)}%</span></li>`).join('')}</ol>`;
  const side = (s) => `<div class="cmpside"><h3>${esc(s.name)}</h3>${muscleMapSVG(s.focus, `Muscles worked by ${s.name}`)}${bars(s)}</div>`;
  const shared = c.common.length
    ? `<ol class="cmpcommon">${c.common.slice(0, compareAll ? undefined : COMMON_SHOWN).map((x) => `<li><button class="linkbtn" data-ex="${x.ex}">${esc(EX[x.ex].name)}</button><span class="num">${x.a} · ${x.b} days</span></li>`).join('')}</ol>${c.common.length > COMMON_SHOWN ? `<button class="linkbtn" data-compare-all="1">${compareAll ? 'Show fewer' : `Show all ${c.common.length}`}</button>` : ''}`
    : '<p class="muted">No exercises in common.</p>';
  return `<div class="crumbs"><button class="back" data-open-prog="${esc(a.id)}">← ${esc(a.name)}</button></div>
    <div class="eyebrow">Compare</div><h1>${esc(a.name)} <span class="cmpvs">and</span> ${esc(b.name)}</h1>
    <div class="cmpwrap"><table class="cmptable"><thead><tr><td></td>${[c.a, c.b].map((s) => `<th scope="col"><button class="linkbtn" data-open-prog="${esc(s.id)}">${esc(s.name)}</button><span>${esc(s.subject || 'Your program')}</span></th>`).join('')}</tr></thead>
    <tbody>${row('Length', (s) => `${s.days} days`)}${row('Cycle', (s) => (s.cycle ? `${s.cycle} days, ${plural(s.kinds, 'kind')} of day` : 'Every day different'))}${row('Minutes', mins)}
    ${row('Formats', (s) => s.formats.map(esc).join(', '))}${row('Equipment', (s) => s.gear.map(esc).join(', '))}</tbody></table></div>
    <section class="card cmpmuscles" aria-labelledby="cmp-m"><h2 id="cmp-m">Muscles worked</h2><div class="cmpsides">${side(c.a)}${side(c.b)}</div>${heatLegend()}
      <p class="note">Each muscle's share of the weighted sets over all the days.</p></section>
    <section class="card" aria-labelledby="cmp-c"><h2 id="cmp-c">In common: ${plural(c.common.length, 'exercise')}</h2><p class="hint">The workout's exercises (not the warm-up or cool-down), with the days each program uses them on, ${esc(a.name)} first.</p>${shared}</section>`;
}
