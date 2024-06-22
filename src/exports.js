/**
 *
 *  ## OVERVIEW
 *
 *  Contains all the functions/properties any normal user will see
 *
 *  ## WHEN CONTRIBUTING:
 *
 *  Classes are capitalized.
 *  Properties are lowercase.
 *  Only include stuff the user would realistically use.
 *
 */

module.exports = {
    AccountFactory: require("./client/factory.js"),
    Client: require("./client/client.js"),
    BareClient: require("./client/bare.js"),
    CaptchaRequester: require("./client/captcha.js").CaptchaRequester,
    Internal: require("./auth/fetch.js"),
    Constructs: require("./client/constructs.js"),
    version: require("../package.json").version,
    ...require("./client/def.js"),
};
