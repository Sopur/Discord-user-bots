/**
 *
 *  ## OVERVIEW
 *
 *  A class for handling Discord's x-track system.
 *
 */

function generateXTrack(os, browser, browserVersion, ua) {
    return btoa(
        JSON.stringify({
            os: os,
            browser: browser,
            device: "",
            system_locale: "en-US",
            browser_user_agent: ua,
            browser_version: browserVersion,
            os_version: "",
            referrer: "",
            referring_domain: "",
            referrer_current: "",
            referring_domain_current: "",
            release_channel: "stable",
            client_build_number: 9999,
            client_event_source: null,
        })
    );
}

module.exports = generateXTrack;
