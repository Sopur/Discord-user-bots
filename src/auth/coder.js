/**
 *
 *  ## OVERVIEW
 *
 *  Text encoding/decoding class.
 *
 */

class Coder {
    constructor() {
        this.encoder = new TextEncoder();
        this.decoder = new TextDecoder();
    }
    encode(data) {
        return this.encoder.encode(data);
    }
    decode(data) {
        return this.decoder.decode(data);
    }
}

module.exports = new Coder();
