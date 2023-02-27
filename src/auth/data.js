/**
 *
 *  ## OVERVIEW
 *
 *  A central class for the requester to use in its requests.
 *
 */

const { genComponent, genUA } = require("./util.js");
const generateXTrack = require("./xtrack.js");
const Fingerprint = require("./fingerprint.js");
const UUID = require("./uuid.js");
const Session = require("./session.js");

class ClientData {
    constructor(os, browser, browserVersion, ua, xtrack, fingerprint, uuid, authorization) {
        this.os = os;
        this.browser = browser;
        this.browserVersion = browserVersion;
        this.ua = ua;
        this.xtrack = xtrack;
        this.fingerprint = fingerprint;
        this.uuid = uuid;
        this.authorization = authorization;
    }
    async gen(requester) {
        requester.defaultData = this;
        this.os = genComponent("OS");
        this.browser = genComponent("browser");
        this.browserVersion = genComponent("browserVersion");
        this.ua = genUA();
        this.xtrack = generateXTrack(this.os, this.browser, this.browserVersion, this.ua);
        this.fingerprint = new Fingerprint(requester);
        await this.fingerprint.request();
        this.uuid = new UUID();
        this.session = new Session();
        this.sessionID = this.session.v4();
    }
    generateUUID() {
        return this.uuid.generate(this.fingerprint.id);
    }
}

module.exports = ClientData;
