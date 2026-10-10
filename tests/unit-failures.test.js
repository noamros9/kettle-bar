// CI's failure notes (scripts/unit-failures.js): failing tests and coverage shortfalls out of node --test's TAP.
const test = require('node:test');
const assert = require('node:assert/strict');
const { failures } = require('../scripts/unit-failures.js');

test('finds each failing test with its location and error, skips file summaries, and the coverage lines', () => {
  const tap = [
    'not ok 1 - tests/x.test.js', '  ---', "  failureType: 'subtestsFailed'", '  ...',
    '    not ok 3 - the config ids, in order', '      ---', "      location: '/w/repo/tests/configs.test.js:176:1'", "      error: 'ids differ'", '      ...',
    'ok 2 - fine', '# coverage threshold for lines (100%) not met (99.5%)',
  ].join('\n');
  const r = failures(tap);
  assert.deepEqual(r.tests, [{ name: 'the config ids, in order', loc: '/w/repo/tests/configs.test.js:176:1', err: 'ids differ' }]);
  assert.deepEqual(r.cover, ['coverage threshold for lines (100%) not met (99.5%)']);
  assert.deepEqual(failures('ok 1 - all fine\n'), { tests: [], cover: [] });
});
