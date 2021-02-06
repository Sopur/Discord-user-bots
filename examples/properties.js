const Discord = require("discord-user-bots");
const user = new Discord.Client("Token goes here.");

// Example properties of user

user.user_settings = user.user_settings; // An object full of properties of settings

user.user = user.user // An object full of properties about the user like username etc

user.tutorial = user.tutorial; // A property

user.session_id = user.session_id; // String of random characters

user.notes = user.notes; // An object that contains all the notes the user has on other people

user.guild_join_requests = user.guild_join_requests // An array

user.user_guild_settings = user.user_guild_settings; // An array of Objects

user.relationships = user.relationships; // An array of Objects

user.read_state = user.read_state; // An array of Objects

user.private_channels = user.private_channels; // An array of Objects

user.presences = user.presences; // An array of Objects

user.guilds = user.guilds; // An array of Objects

user.guild_experiments = user.guild_experiments; // An array containing arrays

user.geo_ordered_rtc_regions = user.geo_ordered_rtc_regions; // An array of strings

user.friend_suggestion_count = user.friend_suggestion_count; // An integer

user.experiments = user.experiments; // An array containing arrays

user.country_code = user.country_code; // A string

user.consents = user.consents; // An Object containing objects

user.connected_accounts = user.connected_accounts; // An array of Objects

user.analytics_token = user.analytics_token; // A string

user._trace = user._trace; // Stringified json

// More readable version

this.user_settings = {
    timezone_offset: timezone-offset-goes-here, // (int)
    theme: 'dark',
    stream_notifications_enabled: true,
    status: 'invisible',
    show_current_game: true,
    restricted_guilds: [],
    render_reactions: true,
    render_embeds: true,
    native_phone_integration_enabled: true,
    message_display_compact: false,
    locale: 'locale-goes-here',
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
    afk_timeout: 600
};
this.user_guild_settings = [
    [Object], [Object], [Object],
    [Object], [Object], [Object],
    [Object], [Object], [Object],
    [Object], [Object], [Object],
    [Object], [Object], [Object],
    [Object], [Object], [Object],
    [Object], [Object], [Object],
    [Object], [Object]
];
this.user = {
    verified: true,
    username: 'Sopur',
    premium: false,
    phone: null,
    nsfw_allowed: true,
    mobile: true,
    mfa_enabled: false,
    id: 'id-goes-here',
    flags: 0,
    email: 'email-goes-here',
    discriminator: 'discriminator-goes-here',
    desktop: true,
    avatar: 'avatar-goes-here',
};
this.tutorial = null;
this.session_id = 'session_id-goes-here';
this.relationships = [
    [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object],
    [Object]
];
this.read_state = [
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object],
];
this.private_channels = [
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object],
];
this.presences = [
    [Object], [Object],
    [Object], [Object],
    [Object], [Object],
    [Object], [Object],
    [Object]
];
this.notes = {
    'id-goes-here': 'note-goes-here',
};
this.guilds = [
    [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object],
    [Object], [Object], [Object], [Object],
    [Object], [Object]
];
this.guild_join_requests = [];
this.guild_experiments = [
    [Array], [Array], [Array],
    [Array], [Array], [Array],
    [Array], [Array], [Array],
    [Array], [Array], [Array],
    [Array], [Array], [Array],
    [Array], [Array]
];
this.geo_ordered_rtc_regions = ['geo', 'ordered', 'rtc', 'regions', 'go', 'here'];
this.friend_suggestion_count = 0;
this.experiments = [
    [Array], [Array], [Array], [Array], [Array],
    [Array], [Array], [Array], [Array], [Array],
    [Array], [Array], [Array], [Array], [Array],
    [Array], [Array], [Array], [Array], [Array],
    [Array], [Array], [Array], [Array], [Array],
    [Array], [Array], [Array], [Array], [Array],
    [Array], [Array], [Array], [Array], [Array],
    [Array], [Array], [Array], [Array], [Array],
    [Array], [Array], [Array], [Array], [Array],
    [Array], [Array], [Array], [Array], [Array],
    [Array], [Array], [Array], [Array], [Array],
    [Array], [Array], [Array], [Array], [Array],
    [Array], [Array], [Array], [Array], [Array],
    [Array]
];
this.country_code = 'country-goes-here';
this.consents = { personalization: [Object] };
this.connected_accounts = [[Object]];
this.analytics_token = 'token-goes-here';
this._trace = ["stringified-json"];