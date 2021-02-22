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

  /**
   * add the var test here if you wanna test with ps4 konsolen category
   * BE VERY CAREFUL, DONT HAVE THE OTHER SCRIPT THAT BUYS RUNNING OR ELSE YOU WILL BUY A SHIT TON OF PS4'S
   * */
  await page.goto(playstation5CategoryUrl);

  let areItemsAvailable = false;

  while (!areItemsAvailable) {
    const productListItemSelector = '[data-test="mms-search-srp-productlist-item"]';

    const elements = await page.$$(productListItemSelector);
    if (elements.length) {
      areItemsAvailable = true;
    } else {
      areItemsAvailable = false;
    }

    for (const element of elements) {
      const [clickableElement] = await element.$x(
        '//div[@data-test="mms-search-wishlist-icon-unselected"]'
      );

      await clickableElement.click();
    }

    if (areItemsAvailable) {
      console.log('(SAT) ✅✅ Available items in the PS5 Category List ✅✅');

      // add sms notification with url to manually check the item
    } else {
      console.log(`(SAT) ❌ No items available from PS5 Category List ❌`);
      await page.waitForTimeout(30000);
      await page.reload({ waitUntil: 'load' });
    }
  }
}
