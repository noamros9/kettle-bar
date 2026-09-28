// Prints each program's shortest and longest day against its time range: `npm run times`.
const { buildAll } = require('../program-builder.js');

buildAll().forEach((p) => {
  const ests = p.days.map((d) => d.est);
  console.log(`${p.id.padEnd(22)} ${p.subject.padEnd(16)} ${String(Math.min(...ests)).padStart(2)}-${String(Math.max(...ests)).padEnd(2)} min (target ${p.minutes.join('-')})  formats: ${p.formats.join(',')}`);
});
