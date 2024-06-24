const Discord = require("discord-user-bots");
const OpenAI = require("openai"); // `npm i openai` to install
const client = new Discord.Client();
const openai = new OpenAI({
    apiKey: "OpenAI token goes here.",
});

// Config
const config = {
    channel: "channel_id", // Channel to chat in
    memory_limit: 20, // ChatGPT's message memory limit
    model: "gpt-3.5-turbo", // Engine to use
    max_tokens: 200, // Max tokens ChatGPT will use to respond with
    system_text: "You are a chat-bot on the social media platform Discord.",
};

// Memory of messages
let memory = [];

client.on("ready", () => {
    console.log(`${engine} chatbot is online!`);
});

client.on.message_create = async function (message) {
    if (message.channel_id != channelID) return;

    if (message.author.id == client.info.user.id) {
        // If the message is by the bot, add it to memory
        memory.push({
            role: "assistant",
            content: `@Chat bot: ${message.content}`,
        });
    } else {
        // If the message is by a user, add it to memory and provoke a response
        if (memory.length == config.memory_limit) memory.shift();
        memory.push({
            role: "user",
            content: `@${message.author.username}: ${message.content}`,
        });

        const gptResponse = await openai.chat.completions.create({
            model: config.model,
            messages: [
                {
                    role: "system",
                    content: config.system_text,
                },
                ...memory,
            ],
            temperature: 0.7,
            max_tokens: config.max_tokens,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        // Send response
        client.send(config.channel, { content: gptResponse.data.choices[0].text });
    }
};

client.login("Token goes here.");
