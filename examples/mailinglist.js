const Discord = require("discord-user-bots");
const client = new Discord.Client();

// Config
const config = {
    banned: ["`", "https", "@", "\n"], // Do not repeat these
    mailing_list: [""], // IDs of people to ping for the mailing list
    welcome_channel: "", // ID of the channel to welcome the people subscribed to the mailing list
    victim: "", // Victim ID
    victim_name: "Add their name!", // Name of the victim
    error_message: "message could not be gathered", // Message to send if there was an error
    message_character_limit: 100, // The character limit for a message made by the victim to avoid spam
};

let isRateLimited = true;
function rateLimit() {
    isRateLimited = false;
    setTimeout(() => {
        isRateLimited = true;
    }, 3000);
}

function sendMailingList(message, channel) {
    config.mailing_list.forEach((id) => {
        client.send(channel || config.welcome_channel, {
            content: `<@!${id || 0}> ${message || config.error_message}`,
        });
    });
}

client.on("ready", () => {
    console.log("Mailing list online!");
    sendMailingList(`Welcome to the __${config.victim_name}__ **Mailing list**!`);
});

client.on("message_create", (message) => {
    if (
        isRateLimited === true && // Avoid Discord rate limits and spam by checking a custom rate limit
        message.author.id === config.victim && // Make sure the author is the victim
        message.content.length < config.message_character_limit && // Avoid huge message spam
        config.banned.some((string) => message.content.includes(string)) === false && // Make sure it isn't something we don't want sent
        !!message.content // Make sure the content isn't empty or undefined
    ) {
        rateLimit(); // Avoid spamming
        sendMailingList(
            `Wakey wakey! ${config.victim_name} said something! "${message.content}"`,
            message.channel_id
        );
    }
});

client.login("Token goes here.");
