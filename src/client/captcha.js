/**
 *
 *  ## OVERVIEW
 *
 *  Defines a captcha struct.
 *
 */

class Captcha {
    constructor(service, siteKey, siteURL, cookies, userAgent, error) {
        this.service = service;
        this.siteKey = siteKey;
        this.siteURL = siteURL;
        this.cookies = cookies;
        this.userAgent = userAgent;
        this.error = error;
    }
}

module.exports = Captcha;
