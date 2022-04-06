class DiscordEvents {
    discord_disconnect() {}
    gateway() {}
    heartbeat_sent() {}
    heartbeat_received() {}
    ready() {}
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
    embed_sent(message) {}
    message_edit(message) {}
}

module.exports = DiscordEvents;
