// Programs load when opened, then all of them download quietly and work offline.
const { test, expect } = require('./fixtures.js');
const { CONFIGS } = require('../program-builder.js');

test.beforeEach(({}, testInfo) => test.skip(testInfo.project.name !== 'phone-light', 'theme-independent'));

test('after the first visit every program is in the offline cache and opens with no network', async ({ app }) => {
  await app.open('#programs');
  await app.page.waitForFunction(() => programs.ids().every((id) => programs.get(id)), null, { timeout: 20000 });
  // build your own's book and code and the exercise index come after the programs
  await app.page.waitForFunction(async () => (await Promise.all(['data/recipes.json', 'data/recipes.js', 'data/index.json', 'data/muscles.json'].map((u) => caches.match(u)))).every(Boolean), null, { timeout: 20000 });
  const cached = await app.data(async () => (await (await caches.open('kettle-bar-v2')).keys()).map((r) => new URL(r.url).pathname).filter((p) => p.includes('/data/')).length);
  expect(cached).toBe(CONFIGS.length + 5); // every program, the program list, the recipe book and its code, the exercise index, the muscle focus
  app.allowErrors(/\/data\//);
  await app.page.route('**/data/**', (r) => r.abort('internetdisconnected')); // the network is gone for programs
  await app.page.reload(); await app.page.locator('#app h1').waitFor();
  expect(await app.data(() => loadBook().then((b) => b.book().types.length))).toBeGreaterThan(100); // the book and its code, offline
  await app.go('#build'); // build your own opens with no network
  await expect(app.page.getByRole('group', { name: 'Days in a cycle' })).toBeVisible();
  await app.go('#ex-pushup'); // and "Also in" on the exercise page comes from the cached index
  await expect(app.page.getByRole('heading', { name: 'Also in' })).toBeVisible();
  expect(await app.page.locator('.progchip').count()).toBeGreaterThan(3);
  for (const pid of ['iron-ppl', 'hotel-room', 'three-split-60']) {
    await app.go(`#p-${pid}-d1`);
    await expect(app.heading()).toHaveText(await app.data((id) => programs.day(id, 1).name, pid));
  }
});

test('offline with nothing cached, a program says so and can be tried again', async ({ app }) => {
  app.allowErrors(/\/data\//);
  await app.page.route('**/data/iron-ppl.json', (r) => r.abort('internetdisconnected'));
  await app.page.goto('/index.html#p-iron-ppl');
  await expect(app.page.getByRole('alert')).toHaveText("Iron PPL isn't available offline yet. Open it once while online.");
  await app.page.unroute('**/data/iron-ppl.json');
  await app.page.getByRole('button', { name: 'Try again' }).click();
  await expect(app.heading()).toHaveText('Iron PPL');
});

test('offline with not even the program list cached (Phase 16), the page says so and can be tried again', async ({ app }) => {
  app.allowErrors(/\/data\//);
  await app.page.route('**/data/library.json*', (r) => r.abort('internetdisconnected'));
  await app.page.goto('/index.html#programs');
  await expect(app.heading()).toHaveText('No programs yet');
  await expect(app.page.locator('#app')).toContainText("The program list isn't available offline yet.");
  await app.page.unroute('**/data/library.json*');
  await app.page.getByRole('button', { name: 'Try again' }).click();
  await expect(app.heading()).toHaveText('Programs');
});

test('offline with the index and the build code not cached, the pages say so instead of breaking', async ({ app }) => {
  app.allowErrors(/\/data\//);
  await app.page.route('**/data/index.json', (r) => r.abort('internetdisconnected'));
  await app.page.route('**/data/recipes.js', (r) => r.abort('internetdisconnected'));
  await app.open('#p-iron-ppl');
  await app.go('#ex-pushup');
  await expect(app.page.getByRole('status').filter({ hasText: "isn't available offline yet" })).toBeVisible();
  await app.go('#build');
  await expect(app.page.getByRole('alert')).toHaveText("Build your own isn't available offline yet. Open it once while online.");
});

test('the first download is small: the page carries only the program list, at most 135 KB gzipped (Phase 20)', async ({ app }) => {
  const res = await app.page.goto('/index.html#programs');
  expect(require('zlib').gzipSync(await res.body()).length).toBeLessThan(135 * 1024); // gzipped, as Pages serves it
});
