import puppeteer from "puppeteer";

export async function buyOnMediamarkt() {
  const browser = await puppeteer.launch({ headless: false, slowMo: 200 });
  const page = await browser.newPage();

  // LOGIN
  const accountPage = "https://www.mediamarkt.de/de/myaccount";
  await page.goto(accountPage);

  const acceptCookiesButton = await page.waitForSelector(
    "#privacy-layer-accept-all-button",
    { visible: true }
  );
  await acceptCookiesButton.click();

  await page.focus("#mms-login-form__email");
  await page.keyboard.type(process.env.MEDIA_MARKT_USERNAME);

  await page.focus("#mms-login-form__password");
  await page.keyboard.type(process.env.MEDIA_MARKT_PASSWORD);

  await page.click("#mms-login-form__login-button");
  await page.waitForSelector("#mms-login-form__login-button", { hidden: true });

  // WISH LIST
  const wishListPage = "https://www.mediamarkt.de/de/myaccount/wishlist";
  await page.goto(wishListPage, { waitUntil: "load" });

  let isDigitalAvailable = false;
  let isDiscAvailable = false;
  while (!isDigitalAvailable && !isDiscAvailable) {
    const [addToCartDigital, addToCartDisk] = await page.$x(
      "//button[@data-test='a2c-Button' and not(@disabled)]"
    );

    isDigitalAvailable = !!addToCartDigital;
    isDiscAvailable = !!addToCartDisk;

    console.log(`
    Digital: ${isDigitalAvailable ? "✅" : "❌"}
    Disc: ${isDiscAvailable ? "✅" : "❌"}
    `);

    if (isDigitalAvailable || isDiscAvailable) {
      await page.screenshot({
        path: "mediamarkt-available.png",
        fullPage: true,
      });

      // DIGITAL has the priority
      if (isDigitalAvailable) {
        addToCartDigital.click();
      } else if (isDiscAvailable) {
        addToCartDisk.click();
      }

      await page.waitForTimeout(300);

      await page.goto("https://www.mediamarkt.de/checkout/summary", {
        waitUntil: "networkidle0",
      });

      await page.waitForTimeout(2000);

      // Select credit card option
      const [creditCardOption] = await page.$x(
        "//span[contains(text(), 'Kreditkarte')]"
      );
      await creditCardOption.click();

      await page.screenshot({
        path: "mediamarkt-checkout1.png",
        fullPage: true,
      });

      // Move to next step (overview)
      const [nextStep] = await page.$x(
        "//div[@data-test='checkout-continue-mobile-enabled']/button[contains(text(), 'Weiter')]"
      );
      await nextStep.click();

      await page.screenshot({
        path: "mediamarkt-checkout2.png",
        fullPage: true,
      });

      // Move to Credit Card page
      const [, payButton] = await page.$x(
        "//div[@data-test]/button[contains(text(), 'Fortfahren und bezahlen')]"
      );
      await payButton.click();

      await page.screenshot({
        path: "mediamarkt-checkout3.png",
        fullPage: true,
      });

      await page.waitForSelector("#MMSKKNr");

      await page.focus("#MMSKKNr");
      await page.keyboard.type(process.env.CARD_NUMBER);

      await page.focus("#MMSExpiry");
      await page.keyboard.type(process.env.CARD_EXPIRATION);

      await page.focus("#MMSCCCVC");
      await page.keyboard.type(process.env.CARD_CVC);

      await page.focus("#MMScreditCardHolder");
      await page.keyboard.type(process.env.CARD_HOLDER);

      await page.click("#submitButton");

      console.log("Purchased!");
    } else {
      await page.waitForTimeout(30000);
      await page.reload({ waitUntil: "load" });
    }
  }
}
