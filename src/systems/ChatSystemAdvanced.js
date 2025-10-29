/**
 * ChatSystemAdvanced.js - Phase 5 Social
 */
export class ChatSystemAdvanced {
  constructor() {
    this.channels = ['GLOBAL', 'GUILD', 'PARTY', 'WHISPER', 'TRADE'];
    this.ui = { chat_window: '/assets/ui/chat/chat_window.png', emojis: '/assets/ui/chat/emojis.png' };  // Kenney
  }
  sendMessage(channel, msg) { console.log(`[${channel}] ${msg}`); }
}
