/**
 *
 *  ## OVERVIEW
 *
 *  A class for handling Discord's session system.
 *  Minified because I copied the source from Discord source files, which is minified.
 *
 */

const crypto = require("crypto");

class ClientSession {
    constructor() {
        for (var n = this.getRandoms, t = [], r = {}, o = 0; o < 256; o++) {
            t[o] = (o + 256).toString(16).substr(1);
            r[t[o]] = o;
        }
        function s(e, i) {
            var a = i || 0,
                n = t;
            return (
                n[e[a++]] +
                n[e[a++]] +
                n[e[a++]] +
                n[e[a++]] +
                "-" +
                n[e[a++]] +
                n[e[a++]] +
                "-" +
                n[e[a++]] +
                n[e[a++]] +
                "-" +
                n[e[a++]] +
                n[e[a++]] +
                "-" +
                n[e[a++]] +
                n[e[a++]] +
                n[e[a++]] +
                n[e[a++]] +
                n[e[a++]] +
                n[e[a++]]
            );
        }
        var E = n(),
            _ = [1 | E[0], E[1], E[2], E[3], E[4], E[5]],
            T = 16383 & ((E[6] << 8) | E[7]),
            l = 0,
            u = 0;
        function d(e, i, a) {
            var t = (i && a) || 0;
            if ("string" == typeof e) {
                i = "binary" == e ? new Array(16) : null;
                e = null;
            }
            var r = (e = e || {}).random || (e.rng || n)();
            r[6] = (15 & r[6]) | 64;
            r[8] = (63 & r[8]) | 128;
            if (i) for (var o = 0; o < 16; o++) i[t + o] = r[o];
            return i || s(r);
        }
        this.v1 = function (e, i, a) {
            var n = (i && a) || 0,
                t = i || [],
                r = undefined !== (e = e || {}).clockseq ? e.clockseq : T,
                o = undefined !== e.msecs ? e.msecs : new Date().getTime(),
                E = undefined !== e.nsecs ? e.nsecs : u + 1,
                d = o - l + (E - u) / 1e4;
            d < 0 && undefined === e.clockseq && (r = (r + 1) & 16383);
            (d < 0 || o > l) && undefined === e.nsecs && (E = 0);
            if (E >= 1e4) throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
            l = o;
            u = E;
            T = r;
            var c = (1e4 * (268435455 & (o += 122192928e5)) + E) % 4294967296;
            t[n++] = (c >>> 24) & 255;
            t[n++] = (c >>> 16) & 255;
            t[n++] = (c >>> 8) & 255;
            t[n++] = 255 & c;
            var R = ((o / 4294967296) * 1e4) & 268435455;
            t[n++] = (R >>> 8) & 255;
            t[n++] = 255 & R;
            t[n++] = ((R >>> 24) & 15) | 16;
            t[n++] = (R >>> 16) & 255;
            t[n++] = (r >>> 8) | 128;
            t[n++] = 255 & r;
            for (var A = e.node || _, S = 0; S < 6; S++) t[n + S] = A[S];
            return i || s(t);
        };
        this.v4 = d;
        this.parse = function (e, i, a) {
            var n = (i && a) || 0,
                t = 0;
            i = i || [];
            e.toLowerCase().replace(/[0-9a-f]{2}/g, function (e) {
                t < 16 && (i[n + t++] = r[e]);
            });
            for (; t < 16; ) i[n + t++] = 0;
            return i;
        };
        this.unparse = s;
    }
    getRandoms() {
        let values = new Uint8Array(16);
        crypto.getRandomValues(values);
        return values;
    }
}

module.exports = ClientSession;
