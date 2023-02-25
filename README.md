![Logo](https://raw.githubusercontent.com/Sopur/Discord-user-bots/main/logo.png)

# Sopur's user bot library

    Hello! This is a user bot library that allows for complete control over user accounts, and the ability to create accounts.
    Some examples of extreme examples are the ability to access user notes, friend counts, and the default Discord tutorial.
    This library is still being worked on more functions will be added soon.

# Installing

    npm i discord-user-bots

# Getting started

## Controlling an account

For comments: **https://github.com/Sopur/Discord-user-bots/blob/main/examples/basic.js**

```js
// For comments and more detail: https://github.com/Sopur/Discord-user-bots/blob/main/examples/basic.js
const Discord = require("discord-user-bots");
const client = new Discord.Client("Token goes here.");

client.on.ready = function () {
    console.log("Client online!");
};

client.on.message_create = function (message) {
    console.log(message);
};
```

## Creating an account

For comments: **https://github.com/Sopur/Discord-user-bots/blob/main/examples/create-account.js**

```js
// For comments and more detail: https://github.com/Sopur/Discord-user-bots/blob/main/examples/create-account.js
const Discord = require("discord-user-bots");
const Guru = require("captchaguru");
const factory = new Discord.AccountFactory();
const proxy = "xxx.xxx.xxx.xxx:xxx";
const proxyType = "HTTP";
const accountName = "discord-user-bots account!";

async function solveCaptcha(captchaInfo) {
    const solver = new Guru("captcha.guru API token goes here.", captchaInfo.service, captchaInfo.siteKey, captchaInfo.siteURL, proxy, proxyType);
    return solver.solve();
}

void (async function main() {
    const token = await factory.createAccount(accountName, `${proxyType.toLowerCase()}://${proxy}`, solveCaptcha);
    console.log("Created account: ", token);

    const client = new Discord.Client(token);
    client.on.ready = function () {
        console.log("Created account online!");
    };
})();
```

# Practical examples

## Mailing list

Pings other users when a victim of your choice sends a message. <br>
**https://github.com/Sopur/Discord-user-bots/blob/main/examples/mailinglist.js**

## Un-sendable channel

Deletes every message that is sent on channels of your choice while avoiding message delete rate limits. <br>
**https://github.com/Sopur/Discord-user-bots/blob/main/examples/unsendable-channel.js**

## Delete all incriminating messages

Deletes all incriminating messages in a channel automatically. <br>
**https://github.com/Sopur/Discord-user-bots/blob/main/examples/clean-up.js.js**

## GPT-3 chatbot

Uses OpenAI's GPT-3 model as a chat bot. <br>
**https://github.com/Sopur/Discord-user-bots/blob/main/examples/chat-bot.js**

# Documentation

## Discord.Client

### Functions

    This library contains most functions required to do anything a normal client can do. See the client.js file in the doc/ folder for documentation on every function.

**https://github.com/Sopur/Discord-user-bots/blob/main/doc/client.js**

### Event listeners

    This library has every known event listener. See the eventlisteners.js file in the doc/ folder for documentation on every event.

**https://github.com/Sopur/Discord-user-bots/blob/main/doc/eventlisteners.js**

### Properties

    This library focuses on allowing you to access absolutely everything a normal Discord client can. See the properties.js file in the doc/ folder for documentation on every event.

**https://github.com/Sopur/Discord-user-bots/blob/main/doc/properties.js**

## Discord.AccountFactory

### Functions

    This library contains code necessary for creating Discord accounts. See the factory.js file in the doc/ folder for documentation on function.

**https://github.com/Sopur/Discord-user-bots/blob/main/doc/factory.js**

# Contributing

See the README file in the source folder for instructions for contributing and what each file does.
**https://github.com/Sopur/Discord-user-bots/blob/main/src/README.md**

# What's new in 1.6.0

-   Added account creation (Discord.AccountFactory)
-   Added accept_friend_request function (Thanks lf94)
-   Added relationship_add event listener (Thanks lf94)
-   Added relationship_remove event listener (Thanks lf94)
-   Added proxy option to client class
-   Added reconnect event listener
-   Added reconnect function
-   Added autoReconnect option to config
-   Added examples create-account.js, clean-up.js, and chat-bot.js
-   Added science/experiment tracking logic
-   Added cookie logic
-   Added uuid logic
-   Added xtrack logic
-   Fixed disconnection problem (Thanks lf94)
-   Fixed guild_join function
-   Fixed examples
-   Fixed README

# Special Thanks To

## Github user Luthfi GearIntellix

-   Added attachments to the send function
-   Added the remove_reaction function

## Github user Imraj

-   Added close function
-   Added terminate function

## Github user lf94

-   Added accept_friend_request function
-   Fixed heartbeat bug

# WARN

WHATEVER HAPPENS TO YOUR ACCOUNT AS A RESULT OF THIS LIBRARY IS WITHIN YOUR OWN LIABILITY. THIS LIBRARY IS MADE PURELY FOR TESTS AND FUN. USE AT YOUR OWN RISK.
