// Phase 35 ticket 1c (decisions 351, 353, 358): the third person's name, computed per workout, never stored.
const test = require('node:test');
const assert = require('node:assert/strict');
const { WOMEN, MEN, ORIGINS, thirdName, fill } = require('../app/third-names.js');

const US = new Set(['Ashley', 'Madison', 'Kayla', 'Megan', 'Jake', 'Tyler', 'Brandon', 'Ryan']);
const UK = new Set(['Charlotte', 'Sophie', 'Amelia', 'Holly', 'Oliver', 'Harry', 'Jack', 'Theo']);

test('a program day always gets the same name, and the next day another', () => {
  for (let day = 1; day <= 60; day++) {
    const at = { pid: 'threesome-test', day };
    assert.equal(thirdName(at, 'woman'), thirdName({ ...at }, 'woman'));
    assert.notEqual(thirdName(at, 'woman'), thirdName({ ...at, day: day + 1 }, 'woman'));
    assert.notEqual(thirdName(at, 'man'), thirdName({ ...at, day: day + 1 }, 'man'));
  }
});

test('each program starts at its own point in the list', () => {
  const firsts = new Set(['a', 'b', 'c', 'd', 'e', 'f'].map((pid) => thirdName({ pid, day: 1 }, 'woman')));
  assert.ok(firsts.size > 1);
});

test('without a program day the name steps by the calendar date', () => {
  const d = (s) => ({ date: new Date(`${s}T10:00:00`) });
  assert.equal(thirdName(d('2026-10-16'), 'man'), thirdName({ date: new Date('2026-10-16T23:30:00') }, 'man'));
  assert.notEqual(thirdName(d('2026-10-16'), 'man'), thirdName(d('2026-10-17'), 'man'));
  assert.ok(WOMEN.includes(thirdName({}, 'woman')), 'today when no date is given');
});

// Phase 35 ticket 2t2 (384): outside a workout each exercise gets its own name, steady all day
test('outside a workout the name steps by the exercise too: neighbours differ, each keeps its name all day', () => {
  const at = (ex, t = '10:00') => ({ date: new Date(`2026-10-17T${t}:00`), ex });
  const ids = Array.from({ length: 40 }, (_, i) => `fuck3_sample_${i}`);
  const names = ids.map((ex) => thirdName(at(ex), 'woman'));
  assert.ok(new Set(names).size > 10, `only ${new Set(names).size} names over 40 exercises`);
  ids.forEach((ex) => assert.equal(thirdName(at(ex), 'woman'), thirdName(at(ex, '23:30'), 'woman'), ex));
  assert.ok(ids.some((ex) => thirdName(at(ex), 'man') !== thirdName({ date: new Date('2026-10-18T10:00:00'), ex }, 'man')));
  // a program day still names one person for every exercise
  assert.equal(new Set(ids.map(() => thirdName({ pid: 'threesome-test', day: 4 }, 'woman'))).size, 1);
});

test('FMF gets a woman, MMF a man; every name one word, never Mali, never twice', () => {
  const run = (kind) => Array.from({ length: 600 }, (_, i) => thirdName({ pid: 'long-run', day: i + 1 }, kind));
  assert.ok(run('woman').every((n) => WOMEN.includes(n)));
  assert.ok(run('man').every((n) => MEN.includes(n)));
  [WOMEN, MEN].forEach((list) => {
    assert.equal(new Set(list).size, list.length);
    assert.ok(!list.includes('Mali'));
    list.forEach((n) => assert.match(n, /^[A-Z][a-z]+$/));
  });
  assert.ok(!WOMEN.some((n) => MEN.includes(n)), 'no name both a woman and a man');
});

// Phase 35 ticket 3g8 (446, 447): 41 men, Israeli 16, US 8, UK 8, world 9, each origin spread through the list
test('the men: the 24 first still there, 17 new, the split 16/8/8/9, never two of one origin in a row', () => {
  ['Itay', 'Dor', 'Jake', 'Ryan', 'Oliver', 'Theo'].forEach((n) => assert.ok(MEN.includes(n), n));
  ['Cole', 'Mason', 'Austin', 'Blake', 'George', 'Finn', 'Callum', 'Jamie', 'Mateo', 'Rafael', 'Diego', 'Lars', 'Kenji', 'Thiago',
    'Julien', 'Hugo', 'Marco'].forEach((n) => assert.ok(MEN.includes(n), n));
  assert.equal(MEN.length, 41);
  assert.deepEqual(Object.fromEntries(Object.entries(ORIGINS.man).map(([k, l]) => [k, l.length])), { il: 16, us: 8, uk: 8, world: 9 });
  assert.deepEqual(Object.values(ORIGINS.man).flat().sort(), [...MEN].sort());
  const from = Object.fromEntries(Object.entries(ORIGINS.man).flatMap(([k, l]) => l.map((n) => [n, k])));
  MEN.forEach((n, i) => assert.ok(i === 0 || from[n] !== from[MEN[i - 1]], `${MEN[i - 1]}, ${n}`));
});

// Phase 35 ticket 3g1 (410): 50 more women, from Israel, America, Britain and the world, each origin spread evenly
test('the women: the 33 first picks still there, the 50 new ones, every origin in the list, never two of one origin in a row', () => {
  const first = ['Noa', 'Yael', 'Maya', 'Adi', 'Roni', 'Gal', 'Michal', 'Hila', 'Dana', 'Noy', 'Shani', 'Inbar', 'Keren', 'Lihi', 'Neta',
    'Agam', 'Ella', 'Moran', 'Yarden', 'Romi', 'Bar', 'Lian', 'Linoy', 'Anat', 'Hodaya', ...US, ...UK].filter((n) => !MEN.includes(n));
  assert.equal(first.length, 33);
  first.forEach((n) => assert.ok(WOMEN.includes(n), n));
  ['Shira', 'Coral', 'Dafna', 'Brittany', 'Sierra', 'Isla', 'Hannah', 'Valentina', 'Aiko', 'Mei'].forEach((n) => assert.ok(WOMEN.includes(n), n));
  ['Noga', 'Lior', 'Avery', 'Kimberly', 'Abigail', 'Florence', 'Bruna', 'Nala'].forEach((n) => assert.ok(WOMEN.includes(n), n)); // 3g8 (441)
  ['Eden', 'Keshet', 'Inbal', 'Haley', 'Lily', 'Camila', 'Sakura', 'Amara', 'Maribel'].forEach((n) => assert.ok(WOMEN.includes(n), n)); // 448
  assert.equal(WOMEN.length, 161);
  assert.deepEqual(Object.fromEntries(Object.entries(ORIGINS.woman).map(([k, l]) => [k, l.length])), { il: 68, us: 24, uk: 15, world: 54 }); // 447
  const from = Object.fromEntries(Object.entries(ORIGINS.woman).flatMap(([k, l]) => l.map((n) => [n, k])));
  assert.deepEqual(Object.values(ORIGINS.woman).flat().sort(), [...WOMEN].sort());
  WOMEN.forEach((n, i) => assert.ok(i === 0 || from[n] !== from[WOMEN[i - 1]], `${WOMEN[i - 1]}, ${n}`));
});

test('fill names every placeholder for the day and leaves other text alone', () => {
  const at = { pid: 'p', day: 3 };
  assert.equal(fill('You, Mali and {woman}; {woman} kneels.', at), `You, Mali and ${thirdName(at, 'woman')}; ${thirdName(at, 'woman')} kneels.`);
  assert.equal(fill('Him and {man} on Mali.', at), `Him and ${thirdName(at, 'man')} on Mali.`);
  assert.equal(fill('{woman} kneels.', at, (n) => `[${n}]`), `[${thirdName(at, 'woman')}] kneels.`); // the page's tappable name (3g2)
  assert.equal(fill('No one else here.', at), 'No one else here.');
  assert.throws(() => thirdName(at, 'cat'), /no names for "cat"/);
});

// Phase 35 ticket 2a (Noam, 16 Oct 2026: a rule): a cue is never shown raw. Every page shows it through ui.js's cueOf
// (the name filled in); the Exercises grid printed it raw. Only the search text may read the cue as it is written.
test('no page shows a cue raw: every e.cue in app/ goes through cueOf, or is the search text', () => {
  const fs = require('fs'), path = require('path');
  const files = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? files(path.join(dir, d.name)) : d.name.endsWith('.js') ? [path.join(dir, d.name)] : []));
  const ALLOWED = [/const cueOf = \(e\) => KBThird\.fill\(esc\(e\.cue\),/, /const text = \(e\) => \[e\.name, e\.cue,/];
  const raw = files(path.join(__dirname, '../app')).filter((f) => !f.endsWith('third-names.js')).flatMap((f) => fs.readFileSync(f, 'utf8')
    .split(/\r?\n/).filter((l) => /\.cue\b/.test(l) && !ALLOWED.some((a) => a.test(l))).map((l) => `${path.basename(f)}: ${l.trim().slice(0, 80)}`));
  assert.deepEqual(raw, []);
});
