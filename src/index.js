import dotenv from 'dotenv';
import puppeteer from 'puppeteer';

import { SUPPORTED_WEBSITES } from './constants.js';
import { WebsiteNotSupported } from './errors/WebsiteNotSupported.js';
import * as saturn from './saturn/index.js';
import * as mediamarkt from './media-markt/index.js';
import * as amazon from './amazon/index.js';

dotenv.config();

const website = process.argv[2];

(async function () {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });

  try {
    switch (website) {
      case SUPPORTED_WEBSITES.AMAZON:
        await amazon.addAvailableItemsFromWishListToCart(browser);
        break;
      case SUPPORTED_WEBSITES.MEDIA_MARKT:
        await mediamarkt.buyAvailableItemInWishList(browser);
        break;
      case SUPPORTED_WEBSITES.SATURN_AVAILABILITY:
        await saturn.addAvailablePs5ConsolesToWishList(browser);
        break;
      case SUPPORTED_WEBSITES.SATURN:
        await saturn.buyAvailableItemInWishList(browser);
        break;
      default:
        throw new WebsiteNotSupported(website);
    }
  } catch (error) {
    console.error(error.message);
  }
})();
