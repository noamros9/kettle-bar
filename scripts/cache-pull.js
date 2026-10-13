#!/usr/bin/env node
// `npm run cache:pull` (decisions 326, 330): fills .build-cache/ (or KB_BUILD_CACHE) from what main's Test and deploy
// run left: the one commit of the orphan build-cache branch (fetched with git, which a cloud session can reach), else its
// newest build-cache artifact (needs gh and blob storage: Noam's machine). A fresh session's first build then reads
// programs and recipe trials instead of making them all. Nothing found is not an error: the build fills the folder itself.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO = 'noamros9/kettle-bar';

// main's newest build-cache artifact that hasn't expired
const newest = (artifacts) => artifacts
  .filter((a) => a.name === 'build-cache' && !a.expired && (a.workflow_run || {}).head_branch === 'main')
  .sort((a, b) => b.created_at.localeCompare(a.created_at))[0] || null;

function pull({ dir, branch, list, download, unzip, log = console.log }) {
  try {
    fs.mkdirSync(dir, { recursive: true });
    branch(dir);
    log(`cache:pull: the build-cache branch unpacked into ${dir}`);
    return { branch: 'build-cache' };
  } catch (e) {
    log(`cache:pull: no build-cache branch (${e.message.split('\n')[0]}); trying main's artifact`);
  }
  let pick;
  try { pick = newest(list()); } catch (e) { log(`cache:pull: no artifact either (${e.message.split('\n')[0]}); the build fills the folder itself`); return null; }
  if (!pick) { log('cache:pull: no build-cache artifact from main yet; the build fills the folder itself'); return null; }
  const file = path.join(os.tmpdir(), `build-cache-${pick.id}.zip`);
  try {
    download(pick.id, file);
    unzip(file, dir);
  } catch (e) { log(`cache:pull: artifact ${pick.id} couldn't be fetched (${e.message.split('\n')[0].slice(0, 120)}); the build fills the folder itself`); return null; }
  log(`cache:pull: artifact ${pick.id} (${pick.created_at}) unpacked into ${dir}`);
  return pick;
}

module.exports = { newest, pull };

/* node:coverage ignore next 17 */ // git, gh and unzip on a real machine
if (require.main === module) {
  const gh = (args, opts) => execFileSync('gh', ['api', ...args], { maxBuffer: 1 << 30, ...opts });
  const git = (args, opts) => execFileSync('git', args, { cwd: path.join(__dirname, '..'), maxBuffer: 1 << 30, ...opts });
  pull({
    dir: path.resolve(process.env.KB_BUILD_CACHE || path.join(__dirname, '..', '.build-cache')),
    branch: (dir) => {
      git(['fetch', '-q', '--depth', '1', 'origin', 'build-cache'], { stdio: ['ignore', 'ignore', 'pipe'] });
      execFileSync('tar', ['-x', '-C', dir], { input: git(['archive', 'FETCH_HEAD']) });
    },
    list: () => JSON.parse(gh([`repos/${REPO}/actions/artifacts?name=build-cache&per_page=30`], { encoding: 'utf8' })).artifacts,
    download: (id, file) => fs.writeFileSync(file, gh([`repos/${REPO}/actions/artifacts/${id}/zip`])),
    unzip: (file, dir) => execFileSync('unzip', ['-oq', file, '-d', dir], { stdio: 'inherit' }),
  });
}
