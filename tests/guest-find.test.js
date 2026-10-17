// Phase 35 ticket 3g7 (decisions 435-439): finding a guest: search, filters, tabs and sort
const test = require('node:test');
const assert = require('node:assert/strict');
const { find, menus, FILTERS, SORTS } = require('../app/guest-find.js');

const G = {
  Noa: { kind: 'woman', from: 'il', age: 35, height: 153, body: 'petite', breasts: 'small', ass: 'small', pussy: 'landing strip', skin: 'olive', hair: 'shoulder black', eyes: 'brown', ink: 'pierced nipples', job: 'a sound engineer', vibe: 'shy then wild', acts: ['fuck', 'tease'], hook: 'What does the quiet sound girl say?', text: 'You meet her at a bar.' },
  Ashley: { kind: 'woman', from: 'us', age: 23, height: 175, body: 'slim', breasts: 'medium', ass: 'small', pussy: 'shaved', skin: 'fair', hair: 'very long blonde', eyes: 'blue', ink: null, job: 'a lawyer', vibe: 'teasing', acts: ['anal', 'edging'], hook: '', text: '' },
  Mei: { kind: 'woman', from: 'world', age: 44, height: 160, body: 'curvy', breasts: 'very big', ass: 'big', pussy: 'trimmed', skin: 'East Asian, light', hair: 'long black', eyes: 'brown', ink: null, job: 'a chef', vibe: 'teasing', acts: ['oral', 'fuck'], hook: '', text: '' },
  Itay: { kind: 'man', from: 'il', age: 30, body: 'big', skin: 'olive', hair: 'short black', cock: 'thick', text: '' },
};
const f = (o = {}) => find(G, { q: '', kind: 'all', pick: {}, sort: 'az', ...o });

test('no search, no filters: every guest, A-Z, with the tab counts', () => {
  const r = f();
  assert.deepEqual(r.list, ['Ashley', 'Itay', 'Mei', 'Noa']);
  assert.deepEqual(r.counts, { all: 4, woman: 3, man: 1 });
});

test('the search covers name, every field, hook and text; words AND together', () => {
  assert.deepEqual(f({ q: 'black' }).list, ['Itay', 'Mei', 'Noa']);
  assert.deepEqual(f({ q: 'black olive' }).list, ['Itay', 'Noa']);
  assert.deepEqual(f({ q: 'NIPPLES' }).list, ['Noa']);
  assert.deepEqual(f({ q: 'quiet bar' }).list, ['Noa'], 'the hook and the text');
  assert.deepEqual(f({ q: 'lawyer' }).list, ['Ashley']);
  assert.deepEqual(f({ q: 'edging' }).list, ['Ashley'], 'her acts');
  assert.deepEqual(f({ q: 'nobody' }).list, []);
});

test('filters: several values OR within one, filters AND across; a women-only filter leaves the men out', () => {
  assert.deepEqual(f({ pick: { breasts: ['small', 'very big'] } }).list, ['Mei', 'Noa']);
  assert.deepEqual(f({ pick: { breasts: ['small', 'very big'], hair: ['black'] } }).list, ['Mei', 'Noa']);
  assert.deepEqual(f({ pick: { hair: ['black'], age: ['41-45'] } }).list, ['Mei']);
  assert.deepEqual(f({ pick: { ink: ['inked'] } }).list, ['Noa']);
  assert.deepEqual(f({ pick: { ink: ['none'] } }).list, ['Ashley', 'Mei']);
  assert.deepEqual(f({ pick: { acts: ['fuck'] } }).list, ['Mei', 'Noa']);
  assert.deepEqual(f({ pick: { from: ['il'] } }).list, ['Itay', 'Noa']);
  assert.deepEqual(f({ pick: { cock: ['thick'] } }).list, ['Itay']);
  assert.deepEqual(f({ pick: { hair: ['black'] }, kind: 'man' }).list, ['Itay'], 'the tab and a filter');
  assert.deepEqual(f({ pick: { breasts: [] } }).list.length, 4, 'an emptied filter is no filter');
});

test('the tab counts follow the search and filters', () => {
  assert.deepEqual(f({ q: 'black' }).counts, { all: 3, woman: 2, man: 1 });
});

test('sorts: A-Z, youngest, oldest, tallest, shortest (the men, without a height, last)', () => {
  assert.deepEqual(SORTS.map(([k]) => k), ['az', 'young', 'old', 'tall', 'short']);
  assert.deepEqual(f({ sort: 'young' }).list, ['Ashley', 'Itay', 'Noa', 'Mei']);
  assert.deepEqual(f({ sort: 'old' }).list, ['Mei', 'Noa', 'Itay', 'Ashley']);
  assert.deepEqual(f({ sort: 'tall' }).list, ['Ashley', 'Mei', 'Noa', 'Itay']);
  assert.deepEqual(f({ sort: 'short' }).list, ['Noa', 'Mei', 'Ashley', 'Itay']);
});

test('menus: the filters for the tab, each with its values in order and what is picked', () => {
  const keys = (kind) => menus(G, kind, {}).map((m) => m.key);
  assert.deepEqual(keys('man'), ['body', 'hair', 'skin', 'age', 'from', 'cock']);
  assert.ok(!keys('woman').includes('cock'));
  assert.deepEqual(keys('all'), FILTERS.map(([k]) => k));
  const tits = menus(G, 'woman', { breasts: ['medium'] }).find((m) => m.key === 'breasts');
  assert.equal(tits.label, 'Tits');
  assert.deepEqual(tits.values.map((v) => [v.key, v.on]), [['small', false], ['medium', true], ['very big', false]]);
  const big = { ...G, Lia: { ...G.Mei, breasts: 'big' } }; // a men's body 'big' never sorts a woman's size
  assert.deepEqual(menus(big, 'all', {}).find((m) => m.key === 'breasts').values.map((v) => v.key), ['small', 'medium', 'big', 'very big']);
  assert.deepEqual(menus(G, 'all', {}).find((m) => m.key === 'body').values.map((v) => v.key), ['petite', 'slim', 'curvy', 'big']);
  assert.deepEqual(menus(G, 'all', {}).find((m) => m.key === 'age').values.map((v) => v.key), ['21-25', '26-30', '31-35', '41-45']);
  assert.deepEqual(menus(G, 'all', {}).find((m) => m.key === 'from').values.map((v) => v.label), ['Israeli', 'American', 'The world']);
  assert.deepEqual(menus(G, 'all', {}).find((m) => m.key === 'hair').values.map((v) => v.key), ['black', 'blonde']);
  assert.deepEqual(menus(G, 'all', {}).find((m) => m.key === 'acts').values.map((v) => v.key), ['anal', 'edging', 'fuck', 'oral', 'tease']);
});
