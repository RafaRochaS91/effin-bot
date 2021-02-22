import dotenv from "dotenv";
import puppeteer from 'puppeteer';

import { SUPPORTED_WEBSITES } from "./constants.js";
import { WebsiteNotSupported } from "./errors/WebsiteNotSupported.js";
import { buyFromSaturnWishList } from "./saturn/index.js";
import { checkIfSaturnHasConsole } from './saturn/checkAvailability.js';
import { buyOnMediamarkt } from "./media-markt/index.js";
import { buyOnAmazon } from "./amazon/index.js";

dotenv.config();

const website = process.argv[2];

(async function () {
  const browser = await puppeteer.launch({ headless: false, slowMo: 100 });
  try {
    switch (website) {
      case SUPPORTED_WEBSITES.AMAZON:
        await buyOnAmazon();
        break;
      case SUPPORTED_WEBSITES.MEDIA_MARKT:
        await buyOnMediamarkt();
        break;
      case SUPPORTED_WEBSITES.SATURN_AVAILABILITY:
        await checkIfSaturnHasConsole(browser);
        break;
      case SUPPORTED_WEBSITES.SATURN:
        await buyFromSaturnWishList(browser);
        break;
      default:
        throw new WebsiteNotSupported(website);
    }
  } catch (error) {
    console.error(error.message);
  }
})();
