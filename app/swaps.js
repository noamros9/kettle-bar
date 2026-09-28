/* Swaps: trade an exercise for another that works the same main muscle. Pure: no page, no storage.
   The Progress Store keeps each program's swaps; the page shows every day through applySwaps.

     alternatives(exId, block, program, cat) -> [exId]   what the exercise can be swapped for
     applySwaps(day, swaps, cat) -> the day as you'll do it (a new object; the program is never changed)
   cat is the Exercise Catalogue module ({ EX, allowedIn, scaleReps }).

   A swap: { day, ex, to } (today only). Swaps apply in the order they were made, so a swap of a swap
   follows the chain. The new exercise gets its own reps for the day's level. */
(function (root) {
  const STRETCH = ['warmup', 'cooldown'];

  function alternatives(exId, block, program, cat) {
    const EX = cat.EX, e = EX[exId], main = e.muscles.primary[0], isHold = e.u === 'sec';
    const inBlock = new Set(block.items.map((it) => it.ex));
    return Object.keys(EX).filter((id) => {
      const o = EX[id];
      return !inBlock.has(id) && !STRETCH.includes(o.cat) && o.muscles.primary[0] === main && (o.u === 'sec') === isHold
        && cat.allowedIn(program.equip, o) && !(block.kind === 'abs' && (o.equip || []).includes('bar'));
    });
  }

  const appliesTo = (s, d) => s.day === d;
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

  const api = { alternatives, applySwaps };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBSwaps = api;
})(typeof window !== 'undefined' ? window : globalThis);
