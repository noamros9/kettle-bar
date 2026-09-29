// Build your own (Phase 6 ticket 5): pick, preview, regenerate, save; the program is on the Your programs shelf,
// keeps its progress, works offline, and syncs to a second browser.
const base = require('@playwright/test');
const { test, expect } = require('./fixtures.js');
const { createMemoryRemote } = require('../app/store.js');
const { device } = require('./devices.js');

const chip = (app, group, name) => app.page.getByRole('group', { name: group }).getByRole('button', { name, exact: true });
const tileNames = (app) => app.page.locator('.grid.pv .tile .nm').allTextContents();

async function buildKettlebell(app) {
  await app.open('#programs');
  await app.page.getByRole('button', { name: 'Build your own' }).click();
  await expect(app.heading()).toHaveText('Build your own');
  await app.page.getByRole('group', { name: 'Days in a cycle' }).waitFor();
  await chip(app, 'Days in a cycle', '3').click();
  await chip(app, 'Equipment', 'Kettlebell only').click();
  await expect(chip(app, 'Equipment', 'Kettlebell only')).toHaveAttribute('aria-pressed', 'true');
}

test('build a 3-day kettlebell program, regenerate, save, tick day 1, reload: it is on Your programs with day 1 done', async ({ app }) => {
  await app.open('#programs');
  await expect(app.page.locator('.yours')).toHaveCount(0); // no shelf until you have one
  await buildKettlebell(app);

  // the preview: six tiles and the summary line
  await expect(app.page.locator('.grid.pv .tile')).toHaveCount(6);
  await expect(app.page.locator('.pvline')).toContainText('60 days');
  await expect(app.page.locator('.pvline')).toContainText('kettlebell only');
  const seed = await app.page.locator('.grid.pv').getAttribute('data-seed');
  await app.page.getByRole('button', { name: 'Regenerate' }).click();
  expect(await app.page.locator('.grid.pv').getAttribute('data-seed')).not.toBe(seed);
  const shown = await tileNames(app);
  expect(shown).toHaveLength(6);
  expect(await app.sidewaysScroll()).toBe(0);

  // save: the default name, and its program page opens with the days that were previewed
  await expect(app.page.getByLabel('Name')).toHaveValue('My Strength 60');
  await app.page.getByRole('button', { name: 'Save program' }).click();
  await expect(app.heading()).toHaveText('My Strength 60');
  expect(await app.page.locator('.tile .nm').evaluateAll((els) => els.slice(0, 6).map((e) => e.textContent))).toEqual(shown);

  await app.page.locator('[data-toggle="1"]').click();
  await expect(app.page.locator('[data-toggle="1"]')).toHaveAttribute('aria-checked', 'true');

  await app.page.reload(); await app.heading().waitFor(); await app.loaded();
  await expect(app.heading()).toHaveText('My Strength 60'); // its page opens after a reload
  await app.go('#programs');
  await expect(app.page.locator('.yours .pcard')).toHaveCount(1);
  await expect(app.page.locator('.yours .pcard')).toContainText('My Strength 60');
  await expect(app.page.locator('.yours .pcard .num')).toHaveText('1/60');
  // the family shelves are the library's: no own program among them
  await expect(app.page.locator('.pgroup:not(.yours) .pcard', { hasText: 'My Strength 60' })).toHaveCount(0);
  // the Your programs shelf sits above the family tabs
  const order = await app.page.evaluate(() => ['.buildbtn', '.yours', '.ftabs'].map((s) => document.querySelector(s).getBoundingClientRect().top));
  expect(order[0]).toBeLessThan(order[1]); expect(order[1]).toBeLessThan(order[2]);
  expect(await app.sidewaysScroll()).toBe(0);
});

test('choices the subject cannot build are off with a reason, and a message stands in for the preview when nothing fits', async ({ app }) => {
  await app.open('#build');
  await app.page.getByRole('group', { name: 'Days in a cycle' }).waitFor();
  // Strength has no 20-minute days
  await expect(chip(app, 'Minutes a day', '20')).toBeDisabled();
  await expect(app.page.locator('.hint', { hasText: 'No 20-minute Strength days' })).toBeVisible();
  // a subject with no bodyweight days greys out that equipment
  const lacking = await app.data(() => {
    const eq = ['all', 'kb', 'bw'], name = KBOwn.subjects(recipeBook).map((x) => x.name).find((n) => eq.some((e) => !recipeBook.options(n).equipment[e].length));
    return { subject: name, gear: GEAR_TEXT[eq.find((e) => !recipeBook.options(name).equipment[e].length)] };
  });
  await app.page.getByLabel('Subject').selectOption(lacking.subject);
  await expect(chip(app, 'Equipment', lacking.gear)).toBeDisabled();
  await expect(app.page.locator('.hint', { hasText: 'No ' + lacking.subject + ' days with' })).toBeVisible();
  // untick every format: nothing to build
  const ticked = app.page.locator('[data-bfmt]:checked'); // the page redraws after each tick
  while (await ticked.count()) await ticked.first().click();
  await expect(app.page.getByRole('alert')).toContainText('Tick at least one format');
  await expect(app.page.getByRole('button', { name: 'Save program' })).toBeDisabled();
  await expect(app.page.getByRole('button', { name: 'Regenerate' })).toBeDisabled();
});

test('the subject you pick changes what is offered: its formats, its levers, its preview', async ({ app }) => {
  await app.open('#build');
  await app.page.getByRole('group', { name: 'Days in a cycle' }).waitFor();
  await app.page.getByLabel('Subject').selectOption('Yoga');
  await expect(app.page.locator('.grid.pv .tile')).toHaveCount(6);
  expect(await app.page.locator('#b-lever2 option').allTextContents()).toEqual(['Longer holds', 'Harder variations']);
  await app.page.getByLabel('Name').fill('Evening flow');
  await app.page.getByRole('button', { name: 'Save program' }).click();
  await expect(app.heading()).toHaveText('Evening flow');
});

test('an own program opens offline, built from its stored choices and the cached recipe book', async ({ app }, testInfo) => {
  base.test.skip(testInfo.project.name !== 'phone-light', 'theme-independent');
  await buildKettlebell(app);
  await app.page.getByRole('button', { name: 'Save program' }).click();
  await expect(app.heading()).toHaveText('My Strength 60');
  const pid = await app.data(() => route.pid);
  const day1 = await app.data(() => programs.day(route.pid, 1).name);
  await app.page.waitForFunction(async () => !!(await caches.match('data/recipes.json')), null, { timeout: 20000 });
  app.allowErrors(/\/data\//);
  await app.page.route('**/data/**', (r) => r.abort('internetdisconnected'));
  await app.page.goto('/index.html#p-' + pid + '-d1'); await app.page.locator('#app h1').first().waitFor(); await app.loaded();
  await expect(app.heading()).toHaveText(day1);
});

base.test('a saved program and its progress reach a second browser through the account', async ({ browser }, testInfo) => {
  base.test.skip(testInfo.project.name !== 'phone-light', 'theme-independent');
  const remote = createMemoryRemote();
  const baseURL = testInfo.project.use.baseURL;
  const one = await device(browser, baseURL, remote, 'one');
  const two = await device(browser, baseURL, remote, 'two');

  await one.page.evaluate(() => { location.hash = '#build'; }); // in the same page: a reload would drop the account
  await one.page.getByRole('group', { name: 'Days in a cycle' }).waitFor();
  await one.page.getByRole('group', { name: 'Days in a cycle' }).getByRole('button', { name: '3', exact: true }).click();
  await one.page.getByRole('group', { name: 'Equipment' }).getByRole('button', { name: 'Kettlebell only' }).click();
  await one.page.getByRole('button', { name: 'Save program' }).click();
  await expect(one.page.locator('#app h1').first()).toHaveText('My Strength 60');
  await one.page.locator('[data-toggle="1"]').click();

  expect(Object.keys(remote.collections.programs)).toHaveLength(1);
  const [id] = Object.keys(remote.collections.programs);
  const rec = remote.collections.programs[id];
  expect(Object.keys(rec).sort()).toEqual(['catalogue', 'choices', 'createdAt', 'name', 'seed', 'updatedAt']);
  expect(rec.choices).toMatchObject({ subjects: ['Strength'], split: 3, equipment: 'kb' });

  // the second browser: the program appears on its shelf, with day 1 done
  await two.page.evaluate(() => { location.hash = '#programs'; });
  await expect(two.page.locator('.yours .pcard')).toContainText('My Strength 60', { timeout: 15000 });
  await expect(two.page.locator('.yours .pcard .num')).toHaveText('1/60', { timeout: 15000 });
  expect(await two.page.evaluate((pid) => JSON.stringify(programs.get(pid).days), 'own-' + id))
    .toBe(await one.page.evaluate((pid) => JSON.stringify(programs.get(pid).days), 'own-' + id)); // identical days on both
  expect(Object.keys(remote.docs['own-' + id].done)).toEqual(['1']);

  // and a tick on the second one comes back to the first
  await two.page.evaluate((pid) => store.toggle(pid, 2), 'own-' + id);
  await one.page.waitForFunction((pid) => store.isDone(pid, 2), 'own-' + id);
  expect(one.errors).toEqual([]);
  expect(two.errors).toEqual([]);
  await one.context.close(); await two.context.close();
});
