const Discord = require("../src/exports.js");
const client = new Discord.Client("Token goes here.");

// Config
const banned = ["`", "https", "@", "\n"]; // Do not repeat these
const mailingList = [""]; // IDs of people to ping for the mailing list
const welcomeChannel = ""; // ID of the channel to welcome the people subscribed to the mailing list
const victim = ""; // Victim ID
const victimName = "Add name!"; // Name of the victim
const errorMessage = "message could not be gathered"; // Message to send if there was an error
const messageCharacterLimit = 100; // The character limit for a message made by the victim to avoid spam

let rateLimited = true;
function rateLimit() {
    rateLimited = false;
    setTimeout(() => {
        rateLimited = true;
    }, 3000);
}
function sendMailingList(message, channel) {
    mailingList.forEach((id) => {
        client.send(channel || welcomeChannel, {
            content: `<@!${id || 0}> ${message || errorMessage}`,
        });
    });
}

client.on.ready = function () {
    console.log("Mailing list online!");
    sendMailingList(`Welcome to the __${victimName}__ **Mailing list**!`);
};

client.on.message_create = function (message) {
    if (
        rateLimited === true && // Avoid Discord rate limits and spam by checking a custom rate limit
        message.author.id === victim && // Make sure the author is the victim
        message.content.length < messageCharacterLimit && // Avoid huge message spam
        banned.some((string) => message.content.includes(string)) === false && // Make sure it isn't something we don't want sent
        !!message.content // Make sure the content isn't empty or undefined
    ) {
        rateLimit(); // Avoid spamming
        sendMailingList(`Wakey wakey! ${victimName} said something! "${message.content}"`, message.channel_id);
    }
};
