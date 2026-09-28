/* The Day: a program day as you'll do it, with its live Workout Session and the swap actions.

     const days = createDays({ programs, store, cat, createSession });
     days.resolved(pid, n, round?) -> the day with that round's swaps applied (for stats), or nothing
     days.open(pid, n) -> a Day, or nothing for an unknown program or day:
       D.program, D.day                 the program and the day as you'll do it
       D.session()                      its Workout Session; the same one while the day stays open, and
                                        when a swap changes the exercises the ticks carry over
       D.alternatives(bi, i)            what item i of block bi can be swapped for
       D.swap(bi, i, to, { onward })    today only, or from this day to the end of the program
       D.undo(bi, i), D.swapBehind(bi, i)   the swap that put this item here, and undoing it

   Swaps are stored with the program's progress (Progress Store); the rules are in app/swaps.js. */
(function (root, S, P) {
  function createDays({ programs, store, cat, createSession }) {
    const live = { key: null, exs: null, session: null };
    // a day with its swaps: the current round's, or a past round's (for stats)
    const resolved = (pid, n, round) => {
      const w = programs.day(pid, n);
      if (!w) return undefined;
      const swaps = round === undefined ? store.swaps(pid) : P.swapsOfRound(store.progress(pid), round);
      return S.applySwaps(w, swaps, cat);
    };

    function open(pid, n) {
      const program = programs.get(pid), day = resolved(pid, n);
      if (!day) return undefined;
      const itemAt = (bi, i) => day.blocks[bi].items[i];
      return {
        program, day,
        session() {
          const key = pid + ':' + n, exs = JSON.stringify(day.blocks.map((b) => b.items.map((it) => it.ex)));
          if (live.key !== key) Object.assign(live, { key, exs, session: createSession(program, day, { EX: cat.EX }) });
          else if (live.exs !== exs) Object.assign(live, { exs, session: createSession(program, day, { EX: cat.EX, from: live.session }) });
          return live.session;
        },
        alternatives: (bi, i) => S.alternatives(itemAt(bi, i).ex, day.blocks[bi], program, cat),
        swap(bi, i, to, { onward } = {}) {
          store.setSwaps(pid, [...store.swaps(pid), { day: n, ex: itemAt(bi, i).ex, to, ...(onward ? { onward: true } : {}) }]);
        },
        swapBehind: (bi, i) => S.swapBehind(store.swaps(pid), n, itemAt(bi, i).ex),
        undo(bi, i) { store.setSwaps(pid, S.undoSwap(store.swaps(pid), n, itemAt(bi, i).ex)); },
      };
    }
    return { open, resolved };
  }

  const api = { createDays };
  /* node:coverage ignore next 3 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBDay = api;
})(typeof window !== 'undefined' ? window : globalThis, typeof module !== 'undefined' && module.exports ? require('./swaps.js') : window.KBSwaps,
  typeof module !== 'undefined' && module.exports ? require('./progress.js') : window.KBProgress);
