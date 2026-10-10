#!/usr/bin/env node
/* Library size (Phase 23 ticket 1, decision 137): what the last build (`npm run build`) wrote, raw and gzipped: the
   page, the program list and the finder's text. `npm run size`, after a build; it builds nothing itself, so it never
   runs the whole library on the cloud machine (decision 312). Measured at the phase's start and at its close. */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.join(__dirname, '..');
const FILES = ['index.html', 'data/library.json', 'data/finder.json', 'data/muscles.json', 'data/index.json'];
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
function measure(root = ROOT) {
  return FILES.filter((f) => fs.existsSync(path.join(root, f))).map((f) => {
    const body = fs.readFileSync(path.join(root, f));
    return { file: f, raw: body.length, gzip: zlib.gzipSync(body).length };
  });
}
module.exports = { measure, FILES };
if (require.main === module) {
  const rows = measure();
  if (!rows.length) { console.error('No build output: run `npm run build` first.'); process.exit(1); }
  const programs = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/library.json'), 'utf8')).length;
  console.log(`${programs} programs`);
  rows.forEach((r) => console.log(`${r.file.padEnd(20)} ${kb(r.raw).padStart(10)} raw  ${kb(r.gzip).padStart(10)} gzipped`));
}
