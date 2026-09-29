/* Lazy files: a file the page fetches when it is first needed (the recipe book and its code for build your own, the
   exercise index for the exercise page's "Also in"), kept in the offline cache and read from it when the network isn't there.

     lazyFile({ fetch, cache, url, unavailable }) -> { load() }
       fetch(url) -> Promise of the file's content (JSON or text); cache = { get(url), put(url, value) };
       load() -> Promise of the content: fetched once however often it is asked for, put in the cache (a cache that can't
       be written to doesn't lose it), and from the cache when the fetch fails; with neither, it rejects with the
       `unavailable` message for people, and asking again later can work. */
(function (root) {
  function lazyFile({ fetch, cache, url, unavailable }) {
    let loaded;
    return {
      load() {
        if (!loaded) {
          loaded = fetch(url)
            .then((v) => cache.put(url, v).then(() => v, () => v))
            .catch(() => cache.get(url).then((v) => { if (!v) throw new Error(unavailable); return v; }))
            .catch((e) => { loaded = undefined; throw e; });
        }
        return loaded;
      },
    };
  }

  const api = { lazyFile };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBLazy = api;
})(typeof window !== 'undefined' ? window : globalThis);
