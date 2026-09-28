/* Workout Session: progress through one day's workout, and every rule about what comes next.
   Pure: no page, no timer. The page and the clock are adapters.

     const s = createSession(program, day, { EX });
     s.complete(target) -> Instruction      a set/pair/round/block/hold/stretch was finished (or un-ticked)
     s.plan(target)     -> { phases, then }  the timer script for a hold, a timed block or the stretches;
                                             when it ends, call s.complete(then)
     s.count(bi, delta)                     AMRAP rounds / ladder rungs counter
     s.state(bi), s.blockDone(bi), s.allDone(), s.stretchDone(key)

   Targets: { type: 'set', bi, i, k } · { type: 'pair', bi, pi, k } · { type: 'round', bi, k }
            { type: 'hold', bi, i } · { type: 'block', bi } · { type: 'stretch', key: 'warm' | 'cool' }
   Instruction: { rest: { sec, label, sub } } · { clear: { label, sub } } · { none: true }
   Plan phases: { sec, label, sub, end: 'short'|'long', work?, say?, halfway?, sayEnd? }. Voice cues, for holds and
   sides only: say when the phase starts, "Halfway" in the middle, sayEnd when it ends. */
(function (root) {
  const DEFAULT_RESTS = { set: 30, exercise: 60, beforeAbs: 120, superset: 45, round: 60, block: 60 };
  const LETTERS = 'ABCDEF';
  const FORMAT_NAMES = { straight: 'Straight sets', superset: 'Supersets', circuit: 'Circuits', emom: 'EMOM', amrap: 'AMRAP', tabata: 'Tabata', ladder: 'Ladders' };

  function unitText(e) {
    if (e.u === 'sec') return e.side ? 'sec each side' : 'seconds';
    if (e.side) return 'each side';
    if (e.alt) return 'total, alternating';
    return 'reps';
  }

  function createSession(program, day, { EX }) {
    const R = Object.assign({}, DEFAULT_RESTS, program.rests || {});
    const blocks = day.blocks;
    const fmt = (b) => b.format || 'straight';
    const itemSets = (b, it) => it.sets || b.sets;
    const nm = (it) => EX[it.ex].name;
    const pairsOf = (b) => Math.ceil(b.items.length / 2);
    const pairNames = (b, pi) => b.items.slice(pi * 2, pi * 2 + 2).map(nm).join(' + ');
    const state = blocks.map((b) => {
      const f = fmt(b);
      if (f === 'straight') return { f, sets: b.items.map(() => 0) };
      if (f === 'superset') return { f, sets: Array.from({ length: pairsOf(b) }, () => 0) };
      if (f === 'circuit') return { f, rounds: 0 };
      return { f, done: false, count: 0 };
    });
    const stretched = { warm: false, cool: false };

    function blockDone(bi) {
      const b = blocks[bi], s = state[bi];
      if (s.f === 'straight') return b.items.every((it, i) => s.sets[i] >= itemSets(b, it));
      if (s.f === 'superset') return s.sets.every((k) => k >= b.sets);
      if (s.f === 'circuit') return s.rounds >= b.rounds;
      return s.done;
    }
    // rest after a whole block: 1 min to the next block, 2 min before the abs, nothing after the last
    function afterBlock(bi) {
      const next = blocks[bi + 1];
      if (next) return { rest: { sec: next.kind === 'abs' ? R.beforeAbs : R.block, label: `Rest · ${next.kind === 'abs' ? 'abs' : next.title.toLowerCase()} next`, sub: `First: ${nm(next.items[0])}` } };
      return { clear: { label: 'Workout finished', sub: day.cooldown ? 'Time for the cool-down stretches' : 'Every set is done' } };
    }
    function afterSet(bi, i, k) {
      const b = blocks[bi], it = b.items[i], sets = itemSets(b, it);
      if (k < sets) return { rest: { sec: R.set, label: `Rest · set ${k + 1} of ${sets} next`, sub: nm(it) } };
      if (i < b.items.length - 1) {
        const nx = b.items[i + 1];
        return { rest: { sec: R.exercise, label: `Rest · next: ${nm(nx)}`, sub: `${nx.n} ${unitText(EX[nx.ex])} × ${itemSets(b, nx)} sets` } };
      }
      return afterBlock(bi);
    }
    // tapping the number of the set just done ticks it; tapping it again un-ticks it
    const toggle = (cur, k) => (cur === k ? k - 1 : k);

    function complete(t) {
      const b = blocks[t.bi], s = state[t.bi];
      switch (t.type) {
        case 'set': {
          s.sets[t.i] = toggle(s.sets[t.i], t.k);
          return s.sets[t.i] >= t.k ? afterSet(t.bi, t.i, t.k) : { none: true };
        }
        case 'hold': {
          s.sets[t.i] = Math.max(s.sets[t.i], t.k);
          return afterSet(t.bi, t.i, t.k);
        }
        case 'pair': {
          s.sets[t.pi] = toggle(s.sets[t.pi], t.k);
          if (s.sets[t.pi] < t.k) return { none: true };
          if (t.k < b.sets) return { rest: { sec: R.superset, label: `Rest · pair ${LETTERS[t.pi]}, round ${t.k + 1} of ${b.sets} next`, sub: pairNames(b, t.pi) } };
          if (t.pi < pairsOf(b) - 1) return { rest: { sec: R.exercise, label: `Rest · pair ${LETTERS[t.pi + 1]} next`, sub: pairNames(b, t.pi + 1) } };
          return afterBlock(t.bi);
        }
        case 'round': {
          s.rounds = toggle(s.rounds, t.k);
          if (s.rounds < t.k) return { none: true };
          if (t.k < b.rounds) return { rest: { sec: R.round, label: `Rest · round ${t.k + 1} of ${b.rounds} next`, sub: b.title } };
          return afterBlock(t.bi);
        }
        case 'block': s.done = true; return afterBlock(t.bi);
        case 'stretch': {
          stretched[t.key] = true;
          return { clear: t.key === 'warm' ? { label: 'Warm-up done', sub: 'Start the first exercise' } : { label: 'Cool-down done', sub: 'Workout complete' } };
        }
        default: throw new Error('Unknown target ' + t.type);
      }
    }

    function plan(t) {
      if (t.type === 'hold') {
        const b = blocks[t.bi], it = b.items[t.i], e = EX[it.ex], sets = itemSets(b, it);
        const k = state[t.bi].sets[t.i] + 1; if (k > sets) return null;
        const sub = `Set ${k} of ${sets}`;
        const phases = [{ sec: 3, label: `Get ready · ${e.name}`, sub, end: 'short' }];
        if (e.side) phases.push(
          { sec: it.n, label: `${e.name} · first side`, sub, end: 'long', work: 1, halfway: true },
          { sec: 5, label: 'Switch sides', sub, end: 'short', say: 'Switch sides' },
          { sec: it.n, label: `${e.name} · second side`, sub, end: 'long', work: 1, halfway: true, sayEnd: 'Done' });
        else phases.push({ sec: it.n, label: e.name, sub, end: 'long', work: 1, halfway: true, sayEnd: 'Done' });
        return { phases, then: { type: 'hold', bi: t.bi, i: t.i, k } };
      }
      if (t.type === 'stretch') {
        const sb = t.key === 'warm' ? day.warmup : day.cooldown;
        const phases = [];
        sb.items.forEach((it, i) => {
          const e = EX[it.ex], sub = `${sb.title} · ${i + 1} of ${sb.items.length}`, last = i === sb.items.length - 1;
          phases.push({ sec: 3, label: `${i ? 'Next' : 'Get ready'} · ${e.name}`, sub, end: 'short' });
          const half = it.n >= 20 ? { halfway: true } : {}, done = last ? { sayEnd: 'Done' } : {};
          if (e.side) phases.push(
            { sec: it.n, label: `${e.name} · first side`, sub, end: 'short', work: 1, ...half },
            { sec: 3, label: 'Switch sides', sub, end: 'short', say: 'Switch sides' },
            { sec: it.n, label: `${e.name} · second side`, sub, end: last ? 'long' : 'short', work: 1, ...half, ...done });
          else phases.push({ sec: it.n, label: e.name, sub, end: last ? 'long' : 'short', work: 1, ...half, ...done });
        });
        return { phases, then: { type: 'stretch', key: t.key } };
      }
      if (t.type === 'block') {
        const b = blocks[t.bi], f = fmt(b);
        const phases = [{ sec: 3, label: `Get ready · ${b.title}`, sub: FORMAT_NAMES[f], end: 'short' }];
        if (f === 'emom') {
          for (let m = 1; m <= b.minutes; m++) {
            const it = b.items[(m - 1) % b.items.length], e = EX[it.ex];
            phases.push({ sec: 60, label: `Min ${m}/${b.minutes} · ${nm(it)} × ${it.n}${e.u === 'sec' ? ' s' : ''}${e.side ? ' each side' : ''}`, sub: 'Do the reps, rest until the beep', end: m < b.minutes ? 'short' : 'long', work: 1 });
          }
        } else if (f === 'tabata') {
          for (let tb = 0; tb < b.tabatas; tb++) {
            for (let r = 0; r < 8; r++) {
              const it = b.items[(tb * 8 + r) % b.items.length], nx = b.items[(tb * 8 + r + 1) % b.items.length];
              phases.push({ sec: 20, label: `${nm(it)} · go hard`, sub: `Tabata ${tb + 1}/${b.tabatas} · round ${r + 1}/8`, end: 'short', work: 1 });
              if (r < 7) phases.push({ sec: 10, label: `Rest · next ${nm(nx)}`, sub: `Tabata ${tb + 1}/${b.tabatas}`, end: 'short' });
            }
            if (tb < b.tabatas - 1) phases.push({ sec: R.block, label: 'Rest · next Tabata', sub: `${b.tabatas - tb - 1} to go`, end: 'short' });
          }
          phases[phases.length - 1].end = 'long';
        } else if (f === 'amrap' || f === 'ladder') {
          phases.push({ sec: b.minutes * 60, label: f === 'amrap' ? `AMRAP · ${b.items.map(nm).join(' → ')}` : `Ladder · ${b.items.map(nm).join(' + ')}`, sub: f === 'amrap' ? 'Tap + after each round' : '1 rep, then 2, then 3… tap + after each rung', end: 'long', work: 1 });
        } else return null;
        return { phases, then: { type: 'block', bi: t.bi } };
      }
      return null;
    }

    return {
      rests: R, itemSets, pairsOf, complete, plan,
      state: (bi) => state[bi],
      blockDone,
      allDone: () => blocks.every((_, bi) => blockDone(bi)),
      stretchDone: (key) => stretched[key],
      count(bi, delta) { const s = state[bi]; s.count = Math.max(0, s.count + delta); return s.count; },
    };
  }

  const api = { createSession, unitText, FORMAT_NAMES, DEFAULT_RESTS };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBSession = api;
})(typeof window !== 'undefined' ? window : globalThis);
