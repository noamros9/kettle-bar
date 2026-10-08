// Sums time, tokens and cost over builder transcripts: `claude -p` stream-json (result event) or Grok (end event).
const fs = require('fs');
const t = { runs: 0, ms: 0, input: 0, cacheRead: 0, cacheWrite: 0, output: 0, usd: 0 };
for (const f of process.argv.slice(2)) {
  for (const l of fs.readFileSync(f, 'utf8').split('\n')) {
    if (!l.startsWith('{')) continue;
    let e; try { e = JSON.parse(l); } catch { continue; }
    if (e.type !== 'result' && e.type !== 'end') continue;
    const u = e.usage || {};
    t.runs++; t.ms += e.duration_ms || 0; t.usd += e.total_cost_usd || 0;
    t.input += u.input_tokens || 0; t.cacheRead += u.cache_read_input_tokens || 0;
    t.cacheWrite += u.cache_creation_input_tokens || 0; t.output += u.output_tokens || 0;
  }
}
console.log(`${t.runs} run(s), ${Math.round(t.ms / 60000)} min (Sonnet only), input ${t.input}, cache read ${t.cacheRead}, ` +
  `cache write ${t.cacheWrite}, output ${t.output}, $${t.usd.toFixed(2)}`);
