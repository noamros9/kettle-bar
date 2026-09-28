const fs = require('fs');
// Three-Split 60 is frozen (progress is keyed to its days); the rest come from gen-programs.js
const three = JSON.parse(fs.readFileSync(__dirname + '/programs/three-split-60.json', 'utf8'));
Object.assign(three, {
  subject: 'Signature', split: 'Chest & back / full body / abs & cardio', minutes: [26, 38], equip: 'all', formats: ['straight'],
  dayTypes: {
    cba: { label: 'Chest, back & abs', short: 'Chest · Back', c: 'var(--t-cba)' },
    up: { label: 'Full body · upper focus', short: 'Upper body', c: 'var(--t-up)' },
    low: { label: 'Full body · lower focus', short: 'Lower body', c: 'var(--t-low)' },
    ac: { label: 'Abs & cardio', short: 'Abs · Cardio', c: 'var(--t-ac)' },
  },
});
const library = require('./gen-programs.js');
fs.writeFileSync(__dirname + '/programs/library.json', JSON.stringify(library));
const all = [three, ...library];
const lib = fs.readFileSync(__dirname + '/lib.js', 'utf8');
let t = fs.readFileSync(__dirname + '/app.template.html', 'utf8');
t = t.replace('/*__LIB__*/', () => lib).replace('[/*__PROGRAM__*/]', () => JSON.stringify(all));
fs.writeFileSync(__dirname + '/kettle-and-bar.html', t); // artifact version (no document skeleton)
const head = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="color-scheme" content="light dark"><meta name="theme-color" content="#2346D5"><link rel="manifest" href="manifest.webmanifest"><link rel="icon" type="image/png" href="icons/icon-32.png"><link rel="apple-touch-icon" href="icons/apple-touch-icon.png"></head><body>';
fs.writeFileSync(__dirname + '/index.html', head + t + '<script type="module" src="firebase-sync.js"></script><script>if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});</script></body></html>');
console.log('programs', all.length, 'bytes', t.length);
