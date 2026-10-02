// The deploy serves the pinned Firebase library with the app (Phase 12), so sign-in and sync can start offline from the
// service worker's cache: `node scripts/vendor-firebase.js _site` downloads the three files firebase-sync.js imports
// into _site/vendor/firebasejs/<V>/ and points their imports of each other at the copies next to them.
const fs = require('fs');
const path = require('path');

const FILES = ['firebase-app.js', 'firebase-auth.js', 'firebase-firestore.js'];
const version = () => /^const V = '([\d.]+)';/m.exec(fs.readFileSync(path.join(__dirname, '..', 'firebase-sync.js'), 'utf8'))[1];
const local = (code, V) => code.split(`https://www.gstatic.com/firebasejs/${V}/`).join('./');

async function main(out) {
  const V = version(), dir = path.join(out, 'vendor', 'firebasejs', V);
  fs.mkdirSync(dir, { recursive: true });
  for (const f of FILES) {
    const res = await fetch(`https://www.gstatic.com/firebasejs/${V}/${f}`);
    if (!res.ok) throw new Error(`${f}: ${res.status}`);
    const code = local(await res.text(), V);
    if (code.includes('www.gstatic.com/firebasejs')) throw new Error(`${f} still imports from gstatic`);
    fs.writeFileSync(path.join(dir, f), code);
  }
  console.log(`vendor/firebasejs/${V}: ${FILES.join(', ')}`);
}

/* node:coverage ignore next 2 */ // the command line (needs the network); version() and local() are what the test covers
if (require.main === module) main(process.argv[2] || '_site').catch((e) => { console.error(e.message); process.exit(1); });
module.exports = { FILES, version, local };
