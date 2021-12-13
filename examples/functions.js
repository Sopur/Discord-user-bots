const Discord = require("discord-user-bots");
const client = new Discord.Client("Token goes here.");

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
