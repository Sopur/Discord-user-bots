/**
 *
 *  ## OVERVIEW
 *
 *  This files handles the main client definition.
 *  It includes the event handlers, and action functions.
 *
 *  ## WHEN CONTRIBUTING:
 *
 *  Make sure to call call_check at the start of each function. It covers state checking and argument checking.
 *  Use the DiscordUserBotsError class when throwing an error to the user.
 *  Use the DiscordAPIError class when throwing an error based on Discord's response.
 *  Use the DiscordUserBotsInternalError class when throwing an error because of false behavior of the Client class.
 *  Make sure to include a description and the parameters as comments above the function.
 *  Use the fetch_request private function when sending a fetch request to Discord.
 *
 */

const WebSocket = require("ws");
const NodeFetch = require("node-fetch");
const { FetchRequestOpts, SendMessageOpts, CustomStatusOpts, CreateInviteOpts, BotConfigOpts } = require("./constructs.js");
const { DiscordUserBotsError, DiscordAPIError, DiscordUserBotsInternalError } = require("../util/error.js");
const { ReadyStates } = require("../util/enums.js");
const DiscordEvents = require("./events.js");
const constructs = require("./constructs.js");
const packets = require("../util/packets.js");

class Client {
    /**
     * DISCORD-USER-BOTS CLIENT INSTANCE
     * @author Sopur, Discord: Sopur#3550
     * @license MIT
     * @warn WHATEVER HAPPENS TO YOUR ACCOUNT AS A RESULT OF THIS LIBRARY IS WITHIN YOUR OWN LIABILITY. THIS LIBRARY IS MADE PURELY FOR TESTS AND FUN. USE AT YOUR OWN RISK.
     * @param {string} token Auth token for the user account you want to login to
     */
    constructor(token, config = BotConfigOpts) {
        if (typeof token !== "string") throw new DiscordUserBotsError("Invalid token");
        this.config = {
            ...BotConfigOpts,
            ...config,
        };
        this.token = token;
        this.lastHeartBeat = undefined;
        this.ready_status = ReadyStates.OFFLINE;
        this.typingLoop = function () {};
        this.on = new DiscordEvents();

        // If node is version 18.x or above use the native fetch, otherwise the node-fetch.
        this.requester = typeof fetch !== "undefined" ? fetch : NodeFetch;

        this.check_token().then((res) => {
            if (res === true) this.setEvents();
            else throw new DiscordAPIError(`Discord rejected token "${token}" (Not valid)`);
        });
    }

    /**
     * Used after the token checking to set everything
     * @private
     */
    setEvents() {
        this.ready_state = ReadyStates.CONNECTING;
        this.ws = new WebSocket(this.config.wsurl);
        this.ws.on("message", (message) => {
            message = JSON.parse(message);
            switch (message.t) {
                case null: {
                    // gateway
                    if (this.ready_status !== ReadyStates.CONNECTED) {
                        if (message.d === null) throw new DiscordAPIError("Discord refused a connection.");
                        this.heartbeattimer = message.d.heartbeat_interval;
                        this.heartbeatinterval = setInterval(() => {
                            this.ws.send(JSON.stringify(new packets.HeartBeat(this.lastHeartBeat)));
                            this.on.heartbeat_sent();
                        }, this.heartbeattimer);
                        this.ws.send(JSON.stringify(new packets.GateWayOpen(this.token, this.config)));
                        this.on.gateway();
                    } else {
                        this.on.heartbeat_received();
                    }
                    break;
                }
                case "READY": {
                    // Gateway res
                    let user = message.d;
                    this.user_settings = user.user_settings; // An object full of properties of settings
                    this.user = user.user; // An object full of properties about the user like username etc
                    this.tutorial = user.tutorial; // A property
                    this.session_id = user.session_id; // String of random characters
                    this.notes = user.notes; // An object that contains all the notes the user has on other people
                    this.guild_join_requests = user.guild_join_requests; // An array
                    this.user_guild_settings = user.user_guild_settings; // An array of Objects
                    this.relationships = user.relationships; // An array of Objects
                    this.read_state = user.read_state; // An array of Objects
                    this.private_channels = user.private_channels; // An array of Objects
                    this.presences = user.presences; // An array of Objects
                    this.guilds = user.guilds; // An array of Objects
                    this.guild_experiments = user.guild_experiments; // An array containing arrays
                    this.geo_ordered_rtc_regions = user.geo_ordered_rtc_regions; // An array of strings
                    this.friend_suggestion_count = user.friend_suggestion_count; // An integer
                    this.experiments = user.experiments; // An array containing arrays
                    this.country_code = user.country_code; // A string
                    this.consents = user.consents; // An Object containing objects
                    this.connected_accounts = user.connected_accounts; // An array of Objects
                    this.analytics_token = user.analytics_token; // A string
                    this._trace = user._trace; // Stringified json

                    this.ready_status = ReadyStates.CONNECTED;
                    this.on.ready();
                    break;
                }
                case "VOICE_SERVER_UPDATE": {
                    this.on.voice_server_update(message.d);
                    break;
                }
                case "USER_UPDATE": {
                    this.on.user_update(message.d);
                    break;
                }
                case "APPLICATION_COMMAND_CREATE": {
                    this.on.application_command_create(message.d);
                    break;
                }
                case "APPLICATION_COMMAND_UPDATE": {
                    this.on.application_command_update(message.d);
                    break;
                }
                case "APPLICATION_COMMAND_DELETE": {
                    this.on.application_command_delete(message.d);
                    break;
                }
                case "INTERACTION_CREATE": {
                    this.on.interaction_create(message.d);
                    break;
                }
                case "GUILD_CREATE": {
                    this.on.guild_create(message.d);
                    break;
                }
                case "GUILD_DELETE": {
                    this.on.guild_delete(message.d);
                    break;
                }
                case "GUILD_ROLE_CREATE": {
                    this.on.guild_role_create(message.d);
                    break;
                }
                case "GUILD_ROLE_UPDATE": {
                    this.on.guild_role_update(message.d);
                    break;
                }
                case "GUILD_ROLE_DELETE": {
                    this.on.guild_role_delete(message.d);
                    break;
                }
                case "THREAD_CREATE": {
                    this.on.thread_create(message.d);
                    break;
                }
                case "THREAD_UPDATE": {
                    this.on.thread_update(message.d);
                    break;
                }
                case "THREAD_DELETE": {
                    this.on.thread_delete(message.d);
                    break;
                }
                case "THREAD_LIST_SYNC": {
                    this.on.thread_list_sync(message.d);
                    break;
                }
                case "THREAD_MEMBER_UPDATE": {
                    this.on.thread_member_update(message.d);
                    break;
                }
                case "THREAD_MEMBERS_UPDATE": {
                    this.on.thread_members_update(message.d);
                    break;
                }
                case "CHANNEL_CREATE": {
                    this.on.channel_create(message.d);
                    break;
                }
                case "CHANNEL_DELETE": {
                    this.on.channel_delete(message.d);
                    break;
                }
                case "CHANNEL_PINS_UPDATE": {
                    this.on.channel_pins_update(message.d);
                    break;
                }
                case "GUILD_MEMBER_ADD": {
                    this.on.guild_member_add(message.d);
                    break;
                }
                case "GUILD_MEMBER_UPDATE": {
                    this.on.guild_member_update(message.d);
                    break;
                }
                case "GUILD_MEMBER_REMOVE": {
                    this.on.guild_member_remove(message.d);
                    break;
                }
                case "GUILD_BAN_ADD": {
                    this.on.guild_ban_add(message.d);
                    break;
                }
                case "GUILD_BAN_REMOVE": {
                    this.on.guild_ban_remove(message.d);
                    break;
                }
                case "GUILD_EMOJIS_UPDATE": {
                    this.on.guild_emojis_update(message.d);
                    break;
                }
                case "GUILD_STICKERS_UPDATE": {
                    this.on.guild_stickers_update(message.d);
                    break;
                }

                case "GUILD_INTEGRATIONS_UPDATE": {
                    this.on.guild_integrations_update(message.d);
                    break;
                }
                case "GUILD_WEBHOOKS_UPDATE": {
                    this.on.guild_webhooks_update(message.d);
                    break;
                }
                case "INVITE_CREATE": {
                    this.on.invite_create(message.d);
                    break;
                }
                case "INVITE_DELETE": {
                    this.on.invite_delete(message.d);
                    break;
                }
                case "VOICE_STATE_UPDATE": {
                    this.on.voice_state_update(message.d);
                    break;
                }
                case "PRESENCE_UPDATE": {
                    this.on.presence_update(message.d);
                    break;
                }
                case "MESSAGE_CREATE": {
                    this.on.message_create(message.d);
                    break;
                }
                case "MESSAGE_UPDATE": {
                    if (message.d.flags !== undefined && message.d.flags << 5 === 0 && Object.keys(message.d).length === 4) {
                        this.on.thread_delete(message.d);
                        break;
                    }
                    switch (message.type) {
                        case undefined: {
                            // Embed
                            this.on.embed_sent(message.d);
                            break;
                        }
                        case 0: {
                            // Message edit
                            this.on.message_edit(message.d);
                            break;
                        }
                    }
                    break;
                }
                case "MESSAGE_DELETE": {
                    this.on.message_delete(message.d);
                    break;
                }
                case "MESSAGE_DELETE_BULK": {
                    this.on.message_delete_bulk(message.d);
                    break;
                }
                case "MESSAGE_REACTION_ADD": {
                    this.on.message_reaction_add(message.d);
                    break;
                }
                case "MESSAGE_REACTION_REMOVE": {
                    this.on.message_reaction_remove(message.d);
                    break;
                }
                case "MESSAGE_REACTION_REMOVE_ALL": {
                    this.on.message_reaction_remove_all(message.d);
                    break;
                }
                case "MESSAGE_REACTION_REMOVE_EMOJI": {
                    this.on.message_reaction_remove_emoji(message.d);
                    break;
                }
                case "TYPING_START": {
                    this.on.typing_start(message.d);
                    break;
                }
            }
        });

        this.ws.on("close", () => this.on.discord_disconnect());
    }

    /**
     * Checks the state of the client and arguments
     * @param {Array<any>} args
     * @private
     */
    call_check(args) {
        if (this.ready_status !== ReadyStates.CONNECTED) throw new DiscordUserBotsError(`Client is in a ${ReadyStates[this.ready_status]} state`);
        for (const arg of args) {
            if (!arg) throw new DiscordUserBotsError(`Invalid parameter "${arg}"`);
        }
    }

    /**
     * Parses a discord invite link wether it be a https link or straight code
     * @param {string} invite Invite to parse
     * @returns {string} Raw invite code
     */
    parse_invite_link(invite) {
        if (invite.startsWith("https://discord.gg/")) invite = invite.slice("https://discord.gg/".length);
        else if (invite.startsWith("http://discord.gg/")) invite = invite.slice("http://discord.gg/".length);
        if (invite.endsWith("/")) invite = invite.slice(0, invite.length - 1);
        return invite;
    }

    /**
     * Closes an active connection gracefully
     */
    close() {
        this.call_check(arguments);
        this.ws.close();
    }

    /**
     * Terminates an active connection by
     * shutting down the connection immediately.
     */
    terminate() {
        this.call_check(arguments);
        this.ws.terminate();
    }

    /**
     * Checks if the token is valid
     * @returns {Promise<boolean>}
     * @private
     */
    check_token() {
        return new Promise((resolve) => {
            this.requester(`https://discord.com/api/${this.config.api}/users/@me`, new packets.TokenCheck(this.token)).then((r) => {
                r.json().then((res) => {
                    resolve(res.message !== "401: Unauthorized");
                });
            });
        });
    }

    /**
     * Sets the config with your wanted settings
     * (See the pre-defined config for the defaults)
     * @param {string} api Discord API to use
     * @param {string} wsurl Discord URL to use for the events
     * @param {string} os OS to use
     * @param {string} bd DB to use
     * @param {string} language Language to use
     * @param {number} typinginterval The typing interval used when using the type() function
     */
    set_config(config = this.config) {
        this.config = {
            ...this.config,
            ...config,
        };
    }

    /**
     * Does a client fetch request to Discord
     * @param {string} link The url to fetch to
     * @param {FetchRequestOpts} options Options
     * @returns {Promise<Object>} The response from Discord
     * @private
     */
    async fetch_request(link, options = FetchRequestOpts) {
        options = {
            ...FetchRequestOpts,
            ...options,
        };
        if (typeof link !== "string") throw new DiscordUserBotsInternalError("Couldn't fetch");
        return new Promise((res, rej) => {
            this.requester(`https://discord.com/api/${this.config.api}/${link}`, {
                headers: {
                    accept: "*/*",
                    "accept-language": this.config.language,
                    authorization: this.token,
                    "content-type": "application/json",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-discord-locale": this.config.language,
                    ...(options.isMultipartFormData ? options.body.getHeaders() : {}),
                },
                referrer: `https://discord.com/channels/@me`,
                referrerPolicy: "no-referrer-when-downgrade",
                body: options.body,
                method: options.method,
                mode: "cors",
                credentials: "include",
            }).then((response) => {
                if (options.parse) {
                    response.json().then((m) => {
                        res(m);
                    });
                } else {
                    res(response);
                }
            });
        });
    }

    /**
     * Fetches messages from Discord
     * @param {number} limit Amount of messages to get (Limit is 100)
     * @param {string} channel_id Channel ID to fetch from
     * @param {string} before_message_id An offset when getting messages (Optional)
     * @returns {Promise<Array<Object>>}
     */
    async fetch_messages(limit, channel_id, before_message_id = false) {
        this.call_check(arguments);
        if (limit > 100) throw new DiscordUserBotsError("Cannot fetch more than 100 messages at a time.");
        return await this.fetch_request(
            `channels/${channel_id}/messages?${before_message_id === false ? "" : `before=${before_message_id}&`}limit=${limit}`,
            {
                method: "GET",
                body: null,
                parse: true,
            }
        );
    }

    /**
     * Fetches all the info about the guild given
     * @param {string} guild_id The guild ID to fetch
     * @returns {Promise<Object>} The guild info
     */
    async get_guild(guild_id) {
        this.call_check(arguments);
        return await this.fetch_request(`guilds/${guild_id}`, {
            method: "GET",
            body: null,
            parse: true,
        });
    }

    /**
     * Joins the guild the invite code is pointing to
     * @param {string} invite The Discord invite
     * @returns {Promise<Object>} The response from Discord
     * @deprecated
     * @warn May disable your account
     */
    async join_guild(invite) {
        this.call_check(arguments);
        invite = this.parse_invite_link(invite);
        return await this.fetch_request(`invites/${this.parse_invite_link(invite)}`, {
            body: "{}",
            method: "POST",
            parse: true,
        });
    }

    /**
     * Gets info about an invite link
     * @param {string} invite The Discord invite
     * @returns {Promise<Object>} The response from Discord
     */
    async get_invite_info(invite) {
        this.call_check(arguments);
        const code = this.parse_invite_link(invite);
        return await this.fetch_request(`invites/${code}?inputValue=https%3A%2F%2Fdiscord.gg%2F${code}&with_counts=true&with_expiration=true`, {
            method: "GET",
            body: null,
            parse: true,
        });
    }

    /**
     * Leaves a server
     * @param {string} guild_id The guild ID to leave from
     * @returns {Promise<Object>} The response from Discord
     */
    async leave_guild(guild_id) {
        this.call_check(arguments);
        return await this.fetch_request(`users/@me/guilds/${guild_id}/delete`, {
            method: "DELETE",
            body: null,
            parse: false,
        });
    }

    /**
     * Deletes a server if you're owner
     * @param {string} guild_id The guild to delete
     * @returns {Promise<Object>} The response from Discord
     */
    async delete_guild(guild_id) {
        return await this.fetch_request(`guilds/${guild_id}`, {
            method: "DELETE",
            body: null,
            parse: false,
        });
    }

    /**
     * Sends a message
     * @param {string} channel_id Channel to send in
     * @param {SendMessageOpts} data Options
     * @returns {Promise<object>}
     */
    async send(channel_id, data = SendMessageOpts) {
        this.call_check(arguments);
        data = new constructs.SendMessage(data);
        return await this.fetch_request(`channels/${channel_id}/messages`, {
            isMultipartFormData: data.isMultipartFormData,
            body: data.content,
            method: "POST",
            parse: true,
        });
    }

    /**
     * Edits a message
     * @param {string} message_id Message to edit
     * @param {string} channel_id Channel the message is in
     * @param {string} content The content to change to
     * @returns {Promise<object>}
     */
    async edit(message_id, channel_id, content) {
        this.call_check(arguments);
        return await this.fetch_request(`channels/${channel_id}/messages/${message_id}`, {
            body: JSON.stringify({
                content: content,
            }),
            method: "PATCH",
            parse: false,
        });
    }

    /**
     * Deletes a message
     * @param {string} target_message_id The message to delete
     * @param {string} channel_id The channel the message is in
     * @returns {Promise<Object>} The response from Discord
     */
    async delete_message(target_message_id, channel_id) {
        this.call_check(arguments);
        return await this.fetch_request(`channels/${channel_id}/messages/${target_message_id}`, {
            body: null,
            method: "DELETE",
            parse: false,
        });
    }

    /**
     * Types in the channel given
     * @param {string} channel_id The channel ID to type in
     */
    async type(channel_id) {
        this.call_check(arguments);

        this.typingLoop = setInterval(async () => {
            await this.fetch_request(`channels/${channel_id}/typing`, {
                body: null,
                method: "POST",
                parse: false,
            });
        }, this.config.typinginterval);

        return await this.fetch_request(`channels/${channel_id}/typing`, {
            body: null,
            method: "POST",
            parse: false,
        });
    }

    /**
     * Stops typing
     * @returns {boolean} Success or not
     */
    async stop_type() {
        this.call_check(arguments);
        clearInterval(this.typingLoop);
        return true;
    }

    /**
     * Creates or retrieves existing channel with given recipients
     * @param {Array<string>} recipients The IDs fo the people to be in the group when it's made
     * @returns {Promise<Object>} The group info
     */
    async group(recipients) {
        this.call_check(arguments);
        return await this.fetch_request(`users/@me/channels`, {
            body: JSON.stringify({
                recipients: recipients,
            }),
            method: "POST",
            parse: true,
        });
    }

    /**
     * Leaves a group
     * @param {string} group_id The group ID to leave
     * @returns {Promise<Object>} The response from Discord
     */
    async leave_group(group_id) {
        this.call_check(arguments);
        return await this.fetch_request(`channels/${group_id}`, {
            body: null,
            method: "DELETE",
            parse: false,
        });
    }

    /**
     * Removes someone from a group
     * @param {string} person_id Person ID to be removed
     * @param {string} channel_id Group ID to have someone removed from
     * @returns {Promise<Object>} The response from Discord
     */
    async remove_person_from_group(person_id, channel_id) {
        this.call_check(arguments);
        return await this.fetch_request(`channels/${channel_id}/recipients/${person_id}`, {
            body: null,
            method: "DELETE",
            parse: false,
        });
    }

    /**
     * Renames a group
     * @param {string} name The name
     * @param {string} group_id The group ID to be renamed
     * @returns {Promise<Object>} The response from Discord
     */
    async rename_group(name, group_id) {
        this.call_check(arguments);
        return await this.fetch_request(`channels/${group_id}`, {
            body: JSON.stringify({
                name: name,
            }),
            method: "PATCH",
            parse: false,
        });
    }

    /**
     * Creates a server
     * @param {string} name Name of the server
     * @param {string} guild_template_code The template of the server (Optional) (Default "2TffvPucqHkN")
     * @param {string} icon The icon in base64 (Optional)
     */
    async create_server(name, guild_template_code = "2TffvPucqHkN", icon = null) {
        this.call_check(arguments);
        return await this.fetch_request(`guilds/templates/${guild_template_code}`, {
            body: JSON.stringify({
                name: name,
                icon: icon,
                // channels: [],
                // system_channel_id: null,
                // guild_template_code: guild_template_code,
            }),
            method: "POST",
            parse: true,
        });
    }

    /**
     * Creates a thread off of a message
     * @param {string} message_id The target message ID
     * @param {string} channel_id The target channel ID
     * @param {string} name The name of the thread
     * @param {number} auto_archive_duration How long util the thread auto archives (Optional) (Default 1440)
     * @returns {Promise<Object>} The response from Discord
     */
    async create_thread_from_message(message_id, channel_id, name, auto_archive_duration = 1440) {
        this.call_check(arguments);
        return await this.fetch_request(`channels/${channel_id}/messages/${message_id}/threads`, {
            body: JSON.stringify({
                name: name,
                type: 11,
                auto_archive_duration: auto_archive_duration,
                location: "Message",
            }),
            method: "POST",
            parse: true,
        });
    }

    /**
     * Creates a thread in a channel
     * @param {string} channel_id Channel to create the thread in
     * @param {string} name The name of the thread
     * @param {number} auto_archive_duration How long util the thread auto archives (Optional) (Default 1440)
     * @returns {Promise<Object>} The response from Discord
     */
    async create_thread(channel_id, name, auto_archive_duration = 1440) {
        this.call_check(arguments);
        return await this.fetch_request(`channels/${channel_id}/threads`, {
            body: JSON.stringify({
                name: name,
                type: 11,
                auto_archive_duration: auto_archive_duration,
                location: "Thread Browser Toolbar",
            }),
            method: "POST",
            parse: true,
        });
    }

    /**
     * Deletes a thread
     * @param {string} thread_id The ID of the thread to delete
     * @returns {Promise<Object>} The response from Discord
     */
    async delete_thread(thread_id) {
        this.call_check(arguments);
        return await this.fetch_request(`channels/${thread_id}`, {
            body: null,
            method: "DELETE",
            parse: false,
        });
    }

    /**
     * Adds a reaction to a message
     * @param {string} message_id The message to add a reaction to
     * @param {string} channel_id The channel the message is in
     * @param {string} emoji Emoji to react with (Cannot be ":robot:" has to be an actual emoji like "🤖")
     * @returns {Promise<Object>} The response from Discord
     */
    async add_reaction(message_id, channel_id, emoji) {
        this.call_check(arguments);
        return await this.fetch_request(`channels/${channel_id}/messages/${message_id}/reactions/${encodeURI(emoji)}/%40me`, {
            body: null,
            method: "PUT",
            parse: false,
        });
    }

    /**
     * Remove a reaction to a message
     * @param {string} message_id The message to remove a reaction to
     * @param {string} channel_id The channel the message is in
     * @param {string} emoji Emoji to react with (Cannot be ":robot:" has to be an actual emoji like "🤖")
     * @returns {Promise<Object>} The response from Discord
     */
    async remove_reaction(message_id, channel_id, emoji) {
        this.call_check(arguments);
        return await this.fetch_request(`channels/${channel_id}/messages/${message_id}/reactions/${encodeURI(emoji)}/%40me`, {
            body: null,
            method: "DELETE",
            parse: false,
        });
    }

    /**
     * Changes your visibility
     * @param {"online" | "idle" | "dnd" | "invisible"} status Status to change to (Must be "online", "idle", "dnd", or "invisible")
     * @returns {Promise<Object>} The response from Discord
     */
    async change_status(status) {
        this.call_check(arguments);
        if (["online", "idle", "dnd", "invisible"].includes(status) === false) {
            throw new DiscordUserBotsError(`Status must be "online", "idle", "dnd", or "invisible"`);
        }
        return await this.fetch_request(`users/@me/settings`, {
            body: JSON.stringify({
                status: status,
            }),
            method: "PATCH",
            parse: false,
        });
    }

    /**
     * Sets a custom status
     * @param {CustomStatusOpts} custom_status The custom status options
     * @returns {Promise<Object>} The response from Discord
     */
    async set_custom_status(custom_status = CustomStatusOpts) {
        this.call_check(arguments);
        return await this.fetch_request(`users/@me/settings`, {
            body: JSON.stringify({
                custom_status: new constructs.CustomStatus(custom_status).contents,
            }),
            method: "PATCH",
            parse: false,
        });
    }

    /**
     * Creates an invite
     * @param {string} channel_id The channel
     * @param {CreateInviteOpts} inviteOpts Invite options
     * @returns {Promise<Object>} The response from Discord (invite code is under .code)
     */
    async create_invite(channel_id, inviteOpts = CreateInviteOpts) {
        this.call_check(arguments);
        const opts = {
            createInviteOpts: CreateInviteOpts,
            ...inviteOpts,
        };
        return await this.fetch_request(`/channels/${channel_id}/invites`, {
            method: "POST",
            body: JSON.stringify(opts),
            parse: true,
        });
    }
}

module.exports = Client;
