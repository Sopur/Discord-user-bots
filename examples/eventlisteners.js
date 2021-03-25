const Discord = require("discord-user-bots");
const client = new Discord.Client("Token goes here.");

client.on.heartbeat_sent = function () { }; // Will be used when a heartbeat is sent from the client

client.on.heartbeat_received = function () { }; // Will be used when a heartbeat is received from the client

client.on.ready = function () { }; // Will be used when the client is ready and connected to the Discord WebSocket server

client.on.message_create = function (message) { }; // Will be used when a message is created

client.on.message_edit = function (message) { }; // Will be used when a message is edited

client.on.message_delete = function (message) { }; // Will be used when a message is deleted

client.on.message_delete_bulk = function (messages) { }; // Will be used when messages are deleted in bulk

client.on.embed_sent = function (embed) { }; // Will be used when a embed is sent

client.on.presence_update = function (user) { }; // Will be used when a users presence is updated

client.on.sessions_replace = function (sessions) { }; // Will be used when sessions are replaced

client.on.message_read = function (message) { }; // Will be used when you/the client read a message

client.on.channel_update = function (channel) { }; // Will be used when a channel is updated

client.on.guild_join = function (guild) { }; // Will be used when a guild is added to your user

client.on.guild_leave = function (guild) { }; // Will be used when a guild is removed from your user
