// The Program finder (Phase 15): the name search on Programs (ticket 1).
const { test, expect } = require('./fixtures.js');
const { CONFIGS } = require('../program-builder.js');

const field = (app) => app.page.getByRole('searchbox', { name: 'Search programs' });

test('name search: typing narrows the shelves and the counter, keeps focus, shows whole shelves; clearing brings all back', async ({ app }) => {
  await app.open('#programs');
  const kettle = CONFIGS.filter((c) => /kettle/i.test([c.name, c.subject, c.split, (c.about || c.blurb).match(/^[^.!?]+[.!?]/)[0]].join(' ')));
  await field(app).click();
  await app.page.keyboard.type('kettle');
  await expect(field(app)).toBeFocused();
  await expect(app.page.locator('.eyebrow').first()).toHaveText(`${kettle.length} programs`);
  await expect(app.page.locator('.pcard')).toHaveCount(kettle.length); // no shelf is cut while searching
  await expect(app.page.locator('.shelfmore')).toHaveCount(0);
  expect(await app.sidewaysScroll()).toBe(0);
  await app.page.keyboard.type(' swing press');
  await expect(app.page.locator('[data-open-prog="kettlebell-30"]')).toHaveCount(1);
  await field(app).fill('zzz nothing');
  await expect(app.page.locator('.lede', { hasText: 'No programs match “zzz nothing”' })).toBeVisible();
  await field(app).fill('');
  await expect(app.page.locator('.eyebrow').first()).toHaveText(`${CONFIGS.length} programs`);
});

test('name search works with the family and subject filters', async ({ app }) => {
  await app.open('#programs');
  await app.page.getByRole('group', { name: 'Filter by family' }).getByRole('button', { name: 'Mind & body' }).click();
  await field(app).fill('back');
  const shown = await app.page.locator('.pcard').evaluateAll((els) => els.map((e) => e.dataset.openProg));
  expect(shown.length).toBeGreaterThan(0);
  const mind = ['Core & abs', 'Mobility & posture', 'Yoga', 'Pilates', 'Flexibility', 'Balance & stability', 'Gentle / low impact', 'Back care'];
  shown.forEach((id) => expect(mind).toContain(CONFIGS.find((c) => c.id === id).subject));
});

// ---- ticket 2: Help me pick ----
const sheet = (app) => app.page.getByRole('dialog', { name: 'Help me pick' });
test('Help me pick: three taps, up to five programs with why lines, open one', async ({ app }) => {
  await app.open('#programs');
  await app.page.getByRole('button', { name: 'Help me pick' }).click();
  await expect(sheet(app)).toBeVisible();
  await expect(sheet(app)).toContainText('Pick a goal to see programs.');
  await sheet(app).getByRole('group', { name: 'Goal' }).getByRole('button', { name: 'Gentle, or a sore back' }).click();
  await sheet(app).getByRole('group', { name: 'Minutes' }).getByRole('button', { name: '20–25 min' }).click();
  await sheet(app).getByRole('group', { name: 'Gear' }).getByRole('button', { name: 'No equipment' }).click();
  const results = sheet(app).locator('.pickres');
  const n = await results.count();
  expect(n).toBeGreaterThan(0); expect(n).toBeLessThanOrEqual(5);
  await expect(results.first().locator('span')).toContainText('no equipment');
  expect(await app.sidewaysScroll()).toBe(0);
  const name = (await results.first().locator('b').textContent()).trim();
  await results.first().click();
  await expect(app.heading()).toHaveText(name);
  await app.go('#programs');
  await expect(sheet(app)).toHaveCount(0);
});

test('Help me pick says when it loosened the minutes, and closes', async ({ app }) => {
  await app.open('#programs');
  await app.page.getByRole('button', { name: 'Help me pick' }).click();
  await sheet(app).getByRole('group', { name: 'Goal' }).getByRole('button', { name: 'Fighting skills' }).click();
  await sheet(app).getByRole('group', { name: 'Minutes' }).getByRole('button', { name: 'About 15 min' }).click();
  await expect(sheet(app).locator('.hint')).toContainText('Nothing fits those minutes');
  await sheet(app).getByRole('button', { name: 'Close' }).last().click();
  await expect(sheet(app)).toHaveCount(0);
});

// ---- ticket 5: Ask the finder (signed in; the model replaced by a bag-of-words stub, so nothing downloads) ----
const { device } = require('./devices.js');
const { createMemoryRemote } = require('../app/store.js');
const askField = (page) => page.getByRole('searchbox', { name: 'Ask the finder' });

test('signed out: no Ask field, a note to sign in', async ({ app }) => {
  await app.open('#programs');
  await expect(askField(app.page)).toHaveCount(0);
  await expect(app.page.locator('.asknote')).toContainText('Sign in to ask in your own words');
});

// the stub: words hashed into 256 numbers; it reports half the download, then waits for the test to let it finish
const STUB = () => {
  window.__embedded = [];
  window.KB_EMBED = (onProgress) => new Promise((done) => {
    onProgress({ status: 'progress', file: 'onnx/model_quantized.onnx', loaded: 11, total: 22 });
    window.__finish = () => done(async (texts) => {
      window.__embedded.push(texts.length);
      return texts.map((t) => {
        const v = new Array(256).fill(0);
        t.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 3).forEach((w) => { let h = 0; for (const c of w.slice(0, 6)) h = (h * 31 + c.charCodeAt(0)) % 256; v[h] += 1; });
        return v;
      });
    });
  });
};

test('signed in: ask once (consent, progress), results with why lines and the gear limit; the next asks are instant and work offline', async ({ browser, baseURL }) => {
  const one = await device(browser, baseURL, createMemoryRemote(), 'one');
  const page = one.page;
  try {
    await page.evaluate(STUB);
    await page.evaluate(() => { location.hash = '#programs'; });
    await askField(page).fill('something gentle for my sore back, no gear');
    await page.getByRole('button', { name: 'Ask', exact: true }).click();
    const consent = page.getByRole('group', { name: 'Download the finder' });
    await expect(consent).toContainText('about 38 MB');
    await consent.getByRole('button', { name: 'Download' }).click();
    await expect(page.locator('.askstatus')).toContainText('Downloading the finder… 50%');
    await page.evaluate(() => window.__finish());
    const results = page.locator('.askout .pickres');
    await expect(results.first()).toBeVisible();
    const n = await results.count();
    expect(n).toBeGreaterThanOrEqual(3); expect(n).toBeLessThanOrEqual(5);
    for (const why of await results.locator('span').allTextContents()) expect(why).toContain('no equipment');
    expect(await page.locator('.askout').textContent()).toMatch(/Back care|Gentle/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
    // the program texts were embedded once (no vectors file locally), the question each time
    const first = await page.evaluate(() => window.__embedded.slice());
    expect(first[0]).toBe(1); expect(first.slice(1).reduce((s, x) => s + x, 0)).toBe(CONFIGS.length);
    await askField(page).fill('a kettlebell workout');
    await page.getByRole('button', { name: 'Ask', exact: true }).click();
    await expect(results.first().locator('span')).toContainText(/kettlebell only|no equipment/);
    await expect(consent).toHaveCount(0);
    expect((await page.evaluate(() => window.__embedded.slice())).slice(first.length)).toEqual([1]);
    await one.context.setOffline(true);
    await askField(page).fill('boxing');
    await page.getByRole('button', { name: 'Ask', exact: true }).click();
    await expect(page.locator('.askout')).toContainText('Boxing');
    await one.context.setOffline(false);
    const name = (await results.first().locator('b').textContent()).trim();
    await results.first().click();
    await expect(page.locator('#app h1').first()).toHaveText(name);
    expect(one.errors).toEqual([]);
  } finally { await one.context.close(); }
});

test('signed in: "Not now" closes the consent and keeps the question; a yes is remembered', async ({ browser, baseURL }) => {
  const one = await device(browser, baseURL, createMemoryRemote(), 'one');
  const page = one.page;
  try {
    await page.evaluate(STUB);
    await page.evaluate(() => { location.hash = '#programs'; });
    await askField(page).fill('yoga');
    await askField(page).press('Enter');
    const consent = page.getByRole('group', { name: 'Download the finder' });
    await consent.getByRole('button', { name: 'Not now' }).click();
    await expect(consent).toHaveCount(0);
    await expect(askField(page)).toHaveValue('yoga');
    await page.getByRole('button', { name: 'Ask', exact: true }).click();
    await consent.getByRole('button', { name: 'Download' }).click();
    await page.evaluate(() => window.__finish());
    await expect(page.locator('.askout')).toContainText('Yoga');
    expect(await page.evaluate(() => localStorage.getItem('kb-finder'))).toBe('yes');
    expect(one.errors).toEqual([]);
  } finally { await one.context.close(); }
});

test('signed in: a finder that fails to load says so, and asking again tries again', async ({ browser, baseURL }) => {
  const one = await device(browser, baseURL, createMemoryRemote(), 'one');
  const page = one.page;
  try {
    await page.evaluate(() => { localStorage.setItem('kb-finder', 'yes'); window.KB_EMBED = () => Promise.reject(new Error('no network')); });
    await page.evaluate(() => { location.hash = '#programs'; });
    await askField(page).fill('pilates');
    await page.getByRole('button', { name: 'Ask', exact: true }).click();
    await expect(page.getByRole('alert')).toContainText("The finder couldn't load");
    await page.evaluate(STUB);
    await page.getByRole('button', { name: 'Ask', exact: true }).click();
    await expect(page.getByRole('group', { name: 'Download the finder' })).toHaveCount(0);
    await page.evaluate(() => window.__finish());
    await expect(page.locator('.askout')).toContainText('Pilates');
  } finally { await one.context.close(); }
});
