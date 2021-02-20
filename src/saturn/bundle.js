export async function buyBundleOnSaturn(browser) {
    const accountPage = "https://www.saturn.de/de/myaccount";
    const page = await browser.newPage();
  
    await page.goto(accountPage);
    const acceptCookiesButton = await page.waitForSelector(
      "#privacy-layer-accept-all-button",
      { visible: true }
    );
    await acceptCookiesButton.click();
  
    await page.focus("#mms-login-form__email");
    await page.keyboard.type(process.env.SATURN_USERNAME);
  
    await page.focus("#mms-login-form__password");
    await page.keyboard.type(process.env.SATURN_PASSWORD);
  
    await page.click("#mms-login-form__login-button");
    await page.waitForSelector("#mms-login-form__login-button", { hidden: true });

    await page.focus('#search-form');
    await page.keyboard.type("Playstation 5");

    const submitButton = await page.$('[data-test="submit"]');

    await submitButton.click();

    const bundleBrand = 'SONY';
    const bundleTitle = 'PS5 +';

    await page.screenshot({ path: 'filled-search.jpg', fullPage: true });
}