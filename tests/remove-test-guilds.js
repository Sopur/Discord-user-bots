const Discord = require("../src/exports.js");
const interface = require("readline/promises").createInterface({
    input: process.stdin,
    output: process.stdout,
});

const DUBName = "Discord-user-bots Test";

async function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

void (async function main() {
    await sleep(2000);
    const client = new Discord.Client();

    client.on("ready", async () => {
        console.log(`Deleting all guilds with the name ${DUBName}...`);

        let numGuilds = 0;
        for (const guild of client.info.guilds) {
            if (guild.properties.name == DUBName) {
                numGuilds++;
                console.log(`Deleting: ${guild.properties.id}`);
                await client.delete_guild(guild.properties.id);
                await sleep(3000);
            }
        }
        console.log(`Deleted ${numGuilds} guilds!`);
        client.terminate();
        interface.close();
    });

    const token = await interface.question("Token: ");
    client.login(token);
})();
