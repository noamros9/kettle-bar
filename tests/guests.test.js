// Phase 35 ticket 3g1 (decisions 411, 413, 419–426): every named guest is one person, with fields dealt to the quotas
const test = require('node:test');
const assert = require('node:assert/strict');
const { GUESTS } = require('../app/guests.js');
const { WOMEN, MEN, ORIGINS } = require('../app/third-names.js');
const { deal, apply } = require('../scripts/deal-guests.js');

const women = WOMEN.map((n) => GUESTS[n]);
const spreadOf = (list, f) => { const m = {}; list.forEach((g) => [].concat(g[f]).forEach((v) => { m[v] = (m[v] || 0) + 1; })); return m; };
const even = (m, by, f) => { const v = Object.values(m); assert.ok(Math.max(...v) - Math.min(...v) <= by, `${f}: ${JSON.stringify(m)}`); };

test('every name has one card, and no card is a name the cues never use', () => {
  assert.deepEqual(Object.keys(GUESTS).sort(), [...WOMEN, ...MEN].sort());
  WOMEN.forEach((n) => assert.equal(GUESTS[n].kind, 'woman', n));
  MEN.forEach((n) => assert.equal(GUESTS[n].kind, 'man', n));
});

test('the women: every field there, ages 21–45, never natural, a quarter inked', () => {
  women.forEach((g) => {
    ['age', 'height', 'body', 'breasts', 'ass', 'pussy', 'skin', 'hair', 'eyes', 'job', 'vibe'].forEach((f) => assert.ok(g[f], `${f} of ${JSON.stringify(g)}`));
    assert.ok(g.age >= 21 && g.age <= 45);
    assert.ok(g.height >= 150 && g.height <= 180);
    assert.notEqual(g.pussy, 'natural');
    assert.equal(new Set(g.acts).size, 2);
    assert.equal(typeof g.hook, 'string');
    assert.equal(typeof g.text, 'string');
  });
  assert.equal(women.filter((g) => g.ink).length, Math.round(WOMEN.length / 4));
  assert.equal(new Set(women.map((g) => g.job)).size, WOMEN.length, 'every woman her own job');
});

test('the quotas: body, breasts, ass, pussy, hair length, vibe and acts even', () => {
  ['body', 'pussy', 'vibe'].forEach((f) => even(spreadOf(women, f), 1, f));
  ['breasts', 'ass', 'acts'].forEach((f) => even(spreadOf(women, f), 2, f));
  assert.equal(Object.keys(spreadOf(women, 'body')).length, 5);
  assert.equal(Object.keys(spreadOf(women, 'acts')).length, 12);
  const length = (g) => ['very long', 'long', 'shoulder', 'pixie'].find((l) => g.hair.startsWith(l));
  women.forEach((g) => assert.ok(length(g), g.hair));
  even(spreadOf(women.map((g) => ({ l: length(g) })), 'l'), 1, 'hair length');
});

test('the men: age, body, skin, hair and cock', () => {
  MEN.forEach((n) => ['age', 'body', 'skin', 'hair', 'cock'].forEach((f) => assert.ok(GUESTS[n][f], `${f} of ${n}`)));
});

// Phase 35 ticket 3g8 (441, 446-449): 161 women and 41 men; a guest already dealt keeps every field (411)
test('the men: body and cock even, ages 22-45, each with his origin, the world men looking like their names', () => {
  const men = MEN.map((n) => GUESTS[n]);
  ['body', 'cock'].forEach((f) => even(spreadOf(men, f), 1, f));
  men.forEach((g) => assert.ok(g.age >= 22 && g.age <= 45, String(g.age)));
  MEN.forEach((n) => assert.ok(ORIGINS.man[GUESTS[n].from].includes(n), n));
  assert.equal(GUESTS.Kenji.skin, 'East Asian, light');
  assert.equal(GUESTS.Lars.hair, 'dirty blond');
});

test('dealing again changes no guest, and a text file sets only the words', () => {
  const again = deal(structuredClone(GUESTS));
  Object.keys(GUESTS).forEach((n) => assert.deepEqual(again[n], GUESTS[n], n));
  const old = structuredClone(GUESTS);
  apply(old, '1. Noa | A hook | A text\n2. Itay | His line | His text\nnot a line', 'x.md');
  assert.deepEqual({ ...old.Noa, hook: GUESTS.Noa.hook, text: GUESTS.Noa.text }, GUESTS.Noa);
  assert.deepEqual([old.Noa.hook, old.Noa.text, old.Itay.line, old.Itay.text, old.Itay.cock], ['A hook', 'A text', 'His line', 'His text', GUESTS.Itay.cock]);
  assert.throws(() => apply(old, '1. Zed | a | b', 'x.md'), /Zed \(x\.md\) is no guest/);
});

// Phase 35 ticket 3g13 (451, 454): every guest a country and its flag; a woman's file may carry her line (452)
test('every guest has a country and its flag, the home ones by origin', () => {
  const HOME = { il: 'Israel', us: 'USA', uk: 'UK' };
  Object.entries(GUESTS).forEach(([n, g]) => {
    assert.ok(g.country && /^\p{Regional_Indicator}{2}$/u.test(g.flag), `${n}: ${g.country} ${g.flag}`);
    if (HOME[g.from]) assert.equal(g.country, HOME[g.from], n);
    else assert.ok(!Object.values(HOME).includes(g.country), n);
  });
  assert.equal(GUESTS.Sakura.country, 'Japan');
});

test("a woman's text file: line | hook | text, or her line alone; the old hook | text still reads", () => {
  const old = structuredClone(GUESTS);
  apply(old, '1. Noa | Her line | A hook | A text\n2. Yael | Only a line\n3. Maya | Old hook | Old text', 'x.md');
  assert.deepEqual([old.Noa.line, old.Noa.hook, old.Noa.text], ['Her line', 'A hook', 'A text']);
  assert.deepEqual([old.Yael.line, old.Yael.hook, old.Yael.text], ['Only a line', GUESTS.Yael.hook, GUESTS.Yael.text]);
  assert.deepEqual([old.Maya.line, old.Maya.hook, old.Maya.text], [GUESTS.Maya.line, 'Old hook', 'Old text']);
});

// Phase 35 ticket 3g10 (450): every world guest in one of five regions, from her country
test('every world guest has a region, all five used; a home guest has none', () => {
  const REGIONS = ['latam', 'europe', 'asia', 'mideast', 'africa'];
  Object.entries(GUESTS).forEach(([n, g]) => (g.from === 'world' ? assert.ok(REGIONS.includes(g.region), `${n}: ${g.region}`) : assert.equal(g.region, undefined, n)));
  assert.deepEqual([...new Set(Object.values(GUESTS).map((g) => g.region).filter(Boolean))].sort(), [...REGIONS].sort());
  assert.deepEqual([GUESTS.Sakura.region, GUESTS.Nala.region, GUESTS.Shirin.region, GUESTS.Bruna.region, GUESTS.Ingrid.region], ['asia', 'africa', 'mideast', 'latam', 'europe']);
});

// Phase 35 tickets 3g3-3g6 (412, 414): the words, where written
test('a written woman: a hook of at most 90 characters, then 300-900 of prose naming Mali once, quoting her, told from your side', () => {
  women.filter((g) => g.text).forEach((g) => {
    const name = WOMEN.find((n) => GUESTS[n] === g);
    assert.ok(g.hook && g.hook.length <= 90, `${name}'s hook: ${g.hook.length}`);
    assert.ok(!/Mali/.test(g.hook), `${name}'s hook names Mali`);
    assert.ok(g.text.length >= 300 && g.text.length <= 900, `${name}'s text: ${g.text.length}`); // short or long by shape (432)
    assert.match(g.text, /"[^"]{4,}"/, `${name}: a line of hers in every one (429)`);
    assert.equal(g.text.match(/\bMali\b/g).length, 1, `${name} names Mali once`);
    assert.ok(!/\b(he|him|his)\b/i.test(g.hook + ' ' + g.text), `${name}: "you" for him, never he/him/his`);
    assert.ok(!/\bno (ink|tattoos?)\b/i.test(g.text), `${name}: never what she lacks`);
  });
});

test('a written man: one or two sentences naming Mali once', () => {
  MEN.map((n) => [n, GUESTS[n]]).filter(([, g]) => g.text).forEach(([n, g]) => {
    assert.ok(g.text.length >= 120 && g.text.length <= 340, `${n}: ${g.text.length}`);
    assert.equal(g.text.match(/\bMali\b/g).length, 1, `${n} names Mali once`);
  });
});

// Phase 35 ticket 3g6 (453): a man's short line, his build or his cock in it as dealt
test('a written man: a line of at most 130 characters with his build or cock, never naming Mali', () => {
  MEN.map((n) => [n, GUESTS[n]]).filter(([, g]) => g.text).forEach(([n, g]) => {
    assert.ok(g.line && g.line.length <= 130, `${n}'s line: ${g.line}`);
    assert.ok(!/Mali/.test(g.line), `${n}'s line names Mali`);
    const l = g.line.toLowerCase(), cock = g.cock.split(' ').filter((w) => !['and', 'as', 'average'].includes(w));
    assert.ok(l.includes(g.body) || cock.every((w) => l.includes(w)), `${n}'s line: ${g.body} or ${g.cock}? ${g.line}`);
  });
});

// Phase 35 ticket 3g14 (452, 455): every written woman has her line, a physical fact in it, from your side
test('a written woman: a line of at most 130 characters with something of her body, never naming Mali, never riding you', () => {
  WOMEN.map((n) => [n, GUESTS[n]]).filter(([, g]) => g.text).forEach(([n, g]) => {
    assert.ok(g.line && g.line.length <= 130, `${n}'s line: ${g.line}`);
    assert.ok(!/Mali/.test(g.line), `${n}'s line names Mali`);
    assert.match(g.line, /tits|ass|hair|eyes|skin|blonde|red|pixie|tall|tiny|tan|olive|fair|dark|brown|petite|thick|curvy|slim|athletic|ink|tattoo|pierced|ring|thigh|body/i, `${n}'s line: ${g.line}`);
    assert.ok(!/\b(rides?|riding|sits on your cock)\b/i.test(g.line), `${n}'s line has her riding you: ${g.line}`);
  });
});

// Noam, 17 Oct 2026: every guest reads as her own person, not one template with the fields swapped
test('variety: no two hooks or texts open alike, and no five-word phrase in more than three texts', () => {
  const written = Object.entries(GUESTS).filter(([, g]) => g.text);
  const opening = (s) => s.toLowerCase().split(/\s+/).slice(0, 3).join(' ');
  [['hook', written.filter(([, g]) => g.hook)], ['text', written]].forEach(([f, list]) => {
    const seen = {};
    list.forEach(([n, g]) => { const o = opening(g[f]); assert.ok(!seen[o], `${n} and ${seen[o]} open their ${f} alike: "${o}"`); seen[o] = n; });
  });
  const uses = {};
  written.forEach(([n, g]) => {
    const w = g.text.toLowerCase().replace(/[^a-z' ]/g, ' ').split(/\s+/).filter(Boolean);
    new Set(w.slice(4).map((_, i) => w.slice(i, i + 5).join(' '))).forEach((p) => { (uses[p] = uses[p] || []).push(n); });
  });
  const stock = Object.entries(uses).filter(([p, l]) => l.length > 3 && !p.includes(' mali ')).map(([p, l]) => `"${p}": ${l.join(', ')}`);
  assert.deepEqual(stock, []);
});
