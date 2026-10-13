#!/usr/bin/env node
// `npm run cache:pull` (decision 326): fills .build-cache/ (or KB_BUILD_CACHE) from the newest build-cache artifact that
// main's Test and deploy run uploads, so a fresh session's first build reads programs and recipe trials instead of
// making them all. Nothing found is not an error: the build then fills the folder itself.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO = 'noamros9/kettle-bar';

// main's newest build-cache artifact that hasn't expired
const newest = (artifacts) => artifacts
  .filter((a) => a.name === 'build-cache' && !a.expired && (a.workflow_run || {}).head_branch === 'main')
  .sort((a, b) => b.created_at.localeCompare(a.created_at))[0] || null;

function pull({ dir, list, download, unzip, log = console.log }) {
  const pick = newest(list());
  if (!pick) { log('cache:pull: no build-cache artifact from main yet; the build fills the folder itself'); return null; }
  const file = path.join(os.tmpdir(), `build-cache-${pick.id}.zip`);
  download(pick.id, file);
  fs.mkdirSync(dir, { recursive: true });
  unzip(file, dir);
  log(`cache:pull: artifact ${pick.id} (${pick.created_at}) unpacked into ${dir}`);
  return pick;
}

module.exports = { newest, pull };

/* node:coverage ignore next 12 */ // gh and unzip on a real machine
if (require.main === module) {
  const gh = (args, opts) => execFileSync('gh', ['api', ...args], { maxBuffer: 1 << 30, ...opts });
  pull({
    dir: path.resolve(process.env.KB_BUILD_CACHE || path.join(__dirname, '..', '.build-cache')),
    list: () => JSON.parse(gh([`repos/${REPO}/actions/artifacts?name=build-cache&per_page=30`], { encoding: 'utf8' })).artifacts,
    download: (id, file) => fs.writeFileSync(file, gh([`repos/${REPO}/actions/artifacts/${id}/zip`])),
    unzip: (file, dir) => execFileSync('unzip', ['-oq', file, '-d', dir], { stdio: 'inherit' }),
  });
}
