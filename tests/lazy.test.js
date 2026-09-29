// A file fetched when first needed (the recipe book and its code, the exercise index): kept for offline.
const test = require('node:test');
const assert = require('node:assert');
const { lazyFile } = require('../app/lazy.js');

const memory = (init = {}) => { const m = { ...init }; return { m, get: async (u) => m[u], put: async (u, v) => { m[u] = v; } }; };
const MESSAGE = "It isn't available offline yet. Open it once while online.";

test('fetch ok: the file, put in the cache, and fetched only once however often it is asked for', async () => {
  let fetches = 0;
  const cache = memory();
  const f = lazyFile({ fetch: async (u) => { fetches++; assert.equal(u, 'data/x.json'); return { v: 1 }; }, cache, url: 'data/x.json', unavailable: MESSAGE });
  const [a, b] = await Promise.all([f.load(), f.load()]);
  assert.deepEqual(a, { v: 1 });
  assert.equal(a, b);
  assert.equal(await f.load(), a);
  assert.equal(fetches, 1);
  assert.deepEqual(cache.m['data/x.json'], { v: 1 });
});

test('a cache that cannot be written to does not lose the file', async () => {
  const f = lazyFile({ fetch: async () => 'code', cache: { get: async () => undefined, put: async () => { throw new Error('full'); } }, url: 'u', unavailable: MESSAGE });
  assert.equal(await f.load(), 'code');
});

test('fetch fails: the cached copy', async () => {
  const f = lazyFile({ fetch: async () => { throw new Error('offline'); }, cache: memory({ u: 'cached code' }), url: 'u', unavailable: MESSAGE });
  assert.equal(await f.load(), 'cached code');
});

test('neither: a message for people, and asking again later can succeed', async () => {
  let up = false;
  const f = lazyFile({ fetch: async () => { if (!up) throw new Error('offline'); return { ok: true }; }, cache: memory(), url: 'u', unavailable: MESSAGE });
  await assert.rejects(f.load(), { message: MESSAGE });
  up = true;
  assert.deepEqual(await f.load(), { ok: true });
});
