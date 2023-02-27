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
    Client: require("./client/client.js"),
    DiscordEvents: require("./client/events.js"),
    enums: require("./util/enums.js"),
    packets: require("./util/packets.js"),
    constructs: require("./client/constructs.js"),
    version: require("../package.json").version,
};
