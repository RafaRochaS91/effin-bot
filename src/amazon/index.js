import puppeteer from 'puppeteer';

/**
 * Adds an available item from the wish list into the cart.
 * @param {puppeteer.Browser} browser
 */
export async function addAvailableItemsFromWishListToCart(browser) {
  const accountPage = 'https://www.amazon.de/gp/css/homepage.html';

  const page = await browser.newPage();
  await page.goto(accountPage, { waitUntil: 'networkidle2' });

  const [loginButton] = await page.$x("//span[contains(text(), 'Anmelden')]");
  await loginButton.click();

  await page.waitForSelector('#ap_email');
  await page.focus('#ap_email');
  await page.keyboard.type(process.env.AMAZON_USERNAME);

  await page.click('#continue-announce');
  await page.waitForSelector('#ap_password');

  await page.focus('#ap_password');
  await page.keyboard.type(process.env.AMAZON_PASSWORD);

  await page.click('#signInSubmit');

  await page.waitForTimeout(500);

  const wishListPage =
    'https://www.amazon.de/hz/wishlist/genericItemsPage/ORJV14SVR8KL?type=wishlist&_encoding=UTF8';

  await page.goto(wishListPage);

  let isAnyItemAvailable = false;
  while (!isAnyItemAvailable) {
    await page.waitForTimeout(1000);

    const enabledAddToCartButtons = await page.$x("//a[contains(text(), 'In den Einkaufswagen')]");

    if (enabledAddToCartButtons.length > 0) {
      console.log(`(AMZ) ✅✅ Available items ✅✅: ${enabledAddToCartButtons.length}`);

      isAnyItemAvailable = true;

      await enabledAddToCartButtons[0].click();
      await page.waitForTimeout(800);

      await page.goto('https://www.amazon.de/-/en/gp/cart/view.html?ref_=nav_cart', {
        waitUntil: 'networkidle0',
      });

      console.log(`😱😱😱😱😱😱 PLEASE FINALIZE THE PURCHASE! 😱😱😱😱😱😱`);
    } else {
      console.log(`(AMZ) ❌ No items available ❌`);
      await page.waitForTimeout(30000);
      await page.reload({ waitUntil: 'networkidle0' });
    }
  }
}
