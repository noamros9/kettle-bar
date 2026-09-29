/* Library filters: what the programs page shows for the family, subject and length picked.
     libraryView(summaries, filters, { families, lengthOf }) ->
       { families: [{ key, name, count, pressed }],   All first, then each family that has programs
         subjects: [{ key, name, count, pressed }],   All first, then the picked family's subjects that have programs
         lengths:  [{ key, label, pressed }], lengthLabel,
         shelves:  [{ subject, programs }],           what is shown, in family order
         count, total,                                shown / in the picked family or subject (length ignored)
         counter,                                     the page's eyebrow: "Yoga · 2 of 5 programs"
         unknown }                                    subjects that no family lists (the page logs them)
   Chip counts ignore the length, so choosing a length narrows the shelves but not the chips.
   setFilter(filters, key, value) -> new filters; a family change resets the subject.
   Pure: the page only renders what this returns. */
(function (root) {
  // Families group the subjects; chips and shelves follow this order. Subjects listed before they have programs
  // just don't show. A program whose subject is missing here is an error (the UI tests fail on it), never dropped quietly.
  const FAMILIES = [
    ['Strength', ['Signature', 'Strength', 'Pull-ups', 'Legs & glutes', 'Kettlebell only', 'Bodyweight', 'Busy week']],
    ['Cardio & combat', ['Conditioning', 'HIIT', 'Plyometrics', 'Boxing', 'Kickboxing']],
    ['Mind & body', ['Core & abs', 'Mobility & posture', 'Yoga', 'Pilates', 'Flexibility', 'Balance & stability']],
    ['Mixed', ['Strength & stretch', 'Fighter', 'Athlete', 'Balanced week', 'Calm strength']],
  ];
  const LENGTHS = [['all', 'Any length'], ['short', 'Up to 25 min'], ['mid', '26–32 min'], ['long', '33 min +']];
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

  function libraryView(summaries, filters, { families, lengthOf: lenOf }) {
    const known = new Set(families.flatMap(([, list]) => list));
    const unknown = [...new Set(summaries.map((p) => p.subject))].filter((s) => !known.has(s));
    const countOf = (list) => summaries.filter((p) => list.includes(p.subject)).length;
    const withPrograms = (list) => list.filter((s) => countOf([s]) > 0);

    const present = families.map(([name, list]) => ({ name, list: withPrograms(list) })).filter((f) => f.list.length);
    const inFamily = present.filter((f) => filters.family === 'all' || f.name === filters.family);
    const subjectNames = inFamily.flatMap((f) => f.list);
    const pick = (key, name, count, chosen) => ({ key, name, count, pressed: chosen === key });

    const familyChips = [pick('all', 'All', countOf(present.flatMap((f) => f.list)), filters.family), ...present.map((f) => pick(f.name, f.name, countOf(f.list), filters.family))];
    const subjectChips = [pick('all', 'All', countOf(subjectNames), filters.subject), ...subjectNames.map((s) => pick(s, s, countOf([s]), filters.subject))];

    const scoped = summaries.filter((p) => subjectNames.includes(p.subject) && (filters.subject === 'all' || p.subject === filters.subject));
    const shownPrograms = scoped.filter((p) => filters.len === 'all' || lenOf(p) === filters.len);
    const shelves = subjectNames.map((subject) => ({ subject, programs: shownPrograms.filter((p) => p.subject === subject) })).filter((s) => s.programs.length);

    const lengths = LENGTHS.map(([key, label]) => ({ key, label, pressed: filters.len === key }));
    const chosenLength = lengths.find((l) => l.pressed);
    const scope = filters.subject !== 'all' ? filters.subject : filters.family;
    return {
      families: familyChips, subjects: subjectChips, lengths, lengthLabel: chosenLength.key === 'all' ? 'Any' : chosenLength.label,
      shelves, count: shownPrograms.length, total: scoped.length,
      counter: counterText(scope === 'all' ? 'All' : scope, shownPrograms.length, scoped.length), unknown,
    };
  }

  const api = { libraryView, setFilter, counterText, lengthOf, FAMILIES, LENGTHS };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBLibrary = api;
})(typeof window !== 'undefined' ? window : globalThis);
