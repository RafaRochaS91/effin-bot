const puppeteer = require("puppeteer");

const website = 'https://saturn.de';

(async function () {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(website);
})();
