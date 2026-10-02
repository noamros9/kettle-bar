/* The phone UI tests a branch needs locally: npm run test:ui:affected [-- spec ...] [--dark] [--list]
   Picks spec files from what changed against origin/main (commits, edits and new files), runs them in the light theme
   (--dark adds the dark one) after a fresh build. The full suite, light and dark, still runs in CI on the PR, and a
   ticket merges only when that run is green (CLAUDE.md, decided with Noam on 1 Oct 2026).
     - a changed spec runs itself;
     - a changed module runs the specs listed for it in MAP;
     - names given on the command line ("library", "settings") run too: the pages a ticket's UI work touched;
     - SMOKE always runs: every page still draws.
   choose(changed, extra) is pure, for the unit test. */
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SMOKE = ['renders'];
// module (regex on the changed path) -> the specs that exercise it
const MAP = [
  // recipes/book.json is left out: it changes with its inputs (listed here), and only its hash when app/library.js does
  [/^(configs\/|programs\.config\.js|program-builder\.js|recipes\.js|recipe-book\.js|exercises\.js|figures\.js|formats\.js|build\.js)/, ['build', 'random', 'library', 'exercise']],
  [/^app\/library\.js$/, ['library', 'favourites', 'exercises', 'muscles']],
  [/^app\/(stats|charts)\.js$/, ['stats', 'rounds', 'finish']],
  [/^app\/(session|clock)\.js$/, ['workout', 'flow', 'bouts', 'bigtimer', 'voice', 'resume', 'finish']],
  [/^app\/(store|progress|docs)\.js$/, ['sync', 'settings', 'rounds', 'resume', 'swap', 'outbox']],
  [/^app\/backup\.js$/, ['settings', 'rounds']],
  [/^(app\/lazy\.js|sw\.js|manifest\.webmanifest)$/, ['offline', 'shortcut', 'cachefirst']],
  [/^app\/programs\.js$/, ['library', 'build', 'shortcut']],
  [/^app\/own\.js$/, ['build', 'share']],
  [/^app\/random\.js$/, ['random']],
  [/^app\/length\.js$/, ['build', 'random', 'rounds', 'stats', 'share']],
  [/^app\/short\.js$/, ['short']],
  [/^app\/warmup\.js$/, ['warmup']],
  [/^app\/swaps\.js$/, ['swap', 'travel', 'rounds']],
  [/^app\/day\.js$/, ['swap', 'travel', 'warmup', 'short', 'resume']],
  [/^(firebase-sync\.js|firebase-config\.js)$/, ['sync']],
  // the pages (architecture review IV); ui.js and pages/core.js are under every page: the smoke check covers them
  [/^app\/pages\/programs\.js$/, ['library', 'favourites']],
  [/^app\/pages\/random\.js$/, ['random']],
  [/^app\/pages\/build\.js$/, ['build', 'share']],
  [/^app\/pages\/program\.js$/, ['rounds', 'shortcut']],
  [/^app\/pages\/day\.js$/, ['workout', 'flow', 'bouts', 'bigtimer', 'swap', 'travel', 'short', 'warmup', 'finish', 'resume']],
  [/^app\/pages\/exercises\.js$/, ['exercise', 'exercises', 'muscles']],
  [/^app\/pages\/settings\.js$/, ['settings']],
  [/^app\/pages\/stats\.js$/, ['stats']],
  [/^app\/(ui\.js|pages\/core\.js)$/, ['offline', 'shortcut']],
  [/^app\/main\.js$/, ['actions']],
  [/^(tests-ui\/(fixtures|devices)\.js|playwright\.config\.js)$/, ['sync', 'build', 'random', 'share']],
];

function choose(changed, extra = []) {
  const out = new Set(SMOKE);
  for (const f of changed) {
    const m = /^tests-ui\/([\w-]+)\.spec\.js$/.exec(f);
    if (m) out.add(m[1]);
    for (const [re, specs] of MAP) if (re.test(f)) specs.forEach((s) => out.add(s));
  }
  extra.forEach((s) => out.add(s.replace(/^tests-ui\//, '').replace(/\.spec\.js$/, '')));
  return [...out].sort();
}

function changedFiles() {
  const git = (c) => execSync(`git ${c}`, { encoding: 'utf8' }).split('\n').filter(Boolean);
  const base = git('merge-base HEAD origin/main')[0];
  return [...new Set([...git(`diff --name-only ${base}`), ...git('ls-files --others --exclude-standard')])];
}

/* node:coverage ignore next 12 */ // the command line; choose() is what the test covers
if (require.main === module) {
  const args = process.argv.slice(2);
  const specs = choose(changedFiles(), args.filter((a) => !a.startsWith('--')));
  const missing = specs.filter((s) => !fs.existsSync(path.join(__dirname, '..', 'tests-ui', `${s}.spec.js`)));
  if (missing.length) { console.error(`No such spec: ${missing.join(', ')}`); process.exit(1); }
  console.log(`Phone UI tests for this branch: ${specs.join(', ')}${args.includes('--dark') ? ' (light and dark)' : ' (light)'}`);
  if (args.includes('--list')) process.exit(0);
  const projects = args.includes('--dark') ? [] : ['--project=phone-light'];
  const r = spawnSync('npx', ['playwright', 'test', ...projects, ...specs.map((s) => `tests-ui/${s}.spec.js`)], { stdio: 'inherit' });
  process.exit(r.status);
}

module.exports = { choose, SMOKE, MAP };
