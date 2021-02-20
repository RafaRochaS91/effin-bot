import dotenv from "dotenv";
import puppeteer from "puppeteer";

import { SUPPORTED_WEBSITES } from "./constants.js";
import { WebsiteNotSupported } from "./errors/WebsiteNotSupported.js";
import { buyOnSaturn } from "./saturn/index.js";
import { buyOnMediamarkt } from "./media-markt/index.js";
import { buyOnAmazon } from "./amazon/index.js";

dotenv.config();

const website = process.argv[2];

(async function () {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 200,
      args: ['--disable-setuid-sandbox', '--no-sandbox'],
    });
    switch (website) {
      case SUPPORTED_WEBSITES.AMAZON:
        await buyOnAmazon(browser);
        break;
      case SUPPORTED_WEBSITES.MEDIA_MARKT:
        await buyOnMediamarkt(browser);
        break;
      case SUPPORTED_WEBSITES.SATURN:
        await buyOnSaturn(browser);
        break;
      default:
        throw new WebsiteNotSupported(website);
    }
  } catch (error) {
    console.error(error.message);
  }
})();
