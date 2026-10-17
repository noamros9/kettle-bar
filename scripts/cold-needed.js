#!/usr/bin/env node
// Phase 35 (decision 409): does main's run need the cold build check (decision 327: a build from no cache must match the
// cached one, ~5 min)? Only when the build cache's code hash changed since the last commit, or build.js did: its keys
// hash the data (exercises before LOAD, configs, the catalogue slices), so a stale cache can only come from code.
// Writes needed=true|false to $GITHUB_OUTPUT; a file that can't be read at either commit means true.
const fs = require('fs');
const { RECIPE_CODE, exercisesCode } = require('../build-cache.js');

const FILES = [...RECIPE_CODE, 'build.js'];
// what the code hash reads, at one commit (read(f) gives a file's text there)
const code = (read) => FILES.map((f) => `${f}\n${read(f)}`).join('\0') + exercisesCode(read('exercises.js'));
function needed(before, after) {
  try { return code(before) !== code(after); } catch (e) { console.log(`cold-needed: ${e.message}; running the check`); return true; }
}

module.exports = { FILES, needed };

// CI on main (the test job checks out two commits)
if (require.main === module) {
  const { execFileSync } = require('child_process');
  const at = (rev) => (f) => execFileSync('git', ['show', `${rev}:${f}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  const yes = needed(at('HEAD^'), at('HEAD'));
  console.log(yes ? 'The build code changed: the cold build check runs.' : 'No build code changed: the cold build check is skipped.');
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `needed=${yes}\n`);
}
