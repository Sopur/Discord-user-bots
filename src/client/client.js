/**
 *
 *  ## OVERVIEW
 *
 *  Defines the main client class.
 *  It includes the event handlers, and action functions.
 *
 *  ## WHEN CONTRIBUTING:
 *
 *  Make sure to include `await this.call_check(...)` at the start of each function. It covers state checking.
 *  Use the DiscordUserBotsError class when throwing an error to the user.
 *  Use the DiscordAPIError class when throwing an error based on Discord's response to something.
 *  Use the DiscordUserBotsInternalError class when throwing an error because of bad behavior of the Client class.
 *  Make sure to include a description and the parameters as comments above the function.
 *  Use the fetch_request function when sending a fetch request to Discord.
 *
 */

const fs = require("fs/promises");
const {
    RequestGuildMembers,
    FetchRequestOpts,
    SendMessageOpts,
    CustomStatusOpts,
    CreateInviteOpts,
    ProfileSettingsOpts,
    BotConfigOpts,
} = require("./constructs.js");
const defs = require("./def.js");
const {
    DiscordUserBotsError,
    DiscordAPIError,
    DiscordUserBotsInternalError,
} = require("../util/error.js");
const GatewayHandler = require("./gateway.js");
const constructs = require("./constructs.js");
const Captcha = require("./captcha.js");
const BareClient = require("./bare.js");

class Client extends BareClient {
    /**
     * DISCORD-USER-BOTS CLIENT INSTANCE
     * @author Sopur, Discord: .sopur
     * @license MIT
     * @warn WHATEVER HAPPENS TO YOUR ACCOUNT AS A RESULT OF THIS LIBRARY IS WITHIN YOUR OWN LIABILITY. THIS LIBRARY IS MADE PURELY FOR EXPERIMENTAL AND ENTERTAINMENT PURPOSES. USE AT YOUR OWN RISK.
     * @param {BotConfigOpts} config The configuration for the Client
     */
    constructor(config = BotConfigOpts) {
        super(config);
        this.typingLoops = {};
        this.isReady = false;
        if (this.config.headless) {
            this.info = {};
            this.isReady = true;
        } else {
            this.gateway = new GatewayHandler(this, this.requester.proxy, this.config);
            this.gateway.on("ready", () => {
                this.info = this.gateway.info;
                this.isReady = true;
                this.emit("ready");
            });
            this.gateway.on("error", (e) => {
                // throw new DiscordUserBotsError(e);
                this.isReady = false;
            });
        }
    }

    /**
     * Logs in with a token (required for even for headless clients)
     * @param {String} token Authentication token
     * @returns {Promise<Boolean>} Is failure
     */
    async login(token) {
        if (typeof token !== "string") throw new DiscordUserBotsError("Invalid token");
        this._set_request_token(token);
        const res = await this.check_token();
        if (res) {
            await this.clientData.gen(this.requester);
            if (!this.config.headless) this.gateway.connectWS();
        } else {
            throw new DiscordAPIError(`Discord rejected token "${token}"`);
        }
        return !res;
    }

    /**
     * Checks the state of the client and arguments
     * @param {Array<any>} args
     * @private
     */
    async call_check(...args) {
        if (!this.isReady) throw new DiscordUserBotsError(`Client is not connected to Discord`);
    }

    /**
     * Closes an active connection gracefully
     */
    close() {
        if (this.config.headless) return;
        this.isReady = false;
        this.gateway.allowReconnection = false;
        this.gateway.disconnectWS(true);
        this.emit("stop");
    }

    /**
     * Terminates an active connection by shutting down the connection immediately
     */
    terminate() {
        if (this.config.headless) return;
        this.isReady = false;
        this.gateway.allowReconnection = false;
        this.gateway.disconnectWS(false);
        this.emit("stop");
    }

    /**
     * Tests if this account is restricted
     * @returns {Promise<boolean>} If the account is restricted
     */
    async is_restricted() {
        const res = await this.fetch_request("users/@me/burst-credits", {
            method: "GET",
            body: null,
        });
        return res.body?.code !== undefined;
    }

    /*
    async request_guild_members(options = RequestGuildMembers) {
        options = { ...RequestGuildMembers, ...options };
        await this.call_check(options);
        return this.gateway.request_guild_members({
            guild_id: options.guild_id,
            query: options.query,
            limit: options.limit,
            presences: options.presences,
            user_ids: options.user_ids,
        });
    }
    */

    /**
     * Fetches messages from Discord
     * @param {number} limit Amount of messages to get (Limit is 100)
     * @param {string} channel_id Channel ID to fetch from
     * @param {string} before_message_id An offset when getting messages (Optional)
     * @returns {Promise<Array<Object>>}
     */
    async fetch_messages(limit, channel_id, before_message_id) {
        await this.call_check(limit, channel_id);
        if (typeof limit !== "number")
            throw new DiscordUserBotsError("The limit must be a number.");
        if (limit > 100)
            throw new DiscordUserBotsError("Cannot fetch more than 100 messages at a time.");
        return await this.fetch_request(
            `channels/${channel_id}/messages?${
                !before_message_id ? "" : `before=${before_message_id}&`
            }limit=${limit}`,
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
        await this.call_check(guild_id);
        return await this.fetch_request(`guilds/${guild_id}`, {
            method: "GET",
            body: null,
        });
    }

    /**
     * Joins the guild the invite code is pointing to
     * @param {string} invite The Discord invite
     * @returns {Promise<Object>} The response from Discord
     * @warn Joining too many guilds in a short period of time will trigger Discord to send you captcha's
     */
    async join_guild(invite) {
        await this.call_check(invite);
        invite = Client.parse_invite_link(invite);
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
        await this.call_check(invite);
        const code = Client.parse_invite_link(invite);
        return await this.fetch_request(
            `invites/${code}?inputValue=https%3A%2F%2Fdiscord.gg%2F${code}&with_counts=true&with_expiration=true`,
            {
                method: "GET",
                body: null,
            }
        );
    }

    /**
     * Leaves a guild
     * @param {string} guild_id The guild ID to leave from
     * @returns {Promise<Object>} The response from Discord
     */
    async leave_guild(guild_id) {
        await this.call_check(guild_id);
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
        await this.call_check(guild_id);
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
        await this.call_check(channel_id);
        data = new constructs.SendMessage(data);
        return await this.fetch_request(`channels/${channel_id}/messages`, {
            isMultipartFormData: data.isMultipartFormData,
            body: data.content,
            method: "POST",
            secure: false,
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
        await this.call_check(message_id, channel_id, content);
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
        await this.call_check(target_message_id, channel_id);
        return await this.fetch_request(`channels/${channel_id}/messages/${target_message_id}`, {
            body: null,
            method: "DELETE",
        });
    }

    /**
     * IF YOU WANT TO TYPE IN A CHANNEL PLEASE USE `.type` AND `.stop_type` INSTEAD
     * Sends a typing notification to discord
     * @param {string} channel_id ID of the channel to send a typing notification to
     * @returns {Promise<Object>} The response from Discord
     */
    async send_single_type_notification(channel_id) {
        await this.call_check(channel_id);
        return await this.fetch_request(`channels/${channel_id}/typing`, {
            body: null,
            method: "POST",
        });
    }

    /**
     * Types in the channel given
     * @param {string} channel_id The channel ID to type in
     */
    async type(channel_id) {
        await this.call_check(channel_id);
        if (this.typingLoops[channel_id])
            throw new DiscordUserBotsError("Input channel is already sending typing notifications");

        const testType = await this.send_single_type_notification(channel_id);

        this.typingLoops[channel_id] = setInterval(async () => {
            await this.send_single_type_notification(channel_id);
        }, this.config.typinginterval);

        return testType;
    }

    /**
     * Stops typing
     * @param {string} channel_id The channel ID to stop typing in
     * @returns {boolean} Success or not
     */
    async stop_type(channel_id) {
        await this.call_check(channel_id);
        if (!this.typingLoops[channel_id])
            throw new DiscordUserBotsError("Input channel isn't sending typing notifications");

        clearInterval(this.typingLoops[channel_id]);
        delete this.typingLoops[channel_id];
        return true;
    }

    /**
     * Creates or retrieves existing channel with given recipients
     * @param {Array<string>} recipients The IDs fo the people to be in the group when it's made
     * @returns {Promise<Object>} The group info
     */
    async group(recipients) {
        await this.call_check(recipients);
        if (recipients.length === 0)
            throw new DiscordUserBotsError("You must list at least one recipient");
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
        await this.call_check(group_id);
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
        await this.call_check(person_id, channel_id);
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
        await this.call_check(name, group_id);
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
        await this.call_check(name);
        return await this.fetch_request(`guilds`, {
            body: {
                channels: [],
                guild_template_code: guild_template_code,
                icon: icon,
                name: name,
                system_channel_id: null,
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
        await this.call_check(message_id, channel_id, name);
        return await this.fetch_request(`channels/${channel_id}/messages/${message_id}/threads`, {
            body: {
                name: name,
                type: defs.ChannelTypes.PUBLIC_THREAD,
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
        await this.call_check(channel_id, name);
        return await this.fetch_request(`channels/${channel_id}/threads`, {
            body: {
                name: name,
                type: defs.ChannelTypes.PUBLIC_THREAD,
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
        await this.call_check(thread_id);
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
        await this.call_check(thread_id);
        return await this.fetch_request(`channels/${thread_id}/thread-members/@me`, {
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
        await this.call_check(message_id, channel_id, emoji);
        return await this.fetch_request(
            `channels/${channel_id}/messages/${message_id}/reactions/${encodeURI(emoji)}/%40me`,
            {
                body: null,
                method: "PUT",
            }
        );
    }

    /**
     * Remove a reaction to a message
     * @param {string} message_id The message to remove a reaction to
     * @param {string} channel_id The channel the message is in
     * @param {string} emoji Emoji to react with (Cannot be ":robot:" has to be an actual emoji like "🤖")
     * @returns {Promise<Object>} The response from Discord
     */
    async remove_reaction(message_id, channel_id, emoji) {
        await this.call_check(message_id, channel_id, emoji);
        return await this.fetch_request(
            `channels/${channel_id}/messages/${message_id}/reactions/${encodeURI(emoji)}/%40me`,
            {
                body: null,
                method: "DELETE",
            }
        );
    }

    /**
     * Changes your visibility
     * @param {"online" | "idle" | "dnd" | "invisible"} status Status to change to (Must be "online", "idle", "dnd", or "invisible")
     * @returns {Promise<Object>} The response from Discord
     */
    async change_status(status) {
        await this.call_check(status);
        status = status.toLowerCase();
        if (["online", "idle", "dnd", "invisible"].includes(status) === false) {
            throw new DiscordUserBotsError(
                `Status must be "online", "idle", "dnd", or "invisible"`
            );
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
        await this.call_check();
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
        await this.call_check(channel_id);
        const opts = {
            createInviteOpts: CreateInviteOpts,
            ...inviteOpts,
        };
        return await this.fetch_request(`channels/${channel_id}/invites`, {
            method: "POST",
            body: opts,
        });
    }

    /**
     * Sends a friend request to a user
     * @param {string} username Account username
     * @param {string|null} discriminator Account discriminator (If here is one)
     * @returns {Promise<Object>} The response from Discord
     * @warn Sending too many friend requests in a short period of time will trigger Discord to send you captcha's
     */
    async send_friend_request(username, discriminator = null) {
        await this.call_check(channel_id);
        return await this.fetch_request("users/@me/relationships", {
            method: "POST",
            body: {
                username: username,
                discriminator: discriminator,
            },
        });
    }

    /**
     * Accepts a friend request
     * @param {string} channel_id The channel
     * @param {CreateInviteOpts} inviteOpts Invite options
     * @returns {Promise<Object>} The response from Discord (invite code is under .code)
     */
    async accept_friend_request(user_id) {
        await this.call_check(user_id);
        return await this.fetch_request(`users/@me/relationships/${user_id}`, {
            method: "PUT",
            body: {},
        });
    }

    /**
     * Sets settings in your profile
     * @param {ProfileSettingsOpts} profileSettings  Profile options
     * @returns {Promise<Object>} The response from Discord
     */
    async set_profile(profileSettings = ProfileSettingsOpts) {
        await this.call_check();
        return await this.fetch_request(`users/@me/profile`, {
            method: "PATCH",
            body: new constructs.SetProfile(profileSettings).contents,
        });
    }

    /**
     * Sets your HypeSquad house
     * @param {"Bravery" | "Brilliance" | "Balance"} house HypeSquad house
     * @returns {Promise<Object>} The response from Discord
     */
    async set_HypeSquad(house) {
        await this.call_check(house);
        if (typeof defs.HypeSquadHouses[house] !== "number")
            throw new DiscordUserBotsError(`House must be "Bravery", "Brilliance", or "Balance"`);
        return await this.fetch_request(`hypesquad/online`, {
            method: "POST",
            body: {
                house_id: defs.HypeSquadHouses[house],
            },
        });
    }

    /**
     * Sets your profile picture (avatar)
     * @param {string} path Path to an image containing your avatar
     * @returns {Promise<Object>} The response from Discord
     */
    async set_avatar(path) {
        await this.call_check(path);
        const contents = await fs.readFile(path, { encoding: "base64" });
        return await this.fetch_request(`users/@me`, {
            method: "PATCH",
            body: {
                avatar: `data:image/png;base64,${contents}`,
            },
        });
    }

    /**
     * Requests Discord to send a verification email to verify your Discord account by email
     * @param {string} email Email you want to verify with
     * @param {string} password Your Discord account password
     * @returns {Promise<Object>} The response from Discord
     */
    async request_verify_email(email, password) {
        await this.call_check(email, password);
        return await this.fetch_request(`users/@me`, {
            method: "PATCH",
            body: {
                avatar: { email: email, password: password },
            },
        });
    }

    /**
     * USE `request_verify_email` BEFORE USING THIS FUNCTION TO REQUEST DISCORD TO SEND A VERIFICATION EMAIL
     * Verifies your Discord account with the email token that was sent to your email by `request_verify_email`
     * @param {string} token Email token sent by Discord
     * @returns {Promise<Object>} The response from Discord
     */
    async verify_email(token) {
        await this.call_check(token);
        return await this.fetch_request(`auth/verify`, {
            method: "POST",
            body: {
                token: token,
                captcha_key: null,
            },
        });
    }

    /**
     * Requests Discord to send a verification sms message to verify your Discord account by phone
     * @param {string} phoneNumber Phone number you want to verify with (should be in format +123456789)
     * @param {Function} captchaSolve Callback function that takes a captcha info class as a parameter, and returns a captcha token
     * @returns {Promise<Object>} Response from Discord
     */
    async request_verify_phone(phoneNumber, captchaSolve) {
        await this.call_check(arguments);

        const captchaInfo = await this.fetch_request(`users/@me/phone`, {
            body: { phone: phoneNumber, change_phone_reason: "user_settings_update" },
            method: "POST",
        });
        if (captchaInfo.captcha_key !== undefined) {
            const captchaKey = await captchaSolve(
                new Captcha(
                    captchaInfo.captcha_service,
                    captchaInfo.captcha_sitekey,
                    this.requester.url,
                    undefined,
                    undefined,
                    captchaInfo.message
                )
            );
            if (typeof captchaKey !== "string" || captchaKey.length < 10)
                throw new DiscordUserBotsError(`Invalid Captcha key: "${captchaKey}"`);
            const info = await this.fetch_request(`users/@me/phone`, {
                body: {
                    phone: phoneNumber,
                    captcha_key: captchaKey,
                    change_phone_reason: "user_settings_update",
                },
                method: "POST",
            });
            return info;
        } else {
            return captchaInfo;
        }
    }

    /**
     * USE `request_verify_phone` BEFORE USING THIS FUNCTION TO REQUEST DISCORD TO SEND A VERIFICATION TEXT
     * Verifies your Discord account with the sms code that was sent to your phone by `request_verify_phone`
     * @param {string} phoneNumber Phone number you want to verify with (should be in format +123456789)
     * @param {string} code SMS code
     * @param {string} password Your Discord account password
     * @returns {Promise<Object>} The response from Discord
     */
    async verify_phone(phoneNumber, code, password) {
        await this.call_check(arguments);
        const tokenInfo = await this.fetch_request(`phone-verifications/verify`, {
            method: "POST",
            body: { phone: phoneNumber, code: code },
        });
        if (tokenInfo.token === undefined)
            throw new DiscordAPIError(
                `Discord rejected code "${code}" (${JSON.stringify(tokenInfo)})`
            );
        return await this.fetch_request(`users/@me/phone`, {
            method: "POST",
            body: {
                phone_token: tokenInfo.token,
                password: password,
                change_phone_reason: "user_settings_update",
            },
        });
    }
}

module.exports = Client;
