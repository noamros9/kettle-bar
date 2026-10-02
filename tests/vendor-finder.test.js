// The finder's model served with the app (Phase 15 ticket 4): every file pinned and checked; a wrong hash fails.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const zlib = require('zlib');
const V = require('../scripts/vendor-finder.js');

// a .tgz with these files, as npm packs them
function tgz(files) {
  const parts = [];
  for (const [name, text] of Object.entries(files)) {
    const body = Buffer.from(text), h = Buffer.alloc(512);
    h.write(name, 0); h.write(body.length.toString(8).padStart(11, '0') + '\0', 124);
    parts.push(h, body, Buffer.alloc((512 - (body.length % 512)) % 512));
  }
  return zlib.gzipSync(Buffer.concat([...parts, Buffer.alloc(1024)]));
}

test('hashes: git blob ids as git makes them, sha256, npm\'s sha512 integrity; a mismatch names the file', () => {
  assert.equal(V.gitBlob(Buffer.from('hello\n')), 'ce013625030ba8dba906f756967f9e9ca394464a');
  assert.equal(V.sha256(Buffer.from('')), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  assert.match(V.integrityOf(Buffer.from('x')), /^sha512-[A-Za-z0-9+/]+=*$/);
  assert.throws(() => V.check('config.json', Buffer.from('tampered'), { blob: '72147e4ff4426ebedbfa2146c4a0999def51a313' }), /config\.json: hash .* is not the pinned 72147e4/);
  assert.equal(V.check('x', Buffer.from('hello\n'), { blob: 'ce013625030ba8dba906f756967f9e9ca394464a' }).toString(), 'hello\n');
});

test('the pinned spec: transformers.js and the plain CPU runtime from npm, the quantized model at a fixed revision', () => {
  assert.match(V.REVISION, /^[0-9a-f]{40}$/);
  assert.deepEqual(V.SPEC.npm.flatMap((p) => Object.values(p.files)), ['transformers.min.js', 'ort-wasm-simd-threaded.mjs', 'ort-wasm-simd-threaded.wasm']);
  V.SPEC.npm.forEach((p) => assert.match(p.integrity, /^sha512-/));
  assert.deepEqual(V.SPEC.model.map((m) => m.file), ['config.json', 'tokenizer.json', 'tokenizer_config.json', 'special_tokens_map.json', 'onnx/model_quantized.onnx']);
  V.SPEC.model.forEach((m) => assert.ok(/^[0-9a-f]{40}$/.test(m.blob) || /^[0-9a-f]{64}$/.test(m.sha256), m.file));
  assert.equal(V.modelUrl('config.json'), `https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/${V.REVISION}/config.json`);
});

test('untar reads npm tarballs (names with a prefix too, files over 512 bytes)', () => {
  const big = 'y'.repeat(700), files = V.untar(tgz({ 'package/a.txt': 'A', 'package/dist/b.js': big }));
  assert.equal(files['package/a.txt'].toString(), 'A');
  assert.equal(files['package/dist/b.js'].toString(), big);
  const h = Buffer.alloc(512); h.write('long/name.js', 0); h.write('package', 345); h.write('00000000001\0', 124);
  assert.equal(V.untar(zlib.gzipSync(Buffer.concat([h, Buffer.from('Z'), Buffer.alloc(511), Buffer.alloc(1024)])))['package/long/name.js'].toString(), 'Z');
});

test('main: writes vendor/finder with what the spec pins, and refuses a wrong hash or a missing file', async () => {
  const pkg = tgz({ 'package/dist/rt.js': 'runtime' }), model = Buffer.from('{"a":1}');
  const spec = { npm: [{ url: 'https://npm/pkg.tgz', integrity: V.integrityOf(pkg), files: { 'package/dist/rt.js': 'rt.js' } }], model: [{ file: 'config.json', blob: V.gitBlob(model) }] };
  const served = { 'https://npm/pkg.tgz': pkg, [V.modelUrl('config.json')]: model };
  const fetch = async (url) => (served[url] ? { ok: true, arrayBuffer: async () => served[url] } : { ok: false, status: 404 });
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-vendor-'));
  try {
    const dir = await V.main(out, { fetch, spec });
    assert.equal(fs.readFileSync(path.join(dir, 'rt.js'), 'utf8'), 'runtime');
    assert.equal(fs.readFileSync(path.join(dir, 'models', V.MODEL, 'config.json'), 'utf8'), '{"a":1}');
    await assert.rejects(V.main(out, { fetch, spec: { ...spec, model: [{ file: 'config.json', blob: '0'.repeat(40) }] } }), /config\.json: hash/);
    await assert.rejects(V.main(out, { fetch, spec: { npm: [{ ...spec.npm[0], files: { 'package/dist/nope.js': 'x' } }], model: [] } }), /no package\/dist\/nope\.js/);
    await assert.rejects(V.main(out, { fetch, spec: { npm: [], model: [{ file: 'tokenizer.json', blob: '0'.repeat(40) }] } }), /404/);
  } finally { fs.rmSync(out, { recursive: true, force: true }); }
});
