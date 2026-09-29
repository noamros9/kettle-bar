/* Formats: every rule that depends on how a block is run, in one table (see CONTEXT.md, Format).
   Pure: no page, no storage. Loaded in Node (require) and inlined in the page (KBFormats).

     of(block) -> the entry for block.format (straight sets when it has none); throws for an unknown format
     FORMATS[name] -> { name, time, options, sets, summary, timed, tempo, optionalSlots, halveReps }
     NAMES -> { format: display name }, for the tags on cards and timers

   Entry:
     name            the words on cards and in the timer ("Straight sets", "Guided flow")
     time(b, R, EX)  seconds the block takes, with the program's rests R (Program Builder time model)
     options         what the Program Builder may choose for the block: { key, values, pref }
     sets(b, EX)     the sets the block asks for, [{ ex, sets, repsPerSet }] (Stats; timed blocks are converted to sets)
     summary(b)      the words in a day summary ("a 3-round circuit of 4 exercises")
     timed           runs from one Start on the timer (a session plan), instead of ticking sets by hand
     tempo           may take the slow-tempo lever (3 s lowering)
     optionalSlots   its last slots may be dropped to fit the time range
     halveReps       its reps are halved (seconds capped at 30) when it is built from an exercise's level reps
   Session plans (what the timer says, phase by phase) stay in app/session.js. */
(function (root) {
  const SETUP = 5, TRANSITION = 5; // SETUP: between exercises inside a block; TRANSITION: moving into each pose of a guided flow

  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
  const article = (n) => (/^(8|11|18)\b/.test(String(n)) ? 'an' : 'a');

  // seconds of work for one item: its reps at the exercise's pace (slower with tempo), or its hold, both sides
  function work(it, EX) {
    const e = EX[it.ex], mult = e.side ? 2 : 1, slow = it.tempo ? 1.5 : 1;
    return (e.u === 'sec' ? it.n * mult : it.n * e.tp * mult * slow) + (e.side ? 5 : 0);
  }
  // one pose of a guided flow: its hold, or its reps at the exercise's pace
  const poseSec = (it, EX) => (EX[it.ex].u === 'sec' ? it.n : it.n * EX[it.ex].tp);
  const reps = (it, EX) => (EX[it.ex].u === 'sec' ? 0 : it.n * (EX[it.ex].side ? 2 : 1));
  const works = (b, EX) => b.items.map((it) => work(it, EX) + SETUP);
  const eachItem = (b, sets, repsPerSet, EX) => b.items.map((it, i) => ({ ex: it.ex, sets: sets(it, i), repsPerSet: repsPerSet(it, EX) }));
  const noReps = () => 0;

  const FORMATS = {
    straight: {
      name: 'Straight sets',
      time: (b, R, EX) => { const W = works(b, EX); return b.items.reduce((s, it, i) => s + b.sets * W[i] + (b.sets - 1) * R.set, 0) + (b.items.length - 1) * R.exercise; },
      options: { key: 'sets', values: [2, 3, 4, 5], pref: 4 },
      sets: (b, EX) => eachItem(b, (it) => it.sets || b.sets, reps, EX),
      summary: (b) => `${plural(b.items.length, 'exercise')} in straight sets`,
      timed: false, tempo: true, optionalSlots: true, halveReps: false,
    },
    superset: {
      name: 'Supersets',
      time: (b, R, EX) => {
        const W = works(b, EX);
        let t = 0;
        for (let i = 0; i < b.items.length; i += 2) t += b.sets * (W[i] + (W[i + 1] || 0) + 10) + (b.sets - 1) * R.superset;
        return t + (Math.ceil(b.items.length / 2) - 1) * R.exercise;
      },
      options: { key: 'sets', values: [2, 3, 4, 5], pref: 4 },
      sets: (b, EX) => eachItem(b, () => b.sets, reps, EX),
      summary: (b) => `${plural(b.items.length, 'exercise')} as supersets`,
      timed: false, tempo: true, optionalSlots: true, halveReps: false,
    },
    circuit: {
      name: 'Circuits',
      time: (b, R, EX) => b.rounds * works(b, EX).reduce((a, x) => a + x + 10, 0) + (b.rounds - 1) * R.round,
      options: { key: 'rounds', values: [2, 3, 4, 5, 6], pref: 4 },
      sets: (b, EX) => eachItem(b, () => b.rounds, reps, EX),
      summary: (b) => `${article(b.rounds)} ${b.rounds}-round circuit of ${plural(b.items.length, 'exercise')}`,
      timed: false, tempo: true, optionalSlots: true, halveReps: false,
    },
    emom: {
      name: 'EMOM',
      time: (b) => b.minutes * 60,
      options: { key: 'minutes', values: [4, 6, 8, 10, 12, 14, 16, 18, 20], pref: 12 },
      // minute m does item (m - 1) mod n
      sets: (b, EX) => eachItem(b, (it, i) => Math.ceil((b.minutes - i) / b.items.length), reps, EX),
      summary: (b) => `${article(b.minutes)} ${b.minutes}-minute EMOM`,
      timed: true, tempo: false, optionalSlots: false, halveReps: true,
    },
    amrap: {
      name: 'AMRAP',
      time: (b) => b.minutes * 60,
      options: { key: 'minutes', values: [3, 4, 5, 6, 7, 8, 10, 12, 15], pref: 8 },
      // one set per exercise per 2 minutes, at least one
      sets: (b, EX) => eachItem(b, () => Math.max(1, Math.floor(b.minutes / 2)), noReps, EX),
      summary: (b) => `${article(b.minutes)} ${b.minutes}-minute AMRAP`,
      timed: true, tempo: false, optionalSlots: true, halveReps: true,
    },
    ladder: {
      name: 'Ladders',
      time: (b) => b.minutes * 60,
      options: { key: 'minutes', values: [5, 6, 7, 8, 10, 12], pref: 8 },
      sets: (b, EX) => eachItem(b, () => Math.max(1, Math.floor(b.minutes / 2)), noReps, EX),
      summary: (b) => `${article(b.minutes)} ${b.minutes}-minute ladder`,
      timed: true, tempo: false, optionalSlots: false, halveReps: false,
    },
    tabata: {
      name: 'Tabata',
      time: (b, R) => b.tabatas * 240 + (b.tabatas - 1) * R.block,
      options: { key: 'tabatas', values: [1, 2, 3, 4], pref: 2 },
      sets: (b, EX) => eachItem(b, (it, i) => Math.ceil((b.tabatas * 8 - i) / b.items.length), noReps, EX),
      summary: (b) => plural(b.tabatas, 'Tabata'),
      timed: true, tempo: true, optionalSlots: false, halveReps: false,
    },
    flow: {
      name: 'Guided flow',
      time: (b, R, EX) => b.repeat * b.items.reduce((s, it) => s + (EX[it.ex].side ? 2 : 1) * (TRANSITION + poseSec(it, EX)), 0),
      options: { key: 'repeat', values: [1, 2, 3], pref: 1 },
      sets: (b, EX) => eachItem(b, () => b.repeat, reps, EX), // a pose is a set per pass
      // a one-pose flow (sun salutations) is named by its title
      summary: (b) => `${b.items.length === 1 ? b.title.toLowerCase() : `${article(b.items.length)} ${b.items.length}-pose flow`}${['', '', ' done twice', ' done three times'][b.repeat] || ''}`,
      timed: true, tempo: false, optionalSlots: false, halveReps: false,
    },
    bouts: {
      name: 'Bouts',
      time: (b) => b.items.reduce((s, it) => s + it.n, 0) + (b.items.length - 1) * b.rest,
      options: { key: 'rest', values: [60], pref: 60 }, // one bout per item (3 min each), 1 min rest between
      sets: (b, EX) => eachItem(b, () => 1, noReps, EX), // a bout is a set of its combo
      summary: (b) => plural(b.items.length, 'bout'),
      timed: true, tempo: true, optionalSlots: false, halveReps: false,
    },
  };

  const NAMES = Object.fromEntries(Object.entries(FORMATS).map(([f, x]) => [f, x.name]));
  function of(block) {
    const f = block.format || 'straight';
    if (!FORMATS[f]) throw new Error('format ' + f);
    return FORMATS[f];
  }

  const api = { FORMATS, NAMES, of, plural, TRANSITION };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBFormats = api;
})(typeof window !== 'undefined' ? window : globalThis);
