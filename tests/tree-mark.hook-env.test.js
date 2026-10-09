// In a worktree, the pre-commit hook runs the suite with GIT_DIR and GIT_INDEX_FILE set to absolute paths in the real
// repo. tree-mark.test.js must keep its scratch repos to themselves: on 9 Oct 2026 they emptied a worktree's index
// and set core.bare for every checkout.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const hasGit = (() => { try { execFileSync('git', ['--version']); return true; } catch { return false; } })();

test('tree-mark tests leave the worktree the hook runs in alone', { skip: !hasGit && 'no git here' }, () => {
  const base = path.join(__dirname, '..', 'test-results', `hook-env-${process.pid}`);
  const main = path.join(base, 'main'), wt = path.join(base, 'wt');
  fs.mkdirSync(main, { recursive: true });
  // the scratch repos get a clean env: the hook's own GIT_INDEX_FILE (relative in the main checkout) would point them at it
  const clean = { ...process.env };
  execFileSync('git', ['rev-parse', '--local-env-vars'], { encoding: 'utf8' }).split('\n').forEach((v) => delete clean[v.trim()]);
  const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', env: clean }).trim();
  try {
    git(main, 'init', '-q');
    fs.writeFileSync(path.join(main, 'kept.js'), '1');
    git(main, 'add', 'kept.js');
    git(main, '-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'kept');
    git(main, 'worktree', 'add', '-q', wt);
    const tree = git(wt, 'write-tree');
    const gitDir = path.resolve(main, git(wt, 'rev-parse', '--git-dir'));
    const { NODE_TEST_CONTEXT, ...env } = process.env; // without it, the nested run reports here instead of running
    execFileSync(process.execPath, ['--test', path.join(__dirname, 'tree-mark.test.js')], {
      cwd: path.join(__dirname, '..'),
      env: { ...env, GIT_DIR: gitDir, GIT_INDEX_FILE: path.join(gitDir, 'index') },
      stdio: 'ignore',
    });
    assert.equal(git(main, 'config', 'core.bare'), 'false');
    assert.equal(git(wt, 'write-tree'), tree, 'the index is the one it was');
  } finally { fs.rmSync(base, { recursive: true, force: true }); }
});
