/**
 *
 *  ## OVERVIEW
 *
 *  Defines the Gateway class.
 *  Everything here handles all gateway/ws logic.
 *
 *  ## WHEN CONTRIBUTING:
 *
 *  Please read Discord's documentation on its gateway before contributing.
 *
 */

const Events = require("events");
const WebSocket = require("ws");
const ProxyHTTPS = require("https-proxy-agent").HttpsProxyAgent;
const util = require("../auth/util.js");
const constructs = require("./constructs.js");
const def = require("./def.js");

class GatewayEvent {
    constructor(op, d, s, t) {
        this.opcode = op;
        this.data = d;
        this.sessionNonce = s;
        this.type = t;
    }

    static fromMsg(message) {
        return new GatewayEvent(message.op, message.d, message.s, message.t);
    }
}

class ChunkCompletion {
    constructor(init, onfinish) {
        this.data = init;
        this.onfinish = (isError) => {
            onfinish(this.data, isError);
        };
    }
}

class GatewayHandler extends Events {
    constructor(client, proxy, config) {
        super();
        this.client = client;
        this.url = `${config.wsurl}/?v=${config.api}&encoding=json`;
        this.origin = config.url;
        this.proxy = proxy;
        this.config = config;
        this.currentNonce = 0;
        this.jitter = 1;
        this.heartbeatTimer = 45000; // default heartbeat on documentation
        this.allowReconnection = true;
        this.lastSequence = null;
        this.hasConnected = false;
        this.heartbeatInterval = undefined;
        this.info = {};
        this.chunkProcs = {};
    }

    async ws_request(op, d) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            const data = JSON.stringify({ op, d });

            this.ws.send(data);
            // console.log(`Sending: ${data}`);
        }
    }

    identify() {
        this.ws_request(def.GatewayOpcodes.Identify, {
            token: this.client.token,
            capabilities: 16381,
            properties: {
                os: this.client.clientData.os,
                browser: this.client.clientData.browser,
                device: "",
                system_locale: "en-US",
                browser_user_agent: this.client.clientData.ua,
                browser_version: "118.0.0.0",
                os_version: "",
                referrer: "",
                referring_domain: "",
                referrer_current: "",
                referring_domain_current: "",
                release_channel: "stable",
                client_build_number: 250759,
                client_event_source: null,
            },
            presence: {
                status: "online",
                since: 0,
                activities: [],
                afk: false,
            },
            compress: false,
            client_state: {
                guild_versions: {},
                highest_last_message_id: "0",
                read_state_version: 0,
                user_guild_settings_version: -1,
                user_settings_version: -1,
                private_channels_version: "0",
                api_code_version: 0,
            },
        });
    }

    update_voice_status() {
        this.ws_request(def.GatewayOpcodes.Voice_State_Update, {
            guild_id: null,
            channel_id: null,
            self_mute: true,
            self_deaf: false,
            self_video: false,
            flags: 2,
        });
    }

    DM_focus(channel_id) {
        this.ws_request(def.GatewayOpcodes.DM_Focus, {
            channel_id: channel_id,
        });
    }

    heartbeat() {
        this.ws_request(def.GatewayOpcodes.Heartbeat, this.lastSequence);
    }

    resume() {
        this.ws_request(def.GatewayOpcodes.Resume, {
            token: this.client.token,
            session_id: this.info.session_id,
            seq: this.lastSequence,
        });
    }

    request_guild_members(options) {
        return new Promise((resolve) => {
            options = { ...constructs.RequestGuildMembers, ...options };
            const nonce = (this.currentNonce++).toString(36);
            this.chunkProcs[nonce] = new ChunkCompletion(
                { members: [], presences: [] },
                (data, isError) => {
                    if (isError) resolve(undefined);
                    else resolve(data);
                }
            );
            util.removeNulls(options);
            this.ws_request(def.GatewayOpcodes.Request_Guild_Members, {
                ...options,
                nonce,
            });
        });
    }

    connectWS(shouldResume = false) {
        this.ws = new WebSocket(this.url, {
            origin: this.origin,
            agent: this.proxy ? new ProxyHTTPS(this.proxy.href) : undefined,
        });
        this.initGateway(shouldResume);
    }

    stopEvents() {
        if (this.heartbeatInterval !== undefined) clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = undefined;
    }

    disconnectWS(isGraceful = true) {
        this.stopEvents();
        if (this.ws?.readyState == WebSocket.OPEN) {
            if (isGraceful) this.ws.close();
            else this.ws.terminate();
        }
    }

    initGateway(isResume) {
        if (isResume) {
            isResume = this.lastSequence !== null;
        } else {
            this.lastSequence = null;
        }

        this.ws.on("open", () => {
            // console.log("Connect success");
        });

        this.ws.on("message", (rawMessage) => {
            const message = GatewayEvent.fromMsg(JSON.parse(rawMessage));
            // console.log(message);

            switch (message.opcode) {
                case def.GatewayOpcodes.Dispatch: {
                    // Dispatch
                    // Gateway event with info
                    this.handleEvent(message);
                    break;
                }
                case def.GatewayOpcodes.Heartbeat: {
                    // Heartbeat
                    // Forces a heartbeat check
                    this.heartbeat();
                    break;
                }
                case def.GatewayOpcodes.Reconnect: {
                    // Reconnect
                    // Forces the client to reconnect (Probably server change)
                    this.disconnectWS();
                    break;
                }
                case def.GatewayOpcodes.Invalid_Session: {
                    // Invalid session
                    // Forces a restart of the connection
                    this.disconnectWS();
                    break;
                }
                case def.GatewayOpcodes.Hello: {
                    // Hello
                    // Sent after connection
                    this.heartbeatTimer = message.data.heartbeat_interval;
                    this.heartbeatInterval = setInterval(() => {
                        this.heartbeat();
                    }, this.heartbeatTimer * this.jitter);
                    this.heartbeat();

                    if (isResume) this.resume();
                    else this.identify();
                    this.update_voice_status();
                    break;
                }
                case def.GatewayOpcodes.Heartbeat_ACK: {
                    // Heartbeat ACK
                    // Ignore, no actions need to be taken
                    break;
                }
            }
        });

        this.ws.on("close", (code) => {
            this.stopEvents();
            if (!this.allowReconnection) return;
            switch (code) {
                case 4000: // Unknown error
                case 4001: // Unknown opcode
                case 4002: // Decode error
                case 4005: // Already authenticated
                case 4008: // Rate limited
                case 4009: {
                    // Session timed out

                    // Reconnect with a resumed session
                    this.connectWS(true);
                    break;
                }
                case 4003: // Not authenticated
                case 4007: {
                    // Invalid seq

                    // Attempt to reconnect if a session already happened
                    this.connectWS(true);
                    break;
                }
                case 4004: // Authentication failed (cannot reconnect)
                case 4010: // Invalid shard (cannot reconnect)
                case 4011: // Sharding required (cannot reconnect)
                case 4012: // Invalid API version (cannot reconnect)
                case 4013: // Invalid intent(s) (cannot reconnect)
                case 4014: {
                    // Disallowed intent(s) (cannot reconnect)

                    // Error from programmer, don't reconnect
                    this.emit("error", `Discord gateway send an error code of "${code}"`);
                    break;
                }
                default: {
                    // Undocumented error
                    this.connectWS(true);
                    break;
                }
            }
        });
    }

    handleEvent(message) {
        this.lastSequence = message.sessionNonce;
        this.client.emit("dispatch", message);
        switch (message.type) {
            case "READY": {
                // Gateway res
                this.info = message.data;
                break;
            }
            case "READY_SUPPLEMENTAL": {
                // Extra splash screen info
                this.info.supplemental = message.data;
                if (!this.hasConnected) this.emit("ready");
                this.hasConnected = true;
                this.heartbeat();
                break;
            }
            case "MESSAGE_CREATE": {
                // First emit a generic message event
                this.client.emit("message", message.data);

                // Next emit a specialized event
                if (def.MessageTypes?.[message.data.type]?.length)
                    this.client.emit(
                        def.MessageTypes[message.data.type].toLowerCase(),
                        message.data
                    );
                break;
            }
            /*
            case "MESSAGE_UPDATE": {
                this.client.emit(`update_${def.MessageTypes[message.data.type].toLowerCase()}`, message.data);
                break;
            }
            */
            case "GUILD_MEMBERS_CHUNK": {
                let chunkData = this.chunkProcs[message.data.nonce];
                if (message.data.not_found !== undefined) {
                    chunkData.onfinish(true);
                    break;
                }
                chunkData.data.members = chunkData.data.members.concat(message.data.members);
                if (message.data.presences)
                    chunkData.data.presences = chunkData.data.presences.concat(
                        message.data.presences
                    );

                if (message.data.chunk_count - 1 <= message.data.chunk_index) {
                    chunkData.onfinish(false);
                }
                break;
            }
            default: {
                if (message?.type?.length)
                    this.client.emit(message.type.toLowerCase(), message.data);
                break;
            }
        }
    }
}

module.exports = GatewayHandler;
