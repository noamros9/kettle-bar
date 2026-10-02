// Phase 12 ticket 4: "Offline · 2 changes waiting" in the header while changes wait for the account; it clears once sent.
const { test, expect } = require('./fixtures.js');

test('offline: two days marked done show "2 changes waiting"; back online they are sent and it clears', async ({ app }) => {
  await app.open('#p-three-split-60');
  await app.data(() => {
    window.__down = false; window.__sent = [];
    const fail = () => { const e = new Error('offline'); e.code = 'unavailable'; return Promise.reject(e); };
    window.kbSync.setAuth({ signIn() {}, signOut() {} });
    window.kbSync.attach({
      kind: 'test', account: { uid: 'u', name: 'Noam', email: 'n@example.com' },
      subscribe: (c, id, onData) => { setTimeout(() => onData(null)); return () => {}; },
      subscribeAll: (c, onDocs) => { setTimeout(() => onDocs({})); return () => {}; },
      write: (c, id) => (window.__down ? fail() : (window.__sent.push(c + '/' + id), Promise.resolve())),
      remove: () => (window.__down ? fail() : Promise.resolve()),
    });
  });
  await app.page.waitForFunction(() => store.status === 'ok');
  app.allowErrors(/\/data\//); // the background download of the other programs fails while offline
  await app.page.context().setOffline(true);
  await app.data(() => { window.__down = true; });
  for (const n of [1, 2]) await app.page.getByRole('checkbox', { name: `Mark day ${n} done` }).click();
  const sync = app.page.locator('#sync');
  await expect(sync).toHaveAttribute('aria-label', 'Offline · 2 changes waiting');
  await expect(sync.locator('.wcount')).toHaveText('2');
  await sync.click();
  await expect(app.page.locator('#acct')).toContainText('saved on this phone');
  expect(await app.sidewaysScroll()).toBe(0);
  await app.page.context().setOffline(false);
  await app.data(() => { window.__down = false; window.dispatchEvent(new Event('online')); });
  await expect(sync.locator('.wcount')).toBeHidden();
  await expect(sync).toHaveAttribute('aria-label', /^Synced/);
  expect(await app.data(() => window.__sent)).toContain('progress/three-split-60');
});
