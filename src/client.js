const fetch = require("node-fetch");
const WebSocket = require("ws");
const Packet = require("./packet.js");

class Client {
    constructor(token) {
        this.config = {
            api: "v9",
            wsurl: "wss://gateway.discord.gg/?encoding=json&v=9",
            os: "linux",
            bd: "holy",
            language: "en-US",
            intents: "all",
            typinginterval: 1000,
        };
        this.token = token;
        this.lastheartbeat = undefined;
        this.ready_status = 0;
        this.typingLoop = function () {};
        this.on = {
            discord_disconnect: function () {},
            gateway: function () {},
            heartbeat_sent: function () {},
            heartbeat_received: function () {},
            ready: function () {},
            voice_server_update: function (message) {},
            user_update: function (message) {},
            application_command_create: function (message) {},
            application_command_update: function (message) {},
            application_command_delete: function (message) {},
            interaction_create: function (message) {},
            guild_create: function (message) {},
            guild_delete: function (message) {},
            guild_role_create: function (message) {},
            guild_role_update: function (message) {},
            guild_role_delete: function (message) {},
            thread_create: function (message) {},
            thread_update: function (message) {},
            thread_delete: function (message) {},
            thread_list_sync: function (message) {},
            thread_member_update: function (message) {},
            thread_members_update: function (message) {},
            channel_create: function (message) {},
            channel_update: function (message) {},
            channel_delete: function (message) {},
            channel_pins_update: function (message) {},
            guild_member_add: function (message) {},
            guild_member_update: function (message) {},
            guild_member_remove: function (message) {},
            guild_ban_add: function (message) {},
            guild_ban_remove: function (message) {},
            guild_emojis_update: function (message) {},
            guild_stickers_update: function (message) {},
            guild_integrations_update: function (message) {},
            guild_webhooks_update: function (message) {},
            invite_create: function (message) {},
            invite_delete: function (message) {},
            voice_state_update: function (message) {},
            presence_update: function (message) {},
            message_create: function (message) {},
            message_update: function (message) {},
            message_delete: function (message) {},
            message_delete_bulk: function (message) {},
            message_reaction_add: function (message) {},
            message_reaction_remove: function (message) {},
            message_reaction_remove_all: function (message) {},
            message_reaction_remove_emoji: function (message) {},
            typing_start: function (message) {},

            // Custom made ones
            embed_sent: function (message) {},
            message_edit: function (message) {},
        };

        this.checkToken().then((res) => {
            if (res === true) this.setEvents();
            else throw new Error(`Discord rejected token "${token}" (Not valid)`);
        });
    }

    /**
     * Used after the token checking to set everything
     * @private
     */
    setEvents() {
        const ws = new WebSocket(this.config.wsurl);
        this.ws = ws;
        ws.on("message", (message) => {
            message = JSON.parse(message);
            switch (message.t) {
                case null: {
                    // gateway
                    if (this.ready_status === 0) {
                        this.heartbeattimer = message.d.heartbeat_interval;
                        this.heartbeatinterval = setInterval(() => {
                            ws.send(JSON.stringify(new Packet.HeartBeat(this.lastheartbeat)));
                            this.on.heartbeat_sent();
                        }, this.heartbeattimer);
                        ws.send(JSON.stringify(new Packet.GateWayOpen(this.token, this.config)));
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

                    this.ready_status = 1;
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

        ws.on("close", this.on.discord_disconnect);
    }

    /**
     * Checks if the token is valid
     * @returns {Promise<boolean}
     */
    checkToken() {
        return new Promise((resolve) => {
            fetch(`https://discord.com/api/${this.config.api}/users/@me`, new Packet.tokenCheck(this.token)).then((r) => {
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
     * @returns {void}
     */
    setConfig(
        api = this.config.api,
        wsurl = this.config.wsurl,
        os = this.config.os,
        bd = this.config.bd,
        language = this.config.language,
        typinginterval = this.config.typinginterval
    ) {
        this.config = {
            api,
            wsurl,
            os,
            bd,
            language,
            typinginterval,
        };
    }

    async fetchmessages(limit, channelid) {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        if (!limit || !channelid) return new Error("Invalid parameters");
        return new Promise((res, rej) => {
            fetch(`https://discord.com/api/${this.config.api}/channels/${channelid}/messages?limit=${limit}`, {
                headers: {
                    accept: "*/*",
                    "accept-language": this.config.language,
                    authorization: this.token,
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                },
                referrer: `https://discord.com/channels/@me/${channelid}`,
                referrerPolicy: "no-referrer-when-downgrade",
                body: null,
                method: "GET",
                mode: "cors",
                credentials: "include",
            }).then((response) => {
                response.json().then((m) => {
                    res(m);
                });
            });
        });
    }

    /**
     * Fetches all the info about the guild given
     * @param {string} guildid The guild ID to fetch
     * @returns {Promise<Object>} The guild info
     */
    async getguild(guildid) {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        if (!guildid) return new Error("Invalid parameters");
        return new Promise((res, rej) => {
            fetch(`https://discord.com/api/${this.config.api}/guilds/${guildid}`, {
                headers: {
                    accept: "*/*",
                    "accept-language": this.config.language,
                    authorization: this.token,
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                },
                referrer: `https://discord.com/channels/@me`,
                referrerPolicy: "no-referrer-when-downgrade",
                body: null,
                method: "GET",
                mode: "cors",
                credentials: "include",
            }).then((response) => {
                response.json().then((m) => {
                    res(m);
                });
            });
        });
    }

    /**
     * Gets info about the invite code givin
     * @param {string} invite The Discord invite
     * @param {boolean} trim If this is set to true, the invite will be stripped of the "https://discord.gg/" automatically, otherwise it will just send the invite param given
     * @returns {Promise<Object>} The response from Discord
     * @deprecated
     * @warn May disable your account
     */
    async join_guild(invite, trim = false) {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        if (!invite) return new Error("Invalid parameters");
        if (trim) invite = invite.split("https://discord.gg/")[1];
        return new Promise((res, rej) => {
            fetch(`https://discord.com/api/${this.config.api}/invites/${invite}`, {
                headers: {
                    accept: "*/*",
                    "accept-language": this.config.language,
                    authorization: this.token,
                    "content-type": "application/json",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                },
                referrer: "https://discord.com/channels/@me",
                referrerPolicy: "no-referrer-when-downgrade",
                body: "{}",
                method: "POST",
                mode: "cors",
            }).then((response) => {
                response.json().then((m) => {
                    res(m);
                });
            });
        });
    }

    /**
     * Joins a server or group chat
     * @param {string} invite The Discord invite
     * @param {boolean} trim If this is set to true, the invite will be stripped of the "https://discord.gg/" automatically, otherwise it will just send the invite param given
     * @returns {Promise<Object>} The response from Discord
     */
    async get_invite_info(invite, trim = false) {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        if (!invite) return new Error("Invalid parameters");
        if (trim) invite = invite.split("https://discord.gg/")[1];
        return new Promise((res, rej) => {
            fetch(
                `https://discord.com/api/${this.config.api}/invites/${invite}?inputValue=https%3A%2F%2Fdiscord.gg%2F${invite}&with_counts=true&with_expiration=true`,
                {
                    headers: {
                        accept: "*/*",
                        "accept-language": this.config.language,
                        authorization: this.token,
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                    },
                    referrer: "https://discord.com/channels/@me",
                    referrerPolicy: "no-referrer-when-downgrade",
                    body: null,
                    method: "GET",
                    mode: "cors",
                }
            ).then((response) => {
                response.json().then((m) => {
                    res(m);
                });
            });
        });
    }

    /**
     * Leaves a server
     * @param {string} guildid The guild ID to leave from
     * @returns {Promise<Object>} The response from Discord
     */
    async leave_guild(guildid) {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        if (!guildid) return new Error("Invalid parameters");
        return new Promise((res, rej) => {
            fetch(`https://discord.com/api/${this.config.api}/users/@me/guilds/${guildid}`, {
                headers: {
                    accept: "*/*",
                    "accept-language": this.config.language,
                    authorization: this.token,
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                },
                referrer: "https://discord.com/channels/@me",
                referrerPolicy: "no-referrer-when-downgrade",
                body: null,
                method: "DELETE",
                mode: "cors",
            }).then((response) => {
                res(response);
            });
        });
    }

    /**
     * Sends a message with the channel given
     * @param {string} message The message you want to send
     * @param {string} channelid The channel you want to send it in
     * @returns {Promise<Object>} The message info
     */
    async send(message, channelid) {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        if (!message || !channelid) return new Error("Invalid parameters");
        return new Promise((res, rej) => {
            fetch(`https://discord.com/api/${this.config.api}/channels/${channelid}/messages`, {
                headers: {
                    accept: "*/*",
                    "accept-language": this.config.language,
                    authorization: this.token,
                    "content-type": "application/json",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                },
                referrer: `https://discord.com/channels/@me/${channelid}`,
                referrerPolicy: "no-referrer-when-downgrade",
                body: JSON.stringify({
                    content: message,
                    nonce: "",
                    tts: false,
                }),
                method: "POST",
                mode: "cors",
            }).then((response) => {
                response.json().then((m) => {
                    res(m);
                });
            });
        });
    }

    /**
     * Replies to a message
     * @param {string} message The message content
     * @param {string} targetmessageid The message to reply
     * @param {string} channelid The channel ID of the message
     * @returns {Promise<Object>} The message info
     */
    async reply(message, targetmessageid, channelid) {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        if (!message || !targetmessageid || !channelid) return new Error("Invalid parameters");
        return new Promise((res, rej) => {
            fetch(`https://discord.com/api/${this.config.api}/channels/${channelid}/messages`, {
                headers: {
                    accept: "*/*",
                    "accept-language": this.config.language,
                    authorization: this.token,
                    "content-type": "application/json",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                },
                referrer: `https://discord.com/channels/@me/${channelid}`,
                referrerPolicy: "no-referrer-when-downgrade",
                body: JSON.stringify({
                    content: message,
                    nonce: "",
                    tts: false,
                    message_reference: {
                        channel_id: channelid,
                        message_id: targetmessageid,
                    },
                    allowed_mentions: {
                        parse: ["users", "roles", "everyone"],
                        replied_user: false,
                    },
                }),
                method: "POST",
                mode: "cors",
            }).then((response) => {
                response.json().then((m) => {
                    res(m);
                });
            });
        });
    }
    
    /**
     * Edit message with given text in given channel
     * @param {string} message The message you want to put instead
     * @param {string} messageid Id of message you want to edit
     * @param {string} channelid Id of channel, where message is
     * @returns {Promise<Object>} The message info
     */
    async edit_message(message, messageid, channelid) {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        if (!message || !channelid) return new Error("Invalid parameters");
        return new Promise((res, rej) => {
            fetch(`https://discord.com/api/${this.config.api}/channels/${channelid}/messages/${messageid}`, {
                headers: {
                    accept: "*/*",
                    "accept-language": this.config.language,
                    authorization: this.token,
                    "content-type": "application/json",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                },
                referrer: `https://discord.com/channels/@me/${channelid}`,
                referrerPolicy: "no-referrer-when-downgrade",
                body: JSON.stringify({
                    content: message,
                    nonce: "",
                    tts: false,
                }),
                method: "PATCH",
                mode: "cors",
            }).then((response) => {
                response.json().then((m) => {
                    res(m);
                });
            });
        });
    }

    /**
     * Deletes a message
     * @param {string} targetmessageid The message to delete
     * @param {string} channelid The channel the message is in
     * @returns {Promise<Object>} The response from Discord
     */
    async delete_message(targetmessageid, channelid) {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        if (!targetmessageid || !channelid) return new Error("Invalid parameters");
        return new Promise((res, rej) => {
            fetch(`https://discord.com/api/${this.config.api}/channels/${channelid}/messages/${targetmessageid}`, {
                headers: {
                    accept: "*/*",
                    "accept-language": this.config.language,
                    authorization: this.token,
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                },
                referrer: `https://discord.com/channels/@me/${channelid}`,
                referrerPolicy: "no-referrer-when-downgrade",
                body: null,
                method: "DELETE",
                mode: "cors",
                credentials: "include",
            }).then((response) => {
                res(response);
            });
        });
    }

    /**
     * Types in the channel given
     * @param {string} channelid The channel ID to type in
     */
    async type(channelid) {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        if (!channelid) return new Error("Invalid parameters");

        fetch(`https://discord.com/api/${this.config.api}/channels/${channelid}/typing`, {
            headers: {
                accept: "*/*",
                "accept-language": this.config.language,
                authorization: this.token,
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
            },
            referrer: `https://discord.com/channels/@me/${channelid}`,
            referrerPolicy: "no-referrer-when-downgrade",
            body: null,
            method: "POST",
            mode: "cors",
        });

        this.typingLoop = setInterval(() => {
            fetch(`https://discord.com/api/${this.config.api}/channels/${channelid}/typing`, {
                headers: {
                    accept: "*/*",
                    "accept-language": this.config.language,
                    authorization: this.token,
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                },
                referrer: `https://discord.com/channels/@me/${channelid}`,
                referrerPolicy: "no-referrer-when-downgrade",
                body: null,
                method: "POST",
                mode: "cors",
            });
        }, this.config.typinginterval);
    }

    async stopType() {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        clearInterval(this.typingLoop);
        return true;
    }

    /**
     * Creates or retrieves existing channel with given recipients
     * @param {Array} recipients The people to be in the group when it's made
     * @returns {Promise<Object>} The group info
     */
    async create_group(recipients) {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        if (recipients === undefined) return new Error("Invalid parameters");
        if (!Array.isArray(recipients)) return new Error("Recipients should be given in array");
        if (recipients.length < 1) return new Error("You have to enter at least one recipient");
        return new Promise((res, rej) => {
            fetch(`https://discord.com/api/${this.config.api}/users/@me/channels`, {
                headers: {
                    accept: "*/*",
                    "accept-language": this.config.language,
                    authorization: this.token,
                    "content-type": "application/json",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                },
                referrer: "https://discord.com/channels/@me/",
                referrerPolicy: "no-referrer-when-downgrade",
                body: JSON.stringify({
                    recipients: recipients,
                }),
                method: "POST",
                mode: "cors",
            }).then((response) => {
                response.json().then((m) => {
                    res(m);
                });
            });
        });
    }

    /**
     * Leaves a group
     * @param {string} groupid The group ID to leave
     * @returns {Promise<Object>} The response from Discord
     */
    async leave_group(groupid) {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        if (groupid === undefined) return new Error("Invalid parameters");
        return new Promise((res, rej) => {
            fetch(`https://discord.com/api/${this.config.api}/channels/${groupid}`, {
                headers: {
                    accept: "*/*",
                    "accept-language": this.config.language,
                    authorization: this.token,
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                },
                referrer: "https://discord.com/channels/@me",
                referrerPolicy: "no-referrer-when-downgrade",
                body: null,
                method: "DELETE",
                mode: "cors",
            }).then((response) => {
                response.json().then((m) => {
                    res(m);
                });
            });
        });
    }

    /**
     * Removes someone from a group
     * @param {string} personid Person ID to be removed
     * @param {string} channelid Group ID to have someone removed from
     * @returns {Promise<Object>} The response from Discord
     */
    async remove_person_from_group(personid, channelid) {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        if (!channelid || !personid) return new Error("Invalid parameters");
        return new Promise((res, rej) => {
            fetch(`https://discord.com/api/${this.config.api}/channels/${channelid}/recipients/${personid}`, {
                headers: {
                    accept: "*/*",
                    "accept-language": this.config.language,
                    authorization: this.token,
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                },
                referrer: "https://discord.com/channels/@me",
                referrerPolicy: "no-referrer-when-downgrade",
                body: null,
                method: "DELETE",
                mode: "cors",
            }).then((response) => {
                res(response);
            });
        });
    }

    /**
     * Renames a group
     * @param {string} name The name
     * @param {string} channelid The group ID to be renamed
     * @returns {Promise<Object>} The response from Discord
     */
    async rename_group(name, groupid) {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        if (!groupid || !name) return new Error("Invalid parameters");
        return new Promise((res, rej) => {
            fetch(`https://discord.com/api/${this.config.api}/channels/${groupid}`, {
                headers: {
                    accept: "*/*",
                    "accept-language": this.config.language,
                    authorization: this.token,
                    "content-type": "application/json",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                },
                referrer: "https://discord.com/channels/@me",
                referrerPolicy: "no-referrer-when-downgrade",
                body: JSON.stringify({
                    name: name,
                }),
                method: "PATCH",
                mode: "cors",
            }).then((response) => {
                res(response);
            });
        });
    }

    /**
     * Creates a server
     * @param {string} name Name of the server
     * @param {string} guild_template_code The template of the server, it's set to the defualt server template when not set by you
     * @returns {Promise<Object>} The server info
     */
    async create_server(name, guild_template_code = "2TffvPucqHkN") {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        if (!name) return new Error("Invalid parameters");
        return new Promise((res, rej) => {
            fetch(`https://discord.com/api/${this.config.api}/guilds`, {
                headers: {
                    accept: "*/*",
                    "accept-language": this.config.language,
                    authorization: this.token,
                    "content-type": "application/json",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                },
                referrer: "https://discord.com/channels/@me",
                referrerPolicy: "no-referrer-when-downgrade",
                body: JSON.stringify({
                    name: name,
                    icon: null,
                    channels: [],
                    system_channel_id: null,
                    guild_template_code: guild_template_code,
                }),
                method: "POST",
                mode: "cors",
            }).then((response) => {
                response.json().then((m) => {
                    res(m);
                });
            });
        });
    }

    /**
     * Creates a thread off of a message
     * @param {string} messageid The target message ID
     * @param {string} channelid The target channel ID
     * @param {string} name The name of the thread
     * @param {number} auto_archive_duration How long util the thread auto archives (Default is 1440)
     * @returns {Promise<Object>} The response from Discord
     */
    async create_thread_from_message(messageid, channelid, name, auto_archive_duration = 1440) {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        if (!messageid || !channelid || !name) return new Error("Invalid parameters");
        return new Promise((res, rej) => {
            fetch(`https://discord.com/api/${this.config.api}/channels/${channelid}/messages/${messageid}/threads`, {
                headers: {
                    accept: "*/*",
                    "accept-language": this.config.language,
                    authorization: this.token,
                    "content-type": "application/json",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                },
                referrer: "https://discord.com/channels/@me",
                referrerPolicy: "no-referrer-when-downgrade",
                body: JSON.stringify({
                    name: name,
                    type: 11,
                    auto_archive_duration: auto_archive_duration,
                    location: "Message",
                }),
                method: "POST",
                mode: "cors",
            }).then((response) => {
                response.json().then((m) => {
                    res(m);
                });
            });
        });
    }

    /**
     * Creates a thread in a channel
     * @param {string} channelid Channel to create the thread in
     * @param {string} name The name of the thread
     * @param {number} auto_archive_duration How long util the thread auto archives (Default is 1440)
     * @returns {Promise<Object>} The response from Discord
     */
    async create_thread(channelid, name, auto_archive_duration = 1440) {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        if (!channelid || !name) return new Error("Invalid parameters");
        return new Promise((res, rej) => {
            fetch(`https://discord.com/api/${this.config.api}/channels/${channelid}/threads`, {
                headers: {
                    accept: "*/*",
                    "accept-language": this.config.language,
                    authorization: this.token,
                    "content-type": "application/json",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                },
                referrer: "https://discord.com/channels/@me",
                referrerPolicy: "no-referrer-when-downgrade",
                body: JSON.stringify({
                    name: name,
                    type: 11,
                    auto_archive_duration: auto_archive_duration,
                    location: "Thread Browser Toolbar",
                }),
                method: "POST",
                mode: "cors",
            }).then((response) => {
                response.json().then((m) => {
                    res(m);
                });
            });
        });
    }

    /**
     * Deletes a thread
     * @param {string} threadid The ID of the thread to delete
     * @returns {Promise<Object>} The response from Discord
     */
    async delete_thread(threadid) {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        if (!threadid) return new Error("Invalid parameters");
        return new Promise((res, rej) => {
            fetch(`https://discord.com/api/${this.config.api}/channels/${threadid}`, {
                headers: {
                    accept: "*/*",
                    "accept-language": this.config.language,
                    authorization: this.token,
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                },
                referrer: "https://discord.com/channels/@me",
                referrerPolicy: "no-referrer-when-downgrade",
                body: null,
                method: "DELETE",
                mode: "cors",
            }).then((response) => {
                response.json().then((m) => {
                    res(m);
                });
            });
        });
    }
}

module.exports = Client;
