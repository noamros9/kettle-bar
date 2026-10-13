#!/usr/bin/env node
// Decision 331: main's run makes the recipe book's trials into .build-cache/recipes/ (the build itself never does: the
// committed book is fresh), so the cache on the build-cache branch carries them and a session that adds programs runs
// only the new trials. It then checks the book it made equals recipes/book.json, the recipe side of decision 327.
function check({ make, stored, hash, stats }) {
  const book = make();
  const { hits, misses } = stats();
  const counts = `${hits} trials read, ${misses} run`;
  const saved = stored();
  if (!saved || saved.hash !== hash()) return { ok: true, message: `recipe cache: ${counts}; the committed book is stale, the unit tests say so` };
  if (JSON.stringify(book) !== JSON.stringify(saved.book)) return { ok: false, message: `recipe cache: ${counts}; the book made through the cache differs from recipes/book.json` };
  return { ok: true, message: `recipe cache: ${counts}; the book matches recipes/book.json` };
}

module.exports = { check };

/* node:coverage ignore next 8 */ // CI on main
if (require.main === module) {
  const path = require('path');
  const RB = require('../recipe-book.js');
  const memo = require('../build-cache.js').recipeMemo(process.env.KB_BUILD_CACHE ? { dir: path.resolve(process.env.KB_BUILD_CACHE) } : {});
  const out = check({ make: () => RB.generate({ memo }), stored: () => RB.stored(), hash: RB.hash, stats: () => memo.stats });
  console.log(out.message);
  if (!out.ok) process.exit(1);
}
