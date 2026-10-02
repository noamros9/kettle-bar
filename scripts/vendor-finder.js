// The Program finder's model, served with the app (Phase 15 ticket 4): `node scripts/vendor-finder.js _site` writes
// _site/vendor/finder/:
//   transformers.min.js                       the runtime (transformers.js, one file with ONNX Runtime's JS inside),
//                                             from the npm tarball, checked against npm's sha512 integrity
//   ort-wasm-simd-threaded.{mjs,wasm}         ONNX Runtime's plain CPU build (14 MB, not the 27 MB default), from npm
//   models/Xenova/all-MiniLM-L6-v2/...        the model at a pinned revision from Hugging Face: each small file checked
//                                             against its git blob id, the ONNX weights against their sha256
// Nothing is trusted that isn't pinned here, and a wrong hash fails the deploy. The phone downloads these only when
// someone first uses Ask; the service worker caches them then.
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');

const MODEL = 'Xenova/all-MiniLM-L6-v2', REVISION = '751bff37182d3f1213fa05d7196b954e230abad9';
const SPEC = {
  npm: [
    { url: 'https://registry.npmjs.org/@huggingface/transformers/-/transformers-4.3.0.tgz',
      integrity: 'sha512-fL1A/WUZwouPrOlYxU5dzIwD2T5J781JiB2jDR8bFe5DwCj0Gfudq+NEXCMno49kQgajHA7xQkrRLJlqG1veEA==',
      files: { 'package/dist/transformers.min.js': 'transformers.min.js' } },
    { url: 'https://registry.npmjs.org/onnxruntime-web/-/onnxruntime-web-1.31.0-dev.20260914-8d85527a0.tgz',
      integrity: 'sha512-Iy7rtadoBgxS/LLvDr3QW38DB1PNXRnr0GJMcL0TAt7c9qjgVQl83UlGCVyeAnK2InpmW8Uc3PL8XIuqtDeF6g==',
      files: { 'package/dist/ort-wasm-simd-threaded.mjs': 'ort-wasm-simd-threaded.mjs', 'package/dist/ort-wasm-simd-threaded.wasm': 'ort-wasm-simd-threaded.wasm' } },
  ],
  model: [
    { file: 'config.json', blob: '72147e4ff4426ebedbfa2146c4a0999def51a313' },
    { file: 'tokenizer.json', blob: 'c17ed520ed8438736732a54957a69306b8822215' },
    { file: 'tokenizer_config.json', blob: '37fca74771bc76a8e01178ce3a6055a0995f8093' },
    { file: 'special_tokens_map.json', blob: 'a8b3208c2884c4efb86e49300fdd3dc877220cdf' },
    { file: 'onnx/model_quantized.onnx', sha256: 'afdb6f1a0e45b715d0bb9b11772f032c399babd23bfc31fed1c170afc848bdb1' },
  ],
};

// git's id for a file: sha1 of "blob <size>\0" and the bytes
const gitBlob = (buf) => crypto.createHash('sha1').update(`blob ${buf.length}\0`).update(buf).digest('hex');
const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const integrityOf = (buf) => 'sha512-' + crypto.createHash('sha512').update(buf).digest('base64');
function check(name, buf, want) {
  const got = want.blob ? gitBlob(buf) : want.sha256 ? sha256(buf) : integrityOf(buf), expected = want.blob || want.sha256 || want.integrity;
  if (got !== expected) throw new Error(`${name}: hash ${got} is not the pinned ${expected}`);
  return buf;
}
// the files of a .tgz (ustar: 512-byte headers, name at 0, size in octal at 124, prefix at 345)
function untar(tgz) {
  const tar = zlib.gunzipSync(tgz), out = {};
  for (let at = 0; at + 512 <= tar.length;) {
    const h = tar.subarray(at, at + 512);
    if (h.every((b) => b === 0)) break;
    const str = (from, len) => h.subarray(from, from + len).toString('utf8').replace(/\0.*$/s, '');
    const name = (str(345, 155) ? str(345, 155) + '/' : '') + str(0, 100), size = parseInt(str(124, 12).trim() || '0', 8);
    out[name] = tar.subarray(at + 512, at + 512 + size);
    at += 512 + Math.ceil(size / 512) * 512;
  }
  return out;
}
const modelUrl = (file) => `https://huggingface.co/${MODEL}/resolve/${REVISION}/${file}`;

async function main(outDir, { fetch: get = fetch, spec = SPEC } = {}) {
  const dir = path.join(outDir, 'vendor', 'finder'), write = (rel, buf) => { const f = path.join(dir, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, buf); };
  const download = async (url) => { const res = await get(url); if (!res.ok) throw new Error(`${url}: ${res.status}`); return Buffer.from(await res.arrayBuffer()); };
  for (const pkg of spec.npm) {
    const files = untar(check(pkg.url, await download(pkg.url), pkg));
    for (const [from, to] of Object.entries(pkg.files)) {
      if (!files[from]) throw new Error(`${pkg.url}: no ${from}`);
      write(to, files[from]);
    }
  }
  for (const m of spec.model) write(path.join('models', MODEL, m.file), check(m.file, await download(modelUrl(m.file)), m));
  return dir;
}

/* node:coverage ignore next 2 */ // the command line (needs the network); main() runs in the test with a fake fetch
if (require.main === module) main(process.argv[2] || '_site').then((d) => console.log(`vendored the finder into ${d}`), (e) => { console.error(e.message); process.exit(1); });
module.exports = { SPEC, MODEL, REVISION, gitBlob, sha256, integrityOf, check, untar, modelUrl, main };
