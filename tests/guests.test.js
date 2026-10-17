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
