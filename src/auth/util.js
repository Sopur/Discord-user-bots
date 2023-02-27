/**
 *
 *  ## OVERVIEW
 *
 *  Defines all the utility functions.
 *
 */

const faker = require("@faker-js/faker");
const fakeData = require("./fake.json");

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function rrandom(min, max) {
    return Math.round(random(min, max));
}

function randomInArray(arr) {
    return arr[Math.round(Math.random() * (arr.length - 1))];
}

function randomName(lengthMin, lengthMax = lengthMin) {
    const length = rrandom(lengthMin, lengthMax);
    const min = 32;
    const max = 126;
    let string = "";
    for (let i = 0; i < length; i++) {
        string += String.fromCharCode(rrandom(min, max));
    }

    return string;
}

function genComponent(name) {
    return randomInArray(fakeData[name]);
}

function genUA() {
    return faker.faker.internet.userAgent();
}

async function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

module.exports = {
    random,
    rrandom,
    randomInArray,
    randomName,
    genComponent,
    genUA,
    sleep,
};
