import puppeteer from 'puppeteer';

// const CAREFUL_PS4_CATEGORY_URL = 'https://www.saturn.de/de/category/_ps4-konsolen-457550.html';
const PS5_CATEGORY_URL = 'https://www.saturn.de/de/category/_ps5-konsolen-769029.html';

/**
 * Finds PS5 bundles from search in Saturn and add them to the Wish List.
 * @param {puppeteer.Browser} browser
 */
export async function addAvailablePs5ConsolesToWishList(browser) {
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

  await page.goto(PS5_CATEGORY_URL);

  let areItemsAvailable = false;
  while (!areItemsAvailable) {
    const addToWishListButtons = await page.$x(
      '//div[@data-test="mms-search-wishlist-icon-unselected"]'
    );

    if (addToWishListButtons && addToWishListButtons.length) {
      areItemsAvailable = true;
      console.log('(SAT) ✅✅ Available items in the PS5 Category List ✅✅');

      for (const addToWishListButton of addToWishListButtons) {
        await addToWishListButton.click();
      }
    } else {
      console.log(`(SAT) ❌ No items available from PS5 Category List ❌`);
      await page.waitForTimeout(30000);
      await page.reload({ waitUntil: 'load' });
    }
  }
}
