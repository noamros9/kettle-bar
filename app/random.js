/* Random workout (Phase 7, #64): one day built fresh from the recipe book, outside any program's 60 days. It counts in
   stats (and has its own scope there), never in a program's progress. Pure apart from what it is handed: runs in Node
   and in the page (KBRandom).

     make({ recipes, buildDay, newMemory, makeRnd, cat }, choice, { level, seed }) -> made
       choice = { family: name | subject: name | subjects: [names], minutes: 15|25|35, equipment: 'all'|'kb'|'bw' }
       made   = { choice, seed, level, subject, family, day, program }: a day type of the family (or subject) that fits the
                minutes and gear, picked with the seed, built by the Program Builder with a fresh memory at that level and
                that day type's own levers; `program` is what the day page and its Workout Session need (id 'random',
                equip, rests, levels, dayTypes, days: [day]). Throws problem()'s message when nothing fits.
     problem(recipes, choice) -> null, or the message for people why nothing can be made
     levelOf([{ time, level }]) -> the level of the day marked done last (in any program or a random one); none -> 1
     levelOfDay(n) -> 1-3: the level of day n of a 60-day program (days 1-20, 21-40, 41-60)
     FAMILIES, MINUTES [15, 25, 35], newId(now?, rnd?), newSeed(rnd?)
     REST_DAY: the rest-day flow's choice (mobility & posture or flexibility, 15 min, no equipment: 15 is the shortest
               day the recipe book makes)
     restDay(doneTimes, now, dismissed) -> show the rest-day card: nothing marked done on today's date (the phone's own
               day) and not dismissed today (`dismissed` = the dayKey it was dismissed on, or null)
     dayKey(date) -> 'YYYY-MM-DD' of the local day

     const random = createRandom({ store, cat, createSession, storage, now? })
       random.start(made, { id? }) -> the open workout      random.current() -> it, or null
       random.open() -> a Day for the open workout (as app/day.js's: program, day, session(), restored(), alternatives,
                        swap (today only: there is no rest of the program), swapBehind, undo), or nothing
       random.done() -> its id: the record is written to the account and the device forgets the open workout; null when
                        none is open        random.discard(): forgotten, nothing written
       random.entries() -> [{ pid: 'random', day: id, time }] for stats   random.dayOf(id) -> the day as done (swaps applied)
       random.levels() -> [{ time, level }] of the done ones

   The open workout lives on the device only (`kb-random-open`: made + { id, swaps, startedAt }), as a day's saved
   session does, and is forgotten after 12 hours; its Workout Session is saved under `kb-session-random-<id>`.
   Marked done, it becomes the record users/{uid}/random/{id} (synced, in export/import and the nightly backup):
     { name: 'Random: <title>', choices, seed, level, day, swaps, time }   (day: as built; swaps: [{ day: 1, ex, to }])
   A record that is damaged, or names an exercise this app doesn't know, is left out of stats. */
(function (root, S, W) {
  const FAMILIES = ['Strength', 'Cardio & combat', 'Mind & body', 'Mixed'];
  const MINUTES = [15, 25, 35];
  const GEAR = { all: 'all equipment', kb: 'a kettlebell only', bw: 'no equipment' };
  const LEVER_TEXT = { reps: 'More reps', holds: 'Longer holds', weight: 'Heavier weights', variation: 'Harder variations', tempo: 'Slower tempo' };
  const OPEN = 'kb-random-open';
  const HOURS_12 = 12 * 3600 * 1000;
  const isObject = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
  const clone = (x) => JSON.parse(JSON.stringify(x));

  const newId = (now = Date.now(), rnd = Math.random) => now.toString(36) + Math.floor(rnd() * 1296).toString(36).padStart(2, '0');
  const newSeed = (rnd = Math.random) => Math.floor(rnd() * 2 ** 32).toString(36);
  const levelOfDay = (n) => (n <= 20 ? 1 : n <= 40 ? 2 : 3);
  function levelOf(dones) {
    const last = dones.reduce((best, d) => (!best || d.time > best.time ? d : best), null);
    return last ? last.level : 1;
  }

  const REST_DAY = { subjects: ['Mobility & posture', 'Flexibility'], minutes: 15, equipment: 'bw' };
  const nameOf = (c) => (c.subjects ? c.subjects.join(' or ') : c.subject || c.family);
  const filterOf = (c) => (c.subjects ? { subjects: c.subjects } : c.subject ? { subjects: [c.subject] } : { families: [c.family] });
  const pad = (n) => String(n).padStart(2, '0');
  const dayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const restDay = (doneTimes, now, dismissed) => dismissed !== dayKey(now) && !doneTimes.some((t) => dayKey(new Date(t)) === dayKey(now));
  // the day types that fit, those that land on the minutes exactly first; with several subjects, each subject's own
  // best, so every one of them can come up
  function candidates(recipes, c) {
    if (c.subjects) return c.subjects.flatMap((subject) => candidates(recipes, { ...c, subjects: undefined, subject }));
    const fit = recipes.pick({ ...filterOf(c), equipment: c.equipment, minutes: c.minutes });
    const exact = fit.filter((t) => recipes.fitsExactly(t, c.equipment, c.minutes));
    return exact.length ? exact : fit;
  }
  function problem(recipes, c) {
    if (!recipes.pick(filterOf(c)).length) return `No ${nameOf(c)} workouts.`;
    return candidates(recipes, c).length ? null : `No ${c.minutes}-minute ${nameOf(c)} workout with ${GEAR[c.equipment]}.`;
  }

  // one well-mixed draw from the seed (FNV-1a, then a mulberry32 step): the builder's stream moves little on its
  // first draw between seeds like 'a' and 'b', so the day type is picked with this instead
  function mixed(seed) {
    let a = [...String(seed)].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261);
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  function make({ recipes, buildDay, newMemory, makeRnd, cat }, choice, { level, seed }) {
    const why = problem(recipes, choice);
    if (why) throw new Error(why);
    const list = candidates(recipes, choice), rnd = makeRnd(seed);
    const t = list[Math.floor(mixed(seed) * list.length)];
    const recipe = recipes.recipeFor(t, { minutes: choice.minutes, equipment: choice.equipment, levers: t.levers });
    const day = { ...buildDay(recipe, { day: 1, level, rnd, memory: newMemory() }, cat), name: t.label };
    const program = {
      id: 'random', name: 'Random workout', subject: t.subject, equip: choice.equipment, rests: clone(t.rests),
      levels: ['Level I · Intermediate', `Level II · ${LEVER_TEXT[t.levers[0]]}`, `Level III · ${LEVER_TEXT[t.levers[1]]}`],
      dayTypes: { [day.type]: { label: t.label, short: t.short, c: 'var(--t-cba)' } }, days: [day],
    };
    return { choice: clone(choice), seed, level, subject: t.subject, family: t.family, day, program };
  }

  function createRandom({ store, cat, createSession, storage, now = Date.now }) {
    const live = { key: null, exs: null, session: null, restored: false };
    const sessionKey = (id) => `kb-session-random-${id}`;
    const read = (key) => { try { return JSON.parse(storage.get(key)); } catch (e) { return undefined; } };
    const knownDay = (d) => isObject(d) && Array.isArray(d.blocks) && d.blocks.length > 0
      && d.blocks.every((b) => isObject(b) && Array.isArray(b.items) && b.items.every((it) => isObject(it) && !!cat.EX[it.ex]));
    const forget = (id) => { storage.remove(OPEN); storage.remove(sessionKey(id)); };

    function current() {
      const o = read(OPEN);
      if (!isObject(o)) return null;
      if (typeof o.startedAt !== 'number' || typeof o.id !== 'string' || !knownDay(o.day) || !isObject(o.program) || !Array.isArray(o.swaps)) { forget(o.id); return null; }
      if (now() - o.startedAt > HOURS_12) { forget(o.id); return null; }
      return o;
    }
    const save = (o) => storage.set(OPEN, JSON.stringify(o));
    function start(made, { id = newId(now()) } = {}) {
      const o = { ...clone(made), id, swaps: [], startedAt: now() };
      save(o);
      return o;
    }

    // the session, saving itself after every change (as app/day.js's)
    function saving(ses, key) {
      const keep = (f) => (...a) => { const r = f(...a); storage.set(key, JSON.stringify({ savedAt: now(), session: ses.snapshot() })); return r; };
      return { ...ses, complete: keep(ses.complete), count: keep(ses.count), setStarted: keep(ses.setStarted) };
    }
    function open() {
      const o = current();
      if (!o) return undefined;
      const swapped = S.applySwaps(o.day, o.swaps, cat), warm = W.warmupFor(swapped, cat.EX, o.subject);
      const day = warm === swapped.warmup ? swapped : { ...swapped, warmup: warm }, program = { ...o.program, days: [day] };
      const itemAt = (bi, i) => day.blocks[bi].items[i];
      const change = (swaps) => save({ ...o, swaps });
      return {
        program, day,
        session() {
          const key = sessionKey(o.id), exs = JSON.stringify(day.blocks.map((b) => b.items.map((it) => it.ex)));
          if (live.key !== key) {
            const rec = read(key), snap = isObject(rec) ? rec.session : undefined;
            Object.assign(live, { key, exs, restored: !!snap, session: saving(createSession(program, day, { EX: cat.EX, saved: snap }), key) });
          } else if (live.exs !== exs) Object.assign(live, { exs, session: saving(createSession(program, day, { EX: cat.EX, from: live.session }), key) });
          return live.session;
        },
        restored() { this.session(); return live.restored; },
        alternatives: (bi, i) => S.alternatives(itemAt(bi, i).ex, day.blocks[bi], program, cat),
        swap(bi, i, to) { change([...o.swaps, { day: 1, ex: itemAt(bi, i).ex, to }]); },
        swapBehind: (bi, i) => S.swapBehind(o.swaps, 1, itemAt(bi, i).ex),
        undo(bi, i) { change(S.undoSwap(o.swaps, 1, itemAt(bi, i).ex)); },
      };
    }

    function done() {
      const o = current();
      if (!o) return null;
      store.setDoc('random', o.id, { name: 'Random: ' + o.day.title, choices: o.choice, seed: o.seed, level: o.level, day: o.day, swaps: o.swaps, time: new Date(now()).toISOString() });
      forget(o.id);
      return o.id;
    }

    const valid = (r) => isObject(r) && typeof r.time === 'string' && !Number.isNaN(Date.parse(r.time)) && [1, 2, 3].includes(r.level)
      && knownDay(r.day) && (r.swaps === undefined || Array.isArray(r.swaps));
    const records = () => { const docs = store.docs('random'); return Object.keys(docs).filter((id) => valid(docs[id])).map((id) => [id, docs[id]]); };
    return {
      start, current, open, done,
      discard() { const o = current(); if (o) forget(o.id); },
      entries: () => records().map(([id, r]) => ({ pid: 'random', day: id, time: r.time })),
      dayOf(id) { const r = store.doc('random', id); return valid(r) ? S.applySwaps(r.day, r.swaps, cat) : undefined; },
      levels: () => records().map(([, r]) => ({ time: r.time, level: r.level })),
    };
  }

  const api = { REST_DAY, restDay, dayKey, make, problem, levelOf, levelOfDay, createRandom, newId, newSeed, FAMILIES, MINUTES };
  /* node:coverage ignore next 3 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBRandom = api;
})(typeof window !== 'undefined' ? window : globalThis, typeof module !== 'undefined' && module.exports ? require('./swaps.js') : window.KBSwaps,
  typeof module !== 'undefined' && module.exports ? require('./warmup.js') : window.KBWarmup);
