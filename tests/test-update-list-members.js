const interface = require("readline/promises").createInterface({
    input: process.stdin,
    output: process.stdout,
});

void (async function main() {
    const Discord = require("../src/exports.js");
    const token = await interface.question("Token: ");
    const client = new Discord.Client(token);

    client.on("ready", async () => {
        console.log("Starting...");
        let chat_channel = undefined;
        for (let index = 0; index < client.info.guilds[0].channels.length; index++) {
            const channel = client.info.guilds[0].channels[index];
            if (channel.type == 0) {
                chat_channel = channel;
                break;
            }
        }
        console.log("send_update_list_members");
        client.send_update_list_members(client.info.guilds[0].id, chat_channel.id, 99);
    });
    client.on("guild_member_list_update", async (message) => {
        console.log(message);
        console.log("done");
        client.close();
    });
})();
