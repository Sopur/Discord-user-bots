/**
 *
 *  ## OVERVIEW
 *
 *  A class for handling Discord's fingerprint system.
 *
 */

class Fingerprint {
    constructor(requester) {
        this.requester = requester;
        this.fingerprint = undefined;
        this.fingerprintID = undefined;
    }

    async request() {
        const info = await this.requester.fetch_request("experiments", undefined, undefined, "GET");
        this.fingerprint = info.fingerprint;
        return this.fingerprint;
    }

    get id() {
        if (this.fingerprint === undefined) return undefined;
        if (this.fingerprintID === undefined) {
            this.fingerprintID = this.fingerprint.split(".")[0];
        }
        return this.fingerprintID;
    }
}

module.exports = Fingerprint;
