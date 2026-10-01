// Two devices (two browsers with their own storage) on one account, sharing one in-memory remote that lives in the
// test: the page's adapter passes every call to it through Playwright bindings (Progress Store remote adapter:
// subscribe / subscribeAll / write / remove).
async function device(browser, baseURL, remote, name) {
  const context = await browser.newContext({ baseURL, serviceWorkers: 'block', viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route('**/firebase-sync.js', (r) => r.fulfill({ body: '', contentType: 'text/javascript' }));
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ body: '', contentType: 'text/css' }));
  // Deliveries are batched: everything the remote sends in one turn reaches the page in one call, in order (one call per
  // delivery was ~280 round trips per device at sign-in, one per program, and made the two-browser tests slow and flaky).
  const queue = [];
  let flushing = false;
  const flush = () => { flushing = false; const batch = queue.splice(0); page.evaluate((b) => b.forEach(([k, d]) => window.__deliver(k, d)), batch).catch(() => {}); }; // the page may be closing
  const push = (key, data) => { queue.push([key, data]); if (!flushing) { flushing = true; setImmediate(flush); } };
  const subscribe = ([key, col, id]) => { remote[id === null ? 'subscribeAll' : 'subscribe'](...(id === null ? [col, (d) => push(key, d)] : [col, id, (d) => push(key, d)])); };
  await page.exposeFunction('__subscribeMany', (list) => list.forEach(subscribe));
  await page.exposeFunction('__write', (col, id, body) => remote.write(col, id, body));
  await page.exposeFunction('__remove', (col, id) => remote.remove(col, id));
  await page.goto('/index.html');
  await page.locator('#app h1').first().waitFor();
  await page.evaluate((who) => {
    const cbs = {};
    window.__deliver = (key, data) => cbs[key] && cbs[key](data);
    // subscriptions made in one turn go to the test in one call
    let pending = null;
    const sub = (key, col, id, cb) => {
      cbs[key] = cb;
      if (!pending) { pending = []; queueMicrotask(() => { const list = pending; pending = null; window.__subscribeMany(list); }); }
      pending.push([key, col, id]);
      return () => { delete cbs[key]; };
    };
    window.kbSync.attach({
      kind: 'test', account: { uid: 'u1', name: who, email: who + '@example.com' },
      subscribe: (col, id, onData) => sub('one:' + col + '/' + id, col, id, onData),
      subscribeAll: (col, onDocs) => sub('all:' + col, col, null, onDocs),
      write: (col, id, body) => window.__write(col, id, body),
      remove: (col, id) => window.__remove(col, id),
    });
  }, name);
  await page.waitForFunction(() => store.status === 'ok');
  return { page, context, errors };
}

module.exports = { device };
