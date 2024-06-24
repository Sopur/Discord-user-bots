# Discord User Bots

![Logo](https://raw.githubusercontent.com/Sopur/Discord-user-bots/main/logo.png)

<a href="https://github.com/Sopur/Discord-user-bots/blob/main/LICENSE">
    <img alt="GitHub license" src="https://img.shields.io/github/license/Sopur/Discord-user-bots">
</a>
<a href="https://github.com/Sopur/Discord-user-bots/stargazers">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/Sopur/Discord-user-bots">
</a>
<a href="https://discord.gg/57XkDazjFP">
    <img alt="Discord" src="https://img.shields.io/discord/1252707954356912354?label=Discord%20Chat">
</a>
<a href="https://github.com/Sopur/Discord-user-bots/issues">
    <img alt="Open issues" src="https://shields.io/github/issues/Sopur/Discord-user-bots">
</a>

| Useful links
|-
| [DUB Discord Server](https://discord.gg/57XkDazjFP)
| [DUB NPM Package](https://www.npmjs.com/package/discord-user-bots)
| [DUB Client Documentation](https://github.com/Sopur/Discord-user-bots/blob/main/doc/client.js)
| [DUB Examples](https://github.com/Sopur/Discord-user-bots/tree/main/examples)

# Installing

```sh
npm i discord-user-bots
```

# What is this library?

### Discord-User-Bots is a library that allows for complete access & control over user accounts

This library supports account features that are exclusive to user accounts or hidden by the Discord documentation. Data-mining Discord was used to find the vulnerabilities and hidden endpoints that allow this library to function.

# What can this do?

### Some use-cases for this library are:

-   Creating accounts (EXPERIMENTAL)
-   Sending unrestricted friend requests to other users
-   Joining guilds without triggering Discord's trust system
-   Email and phone verifying accounts
-   Accessing user notes, friend counts, interacting with the default Discord tutorial, and every other property associated with a Discord account
-   Remotely controlling accounts without authenticating with Discord for distributed account control
-   Common functions real accounts use
-   And many more...

# Getting started

## Controlling an account

> For comments: **https://github.com/Sopur/Discord-user-bots/blob/main/examples/basic.js**

```js
// For comments and more detail: https://github.com/Sopur/Discord-user-bots/blob/main/examples/basic.js
const Discord = require("discord-user-bots");
const client = new Discord.Client();

client.on("ready", () => {
    console.log("Client online!");
});
client.on("message", (message) => {
    console.log(message);
});

client.login("token goes here.");
```

## Controlling an account without logging in

> For comments: **https://github.com/Sopur/Discord-user-bots/blob/main/examples/basic-headless.js** > _WARNING: if there isn't another live instance of the account running while you make a request with a headless client, the account with be disabled and flagged._

```js
// For comments and more detail: https://github.com/Sopur/Discord-user-bots/blob/main/examples/basic-headless.js
const Discord = require("discord-user-bots");
const client = new Discord.Client({
    headless: true,
    proxy: "http://xxx.xxx.xxx.xxx:xxxx",
});
client.login("Token goes here."); // ONLY sets the token (doesn't follow the full login process)

client.send("1234567890", {
    content: "This message was sent without logging in",
});
```

# Practical examples

> See all examples: https://github.com/Sopur/Discord-user-bots/tree/main/examples

## Message logger

Logs all messages sent in all the servers the client is in. <br>
**https://github.com/Sopur/Discord-user-bots/blob/main/examples/log.js**

## Create an account (EXPERIMENTAL)

Creates an account using the captcha.guru captcha solver. <br>
**https://github.com/Sopur/Discord-user-bots/blob/main/examples/chat-bot.js**

## Un-sendable channel

Deletes every message that is sent on channels of your choice while avoiding message delete rate limits. <br>
**https://github.com/Sopur/Discord-user-bots/blob/main/examples/unsendable-channel.js**

## ChatGPT chat-bot

Uses OpenAI's ChatGPT as a chat bot. <br>
**https://github.com/Sopur/Discord-user-bots/blob/main/examples/chat-bot.js**

# Documentation

## Discord.Client

### Methods

> **https://github.com/Sopur/Discord-user-bots/blob/main/doc/client.js**

This library contains most functions required to do anything a normal client can do. See the `client.js` file in the `doc/` folder for documentation on every `Discord.Client` method.

### Event listeners

> **https://github.com/Sopur/Discord-user-bots/blob/main/doc/eventlisteners.js**

This library has every known event listener. See the `eventlisteners.js` file in the `doc/` folder to see every one.

# What's new in 2.0.0

## General

1. Added the ability to create accounts
1. Pretty much made DUB undetectable and 100% anonymous
1. Added headless clients (accounts that don't login or interact with Discord's gateway)
1. Added enum properties for every Discord enum
1. No methods restrict your account anymore
1. Added support for EVERY event (even undocumented ones)
1. Added more methods to the testing script

## Methods

1. `.login` just like Discord.js
1. `.is_restricted`
1. Fixed `.join_guild`
1. `.send_single_type_notification`
1. Fixed `.type` to support multiple channels
1. `send_friend_request`
1. `.set_profile`
1. `.set_avatar`
1. `.request_verify_email` & `.verify_email`
1. `.request_verify_phone` & `.verify_phone`

# Want something?

> Contact me on Discord at `.sopur` or Telegram at `@soopur`

You may also find something of interest on the [DUB Discord Server](https://discord.gg/57XkDazjFP).

# DISCLAIMER

WHATEVER HAPPENS TO YOUR ACCOUNT AS A RESULT OF THIS LIBRARY IS WITHIN YOUR OWN LIABILITY. THIS LIBRARY IS MADE PURELY FOR EXPERIMENTAL AND ENTERTAINMENT PURPOSES. USE AT YOUR OWN RISK.
