const Discord = require("discord-user-bots");
const client = new Discord.Client(); // Token to log into

// Config
const config = {
    target_channels: [""], // Array of channel IDs to preform on
    wait_amount: 1000, // MS to wait before trying to delete a message that failed to delete
};

function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

async function tryToDelete(message) {
    while (true) {
        const status = await client.delete_message(message.id, message.channel_id);
        if (status.status !== 204) {
            // Avoid rate limits by waiting and trying again later
            await sleep(config.wait_amount);
        } else {
            break;
        }
    }
}

client.on("ready", () => {
    console.log("Un-sendable channel online!");
});

client.on("message", (message) => {
    if (config.target_channels.includes(message.channel_id)) tryToDelete(message);
});

client.login("Token goes here.");
