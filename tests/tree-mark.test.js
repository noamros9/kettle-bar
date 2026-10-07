// Decision 129: the unit suite runs once per tree. test:coverage records the tree it ran on; the pre-commit hook
// skips a commit whose staged tree is that tree. A scratch repo under test-results/ stands in for the real one.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { begin, write, check, same } = require('../scripts/tree-mark.js');

const hasGit = (() => { try { execFileSync('git', ['--version']); return true; } catch { return false; } })();
const gitTest = (name, fn) => test(name, { skip: !hasGit && 'no git here' }, fn);

const repo = () => {
  const dir = path.join(__dirname, '..', 'test-results', `tree-mark-${process.pid}-${Math.random().toString(36).slice(2)}`);
  fs.mkdirSync(dir, { recursive: true });
  const git = (...args) => execFileSync('git', args, { cwd: dir, encoding: 'utf8' });
  git('init', '-q');
  fs.writeFileSync(path.join(dir, 'a.js'), '1');
  fs.writeFileSync(path.join(dir, 'b.js'), '1');
  return { dir, git, put: (f, s) => fs.writeFileSync(path.join(dir, f), s), done: () => fs.rmSync(dir, { recursive: true, force: true }) };
};

test('same: only an equal, recorded tree counts', () => {
  assert.equal(same('abc', 'abc'), true);
  assert.equal(same('abc', 'abd'), false);
  assert.equal(same('abc', null), false);
});

gitTest('a tree that passed is skipped when it is staged as it was', () => {
  const r = repo();
  try {
    begin(r.dir); write(r.dir);
    r.git('add', '-A');
    assert.equal(check(r.dir), true);
  } finally { r.done(); }
});

gitTest('an edit after the run, or staging only part of the work, runs the suite', () => {
  const r = repo();
  try {
    r.put('a.js', '2'); r.put('b.js', '2');
    begin(r.dir); write(r.dir);
    r.git('add', 'a.js');
    assert.equal(check(r.dir), false, 'only part staged');
    r.git('add', 'b.js');
    assert.equal(check(r.dir), true, 'all staged');
    r.put('a.js', '3'); r.git('add', '-A');
    assert.equal(check(r.dir), false, 'edited after the run');
  } finally { r.done(); }
});

gitTest('files the run itself rewrote do not count: the tree is taken before the tests run', () => {
  const r = repo();
  try {
    begin(r.dir);
    r.put('b.js', 'rewritten by the build'); // like recipes/book.json, restored before committing
    write(r.dir);
    r.put('b.js', '1'); // restored before the commit
    r.git('add', '-A');
    assert.equal(check(r.dir), true);
  } finally { r.done(); }
});

gitTest('a failed run leaves no mark, and nothing is skipped without one', () => {
  const r = repo();
  try {
    begin(r.dir); // the tests fail: write never runs
    r.git('add', '-A');
    assert.equal(check(r.dir), false);
  } finally { r.done(); }
});
