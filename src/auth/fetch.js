/**
 *
 *  ## OVERVIEW
 *
 *  A central class used for making fetch requests to Discord.
 *
 */

const ProxyHTTPS = require("https-proxy-agent").HttpsProxyAgent;
const FormData = require("form-data");
const ClientData = require("./data.js");
const Fingerprint = require("./fingerprint.js");
const UUID = require("./uuid.js");
const CookieGenerator = require("./cookie.js");
const Coder = require("./coder.js");
const { DiscordUserBotsInternalError } = require("../util/error.js");
const http = require("./http.js");

class Requester {
    constructor(proxy) {
        this.hostname = "discord.com";
        this.port = 443;
        this.url = "https://discord.com";
        this.api = "9";
        this.defaultData = new ClientData(
            "Windows",
            "Chromium",
            "109.0",
            undefined,
            undefined,
            new Fingerprint(),
            new UUID()
        );
        this.cookie = "";
        this.isRegistering = false;
        if (proxy !== undefined) {
            this.proxy = new URL(proxy);
        }
    }
    async build_request(body, clientData, method, extraHeaders) {
        if (this.cookie.length === 0) {
            this.cookie = await new CookieGenerator(this).compile();
        }
        let fetchRequest = {
            method,
            headers: {
                Accept: "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-US,en;q=0.9",
                Authorization: "",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
                "Content-Type": "application/json",
                Cookie: this.cookie,
                Host: this.hostname,
                Origin: this.url,
                Pragma: "no-cache",
                Referer: `${this.url}/`,
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "User-Agent": "",
                "X-Debug-Options": "bugReporterEnabled",
                "X-Discord-Locale": "en-US",
                "X-Fingerprint": "",
                "X-Super-Properties": "",
                "X-Track": "",
                // "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
                // "sec-ch-ua-mobile": "?0",
                // "sec-ch-ua-platform": "\"Linux\"",
                ...extraHeaders,
            },
        };

        // Fix retarded form-data lib
        if (extraHeaders["content-type"] !== undefined) {
            fetchRequest.headers["Content-Type"] = extraHeaders["content-type"];
            delete fetchRequest.headers["content-type"];
        }

        if (clientData?.fingerprint?.fingerprint !== undefined) {
            fetchRequest.headers["X-Fingerprint"] = clientData.fingerprint.fingerprint;
        }
        if (clientData.xtrack !== undefined) {
            if (this.isRegistering) {
                fetchRequest.headers["X-Track"] = clientData.xtrack;
            } else {
                fetchRequest.headers["X-Super-Properties"] = clientData.xtrack;
            }
        }
        if (clientData.ua !== undefined) {
            fetchRequest.headers["User-Agent"] = clientData.ua;
        }
        if (clientData.authorization !== undefined) {
            fetchRequest.headers["Authorization"] = clientData.authorization;
        }
        if (body != undefined) {
            if (body instanceof FormData) {
                fetchRequest.body = body;
            } else if (typeof body === "object" || typeof body === "string") {
                fetchRequest.body = JSON.stringify(body);
                fetchRequest.headers["Content-Length"] = Coder.encode(
                    fetchRequest.body
                ).length.toString();
            } else throw new DiscordUserBotsInternalError("Invalid body");
        } else {
            fetchRequest.headers["Content-Length"] = "0";
        }
        for (let header of Object.keys(fetchRequest.headers)) {
            if (fetchRequest.headers[header].length === 0) {
                delete fetchRequest.headers[header];
            }
        }
        if (this.isRegistering) {
            delete fetchRequest.headers["X-Debug-Options"];
            delete fetchRequest.headers["X-Discord-Locale"];
        }
        return fetchRequest;
    }

    build_noparse() {
        let fetchRequest = {
            method: "GET",
        };

        if (this.proxy !== undefined) {
            fetchRequest["agent"] = new ProxyHTTPS(this.proxy.href);
        }

        return fetchRequest;
    }

    async fetch_request_insecure(
        url,
        body,
        clientData = this.defaultData,
        method = "POST",
        extraHeaders = {}
    ) {
        const fetchRequest = await this.build_request(body, clientData, method, extraHeaders);
        return (
            await http.insecure(`${this.url}/api/v${this.api}/${url}`, fetchRequest, this.proxy)
        ).purify();
    }
    async fetch_request_secure(
        url,
        body,
        clientData = this.defaultData,
        method = "POST",
        extraHeaders = {}
    ) {
        const fetchRequest = await this.build_request(body, clientData, method, extraHeaders);
        return (
            await http.secure(`${this.url}/api/v${this.api}/${url}`, fetchRequest, this.proxy)
        ).purify();
    }
    async fetch_noparse(url) {
        const fetchRequest = this.build_noparse();
        return http.node(url, fetchRequest);
    }
}

module.exports = { Requester };
