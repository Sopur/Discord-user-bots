/**
 *
 *  ## OVERVIEW
 *
 *  Contains all the hardcoded packets.
 *
 *  ## WHEN CONTRIBUTING:
 *
 *  Each class is capitalized.
 *  The class properties can be stringified as JSON.
 *
 */

class GateWayOpen {
    constructor(token, config) {
        this.op = 2;
        this.d = {
            token: token,
            capabilities: 125,
            properties: {
                os: config.os,
                browser: "Chrome",
                device: "",
                system_locale: config.language,
                browser_user_agent: `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36`,
                browser_version: "93.0.4577.63",
                os_version: "",
                referrer: "",
                referring_domain: "",
                referrer_current: "",
                referring_domain_current: "",
                release_channel: "stable",
                client_build_number: 97662,
                client_event_source: null,
            },
            presence: { status: "online", since: 0, activities: [], afk: false },
            compress: false,
            client_state: { guild_hashes: {}, highest_last_message_id: "0", read_state_version: 0, user_guild_settings_version: -1 },
        };
    }
}

class HeartBeat {
    constructor(messageCounter) {
        this.op = 1;
        this.d = messageCounter;
    }
}

class GuildRequest {
    constructor(guildid, limit) {
        this.op = 8;
        this.d = {
            guild_id: String(guildid),
            query: "",
            limit: Number(limit),
        };
    }
}

class TokenCheck {
    constructor(token) {
        this.headers = {
            accept: "*/*",
            "accept-language": "en-US",
            authorization: token,
            "sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
        };
        this.referrer = "https://discord.com/login?redirect_to=%2Fchannels%2F%40me";
        this.referrerPolicy = "strict-origin-when-cross-origin";
        this.body = null;
        this.method = "GET";
        this.mode = "cors";
    }
}

module.exports = { GateWayOpen, HeartBeat, GuildRequest, TokenCheck };
