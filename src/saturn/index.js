import puppeteer from "puppeteer";

const versions = {
  DISC:
    "https://www.saturn.de/de/product/_sony-playstation%C2%AE5-2661938.html",
  DIGITAL:
    "https://www.saturn.de/de/product/_sony-playstation%C2%AE5-digital-edition-2661939.html",
};

export async function buyOnSaturn(isDigital) {
  const website = isDigital ? versions.DIGITAL : versions.DISC;

  const accountPage = "https://www.saturn.de/de/myaccount";
  const browser = await puppeteer.launch({ headless: false, slowMo: 200 });
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

  await page.goto(website, { waitUntil: "load" });

  let isAvailable = false;
  while (!isAvailable) {
    const addToCartButton = await page.$("#pdp-add-to-cart-button");

    if (addToCartButton) {
      console.log("✅");

      isAvailable = true;

      await page.screenshot({ path: "available.png", fullPage: true });
      await addToCartButton.click();

      await page.goto("https://www.saturn.de/checkout/summary", {
        waitUntil: "networkidle0",
      });

      await page.screenshot({ path: "pay.png", fullPage: true });

      const [, payButton] = await page.$x(
        "//div[@data-test]/button[contains(text(), 'Fortfahren und bezahlen')]"
      );

      await payButton.click();

      await page.screenshot({ path: "pay2.png", fullPage: true });

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

      await browser.close();
    } else {
      console.log("❌");
      await page.waitForTimeout(10000);
      await page.reload({ waitUntil: "load" });
    }
  }
}
