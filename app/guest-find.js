/* Finding a guest (Phase 35 ticket 3g7, decisions 435-439). Pure: runs in Node and in the page (KBGuestFind).
     find(guests, { q, kind, pick, sort })  q: words that must all be on her card (name, fields, hook, text); kind:
                                           'all' | 'woman' | 'man'; pick: { filter: [values] }, OR within a filter and
                                           AND across; sort: a SORTS key. Returns { list: names, counts: per tab }
     menus(guests, kind, pick)             the filters for that tab, each { key, label, values: [{ key, label, on }] }
     FILTERS, SORTS                        [key, label, who] and [key, label] */
(function (root) {
  const hairColour = (h) => h.replace(/^(very long|long|shoulder|pixie|short|curly) /, '').replace(/ \(dyed\)$|, (swept|tied) back$/, '');
  const band = (age) => { const lo = 21 + 5 * Math.floor((age - 21) / 5); return `${lo}-${lo + 4}`; };
  const FROM = { il: 'Israeli', us: 'American', uk: 'British', world: 'The world' };
  // [key, label, who ('woman' | 'man' | both), her values]
  const FILTERS = [
    ['body', 'Body', null, (g) => g.body], ['breasts', 'Tits', 'woman', (g) => g.breasts], ['ass', 'Ass', 'woman', (g) => g.ass],
    ['hair', 'Hair', null, (g) => hairColour(g.hair)], ['skin', 'Skin', null, (g) => g.skin], ['eyes', 'Eyes', 'woman', (g) => g.eyes],
    ['pussy', 'Pussy', 'woman', (g) => g.pussy], ['ink', 'Ink', 'woman', (g) => (g.ink ? 'inked' : 'none')],
    ['vibe', 'Vibe', 'woman', (g) => g.vibe], ['acts', 'Into', 'woman', (g) => g.acts], ['age', 'Age', null, (g) => band(g.age)],
    ['from', 'From', null, (g) => g.from], ['cock', 'Cock', 'man', (g) => g.cock],
  ];
  const SORTS = [['az', 'A-Z'], ['young', 'Youngest'], ['old', 'Oldest'], ['tall', 'Tallest'], ['short', 'Shortest']];
  // where a natural order exists, values follow it; the rest go A-Z
  const ORDER = { body: ['petite', 'slim', 'lean', 'athletic', 'muscular', 'curvy', 'thick', 'big', 'stocky'],
    breasts: ['small', 'medium', 'big', 'very big'], ass: ['small', 'round', 'big'], from: ['il', 'us', 'uk', 'world'] };
  const rank = (key, v) => { const o = ORDER[key] || []; return o.includes(v) ? o.indexOf(v) : o.length; };
  const valuesOf = (g, key) => { if (g.kind !== 'woman' && FILTERS.find((x) => x[0] === key)[2] === 'woman') return []; return [].concat(FILTERS.find((x) => x[0] === key)[3](g) || []); };
  const text = (n, g) => [n, ...Object.values(g).flat()].filter((v) => typeof v === 'string' || typeof v === 'number').join(' ').toLowerCase();

  function find(guests, { q = '', kind = 'all', pick = {}, sort = 'az' } = {}) {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const hit = Object.keys(guests).filter((n) => {
      const g = guests[n], t = text(n, g);
      return words.every((w) => t.includes(w)) && Object.entries(pick).every(([k, on]) => !on.length || valuesOf(g, k).some((v) => on.includes(v)));
    });
    const counts = { all: hit.length, woman: hit.filter((n) => guests[n].kind === 'woman').length, man: hit.filter((n) => guests[n].kind === 'man').length };
    const by = { young: (g) => g.age, old: (g) => -g.age, tall: (g) => (g.height ? -g.height : Infinity), short: (g) => (g.height || Infinity) }[sort];
    const list = hit.filter((n) => kind === 'all' || guests[n].kind === kind)
      .sort((a, b) => (by ? by(guests[a]) - by(guests[b]) : 0) || a.localeCompare(b));
    return { list, counts };
  }

  function menus(guests, kind, pick) {
    const of = Object.values(guests).filter((g) => kind === 'all' || g.kind === kind);
    return FILTERS.filter(([, , who]) => kind === 'all' || !who || who === kind).map(([key, label]) => {
      const vals = [...new Set(of.flatMap((g) => valuesOf(g, key)))].sort((a, b) => rank(key, a) - rank(key, b) || String(a).localeCompare(String(b)));
      return { key, label, values: vals.map((v) => ({ key: v, label: key === 'from' ? FROM[v] : v, on: (pick[key] || []).includes(v) })) };
    });
  }

  const api = { find, menus, FILTERS, SORTS };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBGuestFind = api;
})(typeof window !== 'undefined' ? window : globalThis);
