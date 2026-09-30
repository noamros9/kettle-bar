/* The Day: a program day as you'll do it, with its live Workout Session and the swap actions.

     const days = createDays({ programs, store, cat, createSession, storage, now?, travel? });
       travel: () => the travel mode ('nobar' | 'kb' | 'bw') or null (Phase 7): the open day swaps what needs missing
               gear (app/swaps.js travel) and its Swap list leaves the gear out; stats (resolved) keep the program's day
     days.forget(pid, n)                 drop the saved session of that day (Mark as done, un-marking)
     days.resolved(pid, n, round?) -> the day with that round's swaps applied (for stats), or nothing
     days.open(pid, n) -> a Day, or nothing for an unknown program or day:
       D.program, D.day                 the program and the day as you'll do it
       D.session()                      its Workout Session; the same one while the day stays open, and
                                        when a swap changes the exercises the ticks carry over; one saved on the
                                        device (see below) comes back when the day is opened again
       D.restored()                     true when the live session was picked up from the device
       D.alternatives(bi, i)            what item i of block bi can be swapped for
       D.swap(bi, i, to, { onward })    today only, or from this day to the end of the program
       D.undo(bi, i), D.swapBehind(bi, i)   the swap that put this item here, and undoing it
       D.travel()                       the travel mode the day was opened with, or null
       The open day's warm-up matches its format (app/warmup.js: dynamic for combat and cardio days, gentle for yoga and
       the like); stats (resolved) keep the stored one, of the same length.
       D.short(), D.canShort(), D.setShort(on)   "short on time" (Phase 7): the day trimmed to about 20 minutes for this
                                        round (app/short.js); canShort: the day is longer than that, or already short

   Saved sessions: every change to the open day's session is written to the device, `storage` = { get, set, remove }
   (never the synced store), under kb-session-<pid>-<round>-<day> as { savedAt, session: snapshot }. The round is in the
   key so round 2's day 5 never restores round 1's. One saved more than 12 hours ago is ignored and removed. A running
   timer is not saved, only what is ticked, counted and stretched and when the workout clock started.

   Swaps and short days are stored with the program's progress (Progress Store); the rules are in app/swaps.js and
   app/short.js. A short day is trimmed after its swaps, with the program's rests. */
(function (root, S, P, Short, W) {
  function createDays({ programs, store, cat, createSession, storage, now = Date.now, travel = () => null }) {
    const live = { key: null, exs: null, session: null, restored: false };
    const HOURS_12 = 12 * 3600 * 1000;
    const savedKey = (pid, n) => `kb-session-${pid}-${store.round(pid)}-${n}`;
    // the stored snapshot of a day, or nothing when there is none, it is unreadable or it is too old (then removed)
    function saved(key) {
      let rec; try { rec = JSON.parse(storage.get(key)); } catch (e) { return undefined; }
      if (!rec) return undefined;
      if (typeof rec.savedAt !== 'number' || now() - rec.savedAt > HOURS_12) { storage.remove(key); return undefined; }
      return rec.session;
    }
    // the session, saving itself after every change
    function saving(ses, key) {
      const keep = (f) => (...a) => { const r = f(...a); storage.set(key, JSON.stringify({ savedAt: now(), session: ses.snapshot() })); return r; };
      return { ...ses, complete: keep(ses.complete), count: keep(ses.count), setStarted: keep(ses.setStarted) };
    }
    // a day with its swaps: the current round's, or a past round's (for stats)
    const trim = (pid, day) => Short.trim(day, { R: programs.get(pid).rests, EX: cat.EX });
    const resolved = (pid, n, round) => {
      const w = programs.day(pid, n);
      if (!w) return undefined;
      const swaps = round === undefined ? store.swaps(pid) : P.swapsOfRound(store.progress(pid), round);
      const day = S.applySwaps(w, swaps, cat);
      return store.shortOf(pid, round)[n] ? trim(pid, day) : day;
    };

    function open(pid, n) {
      const program = programs.get(pid), planned = resolved(pid, n), mode = travel() || null;
      if (!planned) return undefined;
      const moved = S.travel(planned, mode, program, cat), warm = W.warmupFor(moved, cat.EX, program.subject);
      const day = warm === moved.warmup ? moved : { ...moved, warmup: warm };
      const itemAt = (bi, i) => day.blocks[bi].items[i];
      return {
        program, day,
        session() {
          const key = savedKey(pid, n), exs = JSON.stringify(day.blocks.map((b) => b.items.map((it) => it.ex)));
          if (live.key !== key) {
            const snap = saved(key);
            Object.assign(live, { key, exs, restored: !!snap, session: saving(createSession(program, day, { EX: cat.EX, saved: snap }), key) });
          } else if (live.exs !== exs) Object.assign(live, { exs, session: saving(createSession(program, day, { EX: cat.EX, from: live.session }), key) });
          return live.session;
        },
        restored() { this.session(); return live.restored; },
        alternatives: (bi, i) => S.alternatives(itemAt(bi, i).ex, day.blocks[bi], program, cat, mode),
        travel: () => mode,
        swap(bi, i, to, { onward } = {}) {
          // a travel stand-in is swapped as the planned exercise it stands for (the stand-in is not in the program)
          store.setSwaps(pid, [...store.swaps(pid), { day: n, ex: planned.blocks[bi].items[i].ex, to, ...(onward ? { onward: true } : {}) }]);
        },
        swapBehind: (bi, i) => S.swapBehind(store.swaps(pid), n, itemAt(bi, i).ex),
        undo(bi, i) { store.setSwaps(pid, S.undoSwap(store.swaps(pid), n, itemAt(bi, i).ex)); },
        short: () => store.isShort(pid, n),
        canShort: () => store.isShort(pid, n) || trim(pid, planned) !== planned,
        setShort(on) { store.setShort(pid, n, on); },
      };
    }
    return { open, resolved, forget: (pid, n) => storage.remove(savedKey(pid, n)) };
  }

  const api = { createDays };
  /* node:coverage ignore next 5 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBDay = api;
})(typeof window !== 'undefined' ? window : globalThis, typeof module !== 'undefined' && module.exports ? require('./swaps.js') : window.KBSwaps,
  typeof module !== 'undefined' && module.exports ? require('./progress.js') : window.KBProgress,
  typeof module !== 'undefined' && module.exports ? require('./short.js') : window.KBShort,
  typeof module !== 'undefined' && module.exports ? require('./warmup.js') : window.KBWarmup);
