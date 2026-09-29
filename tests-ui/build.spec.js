// Build your own (Phase 6 ticket 5): pick, preview, regenerate, save; the program is on the Your programs shelf,
// keeps its progress, works offline, and syncs to a second browser.
const base = require('@playwright/test');
const { test, expect } = require('./fixtures.js');
const { createMemoryRemote } = require('../app/store.js');
const { device } = require('./devices.js');

const chip = (app, group, name) => app.page.getByRole('group', { name: group }).getByRole('button', { name, exact: true });
const subject = (app, name) => app.page.locator(`[data-bsub="${name}"]`);
// one subject alone: tap it, then tap Strength (the default) off if it is still picked
async function pickAlone(app, name) {
  await subject(app, name).click();
  await expect(subject(app, name)).toHaveAttribute('aria-pressed', 'true');
  if (name !== 'Strength' && (await subject(app, 'Strength').getAttribute('aria-pressed')) === 'true') await subject(app, 'Strength').click();
  await expect(subject(app, 'Strength')).toHaveAttribute('aria-pressed', String(name === 'Strength'));
}
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
  await pickAlone(app, lacking.subject);
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
  await pickAlone(app, 'Yoga');
  await expect(app.page.locator('.grid.pv .tile')).toHaveCount(6);
  expect(await app.page.locator('#b-lever2 option').allTextContents()).toEqual(['Longer holds', 'Harder variations']);
  await app.page.getByLabel('Name').fill('Evening flow');
  await app.page.getByRole('button', { name: 'Save program' }).click();
  await expect(app.heading()).toHaveText('Evening flow');
});

test('mix: strength then yoga, numbered as tapped, a lever pair each, mixed days in the preview; saved and its days mixed', async ({ app }) => {
  await app.open('#build');
  await app.page.getByRole('group', { name: 'Days in a cycle' }).waitFor();
  await subject(app, 'Yoga').click();
  await expect(subject(app, 'Strength').locator('.ord')).toHaveText('1');
  await expect(subject(app, 'Yoga').locator('.ord')).toHaveText('2');
  await expect(app.page.locator('.bpick')).toHaveText('Each day: Strength, then Yoga.');
  await expect(app.page.getByRole('heading', { name: 'Subjects' })).toBeVisible();
  // one lever pair per subject: strength's and yoga's own
  await expect(app.page.locator('.blev')).toHaveText(['1 · Strength', '2 · Yoga']);
  expect(await app.page.locator('#b-lever2-2 option').allTextContents()).toEqual(['Longer holds', 'Harder variations']);
  await app.page.locator('#b-lever3-2').selectOption('variation');
  await expect(app.page.locator('#b-lever3-2')).toHaveValue('variation');
  // a subject that cannot join greys out with a reason; mixed subjects never do (they start over)
  await expect(subject(app, 'Legs & glutes')).toBeDisabled();
  await expect(app.page.locator('.hint', { hasText: 'no mix with it fits' })).toBeVisible();
  await expect(subject(app, 'Fighter')).toBeEnabled();
  // the preview: mixed days, the summary names the mix
  await expect(app.page.locator('.pvline')).toContainText('Strength + Yoga, 3 days a cycle');
  await expect(app.page.locator('.grid.pv .tile')).toHaveCount(6);
  expect((await tileNames(app)).every((n) => n.includes(' + '))).toBe(true);
  expect(await app.sidewaysScroll()).toBe(0);
  await expect(app.page.getByLabel('Name')).toHaveValue('My Strength + Yoga 60');
  await app.page.getByRole('button', { name: 'Save program' }).click();
  await expect(app.heading()).toHaveText('My Strength + Yoga 60');
  const day1 = await app.data(() => { const d = programs.day(route.pid, 1); return d.blocks.filter((b) => b.kind === 'main').map((b) => b.family); });
  expect(day1).toEqual(['Strength', 'Mind & body']);
  const choices = await app.data(() => store.doc('programs', Object.keys(store.docs('programs'))[0]).choices);
  expect(choices.subjects).toEqual(['Strength', 'Yoga']);
  expect(choices.levers).toHaveLength(4);
  expect(choices.levers[3]).toBe('variation');
  // tapping a mixed subject starts over with it alone
  await app.open('#build');
  await app.page.getByRole('group', { name: 'Days in a cycle' }).waitFor();
  await subject(app, 'Fighter').click();
  await expect(app.page.locator('[data-bsub][aria-pressed="true"]')).toHaveCount(1);
  await expect(app.page.locator('.bpick')).toContainText('Fighter is already a mix');
});

test('an own program opens offline, built from its stored config', async ({ app }, testInfo) => {
  base.test.skip(testInfo.project.name !== 'phone-light', 'theme-independent');
  await buildKettlebell(app);
  await app.page.getByRole('button', { name: 'Save program' }).click();
  await expect(app.heading()).toHaveText('My Strength 60');
  const pid = await app.data(() => route.pid);
  const day1 = await app.data(() => programs.day(route.pid, 1).name);
  app.allowErrors(/\/data\//);
  await app.page.route('**/data/**', (r) => r.abort('internetdisconnected'));
  await app.page.goto('/index.html#p-' + pid + '-d1'); await app.page.locator('#app h1').first().waitFor(); await app.loaded();
  await expect(app.heading()).toHaveText(day1);
});

test('own programs are there at boot with the recipe book unavailable: they never read it', async ({ app }, testInfo) => {
  base.test.skip(testInfo.project.name !== 'phone-light', 'theme-independent');
  await buildKettlebell(app);
  await app.page.getByRole('button', { name: 'Save program' }).click();
  await expect(app.heading()).toHaveText('My Strength 60');
  await app.page.locator('[data-toggle="1"]').click();
  await app.data(async () => { await (await caches.open('kettle-bar-v2')).delete('data/recipes.json'); });
  app.allowErrors(/recipes\.json/);
  await app.page.route('**/data/recipes.json', (r) => r.abort('internetdisconnected'));
  await app.page.goto('/index.html#programs'); await app.page.reload(); await app.page.locator('#app h1').first().waitFor();
  await expect(app.page.locator('.yours .pcard .num')).toHaveText('1/60');
  const record = await app.data(() => store.doc('programs', Object.keys(store.docs('programs'))[0]));
  expect(Object.keys(record).sort()).toEqual(['catalogue', 'choices', 'config', 'createdAt', 'name', 'seed', 'updatedAt']);
  await app.page.locator('.yours .pcard').click();
  await expect(app.heading()).toHaveText('My Strength 60');
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
  expect(Object.keys(rec).sort()).toEqual(['catalogue', 'choices', 'config', 'createdAt', 'name', 'seed', 'updatedAt']);
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

// ---- ticket 6: rename, edit, delete ----
const dayBlocks = (page, pid, n) => page.evaluate(([p, d]) => JSON.stringify(programs.get(p).days[d - 1].blocks), [pid, n]);

test('rename, edit the choices (a done day stays), delete with a question: on your program\'s page', async ({ app }) => {
  await buildKettlebell(app);
  await app.page.getByRole('button', { name: 'Save program' }).click();
  await expect(app.heading()).toHaveText('My Strength 60');
  const pid = await app.data(() => route.pid), id = pid.replace('own-', '');
  await app.page.locator('[data-toggle="1"]').click();
  const day1 = await dayBlocks(app.page, pid, 1), day4 = await dayBlocks(app.page, pid, 4);

  // rename: validated inline, then the heading, the shelf and the stored record follow
  await app.page.getByRole('button', { name: 'Rename' }).click();
  await expect(app.page.locator('#own-name')).toBeFocused();
  await app.page.locator('#own-name').fill('   ');
  await app.page.getByRole('button', { name: 'Save name' }).click();
  await expect(app.page.getByRole('alert')).toHaveText('Give it a name.');
  await expect(app.page.locator('#own-name')).toHaveAttribute('aria-invalid', 'true');
  await app.page.locator('#own-name').fill('Heavy mornings');
  await app.page.locator('#own-name').press('Enter');
  await expect(app.heading()).toHaveText('Heavy mornings');
  await expect(app.page.locator('#own-name')).toHaveCount(0);
  await app.page.getByRole('button', { name: 'Rename' }).click(); // Escape leaves it as it was
  await app.page.locator('#own-name').fill('Nope'); await app.page.locator('#own-name').press('Escape');
  await expect(app.heading()).toHaveText('Heavy mornings');
  await app.page.reload(); await app.heading().waitFor(); await app.loaded();
  await expect(app.heading()).toHaveText('Heavy mornings');
  expect(await app.data((i) => store.doc('programs', i).name, id)).toBe('Heavy mornings');
  expect(await app.sidewaysScroll()).toBe(0);

  // edit: the builder opens with this program's choices and name; days not done change, day 1 stays
  await app.page.getByRole('button', { name: 'Edit', exact: true }).click();
  await expect(app.heading()).toHaveText('Edit your program');
  await expect(chip(app, 'Days in a cycle', '3')).toHaveAttribute('aria-pressed', 'true');
  await expect(chip(app, 'Equipment', 'Kettlebell only')).toHaveAttribute('aria-pressed', 'true');
  await expect(app.page.getByLabel('Name')).toHaveValue('Heavy mornings');
  await expect(app.page.locator('.lede').first()).toContainText('stays exactly as you did it');
  await chip(app, 'Minutes a day', '40').click();
  await expect(app.page.locator('.pvline')).toContainText('~38–42 min');
  await app.page.getByRole('button', { name: 'Save changes' }).click();
  await expect(app.heading()).toHaveText('Heavy mornings');
  expect(await dayBlocks(app.page, pid, 1)).toBe(day1);
  expect(await dayBlocks(app.page, pid, 4)).not.toBe(day4);
  expect(await app.data(([p]) => programs.get(p).days[3].est, [pid])).toBeGreaterThanOrEqual(36);
  const record = await app.data((i) => store.doc('programs', i), id);
  expect(Object.keys(record.frozenDays)).toEqual(['1']);
  expect(record.choices.minutes).toBe(40);
  await expect(app.page.locator('[data-toggle="1"]')).toHaveAttribute('aria-checked', 'true'); // progress is kept
  // "Build your own" after that is a fresh build, not an edit
  await app.go('#programs');
  await app.page.getByRole('button', { name: 'Build your own' }).click();
  await expect(app.heading()).toHaveText('Build your own');
  await expect(app.page.getByLabel('Name')).toHaveValue('My Strength 60');
  // Cancel in an edit goes back to the program
  await app.go('#p-' + pid);
  await app.page.getByRole('button', { name: 'Edit', exact: true }).click();
  await app.page.getByRole('button', { name: 'Cancel' }).click();
  await expect(app.heading()).toHaveText('Heavy mornings');

  // delete asks first; Cancel keeps everything; Delete removes the program and its progress
  await app.page.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(app.page.getByRole('alertdialog')).toContainText('Delete Heavy mornings?');
  await expect(app.page.getByRole('alertdialog')).toContainText('Its progress goes too.');
  await app.page.getByRole('alertdialog').getByRole('button', { name: 'Cancel' }).click();
  await expect(app.page.getByRole('alertdialog')).toHaveCount(0);
  expect(await app.data((i) => !!store.doc('programs', i), id)).toBe(true);
  await app.page.getByRole('button', { name: 'Delete', exact: true }).click();
  await app.page.getByRole('alertdialog').getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(app.heading()).toHaveText('Programs');
  await expect(app.page.locator('.yours')).toHaveCount(0);
  expect(await app.data(() => Object.keys(localStorage).filter((k) => k.includes('own-') || k.startsWith('kb-doc-programs') ))).toEqual([]);
  expect(await app.data((p) => programs.has(p) || store.programIds().includes(p), pid)).toBe(false);
});

test('the library\'s programs have no rename, edit or delete', async ({ app }) => {
  await app.open('#programs');
  await app.page.locator('.pcard').first().click();
  await expect(app.page.locator('.owntools')).toHaveCount(0);
});

base.test('rename, edit and delete reach a second browser through the account', async ({ browser }, testInfo) => {
  base.test.skip(testInfo.project.name !== 'phone-light', 'theme-independent');
  const remote = createMemoryRemote();
  const baseURL = testInfo.project.use.baseURL;
  const one = await device(browser, baseURL, remote, 'one');
  const two = await device(browser, baseURL, remote, 'two');
  const ph = (d) => d.page.locator('#app h1').first();

  await one.page.evaluate(() => { location.hash = '#build'; });
  await one.page.getByRole('group', { name: 'Days in a cycle' }).waitFor();
  await one.page.getByRole('button', { name: 'Save program' }).click();
  await expect(ph(one)).toHaveText('My Strength 60');
  const pid = await one.page.evaluate(() => route.pid), id = pid.replace('own-', '');
  await one.page.locator('[data-toggle="1"]').click();
  await two.page.evaluate(() => { location.hash = '#programs'; });
  await expect(two.page.locator('.yours .pcard .num')).toHaveText('1/60', { timeout: 15000 });
  const day1 = await dayBlocks(two.page, pid, 1);

  // rename on one: the shelf on two shows the new name
  await one.page.getByRole('button', { name: 'Rename' }).click();
  await one.page.locator('#own-name').fill('Pull it');
  await one.page.locator('#own-name').press('Enter');
  await expect(ph(one)).toHaveText('Pull it');
  await expect(two.page.locator('.yours .pcard')).toContainText('Pull it', { timeout: 15000 });
  expect(remote.collections.programs[id].name).toBe('Pull it');

  // edit on one: two gets the frozen day 1 and the new days
  await one.page.getByRole('button', { name: 'Edit', exact: true }).click();
  await one.page.getByRole('group', { name: 'Minutes a day' }).getByRole('button', { name: '40', exact: true }).click();
  await one.page.getByRole('button', { name: 'Save changes' }).click();
  await expect(ph(one)).toHaveText('Pull it');
  await expect.poll(() => two.page.evaluate((p) => programs.get(p) && programs.get(p).days[3].est, pid), { timeout: 15000 }).toBeGreaterThanOrEqual(36);
  expect(Object.keys(remote.collections.programs[id].frozenDays)).toEqual(['1']);
  expect(await dayBlocks(two.page, pid, 1)).toBe(day1);
  expect(await two.page.evaluate((p) => JSON.stringify(programs.get(p).days), pid)).toBe(await one.page.evaluate((p) => JSON.stringify(programs.get(p).days), pid));

  // delete on one: gone from two, and its progress is gone from the account
  expect(remote.docs[pid]).toBeTruthy();
  await one.page.getByRole('button', { name: 'Delete', exact: true }).click();
  await one.page.getByRole('alertdialog').getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(ph(one)).toHaveText('Programs');
  await expect(two.page.locator('.yours')).toHaveCount(0, { timeout: 15000 });
  expect(remote.collections.programs).toEqual({});
  expect(remote.docs[pid]).toBeUndefined();
  expect(await two.page.evaluate((p) => store.programIds().includes(p), pid)).toBe(false);
  expect(one.errors).toEqual([]);
  expect(two.errors).toEqual([]);
  await one.context.close(); await two.context.close();
});
