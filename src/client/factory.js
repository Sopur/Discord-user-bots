/**
 *
 *  ## OVERVIEW
 *
 *  Defines the main AccountFactory class.
 *
 */

const { DiscordUserBotsError } = require("../util/error.js");
const ClientData = require("../auth/data.js");
const Requester = require("../auth/fetch.js").Requester;
const ScienceBody = require("../auth/science.js");
const Captcha = require("./captcha");

class AccountFactory {
    constructor() {}

    async requestCaptchaInfo(requester, clientData, username) {
        const info = await requester.fetch_request_secure(
            "auth/register",
            {
                consent: true,
                fingerprint: clientData.fingerprint.fingerprint,
                username: username,
            },
            clientData
        );
        // console.log("[CAPTCHA] Info: ", info);
        return new Captcha(
            info.captcha_service,
            info.captcha_sitekey,
            requester.url,
            requester.cookie,
            clientData.ua,
            info.message
        );
    }

    async createAccount(username, solveCaptcha, proxy) {
        // Get a fetcher for this client
        const requester = new Requester(proxy);
        requester.isRegistering = true;

        // Get data for this client
        const clientData = new ClientData();
        await clientData.gen(requester);

        // Settle tracking shit
        /*
        await requester.fetch_request("track/ott", { type: "landing" }, clientData, "POST");
        await requester.fetch_request(
            "science",
            new ScienceBody(clientData)
                .eventView("mktg_page_viewed", "landing", null, null, false)
                .userTriggered("experiment_user_triggered", "2022-07_swp_discover_nav_bar", 1, 1, 0)
                .eventClick("click_landing_cta", "no session", "landing")
                .export(),
            clientData,
            "POST"
        );
        */

        // Get a captcha
        const captchaInfo = await this.requestCaptchaInfo(requester, clientData, username);
        if (captchaInfo.error !== undefined || captchaInfo.siteKey === undefined)
            throw new DiscordUserBotsError(
                `Error getting captcha information: ${captchaInfo.error}`
            );

        const captchaKey = await solveCaptcha(captchaInfo);
        // console.log(captchaKey);
        if (typeof captchaKey.token !== "string" || captchaKey.token.length < 10)
            throw new DiscordUserBotsError(`Invalid Captcha key: "${captchaKey.token}"`);
        // console.log(captchaKey, clientData.ua);
        clientData.ua = captchaKey.ua;
        // console.log("[CAPTCHA] Done solving");

        // Attempt to create an account
        const info = await requester.fetch_request_secure(
            "auth/register",
            {
                consent: true,
                fingerprint: clientData.fingerprint.fingerprint,
                username: username,
                captcha_key: captchaKey.token,
            },
            clientData,
            "POST"
        );

        // Check if it was successful
        const token = info.token;
        if (token === undefined) {
            throw new DiscordUserBotsError(
                `Failed to create account: "${JSON.stringify(
                    info
                )}". If this is a captcha error, it could be due to the IP of which you solved the captcha with and the IP you used for this request not matching up.`
            );
        }
        return token;
    }
}

module.exports = AccountFactory;
