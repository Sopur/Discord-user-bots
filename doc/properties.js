class Client {
    constructor(info) {
        this.info.v = info.v; // number
        this.info.users = info.users; // array
        this.info.user_settings_proto = info.user_settings_proto; // array
        this.info.user_settings = info.user_settings; // object
        this.info.user_guild_settings = info.user_guild_settings; // object
        this.info.user = info.user; // object
        this.info.tutorial = info.tutorial; // object
        this.info.sessions = info.sessions; // array
        this.info.session_type = info.session_type; // array
        this.info.session_id = info.session_id; // array
        this.info.resume_gateway_url = info.resume_gateway_url; // array
        this.info.relationships = info.relationships; // array
        this.info.read_state = info.read_state; // object
        this.info.private_channels = info.private_channels; // array
        this.info.merged_members = info.merged_members; // array
        this.info.guilds = info.guilds; // array
        this.info.guild_join_requests = info.guild_join_requests; // array
        this.info.guild_experiments = info.guild_experiments; // array
        this.info.geo_ordered_rtc_regions = info.geo_ordered_rtc_regions; // array
        this.info.friend_suggestion_count = info.friend_suggestion_count; // number
        this.info.experiments = info.experiments; // array
        this.info.country_code = info.country_code; // array
        this.info.consents = info.consents; // object
        this.info.connected_accounts = info.connected_accounts; // array
        this.info.auth_session_id_hash = info.auth_session_id_hash; // array
        this.info.api_code_version = info.api_code_version; // number
        this.info.analytics_token = info.analytics_token; // array
        this.info._trace = info._trace; // array
        this.info.supplemental = info.supplemental; // object
    }
}
