/* Program length and levels, in one place (architecture review IV, ticket 4). Pure: runs in Node and in the page.
     DAYS                      60: a program's length when its config doesn't say (every program so far)
     dayCountOf(p)             the length of a config ({ days: 30 }), a built program (its days) or a summary (dayCount)
     levelOf(dayCount, day)    1-3: a program's days split in thirds. 60 days: 1-20, 21-40, 41-60; 30 days: 1-10, 11-20, 21-30
     levelStarts(dayCount)     the first day of each level: 60 -> [1, 21, 41], 30 -> [1, 11, 21]
     levelRanges(dayCount)     in words: "I days 1–20, II days 21–40, III days 41–60" */
(function (root) {
  const DAYS = 60;
  const dayCountOf = (p) => (Array.isArray(p.days) ? p.days.length : p.dayCount || p.days || DAYS);
  const levelOf = (dayCount, day) => (day <= dayCount / 3 ? 1 : day <= (2 * dayCount) / 3 ? 2 : 3);
  const levelStarts = (dayCount) => [1, Math.floor(dayCount / 3) + 1, Math.floor((2 * dayCount) / 3) + 1];
  function levelRanges(dayCount) {
    const s = levelStarts(dayCount), ends = [s[1] - 1, s[2] - 1, dayCount];
    return ['I', 'II', 'III'].map((l, i) => `${l} days ${s[i]}–${ends[i]}`).join(', ');
  }

  const api = { DAYS, dayCountOf, levelOf, levelStarts, levelRanges };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBLength = api;
})(typeof window !== 'undefined' ? window : globalThis);
