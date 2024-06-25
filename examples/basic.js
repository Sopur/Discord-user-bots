const Discord = require("discord-user-bots");
const client = new Discord.Client(); // Create a new client instance

client.on("ready", () => {
    console.log("Client online!"); // Logs "Client online!" when connected to Discord
});
client.on("message", (message) => {
    console.log(message); // Logs the message data
});

client.login("token goes here."); // Login with the token given
