// Two devices (two browsers with their own storage) on one account, sharing one in-memory remote that lives in the
// test: the page's adapter passes every call to it through Playwright bindings. Progress and account data sync
// through the same seam (Progress Store remote adapter: subscribe / subscribeAll / write / remove).
const base = require('@playwright/test');
const { expect } = base;
const { createMemoryRemote } = require('../app/store.js');

const { device } = require('./devices.js');

base.test('a preferences doc syncs between two browsers, and so does progress', async ({ browser }, testInfo) => {
  base.test.skip(testInfo.project.name !== 'phone-light', 'theme-independent');
  const remote = createMemoryRemote();
  const baseURL = testInfo.project.use.baseURL;
  const one = await device(browser, baseURL, remote, 'one');
  const two = await device(browser, baseURL, remote, 'two');

  await one.page.evaluate(() => store.setDoc('prefs', 'main', { favourites: ['pushup'], travel: true }));
  await two.page.waitForFunction(() => { const d = store.doc('prefs', 'main'); return d && d.favourites[0] === 'pushup'; });
  expect(remote.collections.prefs.main.travel).toBe(true);

  await two.page.evaluate(() => store.setDoc('prefs', 'main', { ...store.doc('prefs', 'main'), travel: false }));
  await one.page.waitForFunction(() => store.doc('prefs', 'main').travel === false);

  await two.page.evaluate(() => { store.setDoc('programs', 'my-push', { name: 'My push day' }); store.setDoc('random', 'r1', { name: 'Quick one' }); });
  await one.page.waitForFunction(() => store.doc('programs', 'my-push') && store.doc('random', 'r1'));
  expect(await one.page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('kb-doc-')).sort()))
    .toEqual(['kb-doc-prefs-main', 'kb-doc-programs-my-push', 'kb-doc-random-r1']);

  await one.page.evaluate(() => store.toggle('three-split-60', 3));
  await two.page.waitForFunction(() => store.isDone('three-split-60', 3));
  expect(Object.keys(remote.docs['three-split-60'].done)).toEqual(['3']);
  expect(Object.keys(remote.docs)).not.toContain('my-push'); // account data never lands in the progress collection

  expect(one.errors).toEqual([]);
  expect(two.errors).toEqual([]);
  await one.context.close(); await two.context.close();
});
