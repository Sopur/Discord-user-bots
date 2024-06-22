/**
 *
 *  ## OVERVIEW
 *
 *  Contains all the error classes to be thrown in any of the source files.
 *
 */

class DiscordUserBotsError extends Error {
    constructor(message) {
        super(message);
        this.name = "Discord User Bots Error";
    }
}

class DiscordAPIError extends Error {
    constructor(message) {
        super(message);
        this.name = "Discord API Error";
    }
}

class DiscordUserBotsInternalError extends DiscordUserBotsError {
    constructor(message) {
        super(message);
        this.name = "Discord User Bots Internal Error";
    }
}

module.exports = {
    DiscordUserBotsInternalError,
    DiscordUserBotsError,
    DiscordAPIError,
};
