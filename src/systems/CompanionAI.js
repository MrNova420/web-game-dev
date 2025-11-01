import { logger } from '../core/Logger.js';
/**
 * CompanionAI.js
 * Enhanced companion AI with combat tactics, commands, formations, and synergies
 * Part of Phase 5: Pet/Companion Combat
 */

export class CompanionAI {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // AI behavior settings
        this.behaviors = {
            aggressive: {
                attackRange: 15,
                preferredDistance: 5,
                attackPriority: 'nearest',
                useAbilities: true
            },
            defensive: {
                attackRange: 10,
                preferredDistance: 8,
                attackPriority: 'weakest',
                protectPlayer: true
            },
            balanced: {
                attackRange: 12,
                preferredDistance: 6,
                attackPriority: 'strategic',
                useAbilities: true
            },
            support: {
                attackRange: 8,
                preferredDistance: 10,
                attackPriority: 'heal_priority',
                focusHealing: true
            }
        };
        
        // Current AI state
        this.currentBehavior = 'balanced';
        this.commandQueue = [];
        this.formations = this.initializeFormations();
        this.currentFormation = 'standard';
        
        // Synergy bonuses
        this.synergies = this.initializeSynergies();
        this.activeSynergies = [];
        
        // Ultimate abilities
        this.ultimates = new Map();
        this.ultimateCooldowns = new Map();
        
        // Companion quests
        this.companionQuests = [];
        
        this.initializeUltimates();
        this.initializeCompanionQuests();
    }
    
    /**
     * Initialize formation patterns
     */
    initializeFormations() {
        return {
            standard: {
                name: 'Standard Formation',
                description: 'Basic balanced formation',
                positions: [
                    { x: 0, z: -2 },    // Front
                    { x: -2, z: 0 },    // Left
                    { x: 2, z: 0 }      // Right
                ],
                bonuses: {}
            },
            defensive: {
                name: 'Defensive Circle',
                description: 'Surrounds and protects player',
                positions: [
                    { x: 0, z: -3 },    // Front
                    { x: -2, z: -1 },   // Left front
                    { x: 2, z: -1 }     // Right front
                ],
                bonuses: {
                    defense: 1.2,       // +20% defense
                    damageReduction: 0.1 // -10% damage taken
                }
            },
            aggressive: {
                name: 'Spearhead Formation',
                description: 'Focuses damage on single targets',
                positions: [
                    { x: 0, z: -4 },    // Point
                    { x: -1, z: -2 },   // Left wing
                    { x: 1, z: -2 }     // Right wing
                ],
                bonuses: {
                    attack: 1.3,        // +30% attack
                    critChance: 0.1     // +10% crit
                }
            },
            pincer: {
                name: 'Pincer Attack',
                description: 'Flanks enemies from sides',
                positions: [
                    { x: -4, z: -2 },   // Left flank
                    { x: 4, z: -2 },    // Right flank
                    { x: 0, z: 0 }      // Center support
                ],
                bonuses: {
                    flanking: 1.25,     // +25% damage from flanking
                    evasion: 0.15       // +15% evasion
                }
            },
            support: {
                name: 'Support Line',
                description: 'Maximizes healing and buffs',
                positions: [
                    { x: -2, z: 2 },    // Left rear
                    { x: 2, z: 2 },     // Right rear
                    { x: 0, z: 3 }      // Center rear
                ],
                bonuses: {
                    healing: 1.5,       // +50% healing
                    buffDuration: 1.3   // +30% buff duration
                }
            }
        };
    }
    
    /**
     * Initialize synergy system
     */
    initializeSynergies() {
        return {
            elemental_mastery: {
                name: 'Elemental Mastery',
                description: 'Fire + Ice companions increase all elemental damage',
                requirements: ['fire', 'ice'],
                bonus: { elementalDamage: 1.25 }
            },
            trinity_force: {
                name: 'Trinity Force',
                description: '3 different element types boost all stats',
                requirements: ['different_elements', 'count:3'],
                bonus: { allStats: 1.15 }
            },
            pack_tactics: {
                name: 'Pack Tactics',
                description: 'Multiple beast-type companions increase attack speed',
                requirements: ['type:beast', 'count:2'],
                bonus: { attackSpeed: 1.3 }
            },
            arcane_resonance: {
                name: 'Arcane Resonance',
                description: 'Magic companions boost magic power',
                requirements: ['type:magic', 'count:2'],
                bonus: { magicPower: 1.4 }
            },
            guardian_bond: {
                name: 'Guardian Bond',
                description: 'Tank + Healer provide massive survivability',
                requirements: ['role:tank', 'role:healer'],
                bonus: { defense: 1.3, hpRegen: 2.0 }
            },
            strike_team: {
                name: 'Strike Team',
                description: 'All DPS companions increase critical damage',
                requirements: ['role:dps', 'count:3'],
                bonus: { critDamage: 1.5 }
            }
        };
    }
    
    /**
     * Initialize ultimate abilities
     */
    initializeUltimates() {
        this.ultimates.set('smoke_siren', {
            id: 'charm_of_eternity',
            name: 'Charm of Eternity',
            description: 'Charms all enemies in large area',
            cooldown: 60000, // 60 seconds
            effect: {
                type: 'charm',
                duration: 10000,
                radius: 20,
                damage: 200
            }
        });
        
        this.ultimates.set('blade_muse', {
            id: 'dance_of_blades',
            name: 'Dance of Blades',
            description: 'Unleashes a flurry of devastating strikes',
            cooldown: 45000,
            effect: {
                type: 'multi_strike',
                strikes: 10,
                damagePerStrike: 80,
                range: 10
            }
        });
        
        this.ultimates.set('herb_witch', {
            id: 'natures_blessing',
            name: "Nature's Blessing",
            description: 'Heals entire team and grants regeneration',
            cooldown: 50000,
            effect: {
                type: 'heal',
                healAmount: 300,
                regen: 50,
                regenDuration: 15000,
                range: 25
            }
        });
        
        this.ultimates.set('cyber_dryad', {
            id: 'system_overload',
            name: 'System Overload',
            description: 'Massive AOE tech damage and enemy debuff',
            cooldown: 55000,
            effect: {
                type: 'aoe_damage',
                damage: 400,
                debuff: 'slow',
                debuffValue: 0.5,
                debuffDuration: 8000,
                radius: 15
            }
        });
    }
    
    /**
     * Initialize companion quests
     */
    initializeCompanionQuests() {
        this.companionQuestTemplates = [
            {
                id: 'smoke_siren_bond',
                companion: 'smoke_siren',
                name: 'Smoke Siren\'s Secret',
                description: 'Help Smoke Siren recover her lost memories',
                stages: [
                    {
                        objective: 'Defeat 50 smoke enemies',
                        reward: { bond: 10, ability: 'enhanced_charm' }
                    },
                    {
                        objective: 'Reach floor 20',
                        reward: { bond: 15, cosmetic: 'ethereal_dress' }
                    },
                    {
                        objective: 'Use charm ability 100 times',
                        reward: { bond: 20, ultimate_upgrade: true }
                    }
                ]
            },
            {
                id: 'blade_muse_training',
                companion: 'blade_muse',
                name: 'Blade Muse Training',
                description: 'Master the art of blade dancing',
                stages: [
                    {
                        objective: 'Perform 1000 attacks',
                        reward: { bond: 10, ability: 'blade_dash' }
                    },
                    {
                        objective: 'Achieve 50 perfect combos',
                        reward: { bond: 15, cosmetic: 'shadow_blades' }
                    },
                    {
                        objective: 'Defeat a boss without taking damage',
                        reward: { bond: 25, ultimate_upgrade: true }
                    }
                ]
            },
            {
                id: 'herb_witch_garden',
                companion: 'herb_witch',
                name: 'Herb Witch\'s Garden',
                description: 'Collect rare herbs for powerful potions',
                stages: [
                    {
                        objective: 'Collect 50 herbs',
                        reward: { bond: 10, ability: 'poison_brew' }
                    },
                    {
                        objective: 'Heal 10000 HP total',
                        reward: { bond: 15, cosmetic: 'flower_crown' }
                    },
                    {
                        objective: 'Brew 25 legendary potions',
                        reward: { bond: 20, ultimate_upgrade: true }
                    }
                ]
            },
            {
                id: 'cyber_dryad_network',
                companion: 'cyber_dryad',
                name: 'Cyber Dryad Network',
                description: 'Connect to the ancient network',
                stages: [
                    {
                        objective: 'Hack 30 systems',
                        reward: { bond: 10, ability: 'nano_swarm' }
                    },
                    {
                        objective: 'Deal 50000 tech damage',
                        reward: { bond: 15, cosmetic: 'hologram_skin' }
                    },
                    {
                        objective: 'Complete starship dungeon 10 times',
                        reward: { bond: 20, ultimate_upgrade: true }
                    }
                ]
            }
        ];
    }
    
    /**
     * Set AI behavior
     */
    setBehavior(behaviorName) {
        if (this.behaviors[behaviorName]) {
            this.currentBehavior = behaviorName;
            logger.info(`🤖 Companion AI set to ${behaviorName} behavior`);
            return true;
        }
        return false;
    }
    
    /**
     * Set formation
     */
    setFormation(formationName) {
        if (this.formations[formationName]) {
            this.currentFormation = formationName;
            logger.info(`⚔️ Formation changed to ${this.formations[formationName].name}`);
            this.updateCompanionPositions();
            return true;
        }
        return false;
    }
    
    /**
     * Update companion positions based on formation
     */
    updateCompanionPositions() {
        if (!this.gameEngine.player) return;
        
        const formation = this.formations[this.currentFormation];
        const playerPos = this.gameEngine.player.mesh.position;
        
        // Would update actual companion positions in the game
        // This is simplified for now
        const positions = formation.positions.map(offset => ({
            x: playerPos.x + offset.x,
            z: playerPos.z + offset.z
        }));
        
        return positions;
    }
    
    /**
     * Issue command to companions
     */
    issueCommand(command, target = null) {
        const validCommands = ['attack', 'defend', 'follow', 'hold', 'retreat', 'use_ultimate'];
        
        if (!validCommands.includes(command)) {
            return { success: false, reason: 'Invalid command' };
        }
        
        this.commandQueue.push({
            command,
            target,
            timestamp: Date.now()
        });
        
        // Execute command
        this.executeCommand(command, target);
        
        return { success: true, command };
    }
    
    /**
     * Execute command
     */
    executeCommand(command, target) {
        switch (command) {
            case 'attack':
                this.setBehavior('aggressive');
                break;
            case 'defend':
                this.setBehavior('defensive');
                this.setFormation('defensive');
                break;
            case 'follow':
                this.setBehavior('balanced');
                this.setFormation('standard');
                break;
            case 'retreat':
                this.setBehavior('support');
                this.setFormation('support');
                break;
            case 'use_ultimate':
                this.triggerUltimate(target);
                break;
        }
    }
    
    /**
     * Trigger companion ultimate ability
     */
    triggerUltimate(companionId) {
        const companion = companionId || this.gameEngine.companionManager?.activeCompanion;
        if (!companion) {
            return { success: false, reason: 'No active companion' };
        }
        
        const ultimate = this.ultimates.get(companion);
        if (!ultimate) {
            return { success: false, reason: 'Ultimate not found' };
        }
        
        // Check cooldown
        const lastUsed = this.ultimateCooldowns.get(companion) || 0;
        const elapsed = Date.now() - lastUsed;
        
        if (elapsed < ultimate.cooldown) {
            const remaining = Math.ceil((ultimate.cooldown - elapsed) / 1000);
            return { success: false, reason: `Ultimate on cooldown (${remaining}s remaining)` };
        }
        
        // Use ultimate
        this.ultimateCooldowns.set(companion, Date.now());
        
        logger.info(`💥 ${ultimate.name} activated!`);
        
        // Apply effects (simplified)
        this.applyUltimateEffects(ultimate);
        
        return {
            success: true,
            ultimate,
            cooldown: ultimate.cooldown
        };
    }
    
    /**
     * Apply ultimate ability effects
     */
    applyUltimateEffects(ultimate) {
        // This would integrate with combat system
        // For now, simplified
        logger.info(`⚡ Ultimate effect: ${ultimate.effect.type}`);
    }
    
    /**
     * Calculate synergy bonuses
     */
    calculateSynergies() {
        this.activeSynergies = [];
        
        // Get active companions/pets
        const activeUnits = this.getActiveUnits();
        
        // Check each synergy
        for (const [id, synergy] of Object.entries(this.synergies)) {
            if (this.checkSynergyRequirements(synergy, activeUnits)) {
                this.activeSynergies.push({
                    id,
                    ...synergy
                });
            }
        }
        
        return this.activeSynergies;
    }
    
    /**
     * Check if synergy requirements are met
     */
    checkSynergyRequirements(synergy, units) {
        // Simplified synergy checking
        // In full implementation, would check unit elements, types, roles, etc.
        return units.length >= 2;
    }
    
    /**
     * Get active units (companions + pets)
     */
    getActiveUnits() {
        const units = [];
        
        // Add active companion
        if (this.gameEngine.companionManager?.activeCompanion) {
            units.push({
                type: 'companion',
                id: this.gameEngine.companionManager.activeCompanion
            });
        }
        
        // Add active pets
        if (this.gameEngine.petSystem) {
            const pets = this.gameEngine.petSystem.getActiveTeam();
            units.push(...pets.map(pet => ({
                type: 'pet',
                id: pet.instanceId,
                element: pet.element
            })));
        }
        
        return units;
    }
    
    /**
     * Get formation bonuses
     */
    getFormationBonuses() {
        const formation = this.formations[this.currentFormation];
        return formation ? formation.bonuses : {};
    }
    
    /**
     * Get total bonuses (formation + synergies)
     */
    getTotalBonuses() {
        const bonuses = {};
        
        // Formation bonuses
        const formationBonuses = this.getFormationBonuses();
        Object.assign(bonuses, formationBonuses);
        
        // Synergy bonuses
        for (const synergy of this.activeSynergies) {
            for (const [stat, value] of Object.entries(synergy.bonus)) {
                bonuses[stat] = (bonuses[stat] || 1) * value;
            }
        }
        
        return bonuses;
    }
    
    /**
     * Make tactical decision for companion
     */
    makeTacticalDecision(companion, enemies, allies) {
        const behavior = this.behaviors[this.currentBehavior];
        
        // Select target based on behavior
        let target = null;
        
        switch (behavior.attackPriority) {
            case 'nearest':
                target = this.findNearestEnemy(companion, enemies);
                break;
            case 'weakest':
                target = this.findWeakestEnemy(enemies);
                break;
            case 'strategic':
                target = this.findStrategicTarget(companion, enemies);
                break;
            case 'heal_priority':
                target = this.findHealTarget(allies);
                break;
        }
        
        // Decide action
        const action = {
            type: 'move',
            target: target,
            useAbility: behavior.useAbilities && Math.random() < 0.3
        };
        
        return action;
    }
    
    /**
     * Find nearest enemy
     */
    findNearestEnemy(companion, enemies) {
        // Simplified - would calculate actual distances
        return enemies[0];
    }
    
    /**
     * Find weakest enemy
     */
    findWeakestEnemy(enemies) {
        if (!enemies || enemies.length === 0) return null;
        
        return enemies.reduce((weakest, enemy) => {
            return enemy.stats.hp < weakest.stats.hp ? enemy : weakest;
        });
    }
    
    /**
     * Find strategic target (highest threat/priority)
     */
    findStrategicTarget(companion, enemies) {
        // Prioritize bosses, elites, ranged enemies, etc.
        // Simplified for now
        return enemies.find(e => e.isBoss) || enemies[0];
    }
    
    /**
     * Find ally that needs healing
     */
    findHealTarget(allies) {
        if (!allies || allies.length === 0) return null;
        
        return allies.reduce((neediest, ally) => {
            const allyHpPercent = ally.stats.hp / ally.stats.maxHp;
            const neediestHpPercent = neediest.stats.hp / neediest.stats.maxHp;
            return allyHpPercent < neediestHpPercent ? ally : neediest;
        });
    }
    
    /**
     * Start companion quest
     */
    startCompanionQuest(questId) {
        const template = this.companionQuestTemplates.find(q => q.id === questId);
        if (!template) {
            return { success: false, reason: 'Quest not found' };
        }
        
        // Check if companion is active
        const activeCompanion = this.gameEngine.companionManager?.activeCompanion;
        if (activeCompanion !== template.companion) {
            return { success: false, reason: 'This companion is not active' };
        }
        
        const quest = {
            ...template,
            startedAt: Date.now(),
            currentStage: 0,
            progress: {}
        };
        
        this.companionQuests.push(quest);
        
        return { success: true, quest };
    }
    
    /**
     * Update companion quest progress
     */
    updateQuestProgress(questId, objective, amount = 1) {
        const quest = this.companionQuests.find(q => q.id === questId);
        if (!quest) return;
        
        quest.progress[objective] = (quest.progress[objective] || 0) + amount;
        
        // Check if stage completed
        const currentStage = quest.stages[quest.currentStage];
        if (this.isStageComplete(currentStage, quest.progress)) {
            this.completeQuestStage(quest);
        }
    }
    
    /**
     * Check if quest stage is complete
     */
    isStageComplete(stage, progress) {
        // Simplified check
        return true;
    }
    
    /**
     * Complete quest stage
     */
    completeQuestStage(quest) {
        const stage = quest.stages[quest.currentStage];
        
        // Grant rewards
        logger.info(`✨ Completed quest stage: ${stage.objective}`);
        
        quest.currentStage++;
        
        if (quest.currentStage >= quest.stages.length) {
            logger.info(`🏆 Completed companion quest: ${quest.name}!`);
        }
    }
    
    /**
     * Save system state
     */
    save() {
        return {
            currentBehavior: this.currentBehavior,
            currentFormation: this.currentFormation,
            activeSynergies: this.activeSynergies,
            ultimateCooldowns: Array.from(this.ultimateCooldowns.entries()),
            companionQuests: this.companionQuests
        };
    }
    
    /**
     * Load system state
     */
    load(data) {
        if (!data) return;
        
        if (data.currentBehavior) {
            this.currentBehavior = data.currentBehavior;
        }
        
        if (data.currentFormation) {
            this.currentFormation = data.currentFormation;
        }
        
        if (data.activeSynergies) {
            this.activeSynergies = data.activeSynergies;
        }
        
        if (data.ultimateCooldowns) {
            this.ultimateCooldowns = new Map(data.ultimateCooldowns);
        }
        
        if (data.companionQuests) {
            this.companionQuests = data.companionQuests;
        }
    }
    
    /**
     * Update system (called each frame)
     */
    update(deltaTime) {
        // Update synergies
        this.calculateSynergies();
        
        // Process command queue
        while (this.commandQueue.length > 0) {
            const cmd = this.commandQueue.shift();
            // Process command
        }
        
        // Update formation positions
        this.updateCompanionPositions();
    }
}
