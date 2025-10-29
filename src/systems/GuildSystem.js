/**
 * GuildSystem.js
 * Guild creation, management, and activities.
 * All UI from Kenney + game-icons.net.
 */

export class GuildSystem {
  constructor() {
    this.guilds = new Map();
    this.maxMembers = 100;
    this.ui = {
      guild_panel: '/assets/ui/guild/guild_panel.png',              // Kenney UI Pack
      guild_banner: '/assets/ui/guild/banner_template.png'          // Kenney UI Pack
    };
    this.icons = {
      guild_master: '/assets/icons/guild/master.png',               // game-icons.net
      officer: '/assets/icons/guild/officer.png',                   // game-icons.net
      member: '/assets/icons/guild/member.png'                      // game-icons.net
    };
  }

  createGuild(leaderId, guildName) {
    console.log(`${leaderId} created guild: ${guildName}`);
    console.log(`  UI: ${this.ui.guild_panel}`);
  }
}
