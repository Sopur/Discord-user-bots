const Discord = require("discord-user-bots");
const client = new Discord.Client("Token goes here."); // Login with the token given

client.on.ready = function() { // Executes this function when the client is ready
    console.log("Client online!"); // Logs "Client online!"
};

client.on.message_create = function(message) { // Executes this function when the client receives a message
    console.log(message); // Logs the message
};
