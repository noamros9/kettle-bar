// Phase 35 ticket 2t5 (399): the unit tests in two CI jobs. The files that run alone (whole-library checks) go to a job
// of their own; every other file runs under the coverage gate, which holds without them.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const { ALONE, all, shard } = require('../scripts/test-shards.js');

test('every test file runs in exactly one job, and the files that run alone exist', () => {
  const files = all();
  assert.ok(files.length > 100 && files.includes('tests/test-shards.test.js'));
  const covered = shard('covered'), alone = shard('alone');
  assert.deepEqual([...covered, ...alone].sort(), files);
  assert.equal(new Set([...covered, ...alone]).size, files.length);
  ALONE.forEach((f) => assert.ok(fs.existsSync(f), f));
  assert.throws(() => shard('other'), /covered or alone/);
});

test('CI runs both: the coverage job reads its files from KB_TESTS, the alone job beside it, and deploy and mark wait for it', () => {
  const pkg = require('../package.json').scripts['test:coverage'];
  assert.match(pkg, /\$\{KB_TESTS:-tests\/\*\.test\.js\}/, 'locally test:coverage still runs every file');
  const yml = fs.readFileSync('.github/workflows/deploy.yml', 'utf8');
  assert.match(yml, /KB_TESTS="\$\(node scripts\/test-shards\.js covered\)" npm run test:coverage/);
  assert.match(yml, /\n  alone:\n[\s\S]*?node --test \$\(node scripts\/test-shards\.js alone\)/);
  // in the build job's image, or the build cache it saved doesn't restore (17 Oct: it built cold and took longest)
  const image = (job) => /image: (\S+)/.exec(yml.slice(yml.indexOf(`\n  ${job}:\n`)))[1];
  assert.equal(image('alone'), image('build'));
  assert.equal((yml.match(/needs: \[test, alone, ui\]/g) || []).length, 2);
});
