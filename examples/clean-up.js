const Discord = require("discord-user-bots");
const client = new Discord.Client();

// Harmful words to delete
const config = {
    channel: "channel_id",
    harmful_words: ["Asshole", "Bitch", "Bugger", "Fuck", "Piss", "Shit", "Bloody", "Damn"],
};

// Util
async function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

client.on("ready", async () => {
    console.log("Client clean up is online!");

    let keywordCount = 1; // Keep track of the amount of words left to check for
    for (const keyword of config.harmful_words) {
        await sleep(2000); // Avoid rate limits
        console.log(
            `Deleting all messages with "${keyword}" (Keyword #${keywordCount} of #${config.harmful_words.length})`
        );
        keywordCount++;

        while (true) {
            // Make a custom-made fetch request to the message search API
            const info = await client.fetch_request(
                `channels/${config.channel}/messages/search?author_id=${client.info.user.id}&content=${keyword}`,
                {
                    method: "GET",
                    body: null,
                    parse: true,
                }
            );

            // Make sure to avoid being rate limited
            if (info.retry_after !== undefined) {
                console.log(
                    `Being rate limited for ${info.retry_after} seconds, waiting ${
                        info.retry_after * 3
                    } seconds`
                );
                await sleep(info.retry_after * 3000);
                continue;
            }

            // Filter messages to look for deletable real messages
            let messages = [];
            for (const message of info.messages) {
                if (message[0].type === 0) messages.push(message[0]);
            }

            // If no real messages are found, continue to the next keyword
            if (messages.length === 0) {
                console.log(`Finished with "${keyword}"`);
                break;
            }

            // Keep track of messages deleted from this request
            console.log(`Messages left: ${info.total_results}`);
            let deletedMessagesCount = 1;

            // Delete all messages from this request
            for (const message of messages) {
                await sleep(1000); // Avoid rate limits
                await client.delete_message(message.id, message.channel_id);
                console.log(
                    `Deleted message #${deletedMessagesCount} of #${messages.length} (${message.content}) (${message.id})`
                );
                deletedMessagesCount++;
            }
        }
    }

    // Finished with this channel, exit
    console.log("Finished");
    client.terminate();
});

client.login("Token goes here.");
