/**
 *
 *  ## OVERVIEW
 *
 *  A class for handling Discord's UUID system.
 *
 */

const { Reader, Writer } = require("./buffer.js");

class UUID {
    constructor() {
        this.randomPrefix = 0 | Math.floor(4294967296 * Math.random());
        this.creationTime = BigInt(Date.now());
        this.sequence = 0;
    }
    from2x32(l, r) {
        let writer = new Writer(8);
        writer.i32 = l;
        writer.i32 = r;
        let reader = new Reader(writer.buffer);
        return reader.i64;
    }
    fit32(num) {
        return 0 | Number(num % 4294967296n);
    }
    shift32(num) {
        return 0 | Number(num >> 32n);
    }
    generate(fingerprintID) {
        let id = BigInt(fingerprintID);
        let sequenceID = this.sequence++;
        let writer = new Writer(24);
        writer.i32 = this.fit32(id);
        writer.i32 = this.shift32(id);
        writer.i32 = this.randomPrefix;
        writer.i32 = this.fit32(this.creationTime);
        writer.i32 = this.shift32(this.creationTime);
        writer.i32 = sequenceID;
        return writer.toBase64();
    }
    parse(uuid) {
        let str = atob(uuid);
        let buffer = [];
        for (let num of str) {
            buffer.push(num.charCodeAt());
        }
        let reader = new Reader(new Uint8Array(buffer).buffer);
        return {
            id: this.from2x32(reader.i32, reader.i32),
            randomPrefix: reader.i32,
            creationTime: this.from2x32(reader.i32, reader.i32),
            sequenceID: reader.i32,
        };
    }
}

module.exports = UUID;
