// Build the library once per run (architecture review IV ticket 5): buildAll() and build.js render() are slow (all the
// programs), and a dozen test files need them. The first file to ask builds and stores the result under
// test-results/.cache/ (inside the repo, git-ignored), named by a hash of every source file, so a stale copy is never
// read; the others read it. Each call returns a fresh copy.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..', '..');
const CACHE = path.join(ROOT, 'test-results', '.cache');
// every source the builds read: the root's .js files, configs/, app/ and recipes/ (the book), and the page shell and styles
function sources(root = ROOT) {
  const list = (dir, ext) => fs.readdirSync(path.join(root, dir)).filter((f) => ext.some((e) => f.endsWith(e))).sort().map((f) => path.join(dir, f));
  return [...list('.', ['.js']), ...list('configs', ['.js']), ...list('app', ['.js', '.html', '.css']), ...list('app/pages', ['.js']), ...list('recipes', ['.json'])];
}
function hash(root = ROOT) {
  const h = crypto.createHash('sha256');
  sources(root).forEach((f) => h.update(f + '\n').update(fs.readFileSync(path.join(root, f))));
  return h.digest('hex').slice(0, 16);
}
// what(name) -> the cached value of make(), made and stored the first time for these sources
function cached(name, make, dir = CACHE) {
  const file = path.join(dir, `${name}-${hash()}.json`);
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { /* not made yet */ }
  const value = make();
  fs.mkdirSync(dir, { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`; // another test file may be writing it too: write aside, then move in
  fs.writeFileSync(tmp, JSON.stringify(value)); fs.renameSync(tmp, file);
  // drop copies left by older sources (and their crashed writes), or every source change adds ~30MB for good;
  // anything for this hash stays, since another test file may be mid-write on it
  fs.readdirSync(dir).filter((f) => f.startsWith(`${name}-`) && !f.startsWith(path.basename(file)))
    .forEach((f) => fs.rmSync(path.join(dir, f), { force: true }));
  return JSON.parse(JSON.stringify(value));
}

const library = () => cached('library', () => require('../../program-builder.js').buildAll());
const rendered = () => cached('rendered', () => require('../../build.js').render(library())); // the shared build, not a second one (Phase 31 ticket 5)
// the library's programs with these ids, in the library's order (Phase 31 ticket 5: test files read the one shared
// build instead of building their sets again under coverage); parsed once per test file
let shared = null;
const built = (ids) => (shared || (shared = library())).filter((p) => ids.includes(p.id));
module.exports = { library, rendered, built, hash, sources, cached };
