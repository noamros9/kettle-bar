/* Library filters: what the programs page shows for the family, subject, length and equipment picked.
     libraryView(summaries, filters, { families, lengthOf, prefs, opened?, keep? }) ->
       { families: [{ key, name, count, pressed }],   All first, then each family that has programs
         subjects: [{ key, name, count, pressed }],   All first, then the picked family's subjects that have programs
         lengths:  [{ key, label, pressed }], lengthLabel,
         equips:   [{ key, label, pressed }], equipLabel,
         shelves:  [{ subject, programs, total, more }], what is shown, in family order. A shelf shows its first SHELF (6)
                                                      programs plus any in `keep` (ones you started), in place; `more`
                                                      are left out. A subject in `opened`, or the picked subject, shows all
         count, total,                                shown / in the picked family or subject (length ignored)
         counter,                                     the page's eyebrow: "Yoga · 2 of 5 programs"
         unknown,                                     subjects that no family lists (the page logs them)
         favourites: [program],                       prefs.favourites still in the library, in library order; filters ignored
         hidden: [subject] }                          prefs.hidden: these subjects show nowhere (chips, shelves, counts)
   A hidden subject or a family left empty that is picked falls back to All. A starred program stays a favourite even when
   its subject is hidden (the star is the more specific choice).
   Chip counts ignore the length, so choosing a length narrows the shelves but not the chips. The equipment is the gear you
   have, as in the recipes: "Kettlebell only" keeps kettlebell and no-equipment programs, "No equipment" only no-equipment
   ones (a program with no tag needs all the gear). Counts and the total follow it. A picked family or subject it leaves
   empty falls back to All.
   setFilter(filters, key, value) -> new filters; a family change resets the subject.
   subjectsOf(summaries, families) -> [[family, [subject]]], the subjects that have programs (the Hidden subjects setting).
   toggleIn(list, value) -> a new list with value added, or removed if it was there (stars and hidden subjects).
   searchPrograms(summaries, query) -> the programs whose name, subject, split or first sentence hold every word of the
     query, case and accents ignored, in the order given (Phase 15: the name search on Programs); no words: all of them.
   skipped(prefs, EX) -> the exercises I skip (Phase 13): prefs.skip's ids this app knows, once each, in the order skipped.
   Pure: the page only renders what this returns. */
(function (root) {
  // Families group the subjects; chips and shelves follow this order. Subjects listed before they have programs
  // just don't show. A program whose subject is missing here is an error (the UI tests fail on it), never dropped quietly.
  const FAMILIES = [
    ['Strength', ['Signature', 'Strength', 'Pull-ups', 'Legs & glutes', 'Kettlebell only', 'Bodyweight', 'Busy week', 'Grip & forearms', 'Kettlebell complexes', 'Climber / pull strength', 'Chest', 'Back', 'Shoulders', 'Arms', 'Hips & adductors', 'Calves & lower legs', 'Neck & traps']],
    ['Cardio & combat', ['Conditioning', 'HIIT', 'Plyometrics', 'Boxing', 'Kickboxing', 'Running prep', 'Court & field sports']],
    ['Mind & body', ['Core & abs', 'Mobility & posture', 'Yoga', 'Pilates', 'Flexibility', 'Balance & stability', 'Gentle / low impact', 'Back care']],
    ['Mixed', ['Strength & stretch', 'Fighter', 'Athlete', 'Balanced week', 'Calm strength', 'Variety', 'Beach body', 'Bedroom stamina', 'Sex positions', 'Couples', 'Endurance & control', 'Hip power & thrust', 'Carry & hold', 'Flexible & bendy']],
  ];
  // Shelf groups (Phase 17): the Programs page tabs, finer than the four families. Every family subject sits in exactly
  // one group. Stats, build your own and random workouts keep FAMILIES.
  const SHELVES = [
    ['Strength', ['Signature', 'Strength', 'Busy week', 'Bodyweight', 'Kettlebell only', 'Kettlebell complexes', 'Pull-ups', 'Climber / pull strength']],
    ['Muscles', ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs & glutes', 'Hips & adductors', 'Calves & lower legs', 'Neck & traps', 'Core & abs', 'Grip & forearms']],
    ['Cardio', ['Conditioning', 'HIIT', 'Plyometrics', 'Running prep', 'Court & field sports']],
    ['Combat', ['Boxing', 'Kickboxing', 'Fighter']],
    ['Yoga & Pilates', ['Yoga', 'Pilates']],
    ['Mobility & care', ['Mobility & posture', 'Flexibility', 'Balance & stability', 'Gentle / low impact', 'Back care']],
    ['Mixed', ['Strength & stretch', 'Athlete', 'Balanced week', 'Calm strength']],
    ['Variety', ['Variety']],
    ['After dark', ['Beach body', 'Bedroom stamina', 'Sex positions', 'Couples', 'Endurance & control', 'Hip power & thrust', 'Carry & hold', 'Flexible & bendy']],
  ];
  const LENGTHS = [['all', 'Any length'], ['short', 'Up to 25 min'], ['mid', '26–32 min'], ['long', '33 min +']];
  const EQUIPS = [['all', 'Any equipment'], ['kb', 'Kettlebell only'], ['bw', 'No equipment']];
  const FITS = { all: ['all', 'kb', 'bw'], kb: ['kb', 'bw'], bw: ['bw'] };
  const fitsGear = (p, have = 'all') => FITS[have].includes(p.equip || 'all');
  const lengthOf = (p) => { const m = (p.minutes[0] + p.minutes[1]) / 2; return m <= 25.5 ? 'short' : m <= 32.5 ? 'mid' : 'long'; };

  function setFilter(filters, k, v) {
    const next = { ...filters, [k]: v };
    if (k === 'family') next.subject = 'all'; // a subject belongs to one family
    return next;
  }

  const plural = (n) => `${n} program${n === 1 ? '' : 's'}`;
  function counterText(scope, count, total) {
    const n = count === total ? plural(total) : `${count} of ${plural(total)}`;
    return scope === 'All' ? n : `${scope} · ${n}`;
  }

  const toggleIn = (list = [], v) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const skipped = (prefs, EX) => [...new Set(prefs && Array.isArray(prefs.skip) ? prefs.skip.filter((id) => typeof id === 'string' && Object.prototype.hasOwnProperty.call(EX, id)) : [])];
  const hasPrograms = (summaries, s) => summaries.some((p) => p.subject === s);
  const subjectsOf = (summaries, families) => families.map(([name, list]) => [name, list.filter((s) => hasPrograms(summaries, s))]).filter(([, l]) => l.length);

  const fold = (t) => String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  function searchPrograms(summaries, query) {
    const words = typeof query === 'string' ? fold(query).split(/\s+/).filter(Boolean) : [];
    if (!words.length) return summaries;
    return summaries.filter((p) => { const text = fold([p.name, p.subject, p.split, p.about].join(' ')); return words.every((w) => text.includes(w)); });
  }
  const SHELF = 6;
  function libraryView(summaries, asked, { families, lengthOf: lenOf, prefs = {}, opened = [], keep = [] }) {
    const known = new Set(families.flatMap(([, list]) => list));
    const unknown = [...new Set(summaries.map((p) => p.subject))].filter((s) => !known.has(s));
    const hidden = prefs.hidden || [], stars = prefs.favourites || [];
    const favourites = summaries.filter((p) => stars.includes(p.id));
    const pool = summaries.filter((p) => fitsGear(p, asked.equip));
    const countOf = (list) => pool.filter((p) => list.includes(p.subject)).length;
    const withPrograms = (list) => list.filter((s) => !hidden.includes(s) && countOf([s]) > 0);

    const present = families.map(([name, list]) => ({ name, list: withPrograms(list) })).filter((f) => f.list.length);
    const famOk = asked.family === 'all' || present.some((f) => f.name === asked.family);
    const family = famOk ? asked.family : 'all';
    const subjOk = present.some((f) => (family === 'all' || f.name === family) && f.list.includes(asked.subject));
    const filters = { equip: 'all', ...asked, family, subject: subjOk ? asked.subject : 'all' };
    const inFamily = present.filter((f) => filters.family === 'all' || f.name === filters.family);
    const subjectNames = inFamily.flatMap((f) => f.list);
    const pick = (key, name, count, chosen) => ({ key, name, count, pressed: chosen === key });

    const familyChips = [pick('all', 'All', countOf(present.flatMap((f) => f.list)), filters.family), ...present.map((f) => pick(f.name, f.name, countOf(f.list), filters.family))];
    const subjectChips = [pick('all', 'All', countOf(subjectNames), filters.subject), ...subjectNames.map((s) => pick(s, s, countOf([s]), filters.subject))];

    const scoped = pool.filter((p) => subjectNames.includes(p.subject) && (filters.subject === 'all' || p.subject === filters.subject));
    const shownPrograms = scoped.filter((p) => filters.len === 'all' || lenOf(p) === filters.len);
    const shelves = subjectNames.map((subject) => {
      const all = shownPrograms.filter((p) => p.subject === subject), whole = filters.subject !== 'all' || opened.includes(subject);
      const programs = whole ? all : all.filter((p, i) => i < SHELF || keep.includes(p.id));
      return { subject, programs, total: all.length, more: all.length - programs.length };
    }).filter((s) => s.total);

    const lengths = LENGTHS.map(([key, label]) => ({ key, label, pressed: filters.len === key }));
    const chosenLength = lengths.find((l) => l.pressed);
    const equips = EQUIPS.map(([key, label]) => ({ key, label, pressed: filters.equip === key }));
    const scope = filters.subject !== 'all' ? filters.subject : filters.family;
    return {
      families: familyChips, subjects: subjectChips, lengths, lengthLabel: chosenLength.key === 'all' ? 'Any' : chosenLength.label,
      equips, equipLabel: filters.equip === 'all' ? 'Any' : equips.find((e) => e.pressed).label,
      shelves, count: shownPrograms.length, total: scoped.length,
      counter: counterText(scope === 'all' ? 'All' : scope, shownPrograms.length, scoped.length), unknown, favourites, hidden,
    };
  }

  /* The Exercises page (Phase 8 ticket 3): searchExercises(EX, query, { cat, gear }, { names, cats? }) ->
       { list: [exercise], count, total, cats: [{ key, count, pressed }] }
     filters.muscles (Phase 9): only exercises working a picked muscle, in byMuscles order. The query matches the name, the muscles (their names) and the cue, every word somewhere, ignoring case. Name matches
     come first, then the rest, each in catalogue order. Gear is what the exercise uses (gearOf): a kettlebell, dumbbells,
     the pull-up bar, or nothing. Category chips count what the query and gear leave (All first, then each category in
     `cats` order, else as they first appear, only those with exercises); a picked category with none falls back to All. */
  /* byMuscles(list, picked) (Phase 9): the exercises working any picked muscle, those working more of them first, then
     by weight (main 1, secondary ½), then list order; nothing picked -> the list as it is. */
  function byMuscles(list, picked) {
    if (!picked.length) return list;
    const w = (e, m) => (e.muscles.primary.includes(m) ? 1 : e.muscles.secondary.includes(m) ? 0.5 : 0);
    return list.map((e, i) => ({ e, i, n: picked.filter((m) => w(e, m) > 0).length, s: picked.reduce((a, m) => a + w(e, m), 0) }))
      .filter((x) => x.n > 0).sort((a, b) => b.n - a.n || b.s - a.s || a.i - b.i).map((x) => x.e);
  }
  // splitByMuscles(list, picked) (2 Oct): the exercises for the picked muscles in two lists, each in byMuscles order:
  // main (a picked muscle is one of its main muscles) and also (picked muscles only among its secondary ones)
  function splitByMuscles(list, picked) {
    const ranked = picked.length ? byMuscles(list, picked) : [];
    const isMain = (e) => picked.some((m) => e.muscles.primary.includes(m));
    return { main: ranked.filter(isMain), also: ranked.filter((e) => !isMain(e)) };
  }
  /* rankPrograms(focus, picked, n?) (Phase 9): program ids from { pid: { muscle: share } } (insertion order) that train a
     picked muscle: those with all of them first, then the sum of their shares, then the order given; at most n. */
  function rankPrograms(focus, picked, n = Infinity) {
    if (!picked.length) return [];
    return Object.entries(focus).map(([pid, f], i) => ({ pid, i, k: picked.filter((m) => f[m] > 0).length, s: picked.reduce((a, m) => a + (f[m] || 0), 0) }))
      .filter((x) => x.k > 0).sort((a, b) => b.k - a.k || b.s - a.s || a.i - b.i).slice(0, n).map((x) => x.pid);
  }
  const GEAR = [['all', 'Any equipment'], ['kb', 'Kettlebell'], ['db', 'Dumbbells'], ['bar', 'Pull-up bar'], ['none', 'No equipment']];
  const gearOf = (e) => (e.load === 'kb' ? 'kb' : e.load ? 'db' : (e.equip || []).includes('bar') ? 'bar' : 'none');
  function searchExercises(EX, query, filters, { names, cats: order } = {}) {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const all = Object.values(EX);
    const text = (e) => [e.name, e.cue, ...[...e.muscles.primary, ...e.muscles.secondary].map((m) => names[m])].join(' ').toLowerCase();
    const hits = byMuscles(all.filter((e) => (filters.gear === 'all' || gearOf(e) === filters.gear) && words.every((w) => text(e).includes(w))), filters.muscles || []);
    const inName = (e) => words.length > 0 && words.every((w) => e.name.toLowerCase().includes(w));
    const keys = order || [...new Set(all.map((e) => e.cat))];
    const counts = keys.map((key) => ({ key, count: hits.filter((e) => e.cat === key).length })).filter((c) => c.count);
    const cat = counts.some((c) => c.key === filters.cat) ? filters.cat : 'all';
    const shown = hits.filter((e) => cat === 'all' || e.cat === cat);
    const list = filters.muscles && filters.muscles.length ? shown : [...shown.filter(inName), ...shown.filter((e) => !inName(e))]; // picked muscles: their order
    const cats = [{ key: 'all', count: hits.length }, ...counts].map((c) => ({ ...c, pressed: c.key === cat }));
    return { list, count: list.length, total: all.length, cats };
  }

  // What next: up to three library programs of the family of `pid`'s first subject (a mix: its first subject) that train
  // differently and have no progress (progressOf(id) > 0 means started). A different subject comes first, then more formats
  // the program doesn't use, then library order. The same subject only counts when it brings a new format.
  function suggestNext(pid, summaries, progressOf, { families }) {
    const me = summaries.find((p) => p.id === pid);
    const fam = me && families.find(([, list]) => list.includes(me.mix ? me.mix[0] : me.subject));
    if (!fam) return [];
    const mine = me.formats, fresh = (p) => p.formats.filter((f) => !mine.includes(f)).length;
    const subj = me.mix ? me.mix[0] : me.subject;
    return summaries.map((p, i) => ({ p, i, same: p.subject === subj, n: fresh(p) }))
      .filter(({ p, same, n }) => p.source !== 'own' && p.id !== pid && fam[1].includes(p.subject) && !progressOf(p.id) && (!same || n))
      .sort((a, b) => a.same - b.same || b.n - a.n || a.i - b.i)
      .slice(0, 3).map(({ p }) => p.id);
  }

  const api = { SHELF, searchPrograms, suggestNext, libraryView, searchExercises, byMuscles, splitByMuscles, rankPrograms, gearOf, GEAR, subjectsOf, toggleIn, skipped, setFilter, counterText, lengthOf, FAMILIES, SHELVES, LENGTHS, EQUIPS };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBLibrary = api;
})(typeof window !== 'undefined' ? window : globalThis);
