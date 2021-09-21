class GateWayOpen {
    constructor(token, config) {
        let intent = 0;
        switch (config.intents) {
            case "all": {
                intent = 32767;
                break;
            }
            case "minimum": {
                intent = 1;
                break;
            }
            case "unset": {
                intent = null;
                break;
            }
        }
        return {
            op: 2,
            d: {
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
            },
        };
    }
}

class HeartBeat {
    constructor(lastpacket) {
        return {
            op: 1,
            d: lastpacket === undefined ? null : Number(lastpacket),
        };
    }
}

class GuildRequest {
    constructor(guildid, limit) {
        return {
            op: 8,
            d: {
                guild_id: String(guildid),
                query: "",
                limit: Number(limit),
            },
        };
    }
}

class tokenCheck {
    constructor(token) {
        return {
            headers: {
                accept: "*/*",
                "accept-language": "en-US",
                authorization: token,
                "sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
                "sec-ch-ua-mobile": "?0",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
            },
            referrer: "https://discord.com/login?redirect_to=%2Fchannels%2F%40me",
            referrerPolicy: "strict-origin-when-cross-origin",
            body: null,
            method: "GET",
            mode: "cors",
        };
    }
}

module.exports = { GateWayOpen, HeartBeat, GuildRequest, tokenCheck };
