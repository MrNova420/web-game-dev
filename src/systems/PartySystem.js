/**
 * PartySystem.js
 * Party formation and management for group content.
 * All UI from Kenney + game-icons.net.
 */

export class PartySystem {
  constructor() {
    this.parties = new Map();
    this.maxPartySize = 5;
    this.ui = {
      party_frames: '/assets/ui/party/party_frames.png',            // Kenney UI Pack
      leader_icon: '/assets/ui/party/leader_crown.png'              // Kenney UI Pack
    };
  }

  createParty(leaderId) {
    logger.info(`${leaderId} created party`);
    logger.info(`  UI: ${this.ui.party_frames}`);
    this.parties.set(leaderId, { members: [leaderId], leader: leaderId });
  }

  inviteToParty(partyId, playerId) {
    logger.info(`Invited ${playerId} to party ${partyId}`);
  }
}
