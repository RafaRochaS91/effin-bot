const { SUPPORTED_WEBSITES } = require("../constants");

class WebsiteNotSupported {
  constructor(website) {
    const supportedWebsites = Object.values(SUPPORTED_WEBSITES)
      .map((supportedWebsite) => supportedWebsite)
      .join("\n");

    super(`${website} isn't supported, supported websites are:
        ${supportedWebsites},
    `);
  }
}

module.exports = { WebsiteNotSupported };
