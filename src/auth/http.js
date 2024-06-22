/**
 *
 *  ## OVERVIEW
 *
 *  Custom non custom HTTP client definitions.
 *  DUB uses a custom HTTP client to make DUB look like a browser client.
 *
 */

const net = require("net");
const tls = require("tls");
const ProxyHTTPS = require("https-proxy-agent").HttpsProxyAgent;
const brotli = require("brotli-compress");
const gzip = require("node-gzip");
const NodeFetch = require("node-fetch");
const HTTPParser = require("http-parser-js").HTTPParser;
const Coder = require("./coder.js");
const { DiscordAPIError, DiscordUserBotsInternalError } = require("../util/error.js");

class FetchResponse {
    constructor(status, body, internalError = false, error = undefined) {
        this.status = status;
        this.body = body;
        this.internalError = internalError;
        this.error = error;
    }
    purify() {
        if (this.status < 200 || this.status > 300) this.throw();
        if (this.internalError) this.throw();
        if (this.error) this.throw();
        return this.body;
    }
    throw() {
        throw new DiscordAPIError(JSON.stringify(this));
    }
}

// Only supports secure requests rn (however, insecure proxies are supported)
/**
 * Secure fetch client
 * @param {string} url URL
 * @param {object} fetchRequest Request body
 * @param {object} proxy Proxy object
 * @returns {Promise<FetchResponse>}
 */
async function secure(urlStr, fetchRequest, proxy) {
    const url = new URL(urlStr);

    return new Promise((resolve, reject) => {
        let socket;
        let proxySocket;

        const onSocketOpen = () => {
            socket.on("error", (e) => {
                resolve(new FetchResponse(0, undefined, true, e));
                socket.destroy();
            });

            let data = `${fetchRequest.method} ${url.pathname + url.search} HTTP/1.1\r\n`;
            for (let header of Object.keys(fetchRequest.headers)) {
                data += `${header}: ${fetchRequest.headers[header]}\r\n`;
            }
            data += "\r\n";
            if (fetchRequest.body) {
                data += fetchRequest.body;
            }
            socket.write(data);

            const parser = new HTTPParser(HTTPParser.RESPONSE);

            let status;
            let chunks = [];
            let headers = {};

            socket.on("data", (chunk) => {
                parser.execute(chunk);
            });

            parser[HTTPParser.kOnHeadersComplete] = (res) => {
                status = res.statusCode;
                for (let i = 0; i < res.headers.length; i += 2) {
                    headers[res.headers[i]] = res.headers[i + 1];
                }
            };
            parser[HTTPParser.kOnBody] = (chunk, offset, length) => {
                chunks.push(chunk.slice(offset, offset + length));
            };
            parser[HTTPParser.kOnMessageComplete] = async () => {
                let resData = new FetchResponse(status, undefined);
                if (chunks.length) {
                    let data = Buffer.concat(chunks);
                    switch (headers["Content-Encoding"]) {
                        case "br": {
                            data = await brotli.decompress(data);
                            break;
                        }
                        case "gzip": {
                            data = await gzip.ungzip(data);
                            break;
                        }
                        case undefined: {
                            break; // None
                        }
                        default: {
                            throw new DiscordUserBotsInternalError(
                                `Discord asked for an unknown compression encoding "${headers["Content-Encoding"]}"`
                            );
                        }
                    }
                    try {
                        resData.body = JSON.parse(Coder.decode(data));
                    } catch (e) {
                        // If JSON error
                    } finally {
                        resolve(resData);
                    }
                } else {
                    resolve(resData);
                }
                socket.destroy();
                if (proxySocket) {
                    proxySocket.destroy();
                }
            };
        };

        const onProxySocketOpen = () => {
            let data = `CONNECT ${url.host}:${url.port || 443} HTTP/1.1\r\nHost: ${url.host}\r\n`;
            if (proxy.username || proxy.password) {
                data += `Proxy-Authorization: Basic ${Buffer.from(
                    `${proxy.username}:${proxy.password}`
                ).toString("base64")}\r\n`;
            }
            data += "\r\n";
            proxySocket.write(data);
        };

        if (proxy) {
            const parser = new HTTPParser(HTTPParser.RESPONSE);

            if (proxy.protocol === "https:") {
                proxySocket = tls.connect(
                    parseInt(proxy.port) || 443,
                    proxy.hostname,
                    {},
                    onProxySocketOpen
                );
            } else {
                proxySocket = net.connect(
                    parseInt(proxy.port) || 80,
                    proxy.hostname,
                    {},
                    onProxySocketOpen
                );
            }
            proxySocket.on("data", (chunk) => {
                parser.execute(chunk);
            });
            proxySocket.on("error", (e) => {
                resolve(new FetchResponse(0, undefined, true, e));
                proxySocket.destroy();
            });

            parser[HTTPParser.kOnHeadersComplete] = function (res) {
                if (res.statusCode < 200 || res.statusCode >= 300) {
                    resolve(
                        new FetchResponse(0, undefined, true, `Proxy error: ${res.statusMessage}`)
                    );
                    proxySocket.destroy();
                    return;
                }
                socket = tls.connect(
                    {
                        socket: proxySocket,
                        checkServerIdentity: () => {
                            return null;
                        },
                    },
                    onSocketOpen
                );
            };
        } else {
            socket = tls.connect(parseInt(url.port) || 443, url.hostname, {}, onSocketOpen);
        }
    });
}

/**
 * Node fetch wrapper
 * @param {string} url URL
 * @param {object} fetchRequest Request body
 * @param {object} proxy Proxy object
 * @returns {Promise<FetchResponse>}
 */
async function insecure(url, fetchRequest, proxy) {
    if (proxy !== undefined) {
        fetchRequest["agent"] = new ProxyHTTPS(proxy.href);
    }
    return new Promise((resolve) => {
        NodeFetch(url, fetchRequest)
            .then(async (res) => {
                let resData = new FetchResponse(res.status, undefined);
                try {
                    resData.body = await res.json();
                } catch {
                } finally {
                    resolve(resData);
                }
            })
            .catch((res) => {
                resolve(new FetchResponse(res.status ?? 0, undefined, true, res.stack));
            });
    });
}

module.exports = {
    FetchResponse,
    secure,
    insecure,
    node: NodeFetch,
};
