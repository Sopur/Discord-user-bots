const Discord = require("discord-user-bots");
const client = new Discord.Client("Token goes here.");


//                            The channel ID
//                                  v
client.fetchmessages(100, "794326789480120374");
//                    ^
//     The amount of messages you want


//                                The channel ID
//                                      v
client.send("Example message", "794326789480120374");
//                  ^
//      The message you want to send


//                               Target message ID       The channel ID
//                                       v                      v
client.reply("Example message", "794339629553156116", "794326789480120374");
//                  ^
//      The message you want to send


//             The channel ID
//                    v
client.type("794326789480120374");
cleint.stopType();