import { logger } from '../core/Logger.js';
/**
 * Quest Campaign System - Phase 9 Content Expansion
 * Manages story campaigns, quest chains, and narrative progression
 * Uses external Kenney UI assets and Mixamo character animations
 */

export class QuestCampaignSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Campaign chapters with anime-styled narratives
        this.campaigns = this.initializeCampaigns();
        this.activeQuests = [];
        this.completedQuests = new Set();
        this.currentChapter = 1;
        
        // Quest tracking
        this.questProgress = new Map();
        this.questObjectives = new Map();
        
        this.init();
    }
    
    init() {
        logger.info('📖 Initializing Quest Campaign System...');
        logger.info('✅ Quest Campaign System initialized with', Object.keys(this.campaigns).length, 'campaigns');
    }
    
    /**
     * Initialize campaign storylines
     */
    initializeCampaigns() {
        return {
            MAIN_STORY: {
                name: 'The Emberveil Prophecy',
                description: 'Uncover the ancient prophecy and save the realm from darkness',
                color: '#FF00FF',
                chapters: [
                    {
                        id: 'CHAPTER_1',
                        name: 'Awakening',
                        description: 'Your journey begins in the village of Emberfall',
                        quests: [
                            {
                                id: 'QUEST_1_1',
                                name: 'A New Beginning',
                                description: 'Meet the village elder and learn about your destiny',
                                objectives: [
                                    { type: 'TALK_TO_NPC', target: 'ELDER_MARCUS', count: 1 },
                                    { type: 'EXPLORE_AREA', target: 'VILLAGE_SQUARE', count: 1 }
                                ],
                                rewards: { xp: 100, gold: 50, items: ['STARTER_SWORD'] },
                                externalAssets: {
                                    npc: 'Mixamo/elder_character',
                                    cutscene: 'cinematic_intro'
                                }
                            },
                            {
                                id: 'QUEST_1_2',
                                name: 'First Steps',
                                description: 'Learn basic combat by defeating slimes',
                                objectives: [
                                    { type: 'KILL_ENEMIES', target: 'SLIME', count: 10 },
                                    { type: 'COLLECT_ITEMS', target: 'SLIME_GEL', count: 5 }
                                ],
                                rewards: { xp: 150, gold: 75, items: ['HEALTH_POTION'] }
                            },
                            {
                                id: 'QUEST_1_3',
                                name: 'The Dark Forest',
                                description: 'Investigate strange occurrences in the nearby forest',
                                objectives: [
                                    { type: 'EXPLORE_AREA', target: 'DARK_FOREST', count: 1 },
                                    { type: 'KILL_ENEMIES', target: 'WOLF', count: 5 },
                                    { type: 'FIND_CLUE', target: 'MYSTERIOUS_SYMBOL', count: 1 }
                                ],
                                rewards: { xp: 200, gold: 100, items: ['FOREST_BOW'] }
                            }
                        ]
                    },
                    {
                        id: 'CHAPTER_2',
                        name: 'Rising Darkness',
                        description: 'Dark forces emerge from the shadows',
                        quests: [
                            {
                                id: 'QUEST_2_1',
                                name: 'Shadow Cultists',
                                description: 'Stop the cultists from performing a dark ritual',
                                objectives: [
                                    { type: 'KILL_ENEMIES', target: 'CULTIST', count: 15 },
                                    { type: 'DESTROY_OBJECT', target: 'RITUAL_ALTAR', count: 3 }
                                ],
                                rewards: { xp: 300, gold: 150, items: ['SHADOW_DAGGER'] }
                            },
                            {
                                id: 'QUEST_2_2',
                                name: 'The First Boss',
                                description: 'Defeat the Cultist Leader',
                                objectives: [
                                    { type: 'KILL_BOSS', target: 'CULTIST_LEADER', count: 1 }
                                ],
                                rewards: { xp: 500, gold: 300, items: ['LEGENDARY_ARMOR'] },
                                externalAssets: {
                                    boss: 'Mixamo/cultist_boss',
                                    arena: 'Quaternius/dark_temple'
                                }
                            }
                        ]
                    },
                    {
                        id: 'CHAPTER_3',
                        name: 'The Crystal Caves',
                        description: 'Discover the ancient crystals of power',
                        quests: [
                            {
                                id: 'QUEST_3_1',
                                name: 'Into the Depths',
                                description: 'Navigate the treacherous crystal caves',
                                objectives: [
                                    { type: 'EXPLORE_AREA', target: 'CRYSTAL_CAVES', count: 1 },
                                    { type: 'COLLECT_ITEMS', target: 'MAGIC_CRYSTAL', count: 10 }
                                ],
                                rewards: { xp: 400, gold: 200, items: ['CRYSTAL_STAFF'] }
                            }
                        ]
                    }
                ]
            },
            
            SIDE_STORY_MAGE: {
                name: 'The Arcane Mysteries',
                description: 'Master the arcane arts and uncover magical secrets',
                color: '#9900FF',
                requiredClass: 'MAGE',
                chapters: [
                    {
                        id: 'MAGE_1',
                        name: 'Apprentice Trials',
                        description: 'Prove your worth to the Mage Guild',
                        quests: [
                            {
                                id: 'MAGE_QUEST_1',
                                name: 'Elemental Mastery',
                                description: 'Demonstrate control over fire, ice, and lightning',
                                objectives: [
                                    { type: 'CAST_SPELL', target: 'FIREBALL', count: 20 },
                                    { type: 'CAST_SPELL', target: 'ICE_SHARD', count: 20 },
                                    { type: 'CAST_SPELL', target: 'LIGHTNING_BOLT', count: 20 }
                                ],
                                rewards: { xp: 300, gold: 150, items: ['ARCANE_TOME'] }
                            }
                        ]
                    }
                ]
            },
            
            SIDE_STORY_WARRIOR: {
                name: 'Path of the Blade',
                description: 'Become a legendary warrior',
                color: '#FF0066',
                requiredClass: 'WARRIOR',
                chapters: [
                    {
                        id: 'WARRIOR_1',
                        name: 'Trial by Combat',
                        description: 'Prove your strength in battle',
                        quests: [
                            {
                                id: 'WARRIOR_QUEST_1',
                                name: 'Arena Champion',
                                description: 'Win 10 arena battles',
                                objectives: [
                                    { type: 'WIN_ARENA_BATTLE', count: 10 }
                                ],
                                rewards: { xp: 300, gold: 150, items: ['CHAMPIONS_SWORD'] }
                            }
                        ]
                    }
                ]
            },
            
            SEASONAL_SPRING: {
                name: 'Festival of Blossoms',
                description: 'Celebrate the spring festival with special quests',
                color: '#FF69B4',
                seasonal: true,
                season: 'SPRING',
                chapters: [
                    {
                        id: 'SPRING_1',
                        name: 'Cherry Blossom Festival',
                        description: 'Help prepare for the festival',
                        quests: [
                            {
                                id: 'SPRING_QUEST_1',
                                name: 'Flower Gathering',
                                description: 'Collect cherry blossoms for decorations',
                                objectives: [
                                    { type: 'COLLECT_ITEMS', target: 'CHERRY_BLOSSOM', count: 50 }
                                ],
                                rewards: { xp: 200, gold: 100, items: ['FESTIVAL_HAT'] }
                            }
                        ]
                    }
                ]
            },
            
            DAILY_BOUNTIES: {
                name: 'Daily Bounties',
                description: 'Complete daily bounty quests for rewards',
                color: '#FFFF00',
                daily: true,
                chapters: [
                    {
                        id: 'DAILY_1',
                        name: 'Monster Hunting',
                        description: 'Hunt down dangerous monsters',
                        quests: [
                            {
                                id: 'DAILY_BOUNTY_1',
                                name: 'Goblin Extermination',
                                description: 'Defeat 20 goblins',
                                objectives: [
                                    { type: 'KILL_ENEMIES', target: 'GOBLIN', count: 20 }
                                ],
                                rewards: { xp: 150, gold: 100 },
                                repeatable: true,
                                resetDaily: true
                            }
                        ]
                    }
                ]
            }
        };
    }
    
    /**
     * Start a quest
     */
    startQuest(questId) {
        const quest = this.findQuest(questId);
        if (!quest) {
            logger.warn(`Quest not found: ${questId}`);
            return false;
        }
        
        // Check if already active
        if (this.activeQuests.some(q => q.id === questId)) {
            logger.info('Quest already active');
            return false;
        }
        
        // Check if completed (non-repeatable)
        if (this.completedQuests.has(questId) && !quest.repeatable) {
            logger.info('Quest already completed');
            return false;
        }
        
        // Initialize quest progress
        this.questProgress.set(questId, {
            objectives: quest.objectives.map(obj => ({ ...obj, current: 0 })),
            startTime: Date.now()
        });
        
        this.activeQuests.push({ id: questId, ...quest });
        
        logger.info(`📜 Quest started: ${quest.name}`);
        
        // Create magical effect
        if (this.gameEngine.magicalBackgroundSystem) {
            this.gameEngine.magicalBackgroundSystem.createSparkBurst(
                { x: 0, y: 2, z: 0 },
                '#FFFF00',
                50
            );
        }
        
        return true;
    }
    
    /**
     * Update quest progress
     */
    updateQuestProgress(questId, objectiveType, target, amount = 1) {
        const progress = this.questProgress.get(questId);
        if (!progress) return;
        
        let completed = false;
        
        progress.objectives.forEach(obj => {
            if (obj.type === objectiveType && obj.target === target) {
                obj.current = Math.min(obj.current + amount, obj.count);
                
                if (obj.current >= obj.count && !obj.completed) {
                    obj.completed = true;
                    logger.info(`✅ Objective completed: ${obj.type} ${obj.target}`);
                }
            }
        });
        
        // Check if all objectives complete
        if (progress.objectives.every(obj => obj.completed)) {
            this.completeQuest(questId);
            completed = true;
        }
        
        return completed;
    }
    
    /**
     * Complete a quest
     */
    completeQuest(questId) {
        const questIndex = this.activeQuests.findIndex(q => q.id === questId);
        if (questIndex === -1) return;
        
        const quest = this.activeQuests[questIndex];
        
        // Grant rewards
        if (quest.rewards) {
            if (quest.rewards.xp && this.gameEngine.player) {
                this.gameEngine.player.gainXP(quest.rewards.xp);
            }
            if (quest.rewards.gold && this.gameEngine.player) {
                this.gameEngine.player.gold += quest.rewards.gold;
            }
            if (quest.rewards.items) {
                quest.rewards.items.forEach(itemId => {
                    logger.info(`🎁 Reward: ${itemId}`);
                });
            }
        }
        
        // Mark as completed
        this.completedQuests.add(questId);
        this.activeQuests.splice(questIndex, 1);
        this.questProgress.delete(questId);
        
        logger.info(`🎉 Quest completed: ${quest.name}!`);
        
        // Create completion effect
        if (this.gameEngine.magicalBackgroundSystem) {
            this.gameEngine.magicalBackgroundSystem.createSparkBurst(
                { x: 0, y: 3, z: 0 },
                '#00FF00',
                100
            );
        }
    }
    
    /**
     * Find a quest by ID
     */
    findQuest(questId) {
        for (const campaign of Object.values(this.campaigns)) {
            for (const chapter of campaign.chapters) {
                const quest = chapter.quests.find(q => q.id === questId);
                if (quest) return quest;
            }
        }
        return null;
    }
    
    /**
     * Get available quests
     */
    getAvailableQuests() {
        const available = [];
        
        Object.values(this.campaigns).forEach(campaign => {
            // Check seasonal requirements
            if (campaign.seasonal && campaign.season !== this.getCurrentSeason()) {
                return;
            }
            
            // Check class requirements
            if (campaign.requiredClass && this.gameEngine.player) {
                if (this.gameEngine.player.class !== campaign.requiredClass) {
                    return;
                }
            }
            
            campaign.chapters.forEach(chapter => {
                chapter.quests.forEach(quest => {
                    // Skip if already active
                    if (this.activeQuests.some(q => q.id === quest.id)) return;
                    
                    // Skip if completed (non-repeatable)
                    if (this.completedQuests.has(quest.id) && !quest.repeatable) return;
                    
                    available.push({
                        campaignName: campaign.name,
                        chapterName: chapter.name,
                        ...quest
                    });
                });
            });
        });
        
        return available;
    }
    
    /**
     * Get current season
     */
    getCurrentSeason() {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'SPRING';
        if (month >= 5 && month <= 7) return 'SUMMER';
        if (month >= 8 && month <= 10) return 'FALL';
        return 'WINTER';
    }
    
    /**
     * Get quest progress
     */
    getQuestProgress(questId) {
        return this.questProgress.get(questId);
    }
    
    /**
     * Update quest system
     */
    update(deltaTime) {
        // Reset daily quests at midnight
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            this.resetDailyQuests();
        }
    }
    
    /**
     * Reset daily quests
     */
    resetDailyQuests() {
        Object.values(this.campaigns).forEach(campaign => {
            if (campaign.daily) {
                campaign.chapters.forEach(chapter => {
                    chapter.quests.forEach(quest => {
                        if (quest.resetDaily) {
                            this.completedQuests.delete(quest.id);
                        }
                    });
                });
            }
        });
        logger.info('🔄 Daily quests reset');
    }
}
