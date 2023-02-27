const Discord = require("./src/exports.js");
const OpenAI = require("openai-api"); // `npm i openai-api` to install
const openai = new OpenAI("OpenAI token goes here.");
const client = new Discord.Client("Discord token goes here.");

// Config
const channelID = "channel_id"; // Channel to chat in
const limit = 20; // Message memory limit
const headerText = "Below is a conversation between an AI chatbot and multiple online users.\n"; // Header that describes the conversation to GPT-3
const engine = "davinci"; // Engine to use
const maxTokens = 20; // Max tokens GPT-3 will use to respond with

// Memory of messages
let narrative = "";

client.on.ready = async function () {
    console.log(`${engine} chatbot is online!`);
};

client.on.message_create = async function (message) {
    if (message.channel_id != channelID) return;

    if (message.author.id == client.info.user.id) {
        // If the message is by the bot, add it to the narrative
        narrative += `AI: ${message.content}\n`;
    } else {
        // If the message is by a user, add it to the narrative and provoke a response
        narrative += `${message.author.username}: ${message.content}\n`;
        const gptResponse = await openai.complete({
            engine: engine,
            prompt: headerText + narrative + "AI: ",
            maxTokens: maxTokens,
            temperature: 0.9,
            topP: 1,
            presencePenalty: 0,
            frequencyPenalty: 0,
            bestOf: 1,
            n: 1,
            stream: false,
            stop: ["\n"],
        });

        // Send response
        client.send(channelID, { content: gptResponse.data.choices[0].text });
    }
    // Take a look at the narrative!
    console.log(narrative);

    // Make sure that there isn't more messages than the limit
    if (narrative.split("\n").length > limit) {
        let newNarrative = narrative.split("\n");
        console.log(`reducing, removing ${newNarrative.shift()}`);
        narrative = newNarrative.join("\n");
    }
};
