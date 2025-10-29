/**
 * SkillTreeSystem.js
 * Visual skill tree with branching paths and prerequisites.
 * All icons from game-icons.net, UI from Kenney.
 */

export class SkillTreeSystem {
  constructor() {
    this.skillTrees = {
      WARRIOR: {
        nodes: 50,
        branches: ['BERSERKER', 'GUARDIAN', 'WARLORD'],
        ui: '/assets/ui/skill_trees/warrior_tree.png'               // Kenney UI Pack
      },
      MAGE: {
        nodes: 50,
        branches: ['PYROMANCER', 'CRYOMANCER', 'ARCANIST'],
        ui: '/assets/ui/skill_trees/mage_tree.png'                  // Kenney UI Pack
      }
    };
    this.icons = {
      node_locked: '/assets/icons/skills/locked.png',               // game-icons.net
      node_available: '/assets/icons/skills/available.png',         // game-icons.net
      node_unlocked: '/assets/icons/skills/unlocked.png'            // game-icons.net
    };
  }

  unlockNode(playerId, tree, nodeId) {
    console.log(`${playerId} unlocked ${nodeId} in ${tree} tree`);
    console.log(`  Icon: ${this.icons.node_unlocked}`);
  }

  /**
   * Update skill points for the player
   * Called when player levels up or completes achievements
   * @todo Implement skill point calculation and updates
   */
  updateSkillPoints() {
    // TODO: Implement skill point calculation and updates
  }

  /**
   * Get save data for the skill tree system
   * @returns {{unlockedSkills: Array, skillPoints: number}} Save data object
   * @todo Track actual unlocked skills and points
   */
  getSaveData() {
    // TODO: Track actual unlocked skills and points
    return {
      unlockedSkills: [],
      skillPoints: 0
    };
  }
}
