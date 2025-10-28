/**
 * GuildSystem.js
 * Handles guild/clan creation, management, quests, and bonuses
 * Part of Phase 6: Social & Leaderboards
 * Cannabis theme: "Smoke Circles" - collectives of growers
 */

export class GuildSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Guild data
        this.guilds = new Map();
        this.playerGuild = null;
        this.guildInvites = [];
        
        // Guild ranks
        this.ranks = {
            seedling: { name: 'Seedling', level: 1, permissions: ['chat'] },
            cultivator: { name: 'Cultivator', level: 2, permissions: ['chat', 'invite'] },
            grower: { name: 'Grower', level: 3, permissions: ['chat', 'invite', 'kick'] },
            master_grower: { name: 'Master Grower', level: 4, permissions: ['chat', 'invite', 'kick', 'promote', 'edit'] },
            founder: { name: 'Founder', level: 5, permissions: ['all'] }
        };
        
        // Guild perks
        this.guildPerks = this.initializePerks();
        
        // Guild quests
        this.guildQuests = [];
        this.guildQuestTemplates = this.initializeGuildQuests();
    }
    
    /**
     * Initialize guild perks
     */
    initializePerks() {
        return {
            experience_boost: {
                name: 'Collective Growth',
                description: 'All members gain bonus XP',
                maxLevel: 10,
                bonusPerLevel: 0.05, // 5% per level
                cost: (level) => 1000 * level
            },
            loot_boost: {
                name: 'Shared Harvest',
                description: 'Increased loot drop chance',
                maxLevel: 10,
                bonusPerLevel: 0.03, // 3% per level
                cost: (level) => 1500 * level
            },
            crafting_speed: {
                name: 'Workshop Efficiency',
                description: 'Faster crafting times',
                maxLevel: 5,
                bonusPerLevel: 0.1, // 10% per level
                cost: (level) => 2000 * level
            },
            storage_capacity: {
                name: 'Guild Vault',
                description: 'Shared storage space',
                maxLevel: 20,
                bonusPerLevel: 10, // 10 slots per level
                cost: (level) => 500 * level
            },
            discount_merchant: {
                name: 'Bulk Purchase',
                description: 'Discount at all merchants',
                maxLevel: 5,
                bonusPerLevel: 0.05, // 5% per level
                cost: (level) => 3000 * level
            }
        };
    }
    
    /**
     * Initialize guild quest templates
     */
    initializeGuildQuests() {
        return [
            {
                id: 'guild_harvest',
                name: 'Collective Harvest',
                description: 'Guild members collectively gather materials',
                type: 'collection',
                goal: {
                    materials: {
                        'essence_shard': 500,
                        'mystical_ore': 200,
                        'corrupted_crystal': 100
                    }
                },
                duration: 604800000, // 1 week
                rewards: {
                    gold: 10000,
                    guildXP: 500,
                    perk_points: 2
                }
            },
            {
                id: 'guild_boss_hunt',
                name: 'Boss Extermination',
                description: 'Defeat bosses as a guild',
                type: 'boss_kills',
                goal: {
                    boss_kills: 50
                },
                duration: 604800000,
                rewards: {
                    gold: 15000,
                    guildXP: 750,
                    perk_points: 3
                }
            },
            {
                id: 'guild_floor_push',
                name: 'Depth Exploration',
                description: 'Reach high floors collectively',
                type: 'floor_progression',
                goal: {
                    total_floors: 1000 // Sum of all members
                },
                duration: 604800000,
                rewards: {
                    gold: 20000,
                    guildXP: 1000,
                    perk_points: 5
                }
            },
            {
                id: 'guild_crafting',
                name: 'Master Craftsmen',
                description: 'Craft high quality items',
                type: 'crafting',
                goal: {
                    items_crafted: 100,
                    min_rarity: 'rare'
                },
                duration: 604800000,
                rewards: {
                    gold: 12000,
                    guildXP: 600,
                    perk_points: 2
                }
            }
        ];
    }
    
    /**
     * Create a new guild
     */
    createGuild(guildName, emblem, motto) {
        // Validation
        if (!guildName || guildName.length < 3 || guildName.length > 30) {
            return { success: false, reason: 'Guild name must be 3-30 characters' };
        }
        
        // Check if name is taken
        for (const guild of this.guilds.values()) {
            if (guild.name.toLowerCase() === guildName.toLowerCase()) {
                return { success: false, reason: 'Guild name already taken' };
            }
        }
        
        // Check if player is already in a guild
        if (this.playerGuild) {
            return { success: false, reason: 'Already in a guild' };
        }
        
        // Cost to create
        const creationCost = 5000;
        if (this.gameEngine.economySystem?.getCurrency('gold') < creationCost) {
            return { success: false, reason: 'Not enough gold (5000 required)' };
        }
        
        // Create guild
        const guild = {
            id: `guild_${Date.now()}`,
            name: guildName,
            emblem: emblem || '🌿',
            motto: motto || 'Smoke together, grow together',
            founder: 'player',
            createdAt: Date.now(),
            level: 1,
            experience: 0,
            members: [
                {
                    id: 'player',
                    name: 'Player',
                    rank: 'founder',
                    joinedAt: Date.now(),
                    contribution: 0
                }
            ],
            bank: {
                gold: 0,
                materials: new Map(),
                items: []
            },
            perks: {
                experience_boost: 0,
                loot_boost: 0,
                crafting_speed: 0,
                storage_capacity: 1,
                discount_merchant: 0
            },
            perkPoints: 0,
            activeQuests: [],
            completedQuests: [],
            chatLog: []
        };
        
        this.guilds.set(guild.id, guild);
        this.playerGuild = guild.id;
        
        // Consume gold
        if (this.gameEngine.economySystem) {
            this.gameEngine.economySystem.removeCurrency('gold', creationCost);
        }
        
        console.log(`🌿 Created Smoke Circle: ${guildName}!`);
        
        return { success: true, guild };
    }
    
    /**
     * Join a guild
     */
    joinGuild(guildId) {
        const guild = this.guilds.get(guildId);
        if (!guild) {
            return { success: false, reason: 'Guild not found' };
        }
        
        if (this.playerGuild) {
            return { success: false, reason: 'Already in a guild' };
        }
        
        if (guild.members.length >= 50) {
            return { success: false, reason: 'Guild is full' };
        }
        
        // Add member
        guild.members.push({
            id: 'player',
            name: 'Player',
            rank: 'seedling',
            joinedAt: Date.now(),
            contribution: 0
        });
        
        this.playerGuild = guildId;
        
        console.log(`🌿 Joined ${guild.name}!`);
        
        return { success: true, guild };
    }
    
    /**
     * Leave guild
     */
    leaveGuild() {
        if (!this.playerGuild) {
            return { success: false, reason: 'Not in a guild' };
        }
        
        const guild = this.guilds.get(this.playerGuild);
        const memberIndex = guild.members.findIndex(m => m.id === 'player');
        
        if (memberIndex === -1) {
            return { success: false, reason: 'Member not found' };
        }
        
        const member = guild.members[memberIndex];
        
        // Founder cannot leave, must disband
        if (member.rank === 'founder') {
            return { success: false, reason: 'Founder must disband guild' };
        }
        
        guild.members.splice(memberIndex, 1);
        this.playerGuild = null;
        
        console.log(`Left ${guild.name}`);
        
        return { success: true };
    }
    
    /**
     * Disband guild (founder only)
     */
    disbandGuild() {
        if (!this.playerGuild) {
            return { success: false, reason: 'Not in a guild' };
        }
        
        const guild = this.guilds.get(this.playerGuild);
        const member = guild.members.find(m => m.id === 'player');
        
        if (member.rank !== 'founder') {
            return { success: false, reason: 'Only founder can disband' };
        }
        
        this.guilds.delete(this.playerGuild);
        this.playerGuild = null;
        
        console.log(`🌿 Disbanded guild`);
        
        return { success: true };
    }
    
    /**
     * Contribute to guild bank
     */
    contribute(contribution) {
        if (!this.playerGuild) {
            return { success: false, reason: 'Not in a guild' };
        }
        
        const guild = this.guilds.get(this.playerGuild);
        const member = guild.members.find(m => m.id === 'player');
        
        if (contribution.gold) {
            if (this.gameEngine.economySystem?.getCurrency('gold') < contribution.gold) {
                return { success: false, reason: 'Not enough gold' };
            }
            
            this.gameEngine.economySystem.removeCurrency('gold', contribution.gold);
            guild.bank.gold += contribution.gold;
            member.contribution += contribution.gold;
        }
        
        if (contribution.materials) {
            for (const [materialId, amount] of Object.entries(contribution.materials)) {
                if (this.gameEngine.craftingSystem?.getMaterialCount(materialId) < amount) {
                    return { success: false, reason: `Not enough ${materialId}` };
                }
                
                this.gameEngine.craftingSystem.removeMaterial(materialId, amount);
                const current = guild.bank.materials.get(materialId) || 0;
                guild.bank.materials.set(materialId, current + amount);
                member.contribution += amount * 10; // 10 contribution per material
            }
        }
        
        return { success: true, contribution: member.contribution };
    }
    
    /**
     * Withdraw from guild bank
     */
    withdraw(withdrawal, requesterId = 'player') {
        if (!this.playerGuild) {
            return { success: false, reason: 'Not in a guild' };
        }
        
        const guild = this.guilds.get(this.playerGuild);
        const member = guild.members.find(m => m.id === requesterId);
        
        // Check permissions (grower rank or higher)
        if (this.ranks[member.rank].level < 3) {
            return { success: false, reason: 'Insufficient rank' };
        }
        
        if (withdrawal.gold) {
            if (guild.bank.gold < withdrawal.gold) {
                return { success: false, reason: 'Not enough gold in bank' };
            }
            
            guild.bank.gold -= withdrawal.gold;
            if (this.gameEngine.economySystem) {
                this.gameEngine.economySystem.addCurrency('gold', withdrawal.gold);
            }
        }
        
        if (withdrawal.materials) {
            for (const [materialId, amount] of Object.entries(withdrawal.materials)) {
                const available = guild.bank.materials.get(materialId) || 0;
                if (available < amount) {
                    return { success: false, reason: `Not enough ${materialId}` };
                }
                
                guild.bank.materials.set(materialId, available - amount);
                if (this.gameEngine.craftingSystem) {
                    this.gameEngine.craftingSystem.addMaterial(materialId, amount);
                }
            }
        }
        
        return { success: true };
    }
    
    /**
     * Upgrade guild perk
     */
    upgradePerk(perkId) {
        if (!this.playerGuild) {
            return { success: false, reason: 'Not in a guild' };
        }
        
        const guild = this.guilds.get(this.playerGuild);
        const member = guild.members.find(m => m.id === 'player');
        
        // Check permissions
        if (this.ranks[member.rank].level < 4) {
            return { success: false, reason: 'Insufficient rank (Master Grower required)' };
        }
        
        const perk = this.guildPerks[perkId];
        if (!perk) {
            return { success: false, reason: 'Perk not found' };
        }
        
        const currentLevel = guild.perks[perkId] || 0;
        
        if (currentLevel >= perk.maxLevel) {
            return { success: false, reason: 'Perk at max level' };
        }
        
        const cost = perk.cost(currentLevel + 1);
        
        if (guild.bank.gold < cost) {
            return { success: false, reason: 'Not enough gold in guild bank' };
        }
        
        if (guild.perkPoints <= 0) {
            return { success: false, reason: 'No perk points available' };
        }
        
        // Upgrade
        guild.bank.gold -= cost;
        guild.perks[perkId] = currentLevel + 1;
        guild.perkPoints--;
        
        console.log(`🌿 Upgraded ${perk.name} to level ${guild.perks[perkId]}`);
        
        return { success: true, level: guild.perks[perkId] };
    }
    
    /**
     * Start guild quest
     */
    startGuildQuest(questTemplateId) {
        if (!this.playerGuild) {
            return { success: false, reason: 'Not in a guild' };
        }
        
        const guild = this.guilds.get(this.playerGuild);
        const template = this.guildQuestTemplates.find(q => q.id === questTemplateId);
        
        if (!template) {
            return { success: false, reason: 'Quest not found' };
        }
        
        // Check if already active
        if (guild.activeQuests.find(q => q.templateId === questTemplateId)) {
            return { success: false, reason: 'Quest already active' };
        }
        
        const quest = {
            id: `quest_${Date.now()}`,
            templateId: template.id,
            name: template.name,
            description: template.description,
            type: template.type,
            goal: { ...template.goal },
            progress: {},
            startedAt: Date.now(),
            expiresAt: Date.now() + template.duration,
            rewards: template.rewards
        };
        
        // Initialize progress
        if (template.type === 'collection') {
            quest.progress = Object.keys(template.goal.materials).reduce((acc, mat) => {
                acc[mat] = 0;
                return acc;
            }, {});
        } else {
            quest.progress = { count: 0 };
        }
        
        guild.activeQuests.push(quest);
        
        console.log(`🌿 Started guild quest: ${quest.name}`);
        
        return { success: true, quest };
    }
    
    /**
     * Update guild quest progress
     */
    updateQuestProgress(type, data) {
        if (!this.playerGuild) return;
        
        const guild = this.guilds.get(this.playerGuild);
        
        for (const quest of guild.activeQuests) {
            if (quest.type === type) {
                if (type === 'collection' && data.material) {
                    quest.progress[data.material] = (quest.progress[data.material] || 0) + data.amount;
                } else if (type === 'boss_kills') {
                    quest.progress.count = (quest.progress.count || 0) + 1;
                } else if (type === 'floor_progression' && data.floor) {
                    quest.progress.count = (quest.progress.count || 0) + 1;
                } else if (type === 'crafting' && data.rarity) {
                    const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
                    if (rarityOrder.indexOf(data.rarity) >= rarityOrder.indexOf(quest.goal.min_rarity)) {
                        quest.progress.count = (quest.progress.count || 0) + 1;
                    }
                }
                
                // Check completion
                this.checkQuestCompletion(quest);
            }
        }
    }
    
    /**
     * Check if quest is complete
     */
    checkQuestCompletion(quest) {
        const guild = this.guilds.get(this.playerGuild);
        let isComplete = false;
        
        if (quest.type === 'collection') {
            isComplete = Object.entries(quest.goal.materials).every(([mat, required]) => {
                return (quest.progress[mat] || 0) >= required;
            });
        } else if (quest.type === 'boss_kills') {
            isComplete = quest.progress.count >= quest.goal.boss_kills;
        } else if (quest.type === 'floor_progression') {
            isComplete = quest.progress.count >= quest.goal.total_floors;
        } else if (quest.type === 'crafting') {
            isComplete = quest.progress.count >= quest.goal.items_crafted;
        }
        
        if (isComplete) {
            this.completeGuildQuest(quest);
        }
    }
    
    /**
     * Complete guild quest
     */
    completeGuildQuest(quest) {
        const guild = this.guilds.get(this.playerGuild);
        
        // Remove from active
        const index = guild.activeQuests.indexOf(quest);
        if (index > -1) {
            guild.activeQuests.splice(index, 1);
        }
        
        // Add to completed
        quest.completedAt = Date.now();
        guild.completedQuests.push(quest);
        
        // Grant rewards
        if (quest.rewards.gold) {
            guild.bank.gold += quest.rewards.gold;
        }
        
        if (quest.rewards.guildXP) {
            guild.experience += quest.rewards.guildXP;
            this.checkGuildLevelUp(guild);
        }
        
        if (quest.rewards.perk_points) {
            guild.perkPoints += quest.rewards.perk_points;
        }
        
        console.log(`🌿 Completed guild quest: ${quest.name}!`);
    }
    
    /**
     * Check guild level up
     */
    checkGuildLevelUp(guild) {
        const expNeeded = guild.level * 1000;
        
        if (guild.experience >= expNeeded) {
            guild.level++;
            guild.experience -= expNeeded;
            guild.perkPoints += 2; // 2 perk points per level
            
            console.log(`🌿 Guild leveled up to ${guild.level}!`);
        }
    }
    
    /**
     * Get guild info
     */
    getGuildInfo(guildId) {
        const guild = this.guilds.get(guildId || this.playerGuild);
        if (!guild) return null;
        
        return {
            ...guild,
            memberCount: guild.members.length,
            activePerkBonuses: this.getActivePerkBonuses(guild)
        };
    }
    
    /**
     * Get active perk bonuses
     */
    getActivePerkBonuses(guild) {
        const bonuses = {};
        
        for (const [perkId, level] of Object.entries(guild.perks)) {
            if (level > 0) {
                const perk = this.guildPerks[perkId];
                bonuses[perkId] = perk.bonusPerLevel * level;
            }
        }
        
        return bonuses;
    }
    
    /**
     * Save system state
     */
    save() {
        return {
            guilds: Array.from(this.guilds.entries()).map(([id, guild]) => [
                id,
                {
                    ...guild,
                    bank: {
                        ...guild.bank,
                        materials: Array.from(guild.bank.materials.entries())
                    }
                }
            ]),
            playerGuild: this.playerGuild,
            guildInvites: this.guildInvites
        };
    }
    
    /**
     * Load system state
     */
    load(data) {
        if (!data) return;
        
        if (data.guilds) {
            this.guilds = new Map(data.guilds.map(([id, guild]) => [
                id,
                {
                    ...guild,
                    bank: {
                        ...guild.bank,
                        materials: new Map(guild.bank.materials)
                    }
                }
            ]));
        }
        
        if (data.playerGuild) {
            this.playerGuild = data.playerGuild;
        }
        
        if (data.guildInvites) {
            this.guildInvites = data.guildInvites;
        }
    }
    
    /**
     * Update system (called each frame)
     */
    update(deltaTime) {
        if (!this.playerGuild) return;
        
        const guild = this.guilds.get(this.playerGuild);
        if (!guild) return;
        
        // Check quest expirations
        const now = Date.now();
        guild.activeQuests = guild.activeQuests.filter(quest => {
            if (now > quest.expiresAt) {
                console.log(`🌿 Guild quest expired: ${quest.name}`);
                return false;
            }
            return true;
        });
    }
}
