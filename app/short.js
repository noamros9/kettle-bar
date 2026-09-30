/* Shorter today (Phase 7, #67.3): a day cut to about 20 minutes, for today only. Pure: runs in Node and in the page
   (KBShort).

     trim(day, { R, EX, target? = 20 }) -> the day with fewer sets, rounds, minutes or passes, and the last exercises of a
       block dropped (never a block's first), landing in [target - 2, target + 2] with as few changes as it can (else as
       close as it can); `est` is its new length and `short: { from: old est }` marks it. A day already that short comes
       back as it is (the same object). Warm-up and cool-down stay: they are stretching minutes, not the workout.
     TARGET  20
   R: the program's rests (as the Program Builder's time model); the time of a block comes from formats.js. */
(function (root, Formats) {
  const TARGET = 20, WINDOW = 2;

  // what one block can become: each value of its format's option up to the one it has, with its last one or two
  // exercises dropped or not (a block keeps at least its first); `steps` counts the changes
  function variants(b, R, EX) {
    const { key, values } = Formats.of(b).options, n = b.items.length, out = [];
    const mine = values.filter((v) => v <= b[key]);
    (mine.length ? mine : [b[key]]).forEach((v) => {
      for (let keep = n; keep >= Math.max(1, n - 2); keep--) {
        const items = b.items.slice(0, keep).map((it) => (it.sets ? { ...it, sets: Math.min(it.sets, key === 'sets' ? v : it.sets) } : it));
        const block = { ...b, [key]: v, items };
        out.push({ block, sec: Formats.of(block).time(block, R, EX), steps: (n - keep) + values.indexOf(b[key]) - values.indexOf(v) });
      }
    });
    return out;
  }

  function trim(day, { R, EX, target = TARGET }) {
    if (day.est <= target + WINDOW) return day;
    const options = day.blocks.map((b) => variants(b, R, EX));
    const gaps = day.blocks.reduce((s, b, i) => s + (i ? (b.kind === 'abs' ? R.beforeAbs : R.block) : 0), 0);
    let best = null;
    const walk = (bi, sec, steps, pick) => {
      if (bi === options.length) {
        const min = (sec + gaps) / 60, off = Math.max(0, Math.abs(min - target) - WINDOW);
        const pen = off * 100 + steps + Math.abs(min - target) / 10;
        if (!best || pen < best.pen) best = { pen, min, pick };
        return;
      }
      options[bi].forEach((o) => walk(bi + 1, sec + o.sec, steps + o.steps, pick.concat([o.block])));
    };
    walk(0, 0, 0, []);
    return { ...day, blocks: best.pick, est: Math.round(best.min), short: { from: day.est } };
  }

  const api = { trim, TARGET };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBShort = api;
})(typeof window !== 'undefined' ? window : globalThis, typeof module !== 'undefined' && module.exports ? require('../formats.js') : window.KBFormats);
