# Sopur's user bot library

    Hello! This is a user bot library the allows
    for a lot more things than Discord.js.
    For example, this library allows you to access
    to everything a legit client does:
    like user notes, friend counts,
    the defualt Discord tutorial,
    and everything else.
    This library is in a early state
    and needs more work.
    More functions will be added soon.

# Getting started

Here's a small example of this library:

```js
const Discord = require("discord-user-bots");
const client = new Discord.Client("Token goes here.");

client.on.ready = function () {
    console.log("Client online!");
};

client.on.message_create = function (message) {
    console.log(message);
};
```

# Functions

```js
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
```

**Keep in mind that all of these functions return Promises when they are finished with all the information about the action you just made execpt for type, stopType, delete_message, and leave_guild.**

# Event listeners

```js

client.on.heartbeat_sent: function () { }, // Will be used when a heartbeat is sent from the client

client.on.heartbeat_received: function () { }, // Will be used when a heartbeat is received from the client

client.on.ready: function () { }, // Will be used when the client is ready and connected to the Discord WebSocket server

client.on.message_create: function (message) { }, // Will be used when a message is created

client.on.message_edit: function (message) { }, // Will be used when a message is edited

client.on.message_delete: function (message) { }, // Will be used when a message is deleted

client.on.message_delete_bulk: function (messages) { }, // Will be used when messages are deleted in bulk

client.on.embed_sent: function (embed) { }, // Will be used when a embed is sent

client.on.presence_update: function (user) { }, // Will be used when a users presence is updated

client.on.sessions_replace: function (sessions) { }, // Will be used when sessions are replaced

client.on.message_read: function (message) { }, // Will be used when you/the client read a message

client.on.channel_update: function (channel) { }, // Will be used when a channel is updated

client.on.guild_join: function (guild) { }, // Will be used when a guild is added to your user

client.on.guild_leave: function (guild) { }, // Will be used when a guild is removed from your user

```

# Properties

    My library focuses on allowing you to access
    absolutely everthing a normal Discord client can.
    This means tons and tons of properties defining your client.

**Here are some of them:**

```js
this.user_settings = user.user_settings; // An object full of properties of settings

this.user = user.user; // An object full of properties about the user like username etc

this.tutorial = user.tutorial; // A property

this.session_id = user.session_id; // String of random characters

this.notes = user.notes; // An object that contains all the notes the user has on other people

this.guild_join_requests = user.guild_join_requests; // An array

this.user_guild_settings = user.user_guild_settings; // An array of Objects

this.relationships = user.relationships; // An array of Objects

this.read_state = user.read_state; // An array of Objects

this.private_channels = user.private_channels; // An array of Objects

this.presences = user.presences; // An array of Objects

this.guilds = user.guilds; // An array of Objects

this.guild_experiments = user.guild_experiments; // An array containing arrays

this.geo_ordered_rtc_regions = user.geo_ordered_rtc_regions; // An array of strings

this.friend_suggestion_count = user.friend_suggestion_count; // An integer

this.experiments = user.experiments; // An array containing arrays

this.country_code = user.country_code; // A string

this.consents = user.consents; // An Object containing objects

this.connected_accounts = user.connected_accounts; // An array of Objects

this.analytics_token = user.analytics_token; // A string

this._trace = user._trace; // Stringified json
```

# Now here are those properties in a more readable form:

```js
this.user_settings = {
    timezone_offset: timezone - offset - goes - here, // (int)
    theme: "dark",
    stream_notifications_enabled: true,
    status: "invisible",
    show_current_game: true,
    restricted_guilds: [],
    render_reactions: true,
    render_embeds: true,
    native_phone_integration_enabled: true,
    message_display_compact: false,
    locale: "locale-goes-here",
    inline_embed_media: true,
    inline_attachment_media: true,
    guild_positions: [Array],
    guild_folders: [Array],
    gif_auto_play: true,
    friend_source_flags: [Object],
    explicit_content_filter: 2,
    enable_tts_command: true,
    disable_games_tab: false,
    developer_mode: true,
    detect_platform_accounts: true,
    default_guilds_restricted: false,
    custom_status: null,
    convert_emoticons: true,
    contact_sync_enabled: false,
    animate_stickers: 0,
    animate_emoji: true,
    allow_accessibility_detection: false,
    afk_timeout: 600,
};
this.user_guild_settings = [
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
];
this.user = {
    verified: true,
    username: "Sopur",
    premium: false,
    phone: null,
    nsfw_allowed: true,
    mobile: true,
    mfa_enabled: false,
    id: "id-goes-here",
    flags: 0,
    email: "email-goes-here",
    discriminator: "discriminator-goes-here",
    desktop: true,
    avatar: "avatar-goes-here",
};
this.tutorial = null;
this.session_id = "session_id-goes-here";
this.relationships = [
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
];
this.read_state = [
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
];
this.private_channels = [
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
];
this.presences = [[Object], [Object], [Object], [Object], [Object], [Object], [Object], [Object], [Object]];
this.notes = {
    "id-goes-here": "note-goes-here",
};
this.guilds = [
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
];
this.guild_join_requests = [];
this.guild_experiments = [
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
];
this.geo_ordered_rtc_regions = ["geo", "ordered", "rtc", "regions", "go", "here"];
this.friend_suggestion_count = 0;
this.experiments = [
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
    [Array],
];
this.country_code = "country-goes-here";
this.consents = { personalization: [Object] };
this.connected_accounts = [[Object]];
this.analytics_token = "token-goes-here";
this._trace = ["stringified-json"];
```

# What's new

    The soft-ban on self bots that disallows self bots to not see contents of messages has been evaded.
    You can now see message contents and bypass this soft-ban.
