const Discord = require("../src/exports.js");
const client = new Discord.Client("Token goes here."); // Token to log into

// Config
const targetChannels = [""]; // Array of channel IDs to preform on
const waitAmount = 1000; // Ms to wait before trying to delete a message that failed to delete

function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

async function tryToDelete(message) {
    while (true) {
        const status = await client.delete_message(message.id, message.channel_id);
        if (status.status !== 204) {
            // Avoid rate limits by waiting and trying again later
            await sleep(waitAmount);
        } else {
            break;
        }
    }
}

client.on.ready = function () {
    console.log("Un-sendable channel online!");
};

client.on.message_create = function (message) {
    if (targetChannels.includes(message.channel_id)) tryToDelete(message);
};
