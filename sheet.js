const {EX, figureSVG} = require('./lib.js');
const cards = Object.values(EX).map(e=>`<div class="c"><div class="n">${e.id} · ${e.cat}</div>${figureSVG(e)}</div>`).join('');
require('fs').writeFileSync('sheet.html', `<html><head><style>
:root{--fig:#15171a;--fig-far:#8f969c;--kit:#2346d5;--prop:#9aa1a7;--mat:#cfd8f5;--ground:#c5cacd}
body{font:11px sans-serif;display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:8px;background:#fff;width:1400px}
.c{border:1px solid #ddd;padding:4px}.fig{height:120px;width:auto;display:block}.n{font-weight:bold}
</style></head><body>${cards}</body></html>`);
