const fs = require('fs-extra');
const path = require('path');

module.exports = generateMetamaskWallet = async (browser, METAMASK_PASSWORD, index) => {
  const page = await browser.newPage();
  await page.goto('chrome-extension://aoipdchdenmkoajeidelgndlmiaiemce/home.html#initialize/welcome');
  await page.waitFor(3000);
  const button = await page.$('.button');
  await button.click();

  await page.waitFor(1000);
  const importTypeButtons = await page.$$('.button');
  await importTypeButtons[1].click();
  const helpUsButtons = await page.$$('.button');
  await helpUsButtons[1].click();

  await page.waitFor(1000);
  await page.waitFor(() => !!document.querySelector('input[id=create-password]'));
  const first = await page.$('input[id=create-password]');
  await first.type(METAMASK_PASSWORD, { delay: 100 })
  await page.waitFor(1000);
  const second = await page.$('input[id=confirm-password]');
  await second.type(METAMASK_PASSWORD, { delay: 100 })
  await page.waitFor(1000);
  await page.$eval('.first-time-flow__checkbox', el => el.click());
  await page.waitFor(1000);
  await page.$eval('.button', el => el.click());

  await page.waitFor(1000);
  await page.waitForNavigation();
  const videoButton = await page.$$('.button');
  await videoButton[0].click();

  await page.waitFor(1000);
  await page.waitFor('.reveal-seed-phrase__secret-blocker');
  await page.$eval('.reveal-seed-phrase__secret-blocker', el => el.click());
  const SEED_PHRASE = await page.$eval('.reveal-seed-phrase__secret-words', (el) => {
    return el.textContent;
  });

  fs.writeFileSync(path.join(__dirname, index.toString()), SEED_PHRASE);

  const conrirmButton = await page.$$('.button');
  await conrirmButton[1].click();

  const words = SEED_PHRASE.split(' ');

  await Promise.all(words.map(async el => {
    await page.$eval(`div[data - testid= "draggable-seed-${el}"]`, el => el.click());
    await page.waitFor(300);
  }))

  await page.$eval('.button', el => el.click());
  await page.waitFor(1000);
  await page.$eval('.button', el => el.click());
  await browser.close();
}