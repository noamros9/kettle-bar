// Phase 35 ticket 1c (decisions 351, 353, 358): the third person's name, computed per workout, never stored.
const test = require('node:test');
const assert = require('node:assert/strict');
const { WOMEN, MEN, thirdName, fill } = require('../app/third-names.js');

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

test('FMF gets a woman, MMF a man; mostly Israeli, the American and British in equal numbers', () => {
  const run = (kind) => Array.from({ length: 600 }, (_, i) => thirdName({ pid: 'long-run', day: i + 1 }, kind));
  assert.ok(run('woman').every((n) => WOMEN.includes(n)));
  assert.ok(run('man').every((n) => MEN.includes(n)));
  [WOMEN, MEN].forEach((list) => {
    const us = list.filter((n) => US.has(n)).length, uk = list.filter((n) => UK.has(n)).length;
    assert.equal(us, uk);
    assert.ok((list.length - us - uk) / list.length >= 2 / 3, `${list.length - us - uk} of ${list.length} Israeli`);
    assert.equal(new Set(list).size, list.length);
    assert.ok(!list.includes('Mali'));
  });
  // spread, not bunched: never two American or British names in a row
  [WOMEN, MEN].forEach((list) => list.forEach((n, i) => assert.ok(!(US.has(n) || UK.has(n)) || !(US.has(list[i + 1]) || UK.has(list[i + 1])), n)));
});

test('fill names every placeholder for the day and leaves other text alone', () => {
  const at = { pid: 'p', day: 3 };
  assert.equal(fill('You, Mali and {woman}; {woman} kneels.', at), `You, Mali and ${thirdName(at, 'woman')}; ${thirdName(at, 'woman')} kneels.`);
  assert.equal(fill('Him and {man} on Mali.', at), `Him and ${thirdName(at, 'man')} on Mali.`);
  assert.equal(fill('No one else here.', at), 'No one else here.');
  assert.throws(() => thirdName(at, 'cat'), /no names for "cat"/);
});
