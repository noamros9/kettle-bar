// Draws every pose of the exercises named, one row each, to test-results/poses-<name>.png, so the builder (and the
// reviewer) can look at each drawing. Not a test: nothing here is committed output (test-results/ is gitignored).
//   node .claude/skills/sonnet-handoff/poses.js <name> --cat abs [--cat cardio] [--added 13]
//   node .claude/skills/sonnet-handoff/poses.js <name> id1 id2 ...
const path = require('path');
const fs = require('fs');
const root = path.join(__dirname, '..', '..', '..');
const { EX } = require(path.join(root, 'exercises.js'));
const { figureSVG } = require(path.join(root, 'figures.js'));

const [name, ...args] = process.argv.slice(2);
if (!name) { console.error('usage: poses.js <name> (--cat c ... [--added n] | ids...)'); process.exit(1); }
const cats = [], ids = [];
let added = 13;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--cat') cats.push(args[++i]);
  else if (args[i] === '--added') added = +args[++i];
  else ids.push(args[i]);
}
const list = ids.length ? ids : Object.values(EX).filter((e) => e.added === added && cats.includes(e.cat)).map((e) => e.id);
const missing = list.filter((id) => !EX[id]);
if (missing.length) { console.error('no such exercise: ' + missing.join(', ')); process.exit(1); }

const rows = list.map((id) => {
  const e = EX[id];
  return `<div class="r"><div class="n">${id}<br><small>${e.cat}${e.view ? ' · ' + e.view : ''}</small></div>${e.poses.map((p) => `<div class="c">${figureSVG({ ...e, poses: [p] })}</div>`).join('')}</div>`;
}).join('');
const out = path.join(root, 'test-results');
fs.mkdirSync(out, { recursive: true });
const html = path.join(out, `poses-${name}.html`), png = path.join(out, `poses-${name}.png`);
fs.writeFileSync(html, `<html><head><style>
:root{--fig:#15171a;--fig-far:#8f969c;--kit:#2346d5;--prop:#9aa1a7;--mat:#cfd8f5;--ground:#c5cacd;--fig2:#c0306a;--fig2-far:#e3a1bc;--mark:#ffd000}
body{font:12px sans-serif;background:#fff;width:1100px;margin:6px}.r{display:flex;gap:6px;align-items:center;border-bottom:1px solid #eee;padding:2px}
.n{width:170px;font-weight:bold}.c{border:1px solid #ddd}.c svg{height:110px;width:auto;display:block}
</style></head><body>${rows}</body></html>`);

(async () => {
  const { chromium } = require(path.join(root, 'node_modules', 'playwright'));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1110, height: 800 } });
  await page.goto('file://' + html);
  await page.screenshot({ path: png, fullPage: true });
  await browser.close();
  console.log(`${list.length} exercises -> ${path.relative(root, png)}`);
})().catch((e) => { console.error(e.message); process.exit(1); });
