/* Day summaries: two generated lines under each workout's name (the program paragraphs are hand-written).
     daySummary(day, program, { EX, MUSCLE_NAMES }) -> [shape, emphasis]
   Line 1, the shape: focus and what the day is made of ("Chest & back: 5 exercises in straight sets, then abs.").
   Line 2, the emphasis: the muscles worked most (weighted as in stats), what this level changes, and swaps. */
(function (root, Stats, Formats) {
  const { plural } = Formats;
  const listText = (xs) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}` : xs[0]);

  const blockText = (b) => Formats.of(b).summary(b);

  function daySummary(day, program, { EX, MUSCLE_NAMES }) {
    const type = program.dayTypes[day.type], focus = type ? type.label : day.title;
    const main = day.blocks.filter((b) => b.kind !== 'abs'), hasAbs = main.length < day.blocks.length;
    const shape = `${focus}: ${listText(main.map(blockText))}${hasAbs ? ', then abs' : ''}.`;

    const loads = Stats.dayVolume({ ...day, blocks: main }, EX).muscles; // the main work, not the abs finisher
    const top = Object.keys(loads).sort((a, b) => loads[b] - loads[a]).slice(0, 3).map((m) => MUSCLE_NAMES[m].toLowerCase());
    const [lvl, change] = program.levels[day.level - 1].split(' · ');
    const swapped = day.blocks.reduce((a, b) => a + b.items.filter((it) => it.swappedFrom).length, 0);
    const emphasis = [`Most work for ${listText(top)}`, `${lvl}: ${change.toLowerCase()}`, ...(swapped ? [`${plural(swapped, 'exercise')} swapped`] : [])].join(' · ') + '.';
    return [shape, emphasis];
  }

  const api = { daySummary };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBSummary = api;
})(typeof window !== 'undefined' ? window : globalThis, typeof module !== 'undefined' && module.exports ? require('./stats.js') : window.KBStats, typeof module !== 'undefined' && module.exports ? require('../formats.js') : window.KBFormats);
