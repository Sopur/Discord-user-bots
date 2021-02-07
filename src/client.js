const fetch = require("node-fetch");
const WebSocket = require("ws");
const Packet = require("./packet.js");

class Client {
    constructor(token) {
        this.config = {
            api: "v8",
            wsurl: "wss://gateway.discord.gg/?v=6&encoding=json",
            os: "linux",
            bd: "holy",
            language: "en-US",
            typinginterval: 1000
        };
        this.token = token;
        const ws = new WebSocket(this.config.wsurl);
        this.ws = ws;
        this.lastheartbeat = undefined;
        this.ready_status = 0;
        this.typingLoop = function () { };
        this.on = {
            gateway: function () { },
            heartbeat_sent: function () { },
            heartbeat_received: function () { },
            ready: function () { },
            message_create: function (message) { },
            message_edit: function (message) { },
            message_delete: function (message) { },
            message_delete_bulk: function (message) { },
            embed_sent: function (message) { },
            presence_update: function (message) { },
            sessions_replace: function (message) { },
            message_read: function (message) { },
            channel_update: function (message) { },
            guild_join: function (message) { },
            guild_leave: function (message) { },

            /* I'll add these later...
            channel_create: function (message) { },
            channel_delete: function (message) { },
            channel_pins_update: function (message) { },
            guild_update: function (message) { },
            guild_ban_add: function (message) { },
            guild_ban_remove: function (message) { },
            guild_emojis_update: function (message) { },
            guild_integrations_update: function (message) { },
            guild_member_add: function (message) { },
            guild_member_remove: function (message) { },
            guild_member_update: function (message) { },
            guild_members_chunk: function (message) { },
            guild_role_create: function (message) { },
            guild_role_update: function (message) { },
            guild_role_delete: function (message) { },
            invite_create: function (message) { },
            invite_delete: function (message) { },
            message_reaction_add: function (message) { },
            message_reaction_remove: function (message) { },
            message_reaction_remove_all: function (message) { },
            message_reaction_remove_emoji: function (message) { },
            user_update: function (message) { },
            voice_state_update: function (message) { },
            voice_server_update: function (message) { },
            webhooks_update: function (message) { },
            interaction_update: function (message) { },*/
        };

        ws.on("message", (message) => {
            message = JSON.parse(message);
            setTimeout(() => {
                if (this.ready_status === 0) {
                    console.log("Discord is taking a while to respond. Maybe incorrect token?");
                };
            }, 5000);
            switch (message.t) {
                case null: { // gateway
                    if (this.ready_status === 0) {
                        this.heartbeattimer = message.d.heartbeat_interval;
                        this.heartbeatinterval = setInterval(() => {
                            ws.send(JSON.stringify(new Packet.HeartBeat(this.lastheartbeat)));
                            this.on.heartbeat_sent();
                        }, this.heartbeattimer);
                        ws.send(JSON.stringify(new Packet.GateWayOpen(token, this.config)));
                        this.on.gateway();
                    } else {
                        this.on.heartbeat_received();
                    };
                    break;
                }
                case "READY": { // Gateway res
                    let user = message.d;
                    this.user_settings = user.user_settings; // An object full of properties of settings
                    this.user = user.user // An object full of properties about the user like username etc
                    this.tutorial = user.tutorial; // A property
                    this.session_id = user.session_id; // String of random characters
                    this.notes = user.notes; // An object that contains all the notes the user has on other people
                    this.guild_join_requests = user.guild_join_requests // An array
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
                };
                case "MESSAGE_CREATE": {
                    this.on.message_create(message.d);
                    break;
                }
                case "MESSAGE_UPDATE": {
                    switch (message.type) {
                        case undefined: { // Embed
                            this.on.embed_sent(message.d);
                            break;
                        }
                        case 0: { // Message edit
                            this.on.message_edit(message.d);
                            break;
                        }
                    }
                    break;
                }
                case "PRESENCE_UPDATE": {
                    this.on.presence_update(message.d);
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
                case "SESSIONS_REPLACE": {
                    this.on.sessions_replace(message.d);
                    break;
                }
                case "MESSAGE_ACK": {
                    this.on.message_read(message.d);
                    break;
                }
                case "CHANNEL_UPDATE": {
                    this.on.channel_update(message.d);
                    break;
                }
                case "GUILD_CREATE": {
                    this.on.guild_join(message.d);
                    break;
                }
                case "GUILD_DELETE": {
                    this.on.guild_leave(message.d);
                }

            };
        });
    };


    async fetchmessages(limit, channelid) {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        if (!limit || !channelid) return new Error("Invalid parameters");
        return new Promise((res, rej) => {
            fetch(`https://discord.com/api/${this.config.api}/channels/${channelid}/messages?limit=${limit}`, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": this.config.language,
                    "authorization": this.token,
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                },
                "referrer": `https://discord.com/channels/@me/${channelid}`,
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            }).then((response) => {
                response.json().then(m => {
                    res(m);
                });
            });
        });
    };

    async getguild(guildid) {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        if (!guildid) return new Error("Invalid parameters");
        return new Promise((res, rej) => {
            fetch(`https://discord.com/api/${this.config.api}/guilds/${guildid}`, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": this.config.language,
                    "authorization": this.token,
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                },
                "referrer": `https://discord.com/channels/@me`,
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            }).then((response) => {
                response.json().then(m => {
                    res(m);
                });
            });
        });
    };

    async join_guild(invite, trim = false) {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        if (!invite) return new Error("Invalid parameters");
        if (trim) invite = invite.split("https://discord.gg/")[1];
        return new Promise((res, rej) => {
            fetch(`https://discord.com/api/${this.config.api}/invites/${invite}`, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": this.config.language,
                    "authorization": this.token,
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                },
                "referrer": "https://discord.com/channels/@me",
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": null,
                "method": "POST",
                "mode": "cors"
            }).then((response) => {
                response.json().then(m => {
                    res(m);
                });
            });
        });
    };

    async leave_guild(guildid) {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        if (!guildid) return new Error("Invalid parameters");
        return new Promise((res, rej) => {
            fetch(`https://discord.com/api/${this.config.api}/users/@me/guilds/${guildid}`, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": this.config.language,
                    "authorization": this.token,
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                },
                "referrer": "https://discord.com/channels/@me",
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": null,
                "method": "DELETE",
                "mode": "cors"
            }).then((response) => {
                res(response);
            });
        });
    };

    async send(message, channelid) {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        if (!message || !channelid) return new Error("Invalid parameters");
        return new Promise((res, rej) => {
            fetch(`https://discord.com/api/${this.config.api}/channels/${channelid}/messages`, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": this.config.language,
                    "authorization": this.token,
                    "content-type": "application/json",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                },
                "referrer": `https://discord.com/channels/@me/${channelid}`,
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": JSON.stringify({
                    "content": message,
                    "nonce": "",
                    "tts": false,
                }),
                "method": "POST",
                "mode": "cors"
            }).then((response) => {
                response.json().then(m => {
                    res(m);
                });
            });
        });
    };

    async reply(message, targetmessageid, channelid) {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        if (!message || !targetmessageid || !channelid) return new Error("Invalid parameters");
        return new Promise((res, rej) => {
            fetch(`https://discord.com/api/${this.config.api}/channels/${channelid}/messages`, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": this.config.language,
                    "authorization": this.token,
                    "content-type": "application/json",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                },
                "referrer": `https://discord.com/channels/@me/${channelid}`,
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": JSON.stringify({
                    "content": message,
                    "nonce": "",
                    "tts": false,
                    "message_reference": {
                        "channel_id": channelid,
                        "message_id": targetmessageid
                    },
                    "allowed_mentions": {
                        "parse": [
                            "users",
                            "roles",
                            "everyone"
                        ],
                        "replied_user": false
                    },
                }),
                "method": "POST",
                "mode": "cors"
            }).then((response) => {
                response.json().then(m => {
                    res(m);
                });
            });
        });
    };

    async delete_message(targetmessageid, channelid) {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        if (!targetmessageid || !channelid) return new Error("Invalid parameters");
        return new Promise((res, rej) => {
            fetch(`https://discord.com/api/${this.config.api}/channels/${channelid}/messages/${targetmessageid}`, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": this.config.language,
                    "authorization": this.token,
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                },
                "referrer": `https://discord.com/channels/@me/${channelid}`,
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": null,
                "method": "DELETE",
                "mode": "cors",
                "credentials": "include"
            }).then((response) => {
                res(response);
            });
        });
    };

    async type(channelid) {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        if (!channelid) return new Error("Invalid parameters");
        this.typingLoop = setInterval(() => {
            fetch(`https://discord.com/api/${this.config.api}/channels/${channelid}/typing`, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": this.config.language,
                    "authorization": this.token,
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                },
                "referrer": `https://discord.com/channels/@me/${channelid}`,
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": null,
                "method": "POST",
                "mode": "cors"
            });
        }, this.config.typinginterval);
        return true;
    };

    async stopType() {
        if (this.ready_status === 0) return new Error("Client still in connecting state.");
        clearInterval(this.typingLoop);
        return true;
    };

};

module.exports = Client;
