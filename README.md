![Logo](https://raw.githubusercontent.com/Sopur/Discord-user-bots/main/logo.png)

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

Pings other users when a victim of your choice sends a message <br>
**https://github.com/Sopur/Discord-user-bots/blob/main/examples/mailinglist.js**

## Un-sendable channel

Deletes every message that is sent on channels of your choice while avoiding message delete rate limits <br>
**https://github.com/Sopur/Discord-user-bots/blob/main/examples/unsendable-channel.js**

# Contributing

See the README file in the source folder for instructions for contributing and what each file does.
**https://github.com/Sopur/Discord-user-bots/blob/main/src/README.md**

# Functions

```js
// Client constructor
const client = new Discord.Client(
    "token", // Bot token
    {
        // Bot config (Defaults shown)
        api: "v9", // API version
        wsurl: "wss://gateway.discord.gg/?encoding=json&v=9", // Discord WebSocket URL
        os: "linux", // Operating system
        bd: "holy", // BD
        language: "en-US", // Language
        typinginterval: 1000, // How often to send the typing request
    }
);

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
        attachments: [
            // Message attachments (optional, must be an array)
            "path/to/file", // Attachment item can be string (absolute path to the file)

            // Or can be an object for attachment detail
            {
                path: "path/to/file", // File location (Not optional, must be string)
                name: "custom-file-name.jpg", // File name (optional, must be string) (Default is base name of file)
                description: "File description", // Attachment description (optional, must be string) (Default is empty)
            },
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

// Joins a thread
client.join_thread(
    "888825512510779414" // The ID of the thread to join
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
    {
        // Invite options (Default seen here)
        validate: null, // Validate an already active invite
        max_age: 0, // Max age in seconds (0 means never ending)
        max_uses: 0, // Make uses (0 means no limit)
        target_user_id: null, // Target user ID
        target_type: null, // Target type
        temporary: false, // Kick the person invited once they log off if they don't have a role
    }
);

// Parses a discord invite link wether it be a https link or straight code
client.parse_invite_link(
    "https://discord.gg/WADasB31" // Invite to parse
);

// Sets the config with your wanted settings
// (Everything shown is the default config)
client.set_config({
    api: "v9", // API version
    wsurl: "wss://gateway.discord.gg/?encoding=json&v=9", // Discord WebSocket URL
    os: "linux", // Operating system
    bd: "holy", // BD
    language: "en-US", // Language
    typinginterval: 1000, // How often to send the typing request
});
```

# Event listeners

```js
class DiscordEvents {
    voice_server_update(message) {}
    user_update(message) {}
    application_command_create(message) {}
    application_command_update(message) {}
    application_command_delete(message) {}
    interaction_create(message) {}
    guild_create(message) {}
    guild_delete(message) {}
    guild_role_create(message) {}
    guild_role_update(message) {}
    guild_role_delete(message) {}
    thread_create(message) {}
    thread_join(message) {}
    thread_update(message) {}
    thread_delete(message) {}
    thread_list_sync(message) {}
    thread_member_update(message) {}
    thread_members_update(message) {}
    channel_create(message) {}
    channel_update(message) {}
    channel_delete(message) {}
    channel_pins_update(message) {}
    guild_member_add(message) {}
    guild_member_update(message) {}
    guild_member_remove(message) {}
    guild_ban_add(message) {}
    guild_ban_remove(message) {}
    guild_emojis_update(message) {}
    guild_stickers_update(message) {}
    guild_integrations_update(message) {}
    guild_webhooks_update(message) {}
    invite_create(message) {}
    invite_delete(message) {}
    voice_state_update(message) {}
    presence_update(message) {}
    message_create(message) {}
    message_update(message) {}
    message_delete(message) {}
    message_delete_bulk(message) {}
    message_reaction_add(message) {}
    message_reaction_remove(message) {}
    message_reaction_remove_all(message) {}
    message_reaction_remove_emoji(message) {}
    typing_start(message) {}

    // Custom made ones
    discord_disconnect() {}
    gateway() {}
    heartbeat_sent() {}
    heartbeat_received() {}
    ready() {}
    message_edit(message) {}
    recipient_add(message) {}
    recipient_remove(message) {}
    call(message) {}
    channel_name_change(message) {}
    channel_icon_change(message) {}
    channel_pinned_message(message) {}
    user_join(message) {}
    guild_boost(message) {}
    guild_boost_tier_1(message) {}
    guild_boost_tier_2(message) {}
    guild_boost_tier_3(message) {}
    channel_follow_add(message) {}
    guild_discovery_disqualified(message) {}
    guild_discovery_requalified(message) {}
    guild_discovery_grace_period_initial_warning(message) {}
    guild_discovery_grace_period_final_warning(message) {}
    reply(message) {}
    chat_input_command(message) {}
    thread_starter_message(message) {}
    guild_invite_reminder(message) {}
    context_menu_command(message) {}
    auto_moderation_action(message) {}
    role_subscription_purchase(message) {}
    interaction_premium_upsell(message) {}
    guild_application_premium_subscription(message) {}
}
```

# Properties

    My library focuses on allowing you to access
    absolutely everthing a normal Discord client can.
    This means tons and tons of properties defining your client.

**Here are some of them:**

```js
this.user.v = user.v; // number
this.user.users = user.users; // array
this.user.user_settings_proto = user.user_settings_proto; // array
this.user.user_settings = user.user_settings; // object
this.user.user_guild_settings = user.user_guild_settings; // object
this.user.user = user.user; // object
this.user.tutorial = user.tutorial; // object
this.user.sessions = user.sessions; // array
this.user.session_type = user.session_type; // array
this.user.session_id = user.session_id; // array
this.user.resume_gateway_url = user.resume_gateway_url; // array
this.user.relationships = user.relationships; // array
this.user.read_state = user.read_state; // object
this.user.private_channels = user.private_channels; // array
this.user.merged_members = user.merged_members; // array
this.user.guilds = user.guilds; // array
this.user.guild_join_requests = user.guild_join_requests; // array
this.user.guild_experiments = user.guild_experiments; // array
this.user.geo_ordered_rtc_regions = user.geo_ordered_rtc_regions; // array
this.user.friend_suggestion_count = user.friend_suggestion_count; // number
this.user.experiments = user.experiments; // array
this.user.country_code = user.country_code; // array
this.user.consents = user.consents; // object
this.user.connected_accounts = user.connected_accounts; // array
this.user.auth_session_id_hash = user.auth_session_id_hash; // array
this.user.api_code_version = user.api_code_version; // number
this.user.analytics_token = user.analytics_token; // array
this.user._trace = user._trace; // array
this.user.supplemental = user.supplemental; // object
```

# What's new

    -   Added 27 new events because Discord is very misleading
    -   Added join_thread function
    -   Added client supplemental information

# Special Thanks To

## Github user Luthfi GearIntellix

-   Added attachments to the send function
-   Added the remove_reaction function

## Github user Imraj

-   Added close function
-   Added terminate function

# WARN

WHATEVER HAPPENS TO YOUR ACCOUNT AS A RESULT OF THIS LIBRARY IS WITHIN YOUR OWN LIABILITY. THIS LIBRARY IS MADE PURELY FOR TESTS AND FUN. USE AT YOUR OWN RISK.
