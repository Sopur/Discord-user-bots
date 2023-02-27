/**
 *
 *  ## OVERVIEW
 *
 *  Defines the main client class.
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
const ProxyHTTPS = require("https-proxy-agent");
const { FetchRequestOpts, SendMessageOpts, CustomStatusOpts, CreateInviteOpts, BotConfigOpts } = require("./constructs.js");
const { DiscordUserBotsError, DiscordAPIError, DiscordUserBotsInternalError } = require("../util/error.js");
const { ReadyStates } = require("../util/enums.js");
const DiscordEvents = require("./events.js");
const constructs = require("./constructs.js");
const packets = require("../util/packets.js");
const ClientData = require("../auth/data.js");
const Requester = require("../auth/fetch.js");

class Client {
    /**
     * DISCORD-USER-BOTS CLIENT INSTANCE
     * @author Sopur, Discord: Sopur#3550
     * @license MIT
     * @warn WHATEVER HAPPENS TO YOUR ACCOUNT AS A RESULT OF THIS LIBRARY IS WITHIN YOUR OWN LIABILITY. THIS LIBRARY IS MADE PURELY FOR TESTS AND FUN. USE AT YOUR OWN RISK.
     * @param {string} token Auth token for the user account you want to login to
     * @param {BotConfigOpts} config The configuration for the Client
     */
    constructor(token, config = BotConfigOpts) {
        if (typeof token !== "string") throw new DiscordUserBotsError("Invalid token");
        this.config = {
            ...BotConfigOpts,
        };
        this.token = token;
        this.messageCounter = 0;
        this.readyStatusCallback = function () {};
        this.ready_status = ReadyStates.OFFLINE;
        this.typingLoop = function () {};
        this.on = new DiscordEvents();
        this.requester = new Requester();
        this.clientData = new ClientData();
        this.clientData.authorization = this.token;
        this.set_config(config);
        this.check_token().then(async (res) => {
            if (res === true) {
                await this.clientData.gen(this.requester);
                this.createWS();
            } else throw new DiscordAPIError(`Discord rejected token "${token}" (Not valid)`);
        });
    }

    /**
     * Used after the token checking to set everything
     * @private
     */
    createWS() {
        this.ready_status = ReadyStates.CONNECTING;

        this.ws = new WebSocket(this.config.wsurl, {
            origin: this.requester.url,
            agent: this.requester.proxy,
        });
        this.ws.on("message", (message) => {
            message = JSON.parse(message);
            if (message.t !== null) this.messageCounter += 1;
            switch (message.t) {
                case null: {
                    // gateway
                    if (this.ready_status !== ReadyStates.CONNECTED) {
                        if (message.d === null) throw new DiscordAPIError("Discord refused a connection.");
                        this.heartbeattimer = message.d.heartbeat_interval;
                        this.heartbeatinterval = setInterval(() => {
                            const packet = new packets.HeartBeat(this.messageCounter);
                            this.ws.send(JSON.stringify(packet));
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
                    this.info = message.d;
                    break;
                }
                case "READY_SUPPLEMENTAL": {
                    // Extra splash screen info
                    this.info.supplemental = message.d;
                    this.ready_status = ReadyStates.CONNECTED;
                    this.readyStatusCallback();
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
                    this.on.thread_join(message.d);
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
                    switch (message.d.type) {
                        case 1: {
                            // RECIPIENT_ADD
                            this.on.recipient_add(message.d);
                            break;
                        }
                        case 2: {
                            // RECIPIENT_REMOVE
                            this.on.recipient_remove(message.d);
                            break;
                        }
                        case 3: {
                            // CALL
                            this.on.call(message.d);
                            break;
                        }
                        case 4: {
                            // CHANNEL_NAME_CHANGE
                            this.on.channel_name_change(message.d);
                            break;
                        }
                        case 5: {
                            // CHANNEL_ICON_CHANGE
                            this.on.channel_icon_change(message.d);
                            break;
                        }
                        case 6: {
                            // CHANNEL_PINNED_MESSAGE
                            this.on.channel_pinned_message(message.d);
                            break;
                        }
                        case 7: {
                            // USER_JOIN
                            this.on.user_join(message.d);
                            break;
                        }
                        case 8: {
                            // GUILD_BOOST
                            this.on.guild_boost(message.d);
                            break;
                        }
                        case 9: {
                            // GUILD_BOOST_TIER_1
                            this.on.guild_boost_tier_1(message.d);
                            break;
                        }
                        case 10: {
                            // GUILD_BOOST_TIER_2
                            this.on.guild_boost_tier_2(message.d);
                            break;
                        }
                        case 11: {
                            // GUILD_BOOST_TIER_3
                            this.on.guild_boost_tier_3(message.d);
                            break;
                        }
                        case 12: {
                            // CHANNEL_FOLLOW_ADD
                            this.on.channel_follow_add(message.d);
                            break;
                        }
                        case 14: {
                            // GUILD_DISCOVERY_DISQUALIFIED
                            this.on.guild_discovery_disqualified(message.d);
                            break;
                        }
                        case 15: {
                            // GUILD_DISCOVERY_REQUALIFIED
                            this.on.guild_discovery_requalified(message.d);
                            break;
                        }
                        case 16: {
                            // GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING
                            this.on.guild_discovery_grace_period_initial_warning(message.d);
                            break;
                        }
                        case 17: {
                            // GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING
                            this.on.guild_discovery_grace_period_final_warning(message.d);
                            break;
                        }
                        case 18: {
                            // THREAD_CREATED
                            this.on.thread_create(message.d);
                            break;
                        }
                        case 19: {
                            // REPLY
                            this.on.reply(message.d);
                            break;
                        }
                        case 20: {
                            // CHAT_INPUT_COMMAND
                            this.on.chat_input_command(message.d);
                            break;
                        }
                        case 21: {
                            // THREAD_STARTER_MESSAGE
                            this.on.thread_starter_message(message.d);
                            break;
                        }
                        case 22: {
                            // GUILD_INVITE_REMINDER
                            this.on.guild_invite_reminder(message.d);
                            break;
                        }
                        case 23: {
                            // CONTEXT_MENU_COMMAND
                            this.on.context_menu_command(message.d);
                            break;
                        }
                        case 24: {
                            // AUTO_MODERATION_ACTION
                            this.on.auto_moderation_action(message.d);
                            break;
                        }
                        case 25: {
                            // ROLE_SUBSCRIPTION_PURCHASE
                            this.on.role_subscription_purchase(message.d);
                            break;
                        }
                        case 26: {
                            // INTERACTION_PREMIUM_UPSELL
                            this.on.interaction_premium_upsell(message.d);
                            break;
                        }
                        case 27: {
                            // GUILD_APPLICATION_PREMIUM_SUBSCRIPTION
                            this.on.guild_application_premium_subscription(message.d);
                            break;
                        }
                        default: {
                            // DEFAULT
                            this.on.message_create(message.d);
                        }
                    }
                    break;
                }
                case "MESSAGE_UPDATE": {
                    if (message.d.content !== undefined) {
                        this.on.message_edit(message.d);
                    } else if (message.d.flags !== undefined) {
                        if (message.d.flags === 0) {
                            this.on.thread_delete(message.d);
                        } else if (message.d.flags === 32) {
                            this.on.thread_create(message.d);
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
                case "RELATIONSHIP_ADD": {
                    this.on.relationship_add(message.d);
                    break;
                }
                case "RELATIONSHIP_REMOVE": {
                    this.on.relationship_remove(message.d);
                    break;
                }
            }
        });

        this.ws.on("close", () => {
            this.on.discord_disconnect();
            if (this.config.autoReconnect) {
                this.createWS();
                this.on.discord_reconnect();
            }
        });
    }

    reconnect() {
        if (this.ws.readyState !== WebSocket.OPEN) {
            this.createWS();
            this.on.discord_reconnect();
        } else {
            this.ws.close();
            if (!this.config.autoReconnect) {
                this.createWS();
            }
        }
    }

    /**
     * Checks the state of the client and arguments
     * @param {Array<any>} args
     * @private
     */
    async call_check(args) {
        if (this.ready_status === ReadyStates.CONNECTING) {
            // Waiting for connection before preforming request...
            await new Promise((res) => {
                this.readyStatusCallback = () => {
                    res();
                    // Connected! Will continue
                };
            });
            this.readyStatusCallback = function () {};
        }
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
        if (this.ws.readyState !== WebSocket.OPEN) throw new DiscordUserBotsError("Cannot close a connection that isn't open");
        this.config.autoReconnect = false;
        this.ws.close();
        this.ws.removeAllListeners();
    }

    /**
     * Terminates an active connection by
     * shutting down the connection immediately.
     */
    terminate() {
        if (this.ws.readyState !== WebSocket.OPEN) throw new DiscordUserBotsError("Cannot terminate a connection that isn't open");
        this.config.autoReconnect = false;
        this.ws.terminate();
        this.ws.removeAllListeners();
    }

    /**
     * Checks if the token is valid
     * @returns {Promise<boolean>}
     * @private
     */
    check_token() {
        return new Promise((resolve) => {
            this.requester.fetch_request(`users/@me`, undefined, this.clientData, "GET").then((res) => {
                resolve(res.message !== "401: Unauthorized");
            });
        });
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
        if (typeof this.config.proxy === "string") {
            this.requester.proxy = ProxyHTTPS(this.config.proxy);
        }
    }

    /**
     * Does a client fetch request to Discord
     * @param {string} link The url to fetch to
     * @param {FetchRequestOpts} options Options
     * @returns {Promise<Object>} The response from Discord
     */
    async fetch_request(link, options = FetchRequestOpts) {
        options = {
            ...FetchRequestOpts,
            ...options,
        };
        if (typeof link !== "string") throw new DiscordUserBotsInternalError("Invalid URL");
        return this.requester.fetch_request(
            link,
            options.body,
            this.clientData,
            options.method,
            options.isMultipartFormData ? options.body.getHeaders() : {}
        );
    }

    /**
     * Fetches messages from Discord
     * @param {number} limit Amount of messages to get (Limit is 100)
     * @param {string} channel_id Channel ID to fetch from
     * @param {string} before_message_id An offset when getting messages (Optional)
     * @returns {Promise<Array<Object>>}
     */
    async fetch_messages(limit, channel_id, before_message_id = false) {
        await this.call_check(arguments);
        if (limit > 100) throw new DiscordUserBotsError("Cannot fetch more than 100 messages at a time.");
        return await this.fetch_request(
            `channels/${channel_id}/messages?${before_message_id === false ? "" : `before=${before_message_id}&`}limit=${limit}`,
            {
                method: "GET",
                body: null,
            }
        );
    }

    /**
     * Fetches all the info about the guild given
     * @param {string} guild_id The guild ID to fetch
     * @returns {Promise<Object>} The guild info
     */
    async get_guild(guild_id) {
        await this.call_check(arguments);
        return await this.fetch_request(`guilds/${guild_id}`, {
            method: "GET",
            body: null,
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
        await this.call_check(arguments);
        invite = this.parse_invite_link(invite);
        return await this.fetch_request(`invites/${invite}`, {
            body: {},
            method: "POST",
        });
    }

    /**
     * Gets info about an invite link
     * @param {string} invite The Discord invite
     * @returns {Promise<Object>} The response from Discord
     */
    async get_invite_info(invite) {
        await this.call_check(arguments);
        const code = this.parse_invite_link(invite);
        return await this.fetch_request(`invites/${code}?inputValue=https%3A%2F%2Fdiscord.gg%2F${code}&with_counts=true&with_expiration=true`, {
            method: "GET",
            body: null,
        });
    }

    /**
     * Leaves a server
     * @param {string} guild_id The guild ID to leave from
     * @returns {Promise<Object>} The response from Discord
     */
    async leave_guild(guild_id) {
        await this.call_check(arguments);
        return await this.fetch_request(`users/@me/guilds/${guild_id}`, {
            method: "DELETE",
            body: { lurking: false },
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
        });
    }

    /**
     * Sends a message
     * @param {string} channel_id Channel to send in
     * @param {SendMessageOpts} data Options
     * @returns {Promise<object>}
     */
    async send(channel_id, data = SendMessageOpts) {
        await this.call_check(arguments);
        data = new constructs.SendMessage(data);
        return await this.fetch_request(`channels/${channel_id}/messages`, {
            isMultipartFormData: data.isMultipartFormData,
            body: data.content,
            method: "POST",
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
        await this.call_check(arguments);
        return await this.fetch_request(`channels/${channel_id}/messages/${message_id}`, {
            body: {
                content: content,
            },
            method: "PATCH",
        });
    }

    /**
     * Deletes a message
     * @param {string} target_message_id The message to delete
     * @param {string} channel_id The channel the message is in
     * @returns {Promise<Object>} The response from Discord
     */
    async delete_message(target_message_id, channel_id) {
        await this.call_check(arguments);
        return await this.fetch_request(`channels/${channel_id}/messages/${target_message_id}`, {
            body: null,
            method: "DELETE",
        });
    }

    /**
     * Types in the channel given
     * @param {string} channel_id The channel ID to type in
     */
    async type(channel_id) {
        await this.call_check(arguments);

        this.typingLoop = setInterval(async () => {
            await this.fetch_request(`channels/${channel_id}/typing`, {
                body: null,
                method: "POST",
            });
        }, this.config.typinginterval);

        return await this.fetch_request(`channels/${channel_id}/typing`, {
            body: null,
            method: "POST",
        });
    }

    /**
     * Stops typing
     * @returns {boolean} Success or not
     */
    async stop_type() {
        await this.call_check(arguments);
        clearInterval(this.typingLoop);
        return true;
    }

    /**
     * Creates or retrieves existing channel with given recipients
     * @param {Array<string>} recipients The IDs fo the people to be in the group when it's made
     * @returns {Promise<Object>} The group info
     */
    async group(recipients) {
        await this.call_check(arguments);
        return await this.fetch_request(`users/@me/channels`, {
            body: {
                recipients: recipients,
            },
            method: "POST",
        });
    }

    /**
     * Leaves a group
     * @param {string} group_id The group ID to leave
     * @returns {Promise<Object>} The response from Discord
     */
    async leave_group(group_id) {
        await this.call_check(arguments);
        return await this.fetch_request(`channels/${group_id}`, {
            body: null,
            method: "DELETE",
        });
    }

    /**
     * Removes someone from a group
     * @param {string} person_id Person ID to be removed
     * @param {string} channel_id Group ID to have someone removed from
     * @returns {Promise<Object>} The response from Discord
     */
    async remove_person_from_group(person_id, channel_id) {
        await this.call_check(arguments);
        return await this.fetch_request(`channels/${channel_id}/recipients/${person_id}`, {
            body: null,
            method: "DELETE",
        });
    }

    /**
     * Renames a group
     * @param {string} name The name
     * @param {string} group_id The group ID to be renamed
     * @returns {Promise<Object>} The response from Discord
     */
    async rename_group(name, group_id) {
        await this.call_check(arguments);
        return await this.fetch_request(`channels/${group_id}`, {
            body: {
                name: name,
            },
            method: "PATCH",
        });
    }

    /**
     * Creates a server
     * @param {string} name Name of the server
     * @param {string} guild_template_code The template of the server (Optional) (Default "2TffvPucqHkN")
     * @param {string} icon The icon in base64 (Optional)
     */
    async create_server(name, guild_template_code = "2TffvPucqHkN", icon = null) {
        await this.call_check(arguments);
        return await this.fetch_request(`guilds/templates/${guild_template_code}`, {
            body: {
                name: name,
                icon: icon,
                guild_template_code: guild_template_code,
            },
            method: "POST",
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
        await this.call_check(arguments);
        return await this.fetch_request(`channels/${channel_id}/messages/${message_id}/threads`, {
            body: {
                name: name,
                type: 11,
                auto_archive_duration: auto_archive_duration,
                location: "Message",
            },
            method: "POST",
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
        await this.call_check(arguments);
        return await this.fetch_request(`channels/${channel_id}/threads`, {
            body: {
                name: name,
                type: 11,
                auto_archive_duration: auto_archive_duration,
                location: "Thread Browser Toolbar",
            },
            method: "POST",
        });
    }

    /**
     * Deletes a thread
     * @param {string} thread_id The ID of the thread to delete
     * @returns {Promise<Object>} The response from Discord
     */
    async delete_thread(thread_id) {
        await this.call_check(arguments);
        return await this.fetch_request(`channels/${thread_id}`, {
            body: null,
            method: "DELETE",
        });
    }

    /**
     * Joins a thread
     * @param {string} thread_id The ID of the thread to join
     * @returns {Promise<Object>} The response from Discord
     */
    async join_thread(thread_id) {
        await this.call_check(arguments);
        return await this.fetch_request(`/channels/${thread_id}/thread-members/@me`, {
            body: null,
            method: "PUT",
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
        await this.call_check(arguments);
        return await this.fetch_request(`channels/${channel_id}/messages/${message_id}/reactions/${encodeURI(emoji)}/%40me`, {
            body: null,
            method: "PUT",
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
        await this.call_check(arguments);
        return await this.fetch_request(`channels/${channel_id}/messages/${message_id}/reactions/${encodeURI(emoji)}/%40me`, {
            body: null,
            method: "DELETE",
        });
    }

    /**
     * Changes your visibility
     * @param {"online" | "idle" | "dnd" | "invisible"} status Status to change to (Must be "online", "idle", "dnd", or "invisible")
     * @returns {Promise<Object>} The response from Discord
     */
    async change_status(status) {
        await this.call_check(arguments);
        if (["online", "idle", "dnd", "invisible"].includes(status) === false) {
            throw new DiscordUserBotsError(`Status must be "online", "idle", "dnd", or "invisible"`);
        }
        return await this.fetch_request(`users/@me/settings`, {
            body: {
                status: status,
            },
            method: "PATCH",
        });
    }

    /**
     * Sets a custom status
     * @param {CustomStatusOpts} custom_status The custom status options
     * @returns {Promise<Object>} The response from Discord
     */
    async set_custom_status(custom_status = CustomStatusOpts) {
        await this.call_check(arguments);
        return await this.fetch_request(`users/@me/settings`, {
            body: {
                custom_status: new constructs.CustomStatus(custom_status).contents,
            },
            method: "PATCH",
        });
    }

    /**
     * Creates an invite
     * @param {string} channel_id The channel
     * @param {CreateInviteOpts} inviteOpts Invite options
     * @returns {Promise<Object>} The response from Discord (invite code is under .code)
     */
    async create_invite(channel_id, inviteOpts = CreateInviteOpts) {
        await this.call_check(arguments);
        const opts = {
            createInviteOpts: CreateInviteOpts,
            ...inviteOpts,
        };
        return await this.fetch_request(`/channels/${channel_id}/invites`, {
            method: "POST",
            body: opts,
        });
    }

    /**
     * Accepts a friend request
     * @param {string} channel_id The channel
     * @param {CreateInviteOpts} inviteOpts Invite options
     * @returns {Promise<Object>} The response from Discord (invite code is under .code)
     */
    async accept_friend_request(user_id) {
        await this.call_check(arguments);
        return await this.fetch_request(`/users/@me/relationships/${user_id}`, {
            method: "PUT",
            body: {},
        });
    }
}

module.exports = Client;
