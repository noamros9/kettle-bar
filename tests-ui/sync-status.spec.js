// Phase 33 ticket 7 (#296): Settings → Sync shows who's signed in, when the cloud last answered, the changes waiting
// to upload, and Sync now sends them.
const { test, expect } = require('./fixtures.js');

test('Settings → Sync: last synced, two changes waiting while uploads fail, Sync now clears them', async ({ app }, testInfo) => {
  await app.open('#p-three-split-60');
  await app.data(() => {
    window.__down = false;
    const fail = () => { const e = new Error('offline'); e.code = 'unavailable'; return Promise.reject(e); };
    window.kbSync.setAuth({ signIn() {}, signOut() {} });
    window.kbSync.attach({
      kind: 'test', account: { uid: 'u', name: 'Noam', email: 'n@example.com' },
      subscribe: (c, id, onData) => { setTimeout(() => onData(null, false)); return () => {}; },
      subscribeAll: (c, onDocs) => { setTimeout(() => { onDocs({}, true); onDocs({}, false); }); return () => {}; }, // the cache, then the cloud
      write: () => (window.__down ? fail() : Promise.resolve()),
      remove: () => (window.__down ? fail() : Promise.resolve()),
    });
  });
  await app.page.waitForFunction(() => store.status === 'ok' && store.synced);
  await app.data(() => { window.__down = true; });
  for (const n of [1, 2]) await app.page.getByRole('checkbox', { name: `Mark day ${n} done` }).click();
  await app.go('#settings');
  await expect(app.page.getByRole('heading', { name: 'Sync' })).toBeVisible();
  await expect(app.page.getByText('Signed in as n@example.com')).toBeVisible();
  await expect(app.page.locator('#sync-last')).toHaveText(/^Last synced \d\d:\d\d$/);
  await expect(app.page.locator('#sync-wait')).toHaveText('2 changes waiting');
  expect(await app.sidewaysScroll()).toBe(0);
  await app.page.screenshot({ path: `test-results/shots/${testInfo.project.name}/settings-sync.png` });
  await app.data(() => { window.__down = false; });
  await app.page.getByRole('button', { name: 'Sync now' }).click();
  await expect(app.page.locator('#sync-wait')).toHaveText('Everything is uploaded');
});

test('Settings → Sync signed out: saved on this phone only, and a Sign in button', async ({ app }) => {
  test.skip(test.info().project.name !== 'phone-light', 'theme-independent');
  await app.open('#settings');
  await app.data(() => { window.__signIns = 0; window.kbSync.setAuth({ signIn() { window.__signIns++; }, signOut() {} }); });
  await app.go('#programs'); await app.go('#settings');
  await expect(app.page.getByText('Not signed in. Your progress is saved on this phone only.')).toBeVisible();
  await app.page.getByRole('button', { name: 'Sign in with Google' }).click();
  expect(await app.page.evaluate(() => window.__signIns)).toBe(1);
});

test('Settings has no Sync card when sync is not set up', async ({ app }) => {
  test.skip(test.info().project.name !== 'phone-light', 'theme-independent');
  await app.open('#settings');
  await expect(app.page.getByRole('heading', { name: 'Backup' })).toBeVisible();
  await expect(app.page.getByRole('heading', { name: 'Sync' })).toHaveCount(0);
});
