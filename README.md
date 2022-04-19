# Sopur's user bot library

    Hello! This is a user bot library that allows
    for a lot more things than Discord.js.
    For example, this library allows you to access
    to everything a legit client does:
    like user notes, friend counts,
    the default Discord tutorial,
    and everything else.
    This library is in an early state
    and needs more work.
    More functions will be added soon.

# Installing

    npm i discord-user-bots

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

# Practical examples

## Mailing list

Pings other users when a victim on your choice sends a message <br>
**https://github.com/Sopur/Discord-user-bots/blob/main/examples/mailinglist.js**

## Un-sendable channel

Deletes every message that is sent on channels of your choice while avoiding message delete rate limits <br>
**https://github.com/Sopur/Discord-user-bots/blob/main/examples/unsendable-channel.js**

# Functions

```js
// Fetches messages from Discord
client.fetch_messages(
    100, // Amount of messages to get (Limit is 100)
    "794326789480120374", // Channel ID to fetch from
    "914533507890565221" // An offset when getting messages (Optional)
);

// Fetches all the info about the guild given
client.get_guild(
    "794326789480120374" // The guild ID to fetch
);

// (deprecated)
// WARN: May disable your account
// Joins the guild the invite code is pointing to
client.join_guild(
    "https://discord.gg/WADasB31" // The Discord invite
);

// Gets info about an invite link
client.get_invite_info(
    "https://discord.gg/WADasB31" // The Discord invite
);

// Leaves a server
client.leave_guild(
    "794326789480120374" // The guild ID to leave from
);

// Deletes a guild if you're owner
client.delete_guild(
    "794326789480120374" // The guild to delete
);

// Sends a message
client.send(
    "794326789480120374", // Channel to send in
    {
        content: "Hello Discord-user-bots!", // Content of the message to send (Optional when sending stickers) (Default null)
        reply: "914533507890565221", // Reply to the message ID given with this message (Optional) (Default null)
        tts: false, // Use text to speech when sending (Only works if you have the permissions to do so) (Optional) (Default false)
        embeds: [], // Embeds to send with your message (Not optional, must be an array, can be unset for default) (Default empty array)
        allowed_mentions: {
            // Allow mentions settings (Not optional, but can be unset for default) (Default all true mentions object)
            allowUsers: true, // Allow message to ping user (Default true)
            allowRoles: true, // Allow message to ping roles (Default true)
            allowEveryone: true, // Allow message to ping @everyone and @here (Default true)
            allowRepliedUser: true, // If the message is a reply, ping the user you are replying to (Default true)
        },
        components: [], // Message components (Not optional, must be an array, can be unset for default) (Default empty array)
        stickers: [], // Stickers to go with your message (Not optional, must be an array, can be unset for default) (Default empty array)
        attachments: [ // Message attachments (optional, must be an array)
            "path/to/file", // Attachment item can be string (file location)

            // Or can be an object for attachment detail
            {
                path: "path/to/file", // File location (Not optional, must be string)
                name: "custom-file-name.jpg", // File name (optional, must be string) (Default is base name of file)
                description: "File description" // Attachment description (optional, must be string) (Default is empty)
            }
        ],
    }
);

// Edits a message
client.edit(
    "794339629553156116", // Message to edit
    "794329000897806387", // Channel the message is in
    "Edited!" // The content to change to
);

// Deletes a message
client.delete_message(
    "794339629553156116", // The message to delete
    "794329000897806387" // The channel the message is in
);

// Types in the channel given
client.type(
    "794326789480120374" // The channel ID to type in
);

// Stops typing
client.stop_type();

// Creates or retrieves existing channel with given recipients
client.group(
    //  The IDs fo the people to be in the group when it's made
    ["person-id", "you can have up to 10", "(Including you)"]
);

// Leaves a group
client.leave_group(
    "785986028955500596" // The group ID to leave
);

// Removes someone from a group
client.remove_person_from_group(
    "person-id", // Person ID to be removed
    "785986028955500596" // Group ID to have someone removed from
);

// Renames a group
client.rename_group(
    "Discord-user-bot's group", // The name
    "785986028955500596" // The group ID to be renamed
);

// Creates a server
client.create_server(
    "Discord-user-bot's server", // Name of the server
    "2TffvPucqHkN" // The template of the server (Optional) (Default "2TffvPucqHkN")
);

// Creates a thread off of a message
client.create_thread_from_message(
    "811442648677875722", // The target message ID
    "753267478943105024", // The target channel ID
    "Discord-user-bot's thread from a message", // The name of the thread
    1440 // How long util the thread auto archives (Optional) (Default 1440)
);

// Creates a thread in a channel
client.create_thread(
    "888825512510779414", // Channel to create the thread in
    "Discord-user-bot's thread from a channel", // The name of the thread
    1440 // How long util the thread auto archives (Optional) (Default 1440)
);

// Deletes a thread
client.delete_thread(
    "888825512510779414" // The ID of the thread to delete
);

// Adds a reaction to a message
client.add_reaction(
    "914533528245506068", // The message to add a reaction to
    "753267478943105028", // The channel the message is in
    "🤖" // Emoji to react with (Cannot be ":robot:" has to be an actual emoji like "🤖")
);

// Remove a reaction to a message
client.remove_reaction(
    "914533528245506068", // The message to remove a reaction to
    "753267478943105028", // The channel the message is in
    "🤖" // Emoji to react with (Cannot be ":robot:" has to be an actual emoji like "🤖")
);

// Changes your visibility
client.change_status(
    "online" // Status to change to (Must be "online", "idle", "dnd", or "invisible")
);

// Sets a custom status
client.set_custom_status({
    text: "This status was set by Discord-user-bots!", // Status text (Optional) (Default null)
    emoji: "🤖", // Status emoji (Optional) (Default null)
    expireAt: "2021-12-13T05:57:58.828Z", // The time until resets (Optional) (Default null, meaning never resetting)
});

client.create_invite(
    "753267478943105028", // Channel you want to make the invite on
    createInviteOpts: {
        // Invite options (Default seen here)
        validate: null, // Validate an already active invite
        max_age: 0, // Max age in seconds (0 means never ending)
        max_uses: 0, // Make uses (0 means no limit)
        target_user_id: null, // Target user ID
        target_type: null, // Target type
        temporary: false, // Kick the person invited once they log off if they don't have a role
    },
);

// Parses a discord invite link wether it be a https link or straight code
client.parse_invite_link(
    "https://discord.gg/WADasB31" // Invite to parse
);

// Sets the config with your wanted settings
// (See the pre-defined config for the defaults)
client.set_config(
    "v9", // Discord API version
    "wss://gateway.discord.gg/?encoding=json&v=9", // WebSocket URL
    "linux", // Operating system
    "holy", // bd
    "en-US", // Language
    1000 // Typing Interval
);
```

# Event listeners

```js
client.on = {
    discord_disconnect: function () {},
    gateway: function () {},
    heartbeat_sent: function () {},
    heartbeat_received: function () {},
    ready: function () {},
    voice_server_update: function (message) {},
    user_update: function (message) {},
    application_command_create: function (message) {},
    application_command_update: function (message) {},
    application_command_delete: function (message) {},
    interaction_create: function (message) {},
    guild_create: function (message) {},
    guild_delete: function (message) {},
    guild_role_create: function (message) {},
    guild_role_update: function (message) {},
    guild_role_delete: function (message) {},
    thread_create: function (message) {},
    thread_update: function (message) {},
    thread_delete: function (message) {},
    thread_list_sync: function (message) {},
    thread_member_update: function (message) {},
    thread_members_update: function (message) {},
    channel_create: function (message) {},
    channel_update: function (message) {},
    channel_delete: function (message) {},
    channel_pins_update: function (message) {},
    guild_member_add: function (message) {},
    guild_member_update: function (message) {},
    guild_member_remove: function (message) {},
    guild_ban_add: function (message) {},
    guild_ban_remove: function (message) {},
    guild_emojis_update: function (message) {},
    guild_stickers_update: function (message) {},
    guild_integrations_update: function (message) {},
    guild_webhooks_update: function (message) {},
    invite_create: function (message) {},
    invite_delete: function (message) {},
    voice_state_update: function (message) {},
    presence_update: function (message) {},
    message_create: function (message) {},
    message_update: function (message) {},
    message_delete: function (message) {},
    message_delete_bulk: function (message) {},
    message_reaction_add: function (message) {},
    message_reaction_remove: function (message) {},
    message_reaction_remove_all: function (message) {},
    message_reaction_remove_emoji: function (message) {},
    typing_start: function (message) {},

    // Custom made ones
    embed_sent: function (message) {},
    message_edit: function (message) {},
};
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
this.user_guild_settings = [[Object]];
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
this.relationships = [[Object]];
this.read_state = [[Object]];
this.private_channels = [[Object]];
this.presences = [[Object]];
this.notes = {
    "id-goes-here": "note-goes-here",
};
this.guilds = [[Object]];
this.guild_join_requests = [];
this.guild_experiments = [[Array]];
this.geo_ordered_rtc_regions = ["geo", "ordered", "rtc", "regions", "go", "here"];
this.friend_suggestion_count = 0;
this.experiments = [[Array]];
this.country_code = "country-goes-here";
this.consents = { personalization: [Object] };
this.connected_accounts = [[Object]];
this.analytics_token = "token-goes-here";
this._trace = ["stringified-json"];
```

# What's new

    - Practical examples in the /examples folder
    - Switched over to the native fetch API with node-fetch as a fallback
    - Added create_invite function

# WARN

WHATEVER HAPPENS TO YOUR ACCOUNT AS A RESULT OF THIS LIBRARY IS WITHIN YOUR OWN LIABILITY. THIS LIBRARY IS MADE PURELY FOR TESTS AND FUN. USE AT YOUR OWN RISK.
