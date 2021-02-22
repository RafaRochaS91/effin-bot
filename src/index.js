import dotenv from 'dotenv';
import puppeteer from 'puppeteer';

import { SUPPORTED_WEBSITES } from './constants.js';
import { WebsiteNotSupported } from './errors/WebsiteNotSupported.js';
import * as saturn from './saturn/index.js';
import * as mediamarkt from './media-markt/index.js';
import * as amazon from './amazon/index.js';

dotenv.config();

const [, , ...websites] = process.argv;

const websitesMap = {
  [SUPPORTED_WEBSITES.AMAZON]: amazon.addAvailableItemsFromWishListToCart,
  [SUPPORTED_WEBSITES.MEDIA_MARKT]: mediamarkt.buyAvailableItemInWishList,
  [SUPPORTED_WEBSITES.SATURN_AVAILABILITY]: saturn.addAvailablePs5ConsolesToWishList,
  [SUPPORTED_WEBSITES.SATURN]: saturn.buyAvailableItemInWishList,
};

(async function () {
  if (websites.length) {
    const buyFunctions = [];
    for (const website of websites) {
      if (websitesMap[website]) {
        buyFunctions.push(websitesMap[website]);
      } else {
        console.log(new WebsiteNotSupported(website));
        process.exit(1);
      }
    }

    if (buyFunctions.length) {
      const browser = await puppeteer.launch({ headless: false, slowMo: 50 });

      for (const functionToCall of buyFunctions) {
        functionToCall(browser);
      }
    }
  }
})();
