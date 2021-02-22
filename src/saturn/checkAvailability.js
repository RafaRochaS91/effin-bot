import puppeteer from 'puppeteer';

const playstation5CategoryUrl = 'https://www.saturn.de/de/category/_ps5-konsolen-769029.html';
const test = 'https://www.saturn.de/de/category/_ps4-konsolen-457550.html';

/**
 * Finds PS5 bundles from search in Saturn.
 * @param {puppeteer.Browser} browser
 */
export async function checkIfSaturnHasConsole(browser) {
  const accountPage = 'https://www.saturn.de/de/myaccount';
  const page = await browser.newPage();

  await page.goto(accountPage);
  const acceptCookiesButton = await page.waitForSelector('#privacy-layer-accept-all-button', {
    visible: true,
  });
  await acceptCookiesButton.click();

  await page.focus('#mms-login-form__email');
  await page.keyboard.type(process.env.SATURN_USERNAME);

  await page.focus('#mms-login-form__password');
  await page.keyboard.type(process.env.SATURN_PASSWORD);

  await page.click('#mms-login-form__login-button');
  await page.waitForSelector('#mms-login-form__login-button', { hidden: true });

  // add the var test here if you wanna test with ps4 konsolen category
  await page.goto(test);

  let areItemsAvailable = false;

  while (!areItemsAvailable) {
    const productListItemSelector = '[data-test="mms-search-srp-productlist-item"]';

    const elements = await page.$$(productListItemSelector);
    if (elements.length) {
      areItemsAvailable = true;
    } else {
      areItemsAvailable = false;
    }

    if (areItemsAvailable) {
      console.log('(SAT) ✅✅ Available items in the PS5 Category List ✅✅');
      
    } else {
      console.log(`(SAT) ❌ No items available from PS5 Category List ❌`);
      await page.waitForTimeout(30000);
      await page.reload({ waitUntil: 'load' });
    }
  }

  await page.screenshot({ path: 'ps5-category.jpg', fullPage: true });
}
