/**
 *
 *  ## OVERVIEW
 *
 *  Defines a class to write to buffers.
 *  Defines a class to read from buffers.
 *
 *  ## WHEN CONTRIBUTING:
 *
 *  Make sure to give read/write functions the get/set prefix.
 *
 */

class Reader {
    constructor(buffer, littleEndian = true) {
        this.arrayView = new DataView(buffer);
        this.offset = 0;
        this.littleEndian = littleEndian;
    }

    get i8() {
        const data = this.arrayView.getInt8(this.offset);
        this.offset += 1;
        return data;
    }

    get i16() {
        const data = this.arrayView.getInt16(this.offset, this.littleEndian);
        this.offset += 2;
        return data;
    }

    get i32() {
        const data = this.arrayView.getInt32(this.offset, this.littleEndian);
        this.offset += 4;
        return data;
    }

    get i64() {
        const data = this.arrayView.getBigInt64(this.offset, this.littleEndian);
        this.offset += 8;
        return data;
    }

    get u8() {
        const data = this.arrayView.getUint8(this.offset);
        this.offset += 1;
        return data;
    }

    get u16() {
        const data = this.arrayView.getUint16(this.offset, this.littleEndian);
        this.offset += 2;
        return data;
    }

    get u32() {
        const data = this.arrayView.getUint32(this.offset, this.littleEndian);
        this.offset += 4;
        return data;
    }

    get u64() {
        const data = this.arrayView.getBigUint64(this.offset, this.littleEndian);
        this.offset += 8;
        return data;
    }

    get f32() {
        const data = this.arrayView.getFloat32(this.offset, this.littleEndian);
        this.offset += 4;
        return data;
    }

    get f64() {
        const data = this.arrayView.getFloat64(this.offset, this.littleEndian);
        this.offset += 8;
        return data;
    }
}

class Writer {
    constructor(size = 1024, littleEndian = true) {
        this.memory = new ArrayBuffer(size);
        this.view = new DataView(this.memory);
        this.offset = 0;
        this.littleEndian = littleEndian;
    }

    set i8(value) {
        this.view.setInt8(this.offset, value);
        this.offset += 1;
    }

    set i16(value) {
        this.view.setInt16(this.offset, value, this.littleEndian);
        this.offset += 2;
    }

    set i32(value) {
        this.view.setInt32(this.offset, value, this.littleEndian);
        this.offset += 4;
    }

    set i64(value) {
        this.view.setBigInt64(this.offset, value, this.littleEndian);
        this.offset += 8;
    }

    set u8(value) {
        this.view.setUint8(this.offset, value);
        this.offset += 1;
    }

    set u16(value) {
        this.view.setUint16(this.offset, value, this.littleEndian);
        this.offset += 2;
    }

    set u32(value) {
        this.view.setUint32(this.offset, value, this.littleEndian);
        this.offset += 4;
    }

    set u64(value) {
        this.view.setBigUint64(this.offset, value, this.littleEndian);
        this.offset += 8;
    }

    set f32(value) {
        this.view.setFloat32(this.offset, value, this.littleEndian);
        this.offset += 4;
    }

    set f64(value) {
        this.view.setFloat64(this.offset, value, this.littleEndian);
        this.offset += 8;
    }

    get length() {
        return this.offset;
    }

    get buffer() {
        return this.memory.slice(0, this.length);
    }

    toString() {
        let buffer = new Uint8Array(this.buffer);
        let str = "";
        for (let num of buffer) {
            str += String.fromCharCode(num);
        }
        return str;
    }

    toBase64() {
        return btoa(this.toString());
    }
}

module.exports = {
    Reader,
    Writer,
};
