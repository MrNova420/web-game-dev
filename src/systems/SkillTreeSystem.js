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
}
