import { SUPPORTED_WEBSITES } from "../constants.js";

export class WebsiteNotSupported extends Error {
  constructor(website) {
    const supportedWebsites = Object.values(SUPPORTED_WEBSITES)
      .map((supportedWebsite) => supportedWebsite)
      .join("\n");

    super(
      `${website} isn't supported, supported websites are:\n${supportedWebsites},`
    );
  }
}
