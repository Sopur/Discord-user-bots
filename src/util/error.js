/**
 *
 *  ## OVERVIEW
 *
 *  Contains all the error classes to be thrown in any of the source files.
 *
 *  ## WHEN CONTRIBUTING:
 *
 *  Make sure each class extends the error class.
 *  Each class has a "<name> : ${message}" prefix.
 *
 */

class DiscordUserBotsError extends Error {
    constructor(message) {
        super(`Discord User Bots: ${message}`);
    }
}

class DiscordAPIError extends Error {
    constructor(message) {
        super(`Discord API Error: ${message}`);
    }
}

class DiscordUserBotsInternalError extends DiscordUserBotsError {
    constructor(message) {
        super(`(Internal Error): ${message}`);
    }
}

module.exports = {
    DiscordUserBotsInternalError,
    DiscordUserBotsError,
    DiscordAPIError,
};
