/* The Program finder's model loader (Phase 15): an ES module the page imports only when someone uses Ask (the build
   serves it as data/finder-model.js). It points transformers.js at the files the deploy served from our own site
   (scripts/vendor-finder.js), never at a CDN or Hugging Face, and returns embed(texts) -> unit vectors (384 numbers).
     loadEmbedder(base, onProgress?) -> embed      base: the app's URL (location.href); onProgress gets transformers.js
                                                   progress events ({ status, file, loaded, total })
   The runtime is ONNX Runtime's plain CPU build on one thread: GitHub Pages can't send the headers threads need. */
export const MODEL = 'Xenova/all-MiniLM-L6-v2';
export async function loadEmbedder(base, onProgress) {
  const at = (p) => new URL(`vendor/finder/${p}`, base).href;
  const T = await import(at('transformers.min.js'));
  T.env.allowRemoteModels = false;
  T.env.allowLocalModels = true;
  // a site-relative path, not a full URL: transformers.js 4.3.0 skips its local-file check for URLs and then finds no
  // tokenizer ("this.tokenizer is not a function")
  T.env.localModelPath = new URL(at('models/')).pathname;
  T.env.useBrowserCache = true;
  T.env.backends.onnx.wasm.wasmPaths = { mjs: at('ort-wasm-simd-threaded.mjs'), wasm: at('ort-wasm-simd-threaded.wasm') };
  T.env.backends.onnx.wasm.numThreads = 1;
  const extract = await T.pipeline('feature-extraction', MODEL, { dtype: 'q8', device: 'wasm', progress_callback: onProgress });
  return async (texts) => (await extract(texts, { pooling: 'mean', normalize: true })).tolist();
}
