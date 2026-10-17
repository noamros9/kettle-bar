#!/usr/bin/env node
// Phase 24 ticket 10 (review V A6): does this run need the finder smoke step (98 s: the model loads in Chromium and makes
// 1,060 program vectors)? On main and on a PR alike (409; main was always), only when a changed file can touch the finder: its code,
// its vendored files and scripts, the build, the program list's shape, the dependencies. Writes needed=true|false to
// $GITHUB_OUTPUT; anything unclear (the API refuses, no PR number) means true.
const fs = require('fs');

const FINDER = /^(app\/finder[^/]*\.js|scripts\/(vendor-finder|finder-smoke)\.js|build\.js|app\/programs\.js|package(-lock)?\.json)$/;
const needed = (files) => files.some((f) => FINDER.test(f));

async function decide({ event, files }) {
  if (event !== 'pull_request' && event !== 'push') return true;
  try { return needed(await files()); } catch (e) { console.log(`finder-needed: ${e.message}; running the smoke`); return true; }
}

module.exports = { needed, decide };

/* node:coverage ignore next 16 */ // CI
if (require.main === module) {
  const { GITHUB_EVENT_NAME: event, GITHUB_EVENT_PATH: eventPath, GITHUB_REPOSITORY: repo, GH_TOKEN: token, GITHUB_OUTPUT: out } = process.env;
  const files = async () => {
    // on main (409): the merged commit's files, against the one before (the test job checks out two)
    if (event === 'push') return require('child_process').execFileSync('git', ['diff', '--name-only', 'HEAD^', 'HEAD'], { encoding: 'utf8' }).split('\n').filter(Boolean);
    const n = JSON.parse(fs.readFileSync(eventPath, 'utf8')).pull_request.number, list = [];
    for (let page = 1; page <= 10; page++) {
      const res = await fetch(`https://api.github.com/repos/${repo}/pulls/${n}/files?per_page=100&page=${page}`, { headers: { authorization: `Bearer ${token}`, accept: 'application/vnd.github+json' } });
      if (!res.ok) throw new Error(`PR files: HTTP ${res.status}`);
      const batch = await res.json(); list.push(...batch.map((f) => f.filename));
      if (batch.length < 100) break;
    }
    return list;
  };
  decide({ event, files }).then((yes) => { console.log(yes ? 'The finder smoke runs.' : 'No finder file changed: the finder smoke is skipped.'); fs.appendFileSync(out, `needed=${yes}\n`); });
}
