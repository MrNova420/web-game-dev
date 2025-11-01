import { logger } from '../core/Logger.js';
/**
 * CompanionQuestSystem.js
 * Phase 5 - Companion Quest System
 * Personal storylines, relationship building, and special companion abilities
 * ~500 lines
 */

export class CompanionQuestSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.companions = new Map(); // companionId -> companion data
        this.activeQuests = new Map(); // questId -> quest data
        this.completedQuests = new Set();
        this.relationshipLevels = new Map(); // companionId -> relationship level
        
        // Quest configuration
        this.questConfig = {
            relationshipThresholds: {
                acquaintance: 0,
                friend: 100,
                close_friend: 300,
                trusted_ally: 600,
                soulmate: 1000
            },
            relationshipBonuses: {
                friend: { stats: 1.05, abilities: 1 },
                close_friend: { stats: 1.10, abilities: 2 },
                trusted_ally: { stats: 1.15, abilities: 3 },
                soulmate: { stats: 1.25, abilities: 4 }
            }
        };
        
        // Initialize companion quest database
        this.questDatabase = this.createQuestDatabase();
    }
    
    /**
     * Initialize a companion with quest data
     */
    initializeCompanion(companionId, companionData) {
        if (this.companions.has(companionId)) {
            return this.companions.get(companionId);
        }
        
        const companion = {
            id: companionId,
            name: companionData.name,
            type: companionData.type,
            relationshipPoints: 0,
            relationshipLevel: 'acquaintance',
            unlockedAbilities: [],
            personalStory: {
                chapter: 1,
                maxChapters: 5,
                completed: false
            },
            preferences: {
                gifts: companionData.favoriteGifts || [],
                activities: companionData.favoriteActivities || [],
                dislikes: companionData.dislikes || []
            },
            memories: [],
            specialEvents: [],
            questProgress: new Map()
        };
        
        this.companions.set(companionId, companion);
        this.relationshipLevels.set(companionId, 0);
        
        // Start first companion quest
        this.startCompanionQuest(companionId, 1);
        
        return companion;
    }
    
    /**
     * Create quest database for all companions
     */
    createQuestDatabase() {
        return {
            // Smoke Siren Quests
            smoke_siren: [
                {
                    chapter: 1,
                    id: 'ss_quest_1',
                    name: 'The Enchantress Arrives',
                    description: 'Meet Smoke Siren and learn about her mystical abilities.',
                    objectives: [
                        { type: 'talk', target: 'smoke_siren', completed: false },
                        { type: 'combat', count: 5, current: 0, completed: false },
                        { type: 'collect', item: 'mystic_herb', count: 3, current: 0, completed: false }
                    ],
                    rewards: {
                        relationship: 50,
                        ability: 'charm_enemies',
                        item: 'enchanted_necklace'
                    }
                },
                {
                    chapter: 2,
                    id: 'ss_quest_2',
                    name: 'Lost Memories',
                    description: 'Help Smoke Siren recover fragments of her past.',
                    unlockRequirement: { relationship: 100 },
                    objectives: [
                        { type: 'explore', biome: 'ethereal_nebula', completed: false },
                        { type: 'defeat_boss', target: 'memory_phantom', completed: false },
                        { type: 'find', item: 'memory_crystal', count: 5, current: 0, completed: false }
                    ],
                    rewards: {
                        relationship: 100,
                        ability: 'smoke_veil',
                        item: 'sirens_tear'
                    }
                },
                {
                    chapter: 3,
                    id: 'ss_quest_3',
                    name: 'The Forbidden Art',
                    description: 'Discover the secret of Smoke Siren\'s forbidden charm magic.',
                    unlockRequirement: { relationship: 300 },
                    objectives: [
                        { type: 'defeat', enemy: 'corrupted_mage', count: 10, current: 0, completed: false },
                        { type: 'craft', item: 'purification_charm', count: 1, completed: false },
                        { type: 'ritual', location: 'ancient_shrine', completed: false }
                    ],
                    rewards: {
                        relationship: 150,
                        ability: 'mass_charm',
                        item: 'forbidden_tome'
                    }
                },
                {
                    chapter: 4,
                    id: 'ss_quest_4',
                    name: 'Confronting the Past',
                    description: 'Face Smoke Siren\'s dark past and help her overcome it.',
                    unlockRequirement: { relationship: 600 },
                    objectives: [
                        { type: 'boss_fight', target: 'shadow_self', completed: false },
                        { type: 'choice', decision: 'forgiveness_or_vengeance', completed: false },
                        { type: 'protect', target: 'smoke_siren', duration: 300, completed: false }
                    ],
                    rewards: {
                        relationship: 200,
                        ability: 'ethereal_dance',
                        item: 'purified_soul_gem'
                    }
                },
                {
                    chapter: 5,
                    id: 'ss_quest_5',
                    name: 'True Connection',
                    description: 'Forge an unbreakable bond with Smoke Siren.',
                    unlockRequirement: { relationship: 1000 },
                    objectives: [
                        { type: 'complete_trials', count: 3, current: 0, completed: false },
                        { type: 'ultimate_boss', target: 'chaos_incarnate', completed: false },
                        { type: 'declaration', completed: false }
                    ],
                    rewards: {
                        relationship: 500,
                        ability: 'soul_bond',
                        item: 'eternal_bond_ring',
                        special: 'romance_unlocked'
                    }
                }
            ],
            
            // Blade Muse Quests
            blade_muse: [
                {
                    chapter: 1,
                    id: 'bm_quest_1',
                    name: 'Dance of Blades',
                    description: 'Train with Blade Muse to learn her acrobatic combat style.',
                    objectives: [
                        { type: 'training', skill: 'blade_dance', completed: false },
                        { type: 'perfect_combo', count: 10, current: 0, completed: false },
                        { type: 'defeat', enemy: 'training_dummy', count: 20, current: 0, completed: false }
                    ],
                    rewards: {
                        relationship: 50,
                        ability: 'whirling_strike',
                        item: 'training_blade'
                    }
                },
                {
                    chapter: 2,
                    id: 'bm_quest_2',
                    name: 'The Wandering Warrior',
                    description: 'Learn about Blade Muse\'s journey as a wandering swordmaster.',
                    unlockRequirement: { relationship: 100 },
                    objectives: [
                        { type: 'visit', location: 'old_dojo', completed: false },
                        { type: 'duel', opponent: 'rival_swordsman', completed: false },
                        { type: 'master', technique: 'phantom_strike', completed: false }
                    ],
                    rewards: {
                        relationship: 100,
                        ability: 'phantom_blade',
                        item: 'master_katana'
                    }
                },
                {
                    chapter: 3,
                    id: 'bm_quest_3',
                    name: 'Honor\'s Price',
                    description: 'Help Blade Muse confront a dishonorable past decision.',
                    unlockRequirement: { relationship: 300 },
                    objectives: [
                        { type: 'investigation', clues: 5, current: 0, completed: false },
                        { type: 'combat_trial', waves: 10, current: 0, completed: false },
                        { type: 'choice', decision: 'honor_or_mercy', completed: false }
                    ],
                    rewards: {
                        relationship: 150,
                        ability: 'honor_strike',
                        item: 'blade_of_redemption'
                    }
                },
                {
                    chapter: 4,
                    id: 'bm_quest_4',
                    name: 'Master and Student',
                    description: 'Prove yourself worthy as Blade Muse\'s equal.',
                    unlockRequirement: { relationship: 600 },
                    objectives: [
                        { type: 'championship', arena: 'warriors_colosseum', completed: false },
                        { type: 'defeat', enemy: 'legendary_swordmaster', completed: false },
                        { type: 'perfect_duel', opponent: 'blade_muse', completed: false }
                    ],
                    rewards: {
                        relationship: 200,
                        ability: 'twin_blade_assault',
                        item: 'legendary_twin_blades'
                    }
                },
                {
                    chapter: 5,
                    id: 'bm_quest_5',
                    name: 'Eternal Dance',
                    description: 'Achieve perfect synchronization with Blade Muse.',
                    unlockRequirement: { relationship: 1000 },
                    objectives: [
                        { type: 'synchronized_combat', kills: 100, current: 0, completed: false },
                        { type: 'raid_boss', target: 'sword_saint_phantom', completed: false },
                        { type: 'ultimate_technique', skill: 'eternal_dance', completed: false }
                    ],
                    rewards: {
                        relationship: 500,
                        ability: 'synchronized_assault',
                        item: 'soul_bound_blades',
                        special: 'combat_synergy_unlocked'
                    }
                }
            ],
            
            // Herb Witch Quests
            herb_witch: [
                {
                    chapter: 1,
                    id: 'hw_quest_1',
                    name: 'Healing Hands',
                    description: 'Learn the basics of alchemical healing from Herb Witch.',
                    objectives: [
                        { type: 'gather', herb: 'healing_herb', count: 10, current: 0, completed: false },
                        { type: 'brew', potion: 'lesser_healing', count: 5, current: 0, completed: false },
                        { type: 'heal', amount: 1000, current: 0, completed: false }
                    ],
                    rewards: {
                        relationship: 50,
                        ability: 'rapid_healing',
                        item: 'apprentice_mortar'
                    }
                },
                {
                    chapter: 2,
                    id: 'hw_quest_2',
                    name: 'The Green Gardens',
                    description: 'Help Herb Witch restore her mystical garden.',
                    unlockRequirement: { relationship: 100 },
                    objectives: [
                        { type: 'plant', seeds: 20, current: 0, completed: false },
                        { type: 'nurture', plants: 15, current: 0, completed: false },
                        { type: 'harvest', rare_herbs: 10, current: 0, completed: false }
                    ],
                    rewards: {
                        relationship: 100,
                        ability: 'nature_blessing',
                        item: 'mystic_garden_deed'
                    }
                },
                {
                    chapter: 3,
                    id: 'hw_quest_3',
                    name: 'Forbidden Elixirs',
                    description: 'Discover the secrets of Herb Witch\'s most powerful brews.',
                    unlockRequirement: { relationship: 300 },
                    objectives: [
                        { type: 'collect', ingredient: 'dragon_essence', count: 1, completed: false },
                        { type: 'collect', ingredient: 'phoenix_feather', count: 1, completed: false },
                        { type: 'brew', potion: 'elixir_of_immortality', count: 1, completed: false }
                    ],
                    rewards: {
                        relationship: 150,
                        ability: 'instant_revival',
                        item: 'grand_alchemist_set'
                    }
                },
                {
                    chapter: 4,
                    id: 'hw_quest_4',
                    name: 'The Blight',
                    description: 'Help Herb Witch cure a devastating magical plague.',
                    unlockRequirement: { relationship: 600 },
                    objectives: [
                        { type: 'cure', infected: 50, current: 0, completed: false },
                        { type: 'boss_fight', target: 'plague_harbinger', completed: false },
                        { type: 'ritual', location: 'world_tree', completed: false }
                    ],
                    rewards: {
                        relationship: 200,
                        ability: 'mass_cure',
                        item: 'staff_of_life'
                    }
                },
                {
                    chapter: 5,
                    id: 'hw_quest_5',
                    name: 'Natures Champion',
                    description: 'Become one with nature alongside Herb Witch.',
                    unlockRequirement: { relationship: 1000 },
                    objectives: [
                        { type: 'ultimate_garden', fully_grown: 100, current: 0, completed: false },
                        { type: 'legendary_boss', target: 'corruption_incarnate', completed: false },
                        { type: 'ascension', aspect: 'nature', completed: false }
                    ],
                    rewards: {
                        relationship: 500,
                        ability: 'natures_wrath',
                        item: 'crown_of_the_green_goddess',
                        special: 'nature_bond_unlocked'
                    }
                }
            ],
            
            // Cyber Dryad Quests
            cyber_dryad: [
                {
                    chapter: 1,
                    id: 'cd_quest_1',
                    name: 'Digital Nature',
                    description: 'Understand the fusion of technology and nature.',
                    objectives: [
                        { type: 'hack', nodes: 10, current: 0, completed: false },
                        { type: 'plant', cyber_seeds: 5, current: 0, completed: false },
                        { type: 'sync', systems: 3, current: 0, completed: false }
                    ],
                    rewards: {
                        relationship: 50,
                        ability: 'tech_vine',
                        item: 'neural_interface'
                    }
                },
                {
                    chapter: 2,
                    id: 'cd_quest_2',
                    name: 'System Corruption',
                    description: 'Help Cyber Dryad purge a virus from her network.',
                    unlockRequirement: { relationship: 100 },
                    objectives: [
                        { type: 'eliminate', viruses: 20, current: 0, completed: false },
                        { type: 'restore', corrupted_data: 15, current: 0, completed: false },
                        { type: 'boss_fight', target: 'virus_core', completed: false }
                    ],
                    rewards: {
                        relationship: 100,
                        ability: 'firewall',
                        item: 'quantum_processor'
                    }
                },
                {
                    chapter: 3,
                    id: 'cd_quest_3',
                    name: 'The Network',
                    description: 'Connect to Cyber Dryad\'s vast digital consciousness.',
                    unlockRequirement: { relationship: 300 },
                    objectives: [
                        { type: 'explore', cyberspace: true, completed: false },
                        { type: 'defeat', ai_guardians: 10, current: 0, completed: false },
                        { type: 'download', knowledge: 100, current: 0, completed: false }
                    ],
                    rewards: {
                        relationship: 150,
                        ability: 'data_stream',
                        item: 'cyber_core'
                    }
                },
                {
                    chapter: 4,
                    id: 'cd_quest_4',
                    name: 'Rogue AI',
                    description: 'Stop a rogue AI threatening the digital ecosystem.',
                    unlockRequirement: { relationship: 600 },
                    objectives: [
                        { type: 'trace', ai_signatures: 5, current: 0, completed: false },
                        { type: 'combat', elite_bots: 25, current: 0, completed: false },
                        { type: 'boss_fight', target: 'rogue_overseer', completed: false }
                    ],
                    rewards: {
                        relationship: 200,
                        ability: 'system_override',
                        item: 'master_control_key'
                    }
                },
                {
                    chapter: 5,
                    id: 'cd_quest_5',
                    name: 'Digital Ascension',
                    description: 'Merge consciousness with Cyber Dryad in the digital realm.',
                    unlockRequirement: { relationship: 1000 },
                    objectives: [
                        { type: 'full_sync', progress: 100, current: 0, completed: false },
                        { type: 'legendary_boss', target: 'chaos_algorithm', completed: false },
                        { type: 'transcendence', realm: 'cyber_nature', completed: false }
                    ],
                    rewards: {
                        relationship: 500,
                        ability: 'perfect_synchronization',
                        item: 'digital_soul_core',
                        special: 'cyber_bond_unlocked'
                    }
                }
            ]
        };
    }
    
    /**
     * Start a companion quest
     */
    startCompanionQuest(companionId, chapter) {
        const companion = this.companions.get(companionId);
        if (!companion) return null;
        
        const questData = this.questDatabase[companionId];
        if (!questData || !questData[chapter - 1]) return null;
        
        const quest = JSON.parse(JSON.stringify(questData[chapter - 1]));
        
        // Check unlock requirement
        if (quest.unlockRequirement) {
            if (quest.unlockRequirement.relationship > companion.relationshipPoints) {
                logger.info(`Quest requires ${quest.unlockRequirement.relationship} relationship points`);
                return null;
            }
        }
        
        quest.startTime = Date.now();
        quest.companionId = companionId;
        quest.active = true;
        
        this.activeQuests.set(quest.id, quest);
        companion.questProgress.set(quest.id, quest);
        
        // Trigger quest start event
        this.triggerQuestEvent('quest_started', { companionId, quest });
        
        return quest;
    }
    
    /**
     * Update quest progress
     */
    updateQuestProgress(questId, objectiveType, data) {
        const quest = this.activeQuests.get(questId);
        if (!quest || !quest.active) return false;
        
        let progressMade = false;
        
        for (const objective of quest.objectives) {
            if (objective.completed) continue;
            if (objective.type !== objectiveType) continue;
            
            switch (objectiveType) {
                case 'defeat':
                case 'collect':
                case 'gather':
                    if (objective.current !== undefined) {
                        objective.current = Math.min(objective.current + (data.amount || 1), objective.count);
                        if (objective.current >= objective.count) {
                            objective.completed = true;
                            progressMade = true;
                        }
                    }
                    break;
                    
                case 'talk':
                case 'explore':
                case 'boss_fight':
                case 'ritual':
                    if (data.matches) {
                        objective.completed = true;
                        progressMade = true;
                    }
                    break;
                    
                case 'choice':
                    objective.decision = data.choice;
                    objective.completed = true;
                    progressMade = true;
                    break;
            }
        }
        
        // Check if all objectives complete
        if (quest.objectives.every(obj => obj.completed)) {
            this.completeQuest(questId);
        }
        
        return progressMade;
    }
    
    /**
     * Complete a quest and award rewards
     */
    completeQuest(questId) {
        const quest = this.activeQuests.get(questId);
        if (!quest) return;
        
        const companion = this.companions.get(quest.companionId);
        if (!companion) return;
        
        // Award relationship points
        this.addRelationship(quest.companionId, quest.rewards.relationship);
        
        // Unlock ability
        if (quest.rewards.ability) {
            companion.unlockedAbilities.push(quest.rewards.ability);
            this.triggerQuestEvent('ability_unlocked', { 
                companionId: quest.companionId, 
                ability: quest.rewards.ability 
            });
        }
        
        // Award item
        if (quest.rewards.item && this.gameEngine.inventorySystem) {
            this.gameEngine.inventorySystem.addItem(quest.rewards.item);
        }
        
        // Handle special rewards
        if (quest.rewards.special) {
            this.handleSpecialReward(quest.companionId, quest.rewards.special);
        }
        
        // Mark quest complete
        quest.active = false;
        quest.completedTime = Date.now();
        this.completedQuests.add(questId);
        this.activeQuests.delete(questId);
        
        // Progress personal story
        companion.personalStory.chapter = quest.chapter + 1;
        if (companion.personalStory.chapter > companion.personalStory.maxChapters) {
            companion.personalStory.completed = true;
            this.triggerQuestEvent('story_completed', { companionId: quest.companionId });
        }
        
        // Trigger completion event
        this.triggerQuestEvent('quest_completed', { companionId: quest.companionId, quest });
        
        // Auto-start next chapter quest if available
        if (!companion.personalStory.completed) {
            setTimeout(() => {
                this.startCompanionQuest(quest.companionId, companion.personalStory.chapter);
            }, 1000);
        }
    }
    
    /**
     * Add relationship points
     */
    addRelationship(companionId, points) {
        const companion = this.companions.get(companionId);
        if (!companion) return;
        
        const oldLevel = this.getRelationshipLevel(companion.relationshipPoints);
        companion.relationshipPoints += points;
        const newLevel = this.getRelationshipLevel(companion.relationshipPoints);
        
        this.relationshipLevels.set(companionId, companion.relationshipPoints);
        
        // Check for level up
        if (oldLevel !== newLevel) {
            companion.relationshipLevel = newLevel;
            this.triggerQuestEvent('relationship_level_up', { 
                companionId, 
                newLevel,
                bonuses: this.questConfig.relationshipBonuses[newLevel]
            });
            
            // Apply stat bonuses
            this.applyRelationshipBonuses(companionId, newLevel);
        }
    }
    
    /**
     * Get relationship level from points
     */
    getRelationshipLevel(points) {
        const thresholds = this.questConfig.relationshipThresholds;
        if (points >= thresholds.soulmate) return 'soulmate';
        if (points >= thresholds.trusted_ally) return 'trusted_ally';
        if (points >= thresholds.close_friend) return 'close_friend';
        if (points >= thresholds.friend) return 'friend';
        return 'acquaintance';
    }
    
    /**
     * Apply relationship bonuses to companion
     */
    applyRelationshipBonuses(companionId, level) {
        const bonuses = this.questConfig.relationshipBonuses[level];
        if (!bonuses) return;
        
        // Apply stat multiplier and unlock abilities
        if (this.gameEngine.companionManager) {
            this.gameEngine.companionManager.applyRelationshipBonus(companionId, bonuses);
        }
    }
    
    /**
     * Handle special quest rewards
     */
    handleSpecialReward(companionId, rewardType) {
        switch (rewardType) {
            case 'romance_unlocked':
                const companion = this.companions.get(companionId);
                if (companion) {
                    companion.romanceUnlocked = true;
                    this.triggerQuestEvent('romance_available', { companionId });
                }
                break;
                
            case 'combat_synergy_unlocked':
                if (this.gameEngine.combatSystem) {
                    this.gameEngine.combatSystem.enableSynergy(companionId);
                }
                break;
                
            case 'nature_bond_unlocked':
            case 'cyber_bond_unlocked':
                // Special bond abilities
                break;
        }
    }
    
    /**
     * Trigger quest event
     */
    triggerQuestEvent(eventType, data) {
        if (this.gameEngine.eventSystem) {
            this.gameEngine.eventSystem.emit('companion_quest', { type: eventType, ...data });
        }
        logger.info(`[CompanionQuest] ${eventType}:`, data);
    }
    
    /**
     * Get active quests for a companion
     */
    getCompanionQuests(companionId) {
        const quests = [];
        for (const [questId, quest] of this.activeQuests) {
            if (quest.companionId === companionId && quest.active) {
                quests.push(quest);
            }
        }
        return quests;
    }
    
    /**
     * Get companion relationship info
     */
    getRelationshipInfo(companionId) {
        const companion = this.companions.get(companionId);
        if (!companion) return null;
        
        return {
            points: companion.relationshipPoints,
            level: companion.relationshipLevel,
            nextLevel: this.getNextRelationshipThreshold(companion.relationshipPoints),
            unlockedAbilities: companion.unlockedAbilities,
            storyProgress: companion.personalStory
        };
    }
    
    /**
     * Get next relationship threshold
     */
    getNextRelationshipThreshold(currentPoints) {
        const thresholds = Object.values(this.questConfig.relationshipThresholds).sort((a, b) => a - b);
        for (const threshold of thresholds) {
            if (currentPoints < threshold) {
                return threshold;
            }
        }
        return null; // Max level reached
    }
    
    /**
     * Update system
     */
    update(deltaTime) {
        // Check for quest objective completion based on game state
        for (const [questId, quest] of this.activeQuests) {
            if (!quest.active) continue;
            
            // Auto-check certain objectives
            for (const objective of quest.objectives) {
                if (objective.completed) continue;
                
                // Check time-based objectives
                if (objective.type === 'protect' && objective.duration) {
                    if (!objective.startTime) {
                        objective.startTime = Date.now();
                    }
                    const elapsed = (Date.now() - objective.startTime) / 1000;
                    if (elapsed >= objective.duration) {
                        objective.completed = true;
                    }
                }
            }
        }
    }
}
