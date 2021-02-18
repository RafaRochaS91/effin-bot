import dotenv from "dotenv";

import { SUPPORTED_WEBSITES } from "./constants.js";
import { WebsiteNotSupported } from "./errors/WebsiteNotSupported.js";
import { buyOnSaturn } from "./saturn/index.js";
import { buyOnMediamarkt } from "./media-markt/index.js";

dotenv.config();

const website = process.argv[2];
const version = process.argv[3];

(async function () {
  try {
    const isDigital = version === "digital";

    switch (website) {
      case SUPPORTED_WEBSITES.SATURN:
        await buyOnSaturn(isDigital);
        break;
      case SUPPORTED_WEBSITES.MEDIA_MARKT:
        await buyOnMediamarkt();
        break;
      default:
        throw new WebsiteNotSupported(website);
    }
  } catch (error) {
    console.error(error.message);
  }
})();
