/* Variety programs (Phase 16): every day is different.
   A config with `variety: true` has day types and `formats` (a day type may narrow them with its own `formats`) and no
   cycle. expand(config) deals one (day type, format) pair per day from a deck seeded by the program's id: no pair
   twice, and the same day type never two days running when it can be helped. Each pair becomes an ordinary day type
   (key `<type>-<format>`), whose blocks marked `vary: true` take the pair's format, so the Program Builder, the pins,
   the stats and the pages see an ordinary config with a cycle as long as the program. Any other config is returned
   as it is. Node only: programs.config.js applies it when it puts the library together. */
const { dayCountOf } = require('./app/length.js');
const { NAMES } = require('./formats.js');

// the work formats a day can take (guided flows and boxing bouts are their own kind of day)
const ALLOWED = ['straight', 'superset', 'circuit', 'emom', 'amrap', 'tabata', 'ladder'];

// a seeded shuffle of its own (not the builder's), so dealing never changes how the days themselves are drawn
function makeRnd(seedText) {
  let seed = [...seedText].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 11);
  return () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
}

function expand(cfg) {
  if (!cfg.variety) return cfg;
  const days = dayCountOf(cfg);
  const deck = [];
  Object.entries(cfg.dayTypes).forEach(([k, t]) => {
    if (!t.blocks.some((b) => b.vary)) throw new Error(`${cfg.id}: ${k}: no block is marked vary`);
    (t.formats || cfg.formats).forEach((f) => {
      if (!ALLOWED.includes(f)) throw new Error(`${cfg.id}: ${f} is not a format a Variety day can take`);
      deck.push([k, f]);
    });
  });
  if (deck.length < days) throw new Error(`${cfg.id}: a Variety program needs at least ${days} different day types and formats, not ${deck.length}`);
  const rnd = makeRnd(cfg.id);
  for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
  // deal: a new day type and a new format from yesterday's if the deck has one, else a new day type, else the next
  const dealt = [];
  while (dealt.length < days) {
    const prev = dealt[dealt.length - 1];
    let i = prev ? deck.findIndex(([k, f]) => k !== prev[0] && f !== prev[1]) : 0;
    if (i < 0) i = deck.findIndex(([k]) => k !== prev[0]);
    if (i < 0) i = 0;
    dealt.push(deck.splice(i, 1)[0]);
  }
  const dayTypes = {};
  dealt.forEach(([k, f]) => {
    const t = cfg.dayTypes[k];
    const { formats, ...type } = t; // eslint-disable-line no-unused-vars
    dayTypes[`${k}-${f}`] = { ...type, label: `${t.label} · ${NAMES[f]}`, blocks: t.blocks.map(({ vary, ...b }) => (vary ? { ...b, f } : b)) };
  });
  const { formats, ...rest } = cfg; // eslint-disable-line no-unused-vars
  return { ...rest, split: cfg.split || 'Every day is different', dayTypes, cycle: dealt.map(([k, f]) => `${k}-${f}`) };
}

module.exports = { expand, ALLOWED };
