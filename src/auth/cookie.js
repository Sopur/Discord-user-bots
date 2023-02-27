/**
 *
 *  ## OVERVIEW
 *
 *  A class to get CloudFlare cookies.
 *
 */

class CookieGenerator {
    constructor(requester, url = "https://discord.com") {
        this.requester = requester;
        this.url = url;
    }

    async compile() {
        let res = await this.requester.fetch_noparse(this.url);
        let cookies = res.headers.get("set-cookie").split(";");
        const values = [];
        for (const cookie of cookies) {
            if (cookie.includes("__")) values.push("__" + cookie.split("__")[1]);
        }

        let compiled = "";
        for (const value of values) {
            compiled += `${value}; `;
        }
        return compiled + "locale=en-US";
    }
}

module.exports = CookieGenerator;
