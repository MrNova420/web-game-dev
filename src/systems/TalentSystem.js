/**
 * Talent System - Phase 3 RPG Core
 * Manages talent trees, talent points, and specializations
 * Features vibrant anime-styled talent tree visualization using external assets
 */

export class TalentSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Talent trees for each class
        this.talentTrees = this.initializeTalentTrees();
        
        // Player's unlocked talents
        this.playerTalents = {};
        this.availableTalentPoints = 0;
        this.spentTalentPoints = 0;
        
        // Talent points per level
        this.pointsPerLevel = 1;
        this.bonusPointsEvery5Levels = 1;
        
        this.init();
    }
    
    init() {
        console.log('🌳 Initializing Talent System...');
        
        // Initialize player talents tracking
        Object.keys(this.talentTrees).forEach(treeId => {
            this.playerTalents[treeId] = {};
            const tree = this.talentTrees[treeId];
            
            tree.talents.forEach(talent => {
                this.playerTalents[treeId][talent.id] = {
                    rank: 0,
                    maxRank: talent.maxRank || 1,
                    unlocked: false
                };
            });
        });
        
        console.log('✅ Talent System initialized with', Object.keys(this.talentTrees).length, 'talent trees');
    }
    
    /**
     * Initialize talent trees for all classes with anime-themed visuals
     */
    initializeTalentTrees() {
        return {
            WARRIOR_OFFENSE: {
                name: 'Weapon Master',
                class: 'WARRIOR',
                description: 'Master the art of physical combat and weapon techniques',
                color: '#FF0066', // Bright red-pink
                icon: 'talent_tree_warrior_offense', // External Kenney asset
                talents: [
                    {
                        id: 'BASIC_ATTACK_DAMAGE',
                        name: 'Power Strike',
                        description: 'Increases basic attack damage',
                        maxRank: 5,
                        bonusPerRank: { physicalDamage: 5 },
                        row: 1,
                        column: 2,
                        requires: []
                    },
                    {
                        id: 'CLEAVE',
                        name: 'Cleave',
                        description: 'Attacks hit additional nearby enemies',
                        maxRank: 1,
                        bonusPerRank: { cleaveTargets: 2 },
                        row: 2,
                        column: 1,
                        requires: ['BASIC_ATTACK_DAMAGE']
                    },
                    {
                        id: 'WHIRLWIND',
                        name: 'Whirlwind',
                        description: 'Spin attack that hits all nearby enemies',
                        maxRank: 1,
                        bonusPerRank: { aoeRadius: 5 },
                        row: 2,
                        column: 3,
                        requires: ['BASIC_ATTACK_DAMAGE']
                    },
                    {
                        id: 'CRITICAL_STRIKE',
                        name: 'Critical Strike',
                        description: 'Increases critical hit chance and damage',
                        maxRank: 5,
                        bonusPerRank: { critChance: 2, critDamage: 5 },
                        row: 3,
                        column: 2,
                        requires: ['CLEAVE', 'WHIRLWIND']
                    },
                    {
                        id: 'EXECUTE',
                        name: 'Execute',
                        description: 'Deal massive damage to enemies below 20% health',
                        maxRank: 1,
                        bonusPerRank: { executeDamage: 300 },
                        row: 4,
                        column: 2,
                        requires: ['CRITICAL_STRIKE']
                    }
                ]
            },
            
            WARRIOR_DEFENSE: {
                name: 'Iron Wall',
                class: 'WARRIOR',
                description: 'Become an unbreakable fortress of defense',
                color: '#00FF00', // Bright green
                icon: 'talent_tree_warrior_defense',
                talents: [
                    {
                        id: 'THICK_SKIN',
                        name: 'Thick Skin',
                        description: 'Increases armor and health',
                        maxRank: 5,
                        bonusPerRank: { armor: 10, maxHealth: 50 },
                        row: 1,
                        column: 2,
                        requires: []
                    },
                    {
                        id: 'SHIELD_BLOCK',
                        name: 'Shield Block',
                        description: 'Chance to block incoming attacks',
                        maxRank: 5,
                        bonusPerRank: { blockChance: 5 },
                        row: 2,
                        column: 2,
                        requires: ['THICK_SKIN']
                    },
                    {
                        id: 'LAST_STAND',
                        name: 'Last Stand',
                        description: 'Survive lethal damage once per battle',
                        maxRank: 1,
                        bonusPerRank: { surviveLethalDamage: 1 },
                        row: 3,
                        column: 2,
                        requires: ['SHIELD_BLOCK']
                    },
                    {
                        id: 'REFLECT_DAMAGE',
                        name: 'Thorns',
                        description: 'Reflect damage back to attackers',
                        maxRank: 5,
                        bonusPerRank: { reflectDamage: 10 },
                        row: 4,
                        column: 2,
                        requires: ['LAST_STAND']
                    }
                ]
            },
            
            MAGE_FIRE: {
                name: 'Pyromancer',
                class: 'MAGE',
                description: 'Command the destructive power of flames',
                color: '#FF00FF', // Bright magenta
                icon: 'talent_tree_mage_fire',
                talents: [
                    {
                        id: 'FIRE_MASTERY',
                        name: 'Fire Mastery',
                        description: 'Increases fire spell damage',
                        maxRank: 5,
                        bonusPerRank: { fireDamage: 10 },
                        row: 1,
                        column: 2,
                        requires: []
                    },
                    {
                        id: 'IGNITE',
                        name: 'Ignite',
                        description: 'Fire spells apply burning DoT',
                        maxRank: 3,
                        bonusPerRank: { burnDuration: 2, burnDamage: 20 },
                        row: 2,
                        column: 2,
                        requires: ['FIRE_MASTERY']
                    },
                    {
                        id: 'METEOR',
                        name: 'Meteor',
                        description: 'Summon a devastating meteor strike',
                        maxRank: 1,
                        bonusPerRank: { meteorDamage: 500, aoeRadius: 8 },
                        row: 3,
                        column: 2,
                        requires: ['IGNITE']
                    },
                    {
                        id: 'PHOENIX_FORM',
                        name: 'Phoenix Form',
                        description: 'Transform into a phoenix, gaining flight and fire immunity',
                        maxRank: 1,
                        bonusPerRank: { phoenixDuration: 10, fireImmunity: 1 },
                        row: 4,
                        column: 2,
                        requires: ['METEOR']
                    }
                ]
            },
            
            MAGE_ICE: {
                name: 'Cryomancer',
                class: 'MAGE',
                description: 'Freeze your enemies with ice magic',
                color: '#00FFFF', // Bright cyan
                icon: 'talent_tree_mage_ice',
                talents: [
                    {
                        id: 'ICE_MASTERY',
                        name: 'Ice Mastery',
                        description: 'Increases ice spell damage',
                        maxRank: 5,
                        bonusPerRank: { iceDamage: 10 },
                        row: 1,
                        column: 2,
                        requires: []
                    },
                    {
                        id: 'FROSTBITE',
                        name: 'Frostbite',
                        description: 'Ice spells slow enemies',
                        maxRank: 3,
                        bonusPerRank: { slowAmount: 15, slowDuration: 2 },
                        row: 2,
                        column: 2,
                        requires: ['ICE_MASTERY']
                    },
                    {
                        id: 'ICE_BARRIER',
                        name: 'Ice Barrier',
                        description: 'Create an ice shield that absorbs damage',
                        maxRank: 5,
                        bonusPerRank: { shieldStrength: 100 },
                        row: 3,
                        column: 1,
                        requires: ['FROSTBITE']
                    },
                    {
                        id: 'ABSOLUTE_ZERO',
                        name: 'Absolute Zero',
                        description: 'Freeze all enemies in a large area',
                        maxRank: 1,
                        bonusPerRank: { freezeDuration: 5, aoeRadius: 15 },
                        row: 4,
                        column: 2,
                        requires: ['FROSTBITE', 'ICE_BARRIER']
                    }
                ]
            },
            
            ROGUE_STEALTH: {
                name: 'Shadow Dancer',
                class: 'ROGUE',
                description: 'Master the shadows and strike unseen',
                color: '#9900FF', // Bright purple
                icon: 'talent_tree_rogue_stealth',
                talents: [
                    {
                        id: 'STEALTH_MASTERY',
                        name: 'Stealth Mastery',
                        description: 'Improves stealth effectiveness',
                        maxRank: 5,
                        bonusPerRank: { stealthDuration: 2, stealthSpeed: 10 },
                        row: 1,
                        column: 2,
                        requires: []
                    },
                    {
                        id: 'BACKSTAB',
                        name: 'Backstab',
                        description: 'Attacks from stealth deal massive damage',
                        maxRank: 5,
                        bonusPerRank: { backstabDamage: 50 },
                        row: 2,
                        column: 2,
                        requires: ['STEALTH_MASTERY']
                    },
                    {
                        id: 'SHADOW_STEP',
                        name: 'Shadow Step',
                        description: 'Teleport behind target',
                        maxRank: 1,
                        bonusPerRank: { shadowStepRange: 20 },
                        row: 3,
                        column: 2,
                        requires: ['BACKSTAB']
                    },
                    {
                        id: 'VANISH',
                        name: 'Vanish',
                        description: 'Instantly enter stealth, even in combat',
                        maxRank: 1,
                        bonusPerRank: { vanishCooldown: 60 },
                        row: 4,
                        column: 2,
                        requires: ['SHADOW_STEP']
                    }
                ]
            },
            
            ROGUE_POISON: {
                name: 'Venom Master',
                class: 'ROGUE',
                description: 'Use deadly poisons and toxins',
                color: '#00FF00', // Bright green
                icon: 'talent_tree_rogue_poison',
                talents: [
                    {
                        id: 'POISON_WEAPONS',
                        name: 'Poison Weapons',
                        description: 'Coat weapons in deadly poison',
                        maxRank: 5,
                        bonusPerRank: { poisonDamage: 15, poisonDuration: 2 },
                        row: 1,
                        column: 2,
                        requires: []
                    },
                    {
                        id: 'TOXIN_CLOUD',
                        name: 'Toxin Cloud',
                        description: 'Create a cloud of poisonous gas',
                        maxRank: 3,
                        bonusPerRank: { cloudRadius: 3, cloudDamage: 20 },
                        row: 2,
                        column: 2,
                        requires: ['POISON_WEAPONS']
                    },
                    {
                        id: 'DEADLY_POISON',
                        name: 'Deadly Poison',
                        description: 'Poisons are more lethal',
                        maxRank: 5,
                        bonusPerRank: { poisonMultiplier: 20 },
                        row: 3,
                        column: 2,
                        requires: ['TOXIN_CLOUD']
                    },
                    {
                        id: 'ENVENOM',
                        name: 'Envenom',
                        description: 'Consume poison stacks for massive burst damage',
                        maxRank: 1,
                        bonusPerRank: { envenomDamagePerStack: 100 },
                        row: 4,
                        column: 2,
                        requires: ['DEADLY_POISON']
                    }
                ]
            }
        };
    }
    
    /**
     * Unlock a talent
     */
    unlockTalent(treeId, talentId) {
        if (!this.talentTrees[treeId]) {
            console.warn(`Unknown talent tree: ${treeId}`);
            return false;
        }
        
        const tree = this.talentTrees[treeId];
        const talent = tree.talents.find(t => t.id === talentId);
        
        if (!talent) {
            console.warn(`Unknown talent: ${talentId}`);
            return false;
        }
        
        const playerTalent = this.playerTalents[treeId][talentId];
        
        // Check if already maxed
        if (playerTalent.rank >= playerTalent.maxRank) {
            console.warn('Talent already maxed');
            return false;
        }
        
        // Check if have points
        if (this.availableTalentPoints < 1) {
            console.warn('Not enough talent points');
            return false;
        }
        
        // Check requirements
        if (talent.requires && talent.requires.length > 0) {
            for (const reqId of talent.requires) {
                const reqTalent = this.playerTalents[treeId][reqId];
                if (!reqTalent || reqTalent.rank === 0) {
                    console.warn(`Requires ${reqId} to be unlocked first`);
                    return false;
                }
            }
        }
        
        // Unlock talent
        playerTalent.rank++;
        playerTalent.unlocked = true;
        this.availableTalentPoints--;
        this.spentTalentPoints++;
        
        console.log(`✨ Unlocked ${talent.name} (Rank ${playerTalent.rank}/${playerTalent.maxRank})`);
        
        // Apply bonuses
        this.applyTalentBonuses(talent, playerTalent.rank);
        
        // Create magical effect
        if (this.gameEngine.magicalBackgroundSystem) {
            this.gameEngine.magicalBackgroundSystem.createSparkBurst(
                { x: 0, y: 2, z: 0 },
                tree.color,
                50
            );
        }
        
        return true;
    }
    
    /**
     * Apply talent bonuses to player
     */
    applyTalentBonuses(talent, rank) {
        if (!talent.bonusPerRank) return;
        
        Object.keys(talent.bonusPerRank).forEach(bonusType => {
            const bonusAmount = talent.bonusPerRank[bonusType] * rank;
            
            // Apply to relevant systems
            if (this.gameEngine.attributeSystem) {
                // Some bonuses map to attributes
                const attrMapping = {
                    physicalDamage: 'STRENGTH',
                    magicDamage: 'INTELLIGENCE',
                    maxHealth: 'VITALITY',
                    maxMana: 'INTELLIGENCE'
                };
                
                if (attrMapping[bonusType]) {
                    this.gameEngine.attributeSystem.addAttributeBonus(
                        attrMapping[bonusType],
                        Math.floor(bonusAmount / 10), // Scale down for attributes
                        `Talent: ${talent.name}`
                    );
                }
            }
            
            console.log(`  +${bonusAmount} ${bonusType}`);
        });
    }
    
    /**
     * Reset talent tree
     */
    resetTalents(treeId = null) {
        let refundedPoints = 0;
        
        const treesToReset = treeId ? [treeId] : Object.keys(this.talentTrees);
        
        treesToReset.forEach(tree => {
            if (!this.playerTalents[tree]) return;
            
            Object.keys(this.playerTalents[tree]).forEach(talentId => {
                const playerTalent = this.playerTalents[tree][talentId];
                refundedPoints += playerTalent.rank;
                playerTalent.rank = 0;
                playerTalent.unlocked = false;
            });
        });
        
        this.availableTalentPoints += refundedPoints;
        this.spentTalentPoints -= refundedPoints;
        
        console.log(`🔄 Talents reset! ${refundedPoints} points refunded`);
        return refundedPoints;
    }
    
    /**
     * Add talent points
     */
    addTalentPoints(amount) {
        this.availableTalentPoints += amount;
        console.log(`+${amount} talent points! (Total: ${this.availableTalentPoints})`);
    }
    
    /**
     * Get talent info for display
     */
    getTalentInfo(treeId, talentId) {
        if (!this.talentTrees[treeId]) return null;
        
        const tree = this.talentTrees[treeId];
        const talent = tree.talents.find(t => t.id === talentId);
        if (!talent) return null;
        
        const playerTalent = this.playerTalents[treeId][talentId];
        
        // Check if requirements are met
        let requirementsMet = true;
        const requirementStatus = [];
        
        if (talent.requires && talent.requires.length > 0) {
            talent.requires.forEach(reqId => {
                const reqTalent = this.playerTalents[treeId][reqId];
                const reqDef = tree.talents.find(t => t.id === reqId);
                const met = reqTalent && reqTalent.rank > 0;
                
                requirementsMet = requirementsMet && met;
                requirementStatus.push({
                    name: reqDef ? reqDef.name : reqId,
                    met: met
                });
            });
        }
        
        return {
            definition: talent,
            playerRank: playerTalent.rank,
            maxRank: playerTalent.maxRank,
            unlocked: playerTalent.unlocked,
            requirementsMet: requirementsMet,
            requirements: requirementStatus,
            treeColor: tree.color
        };
    }
    
    /**
     * Get all talent trees for a class
     */
    getClassTalentTrees(className) {
        const result = [];
        
        Object.keys(this.talentTrees).forEach(treeId => {
            const tree = this.talentTrees[treeId];
            if (tree.class === className) {
                result.push({
                    id: treeId,
                    ...tree,
                    spentPoints: this.getTreeSpentPoints(treeId)
                });
            }
        });
        
        return result;
    }
    
    /**
     * Get total points spent in a tree
     */
    getTreeSpentPoints(treeId) {
        if (!this.playerTalents[treeId]) return 0;
        
        let total = 0;
        Object.keys(this.playerTalents[treeId]).forEach(talentId => {
            total += this.playerTalents[treeId][talentId].rank;
        });
        
        return total;
    }
    
    /**
     * Get talent tree visualization data
     */
    getTalentTreeVisualization(treeId) {
        if (!this.talentTrees[treeId]) return null;
        
        const tree = this.talentTrees[treeId];
        const visualization = {
            tree: tree,
            nodes: [],
            connections: []
        };
        
        // Create node data for each talent
        tree.talents.forEach(talent => {
            const info = this.getTalentInfo(treeId, talent.id);
            
            visualization.nodes.push({
                id: talent.id,
                position: { row: talent.row, column: talent.column },
                ...info
            });
            
            // Create connections to requirements
            if (talent.requires && talent.requires.length > 0) {
                talent.requires.forEach(reqId => {
                    const reqTalent = tree.talents.find(t => t.id === reqId);
                    if (reqTalent) {
                        visualization.connections.push({
                            from: reqId,
                            to: talent.id,
                            fromPos: { row: reqTalent.row, column: reqTalent.column },
                            toPos: { row: talent.row, column: talent.column }
                        });
                    }
                });
            }
        });
        
        return visualization;
    }
    
    /**
     * Update talent system
     */
    update(deltaTime) {
        // Talent system is mostly event-driven
    }
}
