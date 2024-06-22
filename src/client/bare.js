/**
 *
 *  ## OVERVIEW
 *
 *  Defines the base client class.
 *  It is written like this in the case that you want to make your own client class.
 *  In the case you do write your own client class, make sure to use `_set_request_token` with the desired token.
 *
 */

const Events = require("events");
const { FetchRequestOpts, BotConfigOpts } = require("./constructs.js");
const { DiscordUserBotsError, DiscordUserBotsInternalError } = require("../util/error.js");
const ClientData = require("../auth/data.js");
const Requester = require("../auth/fetch.js").Requester;

class BareClient extends Events {
    constructor(config = BotConfigOpts) {
        super();
        this.config = {
            ...BotConfigOpts,
            ...config,
        };
        this.requester = new Requester();
        this.clientData = new ClientData();
        this.set_config(this.config);
    }

    /**
     * Sets authorization token for request building
     * @param {string} token Account token
     */
    _set_request_token(token) {
        this.token = token;
        this.clientData.authorization = token;
    }

    /**
     * Checks if the token is valid
     * @returns {Promise<boolean>}
     */
    async check_token() {
        try {
            await this.requester.fetch_request_secure(
                `users/@me/burst-credits`,
                undefined,
                this.clientData,
                "GET"
            );
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Sets the config with your wanted settings
     * (See the pre-defined config for the defaults)
     * @param {BotConfigOpts} config Config
     */
    set_config(config = this.config) {
        this.config = {
            ...this.config,
            ...config,
        };
        this.requester.api = this.config.api;
        this.requester.url = this.config.url;
        this.lastRequest = Date.now();
        if (typeof this.config.proxy === "string") {
            this.requester.proxy = new URL(this.config.proxy);
        }
    }

    /**
     * Does a client fetch request to Discord
     * @param {string} link The url to fetch to
     * @param {FetchRequestOpts} options Options
     * @returns {Promise<Object>} The response from Discord
     */
    async fetch_request(link, options = FetchRequestOpts) {
        this.lastRequest = Date.now();
        options = {
            ...FetchRequestOpts,
            ...options,
        };
        if (typeof link !== "string") throw new DiscordUserBotsInternalError("Invalid URL");
        const requester = options.secure
            ? this.requester.fetch_request_secure
            : this.requester.fetch_request_insecure;
        return requester.call(
            this.requester,
            link,
            options.body,
            this.clientData,
            options.method,
            options.isMultipartFormData ? options.body.getHeaders() : {}
        );
    }

    /**
     * Parses a discord invite link wether it be a https link or straight code
     * @param {string} invite Invite to parse
     * @returns {string} Raw invite code
     * @static
     */
    static parse_invite_link(invite) {
        if (invite.startsWith("https://discord.gg/"))
            invite = invite.slice("https://discord.gg/".length);
        else if (invite.startsWith("http://discord.gg/"))
            invite = invite.slice("http://discord.gg/".length);
        if (invite.endsWith("/")) invite = invite.slice(0, invite.length - 1);
        return invite;
    }
}

module.exports = BareClient;
