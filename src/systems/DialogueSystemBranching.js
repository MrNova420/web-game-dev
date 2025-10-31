/**
 * DialogueSystemBranching.js
 * Branching dialogue with player choices and consequences.
 * All portraits from game-icons.net + Mixamo character models.
 */

export class DialogueSystemBranching {
  constructor() {
    this.dialogueTrees = new Map();
    this.characterPortraits = {
      npc_merchant: '/assets/portraits/merchant.png',               // game-icons.net
      npc_guard: '/assets/portraits/guard.png',                     // game-icons.net
      npc_wizard: '/assets/portraits/wizard.png'                    // game-icons.net
    };
  }

  startDialogue(npcId, dialogueId) {
    logger.info(`Starting dialogue ${dialogueId} with ${npcId}`);
    logger.info(`  Portrait: ${this.characterPortraits[npcId]}`);
  }
}
