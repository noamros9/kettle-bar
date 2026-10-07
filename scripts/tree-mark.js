#!/usr/bin/env node
/* The unit suite once per tree (decision 129): node scripts/tree-mark.js begin|write|check
     begin  (before test:coverage) records the tree of everything in the working tree, as a commit would see it
            after `git add -A`, taken before the tests run: files the run rewrites (recipes/book.json) don't count;
     write  (after it passed) marks that tree as tested;
     check  (the pre-commit hook) exits 0 when the staged tree is the tested one, so the hook can skip the suite.
   Marks live in .git, never committed. */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const git = (cwd, args, env) => execFileSync('git', args, { cwd, encoding: 'utf8', env: env && { ...process.env, ...env } }).trim();
const gitDir = (cwd) => path.resolve(cwd, git(cwd, ['rev-parse', '--git-dir']));
const file = (cwd, name) => path.join(gitDir(cwd), name);
const read = (f) => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8').trim() : null);

// the working tree's tree id, through a copy of the index so the real one is untouched
const workingTree = (cwd) => {
  const real = file(cwd, 'index'), tmp = file(cwd, 'kb-tree-index');
  if (fs.existsSync(real)) fs.copyFileSync(real, tmp); else fs.rmSync(tmp, { force: true });
  try {
    git(cwd, ['add', '-A'], { GIT_INDEX_FILE: tmp });
    return git(cwd, ['write-tree'], { GIT_INDEX_FILE: tmp });
  } finally { fs.rmSync(tmp, { force: true }); }
};

const same = (staged, marked) => !!marked && staged === marked;
const begin = (cwd) => fs.writeFileSync(file(cwd, 'kb-running-tree'), workingTree(cwd));
const write = (cwd) => fs.writeFileSync(file(cwd, 'kb-tested-tree'), read(file(cwd, 'kb-running-tree')) || '');
const check = (cwd) => same(git(cwd, ['write-tree']), read(file(cwd, 'kb-tested-tree')));

module.exports = { begin, write, check, same };

if (require.main === module) {
  const cmd = process.argv[2], cwd = process.cwd();
  const run = { begin, write, check };
  if (!run[cmd]) { console.error('usage: tree-mark.js begin|write|check'); process.exit(2); }
  // no mark only means the hook runs the suite: never fail test:coverage over it (CI, a checkout without git)
  try { if (run[cmd](cwd) === false) process.exit(1); } catch (e) { console.error(`tree-mark ${cmd}: ${e.message.split('\n')[0]}`); process.exit(cmd === 'check' ? 1 : 0); }
}
