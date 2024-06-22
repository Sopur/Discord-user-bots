/**
 *
 *  ## OVERVIEW
 *
 *  Defines all Discord enums.
 *  Some included are documented, some undocumented.
 *
 *  ## WHEN CONTRIBUTING:
 *
 *  Include both `property: num` and `num: "property"` when adding an enum value.
 *  It is written like this for easy logging & debugging.
 *
 */

module.exports = {
    // Gateway
    GatewayOpcodes: {
        Dispatch: 0, // Receive - An event was dispatched.
        Heartbeat: 1, // Send/Receive - Fired periodically by the client to keep the connection alive.
        Identify: 2, // Send - Starts a new session during the initial handshake.
        Presence_Update: 3, // Send - Update the client's presence.
        Voice_State_Update: 4, // Send - Used to join/leave or move between voice channels.
        Resume: 6, // Send - Resume a previous session that was disconnected.
        Reconnect: 7, // Receive - You should attempt to reconnect and resume immediately.
        Request_Guild_Members: 8, // Send - Request information about offline guild members in a large guild.
        Invalid_Session: 9, // Receive - The session has been invalidated. You should reconnect and identify/resume accordingly.
        Hello: 10, // Receive - Sent immediately after connecting, contains the heartbeat_interval to use.
        Heartbeat_ACK: 11, // Receive - Sent in response to receiving a heartbeat to acknowledge that it has been received.
        DM_Focus: 13, // Send - Sent when you click on a group chat or DM in the Discord client
        UNKNOWN_14: 14, // Send - Sent when you click on a channel in a guild
        UNKNOWN_36: 36, // Send - Sent when you click on a guild in the Discord client
        0: "Dispatch",
        1: "Heartbeat",
        2: "Identify",
        3: "Presence_Update",
        4: "Voice_State_Update",
        6: "Resume",
        7: "Reconnect",
        8: "Request_Guild_Members",
        9: "Invalid_Session",
        10: "Hello",
        11: "Heartbeat_ACK",
        13: "DM_Focus",
        14: "UNKNOWN_14",
        36: "UNKNOWN_36",
    },

    // Guild
    DefaultMessageNotificationLevel: {
        ALL_MESSAGES: 0, // members will receive notifications for all messages by default
        ONLY_MENTIONS: 1, // members will receive notifications only for messages that @mention them by default
        0: "ALL_MESSAGES",
        1: "ONLY_MENTIONS",
    },
    ExplicitContentFilterLevel: {
        DISABLED: 0, // media content will not be scanned
        MEMBERS_WITHOUT_ROLES: 1, // media content sent by members without roles will be scanned
        ALL_MEMBERS: 2, // media content sent by all members will be scanned
        0: "DISABLED",
        1: "MEMBERS_WITHOUT_ROLES",
        2: "ALL_MEMBERS",
    },
    MFALevel: {
        NONE: 0, // guild has no MFA/2FA requirement for moderation actions
        ELEVATED: 1, // guild has a 2FA requirement for moderation actions
        0: "NONE",
        1: "ELEVATED",
    },
    VerificationLevel: {
        NONE: 0, // unrestricted
        LOW: 1, // must have verified email on account
        MEDIUM: 2, // must be registered on Discord for longer than 5 minutes
        HIGH: 3, // must be a member of the server for longer than 10 minutes
        VERY_HIGH: 4, // must have a verified phone number
        0: "NONE",
        1: "LOW",
        2: "MEDIUM",
        3: "HIGH",
        4: "VERY_HIGH",
    },
    GuildNSFWLevel: {
        DEFAULT: 0,
        EXPLICIT: 1,
        SAFE: 2,
        AGE_RESTRICTED: 3,
        0: "DEFAULT",
        1: "EXPLICIT",
        2: "SAFE",
        3: "AGE_RESTRICTED",
    },
    PremiumTier: {
        NONE: 0, // guild has not unlocked any Server Boost perks
        TIER_1: 1, // guild has unlocked Server Boost level 1 perks
        TIER_2: 2, // guild has unlocked Server Boost level 2 perks
        TIER_3: 3, // guild has unlocked Server Boost level 3 perks
        0: "NONE",
        1: "TIER_1",
        2: "TIER_2",
        3: "TIER_3",
    },
    SystemChannelFlags: {
        SUPPRESS_JOIN_NOTIFICATIONS: 1 << 0, // Suppress member join notifications
        SUPPRESS_PREMIUM_SUBSCRIPTIONS: 1 << 1, // Suppress server boost notifications
        SUPPRESS_GUILD_REMINDER_NOTIFICATIONS: 1 << 2, // Suppress server setup tips
        SUPPRESS_JOIN_NOTIFICATION_REPLIES: 1 << 3, // Hide member join sticker reply buttons
        SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATIONS: 1 << 4, // Suppress role subscription purchase and renewal notifications
        SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATION_REPLIES: 1 << 5, // Hide role subscription sticker reply buttons
        [1 << 0]: "SUPPRESS_JOIN_NOTIFICATIONS",
        [1 << 1]: "SUPPRESS_PREMIUM_SUBSCRIPTIONS",
        [1 << 2]: "SUPPRESS_GUILD_REMINDER_NOTIFICATIONS",
        [1 << 3]: "SUPPRESS_JOIN_NOTIFICATION_REPLIES",
        [1 << 4]: "SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATIONS",
        [1 << 5]: "SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATION_REPLIES",
    },
    GuildFeatures: [
        "ANIMATED_BANNER", // guild has access to set an animated guild banner image
        "ANIMATED_ICON", // guild has access to set an animated guild icon
        "APPLICATION_COMMAND_PERMISSIONS_V2", // guild is using the old permissions configuration behavior
        "AUTO_MODERATION", // guild has set up auto moderation rules
        "BANNER", // guild has access to set a guild banner image
        "COMMUNITY", // guild can enable welcome screen, Membership Screening, stage channels and discovery, and receives community updates
        "CREATOR_MONETIZABLE_PROVISIONAL", // guild has enabled monetization
        "CREATOR_STORE_PAGE", // guild has enabled the role subscription promo page
        "DEVELOPER_SUPPORT_SERVER", // guild has been set as a support server on the App Directory
        "DISCOVERABLE", // guild is able to be discovered in the directory
        "FEATURABLE", // guild is able to be featured in the directory
        "INVITES_DISABLED", // guild has paused invites, preventing new users from joining
        "INVITE_SPLASH", // guild has access to set an invite splash background
        "MEMBER_VERIFICATION_GATE_ENABLED", // guild has enabled Membership Screening
        "MORE_STICKERS", // guild has increased custom sticker slots
        "NEWS", // guild has access to create announcement channels
        "PARTNERED", // guild is partnered
        "PREVIEW_ENABLED", // guild can be previewed before joining via Membership Screening or the directory
        "RAID_ALERTS_DISABLED", // guild has disabled alerts for join raids in the configured safety alerts channel
        "ROLE_ICONS", // guild is able to set role icons
        "ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE", // guild has role subscriptions that can be purchased
        "ROLE_SUBSCRIPTIONS_ENABLED", // guild has enabled role subscriptions
        "TICKETED_EVENTS_ENABLED", // guild has enabled ticketed events
        "VANITY_URL", // guild has access to set a vanity URL
        "VERIFIED", // guild is verified
        "VIP_REGIONS", // guild has access to set 384kbps bitrate in voice (previously VIP voice servers)
        "WELCOME_SCREEN_ENABLED", // guild has enabled the welcome screen
        "COMMUNITY", // Enables Community Features in the guild
        "DISCOVERABLE", // Enables discovery in the guild, making it publicly listed
        "INVITES_DISABLED", // Pauses all invites/access to the server
        "RAID_ALERTS_DISABLED", // disables alerts for join raids
    ],

    // Channel
    ChannelTypes: {
        GUILD_TEXT: 0, // a text channel within a server
        DM: 1, // a direct message between users
        GUILD_VOICE: 2, // a voice channel within a server
        GROUP_DM: 3, // a direct message between multiple users
        GUILD_CATEGORY: 4, // an organizational category that contains up to 50 channels
        GUILD_ANNOUNCEMENT: 5, // a channel that users can follow and crosspost into their own server (formerly news channels)
        ANNOUNCEMENT_THREAD: 10, // a temporary sub-channel within a GUILD_ANNOUNCEMENT channel
        PUBLIC_THREAD: 11, // a temporary sub-channel within a GUILD_TEXT or GUILD_FORUM channel
        PRIVATE_THREAD: 12, // a temporary sub-channel within a GUILD_TEXT channel that is only viewable by those invited and those with the MANAGE_THREADS permission
        GUILD_STAGE_VOICE: 13, // a voice channel for hosting events with an audience
        GUILD_DIRECTORY: 14, // the channel in a hub containing the listed servers
        GUILD_FORUM: 15, // Channel that can only contain threads
        GUILD_MEDIA: 16, // Channel that can only contain threads, similar to GUILD_FORUM channels
        0: "GUILD_TEXT",
        1: "DM",
        2: "GUILD_VOICE",
        3: "GROUP_DM",
        4: "GUILD_CATEGORY",
        5: "GUILD_ANNOUNCEMENT",
        10: "ANNOUNCEMENT_THREAD",
        11: "PUBLIC_THREAD",
        12: "PRIVATE_THREAD",
        13: "GUILD_STAGE_VOICE",
        14: "GUILD_DIRECTORY",
        15: "GUILD_FORUM",
        16: "GUILD_MEDIA",
    },
    VideoQualityModes: {
        AUTO: 1, // Discord chooses the quality for optimal performance
        FULL: 2, // 720p
        1: "AUTO",
        2: "FULL",
    },
    ChannelFlags: {
        PINNED: 1 << 1, // this thread is pinned to the top of its parent GUILD_FORUM or GUILD_MEDIA channel
        REQUIRE_TAG: 1 << 4, // whether a tag is required to be specified when creating a thread in a GUILD_FORUM or a GUILD_MEDIA channel. Tags are specified in the applied_tags field.
        HIDE_MEDIA_DOWNLOAD_OPTIONS: 1 << 15, // when set hides the embedded media download options. Available only for media channels
        [1 << 1]: "PINNED",
        [1 << 4]: "REQUIRE_TAG",
        [1 << 15]: "HIDE_MEDIA_DOWNLOAD_OPTIONS",
    },
    SortOrderTypes: {
        LATEST_ACTIVITY: 0, // Sort forum posts by activity
        CREATION_DATE: 1, // Sort forum posts by creation time (from most recent to oldest)
        0: "LATEST_ACTIVITY",
        1: "CREATION_DATE",
    },
    ForumLayoutTypes: {
        NOT_SET: 0, // No default has been set for forum channel
        LIST_VIEW: 1, // Display posts as a list
        GALLERY_VIEW: 2, // Display posts as a collection of tiles
        0: "NOT_SET",
        1: "LIST_VIEW",
        2: "GALLERY_VIEW",
    },

    // Message
    MessageTypes: {
        DEFAULT: 0, // Detectable: true
        RECIPIENT_ADD: 1, // Detectable: false
        RECIPIENT_REMOVE: 2, // Detectable: false
        CALL: 3, // Detectable: false
        CHANNEL_NAME_CHANGE: 4, // Detectable: false
        CHANNEL_ICON_CHANGE: 5, // Detectable: false
        CHANNEL_PINNED_MESSAGE: 6, // Detectable: true
        USER_JOIN: 7, // Detectable: true
        GUILD_BOOST: 8, // Detectable: true
        GUILD_BOOST_TIER_1: 9, // Detectable: true
        GUILD_BOOST_TIER_2: 10, // Detectable: true
        GUILD_BOOST_TIER_3: 11, // Detectable: true
        CHANNEL_FOLLOW_ADD: 12, // Detectable: true
        GUILD_DISCOVERY_DISQUALIFIED: 14, // Detectable: false
        GUILD_DISCOVERY_REQUALIFIED: 15, // Detectable: false
        GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING: 16, // Detectable: false
        GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING: 17, // Detectable: false
        THREAD_CREATED: 18, // Detectable: true
        REPLY: 19, // Detectable: true
        CHAT_INPUT_COMMAND: 20, // Detectable: true
        THREAD_STARTER_MESSAGE: 21, // Detectable: false
        GUILD_INVITE_REMINDER: 22, // Detectable: true
        CONTEXT_MENU_COMMAND: 23, // Detectable: true
        AUTO_MODERATION_ACTION: 24, // Detectable: true*
        ROLE_SUBSCRIPTION_PURCHASE: 25, // Detectable: true
        INTERACTION_PREMIUM_UPSELL: 26, // Detectable: true
        STAGE_START: 27, // Detectable: true
        STAGE_END: 28, // Detectable: true
        STAGE_SPEAKER: 29, // Detectable: true
        STAGE_TOPIC: 31, // Detectable: true
        GUILD_APPLICATION_PREMIUM_SUBSCRIPTION: 32, // Detectable: false
        0: "DEFAULT_MESSAGE",
        1: "RECIPIENT_ADD",
        2: "RECIPIENT_REMOVE",
        3: "CALL",
        4: "CHANNEL_NAME_CHANGE",
        5: "CHANNEL_ICON_CHANGE",
        6: "CHANNEL_PINNED_MESSAGE",
        7: "USER_JOIN",
        8: "GUILD_BOOST",
        9: "GUILD_BOOST_TIER_1",
        10: "GUILD_BOOST_TIER_2",
        11: "GUILD_BOOST_TIER_3",
        12: "CHANNEL_FOLLOW_ADD",
        14: "GUILD_DISCOVERY_DISQUALIFIED",
        15: "GUILD_DISCOVERY_REQUALIFIED",
        16: "GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING",
        17: "GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING",
        18: "THREAD_CREATED",
        19: "REPLY",
        20: "CHAT_INPUT_COMMAND",
        21: "THREAD_STARTER_MESSAGE",
        22: "GUILD_INVITE_REMINDER",
        23: "CONTEXT_MENU_COMMAND",
        24: "AUTO_MODERATION_ACTION",
        25: "ROLE_SUBSCRIPTION_PURCHASE",
        26: "INTERACTION_PREMIUM_UPSELL",
        27: "STAGE_START",
        28: "STAGE_END",
        29: "STAGE_SPEAKER",
        31: "STAGE_TOPIC",
        32: "GUILD_APPLICATION_PREMIUM_SUBSCRIPTION",
    },
    MessageActivityTypes: {
        JOIN: 1,
        SPECTATE: 2,
        LISTEN: 3,
        JOIN_REQUEST: 5,
        1: "JOIN",
        2: "SPECTATE",
        3: "LISTEN",
        5: "JOIN_REQUEST",
    },
    MessageFlags: {
        CROSSPOSTED: 1 << 0, // this message has been published to subscribed channels (via Channel Following)
        IS_CROSSPOST: 1 << 1, // this message originated from a message in another channel (via Channel Following)
        SUPPRESS_EMBEDS: 1 << 2, // do not include any embeds when serializing this message
        SOURCE_MESSAGE_DELETED: 1 << 3, // the source message for this crosspost has been deleted (via Channel Following)
        URGENT: 1 << 4, // this message came from the urgent message system
        HAS_THREAD: 1 << 5, // this message has an associated thread, with the same id as the message
        EPHEMERAL: 1 << 6, // this message is only visible to the user who invoked the Interaction
        LOADING: 1 << 7, // this message is an Interaction Response and the bot is "thinking"
        FAILED_TO_MENTION_SOME_ROLES_IN_THREAD: 1 << 8, // this message failed to mention some roles and add their members to the thread
        SUPPRESS_NOTIFICATIONS: 1 << 12, // this message will not trigger push and desktop notifications
        IS_VOICE_MESSAGE: 1 << 13, // this message is a voice message
        [1 << 0]: "CROSSPOSTED",
        [1 << 1]: "IS_CROSSPOST",
        [1 << 2]: "SUPPRESS_EMBEDS",
        [1 << 3]: "SOURCE_MESSAGE_DELETED",
        [1 << 4]: "URGENT",
        [1 << 5]: "HAS_THREAD",
        [1 << 6]: "EPHEMERAL",
        [1 << 7]: "LOADING",
        [1 << 8]: "FAILED_TO_MENTION_SOME_ROLES_IN_THREAD",
        [1 << 12]: "SUPPRESS_NOTIFICATIONS",
        [1 << 13]: "IS_VOICE_MESSAGE",
    },

    // User
    UserFlags: {
        STAFF: 1 << 0, // Discord Employee
        PARTNER: 1 << 1, // Partnered Server Owner
        HYPESQUAD: 1 << 2, // HypeSquad Events Member
        BUG_HUNTER_LEVEL_1: 1 << 3, // Bug Hunter Level 1
        HYPESQUAD_ONLINE_HOUSE_1: 1 << 6, // House Bravery Member
        HYPESQUAD_ONLINE_HOUSE_2: 1 << 7, // House Brilliance Member
        HYPESQUAD_ONLINE_HOUSE_3: 1 << 8, // House Balance Member
        PREMIUM_EARLY_SUPPORTER: 1 << 9, // Early Nitro Supporter
        TEAM_PSEUDO_USER: 1 << 10, // User is a team
        BUG_HUNTER_LEVEL_2: 1 << 14, // Bug Hunter Level 2
        VERIFIED_BOT: 1 << 16, // Verified Bot
        VERIFIED_DEVELOPER: 1 << 17, // Early Verified Bot Developer
        CERTIFIED_MODERATOR: 1 << 18, // Moderator Programs Alumni
        BOT_HTTP_INTERACTIONS: 1 << 19, // Bot uses only HTTP interactions and is shown in the online member list
        ACTIVE_DEVELOPER: 1 << 22, // User is an Active Developer
        [1 << 0]: "STAFF",
        [1 << 1]: "PARTNER",
        [1 << 2]: "HYPESQUAD",
        [1 << 3]: "BUG_HUNTER_LEVEL_1",
        [1 << 6]: "HYPESQUAD_ONLINE_HOUSE_1",
        [1 << 7]: "HYPESQUAD_ONLINE_HOUSE_2",
        [1 << 8]: "HYPESQUAD_ONLINE_HOUSE_3",
        [1 << 9]: "PREMIUM_EARLY_SUPPORTER",
        [1 << 10]: "TEAM_PSEUDO_USER",
        [1 << 14]: "BUG_HUNTER_LEVEL_2",
        [1 << 16]: "VERIFIED_BOT",
        [1 << 17]: "VERIFIED_DEVELOPER",
        [1 << 18]: "CERTIFIED_MODERATOR",
        [1 << 19]: "BOT_HTTP_INTERACTIONS",
        [1 << 22]: "ACTIVE_DEVELOPER",
    },
    PremiumTypes: {
        None: 0,
        NitroClassic: 1,
        Nitro: 2,
        NitroBasic: 3,
        0: "None",
        1: "NitroClassic",
        2: "Nitro",
        3: "NitroBasic",
    },
    VisibilityTypes: {
        None: 0, // invisible to everyone except the user themselves
        Everyone: 1, // visible to everyone
        0: "None",
        1: "Everyone",
    },

    // Other
    HypeSquadHouses: {
        Bravery: 1,
        Brilliance: 2,
        Balance: 3,
        1: "Bravery",
        2: "Brilliance",
        3: "Balance",
    },
};
