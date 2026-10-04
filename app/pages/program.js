/* ---------------- program page ---------------- */
// Start a new round: { pid } while the sheet is open. Each rest-of-program swap: keep it, or back to the original.
let roundState = null;
function roundSheet(p, r) {
  if (!roundState || roundState.pid !== p.id) return '';
  const onward = KBProgress.onwardSwaps(store.progress(p.id));
  const list = onward.length
    ? `<p>Your rest-of-program swaps. Untick any to go back to the original exercise.</p><ul class="keeplist">${onward.map((s, i) => `<li><label><input type="checkbox" data-keep="${i}" checked aria-label="Keep ${esc(EX[s.to].name)} instead of ${esc(EX[s.ex].name)}"><span><b>${esc(EX[s.to].name)}</b> instead of ${esc(EX[s.ex].name)}</span></label></li>`).join('')}</ul>`
    : '';
  return `<div class="sheetwrap"><button class="sheetbg" data-round-cancel="1" aria-label="Close"></button>
    <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="round-h"><h2 id="round-h">Start Round ${r + 1}</h2>
    <p class="muted">Days start again from day 1. Round ${r} stays in your stats, as it is.</p>${list}
    <div class="actions"><button class="btn" data-round-confirm="1">Start Round ${r + 1}</button><button class="btn ghost" data-round-cancel="1">Cancel</button></div></div></div>`;
}
// rename, delete, edit: only for your own programs
let ownState = null; // { pid, mode: 'rename' | 'delete', text?, error? }
function ownTitle(p) {
  if (!ownState || ownState.pid !== p.id || ownState.mode !== 'rename') return `<h1>${esc(p.name)}</h1>`;
  return `<form class="renamerow" data-own-form="1"><label class="sr" for="own-name">Program name</label><input id="own-name" type="text" maxlength="60" value="${esc(ownState.text)}" autocomplete="off"${ownState.error ? ' aria-invalid="true" aria-describedby="own-err"' : ''}>
    <button class="btn" type="submit">Save name</button><button class="btn ghost" type="button" data-own-cancel="1">Cancel</button></form>${ownState.error ? `<p class="notice" id="own-err" role="alert">${esc(ownState.error)}</p>` : ''}`;
}
const ownTools = (p) => `<div class="owntools"><button class="btn ghost" data-own-share="1">Share</button><button class="btn ghost" data-own-rename="1">Rename</button><button class="btn ghost" data-own-edit="1">Edit</button><button class="btn ghost danger" data-own-delete="1">Delete</button></div>${shareNote(p)}`;
// after Share: "Link copied", or the link to copy by hand when the phone won't let the page copy it
function shareNote(p) {
  if (!ownState || ownState.pid !== p.id || ownState.mode !== 'share') return '';
  if (ownState.copied) return '<p class="hint sharenote" role="status">Link copied. Whoever opens it can add this program, with its ' + KBLength.dayCountOf(prog()) + ' days, to their own.</p>';
  return `<div class="sharenote"><label class="bfield" for="share-link"><span>Copy this link</span><input id="share-link" type="text" readonly value="${esc(ownState.link)}"></label></div>`;
}
function deleteSheet(p) {
  if (!ownState || ownState.pid !== p.id || ownState.mode !== 'delete') return '';
  return `<div class="sheetwrap"><button class="sheetbg" data-own-cancel="1" aria-label="Close"></button>
    <div class="sheet" role="alertdialog" aria-modal="true" aria-labelledby="del-h"><h2 id="del-h">Delete ${esc(p.name)}?</h2>
    <p class="muted">Its progress goes too.</p>
    <div class="actions"><button class="btn danger" data-own-delete-confirm="1">Delete</button><button class="btn ghost" data-own-cancel="1">Cancel</button></div></div></div>`;
}
function viewProgram() {
  const p = prog(), n = store.count(p.id), nx = nextDay(p.id), TY = typesOf(p), r = store.round(p.id), own = isOwn(p.id);
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
    <div class="phead"><div><div class="eyebrow">${esc(p.subject || 'Program')} · ${esc(p.split || '')} ${mins ? '· ' + mins : ''}</div>${own ? ownTitle(p) : `<div class="ptitle"><h1>${esc(p.name)}</h1>${starButton(p)}</div>`}<p class="lede">${esc(p.about || p.blurb)}</p>
      ${p.gear ? `<p class="gear">${esc(p.gear)}</p>` : ''}${own ? ownTools(p) : ''}</div>
    <div class="progress">${r > 1 ? `<div class="eyebrow">Round ${r}</div>` : ''}<div class="big num">${n}<small> / ${p.days.length} days</small></div><div class="bar"><b style="width:${(n / p.days.length) * 100}%"></b></div>
      <button class="btn ghost roundbtn" data-round-start="1">Start Round ${r + 1}</button></div></div>
  <div class="cycle">${p.variety ? '<div><b>Every day is different</b><span class="days">no day type and format comes back</span></div>' // Variety (Phase 16): sixty one-off day types make no key
    : Object.entries(TY).map(([k, t]) => `<div><i class="dot" style="--c:${t.c}"></i><b>${esc(t.label)}</b><span class="days">${cycleDays(p, k)}</span></div>`).join('')}</div>
  ${nw ? `<div class="nextup"><div class="t"><span class="eyebrow">Next up · Day ${nw.day}</span><b>${esc(nw.name)}</b><span>${esc((TY[nw.type] || {}).label || nw.title)} · about ${nw.est} min</span></div><button class="btn" data-day="${nw.day}">Open workout</button></div>`
       : `<div class="nextup"><div class="t"><b>All ${p.days.length} days done</b><span>That's the full program. Start Round ${r + 1} to go again.</span></div></div>`}
  ${levels}${whatNext(p)}${roundSheet(p, r)}${own ? deleteSheet(p) : ''}`;
}
