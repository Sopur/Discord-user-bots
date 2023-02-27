/**
 *
 *  ## OVERVIEW
 *
 *  A central class used for making fetch requests.
 *
 */

const fetch = require("node-fetch");
const ProxyHTTPS = require("https-proxy-agent");
const ClientData = require("./data");
const Fingerprint = require("./fingerprint");
const UUID = require("./uuid");
const CookieGenerator = require("./cookie");
const { DiscordAPIError } = require("../util/error");

class Requester {
    constructor(proxy) {
        this.url = "https://discord.com";
        this.api = "v9";
        this.defaultData = new ClientData("Windows", "Chromium", "109.0", undefined, undefined, new Fingerprint(), new UUID());
        this.cookie = "";
        this.isRegistering = false;
        if (proxy !== undefined) {
            this.proxy = new ProxyHTTPS(proxy);
        }
    }
    async build_request(body, clientData, method, extraHeaders) {
        if (this.cookie.length === 0) {
            this.cookie = await new CookieGenerator(this).compile();
        }
        let fetchRequest = {
            headers: {
                accept: "*/*",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/json",
                "sec-ch-ua": `"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"`,
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": `"Linux"`,
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                cookie: this.cookie,
                Referer: `${this.url}/`,
                "Referrer-Policy": "strict-origin-when-cross-origin",
                dnt: "1",
                origin: this.url,
                ...extraHeaders,
            },
            method: method,
        };
        if (clientData?.fingerprint?.fingerprint !== undefined) {
            fetchRequest.headers["x-fingerprint"] = clientData.fingerprint.fingerprint;
        }
        if (clientData.xtrack !== undefined) {
            if (this.isRegistering) {
                fetchRequest.headers["x-track"] = clientData.xtrack;
            } else {
                fetchRequest.headers["x-super-properties"] = clientData.xtrack;
            }
        }
        if (clientData.ua !== undefined) {
            fetchRequest.headers["user-agent"] = clientData.ua;
        }
        if (clientData.authorization !== undefined) {
            fetchRequest.headers["authorization"] = clientData.authorization;
        }
        if (method === "POST" || method === "PATCH") {
            if (typeof body !== "object") throw new Error("Invalid body");
            fetchRequest.body = JSON.stringify(body);
        }
        if (this.proxy !== undefined) {
            fetchRequest["agent"] = this.proxy;
        }
        return fetchRequest;
    }

    build_noparse() {
        let fetchRequest = {
            method: "GET",
        };

        if (this.proxy !== undefined) {
            fetchRequest["agent"] = this.proxy;
        }
    }

    async fetch_request(url, body, clientData = this.defaultData, method = "POST", extraHeaders = {}) {
        const fetchRequest = await this.build_request(body, clientData, method, extraHeaders);
        // console.log(`${this.url}/api/${this.api}/${url}`, fetchRequest); // For logging fetches
        return new Promise((resolve) => {
            fetch(`${this.url}/api/${this.api}/${url}`, fetchRequest)
                .then(async (res) => {
                    try {
                        resolve(await res.json());
                    } catch (e) {
                        resolve(res.status);
                    }
                })
                .catch((res) => {
                    resolve({ internalError: true, error: res });
                });
        });
    }
    async fetch_noparse(url) {
        const fetchRequest = this.build_noparse();
        return fetch(url, fetchRequest);
    }
}

module.exports = Requester;
