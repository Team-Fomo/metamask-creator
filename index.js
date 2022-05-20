const puppeteer = require('puppeteer-core');
const generateMetamaskWallet = require('./generateMetamaskExtension');

(async () => {
  // Here is your metamask password
  const METAMASK_PASSWORD = '';
  // Here is list of your endpoints to connect
  const wsEndpoints = [];

  await Promise.all(wsEndpoints.map(async (endpoint, idx) => {
    const browser = await puppeteer.connect({ browserWSEndpoint: endpoint });
    await generateMetamaskWallet(browser, METAMASK_PASSWORD, idx + 1);
  }))
})();