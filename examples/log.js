const Discord = require("../src/exports.js");
const client = new Discord.Client("Discord token goes here.");

// Used to know how many minutes has passed
const startDate = Date.now();

client.on.ready = function () {
    console.log("Message logger online!");
};

client.on.message_create = function (message) {
    // Get the guild and channel it was sent in
    const guild = client.info.guilds.filter((guild) => guild.id == message.guild_id)[0];
    const channel = guild.channels.filter((channel) => channel.id == message.channel_id)[0];

    // Calculate the amount of minutes passed since this program started
    const minutesPassed = ((Date.now() - startDate) / 1000 / 60).toFixed(2);

    // Log everything
    console.log(`(${minutesPassed}m) [${guild.name}] [#${channel.name}] ${message.author.username}: ${message.content}`);
};
