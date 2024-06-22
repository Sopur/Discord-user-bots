const Discord = require("../src/exports.js");
const interface = require("readline/promises").createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

async function test(thing) {
    await interface.question("[ENTER] ");
    console.log(`[TESTING] ${thing}`);
}

void (async function main() {
    await sleep(2000);
    const client = new Discord.Client();

    client.on("ready", async () => {
        console.log("Starting...");
        await client.create_server("Discord-user-bots Test");
    });

    client.on("guild_create", async (guild_object) => {
        const channel = guild_object.channels[2].id; // General
        const guild = guild_object.id;
        console.log(channel, guild);

        await test("send");
        const firstMessage = (
            await client.send(channel, {
                content: "Hello from discord-user-bots!",
                attachments: ["logo.png"],
            })
        ).id;

        console.log(firstMessage);

        await test("fetch_messages");
        console.log(await client.fetch_messages(10, channel));

        await test("get_guild");
        console.log(await client.get_guild(guild));

        await test("edit");
        await client.edit(firstMessage, channel, "Edited!");

        await test("Sending replying message");
        const secondMessage = (
            await client.send(channel, {
                content: "Reply!",
                reply: firstMessage,
            })
        ).id;

        await test("delete_message");
        await client.delete_message(firstMessage, channel);

        await test("type");
        await client.type(channel);

        await test("stop_type");
        client.stop_type(channel);

        await test("group");
        const group = (
            await client.group([client.info.user.id, "852605214636638260", "765239557666111509"])
        ).id;

        await test("rename_group");
        await client.rename_group("Discord User Bots!", group);

        await test("remove_person_from_group");
        await client.remove_person_from_group("852605214636638260", group);

        await test("leave_group");
        await client.leave_group(group);

        await test("create_thread_from_message");
        await client.create_thread_from_message(secondMessage, channel, "Thread from message!");

        await test("create_thread");
        const thread = (await client.create_thread(channel, "Thread!")).id;

        await test("delete_thread");
        await client.delete_thread(thread);

        await test("add_reaction");
        await client.add_reaction(secondMessage, channel, "🤖");

        await test("remove_reaction");
        await client.remove_reaction(secondMessage, channel, "🤖");

        await test("change_status");
        await client.change_status("idle");

        await test("set_custom_status");
        await client.set_custom_status({
            text: "A computer is like a submarine: You should never open Windows.",
            emoji: "🐧",
            expireAt: null,
        });

        await test("set_profile");
        await client.set_profile({
            bio: "DUB was here!",
            bannerColor: 44799,
        });

        await test("set_avatar");
        client.set_avatar("logo.png");

        await test("create_invite");
        const invite = (await client.create_invite(channel)).code;
        console.log(invite);

        await test("get_invite_info");
        console.log(await client.get_invite_info(invite));

        await test("parse_invite_link");
        const parse = Discord.Client.parse_invite_link;
        console.log(parse("https://discord.gg/WADasB31") === "WADasB31");
        console.log(parse("http://discord.gg/WADasB31") === "WADasB31");
        console.log(parse("https://discord.com/WADasB31/") === "WADasB31");
        console.log(parse("http://discord.gg/WADasB31/") === "WADasB31");
        console.log(parse("WADasB31") === "WADasB31");
        console.log(parse("WADasB31/") === "WADasB31");

        await test("delete_guild");
        await client.delete_guild(guild);

        console.log("Testing finished!");
        client.terminate();
        interface.close();
    });

    const token = await interface.question("Token: ");
    client.login(token);
})();
