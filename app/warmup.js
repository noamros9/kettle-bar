/* Warm-up that matches the format (Phase 7, #67.8): the warm-up a day shows, picked when it opens. Pure: runs in Node
   and in the page (KBWarmup).

     kindOf(day, EX, subject?) -> 'dynamic' | 'gentle' | null
       the program's subject first: Boxing, Kickboxing, HIIT, Plyometrics, Running prep, Court & field sports -> dynamic;
       Yoga, Pilates, Flexibility, Mobility & posture, Gentle / low impact, Back care -> gentle. Otherwise (your own
       programs, random workouts) the moves: any boxing or kickboxing move, or mostly cardio (abs aside) -> dynamic; every move yoga, Pilates, flexibility, mobility or a stretch ->
       gentle; anything else (strength, mixed days) -> null: its own warm-up stays
     warmupFor(day, EX, subject?) -> the warm-up to show: the day's own (the same object) for null, else moves from DYNAMIC (a
       combat day starts with shadow footwork) or GENTLE, taken in turn from a place set by the day number, 30 s each
       (15 s a side for one-side moves), filling exactly the day's own warm-up seconds, so stretching minutes never change.
     DYNAMIC, GENTLE
   Stored days keep their warm-ups (the pins hash them); this only changes what the day page shows. */
(function (root) {
  const DYNAMIC = ['shadow_footwork', 'jumping_jacks', 'high_knees', 'arm_circles', 'lateral_shuffle'];
  const GENTLE = ['cat_cow', 'seated_twist', 'childs_pose', 'supine_twist'];
  const COMBAT = ['boxing', 'kick'], CALM = ['yoga', 'pilates', 'flex', 'mobility', 'cooldown'];
  const SUBJECTS = { Boxing: 'dynamic', Kickboxing: 'dynamic', HIIT: 'dynamic', Plyometrics: 'dynamic', 'Running prep': 'dynamic', 'Court & field sports': 'dynamic', Yoga: 'gentle', Pilates: 'gentle', Flexibility: 'gentle', 'Mobility & posture': 'gentle', 'Gentle / low impact': 'gentle', 'Back care': 'gentle' };

  function kindOf(day, EX, subject) {
    if (SUBJECTS[subject]) return SUBJECTS[subject];
    const cats = day.blocks.filter((b) => b.kind !== 'abs').flatMap((b) => b.items.map((it) => EX[it.ex].cat)).filter((c) => c !== 'abs');
    if (cats.some((c) => COMBAT.includes(c))) return 'dynamic';
    if (cats.filter((c) => c === 'cardio').length * 2 > cats.length) return 'dynamic';
    if (cats.every((c) => CALM.includes(c))) return 'gentle';
    return null;
  }

  function warmupFor(day, EX, subject) {
    const kind = day.warmup ? kindOf(day, EX, subject) : null;
    if (!kind) return day.warmup;
    const pool = kind === 'gentle' ? GENTLE : DYNAMIC;
    const combat = kind === 'dynamic' && day.blocks.some((b) => b.items.some((it) => COMBAT.includes(EX[it.ex].cat)));
    const rest = combat ? pool.slice(1) : pool, start = (day.day - 1) % rest.length;
    const order = [...(combat ? [pool[0]] : []), ...rest.slice(start), ...rest.slice(0, start)];
    const items = [];
    let left = day.warmup.seconds;
    for (const ex of order) {
      if (left <= 0) break;
      const side = !!EX[ex].side, full = 30;
      if (left < full && side) continue; // a one-side move can't be cut to an odd length: a two-sided one takes the rest
      const n = Math.min(left, full) / (side ? 2 : 1);
      items.push({ ex, n });
      left -= n * (side ? 2 : 1);
    }
    if (left > 0) { // more time than moves: the last two-sided move runs longer
      const last = [...items].reverse().find((it) => !EX[it.ex].side);
      last.n += left;
    }
    return { ...day.warmup, items };
  }

  const api = { kindOf, warmupFor, DYNAMIC, GENTLE };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBWarmup = api;
})(typeof window !== 'undefined' ? window : globalThis);
