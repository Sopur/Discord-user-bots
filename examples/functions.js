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


client.create_group(["person-id", "you can have up to 10", "(Including you)"]);
//                                       ^
//                  The people to be in the group when it's made


client.leave_group("785986028955500596");
//                          ^
//                The group ID to leave


//                        Person ID to be removed
//                                   v
client.remove_person_from_group("person-id", "785986028955500596");
//                                                     ^
//                                    Group ID to have someone removed from


//                         The name
//                            v
client.rename_group("Example group name", "785986028955500596");
//                                                  ^
//                                      The group ID to be renamed


//                      Name of the server
//                             v
client.create_server("Example server name", "2TffvPucqHkN");
//                                                ^
//                          The template of the server, it's set to the defualt
//                                   server template when not set by you
