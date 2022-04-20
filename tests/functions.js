async function sleep() {
    return new Promise(async (res) => setTimeout(res, 2000));
}

async function test(thing) {
    await sleep();
    console.log(`[WARN] ==> TESTING: ${thing}`);
}

void (async function main() {
    const Discord = require("../src/exports.js");
    const token = await require("readline/promises").createInterface({ input: process.stdin, output: process.stdout }).question("Token: ");
    const client = new Discord.Client(token);

    client.on.ready = async function () {
        console.log("Starting...");
        await client.create_server("Discord-user-bots Test");
    };

    client.on.guild_create = async function (guild_object) {
        const channel = guild_object.channels[1].id; // General
        const guild = guild_object.id;
        console.log(channel, guild);

        await test("send");
        const firstMessage = (
            await client.send(channel, {
                content: "Hello from discord-user-bots!",
            })
        ).id;

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
        client.stop_type();
        await sleep();

        await test("group");
        const group = (await client.group([client.user.id, "869140419613708289"])).id;

        await test("rename_group");
        await client.rename_group("Renamed", group);

        await test("remove_person_from_group");
        await client.remove_person_from_group("869140419613708289", group);

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

        await test("change_status");
        await client.change_status("idle");

        await test("set_custom_status");
        await client.set_custom_status({
            text: "A computer is like a submarine: You should never open Windows.",
            emoji: "🐧",
            expireAt: null,
        });

        await test("create_invite");
        console.log((await client.create_invite(channel)).code);

        await test("parse_invite_link");
        console.log(client.parse_invite_link("https://discord.gg/WADasB31") === "WADasB31");
        console.log(client.parse_invite_link("http://discord.gg/WADasB31") === "WADasB31");
        console.log(client.parse_invite_link("https://discord.gg/WADasB31/") === "WADasB31");
        console.log(client.parse_invite_link("http://discord.gg/WADasB31/") === "WADasB31");
        console.log(client.parse_invite_link("WADasB31") === "WADasB31");
        console.log(client.parse_invite_link("WADasB31/") === "WADasB31");

        await test("leave_guild");
        await client.delete_guild(guild);
        console.log("Done.");
        process.exit();
    };
})();
