const Discord = require("../src/exports.js");
const client = new Discord.Client({
    headless: true, // Set the "headless" option to true
    proxy: "http://xxx.xxx.xxx.xxx:xxxx", // Optional, but useful
});
client.login("Token goes here."); // Doesn't actually send a login request to Discord, just fills in configuration

// In order for this to work, there has to be an instance of this account being logged in somewhere else with the same IP/Proxy
client.send("914533507890565221", {
    content: "This message was sent without logging in",
});
