/* The Program finder (Phase 15): what the finder knows of a program, the limits a question sets, why a result fits,
   and ranking. Pure: runs in Node (the build writes data/finder.json) and in the page (KBFinder).
     limits(query) -> { minutes: [lo, hi] | null, gear: 'bw' | 'kb' | null, days: 30 | 60 | null }
       read with plain rules, not the model: "20 minutes" (±3), "20-30 min", "under 25", "half an hour", "short",
       "no gear", "bodyweight", "a kettlebell", "a month", "60 days". Dumbbells or a bar mean all gear: no limit.
     fits(program, limits)       its minutes overlap, the gear is what you have (a kettlebell takes no-equipment
                                 programs too), the length matches; a summary or a built program
     why(program, query)         the why line: "Back care · 18–23 min · no equipment · matches “back”"
     textOf(program, { focus?, names? }) -> the finder text: name, subject, split, blurb, about, formats, main muscles
     rank(vectors, queryVector, programs, limits, n) -> [{ id, score, fits }]: the programs that fit first, closest
                                 meaning first; the rest after, so there is always an answer
     cosine(a, b)
     Help me pick (Phase 15 ticket 2): GOALS [[key, label, [subject]]] (every library subject once), MINUTES, GEAR
     pick(summaries, { goal, minutes, gear }, { started?, n? = 5 }) -> { list, loosened: null | 'minutes' | 'both' }:
       the goal's programs within the minutes and gear, the ones you have not started first, then library order; with
       none, the minutes are dropped, then the gear too (loosened says which), so it is never empty while the goal has any
     Ask the finder (Phase 15 ticket 5):
     quantize(unitVector) -> whole numbers -127..127 (data/finder-vectors.json, made in the deploy)
     track(files, progressEvent) / percent(files): the model download's progress over the files it reports (null: unknown)
     answer(ranked) -> { ids, fitting }: the programs that fit, at most 5; under 3, the closest others fill up to 3 */
(function (root) {
  const fold = (t) => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const around = (n) => [n - 3, n + 3];

  function minutesOf(q) {
    let m;
    if ((m = /(\d{1,3})\s*(?:-|–|to)\s*(\d{1,3})\s*(?:min|')/.exec(q))) return [+m[1], +m[2]];
    if ((m = /(?:under|less than|at most|no more than|max(?:imum)?)\s*(\d{1,3})/.exec(q))) return [0, +m[1]];
    if ((m = /(\d{1,3})\s*(?:min|')/.exec(q))) return around(+m[1]);
    if (/quarter of an hour/.test(q)) return around(15);
    if (/half an hour|half hour/.test(q)) return around(30);
    if (/\b(?:an|one) hour\b/.test(q)) return [50, 70];
    if (/\b(?:short|quick|fast|brief)\b/.test(q)) return [0, 25];
    if (/\blong\b/.test(q)) return [35, 90];
    return null;
  }
  function gearOf(q) {
    if (/\b(?:no|without) (?:gear|equipment|weights|kit)\b|\bbody ?weight\b|nothing at home/.test(q)) return 'bw';
    if (/kettle ?bell/.test(q)) return 'kb';
    return null;
  }
  function daysOf(q) {
    if (/\b(?:two|2) months\b|\b(?:60|sixty)[- ]?days?\b/.test(q)) return 60;
    if (/\b(?:a|one) month\b|\b(?:30|thirty)[- ]?days?\b|\b(?:four|4) weeks\b/.test(q)) return 30;
    return null;
  }
  function limits(query) {
    const q = fold(query);
    return { minutes: minutesOf(q), gear: gearOf(q), days: daysOf(q) };
  }

  const lengthOf = (p) => p.dayCount || (Array.isArray(p.days) ? p.days.length : 60);
  function fits(p, lim) {
    if (lim.minutes && !(p.minutes[1] >= lim.minutes[0] && p.minutes[0] <= lim.minutes[1])) return false;
    if (lim.gear === 'bw' && p.equip !== 'bw') return false;
    if (lim.gear === 'kb' && !['kb', 'bw'].includes(p.equip)) return false;
    if (lim.days && lengthOf(p) !== lim.days) return false;
    return true;
  }

  const GEAR_TEXT = { bw: 'no equipment', kb: 'kettlebell only', all: 'dumbbells & kettlebell' };
  // words that say nothing about a program's content: limits, and everyday words
  const QUIET = new Set(['minutes', 'minute', 'hour', 'hours', 'month', 'months', 'days', 'weeks', 'gear', 'equipment', 'weights',
    'with', 'without', 'for', 'some', 'something', 'that', 'this', 'want', 'like', 'just', 'please', 'workout', 'workouts', 'program',
    'programs', 'plan', 'session', 'sessions', 'short', 'quick', 'long', 'under', 'than', 'about', 'only', 'body', 'bodyweight', 'have']);
  function why(p, query) {
    const mins = Math.round(p.minutes[0]) === Math.round(p.minutes[1]) ? `${Math.round(p.minutes[0])} min` : `${Math.round(p.minutes[0])}–${Math.round(p.minutes[1])} min`;
    const parts = [p.subject, mins, GEAR_TEXT[p.equip || 'all']];
    if (lengthOf(p) === 30) parts.push('30 days');
    const text = fold([p.name, p.subject, p.split, p.about].join(' '));
    const words = [...new Set(fold(query).split(/[^a-z0-9]+/).filter((w) => w.length >= 4 && !QUIET.has(w) && !/^\d+$/.test(w) && text.includes(w)))].slice(0, 3);
    if (words.length) parts.push('matches ' + words.map((w) => `“${w}”`).join(', '));
    return parts.join(' · ');
  }

  const FORMAT_WORDS = { straight: 'straight sets', superset: 'supersets', circuit: 'circuits', emom: 'EMOMs', amrap: 'AMRAPs', tabata: 'Tabatas', ladder: 'ladders', flow: 'guided flows', bouts: 'boxing bouts' };
  const sentence = (t) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : t);
  function textOf(p, { focus = {}, names = {} } = {}) {
    const formats = (p.formats || []).map((f) => FORMAT_WORDS[f]).filter(Boolean).join(', ');
    const muscles = Object.entries(focus).filter(([, x]) => x >= 0.05).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([m]) => fold(names[m] || m));
    return [p.name, p.subject, p.split, p.blurb, p.about, sentence(formats), muscles.length ? `Works ${muscles.join(', ')}` : '']
      .filter(Boolean).map((t) => (/[.!?]$/.test(t) ? t : t + '.')).join(' ');
  }

  function cosine(a, b) {
    let d = 0, x = 0, y = 0;
    for (let i = 0; i < a.length; i++) { d += a[i] * b[i]; x += a[i] * a[i]; y += b[i] * b[i]; }
    return x && y ? d / Math.sqrt(x * y) : 0;
  }
  function rank(vectors, q, programs, lim, n) {
    return Object.entries(vectors).filter(([id]) => programs[id]).map(([id, v]) => ({ id, score: cosine(v, q), fits: fits(programs[id], lim) }))
      .sort((a, b) => (b.fits - a.fits) || (b.score - a.score)).slice(0, n);
  }

  const GOALS = [
    ['strength', 'Get stronger', ['Signature', 'Strength', 'Pull-ups', 'Legs & glutes', 'Kettlebell only', 'Bodyweight', 'Busy week', 'Grip & forearms', 'Kettlebell complexes', 'Climber / pull strength', 'Chest', 'Back', 'Shoulders', 'Arms', 'Hips & adductors', 'Calves & lower legs', 'Neck & traps', 'Beach body', 'Hip power & thrust', 'Carry & hold', 'Strip & show-off']],
    ['fitness', 'Fitness & cardio', ['Conditioning', 'HIIT', 'Plyometrics', 'Running prep', 'Court & field sports', 'Bedroom stamina', 'Endurance & control', 'Quickie']],
    ['fight', 'Fighting skills', ['Boxing', 'Kickboxing', 'Fighter']],
    ['flex', 'Flexibility & mobility', ['Yoga', 'Pilates', 'Flexibility', 'Mobility & posture', 'Sex positions', 'Flexible & bendy']],
    ['balance', 'Core, balance & sport', ['Core & abs', 'Balance & stability', 'Athlete']],
    ['gentle', 'Gentle, or a sore back', ['Gentle / low impact', 'Back care', 'Calm strength', 'Back & knees care']],
    ['mix', 'A bit of everything', ['Balanced week', 'Strength & stretch', 'Variety']],
    ['couple', 'For two, after dark', ['Couples', 'Her pleasure', 'Date night warm-up', 'Positions tour', 'Morning glory / Sunday']], // Phase 18: couples, and the solo training that's for her
  ];
  const MINUTES = [['15', 'About 15 min', [0, 18]], ['20', '20–25 min', [18, 26]], ['30', 'About 30 min', [26, 33]], ['35', '35 min or more', [33, 90]]];
  const GEAR = [['bw', 'No equipment'], ['kb', 'A kettlebell'], ['all', 'Dumbbells & kettlebell']];
  function pick(summaries, { goal, minutes, gear }, { started = [], n = 5 } = {}) {
    const subjects = (GOALS.find(([k]) => k === goal) || [, , []])[2];
    const mins = (MINUTES.find(([k]) => k === minutes) || [, , null])[2], g = gear === 'all' ? null : gear;
    const pool = summaries.filter((p) => subjects.includes(p.subject));
    const order = (list) => list.map((p, i) => ({ p, i })).sort((a, b) => (started.includes(a.p.id) - started.includes(b.p.id)) || a.i - b.i).map((x) => x.p).slice(0, n);
    const within = (lim) => pool.filter((p) => fits(p, { days: null, ...lim }));
    const exact = within({ minutes: mins, gear: g });
    if (exact.length) return { list: order(exact), loosened: null };
    const anyTime = within({ minutes: null, gear: g });
    if (anyTime.length) return { list: order(anyTime), loosened: 'minutes' };
    return { list: order(pool), loosened: 'both' };
  }

  // Ask the finder (Phase 15 ticket 5)
  const quantize = (v) => Array.from(v, (x) => Math.round(x * 127) || 0);
  const track = (files, ev) => (ev && ev.status === 'progress' ? { ...files, [ev.file]: { loaded: ev.loaded, total: ev.total } } : files);
  function percent(files) {
    const all = Object.values(files), total = all.reduce((s, f) => s + f.total, 0);
    return total ? Math.round((100 * all.reduce((s, f) => s + f.loaded, 0)) / total) : null;
  }
  function answer(ranked) {
    const fitting = ranked.filter((r) => r.fits), list = fitting.length >= 3 ? fitting.slice(0, 5) : [...fitting, ...ranked.filter((r) => !r.fits)].slice(0, 3);
    return { ids: list.map((r) => r.id), fitting: Math.min(fitting.length, 5) };
  }

  const api = { limits, fits, why, textOf, rank, cosine, GOALS, MINUTES, GEAR, pick, quantize, track, percent, answer };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBFinder = api;
})(typeof window !== 'undefined' ? window : globalThis);
