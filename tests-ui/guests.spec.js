// Phase 35 ticket 3g2 (decisions 415, 416, 419, 425): the guests, a page no menu links to, and a guest's card from a cue
const { test, expect } = require('./fixtures.js');
const { GUESTS } = require('../app/guests.js');
const { WOMEN, MEN } = require('../app/third-names.js');

const EX = 'fuck3_spitroast_bed'; // FMF: "{woman} kneels beyond her…"
// held 700 ms, then released: the page has already gone to the guests, so the release and click land on the old element
const longPress = async (loc) => {
  const el = await loc.elementHandle();
  await el.dispatchEvent('pointerdown'); await loc.page().waitForTimeout(700); await el.dispatchEvent('pointerup'); await el.dispatchEvent('click');
};

test('the page lists every guest A-Z, each with her facts row, her hook or "not written yet"', async ({ app }) => {
  await app.open('#guests');
  await expect(app.heading()).toHaveText('The guests');
  const names = await app.page.locator('.guest .gname').allTextContents();
  expect(names).toEqual([...WOMEN, ...MEN].sort((a, b) => a.localeCompare(b))); // A-Z by default (439)
  // a woman with her line: flag, country, age and height; one without it yet keeps the body facts in the row (3g13)
  const noa = GUESTS.Noa;
  await expect(app.page.locator('#g-Noa .gfacts')).toHaveText(`${noa.flag} Israel · ${noa.age} · ${noa.height} cm`);
  const bare = WOMEN.find((n) => !GUESTS[n].line), b = GUESTS[bare];
  if (bare) await expect(app.page.locator(`#g-${bare} .gfacts`)).toContainText(`${b.flag} ${b.country} · ${b.age} · ${b.height} cm · ${b.body} · ${b.breasts} tits`);
  // 3g13 (451-453): a guest with a line shows it above the hook, and the row keeps only flag, country and age
  const itay = GUESTS.Itay;
  await expect(app.page.locator('#g-Itay .gfacts')).toHaveText(`${itay.flag} Israel · ${itay.age}`);
  await expect(app.page.locator('#g-Itay .gline')).toHaveText(itay.line);
  expect(await app.data(() => [...document.querySelector('#g-Itay .gsum').children].map((e) => e.className))).toEqual(['gname', 'gfacts', 'gline']);
  const blank = [...WOMEN, ...MEN].find((n) => !GUESTS[n].text), written = WOMEN.find((n) => GUESTS[n].text);
  if (blank) await expect(app.page.locator(`#g-${blank}`)).toContainText('Not written yet');
  if (written) await expect(app.page.locator(`#g-${written} .ghook`)).toHaveText(GUESTS[written].hook);
  expect(await app.sidewaysScroll()).toBeLessThanOrEqual(0);
});

test('no link to the guests anywhere', async ({ app }) => {
  for (const hash of ['#programs', '#exercises', '#settings', `#ex-${EX}`]) {
    await app.open(hash);
    expect(await app.data(() => document.querySelectorAll('a[href*="guests"], [data-go="guests"]').length), hash).toBe(0);
  }
});

test('the Group sex chip: a tap filters, a long-press opens the guests', async ({ app }) => {
  await app.open('#exercises');
  const chip = app.page.locator('[data-exf="family:group"]');
  await chip.click();
  await expect(chip).toHaveAttribute('aria-pressed', 'true');
  expect(new URL(app.page.url()).hash).toBe('#exercises');
  await longPress(chip);
  await expect(app.heading()).toHaveText('The guests');
});

test("a name in a cue: a tap shows her card, a long-press opens the page at her", async ({ app }) => {
  await app.open(`#ex-${EX}`);
  const name = app.page.locator('.facts [data-guest]').first();
  const who = await name.getAttribute('data-guest');
  expect(WOMEN).toContain(who);
  await expect(name).toHaveText(who);
  await name.click();
  const sheet = app.page.getByRole('dialog', { name: who });
  await expect(sheet).toBeVisible();
  await expect(sheet.locator('.gfacts')).toContainText(`${GUESTS[who].age} · ${GUESTS[who].height} cm`);
  await sheet.getByRole('button', { name: 'Close' }).last().click();
  await expect(sheet).toHaveCount(0);
  await longPress(name);
  await expect(app.heading()).toHaveText('The guests');
  expect(decodeURIComponent(new URL(app.page.url()).hash)).toBe(`#guests/${who}`);
  await expect(app.page.locator(`#g-${who}`)).toBeInViewport();
});

test('the print view names her plainly', async ({ app }) => {
  await app.page.addInitScript(() => { window.print = () => {}; }); // the dialog can't open in a test
  await app.open(`#print/ex-${EX}`);
  await expect(app.page.locator('.printview')).toBeVisible();
  await expect(app.page.locator('[data-guest]')).toHaveCount(0);
});
