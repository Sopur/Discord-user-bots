const Discord = require("discord-user-bots");
const client = new Discord.Client("Token goes here.");



//                            The channel ID
//                                  v
client.fetchmessages(100, "794326789480120374");
//                    ^
//     The amount of messages you want


//                 The guild ID
//                       v
client.getguild("794326789480120374");


//               The server invite
//                      v
client.join_guild("invite-code", false);
//                                 ^
// Make this second parameter true if you want to use a http link, it's false by defualt


//                    The guild ID
//                          v
client.leave_guild("794326789480120374");


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


//                                              The channel ID
//                                                    v
client.delete_message("794339629553156116", "794329000897806387");
//                           ^
//                    Target message ID


//             The channel ID
//                    v
client.type("794326789480120374");
cleint.stopType();
