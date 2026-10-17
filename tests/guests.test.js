// Phase 35 ticket 3g1 (decisions 411, 413, 419–426): every named guest is one person, with fields dealt to the quotas
const test = require('node:test');
const assert = require('node:assert/strict');
const { GUESTS } = require('../app/guests.js');
const { WOMEN, MEN } = require('../app/third-names.js');

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
