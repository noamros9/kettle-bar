// Writes sheet.html: a contact sheet of every illustration (or only the ids given as arguments).
const {EX, figureSVG} = require('./lib.js');
const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(EX);
const cards = ids.map(id=>EX[id]).map(e=>`<div class="c"><div class="n">${e.id} · ${e.cat}</div>${figureSVG(e)}</div>`).join('');
require('fs').writeFileSync(__dirname+'/sheet.html', `<html><head><style>
:root{--fig:#15171a;--fig-far:#8f969c;--kit:#2346d5;--prop:#9aa1a7;--mat:#cfd8f5;--ground:#c5cacd}
body{font:11px sans-serif;display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:8px;background:#fff;width:1400px}
.c{border:1px solid #ddd;padding:4px}.fig{height:130px;width:auto;max-width:100%;display:block}.n{font-weight:bold}
</style></head><body>${cards}</body></html>`);
