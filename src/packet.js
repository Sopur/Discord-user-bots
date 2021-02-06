class GateWayOpen {
    constructor(token, config) {
        return {
            "op": 2,
            "d": {
                "token": token,
                "intents": 513,
                "properties": {
                    "$os": config.os,
                    "$browser": config.bd,
                    "$device": config.bd
                },
                "compress": false,
                "large_threshold": 250,
                "guild_subscriptions": false,
            },
            "shard": [0, 1],
            "presence": {
                "activities": [{
                    "name": "",
                    "type": 0
                }],
                "status": "online",
                "since": 91879201,
                "afk": false
            },
            "intents": 7
        };
    };
};

class HeartBeat {
    constructor(lastpacket) {
        return {
            "op": 1,
            "d": (lastpacket === undefined) ? null : Number(lastpacket),
        };
    };
};

class GuildRequest {
    constructor(guildid, limit) {
        return {
            "op": 8,
            "d": {
                "guild_id": String(guildid),
                "query": "",
                "limit": Number(limit)
            }
        };
    };
};

module.exports = { GateWayOpen, HeartBeat, GuildRequest };
