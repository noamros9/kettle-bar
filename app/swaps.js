/* Swaps: trade an exercise for another that works the same main muscle. Pure: no page, no storage.
   The Progress Store keeps each program's swaps; the page shows every day through applySwaps.

     alternatives(exId, block, program, cat, limits?) -> [exId]   what the exercise can be swapped for; limits: a travel
                                                            mode, or { mode, skip }: only what that gear allows, and
                                                            none of the exercises I skip (Phase 13)
     travel(day, mode, program, cat) -> the day in travel mode: an exercise the gear doesn't allow is swapped for its
       first alternative the gear allows and the day doesn't already have: the same first main muscle and kind of work
       (reps for reps, a hold for a hold) when it can, else either kind, else one led by any of its main muscles (a bar
       hold has no bodyweight twin); marked `travel: true` and `swappedFrom`. One with none stays, `travelMissing: true`. No mode: the same day. Warm-up and cool-down are never swapped.
     standIns(day, { mode, skip }, program, cat) -> travel() and the exercises I skip together (Phase 13): an exercise
       that needs missing gear or that I skip is swapped the same way, for a stand-in that fits the gear, isn't skipped and
       isn't in the day; marked `travel: true` (gear, checked first) or `skipped: true`, with `swappedFrom`. One with no
       stand-in stays, `travelMissing: true` or `skipMissing: true`. Nothing skipped and no mode: the same day.
     TRAVEL ['nobar', 'kb', 'bw'], travelAllows(mode, exercise)
     applySwaps(day, swaps, cat) -> the day as you'll do it (a new object; the program is never changed)
     swapBehind(swaps, day, exId) -> the swap that put exId on that day
     undoSwap(swaps, day, exId) -> swaps without that one (one step of a chain)
   cat is the Exercise Catalogue module ({ EX, allowedIn, scaleReps }).

   A swap: { day, ex, to, onward? } — today only, or (onward) from that day to the end of the program. Swaps apply in the order they were made, so a swap of a swap
   follows the chain. The new exercise gets its own reps for the day's level. */
(function (root) {
  const STRETCH = ['warmup', 'cooldown'];
  // guided kinds of exercise (poses, combos): swapped only for their own kind, and never offered elsewhere
  const GUIDED = ['yoga', 'pilates', 'flex', 'mobility', 'boxing', 'kick'];

  const TRAVEL = ['nobar', 'kb', 'bw'];
  const travelAllows = (mode, e) => (!mode ? true : mode === 'nobar' ? !(e.equip || []).includes('bar') : TRAVEL_GEAR[mode](e));
  let TRAVEL_GEAR = null; // kb / bw: the catalogue's own rules (set from cat below)
  function alternatives(exId, block, program, cat, limits, loose = 0) {
    const { mode: travel, skip = [] } = limits && typeof limits === 'object' ? limits : { mode: limits };
    TRAVEL_GEAR = TRAVEL_GEAR || { kb: (e) => cat.allowedIn('kb', e), bw: (e) => cat.allowedIn('bw', e) };
    const EX = cat.EX, e = EX[exId], main = e.muscles.primary[0], isHold = e.u === 'sec';
    const kindOk = (o) => (GUIDED.includes(e.cat) || GUIDED.includes(o.cat) ? o.cat === e.cat : true);
    const inBlock = new Set(block.items.map((it) => it.ex));
    return Object.keys(EX).filter((id) => {
      const o = EX[id];
      return !inBlock.has(id) && !STRETCH.includes(o.cat) && kindOk(o) && (loose > 1 ? e.muscles.primary.includes(o.muscles.primary[0]) : o.muscles.primary[0] === main) && (loose > 0 || (o.u === 'sec') === isHold)
        && cat.allowedIn(program.equip, o) && !(block.kind === 'abs' && (o.equip || []).includes('bar')) && travelAllows(travel, o) && !skip.includes(id);
    });
  }

  const travel = (day, mode, program, cat) => standIns(day, { mode }, program, cat);
  function standIns(day, { mode = null, skip = [] }, program, cat) {
    if (!mode && !skip.length) return day;
    alternatives(Object.keys(cat.EX)[0], { items: [] }, program, cat); // the gear rules
    const used = new Set(day.blocks.flatMap((b) => b.items.map((it) => it.ex)));
    const blocks = day.blocks.map((b) => {
      const out = { ...b, items: b.items.slice() };
      out.items = b.items.map((it) => {
        const gear = !travelAllows(mode, cat.EX[it.ex]);
        if (!gear && !skip.includes(it.ex)) return it;
        // the same first main muscle and kind of work (reps for reps, a hold for a hold) first; else either kind; else
        // one led by any of its main muscles: missing gear (or an exercise you skip) is the worse swap
        const pick = (loose) => alternatives(it.ex, out, program, cat, { mode, skip }, loose).find((id) => !used.has(id));
        const to = pick(0) || pick(1) || pick(2);
        if (!to) return { ...it, [gear ? 'travelMissing' : 'skipMissing']: true };
        used.add(to);
        const e = cat.EX[to];
        const next = { ex: to, n: cat.scaleReps(e, e.r[day.level - 1], b.format), ...(it.sets ? { sets: it.sets } : {}), swappedFrom: it.swappedFrom || it.ex, [gear ? 'travel' : 'skipped']: true };
        out.items = out.items.map((x) => (x === it ? next : x));
        return next;
      });
      return out;
    });
    return { ...day, blocks };
  }

  const appliesTo = (s, d) => s.day === d || (!!s.onward && s.day <= d);
  function applySwaps(day, swaps, cat) {
    const mine = (swaps || []).filter((s) => appliesTo(s, day.day));
    if (!mine.length) return day;
    const blocks = day.blocks.map((b) => ({ ...b, items: b.items.map((it) => {
      let cur = it;
      mine.forEach((s) => {
        if (cur.ex !== s.ex) return;
        const to = cat.EX[s.to];
        cur = { ex: s.to, n: cat.scaleReps(to, to.r[day.level - 1], b.format), ...(it.sets ? { sets: it.sets } : {}), swappedFrom: it.ex };
      });
      return cur;
    }) }));
    return { ...day, blocks };
  }

  // the swap that put exId on that day (the latest one that reaches the day)
  const swapBehind = (swaps, day, exId) => swaps.filter((s) => appliesTo(s, day) && s.to === exId).pop();
  function undoSwap(swaps, day, exId) {
    const s = swapBehind(swaps, day, exId);
    return s ? swaps.filter((x) => x !== s) : swaps;
  }

  const api = { alternatives, applySwaps, undoSwap, swapBehind, travel, standIns, travelAllows, TRAVEL };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBSwaps = api;
})(typeof window !== 'undefined' ? window : globalThis);
