// Programs load when opened, then all of them download quietly and work offline.
const { test, expect } = require('./fixtures.js');
const { CONFIGS } = require('../program-builder.js');

test.beforeEach(({}, testInfo) => test.skip(testInfo.project.name !== 'phone-light', 'theme-independent'));

test('after the first visit every program is in the offline cache and opens with no network', async ({ app }) => {
  await app.open('#programs');
  await app.page.waitForFunction(() => programs.ids().every((id) => programs.get(id)), null, { timeout: 20000 });
  const cached = await app.data(async () => (await (await caches.open('kettle-bar-v2')).keys()).map((r) => new URL(r.url).pathname).filter((p) => p.includes('/data/')).length);
  expect(cached).toBe(CONFIGS.length);
  app.allowErrors(/\/data\//);
  await app.page.route('**/data/**', (r) => r.abort('internetdisconnected')); // the network is gone for programs
  await app.page.reload(); await app.page.locator('#app h1').waitFor();
  for (const pid of ['iron-ppl', 'hotel-room', 'three-split-60']) {
    await app.go(`#p-${pid}-d1`);
    await expect(app.heading()).toHaveText(await app.data((id) => programs.day(id, 1).name, pid));
  }
});

test('offline with nothing cached, a program says so and can be tried again', async ({ app }) => {
  app.allowErrors(/\/data\//);
  await app.page.route('**/data/**', (r) => r.abort('internetdisconnected'));
  await app.page.goto('/index.html#p-iron-ppl');
  await expect(app.page.getByRole('alert')).toHaveText("Iron PPL isn't available offline yet. Open it once while online.");
  await app.page.unroute('**/data/**');
  await app.page.getByRole('button', { name: 'Try again' }).click();
  await expect(app.heading()).toHaveText('Iron PPL');
});

test('the first download is small: the page carries only the program list', async ({ app }) => {
  const res = await app.page.goto('/index.html#programs');
  expect(require('zlib').gzipSync(await res.body()).length).toBeLessThan(150 * 1024); // gzipped, as Pages serves it
});
